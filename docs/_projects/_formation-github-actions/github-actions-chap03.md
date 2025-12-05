# Citations
- https://www.glukhov.org/fr/post/2025/07/github-actions-cheatsheet/
- https://blog.stephane-robert.info/docs/pipeline-cicd/github/
- https://apprendre-la-programmation.net/configurer-ci-github-actions/
- https://docs.github.com/fr/actions/get-started/understand-github-actions
- https://blog.eleven-labs.com/fr/et-si-on-passait-a-github-actions/
- https://docs.github.com/fr/actions
- https://docs.github.com/actions
- https://docs.github.com/fr/actions/reference/workflows-and-actions/workflow-syntax
- https://docs.github.com/fr/actions/get-started
- https://docs.github.com/articles/getting-started-with-github-actions


# Tokens
- prompt_tokens: 279
- completion_tokens: 9737
- total_tokens: 10016
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.146, 'request_cost': 0.006, 'total_cost': 0.153}


# Content
# Chapitre 3 : Principales notions Github Actions

## Introduction aux concepts fondamentaux

GitHub Actions repose sur plusieurs concepts interdépendants qui permettent de construire des workflows automatisés sophistiqués. Cette section explore en profondeur les mécanismes qui constituent l'épine dorsale des pipelines CI/CD modernes, en fournissant des explications détaillées, des exemples concrets et des cas d'usage pratiques.[1][2]

---

## Utilisation des actions

### Comprendre les actions dans GitHub Actions

Une **action** représente une unité réutilisable de code ou de travail qui effectue des tâches spécifiques au sein d'un workflow.[4] Les actions encapsulent des processus complexes, réduisant ainsi la nécessité d'écrire du code répétitif dans les fichiers de workflow. Elles constituent les briques fondamentales permettant de construire des pipelines sophistiqués.

### Catégories d'actions

Les actions disponibles dans l'écosystème GitHub se divisent en trois catégories principales :

**Actions officielles**

Les actions officielles sont maintenues par GitHub et offrent des fonctionnalités essentielles pour les workflows courants. Ces actions bénéficient du support complet de GitHub et sont régulièrement mises à jour.[1]

Voici les principales actions officielles :

| Action | Objectif | Paramètres clés |
|--------|----------|-----------------|
| actions/checkout | Vérifie le code du dépôt | ref, submodules |
| actions/setup-node | Configure Node.js | node-version, cache |
| actions/setup-python | Configure Python | python-version |
| actions/cache | Mettre en cache les dépendances | path, key, restore-keys |
| actions/upload-artifact | Télécharger les artefacts de build | name, path, if-no-files-found |
| actions/download-artifact | Télécharger les artefacts | name, path |
| actions/create-release | Crée une publication GitHub | tag_name, release_name |
| actions/labeler | Applique automatiquement des étiquettes | repo-token, configuration-path |

**Actions communautaires**

La communauté GitHub développe des actions qui adressent des besoins spécifiques non couverts par les actions officielles. Ces actions sont souvent hautement spécialisées et offrent des fonctionnalités innovantes.

**Actions tierces**

Les fournisseurs externes proposent des actions pour intégrer leurs services avec GitHub Actions, incluant des outils de déploiement, d'analyse de code et d'infrastructure.

### Syntaxe d'utilisation des actions

La syntaxe générale pour appeler une action suit un modèle standardisé :[1]

```yaml
- name: Décrire l'action
  uses: owner/repo@ref
  with:
    param1: valeur1
    param2: valeur2
  env:
    VAR_ENV: valeur
  if: ${{ condition }}
  continue-on-error: true
```

**Paramètres d'action détaillés :**

- **uses** : Référence l'action à utiliser au format `propriétaire/dépôt@version`
- **with** : Arguments spécifiques à l'action (varient selon l'action)
- **env** : Variables d'environnement disponibles pour l'action
- **if** : Condition d'exécution (expression conditionnelle)
- **continue-on-error** : Continue l'exécution même si l'étape échoue

### Exemple pratique : Workflow multi-actions

```yaml
name: Build et Test Application Node.js

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Récupérer le code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Installer les dépendances
        run: npm ci
      
      - name: Exécuter les linters
        run: npm run lint
      
      - name: Exécuter les tests
        run: npm run test:coverage
      
      - name: Télécharger le rapport de couverture
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/
          if-no-files-found: error
      
      - name: Construire l'application
        run: npm run build
```

---

## Exemple approfondi d'une action : Checkout

### Présentation de l'action Checkout

