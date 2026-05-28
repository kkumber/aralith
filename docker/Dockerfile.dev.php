FROM php:8.2-cli-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    git \
    libpng-dev \
    libjpeg-turbo-dev \
    postgresql-dev \
    postgresql-client \
    libwebp-dev \
    libxpm-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    zip \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd zip

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./

RUN composer install --no-interaction --no-plugins --no-scripts

COPY . .


RUN echo "upload_max_file_size=10M" > /usr/local/etc/php/conf.d/upload.ini && \
    echo "post_max_size=10M" >> /usr/local/etc/php/conf.d/upload.ini && \
    echo "memory_limit=128M" >> /usr/local/etc/php/conf.d/upload.ini && \
    echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/upload.ini

EXPOSE 8000

CMD php artisan package:discover --ansi && php artisan serve --host=0.0.0.0