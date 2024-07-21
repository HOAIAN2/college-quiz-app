<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
	public function index()
	{
		return response()
			->view('index')
			->header('Content-Security-Policy', env('CONTENT_SECURITY_POLICY'));
	}
}
