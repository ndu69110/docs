# Citations
- https://mink-agency.com/comment-utiliser-gitlab-ci-cd-pour-ameliorer-votre-flow-de-developpement/
- https://about.gitlab.com/fr-fr/blog/getting-started-with-gitlab-understanding-ci-cd/
- https://code-garage.com/blog/utiliser-gitlab-et-github-pour-construire-son-pipeline-de-ci-cd
- https://galadrim.fr/blog/comment-utiliser-gitlab-ci-cd-pour-ameliorer-votre-flow-de-developpement/
- https://devops.isc.heia-fr.ch/lecture/gitlab-cicd/advanced/
- https://share.gitlab-pages.din.developpement-durable.gouv.fr/devops/formation/competences-livraison-continue/3-build/tp-workflow-git-2.html
- https://blog.stephane-robert.info/docs/pipeline-cicd/gitlab/conditions/
- https://docs.gitlab.com/ci/steps/
- https://cto-externe.fr/actualites-developpement/deploiement-php-gitlab-ci-cd/
- https://blog.antoinemayer.fr/2022/06/21/a-la-decouverte-de-gitlab-ci/


# Tokens
- prompt_tokens: 287
- completion_tokens: 7477
- total_tokens: 7764
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.112, 'request_cost': 0.006, 'total_cost': 0.119}


# Content
# Chapitre 3 : Principales notions GitLab CI/CD

## Les étapes (Stages)

### Définition et concept fondamental

Les stages constituent les briques élémentaires de l'architecture d'une pipeline GitLab CI/CD[1][4]. Un stage représente une phase logique d'exécution au sein du pipeline, regroupant un ensemble de tâches (jobs) qui doivent s'accomplir dans un ordre défini. La structure hiérarchique s'organise ainsi : **pipeline > stages > jobs**.

La puissance des stages réside dans leur exécution **séquentielle et garantie**[4]. Chaque stage ne commence son exécution que lorsque tous les jobs du stage précédent se sont achevés avec succès. En revanche, au sein d'un même stage, les différents jobs s'exécutent **en parallèle par défaut**, ce qui optimise les temps de traitement et les ressources disponibles[4].

### Architecture classique d'une pipeline

Une pipeline CI/CD bien structurée suit généralement ce modèle organisationnel[1][3]:

**Phase d'intégration continue :**
- **Build** : compilation du code source et packaging du logiciel
- **Test** : exécution des tests unitaires, d'intégration et de non-régression
- **Lint** : vérification de la qualité de code et conformité aux standards

**Phase de déploiement continu :**
- **Review** : déploiement de la solution dans un environnement isolé pour validation
- **Staging** : déploiement en environnement de préproduction
- **Production** : déploiement du software dans son environnement final de production

Cette segmentation logique permet à une équipe de développement d'**automatiser le cycle complet** : un simple commit déclenche la pipeline qui génère un build, lance la suite de tests, et déploie la nouvelle version en staging ou production[4].

### Configuration des stages dans `.gitlab-ci.yml`

La définition des stages s'effectue en début de fichier `.gitlab-ci.yml` à la racine du projet. Cette déclaration établit l'ordre d'exécution global de la pipeline :

```yaml
stages:
  - build
  - test
  - deploy
```

La présence du mot-clé `stages` au niveau racine du fichier de configuration structure l'ensemble du workflow[1]. L'ordre listage détermine directement l'ordre d'exécution séquentielle de la pipeline.

### Exemple concret avec trois stages

```yaml
stages:
  - build
  - test
  - deploy

build_job:
  stage: build
  script:
    - echo "Building the application..."
    - npm install
    - npm run build

test_job:
  stage: test
  script:
    - echo "Running tests..."
    - npm run test

deploy_job:
  stage: deploy
  script:
    - echo "Deploying to production..."
    - ./deploy.sh
```

Dans cet exemple[2], la pipeline s'exécute en trois temps distincts :
1. Le stage `build` compile l'application
2. Une fois le build réussi, le stage `test` lance la suite de tests
3. Si tous les tests passent, le stage `deploy` exécute le déploiement

### Stages avec jobs parallèles

Pour optimiser les temps de traitement, plusieurs jobs peuvent s'exécuter au sein d'un même stage[4] :

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build

