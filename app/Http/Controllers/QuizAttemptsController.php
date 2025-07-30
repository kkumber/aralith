<?php

namespace App\Http\Controllers;

use App\Models\Quizzes;
use Illuminate\Http\Request;

class QuizAttemptsController extends Controller
{
    public function store(Quizzes $quiz, Request $request)
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

        $is_correct = [];
        // Loop through both answers and questions array and compare their values via key
        foreach ($answers as $key => $value) {
            if (!isset($answers[$key]) || empty($answers[$key])) {
                $is_correct[$key] = false;
            } else if (is_array($answers[$key])) {
                $is_correct[$key] = empty(array_diff($answers[$key], $questionsArray[$key])) && empty(array_diff($questionsArray[$key], $answers[$key]));
            } else if (is_string($answers[$key])) {
                $is_correct[$key] = strtolower(trim($answers[$key])) === strtolower(trim($questionsArray[$key]));
            } else {
                $is_correct[$key] = false;
            }
        }
        dd($answers, $questionsArray, $is_correct);


        // Validate the answers against the correct answers from questions might just query correct answer column?
        // validate answers id vs questions id.
        // compare answers value vs correct answer value
        // set is_correct to true or false for UserAnswers
        // set score by counting true correct answers.
        $user = auth()->user();
    }
}
