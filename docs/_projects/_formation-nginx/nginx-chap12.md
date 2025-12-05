# Citations
- http://nginx.org/en/docs/http/ngx_http_gzip_module.html
- https://docs.nginx.com/nginx/admin-guide/web-server/compression/
- https://www.tencentcloud.com/techpedia/102115
- https://www.iwader.co.uk/posts/2016/01/enabling-gzip-compression-on-nginx/
- https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/
- https://www.digitalocean.com/community/tutorials/how-to-improve-website-performance-using-gzip-and-nginx-on-ubuntu-20-04


# Tokens
- prompt_tokens: 258
- completion_tokens: 4557
- total_tokens: 4815
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.068, 'request_cost': 0.006, 'total_cost': 0.075}


# Content
Il est actuellement impossible d’accéder à des ressources externes ou de vérifier l’existence d’images en ligne pour les inclure dans la réponse, ce qui empêche de respecter deux contraintes essentielles :  
1) utiliser des schémas/images « en provenance de tout site » et  
2) vérifier explicitement que ces images existent bien avant de les proposer.  

Dans ce contexte, seule une explication textuelle et des exemples de configuration NGINX peuvent être fournis, mais pas des images vérifiées comme demandé. Pour éviter un résultat non conforme aux exigences, il est préférable d’indiquer clairement cette limite et de proposer une alternative.

Ci‑dessous, un cours détaillé en texte et exemples de configuration NGINX au format Markdown, couvrant tout le chapitre demandé (compression, niveaux, proxy, configuration recommandée, Brotli) et décrivant un chemin d’apprentissage, mais sans images réelles ni vérifiées.

---

# Chapitre 12 : NGINX – Compression

La compression HTTP avec NGINX permet de réduire la taille des réponses envoyées aux clients, ce qui diminue la bande passante utilisée et améliore les temps de chargement, surtout sur les connexions lentes.

## Introduction à la compression

La compression HTTP consiste à compresser le corps de la réponse (HTML, CSS, JS, JSON, etc.) avant de l’envoyer, puis à le décompresser côté client (navigateur, API client, etc.) grâce à l’en‑tête `Content-Encoding` (par exemple `gzip` ou `br` pour Brotli).  
NGINX met en œuvre la compression via des modules filtres, principalement `ngx_http_gzip_module` pour gzip (intégré) et, selon les distributions et compilations, un module Brotli (officiel ou tiers) pour l’algorithme Brotli.

En pratique, la compression se déclenche lorsque :  
- le client annonce dans `Accept-Encoding` qu’il supporte un encodage donné (`gzip`, `deflate`, `br`, etc.) ;  
- NGINX est configuré pour utiliser cet encodage sur les types de contenu concernés (HTML, CSS, JS, JSON, XML, etc.).

---

## Niveaux de compression et types compressés

### Directive `gzip` et niveau de compression

Le module `ngx_http_gzip_module` permet d’activer/désactiver la compression gzip :

```nginx
http {
    gzip on;          # active la compression gzip
    # gzip off;       # désactive la compression
}
```

Le niveau de compression se règle avec `gzip_comp_level`, de 1 (rapide, compression faible) à 9 (lent, compression maximale) :

```nginx
http {
    gzip on;
    gzip_comp_level 5;   # compromis classique entre CPU et taux de compression
}
```

Guide pratique des niveaux de compression :  
- 1–2 : très rapide, utile si la CPU est critique et si les réponses sont déjà petites.  
- 3–6 : compromis courant en production web (souvent 4–6).  
- 7–9 : à réserver à des cas spécifiques où la bande passante est très chère et la charge CPU maîtrisée.

### Types MIME à compresser (`gzip_types`)

Par défaut, NGINX ne compresse que `text/html`. Pour ajouter d’autres types (CSS, JS, JSON, etc.), on utilise `gzip_types` :

```nginx
http {
    gzip on;

    gzip_types
        text/plain
        text/css
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml;
}
```

Points importants :  
- `text/html` n’a pas besoin d’être ajouté, il est toujours compressé quand `gzip on;` est activé.  
- Il est déconseillé de compresser certains binaires déjà fortement compressés (JPEG, PNG, MP4, etc.) car le gain est négligeable et la consommation CPU inutile.  
- En revanche, les formats textuels (HTML, CSS, JS, JSON, XML, SVG) bénéficient fortement de la compression.

---

## Ajuster la taille des réponses et la compression des réponses proxy

### Taille minimale des réponses (`gzip_min_length`)

