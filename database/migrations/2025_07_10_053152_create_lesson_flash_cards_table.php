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
        Schema::create('lesson_flash_cards', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('lessons_id')->constrained()->onDelete('cascade');
            $table->string('question');
            $table->text('answer');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_flash_cards');
    }
};
