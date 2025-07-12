<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quizzes extends Model
{
    /** @use HasFactory<\Database\Factories\QuizzesFactory> */
    use HasFactory;

    protected $fillable = [
        'lessons_id',
        'title',
        'config',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lessons(): BelongsTo
    {
        return $this->belongsTo(Lessons::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Questions::class);
    }

    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempts::class);
    }
}
