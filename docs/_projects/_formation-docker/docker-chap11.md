# Citations
- https://www.aqsone.com/fr/blog/mettre-en-production-vos-applications-avec-docker
- https://www.orpheebesson.fr/blog/mettre-en-production-une-application-web-avec-docker
- https://www.datacamp.com/fr/tutorial/docker-tutorial
- https://www.hostinger.com/fr/tutoriels/tutoriel-docker
- https://senza-formations.com/nos-articles/comment-installer-docker-et-configurer-ses-premiers-conteneurs-pas-a-pas
- https://blog.stephane-robert.info/docs/conteneurs/moteurs-conteneurs/docker/
- https://www.alfa-safety.fr/blog/docker-en-production-les-bonnes-pratiques/
- https://www.nas-forum.com/forum/topic/65309-tuto-docker-introduction/
- https://www.youtube.com/watch?v=f2-XKw-bkSM


# Tokens
- prompt_tokens: 306
- completion_tokens: 4770
- total_tokens: 5076
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.072, 'request_cost': 0.006, 'total_cost': 0.078}


# Content
# 📦 Guide Complet : Mise en Production avec Docker et Docker Compose

## Introduction à la Mise en Production

La mise en production constitue une étape critique dans le cycle de vie d'une application. Elle implique de passer d'un environnement de développement local à un environnement accessible aux utilisateurs finaux. Docker facilite grandement ce processus en garantissant la cohérence entre les environnements de développement et de production[1][2].

La conteneurisation avec Docker offre plusieurs avantages pour la mise en production :

- **Portabilité** : Les conteneurs s'exécutent de manière identique sur n'importe quel serveur
- **Isolement** : Chaque application fonctionne dans son propre environnement isolé
- **Scalabilité** : Il est facile de dupliquer et de gérer plusieurs instances
- **Maintenabilité** : Les dépendances sont figées dans l'image Docker

## Création du VPS (Virtual Private Server)

### Préparation du Serveur

Avant de déployer une application Docker en production, il convient de préparer correctement le serveur qui l'hébergera. Cette préparation inclut plusieurs étapes essentielles[2].

**Prérequis matériels recommandés** :

- Processeur 64 bits
- 4 Go de RAM minimum
- 10 Go d'espace disque disponible
- Accès root ou accès sudo

### Installation de Docker sur le Serveur

L'installation de Docker sur le serveur de production suit une procédure standardisée. Après avoir provisionnée une instance VPS auprès d'un fournisseur d'hébergement (OVH, Hetzner, DigitalOcean, etc.), l'administrateur doit se connecter au serveur via SSH et exécuter les commandes d'installation appropriées.

Sur un système basé sur Debian/Ubuntu, la procédure ressemble à ceci :

```bash
# Mise à jour du système
sudo apt-get update
sudo apt-get upgrade -y

# Installation des dépendances nécessaires
sudo apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

# Ajout de la clé GPG officielle de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajout du repository Docker
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installation de Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Vérification de l'installation
docker --version
```

### Configuration de l'Accès Utilisateur

Par défaut, seul l'utilisateur root peut exécuter les commandes Docker. Pour améliorer l'ergonomie et la sécurité, il est recommandé d'ajouter l'utilisateur de déploiement au groupe Docker[5] :

```bash
# Création d'un utilisateur de déploiement
sudo useradd -m -s /bin/bash deployer

# Ajout du utilisateur au groupe docker
sudo usermod -aG docker deployer

# Application des modifications au groupe
newgrp docker
```

## Structure du Projet et Préparation

### Organisation des Fichiers

Une application destinée à la production doit suivre une structure organisée. Voici une organisation recommandée :

```
mon-application/
├── src/
│   ├── app.py
│   ├── requirements.txt
│   └── templates/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── .env.production
└── README.md
```

### Création du Dockerfile pour la Production

Le Dockerfile constitue le cœur de la conteneurisation. Contrairement aux Dockerfiles de développement, ceux destinés à la production doivent être optimisés pour la taille, les performances et la sécurité[1][3].

