# Citations
- https://www.youtube.com/watch?v=OJIROvp4cqs
- https://www.surfercloud.com/blog/how-to-install-and-use-snap-on-ubuntu-a-beginners-guide-2025
- https://spagnolostefano.altervista.org/snap/
- https://www.puntoinformaticofree.it/ubuntu_tutorial/snap/snap/installare_snap_store.html
- https://www.alternativalinux.it/ubuntu-gli-inganni-di-snap-e-il-controllo-di-linux/
- https://www.youtube.com/watch?v=Xpl7qtUc20s
- https://snapcraft.io/docs/installing-snap-on-ubuntu
- https://www.baeldung.com/linux/snaps-intro


# Tokens
- prompt_tokens: 292
- completion_tokens: 6906
- total_tokens: 7198
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.104, 'request_cost': 0.006, 'total_cost': 0.11}


# Content
# Installation de Programmes sous Linux 📦

## Introduction aux gestionnaires de paquets

L'installation de programmes sous Linux s'effectue principalement via des gestionnaires de paquets, des outils qui automatisent le téléchargement, l'installation et la gestion des logiciels. Contrairement aux systèmes d'exploitation traditionnels où l'on télécharge des fichiers exécutables, Linux centralise les logiciels dans des dépôts (repositories) officiels ou tiers. Les deux gestionnaires de paquets majeurs sur Ubuntu et les distributions basées sur Debian sont **APT** (Advanced Package Tool) et **Snap**.

APT représente l'approche classique et traditionnelle des distributions Debian, tandis que Snap offre une approche plus moderne basée sur la conteneurisation. Chacun de ces outils présente des avantages et des inconvénients qui les rendent appropriés pour différents scénarios d'utilisation.

---

## Chapitre 5.1 : Obtenir des informations sur les paquets avec APT 🔍

### Fonctionnement d'APT

APT est le gestionnaire de paquets par défaut des distributions basées sur Debian, notamment Ubuntu. Il permet de consulter, installer, mettre à jour et supprimer des paquets depuis les dépôts officiels configurés sur le système. APT fonctionne en interagissant avec des fichiers de configuration qui définissent les sources de téléchargement des logiciels.

### Rechercher des informations sur un paquet

La première étape avant d'installer un programme consiste à rechercher des informations le concernant. Plusieurs commandes permettent d'accéder à ces informations :

#### La commande `apt search`

```bash
apt search nom_du_paquet
```

Cette commande recherche dans les dépôts configurés tous les paquets contenant le mot-clé spécifié. Le résultat affiche le nom du paquet, sa version et une brève description.[2]

**Exemple pratique :**

```bash
apt search nginx
```

Cette commande retournera tous les paquets liés à nginx, incluant le serveur web lui-même ainsi que divers modules et outils associés.

#### La commande `apt-cache search`

```bash
apt-cache search nom_du_paquet
```

Cette commande effectue une recherche similaire mais en utilisant le cache local des paquets, ce qui la rend généralement plus rapide.[2]

**Exemple :**

```bash
apt-cache search apache2
```

#### La commande `apt show` ou `apt-cache show`

```bash
apt show nom_du_paquet
```

Cette commande affiche des informations détaillées sur un paquet spécifique : version, taille, dépendances, description complète, mainteneur, et URL du projet.[2]

**Exemple pratique :**

```bash
apt show curl
```

La sortie ressemblera à :

```
Package: curl
Version: 7.81.0-1ubuntu1.13
Priority: optional
Section: web
Maintainer: Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>
Installed-Size: 402 kB
Depends: libc6 (>= 2.34), libcurl4 (= 7.81.0-1ubuntu1.13)
Homepage: https://curl.se/
Download-Size: 167 kB
Description: command line tool for transferring data with URLs
 curl is a command line tool for transferring data using URLs
 (Server for HTTP, HTTPS, FTP, FTPS, FILE, LDAP, LDAPS,
 ...
```

