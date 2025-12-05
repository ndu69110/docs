# Citations
- https://dev.to/cicube/understanding-working-directory-in-github-actions-234j
- https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/setting-a-default-shell-and-working-directory
- https://dev.to/jajera/understanding-github-actions-working-directory-550o
- https://github.com/orgs/community/discussions/38360
- https://github.com/orgs/community/discussions/40526
- https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- https://docs.github.com/actions/writing-workflows/choosing-what-your-workflow-does/adding-scripts-to-your-workflow
- https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands


# Tokens
- prompt_tokens: 272
- completion_tokens: 5307
- total_tokens: 5579
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.08, 'request_cost': 0.006, 'total_cost': 0.086}


# Content
# 🚀 GitHub Actions : Déclenchement, Événements et Commandes des Workflows

## 📋 Introduction

GitHub Actions permet d'automatiser les tâches de développement directement dans les référentiels. Pour maîtriser cette plateforme, il est essentiel de comprendre comment les workflows sont déclenchés, quels événements peuvent les activer, et comment configurer précisément l'exécution des commandes. Ce guide approfondit ces concepts fondamentaux.

---

## 🎯 Déclenchement des Workflows en Détail

### Comprendre le Mécanisme de Déclenchement

Le déclenchement d'un workflow représente le moment exact où GitHub Actions commence l'exécution d'un processus automatisé. Cela se fait par le biais d'événements spécifiques qui surviennent dans le référentiel ou dans l'environnement GitHub. Le système de déclenchement fonctionne selon une architecture événementielle où chaque action dans le référentiel génère un signal que GitHub Actions peut intercepter et utiliser pour déclencher des workflows préconfigurés.

### Niveaux de Déclenchement

Les workflows peuvent être déclenchés à plusieurs niveaux :

**Niveau du référentiel** : Les événements liés directement aux actions sur le code (push, pull request, création de release).

**Niveau des problèmes** : Les événements relatifs aux issues et discussions.

**Niveau des discussions** : Les interactions dans les discussions du projet.

**Niveau des planifications** : Les déclenches selon un calendrier prédéfini.

**Niveau manuel** : Les activations manuelles via l'interface ou l'API.

### Configuration du Déclenchement

La configuration du déclenchement s'effectue dans le fichier YAML du workflow à l'aide de la clé `on`. Cette clé accepte soit une chaîne de caractères pour un événement simple, soit un objet pour des configurations plus complexes.

```yaml
# Configuration simple
on: push

# Configuration avec filtrage
on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'src/**'
      - 'package.json'
```

---

## 📚 Liste Complète des Événements

### Événements de Push et de Branche

**push** : S'active lors d'un push vers le référentiel ou une branche. Permet de filtrer par branche, chemins de fichiers ou balises.

```yaml
on:
  push:
    branches:
      - main
      - 'release/**'
    tags:
      - 'v*'
    paths:
      - 'src/**'
      - '!src/tests/**'
```

**pull_request** : S'active lors de la création ou de la modification d'une pull request. Les filtres incluent les branches cibles et les chemins.

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches:
      - main
    paths:
      - 'src/**'
      - 'docs/**'
```

**branch_protection_rule** : S'active lors de modifications des règles de protection de branche.

### Événements de Publication et Releases

**release** : S'active lors de la création, publication ou modification d'une release.

```yaml
on:
  release:
    types: [published, created, edited]
```

**push (avec tags)** : Peut aussi être configuré pour réagir uniquement aux pushes de balises.

### Événements de Discussion et Gestion d'Enjeux

**issues** : S'active lors de la création, modification ou suppression d'une issue.

```yaml
on:
  issues:
    types: [opened, edited, closed, labeled]
```

**discussion** : S'active lors de modifications dans les discussions.

**issue_comment** : S'active lors de commentaires sur les issues.

```yaml
on:
  issue_comment:
    types: [created, edited, deleted]
```

### Événements de Programmation

**schedule** : S'active selon une planification cron. Peut avoir plusieurs planifications.

```yaml
on:
  schedule:
    - cron: '0 9 * * MON-FRI'  # 9h chaque jour ouvrable
    - cron: '0 0 * * 0'        # Minuit chaque dimanche
```

**workflow_dispatch** : Permet le déclenchement manuel depuis l'interface GitHub.

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      debug_enabled:
        description: 'Run in debug mode'
        required: false
        type: boolean
```

### Événements de Modification des Workflows

**workflow_run** : S'active lors de l'exécution d'un autre workflow. Utile pour les workflows dépendants.

```yaml
on:
  workflow_run:
    workflows: ['CI']
    types: [completed]
    branches:
      - main
```

