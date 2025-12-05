# Citations
- https://www.youtube.com/watch?v=EqgXJptKRAs
- https://blog.stephane-robert.info/docs/conteneurs/orchestrateurs/docker-compose/
- https://senza-formations.com/nos-articles/tutoriel-docker-compose-orchestrer-plusieurs-conteneurs-facilement
- https://learn.microsoft.com/fr-fr/dotnet/architecture/microservices/multi-container-microservice-net-applications/multi-container-applications-docker-compose
- https://www.datacamp.com/fr/tutorial/docker-compose-guide
- https://documentation.suse.com/fr-fr/sle-micro/6.0/html/Micro-compose/index.html
- https://www.ionos.fr/digitalguide/serveur/configuration/tutoriel-docker-compose/
- https://labex.io/fr/tutorials/docker-how-to-use-docker-compose-for-multi-container-deployments-411622
- https://xavki.blog/docker-compose-tutoriaux-francais/


# Tokens
- prompt_tokens: 314
- completion_tokens: 7666
- total_tokens: 7980
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.115, 'request_cost': 0.006, 'total_cost': 0.122}


# Content
# Docker Compose avec plusieurs services 🐳

## Introduction à Docker Compose

Docker Compose est un outil fondamental pour orchestrer des applications multi-conteneurs. Plutôt que de gérer manuellement plusieurs conteneurs Docker avec des commandes individuelles, Docker Compose permet de **définir l'intégralité de l'application dans un fichier de configuration unique**[2][3]. Cet outil simplifie considérablement le workflow de développement et de déploiement en éliminant les erreurs manuelles et en augmentant la productivité[5].

L'avantage principal de Docker Compose réside dans sa capacité à **démarrer et gérer plusieurs conteneurs en une seule commande**[3], tout en gérant automatiquement les réseaux, les volumes et les dépendances entre services[5].

## Architecture générale d'un projet Docker Compose

Un projet Docker Compose repose sur la **coordination de plusieurs services** qui communiquent entre eux[1]. L'architecture type d'une application multi-conteneurs comprend :

- **Service frontal** : généralement un serveur web (Nginx) qui expose l'application
- **Service API** : une application backend (Node.js, Python, etc.)
- **Service base de données** : une instance de données persistantes (PostgreSQL, MySQL, Redis)
- **Services complémentaires** : cache, monitoring, reverse proxy

Docker Compose crée automatiquement un **réseau par défaut** permettant à tous les services de communiquer entre eux[2], tout en gérant les volumes et assurant leur rattachement automatique en cas de remplacement ou de redémarrage du service[5].

## Structure fondamentale du fichier docker-compose.yml

Le fichier `docker-compose.yml` constitue le **cœur de la configuration Docker Compose**[2][3]. Ce fichier YAML décrit l'intégralité de la composition des services, des réseaux et des volumes[4].

### Sections principales du fichier

Un fichier `docker-compose.yml` se compose de trois sections clés[3] :

**Services** : Représentent les conteneurs à déployer. Chaque service possède un nom unique et contient des instructions sur l'image Docker, les ports à exposer et les dépendances[3].

**Réseaux** : Permettent aux services de communiquer entre eux. Par défaut, Docker Compose crée un réseau, mais il est possible de définir des réseaux personnalisés pour un contrôle plus précis[2][3].

**Volumes** : Gèrent la persistance des données en attachant des espaces de stockage aux conteneurs[3].

### Exemple de structure basique

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    depends_on:
      - app
    networks:
      - frontend

  app:
    image: node:16
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    networks:
      - frontend
      - backend

  db:
    image: postgres:latest
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - backend

networks:
  frontend:
  backend:

volumes:
  db_data:
