# Citations
- https://xavki.blog/docker-compose-tutoriaux-francais/
- https://senza-formations.com/nos-articles/tutoriel-docker-compose-orchestrer-plusieurs-conteneurs-facilement
- https://www.datacamp.com/fr/tutorial/docker-compose-guide
- https://www.ionos.fr/digitalguide/serveur/configuration/tutoriel-docker-compose/
- https://blog.stephane-robert.info/docs/conteneurs/orchestrateurs/docker-compose/
- https://tropars.github.io/downloads/lectures/Docker/formation_docker.pdf
- https://www.youtube.com/watch?v=04TkqB5WdL0
- https://www.youtube.com/watch?v=nkg48NLgGxE
- https://openclassrooms.com/fr/courses/8431896-optimisez-votre-deploiement-en-creant-des-conteneurs-avec-docker/8483935-integrez-votre-container-dans-un-ecosysteme-avec-docker-compose


# Tokens
- prompt_tokens: 338
- completion_tokens: 6222
- total_tokens: 6560
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.093, 'request_cost': 0.006, 'total_cost': 0.1}


# Content
# Docker Compose : Guide Complet et Détaillé

## Introduction à Docker Compose

Docker Compose est un outil de ligne de commande fondamental pour gérer des **applications multi-conteneurs Docker**[1]. Il simplifie considérablement l'orchestration de plusieurs conteneurs en utilisant un unique fichier de configuration YAML, permettant de définir tous les services, réseaux, volumes et dépendances d'une application complexe[3].

### Contexte et Problématique

Sans Docker Compose, la gestion manuelle de plusieurs conteneurs interconnectés devient rapidement fastidieuse. Chaque conteneur doit être créé individuellement, configuré séparément, et les connexions réseau doivent être établies manuellement. Docker Compose résout ce problème en automatisant ces étapes et en centralisant toute la configuration dans un seul fichier[3].

### Avantages Clés

Docker Compose offre plusieurs bénéfices majeurs pour le développement et le déploiement :

- **Simplicité de déploiement** : Une seule commande (`docker-compose up`) suffit pour démarrer une application entière avec tous ses composants[2]
- **Cohérence** : Toute la configuration est centralisée et versionnée, réduisant les erreurs dues à des configurations manuelles incohérentes[3]
- **Réseaux automatiques** : Compose crée automatiquement un réseau par défaut permettant la communication entre tous les conteneurs[3]
- **Gestion des volumes** : Les volumes persistants sont gérés automatiquement et réattachés lors des redémarrages[3]
- **Développement local** : Permet de simuler des environnements de production complexes directement sur la machine de développement[2]
- **Portabilité** : Les configurations fonctionnent de manière identique sur Linux, macOS et Windows[2]

---

## Prérequis et Installation

### Configuration Requise

Pour utiliser Docker Compose, deux approches principales sont disponibles[4] :

1. **Installation binaire autonome** : Docker Engine et Docker Compose installés séparément
2. **Docker Desktop** : Solution complète incluant Docker Engine, Docker Compose et une interface graphique

### Installation sur Windows

L'installation sur Windows s'effectue facilement via Docker Desktop[2] :

```bash
# Après avoir téléchargé et installé Docker Desktop, vérifier l'installation
docker-compose --version
```

### Installation sur Linux et macOS

Sur les systèmes Unix-like, Docker Compose peut être installé comme un binaire autonome ou en tant que composant de Docker Desktop[2].

---

## Structure Fondamentale d'un Fichier docker-compose.yml

### Anatomie du Fichier de Configuration

Le fichier `docker-compose.yml` constitue le cœur de toute configuration Docker Compose[2]. Il utilise la syntaxe YAML pour définir l'ensemble de l'infrastructure conteneurisée.

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - app-network
    environment:
      - NGINX_HOST=example.com
      - NGINX_PORT=80
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secret
      - MYSQL_DATABASE=myapp
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

### Sections Principales

Le fichier `docker-compose.yml` se compose de plusieurs sections clés[2] :

**Services** : Définit les conteneurs constituant l'application. Chaque service peut spécifier une image, construire un Dockerfile, configurer des ports, des volumes, des variables d'environnement et des dépendances.