L'action `actions/checkout` constitue l'une des actions les plus essentielles dans tout workflow GitHub Actions.[1] Elle effectue l'opération fondamentale de clonage du code du dépôt dans l'environnement du runner, permettant au workflow d'accéder et de manipuler le code source.

### Fonctionnement interne

Lorsque `checkout` s'exécute, elle effectue les opérations suivantes :

1. **Initialisation du dépôt Git** : Crée un dépôt Git local sur le runner
2. **Configuration du remote** : Configure l'URL du dépôt distant
3. **Récupération du code** : Télécharge les fichiers correspondant à la référence spécifiée
4. **Configuration de HEAD** : Positionne HEAD sur le commit approprié

### Paramètres de l'action Checkout

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| repository | string | `${{ github.repository }}` | Dépôt à cloner au format `propriétaire/nom` |
| ref | string | `${{ github.ref }}` | Branche, tag ou SHA du commit à vérifier |
| token | string | `${{ github.token }}` | Token pour cloner les dépôts privés |
| fetch-depth | number | `1` | Nombre de commits à récupérer (0 = tous) |
| clean | boolean | `true` | Nettoie les fichiers non suivis après le checkout |
| submodules | string | `false` | Gère les sous-modules Git (false, true, recursive) |
| lfs | boolean | `false` | Active Git LFS (Large File Storage) |
| persist-credentials | boolean | `true` | Configure les identifiants Git pour les commits ultérieurs |

### Cas d'usage pratiques

**Cas 1 : Checkout simple sur la branche actuelle**

```yaml
- name: Checkout du code
  uses: actions/checkout@v4
```

Ce scénario minimal clone le dépôt actuel sur la branche actuelle avec une profondeur de 1 commit.

**Cas 2 : Récupération de tout l'historique Git**

```yaml
- name: Checkout avec historique complet
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

Cette configuration permet d'accéder à l'intégralité de l'historique Git, nécessaire pour des outils comme SonarQube ou des analyses d'impact de changement.

**Cas 3 : Gestion des sous-modules**

```yaml
- name: Checkout avec sous-modules
  uses: actions/checkout@v4
  with:
    submodules: recursive
    token: ${{ secrets.GITHUB_TOKEN }}
```

Lors du travail avec des dépôts contenant des sous-modules Git, cette configuration les récupère récursivement.

**Cas 4 : Checkout d'une branche spécifique**

```yaml
- name: Checkout d'une branche particulière
  uses: actions/checkout@v4
  with:
    ref: refs/heads/release-v2.0
    fetch-depth: 0
```

Permet de vérifier un code provenant d'une branche différente que la branche actuelle.

### Workflow complet utilisant Checkout

```yaml
name: Analyse de dépôt multi-branche

on:
  push:
    branches: [ main, develop ]
  pull_request:
  workflow_dispatch:

jobs:
  analyze:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        branch: [ main, develop ]
    
    steps:
      - name: Checkout de la branche ${{ matrix.branch }}
        uses: actions/checkout@v4
        with:
          ref: ${{ matrix.branch }}
          fetch-depth: 0
          clean: true
      
      - name: Obtenir les informations du commit
        run: |
          echo "Branche: ${{ matrix.branch }}"
          echo "Dernier commit: $(git log -1 --oneline)"
          echo "Nombre de commits: $(git rev-list --count HEAD)"
          echo "Auteur du dernier commit: $(git log -1 --format='%an')"
      
      - name: Lister les fichiers modifiés
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
            echo "Fichiers modifiés dans la PR:"
            git diff --name-only origin/main
          fi
      
      - name: Configuration Git pour les commits ultérieurs
        uses: actions/checkout@v4
        with:
          ref: ${{ matrix.branch }}
          persist-credentials: true
