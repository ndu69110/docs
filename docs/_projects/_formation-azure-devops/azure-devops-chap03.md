# Citations
- https://www.digitalocean.com/community/tutorials/understanding-the-nginx-configuration-file-structure-and-configuration-contexts
- https://dev.to/kabilan/understanding-nginx-core-contexts-52o8
- https://www.solo.io/topics/nginx/nginx-configuration
- https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/
- https://nginx.org/en/docs/beginners_guide.html
- https://www.youtube.com/watch?v=C5kMgshNc6g
- https://contabo.com/blog/nginx-configuration-beginners-guide/


# Tokens
- prompt_tokens: 256
- completion_tokens: 4820
- total_tokens: 5076
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.072, 'request_cost': 0.006, 'total_cost': 0.079}


# Content
NGINX est un serveur web et reverse proxy hautes performances, très utilisé comme point d’entrée dans des architectures modernes, y compris dans des pipelines Azure DevOps pour publier et tester des applications. Ce chapitre présente les bases nécessaires pour installer, démarrer, configurer et comprendre l’architecture de NGINX, avec un fil conducteur qui correspond à un chemin d’apprentissage progressif.

> Remarque : Il n’est pas possible ici d’intégrer des images récupérées en direct depuis des sites externes, mais des schémas textuels et des exemples concrets sont fournis, ainsi que des indications précises sur la forme que peuvent prendre les diagrammes à reproduire.

---

## Vue d’ensemble et chemin d’apprentissage

Le chemin d’apprentissage proposé suit un ordre logique, en partant de la manipulation du service NGINX, puis de la compréhension des fichiers de configuration, de l’architecture interne, et enfin de la configuration de base d’un serveur HTTP. L’objectif est d’être capable, à la fin de ce chapitre, de déployer une application derrière NGINX dans un pipeline d’intégration ou de déploiement continu.

Chemin d’apprentissage recommandé pour ce chapitre :

1. **Démarrage, arrêt et rechargement**  
   - Savoir installer NGINX sur Linux (par exemple Ubuntu) ou Windows (via WSL, Docker, etc.).  
   - Savoir démarrer, arrêter, recharger la configuration et tester la validité des fichiers.  
   - Comprendre la différence entre redémarrage complet et rechargement « gracieux ».

2. **Directives et contextes**  
   - Comprendre la structure des fichiers `nginx.conf` et fichiers inclus.  
   - Distinguer directives simples et directives de bloc.  
   - Maîtriser les contextes principaux (`main`, `events`, `http`, `server`, `location`).

3. **Architecture de NGINX**  
   - Comprendre le modèle maître / travailleurs (master / worker processes).  
   - Comprendre le modèle événementiel et non bloquant de gestion des connexions.  
   - Savoir quels paramètres d’architecture peuvent être ajustés pour la performance.

4. **Configuration de base**  
   - Savoir écrire un `server` simple servant des fichiers statiques.  
   - Configurer un reverse proxy (backend applicatif HTTP).  
   - Introduire des notions utiles plus tard pour Azure DevOps : environnements, variables, fichiers de conf par environnement.

Chaque section suivante donnera :

- des explications détaillées,
- des exemples de configuration (`nginx.conf` ou extraits),
- des mini-tableaux de référence,
- des idées de schémas à dessiner.

---

## Démarrage, arrêt et rechargement

### Installation et fichiers principaux

Dans un contexte DevOps, NGINX est souvent installé sur des agents Linux (VM, conteneurs Docker), ce qui permet de simuler ou de reproduire l’environnement de production dans les pipelines.

Sur une distribution comme Ubuntu, après installation, les éléments importants sont typiquement :

- Fichier principal de configuration : `/etc/nginx/nginx.conf`  
- Dossier de configuration supplémentaire : `/etc/nginx/conf.d/`  
- Journaux d’accès et d’erreurs : `/var/log/nginx/access.log`, `/var/log/nginx/error.log`  

Le service NGINX est souvent géré par `systemd` :  

```bash
# Démarrer NGINX
sudo systemctl start nginx

# Arrêter NGINX
sudo systemctl stop nginx

# Redémarrer complètement NGINX
sudo systemctl restart nginx

# Recharger la configuration sans couper brutalement les connexions
sudo systemctl reload nginx

# Vérifier l’état du service
sudo systemctl status nginx
```

En parallèle, NGINX fournit sa propre commande binaire, utile dans les scripts CI/CD :

```bash
# Lancer NGINX (si non lancé en tant que service)
sudo nginx

# Arrêter « proprement »
sudo nginx -s quit

# Arrêt immédiat (brutal)
sudo nginx -s stop

# Recharger la configuration
sudo nginx -s reload

# Tester la validité de la configuration, sans recharger
sudo nginx -t
```

