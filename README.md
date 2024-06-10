# College-Quiz-App

## Technologies

- Laravel 11
- React 18

## Prerequisites

- Nodejs (only for Dev)
- PHP 8.2 or later
- MySQL / MariaDB

## Installation

``` console
git clone https://github.com/HOAIAN2/college-quiz-app.git
```

- Run `install.sh` to generate .env file and install libs for both server and client.
- Edit Enviroment variables in .env file.

``` env
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=college-quiz-app
DB_USERNAME=admin
DB_PASSWORD=123456789
````

- Remember to update your correct timezone

``` env
APP_TIMEZONE=UTC
```

- Create databse, seed data

```console
php artisan migrate
```

```console
php artisan db:seed
```

- Seed databse (Change root account in databse/seeders/UserSeeder.php)

- Build

Some free hosting like infinityfree, 000webhost only allow GET, POST method so you can config override method when call api on client

``` env
VITE_DEV_PORT=3000
VITE_DEV_SERVER_PORT=8000
VITE_OVERRIDE_HTTP_METHOD=true
```

## Deploy

Run Deploy file to build and compress all necessary files to app.tar.gz

```console
./deploy.sh
```

Run `composer install` to continue development or just use this everytime.

```console
./build && ./deploy.sh && composer install
```

## Cron Job

Free hostings do not allow run cron job so I setup cron job inside a middlware in bootstrap/app.php. But you can also setup "real" cron job: <https://laravel.com/docs/scheduling>

```php
$middleware->group('api', [
   \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
   'throttle:api',
   \Illuminate\Routing\Middleware\SubstituteBindings::class,
   \App\Http\Middleware\CamelCaseResponse::class,
   \App\Http\Middleware\RunTasks::class,
   // \App\Http\Middleware\Authenticate::class,
   // \App\Http\Middleware\AcceptContentType::class,
  ]);
```

## Databse Diagram

![DB Diagram](./img/college-quiz-app.png)

## Demo

### Dashboard UI

![Demo](./img/Screenshot%202024-06-03%20075639.jpg)

### Students UI

![Demo](./img/Screenshot%202024-05-19%20092946.jpg)

### Course UI

![Demo](./img/Screenshot%202024-05-19%20093057.jpg)

### Exams UI

![Demo](./img/Screenshot%202024-05-19%20093427.jpg)

![Demo](./img/Screenshot%202024-05-19%20094618.jpg)

### Exam UI

![Demo](./img/Screenshot%202024-05-23%20124000.jpg)

### Take Exam UI

![Demo](./img/Screenshot%202024-05-20%20144619.jpg)

### Exam Result UI

![Demo](./img/Screenshot%202024-05-20%20144710.jpg)

Full review (Vietnamese) at Youtube: <https://www.youtube.com/watch?v=Xkss5f4N0vw>
