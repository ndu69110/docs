# Citations
- https://www.hostwinds.fr/tutorials/how-to-use-nano-editor-linux
- https://www.hostinger.com/fr/tutoriels/nano
- https://blog.stephane-robert.info/docs/admin-serveurs/linux/nano/
- https://labex.io/fr/tutorials/linux-linux-simple-text-editing-271339
- https://tuto.joliciel.org/docs/OPS/Linux/Installer_utiliser_nano/
- https://www.youtube.com/watch?v=CTOfEcT7B1g
- http://doc.ubuntu-fr.org/nano
- https://www.youtube.com/watch?v=gKCmyYLyMIw
- https://www.framboise314.fr/wp-content/uploads/2018/09/Utiliser_nano.pdf
- https://nfrappe.fr/doc-0/doku.php?id=logiciel%3Asysteme%3Aediteurs%3Anano%3Astart


# Tokens
- prompt_tokens: 286
- completion_tokens: 4803
- total_tokens: 5089
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.072, 'request_cost': 0.006, 'total_cost': 0.079}


# Content
# Chapitre 6 : Lire, modifier et compresser des fichiers

## Les extensions de fichier et la commande file

### Comprendre les extensions de fichier sous Linux

Contrairement à Windows, Linux ne dépend pas des extensions de fichier pour identifier le type d'un fichier. Le système utilise plutôt les **informations internes du fichier** (magic numbers) pour déterminer sa nature réelle. Les extensions servent principalement de **convention de nommage** pour les utilisateurs et les applications.

Sous Linux, les extensions courantes incluent :

- `.txt` pour les fichiers texte brut
- `.sh` pour les scripts shell
- `.log` pour les fichiers journaux
- `.tar`, `.gz`, `.bz2` pour les archives compressées
- `.conf` pour les fichiers de configuration
- `.bin` pour les fichiers binaires exécutables

### La commande file

La commande `file` permet d'identifier le type réel d'un fichier en inspectant son contenu plutôt que son extension[1]. Cette commande lit les premiers octets du fichier (les magic numbers) pour déterminer son type.

**Syntaxe basique :**

```bash
file nom_du_fichier
```

**Exemples pratiques :**

```bash
file /etc/passwd
# Résultat : ASCII text

file /bin/bash
# Résultat : ELF 64-bit LSB executable

file image.jpg
# Résultat : JPEG image data, JFIF standard

file archive.tar.gz
# Résultat : gzip compressed data, from Unix
```

**Options utiles :**

```bash
# Afficher le type MIME
file -i document.pdf
# Résultat : application/pdf; charset=binary

# Analyser plusieurs fichiers
file /etc/hostname /etc/hosts /etc/fstab

# Inclure les fichiers spéciaux (sockets, pipes)
file -s /dev/sda
```

### Cas d'usage pratique

La commande `file` devient indispensable lors de la gestion de fichiers sans extension ou avec une extension erronée :

```bash
# Un fichier nommé "document" sans extension
file document
# Affiche le type réel du fichier

# Vérifier l'intégrité d'un téléchargement
file fichier_telecharge
```

---

## Compresser des fichiers

### Principes fondamentaux de la compression

La compression réduit la taille des fichiers en éliminant les données redondantes. Linux propose plusieurs algorithmes de compression avec des **niveaux de compression** différents affectant la taille finale et le temps de traitement.

### L'outil gzip

**gzip** est l'utilitaire de compression le plus courant sous Linux. Il utilise l'algorithme DEFLATE et crée des fichiers avec l'extension `.gz`.

**Compression simple :**

```bash
gzip fichier.txt
# Crée : fichier.txt.gz (fichier original supprimé)
```

**Compression sans supprimer l'original :**

```bash
gzip -c fichier.txt > fichier.txt.gz
```

**Niveaux de compression (1-9) :**

```bash
# Compression rapide mais moins efficace
gzip -1 fichier.txt

# Compression optimale (défaut : niveau 6)
gzip -9 fichier.txt
```

