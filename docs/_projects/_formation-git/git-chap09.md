# Citations
- https://graphite.com/guides/git-alias
- https://x-team.com/magazine/git-aliases-to-improve-your-workflow
- https://www.datacamp.com/tutorial/git-alias
- https://www.eficode.com/blog/10-levels-of-git-aliases-beginner-to-intermediate-concepts
- https://victorzhou.com/blog/git-aliases/
- https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases
- https://opensource.com/article/20/11/git-aliases
- https://www.atlassian.com/git/tutorials/git-alias
- https://gist.github.com/johnpolacek/69604a1f6861129ef088


# Tokens
- prompt_tokens: 253
- completion_tokens: 8932
- total_tokens: 9185
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.134, 'request_cost': 0.006, 'total_cost': 0.141}


# Content
# Chapitre 9 : Notions avancées Git

## 🎯 Introduction générale

Ce chapitre aborde les concepts avancés de Git qui permettent d'optimiser et de personnaliser le flux de travail. Les notions présentées ici constituent des outils puissants pour les développeurs cherchant à automatiser des tâches, organiser leur code de manière efficace et maîtriser les workflows complexes.

---

## 1️⃣ Introduction aux hooks Git

### Définition et principes fondamentaux

Les hooks Git sont des scripts personnalisés qui s'exécutent automatiquement lors d'événements spécifiques du cycle de vie de Git. Ils permettent d'automatiser des tâches, d'appliquer des règles de codage ou de déclencher des actions sans intervention manuelle. Les hooks fonctionnent comme des points d'accroche dans le processus de gestion de version.

### Architecture des hooks

Le système de hooks Git repose sur une structure en deux catégories principales :

**Hooks côté client (Client-side hooks)**

Ces hooks s'exécutent sur la machine locale du développeur. Ils interviennent lors de commandes comme commit, merge ou push. Les hooks client incluent :

- **Pre-commit** : s'exécute avant la création d'un commit, permettant de vérifier le code ou les fichiers
- **Prepare-commit-msg** : modifie le message de commit avant son édition
- **Commit-msg** : valide le message de commit selon des règles définies
- **Post-commit** : s'exécute après la création du commit
- **Pre-rebase** : s'exécute avant un rebasage
- **Post-checkout** : s'exécute après un changement de branche
- **Post-merge** : s'exécute après une fusion

**Hooks côté serveur (Server-side hooks)**

Ces hooks s'exécutent sur le serveur Git lors des opérations distantes. Ils incluent :

- **Pre-receive** : s'exécute avant d'accepter un push
- **Update** : s'exécute pour chaque branche lors d'un push
- **Post-receive** : s'exécute après qu'un push soit complet

### Localisation des hooks

Les hooks Git sont stockés dans le répertoire `.git/hooks` de chaque dépôt. Ce répertoire contient des fichiers d'exemple avec l'extension `.sample`. Pour activer un hook, il faut renommer le fichier en supprimant l'extension `.sample`.

```bash
# Localisation des hooks
ls -la .git/hooks/

# Exemple de structure
.git/hooks/
├── applypatch-msg.sample
├── commit-msg.sample
├── post-update.sample
├── pre-commit.sample
├── pre-push.sample
├── pre-rebase.sample
└── update.sample
```

### Création et exécution d'un hook

Pour créer un hook, il faut créer un fichier exécutable dans le répertoire `.git/hooks`. Le fichier doit être en lecture/exécution et contenir un script (bash, python, etc.).

**Exemple pratique : Hook pre-commit pour vérifier la syntaxe**

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Récupère les fichiers modifiés
STAGED_FILES=$(git diff --cached --name-only)

# Vérifie la présence de fichiers Python
for FILE in $STAGED_FILES; do
    if [[ $FILE == *.py ]]; then
        # Vérifie la syntaxe Python
        python3 -m py_compile "$FILE"
        if [ $? -ne 0 ]; then
            echo "Erreur : Syntaxe Python invalide dans $FILE"
            exit 1
        fi
    fi
done

exit 0
```

Pour rendre ce script exécutable :

```bash
chmod +x .git/hooks/pre-commit
```

**Exemple pratique : Hook commit-msg pour valider le format du message**

```bash
#!/bin/bash
# .git/hooks/commit-msg

