<?php

namespace App\Services;

use App\Models\QuizAttempts;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserQuizAttemptService
{
    public function checkAnswers(array $answers, array $correct_answers)
    {
        $is_correct = [];
        // Loop through both answers and questions array and compare their values via key
        foreach ($answers as $key => $value) {
            if (!isset($answers[$key]) || empty($answers[$key])) {
                $is_correct[$key] = false;
            } else if (is_array($answers[$key])) {
                $is_correct[$key] = empty(array_diff($answers[$key], $correct_answers[$key])) && empty(array_diff($correct_answers[$key], $answers[$key]));
            } else if (is_string($answers[$key])) {
                $is_correct[$key] = strtolower(trim($answers[$key])) === strtolower(trim($correct_answers[$key]));
            } else {
                $is_correct[$key] = false;
            }
        }
        return $is_correct;
    }

    public function countScore(array $is_correct)
    {
        $score = 0;
        // Increment score if value is true
        foreach ($is_correct as $value) {
            if ($value) {
                $score++;
            }
        }
        return $score;
    }

    public function saveUserAnswersAndAttempt(int $quizId, int $score, array $isCorrectData, User $user, array $questionsData, array $answersData)
    {
        return DB::transaction(function () use ($quizId, $score, $isCorrectData, $user, $questionsData, $answersData) {
            $userId = $user->id;
            $quizAttempt = QuizAttempts::create([
                'user_id' => $userId,
                'quizzes_id' => $quizId,
                'score' => $score,
            ]);

            $userAnswers = [];
            foreach ($questionsData as $key => $value) {
                $userAnswers[] = $quizAttempt->userAnswers()->create([
                    'questions_id' => $key,
                    'answer_text' => array_key_exists($key, $answersData) ? implode(', ', $answersData[$key]) : 'N/A',
                    'is_correct' => $isCorrectData[$key] ?? false,
                ]);
            };

            return [
                'quizAttempt' => $quizAttempt,
                'userAnswers' => $userAnswers
            ];
        });
    }
}
