<?php

namespace App\Http\Controllers;

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
}
