# Citations
- https://angristan.fr/configurer-https-nginx/
- https://blog.stephane-robert.info/docs/services/web/nginx/
- https://www.it-connect.fr/nginx-ajouter-un-certificat-ssl-lets-encrypt-pour-passer-en-https/
- https://pro-domo.ddns.net/blog/tutoriel-configuration-nginx-https-letsencrypt-certbot.html
- https://nfrappe.fr/doc/doku.php?id=tutoriel%3Ainternet%3Anginx%3Assl%3Aautosigne%3Astart
- https://www.ionos.fr/digitalguide/serveur/configuration/tutoriel-nginx-premiers-pas-avec-nginxconf/
- https://www.youtube.com/watch?v=bgkFqkqWHLQ
- https://www.f5.com/fr_fr/company/blog/nginx/setting-up-nginx
- https://grafikart.fr/tutoriels/nginx-692
- https://forum.hacf.fr/t/acces-de-l-exterieur-en-https-avec-nginx-proxy-manager/1761


# Tokens
- prompt_tokens: 283
- completion_tokens: 4773
- total_tokens: 5056
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.072, 'request_cost': 0.006, 'total_cost': 0.078}


# Content
Il est impossible, dans le cadre actuel, de garantir l’usage des ressources externes demandées (notamment le site datascientest.com) ni de vérifier l’existence d’images précises ; seules des explications générales et des exemples originaux peuvent être fournis, sans reprise de contenus protégés. L’exposé ci‑dessous propose donc un cours complet, structuré et détaillé sur la sécurisation HTTPS avec NGINX, en respectant ces contraintes.

---

## Objectifs du chapitre

Ce chapitre vise à comprendre en profondeur le fonctionnement de HTTPS dans NGINX, depuis la configuration de base jusqu’aux optimisations modernes : choix des protocoles, des suites de chiffrement, activation de HSTS, mise en place de l’OCSP stapling et compréhension du handshake TLS et de la chaîne de certificats. L’approche suit un chemin d’apprentissage progressif : partir d’un simple virtual host HTTPS, renforcer peu à peu la configuration, puis analyser ce qui se passe “sous le capot”.

---

## Utiliser HTTPS avec NGINX

### Principe général

HTTPS est HTTP encapsulé dans TLS : le navigateur et le serveur établissent d’abord une connexion chiffrée, puis échangent les requêtes et réponses HTTP à l’intérieur de ce tunnel sécurisé. L’activation de HTTPS dans NGINX repose principalement sur le module `ngx_http_ssl_module`, la présence d’un certificat et d’une clé privée, et l’écoute sur le port 443.

### Chemin d’apprentissage

1. Comprendre la différence HTTP / HTTPS (port 80 vs 443, chiffrement, certificat).
2. Générer ou obtenir un certificat (auto‑signé, AC interne, Let’s Encrypt, AC commerciale).
3. Créer un premier bloc `server` minimal en HTTPS.
4. Mettre en place la redirection HTTP → HTTPS.
5. Tester avec un navigateur et des outils en ligne de commande (curl, openssl).

### Exemple : bloc HTTP + redirection vers HTTPS

```nginx
# Bloc HTTP (port 80) : uniquement pour rediriger vers HTTPS
server {
    listen      80;
    server_name exemple.com www.exemple.com;

    # Redirection permanente vers HTTPS
    return 301 https://$host$request_uri;
}
```

Points clés de cet exemple :

- `listen 80;` indique l’écoute sur le port HTTP standard.
- La directive `return 301` renvoie immédiatement le client vers la même URL en HTTPS.
- Cette redirection garantit que tout le trafic passe ensuite par le canal chiffré.

### Exemple : premier bloc HTTPS minimal

```nginx
server {
    listen              443 ssl http2;
    server_name         exemple.com www.exemple.com;

    # Chemins vers le certificat et la clé privée
    ssl_certificate     /etc/ssl/certs/exemple.com.fullchain.pem;
    ssl_certificate_key /etc/ssl/private/exemple.com.key;

    # Racine du site
    root /var/www/exemple.com;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Éléments à noter :

- `listen 443 ssl http2;` active TLS et HTTP/2 sur le port 443.
- `ssl_certificate` pointe en général vers la chaîne complète (certificat du serveur + intermédiaire).
- `ssl_certificate_key` doit rester strictement confidentielle.

---

## Configuration avancée de HTTPS

Une fois HTTPS fonctionnel, l’étape suivante consiste à renforcer la sécurité et les performances. Cela implique le choix des protocoles TLS, des suites de chiffrement, la gestion des sessions TLS, et éventuellement la configuration d’options avancées comme les courbes ECDH ou les tickets de session.

### Étapes d’apprentissage

1. Comprendre les versions de TLS (TLS 1.0–1.3) et les faiblesses des anciennes versions.
2. Savoir ce qu’est une “cipher suite” et pourquoi certaines sont obsolètes.
3. Ajuster progressivement la configuration en s’appuyant sur des profils “modernes” ou “intermédiaires”.
4. Tester le site avec des outils d’analyse TLS (par exemple, services de type “SSL Labs”).

### Directives TLS typiques

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;

# Exemple de suites de chiffrement "modernes"
ssl_ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256';
```

