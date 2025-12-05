# Citations
- https://shipyard.build/blog/gha-recipes-build-and-push-container-registry/
- https://runcloud.io/blog/setup-docker-github-actions-ci-cd
- https://docs.github.com/actions/creating-actions/creating-a-docker-container-action
- https://docs.github.com/actions/using-jobs/running-jobs-in-a-container
- https://docs.github.com/actions/tutorials/communicating-with-docker-service-containers
- https://docs.github.com/actions/hosting-your-own-runners/customizing-the-containers-used-by-jobs
- https://aschmelyun.com/blog/using-docker-run-inside-of-github-actions/
- https://docs.docker.com/guides/reactjs/configure-github-actions/
- https://github.com/docker/build-push-action/discussions/1020


# Tokens
- prompt_tokens: 273
- completion_tokens: 6875
- total_tokens: 7148
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.103, 'request_cost': 0.006, 'total_cost': 0.11}


# Content
# Chapitre 6 : Github Actions - Notions Avancées

## 🐳 Utiliser des Conteneurs Docker

### Concepts Fondamentaux

Les conteneurs Docker offrent un environnement d'exécution isolé et reproductible pour les workflows GitHub Actions. Cette approche garantit que les jobs s'exécutent dans des conditions identiques, indépendamment de la machine hôte. L'intégration entre Docker et GitHub Actions permet de définir précisément l'environnement d'exécution et d'améliorer la cohérence des pipelines CI/CD.[4]

### Exécution d'un Job dans un Conteneur

La syntaxe fondamentale pour exécuter un job dans un conteneur Docker utilise la directive `container:` dans le fichier de workflow.[4] Voici un exemple complet :

```yaml
name: CI
on:
  push:
    branches: [ main ]
jobs:
  container-test-job:
    runs-on: ubuntu-latest
    container:
      image: node:18
      env:
        NODE_ENV: development
      ports:
        - 80
      volumes:
        - my_docker_volume:/volume_mount
      options: --cpus 1
    steps:
      - name: Check for dockerenv file
        run: (ls /.dockerenv && echo Found dockerenv) || (echo No dockerenv)
```

Ce workflow démontre plusieurs configurations essentielles :

- **image** : Spécifie l'image Docker à utiliser (ici Node.js 18)
- **env** : Définit les variables d'environnement au sein du conteneur
- **ports** : Expose les ports nécessaires
- **volumes** : Monte des volumes Docker pour la persistance de données
- **options** : Ajoute des options de ressources comme les limitations CPU

### Gestion des Volumes

Les volumes permettent de monter des répertoires ou des données entre l'hôte et le conteneur.[4] La syntaxe générale suit le format `<source>:<destinationPath>` :

```yaml
volumes:
  - my_docker_volume:/volume_mount
  - /data/my_data
  - /source/directory:/destination/directory
```

La source peut être soit un nom de volume Docker, soit un chemin absolu sur la machine hôte. Le chemin de destination doit être un chemin absolu à l'intérieur du conteneur.

### Accès à l'Espace de Travail

GitHub mappe automatiquement le répertoire de travail du runner avec `/github/workspace` dans le conteneur.[3] Cela signifie que tout fichier créé ou modifié dans cette location sur le conteneur sera accessible aux étapes suivantes du job. Cette fonctionnalité s'avère particulièrement utile pour les actions qui généraient des artefacts de build.

```yaml
workflow.yml:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5

      - name: Containerized Build
        uses: ./.github/actions/my-container-action

      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: workspace_artifacts
          path: ${{ github.workspace }}
```

### Création d'Actions Docker Personnalisées

Pour créer une action Docker personnalisée, il est nécessaire de définir un fichier `Dockerfile` et un fichier de métadonnées `action.yml`.[3]

Voici un exemple minimal de Dockerfile :

```dockerfile
FROM alpine:3.10

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

Ce Dockerfile utilise Alpine Linux comme image de base (légère et optimisée), copie le script d'entrée, et le définit comme point d'entrée du conteneur.

Le fichier `action.yml` accompagnant définit les entrées et sorties de l'action :

```yaml
name: 'Hello world action'
description: 'Greet someone'
inputs:
  who-to-greet:
    description: 'Who to greet'
    required: true
    default: 'World'
outputs:
  time:
    description: 'The time we greeted you'
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.who-to-greet }}
```

### Construction et Publication d'Images Docker

La construction et la publication d'images Docker via GitHub Actions requiert une authentification appropriée.[1] Voici le processus complet pour publier vers GitHub Container Registry (GHCR) :

```yaml
- name: Log in to ghcr.io
  run: echo "${{ secrets.GHCR_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin

