# Citations
- https://git-scm.com/book/fr/v2/Git-sur-le-serveur-GitLab
- https://www.next-decision.fr/wiki/migration-dun-repertoire-git-sur-gitlab
- https://labex.io/fr/tutorials/git-step-by-step-instructions-for-linking-a-git-repository-to-a-remote-398369
- https://about.gitlab.com/fr-fr/blog/getting-started-with-gitlab-how-to-import-your-projects-to-gitlab/
- https://learninglab.gitlabpages.inria.fr/mooc-rr/mooc-rr-ressources/module2/ressources/gitlab_fr.html
- https://github.com/SocialGouv/tutoriel-gitlab
- https://inspe-sciedu.gricad-pages.univ-grenoble-alpes.fr/reflexpro/init-gitlab-rtd.html
- https://about.gitlab.com/fr-fr/blog/git-bash/
- https://irma.math.unistra.fr/~helluy/info/git-gitlab.pdf
- https://qualite-developpement-s2-1c0a85.gitpages.iut-orsay.fr/tp1


# Tokens
- prompt_tokens: 324
- completion_tokens: 6278
- total_tokens: 6602
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.094, 'request_cost': 0.006, 'total_cost': 0.101}


# Content
# Chapitre 7 : Répertoire distant et GitLab

## Introduction aux répertoires distants et à GitLab

### Concept fondamental des répertoires distants

Un **répertoire distant** (remote repository) constitue une copie du projet Git hébergée sur un serveur, distinct de la copie locale présente sur l'ordinateur. Cette architecture distribuée permet à plusieurs développeurs de collaborer sur un même projet en synchronisant leurs modifications via ce point central.[1]

GitLab est une **plateforme web reposant sur une base de données** qui fournit un environnement complet pour héberger et gérer des répertoires Git.[1] Contrairement à une simple structure de fichiers, GitLab offre une interface graphique pour la gestion de projets, l'intégration continue/déploiement continu (CI/CD), les issues, et la collaboration d'équipe.

### Architecture client-serveur dans Git

La structure fondamentale fonctionne selon ce modèle :

```
Ordinateur Local (Dépôt Local)
    ↓ ↑
    │ │ push/pull
    ↓ ↑
Serveur GitLab (Dépôt Distant)
```

Le dépôt local contient l'intégralité de l'historique du projet, tandis que le dépôt distant sert de point de synchronisation central. Cette approche confère à Git sa nature distribuée et sa robustesse.

### Configuration initiale d'un projet GitLab

Pour débuter avec GitLab, la création d'un projet nécessite plusieurs étapes. Dans l'interface GitLab, en cliquant sur `Create Project`, un formulaire s'affiche demandant le nom du projet, sa description, et le niveau de visibilité (public, interne ou privé). La plupart de ces configurations ne sont pas permanentes et peuvent être réajustées ultérieurement grâce à l'interface de paramétrage.[1]

Une fois le projet créé, il est accessible via deux protocoles distincts :

- **HTTPS** : Authentification par nom d'utilisateur et mot de passe (ou token d'accès personnel)
- **SSH** : Authentification par paire de clés cryptographiques

Les URLs correspondantes sont visibles en haut de la page du projet GitLab.[1]

---

## Cloner et gérer un répertoire distant

### Opération de clonage

Le clonage crée une copie locale complète du répertoire distant, incluant l'intégralité de l'historique des commits, toutes les branches, et l'ensemble des fichiers du projet. Cette opération initialise automatiquement la connexion au répertoire distant.[3]

**Syntaxe générale du clonage :**

```bash
git clone <url-du-depot-distant>
```

**Exemple avec HTTPS :**

```bash
git clone https://gitlab.com/utilisateur/mon-projet.git
```

**Exemple avec SSH :**

```bash
git clone [email protected]:utilisateur/mon-projet.git
```

**Exemple avec authentification HTTPS explicite :**

```bash
git clone https://nom_utilisateur@app-gitlab.exemple.com/utilisateur/mon-projet.git
```

