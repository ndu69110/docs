# Citations
- https://blog.alphorm.com/cycle-de-vie-des-conteneurs-docker
- https://syslearn.fr/docker-ses-caracteristiques/
- https://blog.stephane-robert.info/docs/conteneurs/moteurs-conteneurs/docker/
- https://labex.io/fr/tutorials/docker-how-to-track-docker-container-status-418069
- https://www.datacamp.com/fr/blog/docker-interview-questions
- https://www.hostinger.com/fr/tutoriels/tutoriel-docker
- https://learn.microsoft.com/fr-fr/dotnet/architecture/microservices/container-docker-introduction/
- https://sysblog.informatique.univ-paris-diderot.fr/2019/03/08/docker-facile-en-7-etapes/
- https://scalastic.io/cka-certification-day-1-docker/


# Tokens
- prompt_tokens: 318
- completion_tokens: 8073
- total_tokens: 8391
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.121, 'request_cost': 0.006, 'total_cost': 0.128}


# Content
# Chapitre 2 : Découvrir les Bases de Docker

## Premier Conteneur et Lancement Pratique

### Comprendre les Fondamentaux

Docker fonctionne selon un modèle client-serveur où le Daemon Docker (dockerd) représente le service central gérant les images, les conteneurs et leur cycle de vie[9]. Lorsqu'une personne exécute une commande Docker, elle communique avec ce daemon qui traite les requêtes du client.

Un conteneur Docker est une instance exécutable d'une image Docker[2]. Lorsqu'une image est exécutée, elle se transforme en conteneur, créant un environnement isolé avec son propre système de fichiers, ses propres processus et son propre réseau, bien que partageant le noyau du système d'exploitation hôte[2].

### Lancer un Premiers Conteneurs

La commande de base pour lancer un conteneur est la suivante :

```bash
docker run alpine
```

Cette commande télécharge l'image alpine et lance un conteneur basé sur cette image[1]. Pour vérifier l'état du conteneur, la commande suivante affiche tous les conteneurs, y compris ceux arrêtés :

```bash
docker ps -a
```

Le résultat montre que le conteneur a démarré il y a quelques minutes avant de s'arrêter de lui-même[1]. Cette démonstration illustre le cycle de vie éphémère des conteneurs exécutant des tâches ponctuelles.

### Le Flux de Travail Docker : Du Dockerfile au Conteneur

Le processus de travail avec Docker suit une séquence logique[2] :

| Étape | Description | Exemple |
|-------|-------------|---------|
| **Construction d'une image** | Le développeur écrit un Dockerfile spécifiant comment l'image doit être construite (OS de base, dépendances, code à copier, commande au démarrage) | `FROM ubuntu:22.04` |
| **Création de l'image** | Le Dockerfile est compilé en image Docker réutilisable | `docker build -t mon-app:1.0 .` |
| **Instanciation du conteneur** | L'image est exécutée, créant un conteneur isolé | `docker run mon-app:1.0` |
| **Couches d'images** | Les images Docker sont construites en couches empilées, chaque instruction du Dockerfile créant une nouvelle couche en lecture seule | Architecture layered filesystem |

---

## Le Cycle de Vie d'un Conteneur

### Les États d'un Conteneur

Un conteneur Docker passe par un cycle de vie bien défini qui détermine les états dans lesquels le conteneur peut se trouver et comment il fonctionne dans ces états[5]. Comprendre ce cycle est fondamental pour gérer efficacement les applications conteneurisées.

### Cycle de Vie de Base vs Cycle de Vie Avancé

Le cycle de vie des conteneurs se divise en deux modèles distincts selon l'utilisation prévue[1] :

**Cycle de Vie de Base**

Le cycle de vie de base est adapté aux tâches temporaires et ponctuelles[1]. Dans ce modèle, les conteneurs sont des artisans temporaires, dédiés à des missions spécifiques. Que ce soit pour des compilations rapides, des traitements de données ou des opérations de courte durée, le cycle de vie de base offre une solution agile et efficace.

