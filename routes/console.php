<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
	Artisan::call('app:clear-unsed-tokens');
	Artisan::call('app:cancel-late-exams');
})->name('Important tasks')
	->everyMinute();

Schedule::call(function () {
	Artisan::call('app:backup-database');
})->name('Backup database')
	->daily();
