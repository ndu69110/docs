# Citations
- https://www.dawan.fr/a-propos/la-societe/virtualisation-et-conteneur-les-avantages-cles-de-docker
- https://about.gitlab.com/fr-fr/blog/what-is-docker-comprehensive-guide/
- https://dyma.fr/blog/docker-et-ses-conteneurs/
- https://pole-innovation.reactic.io/nouvelles-technologies/avantages-docker
- https://www.innosys.fr/ssii-esn-paris/comprendre-docker-et-ses-avantages-pour-les-tpe-et-pme/
- https://www.redhat.com/fr/topics/containers/what-is-docker
- https://datascientest.com/docker-guide-complet
- https://blog.stephane-robert.info/docs/conteneurs/moteurs-conteneurs/docker/
- https://www.axopen.com/blog/2021/03/docker-presentation-concepts-cles/


# Tokens
- prompt_tokens: 274
- completion_tokens: 6238
- total_tokens: 6512
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.094, 'request_cost': 0.006, 'total_cost': 0.1}


# Content
# Introduction à Docker 🐳

Docker est une technologie révolutionnaire qui a transformé la manière dont les applications sont développées, testées et déployées. Cette introduction exhaustive explore les fondamentaux de Docker et les concepts essentiels pour débuter un parcours de maîtrise de cette plateforme.

## À quoi sert Docker ?

Docker résout un problème fondamental en informatique : l'incompatibilité entre environnements. Traditionnellement, les développeurs rencontraient des situations où une application fonctionnait parfaitement sur leur machine locale mais échouait en production. Cette problématique, souvent appelée "ça marche sur ma machine", disparaît complètement avec Docker.[1]

Docker est une **technologie de conteneurisation** qui empaquette le code d'application, ses dépendances et ses bibliothèques dans une unité standardisée appelée conteneur.[2] Cette approche offre plusieurs bénéfices majeurs :

**Cohérence entre les environnements** : Une application conteneurisée fonctionne de manière identique sur le poste de développement, les serveurs de test, et les infrastructures de production, éliminant ainsi les divergences d'environnement.[5]

**Isolation des applications** : Chaque conteneur dispose de son propre espace d'exécution, évitant les conflits entre différentes versions de bibliothèques ou de dépendances. Si une application dans un conteneur rencontre des problèmes, elle n'affectera pas les autres applications.[2][5]

**Efficacité des ressources** : Contrairement aux machines virtuelles traditionnelles qui nécessitent un système d'exploitation complet, Docker utilise une approche plus légère. Les conteneurs partagent le noyau de l'hôte tout en maintenant une isolation complète, réduisant ainsi l'empreinte mémoire et CPU.[2][3]

**Déploiement simplifié** : L'empaquetage de l'application et de ses dépendances dans un conteneur unique simplifie considérablement les processus de déploiement et réduit les risques d'erreur.[2]

**Scalabilité rapide** : Dupliquer un conteneur est extrêmement simple, permettant une montée en charge horizontale aisée selon les besoins applicatifs.[4]

## Comment fonctionne Docker

### Les principes fondamentaux

Docker révolutionne la virtualisation en exploitant les capacités natives du noyau Linux pour créer des environnements d'exécution légers et isolés.[2] Contrairement à la virtualisation traditionnelle qui crée une simulation complète d'un ordinateur physique, Docker utilise une approche différente basée sur la **conteneurisation**.

### Conteneurs vs Machines virtuelles

Pour comprendre le fonctionnement de Docker, il est essentiel de saisir les différences entre conteneurs et machines virtuelles :

| Aspect | Machines Virtuelles | Conteneurs Docker |
|--------|-------------------|-------------------|
| Système d'exploitation | Chacune a son propre OS complet | Partagent le noyau de l'hôte |
| Taille | Plusieurs gigaoctets (OS + application) | Quelques mégaoctets (application seule) |
| Temps de démarrage | Plusieurs minutes | Quelques millisecondes |
| Performance | Surcharge d'émulation matérielle | Performance quasi-native |
| Densité | Quelques VMs par serveur | Plusieurs conteneurs par serveur |
| Isolation | Complète au niveau matériel | Isolation au niveau processus |

