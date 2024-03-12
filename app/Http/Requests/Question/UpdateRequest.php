<?php

namespace App\Http\Requests\Question;

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
		$maxIndex = $this->options != null ? count($this->options) - 1 : 0;
		return [
			'chapter_id' => ['nullable', 'integer'],
			'level' => ['required', 'in:easy,medium,hard,expert'],
			'content' => ['required'],
			'options' => ['required', 'array', 'min:2'],
			'options.*' => ['required', 'distinct'],
			'true_option' => ['required', 'integer', 'min:0', 'max:' . $maxIndex],
		];
	}
}
