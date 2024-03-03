<?php

namespace App\Http\Requests\Course;

use App\Traits\CustomValidateResponse;
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
		return [
			'teacher_id' => ['required', 'integer'],
			'subject_id' => ['required', 'integer'],
			'semester_id' => ['required', 'integer'],
			'shortcode' => ['required'],
			'name' => ['required']
		];
	}
}
