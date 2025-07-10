<?php

namespace App\Services;

use App\Models\Lessons;

class LessonService
{
    public function createLesson(array $lessonData)
    {
        return Lessons::create($lessonData);
    }
}
