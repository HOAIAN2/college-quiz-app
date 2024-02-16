<?php

namespace App\Http\Requests\Chapter;

use App\Traits\CustomValidateResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
			'chapter_number' => [
				'required', 'integer', 'min:1',
				Rule::unique('chapters')->where(function ($query) {
					return $query->where('subject_id', $this->subject_id);
				})->ignore($this->id),
			],
			'name' => ['required', 'string', 'max:255'],
		];
	}
}
