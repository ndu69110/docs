# Citations
- https://outils101.telecom-paris.fr/git_git/
- https://about.gitlab.com/fr-fr/topics/version-control/what-is-git-version-control/
- https://datascientest.com/git-tutoriel-sur-le-systeme-de-controle-de-versions-du-developpeur
- https://blog.stephane-robert.info/docs/developper/version/git/
- https://learn.microsoft.com/fr-fr/devops/develop/git/what-is-git
- https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-%C3%80-propos-de-la-gestion-de-version
- https://www.atlassian.com/fr/git/tutorials/what-is-version-control
- https://markdown.data-ensta.fr/s/introduction-versioning-git
- https://openclassrooms.com/fr/courses/7162856-gerez-du-code-avec-git-et-github/7165703-decouvrez-la-magie-du-controle-de-versions
- https://www.datacamp.com/fr/courses/introduction-to-git


# Tokens
- prompt_tokens: 270
- completion_tokens: 5148
- total_tokens: 5418
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.077, 'request_cost': 0.006, 'total_cost': 0.084}


# Content
# 📚 Guide Complet : Introduction à Git

## Présentation de Git 🎯

Git est un **système de contrôle de version distribué open source**[2][4] créé en 2005 par **Linus Torvalds**, le développeur du noyau Linux. Cet outil est devenu la norme mondiale pour le contrôle de version et s'est imposé comme incontournable dans l'écosystème du développement logiciel[4].

### Qu'est-ce qui rend Git unique ?

Git se distingue par sa **nature distribuée**[2][5], ce qui signifie que chaque développeur dispose d'une copie locale complète du projet, incluant l'historique entier des modifications[5]. Contrairement aux systèmes centralisés où tous les utilisateurs se connectent à un répertoire central unique[3], Git permet une flexibilité de travail considérablement augmentée.

### Les caractéristiques principales de Git

**Rapidité et efficacité**[2] : Git dispose d'un dépôt local sur la machine de chaque développeur contenant l'historique complet du projet. Cette architecture élimine les délais de communication avec un serveur central, permettant à Git d'effectuer immédiatement des calculs de différence locale[2].

**Nature open source**[4] : Disponible sur pratiquement tous les systèmes d'exploitation, Git offre une solution accessible à tous avec une communauté active de contributeurs.

**Flexibilité des workflows**[2] : Les équipes peuvent implémenter diverses stratégies de gestion de branche adaptées à la taille du projet, à la composition de l'équipe ou aux processus spécifiques, incluant la centralisation, la gestion par fonctionnalités, le développement basé sur le tronc ou GitFlow[2].

**Collaboration améliorée**[2] : Le modèle de gestion de branches facilite le développement collaboratif, permettant aux membres d'équipe de créer des branches, d'expérimenter et de fusionner le code dans la branche principale[2].

---

## Qu'est-ce qu'un système de contrôle de version ? 🔄

### Définition et objectifs

Un **système de contrôle de version** (Version Control System - VCS) est un logiciel permettant de suivre l'évolution d'un fichier ou d'un ensemble de fichiers au cours du temps[6]. Les objectifs premiers d'un tel système sont multiples[1] :

- **Suivre les modifications** apportées à un ou des fichiers
- **Enregistrer les modifications** des données
- **Horodater les modifications** pour connaître quand chaque changement a été effectué
- **Documenter les informations d'auteur** pour identifier qui a effectué les modifications
- **Capturer les raisons des modifications** via des messages de commit explicites
- **Permettre de revenir en arrière** en cas de problème ou d'erreur
- **Permettre un travail temporaire sur des versions alternatives** via les branches

### Avantages concrets du contrôle de version

La mise en place d'un système de contrôle de version apporte des bénéfices tangibles[2] :

**Amélioration de la productivité des équipes** : Les équipes logicielles peuvent créer des versions expérimentales sans craindre d'endommager le code source de façon permanente[2]. Grâce au contrôle de version, il est possible de suivre et de fusionner les branches, d'auditer les modifications et d'activer le travail simultané[2].

