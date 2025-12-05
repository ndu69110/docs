# Citations
- https://www.cherryservers.com/blog/docker-build-command
- https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/
- https://docs.docker.com/get-started/introduction/build-and-push-first-image/
- https://docs.docker.com/get-started/workshop/02_our_app/
- https://chtc.cs.wisc.edu/uw-research-computing/docker-build
- https://learn.microsoft.com/en-us/dotnet/core/docker/build-container
- https://docs.docker.com/get-started/docker-concepts/building-images/
- https://www.youtube.com/watch?v=DQdB7wFEygo


# Tokens
- prompt_tokens: 297
- completion_tokens: 6665
- total_tokens: 6962
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.1, 'request_cost': 0.006, 'total_cost': 0.107}


# Content
# Créer une image Docker avec un Dockerfile

## Introduction générale

La création d'images Docker est l'une des compétences fondamentales pour maîtriser la conteneurisation. Une image Docker représente un **blueprint immutable** contenant tous les éléments nécessaires pour exécuter une application : le système d'exploitation, les dépendances, le code source et la configuration. Le Dockerfile est le fichier de configuration textuel qui permet de définir comment construire cette image, en suivant une série d'instructions déclaratives qui vont progressivement transformer une image de base en une image prête pour la production[1][2].

Ce chapitre approfondit les mécanismes internes de création d'images, en commençant par les concepts fondamentaux comme `docker commit`, avant de progresser vers les instructions Dockerfile avancées et les meilleures pratiques d'optimisation.

---

## 📦 Fondements : Docker Commit, Logs, Tags et History

### Comprendre Docker Commit

**Docker commit** est la méthode **archaïque mais instructive** de créer une image Docker. Contrairement au Dockerfile qui utilise une approche déclarative, `docker commit` permet de capturer l'état d'un conteneur en cours d'exécution et de le transformer en image[1]. Cette approche, bien que rarement utilisée en production, illustre parfaitement le fonctionnement interne des images.

La syntaxe générale est :

```bash
docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
```

#### Exemple pratique de Docker Commit

Commençons par créer un conteneur interactif et effectuer des modifications :

```bash
# Lancer un conteneur nginx interactif
docker run -it --name webserver nginx:latest /bin/bash

# À l'intérieur du conteneur, modifier l'image de base
apt-get update
apt-get install -y curl wget
echo "Modified Image" > /usr/share/nginx/html/index.html
exit

# Créer une nouvelle image à partir de ce conteneur
docker commit webserver monapp:v1
```

Cette approche crée une image `monapp:v1` qui contient toutes les modifications effectuées dans le conteneur. Cependant, cette méthode présente des **inconvénients majeurs** :

- **Pas de traçabilité** : impossible de savoir exactement quelles commandes ont été exécutées
- **Pas de reproductibilité** : difficile à reproduire sur une autre machine
- **Couches supplémentaires** : chaque commit crée une nouvelle couche, augmentant la taille de l'image
- **Mauvaises pratiques** : encourages les modifications ad hoc plutôt que l'infrastructure as code

### Système de Logs et Historique

La commande `docker logs` permet d'inspecter la **sortie standard et d'erreur** d'un conteneur en cours d'exécution ou stoppé :

```bash
# Voir les logs d'un conteneur
docker logs webserver

# Afficher les 50 dernières lignes
docker logs --tail 50 webserver

# Afficher les logs en temps réel
docker logs -f webserver

# Ajouter les timestamps
docker logs --timestamps webserver
```

L'historique d'une image peut être consulté avec `docker history` :

```bash
docker history monapp:v1
```

Cela affiche **chaque couche de l'image** avec :
- L'ID de la couche
- La commande qui a créé la couche
- La taille de la couche
- Le timestamp de création

### Système de Tags

Les tags permettent de **versionner les images** et de les identifier clairement. Un tag Docker suit le format :

```
[REGISTRY/]REPOSITORY[:TAG]
```

Les composants peuvent être :

| Élément | Description | Exemple |
|---------|-------------|---------|
| **REGISTRY** | Registre Docker (optionnel, défaut: Docker Hub) | docker.io, registry.exemple.fr |
| **REPOSITORY** | Nom de l'image | nginx, monapp |
| **TAG** | Identifiant de version (optionnel, défaut: latest) | v1.0, stable, latest |

