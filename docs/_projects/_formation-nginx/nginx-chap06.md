# Citations
- https://kinsta.com/fr/blog/proxy-inverse/
- https://www.hostinger.com/fr/tutoriels/reverse-proxy-nginx
- https://serverspace.io/fr/support/help/how-to-configure-reverse-proxy-on-ubuntu-server-22-04-using-nginx/
- https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/
- https://www.it-connect.fr/configurer-nginx-en-tant-que-reverse-proxy/
- https://openclassrooms.com/fr/courses/1733551-gerez-votre-serveur-linux-et-ses-services/5236081-mettez-en-place-un-reverse-proxy-avec-nginx
- https://blog.stephane-robert.info/docs/services/web/nginx/
- https://www.hostragons.com/fr/blog/configuration-du-proxy-inverse-nginx-et-equilibrage-de-charge/


# Tokens
- prompt_tokens: 292
- completion_tokens: 4726
- total_tokens: 5018
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.071, 'request_cost': 0.006, 'total_cost': 0.078}


# Content
Nginx permet de jouer le rôle de point d’entrée unique pour plusieurs applications, en agissant comme proxy inverse (reverse proxy) devant des serveurs web, des API ou des services PHP-FPM. Ce chapitre détaille pas à pas la configuration d’un reverse proxy HTTP et FastCGI, les en‑têtes transmis, la mise en tampon (buffering), les délais (timeouts) et le chemin d’apprentissage associé.

> Remarque : un accès direct à des images externes ou à des schémas ne peut pas être garanti dans ce contexte, mais chaque section indique comment rechercher un type de schéma pertinent et comment l’interpréter.

---

## Introduction au proxy inverse

Un proxy inverse est un serveur placé en frontal qui reçoit les requêtes des clients, puis les relaie vers un ou plusieurs serveurs d’origine (backends). Il renvoie ensuite les réponses de ces serveurs au client, qui n’a souvent jamais connaissance de l’adresse réelle des backends.  

Ce rôle de frontal permet de centraliser la terminaison TLS, la réécriture d’URL, la mise en cache, l’authentification, la limitation de débit ou encore la répartition de charge. Nginx est particulièrement adapté à ce rôle grâce à son architecture événementielle, ce qui le rend performant même avec un grand nombre de connexions simultanées.

---

## Chemin d’apprentissage global

L’apprentissage autour du proxy inverse Nginx peut se structurer en plusieurs étapes cohérentes, chaque étape s’appuyant sur la précédente :

1. **Compréhension des blocs de configuration de base**  
   - Bloc `http {}` global et blocs `server {}` virtuels.  
   - Bloc `location` et correspondances d’URI.  
   - Manipulation simple d’un `server_name`, d’un `root`, et des logs d’accès/erreur.

2. **Découverte de la notion de proxy HTTP**  
   - Utilisation de `proxy_pass` dans un `location`.  
   - Observation du rôle de passerelle entre client et backend HTTP.  
   - Tests avec un backend simple (par exemple un serveur HTTP sur un autre port ou une autre machine).

3. **Maîtrise des en‑têtes transmis et complétés**  
   - Découverte de `proxy_set_header`, des variables `$host`, `$remote_addr`, `$proxy_add_x_forwarded_for`, etc.  
   - Compréhension des en‑têtes de traçage (`X-Forwarded-*`) et de leurs implications côté application.

4. **Gestion du buffering et de la taille des réponses**  
   - Étude de `proxy_buffering`, `proxy_buffers`, `proxy_busy_buffers_size`, `proxy_max_temp_file_size`.  
   - Configuration adaptée aux contenus dynamiques, aux gros fichiers ou aux flux.

5. **Configuration des délais (timeouts) et des erreurs**  
   - Utilisation de `proxy_connect_timeout`, `proxy_send_timeout`, `proxy_read_timeout`.  
   - Gestion des codes d’erreur backend avec `proxy_next_upstream`, `error_page`, etc.

