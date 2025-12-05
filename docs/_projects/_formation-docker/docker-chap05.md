# Citations
- https://www.sfeir.dev/back/dockeriser-une-application-nodejs-pas-a-pas/
- https://www.youtube.com/watch?v=TRvTtfAloT4
- https://cours-info.iut-bm.univ-fcomte.fr/upload/supports/S3/web/cot%20serveur/Dockeriser%20une%20application%20Web%20NodeJS.pdf
- https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker-quickstart-fr
- https://docs.docker.com/guides/nodejs/containerize/
- https://www.hostinger.com/fr/tutoriels/comment-creer-un-conteneur-docker
- https://snyk.io/fr/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/
- https://www.youtube.com/watch?v=RyvKmOA69oM
- https://www.stackhero.io/fr-FR/services/Docker/documentations/Node-js
- https://labex.io/fr/tutorials/docker-how-to-structure-a-dockerfile-for-a-node-js-application-411608


# Tokens
- prompt_tokens: 268
- completion_tokens: 6380
- total_tokens: 6648
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.096, 'request_cost': 0.006, 'total_cost': 0.103}


# Content
# Créer une image Docker pour un serveur Node.js 🐳

## Introduction au projet

La conteneurisation représente une avancée majeure dans le déploiement d'applications modernes. Docker permet de packager une application Node.js avec toutes ses dépendances dans un conteneur isolé et portable. Cette approche garantit que l'application fonctionnera de manière identique, quel que soit l'environnement d'exécution : machine locale du développeur, serveur de staging ou infrastructure de production.

Un serveur Node.js conteneurisé offre plusieurs avantages significatifs. Premièrement, la cohérence entre les environnements de développement et de production élimine les problèmes classiques du type « ça marche chez moi ». Deuxièmement, la scalabilité devient triviale : un conteneur peut être répliqué instantanément sur plusieurs serveurs. Troisièmement, la gestion des dépendances se simplifie considérablement puisque chaque conteneur dispose de sa propre version de Node.js et des modules npm nécessaires.

Le flux de travail standard pour conteneuriser une application Node.js suit une progression logique. On commence par définir les instructions de construction dans un Dockerfile, qui décrit comment créer l'image. Cette image sert ensuite de modèle pour générer des conteneurs exécutables. Chaque conteneur représente une instance isolée de l'application, fonctionnant en arrière-plan avec ses propres ressources système.

### Architecture générale du processus

Le processus de conteneurisation s'articule autour de trois concepts fondamentaux :

**L'image Docker** constitue le modèle immuable. Elle contient le système d'exploitation, l'environnement d'exécution Node.js, les dépendances npm et le code source de l'application. Une image Docker se construit une seule fois et peut générer plusieurs conteneurs identiques.

**Le Dockerfile** représente le fichier de configuration qui définit comment construire l'image. Il contient une série d'instructions qui spécifient l'image de base, les dépendances à installer, les fichiers à copier et les commandes à exécuter.

**Le conteneur Docker** correspond à l'instance en cours d'exécution dérivée d'une image. Chaque conteneur dispose de son propre système de fichiers, réseau et ressources système, tout en partageant le noyau du système hôte.

## Création du Dockerfile

### Structure fondamentale d'un Dockerfile

Le Dockerfile est un fichier texte sans extension qui énumère les étapes de construction de l'image Docker.[1] Chaque ligne du Dockerfile crée une nouvelle couche dans l'image, que Docker met en cache pour optimiser les reconstructions ultérieures.[6]

Voici un exemple minimal de Dockerfile pour une application Node.js :

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

ENV HOST=0.0.0.0 PORT=3000

