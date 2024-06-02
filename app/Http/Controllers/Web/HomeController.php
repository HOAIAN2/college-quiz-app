<?php

namespace App\Http\Controllers\Web;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
	public function index()
	{
		$data = [];
		$data['lang'] = App::getLocale();
		$data['description'] = trans('app.meta.description');
		$data['keywords'] = trans('app.meta.keywords');
		$data['title'] = env('APP_NAME');
		$data['app_url'] = env('APP_URL');
		return view('index', $data);
	}

	public function optimize()
	{
		$mode = request()->get('mode');
		try {
			if ($mode === 'clear') {
				Artisan::call('optimize:clear');
				$message = 'Optimization cache cleared successfully!';
			} else {
				Artisan::call('optimize');
				$message = 'Optimization completed successfully!';
			}

			return Reply::successWithMessage($message);
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			return response()->json([
				'message' => 'An error occurred during optimization.',
				'error' => $error->getMessage()
			], 500);
		}
	}
}
