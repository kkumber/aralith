<?php

namespace App\Http\Controllers;

use App\Models\Quizzes;
use App\Services\UserQuizAttemptService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizAttemptsController extends Controller
{
    public function store(Quizzes $quiz, Request $request, UserQuizAttemptService $attempt)
    {
        $validated = $request->validate([
            'answers' => ['required', 'array', 'min:1'],
        ]);

        $user = auth()->user();

        if (!$user) {
            return back()->with('error', 'Unauthorized');
        }

        $answers = $request->input('answers');

        $questions = $quiz->questions()->select('id', 'correct_answer')->get();

        $questionsArray = [];
        foreach ($questions as $question) {
            $questionsArray[$question->id] = $question->correct_answer;
        };

        $is_correct = $attempt->checkAnswers($answers, $questionsArray);

        $score = $attempt->countScore($is_correct);

        $result = $attempt->saveUserAnswersAndAttempt($quiz->id, $score, $is_correct, $user, $questionsArray, $answers);

        dd($result);
    }

    public function show(Quizzes $quiz)
    {

        return Inertia::render('quiz/attempts/show');
    }
}