**Volumes** : Déclare les volumes nommés utilisés par les services pour la persistance des données. Ces volumes peuvent être montés sur plusieurs conteneurs.

**Networks** : Définit les réseaux personnalisés permettant la communication entre les conteneurs. Par défaut, Compose crée un réseau bridge.

**Syntaxe YAML Core**[3] : Les éléments essentiels comprennent `services` pour les applications conteneurisées, `images` ou `build` pour spécifier les conteneurs, `ports` pour exposer les services, `volumes` pour le stockage persistant, et `networks` pour la communication interservices.

---

## Première Utilisation de Docker Compose

### Commande de Base : docker-compose up

La commande `docker-compose up` constitue le point de départ pour utiliser Docker Compose[2].

```bash
# Démarrer tous les services en mode attaché (logs visibles)
docker-compose up

# Démarrer tous les services en arrière-plan (-d pour detached)
docker-compose up -d

# Reconstruire les images avant de démarrer
docker-compose up --build

# Démarrer des services spécifiques uniquement
docker-compose up service1 service2
```

### Ce qui se Passe Lors de docker-compose up

Lorsque cette commande est exécutée, Docker Compose effectue les opérations suivantes[2] :

1. Crée les conteneurs pour chaque service défini
2. Établit les réseaux spécifiés
3. Crée les volumes nommés
4. Démarre les conteneurs dans l'ordre approprié (en respectant les dépendances)
5. Connecte les conteneurs aux réseaux
6. Attache les volumes aux points de montage

### Exemple Pratique : Application Web avec Base de Données

```yaml
version: '3.8'

services:
  webapp:
    image: python:3.9
    ports:
      - "5000:5000"
    volumes:
      - ./app:/app
    working_dir: /app
    command: python app.py
    environment:
      - DATABASE_URL=mysql://root:password@db:3306/mydb
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=mydb
    volumes:
      - mysql-data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql-data:
```

Avec cette configuration, une seule commande `docker-compose up` suffit pour démarrer à la fois l'application web Python et la base de données MySQL, avec la connectivité réseau automatiquement établie.

---

## Configuration des Services : Images Personnalisées

### Utilisation d'Images Existantes

La manière la plus simple de configurer un service consiste à utiliser une image existante :

```yaml
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
```

### Construction d'Images Personnalisées avec build

Pour les projets nécessitant une configuration spécifique, l'option `build` permet de construire une image à partir d'un Dockerfile[2].

```yaml
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
```

Le contexte `context` spécifie le répertoire contenant le Dockerfile et les fichiers nécessaires à la construction. Lors de `docker-compose up --build`, Docker Compose construit l'image avant de lancer le conteneur.

### Exemple Complet avec Dockerfile Personnalisé

**Dockerfile** :
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

**docker-compose.yml** :
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    volumes:
      - ./src:/app/src
    environment:
      - FLASK_ENV=development
      - DEBUG=True
```

---

## Gestion des Réseaux avec Docker Compose

### Réseaux Automatiques

Par défaut, Docker Compose crée automatiquement un réseau bridge pour tous les services[3]. Ce réseau permet une communication transparente entre les conteneurs en utilisant les noms des services comme hostnames.

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    # Le conteneur web peut accéder au conteneur db via 'db:3306'

  db:
    image: mysql:8.0
    # Le conteneur db peut accéder au conteneur web via 'web:80'
```

### Réseaux Personnalisés

Pour un contrôle plus granulaire, il est possible de définir des réseaux explicites :

```yaml
version: '3.8'

services:
  frontend:
    image: nginx:latest
    networks:
      - frontend-network

  backend:
    image: python:3.9
    networks:
      - backend-network
      - shared-network

  db:
    image: mysql:8.0
    networks:
      - shared-network

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
  shared-network:
    driver: bridge
```

Dans cet exemple, le frontend ne peut communiquer qu'avec lui-même, le backend peut communiquer avec la base de données et le réseau partagé, tandis que la base de données est accessible uniquement depuis le réseau partagé.

### Communication Interservices

Les services dans le même réseau peuvent se découvrir mutuellement par nom de service[3]. Par exemple, une application Python peut se connecter à MySQL en utilisant simplement `mysql://db:3306/database`.

---

