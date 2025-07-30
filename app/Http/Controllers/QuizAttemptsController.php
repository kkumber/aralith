<?php

namespace App\Http\Controllers;

use App\Models\Quizzes;
use App\Services\UserQuizAttemptService;
use Illuminate\Http\Request;

class QuizAttemptsController extends Controller
{
    public function store(Quizzes $quiz, Request $request, UserQuizAttemptService $attempt)
    {
        $validated = $request->validate([
            'answers' => ['required', 'array', 'min:1'],
        ]);

        $answers = $request->input('answers');

        $questions = $quiz->questions()->select('id', 'correct_answer')->get();

        $questionsArray = [];
        foreach ($questions as $question) {
            $questionsArray[$question->id] = $question->correct_answer;
        };

        $is_correct = $attempt->checkAnswers($answers, $questionsArray);

        $score = $attempt->countScore($is_correct);
        dd($answers, $questionsArray, $is_correct, $score);


        // set score by counting true correct answers.
        $user = auth()->user();
    }
}
