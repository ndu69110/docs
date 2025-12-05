# Citations
- https://www.debian-fr.org/t/sauvegarder-un-dossier-avec-git/23928
- https://www.datacamp.com/fr/tutorial/git-commit
- http://tutoriel-git.readthedocs.io/fr/latest/Modif.html
- https://debugue.ecrituresnumeriques.ca/saison-04/seance-05-git-archivage-et-partage-des-donnees/
- https://www.atlassian.com/fr/git/tutorials/saving-changes/git-commit
- https://blog.stephane-robert.info/docs/developper/version/git/
- https://www.youtube.com/watch?v=anP0LBVhUzA
- https://www.youtube.com/watch?v=syXt9-AdfPs
- https://grafikart.fr/tutoriels/init-config-add-log-585
- https://cirst.uqam.ca/outils_bin/git-les-bonnes-pratiques/


# Tokens
- prompt_tokens: 296
- completion_tokens: 5412
- total_tokens: 5708
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.081, 'request_cost': 0.006, 'total_cost': 0.088}


# Content
# Chapitre 2 : Les bases de Git

## 📌 Introduction aux fondamentaux de Git

Git fonctionne selon un modèle en trois étapes fondamentales pour gérer les modifications d'un projet. Avant de manipuler les données, l'apprenti utilisateur doit comprendre l'architecture sous-jacente de Git, qui repose sur trois zones principales : le répertoire de travail (working directory), l'index (staging area) et le dépôt (repository). Ce chapitre explore en profondeur chacun des mécanismes essentiels permettant de maîtriser la gestion des versions avec Git.[1][2][3]

---

## Créer des sauvegardes avec git commit

### 🔍 Concept fondamental du commit

Un commit représente un instantané figé du projet à un moment donné dans le temps.[5] C'est une photographie complète de l'état des fichiers, accompagnée d'un message descriptif et de métadonnées (auteur, date, hash unique). Chaque commit crée un point de contrôle auquel il est possible de revenir ultérieurement, formant ainsi l'historique complet du projet.[2][5]

### Anatomie d'un commit

Chaque commit contient les éléments suivants :

**Identifiant unique (hash SHA-1)** — Une chaîne de 40 caractères générant une signature numérique unique du commit.

**Message de commit** — Une description textuelle des modifications apportées. La première ligne (50 caractères maximum) constitue le résumé, suivi optionnellement de détails supplémentaires.

**Auteur et Committer** — Métadonnées enregistrant l'identité de la personne ayant créé le commit et celle ayant effectué l'opération.

**Timestamp** — Date et heure précises du commit.

**Snapshot du projet** — L'état complet des fichiers ayant été stagés.

### Processus de création d'un commit

La création d'un commit suit un flux en deux étapes distinctes. D'abord, les modifications doivent être ajoutées à l'index (staging area) via `git add`. Ensuite, l'opération `git commit` capture l'instantané de ce qui a été stagé.[2]

```bash
# Première étape : ajouter les fichiers à l'index
git add fichier1.txt fichier2.py

# Deuxième étape : créer le commit
git commit -m "Description des modifications apportées"
```

### Syntaxe de base du commit

La méthode la plus simple et directe pour créer un commit consiste à utiliser le flag `-m` suivi du message entre guillemets :[2][5]

```bash
git commit -m "Correction du bug dans l'authentification utilisateur"
```

Lorsque le flag `-m` est omis, Git ouvre automatiquement l'éditeur de texte configuré par défaut, permettant la rédaction d'un message plus élaboré.[5]

### Commits avec plusieurs fichiers

Pour inclure plusieurs fichiers modifiés dans un même commit, deux approches existent :

**Ajouter chaque fichier individuellement :**

```bash
git add init.d apt/source.list
git commit -m "Mise à jour des configurations système"
```

**Ajouter tous les fichiers non ignorés du répertoire :**

```bash
git add .
git commit -m "Synchronisation complète des modifications"
```

### Mettre à jour les fichiers avant commit

Après avoir lancé `git add` sur certains fichiers, si d'autres modifications surviennent, un nouveau `git add` est nécessaire pour les inclure. Alternativement, le flag `-a` avec commit ajoute automatiquement tous les fichiers modifiés (à l'exception des fichiers non suivis) :[3]

