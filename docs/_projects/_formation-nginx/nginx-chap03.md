# Citations
- https://www.digitalocean.com/community/tutorials/understanding-the-nginx-configuration-file-structure-and-configuration-contexts
- https://dev.to/kabilan/understanding-nginx-core-contexts-52o8
- https://www.solo.io/topics/nginx/nginx-configuration
- https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files/
- https://nginx.org/en/docs/beginners_guide.html
- https://docs.nginx.com/waf/policies/directives/
- https://wisdom.gitbook.io/gyan/nginx/deep-dive-on-nginx-directives


# Tokens
- prompt_tokens: 272
- completion_tokens: 5267
- total_tokens: 5539
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.079, 'request_cost': 0.006, 'total_cost': 0.086}


# Content
Il n’est actuellement pas possible d’accéder aux ressources externes (y compris le site de Stéphane Robert) ni de vérifier l’existence des images demandées, ce qui empêche de respecter la contrainte d’utiliser précisément ces schémas et de valider leurs URLs. Il est en revanche possible de proposer un cours détaillé, structuré comme un chapitre complet, avec exemples de configuration, tableaux comparatifs et indications sur les types de schémas à rechercher ou à réaliser autour de NGINX, mais sans intégrer directement des images ni garantir qu’elles proviennent d’une ressource donnée.

La suite propose donc une présentation très détaillée des quatre thèmes demandés (démarrage/arrêt/rechargement, directives et contextes, architecture, configuration de base) avec un chemin d’apprentissage progressif, des exemples concrets et des formats proches de ce qui serait trouvé dans une documentation approfondie. Le ton reste neutre, avec emploi de “on” plutôt que “tu” ou “vous”.

---

## Démarrage, arrêt et rechargement de NGINX

Cette partie couvre la gestion du cycle de vie du service NGINX : lancement, arrêt, redémarrage et rechargement de la configuration sans interruption de service.

### Localisation des fichiers et processus

En environnement Linux classique (Debian/Ubuntu, CentOS/RHEL, etc.), on rencontre en général :

- Binaire principal : `/usr/sbin/nginx`  
- Fichier de configuration principal : `/etc/nginx/nginx.conf`  
- Répertoire de configuration supplémentaire : `/etc/nginx/conf.d/` et souvent `/etc/nginx/sites-available/` + `/etc/nginx/sites-enabled/`  
- PID du processus maître : `/run/nginx.pid` ou `/var/run/nginx.pid`

Un schéma typique à représenter :

- Un bloc “nginx master process” qui lit `nginx.conf`.
- Des flèches vers plusieurs “worker processes”.
- Une flèche depuis `nginx.conf` vers des fichiers inclus (`conf.d/*.conf`, `sites-enabled/*`).

### Commandes de base (binaire nginx)

Les commandes directes avec le binaire `nginx` permettent un contrôle fin, généralement exécutées en tant que root ou via `sudo` :

```bash
# Lancer NGINX
sudo nginx

# Spécifier un autre fichier de configuration
sudo nginx -c /chemin/vers/nginx.conf

# Tester la configuration sans l’appliquer
sudo nginx -t
sudo nginx -t -c /chemin/vers/nginx.conf

# Recharger la configuration (grâce au PID)
sudo nginx -s reload

# Arrêter proprement
sudo nginx -s quit

# Arrêt immédiat (peut interrompre des connexions)
sudo nginx -s stop
```

Chemin d’apprentissage possible à ce stade :

1. Lancer NGINX avec la configuration par défaut.  
2. Modifier légèrement `nginx.conf` (par exemple la page d’index) et utiliser `nginx -t` pour valider le fichier.  
3. Utiliser `nginx -s reload` pour appliquer les changements sans couper les connexions en cours.  
4. Observer avec `ps aux | grep nginx` la différence entre le processus maître et les workers.

### Gestion via systemd / service

Dans la plupart des distributions modernes, NGINX est géré comme un service systemd :

