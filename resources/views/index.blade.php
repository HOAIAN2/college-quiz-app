<!doctype html>
<html lang="{{$lang}}">

<head>
  <meta charset="UTF-8" />
  <meta name="description" content="{{$description}}">
  <meta name="keywords" content="{{$keywords}}">
  <meta name="author" content="HOAI AN">
  <meta property="og:title" content="{{$title}}">
  <meta property="og:description" content="{{$description}}">
  <meta property="og:image" content="url_to_your_app_icon_image.jpg">
  <meta property="og:url" content="{{$app_url}}">
  <meta property="og:type" content="website">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preload" href="/fonts/AlumniSans-Regular.ttf" as="font" crossorigin>
  <link rel="preload" href="/fonts/AlumniSans-Light.ttf" as="font" crossorigin>
  <link rel="preload" href="/fonts/AlumniSans-Medium.ttf" as="font" crossorigin>
  <link rel="preload" href="/fonts//AlumniSans-Bold.ttf" as="font" crossorigin>
  <title>{{$title}}</title>
  <script type="module" crossorigin src="/assets/index-B3QST5AU.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-bQqH0dfV.css">
</head>

<body>
  <div class="pre-load-container">
    <div class="pre-load-lds-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
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
      backdrop-filter: blur(10px);
      transition: 0.3s linear;
      z-index: 100;
    }

    .pre-load-container.hide {
      visibility: hidden;
      opacity: 0;
    }

    .pre-load-lds-spinner {
      display: inline-block;
      left: 50%;
      top: 50%;
      width: 80px;
      height: 80px;
    }

    .pre-load-lds-spinner div {
      transform-origin: 40px 40px;
      animation: pre-load-lds-spinner 1.2s linear infinite;
    }

    .pre-load-lds-spinner div:after {
      content: " ";
      display: block;
      position: absolute;
      top: 3px;
      left: 37px;
      width: 6px;
      height: 18px;
      border-radius: 20%;
      background: rgb(0, 0, 0);
    }

    .pre-load-lds-spinner div:nth-child(1) {
      transform: rotate(0deg);
      animation-delay: -1.1s;
    }

    .pre-load-lds-spinner div:nth-child(2) {
      transform: rotate(30deg);
      animation-delay: -1s;
    }

    .pre-load-lds-spinner div:nth-child(3) {
      transform: rotate(60deg);
      animation-delay: -0.9s;
    }

    .pre-load-lds-spinner div:nth-child(4) {
      transform: rotate(90deg);
      animation-delay: -0.8s;
    }

    .pre-load-lds-spinner div:nth-child(5) {
      transform: rotate(120deg);
      animation-delay: -0.7s;
    }

    .pre-load-lds-spinner div:nth-child(6) {
      transform: rotate(150deg);
      animation-delay: -0.6s;
    }

    .pre-load-lds-spinner div:nth-child(7) {
      transform: rotate(180deg);
      animation-delay: -0.5s;
    }

    .pre-load-lds-spinner div:nth-child(8) {
      transform: rotate(210deg);
      animation-delay: -0.4s;
    }

    .pre-load-lds-spinner div:nth-child(9) {
      transform: rotate(240deg);
      animation-delay: -0.3s;
    }

    .pre-load-lds-spinner div:nth-child(10) {
      transform: rotate(270deg);
      animation-delay: -0.2s;
    }

    .pre-load-lds-spinner div:nth-child(11) {
      transform: rotate(300deg);
      animation-delay: -0.1s;
    }

    .pre-load-lds-spinner div:nth-child(12) {
      transform: rotate(330deg);
      animation-delay: 0s;
    }

    @keyframes pre-load-lds-spinner {
      0% {
        opacity: 1;
      }

      100% {
        opacity: 0;
      }
    }
  </style>
  <div id="root"></div>
</body>

</html>