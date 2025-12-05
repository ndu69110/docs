# Citations
- https://tutoriels.lws.fr/vps/configurer-une-ci-cd-avec-gitlab-auto-heberge-lws
- https://docs.gitlab.com/ci/runners/configure_runners/
- https://cours.brosseau.ovh/tp/ci/gitlab/runner.html
- https://www.misesurorbite.fr/aide/aide-gitlab/configurer-un-runner-dans-votre-gitlab/
- https://blog.stephane-robert.info/docs/services/devops/gitlab/runner/
- https://docs.gitlab.com/runner/configuration/
- https://www.youtube.com/watch?v=kMbXxoLriwo
- https://rdr-it.com/gitlab-ci-cd-comment-installer-et-utiliser-un-runner/
- https://docs.gitlab.com/runner/
- https://blent.ai/blog/a/gitlab-cicd-tout-savoir


# Tokens
- prompt_tokens: 286
- completion_tokens: 7058
- total_tokens: 7344
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.106, 'request_cost': 0.006, 'total_cost': 0.113}


# Content
# Chapitre 7 : Configurer ses runners avec Gitlab CI/CD

## Introduction aux Runners GitLab

Un runner GitLab est un agent logiciel qui exécute les jobs définis dans le fichier `.gitlab-ci.yml`[1][9]. Il s'agit d'un composant essentiel de l'infrastructure CI/CD, permettant d'automatiser les tâches de tests, de compilation et de déploiement du code. Lorsqu'un développeur pousse du code sur GitLab, les pipelines CI/CD se déclenchent automatiquement et les runners exécutent les jobs correspondants[9].

Les runners sont au cœur de l'automatisation, car ils transforment les définitions de pipeline en actions concrètes. Sans runner, les pipelines CI/CD ne pourraient pas fonctionner. La configuration des runners détermine également la flexibilité et les capacités du système CI/CD global.

---

## 1. Installer GitLab Runner

### Prérequis et préparation

Avant d'installer GitLab Runner, il est nécessaire de disposer de plusieurs éléments[1] :

- **Une connexion Internet stable** pour que le runner puisse communiquer avec l'instance GitLab
- **Un projet actif** sur GitLab (privé ou public)
- **Les droits Maintainer** sur le projet pour pouvoir configurer la CI/CD
- **Des connaissances basiques** en YAML, Bash ou Docker pour personnaliser les pipelines
- **Une machine ou un serveur** sur lequel installer le runner (VPS, machine locale, etc.)

### Processus d'installation

#### Étape 1 : Connexion au serveur

La première étape consiste à se connecter au serveur ou VPS où sera installé le runner[1] :

```bash
ssh root@votre-ip
```

#### Étape 2 : Téléchargement et installation du GitLab Runner

Pour installer GitLab Runner sur une machine Debian/Ubuntu, les commandes suivantes doivent être exécutées[1] :

```bash
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | bash
apt install gitlab-runner
```

Ces commandes téléchargent le script d'installation officiel depuis les dépôts GitLab et installe le package `gitlab-runner` avec toutes ses dépendances.

### Enregistrement du runner

#### Lancement de l'enregistrement

Une fois GitLab Runner installé, il faut l'enregistrer auprès de l'instance GitLab[1] :

```bash
gitlab-runner register
```

#### Questions interactives lors de l'enregistrement

Le processus d'enregistrement pose plusieurs questions cruciales[1] :

| Question | Description | Exemple |
|----------|-------------|---------|
| **URL de GitLab** | L'adresse de l'instance GitLab | `https://gitlab.example.com` |
| **Jeton du runner** | Disponible dans GitLab > Admin > Runners | Token fourni par GitLab |
| **Description** | Nom ou description du runner | `Docker Runner Production` |
| **Tags** | Étiquettes pour identifier le runner | `docker`, `production`, `python` |
| **Type d'exécution** | Executor à utiliser | `docker` ou `shell` |
| **Image par défaut** | Image Docker si executor Docker est choisi | `python:3.10` |

