<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AttributeSumMin implements ValidationRule
{
    public int $min;
    public function __construct(int $min)
    {
        $this->min = $min;
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (array_sum($value) < $this->min) {
            $fail(trans('validation.attribute_sum_min', [
                'attribute' => trans("validation.attributes.$attribute"),
                'min' => $this->min
            ]));
        }
    }
}
