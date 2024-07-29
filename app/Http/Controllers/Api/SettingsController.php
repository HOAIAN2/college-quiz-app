<?php

namespace App\Http\Controllers\Api;

use App\Helper\EnvHelper;
use App\Helper\Reply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class SettingsController extends Controller
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
			Log::error($error);
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

	public function setEnv(Request $request)
	{
		abort_if(!$this->getUser()->isAdmin(), 403);
		$request->validate([
			'key' => ['required', 'string', 'uppercase'],
			'value' => ['nullable']
		]);
		EnvHelper::setEnv($request->input('key'), $request->input('value'));
		if (file_exists(app()->getCachedConfigPath())) {
			Artisan::command('config:cache');
		}
		return Reply::successWithMessage('app.successes.success');
	}
}
