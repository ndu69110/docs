# Citations
- https://graphite.com/guides/git-blame
- https://dev.to/ruqaiya_beguwala/day-730-git-blame-l-see-who-changed-a-specific-line-in-a-file-3lmm
- https://www.cloudbees.com/blog/git-blame-explained
- https://git-scm.com/docs/git-blame
- https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-blame
- https://www.kosli.com/blog/the-ultimate-guide-to-git-blame-a-how-to-with-examples/
- https://git-scm.com/docs/git-log


# Tokens
- prompt_tokens: 272
- completion_tokens: 6593
- total_tokens: 6865
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.099, 'request_cost': 0.006, 'total_cost': 0.106}


# Content
# Chapitre 3 : Inspecter un répertoire et des fichiers

## 🎯 Introduction

L'inspection d'un répertoire Git et de ses fichiers constitue une compétence fondamentale pour tout développeur travaillant avec le contrôle de version. Ce chapitre détaille les outils et techniques permettant de comprendre l'historique des modifications, d'identifier les auteurs de chaque ligne de code et d'utiliser les interfaces visuelles modernes pour explorer le dépôt. L'apprentissage progresse de manière logique : d'abord les commandes en ligne de commande, puis les outils visuels intégrés dans les éditeurs de code.

---

## 📜 Visualiser l'historique d'un projet Git avec git log

### Comprendre git log

La commande `git log` représente l'un des outils les plus puissants pour examiner l'historique d'un projet. Elle affiche l'ensemble des commits enregistrés dans le dépôt, en commençant par le plus récent. Chaque commit contient des informations précieuses : un identifiant unique (hash), l'auteur, la date, et le message descriptif de la modification.

### Syntaxe fondamentale

```bash
git log
```

Cette commande basique affiche tous les commits avec les détails complets : hash du commit, auteur, date et heure, ainsi que le message associé. La sortie s'affiche dans un paginateur, permettant de naviguer avec les touches directionnelles ou de quitter avec la touche 'q'.

### Formats de sortie personnalisés

#### Affichage sur une seule ligne

```bash
git log --oneline
```

Ce format condense chaque commit sur une seule ligne, affichant les sept premiers caractères du hash suivi du message du commit. Cette représentation facilite la visualisation rapide de l'historique, particulièrement utile pour les projets comportant de nombreux commits.

**Exemple de sortie :**
```
a1b2c3d (HEAD -> main) Ajout de la fonctionnalité de connexion
e4f5g6h Correction du bug d'authentification
i7j8k9l Refactorisation de la structure du projet
m0n1o2p Documentation initiale
```

#### Format personnalisé avec --format

```bash
git log --format="%h - %an, %ar : %s"
```

Ce format affiche le hash court, le nom de l'auteur, la date relative et le sujet du commit. Les codes disponibles incluent :

- `%h` : hash court du commit
- `%an` : nom de l'auteur
- `%ae` : email de l'auteur
- `%ar` : date relative
- `%ai` : date au format ISO
- `%s` : sujet du commit
- `%b` : corps du message

#### Représentation graphique avec --graph

```bash
git log --oneline --graph --all --decorate
```

Cette commande affiche l'historique sous forme d'arborescence, particulièrement utile pour visualiser les branches et les fusions. Le paramètre `--all` inclut toutes les branches, tandis que `--decorate` ajoute les noms des branches et des tags.

**Exemple de sortie :**
```
* a1b2c3d (HEAD -> main) Fusion de la branche feature/auth
|\
| * e4f5g6h (feature/auth) Ajout du système d'authentification
| * i7j8k9l Création du module de validation
|/
* m0n1o2p Initialisation du projet
```

### Filtrer l'historique

#### Par plage de dates

```bash
git log --after="2025-01-01" --before="2025-12-31"
```

Cette syntaxe limite l'affichage aux commits créés dans la période spécifiée. Plusieurs formats de date sont acceptés : "2025-01-01", "january 1 2025", "1 january 2025", etc.

#### Par auteur

```bash
git log --author="Alice"
```

Affiche uniquement les commits réalisés par l'auteur spécifié. La recherche utilise des expressions régulières, permettant des requêtes plus complexes :

```bash
git log --author="Alice\|Bob"
```

Cette commande affiche les commits de deux auteurs différents.

