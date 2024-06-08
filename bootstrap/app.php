<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
	->withRouting(
		web: __DIR__ . '/../routes/web.php',
		api: __DIR__ . '/../routes/api.php',
		commands: __DIR__ . '/../routes/console.php',
		health: '/up',
	)
	->withMiddleware(function (Middleware $middleware) {
		$middleware->validateCsrfTokens(except: [
			'*',
		]);

		$middleware->use([
			// \Illuminate\Http\Middleware\TrustHosts::class,
			\Illuminate\Http\Middleware\TrustProxies::class,
			\Illuminate\Http\Middleware\HandleCors::class,
			\Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance::class,
			\Illuminate\Http\Middleware\ValidatePostSize::class,
			\Illuminate\Foundation\Http\Middleware\TrimStrings::class,
			\Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
			\App\Http\Middleware\Locale::class,
		]);

		$middleware->group('web', [
			\Illuminate\Cookie\Middleware\EncryptCookies::class,
			\Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
			\Illuminate\Session\Middleware\StartSession::class,
			\Illuminate\View\Middleware\ShareErrorsFromSession::class,
			\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
			\Illuminate\Routing\Middleware\SubstituteBindings::class,
			// \Illuminate\Session\Middleware\AuthenticateSession::class,

		]);

		$middleware->group('api', [
			\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
			'throttle:api',
			\Illuminate\Routing\Middleware\SubstituteBindings::class,
			\App\Http\Middleware\CamelCaseResponse::class,
			\App\Http\Middleware\RunTasks::class,
			// \App\Http\Middleware\Authenticate::class,
			// \App\Http\Middleware\AcceptContentType::class,
		]);

		$middleware->alias([
			'auth' => \App\Http\Middleware\Authenticate::class,
		]);
	})
	->withExceptions(function (Exceptions $exceptions) {
		//
	})->create();
