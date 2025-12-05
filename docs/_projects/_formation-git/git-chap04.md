# Citations
- https://learn.microsoft.com/fr-fr/azure/devops/repos/git/undo?view=azure-devops
- https://www.tutkit.com/fr/tutoriels-texte/20151-git-revenir-sur-les-modifications-git-reset-et-git-checkout-expliques
- https://git-scm.com/book/fr/v2/Les-bases-de-Git-Annuler-des-actions
- https://www.nicelydev.com/git/tout-annuler-git
- https://labex.io/fr/tutorials/git-how-to-undo-git-commit-but-keep-changes-392512
- https://www.atlassian.com/fr/git/tutorials/undoing-changes/git-revert
- https://comprendre-git.com/fr/annuler-defaire-corriger/retirer-des-modifs-a-un-commit/
- https://www.datacamp.com/fr/tutorial/git-reset-revert-tutorial
- https://www.youtube.com/watch?v=UsCMD2CFobs


# Tokens
- prompt_tokens: 241
- completion_tokens: 6608
- total_tokens: 6849
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.099, 'request_cost': 0.006, 'total_cost': 0.106}


# Content
# Chapitre 4 : Annuler des modifications

## 📚 Introduction

La gestion des modifications dans Git est une compétence fondamentale pour tout développeur. Le système de contrôle de version Git offre plusieurs mécanismes permettant d'annuler, de corriger ou de modifier des changements à différents stades du workflow de développement. Ce chapitre explore en détail les commandes essentielles pour gérer les modifications indésirables et maintenir un historique de commits propre et fiable.

Les commandes présentées dans ce chapitre s'adressent à des situations variées : annuler des modifications non commitées, corriger un commit récent, supprimer des fichiers non versionnés, ou encore inverser les changements introduits par un commit ancien sans réécrire l'historique.

## 🧹 git clean

### Concept fondamental

`git clean` est une commande spécialisée dans la suppression des fichiers non suivis par Git. Contrairement à d'autres commandes qui modifient l'historique ou restaurent des fichiers déjà versionnés, `git clean` élimine uniquement les fichiers qui n'ont jamais été ajoutés à l'index Git.[1]

### Cas d'usage pratiques

Cette commande s'avère particulièrement utile dans les scénarios suivants :
- Nettoyer le répertoire de travail après la compilation de fichiers temporaires
- Supprimer les fichiers de configuration locaux qui ne doivent pas être versionnés
- Préparer l'espace de travail avant une opération fusion complexe
- Éliminer les fichiers de cache ou de log générés accidentellement

### Utilisation basique

Pour afficher un aperçu des fichiers qui seraient supprimés sans les effacer réellement :

```bash
git clean -n
```

L'option `-n` (ou `--dry-run`) exécute la commande en mode simulation, permettant de vérifier quels fichiers seraient supprimés avant toute action irréversible.

### Options avancées

Pour supprimer effectivement les fichiers non suivis :

```bash
git clean -f
```

L'option `-f` (ou `--force`) ordonne la suppression des fichiers identifiés.

Pour inclure les répertoires vides dans la suppression :

```bash
git clean -fd
```

L'option `-d` supprime également les répertoires vides qui ne contiennent que des fichiers non suivis.

Pour supprimer aussi les fichiers listés dans le fichier `.gitignore` :

```bash
git clean -fX
```

Pour supprimer tous les fichiers non suivis, y compris ceux ignorés :

```bash
git clean -fdx
```

### Exemple pratique complet

Considérant un répertoire contenant les fichiers suivants :

```
mon-projet/
├── index.js (suivi par Git)
├── package.json (suivi par Git)
├── node_modules/ (ignoré par .gitignore)
├── build/ (répertoire contenant des fichiers compilés)
└── temp.txt (non suivi)
```

**Étape 1 : Vérification préalable**

```bash
git clean -n
```

Résultat attendu :
```
Removing temp.txt
```

**Étape 2 : Exécution avec suppression des répertoires**

```bash
git clean -fd
```

Résultat : suppression de `temp.txt` et du répertoire `build/`.

**Étape 3 : Suppression incluant les fichiers ignorés**

Si l'intention est de nettoyer également les fichiers du `.gitignore` :

```bash
git clean -fdx
```

Cela supprimera également `node_modules/`.

### ⚠️ Considérations importantes