**Décompression :**

```bash
gunzip fichier.txt.gz
# Ou
gzip -d fichier.txt.gz
```

**Afficher le contenu sans décompresser :**

```bash
zcat fichier.txt.gz
zless fichier.txt.gz
```

### L'outil bzip2

**bzip2** offre une meilleure compression que gzip mais est plus lent. Les fichiers générés utilisent l'extension `.bz2`.

```bash
# Compresser
bzip2 fichier.txt

# Décompresser
bunzip2 fichier.txt.bz2
# Ou
bzip2 -d fichier.txt.bz2

# Afficher le contenu
bzcat fichier.txt.bz2
```

### L'outil xz

**xz** offre la meilleure compression mais au détriment de la vitesse. Extension : `.xz`.

```bash
# Compresser
xz fichier.txt

# Décompresser
unxz fichier.txt.xz
# Ou
xz -d fichier.txt.xz

# Afficher le contenu
xzcat fichier.txt.xz
```

### Comparaison des algorithmes

| Algorithme | Extension | Vitesse | Compression | Utilisation |
|-----------|-----------|---------|-------------|-----------|
| gzip | .gz | Rapide | Moyenne | Général, archives web |
| bzip2 | .bz2 | Lent | Bonne | Distributions Linux |
| xz | .xz | Très lent | Excellente | Fichiers de source, distributions |

### Cas d'usage pratique : compression d'un répertoire

Bien que la compression simple s'applique à des fichiers individuels, les répertoires complets nécessitent d'abord une archivage :

```bash
# Créer une archive compressée
tar -czf backup.tar.gz /chemin/vers/repertoire/

# Créer une archive avec bzip2
tar -cjf backup.tar.bz2 /chemin/vers/repertoire/

# Créer une archive avec xz
tar -cJf backup.tar.xz /chemin/vers/repertoire/
```

---

## L'éditeur de texte nano

### Introduction à nano

Nano est un **éditeur de texte en ligne de commande** simple et convivial, déjà installé sur la plupart des distributions Linux[3]. Contrairement à des éditeurs comme Vim ou Emacs, nano ne nécessite pas d'apprentissage complexe et constitue l'outil idéal pour les débutants[4].

### Installation

Sur les distributions basées sur Debian/Ubuntu :

```bash
sudo apt-get install nano
```

Sur les distributions basées sur CentOS/RHEL :

```bash
yum install nano
```

Nano est généralement préinstallé, cette étape n'est donc souvent pas nécessaire[2].

### Créer et ouvrir des fichiers

**Créer un nouveau fichier :**

```bash
nano newfile.txt
```

**Ouvrir un fichier existant :**

```bash
nano existingfile.txt
```

Une nouvelle fenêtre s'ouvre affichant l'interface de l'éditeur. Les touches fléchées du clavier permettent de déplacer le curseur[2].

### Raccourcis clavier essentiels

#### Navigation dans le fichier

| Action | Raccourci |
|--------|-----------|
| Début de ligne | `Ctrl + A` |
| Fin de ligne | `Ctrl + E` |
| Aller à une ligne spécifique | `Ctrl + _` puis numéro |
| Page précédente | `Ctrl + Y` |
| Page suivante | `Ctrl + V` |
| Déplacer caractère par caractère | Flèches du clavier |

#### Édition de texte

| Action | Raccourci |
|--------|-----------|
| Enregistrer le fichier | `Ctrl + O` |
| Quitter nano | `Ctrl + X` |
| Couper la ligne en cours | `Ctrl + K` |
| Coller | `Ctrl + U` |
| Justifier un paragraphe | `Ctrl + J` |
| Annuler | `Ctrl + _` puis `U` |
| Afficher la position du curseur | `Ctrl + C` |
| Insérer un fichier | `Ctrl + R` |

#### Recherche et remplacement

