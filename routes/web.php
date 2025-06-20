<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\QuizzesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/index', function () {
    return view('landing');
})->name('home');

Route::get('/welcome', function () {
    return Inertia::render('welcome');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('main');
    })->name('main');

    Route::resource('quiz', QuizzesController::class);
});




require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