# Récupère le fichier contenant le message
COMMIT_MSG_FILE=$1

# Lit le message de commit
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Vérifie que le message commence par un préfixe valide
if ! [[ $COMMIT_MSG =~ ^(feat|fix|docs|style|refactor|test|chore): ]]; then
    echo "Erreur : Le message de commit doit commencer par l'un des préfixes suivants :"
    echo "feat: Pour une nouvelle fonctionnalité"
    echo "fix: Pour une correction de bug"
    echo "docs: Pour une modification de documentation"
    echo "style: Pour des modifications sans impact logique"
    echo "refactor: Pour une refactorisation de code"
    echo "test: Pour l'ajout de tests"
    echo "chore: Pour des tâches de maintenance"
    exit 1
fi

exit 0
```

### Gestion des permissions et partage

Un défi majeur avec les hooks est leur partage entre développeurs. Comme le répertoire `.git/hooks` n'est pas versionné par défaut, les hooks ne se propagent pas automatiquement lors d'un clone.

**Solution 1 : Créer un répertoire versionné pour les hooks**

```bash
# Créer un répertoire hooks
mkdir -p scripts/git-hooks

# Créer un script d'installation
cat > scripts/install-hooks.sh << 'EOF'
#!/bin/bash
# Script d'installation des hooks

cp scripts/git-hooks/* .git/hooks/
chmod +x .git/hooks/*
echo "Hooks installés avec succès"
EOF

chmod +x scripts/install-hooks.sh
```

**Solution 2 : Utiliser un hook d'initialisation**

```bash
# .git/hooks/post-checkout
#!/bin/bash

# Vérifie si le fichier .git/hooks-config existe
if [ -f "scripts/hooks-config.sh" ]; then
    bash scripts/hooks-config.sh
fi
```

---

## 2️⃣ Librairies pour les hooks

### Frameworks de gestion des hooks

Plusieurs outils et librairies facilitent la gestion des hooks Git en automatisant leur installation et en fournissant des fonctionnalités avancées.

### Husky

Husky est une librairie Node.js populaire qui simplifie la gestion des hooks Git. Elle permet de définir les hooks dans le fichier `package.json` ou dans un fichier de configuration dédié.

**Installation et configuration de Husky**

```bash
# Installation via npm
npm install husky --save-dev

# Initialisation de Husky
npx husky install

# Création d'un hook pre-commit
npx husky add .husky/pre-commit "npm run lint"
```

**Fichier `package.json` avec Husky**

```json
{
  "name": "mon-projet",
  "version": "1.0.0",
  "scripts": {
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "test": "jest"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0"
  }
}
```

**Structure des fichiers Husky**

```
.husky/
├── _/
│   ├── .gitignore
│   └── husky.sh
├── pre-commit
├── commit-msg
└── pre-push
```

**Exemple de hook pre-commit avec Husky**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run test
```

### Pre-commit (Framework Python)

Pre-commit est un framework multilangage qui gère les hooks Git. Il est particulièrement utile pour les projets polyglotes.

**Installation et configuration**

```bash
# Installation via pip
pip install pre-commit

# Création du fichier de configuration
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black
  - repo: https://github.com/PyCQA/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
EOF

# Installation des hooks
pre-commit install

# Exécution manuelle sur tous les fichiers
pre-commit run --all-files
```

**Avantages du framework Pre-commit**

| Aspect | Détail |
|--------|--------|
| **Multilangage** | Support natif de Python, JavaScript, Go, Ruby, etc. |
| **Isolation** | Chaque hook s'exécute dans son propre environnement |
| **Versionnage** | Permet de fixer les versions des outils utilisés |
| **Partage** | Le fichier `.pre-commit-config.yaml` se partage facilement |
| **Flexibilité** | Possibilité de créer des hooks personnalisés |

### Lefthook

Lefthook est un gestionnaire de hooks écrit en Go, reconnu pour sa rapidité et sa légèreté.

**Installation et configuration**

```bash
# Installation via npm
npm install lefthook --save-dev

# Initialisation
npx lefthook install

# Configuration dans lefthook.yml
cat > lefthook.yml << 'EOF'
pre-commit:
  commands:
    lint:
      glob: "src/**/*.js"
      run: eslint {staged_files}
    format:
      glob: "src/**/*.js"
      run: prettier --write {staged_files}

