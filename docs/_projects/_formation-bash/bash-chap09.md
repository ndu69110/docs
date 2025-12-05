# Citations
- https://www.it-connect.fr/la-commande-chmod/
- https://www.linux.digibeatrix.com/fr/security-and-user-management/linux-chmod-permission-guide/
- http://doc.ubuntu-fr.org/permissions
- https://www.linuxtricks.fr/wiki/droits-sous-linux-utilisateurs-groupes-permissions
- https://linux.goffinet.org/administration/securite-locale/permissions-linux/
- https://labex.io/fr/tutorials/linux-how-to-elevate-linux-command-permissions-435783
- https://blog.stephane-robert.info/docs/admin-serveurs/linux/shells-linux/bash/


# Tokens
- prompt_tokens: 283
- completion_tokens: 5700
- total_tokens: 5983
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.086, 'request_cost': 0.006, 'total_cost': 0.092}


# Content
# Chapitre 9 : Les permissions sous Linux 🔐

## Introduction aux permissions

Les permissions constituent le fondement du système de sécurité sous Linux. Elles définissent qui peut accéder à un fichier ou un répertoire et quelles opérations sont autorisées. Chaque fichier et répertoire possède un ensemble de permissions qui régissent l'accès pour trois catégories d'utilisateurs : le propriétaire du fichier, les membres du groupe associé, et tous les autres utilisateurs.[1]

Les permissions Linux reposent sur trois types d'actions possibles : **la lecture (r)**, **l'écriture (w)** et **l'exécution (x)**. La lecture permet de voir le contenu d'un fichier ou de lister un répertoire. L'écriture permet de modifier un fichier, son contenu, ou d'ajouter et supprimer des fichiers dans un répertoire. L'exécution permet d'exécuter un fichier ou d'entrer dans un répertoire (permission nécessaire pour exécuter un script Bash, par exemple).[1]

## Afficher les permissions

### Utiliser la commande ls

Pour consulter les permissions d'un fichier ou d'un répertoire, la commande **ls -l** doit être utilisée.[1][2] Cette commande affiche les informations du fichier au format suivant :

```bash
ls -l
```

Un résultat typique ressemble à ceci :

```
-rw-r--r-- 1 user group 1234 Apr 13 2025 sample.txt
```

### Interpréter l'affichage des permissions

La chaîne de caractères `-rw-r--r--` situés à gauche représente les **autorisations d'accès** du fichier.[2] Cette chaîne se décompose de la manière suivante :

**Le premier caractère** indique le type de fichier :
- `-` : fichier ordinaire
- `d` : répertoire (directory)
- `l` : lien symbolique
- `b` : périphérique de type bloc
- `s` : socket

**Les 9 caractères restants** représentent les permissions divisées en trois blocs de trois caractères chacun :[1][2]

| Position | Caractères | Signification |
|----------|-----------|-----------------|
| 1-3 | Premier bloc | Permissions du **propriétaire** (user) |
| 4-6 | Deuxième bloc | Permissions du **groupe** (group) |
| 7-9 | Troisième bloc | Permissions des **autres** (others) |

Au sein de chaque bloc de trois caractères, l'ordre est toujours le même :