Le processus fonctionne comme suit :

- **Lancement et exécution** : À partir d'une image Docker, le conteneur émerge, prêt à accomplir sa mission assignée[1]
- **Exécution de la tâche** : Une fois le processus ou la tâche terminé(e), le conteneur se retire aussi discrètement qu'il est apparu[1]
- **Arrêt automatique** : Le conteneur s'arrête en seulement quelques secondes après la fin de sa mission, même si aucune action n'a été entreprise depuis le lancement[1]

**Cycle de Vie Avancé**

Le cycle de vie avancé est conçu pour les applications en mode service, offrant une disponibilité continue[1]. Dans ce royaume, les conteneurs deviennent des gardiens fidèles, fournissant des services continus et accessibles à tout moment.

Les caractéristiques principales incluent :

- **Persistance** : Les conteneurs continuent de fonctionner pour répondre aux demandes des clients[1]
- **Accessibilité externe** : Les conteneurs du cycle de vie avancé sont souvent accessibles par des clients externes, ce qui en fait des éléments essentiels pour les applications distribuées[1]
- **Infrastructure robuste** : Cette approche offre une infrastructure robuste pour répondre aux demandes les plus exigeantes, qu'il s'agisse d'applications Web, de services back-end ou de bases de données[1]

### Tableau Comparatif des Deux Cycles de Vie

| Aspect | Cycle de Vie de Base | Cycle de Vie Avancé |
|--------|----------------------|---------------------|
| **Utilisation prévue** | Tâches temporaires et ponctuelles | Applications en mode service |
| **Persistance** | Éphémère, se termine après la tâche | Persistant, continue de fonctionner |
| **Durée de vie** | Quelques secondes à quelques minutes | Indéfini, selon les besoins |
| **Accessibilité** | Généralement interne ou locale | Accessible par des clients externes |
| **Cas d'usage** | Compilations, traitements de données, opérations ponctuelles | Applications Web, services back-end, bases de données |
| **Disponibilité** | Ponctuelle | Continue |

### États Détaillés du Cycle de Vie

Bien que les recherches ne détaillent pas explicitement chaque état, le cycle de vie complet d'un conteneur inclut généralement :

1. **État Created** : Le conteneur a été créé mais n'est pas encore en cours d'exécution
2. **État Running** : Le conteneur exécute activement son processus principal
3. **État Paused** : Le conteneur est gelé, tous les processus sont suspendus
4. **État Stopped** : Le conteneur s'est arrêté de manière propre
5. **État Restarting** : Le conteneur redémarre après un arrêt

---

## Obtenir de l'Aide, Lister et Supprimer des Images et des Conteneurs

### Obtenir de l'Aide avec Docker

Docker offre plusieurs façons d'accéder à la documentation et à l'aide directement depuis la ligne de commande. La commande la plus fondamentale est :

```bash
docker help
```

Cette commande affiche la liste complète des commandes disponibles et leurs descriptions. Pour obtenir de l'aide sur une commande spécifique, l'utilisateur peut consulter :

```bash
docker [COMMANDE] --help
```

Par exemple, pour obtenir de l'aide sur la commande `run` :

```bash
docker run --help
```

### Lister les Images Docker

Pour visualiser toutes les images disponibles localement sur le système, la commande suivante est utilisée :

```bash
docker images
```

Cette commande retourne un tableau affichant :

| Colonne | Description |
|---------|-------------|
| **REPOSITORY** | Le nom ou l'identifiant du dépôt de l'image |
| **TAG** | L'étiquette de version de l'image (par défaut `latest`) |
| **IMAGE ID** | L'identifiant unique hexadécimal de l'image |
| **CREATED** | La date et l'heure de création de l'image |
| **SIZE** | La taille de l'image en mégaoctets ou gigaoctets |

Pour obtenir plus de détails sur les images, notamment les couches, la commande suivante fournit des informations complémentaires :

```bash
docker image inspect [IMAGE_ID_OU_NOM]
```

### Lister les Conteneurs

