<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AiService
{

    /**
     * Schema for quiz question generation.
     *
     * correct_answer is anyOf [string, array-of-strings] to support both
     * single-answer types and "Multiple Answers".
     */
    protected function questionsSchema(): array
    {
        return [
            'type'                 => 'object',
            'additionalProperties' => false,
            'required'             => ['questions'],
            'properties'           => [
                'questions' => [
                    'type'  => 'array',
                    'items' => [
                        'type'                 => 'object',
                        'additionalProperties' => false,
                        'required'             => [
                            'type',
                            'question_text',
                            'explanation',
                            'options',
                            'correct_answer',
                        ],
                        'properties' => [
                            'type' => [
                                'type' => 'string',
                                'enum' => [
                                    'Multiple Choice',
                                    'True/False',
                                    'Fill in the blank',
                                    'Identification',
                                    'Multiple Answers',
                                    'Mixed',
                                ],
                            ],
                            'question_text'  => ['type' => 'string'],
                            'explanation'    => ['type' => 'string'],
                            'options'        => [
                                'type'  => 'array',
                                'items' => ['type' => 'string'],
                            ],
                            // Single-answer types → string; Multiple Answers → array of strings
                            'correct_answer' => [
                                'anyOf' => [
                                    ['type' => 'string'],
                                    [
                                        'type'  => 'array',
                                        'items' => ['type' => 'string'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Schema for flashcard generation.
     */
    protected function flashcardsSchema(): array
    {
        return [
            'type'                 => 'object',
            'additionalProperties' => false,
            'required'             => ['flashcards'],
            'properties'           => [
                'flashcards' => [
                    'type'  => 'array',
                    'items' => [
                        'type'                 => 'object',
                        'additionalProperties' => false,
                        'required'             => ['question', 'answer'],
                        'properties'           => [
                            'question' => ['type' => 'string'],
                            'answer'   => ['type' => 'string'],
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Schema for summary generation.
     */
    protected function summarySchema(): array
    {
        return [
            'type'                 => 'object',
            'additionalProperties' => false,
            'required'             => ['summary'],
            'properties'           => [
                'summary' => ['type' => 'string'],
            ],
        ];
    }

    // -------------------------------------------------------------------------
    // Laravel Validator rules (safety net
    // -------------------------------------------------------------------------

    protected function validateQuestions(): array
    {
        return [
            'questions'                  => ['required', 'array'],
            'questions.*.type'           => ['required', Rule::in([
                'Multiple Choice', 'True/False', 'Fill in the blank',
                'Identification', 'Multiple Answers', 'Mixed',
            ])],
            'questions.*.question_text'  => ['required', 'string'],
            'questions.*.explanation'    => ['required', 'string'],
            'questions.*.options'        => ['required', 'array'],
            'questions.*.correct_answer' => ['required'],
        ];
    }

    protected function validateSummary(): array
    {
        return [
            'summary' => ['required', 'string'],
        ];
    }

    protected function validateFlashcards(): array
    {
        return [
            'flashcards'           => ['required', 'array'],
            'flashcards.*.question' => ['required', 'string'],
            'flashcards.*.answer'   => ['required', 'string'],
        ];
    }

    // -------------------------------------------------------------------------
    // Public generators
    // -------------------------------------------------------------------------

    public function generateQuestions(array $quizData, string $lessonData)
    {
        $systemContent = config('ai.prompts.generate.questions');
        $userContent   = $this->combineQuizLessonContent($quizData, $lessonData);
        $schema        = $this->questionsSchema();

        for ($i = 0; $i < 3; $i++) {
            $decoded = $this->parseAiResponse(
                $this->callAi($systemContent, $userContent, 'quiz_questions', $schema)
            );

            if (is_null($decoded)) {
                continue;
            }

            // The schema wraps questions in {"questions": [...]}, unwrap for the validator
            $questions = $decoded['questions'] ?? $decoded;

            $validator = Validator::make(
                ['questions' => $questions],
                $this->validateQuestions()
            );

            if ($validator->fails()) {
                Log::error('Question validation failed', $validator->errors()->toArray());
                continue;
            }

            return $questions;
        }

        Log::error('AI failed to generate valid questions after retries', ['quizData' => $quizData]);
        return null;
    }

    public function generateFlashcards(string $lessonData)
    {
        $systemContent = config('ai.prompts.generate.flashcard');
        $schema        = $this->flashcardsSchema();

        for ($i = 0; $i < 3; $i++) {
            $decoded = $this->parseAiResponse(
                $this->callAi($systemContent, $lessonData, 'flashcards', $schema)
            );

            if (is_null($decoded)) {
                continue;
            }

            // unwrap
            $flashcards = $decoded['flashcards'] ?? $decoded;

            if (!is_array($flashcards)) {
                Log::error('Flashcard unwrap did not yield an array', ['decoded' => $decoded]);
                continue;
            }

            $validator = Validator::make(
                ['flashcards' => $flashcards],
                $this->validateFlashcards()
            );

            if ($validator->fails()) {
                Log::error('Flashcard validation failed', $validator->errors()->toArray());
                continue;
            }

            return $flashcards;
        }

        Log::error('Failed to generate valid flashcards after 3 retries');
        return null;
    }

    public function generateSummary(string $lessonData)
    {
        $systemContent = config('ai.prompts.generate.summary');
        $schema        = $this->summarySchema();

        for ($i = 0; $i < 3; $i++) {
            $decoded = $this->parseAiResponse(
                $this->callAi($systemContent, $lessonData, 'lesson_summary', $schema)
            );

            if (is_null($decoded)) {
                continue;
            }

            $validator = Validator::make($decoded, $this->validateSummary());

            if ($validator->fails()) {
                Log::error('Summary validation failed', $validator->errors()->toArray());
                continue;
            }

            return $decoded;
        }

        Log::error('Failed to generate valid summary after 3 retries');
        return null;
    }

    // -------------------------------------------------------------------------
    // Core API caller
    // -------------------------------------------------------------------------

    /**
     * Call the Groq API with optional structured-output schema.
     *
     * @param  string      $systemContent  System prompt text
     * @param  string      $userContent    User prompt text
     * @param  string      $schemaName     Identifier used in response_format (snake_case)
     * @param  array|null  $schema         JSON Schema array. When provided, strict mode is used.
     */
    public function callAi(
        string $systemContent,
        string $userContent,
        string $schemaName = 'response',
        ?array $schema = null
    ) {
        try {
            $payload = [
                'model'    => config('ai.groq.models.openai'),
                'messages' => [
                    [
                        'role'    => 'system',
                        'content' => config('ai.prompts.general') . $systemContent,
                    ],
                    [
                        'role'    => 'user',
                        'content' => $userContent,
                    ],
                ],
            ];

            // Attach structured-output schema when provided.
            if ($schema !== null) {
                $payload['response_format'] = [
                    'type'        => 'json_schema',
                    'json_schema' => [
                        'name'   => $schemaName,
                        'strict' => true,
                        'schema' => $schema,
                    ],
                ];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('ai.groq.api_key'),
                'Content-Type'  => 'application/json',
            ])
            ->timeout(60)
            ->retry(3, function ($retryCount) {
                return 200 * ($retryCount ** 2); // 200 ms, 800 ms, 1800 ms
            }, function (Exception $exception, PendingRequest $request) {
                Log::warning('Groq retry due to exception', [
                    'code'    => $exception->getCode(),
                    'message' => $exception->getMessage(),
                ]);
                return true;
            })
            ->post(config('ai.groq.api_url'), $payload)
            ->throw();

            $jsonData  = $response->json();
            $aiModel   = $jsonData['model'];
            $aiContent = $jsonData['choices'][0]['message']['content'];

            Log::info('Groq response received', [
                'ai_model'    => $aiModel,
                'ai_response' => $aiContent,
            ]);

            return $aiContent ?? null;

        } catch (Exception $e) {
            Log::error('Groq API call failed', ['error' => $e->getMessage()]);
            return null;
        }
    }

    // -------------------------------------------------------------------------
    // Response parsing (safety net — strict mode should never need repair)
    // -------------------------------------------------------------------------

    public function parseAiResponse($response)
    {
        if (is_null($response)) {
            return null;
        }

        try {
            if (is_array($response)) {
                return $response;
            }

            // Unwrap double-encoded string if needed
            $raw = $response;
            if (str_starts_with(trim($raw), '"') && str_ends_with(trim($raw), '"')) {
                $raw = json_decode($raw, true) ?? $raw;
            }

            // Strip markdown fences and extract first JSON object/array
            $raw     = $this->extractJson((string) $raw);
            $decoded = json_decode($raw, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                Log::info('AI response parsed successfully', ['keys' => array_keys($decoded)]);
                return $decoded;
            }

            // Attempt light JSON repair as a last resort
            $repaired = $this->repairJson($raw);
            $decoded  = json_decode($repaired, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                Log::info('AI response parsed after repair');
                return $decoded;
            }

            Log::error('Failed to parse AI response', [
                'response'   => $response,
                'repaired'   => $repaired,
                'json_error' => json_last_error_msg(),
            ]);

            return null;

        } catch (Exception $e) {
            Log::error('Exception while parsing AI response', [
                'error'    => $e->getMessage(),
                'response' => $response,
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

            if ($escape)                        { $escape = false; continue; }
            if ($char === '\\' && $inString)    { $escape = true;  continue; }
            if ($char === '"')                  { $inString = !$inString; continue; }
            if ($inString)                       continue;

            if ($char === $openChar)  { $depth++; }
            if ($char === $closeChar) { $depth--; if ($depth === 0) { $end = $i; break; } }
        }

        return substr($text, $start, $end - $start + 1);
    }


    private function repairJson(string $json): string
    {
        // Fix missing { after a closing object inside an array
        $json = preg_replace(
            '/\},(\s*)"(question|answer|type|options|correct_answer|explanation|flashcards|summary)":/',
            '},{$1"$2":',
            $json
        );

        // Fix trailing commas before ] or }
        $json = preg_replace('/,(\s*[\]}])/', '$1', $json);

        return $json;
    }

    public function combineQuizLessonContent(array $quizData, string $lessonData): string
    {
        return 'Quiz configuration: ' . json_encode($quizData) . '\n Lesson content: ' . $lessonData . '.';
    }
}