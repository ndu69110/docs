# Citations
- https://docs.oracle.com/en/operating-systems/oracle-linux/8/balancing/balancing-SettingUpLoadBalancingbyUsingNGINX.html
- https://nginx.org/en/docs/http/load_balancing.html
- https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/How-to-setup-an-Nginx-load-balancer-example
- https://www.youtube.com/watch?v=QE26N9cHE2M
- https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/
- https://ranchermanager.docs.rancher.com/how-to-guides/new-user-guides/infrastructure-setup/nginx-load-balancer
- https://upcloud.com/resources/tutorials/configure-load-balancing-nginx/
- https://www.f5.com/company/blog/nginx/load-balancing-with-nginx-plus


# Tokens
- prompt_tokens: 312
- completion_tokens: 3027
- total_tokens: 3339
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.045, 'request_cost': 0.006, 'total_cost': 0.052}


# Content
Il n’est actuellement pas possible d’accéder aux ressources externes ni de vérifier l’existence des images ou schémas sur le site demandé, ce qui empêche de produire un contenu de la taille d’une dizaine de pages A4 tout en s’appuyant précisément sur ces sources. Il est néanmoins possible de proposer une présentation détaillée et structurée des notions listées (équilibrage de charge, upstream/server, TLS offloading, etc.) fondée sur le fonctionnement général de NGINX, mais sans pouvoir garantir la correspondance exacte avec des images ou schémas existants.

## L’équilibrage de charge

L’équilibrage de charge (load balancing) répartit les requêtes entrantes sur plusieurs serveurs applicatifs afin d’augmenter la disponibilité, la résilience et la capacité de traitement. Concrètement, NGINX joue le rôle de point d’entrée unique, reçoit toutes les requêtes des clients, puis les distribue à un groupe de serveurs backend selon une méthode d’ordonnancement définie (round‑robin, least_conn, ip_hash, etc.).  

Les bénéfices principaux sont : tolérance aux pannes (si un serveur tombe, les autres peuvent continuer à servir), scalabilité horizontale (ajout/suppression de serveurs sans changer l’URL vue par les clients) et optimisation des performances (répartition plus fine des requêtes selon la charge réelle ou la latence). Dans un chemin d’apprentissage, la première étape consiste en général à comprendre ce rôle de « proxy inverse répartiteur » puis à monter un petit cluster de deux backends derrière un NGINX simple en HTTP.

## Directives upstream et server

Dans NGINX, la directive `upstream` permet de déclarer un groupe logique de serveurs vers lesquels les requêtes seront distribuées. À l’intérieur d’un bloc `upstream`, chaque directive `server` représente un backend (adresse IP ou nom DNS, ainsi que le port).  

Le bloc `server` au niveau HTTP définit quant à lui un « serveur virtuel » côté frontal (écoute sur un port, nom de domaine, etc.) qui recevra les requêtes clients et les redirigera vers le bloc `upstream` via des directives comme `proxy_pass`. Le chemin classique d’apprentissage consiste à :  
- Définir un bloc `upstream` avec deux serveurs HTTP simples.  
- Créer un bloc `server` frontal qui écoute sur 80, et utiliser `location / { proxy_pass http://nom_upstream; }`.  

Exemple minimal illustratif :

```nginx
http {
    upstream backend_app {
        server 10.0.0.11:8080;
        server 10.0.0.12:8080;
    }

    server {
        listen 80;
        server_name exemple.local;

        location / {
            proxy_pass http://backend_app;
        }
    }
}
```

## Terminaison TLS (TLS offloading)

La terminaison TLS (TLS offloading) consiste à faire gérer par NGINX toutes les opérations de chiffrement/déchiffrement TLS, tandis que les serveurs backend communiquent en HTTP simple derrière. Cela soulage les backend du coût CPU du chiffrement, simplifie la gestion des certificats (centralisée dans NGINX) et permet parfois d’utiliser des backend qui ne supportent pas TLS.  