Voici un exemple complet pour une application Python avec Streamlit :

```dockerfile
FROM python:3.10-alpine

EXPOSE 8501

WORKDIR /app

COPY requirements.txt ./requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

CMD streamlit run my_app.py
```

Explicitation des instructions :

- **FROM** : Spécifie l'image de base. `python:3.10-alpine` offre une image légère optimisée pour la production
- **EXPOSE** : Documente le port sur lequel l'application écoute
- **WORKDIR** : Définit le répertoire de travail dans le conteneur
- **COPY** : Copie les fichiers du contexte de construction vers l'image
- **RUN** : Exécute les commandes pendant la construction de l'image
- **CMD** : Définit la commande lancée au démarrage du conteneur

### Construction de l'Image Docker

Une fois le Dockerfile défini, la construction de l'image s'effectue via la commande suivante[1] :

```bash
# Construction de l'image
docker build -t streamlit_app .

# Vérification de la création
docker images | grep streamlit_app
```

L'option `-t` ajoute un tag à l'image, facilitant son identification. Le point final (`.`) indique que le Dockerfile se trouve dans le répertoire courant.

## Utilisation de Docker Compose en Production

### Concept Fondamental

Docker Compose permet de gérer plusieurs conteneurs interdépendants avec une seule commande. En production, ce fichier doit définir l'ensemble de la pile applicative[2][3].

### Architecture Multi-Conteneur

Une application en production typique comprend plusieurs composants :

| Composant | Rôle | Image | Port |
|-----------|------|-------|------|
| Frontend | Interface utilisateur | Application frontend | 3000 |
| Backend | Logique applicative | Application backend | 3333 |
| Base de données | Persistance des données | PostgreSQL/MySQL | 5432/3306 |
| Reverse proxy | Routage et SSL | Traefik | 80/443 |
| Cache | Performance | Redis | 6379 |

### Exemple de docker-compose.yml

```yaml
version: '3.9'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: app_backend
    ports:
      - "3333:3333"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/appdb
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - app_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: app_frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://backend:3333
    restart: unless-stopped
    networks:
      - app_network

  db:
    image: postgres:15-alpine
    container_name: app_db
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=appdb
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - app_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    container_name: app_cache
    restart: unless-stopped
    networks:
      - app_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  reverse_proxy:
    image: traefik:v2.10
    container_name: app_reverse_proxy
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik/traefik.yml:/traefik.yml:ro
      - ./traefik/config.yml:/config.yml:ro
      - letsencrypt:/letsencrypt
    restart: unless-stopped
    networks:
      - app_network

volumes:
  db_data:
  letsencrypt:

networks:
  app_network:
    driver: bridge
```

### Lancement de la Production

Avec Docker Compose configuré, le lancement de l'ensemble de la pile s'effectue simplement[2][3] :

```bash
# Lancement en mode détaché
docker compose up -d

# Affichage des logs
docker compose logs -f

# Arrêt des services
docker compose down

# Arrêt avec suppression des volumes
docker compose down -v
```

## Mise en Place du Certificat TLS

### Concepts de Base

TLS (Transport Layer Security) chiffre les communications entre le client et le serveur. En production, tout site web accessible publiquement doit utiliser HTTPS. Let's Encrypt fournit des certificats TLS gratuits, largement utilisés avec Certbot[2].

### Configuration de Traefik avec Let's Encrypt

Traefik est un reverse proxy moderne qui automatise la gestion des certificats TLS. Voici la configuration recommandée :

**traefik/traefik.yml** :

```yaml
api:
  insecure: true
  dashboard: true

entryPoints:
  http:
    address: ":80"
    http:
      redirections:
        entrypoint:
          to: https
          scheme: https
  https:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: http
      certificatesDuration: 2160h

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
  file:
    filename: /config.yml
    watch: true
```

**traefik/config.yml** :

