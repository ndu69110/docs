# Citations
- https://blog.stephane-robert.info/docs/services/web/nginx/
- https://docs.aws.amazon.com/fr_fr/AmazonCloudWatch/latest/monitoring/ContainerInsights-Prometheus-Sample-Workloads-nginx.html
- https://www.it-connect.fr/configurer-nginx-en-tant-que-reverse-proxy/
- https://www.serverion.com/fr/3cx-hosting-pbx/mastering-nginx-configurations-for-optimal-web-server-performance/
- https://blent.ai/blog/a/nginx-tout-savoir
- https://www.webhi.com/how-to/fr/configuration-avancee-de-nginx-pour-lequilibrage-de-charge/
- https://grafikart.fr/tutoriels/nginx-692
- https://www.ai-futureschool.com/fr/programmation/nginx-comme-reverse-proxy-et-equilibreur-de-charge.php
- https://kinsta.com/fr/blog/proxy-inverse/
- https://www.f5.com/fr_fr/products/nginx/instance-manager


# Tokens
- prompt_tokens: 305
- completion_tokens: 4830
- total_tokens: 5135
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.072, 'request_cost': 0.006, 'total_cost': 0.079}


# Content
Nginx propose plusieurs mécanismes complémentaires pour gérer et filtrer le trafic selon l’origine géographique, le volume de connexions, la fréquence des requêtes et la bande passante. Les notions ci‑dessous couvrent les principaux modules et directives utiles pour un chapitre “Gestion du trafic” avancé.

---

## Préambule général

Nginx fonctionne par blocs de configuration (http, server, location, etc.) et par modules.  
Les fonctionnalités de géolocalisation (GeoIP2) et de limitation (limit_conn, limit_req, limit_rate) se combinent de manière déclarative : des variables sont définies (par exemple `geoip2_country_code`, variables de `map`, etc.), puis utilisées dans les blocs `server` et `location` pour décider d’autoriser, de refuser ou de ralentir le trafic.

---

## Module GeoIP2 : principe et variables

Le module GeoIP2 (souvent `ngx_http_geoip2_module` côté HTTP) exploite une base MaxMind (fichiers `.mmdb`) pour transformer une adresse IP en informations géographiques : pays, région, ville, coordonnées, ASN, etc.  
L’idée est de déclarer les bases et de lier leurs champs à des variables Nginx utilisables ensuite dans les directives de contrôle d’accès ou de logging.

### Déclaration basique des bases GeoIP2

Dans le bloc `http` (souvent dans `nginx.conf` ou un fichier inclus) :

```nginx
http {
    # Déclaration de la base pays
    geoip2 /etc/nginx/geoip2/GeoLite2-Country.mmdb {
        $geoip2_country_code country iso_code;
        $geoip2_country_name country names.fr;
    }

    # Déclaration de la base ville
    geoip2 /etc/nginx/geoip2/GeoLite2-City.mmdb {
        $geoip2_city_name        city names.fr;
        $geoip2_region_name      subdivisions 0 names.fr;
        $geoip2_continent_code   continent code;
    }

    # ...
}
```

- `geoip2 <chemin>` déclare une base MaxMind.  
- Les blocs internes associent les champs de la base à des variables Nginx (par exemple `$geoip2_country_code`).

Ces variables deviennent ensuite disponibles partout dans le bloc `http` (serveurs virtuels, locations, logs, `map`, `if`, etc.).

### Utilisation dans les logs

Exemple d’un format de log enrichi par la géolocalisation :

```nginx
log_format main_geo '$remote_addr - $remote_user '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    '$geoip2_country_code $geoip2_country_name '
                    '$geoip2_city_name';

access_log /var/log/nginx/access_geo.log main_geo;
```

Ce format permet, par exemple, d’analyser l’origine des clients par pays et ville dans un outil d’analytics.

---

## Restreindre l’accès par pays : `map` et `if`

