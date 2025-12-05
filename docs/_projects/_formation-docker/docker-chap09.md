# Citations
- https://learn.microsoft.com/en-us/visualstudio/containers/tutorial-multicontainer?view=visualstudio
- https://docs.docker.com/compose/gettingstarted/
- https://www.freecodecamp.org/news/a-beginners-guide-to-docker-how-to-create-a-client-server-side-with-docker-compose-12c8cf0ae0aa/
- https://spacelift.io/blog/docker-compose
- https://docs.docker.com/get-started/workshop/02_our_app/
- https://faq.teipublisher.com/hosting/docker-compose/
- https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/
- https://docker-curriculum.com


# Tokens
- prompt_tokens: 290
- completion_tokens: 5958
- total_tokens: 6248
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.089, 'request_cost': 0.006, 'total_cost': 0.096}


# Content
# Dockerfile et Docker Compose pour une Application Client 🐳

## Introduction

Docker représente une révolution dans le domaine de la conteneurisation et du déploiement d'applications. Pour les développeurs travaillant sur des applications client-serveur, maîtriser Dockerfile et Docker Compose devient essentiel afin de garantir une cohérence entre les environnements de développement et de production. Ce guide détaillé explore les concepts fondamentaux et les pratiques avancées nécessaires pour construire une architecture applicative robuste et scalable.

## Mise en Place du Projet d'Application Cliente 📁

### Architecture Générale du Projet

La structure initiale d'un projet utilisant Docker Compose pour une application client-serveur doit suivre une organisation logique et maintenable. Un projet type comporte plusieurs répertoires distincts, chacun responsable d'une partie spécifique de l'application[3].

```
├── client/
│   ├── Dockerfile
│   ├── src/
│   │   ├── index.js
│   │   ├── package.json
│   │   └── public/
│   └── .dockerignore
├── server/
│   ├── Dockerfile
│   ├── src/
│   │   ├── app.js
│   │   ├── package.json
│   │   └── config/
│   └── .dockerignore
├── docker-compose.yml
├── .env
└── README.md
```

### Initialisation des Services

Chaque service (client et serveur) commence par une initialisation appropriée. Pour une application Node.js côté serveur avec Redis en tant que cache, l'initialisation implique la création des fichiers de configuration de base[4].

**Fichier `server/package.json`:**

```json
{
  "name": "server-app",
  "version": "1.0.0",
  "description": "Application serveur avec Redis",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "redis": "^4.6.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

**Fichier `server/src/app.js`:**

```javascript
const express = require("express");
const { createClient: createRedisClient } = require("redis");