```

Cette structure illustre la séparation des services, la gestion des ports, les variables d'environnement et la connectivité réseau.

## Mise en place de la configuration client

La configuration client dans une architecture Docker Compose correspond généralement à l'interface utilisateur servie par un serveur web. Cette couche frontal est responsable de la présentation et de l'interaction avec l'utilisateur.

### Rôle du service client

Le service client utilise généralement un serveur web comme **Nginx** pour servir le contenu statique (HTML, CSS, JavaScript) et effectuer le reverse proxy vers les services backend[3]. Cette approche offre plusieurs avantages :

- **Séparation des responsabilités** : le client reste isolé des logiques métier
- **Performance** : Nginx peut cacher et servir les assets statiques efficacement
- **Sécurité** : le reverse proxy agit comme tampon entre Internet et les services internes

### Configuration du service Nginx client

```yaml
services:
  client:
    image: nginx:alpine
    container_name: frontend-client
    ports:
      - "3000:80"
    volumes:
      - ./client/dist:/usr/share/nginx/html:ro
      - ./nginx/client.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - api
    networks:
      - frontend
```

Cette configuration expose le service client sur le port 3000, monte les fichiers statiques depuis le répertoire `client/dist` et utilise une configuration Nginx personnalisée.

### Variables d'environnement client

```yaml
services:
  client:
    image: node:16-alpine
    build:
      context: ./client
      dockerfile: Dockerfile
    environment:
      - REACT_APP_API_URL=http://api:3001
      - REACT_APP_ENV=production
    ports:
      - "3000:3000"
    networks:
      - frontend
```

Les variables d'environnement permettent au client de **pointer vers les services backend** sans modification du code source.

## Mise en place de l'API Node.js

L'API Node.js constitue le **cœur métier de l'application**, exposant les endpoints pour les opérations CRUD et la logique applicative. Cette couche assure la communication entre le client et la base de données.

### Service API Node.js

```yaml
services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: nodejs-api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/appdb
      - REDIS_URL=redis://cache:6379
      - LOG_LEVEL=info
      - API_PORT=3001
    depends_on:
      - db
      - cache
    volumes:
      - ./api/src:/app/src
      - /app/node_modules
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Dockerfile pour Node.js

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Structure du projet Node.js

Le service Node.js nécessite une organisation spécifique :

```
api/
├── src/
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── Dockerfile
├── package.json
└── .env
```

### Variables d'environnement critique

| Variable | Description | Exemple |
|----------|-------------|---------|
| NODE_ENV | Environnement d'exécution | production |
| DATABASE_URL | String de connexion PostgreSQL | postgresql://user:pass@db:5432/db |
| REDIS_URL | Connexion au cache Redis | redis://cache:6379 |
| API_PORT | Port d'écoute de l'API | 3001 |
| LOG_LEVEL | Niveau de verbosité des logs | info |

### Exemple de service API minimal

```javascript
// src/index.js
const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
const PORT = process.env.API_PORT || 3001;

// Connexion PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Connexion Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
```

## Introduction à l'architecture du projet

L'architecture d'un projet Docker Compose multi-services suit un modèle en couches où chaque service assume une responsabilité spécifique et communique avec les autres via le réseau Docker[1].

### Modèle architectural recommandé

L'architecture recommandée suit un pattern de **séparation en trois couches** :

**Couche présentation (Frontend)** : Servie par Nginx, responsable de l'interface utilisateur et du rendu côté client.

**Couche application (API)** : Implémentée avec Node.js, contenant la logique métier et les endpoints REST.

**Couche données (Database)** : Gérée par PostgreSQL, stockant les données persistantes de l'application.

### Schéma de communication

```
┌─────────────┐
│   Client    │ (Port 3000)
│  (Nginx)    │
└──────┬──────┘
       │ HTTP (port 3001)
       ↓
┌─────────────┐
│   API       │ (Port 3001)
│  (Node.js)  │
└──────┬──────┘
       │ TCP (port 5432)
       ↓
┌─────────────┐
│  Database   │ (Port 5432)
│ (PostgreSQL)│
└─────────────┘
```

### Configuration complète multi-services

