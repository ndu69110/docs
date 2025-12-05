# Citations
- https://kinsta.com/fr/blog/configurer-pipeline-ci-cd/
- https://blog.stephane-robert.info/docs/pipeline-cicd/github/
- https://www.youtube.com/watch?v=vJkaJ6k54AQ
- https://www.youtube.com/watch?v=2l-uj4Q-MQM
- https://docs.github.com/fr/actions/get-started/understand-github-actions
- https://les-enovateurs.com/github-actions-construire-tester-et-deployer-sans-effort-ci-cd
- https://labex.io/fr/courses/github-actions-for-beginners
- https://www.dyma.fr/formations/github-actions
- https://docs.github.com/fr/actions/get-started/quickstart


# Tokens
- prompt_tokens: 274
- completion_tokens: 6287
- total_tokens: 6561
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.094, 'request_cost': 0.006, 'total_cost': 0.101}


# Content
# Introduction au CI/CD avec GitHub Actions

## À l'abordage ! 🚀

GitHub Actions représente une plateforme révolutionnaire pour l'automatisation des pipelines logiciels. Cette technologie, intégrée directement à GitHub, permet aux développeurs de construire, tester et déployer leurs applications sans quitter leur environnement de travail habituel[5]. L'objectif de ce chapitre est de poser les fondations nécessaires pour comprendre comment GitHub Actions s'inscrit dans une stratégie d'intégration continue et de livraison continue (CI/CD).

La philosophie derrière GitHub Actions repose sur l'automatisation intelligente des processus répétitifs. Plutôt que de gérer manuellement les builds, les tests et les déploiements, les développeurs peuvent définir des workflows qui s'exécutent automatiquement en réponse à des événements spécifiques[1]. Cette automatisation libère du temps précieux et réduit considérablement les risques d'erreurs humaines dans le cycle de développement.

## Introduction au DevOps

### Comprendre l'origine du DevOps

Le DevOps émerge de la fusion de deux mondes traditionnellement séparés : le développement (Dev) et les opérations (Ops). Historiquement, ces deux disciplines opéraient en silos distincts, créant des frictions et des inefficacités dans la livraison de logiciels. Le DevOps brise cette barrière en prônant une collaboration étroite entre les développeurs, les administrateurs systèmes et les ingénieurs de déploiement.

### Les principes fondamentaux du DevOps

**Automation** : Le principe central du DevOps consiste à automatiser les tâches répétitives. Cela inclut non seulement le code, mais aussi l'infrastructure, les tests et le déploiement. GitHub Actions s'inscrit directement dans cette philosophie en offrant un mécanisme d'automatisation puissant.

**Collaboration** : Les barrières traditionnelles entre les équipes doivent s'estomper. Les développeurs comprennent les enjeux opérationnels, tandis que les administrateurs systèmes comprennent les contraintes du développement.

**Monitoring et feedback** : L'observation continue des applications en production permet d'identifier rapidement les problèmes et d'ajuster les stratégies de développement et de déploiement.

**Infrastructure as Code** : L'infrastructure est définie et gérée comme du code source, permettant une reproductibilité et une versioning complète.

### L'impact sur le cycle de développement

Dans un environnement DevOps, le cycle de développement s'accélère drastiquement. Les déploiements, autrefois des événements rares et stressants, deviennent des opérations quotidiennes et automatisées. Cette transformation permet aux organisations de réagir plus rapidement aux besoins du marché et de corriger les bugs bien plus rapidement.

## Qu'est-ce que l'intégration et la livraison continues ?

### Intégration Continue (CI)

L'**intégration continue** est une pratique de développement où les développeurs intègrent leur code dans un dépôt central plusieurs fois par jour[1]. Chaque intégration est vérifiée automatiquement par un build automatisé et des tests automatisés, permettant d'identifier les problèmes d'intégration le plus tôt possible.

#### Objectifs de l'intégration continue

- **Détecter les bugs rapidement** : Plutôt que d'attendre plusieurs mois avant une release majeure, les problèmes sont identifiés en heures ou en minutes.
- **Réduire les efforts de déploiement** : Avec une intégration continue, le code est toujours dans un état potentiellement déployable.
- **Améliorer la confiance** : L'automatisation complète des tests crée une base solide de confiance dans la qualité du code.

#### Workflow typique d'intégration continue

