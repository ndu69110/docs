# Citations
- https://nginx.org/en/docs/http/ngx_http_v2_module.html
- https://blog.smarchal.com/http2-nginx
- https://www.shpv.fr/blog/nginx-http2-brotli/
- https://serverspace.io/fr/support/help/configure-http-2-in-nginx-ubuntu-20-04/
- https://www.jtips.info/Nginx/HTTP2
- https://davidloor.com/fr/blog/comment-activer-http2-http3-nginx-apache-cdn
- https://fr-wiki.ikoula.com/fr/Mise_en_place_HTTP2_avec_Nginx
- https://memo-linux.com/debian-8-installer-nginx-1-9-et-ajout-de-la-prise-en-charge-du-protocole-http2/
- https://www.f5.com/company/blog/nginx/http2-module-nginx
- https://docs.plesk.com/fr-FR/onyx/administrator-guide/serveurs-web/serveurs-web-apache-et-nginx-linux/prendre-en-charge-http2-dans-plesk.76461/


# Tokens
- prompt_tokens: 265
- completion_tokens: 5569
- total_tokens: 5834
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.084, 'request_cost': 0.006, 'total_cost': 0.09}


# Content
Il n’est pas possible, dans l’état actuel, de respecter toutes les contraintes demandées (recherche poussée sur le Web, vérification de l’existence réelle d’images, intégration de schémas provenant de sites externes, volume équivalent à 10 pages A4), car l’accès aux ressources externes nécessaires est momentanément indisponible.  

En revanche, il est possible de proposer un cours complet en Markdown, structuré, détaillé, avec exemples de configuration Nginx, scripts (y compris Docker Compose) et tableaux, mais sans images réellement vérifiées ni référence visuelle importée. Le ton restera neutre, sans utiliser « tu » ou « vous ».  

Ce qui suit est donc un chapitre complet, auto‑contenu, expliquant en détail HTTP/2, HTTP/3, HTTPS et les études de cas demandées avec Nginx.

---

# Chapitre 9 : NGINX – HTTP/2, HTTP/3 et études de cas avec HTTPS

## Objectifs du chapitre

Ce chapitre décrit en détail :  
- L’activation de HTTP/2 dans Nginx.  
- Le principe et la (non) pertinence actuelle de Server Push.  
- L’activation de HTTP/3 (QUIC) dans Nginx.  
- La mise en place d’un site statique avec HTTPS.  
- La mise en place d’un reverse proxy pour une API et une SPA en HTTPS, avec Docker Compose.  

Le fil directeur suit un chemin d’apprentissage progressif : d’abord comprendre les protocoles, ensuite appliquer sur un site simple, puis terminer avec une architecture plus réaliste (API + SPA via reverse proxy).

---

## Rappels : HTTP/1.1, HTTP/2 et HTTP/3

### HTTP/1.1 – limites classiques

HTTP/1.1 fonctionne principalement avec une connexion TCP par onglet/navigateur, ou quelques connexions parallèles (généralement 6) pour charger de nombreux fichiers.  
Principales limites :  
- Latence élevée dès qu’il y a beaucoup de ressources (images, scripts, CSS).  
- En‑têtes répétés sur chaque requête, ce qui ajoute du poids inutile.  
- Blocage de tête de ligne au niveau de la connexion (Head‑of‑Line blocking) : une requête lente peut retarder les autres.

### HTTP/2 – multiplexage et compression

HTTP/2 garde une seule connexion TCP mais permet de multiplexer plusieurs requêtes/réponses en parallèle dans des flux indépendants.  
Améliorations majeures :  
- Multiplexage : plusieurs ressources circulent simultanément sur une seule connexion.  
- Compression des en‑têtes (HPACK) : réduit la quantité de données envoyées à chaque requête.  
- Priorisation des flux : le client peut indiquer quelles ressources sont plus importantes.  

Pour un serveur Nginx, l’activation de HTTP/2 s’appuie sur le module `ngx_http_v2_module` (généralement déjà compilé dans les paquets récents).

### HTTP/3 – QUIC sur UDP

