<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLessonQuizRequest;
use App\Models\Lessons;
use App\Services\AiService;
use App\Services\LessonQuizService;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


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

            $summary = json_decode($aiService->generateSummary($validated['lesson']['content']), true);
            if (empty($summary) || !is_array($summary)) {
                throw ValidationException::withMessages([
                    'message' => 'Failed to generate summary from AI. Please try again.'
                ]);
            }

            $flashcards = json_decode($aiService->generateFlashcards($validated['lesson']['content']), true);
            if (empty($flashcards) || !is_array($flashcards)) {
                throw ValidationException::withMessages([
                    'message' => 'Failed to generate flashcards from AI. Please try again.'
                ]);
            }

            $questionsData = json_decode($aiService->generateQuestions($validated['quiz_config'], $validated['lesson']['content']), true);
            if (empty($questionsData) || !is_array($questionsData)) {
                throw ValidationException::withMessages([
                    'message' => 'Failed to generate questions from AI. Please try again.'
                ]);
            }

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
            return back()->withErrors(['message' => 'We had trouble creating your quiz. Please try again later.']);
        }
    }
}