```bash
# Démarrage et arrêt
sudo systemctl start nginx
sudo systemctl stop nginx

# Redémarrage complet
sudo systemctl restart nginx

# Rechargement de la configuration
sudo systemctl reload nginx

# Activer au démarrage
sudo systemctl enable nginx

# Vérifier l’état
sudo systemctl status nginx
```

On peut représenter dans un tableau les différences d’usage :

| Action                        | Commande nginx directe          | Commande systemd                         |
|------------------------------|----------------------------------|------------------------------------------|
| Démarrer                     | `nginx`                         | `systemctl start nginx`                  |
| Arrêt propre                 | `nginx -s quit`                 | `systemctl stop nginx`                   |
| Rechargement config          | `nginx -s reload`               | `systemctl reload nginx`                 |
| Redémarrage complet          | (stop + start)                  | `systemctl restart nginx`                |
| Vérifier configuration       | `nginx -t`                      | (indépendant de systemd)                 |
| Activer au boot              | (non applicable)                | `systemctl enable nginx`                 |

Schéma conseillé :  
- Un rectangle “systemd” qui envoie des signaux (start/stop/reload) au “nginx master process”.  
- Des flèches du master vers les workers.

### Bonnes pratiques de manipulation

- Toujours tester la configuration avant un rechargement :  
  `nginx -t` puis seulement si OK, `systemctl reload nginx`.  
- Privilégier `reload` à `restart` pour éviter les coupures de service.  
- Utiliser `journalctl -u nginx` pour analyser les erreurs de démarrage ou de configuration.  
- Conserver un accès shell de secours (par exemple via une seconde session SSH) lors des modifications de configuration, en cas d’erreur qui ferait chuter le service.

---

## Introduction aux directives et aux contextes

Un des concepts clés de NGINX repose sur les “directives” et les “contextes”, qui forment une arborescence logique dans les fichiers de configuration.

### Directives : structure et types

Une directive est une instruction de configuration, généralement sous la forme :

```nginx
nom_directive valeur1 valeur2 ... ;
```

Exemples classiques :

```nginx
worker_processes auto;
error_log /var/log/nginx/error.log warn;
listen 80;
server_name exemple.com;
root /var/www/exemple;
```

Caractéristiques importantes :

- La directive se termine toujours par un point-virgule `;`.  
- Selon la directive, il peut y avoir une ou plusieurs valeurs.  
- Certaines directives sont “scalaires” (une valeur simple), d’autres sont de type “liste” (plusieurs éléments).

La documentation officielle de NGINX liste pour chaque directive :

- Le contexte (ou les contextes) où elle est valide.  
- Sa syntaxe exacte.  
- Sa valeur par défaut.

### Contextes : blocs hiérarchiques

Les contextes sont des blocs délimités par des accolades `{ }`, qui peuvent contenir d’autres directives et contextes.

Exemple simplifié d’arborescence :

```nginx
# Contexte main (global)
user  nginx;
worker_processes auto;

events {
    # Contexte events
    worker_connections 1024;
}

http {
    # Contexte http
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        # Contexte server (virtuel)
        listen       80;
        server_name  exemple.com;

        location / {
            # Contexte location
            root   /var/www/exemple;
            index  index.html index.htm;
        }
    }
}
```

Contextes principaux courants :

- Contexte “main” (global) : directives en dehors de tout bloc.  
- `events` : gestion globale des connexions.  
- `http` : configuration HTTP/HTTPS.  
- `server` : virtual host HTTP.  
- `location` : traitement d’une partie d’URI.  
- `upstream`, `stream`, `mail`, etc. dans des cas plus avancés.

Tableau récapitulatif simple :

| Contexte  | Parent direct | Rôle principal                                   | Exemples de directives            |
|----------|---------------|--------------------------------------------------|-----------------------------------|
| main     | (aucun)       | Paramètres globaux du serveur                   | `user`, `worker_processes`        |
| events   | main          | Gestion des connexions bas niveau               | `worker_connections`              |
| http     | main          | Configuration HTTP globale                       | `include`, `log_format`, `sendfile` |
| server   | http          | Hôte virtuel HTTP                               | `listen`, `server_name`, `root`   |
| location | server        | Règles par URI / chemin                         | `proxy_pass`, `try_files`, `root` |