commit-msg:
  commands:
    commitlint:
      run: commitlint --edit $1
EOF
```

### Comparaison des frameworks

| Critère | Husky | Pre-commit | Lefthook |
|---------|-------|-----------|----------|
| **Langage** | JavaScript/Node | Python | Go |
| **Vitesse** | Modérée | Bonne | Excellente |
| **Multilangage** | Non natif | Oui | Oui |
| **Installation** | npm | pip | npm/brew |
| **Courbe d'apprentissage** | Facile | Modérée | Facile |
| **Configuration** | JSON/YAML | YAML | YAML |

---

## 3️⃣ Les alias Git

### Concept et utilité

Les alias Git sont des raccourcis personnalisés qui permettent de remplacer des commandes longues ou complexes par des versions plus courtes et faciles à retenir. Ils réduisent le temps de saisie et améliorent la productivité en automatisant les commandes fréquemment utilisées.[1]

### Méthodes de création

**Méthode 1 : Utiliser `git config`**

La commande `git config` modifie les fichiers de configuration Git et permet de créer des alias rapidement.[1][3]

```bash
# Syntaxe générale
git config [--global] alias.[alias_name] "[command]"

# Exemple : créer un alias 'st' pour 'status'
git config --global alias.st "status"
```

**Méthode 2 : Éditer directement le fichier de configuration**

Le fichier `~/.gitconfig` (ou `.git/config` pour une configuration locale) contient la section `[alias]` où les raccourcis sont définis.[3][4]

```bash
# Éditer le fichier de configuration global
vim ~/.gitconfig
```

Fichier `~/.gitconfig` avec alias :

```
[user]
    name = Jean Dupont
    email = jean.dupont@exemple.com

[alias]
    st = status
    di = diff
    co = checkout
    br = branch
    cm = commit -m
```

### Alias de base recommandés

Les alias les plus utiles pour débuter incluent les commandes courantes du flux de travail Git.[5][6]

**Alias essentiels**

```bash
# Status shorthand
git config --global alias.st status
git config --global alias.s 'status -sb'

# Branch management
git config --global alias.br branch
git config --global alias.co checkout
git config --global alias.cb 'checkout -b'

# Commit operations
git config --global alias.ci commit
git config --global alias.cm 'commit -m'
git config --global alias.amend 'commit --amend --no-edit'

# Diff operations
git config --global alias.di diff
git config --global alias.dc 'diff --cached'

# Log operations
git config --global alias.lg 'log --oneline --graph --decorate --all'
git config --global alias.ll 'log --oneline'
git config --global alias.last 'log -1 HEAD'
```

**Collection complète pour fichier `.gitconfig`**[5]

```
[alias]
    s = status
    d = diff
    co = checkout
    br = branch
    last = log -1 HEAD
    cane = commit --amend --no-edit
    lo = log --oneline -n 10
    pr = pull --rebase
    st = status -sb
    ll = log --oneline
    lg = log --oneline --graph --decorate --all
```

### Alias avancés avec commandes shell

Pour les alias plus complexes, il est possible d'intégrer des commandes shell en utilisant le préfixe `!`.[7]

**Exemple : Alias pour afficher tous les alias existants**

```bash
# Ajouter à ~/.gitconfig
git config --global alias.aliases '!git config --get-regexp ^alias\\. | sed -e s/^alias\\.// -e s/\\ /\\ =\\ /'

# Utilisation
git aliases
```

**Exemple : Alias pour rechercher du code dans tout l'historique**[7]

```bash
# Configuration
git config --global alias.se '!git rev-list --all | xargs git grep -F'

# Utilisation : rechercher une chaîne de caractères
git se "fonction_perdue"
```

**Exemple : Alias pour voir les branches supprimées récemment**

```bash
git config --global alias.deleted '!git reflog | grep checkout | tail -20'
```

**Exemple : Alias pour fusionner et supprimer la branche source**

```bash
git config --global alias.merge-clean '!git merge $1 && git branch -d $1'
```

### Configuration conditionnelle

Git permet d'utiliser des configurations différentes selon le répertoire du projet, ce qui est particulièrement utile pour maintenir des alias distincts pour des contextes différents (travail, personnel, open source).[3]

**Configuration conditionnelle dans `~/.gitconfig`**

```
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work

