# Citations
- https://www.it-connect.fr/debuter-script-bash-linux/
- https://blog.stephane-robert.info/docs/admin-serveurs/linux/shells-linux/bash/
- https://www.metal3d.org/blog/2023/bien-configurer-son-terminal-bash/
- https://www.youtube.com/watch?v=RzzwzYjUX3k
- https://www.ionos.fr/digitalguide/serveur/configuration/commandes-linux/
- https://linux.goffinet.org/administration/le-shell/la-ligne-de-commande/
- https://serverspace.io/fr/support/help/bash-cheat-sheet/
- https://openclassrooms.com/fr/courses/7274161-administrez-un-systeme-linux/7529311-lancez-des-commandes-sous-bash
- http://doc.ubuntu-fr.org/tutoriel/script_shell
- https://www.mode83.net/atelier/centre_ressources/crs_fichiers/Formation/OSR2K9/Linux/Programmation%20Bash.pdf


# Tokens
- prompt_tokens: 286
- completion_tokens: 5017
- total_tokens: 5303
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.075, 'request_cost': 0.006, 'total_cost': 0.082}


# Content
# Chapitre 2 : Présentation du Terminal

Le terminal Linux représente la porte d'entrée vers l'apprentissage de Bash et de l'administration système. Ce chapitre couvre les éléments fondamentaux nécessaires pour comprendre et utiliser efficacement l'interface en ligne de commande, en partant de l'ouverture du terminal jusqu'à la maîtrise des outils d'aide intégrés.

## Ouvrir le Terminal

### Accès au Terminal sous Linux

Le terminal est l'application qui permet d'accéder à l'interpréteur de commandes Bash. Sur la plupart des distributions Linux, plusieurs méthodes permettent d'y accéder[4].

La première approche consiste à naviguer jusqu'au menu des programmes et localiser l'application "Terminal". Dans des environnements de bureau comme Linux Mint ou Ubuntu, cette application est généralement visible dans le menu des applications ou accessible via une barre latérale dédiée[4]. Une fois lancée, une nouvelle fenêtre s'affiche avec une invite de commande clignotante, prête à recevoir des instructions.

Une deuxième méthode, plus rapide, utilise les raccourcis clavier. Sur la majorité des distributions Linux avec interface graphique, la combinaison **Ctrl+Alt+T** ouvre directement le terminal. Cette méthode s'avère particulièrement efficace pour les utilisateurs expérimentés qui travaillent régulièrement en ligne de commande.

### Composition de l'Invite de Commande

L'invite de commande (prompt) affichée au démarrage du terminal contient plusieurs informations essentielles. Généralement, elle se présente sous la forme suivante :

```
utilisateur@machine:~/répertoire$
```

Chaque élément de cette composition possède une signification distincte :

- **utilisateur** : le nom du compte connecté au système
- **machine** : le nom d'hôte ou l'identifiant de l'ordinateur
- **~/répertoire** : le chemin du répertoire actuel (le tilde ~ représente le répertoire utilisateur)
- **$** : symbole indiquant que l'utilisateur possède des droits normaux (le symbole # indique au contraire les droits administrateur ou root)

## Première Commande

### Exécuter une Commande Simple

La première étape pour interagir avec Bash consiste à exécuter une commande élémentaire. La commande **ls** (pour "list") représente un excellent point de départ pour débuter[4]. Cette commande affiche le contenu du répertoire actuel.

```bash
ls
```

L'exécution de cette commande fournit une liste simple des fichiers et des dossiers présents dans le répertoire courant. Le processus s'effectue comme suit : l'utilisateur tape la commande, puis appuie sur la touche **Entrée** (ou **Return**). Le système exécute immédiatement la commande et affiche le résultat avant de retourner à l'invite de commande.

### Options et Arguments

La commande **ls** accepte plusieurs options pour personnaliser son comportement et son affichage. Une option court est précédée d'un tiret unique, tandis qu'une option longue est précédée de deux tirets[4].

```bash
ls -l
```

