<?php


namespace App\Enums;

use App\Traits\EnumResolver;

/**
 *This is hard code value from database so this make your query much faster
 */
enum RoleType: int
{
    use EnumResolver;

    case ADMIN = 1;
    case TEACHER = 2;
    case STUDENT = 3;
}
