#!/bin/sh
composer install --ignore-platform-reqs
composer run-script post-root-package-install && composer run-script post-create-project-cmd
npm install
cd client
npm install
echo "VITE_DEV_PORT=3000" >> .env
echo "VITE_DEV_SERVER_PORT=8000" >> .env
cd ..