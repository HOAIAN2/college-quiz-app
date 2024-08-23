<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChapterController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\RolePermissionController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\SemesterController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('/settings')->controller(SettingsController::class)->group(function () {
	Route::middleware(['auth:sanctum', 'validate-token'])->group(function () {
		Route::post('/run-artisan', 'runArtisan');
		Route::get('/log', 'getLogFile');
		Route::delete('/log', 'deleteLogFile');
	});
});

Route::prefix('/auth')->controller(AuthController::class)->group(function () {
	Route::post('/login', 'login');
	Route::middleware(['auth:sanctum', 'validate-token'])->group(function () {
		Route::get('/sessions', 'loginSessions');
		Route::delete('/sessions/{id}', 'revokeLoginSession');
		Route::post('/logout', 'logout');
		Route::post('/change-password', 'changePassword');
	});

	Route::post('/send-email-verification', 'sendEmailVerification')->middleware('throttle:3,1');
	Route::post('/verify-email', 'verifyEmail');

	Route::post('/send-password-reset-email', 'sendPasswordResetEmail')->middleware('throttle:3,1');
	Route::post('/verify-password-reset-code', 'verifyPasswordResetCode');
	Route::post('/reset-password', 'resetPassword');
});

Route::prefix('/users')->middleware(['auth:sanctum', 'validate-token'])
	->controller(UserController::class)->group(function () {
		Route::get('/query', 'getUsersByType');
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

Route::prefix('/dashboard')->middleware(['auth:sanctum', 'validate-token'])
	->controller(DashboardController::class)->group(function () {
		Route::get('/', 'index');
	});

Route::prefix('/school-classes')->middleware(['auth:sanctum', 'validate-token'])
	->controller(SchoolClassController::class)->group(function () {
		Route::get('/complete', 'autocomplete');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::get('/', 'index');
		Route::post('/', 'store');
		Route::delete('/', 'destroy');
	});

Route::prefix('/faculties')->middleware(['auth:sanctum', 'validate-token'])
	->controller(FacultyController::class)->group(function () {
		Route::get('/complete', 'autocomplete');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::get('/', 'index');
		Route::post('/', 'store');
		Route::delete('/', 'destroy');
	});

Route::prefix('/subjects')->middleware(['auth:sanctum', 'validate-token'])
	->controller(SubjectController::class)->group(function () {
		Route::get('/complete', 'autocomplete');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});

Route::prefix('/chapters')->middleware(['auth:sanctum', 'validate-token'])
	->controller(ChapterController::class)->group(function () {
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::post('/', 'store');
	});

Route::prefix('/role-permissions')->middleware(['auth:sanctum', 'validate-token'])
	->controller(RolePermissionController::class)->group(function () {
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::get('/', 'index');
	});

Route::prefix('/questions')->middleware(['auth:sanctum', 'validate-token'])
	->controller(QuestionController::class)->group(function () {
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});

Route::prefix('/semesters')->middleware(['auth:sanctum', 'validate-token'])
	->controller(SemesterController::class)->group(function () {
		Route::get('/complete', 'autocomplete');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});

Route::prefix('/courses')->middleware(['auth:sanctum', 'validate-token'])
	->controller(CourseController::class)->group(function () {
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::put('/{id}/students', 'updateStudents');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});

Route::prefix('/exams')->middleware(['auth:sanctum', 'validate-token'])
	->controller(ExamController::class)->group(function () {
		Route::middleware(App\Http\Middleware\RevokeOtherTokens::class)
			->group(function () {
				Route::post('/{id}/sync-cache', 'syncCache');
				Route::get('/{id}/take', 'take');
				Route::post('/{id}/submit', 'submit');
			});
		Route::get('/{id}/export-result', 'exportResult');
		Route::post('/{id}/status', 'updateStatus');
		Route::get('/{id}', 'show');
		Route::put('/{id}', 'update');
		Route::delete('/{id}', 'destroy');
		Route::get('/', 'index');
		Route::post('/', 'store');
	});
