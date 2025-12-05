# Citations
- https://webhosting.de/fr/cache-cote-serveur-nginx-apache-guide-performance-turbo/
- https://docs.plesk.com/fr-FR/onyx/administrator-guide/serveurs-web/serveurs-web-apache-et-nginx-linux/activer-la-mise-en-cache-nginx.79185/
- https://www.shpv.fr/blog/nginx-cache/
- https://support.hostpoint.ch/fr/produits/hebergement/questions-frequentes-sur-hebergement/caching-avec-nginx
- https://www.hosteur.com/ressources/aide/p-mise-en-cache-dans-lrequilibreur-nginx
- https://www.f5.com/fr_fr/company/blog/nginx/nginx-caching-guide
- https://www.serverion.com/fr/3cx-hosting-pbx/mastering-nginx-configurations-for-optimal-web-server-performance/
- https://blog.stephane-robert.info/docs/services/web/nginx/
- https://www.nas-forum.com/forum/topic/66132-activer-la-mise-en-cache-nginx/


# Tokens
- prompt_tokens: 281
- completion_tokens: 3940
- total_tokens: 4221
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.059, 'request_cost': 0.006, 'total_cost': 0.066}


# Content
Nginx utilise plusieurs mécanismes de cache (navigateur, proxy, FastCGI…) pour réduire la charge des backends et accélérer la livraison des réponses HTTP. La mise en cache se pilote à la fois par la configuration Nginx et par les en-têtes HTTP émis ou modifiés par le serveur.  

---

## Introduction à la mise en cache

La mise en cache consiste à stocker temporairement des réponses HTTP déjà générées pour les réutiliser lors de requêtes ultérieures équivalentes. Elle intervient à différents niveaux : navigateur, proxy inverse (Nginx), CDN, ou encore cache applicatif interne.  

Avec Nginx, la mise en cache la plus courante est le cache de proxy (proxy_cache) et le cache FastCGI (fastcgi_cache) pour des applications PHP, Python, etc. Ces caches s’appuient sur une zone de mémoire partagée (keys_zone) et un répertoire sur disque pour stocker les objets en cache.  

---

## Concepts essentiels de cache HTTP

Quelques notions fondamentales sont indispensables avant de configurer Nginx :  

- **Clé de cache (cache key)** : c’est la combinaison de variables (schéma, hôte, URI, query string, éventuellement cookies ou headers) qui identifie une ressource en cache.  
- **TTL (Time To Live)** : durée pendant laquelle un objet est considéré valide avant d’être rafraîchi ou supprimé.  
- **Validation du cache** : mécanismes comme ETag ou Last-Modified permettant au client de vérifier si l’objet en cache est toujours à jour via des requêtes conditionnelles (If-None-Match, If-Modified-Since).  

Ces éléments interagissent avec les en-têtes HTTP Cache-Control et Expires, qui indiquent aux clients et aux intermédiaires comment et combien de temps une ressource peut être mise en cache.  

---

## Exemple d’utilisation de Cache-Control et Expires avec Nginx

Les en-têtes `Cache-Control` et `Expires` sont utilisés pour piloter la mise en cache côté navigateur et éventuellement côté proxy ou CDN. Dans Nginx, ces en-têtes se définissent avec `add_header` (pour les réponses générées localement) ou se réécrivent pour les réponses de backend via `proxy_hide_header` et `add_header`.  

### Exemple simple pour fichiers statiques

```nginx
server {
    listen 80;
    server_name exemple.com;

    root /var/www/exemple;

    location /assets/ {
        # Fichiers versionnés (ex: app.abc123.css)
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /images/ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    location / {
        # Pages HTML : courte durée
        expires 60s;
        add_header Cache-Control "public, max-age=60, must-revalidate";
    }
}
```

Dans cet exemple :  

- `expires` génère automatiquement un en-tête `Expires` basé sur l’intervalle spécifié.  
- `Cache-Control` définit explicitement la politique de cache, par exemple `public, max-age=31536000` pour autoriser un cache très long sur les assets versionnés.  

### Exemple en proxy inverse