- name: Build and tag image
  run: |
    COMMIT_SHA=$(echo $GITHUB_SHA | cut -c1-7)
    docker build -t ghcr.io/${{ github.repository_owner }}/${{ github.repository }}:$COMMIT_SHA -f path/to/Dockerfile .

- name: Push image to GHCR
  run: docker push ghcr.io/${{ github.repository_owner }}/${{ github.repository }}:$COMMIT_SHA
```

Pour Docker Hub, la démarche est similaire mais requiert l'enregistrement de secrets spécifiques :[1]

```yaml
- name: Log in to Docker Hub
  run: echo "${{ secrets.DOCKERHUB_PASSWORD }}" | docker login -u ${{ secrets.DOCKERHUB_USERNAME }} --password-stdin

- name: Build and tag image
  run: |
    COMMIT_SHA=$(echo $GITHUB_SHA | cut -c1-7)
    docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/my-image:$COMMIT_SHA .

- name: Push to Docker Hub
  run: docker push ${{ secrets.DOCKERHUB_USERNAME }}/my-image:$COMMIT_SHA
```

### Limitations de Ressources

Les options Docker permettent de limiter les ressources allouées à un conteneur. L'option `--cpus` contrôle le nombre de CPUs accessibles :[4]

```yaml
container:
  image: ubuntu:latest
  options: --cpus 1
```

Cette configuration limite le conteneur à utiliser au maximum 1 CPU, ce qui s'avère utile pour tester le comportement de l'application dans des environnements à ressources limitées.

---

## 🔗 Les Services

### Architecture des Conteneurs de Service

GitHub Actions permet de configurer des conteneurs de service qui fonctionnent en parallèle avec le job principal.[5] Chaque conteneur de service s'exécute dans une instance fraîche et s'arrête automatiquement une fois le job terminé. Cette architecture permet aux étapes du job de communiquer avec tous les conteneurs de service du même job.

Les cas d'usage courants incluent :

- Les bases de données (PostgreSQL, MySQL, MongoDB)
- Les systèmes de cache (Redis)
- Les services tiers (Elasticsearch, RabbitMQ)
- Les serveurs web locaux

### Configuration des Conteneurs de Service

La syntaxe pour configurer un service repose sur la clé `services:` au niveau du job :[5]

```yaml
name: Testing with Services
on:
  push:
    branches: [ main ]

jobs:
  test-job:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:6
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Run tests against services
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@postgres:5432/testdb
          REDIS_URL: redis://redis:6379
```

### Communication entre Conteneurs

Les conteneurs de service sont accessibles via leurs noms de service définis comme hôtes DNS.[5] Dans l'exemple précédent, PostgreSQL est accessible via `postgres:5432` et Redis via `redis:6379`. Cette résolution DNS automatique facilite la communication sans nécessiter la connaissance des adresses IP.

### Vérifications de Santé

Les options de vérification de santé garantissent que le service est prêt avant l'exécution des étapes du job. Voici un exemple pour MongoDB :

```yaml
mongodb:
  image: mongo:4.4
  options: >-
    --health-cmd "mongo --eval 'db.adminCommand(\"ping\")'\"
    --health-interval 10s
    --health-timeout 5s
    --health-retries 5
  ports:
    - 27017:27017
```

L'option `--health-cmd` définit la commande de vérification, tandis que les autres paramètres contrôlent la fréquence et le nombre de tentatives.

### Docker Compose dans GitHub Actions

Docker Compose s'intègre efficacement dans GitHub Actions pour gérer les configurations multi-conteneurs.[2] Voici un exemple utilisant Docker Compose :

```yaml
name: CI with Docker Compose
on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Start services with Docker Compose
        run: docker-compose up -d

      - name: Wait for services to be ready
        run: sleep 10

      - name: Run application tests
        run: npm test

      - name: Stop services
        run: docker-compose down
```

Le fichier `docker-compose.yml` correspondant :

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
      - cache

  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: testdb
    ports:
      - "5432:5432"

  cache:
    image: redis:6
    ports:
      - "6379:6379"
```

---

## 📦 Les Artefacts

### Concept et Utilité des Artefacts

Les artefacts sont des fichiers générés au cours de l'exécution d'un workflow GitHub Actions qui doivent être conservés et rendus accessibles après la fin du job.[3] Contrairement aux fichiers stockés dans le workspace qui sont supprimés après l'exécution, les artefacts sont stockés dans le stockage des artefacts de GitHub et demeurent accessibles pour une période définie.

