<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="description" content="@lang('app.meta.description')">
    <meta name="keywords" content="@lang('app.meta.keywords')">
    <meta name="author" content="HOAI AN">
    <meta property="og:title" content="{{ config('app.name') }}">
    <meta property="og:description" content="@lang('app.meta.description')">
    <meta property="og:image" content="/favicon.ico">
    <meta property="og:url" content="{{ config('app.url') }}">
    <meta property="og:type" content="website">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
        rel="stylesheet">
    <title>{{ config('app.name') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            scroll-behavior: smooth;
        }

        :root {
            --color-blue: rgb(56, 132, 247);
            --color-red: rgb(239, 6, 49);
            --color-green: rgb(0, 137, 0);
            --color-yellow: rgb(213, 188, 4);
            --color-shadow: rgb(210, 217, 228);
            --color-white: rgb(246, 246, 246);
            --color-gray: rgb(221, 223, 235);
            --color-background: rgb(242, 244, 247);
            --color-soft-yellow: rgb(248, 229, 87);
            --color-soft-magenta: rgb(78, 115, 223);
            --color-soft-blue: rgb(54, 185, 204);
            --color-soft-red: rgb(250, 143, 173);
            --color-soft-green: rgb(28, 200, 138);
            --border-radius-low: 5px;
            --border-radius-medium: 15px;
            --transition-timing-fast: .3s;
            --transition-timing-medium: .4s;
            --transition-timing-slow: .5s;
        }

        body {
            width: 100vw;
            height: 100vh;
            overflow-x: hidden;
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
                sans-serif;
            font-size: 14px;
        }

        header {
            height: 75px;
            background-color: #fff;
            position: relative;
            border-bottom: 1px solid var(--color-shadow);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            z-index: 2;
            position: sticky;
            top: 0;
        }

        header>div {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        main {
            width: 800px;
            margin: 0 auto;
        }
    </style>
</head>

<body>
    <header>
        <div>
            <a href="/">
                <img height="30" src="/favicon.ico" alt="">
            </a>
            <p style="font-size: 22px; font-weight: bold;">
                {{ config('app.name') }}
            </p>
        </div>
    </header>
    <main>
        @yield('content')
    </main>
</body>

</html>