#### Obtention du jeton du runner

Le jeton d'enregistrement est disponible dans l'interface d'administration de GitLab[1][4] :

- Se connecter en tant qu'**administrateur** sur GitLab
- Accéder à la section **Administration**
- Naviguer vers **CI/CD › Runners**
- Cliquer sur **"Nouvel exécuteur d'instance"** ou **"Create instance runner"**
- Le jeton apparaît dans la page de création

### Vérification post-installation

Après l'installation et la configuration, il est important de vérifier que le runner est correctement enregistré et opérationnel[5]. Cette vérification s'effectue en accédant à la section "CI/CD" du projet GitLab, puis en consultant la liste des runners disponibles. Si tout est correct, le runner nouvellement enregistré devrait apparaître dans cette liste, marqué comme étant prêt à exécuter les jobs[5].

### Configuration avancée

GitLab Runner peut être configuré de manière très détaillée grâce au fichier `config.toml`[6]. Ce fichier de configuration permet de personnaliser[6] :

- Les paramètres GPU (Graphics Processing Units) pour l'exécution de jobs
- Le système d'initialisation (basé sur le système d'exploitation)
- Les shells supportés pour générer les scripts de compilation
- Les considérations de sécurité lors de l'exécution des jobs

---

## 2. Création d'un serveur VPS

### Qu'est-ce qu'un VPS ?

Un VPS (Virtual Private Server) est un serveur virtuel dédié qui offre les ressources et l'isolation nécessaires pour exécuter GitLab Runner de manière fiable[1]. Contrairement à une machine locale, un VPS disponible 24/7 assure que les pipelines CI/CD s'exécutent continuellement sans interruption.

### Déploiement sur un VPS

#### Avantages du VPS pour GitLab Runner

- **Disponibilité continue** : Le VPS reste actif 24/7, contrairement à une machine locale
- **Ressources dédiées** : Les ressources sont réservées à l'exécution des jobs CI/CD
- **Isolation de l'environnement** : Le VPS ne partage pas les ressources avec d'autres services
- **Scalabilité** : Possibilité d'ajouter plusieurs runners sur différents VPS
- **Performance stable** : Les performances ne sont pas affectées par d'autres processus

#### Installation sur un VPS

L'installation sur un VPS suit exactement le même processus qu'une machine locale. Les étapes sont identiques[1] :

1. Connexion SSH au VPS
2. Installation du package GitLab Runner
3. Enregistrement du runner auprès de GitLab
4. Vérification du statut

#### Considérations de sécurité

Lors du déploiement sur un VPS, plusieurs aspects sécuritaires doivent être pris en compte[1][6] :

- **Pare-feu** : Configurer les règles de pare-feu pour autoriser la communication GitLab ↔ Runner
- **Certificats SSL** : Utiliser HTTPS pour la communication sécurisée
- **Accès SSH** : Limiter l'accès SSH à des adresses IP spécifiques
- **Permissions** : Assurer que GitLab Runner s'exécute avec les permissions minimales nécessaires

### Configuration d'un runner Docker sur VPS

#### Installation de Docker

Pour utiliser un executor Docker sur le VPS, Docker doit d'abord être installé et actif[1] :

```bash
# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Démarrage du service Docker
systemctl start docker
systemctl enable docker

# Vérification de l'installation
docker --version
```

#### Configuration du runner avec executor Docker

Une fois Docker installé, lors de l'enregistrement du runner, sélectionner `docker` comme type d'exécution[1] :

```bash
gitlab-runner register
# ...répondre aux questions...
# Type d'exécution : docker
# Image par défaut : python:3.10  (ou l'image appropriée)
```

#### Exemple de runner Docker configuré

Après l'enregistrement, le fichier `/etc/gitlab-runner/config.toml` contient la configuration du runner[6] :

