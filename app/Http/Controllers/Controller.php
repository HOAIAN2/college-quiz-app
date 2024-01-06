<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
    public bool $isDevelopment = false;
    public function __construct()
    {
        if (env('APP_DEBUG') == true)  $this->isDevelopment = true;
    }
    public function __destruct()
    {
        if (env('TOKEN_LIFETIME') != null && Str::startsWith(request()->path(), 'api')) {
            $interval = Carbon::now()->subMinutes(env('TOKEN_LIFETIME'));
            DB::table('personal_access_tokens')
                ->where(function ($query) use ($interval) {
                    $query->where('last_used_at', '<', $interval)
                        ->orWhere(function ($query) use ($interval) {
                            $query->where('created_at', '<', $interval)
                                ->whereNull('last_used_at');
                        });
                })->delete();
        }
    }
    public function getUser()
    {
        return request()->user();
    }
}
