# Citations
- https://nginxui.com/guide/nginx-proxy-example
- https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/How-to-setup-Nginx-reverse-proxy-servers-by-example
- https://www.hostinger.com/tutorials/how-to-set-up-nginx-reverse-proxy
- https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04
- https://www.youtube.com/watch?v=lZVAI3PqgHc
- https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/
- https://gist.github.com/mreferre/38297db0c7a279a25d234e572c975b75
- https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-with-jenkins/reverse-proxy-configuration-nginx/


# Tokens
- prompt_tokens: 255
- completion_tokens: 4098
- total_tokens: 4353
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.061, 'request_cost': 0.006, 'total_cost': 0.068}


# Content
La configuration d’un reverse proxy Nginx suit toujours la même logique : un *client* envoie une requête HTTP(S) vers Nginx, qui la transfère ensuite à une ou plusieurs applications internes (backends), tout en contrôlant les en-têtes, la sécurité, le routage, le cache et parfois les websockets.  
Ce chapitre détaille cette logique sur plusieurs cas concrets (local, API + SPA, Docker Compose, PHP-FPM, WebSocket) et propose un chemin d’apprentissage progressif.

> Remarque importante : l’environnement ne permet pas ici d’aller vérifier en direct l’existence de ressources externes (images, schémas). Lorsque des diagrammes sont proposés, ils sont fournis au format ASCII ou pseudo-graphique, de manière à rester auto‑contenus et exploitables.

---

## Vue d’ensemble du reverse proxy

Un reverse proxy Nginx reçoit les requêtes des clients et les redirige vers des serveurs applicatifs internes, souvent sur d’autres ports ou hôtes, en masquant l’infrastructure interne.  
L’apprentissage se construit en couches : d’abord un reverse proxy local simple, ensuite la gestion d’API et de SPA, puis l’orchestration avec Docker, le lien avec PHP-FPM, et enfin le support de WebSocket.

Schéma conceptuel minimal :

```text
[Client] ---> [Nginx (Reverse Proxy)] ---> [App 1 (API)]
                                    └--> [App 2 (SPA)]
                                    └--> [App 3 (PHP-FPM)]
```

---

## Reverse proxy local

### Objectif pédagogique

- Comprendre la structure de base de la configuration Nginx (http, server, location).
- Maîtriser `proxy_pass`, les en-têtes courants (`Host`, `X-Real-IP`, etc.).
- Savoir mettre en place un reverse proxy unique vers une application locale (Node.js, Tomcat, Python, etc.).

### Chemin d’apprentissage

1. Installer Nginx et repérer les fichiers de configuration (`nginx.conf`, `sites-available`, `sites-enabled`).
2. Mettre en place une application locale simple (ex. un serveur HTTP sur le port 8080).
3. Configurer un virtual host Nginx qui écoute sur le port 80 et redirige vers `http://127.0.0.1:8080`.
4. Ajouter progressivement les en-têtes standards liés aux proxys.
5. Tester, observer les logs, et jouer sur les timeouts / buffers.

### Exemple de configuration minimale

```nginx
http {
    upstream local_app {
        server 127.0.0.1:8080;
    }

    server {
        listen 80;
        server_name example.local;

        access_log /var/log/nginx/example.local.access.log;
        error_log  /var/log/nginx/example.local.error.log;

        location / {
            proxy_pass         http://local_app;
            proxy_set_header   Host              $host;
            proxy_set_header   X-Real-IP         $remote_addr;
            proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $scheme;

            proxy_connect_timeout 3s;
            proxy_read_timeout    30s;
            proxy_send_timeout    30s;
        }
    }
}
```

### Points clés à expérimenter

- Modifier `server_name` et vérifier le routage par host virtuel.
- Faire tomber l’application sur 8080 et observer le comportement de Nginx (codes d’erreur, pages d’erreur).
- Activer/désactiver les logs, ou changer leur niveau de détail.
- Ajouter une redirection HTTP → HTTPS (au moins au niveau conceptuel) :

