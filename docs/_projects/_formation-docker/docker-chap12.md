# Citations
- https://oclock.io/deployer-docker-developper-symfony
- https://knplabs.com/fr/blog/comment-dockeriser-un-projet-symfony
- https://w3r.one/fr/blog/web/symfony/deploiement-integration-continue-symfony
- https://symfony.com/doc/current/setup/docker.html
- https://www.youtube.com/watch?v=dBjOBV64bIg
- https://kevinrolin.be/blog/cest-quoi-docker-et-comment-lutiliser-pour-un-projet-symfony
- https://www.youtube.com/watch?v=g_UWtPgUsJo
- https://www.maxpou.fr/blog/docker-pour-symfony/


# Tokens
- prompt_tokens: 302
- completion_tokens: 7436
- total_tokens: 7738
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.112, 'request_cost': 0.006, 'total_cost': 0.118}


# Content
# Docker avec PHP et Symfony

## Mise en place du service PHP avec Symfony

### Fondamentaux de l'intégration PHP dans Docker

L'intégration de PHP dans un environnement Docker pour développer avec Symfony repose sur la compréhension des conteneurs et de leur interaction avec l'application web. Contrairement à une installation locale classique, Docker permet de disposer d'un environnement isolé, reproductible et cohérent entre le développement et la production.

Le processus débute par la création d'une image Docker personnalisée basée sur une image PHP officielle. L'image de base `php:8.2-fpm-alpine` ou `php:8.1-fpm` constitue le point de départ idéal pour une application Symfony[1][2]. Alpine Linux offre une image minimale et légère, tandis que FPM (FastCGI Process Manager) permet la communication avec le serveur web (Nginx ou Apache) via le protocole FastCGI.

### Structure du Dockerfile pour PHP

La création d'un Dockerfile personnalisé commence par définir clairement les besoins spécifiques de l'application Symfony. Le fichier configure l'environnement PHP avec toutes les extensions nécessaires au fonctionnement optimal de l'application.

```dockerfile
FROM php:8.2-fpm-alpine

# Définition des variables d'environnement
ENV PHPUSER=symfony
ENV PHPGROUP=symfony
ENV UID=1000
ENV GID=1000

# Installation des dépendances système
RUN apk add --no-cache \
    autoconf \
    g++ \
    make

# Configuration des extensions PHP pour Symfony
RUN docker-php-ext-configure intl
RUN docker-php-ext-install -j"$(nproc)" \
    pdo \
    pdo_mysql \
    intl \
    zip \
    mbstring

# Création du répertoire applicatif
RUN mkdir -p /var/www/html/public

# Copie de l'application
COPY ./src /var/www/html

# Définition de l'utilisateur PHP
RUN addgroup -g 1006 --system symfony
RUN adduser -G www-data --system -D -s /bin/sh -u 1006 symfony

WORKDIR /var/www/html

CMD ["php-fpm"]
```

Ce Dockerfile établit une foundation solide pour exécuter une application Symfony[1]. Les extensions PHP installées incluent PDO et PDO MySQL pour la gestion des bases de données via Doctrine, ainsi que d'autres extensions essentielles comme intl pour l'internationalisation et zip pour la manipulation d'archives.

### Intégration dans docker-compose.yml

Le service PHP doit être défini dans le fichier de composition Docker qui orchestre l'ensemble des services de l'application[1][2].

```yaml
version: '3.8'

services:
  php:
    build:
      context: .
      dockerfile: php.dockerfile
    args:
      - UID=${UID:-1000}
      - GID=${GID:-1000}
    volumes:
      - ./src:/var/www/html
    environment:
      - DATABASE_URL=mysql://root:password@mysql:3306/symfony_db
      - APP_ENV=dev
      - APP_DEBUG=1
    restart: on-failure
    user: 1000:1000
    networks:
      - symfony
    env_file:
      - .env

networks:
  symfony:
    driver: bridge
```

La directive `volumes` crée un mapping entre le répertoire source local (`./src`) et le répertoire dans le conteneur (`/var/www/html`). Ce mécanisme permet une synchronisation bidirectionnelle du code, facilitant le développement avec rechargement instantané des modifications[1][2].

## Introduction aux environnements PHP

### Configuration multi-environnements avec Symfony

