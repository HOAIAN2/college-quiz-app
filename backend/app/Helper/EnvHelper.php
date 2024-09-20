<?php

namespace App\Helper;

use Illuminate\Support\Str;

class EnvHelper
{
    public static function setEnv(string $key, string|null $value)
    {
        $env_file_path = app()->environmentFilePath();

        $env_data = explode("\n", file_get_contents($env_file_path));
        $edited = false;
        foreach ($env_data as &$line) {
            if (Str::startsWith($line, "$key=")) {
                $line = "$key=\"$value\"";
                $edited = true;
            }
        }
        if (!$edited) {
            $env_data[] = "$key=\"$value\"";
        }
        file_put_contents($env_file_path, join("\n", $env_data));
    }
}