[includeIf "gitdir:~/personal/"]
    path = ~/.gitconfig-personal
```

Fichier `~/.gitconfig-work` pour les projets professionnels :

```
[alias]
    st = status
    lg = log --oneline --graph
    pr = pull --rebase
    deploys = tag -l 'v*' --sort=-v:refname | head -20
```

Fichier `~/.gitconfig-personal` pour les projets personnels :

```
[alias]
    st = status -s
    co = checkout
    feature = checkout -b
```

### Gestion et maintenance des alias

**Consulter les alias existants**

```bash
# Lister tous les alias
git config --global -l | grep alias

# Afficher les alias définis localement
git config --local -l | grep alias

# Afficher un alias spécifique
git config --get alias.st
```

**Modifier un alias existant**

```bash
# Mettre à jour un alias
git config --global alias.st 'status -sb'

# Vérifier la modification
git config --get alias.st
```

**Supprimer un alias**

```bash
# Suppression via git config
git config --global --unset alias.st

# Ou éditer directement le fichier ~/.gitconfig
```

### Bonnes pratiques

| Pratique | Description |
|----------|------------|
| **Noms courts** | Utiliser 1-3 caractères pour les alias fréquents |
| **Cohérence** | Adopter une convention de nommage uniforme |
| **Documentation** | Ajouter des commentaires dans ~/.gitconfig |
| **Partage** | Documenter les alias essentiels pour l'équipe |
| **Éviter les conflits** | Ne pas utiliser d'alias qui entre en conflit avec des commandes existantes |

---

## 4️⃣ Git LFS (Large File Storage)

### Présentation et problématiques

Git LFS (Large File Storage) est une extension Git qui gère les fichiers volumineux de manière efficace. Les systèmes de contrôle de version traditionnels ne sont pas optimisés pour les gros fichiers binaires (vidéos, images haute résolution, archives, datasets), ce qui peut ralentir significativement le dépôt et les opérations Git.

**Problèmes sans LFS**

- Les fichiers volumineux augmentent la taille du clone de manière exponentielle
- Les opérations push/pull deviennent très lentes
- La bande passante utilisée est importante
- Les opérations locales (merge, rebase) consomment beaucoup de RAM

### Architecture et fonctionnement

Git LFS remplace les fichiers volumineux par des pointeurs texte dans le dépôt Git, tandis que le contenu réel est stocké sur un serveur séparé.

**Structure d'un pointeur LFS**

```
version https://git-lfs.github.com/spec/v1
oid sha256:2d26d5d1beed9b8e9e8b8e9e8e9e8e9e8e9e8e9e8e9e8e9e8e9e8e9e8
size 15728640
```

Ce pointeur remplace le fichier volumineux dans le dépôt Git, ce qui permet des clones rapides. Le fichier réel est téléchargé lors d'un checkout.

### Installation et configuration

**Installation de Git LFS**

```bash
# Sur macOS avec Homebrew
brew install git-lfs

# Sur Linux (Ubuntu/Debian)
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install git-lfs

# Sur Windows
# Télécharger l'installateur depuis https://git-lfs.github.com/

# Initialisation de Git LFS
git lfs install
```

**Vérification de l'installation**

```bash
# Vérifier que Git LFS est installé
git lfs --version

# Afficher les configurations LFS
git lfs env
```

### Utilisation basique

**Tracking de fichiers avec Git LFS**

Pour que Git LFS gère un type de fichier, il faut le déclarer dans le fichier `.gitattributes`.

```bash
# Ajouter un type de fichier à LFS
git lfs track "*.psd"
git lfs track "*.mp4"
git lfs track "*.zip"

# Créer le fichier .gitattributes
cat > .gitattributes << 'EOF'
# Images
*.jpg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text

# Vidéos
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.mkv filter=lfs diff=lfs merge=lfs -text
*.mov filter=lfs diff=lfs merge=lfs -text

# Archives
*.zip filter=lfs diff=lfs merge=lfs -text
*.tar filter=lfs diff=lfs merge=lfs -text
*.rar filter=lfs diff=lfs merge=lfs -text

