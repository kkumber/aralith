<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;

class AiService
{

    /**
     * YES I KNOW I COULD HAVEEEEEEE MADE THESE 3 INTO JUST 1 REUSEABLE FUNCTION BUT NO
     * 
     */
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

    public function parseAiResponse($response)
    {
        $userId = auth()->id();
        try {
            // Already a PHP array
            if (is_array($response)) {
                return $response;
            }

            // If it's a string, try decoding
            if (is_string($response)) {
                $decoded = json_decode($response, true);

                // If first decode was successful
                if (json_last_error() === JSON_ERROR_NONE) {
                    // If decoded result is still a string, try again (double-encoded case)
                    if (is_string($decoded)) {
                        $secondDecode = json_decode($decoded, true);
                        if (json_last_error() === JSON_ERROR_NONE && is_array($secondDecode)) {
                            return $secondDecode;
                        }
                    }

                    // If decoded result is already an array
                    if (is_array($decoded)) {
                        return $decoded;
                    }
                }

                // Log if decoding failed
                Log::error("Failed to parse AI results", [
                    'json_error' => json_last_error_msg(),
                    'response'   => $response,
                    'user_id'    => $userId
                ]);

                return null;
            }

            // If response is neither array nor string
            Log::error("Unexpected AI response type", [
                'type'     => gettype($response),
                'response' => $response,
                'user_id'  => $userId
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
            }, function (Exception $exception, PendingRequest $request) use ($aiKeys, $aICycleCacheKey) {
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