**Traçabilité et débogage** : En cas de bug détecté plusieurs versions après sa création, il est possible de tester les versions par dichotomie pour identifier rapidement le commit problématique[1]. Sur un projet d'équipe, le commit contient l'information de l'auteur, permettant d'aller demander des explications directement au responsable[1].

**Récupération après sinistre** : Un exemple classique concerne les étudiants qui travaillent pendant trois mois sans sauvegarde et perdent tout sur crash disque la veille du rendu[1]. Avec un contrôle de version, ces données sont sauvegardées et récupérables.

**Investigation de regressions** : Quand un changement de comportement est signalé entre deux versions anciennes (par exemple v2 et v3) alors qu'on en est à la v7 et que l'équipe a entièrement changé, le contrôle de version permet de reconstruire ces versions, de comparer les journaux et d'isoler le fichier fautif en utilisant les commentaires de chaque version[1].

### Les deux modèles principaux

**Modèle centralisé**[3] : Tous les utilisateurs se connectent à un répertoire (repository) central unique. Chaque opération nécessite une communication avec le serveur central.

**Modèle distribué** (Git)[3][5] : Chaque développeur possède une copie locale complète du dépôt entier, incluant l'historique complet[4]. Cette approche facilite le travail en mode hors connexion ou à distance[5]. Les développeurs valident leur travail localement, puis synchronisent leur copie avec le serveur[5].

---

## Les concepts clés de Git 🔑

### Le dépôt Git

Un **dépôt Git** est l'ensemble des données du système de contrôle de version[1]. Il comprend au minimum toutes les versions de tous les fichiers (ou les moyens de les reconstituer), ainsi que toutes les informations d'auteur, de temps, de dépendance et de branches[1].

Sur le système de fichiers, un dépôt Git se reconnaît par la présence d'un **répertoire `.git`** dans le répertoire racine du dépôt. Ce répertoire contient tout l'historique des modifications sur tous les fichiers[1].

### Les trois états des fichiers

Dans Git, les fichiers peuvent se trouver dans l'un des trois états suivants[2] :

**État modifié** : Un fichier a été modifié mais n'a pas encore été validé dans la base de données. Les changements existent uniquement sur le système de fichiers local.

**État indexé** : Un fichier est configuré pour être inclus dans la prochaine validation (commit). Cette étape prépare les fichiers à être sauvegardés définitivement.

**État validé** : Les données ont été stockées dans la base de données Git. Cette validation rend les changements permanents dans l'historique du projet.

### L'architecture distribuée

Chaque développeur possède une copie complète de l'historique du projet[4], permettant un travail local indépendant. Cette architecture offre plusieurs avantages[5] :

- Les repositorys locaux sont entièrement opérationnels, facilitant le travail hors connexion
- Les développeurs peuvent valider leur travail localement avant de synchroniser avec le serveur
- Ce paradigme diffère radicalement de la gestion de version centralisée où la synchronisation serveur est préalable à toute nouvelle version

---

## Configuration initiale de Git ⚙️

### Installation de Git

Git est disponible sur pratiquement tous les systèmes d'exploitation[4]. L'installation varie selon la plateforme :

**Sur Linux (Debian/Ubuntu)** :
```bash
sudo apt-get update
sudo apt-get install git
```

**Sur Linux (RedHat/CentOS)** :
```bash
sudo yum install git
```

**Sur macOS** :
```bash
brew install git
```

**Sur Windows** : Télécharger l'installateur depuis git-scm.com et exécuter l'installation graphique.

### Vérifier l'installation

Après installation, vérifier que Git fonctionne correctement :

```bash
git --version
```

Cette commande affiche la version installée, confirmant une installation réussie.

### Configuration globale

Git nécessite une configuration minimale avant utilisation. Les deux informations essentielles sont **le nom d'utilisateur** et **l'adresse email**, qui seront associés à tous les commits effectués.

**Configurer le nom d'utilisateur** :
```bash
git config --global user.name "Prénom Nom"
```

**Configurer l'adresse email** :
```bash
git config --global user.email "email@example.com"
```

L'option `--global` applique ces paramètres à tous les projets Git de l'utilisateur. Pour configurer uniquement un projet spécifique, omettre l'option `--global`.

### Vérifier la configuration

Consulter la configuration établie :

