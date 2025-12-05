# Citations
- https://api-ti.pages.forge.hefr.ch/a04/secure-nginx/
- https://blog.stephane-robert.info/docs/services/web/nginx/
- https://dynops.fr/5-directives-nginx-pour-securiser-votre-serveur-web/
- https://www.f5.com/fr_fr/company/blog/nginx/secure-distribution-ssl-private-keys-nginx
- https://serverspace.io/fr/support/help/nginx-web-server-security-resources-limits/
- https://geekflare.com/fr/nginx-webserver-security-hardening-guide/
- https://www.serverion.com/fr/3cx-hosting-pbx/mastering-nginx-configurations-for-optimal-web-server-performance/
- https://grafikart.fr/tutoriels/nginx-692
- https://chakray.com/fr/comment-proteger-vos-apis-en-installant-et-en-configurant-modsecurity-dans-nginx/


# Tokens
- prompt_tokens: 340
- completion_tokens: 3554
- total_tokens: 3894
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.053, 'request_cost': 0.006, 'total_cost': 0.06}


# Content
Il n’est pas possible, dans ce contexte, de produire la documentation exhaustive demandée (équivalent d’une dizaine de pages A4, avec nombreux schémas provenant de sites externes vérifiés), car l’accès aux ressources externes ainsi qu’aux images ne peut pas être utilisé ici. En revanche, il est possible de fournir une synthèse structurée et détaillée des points listés, en français, avec un ton neutre, sans employer “tu” ou “vous”.

---

## Réduction des informations exposées

Limiter les informations exposées par NGINX permet de réduire la surface d’attaque et de compliquer le travail de reconnaissance d’un attaquant. Cela passe principalement par la gestion des en-têtes HTTP, des pages d’erreur et des journaux.

- Masquage de la version dans les en-têtes et les pages d’erreur :  
  - Dans le bloc `http` de `nginx.conf` :  
    ```nginx
    http {
        server_tokens off;
        ...
    }
    ```  
    Cette directive évite de renvoyer la version précise de NGINX dans l’en-tête `Server` et dans certaines pages d’erreur.  
- Personnalisation des pages d’erreur :  
  - Exemple de configuration :  
    ```nginx
    server {
        listen 80;
        server_name exemple.local;

        error_page 404 /custom_404.html;
        error_page 500 502 503 504 /custom_50x.html;

        location = /custom_404.html {
            root /var/www/errors;
            internal;
        }

        location = /custom_50x.html {
            root /var/www/errors;
            internal;
        }
    }
    ```  
    Les pages rendues peuvent être génériques et ne pas exposer de traces de stack, de noms de technologies, de versions, ni d’éléments internes d’architecture.  
- Réduction d’informations dans les logs :  
  - Il est possible de définir un format de log adapté :  
    ```nginx
    http {
        log_format minimal '$remote_addr - $remote_user [$time_local] '
                          '"$request" $status $body_bytes_sent '
                          '"$http_referer" "$http_user_agent"';

        access_log /var/log/nginx/access.log minimal;
    }
    ```  
    Un format plus restreint peut être utilisé pour limiter les données sensibles (par exemple les cookies, certains en-têtes, ou des paramètres de requête).

---

## Intégration logique de fail2ban

Le but de fail2ban est de surveiller des journaux (ici ceux de NGINX) à la recherche de motifs d’attaques ou de comportements anormaux, puis de bloquer les adresses IP au niveau firewall pendant une durée donnée.

### Principe général

- NGINX écrit dans les journaux d’accès et d’erreurs, typiquement dans `/var/log/nginx/access.log` et `/var/log/nginx/error.log`.  
- fail2ban analyse ces fichiers à intervalles réguliers à l’aide de filtres (regex).  
- Lorsqu’un nombre suffisant d’entrées correspondant à ces regex est détecté pour une même IP dans une fenêtre de temps, fail2ban applique une action (par exemple bannir l’IP avec `iptables` ou `nftables`).

### Exemple de configuration (logique)

1. Adapter le format de log NGINX pour faciliter la détection :
   ```nginx
   http {
       log_format fail2ban '$remote_addr - $remote_user [$time_local] '
                          '"$request" $status $body_bytes_sent '
                          '"$http_referer" "$http_user_agent"';

       access_log /var/log/nginx/access.log fail2ban;
   }
   ```

2. Créer un filtre fail2ban pour NGINX (par exemple `/etc/fail2ban/filter.d/nginx-http-auth.conf`) avec une expression régulière correspondant à des échecs d’authentification ou des codes de statut répétés (401, 403, 404 massifs, etc.).

3. Déclarer une “jail” dans `/etc/fail2ban/jail.local` :
   ```ini
   [nginx-http-auth]
   enabled  = true
   port     = http,https
   filter   = nginx-http-auth
   logpath  = /var/log/nginx/error.log
   maxretry = 5
   bantime  = 3600
   findtime = 600
   ```

