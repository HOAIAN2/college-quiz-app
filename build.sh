#!/bin/sh
cd client
npm run build
rm ../public/index.html
rm ../public/favicon.ico
rm -rf ../public/assets
cp -r ./dist/* ../public
cd ..
echo 'Copying distribution to server...'
if [ ! -d ./resources/views ]; then
    mkdir ./resources/views
fi
cp -r ./public/index.html ./resources/views/index.blade.php
echo 'Completed!'