L'option `-l` (long format) transforme l'affichage en une liste verticale détaillée, affichant des informations supplémentaires comme les permissions, le propriétaire, la taille et la date de modification de chaque fichier.

Une autre option utile est `-a` (all), qui affiche tous les fichiers, incluant les fichiers cachés (dont le nom commence par un point) :

```bash
ls -a
```

Il est possible de combiner plusieurs options en une seule commande :

```bash
ls -la
```

Cette commande affiche tous les fichiers (y compris les cachés) au format long détaillé.

Les arguments diffèrent des options : ils spécifient sur quel élément la commande doit opérer. Par exemple, pour lister le contenu d'un répertoire spécifique plutôt que le répertoire courant :

```bash
ls /home/utilisateur
```

Dans cet exemple, `/home/utilisateur` représente l'argument : la commande `ls` opère sur ce répertoire spécifique.

## Composition d'une Commande

### Structure générale

Comprendre la structure d'une commande Bash est fondamental pour utiliser efficacement le terminal[1]. Une commande Bash suit généralement cette structure :

```
commande [options] [arguments]
```

### Dissection d'une Commande Complète

Prenons comme exemple une commande plus complexe :

```bash
ls -l /home/flo
```

Dans cette commande :

- **ls** est le **programme** ou la **commande** à exécuter
- **-l** est une **option** qui modifie le comportement du programme (affichage long)
- **/home/flo** est l'**argument** qui spécifie le chemin sur lequel opérer

### Commandes Courantes et Leurs Composants

#### Commande pwd

La commande **pwd** (print working directory) affiche le répertoire de travail actuel[1]. Cette commande ne nécessite aucun argument obligatoire :

```bash
pwd
```

Résultat typique : `/home/utilisateur`

#### Commande cd

La commande **cd** (change directory) permet de naviguer entre les répertoires[1]. Elle requiert un argument : le répertoire destination.

```bash
cd /home/utilisateur/Documents
```

Cette commande change le répertoire courant vers `/home/utilisateur/Documents`. Le répertoire parent peut être atteint via :

```bash
cd ..
```

Le répertoire utilisateur personnel est accessible avec :

```bash
cd ~
```

#### Commande mkdir

La commande **mkdir** (make directory) crée un nouveau répertoire[1]. Elle prend en argument le nom du répertoire à créer :

```bash
mkdir MonDossier
```

Pour créer plusieurs répertoires imbriqués en une seule commande, l'option `-p` s'utilise :

```bash
mkdir -p Dossier1/Dossier2/Dossier3
```

#### Commande touch

La commande **touch** crée un fichier vide ou met à jour la date d'accès d'un fichier existant[1] :

```bash
touch MonFichier.txt
```

#### Commande rm

La commande **rm** (remove) supprime des fichiers ou des répertoires[1]. Pour supprimer un fichier :

```bash
rm MonFichier.txt
```

Pour supprimer un répertoire et son contenu, l'option `-r` (récursive) s'emploie :

```bash
rm -r MonDossier
```

## Terminal et Shell

### Distinction Fondamentale

Un élément crucial à comprendre est la différence entre le **terminal** et le **shell**. Ces deux termes sont souvent confondus par les débutants, mais ils désignent des éléments distincts du système.

### Le Terminal

Le **terminal** est l'**application graphique** qui fournit une interface permettant à l'utilisateur d'interagir avec le système d'exploitation. C'est essentiellement une fenêtre dans laquelle du texte peut être saisi et des résultats affichés. Le terminal est un programme émulateur qui simule le fonctionnement des anciens terminaux physiques utilisés autrefois pour communiquer avec les ordinateurs centraux.

### Le Shell

Le **shell** (littéralement "coquille") est l'**interpréteur de commandes** qui se positionne entre l'utilisateur et le système d'exploitation[1]. Il s'agit d'un logiciel responsable de l'interprétation et de l'exécution des commandes tapées par l'utilisateur.

**Bash** (Bourne Again Shell) représente l'un des shells les plus utilisés sur les systèmes Unix et Linux[1]. Il est présent par défaut sur la majorité des distributions Linux populaires, notamment Debian, Ubuntu, Rocky Linux et autres[1].

