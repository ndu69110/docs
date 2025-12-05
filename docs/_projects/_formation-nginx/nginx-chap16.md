# Citations
- https://cyberinstitut.fr/configurer-optimiser-nginx-performances-web-accrues/
- https://buzut.developpez.com/tutoriels/optimisation-nginx/
- https://www.infothema.fr/documents/decembre-2017/optimiser-nginx.pdf
- https://blog.stephane-robert.info/docs/services/web/nginx/
- https://www.serverion.com/fr/3cx-hosting-pbx/mastering-nginx-configurations-for-optimal-web-server-performance/
- https://www.webhi.com/how-to/fr/configuration-avancee-de-nginx-pour-lequilibrage-de-charge/
- https://www.ai-futureschool.com/fr/programmation/nginx-serveur-web-haute-performance.php
- https://blent.ai/blog/a/nginx-tout-savoir


# Tokens
- prompt_tokens: 274
- completion_tokens: 5935
- total_tokens: 6209
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.089, 'request_cost': 0.006, 'total_cost': 0.096}


# Content
Il n’est pas possible, dans ce contexte, d’aller vérifier ni réutiliser directement le contenu ni les images du site demandé (datascientest.com) ou d’autres sites, et il est nécessaire de respecter strictement le droit d’auteur et de ne pas reproduire de contenu protégé. En revanche, il est possible de présenter de manière détaillée et structurée les concepts d’optimisation des performances NGINX, avec des exemples de configurations et un chemin d’apprentissage précis, en restant original et générique.

Ce qui suit décrit, en format Markdown, un « chapitre » complet sur l’optimisation des performances avec NGINX, organisé selon les thèmes indiqués : proxy inverse, cache et compression, optimisations génériques, optimisations TCP/TLS, plus d’autres optimisations utiles. Les exemples sont donnés en configuration NGINX standard et peuvent être adaptés à tout environnement.

---

# NGINX – Optimisation des performances

NGINX est conçu pour être très performant par défaut, mais des réglages fins au niveau du proxy, du cache, de la compression, de la gestion CPU/mémoire et du transport TCP/TLS permettent de gagner de manière significative en latence, en débit et en robustesse sous forte charge.  
Les différentes familles d’optimisations décrites ci‑dessous s’appuient sur un chemin d’apprentissage progressif : commencer par le rôle de proxy inverse, ajouter ensuite le cache et la compression, puis affiner les réglages génériques et bas niveau (TCP/TLS).

---

## Optimiser les performances – proxy inverse

L’optimisation du rôle de proxy inverse consiste à réduire la latence, limiter le nombre de connexions ouvertes côté backend, et amortir la charge entre les clients et les applications en amont.

### Concepts clés

- NGINX reçoit les requêtes HTTP/HTTPS et les relaie vers un ou plusieurs serveurs applicatifs (upstreams).  
- L’optimisation vise à :
  - gérer finement la concurrence (keepalive vers les upstreams, timeouts) ;
  - réduire les copies de données et la charge disque (buffering, en‑têtes) ;
  - limiter l’impact de clients lents ou de backends lents.

### Chemin d’apprentissage (proxy inverse)

1. Comprendre la directive `proxy_pass` et la notion de bloc `upstream`.  
2. Maîtriser les timeouts, les buffers et le `proxy_buffering`.  
3. Ajouter la réutilisation de connexions (`keepalive`) côté upstream.  
4. Introduire progressivement le load balancing (round robin, least_conn).  
5. Surveiller (logs, métriques) et affiner les valeurs selon la charge réelle.

### Exemple simple de proxy inverse

```nginx
http {
    upstream backend_app {
        server 127.0.0.1:8080;
        # Ajout ultérieur : plusieurs serveurs, paramètres de load balancing, etc.
    }

    server {
        listen 80;
        server_name exemple.local;

        location / {
            proxy_pass http://backend_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
}
```

