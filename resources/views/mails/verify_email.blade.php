@extends('mails.layouts.master')

@section('title')
    {{ config('app.name') . ' Verify Email' }}
@endsection

@section('content')
    <p style="color: #555; font-size: 16px; line-height: 1.5;">This is a verification email for {{ config('app.name') }}.
        To complete the process, please enter the verification code provided below on our website:</p>
    <div style="text-align: center; margin: 20px 0; font-size: 20px; font-weight: bold; color: #007BFF;">
        {{ $verificationCode }}
    </div>
    <p style="color: #555; font-size: 16px;">This code is valid for {{ config('app.otp_code_timeout') }} seconds.</p>
    <p style="color: #555; font-size: 14px;">If you did not request this verification, please ignore this email.</p>
@endsection
