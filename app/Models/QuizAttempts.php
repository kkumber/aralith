<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizAttempts extends Model
{
    //

    protected $fillable = [
        'quiz_id',
        'score'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function quizzes(): BelongsTo
    {
        return $this->belongsTo(Quizzes::class);
    }

    public function userAnswers(): HasMany
    {
        return $this->hasMany(UserAnswers::class);
    }
}
