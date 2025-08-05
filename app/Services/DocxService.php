<?php

namespace App\Services;

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\Settings;
use Illuminate\Support\Facades\Response;
use App\Models\Quizzes;
use Illuminate\Support\Facades\Log;

class DocxService
{
    public function downloadQuizDocx(Quizzes $quiz)
    {
        try {
            // Ensure questions are loaded
            if (!$quiz->relationLoaded('questions')) {
                $quiz->load('questions');
            }

            // Check if quiz has questions
            if ($quiz->questions->isEmpty()) {
                throw new \Exception('Quiz has no questions');
            }

            // Set up PhpWord settings for better compatibility
            Settings::setOutputEscapingEnabled(true);

            $phpWord = new PhpWord();

            // Set document properties
            $properties = $phpWord->getDocInfo();
            $properties->setCreator('Quiz System');
            $properties->setTitle('Quiz: ' . $quiz->title);

            $section = $phpWord->addSection();

            // Add title with proper styling
            $titleStyle = ['name' => 'Arial', 'size' => 16, 'bold' => true];
            $section->addText("Quiz: {$quiz->title}", $titleStyle);
            $section->addTextBreak(1);

            // Add instructions
            $instructionStyle = ['name' => 'Arial', 'size' => 12];
            $section->addText("Instructions: Please answer all questions according to their type.", $instructionStyle);
            $section->addTextBreak(2);

            // Add questions
            foreach ($quiz->questions as $index => $question) {
                $questionNumber = $index + 1;

                // Add question text with type indicator
                $questionText = "{$questionNumber}. [{$question->type}] {$question->question_text}";
                $questionStyle = ['name' => 'Arial', 'size' => 12, 'bold' => true];
                $section->addText($questionText, $questionStyle);

                // Handle different question types
                switch ($question->type) {
                    case 'Multiple Choice':
                        $this->addMultipleChoiceQuestion($section, $question);
                        break;

                    case 'Multiple Answers':
                        $this->addMultipleAnswersQuestion($section, $question);
                        break;

                    case 'True/False':
                        $this->addTrueFalseQuestion($section, $question);
                        break;

                    case 'Fill in the blank':
                        $this->addFillInTheBlankQuestion($section, $question);
                        break;

                    case 'Identification':
                        $this->addIdentificationQuestion($section, $question);
                        break;

                    default:
                        $this->addGenericQuestion($section, $question);
                        break;
                }

                $section->addTextBreak(1);
            }

            // Add page break before answer key
            $section->addPageBreak();

            // Add answer key section
            $this->addAnswerKeySection($section, $quiz);

            // Create temporary file with proper extension
            $tempDir = sys_get_temp_dir();
            $tempFile = $tempDir . DIRECTORY_SEPARATOR . 'quiz_' . uniqid() . '.docx';

            // Create writer and save
            $writer = IOFactory::createWriter($phpWord, 'Word2007');
            $writer->save($tempFile);

            // Verify file was created and has content
            if (!file_exists($tempFile) || filesize($tempFile) === 0) {
                throw new \Exception('Failed to create DOCX file');
            }

            $filename = 'quiz_' . preg_replace('/[^A-Za-z0-9_\-]/', '_', $quiz->title) . '.docx';

            return response()->download($tempFile, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0'
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Log::error('DocxService Error: ' . $e->getMessage());
            throw new \Exception('Failed to generate DOCX: ' . $e->getMessage());
        }
    }

    private function addMultipleChoiceQuestion($section, $question)
    {
        $optionStyle = ['name' => 'Arial', 'size' => 11];
        $section->addText("Choose the best answer:", $optionStyle);

        $options = is_string($question->options) ? json_decode($question->options, true) : $question->options;

        if (!empty($options) && is_array($options)) {
            foreach ($options as $optionIndex => $option) {
                $letter = chr(97 + $optionIndex); // a, b, c, d...
                $optionText = is_array($option) ? ($option['text'] ?? $option['value'] ?? '') : $option;
                // Clean the text to prevent XML issues
                $cleanText = htmlspecialchars($optionText, ENT_QUOTES, 'UTF-8');
                $section->addText("   {$letter}. {$cleanText}", $optionStyle);
            }
        } else {
            $section->addText("   a. ________________", $optionStyle);
            $section->addText("   b. ________________", $optionStyle);
            $section->addText("   c. ________________", $optionStyle);
            $section->addText("   d. ________________", $optionStyle);
        }
    }

    private function addMultipleAnswersQuestion($section, $question)
    {
        $optionStyle = ['name' => 'Arial', 'size' => 11];
        $section->addText("Select all correct answers:", $optionStyle);

        $options = is_string($question->options) ? json_decode($question->options, true) : $question->options;

        if (!empty($options) && is_array($options)) {
            foreach ($options as $optionIndex => $option) {
                $letter = chr(97 + $optionIndex); // a, b, c, d...
                $optionText = is_array($option) ? ($option['text'] ?? $option['value'] ?? '') : $option;
                $cleanText = htmlspecialchars($optionText, ENT_QUOTES, 'UTF-8');
                $section->addText("   {$letter}. {$cleanText}", $optionStyle);
            }
        } else {
            $section->addText("   a. ________________", $optionStyle);
            $section->addText("   b. ________________", $optionStyle);
            $section->addText("   c. ________________", $optionStyle);
            $section->addText("   d. ________________", $optionStyle);
        }
    }

    private function addTrueFalseQuestion($section, $question)
    {
        $optionStyle = ['name' => 'Arial', 'size' => 11];
        $section->addText("Choose the best answer:", $optionStyle);
        $section->addText("   a. TRUE", $optionStyle);
        $section->addText("   b. FALSE", $optionStyle);
    }

    private function addFillInTheBlankQuestion($section, $question)
    {
        $optionStyle = ['name' => 'Arial', 'size' => 11];
        if (
            strpos($question->question_text, '____') === false &&
            strpos($question->question_text, '_____') === false &&
            strpos($question->question_text, '___') === false
        ) {
            $section->addText("Answer: ________________________________", $optionStyle);
        }
    }

    private function addIdentificationQuestion($section, $question)
    {
        $optionStyle = ['name' => 'Arial', 'size' => 11];
        $section->addText("Answer: ________________________________", $optionStyle);
    }

    private function addGenericQuestion($section, $question)
    {
        $optionStyle = ['name' => 'Arial', 'size' => 11];
        $options = is_string($question->options) ? json_decode($question->options, true) : $question->options;

        if (!empty($options) && is_array($options)) {
            $section->addText("Choose the best answer:", $optionStyle);
            foreach ($options as $optionIndex => $option) {
                $letter = chr(97 + $optionIndex);
                $optionText = is_array($option) ? ($option['text'] ?? $option['value'] ?? '') : $option;
                $cleanText = htmlspecialchars($optionText, ENT_QUOTES, 'UTF-8');
                $section->addText("   {$letter}. {$cleanText}", $optionStyle);
            }
        } else {
            $section->addText("Answer: ________________________________", $optionStyle);
        }
    }

    private function addAnswerKeySection($section, $quiz)
    {
        $titleStyle = ['name' => 'Arial', 'size' => 16, 'bold' => true];
        $questionStyle = ['name' => 'Arial', 'size' => 12, 'bold' => true];
        $answerStyle = ['name' => 'Arial', 'size' => 11, 'color' => '008000', 'bold' => true];
        $explanationStyle = ['name' => 'Arial', 'size' => 10, 'italic' => true];

        $section->addText("ANSWER KEY", $titleStyle);
        $section->addTextBreak(1);

        foreach ($quiz->questions as $index => $question) {
            $questionNumber = $index + 1;

            $questionText = "{$questionNumber}. [{$question->type}]";
            $section->addText($questionText, $questionStyle);

            $correctAnswer = is_string($question->correct_answer)
                ? json_decode($question->correct_answer, true)
                : $question->correct_answer;

            if (!empty($correctAnswer)) {
                $answerText = $this->formatAnswerForKey($question->type, $correctAnswer);
                $cleanAnswerText = htmlspecialchars($answerText, ENT_QUOTES, 'UTF-8');
                $section->addText("Answer: {$cleanAnswerText}", $answerStyle);
            }

            if (!empty($question->explanation)) {
                $cleanExplanation = htmlspecialchars($question->explanation, ENT_QUOTES, 'UTF-8');
                $section->addText("Explanation: {$cleanExplanation}", $explanationStyle);
            }

            $section->addTextBreak(1);
        }
    }

    private function formatAnswerForKey($questionType, $correctAnswer)
    {
        switch ($questionType) {
            case 'Multiple Choice':
            case 'True/False':
                if (is_array($correctAnswer)) {
                    $correctAnswer = $correctAnswer[0] ?? '';
                }

                if (is_numeric($correctAnswer)) {
                    return chr(97 + intval($correctAnswer));
                }

                if (is_string($correctAnswer) && strlen($correctAnswer) == 1) {
                    return strtolower($correctAnswer);
                }

                return $correctAnswer;

            case 'Multiple Answers':
                if (is_array($correctAnswer)) {
                    $letters = [];
                    foreach ($correctAnswer as $answer) {
                        if (is_numeric($answer)) {
                            $letters[] = chr(97 + intval($answer));
                        } else {
                            $letters[] = strtolower($answer);
                        }
                    }
                    return implode(', ', $letters);
                }
                return $correctAnswer;

            case 'Fill in the blank':
            case 'Identification':
            default:
                if (is_array($correctAnswer)) {
                    return implode(', ', $correctAnswer);
                }
                return $correctAnswer;
        }
    }
}
