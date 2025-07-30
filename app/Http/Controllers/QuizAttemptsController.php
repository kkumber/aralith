<?php

namespace App\Http\Controllers;

use App\Models\Quizzes;
use App\Services\QuizAnswerCheckerService;
use Illuminate\Http\Request;

class QuizAttemptsController extends Controller
{
    public function store(Quizzes $quiz, Request $request, QuizAnswerCheckerService $checker)
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

        $is_correct = $checker->checkAnswers($answers, $questionsArray);


        dd($answers, $questionsArray, $is_correct);


        // Validate the answers against the correct answers from questions might just query correct answer column?
        // validate answers id vs questions id.
        // compare answers value vs correct answer value
        // set is_correct to true or false for UserAnswers
        // set score by counting true correct answers.
        $user = auth()->user();
    }
}
