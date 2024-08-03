<div
    style="font-family: Roboto, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
    <h2 style="color: #333; text-align: center;">
        @yield('title')
    </h2>
    @yield('content')
    <p style="color: #777; font-size: 12px; text-align: center; margin-top: 20px;">
        &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
    </p>
</div>
