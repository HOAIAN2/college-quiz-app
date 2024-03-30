#!/bin/sh
rm ./public/index.html
rm -rf ./public/icon.png
rm -rf ./public/favicon.ico
rm -rf ./public/assets
rm -rf ./public/langs
cd client
npm run build
cp -r ./dist/* ../public
cd ..
echo 'Copying distribution to server...'
if [ ! -d ./resources/views ]; then
    mkdir ./resources/views
fi
cp -r ./public/index.html ./resources/views/index.blade.php
echo 'Completed!'