```bash
git config --global --list
```

Cette commande affiche tous les paramètres de configuration globale. Pour un projet spécifique, exécuter sans l'option `--global`.

### Configuration avancée (optionnelle)

D'autres configurations peuvent améliorer l'expérience utilisateur :

**Configurer l'éditeur par défaut** :
```bash
git config --global core.editor "nano"
```

**Configurer l'outil de fusion (merge tool)** :
```bash
git config --global merge.tool "meld"
```

**Afficher les couleurs dans la sortie** :
```bash
git config --global color.ui true
```

**Configurer les alias** (raccourcis personnalisés) :
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
```

Ces alias permettent d'utiliser `git st` au lieu de `git status`, par exemple, accélérant le workflow quotidien.

---

## À l'abordage ! 🚀 : Premier projet Git

### Initialiser un nouveau dépôt

Pour démarrer un projet Git, accéder au répertoire du projet et initialiser un dépôt :

```bash
cd mon_projet
git init
```

Cette commande crée un répertoire `.git` caché contenant toute la structure nécessaire au suivi des versions.

### Cloner un dépôt existant

Pour travailler sur un projet existant, cloner le dépôt distant :

**Accès en lecture seule (HTTPS)** :
```bash
git clone https://gitlab.telecom-paris.fr/proj103/admin/ue_outils.git
```

**Accès en lecture/écriture (SSH)** :
```bash
git clone git@gitlab.enst.fr:proj103/admin/ue_outils.git
```

La deuxième option nécessite la configuration préalable d'une clé SSH pour l'authentification.

### Vérifier l'état du dépôt

Avant de commencer à travailler, consulter l'état actuel :

```bash
git status
```

Cette commande affiche les fichiers modifiés, supprimés ou nouveaux, ainsi que l'état du staging area.

### Ajouter des fichiers au staging area

Préparer les fichiers pour le commit :

**Ajouter un fichier spécifique** :
```bash
git add nom_du_fichier.txt
```

**Ajouter tous les fichiers modifiés** :
```bash
git add .
```

**Ajouter tous les fichiers d'un répertoire** :
```bash
git add chemin/du/repertoire/
```

### Effectuer un commit

Valider les changements avec un message descriptif :

```bash
git commit -m "Description claire des modifications"
```

Les messages de commit doivent être explicites et informatifs. Un bon message commence par un verbe au présent : "Ajouter", "Corriger", "Mettre à jour", etc.

Exemple d'un bon commit :
```bash
git commit -m "Ajouter la fonction d'authentification utilisateur"
```

### Consulter l'historique

Visualiser tous les commits effectués :

```bash
git log
```

Cela affiche la liste des commits avec leur identifiant unique (SHA), l'auteur, la date et le message.

Pour un affichage plus compact :
```bash
git log --oneline
```

---

## Présentation de Bash et commandes Linux 🐧

### Qu'est-ce que Bash ?

**Bash** (Bourne Again Shell) est un interpréteur de commandes Unix/Linux, c'est-à-dire un programme qui exécute les commandes tapées par l'utilisateur. C'est l'interface de ligne de commande (Command Line Interface - CLI) la plus couramment utilisée sur les systèmes Unix et Linux.

### Utilité pour Git

Git fonctionne principalement via une interface de ligne de commande. Maîtriser Bash permet une utilisation efficace et productive de Git. Même sur Windows avec l'interface graphique, comprendre les commandes Bash améliore significativement l'expérience utilisateur.

### Commandes Linux essentielles

**Navigation dans le système de fichiers**

```bash
pwd
```
Affiche le répertoire courant (Present Working Directory).

```bash
ls
```
Liste les fichiers et répertoires du répertoire courant.

Options utiles :
- `ls -l` : affichage détaillé avec permissions et dates
- `ls -a` : affiche les fichiers cachés (commençant par un point)
- `ls -la` : combinaison des deux options précédentes

```bash
cd repertoire
```
Change de répertoire (Change Directory).

```bash
cd ..
```
Remonte d'un niveau dans l'arborescence.

```bash
cd ~
```
Retourne au répertoire utilisateur (home directory).

**Gestion des fichiers et répertoires**

```bash
mkdir nom_repertoire
```
Crée un nouveau répertoire (Make Directory).

```bash
touch nom_fichier.txt
```
Crée un fichier vide ou met à jour la date d'accès si le fichier existe.

```bash
cp source destination
```
Copie un fichier (Copy).

```bash
cp -r repertoire_source repertoire_destination
```
Copie un répertoire entier et son contenu récursivement.

```bash
mv ancienne_position nouvelle_position
```
Déplace ou renomme un fichier (Move).

```bash
rm nom_fichier
```
Supprime un fichier (Remove). Attention : la suppression est définitive.

```bash
rm -r nom_repertoire
```
Supprime un répertoire et tout son contenu.

**Consultation et édition de fichiers**

```bash
cat nom_fichier.txt
```
Affiche le contenu entier d'un fichier (Concatenate).

```bash
head -n 10 nom_fichier.txt
```
Affiche les 10 premières lignes d'un fichier.

```bash
tail -n 10 nom_fichier.txt
```
Affiche les 10 dernières lignes d'un fichier.

```bash
nano nom_fichier.txt
```
Ouvre l'éditeur de texte Nano pour éditer le fichier.

```bash
vim nom_fichier.txt
```
Ouvre l'éditeur de texte Vim, plus puissant mais avec une courbe d'apprentissage plus raide.

**Commandes de recherche et de filtrage**

```bash
grep "motif" nom_fichier.txt
```
Recherche les lignes contenant un motif spécifique (Global Regular Expression Print).

```bash
grep -r "motif" repertoire/
```
Recherche récursivement dans un répertoire.

```bash
find repertoire/ -name "*.txt"
```
Trouve tous les fichiers avec l'extension `.txt` dans le répertoire.

**Commandes de gestion des permissions**

```bash
chmod 755 nom_fichier
```
Change les permissions d'un fichier (Change Mode).

```bash
chown utilisateur:groupe nom_fichier
```
Change le propriétaire d'un fichier (Change Owner).

**Commandes utilitaires**

```bash
echo "Texte"
```
Affiche du texte sur la sortie standard.

```bash
man commande
```
Affiche le manuel (manual) de la commande spécifiée.

```bash
whoami
```
Affiche le nom de l'utilisateur actuel.

```bash
date
```
Affiche la date et l'heure actuelles.

### Combinaison de commandes

Bash offre une grande flexibilité pour combiner les commandes :

**Redirection de sortie vers un fichier** :
```bash
echo "Contenu" > fichier.txt
```

**Ajout à la fin d'un fichier** :
```bash
echo "Ligne supplémentaire" >> fichier.txt
```

**Pipe (|)** : Utilisé pour passer la sortie d'une commande à une autre :
```bash
ls -la | grep ".txt"
```
Cela affiche uniquement les fichiers `.txt` du répertoire courant.

### Variables d'environnement

Les variables permettent de stocker des informations :

```bash
export MA_VARIABLE="valeur"
```
Crée une variable accessible dans tous les processus enfants.

```bash
echo $MA_VARIABLE
```
Affiche la valeur de la variable.

Quelques variables importantes :

- `$HOME` : le répertoire utilisateur
- `$PATH` : la liste des répertoires où les commandes sont cherchées
- `$USER` : le nom de l'utilisateur actuel
- `$PWD` : le répertoire courant

---

## Environnement 🌍

### Configuration de l'environnement de travail

Une configuration appropriée de l'environnement est cruciale pour une utilisation productive de Git.

### Terminal et CLI

**Choisir un terminal approprié**

- **Linux** : GNOME Terminal, Konsole (KDE), ou terminaux légers comme xterm
- **macOS** : Terminal natif, ou iTerm2 pour des fonctionnalités avancées
- **Windows** : Git Bash (fourni avec l'installation Git), PowerShell, ou Windows Terminal

**Git Bash sur Windows**

Git Bash émule un environnement Unix/Linux sur Windows, permettant l'utilisation des mêmes commandes Linux. C'est la solution recommandée pour une cohérence cross-plateforme.

### Variables d'environnement pour Git

**Vérifier la variable PATH**

Git doit être accessible depuis n'importe quel répertoire. Vérifier que Git est dans le PATH :

```bash
which git
```

Sur Windows, cela peut s'écrire :
```bash
where git
```

**Configurer le HOME**

```bash
echo $HOME
```

Ce répertoire contient les fichiers de configuration, notamment `.gitconfig` où sont stockés les paramètres globaux.

### Fichier de configuration `.gitconfig`

Ce fichier contient tous les paramètres de configuration globale de Git. Il se trouve généralement dans le répertoire utilisateur.

Afficher le fichier :
```bash
cat ~/.gitconfig
```

Un exemple de fichier `.gitconfig` :
```ini
[user]
	name = Jean Dupont
	email = jean.dupont@example.com
