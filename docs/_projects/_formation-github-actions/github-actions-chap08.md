# Citations
- https://docs.docker.com/build/ci/github-actions/test-before-push/
- https://event-driven.io/en/how_to_buid_and_push_docker_image_with_github_actions/
- https://github.com/docker/build-push-action
- https://docs.docker.com/build/ci/github-actions/
- https://runcloud.io/blog/setup-docker-github-actions-ci-cd
- https://docs.github.com/actions/creating-actions/creating-a-docker-container-action
- https://dev.to/sahanonp/setup-docker-for-integration-testing-in-github-action-39fn
- https://docs.github.com/actions/using-jobs/running-jobs-in-a-container


# Tokens
- prompt_tokens: 309
- completion_tokens: 9714
- total_tokens: 10023
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.146, 'request_cost': 0.006, 'total_cost': 0.153}


# Content
# Projet 2 - GitHub Actions : Formation Complète

## Présentation du projet et GitHub Container Registry

### Vue d'ensemble du projet

GitHub Actions constitue une plateforme CI/CD (Intégration Continue / Déploiement Continu) native intégrée directement dans GitHub, permettant d'automatiser les workflows de build, test et déploiement. Ce projet s'articule autour de la containerisation d'applications avec Docker et leur orchestration via GitHub Actions, incluant le stockage des images dans GitHub Container Registry (GHCR).[1][4]

GitHub Container Registry représente un service de registre de conteneurs proposé par GitHub dans le cadre de son écosystème Packages. Contrairement à Docker Hub, GHCR offre des avantages significatifs pour les projets commerciaux : support natif des images publiques et privées, intégration transparente avec GitHub, pas de limitations de débit pour les utilisateurs authentifiés, et stockage des artefacts directement liés au référentiel.[2]

### Architecture et flux de travail

L'approche généralement adoptée dans ce projet suit un processus structuré :

- **Définition des workflows** : Création de fichiers YAML dans le répertoire `.github/workflows/`
- **Triggers d'exécution** : Déclenchement automatique lors de commits, pull requests ou événements planifiés
- **Construction d'images** : Compilation du Dockerfile avec Docker Buildx
- **Validation** : Exécution de tests avant publication
- **Publication** : Poussée vers GHCR et/ou Docker Hub
- **Déploiement** : Orchestration avec Docker Compose en environnements multiples

### Configuration initiale de GitHub Container Registry

Avant de publier des images, une configuration préalable est nécessaire :[2]

1. Accès aux paramètres de secrets GitHub : `Settings => Secrets and variables => Actions`
2. Création des secrets nécessaires pour l'authentification :
   - `GHCR_TOKEN` : Token d'authentification GitHub
   - `DOCKERHUB_USERNAME` et `DOCKERHUB_TOKEN` : Identifiants Docker Hub (optionnel)

3. Activation des permissions du workflow dans `Settings => Actions => General`, en veillant à accorder les droits `write:packages` pour permettre à GitHub Actions de publier des images.

---

## Création des images et push manuel

### Processus de création manuelle

La création manuelle d'images Docker constitue l'étape préalable à l'automatisation par GitHub Actions. Cette approche didactique permet de comprendre les mécanismes sous-jacents avant leur orchestration.

### Structure d'un Dockerfile optimal

Un Dockerfile bien conçu doit privilégier la légèreté et les meilleures pratiques de sécurité :

```dockerfile
# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Étape finale (multi-stage build)
FROM node:18-alpine

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copier uniquement les dépendances du builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
```

Cet exemple illustre plusieurs principes essentiels :

- **Multi-stage builds** : Réduction de la taille finale en n'incluant que les artefacts nécessaires
- **Utilisateur non-root** : Amélioration de la sécurité en évitant l'exécution en tant que root
- **Alpine Linux** : Base minimale réduisant significativement la taille de l'image
- **Gestion des dépendances** : Installation en étape séparée pour optimiser le cache Docker

### Commandes de push manuel

Le push manuel s'effectue via des commandes CLI Docker :