CMD ["node", "index.js"]
```

Examinons chaque instruction en détail :

### Instruction FROM : définir l'image de base

```dockerfile
FROM node:18
```

L'instruction `FROM` doit toujours être la première du Dockerfile (à l'exception des commentaires et des directives de parser).[2] Elle spécifie l'image de base sur laquelle construire la nouvelle image. Dans cet exemple, on utilise Node.js version 18, qui inclut déjà Node.js et npm préinstallés.

Le choix de l'image de base est crucial pour l'efficacité et la sécurité. Les options principales incluent :

- `node:18` : image officielle complète (environ 900 MB)
- `node:18-alpine` : image allégée basée sur Alpine Linux (environ 180 MB)
- `node:18-slim` : version intermédiaire entre complète et alpine (environ 340 MB)

Les images Alpine offrent des avantages significatifs pour la production. Elles réduisent la taille de l'image et diminuent la surface d'attaque en minimisant les composants système inutiles.

### Instruction WORKDIR : définir le répertoire de travail

```dockerfile
WORKDIR /app
```

Cette instruction établit le répertoire de travail à l'intérieur du conteneur. Toutes les commandes suivantes (RUN, COPY, CMD, etc.) s'exécutent dans ce contexte. Si le répertoire n'existe pas, Docker le crée automatiquement.

L'utilisation de `WORKDIR` offre plusieurs avantages : elle organise le système de fichiers du conteneur, elle facilite la compréhension du Dockerfile en montrant explicitement où les fichiers se trouvent, et elle prévient les conflits de chemins.

### Instructions COPY : transférer les fichiers

```dockerfile
COPY package*.json ./
```

Cette première instruction COPY transfère les fichiers `package.json` et `package-lock.json` (si présent) du répertoire local vers le conteneur. L'astérisque `*` agit comme un joker, ce qui rend la commande flexible : elle copie `package.json` en toute circonstance, et `package-lock.json` s'il existe.

La raison de cette séparation en deux étapes COPY est stratégique. Les dépendances npm changent moins fréquemment que le code source de l'application. En copiant les fichiers package en premier et en installant les dépendances avant de copier le code, on optimise la mise en cache Docker. Si seul le code change, Docker réutilise la couche des dépendances installées, accélérant considérablement la reconstruction.

```dockerfile
COPY --chown=node:node . .
```

Cette deuxième instruction COPY transfère tous les fichiers restants du répertoire local vers le conteneur. L'option `--chown=node:node` assigne la propriété des fichiers à l'utilisateur non-root `node`, améliorant ainsi la sécurité.[4] Cette pratique respecte le principe du moindre privilège en garantissant que l'application ne s'exécute pas en tant que root.

### Instruction RUN : installer les dépendances

```dockerfile
RUN npm install
```

L'instruction `RUN` exécute des commandes à l'intérieur du conteneur pendant la construction de l'image. Ici, elle installe les dépendances npm spécifiées dans `package.json`. Cette étape est cruciale : elle crée une couche contenant tous les modules node_modules, qui seront disponibles lors de l'exécution du conteneur.

### Instructions EXPOSE et ENV : configurer le conteneur

```dockerfile
EXPOSE 3000
```

L'instruction `EXPOSE` documente le port sur lequel l'application écoute. Elle ne publie pas réellement le port ; elle sert plutôt de documentation et facilite l'utilisation ultérieure de l'option `-p` dans la commande `docker run`.

```dockerfile
ENV HOST=0.0.0.0 PORT=3000
```

L'instruction `ENV` définit des variables d'environnement à l'intérieur du conteneur. Ici, on configure l'hôte sur lequel le serveur écoute (`0.0.0.0` pour tous les adaptateurs réseau) et le port (`3000`). Ces variables peuvent être référencées par le code Node.js via `process.env`.

### Instruction CMD : définir la commande par défaut

```dockerfile
CMD ["node", "index.js"]
```

L'instruction `CMD` spécifie la commande par défaut à exécuter quand le conteneur démarre. Elle doit être au format JSON (appelé format exec). Cette commande lancera le serveur Node.js en exécutant le fichier `index.js`.

### Exemple complet avec structure progressive

Pour une application Express plus élaborée, voici une structure Dockerfile plus complète :

```dockerfile
# Étape 1 : Utiliser l'image de base officielle Node.js
FROM node:18-alpine

# Étape 2 : Définir le répertoire de travail
WORKDIR /usr/src/app

# Étape 3 : Copier les fichiers de dépendances
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm ci --only=production

# Étape 5 : Copier le code source
COPY --chown=node:node . .

# Étape 6 : Créer un utilisateur non-root (optionnel mais recommandé)
USER node

# Étape 7 : Exposer le port
EXPOSE 8080

# Étape 8 : Définir la santé du conteneur (optionnel)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Étape 9 : Commande de démarrage
CMD ["npm", "start"]
```

### Construction de l'image Docker

Une fois le Dockerfile créé, la construction de l'image utilise la commande `docker build` :[1]

```bash
docker build -t sfeir-dev .
```

L'option `-t` spécifie le nom et éventuellement le tag de l'image. Le `.` indique que le contexte de construction est le répertoire courant, où Docker trouve le Dockerfile et tous les fichiers à copier.

Pour vérifier que l'image a été correctement construite, on utilise la commande :[1]

```bash
docker images
```

Le résultat affichera les images disponibles localement :

```
REPOSITORY   TAG      IMAGE ID       CREATED        SIZE
sfeir-dev    latest   d1b90f727fbc  6 seconds ago   1.1GB
```

### Utilisation de build arguments

Pour rendre les Dockerfile plus flexibles, on peut utiliser les arguments de construction :

```dockerfile
FROM node:${NODE_VERSION:-18}-alpine

