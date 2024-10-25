#!/bin/bash
ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )
cd $ROOT_DIR
cd backend
composer i
composer run-script post-root-package-install
composer run-script post-create-project-cmd
cd $ROOT_DIR
cd frontend
npm i
cp .env.example .env
cp docker/nginx/nginx.example.conf docker/nginx/nginx.conf
cp docker/php/zz-docker.example.conf docker/php/zz-docker.conf