# College-Quiz-App

## Prerequisites

- Nodejs (only for Dev)
- PHP 8.1 or later
- MySQL / MariaDB

## Installation

``` console
git clone https://github.com/HOAIAN2/e-commerce.git
```

- Run `prepare.sh` to generate .env file and install libs for server and client.
- Edit Enviroment variables in .env file.

``` env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=college-quiz-app
DB_USERNAME=admin
DB_PASSWORD=123456789
````

- Create databse

```console
php artisan migrate
```

- Seed databse (Change root account in databse/seeders/UserSeeder.php)

```console
php artisan db:seed
```

[Banner from freepik](https://www.freepik.com/free-vector/mega-sale-banner-your-online-store-realistic-style-with-phone-map-cart-bag-gift-vector-illustration_21869797.htm#query=online%20shop%20banner&position=30&from_view=keyword&track=ais)

## Build

- Run `build.bat` or `build.sh` to build ReactJS and start server

## Database Diagram

![Docs](./database//e-commerce.png)

## API docs and preview

![Docs](./screenshot/API_Swagger.png)
![Docs](./screenshot/Screenshot%202023-07-28%20145959.png)
![Docs](./screenshot/Screenshot%202023-07-28%20150014.png)
![Docs](./screenshot/Screenshot%202023-07-28%20150031.png)
![Docs](./screenshot/Screenshot%202023-07-28%20150044.png)
