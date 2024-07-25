<div
    style="font-family: Roboto, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
    <h2 style="color: #333; text-align: center;">{{ config('app.name') . ' Verify Email' }}</h2>
    <p style="color: #555; font-size: 16px; line-height: 1.5;">This is a verification email for {{ config('app.name') }}.
        Click the verify button below to complete the process:</p>
    <div style="text-align: center; margin: 20px 0;">
        <x-email-button text="Verify Email Address" action-url="{{ $verificationUrl }}" />
    </div>
    <p style="color: #555; font-size: 14px;">If the verify button is not working, copy and paste this link into your
        browser's address bar:</p>
    <p style="text-align: center; word-break: break-word;">
        <a href="{{ $verificationUrl }}" style="color: #007BFF;">{{ $verificationUrl }}</a>
    </p>
    <p style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">&copy; {{ date('Y') }}
        {{ config('app.name') }}. All rights reserved.</p>
</div>