`git clean` constitue une opération **irréversible**. Les fichiers supprimés ne peuvent pas être récupérés via Git. Il est donc impératif d'utiliser systématiquement l'option `-n` avant d'appliquer une suppression effective.

---

## ↩️ git revert

### Concept fondamental

`git revert` est une commande d'annulation avant (forward-undo) qui crée un nouveau commit contenant les modifications inverses d'un commit spécifique, sans modifier l'historique existant.[1][6] Contrairement à `git reset`, `git revert` préserve l'historique complet et est considérée comme une approche plus sûre pour annuler les changements dans les branches partagées.[6]

### Avantages et contexte d'utilisation

**Avantages de `git revert` :**
- Préserve l'historique complet des commits
- Convient idéalement pour les commits déjà poussés sur des branches partagées
- Crée une trace visible des annulations
- Permet la collaboration sans risque de réécriture d'historique conflictuelle

**Contextes d'utilisation optimaux :**
- Annuler les changements d'un commit dans une branche de production
- Corriger une erreur commise par un autre développeur sans lui imposer une réécriture d'historique
- Maintenir une traçabilité complète de toutes les modifications

### Syntaxe de base

```bash
git revert <commit-id>
```

Où `<commit-id>` représente l'identifiant du commit dont les modifications doivent être inversées.

### Processus détaillé d'un revert

Lors de l'exécution de `git revert`, Git effectue les étapes suivantes :

1. Identifie les modifications introduites par le commit spécifié
2. Crée les modifications inverses (les changements qui annuleraient exactement ceux du commit original)
3. Ouvre un éditeur pour permettre la modification du message de commit
4. Crée un nouveau commit contenant ces modifications inverses

### Exemple pratique détaillé

Supposant l'historique de commits suivant :

```
commit 3d4e5f6 (HEAD -> main)
│   Message: Ajout de la fonctionnalité de paiement
│   Fichiers modifiés: payment.js, checkout.js

commit 2c3d4e5
│   Message: Correction de bugs de validation
│   Fichiers modifiés: validation.js

commit 1b2c3d4
│   Message: Configuration initiale
│   Fichiers modifiés: config.js
```

**Scénario : Il est découvert que la fonctionnalité de paiement introduit un bug critique en production.**

**Étape 1 : Exécution du revert**

```bash
git revert 3d4e5f6
```

**Étape 2 : Git ouvre l'éditeur par défaut**

Le message de commit prérempli apparaît :

```
Revert "Ajout de la fonctionnalité de paiement"

This reverts commit 3d4e5f6.
```

**Étape 3 : Acceptation ou modification du message**

Si le message par défaut convient, il suffit de sauvegarder et quitter l'éditeur (`:wq` dans vim).

**Étape 4 : Résultat de l'opération**

Un nouveau commit est créé :

```
commit 4e5f6a7 (HEAD -> main)
│   Message: Revert "Ajout de la fonctionnalité de paiement"
│   
commit 3d4e5f6
│   Message: Ajout de la fonctionnalité de paiement
│   
commit 2c3d4e5
│   Message: Correction de bugs de validation
```

Les fichiers `payment.js` et `checkout.js` sont revenus à leur état du commit `2c3d4e5`.

### Gestion des conflits lors d'un revert

Si les modifications à inverser entrent en conflit avec l'état actuel du code :

```bash
git revert <commit-id>
# Git signale des conflits de fusion
```

L'utilisateur doit alors :

1. Ouvrir les fichiers en conflit et résoudre manuellement les divergences
2. Ajouter les fichiers résolus à l'index :

```bash
git add <fichier-résolu>
```

3. Poursuivre l'opération de revert :

```bash
git revert --continue
```

Si l'opération devient trop complexe, il est possible d'abandonner :

```bash
git revert --abort
```

### Revert de plusieurs commits

Pour inverser les modifications de plusieurs commits consécutifs :

```bash
git revert --no-edit 3d4e5f6 2c3d4e5
```

L'option `--no-edit` supprime la demande d'édition du message de commit, utilisant le message par défaut généré par Git.

### Comparaison visuelle : État avant et après revert

