# Citations
- https://www.nicelydev.com/docker/reseau-host-bridge
- https://www.youtube.com/watch?v=-uj1Ofcx09g
- https://blog.alphorm.com/comprendre-le-reseau-sous-docker
- https://www.datacamp.com/fr/tutorial/docker-networking
- https://www.youtube.com/watch?v=69rQCB1sVz4
- https://blog.stephane-robert.info/docs/conteneurs/moteurs-conteneurs/docker/network/
- https://labex.io/fr/tutorials/docker-how-to-configure-networking-for-docker-containers-411517
- https://kb.synology.com/fr-fr/DSM/help/Docker/docker_network?version=6
- https://xavki.blog/ce-que-vous-devez-savoir-sur-docker-et-ses-reseaux/


# Tokens
- prompt_tokens: 279
- completion_tokens: 5248
- total_tokens: 5527
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.079, 'request_cost': 0.006, 'total_cost': 0.086}


# Content
# Les réseaux Docker : Guide complet et détaillé

## Introduction aux réseaux Docker

Les réseaux constituent un élément fondamental de Docker, permettant aux conteneurs de communiquer entre eux et avec le monde extérieur. Docker propose plusieurs pilotes réseau, chacun adapté à des besoins spécifiques. Avant d'explorer les différents modes de mise en réseau, il est essentiel de comprendre les concepts de base qui sous-tendent cette architecture[1][3].

Lors de l'installation de Docker, trois réseaux sont automatiquement créés[3]. Ces réseaux par défaut permettent aux conteneurs de fonctionner immédiatement, mais pour des architectures plus complexes, la création de réseaux personnalisés devient nécessaire. La gestion des réseaux Docker représente donc une compétence critique pour tout professionnel travaillant avec des conteneurs[1][3].

## Le réseau Bridge

### Fonctionnement fondamental

Le réseau Bridge est le mode réseau par défaut utilisé par Docker lorsqu'un conteneur est créé sans spécification de réseau particulier[3][6]. Ce mode crée une isolation réseau entre l'hôte et les conteneurs, tout en permettant une communication contrôlée entre ces derniers[1].

Lorsqu'un conteneur est lancé sans configuration réseau spécifique, il se connecte automatiquement au réseau bridge par défaut appelé **docker0**[3]. Ce réseau fonctionne comme un pont virtuel, d'où son nom. Le mécanisme de pont utilise une couche intermédiaire pour gérer la communication, ce qui offre une séparation nette entre le réseau de l'hôte et celui des conteneurs[1].

### Architecture et isolation

Le mode Bridge offre une isolation réseau importante entre l'hôte et les conteneurs[1]. Cette isolation signifie que les conteneurs ne partagent pas directement les ports de la machine hôte. Pour accéder à un service exécuté dans un conteneur depuis la machine locale, il est nécessaire de mapper explicitement les ports[1].

Le mapping de ports fonctionne selon le principe suivant : un port de la machine hôte est associé à un port du conteneur, créant ainsi un point d'accès public. Par exemple, le port 8080 de la machine hôte peut être mappé au port 3000 du conteneur, permettant l'accès au service via `http://localhost:8080`[1].

### Avantages du réseau Bridge

- **Sécurité renforcée** : L'isolation réseau crée une barrière de sécurité. Les conteneurs ne sont pas directement exposés sur le réseau de l'hôte, réduisant les risques de sécurité[1].
- **Contrôle explicite** : Chaque exposition de port doit être déclarée intentionnellement, donnant au gestionnaire du système un contrôle complet sur ce qui est accessible[1].
- **Compatibilité** : Le mode Bridge fonctionne sur toutes les plateformes, y compris Windows et macOS via Docker Desktop[5].
- **Communication inter-conteneurs** : Les conteneurs connectés au même réseau Bridge peuvent communiquer entre eux par leurs noms de conteneur grâce au DNS interne de Docker[2].

### Inconvénients et considérations

L'inconvénient principal du mode Bridge réside dans les performances. La couche intermédiaire de mise en réseau introduit une surcharge, réduisant les performances par rapport au mode Host[1][5]. Pour les applications exigeantes en bande passante ou en latence, cette surcharge peut devenir significative.

