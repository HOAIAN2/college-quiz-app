<?php

namespace App\Http\Controllers\Web;

use App\Enums\RoleType;
use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\Controller;
use App\Models\User;

class HomeController extends Controller
{
    public function index()
    {
        if (config('custom.app.demo')) {
            $credentials = json_encode([
                'email' => User::where('role_id', RoleType::ADMIN)->select('email')->first()->email,
                'password' => config('custom.demo_credentials.password')
            ]);
            Cookie::queue('demo_credentials', $credentials, 30, null, null, false, false);
        } else {
            Cookie::queue(Cookie::forget('demo_credentials'));
        }
        return view('index');
    }

    public function privacy()
    {
        return view('policy.privacy');
    }

    public function term()
    {
        return view('policy.term');
    }

    public function security()
    {
        return view('policy.security');
    }
}