```bash
# Authentification auprès de GitHub Container Registry
echo $GHCR_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Construction de l'image locale
docker build -t ghcr.io/username/project-name:v1.0.0 .

# Tagging supplémentaires
docker tag ghcr.io/username/project-name:v1.0.0 ghcr.io/username/project-name:latest

# Push de l'image
docker push ghcr.io/username/project-name:v1.0.0
docker push ghcr.io/username/project-name:latest
```

### Vérification et gestion des images

Après le push, il est important de vérifier que l'image est correctement stockée et accessible :

```bash
# Lister les images locales
docker images | grep ghcr.io

# Tirer l'image du registre pour vérification
docker pull ghcr.io/username/project-name:latest

# Inspecter les métadonnées de l'image
docker inspect ghcr.io/username/project-name:latest
```

---

## Construction et push des images dans le workflow

### Architecture d'un workflow GitHub Actions

Les workflows GitHub Actions s'articulent autour de fichiers YAML définissant les étapes d'exécution. La structure générale comprend :[1][3]

```yaml
name: Build and Publish Docker Image

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      packages: write
    
    steps:
      # Étapes d'exécution
```

### Détail des étapes du workflow

**Étape 1 : Checkout du code**

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```

Cette étape clone le code du référentiel dans l'environnement d'exécution, rendant accessibles le Dockerfile et les sources.

**Étape 2 : Configuration de Docker Buildx**

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
  with:
    version: latest
    buildkitd-flags: --allow-insecure-entitlement security.insecure
```

Docker Buildx étend les capacités de Docker build en intégrant BuildKit, permettant les builds multi-plateforme et des optimisations avancées.[3]

**Étape 3 : Configuration QEMU (pour builds multi-plateforme)**

```yaml
- name: Set up QEMU
  uses: docker/setup-qemu-action@v3
```

QEMU permet l'émulation d'architectures différentes (arm64, arm/v7, etc.), essentiel pour construire des images compatibles avec divers environnements.

**Étape 4 : Extraction des métadonnées**

```yaml
- name: Extract metadata
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ghcr.io/${{ github.repository }}
    tags: |
      type=ref,event=branch
      type=semver,pattern={{version}}
      type=semver,pattern={{major}}.{{minor}}
      type=sha,prefix={{branch}}-
```

Cette action génère automatiquement des tags cohérents basés sur les événements Git (branches, tags, commits).

**Étape 5 : Authentification auprès des registres**

```yaml
- name: Login to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

L'authentification utilise les secrets configurés dans les paramètres du référentiel, assurant la sécurité des credentials.

**Étape 6 : Build et push vers les registres**

```yaml
- name: Build and push Docker images
  uses: docker/build-push-action@v6
  with:
    context: .
    file: ./Dockerfile
    push: ${{ github.ref == 'refs/heads/main' }}
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
    platforms: linux/amd64,linux/arm64
