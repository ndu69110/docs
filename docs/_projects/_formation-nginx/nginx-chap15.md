# Citations
- https://www.pulleycloud.com/monitoring-nginx/nginx-metrics/
- https://support.site24x7.com/portal/en/kb/articles/how-to-configure-the-nginx-status-page
- https://docs.nginx.com/nginx-amplify/nginx-amplify-agent/configuring-metric-collection/
- https://nginx.org/en/docs/http/ngx_http_stub_status_module.html
- https://www.zabbix.com/integrations/nginx
- https://www.sysdig.com/blog/monitor-nginx-kubernetes
- https://www.logicmonitor.com/support/monitoring/applications-databases/nginx
- https://www.f5.com/company/blog/nginx/monitoring-nginx
- https://www.hostzealot.com/blog/how-to/step-by-step-guide-how-to-enable-the-nginx-status-page
- https://nginx.org/en/docs/http/ngx_http_status_module.html


# Tokens
- prompt_tokens: 277
- completion_tokens: 5359
- total_tokens: 5636
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.08, 'request_cost': 0.006, 'total_cost': 0.087}


# Content
Les différents mécanismes de logging et de monitoring de NGINX se structurent autour de quelques briques majeures : le module `stub_status` pour un monitoring basique, les logs d’erreur (`error_log`), les logs d’accès (`access_log`), la rotation automatique des journaux, et enfin des solutions de monitoring avancé comme NGINX Amplify ou des outils tiers. En combinant ces éléments, il est possible de construire une chaîne d’observation complète, depuis la simple supervision de base jusqu’à un monitoring centralisé avec tableaux de bord et alertes.  

Les explications ci‑dessous suivent un chemin d’apprentissage progressif : d’abord comprendre les métriques exposées par NGINX lui‑même, puis maîtriser la structure et la configuration des logs, apprendre à les faire tourner automatiquement, et enfin intégrer NGINX dans une plate‑forme d’observabilité plus riche. Il n’est malheureusement pas possible ici d’insérer ou vérifier des images provenant de sites externes, mais des descriptions textuelles détaillées des schémas possibles sont fournies, ainsi que des exemples de configuration concrets.  

---

## Monitoring basique avec `stub_status` 🧩

Le module `ngx_http_stub_status_module` permet d’exposer une petite page de statut HTTP contenant les métriques internes de NGINX : connexions actives, nombre total de connexions acceptées/traitées, nombre total de requêtes, ainsi que les connexions en lecture, écriture et en attente. Cette page est très légère, adaptée au scraping régulier par un outil de supervision ou un simple `curl`.  

### Activation du module

Sur la plupart des distributions NGINX « officielles », le module est déjà compilé, mais sur une compilation manuelle il doit être activé à la compilation avec :  
- `--with-http_stub_status_module` ajouté à la ligne de compilation.  

Pour vérifier sa présence sur une instance déjà installée, une commande du type :  

```bash
nginx -V 2>&1 | grep with-http_stub_status_module
```  

permet de confirmer si le module est activé.  

### Configuration minimale d’un endpoint de statut

La configuration suivante illustre un endpoint simple, accessible uniquement en local :

```nginx
http {
    server {
        listen 127.0.0.1:8080;
        server_name localhost;

        location = /nginx_status {
            stub_status;
            allow 127.0.0.1;
            deny all;
            access_log off;
        }
    }
}
```

Points clés de cet exemple :  
- `location = /nginx_status` définit l’URL exacte du point de statut.  
- `stub_status;` active la page de statistiques dans ce bloc `location`.  
- `allow` / `deny` limitent l’accès à l’adresse ou au réseau souhaité.  
- `access_log off;` évite de polluer les logs d’accès avec les requêtes de monitoring.  

Une fois NGINX rechargé, un simple :  

```bash
curl http://127.0.0.1:8080/nginx_status
```  

renvoie un bloc texte typique :

```text
Active connections: 291
server accepts handled requests
16630948 16630948 31070465
Reading: 6 Writing: 179 Waiting: 106
```

### Interprétation des métriques exposées

Les champs de la page `stub_status` se lisent ainsi :  