ARG APP_PORT=3000

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${APP_PORT}

CMD ["node", "server.js"]
```

Les arguments se passent lors de la construction :

```bash
docker build --build-arg NODE_VERSION=20 --build-arg APP_PORT=8080 -t myapp .
```

## Optimisation et .dockerignore

### Comprendre l'optimisation des images

La taille des images Docker affecte directement les temps de déploiement, les ressources disque utilisées et les coûts de transfert réseau. Une image non optimisée peut facilement dépasser 1 GB, tandis qu'une image bien conçue reste sous 300 MB.[4] L'optimisation représente donc un enjeu majeur pour la production.

### Fichier .dockerignore

Le fichier `.dockerignore` fonctionne de manière similaire à `.gitignore`. Il spécifie les fichiers et répertoires à exclure du contexte de construction, réduisant ainsi la taille de l'image et accélérant le processus de construction.[4]

Voici un exemple de `.dockerignore` approprié pour une application Node.js :

```
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
README.md
.env
.env.local
.DS_Store
dist
build
coverage
.npm
.eslintcache
.node_repl_history
*.log
*.swp
```

L'exclusion de `node_modules` est particulièrement importante. Les dépendances npm déjà installées localement ne sont pas nécessaires puisque `RUN npm install` les réinstalle dans le conteneur. Leur inclusion inutile augmenterait considérablement la taille du contexte de construction.

### Stratégies d'optimisation des couches

Docker met en cache chaque couche créée par une instruction du Dockerfile. Comprendre ce mécanisme de cache permet d'optimiser significativement les temps de reconstruction.[6]

**Ordre des instructions** : les instructions moins fréquemment modifiées doivent précéder les instructions fréquemment modifiées. Le pattern optimal pour Node.js suit cette structure :

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Les dépendances changent rarement
COPY package*.json ./
RUN npm ci --only=production

# Le code change fréquemment
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Si le code change mais pas les dépendances, Docker réutilise la couche contenant `node_modules`, économisant du temps et des ressources.

**Multistage builds** : cette technique avancée crée une image intermédiaire pour la compilation, puis copie uniquement les fichiers nécessaires dans l'image finale :

```dockerfile
# Stage 1 : Build
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2 : Runtime
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
```

Cette approche élimine les fichiers de développement de l'image finale, réduisant sa taille considérablement. L'image finale ne contient que le code compilé et les dépendances de production, pas les dépendances de développement.

**Minimiser le nombre de couches** : bien que chaque instruction crée une couche, on peut en combiner plusieurs pour réduire le nombre total :

```dockerfile
# ❌ Inefficace : plusieurs RUN créent plusieurs couches
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean

# ✅ Efficace : un seul RUN crée une seule couche
RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get clean
```

### Choix de l'image de base

La sélection de l'image de base a un impact énorme sur la taille finale et les performances :

| Image | Taille | Utilisation |
|-------|--------|-------------|
| `node:18` | ~900 MB | Développement avec tous les outils système |
| `node:18-slim` | ~340 MB | Applications nécessitant certains outils système |
| `node:18-alpine` | ~180 MB | Production, applications sans dépendances système complexes |
| `node:18-alpine3.18` | ~180 MB | Production avec Alpine 3.18 spécifique |

Pour la majorité des applications Node.js, Alpine représente le meilleur compromis entre taille et fonctionnalité.

### Optimisation des dépendances npm

L'utilisation de `npm ci` à la place de `npm install` améliore la reproductibilité en environments de conteneurisation :[4]

```dockerfile
# ❌ Moins optimal
RUN npm install

# ✅ Optimal pour production
RUN npm ci --only=production
```

La commande `npm ci` (continuous integration) installe les versions exactes spécifiées dans `package-lock.json`, tandis que `npm install` peut installer des versions mineures plus récentes. En production, la reproductibilité prime.

### Gestion des fichiers de développement

Certains fichiers de développement (tests, fichiers de configuration, scripts de build) peuvent être exclus de l'image de production :

```dockerfile
FROM node:18-alpine as development