```
┌─────────────────────────────────────────────────────┐
│          Développeur pousse du code                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │  Build automatique         │
         │  (compilation, packaging)  │
         └────────────┬────────────────┘
                      │
                      ▼
         ┌───────────────────────────┐
         │  Tests automatisés         │
         │  (unitaires, intégration)  │
         └────────────┬────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    ✅ Succès              ❌ Échec
         │                         │
         ▼                         ▼
    Code intégré      Notification d'erreur
                      Arrêt du processus
```

### Livraison Continue (CD)

La **livraison continue** étend l'intégration continue en automatisant le déploiement du code dans les environnements de staging ou de production[1]. Une distinction importante : la livraison continue ne signifie pas qu'un déploiement en production se fait automatiquement à chaque commit. Elle signifie que le code est **prêt** pour la production et peut être déployé à tout moment avec un simple clic.

#### Déploiement continu vs Livraison continue

| Aspect | Livraison Continue | Déploiement Continu |
|--------|-------------------|-------------------|
| **Automatisation** | Tests et staging automatisés | Tout est automatisé, y compris la production |
| **Déploiement en production** | Manuel (décision humaine) | Automatique (si les tests passent) |
| **Fréquence des releases** | Régulière (quelques fois par semaine) | Très fréquente (plusieurs fois par jour) |
| **Risque** | Modéré (contrôle humain sur la production) | Plus élevé (moins de contrôle humain) |
| **Cas d'usage** | Idéal pour la plupart des applications | Convient aux startups et services SaaS |

#### Bénéfices de la livraison continue

- **Feedback utilisateur rapide** : Les nouvelles fonctionnalités atteignent les utilisateurs rapidement.
- **Réduction du time-to-market** : Les organisations peuvent rivaliser plus efficacement sur le marché.
- **Meilleure qualité** : Les tests continus garantissent une qualité constante du code.
- **Réduction des risques** : Les déploiements plus fréquents et plus petits réduisent le risque d'erreurs catastrophiques.

### Comment GitHub Actions supporte CI/CD

GitHub Actions fournit les outils nécessaires pour implémenter à la fois l'intégration continue et la livraison continue. En utilisant des **workflows** (ensembles d'actions automatisées), les développeurs définissent exactement ce qui doit se passer à chaque étape du processus[2].

#### Exemple concret : Pipeline CI/CD simple

```yaml
name: Build, Test, and Deploy

on:
  push:
    branches: "main"
  pull_request:
    branches: "main"

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout du code
        uses: actions/checkout@v4
      
      - name: Installation des dépendances
        run: npm install
      
      - name: Exécution des tests
        run: npm test
      
      - name: Build de l'application
        run: npm run build
      
      - name: Déploiement en staging
        if: github.ref == 'refs/heads/main'
        run: npm run deploy:staging
```

Ce workflow s'active automatiquement à chaque push ou pull request sur la branche `main`, exécute les tests, et déploie automatiquement en staging si tous les tests passent.

## Le langage YAML

### Introduction à YAML

