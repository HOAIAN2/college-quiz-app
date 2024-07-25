<?php

namespace App\Helper;

use NumberFormatter;

class NumberHelper
{
	public static function caculateScore(int|null $correct_count, int $question_count)
	{
		return $correct_count != null
			? ($correct_count / $question_count) * (int)env('BASE_SCORE_SCALE', 10)
			: 0;
	}

	public static function formatScore(float $score)
	{
		return number_format(
			$score,
			2,
			self::getDecimalSeparator(app()->getLocale()),
			self::geThousandsSeparator(app()->getLocale()),
		);
	}

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

	public static function randomCode(int $length = 6)
	{
		$min = 1;
		while (strlen((string)$min) < $length) {
			$min *= 10;
		}
		$max = $min * 10 - 1;
		return random_int($min, $max);
	}
}