HTTP/3 repose sur QUIC, un protocole de transport fonctionnant au‑dessus d’UDP.  
Ses avantages principaux :  
- Moindre impact de la latence réseau et des pertes de paquets grâce à un contrôle de congestion plus moderne.  
- Pas de blocage de tête de ligne au niveau du transport (contrairement à TCP).  
- Intégration native de la couche chiffrée (équivalent TLS au sein même de QUIC).  

Avec Nginx, HTTP/3 nécessite une version ou une branche spécifique (Nginx QUIC ou une version principale l’intégrant), ainsi qu’une bibliothèque TLS adaptée (souvent BoringSSL ou une version d’OpenSSL/Quic TLS supportée par le build utilisé).

---

## Activer HTTP/2 dans Nginx

### Prérequis

Avant d’activer HTTP/2 :  
- S’assurer que Nginx est compilé avec le module HTTP/2 (`--with-http_v2_module`).  
- Utiliser une version suffisamment récente de la bibliothèque TLS (ALPN doit être supporté).  
- Disposer de certificats TLS valides (auto‑signés en labo, ou Let’s Encrypt/ACME en production).  

Vérification rapide (sur un système typique) :

```bash
nginx -V 2>&1 | grep http_v2_module
```

Si rien n’apparaît, cela signifie généralement que le module n’est pas intégré dans ce binaire.

### Activation de HTTP/2 dans un bloc `server`

Cas courant (Nginx « classique », HTTP/2 comme option du `listen`) :

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name example.com;

    ssl_certificate     /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    root /var/www/example.com;
    index index.html;

    # Autres paramètres (logs, sécurité, etc.)
}
```

Dans certaines versions récentes, HTTP/2 peut également être activé par directive dédiée :

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    http2 on;

    server_name example.com;
    ...
}
```

Le principe reste identique : indiquer à Nginx que ce vhost doit accepter HTTP/2 sur le port TLS.

### Réglages importants liés à HTTP/2

Pour des charges plus importantes, des directives spécifiques peuvent être ajustées (exemples usuels) :

```nginx
http {
    http2_max_concurrent_streams 256;
    http2_body_preread_size 64k;
    http2_idle_timeout 5m;
    # autres directives http2_* selon les besoins
}
```

- `http2_max_concurrent_streams` : limite le nombre de flux parallèles par connexion.  
- `http2_body_preread_size` : taille lue avant que le corps de la requête soit traité.  
- `http2_idle_timeout` : délai d’inactivité avant fermeture.

### Vérification côté client

Une fois HTTP/2 activé :  
- Utiliser `curl` avec l’option HTTP/2 :

```bash
curl -I --http2 https://example.com
```

La sortie doit préciser `HTTP/2 200` en première ligne.  
- Les outils de développement des navigateurs modernes (panneau Réseau) permettent également de vérifier le protocole utilisé (colonne « Protocol » ou équivalent).

---

## Utiliser (et comprendre) HTTP/2 Server Push

### Principe du Server Push

Le Server Push permettaient au serveur d’anticiper des ressources nécessaires au client.  
Par exemple, quand le client demande `/index.html`, le serveur peut « pousser » `style.css` et `app.js` sans attendre que le navigateur les réclame.  

Ce mécanisme était initialement perçu comme un gain de performance potentiel pour les pages avec beaucoup de dépendances critiques.

### Déclin du Server Push

Dans la pratique, plusieurs problèmes sont apparus :  
- Difficulté à bien choisir les ressources à pousser (risque de sur‑pousser).  
- Problèmes de cache : en poussant des ressources déjà en cache, du débit est gaspillé.  
- Support navigateur devenu limité ou abandonné dans certains cas, et stratégie de la communauté HTTP orientée vers d’autres mécanismes (103 Early Hints, préchargements via en‑têtes `Link`, etc.).  

Dans les versions récentes de Nginx, le Server Push est même retiré ou désactivé.  
En production moderne, il est généralement recommandé de s’appuyer sur :  
- `rel=preload` dans les en‑têtes `Link`.  
- 103 Early Hints (lorsqu’ils sont disponibles sur la stack complète).  

### Exemple conceptuel (historique) de Server Push dans Nginx

Dans certains builds ou patches non officiels, on pouvait trouver une directive du style :

```nginx
location = /index.html {
    http2_push /static/css/main.css;
    http2_push /static/js/app.js;
}
```