```toml
[[runners]]
  name = "Docker Runner VPS"
  url = "https://gitlab.example.com"
  token = "runner_token_xxxxx"
  executor = "docker"
  
  [runners.docker]
    image = "python:3.10"
    privileged = false
    disable_cache = false
    volumes = ["/cache"]
```

---

## 3. Introduction aux runners auto-gérés

### Concept des runners auto-gérés

Les runners auto-gérés (ou self-hosted runners) sont des runners déployés et gérés par l'organisation plutôt que par GitLab[1]. Ils offrent une flexibilité complète concernant l'environnement d'exécution, les ressources matérielles et les configurations logicielles.

### Différences avec les runners partagés

| Aspect | Runners partagés | Runners auto-gérés |
|--------|------------------|-------------------|
| **Gestion** | GitLab gère l'infrastructure | L'organisation gère l'infrastructure |
| **Disponibilité** | Partagés entre plusieurs utilisateurs | Dédiés à des projets spécifiques |
| **Coûts** | Gratuit ou payant selon le plan | Coûts de serveur/matériel à supporter |
| **Contrôle** | Limité aux configurations GitLab | Contrôle total de l'environnement |
| **Performance** | Variable selon la charge partagée | Stable et prévisible |
| **Personnalisation** | Peu flexible | Très flexible |

### Architecture des runners auto-gérés

Un runner auto-géré communique directement avec l'instance GitLab via une connexion HTTP(S). Voici le flux d'exécution typique[1] :

```
GitLab Instance
    ↓
Crée un job dans le pipeline
    ↓
Envoie la définition du job au runner
    ↓
Runner reçoit le job
    ↓
Runner exécute les instructions dans l'executor approprié
    ↓
Runner renvoie les résultats et logs à GitLab
    ↓
GitLab affiche les résultats dans l'interface
```

### Enregistrement d'un runner auto-géré

Le processus d'enregistrement établit la relation de confiance entre GitLab et le runner[1] :

```bash
gitlab-runner register \
  --url https://gitlab.example.com \
  --registration-token glrt_xxxxxxxxxxxxx \
  --executor docker \
  --description "Mon runner auto-géré" \
  --tag-list "docker,production" \
  --docker-image python:3.10
```

Chaque paramètre a une signification précise[1] :

- `--url` : L'adresse de l'instance GitLab
- `--registration-token` : Le jeton d'enregistrement obtenu depuis GitLab
- `--executor` : Le type d'executor (docker, shell, kubernetes, etc.)
- `--description` : Une description identifiable du runner
- `--tag-list` : Les tags permettant de sélectionner ce runner
- `--docker-image` : L'image Docker par défaut (si executor Docker)

### Gestion du cycle de vie des runners auto-gérés

#### Démarrage du runner

Une fois enregistré, le runner doit être démarré comme service[1] :

```bash
# Démarrage du runner
gitlab-runner start

# Vérification du statut
gitlab-runner status

# Redémarrage du runner
gitlab-runner restart
```

#### Arrêt et suppression

Pour arrêter ou supprimer un runner[1] :

```bash
# Arrêt du runner
gitlab-runner stop

# Unregister (désenregistrement) du runner
gitlab-runner unregister --name "Mon runner auto-géré"
```

### Avantages des runners auto-gérés

- **Flexibilité maximale** : Installation de n'importe quelle dépendance système requise
- **Confidentialité** : Les données sensibles restent dans l'infrastructure interne
- **Performance optimisée** : Configuration adaptée aux besoins spécifiques du projet
- **Intégration personnalisée** : Intégration avec des systèmes internes propriétaires
- **Coûts maîtrisés** : Infrastructure existante réutilisée

---

## 4. Utilisation des tags

### Concept des tags dans GitLab CI/CD

Les tags constituent un mécanisme puissant pour contrôler quels runners exécutent quels jobs[2]. Un tag est une étiquette qui identifie les capacités ou la destination d'un runner. Les jobs demandent des tags spécifiques, et seuls les runners possédant ces tags peuvent exécuter le job[2].