```bash
git commit -a -m "Enregistrement de toutes les modifications suivies"
```

### Commits avec modification rétrospective

Après la création d'un commit, il est parfois nécessaire de corriger le message ou d'ajouter un fichier oublié. La commande `--amend` permet cette rectification :[2]

```bash
# Corriger le message du dernier commit
git commit --amend -m "Message corrigé"

# Ajouter un fichier oublié au dernier commit
git add fichier-oublié.txt
git commit --amend
```

### Affichage de l'historique des commits

La commande `git log` énumère tous les commits du projet, en commençant par le plus récent :[1][3]

```bash
git log
```

Cette commande affiche pour chaque commit :
- Le hash SHA-1 (identifiant unique)
- L'auteur et sa date
- Le message de commit

### Annulation de commits

Deux stratégies permettent d'annuler les commits effectués.

**La première approche, utilisant `git revert`, applique l'inverse des modifications tout en conservant l'historique :**

```bash
git revert <hash-du-commit>
```

**La seconde approche, utilisant `git reset`, supprime le commit et peut conserver ou abandonner les modifications :**

```bash
# Annuler le dernier commit en conservant les modifications
git reset HEAD^

# Annuler le dernier commit et abandonner les modifications
git reset --hard HEAD^

# Revenir à un commit spécifique
git reset --hard <hash-du-commit>
```

---

## Ignorer des fichiers et des dossiers

### 🎯 Nécessité du fichier .gitignore

Au sein d'un projet, certains fichiers ne doivent jamais être versionnés : fichiers temporaires, dépendances téléchargées, fichiers de configuration personnels, ou secrets. Le fichier `.gitignore` instruit Git de négliger ces fichiers lors des opérations d'ajout et de commit.[1][10]

### Structure et placement du .gitignore

Le fichier `.gitignore` doit être créé à la racine du dépôt Git. Ses directives s'appliquent au répertoire contenant le fichier et à tous les sous-répertoires.[1]

```bash
# Créer et éditer le fichier .gitignore
cat /etc/.gitignore
```

### Syntaxe des règles .gitignore

Chaque ligne du fichier `.gitignore` définit un motif à ignorer. Voici les conventions principales :

**Commentaires** — Les lignes commençant par `#` sont ignorées.

**Modèles jokers** — Le caractère `*` remplace zéro ou plusieurs caractères.

**Modèles de répertoires** — Une barre oblique `/` en fin de ligne désigne un répertoire.

**Exceptions** — Le préfixe `!` exclut un fichier de la règle d'ignorage précédente.

### Exemples concrets de .gitignore

```
# Ignorer les fichiers temporaires
*~
*.tmp
*.bak

# Ignorer les fichiers de système d'exploitation
.DS_Store
Thumbs.db
.directory

# Ignorer les répertoires de dépendances
node_modules/
venv/
__pycache__/

# Ignorer les fichiers de configuration sensibles
.env
config/secrets.yml
.aws/credentials

# Ignorer les fichiers de build
dist/
build/
*.o

# Exception : inclure un fichier spécifique
!config/example.yml
```

### Impact du .gitignore sur les commandes Git

Une fois le `.gitignore` configuré, la commande `git status` n'affichera plus les fichiers ignorés.[1] Lors de `git add .`, seuls les fichiers non ignorés seront ajoutés.

```bash
# Créer un fichier .gitignore
echo "*~" > .gitignore

# Vérifier l'état
git status
```

### Application du .gitignore aux fichiers existants

Si un fichier était déjà suivi par Git avant son ajout au `.gitignore`, le fichier continuera à être suivi. Pour arrêter le suivi d'un fichier déjà enregistré :

```bash
# Arrêter le suivi du fichier sans le supprimer
git rm --cached nom-du-fichier

# Confirmer avec un commit
git commit -m "Arrêt du suivi du fichier"
```

---

## Afficher les différences entre répertoire, index et sauvegarde avec git diff

### 🔄 Trois zones à comparer

Git distingue trois états pour chaque fichier :

1. **Le répertoire de travail (working directory)** — Les fichiers actuellement sur le disque dur, modifiables librement.
2. **L'index (staging area)** — La zone intermédiaire contenant les fichiers en attente de commit.
3. **Le dépôt (repository)** — Les fichiers validés et enregistrés dans l'historique Git.