### Architecture de Docker

Docker fonctionne selon une architecture client-serveur :

- **Le Client Docker** : Interface en ligne de commande (CLI) ou API graphique avec laquelle l'utilisateur interagit
- **Le Daemon Docker** : Service serveur exécuté en arrière-plan qui gère les conteneurs
- **Les Images Docker** : Blueprints ou modèles contenant toutes les dépendances et configurations nécessaires
- **Les Conteneurs** : Instances en exécution des images
- **Les Registres** : Dépôts centralisés (comme Docker Hub) où sont stockées les images

### Mécanisme d'isolation

Docker utilise plusieurs technologies Linux pour créer cette isolation :[2]

**Espaces de noms (Namespaces)** : Isolent les ressources système pour chaque conteneur (processus, réseau, système de fichiers, etc.)

**Groupes de contrôle (cgroups)** : Limitent et gèrent les ressources (CPU, mémoire) disponibles pour chaque conteneur

**Système de fichiers en couches** : Utilise un système de fichiers Union qui empile des couches, permettant l'efficacité du stockage et la réutilisabilité

### Le système de couches

Docker utilise un mécanisme intelligent de mise en cache des couches.[8] Chaque instruction dans un Dockerfile crée une couche. Si une couche n'a pas changé depuis la dernière construction, Docker réutilise cette couche à partir du cache, accélérant considérablement le processus de construction.

Exemple de structure en couches :

```
Couche de base : Image Ubuntu
   ↓
Couche 1 : Installation de Node.js
   ↓
Couche 2 : Copie du code source
   ↓
Couche 3 : Installation des dépendances npm
   ↓
Couche 4 : Configuration des ports
   ↓
Conteneur final : Ensemble des couches précédentes
```

Cette architecture en couches offre plusieurs avantages : réduction de l'espace disque utilisé, accélération des reconstructions, et facilité du partage d'images.[1]

### Journal des modifications

Dès lors qu'un utilisateur opère des changements sur un fichier image Docker, une couche est créée et un journal des modifications est mis à jour, permettant un contrôle total des modifications réalisées. Cette fonction de superposition de couches permet aussi de facilement restaurer une version précédente.[1]

## À l'abordage ! 🚀

### Les premiers concepts essentiels

Avant de plonger dans l'installation, il est important de comprendre les entités clés avec lesquelles on travaillera :

**Images Docker** : Ce sont des modèles immuables qui contiennent tout ce qui est nécessaire pour exécuter une application : le code, les dépendances, les variables d'environnement, les fichiers de configuration. Une image est créée à partir d'un fichier appelé Dockerfile qui contient des instructions pour construire cette image.

**Conteneurs** : Ce sont des instances en exécution d'une image. Si une image est un moule, un conteneur est l'objet créé à partir de ce moule. Plusieurs conteneurs peuvent être lancés à partir de la même image.

**Dockerfile** : C'est un fichier texte contenant une série d'instructions pour construire une image Docker. Chaque instruction crée une couche dans l'image.

**Docker Hub** : C'est le registre public par défaut où sont stockées les images Docker. On peut y télécharger des images pré-construites ou y publier les siennes.

**docker-compose** : Un outil qui permet de définir et d'exécuter plusieurs conteneurs Docker en même temps, idéal pour les applications multi-conteneurs.[4]

### Le flux de travail typique

Le cycle de vie Docker suit généralement ce processus :

1. **Créer** : Écrire un Dockerfile décrivant l'application et ses dépendances
2. **Construire** : Exécuter la commande `docker build` pour créer une image à partir du Dockerfile
3. **Tester** : Lancer des conteneurs à partir de l'image pour tester l'application
4. **Pousser** : Télécharger l'image vers un registre comme Docker Hub
5. **Déployer** : Lancer des conteneurs en production basés sur cette image
6. **Maintenir** : Gérer les mises à jour et les versions