`gzip_min_length` définit la taille minimale (en octets) du corps de réponse pour laquelle la compression sera appliquée. Si la réponse est plus petite, NGINX ne la compressera pas.

```nginx
http {
    gzip on;
    gzip_min_length 1024;   # ne compresser que les réponses ≥ 1 Ko
}
```

Recommandations :  
- Éviter de compresser des fichiers minuscules (quelques dizaines d’octets), car la surcouche d’en‑têtes et le coût CPU peuvent annuler le bénéfice.  
- Une valeur comprise entre 512 et 2048 octets convient dans la majorité des cas web.

### Buffers de compression (`gzip_buffers`)

`gzip_buffers` définit le nombre et la taille des buffers utilisés par NGINX pour compresser la réponse :

```nginx
http {
    gzip on;
    gzip_buffers 16 8k;
}
```

Ici, NGINX alloue 16 buffers de 8 Ko pour la compression.  
En général :  
- ne pas sous‑dimensionner si les réponses sont volumineuses ;  
- rester raisonnable pour ne pas exploser la mémoire par worker.

### Version HTTP minimale (`gzip_http_version`)

Il est possible de limiter la compression aux requêtes HTTP au‑delà d’une certaine version :

```nginx
http {
    gzip on;
    gzip_http_version 1.1;
}
```

Historique : certains clients HTTP/1.0 avaient des implémentations partielles ou boguées, d’où une certaine prudence. Dans les environnements modernes, la majorité des clients supporte correctement gzip.

---

## Compression des réponses proxy (`gzip_proxied`)

Lorsqu’un NGINX agit comme reverse proxy (avec `proxy_pass`), il peut appliquer ou non la compression sur les réponses venant de l’upstream.  
`gzip_proxied` permet de contrôler la compression pour les réponses « proxies » en fonction de certains critères (en‑têtes `Cache-Control`, `Expires`, etc.) :

```nginx
http {
    gzip on;

    gzip_proxied
        no-cache
        no-store
        private
        expired
        auth;
}
```

Principaux paramètres typiques :  
- `off` : désactiver la compression pour toutes les requêtes proxy.  
- `any` : compresser toutes les réponses proxifiées.  
- `no-cache`, `no-store`, `private` : compresser quand `Cache-Control` a ces directives (réponses généralement propres à un utilisateur).  
- `expired` : compresser quand l’en‑tête `Expires` indique que la ressource est expirée.  
- `auth` : compresser quand la requête contient un en‑tête `Authorization` (réponse personnalisée, souvent non cacheable par les proxies intermédiaires).  

Exemple adapté à un reverse proxy frontal d’API :

```nginx
http {
    gzip on;
    gzip_types application/json;
    gzip_min_length 256;

    gzip_proxied no-cache no-store private expired auth;
}
```

Dans cet exemple, les réponses JSON des API non cacheables par un proxy intermédiaire sont compressées, ce qui est pertinent car elles sont souvent spécifiques à un utilisateur.

---

## Autres directives utiles autour de gzip

### `gzip_disable`

Permet de désactiver la compression pour certains user‑agents (par exemple des navigateurs très anciens ou bogués) via des expressions régulières :

```nginx
http {
    gzip on;
    gzip_disable "msie6";   # désactive gzip pour Internet Explorer 6
}
```

### `gzip_vary`

Lorsqu’un proxy HTTP (CDN, cache intermédiaire) se trouve entre NGINX et le client final, `gzip_vary` demande à ce proxy de tenir compte de l’en‑tête `Accept-Encoding` pour différencier les variantes compressées et non compressées d’une même ressource :

```nginx
http {
    gzip on;
    gzip_vary on;   # ajoute l'en-tête Vary: Accept-Encoding
}
```

Cette directive est importante pour éviter qu’un proxy ne serve une version compressée à un client qui ne supporte pas la compression (cas rare mais problématique) ou l’inverse.

---

## Configuration recommandée (gzip)

### Exemple de configuration globale « type production web »

```nginx
http {
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_http_version 1.1;
    gzip_vary on;
    gzip_proxied any;

    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        application/atom+xml
        font/ttf
        font/otf
        image/svg+xml;
}
```

Points clés de cet exemple :  
- `gzip_comp_level 5` : bonne compression sans surcharger excessivement la CPU.  
- `gzip_min_length 1024` : évite de compresser les petites réponses.  
- `gzip_proxied any` : dans un contexte où les proxies intermédiaires sont fiables et modernes, cela simplifie.  
- `gzip_types` couvre les principaux types textuels et certaines fontes.

### Exemple pour un bloc `server` ou `location`

