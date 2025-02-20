#!/bin/bash
set -e
ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )
cd $ROOT_DIR

if [[ $1 = '--docker' ]] ; then
    docker compose build
    docker image prune --filter="dangling=true" --force
else
    cd frontend
    npm run build
    cd $ROOT_DIR
    cd backend
    rm public/index.html
    rm public/favicon.ico
    rm -rf public/assets
    cp -r ../frontend/dist/* public
    echo 'Copying distribution to server...'
    if [ ! -d ./resources/views ]; then
        mkdir ./resources/views
    fi
    cp -r ./public/index.html ./resources/views/index.blade.php
    echo 'Completed!'
fi