### Comprendre les résultats de recherche

Lors d'une recherche avec `apt search`, les résultats affichent plusieurs informations clés :

- **Nom du paquet** : L'identifiant unique du logiciel
- **Version disponible** : La version présente dans les dépôts
- **Description courte** : Une phrase résumant la fonction du paquet
- **État d'installation** : Indique si le paquet est déjà installé sur le système

### Afficher les paquets disponibles

```bash
apt list --available
```

Cette commande liste tous les paquets disponibles dans les dépôts configurés.[2]

```bash
apt list --available | grep -E "^(python|ruby|node)" | head -20
```

Cette variante filtre les résultats pour afficher uniquement les paquets Python, Ruby et Node.js.

### Afficher les paquets installés

```bash
apt list --installed
```

Liste uniquement les paquets déjà installés sur le système.[2]

```bash
apt list --installed | wc -l
```

Cette commande compte le nombre total de paquets installés.

### Vérifier les mises à jour disponibles

```bash
apt list --upgradable
```

Affiche la liste des paquets installés pour lesquels une version plus récente est disponible dans les dépôts.[2]

### Obtenir des statistiques sur les dépôts

```bash
apt stats
```

Affiche des informations générales sur l'état des dépôts et du cache local.

---

## Chapitre 5.2 : Utiliser APT pour installer, mettre à jour et supprimer des paquets ⚙️

### Installation de paquets

#### Mise à jour de l'index des paquets

Avant d'installer un programme, il est recommandé de mettre à jour l'index local des paquets. Cet index contient une liste de tous les paquets disponibles dans les dépôts configurés et leurs versions respectives.

```bash
sudo apt update
```

Cette commande télécharge les listes des paquets disponibles depuis les serveurs des dépôts. L'utilisation de `sudo` est nécessaire car l'opération requiert des privilèges administrateur. Cette étape doit être effectuée régulièrement pour assurer l'accès aux versions les plus récentes des logiciels.[2]

**Exemple complet :**

```bash
sudo apt update
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
4 packages can be upgraded. Run 'apt list --upgradable' to see them.
```

#### Installation d'un paquet simple

```bash
sudo apt install nom_du_paquet
```

Cette commande installe un paquet spécifique à partir des dépôts. APT résout automatiquement les dépendances, c'est-à-dire qu'il identifie et installe tous les logiciels auxquels le paquet dépend.[2]

**Exemple pratique :**

```bash
sudo apt install git
```

APT affichera un résumé des paquets à installer, incluant les dépendances, et demandera une confirmation :

```
Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  git git-man liberror-perl
0 upgraded, 3 newly installed, 0 removed
Need to get 6,234 kB of archives.
After this operation, 21.4 MB of additional disk space will be used.
Do you want to continue? [Y/n]
```

#### Installation de plusieurs paquets simultanément

```bash
sudo apt install paquet1 paquet2 paquet3
```

Cette commande installe plusieurs paquets en une seule opération, ce qui économise du temps et des ressources réseau.[2]

**Exemple :**

```bash
sudo apt install vim curl wget
```

#### Installation d'une version spécifique

```bash
sudo apt install nom_du_paquet=version_spécifique
```

Permet d'installer une version particulière d'un paquet plutôt que la version par défaut des dépôts.[2]

**Exemple :**

```bash
sudo apt install python3=3.10.4-1
```

### Mise à jour des paquets

#### Mise à jour de tous les paquets installés

```bash
sudo apt upgrade
```

Cette commande met à jour tous les paquets installés vers leurs versions les plus récentes disponibles dans les dépôts.[2] Les paquets sont mis à jour de manière « sûre » : APT n'ajoutera pas ou ne supprimera pas de paquets pour résoudre des conflits.

**Exemple :**

```bash
sudo apt upgrade
Reading package lists... Done
Building dependency tree... Done
The following packages will be upgraded:
  curl gnupg2 openssl
3 upgraded, 0 newly installed, 0 removed
Need to get 2,445 kB of archives.
After this operation, 1,024 kB of additional disk space will be used.
Do you want to continue? [Y/n]
```

