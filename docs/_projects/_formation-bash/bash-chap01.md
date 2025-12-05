# Citations
- https://www.youtube.com/watch?v=Ry-ToCHDsXQ
- https://jeromeinformatique.fr/installation-ubuntu-24-04/
- https://www.numetopia.fr/comment-installer-ubuntu-dans-virtualbox/
- https://perso.univ-rennes1.fr/pierre.nerzic/SYS1A/Installation%20VirtualBox%20Ubuntu.pdf
- https://www.hostinger.com/fr/tutoriels/comment-installer-ubuntu
- https://rdr-it.com/installer-ubuntu-22-04-sur-une-machine-virtuelle-hyper-v/
- https://aymeric-cucherousset.fr/installer-ubuntu-sur-vmware/
- http://doc.ubuntu-fr.org/virtualbox
- https://www.youtube.com/watch?v=X3O7GtLTdfo
- https://wiki.inpt.fr/fr/toulouse-inp/machine-virtuelle-Linux


# Tokens
- prompt_tokens: 273
- completion_tokens: 4321
- total_tokens: 4594
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.065, 'request_cost': 0.006, 'total_cost': 0.072}


# Content
# Introduction à Linux & Bash : Guide Complet de Formation

## À l'abordage

L'apprentissage de Linux et Bash représente une étape fondamentale pour quiconque souhaite développer des compétences en administration système, développement logiciel ou DevOps. Ce guide de formation couvre les fondamentaux essentiels pour débuter sereinement dans cet univers.

Bash, l'acronyme pour "Bourne Again Shell", est l'interpréteur de commandes par défaut sur la majorité des distributions Linux. Il permet d'interagir directement avec le système d'exploitation en ligne de commande, offrant une puissance et une flexibilité incomparables par rapport aux interfaces graphiques. Le chemin d'apprentissage commence par la compréhension conceptuelle de Linux, se poursuit par l'installation pratique, puis progresse vers l'utilisation de Bash.

## Qu'est ce que Linux et pourquoi l'apprendre ?

### Définition et nature de Linux

Linux est un noyau de système d'exploitation libre et open-source, créé en 1991 par Linus Torvalds. Le terme "Linux" fait référence au noyau spécifiquement, mais dans le langage courant, il désigne l'ensemble du système d'exploitation composé du noyau Linux associé à des outils GNU et autres logiciels libres. Contrairement aux systèmes d'exploitation propriétaires comme Windows ou macOS, Linux repose sur des principes d'ouverture et de collaboration communautaire.

### Architecture générale de Linux

Linux fonctionne selon une architecture en couches, où le noyau (kernel) constitue le cœur du système. Le noyau gère la communication entre les applications et le matériel physique (processeur, mémoire, disques durs, etc.). Au-dessus du noyau se trouvent les utilitaires GNU, les bibliothèques système, et l'interpréteur de commandes (shell). Cette architecture modulaire permet une grande flexibilité et une adaptation à de nombreux contextes d'utilisation.

### Raisons principales d'apprendre Linux

**Omniprésence dans l'industrie technologique** 🖥️

Linux alimente plus de 96% des serveurs dans le cloud et représente la base de la majorité des infrastructures web mondiales. Les entreprises des plus petites startups aux géants technologiques (Google, Amazon, Facebook) reposent massivement sur Linux pour leurs opérations critiques. L'apprentissage de Linux constitue donc un atout professionnel majeur.

**Liberté et contrôle du système**

Linux offre un contrôle total sur le système d'exploitation. Les utilisateurs peuvent accéder au code source, modifier le comportement du système, automatiser des tâches complexes, et optimiser les performances selon leurs besoins spécifiques. Cette liberté n'existe pas sur les systèmes propriétaires.

**Sécurité et stabilité**

Linux est réputé pour sa stabilité exceptionnelle et ses caractéristiques de sécurité robustes. Les serveurs Linux fonctionnent souvent pendant des années sans redémarrage. La nature open-source du code facilite l'identification et la correction rapide des vulnérabilités de sécurité.

**Coût d'exploitation réduit**

Linux est gratuit et ne requiert pas de licences commerciales. Son efficacité énergétique permet de réduire les coûts d'infrastructure. Ces économies se traduisent par une meilleure rentabilité des projets technologiques.

**Portabilité et flexibilité**

Linux s'exécute sur une multitude de plateformes : des serveurs haute performance aux appareils embarqués (smartphones Android, routeurs, objets connectés), en passant par les ordinateurs personnels. Cette polyvalence en fait un système d'exploitation universel.

### Bash : pourquoi c'est crucial

