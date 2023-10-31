<?php

namespace App\Providers;

use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (env('APP_DEBUG') == true)
            DB::listen(function (QueryExecuted $query) {
                // $query->sql;
                // $query->bindings;
                // $query->time;
                error_log($query->sql);
            });
    }
}