### Événements de Forking et Fetch

**fork** : S'active lors de la création d'un fork du référentiel.

**pull_request_target** : Semblable à `pull_request` mais s'exécute dans le contexte de la branche de base avec accès aux secrets. À utiliser avec prudence pour les sécurité.

### Événements de Gestion des Références

**workflow_call** : Permet aux workflows d'être appelés par d'autres workflows (workflows réutilisables).

```yaml
on:
  workflow_call:
    inputs:
      version:
        required: true
        type: string
    secrets:
      NPM_TOKEN:
        required: true
```

### Tableau Récapitulatif des Événements Principaux

| Événement | Déclenchement | Cas d'Usage |
|-----------|---------------|-----------|
| push | Commit poussé vers le référentiel | Tests après chaque commit |
| pull_request | PR créée ou mise à jour | Vérifications avant fusion |
| schedule | Selon planification cron | Tâches périodiques, sauvegardes |
| workflow_dispatch | Activation manuelle | Déploiements contrôlés |
| release | Release publiée | Distribution de versions |
| issues | Issue créée/modifiée | Automatisation de triage |
| workflow_call | Appelé par un autre workflow | Réutilisation de workflows |

---

## ⚙️ Commandes de Workflow et Workflow Commands

### Comprendre les Workflow Commands

Les commandes de workflow constituent un système de communication entre les scripts en exécution et le runner GitHub Actions. Elles utilisent la syntaxe spéciale `::` pour transmettre des instructions à GitHub Actions via la sortie standard (stdout).

### Syntaxe Générale

```
::{command} {parameters}::{value}
```

### Définir des Variables d'Environnement

La commande `set-env` permet de créer ou de modifier des variables d'environnement qui seront disponibles dans les étapes suivantes.

```yaml
- name: Set environment variable
  run: echo "ACTION_REF=${{ github.ref }}" >> $GITHUB_ENV

- name: Use the variable
  run: echo "The ref is $ACTION_REF"
```

### Ajouter des Chemins au PATH

La commande `add-path` ajoute un répertoire au PATH du système, rendant ses exécutables accessibles directement.

```yaml
- name: Add custom bin to PATH
  run: echo "/opt/custom/bin" >> $GITHUB_PATH

- name: Use custom executable
  run: custom-command --help
```

### Définir des Sorties de Workflow

La commande `set-output` définit des sorties qui peuvent être utilisées par d'autres étapes ou jobs.

```yaml
- name: Generate version
  id: version
  run: echo "version=1.0.0" >> $GITHUB_OUTPUT

- name: Use output
  run: echo "Version is ${{ steps.version.outputs.version }}"
```

### Signaler des Erreurs et Avertissements

**error** : Marque une erreur d'exécution.

```yaml
- name: Check configuration
  run: |
    if [ ! -f "config.yml" ]; then
      echo "::error::Configuration file not found"
      exit 1
    fi
```

**warning** : Signale un avertissement sans arrêter l'exécution.

```yaml
- name: Validate dependencies
  run: |
    if [ ! -z "$DEPRECATED_VAR" ]; then
      echo "::warning::DEPRECATED_VAR is deprecated, use NEW_VAR instead"
    fi
```

**notice** : Affiche une notification informative.

```yaml
- name: Build info
  run: echo "::notice::Build started at $(date)"
```

### Grouper les Sorties

La commande `group` crée des sections repliables dans les logs pour améliorer la lisibilité.

```yaml
- name: Run tests
  run: |
    echo "::group::Unit Tests"
    npm run test:unit
    echo "::endgroup::"
    
    echo "::group::Integration Tests"
    npm run test:integration
    echo "::endgroup::"
```

### Masquer les Données Sensibles

La commande `add-mask` cache les valeurs sensibles dans les logs.

```yaml
- name: Get secret and add to mask
  run: |
    SECRET_VALUE=$(aws secretsmanager get-secret-value --secret-id my-secret --query SecretString --output text)
    echo "::add-mask::${SECRET_VALUE}"
    echo "SECRET=$SECRET_VALUE" >> $GITHUB_ENV
```

### Contrôler l'Exécution du Job

**stop-commands** et **resume-commands** : Désactivent ou réactivent le traitement des commandes de workflow.

```yaml
- name: Disable workflow commands
  run: |
    echo "::stop-commands::pause-token"
    echo "::error::This error will be ignored"
    echo "::resume-commands::pause-token"
    echo "::error::This error will be processed"
```

---

## 🔧 Configuration Détaillée : run, shell, working-directory et defaults

### Paramètre `run` : Exécution de Commandes

