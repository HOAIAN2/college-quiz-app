<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChapterController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\RolePermissionController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\SemesterController;
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

Route::prefix('/admin')->middleware(App\Http\Middleware\VerifyAppKey::class)
	->controller(AdminController::class)->group(function () {
		Route::post('/run-artisan', 'runArtisan');
	});

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
		Route::get('/exportable', 'exportableFields');
		Route::get('/all-user', 'getAllUsers');
		Route::get('/complete', 'autocomplete');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::get('/', 'index');
		Route::post('/', 'store');
		Route::delete('/', 'destroy');
	});

Route::prefix('/dashboard')->middleware('auth:sanctum')
	->controller(DashboardController::class)->group(function () {
		Route::get('/', 'index');
	});

Route::prefix('/school-class')->middleware('auth:sanctum')
	->controller(SchoolClassController::class)->group(function () {
		Route::get('/complete', 'autocomplete');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::get('/', 'index');
		Route::post('/', 'store');
		Route::delete('/', 'destroy');
	});

Route::prefix('/faculty')->middleware('auth:sanctum')
	->controller(FacultyController::class)->group(function () {
		Route::get('/complete', 'autocomplete');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::get('/', 'index');
		Route::post('/', 'store');
		Route::delete('/', 'destroy');
	});

Route::prefix('/subject')->middleware('auth:sanctum')
	->controller(SubjectController::class)->group(function () {
		Route::get('/complete', 'autocomplete');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});

Route::prefix('/chapter')->middleware('auth:sanctum')
	->controller(ChapterController::class)->group(function () {
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::post('/', 'store');
	});

Route::prefix('/role-permission')->middleware('auth:sanctum')
	->controller(RolePermissionController::class)->group(function () {
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::get('/', 'index');
	});

Route::prefix('/question')->middleware('auth:sanctum')
	->controller(QuestionController::class)->group(function () {
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});

Route::prefix('/semester')->middleware('auth:sanctum')
	->controller(SemesterController::class)->group(function () {
		Route::get('/complete', 'autocomplete');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});

Route::prefix('/course')->middleware('auth:sanctum')
	->controller(CourseController::class)->group(function () {
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::put('/{id}/students', 'updateStudents');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});

Route::prefix('/exam')->middleware('auth:sanctum')
	->controller(ExamController::class)->group(function () {
		Route::post('/{id}/status', 'updateStatus');
		Route::get('/{id}/questions', 'questions');
		Route::post('/{id}/submit', 'submit');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});