#### Par message de commit

```bash
git log --grep="bug"
```

Recherche dans les messages des commits pour trouver ceux contenant le terme spécifié. L'option `--grep` accepte également les expressions régulières :

```bash
git log --grep="^Correction" --grep="authentification"
```

#### Par contenu modifié

```bash
git log -S "fonction_specifique"
```

Affiche les commits qui ont ajouté ou supprimé les lignes contenant "fonction_specifique". Cette technique s'avère extrêmement utile pour tracer l'évolution d'une partie de code spécifique.

#### Par fichier spécifique

```bash
git log -- src/auth.js
```

Affiche uniquement les commits ayant modifié le fichier spécifié. L'option `--` indique que les paramètres suivants sont des chemins de fichier, non des références de commit.

### Statistiques et analyse

#### Affichage des statistiques de modification

```bash
git log --stat
```

Ajoute une statistique à chaque commit, indiquant le nombre de lignes ajoutées et supprimées par fichier modifié.

**Exemple de sortie :**
```
commit a1b2c3d
Author: Alice <alice@example.com>
Date:   Wed Dec 03 2025 10:30:00

    Ajout du module de validation

 src/validators.js | 45 ++++++++++++++++++++++
 tests/validators.test.js | 30 ++++++++++++++
 2 files changed, 75 insertions(+)
```

#### Affichage détaillé des modifications

```bash
git log -p
```

Affiche non seulement les métadonnées du commit, mais également les différences (patch) introduites par chaque commit. Cette option s'avère particulièrement précieuse pour comprendre exactement quels changements ont été apportés.

#### Compter les commits par auteur

```bash
git log --shortstat --format="%an" | grep -E "^[a-zA-Z]" | sort | uniq -c | sort -rn
```

Cette commande combine plusieurs utilitaires pour compter le nombre de commits par auteur, révélant la contribution relative de chaque membre de l'équipe.

### Cas d'usage pratiques

#### Examiner les commits d'une branche

```bash
git log main..feature/nouvelle-fonction
```

Affiche les commits présents dans `feature/nouvelle-fonction` mais absents de `main`. Cette comparaison s'avère utile avant de fusionner une branche.

#### Afficher les commits en ordre inverse

```bash
git log --reverse
```

Commence par les commits les plus anciens et progresse vers les plus récents, offrant une perspective historique du développement du projet.

#### Limiter le nombre de commits affichés

```bash
git log -n 10
```

Affiche uniquement les 10 commits les plus récents, réduisant la charge cognitive lors de l'exploration de l'historique.

---

## 🔍 Visualiser l'historique d'un fichier avec git blame

### Concept fondamental de git blame

La commande `git blame` offre une perspective entièrement différente sur l'historique Git. Plutôt que d'afficher les commits chronologiquement, elle **annote chaque ligne d'un fichier** avec l'information du dernier commit qui l'a modifiée. Cette technique s'avère invaluable pour comprendre pourquoi une ligne de code existe, qui l'a écrite et quand.[1][3]

### Syntaxe de base

```bash
git blame nom_fichier
```

Cette commande affiche le fichier ligne par ligne, avec pour chaque ligne : le hash du commit (partiellement affiché), l'auteur, la date et l'heure de modification, suivis du contenu de la ligne.[1]

**Exemple de sortie :**
```
6f5b4d3d (Alice 2024-12-10 10:32:14 -0800) def fetch_data():
74e2c4e9 (Bob 2024-12-11 14:01:02 -0800)     return api.get_data()
a3c8d2e1 (Alice 2024-12-12 09:15:45 -0800)     except Exception as e:
```

### Cibler une plage de lignes spécifique

#### Syntaxe avec l'option -L

L'option `-L` permet de limiter l'analyse à une plage précise de lignes, optimisant le temps de traitement et la lisibilité.[2][4]

```bash
git blame -L 10,20 nom_fichier
```

Cette commande affiche uniquement les lignes 10 à 20, inclusivement.

#### Variantes de la plage

```bash
git blame -L 10,+5 nom_fichier
```

Cette syntaxe affiche 5 lignes à partir de la ligne 10 (lignes 10 à 14).

```bash
git blame -L 20, nom_fichier
```

Affiche de la ligne 20 jusqu'à la fin du fichier.