## Variables d'Environnement et Configuration

### Définition des Variables d'Environnement

Les variables d'environnement permettent de configurer les services dynamiquement sans modifier le `docker-compose.yml`[3].

```yaml
version: '3.8'

services:
  app:
    image: myapp:latest
    environment:
      - NODE_ENV=production
      - DATABASE_HOST=db
      - DATABASE_PORT=5432
      - DEBUG=false
```

### Fichiers .env

Pour faciliter la gestion des variables, un fichier `.env` peut être créé :

```bash
# .env
MYSQL_ROOT_PASSWORD=secure_password_123
MYSQL_DATABASE=production_db
FLASK_ENV=production
DEBUG=false
APP_PORT=8000
```

Puis référencé dans le `docker-compose.yml` :

```yaml
version: '3.8'

services:
  app:
    environment:
      - FLASK_ENV=${FLASK_ENV}
      - DEBUG=${DEBUG}
      - APP_PORT=${APP_PORT}

  db:
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
```

### Substitution de Variables

Docker Compose substitue automatiquement les variables `${VARIABLE}` par leurs valeurs du fichier `.env`[3]. Si une variable n'est pas définie, une chaîne vide est utilisée par défaut, ou une erreur peut être levée selon la configuration.

---

## Configuration des Dépendances et du Redémarrage

### depends_on : Gestion de l'Ordre de Démarrage

L'option `depends_on` spécifie les dépendances entre services, contrôlant l'ordre de démarrage[2].

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    depends_on:
      - app
      - db

  app:
    build: .
    depends_on:
      - db

  db:
    image: mysql:8.0
```

Dans cet exemple, l'ordre de démarrage sera : db → app → web. Cependant, il est important de noter que `depends_on` n'attend que le démarrage du conteneur, pas sa pleine disponibilité. Une application web attendra que MySQL soit en écoute, ce qui peut nécessiter une logique supplémentaire dans l'application.

### Attendre la Disponibilité des Services

Pour attendre que le service soit réellement prêt, une approche consiste à utiliser des vérifications d'état ou une logique de retry dans l'application :

```yaml
version: '3.8'

services:
  app:
    build: .
    depends_on:
      - db
    environment:
      - DATABASE_HOST=db
      - DATABASE_RETRY_ATTEMPTS=5
      - DATABASE_RETRY_DELAY=2

  db:
    image: mysql:8.0
```

### restart : Politique de Redémarrage

L'option `restart` définit la politique de redémarrage automatique des conteneurs[2].

```yaml
version: '3.8'

services:
  critical_service:
    image: myapp:latest
    restart: always
    # Ce service redémarrera toujours s'il s'arrête

  temporary_service:
    image: worker:latest
    restart: on-failure
    # Ce service redémarrera uniquement en cas d'erreur

  one_time_task:
    image: cleanup:latest
    restart: no
    # Ce service ne redémarrera jamais
```

Les politiques disponibles sont[2] :

- **no** : Pas de redémarrage automatique
- **always** : Toujours redémarrer, même après un arrêt manuel
- **on-failure** : Redémarrer uniquement si le conteneur s'arrête avec un code de sortie non-zéro
- **unless-stopped** : Toujours redémarrer sauf si le conteneur a été explicitement arrêté

---

## Ports et Volumes avec Docker Compose

### Configuration des Ports

L'option `ports` expose les ports des conteneurs vers l'hôte[2].

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      # Syntaxe: "port_hôte:port_conteneur"
      - "80:80"
      - "443:443"
      - "8080:3000"
      # Liaison sur une interface spécifique
      - "127.0.0.1:5000:5000"
```

La notation `"8080:3000"` signifie que le port 8080 de l'hôte est mappé vers le port 3000 du conteneur[7]. Les requêtes vers `localhost:8080` accèdent au conteneur sur le port 3000.

### Exposition Implicite avec expose

Pour permettre la communication entre conteneurs sans exposer vers l'hôte :

```yaml
version: '3.8'

services:
  app:
    image: myapp:latest
    expose:
      - "3000"
    # Le port 3000 est accessible depuis d'autres conteneurs
    # mais pas depuis l'hôte

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    depends_on:
      - app
```

### Gestion des Volumes