### Relation entre Terminal et Shell

Voici la relation fonctionnelle entre ces composants :

1. L'utilisateur ouvre une **fenêtre de terminal** (application graphique)
2. À l'intérieur de cette fenêtre, un **shell** (comme Bash) s'exécute
3. L'utilisateur tape des commandes dans le terminal
4. Le terminal transmet les commandes au shell
5. Le shell interprète les commandes et les exécute
6. Le shell retourne les résultats au terminal
7. Le terminal affiche les résultats à l'écran

D'autres shells existent également sur les systèmes Linux, comme **sh** (le shell original), **zsh** (un shell avancé), ou **fish** (friendly interactive shell). Cependant, Bash demeure le choix par défaut sur la plupart des installations Linux.

## Présentation du Manuel

### Importance de la Documentation

L'une des compétences les plus précieuses pour tout utilisateur Linux consiste à savoir consulter efficacement la documentation intégrée du système. Le **manuel** (man pages) représente la ressource fondamentale pour comprendre chaque commande, ses options, ses arguments et son fonctionnement détaillé[1].

### Accéder au Manuel

La commande **man** permet de consulter le manuel de n'importe quelle commande disponible sur le système[1]. La syntaxe générale est :

```bash
man nom_de_la_commande
```

Par exemple, pour consulter le manuel de la commande `ls` :

```bash
man ls
```

Cette commande ouvre une interface de lecture de texte dans le terminal. Le manuel affiche une documentation complète : une description générale, la liste de toutes les options disponibles, des exemples d'utilisation, et souvent des remarques importantes ou des comportements spécifiques.

### Navigation dans le Manuel

Une fois le manuel ouvert, plusieurs raccourcis clavier permettent de naviguer dans le texte[3] :

- **Barre d'espace** : avancer d'une page
- **B** : reculer d'une page
- **/terme** : rechercher un terme spécifique dans le document
- **N** : aller à l'occurrence suivante du terme recherché
- **Maj+N** : aller à l'occurrence précédente du terme recherché
- **G** : aller au début du document
- **Maj+G** : aller à la fin du document
- **Q** : quitter le manuel et retourner à l'invite de commande

### Structure du Manuel

Les pages de manuel suivent une structure standardisée qui facilite la recherche d'informations :

- **NAME** : le nom et une description courte de la commande
- **SYNOPSIS** : la syntaxe générale d'utilisation
- **DESCRIPTION** : une explication détaillée du fonctionnement
- **OPTIONS** : la liste complète des options disponibles avec leurs descriptions
- **EXAMPLES** : des exemples concrets d'utilisation
- **SEE ALSO** : des références vers d'autres commandes ou pages du manuel connexes

### Exemple Pratique

Consulter le manuel de `ls` révèle une richesse d'informations :

```bash
man ls
```

À l'intérieur du manuel, la section **SYNOPSIS** montre :

```
ls [OPTION]... [FILE]...
```

Cela indique que `ls` accepte zéro, une ou plusieurs options, suivies de zéro, un ou plusieurs fichiers. La section **OPTIONS** liste chaque option possible, par exemple :

- `-l` : long format, affichage détaillé
- `-a` : affiche tous les fichiers, incluant ceux commençant par un point
- `-h` : affiche les tailles en format lisible (K, M, G)
- `-t` : trie par date de modification

## Utilisation du Manuel et de Help

### La Commande help

En plus du manuel (`man`), Bash fournit une commande `help` pour obtenir une aide rapide sur les commandes intégrées au shell[1]. Ces commandes intégrées sont différentes des programmes externes ; elles font partie du shell lui-même.

```bash
help
```

Cette commande, exécutée seule, liste toutes les commandes intégrées de Bash. Pour obtenir de l'aide sur une commande spécifique intégrée au shell :

```bash
help cd
```

Cette commande affiche une aide rapide sur la commande `cd`, notamment ses options et son utilisation.

### Différence entre man et help

Il est important de distinguer les contextes où utiliser `man` par rapport à `help` :