- `Active connections` : nombre actuel de connexions actives (incluant celles en attente).  
- `accepts` : nombre total de connexions acceptées par NGINX depuis le démarrage.  
- `handled` : nombre de connexions effectivement prises en charge (souvent identique à `accepts`, sauf en cas de limites de ressources).  
- `requests` : nombre total de requêtes HTTP traitées.  
- `Reading` : connexions pour lesquelles NGINX lit les en‑têtes de requête.  
- `Writing` : connexions où NGINX envoie une réponse au client.  
- `Waiting` : connexions keep‑alive en attente d’une nouvelle requête.  

### Exemple de schéma logique (description)

Un schéma textuel typique du monitoring `stub_status` ressemble à ceci :  

- À gauche, plusieurs clients envoient des requêtes HTTP vers NGINX (flèches « Client → NGINX »).  
- NGINX gère ces connexions, et un bloc distinct représente le `location /nginx_status` qui expose l’état interne.  
- À droite, un outil de supervision (Prometheus, Zabbix, etc.) interroge périodiquement `/nginx_status` et stocke les valeurs dans une base de données de séries temporelles, qui alimente ensuite des tableaux de bord de monitoring.  

Ce type de schéma peut être reproduit avec des outils de dessin simples (draw.io, diagrams.net, etc.) en représentant NGINX comme un bloc central avec un endpoint « Status ».  

---

## Logs d’erreur avec `error_log` ⚠️

Les logs d’erreur de NGINX décrivent les événements anormaux : erreurs de configuration, échecs d’ouverture de fichiers, échecs réseau, dépassement de délais, erreurs remontées par des upstreams, etc. La directive `error_log` permet de définir où ces messages sont enregistrés et avec quel niveau de détail.  

### Syntaxe de base

La syntaxe standard est :

```nginx
error_log <chemin_fichier> <niveau>;
```

- `<chemin_fichier>` : chemin absolu ou relatif au fichier de log d’erreur.  
- `<niveau>` : `debug`, `info`, `notice`, `warn`, `error`, `crit`, `alert`, `emerg`.  

Exemples :

```nginx
# Niveau par défaut global
error_log /var/log/nginx/error.log warn;

# Niveau plus verbeux pour un serveur spécifique
server {
    listen 80;
    server_name exemple.local;

    error_log /var/log/nginx/exemple_error.log info;

    location / {
        proxy_pass http://backend;
    }
}
```

La directive peut apparaître au niveau `main` (bloc supérieur du fichier de configuration), au niveau `http`, `mail`, `stream` ou `server`. Un niveau plus spécifique surcharge un niveau plus global.  

### Niveaux de log et usage recommandé

- `warn` ou `error` : niveau usuel en production, limite le bruit tout en conservant les problèmes réels.  
- `info` : utile pour le débogage fonctionnel ou en pré‑production.  
- `debug` : extrêmement verbeux, à n’utiliser que ponctuellement et souvent avec la directive `debug_connection`.  

Exemple d’activation du debug pour une IP spécifique :

```nginx
error_log /var/log/nginx/error_debug.log debug;

events {
    debug_connection 192.0.2.10;
}
```

Cela permet d’enregistrer des traces détaillées pour les connexions provenant de l’hôte `192.0.2.10` uniquement.  

### Structure d’une ligne de log d’erreur

Une ligne typique dans `error.log` ressemble à ceci (format par défaut, non configurable) :

```text
2025/12/05 14:23:45 [error] 1234#0: *56 upstream timed out (110: Connection timed out) while reading response header from upstream, client: 203.0.113.5, server: exemple.local, request: "GET /api/data HTTP/1.1", upstream: "http://10.0.0.5:8080/api/data", host: "exemple.local"
```

On y retrouve :  

- Horodatage complet.  
- Niveau de log `[error]`, `[warn]`, etc.  
- PID et identifiant de worker.  
- Message d’erreur.  
- Informations client (IP, requête, upstream, serveur virtuel).  

### Chemin d’apprentissage autour d’`error_log`