La combinaison module GeoIP2 + directive `map` permet de construire une variable “politique d’accès” en fonction du pays.  
Cette variable est ensuite utilisée dans un `if` ou dans des blocs `allow/deny`.

### Construction d’une variable via `map`

Dans le bloc `http` :

```nginx
map $geoip2_country_code $allowed_country {
    default         0;      # Tout ce qui n’est pas listé est interdit
    FR              1;      # France autorisée
    BE              1;      # Belgique autorisée
    CH              1;      # Suisse autorisée
}
```

- `$geoip2_country_code` vient du module GeoIP2.  
- `$allowed_country` est une nouvelle variable (0 ou 1) indiquant si le pays est autorisé.

Il est aussi possible de définir plusieurs cartes pour différents services ou vhosts.

### Utilisation dans un bloc `server` avec `if`

Dans un bloc `server` ou `location` :

```nginx
server {
    listen 80;
    server_name exemple.com;

    # Refus générique en fonction de la variable calculée par map
    if ($allowed_country = 0) {
        return 403;   # Interdit pour les pays non listés
    }

    location / {
        root /var/www/exemple;
        index index.html;
    }
}
```

Ce schéma bloque tout le trafic dont le pays n’a pas été marqué comme autorisé dans le `map`.

### Variante : redirection vers page d’information

Au lieu d’un `403`, une redirection dédiée peut être définie :

```nginx
if ($allowed_country = 0) {
    return 302 https://blocked.example.com/geo-restricted;
}
```

---

## Directives `allow` et `deny`

Les directives `allow` et `deny` appartiennent au module `ngx_http_access_module` et permettent de contrôler l’accès sur la base d’adresses IP (ou de plages) et de variables (dont celles fournies par GeoIP2 ou `map`).

### Syntaxe et portée

- Utilisation possible dans les blocs `http`, `server`, `location`, `limit_except`.  
- Ordre d’évaluation séquentiel : la première règle correspondante l’emporte.

Exemples classiques :

```nginx
location /admin {
    deny all;                   # Tout est bloqué par défaut
    allow 192.168.0.0/24;       # Sauf ce sous-réseau
    allow 203.0.113.10;         # Et cette IP précise
}
```

Ordre important : si `deny all` est placé après, il peut annuler les `allow` précédents.

### Combinaison avec GeoIP2

GeoIP2 n’alimente pas directement `allow`/`deny` (qui fonctionnent sur IP/plage), mais la logique suivante est fréquente :

1. Utiliser GeoIP2 + `map` pour définir une variable binaire “autorisé ou non”.  
2. Employer `if` + `return`, ou un `location` dédié, ou encore une variable utilisée dans une directive comme `satisfy`.

Exemple combinant `map` et `allow/deny` pour séparer les règles “pays” et “IP internes” :

```nginx
map $geoip2_country_code $from_eu {
    default 0;
    FR 1;
    DE 1;
    ES 1;
    IT 1;
}

server {
    listen 80;
    server_name portail.example.com;

    # Protection forte sur /admin
    location /admin {
        # 1) Vérifier d’abord l’appartenance à l’UE
        if ($from_eu = 0) { return 403; }

        # 2) Puis appliquer un filtrage IP fin
        deny all;
        allow 192.168.10.0/24;
        allow 203.0.113.42;
    }
}
```

---

## Limiter le nombre de connexions : `limit_conn`

La directive `limit_conn` (module `ngx_http_limit_conn_module`) permet de limiter le nombre de connexions simultanées par clé (souvent par IP client).  
Elle repose sur une zone partagée (directive `limit_conn_zone`) définie au niveau `http`.

### Définir la zone de limitation

```nginx
http {
    # zone de 10 Mo indexée par l’adresse IP
    limit_conn_zone $binary_remote_addr zone=conn_zone:10m;

    # ...
}
```

- `$binary_remote_addr` est la représentation binaire de l’adresse IP cliente (compacte et efficace).  
- `10m` indique la taille mémoire de la zone (10 Mo) pour stocker les compteurs de connexions.

