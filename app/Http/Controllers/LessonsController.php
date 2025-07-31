<?php

namespace App\Http\Controllers;

use App\Models\Lessons;
use App\Http\Requests\StoreLessonsRequest;
use App\Http\Requests\UpdateLessonsRequest;
use App\Models\QuizAttempts;
use App\Services\LessonQuizService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class LessonsController extends Controller
{
    use AuthorizesRequests;

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
        $lessons = Lessons::where('user_id', $userId)->latest()->paginate(20);
        return Inertia::render('history', ['lessons' => $lessons]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lessons $lesson)
    {
        $user = auth()->user();

        if (!$user) {
            return back()->with('error', 'Unauthorized');
        }

        if ($user->id !== $lesson->user_id) {
            return back()->with('error', 'Unauthorized access to this lesson');
        }

        $lesson->load('flashcard');
        $quizAttempts = QuizAttempts::whereHas('quizzes', function ($query) use ($lesson) {
            $query->where('lessons_id', $lesson->id);
        })->where('user_id', $user->id)->get();
        $quizAttempts->load('userAnswers');

        return Inertia::render('lesson', ['lesson' => $lesson, 'quizAttempts' => $quizAttempts]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lessons $lesson)
    {
        $this->authorize('delete', $lesson);

        try {
            $lesson->delete();
            return back();
        } catch (\Exception $e) {
            return back();
        }
    }

    public function bulkDestroy(Request $request, LessonQuizService $lessonQuizService)
    {
        try {
            $validated = $request->validate([
                'lesson_ids' => ['required', 'array'],
                'lesson_ids.*' => ['exists:lessons,id']
            ]);

            $deleted = $lessonQuizService->bulkDestroyLessonQuiz(auth()->user(), $validated['lesson_ids']);
            return back();
        } catch (AuthorizationException $e) {
            abort(403, $e->getMessage());
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Failed to delete lesson. Please try again.']);
        }
    }

    public function searchLesson(Request $request)
    {
        $searchedItem = $request->input('search');
        $userId = auth()->user()->id;

        // Select * from Lessons WHERE user_id = $userId AND title LIKE '%searchedItem%'
        $lessons = Lessons::where('user_id', $userId)
            ->where('title', 'like', '%' . $searchedItem . '%')
            ->latest()
            ->paginate(10);

        return Inertia::render('history', [
            'lessons' => $lessons,
        ]);
    }
}
