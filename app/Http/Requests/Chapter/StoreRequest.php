<?php

namespace App\Http\Requests\Chapter;

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
			'subject_id' => ['required', 'integer'],
			'chapter_number' => ['required', 'string', 'max:255'],
			'name' => ['required', 'string', 'max:255'],
		];
	}
}
