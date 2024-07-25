<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Helper\Reply;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Web\EmailController;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ChangePassRequest;
use App\Mail\VerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
	public function login(LoginRequest $request)
	{
		try {
			$user = User::with('role')->where('email', '=', $request->email)->first();
			if (!$user) {
				return Reply::error('auth.errors.email_not_found', [], 404);
			}
			if ($user->is_active == false) {
				return Reply::error('auth.errors.account_disabled');
			}
			if (!Hash::check($request->password, $user->password)) {
				return Reply::error('auth.errors.password_incorrect');
			}
			$token = $user->createToken("{$user->role->name} token")->plainTextToken;
			return Reply::successWithData([
				'user' => $user,
				'token' => $token
			], '');
		} catch (\Exception $error) {
			Log::error($error);
			$message = config('app.debug') ? $error->getMessage() : 'app.errors.something_went_wrong';
			return Reply::error($message, [], 500);
		}
	}

	public function logout()
	{
		$user = $this->getUser();

		try {
			$user->currentAccessToken()->delete();
			return Reply::success();
		} catch (\Exception $error) {
			Log::error($error);
			$message = config('app.debug') ? $error->getMessage() : 'app.errors.something_went_wrong';
			return Reply::error($message, [], 500);
		}
	}

	public function changePassword(ChangePassRequest $request)
	{
		$user = $this->getUser();

		try {
			if (!Hash::check($request->current_password, $user->password)) {
				return Reply::error('auth.errors.password_incorrect');
			}
			if ($request->current_password == $request->password) {
				return Reply::error('auth.errors.new_password_is_same');
			}
			$user->update([
				'password' => Hash::make($request->password),
			]);
			$user->tokens()->delete();
			return Reply::successWithMessage('auth.successes.change_password_success');
		} catch (\Exception $error) {
			Log::error($error);
			$message = config('app.debug') ? $error->getMessage() : 'app.errors.something_went_wrong';
			return Reply::error($message, [], 500);
		}
	}

	public function sendEmailVerification(Request $request)
	{
		$request->validate([
			'email' => ['required', 'email']
		]);
		try {
			$user = User::whereNull('email_verified_at')
				->where('email', '=', $request->email)
				->firstOrFail();

			$code = Str::uuid()->toString();
			$host = $request->getSchemeAndHttpHost();
			$verification_url = "$host/verify/$user->id/$code";

			$verify_email = new VerifyEmail($verification_url);
			Mail::to($user)->send($verify_email);

			$verify_cache_key = str_replace(
				['@user_id'],
				[$user->id],
				EmailController::VERIFY_CACHE_KEY
			);
			Cache::put($verify_cache_key, $code, 600);
			return Reply::successWithMessage('app.successes.success');
		} catch (\Exception $error) {
			Log::error($error);
			$message = config('app.debug') ? $error->getMessage() : 'app.errors.something_went_wrong';
			return Reply::error($message, [], 500);
		}
	}
}
