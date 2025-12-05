# Citations
- https://spacelift.io/blog/docker-ci-cd
- https://docs.gitlab.com/ci/quick_start/tutorial/
- https://dev.to/arbythecoder/introduction-to-docker-integration-in-gitlab-cicd-pipelines-4lg6
- https://docs.gitlab.com/ci/quick_start/
- https://docs.gitlab.com/ci/docker/using_docker_images/
- https://www.youtube.com/watch?v=z7nLsJvEyMY
- https://octopus.com/devops/gitlab/gitlab-cicd-tutorial/
- https://docs.gitlab.com/ci/docker/using_docker_build/


# Tokens
- prompt_tokens: 306
- completion_tokens: 7010
- total_tokens: 7316
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.105, 'request_cost': 0.006, 'total_cost': 0.112}


# Content
# 📚 Chapitre 6 : Projet 2 - GitLab CI/CD avec Docker

## 🎯 Présentation du projet et GitLab Container Registry

GitLab CI/CD représente une plateforme complète d'intégration et de déploiement continus permettant d'automatiser l'ensemble du cycle de vie applicatif, de la compilation au déploiement en production.[1] Lorsqu'on l'associe à Docker, cette puissance s'accroît considérablement en offrant une isolation maximale des environnements et une cohérence garantie entre le développement, les tests et la production.[3]

### Fondamentaux de GitLab CI/CD et Docker

GitLab CI/CD fonctionne selon un modèle déclaratif où chaque pipeline est défini dans un fichier `.gitlab-ci.yml` situé à la racine du référentiel.[4] Ce fichier décrit les étapes, les jobs et les conditions d'exécution. Docker intervient à deux niveaux :

**Premier niveau - Exécution des jobs** : La plateforme GitLab crée un nouveau conteneur Docker pour chaque job du pipeline.[1] Le script du job s'exécute à l'intérieur du conteneur, fournissant une isolation par job qui prévient les effets secondaires indésirables et renforce la sécurité.

**Deuxième niveau - Construction et déploiement** : Un job du pipeline est utilisé pour construire une image Docker mise à jour suite aux modifications du code source, image qui peut ensuite être déployée en production dans un job ultérieur.[1]

### GitLab Container Registry

GitLab Container Registry est un registre intégré natif fourni par GitLab permettant de stocker et de gérer les images Docker sans configuration externe.[1] Ce registre présente plusieurs avantages :

- **Accessibilité** : Directement accessible depuis l'interface web sous **Deploy > Container Registry**
- **Authentification intégrée** : Utilise les credentials GitLab pour l'accès
- **Versioning automatique** : Les images sont taguées avec le SHA du commit, permettant une traçabilité complète
- **Déploiement facilité** : Les images peuvent être directement déployées vers différents environnements

Le registre stocke les images avec une nomenclature standardisée : `$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA`, où `$CI_REGISTRY_IMAGE` correspond à l'URL du registre et du projet, tandis que `$CI_COMMIT_SHA` représente l'identifiant unique du commit.[1]

---

## 🏗️ Création des images et push manuel

### Préparation de l'environnement GitLab

Avant de commencer la création d'images Docker, plusieurs étapes préalables sont nécessaires[4] :

- **Vérifier la disponibilité des runners** : Si l'utilisation se fait sur GitLab.com, les instance runners sont fournis par défaut. Pour une instance GitLab auto-hébergée, un GitLab Runner configuré avec l'exécuteur Docker doit être préalablement connecté.
- **Créer un nouveau projet** : Sur GitLab.com ou une instance locale
- **Initialiser le référentiel** : Cloner le projet localement pour commencer le développement

### Structure du projet et Dockerfile

La première étape concrète consiste à créer le fichier `Dockerfile` qui définit la configuration de l'image applicative. Voici un exemple simplifié :

```dockerfile
FROM httpd:alpine

RUN echo "<h1>Hello World</h1>" > /usr/local/apache2/htdocs/index.html
```

Ce Dockerfile utilise l'image légère `httpd:alpine` comme base et crée une page HTML de test. Après création, le fichier doit être commité et poussé vers le référentiel :

