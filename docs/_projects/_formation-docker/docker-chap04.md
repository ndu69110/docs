# Citations
- https://www.nutrient.io/blog/docker-import-export-vs-load-save/
- https://docs.docker.com/reference/cli/docker/image/save/
- https://forums.docker.com/t/docker-image-load-vs-import/147979
- https://docker-community-leaders.github.io/community/handbooks/docker101/beginners/saving-images-as-tar/
- https://gist.github.com/2c2be0b66695f987bf22
- https://forums.docker.com/t/docker-save-load-performance/9245


# Tokens
- prompt_tokens: 267
- completion_tokens: 8859
- total_tokens: 9126
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.133, 'request_cost': 0.006, 'total_cost': 0.14}


# Content
# 📦 Chapitre 4 : Trouver et Partager des Images Docker

## 🎯 Introduction au Partage d'Images Docker

Le partage et la distribution d'images Docker constituent un élément central de l'écosystème Docker. La capacité à exporter, importer, sauvegarder et charger des images permet aux développeurs et aux équipes d'infrastructure de collaborer efficacement, de maintenir des caches de construction et de gérer les dépendances sans dépendre constamment d'une connexion réseau vers des registres distants.

Cette section explore en détail les différentes méthodes de gestion des images Docker, en distinguant clairement les commandes qui opèrent sur les images de celles qui manipulent les conteneurs. La compréhension de ces distinctions s'avère cruciale pour optimiser les workflows de déploiement et de maintenance.

---

## 🌐 Présentation de Docker Hub

### Qu'est-ce que Docker Hub ?

Docker Hub représente le registre public par défaut de Docker, fonctionnant comme un référentiel centralisé pour stocker, partager et gérer les images Docker. Cette plateforme offre une infrastructure complète permettant aux développeurs et aux organisations de mettre à disposition leurs images conteneurisées auprès de la communauté mondiale ou en accès restreint.

### Architecture et Fonctionnalités Principales

Docker Hub fonctionne selon une architecture client-serveur où les images sont organisées en registres. Chaque image peut posséder plusieurs versions, identifiées par des balises (tags). La plateforme supporte :

- **Registres Publics** : Accessibles à tous sans authentification
- **Registres Privés** : Accessibles uniquement aux utilisateurs autorisés
- **Organisations** : Permettant une gestion collaborative d'images
- **Automatisation** : Intégration avec les dépôts Git pour des constructions automatiques
- **Analyse de Sécurité** : Détection de vulnérabilités dans les images

### Authentification et Accès

La connexion à Docker Hub s'effectue via la ligne de commande avec la commande suivante :

```bash
docker login
```

Cette commande invite l'utilisateur à entrer son nom d'utilisateur et son mot de passe Docker Hub. Une fois authentifié, les identifiants sont stockés localement, permettant de pousser et de tirer des images privées.

### Organisation des Images

Sur Docker Hub, les images sont organisées selon une nomenclature spécifique :

```
[REGISTRE]/[NAMESPACE]/[NOM_IMAGE]:[TAG]
```

Par exemple :
- `docker.io/library/ubuntu:22.04` pour une image officielle
- `docker.io/monnom/monappli:v1.0` pour une image personnelle
- `docker.io/monentreprise/backend:latest` pour une image organisationnelle

### Recherche et Découverte d'Images

La recherche d'images se réalise via :

```bash
docker search nginx
```

Cette commande retourne une liste des images disponibles correspondant à la requête, avec les métadonnées associées telles que :
- Le nombre de pulls (téléchargements)
- Le statut "OFFICIAL" pour les images certifiées
- La description courte de l'image

### Images Officielles et Vérifiées

Docker Hub propose des images officielles, maintenues par des équipes d'experts et vérifiées pour leur qualité et leur sécurité. Ces images bénéficient d'une maintenance régulière, de mises à jour de sécurité et de documentation complète. Les organisations peuvent également obtenir le statut de "Verified Publisher" en démontrant leur engagement envers la qualité.

---

## 🔄 Les Commandes export et import

### Principes Fondamentaux

Les commandes `export` et `import` opèrent spécifiquement sur les conteneurs, non sur les images. Alors qu'une image représente un modèle ou une configuration, un conteneur constitue une instance en cours d'exécution créée à partir de cette image.[1] La compréhension de cette distinction s'avère essentielle pour utiliser correctement ces commandes.

