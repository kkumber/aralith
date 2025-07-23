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
use Illuminate\Auth\Access\AuthorizationException

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
        $this->authorize('delete', $lesson);

        try {
            $lesson->delete();
            return back()->with('success', 'Lesson deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete lesson. Please try again.');
        }
    }

    public function bulkDestroy(Request $request, LessonQuizService $lessonQuizService)
    {
        $validated = $request->validate([
            'lesson_ids' => ['required', 'array'],
            'lesson_ids.*' => ['exists:lessons,id']
        ]);

        try {
            $deleted = $lessonQuizService->bulkDestroyLessonQuiz(auth()->user(), $validated['lesson_ids']);
            return back()->with('delete', count($deleted) . ' lessons deleted');

        } catch (AuthorizationException $e) {
            abort(403, $e->getMessage());
            
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete lessons. Please try again.');
        }
    }
}
