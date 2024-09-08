@extends('mails.layouts.master')

@section('title')
    {{ config('app.name') . ' Password Reset' }}
@endsection

@section('content')
    <p style="color: #555; font-size: 16px; line-height: 1.5;">You have requested to reset your password for your
        {{ config('app.name') }} account. Please use the code provided below to reset your password:</p>
    <div style="text-align: center; margin: 20px 0; font-size: 20px; font-weight: bold; color: #007BFF;">
        {{ $resetCode }}
    </div>
    <p style="color: #555; font-size: 16px;">This code is valid for {{ config('custom.app.otp_code_timeout_seconds') }}
        seconds.</p>
    <p style="color: #555; font-size: 14px;">If you did not request a password reset, please ignore this email or contact
        support if you have concerns.</p>
@endsection