| Aspect | Avant revert | Après revert |
|--------|-------------|-------------|
| Historique | Commit contenant le bug | Commit + commit d'annulation |
| État du code | Bug présent | Bug annulé |
| Fichiers modifiés | payment.js, checkout.js | payment.js, checkout.js (inversés) |
| Traçabilité | ❌ Aucune trace de l'annulation | ✅ Trace visible du revert |

---

## 🔄 git checkout

### Concept fondamental

`git checkout` est une commande polyvalente permettant de naviguer entre les branches et de restaurer les fichiers à un état antérieur.[1][2][3] Dans le contexte de l'annulation de modifications, elle s'utilise principalement pour abandonner les changements non commitées d'un fichier, le restaurant à sa dernière version validée.[2]

### Champs d'application

`git checkout` possède trois usages distincts :

**1. Changement de branche**
```bash
git checkout <nom-branche>
```

**2. Création et changement de branche**
```bash
git checkout -b <nom-nouvelle-branche>
```

**3. Restauration de fichiers (annulation de modifications)**
```bash
git checkout -- <fichier>
```

### Restauration de fichiers non commitées

La syntaxe complète pour annuler les modifications d'un fichier non encore committé est :

```bash
git checkout -- <nom-fichier>
```

Cette opération restaure instantanément le fichier à sa version dans le dernier commit, éliminant toutes les modifications locales non stagées.

### Exemple pratique détaillé

**Scénario initial :**

Un fichier `app.js` a été modifié mais non encore ajouté à l'index (staging area).

```javascript
// Contenu initial (dernier commit)
function helloWorld() {
  console.log("Hello");
}
```

**Les modifications effectuées :**

```javascript
// Modifications apportées mais non commitées
function helloWorld() {
  console.log("Hello World");
  console.log("This is wrong"); // Modification accidentelle
  return undefined; // Erreur logique
}
```

**Étape 1 : Vérification du statut**

```bash
git status
```

Sortie :
```
Sur la branche main

Modifications qui ne seront pas validées:
  (utilisez "git add <fichier>..." pour mettre à jour ce qui sera validé)
  (utilisez "git checkout -- <fichier>..." pour annuler les modifications dans la copie de travail)

  modifié : app.js
```

**Étape 2 : Annulation des modifications**

```bash
git checkout -- app.js
```

**Étape 3 : Vérification du résultat**

```bash
git status
```

Sortie :
```
Sur la branche main
Rien à valider, répertoire de travail propre
```

Le fichier `app.js` contient maintenant sa version originale :

```javascript
function helloWorld() {
  console.log("Hello");
}
```

### Restauration depuis un commit spécifique

Pour restaurer un fichier à partir d'un commit antérieur spécifique (pas seulement le dernier commit) :

```bash
git checkout <commit-id> -- <nom-fichier>
```

**Exemple concret :**

```bash
git checkout abc1234 -- config.js
```

Cette commande restaure `config.js` à son état tel qu'il existait dans le commit `abc1234`, et place cette version dans l'index et le répertoire de travail.

### Restauration multiple de fichiers

Pour annuler les modifications de plusieurs fichiers simultanément :

```bash
git checkout -- fichier1.js fichier2.js fichier3.js
```

Ou pour annuler tous les fichiers modifiés non stagés :

```bash
git checkout -- .
```

### ⚠️ Danger et irréversibilité

`git checkout` constitue une **opération destructive et irréversible** pour le fichier restauré. Une fois exécutée, les modifications locales non commitées sont perdues définitivement et ne peuvent pas être récupérées via Git. Il est recommandé de vérifier les modifications avant restauration :

```bash
git diff <nom-fichier>
```

### Transition vers les commandes modernes

Depuis Git 2.23, la commande `git restore` est l'approche privilégiée pour restaurer les fichiers :[3]

```bash
git restore <nom-fichier>
```

Bien que `git checkout` reste fonctionnelle, `git restore` offre une interface plus explicite et dédiée à cette opération.

---

## 🎯 Branche master et HEAD

### Concept de HEAD

**HEAD** est un pointeur spécial dans Git qui indique toujours le commit actuellement actif dans le répertoire de travail.[1] Il agit comme une référence mobile marquant le point actuel dans l'historique de commits, permettant à Git de savoir où se trouve l'utilisateur dans l'arborescence du projet.

### Structure conceptuelle

```
Historique de commits :

commit 4f5e6g7 (main)
├── commit 3d4e5f6
├── commit 2c3d4e5
└── commit 1b2c3d4 (branche initiale)

HEAD → pointe généralement vers le dernier commit de la branche active
```

