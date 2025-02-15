<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Database\Events\QueryExecuted;
use Laravel\Sanctum\Sanctum;
use App\Models\PersonalAccessToken;

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
        $this->configSanctum();
        $this->configRoutePattern();
        $this->configRateLimit();
        $this->configQueryLog();
    }

    private function configSanctum(): void
    {
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }

    private function configRoutePattern(): void
    {
        Route::pattern('id', '([1-9]+[0-9]*)');
    }

    private function configRateLimit(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(config('custom.app.default_rate_limit'))
                ->by($request->user()?->id ?: $request->ip());
        });
    }

    private function configQueryLog(): void
    {
        // Debug
        if (config('app.debug') == true && !app()->runningInConsole())
            DB::listen(function (QueryExecuted $query) {
                Log::debug($query->sql, [
                    'time' => "$query->time ms"
                ]);
            });

        // Slow queries
        DB::listen(function (QueryExecuted $query) {
            if ($query->time > config('custom.query.slow_query_time')) {
                Log::alert('Slow query', [
                    'query' => $query->sql,
                    'time' => "$query->time ms",
                    'url' => request()->url(),
                ]);
            }
        });
    }
}