La commande `git diff` permet d'examiner les modifications entre ces trois zones.

### Visualiser les différences non stagées

Pour afficher les modifications apportées au répertoire de travail qui n'ont pas encore été stagées :

```bash
git diff
```

Cette commande compare l'index avec le répertoire de travail, montrant les additions (lignes vertes avec `+`) et les suppressions (lignes rouges avec `-`).

### Visualiser les différences stagées

Pour afficher les modifications qui ont été ajoutées à l'index et qui seront incluses dans le prochain commit :

```bash
git diff --staged
```

Ou l'alias équivalent :

```bash
git diff --cached
```

### Visualiser les différences avec le dernier commit

Pour comparer le répertoire de travail avec le dernier commit sauvegardé :

```bash
git diff HEAD
```

### Exemple concret de flux git diff

Supposons un fichier `app.py` initialement commité contenant :

```python
def greet(name):
    return f"Hello {name}"
```

L'utilisateur apporte les modifications suivantes :

```python
def greet(name, greeting="Hello"):
    return f"{greeting} {name}!"
```

Avant d'ajouter le fichier, `git diff` révèle :

```diff
diff --git a/app.py b/app.py
index 1234567..abcdefg 100644
--- a/app.py
+++ b/app.py
@@ -1,2 +1,2 @@
-def greet(name):
-    return f"Hello {name}"
+def greet(name, greeting="Hello"):
+    return f"{greeting} {name}!"
```

Après `git add app.py` et une nouvelle modification :

```python
def greet(name, greeting="Hello", punctuation=""):
    return f"{greeting} {name}{punctuation}!"
```

`git diff` montre uniquement la nouvelle modification :

```diff
@@ -1,2 +1,2 @@
 def greet(name, greeting="Hello"):
-    return f"{greeting} {name}!"
+    return f"{greeting} {name}{punctuation}!"
```

Tandis que `git diff --staged` affiche la première modification.

---

## État d'un fichier et fonctionnement de l'index

### 📊 Cycle de vie d'un fichier dans Git

Chaque fichier suivis par Git traverse plusieurs états au cours de sa durée de vie au sein du projet.

### Les quatre états principaux

**Non suivi (Untracked)** — Le fichier existe dans le répertoire de travail mais n'a jamais été ajouté à Git. Git l'ignore complètement.

**Modifié (Modified)** — Un fichier suivi a été modifié dans le répertoire de travail mais n'a pas été stagé. Cette modification n'apparaîtra dans le prochain commit que si le fichier est ajouté à l'index.

**Stagé (Staged)** — Le fichier a été ajouté à l'index via `git add` et sera inclus dans le prochain commit.

**Commité (Committed)** — Le fichier est enregistré de manière permanente dans le dépôt Git.

### Visualisation des états avec git status

La commande `git status` affiche l'état courant du répertoire de travail et de l'index :[1][3]

```bash
git status
```

Exemple de sortie :

```
On branch master

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)
        modified:   config.py
        new file:   auth.py

Changes not staged for commit:
  (use "git commit -a" ...)
        modified:   main.py

Untracked files:
  (use "git add <file>..." to track)
        temp.log
        backup/
```

### Comprendre l'index (staging area)

L'index est une zone intermédiaire entre le répertoire de travail et le dépôt. Son rôle consiste à permettre une sélection précise des modifications à inclure dans le prochain commit. Plusieurs modifications peuvent exister sur un fichier, mais seule la version stagée sera commise.[2][3]

### Flux d'état typique

```
Fichier créé
     ↓
Non suivi (untracked)
     ↓ git add
Stagé (staged)
     ↓ git commit
Commité (committed)
     ↓ Modification du fichier
Modifié (modified)
     ↓ git add
Stagé (staged)
     ↓ git commit
Commité (committed)
```

### Transitions d'état par fichier

Supposons la création d'un nouveau fichier `utils.py` :

```bash
# État initial : Non suivi
git status
# Untracked files:
#   utils.py

# Transition vers stagé
git add utils.py
git status
# Changes to be committed:
#   new file:   utils.py

# Transition vers commité
git commit -m "Ajout du module utils"
git status
# On branch master
# nothing to commit, working tree clean

# Modification du fichier
echo "# Nouvelle fonction" >> utils.py
git status
# Changes not staged for commit:
#   modified:   utils.py

# Stagé à nouveau
git add utils.py
git status
# Changes to be committed:
#   modified:   utils.py
```

