<?php

namespace App\Http\Requests\SchoolClass;

use App\Traits\CustomValidateResponse;
use Illuminate\Foundation\Http\FormRequest;

class IndexRequest extends FormRequest
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
			'per_page' => ['required', 'integer', 'in:10,20,30,40,50'],
			'page' => ['nullable', 'integer'],
			'search' => ['nullable', 'string'],
		];
	}
}