La commande `export` génère une **capture du système de fichiers** d'un conteneur, comparable à un snapshot du disque dur de ce conteneur. Inversement, la commande `import` prend ce système de fichiers et le transforme en une nouvelle image Docker utilisable.[1]

### Fonctionnement de docker export

#### Définition et Utilité

`docker export` exporte le système de fichiers entier d'un conteneur sous la forme d'une archive TAR. Cette opération capture l'état actuel du conteneur, qu'il soit en cours d'exécution ou arrêté.[1] L'archive résultante contient tous les fichiers et répertoires présents dans le conteneur, aplatis en une structure de fichiers unique.

#### Syntaxe et Utilisation

```bash
docker export CONTENEUR > archive.tar
```

ou avec l'option `--output` :

```bash
docker export --output archive.tar CONTENEUR
```

#### Exemple Pratique Complet

Considérons le scénario suivant : il est nécessaire de capturer l'état d'un conteneur nginx après y avoir effectué des modifications personnalisées.

```bash
# Créer et lancer un conteneur nginx
docker run -d --name mon-nginx nginx:latest

# Effectuer des modifications dans le conteneur (exemple simplifié)
docker exec mon-nginx bash -c "echo 'Configuration personnalisée' > /usr/share/nginx/html/config.txt"

# Exporter le conteneur
docker export mon-nginx > nginx-custom.tar

# Vérifier la taille du fichier
ls -lh nginx-custom.tar
```

Le fichier généré contient une snapshot complète du système de fichiers du conteneur. Pour examiner son contenu :

```bash
# Lister les fichiers contenus dans l'archive
tar -tf nginx-custom.tar | head -20

# Extraire l'archive pour inspection
mkdir extracted-fs
tar -xf nginx-custom.tar -C extracted-fs
ls extracted-fs
```

### Fonctionnement de docker import

#### Définition et Utilité

`docker import` effectue l'opération inverse : elle prend une archive TAR (généralement créée par `export`) et l'importe en tant que nouvelle image Docker.[1] L'image résultante est aplatie, ce qui signifie qu'elle ne conserve qu'une seule couche, contrairement aux images construites via des Dockerfiles qui possèdent plusieurs couches.

#### Syntaxe et Utilisation

```bash
docker import [OPTIONS] TAR_FILE [REPOSITORY[:TAG]]
```

#### Exemple Pratique Complet

Reprenant l'exemple précédent, l'archive peut maintenant être importée en tant qu'image :

```bash
# Importer l'archive en tant que nouvelle image
docker import nginx-custom.tar ma-nginx-personnalisee:v1.0

# Vérifier que l'image a été créée
docker images | grep ma-nginx-personnalisee

# Lancer un conteneur à partir de cette nouvelle image
docker run -d --name conteneur-nginx ma-nginx-personnalisee:v1.0 nginx -g "daemon off;"
```

### Modèle de Données : Export vs Import

| Aspect | Détail |
|--------|--------|
| **Source** | Conteneur en exécution ou arrêté |
| **Résultat** | Archive TAR aplatie |
| **Métadonnées** | Très limitées, perdues lors de l'export |
| **Couches** | Une seule couche (aplatissement) |
| **Historique** | Complètement perdu |
| **Taille** | Généralement plus compacte qu'avec `save` |
| **Vitesse** | Généralement plus rapide en raison du streaming |
| **Utilisation** | Débogage, snapshots, images de base personnalisées |

### Modifications de Métadonnées avec docker import

Bien que les métadonnées soient perdues lors de l'export, la commande `import` permet d'ajouter certaines métadonnées via l'option `--change` :

```bash
docker import --change 'ENTRYPOINT ["/bin/sh"]' \
              --change 'ENV APP_ENV=production' \
              nginx-custom.tar ma-nginx-modifiee:v1.0
```

Les modifications possibles incluent :
- `ENTRYPOINT` : Point d'entrée du conteneur
- `ENV` : Variables d'environnement
- `EXPOSE` : Ports exposés
- `WORKDIR` : Répertoire de travail

### Cas d'Usage Recommandés pour Export/Import

#### Débogage de Conteneurs

Lorsqu'un conteneur produit un comportement inattendu, exporter son état permet une inspection détaillée hors ligne :