Après l'exécution de cette commande, un répertoire portant le nom du projet est créé localement, contenant tous les fichiers et l'historique complet du projet.

### Lier un répertoire local existant à un répertoire distant

Lorsqu'un projet dispose déjà d'un dossier `.git` (contenant l'historique des modifications, les versions, et le système de gestion du code), il est possible de le connecter à un répertoire distant différent sans perdre l'historique existant.[2]

**Ajouter un nouveau répertoire distant :**

```bash
git remote add gitlab https://serveur/espace_de_nom/projet.git
```

Cette commande crée une référence nommée `gitlab` pointant vers le serveur distant spécifié.[1]

**Modifier un répertoire distant existant :**

```bash
git remote set-url origin <url-du-nouveau-depot>
```

Cette commande est fondamentale lors d'une migration : elle remplace l'URL du serveur distant sans réinitialiser la connexion, conservant ainsi l'historique local.[2]

⚠️ **Distinction critique :** Il ne faut pas confondre `git remote add` (création d'une nouvelle connexion) avec `git remote set-url` (modification d'une connexion existante). Utiliser `add` sur un répertoire distant déjà configuré générera une erreur.

### Gestion des répertoires distants multiples

Git permet de maintenir plusieurs connexions distantes simultanément. Par exemple, lors du travail avec des sous-traitants sur des plateformes différentes ou lors de la mise à disposition en open source d'un projet interne, il est possible de configurer plusieurs répertoires distants :[4]

```bash
git remote add origin https://gitlab.com/mon-utilisateur/projet.git
git remote add github https://github.com/mon-utilisateur/projet.git
git remote add gitea https://gitea.exemple.com/mon-utilisateur/projet.git
```

**Lister tous les répertoires distants configurés :**

```bash
git remote -v
```

Cette commande affiche toutes les connexions distantes avec leurs URLs.

---

## Mise à jour des pointeurs distants avec git fetch

### Concept de git fetch

L'opération **git fetch** récupère les modifications du serveur distant sans les intégrer automatiquement dans la branche locale courante. Cette commande met à jour les références distantes locales (les pointeurs qui trackent l'état des branches distantes) sans modifier le contenu local du répertoire de travail.[3]

```bash
git fetch origin
```

### Mise à jour des références de suivi distant

Lors de l'exécution de `git fetch`, Git télécharge les nouveaux commits depuis le serveur et met à jour les références de suivi distant. Ces références, par convention nommées `origin/nom-branche`, pointent vers la dernière position connue de chaque branche sur le serveur distant.

**Tableau des états avant et après fetch :**

| État | Branche locale | Référence distante (origin/branche) | Description |
|------|----------------|-------------------------------------|-------------|
| Avant fetch | commit A | commit A | État initial synchronisé |
| Après fetch (nouveau commit sur serveur) | commit A | commit B | Fetch a mis à jour la référence distante |
| Avant merge | commit A (HEAD) | commit B (origin/main) | Prêt pour intégration |

### Syntaxes de fetch

**Récupérer depuis tous les répertoires distants :**

```bash
git fetch --all
```

**Récupérer depuis un répertoire distant spécifique :**

```bash
git fetch origin
```

**Récupérer une branche spécifique :**

```bash
git fetch origin nom-branche
```

### Examen des branches distantes après fetch

Après un fetch, les branches distantes peuvent être consultées :

```bash
git branch -r
```

Cette commande liste toutes les branches de suivi distant, préfixées par le nom du répertoire distant (par exemple `origin/main`, `origin/develop`).

### Différence entre fetch et pull

Bien que souvent confondues, ces deux opérations comportent des différences importantes :

- **git fetch** : Récupère les modifications du serveur sans les intégrer
- **git pull** : Récupère les modifications ET les intègre dans la branche locale courante

Cette distinction permet un contrôle plus granulaire du processus de mise à jour.

---

## Le raccourci git pull

### Fonctionnement de git pull

L'opération **git pull** combine deux actions distinctes en une seule commande :[3]

1. **git fetch** : Récupération des modifications du serveur distant
2. **git merge** (ou **git rebase**) : Intégration des modifications dans la branche locale