Symfony propose une gestion native des environnements (dev, prod, test) qui s'intègre parfaitement avec Docker. Le fichier `.env` à la racine du projet spécifie le mode d'exécution et les paramètres de connexion à la base de données.

```env
# .env
APP_ENV=dev
APP_DEBUG=1
DATABASE_URL="mysql://root:root_password@mysql:3306/symfony_db"
MAILER_DSN="smtp://mailer:1025"
REDIS_URL="redis://redis:6379"
```

Chaque environnement dispose de fichiers de configuration spécifiques dans le répertoire `config/packages/`. L'environnement de développement active des outils de diagnostic comme le Web Profiler et la barre d'outils Symfony, tandis que l'environnement de production désactive ces fonctionnalités pour optimiser les performances et la sécurité.

### Gestion des variables d'environnement

Docker facilite l'injection de variables d'environnement via plusieurs mécanismes. Le fichier `docker-compose.yml` peut définir directement les variables, les charger depuis un fichier `.env`, ou les passer lors de l'exécution du conteneur.

```yaml
services:
  php:
    environment:
      # Variables directes
      - SYMFONY_ENV=dev
      # Variables dynamiques
      - DATABASE_HOST=mysql
      - DATABASE_PORT=3306
      - DATABASE_NAME=symfony_db
      - DATABASE_USER=root
      - DATABASE_PASSWORD=${MYSQL_ROOT_PASSWORD}
    env_file:
      - .env
      - .env.local
```

Cette approche garantit la cohérence entre les environnements locaux et de production tout en maintenant les données sensibles séparées des fichiers du projet.

### Gestion des packages PHP

La gestion des dépendances PHP s'effectue via Composer, le gestionnaire de packages standard de l'écosystème PHP. Un service Composer dédié dans Docker automatise l'installation et la mise à jour des dépendances sans nécessiter une installation locale de Composer[1].

```dockerfile
FROM composer:2

RUN adduser -g www-data -s /bin/sh -D symfony

WORKDIR /var/www/html
```

```yaml
composer:
  build:
    context: .
    dockerfile: composer.dockerfile
  volumes:
    - ./src:/var/www/html
  working_dir: /var/www/html
  networks:
    - symfony
```

L'exécution de Composer dans Docker s'effectue via :

```bash
docker compose run --rm --user $(id -u):$(id -g) composer create-project symfony/skeleton:"6.3.*" ./
docker compose run --rm composer install
docker compose run --rm composer require symfony/console
```

## Mise en place des services PHP-FPM et Webpack Encore

### PHP-FPM : Architecture et configuration

PHP-FPM (FastCGI Process Manager) constitue le cœur de l'architecture web moderne avec Docker. Contrairement aux modules PHP Apache, FPM s'exécute comme un service indépendant qui communique avec le serveur web via le protocole FastCGI. Cette séparation offre une flexibilité et une scalabilité supérieures.

La configuration de PHP-FPM s'effectue dans le fichier `/etc/php-fpm.conf` ou via les fichiers de pool dans `/usr/local/etc/php-fpm.d/`. Le pool `www.conf` définit les paramètres cruciaux du processus worker.

```ini
; www.conf
[www]
user = symfony
group = www-data
listen = 0.0.0.0:9000
listen.backlog = -1
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
```

Cette configuration permet à PHP-FPM d'accueillir plusieurs requêtes simultanées avec gestion dynamique du pool de processus workers. Le conteneur expose le port 9000 sur lequel le serveur web se connecte.

### Webpack Encore pour la gestion des assets

Webpack Encore automatise la compilation et l'optimisation des assets (CSS, JavaScript, images). Son intégration dans Docker nécessite un service Node.js dédié qui observe les modifications des fichiers source et recompile automatiquement lors du développement.

```dockerfile
FROM node:18-alpine

WORKDIR /var/www/html

RUN npm install -g npm@latest

COPY ./src/package.json ./src/package-lock.json ./

RUN npm install

COPY ./src .

ENTRYPOINT ["npm", "run"]
CMD ["watch"]
```

```yaml
webpack:
  build:
    context: .
    dockerfile: webpack.dockerfile
  volumes:
    - ./src:/var/www/html
  networks:
    - symfony
  command: npm run watch
```

Le fichier `webpack.config.js` dans le répertoire source configure la compilation des assets :