```bash
# Conteneur en erreur
docker export conteneur-defaillant > debug.tar

# Inspection hors ligne du système de fichiers
tar -tf debug.tar | grep -i erreur
```

#### Création d'Images de Base Personnalisées

Certains workflows nécessitent une image de base avec un système de fichiers personnalisé. Un conteneur modifié peut être exporté puis importé en tant qu'image de base :

```bash
# Créer une image de base minimale personnalisée
docker run -d --name base-system alpine:latest
docker exec base-system sh -c "apk add --no-cache git curl"
docker export base-system > base-personnalisee.tar
docker import base-personnalisee.tar ma-base:1.0
```

#### Archivage et Backup de Conteneurs

Bien que non recommandé pour la production, exporter un conteneur permet de créer une sauvegarde brute de son système de fichiers :

```bash
# Backup de conteneur
docker export conteneur-important > backup-$(date +%Y%m%d).tar

# Compression pour économiser l'espace
gzip backup-*.tar
```

### Limitations et Considérations Importantes

**Volumes Non Inclus** : Les volumes Docker (nommés ou anonymes) résident en dehors du système de fichiers racine du conteneur et ne sont donc pas inclus dans l'export.[1] Pour inclure les données de volumes, il est nécessaire de les copier dans le conteneur avant l'export :

```bash
# Copier les données d'un volume dans le conteneur
docker cp ma-donnee:/volume-data /tmp/donnees-locales
docker exec -w /tmp mon-conteneur cp -r donnees-locales /conteneur-donnees

# Puis exporter
docker export mon-conteneur > conteneur-avec-donnees.tar
```

**Perte de Métadonnées Importantes** : L'export entraîne la perte définitive de l'historique de construction, des labels, des variables d'environnement et des configurations d'ENTRYPOINT/CMD héritées de l'image de base. Ceci rend moins évidente la provenance et la configuration originale du conteneur.[1]

**Pertes de Performance** : Bien que rapide en exécution, l'export peut consommer beaucoup de ressources I/O, particulièrement pour les conteneurs avec de grands volumes de données.

---

## 📤 Les Commandes save et load

### Principes Fondamentaux et Distinction Critique

Alors que `export` et `import` manipulent des conteneurs, `save` et `load` opèrent exclusivement sur les images Docker.[1] Cette distinction fondamentale détermine quand et comment utiliser chaque paire de commandes.

La commande `save` enregistre une ou plusieurs images Docker complètes, incluant toutes les couches, les métadonnées, l'historique de construction et les balises. L'archive résultante peut être transportée et reconstruite précisément en utilisant `load`, sans dépendre d'un registre distant.[1]

### Fonctionnement de docker save

#### Définition et Caractéristiques

`docker save` génère une archive TAR contenant une ou plusieurs images Docker. Contrairement à `export`, cette commande préserve toute la structure en couches, les métadonnées complètes et l'historique de construction. Cette préservation s'avère cruciale pour maintenir la fidélité de l'image et optimiser les futures opérations de construction.[1]

#### Syntaxe et Options

```bash
docker save [OPTIONS] IMAGE [IMAGE...]
```

Options courantes :
- `-o, --output` : Écrire dans un fichier au lieu de STDOUT
- `--platform` : Sauvegarder uniquement une variante de plateforme spécifique

#### Exemples Pratiques Détaillés

**Exemple 1 : Sauvegarde Simple**

```bash
# Sauvegarder une image unique
docker save busybox > busybox.tar

# Vérifier la taille
ls -sh busybox.tar
# Résultat typique : 2.7M busybox.tar
```

**Exemple 2 : Sauvegarde avec Option --output**

```bash
# Équivalent à la redirection STDOUT
docker save --output nginx.tar nginx

# Vérifier le contenu
tar -tf nginx.tar | head -20
```

**Exemple 3 : Compression avec gzip**

```bash
# Réduire la taille de l'archive
docker save myimage:latest | gzip > myimage_latest.tar.gz

# Vérifier la réduction d'espace
ls -lh myimage_latest.tar*
```

**Exemple 4 : Sauvegarde Sélective de Tags**

```bash
# Sauvegarder plusieurs tags spécifiques
docker save -o ubuntu-multi.tar ubuntu:focal ubuntu:jammy ubuntu:latest

# Chaque tag est préservé avec son historique complet
```

