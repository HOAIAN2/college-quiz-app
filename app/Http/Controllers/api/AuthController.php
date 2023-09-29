<?php

namespace App\Http\Controllers\api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8'],
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user) return Reply::error('auth.errors.emailNotFound', 404);
        if ($user->is_active == false)  return Reply::error('auth.errors.accountDisabled');
        if (!Hash::check($request->password, $user->password)) {
            return Reply::error('auth.errors.passwordIncorrect');
        }
        $token = $user->createToken('Token')->plainTextToken;
        return response()->json([
            'user' => $user->with('role')->first(),
            'token' => $token
        ]);
    }
    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response();
    }
    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return Reply::error('auth.errors.passwordIncorrect');
        }
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);
        $user->tokens()->delete();
        return Reply::success();
    }
}