### Application dans `server` ou `location`

```nginx
server {
    listen 80;
    server_name api.example.com;

    # Limite globale par IP, tous endpoints confondus
    limit_conn conn_zone 50;

    location /v1/ {
        # Limite plus stricte pour une ressource sensible
        limit_conn conn_zone 10;
        proxy_pass http://backend_api;
    }
}
```

- `limit_conn conn_zone 50` : 50 connexions simultanées maximum par IP.  
- Un dépassement entraîne une erreur `503 Service Temporarily Unavailable` par défaut (personnalisable).

### Personnalisation de la réponse

Une page d’erreur spécifique peut être fournie :

```nginx
http {
    limit_conn_zone $binary_remote_addr zone=conn_zone:10m;
    # ...
}

server {
    error_page 503 /errors/too_many_connections.html;

    location = /errors/too_many_connections.html {
        root /var/www;
    }

    limit_conn conn_zone 20;
}
```

---

## Limiter le débit des requêtes : `limit_req`

Le module `ngx_http_limit_req_module` limite la fréquence (débit en requêtes par seconde) au lieu du nombre de connexions.  
Il est particulièrement adapté à la protection contre les scans et certains types de DoS applicatifs.

### Déclaration d’une zone de type requête

Dans `http` :

```nginx
limit_req_zone $binary_remote_addr zone=req_zone:10m rate=5r/s;
```

- `rate=5r/s` : 5 requêtes par seconde (en moyenne) par clé.  
- Comme pour `limit_conn`, la clé est généralement `$binary_remote_addr`.

### Application dans `server` / `location`

```nginx
server {
    listen 80;
    server_name app.example.com;

    location /api/ {
        limit_req zone=req_zone burst=10 nodelay;
        proxy_pass http://backend_app;
    }
}
```

- `burst=10` : tolère un “coup de bourre” (jusqu’à 10 requêtes en plus) mis en file d’attente.  
- `nodelay` : sert certaines de ces requêtes immédiatement (pas de mise en attente), ce qui rend la limitation plus douce mais toujours protectrice.

### Variantes par chemin ou par type de client

Il est possible d’avoir plusieurs `limit_req_zone` avec des clés différentes :

```nginx
# 1) Limitation standard par IP
limit_req_zone $binary_remote_addr zone=req_std:10m rate=10r/s;

# 2) Limitation plus stricte sur une clé combinée IP+User-Agent
limit_req_zone "$binary_remote_addr:$http_user_agent" zone=req_ua:10m rate=3r/s;
```

Puis dans les `location` :

```nginx
location /search/ {
    limit_req zone=req_std burst=20;
}

location /login/ {
    limit_req zone=req_ua burst=5 nodelay;
}
```

---

## Limiter la bande passante : `limit_rate` et `limit_rate_after`

La limitation de bande passante contrôle la vitesse de transfert (débit) par connexion.  
Deux directives principales sont utiles : `limit_rate` et `limit_rate_after`.

### Directive `limit_rate`

`limit_rate` définit le débit maximal en octets par seconde pour une connexion :

```nginx
location /downloads/ {
    # 200 ko/s par connexion
    limit_rate 200k;

    root /var/www/files;
}
```

- La valeur peut être en octets, `k` (kilooctets) ou `m` (mégaoctets).  
- Cette limitation agit sur la réponse envoyée au client (pas sur la requête entrante).

### Directive `limit_rate_after`

Permet de “laisser passer” un certain volume à plein débit, puis de brider :

```nginx
location /bigfile/ {
    # À partir de 1 Mo envoyé, brider à 100 ko/s
    limit_rate_after 1m;
    limit_rate       100k;

    root /var/www/files;
}
```

Cette combinaison est intéressante pour :

- accélérer le début de téléchargement (expérience utilisateur) ;  
- réduire l’impact sur le réseau pour les très gros fichiers.

### Limitation par variable

