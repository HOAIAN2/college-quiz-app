#!/bin/sh
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd frontend
npm run build
cd $SCRIPT_DIR
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
