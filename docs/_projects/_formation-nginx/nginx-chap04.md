# Citations
- https://blog.stephane-robert.info/docs/services/web/nginx/
- https://blent.ai/blog/a/nginx-tout-savoir
- https://grafikart.fr/tutoriels/nginx-692
- https://datascientest.com/nginx-tout-savoir
- https://www.ionos.fr/digitalguide/serveur/configuration/tutoriel-nginx-premiers-pas-avec-nginxconf/
- https://experienceleague.adobe.com/fr/docs/commerce-operations/configuration-guide/multi-sites/ms-nginx
- https://www.it-connect.fr/cours-tutoriels/administration-systemes/serveur-web/tutoriels-nginx/
- https://www.serverion.com/fr/3cx-hosting-pbx/mastering-nginx-configurations-for-optimal-web-server-performance/
- https://openclassrooms.com/fr/courses/4425101-deployez-une-application-django/4688553-utilisez-le-serveur-http-nginx


# Tokens
- prompt_tokens: 289
- completion_tokens: 5289
- total_tokens: 5578
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.079, 'request_cost': 0.006, 'total_cost': 0.086}


# Content
Nginx est conçu pour être un serveur HTTP très modulaire : la plupart des fonctionnalités utiles à un “simple” serveur Web reposent sur quelques directives clés (server, location, root, index, try_files, return, rewrite, error_page, variables, etc.). L’objectif ci‑dessous est de proposer un parcours d’apprentissage progressif, en expliquant chaque notion en détail, avec des exemples concrets en configuration.  

Les images ou schémas externes ne peuvent malheureusement pas être importés ou vérifiés ici ; en revanche, chaque bloc de configuration est présenté de façon à pouvoir être recopié et testé directement dans un environnement Nginx.

---

## Préambule : structure d’un serveur web Nginx

Un serveur Web Nginx typique pour des fichiers statiques se définit dans un bloc `server` à l’intérieur du bloc `http` de `nginx.conf` (ou d’un fichier inclus, par exemple dans `sites-enabled`).  

Exemple minimaliste :

```nginx
http {
    server {
        listen 80;
        server_name exemple.local;

        root /var/www/exemple;
        index index.html index.htm;

        location / {
            try_files $uri $uri/ =404;
        }
    }
}
```

Dans ce contexte, les notions suivantes seront détaillées :

- Sélection de serveurs (`server_name`, `listen`, ordre de sélection).
- `location` et le routage par URI.
- `root` et son interaction avec `location`.
- `index` pour les fichiers par défaut.
- `try_files` pour tester plusieurs chemins.
- Les variables (standards et personnalisées).
- `return` et les redirections.
- Les réécritures d’URI (`rewrite`).
- Les réécritures de réponses HTTP (filtrage, headers, sous‑requêtes).
- `error_page` pour le traitement fin des erreurs.

---

## La sélection de serveurs

Nginx choisit d’abord un bloc `server` parmi tous ceux disponibles dans le bloc `http`, en fonction de :

- L’adresse/port (`listen`).
- Le nom d’hôte (`Host`) via `server_name`.
- Des règles de priorité (serveur par défaut, correspondances exactes, jokers, regex, etc.).

### Directive listen

```nginx
server {
    listen 80;                # écoute sur 0.0.0.0:80 (toutes les IP IPv4)
    server_name exemple.local;
}
```

Points importants :

- `listen 80;` signifie “toutes les interfaces IPv4 sur le port 80”.
- `listen 127.0.0.1:8080 default_server;` crée un serveur “par défaut” pour cette IP/port.
- Il est possible de combiner IPv4 et IPv6 :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name exemple.local;
}
```

### Directive server_name et ordre de sélection

Le `Host` de la requête HTTP est comparé à `server_name` pour trouver le meilleur match :

```nginx
server {
    listen 80;
    server_name exemple.com www.exemple.com;
    # ...
}

