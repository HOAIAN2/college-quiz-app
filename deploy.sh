#!/bin/sh
rm -rf vendor
rm app.tar.gz
composer install --optimize-autoloader --no-dev
php artisan optimize:clear
rm storage/logs/laravel.log
rm -rf storage/framework/sessions/*
echo 'Compressing...'
tar --exclude=client --exclude=node_modules --exclude=img --exclude=.git --exclude=composer.lock --exclude='app.tar.gz' -czf app.tar.gz *
echo 'Completed!'
