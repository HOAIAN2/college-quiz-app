<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePassRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong');
		}
	}

	public function logout()
	{
		$user = $this->getUser();

		try {
			$user->currentAccessToken()->delete();
			return Reply::success();
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong');
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
			Log::error($error->getMessage());
			if ($this->isDevelopment) return Reply::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}
}
