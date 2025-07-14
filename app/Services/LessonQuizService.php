<?php

namespace App\Services;

use App\Models\Lessons;
use App\Models\Quizzes;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LessonQuizService
{
    public function createLessonQuiz(array $lessonData, array $quizData, array $questionsData, User $user)
    {
        return DB::transaction(function () use ($lessonData, $quizData, $questionsData, $user) {
            $lesson = $user->lessons()->create($lessonData);
            $quiz = $lesson->quizzes()->create([...$quizData, 'user_id' => $user->id]);
            $questions = $quiz->questions()->createMany($questionsData);
            return [
                'lesson' => $lesson,
                'quiz' => $quiz,
                'questions' => $questions
            ];
        });
    }
}
