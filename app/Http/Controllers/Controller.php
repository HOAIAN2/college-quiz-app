<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Controller extends BaseController
{
	use AuthorizesRequests, ValidatesRequests;

	public bool $isDevelopment = false;

	public function __construct()
	{
		if (env('APP_DEBUG') == true) $this->isDevelopment = true;
	}

	public function __destruct()
	{
		$this->clearUnusedTokens();
	}

	public function clearUnusedTokens()
	{
		$clear_token_interval = env('CLEAR_TOKENS_INTERVAL', 60);
		$now = Carbon::now();
		$is_api_call = Str::startsWith(request()->path(), 'api');

		$last_clear_tokens_at = Cache::has('last_clear_tokens_at')
			? Carbon::parse(Cache::get('last_clear_tokens_at'))
			: $now;
		if ($last_clear_tokens_at == $now) Cache::put('last_clear_tokens_at', $now->format('Y-m-d H:i:s'));

		if (
			$now->diffInSeconds($last_clear_tokens_at) > $clear_token_interval
			&& env('TOKEN_LIFETIME') != null
			&& $is_api_call == true
		) {
			$interval = Carbon::now()->subMinutes(env('TOKEN_LIFETIME'));
			DB::table('personal_access_tokens')
				->where(function ($query) use ($interval) {
					$query->where('last_used_at', '<', $interval)
						->orWhere(function ($query) use ($interval) {
							$query->where('created_at', '<', $interval)
								->whereNull('last_used_at');
						});
				})->delete();
			Cache::put('last_clear_tokens_at', $now->format('Y-m-d H:i:s'));
		}
	}

	public function getUser()
	{
		return request()->user();
	}
}