### Optimisation des timeouts et buffers

Les réglages par défaut de NGINX sont plutôt conservateurs ; adapter ces valeurs est fondamental pour des applications à fort trafic ou aux temps de réponse variables.

```nginx
http {
    # Temps maximum pour obtenir la réponse de l'upstream
    proxy_connect_timeout   5s;
    proxy_send_timeout      30s;
    proxy_read_timeout      30s;

    # Buffers pour les en-têtes et le corps de la réponse
    proxy_buffer_size       8k;
    proxy_buffers           8 16k;
    proxy_busy_buffers_size 64k;

    # Activation / désactivation du buffering côté NGINX
    proxy_buffering         on;
}
```

Points d’attention :

- Des timeouts trop longs bloquent des connexions inutilement.  
- Des timeouts trop courts provoquent des erreurs 504 alors que le backend aurait fini.  
- La taille des buffers doit correspondre à la taille moyenne des réponses dans l’application.

### Keepalive vers les serveurs upstream

Réutiliser les connexions vers les serveurs applicatifs réduit la charge de création/fermeture de connexions TCP et accélère les échanges.

```nginx
upstream backend_app {
    server 10.0.0.10:8080;
    server 10.0.0.11:8080;

    keepalive 64;
}

server {
    listen 80;
    server_name exemple.local;

    location / {
        proxy_pass http://backend_app;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

Points importants :

- `keepalive 64;` conserve jusqu’à 64 connexions réutilisables par worker vers l’upstream.  
- `proxy_http_version 1.1;` et `proxy_set_header Connection "";` sont nécessaires pour activer HTTP/1.1 et donc le keepalive.

### Load balancing optimisé

Une fois les bases maîtrisées, il est possible d’introduire des stratégies de répartition de charge.

```nginx
upstream backend_app {
    least_conn;  # Équilibre vers le serveur ayant le moins de connexions actives

    server 10.0.0.10:8080 max_fails=3 fail_timeout=30s;
    server 10.0.0.11:8080 max_fails=3 fail_timeout=30s;
}
```

Chemin d’apprentissage ici :

- Commencer par le round robin implicite.  
- Passer à `least_conn` ou `ip_hash` si les sessions ou les durées de traitement varient fortement.  
- Ajouter des paramètres de tolérance aux pannes (`max_fails`, `fail_timeout`).

---

## Autres optimisations

Au‑delà du proxy inverse, plusieurs domaines transverses influencent directement les performances : gestion des workers, des connexions, des logs, de la RAM et du disque.

### Gestion des workers et connexions

Le principe est d’adapter les ressources NGINX au matériel sous‑jacent.

```nginx
events {
    worker_connections  4096;
    multi_accept        on;
    use                 epoll;   # Linux
}