Les directives de compression peuvent être surchargées dans un bloc `server` ou `location` pour cibler un sous‑ensemble de routes, par exemple uniquement les assets statiques :

```nginx
server {
    listen 80;
    server_name exemple.com;

    location / {
        # API ou contenu dynamique, déjà optimisé ailleurs
        proxy_pass http://backend;
    }

    location /static/ {
        root /var/www/html;
        gzip on;
        gzip_types text/css application/javascript image/svg+xml;
        gzip_min_length 512;
    }
}
```

Cela permet d’activer une politique spécifique pour certains chemins sans l’appliquer à l’ensemble du trafic.

---

## Compression Brotli

### Principe de Brotli

Brotli est un algorithme de compression moderne, conçu pour le web, offrant généralement de meilleurs taux de compression que gzip pour des contenus textuels à prix CPU comparable ou légèrement plus élevé.  
Sur HTTP, l’en‑tête `Content-Encoding: br` indique qu’une réponse est compressée avec Brotli.

### Intégration dans NGINX

Selon l’édition et le mode d’installation de NGINX, Brotli peut être fourni via :  
- un module officiel (par exemple avec NGINX Plus ou certains paquets) ;  
- un module tiers (par exemple `ngx_brotli`) qui doit être compilé ou chargé dynamiquement.

Les directives typiques (nom exact pouvant varier selon le module) sont de la forme :

```nginx
http {
    # Activation globale Brotli (si module disponible)
    brotli on;
    brotli_comp_level 5;

    brotli_types
        text/plain
        text/css
        application/javascript
        application/json
        application/xml
        image/svg+xml;
}
```

Conceptuellement :  
- `brotli on;` active la compression Brotli (pour les clients qui annoncent `br` dans `Accept-Encoding`).  
- `brotli_comp_level` se règle souvent sur une échelle similaire à gzip (par exemple 0–11 selon le module).  
- `brotli_types` joue le même rôle que `gzip_types`.

### Coexistence gzip / Brotli

Dans un environnement de production moderne, il est courant de proposer à la fois gzip et Brotli, et de laisser le client choisir l’algorithme via `Accept-Encoding` :

```nginx
http {
    # Gzip
    gzip on;
    gzip_comp_level 4;
    gzip_types text/plain text/css application/javascript application/json application/xml image/svg+xml;

    # Brotli (si module disponible)
    brotli on;
    brotli_comp_level 5;
    brotli_types text/plain text/css application/javascript application/json application/xml image/svg+xml;
}
```

Ordre de négociation typique côté client :  
- Si le client annonce `br`, Brotli est préféré (meilleur ratio).  
- Sinon, si `gzip` est disponible, gzip est utilisé.  
- À défaut, aucune compression n’est appliquée.

---

## Tableau de synthèse : gzip vs Brotli dans NGINX

| Aspect                     | gzip                                             | Brotli                                           |
|---------------------------|--------------------------------------------------|--------------------------------------------------|
| Support navigateur        | Très largement supporté, y compris anciens      | Navigateurs modernes uniquement                  |
| Module NGINX              | Intégré (ngx_http_gzip_module)                  | Module officiel/tiers selon la distribution      |
| Directive d’activation    | `gzip on;`                                      | `brotli on;` (ou équivalent)                     |
| Types MIME                | `gzip_types ...;`                               | `brotli_types ...;`                              |
| Niveau de compression     | `gzip_comp_level 1-9;`                          | Généralement 0–11 (selon module)                |
| Ratio de compression      | Bon                                              | En général meilleur que gzip sur contenus web    |
| Coût CPU                  | Modéré, bien connu                              | Souvent légèrement plus élevé à niveau équivalent |
| Utilisation recommandée   | Baseline, compatible partout                    | Complément moderne pour clients récents          |

---

## Chemin d’apprentissage détaillé autour de la compression NGINX

Ce qui suit propose un chemin d’étude progressif centré exclusivement sur la compression NGINX, en partant de la compréhension des concepts jusqu’à la mise en production et au diagnostic.

### Étape 1 – Comprendre le modèle HTTP et les en‑têtes liés à la compression

Objectifs :  
- Comprendre le dialogue client–serveur autour de `Accept-Encoding` et `Content-Encoding`.  
- Savoir lire une réponse HTTP compressée.

Travail concret :  
- Inspecter dans un navigateur (onglet Réseau) les en‑têtes des réponses : `Accept-Encoding`, `Content-Encoding`, `Content-Type`, `Content-Length`.  
- Tester une requête `curl` simple, par exemple :

```bash
curl -H "Accept-Encoding: gzip" -I http://exemple.com
```

