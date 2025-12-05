# Citations
- https://www.winside.fr/blog/introduction-a-la-ci-cd-avec-gitlab-pour-les-developpeurs
- https://about.gitlab.com/fr-fr/blog/getting-started-with-gitlab-understanding-ci-cd/
- https://about.gitlab.com/fr-fr/blog/ultimate-guide-to-ci-cd-fundamentals-to-advanced-implementation/
- https://blog.eleven-labs.com/fr/introduction-gitlab-ci/
- https://blog.stephane-robert.info/docs/pipeline-cicd/gitlab/
- https://www.youtube.com/watch?v=UkUF827CGJY
- https://openclassrooms.com/fr/courses/2035736-mettez-en-place-l-integration-et-la-livraison-continues-avec-la-demarche-devops
- https://documentation.univ-lyon1.fr/gitlab/ci/
- https://about.gitlab.com/fr-fr/blog/basics-of-gitlab-ci-updated/
- https://www.youtube.com/watch?v=017CQCh3ogY


# Tokens
- prompt_tokens: 340
- completion_tokens: 6006
- total_tokens: 6346
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.09, 'request_cost': 0.006, 'total_cost': 0.097}


# Content
# Chapitre 5 : Projet 1 - GitLab CI/CD

## Introduction au projet

GitLab CI/CD représente une plateforme DevOps intégrée permettant d'automatiser l'ensemble du cycle de développement logiciel[1]. Ce projet vise à mettre en œuvre une pipeline CI/CD complète couvrant à la fois les aspects d'intégration continue (CI) et de déploiement continu (CD) pour une application composée d'un frontend et d'un backend.

L'objectif fondamental consiste à transformer le workflow de développement en automatisant chaque étape : compilation, tests, analyse de la couverture de code, et déploiement vers les environnements de préproduction et production[2]. Cette automatisation garantit que chaque modification de code est immédiatement validée, testée et prête pour la mise en production, tout en maintenant des standards de qualité élevés.

## Présentation du frontend et du backend

### Architecture générale

L'application se compose de deux composants distincts dont l'interaction s'effectue via des API REST :

**Backend** 📋
- Service REST API construite avec Spring Boot (Java)
- Responsable de la logique métier et de la gestion des données
- Communication via endpoints HTTP RESTful
- Base de données relationnelle pour la persistance

**Frontend** 🎨
- Application web développée avec des technologies modernes (React, Angular ou Vue.js)
- Interface utilisateur interactive
- Communication avec le backend via appels API HTTP/HTTPS
- Rendu client-side des contenus

### Interactions entre les composants

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **Langage** | Java/Spring Boot | JavaScript/TypeScript |
| **Responsabilité** | Logique métier, données | Interface utilisateur |
| **Communication** | Endpoints REST | Appels fetch/axios |
| **Tests** | Tests unitaires, tests d'intégration | Tests unitaires, tests e2e |
| **Déploiement** | Serveur applicatif | CDN ou serveur web statique |

### Pipeline globale

La pipeline CI/CD doit gérer les étapes suivantes pour chaque composant :

- **Build/Compilation** : Construction des artefacts (JAR pour backend, bundle JS pour frontend)
- **Tests unitaires** : Validation des fonctionnalités individuelles
- **Analyse de qualité** : Évaluation de la couverture de code et de la complexité
- **Tests d'intégrabilité** : Vérification de la communication inter-composants
- **Tests multi-navigateurs** : Pour le frontend uniquement, validation sur différents navigateurs
- **Déploiement** : Mise en ligne des versions compilées et testées

## Mise en place SSH pour le runner GitLab

### Concept fondamental des runners

Un GitLab Runner constitue un agent léger chargé d'exécuter les jobs définis dans la pipeline CI/CD[2]. Cet agent peut fonctionner sur l'infrastructure de choix : machines physiques, machines virtuelles, conteneurs Docker ou clusters Kubernetes[2].

### Configuration SSH avec le runner

La mise en place SSH pour le runner GitLab permet une communication sécurisée avec les serveurs de déploiement. Cette approche implique plusieurs étapes :

**Étape 1 : Génération des clés SSH**