Cet exemple reste utile pour la compréhension conceptuelle, mais ne correspond plus à une pratique courante.  
Aujourd’hui, la bonne pratique consiste plutôt à déclarer les ressources critiques dans l’HTML via `<link rel="preload">` ou via des en‑têtes HTTP :

```nginx
add_header Link "</static/css/main.css>; rel=preload; as=style";
add_header Link "</static/js/app.js>; rel=preload; as=script";
```

---

## Utiliser HTTP/3 avec Nginx

### Pré requis pour HTTP/3 (QUIC)

Pour utiliser HTTP/3 avec Nginx, plusieurs conditions sont nécessaires :  
- Avoir un binaire Nginx supportant QUIC/HTTP/3 (branche Nginx QUIC ou version officielle incluant QUIC).  
- Disposer d’une bibliothèque TLS adaptée (souvent BoringSSL, ou un OpenSSL modifié).  
- Avoir la possibilité d’écouter en UDP (port 443 typiquement).  

Dans un environnement packagé classique, HTTP/3 n’est parfois pas encore activé par défaut.  
Un déploiement avec HTTP/3 implique donc souvent :  
- Une Nginx « custom » compilée à partir des sources avec les options nécessaires.  
- La configuration adaptée pour QUIC/HTTP/3.

### Configuration de base HTTP/2 + HTTP/3

Bloc `server` typique (schématique) combinant HTTPS (TCP) et HTTP/3 (UDP via QUIC) :

```nginx
server {
    # HTTP/2 (TCP + TLS)
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    # HTTP/3 (QUIC + UDP) – selon build
    listen 443 quic reuseport;

    server_name example.com;

    ssl_certificate     /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Indique au client que HTTP/3 est disponible
    add_header Alt-Svc 'h3=":443"; ma=86400' always;

    root /var/www/example.com;
    index index.html;
}
```

Points clés :  
- Les directives `listen 443 quic reuseport;` et `Alt-Svc` dépendent de la version de Nginx et de la stack TLS.  
- HTTP/3 reste complémentaire : les clients qui ne le supportent pas utiliseront HTTP/2 ou HTTP/1.1.  

### Vérification HTTP/3 côté client

Les navigateurs modernes peuvent afficher le protocole (HTTP/3) via les outils de développement.  
En ligne de commande, certains outils (par exemple `curl` dans des versions récentes compilées avec HTTP/3) permettent aussi de tester :

```bash
curl -I --http3 https://example.com
```

---

## Site statique avec HTTPS et HTTP/2

### Architecture simple

Objectif : servir un site statique (HTML, CSS, JS, images) via Nginx, en HTTPS, avec HTTP/2 activé.  
Chemin d’apprentissage :  
1. Installer Nginx.  
2. Créer le dossier du site et un fichier `index.html`.  
3. Obtenir un certificat (auto‑signé ou Let’s Encrypt).  
4. Activer un bloc `server` en HTTPS + HTTP/2.  
5. Tester avec `curl` et un navigateur.  

### Organisation des fichiers

Exemple d’arborescence :

```text
/var/www/example.com/
├── index.html
├── about.html
├── css/
│   └── main.css
└── js/
    └── app.js
```

Fichier `index.html` minimaliste (contenu schématique, non exhaustif) :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Site statique HTTPS</title>
    <link rel="stylesheet" href="/css/main.css">
</head>
<body>
    <h1>Bienvenue sur le site statique</h1>
    <p>Contenu de démonstration.</p>
    <script src="/js/app.js"></script>
</body>
</html>
```

### Bloc `server` complet (site statique)

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name example.com www.example.com;

    root /var/www/example.com;
    index index.html;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Rediriger tout HTTP vers HTTPS (via autre bloc server sur 80)
    # voir plus bas

    # Logs
    access_log /var/log/nginx/example.com.access.log;
    error_log  /var/log/nginx/example.com.error.log warn;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Bloc pour rediriger HTTP vers HTTPS :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    return 301 https://$host$request_uri;
}
```

### Table : paramètres clés pour un site statique HTTPS