| Action | Raccourci |
|--------|-----------|
| Chercher du texte | `Ctrl + W` |
| Recherche et remplacement | `Ctrl + \` |

#### Sélection de texte

Pour sélectionner du texte afin de le couper ou le copier :

```bash
# Activer/désactiver la marque
Alt + A

# Couper la sélection
Ctrl + K
```

### Flux de travail typique

1. Ouvrir le fichier : `nano nom_fichier`
2. Éditer le contenu en utilisant les flèches et les touches
3. Enregistrer : `Ctrl + O` puis appuyer sur Entrée
4. Quitter : `Ctrl + X`

Si des modifications n'ont pas été enregistrées, nano invite à sauvegarder avant la fermeture.

### Configuration avancée de nano

La configuration de nano s'effectue via le fichier `~/.nanorc`. Pour éditer ce fichier :

```bash
nano ~/.nanorc
```

**Options de configuration courantes :**

```bash
# Afficher les numéros de ligne
set linenumbers

# Retour automatique à la ligne
set softwrap

# Définir la taille de tabulation à 4 espaces
set tabsize 4

# Conserver l'indentation d'une ligne à l'autre
set autoindent

# Activer la souris pour cliquer et déplacer le curseur
set mouse

# Activer la coloration syntaxique pour Python
include "/usr/share/nano/python.nanorc"

# Activer la coloration syntaxique pour HTML
include "/usr/share/nano/html.nanorc"
```

**Application de la coloration syntaxique :**

Après modification du fichier `.nanorc`, les changements s'appliquent au prochain lancement de nano[1].

### Conseil d'apprentissage progressif

Il n'est pas nécessaire de mémoriser tous les raccourcis immédiatement[3]. L'apprentissage doit débuter par les opérations fondamentales :

- `Ctrl + O` (enregistrer)
- `Ctrl + X` (quitter)
- `Ctrl + W` (chercher)
- `Ctrl + K` / `Ctrl + U` (couper/coller)

Les autres raccourcis s'intègrent progressivement selon les besoins. Rappel : tous les raccourcis disponibles s'affichent en bas de l'écran pendant l'utilisation de nano, aucune mémorisation complète n'est donc requise[3].

---

## Lire efficacement des fichiers avec less, tail et head

### Principes d'affichage des fichiers

Afficher le contenu complet d'un fichier volumineux dans le terminal n'est pas toujours efficace. Linux propose des outils spécialisés permettant une navigation fluide et un affichage partiel des contenus.

### L'outil cat

**cat** affiche le contenu complet d'un fichier dans le terminal :

```bash
cat /etc/passwd
```

Cet outil devient impraticable pour les fichiers volumineux, car l'affichage défile rapidement sans possibilité de pause.

### L'outil head

**head** affiche les premières lignes d'un fichier. Par défaut, elle affiche 10 lignes.

```bash
# Afficher les 10 premières lignes (par défaut)
head /etc/passwd

# Afficher les 20 premières lignes
head -n 20 /etc/passwd

# Afficher les 5 premiers caractères
head -c 5 /etc/passwd
```

### L'outil tail

**tail** affiche les dernières lignes d'un fichier. Très utile pour consulter les fichiers journaux.

```bash
# Afficher les 10 dernières lignes (par défaut)
tail /var/log/syslog

# Afficher les 20 dernières lignes
tail -n 20 /var/log/syslog

# Afficher les lignes à partir de la ligne 50
tail -n +50 /var/log/syslog

# Suivi en temps réel (très utile pour les logs)
tail -f /var/log/syslog

# Arrêter le suivi : Ctrl + C
```

### L'outil less

**less** est un visualiseur interactif permettant de naviguer dans un fichier avec une pagination complète. Contrairement à `more`, `less` permet la navigation aussi bien vers l'avant que vers l'arrière.

**Lancement :**

```bash
less /etc/passwd
```

**Commandes de navigation dans less :**

| Commande | Action |
|----------|--------|
| `Barre d'espace` | Avancer d'une page |
| `B` | Reculer d'une page |
| `G` | Aller à la fin du fichier |
| `1G` | Aller au début du fichier |
| `/texte` | Chercher du texte en avant |
| `?texte` | Chercher du texte en arrière |
| `N` | Aller à l'occurrence suivante |
| `Maj + N` | Aller à l'occurrence précédente |
| `=` | Afficher la position actuelle |
| `Q` | Quitter less |

