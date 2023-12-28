#!/bin/sh
read -p "Do you want to ignore vendor folder? (yes/no): " response

response=${response:-yes}
start_time=$(date +%s)

php artisan config:clear
php artisan route:clear
php artisan cache:clear
rm ./storage/logs/laravel.log
rm -rf ./storage/framework/sessions/*

# Check the user's response
if [ "$response" == "yes" ]; then
    rm app.tar.gz
    tar --exclude=vendor --exclude=client --exclude=dump --exclude=node_modules --exclude=img --exclude=.git --exclude=composer.lock --exclude='app.tar.gz' -czvf app.tar.gz *
    end_time=$(date +%s)
    elapsed_time=$((end_time - start_time))
    echo -e "Script executed in \e[1m$elapsed_time\e[0m seconds."
else
    rm -rf vendor
    composer install --optimize-autoloader --no-dev
    find . -type f -name '*.tar.gz' -exec rm {} +
    tar --exclude=vendor --exclude=client --exclude=dump --exclude=node_modules --exclude=img --exclude=.git --exclude=composer.lock --exclude='app.tar.gz' -czvf app.tar.gz *
    tar -czvf vendor.tar.gz vendor
    end_time=$(date +%s)
    elapsed_time=$((end_time - start_time))
    echo -e "Script executed in \e[1m$elapsed_time\e[0m seconds."
fi