```bash
$ git add Dockerfile
$ git commit -m "Add Dockerfile"
$ git push
```

### Variables d'environnement et authentification

Pour permettre à la pipeline de construire et pousser les images vers le GitLab Container Registry, des variables d'environnement doivent être configurées.[3] L'accès s'effectue via **Settings > CI/CD > Variables** dans l'interface GitLab :

| Variable | Description | Source |
|----------|-------------|--------|
| `CI_REGISTRY` | URL du registre de conteneurs GitLab | Automatiquement définie |
| `CI_REGISTRY_USER` | Nom d'utilisateur GitLab | Automatiquement définie |
| `CI_REGISTRY_PASSWORD` | Token d'accès personnel GitLab | À générer dans les paramètres du profil |
| `CI_REGISTRY_IMAGE` | Chemin complet de l'image (registre + projet) | Automatiquement définie |

### Push manuel versus automatisé

Le push manuel d'une image implique une intervention humaine à chaque étape. Bien que cela soit possible localement via Docker CLI, cette approche ne correspond pas au paradigme CI/CD. Le flux optimal automatise ce processus directement dans la pipeline, sans intervention manuelle.

---

## 🚀 Construction des images dans un pipeline

### Configuration de la pipeline GitLab

La construction automatisée des images s'effectue par la création d'un fichier `.gitlab-ci.yml` à la racine du projet.[4] Ce fichier YAML orchestre l'ensemble des étapes de la pipeline. Voici une configuration fondamentale :

```yaml
stages:
  - build

variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

build:
  image: docker:25.0
  stage: build
  services:
    - docker:25.0-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE
```

### Décomposition de la configuration

**Section stages** : Définit les phases d'exécution de la pipeline. Dans cet exemple simple, une seule phase `build` existe.

**Section variables** : Déclare les variables utilisées dans l'ensemble de la pipeline. `DOCKER_IMAGE` combine le registre et le SHA du commit pour une identification unique.

**Section build** : Décrit le job principal de construction :
- `image: docker:25.0` : Sélectionne l'image Docker à utiliser pour exécuter le job[5]
- `services: docker:25.0-dind` : Active Docker-in-Docker (DinD), permettant au job Docker d'accéder à un daemon Docker[1]
- `script` : Contient les commandes à exécuter

### Mécanisme Docker-in-Docker (DinD)

Docker-in-Docker est une technique permettant d'exécuter Docker à l'intérieur d'un conteneur Docker.[1] Le job s'exécute dans un conteneur `docker:25.0`, et grâce au service DinD, le daemon Docker est accessible à l'intérieur. Les commandes suivantes s'exécutent donc :

```bash
docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
docker build -t $DOCKER_IMAGE .
docker push $DOCKER_IMAGE
```

L'authentification d'abord établie, la construction de l'image procède à partir du Dockerfile local, puis l'image est poussée vers le registre GitLab.

### Pipeline avancée avec plusieurs stages

Pour des projets plus complexes, une pipeline multi-étapes s'avère bénéfique :

```yaml
stages:
  - build
  - push

variables:
  DOCKER_DRIVER: overlay2
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG

build_image:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $IMAGE_TAG .
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
    - docker tag $IMAGE_TAG $CI_REGISTRY_IMAGE:latest

push_image:
  stage: push
  image: docker:latest
  services:
    - docker:dind
  script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
    - docker push $IMAGE_TAG
    - docker push $CI_REGISTRY_IMAGE:latest
```

Cette approche sépare construction et push en deux jobs distincts, offrant une meilleure clarté et permettant une réutilisation du job build par plusieurs jobs push avec des destinations différentes.

### Tagging intelligent des images

L'utilisation de `$CI_COMMIT_REF_SLUG` comme tag combine le nom de la branche avec un identifiant stable, facilitant le suivi des versions.[3] Simultanément, créer un tag `latest` pour la branche principale permet à l'environnement de production de toujours déployer la version la plus récente.

---

## 🧪 Tests des images avant de les pousser

### Stratégie de validation des images

Avant de pousser une image vers le registre de production, valider son intégrité et son fonctionnement s'avère essentiel. Cette validation s'effectue dans la pipeline même, avant l'étape de push, réduisant ainsi le risque de déploiement d'images défectueuses.