WORKDIR /app

COPY . .

RUN npm install

# Couche de production sans fichiers inutiles
FROM node:18-alpine as production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=development /app/dist ./dist

# Exclure : .git, .github, tests, scripts, src, tsconfig.json, etc.

CMD ["node", "dist/index.js"]
```

### Bonnes pratiques de sécurité dans les images

- **N'exécuter pas l'application en tant que root** : créer un utilisateur dédié
- **Minimiser les capacités du système** : utiliser Alpine ou slim pour réduire la surface d'attaque
- **Mettre à jour les dépendances régulièrement** : utiliser des outils comme Snyk ou Dependabot
- **Scanner les images pour les vulnérabilités** : utiliser `docker scan` ou des services externes

Exemple d'image sécurisée :

```dockerfile
FROM node:18-alpine

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
```

## Publier et exposer des ports

### Concepts de ports dans Docker

La publication de ports établit un mappage entre les ports du conteneur et les ports de la machine hôte. Sans cette publication, les services à l'intérieur du conteneur restent inaccessibles depuis l'extérieur.

L'instruction `EXPOSE` dans le Dockerfile documente le port, tandis que l'option `-p` de `docker run` effectue le mappage réel :[1]

```bash
docker run -d -p 3000:3000 sfeir-dev
```

### Mappage de ports : syntaxe et options

La syntaxe générale du mappage de ports suit le pattern : `[host-ip:]host-port:container-port`

**Mappage simple** :

```bash
# Le conteneur écoute sur le port 3000, accessible via le port 3000 de l'hôte
docker run -p 3000:3000 myapp
```

**Mappage avec port hôte différent** :

```bash
# Le conteneur écoute sur le port 3000, mais l'hôte l'expose sur le port 8080
docker run -p 8080:3000 myapp
```

**Mappage sur une interface réseau spécifique** :

```bash
# Accessible uniquement depuis localhost
docker run -p 127.0.0.1:8080:3000 myapp

# Accessible depuis toutes les interfaces réseau
docker run -p 0.0.0.0:8080:3000 myapp
```

**Mappage de plusieurs ports** :

```bash
# Exposer plusieurs ports
docker run -p 8080:3000 -p 9000:9000 myapp
```

**Mappage de plage de ports** :

```bash
# Mapper une plage de 10 ports
docker run -p 8000-8009:3000-3009 myapp
```

### Exemple de déploiement complet avec port mapping

```bash
# Construire l'image
docker build -t nodejs-server:1.0 .

# Exécuter le conteneur avec mappage de port
docker run \
  --name my-nodejs-app \
  --detach \
  --publish 80:3000 \
  --restart always \
  nodejs-server:1.0
```

Les options utilisées :
- `--name` : assigne un nom au conteneur pour référence facile
- `--detach` : exécute le conteneur en arrière-plan
- `--publish` : mappe le port 80 de l'hôte vers le port 3000 du conteneur
- `--restart always` : redémarre automatiquement le conteneur s'il s'arrête

### Inspection et gestion des ports

Pour lister les conteneurs en cours d'exécution et voir les mappages de ports :[4]

```bash
docker ps
```

Résultat exemple :

```
CONTAINER ID   IMAGE                     COMMAND          CREATED        STATUS        PORTS                  NAMES
e50ad27074a7   nodejs-server:1.0         "node app.js"    3 minutes ago  Up 3 minutes  0.0.0.0:80->3000/tcp   my-nodejs-app
```

Pour obtenir des détails spécifiques sur un conteneur :

```bash
docker inspect my-nodejs-app | grep -A 10 "Ports"
```

### Configuration de l'application pour accepter les connexions externes

Pour que l'application Node.js accepte les connexions de toutes les interfaces réseau, il faut la configurer correctement. Une application Express typique :

```javascript
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
```

La variable `HOST='0.0.0.0'` permet à l'application d'écouter sur toutes les interfaces réseau du conteneur.

### Architectures multi-conteneurs avec partage de ports

Dans les architectures complexes, plusieurs conteneurs peuvent avoir besoin d'accéder les uns aux autres :

```bash
# Créer un réseau personnalisé
docker network create myapp-network

# Exécuter le conteneur Node.js
docker run \
  --name api-server \
  --network myapp-network \
  --expose 3000 \
  nodejs-server:1.0

# Exécuter un conteneur nginx en tant que proxy
docker run \
  --name nginx-proxy \
  --network myapp-network \
  --publish 80:80 \
  -v /etc/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx:latest