De plus, la gestion des ports mappés peut devenir complexe dans les architectures contenant de nombreux conteneurs[1].

## Créer ses réseaux Bridge personnalisés

### Commande de création basique

La création d'un réseau Bridge personnalisé s'effectue avec la commande `docker network create`[1][4]. Contrairement à l'utilisation du bridge par défaut, les réseaux personnalisés offrent une meilleure isolation et un meilleur contrôle[3].

```bash
docker network create --driver bridge nom-du-reseau
```

Cette commande crée un nouveau réseau isolé. L'option `--driver bridge` spécifie explicitement que le pilote Bridge doit être utilisé[4].

### Configuration avancée du réseau

Pour un contrôle plus granulaire, Docker permet de configurer le sous-réseau, la passerelle et la plage d'adresses IP[4].

```bash
docker network create \
  --driver bridge \
  --subnet 192.168.100.0/24 \
  --gateway 192.168.100.1 \
  --ip-range 192.168.100.0/25 \
  mon-reseau-personnalise
```

Les paramètres clés sont :
- `--subnet` : Définit la plage d'adresses IP totale du réseau
- `--gateway` : Spécifie la passerelle du réseau
- `--ip-range` : Restreint les adresses IP que les conteneurs peuvent utiliser, distinctes de la plage complète du sous-réseau[4]

### Inspection du réseau Bridge par défaut

La visualisation du réseau par défaut s'effectue avec la commande suivante[3] :

```bash
docker network ls
```

Cette commande affiche tous les réseaux disponibles :

| NETWORK ID | NAME | DRIVER | SCOPE |
|---|---|---|---|
| 32cd2d55155f | bridge | bridge | local |
| b7fe5d1b69a7 | host | host | local |
| de5ae709fdcd | none | none | local |

Pour obtenir des informations détaillées sur un réseau spécifique[3] :

```bash
docker network inspect bridge
```

Cette commande fournit la configuration complète du réseau, incluant les options comme `enable_icc` (inter-container communication), `enable_ip_masquerade` et d'autres paramètres[3].

## Configuration du serveur et déploiement multi-conteneur

### Architecture multi-conteneur avec Docker Compose

Pour des applications complexes impliquant plusieurs services, Docker Compose permet de définir et d'orchestrer plusieurs conteneurs utilisant un réseau Bridge[1]. Cette approche simplifie la gestion des architectures multi-conteneurs.

Un fichier `docker-compose.yml` typique pour une architecture Bridge ressemble à ceci[1] :

```yaml
version: '3.8'

services:
  ubuntu1:
    image: ubuntu:24.10
    container_name: ubuntu1
    command: tail -f /dev/null
    ports:
      - "9000:9000"
    networks:
      - ubuntu_bridge

  ubuntu2:
    image: ubuntu:24.10
    container_name: ubuntu2
    command: tail -f /dev/null
    networks:
      - ubuntu_bridge

  ubuntu3:
    image: ubuntu:24.10
    container_name: ubuntu3
    command: tail -f /dev/null
    networks:
      - ubuntu_bridge

networks:
  ubuntu_bridge:
    driver: bridge
```

La structure définie ci-dessus crée trois conteneurs Ubuntu interconnectés via un réseau Bridge nommé `ubuntu_bridge`. Le premier conteneur expose le port 9000 sur l'hôte[1].

### Déploiement et vérification

Le déploiement s'effectue avec la commande suivante[1] :

```bash
docker-compose up
```

Cette commande crée et démarre tous les conteneurs définis dans le fichier de composition. Les conteneurs sont automatiquement connectés au réseau `ubuntu_bridge` et peuvent communiquer entre eux par leurs noms de service[1].

Pour vérifier la communication inter-conteneurs, on peut accéder à un conteneur et tenter de faire un ping vers un autre[1] :

```bash
docker exec ubuntu1 ping ubuntu2
```

Grâce au DNS interne de Docker, le conteneur ubuntu1 résout le nom `ubuntu2` vers son adresse IP dans le réseau Bridge[2].

### Arrêt et redémarrage

Pour arrêter tous les services, on utilise[1] :

