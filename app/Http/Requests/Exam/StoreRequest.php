<?php

namespace App\Http\Requests\Exam;

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
		$chapter_ids_count = is_countable($this->chapter_ids) ? count($this->chapter_ids) : 0;
		return [
			'name' => ['required'],
			'exam_date' => ['required', 'date', "after:$now"],
			'exam_time' => ['required', 'integer', 'min:0'],
			'course_id' => ['required', 'integer'],
			'chapter_ids' => ['required', 'array'],
			'chapter_ids.*' => ['required', 'integer', 'distinct'],
			'question_counts' => ['required', 'array', "min:$chapter_ids_count", "max:$chapter_ids_count"],
			'question_counts.*' => ['required', 'integer', 'min:1'],
		];
	}
}
