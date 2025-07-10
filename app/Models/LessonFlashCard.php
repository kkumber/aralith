<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonFlashCard extends Model
{
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lessons::class);
    }
}
