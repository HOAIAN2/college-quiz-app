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
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', 'logout');
        Route::post('change-password', 'changePassword');
    });
});

Route::prefix('/user')->middleware('auth:sanctum')
    ->controller(UserController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/', 'destroy');
        Route::get('/query', 'getUserByType');
        Route::post('/import', 'importUsers');
        Route::get('/{id}', 'show');
    });
Route::prefix('/dashboard')->middleware('auth:sanctum')
    ->controller(DashboardController::class)->group(function () {
        Route::get('/', 'index');
    });
