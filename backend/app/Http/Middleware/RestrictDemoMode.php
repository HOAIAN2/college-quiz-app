<?php

namespace App\Http\Middleware;

use App\Helper\Reply;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class RestrictDemoMode
{
    private $action;
    private int $rootAdminId = 1;

    public function __construct()
    {
        $this->action = request()->route()?->getAction();
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!config('custom.app.demo')) return $next($request);
        if (!$this->action) return $next($request);
        if (!array_key_exists('controller', $this->action)) return $next($request);
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
        if ($current_user_id == $this->rootAdminId) return true;
        return false;
    }

    private function restrictDeleteDemoAccount()
    {
        if ($this->action['controller'] != 'App\Http\Controllers\Api\UserController@destroy') {
            return false;
        }
        $delete_request = new \App\Http\Requests\DeleteRequest();
        $validator = Validator::make(request()->all(), $delete_request->rules());
        if ($validator->fails()) {
            return false;
        }
        $user_ids = request()->ids;
        if (is_array($user_ids) && in_array($this->rootAdminId, $user_ids)) return true;
        return false;
    }
}