1. Identifier l’emplacement actuel des logs d’erreur dans la configuration (`grep error_log /etc/nginx/nginx.conf /etc/nginx/conf.d/*`).  
2. Choisir un niveau adapté pour l’environnement (par exemple `warn` en production, `info` ou `debug` en qualification).  
3. Générer volontairement des erreurs simples (fichier manquant, upstream indisponible) pour observer comment elles apparaissent dans les logs.  
4. Mettre en place des commandes de filtrage de base (par exemple `grep "[error]" error.log | less`, `tail -f`) puis des recherches plus fines (filtre par IP, par URI, par upstream).  
5. Intégrer ces logs dans un outil SIEM ou un agrégateur (ex. Fluentd, Filebeat, Vector) pour centraliser l’analyse.  

---

## Logs d’accès avec `access_log` 📜

Les logs d’accès enregistrent chaque requête HTTP traitée par NGINX : adresse IP cliente, URI, code de réponse, volume de données, temps de traitement, agent utilisateur, etc. La directive `access_log` contrôle à la fois le fichier cible et le format utilisé.  

### Activation et désactivation

Syntaxe de base :

```nginx
access_log <chemin_fichier> <format> [buffer=size] [gzip[=level]];
```

- `off` peut être utilisé à la place du chemin pour désactiver la journalisation dans un contexte donné.  

Exemples :

```nginx
http {
    # Format par défaut
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';

    access_log /var/log/nginx/access.log main;

    server {
        listen 80;
        server_name exemple.local;

        # Hérite de access_log défini au niveau http
        location /health {
            # Pas besoin de loguer cette route de liveness
            access_log off;
            return 200 'OK';
        }
    }
}
```

Ici, toutes les requêtes sont journalisées dans `/var/log/nginx/access.log` avec le format `main`, sauf celles sur `/health`.  

### Formats de log personnalisés avec `log_format`

La directive `log_format` permet de définir 1 ou plusieurs formats adaptés aux besoins d’analyse.  

Exemple de format « étendu » incluant le temps de réponse et quelques en‑têtes utiles :

```nginx
http {
    log_format extended '$remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent" '
                        '$request_time $upstream_response_time '
                        '$scheme $server_name $server_port';

    access_log /var/log/nginx/access_extended.log extended;
}
```

Variables importantes souvent utilisées :  

- `$remote_addr` : adresse IP cliente.  
- `$request` : ligne de requête complète (`"GET /path HTTP/1.1"`).  
- `$status` : code HTTP.  
- `$body_bytes_sent` : octets envoyés au client.  
- `$request_time` : temps total de traitement côté NGINX.  
- `$upstream_response_time` : temps de réponse de l’upstream (utile pour distinguer lenteurs applicatives et problèmes réseau).  
- `$http_*` : en‑têtes HTTP reçus.  

### Exemple de tableau récapitulatif des logs

| Aspect                     | Logs d’erreur (`error_log`)                          | Logs d’accès (`access_log`)                          |
|---------------------------|------------------------------------------------------|-----------------------------------------------------|
| Type d’événements         | Erreurs, avertissements, anomalies système          | Chaque requête HTTP traitée                         |
| Contrôle de volume        | Niveau (`debug`, `info`, `warn`, etc.)              | Format et désactivation ponctuelle (`access_log off`) |
| Format configurable       | Non (format fixe)                                    | Oui, via `log_format`                               |
| Cible habituelle          | Fichier unique par instance ou par vhost            | Fichier unique ou par vhost, éventuellement par application |
| Usage principal           | Diagnostic d’incidents, débogage                    | Analyse de trafic, statistiques, détection d’abus   |

### Chemin d’apprentissage pour `access_log`

1. Localiser les directives `access_log` et `log_format` existantes.  
2. Comprendre les variables utilisées dans le format actuel (se référer à la documentation officielle des variables).  
3. Créer un format minimaliste pour un environnement à fort trafic (par exemple objectifs de performance).  
4. Créer un format enrichi pour des environnements où l’analyse de trafic est critique (temps de réponse, user‑agent, referer).  
5. Intégrer les fichiers de log dans un pipeline vers Elasticsearch, OpenSearch, Loki, ou un autre backend de logs.  

---

## Rotation automatique des logs 🔄

