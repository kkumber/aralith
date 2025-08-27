<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    public function generateQuestions(array $quizData, string $lessonData)
    {
        $systemContent = config('ai.prompts.generate.questions');
        $userContent = $this->combineQuizLessonContent($quizData, $lessonData);
        $decoded = $this->parseAiResponse($this->callAi($systemContent, $userContent));
        return $decoded;
    }

    public function generateFlashcards(string $lessonData)
    {
        $systemContent = config('ai.prompts.generate.flashcard');
        $userContent = $lessonData;
        $decoded = $this->parseAiResponse($this->callAi($systemContent, $userContent));
        return $decoded;
    }

    public function generateSummary(string $lessonData)
    {
        $systemContent = config('ai.prompts.generate.summary');
        $userContent = $lessonData;
        $decoded = $this->parseAiResponse($this->callAi($systemContent, $userContent));
        return $decoded;
    }

    function parseAiResponse($response)
    {
        try {
            if (is_array($response) && isset($response)) {
                return $response;
            };
    
            if (is_string($response)) {
                $decoded = json_decode($response, true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                  Log::error("Failed to parsed AI results", [
                    'json_error' => json_last_error_msg(),
                    'response' => $response
                  ]);  
                };
                return $decoded;
            };

            // If response is neither array nor string, log it and return null
            Log::error("Unexpected AI response type", [
                'type' => gettype($response),
                'response' => $response,
                'user_id' => auth()->id()
            ]);
            
            return null;
        } catch (Exception $e) {
            Log::error("Error parsing AI response", [
                'error' => $e->getMessage(),
                'response' => $response,
                'user_id' => auth()->id()
            ]);
            return null;
        }
    }

    public function callAi(string $systemContent, string $userContent)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('ai.groq.api_key'),
                'Content-Type' => 'application/json'
            ])->post(config('ai.groq.api_url'), [
                'model' => config('ai.groq.models.kimi-k2'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => config('ai.prompts.general') . $systemContent
                    ],
                    [
                        'role' => 'user',
                        'content' => $userContent
                    ]
                ],
                /* 'response_format' => [
                    'type' => 'json_schema',
                    'json_schema' => [
                        'name' => 'questions',
                        'schema' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'type' => ['type' => 'string', 'enum' => ['Multiple Choice', 'True/False', 'Fill in the blank', 'Identification', 'Multiple Answers']],
                                    'question_text' => ['type' => 'string'],
                                    'explanation' => ['type' => 'string'],
                                    'options' => ['type' => 'array', 'items' => ['type' => 'string']],
                                    'correct_answer' => ['type' => 'string']
                                ],
                                'required' => ['type', 'question_text', 'correct_answer'],
                                'additionalProperties' => false,
                            ]
                        ]
                    ]
                ] */
            ])->throw();

            return $response->json()['choices'][0]['message']['content'];
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Error: ' . $e->getMessage()];
        };
    }

    public function combineQuizLessonContent(array $quizData, string $lessonData): string
    {
        return 'Quiz configuration: ' . json_encode($quizData) . '\n Lesson content: ' . $lessonData . '.';
    }
}
