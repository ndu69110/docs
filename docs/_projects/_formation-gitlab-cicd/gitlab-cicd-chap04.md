# Citations
- https://www.youtube.com/watch?v=9VTGW1pCTC8
- https://www.youtube.com/watch?v=TiWo_eTOkbs
- https://docs.gitlab.com/ci/quick_start/
- https://university.gitlab.com/pages/advanced-cicd
- https://www.youtube.com/watch?v=jR1HFox1BMg
- https://www.youtube.com/watch?v=R236CKpurwA
- https://adictosaltrabajo.com/2018/04/10/primeros-pasos-con-gitlab-ci/


# Tokens
- prompt_tokens: 322
- completion_tokens: 6819
- total_tokens: 7141
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.102, 'request_cost': 0.006, 'total_cost': 0.109}


# Content
# Chapitre 4 : Notions avancées sur GitLab CI/CD

## Comprendre la notion de default

La section `default` dans GitLab CI/CD représente un mécanisme fondamental de configuration qui permet de définir des paramètres applicables à l'ensemble des jobs d'un pipeline[1]. Cette approche réduit considérablement la redondance de code et facilite la maintenance des pipelines complexes.

### Principes fondamentaux

La section `default` s'applique automatiquement à tous les jobs, sauf si ces derniers surcharger explicitement les paramètres hérités. Cette hiérarchie de configuration suit un ordre de priorité clair : les paramètres définis au niveau du job prennent toujours précédence sur ceux définis dans `default`.

```yaml
default:
  stage: test
  tags:
    - docker
  timeout: 1 hour
  retry:
    max: 2
    when:
      - runner_system_failure
      - stuck_or_timeout_failure

build-job:
  stage: build
  script:
    - echo "Ce job utilise build stage, pas test"

test-job:
  script:
    - echo "Ce job utilise le stage test de default"
    - echo "Il dispose également du timeout de 1 heure"
```

### Paramètres héritables

Les paramètres configurables dans la section `default` incluent :

- `stage` : L'étape d'exécution du pipeline
- `image` : L'image Docker utilisée
- `tags` : Les étiquettes pour sélectionner les runners
- `cache` : Configuration du cache entre jobs
- `artifacts` : Configuration des artefacts
- `retry` : Stratégie de relance en cas d'échec
- `timeout` : Durée maximale d'exécution
- `before_script` : Scripts exécutés avant le job
- `after_script` : Scripts exécutés après le job
- `interruptible` : Possibilité d'interrompre le job

### Cas d'usage avancés

```yaml
default:
  retry:
    max: 2
    when: [runner_system_failure, api_failure]
  tags:
    - shared-runner
  image: ubuntu:22.04

build:
  stage: build
  script:
    - apt-get update
    - apt-get install -y build-essential

unit-tests:
  stage: test
  image: ubuntu:22.04-python3.10
  script:
    - python -m pytest tests/

integration-tests:
  stage: test
  tags:
    - docker
  script:
    - ./run_integration_tests.sh
  retry:
    max: 3
    when: [runner_system_failure]

deploy:
  stage: deploy
  script:
    - ./deploy.sh
  retry:
    max: 1
```

Dans cet exemple, les jobs `build` et `unit-tests` héritent automatiquement de la configuration `default`, tandis que le job `integration-tests` surcharge le paramètre `retry` pour une stratégie plus agressive, et le job `deploy` limite le nombre de tentatives à 1.

## Gestion des artifacts et dependencies

Les artefacts constituent un élément central dans la transmission de données entre les étapes d'un pipeline. Contrairement aux données temporaires, les artefacts sont conservés et peuvent être téléchargés ou transmis aux jobs suivants[1].

### Concepts fondamentaux des artifacts

Un artefact représente un fichier ou un ensemble de fichiers générés par un job et destinés à être :

- Conservés après l'exécution du job
- Téléchargés manuellement via l'interface GitLab
- Transmis automatiquement aux jobs dépendants
- Archivés pour audit ou analyse ultérieure

### Configuration basique des artifacts