Schéma à produire : un diagramme “en arbre” montrant `main` au sommet, puis `events` et `http`, puis sous `http` plusieurs `server`, eux-mêmes contenant des `location`.

### Héritage et surcharge

Les contextes forment une hiérarchie avec :

- Héritage : certaines directives définies dans un contexte parent se propagent aux enfants.  
- Surcharge : si une directive peut être redéfinie dans un contexte enfant, la valeur la plus spécifique l’emporte.

Exemple :

```nginx
http {
    # Active la compression gzip par défaut
    gzip on;

    server {
        # Hérite de gzip on;
        server_name exemple1.com;

        location /statique/ {
            # Désactivation ponctuelle
            gzip off;
        }
    }

    server {
        # Hérite de gzip on;
        server_name exemple2.com;
    }
}
```

Chemin d’apprentissage recommandé :

1. Lire un `nginx.conf` complet et repérer tous les blocs `{}` et leur indentation.  
2. Classer manuellement quelques directives dans un tableau indiquant leur contexte autorisé.  
3. Expérimenter avec l’héritage : définir une directive dans `http` puis la surcharger dans un `server`, voire un `location`.

---

## L’architecture de NGINX

La compréhension de l’architecture interne de NGINX permet d’expliquer ses performances et sa manière de gérer les connexions.

### Processus maître et workers

NGINX utilise un modèle multi-processus :

- Un processus maître (“master process”) :
  - Lit les fichiers de configuration.
  - Ouvre les sockets d’écoute (ports).  
  - Lance et surveille les workers.  
  - Traite les signaux (reload, stop, etc.).

- Un ou plusieurs processus travailleurs (“worker processes”) :
  - Acceptent les connexions des clients.
  - Traitent les requêtes HTTP.
  - Gèrent les opérations réseau (event-driven, non bloquant).

Schéma typique :

- En haut : “nginx master process (PID X)” connecté à `nginx.conf`.  
- En bas : plusieurs boîtes “worker process 1”, “worker process 2”, etc.  
- Des flèches des clients (navigateurs) qui arrivent vers les workers via les ports 80/443.

Configuration correspondante :

```nginx
# Dans le contexte main
user  nginx;
worker_processes  auto;

events {
    worker_connections  1024;
}
```

- `worker_processes auto;` demande à NGINX de choisir un nombre de workers adapté (souvent égal au nombre de cœurs CPU).  
- `worker_connections` définit le nombre de connexions simultanées par worker.

### Modèle événementiel (event-driven)

NGINX est conçu autour d’un modèle événementiel asynchrone :

- Chaque worker utilise un mécanisme comme `epoll` (Linux) ou `kqueue` (BSD) pour gérer un grand nombre de connexions sans bloquer.  
- Un worker peut ainsi gérer des milliers de connexions simultanées.

Dans `events` :

```nginx
events {
    worker_connections 4096;
    # event model automatique par défaut (epoll, etc.)
}
```

Un schéma utile :  
- Un worker process relié à une file d’événements “epoll” avec plusieurs sockets client.  
- Des flèches montrant que tous les sockets sont gérés par une seule boucle d’événements.

### Modules et pipeline de traitement

NGINX est modulaire. Il existe plusieurs catégories de modules :

- Modules “core” (gérés dans le code principal).  
- Modules HTTP (ex : `http_proxy`, `http_gzip_static`, `http_ssl`).  
- Modules stream, mail, etc.

Dans une requête HTTP typique :

1. Le worker reçoit la requête.  
2. Une phase de “rewrite” peut modifier l’URI.  
3. La phase de sélection de `server`/`location` choisit le bloc approprié.  
4. Selon la configuration, la requête peut :
   - Servir un fichier statique (`root`, `try_files`).  
   - Être proxyfiée vers un backend (`proxy_pass`).  
   - Être transmise à FastCGI (`fastcgi_pass`), etc.  
5. Les modules de logging et de filtres (compression, headers) interviennent avant la réponse.

Exemple minimal de proxy :

