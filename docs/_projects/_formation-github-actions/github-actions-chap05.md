# Citations
- https://dev.to/tejastn10/mastering-github-actions-strategy-matrix-deploy-smarter-not-harder-28po
- https://codefresh.io/learn/github-actions/github-actions-matrix/
- https://www.blacksmith.sh/blog/matrix-builds-with-github-actions
- https://www.youtube.com/watch?v=FSQDtRMtSHo
- https://www.edwardthomson.com/blog/github_actions_6_fail_fast_matrix_workflows.html
- https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow
- https://github.com/orgs/community/discussions/45546
- https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions


# Tokens
- prompt_tokens: 272
- completion_tokens: 8565
- total_tokens: 8837
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.128, 'request_cost': 0.006, 'total_cost': 0.135}


# Content
# Chapitre 5 : GitHub Actions - Exécutions, Optimisations et Permissions des Workflows

## 🎯 Introduction

Ce chapitre approfondit les aspects techniques essentiels pour maîtriser GitHub Actions en production. Il couvre l'optimisation des workflows à travers la gestion des caches et des matrices, la sécurisation via les permissions, et la structuration des déploiements avec les environnements et la gestion de la concurrence.

---

## 1️⃣ Gestion des Caches

### Concept Fondamental

La gestion des caches dans GitHub Actions représente une stratégie d'optimisation critique pour réduire les temps d'exécution des workflows. Le cache stocke les fichiers fréquemment utilisés entre les exécutions, éliminant le besoin de télécharger ou reconstruire les mêmes ressources à chaque lancement.[1]

### Principes de Base

Le cache fonctionne selon un système clé-valeur. Lors d'une première exécution, les fichiers spécifiés sont compressés et stockés. Lors des exécutions ultérieures, si la clé de cache correspond, les fichiers sont restaurés directement sans traitement supplémentaire.

**Points clés à retenir :**

- Les caches sont spécifiques au dépôt et à la branche
- Chaque cache dispose d'une capacité de stockage limitée
- Un cache inutilisé pendant 7 jours est automatiquement supprimé
- L'accès aux caches respecte les limites de sécurité entre branches

### Implémentation Pratique

#### Configuration Basique

```yaml
name: Node.js Caching Example
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
```

Dans cette configuration, l'action `setup-node` gère automatiquement le cache des dépendances npm. La première exécution télécharge et installe les paquets, tandis que les exécutions suivantes réutilisent le cache si le fichier `package-lock.json` n'a pas changé.

#### Cache Personnalisé Avancé

```yaml
name: Advanced Caching Strategy
on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Cache dependencies with OS-specific key
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ matrix.node-version }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-${{ matrix.node-version }}-
            ${{ runner.os }}-node-
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
```

Cet exemple démontre une stratégie avancée où le cache est segmenté par système d'exploitation et version de Node.js. Les clés de restauration en cascade permettent une récupération partielle du cache si une correspondance exacte n'existe pas.

### Optimisation Multi-Environnements

```yaml
name: Multi-Environment Caching
on:
  push:

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        python-version: ['3.9', '3.10', '3.11']
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'pip'
      
      - name: Cache pip packages
        uses: actions/cache@v3
        with:
          path: |
            ~/.cache/pip
            ~/Library/Caches/pip
            ~\AppData\Local\pip\Cache
          key: ${{ runner.os }}-pip-${{ matrix.python-version }}-${{ hashFiles('**/requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-${{ matrix.python-version }}-
            ${{ runner.os }}-pip-
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Run tests
        run: pytest
```

Cette configuration gère les caches de manière intelligente sur différentes architectures (Windows, macOS, Linux), tenant compte des chemins de cache spécifiques à chaque système d'exploitation.

### Stratégies de Nettoyage et Maintenance

