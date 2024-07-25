<?php

namespace App\Http\Controllers\Api;

use App\Helper\NumberHelper;
use App\Models\User;
use App\Helper\Reply;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ChangePassRequest;
use App\Http\Requests\Auth\SendEmailVerificationRequest;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Mail\VerifyEmail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
	const VERIFY_EMAIL_CODE_CACHE_KEY = 'user:@user_id-verify-code';

	public function login(LoginRequest $request)
	{
		try {
			$data = (object)[
				'user' => null,
				'token' => null
			];
			$data->user = User::with('role')->where('email', '=', $request->email)->first();
			if (!$data->user) {
				return Reply::error('auth.errors.email_not_found', [], 404);
			}
			if ($data->user->is_active == false) {
				return Reply::error('auth.errors.account_disabled');
			}
			if (!Hash::check($request->password, $data->user->password)) {
				return Reply::error('auth.errors.password_incorrect');
			}
			if (!$data->user->email_verified_at && env('MUST_VERIFY_EMAIL')) {
				return Reply::successWithData($data, '');
			}
			$data->token = $data->user
				->createToken("{$data->user->role->name} token")
				->plainTextToken;
			return Reply::successWithData($data, '');
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

	public function sendEmailVerification(SendEmailVerificationRequest $request)
	{
		try {
			$user = User::whereNull('email_verified_at')
				->where('email', '=', $request->email)
				->firstOrFail();

			$code = NumberHelper::randomCode();
			$verify_email = new VerifyEmail($code);
			Mail::to($user)->send($verify_email);

			$verify_email_code_cache_key = str_replace(
				['@user_id'],
				[$user->id],
				self::VERIFY_EMAIL_CODE_CACHE_KEY
			);
			Cache::put($verify_email_code_cache_key, $code, 600);
			return Reply::successWithMessage('app.successes.success');
		} catch (\Exception $error) {
			Log::error($error);
			$message = config('app.debug') ? $error->getMessage() : 'app.errors.something_went_wrong';
			return Reply::error($message, [], 500);
		}
	}

	public function verifyEmail(VerifyEmailRequest $request)
	{
		DB::beginTransaction();
		try {
			$user = User::whereNull('email_verified_at')
				->where('email', '=', $request->email)
				->firstOrFail();

			$verify_email_code_cache_key = str_replace(
				['@user_id'],
				[$request->user_id],
				self::VERIFY_EMAIL_CODE_CACHE_KEY
			);
			$verify_code = Cache::get($verify_email_code_cache_key);
			if ($verify_code != $request->code) {
				return Reply::error('app.errors.something_went_wrong', [], 500);
			}
			$user->email_verified_at = Carbon::now();
			DB::commit();
			Reply::successWithMessage('app.successes.success');
		} catch (\Exception $error) {
			DB::rollBack();
			Log::error($error);
			$message = config('app.debug') ? $error->getMessage() : 'app.errors.something_went_wrong';
			Reply::error($message, [], 500);
		}
	}
}
