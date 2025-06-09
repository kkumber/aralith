<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAnswers extends Model
{
    //
    protected $fillable = [
        'quizAttempts_id',
        'questions_id',
        'answer_text',
        'is_correct'
    ];

    public function quizAttempts(): BelongsTo
    {
        return $this->belongsTo(QuizAttempts::class);
    }

    public function questions(): BelongsTo
    {
        return $this->belongsTo(Questions::class);
    }
}