#### Opérations sur les Tags

```bash
# Tagger une image existante
docker tag monapp:v1 monapp:latest
docker tag monapp:v1 registry.exemple.fr/monapp:v1

# Lister tous les tags d'une image
docker images monapp

# Supprimer un tag
docker rmi monapp:latest
```

---

## 🎯 Instructions CMD et ENTRYPOINT

Ces deux instructions sont **critiques** car elles définissent le **comportement par défaut** du conteneur au démarrage. Bien qu'elles semblent similaires, leurs différences sont fondamentales.

### Différences fondamentales

**CMD** définit la **commande par défaut** qui sera exécutée si aucune commande n'est spécifiée au lancement du conteneur. Elle peut être **remplacée** en ligne de commande :

```dockerfile
FROM nginx:latest
CMD ["nginx", "-g", "daemon off;"]
```

**ENTRYPOINT** définit la **commande obligatoire** qui s'exécutera toujours, mais peut recevoir des arguments. Elle ne peut être remplacée que avec le flag `--entrypoint` :

```dockerfile
FROM ubuntu:20.04
ENTRYPOINT ["echo"]
CMD ["Hello, World"]
```

### Trois formes syntaxiques

#### Forme Shell (déconseillée)
```dockerfile
CMD nginx -g daemon off;
ENTRYPOINT nginx -g daemon off;
```

Cette forme lance la commande à travers `/bin/sh`, ce qui crée un processus shell supplémentaire et empêche les signaux d'être reçus correctement[2].

#### Forme Exec (recommandée)
```dockerfile
CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["nginx", "-g", "daemon off;"]
```

Cette forme exécute directement le binaire sans shell intermédiaire, permettant aux signaux (comme SIGTERM) d'être reçus correctement.

#### Combinaison ENTRYPOINT + CMD

C'est l'approche **optimale** pour créer des conteneurs flexibles :

```dockerfile
FROM ubuntu:20.04
RUN apt-get update && apt-get install -y curl
ENTRYPOINT ["curl"]
CMD ["https://exemple.fr"]
```

Comportements :
```bash
# Utilise le CMD par défaut
docker run monapp
# Affiche le contenu de https://exemple.fr

# Remplace le CMD
docker run monapp https://autre.fr
# Affiche le contenu de https://autre.fr

# Remplace l'ENTRYPOINT (rare)
docker run --entrypoint echo monapp "bonjour"
# Affiche: bonjour
```

### Cas d'usage pratique

Pour une application d'analyse de logs :

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .

ENTRYPOINT ["python", "app.py"]
CMD ["--help"]
```

- `docker run monapp` : affiche l'aide
- `docker run monapp /var/log/app.log` : analyse le fichier spécifié
- `docker run --entrypoint bash monapp` : lance un shell pour debug

---

## 🏗️ Étapes de la construction d'une image

La construction d'une image Docker suit un processus structuré et méthodique[1][2]. Comprendre ces étapes permet d'optimiser les images et de dépanner les problèmes de construction.

### Phase 1 : Préparation

Avant que Docker n'exécute la première instruction, il effectue plusieurs opérations préliminaires :

1. **Validation du Dockerfile** : Docker vérifie la syntaxe et la validité du fichier
2. **Détermination du contexte de construction** : l'ensemble des fichiers accessible pour les instructions `COPY` et `ADD`
3. **Authentification auprès des registres** : si les images de base sont dans des registres privés
4. **Téléchargement des images de base** : si elles ne sont pas disponibles localement

### Phase 2 : Exécution des instructions

Chaque instruction du Dockerfile crée une **couche immuable** :

```dockerfile
FROM ubuntu:20.04              # Couche 1 : image de base
RUN apt-get update             # Couche 2 : modifications système
RUN apt-get install -y curl    # Couche 3 : installation de curl
COPY app.py /app/              # Couche 4 : copie du code
WORKDIR /app                   # Couche 5 : changement de répertoire
CMD ["python", "app.py"]       # Couche 6 : configuration (pas de nouvelle couche)
```

À chaque étape, Docker :
1. Lance un conteneur temporaire à partir de la couche précédente
2. Exécute l'instruction
3. Crée une nouvelle couche immuable avec un ID unique
4. Arrête le conteneur temporaire

### Phase 3 : Système de cache

Docker **mémorise chaque couche** pour accélérer les reconstructions ultérieures. L'algorithme fonctionne ainsi :

```
Si la couche N a déjà été construite précédemment
  ➜ Utiliser le cache