Les fichiers de log NGINX peuvent rapidement devenir volumineux, en particulier en cas de trafic important. La rotation automatique permet de découper périodiquement les fichiers (par jour, par taille), de les compresser et de supprimer les plus anciens. La rotation n’est pas gérée par NGINX lui‑même ; elle se fait via des outils externes comme `logrotate`.  

### Principe général

Le fonctionnement typique est le suivant :  

1. L’outil de rotation renomme le fichier de log actuel (par exemple `access.log` → `access.log.1`).  
2. Il crée un nouveau fichier vide `access.log`.  
3. Il envoie un signal à NGINX pour lui indiquer de rouvrir ses fichiers de log (généralement `USR1` ou un `nginx -s reopen`).  
4. Les fichiers renommés peuvent ensuite être compressés et supprimés après un certain délai.  

### Exemple de configuration `logrotate` pour NGINX

Un fichier de configuration `/etc/logrotate.d/nginx` peut ressembler à ceci :

```text
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -s /run/nginx.pid ] && kill -USR1 $(cat /run/nginx.pid)
    endscript
}
```

Décryptage des options principales :  

- `daily` : rotation quotidienne.  
- `rotate 14` : conservation de 14 fichiers archivés.  
- `compress` : compression des fichiers archivés (par exemple en `.gz`).  
- `notifempty` : pas de rotation si le fichier est vide.  
- `create` : création d’un nouveau fichier de log avec les droits et propriétaires indiqués.  
- `postrotate` : script exécuté après rotation, qui signale à NGINX de rouvrir les logs.  

### Bonnes pratiques de rotation

- S’assurer que `nginx.pid` pointe vers le bon PID (vérifier `pid` dans `nginx.conf`).  
- Tester manuellement une rotation à blanc avec `logrotate -d /etc/logrotate.d/nginx` avant de l’activer.  
- Vérifier les permissions des fichiers nouvellement créés pour éviter des erreurs « permission denied » dans `error.log`.  
- Adapter la fréquence (`daily`, `weekly`, `size 100M`, etc.) en fonction du volume réel.  

### Chemin d’apprentissage autour de la rotation

1. Observer la croissance des fichiers de logs sur quelques jours (`ls -lh /var/log/nginx`).  
2. Installer/activer `logrotate` si ce n’est pas déjà fait.  
3. Mettre en place une configuration minimale, puis déclencher une rotation manuelle pour valider le bon fonctionnement.  
4. Vérifier, après rotation, que NGINX continue à écrire dans les nouveaux fichiers sans erreur.  
5. Ajuster la politique de rétention (nombre d’archives, compression) en fonction des besoins légaux et opérationnels.  

---

## Monitoring avancé avec Amplify et outils similaires 📊

Pour aller au‑delà de la simple page `stub_status` et des fichiers de log, des solutions comme NGINX Amplify (ou d’autres outils d’observabilité) offrent un monitoring avancé : collecte centralisée de métriques, dashboards prêts à l’emploi, visualisation des logs, et alertes.  

Même si NGINX Amplify est un produit spécifique, la logique générale est similaire à celle des agents de monitoring modernes :  

- Un agent tourne sur le serveur où NGINX est installé.  
- L’agent lit les fichiers de logs, interroge la page `stub_status` (ou l’API de statut sur NGINX Plus) et collecte aussi des métriques système (CPU, RAM, disque).  
- Les données sont envoyées vers une plate‑forme centrale (cloud ou on‑premise) qui fournit des graphiques, des cartes de dépendances et une gestion des alertes.  

### Pré‑requis de configuration côté NGINX

Pour permettre à un agent (Amplify ou autre) de fonctionner correctement, il est habituel de :  

- S’assurer que `stub_status` est bien configuré et accessible depuis la machine locale (ou depuis l’agent).  
- Vérifier que l’utilisateur sous lequel tourne NGINX (souvent `www-data`, `nginx` ou `wwwrun`) peut lire les fichiers de logs, ou l’inverse : que l’agent de monitoring a les droits nécessaires pour lire ces fichiers.  
- Éventuellement configurer l’émission des logs via `syslog` si l’agent écoute un socket syslog plutôt qu’un fichier.  

