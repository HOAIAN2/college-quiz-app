#!/bin/bash
ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )
cd $ROOT_DIR

truncate -s 0 docker/nginx/logs/error.log
truncate -s 0 docker/nginx/logs/access.log