### Revenir à un état antérieur

Pour annuler la modification d'un fichier avant de le stager, la commande `git checkout` restaure la version du dernier commit :[3]

```bash
git checkout -- fichier-modifié.py
```

Pour retirer un fichier de l'index sans l'effacer du disque :

```bash
git reset HEAD fichier-stagé.py
```

---

## Le suivi des fichiers

### 🔗 Concept du suivi de fichiers

Git ne considère que deux catégories de fichiers : ceux qui sont suivis (tracked) et ceux qui ne le sont pas (untracked). Un fichier suivi est un fichier qui a été ajouté à Git au moins une fois dans son historique. Git continue à surveiller ce fichier même s'il n'a pas changé.

### Démarrage du suivi

Pour commencer le suivi d'un fichier nouveau, l'utilisation de `git add` est obligatoire :[1]

```bash
git add nouveau-fichier.txt
git status
```

Après cette opération, le fichier passe de l'état "untracked" à l'état "new file" (prêt à être commité).

### Arrêt du suivi d'un fichier

Un fichier suivi peut cesser d'être suivi. Deux approches existent :

**Suppression du fichier et arrêt du suivi :**

```bash
git rm fichier-obsolete.txt
git commit -m "Suppression du fichier obsolète"
```

**Arrêt du suivi sans suppression du fichier local :**

```bash
git rm --cached fichier-a-ignorer.txt
git commit -m "Arrêt du suivi du fichier"
```

### Affichage des fichiers suivis

Pour vérifier quels fichiers sont actuellement suivis :

```bash
git ls-files
```

Cette commande énumère tous les fichiers présents dans l'index (c'est-à-dire ceux qui ont été ajoutés et commités à un moment donné).

### Fichiers suivis dans un répertoire existant

Lorsque l'on crée un dépôt Git dans un répertoire contenant des fichiers existants, aucun fichier n'est automatiquement suivi. Il faut explicitement les ajouter :[1]

```bash
cd /mon/projet/existant
git init
git add .
git commit -m "Commit initial du projet"
```

---

## Supprimer un fichier ou un dossier

### 🗑️ Suppression de fichiers avec Git

La suppression via Git diffère de la simple suppression depuis l'explorateur de fichiers. Git doit être informé de la suppression, qui devient elle-même une modification à commiter.

### Suppression simple d'un fichier

La commande `git rm` supprime le fichier du répertoire de travail et le retire du suivi Git simultanément :[3]

```bash
git rm fichier-a-supprimer.txt
git status
# Changes to be committed:
#   deleted:    fichier-a-supprimer.txt

git commit -m "Suppression du fichier"
```

### Suppression en conservant le fichier local

Parfois, il est souhaitable de cesser le suivi d'un fichier sans le supprimer du disque (par exemple, un fichier de configuration personnelle). L'option `--cached` réalise cette opération :[3]

```bash
git rm --cached config-local.ini
git status
# Untracked files:
#   config-local.ini

git commit -m "Arrêt du suivi du fichier de configuration local"
```

### Suppression de répertoires

Pour supprimer un répertoire entier et tous ses fichiers :

```bash
git rm -r dossier-a-supprimer/
git commit -m "Suppression du répertoire"
```

L'option `-r` (récursive) garantit la suppression de tous les fichiers du répertoire.

### Gestion des répertoires vides

Git ne suit que les fichiers, pas les répertoires vides. Un répertoire disparaît automatiquement de Git si tous ses fichiers sont supprimés. Pour conserver un répertoire vide, une convention courante consiste à ajouter un fichier `.gitkeep` vide :

```bash
mkdir dossier-a-conserver
touch dossier-a-conserver/.gitkeep
git add dossier-a-conserver/.gitkeep
git commit -m "Création du répertoire avec fichier .gitkeep"
```

### Suppression accidentelle et restauration

Si un fichier a été supprimé accidentellement du répertoire de travail mais pas du dépôt, la restauration est possible :

```bash
git checkout -- fichier-supprime.txt
```

Si la suppression a déjà été commise, il faut revenir à un commit antérieur ou utiliser `git revert`.

### Exemple complet de gestion des suppressions