```javascript
const Encore = require('@symfony/webpack-encore');

Encore
  .setOutputPath('public/build/')
  .setPublicPath('/build')
  .addEntry('app', './assets/app.js')
  .addStyleEntry('styles', './assets/styles/main.scss')
  .splitEntryChunks()
  .enableSingleRuntimeChunk()
  .cleanupOutputBeforeBuild()
  .enableBuildNotifications()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())
  .configureBabel(config => {
    config.plugins.push('@babel/plugin-proposal-class-properties');
  });

module.exports = Encore.getWebpackConfig();
```

La compilation pendant le développement s'effectue avec `npm run watch`, tandis que `npm run build` génère les assets optimisés pour la production.

## Mise en production

### Optimisation des images Docker pour la production

La transition vers la production implique une réflexion stratégique sur les couches Docker et les tailles d'image. L'approche multi-stage permet de conserver une image finale réduite en taille.

```dockerfile
# Stage 1 : Construction
FROM php:8.2-fpm-alpine as builder

RUN apk add --no-cache --virtual .build-deps \
    autoconf \
    g++ \
    make

RUN docker-php-ext-configure intl
RUN docker-php-ext-install -j"$(nproc)" \
    pdo \
    pdo_mysql \
    intl

COPY ./src /app

WORKDIR /app

RUN composer install --no-dev --optimize-autoloader

# Stage 2 : Runtime
FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    mysql-client

RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    intl

COPY --from=builder /app /var/www/html

WORKDIR /var/www/html

CMD ["php-fpm"]
```

Cette technique réduit considérablement la taille finale de l'image en éliminant les dépendances de compilation utilisées uniquement pendant la construction.

### Configuration PHP optimisée pour la production

L'environnement de production nécessite une configuration PHP stricte basée sur des principes de performance et de sécurité[3].

```ini
; production-php.ini
display_errors = Off
log_errors = On
error_log = /var/log/php-errors.log

; OPCache pour le cache des bytecode compilés
opcache.enable=1
opcache.enable_cli=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.revalidate_freq=0

; Sécurité
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off

; Performance
max_execution_time = 30
memory_limit = 256M
upload_max_filesize = 20M
post_max_size = 20M
```

L'activation d'OPCache accélère l'exécution du code PHP en mettant en cache les fichiers bytecode compilés, réduisant ainsi les temps de traitement à chaque requête[3].

### Gestion des migrations et fixtures

Le déploiement en production requiert l'exécution de migrations de base de données et potentiellement le chargement de fixtures initiales. Ces opérations s'effectuent avant le démarrage de l'application.

```dockerfile
FROM php:8.2-fpm-alpine

# ... configuration php ...

COPY ./src /var/www/html

WORKDIR /var/www/html

RUN chmod +x ./bin/console

ENTRYPOINT ["./bin/console"]
CMD ["doctrine:migrations:migrate", "--no-interaction"]
```

```yaml
php:
  build:
    context: .
    dockerfile: php.dockerfile
  depends_on:
    mysql:
      condition: service_healthy
  environment:
    - DATABASE_URL=mysql://root:password@mysql:3306/symfony_db
  networks:
    - symfony

mysql:
  image: mysql:8.0
  environment:
    - MYSQL_ROOT_PASSWORD=password
    - MYSQL_DATABASE=symfony_db
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
    timeout: 5s
    retries: 5
  networks:
    - symfony
```

## Mise en place du service MySQL

### Configuration du conteneur MySQL

MySQL constitue la couche de persistance des données pour la majorité des applications Symfony. Son intégration dans Docker s'effectue simplement via l'utilisation d'une image officielle MySQL pré-configurée.

```yaml
mysql:
  image: mysql:8.0
  container_name: symfony-mysql
  environment:
    MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root_password}
    MYSQL_DATABASE: ${MYSQL_DATABASE:-symfony_db}
    MYSQL_USER: ${MYSQL_USER:-symfony}
    MYSQL_PASSWORD: ${MYSQL_PASSWORD:-symfony_password}
  ports:
    - "${MYSQL_PORT:-3306}:3306"
  volumes:
    - mysql_data:/var/lib/mysql
    - ./docker/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
  restart: unless-stopped
  networks:
    - symfony
  healthcheck:
    test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
    timeout: 5s
    retries: 5
    interval: 10s

volumes:
  mysql_data:
    driver: local
```

Le volume nommé `mysql_data` persiste les données entre les redémarrages du conteneur, garantissant la conservation des informations de la base de données[2].