#### Mise à jour agressive (dist-upgrade)

```bash
sudo apt full-upgrade
```

ou

```bash
sudo apt dist-upgrade
```

Cette commande effectue une mise à jour plus complète qui peut supprimer ou ajouter des paquets si nécessaire pour résoudre les conflits de dépendances. Elle est généralement utilisée lors de mises à jour majeures du système d'exploitation.[2]

#### Mise à jour d'un paquet spécifique

```bash
sudo apt upgrade nom_du_paquet
```

Permet de mettre à jour un seul paquet plutôt que tous les paquets installés.

### Suppression de paquets

#### Désinstallation simple

```bash
sudo apt remove nom_du_paquet
```

Cette commande supprime le paquet spécifié du système. Cependant, les fichiers de configuration associés au paquet sont conservés, ce qui permet de réinstaller le paquet ultérieurement sans perdre les paramètres personnalisés.[2]

**Exemple :**

```bash
sudo apt remove chromium
```

#### Suppression complète avec fichiers de configuration

```bash
sudo apt purge nom_du_paquet
```

Cette commande effectue une suppression complète du paquet, incluant tous les fichiers de configuration et les données associées.[2]

**Exemple :**

```bash
sudo apt purge mysql-server
```

#### Suppression des paquets inutilisés

```bash
sudo apt autoremove
```

Cette commande identifie et supprime les paquets de dépendance qui ne sont plus requis par aucun paquet installé. Cette opération aide à libérer de l'espace disque et à maintenir le système propre.[2]

```bash
sudo apt clean
```

Supprime les fichiers .deb téléchargés et conservés dans le cache, libérant ainsi de l'espace disque.

---

## Chapitre 5.3 : Installer un programme avec apt et apt-get 🛠️

### Différences entre apt et apt-get

Historiquement, `apt-get` et `apt-cache` sont les commandes de bas niveau fournies par APT. La commande `apt` a été introduite ultérieurement comme interface de haut niveau, combinant les fonctionnalités des deux outils précédents dans une interface plus conviviale.

| Aspect | apt | apt-get |
|--------|-----|---------|
| **Interface** | Moderne et conviviale | Bas niveau, plus verbeux |
| **Sortie** | Formatée et lisible | Détaillée et technique |
| **Stabilité** | Peut changer entre versions | Interface stable |
| **Recommandation** | Scripts modernes et utilisation interactive | Scripts existants et compatibilité |
| **Fonctionnalités** | Combine apt-get et apt-cache | Spécialisée pour l'installation |

### Flux d'installation complet avec apt

Un processus d'installation typique suit les étapes suivantes :

#### Étape 1 : Mettre à jour l'index

```bash
sudo apt update
```

#### Étape 2 : Rechercher le paquet

```bash
apt search postgresql
```

#### Étape 3 : Obtenir des informations détaillées

```bash
apt show postgresql
```

#### Étape 4 : Installer le paquet

```bash
sudo apt install postgresql
```

#### Étape 5 : Vérifier l'installation

```bash
apt list --installed | grep postgresql
```

### Flux d'installation complet avec apt-get

Le processus avec `apt-get` est similaire mais utilise une syntaxe légèrement différente :

```bash
sudo apt-get update
apt-cache search mariadb
apt-cache show mariadb-server
sudo apt-get install mariadb-server
apt-get list --installed | grep mariadb
```

### Script d'installation automatisée

Pour automatiser des installations récurrentes, il est possible de créer des scripts bash :

