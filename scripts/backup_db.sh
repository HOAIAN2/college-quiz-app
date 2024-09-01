#!/bin/sh
ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )/.." &> /dev/null && pwd )

ENV_FILE="$ROOT_DIR/backend/.env"

# Source the .env file
if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
else
  echo ".env file not found!"
  exit 1
fi

echo "Enter dump directory: (exluce trailing slash)"
read EXPORT_SQL_DIR

# Backup database
TIMESTAMP=$(date +%s)

mariadb-dump --skip-lock-tables --routines --add-drop-table --disable-keys --extended-insert \
 -u $DB_USERNAME \
 --host=$DB_HOST \
 --port=$DB_PORT $DB_DATABASE \
 --password=$DB_PASSWORD > $EXPORT_SQL_DIR/$DB_DATABASE-$TIMESTAMP.sql