```yaml
build-job:
  stage: build
  script:
    - mkdir -p build
    - gcc -o build/application main.c
    - echo "Version 1.0" > build/version.txt
  artifacts:
    paths:
      - build/
    expire_in: 1 week
    name: "application-build-$CI_COMMIT_SHORT_SHA"

test-job:
  stage: test
  script:
    - ./build/application --version
    - ./build/application --test
  dependencies:
    - build-job
```

### Gestion avancée des artefacts

#### Sélection par patterns

```yaml
compile-backend:
  stage: build
  script:
    - npm install
    - npm run build
    - npm run test
  artifacts:
    paths:
      - dist/
      - coverage/
    exclude:
      - dist/**/*.map
    expire_in: 30 days

compile-frontend:
  stage: build
  script:
    - yarn install
    - yarn build
  artifacts:
    paths:
      - public/
    reports:
      dependency_scanning: gl-dependency-scanning-report.json
    expire_in: 1 week
```

#### Rapports spécialisés

```yaml
testing:
  stage: test
  script:
    - pytest --cov=src --cov-report=term --cov-report=html
    - pylint src/ --exit-zero -f json > pylint-report.json
  artifacts:
    paths:
      - htmlcov/
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
      sast: sast-report.json
    expire_in: 30 days
```

### Dépendances explicites

Les dépendances permettent de contrôler précisément quels artefacts sont accessibles à un job donné :

```yaml
stages:
  - build
  - test
  - package
  - deploy

build-backend:
  stage: build
  artifacts:
    paths:
      - backend/dist/
  script:
    - cd backend && npm run build

build-frontend:
  stage: build
  artifacts:
    paths:
      - frontend/dist/
  script:
    - cd frontend && npm run build

unit-tests-backend:
  stage: test
  dependencies:
    - build-backend
  script:
    - npm test

unit-tests-frontend:
  stage: test
  dependencies:
    - build-frontend
  script:
    - npm test

integration-tests:
  stage: test
  dependencies:
    - build-backend
    - build-frontend
  script:
    - ./test/integration.sh

package-app:
  stage: package
  dependencies:
    - build-backend
    - build-frontend
  script:
    - ./scripts/package.sh
```

### Optimisation de la transmission des artefacts

```yaml
stages:
  - build
  - verify
  - deploy

build:
  stage: build
  script:
    - echo "Compilation en cours..."
    - tar czf application.tar.gz --exclude='*.o' src/
  artifacts:
    paths:
      - application.tar.gz
    expire_in: 2 hours

verify-signature:
  stage: verify
  dependencies:
    - build
  script:
    - tar xzf application.tar.gz
    - ./verify.sh
  artifacts:
    paths:
      - verification-report.txt
    expire_in: 30 days

deploy-production:
  stage: deploy
  dependencies:
    - verify-signature
  script:
    - ./deploy.sh
  only:
    - main
```

## Utilisation du cache

Le cache améliore significativement les performances des pipelines en stockant des fichiers entre les exécutions. Contrairement aux artefacts qui sont conservés sur les serveurs GitLab, le cache est géré localement par les runners[1].

### Distinction cache vs artifacts

| Aspect | Cache | Artifacts |
|--------|-------|-----------|
| Stockage | Système de fichiers du runner | Serveurs GitLab |
| Durée de vie | Entre les jobs/pipelines | Définie par `expire_in` |
| Transmission | Automatique si même runner | Explicite via `dependencies` |
| Taille | Optimisée pour rapidité | Moins de contraintes |
| Cas d'usage | Dépendances, modules npm | Résultats de build, rapports |

### Configuration basique du cache

```yaml
stages:
  - build
  - test
  - deploy

cache:
  key: "build-cache"
  paths:
    - node_modules/
    - .gradle/

install-dependencies:
  stage: build
  script:
    - npm install
    - pip install -r requirements.txt

run-tests:
  stage: test
  script:
    - npm test

build-artifact:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
```

### Stratégies de cache avancées

#### Cache par branche

```yaml
stages:
  - install
  - build
  - test

cache:
  key:
    files:
      - package-lock.json
    prefix: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .npm/

install-npm:
  stage: install
  script:
    - npm ci

build-app:
  stage: build
  script:
    - npm run build
```

#### Caches multiples

