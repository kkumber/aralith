<?php

namespace App\Http\Controllers;

use App\Models\QuizAttempts;
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

        return redirect()->route('quizAttempt.show', [
            'quiz' => $quiz->id,
            'quizAttempt' => $result['quizAttempt']->id
        ]);
    }

    public function show(Quizzes $quiz, QuizAttempts $quizAttempt)
    {

        $userAnswers = $quizAttempt->userAnswers()->select([
            'id',
            'quiz_attempts_id',
            'questions_id',
            'answer_text',
            'is_correct',
        ])->with('questions:id,quizzes_id,type,question_text,explanation,correct_answer')->get();

        return Inertia::render('quiz/attempts/show', [
            'userAnswers' => $userAnswers,
            'quiz' => $quiz->only(['id', 'title', 'lessons_id']),
            'quizAttempt' => $quizAttempt->only(['id', 'score'])
        ]);
    }
}
