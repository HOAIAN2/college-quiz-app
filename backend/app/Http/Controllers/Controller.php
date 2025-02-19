<?php

namespace App\Http\Controllers;

use App\Helper\Reply;
use Illuminate\Support\Facades\Log;

abstract class Controller
{
    protected int $autoCompleteResultLimit = 0;
    protected int $defaultLimit = 50;

    public function __construct()
    {
        $this->autoCompleteResultLimit = config('custom.query.auto_complete_result_limit');
        $this->defaultLimit = config('custom.query.default_limit');
    }

    public function getUser(): mixed
    {
        return auth('sanctum')->user();
    }

    public function handleException(\Exception $error)
    {
        $context = [
            'error_type' => get_class($error),
            'user_id' => $this->getUser()?->id ?? 'guest',
            'url' => request()->fullUrl(),
            'method' => request()->method(),
            'request_data' => request()->except(['password', 'password_confirmation', 'token']), // Avoid logging sensitive data
            'stack_trace' => $error->getTrace()[0] ?? [],
        ];
        Log::error($error->getMessage(), $context);
        $message = config('app.debug') ? $error->getMessage() : trans('app.errors.something_went_wrong');
        if ($error instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
            return Reply::error(trans('app.errors.404'), 404);
        }
        return Reply::error($message, 500);
    }
}