### Doctrine ORM et configuration de la base de données

Doctrine ORM offre une abstraction élégante pour l'interaction avec la base de données. Sa configuration s'effectue via le fichier `.env` qui spécifie l'URL de connexion :

```env
DATABASE_URL="mysql://symfony:symfony_password@mysql:3306/symfony_db"
```

Les entités Symfony définissent la structure des tables via des annotations ou des attributs PHP :

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: "users")]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(type: "string", length: 255)]
    private string $email;

    #[ORM\Column(type: "string", length: 255)]
    private string $password;

    #[ORM\Column(type: "datetime")]
    private \DateTime $createdAt;

    // Getters et setters...
}
```

La génération et la synchronisation des tables s'effectuent via les commandes Doctrine :

```bash
docker compose exec php bin/console doctrine:database:create
docker compose exec php bin/console doctrine:migrations:diff
docker compose exec php bin/console doctrine:migrations:migrate
```

### Gestion des données de test et fixtures

DoctrineFixturesBundle automatise le chargement de données de test pour l'environnement de développement :

```php
<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < 10; ++$i) {
            $user = new User();
            $user->setEmail("user{$i}@example.com");
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, 'password')
            );
            $user->setCreatedAt(new \DateTime());
            $manager->persist($user);
        }

        $manager->flush();
    }
}
```

L'exécution du chargement de fixtures s'effectue avec :

```bash
docker compose exec php bin/console doctrine:fixtures:load
```

## Mise en place du service Node.js

### Installation et configuration de Node.js

Node.js s'intègre dans l'architecture Docker pour gérer les processus qui requièrent JavaScript côté serveur, particulièrement pour Webpack Encore et les outils de build des assets[1].

```dockerfile
FROM node:18-alpine

WORKDIR /var/www/html

ENV NODE_ENV=development

# Installation des dépendances globales
RUN npm install -g npm@latest yarn

# Copie des fichiers de configuration
COPY ./src/package.json ./src/package-lock.json ./

# Installation des dépendances du projet
RUN npm install

COPY ./src .

EXPOSE 8080

CMD ["npm", "run", "watch"]
```

### Gestion des dépendances npm

Le fichier `package.json` défunit les scripts et dépendances Node.js de l'application :

```json
{
  "name": "symfony-app",
  "version": "1.0.0",
  "private": true,
  "description": "Symfony application with Docker",
  "scripts": {
    "dev": "webpack-dev-server --mode development",
    "watch": "webpack --mode development --watch",
    "build": "webpack --mode production",
    "lint": "eslint assets/js/**/*.js",
    "test": "jest"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "bootstrap": "^5.3.0",
    "jquery": "^3.6.0"
  },
  "devDependencies": {
    "@babel/core": "^7.22.0",
    "@babel/preset-env": "^7.22.0",
    "@symfony/webpack-encore": "^4.4.0",
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.0",
    "sass": "^1.64.0",
    "sass-loader": "^13.3.0",
    "webpack-dev-server": "^4.15.0"
  }
}
```

### Webpack Encore et la compilation des assets

Webpack Encore simplifie la configuration de Webpack en proposant une API fluide adaptée à Symfony[1]. La compilation des assets CSS et JavaScript s'effectue automatiquement en développement et de manière optimisée en production.

```javascript
const Encore = require('@symfony/webpack-encore');
const path = require('path');

if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build');
}

Encore
  .addEntry('app', './assets/app.js')
  .addStyleEntry('app', './assets/styles/app.scss')
  .splitEntryChunks()
  .enableSingleRuntimeChunk()
  .cleanupOutputBeforeBuild()
  .enableBuildNotifications()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())
  .configureBabel(config => {
    config.plugins.push('@babel/plugin-proposal-class-properties');
  })
  .configureDefinePlugin(options => {
    options.__DEV__ = JSON.stringify(!Encore.isProduction());
  });

module.exports = Encore.getWebpackConfig();
```

Le service Node.js du docker-compose observe les modifications et recompile automatiquement :

```yaml
node:
  build:
    context: .
    dockerfile: node.dockerfile
  volumes:
    - ./src:/var/www/html
  command: npm run watch
  networks:
    - symfony
