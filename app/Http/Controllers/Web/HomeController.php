<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;

class HomeController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }
    public function index()
    {
        if (!view()->exists('index')) return File::get(public_path() . '/index.html');
        $data = [];
        $data['lang'] = App::getLocale();
        $data['description'] = trans('app.meta.description');
        $data['keywords'] = trans('app.meta.keywords');
        $data['title'] = env('APP_NAME');
        $data['app_url'] = env('APP_URL');
        return view('index', $data);
    }
}