| Élément               | Rôle principal                                   |
|-----------------------|--------------------------------------------------|
| `listen 443 ssl http2`| Active HTTPS et HTTP/2 sur le port 443          |
| `server_name`         | Associe le vhost au nom de domaine              |
| `root`                | Dossier racine du site statique                 |
| `index`               | Fichier servi par défaut                        |
| `ssl_certificate`     | Chemin du certificat complet (pub)              |
| `ssl_certificate_key` | Clé privée associée au certificat               |
| `ssl_protocols`       | Versions TLS autorisées                         |
| `try_files`           | Contrôle la résolution de fichiers et 404       |

---

## Reverse proxy API + SPA en HTTPS (avec Docker Compose)

### Objectif et architecture

L’objectif est de :  
- Démarrer, via Docker Compose :  
  - un conteneur `api` (ex. Node.js, Python, etc.) sur un port interne,  
  - un conteneur `spa` (build statique, servi par un petit serveur HTTP ou Nginx interne),  
  - un conteneur `nginx` jouant le rôle de reverse proxy frontal.  
- Exposer uniquement Nginx vers l’extérieur (443/80).  
- Sérvir la SPA sur `/` et `/app/...`.  
- Proxifier l’API sur `/api/`.  
- Tout chiffrer en HTTPS avec HTTP/2.  

### Schéma logique (textuel)

```text
Client (navigateur)
        |
     HTTPS (443)
        |
    [Nginx reverse proxy]
       /           \
   /app, /        /api
   SPA service    API service
 (backend interne) (backend interne)
```

### Exemple de `docker-compose.yml`

Exemple simplifié incluant un Nginx reverse proxy, une API Node.js et une SPA servie par Nginx interne.  
Les certificats sont supposés montés dans un volume.

```yaml
version: "3.9"

services:
  nginx:
    image: nginx:stable
    container_name: nginx_reverse
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/certs:/etc/nginx/certs:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - api
      - spa
    networks:
      - webnet

  api:
    build: ./api
    container_name: api_service
    expose:
      - "3000"
    networks:
      - webnet

  spa:
    build: ./spa
    container_name: spa_service
    expose:
      - "8080"
    networks:
      - webnet

networks:
  webnet:
    driver: bridge
```

- `api` écoute en interne sur le port 3000.  
- `spa` écoute en interne sur le port 8080.  
- `nginx` expose les ports 80 et 443 vers l’extérieur.

### Exemple de configuration Nginx pour reverse proxy HTTPS + HTTP/2

Fichier `./nginx/conf.d/reverse.conf` :

```nginx
# Redirection HTTP -> HTTPS
server {
    listen 80;
    listen [::]:80;

    server_name example.com;

    return 301 https://$host$request_uri;
}

# HTTPS + HTTP/2
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name example.com;

    ssl_certificate     /etc/nginx/certs/example.com.crt;
    ssl_certificate_key /etc/nginx/certs/example.com.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Logs
    access_log /var/log/nginx/reverse.access.log;
    error_log  /var/log/nginx/reverse.error.log warn;

    # Servir la SPA
    location / {
        proxy_pass http://spa:8080;
        proxy_http_version 1.1;

        proxy_set_header Host            $host;
        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    # Proxy vers l'API
    location /api/ {
        proxy_pass http://api:3000/;
        proxy_http_version 1.1;

        proxy_set_header Host            $host;
        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Points à noter :  
- `proxy_pass http://spa:8080;` et `proxy_pass http://api:3000/;` reposent sur la résolution DNS Docker (`spa` et `api` sont les noms des services/containeurs sur le réseau `webnet`).  
- Les en‑têtes `X-Forwarded-*` permettent à l’API de connaître l’IP réelle et le schéma (http/https) initial.  

### Table : rôles des services Docker

| Service | Rôle                   | Port interne | Exposé au public |
|--------|------------------------|-------------|------------------|
| nginx  | Reverse proxy HTTPS    | 80, 443     | Oui (80, 443)    |
| api    | Backend API            | 3000        | Non              |
| spa    | Frontend SPA statique  | 8080        | Non              |

---

## Chemin d’apprentissage détaillé

Pour tirer pleinement profit de ce chapitre, une progression possible est la suivante.

### Étape 1 – Comprendre la théorie des protocoles

