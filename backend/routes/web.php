<?php

use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ServeFilesController;
use Illuminate\Support\Facades\Route;

Route::get('privacy', [HomeController::class, 'privacy']);
Route::get('term', [HomeController::class, 'term']);
Route::get('security', [HomeController::class, 'security']);
Route::get('uploads/{filename}', [ServeFilesController::class, 'uploads']);
Route::fallback([HomeController::class, 'index']);
