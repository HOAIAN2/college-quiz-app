# Laravel Stage
FROM php:8.2 AS base

ARG UID=1000
ARG GID=1000

# Create the 'vscode' user with the same UID and GID as the host
RUN groupadd -g $GID vscode && \
    useradd -u $UID -g vscode -s /bin/bash -m vscode

COPY --from=node:lts-slim /usr/local/bin /usr/local/bin
COPY --from=node:lts-slim /usr/local/lib /usr/local/lib

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN apt-get update && apt-get install -y --no-install-recommends \
    git

RUN apt-get update && apt-get install -y --no-install-recommends \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libxpm-dev \
    libicu-dev \
    libxml2-dev \
    libzip-dev \
    libonig-dev \
    zlib1g-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd intl opcache pdo pdo_mysql zip ftp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpcre2-dev \
    ${PHPIZE_DEPS} \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get purge -y --auto-remove libpcre2-dev ${PHPIZE_DEPS} \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

USER vscode
