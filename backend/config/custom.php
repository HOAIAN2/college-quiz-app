<?php

return [
    'app' => [
        'demo' => (bool)env('DEMO', false),
        'app_author' => env('APP_AUTHOR'),
        'must_verify_email' => (bool)env('MUST_VERIFY_EMAIL', false),
        'run_tasks_interval' => (int)env('RUN_TASK_INTERVAL'),
        'otp_code_timeout_seconds' => (int)env('OTP_CODE_TIMEOUT_SECONDS', 600),
        'token_expiration_minutes' => (int)env('TOKEN_EXPIRATION_MINUTES'),
        'default_rate_limit' => (int)env('DEFAULT_RATE_LIMIT', 100),
        'content_security_policy' => env('CONTENT_SECURITY_POLICY'),
    ],
    'exam' => [
        'base_score_scale' => (int)env('BASE_SCORE_SCALE', 10),
        'max_late_seconds' => env('MAX_LATE_SECONDS'),
        'allow_late_submit_seconds' => (int)env('EXAM_ALLOW_LATE_SUBMIT_SECONDS', 60),
    ],
    'query' => [
        'auto_complete_result_limit' => (int)env('AUTO_COMPLETE_RESULT_LIMIT', 5),
        'default_limit' => (int) env('DEFAULT_QUERY_LIMIT', 50),
    ]
];