### Tests de construction de l'image

Le premier niveau de test vérifie que la construction elle-même réussit sans erreur :

```yaml
stages:
  - build
  - test
  - push

build_image:
  stage: build
  image: docker:25.0
  services:
    - docker:25.0-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
  artifacts:
    reports:
      dotenv: build.env
  after_script:
    - echo "IMAGE_TAG=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" >> build.env
```

Ce job crée un artefact contenant le tag de l'image, permettant aux jobs ultérieurs de le réutiliser.

### Tests fonctionnels de l'image

Après construction, exécuter des tests à l'intérieur de l'image elle-même valide son fonctionnement :

```yaml
test_image:
  stage: test
  image: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  dependencies:
    - build_image
  script:
    - echo "Testing application inside the container..."
    - whoami
    - pwd
    - ls -la
    - |
      if [ -f "/usr/local/apache2/htdocs/index.html" ]; then
        echo "✓ Application files present"
      else
        echo "✗ Application files missing"
        exit 1
      fi
  only:
    - merge_requests
    - main
```

Ce job utilise l'image construite et exécute des commandes de validation à l'intérieur.

### Tests de sécurité

Analyser l'image pour détecter les vulnérabilités connues renforce la qualité :

```yaml
security_scan:
  stage: test
  image: aquasec/trivy:latest
  services:
    - docker:dind
  script:
    - trivy image --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  allow_failure: true
```

Trivy analyse les couches de l'image et identifie les CVE (Common Vulnerabilities and Exposures) connus.[3]

### Push conditionnel

Le push ne s'effectue que si tous les tests ont réussi :

```yaml
push_image:
  stage: push
  image: docker:25.0
  services:
    - docker:25.0-dind
  script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
```

---

## 🔗 Tests e2e (End-to-End)

### Définition et objectifs des tests e2e

Les tests end-to-end vérifient que l'application complète, déployée dans son environnement d'exécution réel, fonctionne correctement du point de vue de l'utilisateur final.[2] Contrairement aux tests unitaires qui testent des composants isolés, les tests e2e valident les flux métier complets en conditions de production.

### Architecture des tests e2e dans une pipeline

Les tests e2e nécessitent que l'application soit exécutée et accessible. Dans un contexte CI/CD, cela implique :

1. Construction de l'image de l'application
2. Déploiement de l'image dans un conteneur de test
3. Exécution des tests e2e contre l'application en cours d'exécution
4. Collecte des résultats et cleanup

### Configuration d'une étape de tests e2e

```yaml
stages:
  - build
  - test
  - e2e
  - push

build_image:
  stage: build
  image: docker:25.0
  services:
    - docker:25.0-dind
  script:
    - docker build -t app:$CI_COMMIT_SHA .
    - docker tag app:$CI_COMMIT_SHA app:latest
  artifacts:
    reports:
      dotenv: build.env
  after_script:
    - echo "APP_IMAGE=app:$CI_COMMIT_SHA" >> build.env

e2e_tests:
  stage: e2e
  image: docker:25.0
  services:
    - docker:25.0-dind
  dependencies:
    - build_image
  script:
    - apk add --no-cache curl
    - docker run -d --name test-app -p 8080:80 app:latest
    - sleep 5
    - |
      for i in {1..10}; do
        if curl -f http://test-app:8080/ > /dev/null; then
          echo "✓ Application is responding"
          break
        else
          echo "Waiting for application... ($i/10)"
          sleep 2
        fi
      done
    - |
      if curl -f http://test-app:8080/ | grep -q "Hello World"; then
        echo "✓ Content validation passed"
      else
        echo "✗ Content validation failed"
        exit 1
      fi
  after_script:
    - docker stop test-app || true
    - docker rm test-app || true
  only:
    - merge_requests
    - main
```

### Tests avec outils spécialisés

Pour des applications plus complexes, utiliser des outils de test e2e dédiés :