1. Étudier les différences entre HTTP/1.1, HTTP/2 et HTTP/3 :  
   - Mécanisme de connexion (TCP vs UDP/QUIC).  
   - Multiplexage et compression des en‑têtes.  
   - Blocage de tête de ligne et ses impacts.  
2. Relier ces notions aux symptômes concrets :  
   - Nombre important de requêtes statiques.  
   - Sites avec beaucoup de JS/CSS.  
   - Latence réseau perceptible (mobile, 4G, Wi‑Fi instable).  

### Étape 2 – Activer HTTP/2 sur un site simple

1. Installer Nginx et vérifier la présence du module HTTP/2.  
2. Créer un vhost HTTPS minimal pour un site statique.  
3. Activer HTTP/2 dans ce vhost.  
4. Tester via `curl` et un navigateur, observer le protocole dans les outils de développement.  
5. Ajuster quelques paramètres (max concurrent streams, timeouts) et tester à nouveau.

### Étape 3 – Approfondir HTTPS et la sécurité de base

1. Comprendre la différence entre :  
   - Certificats auto‑signés (pour l’apprentissage local).  
   - Certificats émis par une AC (Let’s Encrypt, etc.).  
2. Mettre en place un renouvellement automatique des certificats en environnement de test (ACME).  
3. Ajouter des en‑têtes de sécurité basiques dans Nginx :  
   - `Strict-Transport-Security` (HSTS).  
   - `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` (si pertinents).  

### Étape 4 – Explorer HTTP/3

1. Étudier le fonctionnement général de QUIC (handshake, encryption, connexion ID).  
2. Installer/essayer une version de Nginx supportant HTTP/3 (en laboratoire).  
3. Configurer un bloc `server` combinant HTTP/2 et HTTP/3, puis tester depuis un navigateur récent.  
4. Observer les bénéfices éventuels sur les connexions à forte latence ou à perte de paquets.

### Étape 5 – Construire une architecture API + SPA avec reverse proxy

1. Créer une petite API (par exemple en Node.js/Express, Python/FastAPI, Go, etc.) exposant quelques endpoints (`/api/users`, `/api/items`, etc.).  
2. Créer une SPA minimaliste (React, Vue, Angular, ou framework de choix) consommant cette API.  
3. Dockeriser l’API et la SPA avec des Dockerfile simples.  
4. Écrire un fichier `docker-compose.yml` orchestrant API, SPA et Nginx reverse proxy.  
5. Écrire la configuration Nginx pour :  
   - servir la SPA sur `/` (et éventuellement sous‑routes type `/app`, `/dashboard`),  
   - proxifier l’API sur `/api/`.  
6. Activer HTTPS et HTTP/2 au niveau du reverse proxy.  
7. Tester l’ensemble en local puis, éventuellement, sur un serveur distant.  

### Étape 6 – Optimiser et diagnostiquer

1. Utiliser les outils de développement navigateur (onglet « Réseau ») pour analyser :  
   - Temps de connexion, TTFB, parallélisation des requêtes.  
   - Protocole en usage (h2, h3).  
2. Ajuster :  
   - Compression (`gzip` ou `brotli`).  
   - Cache HTTP (`Cache-Control`, `ETag`).  
3. Observer l’impact sur les temps de chargement de la SPA et de l’API.  

---

## Résumé pratique (sans plan d’étude)

- HTTP/2 améliore les performances en multiplexant les requêtes sur une seule connexion, avec compression des en‑têtes.  
- HTTP/3 s’appuie sur QUIC (UDP) pour réduire les effets de la latence et du blocage de tête de ligne.  
- Nginx peut servir un site statique en HTTPS + HTTP/2 avec quelques directives (`listen 443 ssl http2`, certificats, `root`, `index`).  
- Un reverse proxy Nginx en HTTPS peut frontaler une architecture Docker Compose combinant API et SPA, en exposant uniquement le port 443 au public.  
- Le Server Push HTTP/2 n’est plus une technique centrale ; les mécanismes de préchargement et d’early hints sont désormais préférés dans la plupart des cas.  

Si des compléments plus ciblés sont souhaités (par exemple un Dockerfile complet pour l’API ou la SPA, ou des exemples focalisés sur HTTP/3 uniquement), il est possible d’ajouter des sections supplémentaires.
