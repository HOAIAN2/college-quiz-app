<?php

namespace App\Helper;

use NumberFormatter;

class NumberHelper
{
	public static function getDecimalSeparator(string $locale)
	{
		$formatter = new NumberFormatter($locale, NumberFormatter::DECIMAL);
		return $formatter->getSymbol(NumberFormatter::DECIMAL_SEPARATOR_SYMBOL);
	}

	public static function geThousandsSeparator(string $locale)
	{
		$formatter = new NumberFormatter($locale, NumberFormatter::DECIMAL);
		return $formatter->getSymbol(NumberFormatter::DECIMAL_SEPARATOR_SYMBOL);
	}
}