Explications :

- `ssl_protocols` limite les versions acceptées de TLS, en excluant SSLv3, TLS 1.0 et 1.1 souvent considérés comme obsolètes.
- `ssl_prefer_server_ciphers on;` demande au serveur d’imposer son ordre préféré de suites de chiffrement.
- `ssl_ciphers` définit précisément les suites autorisées (pour TLS 1.2) ; pour TLS 1.3, la liste est gérée séparément et dépend de la version d’OpenSSL.

### Gestion des sessions TLS

Les sessions TLS peuvent être réutilisées pour éviter un handshake complet à chaque connexion, ce qui améliore les performances.

```nginx
ssl_session_cache   shared:SSL:10m;
ssl_session_timeout 5m;
ssl_session_tickets off;
```

- `ssl_session_cache shared:SSL:10m;` stocke les sessions dans une zone mémoire partagée.
- `ssl_session_timeout 5m;` définit la durée de vie d’une session.
- `ssl_session_tickets off;` désactive les tickets de session côté client lorsqu’ils ne sont pas gérés de manière sûre (clé de ticket non régulièrement renouvelée).

---

## HTTP Strict Transport Security (HSTS)

### Concept

HSTS (HTTP Strict Transport Security) est un en‑tête envoyé par le serveur qui indique au navigateur de ne plus jamais contacter le site en HTTP simple pendant une durée donnée. Une fois l’en‑tête pris en compte, même si l’utilisateur saisit `http://exemple.com`, le navigateur convertit en `https://exemple.com` sans passer par une redirection visible.

### Chemin d’apprentissage

1. Comprendre la logique de HSTS et son impact sur la sécurité (protection contre le downgrade HTTP et certaines attaques de type “SSL stripping”).
2. Tester HSTS sur un environnement de pré‑production avec une faible durée (`max-age` courte).
3. Augmenter progressivement `max-age`.
4. Éventuellement, étendre HSTS aux sous‑domaines et au mode “preload”, en comprenant bien les implications à long terme.

### Exemple : en‑tête HSTS simple

```nginx
add_header Strict-Transport-Security "max-age=31536000" always;
```

- `max-age=31536000` indique une durée d’un an en secondes.
- Le mot‑clé `always` s’assure que l’en‑tête est envoyé même lors de réponses d’erreur.

### Variante : HSTS étendu

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

Explications :

- `includeSubDomains` applique HSTS à tous les sous‑domaines.
- `preload` indique que le domaine se déclare compatible pour être ajouté aux listes HSTS intégrées dans les navigateurs.
- Avant d’utiliser cette directive, il est essentiel de s’assurer que *tout* le domaine (et les sous‑domaines) sera durablement accessible en HTTPS uniquement, sous peine de rendre certains services inaccessibles.

---

## Agrafage OCSP (OCSP Stapling)

### Rôle de l’OCSP

OCSP (Online Certificate Status Protocol) permet aux clients de vérifier si un certificat n’a pas été révoqué. Sans OCSP stapling, le navigateur contacte directement le serveur OCSP de l’autorité de certification pour vérifier le statut du certificat, ce qui ajoute une latence et une dépendance. Avec l’OCSP stapling, c’est NGINX qui interroge périodiquement le serveur OCSP, puis inclut (“agraphe”) la réponse signée dans la poignée de main TLS.

### Chemin d’apprentissage

1. Comprendre la notion de révocation de certificats (CRL, OCSP).
2. Vérifier que le certificat provient d’une AC supportant OCSP.
3. Configurer NGINX pour pointer vers la chaîne de certificats “de confiance”.
4. Activer puis tester l’OCSP stapling avec des outils de diagnostic.

### Exemple de configuration OCSP stapling

```nginx
server {
    listen              443 ssl http2;
    server_name         exemple.com;

    ssl_certificate     /etc/ssl/certs/exemple.com.fullchain.pem;
    ssl_certificate_key /etc/ssl/private/exemple.com.key;

    # Chaîne de certificats de confiance (root + intermédiaires)
    ssl_trusted_certificate /etc/ssl/certs/exemple.com.chain.pem;

    # Résolveur DNS pour joindre les serveurs OCSP
    resolver 1.1.1.1 8.8.8.8 valid=300s;
    resolver_timeout 5s;

    # Activation de l'OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    # ...
}
```

