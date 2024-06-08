<?php

namespace App\Providers;

use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

class AppServiceProvider extends ServiceProvider
{
	/**
	 * Register any application services.
	 */
	public function register(): void
	{
		//
	}

	/**
	 * Bootstrap any application services.
	 */
	public function boot(): void
	{
		RateLimiter::for('api', function (Request $request) {
			return Limit::perMinute(env('DEFAULT_RATE_LIMIT', 100))->by($request->user()?->id ?: $request->ip());
		});

		if (config('app.debug') == true && !app()->runningInConsole())
			DB::listen(function (QueryExecuted $query) {
				Log::info("{$query->sql} => {$query->time} ms");
			});
	}
}