`limit_rate` peut recevoir une variable, ce qui permet une logique conditionnelle (par exemple différente selon le pays, le type d’utilisateur ou l’URL) :

```nginx
map $geoip2_country_code $download_rate {
    default 100k;  # Par défaut 100 ko/s
    FR      500k;  # 500 ko/s pour la France
    DE      300k;  # 300 ko/s pour l’Allemagne
}

server {
    listen 80;
    server_name files.example.com;

    location / {
        limit_rate $download_rate;
        root /var/www/files;
    }
}
```

---

## Configuration pratique du module GeoIP2

### Installation du module et des bases

En pratique, deux étapes sont nécessaires :

1. Installer/activer le module GeoIP2 (via paquet Nginx avec ce module ou compilation avec un module dynamique).  
2. Télécharger les bases MaxMind (souvent GeoLite2) et les placer dans un répertoire lisible par Nginx.

Exemple d’organisation :

```text
/etc/nginx/
├── nginx.conf
└── geoip2/
    ├── GeoLite2-Country.mmdb
    └── GeoLite2-City.mmdb
```

Ensuite, la section vue plus haut dans `http` déclare les bases et les variables.

### Test et validation

Pour vérifier la bonne configuration :

- Ajouter temporairement les variables GeoIP2 dans le log format.  
- Interroger le serveur depuis différentes IP (ou en passant par des proxys/VPN) pour vérifier les codes pays.  
- Utiliser `nginx -t` pour valider la syntaxe et `nginx -s reload` pour recharger.

---

## Mise en cohérence de tous les mécanismes

Une configuration réaliste combine géolocalisation, contrôle d’accès, limitation de connexions, limitation de requêtes et limitation de bande passante.

### Exemple global (schéma de principe)

```nginx
http {
    # 1) GeoIP2
    geoip2 /etc/nginx/geoip2/GeoLite2-Country.mmdb {
        $geoip2_country_code country iso_code;
    }

    # 2) Cartographie pays -> autorisation
    map $geoip2_country_code $allowed_country {
        default 0;
        FR 1;
        BE 1;
        CH 1;
    }

    # 3) Zones de limitation
    limit_conn_zone $binary_remote_addr zone=conn_zone:10m;
    limit_req_zone  $binary_remote_addr zone=req_zone:10m rate=5r/s;

    # 4) Politique de débit par pays
    map $geoip2_country_code $download_rate {
        default 100k;
        FR      500k;
        BE      400k;
    }

    server {
        listen 80;
        server_name service.example.com;

        # 5) Blocage des pays non autorisés
        if ($allowed_country = 0) {
            return 403;
        }

        # 6) Limitation globale connexions et requêtes
        limit_conn conn_zone 30;
        limit_req  zone=req_zone burst=10 nodelay;

        location /api/ {
            proxy_pass http://backend_api;
        }

        location /download/ {
            limit_rate $download_rate;
            root /var/www/files;
        }
    }
}
```

Ce type de configuration :

- laisse entrer uniquement certains pays ;  
- protège le serveur par des plafonds sur connexions et requêtes ;  
- adapte la bande passante à la région de l’utilisateur.

---

## Tableau récapitulatif des directives principales

