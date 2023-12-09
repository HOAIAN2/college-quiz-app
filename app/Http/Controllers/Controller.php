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

    function __construct()
    {
        $this->setLanguage();
    }
    private function setLanguage()
    {
        $request = request();
        $accept_language = $request->header('Accept-Language');
        if (Str::startsWith($accept_language, 'en')) app()->setLocale('en');
        $this->supported_languages = $this->getAvailableLanguages();
        if (in_array($accept_language, $this->supported_languages)) {
            App::setLocale($accept_language);
        }
        if (Str::startsWith($accept_language, 'en')) App::setLocale('en');
        else App::setLocale(env('LOCALE', 'vi'));
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
        return request()->user()->load(['role']);
    }
}
