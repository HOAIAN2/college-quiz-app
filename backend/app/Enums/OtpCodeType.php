<?php

namespace App\Enums;

use App\Traits\EnumResolver;

enum OtpCodeType: string
{
	use EnumResolver;

	case VERIFY_EMAIL = 'verify_email';
	case PASSWORD_RESET = 'password_reset';
}