Les types d'artefacts courants incluent :

- Les binaires compilés
- Les distributions packagées
- Les rapports de test et de couverture de code
- Les logs d'exécution
- Les fichiers de configuration générés

### Upload d'Artefacts

L'action `actions/upload-artifact` permet de sauvegarder des fichiers ou des répertoires.[3] Voici un exemple complet :

```yaml
name: Build and Upload Artifacts
on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build project
        run: |
          mkdir -p build
          npm run build
          cp -r dist build/

      - name: Create test report
        run: npm test -- --coverage

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: build/
          retention-days: 30

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7
```

Les paramètres essentiels sont :

- **name** : Identifiant unique de l'artefact
- **path** : Chemin vers les fichiers ou répertoires à télécharger
- **retention-days** : Nombre de jours de conservation (par défaut 90)

### Stockage et Téléchargement des Artefacts

Les artefacts sont accessibles via l'interface web de GitHub ou téléchargeables via l'API. Les paramètres de rétention peuvent être gérés au niveau du dépôt ou du workflow.

```yaml
- name: Upload multiple artifacts
  uses: actions/upload-artifact@v4
  with:
    name: all-artifacts
    path: |
      build/
      dist/
      reports/
    retention-days: 14
```

### Téléchargement d'Artefacts dans d'autres Jobs

L'action `actions/download-artifact` récupère les artefacts générés par d'autres jobs du même workflow :[3]

```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build application
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: application-build
          path: dist/

  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v4
        with:
          name: application-build
          path: ./downloaded-app

      - name: Deploy to production
        run: ./deploy.sh ./downloaded-app
```

### Gestion des Espaces de Travail avec Conteneurs

Lorsque les jobs s'exécutent dans des conteneurs, les fichiers créés dans `/github/workspace` sont automatiquement accessibles aux étapes suivantes et peuvent être téléchargés comme artefacts.[3] Cette synchronisation automatique élimine la nécessité de gérer explicitement la copie des fichiers entre le conteneur et l'hôte.

```yaml
jobs:
  containerized-build:
    runs-on: ubuntu-latest
    container:
      image: node:18
    steps:
      - uses: actions/checkout@v3

      - name: Build in container
        run: |
          npm install
          npm run build
          # Les fichiers dans /github/workspace seront accessibles après le job

      - name: Upload build from container
        uses: actions/upload-artifact@v4
        with:
          name: container-build
          path: /github/workspace/dist/
```

---

## 📋 Les Résumés de Jobs

### Concept des Résumés de Jobs

Les résumés de jobs (job summaries) permettent de générer des rapports formatés en Markdown qui s'affichent dans l'interface GitHub après l'exécution du workflow. Ces résumés offrent une visibilité immédiate sur les résultats clés sans nécessiter d'accéder aux logs complets.

### Génération de Résumés Simples

Les résumés sont générés en écrivant du contenu Markdown dans la variable d'environnement `GITHUB_STEP_SUMMARY` :[4]

```bash
echo "# Test Results" >> $GITHUB_STEP_SUMMARY
echo "## Summary" >> $GITHUB_STEP_SUMMARY
echo "- Tests passed: 156" >> $GITHUB_STEP_SUMMARY
echo "- Tests failed: 2" >> $GITHUB_STEP_SUMMARY
echo "- Coverage: 89%" >> $GITHUB_STEP_SUMMARY
```

### Intégration dans les Workflows

Voici un exemple complet intégrant les résumés dans un workflow de test :

```yaml
name: Test with Summary
on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests and generate report
        run: |
          npm test -- --json --outputFile=test-results.json || true

      - name: Generate job summary
        run: |
          echo "# 🧪 Test Results Summary" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "| Metric | Value |" >> $GITHUB_STEP_SUMMARY
          echo "|--------|-------|" >> $GITHUB_STEP_SUMMARY
          echo "| Total Tests | 156 |" >> $GITHUB_STEP_SUMMARY
          echo "| Passed | 154 |" >> $GITHUB_STEP_SUMMARY
          echo "| Failed | 2 |" >> $GITHUB_STEP_SUMMARY
          echo "| Success Rate | 98.7% |" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "## Failed Tests" >> $GITHUB_STEP_SUMMARY
          echo "- UserService::should create user with valid data" >> $GITHUB_STEP_SUMMARY
          echo "- AuthService::should refresh token within 1 hour" >> $GITHUB_STEP_SUMMARY
```

### Résumés avec Tableaux Formatés

Les résumés deviennent particulièrement utiles pour présenter des données complexes via des tableaux Markdown :

