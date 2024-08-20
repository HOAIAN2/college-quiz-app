<?php

namespace App\Observers;

use App\Models\OtpCode;

class OtpCodeObserver
{
	public function creating(OtpCode $otpCode): void
	{
		$otpCode->expires_at = now()->addSeconds((int)env('OTP_CODE_TIMEOUT_SECONDS'));
	}

	public function created(OtpCode $otpCode): void {}

	public function updating(OtpCode $otpCode): void
	{
		$otpCode->expires_at = $otpCode->updated_at->addSeconds((int)env('OTP_CODE_TIMEOUT_SECONDS'));
	}

	public function updated(OtpCode $otpCode): void {}

	public function deleted(OtpCode $otpCode): void {}

	public function restored(OtpCode $otpCode): void {}

	public function forceDeleted(OtpCode $otpCode): void {}
}