```yaml
e2e_with_cypress:
  stage: e2e
  image: cypress:latest
  services:
    - docker:25.0-dind
  script:
    - npm ci
    - npm run build
    - npx cypress run --headless --browser chrome
  artifacts:
    when: always
    paths:
      - cypress/screenshots
      - cypress/videos
  only:
    - merge_requests
```

### Orchestration avec Docker Compose

Pour des applications multi-conteneurs, Docker Compose simplifie l'orchestration :

```yaml
e2e_docker_compose:
  stage: e2e
  image: docker:25.0
  services:
    - docker:25.0-dind
  before_script:
    - apk add --no-cache docker-compose
  script:
    - docker-compose up -d
    - sleep 10
    - docker-compose ps
    - docker-compose exec -T app npm run e2e:test
  after_script:
    - docker-compose down -v
  only:
    - merge_requests
```

### Rapports et artefacts

Collecter les résultats des tests pour analyse ultérieure :

```yaml
e2e_tests:
  stage: e2e
  artifacts:
    when: always
    reports:
      junit: test-results/e2e-results.xml
    paths:
      - test-results/
      - screenshots/
  only:
    - merge_requests
    - main
```

---

## 🐳 Déploiement avec Docker Compose

### Principes du déploiement orchestré

Docker Compose automatise le déploiement d'applications multi-conteneurs en définissant tous les services, volumes et réseaux dans un fichier `docker-compose.yml` unique.[1] Cette approche s'intègre naturellement dans les pipelines GitLab pour déployer les images construites vers des environnements de staging ou production.

### Structure d'un fichier docker-compose.yml

```yaml
version: '3.9'

services:
  app:
    image: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    container_name: app-container
    ports:
      - "80:80"
    environment:
      - ENVIRONMENT=production
      - DATABASE_URL=postgresql://user:password@db:5432/appdb
    depends_on:
      - db
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    container_name: app-db
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: app-nginx
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network
    restart: unless-stopped

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

### Intégration dans la pipeline de déploiement

```yaml
stages:
  - build
  - test
  - push
  - deploy_staging

deploy_staging:
  stage: deploy_staging
  image: docker:25.0
  services:
    - docker:25.0-dind
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - apk add --no-cache docker-compose openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan -H staging-server.example.com >> ~/.ssh/known_hosts
    - scp docker-compose.yml user@staging-server.example.com:/opt/app/
    - scp .env user@staging-server.example.com:/opt/app/
    - |
      ssh user@staging-server.example.com << 'EOF'
      cd /opt/app
      export CI_REGISTRY_IMAGE=$CI_REGISTRY_IMAGE
      export CI_COMMIT_SHA=$CI_COMMIT_SHA
      docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
      docker-compose pull
      docker-compose up -d
      EOF
  only:
    - main
```

### Gestion des configurations et secrets

Utiliser des fichiers `.env` pour stocker les variables sensibles, sans les commiter au référentiel :

```env
POSTGRES_USER=appuser
POSTGRES_PASSWORD=securepassword123
DATABASE_URL=postgresql://appuser:securepassword123@db:5432/appdb
REDIS_URL=redis://redis:6379
API_KEY=secret_api_key_here
JWT_SECRET=jwt_secret_key_here
```

Dans GitLab, stocker ces valeurs en tant que variables protégées dans **Settings > CI/CD > Variables** :

```yaml
deploy_staging:
  script:
    - |
      cat > .env << EOF
      POSTGRES_USER=$DB_USER
      POSTGRES_PASSWORD=$DB_PASSWORD
      DATABASE_URL=$DATABASE_URL
      API_KEY=$API_KEY
      JWT_SECRET=$JWT_SECRET
      EOF
```

### Santé et monitoring du déploiement

Implémenter des vérifications de santé pour assurer le bon fonctionnement après déploiement :

```yaml
deploy_staging:
  script:
    # ... déploiement ...
    - sleep 30
    - |
      for i in {1..20}; do
        if curl -f https://staging.example.com/health > /dev/null 2>&1; then
          echo "✓ Application is healthy"
          exit 0
        else
          echo "Waiting for application health check... ($i/20)"
          sleep 5
        fi
      done
      echo "✗ Application health check failed"
      exit 1