Pour afficher tous les conteneurs en cours d'exécution, la commande basique est :

```bash
docker ps
```

Pour inclure les conteneurs arrêtés ou en pause, l'option `-a` (all) est nécessaire :

```bash
docker ps -a
```

Le résultat affiche un tableau contenant les informations suivantes :

| Colonne | Signification |
|---------|---------------|
| **CONTAINER ID** | L'identifiant unique du conteneur (hexadécimal) |
| **IMAGE** | L'image à partir de laquelle le conteneur a été lancé |
| **COMMAND** | La commande exécutée au démarrage du conteneur |
| **CREATED** | La date et l'heure de création du conteneur |
| **STATUS** | L'état actuel (Running, Exited, Paused, etc.) |
| **PORTS** | Les ports mappés entre l'hôte et le conteneur |
| **NAMES** | Le nom assigné au conteneur |

Pour filtrer les conteneurs selon leur état :

```bash
docker ps -f status=exited
docker ps -f status=running
```

### Supprimer des Images

Pour supprimer une image Docker locale, la commande utilisée est :

```bash
docker rmi [IMAGE_ID_OU_NOM]
```

Exemples pratiques :

```bash
# Supprimer une image par son ID
docker rmi a1b2c3d4e5f6

# Supprimer une image par son nom et tag
docker rmi ubuntu:22.04

# Forcer la suppression d'une image même si elle est utilisée
docker rmi -f ubuntu:22.04
```

**Important** : Une image ne peut être supprimée que si aucun conteneur ne l'utilise. Si des conteneurs la référencent, même à l'état arrêté, l'option `-f` (force) est nécessaire pour forcer la suppression[3].

### Supprimer des Conteneurs

Pour supprimer un conteneur, la commande `docker rm` est utilisée[3]. Cette commande permet de gérer le cycle de vie des conteneurs et de supprimer définitivement un conteneur qui n'est plus nécessaire[3] :

```bash
docker rm [CONTAINER_ID_OU_NOM]
```

Exemples pratiques :

```bash
# Supprimer un conteneur par son ID
docker rm a1b2c3d4e5f6

# Supprimer un conteneur par son nom
docker rm mon-conteneur

# Forcer la suppression d'un conteneur en cours d'exécution
docker rm -f mon-conteneur
```

Pour nettoyer automatiquement les conteneurs arrêtés, l'option `--rm` peut être utilisée lors du lancement :

```bash
docker run --rm alpine
```

Cette approche garantit que le conteneur est automatiquement supprimé une fois qu'il s'arrête[3].

### Gestion de l'Espace Disque et du Nettoyage

Pour visualiser l'utilisation de l'espace disque par les images, conteneurs, volumes et réseaux, la commande suivante est très utile[3] :

```bash
docker system df
```

Le résultat affiche un tableau de résumé avec les colonnes suivantes[3] :

| Colonne | Description |
|---------|-------------|
| **TYPE** | Le type de ressource (images, containers, volumes, etc.) |
| **TOTAL** | Le nombre total d'éléments pour chaque type |
| **ACTIVE** | Le nombre d'éléments actuellement utilisés |
| **SIZE** | L'espace disque total occupé par chaque type |
| **RECLAIMABLE** | L'espace disque qui peut être récupéré (réutilisé ou libéré) |

Pour nettoyer les ressources inutilisées :

```bash
# Supprimer tous les conteneurs arrêtés
docker container prune

# Supprimer toutes les images non utilisées
docker image prune

# Supprimer les volumes non utilisés
docker volume prune

# Nettoyage complet de tous les éléments non utilisés
docker system prune
```

---

## Docker Pause, Unpause, Rename et Exec

### Pause et Unpause de Conteneurs

La capacité de mettre en pause et de reprendre les conteneurs offre un contrôle granulaire sans nécessiter l'arrêt complet du conteneur.

**Mettre en Pause un Conteneur**

La commande `docker pause` suspend tous les processus en cours d'exécution dans un conteneur :

```bash
docker pause [CONTAINER_ID_OU_NOM]
```

