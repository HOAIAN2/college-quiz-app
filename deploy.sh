#!/bin/sh
read -p "Do you want to seprate vendor to another file? (yes/no): " response

response=${response:-yes}
start_time=$(date +%s)
rm -rf vendor

find . -type f -name '*.tar.gz' -exec rm {} +

composer install --optimize-autoloader --no-dev
php artisan config:clear
php artisan route:clear
php artisan cache:clear
rm storage/logs/laravel.log

# Check the user's response
if [ "$response" == "yes" ]; then
    tar --exclude=vendor --exclude=client --exclude=dump --exclude=node_modules --exclude=img --exclude=.git --exclude=composer.lock --exclude='app.tar.gz' -czvf app.tar.gz *
    tar -czvf vendor.tar.gz vendor
    end_time=$(date +%s)
    elapsed_time=$((end_time - start_time))
   echo -e "Script executed in \e[1m$elapsed_time\e[0m seconds."
else
    tar --exclude=client --exclude=dump --exclude=node_modules --exclude=img --exclude=.git --exclude=composer.lock --exclude='app.tar.gz' -czvf app.tar.gz *
    end_time=$(date +%s)
    elapsed_time=$((end_time - start_time))
    echo -e "Script executed in \e[1m$elapsed_time\e[0m seconds."
fi