server {
    listen 80;
    server_name api.exemple.com;
    # ...
}
```

Sélection :

- Une requête avec `Host: exemple.com` atterrit dans le premier `server`.
- Une requête avec `Host: api.exemple.com` va dans le deuxième.
- S’il n’y a pas de correspondance, Nginx utilise le `default_server` pour cette adresse/port.

Exemple de serveur par défaut :

```nginx
server {
    listen 80 default_server;
    server_name _;           # convention souvent utilisée
    return 444;
}
```

Parcours d’apprentissage recommandé pour cette partie :

1. Créer deux blocs `server` écoutant sur le même port avec des `server_name` différents.
2. Tester avec `curl -H "Host: ..." http://127.0.0.1/` pour vérifier quel bloc est utilisé.
3. Ajouter ou retirer `default_server` pour voir le comportement en absence de correspondance.

---

## Configuration des emplacements avec location

Une fois le bloc `server` choisi, Nginx sélectionne un bloc `location` en fonction de l’URI. Chaque `location` décrit comment traiter une portion d’URI.

### Types de location

1. **Préfixe simple** : `location /images/ { ... }`
2. **Préfixe exact** : `location = / { ... }`
3. **Regex** :  
   - `location ~ \.php$ { ... }` (sensible à la casse)  
   - `location ~* \.(jpg|jpeg|png)$ { ... }` (insensible à la casse)
4. **Préfixe avec recherche “la plus longue”** : `location /static/ { ... }`

Exemple complet :

```nginx
server {
    listen 80;
    server_name exemple.local;
    root /var/www/exemple;

    # URI exacte "/"
    location = / {
        index index.html;
    }

    # Toutes les URI commençant par /images/
    location /images/ {
        autoindex on;
    }

    # Fichiers .php
    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/run/php/php-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Fichier spécifique
    location = /sante {
        return 200 "OK";
    }

    # Default
    location / {
        try_files $uri $uri/ =404;
    }
}
```

Ordre de sélection :

1. `location =` (exacte) si correspondance.
2. Toutes les `location` préfixes, choisir la plus longue.
3. `location ~` / `~*` si aucune préfixe plus spécifique ne s’applique, selon les règles de priorité.
4. `location /` sert de “fallback” global.

Chemin d’apprentissage :

- Définir une `location /` par défaut, puis ajouter des `location /static/` et `location /images/`.
- Observer quelle `location` est choisie en consultant les logs (`access_log`) avec différents chemins.
- Introduire une `location = /sante` et vérifier qu’elle prend le dessus sur `location /`.

---

## La directive root

`root` définit le répertoire racine du système de fichiers à partir duquel Nginx traduit une URI en chemin réel.

### Portée de root

- `root` peut être déclaré dans le bloc `http`, `server` ou `location`.
- Une définition dans un `location` écrase celle du `server` (pour ce `location`).

Exemple :

```nginx
server {
    listen 80;
    server_name exemple.local;
    root /var/www/exemple;

    location / {
        # root = /var/www/exemple
    }

    location /images/ {
        root /data;   # différent
    }
}
```

Traduction :

- Requête : `GET /index.html`  
  → chemin : `/var/www/exemple/index.html`
- Requête : `GET /images/logo.png`  
  → chemin : `/data/images/logo.png`

### Différence root / alias

Même si `alias` ne fait pas partie explicite de la liste, il est crucial de comprendre sa différence avec `root` :

```nginx
location /images/ {
    root /data;
    # /images/logo.png -> /data/images/logo.png
}

location /photos/ {
    alias /data/images/;
    # /photos/logo.png -> /data/images/logo.png
}
```

- Avec `root`, l’URI complète est concaténée après le chemin.
- Avec `alias`, la partie de l’URI correspondant au préfixe `location` est remplacée par le chemin fourni.

Chemin d’apprentissage :

1. Créer un dossier `/var/www/exemple` avec `index.html` et `images/` à l’intérieur.
2. Modifier `root` au niveau du `server` puis au niveau de `location /images/` pour comprendre la traduction des chemins.
3. Introduire `alias` pour voir la différence avec `root`.

---

## La directive index

`index` définit la liste des fichiers que Nginx essaie automatiquement lorsqu’une URI cible un répertoire (ou une URI se terminant par `/`).

