<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePassRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    function __construct()
    {
        parent::__construct();
        if (env('TOKEN_LIFTTIME') != null) {
            $interval = Carbon::now()->subMinutes(env('TOKEN_LIFETIME'));
            DB::table('personal_access_tokens')
                ->where('last_used_at', '<', $interval)
                ->delete();
        }
    }
    public function login(LoginRequest $request)
    {
        try {
            $user = User::with('role')->whereEmail($request->email)->first();

            if (!$user) {
                return Reply::error('auth.errors.emailNotFound', [], 404);
            }

            if ($user->is_active == false) {
                return Reply::error('auth.errors.accountDisabled');
            }

            if (!Hash::check($request->password, $user->password)) {
                return Reply::error('auth.errors.passwordIncorrect');
            }

            $token = $user->createToken($user->role->name . ' token')->plainTextToken;
            return Reply::successWithData([
                'user' => $user,
                'token' => $token
            ], '');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError');
        }
    }
    public function logout(Request $request)
    {
        $user = $this->getUser();

        try {
            $user->currentAccessToken()->delete();
            return Reply::success();
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.serverError');
        }
    }
    public function changePassword(ChangePassRequest $request)
    {
        $user = $this->getUser();
        try {
            if (!Hash::check($request->current_password, $user->password)) {
                return Reply::error('auth.errors.passwordIncorrect');
            }
            $user->update([
                'password' => Hash::make($request->password),
            ]);
            $user->tokens()->delete();
            return Reply::successWithMessage('auth.successes.changePasswordSuccess');
        } catch (\Throwable $error) {
            Log::error($error->getMessage());
            if ($this->isDevelopment) return $error;
            return Reply::error('app.errors.failToSaveRecord');
        }
    }
}
