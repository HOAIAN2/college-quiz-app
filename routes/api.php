<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\UserController;
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
    Route::post('/login', 'login');
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', 'logout');
        Route::post('/change-password', 'changePassword');
    });
});

Route::prefix('/user')->middleware('auth:sanctum')
    ->controller(UserController::class)->group(function () {
        Route::get('/query', 'getUserByType');
        Route::post('/import', 'importUsers');
        Route::get('/export', 'exportUsers');
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::delete('/', 'destroy');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
    });

Route::prefix('/dashboard')->middleware('auth:sanctum')
    ->controller(DashboardController::class)->group(function () {
        Route::get('/', 'index');
    });

Route::prefix('/class')->middleware('auth:sanctum')
    ->controller(SchoolClassController::class)->group(function () {
        Route::get('/complete', 'autocomplete');
    });

Route::prefix('/faculty')->middleware('auth:sanctum')
    ->controller(FacultyController::class)->group(function () {
        Route::get('/complete', 'autocomplete');
    });

Route::prefix('/subject')->middleware('auth:sanctum')
    ->controller(SubjectController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::delete('/', 'destroy');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
    });

Route::prefix('/chapter')->middleware('auth:sanctum')
    ->controller(SubjectController::class)->group(function () {
        Route::post('/', 'store');
        Route::delete('/', 'destroy');
        Route::put('/{id}', 'update');
    });
