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
            $quiz = $user->quizzes()->create(['lessons_id' => $lesson->id, 'title' => $quizData['title'], 'config' => json_encode($quizData['config'])]);

            // Convert each element from questionsData to associative array.
            $questionArray = [];
            foreach ($questionsData as $key => $value) {
                $questionArray[$key] = (array) $value;
            };

            $questions = $quiz->questions()->createMany($questionArray);
            return [
                'lesson' => $lesson,
                'quiz' => $quiz,
                'questions' => $questions
            ];
        });
    }
}