Dans un pipeline Azure DevOps (par exemple dans une tâche Bash), ces commandes seront utilisées pour :

- valider la configuration (`nginx -t`),  
- lancer NGINX dans un job de tests,  
- recharger la configuration après déploiement d’une nouvelle version des fichiers de conf.

### Schéma textuel – cycle de vie de NGINX

Un schéma simple à reproduire pourrait ressembler à :

```text
+-------------------------------+
|         Fichiers .conf        |
+-------------------------------+
               |
               v
+-------------------------------+
| nginx -t  (test config)      |
+-------------------------------+
               |
               v
+-------------------------------+
| nginx -s reload  (gracieux)  |
+-------------------------------+
               |
               v
+-------------------------------+
| Workers prennent les nouvelles|
| directives sans couper les    |
| connexions en cours           |
+-------------------------------+
```

### Intégration dans les scripts (CI/CD)

Dans un pipeline YAML Azure DevOps, une étape type pour valider la configuration pourrait être :

```yaml
- script: |
    sudo nginx -t
  displayName: 'Validation configuration NGINX'
```

Et après déploiement de nouveaux fichiers de configuration :

```yaml
- script: |
    sudo nginx -s reload
  displayName: 'Rechargement configuration NGINX'
```

Idée pédagogique : d’abord manipuler ces commandes manuellement sur une VM ou un conteneur en local, ensuite les intégrer dans un pipeline automatisé.

---

## Directives et contextes

NGINX est configuré à l’aide de **directives** rangées dans des **contextes**. Comprendre ce modèle est fondamental pour lire et écrire des configurations propres et maintenables.

### Directives : simples et blocs

- **Directive simple**  
  - Forme : `clé valeur;`  
  - Exemples :  
    ```nginx
    worker_processes 4;
    client_max_body_size 10m;
    ```

- **Directive de bloc**  
  - Forme : `clé paramètres { ... }`  
  - Contient d’autres directives à l’intérieur, et définit un **contexte**.  
  - Exemples :  
    ```nginx
    http {
        # directives liées au HTTP ici
    }

    server {
        # directives du serveur virtuel
    }
    ```

Les directives de bloc définissent donc à la fois un *contexte* logique et un regroupement de configuration.

### Contextes principaux

Les contextes les plus courants :

- `main` (ou global)  
- `events`  
- `http`  
- `server`  
- `location`  

Tableau récapitulatif :

| Contexte  | Rôle principal                                      | Exemple de directives typiques               |
|----------|------------------------------------------------------|---------------------------------------------|
| main     | Configuration globale du processus NGINX            | `user`, `worker_processes`, `pid`           |
| events   | Gestion des connexions, niveau global               | `worker_connections`, `use`                 |
| http     | Configuration spécifique au trafic HTTP/HTTPS       | `include`, `log_format`, `sendfile`         |
| server   | Serveur virtuel (vhost)                             | `listen`, `server_name`, `root`             |
| location | Correspondance d’URI à des règles spécifiques       | `proxy_pass`, `try_files`, `alias`          |

Exemple d’un fichier minimal illustrant ces contextes :

```nginx
# Contexte main (global)
user  nginx;
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile on;

    server {
        listen       80;
        server_name  exemple.local;

        root /var/www/html;

        location / {
            index index.html;
        }

        location /api/ {
            proxy_pass http://backend_api;
        }
    }
}
```

### Héritage et portée

Les directives se comportent souvent avec un **héritage** :

- Une directive placée plus haut (par exemple dans `http`) s’applique par défaut dans les `server` et `location` enfants, sauf si elle est redéfinie.  
- Certaines directives ne sont autorisées que dans certains contextes (par exemple `listen` dans `server`, pas dans `location`).  

Exemple :

```nginx
http {
    client_max_body_size 2m;  # valeur par défaut pour tous les servers

    server {
        # ici, 2m s’applique

        location /upload/ {
            client_max_body_size 10m; # cette location permet plus
        }
    }
}
```

### Schéma textuel – arborescence des contextes

```text
main
├─ events
└─ http
   ├─ server (site A)
   │  ├─ location /
   │  └─ location /api/
   └─ server (site B)
      ├─ location /
      └─ location /static/
```

Chemin d’apprentissage conseillé à ce stade :

1. Lire le fichier `nginx.conf` par défaut et repérer les contextes.  
2. Ajouter une directive dans `http` (ex. `client_max_body_size`) et vérifier son effet.  
3. S’exercer à surcharger cette directive dans un bloc `server` ou `location`.  

---

