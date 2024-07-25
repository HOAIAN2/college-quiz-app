<div
    style="font-family: Roboto, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
    <h2 style="color: #333; text-align: center;">{{ config('app.name') . ' Verify Email' }}</h2>
    <p style="color: #555; font-size: 16px; line-height: 1.5;">This is a verification email for {{ config('app.name') }}.
        To complete the process, please enter the verification code provided below on our website:</p>
    <div style="text-align: center; margin: 20px 0; font-size: 20px; font-weight: bold; color: #007BFF;">
        {{ $verificationCode }}
    </div>
    <p style="color: #555; font-size: 14px;">If you did not request this verification, please ignore this email.</p>
    <p style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">&copy; {{ date('Y') }}
        {{ config('app.name') }}. All rights reserved.</p>
</div>