### Différence entre tags Git et tags CI/CD

Il est important de ne pas confondre les deux types de tags[2] :

| Type | Utilisation | Exemple |
|------|-------------|---------|
| **Tags Git** | Marquent des commits spécifiques | `v1.0.0`, `release-2023` |
| **Tags CI/CD** | Sélectionnent les runners pour les jobs | `docker`, `production`, `gpu` |

Les tags GitLab CI/CD sont associés à des runners, tandis que les tags Git sont associés à des commits.

### Attribution de tags aux runners

#### Lors de l'enregistrement

Les tags peuvent être assignés lors de l'enregistrement du runner[1] :

```bash
gitlab-runner register \
  --url https://gitlab.example.com \
  --registration-token glrt_xxxxxxxxxxxxx \
  --executor docker \
  --tag-list "docker,python,backend,production"
```

#### Via l'interface d'administration

Pour modifier les tags d'un runner existant, accéder à l'interface d'administration[2] :

- Accéder à **Admin** (bas de la barre latérale gauche)
- Sélectionner **CI/CD › Runners**
- Cliquer sur le bouton **Edit** (✎) à droite du runner
- Modifier le champ des tags
- Cliquer sur **Save changes**

### Utilisation des tags dans les pipelines

#### Spécification des tags dans le fichier `.gitlab-ci.yml`

Les jobs déclarent les tags requis pour leur exécution[2] :

```yaml
stages:
  - test
  - build
  - deploy

# Job s'exécutant sur n'importe quel runner avec le tag "docker"
test_python:
  stage: test
  tags:
    - docker
    - python
  script:
    - python -m pytest tests/
    - python -m coverage report

# Job s'exécutant sur un runner "production"
deploy_production:
  stage: deploy
  tags:
    - production
    - high-performance
  script:
    - ./deploy.sh production
  only:
    - main

# Job s'exécutant sur un runner avec GPU
ml_training:
  stage: build
  tags:
    - gpu
    - tensorflow
  script:
    - python train_model.py --gpu
```

### Cas d'usage des tags

#### 1. Séparation par environnement

Les tags permettent de séparer les exécutions selon l'environnement[2] :

```yaml
deploy_staging:
  stage: deploy
  tags:
    - staging
  script:
    - ./deploy.sh staging
  only:
    - develop

deploy_production:
  stage: deploy
  tags:
    - production
  script:
    - ./deploy.sh production
  only:
    - main
```

#### 2. Séparation par technologies

Les runners peuvent être tagués selon les technologies qu'ils supportent[2] :

```yaml
test_backend:
  stage: test
  tags:
    - python
    - docker
  script:
    - pip install -r requirements.txt
    - pytest tests/

test_frontend:
  stage: test
  tags:
    - nodejs
    - docker
  script:
    - npm install
    - npm run test
```

#### 3. Sélection par performance

Les tags permettent de diriger les jobs vers des runners appropriés[2] :

```yaml
quick_test:
  stage: test
  tags:
    - docker
    - standard
  script:
    - pytest tests/ -k "not slow"

full_test:
  stage: test
  tags:
    - docker
    - high-performance
  script:
    - pytest tests/
```

### Variables CI/CD et sélection dynamique de runners

GitLab CI/CD permet d'utiliser des variables pour une sélection dynamique de runners[2] :

```yaml
variables:
  KUBERNETES_RUNNER: kubernetes
  DOCKER_RUNNER: docker

job:
  tags:
    - $DOCKER_RUNNER
    - $KUBERNETES_RUNNER
  script:
    - echo "Exécution sur un runner sélectionné dynamiquement"
```

Cette approche offre une flexibilité accrue lors de la configuration de pipelines complexes.

### Runners protégés et tags

Pour renforcer la sécurité, un runner peut être marqué comme **protégé**[2]. Les runners protégés ne peuvent exécuter que les jobs des branches protégées :

