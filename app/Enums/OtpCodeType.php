<?php

namespace App\Enums;

enum OtpCodeType: string
{
	case VerifyEmail = 'verify_email';
	case PasswordReset = 'password_reset';
}
