<?php

namespace App\Http\Controllers;

use App\Models\Quizzes;
use App\Http\Requests\StoreQuizzesRequest;
use App\Http\Requests\UpdateQuizzesRequest;
use Inertia\Inertia;
use Exception;
use App\Helpers\ApiResponse;
use App\Models\Lessons;

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
}
