#!/bin/sh
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd backend
composer i
composer run-script post-root-package-install
composer run-script post-create-project-cmd
cd $SCRIPT_DIR
cd frontend
npm i
cp .env.example .env