**Exemple 5 : Sauvegarde pour Plateforme Spécifique**

```bash
# Sauvegarder uniquement la variante ARM64
docker save --platform linux/arm64 alpine:latest > alpine-arm64.tar

# Sauvegarder pour architecture s390x
docker save --platform linux/s390x ubuntu:22.04 > ubuntu-s390x.tar
```

#### Structure Interne d'une Archive save

Une archive créée par `docker save` suit une structure spécifique :

```
archive.tar
├── manifest.json          # Métadonnées d'index
├── repositories           # Informations de nommage
├── [hash]/                # Répertoires de couches
│   ├── layer.tar          # Données de couche
│   ├── json               # Métadonnées de couche
│   └── VERSION            # Version du format
└── ...
```

### Fonctionnement de docker load

#### Définition et Utilité

`docker load` importe une ou plusieurs images à partir d'une archive TAR créée précédemment par `docker save`. Cette opération reconstruit les images avec toutes leurs couches, leurs métadonnées et leurs tags intacts.[1] Aucune connexion réseau vers un registre n'est requise.

#### Syntaxe et Utilisation

```bash
docker load [OPTIONS] < archive.tar
```

ou avec l'option `--input` :

```bash
docker load --input archive.tar
```

ou avec les options courtes :

```bash
docker load -i archive.tar
```

#### Exemples Pratiques Détaillés

**Exemple 1 : Chargement Simple**

```bash
# Charger une image depuis une archive
docker load < busybox.tar

# Résultat attendu :
# Loaded image: busybox:latest

# Vérifier que l'image est disponible
docker images busybox
```

**Exemple 2 : Chargement avec Redirection de Fichier**

```bash
# Alternative avec option explicite
docker load --input nginx.tar

# L'image nginx:latest est maintenant disponible localement
docker run -d -p 80:80 nginx
```

**Exemple 3 : Chargement depuis Archive Compressée**

```bash
# Décompresser et charger en une seule commande
docker load < myimage_latest.tar.gz

# Ou utiliser gzip explicitement
gunzip -c myimage_latest.tar.gz | docker load
```

**Exemple 4 : Chargement d'Images Multiples**

```bash
# L'archive contient plusieurs images (plusieurs tags)
docker load < ubuntu-multi.tar

# Résultat :
# Loaded image: ubuntu:focal
# Loaded image: ubuntu:jammy
# Loaded image: ubuntu:latest

# Vérifier tous les tags chargés
docker images ubuntu
```

**Exemple 5 : Affichage Détaillé du Chargement**

```bash
# Afficher les détails de chaque couche en cours de chargement
docker load --input archive.tar 2>&1 | tee load-output.log

# Inspecter le journal pour déboguer les problèmes
cat load-output.log
```

### Comparaison Détaillée : save/load vs export/import

| Critère | docker save/load | docker export/import |
|---------|-----------------|----------------------|
| **Cible** | Images Docker | Conteneurs Docker |
| **Préservation des Couches** | ✅ Toutes les couches | ❌ Aplatie en une seule |
| **Historique** | ✅ Préservé complètement | ❌ Perdu |
| **Métadonnées** | ✅ CMD, ENTRYPOINT, ENV, labels, ports | ⚠️ Partiellement, via --change |
| **Taille de l'Archive** | ✅ Plus grande mais compressible | ✅ Généralement plus compacte |
| **Vitesse d'Export** | ⏱️ Plus lent en raison de la complexité | ⏱️ Généralement plus rapide |
| **Fidélité** | ✅ Copie exacte et traçable | ❌ Perte significative de contexte |
| **Cas d'Usage Idéal** | Partage, cache, builds reproductibles | Débogage, snapshots temporaires |
| **Inclusion de Volumes** | ❌ Non inclus | ❌ Non inclus |
| **Intégrité de Signature** | ✅ Peut être vérifiée | ❌ Non applicable |

### Cas d'Usage Recommandés pour save/load

#### 1. Transfert d'Images Entre Systèmes Isolés

Dans les environnements sans accès à Internet ou sans registre privé disponible, `save` et `load` permettent le transfert sécurisé d'images :

