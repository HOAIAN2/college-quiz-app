<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __construct()
    {
        parent::__construct();
    }
    public function index()
    {
        $data = [];
        $data['lang'] = $this->current_language;
        $data['description'] = trans('app.meta.description');
        $data['keywords'] = trans('app.meta.keywords');
        $data['title'] = env('APP_NAME');
        $data['app_url'] = env('APP_URL');
        return view('index', $data);
    }
}
