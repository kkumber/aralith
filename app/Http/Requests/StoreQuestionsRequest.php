<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuestionsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'questions' => ['required', 'array'],
            'questions.*.type' => [
                'required',
                Rule::in([
                    'Multiple Choice',
                    'True/False',
                    'Fill in the blank',
                    'Identification',
                    'Multiple Answers',
                    'Mixed',
                ]),
            ],
            'questions.*.question_text' => ['required', 'string'],
            'questions.*.explanation' => ['required', 'string'],
            'questions.*.options' => ['required', 'array'],
            'questions.*.correct_answer' => ['required'],
        ];
    }
}