Pour une application derrière un backend (par exemple un serveur applicatif en 127.0.0.1:8080) :

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080;

    # On ignore certains en-têtes de cache du backend
    proxy_hide_header Expires;
    proxy_hide_header Cache-Control;

    # On impose notre propre politique
    add_header Cache-Control "public, max-age=120";
    expires 2m;
}
```

Ce type de configuration est utile lorsque le backend ne gère pas bien ses en-têtes de cache, ou lorsqu’un contrôle global est souhaité côté reverse proxy.  

---

## Contrôle du cache Nginx (proxy_cache / fastcgi_cache)

Nginx permet de mettre en cache les réponses provenant d’un backend HTTP (proxy_cache) ou FastCGI (fastcgi_cache). Le contrôle se fait en deux étapes : définition du cache global, puis activation dans les blocs `server` / `location`.  

### Définition du cache global

Dans le bloc `http` :

```nginx
http {
    proxy_cache_path /var/cache/nginx levels=1:2
                     keys_zone=STATIC:10m
                     inactive=24h
                     max_size=1g;

    # Pour PHP-FPM, par exemple
    fastcgi_cache_path /var/cache/nginx/fastcgi levels=1:2
                       keys_zone=FCGI:32m
                       inactive=60m
                       max_size=2g;

    include /etc/nginx/conf.d/*.conf;
}
```

- `proxy_cache_path` et `fastcgi_cache_path` définissent le répertoire de cache sur disque, le nombre de niveaux dans l’arborescence, la zone de mémoire et ses limites.  
- `keys_zone=STATIC:10m` crée une zone nommée STATIC avec 10 Mo en RAM pour stocker les métadonnées de cache.  
- `inactive=24h` indique que les entrées non consultées pendant 24 heures sont supprimées.  

### Activation et pilotage du cache

Dans un `server` :  

```nginx
server {
    listen 80;
    server_name exemple.com;

    location / {
        proxy_pass http://backend_app;

        proxy_cache STATIC;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;

        # Clé de cache : schéma + host + URI + query
        proxy_cache_key "$scheme$request_method$host$request_uri";

        # Bypass cache si cookie de session présent
        proxy_cache_bypass $cookie_PHPSESSID;
        proxy_no_cache    $cookie_PHPSESSID;

        # Ajouter un header pour observer le cache
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

- `proxy_cache STATIC` active l’utilisation de la zone de cache STATIC pour ce `location`.  
- `proxy_cache_valid` définit la durée de vie du cache selon le code HTTP.  
- `proxy_cache_bypass` et `proxy_no_cache` permettent d’éviter d’utiliser/mettre en cache les réponses pour certains utilisateurs (par exemple sessions authentifiées).  
- `$upstream_cache_status` peut valoir `HIT`, `MISS`, `BYPASS`, etc., ce qui aide à déboguer.  

### Contrôle avancé via headers

Nginx peut être configuré pour respecter ou ignorer les en-têtes du backend :  

```nginx
location / {
    proxy_pass http://backend;

    # Respecter Cache-Control du backend
    proxy_ignore_headers off;

    # Ou, au contraire, ignorer certains en-têtes
    # proxy_ignore_headers Expires Cache-Control;
}
```

`proxy_ignore_headers` permet de ne pas tenir compte de `Expires`, `Cache-Control`, `Set-Cookie` ou d’autres en-têtes pour décider de la mise en cache.  

---

## Exemple complet de cache serveur (reverse proxy)

Ce qui suit est un exemple de cache serveur assez complet pour un site web dynamique en PHP :  

```nginx
http {
    proxy_cache_path /var/cache/nginx levels=1:2
                     keys_zone=HTMLCACHE:64m
                     inactive=30m
                     max_size=5g;

    server {
        listen 80;
        server_name site.exemple.com;

        # Ne pas mettre en cache les requêtes d'admin ou de login
        location ~* ^/(admin|login) {
            proxy_pass http://php_backend;
            add_header Cache-Control "no-store, private";
        }

        location / {
            proxy_pass http://php_backend;

            proxy_cache HTMLCACHE;
            proxy_cache_valid 200 10m;
            proxy_cache_valid 301 302 1h;
            proxy_cache_valid 404 1m;

            proxy_cache_key "$scheme$host$request_uri";

            # Bypass si utilisateur connecté ou session
            set $nocache 0;
            if ($cookie_PHPSESSID != "") {
                set $nocache 1;
            }
            if ($http_authorization != "") {
                set $nocache 1;
            }

            proxy_no_cache    $nocache;
            proxy_cache_bypass $nocache;

            add_header X-Cache-Status $upstream_cache_status;
        }

        # Assets statiques sans passer par le backend
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$ {
            root /var/www/site/public;
            expires 1y;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
    }
}
```

Ce type de configuration illustre un chemin d’apprentissage pratique :  

1. Distinguer les URLs dynamiques (HTML) et les assets statiques.  
2. Mettre en cache d’abord les réponses les plus simples (statique, stateless), puis affiner côté HTML.  
3. Ajouter progressivement les règles de contournement (bypass) pour les sessions et interfaces d’administration.  

---

## Fonctionnement du cache sur internet

Sur internet, plusieurs niveaux de cache peuvent s’enchaîner :  

- **Cache navigateur** : contrôlé par `Cache-Control`, `Expires` et éventuellement ETag/Last-Modified. Il évite que le client télécharge les ressources à chaque visite.  
- **Cache proxy / reverse proxy (Nginx, HAProxy, Varnish)** : placé entre le client et les serveurs d’application, il stocke les réponses pour réduire la charge serveur et les temps de réponse.  
- **CDN (Content Delivery Network)** : réseau mondial de caches géographiquement distribués, piloté principalement par les en-têtes HTTP provenant de l’origine (Nginx ou autre).  

Le cycle typique est le suivant :  

1. Requête initiale : aucune entrée en cache, la réponse est produite par le backend (MISS).  
2. Stockage : Nginx (ou le CDN) enregistre la réponse dans son cache avec une clé et un TTL.  
3. Requêtes suivantes : la réponse est servie depuis le cache (HIT) tant qu’elle est fraîche.  
4. Expiration ou invalidation : à la fin du TTL ou après purge, Nginx renvoie vers le backend pour mettre à jour le cache.  

### Headers importants dans cette chaîne

- `Cache-Control: public, max-age=...` pour les contenus partageables entre plusieurs utilisateurs.  
- `Cache-Control: private, no-store` pour les contenus personnalisés (espace perso, panier, etc.).  
- `s-maxage` pour fixer une durée spécifique pour les caches partagés (CDN, reverse proxy), différente du cache navigateur.  
- `Vary: Accept-Encoding` (et éventuellement `Vary: Accept-Language`, `Vary: User-Agent`), pour séparer les variantes en fonction de certains en-têtes (gzip, langue, etc.).  

---

## Tableau récapitulatif des directives de cache Nginx

| Élément              | Rôle principal                                                                 | Exemple de configuration                                      |
|----------------------|-------------------------------------------------------------------------------|----------------------------------------------------------------|
| `proxy_cache_path`   | Définir l’emplacement et les paramètres globaux du cache                     | `proxy_cache_path /var/cache/nginx keys_zone=STATIC:10m;`     |
| `proxy_cache`        | Activer/désactiver le cache sur un bloc `location` ou `server`               | `proxy_cache STATIC;`                                         |
| `proxy_cache_valid`  | Durées de vie selon codes HTTP                                               | `proxy_cache_valid 200 10m;`                                  |
| `proxy_cache_key`    | Définition de la clé de cache                                                | `proxy_cache_key "$scheme$host$request_uri";`                 |
| `proxy_cache_bypass` | Ne pas utiliser le cache (mais éventuellement y écrire) selon condition      | `proxy_cache_bypass $cookie_PHPSESSID;`                       |
| `proxy_no_cache`     | Ne pas mettre la réponse en cache si condition vraie                         | `proxy_no_cache $cookie_PHPSESSID;`                           |
| `expires`            | Générer l’en-tête `Expires` et une partie de `Cache-Control`                 | `expires 1h;`                                                  |
| `add_header`         | Ajouter ou forcer des en-têtes de cache (Cache-Control, X-Cache-Status, etc) | `add_header Cache-Control "public, max-age=600";`             |
| `fastcgi_cache_path` | Paramétrer le cache FastCGI                                                  | `fastcgi_cache_path /var/cache/nginx/fastcgi keys_zone=FCGI:32m;` |
| `fastcgi_cache`      | Activer le cache FastCGI sur un bloc                                         | `fastcgi_cache FCGI;`                                         |

---

## Chemin d’apprentissage détaillé autour de la mise en cache Nginx

Un apprentissage progressif et détaillé autour de la mise en cache Nginx peut suivre les étapes suivantes :  

### 1. Bases HTTP et cache navigateur

- Étudier les en-têtes HTTP : `Cache-Control`, `Expires`, `ETag`, `Last-Modified`, `Vary`.  
- Tester les impacts dans un navigateur (DevTools : onglet Network) en modifiant `expires` et `add_header Cache-Control` sur des ressources statiques.  

### 2. Cache de contenu statique dans Nginx

- Configurer des blocs `location` dédiés aux assets (CSS, JS, images) avec `expires` et `Cache-Control`.  
- Introduire la notion de versioning des fichiers (fingerprinting) pour permettre des TTL très longs (`max-age=31536000, immutable`).  

### 3. Proxy reverse avec cache simple

- Mettre en place un reverse proxy basique (`proxy_pass`) sans cache.  
- Ajouter `proxy_cache_path`, `proxy_cache`, `proxy_cache_valid`, puis observer les en-têtes `X-Cache-Status` dans les réponses.  
- Comprendre les états `MISS`, `HIT`, `EXPIRED`, `BYPASS`.  

### 4. Affinage de la clé de cache et des bypass

- Adapter `proxy_cache_key` pour inclure ou exclure certains paramètres de requête (query string).  
- Mettre en place des règles de bypass et de no_cache en fonction des cookies de session, de l’authentification ou de certaines URLs (login, admin).  

### 5. Validation, purge et stale content

- Étudier la différence entre expiration (TTL) et validation conditionnelle (If-None-Match / If-Modified-Since).  
- Mettre en œuvre des règles `proxy_cache_use_stale` pour servir un contenu un peu périmé en cas d’erreur backend, puis rafraîchir en arrière-plan.  
- Explorer les mécanismes de purge (selon la distribution ou un module tiers), ou les stratégies d’invalidation applicative (changement d’URL, versionnement).  

### 6. Intégration avec un CDN et monitoring

- Aligner les en-têtes envoyés par Nginx avec les politiques de cache d’un CDN (durées, `s-maxage`, `Vary`).  
- Mettre en place un monitoring simple : logs Nginx incluant `$upstream_cache_status`, métriques de taille du répertoire de cache, nombre de fichiers, etc.  

---

## Représentation schématique (texte)

Voici deux schémas conceptuels décrits en texte, exploitables pour créer de vrais diagrammes :  

1. **Chaîne de cache classique**  
   - Client → Cache navigateur → CDN → Nginx (reverse proxy + cache) → Backend applicatif → Base de données.  
   - Flèche de retour : si CDN a HIT, la réponse ne remonte pas jusqu’à Nginx ; si Nginx a HIT, la réponse ne remonte pas jusqu’au backend.  

2. **Décision de cache dans Nginx (proxy_cache)**  
   - Étape 1 : Nginx calcule la clé de cache (en fonction du schéma, host, URI, query, éventuellement cookies).  
   - Étape 2 : si condition `proxy_cache_bypass` vraie, Nginx interroge toujours le backend.  
   - Étape 3 : sinon, Nginx cherche l’objet correspondant à la clé ; s’il est frais → HIT, sinon → MISS/EXPIRED et interrogation du backend.  
   - Étape 4 : si `proxy_no_cache` est faux et code HTTP autorisé, la réponse est stockée avec un TTL défini par `proxy_cache_valid` ou par les en-têtes du backend.  

Ces descriptions peuvent servir de base à des schémas ou images, tout en respectant les droits d’auteur des ressources externes.
