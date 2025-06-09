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
            $table->enum('type', ['mcq', 'true_false', 'fill_in_blank', 'identification', 'definition']);
            $table->text('question_text');
            $table->text('explanation');
            $table->jsonb('options');
            $table->string('correct_answer');
            $table->jsonb('ai_meta');
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
