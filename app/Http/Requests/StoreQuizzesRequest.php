<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuizzesRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:50'],
            'config' => ['required', 'array'],
            'config.question_types' => ['required', 'array'],
            'config.difficulty' => ['required', 'string'],
            'config.total_number_of_questions' => ['required', 'integer'],
            'config.random_order' => ['required', 'boolean'],
        ];
    }
}