Exemple :

```nginx
server {
    listen 80;
    server_name exemple.local;
    root /var/www/exemple;

    index index.html index.htm index.php;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Comportement :

- Requête : `GET /`  
  → Nginx teste successivement :  
  `/var/www/exemple/index.html`, puis `index.htm`, puis `index.php`.
- Requête : `GET /blog/`  
  → Même logique dans `/var/www/exemple/blog/`.

`index` peut être spécifié par `location` :

```nginx
location /admin/ {
    index admin.html;
}
```

Chemin d’apprentissage :

- Créer plusieurs fichiers d’index (par exemple `index.html` et `index.htm`) et modifier l’ordre dans la directive `index`.
- Supprimer tous les fichiers d’index pour voir le comportement (en général 403 si autoindex désactivé, ou 404/403 selon la config).

---

## La directive try_files

`try_files` permet de tester plusieurs chemins (fichiers ou répertoires) dans un ordre donné et de choisir la première correspondance réelle, sinon de passer à un fallback (URI, code, etc.). C’est un outil clé pour les applications web (SPA, frameworks, etc.).

Exemple typique pour un site statique ou une SPA :

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Explication :

- `$uri` correspond au chemin demandé (par exemple `/css/style.css`).
- `$uri/` permet de tester le même chemin comme répertoire.
- Si aucun fichier n’existe, Nginx sert `/index.html`.

Exemple pour un site dynamique en PHP :

```nginx
location / {
    try_files $uri $uri/ /index.php$is_args$args;
}
```

Ici, si le fichier ou le répertoire n’existe pas, la requête est finalement routée vers `/index.php` avec les paramètres de requête d’origine.

Exemple avec code de retour :

```nginx
location / {
    try_files $uri $uri/ =404;
}
```

Chemin d’apprentissage :

1. Mettre en place `try_files $uri $uri/ =404;` dans `location /`.
2. Créer un sous‑répertoire et vérifier les cas fichiers existants / non existants.
3. Adapter `try_files` pour une SPA (tout renvoyer vers `index.html` sauf les assets statiques).

---

## Les variables

Nginx fournit un ensemble riche de variables intégrées, et il est possible d’en définir via `set` ou des directives comme `map`. Les variables sont utilisables dans de nombreuses directives (`root`, `proxy_pass`, `rewrite`, `log_format`, etc.).

### Variables intégrées courantes

Quelques variables utiles dans un contexte de serveur Web :

- `$uri` : chemin de la requête, normalisé (sans arguments).
- `$request_uri` : URI telle qu’envoyée par le client (avec arguments).
- `$args` : chaîne de paramètres de requête (tout après `?`).
- `$query_string` : alias de `$args`.
- `$host` : valeur du header Host.
- `$server_name` : nom du serveur sélectionné.
- `$document_root` : valeur effective de `root` pour cette requête.
- `$remote_addr` : adresse IP du client.
- `$scheme` : `http` ou `https`.

Exemple d’utilisation dans les logs :

```nginx
http {
    log_format main '$remote_addr - $host [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';

    access_log /var/log/nginx/access.log main;
}
```

### Définir des variables avec set

```nginx
server {
    listen 80;
    server_name exemple.local;

    set $app_env "dev";

    location / {
        add_header X-App-Env $app_env;
        root /var/www/exemple;
    }
}
```

### map pour des comportements conditionnels

`map` permet de créer une variable en fonction d’une autre :

```nginx
http {
    map $http_user_agent $is_bot {
        default 0;
        ~*googlebot 1;
        ~*bingbot 1;
    }

    server {
        listen 80;
        server_name exemple.local;

        location / {
            if ($is_bot) {
                add_header X-Visitor-Type "bot";
            }
        }
    }
}
```

Chemin d’apprentissage :

1. Ajouter des headers custom (via `add_header`) contenant des variables comme `$host`, `$uri`.
2. Utiliser `set` dans un `location` et vérifier la propagation dans les logs ou headers.
3. Introduire `map` pour classifier des requêtes (par exemple, rediriger certains hosts ou UAs).

---

## Retourner des codes et rediriger (directive return)

La directive `return` permet de :

- Renvoyer un code HTTP simple (200, 301, 302, 404, etc.).
- Optionnellement, un texte ou une URL.

### Codes simples

```nginx
location /sante {
    return 200 "OK\n";
}
```

- Nginx envoie un corps simple avec le code 200, sans autre traitement.

### Redirections

```nginx
server {
    listen 80;
    server_name www.exemple.com;

    return 301 http://exemple.com$request_uri;
}
```

- Cette configuration redirige toute requête de `www.exemple.com` vers `exemple.com`, en conservant l’URI.

Autres exemples :

```nginx
location /ancien-chemin {
    return 301 /nouveau-chemin;
}

