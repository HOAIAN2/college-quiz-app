#!/bin/sh
rm -rf vendor
rm app.zip
composer install --optimize-autoloader --no-dev
php artisan config:clear
php artisan route:clear
php artisan cache:clear