- **help** s'utilise pour les commandes **intégrées au shell** (comme `cd`, `echo`, `type`)
- **man** s'utilise pour les **commandes externes** (des programmes distincts comme `ls`, `grep`, `sed`)

Certaines commandes possèdent les deux. Dans ce cas, `man` fournit généralement une documentation plus complète, tandis que `help` offre une aide rapide directe.

### Option --help

De nombreux programmes externes proposent également une option `--help` ou `-h` qui fournit une aide rapide sans ouvrir le manuel complet :

```bash
ls --help
```

Cette option affiche une aide synthétique directement dans le terminal. C'est souvent plus rapide que d'ouvrir le manuel complet avec `man` lorsqu'il s'agit de vérifier rapidement une option spécifique.

### Stratégie Recommandée

Pour un apprentissage efficace, la stratégie à adopter est :

1. Pour une aide **rapide et immédiate** : utiliser l'option `--help` ou `-h`
2. Pour une **documentation détaillée et des exemples** : consulter le manuel avec `man`
3. Pour les **commandes intégrées au shell** : privilégier `help`
4. Pour **approfondir les connaissances** : explorer des tutoriels en ligne et la documentation complète du système

## La Commande history et Raccourcis Clavier

### Consultation de l'Historique

La commande **history** affiche la liste de toutes les commandes exécutées précédemment dans le terminal[1]. Cette fonctionnalité s'avère extrêmement utile pour :

- Retrouver une commande complexe exécutée antérieurement
- Comprendre les opérations effectuées dans une session
- Automatiser des tâches récurrentes

```bash
history
```

Cette commande affiche un numéro avant chaque commande, facilitant sa réutilisation. Par exemple :

```
   45  ls -l
   46  cd Documents
   47  pwd
   48  mkdir Projets
```

### Réutiliser une Commande de l'Historique

Plusieurs méthodes permettent de réutiliser des commandes antérieures.

La première utilise **Ctrl+R** pour rechercher en arrière dans l'historique :