```

### Enjeux de performance avec Checkout

La profondeur de récupération (`fetch-depth`) impacte significativement les performances :

- **fetch-depth: 1** (par défaut) : Très rapide, approprié pour les builds simples
- **fetch-depth: 0** : Plus lent, mais nécessaire pour les analyses complètes du dépôt

Pour les repositories volumineux, l'utilisation de `fetch-depth: 1` est recommandée sauf si l'historique complet s'avère nécessaire.

---

## Les variables et les secrets

### Système de variables dans GitHub Actions

GitHub Actions fournit plusieurs mécanismes pour gérer les données variables nécessaires aux workflows. Ces mécanismes se divisent en trois catégories principales : les variables d'environnement, les variables personnalisées et les secrets.

### Variables d'environnement par défaut

GitHub fournit automatiquement un ensemble de variables d'environnement dans chaque step :

| Variable | Description | Exemple |
|----------|-------------|---------|
| GITHUB_WORKSPACE | Chemin du répertoire de travail | `/home/runner/work/repo-name/repo-name` |
| GITHUB_ACTION | Identifiant unique de l'action | `__run` |
| GITHUB_ACTIONS | Indique que le code s'exécute dans GitHub Actions | `true` |
| GITHUB_ACTOR | Nom de la personne qui a déclenché le workflow | `username` |
| GITHUB_EVENT_NAME | Type d'événement qui a déclenché le workflow | `push`, `pull_request` |
| GITHUB_REF | Branche ou tag de référence | `refs/heads/main` |
| GITHUB_SHA | SHA du commit | `abc1234567890def` |
| RUNNER_OS | Système d'exploitation du runner | `Linux`, `Windows`, `macOS` |

### Définition de variables personnalisées

**Variables au niveau du workflow**

```yaml
name: Utilisation de variables

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: mon-app

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configurer Node.js ${{ env.NODE_VERSION }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Afficher les variables
        run: |
          echo "Registry: ${{ env.REGISTRY }}"
          echo "Image: ${{ env.IMAGE_NAME }}"
```

**Variables au niveau du job**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      BUILD_ENV: production
      LOG_LEVEL: debug
    
    steps:
      - name: Utiliser les variables du job
        run: |
          echo "Environnement: $BUILD_ENV"
          echo "Niveau de log: $LOG_LEVEL"
```

**Variables au niveau du step**

```yaml
steps:
  - name: Étape spécifique
    env:
      TEMP_VAR: valeur-temporaire
    run: |
      echo "Variable temporaire: $TEMP_VAR"
```

### Gestion des secrets

Les secrets constituent le mécanisme sécurisé pour stocker les informations sensibles comme les tokens d'authentification, les clés API et les identifiants.

**Création de secrets au niveau du dépôt**

Les secrets doivent être définis dans les paramètres du dépôt GitHub (Settings > Secrets and variables > Actions). Ils ne peuvent pas être créés directement dans le workflow.

**Utilisation des secrets dans les workflows**

```yaml
name: Déploiement sécurisé

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configuration d'authentification
        env:
          API_KEY: ${{ secrets.API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
        run: |
          # Les secrets sont masqués dans les logs
          echo "Configuration en cours..."
          # Le secret ne s'affichera pas : *** au lieu de la valeur
          echo "Database: $DATABASE_URL"
      
      - name: Authentification Docker
        env:
          REGISTRY_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
        run: |
          echo "$REGISTRY_PASSWORD" | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
```

**Masquage des secrets dans les logs**

GitHub Actions masque automatiquement les secrets affichés dans les logs. Toute valeur correspondant à un secret sera remplacée par `***`.

```yaml
- name: Démonstration du masquage
  env:
    SECRET_TOKEN: ${{ secrets.API_TOKEN }}
  run: |
    echo "Token: $SECRET_TOKEN"  # Affichera: Token: ***
```

### Secrets au niveau de l'organisation

Pour les workflows d'équipes importantes, les secrets peuvent être définis au niveau de l'organisation et réutilisés dans tous les dépôts.

```yaml
- name: Utiliser un secret d'organisation
  env:
    ORG_SECRET: ${{ secrets.ORG_SIGNING_KEY }}
  run: |
    echo "Utilisation du secret d'organisation"
```

### Workflow complet avec variables et secrets

```yaml
name: Pipeline CI/CD complet

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  VERSION: v1.0.0

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    env:
      BUILD_TYPE: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configurer les variables de build
        run: |
          echo "BUILD_TYPE=${{ env.BUILD_TYPE }}" >> $GITHUB_ENV
          echo "IMAGE_TAG=${{ env.REGISTRY }}/app:${{ env.VERSION }}-${{ github.run_number }}" >> $GITHUB_ENV
      
      - name: Construire l'image Docker
        env:
          IMAGE_NAME: ${{ env.IMAGE_TAG }}
        run: |
          docker build -t $IMAGE_NAME .
          echo "Image construite: $IMAGE_NAME"
      
      - name: Pousser vers le registre
        env:
          REGISTRY_TOKEN: ${{ secrets.REGISTRY_TOKEN }}
        run: |
          echo "$REGISTRY_TOKEN" | docker login -u ${{ secrets.REGISTRY_USER }} --password-stdin ${{ env.REGISTRY }}
          docker push ${{ env.IMAGE_TAG }}
```

---

## Les contextes

### Compréhension des contextes dans GitHub Actions

Un **contexte** est un objet contenant des informations sur le workflow, l'événement déclencheur, le runner et les actions en cours d'exécution.[4] Les contextes permettent d'accéder à ces informations dynamiques et de les utiliser dans les expressions du workflow.

### Contextes principaux disponibles

**Contexte github**

Le contexte `github` contient des informations sur le workflow, le dépôt et l'événement déclencheur.

```yaml
${{ github.workflow }}        # Nom du workflow
${{ github.run_id }}          # ID unique de l'exécution
${{ github.run_number }}      # Numéro séquentiel de l'exécution
${{ github.job }}             # ID du job actuel
${{ github.action }}          # ID unique de l'action
${{ github.actor }}           # Nom de l'utilisateur qui a déclenché le workflow
${{ github.repository }}      # Propriétaire/nom du dépôt
${{ github.repository_owner }} # Propriétaire du dépôt
${{ github.ref }}             # Branche ou tag de référence complète
${{ github.ref_name }}        # Nom de la branche ou du tag sans le préfixe
${{ github.sha }}             # SHA du commit
${{ github.head_ref }}        # Branche head (pour les pull requests)
${{ github.base_ref }}        # Branche base (pour les pull requests)
${{ github.event_name }}      # Type d'événement déclencheur
${{ github.workspace }}       # Chemin du répertoire de travail
${{ github.server_url }}      # URL du serveur GitHub
${{ github.api_url }}         # URL de l'API GitHub
```

**Contexte env**

Le contexte `env` contient les variables d'environnement définies au niveau du workflow, du job ou du step.

```yaml
${{ env.NODE_VERSION }}       # Accès aux variables définies avec env:
${{ env.CUSTOM_VAR }}         # Accès aux variables personnalisées
```

**Contexte secrets**

Le contexte `secrets` fournit l'accès à tous les secrets définis pour le dépôt, l'organisation ou la branche.

```yaml
${{ secrets.API_TOKEN }}      # Accès sécurisé aux secrets
${{ secrets.DEPLOY_KEY }}     # Clés de déploiement
```

**Contexte runner**

Le contexte `runner` contient des informations sur le runner exécutant le job.

```yaml
${{ runner.os }}              # Système d'exploitation (Linux, Windows, macOS)
${{ runner.arch }}            # Architecture du processeur (x86, ARM, etc.)
${{ runner.name }}            # Nom du runner
${{ runner.tool_cache }}      # Chemin vers le cache des outils
${{ runner.temp }}            # Répertoire temporaire
${{ runner.workspace }}       # Espace de travail du runner
```

**Contexte strategy**

Le contexte `strategy` contient les informations sur la stratégie d'exécution (notamment pour les matrices).

```yaml
${{ strategy.job-index }}     # Index du job dans la matrice
${{ strategy.job-total }}     # Nombre total de jobs dans la matrice
${{ strategy.max-parallel }}  # Nombre maximum de jobs parallèles
```

### Exemple pratique : Utilisation complète des contextes

```yaml
name: Démonstration des contextes

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  context-demo:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ ubuntu-latest, windows-latest ]
        node-version: [ 16, 18, 20 ]
      max-parallel: 2
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Afficher les informations du contexte github
        run: |
          echo "=== CONTEXTE GITHUB ==="
          echo "Workflow: ${{ github.workflow }}"
          echo "Run ID: ${{ github.run_id }}"
          echo "Run Number: ${{ github.run_number }}"
          echo "Job: ${{ github.job }}"
          echo "Actor: ${{ github.actor }}"
          echo "Dépôt: ${{ github.repository }}"
          echo "Branche/Tag: ${{ github.ref }}"
          echo "Ref name: ${{ github.ref_name }}"
          echo "SHA: ${{ github.sha }}"
          echo "Event: ${{ github.event_name }}"
      
      - name: Afficher les informations du contexte runner
        run: |
          echo "=== CONTEXTE RUNNER ==="
          echo "OS: ${{ runner.os }}"
          echo "Architecture: ${{ runner.arch }}"
          echo "Workspace: ${{ runner.workspace }}"
          echo "Temp directory: ${{ runner.temp }}"
      
      - name: Afficher les informations de la stratégie
        run: |
          echo "=== CONTEXTE STRATÉGIE ==="
          echo "Job Index: ${{ strategy.job-index }}"
          echo "Job Total: ${{ strategy.job-total }}"
          echo "Max Parallel: ${{ strategy.max-parallel }}"
          echo "OS actuel: ${{ matrix.os }}"
          echo "Node version: ${{ matrix.node-version }}"
      
      - name: Déterminer le type de déploiement
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "DEPLOY_ENV=production" >> $GITHUB_ENV
          elif [ "${{ github.ref }}" == "refs/heads/develop" ]; then
            echo "DEPLOY_ENV=staging" >> $GITHUB_ENV
          else
            echo "DEPLOY_ENV=development" >> $GITHUB_ENV
          fi
      
      - name: Afficher l'environnement déterminé
        run: |
          echo "Environnement de déploiement: ${{ env.DEPLOY_ENV }}"
```

### Accès aux données de l'événement

Le contexte `github.event` contient les données complètes de l'événement qui a déclenché le workflow :

```yaml
- name: Informations de pull request
  if: github.event_name == 'pull_request'
  run: |
    echo "PR Number: ${{ github.event.pull_request.number }}"
    echo "PR Title: ${{ github.event.pull_request.title }}"
    echo "PR Author: ${{ github.event.pull_request.user.login }}"
    echo "PR Base: ${{ github.event.pull_request.base.ref }}"
    echo "PR Head: ${{ github.event.pull_request.head.ref }}"
    echo "PR Additions: ${{ github.event.pull_request.additions }}"
    echo "PR Deletions: ${{ github.event.pull_request.deletions }}"

- name: Informations de push
  if: github.event_name == 'push'
  run: |
    echo "Commits: ${{ github.event.head_commit.message }}"
    echo "Author: ${{ github.event.head_commit.author.name }}"
```

---

## Les expressions et la propriété if

### Concepts des expressions

Une **expression** dans GitHub Actions permet d'évaluer des conditions et de produire des valeurs dynamiques au sein des workflows.[1] Les expressions combinent des variables, des contextes, des opérateurs et des fonctions pour créer une logique conditionnelle sophistiquée.

### Syntaxe des expressions

Les expressions doivent être encapsulées dans la syntaxe `${{ }}` :

```yaml
# Expression simple
name: Build
run: echo "Repository: ${{ github.repository }}"

# Expression avec condition
if: ${{ github.event_name == 'push' }}

# Expression avec fonction
env:
  VERSION: ${{ format('v{0}.{1}', 1, 0) }}
```

### Opérateurs disponibles

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| == | Égalité | `${{ github.event_name == 'push' }}` |
| != | Inégalité | `${{ github.ref != 'refs/heads/main' }}` |
| < | Inférieur à | `${{ github.run_number < 100 }}` |
| <= | Inférieur ou égal | `${{ github.run_number <= 100 }}` |
| > | Supérieur à | `${{ github.run_number > 100 }}` |
| >= | Supérieur ou égal | `${{ github.run_number >= 100 }}` |
| && | ET logique | `${{ condition1 && condition2 }}` |
| \|\| | OU logique | `${{ condition1 \|\| condition2 }}` |
| ! | NON logique | `${{ !condition }}` |

### Fonctions disponibles dans les expressions

GitHub Actions fournit un ensemble de fonctions prédéfinies pour manipuler les données au sein des expressions :

**Fonction contains()**

Vérifie si une chaîne en contient une autre :

```yaml
if: ${{ contains(github.event.head_commit.message, 'hotfix') }}
  # Déclenche si le message de commit contient "hotfix"

if: ${{ contains(github.repository, 'test') }}
  # Déclenche si le nom du dépôt contient "test"
```

**Fonction startsWith()**

Vérifie le début d'une chaîne :

```yaml
if: ${{ startsWith(github.ref_name, 'release-') }}
  # Déclenche pour les branches commençant par "release-"

if: ${{ startsWith(github.event.head_commit.message, '[SKIP]') }}
  # Ignore le build si le commit commence par [SKIP]
```

**Fonction endsWith()**

Vérifie la fin d'une chaîne :

```yaml
if: ${{ endsWith(github.repository, '-api') }}
  # Déclenche pour les dépôts terminant par "-api"
```

**Fonction format()**

Formate les chaînes avec des paramètres :

```yaml
env:
  BUILD_TAG: ${{ format('v{0}.{1}.{2}', github.run_number, 0, 0) }}
  
run: echo "Version: ${{ format('{0}-{1}', github.ref_name, github.sha) }}"
```

**Fonction join()**

Joint les éléments d'un tableau :

```yaml
env:
  PATHS: ${{ join(array('src/', 'build/', 'dist/'), ',') }}
```

**Fonction hashFiles()**

Crée un hash pour une ou plusieurs fichiers :

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: npm-${{ hashFiles('**/package-lock.json') }}
    # Le cache est invalide si package-lock.json change
```

### La propriété if pour les conditions

La propriété `if` permet de contrôler l'exécution conditionnelle des jobs et des steps.

**Conditions au niveau du step**

```yaml
steps:
  - uses: actions/checkout@v4
  
  - name: Étape conditionnelle
    if: ${{ github.event_name == 'push' }}
    run: echo "Ceci s'exécute uniquement sur les push"
  
  - name: Étape sur pull request
    if: ${{ github.event_name == 'pull_request' }}
    run: echo "Ceci s'exécute uniquement sur les PR"
  
  - name: Étape sur branche main
    if: ${{ github.ref == 'refs/heads/main' }}
    run: echo "Ceci s'exécute uniquement sur main"
  
  - name: Étape si le commit contient [deploy]
    if: ${{ contains(github.event.head_commit.message, '[deploy]') }}
    run: echo "Déploiement déclenché"
```

**Conditions au niveau du job**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    if: ${{ github.event_name != 'pull_request' }}
    steps:
      - uses: actions/checkout@v4
  
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: ${{ github.ref == 'refs/heads/main' && github.event_name == 'push' }}
    steps:
      - name: Déployer
        run: echo "Déploiement en production"
```

### Workflow complet avec expressions et conditions

```yaml
name: CI/CD avec logique conditionnelle

on:
  push:
    branches: [ main, develop, release/* ]
  pull_request:
    branches: [ main, develop ]

jobs:
  analyze:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Déterminer le contexte d'exécution
        run: |
          if [[ "${{ github.event_name }}" == "push" ]]; then
            echo "MODE=production" >> $GITHUB_ENV
            echo "SHOULD_DEPLOY=true" >> $GITHUB_ENV
          elif [[ "${{ github.event_name }}" == "pull_request" ]]; then
            echo "MODE=testing" >> $GITHUB_ENV
            echo "SHOULD_DEPLOY=false" >> $GITHUB_ENV
          fi
      
      - name: Afficher le mode d'exécution
        run: echo "Mode actuel: ${{ env.MODE }}"
  
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ ubuntu-latest ]
        node-version: [ 18 ]
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      
      - name: Installer les dépendances
        run: npm ci
      
      - name: Exécuter les tests
        run: npm test
      
      - name: Construire le projet
        run: npm run build
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: ${{ 
      github.event_name == 'push' && 
      (github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/heads/release/'))
    }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Déterminer l'environnement de déploiement
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "DEPLOY_ENV=production" >> $GITHUB_ENV
          elif [[ "${{ github.ref }}" =~ ^refs/heads/release/ ]]; then
            echo "DEPLOY_ENV=staging" >> $GITHUB_ENV
          fi
      
      - name: Afficher l'environnement
        run: echo "Déploiement vers: ${{ env.DEPLOY_ENV }}"
      
      - name: Déployer
        if: ${{ !cancelled() }}
        run: |
          echo "Déploiement en cours..."
          echo "Branch: ${{ github.ref_name }}"
          echo "Commit: ${{ github.sha }}"
```

---

## Needs, outputs et les contextes steps et needs

### Le système de dépendances entre jobs avec needs

La propriété `needs` établit les dépendances explicites entre jobs et permet la transmission de données entre eux.

**Définition des dépendances**

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Job 1 exécuté"
  
  job2:
    needs: job1
    runs-on: ubuntu-latest
    steps:
      - run: echo "Job 2 s'exécute après job1"
  
  job3:
    needs: [ job1, job2 ]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Job 3 s'exécute après job1 et job2"
```

### Sortie des jobs avec outputs

Les outputs permettent de passer des données d'un job à un autre.

**Définition des outputs au niveau du step**

```yaml
jobs:
  generate-data:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.number }}
      build-id: ${{ steps.build.outputs.id }}
    
    steps:
      - name: Générer la version
        id: version
        run: |
          echo "number=v1.0.0-build.${{ github.run_number }}" >> $GITHUB_OUTPUT
      
      - name: Générer l'ID de build
        id: build
        run: |
          echo "id=${{ github.run_id }}" >> $GITHUB_OUTPUT