## Installation de Docker sur Linux et macOS

### Installation sur Linux (Ubuntu/Debian)

Docker fonctionne nativement sur Linux, offrant la meilleure performance et la complète compatibilité. Voici le processus d'installation complet :

**Étape 1 : Prérequis système**

Docker nécessite une version récente du système d'exploitation. Les versions recommandées sont :
- Ubuntu 20.04 LTS ou plus récent
- Debian 10 ou plus récent

**Étape 2 : Dépendances préalables**

Avant l'installation, mettre à jour les références des paquets :

```bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
```

**Étape 3 : Ajout du dépôt Docker officiel**

Ajouter la clé GPG officielle de Docker :

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

Ajouter le dépôt Docker :

```bash
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

**Étape 4 : Installation du moteur Docker**

```bash
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

**Étape 5 : Configuration des permissions utilisateur**

Par défaut, les commandes Docker nécessitent des droits administrateur. Pour éviter de taper `sudo` à chaque fois :

```bash
# Créer le groupe docker (généralement déjà créé)
sudo groupadd docker

# Ajouter l'utilisateur courant au groupe docker
sudo usermod -aG docker $USER

# Activer les modifications du groupe
newgrp docker
```

**Étape 6 : Vérification de l'installation**

```bash
docker --version
docker run hello-world
```

La deuxième commande télécharge et exécute un petit conteneur de test. Si tout fonctionne correctement, le message "Hello from Docker!" s'affiche.

### Installation sur macOS

Sur macOS, Docker ne peut pas s'exécuter directement car le moteur Docker nécessite Linux. Cependant, Docker Desktop for Mac fournit une virtualisation transparente de Linux.

**Étape 1 : Prérequis système**

- macOS 11 (Big Sur) ou plus récent
- Processeur Apple Silicon (M1, M2, etc.) ou Intel
- Au moins 4 GB de RAM alloué à Docker
- VirtualizationFramework activé (par défaut sur tous les Macs modernes)

**Étape 2 : Téléchargement et installation**

Deux versions sont disponibles selon le type de processeur :

Pour les Macs avec processeur Apple Silicon (M1, M2, M3) :
```bash
# Télécharger Docker Desktop (version ARM64)
# Puis double-cliquer sur le fichier DMG téléchargé
# L'application Docker.app apparaît dans le dossier Applications
```

Pour les Macs avec processeur Intel :
```bash
# Télécharger Docker Desktop (version x86_64)
# Puis double-cliquer sur le fichier DMG téléchargé
# L'application Docker.app apparaît dans le dossier Applications
```

**Étape 3 : Configuration initiale**

Lancer Docker.app depuis le dossier Applications. Docker apparaît dans la barre de menu macOS en haut à droite. Une fenêtre de bienvenue s'affiche avec les instructions d'initialisation.

**Étape 4 : Autoriser les permissions**

Docker demande le mot de passe administrateur pour installer les composants requis. Le fournir comme demandé.

**Étape 5 : Configuration des ressources**

Accéder à Docker Desktop → Preferences → Resources pour configurer :

- **CPUs** : Nombre de cœurs CPU alloués (recommandé : au moins 2)
- **Memory** : Quantité de RAM allouée (recommandé : au moins 4 GB)
- **Disk Image Size** : Taille maximale du stockage pour les images et conteneurs
- **Swap** : Mémoire d'échange disponible

**Étape 6 : Vérification de l'installation**

Ouvrir Terminal et exécuter :

```bash
docker --version
docker run hello-world
```

### Configuration commune (Linux et macOS)

Après l'installation, quelques configurations supplémentaires sont recommandées :

**Activer le démarrage automatique de Docker au démarrage du système**

Sur macOS, Docker Desktop s'active automatiquement. Sur Linux :

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

**Configurer Docker daemon**

Créer ou éditer le fichier de configuration Docker :

```bash
sudo nano /etc/docker/daemon.json
```

Exemple de configuration basique :