```bash
#!/bin/bash

# Script d'installation des outils de développement couramment utilisés

echo "Mise à jour de l'index des paquets..."
sudo apt update

echo "Installation des outils essentiels..."
sudo apt install -y \
    build-essential \
    curl \
    wget \
    git \
    vim \
    nano \
    htop \
    tmux

echo "Installation des environnements de développement..."
sudo apt install -y \
    python3 \
    python3-pip \
    nodejs \
    npm \
    ruby

echo "Installation des bases de données..."
sudo apt install -y \
    postgresql \
    mysql-server \
    redis-server

echo "Installation terminée !"
echo "Les paquets suivants ont été installés :"
apt list --installed | grep -E "build-essential|curl|wget|git"
```

Sauvegarder ce script dans un fichier `install.sh` et l'exécuter :

```bash
chmod +x install.sh
./install.sh
```

### Gestion des dépendances

APT résout automatiquement les dépendances, mais il est utile de comprendre ce processus. Lorsqu'un paquet est installé, APT examine ses dépendances et installe automatiquement tous les paquets requis.

**Exemple :**

```bash
sudo apt install nginx
```

APT reconnaît que nginx dépend de plusieurs paquets (libpcre3, openssl, etc.) et les installe automatiquement sans intervention manuelle.

Pour afficher les dépendances d'un paquet sans l'installer :

```bash
apt-cache depends nginx
```

Cela affichera une arborescence de toutes les dépendances du paquet.

---

## Chapitre 5.4 : Utiliser le gestionnaire de paquets Snap 📱

### Qu'est-ce que Snap ?

Snap est un gestionnaire de paquets moderne développé par Canonical, la société derrière Ubuntu. À la différence d'APT qui repose sur les dépôts traditionnels de Debian, Snap utilise une approche conteneurisée, où chaque application est empaquetée avec toutes ses dépendances dans un conteneur isolé.[1]

### Avantages du format Snap

- **Isolation des applications** : Chaque snap s'exécute dans un environnement isolé, réduisant les conflits de dépendances
- **Compatibilité multiplateforme** : Les snaps fonctionnent sur toutes les distributions Linux majeures
- **Mises à jour automatiques** : Les snaps se mettent à jour automatiquement sans intervention manuelle
- **Versioning indépendant** : Possibilité d'installer différentes versions d'une même application côte à côte
- **Sécurité renforcée** : Les snaps fonctionnent en mode confinement (confinement sandbox)

### Inconvénients du format Snap

- **Consommation d'espace disque** : Les snaps occupent généralement plus d'espace que les paquets APT car ils incluent toutes leurs dépendances[1]
- **Vitesse de démarrage** : Le temps de démarrage peut être plus lent en raison du processus de montage du conteneur
- **Adoption limitée** : Snap est principalement utilisé par Ubuntu et n'est pas largement adopté par les autres distributions
- **Contrôle décentralisé** : Certaines critiques soulevées concernent le rôle centralisé de Canonical dans la distribution des snaps

### Installation de Snap sur Ubuntu

#### Vérification de l'installation existante

Snap est généralement pré-installé sur les versions récentes d'Ubuntu. Pour vérifier l'installation :

```bash
snap version
```

Si Snap n'est pas installé, la sortie affichera un message d'erreur.

#### Installation de snapd

```bash
sudo apt update
sudo apt install snapd
```

Après l'installation, il peut être nécessaire de redémarrer le système ou de recharger la variable PATH :

```bash
source /etc/profile
```

#### Vérification du service snapd

```bash
sudo systemctl status snapd
```

Cela affichera l'état du service snapd (actif ou inactif).

Si le service n'est pas actif :

```bash
sudo systemctl enable snapd.service
sudo systemctl start snapd.service
```

---

## Chapitre 5.5 : Le gestionnaire de paquets Snap - Guide détaillé 🎯

### Structure et fonctionnement des snaps

Un snap est un conteneur d'application auto-contenu incluant :

- L'application elle-même
- Toutes les dépendances requises (bibliothèques, runtime)
- Les fichiers de configuration
- Les métadonnées d'installation

Cette structure garantit que l'application fonctionne de manière cohérente quel que soit l'environnement du système hôte.

### Rechercher des snaps

#### Recherche dans le Snap Store