```

Dans cette configuration, Nginx agit comme proxy reverse, route les demandes externes vers le serveur Node.js interne.

### Health checks et vérification de connectivité

Vérifier que le conteneur s'est déployé correctement et que le port répond :

```bash
# Vérifier que le port est accessible
curl http://localhost:80

# Attendre que le conteneur soit prêt
docker run \
  --health-cmd='curl -f http://localhost:3000/health || exit 1' \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  --health-start-period=40s \
  nodejs-server:1.0
```

## Workflow complet d'une application Node.js en conteneur

### Étape 1 : Préparation du projet

Une application Node.js type possède une structure comme celle-ci :

```
mon-app/
├── src/
│   ├── index.js
│   └── server.js
├── package.json
├── package-lock.json
├── .dockerignore
├── Dockerfile
└── .gitignore
```

Le fichier `package.json` :

```json
{
  "name": "mon-app",
  "version": "1.0.0",
  "description": "Application serveur Node.js",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Étape 2 : Créer le Dockerfile optimisé

```dockerfile
# Base image
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances
COPY package*.json ./

# Installer les dépendances de production
RUN npm ci --only=production

# Copier le code source
COPY --chown=node:node . .

# Exposition du port
EXPOSE 3000

# Définir les variables d'environnement
ENV NODE_ENV=production

# Utiliser l'utilisateur non-root
USER node

# Commande de démarrage
CMD ["npm", "start"]
```

### Étape 3 : Créer le fichier .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.DS_Store
dist
build
.npm
```

### Étape 4 : Construire l'image

```bash
# Construire avec un tag
docker build -t mon-app:1.0 .

# Vérifier la création
docker images | grep mon-app
```

### Étape 5 : Exécuter le conteneur

```bash
# Exécuter en arrière-plan avec mappage de port
docker run -d \
  --name mon-app-instance \
  --publish 8080:3000 \
  --restart unless-stopped \
  mon-app:1.0

# Vérifier que le conteneur s'exécute
docker ps | grep mon-app
```

### Étape 6 : Tester l'application

```bash
# Tester localement
curl http://localhost:8080

# Voir les logs du conteneur
docker logs mon-app-instance

# Suivre les logs en temps réel
docker logs -f mon-app-instance
```

### Étape 7 : Arrêter et nettoyer

```bash
# Arrêter le conteneur
docker stop mon-app-instance

# Supprimer le conteneur
docker rm mon-app-instance

# Supprimer l'image
docker rmi mon-app:1.0
```

## Déploiement en production et considérations avancées

### Variables d'environnement en production

Les variables d'environnement ne doivent jamais être codées en dur dans le Dockerfile. Elles doivent être passées au runtime :

```bash
docker run \
  --env NODE_ENV=production \
  --env DATABASE_URL=postgresql://user:pass@db:5432/myapp \
  --env JWT_SECRET=secret-key-here \
  mon-app:1.0
```

Ou utiliser un fichier .env :

```bash
docker run --env-file .env.production mon-app:1.0
```

### Gestion des volumes pour persistence des données

```bash
docker run \
  --volume /app/logs:/logs \
  --volume /app/uploads:/uploads \
  mon-app:1.0
```

### Networking et communication entre conteneurs

```bash
# Créer un réseau
docker network create app-network

# Connecter les conteneurs au réseau
docker run --network app-network --name api mon-app:1.0
docker run --network app-network --name db postgres:15
```

### Orchestration avec Docker Compose

Pour les applications multi-conteneurs :

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=password
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

Déployer avec :

```bash
docker-compose up -d
```

## Conclusion

La conteneurisation d'une application Node.js avec Docker représente un passage essentiel vers les practices modernes de développement et de déploiement. Le processus, bien que comportant plusieurs étapes, offre une structure claire et reproductible.

La maîtrise des concepts fondamentaux—le Dockerfile, les couches d'images, le mappage de ports et l'optimisation—constitue la base pour construire des applications scalables et maintenables. Les patterns présentés ici, du Dockerfile basique aux multistage builds avancés, couvrent la majorité des cas d'usage rencontrés en développement professionnel.

L'optimisation ne doit pas être négligée, car une image bien conçue peut être jusqu'à 5 fois plus petite qu'une image naïve, impactant directement les coûts et les performances de déploiement. L'adoption de bonnes pratiques de sécurité—utilisateurs non-root, minimisation des couches, exclusion des fichiers inutiles—établit les fondations d'une infrastructure robuste.