Bash est bien plus qu'un simple interpréteur de commandes. C'est un outil de programmation puissant permettant :

- **L'automatisation** : scripts pour effectuer des tâches répétitives
- **L'administration système** : gestion des fichiers, processus, utilisateurs, permissions
- **Le développement** : intégration dans les pipelines CI/CD et DevOps
- **La productivité** : utilisation efficace de la ligne de commande

La maîtrise de Bash transforme un utilisateur basique en administrateur capable de gérer des systèmes complexes.

## Installation d'Ubuntu avec une machine virtuelle

### Concept et avantages des machines virtuelles

Une machine virtuelle est une simulation informatique d'un ordinateur complet fonctionnant comme un programme sur un ordinateur hôte. Elle émule le matériel, le système d'exploitation et les applications sans modifier le système d'exploitation principal.[3] Cette approche offre plusieurs avantages pour l'apprentissage :

**Isolation complète** : Aucun risque de compromettre le système principal

**Flexibilité** : Possibilité de créer plusieurs configurations différentes et de les dupliquer facilement

**Facilité de test** : Liberté d'expérimenter sans conséquences permanentes

**Portabilité** : La machine virtuelle peut être transférée entre ordinateurs facilement

### Installation de VirtualBox

VirtualBox est un hyperviseur gratuit et open-source produit par Oracle. L'installation constitue la première étape du processus.[5]

**Étapes d'installation de VirtualBox** :

Télécharger la dernière version d'Oracle VirtualBox depuis le site officiel en sélectionnant le système d'exploitation de l'ordinateur hôte (Windows, macOS ou Linux). Une fois le fichier téléchargé, ouvrir l'exécutable et suivre l'assistant d'installation en acceptant les conditions par défaut.

### Préparation : Télécharger l'ISO Ubuntu

Avant de créer la machine virtuelle, obtenir le fichier ISO d'Ubuntu (image disque d'installation).[3] Accéder au site officiel ubuntu.com et télécharger la version LTS (Long Term Support) pour une stabilité maximale et un support prolongé. La version LTS actuelle recommandée offre 5 années de support.

### Création de la machine virtuelle

L'installation d'Ubuntu dans VirtualBox suit une procédure structurée en plusieurs étapes bien définies.[2]

**Étape 1 : Nommer la machine virtuelle et sélectionner le système**

Ouvrir VirtualBox et cliquer sur le bouton "Nouveau" pour créer une nouvelle machine virtuelle.[3] Donner un nom explicite à la machine (par exemple "Ubuntu-Learning"). VirtualBox détecte automatiquement le type et la version du système d'exploitation si le nom contient "Ubuntu". Dans le cas contraire, sélectionner manuellement :
- Type : Linux
- Version : Ubuntu 64-bit (ou 32-bit selon la version téléchargée)

**Étape 2 : Attribution de ressources matérielles**

Attribuer la quantité de mémoire vive (RAM) à la machine virtuelle.[5] La recommandation générale est d'allouer la moitié de la RAM disponible sur l'ordinateur hôte. Par exemple, si l'ordinateur dispose de 8 Go de RAM, allouer 4 Go à la machine virtuelle. Pour un apprentissage de base, un minimum de 2 Go est viable.

Ensuite, créer un disque dur virtuel. Sélectionner l'option pour créer un nouveau disque virtuel et choisir les paramètres par défaut (8 Go minimum pour Ubuntu, 20 Go recommandés pour confort d'utilisation).[4]

**Étape 3 : Configuration du stockage**

Dans les paramètres de la machine virtuelle créée, accéder à la section "Stockage".[5] Attribuer le fichier ISO d'Ubuntu au contrôleur IDE :
- Cliquer sur "Contrôleur: IDE"
- Sélectionner l'icône du lecteur CD
- Choisir le fichier ISO d'Ubuntu téléchargé précédemment

Cette action indique à la machine virtuelle où trouver les fichiers d'installation.

**Étape 4 : Lancement de la machine virtuelle**

Une fois tous les paramètres configurés, cliquer sur le bouton "Démarrer" pour lancer la machine virtuelle.[3] L'ordinateur simulé démarre et exécute le fichier ISO, affichant l'écran de démarrage d'Ubuntu.

### Processus d'installation d'Ubuntu

**Étape d'amorçage initial**

Au démarrage, Ubuntu affiche un menu de démarrage avec plusieurs options.[2] Sélectionner "Essayer ou installer Ubuntu (Try or install ubuntu)" en utilisant les flèches du clavier, puis appuyer sur Entrée. Cette action lance le processus d'installation interactif.

**Choix du mode d'installation**

