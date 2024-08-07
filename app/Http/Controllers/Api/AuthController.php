<?php

namespace App\Http\Controllers\Api;

use App\Helper\NumberHelper;
use App\Models\User;
use App\Helper\Reply;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ChangePassRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\SendEmailVerificationRequest;
use App\Http\Requests\Auth\SendPasswordResetEmailRequest;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Mail\PasswordResetEmail;
use App\Mail\VerifyEmail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
	const VERIFY_EMAIL_CODE_CACHE_KEY = 'user:@user_id-verify-code';
	const PASSWORD_RESET_CODE_CACHE_KEY = 'user:@user_id-password-reset-code';

	private int $otpTimeoutSeconds = 0;

	public function __construct()
	{
		parent::__construct();
		$this->otpTimeoutSeconds = env('OTP_CODE_TIMEOUT_SECONDS');
	}

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
			$data->token = $data->user->createToken(json_encode([
				'ip' => $request->ip(),
				'userAgent' => $request->userAgent()
			]))->plainTextToken;
			return Reply::successWithData($data, '');
		} catch (\Exception $error) {
			return $this->handleException($error);
		}
	}

	public function logout()
	{
		$user = $this->getUser();

		try {
			$user->currentAccessToken()->delete();
			return Reply::success();
		} catch (\Exception $error) {
			return $this->handleException($error);
		}
	}

	public function changePassword(ChangePassRequest $request)
	{
		$user = $this->getUser();

		DB::beginTransaction();
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
			DB::commit();
			return Reply::successWithMessage('auth.successes.change_password_success');
		} catch (\Exception $error) {
			DB::rollBack();
			return $this->handleException($error);
		}
	}

	public function sendEmailVerification(SendEmailVerificationRequest $request)
	{
		try {
			$user = User::whereNull('email_verified_at')
				->where('email', '=', $request->email)
				->firstOrFail();

			$code = NumberHelper::randomDitgits();
			$verify_email = new VerifyEmail($code);
			Mail::to($user)->send($verify_email);

			$verify_email_code_cache_key = str_replace(
				['@user_id'],
				[$user->id],
				self::VERIFY_EMAIL_CODE_CACHE_KEY
			);
			Cache::put($verify_email_code_cache_key, $code, $this->otpTimeoutSeconds);
			return Reply::success();
		} catch (\Exception $error) {
			return $this->handleException($error);
		}
	}

	public function verifyEmail(VerifyEmailRequest $request)
	{
		DB::beginTransaction();
		try {
			$user = User::whereNull('email_verified_at')
				->where('email', '=', $request->email)
				->first();
			if (!$user) {
				return Reply::error('auth.errors.email_not_found', [], 404);
			}
			if ($user->is_active == false) {
				return Reply::error('auth.errors.account_disabled');
			}

			$verify_email_code_cache_key = str_replace(
				['@user_id'],
				[$user->id],
				self::VERIFY_EMAIL_CODE_CACHE_KEY
			);
			$verify_code = Cache::get($verify_email_code_cache_key);
			if ($verify_code != $request->verify_code) {
				return Reply::error('auth.errors.verify_code_mismatch', [], 400);
			}
			$user->email_verified_at = Carbon::now();
			$token = $user->createToken("{$user->role->name} token")->plainTextToken;
			$user->save();
			DB::commit();
			Cache::forget($verify_email_code_cache_key);
			return Reply::successWithData([
				'token' => $token
			], '');
		} catch (\Exception $error) {
			DB::rollBack();
			return $this->handleException($error);
		}
	}

	public function sendPasswordResetEmail(SendPasswordResetEmailRequest $request)
	{
		try {
			$user = User::where('email', '=', $request->email)->first();
			if (!$user) {
				return Reply::error('auth.errors.email_not_found', [], 404);
			}
			if ($user->is_active == false) {
				return Reply::error('auth.errors.account_disabled');
			}

			$code = NumberHelper::randomDitgits();
			$password_reset_email = new PasswordResetEmail($code);
			Mail::to($user)->send($password_reset_email);

			$password_reset_code_cache_key = str_replace(
				['@user_id'],
				[$user->id],
				self::PASSWORD_RESET_CODE_CACHE_KEY
			);
			Cache::put($password_reset_code_cache_key, $code, $this->otpTimeoutSeconds);
			return Reply::success();
		} catch (\Exception $error) {
			return $this->handleException($error);
		}
	}

	public function verifyPasswordResetCode(VerifyEmailRequest $request)
	{
		try {
			$user = User::where('email', '=', $request->email)->first();
			if (!$user) {
				return Reply::error('auth.errors.email_not_found', [], 404);
			}
			if ($user->is_active == false) {
				return Reply::error('auth.errors.account_disabled');
			}

			$password_reset_code_cache_key = str_replace(
				['@user_id'],
				[$user->id],
				self::PASSWORD_RESET_CODE_CACHE_KEY
			);
			$verify_code = Cache::get($password_reset_code_cache_key);
			if ($verify_code != $request->verify_code) {
				return Reply::error('auth.errors.verify_code_mismatch', [], 400);
			}
			return Reply::success();
		} catch (\Exception $error) {
			return $this->handleException($error);
		}
	}

	public function resetPassword(ResetPasswordRequest $request)
	{
		DB::beginTransaction();
		try {
			$user = User::where('email', '=', $request->email)->first();
			if (!$user) {
				return Reply::error('auth.errors.email_not_found', [], 404);
			}
			if ($user->is_active == false) {
				return Reply::error('auth.errors.account_disabled');
			}

			$password_reset_code_cache_key = str_replace(
				['@user_id'],
				[$user->id],
				self::PASSWORD_RESET_CODE_CACHE_KEY
			);
			$verify_code = Cache::get($password_reset_code_cache_key);
			if ($verify_code != $request->verify_code) {
				return Reply::error('auth.errors.verify_code_mismatch', [], 400);
			}
			$user->update([
				'password' => Hash::make($request->password),
			]);
			$user->tokens()->delete();
			DB::commit();
			Cache::forget($password_reset_code_cache_key);
			return Reply::successWithMessage('auth.successes.change_password_success');
		} catch (\Exception $error) {
			DB::rollBack();
			return $this->handleException($error);
		}
	}

	public function loginSessions()
	{
		$user = $this->getUser();

		try {
			$tokens = $user->tokens()->latest('last_used_at')
				->get()
				->each(function ($token) {
					$token->setAttribute('name', json_decode($token->getAttribute('name'), true));
					$token->makeHidden(['tokenable_type']);
				});
			return Reply::successWithData($tokens, '');
		} catch (\Exception $error) {
			return $this->handleException($error);
		}
	}

	public function revokeLoginSession(string $id)
	{
		$user = $this->getUser();

		DB::beginTransaction();
		try {
			$user->tokens()
				->where('id', $id)
				->delete();
			DB::commit();
			return Reply::successWithMessage('app.successes.success');
		} catch (\Exception $error) {
			DB::rollBack();
			return $this->handleException($error);
		}
	}
}