```yaml
build-project:
  stage: build
  cache:
    - key: "npm-cache-${CI_COMMIT_REF_SLUG}"
      paths:
        - node_modules/
    - key: "pip-cache-${CI_COMMIT_REF_SLUG}"
      paths:
        - venv/
        - .cache/pip/
  script:
    - npm install
    - python -m venv venv
    - pip install -r requirements.txt
    - npm run build
```

#### Contrôle granulaire du cache

```yaml
stages:
  - dependencies
  - build
  - test
  - cleanup

install-dependencies:
  stage: dependencies
  cache:
    key: "dependencies-${CI_COMMIT_REF_SLUG}"
    paths:
      - node_modules/
      - vendor/
    policy: pull-push
  script:
    - npm install
    - composer install

build-cached:
  stage: build
  cache:
    key: "dependencies-${CI_COMMIT_REF_SLUG}"
    paths:
      - node_modules/
      - vendor/
    policy: pull
  script:
    - npm run build
  dependencies:
    - install-dependencies

test-cached:
  stage: test
  cache:
    key: "dependencies-${CI_COMMIT_REF_SLUG}"
    paths:
      - node_modules/
    policy: pull
  script:
    - npm test
  dependencies:
    - install-dependencies
```

### Gestion du cycle de vie du cache

```yaml
default:
  cache:
    key:
      files:
        - package-lock.json
      prefix: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
    policy: pull-push

stages:
  - setup
  - build
  - test
  - cleanup

setup-environment:
  stage: setup
  cache:
    policy: pull-push
  script:
    - npm ci
    - npm cache verify

build:
  stage: build
  cache:
    policy: pull
  script:
    - npm run build
    - npm run lint

test:
  stage: test
  cache:
    policy: pull
  script:
    - npm test

clear-cache:
  stage: cleanup
  cache:
    policy: pull-push
  script:
    - npm cache clean --force
  when: on_success
  only:
    - schedules
```

## Mesurer le coverage du code

La couverture de code mesure le pourcentage du code source exécuté lors des tests. Cette métrique permet d'identifier les sections non testées et d'améliorer la qualité du code.

### Configuration basique du coverage

```yaml
stages:
  - test
  - report

test-coverage:
  stage: test
  image: python:3.10
  script:
    - pip install pytest pytest-cov
    - pytest --cov=src --cov-report=term --cov-report=xml
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
  coverage: '/TOTAL.*\s+(\d+%)$/'
```

### Extraction du coverage par format

#### Format Cobertura (XML)

```yaml
test-java:
  stage: test
  image: maven:3.8
  script:
    - mvn clean test jacoco:report
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: target/site/jacoco/jacoco.xml
    expire_in: 30 days
  coverage: '/Total.*?(\d+%)/'
```

#### Format JavaScript/TypeScript

```yaml
test-javascript:
  stage: test
  image: node:18
  script:
    - npm install --save-dev jest @babel/preset-env babel-jest
    - npm test -- --coverage --coverage-reporters=cobertura
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
```

### Configurations avancées du coverage

```yaml
stages:
  - build
  - test
  - analysis

build:
  stage: build
  script:
    - npm install

unit-tests:
  stage: test
  needs:
    - build
  script:
    - npm run test:unit -- --coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/unit/cobertura-coverage.xml
    paths:
      - coverage/unit/
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'

integration-tests:
  stage: test
  needs:
    - build
  script:
    - npm run test:integration -- --coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/integration/cobertura-coverage.xml
    paths:
      - coverage/integration/
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'

coverage-analysis:
  stage: analysis
  image: python:3.10
  script:
    - python scripts/analyze_coverage.py
  artifacts:
    paths:
      - coverage-report.html
  coverage: '/Coverage:\s*(\d+\.\d+)%/'
  allow_failure: true
```

### Mise en place de seuils de coverage

```yaml
test-with-threshold:
  stage: test
  image: python:3.10
  script:
    - pip install pytest pytest-cov
    - pytest --cov=src --cov-report=term --cov-report=xml --cov-fail-under=80
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
  coverage: '/TOTAL.*\s+(\d+%)$/'
  allow_failure: false
```

## Optimiser avec l'exécution en parallèle

L'exécution en parallèle des jobs représente un élément clé d'optimisation des pipelines. GitLab permet plusieurs approches pour exploiter le parallélisme.

