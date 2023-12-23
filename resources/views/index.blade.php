<!doctype html>
<html lang="{{$lang}}">

<head>
  <meta charset="UTF-8" />
  <meta name="description" content="{{$description}}">
  <meta name="keywords" content="{{$keywords}}">
  <meta name="author" content="HOAI AN">
  <meta property="og:title" content="{{$title}}">
  <meta property="og:description" content="{{$description}}">
  <meta property="og:image" content="/icon.png">
  <meta property="og:url" content="{{$app_url}}">
  <meta property="og:type" content="website">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="shortcut icon" href="/icon.png" type="image/x-icon">
  <link rel="preload" href="/fonts/AlumniSans-Regular.ttf" as="font" crossorigin>
  <link rel="preload" href="/fonts/AlumniSans-Light.ttf" as="font" crossorigin>
  <link rel="preload" href="/fonts/AlumniSans-Medium.ttf" as="font" crossorigin>
  <link rel="preload" href="/fonts//AlumniSans-Bold.ttf" as="font" crossorigin>
  <title>{{$title}}</title>
  <script type="module" crossorigin src="/assets/index-ns7b8PKy.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-WoGjJebN.css">
</head>

<body>
  <div class="pre-load-container">
    <img height="80px" src="/icon.png" alt="app icon">
    <style class="pre-load">
      .pre-load-container {
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgb(255, 255, 255, 0.3);
        z-index: 100;
      }

      .pre-load-container.hide {
        visibility: hidden;
        opacity: 0;
      }
    </style>
  </div>
  <div id="root"></div>
</body>

</html>