### Cas d'usage pratique

**Consulter les fichiers journaux :**

```bash
# Voir les 50 dernières lignes du journal système
tail -n 50 /var/log/syslog

# Suivre un journal en temps réel
tail -f /var/log/apache2/access.log

# Naviguer dans un journal volumineux
less /var/log/auth.log
```

**Inspirer le début et la fin d'un fichier :**

```bash
# Voir l'en-tête d'un fichier CSV
head -n 5 data.csv

# Voir les derniers enregistrements
tail -n 10 data.csv
```

---

## Créer des archives

### Comprendre l'archivage versus la compression

L'**archivage** regroupe plusieurs fichiers et répertoires en un seul fichier conteneur. La **compression** réduit ensuite la taille de cet archive. Ces deux opérations sont souvent combinées.

### L'outil tar

**tar** (Tape Archive) crée des archives contenant plusieurs fichiers et répertoires, préservant la structure hiérarchique[1].

**Syntaxe de base :**

```bash
tar [options] [archive.tar] [fichiers/répertoires]
```

### Options principales de tar

| Option | Signification |
|--------|---------------|
| `c` | Créer une archive |
| `x` | Extraire une archive |
| `v` | Mode verbeux (afficher les fichiers traités) |
| `f` | Spécifier le nom du fichier archive |
| `z` | Compresser/décompresser avec gzip (.tar.gz) |
| `j` | Compresser/décompresser avec bzip2 (.tar.bz2) |
| `J` | Compresser/décompresser avec xz (.tar.xz) |

### Créer des archives

**Archive simple sans compression :**

```bash
# Créer une archive
tar -cvf backup.tar /home/user/documents/

# Lister le contenu sans extraire
tar -tvf backup.tar
```

**Archive compressée avec gzip :**

```bash
# Créer et compresser
tar -czf backup.tar.gz /home/user/documents/

# Afficher le contenu du .tar.gz
tar -tzf backup.tar.gz
```

**Archive compressée avec bzip2 :**

```bash
# Créer et compresser
tar -cjf backup.tar.bz2 /home/user/documents/

# Afficher le contenu
tar -tjf backup.tar.bz2
```

**Archive compressée avec xz :**

```bash
# Créer et compresser
tar -cJf backup.tar.xz /home/user/documents/

# Afficher le contenu
tar -tJf backup.tar.xz
```

### Extraire des archives

**Extraire une archive simple :**

```bash
# Extraire dans le répertoire courant
tar -xvf backup.tar

# Extraire dans un répertoire spécifique
tar -xvf backup.tar -C /destination/
```

**Extraire une archive compressée :**

```bash
# gzip (tar reconnaît automatiquement le format)
tar -xzf backup.tar.gz

# bzip2
tar -xjf backup.tar.bz2

# xz
tar -xJf backup.tar.xz

# Ou simplement (tar détecte automatiquement)
tar -xf backup.tar.gz
```

### Cas d'usage pratique : créer une sauvegarde complète

```bash
# Créer une sauvegarde datée et compressée du répertoire personnel
tar -czf backup_$(date +%Y%m%d).tar.gz /home/user/

# Créer une archive excluant certains répertoires
tar -czf backup.tar.gz --exclude='.cache' --exclude='.tmp' /home/user/

# Créer une archive à partir d'une liste de fichiers
tar -czf selection.tar.gz /home/user/documents/ /home/user/images/ /etc/hostname
```

### Comparaison des formats d'archive

