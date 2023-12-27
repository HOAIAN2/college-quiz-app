<?php

namespace App\Http\Requests\Subject;

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
        $parameters = $this->route()->parameters;
        return [
            'shortcode' => ['required', 'string', 'unique:subjects,shortcode,' . $parameters['id'], 'max:255'],
            'name' => ['required', 'string', 'max:255'],
        ];
    }
}