```yaml
version: '3.8'

services:
  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: app-client
    ports:
      - "3000:3000"
    depends_on:
      - api
    networks:
      - frontend
    restart: always

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: app-api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://appuser:apppass@db:5432/appdb
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
    networks:
      - backend
      - frontend
    restart: always

  db:
    image: postgres:14-alpine
    container_name: app-db
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppass
      POSTGRES_DB: appdb
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
      - db_volume:/var/lib/postgresql/data
    networks:
      - backend
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge

volumes:
  db_volume:
```

### Avantages de cette architecture

- **Isolation réseau** : les services sont séparés sur des réseaux distincts selon leur fonction
- **Scalabilité** : chaque service peut être modifié indépendamment
- **Maintenabilité** : la séparation des responsabilités facilite les mises à jour
- **Résilience** : les services incluent des vérifications de santé

## Mise en place du reverse proxy nginx

Le reverse proxy Nginx occupe une position cruciale dans l'architecture en agissant comme **point d'entrée unique** de l'application et en distribuant le trafic vers les services appropriés[3].

### Rôle du reverse proxy

Le reverse proxy assume plusieurs fonctions critiques :

- **Routage du trafic** : dirige les requêtes vers le service approprié basé sur le chemin URL
- **Équilibrage de charge** : distribue les requêtes entre plusieurs instances si nécessaire
- **Cache** : stocke les réponses fréquentes pour réduire la latence
- **Compression** : compresse les réponses pour économiser la bande passante
- **HTTPS/TLS** : gère le chiffrement des connexions entrantes
- **Authentification** : peut valider les requêtes avant leur transmission

### Service Nginx reverse proxy

```yaml
services:
  nginx:
    image: nginx:alpine
    container_name: app-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - nginx_cache:/var/cache/nginx
    depends_on:
      - api
      - client
    networks:
      - frontend
    restart: always
```

### Configuration Nginx complète

```nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Cache configuration
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m 
                     max_size=100m inactive=60m use_temp_path=off;

    upstream api_backend {
        least_conn;
        server api:3001 max_fails=3 fail_timeout=30s;
    }

    upstream client_frontend {
        server client:3000;
    }

    server {
        listen 80;
        server_name _;

        # Redirection HTTP vers HTTPS
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name example.com www.example.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # API routing
        location /api/ {
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_cache api_cache;
            proxy_cache_valid 200 60m;
            proxy_cache_key "$scheme$request_method$host$request_uri";
        }

        # Frontend routing
        location / {
            proxy_pass http://client_frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }

    include /etc/nginx/conf.d/*.conf;
}
```

### Configuration par domaine

```nginx
# conf.d/api.conf
upstream api_servers {
    server api:3001;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://api_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Vérification de santé Nginx

```yaml
services:
  nginx:
    image: nginx:alpine
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Fin de la mise en place de l'environnement de production

La finition de l'environnement de production implique la **configuration complète de tous les services** et la mise en place des mécanismes de surveillance, de récupération automatique et de persistance des données.

### Configuration de production complète

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - nginx_cache:/var/cache/nginx
    depends_on:
      - api
      - client
    networks:
      - frontend
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  client:
    build:
      context: ./client
      dockerfile: Dockerfile.prod
    container_name: client-app
    environment:
      - REACT_APP_API_URL=/api
      - NODE_ENV=production
    depends_on:
      - api
    networks:
      - frontend
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: nodejs-api
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://produser:securepass@db:5432/proddb
      - REDIS_URL=redis://cache:6379
      - LOG_LEVEL=info
      - API_PORT=3001
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy
    networks:
      - backend
      - frontend
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  db:
    image: postgres:14-alpine
    container_name: postgres-db
    environment:
      - POSTGRES_USER=produser
      - POSTGRES_PASSWORD=securepass
      - POSTGRES_DB=proddb
      - POSTGRES_INITDB_ARGS=-c max_connections=100
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      - db_volume:/var/lib/postgresql/data
    networks:
      - backend
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U produser"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  cache:
    image: redis:7-alpine
    container_name: redis-cache
    command: redis-server --appendonly yes --requirepass redispass
    volumes:
      - redis_volume:/data
    networks:
      - backend
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge

