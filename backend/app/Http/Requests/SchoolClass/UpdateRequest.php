<?php

namespace App\Http\Requests\SchoolClass;

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
		$parameters = $this->route()->parameters;
		return [
			'shortcode' => ['required', 'string', 'unique:school_classes,shortcode,' . $parameters['id'], 'alpha_dash:ascii'],
			'name' => ['required', 'string'],
			'faculty_id' => ['required', 'integer']
		];
	}
}
