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
			->view('privacy')
			->header('Content-Security-Policy', env('CONTENT_SECURITY_POLICY'));
	}

	public function term()
	{
		return response()
			->view('term')
			->header('Content-Security-Policy', env('CONTENT_SECURITY_POLICY'));
	}

	public function security()
	{
		return response()
			->view('security')
			->header('Content-Security-Policy', env('CONTENT_SECURITY_POLICY'));
	}
}