```

### Rollback en cas d'échec

Prévoir un mécanisme de rollback pour revenir à la version précédente en cas de problème :

```yaml
deploy_staging:
  script:
    - |
      ssh user@staging-server.example.com << 'EOF'
      cd /opt/app
      cp docker-compose.yml docker-compose.yml.new
      if ! docker-compose -f docker-compose.yml.new up -d; then
        echo "Deployment failed, rolling back..."
        rm docker-compose.yml.new
        exit 1
      fi
      EOF
```

---

## 🌍 Environnement de staging

### Concept et importance du staging

L'environnement de staging reproduit aussi fidèlement que possible l'environnement de production, permettant de valider les déploiements avant leur mise en ligne réelle.[3] Cet environnement intermédiaire capture les bugs et problèmes de configuration sans impacter les utilisateurs finaux.

### Architecture multi-environnements

```yaml
stages:
  - build
  - test
  - push
  - deploy_staging
  - approve_production
  - deploy_production

variables:
  REGISTRY_URL: $CI_REGISTRY
  STAGING_SERVER: staging.example.com
  PRODUCTION_SERVER: prod.example.com

build_image:
  stage: build
  image: docker:25.0
  services:
    - docker:25.0-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:staging
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy_staging:
  stage: deploy_staging
  image: alpine:latest
  environment:
    name: staging
    url: https://staging.example.com
    deployment_tier: staging
  script:
    - apk add --no-cache openssh-client docker-cli
    - eval $(ssh-agent -s)
    - echo "$STAGING_DEPLOY_KEY" | ssh-add -
    - mkdir -p ~/.ssh && chmod 700 ~/.ssh
    - ssh-keyscan $STAGING_SERVER >> ~/.ssh/known_hosts
    - |
      ssh deploy@$STAGING_SERVER << 'DEPLOY'
      cd /opt/app-staging
      export IMAGE_TAG=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
      docker-compose -f docker-compose.staging.yml pull
      docker-compose -f docker-compose.staging.yml up -d
      DEPLOY
  only:
    - develop
    - merge_requests

approve_production:
  stage: approve_production
  environment:
    name: production
  script:
    - echo "Ready for production deployment"
  when: manual
  only:
    - main

deploy_production:
  stage: deploy_production
  image: alpine:latest
  environment:
    name: production
    url: https://example.com
    deployment_tier: production
  script:
    - apk add --no-cache openssh-client docker-cli
    - eval $(ssh-agent -s)
    - echo "$PRODUCTION_DEPLOY_KEY" | ssh-add -
    - mkdir -p ~/.ssh && chmod 700 ~/.ssh
    - ssh-keyscan $PRODUCTION_SERVER >> ~/.ssh/known_hosts
    - |
      ssh deploy@$PRODUCTION_SERVER << 'DEPLOY'
      cd /opt/app
      export IMAGE_TAG=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
      docker-compose -f docker-compose.prod.yml pull
      docker-compose -f docker-compose.prod.yml up -d
      DEPLOY
  only:
    - main
  when: manual
```

### Fichiers docker-compose distincts par environnement

Maintenir des fichiers `docker-compose` spécifiques permet d'adapter les ressources et configurations à chaque environnement.

**docker-compose.staging.yml** :

```yaml
version: '3.9'

services:
  app:
    image: $IMAGE_TAG
    environment:
      - NODE_ENV=staging
      - LOG_LEVEL=debug
      - DATABASE_URL=postgresql://staging_user:pass@db:5432/staging_db
    ports:
      - "8080:3000"
    resources:
      limits:
        cpus: '1'
        memory: 512M
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=staging_user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=staging_db
    volumes:
      - staging-db-data:/var/lib/postgresql/data
    resources:
      limits:
        cpus: '0.5'
        memory: 256M

volumes:
  staging-db-data:
```

**docker-compose.prod.yml** :

```yaml
version: '3.9'

services:
  app:
    image: $IMAGE_TAG
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=warn
      - DATABASE_URL=postgresql://$PROD_DB_USER:$PROD_DB_PASSWORD@db:5432/prod_db
    ports:
      - "3000:3000"
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 2G
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 5

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=$PROD_DB_USER
      - POSTGRES_PASSWORD=$PROD_DB_PASSWORD
      - POSTGRES_DB=prod_db
    volumes:
      - prod-db-data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: always