location /temporaire {
    return 302 /maintenance;
}
```

Remarques :

- `return` est évalué très tôt, souvent plus simple et plus performant que `rewrite` pour les redirections.
- Pour des redirections complexes d’URI, `rewrite` reste parfois nécessaire (voir la section suivante).

Chemin d’apprentissage :

1. Créer un bloc `server` pour `www.exemple.local` qui redirige vers `exemple.local` au moyen de `return 301`.
2. Créer un `location /ancien` renvoyant un 410 (`return 410;`) pour un contenu supprimé.
3. Tester avec `curl -I` pour observer les codes des réponses.

---

## Les réécritures d’URI (directive rewrite)

`rewrite` modifie l’URI de la requête avant le traitement final. Elle fonctionne avec des expressions régulières et peut réaliser des redirections (codes 301/302) ou des réécritures internes.

Syntaxe générale :

```nginx
rewrite regex replacement [flag];
```

- `regex` : expression régulière sur l’URI.
- `replacement` : nouvelle URI (peut contenir des back‑references comme `$1`, `$2`).
- `flag` : options comme `last`, `break`, `redirect` (302), `permanent` (301).

### Réécriture interne (sans redirection visible)

```nginx
location /blog/ {
    rewrite ^/blog/(.*)$ /articles/$1 last;
}
```

- Requête : `/blog/2024/nginx.html`  
  → URI interne transformée en `/articles/2024/nginx.html`  
  → Traitement repris à partir de `/articles/...`.

### Redirections permanentes

```nginx
location /vieux-chemin {
    rewrite ^/vieux-chemin/(.*)$ /nouveau-chemin/$1 permanent;
}
```

- Envoie un code 301 au client.

### URL “propres” pour un script

```nginx
location /app/ {
    rewrite ^/app/(.+)$ /app.php?path=$1 last;
}
```

Chemin d’apprentissage :

1. D’abord, utiliser `return 301/302` pour les redirections simples.
2. Introduire `rewrite` pour des cas où seul un segment d’URI change.
3. Tester la différence entre les flags `last`, `break`, `permanent`, `redirect` en observant les logs et les réponses du serveur.

---

## Les réécritures de réponses HTTP

En mode “serveur Web statique pur”, cette notion concerne surtout :

- La manipulation d’en‑têtes de réponse (via `add_header`, `expires`, etc.).
- La réécriture de certains corps de réponses lorsqu’un module dédié est utilisé (par exemple, substitution de texte avec `sub_filter` lorsque Nginx agit comme reverse proxy).

Pour un usage centré “serveur Web” sans proxy, l’essentiel se trouve dans :

### Ajout ou modification de headers

```nginx
server {
    listen 80;
    server_name exemple.local;

    location / {
        root /var/www/exemple;
        add_header X-Powered-By "Nginx";
        add_header Cache-Control "public, max-age=3600";
    }
}
```

- `add_header` n’ajoute les en‑têtes que si le code de réponse est 200, 204, 301, 302, 303, 304, 307 ou 308 (sauf configuration spécifique type `always`).

Exemple avec `always` (versions récentes) :

```nginx
add_header X-Maintenance "1" always;
```

### Substitution de texte (en reverse proxy)

À titre indicatif :

```nginx
location /proxy/ {
    proxy_pass http://backend;
    sub_filter 'http://' 'https://';
    sub_filter_once off;
}
```

- Permet de réécrire dynamiquement certaines parties du corps de réponse.

Chemin d’apprentissage :

1. Ajouter des en‑têtes personnalisés pour toutes les réponses (par exemple, X‑Env, X‑Version).
2. Définir une politique de cache via `Cache-Control` ou `Expires`.
3. Une fois à l’aise, aborder `sub_filter` quand Nginx sert de reverse proxy.

---

## La directive error_page

`error_page` permet de définir des pages (ou URI) personnalisées pour certains codes d’erreur. Elle est très importante pour l’expérience utilisateur.

### Redirection vers une page statique

```nginx
server {
    listen 80;
    server_name exemple.local;
    root /var/www/exemple;

    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location = /404.html {
        internal;
    }

    location = /50x.html {
        internal;
    }
}
```

Explications :

- `error_page 404 /404.html;` indique à Nginx d’utiliser `/404.html` (URI interne) lorsque le code 404 est généré.
- `internal` signifie que ces URIs ne peuvent pas être appelées directement par le client.

### Utilisation avec codes de retour spécifiques

Il est possible de changer le code de réponse final :

```nginx
error_page 404 =200 /fallback.html;
```

- Une erreur 404 interne peut être “convertie” en 200 avec un contenu différent (utile dans certains cas applicatifs).

### Redirection externe en cas d’erreur

```nginx
error_page 403 404 = @handle_error;

