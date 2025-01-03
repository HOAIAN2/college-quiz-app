<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    Artisan::call('app:clear-unsed-tokens');
    Artisan::call('app:cancel-late-exams');
    Artisan::call('app:clear-expired-otp-codes');
})
    ->everyMinute();


Schedule::call((function () {
    Artisan::call('app:cleanup-images');
}))->weekly();
