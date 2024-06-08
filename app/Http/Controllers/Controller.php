<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;

abstract class Controller extends BaseController
{
	use AuthorizesRequests, ValidatesRequests;

	public bool $isDevelopment = false;
	public int $autoCompleteResultLimit = 0;

	public $tasks = [
		'app:clear-unsed-tokens',
		'app:cancel-late-exams'
	];

	public function __construct()
	{
		if (config('app.debug', true) == true) $this->isDevelopment = true;
		$this->autoCompleteResultLimit = (int)env('AUTO_COMPLETE_RESULT_LIMIT', 5);
	}

	public function getUser(): mixed
	{
		return Auth::user();
	}
}