```bash
# Sur la machine hébergeant le runner
ssh-keygen -t rsa -b 4096 -f ~/.ssh/gitlab-runner -C "gitlab-runner"
```

Cette commande génère une paire de clés : une clé privée (`gitlab-runner`) et une clé publique (`gitlab-runner.pub`).

**Étape 2 : Déploiement de la clé publique**

```bash
# Sur le serveur de déploiement cible
cat ~/.ssh/gitlab-runner.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Étape 3 : Configuration du fichier de configuration SSH**

La création d'un fichier de configuration SSH simplifie les connexions :

```bash
# ~/.ssh/config
Host deployment-server
    HostName 192.168.1.100
    User deploy
    IdentityFile ~/.ssh/gitlab-runner
    StrictHostKeyChecking no
```

**Étape 4 : Stockage sécurisé des clés dans GitLab**

Les clés SSH doivent être stockées en tant que variables CI/CD protégées dans GitLab :

1. Accéder à Settings → CI/CD → Variables
2. Créer une variable `SSH_PRIVATE_KEY` avec la clé privée encodée en base64
3. Marquer la variable comme « Protected » et « Masked »

**Étape 5 : Utilisation dans le `.gitlab-ci.yml`**

```yaml
before_script:
  - apt-get update && apt-get install -y openssh-client
  - eval $(ssh-agent -s)
  - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
  - mkdir -p ~/.ssh
  - chmod 700 ~/.ssh

deploy_job:
  stage: deploy
  script:
    - ssh -o StrictHostKeyChecking=no deploy@deployment-server "cd /var/www/app && ./deploy.sh"
```

### Vérification de la connectivité

```bash
# Test de connexion SSH
ssh -i ~/.ssh/gitlab-runner deploy@deployment-server "echo 'SSH connection successful'"
```

## Mise en place des jobs CI pour le backend

### Structure du fichier `.gitlab-ci.yml`

Le fichier `.gitlab-ci.yml` constitue le cœur de la configuration CI/CD dans GitLab[1]. Sa structure définit les étapes, les jobs et leur orchestration.

### Stages de pipeline pour le backend

```yaml
stages:
  - build
  - test
  - analyze
  - deploy
```

### Job de compilation backend

**Build Spring Boot**

```yaml
build_backend:
  stage: build
  image: maven:3.8.1-openjdk-11
  script:
    - echo "Building Spring Boot application..."
    - mvn clean package -DskipTests
  artifacts:
    paths:
      - target/api-*.jar
    expire_in: 1 day
  cache:
    paths:
      - .m2/repository/
  only:
    - main
    - develop
```

Ce job effectue les opérations suivantes :

- Utilise l'image Docker `maven:3.8.1-openjdk-11` contenant Maven et OpenJDK 11
- Exécute une compilation Maven complète
- Génère un artefact (fichier JAR) stocké pour une journée
- Met en cache les dépendances Maven pour accélérer les builds ultérieurs
- S'exécute uniquement sur les branches `main` et `develop`

### Jobs de tests unitaires backend

**Tests unitaires et d'intégration**

```yaml
test_backend_unit:
  stage: test
  image: maven:3.8.1-openjdk-11
  script:
    - echo "Running unit tests..."
    - mvn test
    - echo "Running integration tests..."
    - mvn verify
  artifacts:
    reports:
      junit: target/surefire-reports/TEST-*.xml
  cache:
    paths:
      - .m2/repository/
  dependencies:
    - build_backend
  allow_failure: false
```

Les artifacts `junit` permettent à GitLab d'afficher les résultats des tests directement dans l'interface.

### Job de qualité du code backend

**Analyse SonarQube**

```yaml
analyze_backend_sonarqube:
  stage: analyze
  image: maven:3.8.1-openjdk-11
  script:
    - echo "Analyzing code quality with SonarQube..."
    - mvn sonar:sonar 
      -Dsonar.projectKey=backend-project
      -Dsonar.sources=src
      -Dsonar.host.url=$SONARQUBE_URL
      -Dsonar.login=$SONARQUBE_TOKEN
  allow_failure: true
  only:
    - merge_requests
    - main
