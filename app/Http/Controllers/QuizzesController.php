<?php

namespace App\Http\Controllers;

use App\Models\Quizzes;
use App\Http\Requests\StoreQuizzesRequest;
use App\Http\Requests\UpdateQuizzesRequest;
use Inertia\Inertia;
use Exception;
use App\Helpers\ApiResponse;

class QuizzesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('quiz/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuizzesRequest $request)
    {
        try {
            $validated = $request->validated();

            $quiz = Quizzes::create($validated);

            return to_route('lesson.show')->with('success', 'Quiz saved!')->with('quiz', $quiz);
            // MIght redirect to show
        } catch (Exception $e) {
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Quizzes $quizzes)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Quizzes $quizzes)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuizzesRequest $request, Quizzes $quizzes)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quizzes $quizzes)
    {
        //
    }
}