```yaml
name: Cache Maintenance
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly cleanup

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: List all caches
        run: |
          gh actions-cache list -R ${{ github.repository }} --sort created-at --order desc
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Delete old caches
        run: |
          gh actions-cache delete-all -R ${{ github.repository }} --branch ${{ github.ref_name }}
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 2️⃣ Matrices, Fail-Fast et Stratégies de Build

### Concept de Matrice

La stratégie de matrice dans GitHub Actions permet d'exécuter automatiquement plusieurs variations d'un job avec différentes configurations. Plutôt que de créer manuellement plusieurs jobs similaires, une matrice génère dynamiquement ces variations à partir de combinaisons de variables.[1][2]

### Utilité Pratique

La matrice s'avère particulièrement utile pour :

- **Tester sur plusieurs systèmes d'exploitation** : vérifier la compatibilité sur Ubuntu, macOS et Windows
- **Vérifier plusieurs versions de runtime** : tester un projet Node.js sur les versions 16, 18 et 20
- **Déployer plusieurs services** : lancer simultanément le déploiement de plusieurs microservices
- **Tests multi-navigateurs** : valider le code dans différents navigateurs et versions

### Structure Basique d'une Matrice

```yaml
name: Matrix Test Strategy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [16, 18, 20]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
```

Cette matrice génère 9 jobs (3 systèmes d'exploitation × 3 versions de Node.js), tous exécutés en parallèle.

### Cas d'Usage Réel : Déploiement Multi-Services

```yaml
name: Release all services
on:
  push:
    branches:
      - master

jobs:
  deploy:
    strategy:
      matrix:
        service: ["proctor", "screenshot", "stitch", "canvas-snap", "canvas-fuse"]
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Build Docker image for ${{ matrix.service }}
        run: docker build -t ${{ matrix.service }}:latest ./services/${{ matrix.service }}
      
      - name: Deploy ${{ matrix.service }}
        run: |
          echo "Deploying ${{ matrix.service }} to production"
          docker push ${{ matrix.service }}:latest
```

Avec cette configuration, chaque service est construit et déployé dans un job séparé, maximisant le parallélisme et réduisant le temps global d'exécution.[1]

### Comportement Fail-Fast

Le fail-fast représente un mécanisme de sécurité et d'efficacité dans les matrices. Par défaut, ce comportement est **activé**.[2][3]

**Avec fail-fast activé (comportement par défaut) :**

Si l'un des 9 jobs échoue, GitHub Actions annule immédiatement tous les jobs en attente. Cela économise les ressources de calcul et évite de gaspiller du temps sur des exécutions destinées à échouer pour la même raison.

**Avec fail-fast désactivé :**

Tous les jobs s'exécutent jusqu'à leur completion, même si certains échouent. Cette approche s'avère utile pour :
- Collecter des informations de débogage complètes
- Identifier si le problème est isolé ou systématique
- Générer des rapports complets de compatibilité

### Configuration du Fail-Fast

```yaml
name: Fail-Fast Control Example
on:
  push:
    branches: [main]

jobs:
  comprehensive-test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [14, 16, 18, 20]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run comprehensive tests
        run: npm test -- --verbose
```

Ici, `fail-fast: false` garantit que tous les 12 jobs (3 OS × 4 versions de Node) s'exécutent complètement, même en cas d'échec.

### Limitation du Parallélisme

Pour éviter de surcharger l'infrastructure ou les limites de quota, il est possible de contrôler le nombre de jobs parallèles :

```yaml
name: Limited Parallel Execution
on:
  push:

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      max-parallel: 2
      matrix:
        database: [postgres, mysql, mongodb, redis]
        cache: [memcached, redis]
    
    steps:
      - uses: actions/checkout@v4
      - name: Test with ${{ matrix.database }} and ${{ matrix.cache }}
        run: npm test
```

Avec `max-parallel: 2`, même si la matrice génère 8 combinaisons, seuls 2 jobs s'exécutent simultanément.

### Inclusion et Exclusion Sélective

Les matrices peuvent être affinées avec des règles d'inclusion et d'exclusion :

```yaml
name: Selective Matrix Execution
on:
  push:

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [16, 18, 20]
        exclude:
          - os: macos-latest
            node-version: 16
          - os: windows-latest
            node-version: 20
        include:
          - os: ubuntu-latest
            node-version: 21
            experimental: true
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Run tests
        run: npm test
        continue-on-error: ${{ matrix.experimental || false }}
```

Cette configuration :
- Exclut certaines combinaisons incompatibles ou non pertinentes
- Ajoute une version expérimentale de Node.js
- Continue l'exécution même si la version expérimentale échoue

### Gestion Avancée des Erreurs

```yaml
name: Advanced Error Handling
on:
  push:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: true
      matrix:
        version: [9, 10, 11]
        experimental: [false]
        include:
          - version: 12
            experimental: true
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.version }}
      
      - name: Run tests
        run: npm test
        continue-on-error: ${{ matrix.experimental }}
      
      - name: Post results
        if: always()
        run: echo "Test completed for version ${{ matrix.version }}"