```bash
# Créer un fichier et le commiter
echo "Données temporaires" > temp.txt
git add temp.txt
git commit -m "Ajout du fichier temporaire"

# Créer un répertoire avec plusieurs fichiers
mkdir logs
echo "Log 1" > logs/app.log
echo "Log 2" > logs/system.log
git add logs/
git commit -m "Ajout du répertoire de logs"

# Supprimer le fichier temporaire
git rm temp.txt
git commit -m "Suppression du fichier temporaire"

# Supprimer tout le répertoire de logs
git rm -r logs/
git commit -m "Suppression du répertoire de logs"

# Vérifier l'historique
git log --oneline
```

---

## 🎓 Intégration et pratique des concepts

### Flux de travail complet : Du fichier au commit

L'apprentissage des bases de Git se concrétise par la maîtrise d'un flux de travail cohérent. Voici un scénario pédagogique englobant tous les concepts présentés :

**Étape 1 : Initialisation du projet et configuration du .gitignore**

```bash
# Créer un nouveau projet
mkdir mon-app
cd mon-app

# Initialiser le dépôt
git init

# Configurer l'utilisateur
git config user.name "Développeur"
git config user.email "dev@example.com"

# Créer le .gitignore
cat > .gitignore << EOF
# Fichiers temporaires
*.tmp
*.bak
*~

# Dépendances
node_modules/
venv/

# Fichiers sensibles
.env
EOF

# Ajouter et commiter le .gitignore
git add .gitignore
git commit -m "Ajout de la configuration Git"
```

**Étape 2 : Création de fichiers et suivi initial**

```bash
# Créer des fichiers du projet
echo "console.log('Application');" > app.js
echo "from flask import Flask" > server.py
echo "# Documentation du projet" > README.md

# Vérifier l'état
git status

# Ajouter les fichiers
git add .

# Vérifier l'index
git status

# Créer le commit initial
git commit -m "Commit initial du projet"
```

**Étape 3 : Modification et gestion des changements**

```bash
# Modifier app.js
echo "console.log('Version 2');" >> app.js

# Créer un fichier temporaire (ignoré)
echo "données" > temp.txt

# Vérifier l'état
git status

# Observer les différences
git diff

# Ajouter la modification et ignorer le fichier temporaire
git add app.js

# Vérifier les fichiers stagés
git diff --staged

# Créer le commit
git commit -m "Amélioration du script d'application"
```

**Étape 4 : Suppression et gestion des fichiers**

```bash
# Créer un fichier devenu obsolète
echo "Ancienne configuration" > config-old.py
git add config-old.py
git commit -m "Ajout de configuration (ancienne version)"

# Supprimer le fichier
git rm config-old.py
git commit -m "Suppression de la configuration obsolète"

# Vérifier l'historique
git log --oneline
```

### Tableau récapitulatif des commandes principales

| Commande | Fonction | Exemple |
|----------|----------|---------|
| `git add <fichier>` | Ajouter un fichier à l'index | `git add app.py` |
| `git add .` | Ajouter tous les fichiers non ignorés | `git add .` |
| `git commit -m "message"` | Créer un commit | `git commit -m "Ajout de fonctionnalité"` |
| `git status` | Afficher l'état du répertoire | `git status` |
| `git diff` | Comparer répertoire et index | `git diff` |
| `git diff --staged` | Comparer index et dépôt | `git diff --staged` |
| `git log` | Afficher l'historique | `git log` |
| `git rm <fichier>` | Supprimer et arrêter le suivi | `git rm old.py` |
| `git checkout -- <fichier>` | Restaurer un fichier | `git checkout -- file.py` |
| `git reset HEAD <fichier>` | Retirer de l'index | `git reset HEAD staged.py` |

### Points clés à retenir

L'architecture ternaire de Git (répertoire de travail, index, dépôt) constitue le fondement de tout travail avec Git.[1][2][3] La compréhension des trois zones et du cycle de vie des fichiers permet une gestion précise des modifications. Le `.gitignore` élimine l'ajout accidentel de fichiers non souhaités. Les commandes `git diff`, `git status` et `git log` offrent une visibilité complète sur l'état du projet. Enfin, la suppression de fichiers suit les mêmes principes : toute modification doit être explicitement ajoutée et commise pour devenir permanente dans l'historique Git.