Les volumes permettent la persistance des données et le partage de fichiers[2].

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    volumes:
      # Volume nommé pour la persistance
      - db-data:/var/lib/mysql
      
  app:
    build: .
    volumes:
      # Montage de répertoire local pour le développement
      - ./src:/app/src
      # Montage en lecture seule
      - ./config:/app/config:ro

volumes:
  db-data:
    # Volume nommé persistant
```

### Types de Montages

| Type | Syntax | Usage |
|------|--------|-------|
| Volume Nommé | `name:/path` | Persistance de données, gestion centralisée |
| Bind Mount | `./local:/container` | Développement, partage de fichiers hôte |
| Read-Only | `./local:/container:ro` | Configurations immuables, sécurité |
| Relative Path | `./relative:/path` | Chemin relatif au docker-compose.yml |

### Exemple Complet : Application Web avec Persistance

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./html:/usr/share/nginx/html
      - nginx-logs:/var/log/nginx
    depends_on:
      - app

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    volumes:
      - ./app/src:/app/src
      - app-cache:/app/.cache
    environment:
      - CACHE_DIR=/app/.cache

  db:
    image: postgres:14
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp

volumes:
  nginx-logs:
  app-cache:
  postgres-data:
```

---

## Autres Commandes de docker-compose

### Gestion du Cycle de Vie

```bash
# Arrêter tous les services (ne supprime pas les conteneurs)
docker-compose stop

# Arrêter des services spécifiques
docker-compose stop service1 service2

# Redémarrer tous les services
docker-compose restart

# Arrêter et supprimer tous les conteneurs, réseaux, volumes
docker-compose down

# Down avec suppression des volumes nommés
docker-compose down -v

# Down avec suppression des images construites
docker-compose down --rmi local
```

### Visualisation et Debugging

```bash
# Afficher les logs de tous les services
docker-compose logs

# Afficher les logs d'un service spécifique
docker-compose logs db

# Afficher les logs en temps réel
docker-compose logs -f

# Afficher uniquement les 50 dernières lignes
docker-compose logs --tail=50

# Afficher les conteneurs en cours d'exécution
docker-compose ps

# Afficher tous les conteneurs (y compris arrêtés)
docker-compose ps -a
```

### Exécution de Commandes

```bash
# Exécuter une commande dans un service en cours d'exécution
docker-compose exec app bash

# Exécuter une commande sans allocation de terminal
docker-compose exec -T db mysql -u root -p password

# Exécuter une commande avec une variable d'environnement
docker-compose exec app python manage.py migrate
```

### Gestion des Images et Conteneurs

```bash
# Construire ou reconstruire les services
docker-compose build

# Construire sans cache
docker-compose build --no-cache

# Construire un service spécifique
docker-compose build app

# Valider le fichier docker-compose.yml
docker-compose config

# Afficher le fichier composé résolu (après substitution)
docker-compose config --resolve-image-digests
```

### Scaling et Performance

```bash
# Démarrer plusieurs instances d'un service
docker-compose up -d --scale worker=3
# Lance 3 conteneurs du service 'worker'

# Pause tous les services (suspension, pas arrêt)
docker-compose pause

# Reprendre tous les services
docker-compose unpause
```

---

## Cas d'Usage Pratique : Application Web Complète

### Architecture Multi-Tier

Voici un exemple détaillé d'une application web complète utilisant Docker Compose :

```yaml
version: '3.8'

services:
  # Serveur Web Frontal
  nginx:
    image: nginx:1.25-alpine
    container_name: app-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./html:/usr/share/nginx/html:ro
      - nginx-logs:/var/log/nginx
    networks:
      - app-network
    depends_on:
      - backend
    restart: unless-stopped

  # Serveur d'Application Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: app-backend
    expose:
      - "8000"
    volumes:
      - ./backend/app:/app/app
      - backend-cache:/app/.cache
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/app_db
      - REDIS_URL=redis://cache:6379/0
      - SECRET_KEY=${SECRET_KEY}
      - DEBUG=false
    networks:
      - app-network
    depends_on:
      - db
      - cache
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Base de Données
  db:
    image: postgres:15-alpine
    container_name: app-db
    expose:
      - "5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=app_db
    networks:
      - app-network
    restart: unless-stopped

  # Cache Redis
  cache:
    image: redis:7-alpine
    container_name: app-cache
    expose:
      - "6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network
    restart: unless-stopped

  # Worker en Arrière-Plan
  worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: app-worker
    command: celery -A app.tasks worker --loglevel=info
    volumes:
      - ./backend/app:/app/app
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/app_db
      - REDIS_URL=redis://cache:6379/0
    networks:
      - app-network
    depends_on:
      - db
      - cache
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:
  nginx-logs:
  backend-cache:

networks:
  app-network:
    driver: bridge
```