```bash
# Sur la machine source (avec Internet)
docker save myapp:1.0 | gzip > myapp-1.0.tar.gz

# Transférer le fichier (USB, SCP, email, etc.)
scp myapp-1.0.tar.gz user@machine-isolee:/tmp/

# Sur la machine cible (isolée)
docker load < /tmp/myapp-1.0.tar.gz

# Vérifier et lancer
docker images myapp
docker run -d myapp:1.0
```

#### 2. Caching de Layers pour CI/CD

Dans les pipelines d'intégration continue, les couches précédemment construites peuvent être sauvegardées et rechargées pour accélérer les constructions futures :

```bash
# Pipeline étape 1 : Construire et sauvegarder
docker build -t mon-app:latest .
docker save mon-app:latest > cache.tar

# Stocker cache.tar dans l'artefact de CI

# Pipeline étape 2 : Charger le cache et construire à partir de celui-ci
docker load < cache.tar

# Les couches sont maintenant en cache local
docker build -t mon-app:latest --cache-from mon-app:latest .
```

#### 3. Archivage à Long Terme

Pour les images critiques, `save` crée des archives archivables :

```bash
# Créer une archive datée avec métadonnées
ARCHIVE_DATE=$(date +%Y%m%d_%H%M%S)
docker save critical-app:v1.0 | gzip > critical-app-v1.0_${ARCHIVE_DATE}.tar.gz

# Stocker le fichier en sécurité
mv critical-app-*.tar.gz /mnt/archive/docker-images/

# Créer un fichier manifest pour traçabilité
echo "Image: critical-app:v1.0" > /mnt/archive/docker-images/critical-app-v1.0_manifest.txt
docker inspect critical-app:v1.0 >> /mnt/archive/docker-images/critical-app-v1.0_manifest.txt
```

#### 4. Distribution d'Images Hors Réseau

Les équipes distribuant des images à des clients sans connexion réseau utilisent couramment cette approche :

```bash
# Préparer un bundle d'images
docker save \
  appbase:1.0 \
  app-frontend:1.0 \
  app-backend:1.0 \
  app-database:1.0 | gzip > app-bundle-v1.0.tar.gz

# Le client reçoit un seul fichier facilement transportable
ls -lh app-bundle-v1.0.tar.gz
# -rw-r--r-- 1 user user 256M app-bundle-v1.0.tar.gz

# Installation chez le client
docker load < app-bundle-v1.0.tar.gz

# Tous les composants sont disponibles
docker images app-*
```

#### 5. Builds Reproductibles et Déterministes

Les projets nécessitant une reproductibilité absolue (compliance, audit) utilisent `save` pour garantir que les builds futurs utilisent exactement les mêmes couches :

```bash
# Build v1.0
docker build -t myapp:v1.0 .
docker save myapp:v1.0 > v1.0-exact.tar

# Années plus tard, dépendances disparus du registre
# Mais la reconstruction exacte reste possible
docker load < v1.0-exact.tar

# Vérifier l'intégrité du hash
docker inspect myapp:v1.0 --format='{{.Id}}'
```

### Optimisation des Performances pour save/load

#### Compression Efficace

```bash
# gzip : Compression standard
docker save myimage:latest | gzip -9 > image.tar.gz

# pigz : Gzip parallélisé (plus rapide)
docker save myimage:latest | pigz -9 > image.tar.gz

# bzip2 : Compression plus efficace mais plus lent
docker save myimage:latest | bzip2 -9 > image.tar.bz2

# Comparaison de tailles
ls -lh image.tar*
```

#### Gestion d'Archives de Grande Taille

Pour les images dépassant plusieurs gigaoctets, des stratégies de division s'appliquent :

```bash
# Sauvegarder une grande image
docker save huge-app:latest > huge-app.tar

# Diviser en fichiers de 2GB
split -b 2G huge-app.tar huge-app-part_

# Transférer les parties individuellement
# ...

# Réassembler sur la machine cible
cat huge-app-part_* > huge-app.tar

# Charger normalement
docker load < huge-app.tar
```

#### Utilisation de BuildKit Cache Exporters (Approche Moderne)

Docker BuildKit offre une alternative plus performante aux simples commandes `save`/`load` :

```bash
# Exporter le cache de build localement
docker buildx build \
  --cache-to type=local,dest=/tmp/buildkit-cache \
  --output type=image,push=false \
  -t myapp:latest .

# Importer le cache pour les builds suivants
docker buildx build \
  --cache-from type=local,src=/tmp/buildkit-cache \
  -t myapp:latest .
```

