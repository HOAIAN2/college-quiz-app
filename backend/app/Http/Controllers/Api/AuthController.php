<?php

namespace App\Http\Controllers\Api;

use App\Enums\OtpCodeType;
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
use App\Models\OtpCode;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $data = (object)[
                'user' => null,
                'token' => null
            ];
            $data->user = User::with('role')->where('email', '=', $request->email)->first();
            if (!$data->user) {
                return Reply::error(trans('auth.errors.email_not_found'), 404);
            }
            if ($data->user->is_active == false) {
                return Reply::error(trans('auth.errors.account_disabled'));
            }
            if (!Hash::check($request->password, $data->user->password)) {
                return Reply::error(trans('auth.errors.password_incorrect'));
            }
            if (!$data->user->email_verified_at && config('custom.app.must_verify_email')) {
                return Reply::successWithData($data, '');
            }
            $data->token = $data->user->createToken("{$data->user->role->name} token")->plainTextToken;
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
                return Reply::error(trans('auth.errors.password_incorrect'));
            }
            if ($request->current_password == $request->password) {
                return Reply::error(trans('auth.errors.new_password_is_same'));
            }
            $user->update([
                'password' => Hash::make($request->password),
            ]);
            $user->tokens()->delete();
            DB::commit();
            return Reply::successWithMessage(trans('auth.successes.change_password_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function sendEmailVerification(SendEmailVerificationRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = User::whereNull('email_verified_at')
                ->where('email', '=', $request->email)
                ->firstOrFail();

            $code = NumberHelper::randomDitgits();

            OtpCode::create([
                'user_id' => $user->id,
                'code' => $code,
                'type' => OtpCodeType::VERIFY_EMAIL
            ]);

            $verify_email = new VerifyEmail($code);
            Mail::to($user)->send($verify_email);

            DB::commit();
            return Reply::success();
        } catch (\Exception $error) {
            DB::rollBack();
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
                return Reply::error(trans('auth.errors.email_not_found'), 404);
            }
            if ($user->is_active == false) {
                return Reply::error(trans('auth.errors.account_disabled'));
            }

            $otp_code = $user->otp_codes()
                ->where('type', OtpCodeType::VERIFY_EMAIL)
                ->where('code', $request->verify_code)
                ->first();

            if ($otp_code == null) {
                return Reply::error(trans('auth.errors.verify_code_mismatch'), 400);
            }
            $user->email_verified_at = Carbon::now();
            $token = $user->createToken("{$user->role->name} token")->plainTextToken;
            $user->save();
            $otp_code->delete();
            DB::commit();
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
        DB::beginTransaction();
        try {
            $user = User::where('email', '=', $request->email)->first();
            if (!$user) {
                return Reply::error(trans('auth.errors.email_not_found'), 404);
            }
            if ($user->is_active == false) {
                return Reply::error(trans('auth.errors.account_disabled'));
            }

            $code = NumberHelper::randomDitgits();

            OtpCode::create([
                'user_id' => $user->id,
                'code' => $code,
                'type' => OtpCodeType::PASSWORD_RESET
            ]);

            $password_reset_email = new PasswordResetEmail($code);
            Mail::to($user)->send($password_reset_email);
            DB::commit();
            return Reply::success();
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function verifyPasswordResetCode(VerifyEmailRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = User::where('email', '=', $request->email)->first();
            if (!$user) {
                return Reply::error(trans('auth.errors.email_not_found'), 404);
            }
            if ($user->is_active == false) {
                return Reply::error(trans('auth.errors.account_disabled'));
            }

            $is_valid_otp = $user->otp_codes()
                ->where('type', OtpCodeType::PASSWORD_RESET)
                ->where('code', $request->verify_code)
                ->exists();

            if ($is_valid_otp == false) {
                return Reply::error(trans('auth.errors.verify_code_mismatch'), 400);
            }
            DB::commit();
            return Reply::success();
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = User::where('email', '=', $request->email)->first();
            if (!$user) {
                return Reply::error(trans('auth.errors.email_not_found'), 404);
            }
            if ($user->is_active == false) {
                return Reply::error(trans('auth.errors.account_disabled'));
            }

            $otp_code = $user->otp_codes()
                ->where('type', OtpCodeType::PASSWORD_RESET)
                ->where('code', $request->verify_code)
                ->first();

            if ($otp_code == null) {
                return Reply::error(trans('auth.errors.verify_code_mismatch'));
            }
            $user->update([
                'password' => Hash::make($request->password),
            ]);
            $user->tokens()->delete();
            $otp_code->delete();
            DB::commit();
            return Reply::successWithMessage(trans('auth.successes.change_password_success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }

    public function loginSessions()
    {
        $user = $this->getUser();

        try {
            $tokens = $user->tokens()
                ->where('expires_at', '>', now())
                ->latest('last_used_at')
                ->get();
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
            return Reply::successWithMessage(trans('app.successes.success'));
        } catch (\Exception $error) {
            DB::rollBack();
            return $this->handleException($error);
        }
    }
}
