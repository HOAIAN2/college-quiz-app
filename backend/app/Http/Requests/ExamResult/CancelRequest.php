<?php

namespace App\Http\Requests\ExamResult;

use App\Traits\CustomValidateResponse;
use Illuminate\Foundation\Http\FormRequest;

class CancelRequest extends FormRequest
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
            'password' => ['required', 'string'],
            'cancellation_reason' => ['required', 'string']
        ];
    }
}
