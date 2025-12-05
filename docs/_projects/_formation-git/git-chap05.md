# Citations
- https://www.youtube.com/watch?v=iZ55m9ieSCo
- https://www.hostinger.com/fr/tutoriels/comment-utiliser-une-branche-git
- https://www.datacamp.com/fr/tutorial/git-branch
- https://www.varonis.com/fr/blog/git-branching
- https://git-scm.com/docs/git-branch/fr
- https://git-scm.com/book/fr/v2/Les-branches-avec-Git-Les-branches-en-bref
- https://lutece.paris.fr/support/wiki/git.html
- https://www.atlassian.com/fr/agile/software-development/branching
- https://git-scm.com/book/fr/v2/Les-branches-avec-Git-Branches-et-fusions%C2%A0:-les-bases


# Tokens
- prompt_tokens: 279
- completion_tokens: 5181
- total_tokens: 5460
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.078, 'request_cost': 0.006, 'total_cost': 0.085}


# Content
# Chapitre 5 : Les branches 🌳

## Introduction aux branches

Une branche dans Git représente une ligne de développement indépendante permettant de travailler sur des fonctionnalités, des correctifs ou des expériences sans affecter le code principal. Contrairement aux systèmes de contrôle de version plus anciens, les branches dans Git ne sont pas des dossiers séparés ni des copies complètes du code source[3]. Au lieu de cela, une branche Git n'est qu'un **pointeur léger vers un commit particulier**[3].

Lorsqu'un commit est créé, Git identifie cet instantané de fichiers avec un hachage SHA-1 unique. Lors de la création d'une branche, Git crée simplement un nouveau pointeur vers le même commit sur lequel la branche principale se trouve actuellement[4]. Cette architecture légère rend les branches extrêmement rapides et peu coûteuses à créer, les rendant essentielles aux flux de travail quotidiens[3].

### Pourquoi utiliser des branches ?

Les branches permettent :

- De développer des fonctionnalités en isolation sans perturber le code stable
- De corriger des bugs en parallèle du développement principal
- De collaborer efficacement en équipe sur différentes tâches
- De tester des idées nouvelles sans risque
- De maintenir plusieurs versions du projet simultanément

### La branche principale

La branche principale (appelée **main** ou **master**) n'a rien de spécial dans la structure technique de Git[4]. C'est simplement la première branche créée lorsqu'un référentiel Git est initialisé à l'aide de la commande `git init`[4]. Par convention, cette branche contient le code stable et prêt pour la production.

## Lister et créer des branches avec git branch

### Lister les branches existantes

Pour visualiser toutes les branches disponibles dans un projet Git, la commande suivante doit être exécutée[1][2] :

```bash
git branch
```

Cette commande affiche la liste des branches locales. Git utilise un astérisque (*) et une couleur différente pour identifier la branche active, représentant le pointeur HEAD indiquant quelle branche est actuellement active[4].

Exemple de résultat terminal :

```
  develop
* main
  feature-login
  bugfix-homepage
```

L'astérisque indique que la branche **main** est la branche courante sur laquelle se trouvent les modifications.

### Créer une nouvelle branche

La création d'une branche est un processus simple. Pour créer une branche, la commande `git branch` doit être utilisée suivie du nom de la branche[1][2][4] :

```bash
git branch nom-de-la-branche
```

**Exemple pratique :**

```bash
git branch feature-authentification
```

Cette commande crée une nouvelle branche nommée `feature-authentification` à partir du commit actuel. Cependant, cette opération ne bascule pas automatiquement vers la nouvelle branche[4]. La branche courante reste celle sur laquelle on se trouvait avant.

### Point important : Engagements préalables

Avant de créer des branches de développement, un commit doit d'abord être effectué sur la branche principale pour que Git comprenne la structure de base du projet[2]. Sans au moins un commit initial, Git génère une erreur lors de la tentative de créer une nouvelle branche.

Processus recommandé :

