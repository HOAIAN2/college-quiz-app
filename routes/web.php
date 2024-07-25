<?php

use App\Http\Controllers\Web\EmailController;
use App\Http\Controllers\Web\HomeController;
use Illuminate\Support\Facades\Route;

Route::prefix('email')->controller(EmailController::class)
	->group(function () {
		Route::get('/verify/{id}/{code}', 'verify');
	});
Route::fallback([HomeController::class, 'index']);