```bash
# Arrêt (Ctrl+C depuis le terminal ou)
docker-compose stop

# Redémarrage
docker-compose restart

# Arrêt et suppression des conteneurs
docker-compose down
```

## Connecter un serveur Node.js et une base de données MongoDB

### Architecture de l'application

L'un des cas d'usage les plus courants en production consiste à connecter une application Node.js à une base de données MongoDB. Cette architecture démontre comment les réseaux Bridge permettent une communication sécurisée et isolée entre les services[2].

### Configuration Docker Compose pour Node.js + MongoDB

Le fichier Docker Compose suivant orchestre cette architecture[2] :

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongodb_db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app_network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  nodejs_app:
    image: node:20
    container_name: nodejs_server
    working_dir: /app
    volumes:
      - ./app:/app
    environment:
      MONGODB_URI: mongodb://admin:password123@mongodb_db:27017/mydb?authSource=admin
    ports:
      - "3000:3000"
    depends_on:
      mongodb:
        condition: service_healthy
    networks:
      - app_network
    command: npm start

volumes:
  mongodb_data:

networks:
  app_network:
    driver: bridge
```

### Points clés de cette configuration

**Isolation par réseau** : Les deux services (MongoDB et Node.js) sont connectés au même réseau Bridge nommé `app_network`. Cette isolation garantit que seules les applications sur ce réseau peuvent accéder à MongoDB[1].

**Communication par nom de service** : Dans le fichier de configuration, l'application Node.js utilise `mongodb_db` (le nom du conteneur) comme hôte de base de données. Le DNS interne de Docker résout ce nom vers l'adresse IP correcte du conteneur MongoDB[2].

**Authentification et variables d'environnement** : Les variables d'environnement permettent de configurer les identifiants de base de données et l'URI de connexion de manière flexible[2].

**Dépendances de service** : L'option `depends_on` avec `condition: service_healthy` assure que Node.js ne démarre que lorsque MongoDB est complètement prêt à accepter les connexions[1].

**Persistance des données** : Le volume `mongodb_data` garantit que les données de la base de données persistent même si le conteneur est arrêté ou supprimé[1].

### Code Node.js pour la connexion

Un exemple simple de code Node.js se connectant à MongoDB via le réseau Docker[2] :

```javascript
const { MongoClient } = require('mongodb');

const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb_db:27017/mydb?authSource=admin';

const client = new MongoClient(mongoUri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('✅ Connexion à MongoDB réussie');
    
    const database = client.db('mydb');
    const usersCollection = database.collection('users');
    
    // Insertion d'un document
    const result = await usersCollection.insertOne({
      name: 'Jean Dupont',
      email: 'jean@example.com',
      created_at: new Date()
    });
    
    console.log(`Document inséré avec l'ID: ${result.insertedId}`);
    
    // Récupération des documents
    const users = await usersCollection.find({}).toArray();
    console.log('Utilisateurs:', users);
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  } finally {
    await client.close();
  }
}