### Fichier .env Correspondant

```bash
# .env
SECRET_KEY=your-super-secret-key-here
DB_PASSWORD=secure_database_password_123
FLASK_ENV=production
DEBUG=false
```

### Utilisation

```bash
# Démarrer l'application complète
docker-compose up -d

# Vérifier l'état des services
docker-compose ps

# Afficher les logs en temps réel
docker-compose logs -f

# Exécuter les migrations de la base de données
docker-compose exec backend flask db upgrade

# Arrêter l'application
docker-compose down

# Arrêter et supprimer tous les volumes
docker-compose down -v
```

---

## Bonnes Pratiques et Optimisations

### Structure de Répertoires Recommandée

```
projet/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env
├── .env.example
├── nginx/
│   ├── nginx.conf
│   └── ssl/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
├── frontend/
│   ├── Dockerfile
│   └── src/
└── init-db.sql
```

### Fichier .env.example

Créer un fichier `.env.example` pour documenter les variables requises :

```bash
SECRET_KEY=change_me_in_production
DB_PASSWORD=change_me_in_production
FLASK_ENV=development
DEBUG=true
```

### Séparation des Configurations

Pour différencier les environnements, utiliser plusieurs fichiers compose :

```bash
# Développement
docker-compose -f docker-compose.yml up

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Où `docker-compose.prod.yml` contient les surcharges de configuration :

```yaml
version: '3.8'

services:
  backend:
    restart: always
    environment:
      - DEBUG=false
      - FLASK_ENV=production

  db:
    volumes:
      - postgres-data:/var/lib/postgresql/data
```

### Health Checks

Les vérifications de santé permettent à Docker Compose de vérifier que les services sont opérationnels :

```yaml
services:
  api:
    image: myapi:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Limitation des Ressources

Contrôler la consommation de ressources :

```yaml
services:
  worker:
    image: worker:latest
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Logging

Configurer la sortie des logs pour éviter le débordement d'espace disque :

```yaml
services:
  app:
    image: myapp:latest
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## Synthèse et Parcours d'Apprentissage

Le parcours de maîtrise de Docker Compose suit une progression logique depuis les concepts fondamentaux jusqu'aux déploiements complexes.

**Phase 1 : Fondamentaux** débute par la compréhension de ce qu'est Docker Compose et pourquoi il simplifie la gestion de conteneurs multiples. L'installation et la vérification constituent les premières étapes concrètes.

**Phase 2 : Configuration de Base** implique de apprendre la structure du fichier YAML, les sections essentielles (services, volumes, networks), et comment spécifier les images et les services basiques.

**Phase 3 : Opérations Courantes** enseigne les commandes principales (`up`, `down`, `logs`, `ps`, `exec`) et comment les utiliser pour gérer le cycle de vie des applications.

**Phase 4 : Configuration Avancée** couvre les variables d'environnement, les dépendances, les politiques de redémarrage, et la gestion des ports et volumes. Ces éléments permettent de créer des configurations plus robustes et flexibles.

**Phase 5 : Cas d'Usage Réels** applique tous les concepts précédents à des applications concrètes combinant plusieurs services (web, base de données, cache, workers).

**Phase 6 : Optimisation et Production** aborde les bonnes pratiques, la séparation des environnements, les health checks, et la limitation des ressources pour préparer le déploiement en production.

Chaque phase s'appuie sur la précédente, permettant une montée en compétences progressive et une compréhension profonde de chaque aspect de Docker Compose. Cette approche progressive transforme Docker Compose d'un outil complexe en un instrument maîtrisé pour orchestrer efficacement des applications conteneurisées.