```nginx
server {
    listen 80;
    server_name example.local;
    return 301 https://$host$request_uri;
}
```

---

## Reverse proxy API et SPA

Ce cas couvre un scénario très courant :  
- un backend API (REST/GraphQL, par exemple sur `localhost:3000`),  
- une SPA (React/Vue/Angular) servie soit statiquement par Nginx, soit par un autre serveur (port différent).

Le reverse proxy joue alors un rôle de *gateway* unique, exposant un seul domaine au navigateur.

### Objectifs pédagogiques

- Servir une SPA statique avec Nginx (ou via un backend) tout en déléguant `/api` à une API.
- Gérer le CORS directement à l’API ou via le reverse proxy si nécessaire.
- Comprendre le routage par préfixe (`location /api/` vs `location /`).

### Schéma logique

```text
Client
  |   GET /         GET /api/users
  v         v
[Nginx] ---+-----------------------------------+
  | location / (SPA)                           |
  | location /api/ (API)                       |
  v                                           v
[SPA statique]                           [API backend]
(port 8081)                               (port 3000)
```

### Exemple de configuration API + SPA (SPA statique sur Nginx)

```nginx
http {
    upstream api_backend {
        server 127.0.0.1:3000;
    }

    server {
        listen 80;
        server_name app.local;

        # SPA statique
        root /var/www/app-spa/dist;
        index index.html;

        # Délégation des appels API
        location /api/ {
            proxy_pass         http://api_backend;
            proxy_set_header   Host              $host;
            proxy_set_header   X-Real-IP         $remote_addr;
            proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $scheme;

            # Désactiver éventuellement le buffering si besoin
            # proxy_buffering off;
        }

        # Routage SPA (HTML5 history mode)
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Variantes et approfondissements

- **SPA servie par un dev‑server** (ex. `npm run dev` sur port 5173) en développement :
  - `location /` → `proxy_pass http://127.0.0.1:5173;`
  - `location /api/` → proxy vers `3000`.
- Ajouter des règles de sécurité :
  - `add_header X-Frame-Options SAMEORIGIN;`
  - `add_header X-Content-Type-Options nosniff;`
  - `add_header X-XSS-Protection "1; mode=block";`
- Gérer le CORS si l’API n’inclut pas les en-têtes :
  - `add_header Access-Control-Allow-Origin ...` sous `location /api/`.

---

## Reverse proxy API et SPA avec Docker Compose

Dans ce scénario, Nginx, l’API et la SPA (ou au moins son serveur de fichiers) sont tous des services Docker.  
Le reverse proxy devient le point d’entrée du réseau Docker, souvent exposé sur le port 80/443 de l’hôte.

### Objectifs pédagogiques

- Comprendre le réseau Docker par défaut (bridge) et les noms de services comme DNS internes.
- Configurer Nginx en se basant sur les noms des services Docker (`api`, `spa`) plutôt que sur `localhost`.
- Mettre en place un `docker-compose.yml` complet avec Nginx en front.

### Exemple de `docker-compose.yml` (simplifié)

```yaml
version: "3.9"

services:
  nginx:
    image: nginx:stable
    container_name: nginx_gateway
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/logs:/var/log/nginx
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - api
      - spa

  api:
    build: ./api
    container_name: api_service
    expose:
      - "3000"

  spa:
    image: nginx:stable
    container_name: spa_service
    volumes:
      - ./spa/dist:/usr/share/nginx/html:ro
    expose:
      - "80"
```

Ici, `api` écoute sur `3000` à l’intérieur du conteneur, `spa` expose ses fichiers sur `80`, et Nginx les atteint via les noms de service `api` et `spa`.

### Configuration Nginx dans Docker (`./nginx/conf.d/app.conf`)

