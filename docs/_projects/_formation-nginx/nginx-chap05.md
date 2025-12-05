# Citations
- https://www.ib-formation.fr/home/mag/developpement-informatique/apache-nginx-tomcat-panorama-des-serveurs-web
- https://blog.stephane-robert.info/docs/services/web/nginx/
- https://systalink.com/apache-ou-nginx/
- https://blent.ai/blog/a/nginx-tout-savoir
- https://grafikart.fr/tutoriels/nginx-692
- https://www.data-transitionnumerique.com/nginx-tutoriel-complet/
- https://www.dyma.fr/formations/nginx
- https://kinsta.com/fr/blog/qu-est-ce-que-nginx/
- https://www.ai-futureschool.com/fr/programmation/nginx-serveur-web-haute-performance.php
- https://www.f5.com/fr_fr/glossary/nginx


# Tokens
- prompt_tokens: 284
- completion_tokens: 4631
- total_tokens: 4915
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.069, 'request_cost': 0.006, 'total_cost': 0.076}


# Content
Il n’est actuellement pas possible d’accéder au site indiqué ni de vérifier l’existence des images en temps réel, ce qui empêche de produire exactement les schémas et captures demandés ou de s’aligner précisément sur le contenu du blog cité. Toutefois, il reste possible de proposer un parcours détaillé de type “chapitre 5 – études de cas Nginx” en expliquant en profondeur chaque cas (statique / SPA, local / Internet), avec des exemples de configurations Nginx et Docker, des tableaux récapitulatifs et des indications sur les schémas qu’il serait pertinent de réaliser.

---

## Objectif général du chapitre 5

Ce chapitre se concentre sur quatre scénarios concrets autour de Nginx : servir un site statique ou une SPA, d’abord en local avec Docker pour expérimenter, puis sur Internet avec des aspects DNS, HTTPS et durcissement de configuration. L’apprentissage progresse ainsi de la configuration la plus simple (contenu statique local) vers la plus complexe (SPA en production avec HTTPS et optimisations).  

---

## 1. Servir un site statique localement avec Docker

Un site statique est un ensemble de fichiers HTML/CSS/JS et d’assets (images, polices, …) servis directement par Nginx sans logique backend. Ce cas permet de comprendre la configuration minimale d’un `server` Nginx et la façon dont Nginx lit les fichiers sur le disque.  

### 1.1. Structure des fichiers et Dockerfile minimal

Exemple de structure :

```text
projet-site-statique/
  docker/
    Dockerfile
    default.conf
  site/
    index.html
    styles.css
    images/
      logo.png
```

- Dossier `site/` : racine des fichiers statiques.
- Dossier `docker/` : fichiers de configuration et Dockerfile.

Exemple de `Dockerfile` minimal :

```Dockerfile
FROM nginx:alpine

# Copie de la configuration Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Copie du site statique
COPY ../site /usr/share/nginx/html

EXPOSE 80
```

Exemple de configuration `default.conf` :

```nginx
server {
    listen 80;
    server_name _;

    root   /usr/share/nginx/html;
    index  index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 1.2. Lancement du conteneur et tests

Commandes principales :

```bash
cd projet-site-statique/docker

docker build -t site-statique-nginx .
docker run --rm -p 8080:80 site-statique-nginx
```

Le site devient accessible sur `http://localhost:8080`.  
Les points d’apprentissage importants :

- Comprendre le rôle de `root` et `index`.
- Comprendre `try_files` pour renvoyer une 404 propre.
- Distinguer l’intérieur du conteneur (`/usr/share/nginx/html`) de la machine hôte.

### 1.3. Variante avec montage de volume

Pour un cycle de développement rapide, il est préférable de monter le dossier local plutôt que de reconstruire l’image à chaque changement :

```bash
docker run --rm \
  -p 8080:80 \
  -v "$(pwd)/site:/usr/share/nginx/html:ro" \
  nginx:alpine
```

Dans ce cas, on peut utiliser la configuration par défaut de Nginx ou monter un fichier de configuration personnalisé.

### 1.4. Tableau de synthèse – cas statique local

