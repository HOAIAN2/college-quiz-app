<?php

namespace App\Http\Requests\Exam;

use App\Traits\CustomValidateResponse;
use Illuminate\Foundation\Http\FormRequest;

class UpdateStatusRequest extends FormRequest
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
			'status' => ['required', 'in:start,cancel']
		];
	}
}