```bash
snap find nom_de_l_application
```

Cette commande recherche dans le Snap Store officiel tous les snaps correspondant au mot-clé spécifié.[1]

**Exemple pratique :**

```bash
snap find vlc
```

La sortie affichera :

```
Name           Version   Publisher   Notes
vlc            3.0.16    videolan    -
vlc-mozilla    3.0.16    videolan    -
```

#### Obtenir des informations détaillées sur un snap

```bash
snap info nom_du_snap
```

Affiche des informations complètes sur un snap spécifique, incluant les canaux de version disponibles, la taille du snap, les permissions requises, et la description détaillée.[1]

**Exemple :**

```bash
snap info firefox
```

La sortie inclura :

```
name:      firefox
summary:   Mozilla Firefox web browser
publisher: Mozilla
store-url: https://snapcraft.io/firefox
contact:   Mozilla Messaging <firefox-dev@mozilla.org>
license:   MPL-2.0
description:
  The Firefox browser is fast and user-friendly.
channels:
  latest/stable:    117.0.1-1            (3151) 292MB -
  latest/candidate: 118.0-2              (3172) 293MB -
  latest/beta:      119.0b1-1            (3173) 294MB -
  latest/edge:      120.0a1-1            (3174) 295MB -
```

### Installation de snaps

#### Installation simple

```bash
sudo snap install nom_du_snap
```

Installe le snap depuis le canal stable par défaut.[1]

**Exemple :**

```bash
sudo snap install spotify
```

#### Installation d'une version bêta ou de développement

```bash
sudo snap install nom_du_snap --channel=beta
```

Ou :

```bash
sudo snap install nom_du_snap --channel=edge
```

Les canaux disponibles dépendent du snap spécifique. Les canaux courants sont :
- `stable` : Version stable recommandée
- `candidate` : Pré-version candidate de la prochaine version stable
- `beta` : Version bêta avec nouvelles fonctionnalités
- `edge` : Version en développement actif, possiblement instable[1]

**Exemple :**

```bash
sudo snap install code --channel=edge
```

#### Installation d'une version classique

```bash
sudo snap install nom_du_snap --classic
```

Le mode classique désactive le confinement du snap, le permettant d'accéder au système de fichiers complet. Cela est généralement utilisé pour les snaps qui ne peuvent pas fonctionner avec le confinement par défaut.[1]

### Lister et gérer les snaps installés

#### Lister tous les snaps

```bash
snap list
```

Affiche tous les snaps installés sur le système avec leur version actuelle et la taille consommée.[1]

La sortie ressemblera à :

```
Name               Version      Rev    Tracking   Publisher   Notes
core               20230901+git 14784  stable     canonical   core
firefox            117.0.1-1    3151   stable     mozilla     -
snapd              2.60         19721  stable     canonical   snapd
spotify            1.2.26.1187  67     stable     spotify     -
ubuntu-image       2.0          -      -          -           -
vlc                3.0.16       6749   stable     videolan    -
```

#### Obtenir des informations sur un snap installé

```bash
snap list nom_du_snap
```

Affiche les détails d'un snap installé spécifique.

#### Vérifier les services fournis par les snaps

```bash
snap services
```

Liste tous les services gérés par les snaps installés.

### Mise à jour des snaps

#### Mise à jour automatique

Par défaut, les snaps se mettent à jour automatiquement. Cette mise à jour se produit généralement une fois par jour à une heure aléatoire.[1]

#### Mise à jour manuelle

```bash
sudo snap refresh
```

Force la mise à jour immédiate de tous les snaps.[1]

**Exemple :**

```bash
sudo snap refresh
Fetching snap information
...
firefox 117.0.1-1 from Mozilla refreshed
spotfiy 1.2.26.1187 from Spotify refreshed
```

#### Mise à jour d'un snap spécifique

```bash
sudo snap refresh nom_du_snap
```

Met à jour uniquement le snap spécifié.[1]

**Exemple :**

