<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function index()
    {
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