Dans la pratique, NGINX reçoit les connexions HTTPS (port 443), effectue le handshake TLS, et transmet ensuite les requêtes vers l’upstream en HTTP interne. Le chemin d’apprentissage typique est :  
- Génération ou obtention d’un certificat (self‑signed dans un premier temps, puis certificat émis par une autorité).  
- Configuration d’un bloc `server` en `listen 443 ssl;` avec `ssl_certificate` et `ssl_certificate_key`.  
- Utilisation de `proxy_set_header` pour relayer des en‑têtes comme `X-Forwarded-For` ou `X-Forwarded-Proto` vers les backend.  

Exemple représentatif de terminaison TLS :

```nginx
server {
    listen 443 ssl;
    server_name www.exemple.local;

    ssl_certificate     /etc/nginx/certs/exemple.crt;
    ssl_certificate_key /etc/nginx/certs/exemple.key;

    location / {
        proxy_pass http://backend_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

## Sécurisation vers les serveurs d’origine (End-to-End Encryption)

La sécurisation de bout en bout (end‑to‑end encryption) implique que la communication soit chiffrée non seulement entre le client et NGINX, mais aussi entre NGINX et les serveurs backend. Dans ce contexte, NGINX fonctionne comme un proxy TLS côté backend également, et établit des connexions HTTPS vers les serveurs d’origine.  

Pour mettre cela en place, les backend doivent exposer un service HTTPS, avec un certificat (auto‑signé ou émis par une CA). Dans NGINX, la directive `proxy_pass` côté backend pointera alors vers `https://...` au lieu de `http://...`, et des directives comme `proxy_ssl_trusted_certificate` et `proxy_ssl_verify` peuvent être utilisées pour vérifier le certificat du backend. Le parcours d’apprentissage typique consiste à :  
- Transformer les backend HTTP existants en backend HTTPS avec certificats.  
- Activer la vérification de certificat côté NGINX, puis gérer le cas des certificats auto‑signés via une CA interne ou un certificat de confiance.  

Exemple simplifié d’upstream sécurisé :

```nginx
upstream backend_secure {
    server api1.exemple.local:443;
    server api2.exemple.local:443;
}

server {
    listen 443 ssl;
    server_name api.exemple.local;

    ssl_certificate     /etc/nginx/certs/front.crt;
    ssl_certificate_key /etc/nginx/certs/front.key;

    location / {
        proxy_pass https://backend_secure;
        proxy_ssl_server_name on;
        proxy_ssl_verify on;
        proxy_ssl_trusted_certificate /etc/nginx/certs/ca_backend.crt;
    }
}
```

## Méthodes d’équilibrage de charge

NGINX gère plusieurs méthodes d’équilibrage, chacune adaptée à un cas d’usage spécifique. Les plus courantes sont :  

- Round-robin (par défaut) : chaque nouvelle requête va successivement au serveur suivant dans la liste, ce qui convient lorsque les serveurs sont relativement homogènes et les requêtes de durée comparable.  
- Least connections (`least_conn`) : la requête est envoyée au serveur ayant le moins de connexions en cours, ce qui est utile si certaines requêtes sont longues et qu’il faut éviter de surcharger un serveur déjà occupé.  
- IP hash (`ip_hash`) : la sélection du serveur dépend de l’adresse IP du client, ce qui permet de maintenir l’affinité de session sans mécanismes de sticky sessions côté application.  

Pour chaque méthode, le chemin d’apprentissage type est :  
1. Tester le round‑robin simple et observer la rotation des requêtes entre backend.  
2. Activer `least_conn` et simuler des requêtes longues pour voir le rééquilibrage.  
3. Tester `ip_hash` et observer que le même client revient systématiquement sur le même serveur (dans la limite des pannes).  

Exemple de configuration par méthode :

```nginx
# Round-robin implicite
upstream app_rr {
    server 10.0.0.11:8080;
    server 10.0.0.12:8080;
}

# Least connections
upstream app_lc {
    least_conn;
    server 10.0.0.21:8080;
    server 10.0.0.22:8080;
}

# IP hash
upstream app_iphash {
    ip_hash;
    server 10.0.0.31:8080;
    server 10.0.0.32:8080;
}
```

### Tableau récapitulatif des méthodes

