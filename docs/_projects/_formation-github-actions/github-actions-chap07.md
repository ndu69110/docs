# Citations
- https://dev.to/sarveshk76/streamline-your-workflow-automate-frontend-deployment-with-github-actions-271f
- https://github.com/helmuthdu/automated-frontend-workflow
- https://www.youtube.com/watch?v=2p1D29zJdBI
- https://docs.github.com/articles/getting-started-with-github-actions
- https://blog.maximeheckel.com/posts/building-perfect-github-action-frontend-teams/
- https://github.com/sdras/awesome-actions
- https://github.com/Azure/actions-workflow-samples


# Tokens
- prompt_tokens: 306
- completion_tokens: 8663
- total_tokens: 8969
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.13, 'request_cost': 0.006, 'total_cost': 0.137}


# Content
# Projet 1 - GitHub Actions : Guide Complet d'Implémentation

## 🎯 Présentation du Projet

GitHub Actions constitue une plateforme d'intégration continue et de déploiement continu (CI/CD) intégrée directement dans GitHub. Ce projet vise à démontrer l'implémentation complète d'un pipeline automatisé pour une application fullstack, combinant des tests backend, des tests frontend et des tests end-to-end (E2E) avec couverture de code et déploiement automatisé[1][4].

L'objectif principal consiste à automatiser l'ensemble du cycle de vie d'une application, des tests unitaires jusqu'au déploiement en passant par les tests d'intégration et de performance. Cette approche élimine les erreurs manuelles et garantit une cohérence dans le processus de déploiement[1].

## 📋 Composants Fondamentaux de GitHub Actions

### Architecture de Base

GitHub Actions repose sur quatre éléments essentiels qui fonctionnent ensemble pour créer un système d'automatisation puissant[4]:

**Workflows** - Fichiers YAML définissant l'ensemble du processus d'automatisation. Ils contiennent la logique d'exécution et s'activent en réponse à des événements spécifiques du repository.

**Events** - Événements déclencheurs tels que les push vers une branche, l'ouverture d'une pull request, ou l'exécution manuelle via workflow_dispatch[4].

**Jobs** - Unités d'exécution au sein d'un workflow. Plusieurs jobs peuvent s'exécuter séquentiellement ou en parallèle selon la configuration[5].

**Steps** - Tâches individuelles composant chaque job. Un step peut exécuter un script personnalisé ou utiliser une action réutilisable[4].

### Concepts Avancés

**Runners** - Serveurs exécutant les workflows lorsqu'ils sont déclenchés. Chaque runner traite un seul job à la fois[2]. GitHub propose des runners hébergés (ubuntu-latest, windows-latest) ou des self-hosted runners pour plus de contrôle[1].

**Actions** - Applications réutilisables effectuant des tâches complexes et répétitives. La communauté maintient un écosystème riche d'actions disponibles[2][6].

## 🗂️ Présentation du Code et Création du Répertoire GitHub

### Structure Recommandée

La structure d'un projet utilisant GitHub Actions doit respecter une organisation logique permettant une maintenance et une évolution aisées.

```
mon-projet/
├── .github/
│   ├── workflows/
│   │   ├── backend.yml
│   │   ├── frontend.yml
│   │   ├── e2e-tests.yml
│   │   └── deploy.yml
│   └── workflows-configs/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── jest.config.js
├── frontend/
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── vitest.config.js
├── e2e/
│   ├── tests/
│   ├── package.json
│   └── playwright.config.js
└── README.md
```

### Initialisation du Repository

L'initialisation d'un repository GitHub Actions commence par créer le répertoire `.github/workflows`[1]. Ce répertoire centralise l'ensemble des fichiers de configuration des workflows.

```bash
# Création de la structure de base
mkdir -p .github/workflows
touch .github/workflows/backend.yml
touch .github/workflows/frontend.yml
touch .github/workflows/e2e-tests.yml
```

### Fichier de Configuration Principal

Chaque workflow démarre par une structure YAML de base définissant le nom, les événements déclencheurs et les jobs[2]:

```yaml
name: Workflow Principal

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  # Les jobs sont définis ici
```

## 🔐 Mise en Place SSH pour le Runner GitHub

### Configuration d'un Self-Hosted Runner

Pour les déploiements vers des serveurs personnels (EC2, VPS, etc.), la configuration d'un self-hosted runner sur une instance EC2 s'avère nécessaire[1].

#### Étapes de Configuration

**Étape 1: Générer les Clés SSH**

