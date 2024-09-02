<?php

namespace App\Http\Controllers;

use App\Helper\Reply;
use Illuminate\Support\Facades\Log;

abstract class Controller
{
	protected int $autoCompleteResultLimit = 0;
	protected int $defaultLimit = 50;

	public function __construct()
	{
		$this->autoCompleteResultLimit = (int)env('AUTO_COMPLETE_RESULT_LIMIT', 5);
		$this->defaultLimit = (int) env('DEFAULT_QUERY_LIMIT', 50);
	}

	public function getUser(): mixed
	{
		return auth('sanctum')->user();
	}

	public function handleException(\Exception $error)
	{
		Log::error($error);
		$message = config('app.debug') ? $error->getMessage() : 'app.errors.something_went_wrong';
		return Reply::error($message, [], 500);
	}
}
