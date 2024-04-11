<?php

namespace App\Http\Requests\Exam;

use App\Traits\CustomValidateResponse;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
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
		return [
			'name' => ['required'],
			'exam_date' => ['required', 'date', "after:$now"],
			'exam_time' => ['required', 'integer', 'min:0'],
			'supervisor_ids' => ['required', 'array'],
		];
	}
}