```json
{
  "debug": false,
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Redémarrer le daemon :

```bash
sudo systemctl restart docker
```

**Vérifier la santé de l'installation**

```bash
docker system info
docker ps
docker images
```

## L'écosystème Docker 🌍

Docker n'existe pas en isolation. Il s'inscrit dans un écosystème riche d'outils et de services qui étendent ses capacités.

### Docker Hub

Docker Hub est le registre public par défaut et le cœur de l'écosystème Docker. C'est une plateforme centralisée où des millions d'images Docker pré-construites sont stockées et mises à disposition.

**Fonctionnalités principales** :

- **Dépôt d'images publiques** : Accès à une immense bibliothèque d'images officielles et de la communauté
- **Dépôts privés** : Possibilité de créer des dépôts privés pour stocker ses propres images
- **Webhooks** : Notifications automatiques lors de mises à jour
- **Intégration CI/CD** : Automatisation des constructions d'images

**Exemples d'images officielles populaires** :

- `ubuntu` : Système d'exploitation Ubuntu
- `node` : Environnement Node.js
- `python` : Environnement Python
- `nginx` : Serveur web Nginx
- `mysql` : Base de données MySQL
- `postgres` : Base de données PostgreSQL
- `redis` : Cache en mémoire Redis

**Utilisation basique** :

```bash
# Rechercher une image
docker search node

# Télécharger une image
docker pull node:18

# Voir les images locales
docker images

# Identifier une image
docker inspect node:18
```

### Docker Compose

Docker Compose est un outil qui permet de définir et d'exécuter des applications multi-conteneurs.[4] Au lieu de lancer chaque conteneur individuellement avec des commandes Docker complexes, on écrit une configuration YAML unique.

**Fichier docker-compose.yml typique** :

```yaml
version: '3.8'

services:
  web:
    image: node:18
    container_name: mon-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./app:/app
    working_dir: /app
    command: npm start
    depends_on:
      - db

  db:
    image: postgres:14
    container_name: ma-base-donnees
    environment:
      POSTGRES_USER: utilisateur
      POSTGRES_PASSWORD: motdepasse
      POSTGRES_DB: mabase
    volumes:
      - ./data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  cache:
    image: redis:7
    container_name: mon-cache
    ports:
      - "6379:6379"
```

**Commandes principales** :

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Exécuter une commande dans un service
docker-compose exec web npm test

# Reconstruire les images
docker-compose up -d --build
```

### Registres Docker alternatifs

Bien que Docker Hub soit le registre par défaut, d'autres options existent :

**GitHub Container Registry** : Intégration native avec GitHub pour stocker et gérer les images Docker.

**GitLab Container Registry** : Solution complète de DevSecOps avec registre d'images intégré.[2]

**Amazon ECR (Elastic Container Registry)** : Registre Docker géré par AWS.

**Google Container Registry** : Registre Google Cloud pour les images conteneurs.

**Azure Container Registry** : Registre Microsoft pour les conteneurs.

### Docker Swarm

Docker Swarm est une solution native d'orchestration de conteneurs intégrée directement dans Docker. Elle permet de gérer un cluster de machines Docker et de déployer des services à grande échelle.

**Concepts clés** :

- **Cluster** : Groupe de machines exécutant le daemon Docker
- **Nœuds** : Les machines individuelles du cluster
- **Services** : Description déclarative du travail désiré
- **Tâches** : Instances d'un service exécutées sur des nœuds

### Kubernetes

Bien qu'extérieur à l'écosystème Docker stricto sensu, Kubernetes est l'orchestrateur de conteneurs le plus populaire aujourd'hui. Docker Desktop inclut une option pour exécuter Kubernetes localement.

**Différences clés entre Docker Swarm et Kubernetes** :

| Aspect | Docker Swarm | Kubernetes |
|--------|-------------|-----------|
| Complexité | Simple | Complexe mais puissant |
| Courbe d'apprentissage | Douce | Abrupte |
| Scalabilité | Bonne | Excellente |
| Écosystème | Petit | Massif |
| Production | Moyennes entreprises | Grandes organisations |