```yaml
- name: Generate deployment summary
  run: |
    echo "# 🚀 Deployment Report" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "| Environment | Status | Version | Time |" >> $GITHUB_STEP_SUMMARY
    echo "|-------------|--------|---------|------|" >> $GITHUB_STEP_SUMMARY
    echo "| Staging | ✅ Success | v1.2.3 | 2m 34s |" >> $GITHUB_STEP_SUMMARY
    echo "| Production | ✅ Success | v1.2.3 | 3m 12s |" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "### Changes Deployed" >> $GITHUB_STEP_SUMMARY
    echo "- Feature: User authentication with OAuth2" >> $GITHUB_STEP_SUMMARY
    echo "- Fix: Memory leak in cache manager" >> $GITHUB_STEP_SUMMARY
    echo "- Docs: Updated API documentation" >> $GITHUB_STEP_SUMMARY
```

### Résumés Conditionnels

Les résumés peuvent être générés conditionnellement en fonction du résultat des étapes précédentes :

```yaml
- name: Run integration tests
  id: integration-tests
  continue-on-error: true
  run: npm run test:integration

- name: Generate conditional summary
  if: always()
  run: |
    if [ "${{ steps.integration-tests.outcome }}" == "success" ]; then
      echo "# ✅ Integration Tests Passed" >> $GITHUB_STEP_SUMMARY
    else
      echo "# ❌ Integration Tests Failed" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      echo "Please review the detailed logs for error information." >> $GITHUB_STEP_SUMMARY
    fi
```

### Résumés avec Statistiques de Couverture

Pour les workflows de test avec mesure de couverture de code :

```yaml
- name: Generate coverage summary
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | grep '"lines"' | head -1 | grep -oP '\d+\.\d+')
    echo "# 📊 Code Coverage Report" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "- **Overall Coverage**: $COVERAGE%" >> $GITHUB_STEP_SUMMARY
    echo "- **Lines Covered**: 1,245 / 1,400" >> $GITHUB_STEP_SUMMARY
    echo "- **Branches Covered**: 892 / 1,000" >> $GITHUB_STEP_SUMMARY
    echo "- **Functions Covered**: 156 / 175" >> $GITHUB_STEP_SUMMARY
```

---

## 🔐 Sécurité : Injection de Scripts et Utilisation d'Actions Tierces

### Risques d'Injection de Scripts

L'injection de scripts représente une vulnérabilité critique dans les workflows GitHub Actions. Elle survient lorsque des entrées non validées sont directement insérées dans des commandes shell ou des expressions GitHub Actions. Une acteur malveillant peut injecter du code arbitraire qui s'exécute avec les permissions du workflow.

Voici un exemple vulnérable :

```yaml
name: Vulnerable Workflow
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  vulnerable-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Dangerous use of PR title
        run: echo "Processing PR: ${{ github.event.pull_request.title }}"
        # ⚠️ DANGER : Si le titre est `; rm -rf /`, cela supprime des fichiers
```

### Protection contre l'Injection de Scripts

La première ligne de défense consiste à utiliser des variables d'environnement plutôt que des interpolations directes dans les commandes shell :[2]

```yaml
name: Secure Workflow
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  secure-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Safe handling of PR data
        env:
          PR_TITLE: ${{ github.event.pull_request.title }}
          PR_BODY: ${{ github.event.pull_request.body }}
          PR_AUTHOR: ${{ github.event.pull_request.user.login }}
        run: |
          echo "Processing PR: $PR_TITLE"
          echo "Author: $PR_AUTHOR"
          # Les variables d'environnement sont échappées automatiquement
```

### Gestion Sécurisée des Secrets

GitHub Actions stocke les secrets de manière chiffrée et les révèle uniquement aux workflows autorisés. Cependant, il faut éviter de les afficher accidentellement :[2]

```yaml
jobs:
  secure-deployment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy with credentials
        env:
          API_TOKEN: ${{ secrets.DEPLOYMENT_TOKEN }}
          DATABASE_PASSWORD: ${{ secrets.DB_PASSWORD }}
        run: |
          # Les secrets sont automatiquement masqués dans les logs
          ./deploy.sh
          # ⚠️ DANGER : Ceci afficherait le secret dans les logs
          # echo "Token: $API_TOKEN"
```

### Mise en Œuvre de Contrôles d'Accès

Pour les actions tierces, il convient de limiter les permissions via la clé `permissions:` :[1]

