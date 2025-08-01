<?php

namespace App\Http\Controllers;

use App\Models\Quizzes;
use App\Http\Requests\StoreQuizzesRequest;
use App\Http\Requests\UpdateQuizzesRequest;
use Inertia\Inertia;
use Exception;
use App\Helpers\ApiResponse;
use App\Models\Lessons;
use App\Services\GoogleFormService;
use Illuminate\Support\Facades\Log;

class QuizzesController extends Controller
{

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('quiz/create');
    }

    /**
     * Display the specified resource.
     */
    public function show(Lessons $lesson)
    {
        if ($lesson->user_id !== auth()->user()->id || !auth()->user()) {
            return back()->with('error', 'Unauthorized access to this lesson');
        }

        $quiz = $lesson->quizzes()->with('questions:id,quizzes_id,type,question_text,options')->firstOrFail();

        return Inertia::render('quiz/show', ['quiz' => $quiz]);
    }

    /**
     * Export quiz to Google Forms
     * 
     * @param Lessons $lesson
     * @param GoogleFormService $googleFormService
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportQuizToGoogleForms(Lessons $lesson, GoogleFormService $googleFormService)
    {
        try {
            // Generate the Apps Script code
            $scriptData = $googleFormService->generateAppsScript($lesson);

            // Return the script and instructions to the frontend
            return Inertia::render('quiz/google-form-export-instructions', [
                'lesson' => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'created_at' => $lesson->created_at->format('M d, Y')
                ],
                'script' => $scriptData['script'],
                'instructions' => $scriptData['instructions'],
                'metadata' => [
                    'lesson_title' => $scriptData['lesson_title'],
                    'quiz_count' => $scriptData['quiz_count'],
                    'total_questions' => $scriptData['total_questions'],
                    'generated_at' => now()->format('M d, Y \a\t g:i A')
                ]
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to generate Google Forms script: ' . $e->getMessage());
        }
    }

    /**
     * Download the Apps Script as a .gs file
     */
    public function downloadGoogleScript(Lessons $lesson, GoogleFormService $googleFormService)
    {
        try {
            $scriptData = $googleFormService->generateAppsScript($lesson);

            $filename = 'Quiz_' . str_replace(' ', '_', $lesson->title) . '_GoogleScript.gs';

            return response($scriptData['script'])
                ->header('Content-Type', 'application/javascript')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to download Google Forms script: ' . $e->getMessage());
        }
    }

    /**
     * Get script preview via AJAX
     */
    public function previewGoogleScript(Lessons $lesson, GoogleFormService $googleFormService)
    {
        try {
            $scriptData = $googleFormService->generateAppsScript($lesson);

            return response()->json([
                'success' => true,
                'script' => $scriptData['script'],
                'metadata' => [
                    'quiz_count' => $scriptData['quiz_count'],
                    'total_questions' => $scriptData['total_questions']
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
