#!/bin/sh
composer install
composer run-script post-root-package-install && composer run-script post-create-project-cmd
cd client
npm install
cp .env.example .env