```

## Mise en place du service NGINX

### Configuration fondamentale de NGINX

NGINX remplace avantageusement Apache dans les environnements dockerisés en raison de son architecture légère et haute-performance. Le serveur web reçoit les requêtes HTTP et les transmet à PHP-FPM via FastCGI[2].

```dockerfile
FROM nginx:1.25-alpine

COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
```

### Configuration du virtual host NGINX

Le fichier de configuration NGINX configure le routage des requêtes vers PHP-FPM et la livraison des fichiers statiques :

```nginx
upstream php {
    server php:9000;
}

server {
    listen 80;
    server_name localhost;

    root /var/www/html/public;

    client_max_body_size 20M;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Fichiers statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Assets compilés par Webpack Encore
    location /build/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Fichier robots.txt
    location = /robots.txt {
        access_log off;
    }

    # Fichier favicon
    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }

    # Rewrite toutes les requêtes vers index.php
    location / {
        try_files $uri $uri/ /index.php$is_args$args;
    }

    # Traitement des fichiers PHP
    location ~ ^/index\.php(/|$) {
        fastcgi_pass php;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;

        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_param HTTP_X_FORWARDED_FOR $proxy_add_x_forwarded_for;
        fastcgi_param HTTP_X_FORWARDED_PROTO $scheme;

        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;

        internal;
    }

    # Refus des accès aux fichiers non publics
    location ~ \.php$ {
        return 404;
    }

    # Sécurité : refus des fichiers cache
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

Cette configuration achemine intelligemment le trafic : les assets statiques sont servies directement par NGINX avec mise en cache, tandis que les requêtes dynamiques sont transmises à PHP-FPM.

### Intégration dans docker-compose.yml

Le service NGINX s'intègre dans la composition Docker avec dépendance du service PHP :

```yaml
nginx:
  image: nginx:1.25-alpine
  container_name: symfony-nginx
  build:
    context: .
    dockerfile: docker/nginx/Dockerfile
  ports:
    - "${NGINX_PORT:-80}:80"
    - "${NGINX_SSL_PORT:-443}:443"
  volumes:
    - ./src:/var/www/html:ro
    - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    - ./docker/nginx/ssl:/etc/nginx/ssl:ro
  depends_on:
    - php
  restart: unless-stopped
  networks:
    - symfony
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
    timeout: 5s
    retries: 5
    interval: 10s
```

### HTTPS et certificats SSL

La configuration HTTPS pour la production requiert des certificats SSL valides :

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Configuration identique au server 80
    root /var/www/html/public;
    
    # ... reste de la configuration ...
}
```

## Orchestration complète avec docker-compose.yml

### Structure complète d'une application Symfony

L'orchestration de tous les services s'effectue via un fichier `docker-compose.yml` centralisé qui définit les interdépendances et les configurations communes :

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: symfony-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-symfony_db}
      MYSQL_USER: ${MYSQL_USER:-symfony}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-symfony}
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - symfony
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 5s
      retries: 5
      interval: 10s

  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    container_name: symfony-php
    environment:
      APP_ENV: ${APP_ENV:-dev}
      APP_DEBUG: ${APP_DEBUG:-1}
      DATABASE_URL: mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@mysql:3306/${MYSQL_DATABASE}
    volumes:
      - ./src:/var/www/html
      - ./docker/php/conf.d:/usr/local/etc/php/conf.d:ro
    depends_on:
      mysql:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - symfony
    user: "1000:1000"

  nginx:
    build:
      context: .
      dockerfile: docker/nginx/Dockerfile
    container_name: symfony-nginx
    ports:
      - "${NGINX_PORT:-80}:80"
    volumes:
      - ./src:/var/www/html:ro
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - php
    restart: unless-stopped
    networks:
      - symfony
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      timeout: 5s
      retries: 5

  composer:
    build:
      context: .
      dockerfile: docker/composer/Dockerfile
    container_name: symfony-composer
    volumes:
      - ./src:/var/www/html
    working_dir: /var/www/html
    networks:
      - symfony
    user: "${UID:-1000}:${GID:-1000}"
    profiles:
      - tools

  node:
    build:
      context: .
      dockerfile: docker/node/Dockerfile
    container_name: symfony-node
    volumes:
      - ./src:/var/www/html
    working_dir: /var/www/html
    command: npm run watch
    networks:
      - symfony
    profiles:
      - tools

volumes:
  mysql_data:
    driver: local

networks:
  symfony:
    driver: bridge
```

### Fichier .env pour la configuration locale