Sinon
  ➜ Construire la couche et l'ajouter au cache
```

**Invalidation du cache** : si une instruction change ou si les fichiers copiés changent, toutes les couches suivantes sont reconstruites.

#### Exemple d'optimisation du cache

❌ **Mauvais** : le cache est invalidé à chaque changement de code

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .                    # Copie tout, y compris node_modules
RUN npm install
CMD ["npm", "start"]
```

✅ **Bon** : le cache est préservé tant que les dépendances ne changent pas

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./       # Copie uniquement les manifests
RUN npm install
COPY . .                    # Copie le reste
CMD ["npm", "start"]
```

Avec cette structure :
- Si seul `app.js` change : seule la dernière couche `COPY` est reconstruite (rapide)
- Si `package.json` change : `npm install` et les couches suivantes sont reconstruites

### Phase 4 : Finalisation

Une fois toutes les instructions exécutées :

1. **Création de l'image finale** : fusion de toutes les couches en une seule image
2. **Assignation des métadonnées** : tags, labels, configuration
3. **Stockage en local** : l'image est enregistrée dans `/var/lib/docker/`

---

## 📋 Instructions FROM, WORKDIR, RUN, COPY et ADD

Ces instructions forment l'**ossature** de tout Dockerfile. Elles sont présentes dans presque toutes les images.

### Instruction FROM

**FROM** initialise une nouvelle **étape de construction** et définit l'image de base[1][2]. C'est la **première instruction obligatoire** de tout Dockerfile (sauf en cas de multi-stage sans étape précédente).

```dockerfile
FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
```

Exemples :

```dockerfile
# Image Linux minimale basée sur Alpine (≈ 5 MB)
FROM alpine:3.19

# Image Node.js complète (≈ 900 MB)
FROM node:22

# Image .NET sur Ubuntu
FROM mcr.microsoft.com/dotnet/runtime:8.0-ubuntu-22.04

# Image multi-architecture
FROM --platform=linux/amd64 ubuntu:22.04

# Nommage d'étape pour multi-stage
FROM ubuntu:22.04 AS builder
```

#### Considérations lors du choix d'une image de base

| Critère | Lightweight (Alpine) | Full-Featured (Ubuntu) | Specialized (Python) |
|---------|----------------------|------------------------|----------------------|
| Taille | 5-15 MB | 50-150 MB | 300-500 MB |
| Vitesse de démarrage | Très rapide | Rapide | Rapide |
| Disponibilité des packages | Limitée | Complète | Complète |
| Stabilité | Excellente | Excellente | Très bonne |
| Cas d'usage idéal | Microservices, Edge | Outils génériques | Applications Python |

### Instruction WORKDIR

**WORKDIR** définit le **répertoire de travail** pour toutes les instructions suivantes (`RUN`, `COPY`, `ADD`, `CMD`, `ENTRYPOINT`)[2].

```dockerfile
WORKDIR <chemin>
```

```dockerfile
FROM ubuntu:22.04

WORKDIR /app
# Équivalent à: cd /app

COPY application.py .
# Copie dans /app/application.py (non /application.py)

RUN chmod +x application.py
# Exécute dans le contexte de /app

CMD ["./application.py"]
# Lance depuis /app
```

**Avantages de WORKDIR** :

- Meilleure **lisibilité** du Dockerfile
- **Isolation** des fichiers de l'application
- Évite les chemins absolus complexes
- Peut être changé plusieurs fois pour organiser logiquement les étapes

```dockerfile
FROM ubuntu:22.04

WORKDIR /src
COPY . .
RUN ./build.sh

WORKDIR /app
COPY --from=builder /src/output ./
CMD ["./app"]
```

### Instruction RUN

**RUN** exécute une **commande** dans le conteneur et **enregistre les modifications** dans une nouvelle couche[1][2].

```dockerfile
RUN <commande>              # Forme shell
RUN ["exécutable", "param1", "param2"]  # Forme exec
```

```dockerfile
FROM ubuntu:22.04

