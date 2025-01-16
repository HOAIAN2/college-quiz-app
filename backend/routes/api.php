<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChapterController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\ExamResultController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\RolePermissionController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\SemesterController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

if (!defined('AUTH_MIDDLEWARES')) define('AUTH_MIDDLEWARES', ['auth:sanctum', 'validate-token']);

Route::prefix('/settings')->controller(SettingController::class)->group(function () {
    Route::middleware(AUTH_MIDDLEWARES)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'update');
        Route::get('/commands', 'getCommands');
        Route::post('/run-artisan', 'runArtisan');
        Route::get('/log', 'getLogFile');
        Route::delete('/log', 'deleteLogFile');
    });
});

Route::prefix('/auth')->controller(AuthController::class)->group(function () {
    Route::post('/login', 'login');
    Route::middleware(AUTH_MIDDLEWARES)->group(function () {
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

Route::prefix('/users')->middleware(AUTH_MIDDLEWARES)
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

Route::prefix('/dashboard')->middleware(AUTH_MIDDLEWARES)
    ->controller(DashboardController::class)->group(function () {
        Route::get('/', 'index');
    });

Route::prefix('/school-classes')->middleware(AUTH_MIDDLEWARES)
    ->controller(SchoolClassController::class)->group(function () {
        Route::get('/complete', 'autocomplete');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::delete('/', 'destroy');
    });

Route::prefix('/faculties')->middleware(AUTH_MIDDLEWARES)
    ->controller(FacultyController::class)->group(function () {
        Route::get('/complete', 'autocomplete');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::delete('/', 'destroy');
    });

Route::prefix('/subjects')->middleware(AUTH_MIDDLEWARES)
    ->controller(SubjectController::class)->group(function () {
        Route::get('/complete', 'autocomplete');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
        Route::get('/', 'index');
        Route::post('/', 'store');
    });

Route::prefix('/chapters')->middleware(AUTH_MIDDLEWARES)
    ->controller(ChapterController::class)->group(function () {
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
        Route::post('/', 'store');
    });

Route::prefix('/role-permissions')->middleware(AUTH_MIDDLEWARES)
    ->controller(RolePermissionController::class)->group(function () {
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::get('/', 'index');
    });

Route::prefix('/questions')->middleware(AUTH_MIDDLEWARES)
    ->controller(QuestionController::class)->group(function () {
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
        Route::get('/', 'index');
        Route::post('/', 'store');
    });

Route::prefix('/semesters')->middleware(AUTH_MIDDLEWARES)
    ->controller(SemesterController::class)->group(function () {
        Route::get('/complete', 'autocomplete');
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
        Route::get('/', 'index');
        Route::post('/', 'store');
    });

Route::prefix('/courses')->middleware(AUTH_MIDDLEWARES)
    ->controller(CourseController::class)->group(function () {
        Route::get('/{id}', 'show');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
        Route::put('/{id}/students', 'updateStudents');
        Route::get('/', 'index');
        Route::post('/', 'store');
    });

Route::prefix('/exams')->middleware(AUTH_MIDDLEWARES)
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

Route::prefix('/exam-results')->middleware(AUTH_MIDDLEWARES)
    ->controller(ExamResultController::class)->group(function () {
        Route::get('/{id}', 'show');
        Route::get('/{id}/remark', 'remark');
        Route::post('/{id}/cancel', 'cancel');
        Route::get('/', 'index');
    });