6. **Introduction au reverse proxy avancé (upstreams, load-balancing)**  
   - Déclaration de blocs `upstream` pour plusieurs serveurs backend.  
   - Stratégies de répartition simples (round‑robin, ip_hash, etc.) et santé des backends (health‑checks via modules ou solutions externes).

7. **Passer des requêtes à PHP‑FPM avec FastCGI**  
   - Compréhension de FastCGI, rôle de PHP‑FPM, différences avec le proxy HTTP.  
   - Utilisation de `fastcgi_pass`, `fastcgi_param`, et inclusion de fichiers de paramètres (ex. `fastcgi_params` ou `fastcgi.conf`).  
   - Séparation claire entre Nginx (serveur HTTP, reverse proxy) et PHP‑FPM (interpréteur PHP).

---

## Envoyer des requêtes vers d’autres serveurs (proxy_pass)

L’utilisation la plus directe du reverse proxy Nginx consiste à recevoir une requête HTTP sur un domaine/port, puis à la transmettre à un autre serveur HTTP (ou un autre port local) grâce à la directive `proxy_pass`.

### Exemple minimal de reverse proxy HTTP

```nginx
http {
    upstream backend_app {
        server 192.168.1.10:8080;
    }

    server {
        listen 80;
        server_name app.exemple.local;

        location / {
            proxy_pass http://backend_app;
        }
    }
}
```

Dans cet exemple :  
- Le client envoie une requête HTTP vers `app.exemple.local` sur le port 80.  
- Nginx transfère la requête au backend défini dans `upstream backend_app`, ici un serveur HTTP sur `192.168.1.10:8080`.  
- La réponse du backend est renvoyée telle quelle au client.

### Variantes d’URL et comportement de proxy_pass

Le comportement de `proxy_pass` dépend fortement de la présence ou non d’un chemin dans l’URL de destination et de la façon dont le `location` est défini. Deux cas classiques :

1. **Location avec un chemin et proxy_pass avec un chemin**

```nginx
location /api/ {
    proxy_pass http://backend_app/api/;
}
```

- La partie correspondant au `location` (`/api/`) est remplacée par le chemin défini dans `proxy_pass` (`/api/`).  
- L’URI côté backend reste généralement identique (en pratique, la réécriture peut changer selon les combinaisons).

2. **Location avec un chemin et proxy_pass sans chemin**

```nginx
location /api/ {
    proxy_pass http://backend_app;
}
```

- L’URI complète (y compris `/api/…`) est transmise au backend, ce qui change la manière dont le backend voit la requête.  
- Souvent utilisé pour déléguer totalement la structure des URL au backend.

Un schéma conceptuel utile (à rechercher, par exemple “nginx proxy_pass scheme diagram”) représente :  
- En haut : l’URL client (ex. `https://client -> Nginx`),  
- Au centre : le bloc `location` avec la directive `proxy_pass`,  
- En bas : l’URL réellement appelée sur le backend.

---

## Passer des en‑têtes aux serveurs d’origine (proxy_set_header)

Lorsqu’une requête est proxifiée, Nginx peut modifier, supprimer ou ajouter des en‑têtes HTTP envoyés au backend. C’est un rôle essentiel du reverse proxy, notamment pour :

- Propager l’adresse IP réelle du client.
- Indiquer le protocole d’origine (HTTP/HTTPS).
- Passer le nom d’hôte demandé (`Host`) pour la bonne virtualisation côté backend.
- Ajouter des en‑têtes internes (par exemple pour l’authentification ou le routage).

### En‑têtes courants dans un reverse proxy Nginx