Ubuntu propose plusieurs modes d'installation. Sélectionner "Installer Ubuntu" pour procéder à une installation complète (par opposition à "Essayer Ubuntu" qui lance une session en mémoire vive temporaire sans installer).[2]

**Configuration de la langue et localisation**

L'installateur demande la langue de l'interface et la disposition du clavier. Sélectionner les paramètres appropriés pour l'environnement d'apprentissage. Ces choix affectent l'affichage et la saisie de texte.

**Configuration du disque**

L'installateur propose de partitionner le disque virtuel. Pour une première installation dans une machine virtuelle, accepter l'option par défaut qui utilise tout l'espace disponible du disque virtuel (8 ou 20 Go selon la configuration précédente).[4]

**Création du compte utilisateur**

Fournir les informations suivantes :
- Nom complet : le nom affiché dans le système
- Nom d'utilisateur (login) : identifiant utilisé pour se connecter (sans espaces ni caractères spéciaux)
- Mot de passe : choisir un mot de passe sécurisé et le mémoriser
- Option de chiffrement : optionnellement, activer le chiffrement du dossier personnel

Le compte créé dispose automatiquement de privilèges administrateur (accès sudo).

**Installation des paquets système**

L'installateur copie les fichiers du système sur le disque virtuel et configure les services système. Cette étape dure généralement 5 à 10 minutes selon la vitesse du disque hôte.

**Redémarrage du système**

À la fin de l'installation, l'installateur demande de redémarrer.[1] Cliquer sur "Redémarrer maintenant" pour relancer le système. L'ISO se décharge automatiquement et le système démarre depuis le disque virtuel installé.

### Connexion et vérification de l'installation

À la première connexion, entrer le nom d'utilisateur et le mot de passe créés pendant l'installation.[1] Une fois connecté, l'environnement de bureau d'Ubuntu s'affiche avec tous les outils et applications disponibles.

Pour vérifier l'installation, ouvrir un terminal (Ctrl+Alt+T) et exécuter des commandes de base :

```bash
uname -a
```

Cette commande affiche les informations du système, confirmant que Ubuntu fonctionne correctement.

### Installation des Additions Invité

Pour améliorer l'expérience dans la machine virtuelle, installer les Additions Invité de VirtualBox. Ces outils optimisent les performances vidéo, permettent le redimensionnement dynamique de la fenêtre, et facilitent le partage du presse-papiers.

Dans le menu de VirtualBox, sélectionner "Périphériques > Insérer l'image CD des Additions Invité". Une fenêtre s'affiche proposant de lancer l'installation. Accepter et fournir le mot de passe utilisateur quand demandé.[3]

### Configuration post-installation

Après l'installation, plusieurs configurations recommandées optimisent l'environnement d'apprentissage :

**Mise à jour du système** :

```bash
sudo apt update
sudo apt upgrade
```

**Installation d'outils développement** :

```bash
sudo apt install build-essential git curl wget vim nano
```

**Activation de SSH (optionnel)** :

```bash
sudo apt install openssh-server
sudo systemctl start ssh
```

## Installation d'Ubuntu en dual boot

### Concept du dual boot

L'installation en dual boot signifie installer Ubuntu directement sur le disque dur de l'ordinateur aux côtés d'un système d'exploitation existant (généralement Windows ou macOS). Contrairement à la machine virtuelle, Ubuntu s'exécute nativement, offrant des performances optimales mais avec un risque plus élevé de perte de données.

### Préalables essentiels

**Sauvegarde complète des données** ⚠️

Avant de procéder à une installation en dual boot, effectuer une sauvegarde complète de toutes les données importantes. Le processus de partitionnement comporte des risques, et une erreur pourrait entraîner la perte de fichiers.

**Espace disque disponible**

Disposer d'au moins 50 Go d'espace disque non partitionné pour Ubuntu. Vérifier l'espace disponible dans les paramètres système et redimensionner les partitions existantes si nécessaire.

**Création d'une clé USB d'installation bootable**

Créer une clé USB bootable avec Ubuntu est nécessaire pour l'installation en dual boot. Télécharger le fichier ISO d'Ubuntu et utiliser un outil comme Rufus (Windows) ou Etcher (macOS/Linux) pour écrire l'image sur la clé USB.[5]

Avec Rufus sur Windows :
- Ouvrir Rufus et sélectionner la clé USB
- Pour le schéma de partition, choisir "GPT" sur les ordinateurs récents ou "MBR" sur les anciens modèles
- Sélectionner le fichier ISO d'Ubuntu
- Cliquer sur "Démarrer" et confirmer le formatage de la clé

### Préparation du disque dur

**Redimensionner la partition existante**