```

## Couverture du code backend

### Génération des rapports de couverture

La couverture de code mesure le pourcentage de code exécuté pendant les tests. Pour le backend Spring Boot, l'outil JaCoCo (Java Code Coverage) est couramment utilisé.

**Configuration Maven avec JaCoCo**

```xml
<!-- pom.xml -->
<properties>
    <sonar.coverage.exclusions>
        **/config/**,
        **/entity/**,
        **/dto/**
    </sonar.coverage.exclusions>
</properties>

<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.7</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**Job CI pour la couverture**

```yaml
coverage_backend:
  stage: analyze
  image: maven:3.8.1-openjdk-11
  script:
    - mvn clean test jacoco:report
    - cat target/site/jacoco/index.html
  artifacts:
    paths:
      - target/site/jacoco/
    expire_in: 30 days
  coverage: '/Total.*?(\d+)%/'
  cache:
    paths:
      - .m2/repository/
```

### Seuils de couverture et qualité gates

```yaml
quality_gate_backend:
  stage: analyze
  image: maven:3.8.1-openjdk-11
  script:
    - |
      COVERAGE=$(mvn jacoco:report | grep -oP 'Total.*?\K\d+(?=%)')
      if [ "$COVERAGE" -lt 70 ]; then
        echo "Couverture insuffisante: $COVERAGE%"
        exit 1
      fi
  dependencies:
    - coverage_backend
  allow_failure: false
```

## Planification des jobs frontend et refactorisation du cache

### Stages pour le frontend

```yaml
stages:
  - build
  - test
  - lint
  - e2e
  - deploy
```

### Job de construction frontend

**Build avec npm/yarn**

```yaml
build_frontend:
  stage: build
  image: node:16-alpine
  script:
    - echo "Installing dependencies..."
    - npm ci
    - echo "Building application..."
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
  only:
    - main
    - develop
```

L'utilisation de `npm ci` (clean install) au lieu de `npm install` garantit l'installation exacte des versions spécifiées.

### Optimisation du cache multi-étages

**Refactorisation pour réutiliser les dépendances**

```yaml
cache_dependencies:
  stage: .pre
  image: node:16-alpine
  script:
    - npm ci
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 day

build_frontend:
  stage: build
  image: node:16-alpine
  script:
    - npm run build
  dependencies:
    - cache_dependencies
  artifacts:
    paths:
      - dist/
    expire_in: 1 day

test_frontend:
  stage: test
  image: node:16-alpine
  script:
    - npm run test
  dependencies:
    - cache_dependencies
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'

lint_frontend:
  stage: lint
  image: node:16-alpine
  script:
    - npm run lint
  dependencies:
    - cache_dependencies
  allow_failure: true
```

### Stratégies de cache avancées

| Stratégie | Utilisation | Avantages |
|-----------|-----------|----------|
| **Cache par fichier** | Quand les dépendances changent rarement | Rapidité maximale |
| **Cache par branche** | Pour des branches isolées avec dépendances spécifiques | Isolation par branche |
| **Cache partage global** | Pour les tâches communes | Partage entre toutes les branches |

**Configuration cache avancée**

```yaml
cache:
  key:
    prefix: ${CI_COMMIT_REF_SLUG}
    files:
      - package-lock.json
  paths:
    - node_modules/
  policy: pull-push
```

## Couverture du code frontend

### Configuration des outils de couverture

**Installation et configuration de Jest avec couverture**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/**/*.spec.js',
    '!src/config/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Job de couverture frontend

```yaml
coverage_frontend:
  stage: test
  image: node:16-alpine
  script:
    - npm ci
    - npm run test:coverage
  artifacts:
    paths:
      - coverage/
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    expire_in: 30 days
  coverage: '/Statements\s*:\s*(\d+\.\d+)%/'
```

### Configuration pour Istanbul/nyc

```json
{
  "nyc": {
    "reporter": ["text", "cobertura", "html"],
    "temp-dir": ".nyc_output",
    "report-dir": "coverage",
    "exclude": [
      "node_modules/**",
      "test/**",
      "dist/**"
    ],
    "check-coverage": true,
    "lines": 70,
    "statements": 70,
    "functions": 70,
    "branches": 70
  }
}
```

