<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RevokeOtherTokens
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
	 */
	public function handle(Request $request, Closure $next): Response
	{
		$response = $next($request);
		$status_code = $response->getStatusCode();
		if ($status_code >= 200 && $status_code <= 299) {
			$user = $request->user();
			$user->tokens()
				->where('id', '<>', $user->currentAccessToken()->id)
				->delete();
		}
		return $response;
	}
}