```
(reverse-i-search): `ls'
```

En tapant les premières lettres d'une commande, le terminal affiche la commande la plus récente correspondante. Appuyer plusieurs fois sur **Ctrl+R** parcourt d'autres correspondances antérieures.

Une deuxième approche utilise **!n** où n est le numéro de la commande dans l'historique :

```bash
!45
```

Cela réexécute la commande numéro 45 de l'historique.

La commande **!!** réexécute la dernière commande :

```bash
!!
```

### Raccourcis Clavier de Navigation

Au-delà de l'historique, plusieurs raccourcis clavier facilitent la navigation et l'édition dans le terminal[3] :

**Navigation horizontale dans la commande en cours :**

- **Ctrl+A** : placer le curseur au début de la ligne
- **Ctrl+E** : placer le curseur à la fin de la ligne
- **Ctrl+F** : avancer d'un caractère (forward)
- **Ctrl+B** : reculer d'un caractère (backward)

**Navigation par mots :**

- **Alt+F** : avancer d'un mot
- **Alt+B** : reculer d'un mot

**Suppression de caractères :**

- **Ctrl+D** : supprimer le caractère sous le curseur
- **Ctrl+H** : supprimer le caractère avant le curseur (équivalent à Backspace)
- **Ctrl+W** : supprimer le mot précédent
- **Alt+D** : supprimer le mot sous le curseur

**Modifications de la commande :**

- **Ctrl+K** : supprimer du curseur jusqu'à la fin de la ligne
- **Ctrl+U** : supprimer du début jusqu'au curseur
- **Ctrl+Y** : coller le texte supprimé précédemment
- **Ctrl+L** : effacer l'écran et placer le curseur au début

### Mise en Arrière-Plan

Un raccourci particulièrement utile est **Ctrl+Z**, qui met la commande en cours d'exécution en tâche de fond[3]. Cette fonctionnalité permet de suspendre temporairement une opération pour exécuter d'autres commandes.

```bash
[COMMANDE EN COURS]
Ctrl+Z
```

Pour revenir à la tâche suspendue, la commande `fg` (foreground) s'utilise :

```bash
fg
```

## Approfondissement Pratique

### Scénario d'Apprentissage Complet

Pour consolider la compréhension de ce chapitre, voici un scénario d'apprentissage progressif :

**Étape 1 : Maîtriser les Commandes de Base**

Commencer par explorer le système de fichiers en utilisant les commandes simples :

```bash
pwd
```

Affiche le répertoire courant, permettant de comprendre la notion de "chemin absolu".

```bash
ls
```

Liste les fichiers du répertoire courant. Observer la sortie et mémoriser les fichiers visibles.

```bash
ls -l
```

Affiche les mêmes fichiers mais avec plus de détails : permissions, propriétaire, taille, date.

```bash
cd /home
```

Change de répertoire. L'utilisateur comprend que son répertoire courant a changé en exécutant à nouveau `pwd`.

```bash
ls -la
```

Affiche maintenant tous les fichiers, incluant les fichiers cachés du répertoire `/home`.

**Étape 2 : Consulter la Documentation**

Une fois les commandes de base exécutées, consulter leur documentation :

```bash
man ls
```

Parcourir le manuel, reconnaître sa structure, rechercher une option spécifique avec `/`.

```bash
ls --help
```

Comparer l'aide rapide avec le manuel complet. Observer comment les options sont présentées différemment.

```bash
help cd
```

Voir comment l'aide intégrée présente la commande `cd`.

**Étape 3 : Comprendre Terminal et Shell**

Exécuter des commandes et observer que le terminal affiche simplement ce que le shell produit. Constater que chaque commande retourne à l'invite de commande pour recevoir une nouvelle instruction.

**Étape 4 : Utiliser l'Historique**

Exécuter plusieurs commandes différentes, puis :

```bash
history
```

Voir la liste de toutes les commandes. Repérer une commande précédente et la réexécuter via :

```bash
!numero
```

Ou utiliser **Ctrl+R** pour rechercher une commande spécifique.

**Étape 5 : Optimiser avec les Raccourcis**

En édisant une commande longue, utiliser **Ctrl+A** pour aller au début, **Alt+F** pour avancer par mots, et **Ctrl+W** pour supprimer le mot précédent. Ces raccourcis accélèrent considérablement le travail en ligne de commande.

### Création d'un Premier Script de Démonstration

Pour appliquer concrètement les apprentissages de ce chapitre, créer un premier script simple :

```bash
#!/bin/bash

# Afficher le répertoire courant
echo "Répertoire courant :"
pwd

# Lister les fichiers avec détails
echo -e "\nFichiers du répertoire :"
ls -la

# Afficher le nombre de fichiers
echo -e "\nNombre de fichiers et dossiers :"
ls -1 | wc -l
```

Ce script, nommé `demo.sh`, combine plusieurs concepts : l'utilisation du shebang, l'exécution de commandes, et l'affichage des résultats. Il démontre concrètement comment les commandes apprises s'assemblent pour former un outil automatisé.

Pour exécuter ce script :

```bash
chmod +x demo.sh
./demo.sh
```

La première commande donne la permission d'exécution au script. La seconde commande l'exécute. Le résultat affiche le répertoire courant, la liste des fichiers, et le nombre total d'éléments dans le répertoire.

## Résumé des Concepts Clés

Ce chapitre pose les fondations essentielles pour l'apprentissage de Bash et de l'administration Linux. Les concepts présentés—terminal vs shell, structure des commandes, utilisation de la documentation—forment un socle sur lequel s'appuient tous les apprentissages ultérieurs. La maîtrise de ces éléments de base permet de progresser rapidement vers des concepts plus avancés comme les variables, les boucles, et les scripts complexes.

L'accent mis sur la documentation (man, help, --help) est particulièrement important : c'est grâce à ces outils que les utilisateurs deviennent autonomes et capable d'explorer de nouvelles commandes sans aide extérieure. Le terminal ne doit pas intimider : c'est simplement un outil d'interface, et Bash est un langage de commandes logique et cohérent une fois ses principes de base compris.