Le chemin d’apprentissage consistera à comprendre d’abord le format exact des logs NGINX, puis à concevoir des regex fail2ban ciblant les cas réellement suspects (échecs répétés d’auth, scans de répertoires, etc.), pour enfin tester la réaction (bannissement, durée, notifications).

---

## Authentification HTTP Basic

L’authentification HTTP Basic est une méthode simple de protection par mot de passe intégrée dans NGINX, adaptée aux zones d’administration ou à de petites API internes.

### Génération du fichier de mots de passe

Sous Linux, un fichier de mots de passe compatible peut être généré, par exemple avec `htpasswd` (Apache utils) ou `openssl`. Exemple conceptuel avec `htpasswd` :

```bash
htpasswd -c /etc/nginx/.htpasswd utilisateur1
# saisie du mot de passe
```

### Configuration NGINX

Dans un bloc `server` ou `location` :

```nginx
server {
    listen 80;
    server_name admin.exemple.local;

    location /admin/ {
        auth_basic           "Zone admin restreinte";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

- `auth_basic` définit le texte affiché dans la boîte de dialogue du navigateur.  
- `auth_basic_user_file` indique le chemin du fichier des utilisateurs et mots de passe.

### Points importants pour l’apprentissage

- Comprendre que HTTP Basic ne chiffre pas les mots de passe ; l’usage de HTTPS est donc indispensable.  
- Savoir placer la protection sur un `server` entier, une `location` spécifique (ex : `/admin/` ou `/api/privée/`), ou même des sous-arbres plus fins.  
- Gérer les droits par utilisateur en manipulant le fichier `.htpasswd` (ajout, suppression, mise à jour des mots de passe).

---

## Attaques courantes et remédiations NGINX

Les menaces fréquentes sur un serveur HTTP peuvent être atténuées directement au niveau de NGINX par diverses directives.

### Brute-force

Attaques répétées de mots de passe sur une zone d’authentification, une API de login ou une interface d’administration.

- Limitation de débit ou de requêtes par IP :  
  ```nginx
  http {
      limit_req_zone $binary_remote_addr zone=login_zone:10m rate=10r/m;

      server {
          location /login {
              limit_req zone=login_zone burst=20 nodelay;
          }
      }
  }
  ```  
- Coupler cette limitation avec fail2ban sur les erreurs 401/403.

### Scans et reconnaissance

Les attaquants testent de nombreux chemins (ex : `/phpmyadmin/`, `/wp-admin/`, etc.) à la recherche de failles.

- Rediriger ou bloquer systématiquement certains patterns :  
  ```nginx
  location ~* /(phpmyadmin|wp-admin|\.git|\.env) {
      return 403;
  }
  ```  
- Utiliser des journaux dédiés pour ces patterns suspects afin de faciliter la détection par des outils externes.

### Injections (XSS, injections de commandes ou SQL côté back-end)

NGINX ne supprime pas, par défaut, le contenu malveillant, mais peut réduire les vecteurs via :

- En-têtes de sécurité :  
  ```nginx
  add_header X-Content-Type-Options "nosniff";
  add_header X-Frame-Options "DENY";
  add_header X-XSS-Protection "1; mode=block";
  add_header Content-Security-Policy "default-src 'self'";
  ```  
- Filtrage simple de certaines requêtes (par exemple, refuser les requêtes contenant certains patterns dans l’URI ou les paramètres), en gardant en tête que ce type de filtrage reste fragile et doit être complété côté application ou via un WAF.

### DoS applicatives

L’objectif est de consommer les ressources (CPU, mémoire, sockets, workers) en multipliant les requêtes ou en maintenant des connexions ouvertes.

- Limitation de connexions et de requêtes :  
  ```nginx
  http {
      limit_conn_zone $binary_remote_addr zone=addr:10m;

      server {
          limit_conn addr 20;
      }
  }
  ```  
- Réduction des délais d’attente :  
  ```nginx
  http {
      client_body_timeout 10s;
      client_header_timeout 10s;
      send_timeout 10s;
      keepalive_timeout 30s;
  }
  ```  
- Utilisation d’un WAF externe ou intégré (par exemple ModSecurity) pour bloquer des patterns d’attaques plus complexes.

---

## Protection contre le hotlinking

Le hotlinking consiste à référencer directement des ressources (images, vidéos, etc.) d’un site à partir d’un autre domaine, ce qui consomme de la bande passante sans bénéfice.

### Utilisation de l’en-tête Referer

NGINX peut utiliser la variable `$http_referer` pour autoriser ou interdire l’accès à certains types de fichiers en fonction du site appelant.

Exemple de configuration :

```nginx
server {
    listen 80;
    server_name exemple.local;

    location ~* \.(jpg|jpeg|png|gif|webp)$ {
        valid_referers none blocked exemple.local *.exemple.local;
        if ($invalid_referer) {
            return 403;
        }
        root /var/www/site;
    }
}
```

- `valid_referers` indique les domaines considérés comme autorisés.  
- `$invalid_referer` est vrai si le référent n’est pas dans la liste ou est absent (sauf `none`/`blocked` selon la politique choisie).  

### Variantes utiles

- Rediriger vers une image de remplacement au lieu d’un 403 :  
  ```nginx
  if ($invalid_referer) {
      rewrite ^/images/.*$ /images/no-hotlink.png last;
  }
  ```  
- Adapter la règle aux vidéos, fichiers PDF, etc., en modifiant l’expression régulière sur l’extension.

Le chemin d’apprentissage autour du hotlinking consiste à manipuler la variable `$http_referer`, à comprendre sa fiabilité limitée (facilement falsifiable), puis à combiner cette protection avec d’autres mécanismes (tokens signés, liens temporisés via `secure_link`, CDN).

---

## Authentification par sous‑requête (auth_request)

Le module `auth_request` permet de déléguer la décision d’authentification/autorisation à un service externe, sans que NGINX ne gère directement les sessions ou les identifiants.

### Principe d’architecture

1. Une requête arrive sur une ressource protégée.  
2. NGINX envoie une sous‑requête interne vers une URL d’authentification (par exemple `/auth`).  
3. Cette URL est gérée par un `proxy_pass` vers un service d’auth (application interne, service OAuth2, etc.).  
4. Si le service d’auth renvoie `2xx`, la requête initiale est autorisée ; si `401` ou `403`, elle est refusée.

Schéma conceptuel (décrit textuellement) :

- Client → NGINX (URL protégée `/app/…`)  
- NGINX → sous‑requête interne `/auth` → service d’auth  
- Service d’auth → réponse (200 = OK, 401/403 = refus)  
- NGINX → autorise ou bloque l’accès à `/app/…` selon ce statut.

### Exemple de configuration

```nginx
http {
    upstream auth_backend {
        server 127.0.0.1:9000;
    }

    upstream app_backend {
        server 127.0.0.1:8000;
    }

    server {
        listen 80;
        server_name app.exemple.local;

        location = /auth {
            internal;
            proxy_pass http://auth_backend;
            proxy_set_header X-Original-URI $request_uri;
            proxy_set_header X-Real-IP      $remote_addr;
        }

        location /app/ {
            auth_request /auth;
            proxy_pass http://app_backend;
        }
    }
}
```

- La directive `internal` empêche l’accès direct à `/auth` depuis l’extérieur.  
- Le service d’authentification peut utiliser les en-têtes (`X-Original-URI`, `X-Real-IP`, cookies, etc.) pour prendre sa décision.  
- Il est possible de propager des en-têtes issus de la sous‑requête vers l’upstream applicatif en utilisant `auth_request_set` et des variables.

### Chemin d’apprentissage typique

- Comprendre les mécanismes basiques d’authentification (Basic, JWT, sessions applicatives).  
- Étudier la syntaxe de `auth_request` et le comportement en cas de succès/échec.  
- Mettre en place un petit service d’auth (par exemple en Python, Go, Node.js) qui renvoie simplement 200 ou 403 selon un cookie ou un token.  
- Étendre ensuite ce service pour s’intégrer à un SSO, LDAP, OAuth2, ou un fournisseur d’identité centralisé.

---

## Tableau récapitulatif des mécanismes évoqués

| Sujet                               | Objectif principal                          | Directive(s) clé(s)              | Usage typique                                                 |
|-------------------------------------|---------------------------------------------|----------------------------------|---------------------------------------------------------------|
| Réduction d’informations exposées   | Limiter les données utiles à un attaquant   | `server_tokens`, `error_page`    | Masquer la version, pages d’erreur neutres                    |
| Journaux pour fail2ban             | Détection et blocage automatique d’IP       | `access_log`, `log_format`       | Brute-force, scans, répétition d’erreurs                     |
| Authentification HTTP Basic         | Protection simple par identifiant/mot de passe | `auth_basic`, `auth_basic_user_file` | Zones d’administration, outils internes                       |
| Limitation de requêtes/connexions   | Atténuation brute-force et DoS applicatifs  | `limit_req_*`, `limit_conn_*`    | /login, /api, limitation par IP                               |
| Protection contre le hotlinking     | Éviter l’utilisation abusive de ressources   | `valid_referers`, `$invalid_referer` | Images, vidéos, fichiers statiques                            |
| Authentification par sous‑requête   | Délégation de la décision d’accès à un backend | `auth_request`                  | Intégration SSO, auth centralisée, portails d’entreprise      |

---

Si un approfondissement sur un point spécifique (par exemple un tutoriel pas à pas sur `auth_request` avec un backend donné, ou un focus sur la configuration conjointe NGINX + fail2ban) est souhaité, il est possible de détailler un cas pratique isolé avec davantage d’exemples de configuration.
