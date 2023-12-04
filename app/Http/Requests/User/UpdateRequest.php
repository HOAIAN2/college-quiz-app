<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
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
            'shortcode' => ['required', 'string', 'unique:users', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'first_name' => ['required', 'max:255'],
            'last_name' => ['required', 'max:255'],
            'phone_numeber' => ['string', 'unique:users', 'max:10'],
            'gender' => ['required', 'in:male,female'],
            'address' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date_format:Y-m-d', 'before:today'],
            'class' => ['required_if:role,student', 'max:255'],
            'faculty' => ['required_if:role,teacher', 'max:255'],
            'password' => ['required', 'min:8']
        ];
    }
}