### Parallélisme au niveau des stages

```yaml
stages:
  - build
  - test
  - deploy

build-backend:
  stage: build
  script:
    - echo "Compilation backend"
    - sleep 30

build-frontend:
  stage: build
  script:
    - echo "Compilation frontend"
    - sleep 30

test-backend:
  stage: test
  script:
    - echo "Tests backend"
  needs:
    - build-backend

test-frontend:
  stage: test
  script:
    - echo "Tests frontend"
  needs:
    - build-frontend

deploy:
  stage: deploy
  script:
    - echo "Déploiement"
  needs:
    - test-backend
    - test-frontend
```

### Utilisation de DAG (Directed Acyclic Graph) avec needs

```yaml
stages:
  - build
  - unit-tests
  - integration-tests
  - package

compile-backend:
  stage: build
  script:
    - mvn clean compile

compile-frontend:
  stage: build
  script:
    - npm run build

unit-tests-backend:
  stage: unit-tests
  needs:
    - compile-backend
  script:
    - mvn test

unit-tests-frontend:
  stage: unit-tests
  needs:
    - compile-frontend
  script:
    - npm test

integration-tests:
  stage: integration-tests
  needs:
    - unit-tests-backend
    - unit-tests-frontend
  script:
    - ./test/run-integration.sh

package:
  stage: package
  needs:
    - integration-tests
  script:
    - ./scripts/package.sh
```

### Partitionnement des tests

```yaml
stages:
  - build
  - test
  - results

build:
  stage: build
  script:
    - npm install
    - npm run build

test-1:
  stage: test
  parallel: 5
  script:
    - npm test -- --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  needs:
    - build

test-2:
  stage: test
  parallel:
    total: 3
  script:
    - pytest tests/ -k "test_module_${CI_NODE_INDEX}" --maxfail=3
  needs:
    - build

merge-results:
  stage: results
  script:
    - ./scripts/merge_test_results.sh
```

### Optimisation avec matrix

```yaml
stages:
  - test
  - deploy

test:
  stage: test
  parallel:
    matrix:
      - PYTHON_VERSION: ["3.9", "3.10", "3.11"]
        DJANGO_VERSION: ["3.2", "4.0"]
  image: python:${PYTHON_VERSION}
  script:
    - pip install Django==${DJANGO_VERSION}
    - python manage.py test
  needs: []

deploy:
  stage: deploy
  parallel:
    matrix:
      - ENVIRONMENT: ["staging", "production"]
        REGION: ["eu-west", "us-east"]
  script:
    - ./deploy.sh ${ENVIRONMENT} ${REGION}
```

## Composition avancée : include et template

La composition via `include` permet de réutiliser des configurations de pipeline et de maintenir une cohérence à travers plusieurs projets.

### Include local

```yaml
stages:
  - test
  - build
  - deploy

include:
  - local: '.gitlab/ci/test.yml'
  - local: '.gitlab/ci/build.yml'
  - local: '.gitlab/ci/deploy.yml'
```

Structure des fichiers :

```
.gitlab/
├── ci/
│   ├── test.yml
│   ├── build.yml
│   └── deploy.yml
```

Contenu `.gitlab/ci/test.yml` :

```yaml
test-unit:
  stage: test
  image: node:18
  script:
    - npm install
    - npm test

test-lint:
  stage: test
  image: node:18
  script:
    - npm install
    - npm run lint
```

Contenu `.gitlab/ci/build.yml` :

```yaml
build:
  stage: build
  image: node:18
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
```

Contenu `.gitlab/ci/deploy.yml` :

```yaml
deploy-staging:
  stage: deploy
  image: alpine:latest
  script:
    - ./deploy.sh staging
  environment:
    name: staging
  only:
    - develop

deploy-production:
  stage: deploy
  image: alpine:latest
  script:
    - ./deploy.sh production
  environment:
    name: production
  only:
    - main
```

### Include depuis un registre ou URL

```yaml
include:
  - remote: 'https://gitlab.com/shared-ci-pipelines/templates.yml'
  - project: 'shared-templates/ci-components'
    ref: main
    file: 'common-jobs.yml'
```

### Include avec règles conditionnelles

