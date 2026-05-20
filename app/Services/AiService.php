<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

use function Pest\Laravel\json;

class AiService
{
    protected function validateQuestions(): array
    {
        return [
            'questions' => ['required', 'array'],
            'questions.*.type' => ['required', Rule::in([
                'Multiple Choice', 'True/False', 'Fill in the blank',
                'Identification', 'Multiple Answers', 'Mixed',
            ])],
            'questions.*.question_text' => ['required', 'string'],
            'questions.*.explanation'   => ['required', 'string'],
            'questions.*.options'       => ['required', 'array'],
            'questions.*.correct_answer'=> ['required'],
        ];
    }

    protected function validateSummary(): array
    {
        return [
            'summary' => ['required', 'string']
        ];
    }

    protected function validateFlashcards(): array 
    {
        return [
            '*' => 'array',
            '*.question' => ['required', 'string'],
            '*.answer' => ['required', 'string']
        ];
    }

    public function generateQuestions(array $quizData, string $lessonData)
    {
        $systemContent = config('ai.prompts.generate.questions');
        $userContent = $this->combineQuizLessonContent($quizData, $lessonData);

        for ($i = 0; $i < 3; $i++) {
            $decoded = $this->parseAiResponse($this->callAi($systemContent, $userContent));

            if (is_null($decoded)) continue;

            // Unwrap {"questions": [...]} if present
            $questions = $decoded['questions'] ?? $decoded;

            $validator = Validator::make(
                ['questions' => $questions],  // always wrap for validation
                $this->validateQuestions()
            );

            if ($validator->fails()) {
                Log::error('Validation Error', ['validation_error', $validator->errors()->toArray()]);
                continue;
            }

            return $questions; // return the flat array
        }

        Log::error('AI failed to generate valid questions after retries', ['quizData' => $quizData]);
        return null;
    }

    public function generateFlashcards(string $lessonData)
    {
        $systemContent = config('ai.prompts.generate.flashcard');
        $userContent = $lessonData;

        // Use loop to retry if some values are missing
        for ($i = 0; $i < 3; $i++) {
            $decoded = $this->parseAiResponse($this->callAi($systemContent, $userContent));
            $validator = Validator::make($decoded, $this->validateFlashcards());

            if ($validator->fails()) {
                $errors = $validator->errors()->toArray();
                Log::error('Validation Error', ['validation_error', $errors]);
            };
    
            if ($validator->passes()) {
                return $decoded;
            }
        }
        Log::error('Failed to generate valid flashcards after 3 retry');

        return null;
    }

    public function generateSummary(string $lessonData)
    {
        $systemContent = config('ai.prompts.generate.summary');
        $userContent = $lessonData;

        // Use loop to retry if some values are missing
        for ($i = 0; $i < 3; $i++) {
            $decoded = $this->parseAiResponse($this->callAi($systemContent, $userContent));
            $validator = Validator::make($decoded, $this->validateSummary());
    
            if ($validator->fails()) {
                $errors = $validator->errors()->toArray();
                Log::error('Validation Error', ['validation_error', $errors]);
            };

            if ($validator->passes()) {
                return $decoded;
            }
        }
        Log::error('Failed to generate valid summary after 3 retry');

        return null;
    }

    public function parseAiResponse($response)
    {
        $userId = auth()->id();

        try {
            if (is_array($response)) {
                return $response;
            }

            // Unwrap double-encoded string if needed
            $raw = $response;
            if (str_starts_with(trim($raw), '"') && str_ends_with(trim($raw), '"')) {
                $raw = json_decode($raw, true) ?? $raw;
            }

            // Extract JSON array or object if buried in extra text
            $raw = $this->extractJson($raw);

            $decoded = json_decode($raw, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                Log::info('Parsed successfully', ['count' => count($decoded)]);
                return $decoded;
            }

            // Attempt to repair common AI JSON mistakes
            $repaired = $this->repairJson($raw);
            $decoded = json_decode($repaired, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                Log::info('Parsed after repair', ['count' => count($decoded)]);
                return $decoded;
            }

            Log::error("Failed to parse AI results", [
                'response' => $response,
                'repaired' => $repaired,
                'json_error' => json_last_error_msg(),
            ]);

            return null;

        } catch (Exception $e) {
            Log::error("Error parsing AI response", [
                'error'    => $e->getMessage(),
                'response' => $response,
                'user_id'  => $userId
            ]);
            return null;
        }
    }

    /**
     * Extract the first complete JSON array or object from a string
     * that may have surrounding text or markdown fences.
     */
    private function extractJson(string $text): string
    {
        // Strip markdown code fences
        $text = preg_replace('/^```(?:json)?\s*/m', '', $text);
        $text = preg_replace('/\s*```$/m', '', $text);
        $text = trim($text);

        // Find the first [ or { and its matching closing bracket
        $start = min(
            ($p = strpos($text, '[')) !== false ? $p : PHP_INT_MAX,
            ($p = strpos($text, '{')) !== false ? $p : PHP_INT_MAX,
        );

        if ($start === PHP_INT_MAX) {
            return $text;
        }

        $openChar  = $text[$start];
        $closeChar = $openChar === '[' ? ']' : '}';
        $depth     = 0;
        $inString  = false;
        $escape    = false;
        $end       = $start;

        for ($i = $start; $i < strlen($text); $i++) {
            $char = $text[$i];

            if ($escape) { $escape = false; continue; }
            if ($char === '\\' && $inString) { $escape = true; continue; }
            if ($char === '"') { $inString = !$inString; continue; }
            if ($inString) continue;

            if ($char === $openChar)  $depth++;
            if ($char === $closeChar) { $depth--; if ($depth === 0) { $end = $i; break; } }
        }

        return substr($text, $start, $end - $start + 1);
    }

    /**
     * Fix the specific "missing opening brace" bug AI models sometimes produce.
     * Turns },<whitespace>"key": into },{"key":
     */
    private function repairJson(string $json): string
    {
        // Fix missing { after a closing object inside an array
        // Pattern: },  "question": → }, {"question":
        $json = preg_replace('/\},(\s*)"(question|answer|type|options|correct_answer|explanation)":/', '},{$1"$2":', $json);

        // Fix trailing commas before ] or }
        $json = preg_replace('/,(\s*[\]}])/', '$1', $json);

        return $json;
    }


    public function callAi(string $systemContent, string $userContent)
    {
        try {


            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('ai.groq.api_key'),
                'Content-Type' => 'application/json'

            ])->timeout(60)->retry(3, function ($retryCount) {
                return 200 * ($retryCount ** 2); // wait 200ms, 400ms, 800ms

            }, function (Exception $exception, PendingRequest $request) use ($systemContent, $userContent) {
                Log::warning("Retry attempt due to exception", [
                    'code' => $exception->getCode(),
                    'message' => $exception->getMessage(),
                ]);

                return true; // always retry
            })->post(config('ai.groq.api_url'), [
                'model' => config('ai.groq.models.openai'),
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
            ])->throw();
            $jsonData = $response->json();
            $AiModel = $jsonData['model'];
            $AiContent = $jsonData['choices'][0]['message']['content'];

            Log::info('AI Response: ', ['ai_model' => $AiModel, 'ai_response' => $AiContent]);
            return $AiContent ?? null;
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Error: ' . $e->getMessage()];
        }
    }

    public function combineQuizLessonContent(array $quizData, string $lessonData): string
    {
        return 'Quiz configuration: ' . json_encode($quizData) . '\n Lesson content: ' . $lessonData . '.';
    }
}
