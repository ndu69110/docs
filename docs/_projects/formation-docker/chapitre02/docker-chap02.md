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

# Formation Détaillée sur Docker 🐳

## Introduction
Cette formation couvre les concepts fondamentaux de Docker, avec un focus sur la gestion des images, des conteneurs, et les opérations courantes. Nous aborderons également le cycle de vie d'un conteneur et des commandes avancées.

---

## 1. Obtenir de l'aide, lister et supprimer des images et des conteneurs

### Obtenir de l'aide
Pour obtenir de l'aide sur une commande Docker, utilisez :
```bash
docker --help
docker <commande> --help
```

### Lister les images
```bash
# Lister toutes les images locales
docker images

# Lister les images avec plus de détails
docker images --all --no-trunc
```

### Lister les conteneurs
```bash
# Lister les conteneurs en cours d'exécution
docker ps

# Lister tous les conteneurs (y compris arrêtés)
docker ps -a

# Lister les conteneurs avec plus de détails
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
```

### Supprimer des images
```bash
# Supprimer une image par son ID ou nom
docker rmi <image_id_or_name>

# Supprimer toutes les images non utilisées
docker image prune
```

### Supprimer des conteneurs
```bash
# Supprimer un conteneur arrêté
docker rm <container_id_or_name>

# Supprimer un conteneur en cours d'exécution (force)
docker rm -f <container_id_or_name>

# Supprimer tous les conteneurs arrêtés
docker container prune
```

---

## 2. Docker pause, unpause, rename et exec

### Pause/Unpause un conteneur
```bash
# Mettre en pause un conteneur
docker pause <container_id_or_name>

# Reprendre un conteneur en pause
docker unpause <container_id_or_name>
```

### Renommer un conteneur
```bash
docker rename <old_name> <new_name>
```

### Exécuter une commande dans un conteneur
```bash
# Ouvrir un shell interactif dans un conteneur
docker exec -it <container_id_or_name> /bin/bash

# Exécuter une commande spécifique
docker exec <container_id_or_name> ls /app
```

---

## 3. Le cycle de vie d'un conteneur

### Créer et démarrer un conteneur
```bash
# Créer et démarrer un conteneur (avec allocation de pseudo-TTY)
docker run -it --name <container_name> <image_name> /bin/bash

# Démarrer un conteneur arrêté
docker start <container_id_or_name>

# Redémarrer un conteneur
docker restart <container_id_or_name>
```

### Arrêter et supprimer un conteneur
```bash
# Arrêter un conteneur
docker stop <container_id_or_name>

# Forcer l'arrêt d'un conteneur
docker kill <container_id_or_name>

# Supprimer un conteneur
docker rm <container_id_or_name>
```

### Cycle de vie complet
1. **Création** : `docker create`
2. **Démarrage** : `docker start`
3. **Exécution** : `docker exec`
4. **Arrêt** : `docker stop`
5. **Suppression** : `docker rm`

---

## 4. Copier des fichiers et inspecter un conteneur

### Copier des fichiers vers/depuis un conteneur
```bash
# Copier un fichier depuis le conteneur vers l'hôte
docker cp <container_id_or_name>:/path/to/file /host/path

# Copier un fichier depuis l'hôte vers le conteneur
docker cp /host/path/file <container_id_or_name>:/path/to/destination
```

### Inspecter un conteneur
```bash
# Obtenir des informations détaillées sur un conteneur
docker inspect <container_id_or_name>

# Obtenir l'adresse IP d'un conteneur
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id_or_name>

# Obtenir les logs d'un conteneur
docker logs <container_id_or_name>

# Obtenir les logs en temps réel
docker logs -f <container_id_or_name>
```

---

## 5. Récapitulatif et approfondissement

### Commandes essentielles
| Commande | Description |
|----------|-------------|
| `docker images` | Lister les images |
| `docker ps` | Lister les conteneurs |
| `docker run` | Créer et démarrer un conteneur |
| `docker stop` | Arrêter un conteneur |
| `docker rm` | Supprimer un conteneur |
| `docker rmi` | Supprimer une image |
| `docker exec` | Exécuter une commande dans un conteneur |
| `docker logs` | Afficher les logs d'un conteneur |

### Approfondissement
- **Volumes** : `docker volume create`, `docker run -v`
- **Réseaux** : `docker network create`, `docker run --network`
- **Compose** : Utiliser `docker-compose.yml` pour gérer des applications multi-conteneurs

---

## 6. Premier conteneur

### Lancer un conteneur simple
```bash
# Lancer un conteneur Nginx
docker run -d --name my-nginx -p 8080:80 nginx

# Vérifier que le conteneur est en cours d'exécution
docker ps

# Accéder à Nginx via le navigateur : http://localhost:8080
```

### Lancer un conteneur interactif
```bash
# Lancer un conteneur Ubuntu avec un shell interactif
docker run -it --name my-ubuntu ubuntu /bin/bash

# Quitter le conteneur (sans le supprimer)
exit
```

---

## 7. Lancer un conteneur

### Options courantes
```bash
# Lancer un conteneur en arrière-plan
docker run -d <image_name>

# Lancer un conteneur avec un port exposé
docker run -p <host_port>:<container_port> <image_name>

# Lancer un conteneur avec un volume monté
docker run -v /host/path:/container/path <image_name>

# Lancer un conteneur avec des variables d'environnement
docker run -e "VAR=value" <image_name>
```

### Exemple complet
```bash
# Lancer un conteneur MySQL avec persistance des données
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -p 3306:3306 \
  -v /my/own/datadir:/var/lib/mysql \
  mysql:latest
```

---

## Conclusion
Cette formation couvre les bases de Docker pour gérer des images, des conteneurs, et effectuer des opérations courantes. Pour aller plus loin, explorez les volumes, les réseaux, et Docker Compose pour des déploiements plus complexes. 🚀
