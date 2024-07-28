<div
    style="font-family: Roboto, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
    <h2 style="color: #333; text-align: center;">{{ config('app.name') . ' Password Reset' }}</h2>
    <p style="color: #555; font-size: 16px; line-height: 1.5;">You have requested to reset your password for your
        {{ config('app.name') }} account. Please use the code provided below to reset your password:</p>
    <div style="text-align: center; margin: 20px 0; font-size: 20px; font-weight: bold; color: #007BFF;">
        {{ $resetCode }}
    </div>
    <p style="color: #555; font-size: 16px;">This code is valid for {{ config('app.otp_code_timeout') }} seconds.</p>
    <p style="color: #555; font-size: 14px;">If you did not request a password reset, please ignore this email or contact
        support if you have concerns.</p>
    <p style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">&copy; {{ date('Y') }}
        {{ config('app.name') }}. All rights reserved.</p>
</div>
