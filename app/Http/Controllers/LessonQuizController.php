<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLessonQuizRequest;
use App\Services\AiService;
use App\Services\LessonQuizService;
use Illuminate\Http\Request;
use Exception;

class LessonQuizController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

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

            // Generate questions data first from AI
            $questionsData = $aiService->generateQuestions($validated['quiz_config'], $validated['lesson']['content']);

            // Validate that AI service returned valid data
            if (empty($questionsData) || !is_array($questionsData)) {
                return back()->with('error', 'Failed to generate questions from AI');
            }

            // Save in db
            $result = $lessonQuizService->createLessonQuiz($validated['lesson'], $validated['quiz_config'], $questionsData, $user);

            return redirect()->route('lesson.show', $result['lesson']->id)->with('success', true)->with('result', $result);
        } catch (Exception $e) {
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
    }
}
