<?php

namespace App\Http\Requests\Exam;

use App\Rules\AttributeSumMin;
use App\Traits\CustomValidateResponse;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    use CustomValidateResponse;
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
        $now = Carbon::now()->toDateTimeString();
        $max_questions = array_sum($this->question_counts);
        return [
            'name' => ['required'],
            'exam_date' => ['required', 'date', "after:$now"],
            'exam_time' => ['required', 'integer', 'min:0'],
            'course_id' => ['required', 'integer'],
            'question_counts' => ['required', 'array', 'min:1', new AttributeSumMin(1)],
            'question_counts.*' => ['nullable', 'integer', 'min:1'],
            'supervisor_ids' => ['required', 'array'],
            'supervisor_ids.*' => ['required', 'integer', 'distinct'],
            'expert_count' => ['nullable', 'integer', "max:$max_questions"],
            'hard_count' => ['nullable', 'integer', "max:$max_questions"],
            'medium_count' => ['nullable', 'integer', "max:$max_questions"],
        ];
    }
}