```

**Consommation des outputs**

```yaml
jobs:
  generate-data:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.number }}
      commit-sha: ${{ steps.metadata.outputs.sha }}
    
    steps:
      - name: Générer la version
        id: version
        run: echo "number=v1.2.3" >> $GITHUB_OUTPUT
      
      - name: Capturer le SHA du commit
        id: metadata
        run: echo "sha=${{ github.sha }}" >> $GITHUB_OUTPUT
  
  deploy:
    needs: generate-data
    runs-on: ubuntu-latest
    
    steps:
      - name: Utiliser les données du job précédent
        run: |
          echo "Version: ${{ needs.generate-data.outputs.version }}"
          echo "Commit SHA: ${{ needs.generate-data.outputs.commit-sha }}"
      
      - name: Déployer avec la version
        run: |
          VERSION="${{ needs.generate-data.outputs.version }}"
          echo "Déploiement de la version: $VERSION"
```

### Le contexte steps

Le contexte `steps` fournit l'accès aux informations sur les steps exécutées au sein du job actuel.

```yaml
steps:
  - name: Première étape
    id: step1
    run: |
      echo "output1=valeur1" >> $GITHUB_OUTPUT
      echo "output2=valeur2" >> $GITHUB_OUTPUT
  
  - name: Deuxième étape
    run: |
      echo "Résultat du step 1: ${{ steps.step1.outputs.output1 }}"
      echo "Résultat du step 1: ${{ steps.step1.outputs.output2 }}"
  
  - name: Vérifier le statut du step 1
    if: ${{ success() }}
    run: echo "Le step précédent a réussi"
