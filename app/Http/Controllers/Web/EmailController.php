<?php

namespace App\Http\Controllers\Web;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmailController extends Controller
{
	const VERIFY_CACHE_KEY = 'user:@user_id-verify-code';

	public function verify(string $id, string $code)
	{
		$verify_cache_key = str_replace(
			['@user_id'],
			[$id],
			self::VERIFY_CACHE_KEY
		);
		$user = User::whereNull('email_verified_at')
			->findOrFail($id);
		$verify_code = Cache::get($verify_cache_key);
		abort_if($verify_code != $code, 400);

		DB::beginTransaction();
		try {
			$user->email_verified_at = Carbon::now();
			DB::commit();
			return view('email_verified');
		} catch (\Exception $error) {
			DB::rollBack();
			Log::error($error);
			$message = config('app.debug') ? $error->getMessage() : 'app.errors.something_went_wrong';
			abort(500, $message);
		}
	}
}