```bash
sudo snap refresh vlc
```

#### Geler les mises à jour

Pour empêcher la mise à jour automatique d'un snap spécifique :

```bash
sudo snap refresh --hold=24h nom_du_snap
```

Cette commande gèle les mises à jour pendant 24 heures. Le paramètre peut être modifié (par exemple `48h` pour 48 heures).[2]

Pour réactiver les mises à jour :

```bash
sudo snap refresh --unhold nom_du_snap
```

### Suppression de snaps

#### Désinstallation simple

```bash
sudo snap remove nom_du_snap
```

Supprime le snap du système.[1]

**Exemple :**

```bash
sudo snap remove spotify
```

La sortie affichera :

```
spotify removed
```

#### Suppression avec conservation des données

Par défaut, `snap remove` conserve les données de configuration de l'utilisateur. Pour une suppression complète incluant les données :

```bash
sudo snap remove --purge nom_du_snap
```

### Exécution des services snap

#### Afficher l'état des services

```bash
snap services
```

Liste tous les services disponibles fournis par les snaps avec leur état (actif ou inactif).

#### Démarrer et arrêter des services

```bash
sudo snap start nom_du_service
sudo snap stop nom_du_service
```

**Exemple :**

```bash
sudo snap start hello-world
sudo snap stop hello-world
```

### Accès aux applications Snap

#### Installation du Snap Store graphique

Pour les utilisateurs préférant une interface graphique :

```bash
sudo snap install snap-store
```

Le Snap Store fournit une interface visuelle pour rechercher, installer et gérer les snaps, similaire à l'app store des systèmes mobiles.[4]

#### Lancement des applications

Les snaps s'exécutent généralement via le menu d'applications du bureau. En ligne de commande :

```bash
firefox
vlc
spotify
```

### Dépannage des snaps

#### Vérifier le statut d'un snap

```bash
snap info nom_du_snap
snap changes
```

La commande `snap changes` affiche l'historique des opérations effectuées sur les snaps.

#### Obtenir des logs

```bash
snap logs nom_du_snap -f
```

Affiche les logs du snap en temps réel (paramètre `-f` pour suivre les modifications).

#### Réinstaller un snap corrompu

```bash
sudo snap remove nom_du_snap
sudo snap install nom_du_snap
```

---

## Comparaison APT vs Snap 🔄

### Tableau comparatif détaillé

| Critère | APT | Snap |
|---------|-----|------|
| **Origine** | Debian/Ubuntu natif | Canonical (Ubuntu) |
| **Paquet** | Dépôt centralisé Debian | Conteneur isolé |
| **Dépendances** | Partagées au niveau système | Incluses dans le snap |
| **Taille disque** | Petite à moyenne | Grande (dépendances incluses) |
| **Vitesse d'installation** | Rapide | Plus lente (téléchargement conteneur) |
| **Mises à jour** | Manuelles par défaut | Automatiques par défaut |
| **Compatibilité** | Debian/Ubuntu et dérivées | Toutes les distributions Linux |
| **Confinement** | Non (accès système complet) | Oui (isolation et sécurité) |
| **Versions multiples** | Généralement une par dépôt | Plusieurs canaux disponibles |
| **Adoption** | Très largement adoptée | Principalement Ubuntu |
| **Performance** | Excellente | Bonne avec léger surcoût |
| **Interface** | Ligne de commande | CLI et GUI (Snap Store) |

### Recommandations d'utilisation

**Utiliser APT pour :**

- Les serveurs Linux où la stabilité et la performance sont primordiales
- L'installation de logiciels système fondamentaux
- Les applications nécessitant un accès direct aux ressources système
- Les environnements nécessitant une compatibilité maximale avec les autres distributions Debian
- Les situations où l'espace disque est limité[1]

**Utiliser Snap pour :**