volumes:
  db_volume:
  redis_volume:
  nginx_cache:
```

### Variables d'environnement de production

```env
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://produser:securepass@db:5432/proddb
REDIS_URL=redis://:redispass@cache:6379
API_PORT=3001
LOG_LEVEL=info
API_WORKERS=4
```

### Commandes de gestion Docker Compose

Pour **démarrer l'environnement complet** en arrière-plan[3] :

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Pour **arrêter les services** :

```bash
docker-compose down
```

Pour **afficher les logs** de tous les services :

```bash
docker-compose logs -f
```

Pour **afficher l'état des services**[3] :

```bash
docker-compose ps
```

Pour **redémarrer un service spécifique** :

```bash
docker-compose restart api
```

### Stratégies de sauvegarde

```yaml
services:
  backup:
    image: alpine:latest
    container_name: backup-service
    volumes:
      - db_volume:/backup/db
      - redis_volume:/backup/redis
      - ./backups:/backups
    command: |
      sh -c 'while true; do
        tar -czf /backups/db-$(date +\%Y\%m\%d-\%H\%M\%S).tar.gz /backup/db
        tar -czf /backups/redis-$(date +\%Y\%m\%d-\%H\%M\%S).tar.gz /backup/redis
        find /backups -name "*.tar.gz" -mtime +7 -delete
        sleep 86400
      done'
    networks:
      - backend
    restart: always
```

## Mise en place du service pour la base de données

La base de données constitue l'**élément fondamental de persistance** pour l'application. PostgreSQL est le choix privilégié pour les applications d'entreprise en raison de ses capacités ACID, de sa scalabilité et de son support avancé des types de données.

### Service PostgreSQL

```yaml
services:
  db:
    image: postgres:14-alpine
    container_name: postgres-database
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppassword
      POSTGRES_DB: applicationdb
      POSTGRES_INITDB_ARGS: "-c shared_buffers=256MB -c max_connections=200"
    ports:
      - "5432:5432"
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      - ./db/migrations:/migrations:ro
      - db_data:/var/lib/postgresql/data
    networks:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d applicationdb"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  db_data:
    driver: local
```

### Initialisation de la base de données

```sql
-- db/init.sql

-- Création des schémas
CREATE SCHEMA IF NOT EXISTS public;

-- Création des tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
);

-- Création des index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);

-- Insertion des données de base
INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@example.com', '$2b$10$...'),
('user1', 'user1@example.com', '$2b$10$...');

INSERT INTO products (name, description, price, stock_quantity) VALUES
('Produit 1', 'Description du produit 1', 29.99, 100),
('Produit 2', 'Description du produit 2', 49.99, 50);
```

### Configuration avancée PostgreSQL

```yaml
services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: securepassword
      POSTGRES_DB: applicationdb
      POSTGRES_INITDB_ARGS: |
        -c max_connections=200
        -c shared_buffers=512MB
        -c effective_cache_size=1GB
        -c maintenance_work_mem=128MB
        -c checkpoint_completion_target=0.9
        -c wal_buffers=16MB
        -c default_statistics_target=100
    volumes:
      - ./db/postgresql.conf:/etc/postgresql/postgresql.conf:ro
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
      - db_data:/var/lib/postgresql/data
      - db_backups:/backups
    command:
      - "postgres"
      - "-c"
      - "config_file=/etc/postgresql/postgresql.conf"
    networks:
      - backend
    restart: always
```

### Gestion des migrations

```javascript
// api/src/migrations/migrate.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'sql');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (file.endsWith('.sql')) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      try {
        await pool.query(sql);
        console.log(`✓ Migration executée: ${file}`);
      } catch (error) {
        console.error(`✗ Erreur migration ${file}:`, error.message);
        throw error;
      }
    }
  }

  await pool.end();
}