connectToDatabase();
```

### Déploiement de l'architecture complète

Une fois le fichier Docker Compose configuré, le déploiement s'effectue simplement[1] :

```bash
docker-compose up -d
```

L'option `-d` lance les conteneurs en arrière-plan. Pour vérifier que les services communiquent correctement[1] :

```bash
docker logs nodejs_server
```

Ce diagnostic affiche les journaux du conteneur Node.js, permettant de vérifier que la connexion à MongoDB s'est établie avec succès[1].

## Le réseau Host

### Fonctionnement fondamental

Le mode Host représente une approche radicalement différente de la mise en réseau Docker[1][5]. Contrairement au mode Bridge, le mode Host permet aux conteneurs de partager directement le réseau de la machine hôte[1]. Cela signifie que le conteneur n'a pas sa propre interface réseau virtuelle mais utilise directement l'interface réseau de l'hôte[5].

Dans cette configuration, les conteneurs utilisent la même adresse IP et les mêmes ports que l'hôte, sans passer par une couche intermédiaire[1]. Cette approche élimine complètement l'abstraction réseau, créant une connexion directe au réseau de la machine hôte[1].

### Implications pratiques du mode Host

**Pas de mapping de ports requis** : En mode Host, le mapping de ports n'est pas nécessaire puisque les conteneurs partagent déjà les ports de l'hôte[1]. Un service s'exécutant sur le port 8080 dans un conteneur Host est directement accessible sur le port 8080 de la machine hôte[1][5].

**Partage complet du réseau** : Les conteneurs accèdent directement à toutes les interfaces réseau et aux routes de l'hôte[1]. Cette approche élimine les limitations imposées par le mode Bridge[5].

**Absence d'isolation réseau** : L'isolation réseau disparaît complètement. Les conteneurs et l'hôte partagent le même espace réseau[1][5]. Cela signifie qu'un conteneur a accès aux mêmes services réseau que l'hôte[5].

### Avantages et inconvénients du mode Host

**Avantages** :

- **Performance supérieure** : Aucune couche intermédiaire n'intervient, éliminant la surcharge réseau[1][5]. Cette amélioration de performance est particulièrement importante pour les applications exigeantes en bande passante ou en latence faible[1].
- **Simplification de la configuration** : Pas besoin de mapper les ports ou de gérer les expositions de service[1].
- **Accès aux services réseau locaux** : Les conteneurs peuvent accéder directement à tous les services réseau de la machine hôte[1].

**Inconvénients** :

- **Risques de sécurité** : L'absence d'isolation crée des risques significatifs[1][5]. Les conteneurs peuvent potentiellement interferer les uns avec les autres et avec les services de l'hôte[1].
- **Conflits de ports** : Si plusieurs conteneurs ou l'hôte tentent d'utiliser le même port, des conflits irrévocables surviennent[1][5]. Ce problème rend impossible l'exécution de plusieurs conteneurs utilisant les mêmes ports sur le même hôte[1].
- **Portabilité réduite** : Les conteneurs Host ne sont pas portables entre les hôtes avec des configurations réseau différentes[1].
- **Limitation de compatibilité** : Le mode Host n'est pas disponible sur Windows et macOS[5]. Il fonctionne uniquement sur Linux natif[5].

### Configuration du mode Host

Pour lancer un conteneur en mode Host, on utilise l'option `--network host`[5] :

```bash
docker run --network host nginx
```

Cette commande démarre un conteneur Nginx en mode Host. Le service Nginx est directement accessible sur le port 80 de la machine hôte[1][5].

### Docker Compose avec mode Host

Pour utiliser le mode Host dans Docker Compose, on spécifie `network_mode: host` dans la configuration du service[1] :

```yaml
version: '3.8'

services:
  ubuntu1:
    image: ubuntu:24.10
    container_name: ubuntu1
    command: tail -f /dev/null
    network_mode: host

  ubuntu2:
    image: ubuntu:24.10
    container_name: ubuntu2
    command: tail -f /dev/null
    network_mode: host

  ubuntu3:
    image: ubuntu:24.10
    container_name: ubuntu3
    command: tail -f /dev/null
    network_mode: host