### Branche master vs main

Historiquement, Git créait une branche par défaut nommée **master**. Depuis 2020, cette convention a changé, et la branche par défaut s'appelle désormais **main**. Cette modification reflète un choix dans le secteur technologique pour utiliser une terminologie plus inclusive.[1]

### Cas d'usage pratiques

**Situation 1 : Déterminer la position actuelle**

```bash
git log -1 --oneline
```

Affiche le commit vers lequel HEAD pointe actuellement.

Sortie exemple :
```
3d4e5f6 (HEAD -> main) Ajout de la fonctionnalité utilisateur
```

**Situation 2 : Détacher HEAD (detached HEAD state)**

Lorsqu'on bascule vers un commit spécifique plutôt qu'une branche :

```bash
git checkout abc1234
```

HEAD se détache alors de la branche et pointe directement le commit `abc1234`. Cet état permet d'explorer l'historique mais rend les commits futurs inaccessibles s'ils ne sont pas intégrés à une branche.

**Situation 3 : Retourner à la branche**

```bash
git checkout main
```

HEAD redevient une branche au lieu de pointer directement un commit.

### Références relatives à HEAD

Git permet d'utiliser des notations relatives pour référencer des commits par rapport à HEAD :

| Notation | Signification | Exemple |
|----------|---------------|---------|
| `HEAD` | Commit actuel | `git reset HEAD` |
| `HEAD^` | Commit parent direct | `git reset HEAD^` |
| `HEAD~1` | Commit parent (équivalent à HEAD^) | `git reset HEAD~1` |
| `HEAD~2` | Grand-parent du commit | `git reset HEAD~2` |
| `HEAD~n` | n commits avant HEAD | `git reset HEAD~5` |

### Représentation visuelle

```
Timeline des commits :

HEAD~3 : commit abc1234 (Initialisation du projet)
         ↓
HEAD~2 : commit bcd2345 (Premier feature)
         ↓
HEAD~1 : commit cde3456 (Correction bug)
         ↓
HEAD   : commit def4567 (Dernière modification)
```

### Vérification de la position de HEAD

```bash
cat .git/HEAD
```

Sortie si HEAD pointe vers une branche :
```
ref: refs/heads/main
```

Sortie si HEAD est détaché :
```
abc1234567890def
```

### Implication pour les opérations d'annulation

Les commandes `git reset` et `git checkout` utilisent extensively les concepts de HEAD et de branche. Comprendre ces mécanismes est essentiel pour :
- Annuler précisément les commits désirés
- Naviguer dans l'historique
- Récupérer des versions antérieures de fichiers

---

## 🔙 git reset

### Concept fondamental

`git reset` est une commande puissante permettant de revenir à un commit spécifique, tout en offrant différentes options concernant le destin des modifications ultérieures.[1][2][8] Contrairement à `git revert`, `git reset` modifie directement l'historique, ce qui la rend potentiellement dangereuse dans les contextes de collaboration.[2]

### Trois modes de fonctionnement

`git reset` propose trois modes distincts, chacun modifiant différentes zones du workflow Git :

#### 1. Mode --soft

```bash
git reset --soft <commit-id>
```

**Effet :**
- HEAD pointe vers le commit spécifié
- Les modifications des commits annulés restent en **staging area** (index)
- Le répertoire de travail n'est pas modifié

**Cas d'usage :** Regrouper plusieurs commits en un seul ou reorganiser les commits avant de créer une version finale.

**Exemple pratique :**

Supposant trois commits à regrouper :

```
commit c : Ajout de fonction A
commit b : Ajout de fonction B
commit a : Initialisation
```

```bash
git reset --soft a
```

Résultat :
- HEAD pointe vers commit `a`
- Les modifications de commits `b` et `c` se trouvent en staging area
- Créer un nouveau commit regroupé :

```bash
git commit -m "Ajout des fonctions A et B"
```

#### 2. Mode --mixed (par défaut)

```bash
git reset --mixed <commit-id>
# Équivalent à git reset <commit-id>
```

**Effet :**
- HEAD pointe vers le commit spécifié
- Les modifications des commits annulés sont placées dans le **répertoire de travail** (non stagées)
- L'index est réinitialisé

