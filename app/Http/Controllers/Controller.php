<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class Controller extends BaseController
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
		if (env('APP_DEBUG') == true) $this->isDevelopment = true;
		$this->autoCompleteResultLimit = env('AUTO_COMPLETE_RESULT_LIMIT', 5);
		$this->runTasks();
	}

	public function __destruct()
	{
	}

	public function runTasks()
	{
		$run_tasks_interval = (int)env('RUN_TASK_INTERVAL', 60);
		$is_api_call = Str::startsWith(request()->path(), 'api');
		$now = Carbon::now();

		$last_run_tasks_at = Cache::has('last_run_tasks_at')
			? Carbon::parse(Cache::get('last_run_tasks_at'))
			: $now;
		if ($last_run_tasks_at == $now) Cache::put('last_run_tasks_at', $now->format('Y-m-d H:i:s'));
		if (
			$last_run_tasks_at->addSeconds($run_tasks_interval)->lessThan($now)
			&& $is_api_call
		) {
			foreach ($this->tasks as $task) {
				Artisan::call($task);
			}
			Cache::put('last_run_tasks_at', $now->format('Y-m-d H:i:s'));
		}
	}

	public function getUser()
	{
		return request()->user();
	}
}
