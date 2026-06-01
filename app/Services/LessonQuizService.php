<?php

namespace App\Services;

use App\Models\Lessons;
use App\Models\Quizzes;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Throwable;
use Illuminate\Support\Facades\Log;

class LessonQuizService
{
    public function createLessonSummaryFlashcardQuiz(array $lessonData, array $quizData, array $questionsData, array $flashcardsData, User $user)
    {
        try {

            // Convert each element from questionsData to associative array.
            $questionArray = [];
            foreach ($questionsData as $key => $value) {
                $questionArray[$key] = (array) $value;
            };

            $flashcardsArray = [];
            foreach ($flashcardsData as $key => $value) {
                $flashcardsArray[$key] = (array) $value;
            };

            return DB::transaction(function () use ($lessonData, $quizData, $questionArray, $flashcardsArray, $user) {
                $lesson = $user->lessons()->create($lessonData);
                $quiz = $user->quizzes()->create(['lessons_id' => $lesson->id, 'title' => $quizData['title'], 'config' => $quizData['config']]);

                $flashcards = $lesson->flashcard()->createMany($flashcardsArray);

                $questions = $quiz->questions()->createMany($questionArray);

                return [
                    'lesson' => $lesson,
                    'quiz' => $quiz,
                    'questions' => $questions,
                    'flashcards' => $flashcards
                ];
            });
        } catch (\Throwable $e) {
            Log::error('Lesson Quiz Flashcard error:', [
                'exception' => $e->getMessage(),
                'previous'  => $e->getPrevious()?->getMessage(),
                'trace'     => $e->getTraceAsString(),
            ]);

            return null;
        }
    }

    public function bulkDestroyLessonQuiz(User $user, array $lessonIds)
    {
        $lessons = $user->lessons()->whereIn('id', $lessonIds)->get();

        foreach ($lessons as $lesson) {
            if (!$user->can('delete', $lesson)) {
                throw new AuthorizationException('You do not have permission to delete this lesson.');
            };
        };
        return DB::transaction(function () use ($user, $lessonIds) {

            $deleteCount = $user->lessons()->whereIn('id', $lessonIds)->delete();
            return $deleteCount;
        });
    }
}