(async function () {
  const app = express();
  const redisClient = createRedisClient({
    url: `redis://redis:6379`
  });

  await redisClient.connect();

  app.get("/api/data", async (request, response) => {
    try {
      const cachedData = await redisClient.get("appData");
      if (cachedData) {
        return response.json({ data: cachedData, source: "cache" });
      }
      
      const freshData = "Données fraîches du serveur";
      await redisClient.setEx("appData", 3600, freshData);
      response.json({ data: freshData, source: "server" });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });

  app.listen(8080, () => {
    console.log("Serveur démarré sur le port 8080");
  });
})();
```

### Configuration de l'Application Client

L'application client doit être capable de communiquer avec le serveur via les noms de services définis dans Docker Compose. L'utilisation de variables d'environnement facilite la portabilité entre environnements.

**Fichier `client/package.json`:**

```json
{
  "name": "client-app",
  "version": "1.0.0",
  "description": "Application cliente",
  "main": "index.js",
  "scripts": {
    "start": "http-server -p 3000 -c-1",
    "dev": "http-server -p 3000 -c-1 --watch"
  },
  "dependencies": {
    "http-server": "^14.1.1"
  }
}
```

**Fichier `client/src/index.html`:**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Client</title>
  <style>
    body { font-family: Arial; max-width: 600px; margin: 50px auto; }
    button { padding: 10px 20px; font-size: 16px; cursor: pointer; }
    #result { margin-top: 20px; padding: 10px; background: #f0f0f0; }
  </style>
</head>
<body>
  <h1>Application Client-Serveur</h1>
  <button onclick="fetchData()">Récupérer les données</button>
  <div id="result"></div>
  
  <script>
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8080/api/data');
        const data = await response.json();
        document.getElementById('result').innerHTML = 
          `<p>Données: ${data.data}</p><p>Source: ${data.source}</p>`;
      } catch (error) {
        document.getElementById('result').innerHTML = 
          `<p style="color: red;">Erreur: ${error.message}</p>`;
      }
    }
  </script>
</body>
</html>
```

## Mise en Place de l'Environnement de Production ⚙️

### Création des Fichiers Dockerfile

Les Dockerfiles pour la production doivent suivre les bonnes pratiques de sécurité et d'optimisation. Chaque couche doit être soigneusement planifiée pour minimiser la taille de l'image[1].

**Fichier `server/Dockerfile` (Production):**

```dockerfile
# Étape 1: Construction
FROM node:18-alpine AS builder

WORKDIR /app
COPY server/package*.json ./
RUN npm ci

COPY server/src ./src

# Étape 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Installation des dépendances de production uniquement
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY server/package*.json ./

# Changement de propriétaire des fichiers
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8080

# Healthcheck pour Docker Compose
HEALTHCHECK --interval=20s --timeout=20s --retries=5 \
  CMD node -e "require('http').get('http://localhost:8080/api/data', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "src/app.js"]
```

**Fichier `client/Dockerfile` (Production):**

```dockerfile
# Étape 1: Construction
FROM node:18-alpine AS builder

WORKDIR /app
COPY client/package*.json ./
RUN npm ci

# Étape 2: Runtime avec serveur HTTP léger
FROM node:18-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder /app/node_modules ./node_modules
COPY client/package*.json ./
COPY client/src ./src

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

CMD ["npm", "start"]
```

### Optimisation des Images Docker

Les images Docker en production doivent être légères et sécurisées. L'utilisation de builds multi-étapes réduit significativement la taille finale des images en éliminant les dépendances de développement.

| Aspect | Avantage | Implémentation |
|--------|----------|-----------------|
| **Multi-stage builds** | Réduit la taille de 70-80% | Sépare les étapes de compilation et runtime |
| **Alpine Linux** | Image de base très légère (5MB) | Utilisation de `node:18-alpine` |
| **.dockerignore** | Exclut les fichiers inutiles | Fichiers `node_modules`, `.git`, logs |
| **Utilisateur non-root** | Améliore la sécurité | Création d'un utilisateur dédié |
| **Healthchecks** | Monitoring automatique | Vérifie l'accessibilité des services |

**Fichier `.dockerignore` (à la racine):**

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
dist
build
coverage
.nyc_output
.DS_Store
*.log
```

### Gestion des Variables d'Environnement

L'utilisation de fichiers `.env` permet une configuration flexible selon l'environnement.

**Fichier `.env`:**

```env
# Environnement
NODE_ENV=production

# Serveur
SERVER_PORT=8080
SERVER_HOST=0.0.0.0

# Client
CLIENT_PORT=3000
CLIENT_HOST=0.0.0.0

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Registry Docker (optionnel)
DOCKER_REGISTRY=myregistry.azurecr.io/
```

## Mise en Place de Docker Compose 🔗

### Configuration du Fichier docker-compose.yml

Docker Compose centralise la configuration de tous les services dans un seul fichier YAML, simplifiant la gestion des dépendances et de la communication inter-conteneurs[2][4].

**Fichier `docker-compose.yml`:**

```yaml
version: '3.9'

services:
  # Service Redis pour le cache
  redis:
    image: redis:7-alpine
    container_name: app-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network
    restart: unless-stopped

  # Service Serveur
  server:
    build:
      context: .
      dockerfile: server/Dockerfile
    container_name: app-server
    environment:
      - NODE_ENV=production
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - SERVER_PORT=8080
    ports:
      - "8080:8080"
    depends_on:
      redis:
        condition: service_healthy
    volumes:
      - ./server/src:/app/src
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:8080/api/data', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"]
      interval: 20s
      timeout: 10s
      retries: 5

  # Service Client
  client:
    build:
      context: .
      dockerfile: client/Dockerfile
    container_name: app-client
    environment:
      - NODE_ENV=production
      - CLIENT_PORT=3000
    ports:
      - "3000:3000"
    depends_on:
      server:
        condition: service_healthy
    volumes:
      - ./client/src:/app/src
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  redis_data:
    driver: local

networks:
  app-network:
    driver: bridge
```

### Comprendre la Structure Docker Compose

**Services:** Chaque service représente un conteneur indépendant avec ses propres ressources et configuration[4].

**Volumes:** Permettent la persistance des données et le partage de fichiers entre l'hôte et les conteneurs. Deux types existent:
- Volumes nommés: Gérés par Docker (`redis_data`)
- Volumes liés: Points de montage du système de fichiers hôte (`./server/src:/app/src`)

**Networks:** Créent un réseau privé permettant la communication par noms de services. Les conteneurs peuvent se joindre via `http://service-name:port`[1].

**Conditions de Dépendance:** Définissent l'ordre de démarrage des services. La condition `service_healthy` vérifie les healthchecks avant de démarrer les dépendants.

### Commandes Docker Compose Essentielles

```bash
# Démarrer les services
docker compose up

# Démarrer en arrière-plan
docker compose up -d

# Arrêter les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Visualiser les logs
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f server

# Reconstruire les images
docker compose build

# Reconstruire et redémarrer
docker compose up -d --build

# Exécuter une commande dans un conteneur
docker compose exec server npm run dev

# Voir l'état des services
docker compose ps

# Nettoyer les ressources non utilisées
docker compose down --remove-orphans
```

## Lancer les Tests Pendant le Développement 🧪

### Configuration du Développement

Le développement local nécessite une configuration différente de la production, avec des outils de monitoring et de reload automatique.

**Fichier `docker-compose.dev.yml` (Override):**

```yaml
version: '3.9'

services:
  server:
    environment:
      - NODE_ENV=development
    volumes:
      - ./server/src:/app/src
      - server_node_modules:/app/node_modules
    command: npm run dev
    ports:
      - "9229:9229"  # Port de débogage Node.js

  client:
    environment:
      - NODE_ENV=development
    volumes:
      - ./client/src:/app/src
      - client_node_modules:/app/node_modules
    command: npm run dev

  # Service de test optionnel
  tests:
    build:
      context: .
      dockerfile: Dockerfile.test
    depends_on:
      - server
      - redis
    volumes:
      - ./tests:/app/tests
      - ./coverage:/app/coverage
    networks:
      - app-network
    environment:
      - CI=true

volumes:
  server_node_modules:
  client_node_modules:
```

### Fichier de Tests

**Fichier `Dockerfile.test`:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm ci --only=dev && npm install jest supertest

COPY server/src ./src
COPY tests ./tests

CMD ["npm", "test"]
```

### Suite de Tests

**Fichier `tests/server.test.js`:**

```javascript
const request = require('supertest');
const http = require('http');

describe('API Server Tests', () => {
  let app;
  const baseURL = 'http://server:8080';

  test('GET /api/data devrait retourner les données', async () => {
    const response = await request('http://server:8080')
      .get('/api/data')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('source');
    expect(['cache', 'server']).toContain(response.body.source);
  });

  test('Multiple requests devraient utiliser le cache', async () => {
    // Premier appel
    const response1 = await request('http://server:8080')
      .get('/api/data')
      .expect(200);

    // Deuxième appel rapide
    const response2 = await request('http://server:8080')
      .get('/api/data')
      .expect(200);

    expect(response2.body.source).toBe('cache');
  });

  test('Connexion au serveur devrait réussir', async () => {
    const response = await request('http://server:8080')
      .get('/api/data')
      .timeout(5000);

    expect(response.status).not.toBe(0);
  });
});
```

### Commandes de Test

```bash
# Lancer les tests avec composition override
docker compose -f docker-compose.yml -f docker-compose.dev.yml up tests

# Lancer les tests une seule fois
docker compose run --rm tests npm test

# Lancer les tests avec couverture
docker compose run --rm tests npm run test:coverage

# Lancer les tests en mode watch
docker compose run -it tests npm test -- --watch
```

### Débogage d'Application

**Débogage Node.js côté serveur:**

```bash
# Démarrer avec débogage activé
docker compose run -p 9229:9229 server npm run dev

# Dans l'IDE (VS Code .vscode/launch.json):
```

**Fichier `.vscode/launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Docker Server Debug",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "restart": true,
      "sourceMaps": true,
      "localRoot": "${workspaceFolder}/server",
      "remoteRoot": "/app"
    }
  ]
}
```

## Mise en Place du Live Reload 🔄

### Configuration du Live Reload pour le Client

Le live reload permet de voir les modifications du code en temps réel sans redémarrer les conteneurs. Plusieurs approches existent selon la technologie utilisée.

**Fichier `client/src/watch.js` (Solution simple avec http-server):**

```javascript
const fs = require('fs');
const path = require('path');

