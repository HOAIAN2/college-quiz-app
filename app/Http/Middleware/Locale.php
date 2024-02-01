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
		$accept_language = $request->getPreferredLanguage();
		if ($accept_language != null) {
			if (Str::startsWith($accept_language, 'en')) app()->setLocale('en');
			else app()->setLocale($accept_language);
		}
		return $next($request);
	}
}
