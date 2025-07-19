<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quizzes_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['Multiple Choice', 'True/False', 'Fill in the blank', 'Identification', 'Multiple Answers', 'Mixed']);
            $table->text('question_text');
            $table->text('explanation');
            $table->jsonb('options');
            $table->jsonb('correct_answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
