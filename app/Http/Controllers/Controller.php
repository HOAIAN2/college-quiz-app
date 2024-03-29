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

	public function __construct()
	{
		if (env('APP_DEBUG') == true) $this->isDevelopment = true;
		$this->autoCompleteResultLimit = env('AUTO_COMPLETE_RESULT_LIMIT', 5);
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
			Artisan::call('app:clear-unsed-tokens');
			Cache::put('last_clear_tokens_at', $now->format('Y-m-d H:i:s'));
		}
	}

	public function getUser()
	{
		return request()->user();
	}
}