Lorsqu'un conteneur est mis en pause :

- Tous les processus sont gelés instantanément
- La mémoire et les ressources utilisées sont conservées
- Le conteneur reste assigné à ses ressources
- L'état du conteneur change à "Paused"

Exemple pratique :

```bash
# Lancer un conteneur en arrière-plan
docker run -d --name mon-app nginx

# Mettre le conteneur en pause
docker pause mon-app

# Vérifier l'état avec docker ps
docker ps
```

**Reprendre l'Exécution d'un Conteneur**

La commande `docker unpause` reprend l'exécution d'un conteneur précédemment mis en pause :

```bash
docker unpause [CONTAINER_ID_OU_NOM]
```

Exemple pratique :

```bash
# Reprendre le conteneur
docker unpause mon-app

# Vérifier que le conteneur s'exécute à nouveau
docker ps
```

### Renommer un Conteneur

La commande `docker rename` permet de changer le nom d'un conteneur existant[3]. Cette fonctionnalité est utile pour organiser et identifier les conteneurs de manière plus lisible :

```bash
docker rename [ANCIEN_NOM] [NOUVEAU_NOM]
```

Exemple pratique :

```bash
# Renommer un conteneur
docker rename mon-app app-production

# Vérifier le changement
docker ps -a
```

**Points importants concernant le renommage** :

- Le conteneur peut être en cours d'exécution ou arrêté
- Seul le nom change, pas l'ID du conteneur
- Si le nouveau nom existe déjà, une erreur s'affiche
- Les références dans d'autres conteneurs utilisant le nom doivent être mises à jour

### Exécuter des Commandes dans un Conteneur en Cours d'Exécution

La commande `docker exec` permet d'exécuter une commande dans un conteneur déjà en cours d'exécution, sans avoir besoin de créer un nouveau conteneur[3]. C'est un outil puissant pour le débogage, l'administration et l'exécution de tâches ad hoc.

**Syntaxe de Base**

```bash
docker exec [OPTIONS] [CONTAINER_ID_OU_NOM] [COMMANDE]
```

**Options Courantes**

| Option | Description | Exemple |
|--------|-------------|---------|
| `-i` | Garder STDIN ouvert même sans attachement | `docker exec -i mon-app` |
| `-t` | Allouer un pseudo-terminal | `docker exec -t mon-app` |
| `-it` | Combinaison interactive avec terminal | `docker exec -it mon-app bash` |
| `-u` | Exécuter en tant qu'utilisateur spécifique | `docker exec -u root mon-app` |
| `-w` | Définir le répertoire de travail | `docker exec -w /app mon-app` |
| `-e` | Définir des variables d'environnement | `docker exec -e VAR=valeur mon-app` |

**Exemples Pratiques**

Accès interactif au shell d'un conteneur :

```bash
# Lancer un conteneur nginx
docker run -d --name serveur nginx

# Accéder au shell bash du conteneur
docker exec -it serveur bash
```

Une fois connecté au conteneur, il est possible d'exécuter des commandes comme dans un système d'exploitation standard :

```bash
# À l'intérieur du conteneur
root@container:/# ls -la
root@container:/# cat /etc/os-release
root@container:/# exit
```

Exécuter une commande spécifique sans accès interactif :

```bash
# Afficher le contenu d'un fichier
docker exec mon-app cat /etc/nginx/nginx.conf

# Exécuter un script
docker exec mon-app /app/scripts/backup.sh

# Vérifier le statut d'un service
docker exec mon-app service nginx status
```

Exécuter une commande en tant qu'utilisateur spécifique :

```bash
# Exécuter en tant que root
docker exec -u root mon-app apt-get update

# Exécuter en tant qu'utilisateur non-root
docker exec -u appuser mon-app whoami
```

Exécuter une commande avec des variables d'environnement :

```bash
# Passer des variables d'environnement
docker exec -e ENV=production mon-app /app/start.sh
```

---

## Copier des Fichiers et Inspecter un Conteneur

