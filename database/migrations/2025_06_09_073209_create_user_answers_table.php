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

    Schema::create('quizAttempts', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('quizzes_id')->constrained()->onDelete('cascade');
      $table->integer('score');
      $table->timestamps();
    });

    Schema::create('user_answers', function (Blueprint $table) {
      $table->id();
      $table->foreignId('quizAttempts_id')->constrained()->onDelete('cascade');
      $table->foreignId('questions_id')->constrained()->onDelete('cascade');
      $table->text('answer_text');
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

/* 
array:25 [▼ // app\Http\Controllers\QuizAttemptsController.php:36
  48 => "useState and useEffect"
  49 => "True"
  50 => "useFileProcessor"
  51 => "A warning appears and the text will be truncated"
  52 => "lesson"
  53 => array:4 [▼
    0 => "DragAndDrop"
    1 => "Card"
    2 => "DialogSubmit"
    3 => "InputError"
  ]
  54 => "False"
  55 => "AppLayout"
  56 => "debounce"
  57 => "quiz.create"
  58 => "False"
  59 => "wordCountMin"
  60 => "truncateStringByMaxCount"
  61 => "DialogSubmit"
  62 => array:3 [▼
    0 => "saveToSessionStorage"
    1 => "getWordCount"
    2 => "truncateStringByMaxCount"
  ]
  63 => "True"
  64 => "CardBody"
  65 => "DragAndDrop"
  66 => "AppLayout"
  67 => "It centralizes file handling, error messages, and submission logic"
  68 => "True"
  69 => "Clicking the Submit button"
  70 => "getWordCount"
  71 => "modal text"
  72 => "False"
] */