**YAML** (YAML Ain't Markup Language) est un format de sérialisation de données conçu pour être lisible par les humains[2]. Contrairement à JSON ou XML, YAML minimise l'utilisation de symboles et privilégie l'indentation pour représenter la structure hiérarchique des données. Dans GitHub Actions, tous les workflows sont définis en YAML.

### Syntaxe fondamentale de YAML

#### Scalaires

Les scalaires sont les éléments de base : strings, nombres, booléens, et null.

```yaml
# Chaîne de caractères
nom: GitHub Actions

# Nombre
version: 1
prix: 9.99

# Booléen
actif: true
archived: false

# Null
valeur_vide: null
# ou encore
autre_null: ~
```

#### Listes

Les listes en YAML utilisent le tiret (`-`) pour dénoter chaque élément.

```yaml
# Liste simple
fruits:
  - pomme
  - banane
  - orange

# Liste de nombres
nombres: [1, 2, 3, 4, 5]

# Liste imbriquée
utilisateurs:
  - nom: Alice
    age: 30
  - nom: Bob
    age: 25
```

#### Dictionnaires/Maps

Les dictionnaires structurent les données en paires clé-valeur.

```yaml
# Dictionnaire simple
personne:
  nom: Jean
  age: 35
  email: jean@example.com

# Dictionnaire imbriqué
entreprise:
  nom: TechCorp
  localisation:
    ville: Paris
    pays: France
  employes: 500
```

#### Chaînes multilignes

Quand il s'agit de texte plus long, YAML offre plusieurs options.

```yaml
# Bloc littéral (préserve les retours à la ligne)
description: |
  Ceci est une description
  sur plusieurs lignes
  avec préservation des sauts

# Bloc plié (remplace les sauts de ligne par des espaces)
resume: >
  Ceci est un résumé
  qui sera sur une seule ligne
  à cause du plié

# Entre guillemets (avec échappement)
commande: "echo \"Bonjour\" && echo \"Monde\""
```

### Structure d'un workflow GitHub Actions en YAML

#### Niveau 1 : Métadonnées du workflow

```yaml
name: Mon Premier Workflow
description: Description du workflow
```

#### Niveau 2 : Événements déclencheurs

```yaml
on:
  push:
    branches: ["main", "develop"]
    paths:
      - "src/**"
      - "tests/**"
  pull_request:
    branches: ["main"]
  schedule:
    - cron: "0 9 * * MON"  # Chaque lundi à 9h
```

#### Niveau 3 : Variables d'environnement

```yaml
env:
  NODE_VERSION: "18"
  DATABASE_URL: "postgresql://localhost/mydb"
```

#### Niveau 4 : Jobs et steps

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Run tests
        run: npm test
```

### Exemple complet d'un workflow YAML pour un projet Node.js

```yaml
name: Node.js CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18.x'
  NPM_REGISTRY: 'https://registry.npmjs.org'

jobs:
  lint-and-test:
    name: Lint & Test
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        if: matrix.node-version == '18.x'
        with:
          files: ./coverage/coverage-final.json

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: lint-and-test
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Archive build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 5

  deploy:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
      
      - name: Deploy to staging server
        run: |
          echo "Déploiement en cours..."
          # Commandes de déploiement réelles ici
```

### Concepts YAML critiques pour GitHub Actions

#### Variables et interpolation

```yaml
env:
  APP_NAME: myapp
  VERSION: 1.0.0

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Print version
        run: echo "Déploiement de ${{ env.APP_NAME }} v${{ env.VERSION }}"
```

#### Conditions

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy only on main branch
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh
      
      - name: Run on pull request
        if: github.event_name == 'pull_request'
        run: npm test
```

#### Matrice de build

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.8, 3.9, '3.10', 3.11]
        os: [ubuntu-latest, macos-latest, windows-latest]
    
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - name: Run tests
        run: pytest
```

## Mise en place de l'environnement

### Prérequis techniques

Avant de commencer avec GitHub Actions, il est nécessaire de disposer de certains outils et accès :

**Compte GitHub** : Un compte GitHub actif avec la permission de créer et modifier des workflows. Les workflows publics sont gratuits pour tous les utilisateurs, tandis que les workflows privés bénéficient d'une allocation gratuite mensuelle généreuse.

**Git installé localement** : Pour cloner et gérer vos dépôts GitHub localement. Vous pouvez télécharger Git depuis [git-scm.com](https://git-scm.com/).

**Un éditeur de code** : VS Code, JetBrains IDEs, Sublime Text, ou tout autre éditeur supportant YAML est recommandé pour éditer les fichiers de workflow.

**Connaissances en ligne de commande** : Une familiarité basique avec le terminal ou PowerShell pour exécuter des commandes Git et tester les workflows localement.

### Créer un dépôt GitHub

La première étape concrète consiste à créer un dépôt GitHub ou d'utiliser un dépôt existant. GitHub Actions s'intègre directement aux dépôts GitHub[1].

#### Étapes pour créer un dépôt

1. Se connecter à [github.com](https://github.com)
2. Cliquer sur l'icône `+` en haut à droite
3. Sélectionner "New repository"
4. Remplir les informations :
   - **Repository name** : Nom descriptif (exemple : `ci-cd-demo`)
   - **Description** : Description brève du projet
   - **Public/Private** : Choisir selon les besoins
   - **Initialize with** : Sélectionner "Add a README file"
5. Cliquer sur "Create repository"

### Structure du dépôt pour GitHub Actions

GitHub Actions cherche automatiquement les fichiers de workflow dans le répertoire `.github/workflows/` à la racine du dépôt. La structure recommandée est :

```
mon-projet/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── tests.yml
├── src/
│   ├── app.js
│   └── utils.js
├── tests/
│   ├── app.test.js
│   └── utils.test.js
├── package.json
├── README.md
└── .gitignore
```

### Créer le premier workflow

La création du premier workflow se fait en créant un fichier YAML dans `.github/workflows/`.

#### Méthode 1 : Via l'interface GitHub

1. Naviguer vers le dépôt
2. Cliquer sur "Actions" en haut
3. Cliquer sur "New workflow"
4. Sélectionner un template ou "set up a workflow yourself"
5. Éditer le fichier YAML
6. Cliquer sur "Start commit"

#### Méthode 2 : Localement via Git

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/mon-projet.git
cd mon-projet

# Créer la structure des répertoires
mkdir -p .github/workflows

# Créer le fichier de workflow
cat > .github/workflows/hello.yml << 'EOF'
name: Hello World

on:
  push:
    branches: [main]

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: echo "Bonjour GitHub Actions!"
EOF

# Commit et push
git add .github/workflows/hello.yml
git commit -m "Add hello world workflow"
git push origin main
```