const watchDir = path.join(__dirname);
const extensions = ['.html', '.css', '.js'];

console.log(`Watching for changes in ${watchDir}`);

fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
  if (extensions.some(ext => filename.endsWith(ext))) {
    console.log(`Fichier modifié: ${filename}`);
  }
});
```

### Configuration avec Webpack Dev Server

Pour les applications React ou Vue.js, Webpack Dev Server offre un meilleur support du hot reload.

**Fichier `client/webpack.config.js`:**

```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    hot: true,
    contentBase: path.join(__dirname, 'src'),
    compress: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://server:8080',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      }
    }
  },
  devtool: 'source-map'
};
```

### Configuration du Live Reload Côté Serveur

**Fichier `server/src/app.js` (Avec auto-reload):**

```javascript
const express = require("express");
const { createClient: createRedisClient } = require("redis");
const fs = require("fs");
const path = require("path");

let config = loadConfig();

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
  } catch {
    return { maxConnections: 100, timeout: 30000 };
  }
}

// Surveiller les changements de configuration
fs.watchFile(path.join(__dirname, '../config.json'), (curr, prev) => {
  console.log('Configuration mise à jour');
  config = loadConfig();
});

(async function () {
  const app = express();
  const redisClient = createRedisClient({
    url: `redis://redis:6379`
  });

  await redisClient.connect();

  app.get("/api/data", async (request, response) => {
    try {
      const cachedData = await redisClient.get("appData");
      if (cachedData) {
        return response.json({ 
          data: cachedData, 
          source: "cache",
          config: config
        });
      }
      
      const freshData = "Données fraîches du serveur";
      await redisClient.setEx("appData", 3600, freshData);
      response.json({ 
        data: freshData, 
        source: "server",
        config: config
      });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });

  app.listen(8080, () => {
    console.log("Serveur démarré sur le port 8080");
  });
})();
```

### Utilisation de Volumes pour le Live Reload

Docker Compose configure déjà les volumes pour permettre le live reload:

```yaml
services:
  server:
    volumes:
      - ./server/src:/app/src  # Recharge automatique du code
  
  client:
    volumes:
      - ./client/src:/app/src  # Recharge automatique du code
```

### Configuration Complète avec Live Reload

**Fichier `docker-compose.dev.yml` (Complet):**

```yaml
version: '3.9'

services:
  redis:
    environment:
      - LOGLEVEL=debug

  server:
    build:
      context: .
      dockerfile: server/Dockerfile
      args:
        - NODE_ENV=development
    environment:
      - NODE_ENV=development
      - DEBUG=app:*
    volumes:
      - ./server/src:/app/src:cached
      - ./server/config.json:/app/config.json
      - server_node_modules:/app/node_modules
    command: npm run dev
    stdin_open: true
    tty: true
    ports:
      - "9229:9229"  # Débogage

  client:
    build:
      context: .
      dockerfile: client/Dockerfile
      args:
        - NODE_ENV=development
    environment:
      - NODE_ENV=development
      - DANGEROUSLY_DISABLE_HOST_CHECK=true
    volumes:
      - ./client/src:/app/src:cached
      - client_node_modules:/app/node_modules
    command: npm run dev
    stdin_open: true
    tty: true
    ports:
      - "3001:3000"  # Port différent pour éviter les conflits

volumes:
  server_node_modules:
  client_node_modules:
```

### Scripts Package.json pour le Développement

**Fichier `server/package.json` (Scripts complets):**

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js --watch src --ext js,json",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/"
  }
}
```

**Fichier `client/package.json` (Scripts complets):**

```json
{
  "scripts": {
    "start": "http-server -p 3000 -c-1",
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Utilisation Pratique du Live Reload

```bash
# Démarrer l'environnement de développement avec live reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Modifier un fichier dans server/src/app.js
# Le serveur redémarre automatiquement

# Modifier un fichier dans client/src/index.html
# Le navigateur se recharge automatiquement

# Afficher les logs en temps réel
docker compose logs -f

# Afficher uniquement les logs du serveur
docker compose logs -f server
```

## Workflow Complet : Du Développement à la Production 🚀

### Phase de Développement

1. **Configuration initiale:**
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

2. **Modifications du code:** Les fichiers se rechargent automatiquement via les volumes

3. **Exécution des tests:**
   ```bash
   docker compose run --rm tests npm test
   ```

4. **Débogage:** Utiliser les ports exposés (9229 pour Node.js)

### Transition vers la Production

1. **Construction des images:**
   ```bash
   docker compose build --no-cache
   ```

2. **Tests d'intégration:**
   ```bash
   docker compose run --rm tests npm run test:integration
   ```

3. **Optimisation des images:**
   ```bash
   docker image ls
   docker image inspect app-server
   ```

4. **Déploiement:**
   ```bash
   docker compose -f docker-compose.yml up -d
   ```

## Bonnes Pratiques et Optimisations 💡

### Sécurité

- Utiliser toujours des utilisateurs non-root dans les conteneurs[1]
- Mettre à jour régulièrement les images de base
- Utiliser `.dockerignore` pour exclure les fichiers sensibles
- Ne pas inclure les secrets directement dans les images

### Performance

- Utiliser des builds multi-étapes pour réduire la taille des images
- Mettre en cache les couches Dockerfile en plaçant les commandes immuables en premier
- Utiliser Alpine Linux comme image de base
- Optimiser l'ordre des commandes RUN pour le cache

### Maintenabilité

- Documenter la structure du projet dans un README.md
- Utiliser des versions spécifiques pour les dépendances
- Organiser les configurations par fichiers séparés
- Implémenter des healthchecks pour tous les services

### Monitoring et Logging

```yaml
services:
  server:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

Cette approche structurée et détaillée permet de construire une application Docker robuste, sécurisée et facilement maintenable tout en offrant une expérience de développement fluide et productive.
