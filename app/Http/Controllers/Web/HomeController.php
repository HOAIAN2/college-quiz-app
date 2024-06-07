<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class HomeController extends Controller
{
	public function index()
	{
		$data = [];
		$data['lang'] = App::getLocale();
		$data['description'] = trans('app.meta.description');
		$data['keywords'] = trans('app.meta.keywords');
		$data['title'] = config('app.name');
		$data['app_url'] = config('app.url');
		return view('index', $data);
	}
}
