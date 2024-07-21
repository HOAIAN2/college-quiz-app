<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
	public function runArtisan(Request $request)
	{
		$command = $request->get('command');

		try {
			Artisan::call($command);
			return Reply::successWithMessage('app.successes.command_run_successfully', [
				'command' => $command
			]);
		} catch (\Exception $error) {
			Log::error($error->getMessage());
			return Reply::error('app.errors.something_went_wrong', [], 500);
		}
	}

	public function getLogFile()
	{
		abort_if(!$this->getUser()->isAdmin(), 403);
		$log_file_path = storage_path('logs/laravel.log');
		if (File::exists($log_file_path)) {
			return response()->download($log_file_path);
		}
		return Reply::error('app.errors.log_file_not_exist');
	}

	public function deleteLogFile()
	{
		abort_if(!$this->getUser()->isAdmin(), 403);
		$log_file_path = storage_path('logs/laravel.log');
		File::delete($log_file_path);
		return Reply::successWithMessage('app.successes.success');
	}
}
