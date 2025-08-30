<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLessonQuizRequest;
use App\Services\AiService;
use App\Services\LessonQuizService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;


class LessonQuizController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLessonQuizRequest $request, LessonQuizService $lessonQuizService, AiService $aiService)
    {
        try {
            $validated = $request->validated();
            $user = auth()->user();

            if (!$user) {
                throw ValidationException::withMessages([
                    'message' => 'Unauthorized.'
                ]);
            }

            // Generate Summary
            $summary = $aiService->generateSummary($validated['lesson']['content']);
            if (empty($summary) || !is_array($summary)) {
                throw ValidationException::withMessages([
                    'message' => 'Failed to generate summary from AI. Please try again.'
                ]);
            }

            // Generate Flashcards
            $flashcards = $aiService->generateFlashcards($validated['lesson']['content']);
            if (empty($flashcards) || !is_array($flashcards)) {
                throw ValidationException::withMessages([
                    'message' => 'Failed to generate flashcards from AI. Please try again.'
                ]);
            }

            // Generate Questions
            $questionsData = $aiService->generateQuestions($validated['quiz_config'], $validated['lesson']['content']);
            if (empty($questionsData) || !is_array($questionsData)) {
                throw ValidationException::withMessages([
                    'message' => 'Failed to generate questions from AI. Please try again.'
                ]);
            }

<<<<<<< HEAD
=======
            // Combine them all and save them into DB using transaction to avoid orphans
>>>>>>> 144bea350277e77bd0d4052efca8e03b72692814
            $result = $lessonQuizService->createLessonSummaryFlashcardQuiz(
                array_merge($validated['lesson'], $summary),
                $validated['quiz_config'],
                $questionsData,
                $flashcards,
                $user
            );

            if (empty($result)) {
                throw ValidationException::withMessages([
                    'message' => 'Failed to create lesson. Please try again.'
                ]);
            }

            Cache::forget('recent_lessons_user_' . auth()->id());

            return redirect()->route('lesson.show', $result['lesson']->id)
                ->with('success', 'Lesson created successfully');
        } catch (\JsonException $e) {
            return back()->withErrors(['message' => 'Invalid response from AI service']);
        } catch (\Throwable $e) {
            Log::error('Lesson quiz store error: ',  [
                'exception' => $e
            ]);
            return back()->withErrors([
                'message' => 'We couldn’t finish setting up your quiz this time. Please try again, and if the issue continues, contact support.'
            ]);
        }
    }
}
