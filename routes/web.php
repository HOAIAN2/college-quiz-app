<?php

use App\Http\Controllers\Web\HomeController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::fallback(function () {
//     return File::get(public_path() . '/index.html');
// });
Route::fallback([HomeController::class, 'index']);