```nginx
upstream api_backend {
    server api:3000;
}

upstream spa_frontend {
    server spa:80;
}

server {
    listen 80;
    server_name app.local;

    # Proxy vers l'API Dockerisée
    location /api/ {
        proxy_pass         http://api_backend;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    # Proxy vers la SPA (servie par un Nginx interne)
    location / {
        proxy_pass http://spa_frontend;
    }
}
```

### Étapes d’apprentissage

1. Démarrer par une configuration Nginx fonctionnant hors Docker (cas précédent).
2. Conteneuriser l’API seule, puis adapter `proxy_pass` (`http://127.0.0.1:3000` → `http://api:3000`).
3. Conteneuriser ensuite la SPA, l’attacher à Nginx via `upstream spa_frontend`.
4. Gérer les logs dans Docker (liaison de volumes), et tester la mise à jour des conteneurs sans redémarrer toute la stack.

---

## Reverse proxy avec PHP-FPM

Ce module se concentre sur l’intégration classique Nginx + PHP-FPM, où Nginx sert les fichiers statiques et délègue l’exécution PHP à PHP-FPM via un socket Unix ou TCP.

### Objectifs pédagogiques

- Comprendre la différence entre proxy HTTP (`proxy_pass`) et passerelle FastCGI (`fastcgi_pass`).
- Configurer Nginx pour servir à la fois des fichiers statiques et des scripts PHP sur la même machine.
- Ajuster les paramètres FastCGI (buffers, timeouts, variables d’environnement PHP).

### Schéma conceptuel

```text
[Client] --> [Nginx]
   |            |
   | /images    |--> Fichiers statiques (Nginx)
   | /index.php |--> PHP-FPM (FastCGI)
   v            v
            [php-fpm]
```

### Exemple de configuration Nginx + PHP-FPM

```nginx
server {
    listen 80;
    server_name php.local;
    root /var/www/php-app/public;
    index index.php index.html;

    # Fichiers statiques
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Traitement des scripts PHP
    location ~ \.php$ {
        include fastcgi_params;

        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        # ou fastcgi_pass 127.0.0.1:9000;

        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO       $fastcgi_path_info;

        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 32k;
        fastcgi_read_timeout 60s;
    }

    # Sécuriser l'accès aux fichiers sensibles
    location ~ /\.ht {
        deny all;
    }
}
```

### Points pédagogiques importants

- Bien comprendre la variable `SCRIPT_FILENAME` qui indique à PHP-FPM le chemin réel du script.
- Savoir faire la différence entre :
  - `proxy_pass http://backend;` (backend HTTP)
  - `fastcgi_pass unix:/run/php/php-fpm.sock;` (backend FastCGI pour PHP).
- Tester le `phpinfo()` et vérifier que les en-têtes HTTP et les variables serveur sont cohérents (host, remote_addr, etc.).
- Voir comment Nginx et PHP-FPM interagissent sur la performance (buffers, `pm` dans PHP-FPM, etc.).

---

## Reverse proxy et protocole WebSocket

Le cas WebSocket ajoute une contrainte : le reverse proxy doit supporter l’upgrade de protocole HTTP → WebSocket (en-tête `Upgrade: websocket` et `Connection: upgrade`) et maintenir la connexion ouverte.

### Objectifs pédagogiques

- Comprendre la phase d’upgrade HTTP → WebSocket.
- Configurer Nginx pour transmettre correctement les en‑têtes `Upgrade` et `Connection`.
- Gérer les timeouts et éventuellement désactiver certains mécanismes de buffering.

### Schéma d’échange

```text
Client
  |  HTTP GET /ws  + Upgrade: websocket
  v
[Nginx Reverse Proxy]
  |  HTTP GET /ws  + Upgrade: websocket
  v
[Serveur WebSocket (ex: ws://127.0.0.1:4000)]
```

### Configuration type pour WebSocket

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

upstream ws_backend {
    server 127.0.0.1:4000;
}