```bash
# Sur la machine locale
ssh-keygen -t rsa -b 4096 -f github-runner-key -N ""

# Cela crée deux fichiers:
# - github-runner-key (clé privée)
# - github-runner-key.pub (clé publique)
```

**Étape 2: Configurer l'Instance EC2**

```bash
# Sur l'instance EC2
# Ajouter la clé publique au fichier authorized_keys
cat github-runner-key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Étape 3: Ajouter les Secrets GitHub**

Dans les paramètres du repository (Settings → Secrets and variables → Actions), ajouter:

- `SSH_PRIVATE_KEY`: Contenu de la clé privée
- `EC2_HOST`: Adresse IP ou hostname de l'instance
- `EC2_USER`: Nom d'utilisateur (généralement `ec2-user` ou `ubuntu`)
- `EC2_PORT`: Port SSH (généralement 22)

**Étape 4: Enregistrer le Self-Hosted Runner**

```bash
# Sur l'instance EC2
# Télécharger et extraire le runner
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configurer le runner
./config.sh --url https://github.com/USERNAME/REPO --token TOKEN_FOURNI_PAR_GITHUB

# Installer et démarrer comme service
sudo ./svc.sh install
sudo ./svc.sh start
```

### Utilisation du Self-Hosted Runner

Dans le fichier de workflow, spécifier le runner personnalisé[1]:

```yaml
jobs:
  deploy:
    runs-on: self-hosted
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Déployer vers EC2
        run: |
          # Les commandes s'exécutent sur le self-hosted runner
          ./deploy.sh
```

### Configuration SSH Avancée

Pour une sécurité renforcée, créer un fichier de configuration SSH local[1]:

```yaml
name: Déploiement Sécurisé

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts
      
      - name: Déployer via SSH
        run: |
          ssh -i ~/.ssh/id_rsa ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} \
            'cd /app && ./deploy.sh'
```

## ⚙️ Workflow pour le Backend

### Structure Complète d'un Workflow Backend

Le workflow backend automatise les tests, la couverture de code et la validation de la qualité[1][2].

```yaml
name: Backend CI/CD

on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'backend/**'
      - '.github/workflows/backend.yml'
  pull_request:
    branches:
      - main
    paths:
      - 'backend/**'
  workflow_dispatch:

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/backend

jobs:
  test:
    name: Tests et Linting
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Installer les dépendances
        run: |
          cd backend
          npm ci
      
      - name: Exécuter ESLint
        run: |
          cd backend
          npm run lint:report
        continue-on-error: true
      
      - name: Exécuter les tests unitaires
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
          NODE_ENV: test
        run: |
          cd backend
          npm run test:unit -- --coverage
      
      - name: Exécuter les tests d'intégration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
          NODE_ENV: test
        run: |
          cd backend
          npm run test:integration -- --coverage
      
      - name: Générer le rapport SARIF ESLint
        if: always()
        run: |
          cd backend
          npm run lint:sarif
      
      - name: Charger les résultats ESLint
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: backend/eslint-results.sarif
          category: eslint
      
      - name: Télécharger l'artifact de couverture
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: backend-coverage
          path: backend/coverage
          retention-days: 30
  
  build:
    name: Construction de l'Image Docker
    runs-on: ubuntu-latest
    needs: test
    if: success()
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Se connecter au registre
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extraire les métadonnées
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha
      
      - name: Construire et pousser l'image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### Configuration du Backend

Le fichier `backend/package.json` doit contenir les scripts nécessaires:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "lint": "eslint src/**/*.js",
    "lint:report": "eslint src/**/*.js --format json --output-file eslint-results.json || true",
    "lint:sarif": "node scripts/convert-eslint-to-sarif.js"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  }
}
```

## 📊 Couverture du Code et Badges

### Configuration de Jest pour la Couverture

```javascript
// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ]
};
```

### Génération des Badges de Couverture

Utiliser l'action `romeovs/lcov-reporter-action` pour générer automatiquement les badges:

```yaml
- name: Générer le badge de couverture
  uses: romeovs/lcov-reporter-action@v0.3.1
  with:
    lcov-file: ./backend/coverage/lcov.info
    github-token: ${{ secrets.GITHUB_TOKEN }}
  if: always()
```

### Badges dans le README

Ajouter les badges au fichier `README.md`:

```markdown
# Mon Projet