### Considérations de Sécurité

#### Intégrité des Archives

```bash
# Générer un hash pour vérifier l'intégrité
docker save myimage:latest | tee myimage.tar | sha256sum > myimage.tar.sha256

# Vérifier l'intégrité après transfert
sha256sum -c myimage.tar.sha256
```

#### Chiffrement des Archives

Pour les environnements sensibles, chiffrer les archives avant transfert :

```bash
# Chiffrer avec gpg
docker save myimage:latest | gzip | gpg --symmetric > image.tar.gz.gpg

# Déchiffrer et charger
gpg --decrypt image.tar.gz.gpg | gunzip | docker load
```

---

## 📤 Publier ses Images sur Docker Hub

### Architecture de Publication

La publication d'images sur Docker Hub suit un processus strictement défini. L'image doit d'abord exister localement, être correctement nommée et taguée selon la convention Docker Hub, puis être envoyée via la commande `docker push`.

### Préparation de l'Image

#### Convention de Nommage

Pour publier une image sur Docker Hub, elle doit suivre cette nomenclature :

```
docker.io/[USERNAME]/[IMAGE_NAME]:[TAG]
```

Où :
- **docker.io** : Registre par défaut (peut être omis)
- **USERNAME** : Nom d'utilisateur Docker Hub
- **IMAGE_NAME** : Nom descriptif de l'image
- **TAG** : Version ou identificateur (par défaut "latest" si omis)

#### Exemple de Nommage Correct

```bash
# Nommer l'image correctement
docker tag myapp:v1.0 montextura/myapp:v1.0
docker tag myapp:v1.0 montextura/myapp:latest

# Vérifier les tags
docker images montextura/myapp
```

### Authentification à Docker Hub

#### Connexion Initiale

```bash
# Se connecter à Docker Hub
docker login

# Invite interactive :
# Login with your Docker ID to push and pull images from Docker Hub.
# If you don't have a Docker ID, head over to https://hub.docker.com to create one.
# Username: montextura
# Password: ••••••••••••••••
# Login Succeeded
```

#### Stockage des Identifiants

Les identifiants sont stockés localement dans `~/.docker/config.json` (avec chiffrement basique selon la configuration du système).

```bash
# Afficher la configuration (à titre informatif uniquement)
cat ~/.docker/config.json | jq '.auths'
```

### Processus de Push

#### Commande de Base

```bash
docker push montextura/myapp:v1.0
```

#### Sortie Détaillée du Push

```
The push refers to repository [docker.io/montextura/myapp]
a1d0c7532dbe: Pushed  
e02e811e3d8d: Pushed
2731eed57b6d: Pushed
v1.0: digest: sha256:abc123... size: 1234
```

Chaque ligne représente une couche compressée et envoyée vers le registre.

#### Push Complet avec Tous les Tags

```bash
# Pousser spécifiquement plusieurs tags
docker push montextura/myapp:v1.0
docker push montextura/myapp:latest

# Ou une syntaxe alternative (dépend de la version Docker)
docker push montextura/myapp --all-tags
```

### Gestion des Registres Privés

#### Création d'un Registre Privé

Pour maintenir un contrôle total, les organisations hébergent souvent des registres privés :

```bash
# Démarrer un registre privé local
docker run -d \
  -p 5000:5000 \
  --name local-registry \
  -v registry-data:/var/lib/registry \
  registry:latest
```

#### Push vers un Registre Privé

```bash
# Retagger pour le registre privé
docker tag montextura/myapp:v1.0 localhost:5000/myapp:v1.0

# Pousser vers le registre local
docker push localhost:5000/myapp:v1.0

# Pull depuis le registre local
docker pull localhost:5000/myapp:v1.0
```

#### Registre Privé Distant

```bash
# Retagger pour un registre privé distant
docker tag montextura/myapp:v1.0 registry.example.com:5000/myapp:v1.0

# Se connecter au registre privé
docker login registry.example.com:5000

# Pousser
docker push registry.example.com:5000/myapp:v1.0
```

### Création d'Images Publiables

#### Dockerfile Optimal pour Publication

