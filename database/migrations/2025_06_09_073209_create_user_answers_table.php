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

    Schema::create('quiz_attempts', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('quizzes_id')->constrained()->onDelete('cascade');
      $table->integer('score');
      $table->timestamps();
    });

    Schema::create('user_answers', function (Blueprint $table) {
      $table->id();
      $table->foreignId('quiz_attempts_id')->constrained()->onDelete('cascade');
      $table->foreignId('questions_id')->constrained()->onDelete('cascade');
      $table->text('answer_text')->nullable();
      $table->boolean('is_correct');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('quizAttempts');
    Schema::dropIfExists('user_answers');
  }
};
