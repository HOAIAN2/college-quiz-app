<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
	public function index()
	{
		$data = [];
		$data['lang'] = app()->getLocale();
		$data['description'] = trans('app.meta.description');
		$data['keywords'] = trans('app.meta.keywords');
		$data['title'] = config('app.name');
		$data['app_url'] = config('app.url');
		return view('index', $data);
	}
}
