#!/bin/sh
rm -rf vendor
#rm app.zip
rm app.tar.gz
composer install --optimize-autoloader --no-dev
php artisan config:clear
php artisan route:clear
php artisan cache:clear
# Zip only work on Linux
#zip -r app . -x "/node_modules/*" "/client/*" "/dump/*" "/img/*" "/.git/*" "composer.lock"
tar --exclude=client --exclude=dump --exclude=node_modules --exclude=img --exclude=.git --exclude=composer.lock --exclude='app.tar.gz' -czvf app.tar.gz *