<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class CamelCaseResponse
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
	 */
	public function handle(Request $request, Closure $next): Response
	{
		$response = $next($request);
		if ($response->getStatusCode() === 422) return $response;
		$content_type = $response->headers->get('content-type');
		if ($content_type === 'application/json') {
			$content = $this->toCamelCase(json_decode($response->getContent(), true));
			$response->setContent(json_encode($content));
		}
		return $response;
	}

	private function toCamelCase($array): array
	{
		if (empty($array)) return $array;
		foreach ($array as $key => $value) {
			$newKey[Str::camel($key)] = $value;
			if (is_array($value)) $newKey[Str::camel($key)] = $this->toCamelCase($value);
		}
		return $newKey;
	}
}