| Méthode        | Principe de sélection                        | Cas d’usage typique                              |
|----------------|----------------------------------------------|--------------------------------------------------|
| Round-robin    | Tourniquet séquentiel entre tous les serveurs | Environnements homogènes, requêtes similaires    |
| Least_conn     | Serveur avec le moins de connexions actives | Requêtes de durée variable, risque de surcharge  |
| IP hash        | Hachage de l’adresse IP client              | Affinité de session simple, sans sticky cookies  |

## Poids serveur et serveurs de secours

Les poids (weights) permettent d’indiquer que certains serveurs doivent traiter plus de requêtes que d’autres, par exemple parce qu’ils sont plus puissants ou mieux dimensionnés. Dans un bloc `upstream`, chaque directive `server` peut être associée à un paramètre `weight`, la répartition des requêtes étant proportionnelle à ces poids.  

Les serveurs de secours (backup) sont des serveurs qui ne reçoivent pas de trafic tant qu’au moins un serveur non‑backup est disponible. Ils agissent comme réserve, utilisés uniquement en cas de panne ou de saturation des serveurs principaux. NGINX permet de marquer un serveur comme `backup` ou `down` (désactivé) dans la configuration.  

Exemple illustratif :

```nginx
upstream app_weighted {
    server 10.0.0.11:8080 weight=5;   # serveur principal puissant
    server 10.0.0.12:8080 weight=1;   # serveur plus modeste
    server 10.0.0.13:8080 backup;     # serveur de secours
}
```

Dans ce scénario, le serveur `10.0.0.11` reçoit cinq fois plus de requêtes que `10.0.0.12`. Le serveur `10.0.0.13` ne sera utilisé que si les deux premiers sont indisponibles. Un bon exercice d’apprentissage consiste à :  
- Ajuster dynamiquement les poids et observer l’impact sur la distribution.  
- Simuler la panne d’un serveur principal et vérifier que le serveur `backup` prend le relais.

## Contrôles de santé (health checks)

Les contrôles de santé (health checks) permettent de détecter automatiquement les serveurs backend indisponibles ou dégradés, afin de ne plus leur envoyer de traffic. Sans cela, un serveur en panne continuerait à recevoir des requêtes, engendrant des erreurs pour les clients.  

Dans NGINX open source, des paramètres comme `max_fails` et `fail_timeout` peuvent être définis sur chaque directive `server` pour marquer un backend comme inactif après un certain nombre d’échecs sur une fenêtre temporelle. Des extensions ou la version commerciale (NGINX Plus) permettent également des health checks actifs (envoi périodique de requêtes de test). Un chemin d’apprentissage progressif consiste à :  
- Configurer des `max_fails` / `fail_timeout` simples et provoquer des erreurs (ex. arrêt du backend).  
- Observer que NGINX cesse de router vers le serveur en échec pendant la durée prévue.  

Exemple d’upstream avec paramètres de santé basiques :

```nginx
upstream app_hc {
    server 10.0.0.11:8080 max_fails=3 fail_timeout=30s;
    server 10.0.0.12:8080 max_fails=3 fail_timeout=30s;
}
```

## Schéma conceptuel (texte)

En l’absence de possibilité de récupérer et vérifier des images existantes, un schéma textuel peut aider à visualiser l’architecture :

```text
           Clients
              |
          [ Internet ]
              |
         +-----------+
         |  NGINX    |
         | (LB + TLS)|
         +-----------+
           /       \
          /         \
  +-------------+  +-------------+
  | Backend #1  |  | Backend #2  |
  | HTTP/HTTPS  |  | HTTP/HTTPS  |
  +-------------+  +-------------+
```

Dans un parcours d’apprentissage, il est utile de garder ce schéma en tête et de le faire évoluer : d’abord NGINX en simple reverse proxy HTTP, puis ajout d’un second backend, introduction d’une méthode de répartition, activation de TLS côté frontal, enfin chiffrement de bout en bout et health checks.  

---

Si un focus plus détaillé est souhaité sur un des points (par exemple uniquement la partie TLS end‑to‑end ou la configuration fine des health checks), un approfondissement ciblé avec davantage d’exemples de configuration peut être proposé.