### Copier des Fichiers entre l'Hôte et le Conteneur

La commande `docker cp` permet de copier des fichiers et des répertoires entre le système hôte et un conteneur, ou vice-versa. C'est un outil essentiel pour transférer des configurations, des données ou des scripts.

**Syntaxe de Base**

```bash
# Copier du conteneur vers l'hôte
docker cp [CONTAINER_ID_OU_NOM]:[CHEMIN_CONTENEUR] [CHEMIN_HÔTE]

# Copier de l'hôte vers le conteneur
docker cp [CHEMIN_HÔTE] [CONTAINER_ID_OU_NOM]:[CHEMIN_CONTENEUR]
```

**Exemples Pratiques**

Copier un fichier du conteneur vers l'hôte :

```bash
# Copier un fichier de configuration
docker cp mon-app:/etc/nginx/nginx.conf ./nginx.conf

# Copier un fichier journal
docker cp mon-app:/var/log/app.log ./logs/
```

Copier un répertoire entier :

```bash
# Copier un répertoire du conteneur vers l'hôte
docker cp mon-app:/app ./app-backup

# Copier un répertoire de l'hôte vers le conteneur
docker cp ./config mon-app:/etc/app
```

Copier vers le conteneur :

```bash
# Copier un fichier de configuration
docker cp ./app-config.json mon-app:/app/config.json

# Copier un script
docker cp ./backup.sh mon-app:/scripts/backup.sh
```

**Points Importants**

- Le conteneur peut être en cours d'exécution ou arrêté
- Les chemins sont résolus relativement au répertoire de travail
- Les permissions de fichiers sont préservées lors de la copie
- Les chemins absolus doivent être utilisés pour clarté

### Inspecter un Conteneur

La commande `docker inspect` fournit des informations détaillées sur la configuration et l'état d'un conteneur[3]. Cette commande retourne des données au format JSON contenant une multitude d'informations.

**Syntaxe de Base**

```bash
docker inspect [CONTAINER_ID_OU_NOM]
```

**Informations Retournées**

La commande retourne un objet JSON contenant, entre autres :

| Information | Description |
|------------|-------------|
| **Id** | L'ID complet du conteneur |
| **Created** | L'horodatage de création du conteneur |
| **Path** | Le chemin de la commande à exécuter |
| **Args** | Les arguments de la commande |
| **State** | L'état actuel du conteneur (Running, Paused, Exited) |
| **Image** | L'image utilisée pour créer le conteneur |
| **ResolvConfPath** | Chemin vers le fichier de résolution DNS |
| **Hostname** | Le nom d'hôte du conteneur |
| **Env** | Les variables d'environnement |
| **Mounts** | Les volumes et bindages montés |
| **NetworkSettings** | Configuration réseau (IP, ports) |
| **Config** | Configuration du conteneur (utilisateur, working directory) |

**Exemples Pratiques**

Inspecter un conteneur entier :

```bash
docker inspect mon-app
```

Extraire une information spécifique en utilisant le format personnalisé :

```bash
# Obtenir l'adresse IP du conteneur
docker inspect -f '{{.NetworkSettings.IPAddress}}' mon-app

# Obtenir l'état du conteneur
docker inspect -f '{{.State.Status}}' mon-app

# Obtenir les variables d'environnement
docker inspect -f '{{json .Config.Env}}' mon-app

# Obtenir les volumes montés
docker inspect -f '{{json .Mounts}}' mon-app
```

Inspecter plusieurs conteneurs :

```bash
docker inspect $(docker ps -q)
```

Afficher les informations au format lisible :

```bash
# Afficher en JSON formaté
docker inspect mon-app | jq

# Filtrer les informations réseau
docker inspect mon-app | jq '.[] | .NetworkSettings'
```

### Volumes Docker : Persistance des Données

Un problème courant en conteneurisation est la perte de données critiques lorsque les conteneurs sont arrêtés ou supprimés, en raison d'une gestion inefficace des données[1]. Cela peut entraîner la perte de configurations importantes, de journaux d'activités, ou même de bases de données entières, compromettant la stabilité et la fiabilité des applications[1].