# Datasets
*.csv filter=lfs diff=lfs merge=lfs -text
*.db filter=lfs diff=lfs merge=lfs -text

# Modèles machine learning
*.h5 filter=lfs diff=lfs merge=lfs -text
*.pkl filter=lfs diff=lfs merge=lfs -text
EOF
```

**Workflow avec LFS**

```bash
# 1. Ajouter des fichiers volumineux
cp /path/to/large_file.mp4 ./videos/

# 2. Vérifier que LFS les gère
git lfs ls-files

# 3. Commit et push normalement
git add videos/large_file.mp4
git commit -m "Ajouter vidéo de démonstration"
git push origin main

# Le fichier volumineux est automatiquement géré par LFS
```

**Vérification de l'état de LFS**

```bash
# Lister les fichiers gérés par LFS
git lfs ls-files

# Afficher des détails sur les fichiers LFS
git lfs ls-files --long

# Voir l'espace utilisé par LFS
du -sh .git/lfs
```

### Configuration avancée

**Utiliser un serveur LFS personnalisé**

```bash
# Configurer le serveur LFS
git config --global lfs.url https://serveur-lfs.exemple.com

# Pour un dépôt spécifique
git config lfs.url https://serveur-lfs-projet.exemple.com
```

**Configuration pour les performances**

```bash
# Configurer le parallélisme des téléchargements
git config lfs.concurrenttransfers 8

# Configurer la taille des chunks
git config lfs.chunktransfersize 5242880
```

**Ignorer les fichiers LFS pour le développement local**

```bash
# Créer un fichier .git/info/exclude pour ignorer les fichiers LFS
echo "*.mp4" >> .git/info/exclude
```

### Commandes utiles de LFS

| Commande | Description |
|----------|-------------|
| `git lfs track "*.ext"` | Ajouter un type de fichier à LFS |
| `git lfs untrack "*.ext"` | Arrêter de tracker un type de fichier |
| `git lfs ls-files` | Lister les fichiers gérés par LFS |
| `git lfs migrate` | Migrer les fichiers volumineux existants vers LFS |
| `git lfs prune` | Nettoyer les fichiers LFS non référencés |
| `git lfs pull` | Télécharger les fichiers LFS manquants |
| `git lfs fetch` | Récupérer les fichiers LFS distants |

### Migration de fichiers volumineux existants

Si un projet contient déjà des fichiers volumineux dans l'historique, la commande `git lfs migrate` permet de les convertir.

```bash
# Migrer tous les fichiers .mp4 vers LFS
git lfs migrate import --include="*.mp4"

# Migrer plusieurs types
git lfs migrate import --include="*.mp4,*.psd,*.zip"

# Réécrire tout l'historique (attention : à faire avec prudence)
git lfs migrate import --everything
```

### Limitations et considérations

- Les serveurs LFS nécessitent une configuration supplémentaire
- Certains services (GitHub, GitLab, Bitbucket) offrent du stockage LFS limité
- La suppression de fichiers LFS de l'historique ne réduit pas immédiatement l'espace utilisé

---

## 5️⃣ Utilisation de git cherry-pick

### Concept et cas d'usage

`git cherry-pick` permet de sélectionner et d'appliquer des commits spécifiques d'une branche à une autre sans fusionner l'ensemble de la branche. C'est particulièrement utile pour appliquer des corrections de bugs ou des fonctionnalités sans faire de fusion complète.

**Cas d'usage courants**

- Appliquer une correction d'urgence (hotfix) depuis une branche vers la production
- Copier des commits de fonctionnalités d'une branche à une autre
- Récupérer un commit oublié
- Refactoriser les commits d'une branche avant fusion

### Syntaxe et utilisation basique

**Syntaxe générale de cherry-pick**

```bash
git cherry-pick <commit-hash>
```

**Exemple pratique simple**

```bash
# 1. Voir les commits disponibles dans une autre branche
git log origin/develop --oneline | head -10

# 2. Identifier le hash du commit à copier
# Exemple : abc1234 Corriger bug de validation

# 3. Se placer sur la branche de destination
git checkout main

# 4. Appliquer le commit spécifique
git cherry-pick abc1234