test_unit:
  stage: test
  script:
    - npm run test:unit

test_integration:
  stage: test
  script:
    - npm run test:integration

test_lint:
  stage: test
  script:
    - npm run lint

deploy:
  stage: deploy
  script:
    - ./deploy.sh
```

Dans cette configuration, les trois jobs du stage `test` (`test_unit`, `test_integration`, `test_lint`) s'exécutent **en parallèle** une fois le stage `build` terminé. Cette parallélisation réduit considérablement le temps total d'exécution de la pipeline.

## Les scripts

### Fondamentaux des scripts

Les scripts constituent le cœur exécutoire des jobs dans GitLab CI/CD[1]. Le mot-clé `script` définit une série de commandes shell qui s'exécutent séquentiellement lorsque le job est déclenché. Les scripts s'exécutent sur le **GitLab Runner** (agent d'exécution) avec les permissions et l'environnement définis par la configuration du runner.

### Structure de base

```yaml
job_name:
  stage: build
  script:
    - command_1
    - command_2
    - command_3
```

Chaque ligne du script s'exécute successivement. Si une commande échoue (code de sortie non-zéro), le job entier est marqué comme échoué par défaut, et les commandes suivantes ne s'exécutent pas[1]. Cette comportement assure l'intégrité du processus de build.

### Exemple concret avec npm

```yaml
build_job:
  stage: build
  script:
    - echo "Building the application..."
    - npm install
    - npm run build
```

L'exécution suit cette séquence :
1. Affichage du message "Building the application..."
2. Installation des dépendances npm
3. Exécution du script build défini dans `package.json`

### Scripts multilignes et variables d'environnement

Les scripts peuvent utiliser les variables d'environnement standard et celles définies dans GitLab[1] :

```yaml
deploy_job:
  stage: deploy
  script:
    - echo "Deploying to $DEPLOY_SERVER"
    - export APP_NAME="my-application"
    - ./scripts/deploy.sh
    - echo "Deployment completed for $APP_NAME"
```

### Gestion des erreurs et continue_on_failure

Par défaut, si une commande échoue, le job s'arrête. Il est possible de modifier ce comportement[4] :

```yaml
test_job:
  stage: test
  script:
    - npm run test
    - npm run lint
    - npm run security-check
  allow_failure: true
```

Le paramètre `allow_failure: true` indique à GitLab que l'échec de ce job ne devrait pas bloquer l'exécution des stages suivants. Le job est marqué comme échoué, mais le pipeline continue.

### Scripts avec conditions et boucles

Les scripts supportent la syntaxe shell complète, incluant structures conditionnelles et boucles[1] :

```yaml
deployment_job:
  stage: deploy
  script:
    - |
      if [ "$CI_COMMIT_BRANCH" == "main" ]; then
        echo "Deploying to production"
        ./deploy.sh production
      elif [ "$CI_COMMIT_BRANCH" == "develop" ]; then
        echo "Deploying to staging"
        ./deploy.sh staging
      else
        echo "No deployment for this branch"
      fi
```

L'utilisation du pipe `|` permet d'écrire des scripts multilignes avec support complet de la syntaxe shell.

### Scripts avec images Docker

```yaml
build_java:
  stage: build
  image: maven:3.8-openjdk-11
  script:
    - mvn clean package

build_node:
  stage: build
  image: node:16
  script:
    - npm install
    - npm run build
```

Chaque job peut spécifier son propre environnement Docker, adaptant les outils disponibles à la nature du travail.

## Les environnements

### Concept d'environnement dans GitLab CI/CD

Les environnements représentent les cibles d'infrastructure vers lesquelles les applications sont déployées[2]. GitLab propose une gestion intégrée des environnements permettant de suivre les déploiements, de maintenir l'historique des versions et de contrôler les approbations manuelles selon l'environnement cible.

### Types d'environnements courants

Une application traverse généralement plusieurs environnements avant d'atteindre les utilisateurs finaux[2] :

- **Développement (development)** : environnement local ou de développement
- **Intégration (integration)** : tests d'intégration continue
- **Préproduction (staging)** : environnement de test proche de la production
- **Production (production)** : environnement accessible aux utilisateurs finaux

### Configuration basique d'un environnement

```yaml
deploy_staging:
  stage: deploy_staging
  script:
    - echo "Deploying to staging..."
  environment:
    name: staging
    url: https://staging.example.com