- Les utilisateurs de bureau Ubuntu cherchant la simplicité
- L'installation rapide d'applications graphiques récentes
- Les situations nécessitant des mises à jour automatiques
- Les environnements multi-distributions
- Les applications nécessitant l'isolation pour des raisons de sécurité
- Les cas où plusieurs versions de la même application sont requises[1]

---

## Bonnes pratiques et workflows avancés 💡

### Script de maintenance système complet

```bash
#!/bin/bash

# Script de maintenance système combinant APT et Snap

echo "=== Début de la maintenance système ==="
echo "Date: $(date)"

# Section APT
echo -e "\n--- Gestion APT ---"
echo "Mise à jour de l'index APT..."
sudo apt update

echo "Vérification des mises à jour disponibles..."
UPGRADABLE=$(apt list --upgradable 2>/dev/null | wc -l)
if [ $UPGRADABLE -gt 1 ]; then
    echo "Packages à mettre à jour : $((UPGRADABLE - 1))"
    apt list --upgradable
    echo "Installation des mises à jour..."
    sudo apt upgrade -y
else
    echo "Aucune mise à jour disponible"
fi

echo "Suppression des paquets inutilisés..."
sudo apt autoremove -y

echo "Nettoyage du cache APT..."
sudo apt clean

# Section Snap
echo -e "\n--- Gestion Snap ---"
echo "Vérification des snaps..."
if command -v snap &> /dev/null; then
    echo "Mise à jour des snaps..."
    sudo snap refresh
    
    echo "Snaps installés :"
    snap list
else
    echo "Snap n'est pas installé"
fi

# Rapport final
echo -e "\n=== Fin de la maintenance ==="
echo "Espace disque utilisé :"
df -h | grep -E "^/dev"
echo "Date: $(date)"
```

### Installation d'une pile de développement complet

Pour installer un environnement de développement web moderne :

```bash
#!/bin/bash

echo "Installation d'une pile de développement web..."

# Backend
echo "Installation des outils backend..."
sudo apt install -y \
    git \
    curl \
    wget \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    postgresql \
    postgresql-contrib

# Frontend et outils
echo "Installation des outils frontend..."
sudo apt install -y \
    ruby \
    ruby-dev

# Snaps pour les applications modernes
echo "Installation des snaps..."
sudo snap install --classic code
sudo snap install postman
sudo snap install docker

# Vérification
echo "Vérification de l'installation..."
echo "Git version: $(git --version)"
echo "Python version: $(python3 --version)"
echo "Node version: $(node --version)"
echo "PostgreSQL version: $(psql --version)"

echo "Installation terminée !"
```

---

## Résolution des problèmes courants 🐛

### Problème : « E: Could not open lock file »

**Cause** : Une autre instance d'APT est en cours d'exécution.

**Solution** :

```bash
ps aux | grep apt
```

Attendre que les processus APT se terminent ou vérifier s'il existe un gestionnaire graphique en cours d'exécution.

### Problème : Dépendances non satisfaites

```bash
sudo apt --fix-broken install
```

ou

```bash
sudo apt install -f
```

### Problème : Paquet introuvable

Si un paquet n'existe pas après `sudo apt update`, s'assurer que les dépôts appropriés sont activés :

```bash
sudo add-apt-repository ppa:repository/ppa
sudo apt update
sudo apt install paquet
```

### Problème : Snap refusant de s'installer

Vérifier que le service snapd est actif :

```bash
sudo systemctl restart snapd
sudo snap list
```

---

## Conclusion et prochaines étapes 🎓

L'installation et la gestion des programmes sous Linux via APT et Snap représente une compétence fondamentale pour tout administrateur ou développeur système. APT offre stabilité et intégration native aux systèmes Debian/Ubuntu, tandis que Snap fournit modernité, portabilité et automatisation.

La maîtrise de ces deux outils permet de gérer efficacement les applications système et contribue à maintenir un environnement Linux sain et performant. Le choix entre APT et Snap dépend du contexte spécifique, de l'environnement de déploiement et des exigences en matière de performance et de stabilité.