```

Les jobs avec `experimental: false` respectent le fail-fast, tandis que ceux avec `experimental: true` s'exécutent sans bloquer les autres.[2]

### Table Comparative : Stratégies de Build

| Stratégie | Fail-Fast | Max-Parallel | Cas d'Usage |
|-----------|-----------|--------------|-----------|
| **Rapide (Production)** | true | Défaut | Validation rapide avant merge |
| **Exhaustive (Debugging)** | false | Défaut | Identification complète des problèmes |
| **Économe (Ressources)** | false | 2-3 | Environnements avec quota limité |
| **Expérimentale** | false | Défaut | Tests de nouvelles configurations |

---

## 3️⃣ Les Permissions

### Importance de la Sécurité

Les permissions dans GitHub Actions contrôlent le niveau d'accès des workflows aux ressources du dépôt et aux services externes. Une gestion rigoureuse des permissions suit le principe du **moindre privilège**, accordant uniquement les droits nécessaires pour l'exécution.[4]

### Portée des Permissions

Les permissions s'appliquent à plusieurs niveaux :

- **Au niveau du workflow** : défini dans `permissions:` au sommet du fichier YAML
- **Au niveau du job** : spécifique à chaque job
- **Au niveau global** : paramètres par défaut du dépôt

### Configuration Basique

```yaml
name: Secure Workflow
on:
  push:
    branches: [main]

permissions:
  contents: read
  packages: read

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build application
        run: npm run build
```

La configuration `permissions: contents: read` signifie que le workflow peut lire le contenu du dépôt mais ne peut pas le modifier.

### Permissions Granulaires

GitHub Actions propose des permissions spécifiques pour différentes ressources :

| Permission | Description |
|------------|-------------|
| `contents` | Accès aux fichiers du dépôt (read/write) |
| `pull-requests` | Modification des pull requests (read/write) |
| `issues` | Gestion des issues (read/write) |
| `packages` | Accès aux packages (read/write) |
| `deployments` | Gestion des déploiements (read/write) |
| `statuses` | Modification du statut des commits (write) |
| `checks` | Lecture des résultats de vérification (read) |
| `actions` | Gestion des workflows GitHub Actions (read/write) |

### Workflow avec Permissions Complètes

```yaml
name: Full-Featured Workflow
on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write
  issues: write
  statuses: write
  checks: read

jobs:
  analyze-and-comment:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      contents: read
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run analysis
        id: analysis
        run: |
          # Code analysis
          echo "quality_score=95" >> $GITHUB_OUTPUT
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Quality score: ${{ steps.analysis.outputs.quality_score }}/100'
            })
```

### Bonnes Pratiques de Sécurité

```yaml
name: Security-First Workflow
on:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  # Job 1 : Lecture seule
  security-scan:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security scanner
        run: npm audit --audit-level=moderate
  
  # Job 2 : Restriction maximum
  build:
    runs-on: ubuntu-latest
    permissions: {}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build
        run: npm run build
  
  # Job 3 : Permissions spécifiques uniquement si nécessaire
  deploy:
    runs-on: ubuntu-latest
    needs: [security-scan, build]
    permissions:
      contents: read
      deployments: write
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to production
        run: echo "Deploying with limited permissions"
```

### Utilisation de Tokens Personnalisés

Pour des besoins spécifiques, les tokens personnalisés avec permissions restreintes améliorent la sécurité :

```yaml
name: Custom Token Workflow
on:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://npm.pkg.github.com'
      
      - name: Install and publish
        run: |
          npm ci
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 4️⃣ Environnements et Déploiements

### Concept d'Environnement

Les environnements dans GitHub Actions fournissent un mécanisme structuré pour déployer du code dans différents contextes (développement, staging, production) avec des configurations, des secrets et des approbations spécifiques.[4]

### Architecture des Environnements