**Utilité des Volumes**

Les volumes Docker sont utilisés pour persister des données en dehors du cycle de vie des conteneurs[3]. En effet, lorsqu'un conteneur est supprimé, toutes les données qu'il contenait disparaissent. Les volumes permettent de sauvegarder ces données de manière permanente, même si le conteneur est supprimé et recréé[3].

Docker permet de monter des volumes, c'est-à-dire de connecter une partie du système de fichiers de l'hôte au conteneur[3]. Cela permet aussi de partager des données entre plusieurs conteneurs[3].

**Syntaxe de Montage de Volumes**

```bash
# Lors du lancement d'un conteneur
docker run -v [CHEMIN_HÔTE]:[CHEMIN_CONTENEUR] [IMAGE]

# Ou avec une syntaxe plus explicite
docker run --volume [CHEMIN_HÔTE]:[CHEMIN_CONTENEUR] [IMAGE]
```

**Exemple Pratique avec une Base de Données**

```bash
# Créer un conteneur PostgreSQL avec volume persistant
docker run -d \
  --name db-prod \
  -e POSTGRES_PASSWORD=motdepasse \
  -v /data/postgresql:/var/lib/postgresql/data \
  postgres:15

# Même après suppression du conteneur, les données persistent
docker rm db-prod

# Créer un nouveau conteneur utilisant le même volume
docker run -d \
  --name db-prod-2 \
  -e POSTGRES_PASSWORD=motdepasse \
  -v /data/postgresql:/var/lib/postgresql/data \
  postgres:15
```

---

## Arrêter et Gérer les Instances de Conteneurs

### Arrêter un Conteneur

La commande `docker stop` arrête proprement un conteneur en cours d'exécution[3]. Cette commande envoie un signal SIGTERM au processus principal du conteneur, lui permettant de se terminer gracieusement[3] :

```bash
docker stop [CONTAINER_ID_OU_NOM]
```

Exemple pratique :

```bash
# Arrêter un conteneur
docker stop mon-app

# Arrêter plusieurs conteneurs
docker stop mon-app app2 app3

# Arrêter tous les conteneurs en cours d'exécution
docker stop $(docker ps -q)
```

**Particularités de l'arrêt**

- Le conteneur n'est pas supprimé, seulement arrêté
- Les données du conteneur sont conservées
- Un délai de grâce par défaut de 10 secondes est accordé avant SIGKILL
- Le délai peut être personnalisé avec l'option `-t` :

```bash
# Attendre 30 secondes avant de forcer l'arrêt
docker stop -t 30 mon-app
```

### Supprimer un Conteneur

La commande `docker rm` supprime définitivement un conteneur qui n'est plus nécessaire[3]. Contrairement à `stop`, cette commande supprime complètement le conteneur et ses données[3] :

```bash
docker rm [CONTAINER_ID_OU_NOM]
```

Exemple pratique :

```bash
# Supprimer un conteneur arrêté
docker rm mon-app

# Supprimer plusieurs conteneurs
docker rm mon-app app2 app3

# Forcer la suppression d'un conteneur en cours d'exécution
docker rm -f mon-app

# Supprimer tous les conteneurs arrêtés
docker rm $(docker ps -aq)
```

### Tableau Comparatif : Stop vs Remove

| Aspect | `docker stop` | `docker rm` |
|--------|---------------|-----------|
| **Action** | Arrête le processus | Supprime le conteneur |
| **Récupérabilité** | Le conteneur peut être redémarré | Le conteneur est perdu à jamais |
| **Données** | Les données sont conservées | Les données sont supprimées |
| **État requis** | Conteneur doit être en cours d'exécution | Conteneur arrêté ou en cours d'exécution avec `-f` |
| **Processus** | Envoi de SIGTERM | Suppression définitive |
| **Temps** | Peut nécessiter quelques secondes | Immédiat |

### Redémarrer un Conteneur

