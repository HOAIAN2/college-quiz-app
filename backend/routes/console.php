<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    Artisan::call('app:clear-expired-otp-codes');
    Artisan::call('sanctum:prune-expired --hours=0');
})->daily();

Schedule::call((function () {
    Artisan::call('app:delete-trashed-questions');
}))->weekly();
