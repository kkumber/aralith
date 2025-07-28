<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\LessonQuizController;
use App\Http\Controllers\LessonsController;
use App\Http\Controllers\QuizzesController;
use App\Models\Lessons;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/index', function () {
    return view('landing');
})->name('home');

Route::get('/welcome', function () {
    return Inertia::render('welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Standalone Routes
    Route::get('/', [LessonsController::class, 'home'])->name('main');

    // Quiz Page Route
    Route::get('/lessons/{lesson}/quiz', [QuizzesController::class, 'show'])
        ->name('quiz.show');

    // Lesson History Routes
    Route::post('/lessons/bulk-destroy', [LessonsController::class, 'bulkDestroy'])->name('lesson.bulkDestroy');
    Route::post('/lessons/search', [LessonsController::class, 'searchLesson'])->name('lesson.search');

    // Resource Routes
    Route::resource('lesson', LessonsController::class);
    Route::resource('quiz', QuizzesController::class)->except('show');
    Route::resource('lesson-quiz', LessonQuizController::class);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
