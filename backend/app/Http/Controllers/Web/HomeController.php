<?php

namespace App\Http\Controllers\Web;

use App\Enums\RoleType;
use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\User;

class HomeController extends Controller
{
    public function index()
    {
        try {
            if (config('custom.app.demo')) {
                $credentials = json_encode([
                    'email' => User::where('role_id', RoleType::ADMIN)->select('email')->first()->email,
                    'password' => config('custom.demo_credentials.password')
                ]);
                $this->queueCookie('demo_credentials', $credentials);
            } else {
                Cookie::queue(Cookie::forget('demo_credentials'));
            }

            $this->queueCookie('base_score_scale', Setting::get('exam_base_score_scale'));
        } catch (\Exception $error) {
            $this->handleException($error);
        } finally {
            return view('index');
        }
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

    private function queueCookie($name, $value, $minutes = 30, $http_only = false)
    {
        Cookie::queue($name, $value, $minutes, null, null, false, $http_only);
    }
}