Pour redémarrer un conteneur arrêté, la commande suivante est utilisée :

```bash
docker start [CONTAINER_ID_OU_NOM]
```

Exemple pratique :

```bash
# Redémarrer un conteneur arrêté
docker start mon-app

# Redémarrer plusieurs conteneurs
docker start app1 app2 app3
```

Pour redémarrer un conteneur en cours d'exécution ou arrêté :

```bash
docker restart [CONTAINER_ID_OU_NOM]
```

---

## Récapitulatif et Approfondissement

### Synthèse du Chemin d'Apprentissage

L'apprentissage des bases de Docker suit une progression logique construisant les fondations nécessaires pour la gestion professionelle des conteneurs.

**Phase 1 : Lancement Initial**

L'apprentissage débute par la compréhension du concept fondamental : un conteneur est une instance exécutable d'une image Docker[2]. La première étape pratique consiste à lancer un conteneur simple, permettant de visualiser le cycle de vie de base et comprendre comment Docker fonctionne de manière opérationnelle.

**Phase 2 : Gestion et Organisation**

Une fois les bases comprises, il devient nécessaire de gérer les ressources Docker. Cette phase couvre :

- **Lister** les images et conteneurs pour visualiser l'état actuel du système
- **Supprimer** les ressources obsolètes pour maintenir une propreté du système
- **Utiliser l'aide** pour explorer les commandes disponibles

L'importance d'une gestion appropriée de l'espace disque est particulièrement relevée par la possibilité d'une perte de contrôle sur les ressources Docker si cette gestion n'est pas effectuée régulièrement[3].

**Phase 3 : Contrôle Avancé**

Après avoir maîtrisé les opérations de base, l'apprentissage avance vers le contrôle fin des conteneurs :

- **Pause et Unpause** : Permettent le contrôle granulaire sans arrêt complet
- **Renommage** : Facilite l'organisation et l'identification
- **Exécution de commandes** : Ouvre les possibilités de débogage et d'administration

**Phase 4 : Manipulation de Données**

L'interaction avec les conteneurs s'étend au transfert de données :

- **Copier des fichiers** entre l'hôte et le conteneur
- **Inspecter** pour comprendre l'état détaillé
- **Utiliser les volumes** pour la persistance des données

**Phase 5 : Cycle de Vie Complet**

L'apprentissage se conclut par la maîtrise complète du cycle de vie :

- **Arrêt gracieux** avec `docker stop`
- **Suppression définitive** avec `docker rm`
- **Redémarrage** avec `docker start`

### Principes Fondamentaux Retenus

**Isolation et Légèreté**

Les conteneurs Docker représentent une avancée majeure en permettant l'empaquetage d'une application et ses dépendances dans un conteneur isolé, qui peut être exécuté sur n'importe quel système[8]. Cette isolation est réalisée tout en partageant le noyau du système d'exploitation hôte, ce qui rend les conteneurs beaucoup plus légers que des machines virtuelles traditionnelles[2].

**Gestion Appropriée des Ressources**

Comprendre les nuances du cycle de vie des conteneurs permet d'adapter l'infrastructure Docker à des scénarios d'utilisation variés, allant des tâches temporaires aux services persistants[1]. En utilisant le bon modèle de cycle de vie, il est possible de maximiser l'utilisation des ressources et minimiser les coûts opérationnels[1].

**Fiabilité et Reproductibilité**

Le flux de travail Docker du Dockerfile à l'image au conteneur garantit une reproductibilité complète[2]. Chaque étape est documentée dans le Dockerfile, créant des couches immuables qui peuvent être réutilisées et versionnées.

**Persistance et État**

Bien que les conteneurs soient éphémères par défaut, la compréhension des volumes permet de concevoir des architectures Docker fiables et évolutives, capables de répondre aux exigences des applications nécessitant la persistance des données[1].

### Points d'Approfondissement Recommandés

**Pour Progresser Plus Loin**

