<?php

namespace App\Http\Controllers\Web;

use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\Controller;
use App\Models\User;

class HomeController extends Controller
{
    public function index()
    {
        if (config('custom.app.demo')) {
            $credentials = json_encode([
                'email' => User::select('email')->first()->email,
                'password' => config('custom.credentials.password')
            ]);
            Cookie::queue('demo_credentials', $credentials, 30, null, null, false, false);
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