### Premier workflow : Hello World

Le workflow le plus simple permet de vérifier que GitHub Actions fonctionne correctement dans votre environnement.

```yaml
name: Hello World

on:
  push:
    branches: [main]

jobs:
  hello:
    name: Say Hello
    runs-on: ubuntu-latest
    
    steps:
      - name: Print greeting
        run: echo "🚀 Bonjour depuis GitHub Actions!"
      
      - name: Print environment info
        run: |
          echo "Système d'exploitation: $RUNNER_OS"
          echo "Runner: $RUNNER_NAME"
          echo "Branch: $GITHUB_REF_NAME"
      
      - name: Print timestamp
        run: date
```

Ce workflow s'exécute automatiquement à chaque push sur la branche `main` et effectue trois actions simples : un salut, l'affichage d'informations systèmes, et l'affichage de la date/heure.

### Accéder aux logs du workflow

Pour vérifier l'exécution de votre workflow :

1. Naviguer vers le dépôt GitHub
2. Cliquer sur l'onglet "Actions"
3. Sélectionner le workflow dans la liste
4. Cliquer sur l'exécution spécifique
5. Consulter les logs détaillés pour chaque étape

### Concepts clés d'un workflow

#### Events (Événements)

Un **événement** est ce qui déclenche l'exécution d'un workflow[2]. Les événements principaux incluent :

- **push** : Activation lors d'un push de commits
- **pull_request** : Activation lors de la création ou modification d'une PR
- **schedule** : Activation selon un calendrier (cron)
- **workflow_dispatch** : Activation manuelle depuis l'interface
- **release** : Activation lors de la création d'une release

#### Jobs (Tâches)

Un **job** est une unité d'exécution indépendante au sein d'un workflow. Plusieurs jobs peuvent s'exécuter en parallèle ou séquentiellement (avec `needs`)[2].

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Job 1"
  
  job2:
    runs-on: ubuntu-latest
    needs: job1  # S'exécute seulement après job1
    steps:
      - run: echo "Job 2"
```

#### Runners (Exécuteurs)

Un **runner** est la machine qui exécute les jobs[2]. GitHub fournit des runners gratuits (ubuntu-latest, windows-latest, macos-latest) ou vous pouvez utiliser vos propres runners auto-hébergés.

```yaml
jobs:
  multi-platform:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - run: echo "Running on ${{ runner.os }}"
```

#### Actions (Actions)

Une **action** est une composante réutilisable qui effectue une tâche spécifique[5]. Les actions peuvent être officielles (fournies par GitHub), communautaires, ou créées par l'utilisateur.

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4
  
  - name: Setup Node.js
    uses: actions/setup-node@v3
    with:
      node-version: 18
```

### Variables d'environnement et secrets

#### Variables d'environnement

Les variables d'environnement sont accessibles à tous les jobs et steps du workflow.

```yaml
env:
  LOG_LEVEL: debug
  API_ENDPOINT: https://api.example.com

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: |
          echo "Log level: $LOG_LEVEL"
          echo "API: $API_ENDPOINT"
```

#### Secrets

Pour les informations sensibles (tokens, passwords), GitHub fournit un mécanisme de secrets[1].

