#!/bin/sh
rm -rf ./public/index.html
rm -rf ./public/assets
cd client
npm run build
cp -r ./dist/* ../public
cd ..