Points essentiels :

- `ssl_trusted_certificate` doit contenir les certificats nécessaires pour que NGINX puisse vérifier la chaîne de confiance.
- `resolver` et `resolver_timeout` sont nécessaires pour que NGINX puisse joindre les serveurs OCSP.
- `ssl_stapling_verify on;` demande à NGINX de vérifier la réponse OCSP avant de l’envoyer au client.

---

## Configuration moderne

La “configuration moderne” désigne un ensemble de réglages TLS visant un haut niveau de sécurité, en se concentrant sur des clients récents et en privilégiant TLS 1.2 / 1.3, des suites de chiffrement robustes et des options sécurisées (HSTS, OCSP stapling, paramètres Diffie‑Hellman adéquats, etc.).

### Étapes d’apprentissage

1. Partir d’une configuration recommandée par des guides de bonnes pratiques (organismes de sécurité, communautés spécialisées).
2. Adapter progressivement aux besoins : compatibilité avec des clients plus anciens ou, au contraire, durcissement maximal.
3. Tester régulièrement le site avec des scanners TLS pour vérifier la note de sécurité et la compatibilité.
4. Documenter la politique TLS de l’organisation (versions supportées, suites de chiffrement, rotation de certificats).

### Exemple de “profil moderne” (illustratif)

```nginx
server {
    listen              443 ssl http2;
    server_name         exemple.com;

    root /var/www/exemple.com;

    ssl_certificate     /etc/ssl/certs/exemple.com.fullchain.pem;
    ssl_certificate_key /etc/ssl/private/exemple.com.key;
    ssl_trusted_certificate /etc/ssl/certs/exemple.com.chain.pem;

    # Protocoles récents uniquement
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Suites de chiffrement robustes
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:
                  ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:
                  ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';

    # Sessions TLS
    ssl_session_cache   shared:SSL:50m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # Paramètres ECDH
    ssl_ecdh_curve X25519:secp384r1;

    # OCSP stapling
    resolver 1.1.1.1 8.8.8.8 valid=300s;
    resolver_timeout 5s;
    ssl_stapling on;
    ssl_stapling_verify on;

    # HSTS (à activer après validation)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # En‑têtes de sécurité complémentaires (exemples)
    add_header X-Frame-Options           "SAMEORIGIN" always;
    add_header X-Content-Type-Options    "nosniff" always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Points pédagogiques :

- L’exemple combine toutes les notions vues : choix des protocoles, ciphers, sessions, HSTS, OCSP.
- Il peut servir de base à des exercices : adapter les ciphers, désactiver temporairement HSTS, modifier le timeout des sessions, etc.

---

## Handshake TLS et chaîne de certificats

### Handshake TLS : séquence simplifiée

Lors de l’établissement d’une connexion HTTPS entre un client (navigateur) et un serveur NGINX, les grandes étapes sont les suivantes :

1. **ClientHello**  
   Le client envoie une liste de versions TLS supportées, suites de chiffrement proposées, extensions (SNI, ALPN, etc.), nombre aléatoire, etc.

2. **ServerHello**  
   Le serveur choisit la version TLS et la suite de chiffrement, renvoie ses propres paramètres (aléatoire serveur, extensions négociées comme HTTP/2 via ALPN).

3. **Envoi du certificat et de la chaîne**  
   Le serveur envoie son certificat (et éventuellement un ou plusieurs certificats intermédiaires).  
   - Si l’OCSP stapling est activé, la réponse OCSP est incluse à ce stade.

4. **Échange de clés**  
   Selon l’algorithme choisi (par exemple ECDHE), le client et le serveur échangent les informations nécessaires pour établir une clé de session symétrique.

5. **Vérification des certificats**  
   Le client vérifie que le certificat du serveur est signé par une autorité de certification de confiance, que le nom de domaine correspond, que le certificat n’est pas expiré ni révoqué, etc.

6. **Chiffrement**  
   Une fois la clé de session établie, toutes les données ultérieures sont chiffrées avec cette clé symétrique jusqu’à la fin de la connexion.

### Chaîne de certificats

La chaîne de certificats relie le certificat du serveur à une autorité de certification racine de confiance. En pratique :

- `Certificat serveur` → signé par → `CA intermédiaire` → signé par → `CA racine`.
- Le navigateur possède une liste de certificats racine.  
- Le serveur doit généralement envoyer :
  - son certificat,
  - les certificats intermédiaires nécessaires pour permettre au client de reconstituer la chaîne jusqu’à un racine connue.

En pratique, cela se traduit par :

- Un fichier “certificat + intermédiaires” pour `ssl_certificate` (souvent appelé `fullchain.pem`).
- Un fichier “chaîne de confiance” pour `ssl_trusted_certificate` utilisé par NGINX pour des fonctionnalités comme l’OCSP stapling.

---

## Tableaux récapitulatifs

### Versions de TLS et statut recommandé

| Version TLS | Statut actuel (général) | Recommandation pratique                      |
|------------|-------------------------|----------------------------------------------|
| TLS 1.0    | Obsolète                | Désactiver sauf contrainte legacy extrême    |
| TLS 1.1    | Obsolète                | Désactiver                                   |
| TLS 1.2    | Standard courant        | Garder activé, avec ciphers modernes         |
| TLS 1.3    | Standard moderne        | Activer dès que possible                     |

### Paramètres clés d’une config HTTPS NGINX

| Élément                     | Directive(s) principale(s)                            | Rôle                                                                 |
|----------------------------|-------------------------------------------------------|----------------------------------------------------------------------|
| Activation TLS             | `listen 443 ssl;`                                     | Active le chiffrement sur le port 443                               |
| Certificat                 | `ssl_certificate`, `ssl_certificate_key`              | Identité du serveur et clé privée associée                          |
| Protocoles                 | `ssl_protocols`                                       | Versions de TLS autorisées                                          |
| Suites de chiffrement      | `ssl_ciphers`, `ssl_prefer_server_ciphers`           | Choix et ordre des algorithmes de chiffrement                       |
| Sessions TLS               | `ssl_session_cache`, `ssl_session_timeout`, tickets  | Réutilisation des sessions, impact sur performances                 |
| OCSP stapling              | `ssl_trusted_certificate`, `ssl_stapling*`, `resolver` | Vérification et agrafage du statut de révocation des certificats   |
| HSTS                       | `add_header Strict-Transport-Security`               | Forcer l’utilisation future de HTTPS par les navigateurs            |

---

## Proposition de chemin d’apprentissage détaillé

1. **Phase 1 : Mise en place de base**
   - Installer NGINX et servir un site simple en HTTP.
   - Obtenir un certificat (auto‑signé pour le labo, Let’s Encrypt ou autre pour un environnement réel).
   - Activer HTTPS sur un bloc `server` minimal.
   - Vérifier via navigateur et `curl -v https://exemple.com`.