Le paramètre `run` spécifie la commande ou le script à exécuter dans une étape. Il représente le cœur de l'exécution des tâches automatisées.

**Commandes simples** :

```yaml
steps:
  - name: Run simple command
    run: echo "Hello, GitHub Actions!"
```

**Commandes multilignes** :

```yaml
steps:
  - name: Run multiple commands
    run: |
      npm install
      npm run build
      npm run test
```

**Commandes avec conditions** :

```yaml
steps:
  - name: Conditional execution
    run: |
      if [ "${{ github.event_name }}" == "push" ]; then
        echo "This is a push event"
        npm run build
      else
        echo "This is not a push event"
      fi
```

### Paramètre `shell` : Choix de l'Interpréteur

Le paramètre `shell` détermine quel interpréteur exécute la commande. Les options varient selon le système d'exploitation du runner.

**Sur Linux et macOS** :

- `bash` (par défaut)
- `sh`
- `pwsh` (PowerShell)

**Sur Windows** :

- `pwsh` (PowerShell Core)
- `cmd` (Command Prompt)
- `bash` (si Git Bash est disponible)

```yaml
steps:
  - name: Run with bash
    shell: bash
    run: echo "Using bash"

  - name: Run with PowerShell
    shell: pwsh
    run: Write-Host "Using PowerShell"

  - name: Run with cmd (Windows)
    shell: cmd
    run: echo Using Command Prompt
```

**Options de shell avancées** :

```yaml
steps:
  - name: Run with custom shell options
    shell: bash -e -o pipefail {0}
    run: |
      # Script with enhanced error handling
      set -u
      undefined_var  # Will cause error
```

### Paramètre `working-directory` : Répertoire d'Exécution

Le paramètre `working-directory` spécifie le répertoire dans lequel la commande s'exécute. Par défaut, les commandes s'exécutent à la racine du référentiel.[1]

#### Configuration au Niveau de l'Étape

```yaml
steps:
  - name: Run build in scripts directory
    run: npm run build
    working-directory: ./scripts
```

Ici, la commande `npm run build` s'exécute depuis le répertoire `./scripts` au lieu de la racine.[1]

#### Configuration au Niveau du Job

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        shell: bash
        working-directory: ./scripts
    steps:
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
```

Tous les `run` steps dans ce job s'exécutent dans `./scripts`.[1][2]

#### Configuration au Niveau du Workflow

```yaml
defaults:
  run:
    shell: bash
    working-directory: ./src

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Install dependencies
        run: npm install
      - name: Build project
        run: npm run build
```

Tous les jobs du workflow exécutent leurs tâches depuis `./src`.[1]

#### Surcharge de la Configuration au Niveau de l'Étape

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        shell: bash
        working-directory: ./scripts
    steps:
      - name: Install dependencies
        run: npm install
      
      - name: Run cleanup in different directory
        run: rm -rf *
        working-directory: ./temp
```

L'étape de nettoyage surcharge le répertoire défini au niveau du job et s'exécute dans `./temp`.[1]

### Paramètre `defaults` : Configurations Par Défaut

Le paramètre `defaults` établit des configurations par défaut applicables à plusieurs niveaux hiérarchiques du workflow.

#### Hiérarchie des Defaults

1. **Niveau workflow** : S'applique à tous les jobs
2. **Niveau job** : S'applique à toutes les étapes d'un job (surcharge le level workflow)
3. **Niveau étape** : S'applique uniquement à une étape (surcharge les niveaux précédents)

#### Exemple Complet de Hiérarchie

```yaml
name: Workflow with Multiple Defaults

defaults:
  run:
    shell: bash
    working-directory: ./root-dir

on: push

jobs:
  job1:
    runs-on: ubuntu-latest
    # Hérite du workflow level
    steps:
      - name: Step in job1
        run: pwd  # S'exécute dans ./root-dir

  job2:
    runs-on: ubuntu-latest
    defaults:
      run:
        shell: pwsh
        working-directory: ./job2-dir
    # Surcharge le workflow level
    steps:
      - name: Step in job2
        run: Get-Location  # S'exécute dans ./job2-dir avec PowerShell

      - name: Override at step level
        run: pwd
        working-directory: ./override-dir
        shell: bash  # S'exécute dans ./override-dir avec bash
```

#### Résolution de Priorité

Lorsque plusieurs defaults sont définis avec le même nom, GitHub utilise le paramètre le plus spécifique.[2]

| Niveau | Priorité | Portée |
|--------|----------|--------|
| Étape | 1 (Plus haute) | Étape unique |
| Job | 2 | Toutes les étapes du job |
| Workflow | 3 (Plus basse) | Tous les jobs |

#### Utilisation Pratique des Defaults