# 5. Vérifier que le commit a été appliqué
git log --oneline -1
```

### Cherry-picking multiple

Pour appliquer plusieurs commits en même temps, plusieurs approches sont possibles.

**Appliquer une série de commits consécutifs**

```bash
# Appliquer tous les commits entre deux points
git cherry-pick <commit-debut>..<commit-fin>

# Exemple : appliquer les 3 derniers commits
git cherry-pick abc1234..def5678

# Note : le commit de début n'est pas inclus, seul le intervalle entre les deux
```

**Appliquer une plage inclusive**

```bash
# Inclure le commit de début et de fin
git cherry-pick <commit-debut>^..<commit-fin>

# Ou utiliser la notation avec trois points
git cherry-pick <commit-debut>~1..<commit-fin>
```

**Appliquer plusieurs commits non-consécutifs**

```bash
# Appliquer plusieurs commits spécifiques
git cherry-pick abc1234 def5678 ghi9012

# Appliquer dans un ordre spécifique
git cherry-pick ghi9012 abc1234 def5678
```

### Gestion des conflits

Le cherry-picking peut générer des conflits si les modifications se chevauchent. Git fournit des mécanismes pour résoudre ces situations.

**Scénario de conflit**

```bash
# Tenter d'appliquer un commit qui crée un conflit
git cherry-pick abc1234

# Output : CONFLICT (content): Merge conflict in fichier.js
```

**Résolution des conflits**

```bash
# 1. Voir le statut des conflits
git status

# 2. Éditer les fichiers en conflit et résoudre manuellement
# Les marqueurs de conflit :
# <<<<<<< HEAD
# Code actuel
# =======
# Code à cherry-picker
# >>>>>>> abc1234

# 3. Marquer les fichiers comme résolus
git add fichier.js

# 4. Continuer le cherry-pick
git cherry-pick --continue

# Ou annuler le cherry-pick complètement
git cherry-pick --abort
```

**Stratégies de résolution**

```bash
# Garder la version actuelle en cas de conflit
git cherry-pick --strategy-option=ours abc1234

# Utiliser la version du commit à cherry-picker
git cherry-pick --strategy-option=theirs abc1234

# Résoudre automatiquement avec une stratégie personnalisée
git cherry-pick -X ours abc1234
```

### Options avancées

**Cherry-pick avec message de commit personnalisé**

```bash
# Appliquer le commit et modifier le message
git cherry-pick --edit abc1234

# Appliquer sans éditer le message
git cherry-pick --no-edit abc1234

# Générer un nouveau commit avec le message original
git cherry-pick -n abc1234
git commit -m "Appliquer depuis develop: $(git log --format=%B -n 1 abc1234)"
```

**Cherry-pick sans créer de commit**

```bash
# Appliquer les changements du commit sans créer de commit
git cherry-pick --no-commit abc1234

# Cette option permet de :
# - Combiner plusieurs commits
# - Vérifier les changements avant de commiter
# - Modifier les changements avant de commiter

# Après modification, créer le commit
git commit -m "Changements appliqués et modifiés"
```

**Cherry-pick avec signoff**

```bash
# Ajouter une ligne "Signed-off-by" au message
git cherry-pick --signoff abc1234

# Cela ajoute au message :
# Signed-off-by: Jean Dupont <jean@exemple.com>
```

### Workflow avancé : Hotfix avec cherry-pick

Un scénario courant combine cherry-pick avec un workflow de hotfix efficace.

**Scénario : Correction d'urgence en production**

```bash
# 1. Créer une branche de hotfix depuis main
git checkout main
git pull origin main
git checkout -b hotfix/bug-critique

# 2. Faire la correction
echo "correction du bug" > fichier.js
git add fichier.js
git commit -m "fix: résoudre le bug critique"
# Commit hash : abc1234

# 3. Merger la correction dans main (production)
git checkout main
git merge hotfix/bug-critique
git push origin main

# 4. Appliquer la même correction dans develop
git checkout develop
git pull origin develop

# Plutôt que de refaire la correction ou de merger main dans develop,
# cherry-picker le commit de hotfix
git cherry-pick abc1234

# 5. Gérer les conflits potentiels et finir
git push origin develop