**Cas d'usage :** Annuler l'ajout de fichiers à l'index tout en conservant les modifications en local pour révision.

**Exemple pratique :**

```bash
# État actuel : fichier.txt modifié et stagé
git add fichier.txt
git status

# Affiche :
# Modifications qui seront validées:
#   modifié: fichier.txt
```

Exécution du reset en mode mixed :

```bash
git reset HEAD fichier.txt
```

Résultat :

```bash
git status

# Affiche :
# Modifications qui ne seront pas validées:
#   modifié: fichier.txt
```

Le fichier reste modifié dans le répertoire de travail mais n'est plus stagé.

#### 3. Mode --hard

```bash
git reset --hard <commit-id>
```

**Effet :**
- HEAD pointe vers le commit spécifié
- L'index est réinitialisé
- Le répertoire de travail est **entièrement remplacé** par l'état du commit cible
- **Toutes les modifications locales non commitées sont perdues irréversiblement**[2][4]

**Cas d'usage :** Supprimer complètement tous les changements locaux et revenir à un état stable connu.

⚠️ **Avertissement critique :** C'est le mode le plus dangereux. Les modifications perdues ne peuvent pas être récupérées via Git.

### Exemple détaillé : git reset --hard

**Situation initiale :**

```javascript
// index.js (dernière version commitée)
var nom = "Henrique";
console.log("Salut, tout le monde");
```

**Modifications effectuées (non commitées) :**

```javascript
// index.js (modifications en cours)
var nom = "Henrique";
console.log("Salut, tout le monde");
console.log("Une ligne");
```

**Vérification préalable :**

```bash
git status
```

Résultat :
```
Modifications qui ne seront pas validées:
  modifié: index.js
```

**Exécution du reset --hard :**

```bash
git reset --hard
```

**Résultat :**

Le fichier `index.js` revient instantanément à son état du dernier commit :

```javascript
var nom = "Henrique";
console.log("Salut, tout le monde");
// La ligne "Une ligne" a été supprimée définitivement
```

### Comparaison des trois modes

| Mode | État de HEAD | État de l'index | État du répertoire | Utilisation |
|------|-------------|-----------------|-------------------|------------|
| --soft | Changé | Inchangé | Inchangé | Regrouper des commits |
| --mixed | Changé | Réinitialisé | Inchangé | Destagner des fichiers |
| --hard | Changé | Réinitialisé | Remplacé | Éliminer tous les changements |

### Annulation de commits spécifiques

Pour revenir à un commit antérieur tout en conservant les modifications ultérieures en tant que modifications locales :

```bash
git reset <commit-id>
```

**Exemple concret :**

L'historique actuel :

```
commit d : Dernière modification (HEAD)
commit c : Modification intermédiaire
commit b : Modification antérieure
commit a : Initialisation
```

Pour revenir au commit `b` tout en conservant les modifications des commits `c` et `d` :

```bash
git reset b
```

Résultat :
- HEAD pointe vers commit `b`
- Les changements des commits `c` et `d` se trouvent dans le répertoire de travail en tant que modifications non stagées
- Ceci permet de retravailler et revalider ces modifications différemment

### Différence cruciale entre reset et revert

| Aspect | git reset | git revert |
|--------|-----------|-----------|
| Historique | Réécriture (commits supprimés) | Préservation (nouveau commit ajouté) |
| Sécurité collaborative | ❌ Dangereux | ✅ Sûr |
| Traçabilité | ❌ Perte d'information | ✅ Trace visible |
| Cas d'usage | Branches privées | Branches partagées, production |

### Récupération après un reset mal placé

Si un `git reset --hard` a supprimé des modifications importantes, il existe une possibilité de récupération via `git reflog` :

```bash
git reflog
```

Cette commande affiche l'historique de tous les mouvements de HEAD, permettant potentiellement de retrouver les commits perdus.

Exemple de reflog :

```
abc1234 HEAD@{0}: reset: moving to abc1234
def4567 HEAD@{1}: commit: Modification importante
ghi7890 HEAD@{2}: commit: Feature ajoutée
```

Pour restaurer un état antérieur :

```bash
git reset --hard def4567
```

---

## 🗂️ Interaction entre les commandes

### Arbre de décision pour l'annulation