#### Exemple pratique concret

Pour analyser les modifications apportées aux lignes 45 à 50 du fichier `server/routes.js` :[2]

```bash
git blame -L 45,50 server/routes.js
```

**Sortie attendue :**
```
b5c8d9f1 (Dev Team     2023-05-15 10:20:30 +0100 45) router.post('/users', addNewUser);
c3d4e5f6 (Senior Dev   2021-11-30 08:45:12 -0500 46) router.get('/users/:id', getUser);
b5c8d9f1 (Dev Team     2023-05-15 10:20:30 +0100 47) router.put('/users/:id', updateUser);
d7e8f9a0 (Maintenance  2024-01-20 14:22:18 +0200 48) router.delete('/users/:id', deleteUser);
```

### Formats et options avancées

#### Format relatif des dates

```bash
git blame --date=relative nom_fichier
```

Affiche les dates sous forme relative (par exemple "2 weeks ago", "3 days ago"), facilitant la compréhension du délai écoulé.[1]

**Exemple de sortie :**
```
6f5b4d3d (Alice 2 weeks ago)    def fetch_data():
74e2c4e9 (Bob 3 days ago)       return api.get_data()
a3c8d2e1 (Alice 1 day ago)      except Exception as e:
```

#### Format porcelain

```bash
git blame --porcelain -L 5,10 README.md
```

Le format porcelain produit une sortie structurée optimisée pour la parsing par d'autres programmes, plutôt que pour la lecture humaine.[2]

#### Suivi du code déplacé avec -C

```bash
git blame -C -L 15,20 main.py
```

L'option `-C` détecte lorsqu'une ligne de code a été **copiée ou déplacée** d'un autre fichier, retraçant l'origine réelle du code.[2]

#### Ignorer les changements de format avec -w

```bash
git blame -w -L 10,15 styles.css
```

L'option `-w` ignore les modifications mineures d'espacement blanc, concentrant l'attention sur les vrais changements de contenu.[2]

### Cas d'usage d'investigation avancés

#### Localiser quand une fonction a disparu

Le flux de travail suivant combine `git grep`, `git blame` et `git log` pour tracer la disparition d'une fonction :[2]

```bash
# Étape 1 : Localiser où la fonction se trouvait
git grep -n "validateAuthToken"
# Sortie : src/auth.js:30: validateAuthToken(token);

# Étape 2 : Vérifier le dernier commit qui a touché cette ligne
git blame -L 30,30 src/auth.js
# Sortie : ^a1b2c3d (Security Team 2023-01-10 09:00:00 +0000 30) validateAuthToken(token);

# Étape 3 : Afficher tous les commits ayant modifié cette ligne
git log -L 30,30:src/auth.js
```

#### Tracer l'introduction d'une nouvelle route

Pour identifier quand et par qui une route API a été ajoutée :[2]

```bash
# Trouver la ligne contenant la nouvelle route
grep -n "addNewUser" server/routes.js
# Sortie : 45:router.post('/users', addNewUser);

# Voir quand elle a été introduite
git blame -L 45,45 server/routes.js
# Sortie : b5c8d9f1 (Dev Team 2023-05-15 10:20:30 +0100 45) router.post('/users', addNewUser);

# Inspecter le commit pour obtenir plus de contexte
git show b5c8d9f1
```

#### Analyser l'historique d'un test

Pour comprendre l'évolution d'un test spécifique :[2]

```bash
# Localiser le test dans le fichier
grep -n "shouldHandleConcurrentRequests" tests/api.test.js
# Sortie : 112: it('shouldHandleConcurrentRequests', async () => {

# Vérifier quand il a été modifié pour la dernière fois
git blame -L 112,112 tests/api.test.js
# Sortie : c3d4e5f6 (Senior Dev 2021-11-30 08:45:12 -0500 112) it('shouldHandleConcurrentRequests', async () => {
```

### Consulter git blame à un commit spécifique

```bash
git blame abc123 -L 25,30 app.js
```

Affiche le blame du fichier `app.js` tel qu'il était au moment du commit `abc123`, permettant d'explorer l'historique à différents points dans le temps.[2]

### Différences entre git blame et git log

