#!/bin/bash
ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )
cd $ROOT_DIR

if [[ $1 = '--docker' ]] ; then
    cp -n docker/nginx/nginx.example.conf docker/nginx/nginx.conf
    cp -n docker/php/zz-docker.example.conf docker/php/zz-docker.conf
    cp -n docker-php-ext-opcache.example.ini docker/php/docker-php-ext-opcache.ini
else
    cd backend
    composer i
    composer run-script post-root-package-install
    composer run-script post-create-project-cmd
    cd $ROOT_DIR
    cd frontend
    npm i
    cp -n .env.example .env
fi