```bash
git pull origin main
```

Cette commande équivaut à :

```bash
git fetch origin
git merge origin/main
```

### Stratégies d'intégration avec git pull

**Intégration par fusion (merge) - comportement par défaut :**

```bash
git pull origin main
```

Si la branche locale a avancé parallèlement à la branche distante, Git crée un **commit de fusion** pour reconcilier les historiques.

**Intégration par rebasage :**

```bash
git pull --rebase origin main
```

Le rebasage rejoue les commits locaux sur la base de la branche distante, produisant un historique linéaire plus propre.

### Configuration permanente de la branche de suivi

Pour que `git pull` fonctionne sans spécifier le répertoire distant et la branche, il est nécessaire de configurer la branche de suivi :

```bash
git branch --set-upstream-to=origin/main main
```

Ou de manière raccourcie :

```bash
git branch -u origin/main main
```

Après cette configuration, simplement taper `git pull` suffira.

### Dépannage des opérations pull

**Situation de divergence :**

Si la branche locale et la branche distante ont divergé (chacune contenant des commits non présents dans l'autre), `git pull` créera un commit de fusion qui réconcilie les deux historiques.

```bash
# Avant pull : Local (A-B-C), Distant (A-B-D-E)
# Après pull : Local (A-B-C-M-D-E) où M est le commit de fusion
```

---

## Liens entre branches locales et branches distantes

### Concept de branche de suivi distant

Une **branche de suivi distant** (remote-tracking branch) est une référence locale qui représente l'état d'une branche sur le serveur distant au moment du dernier fetch. Ces branches ont une nomenclature spécifique : `<nom-distant>/<nom-branche>`.

Par exemple :
- `origin/main` : l'état de `main` sur le serveur `origin`
- `upstream/develop` : l'état de `develop` sur le serveur `upstream`

Ces branches ne peuvent pas être modifiées directement ; elles sont mises à jour uniquement par les opérations `fetch`.

### Liaison explicite entre branche locale et branche distante

Lors de la création d'une branche locale, il est optimal de l'associer à une branche de suivi distant. Cette liaison permet à `git status` et `git pull` de fonctionner sans arguments supplémentaires.

**Création d'une branche locale associée à une branche distante :**

```bash
git checkout --track origin/develop
```

Cette commande crée automatiquement une branche locale nommée `develop` et la configure pour suivre `origin/develop`.

**Création avec un nom personnalisé :**

```bash
git checkout -b ma-branche origin/develop
git branch -u origin/develop ma-branche
```

**Configuration après création :**

```bash
git branch -u origin/develop
```

Exécutée sans argument de branche spécifique, cette commande configure la branche courante.

### Tableau de suivi des branches

| Branche locale | Branche distante | Commandée par | État |
|---|---|---|---|
| `main` | `origin/main` | Automatique au clonage | Synchronisée |
| `develop` | `origin/develop` | `git checkout --track` | Synchronisée |
| `feature-x` | aucune | Création manuelle | Détachée |
| `bugfix-y` | `origin/bugfix-y` | `git branch -u` | Suivie |

### Affichage du suivi des branches

```bash
git branch -vv
```

Cette commande affiche chaque branche locale avec sa branche de suivi associée et le statut de synchronisation (ahead/behind).

**Exemple de sortie :**

```
  main                  abc1234 [origin/main] Dernière version
* develop               def5678 [origin/develop: ahead 2] Travail en cours
  feature-authentif    ghi9012 [origin/feature-authentif: behind 3] En retard
```

---

## Mettre à jour le dépôt distant avec git push

### Concept de git push

L'opération **git push** transmet les commits locaux vers le répertoire distant.[2] Contrairement à `fetch` qui télécharge, `push` envoie les modifications du système local vers le serveur.

```bash
git push origin main
```

Cette commande pousse la branche `main` locale vers le répertoire distant nommé `origin`.

### Poussée simple vs poussée avec suivi

**Poussée basique (nécessite de spécifier la branche cible) :**

```bash
git push origin develop
```

**Poussée avec configuration de suivi :**

```bash
git push -u origin develop
```

Le flag `-u` (ou `--set-upstream`) configure simultaneement la poussée ET établit le lien de suivi. Après cette commande, les futurs `git push` sur cette branche ne nécessiteront plus d'arguments.

### Poussée de branches multiples

**Envoyer toutes les branches locales :**

```bash
git push --all
```

Selon le contexte décrit dans les ressources, lors d'une migration complète de répertoire, cette commande transmet l'ensemble des branches et de leur historique :[2]

```bash
git push -u origin --all
```

### Gestion des tags

Les **tags** (étiquettes) sont des repères pointant sur des commits spécifiques, généralement utilisés pour marquer des versions. Par défaut, `git push` n'envoie pas les tags.

**Envoyer les tags :**

```bash
git push origin --tags
```

**Envoyer un tag spécifique :**

```bash
git push origin nom-du-tag
```

### Migration complète d'un répertoire

Lors du déplacement d'un projet d'une plateforme à une autre (par exemple de GitHub vers GitLab), il est essentiel de préserver l'intégrité complète du projet :[2]

```bash
# 1. Renommer le remote existant
git remote rename origin old-origin

# 2. Ajouter le nouveau remote GitLab
git remote add origin https://gitlab.com/utilisateur/nouveau-projet.git

# 3. Envoyer l'intégralité des branches et tags
git push -u origin --all
git push origin --tags
```

Après ces étapes, l'intégralité des fichiers, branches et tags du projet est présente sur le nouveau serveur, et la collaboration peut débuter.

### Gestion des conflits lors du push

Si un push est rejeté car la branche distante a avancé, Git refuse l'opération pour prévenir les pertes de données.

**Scénario de rejet :**

```
Local:    A-B-C (HEAD on main)
Distant:  A-B-D

Tentative : git push origin main
Résultat : rejected (non-fast-forward)
```

**Solution :** Synchroniser d'abord avec le serveur

```bash
git fetch origin
git merge origin/main
git push origin main
```

---

## Répertoire distant et configurations

### Configuration du répertoire distant par défaut

Lors du clonage d'un répertoire, Git crée automatiquement une configuration avec `origin` comme répertoire distant par défaut et `main` comme branche par défaut. Cette configuration peut être consultée dans le fichier `.git/config`.

**Afficher la configuration du remote :**

```bash
git remote -v
```

**Exemple de sortie :**

```
origin  https://gitlab.com/utilisateur/projet.git (fetch)
origin  https://gitlab.com/utilisateur/projet.git (push)
```

### Configuration avancée des répertoires distants

Le fichier `.git/config` stocke la configuration complète. Pour les dépôts complexes, il peut ressembler à :

```ini
[remote "origin"]
    url = https://gitlab.com/utilisateur/projet.git
    fetch = +refs/heads/*:refs/remotes/origin/*

[remote "upstream"]
    url = https://gitlab.com/projet-original/projet.git
    fetch = +refs/heads/*:refs/remotes/upstream/*

[branch "main"]
    remote = origin
    merge = refs/heads/main

[branch "develop"]
    remote = origin
    merge = refs/heads/develop
```

Cette configuration peut être éditée directement ou modifiée via les commandes Git.

### Modification de la configuration des répertoires distants

**Ajouter une URL de push différente :**

```bash
git remote set-url --push origin https://autre-url.git
```

Cette approche permet de récupérer les modifications depuis une source tout en envoyant vers une autre destination.

**Supprimer un répertoire distant :**

```bash
git remote remove ancien-remote
```

**Renommer un répertoire distant :**

```bash
git remote rename old-name new-name
```

### Dépôt miroir et synchronisation bidirectionnelle

Dans certains contextes, notamment lors de la gestion de projets open source, il est nécessaire de maintenir deux copies du projet synchronisées sur des plateformes différentes. GitLab supporte la fonctionnalité de **dépôt miroir** pour cela.[6]

Configuration d'un miroir GitLab → GitHub :

1. Dans les paramètres du projet GitLab, accéder à Paramètres → Dépôt → Dépôts miroirs
2. Ajouter l'URL du dépôt GitHub
3. Fournir le nom d'utilisateur GitHub et un token d'accès personnel
4. Cocher l'option "Dépôt miroir"

Après cette configuration, chaque commit effectué sur GitLab est automatiquement poussé vers GitHub.[6]

---

## Liens entre branches locales et branches distantes (approfondissement)

### Suivi automatique lors du checkout

Lorsqu'une branche locale n'existe pas mais qu'une branche distante correspondante existe, Git crée automatiquement la branche locale avec le suivi configuré.

```bash
git checkout develop
# Si develop n'existe pas localement mais origin/develop existe,
# Git crée automatiquement develop en local et la configure pour suivre origin/develop
```

### Affichage détaillé des branches et de leur suivi

```bash
git branch -vv
```

**Interprétation de la sortie :**

```
  main              a1b2c3d [origin/main] Commit message
* develop           d4e5f6g [origin/develop: ahead 2, behind 1] Commit message
  feature-x        h7i8j9k [origin/feature-x: gone] Commit message
```

- `ahead 2` : 2 commits locaux non envoyés
- `behind 1` : 1 commit distant non récupéré
- `gone` : La branche distante n'existe plus sur le serveur

### Gestion des branches distantes supprimées

Lorsqu'une branche est supprimée sur le serveur, la branche de suivi local persiste. Pour nettoyer ces références obsolètes :

```bash
git remote prune origin
```

Ou lors d'un fetch :

```bash
git fetch --prune origin
```

---

## Optimisation et nettoyage

### Nettoyage des références distantes obsolètes

Au fil du temps, les branches sont créées et supprimées. Les références locales vers les branches distantes supprimées occupent de l'espace et créent de la confusion.

**Supprimer les branches distantes supprimées :**

```bash
git fetch --prune
```

**Alias pour simplifier :**

```bash
git config --global alias.prune-local 'fetch --prune origin'
```

### Optimisation de la base de données Git

Git stocke l'historique dans une structure de fichiers. Au fil du temps, cette structure peut devenir fragmentée.

**Compacter la base de données :**

```bash
git gc
```

Cette commande combine les objets Git fragmentés en fichiers packfile, réduisant l'espace disque utilisé.

**Optimisation agressive (pour les répertoires volumineux) :**

```bash
git gc --aggressive
```

### Gestion de l'espace disque

**Afficher la taille du répertoire `.git` :**

```bash
du -sh .git
```

**Identifier les fichiers volumineux :**

```bash
git rev-list --all --objects | sort -k2 | tail -20
```

Cette commande liste les 20 plus gros objets dans l'historique.

### Vérification de l'intégrité

```bash
git fsck --full
```

Cette commande vérifie l'intégrité de tous les objets Git et identifie les problèmes potentiels.

---

## Utiliser le protocole SSH avec Git et GitLab

### Fondamentaux de SSH

SSH (Secure Shell) est un protocole de communication sécurisée basé sur le chiffrement asymétrique (paire de clés publique/privée). Pour l'authentification auprès de GitLab, il est nécessaire de générer une paire de clés.[5]

### Architecture SSH pour Git

```
Ordinateur Local                    Serveur GitLab
├── Clé privée (secret)            ├── Clé publique (stockée)
└── Client SSH          ←→ SSH      ├── Vérification
                     (chiffré)      └── Déverrouillage
```

### Génération de la paire de clés SSH

**Créer une nouvelle paire de clés :**

```bash
ssh-keygen -t ed25519 -C "email@exemple.com"
```

**Pour les systèmes plus anciens (RSA) :**

```bash
ssh-keygen -t rsa -b 4096 -C "email@exemple.com"
```

Les prompts demandent :
- Chemin de sauvegarde (par défaut `~/.ssh/id_ed25519`)
- Phrase de passe (optionnelle mais recommandée)

### Structure de stockage des clés SSH

```
~/.ssh/
├── id_ed25519           (clé privée - À GARDER SECRET)
├── id_ed25519.pub       (clé publique - À partager)
├── known_hosts          (serveurs connus)
└── config               (configuration SSH)
```

### Ajout de la clé publique à GitLab

1. Afficher le contenu de la clé publique :

```bash
cat ~/.ssh/id_ed25519.pub
```

2. Copier la sortie (commençant par `ssh-ed25519` ou `ssh-rsa`)

3. Dans GitLab :
   - Cliquer sur l'avatar utilisateur → Préférences
   - Sélectionner SSH Keys
   - Coller la clé publique
   - Cliquer sur Add key

### Test de la connexion SSH

**Vérifier la connectivité :**

```bash
ssh -T [email protected]
```

**Réponse attendue :**

```
Welcome to GitLab, @utilisateur!
```

### Utilisation de SSH pour les opérations Git

**Cloner un répertoire via SSH :**

```bash
git clone [email protected]:utilisateur/mon-projet.git
```

**Ajouter un répertoire distant via SSH :**

```bash
git remote add origin [email protected]:utilisateur/mon-projet.git
```

### Configuration avancée de SSH

**Créer un alias SSH dans `~/.ssh/config` :**

```
Host gitlab
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    PreferredAuthentications publickey
```

Après cette configuration, les commandes Git peuvent utiliser `gitlab` :

```bash
git clone gitlab:utilisateur/mon-projet.git
```

### Gestion de plusieurs clés SSH

Pour les développeurs travaillant avec plusieurs serveurs Git ou plusieurs comptes :

**Configuration `~/.ssh/config` avancée :**

```
Host gitlab-personnel
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personnel

Host gitlab-professionnel
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_ed25519_professionnel

Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
```

**Utilisation avec les URLs correspondantes :**

```bash
git clone gitlab-personnel:utilisateur-personnel/projet.git
git clone gitlab-professionnel:utilisateur-pro/projet.git
git clone github:utilisateur-github/projet.git
```

### Sécurité et bonnes pratiques SSH

- **Phrase de passe** : Toujours utiliser une phrase de passe pour protéger la clé privée
- **Rotation** : Régulièrement générer de nouvelles clés et supprimer les anciennes
- **Permissions** : Le répertoire `~/.ssh/` doit avoir les permissions `700`

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

- **Audits** : Régulièrement vérifier les clés SSH enregistrées sur GitLab

### Dépannage SSH

**Vérifier les détails de la connexion :**

```bash
ssh -vvv [email protected]
```

Le verbose mode affiche les étapes de connexion et aide à identifier les problèmes.

**Problème courant : Permission denied**

```bash
# Vérifier les permissions
ls -la ~/.ssh/

# Réinitialiser si nécessaire
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

---

## Synthèse et progression pédagogique

L'apprentissage des répertoires distants et GitLab suit une progression logique :

### Phase 1 : Fondamentaux
La compréhension débute par les concepts élémentaires : qu'est-ce qu'un répertoire distant, comment il se distingue du répertoire local, et les deux protocoles de communication (HTTPS et SSH).

### Phase 2 : Opérations essentielles
Après avoir assimilé les concepts, l'apprenant maîtrise les quatre opérations fondamentales : cloner un répertoire, récupérer les modifications avec fetch, envoyer les modifications avec push, et utiliser le raccourci pull.

### Phase 3 : Gestion avancée
La compréhension des branches distantes, du suivi des branches, et des configurations permet une utilisation plus efficace de Git dans les contextes collaboratifs réels.

### Phase 4 : Authentification sécurisée
L'adoption de SSH comme protocole d'authentification représente une évolution vers des pratiques de sécurité robustes, éliminant la nécessité de stocker des mots de passe en clair.

### Phase 5 : Optimisation
Enfin, les techniques de nettoyage et d'optimisation permettent de maintenir des répertoires Git efficients et performants à long terme.

Cette progression du simple au complexe, du conceptuel au pratique, établit une base solide pour la collaboration efficace dans les projets Git.[2][3][4]
