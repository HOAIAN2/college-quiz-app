<?php

namespace App\Http\Middleware;

use App\Helper\Reply;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictDemoMode
{
    private $action;
    public function __construct()
    {
        $this->action = request()->route()->getAction();
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!config('custom.app.demo')) return $next($request);
        if (
            $this->restrictChangeDemoAccountPassword() ||
            $this->restrictDeleteDemoAccount()
        ) {
            return Reply::error('This action is restricted in demo mode.', 403);
        }
        return $next($request);
    }

    private function restrictChangeDemoAccountPassword()
    {
        if ($this->action['controller'] != 'App\Http\Controllers\Api\AuthController@changePassword') {
            return false;
        }
        $current_user_id = auth('sanctum')->user()->id;
        if ($current_user_id == 1) return true;
        return false;
    }

    private function restrictDeleteDemoAccount()
    {
        if ($this->action['controller'] != 'App\Http\Controllers\Api\UserController@destroy') {
            return false;
        }
        $user_ids = request()->all()['ids'];
        if (is_array($user_ids) && in_array(1, $user_ids)) return true;
        return false;
    }
}