```
┌─────────────────────────────────────────┐
│         GitHub Actions Workflow         │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Environment: Development        │  │
│  │  - Variables: DEV_API_URL        │  │
│  │  - Secrets: DEV_API_KEY          │  │
│  │  - Reviewers: None               │  │
│  │  - Deployment Branch: any        │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Environment: Staging            │  │
│  │  - Variables: STAGING_API_URL    │  │
│  │  - Secrets: STAGING_API_KEY      │  │
│  │  - Reviewers: senior-dev         │  │
│  │  - Deployment Branch: main only  │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Environment: Production         │  │
│  │  - Variables: PROD_API_URL       │  │
│  │  - Secrets: PROD_API_KEY         │  │
│  │  - Reviewers: tech-lead, manager │  │
│  │  - Deployment Branch: main only  │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Configuration des Environnements

```yaml
name: Multi-Environment Deployment
on:
  push:
    branches:
      - develop
      - main
      - production

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Run tests
        run: npm test

  deploy-dev:
    runs-on: ubuntu-latest
    needs: test
    environment:
      name: Development
      url: https://dev.example.com
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Development
        run: |
          echo "Deploying to ${{ vars.DEV_API_URL }}"
          npm run deploy:dev
        env:
          API_URL: ${{ vars.DEV_API_URL }}
          API_KEY: ${{ secrets.DEV_API_KEY }}

  deploy-staging:
    runs-on: ubuntu-latest
    needs: test
    environment:
      name: Staging
      url: https://staging.example.com
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Staging
        run: npm run deploy:staging
        env:
          API_URL: ${{ vars.STAGING_API_URL }}
          API_KEY: ${{ secrets.STAGING_API_KEY }}

  deploy-prod:
    runs-on: ubuntu-latest
    needs: test
    environment:
      name: Production
      url: https://example.com
    if: github.ref == 'refs/heads/production'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Production
        run: npm run deploy:prod
        env:
          API_URL: ${{ vars.PROD_API_URL }}
          API_KEY: ${{ secrets.PROD_API_KEY }}
```

### Approbations et Révisions

Les environnements peuvent exiger une approbation avant l'exécution :

```yaml
name: Deployment with Approvals
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: npm run build

  production-deployment:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: Production
      url: https://example.com
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Production
        run: |
          echo "Production deployment started"
          npm run deploy:prod
      
      - name: Notify deployment
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🚀 Deployment to Production completed!'
            })
```

Lors de la configuration de l'environnement dans l'interface GitHub, les administrateurs spécifient les reviewers requis. Le workflow pause avant le job `production-deployment` jusqu'à approbation.

### Variables d'Environnement vs Secrets

```yaml
name: Environment Variables Management
on:
  push:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: Staging
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use environment configuration
        run: |
          # Variables (non-sensibles, visibles dans les logs)
          echo "API URL: ${{ vars.STAGING_API_URL }}"
          echo "Log Level: ${{ vars.LOG_LEVEL }}"
          
          # Secrets (masqués dans les logs)
          echo "Using API key: ${{ secrets.STAGING_API_KEY }}"
          echo "Using DB password: ${{ secrets.DB_PASSWORD }}"
```

**Différences clés :**

| Aspect | Variables | Secrets |
|--------|-----------|---------|
| Visibilité | Affichées dans les logs | Masquées/échappées dans les logs |
| Sensibilité | Données non-sensibles | Données sensibles |
| Valeur par défaut | Oui, au niveau du dépôt | Oui, au niveau du dépôt |
| Priorité | Environnement > Dépôt | Environnement > Dépôt |

### Déploiement Progressif

```yaml
name: Progressive Deployment
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.image.outputs.tag }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build image
        id: image
        run: |
          TAG="v-${{ github.sha }}"
          echo "tag=$TAG" >> $GITHUB_OUTPUT

  deploy-canary:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: Production-Canary
      url: https://canary.example.com
    
    steps:
      - name: Deploy canary (5% traffic)
        run: |
          echo "Deploying canary with image: ${{ needs.build.outputs.image-tag }}"
          # Deployment logic for 5% of users

  validate-canary:
    runs-on: ubuntu-latest
    needs: deploy-canary
    
    steps:
      - name: Monitor metrics
        run: |
          echo "Validating canary deployment metrics..."
          # Health checks and metrics validation

  deploy-full:
    runs-on: ubuntu-latest
    needs: validate-canary
    environment:
      name: Production-Full
      url: https://example.com
    
    steps:
      - name: Deploy to full production (100% traffic)
        run: |
          echo "Full production deployment"
          # Complete rollout
