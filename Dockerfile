# Build Client Stage
FROM node:alpine AS node-builder
WORKDIR /app
COPY frontend .
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

# Redis extension
RUN apk --no-cache add pcre-dev ${PHPIZE_DEPS} \
	&& pecl install redis \
	&& docker-php-ext-enable redis \
	&& apk del pcre-dev ${PHPIZE_DEPS} \
	&& rm -rf /tmp/pear

WORKDIR /var/www/college-quiz-app
COPY backend .

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
COPY ./docker/php/zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf

# Handle php-fpm via unix socket
RUN mkdir -p /var/run/php-fpm && \
	chown -R www-data:www-data /var/run/php-fpm

EXPOSE 80

CMD ["sh", "-c", "php-fpm & nginx -g 'daemon off;' & crond -f"]