## Architecture de NGINX

NGINX adopte une architecture orientée performances, avec un processus maître et des processus travailleurs (workers) gérant de nombreuses connexions de manière asynchrone.

### Processus maître et travailleurs

- **Master process**  
  - Lit la configuration.  
  - Ouvre les sockets d’écoute (ports).  
  - Lance les workers.  
  - Gère les rechargements de configuration et les arrêts.

- **Worker processes**  
  - Acceptent et gèrent les connexions des clients.  
  - Traitent les requêtes HTTP, servent les fichiers statiques, effectuent du proxying, etc.  
  - Fonctionnent en modèle évènementiel (un worker peut gérer de nombreuses connexions simultanément).

Fragment de configuration typique dans le contexte `main` :

```nginx
user nginx;
worker_processes auto;  # ou un nombre fixe (ex. 4)

events {
    worker_connections 1024;
}
```

Explications :

- `worker_processes auto;` : laisse NGINX choisir un nombre de workers adapté au nombre de CPU.  
- `worker_connections 1024;` : nombre maximum de connexions simultanées par worker.

### Modèle événementiel

NGINX repose sur un modèle non bloquant où chaque worker utilise un mécanisme comme `epoll` (Linux) ou `kqueue` (BSD) pour gérer de nombreuses connexions simultanées.

Schéma textuel simple :

```text
           +--------------------+
           |   Master process   |
           +--------------------+
             /       |       \
            /        |        \
+----------------+ +----------------+ +----------------+
| Worker #1      | | Worker #2      | | Worker #3      |
+----------------+ +----------------+ +----------------+
   |       |          |       |          |       |
   v       v          v       v          v       v
 Conn. 1  Conn. 2   Conn. 3  Conn. 4   Conn. 5  Conn. 6
```

Pour l’optimisation :

- augmenter `worker_connections` si beaucoup de trafic,  
- ajuster `worker_processes` selon le nombre de cœurs,  
- surveiller l’utilisation mémoire et CPU.

### Lien avec Azure DevOps

Dans un environnement DevOps :

- les paramètres `worker_processes` et `worker_connections` peuvent être externalisés (variables de pipeline, fichiers modèles) pour être différents selon les environnements (dev, staging, prod) ;  
- les tests de montée en charge (load testing) validés dans des pipelines peuvent conduire à ajuster ces paramètres automatiquement.

Exemple de paramétrage par variable d’environnement (utilisable dans un conteneur) :

```nginx
worker_processes ${NGINX_WORKER_PROCESSES:-auto};

events {
    worker_connections ${NGINX_WORKER_CONNECTIONS:-1024};
}
```

Ensuite, dans Azure DevOps, ces variables peuvent être injectées dans le conteneur NGINX via les définitions de jobs.

---

## Configuration de base de NGINX

Cette section fournit une configuration de base, puis l’étend progressivement jusqu’au reverse proxy, ce qui est  directement exploitable dans un pipeline DevOps.

### Structure générale du fichier `nginx.conf`

Structure classique :

```nginx
# Contexte main
user  nginx;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent"';

    access_log  /var/log/nginx/access.log  main;
    error_log   /var/log/nginx/error.log warn;

    sendfile        on;
    keepalive_timeout  65;

    include /etc/nginx/conf.d/*.conf;  # inclusion de serveurs supplémentaires
}
```

Les blocs `server` sont souvent placés dans des fichiers séparés, par exemple `/etc/nginx/conf.d/app.conf`.

### Exemple 1 : serveur statique simple

Fichier `/etc/nginx/conf.d/site-statique.conf` :

```nginx
server {
    listen       80;
    server_name  exemple.local;

    root /var/www/exemple;       # dossier racine
    index index.html index.htm;  # fichiers d’index

    # Emplacement racine
    location / {
        try_files $uri $uri/ =404;
    }

    # Fichiers statiques (optionnel, pour cache)
    location ~* \.(css|js|png|jpg|jpeg|gif|ico)$ {
        expires 7d;
        access_log off;
    }
}
```

Explications clés :

- `listen 80;` : écoute sur le port HTTP standard.  
- `server_name exemple.local;` : nom d’hôte attendu dans les requêtes.  
- `root` : répertoire où se trouvent les fichiers.  
- `location /` : règle par défaut pour la racine.  
- `try_files` : vérifie si le chemin demandé existe, sinon retourne 404.

Chemin d’apprentissage :

1. Créer un dossier avec un `index.html`.  
2. Configurer un `server` comme ci-dessus.  
3. Tester avec `curl http://exemple.local` ou un navigateur (en adaptant le DNS ou `/etc/hosts`).  

### Exemple 2 : reverse proxy vers une API