```

---

## 5️⃣ Concurrence

### Concept de Concurrence

La concurrence dans GitHub Actions gère l'exécution simultanée des workflows pour éviter les conflits, les conditions de course (race conditions) et les déploiements concurrents vers les mêmes environnements.[4]

### Problèmes Résultant de l'Absence de Gestion

Sans gestion appropriée de la concurrence, plusieurs scénarios problématiques peuvent survenir :

- **Déploiements concurrents** : deux déploiements modifient simultanément les mêmes ressources
- **Conditions de course** : les étapes s'exécutent dans un ordre imprévisible
- **Consommation excessive de ressources** : trop de jobs s'exécutent simultanément
- **Incohérence d'état** : le système se retrouve dans un état indéfini

### Configuration Basique

```yaml
name: Concurrency Control Example
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build
        run: npm run build
```

Ici :
- `group` identifie de manière unique la concurrence. Tous les workflows avec le même groupe ne s'exécutent pas simultanément
- `cancel-in-progress: false` signifie que les workflows précédents terminent leur exécution avant le démarrage du nouveau

### Concurrence Par Environnement

```yaml
name: Environment-Based Concurrency
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    concurrency:
      group: testing-${{ github.ref }}
      cancel-in-progress: true
    
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  deploy-dev:
    runs-on: ubuntu-latest
    needs: test
    concurrency:
      group: deployment-dev
      cancel-in-progress: true
    environment: Development
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run deploy:dev

  deploy-prod:
    runs-on: ubuntu-latest
    needs: test
    concurrency:
      group: deployment-prod
      cancel-in-progress: false
    environment: Production
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run deploy:prod
```

Configuration détaillée :
- Les tests utilisent `cancel-in-progress: true` car les résultats de test précédents deviennent obsolètes rapidement
- Le déploiement dev utilise `cancel-in-progress: true` pour économiser les ressources
- Le déploiement production utilise `cancel-in-progress: false` pour garantir que tous les déploiements complètent, évitant les états partiels

### Stratégies Avancées de Concurrence

```yaml
name: Advanced Concurrency Patterns
on:
  push:
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    concurrency:
      group: lint-${{ github.head_ref || github.ref }}
      cancel-in-progress: true
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  unit-tests:
    runs-on: ubuntu-latest
    concurrency:
      group: unit-tests-${{ github.head_ref || github.ref }}
      cancel-in-progress: true
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run test:unit

  integration-tests:
    runs-on: ubuntu-latest
    concurrency:
      group: integration-tests-${{ github.head_ref || github.ref }}
      cancel-in-progress: true
    needs: [lint, unit-tests]
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run test:integration

  build:
    runs-on: ubuntu-latest
    concurrency:
      group: build-${{ github.head_ref || github.ref }}
      cancel-in-progress: true
    needs: [integration-tests]
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run build

  deploy:
    runs-on: ubuntu-latest
    concurrency:
      group: deploy-${{ github.ref }}
      cancel-in-progress: false
    environment: Production
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run deploy
```

### Gestion de la Concurrence avec Matrix

```yaml
name: Matrix with Concurrency Control
on:
  push:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        database: [postgres, mysql]
    concurrency:
      group: test-${{ matrix.node-version }}-${{ matrix.database }}
      cancel-in-progress: true
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Test with ${{ matrix.database }}
        run: npm test -- --database=${{ matrix.database }}
```

### Table Comparative : Stratégies de Concurrence

| Stratégie | Groupe | Cancel-in-Progress | Cas d'Usage |
|-----------|--------|-------------------|-----------|
| **Développement rapide** | Par PR | true | Linting, tests unitaires |
| **Déploiement principal** | Par environnement | false | Production, staging |
| **Ressources limitées** | Par workflow | true | Économiser les ressources |
| **Haute fiabilité** | Par environnement | false | Déploiements critiques |

### Concurrence et État Partagé

```yaml
name: Concurrency with State Management
on:
  push:
    branches: [main]

concurrency:
  group: release-${{ github.ref }}
  cancel-in-progress: false

jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.new-version }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Calculate new version
        id: version
        run: |
          NEW_VERSION="1.2.$((${{ github.run_number }}))"
          echo "new-version=$NEW_VERSION" >> $GITHUB_OUTPUT

  build-and-push:
    runs-on: ubuntu-latest
    needs: prepare
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build with version ${{ needs.prepare.outputs.version }}
        run: |
          echo "Building version ${{ needs.prepare.outputs.version }}"
          # Build logic

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-push
    environment:
      name: Production
      url: https://example.com
    
    steps:
      - name: Deploy
        run: echo "Deployment completed"
```

---

## 🎓 Cheminement d'Apprentissage Intégré

### Phase 1 : Fondamentaux (1-2 jours)

Débuter par la **gestion des caches** permet de comprendre comment GitHub Actions optimise les exécutions. Les caches constituent un concept simple avec des bénéfices immédiats visibles dans les temps d'exécution. Cette fondation facilite la compréhension des performances futures.

Ensuite, explorer les **matrices de base** crée une compréhension du parallélisme. Construire un workflow simple testant une application sur 3 versions de Node.js démontre la puissance de l'automatisation sans accaparement d'administration.

### Phase 2 : Optimisation Avancée (2-3 jours)

Une fois familiarisé avec les caches et matrices simples, approfondir le **fail-fast** et les stratégies avancées révèle comment contrôler l'efficacité des workflows. Comprendre quand annuler versus continuer l'exécution prépare à des décisions productives sur des pipelines réalistes.

La **limitation du parallélisme** et les règles d'inclusion/exclusion ajoutent des contrôles granulaires sur la consommation de ressources.

### Phase 3 : Sécurité et Gouvernance (2-3 jours)

Les **permissions** s'apprennent naturellement après les matrices, car elles complètent les workflows en ajoutant des barrières de sécurité. Implémenter le principe du moindre privilège devient une habitude constante.

Les **environnements et déploiements** structurent les workflows pour refléter les processus métier réels (dev/staging/prod). Cette phase transforme les workflows techniques en outils professionnels avec approbations et validations.

### Phase 4 : Orchestration Avancée (2-3 jours)

La **concurrence** représente le concept le plus complexe, orchestrant plusieurs workflows pour éviter les conflits. Après comprendre les caches, matrices, permissions et environnements, la concurrence devient l'outil final pour orchestrer systèmes complexes.

### Progression Typique d'un Projet Réaliste

**Semaine 1 :** Configuration d'un workflow de test basique avec cache npm et matrice de 2 versions de Node.js

**Semaine 2 :** Ajout d'un environnement staging, permissions limitées, et fail-fast désactivé pour debugging

**Semaine 3 :** Implémentation d'un déploiement multi-environnements (dev/staging/prod) avec approbations

**Semaine 4 :** Optimisation via concurrence par environnement, inclusion/exclusion de configurations, et gestion avancée des caches

---

## 📚 Ressources de Référence

La documentation officielle de GitHub sur les workflows fournit les détails complets pour chaque concept. Les guides incluent des exemples pratiques pour chaque configuration avancée. Pour les caches, consulter la documentation spécifique aux actions `setup-node`, `setup-python` etc. pour comprendre les caches gérés automatiquement.

Les configurations YAML présentées ci-dessus couvrent l'ensemble des scénarios courants, des plus simples aux plus complexes. Adapter ces exemples à des contextes spécifiques facilite l'adoption dans des projets réels.

---

## ✨ Points Clés à Retenir

**Caches :** Réduisent drastiquement les temps d'exécution en réutilisant les installations et compilations précédentes, avec une gestion intelligente par clé et restauration en cascade.

**Matrices :** Éliminent la duplication en générant dynamiquement plusieurs variations de jobs, avec contrôle du fail-fast pour équilibrer rapidité et fiabilité.

**Permissions :** Appliquent le moindre privilège, limitant l'accès des workflows aux ressources minimales nécessaires.

**Environnements :** Structurent les déploiements avec variables, secrets et approbations spécifiques à chaque étape (dev/staging/prod).

**Concurrence :** Orchestrent les workflows parallèles pour éviter les conflits et les états incohérents, garantissant la sécurité et la prévisibilité des exécutions complexes.

Ces cinq domaines forment un écosystème complet pour produire des workflows sophistiqués, sécurisés et performants en production.