## Exécution multi-navigateurs

### Tests e2e avec Cypress

**Configuration Cypress pour multi-navigateurs**

```javascript
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',
    supportFile: 'cypress/support/e2e.js'
  }
};
```

### Jobs CI pour tests multi-navigateurs

```yaml
e2e_chrome:
  stage: e2e
  image: cypress/browsers:node16.13.0-chrome95
  script:
    - npm ci
    - npm run build
    - npx cypress run --browser chrome
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
    expire_in: 7 days
  only:
    - main
    - develop

e2e_firefox:
  stage: e2e
  image: cypress/browsers:node16.13.0-firefox
  script:
    - npm ci
    - npm run build
    - npx cypress run --browser firefox
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
    expire_in: 7 days
  only:
    - main
    - develop

e2e_edge:
  stage: e2e
  image: cypress/browsers:node16.13.0-edge
  script:
    - npm ci
    - npm run build
    - npx cypress run --browser edge
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
    expire_in: 7 days
  only:
    - main
    - develop
```

### Tests parallélisés

```yaml
e2e_parallel:
  stage: e2e
  image: cypress/included:13.0.0
  parallel:
    matrix:
      - BROWSER: [chrome, firefox, edge]
        SPEC: [
          "cypress/e2e/auth/**",
          "cypress/e2e/dashboard/**",
          "cypress/e2e/profile/**"
        ]
  script:
    - npx cypress run --browser $BROWSER --spec "$SPEC"
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
    expire_in: 7 days
```

## Mise en place du job CD pour le déploiement backend

### Concept du déploiement continu

Le déploiement continu (CD) automatise la mise en ligne des applications compilées et testées. Chaque build réussi passant tous les contrôles de qualité peut être déployé automatiquement ou sur demande[2].

### Job de déploiement backend

**Déploiement sur serveur applicatif**

```yaml
deploy_backend_staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - |
      ssh -o StrictHostKeyChecking=no deploy@staging-server << 'EOF'
      cd /var/www/backend
      systemctl stop backend || true
      cp target/api-*.jar ./api-latest.jar
      systemctl start backend
      systemctl status backend
      EOF
  environment:
    name: staging
    url: https://staging-api.example.com
  dependencies:
    - build_backend
    - test_backend_unit
    - coverage_backend
  only:
    - develop
  when: on_success

deploy_backend_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - |
      ssh -o StrictHostKeyChecking=no deploy@prod-server << 'EOF'
      cd /var/www/backend
      # Backup de la version actuelle
      cp api-latest.jar api-backup-$(date +%s).jar
      systemctl stop backend
      cp target/api-*.jar ./api-latest.jar
      systemctl start backend
      systemctl status backend
      EOF
  environment:
    name: production
    url: https://api.example.com
  dependencies:
    - build_backend
    - test_backend_unit
    - coverage_backend
  only:
    - main
  when: manual
```

### Déploiement avec Docker

**Utilisation d'images Docker pour le déploiement**

```yaml
build_backend_docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t registry.example.com/backend:$CI_COMMIT_SHA .
    - docker tag registry.example.com/backend:$CI_COMMIT_SHA registry.example.com/backend:latest
    - docker push registry.example.com/backend:$CI_COMMIT_SHA
    - docker push registry.example.com/backend:latest
  only:
    - main

deploy_backend_docker:
  stage: deploy
  image: alpine:latest
  script:
    - |
      ssh -o StrictHostKeyChecking=no deploy@prod-server << 'EOF'
      cd /var/www/backend
      docker pull registry.example.com/backend:latest
      docker stop backend-container || true
      docker rm backend-container || true
      docker run -d --name backend-container \
        -p 8080:8080 \
        -e DATABASE_URL=$DATABASE_URL \
        registry.example.com/backend:latest
      EOF
  environment:
    name: production
  only:
    - main
  when: manual
```

### Health checks post-déploiement

```yaml
health_check_backend:
  stage: deploy
  image: curlimages/curl:latest
  script:
    - |
      for i in {1..30}; do
        if curl -f https://api.example.com/health; then
          echo "Backend is healthy"
          exit 0
        fi
        echo "Attempt $i/30 - waiting for backend to be ready..."
        sleep 5
      done
      echo "Backend failed to become healthy"
      exit 1
  environment:
    name: production
  dependencies:
    - deploy_backend_production
  only:
    - main
```

