<?php

namespace App\Http\Controllers\Api;

use App\Helper\Reply;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
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
}