```yaml
include:
  - local: '.gitlab/ci/base.yml'
  - local: '.gitlab/ci/docker.yml'
    rules:
      - if: $BUILD_DOCKER == "true"
  - local: '.gitlab/ci/security.yml'
    rules:
      - if: $SECURITY_SCAN == "true"
```

### Composition multi-niveaux

```yaml
# .gitlab-ci.yml principal
stages:
  - dependencies
  - build
  - test
  - security
  - deploy

include:
  - local: '.gitlab/ci/shared/default.yml'
  - local: '.gitlab/ci/build/backend.yml'
  - local: '.gitlab/ci/build/frontend.yml'
  - local: '.gitlab/ci/test/unit.yml'
  - local: '.gitlab/ci/test/integration.yml'
  - local: '.gitlab/ci/security/sast.yml'
  - local: '.gitlab/ci/security/dependency-check.yml'
  - local: '.gitlab/ci/deploy/staging.yml'
  - local: '.gitlab/ci/deploy/production.yml'

install-dependencies:
  stage: dependencies
  script:
    - npm install
    - pip install -r requirements.txt
```

## Composition : jobs cachés, <<* et extends

La composition via l'héritage permet de définir des configurations réutilisables et de maintenir une logique DRY (Don't Repeat Yourself).

### Jobs cachés (hidden jobs)

```yaml
.base-job:
  image: ubuntu:22.04
  tags:
    - docker
  before_script:
    - apt-get update -qq
  after_script:
    - echo "Job finished"

.test-job:
  extends: .base-job
  stage: test
  script:
    - echo "Running tests"

.deploy-job:
  extends: .base-job
  stage: deploy
  script:
    - echo "Deploying"
  only:
    - main

unit-tests:
  extends: .test-job
  script:
    - npm test

integration-tests:
  extends: .test-job
  script:
    - ./test/integration.sh

deploy-production:
  extends: .deploy-job
  script:
    - ./deploy.sh production
```

### Fusión con <<* (merge keys)

```yaml
.defaults: &defaults
  tags:
    - docker
  timeout: 1h
  retry: 2

.python-defaults: &python-defaults
  image: python:3.10
  before_script:
    - pip install -r requirements.txt

test-unit:
  <<: *defaults
  <<: *python-defaults
  stage: test
  script:
    - pytest tests/unit/

test-integration:
  <<: *defaults
  <<: *python-defaults
  stage: test
  script:
    - pytest tests/integration/
  timeout: 2h
  retry: 3
```

### Extends avancé

```yaml
stages:
  - build
  - test
  - deploy

.docker-job:
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY

.test-job:
  stage: test
  retry:
    max: 2
    when: [runner_system_failure]

.deploy-job:
  stage: deploy
  when: manual
  environment:
    name: $CI_COMMIT_REF_NAME
  only:
    - main
    - develop

build-docker:
  extends: .docker-job
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:latest

test-docker:
  extends:
    - .docker-job
    - .test-job
  script:
    - docker run $CI_REGISTRY_IMAGE:latest npm test

deploy-staging:
  extends: .deploy-job
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - docker pull $CI_REGISTRY_IMAGE:latest
    - docker run -d --name app $CI_REGISTRY_IMAGE:latest
  only:
    - develop

deploy-production:
  extends: .deploy-job
  environment:
    name: production
    url: https://example.com
  script:
    - docker pull $CI_REGISTRY_IMAGE:latest
    - docker run -d --name app $CI_REGISTRY_IMAGE:latest
  only:
    - main
```

### Composition complexe avec multiples héritage

```yaml
.base:
  tags: [docker]
  timeout: 30m

.node:
  image: node:18
  cache:
    paths: [node_modules/]

.python:
  image: python:3.10
  cache:
    paths: [.venv/]

.test:
  stage: test
  coverage: '/Coverage: \d+\.\d+%/'

.deploy:
  stage: deploy
  environment:
    name: $CI_COMMIT_REF_NAME
  when: manual

test-node:
  extends:
    - .base
    - .node
    - .test
  script:
    - npm install
    - npm test

test-python:
  extends:
    - .base
    - .python
    - .test
  script:
    - python -m venv .venv
    - pip install -r requirements.txt
    - pytest

deploy-node:
  extends:
    - .base
    - .node
    - .deploy
  script:
    - npm install
    - npm run build
    - npm run deploy

deploy-python:
  extends:
    - .base
    - .python
    - .deploy
  script:
    - python -m venv .venv
    - pip install -r requirements.txt
    - python deploy.py
```