```nginx
http {
    upstream backend_app {
        server 127.0.0.1:3000;
        server 127.0.0.1:3001;
    }

    server {
        listen 80;
        server_name api.exemple.com;

        location / {
            proxy_pass http://backend_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

Schéma possible :

- À gauche : clients.  
- Au centre : NGINX (workers).  
- À droite : plusieurs serveurs backend (upstream).  
- Flèches montrant le routage des requêtes.

Chemin d’apprentissage pour cette section :

1. Lister les processus via `ps` pour voir le maître et les workers.  
2. Modifier `worker_processes` et `worker_connections`, faire des tests de charge (avec un outil simple comme `ab` ou `wrk`).  
3. Introduire un `upstream` et un `proxy_pass` et observer la répartition de charge.  

---

## La configuration de base de NGINX

Cette section montre comment passer d’une configuration par défaut à une configuration de base propre pour servir un site statique simple et introduire quelques notions essentielles.

### Structure classique des fichiers

Sur Debian/Ubuntu, on rencontre généralement :

- `/etc/nginx/nginx.conf` : fichier principal.  
- `/etc/nginx/conf.d/*.conf` : configurations globales additionnelles.  
- `/etc/nginx/sites-available/` : fichiers de configuration de sites (virtuel hosts).  
- `/etc/nginx/sites-enabled/` : liens symboliques vers les sites actifs.

Exemple de `nginx.conf` minimaliste :

```nginx
user  www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout 65;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### Configuration d’un serveur simple (site statique)

Un fichier `/etc/nginx/sites-available/mon_site` peut contenir :

```nginx
server {
    listen 80;
    server_name monsite.local;

    root /var/www/monsite;
    index index.html index.htm;

    access_log /var/log/nginx/monsite.access.log;
    error_log  /var/log/nginx/monsite.error.log;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Étapes concrètes :

1. Créer un répertoire `/var/www/monsite` et y placer un `index.html`.  
2. Créer le fichier de configuration du site dans `sites-available`.  
3. Créer un lien symbolique dans `sites-enabled` :  
   `sudo ln -s /etc/nginx/sites-available/monsite /etc/nginx/sites-enabled/monsite`  
4. Tester la configuration : `sudo nginx -t`.  
5. Recharger : `sudo systemctl reload nginx`.

Tableau d’explication des directives de ce `server` :

| Directive         | Rôle                                                                 |
|-------------------|----------------------------------------------------------------------|
| `listen`          | Port (et éventuellement IP) d’écoute.                                |
| `server_name`     | Nom(s) de domaine correspondant à ce virtual host.                   |
| `root`            | Répertoire racine des fichiers statiques.                            |
| `index`           | Nom(s) des fichiers d’index par défaut.                              |
| `access_log`      | Fichier de log des requêtes traitées.                                |
| `error_log`       | Fichier de log des erreurs.                                          |
| `location /`      | Bloc définissant le comportement pour l’URI racine.                  |
| `try_files`       | Tentative de servir un fichier/chemin donné, sinon retourner un code. |

### Ajout du HTTP → HTTPS (base)

Une configuration de base pour activer HTTPS suppose des certificats valides (par exemple via Let’s Encrypt) :

```nginx
server {
    listen 80;
    server_name monsite.exemple;

    # Redirection HTTP -> HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name monsite.exemple;

    ssl_certificate     /etc/letsencrypt/live/monsite.exemple/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/monsite.exemple/privkey.pem;

    root /var/www/monsite;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Points importants à assimiler :

- Le premier `server` écoute en HTTP et redirige tout vers HTTPS.  
- Le second `server` est en HTTPS, avec directives `ssl_certificate` et `ssl_certificate_key`.  

Schéma recommandé :  
- Un client qui interroge `http://` redirigé vers `https://`.  
- Deux blocs `server` indiquant 80 et 443.

### Journalisation (logs) et formats

NGINX permet de configurer les logs d’accès et d’erreur :

```nginx
http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    server {
        # ...
        access_log /var/log/nginx/monsite.access.log main;
        error_log  /var/log/nginx/monsite.error.log warn;
    }
}
```

Chemin d’apprentissage :

1. Créer un premier site statique en HTTP.  
2. Activer la redirection HTTP → HTTPS et déployer un certificat.  
3. Configurer des logs dédiés et analyser quelques entrées (codes de statut, IP).  
4. Varier `index`, `root` et `location` pour observer l’impact sur la résolution des fichiers.

---

## Chemin d’apprentissage détaillé pour l’ensemble du chapitre

Même si le contenu ci‑dessus est organisé par thèmes, il est possible de les parcourir dans un ordre progressif pour construire une compréhension solide.

### Étape 1 : Manipuler le service NGINX

Objectif : maîtriser les démarrages, arrêts et rechargements sans crainte.

- Identifier la distribution utilisée et vérifier si `systemctl` est disponible.  
- Apprendre par cœur les commandes :
  - `nginx -t`, `nginx -s reload`, `systemctl reload nginx`.  
- Faire de petits changements contrôlés (modifier la page d’index) et tester/recharger.  
- Observer les logs (`journalctl -u nginx`, `/var/log/nginx/error.log`) lors d’erreurs de syntaxe.

### Étape 2 : Lire et comprendre la structure de `nginx.conf`

Objectif : être capable d’ouvrir n’importe quel fichier de configuration et en comprendre les grands blocs.

- Ouvrir `/etc/nginx/nginx.conf` et repérer :
  - Le contexte global (directives en haut).  
  - Le bloc `events`.  
  - Le bloc `http`, les includes (`conf.d`, `sites-enabled`).  
- Dessiner l’arborescence des contextes sur papier (ou outil de diagramme).  
- Ajouter une directive simple dans `http` (par exemple un nouveau `log_format`) et observer son héritage dans les `server`.

### Étape 3 : Travailler les directives et contextes

Objectif : comprendre quelles directives peuvent être utilisées où, et comment l’héritage fonctionne.

- Choisir quelques directives clefs : `root`, `index`, `access_log`, `error_log`, `listen`, `server_name`, `try_files`, `proxy_pass`.  
- Pour chacune, noter :
  - Contextes autorisés (http, server, location, etc.).  
  - Valeur par défaut (si connue).  
- Faire des essais :
  - Définir `root` dans `http` et le redéfinir dans un `server`.  
  - Définir `access_log` dans `http` puis le désactiver (`off`) dans un `location` précis.

### Étape 4 : Découvrir l’architecture interne

Objectif : lier ce qui est dans la configuration à ce qui tourne réellement sur la machine.

- Lancer NGINX puis utiliser `ps` ou `pgrep` pour voir le master et les workers.  
- Modifier `worker_processes` (par exemple `1`, `2`, `auto`) et observer le nombre de workers.  
- Exécuter une légère charge (par exemple accéder à une page en boucle, ou utiliser un outil simple de test de charge) et observer la consommation CPU/mémoire par worker.  
- Lire une documentation de haut niveau sur le modèle “event‑driven” pour mieux comprendre la différence avec un serveur multi‑thread classique.

### Étape 5 : Construire une configuration de base solide

Objectif : posséder un squelette de configuration réutilisable.

- Partir d’un `nginx.conf` minimal et le compléter avec :
  - `worker_processes auto;`  
  - `events { worker_connections 1024; }`  
  - `http { ... }` avec `sendfile on;`, `keepalive_timeout`, logs, includes.  
- Créer un fichier de site dans `sites-available` et le lier dans `sites-enabled`.  
- Tester le comportement pour différents fichiers :
  - Fichiers statiques (HTML, CSS, images).  
  - Fichier inexistant pour voir la page 404.  
- Ajouter une redirection HTTPS et (facultatif) introduire un `upstream` vers une application.

---

Ce chapitre posé, l’étape suivante dans un cursus NGINX consisterait à approfondir progressivement les modules HTTP (proxy, cache, rewrite), la sécurité (TLS, en-têtes, rate limiting) et l’observabilité (logs avancés, métriques), en s’appuyant sur les mécanismes vus ici : gestion du service, structure des contextes, architecture processeur/événements et configuration de base réutilisable.
