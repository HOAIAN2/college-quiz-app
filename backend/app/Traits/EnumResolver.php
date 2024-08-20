<?php

namespace App\Traits;

trait EnumResolver
{
	public static function fromName(string $name)
	{
		$cast_name = strtoupper($name);
		return constant("self::$cast_name");
	}

	public static function valueFromName(string $name)
	{
		return self::fromName($name)->value;
	}
}