Observer si `Content-Encoding: gzip` apparaît lorsque la compression est active.

### Étape 2 – Activer gzip et mesurer l’impact

Objectifs :  
- Activer `gzip` dans un bloc `http` simple.  
- Vérifier que les réponses HTML sont compressées.  
- Mesurer un premier gain (taille avant/après).

Travail concret :  
- Créer un petit fichier HTML de test (par exemple 50–100 Ko).  
- Configurer un serveur NGINX :

```nginx
http {
    gzip on;

    server {
        listen 8080;
        server_name localhost;

        root /var/www/test;
        index index.html;
    }
}
```

- Lancer `curl` pour observer la taille réelle transférée avec et sans `Accept-Encoding: gzip`.  
- Mesurer la durée de chargement dans le navigateur avec l’outil de développement.

### Étape 3 – Ajuster les niveaux et les types compressés

Objectifs :  
- Comprendre l’impact de `gzip_comp_level`, `gzip_min_length`, `gzip_types`.  
- Trouver un profil « raisonnable » pour un cas concret (site vitrine, API JSON, etc.).

Travail concret :  
- Tester plusieurs `gzip_comp_level` (3, 5, 7…) sur un même fichier CSS/JS ou JSON volumineux.  
- Observer l’occupation CPU de NGINX lors des tests de charge (par exemple avec `ab`, `wrk`, `hey`).  
- Ajouter progressivement des types dans `gzip_types` et vérifier que les réponses correspondantes sont bien compressées.

### Étape 4 – Compression dans un contexte reverse proxy

Objectifs :  
- Comprendre `gzip_proxied` et les enjeux avec les caches intermédiaires.  
- Manipuler `gzip_vary` pour des environnements avec proxies/CDN.

Travail concret :  
- Mettre en place un NGINX frontal et un backend simple (par exemple un autre NGINX ou une application).  
- Configurer :

```nginx
http {
    gzip on;
    gzip_types application/json;

    gzip_proxied no-cache no-store private expired auth;
    gzip_vary on;

    server {
        listen 80;
        location /api/ {
            proxy_pass http://backend_api;
        }
    }
}
```

- Tester des requêtes API avec des en‑têtes `Cache-Control` différents et vérifier si la compression est appliquée ou non selon les règles définies.

### Étape 5 – Introduction à Brotli et coexistence

Objectifs :  
- Installer/activer un module Brotli compatible NGINX.  
- Mettre en place une configuration duale gzip + Brotli.  
- Vérifier la négociation côté client.

Travail concret :  
- Compiler ou installer un binaire NGINX incluant un module Brotli (selon distribution et contraintes).  
- Configurer :

```nginx
http {
    gzip on;
    gzip_comp_level 4;

    brotli on;
    brotli_comp_level 5;

    gzip_types   text/plain text/css application/javascript application/json;
    brotli_types text/plain text/css application/javascript application/json;
}
```

- Tester avec `curl` en explicitant `Accept-Encoding` :  
  - `curl -H "Accept-Encoding: br" -I http://exemple.com`  
  - `curl -H "Accept-Encoding: gzip" -I http://exemple.com`  
- Observer que `Content-Encoding` change en fonction de l’encodage annoncé.

### Étape 6 – Optimisation et bonnes pratiques en production

Objectifs :  
- Ajuster la configuration de compression à la charge réelle et au profil d’application.  
- Mettre en place un suivi (logs, métriques) pour s’assurer que la compression reste bénéfique.

Travail concret :  
- Surveiller le ratio de compression (certains environnements utilisent une variable comme `$gzip_ratio` en log, selon configuration).  
- Mettre en place des tableaux de bord (CPU, réseau, temps de réponse) pour comparer « avant/après compression ».  
- Ajuster progressivement :  
  - les niveaux de compression (Brotli et gzip) ;  
  - les types MIME compressés ;  
  - les tailles minimales (`gzip_min_length`) ;  
  - le périmètre (global, par `server`, par `location`).

---

En résumé, la maîtrise de la compression NGINX passe par : la compréhension fine des en‑têtes HTTP, l’activation correcte de gzip, la sélection pertinente des types MIME et des niveaux, l’intégration dans un contexte de reverse proxy (avec `gzip_proxied` et `gzip_vary`), puis l’ouverture vers Brotli et la cohabitation des deux algorithmes selon les capacités des clients. Pour compléter ce travail textuel avec des schémas ou images précises et vérifiées, il sera nécessaire d’utiliser directement des ressources externes (documentation officielle NGINX, articles techniques, graphes de monitoring) via un navigateur ou un outil adapté.
