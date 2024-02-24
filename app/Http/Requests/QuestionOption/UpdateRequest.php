<?php

namespace App\Http\Requests\QuestionOption;

use App\Traits\CustomValidateResponse;
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
		return [
			'question_id' => ['required', 'integer'],
			'content' => ['required'],
			'is_correct' => ['required', 'in:1,0']
		];
	}
}
