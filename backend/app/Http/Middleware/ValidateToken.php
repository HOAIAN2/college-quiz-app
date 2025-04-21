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

        // ip can change if you got dynamic ip from ISP, browser update can change user-agent
        // but change 2 things at same time kinda sus.
        if (
            !$this->isSameIp($request, $token) ||
            !$this->isSameUserAgent($request, $token)
        ) abort(401);

        return $next($request);
    }

    private function isSameIp($request, $token)
    {
        $request_ip = $request->ip();
        return $token->ip == $request_ip;
    }

    private function isSameUserAgent($request, $token)
    {
        $request_user_agent = $request->userAgent();
        return $token->user_agent == $request_user_agent;
    }
}
