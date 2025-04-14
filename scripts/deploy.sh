#!/bin/bash
set -e
ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [[ $1 = '--docker' ]] ; then
    cd $ROOT_DIR
    docker compose down
    $SCRIPT_DIR/build.sh --docker
    docker compose up -d
else
    $SCRIPT_DIR/build.sh
    cd $ROOT_DIR
    rm -f app.tar.gz
    cd backend
    rm -rf vendor
    composer install --optimize-autoloader --no-dev
    php artisan optimize:clear
    truncate -s 0 storage/logs/laravel.log
    rm -rf storage/framework/sessions/*
    find bootstrap/cache/ ! -name '.gitignore' -type f -delete
    echo 'Compressing...'
    tar --exclude=node_modules --exclude=dump --exclude=storage/uploads -czf $ROOT_DIR/app.tar.gz * .env.example
    echo 'Compress completed!'
    composer i
    cd $ROOT_DIR
fi