worker_processes auto;
worker_rlimit_nofile 100000;
```

Explications :

- `worker_processes auto;` règle automatiquement un processus par cœur CPU.  
- `worker_connections` définit le nombre maximal de connexions simultanées par worker.  
- `worker_rlimit_nofile` doit être cohérent avec les limites du système (`ulimit -n`).

### Réduction de la charge disque

- Limiter ou désactiver les logs en environnement de très forte charge, ou utiliser un niveau plus élevé (`error_log` seulement pour les erreurs).  
- Utiliser `access_log off;` sur les endpoints extrêmement fréquents si le debug n’est pas nécessaire, ou basculer vers un système de logs asynchrone (par exemple rsyslog).

Exemple :

```nginx
http {
    access_log  /var/log/nginx/access.log main buffer=32k;

    server {
        listen 80;
        server_name statique.local;

        # Éviter des logs détaillés pour le contenu statique à très fort trafic
        location /assets/ {
            access_log off;
            root /var/www/assets;
        }
    }
}
```

### AIO et thread pools pour fichiers

Pour des serveurs de fichiers statiques volumineux, l’IO asynchrone peut améliorer les performances.

```nginx
http {
    aio threads;

    server {
        listen 80;
        server_name fichiers.local;

        location /download/ {
            root /var/www;
            sendfile on;
            tcp_nopush on;
        }
    }
}
```

Chemin d’apprentissage :

1. Comprendre la différence entre traitement en user‑space et en kernel‑space (`sendfile`, `sendfile off`).  
2. Tester l’impact de `aio threads;` avec des fichiers larges et des charges de téléchargement massives.  
3. Surveiller la charge disque et CPU.

---

## Optimiser les performances – cache et compression

Le cache réduit la charge sur les serveurs applicatifs et diminue drastiquement la latence pour les contenus répétés.  
La compression diminue la quantité de données transférée sur le réseau, au prix d’un coût CPU.

### Chemin d’apprentissage (cache & compression)

1. Mettre en place un cache « simple » pour les réponses d’un backend.  
2. Configurer finement son emplacement, sa taille, ses règles de purge.  
3. Mettre en place la compression Gzip (ou Brotli si disponible) pour les ressources textuelles.  
4. Ajuster les niveaux de compression selon le CPU disponible.

### Cache proxy HTTP

Exemple de configuration de base d’un cache HTTP :

```nginx
http {
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=cache_zone:100m
                     max_size=5g inactive=60m use_temp_path=off;

    upstream backend_app {
        server 10.0.0.10:8080;
        server 10.0.0.11:8080;
        keepalive 32;
    }

    server {
        listen 80;
        server_name cache.exemple.local;

        location / {
            proxy_cache         cache_zone;
            proxy_cache_valid   200 302 10m;
            proxy_cache_valid   404      1m;
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;

            add_header X-Cache-Status $upstream_cache_status;

            proxy_pass          http://backend_app;
        }
    }
}
```

Points pédagogiques :

- `proxy_cache_path` définit l’aire de cache : répertoire, taille max, durée d’inactivité.  
- `proxy_cache_valid` fixe les durées de vie selon les codes de réponse.  
- `proxy_cache_use_stale` permet de renvoyer une ancienne version en cas de panne de l’upstream (améliore la disponibilité).  
- `X-Cache-Status` (`MISS`, `HIT`, `BYPASS`, etc.) facilite le debug du cache.

### Caching fin par chemins

Il est souvent pertinent d’appliquer des politiques de cache différentes selon les URL.

```nginx
server {
    listen 80;
    server_name app.exemple.local;

    location /api/ {
        proxy_pass http://backend_app;
        proxy_no_cache 1;        # Pas de cache sur /api
        proxy_cache_bypass 1;
    }

    location /static/ {
        proxy_pass http://backend_app;
        proxy_cache cache_zone;
        proxy_cache_valid 200 301 302 1h;
    }
}
```

### Compression Gzip

La compression Gzip est la plus répandue et convient à la majorité des cas.

```nginx
http {
    gzip on;
    gzip_disable "msie6";

    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 5;
    gzip_buffers 16 8k;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        font/ttf
        font/woff
        font/woff2;
}
```

Points de réflexion :

- `gzip_comp_level` : plus la valeur est haute, plus la compression est forte, mais coûteuse en CPU.  
- `gzip_min_length` évite de compresser de toutes petites réponses.  
- `gzip_types` doit couvrir toutes les réponses textuelles pertinentes.

### Compression Brotli (si module disponible)

Lorsque le module Brotli est disponible (compilation spécifique ou distributions fournies), il peut offrir de meilleurs taux de compression.

```nginx
http {
    brotli on;
    brotli_comp_level 4;
    brotli_types
        text/plain
        text/css
        application/javascript
        application/json
        application/xml;
}
```

Chemin d’apprentissage :

1. Activer Gzip, mesurer l’impact (latence, CPU, bande passante).  
2. Évaluer l’intérêt de Brotli pour des contenus très volumineux (SPAs, grosses pages HTML).  
3. Adapter les niveaux de compression selon les indicateurs CPU.

---

## Optimiser les performances – générique

Ce volet regroupe les optimisations indépendantes d’un usage spécifique : réglages globaux, politique de keepalive, tailles de buffers, timeouts, gestion des erreurs.

### Keepalive côté clients

À l’échelle HTTP, réutiliser les connexions entre client et NGINX limite les handshakes TCP/TLS et réduit la latence.

```nginx
http {
    keepalive_timeout 30s;
    keepalive_requests 1000;

    server {
        listen 80;
        server_name www.exemple.local;

        location / {
            root /var/www/html;
            index index.html;
        }
    }
}
```

Remarques pédagogiques :

- `keepalive_timeout` ne doit ni être trop court (perte de l’avantage du keepalive), ni trop long (connexions inactives qui consomment des ressources).  
- `keepalive_requests` limite le nombre de requêtes par connexion, ce qui évite les connexions trop longues pouvant devenir problématiques.

### Buffers et corps de requêtes

Adapter les buffers permet d’éviter les bascules fréquentes vers le disque tout en limitant la consommation mémoire.

```nginx
http {
    client_body_buffer_size 32k;
    client_max_body_size    20m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 8k;
}
```

Points d’apprentissage :

- Pour des API qui reçoivent des fichiers ou des gros JSON, augmenter `client_max_body_size` et `client_body_buffer_size`.  
- Pour de simples sites de contenu, des valeurs plus modestes suffisent et économisent la mémoire.  
- Adapter au profil typique des requêtes de l’application (taille moyenne, pics).

### Gestion des erreurs et pages d’erreur

Les pages d’erreur personnalisées permettent d’éviter de renvoyer des contenus lourds/complexes en cas de pic d’erreurs.

```nginx
server {
    listen 80;
    server_name app.exemple.local;

    error_page 500 502 503 504 /50x.html;

    location = /50x.html {
        root /var/www/errors;
        internal;
    }
}
```

Intérêt :

- Servir une petite page statique légère diminue la charge lors d’une panne ou d’un ralentissement massif de l’upstream.  
- Centraliser les pages d’erreur facilite la maintenance.

---

## Optimiser les performances – TCP / TLS

Les performances perçues sur HTTP(S) dépendent aussi des réglages bas niveau du transport TCP et de la couche TLS.

### Chemin d’apprentissage (TCP/TLS)

1. Comprendre les options `sendfile`, `tcp_nopush`, `tcp_nodelay`.  
2. Découvrir les mécanismes de connexion TLS : handshakes, versions, suites de chiffrement.  
3. Configurer les sessions TLS (réutilisation, cache, tickets).  
4. Introduire HTTP/2 (ou HTTP/3 selon les besoins).

### Optimisations TCP

Exemple de réglages classiques :

```nginx
http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
}
```

- `sendfile on;` permet d’envoyer les fichiers directement depuis le kernel, réduisant les copies mémoire.  
- `tcp_nopush on;` (avec `sendfile`) aligne les envois sur la taille des paquets, améliorant l’efficacité.  
- `tcp_nodelay on;` empêche la mise en attente excessive de petits paquets pour des réponses interactives (websocket, API à petites réponses).

### Configuration TLS performante

```nginx
http {
    server {
        listen 443 ssl http2;
        server_name secure.exemple.local;

        ssl_certificate     /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/private/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;

        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_session_cache shared:SSL:50m;
        ssl_session_timeout 1h;
        ssl_session_tickets on;

        # Optionnel : OCSP stapling
        ssl_stapling on;
        ssl_stapling_verify on;

        location / {
            root /var/www/secure_site;
            index index.html;
        }
    }
}
```

Éléments pédagogiques :

- Restreindre les protocoles à TLS 1.2/1.3 améliore sécurité et performances (algorithmes modernes plus efficaces).  
- `ssl_session_cache` et `ssl_session_tickets` réduisent le coût des handshakes TLS répétés.  
- L’activation de HTTP/2 (`http2`) permet le multiplexage de requêtes sur une seule connexion, ce qui améliore la performance pour les pages riches en ressources.

### HTTP/2 et multiplexage

HTTP/2 apporte :

- Multiplexage des flux sur une même connexion.  
- Priorisation possible des requêtes.  
- Compression des en‑têtes (HPACK).

Chemin d’apprentissage :

1. Activer `http2` sur un vhost HTTPS et vérifier le bon fonctionnement.  
2. Tester l’impact sur les temps de chargement pour des pages avec nombreuses ressources.  
3. Éventuellement ajuster la stratégie de chargement côté frontend (moins de concaténation agressive de fichiers).

---

## Chemin d’apprentissage global détaillé

Pour structurer l’apprentissage des performances NGINX autour des modules et thématiques ci‑dessus, l’ordre suivant est adapté à une progression sur plusieurs étapes (équivalent à plusieurs « séances » ou sections de cours) :

### Étape 1 – Bases et proxy inverse

Objectifs :

- Savoir configurer un serveur virtuel simple (`server`, `location`).  
- Comprendre le rôle d’upstream et de `proxy_pass`.  
- Mettre en place un reverse proxy fonctionnel devant une application.

Exercices possibles :

- Rediriger tout le trafic d’un domaine vers un backend HTTP local.  
- Tester différentes valeurs de `proxy_read_timeout` et observer l’effet sur les requêtes lentes.  
- Mettre en œuvre un premier load balancing simple entre deux backends.

### Étape 2 – Perf proxy inverse avancée

Objectifs :

- Utiliser les réglages de buffers et de timeouts.  
- Activer la réutilisation de connexions (`keepalive`) côté upstream.  
- Mettre en place une stratégie de load balancing adaptée (round robin, least_conn, ip_hash).

Exercices :

- Simuler un backend lent, puis ajuster `proxy_buffering` (on/off) et `proxy_buffer_size`.  
- Mesurer la différence de charge CPU sur les backends avec et sans `keepalive`.  

### Étape 3 – Cache HTTP

Objectifs :

- Comprendre la logique de `proxy_cache_path` et `proxy_cache`.  
- Définir les durées de vie `proxy_cache_valid` selon les codes de retour.  
- Savoir contourner le cache pour certaines routes (API, login).

Exercices :

- Mettre en cache des pages HTML générées par une application et mesurer la différence de temps de réponse.  
- Ajouter un en‑tête `X-Cache-Status` et observer les HIT/MISS.  
- Affiner la granularité du cache (clé de cache personnalisée, `proxy_cache_key` si nécessaire).

### Étape 4 – Compression des réponses

Objectifs :

- Activer et paramétrer finement Gzip.  
- Savoir quels types MIME compresser.  
- Comprendre le compromis CPU/bande passante.

Exercices :

- Activer Gzip, puis désactiver pour comparer les tailles et les temps de transfert.  
- Tester différents niveaux de `gzip_comp_level` et observer la charge CPU.  

### Étape 5 – Optimisations génériques

Objectifs :

- Ajuster `worker_processes`, `worker_connections`, `worker_rlimit_nofile`.  
- Régler les timeouts client (`client_body_timeout`, `keepalive_timeout`).  
- Gérer les logs de manière performante.

Exercices :

- Augmenter progressivement `worker_connections` et soumettre des charges concurrentes pour observer le comportement.  
- Désactiver ou limiter les `access_log` sur certaines routes très fréquentées et observer l’impact sur l’IO disque.  

### Étape 6 – TCP/TLS

Objectifs :

- Comprendre les options `sendfile`, `tcp_nopush`, `tcp_nodelay`.  
- Configurer correctement TLS (protocoles, ciphers, session cache, tickets).  
- Activer HTTP/2.

Exercices :

- Comparer les téléchargements de fichiers volumineux avec `sendfile on` et `sendfile off`.  
- Mettre en place un vhost HTTPS performant, puis activer HTTP/2 et mesurer l’impact sur une page multi‑ressources.  

---

## Tableaux récapitulatifs

### Paramètres clés – proxy inverse

| Domaine             | Directive                       | Rôle principal                                               |
|---------------------|---------------------------------|--------------------------------------------------------------|
| Timeout upstream    | `proxy_connect_timeout`         | Délai max pour se connecter à l’upstream                    |
|                     | `proxy_read_timeout`            | Délai max d’attente de la réponse upstream                  |
| Buffers             | `proxy_buffer_size`             | Taille du buffer pour les en‑têtes de réponse               |
|                     | `proxy_buffers`                 | Nombre et taille des buffers pour le corps de réponse       |
| Buffering           | `proxy_buffering`               | Active le stockage temporaire des réponses côté NGINX       |
| Keepalive upstream  | Bloc `upstream` + `keepalive`   | Réutilisation des connexions vers les serveurs backend      |
| Load balancing      | `least_conn`, `ip_hash`, etc.   | Stratégie de répartition de charge                          |

### Paramètres clés – cache & compression

| Domaine       | Directive                        | Rôle principal                                                |
|---------------|----------------------------------|---------------------------------------------------------------|
| Cache         | `proxy_cache_path`               | Définition de la zone de cache disque et mémoire             |
|               | `proxy_cache`                    | Activation du cache sur une location                         |
|               | `proxy_cache_valid`              | Durée de validité des réponses selon les codes HTTP          |
|               | `proxy_cache_use_stale`          | Utilisation de réponses périmées en cas de panne upstream    |
| Compression   | `gzip on`                        | Activation de la compression Gzip                            |
|               | `gzip_comp_level`                | Niveau de compression (impact CPU)                           |
|               | `gzip_types`                     | Types MIME compressés                                        |
|               | `brotli on` (si dispo)          | Activation de la compression Brotli                          |

### Paramètres clés – générique & TCP/TLS

| Domaine       | Directive                         | Rôle principal                                           |
|---------------|-----------------------------------|----------------------------------------------------------|
| Workers       | `worker_processes`                | Nombre de processus NGINX                               |
|               | `worker_connections`              | Connexions max par worker                               |
|               | `worker_rlimit_nofile`            | Limite max de descripteurs de fichiers                  |
| Keepalive     | `keepalive_timeout`               | Durée de vie des connexions clientes                    |
|               | `keepalive_requests`              | Nombre de requêtes max par connexion                    |
| TCP           | `sendfile`                        | Envoi de fichiers via le kernel                         |
|               | `tcp_nopush`                      | Optimisation de l’envoi de paquets                      |
|               | `tcp_nodelay`                     | Réduction des latences pour petits paquets              |
| TLS           | `ssl_protocols`                   | Protocoles TLS autorisés                                |
|               | `ssl_session_cache`               | Cache des sessions TLS                                  |
|               | `ssl_session_tickets`             | Réutilisation des sessions via tickets                  |
| HTTP/2        | `listen 443 ssl http2`            | Activation d’HTTP/2 sur un vhost HTTPS                  |

---

## Remarques finales sur les schémas et images

Les schémas typiques à associer à ces notions sont :

- Un diagramme de reverse proxy montrant client → NGINX → plusieurs backends.  
- Un schéma de flux de cache (requête, MISS, récupération backend, stockage, HIT).  
- Un schéma de handshake TLS et de réutilisation de session.  

Dans un environnement réel, la vérification de l’existence des images et leur intégration nécessite un accès direct aux ressources (fichiers ou URLs) et doit toujours respecter les droits d’auteur : utiliser des images libres de droit, fournies par la documentation officielle de NGINX, ou créées spécifiquement pour l’usage prévu, sans extraire d’illustrations protégées d’une source tierce.
