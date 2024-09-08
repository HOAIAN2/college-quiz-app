#!/bin/bash
ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
$SCRIPT_DIR/build.sh
cd $ROOT_DIR
rm app.tar.gz
cd backend
composer install --optimize-autoloader --no-dev
php artisan optimize:clear
rm -f storage/logs/laravel.log
rm -rf storage/framework/sessions/*
echo 'Compressing...'
tar --exclude=node_modules --exclude=dump -czf ../app.tar.gz *
echo 'Completed!'
composer i
cd $ROOT_DIR