deploy_production:
  stage: deploy_production
  script:
    - echo "Deploying to production..."
  environment:
    name: production
    url: https://example.com
```

Le bloc `environment` contient :
- **name** : identifiant unique de l'environnement
- **url** : adresse accessible pour vérifier le déploiement

### Déploiement avec approbation manuelle

Pour éviter les déploiements accidentels en production, une approbation manuelle peut être requise[2] :

```yaml
stages:
  - build
  - test
  - deploy_staging
  - deploy_production

build:
  stage: build
  script:
    - npm install
    - npm run build

test:
  stage: test
  script:
    - npm run test

deploy_staging:
  stage: deploy_staging
  script:
    - echo "Deploying to staging..."
  environment:
    name: staging
    url: https://staging.example.com

deploy_production:
  stage: deploy_production
  script:
    - echo "Deploying to production..."
  environment:
    name: production
    url: https://example.com
  when: manual
```

Le paramètre `when: manual`[2] transforme le déploiement en production en action manuelle. Cette approbation explicite prévient les déploiements accidentels sur l'environnement critique.

### Suivi de l'historique des déploiements

GitLab maintient automatiquement un historique complet des déploiements vers chaque environnement. Cet historique affiche[2] :
- Date et heure du déploiement
- Branche ou tag d'où provient le déploiement
- Auteur du déploiement
- Statut du déploiement (réussi/échoué)
- Commit associé

### Configuration d'environnements dynamiques

Pour les applications avec plusieurs instances ou environnements variables[2] :

```yaml
deploy_preview:
  stage: deploy
  script:
    - ./deploy.sh $PREVIEW_ENV
  environment:
    name: preview-$CI_MERGE_REQUEST_IID
    url: https://preview-$CI_MERGE_REQUEST_IID.example.com
    auto_stop_in: 1 week
  only:
    - merge_requests
```

Cette configuration crée un environnement de review temporaire pour chaque merge request, accessible pendant une semaine avant suppression automatique.

## Gestion des variables

### Principe des variables CI/CD

Les variables constituent le mécanisme fondamental pour paramétrer les pipelines sans modifier le code source[1]. GitLab fournit deux catégories de variables :

- **Variables prédéfinies (built-in)** : fournies automatiquement par GitLab (ex: CI_COMMIT_SHA, CI_PROJECT_NAME)
- **Variables personnalisées** : définies par l'utilisateur au niveau projet ou pipeline

### Variables prédéfinies essentielles

GitLab expose automatiquement un ensemble riche de variables contextuelles :

| Variable | Description |
|----------|-------------|
| `$CI_COMMIT_SHA` | Hash complet du commit (40 caractères) |
| `$CI_COMMIT_SHORT_SHA` | Hash court du commit (8 caractères) |
| `$CI_COMMIT_BRANCH` | Branche depuis laquelle le pipeline s'exécute |
| `$CI_COMMIT_TAG` | Tag Git si le pipeline est déclenché par un tag |
| `$CI_COMMIT_MESSAGE` | Message du commit |
| `$CI_PROJECT_NAME` | Nom du projet GitLab |
| `$CI_PROJECT_PATH` | Chemin complet du projet (groupe/projet) |
| `$CI_BUILD_ID` | Identifiant unique du job |
| `$CI_PIPELINE_ID` | Identifiant unique de la pipeline |
| `$CI_MERGE_REQUEST_IID` | Identifiant de la merge request (si applicable) |

### Utilisation des variables prédéfinies

```yaml
logging_job:
  stage: build
  script:
    - echo "Commit SHA: $CI_COMMIT_SHA"
    - echo "Branch: $CI_COMMIT_BRANCH"
    - echo "Project: $CI_PROJECT_NAME"
    - echo "Pipeline ID: $CI_PIPELINE_ID"
    - echo "Message du commit: $CI_COMMIT_MESSAGE"
```

### Définition de variables personnalisées au niveau projet

Les variables au niveau projet s'appliquent à **toutes les pipelines** du projet[1] :

```yaml
job_name:
  stage: build
  script:
    - echo "Database URL: $DATABASE_URL"
    - echo "API Token: $API_TOKEN"
