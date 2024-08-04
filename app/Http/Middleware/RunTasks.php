<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class RunTasks
{
	const TASKS = [
		'app:clear-unsed-tokens',
		'app:cancel-late-exams',
		'app:backup-database --once-per-day'
	];
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
	 */
	public function handle(Request $request, Closure $next): Response
	{
		$run_tasks_interval = env('RUN_TASK_INTERVAL');
		if ($run_tasks_interval == null) return $next($request);
		$this->runTasks((int)$run_tasks_interval);
		return $next($request);
	}

	public function runTasks(int $run_tasks_interval)
	{
		$now = Carbon::now();

		$last_run_tasks_at = Cache::has('last_run_tasks_at') ? Carbon::parse(Cache::get('last_run_tasks_at')) : $now;
		if ($last_run_tasks_at->equalTo($now) || $last_run_tasks_at->addSeconds($run_tasks_interval)->lessThanOrEqualTo($now)) {
			foreach (self::TASKS as $task) {
				Artisan::call($task);
			}
			Artisan::call('schedule:run');
			Cache::put('last_run_tasks_at', $now->toDateTimeString());
		}
	}
}
