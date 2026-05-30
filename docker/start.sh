#!/bin/sh
set -e

cd /var/www/html

php artisan config:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache


php-fpm -D

sleep 5
netstat -tlnp | grep 9000 || echo "PHP-FPM NOT listening on 9000"

nginx -g "daemon off;"