```

Ces variables se configurent dans l'interface GitLab via **Paramètres du projet > CI/CD > Variables**.

### Variables au niveau pipeline

Les variables définies dans le fichier `.gitlab-ci.yml` s'appliquent à la pipeline courante :

```yaml
variables:
  DATABASE_HOST: "localhost"
  DATABASE_PORT: "5432"
  NODE_ENV: "production"
  LOG_LEVEL: "info"

build_job:
  stage: build
  script:
    - echo "Environment: $NODE_ENV"
    - echo "Database: $DATABASE_HOST:$DATABASE_PORT"
    - echo "Log Level: $LOG_LEVEL"
```

### Variables au niveau job

Les variables définies dans un job spécifique surpassent les variables globales :

```yaml
variables:
  APP_ENV: "production"

build_dev:
  stage: build
  variables:
    APP_ENV: "development"
  script:
    - echo "Running in $APP_ENV environment"

build_prod:
  stage: build
  script:
    - echo "Running in $APP_ENV environment"
```

Dans cet exemple, `build_dev` exécute avec `APP_ENV=development`, tandis que `build_prod` utilise `APP_ENV=production`.

### Variables protégées et masquées

Pour les données sensibles (tokens, clés API, mots de passe) :

```yaml
deploy_job:
  stage: deploy
  variables:
    # Cette variable n'est disponible que sur branches protégées
    PROD_API_KEY:
      value: "sk-1234567890abcdef"
      protected: true
    # Cette variable est masquée dans les logs
    SECRET_TOKEN:
      value: "secret-12345"
      protected: true
  script:
    - curl -H "Authorization: Bearer $PROD_API_KEY" https://api.example.com/deploy
```

Les variables protégées ne s'exécutent que sur les branches protégées (main, develop) et les tags protégés, offrant une couche de sécurité supplémentaire.

### Interpolation et concaténation de variables

```yaml
variables:
  REGISTRY: "registry.example.com"
  IMAGE_NAME: "my-app"
  IMAGE_TAG: "latest"

build_image:
  stage: build
  script:
    - docker build -t $REGISTRY/$IMAGE_NAME:$IMAGE_TAG .
    - docker push $REGISTRY/$IMAGE_NAME:$IMAGE_TAG
    - echo "Image pushed: $REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
```

### Variables issues d'artefacts

GitLab permet d'extraire des variables depuis les fichiers d'artefacts[1] :

```yaml
build_job:
  stage: build
  script:
    - npm run build
    - echo "BUILD_VERSION=1.2.3" >> build.env
  artifacts:
    reports:
      dotenv: build.env

deploy_job:
  stage: deploy
  dependencies:
    - build_job
  script:
    - echo "Deploying version: $BUILD_VERSION"
```

## Contrôle du flux d'exécution

### Concept de contrôle du flux

Le contrôle du flux détermine **quand et comment** les jobs s'exécutent au sein d'une pipeline. GitLab propose plusieurs mécanismes pour orchestrer l'exécution conditionnelle, permettant une fine granularité dans la définition des workflows[7].

### Paramètre `when` pour l'exécution conditionnelle

Le mot-clé `when` offre quatre options fondamentales[2] :

| Valeur | Comportement |
|--------|------------|
| `always` | Le job s'exécute toujours, indépendamment de l'état du job précédent |
| `on_success` | Le job s'exécute uniquement si tous les jobs du stage précédent ont réussi (défaut) |
| `on_failure` | Le job s'exécute uniquement si au moins un job du stage précédent a échoué |
| `manual` | Le job nécessite une approbation manuelle pour s'exécuter |
| `delayed` | Le job est décalé d'une durée donnée avant son exécution |

### Utilisation du paramètre `when: manual`

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build

test:
  stage: test
  script:
    - npm run test

deploy_production:
  stage: deploy
  script:
    - ./deploy.sh production
  when: manual
```

Le déploiement en production nécessite une action manuelle depuis l'interface GitLab, prévenant les déploiements accidentels[2].

### Utilisation du paramètre `when: on_failure`