```dockerfile
# Utiliser une image de base officielle légère
FROM alpine:3.18

# Définir des métadonnées
LABEL maintainer="contact@example.com"
LABEL version="1.0"
LABEL description="Application exemple"

# Installer les dépendances
RUN apk add --no-cache \
    python3 \
    py3-pip

# Copier le code
WORKDIR /app
COPY . .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Exposer le port
EXPOSE 5000

# Définir l'entrypoint
ENTRYPOINT ["python3"]
CMD ["app.py"]
```

#### Build et Publication Complète

```bash
# Construire avec le tag approprié
docker build -t montextura/myapp:v1.0 .

# Ajouter le tag latest
docker tag montextura/myapp:v1.0 montextura/myapp:latest

# Se connecter
docker login

# Pousser les deux versions
docker push montextura/myapp:v1.0
docker push montextura/myapp:latest

# Vérifier sur Docker Hub
# https://hub.docker.com/r/montextura/myapp
```

### Gestion des Versions et Tags

#### Stratégies de Tagging

**Semantic Versioning**

```bash
# Version majeure.mineure.patch
docker build -t montextura/myapp:1.0.0 .
docker build -t montextura/myapp:1.0 .
docker build -t montextura/myapp:1 .
docker build -t montextura/myapp:latest .

# Pousser tous les tags
docker push montextura/myapp:1.0.0
docker push montextura/myapp:1.0
docker push montextura/myapp:1
docker push montextura/myapp:latest
```

**Date-based Tagging**

```bash
DATE=$(date +%Y%m%d)
docker build -t montextura/myapp:${DATE} .
docker push montextura/myapp:${DATE}
```

**Build Number Tagging (pour CI/CD)**

```bash
BUILD_ID=$CI_PIPELINE_ID
docker build -t montextura/myapp:build-${BUILD_ID} .
docker push montextura/myapp:build-${BUILD_ID}
```

### Gestion des Permissions et Accès

#### Créer une Équipe sur Docker Hub

```bash
# Via l'interface web Docker Hub :
# 1. Se connecter à hub.docker.com
# 2. Aller à "Teams and Organizations"
# 3. Créer une nouvelle équipe
# 4. Ajouter les membres
```

#### Partager une Image Privée

```bash
# Via l'interface web :
# 1. Aller au dépôt de l'image
# 2. Aller à "Permissions"
# 3. Ajouter les utilisateurs ou équipes
```

### Automatisation des Publications

#### Utiliser un Personal Access Token

```bash
# Créer un PAT sur Docker Hub (interface web)
# Utiliser le PAT dans les pipelines CI/CD

echo $DOCKER_PAT | docker login -u $DOCKER_USERNAME --password-stdin

docker push montextura/myapp:v1.0

docker logout
```

#### Exemple GitHub Actions

```yaml
name: Build and Push to Docker Hub

on:
  push:
    branches: [main]
    tags: [v*]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PAT }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: montextura/myapp:${{ github.ref_name }}
```

### Optimisation des Images Publiées

#### Réduction de la Taille

```dockerfile
# ❌ Mauvaise pratique : image grande
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y build-essential
COPY myapp /
ENTRYPOINT ["/myapp"]

# ✅ Bonne pratique : image légère
FROM alpine:3.18
RUN apk add --no-cache libc6-compat
COPY --from=builder /myapp /
ENTRYPOINT ["/myapp"]
```

#### Build Multi-Stage

```dockerfile
# Stage 1 : Compilation
FROM golang:1.21 AS builder
WORKDIR /build
COPY . .
RUN go build -o myapp .

# Stage 2 : Exécution
FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=builder /build/myapp /
ENTRYPOINT ["/myapp"]
```

---

## 🔍 Synthèse et Chemins d'Apprentissage

### Progression Logique de l'Apprentissage

Le chemin d'apprentissage optimal pour maîtriser le partage d'images Docker suit une progression logique :

#### Phase 1 : Compréhension des Concepts Fondamentaux

L'apprenant doit d'abord comprendre la distinction fondamentale entre images et conteneurs. Cette distinction sous-tend toutes les commandes de manipulation ultérieures. Docker Hub doit être exploré comme référentiel central, permettant une familiarisation avec l'écosystème.

```bash
# Activités de Phase 1
docker search nginx
docker pull ubuntu:22.04
docker images
docker run -it ubuntu:22.04 /bin/bash
```

#### Phase 2 : Maîtrise des Commandes de Base

