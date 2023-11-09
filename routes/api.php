<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\DashboardController;
use App\Http\Controllers\api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('/auth')->controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('logout', 'logout')->middleware('auth:sanctum');
    Route::post('change-password', 'changePassword')->middleware('auth:sanctum');
});

Route::prefix('/user')->middleware('auth:sanctum')
    ->controller(UserController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store')->middleware(['auth:sanctum', 'abilities:teacher:create,student:create']);
        Route::get('/query', 'getUserByType')->middleware(['auth:sanctum', 'abilities:teacher:view,student:view']);
    });
Route::prefix('/dashboard')->middleware('auth:sanctum')
    ->controller(DashboardController::class)->group(function () {
        Route::get('/', 'index');
    });
