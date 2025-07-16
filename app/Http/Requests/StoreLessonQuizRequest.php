<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonQuizRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Lesson validation
            'lesson' => ['required', 'array'],
            'lesson.title' => ['required', 'string', 'max:50'],
            'lesson.content' => ['required', 'string'],

            // Quiz Config Validation
            'quiz_config' => ['required', 'array'],
            'quiz_config.title' => ['required', 'string', 'max:50'],
            'quiz_config.config' => ['required', 'array'],
            'quiz_config.config.question_types' => ['required', 'array', 'min:1'],
            'quiz_config.config.question_types.*' => ['required', 'string'],
            'quiz_config.config.difficulty' => ['required', 'string'],
            'quiz_config.config.total_number_of_questions' => ['required', 'integer', 'min:1', 'max:50'],
            'quiz_config.config.random_order' => ['required', 'boolean'],
        ];
    }
}