```

Dans cette configuration, tous les conteneurs partagent l'interface réseau de l'hôte[1]. Aucun mapping de port n'est défini, car les ports sont directement partagés[1].

### Démonstration pratique du mode Host

Pour vérifier que les conteneurs partagent bien le réseau de l'hôte, on peut exécuter une commande d'affichage de l'adresse IP[1][5] :

```bash
docker run --network host ubuntu hostname -I
```

Cette commande affichera l'adresse IP de la machine hôte, non une adresse IP de conteneur. Cette démonstration prouve que le conteneur utilise directement le réseau de l'hôte[1][5].

## Comparaison détaillée : Bridge vs Host

### Tableau récapitulatif

| Caractéristique | Bridge | Host |
|---|---|---|
| **Isolation réseau** | Oui, isolation complète | Non, partage du réseau |
| **Mapping de ports** | Obligatoire | Non nécessaire |
| **Performance** | Bonne (avec surcharge) | Excellente (pas de surcharge) |
| **Sécurité** | Renforcée | Réduite |
| **Conflits de ports** | Peu probables | Très probables |
| **Portabilité** | Excellente | Limitée |
| **Compatibilité** | Toutes les plateformes | Linux uniquement |
| **Communication inter-conteneurs** | Via DNS Docker | Direct via localhost |
| **Accès aux services hôte** | Limité | Complet |
| **Configuration** | Modérée | Simple |

### Scénarios d'utilisation

**Utiliser Bridge** :

- Applications en production nécessitant la sécurité
- Architectures multi-conteneurs complexes
- Déploiement sur Windows ou macOS
- Séparation claire entre services
- Applications web classiques avec plusieurs tiers

**Utiliser Host** :

- Applications requérant une performance maximale
- Services s'exécutant sur Linux natif
- Clusters Kubernetes (utilise surtout le mode bridge)
- Applications legacy nécessitant un accès réseau complet
- Conteneurs uniques sans risque de conflit

## Concepts avancés de mise en réseau Docker

### Résolution de noms DNS internes

Le DNS interne de Docker permet une résolution de noms transparente[2]. Lorsqu'un conteneur tente d'accéder à un autre conteneur par son nom, le serveur DNS de Docker (adresse 127.0.0.11)[3] résout ce nom vers l'adresse IP correcte du conteneur.

Cette résolution s'effectue automatiquement lorsque les conteneurs sont connectés au même réseau Bridge[2]. Dans le fichier `/etc/resolv.conf` du conteneur, on retrouve[3] :

```
nameserver 127.0.0.11
options ndots:0
```

### Inspection du réseau

Pour obtenir des informations détaillées sur la configuration d'un réseau[3] :

```bash
docker network inspect bridge
```

Cette commande fournit un JSON détaillé contenant :
- Les conteneurs connectés et leurs adresses IP
- Les options réseau (enable_icc, enable_ip_masquerade, etc.)
- La configuration de la passerelle
- La plage d'adresses IP

## Progression pédagogique recommandée

L'apprentissage des réseaux Docker doit suivre une progression logique :

**Étape 1 : Compréhension du bridge par défaut** : Commencer par exécuter des conteneurs simples sans configuration réseau explicite. Observer comment Docker assigne automatiquement les adresses IP et permet la communication entre conteneurs via le bridge par défaut[3].

**Étape 2 : Introduction au mapping de ports** : Créer des conteneurs exécutant des services (Nginx, Apache) et mapper les ports pour comprendre comment les services deviennent accessibles depuis l'hôte[1].

**Étape 3 : Création de réseaux personnalisés** : Créer des réseaux Bridge nommés et connecter plusieurs conteneurs, en comprenant les avantages de l'isolation par rapport au bridge par défaut[1][4].

**Étape 4 : Exploration du DNS interne** : Utiliser la résolution de noms par conteneur pour établir la communication entre services sans adresses IP statiques[2].

**Étape 5 : Introduction à Docker Compose** : Basculer vers des fichiers de composition pour gérer des architectures multi-conteneurs[1].

**Étape 6 : Cas réel multi-services** : Implémenter l'architecture Node.js + MongoDB, renforçant la compréhension de la communication sécurisée entre services[2].

**Étape 7 : Exploration du mode Host** : Une fois le mode Bridge maîtrisé, explorer le mode Host pour comprendre les compromis entre sécurité et performance[1][5].

**Étape 8 : Diagnostique et résolution de problèmes** : Apprendre à utiliser `docker network inspect`, `docker logs` et `docker exec` pour déboguer les problèmes de connectivité[3].

## Diagnostique et résolution de problèmes

### Vérification de la connectivité

Lorsqu'une communication entre conteneurs échoue, on peut vérifier la connectivité[1] :

```bash
docker exec nomduconteneur ping nomduconteneurDistant
```

Si le ping échoue, vérifier que les deux conteneurs sont connectés au même réseau[1].

### Inspection détaillée des réseaux

Pour analyser les configurations réseau[3] :

```bash
docker network inspect nom_du_reseau | grep -A 20 Containers
```

### Vérification des ports mappés

Pour s'assurer que les ports sont correctement mappés[1] :

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

Cette commande affiche une liste des conteneurs et de leurs mappages de ports[1].

Cette formation complète offre une base solide pour comprendre et maîtriser la mise en réseau Docker, essentielle pour construire des applications conteneurisées robustes et sécurisées[1][2][3][4][5].