| Format | Taille | Vitesse | Utilisation |
|--------|--------|---------|------------|
| .tar | Très grande | Instantanée | Archivage seul |
| .tar.gz | Moyenne | Rapide | Sauvegarde générale |
| .tar.bz2 | Petite | Lent | Distributions Linux |
| .tar.xz | Très petite | Très lent | Distributions, sources |

---

## Parcours d'apprentissage intégré

### Phase 1 : Fondations (Semaine 1)

L'apprentissage débute par la compréhension des **types de fichiers** et l'utilisation de la commande `file` pour identifier les contenus. Cette étape établit les bases conceptuelles nécessaires.

L'apprenant exécute plusieurs commandes `file` sur des fichiers variés du système pour comprendre comment Linux catégorise les contenus indépendamment des extensions.

### Phase 2 : Édition simple (Semaine 2)

Après cette introduction, l'apprenant maîtrise **nano** en commençant par les opérations basiques : créer un fichier, éditer du texte, enregistrer et quitter. Cette phase met l'accent sur l'acquisition de confiance plutôt que la mémorisation complète des raccourcis.

Des exercices pratiques incluent la création de scripts simples, la modification de fichiers de configuration et l'utilisation des raccourcis fondamentaux.

### Phase 3 : Consultation efficace (Semaine 3)

Une fois à l'aise avec l'édition, l'apprenant apprend à **lire efficacement** les fichiers volumineux en utilisant `head`, `tail` et `less`. Cette étape introduit les patterns réels de travail : consulter les journaux système, inspecter les premières lignes de fichiers de données, naviguer dans les fichiers de configuration.

Des cas d'usage pratiques incluent la surveillance en temps réel avec `tail -f` et la navigation interactive avec `less`.

### Phase 4 : Gestion des espaces disque (Semaine 4)

La **compression** et l'**archivage** arrivent une fois que l'apprenant maîtrise la lecture et la modification de fichiers individuels. Cette phase traite de la gestion efficace des ressources disque.

L'apprenant crée des archives de sauvegarde, compare l'efficacité des différents algorithmes de compression et met en place une stratégie de sauvegarde simple mais efficace.

### Intégration progressive

Chaque étape renforce les connaissances précédentes :

1. Identifier les fichiers avec `file` permet de savoir quand utiliser nano ou `less`
2. Maîtriser nano permet de créer les fichiers avant de les archiver
3. Utiliser `head` et `tail` aide à inspecter les contenus avant archivage
4. Créer des archives et les compresser met en pratique toutes les compétences précédentes

### Exercices pratiques d'intégration

**Exercice 1 : Inspection et édition**

```bash
# 1. Identifier le type d'un fichier
file /etc/hostname

# 2. Éditer le fichier avec nano
nano /etc/hostname

# 3. Consulter les premières lignes
head /etc/hosts

# 4. Consulter les dernières lignes du journal
tail /var/log/syslog
```

**Exercice 2 : Archivage d'un projet**

```bash
# 1. Créer une structure de projet
mkdir -p projet/src projet/docs

# 2. Créer des fichiers avec nano
nano projet/src/main.sh
nano projet/docs/README.txt

# 3. Compresser l'archive
tar -czf projet_backup.tar.gz projet/

# 4. Vérifier l'archive
tar -tzf projet_backup.tar.gz

# 5. Nettoyer et extraire ailleurs
rm -rf projet
tar -xzf projet_backup.tar.gz
```

**Exercice 3 : Gestion des logs**

```bash
# 1. Consulter les dernières entrées
tail -n 20 /var/log/auth.log

# 2. Suivre un log en temps réel
tail -f /var/log/syslog

# 3. Naviguer dans un log volumineux
less /var/log/auth.log

# 4. Archiver les anciens logs
tar -czf logs_archive_$(date +%Y%m%d).tar.gz /var/log/*.log.1
```

Ce parcours d'apprentissage assure une progression logique où chaque compétence s'appuie sur les précédentes, créant ainsi une base solide pour travailler efficacement avec les fichiers sous Linux.