```yaml
notify_failure:
  stage: deploy
  script:
    - curl -X POST https://hooks.slack.com/services/... -d '{"text":"Pipeline failed"}'
  when: on_failure
```

La notification Slack s'envoie uniquement si un job du stage précédent a échoué.

### Utilisation du paramètre `when: always`

```yaml
cleanup:
  stage: test
  script:
    - rm -rf /tmp/build-*
    - echo "Cleanup completed"
  when: always
```

Le nettoyage s'exécute toujours, même si les jobs de test ont échoué, assurant la libération des ressources temporaires.

### Utilisation du paramètre `when: delayed`

```yaml
smoke_tests:
  stage: deploy
  script:
    - ./run-smoke-tests.sh
  when: delayed
  start_in: 5 minutes
```

Les tests smoke commencent 5 minutes après le déclenchement du job, laissant le temps à l'infrastructure de se stabiliser suite au déploiement.

### Paramètre `allow_failure`

```yaml
experimental_feature:
  stage: test
  script:
    - npm run test:experimental
  allow_failure: true
```

L'échec de ce job ne bloque pas l'exécution des stages suivants. Le job est marqué comme échoué, mais la pipeline continue[4].

### Combinaison de contrôles

```yaml
stages:
  - build
  - test
  - deploy
  - rollback

build:
  stage: build
  script:
    - npm run build

test_unit:
  stage: test
  script:
    - npm run test:unit

test_integration:
  stage: test
  script:
    - npm run test:integration
  allow_failure: true

deploy_staging:
  stage: deploy
  script:
    - ./deploy.sh staging
  when: on_success

deploy_production:
  stage: deploy
  script:
    - ./deploy.sh production
  when: manual

rollback:
  stage: rollback
  script:
    - ./rollback.sh
  when: on_failure
```

Cette pipeline sophistiquée illustre :
- Tests intégrés non-bloquants (`allow_failure: true`)
- Déploiement staging automatique après réussite (`when: on_success`)
- Déploiement production manuel (`when: manual`)
- Rollback automatique en cas d'échec (`when: on_failure`)

## Filtrage et conditions

### Concepts de filtrage avancé

Le filtrage granulaire permet de cibler précisément les contextes d'exécution des jobs : branches spécifiques, tags, merge requests, ou combinaisons complexes[5][7]. GitLab offre plusieurs systèmes pour définir ces conditions.

### Mot-clé `only` et `except`

Les paramètres `only` et `except` contrôlent l'exécution selon le type d'événement[5] :

```yaml
deploy_main:
  stage: deploy
  script:
    - echo "Deploying from main branch"
  only:
    - main

feature_branch:
  stage: build
  script:
    - echo "Building feature branch"
  except:
    - main
    - develop
```

Le job `deploy_main` ne s'exécute que lors d'un push sur la branche `main`. Le job `feature_branch` s'exécute sur toute branche sauf `main` et `develop`.

### Ciblage par type d'événement

```yaml
on_merge_request:
  stage: test
  script:
    - npm run test
  only:
    - merge_requests

on_tag:
  stage: deploy
  script:
    - echo "Deploying version $CI_COMMIT_TAG"
  only:
    - tags

on_schedule:
  stage: maintenance
  script:
    - ./daily-maintenance.sh
  only:
    - schedules
```

Ces jobs s'exécutent dans des contextes spécifiques : merge requests, tags Git, ou exécutions programmées.

### Filtrage par branche avec expressions régulières

```yaml
release_candidate:
  stage: deploy
  script:
    - ./build-release.sh
  only:
    - /^release-\d+\.\d+\.\d+$/

hotfix:
  stage: deploy
  script:
    - ./apply-hotfix.sh
  only:
    - /^hotfix\//
```

Les expressions régulières permettent de matcher des patterns de branche dynamiquement.

### Mot-clé `rules` : approche moderne et flexible

GitLab recommande l'utilisation de `rules` pour une plus grande flexibilité[7] :

```yaml
deploy_job:
  stage: deploy
  script:
    - ./deploy.sh
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: always
    - if: '$CI_COMMIT_BRANCH == "develop"'
      when: manual
    - if: '$CI_COMMIT_TAG'
      when: always
    - when: never
```