```yaml
name: Limited Permissions Workflow
on:
  push:
    branches: [ main ]

permissions:
  contents: read
  packages: write
  pull-requests: read

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3

      - name: Build image
        run: docker build -t myapp:latest .

      - name: Push to registry
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
```

### Évaluation des Actions Tierces

Avant d'utiliser une action tierce, il faut examiner :

- **La source** : Préférer les actions officielles de GitHub ou celles d'organisations reconnues
- **La maintenance** : Vérifier que l'action est régulièrement mise à jour
- **Les dépendances** : Examiner les dépendances transitives pour identifier les vulnérabilités
- **Les permissions requises** : Comprendre exactement ce que l'action peut faire

```yaml
jobs:
  third-party-safe:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3

      # ✅ Action officielle de GitHub
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      # ✅ Action d'une organisation connue avec contrôle de version strict
      - uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # ⚠️ Action tierce : à évaluer attentivement
      # - uses: unknown-org/risky-action@latest  # À éviter
```

### Utilisation de SHA pour la Sécurité des Actions

Pour les actions tierces, il est recommandé de référencer des versions précises plutôt que des tags flexibles :[1]

```yaml
jobs:
  production-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        # ✅ Bonne pratique : utiliser un SHA spécifique
        # with:
        #   ref: abc123def456...

      # ✅ Référence par version majeure
      - uses: actions/setup-node@v3

      # ⚠️ À éviter : utiliser 'latest' car l'action peut changer
      # - uses: actions/setup-node@latest

      # ✅ Meilleure sécurité : utiliser un SHA complet
      - uses: docker/login-action@27aaf59b1031d4b0f4eed3c3cc2345dfaa9a306d
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
```

### Audit et Analyse des Actions Tierces

Pour sécuriser l'utilisation d'actions tierces, mettre en place un processus d'audit :

```yaml
name: Security Audit Workflow
on:
  schedule:
    - cron: '0 0 * * 0'  # Chaque dimanche

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Scan dependencies
        run: |
          npm audit
          # Ou tout autre outil d'audit pertinent

      - name: Generate security report
        run: |
          echo "# 🔐 Security Audit Report" >> $GITHUB_STEP_SUMMARY
          echo "Audit completed successfully" >> $GITHUB_STEP_SUMMARY

      - name: Notify if vulnerabilities found
        if: failure()
        run: |
          echo "Security vulnerabilities detected!"
          exit 1
```

### Pratiques Recommandées pour les Workflows Sécurisés

Voici un exemple de workflow suivant les meilleures pratiques de sécurité :

```yaml
name: Secure CI/CD Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  packages: write

jobs:
  security-checks:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@v3

      - name: Run security scanner
        run: npm audit --audit-level=moderate

  build-and-test:
    runs-on: ubuntu-latest
    needs: security-checks
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: dist/
          retention-days: 7

  publish-artifacts:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    permissions:
      packages: write
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Download artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-artifacts

      - name: Authenticate with registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Publish artifacts
        run: |
          echo "Publishing build artifacts..."
```

---

## 🎯 Synthèse et Progression Pédagogique

### Parcours d'Apprentissage Progressif

L'apprentissage de ces notions avancées suivre un ordre logique de progression :

**Étape 1 : Conteneurs Docker (Fondations)**
La compréhension des conteneurs Docker dans GitHub Actions constitue la base de toutes les notions avancées. Elle permet de maîtriser l'isolation des environnements et la reproductibilité des exécutions.

**Étape 2 : Services (Extension)**
Une fois les conteneurs maîtrisés, les services représentent l'étape logique suivante, montrant comment orchestrer plusieurs conteneurs qui collaborent.

**Étape 3 : Artefacts (Stockage et Traçabilité)**
Les artefacts introduisent la notion de persistance et de transfert de données entre jobs, essentielle pour les pipelines multi-jobs.

**Étape 4 : Résumés de Jobs (Visibilité)**
Les résumés de jobs apportent une meilleure visibilité sur les résultats, crucial pour les workflows complexes.

**Étape 5 : Sécurité (Protection)**
La sécurité constituant le dernier niveau, elle s'appuie sur la compréhension des étapes précédentes pour protéger efficacement les workflows.

### Points Clés à Retenir

- **Les conteneurs Docker** offrent une isolation complète et une reproductibilité garantie
- **Les services** permettent d'orchestrer des environnements multi-conteneurs pour les tests intégrés
- **Les artefacts** assurent la persistence des données entre jobs et leurs versions
- **Les résumés de jobs** améliorent la visibilité des résultats pour les utilisateurs
- **La sécurité** requiert une vigilance constante sur l'injection de scripts et la gestion des actions tierces