- **Position 1** : `r` (lecture) ou `-` (pas de lecture)
- **Position 2** : `w` (écriture) ou `-` (pas d'écriture)
- **Position 3** : `x` (exécution) ou `-` (pas d'exécution)

### Exemple d'interprétation

Prenons l'exemple `-rw-r--r--` :[2]

- `-` : c'est un fichier ordinaire
- `rw-` : le propriétaire peut **lire et écrire**, mais pas exécuter
- `r--` : le groupe peut **seulement lire**
- `r--` : les autres peuvent **seulement lire**

Cette configuration signifie que seul le propriétaire peut modifier ce fichier, tandis que tous les autres utilisateurs ne peuvent que le consulter.[2]

## Représentation numérique des permissions

### Conversion en notation octale

Les permissions peuvent également être exprimées de manière **numérique** ou **octale** (notation utilisant des chiffres de 0 à 7).[2] Chaque permission a une valeur numérique :

- `r` (lecture) = **4**
- `w` (écriture) = **2**
- `x` (exécution) = **1**

Pour déterminer la permission d'un bloc, il suffit d'additionner les valeurs :[3]

| Combinaison | Calcul | Valeur | Symbole | Signification |
|-------------|--------|--------|---------|-----------------|
| Aucun droit | - | 0 | `---` | Pas d'accès |
| Exécution seule | 1 | 1 | `--x` | Exécution uniquement |
| Écriture seule | 2 | 2 | `-w-` | Écriture uniquement |
| Écriture + exécution | 2+1 | 3 | `-wx` | Écriture et exécution |
| Lecture seule | 4 | 4 | `r--` | Lecture uniquement |
| Lecture + exécution | 4+1 | 5 | `r-x` | Lecture et exécution |
| Lecture + écriture | 4+2 | 6 | `rw-` | Lecture et écriture |
| Tous les droits | 4+2+1 | 7 | `rwx` | Lecture, écriture, exécution |

### Composition du mode numérique

Pour exprimer les permissions complètes d'un fichier en notation numérique, il faut combiner les chiffres des trois blocs (propriétaire, groupe, autres). Par exemple :[3]

- `755` signifie :
  - `7` (propriétaire) = lecture + écriture + exécution = `rwx`
  - `5` (groupe) = lecture + exécution = `r-x`
  - `5` (autres) = lecture + exécution = `r-x`

- `644` signifie :
  - `6` (propriétaire) = lecture + écriture = `rw-`
  - `4` (groupe) = lecture = `r--`
  - `4` (autres) = lecture = `r--`

### Configuration de permission `-rw-r--r--`

Pour définir les permissions à `-rw-r--r--`, il suffit de régler la permission sur `644` :[2]

- `6` = `rw-` (lecture + écriture pour le propriétaire)
- `4` = `r--` (lecture seule pour le groupe)
- `4` = `r--` (lecture seule pour les autres)

## Modifier les permissions avec chmod

### Syntaxe générale

La commande `chmod` permet de modifier les permissions d'accès des fichiers et répertoires.[1][2] Elle accepte deux formats de spécification : **numérique** et **symbolique**.

### Méthode numérique

La spécification numérique est la plus directe. Elle utilise le format : `chmod [permissions] [fichier]`[2]

**Exemples :**

```bash
chmod 755 script.sh
chmod 644 document.txt
chmod 600 confidential.txt
```

Le premier exemple accorde des permissions `755` au fichier `script.sh`, ce qui signifie que le propriétaire peut lire, écrire et exécuter le fichier, tandis que le groupe et les autres utilisateurs peuvent seulement le lire et l'exécuter.[2]

### Méthode symbolique

La méthode symbolique utilise des lettres pour spécifier les permissions. Elle offre plus de flexibilité car elle permet de modifier seulement certaines permissions sans les réécrire entièrement.[1]

La syntaxe est : `chmod [qui][opération][permissions] [fichier]`

**Les catégories d'utilisateurs :**

| Symbole | Signification |
|---------|-----------------|
| `u` | **user** (propriétaire) |
| `g` | **group** (groupe) |
| `o` | **others** (autres) |
| `a` | **all** (tous les utilisateurs, équivalent de "ugo") |

**Les opérations :**

| Symbole | Signification |
|---------|-----------------|
| `+` | Ajoute la permission |
| `-` | Retire la permission |
| `=` | Modifie la permission actuelle (écrase complètement) |

**Les permissions :**

| Symbole | Signification |
|---------|-----------------|
| `r` | **read** (lecture) |
| `w` | **write** (écriture) |
| `x` | **execute** (exécution) |

### Exemples pratiques avec la méthode symbolique

**Ajouter le droit de lecture à tout le monde :**

```bash
chmod a+r fichier
```

Cette commande ajoute la permission de lecture pour le propriétaire, le groupe et les autres.[4]

**Ajouter le droit de modification au groupe :**

```bash
chmod g+w fichier
```

Le groupe peut désormais modifier le fichier.[4]

**Retirer le droit de lecture aux autres :**

```bash
chmod o-r fichier
```

Les utilisateurs autres que le propriétaire et le groupe ne peuvent plus lire le fichier.[4]

**Enlever le droit d'écriture pour les autres :**

```bash
chmod o-w fichier3
```

**Ajouter le droit d'exécution à tout le monde :**

```bash
chmod a+x fichier
```

**Combiner plusieurs opérations :**

```bash
chmod u+rwx,g+rx-w,o+r-wx fichier3
```

Cette commande applique les trois modifications suivantes :[3]
- Ajoute la permission de lecture, d'écriture et d'exécution au propriétaire
- Ajoute la permission de lecture et d'exécution au groupe, puis retire l'écriture
- Ajoute la permission de lecture aux autres, puis retire l'écriture et l'exécution

### Cas d'usage courants

**Rendre un script exécutable :**

```bash
chmod +x monscript.sh
chmod a+x monscript.sh
```

Ou avec la méthode numérique :[2]

```bash
chmod 755 script.sh
```

**Fichiers sensibles (accès propriétaire seul) :**

```bash
chmod 600 fichier_sensible
```

Cette configuration (`-rw-------`) signifie que seul le propriétaire peut lire et écrire le fichier.[2]

**Répertoires privés :**

```bash
chmod 700 repertoire_prive
```

Cette configuration (`-rwx------`) signifie que seul le propriétaire peut accéder au répertoire.[2]

### Vérifier les modifications

Après avoir défini les permissions avec `chmod`, il est recommandé de toujours vérifier le résultat avec `ls -l` :[2]

```bash
chmod 755 backup.sh
ls -l backup.sh
```

Pour vérifier plusieurs fichiers à la fois, utiliser un pipe :

```bash
ls -l | grep '.sh'
```

Cela affiche uniquement les fichiers avec l'extension `.sh` (script shell).[2]

## Fonctionnement détaillé des permissions

### Permissions et fichiers

Pour les fichiers ordinaires, les trois permissions jouent les rôles suivants :

**Lecture (r)** : Permet de lire le contenu du fichier. Sans cette permission, il est impossible d'afficher ou de copier le fichier.

**Écriture (w)** : Permet de modifier le contenu du fichier. Sans cette permission, même le propriétaire ne peut pas le modifier.

**Exécution (x)** : Permet d'exécuter le fichier comme un programme ou un script. Cette permission est essentielle pour les scripts shell.

### Permissions et répertoires

Pour les répertoires, les permissions fonctionnent différemment :

**Lecture (r)** : Permet de lister le contenu du répertoire (utiliser `ls`).

**Écriture (w)** : Permet de créer, supprimer ou renommer des fichiers à l'intérieur du répertoire. Cette permission modifie directement le contenu du répertoire.

**Exécution (x)** : Permet de **traverser** le répertoire, c'est-à-dire d'entrer dedans et d'accéder aux fichiers qu'il contient. Cette permission est crucial pour accéder aux fichiers d'un répertoire.

## Les utilisateurs sous Linux

### Ajouter un utilisateur

Pour créer un nouvel utilisateur, utiliser la commande `useradd` ou `adduser` (selon la distribution Linux) :[1]

```bash
sudo useradd nouveau_utilisateur
```

Ou avec plus d'options :

```bash
sudo useradd -m -s /bin/bash -c "Nom Complet" nouveau_utilisateur
```

Les options principales sont :
- `-m` : crée le répertoire personnel (home) de l'utilisateur
- `-s` : spécifie le shell par défaut
- `-c` : ajoute un commentaire (généralement le nom complet)

### Attribuer un mot de passe

```bash
sudo passwd nouveau_utilisateur
```

Cette commande demande de saisir et confirmer le mot de passe du nouvel utilisateur.

### Supprimer un utilisateur

```bash
sudo userdel utilisateur
```

Pour supprimer également le répertoire personnel :

```bash
sudo userdel -r utilisateur
```

L'option `-r` supprime le répertoire personnel et son contenu.

### Lister les utilisateurs

Les utilisateurs sont stockés dans le fichier `/etc/passwd`. Pour afficher tous les utilisateurs :

```bash
cat /etc/passwd
```

Chaque ligne représente un utilisateur avec le format : `nom:mot_de_passe_chiffré:UID:GID:commentaire:home:shell`

Pour afficher les utilisateurs actuellement connectés :

```bash
who
w
```

## Les groupes en détail

### Concept des groupes

Un groupe sous Linux est un ensemble d'utilisateurs. Les groupes permettent d'attribuer des permissions à plusieurs utilisateurs simultanément sans devoir les configurer individuellement. Par exemple, tous les développeurs d'une équipe peuvent faire partie du groupe `developers`, ce qui permet de leur accorder des permissions sur des fichiers partagés de manière centralisée.[1]

### Ajouter un groupe

Pour créer un nouveau groupe :

```bash
sudo groupadd nom_groupe
```

### Supprimer un groupe

```bash
sudo groupdel nom_groupe
```

### Ajouter un utilisateur à un groupe

```bash
sudo usermod -a -G nom_groupe utilisateur
```

L'option `-a` ajoute l'utilisateur au groupe (sans le retirer des autres groupes).
L'option `-G` spécifie le groupe secondaire.

### Afficher les groupes d'un utilisateur

```bash
groups utilisateur
```

Ou pour l'utilisateur actuel :

```bash
groups
```

### Afficher tous les groupes

Les groupes sont stockés dans le fichier `/etc/group` :

```bash
cat /etc/group
```

Chaque ligne a le format : `nom:mot_de_passe:GID:liste_d'utilisateurs`

### Exemple pratique

Créer un groupe pour des développeurs et ajouter des utilisateurs :

```bash
sudo groupadd developers
sudo usermod -a -G developers alice
sudo usermod -a -G developers bob
sudo usermod -a -G developers charlie
```

Vérifier :

```bash
cat /etc/group | grep developers
```

Résultat :

```
developers:x:1001:alice,bob,charlie
```

## Modifier les propriétaires de fichiers

### Concept de propriété

Chaque fichier et répertoire possède un propriétaire (l'utilisateur qui l'a créé ou à qui il a été attribué) et un groupe propriétaire. Le propriétaire dispose généralement de plus de permissions sur le fichier que les autres utilisateurs.[2]

### Afficher le propriétaire

La commande `ls -l` affiche le propriétaire et le groupe :

```bash
ls -l fichier.txt
```

Résultat :

```
-rw-r--r-- 1 alice developers 1234 Apr 13 2025 fichier.txt
```

Le propriétaire est `alice` et le groupe propriétaire est `developers`.

### Changer le propriétaire avec chown

La commande `chown` (change owner) modifie le propriétaire d'un fichier :[2]

```bash
sudo chown utilisateur fichier
```

**Exemple :**

```bash
sudo chown bob fichier.txt
```

Le fichier `fichier.txt` appartient désormais à `bob`.

### Changer le groupe propriétaire

Changer seulement le groupe :

```bash
sudo chown :nouveau_groupe fichier
```

**Exemple :**

```bash
sudo chown :developers fichier.txt
```

Le groupe propriétaire devient `developers`, le propriétaire reste inchangé.

### Changer le propriétaire et le groupe

Pour changer à la fois le propriétaire et le groupe :

```bash
sudo chown utilisateur:groupe fichier
```

**Exemple :**

```bash
sudo chown alice:developers fichier.txt
```

### Modifier récursivement

L'option `-R` (récursive) modifie le propriétaire et le groupe d'un répertoire et de tout son contenu :

```bash
sudo chown -R utilisateur:groupe repertoire
```

**Exemple :**

```bash
sudo chown -R alice:developers /home/alice/projet/
```

### Exemples pratiques

**Créer un projet partagé :**

```bash
sudo mkdir /home/projets/monprojet
sudo chown alice:developers /home/projets/monprojet
sudo chmod 770 /home/projets/monprojet
```

Cette configuration permet à `alice` et tous les membres du groupe `developers` d'accéder au répertoire (lecture, écriture, exécution), tandis que les autres utilisateurs n'y ont aucun accès.

**Transférer la propriété d'un fichier :**

```bash
sudo chown bob:bob document.txt
ls -l document.txt
```

Résultat :

```
-rw-r--r-- 1 bob bob 4567 Apr 13 2025 document.txt
```

## Répartition pratique des tâches et flux de travail

### Scénario 1 : Rendre un script exécutable

Un développeur crée un script shell mais obtient un message d'erreur lors de son exécution :[2]

```bash
./monscript.sh
```

Erreur :

```
bash: ./monscript.sh: Permission denied
```

**Diagnostic :** Le fichier ne possède pas la permission d'exécution (x).

**Solution :**

```bash
chmod +x monscript.sh
```

Ou avec la méthode numérique :

```bash
chmod 755 monscript.sh
```

Vérification :

```bash
ls -l monscript.sh
./monscript.sh
```

Résultat :

```
-rwxrwxr-x. 1 francois francois 51 17 jan 05:02 monscript.sh
```

Le script s'exécute maintenant correctement.[5]

### Scénario 2 : Protéger un fichier de configuration sensible

Un administrateur a créé un fichier de configuration contenant des mots de passe :

```bash
# Configuration sensible
chmod 600 /etc/config/credentials.conf
ls -l /etc/config/credentials.conf
```

Résultat :

```
-rw------- 1 admin admin 2345 Apr 13 2025 /etc/config/credentials.conf
```

Seul le propriétaire (`admin`) peut lire et écrire le fichier. Personne d'autre n'a accès.[2]

### Scénario 3 : Configuration d'un répertoire partagé en équipe

Une équipe de développeurs doit collaborer sur un projet. L'administrateur configure :

```bash
# Créer le répertoire
sudo mkdir -p /home/projets/webapp

# Assigner le propriétaire et le groupe
sudo chown alice:developers /home/projets/webapp

# Attribuer les permissions
sudo chmod 770 /home/projets/webapp

# Vérifier
ls -ld /home/projets/webapp
```

Résultat :

```
drwxrwx--- 1 alice developers 4096 Apr 13 2025 /home/projets/webapp
```

- Le propriétaire (`alice`) peut lire, écrire et entrer dans le répertoire
- Les membres du groupe `developers` peuvent aussi lire, écrire et entrer
- Les autres utilisateurs n'ont aucun accès[2]

### Scénario 4 : Rendre un programme accessible à tous

Une entreprise installe un logiciel qui doit être exécutable par tous les utilisateurs :

```bash
# Assigner le programme au root
sudo chown root:root /usr/local/bin/monprogramme

# Permissions : propriétaire peut tout faire, groupe et autres peuvent exécuter
sudo chmod 755 /usr/local/bin/monprogramme

# Vérifier
ls -l /usr/local/bin/monprogramme
```

Résultat :

```
-rwxr-xr-x 1 root root 45678 Apr 13 2025 /usr/local/bin/monprogramme
```

Tous les utilisateurs peuvent exécuter le programme, mais seul `root` peut le modifier.[2]

## Cas particuliers et erreurs courantes

### Erreur « Permission denied »

**Symptôme :** `bash: ./script.sh: Permission denied`[2]

**Cause :** Le fichier n'a pas la permission d'exécution (x).

**Solution :**

```bash
chmod +x script.sh
```

### Fichier créé sans permission de lecture

**Symptôme :** Impossible de lire un fichier créé.

**Cause :** Les permissions par défaut (umask) ont restreint l'accès.

**Solution :**

```bash
chmod +r fichier
```

### Impossible de supprimer un fichier dans un répertoire

**Cause :** Manque de permission d'écriture (w) sur le répertoire contenant le fichier.

**Solution :**

```bash
chmod u+w /chemin/vers/repertoire
```

### Accès refusé à un répertoire

**Cause :** Manque de permission d'exécution (x) sur le répertoire.

**Solution :**

```bash
chmod u+x /chemin/vers/repertoire
```

## Bonnes pratiques de sécurité

### Principes généraux

**Appliquer le principe du moindre privilège :** N'accorder que les permissions strictement nécessaires. Par exemple, un fichier de script ne devrait avoir la permission d'écriture que pour le propriétaire.[2]

**Vérifier régulièrement les permissions :** Utiliser `ls -l` ou des outils spécialisés pour auditer les permissions de fichiers importants.

**Documenter les changements :** Noter quand et pourquoi les permissions ont été modifiées.

### Permissions recommandées

| Type de fichier | Permission | Notation octale | Justification |
|-----------------|-----------|-----------------|-----------------|
| Fichier ordinaire | `-rw-r--r--` | 644 | Propriétaire peut lire/écrire, autres en lecture |
| Script exécutable | `-rwxr-xr-x` | 755 | Propriétaire peut tout faire, autres exécutent |
| Fichier sensible | `-rw-------` | 600 | Accès propriétaire uniquement |
| Répertoire partagé | `drwxrwx---` | 770 | Propriétaire et groupe ont accès, autres non |
| Répertoire privé | `drwx------` | 700 | Accès propriétaire uniquement |
| Répertoire public | `drwxr-xr-x` | 755 | Tous peuvent lire et traverser |

## Résumé du chemin d'apprentissage

La maîtrise des permissions sous Linux nécessite une compréhension progressive :

**Étape 1 - Comprendre la structure :** Apprendre à lire les neuf caractères de permissions avec `ls -l` et comprendre les trois catégories d'utilisateurs (propriétaire, groupe, autres).

**Étape 2 - Maîtriser les deux notations :** Comprendre la notation symbolique (rwx) et la notation octale (0-7) pour pouvoir utiliser indifféremment l'une ou l'autre.

**Étape 3 - Utiliser chmod :** Modifier les permissions en utilisant d'abord la méthode numérique (plus simple), puis la méthode symbolique (plus flexible).

**Étape 4 - Gérer les utilisateurs et groupes :** Créer et configurer des utilisateurs, les organiser en groupes, et comprendre comment cela impact les permissions.

**Étape 5 - Modifier la propriété :** Utiliser `chown` pour assigner correctement les fichiers aux utilisateurs et groupes appropriés.

**Étape 6 - Appliquer en pratique :** Implémenter des scénarios réels : protéger des fichiers sensibles, créer des espaces partagés en équipe, gérer des scripts et programmes.

**Étape 7 - Maîtriser la sécurité :** Appliquer les bonnes pratiques de sécurité et éviter les erreurs courantes qui pourraient comprometttre la sécurité du système.

Cette progression permet de passer de la théorie à la pratique de manière progressive et logique, chaque concept s'appuyant sur le précédent.
