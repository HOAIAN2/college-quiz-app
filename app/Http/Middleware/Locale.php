<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class Locale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $accept_language = $request->header('Accept-Language');
        if (Str::startsWith($accept_language, 'en')) app()->setLocale('en');
        $supported_languages = $this->getAvailableLanguages();
        if (in_array($accept_language, $supported_languages)) {
            app()->setLocale($accept_language);
        }
        if (Str::startsWith($accept_language, 'en')) app()->setLocale('en');
        else app()->setLocale(env('LOCALE', 'vi'));
        return $next($request);
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
}