```
Besoin d'annulation ?
│
├─ Fichiers non suivis à supprimer ?
│  └─> git clean
│
├─ Modifications non commitées à annuler ?
│  ├─ Pour un fichier spécifique ?
│  │  └─> git checkout -- <fichier>
│  └─ Pour tous les fichiers ?
│     └─> git reset --hard
│
├─ Commit à annuler dans une branche partagée ?
│  └─> git revert <commit-id>
│
└─ Commit à annuler dans une branche privée ?
   ├─ Supprimer complètement le commit ?
   │  └─> git reset --hard <commit-id>
   └─ Garder les modifications localement ?
      └─> git reset <commit-id>
```

### Scénario complexe : Correction multi-étape

**Situation :** Un développeur a effectué trois commits, réalise que le deuxième commit contient une erreur, mais veut conserver les modifications du troisième.

**Étape 1 : Identifier l'historique**

```bash
git log --oneline -3
```

Résultat :
```
def4567 (HEAD) Commit 3 - Fonctionnalité finale
abc1234 Commit 2 - Correction avec erreur
789defg Commit 1 - Initialisation
```

**Étape 2 : Réinitialiser jusqu'au commit 1**

```bash
git reset 789defg
```

État après reset :
- HEAD pointe vers `789defg`
- Modifications des commits 2 et 3 sont dans le répertoire de travail

**Étape 3 : Examiner et corriger les modifications**

```bash
git status
```

Affiche les fichiers modifiés provenant des commits annulés.

Correction manuelle des fichiers : la modification erronée est supprimée, les modifications valides du commit 3 sont conservées.

**Étape 4 : Revalider proprement**

```bash
git add .
git commit -m "Commit 2 - Correction (version corrigée)"
git commit -m "Commit 3 - Fonctionnalité finale"
```

**Résultat :**

```
ghi8901 (HEAD) Commit 3 - Fonctionnalité finale (revalidé)
hij9012 Commit 2 - Correction (version corrigée)
789defg Commit 1 - Initialisation
```

---

## 📋 Tableau récapitulatif complet

| Commande | Objectif | Préserve l'historique | Sûre en collaboration | Récupération | Cas d'usage |
|----------|----------|----------------------|----------------------|-------------|-----------|
| git clean | Supprimer fichiers non suivis | N/A | ✅ | ❌ | Nettoyer le workspace |
| git revert | Annuler changements commitées | ✅ | ✅ | ✅ | Production, branches partagées |
| git checkout -- | Annuler modifications non commitées | ✅ | ✅ | ⚠️ Diffère | Fichier spécifique modifié |
| git reset --soft | Rejouer commits | ✅ | ⚠️ | ✅ | Regrouper commits |
| git reset --mixed | Destagner, garder modifications | ✅ | ⚠️ | ✅ | Retirer fichier de staging |
| git reset --hard | Revenir complet à un commit | ❌ | ❌ | ⚠️ Via reflog | Branche privée, nettoyage total |

---

## 🎓 Synthèse du parcours d'apprentissage

### Phase 1 : Fondamentaux de la sécurité

Commencer par **git clean** et **git checkout --** pour comprendre comment annuler des modifications sans risque majeur. Ces commandes s'appliquent à des modifications non commitées, offrant un espace d'apprentissage sûr avant de modifier l'historique.

### Phase 2 : Compréhension de l'architecture

Étudier **HEAD** et la structure des **branches** pour saisir comment Git organise les commits. Cette compréhension conceptuelle est essentielle avant de manipuler l'historique.

### Phase 3 : Annulation inverse et préservation

Maîtriser **git revert** pour apprendre l'approche recommandée d'annulation des changements qui préserve complètement l'historique. C'est l'outil privilégié pour la collaboration.

### Phase 4 : Manipulation d'historique avancée

Progresser vers **git reset** pour comprendre comment modifier véritablement l'historique. Apprendre les trois modes progressivement : soft, mixed, puis hard, en prenant conscience des risques croissants.

### Phase 5 : Intégration et bonnes pratiques

Combiner les connaissances pour choisir l'outil approprié selon le contexte. Développer l'intuition sur quand utiliser chaque commande et comment récupérer en cas d'erreur.

Ce parcours progressif garantit une compréhension solide des mécanismes d'annulation dans Git, des opérations simples et sûres aux manipulations complexes d'historique, en passant par les nuances architecturales du système de versioning.
