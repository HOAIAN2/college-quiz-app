<?php

namespace App\Http\Middleware;

use App\Http\Resources\CustomResource;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomResponse
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
            $content = CustomResource::toCamelCase(json_decode($response->getContent(), true));
            $response->setContent(json_encode($content));
        }
        return $response;
    }
}
