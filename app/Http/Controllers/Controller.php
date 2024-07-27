<?php

namespace App\Http\Controllers;

use App\Helper\Reply;
use Illuminate\Support\Facades\Log;

abstract class Controller
{
	public int $autoCompleteResultLimit = 0;

	public function __construct()
	{
		$this->autoCompleteResultLimit = (int)env('AUTO_COMPLETE_RESULT_LIMIT', 5);
	}

	public function getUser(): mixed
	{
		return auth()->user();
	}

	public function handleException(\Exception $error)
	{
		Log::error($error);
		$message = config('app.debug') ? $error->getMessage() : 'app.errors.something_went_wrong';
		return Reply::error($message, [], 500);
	}
}