Le fichier `.env` spécifie les valeurs par défaut pour l'environnement de développement :

```env
# Application
APP_ENV=dev
APP_DEBUG=1
SYMFONY_ENV=dev

# Database
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=symfony_db
MYSQL_USER=symfony
MYSQL_PASSWORD=symfony
MYSQL_PORT=3306

# Nginx
NGINX_PORT=80

# Identifiants
UID=1000
GID=1000
```

## Démarrage et gestion de l'environnement

### Commandes essentielles

Le lancement initial de tous les conteneurs nécessite la construction des images puis le démarrage orchestré :

```bash
# Construction des images et démarrage
docker compose up --build

# Démarrage en arrière-plan
docker compose up -d

# Affichage des logs
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f php

# Exécution de commandes dans un conteneur
docker compose exec php bin/console cache:clear
docker compose exec php bin/console doctrine:database:create
docker compose exec php bin/console doctrine:migrations:migrate

# Arrêt des conteneurs
docker compose down

# Arrêt et suppression des volumes
docker compose down -v
```

### Initialisation d'une nouvelle application Symfony

La création d'une application Symfony vierge s'effectue via Docker :

```bash
mkdir symfony-app && cd symfony-app

# Initialisation des répertoires
mkdir src docker/php docker/nginx docker/node docker/composer

# Création des Dockerfiles (comme indiqué précédemment)

# Création du docker-compose.yml

# Création de l'application Symfony
docker compose run --rm --user $(id -u):$(id -g) composer create-project symfony/skeleton:"6.3.*" ./

# Installation des dépendances supplémentaires
docker compose exec composer require symfony/orm-pack
docker compose exec composer require symfony/asset
docker compose exec composer require symfony/console

# Initialisation npm
docker compose exec node npm init -y

# Démarrage des services
docker compose up -d
```

### Workflow de développement

Le cycle de développement avec Docker fonctionne de manière itérative :

1. Modification du code source dans le répertoire local
2. Les volumes synchronisent automatiquement les modifications dans les conteneurs
3. Symfony rechargement automatique détecte les modifications et met à jour le cache
4. Webpack Encore recompile les assets automatiquement en mode watch
5. Les requêtes HTTP sont servies immédiatement par NGINX et PHP-FPM

### Commandes utiles pour le développement

```bash
# Accès au shell PHP pour exécuter des commandes Symfony
docker compose exec php bash

# Exécution de tests unitaires
docker compose exec php vendor/bin/phpunit

# Analyse du code avec PHP_CodeSniffer
docker compose exec php vendor/bin/phpcs src/

# Formatage du code automatique
docker compose exec php vendor/bin/phpcbf src/

# Inspection de la base de données
docker compose exec mysql mysql -u symfony -p symfony_db

# Génération de migrations
docker compose exec php bin/console doctrine:migrations:diff

# Consultation des variables d'environnement
docker compose exec php printenv

# Inspection des volumes
docker volume ls
docker volume inspect symfony_mysql_data
```

## Considérations avancées

### Optimisation des performances

L'utilisation de `.dockerignore` réduit le contexte de build et accélère la construction des images :

```
.git
.gitignore
.docker
vendor
node_modules
.env.local
.symfony.local
public/uploads
var/cache
var/log
```

### Debugging avec Xdebug

L'intégration de Xdebug dans l'environnement de développement facilite le débogage :

```dockerfile
RUN pecl install xdebug && docker-php-ext-enable xdebug

COPY docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini
```

```ini
; xdebug.ini
xdebug.mode=develop,debug
xdebug.client_host=host.docker.internal
xdebug.client_port=9003
xdebug.start_with_request=yes
```

### Monitoring et logs

La centralisation des logs offre une visibilité sur l'ensemble de l'infrastructure :

```yaml
services:
  php:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Stratégies de backup et restauration

La persistance des données requiert une stratégie de backup régulière :

```bash
# Backup de la base de données
docker compose exec mysql mysqldump -u root -p symfony_db > backup.sql

# Restauration de la base de données
docker compose exec -T mysql mysql -u root -p symfony_db < backup.sql

# Backup des volumes
docker run --rm -v symfony_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz -C /data .
```

Cette architecture complète fournit une base robuste et scalable pour développer, tester et déployer des applications Symfony avec Docker, tout en maintenant la cohérence entre les environnements de développement et de production.
