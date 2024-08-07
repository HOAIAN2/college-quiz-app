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

	public function privacy()
	{
		return response()
			->view('policy.privacy')
			->header('Content-Security-Policy', env('CONTENT_SECURITY_POLICY'));
	}

	public function term()
	{
		return response()
			->view('policy.term')
			->header('Content-Security-Policy', env('CONTENT_SECURITY_POLICY'));
	}

	public function security()
	{
		return response()
			->view('policy.security')
			->header('Content-Security-Policy', env('CONTENT_SECURITY_POLICY'));
	}
}