## Contrôle de l'héritage avec inherit

Le mot-clé `inherit` permet de contrôler finement quels éléments sont hérités d'une configuration parente.

### Contrôle basique de l'héritage

```yaml
default:
  image: ubuntu:22.04
  tags: [docker]
  retry: 2
  timeout: 1h

job-all-inherited:
  stage: test
  script:
    - echo "Hérite de tout"

job-partial-inheritance:
  inherit:
    default: true
  stage: test
  script:
    - echo "Hérite de default"

job-no-inheritance:
  inherit:
    default: false
  stage: test
  image: alpine:latest
  script:
    - echo "N'hérite pas de default"
```

### Héritage sélectif

```yaml
default:
  image: ubuntu:22.04
  tags: [docker]
  cache:
    paths: [vendor/]
  artifacts:
    paths: [build/]
  retry: 2

job-inherit-partial:
  inherit:
    default:
      - image
      - tags
  stage: build
  script:
    - echo "Utilise image et tags de default"
    - echo "Ne pas hériter cache et artifacts"

job-inherit-all:
  inherit:
    default: true
  stage: test
  script:
    - echo "Hérite de tous les paramètres"
```

### Héritage avec extends et inherit combinés

```yaml
.base-configuration:
  image: node:18
  cache:
    paths: [node_modules/]
  retry: 2

.test-configuration:
  stage: test
  coverage: '/Coverage: \d+\.\d+%/'

test-with-full-inheritance:
  extends:
    - .base-configuration
    - .test-configuration
  inherit: true
  script:
    - npm install
    - npm test

test-with-selective-inheritance:
  extends:
    - .base-configuration
    - .test-configuration
  inherit:
    - image
    - cache
  stage: test
  script:
    - npm install
    - npm test
```

### Patterns avancés d'héritage

```yaml
.docker-service:
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY

.security-checks:
  script:
    - ./scripts/security-scan.sh
  artifacts:
    reports:
      sast: sast-report.json

.deployment-base:
  stage: deploy
  when: manual
  environment:
    name: $CI_ENVIRONMENT_NAME
  retry:
    max: 2

build-image:
  extends: .docker-service
  inherit:
    default:
      - tags
      - timeout
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .

scan-security:
  extends:
    - .docker-service
    - .security-checks
  inherit:
    default: true
  stage: test

deploy-staging:
  extends:
    - .deployment-base
  inherit:
    default:
      - tags
      - retry
  environment:
    name: staging
  script:
    - ./deploy.sh staging

deploy-production:
  extends:
    - .deployment-base
  inherit:
    default: false
  environment:
    name: production
  script:
    - ./deploy.sh production
```

## Progression et synthèse du chapitre

L'apprentissage de ces notions avancées suit une progression logique et hiérarchique. Commencer par la compréhension de `default` fournit les fondations nécessaires pour exploiter efficacement l'héritage. Cette compréhension préalable rend l'utilisation de `extends` et `inherit` beaucoup plus intuitive.

Par la suite, maîtriser la gestion des artifacts et dépendances permet de concevoir des pipelines robustes où les données circulent correctement entre les étapes. Le cache vient ensuite compléter cette compréhension en fournissant une couche d'optimisation pour les opérations répétitives.

La mesure du coverage s'appuie sur ces mécanismes de base pour injecter des rapports dans le pipeline. L'optimisation avec l'exécution en parallèle représente une étape où la connaissance des dépendances devient essentielle pour définir efficacement les graphes d'exécution.

Enfin, les patterns avancés de composition via `include`, la fusion avec les merge keys et le contrôle fin de l'héritage avec `inherit` constituent les techniques les plus sophistiquées. Ces dernières requièrent une compréhension solide de tous les éléments précédents pour être utilisées efficacement.

Cette progression garantit une compréhension progressive et une capacité croissante à concevoir des pipelines complexes et maintenables dans des environnements d'entreprise variés.
