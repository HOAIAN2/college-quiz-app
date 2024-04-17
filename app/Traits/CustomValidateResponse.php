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

	protected function getFormatFromLocale($locale)
	{
		$formater = Carbon::now()->getIsoFormats($locale);
		// dd($formater);
		$date_format = $formater['L'];
		$time_format = $formater['LTS'];

		$date_time_format = "$date_format $time_format";

		$date_time_format = Str::of($date_time_format)
			->replaceMatches('/(.)\1+/', '$1')
			->lower()
			->replaceMatches('/y/', 'Y')
			->replaceMatches('/h/', 'H')
			->replaceMatches('/a/', 'A')
			->replace('/(?<=H:)m/', 'i');
		$date_time_format = preg_replace('/(?<=H:)m/', 'i', $date_time_format);
		return $date_time_format;
	}
}