server {
    listen 80;
    server_name ws.local;

    # Endpoint WebSocket
    location /ws/ {
        proxy_pass         http://ws_backend;

        proxy_http_version 1.1;
        proxy_set_header   Upgrade    $http_upgrade;
        proxy_set_header   Connection $connection_upgrade;

        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        proxy_read_timeout  3600s;
        proxy_send_timeout  3600s;
    }

    # Autre trafic (HTTP classique)
    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

### Étapes d’apprentissage

1. Mettre en place un serveur WebSocket simple (Node.js, Go, etc.) sur un port local.
2. Tester la connexion directe (`ws://127.0.0.1:4000`) avec un client WebSocket (navigateur, script d’essai).
3. Introduire Nginx entre les deux :
   - Endpoint public : `ws://ws.local/ws/`
   - Backend interne : `127.0.0.1:4000`
4. Vérifier que les connexions persistent et que les messages transitent correctement malgré le proxy.
5. Ajuster les timeouts, vérifier l’impact sur des connexions longues ou des clients inactifs.

---

## Chemin d’apprentissage détaillé (fil conducteur)

Pour relier l’ensemble de ces modules :

1. **Fondations Nginx (1–2 jours)**
   - Lire la structure générale des blocs (`events`, `http`, `server`, `location`).
   - Expérimenter un reverse proxy local simple (un seul backend HTTP).
   - Apprendre à relire et recharger la configuration (`nginx -t`, `systemctl reload`).

2. **Routage avancé (2–3 jours)**
   - Ajouter plusieurs `location` avec des préfixes (`/`, `/api/`, `/admin/`).
   - Mettre en place API + SPA sur une même instance Nginx.
   - Manipuler les en‑têtes (`proxy_set_header`) et les timeouts.

3. **Intégration Docker (2–3 jours)**
   - Écrire un `docker-compose.yml` incluant au minimum `nginx` + `api`.
   - Comprendre la résolution DNS interne Docker par nom de service.
   - Étendre à `nginx` + `api` + `spa`, puis gérer les mises à jour des services indépendamment.

4. **PHP-FPM et FastCGI (2–3 jours)**
   - Installer PHP-FPM et relier Nginx via `fastcgi_pass`.
   - Servir une application PHP réelle (ex. mini CMS).
   - Comparer les flux : proxy HTTP vs FastCGI, et jouer sur les paramètres de performance.

5. **WebSockets et temps réel (2–3 jours)**
   - Mettre en place un petit chat WebSocket de test.
   - Placer Nginx en front, vérifier l’upgrade de protocole.
   - Tester la stabilité (longues connexions, perte réseau, reconnections).

---

## Tableau récapitulatif des cas étudiés

| Cas                           | Type de backend principal      | Directive Nginx clé       | Élément d’apprentissage majeur                              |
|------------------------------|---------------------------------|---------------------------|-------------------------------------------------------------|
| Reverse proxy local          | HTTP simple (Node, Tomcat…)    | `proxy_pass`              | Structure de base, en-têtes, timeouts                      |
| Reverse proxy API + SPA      | API HTTP + fichiers statiques  | `proxy_pass`, `try_files` | Routage par préfixe, SPA et history mode                   |
| API + SPA avec Docker        | Services Docker HTTP           | `proxy_pass` vers noms    | Réseau Docker, DNS interne, orchestration                  |
| Reverse proxy avec PHP-FPM   | PHP via FastCGI                | `fastcgi_pass`            | Différence HTTP/FastCGI, variable `SCRIPT_FILENAME`        |
| Reverse proxy WebSocket      | Serveur WebSocket              | `proxy_http_version 1.1`  | Upgrade de protocole, connexions persistantes, timeouts    |

---

Même sans accès direct à des images externes, chaque bloc de configuration et chaque schéma ASCII permet de visualiser les flux et de progresser étape par étape, en allant du reverse proxy le plus simple jusqu’aux scénarios temps réel et multi‑conteneurs.
