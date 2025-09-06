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
                // Change the ai model before retry if the exception is due to a 429 (rate limit)
                if ($exception->getCode() == 429) {
                    $currentModelIndex = Cache::get($aICycleCacheKey, 0);
                    $nextModelIndex = ($currentModelIndex + 1) % count($aiKeys);

                    // Update cache with next model index
                    Cache::forever($aICycleCacheKey, $nextModelIndex);

                    return true;
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

            $AiResponse = $response->json()['choices'][0]['message']['content'];
            return $AiResponse ?? null;
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'Error: ' . $e->getMessage()];
        }
    }

    public function combineQuizLessonContent(array $quizData, string $lessonData): string
    {
        return 'Quiz configuration: ' . json_encode($quizData) . '\n Lesson content: ' . $lessonData . '.';
    }
}