Cas courant dans une architecture CI/CD : une API (Node.js, .NET, etc.) écoute en interne sur `http://localhost:5000`, et NGINX la publie.

```nginx
upstream backend_api {
    server 127.0.0.1:5000;
    # éventuellement plusieurs serveurs pour load balancing
    # server 10.0.0.2:5000;
    # server 10.0.0.3:5000;
}

server {
    listen       80;
    server_name  api.exemple.local;

    # Redirection HTTP -> HTTPS (si un autre bloc 443 existe)
    # return 301 https://$host$request_uri;

    location / {
        proxy_pass         http://backend_api;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        proxy_read_timeout  60s;
    }
}
```

Éléments importants pour un usage DevOps :

- Le bloc `upstream` permet de faire du load balancing entre plusieurs instances derrière NGINX.  
- Des variables (environnement, templating) peuvent générer dynamiquement les serveurs dans `upstream`.  
- Dans un pipeline, la configuration peut être générée puis validée avec `nginx -t` avant d’être déployée.

### Exemple 3 : combinaison statique + API

Un modèle fréquent : servir le front statique (SPA, React, Angular, Vue) et proxifier les appels API :

```nginx
server {
    listen       80;
    server_name  app.exemple.local;

    root /var/www/app; 
    index index.html;

    # Front (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API en backend
    location /api/ {
        proxy_pass http://backend_api;
        proxy_set_header Host $host;
    }
}
```

Ce genre de configuration est courant dans les applications déployées automatiquement via des pipelines, où :

- la phase de build front génère les fichiers sous `/var/www/app`,  
- la phase de déploiement copie les fichiers et reconfigure NGINX si besoin,  
- un job de test applique des tests d’intégration sur l’URL front et l’API.

### Idées de schémas pour la configuration

Un schéma simplifié de flux de requêtes pourrait être représenté ainsi :

```text
Client HTTP
   |
   v
+----------+            +----------------+
|  NGINX   |  ------->  |  Backend API   |
|  server  |  /api/*    | (localhost:5000|
+----------+            +----------------+
   |
   +--> / (fichiers statiques)
        /var/www/app
```

---

## Résumé du chemin d’apprentissage détaillé

Pour faire l’équivalent d’un module complet de formation (≈ 10 pages A4) sur ces bases, une progression détaillée peut ressembler à ceci :

1. **Prise en main opérationnelle**  
   - Installation de NGINX sur une VM Linux (ou conteneur).  
   - Expérimentation pratique avec `systemctl` et `nginx -s` pour démarrer, arrêter, recharger.  
   - Mise en place de scripts Bash (ou PowerShell dans WSL) pour automatiser les opérations.

2. **Lecture et compréhension des fichiers de configuration**  
   - Exploration de `nginx.conf` et des fichiers dans `conf.d/`.  
   - Identification des contextes (`main`, `events`, `http`, `server`, `location`).  
   - Ajout de directives simples (`log_format`, `client_max_body_size`, etc.) et observation des effets.

3. **Approfondissement des directives et contextes**  
   - Exercices d’héritage : définir des valeurs globales dans `http` et les surcharger dans certains `server`.  
   - Mise en place de multiples `server` (vhosts) avec différents `server_name`.  
   - Création de différents `location` pour gérer `/`, `/static/`, `/api/`, `/admin/`, etc.

4. **Compréhension de l’architecture interne**  
   - Expérimentation de `worker_processes` et `worker_connections` avec outils de charge (ab, wrk, k6, etc.).  
   - Observation de l’impact sur l’utilisation CPU/mémoire.  
   - Discussion sur l’intégration avec des orchestrateurs (Docker, Kubernetes) où NGINX est souvent utilisé comme ingress ou sidecar.

5. **Construction d’une configuration de base robuste**  
   - Mise en place d’un site statique complet servi par NGINX (avec cache des assets).  
   - Ajout d’un backend applicatif (simple API) en reverse proxy.  
   - Mise en place de logs personnalisés pour faciliter le debugging dans les pipelines.

6. **Intégration progressive dans Azure DevOps**  
   - Ajout d’étapes dans les pipelines :  
     - build de l’application,  
     - génération de la configuration NGINX (via templates),  
     - validation (`nginx -t`),  
     - déploiement et rechargement (`nginx -s reload`),  
     - tests de fumée (smoke tests) sur l’URL publiée.  
   - Utilisation de variables et secrets pour paramétrer dynamiquement les backends (`upstream`, ports, etc.).  

En suivant cette séquence, NGINX devient progressivement un composant maîtrisé de l’outillage DevOps, et non plus une simple « boîte noire » devant l’application.