- Accéder à **Admin** › **CI/CD** › **Runners**
- Cliquer sur **Edit** à droite du runner
- Cocher la case **Protected**
- Cliquer sur **Save changes**

---

## 5. Construire des images dans l'exécuteur Docker

### Comprendre l'exécuteur Docker

L'exécuteur Docker est l'un des types d'executors les plus populaires[1]. Il utilise Docker pour créer un conteneur temporaire pour chaque job, dans lequel les scripts sont exécutés. Cette approche offre une isolation complète et une reproductibilité garantie.

### Avantages de l'exécuteur Docker

- **Isolation complète** : Chaque job s'exécute dans un conteneur distinct
- **Reproductibilité** : Les mêmes images produisent les mêmes résultats
- **Dépendances maîtrisées** : Les dépendances sont empaquetées dans l'image
- **Scalabilité** : Plusieurs conteneurs peuvent s'exécuter en parallèle
- **Flexibilité** : Support de toute image Docker disponible

### Configuration de Docker pour GitLab Runner

#### Installation et initialisation

Pour utiliser l'exécuteur Docker, il doit être installé et le runner enregistré avec l'executor Docker[1] :

```bash
# Docker doit être installé et actif
docker --version

# Enregistrement du runner avec executor Docker
gitlab-runner register \
  --url https://gitlab.example.com \
  --registration-token glrt_xxxxxxxxxxxxx \
  --executor docker \
  --docker-image python:3.10
```

#### Configuration avancée du runner Docker

Le fichier `/etc/gitlab-runner/config.toml` permet de configurer Docker en détail[6] :

```toml
[[runners]]
  name = "Docker Runner Avancé"
  url = "https://gitlab.example.com"
  token = "runner_token_xxxxx"
  executor = "docker"
  
  [runners.docker]
    image = "python:3.10"
    privileged = true  # Permet l'utilisation de Docker-in-Docker
    disable_cache = false
    volumes = ["/cache", "/var/run/docker.sock:/var/run/docker.sock"]
    allowed_images = ["python:*", "nodejs:*", "golang:*"]
    dns = ["8.8.8.8"]
    network_mode = "bridge"
```

### Création d'images Docker dans les pipelines

#### Pipeline simple de construction d'image Docker

Un pipeline classique pour construire une image Docker[1] :

```yaml
stages:
  - build
  - test
  - push

variables:
  DOCKER_IMAGE_NAME: myapp
  DOCKER_REGISTRY: docker.io
  DOCKER_IMAGE_TAG: $CI_COMMIT_SHA

build_docker_image:
  stage: build
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG .
    - docker save $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG > image.tar
  artifacts:
    paths:
      - image.tar
    expire_in: 1 hour
```

#### Docker-in-Docker (DinD)

Pour construire des images Docker à l'intérieur de jobs GitLab CI/CD, le mode Docker-in-Docker (DinD) est utilisé[1]. Cela nécessite l'accès à la socket Docker :

```yaml
build_and_push_image:
  stage: build
  tags:
    - docker
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:latest
  after_script:
    - docker logout $CI_REGISTRY
```

### Création d'un Dockerfile optimisé

#### Structure de base

Un Dockerfile pour un projet Python typique[1] :

```dockerfile
# Stage 1 : Construction
FROM python:3.10-slim as builder

WORKDIR /build

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2 : Runtime
FROM python:3.10-slim

WORKDIR /app

# Copier les dépendances du stage précédent
COPY --from=builder /root/.local /root/.local

# Copier le code source
COPY . .

# Définir les variables d'environnement
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1

# Commande par défaut
CMD ["python", "app.py"]
```

#### Dockerfile multistage

Pour réduire la taille des images, utiliser les builds multistages[1] :

```dockerfile
# Stage 1 : Construction et tests
FROM python:3.10 as builder

WORKDIR /build
COPY requirements-dev.txt .
RUN pip install -r requirements-dev.txt

COPY . .
RUN pytest tests/
RUN pylint app/

# Stage 2 : Runtime uniquement
FROM python:3.10-alpine

WORKDIR /app
COPY --from=builder /build /app

RUN pip install --no-cache-dir gunicorn

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

### Pipeline complet de construction et test

#### Exemple pratique d'un projet Python

```yaml
stages:
  - build
  - test
  - push

