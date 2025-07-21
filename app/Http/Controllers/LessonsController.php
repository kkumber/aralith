<?php

namespace App\Http\Controllers;

use App\Models\Lessons;
use App\Http\Requests\StoreLessonsRequest;
use App\Http\Requests\UpdateLessonsRequest;
use App\Services\LessonQuizService;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LessonsController extends Controller
{

    public function home()
    {
        return Inertia::render('main');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->user()->id;
        $lessons = Lessons::where('user_id', $userId)->latest()->paginate(10);
        return Inertia::render('history', ['lessons' => $lessons]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLessonsRequest $request) {}

    /**
     * Display the specified resource.
     */
    public function show(Lessons $lesson)
    {
        return Inertia::render('lesson', ['lesson' => $lesson]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lessons $lessons)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLessonsRequest $request, Lessons $lessons)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lessons $lessons)
    {
        //
    }
}
