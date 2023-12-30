<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class ExportRequest extends FormRequest
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
            'role' => ['required', 'string', 'in:student,teacher,admin'],
            'file_name' => ['nullable'],
            'shortcode' => ['required', 'in:1,0'],
            'email' => ['required', 'in:1,0'],
            'first_name' => ['required', 'in:1,0'],
            'last_name' => ['required', 'in:1,0'],
            'phone_number' => ['required', 'in:1,0'],
            'gender' => ['required', 'in:1,0'],
            'address' => ['required', 'in:1,0'],
            'birth_date' => ['required', 'in:1,0'],
            'school_class_id' => ['required', 'in:1,0'],
            'faculty_id' => ['required', 'in:1,0'],
            'is_active' => ['required', 'in:1,0'],
        ];
    }
}
