<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
	use AuthorizesRequests, ValidatesRequests;

	public bool $isDevelopment = false;
	public int $autoCompleteResultLimit = 0;

	public function __construct()
	{
		if (config('app.debug', true) == true) $this->isDevelopment = true;
		$this->autoCompleteResultLimit = (int)env('AUTO_COMPLETE_RESULT_LIMIT', 5);
	}

	public function getUser(): mixed
	{
		return auth()->user();
	}
}
