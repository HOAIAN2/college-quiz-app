#!/bin/sh
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
./build.sh
rm app.tar.gz
cd backend
composer install --optimize-autoloader --no-dev
php artisan optimize:clear
rm storage/logs/laravel.log
rm -rf storage/framework/sessions/*
echo 'Compressing...'
tar --exclude=client --exclude=node_modules --exclude=img --exclude=.git --exclude='app.tar.gz' -czf ../app.tar.gz *
echo 'Completed!'
composer i
cd $SCRIPT_DIR
