<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Questions extends Model
{
    /** @use HasFactory<\Database\Factories\QuestionsFactory> */
    use HasFactory;

    protected $fillable = [
        'type',
        'question_text',
        'explanation',
        'options',
        'correct_answer'
    ];

    protected $casts = [
        'options' => 'array',
        'correct_answer' => 'array'
    ];

    public function quizzes(): BelongsTo
    {
        return $this->belongsTo(Quizzes::class);
    }
}