```bash
# 1. Initialiser le référentiel
git init

# 2. Ajouter et committer des fichiers
git add .
git commit -m "Commit initial"

# 3. Créer des branches
git branch feature-nouvelle-fonction
git branch bugfix-correctif
```

### Créer et basculer simultanément

La création d'une branche peut être combinée avec le basculement vers celle-ci en une seule commande. Dans les versions récentes de Git, la méthode recommandée est[3] :

```bash
git switch -c nom-de-la-branche
```

Dans les versions plus anciennes de Git, la commande suivante était utilisée :

```bash
git checkout -b nom-de-la-branche
```

**Exemple pratique :**

```bash
git switch -c feature-paiement
```

Cette opération crée la branche et y bascule immédiatement, permettant de commencer à travailler sans commandes supplémentaires.

### Créer une branche à partir d'une autre branche

Pour créer une branche à partir d'une autre branche (et non de la branche principale), il suffit de spécifier le nom de l'autre branche comme point de départ[4] :

```bash
git checkout -b feature4 develop
```

ou avec la syntaxe moderne :

```bash
git switch -c feature4 develop
```

Cet exemple crée une branche **feature4** basée sur la branche **develop**. Cette approche est particulièrement utile pour les branches dédiées aux correctifs de logiciel ou aux fonctionnalités construites sur d'autres branches.

## Basculer entre les branches avec git checkout

### Comprendre le basculement de branche

Une fois plusieurs branches créées, le basculement entre elles devient une opération courante. Git rend ce processus transparent et offre plusieurs façons de l'accomplir[3].

### Basculer vers une branche existante

Pour se déplacer vers une branche donnée, la commande `git checkout` suivie du nom de la branche doit être utilisée[1] :

```bash
git checkout nom-de-la-branche
```

**Exemple pratique :**

```bash
git checkout develop
```

Cette commande bascule vers la branche **develop**. Le répertoire de travail se met à jour pour refléter l'état du code sur cette branche.

### Vérifier la branche courante

Pour connaître la branche active, la commande suivante peut être exécutée[1] :

```bash
git status
```

La première ligne de la sortie indique la branche courante :

```
On branch main
```

### Basculer et créer en un seul geste

Comme mentionné précédemment, la création et le basculement peuvent être combinés[1][3] :

```bash
git checkout -b nom-de-la-branche
```

ou avec la nouvelle syntaxe :

```bash
git switch -c nom-de-la-branche
```

### Différences entre checkout et switch

| Opération | `git checkout` | `git switch` |
|-----------|---|---|
| **Syntaxe moderne** | Ancienne approche | Recommandée |
| **Basculer vers une branche** | `git checkout branche` | `git switch branche` |
| **Créer et basculer** | `git checkout -b branche` | `git switch -c branche` |
| **Clarté du but** | Multi-usage (défait aussi les fichiers) | Dédiée au basculement |

La commande `git switch` est plus intuitive car elle a un objectif unique : basculer entre les branches[3].

## Fusionner des branches avec git merge

### Concept de fusion

La fusion (merge) est le processus qui combine les modifications de deux branches en une seule[1]. Après avoir terminé le travail sur une branche de fonctionnalité ou de correctif, ces changements doivent être intégrés dans une autre branche, généralement la branche principale[3].

### Effectuer une fusion simple

Pour fusionner une branche dans la branche courante, la commande `git merge` doit être utilisée suivie du nom de la branche à fusionner[1] :

```bash
git merge nom-de-la-branche-a-fusionner
```

**Exemple pratique complet :**

```bash
# 1. Vérifier que l'on est sur la branche de destination
git checkout main

# 2. Fusionner la branche feature
git merge feature-authentification
```

Cette séquence récupère tous les commits de la branche **feature-authentification** et les applique à la branche **main**.

### Cas de fusion simple (Fast-forward)

Lorsque la branche cible n'a pas avancé depuis la création de la branche à fusionner, Git effectue une fusion **fast-forward**. Dans ce cas, le pointeur de la branche est simplement déplacé vers le commit de la branche fusionnée[9].

```bash
git merge feature-simple
```