| Aspect | git log | git blame |
|--------|---------|----------|
| **Perspective** | Chronologique, par commit | Par ligne, dans le contexte du fichier |
| **Cas d'usage** | Comprendre l'historique global | Comprendre l'origine d'une ligne spécifique |
| **Résolution** | Au niveau du commit entier | Au niveau de la ligne individuelle |
| **Recherche** | Par date, auteur, message | Par numéro de ligne, fichier spécifique |
| **Performance** | Rapide sur l'ensemble du dépôt | Plus rapide sur un fichier spécifique |

---

## 🎨 L'onglet Source Control de VS Code

### Intégration native de Git dans VS Code

Visual Studio Code offre une intégration complète de Git directement dans l'interface utilisateur, sans nécessiter l'installation de dépendances supplémentaires. L'onglet Source Control, accessible via la barre latérale, centralise toutes les opérations Git courantes.

### Accéder à l'onglet Source Control

L'onglet Source Control apparaît dans la barre latérale gauche, identifiable par l'icône de branche (ressemblant à un Y). Pour y accéder :

1. Cliquer sur l'icône de branche dans la barre latérale gauche
2. Utiliser le raccourci clavier `Ctrl+Shift+G` (Windows/Linux) ou `Cmd+Shift+G` (macOS)

### Structure de l'interface

L'onglet Source Control organise les fichiers en plusieurs sections :

#### Changes (Modifications non mises en scène)

Cette section affiche tous les fichiers modifiés mais non encore ajoutés à l'index. Les icônes à côté de chaque fichier indiquent le type de modification :

- **M** (jaune) : Fichier modifié
- **A** (vert) : Fichier ajouté
- **D** (rouge) : Fichier supprimé
- **?** (blanc) : Fichier non suivi

Cliquer sur un fichier dans cette section ouvre un diff visual, affichant les modifications ligne par ligne. Le diff utilise des couleurs pour identifier facilement les ajouts (vert) et les suppressions (rouge).

#### Staged Changes (Modifications mises en scène)

Après avoir mis en scène des modifications avec `git add`, celles-ci apparaissent dans cette section. Les fichiers ici sont prêts à être validés.

### Opérations courantes

#### Ajouter des fichiers à l'index

Plusieurs approches existent :

- **Ajouter un fichier spécifique** : Cliquer sur le symbole '+' à côté du nom du fichier dans la section Changes
- **Ajouter tous les fichiers** : Cliquer sur le symbole '+' au-dessus de la section Changes
- **Retirer de l'index** : Cliquer sur le symbole '-' à côté d'un fichier dans Staged Changes

#### Créer un commit

Un champ de texte en haut de l'onglet permet de saisir le message du commit. Après avoir écrit le message et misé en scène les fichiers désirés :

1. Saisir le message dans le champ prévu
2. Appuyer sur `Ctrl+Entrée` (ou cliquer le bouton de validation)
3. Le commit est créé et l'index est réinitialisé

### Visualiser l'historique

#### Timeline (Chronologie)

VS Code affiche une chronologie des commits dans l'explorateur de fichiers. Cliquer sur un commit dans cette timeline affiche les modifications introduites par ce commit spécifique.

#### Afficher les commits avec Ctrl+K Ctrl+0

Combinaison de touches qui ouvre la vue de l'historique avec les commits et les branches.

### Intégration avec les branches

L'onglet Source Control affiche la branche courante à côté du nom du dépôt. Cliquer sur le nom de la branche ouvre une palette de commandes permettant de :

- Créer une nouvelle branche
- Basculer vers une branche existante
- Supprimer une branche
- Fusionner une branche

### Conflits de fusion

Lors d'une fusion générant des conflits, VS Code les signale visuellement dans l'onglet Source Control. Des boutons permettent de résoudre automatiquement les conflits en acceptant les changements actuels, les changements entrants, ou une combinaison des deux.

---

## 🔌 L'extension GitLens

### Vue d'ensemble de GitLens

GitLens, développée par Eric Amodio, enrichit considérablement les capacités Git intégrées de VS Code. Cette extension superpose des informations contextuelles directement sur le code, révélant l'auteur, la date et le message du commit pour chaque ligne.[5]

### Installation et activation

GitLens s'installe comme n'importe quelle extension VS Code :

