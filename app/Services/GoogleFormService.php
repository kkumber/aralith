<?php

namespace App\Services;

use App\Models\Quizzes;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Google Form Export Service
 * 
 * Handles exporting Laravel quizzes to Google Forms via Google Apps Script
 * Supports all question types including Mixed questions with sub-questions
 */
class GoogleFormService
{
    private $scriptUrl;
    private $timeout;

    public function __construct()
    {
        $this->scriptUrl = config('services.google_apps_script.url');
        $this->timeout = config('services.google_apps_script.timeout', 60);
    }

    /**
     * Export quiz to Google Form
     * 
     * @param Quizzes $quiz
     * @return array
     * @throws Exception
     */
    public function sendQuizToGoogleForm($quiz)
    {
        try {
            Log::info('Starting quiz export to Google Forms', [
                'quiz_id' => $quiz->id,
                'quiz_title' => $quiz->title,
                'questions_count' => $quiz->questions->count()
            ]);

            // Prepare the quiz data payload
            $payload = $this->prepareQuizPayload($quiz);

            // Send request to Google Apps Script
            $response = Http::timeout($this->timeout)
                ->retry(3, 1000) // Retry 3 times with 1 second delay
                ->post($this->scriptUrl, $payload);

            // Check if request was successful
            if (!$response->successful()) {
                $error = $response->json()['error'] ?? $response->body();
                throw new Exception("Google Apps Script returned error: {$error}");
            }

            // Process the response
            $result = $response->json();

            if (!isset($result['success']) || !$result['success']) {
                throw new Exception($result['error'] ?? 'Unknown error from Google Apps Script');
            }

            Log::info('Quiz successfully exported to Google Forms', [
                'quiz_id' => $quiz->id,
                'form_id' => $result['formId'] ?? null,
                'form_url' => $result['formUrl'] ?? null
            ]);

            return $result;
        } catch (Exception $e) {
            Log::error('Failed to export quiz to Google Form', [
                'quiz_id' => $quiz->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new Exception('Failed to export to Google Form: ' . $e->getMessage());
        }
    }

    /**
     * Prepare the quiz payload for Google Apps Script
     * 
     * @param Quizzes $quiz
     * @return array
     */
    private function prepareQuizPayload($quiz)
    {
        // Get quiz config or use defaults
        $config = $quiz->config ?? [];

        return [
            'title' => $quiz->title,
            'description' => "Quiz made by " . config('app.name'),
            'settings' => [
                'collectEmail' => true,
                'isQuiz' => true,
                'allowResponseEditing' => false,
                'showLinkToRespondAgain' => false,
                'limitOneResponsePerUser' => true,
                'shuffleQuestions' => $config['random_order'] ?? false,
            ],
            'questions' => $this->formatAllQuestions($quiz)
        ];
    }

    /**
     * Format all questions, expanding Mixed questions into individual questions
     * 
     * @param Quizzes $quiz
     * @return array
     */
    private function formatAllQuestions($quiz)
    {
        $allQuestions = [];

        foreach ($quiz->questions as $question) {
            $formatted = $this->formatQuestion($question);

            // If it's a mixed question, it returns an array of questions
            if ($question->type === 'Mixed' && is_array($formatted)) {
                $allQuestions = array_merge($allQuestions, $formatted);
            } else {
                $allQuestions[] = $formatted;
            }
        }

        return $allQuestions;
    }

    /**
     * Format a single question based on its type
     * 
     * @param object $question
     * @return array|array[]
     */
    private function formatQuestion($question)
    {
        // Base question structure
        $formattedQuestion = [
            'question' => $question->question_text,
            'type' => $this->mapQuestionType($question->type),
            'required' => true,
            'points' => 1,
            'explanation' => $question->explanation,
        ];

        // Handle different question types based on enum values
        switch ($question->type) {
            case 'Multiple Choice':
                $formattedQuestion['choices'] = $this->formatMultipleChoiceOptions($question);
                $formattedQuestion['correctAnswers'] = $this->getCorrectAnswers($question);
                break;

            case 'Multiple Answers':
                $formattedQuestion['choices'] = $this->formatMultipleChoiceOptions($question);
                $formattedQuestion['correctAnswers'] = $this->getCorrectAnswers($question);
                break;

            case 'True/False':
                $formattedQuestion['choices'] = [
                    ['text' => 'True', 'value' => 'true'],
                    ['text' => 'False', 'value' => 'false']
                ];
                $formattedQuestion['correctAnswers'] = $this->getCorrectAnswers($question);
                break;

            case 'Fill in the blank':
            case 'Identification':
                $formattedQuestion['correctAnswer'] = $this->getCorrectAnswerText($question);
                break;

            case 'Mixed':
                // Handle mixed questions - contains multiple sub-questions of different types
                return $this->handleMixedQuestion($question);
        }

        return $formattedQuestion;
    }

    /**
     * Map Laravel question types to Google Forms question types
     * 
     * @param string $type
     * @return string
     */
    private function mapQuestionType($type)
    {
        $typeMapping = [
            'Multiple Choice' => 'MULTIPLE_CHOICE',
            'Multiple Answers' => 'CHECKBOX',
            'True/False' => 'MULTIPLE_CHOICE',
            'Fill in the blank' => 'SHORT_ANSWER',
            'Identification' => 'SHORT_ANSWER',
            'Mixed' => 'MULTIPLE_CHOICE', // Default, will be adjusted in formatQuestion
        ];

        return $typeMapping[$type] ?? 'SHORT_ANSWER';
    }

    /**
     * Format multiple choice options from question data
     * 
     * @param object $question
     * @return array
     */
    private function formatMultipleChoiceOptions($question)
    {
        $options = $question->options;
        $choices = [];

        if (is_array($options)) {
            foreach ($options as $option) {
                if (is_string($option)) {
                    $choices[] = ['text' => $option, 'value' => $option];
                } elseif (is_array($option) && isset($option['text'])) {
                    $choices[] = [
                        'text' => $option['text'],
                        'value' => $option['value'] ?? $option['text']
                    ];
                }
            }
        }

        return $choices;
    }

    /**
     * Get correct answers from question
     * 
     * @param object $question
     * @return array
     */
    private function getCorrectAnswers($question)
    {
        $correctAnswer = $question->correct_answer;

        if (is_array($correctAnswer)) {
            return $correctAnswer;
        } elseif (is_string($correctAnswer)) {
            // Handle single correct answer
            return [$correctAnswer];
        }

        return [];
    }

    /**
     * Get correct answer text for text-based questions
     * 
     * @param object $question
     * @return string
     */
    private function getCorrectAnswerText($question)
    {
        $correctAnswer = $question->correct_answer;

        if (is_array($correctAnswer)) {
            // For fill in the blank, return the first answer or join them
            return is_array($correctAnswer[0] ?? null)
                ? ($correctAnswer[0]['text'] ?? '')
                : ($correctAnswer[0] ?? '');
        } elseif (is_string($correctAnswer)) {
            return $correctAnswer;
        }

        return '';
    }

    /**
     * Handle Mixed question type - break down into multiple individual questions
     * 
     * Expected structure in options field:
     * [
     *   {
     *     "type": "Multiple Choice",
     *     "question": "What is Laravel?",
     *     "choices": ["Framework", "Database", "Server"],
     *     "correct": "Framework"
     *   },
     *   {
     *     "type": "True/False", 
     *     "question": "PHP is a programming language",
     *     "correct": "True"
     *   }
     * ]
     * 
     * @param object $question
     * @return array
     */
    private function handleMixedQuestion($question)
    {
        $mixedQuestions = [];
        $options = $question->options ?? [];

        if (!is_array($options)) {
            Log::warning('Mixed question has invalid options structure', [
                'question_id' => $question->id ?? 'unknown',
                'options' => $options
            ]);
            return [];
        }

        foreach ($options as $index => $subQuestion) {
            if (!is_array($subQuestion) || !isset($subQuestion['type']) || !isset($subQuestion['question'])) {
                Log::warning('Invalid sub-question in Mixed question', [
                    'question_id' => $question->id ?? 'unknown',
                    'sub_question_index' => $index,
                    'sub_question' => $subQuestion
                ]);
                continue;
            }

            // Base structure for sub-question
            $formattedSubQuestion = [
                'question' => $subQuestion['question'],
                'type' => $this->mapQuestionType($subQuestion['type']),
                'required' => true,
                'points' => 1,
                'explanation' => $subQuestion['explanation'] ?? '',
            ];

            // Handle each sub-question type
            switch ($subQuestion['type']) {
                case 'Multiple Choice':
                    $formattedSubQuestion['choices'] = $this->formatSubQuestionChoices($subQuestion);
                    $formattedSubQuestion['correctAnswers'] = $this->getSubQuestionCorrectAnswers($subQuestion);
                    break;

                case 'Multiple Answers':
                    $formattedSubQuestion['type'] = 'CHECKBOX';
                    $formattedSubQuestion['choices'] = $this->formatSubQuestionChoices($subQuestion);
                    $formattedSubQuestion['correctAnswers'] = $this->getSubQuestionCorrectAnswers($subQuestion);
                    break;

                case 'True/False':
                    $formattedSubQuestion['choices'] = [
                        ['text' => 'True', 'value' => 'true'],
                        ['text' => 'False', 'value' => 'false']
                    ];
                    $formattedSubQuestion['correctAnswers'] = $this->getSubQuestionCorrectAnswers($subQuestion);
                    break;

                case 'Fill in the blank':
                case 'Identification':
                    $formattedSubQuestion['type'] = 'SHORT_ANSWER';
                    $formattedSubQuestion['correctAnswer'] = $subQuestion['correct'] ?? '';
                    break;
            }

            $mixedQuestions[] = $formattedSubQuestion;
        }

        return $mixedQuestions;
    }

    /**
     * Format choices for sub-questions in Mixed questions
     * 
     * @param array $subQuestion
     * @return array
     */
    private function formatSubQuestionChoices($subQuestion)
    {
        $choices = [];
        $subChoices = $subQuestion['choices'] ?? [];

        if (is_array($subChoices)) {
            foreach ($subChoices as $choice) {
                if (is_string($choice)) {
                    $choices[] = ['text' => $choice, 'value' => $choice];
                } elseif (is_array($choice) && isset($choice['text'])) {
                    $choices[] = [
                        'text' => $choice['text'],
                        'value' => $choice['value'] ?? $choice['text']
                    ];
                }
            }
        }

        return $choices;
    }

    /**
     * Get correct answers for sub-questions in Mixed questions
     * 
     * @param array $subQuestion
     * @return array
     */
    private function getSubQuestionCorrectAnswers($subQuestion)
    {
        $correct = $subQuestion['correct'] ?? [];

        if (is_array($correct)) {
            return $correct;
        } elseif (is_string($correct)) {
            return [$correct];
        }

        return [];
    }

    /**
     * Get form responses from Google Forms
     * 
     * @param string $formId
     * @return array
     * @throws Exception
     */
    public function getFormResponses($formId)
    {
        try {
            $payload = ['action' => 'getResponses', 'formId' => $formId];

            $response = Http::timeout($this->timeout)
                ->post($this->scriptUrl, $payload);

            if (!$response->successful()) {
                throw new Exception('Failed to fetch form responses');
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Failed to fetch form responses', [
                'form_id' => $formId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Update form settings in Google Forms
     * 
     * @param string $formId
     * @param array $settings
     * @return array
     * @throws Exception
     */
    public function updateFormSettings($formId, $settings)
    {
        try {
            $payload = [
                'action' => 'updateSettings',
                'formId' => $formId,
                'settings' => $settings
            ];

            $response = Http::timeout($this->timeout)
                ->post($this->scriptUrl, $payload);

            if (!$response->successful()) {
                throw new Exception('Failed to update form settings');
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Failed to update form settings', [
                'form_id' => $formId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