**Ajouter un secret dans GitHub :**
1. Naviguer vers Settings → Secrets and variables → Actions
2. Cliquer sur "New repository secret"
3. Entrer le nom du secret (exemple : `DEPLOY_TOKEN`)
4. Entrer la valeur
5. Cliquer sur "Add secret"

**Utiliser un secret dans un workflow :**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy with token
        run: |
          curl -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}" \
            https://api.example.com/deploy
```

### Dépannage et logs

#### Vérifier les logs du workflow

GitHub fournit des logs détaillés pour chaque exécution de workflow, incluant :

- **Durée d'exécution** : Combien de temps chaque step a pris
- **Statuts** : Succès ou échec de chaque step
- **Sortie** : Les résultats imprimés par `echo` ou `run`

#### Exemple de logs typiques

```
Run: npm test
> npm test

> my-app@1.0.0 test
> jest

 PASS  src/app.test.js
  ✓ should render without crashing (45ms)
  ✓ should handle input correctly (32ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.234 s
```

#### Activer le debug

Pour plus de détails, il est possible d'activer le mode debug en ajoutant des secrets :

- `ACTIONS_STEP_DEBUG` : Pour les logs détaillés des steps
- `ACTIONS_RUNNER_DEBUG` : Pour les logs du runner

### Gestion des versions des actions

Les actions GitHub utilisent un système de versioning. Les versions courantes :

- **v1** : Version majeure (stable et recommandée)
- **v1.1** : Version mineure (corrections de bugs)
- **v1.1.0** : Version patch (très précis)
- **@main** : Dernière version (non recommandé en production)

```yaml
steps:
  # Recommandé : version majeure spécifique
  - uses: actions/checkout@v4
  
  # Alternative : version mineure
  - uses: actions/setup-node@v3.8
  
  # À éviter : version en développement
  - uses: actions/deploy@main
```

### Permissions et sécurité

GitHub Actions bénéficie d'un système de permissions granulaires. Par défaut, les workflows ont des permissions limitées :

```yaml
permissions:
  contents: read        # Lecture du code
  pull-requests: write  # Écriture sur les PRs
  deployments: write    # Écriture des déploiements
```

### Tester les workflows localement avec Act

Pour tester les workflows avant de les pousser sur GitHub, l'outil **Act** simule l'environnement GitHub Actions localement en utilisant Docker[2].

#### Installation d'Act

```bash
# Sur macOS avec Homebrew
brew install act

# Sur Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | bash

# Sur Windows
choco install act-cli
```

#### Utiliser Act

```bash
# Lister tous les workflows
act --list

# Exécuter un workflow spécifique
act --job hello

# Exécuter avec des secrets locaux
act --job build --secret DEPLOY_TOKEN=my-token

# Utiliser un environnement personnalisé
act -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:full-latest
```

### Bonnes pratiques de configuration

**Organisation des workflows** : Utiliser un fichier par responsabilité (ci.yml, deploy.yml, security.yml)

**Nommage clair** : Utiliser des noms explicites pour les jobs et steps

**Documentation** : Ajouter des descriptions aux workflows et aux steps

**Versioning des actions** : Spécifier toujours une version majeure stable

**Gestion des secrets** : Ne jamais commiter les secrets, utiliser le système de GitHub

**Timeout** : Définir des timeouts appropriés pour éviter les hangups

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30  # Timeout global du job
    
    steps:
      - name: Long-running task
        timeout-minutes: 10  # Timeout spécifique du step
        run: ./long-process.sh
```

### Résumé du chemin d'apprentissage

Le chemin de formation couvre progressivement les éléments essentiels :

1. **Fondations conceptuelles** : Comprendre DevOps, CI/CD et l'intégration continue
2. **Fondamentaux YAML** : Maîtriser la syntaxe pour écrire des workflows
3. **Mise en place pratique** : Créer un dépôt, initialiser GitHub Actions, créer des workflows simples
4. **Déploiement** : Passer de tests à des déploiements réels
5. **Optimisation** : Utiliser des matrices de build, paralléliser les jobs, utiliser des caches

Ce progression permet de passer d'une compréhension théorique à une utilisation pratique de GitHub Actions dans des projets réels, en commençant par des workflows simples pour progresser vers des pipelines complexes et sophistiqués.