Exemple de configuration combinant logs vers fichier et syslog :

```nginx
http {
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';

    access_log /var/log/nginx/access.log main;
    access_log syslog:server=127.0.0.1:514 main;

    error_log syslog:server=127.0.0.1:514 error;
}
```

Ici, les logs d’accès et d’erreur sont envoyés à la fois dans un fichier local et à un daemon syslog (par exemple rsyslog, syslog‑ng) sur `127.0.0.1:514`, que l’agent ou une autre solution d’observabilité pourra ensuite ingérer.  

### Exemples de métriques suivies par un outil avancé

Les métriques typiquement exposées via `stub_status` sont souvent réinterprétées sous forme de séries temporelles :

- Nombre de connexions actives.  
- Nombre de requêtes par seconde (RPS).  
- Temps de réponse moyen/percentile (issus des logs d’accès).  
- Distribution des codes HTTP (2xx, 3xx, 4xx, 5xx).  
- Saturation des workers NGINX (calculée à partir des connexions actives/attentes).  

Ces métriques sont ensuite représentées dans des tableaux de bord interactifs (par exemple un graphique en courbes pour les RPS, un histogramme pour les codes HTTP, etc.).  

### Chemin d’apprentissage pour le monitoring avancé

1. Maîtriser la page `stub_status` et interpréter les chiffres bruts (cf. première section).  
2. Maîtriser les logs d’accès et la manière d’ajouter ou enlever des champs (pour fournir des données de temps de réponse ou d’URL).  
3. Choisir un outil de monitoring (Amplify, Prometheus + exporter NGINX, Zabbix, Grafana Cloud, etc.) selon les contraintes.  
4. Installer l’agent, le configurer pour lire les logs et accéder au endpoint `stub_status`.  
5. Explorer les dashboards fournis, puis créer des tableaux personnalisés (par application, par code HTTP, par chemin d’URL).  
6. Mettre en place les alertes pertinentes :  
   - Taux d’erreurs 5xx trop élevé.  
   - Temps de réponse anormalement haut.  
   - Nombre de connexions actives proche des limites.  

---

## Synthèse du chemin d’apprentissage global 🧭

Même si le contenu détaillé ici est déjà conséquent, un parcours progressif et concret autour du « Chapitre 15 » peut se résumer en quelques grandes étapes cohérentes :  

1. **Découvrir le monitoring basique**  
   - Installer NGINX sur un environnement de test.  
   - Activer `stub_status` sur un port ou un endpoint dédié, accessible uniquement depuis la machine locale.  
   - Utiliser `curl` ou un navigateur pour visualiser la page de statut et interpréter les champs.  

2. **Comprendre les logs d’erreur**  
   - Localiser `error_log` et identifier les niveaux utilisés.  
   - Provoquer des erreurs simples (fichier manquant, backend indisponible) et les analyser dans `error.log`.  
   - Ajuster le niveau de log pour les phases d’investigation, puis le redescendre une fois le problème résolu.  

3. **Maîtriser les logs d’accès**  
   - Étudier le format par défaut, puis créer un format personnalisé avec `log_format`.  
   - Activer ce nouveau format pour un vhost de test.  
   - Extraire quelques statistiques de base avec des commandes shell (`awk`, `grep`, `sort`, etc.) pour relier les chiffres à la configuration.  

4. **Mettre en place la rotation automatique**  
   - Vérifier l’existence d’une configuration `logrotate` pour NGINX.  
   - Tester la rotation manuelle, s’assurer que les logs continuent de s’écrire après rotation.  
   - Adapter la politique de rétention aux besoins (légaux, performance, volume disque).  

5. **Intégrer un monitoring avancé**  
   - Installer un agent ou un exporter compatible avec NGINX et `stub_status`.  
   - Connecter l’agent à un backend d’observabilité (Amplify, Prometheus, autre).  
   - Construire progressivement des dashboards puis des alertes sur les métriques clés.  

En suivant cette progression, la compréhension des logs et du monitoring NGINX se construit de façon organique : d’abord les mécanismes internes simples, puis leur exploitation dans un environnement de production observable, auditable et supervisé.
