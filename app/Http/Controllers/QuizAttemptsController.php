<?php

namespace App\Http\Controllers;

use App\Models\Quizzes;
use Illuminate\Http\Request;

class QuizAttemptsController extends Controller
{
    public function store(Quizzes $quiz, Request $request)
    {
        $answers = $request->input('answers');
        // Select * from questions where (quizzes_id = $quiz->id);
        $quiz->load('questions');

        dd($quiz->questions);
        $user = auth()->user();
    }
}