Une fois les concepts acquis, les commandes `save`/`load` doivent être pratiquées extensivement. Ces commandes sont plus simples conceptuellement que `export`/`import` et constituent les outils les plus couramment utilisés.

```bash
# Activités de Phase 2
docker save ubuntu:22.04 > ubuntu.tar
docker rmi ubuntu:22.04
docker load < ubuntu.tar
docker save --output nginx.tar nginx:latest
```

#### Phase 3 : Exploration des Cas d'Usage Spécialisés

Ensuite, les commandes `export`/`import` peuvent être explorées pour comprendre quand et pourquoi les utiliser. Ce stade introduit la complexité de la manipulation des conteneurs et des snapshots.

```bash
# Activités de Phase 3
docker run -d --name test-container ubuntu:22.04 sleep 1000
docker exec test-container touch /test-file
docker export test-container > snapshot.tar
docker import snapshot.tar my-snapshot:v1.0
docker run my-snapshot:v1.0 ls /test-file
```

#### Phase 4 : Publication et Intégration

La publication sur Docker Hub consolide tous les concepts précédents. L'apprenant applique ses connaissances pour créer, taguer et distribuer des images.

```bash
# Activités de Phase 4
docker build -t montextura/myapp:v1.0 .
docker login
docker push montextura/myapp:v1.0
docker logout
```

### Tableau Comparatif Complet des Commandes

| Commande | Type | Source | Destination | Préservation | Utilisation |
|----------|------|--------|-------------|--------------|-------------|
| `docker save` | Image | Image locale | Archive TAR | Complète avec couches | Transfert, cache, archivage |
| `docker load` | Image | Archive TAR | Image locale | Identique à l'original | Restauration depuis archive |
| `docker export` | Conteneur | Conteneur | Archive TAR | Système de fichiers aplati | Débogage, snapshots |
| `docker import` | Conteneur | Archive TAR | Nouvelle image | Aplatissement en couche unique | Créer images de base |
| `docker push` | Image | Image locale | Registre distant | Complète | Publication et partage |
| `docker pull` | Image | Registre distant | Image locale | Complète | Téléchargement |

### Réponse aux Cas d'Usage Courants

**"Je dois sauvegarder une image pour plus tard"** → Utilisez `docker save` + compression

**"Je dois déboguer un conteneur défaillant"** → Utilisez `docker export` pour capturer l'état

**"Je dois partager mon application avec l'équipe"** → Utilisez `docker push` vers Docker Hub

**"Je dois créer une image personnalisée basée sur un conteneur modifié"** → Utilisez `docker export` + `docker import`

**"Je dois transférer des images entre serveurs sans registre"** → Utilisez `docker save` + `docker load`

**"Je dois créer une base à partir d'un conteneur existant"** → Utilisez `docker commit` (alternative) ou `docker export` + `docker import`

### Bonnes Pratiques de Production

L'utilisation professionnelle de ces commandes implique l'application de plusieurs principes :

**Nommage Cohérent** : Maintenir une convention de nommage stricte facilite la gestion ultérieure.

**Documentation** : Accompagner chaque image publiée d'une documentation README complète.

**Tests Avant Publication** : Vérifier systématiquement qu'une image fonctionne correctement avant de la publier.

**Versioning Strict** : Éviter le tag "latest" en production, préférer les versions explicites.

**Sécurité** : Scanner les images pour des vulnérabilités avant publication.

```bash
# Exemple de workflow complet sécurisé
docker build -t montextura/myapp:v1.0.1 .

# Tester localement
docker run -d --name test montextura/myapp:v1.0.1
docker exec test /test-script.sh
docker stop test && docker rm test

# Scanner pour vulnérabilités (avec Trivy)
trivy image montextura/myapp:v1.0.1

# Publier si OK
docker login
docker push montextura/myapp:v1.0.1

# Ajouter les tags supplémentaires
docker tag montextura/myapp:v1.0.1 montextura/myapp:v1.0
docker tag montextura/myapp:v1.0.1 montextura/myapp:latest
docker push montextura/myapp:v1.0
docker push montextura/myapp:latest
```

Cette compréhension complète et progressive permet à l'apprenant de maîtriser l'ensemble des outils de gestion d'images Docker et de les appliquer efficacement selon les contextes spécifiques rencontrés en pratique.