[core]
	editor = nano
	quotePath = false
[color]
	ui = true
[alias]
	st = status
	co = checkout
	br = branch
	ci = commit
[merge]
	tool = meld
```

### Clés SSH pour l'authentification

Pour éviter d'entrer le mot de passe à chaque interaction avec un serveur Git distant, configurer une authentification SSH.

**Générer une paire de clés SSH** :
```bash
ssh-keygen -t rsa -b 4096 -C "email@example.com"
```

Les clés seront générées dans `~/.ssh/` :
- `id_rsa` : clé privée (à garder secrète)
- `id_rsa.pub` : clé publique (à partager avec le serveur)

**Ajouter la clé à l'agent SSH** :
```bash
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_rsa
```

**Configurer Git pour utiliser SSH**

Modifier la configuration :
```bash
git config --global core.sshCommand "ssh -i ~/.ssh/id_rsa"
```

### Fichier `.gitignore`

Ce fichier, placé à la racine du dépôt, indique à Git les fichiers ou répertoires à ignorer.

Exemple de contenu `.gitignore` pour un projet Python :
```
# Répertoires
__pycache__/
*.pyc
.env
venv/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# Fichiers générés
*.log
*.tmp
build/
dist/

# Secrets
config_secret.json
*.key
```

Pour un projet Node.js :
```
node_modules/
npm-debug.log
.env
dist/
build/
.DS_Store
```

### Gestion des droits d'accès

Assurer que les fichiers de configuration sont accessibles uniquement par l'utilisateur :

```bash
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 600 ~/.gitconfig
```

### Tests de connectivité

Vérifier la connexion à un serveur Git distant :

```bash
ssh -T git@github.com
```

Pour GitLab :
```bash
ssh -T git@gitlab.com
```

Un message confirmant l'authentification indique que tout est configuré correctement.

---

## Résumé du parcours d'apprentissage 📖

La progression d'apprentissage commence par comprendre les **fondamentaux du contrôle de version**, essentiels pour saisir pourquoi Git existe et quels problèmes il résout. Cette compréhension théorique pose les bases mentales nécessaires.

Ensuite, le parcours se concentre sur **Git lui-même**, en mettant l'accent sur son architecture distribuée et ses avantages par rapport aux systèmes centralisés. Cette étape permet de comprendre les principes uniques qui rendent Git si puissant.

La **configuration initiale** représente un passage obligatoire avant toute utilisation pratique. Sans cette étape, Git ne peut pas fonctionner correctement, d'où son importance dans le parcours.

L'étape "**À l'abordage !**" introduit les opérations pratiques essentielles : initialiser un dépôt, y ajouter des fichiers, et effectuer les premiers commits. C'est ici que la théorie rencontre la pratique.

Parallèlement, la **maîtrise de Bash et des commandes Linux** devient indispensable. Git s'utilise via le terminal, et naviguer efficacement dans le système de fichiers est un prérequis pour manipuler Git sans friction.

Enfin, la **configuration de l'environnement** finalise la préparation. Avec SSH configuré, les fichiers `.gitignore` en place et l'environnement correctement paramétré, l'apprenant dispose d'une base solide pour progresser vers des concepts plus avancés comme les branches, la fusion et la collaboration d'équipe.

Ce cheminement garantit que l'apprenant comprend non seulement *comment* utiliser Git, mais aussi *pourquoi* chaque étape est nécessaire, créant une compréhension durable et applicable à des projets réels.