```

### Le contexte needs

Le contexte `needs` contient les informations sur les jobs dont dépend le job actuel.

```yaml
jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      config: ${{ steps.config.outputs.data }}
    
    steps:
      - name: Préparer la configuration
        id: config
        run: echo "data={\"env\":\"prod\"}" >> $GITHUB_OUTPUT
  
  validate:
    needs: prepare
    runs-on: ubuntu-latest
    outputs:
      status: success
    
    steps:
      - name: Accéder aux outputs de prepare
        run: |
          echo "Configuration: ${{ needs.prepare.outputs.config }}"
  
  deploy:
    needs: [ prepare, validate ]
    runs-on: ubuntu-latest
    
    steps:
      - name: Vérifier tous les préalables
        run: |
          echo "Config: ${{ needs.prepare.outputs.config }}"
          echo "Status: ${{ needs.validate.outputs.status }}"
      
      - name: Déployer si tous les préalables sont OK
        if: ${{ needs.validate.outputs.status == 'success' }}
        run: echo "Déploiement autorisé"
```

### Workflow complet avec needs, outputs et contextes

```yaml
name: Pipeline multi-job avec dépendances

on:
  push:
    branches: [ main ]

jobs:
  setup:
    name: Configuration initiale
    runs-on: ubuntu-latest
    outputs:
      build-version: ${{ steps.version.outputs.number }}
      docker-registry: ${{ steps.registry.outputs.url }}
      deploy-env: ${{ steps.env.outputs.name }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Générer la version
        id: version
        run: |
          VERSION="v${{ github.run_number }}-${{ github.sha }}"
          echo "number=$VERSION" >> $GITHUB_OUTPUT
          echo "Version générée: $VERSION"
      
      - name: Déterminer le registre Docker
        id: registry
        run: |
          echo "url=ghcr.io/${{ github.repository_owner }}" >> $GITHUB_OUTPUT
      
      - name: Déterminer l'environnement
        id: env
        run: echo "name=production" >> $GITHUB_OUTPUT
  
  lint:
    name: Linter le code
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm
      
      - name: Installer les dépendances
        run: npm ci
      
      - name: Exécuter le linter
        run: npm run lint
  
  test:
    name: Exécuter les tests
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm
      
      - name: Installer les dépendances
        run: npm ci
      
      - name: Exécuter les tests
        run: npm test
      
      - name: Générer le rapport de couverture
        id: coverage
        run: |
          COVERAGE=$(npm run coverage:report)
          echo "report=$COVERAGE" >> $GITHUB_OUTPUT
  
  build:
    name: Construire l'image Docker
    runs-on: ubuntu-latest
    needs: [ lint, test ]
    outputs:
      image-id: ${{ steps.build.outputs.digest }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Construire l'image Docker
        id: build
        run: |
          IMAGE_ID="sha256:${{ github.sha }}"
          echo "digest=$IMAGE_ID" >> $GITHUB_OUTPUT
          echo "Image construite: $IMAGE_ID"
  
  security-scan:
    name: Scanner de sécurité
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Scanner la sécurité
        run: |
          echo "Scanning image: ${{ needs.build.outputs.image-id }}"
          echo "Scan de sécurité complété"
  
  deploy:
    name: Déployer l'application
    runs-on: ubuntu-latest
    needs: [ setup, build, security-scan ]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Afficher les informations de déploiement
        run: |
          echo "=== INFORMATIONS DE DÉPLOIEMENT ==="
          echo "Version: ${{ needs.setup.outputs.build-version }}"
          echo "Registre: ${{ needs.setup.outputs.docker-registry }}"
          echo "Environnement: ${{ needs.setup.outputs.deploy-env }}"
          echo "Image ID: ${{ needs.build.outputs.image-id }}"
      
      - name: Préparer le déploiement
        env:
          REGISTRY: ${{ needs.setup.outputs.docker-registry }}
          VERSION: ${{ needs.setup.outputs.build-version }}
          IMAGE_ID: ${{ needs.build.outputs.image-id }}
        run: |
          echo "Déploiement vers: $REGISTRY"
          echo "Version: $VERSION"
          echo "Image: $IMAGE_ID"
      
      - name: Déployer en production
        run: |
          echo "Déploiement en cours..."
          echo "Acteur: ${{ github.actor }}"
          echo "Timestamp: ${{ github.event.head_commit.timestamp }}"
      
      - name: Vérifier le déploiement
        if: ${{ success() }}
        run: echo "✅ Déploiement complété avec succès"
  
  notify:
    name: Notifier du résultat
    runs-on: ubuntu-latest
    needs: [ setup, deploy ]
    if: ${{ always() }}
    
    steps:
      - name: Notifier le succès
        if: ${{ needs.deploy.result == 'success' }}
        run: |
          echo "✅ Pipeline complété avec succès"
          echo "Version déployée: ${{ needs.setup.outputs.build-version }}"
      
      - name: Notifier l'échec
        if: ${{ needs.deploy.result == 'failure' }}
        run: |
          echo "❌ Le pipeline a échoué"
          echo "Vérifier les logs pour plus de détails"
```

### Statuts et résultats des jobs

Les jobs fournissent des informations sur leur résultat d'exécution :

```yaml
deploy:
  needs: build
  if: ${{ needs.build.result == 'success' }}
  steps:
    - run: echo "Le job build a réussi"

cleanup:
  needs: [ build, test, deploy ]
  if: ${{ always() }}  # S'exécute indépendamment du résultat des autres jobs
  steps:
    - run: echo "Nettoyage des ressources"

notify-failure:
  needs: deploy
  if: ${{ failure() }}  # S'exécute si le job précédent a échoué
  steps:
    - run: echo "Notifier de l'échec du déploiement"
```

---

## Synthèse et progression pédagogique

### Chemin d'apprentissage recommandé

La progression à travers ces concepts fondamentaux suit une logique d'accumulation croissante :

**Phase 1 : Fondations (Actions et Checkout)**

L'apprentissage débute par la compréhension des actions comme briques réutilisables des workflows. La maîtrise de l'action `checkout` fournit les bases pratiques de l'interaction avec les dépôts Git. Cette phase établit la compréhension des patterns fondamentaux de réutilisabilité.

**Phase 2 : Gestion des données (Variables et Secrets)**

Après avoir compris les actions, l'apprentissage porte sur la gestion des données au sein des workflows. Les variables d'environnement et les secrets introduisent les concepts de sécurité et de flexibilité de configuration. Cette phase prépare à la manipulation dynamique des données.

**Phase 3 : Accès à l'information (Contextes)**

Les contextes permettent d'accéder à l'information dynamique générée pendant l'exécution. Cette phase transforme les connaissances abstraites en pratique concrète d'accès aux métadonnées du workflow.

**Phase 4 : Logique conditionnelle (Expressions et if)**

Les expressions et les conditions permettent de créer une logique conditionnelle sophistiquée. Cette phase transforme les workflows statiques en pipelines dynamiques capables de s'adapter à différents scénarios.

**Phase 5 : Orchestration avancée (Needs, Outputs, Contextes)**

La dernière phase couvre l'orchestration multi-job avec transmission de données et dépendances explicites. Cette maîtrise permet la création de pipelines complexes et modulaires.

### Interactions entre les concepts

Ces concepts ne fonctionnent pas isolément mais forment un écosystème cohérent :

- Les **actions** utilisent des **contextes** pour accéder aux informations dynamiques
- Les **variables** et **secrets** sont manipulés via des **expressions**
- Les **conditions** s'appliquent aux **jobs** et aux **steps** via la propriété **if**
- Les **outputs** combinent les **contextes steps** et **needs** pour la transmission de données
- Les **expressions** évaluent les conditions basées sur les **contextes** et les **variables**

Cette interconnexion crée une synergie qui permet de construire des pipelines CI/CD sophistiqués et adaptables à des cas d'usage complexes.
