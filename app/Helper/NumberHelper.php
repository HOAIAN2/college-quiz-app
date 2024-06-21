<?php

namespace App\Helper;

use NumberFormatter;

class NumberHelper
{
	public static function caculateScore(int $correct_count, int $question_count)
	{
		return $correct_count != null
			? ($correct_count / $question_count) * env('BASE_SCORE_SCALE', 10)
			: 0;
	}

	public static function formatScore(float $score)
	{
		return number_format(
			$score,
			2,
			NumberHelper::getDecimalSeparator(app()->getLocale()),
			NumberHelper::geThousandsSeparator(app()->getLocale()),
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
}