### Outils de gestion et monitoring

L'écosystème Docker propose plusieurs outils pour gérer et monitorer les conteneurs :

**Portainer** : Interface web pour gérer les conteneurs et les images sans ligne de commande.

**Rancher** : Plateforme complète de gestion de conteneurs et Kubernetes.

**Docker Desktop Dashboard** : Interface visuelle intégrée à Docker Desktop pour macOS et Windows.

**Prometheus et Grafana** : Stack de monitoring pour collecter les métriques et visualiser les données.

## Installation de Docker sur Windows 🪟

Docker sur Windows présente un défi unique : le moteur Docker nécessite une structure Linux, alors que Windows est un système d'exploitation différent. Deux solutions existent pour résoudre ce problème.

### Docker Desktop for Windows

C'est la solution la plus simple et la plus recommandée pour la plupart des utilisateurs Windows.

**Prérequis système**

- **Système d'exploitation** : Windows 10 (version 2004 ou plus) ou Windows 11
- **Processeur** : Avec support de la virtualisation (Intel ou AMD)
- **RAM** : Minimum 4 GB (8 GB recommandé)
- **Disque** : Au moins 10 GB d'espace libre
- **Virtualisation** : Hyper-V ou WSL2 (Windows Subsystem for Linux 2) activé

**Vérifier si Hyper-V est activé**

```powershell
# Ouvrir PowerShell en administrateur
Get-WindowsOptionalFeature -Online | Where-Object {$_.FeatureName -eq "Microsoft-Hyper-V"}
```

Si Hyper-V n'est pas activé, l'exécuter :

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

**Étape 1 : Téléchargement**

Télécharger Docker Desktop for Windows depuis le site officiel Docker. Deux versions sont disponibles :

- Docker Desktop Installer.exe (pour installation classique)
- Docker Desktop Portable (version portable, sans installation)

**Étape 2 : Installation**

Double-cliquer sur l'installateur. L'assistant d'installation guide à travers les étapes :

1. Accepter la licence
2. Confirmer le chemin d'installation
3. Sélectionner les options d'intégration shell
4. Choisir entre Hyper-V et WSL2 comme backend

**Recommandation** : WSL2 est généralement recommandé pour de meilleures performances sur Windows 10 et 11 modernes.

**Étape 3 : Redémarrage obligatoire**

Docker demande un redémarrage pour activer les composants du système. Effectuer le redémarrage.

**Étape 4 : Première exécution**

Après redémarrage, lancer Docker Desktop depuis le menu Démarrer. L'application s'ajoute à la barre d'état système. La première exécution prend quelques minutes pour initialiser les composants.

**Étape 5 : Vérification**

Ouvrir PowerShell ou CMD et vérifier l'installation :

```powershell
docker --version
docker run hello-world
```

### WSL 2 vs Hyper-V

**WSL 2 (Windows Subsystem for Linux 2)** :
- Performance supérieure sur Windows
- Consommation mémoire plus efficace
- Recommandé pour la plupart des cas d'usage
- Fourni avec Windows 10 version 2004 et ultérieur

Configuration WSL 2 :

```powershell
# Vérifier la version de WSL
wsl --list --verbose

# Définir WSL 2 comme version par défaut
wsl --set-default-version 2

# Installer ou mettre à jour une distribution Linux
wsl --install -d Ubuntu
```

**Hyper-V** :
- Virtualisation complète
- Isolation complète de Linux
- Peut être moins efficace en ressources
- Compatible avec les éditions Professional et ultérieures de Windows

Sélectionner le backend dans Docker Desktop → Settings → General.

### Configuration avancée de Docker Desktop on Windows

**Allocation de ressources**

Accéder à Docker Desktop → Settings → Resources pour configurer :

- **CPUs** : Nombre de cœurs (recommandé : 4+)
- **Memory** : RAM allouée (recommandé : 6-8 GB)
- **Disk image size** : Taille du stockage virtuel
- **Swap** : Mémoire de swap

**Intégration VSCode**