- **Réseaux Docker** : Comprendre comment les conteneurs communiquent entre eux et avec le monde extérieur
- **Docker Compose** : Gérer des applications multi-conteneurs de manière déclarative
- **Orchestration** : Découvrir Kubernetes, le standard de facto en 2025 pour l'orchestration de conteneurs à grande échelle[2]
- **Pipelines CI/CD** : Intégrer Docker dans les processus d'intégration continue et de livraison continue[2]
- **Bonnes Pratiques de Sécurité** : Configurer les conteneurs de manière sécurisée en production

**Évolution de la Compétence**

Les apprentissages progressent naturellement de la manipulation manuelle de conteneurs individuels à la gestion orchestrée de flottes entières. La maîtrise des fondamentaux présentés dans ce chapitre est le préalable indispensable à cette évolution.

### Architecture Générale de Docker

Docker s'intègre parfaitement avec les plateformes d'orchestration de conteneurs telles que Kubernetes, le standard de facto en 2025[2]. Ces orchestrateurs gèrent le cycle de vie des conteneurs à grande échelle : déploiement, mise à l'échelle automatique, équilibrage de charge, auto-réparation[2].

De plus, les pipelines CI/CD peuvent utiliser des conteneurs Docker pour chaque étape : le build de l'application, l'exécution des tests, la création de l'image Docker finale[2]. Cela garantit que chaque étape du pipeline s'exécute dans un environnement propre et reproductible, éliminant les incohérences et rendant les tests plus fiables[2].

---

## Exercices Pratiques de Consolidation

### Exercice 1 : Cycle de Vie Complet d'un Conteneur

Cet exercice guide la personne à travers un cycle de vie complet en utilisant les commandes fondamentales.

**Objectif** : Créer, gérer, arrêter et nettoyer un conteneur.

**Étapes** :

```bash
# 1. Lancer un conteneur nginx en arrière-plan
docker run -d --name web-server nginx

# 2. Vérifier que le conteneur est en cours d'exécution
docker ps

# 3. Mettre le conteneur en pause
docker pause web-server

# 4. Vérifier l'état
docker ps

# 5. Reprendre le conteneur
docker unpause web-server

# 6. Renommer le conteneur
docker rename web-server prod-web

# 7. Arrêter le conteneur
docker stop prod-web

# 8. Vérifier l'état arrêté
docker ps -a

# 9. Supprimer le conteneur
docker rm prod-web

# 10. Vérifier la suppression
docker ps -a
```

### Exercice 2 : Inspection et Copie de Fichiers

Cet exercice pratique l'inspection et la manipulation de fichiers.

**Objectif** : Inspecter un conteneur et transférer des fichiers.

```bash
# 1. Lancer un conteneur
docker run -d --name app nginx

# 2. Inspecter le conteneur
docker inspect app

# 3. Extraire l'adresse IP
docker inspect -f '{{.NetworkSettings.IPAddress}}' app

# 4. Créer un fichier sur l'hôte
echo "Configuration de production" > config.txt

# 5. Copier vers le conteneur
docker cp config.txt app:/etc/nginx/config.txt

# 6. Vérifier la copie
docker exec app cat /etc/nginx/config.txt

# 7. Copier un fichier du conteneur vers l'hôte
docker cp app:/etc/nginx/nginx.conf ./nginx.conf.bak

# 8. Vérifier sur l'hôte
cat nginx.conf.bak

# 9. Nettoyer
docker rm -f app
```

### Exercice 3 : Gestion des Ressources

Cet exercice démontre la gestion efficace de l'espace disque.

```bash
# 1. Afficher l'utilisation des ressources
docker system df

# 2. Lancer plusieurs conteneurs
docker run -d --name app1 ubuntu sleep 1000
docker run -d --name app2 alpine sleep 1000
docker run -d --name app3 nginx

# 3. Arrêter tous les conteneurs
docker stop $(docker ps -q)

# 4. Afficher les ressources à nouveau
docker system df

# 5. Nettoyer les conteneurs arrêtés
docker container prune -f

# 6. Vérifier l'espace récupéré
docker system df
```
