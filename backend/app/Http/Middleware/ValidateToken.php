<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->user()->currentAccessToken();

        abort_if(!$this->isValidIp($request, $token), 401);
        abort_if(!$this->isValidUserAgent($request, $token), 401);

        return $next($request);
    }

    private function isValidIp($request, $token)
    {
        $request_id = $request->ip();
        $token_ip = json_decode($token->name)->ip;
        return $token_ip == $request_id;
    }

    private function isValidUserAgent($request, $token)
    {
        $request_user_agent = $request->userAgent();
        $token_user_agent = json_decode($token->name)->userAgent;
        return $request_user_agent == $token_user_agent;
    }
}
