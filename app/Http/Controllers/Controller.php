<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Str;


/**
 * @property string[] $supported_languages
 */

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
    public $supported_languages;
    public $current_language;

    function __construct()
    {
        $this->setLanguage();
    }
    private function setLanguage()
    {
        $this->current_language = App::getLocale();
    }
    private function getAvailableLanguages()
    {
        $langPath = resource_path('lang');
        $availableLanguages = array_filter(glob($langPath . '/*'), 'is_dir');
        $availableLanguages = array_map(function ($path) {
            return basename($path);
        }, $availableLanguages);
        return $availableLanguages;
    }
    public function getUser()
    {
        return request()->user();
    }
}
