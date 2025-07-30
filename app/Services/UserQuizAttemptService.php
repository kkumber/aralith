<?php

namespace App\Services;

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
}