variables:
  DOCKER_TLS_CERTDIR: ""
  REGISTRY: ghcr.io
  IMAGE_NAME: $REGISTRY/myorg/myapp

build_image:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $IMAGE_NAME:$CI_COMMIT_SHA -t $IMAGE_NAME:latest .
    - docker save $IMAGE_NAME:$CI_COMMIT_SHA > image.tar
  artifacts:
    paths:
      - image.tar
    expire_in: 2 hours
  tags:
    - docker

test_image:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  dependencies:
    - build_image
  script:
    - docker load < image.tar
    - docker run --rm $IMAGE_NAME:$CI_COMMIT_SHA pytest tests/
    - docker run --rm $IMAGE_NAME:$CI_COMMIT_SHA pylint app/
  tags:
    - docker

push_image:
  stage: push
  image: docker:latest
  services:
    - docker:dind
  dependencies:
    - test_image
  before_script:
    - echo "$REGISTRY_PASSWORD" | docker login -u "$REGISTRY_USER" --password-stdin $REGISTRY
  script:
    - docker load < image.tar
    - docker push $IMAGE_NAME:$CI_COMMIT_SHA
    - docker push $IMAGE_NAME:latest
  after_script:
    - docker logout $REGISTRY
  only:
    - main
  tags:
    - docker
```

### Optimisation des images Docker

#### Réduction de la taille

Plusieurs stratégies permettent de réduire la taille des images[1] :

**Utiliser des images de base légères** :

```dockerfile
# À éviter
FROM ubuntu:latest

# Préférer
FROM python:3.10-alpine
```

**Nettoyer les caches** :

```dockerfile
RUN apt-get update && \
    apt-get install -y package1 package2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

**Utiliser les build multistages** :

```dockerfile
FROM python:3.10 as builder
RUN pip install -r requirements.txt

FROM python:3.10-alpine
COPY --from=builder /usr/local /usr/local
```

#### Optimisation de la vitesse de construction

**Mettre en cache les dépendances** :

```dockerfile
FROM python:3.10
WORKDIR /app

# Copier requirements en premier pour profiter du cache
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copier le code ensuite
COPY . .
```

**Ordre des couches** :

Les couches qui changent fréquemment doivent être placées après celles qui changent rarement pour optimiser le caching Docker.

### Variables d'environnement Docker dans GitLab CI/CD

#### Utilisation des variables prédéfinies

GitLab fournit des variables prédéfinies utiles dans l'exécuteur Docker[2] :

| Variable | Description |
|----------|-------------|
| `$CI_COMMIT_SHA` | SHA du commit courant |
| `$CI_COMMIT_REF_SLUG` | Slug du nom de la branche |
| `$CI_REGISTRY_IMAGE` | URL de l'image dans le registre GitLab |
| `$CI_PIPELINE_ID` | ID unique du pipeline |
| `$CI_JOB_ID` | ID unique du job |

#### Exemple d'utilisation

```yaml
build_versioned_image:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build \
        --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
        --build-arg VCS_REF=$CI_COMMIT_SHA \
        --build-arg VERSION=$CI_COMMIT_REF_SLUG \
        -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA \
        .
  tags:
    - docker
```

---

## 6. Configuration du fichier `.gitlab-ci.yml`

### Structure générale du fichier

Le fichier `.gitlab-ci.yml` est le cœur de la CI/CD GitLab[1]. Il doit être placé à la racine du dépôt Git et est écrit en YAML. Ce fichier définit les étapes (stages) à exécuter, les jobs, les environnements et les conditions d'exécution[1].

### Exemple complet de configuration

