<?php

namespace App\Http\Controllers\api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePassRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    function __construct()
    {
        parent::__construct();
        DB::delete('DELETE FROM personal_access_tokens WHERE created_at > DATE_SUB(NOW(), INTERVAL ' . env('TOKEN_LIFETIME') . ' MINUTE);');
    }
    /**
     * Login
     */
    public function login(LoginRequest $request)
    {
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
    }
    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return Reply::success();
    }
    /**
     * Change password
     */
    public function changePassword(ChangePassRequest $request)
    {
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return Reply::error('auth.errors.passwordIncorrect');
        }
        $user->update([
            'password' => Hash::make($request->password),
        ]);
        $user->tokens()->delete();
        return Reply::success();
    }
}