Sur Windows, accéder à "Gestion des disques" (clic droit sur "Ordinateur" > Gérer > Gestion des disques). Clic droit sur la partition Windows existante et sélectionner "Réduire le volume". Indiquer l'espace à libérer (au moins 50 Go). Confirmer l'opération qui réduit la partition Windows et crée de l'espace non partitionné.

**Redémarrage depuis la clé USB**

Brancher la clé USB d'installation, puis redémarrer l'ordinateur. Lors du redémarrage, appuyer sur la touche appropriée pour accéder au menu d'amorçage (généralement F12, F2, ESC ou DEL selon le fabricant). Sélectionner la clé USB dans le menu d'amorçage pour démarrer depuis Ubuntu.

### Processus d'installation en dual boot

**Accueil et options initiales**

L'écran d'accueil d'Ubuntu propose deux options : "Essayer Ubuntu" ou "Installer Ubuntu". Sélectionner "Installer Ubuntu" pour procéder à l'installation.

**Configuration de langue et clavier**

Sélectionner la langue de l'interface et la disposition du clavier, identique au processus en machine virtuelle.

**Type d'installation crucial**

Lors du partitionnement du disque, Ubuntu propose plusieurs options d'installation. Sélectionner "Autre chose" (Something else) pour accéder au partitionnement manuel. Cette option est cruciale en dual boot pour éviter d'écraser Windows accidentellement.

**Partitionnement manuel**

Identifier l'espace non partitionné (apparaît généralement comme "Espace libre" ou "Free space" d'une taille de 50 Go). Cliquer sur cet espace et créer une nouvelle partition.

Les partitions recommandées pour Ubuntu sont :

| Partition | Taille | Type de fichier | Point de montage | Objectif |
|-----------|--------|-----------------|------------------|----------|
| Racine (/) | 25-30 Go | ext4 | / | Système principal |
| Swap | 4-8 Go | Swap | - | Mémoire virtuelle |
| Home (/home) | Reste | ext4 | /home | Données utilisateur |

Pour chaque partition :
1. Cliquer sur l'espace libre
2. Indiquer la taille en Mo ou Go
3. Choisir "Primaire" ou "Logique"
4. Sélectionner le type de fichier (ext4)
5. Indiquer le point de montage (/ pour racine, /home pour home)

**Sélection du gestionnaire d'amorçage**

Ubuntu propose d'installer le gestionnaire d'amorçage GRUB sur le disque dur principal. GRUB permet de choisir entre Ubuntu et Windows au démarrage. Accepter l'installation par défaut sur le disque principal (généralement /dev/sda).

**Création du compte utilisateur**

Entrer les informations utilisateur comme décrit précédemment pour la machine virtuelle.

**Installation finale**

L'installateur copie les fichiers sur les partitions créées, configure le système, et installe le gestionnaire d'amorçage. Cette étape dure 10 à 15 minutes.

**Redémarrage et menu GRUB**

Après l'installation, l'ordinateur redémarre. Au démarrage, le menu GRUB s'affiche avec deux options : "Ubuntu" et "Windows" (ou "Windows Boot Manager"). Sélectionner Ubuntu pour confirmer que l'installation a réussi.

### Avantages et inconvénients du dual boot

| Aspect | Dual boot | Machine virtuelle |
|--------|-----------|-------------------|
| Performances | Excellentes (natif) | Réduites (émulation) |
| Isolation | Faible (risque de conflit) | Excellente (complètement isolée) |
| Facilité d'installation | Moyenne (plus technique) | Simple (guidée) |
| Sécurité des données | Risquée (partitionnement) | Sûre (snapshot possible) |
| Flexibilité | Limitée (un seul OS par démarrage) | Maximale (plusieurs VM simultanées) |
| Récupération | Difficile en cas d'erreur | Simple (snapshot ou suppression) |

### Recommandations pour débuter

Pour une première approche de Linux et Bash, **la machine virtuelle est recommandée**. Elle offre un environnement d'apprentissage sécurisé sans risque de compromettre le système principal. Une fois les fondamentaux maîtrisés et la confiance acquise, le dual boot peut être envisagé pour bénéficier des performances maximales.

Le chemin d'apprentissage idéal consiste à :

1. Commencer par une machine virtuelle pour explorer Linux et Bash sans risque
2. Pratiquer les commandes de base et scripts Bash
3. Progresser vers des tâches d'administration plus complexes
4. Envisager le dual boot une fois les compétences solides
5. Finalement explorer des environnements serveur réels (VPS, cloud)

Cette progression graduée garantit une fondation solide et développe la confiance nécessaire pour gérer des systèmes Linux en environnement professionnel.