volumes:
  prod-db-data:
```

### Gestion des données et migrations

Implémenter des migrations de base de données automatisées lors du déploiement :

```yaml
deploy_staging:
  script:
    - |
      ssh deploy@$STAGING_SERVER << 'DEPLOY'
      cd /opt/app-staging
      # Démarrer les services
      docker-compose -f docker-compose.staging.yml up -d
      # Attendre que la base soit prête
      sleep 5
      # Exécuter les migrations
      docker-compose -f docker-compose.staging.yml exec -T app npm run migrate:run
      # Exécuter les seeds si nécessaire
      docker-compose -f docker-compose.staging.yml exec -T app npm run seed
      DEPLOY
```

### Monitoring et logging du staging

Configurer la collecte des logs pour surveillance du staging :

```yaml
version: '3.9'

services:
  app:
    image: $IMAGE_TAG
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
        labels: "service=app,environment=staging"
    environment:
      - LOG_FORMAT=json
```

### Tests d'acceptation utilisateur en staging

Avant production, valider le comportement métier en staging :

```yaml
test_staging:
  stage: test
  image: node:18-alpine
  environment:
    name: staging
  script:
    - npm ci
    - npm run test:acceptance -- --base-url https://staging.example.com
  only:
    - merge_requests
```

### Promotion vers production

La promotion du code de staging vers production doit être délibérée et contrôlée :

```yaml
approve_production:
  stage: approve_production
  script:
    - |
      echo "Staging deployment passed all tests and validations."
      echo "Ready for manual promotion to production."
  when: manual
  only:
    - main

deploy_production:
  stage: deploy_production
  script:
    - |
      ssh deploy@$PRODUCTION_SERVER << 'DEPLOY'
      cd /opt/app
      export IMAGE_TAG=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
      docker-compose -f docker-compose.prod.yml pull
      docker-compose -f docker-compose.prod.yml up -d --scale app=3
      DEPLOY
  when: manual
  only:
    - main
```

### Comparaison des trois environnements

| Aspect | Développement | Staging | Production |
|--------|---|---|---|
| **Accès** | Local/Équipe | Équipe interne | Utilisateurs finaux |
| **Ressources** | Minimales | Modérées | Maximales |
| **Données** | Factices | Représentatives | Réelles |
| **Déploiements** | Fréquents | Occasionnels | Rares et contrôlés |
| **Rollback** | Instantané | Rapide | Planifié |
| **SLA** | Aucun | 99% | 99.99% |

---

## 🎓 Synthèse du parcours d'apprentissage

Le parcours proposé progresse du simple vers le complexe, en commençant par les fondamentaux de GitLab CI/CD et Docker, puis en construisant progressivement une infrastructure robuste de déploiement multi-environnements.

### Phase 1 : Fondamentaux
La compréhension initiale porte sur la façon dont GitLab CI/CD et Docker interagissent, en particulier le concept de Docker-in-Docker et l'utilisation du GitLab Container Registry. Cette phase établit les bases nécessaires pour toutes les étapes ultérieures.

### Phase 2 : Automatisation
La création et la construction automatisées des images Docker au sein de pipelines représentent le premier pas vers une véritable intégration continue. Cette phase transforme les processus manuels en flux automatisés.

### Phase 3 : Assurance qualité
L'introduction de tests variés—tests fonctionnels, tests de sécurité, tests e2e—établit un filet de sécurité garantissant que seules les images validées sont déployées.

### Phase 4 : Orchestration et déploiement
Docker Compose offre un mécanisme pour orchestrer les déploiements multi-conteneurs, tandis que l'intégration dans les pipelines automatise les déploiements récurrents.

### Phase 5 : Gestion multi-environnements
La différenciation entre staging et production, avec approbation manuelle des déploiements de production, établit une gouvernance appropriée et réduit les risques.

Cette progression structurée permet de maîtriser progressivement chaque concept et de construire une compréhension globale solide du pipeline CI/CD avec Docker dans GitLab.