```yaml
http:
  routers:
    backend:
      rule: "Host(`api.example.com`)"
      service: backend_service
      entryPoints:
        - https
      tls:
        certResolver: letsencrypt

    frontend:
      rule: "Host(`example.com`)"
      service: frontend_service
      entryPoints:
        - https
      tls:
        certResolver: letsencrypt

  services:
    backend_service:
      loadBalancer:
        servers:
          - url: "http://backend:3333"

    frontend_service:
      loadBalancer:
        servers:
          - url: "http://frontend:3000"
```

### Renouvellement Automatique des Certificats

Let's Encrypt émet des certificats valides 90 jours. Le renouvellement automatique constitue une nécessité opérationnelle[2].

Traefik gère automatiquement ce renouvellement si configuré correctement. Les certificats sont stockés dans `/letsencrypt/acme.json`. Il est crucial de persister ce volume :

```bash
# Vérification du statut du certificat
docker compose exec reverse_proxy cat /letsencrypt/acme.json | grep -o '"NotAfter":"[^"]*"' | head -1

# Forçage du renouvellement (si nécessaire)
docker compose restart reverse_proxy
```

## Utilisation de PM2

### Concepts Fondamentaux

PM2 constitue un gestionnaire de processus pour Node.js permettant de maintenir les applications en ligne. Bien que Docker soit préféré pour la conteneurisation en production, PM2 reste utile dans certains contextes hybrides ou pour des déploiements légers[2].

### Intégration PM2 dans Docker

Pour une application Node.js déployée avec PM2 :

**Dockerfile** :

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production
RUN npm install -g pm2

COPY . .

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
```

**ecosystem.config.js** :

```javascript
module.exports = {
  apps: [
    {
      name: 'app',
      script: './src/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '500M',
      watch: false
    }
  ]
};
```

## Environnement de Production

### Configuration des Variables d'Environnement

La gestion des secrets et des configurations dépend de l'environnement. En production, les données sensibles ne doivent jamais être commises dans le dépôt Git[2].

**.env.production** :

```bash
# Configuration générale
NODE_ENV=production
DEBUG=false

# Bases de données
DATABASE_URL=postgresql://prod_user:secure_password@db:5432/production_db
REDIS_URL=redis://cache:6379

# Authentification
JWT_SECRET=your_super_secret_key_here
API_KEY=production_api_key

# Services externes
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASSWORD=email_password

# Domaines
FRONTEND_URL=https://example.com
BACKEND_URL=https://api.example.com
```

### Chargement des Variables

Dans docker-compose.yml :

```yaml
services:
  backend:
    env_file:
      - .env.production
```

## Mise du Projet sur GitLab

### Configuration du Dépôt

L'hébergement du code source sur une plateforme comme GitLab facilite le versioning et l'intégration continue[2].

```bash
# Initialisation du dépôt Git
git init
git remote add origin https://gitlab.com/username/mon-application.git

# Premier commit
git add .
git commit -m "Initial commit: application structure"
git push -u origin main
```

### Fichier .gitignore pour Docker

```
# Fichiers environnement
.env
.env.local
.env.*.local

# Dépendances
node_modules/
__pycache__/
*.pyc
venv/

# Logs et données
logs/
*.log
npm-debug.log

# Volumes Docker
volumes/
db_data/

# IDE
.vscode/
.idea/
*.swp
*.swo
```

## Lancement de la Production

### Déploiement Initial

Le déploiement d'une application en production implique plusieurs vérifications préalables :

```bash
# Accès au serveur
ssh deployer@your_server_ip

# Clonage du dépôt
git clone https://gitlab.com/username/mon-application.git
cd mon-application

# Création du fichier .env avec les secrets de production
nano .env.production

# Lancement de l'application
docker compose -f docker-compose.yml up -d

# Vérification du statut
docker compose ps
docker compose logs -f
```

### Mise à Jour de l'Application

Lors d'une mise à jour :

```bash
# Récupération des dernières modifications
git pull origin main

