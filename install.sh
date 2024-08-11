#!/bin/sh
composer i
composer run-script post-root-package-install
composer run-script post-create-project-cmd
cd client
npm i
cp .env.example .env
