#!/bin/sh
composer install --ignore-platform-reqs
composer run-script post-root-package-install && composer run-script post-create-project-cmd
npm install