Cette configuration :
- Déploie automatiquement sur `main`
- Permet déploiement manuel sur `develop`
- Déploie automatiquement sur tags
- Bloque les autres branches

### Conditions avancées avec `rules`

```yaml
complex_pipeline:
  stage: deploy
  script:
    - ./deploy.sh
  rules:
    # Règle 1 : branche main + variables définis
    - if: '$CI_COMMIT_BRANCH == "main" && $ENABLE_DEPLOY == "true"'
      when: always
    
    # Règle 2 : merge request vers main
    - if: '$CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"'
      when: manual
    
    # Règle 3 : tags de version
    - if: '$CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/'
      when: always
    
    # Règle 4 : par défaut, ne rien faire
    - when: never
```

### Filtrage par variables d'environnement

```yaml
security_scan:
  stage: test
  script:
    - ./security-scan.sh
  rules:
    - if: '$SECURITY_ENABLED == "true"'
      when: always
    - when: never
```

Le scan de sécurité ne s'exécute que si la variable `SECURITY_ENABLED` vaut `true`.

### Condition sur le message de commit

```yaml
skip_ci:
  stage: build
  script:
    - echo "This job is skipped"
  rules:
    - if: '$CI_COMMIT_MESSAGE =~ /\[skip-ci\]/'
      when: never
    - when: always
```

Les commits comportant `[skip-ci]` dans leur message bypassent cette étape.

## Utiliser des images

### Concept des images Docker dans GitLab CI/CD

Les images Docker constituent l'environnement d'exécution pour chaque job GitLab CI/CD[2]. Une image Docker encapsule tous les outils, libraires et runtime nécessaires à l'exécution du job, garantissant une reproductibilité complète et isolant les dépendances d'un job à l'autre.

### Image par défaut au niveau projet

```yaml
image: node:16-alpine

build:
  stage: build
  script:
    - npm install
    - npm run build

test:
  stage: test
  script:
    - npm run test
```

Tous les jobs utilisent l'image `node:16-alpine` par défaut, sauf surcharge au niveau individuel.

### Image spécifique au niveau job

```yaml
build_node:
  stage: build
  image: node:16
  script:
    - npm install
    - npm run build

build_python:
  stage: build
  image: python:3.9
  script:
    - pip install -r requirements.txt
    - python setup.py build

build_java:
  stage: build
  image: maven:3.8-openjdk-11
  script:
    - mvn clean package
```

Chaque job possède son image adaptée à son langage de programmation[2].

### Images multi-framework

```yaml
stages:
  - build
  - test
  - deploy

build_frontend:
  stage: build
  image: node:16-alpine
  script:
    - cd frontend
    - npm install
    - npm run build

build_backend:
  stage: build
  image: python:3.9-slim
  script:
    - cd backend
    - pip install -r requirements.txt
    - python manage.py collectstatic

test_frontend:
  stage: test
  image: node:16-alpine
  script:
    - npm run test:frontend

test_backend:
  stage: test
  image: python:3.9-slim
  script:
    - pytest backend/

deploy:
  stage: deploy
  image: ubuntu:20.04
  script:
    - apt-get update
    - apt-get install -y curl
    - ./deploy.sh
```

### Registre privé d'images Docker

Pour utiliser des images provenant d'un registre privé :

```yaml
image: registry.example.com/my-org/my-image:latest

build:
  stage: build
  script:
    - echo "Building with private image"
```

L'accès au registre privé s'authentifie via les variables protégées du projet GitLab.

### Images avec variables

```yaml
variables:
  REGISTRY: "registry.example.com"
  IMAGE_TAG: "latest"

build:
  stage: build
  image: $REGISTRY/build-tools:$IMAGE_TAG
  script:
    - npm run build
```

Les variables dynamiques permettent de modifier l'image selon le contexte.

### Configuration d'image au niveau global

```yaml
default:
  image: node:16-alpine

variables:
  APP_ENV: "production"

build:
  stage: build
  script:
    - npm install
    - npm run build

test:
  stage: test
  script:
    - npm run test

deploy:
  stage: deploy
  image: docker:latest
  script:
    - docker build -t my-app:latest .
```

Le bloc `default` définit la configuration par défaut pour tous les jobs, incluant l'image par défaut[1]. Le job `deploy` surcharge avec sa propre image `docker:latest`.