```

Paramètres clés :[3]

| Paramètre | Description | Valeur typique |
|-----------|-------------|---|
| `context` | Répertoire contenant les sources et Dockerfile | `.` ou `./src` |
| `file` | Chemin vers le Dockerfile | `./Dockerfile` |
| `push` | Activation conditionnelle du push | `${{ github.ref == 'refs/heads/main' }}` |
| `tags` | Liste des tags à appliquer | Générés par métadonnées |
| `platforms` | Architectures cibles | `linux/amd64,linux/arm64` |
| `cache-from` | Source du cache de build | `type=gha` pour GitHub Actions |

### Workflow complet avec multi-registres

```yaml
name: Build, Test and Publish

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY_GHCR: ghcr.io
  REGISTRY_DOCKERHUB: docker.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY_GHCR }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY_DOCKERHUB }}
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: |
            ${{ env.REGISTRY_GHCR }}/${{ env.IMAGE_NAME }}
            ${{ env.REGISTRY_DOCKERHUB }}/organisation/${{ github.event.repository.name }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha
      
      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          platforms: linux/amd64,linux/arm64,linux/arm/v7
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## Tests des images avant le push

### Importance et stratégie des tests pré-push

La validation des images avant leur publication constitue une pratique critique pour assurer la qualité et la sécurité.[1] Cette approche prévient la distribution d'images défectueuses ou vulnérables dans les registres publics.

### Export de l'image pour test local

```yaml
- name: Build image (without push)
  uses: docker/build-push-action@v6
  with:
    context: .
    load: true
    tags: app:test

- name: Run image tests
  run: |
    docker run --rm app:test npm test
    docker run --rm app:test npm run lint
```

L'option `load: true` exporte l'image dans le démon Docker local, permettant l'exécution de tests sans la publier.[1]

### Tests de santé et de fonctionnalité

```yaml
- name: Test image healthcheck
  run: |
    CONTAINER_ID=$(docker run -d --health-cmd='curl -f http://localhost:3000/health || exit 1' \
      --health-interval=10s \
      --health-timeout=5s \
      --health-retries=3 \
      app:test)
    
    # Attendre la stabilité du conteneur
    sleep 15
    
    # Vérifier le statut
    docker inspect --format='{{.State.Health.Status}}' $CONTAINER_ID
    
    docker stop $CONTAINER_ID
```

Les healthchecks permettent de valider que le service démarre correctement et répond aux requêtes.

### Scan de sécurité et vulnérabilités

```yaml
- name: Scan image for vulnerabilities
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: app:test
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'

- name: Upload Trivy results to GitHub Security tab
  uses: github/codeql-action/upload-sarif@v2
  with:
    sarif_file: 'trivy-results.sarif'
```

Trivy analyse l'image pour détecter les vulnérabilités connues, améliorant la posture de sécurité avant la publication.[5]

### Workflow complet avec tests intégrés

```yaml
name: Build, Test and Publish with Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      packages: write
      security-events: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Build image for testing
        uses: docker/build-push-action@v6
        with:
          context: .
          load: true
          tags: myapp:test
          cache-from: type=gha
      
      - name: Run unit tests
        run: |
          docker run --rm \
            -v ${{ github.workspace }}/coverage:/app/coverage \
            myapp:test \
            npm run test:unit
      
      - name: Run integration tests
        run: |
          docker run --rm \
            --network host \
            myapp:test \
            npm run test:integration
      
      - name: Scan for vulnerabilities
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:test
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          vuln-type: 'os,library'
          severity: 'CRITICAL,HIGH'
      
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      
      - name: Login to GHCR
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        if: github.event_name != 'pull_request'
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          platforms: linux/amd64,linux/arm64
```

---

## Tests E2E (End-to-End)

### Architecture des tests E2E dans GitHub Actions

Les tests E2E valident le fonctionnement complet de l'application en environnement proche de la production. Leur intégration dans GitHub Actions garantit la qualité globale du déploiement.

### Configuration de l'environnement de test

```yaml
- name: Start application stack
  run: |
    docker-compose \
      -f docker-compose.test.yml \
      -p test-stack \
      up -d

- name: Wait for services to be healthy
  run: |
    timeout 60 bash -c 'until \
      docker inspect test-stack_app_1 | \
      grep -q "\"Status\": \"healthy\""; do \
      sleep 5; done'
```

Docker Compose orchestre la création d'un stack complet avec l'application, les bases de données et les dépendances externes.

### Exécution de tests Playwright/Cypress

```yaml
- name: Run E2E tests with Playwright
  uses: docker://mcr.microsoft.com/playwright:v1.40.1-jammy
  with:
    args: npx playwright test --project=chromium --project=firefox

- name: Upload test artifacts
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

### Gestion des données de test

```yaml
- name: Seed test database
  run: |
    docker-compose \
      -f docker-compose.test.yml \
      exec -T database \
      psql -U testuser -d testdb \
      -f /docker-entrypoint-initdb.d/seed.sql

- name: Run E2E tests
  run: |
    docker-compose \
      -f docker-compose.test.yml \
      exec -T app \
      npm run test:e2e

- name: Collect logs on failure
  if: failure()
  run: |
    docker-compose \
      -f docker-compose.test.yml \
      logs > test-logs.txt
    
    docker-compose \
      -f docker-compose.test.yml \
      down
```

### Workflow E2E complet

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Build application image
        uses: docker/build-push-action@v6
        with:
          context: .
          load: true
          tags: app:e2e
          cache-from: type=gha
      
      - name: Start application
        run: |
          docker run -d \
            --name app-e2e \
            --network host \
            -e DATABASE_URL=postgresql://testuser:testpass@localhost/testdb \
            app:e2e
      
      - name: Wait for application startup
        run: |
          timeout 30 bash -c 'until curl -f http://localhost:3000/health; do \
            sleep 2; done'
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install Playwright dependencies
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-test-results
          path: |
            test-results/
            playwright-report/
      
      - name: Cleanup
        if: always()
        run: docker stop app-e2e && docker rm app-e2e
```

---

## Déploiement avec Docker Compose

### Intégration Docker Compose dans les workflows

Docker Compose simplifie l'orchestration de stacks multi-conteneurs, facilitant les déploiements reproductibles en environnements pré-prod et production.

### Fichier docker-compose.yml pour production

```yaml
version: '3.9'

services:
  app:
    image: ghcr.io/organisation/app:${APP_VERSION}
    container_name: app-prod
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      - REDIS_URL=redis://cache:6379
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    volumes:
      - app-logs:/app/logs

  postgres:
    image: postgres:15-alpine
    container_name: postgres-prod
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: "json-file"
      options:
        max-size: "10m"

  cache:
    image: redis:7-alpine
    container_name: redis-prod
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - app-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"

  nginx:
    image: nginx:alpine
    container_name: nginx-prod
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - app-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"

volumes:
  postgres-data:
  redis-data:
  app-logs:

networks:
  app-network:
    driver: bridge
```

### Workflow de déploiement avec Docker Compose

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags:
      - 'v*.*.*'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'production'
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    environment:
      name: ${{ github.event.inputs.environment || 'production' }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.DEPLOY_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.DEPLOY_HOST }} >> ~/.ssh/known_hosts
      
      - name: Extract version
        id: version
        run: |
          if [[ "${{ github.ref }}" == refs/tags/* ]]; then
            VERSION=${GITHUB_REF#refs/tags/}
          else
            VERSION="latest"
          fi
          echo "version=$VERSION" >> $GITHUB_OUTPUT
      
      - name: Deploy application
        run: |
          ssh -i ~/.ssh/deploy_key ${{ secrets.DEPLOY_USER }}@${{ secrets.DEPLOY_HOST }} << 'EOF'
          cd /opt/app
          
          # Télécharger les nouveaux fichiers de configuration
          git pull origin main
          
          # Définir la version de l'image
          export APP_VERSION=${{ steps.version.outputs.version }}
          export DB_USER=${{ secrets.DB_USER }}
          export DB_PASSWORD=${{ secrets.DB_PASSWORD }}
          export DB_NAME=${{ secrets.DB_NAME }}
          
          # Arrêter les services actuels
          docker-compose -f docker-compose.yml down
          
          # Tirer les dernières images
          docker-compose -f docker-compose.yml pull
          
          # Démarrer les services
          docker-compose -f docker-compose.yml up -d
          
          # Vérifier la santé de l'application
          sleep 10
          if ! curl -f http://localhost:3000/health; then
            echo "Health check failed"
            docker-compose -f docker-compose.yml logs
            exit 1
          fi
          
          echo "Deployment successful"
          EOF
      
      - name: Notify deployment status
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to ${{ github.event.inputs.environment || "production" }} - Version: ${{ steps.version.outputs.version }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Environnements multiples : pré-prod / production

### Concept et implémentation des environnements

GitHub Actions supporte nativement la gestion d'environnements distincts, permettant des configurations et des approbations différenciées selon la cible de déploiement.[4]

### Configuration des environnements dans GitHub

1. Accéder à `Settings => Environments`
2. Créer deux environnements : `staging` et `production`
3. Configurer pour chacun :
   - Variables d'environnement spécifiques
   - Reviewers obligatoires pour les déploiements en production
   - Délais d'attente de confirmation
   - Secrets protégés

### Workflow multi-environnement

```yaml
name: Build, Test and Deploy to Multiple Environments

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.version }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  test:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run tests
        run: npm test

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build, test]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Deploy to staging
        env:
          DEPLOY_HOST: ${{ secrets.STAGING_HOST }}
          DEPLOY_USER: ${{ secrets.STAGING_USER }}
          DEPLOY_KEY: ${{ secrets.STAGING_KEY }}
          APP_VERSION: ${{ needs.build.outputs.image-tag }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
          
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST << 'EOF'
          cd /opt/app-staging
          export IMAGE_TAG=$APP_VERSION
          docker-compose pull
          docker-compose up -d
          EOF

  deploy-production:
    runs-on: ubuntu-latest
    needs: [build, test]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://app.example.com
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Request approval
        run: echo "Waiting for approval to deploy to production"
      
      - name: Deploy to production
        env:
          DEPLOY_HOST: ${{ secrets.PROD_HOST }}
          DEPLOY_USER: ${{ secrets.PROD_USER }}
          DEPLOY_KEY: ${{ secrets.PROD_KEY }}
          APP_VERSION: ${{ needs.build.outputs.image-tag }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H $DEPLOY_HOST >> ~/.ssh/known_hosts
          
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST << 'EOF'
          cd /opt/app
          export IMAGE_TAG=$APP_VERSION
          
          # Backup de l'état actuel
          docker-compose ps > /var/backups/compose-state-$(date +%s).txt
          
          # Mise à jour et redéploiement
          docker-compose pull
          docker-compose up -d
          
          # Vérification de santé
          sleep 15
          if ! curl -f https://app.example.com/health; then
            echo "Health check failed, initiating rollback"
            git checkout HEAD~1 docker-compose.yml
            docker-compose up -d
            exit 1
          fi
          EOF
      
      - name: Notify deployment
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Gestion des secrets par environnement

| Environnement | Secrets requis | Utilisation |
|---|---|---|
| Staging | `STAGING_HOST`, `STAGING_USER`, `STAGING_KEY`, `STAGING_DB_*` | Déploiement en pré-production |
| Production | `PROD_HOST`, `PROD_USER`, `PROD_KEY`, `PROD_DB_*` | Déploiement en production avec approbation |

---

## Créer une action personnalisée

### Concepts fondamentaux des actions personnalisées

Les actions personnalisées permettent de packager de la logique réutilisable et de la partager au sein des workflows. GitHub Actions supporte trois types d'actions : JavaScript, Docker container, et composite.[4][6]

### Type 1 : Action Docker Container

Les actions Docker container offrent l'avantage de l'isolation et de la reproductibilité en exécutant du code dans un conteneur dédié.

**Structure du répertoire**

```
my-custom-action/
├── Dockerfile
├── action.yml
├── entrypoint.sh
└── README.md
```

**Fichier action.yml**

```yaml
name: 'Build and Push Docker Image'
description: 'Construire et pousser une image Docker avec tests préalables'

inputs:
  dockerfile:
    description: 'Chemin vers le Dockerfile'
    required: false
    default: './Dockerfile'
  
  registry:
    description: 'Registre Docker cible'
    required: true
  
  image-name:
    description: 'Nom de l''image Docker'
    required: true
  
  tags:
    description: 'Tags de l''image (séparés par virgule)'
    required: true
  
  context:
    description: 'Contexte de build'
    required: false
    default: '.'
  
  platforms:
    description: 'Plateformes cibles (ex: linux/amd64,linux/arm64)'
    required: false
    default: 'linux/amd64'
  
  registry-username:
    description: 'Utilisateur du registre'
    required: true
  
  registry-password:
    description: 'Mot de passe du registre'
    required: true

outputs:
  image-digest:
    description: 'Digest de l''image construite'
  
  image-size:
    description: 'Taille de l''image en MB'

runs:
  using: 'docker'
  image: 'docker://docker:latest'
  entrypoint: '/entrypoint.sh'
  env:
    DOCKERFILE: ${{ inputs.dockerfile }}
    REGISTRY: ${{ inputs.registry }}
    IMAGE_NAME: ${{ inputs.image-name }}
    TAGS: ${{ inputs.tags }}
    CONTEXT: ${{ inputs.context }}
    PLATFORMS: ${{ inputs.platforms }}
    REGISTRY_USERNAME: ${{ inputs.registry-username }}
    REGISTRY_PASSWORD: ${{ inputs.registry-password }}
```

**Fichier Dockerfile pour l'action**

```dockerfile
FROM docker:latest

RUN apk add --no-cache \
    bash \
    curl \
    jq

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

**Fichier entrypoint.sh**

```bash
#!/bin/bash
set -e

echo "🔐 Authentification auprès du registre..."
echo "${REGISTRY_PASSWORD}" | docker login -u "${REGISTRY_USERNAME}" --password-stdin "${REGISTRY}"

echo "🔨 Construction de l'image Docker..."
docker build \
  -f "${DOCKERFILE}" \
  -t temp-image:build \
  "${CONTEXT}"

echo "📦 Tagging de l'image..."
IFS=',' read -ra TAG_ARRAY <<< "$TAGS"
for tag in "${TAG_ARRAY[@]}"; do
  docker tag temp-image:build "${REGISTRY}/${IMAGE_NAME}:${tag}"
done

echo "📤 Poussée de l'image..."
for tag in "${TAG_ARRAY[@]}"; do
  docker push "${REGISTRY}/${IMAGE_NAME}:${tag}"
done

echo "📊 Calcul de l'information de l'image..."
DIGEST=$(docker inspect --format='{{.RepoDigests}}' "${REGISTRY}/${IMAGE_NAME}:${TAG_ARRAY[0]}" | jq -r '.[0]')
SIZE=$(docker inspect --format='{{.Size}}' temp-image:build | awk '{printf "%.2f", $1/1048576}')

echo "image-digest=${DIGEST}" >> $GITHUB_OUTPUT
echo "image-size=${SIZE}" >> $GITHUB_OUTPUT

echo "✅ Action complétée avec succès"
```

### Utilisation de l'action personnalisée Docker

```yaml
- name: Build and Push Docker Image
  uses: ./my-custom-action
  with:
    dockerfile: './Dockerfile'
    registry: 'ghcr.io'
    image-name: 'organisation/app'
    tags: 'v1.0.0,latest'
    context: '.'
    platforms: 'linux/amd64,linux/arm64'
    registry-username: ${{ github.actor }}
    registry-password: ${{ secrets.GITHUB_TOKEN }}
```

### Type 2 : Action Composite

Les actions composite permettent de combiner plusieurs actions existantes pour créer un workflow réutilisable sans surcharge de conteneur.

**Structure action.yml pour composite**

```yaml
name: 'Test and Publish Composite Action'
description: 'Tester l''application et publier en cas de succès'

inputs:
  node-version:
    description: 'Version de Node.js'
    required: false
    default: '18'
  
  registry:
    description: 'Registre Docker'
    required: true
  
  image-name:
    description: 'Nom de l''image'
    required: true
  
  github-token:
    description: 'Token GitHub'
    required: true

outputs:
  test-results:
    description: 'Résultats des tests'
    value: ${{ steps.test.outputs.results }}
  
  image-published:
    description: 'Indicateur de publication'
    value: ${{ steps.publish.outputs.published }}

runs:
  using: 'composite'
  
  steps:
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
    
    - name: Install dependencies
      run: npm ci
      shell: bash
    
    - name: Run tests
      id: test
      run: |
        npm test
        echo "results=success" >> $GITHUB_OUTPUT
      shell: bash
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to registry
      uses: docker/login-action@v3
      with:
        registry: ${{ inputs.registry }}
        username: ${{ github.actor }}
        password: ${{ inputs.github-token }}
    
    - name: Build and push
      id: publish
      uses: docker/build-push-action@v6
      with:
        context: .
        push: true
        tags: ${{ inputs.registry }}/${{ inputs.image-name }}:latest
    
    - name: Output publication result
      run: echo "published=true" >> $GITHUB_OUTPUT
      shell: bash
```

**Utilisation de l'action composite**

```yaml
- name: Test and Publish
  uses: ./test-and-publish-action
  with:
    node-version: '18'
    registry: 'ghcr.io'
    image-name: ${{ github.repository }}
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Type 3 : Action JavaScript

Les actions JavaScript s'exécutent directement sans conteneur, offrant une performance supérieure.

**Structure du répertoire**

```
js-action/
├── action.yml
├── index.js
├── package.json
└── README.md
```

**Fichier package.json**

```json
{
  "name": "scan-image-action",
  "version": "1.0.0",
  "description": "Scanner une image Docker pour les vulnérabilités",
  "main": "index.js",
  "dependencies": {
    "@actions/core": "^1.10.0",
    "@actions/exec": "^1.1.1",
    "axios": "^1.6.0"
  }
}
```

**Fichier index.js**

```javascript
const core = require('@actions/core');
const exec = require('@actions/exec');
const axios = require('axios');

async function run() {
  try {
    const imageRef = core.getInput('image-ref');
    const severity = core.getInput('severity');
    const failOnVulnerabilities = core.getInput('fail-on-vulnerabilities');
    
    core.info(`🔍 Scanning image: ${imageRef}`);
    
    // Exécuter Trivy pour scanner l'image
    let vulnerabilityCount = 0;
    const options = {
      listeners: {
        stdout: (data) => {
          const output = data.toString();
          // Parser la sortie et compter les vulnérabilités
          if (output.includes(severity)) {
            vulnerabilityCount++;
          }
        }
      }
    };
    
    await exec.exec('trivy', ['image', '--severity', severity, imageRef], options);
    
    core.setOutput('vulnerability-count', vulnerabilityCount.toString());
    
    if (failOnVulnerabilities === 'true' && vulnerabilityCount > 0) {
      core.setFailed(`Found ${vulnerabilityCount} vulnerabilities with severity ${severity}`);
      return;
    }
    
    core.info(`✅ Scan completed: Found ${vulnerabilityCount} vulnerabilities`);
    
  } catch (error) {
    core.setFailed(`❌ Scan failed: ${error.message}`);
  }
}

run();
```

**Fichier action.yml pour JavaScript**

```yaml
name: 'Scan Docker Image for Vulnerabilities'
description: 'Scanner une image Docker avec Trivy'

inputs:
  image-ref:
    description: 'Référence de l''image à scanner'
    required: true
  
  severity:
    description: 'Niveaux de sévérité à rapporter (ex: CRITICAL,HIGH)'
    required: false
    default: 'CRITICAL,HIGH'
  
  fail-on-vulnerabilities:
    description: 'Échouer si des vulnérabilités sont trouvées'
    required: false
    default: 'true'

outputs:
  vulnerability-count:
    description: 'Nombre de vulnérabilités trouvées'

runs:
  using: 'node20'
  main: 'index.js'
```

### Publication et partage d'une action personnalisée

Les actions personnalisées peuvent être publiées sur GitHub Marketplace pour partage public :

1. Créer un nouveau référentiel public avec le nom `actions/action-name`
2. Ajouter des tags sémantiques : `git tag -a v1 -m "v1 release"` et `git push origin v1`
3. Compléter le fichier `action.yml` avec des métadonnées exhaustives
4. Ajouter une documentation complète dans `README.md`
5. Publier sur le Marketplace via les paramètres du référentiel

**Utilisation d'une action du Marketplace**

```yaml
- name: Use published action
  uses: organisation/action-name@v1
  with:
    parameter1: value1
    parameter2: value2
```

---

## Synthèse du parcours d'apprentissage

La maîtrise de GitHub Actions pour la containerisation et le déploiement s'acquiert progressivement selon le chemin suivant :

**Phase 1 : Fondations**
- Configuration initiale de GHCR et authentification
- Création manuelle d'images Docker optimisées
- Apprentissage de la syntaxe YAML pour workflows

**Phase 2 : Automatisation Progressive**
- Construction et push automatisés d'images
- Intégration des tests unitaires et d'intégration
- Scans de sécurité et gestion des vulnérabilités

**Phase 3 : Validation et Qualité**
- Tests E2E en environnement proche production
- Export local d'images pour validation pré-push
- Mise en place d'healthchecks et vérifications

**Phase 4 : Déploiement Orchestré**
- Docker Compose pour environnements complexes
- Gestion multi-environnements (staging/production)
- Approval workflows et gestion des secrets

**Phase 5 : Réutilisabilité et Scalabilité**
- Création d'actions personnalisées (Docker, composite, JavaScript)
- Partage et publication sur Marketplace
- Architecture modulaire pour équipes

Cette progression assure une compréhension profonde de chaque couche technologique avant d'aborder les niveaux supérieurs de complexité.
