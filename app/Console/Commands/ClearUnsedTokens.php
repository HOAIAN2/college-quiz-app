<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ClearUnsedTokens extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'app:clear-unsed-tokens';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Clear unsed tokens';

	/**
	 * Execute the console command.
	 */
	public function handle()
	{
		$token_lifttime = env('TOKEN_LIFETIME');
		if ($token_lifttime == null) return;

		$interval = Carbon::now()->subMinutes((int)$token_lifttime);

		DB::table('personal_access_tokens')
			->where(function ($query) use ($interval) {
				$query->where('last_used_at', '<', $interval)
					->orWhere(function ($query) use ($interval) {
						$query->where('created_at', '<', $interval)
							->whereNull('last_used_at');
					});
			})->delete();
	}
}
