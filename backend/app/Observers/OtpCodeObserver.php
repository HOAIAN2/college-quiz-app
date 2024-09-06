<?php

namespace App\Observers;

use App\Models\OtpCode;

class OtpCodeObserver
{
	public function creating(OtpCode $otpCode): void
	{
		$timeout = config('custom.app.otp_code_timeout_seconds');
		$otpCode->expires_at = now()->addSeconds($timeout);
	}

	public function created(OtpCode $otpCode): void {}

	public function updating(OtpCode $otpCode): void
	{
		$timeout = config('custom.app.otp_code_timeout_seconds');
		$otpCode->expires_at = $otpCode->updated_at->addSeconds($timeout);
	}

	public function updated(OtpCode $otpCode): void {}

	public function deleted(OtpCode $otpCode): void {}

	public function restored(OtpCode $otpCode): void {}

	public function forceDeleted(OtpCode $otpCode): void {}
}
