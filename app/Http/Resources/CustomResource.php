<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class CustomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
    //
    public static function toCamelCase($array): array
    {
        if (empty($array)) return $array;
        foreach ($array as $key => $value) {
            $newKey[Str::camel($key)] = $value;
            if (is_array($value)) $newKey[Str::camel($key)] = CustomResource::toCamelCase($value);
        }

        return $newKey;
    }
}
