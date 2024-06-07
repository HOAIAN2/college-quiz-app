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

	protected function prepareForValidation(): void
	{
		$data = $this->all();

		foreach ($data as $key => $value) {
			if (Str::contains($key, 'date') && App::getLocale() == 'vi') {
				$data[$key] = Str::replace('/', '-', $value);
			}
		}

		$this->merge($data);
	}
}
