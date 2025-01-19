<?php

namespace App\Helper;

use App\Models\Setting;
use NumberFormatter;

class NumberHelper
{
    public static function caculateScore(int|null $correct_count, int $question_count, int $base_score_scale = 10)
    {
        return $correct_count != null
            ? ($correct_count / $question_count) * $base_score_scale
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

    public static function randomDitgits(int $length = 6)
    {
        $result = '';
        while (strlen($result) < $length) {
            $result = $result . (string)random_int(0, 9);
        }
        return $result;
    }
}