| Élément               | Rôle principal                                      |
|-----------------------|-----------------------------------------------------|
| `root`                | Chemin du contenu statique dans le conteneur       |
| `index`               | Fichier chargé par défaut sur `/`                  |
| `try_files`           | Contrôle de la résolution d’URI et de la 404       |
| Volume Docker         | Partage de fichiers entre hôte et conteneur        |
| Port `-p 8080:80`     | Mapping port hôte → port Nginx dans le conteneur   |

---

## 2. Servir une SPA (React, Vue, Angular) localement avec Docker

Une SPA se distingue d’un site statique classique par l’usage intensif du JavaScript côté client, du routage côté client (URL gérées par le framework), et généralement par une étape de “build” (Webpack, Vite, etc.). Pour Nginx, une SPA reste du statique, mais la gestion des routes nécessite une configuration particulière.  

### 2.1. Workflow typique SPA + Nginx

Étapes générales :

1. Développement de la SPA avec `npm/yarn` (React, Vue, Angular).
2. Build de production (par exemple `npm run build`).
3. Copie du contenu généré (souvent `dist/` ou `build/`) dans l’image Docker Nginx.
4. Configuration Nginx pour rediriger toutes les routes vers `index.html` (sauf pour les assets).

Exemple de structure :

```text
projet-spa/
  app/             # Code source SPA
  docker/
    Dockerfile
    default.conf
```

Après le build front, on obtient un dossier `app/dist` ou `app/build` qui contient le bundle final.

### 2.2. Dockerfile multi-étapes pour SPA

Exemple générique (basé sur Node + Nginx) :

```Dockerfile
# Étape 1 : build de la SPA
FROM node:18-alpine AS build

WORKDIR /app
COPY app/package*.json ./
RUN npm install

COPY app/ .
RUN npm run build

# Étape 2 : image Nginx pour la prod
FROM nginx:alpine

COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Copier le build dans le dossier servi par Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
```

### 2.3. Configuration Nginx pour le routage côté client

Le point clé est la gestion de toutes les routes de la SPA vers `index.html` :

```nginx
server {
    listen 80;
    server_name _;

    root   /usr/share/nginx/html;
    index  index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Exemple de cache simple sur les assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        try_files $uri =404;
        access_log off;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

Rôle de `try_files $uri $uri/ /index.html;` :

- Si le fichier demandé existe, il est servi (images, JS, CSS, etc.).
- Sinon, la requête est redirigée vers `index.html`, ce qui permet au routeur client (React Router, Vue Router…) de gérer l’URL.

### 2.4. Lancement local et tests

Commandes typiques :

```bash
docker build -t spa-nginx .
docker run --rm -p 3000:80 spa-nginx
```

Accès : `http://localhost:3000`.  
Tests pratiques conseillés :

- Accéder à `/`.
- Naviguer vers une route interne de la SPA (ex. `/dashboard`) via l’UI.
- Recharger la page `/dashboard` pour vérifier que `index.html` est bien servi via `try_files`.

### 2.5. Tableau de synthèse – cas SPA local

| Élément                        | Spécificité pour SPA                                      |
|--------------------------------|-----------------------------------------------------------|
| Build front (`npm run build`)  | Génère le dossier statique pour Nginx                    |
| Multi-stage Dockerfile         | Évite d’embarquer Node dans l’image finale               |
| `try_files ... /index.html`    | Permet le routage côté client                            |
| Cache des assets               | Optimise le chargement (JS/CSS/images versionnées)       |
| Port d’exposition              | Accès local via `localhost:<port>`                       |

---

## 3. Servir un site statique sur Internet

Une fois les cas locaux maîtrisés, il devient pertinent de déployer un site statique en ligne. Les points d’apprentissage se déplacent vers : DNS, reverse proxy éventuel, HTTPS, sécurité basique et logs.  

### 3.1. Architecture typique de déploiement

Deux scénarios fréquents :

- Nginx directement exposé sur Internet (VPS, machine cloud) écoutant sur les ports 80 / 443.
- Nginx dans un conteneur derrière un reverse proxy frontal (par exemple Traefik, un autre Nginx ou une passerelle d’hébergement gérée).

Schéma conceptuel simple (décrit textuellement) :

- Navigateur → DNS (résolution de `exemple.com` vers IP publique) → Nginx (ports 80/443) → fichiers statiques sur le disque ou dans le conteneur.