### Fusion avec commits multiples (merge commit)

Lorsque les deux branches ont divergé (c'est-à-dire que la branche principale a reçu de nouveaux commits depuis la création de la branche à fusionner), Git crée un **commit de fusion** combinant les modifications des deux branches[9].

```bash
git merge feature-complexe
```

Git crée automatiquement un commit avec un message de fusion par défaut. Ce commit de fusion a deux parents : le dernier commit de chaque branche.

## Résoudre des conflits de fusion

### Qu'est-ce qu'un conflit de fusion ?

Un conflit de fusion survient lorsque Git ne peut pas fusionner automatiquement deux branches parce que les mêmes lignes de code ont été modifiées différemment dans chaque branche. Git doit alors être informé des modifications à conserver[9].

### Identifier les conflits

Lors d'une tentative de fusion, si un conflit existe, Git affiche un message :

```
Auto-merging fichier.js
CONFLICT (content): Merge conflict in fichier.js
Automatic merge failed; fix conflicts and then commit the result.
```

Pour voir les fichiers en conflit :

```bash
git status
```

Résultat :

```
On branch main
You have unmerged paths.
  (use "git add/rm <file>..." as appropriate to mark resolution)
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark as resolved)
	both modified:   app.js
```

### Résoudre les conflits manuellement

Les fichiers en conflit contiennent des **marqueurs de conflit** indiquant les sections conflictuelles :

```javascript
function login(username, password) {
<<<<<<< HEAD
  // Approche de la branche principale
  return validateWithDatabase(username, password);
=======
  // Approche de la branche feature
  return validateWithAPI(username, password);
>>>>>>> feature-authentification
}
```

Les marqueurs signifient :

- `<<<<<<< HEAD` : Début de la version de la branche courante
- `=======` : Séparateur entre les deux versions
- `>>>>>>> nom-de-branche` : Fin de la version de la branche fusionnée

### Stratégies de résolution

**Stratégie 1 : Conserver la version de la branche courante**

```javascript
function login(username, password) {
  return validateWithDatabase(username, password);
}
```

Puis committer :

```bash
git add app.js
git commit -m "Résout le conflit: utilise la validation base de données"
```

**Stratégie 2 : Conserver la version fusionnée**

```javascript
function login(username, password) {
  return validateWithAPI(username, password);
}
```

**Stratégie 3 : Combiner les deux approches**

```javascript
function login(username, password) {
  const dbValidation = validateWithDatabase(username, password);
  const apiValidation = validateWithAPI(username, password);
  return dbValidation && apiValidation;
}
```

### Aborter une fusion

Si la résolution de conflits devient trop complexe, la fusion peut être annulée :

```bash
git merge --abort
```

Cette commande ramène le référentiel à l'état avant la tentative de fusion.

### Utiliser des outils visuels

Pour les conflits complexes, les éditeurs modernes et les outils Git offrent des interfaces visuelles pour résoudre les conflits plus facilement.

## Visualiser les branches

### Afficher l'historique avec branches

Pour visualiser l'historique des commits et comment les branches divergent, la commande suivante est utile :

```bash
git log --oneline --graph --all
```

Résultat typique :

```
*   3f7a9c2 (main) Merge branch 'feature-paiement'
|\
| * 2e8b1d4 (feature-paiement) Ajoute intégration Stripe
| * 1c9a0e3 Prépare module paiement
* | 4k2m8p1 Corrige bug authentification
|/
* 7j9l3k2 Commit initial
```

Ce graphique montre visuellement comment les branches se sont créées, développées et fusionnées.

### Voir les branches et leurs commits

Pour voir les branches avec les informations de commit :

```bash
git branch -v
```

Résultat :

```
  develop              2e8b1d4 Merge branch 'feature-api'
* main                 3f7a9c2 Merge branch 'feature-paiement'
  feature-api          5x6y7z8 Ajoute endpoints REST
  hotfix-security      8a9b0c1 Corrige faille sécurité
```

### Afficher les branches de suivi distant

Pour voir à la fois les branches locales et distantes :

```bash
git branch -a
```

Résultat :

```
  develop
* main
  feature-login
  remotes/origin/main
  remotes/origin/develop
  remotes/origin/feature-api
```

Les branches précédées de `remotes/` sont les branches sur le serveur distant (comme GitHub).

## Supprimer des branches

### Supprimer une branche fusionnée

Une fois qu'une branche a été fusionnée, elle peut être supprimée pour maintenir la propreté du référentiel[1] :

```bash
git branch -d nom-de-la-branche
```

**Exemple :**

```bash
git branch -d feature-authentification
```

Cette commande supprime seulement les branches qui ont été complètement fusionnées.

### Forcer la suppression d'une branche

Si une branche n'a pas été fusionnée mais doit être supprimée, l'option `-D` doit être utilisée[1] :

```bash
git branch -D nom-de-la-branche
```

**Exemple :**

```bash
git branch -D branche-experimentale
```

Cette commande supprime la branche sans vérification, à utiliser avec prudence car les commits non fusionnés seront orphelins.

## Remiser ses changements avec git stash

### Concept de stash

Git stash permet de **mettre de côté temporairement les modifications non commitées** pour nettoyer l'espace de travail sans perdre le travail[1]. Cela s'avère utile lors d'un basculement urgent vers une autre branche pour corriger un bug critique.

### Remiser les changements actuels

Pour remiser les modifications actuelles :

```bash
git stash
```

Le répertoire de travail revient à l'état du dernier commit, et les modifications sont stockées temporairement.

### Remiser avec un message descriptif

Pour faciliter l'identification ultérieure :

```bash
git stash save "Description du travail en cours"
```

ou avec la syntaxe moderne :

```bash
git stash push -m "Description du travail en cours"
```

### Lister les stashs

Pour voir tous les stashs enregistrés :

```bash
git stash list
```

Résultat :

```
stash@{0}: WIP on feature-paiement: 2e8b1d4 Ajoute intégration Stripe
stash@{1}: WIP on develop: 4k2m8p1 Corrige bug authentification
stash@{2}: WIP on main: 7j9l3k2 Commit initial
```

### Récupérer un stash

Pour appliquer à nouveau les modifications remisées :

```bash
git stash pop
```

Cette commande applique le stash le plus récent (stash@{0}) et le supprime de la liste.

Pour appliquer un stash spécifique sans le supprimer :

```bash
git stash apply stash@{1}
```

### Exemple pratique complet

Scénario : En travaillant sur une nouvelle fonctionnalité, un bug critique doit être corrigé immédiatement sur la branche principale.

```bash
# 1. Vérifier les modifications actuelles
git status
# On branch feature-paiement
# Changes not staged for commit:
#   modified:   app.js

# 2. Remiser les modifications
git stash push -m "WIP: intégration paiement en cours"

# 3. Vérifier que l'espace de travail est propre
git status
# On branch feature-paiement
# nothing to commit, working tree clean

# 4. Basculer vers main pour corriger le bug
git checkout main

# 5. Créer une branche de correctif
git checkout -b hotfix-bug-critique

# 6. Corriger et committer
# ... effectuer les modifications ...
git add .
git commit -m "Corrige bug critique"

# 7. Fusionner le correctif
git checkout main
git merge hotfix-bug-critique

# 8. Retourner à la branche de développement
git checkout feature-paiement

# 9. Récupérer les modifications remisées
git stash pop
```

Après `git stash pop`, les modifications enregistrées avant le basculement sont à nouveau présentes dans l'espace de travail.

### Nettoyer les stashs

Pour supprimer un stash spécifique :

```bash
git stash drop stash@{0}
```

Pour supprimer tous les stashs :

```bash
git stash clear
```

## Stratégies de branchement

### GitFlow

GitFlow est un modèle de branchement structuré qui introduit des rôles spécifiques pour différents types de branches[3] :

- **main** : Contient toujours du code prêt pour la production. Aucun commit direct n'est effectué sur cette branche.
- **develop** : Branche d'intégration pour les fonctionnalités. C'est la branche dans laquelle sont faits tous les développements[7].
- **feature/\*** : Branches temporaires pour les nouvelles fonctionnalités, créées à partir de `develop`.
- **release/\*** : Branches pour la préparation des versions.
- **hotfix/\*** : Branches pour les correctifs critiques en production.

### Workflow recommandé avec GitFlow

```bash
# 1. Commencer une nouvelle fonctionnalité
git checkout develop
git checkout -b feature/authentification-oauth

# 2. Développer et committer
git add .
git commit -m "Ajoute authentification OAuth"

# 3. Terminer la fonctionnalité
git checkout develop
git merge feature/authentification-oauth
git branch -d feature/authentification-oauth

# 4. Préparer une version
git checkout -b release/1.2.0 develop

# 5. Corriger les problèmes de version
git add .
git commit -m "Prépare version 1.2.0"

# 6. Terminer la version
git checkout main
git merge release/1.2.0
git tag -a v1.2.0 -m "Version 1.2.0"

# 7. Retourner à develop
git checkout develop
git merge release/1.2.0
git branch -d release/1.2.0
```

## Bonnes pratiques

### Nommage des branches

Adopter une convention cohérente pour nommer les branches facilite la collaboration :

- **feature/** pour les nouvelles fonctionnalités : `feature/login-page`
- **bugfix/** pour les correctifs : `bugfix/header-alignment`
- **hotfix/** pour les corrections critiques : `hotfix/security-patch`
- **docs/** pour la documentation : `docs/api-reference`
- **test/** pour les tests : `test/integration-tests`

### Commits atomiques

Chaque commit doit représenter une unité logique de travail. Les commits de petite taille facilitent les revues de code et la résolution de conflits.

### Messages de commit descriptifs

Les messages doivent être clairs et détailler le changement effectué :

```bash
# ✅ Bon
git commit -m "Ajoute validation de formulaire"

# ❌ Mauvais
git commit -m "Modifications"
```

### Maintenir les branches à jour

Avant de fusionner une branche, la maintenir à jour par rapport à la branche cible :

```bash
git fetch origin
git rebase origin/develop
```

Ou :

```bash
git pull origin develop
```

## Résumé du processus d'apprentissage

Le chemin d'apprentissage des branches dans Git suit une progression logique :

**Étape 1 : Comprendre le concept fondamental**

Comprendre qu'une branche est un simple pointeur vers un commit, et non une copie complète du code, est essentiel. Cette compréhension permet de saisir pourquoi les branches sont légères et rapides à créer.

**Étape 2 : Maîtriser les opérations de base**

Apprendre à lister les branches avec `git branch`, créer de nouvelles branches avec `git branch` ou `git switch -c`, et basculer entre elles avec `git checkout` ou `git switch` fournit les fondamentaux pour toute opération future.

**Étape 3 : Fusionner et résoudre les conflits**

Une fois à l'aise avec la création et le basculement, l'apprentissage de la fusion avec `git merge` et la résolution des conflits qui en découle prépare aux scénarios réels. Cette étape est critique car les conflits sont inévitables dans la collaboration.

**Étape 4 : Visualiser et gérer les branches**

Utiliser `git log --graph` et `git branch -v` pour visualiser la structure des branches aide à comprendre l'état du projet et à identifier les branches à supprimer ou fusionner.

**Étape 5 : Utiliser git stash pour la flexibilité**

Apprendre à remiser les changements permet de basculer rapidement entre les branches sans committer de travail incomplet, offrant une flexibilité essentielle pour les interruptions urgentes.

**Étape 6 : Implémenter une stratégie de branchement**

Enfin, adopter une stratégie cohérente comme GitFlow structure le flux de travail, facilite la collaboration en équipe et maintient le projet organisé à mesure qu'il grandit.

Chaque étape s'appuie sur les précédentes, créant une compréhension globale des branches dans Git et comment les utiliser efficacement dans un projet réel.