```yaml
# Variables globales
variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: ""

# Définition des étapes
stages:
  - build
  - test
  - deploy

# Avant tous les jobs
before_script:
  - echo "Début du pipeline"
  - docker --version

# Après tous les jobs
after_script:
  - echo "Fin du pipeline"

# Job de compilation
compile:
  stage: build
  image: python:3.10
  tags:
    - docker
  script:
    - pip install -r requirements.txt
    - python -m py_compile app/
  artifacts:
    paths:
      - app/
    expire_in: 1 hour

# Job de test
test:
  stage: test
  image: python:3.10
  tags:
    - docker
  dependencies:
    - compile
  script:
    - pip install -r requirements-dev.txt
    - pytest tests/ -v --cov=app
  coverage: '/TOTAL.*\s+(\d+%)$/'
  artifacts:
    reports:
      junit: test-results.xml

# Job de déploiement
deploy:
  stage: deploy
  image: alpine:latest
  tags:
    - production
  script:
    - apk add --no-cache openssh-client
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" | base64 -d > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
    - scp -r app/ $DEPLOY_USER@$DEPLOY_HOST:/app/
  only:
    - main
  environment:
    name: production
    url: https://app.example.com
```

---

## 7. Gestion des variables d'environnement

### Variables prédéfinies de GitLab CI/CD

GitLab fournit un large ensemble de variables prédéfinies disponibles dans tous les jobs[2] :

| Variable | Description |
|----------|-------------|
| `$CI_COMMIT_SHA` | SHA du commit complet |
| `$CI_COMMIT_SHORT_SHA` | SHA court du commit (8 caractères) |
| `$CI_COMMIT_REF_NAME` | Nom de la branche ou du tag |
| `$CI_COMMIT_REF_SLUG` | Slugified ref name |
| `$CI_JOB_ID` | ID unique du job |
| `$CI_PIPELINE_ID` | ID unique du pipeline |
| `$CI_PROJECT_NAME` | Nom du projet |
| `$CI_PROJECT_PATH` | Chemin complet du projet |
| `$CI_REGISTRY` | URL du registre Docker |
| `$CI_REGISTRY_IMAGE` | Image du registre Docker |

### Définition de variables personnalisées

```yaml
variables:
  APP_ENV: production
  DATABASE_URL: postgres://db.example.com:5432/app
  API_KEY: $SECURE_API_KEY  # Variable définie dans GitLab

build:
  stage: build
  script:
    - echo "Environment: $APP_ENV"
    - python configure.py --env $APP_ENV
  tags:
    - docker
```

---

## Résumé du chemin d'apprentissage

Ce chapitre couvre les composants essentiels de la configuration des runners GitLab CI/CD :

### 1. **Installation et déploiement** (Sections 1 et 2)

L'apprentissage commence par l'installation pratique de GitLab Runner et le déploiement sur un VPS. Ces étapes fondamentales établissent l'infrastructure nécessaire pour les pipelines automatisés.

### 2. **Architecture et gestion** (Section 3)

La compréhension des runners auto-gérés fournit la base conceptuelle pour maîtriser l'architecture CI/CD. Cette section explique comment les runners fonctionnent indépendamment et se connectent à GitLab.

### 3. **Contrôle et orchestration** (Section 4)

L'utilisation des tags permet de contrôler précisément quels runners exécutent quels jobs. Cette capacité de sélection dynamique est cruciale pour les pipelines complexes et multi-environnements.

### 4. **Pratique avancée** (Section 5)

La construction d'images Docker dans les pipelines représente un cas d'usage avancé combinant plusieurs concepts : runners, executors, tags et pipelines.

### Progression recommandée

1. Commencer par installer GitLab Runner localement ou sur un VPS test
2. Enregistrer un runner avec des tags simples
3. Créer des pipelines utilisant ces tags
4. Progresser vers des images Docker et des pipelines plus complexes
5. Optimiser les performances et la sécurité

Cette approche progressive permet de maîtriser chaque concept individuellement avant de les combiner pour des configurations en production.