location @handle_error {
    return 302 /maintenance.html;
}
```

Chemin d’apprentissage :

1. Créer des fichiers `404.html` et `50x.html` dans la racine du site.
2. Configurer `error_page` pour 404, 500, 502, etc., et tester les comportements.
3. Observer la différence entre une page d’erreur interne et une redirection explicite.

---

## Chemin d’apprentissage global (sans plan d’étude)

L’enchaînement suivant permet de progresser en profondeur sur Nginx en mode serveur Web :

1. **Mettre en place un seul virtual host simple**  
   - Un bloc `server` avec `listen 80`, `server_name`, `root`, `index`, `location /` minimal.
   - Tester la servitude de fichiers statiques (HTML, CSS, images).

2. **Explorer la sélection de serveurs**  
   - Ajouter un deuxième bloc `server` sur le même port, avec un autre `server_name`.
   - Expérimenter avec `default_server` et observer quel bloc répond à quelle requête.

3. **Travailler sur les `location`**  
   - Créer des emplacements séparés pour `/images/`, `/css/`, `/admin/`.
   - Introduire des `location = /` et des `location ~ \.php$`.
   - Comprendre la logique de “meilleure correspondance”.

4. **Maîtriser `root`, les chemins et `index`**  
   - Déclarer `root` au niveau `server`, puis le surcharger dans un `location`.
   - Modifier la liste `index` et vérifier les priorités des fichiers d’index.

5. **Utiliser `try_files` pour contrôler le routage**  
   - D’abord pour un site statique pour renvoyer 404 proprement.
   - Ensuite pour une application (SPA ou framework) en routant vers un script ou un `index.html`.

6. **Manipuler les variables et les en‑têtes**  
   - Ajouter des en‑têtes de réponse contenant `$host`, `$uri`.
   - Définir des variables avec `set`, puis avec `map`, pour créer des comportements conditionnels.

7. **Gérer les redirections et réécritures**  
   - Employer `return 301` pour forcer le passage HTTP→HTTPS ou `www`→sans `www`.
   - Introduire `rewrite` pour les cas nécessitant des expressions régulières sur l’URI.

8. **Soigner la gestion des erreurs avec `error_page`**  
   - Définir des pages d’erreur 404 et 50x personnalisées.
   - Expérimenter avec des handlers internes (via `location @nom`) et des conversions de codes.

À chaque étape, il est recommandé de :

- Modifier la configuration de Nginx pas à pas.
- Tester avec des outils comme `curl`, un navigateur ou `wget`.
- Consulter systématiquement les logs d’accès et d’erreur pour comprendre le comportement interne.