```nginx
location / {
    proxy_pass http://backend_app;

    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Explications :  
- `Host` : conserve le nom de domaine appelé par le client, pour que le backend sache quel site ou vhost servir.  
- `X-Real-IP` : transmet l’IP directe du client, utile pour les logs et les règles applicatives.  
- `X-Forwarded-For` : chaîne d’IP (client + proxies intermédiaires), permettant de conserver un historique de passage.  
- `X-Forwarded-Proto` : indique si la requête d’origine était en HTTP ou HTTPS, utile pour les redirections et URL générées côté backend.

### Table de synthèse des principaux en‑têtes de proxy

| Directive             | En‑tête HTTP           | Rôle principal                                           |
|-----------------------|------------------------|----------------------------------------------------------|
| `proxy_set_header`    | `Host`                | Indique au backend le nom d’hôte demandé par le client. |
| `proxy_set_header`    | `X-Real-IP`           | Fournit l’IP réelle du client.                          |
| `proxy_set_header`    | `X-Forwarded-For`     | Liste des IP clients et proxies successifs.             |
| `proxy_set_header`    | `X-Forwarded-Proto`   | Protocole d’origine (http/https).                       |
| `proxy_set_header`    | `X-Forwarded-Host`    | Nom d’hôte original, si besoin de le dissocier.         |
| `proxy_set_header`    | `X-Forwarded-Port`    | Port d’origine côté client.                             |

Un schéma couramment rencontré pour illustrer ces en‑têtes montre une flèche :  
Client → Reverse Proxy (ajout/ajustement des en‑têtes) → Backend, avec des bulles indiquant `X-Real-IP`, `X-Forwarded-For`, etc.

---

## Mise en mémoire tampon des réponses proxy (proxy_buffering)

Nginx peut stocker (bufferiser) temporairement les réponses des backends avant de les envoyer au client. Cette fonctionnalité influe sur :

- La mémoire utilisée et l’écriture disque éventuelle.
- La latence perçue par le client.
- La capacité à effectuer de la mise en cache HTTP ou des transformations sur la réponse.

### Directives clés liées au buffering HTTP

Dans un bloc `location` ou `server` :

```nginx
location / {
    proxy_pass http://backend_app;

    proxy_buffering           on;
    proxy_buffers             8 16k;
    proxy_buffer_size         32k;
    proxy_busy_buffers_size   64k;
    proxy_max_temp_file_size  0;
}
```

Rôle des directives :  
- `proxy_buffering on|off` : active ou désactive la mise en tampon des réponses.  
- `proxy_buffers 8 16k` : nombre et taille des buffers utilisés pour stocker temporairement la réponse.  
- `proxy_buffer_size` : taille du premier buffer, utilisé pour les en‑têtes de réponse.  
- `proxy_busy_buffers_size` : taille maximale des buffers “en cours d’envoi” au client.  
- `proxy_max_temp_file_size` : taille maximale des fichiers temporaires sur disque si la réponse dépasse les buffers mémoire.

Pour des réponses de type API JSON de petite taille, le buffering améliore souvent les performances, car le backend peut répondre rapidement, et Nginx gère l’envoi au client sans mobiliser le backend plus longtemps que nécessaire.  
Pour un gros stream (par exemple un gros fichier ou du streaming vidéo), il peut être utile de désactiver partiellement le buffering ou d’ajuster soigneusement ces paramètres, pour éviter l’utilisation excessive de disque.

---

## Configuration des délais d’attente pour les proxy (timeouts)

Les délais (timeouts) déterminent le temps maximal pendant lequel Nginx attend une opération réseau particulière avant de considérer qu’il y a une erreur. Pour un reverse proxy, trois délais sont essentiels :

```nginx
location / {
    proxy_pass http://backend_app;

    proxy_connect_timeout 5s;
    proxy_send_timeout    30s;
    proxy_read_timeout    30s;
}
```

- `proxy_connect_timeout` : délai maximal pour établir la connexion TCP avec le backend.  
- `proxy_send_timeout` : délai pour envoyer la requête (en‑têtes et corps) au backend.  
- `proxy_read_timeout` : délai pendant lequel Nginx attend des données de réponse du backend avant de couper.

### Tableau récapitulatif des timeouts proxy

| Directive                | Type d’opération                              | Effet pratique                                                  |
|--------------------------|-----------------------------------------------|-----------------------------------------------------------------|
| `proxy_connect_timeout`  | Connexion au backend                          | Évite de rester bloqué si le backend ne répond pas du tout.    |
| `proxy_send_timeout`     | Envoi de la requête au backend               | Protège contre les blocages lors de l’envoi de gros corps.     |
| `proxy_read_timeout`     | Lecture de la réponse backend                | Limite le temps d’attente en cas de backend trop lent.         |

Dans un chemin d’apprentissage, il est utile de simuler un backend lent (par exemple via un script qui dort quelques secondes) pour voir comment ces timeouts affectent les erreurs visibles côté client (erreurs 504 Gateway Timeout, etc.) et comment les logs Nginx les décrivent.

---

## Introduction détaillée à la notion de proxy inverse

Pour consolider la compréhension, il est utile de comparer proxy direct, proxy inverse et “simple” serveur web.

### Tableau : proxy direct vs proxy inverse vs serveur web

| Rôle                 | Client connu du backend ? | Backend visible du client ? | Usage typique                                      |
|----------------------|---------------------------|-----------------------------|----------------------------------------------------|
| Serveur web simple   | Oui                       | Oui                         | Site statique ou dynamique simple.                |
| Proxy direct         | Oui                       | Non                         | Sortie centralisée vers Internet (cache HTTP).    |
| Proxy inverse        | Non (souvent)            | Non                         | Point d’entrée unique, load‑balancing, sécurité.  |

Dans un contexte de reverse proxy Nginx :  
- Le client configure uniquement le domaine (DNS) qui pointe vers Nginx.  
- Nginx a connaissance de tous les backends et gère la répartition ou la simple redirection.  
- Les backends peuvent être isolés dans un réseau privé, inaccessibles directement depuis Internet, ce qui renforce la sécurité.

Un schéma typique (à rechercher : “reverse proxy nginx architecture diagram”) montre :  
Internet → Nginx (reverse proxy) → multiples backends (API, site principal, service d’authentification, etc.).

---

## Envoyer des requêtes vers PHP‑FPM avec FastCGI

Pour le PHP, Nginx ne traite pas le code lui‑même. Il délègue l’exécution à un processus PHP‑FPM via le protocole FastCGI. Nginx agit alors comme reverse proxy FastCGI plutôt que HTTP.

### Configuration de base pour PHP‑FPM

Supposons que PHP‑FPM écoute sur `127.0.0.1:9000` (mode TCP) ou sur un socket Unix. Un bloc Nginx typique :

```nginx
server {
    listen 80;
    server_name php.exemple.local;

    root /var/www/mon_site;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass 127.0.0.1:9000;

        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param SCRIPT_NAME     $fastcgi_script_name;
    }
}
```

Explications importantes :  
- `location ~ \.php$` : ne matche que les requêtes se terminant par `.php`.  
- `fastcgi_pass` : définit l’adresse de PHP‑FPM (TCP ou socket Unix).  
- `include fastcgi_params` : charge un fichier fournissant les variables FastCGI standard (méthode, URI, etc.).  
- `fastcgi_param SCRIPT_FILENAME` : indique à PHP‑FPM quel fichier PHP exécuter.  
- `try_files` dans la location `/` : permet de router vers `index.php` si le fichier demandé n’existe pas (cas courant pour les frameworks et CMS).

### Paramètres FastCGI utiles

En plus de `SCRIPT_FILENAME` et `SCRIPT_NAME`, quelques paramètres sont souvent ajustés :

```nginx
location ~ \.php$ {
    include fastcgi_params;

    fastcgi_pass unix:/run/php/php-fpm.sock;

    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param SCRIPT_NAME     $fastcgi_script_name;
    fastcgi_param HTTPS           $https if_not_empty;
}
```

- Utilisation d’un socket Unix (`unix:/run/php/php-fpm.sock`) pour des performances légèrement meilleures en local.  
- Passage de `HTTPS` à PHP afin que l’application sache si la requête d’origine était sécurisée, même si l’on termine TLS sur Nginx.

### Tableau : proxy HTTP vs FastCGI

| Aspect                 | Proxy HTTP (`proxy_pass`)         | FastCGI (`fastcgi_pass`)                          |
|------------------------|------------------------------------|---------------------------------------------------|
| Protocole              | HTTP/1.1 (ou autre supporté)      | FastCGI (binaire)                                 |
| Cible typique          | Serveur web ou API HTTP           | PHP‑FPM (interpréteur PHP)                        |
| Directives d’en‑têtes  | `proxy_set_header`                 | `fastcgi_param`                                   |
| Fichier de paramètres  | `proxy_params` (optionnel)         | `fastcgi_params` ou `fastcgi.conf`               |
| Rôle principal         | Passerelle HTTP générique         | Exécution de scripts PHP                          |

---

## Exercices et progression pratique

Pour consolider l’apprentissage, une progression pratique peut être structurée ainsi :

1. **Premier reverse proxy HTTP simple**  
   - Mettre en place un backend HTTP (par exemple un petit serveur sur `localhost:8080`).  
   - Créer une configuration Nginx minimaliste avec `proxy_pass`.  
   - Vérifier que les en‑têtes de réponse retournés au client proviennent du backend.

2. **Ajout d’en‑têtes et inspection côté backend**  
   - Ajouter `proxy_set_header` pour `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`.  
   - Côté backend, écrire un script (PHP, Python ou autre) qui affiche les en‑têtes reçus.  
   - Observer comment ces en‑têtes varient si Nginx est appelé en HTTP ou HTTPS.

3. **Expérimentation du buffering**  
   - Configurer `proxy_buffering on/off` et jouer sur `proxy_buffers`, `proxy_buffer_size`.  
   - Tester avec des réponses de tailles différentes (petits JSON, gros fichiers).  
   - Observer dans les logs si des fichiers temporaires sont utilisés.

4. **Tests de timeouts**  
   - Créer un endpoint backend qui répond avec délai (par exemple `sleep 10`).  
   - Réduire `proxy_read_timeout` pour provoquer un timeout côté Nginx.  
   - Analyser les logs et les codes d’erreur.

5. **Mise en place de PHP‑FPM**  
   - Installer PHP‑FPM et vérifier l’écoute (TCP ou socket Unix).  
   - Configurer un site PHP avec `fastcgi_pass` et les bons `fastcgi_param`.  
   - Tester différents scénarios : fichiers inexistants, erreurs PHP, etc., et observer la gestion des erreurs par Nginx.

---

## Comment rechercher et exploiter des schémas utiles

Même si une intégration directe d’images externes ne peut pas être garantie ici, des termes de recherche ciblés permettent de trouver rapidement des schémas adaptés :  

- “nginx reverse proxy basic architecture” pour des schémas montrant client → Nginx → backend.  
- “nginx proxy_pass uri rewriting diagram” pour comprendre la réécriture d’URI.  
- “nginx fastcgi php-fpm diagram” pour visualiser la relation Nginx–FastCGI–PHP‑FPM.  

Ces schémas se lisent en général de gauche à droite (ou de haut en bas), avec le client à gauche/haut, Nginx au centre, et les backends à droite/bas, les flèches montrant le chemin de la requête et de la réponse, parfois avec les en‑têtes ou paramètres ajoutés sur le trajet.

---

En suivant ce chemin d’apprentissage, la compréhension du rôle de Nginx comme proxy inverse, puis comme passerelle vers PHP‑FPM, devient progressive et structurée, tout en s’appuyant sur des configurations concrètes, des tests pratiques et des schémas conceptuels recherchés au besoin.
