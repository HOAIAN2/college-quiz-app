<?php

namespace App\Http\Requests\User;

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
			'shortcode' => ['required', 'string', 'unique:users,shortcode,' . $parameters['id'], 'max:255', 'alpha_dash:ascii'],
			'email' => ['required', 'email',  'unique:users,email,' . $parameters['id']],
			'first_name' => ['required', 'max:255'],
			'last_name' => ['required', 'max:255'],
			'phone_number' => ['nullable', 'string',  'unique:users,phone_number,' . $parameters['id'], 'regex:/^0\d{9}$/'],
			'gender' => ['required', 'in:male,female'],
			'address' => ['required', 'string', 'max:255'],
			'birth_date' => ['required', 'date', 'before:today'],
			'school_class_id' => ['required_if:role,student', 'max:255'],
			'faculty_id' => ['required_if:role,teacher', 'max:255'],
			'is_active' => ['required', 'in:1,0'],
			'password' => ['nullable', 'min:8']
		];
	}
}
