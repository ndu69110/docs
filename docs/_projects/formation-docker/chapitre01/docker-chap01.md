---
title: Introduction à Docker

date: 2025-11-27
authors: [ndu69110]
slug: introduction-docker
description: >
  Introduction à Docker
categories:
  - Docker
tags:
  - Docker
---

# Formation Complète sur Docker 🐳

## 📌 Introduction à Docker

### A quoi sert Docker ?
Docker est une plateforme open-source qui permet de développer, déployer et exécuter des applications dans des **conteneurs**. Contrairement aux machines virtuelles, les conteneurs partagent le noyau du système d'exploitation hôte, ce qui les rend plus légers et plus rapides à démarrer.

**Cas d'usage principaux :**
- Développement et tests d'applications (environnements reproductibles)
- Déploiement d'applications (microservices, CI/CD)
- Isolation des applications (sécurité et performance)

---

## 🔧 Comment fonctionne Docker ?

### Architecture de Docker
Docker repose sur une architecture client-serveur avec les composants suivants :

1. **Docker Daemon** (`dockerd`) : Service en arrière-plan qui gère les conteneurs.
2. **Docker Client** (`docker`) : Interface en ligne de commande pour interagir avec le daemon.
3. **Docker Images** : Modèles immuables pour créer des conteneurs.
4. **Docker Containers** : Instances exécutables d'images.
5. **Docker Registry** : Dépôt d'images (ex: Docker Hub, GitLab Container Registry).

### Cycle de vie d'un conteneur
1. **Création** : À partir d'une image (`docker run`).
2. **Exécution** : Le conteneur s'exécute dans un environnement isolé.
3. **Modification** : Les changements sont temporaires (sauf avec `docker commit`).
4. **Arrêt** : Le conteneur peut être redémarré (`docker stop`).

---

## 🚢 A l'abordage !

### Prérequis
- Connaissances de base en ligne de commande.
- Un système Linux, Windows ou macOS.

### Objectifs de la formation
- Comprendre les concepts de base de Docker.
- Installer Docker sur différentes plateformes.
- Créer et gérer des conteneurs.
- Utiliser Docker Compose pour les applications multi-conteneurs.

---

## 🐧 Installation de Docker sur Linux

### Étapes d'installation (Ubuntu/Debian)
```bash
# Mise à jour des paquets
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Ajout de la clé GPG officielle de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajout du dépôt Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installation de Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Vérification de l'installation
sudo docker run hello-world
```

### Post-installation
- Ajouter votre utilisateur au groupe `docker` pour éviter `sudo` :
  ```bash
  sudo usermod -aG docker $USER
  newgrp docker
  ```

---

## 🍎 Installation de Docker sur macOS

### Installation via Docker Desktop
1. Télécharger Docker Desktop depuis [le site officiel](https://www.docker.com/products/docker-desktop/).
2. Ouvrir le fichier `.dmg` et déplacer Docker dans le dossier `Applications`.
3. Lancer Docker Desktop et suivre les instructions d'installation.

### Vérification
```bash
docker --version
docker run hello-world
```

---

## 🪟 Installation de Docker sur Windows

### Prérequis
- Windows 10/11 Pro, Enterprise ou Education (64-bit).
- Hyper-V activé (ou WSL2 pour les versions non Pro).

### Étapes d'installation
1. Télécharger Docker Desktop depuis [le site officiel](https://www.docker.com/products/docker-desktop/).
2. Exécuter l'installateur et suivre les instructions.
3. Redémarrer le PC si nécessaire.

### Vérification
Ouvrir PowerShell et exécuter :
```powershell
docker --version
docker run hello-world
```

---

## 🌐 L’écosystème Docker

### Outils complémentaires
- **Docker Compose** : Orchestration de multi-conteneurs (`docker-compose.yml`).
- **Docker Swarm** : Orchestration native pour les clusters Docker.
- **Docker Hub** : Registre public d'images.
- **Portainer** : Interface graphique pour gérer Docker.

### Bonnes pratiques
- Utiliser des fichiers `Dockerfile` pour créer des images.
- Limiter les privilèges des conteneurs (`--read-only`).
- Nettoyer les images et conteneurs inutilisés (`docker system prune`).

---

## 🎯 Conclusion

Docker est un outil puissant pour la conteneurisation, facilitant le développement, le déploiement et la gestion d'applications. En maîtrisant les concepts de base et les outils associés, vous serez prêt à intégrer Docker dans vos projets.

**Prochaines étapes :**
- Créer votre premier `Dockerfile`.
- Explorer Docker Compose pour des applications multi-conteneurs.
- Déployer des conteneurs sur un serveur cloud.

Bon codage ! 🚀
