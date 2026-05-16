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

        // Use loop to retry if some values are missing
        for ($i = 0; $i < 3; $i++) {
            $decoded = $this->parseAiResponse($this->callAi($systemContent, $userContent));
            $validator = Validator::make($decoded, $this->validateQuestions());
    
            if ($validator->fails()) {
                $errors = $validator->errors()->toArray();
                Log::error('Validation Error', ['validation_error', $errors]);
            };
            
            if ($validator->passes()) {
                return $decoded;
            }
        }
        Log::error('AI failed to generate valid questions after retries', [
                'quizData' => $quizData,
            ]);

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

            // First Decode
            $decoded = json_decode($response, true); 

            // If first decode was successful
            if (json_last_error() === JSON_ERROR_NONE) {
                // If decoded result is already an array
                Log::info('First decoding...', ['first_decode' => $decoded]);
                if (is_array($decoded)) {
                    return $decoded;
                }
                // If decoded result is still a string, try again (double-encoded case)
                $secondDecode = json_decode($decoded, true);

                Log::info('Second decoding...', ['second_decode' => $secondDecode]);

                if (json_last_error() === JSON_ERROR_NONE && is_array($secondDecode)) {
                    return $secondDecode;
                }                
            }

            // Case 3: decode failed, maybe double quotes wrapping JSON
            $secondTry = json_decode(trim($response, "\""), true);

            Log::info('Second Try', ['second_try' => $secondTry]);
            if (json_last_error() === JSON_ERROR_NONE && is_array($secondTry)) {
                return $secondTry;
            }
            
            // Log if decoding failed
            Log::error("Failed to parse AI results", [
                'response' => $response,
                'decoded' => $decoded,
                'second_decode' => $secondDecode ?? '',
                'second_try' => $secondTry ?? ''
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


    public function callAi(string $systemContent, string $userContent)
    {
        try {
            $aICycleCacheKey = 'ai_model_index_cycle';

            // Get current model index from cache (default to 0 if not set)
            $aIModelIndex = Cache::get($aICycleCacheKey, 0);

            $aiKeys = array_keys(config('ai.groq.models'));
            $aiModel = config('ai.groq.models.' . $aiKeys[$aIModelIndex]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('ai.groq.api_key'),
                'Content-Type' => 'application/json'

            ])->timeout(60)->retry(3, function ($retryCount) {
                return 200 * ($retryCount ** 2); // wait 200ms, 400ms, 800ms

            }, function (Exception $exception, PendingRequest $request) use ($aiKeys, $aICycleCacheKey, $systemContent, $userContent) {
                Log::warning("Retry attempt due to exception", [
                    'code' => $exception->getCode(),
                    'message' => $exception->getMessage(),
                ]);

                // Change the ai model before retry if the exception is due to a 429 (rate limit)
                if ($exception->getCode() == 429) {
                    $currentModelIndex = Cache::get($aICycleCacheKey, 0);
                    $nextModelIndex = ($currentModelIndex + 1) % count($aiKeys);

                    // Update cache with next model index
                    Cache::forever($aICycleCacheKey, $nextModelIndex);

                    // uncomment with token if we want to rotate the api key used as well. Must add it into the ai.config file
                    // $request->withToken()

                    // Get new model
                    $newModel = config('ai.groq.models.' . $aiKeys[$nextModelIndex]);

                    // Overwrite request body with new Model
                    $request->withBody(json_encode([
                        'model' => $newModel,
                        'messages' => [
                            [
                                'role' => 'system',
                                'content' => config('ai.prompts.general') . $systemContent
                            ],
                            [
                                'role' => 'user',
                                'content' => $userContent
                            ]
                        ]]), 'application/json');


                   Log::info("Rate limit hit. Switching AI model index from {$currentModelIndex} to {$nextModelIndex}");
                }
                return true; // always retry
            })->post(config('ai.groq.api_url'), [
                'model' => $aiModel,
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