# 6. Nettoyer
git branch -d hotfix/bug-critique
```

### Cherry-pick en boucle avec script

Pour les cas d'usage complexes impliquant de nombreux commits, un script peut automatiser le processus.

```bash
#!/bin/bash
# script-cherry-pick.sh
# Appliquer une liste de commits avec gestion d'erreur

COMMITS=("abc1234" "def5678" "ghi9012")
BRANCH_DESTINATION="main"

# Basculer vers la branche de destination
git checkout "$BRANCH_DESTINATION"

# Appliquer chaque commit
for COMMIT in "${COMMITS[@]}"; do
    echo "Application du commit : $COMMIT"
    
    if git cherry-pick "$COMMIT"; then
        echo "✓ Commit appliqué avec succès"
    else
        echo "✗ Conflit détecté pour $COMMIT"
        echo "Veuillez résoudre les conflits et exécuter :"
        echo "git add ."
        echo "git cherry-pick --continue"
        exit 1
    fi
done

echo "Tous les commits ont été appliqués avec succès"
git log --oneline -n ${#COMMITS[@]}
```

Utilisation du script :

```bash
chmod +x script-cherry-pick.sh
./script-cherry-pick.sh
```

### Visualisation et vérification

**Visualiser les commits disponibles pour cherry-pick**

```bash
# Voir les commits de la branche source
git log origin/develop --oneline -n 10

# Comparer les commits entre deux branches
git log --oneline main..develop

# Voir les commits non appliqués dans main qui existent dans develop
git log --graph --oneline --all --decorate
```

**Vérifier les changements avant cherry-pick**

```bash
# Voir quels changements apportera le cherry-pick
git show abc1234

# Voir les fichiers affectés
git show --name-status abc1234

# Voir un diff détaillé
git diff main abc1234
```

### Problèmes courants et solutions

**Problème : Cherry-pick crée des doublons**

```bash
# Symptôme : Le même changement apparaît deux fois
# Solution : Utiliser le rebase plutôt que cherry-pick

# Ou éviter de cherry-picker des commits que vous allez merger
git cherry-pick --no-commit abc1234  # Permettre la modification
```

**Problème : Conflits importants après cherry-pick**

```bash
# Si les conflits sont trop importants, annuler
git cherry-pick --abort

# Puis utiliser une approche différente
git rebase --interactive
# ou
git merge branche-source
```

**Problème : Cherry-pick de commits qui dépendent les uns des autres**

```bash
# Appliquer les commits dans le bon ordre
# Déterminer les dépendances
git log --oneline feature-branch --reverse

# Appliquer dans l'ordre des dépendances
git cherry-pick commit1
git cherry-pick commit2  # Si dépend de commit1
git cherry-pick commit3  # Si dépend de commit1 ou commit2
```

### Bonnes pratiques

| Pratique | Description |
|----------|------------|
| **Documenter l'origine** | Ajouter un commentaire indiquant d'où provient le commit |
| **Vérifier d'abord** | Toujours examiner un commit avant de le cherry-picker |
| **Éviter l'abus** | Utiliser le cherry-pick avec modération, préférer les merges normales |
| **Tester après** | Vérifier que le code fonctionne correctement après cherry-pick |
| **Notifier l'équipe** | Indiquer aux autres développeurs les commits cherry-pickés |
| **Limiter la profondeur** | Ne pas cherry-picker des commits qui ont déjà été cherry-pickés |

---

## 📚 Synthèse du chemin d'apprentissage

### Architecture du processus d'apprentissage

Le parcours proposé suit une progression logique allant des concepts de base aux techniques avancées :

**1. Fondations : Hooks Git**

La compréhension des hooks Git constitue la base. Les hooks permettent d'automatiser des tâches et de mettre en place des processus reproductibles. C'est le point de départ idéal car de nombreux workflows avanc és en dépendent. Un apprenant doit maîtriser :
- La localisation et l'activation des hooks
- La création de scripts simples (pre-commit, commit-msg)
- Le debugging des hooks

**2. Outillage : Librairies pour les hooks**

Une fois les hooks compris, l'apprentissage des frameworks existants (Husky, Pre-commit, Lefthook) permet de bénéficier de solutions éprouvées. Cette étape économise du temps et évite de réinventer la roue. Les librairies fournissent :
- Des abstractions simplifiées
- Des écosystèmes d'extensions
- Des partages de configuration facilitées

**3. Productivité : Alias Git**

Les alias constituent l'étape la plus accessible mais très impactante en termes de flux de travail quotidien. Contrairement aux hooks et aux librairies, les alias n'ont pas de prérequis complexes et offrent un bénéfice immédiat. Cette étape consolidide les bonnes habitudes avant d'aborder des sujets plus complexes.

**4. Scalabilité : Git LFS**

Git LFS s'adresse aux projets spécifiques manipulant des fichiers volumineux. Ce n'est pas une nécessité pour tous les projets, mais c'est un élément critique pour certains domaines (machine learning, design, médias). L'apprentissage de LFS doit intervenir après avoir consolidé les bases de Git.

**5. Expertise : Cherry-pick**

La maîtrise de `cherry-pick` représente un niveau d'expertise intermédiaire. Elle suppose une bonne compréhension du rebase, du merge et du modèle de commits de Git. Cette technique avancée offre une granularité fine dans la gestion des commits et des branches.

### Points de connexion entre les modules

Les modules ne sont pas isolés mais interagissent :

- **Hooks + Aliases** : Les hooks peuvent utiliser des alias Git
- **Hooks + Librairies** : Les librairies automatisent la gestion des hooks
- **LFS + Alias** : Un alias peut être créé pour les commandes LFS fréquentes
- **Cherry-pick + Hooks** : Un hook peut vérifier l'intégrité des commits cherry-pickés

### Progression en spirale

Le contenu suit une progression en spirale où chaque module revisit des concepts antérieurs à un niveau plus approfondi :

1. **Premiers hooks** → Comprendre l'automatisation
2. **Librairies** → Organiser et partager l'automatisation
3. **Alias** → Optimiser l'interaction avec l'automatisation
4. **LFS** → Adapter l'automatisation à des types de fichiers spécialisés
5. **Cherry-pick** → Automatiser la sélection de commits avec précision

### Pratiques transversales

Certaines compétences s'appliquent à tous les modules :

- **Édition de fichiers de configuration** : `.gitconfig`, `.pre-commit-config.yaml`, `.gitattributes`, `.git/hooks`
- **Exécution de scripts** : Bash pour les hooks, Python pour Pre-commit
- **Debugging** : Inspection de l'état de Git à chaque étape
- **Documentation** : Enregistrer les configurations pour l'équipe
- **Test d'exécution** : Vérifier que les changements produisent l'effet attendu

### Points clés de maîtrise pour chaque module

Pour consolider l'apprentissage, un apprenant doit pouvoir :

**Hooks Git** :
- Créer et tester un hook pré-commit fonctionnel
- Diagnostiquer les problèmes d'exécution de hooks
- Partager les hooks avec une équipe

**Librairies** :
- Installer et configurer Husky OU Pre-commit OU Lefthook
- Intégrer au moins trois plugins/hooks existants
- Adapter la configuration à un projet réel

**Alias Git** :
- Créer 10-15 alias couvrant les opérations quotidiennes
- Maîtriser la syntaxe des alias avancés avec `!`
- Configurer les inclusions conditionnelles pour plusieurs contextes

**Git LFS** :
- Configurer LFS pour un projet avec fichiers volumineux
- Migrer un projet existant vers LFS
- Optimiser les performances de téléchargement

**Cherry-pick** :
- Appliquer un commit isolé entre branches
- Résoudre les conflits générés par cherry-pick
- Automatiser le cherry-pick de plusieurs commits

---

## ✅ Conclusion

Les notions avancées de Git présentées dans ce chapitre transforment l'utilisation de Git d'un simple outil de versioning à un système complet d'automatisation et d'optimisation du flux de travail. La progression proposée guide l'apprenant du conceptuel (hooks) vers le pratique (alias), puis vers l'expert (cherry-pick), en passant par l'outillage (librairies) et la scalabilité (LFS).

Chacun de ces domaines offre des bénéfices immédiats et durables pour l'efficacité et la fiabilité des processus de développement. L'apprentissage de ces concepts permet de maîtriser pleinement Git et d'adapter son utilisation à des contextes et des équipes variés.
