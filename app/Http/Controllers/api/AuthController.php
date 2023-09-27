<?php

namespace App\Http\Controllers\api;

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
        if (!$user) return response()->json([
            'message' => 'Email Not Found'
        ], 400);
        if ($user->is_active == false)  return response()->json([
            'message' => 'Account Disabled'
        ], 400);
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Ppassword incorrect'
            ], 400);
        }
        $token = $user->createToken('My Token')->plainTextToken;
        return response()->json([
            /** @var  User> */
            'user' => $user,
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
            return response()->json([
                'message' => 'Password incorrect'
            ], 400);
        }
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);
        $user->tokens()->delete();
        return response()->json([
            'message' => 'Tokens revoked'
        ]);
    }
}
