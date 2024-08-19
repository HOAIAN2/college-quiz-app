# Build Client Stage
FROM node:alpine AS node-builder
WORKDIR /app
COPY client .
RUN cp -n .env.example .env && \
    npm install && npm run build

# Laravel Stage
FROM php:8.2-fpm-alpine AS php-laravel

RUN apk add --no-cache \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libxpm-dev \
    icu-dev \
    libxml2-dev \
    libzip-dev \
    oniguruma-dev \
    zlib-dev \
    nginx \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd intl opcache pdo pdo_mysql zip

WORKDIR /var/www/college-quiz-app
COPY . .

# Install Composer dependencies
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts && \
    php artisan optimize:clear && \
    rm -f storage/logs/laravel.log && \
    rm -f storage/framework/sessions/* && \
    php artisan optimize

# Copy the built frontend assets to the Laravel public directory
COPY --from=node-builder /app/dist /var/www/college-quiz-app/public
COPY --from=node-builder /app/dist/index.html /var/www/college-quiz-app/resources/views/index.blade.php

# Grant permissions
RUN chown -R www-data:www-data /var/www/college-quiz-app/storage /var/www/college-quiz-app/bootstrap/cache

# Extra stuff: config, logging,...

COPY ./docker/nginx.conf /etc/nginx/http.d/college-quiz-app.conf
COPY ./docker/cronjob /etc/crontabs/root

RUN sed -i 's/access.log = \/proc\/self\/fd\/2/access.log = \/proc\/self\/fd\/1/g' /usr/local/etc/php-fpm.d/docker.conf

RUN sed -i 's/^pm.max_children = .*/pm.max_children = 25/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/^pm.start_servers = .*/pm.start_servers = 10/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/^pm.min_spare_servers = .*/pm.min_spare_servers = 1/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/^pm.max_spare_servers = .*/pm.max_spare_servers = 20/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/^pm.max_requests = .*/pm.max_requests = 500/' /usr/local/etc/php-fpm.d/www.conf


# Configure PHP-FPM to listen on a Unix socket with proper permissions
RUN sed -i 's|listen = 9000|listen = /var/run/php-fpm.sock|' /usr/local/etc/php-fpm.d/zz-docker.conf && \
    mkdir -p /var/run/php-fpm && \
    chown -R www-data:www-data /var/run/php-fpm && \
    echo "listen.owner = www-data" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "listen.group = www-data" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "listen.mode = 0660" >> /usr/local/etc/php-fpm.d/www.conf

EXPOSE 80

CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;' & crond -f"]