### 3.2. Étapes d’apprentissage proposées

1. **Obtenir un nom de domaine** et configurer un enregistrement A vers l’IP du serveur.
2. **Installer Nginx** (sur la machine ou via Docker).
3. **Déployer les fichiers statiques** dans un dossier (ou volume Docker).
4. **Configurer un `server` pour le domaine**.
5. **Activer HTTPS** avec Let’s Encrypt (certbot classique ou image dédiée).
6. **Activer quelques protections de base** (en-têtes de sécurité, 404/50x custom, logs).

### 3.3. Exemple de configuration Nginx pour site statique public (sans HTTPS)

```nginx
server {
    listen 80;
    server_name exemple.com www.exemple.com;

    root   /var/www/exemple.com/html;
    index  index.html;

    access_log /var/log/nginx/exemple_access.log;
    error_log  /var/log/nginx/exemple_error.log warn;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Éléments à bien comprendre :

- `server_name` : fait le lien entre le nom de domaine et le bloc `server`.
- Emplacement des logs pour diagnostiquer les erreurs.
- `try_files` pour gérer proprement les requêtes.

### 3.4. Ajout d’HTTPS avec Let’s Encrypt

Configuration type avec un redirect HTTP → HTTPS :

```nginx
server {
    listen 80;
    server_name exemple.com www.exemple.com;
    return 301 https://exemple.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name exemple.com www.exemple.com;

    ssl_certificate     /etc/letsencrypt/live/exemple.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/exemple.com/privkey.pem;

    root   /var/www/exemple.com/html;
    index  index.html;

    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Points d’apprentissage :

- Signification de `ssl_certificate` et `ssl_certificate_key`.
- Activation de `http2` et ses bénéfices (multiplexage, meilleure performance).
- En-têtes de sécurité de base et leur intérêt.

### 3.5. Tableau de synthèse – site statique Internet

| Élément                     | Objectif principal                                      |
|-----------------------------|---------------------------------------------------------|
| DNS (`A` / `AAAA`)          | Associer domaine à l’IP du serveur                     |
| `server_name`               | Faire correspondre le site au domaine                  |
| HTTPS (Let’s Encrypt)       | Chiffrement des échanges, confiance utilisateur        |
| En-têtes de sécurité        | Réduire plusieurs vecteurs d’attaque courants         |
| Logs Nginx                  | Diagnostic des erreurs et audit d’accès                |

---

## 4. Servir une SPA (React, Vue, Angular) sur Internet

Ce scénario combine toutes les notions précédentes : SPA, Docker éventuel, HTTPS, optimisations de performance, et protections de base. C’est le cas le plus proche d’un contexte de production.  

### 4.1. Architecture : du navigateur au conteneur

Pour une SPA déployée avec Docker sur un VPS :

- Navigateur → DNS (`app.exemple.com`) → Nginx frontal (hôte ou conteneur reverse proxy) → conteneur Nginx qui sert la SPA (bundle buildé).

Deux modèles possibles :

- **Un seul Nginx** exposé, qui sert directement la SPA.
- **Deux niveaux** : un Nginx ou un proxy frontal (qui gère HTTPS) + un Nginx applicatif en backend (HTTP simple).

Pour simplifier, on peut traiter le cas « un seul Nginx » exposé, intégrant à la fois HTTPS et le service de la SPA.

### 4.2. Exemple de configuration Nginx pour SPA + HTTPS

```nginx
server {
    listen 80;
    server_name app.exemple.com;
    return 301 https://app.exemple.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.exemple.com;

    ssl_certificate     /etc/letsencrypt/live/app.exemple.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.exemple.com/privkey.pem;

    root   /usr/share/nginx/html;
    index  index.html;

    # En-têtes de sécurité courants
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'";

    # Routage SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache des assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        try_files $uri =404;
        access_log off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

Points pédagogiques :

- Affiner la politique CSP en fonction des besoins réels (APIs externes, CDN, etc.).
- Tester les en-têtes de sécurité (via des outils de test en ligne).
- Vérifier qu’une route profonde de la SPA est accessible en accès direct (F5 sur `/dashboard` par exemple).

### 4.3. Intégration Docker pour la SPA en production

Exemple de `docker-compose.yml` minimaliste pour exposer une SPA sur Internet (sans proxy séparé) :

```yaml
version: "3.9"

services:
  spa:
    image: mon-registry/spa-nginx:latest
    container_name: spa-app
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    # éventuellement :
    # environment:
    #   - NGINX_ENV=production
```

Dans un contexte plus avancé, les ports 80/443 seraient exposés par un reverse proxy frontal, et le conteneur de la SPA écouterait uniquement en interne (ex : port 8080, reachable via `proxy_pass http://spa:8080;`).

### 4.4. Chemin d’apprentissage détaillé pour la SPA en production

1. **Réutiliser le projet SPA local** déjà maitrisé.
2. **Tester le build en environnement proche de la production** (Docker local, variables d’environnement, API endpoints).
3. **Déployer sur un serveur de test** avec un domaine de test (ex. `staging.app.exemple.com`), configurer HTTPS, vérifier les en-têtes.
4. **Activer le monitoring de base** : logs Nginx, éventuellement une sonde HTTP (UptimeRobot ou équivalent).
5. **Tester les scénarios d’erreur** (404, 500 proxy si backends, pages de maintenance).
6. **Valider la performance** via des outils comme Lighthouse ou WebPageTest, ajuster Gzip/Brotli, cache static.

### 4.5. Tableau de synthèse – SPA Internet

| Élément                           | Rôle pour la SPA en production                           |
|-----------------------------------|-----------------------------------------------------------|
| HTTPS + HTTP/2                    | Sécurité + performance réseau                            |
| `try_files` SPA                   | Routage client fiable, y compris en accès direct         |
| En-têtes de sécurité (CSP, HSTS)  | Limitation de classes de vulnérabilités courantes        |
| Cache long sur assets            | Réduction du temps de chargement, meilleur score perf    |
| Monitoring / logs                | Détection rapide d’incidents                             |

---

## 5. Schémas et images à produire (guides)

Même si les images en provenance du site indiqué ne peuvent pas être vérifiées, il est possible de lister les types de schémas utiles à créer pour illustrer ce chapitre :

- **Schéma 1 – Site statique local**  
  - Bloc « Navigateurs » → flèche vers « Docker Nginx » → dossier `site` monté en volume.
- **Schéma 2 – SPA locale**  
  - Deux étapes : « Node » (build SPA) → artefacts (`dist/`) → « Nginx dans Docker » qui sert le build.
- **Schéma 3 – Site statique Internet**  
  - « Navigateur » → « DNS » → « Serveur Nginx (VPS) » → système de fichiers.
  - Mention des ports 80/443, de Let’s Encrypt et des logs.
- **Schéma 4 – SPA Internet avec HTTPS**  
  - « Navigateur » → « Nginx frontal » (certificats + règles de sécurité) → « Contenu SPA ».
  - Surligner la logique `try_files` pour les routes `/dashboard`, `/profil`, etc.

Ces schémas peuvent être dessinés avec un outil de diagrammes (PlantUML, Mermaid, draw.io, etc.) et intégrés en Markdown sous forme d’images, à condition de vérifier manuellement leur emplacement et leur accessibilité (chemin, URL ou assets locaux).  

---

## 6. Chemin d’apprentissage global (sans parler de plan d’étude)

L’enchaînement des quatre cas constitue un chemin progressif :

- D’abord, **maîtrise de la configuration minimale** pour du statique local : compréhension de `server`, `root`, `index`, `location`, `try_files`, mapping de ports Docker.
- Ensuite, **extension au cas SPA** : introduction du concept de build front, multi-stage Docker, routage côté client, et début d’optimisation (cache assets).
- Passage au **contexte Internet** : nom de domaine, DNS, exposition sécurisée de Nginx sur les ports 80/443, premières notions de SSL/TLS, en-têtes de sécurité.
- Enfin, **combinaison SPA + Internet** : mise en pratique complète avec build de la SPA, configuration HTTPS, sécurité, performance, et surveillance.

À chaque étape, l’idée est de partir de la configuration fonctionnelle la plus simple, puis d’ajouter progressivement des éléments : logs dédiés, pages d’erreurs personnalisées, headers de sécurité, cache, compression, monitoring et éventuel découpage en plusieurs Nginx (reverse proxy + backends).