## Implémentation des jobs CI client

### Jobs spécifiques au frontend

**Suite complète des jobs CI client**

```yaml
lint_code:
  stage: lint
  image: node:16-alpine
  script:
    - npm ci
    - npm run lint -- --format json --output-file lint-report.json || true
    - npm run lint
  artifacts:
    reports:
      codequality: lint-report.json
  allow_failure: true

format_check:
  stage: lint
  image: node:16-alpine
  script:
    - npm ci
    - npm run format:check
  allow_failure: true

security_audit:
  stage: test
  image: node:16-alpine
  script:
    - npm ci
    - npm audit --audit-level=moderate
  allow_failure: true

build_optimized:
  stage: build
  image: node:16-alpine
  script:
    - npm ci
    - npm run build
    - echo "Build Size Analysis:"
    - du -sh dist/
    - ls -lh dist/
  artifacts:
    paths:
      - dist/
    expire_in: 1 day

accessibility_check:
  stage: test
  image: node:16-alpine
  script:
    - npm ci
    - npm run test:a11y
  allow_failure: true
  artifacts:
    reports:
      junit: a11y-report.xml
```

### Tests d'intégration client-backend

```yaml
integration_tests:
  stage: test
  image: node:16-alpine
  services:
    - name: registry.example.com/backend:latest
      alias: backend
  script:
    - npm ci
    - npm run test:integration
      -- --baseUrl=http://backend:8080
  environment:
    name: integration-test
  artifacts:
    when: always
    paths:
      - integration-test-results/
    reports:
      junit: integration-test-results/junit.xml
```

### Deployment frontend

```yaml
deploy_frontend_staging:
  stage: deploy
  image: node:16-alpine
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
  script:
    - npm ci
    - npm run build
    - |
      ssh -o StrictHostKeyChecking=no deploy@staging-cdn << 'EOF'
      cd /var/www/frontend
      rm -rf dist-old
      mv dist dist-old || true
      EOF
    - scp -r dist/* deploy@staging-cdn:/var/www/frontend/dist/
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop
  when: on_success

deploy_frontend_production:
  stage: deploy
  image: node:16-alpine
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
  script:
    - npm ci
    - npm run build
    - |
      ssh -o StrictHostKeyChecking=no deploy@prod-cdn << 'EOF'
      cd /var/www/frontend
      cp -r dist dist-backup-$(date +%s) || true
      EOF
    - scp -r dist/* deploy@prod-cdn:/var/www/frontend/dist/
    - ssh deploy@prod-cdn "chmod -R 755 /var/www/frontend/dist"
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual
```

### Pipeline complète consolidée

```yaml
image: docker:latest

stages:
  - .pre
  - build
  - test
  - lint
  - analyze
  - e2e
  - deploy
  - verify

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

# Backend Jobs
build_backend:
  stage: build
  image: maven:3.8.1-openjdk-11
  script:
    - mvn clean package -DskipTests
  artifacts:
    paths:
      - target/api-*.jar
    expire_in: 1 day
  cache:
    paths:
      - .m2/repository/

test_backend:
  stage: test
  image: maven:3.8.1-openjdk-11
  script:
    - mvn test
  cache:
    paths:
      - .m2/repository/

# Frontend Jobs
build_frontend:
  stage: build
  image: node:16-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/

test_frontend:
  stage: test
  image: node:16-alpine
  script:
    - npm ci
    - npm run test:coverage
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/

e2e_tests:
  stage: e2e
  image: cypress/included:13.0.0
  script:
    - npm ci
    - npx cypress run
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying application..."
  only:
    - main
  when: manual
```

---

Cette implémentation complète couvre l'ensemble du cycle de développement, de la compilation au déploiement, en passant par les tests unitaires, l'analyse de couverture, les tests multi-navigateurs et le déploiement continu[1][2][3]. La structure modulaire permet une adaptation facile selon les besoins spécifiques du projet et de l'infrastructure d'entreprise.