1. Ouvrir la palette de commandes avec `Ctrl+Shift+P`
2. Taper "Extensions : Install Extensions"
3. Chercher "GitLens"
4. Cliquer le bouton d'installation à côté de "GitLens — Git supercharged"
5. Recharger VS Code après l'installation

### Fonctionnalités principales

#### Git Blame - Annotation des lignes

La fonctionnalité la plus visible de GitLens est l'affichage du blame en temps réel. Pour chaque ligne de code, une annotation discrète apparaît affichant :

- Le hash court du commit
- L'auteur
- La date relative (par exemple "2 weeks ago")
- Le message du commit

**Exemple d'annotation :**
```
a1b2c3d (Alice, 2 weeks ago): def fetch_data():
```

#### Lens de code (Code Lens)

Au-dessus de chaque fonction et classe, GitLens affiche une ligne supplémentaire (Code Lens) indiquant le nombre de modifications récentes, avec la possibilité de cliquer pour explorer l'historique.

**Exemple :**
```
📝 3 contributors, last change by Bob (1 day ago)
def calculate_total(items):
```

#### Commandes intégrées

GitLens ajoute plusieurs commandes accessibles en cliquant sur le code ou via la palette de commandes :

- **View Blame** : Affiche le blame du fichier courant
- **Toggle Blame** : Active/désactive l'affichage du blame
- **Show Commit Details** : Affiche les détails complets du commit
- **Copy Commit Hash** : Copie le hash du commit
- **Open Commit in Remote** : Ouvre le commit sur la plateforme distante (GitHub, GitLab, etc.)

### Navigation et exploration

#### Explorer des branches

L'arborescence des branches dans la barre latérale permet de visualiser rapidement :

- La branche courante
- Les branches locales
- Les branches distantes
- Les tags

Cliquer sur une branche la rend courante, tandis qu'un clic droit ouvre un menu contextuel permettant de renommer, supprimer ou créer des branches.

#### Historique des fichiers

L'onglet "File History" de GitLens affiche chronologiquement tous les commits ayant modifié le fichier courant, avec pour chacun :

- Le hash du commit
- L'auteur
- La date
- Le message

#### Historique des lignes

En positionnant le curseur sur une ligne, puis en utilisant la commande "GitLens: View File Revision from Line", l'historique complet de cette ligne s'affiche, révélant toutes les modifications qu'elle a subies.

### Comparaison visuelle avancée

#### Diff pour chaque commit

En cliquant sur un commit dans l'historique, GitLens affiche le diff complet introduit par ce commit. Les additions sont mises en évidence en vert, les suppressions en rouge.

#### Blame différentiel

GitLens peut comparer le blame entre deux commits, révélant exactement ce qui a changé entre deux points du temps.

### Intégration avec les plateformes distantes

GitLens reconnaît automatiquement la plateforme de destination (GitHub, GitLab, Bitbucket, etc.) et propose des commandes spécifiques :

- **View on Remote** : Ouvre le fichier sur la plateforme distante
- **Copy Remote URL** : Copie le lien vers le fichier distant
- **Open Blame on Remote** : Ouvre la vue blame sur la plateforme distante

### Configuration et personnalisation

#### Fichier settings.json

Les préférences de GitLens se configurent dans `settings.json` :

```json
{
  "gitlens.blame.toggleMode": "file",
  "gitlens.codeLens.enabled": true,
  "gitlens.codeLens.recentChange.enabled": true,
  "gitlens.currentLine.enabled": false,
  "gitlens.hovers.enabled": true,
  "gitlens.statusBar.enabled": true
}
```

#### Options de visibilité

- `toggleMode` : "inline" (direct sur le code), "file" (pour tout le fichier) ou "window" (pour la fenêtre)
- `enabled` : Chaque type d'information peut être activé/désactivé indépendamment
- `format` : Personnaliser le format d'affichage des annotations

### Commandes clés

| Commande | Action |
|----------|--------|
| `GitLens: Show File Blame` | Affiche le blame du fichier entier |
| `GitLens: Toggle File Blame` | Active/désactive l'affichage du blame |
| `GitLens: Show Commit Details` | Affiche les détails du commit courant |
| `GitLens: Show File History` | Affiche l'historique complet du fichier |
| `GitLens: View File Revision from Line` | Affiche l'historique d'une ligne spécifique |
| `GitLens: Copy Remote URL` | Copie le lien vers le fichier distant |

