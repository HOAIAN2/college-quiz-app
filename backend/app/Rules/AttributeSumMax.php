<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AttributeSumMax implements ValidationRule
{
    public int $max;
    public function __construct(int $max)
    {
        $this->max = $max;
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (array_sum($value) > $this->max) {
            $fail(trans('validation.attribute_sum_max', [
                'attribute' => trans("validation.attributes.$attribute"),
                'max' => $this->max
            ]));
        }
    }
}