```yaml
name: Node.js Project Build

defaults:
  run:
    shell: bash
    working-directory: ./app

on:
  push:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install linter
        run: npm install eslint
      - name: Run linter
        run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test

  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./app/dist
    steps:
      - uses: actions/checkout@v4
      - name: Prepare build directory
        working-directory: ./app
        run: npm run build
      - name: Verify output
        run: ls -la
        # S'exécute dans ./app/dist pour vérifier les fichiers générés
```

### Tableau Comparatif des Niveaux de Configuration

| Aspect | Étape | Job | Workflow |
|--------|-------|-----|----------|
| **Syntaxe** | `run: cmd` / `shell: bash` | `defaults.run` | `defaults.run` |
| **Portée** | 1 étape unique | Toutes les étapes du job | Tous les jobs |
| **Priorité** | ⭐⭐⭐ Haute | ⭐⭐ Moyenne | ⭐ Basse |
| **Cas d'usage** | Exception, override | Cohérence intra-job | Cohérence globale |
| **Surcharge** | Oui, de tout | Oui, du workflow | Non |

---

## 🔄 Intégration Complète : Exemple Pratique

Voici un workflow complet intégrant tous les concepts :

```yaml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
    paths:
      - 'src/**'
      - 'package.json'
      - '.github/workflows/**'
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options: [staging, production]

defaults:
  run:
    shell: bash
    working-directory: ./application

env:
  NODE_VERSION: '18'

jobs:
  validate:
    name: Code Validation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
        continue-on-error: true
      
      - name: Log validation status
        run: |
          echo "::notice::Validation completed"
          echo "Timestamp: $(date)" >> $GITHUB_ENV

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: |
          echo "::group::Unit Tests Execution"
          npm run test:unit
          echo "::endgroup::"
      
      - name: Run integration tests
        run: |
          echo "::group::Integration Tests Execution"
          npm run test:integration
          echo "::endgroup::"
      
      - name: Generate coverage
        run: npm run test:coverage
        working-directory: ./coverage  # Override du default
        continue-on-error: true

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Build application
        run: npm run build
      
      - name: Verify build output
        run: |
          if [ ! -d "dist" ]; then
            echo "::error::Build failed - dist directory not found"
            exit 1
          fi
          echo "::notice::Build artifacts created successfully"

  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: [test, build]
    if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'
    steps:
      - uses: actions/checkout@v4
      
      - name: Determine target environment
        id: env
        run: |
          if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
            ENV="${{ github.event.inputs.environment }}"
          else
            ENV="staging"
          fi
          echo "target=$ENV" >> $GITHUB_OUTPUT
      
      - name: Deploy to ${{ steps.env.outputs.target }}
        run: |
          echo "Deploying to ${{ steps.env.outputs.target }}"
          npm run deploy -- --env=${{ steps.env.outputs.target }}
      
      - name: Verify deployment
        run: curl -f https://app-${{ steps.env.outputs.target }}.example.com/health || exit 1
```

---

## 📊 Synthèse et Progression d'Apprentissage

### Chemin d'Apprentissage Structuré

**Étape 1 : Fondamentaux des Déclencheurs** (30 minutes)
- Comprendre l'architecture événementielle
- Maîtriser les événements simples (push, pull_request)
- Expérimenter les configurations basiques

**Étape 2 : Événements Avancés** (1 heure)
- Explorer les filtres (branches, paths, tags)
- Utiliser les événements conditionnels
- Chaîner les workflows avec workflow_run

**Étape 3 : Commandes de Workflow** (45 minutes)
- Maîtriser les variables d'environnement
- Implémenter la gestion des erreurs
- Utiliser les sorties et les regroupements

**Étape 4 : Exécution Précise** (1 heure)
- Configurer les répertoires de travail
- Gérer les interpréteurs shell
- Établir les configurations par défaut

**Étape 5 : Intégration Complète** (1-2 heures)
- Construire des workflows multi-jobs
- Gérer les dépendances entre jobs
- Optimiser la réutilisabilité

### Points Clés à Retenir

L'architecture de GitHub Actions repose sur une hiérarchie claire : les événements déclenchent les workflows, qui contiennent des jobs, qui contiennent des étapes. Chaque niveau accepte des configurations que les niveaux inférieurs peuvent surcharger. Les commandes de workflow permettent une communication dynamique entre les scripts et le système, tandis que les configurations de répertoire et de shell offrent une flexibilité d'exécution.

La maîtrise progressive de ces concepts permet de passer de workflows simples à des pipelines sophistiqués de CI/CD, tout en maintenant la clarté et la maintenabilité du code d'automatisation.
