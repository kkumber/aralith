<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLessonQuizRequest;
use App\Models\Lessons;
use App\Services\AiService;
use App\Services\LessonQuizService;
use Illuminate\Http\Request;
use Exception;
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
                return back()->with('error', 'Unauthorized');
            }

            // Generate summary from lesson content
            $summary = json_decode($aiService->generateSummary($validated['lesson']['content']), true);

            if (empty($summary) || !is_array($summary)) {
                return back()->with('error', 'Failed to generate summary from AI');
            }

            // Generate flashcard from lesson content
            $flashcards = json_decode($aiService->generateFlashcards($validated['lesson']['content']));

            if (empty($flashcards) || !is_array($flashcards)) {
                return back()->with('error', 'Failed to generate flashcards from AI');
            }

            // Generate questions data first from AI
            $questionsData = json_decode($aiService->generateQuestions($validated['quiz_config'], $validated['lesson']['content']));

            if (empty($questionsData) || !is_array($questionsData)) {
                return back()->with('error', 'Failed to generate questions from AI');
            }

            // Save in db
            $result = $lessonQuizService->createLessonSummaryFlashcardQuiz(
                array_merge($validated['lesson'], $summary),
                $validated['quiz_config'],
                $questionsData,
                $flashcards,
                $user
            );

            return redirect()->route('lesson.show', $result['lesson']->id)
                ->with('success', 'Lesson created successfully');
        } catch (\JsonException $e) {
            return back()->with('error', 'Invalid response from AI service');
        } catch (\Exception $e) {
            Log::error('Failed to create lesson: ' . $e->getMessage());
            return back()->with('error', 'Something went wrong. Please try again.');
        }
    }
}
