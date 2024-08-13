# Build Client Stage
FROM node:alpine AS node-builder
WORKDIR /app
COPY client .
RUN cp -n .env.example .env
RUN npm install && npm run build

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

WORKDIR /var/www/app
COPY . .

# Install Composer dependencies
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy the built frontend assets to the Laravel public directory
COPY --from=node-builder /app/dist /var/www/app/public
COPY --from=node-builder /app/dist/index.html /var/www/app/resources/views/index.blade.php

# Grant permissions
RUN chown -R www-data:www-data /var/www/app/storage /var/www/app/bootstrap/cache

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;'"]