# Reconstruction des images si le Dockerfile a changé
docker compose up -d --build

# Nettoyage des ressources obsolètes
docker system prune -a -f
```

### Monitoring et Maintenance

```bash
# Affichage des logs en temps réel
docker compose logs -f backend

# Statistiques d'utilisation des ressources
docker stats

# Inspection d'un conteneur
docker compose exec backend sh

# Redémarrage d'un service
docker compose restart backend
```

## Automatisation avec GitHub Actions/GitLab CI

### Workflow de Déploiement Automatisé

L'automatisation du déploiement réduit les erreurs humaines et accélère les mises en production[2].

**.github/workflows/deploy.yml** :

```yaml
name: Build, push, and deploy Docker images to the server

on:
  push:
    branches: ["main"]

env:
  REGISTRY: ghcr.io
  DOCKER_IMAGE_PRODUCTION_TAG: production

jobs:
  build_and_push:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ github.repository }}:${{ env.DOCKER_IMAGE_PRODUCTION_TAG }}
            ${{ env.REGISTRY }}/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build_and_push
    runs-on: ubuntu-latest
    
    steps:
      - name: Deploy to production server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PRODUCTION_SERVER_IP }}
          username: ${{ secrets.PRODUCTION_SERVER_USER }}
          key: ${{ secrets.PRODUCTION_SERVER_SSH_KEY }}
          script: |
            cd /home/deployer/mon-application
            git pull origin main
            docker compose pull
            docker compose up -d
            docker compose logs backend
```

## Bonnes Pratiques en Production

### Sécurité

- **Principe du moindre privilège** : N'exposer que les ports nécessaires
- **Secrets management** : Utiliser des gestionnaires de secrets (HashiCorp Vault, AWS Secrets Manager)
- **Mises à jour régulières** : Maintenir les images de base à jour
- **Scanning d'images** : Analyser les images pour les vulnérabilités

### Performance

- **Limites de ressources** : Définir des limites CPU et mémoire

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

- **Healthchecks** : Vérifier la disponibilité des services
- **Caching** : Utiliser Redis ou Memcached pour le cache applicatif

### Observabilité

- **Logs centralisés** : Aggréger les logs avec ELK ou Loki
- **Monitoring** : Utiliser Prometheus et Grafana
- **Tracing distribué** : Implémenter Jaeger pour suivre les requêtes

### Disaster Recovery

- **Sauvegardes régulières** : Exporter les volumes de données

```bash
# Sauvegarde d'une base de données
docker compose exec db mysqldump -u user -p password dbname > backup.sql

# Sauvegarde d'un volume Docker
docker run --rm -v db_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/db_data_backup.tar.gz -C /data .
```

- **Réplication** : Mettre en place une stratégie multi-régions
- **Rollback rapide** : Conserver les versions précédentes des images

## Optimisation et Évolution

### Scaling Horizontal

Pour gérer une charge croissante, il faut ajouter plusieurs instances :

```yaml
services:
  backend:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
```

### Orchestration avec Docker Swarm

Pour des déploiements à plus grande échelle :

```bash
# Initialisation du Swarm
docker swarm init

# Déploiement d'un stack
docker stack deploy -c docker-compose.yml mon_app
```

### Migration vers Kubernetes

Pour des besoins de scalabilité massifs et d'orchestration avancée, Kubernetes représente l'étape suivante naturelle après Docker Compose et Docker Swarm.

## Conclusion

La mise en production d'applications avec Docker et Docker Compose offre une base solide pour des déploiements fiables et reproductibles. L'ensemble des éléments présentés—configuration d'infrastructure, gestion des certificats TLS, automatisation des déploiements, et monitoring—constituent les piliers d'une stratégie de production robuste. L'apprentissage progressif de ces concepts, combiné à une compréhension des bonnes pratiques, permet de bâtir des systèmes production-ready, maintenables et évolutifs.