| Directive            | Module                         | Rôle principal                               | Exemple typique                                       |
|----------------------|--------------------------------|----------------------------------------------|-------------------------------------------------------|
| `geoip2`             | GeoIP2                        | Lier une base MaxMind à des variables        | `geoip2 GeoLite2-Country.mmdb { ... }`               |
| `map`                | `ngx_http_map_module`         | Transformer une variable en autre variable   | Pays → `0`/`1` pour autorisation                     |
| `allow` / `deny`     | `ngx_http_access_module`      | Autoriser/refuser l’accès par IP/plage       | `allow 10.0.0.0/8; deny all;`                        |
| `limit_conn_zone`    | `ngx_http_limit_conn_module`  | Définir zone partagée pour connexions        | `limit_conn_zone $binary_remote_addr zone=...`       |
| `limit_conn`         | `ngx_http_limit_conn_module`  | Plafond de connexions simultanées par clé    | `limit_conn conn_zone 20;`                           |
| `limit_req_zone`     | `ngx_http_limit_req_module`   | Définir zone partagée pour débit de requêtes | `limit_req_zone $binary_remote_addr rate=5r/s;`      |
| `limit_req`          | `ngx_http_limit_req_module`   | Plafond de requêtes par seconde              | `limit_req zone=req_zone burst=10;`                  |
| `limit_rate`         | noyau HTTP                    | Limiter la bande passante par connexion      | `limit_rate 200k;` ou `limit_rate $download_rate;`   |
| `limit_rate_after`   | noyau HTTP                    | Débit limité après un certain volume         | `limit_rate_after 1m;`                               |

---

## Chemin d’apprentissage détaillé proposé

L’apprentissage autour de ces fonctionnalités peut suivre une progression structurée, en partant des bases pour aller vers des scénarios complexes.

### 1. Bases de Nginx et de la configuration

- Compréhension des blocs `events`, `http`, `server`, `location`.  
- Manipulation de la syntaxe (directives, contextes, inclusion de fichiers, `nginx -t`, rechargement).

### 2. Contrôle d’accès simple (`allow` / `deny`)

- Mise en place d’un vhost de test accessible uniquement depuis un sous-réseau local.  
- Tests depuis des IP autorisées et non autorisées.  
- Observation des codes HTTP retournés (403, 404, etc.).

### 3. Introduction à GeoIP2

- Installation du module et récupération des bases GeoLite2.  
- Déclaration de `geoip2` dans `http` et ajout des variables dans les logs.  
- Vérification via logs et outils d’analyse que les pays sont correctement détectés.

### 4. Utilisation avancée de `map` + GeoIP2

- Construction d’une variable d’autorisation (`$allowed_country`).  
- Blocage ou redirection conditionnelle par pays.  
- Scénario : ouverture progressive d’un service à certains pays (liste blanche).

### 5. Limitation des connexions (`limit_conn`)

- Création d’une zone `limit_conn_zone` par IP.  
- Application d’un plafond sur un vhost de test.  
- Utilisation d’outils de charge (ou de scripts curl/boucles) pour provoquer le dépassement et observer le comportement (erreurs 503, logs, etc.).

### 6. Limitation des requêtes (`limit_req`)

- Création d’une zone `limit_req_zone` avec différents `rate` (par exemple 1r/s, 5r/s).  
- Essai sur une API ou un endpoint de test, avec `burst` et `nodelay`.  
- Analyse de l’impact sur des rafales de requêtes (simulations de scans).

### 7. Limitation de bande passante

- Mise en place de `limit_rate` sur une ressource de téléchargement.  
- Tests de téléchargement avec et sans limitation, observation du débit réel (via navigateur ou outil en ligne de commande).  
- Essais avec `limit_rate_after` pour affiner l’expérience utilisateur.

### 8. Combinaisons avancées et scénarios réels

- Construction d’un vhost complet combinant : filtrage par pays, filtrage IP pour `/admin`, `limit_conn` global, `limit_req` sur `/api`, `limit_rate` sur `/download`.  
- Ajout de logs dédiés pour la sécurité (accès refusés, limites atteintes).  
- Intégration éventuelle avec un reverse proxy frontal ou un WAF tiers.

---

Ce corpus couvre les briques essentielles pour “la gestion du trafic” autour de Nginx : géolocalisation, filtrage logique (`map`, `if`, `allow`, `deny`) et limitation des ressources (`limit_conn`, `limit_req`, `limit_rate`).  
Pour approfondir, l’étape suivante consiste à relier ces mécanismes à de la supervision (metrics, logs centralisés) et à des politiques de sécurité globales (WAF, IDS, etc.), en gardant la même logique de configuration déclarative et progressive.
