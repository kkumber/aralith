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
     * @param Quizzes $quiz
     * @param GoogleFormService $googleFormService
     * @return \Illuminate\Http\JsonResponse
     */
    public function exportQuizToGoogleForms(Quizzes $quiz, GoogleFormService $googleFormService)
    {
        try {
            // Authorization checks
            if (!auth()->user()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Check quiz ownership
            if ($quiz->user_id !== auth()->id()) {
                return response()->json(['error' => 'You do not have permission to export this quiz'], 403);
            }

            // Check if quiz has questions
            if ($quiz->questions->isEmpty()) {
                return response()->json(['error' => 'Cannot export quiz without questions'], 400);
            }

            // Export to Google Forms
            $result = $googleFormService->sendQuizToGoogleForm($quiz);

            // Update quiz config with Google Form details
            $config = $quiz->config ?? [];
            $config['google_form_id'] = $result['formId'] ?? null;
            $config['google_form_url'] = $result['formUrl'] ?? null;
            $config['google_form_edit_url'] = $result['editUrl'] ?? null;
            $config['exported_at'] = now()->toISOString();

            $quiz->update(['config' => $config]);

            return response()->json([
                'success' => true,
                'data' => [
                    'message' => 'Quiz successfully exported to Google Forms',
                    'form_id' => $result['formId'] ?? null,
                    'form_url' => $result['formUrl'] ?? null,
                    'edit_url' => $result['editUrl'] ?? null,
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Quiz export error', [
                'quiz_id' => $quiz->id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to export quiz: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get responses from Google Forms
     * 
     * @param Quizzes $quiz
     * @param GoogleFormService $googleFormService
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFormResponses(Quizzes $quiz, GoogleFormService $googleFormService)
    {
        try {
            $config = $quiz->config ?? [];
            $formId = $config['google_form_id'] ?? null;

            if (!$formId) {
                return response()->json(['error' => 'Quiz has not been exported to Google Forms'], 400);
            }

            $responses = $googleFormService->getFormResponses($formId);

            return response()->json([
                'success' => true,
                'data' => $responses
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

/* 
// Export quiz (POST)
fetch('/quizzes/123/export-google-forms', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.meta['csrf-token']
    }
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('Form URL:', data.data.form_url);
    }
});

// Get responses (GET)
fetch('/quizzes/123/google-form-responses')
.then(response => response.json())
.then(data => console.log(data));

*/