runMigrations().catch(console.error);
```

### Stratégies de sauvegarde PostgreSQL

```yaml
services:
  db-backup:
    image: postgres:14-alpine
    container_name: postgres-backup
    environment:
      PGPASSWORD: apppassword
    volumes:
      - ./backups:/backups
      - ./backup-script.sh:/backup-script.sh:ro
    command: /bin/sh /backup-script.sh
    depends_on:
      - db
    networks:
      - backend
    restart: always
```

```bash
#!/bin/bash
# backup-script.sh

BACKUP_DIR="/backups"
DB_USER="appuser"
DB_HOST="db"
DB_NAME="applicationdb"
RETENTION_DAYS=7

while true; do
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"
  
  pg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" | \
  gzip > "$BACKUP_FILE"
  
  if [ $? -eq 0 ]; then
    echo "[$(date)] ✓ Sauvegarde créée: $BACKUP_FILE"
  else
    echo "[$(date)] ✗ Erreur lors de la sauvegarde"
  fi
  
  # Suppression des anciennes sauvegardes
  find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
  
  # Attendre 24 heures avant la prochaine sauvegarde
  sleep 86400
done
```

### Exemple de requête Node.js vers PostgreSQL

```javascript
// api/src/db/userRepository.js
const { Pool } = require('pg');

class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async findAll() {
    const query = 'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(username, email, passwordHash) {
    const query = `
      INSERT INTO users (username, email, password_hash) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email, created_at
    `;
    const result = await this.pool.query(query, [username, email, passwordHash]);
    return result.rows[0];
  }

  async update(id, username, email) {
    const query = `
      UPDATE users 
      SET username = $2, email = $3, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING id, username, email, updated_at
    `;
    const result = await this.pool.query(query, [id, username, email]);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0;
  }
}

module.exports = UserRepository;
```

### Configuration de sécurité PostgreSQL

```sql
-- db/security.sql

-- Création d'un rôle d'application restreint
CREATE ROLE app_user WITH LOGIN PASSWORD 'securepassword';

-- Accès limité aux tables
GRANT CONNECT ON DATABASE applicationdb TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Audit des modifications
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100),
    operation VARCHAR(10),
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour l'audit
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (table_name, operation, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, TG_OP, to_jsonb(OLD), to_jsonb(NEW), current_user);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Commandes essentielles Docker Compose

Les **commandes fondamentales** pour gérer l'application multi-conteneurs sont[3] :

```bash
# Démarrer les services en arrière-plan
docker-compose up -d

# Arrêter et supprimer les conteneurs
docker-compose down

# Afficher les logs de tous les services
docker-compose logs -f

# Afficher les logs d'un service spécifique
docker-compose logs -f api

# Afficher l'état des services
docker-compose ps

# Redémarrer les services
docker-compose restart

# Reconstruire les images
docker-compose build

# Reconstruire et redémarrer un service
docker-compose up -d --build api

# Exécuter une commande dans un conteneur
docker-compose exec api npm test

# Afficher la configuration fusionnée
docker-compose config

# Valider la syntaxe du fichier
docker-compose config --quiet
```

## Bonnes pratiques pour Docker Compose

L'adoption de **bonnes pratiques** assure la qualité, la maintenabilité et la sécurité des applications multi-conteneurs[3] :

- **Utiliser des versions d'image spécifiques** : Éviter `latest` et préférer des tags de version stables comme `postgres:14-alpine`
- **Séparer les configurations** : Utiliser `.env` pour les variables sensibles plutôt que de les coder en dur
- **Organiser les services** : Grouper les services par fonction dans des réseaux séparés
- **Implémenter les vérifications de santé** : Permettre aux conteneurs de signaler leur état de fonctionnement
- **Gérer les volumes** : Définir explicitement les volumes pour la persistance des données critiques
- **Documenter la configuration** : Ajouter des commentaires explicitant les choix architecturaux
- **Utiliser des images légères** : Privilégier les images alpine pour réduire la taille et les surface d'attaque
- **Implémenter la gestion des logs** : Configurer le driver de log approprié avec rotation des fichiers

Cette approche systématique garantit une base solide pour la gestion des applications multi-conteneurs en environnement de production.