Docker s'intègre parfaitement avec Visual Studio Code. Installer l'extension "Remote - Containers" pour développer directement dans des conteneurs.

Créer un fichier `.devcontainer/devcontainer.json` :

```json
{
  "name": "Mon environnement Dev",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.vscode-typescript-next",
        "dbaeumer.vscode-eslint"
      ]
    }
  }
}
```

**Gestion des volumes partagés**

Pour partager des dossiers Windows avec les conteneurs :

```powershell
# Dans Docker Desktop → Settings → Resources → File Sharing
# Ajouter les chemins à partager

# Exemple d'utilisation
docker run -v C:\Users\nom\projets:/data image:latest
```

### Installation via WSL 2 avec Docker Engine

Une approche alternative consiste à installer Docker Engine directement dans WSL 2, sans Docker Desktop.

**Étape 1 : Installer WSL 2**

```powershell
wsl --install -d Ubuntu
```

**Étape 2 : Accéder à WSL 2**

```powershell
wsl
```

**Étape 3 : Installer Docker dans WSL 2**

```bash
# Mettre à jour les paquets
sudo apt-get update

# Installer les dépendances
sudo apt-get install -y docker.io docker-compose

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# Redémarrer WSL
exit
wsl
```

**Étape 4 : Vérifier l'installation**

```bash
docker --version
docker run hello-world
```

**Avantages de cette approche** :
- Consommation mémoire plus légère
- Pas besoin de Docker Desktop
- Performances d'exécution natives

**Inconvénients** :
- Gestion manuelle des ressources
- Démarrage manuel du daemon Docker nécessaire
- Moins de support pour l'interface graphique

### Dépannage commun sur Windows

**Docker daemon ne démarre pas**

```powershell
# Vérifier l'état du service Docker
Get-Service Docker

# Redémarrer le service
Restart-Service Docker

# Consulter les logs
Get-EventLog -LogName Application -Source Docker | Select-Object TimeGenerated, Message
```

**Problèmes de performance**

- Augmenter la RAM allouée à Docker Desktop
- Activer WSL 2 si Hyper-V est utilisé
- Vérifier les antivirus qui pourraient ralentir les opérations disque
- Nettoyer les images et conteneurs inutilisés

**Erreur "Cannot connect to Docker daemon"**

```powershell
# Redémarrer Docker Desktop
# Ou relancer le service
Restart-Service Docker

# Réinitialiser Docker
docker system reset
```

## Résumé du parcours d'apprentissage

Le parcours d'introduction à Docker s'articule autour de plusieurs étapes interconnectées :

**Phase 1 : Compréhension conceptuelle** : L'apprenant découvre le problème que Docker résout et saisit les avantages fondamentaux qu'il offre. Cette phase établit la motivation pour l'apprentissage.

**Phase 2 : Mécanismes techniques** : L'apprenant apprend comment Docker fonctionne réellement, incluant les concepts de conteneurs, d'images, de couches et d'isolation. Cette compréhension technique crée la base pour manipuler efficacement Docker.

**Phase 3 : Installation pratique** : Adapté au système d'exploitation spécifique de l'apprenant, ce module guide l'installation étape par étape. Le choix du système d'exploitation détermine le chemin spécifique : Linux offre la solution la plus directe, macOS nécessite une virtualisation transparente, et Windows présente les défis les plus complexes mais des solutions élégantes.

**Phase 4 : Écosystème et outils** : L'apprenant découvre les outils et services qui complètent Docker, particulièrement Docker Hub pour la distribution d'images et Docker Compose pour les applications multi-conteneurs.

**Phase 5 : Premiers pas pratiques** : Avec Docker installé et configuré, l'apprenant peut commencer à télécharger des images, exécuter des conteneurs simples et comprendre le flux de travail de base.

Cette progression logique du conceptuel au pratique, du simple au complexe, prépare solidement l'apprenant pour les modules suivants qui couvriront la création d'images Docker personnalisées, la gestion de conteneurs avancée et l'orchestration.[1][2][3][4][5][6][7]
