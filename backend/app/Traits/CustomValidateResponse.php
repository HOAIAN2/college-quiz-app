<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;

trait CustomValidateResponse
{
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => $validator->errors()->first(),
            'errors' => $validator->errors(),
        ], 422));
    }

    // protected function prepareForValidation(): void
    // {
    //     $data = $this->all();
    //     $rules = $this->rules();

    //     if (App::getLocale() == 'vi') {
    //         foreach ($rules as $key => $rule_set) {
    //             if (is_array($rule_set) && in_array('date', $rule_set)) {
    //                 $data[$key] = Str::replace('/', '-', $data[$key]);
    //             } elseif (is_string($rule_set) && Str::contains($rule_set, 'date')) {
    //                 $data[$key] = Str::replace('/', '-', $data[$key]);
    //             }
    //         }
    //     }

    //     $this->merge($data);
    // }
}