### Commandes avant et après dans l'image

```yaml
build:
  stage: build
  image: node:16-alpine
  before_script:
    - echo "Installing additional packages..."
    - apk add --no-cache curl
    - echo "Environment setup completed"
  script:
    - npm install
    - npm run build
  after_script:
    - echo "Build completed at $(date)"
    - df -h
```

- `before_script` : s'exécute avant le script principal
- `after_script` : s'exécute après, même en cas d'erreur[4]

### Images avec authentification

```yaml
image: 
  name: registry.example.com/private-image:latest
  entrypoint: [""]

build:
  stage: build
  before_script:
    - echo $REGISTRY_PASSWORD | docker login -u $REGISTRY_USER --password-stdin registry.example.com
  script:
    - npm install
    - npm run build
```

### Sélection d'image selon la branche

```yaml
build:
  stage: build
  image: 
    name: node:16
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      variables:
        IMAGE_TAG: "node:16-slim"
    - if: '$CI_COMMIT_BRANCH == "develop"'
      variables:
        IMAGE_TAG: "node:16-alpine"
  script:
    - npm install
    - npm run build
```

La sélection d'image s'adapte selon la branche de destination, optimisant les ressources selon le contexte.

---

## Synthèse intégrative du parcours d'apprentissage

L'appropriation de GitLab CI/CD suit une progression logique et cumulative, où chaque concept s'appuie sur les fondations précédentes pour construire des workflows sophistiqués et efficaces.

### Fondation : les stages

Le parcours démarre par la compréhension de la **structure fondamentale des pipelines** via les stages. Cette étape forme la colonne vertébrale de toute pipeline, établissant l'ordre séquentiel d'exécution et l'architecture générale du workflow. Maîtriser les stages signifie comprendre comment organiser logiquement le processus d'intégration et de déploiement en phases distinctes.

### Premier niveau d'exécution : les scripts

Avec la structure en place, les **scripts** matérialisent l'action concrète. Les scripts transforment les stages abstraits en exécution réelle, définissant les commandes shell qui accomplissent le travail. Ce stade requiert une compréhension claire de la syntaxe shell et de la gestion des erreurs d'exécution.

### Paramétrage dynamique : les variables

Les **variables** introduisent la **flexibilité et la réutilisabilité**. Plutôt que de coder en dur les valeurs dans les scripts, les variables permettent d'adapter le comportement selon le contexte sans modification du code source. Cette approche élève le niveau d'abstraction et facilite la maintenance.

### Orchestration intelligente : contrôle du flux et filtrage

Une fois les structures et paramètres en place, le **contrôle du flux** et les **conditions de filtrage** offrent la granularité nécessaire pour orchestrer des workflows complexes. Ces concepts permettent de décider dynamiquement **quand et comment** les jobs s'exécutent, selon des critères sophistiqués.

### Isolation et portabilité : les images

Enfin, les **images Docker** encapsulent l'environnement d'exécution, garantissant la reproductibilité et l'isolement des dépendances. Les images complètent la configuration en fournissant un environnement contrôlé et portable.

### Dimension transversale : les environnements

Les **environnements** transcendent les autres concepts, apportant une dimension de **traçabilité et de gouvernance** au processus. Ils permettent de suivre les déploiements, de gérer les approbations, et de maintenir un historique clair des versions en production.

### Progression recommandée

1. **Phase 1 - Mise en place** : Définir les stages de base (build, test, deploy), implémenter les scripts simples
2. **Phase 2 - Paramétrage** : Introduire les variables pour adapter le comportement selon le contexte
3. **Phase 3 - Sophistication** : Ajouter le contrôle du flux (when, allow_failure) pour orchestrer l'exécution
4. **Phase 4 - Finesse** : Implémenter le filtrage avancé (rules) pour cibler précisément les contextes
5. **Phase 5 - Portabilité** : Sélectionner les images Docker appropriées et configurer les environnements de déploiement
6. **Phase 6 - Production** : Combiner tous les concepts pour construire des pipelines d'entreprise complètes avec approbations, notifications et rollback

Cette progression assure une montée en compétence graduelle, chaque étape s'appuyant sur les concepts précédents pour construire une expertise complète en CI/CD sous GitLab.