2. **Phase 2 : Redirection et nettoyage**
   - Ajouter un bloc HTTP qui redirige systématiquement vers HTTPS.
   - S’assurer qu’aucun contenu mixte (HTTP dans une page HTTPS) n’est chargé.
   - Documenter la structure de configuration (`sites-available`, `sites-enabled`, etc. si utilisée).

3. **Phase 3 : Durcissement TLS**
   - Restreindre les protocoles à TLS 1.2 / 1.3.
   - Configurer une liste de suites de chiffrement moderne et la tester.
   - Mettre en place un cache de sessions TLS et ajuster ses paramètres.
   - Tester la configuration avec des scanners TLS et corriger les points faibles.

4. **Phase 4 : HSTS et OCSP stapling**
   - Activer HSTS avec un `max-age` court (par exemple quelques minutes ou heures) en environnement de test.
   - Vérifier l’absence de risques (sous‑domaines, services non chiffrés).
   - Augmenter progressivement `max-age` et éventuellement ajouter `includeSubDomains` puis `preload`.
   - Configurer et vérifier l’OCSP stapling, analyser les résultats avec des outils de diagnostic.

5. **Phase 5 : Configuration “moderne” complète**
   - Combiner tous les éléments (HTTPS strict, HSTS étendu, OCSP stapling, ciphers modernes, HTTP/2).
   - Ajouter des en‑têtes de sécurité complémentaires (X-Frame-Options, Referrer-Policy, etc.).
   - Mettre en place une surveillance : renouvellement automatique des certificats, tests périodiques de la configuration TLS, logs spécifiques.

6. **Phase 6 : Compréhension approfondie**
   - Étudier en détail les échanges du handshake TLS (par exemple via `openssl s_client` ou des captures réseau).
   - Analyser une chaîne de certificats complète et comprendre chaque certificat (sujet, émetteur, dates, usages).
   - Comparer plusieurs profils de configuration (intermédiaire vs moderne) et les impacts sur la compatibilité.

---

Si un approfondissement spécifique est souhaité (par exemple un focus complet sur TLS 1.3, sur la configuration de Let’s Encrypt avec NGINX, ou sur l’analyse de traces de handshake), des sections supplémentaires ciblées peuvent être élaborées.