![Coverage Backend](https://img.shields.io/badge/coverage-85%25-brightgreen)
![Build Status](https://github.com/USERNAME/REPO/workflows/Backend%20CI%2FCD/badge.svg)
![Tests](https://img.shields.io/badge/tests-156%20passed-brightgreen)
```

## 🎨 Workflow pour le Frontend

### Structure Complète d'un Workflow Frontend

Le workflow frontend valide le code, exécute les tests et génère les assets de production[1][2].

```yaml
name: Frontend CI/CD

on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend.yml'
  pull_request:
    branches:
      - main
    paths:
      - 'frontend/**'
  workflow_dispatch:

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/frontend

jobs:
  lint:
    name: Linting et Formatage
    runs-on: ubuntu-latest
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Installer les dépendances
        run: |
          cd frontend
          npm ci
      
      - name: Exécuter Prettier
        run: |
          cd frontend
          npm run format:check
        continue-on-error: true
      
      - name: Exécuter ESLint
        run: |
          cd frontend
          npm run lint
        continue-on-error: true
  
  test:
    name: Tests Unitaires et Intégration
    runs-on: ubuntu-latest
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Installer les dépendances
        run: |
          cd frontend
          npm ci
      
      - name: Exécuter les tests
        run: |
          cd frontend
          npm run test -- --coverage
      
      - name: Télécharger l'artifact de couverture
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: frontend-coverage
          path: frontend/coverage
          retention-days: 30
  
  build:
    name: Construction du Build Production
    runs-on: ubuntu-latest
    needs: [lint, test]
    if: success()
    
    permissions:
      contents: read
      packages: write
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Installer les dépendances
        run: |
          cd frontend
          npm ci
      
      - name: Construire l'application
        run: |
          cd frontend
          npm run build
      
      - name: Vérifier les performances de build
        run: |
          cd frontend
          npm run build:analyze
      
      - name: Télécharger l'artifact de build
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist
          retention-days: 5
      
      - name: Configurer Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Se connecter au registre
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Construire et pousser l'image
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  storybook:
    name: Construire et Publier Storybook
    runs-on: ubuntu-latest
    needs: test
    if: success() && github.ref == 'refs/heads/main'
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Installer les dépendances
        run: |
          cd frontend
          npm ci
      
      - name: Construire Storybook
        run: |
          cd frontend
          npm run storybook:build
      
      - name: Configurer GitHub Pages
        uses: actions/configure-pages@v3
      
      - name: Télécharger l'artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'frontend/storybook-static'
      
      - name: Déployer vers GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### Configuration du Frontend

```json
{
  "name": "frontend",
  "version": "1.0.0",
  "scripts": {
    "test": "vitest",
    "lint": "eslint src --fix",
    "format:check": "prettier --check src",
    "build": "vite build",
    "build:analyze": "vite build --report",
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build"
  },
  "devDependencies": {
    "vitest": "^0.34.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "storybook": "^7.0.0"
  }
}
```

```javascript
// frontend/vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/**/*.stories.jsx'
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
});
```

## 🧪 Tests E2E

### Configuration de Playwright

Les tests E2E valident l'intégration complète de l'application en simulant les actions utilisateur[2][3]:

```yaml
name: Tests E2E

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
  schedule:
    - cron: '0 2 * * *'  # Exécution quotidienne à 2h du matin
  workflow_dispatch:

jobs:
  e2e:
    name: Tests E2E Playwright
    runs-on: ubuntu-latest
    timeout-minutes: 60
    
    services:
      backend:
        image: ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
        ports:
          - 3000:3000
        env:
          DATABASE_URL: postgresql://postgres:postgres@postgres:5432/test_db
          REDIS_URL: redis://redis:6379
          NODE_ENV: test
      
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    strategy:
      fail-fast: false
      matrix:
        browser:
          - chromium
          - firefox
          - webkit
        shardIndex: [1, 2, 3]
        shardTotal: [3]
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: e2e/package-lock.json
      
      - name: Installer les dépendances
        run: |
          cd e2e
          npm ci
      
      - name: Installer les navigateurs Playwright
        run: |
          cd e2e
          npx playwright install ${{ matrix.browser }}
      
      - name: Attendre que le backend soit prêt
        run: |
          until curl -s http://localhost:3000/health; do
            echo 'Backend en démarrage...'
            sleep 1
          done
      
      - name: Exécuter les tests E2E
        run: |
          cd e2e
          npx playwright test \
            --project=${{ matrix.browser }} \
            --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
      
      - name: Télécharger les résultats
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.browser }}-${{ matrix.shardIndex }}
          path: e2e/playwright-report/
          retention-days: 30
      
      - name: Télécharger les vidéos de test
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-videos-${{ matrix.browser }}-${{ matrix.shardIndex }}
          path: e2e/test-results/
          retention-days: 7
  
  merge-reports:
    name: Fusionner les Rapports E2E
    if: always()
    needs: e2e
    runs-on: ubuntu-latest
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: e2e/package-lock.json
      
      - name: Installer les dépendances
        run: |
          cd e2e
          npm ci
      
      - name: Télécharger les artifacts
        uses: actions/download-artifact@v3
        with:
          path: e2e/all-reports
          pattern: playwright-report-*
      
      - name: Fusionner les rapports
        run: |
          cd e2e
          npx playwright merge-reports --reporter html ./all-reports
      
      - name: Télécharger le rapport fusionné
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-merged
          path: e2e/playwright-report/
          retention-days: 30
```

### Configuration Playwright

```javascript
// e2e/playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
```

### Exemple de Test E2E

```javascript
// e2e/tests/login.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test('Login avec des identifiants valides', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Bienvenue')).toBeVisible();
  });
  
  test('Login avec identifiants invalides', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Identifiants invalides')).toBeVisible();
  });
});
```

## 📈 Couverture du Code E2E

### Configuration de la Couverture E2E

Intégrer la couverture de code E2E dans le processus CI/CD:

```yaml
name: Couverture E2E

on:
  push:
    branches:
      - main
  workflow_run:
    workflows: ["Tests E2E"]
    types: [completed]

jobs:
  coverage:
    name: Rapport de Couverture E2E
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: e2e/package-lock.json
      
      - name: Télécharger les résultats E2E
        uses: actions/download-artifact@v3
        with:
          name: e2e-coverage
          path: e2e/coverage
      
      - name: Générer le rapport de couverture
        run: |
          cd e2e
          npm run coverage:report
      
      - name: Télécharger le rapport
        uses: actions/upload-artifact@v3
        with:
          name: e2e-coverage-report
          path: e2e/coverage/index.html
      
      - name: Commenter la PR avec les résultats
        uses: actions/github-script@v6
        if: github.event_name == 'pull_request'
        with:
          script: |
            const fs = require('fs');
            const coverage = JSON.parse(fs.readFileSync('e2e/coverage/coverage-summary.json', 'utf8'));
            const comment = `## 📊 Couverture E2E
            
            - **Lignes**: ${coverage.total.lines.pct}%
            - **Branches**: ${coverage.total.branches.pct}%
            - **Fonctions**: ${coverage.total.functions.pct}%
            - **Déclarations**: ${coverage.total.statements.pct}%
            `;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

## 🌐 Exécution Multi-Navigateurs

### Configuration Multi-Navigateurs Avancée

L'exécution des tests sur plusieurs navigateurs garantit la compatibilité cross-browser:

```yaml
name: Tests Multi-Navigateurs

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
  schedule:
    - cron: '0 0 * * 1'  # Exécution hebdomadaire le lundi

jobs:
  setup:
    name: Préparer les Tests
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    
    steps:
      - name: Définir la matrice de test
        id: set-matrix
        run: |
          if [[ "${{ github.event_name }}" == "schedule" ]]; then
            echo "matrix={\"browser\":[\"chromium\",\"firefox\",\"webkit\",\"edge\"]}" >> $GITHUB_OUTPUT
          else
            echo "matrix={\"browser\":[\"chromium\",\"firefox\",\"webkit\"]}" >> $GITHUB_OUTPUT
          fi

  test:
    name: Test ${{ matrix.browser }}
    needs: setup
    runs-on: ${{ matrix.os }}
    timeout-minutes: 30
    
    strategy:
      fail-fast: false
      matrix:
        include:
          - browser: chromium
            os: ubuntu-latest
          - browser: firefox
            os: ubuntu-latest
          - browser: webkit
            os: ubuntu-latest
          - browser: edge
            os: windows-latest
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: e2e/package-lock.json
      
      - name: Installer les dépendances
        run: |
          cd e2e
          npm ci
      
      - name: Installer le navigateur ${{ matrix.browser }}
        run: |
          cd e2e
          npx playwright install ${{ matrix.browser }}
      
      - name: Exécuter les tests sur ${{ matrix.browser }}
        run: |
          cd e2e
          npx playwright test --project=${{ matrix.browser }}
        env:
          BROWSER: ${{ matrix.browser }}
      
      - name: Télécharger le rapport
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: report-${{ matrix.browser }}-${{ matrix.os }}
          path: e2e/playwright-report/
          retention-days: 30
      
      - name: Publier les résultats de test
        uses: EnricoMi/publish-unit-test-result-action@v2
        if: always()
        with:
          files: e2e/test-results/junit.xml
          check_name: Tests ${{ matrix.browser }}
  
  compatibility-report:
    name: Générer un Rapport de Compatibilité
    if: always()
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - name: Vérifier le code
        uses: actions/checkout@v3
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Télécharger tous les rapports
        uses: actions/download-artifact@v3
      
      - name: Générer le rapport de compatibilité
        run: |
          node scripts/generate-compatibility-report.js
      
      - name: Télécharger le rapport final
        uses: actions/upload-artifact@v3
        with:
          name: compatibility-report
          path: compatibility-report.html
```

### Script de Génération de Rapport

```javascript
// scripts/generate-compatibility-report.js
const fs = require('fs');
const path = require('path');

const browsers = ['chromium', 'firefox', 'webkit', 'edge'];
const results = {};

browsers.forEach(browser => {
  const resultFile = path.join(__dirname, `../report-${browser}-*/results.json`);
  // Logique de lecture et agrégation des résultats
  results[browser] = {
    passed: 0,
    failed: 0,
    skipped: 0
  };
});

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Rapport de Compatibilité</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    .pass { color: green; }
    .fail { color: red; }
  </style>
</head>
<body>
  <h1>Rapport de Compatibilité Multi-Navigateurs</h1>
  <table>
    <tr>
      <th>Navigateur</th>
      <th>Tests Réussis</th>
      <th>Tests Échoués</th>
      <th>Tests Ignorés</th>
      <th>Taux de Réussite</th>
    </tr>
    ${Object.entries(results).map(([browser, data]) => {
      const total = data.passed + data.failed + data.skipped;
      const passRate = ((data.passed / total) * 100).toFixed(2);
      return `
        <tr>
          <td>${browser}</td>
          <td class="pass">${data.passed}</td>
          <td class="fail">${data.failed}</td>
          <td>${data.skipped}</td>
          <td>${passRate}%</td>
        </tr>
      `;
    }).join('')}
  </table>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../compatibility-report.html'), html);
console.log('Rapport généré: compatibility-report.html');
```

## 🔄 Pipeline Complet et Intégration

### Orchestration des Workflows

Pour une application fullstack complète, orchestrer tous les workflows:

```yaml
name: Pipeline Complet

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  backend:
    uses: ./.github/workflows/backend.yml
    secrets: inherit
  
  frontend:
    uses: ./.github/workflows/frontend.yml
    secrets: inherit
  
  e2e:
    needs: [backend, frontend]
    uses: ./.github/workflows/e2e-tests.yml
    secrets: inherit
  
  multi-browser:
    needs: [backend, frontend]
    uses: ./.github/workflows/multi-browser-tests.yml
    secrets: inherit
  
  deploy:
    if: github.ref == 'refs/heads/main' && success()
    needs: [backend, frontend, e2e, multi-browser]
    uses: ./.github/workflows/deploy.yml
    secrets: inherit
```

### Notifications et Rapports

Ajouter des notifications pour suivre l'état du pipeline:

```yaml
  notify:
    name: Notifier les Résultats
    if: always()
    needs: [backend, frontend, e2e, multi-browser]
    runs-on: ubuntu-latest
    
    steps:
      - name: Déterminer le statut global
        id: status
        run: |
          if [[ "${{ needs.backend.result }}" == "failure" ]] || \
             [[ "${{ needs.frontend.result }}" == "failure" ]] || \
             [[ "${{ needs.e2e.result }}" == "failure" ]]; then
            echo "status=failure" >> $GITHUB_OUTPUT
          else
            echo "status=success" >> $GITHUB_OUTPUT
          fi
      
      - name: Envoyer une notification Slack
        uses: slackapi/slack-github-action@v1
        if: always()
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Pipeline CI/CD - Statut: ${{ steps.status.outputs.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Pipeline CI/CD*\nRéférence: ${{ github.ref }}\nAuteur: ${{ github.actor }}\nStatut: ${{ steps.status.outputs.status }}"
                  }
                }
              ]
            }
```

Cette structure complète d'implémentation de GitHub Actions pour un projet fullstack fournit une fondation robuste pour l'automatisation, la qualité et le déploiement continu. L'adoption progressive de ces patterns garantit une fiabilité accrue du processus de développement et une meilleure expérience utilisateur[1][4][5][6].