---

## 📊 Synthèse comparative des outils

| Outil | Cas d'usage principal | Avantages | Limitations |
|------|----------------------|-----------|------------|
| **git log** | Historique global du projet | Flexible, puissant en CLI, idéal pour scripts | Nécessite connaissance des options |
| **git blame** | Tracer l'origine de chaque ligne | Précision ligne par ligne, détails auteur/date | Moins intuitif sans interface visuelle |
| **VS Code Source Control** | Gestion quotidienne des commits | Intégration native, simple, pas d'extension | Fonctionnalités limitées comparé à GitLens |
| **GitLens** | Exploration détaillée du code | Annotations contextuelles, navigation riche | Peut surcharger l'interface |

---

## 🎓 Progression d'apprentissage recommandée

### Phase 1 : Fondamentaux (Semaine 1)

L'apprentissage commence par les commandes en ligne de commande, fondement de toute maîtrise de Git. Cette phase établit la compréhension conceptuelle nécessaire.

**Objectifs :**
- Exécuter `git log` dans diverses configurations
- Comprendre le format de sortie et les métadonnées
- Filtrer par auteur, date et message

**Exercices pratiques :**
1. Explorer le historique d'un dépôt existant avec différentes options
2. Identifier les commits d'un auteur spécifique
3. Utiliser le format graphique pour visualiser les branches

### Phase 2 : Analyse détaillée (Semaine 2)

La deuxième phase approfondit la compréhension avec `git blame`, permettant une inspection au niveau de la ligne.

**Objectifs :**
- Utiliser `git blame` pour tracer l'origine de code
- Combiner `git blame` avec d'autres commandes (grep, log)
- Interpréter les résultats pour comprendre les décisions de codage

**Exercices pratiques :**
1. Localiser qui a écrit une fonction spécifique
2. Tracer les modifications apportées à une ligne au fil du temps
3. Identifier les patterns de contribution d'auteurs

### Phase 3 : Intégration visuelle (Semaine 3)

L'interface visuelle de VS Code consolidate les connaissances acquises, offrant une expérience plus intuitive.

**Objectifs :**
- Naviguer dans l'onglet Source Control
- Effectuer des commits via l'interface
- Comprendre le workflow visuel

**Exercices pratiques :**
1. Effectuer des commits réguliers via VS Code
2. Visualiser les modifications avant de les valider
3. Gérer les branches avec l'interface visuelle

### Phase 4 : Maîtrise avancée (Semaine 4)

GitLens transforme l'expérience en ajoutant des capacités contextuelles riches directement dans l'éditeur.

**Objectifs :**
- Utiliser GitLens pour explorer le code interactivement
- Naviguer vers les commits distants
- Configurer GitLens pour les préférences personnelles

**Exercices pratiques :**
1. Utiliser les annotations de GitLens pour comprendre le code
2. Accéder directement à GitHub/GitLab depuis l'éditeur
3. Paramétrer l'affichage selon les préférences de travail

### Intégration pratique

La compréhension complète s'acquiert en combinant les approches :

**Exemple de workflow réel :**

1. **Question initiale :** Pourquoi ce bug existe-t-il ?
2. **Git log :** `git log --grep="bug" --oneline` pour identifier les commits pertinents
3. **Git blame :** `git blame -L ligne_debut,ligne_fin fichier.js` pour tracer la ligne
4. **GitLens :** Cliquer sur l'annotation pour accéder aux détails du commit
5. **Diff visuel :** Examiner le changement dans VS Code
6. **Action :** Comprendre la décision et décider de corriger ou de documenter

---

## ✅ Points clés à retenir

L'inspection efficace d'un répertoire Git nécessite la maîtrise combinée de plusieurs outils, chacun offrant des perspectives complémentaires :

- **git log** fournit la vue globale, l'historique chronologique du projet
- **git blame** offre la précision, traçant l'origine exacte de chaque ligne
- **VS Code Source Control** facilite les opérations quotidiennes de manière intuitif
- **GitLens** enrichit l'expérience en contextualisant les informations directement dans le code

Cette progression logique, du conceptuel au pratique, du global au détaillé, établit une base solide pour une utilisation productive de Git dans un environnement de développement professionnel.
