<?php

namespace App\Http\Controllers;

use App\Models\Lessons;
use App\Http\Requests\StoreLessonsRequest;
use App\Http\Requests\UpdateLessonsRequest;
use App\Services\LessonQuizService;
use Exception;
use Illuminate\Http\Request;
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
    public function edit(Lessons $lesson)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLessonsRequest $request, Lessons $lesson)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lessons $lesson)
    {
        //
    }

    public function bulktDestroy(Request $request)
    {
        $validate = $request->validate([
            'lesson_ids' => ['required', 'array'],
            'lesson_ids.*' => ['exists:lessons,id']
        ]);

        $lessonIds = $validate['lesson_ids'];

        $lessons = Lessons::whereIn('id', $lessonIds)->get();

        foreach ($lessons as $lesson) {
            if (!auth()->user()->can('delete', $lesson)) {
                abort(403, 'You are not authorized to delete this lesson');
            };
        };

        Lessons::whereIn('id', $lessonIds)->delete();

        return back()->with('delete', count($lessonIds) . ' lessons deleted');
    }
}
