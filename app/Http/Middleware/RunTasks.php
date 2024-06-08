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
	public $tasks = [
		'app:clear-unsed-tokens',
		'app:cancel-late-exams'
	];

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
	 */
	public function handle(Request $request, Closure $next): Response
	{
		$run_tasks_interval = (int)env('RUN_TASK_INTERVAL', 60);
		$this->runTasks($run_tasks_interval);
		return $next($request);
	}

	public function runTasks(int $run_tasks_interval)
	{
		$now = Carbon::now();

		$last_run_tasks_at = Cache::has('last_run_tasks_at')
			? Carbon::parse(Cache::get('last_run_tasks_at'))
			: $now;
		if ($last_run_tasks_at == $now) Cache::put('last_run_tasks_at', $now->format('Y-m-d H:i:s'));
		if (
			$last_run_tasks_at->addSeconds($run_tasks_interval)->lessThan($now)
			|| $last_run_tasks_at == $now
		) {
			foreach ($this->tasks as $task) {
				Artisan::call($task);
			}
			Cache::put('last_run_tasks_at', $now->format('Y-m-d H:i:s'));
		}
	}
}