# Forme shell
RUN apt-get update && apt-get install -y curl wget

# Forme exec
RUN ["apt-get", "install", "-y", "curl"]

# Commandes multiples (combinaison recommandée)
RUN apt-get update && \
    apt-get install -y \
        curl \
        wget \
        git \
    && rm -rf /var/lib/apt/lists/*
```

#### Optimisation des instructions RUN

```dockerfile
# ❌ Mauvais : 3 couches créées, cache invalidable à chaque étape
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y wget

# ✅ Bon : 1 couche créée, cache plus stable
RUN apt-get update && \
    apt-get install -y \
        curl \
        wget && \
    rm -rf /var/lib/apt/lists/*
```

Le nettoyage de `/var/lib/apt/lists/` est **crucial** car elle contient les métadonnées de packages et occupe des centaines de MB.

### Instruction COPY

**COPY** transfère des **fichiers et répertoires** de la machine hôte vers le conteneur[1][2]. Contrairement à `ADD`, elle n'effectue **aucun traitement**.

```dockerfile
COPY [--chown=<user>:<group>] <src> <dest>
```

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copier un fichier unique
COPY package.json .

# Copier plusieurs fichiers avec glob
COPY src/*.js ./src/
COPY config.* ./

# Copier un répertoire entier
COPY . .

# Copier avec changement de propriétaire
COPY --chown=node:node app.js /app/
```

#### Utilisation avancée de COPY

```dockerfile
FROM ubuntu:22.04 AS builder

WORKDIR /build
COPY . .
RUN ./build.sh

# Nouvelle étape : copier uniquement les artefacts nécessaires
FROM ubuntu:22.04

COPY --from=builder /build/dist /app/

# Résultat : image finale sans code source ou dépendances de build
```

### Instruction ADD

**ADD** est similaire à `COPY` mais effectue des **opérations supplémentaires** :

```dockerfile
ADD [--chown=<user>:<group>] <src> <dest>
```

Capacités spéciales :
- Décompresse automatiquement les archives (`.tar`, `.tar.gz`, `.zip`)
- Télécharge des ressources à partir d'URLs

```dockerfile
FROM ubuntu:22.04

# Télécharger et extraire une archive
ADD https://github.com/projet/archive/v1.0.tar.gz /tmp/

# Extraire une archive locale
ADD app.tar.gz /app/
```

**Recommandations** :

- Préférer `COPY` pour la plupart des cas
- Utiliser `ADD` uniquement si la décompression automatique est bénéfique
- Éviter les URLs remotes, privilégier les ressources locales ou pré-téléchargées pour la reproductibilité

---

## 📖 Introduction au Dockerfile

### Anatomie générale d'un Dockerfile

Un Dockerfile suit une **structure logique** qui optimise le cache et la maintenabilité :

```dockerfile
# 1. Étape de base
FROM ubuntu:22.04

# 2. Métadonnées
LABEL maintainer="equipe@exemple.fr" \
      version="1.0" \
      description="Application web exemple"

# 3. Variables d'environnement
ENV NODE_ENV=production \
    PORT=3000

# 4. Installation des dépendances système
RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*

# 5. Configuration de l'utilisateur (sécurité)
RUN useradd -m -u 1000 appuser

# 6. Répertoire de travail
WORKDIR /app

# 7. Copie du code (après les modifications de base)
COPY package*.json ./
RUN npm install --production

# 8. Copie du code source
COPY . .

# 9. Changement de propriété
RUN chown -R appuser:appuser /app

# 10. Changement d'utilisateur (sécurité)
USER appuser

# 11. Exposition de ports
EXPOSE 3000

# 12. Point d'entrée
ENTRYPOINT ["node"]
CMD ["server.js"]
```

### Structure multi-étapes

Les builds multi-étapes permettent de **réduire drastiquement** la taille finale :

```dockerfile
# Étape 1: Build
FROM golang:1.21 AS builder

WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o app

# Étape 2: Runtime (image finale)
FROM alpine:3.19

COPY --from=builder /src/app /app/
ENTRYPOINT ["/app"]
```

Résultat : l'image finale contient uniquement le binaire compilé (~10 MB), sans toutes les dépendances de build (Go SDK, sources, etc.).

### Fichier .dockerignore

Optimise le contexte de construction en **excluant les fichiers inutiles** :

```
# .dockerignore
.git
.gitignore
node_modules
npm-debug.log
.env
.vscode
.DS_Store
*.md
dist/
build/
```

Cela **réduit significativement** la taille du contexte transmis au daemon Docker.

---

## 🏷️ Instructions ARG, ENV, LABEL et commande Inspect

Ces instructions gèrent les **métadonnées** et la **configuration** de l'image et des conteneurs.

### Instruction ARG

**ARG** définit les **variables de construction** qui ne sont disponibles que durant la **création de l'image** (pas dans les conteneurs en exécution)[2].

```dockerfile
ARG <nom>=<valeur_par_défaut>
```

```dockerfile
FROM ubuntu:22.04

ARG VERSION=1.0
ARG BUILD_DATE

RUN echo "Version: $VERSION"
RUN echo "Date de build: $BUILD_DATE"

# ARG n'existe plus à l'exécution
RUN echo $VERSION  # Affiche vide si pas fourni
```

#### Utilisation lors du build

```bash
# Utiliser les valeurs par défaut
docker build -t monapp .

# Surcharger les variables
docker build -t monapp:2.0 \
    --build-arg VERSION=2.0 \
    --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
    .
```

### Instruction ENV

**ENV** définit les **variables d'environnement** disponibles à la fois durant le build **et dans les conteneurs** en exécution[2].

```dockerfile
ENV <clé>=<valeur>
ENV <clé> <valeur>
```

```dockerfile
FROM ubuntu:22.04

ENV NODE_ENV=production
ENV PORT 3000
ENV DATABASE_URL=postgresql://localhost/mydb

# Les variables ENV héritent des valeurs précédentes
ENV PATH="/app/bin:$PATH"
```

#### Comparaison ARG vs ENV

| Aspect | ARG | ENV |
|--------|-----|-----|
| **Disponible au build** | ✅ Oui | ✅ Oui |
| **Disponible au runtime** | ❌ Non | ✅ Oui |
| **Dans l'image** | ❌ Non | ✅ Oui |
| **Cas d'usage** | Tokens, URLs de ressources | Configuration, chemins |
| **Modifiable au runtime** | N/A | ✅ Via `-e` |

### Instruction LABEL

**LABEL** ajoute des **métadonnées** à l'image pour faciliter l'organisation et la recherche[2].

```dockerfile
LABEL <clé>=<valeur> <clé>=<valeur> ...
```

```dockerfile
FROM ubuntu:22.04

LABEL maintainer="equipe@exemple.fr"
LABEL version="1.0.0"
LABEL description="Application web de gestion de projets"
LABEL org.opencontainers.image.source="https://github.com/exemple/app"
LABEL org.opencontainers.image.documentation="https://docs.exemple.fr"
```

#### Conventions standardisées

Il existe des conventions officielles (OCI Image Spec) :

```dockerfile
LABEL org.opencontainers.image.authors="equipe@exemple.fr"
LABEL org.opencontainers.image.created="2025-01-15T10:30:00Z"
LABEL org.opencontainers.image.description="Application de gestion"
LABEL org.opencontainers.image.documentation="https://docs.exemple.fr"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.revision="abc123def456"
LABEL org.opencontainers.image.source="https://github.com/exemple/app"
LABEL org.opencontainers.image.title="App Manager"
LABEL org.opencontainers.image.url="https://exemple.fr"
LABEL org.opencontainers.image.vendor="Exemple Inc"
LABEL org.opencontainers.image.version="1.0.0"
```

### Commande Docker Inspect

**docker inspect** affiche les **informations détaillées** sur une image ou un conteneur, y compris tous les labels, variables d'environnement et autres métadonnées.

```bash
docker inspect <image|conteneur>
```

#### Inspection d'une image

```bash
# Afficher toutes les informations en JSON
docker inspect monapp:1.0

# Extraire des champs spécifiques
docker inspect --format='{{.Config.Env}}' monapp:1.0
docker inspect --format='{{.Config.Labels}}' monapp:1.0
docker inspect --format='{{.Config.Cmd}}' monapp:1.0
docker inspect --format='{{.RootFS.Layers}}' monapp:1.0
```

Exemple de sortie structurée :

```json
{
  "Id": "sha256:abc123...",
  "RepoTags": ["monapp:1.0"],
  "Config": {
    "Env": [
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin",
      "NODE_ENV=production",
      "PORT=3000"
    ],
    "Labels": {
      "maintainer": "equipe@exemple.fr",
      "version": "1.0.0"
    },
    "Cmd": ["node", "server.js"],
    "Entrypoint": null,
    "WorkingDir": "/app"
  },
  "RootFS": {
    "Type": "layers",
    "Layers": [
      "sha256:layer1...",
      "sha256:layer2...",
      "sha256:layer3..."
    ]
  }
}
```

#### Inspection d'un conteneur en exécution

```bash
# Afficher toutes les informations
docker inspect webserver

# Format humain pour les variables d'environnement
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' webserver

# Afficher les ports mappés
docker inspect --format='{{json .NetworkSettings.Ports}}' webserver
```

---

## 🔧 Exemple complet : Application Node.js

Pour intégrer tous les concepts, voici un exemple de Dockerfile production-ready :

```dockerfile
# Multi-étape : build
FROM node:22-alpine AS builder

WORKDIR /src

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Copier les manifests
COPY package*.json ./

# Installer les dépendances (y compris devDependencies pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Build si nécessaire (TypeScript, bundling, etc.)
RUN npm run build

# Multi-étape : runtime
FROM node:22-alpine

# Métadonnées
LABEL maintainer="equipe@exemple.fr" \
      version="1.0.0" \
      description="API Node.js"

# Variables d'environnement
ENV NODE_ENV=production \
    PORT=3000

# Installation des dépendances de runtime uniquement
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier l'application buildée
COPY --from=builder /src/dist ./dist

# Sécurité : utiliser un utilisateur non-root
RUN addgroup -g 1000 node && \
    adduser -D -u 1000 -G node node

USER node

# Configuration des ports
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Point d'entrée
ENTRYPOINT ["node"]
CMD ["dist/server.js"]
```

**Points clés** :
- Deux étapes : build isolé, runtime minimal
- ARG pour les variables de build
- ENV pour la configuration runtime
- Utilisateur non-root pour la sécurité
- LABEL pour les métadonnées
- HEALTHCHECK pour la supervision

---

## 📊 Optimisations et meilleures pratiques

### Réduction de la taille d'image

```dockerfile
# ❌ 450 MB
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip install requests beautifulsoup4
COPY app.py .
CMD ["python3", "app.py"]

# ✅ 180 MB
FROM python:3.11-slim
RUN pip install --no-cache-dir requests beautifulsoup4
COPY app.py /app/
WORKDIR /app
CMD ["python3", "app.py"]

# ✅✅ 60 MB (avec dépendances uniquement)
FROM python:3.11-alpine
RUN pip install --no-cache-dir requests beautifulsoup4
COPY app.py /app/
WORKDIR /app
CMD ["python3", "app.py"]
```

### Optimisation du cache de construction

```dockerfile
# Placer les dépendances statiques en premier
COPY package*.json ./
RUN npm ci --only=production

# Puis le code fréquemment modifié
COPY . .
```

Cela garantit que les dépendances ne sont réinstallées que si `package.json` change.

### Sécurité des images

```dockerfile
FROM alpine:3.19

# Créer un utilisateur non-root
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

WORKDIR /app
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 8080
CMD ["./app"]
```

---

## Conclusion

La maîtrise de la création d'images Docker passe par la compréhension profonde des concepts suivants :

1. **Architecture en couches** : chaque instruction crée une couche immuable
2. **Système de cache** : optimiser l'ordre des instructions pour bénéficier du cache
3. **Métadonnées** : utiliser ARG, ENV, LABEL pour documenter et configurer
4. **Multi-étapes** : séparer la phase de build de la phase runtime
5. **Sécurité** : utiliser des utilisateurs non-root et minimiser les couches
6. **Maintenabilité** : suivre les conventions et documenter avec des labels

Ces pratiques permettent de créer des images Docker efficaces, reproductibles et sécurisées pour les environnements de production.
