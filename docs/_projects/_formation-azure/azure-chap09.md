# Citations
- https://learn.microsoft.com/fr-fr/azure/aks/active-active-solution
- https://learn.microsoft.com/fr-fr/azure/architecture/web-apps/app-service-environment/architectures/app-service-environment-high-availability-deployment
- https://learn.microsoft.com/fr-fr/azure/frontdoor/create-front-door-terraform
- https://learn.microsoft.com/fr-fr/azure/well-architected/service-guides/azure-front-door
- https://learn.microsoft.com/fr-fr/power-pages/configure/azure-front-door
- https://learn.microsoft.com/fr-fr/azure/frontdoor/best-practices
- https://www.itpro.fr/atelier-video-embarquez-pour-azure-front-door
- https://learn.microsoft.com/fr-fr/azure/frontdoor/routing-methods
- https://www.youtube.com/watch?v=LiBNZwZ5wBs


# Tokens
- prompt_tokens: 263
- completion_tokens: 9978
- total_tokens: 10241
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.15, 'request_cost': 0.006, 'total_cost': 0.156}


# Content
# 📘 Chapitre 9 : Projet 1 - Déploiement Haute Disponibilité avec Azure Front Door

## Introduction au projet

Le déploiement haute disponibilité constitue un élément fondamental de l'architecture cloud moderne. Cette section présente une approche complète pour mettre en œuvre une solution résiliente utilisant Azure Front Door comme composant central de distribution du trafic.[1]

Azure Front Door est un service d'équilibrage de charge de couche sept (Application Layer) qui permet de diriger le trafic utilisateur vers les backends les plus performants en fonction de critères définis. Dans le contexte d'une architecture haute disponibilité active/active, deux clusters ou plus traitent simultanement le trafic, éliminant ainsi tout point de défaillance unique.[1]

### Objectifs de la formation

L'objectif principal consiste à comprendre et implémenter une architecture où :
- Plusieurs ressources dans différentes régions Azure traitent activement les requêtes
- Le trafic se distribue automatiquement entre les régions saines
- Un basculement automatique survient en cas de défaillance régionale
- Les métriques et journaux de diagnostic se centralisent pour le monitoring

### Architecture générale de la solution

L'architecture active/active repose sur deux ou plusieurs clusters AKS identiques, chacun déployé dans une région Azure distincte, tous configurés pour héberger les instances complètes des applications.[1] Azure Front Door agit comme point d'entrée unique (single entry point) en acheminant le trafic réseau entre les régions. En situation normale, le trafic se répartit selon la politique de routage définie. En cas d'indisponibilité d'une région, le gestionnaire de trafic redirige l'ensemble du flux vers les régions saines restantes.

---

## Préparation de l'environnement

La préparation de l'environnement englobe plusieurs étapes critiques pour assurer le succès du déploiement et de la gestion de l'infrastructure.

### Prérequis techniques

Avant de débuter, l'environnement de travail doit satisfaire aux exigences suivantes :

- **Abonnement Azure actif** : Un abonnement avec des permissions suffisantes pour créer des ressources dans plusieurs régions
- **Azure CLI** : Installation de la dernière version d'Azure CLI pour gérer les ressources Azure en ligne de commande
- **Terraform** : Installation de Terraform version 1.0 ou supérieure pour l'infrastructure-as-code[3]
- **kubectl** : L'outil de ligne de commande pour gérer les clusters Kubernetes
- **Editeur de code** : Visual Studio Code ou un équivalent pour éditer les fichiers de configuration

### Configuration des fournisseurs Terraform

La première étape consiste à initialiser les fournisseurs Terraform nécessaires. Cela permet à Terraform de communiquer avec les services Azure pour créer et gérer les ressources.[3]

```hcl
terraform {
  required_version = ">=1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}
```

Ce fichier de configuration `providers.tf` définit la version minimale de Terraform requise, les fournisseurs utilisés et leurs versions respectives. Le fournisseur Azure Resource Manager (azurerm) gère l'ensemble des ressources Azure, tandis que le fournisseur random génère des valeurs aléatoires pour assurer l'unicité des ressources.

### Structure des ressources Azure

L'architecture requiert la création de plusieurs ressources Azure dans chaque région :

**Ressources primaires par région :**
- Un cluster Azure Kubernetes Service (AKS)
- Une instance Azure Application Gateway pour le routage au niveau de la couche application
- Des pools de nœuds Kubernetes pour exécuter les conteneurs d'application
- Une instance Log Analytics pour la centralisation des métriques et journaux

**Ressources partagées :**
- Un profil Azure Front Door au niveau global
- Une instance partagée Log Analytics pour l'agrégation des données de toutes les régions
- Un groupe de ressources par région pour l'organisation logique

### Initialisation de Terraform

Une fois les fichiers de configuration préparés, l'initialisation de Terraform télécharge les plugins des fournisseurs nécessaires :[3]

```bash
terraform init -upgrade
```

Le paramètre `-upgrade` assure que les versions les plus récentes conformes aux contraintes de version sont téléchargées. Cette commande crée le fichier `.terraform.lock.hcl` qui verrouille les versions des fournisseurs pour garantir la reproductibilité du déploiement.

### Variables d'environnement et paramétrage

Pour maintenir une approche flexible et reproductible, les variables de configuration se définissent dans un fichier `variables.tf` :

```hcl
variable "primary_region" {
  description = "Région primaire pour le déploiement"
  type        = string
  default     = "westeurope"
}

variable "secondary_region" {
  description = "Région secondaire pour le déploiement"
  type        = string
  default     = "northeurope"
}

variable "environment" {
  description = "Environnement de déploiement"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Nom de l'application"
  type        = string
  default     = "myapp"
}

variable "kubernetes_version" {
  description = "Version de Kubernetes pour les clusters AKS"
  type        = string
  default     = "1.28"
}
```

Ces variables permettent de personnaliser le déploiement sans modifier le code principal d'infrastructure. L'utilisation de fichiers `.tfvars` offre une séparation supplémentaire entre la configuration et le code :

```hcl
# terraform.tfvars
primary_region      = "westeurope"
secondary_region    = "northeurope"
environment         = "production"
app_name            = "votingapp"
kubernetes_version  = "1.28"
```

### Authentification Azure

La connexion à Azure se fait généralement via Azure CLI :

```bash
az login
az account set --subscription "ID-de-l-abonnement"
```

Cette authentification permet à Terraform d'accéder aux ressources Azure avec les permissions appropriées. Pour les déploiements en environnement de production ou CI/CD, on privilégie l'authentification par service principal.

---

## Code de l'application et déploiement

### Structure de l'application et conteneurisation

L'application déployée dans cette architecture est généralement une application web moderne capable de s'exécuter dans des conteneurs. Pour cette formation, on utilise une application de vote simple servie par une API backend.

#### Dockerfile de l'application

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY templates/ templates/

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["python", "app.py"]
```

Ce Dockerfile crée une image conteneur basée sur Python 3.11 léger. La directive HEALTHCHECK define les critères de vérification de l'état de santé du conteneur, utilisés par le système de sonde d'intégrité de Kubernetes.

#### Application Flask simple

```python
from flask import Flask, render_template, request, jsonify
import os
from datetime import datetime

app = Flask(__name__)

# Configuration depuis les variables d'environnement
REGION = os.getenv('REGION', 'unknown')
INSTANCE_ID = os.getenv('INSTANCE_ID', 'default')

@app.route('/')
def index():
    return render_template('index.html', region=REGION, instance_id=INSTANCE_ID)

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'region': REGION,
        'instance_id': INSTANCE_ID,
        'timestamp': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/vote', methods=['POST'])
def vote():
    vote_data = request.get_json()
    return jsonify({
        'status': 'success',
        'vote': vote_data.get('option'),
        'processed_by': INSTANCE_ID,
        'region': REGION
    }), 201

@app.route('/api/metrics')
def metrics():
    return jsonify({
        'region': REGION,
        'instance_id': INSTANCE_ID,
        'timestamp': datetime.utcnow().isoformat()
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
```

Cette application expose plusieurs endpoints essentiels. L'endpoint `/health` permet au système de vérifier la disponibilité du service, tandis que `/api/vote` traite les requêtes métier. Chaque réponse inclut l'identifiant de la région pour tracer le routage du trafic.

### Configuration Kubernetes pour les clusters AKS

#### Déploiement de l'application dans AKS

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: voting-app
  namespace: production
  labels:
    app: voting-app
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: voting-app
  template:
    metadata:
      labels:
        app: voting-app
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "5000"
    spec:
      containers:
      - name: voting-app
        image: myregistry.azurecr.io/voting-app:v1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5000
          name: http
        env:
        - name: REGION
          valueFrom:
            fieldRef:
              fieldPath: metadata.annotations['topology.kubernetes.io/region']
        - name: INSTANCE_ID
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - voting-app
              topologyKey: kubernetes.io/hostname
```

Ce manifest Kubernetes configure le déploiement de l'application avec plusieurs réplicas pour la redondance locale. Les probes de liveness et readiness assurent que seules les instances saines reçoivent du trafic. L'anti-affinité de pod favorise la distribution des réplicas sur différents nœuds.

#### Service Kubernetes exposant l'application

```yaml
apiVersion: v1
kind: Service
metadata:
  name: voting-app-service
  namespace: production
  labels:
    app: voting-app
spec:
  type: LoadBalancer
  selector:
    app: voting-app
  ports:
  - port: 80
    targetPort: 5000
    protocol: TCP
    name: http
  sessionAffinity: None
```

Ce service expose l'application sur le port 80 (HTTP standard), routant les requêtes vers les pods sur le port 5000. Le service LoadBalancer Azure crée un load balancer interne qui distribue le trafic entre les pods.

### Déploiement Terraform des clusters AKS

#### Configuration du groupe de ressources et du cluster principal

```hcl
resource "azurerm_resource_group" "primary" {
  name     = "${var.app_name}-rg-${var.primary_region}"
  location = var.primary_region

  tags = {
    environment = var.environment
    region      = var.primary_region
  }
}

resource "azurerm_kubernetes_cluster" "primary" {
  name                = "${var.app_name}-aks-${var.primary_region}"
  location            = azurerm_resource_group.primary.location
  resource_group_name = azurerm_resource_group.primary.name
  dns_prefix          = "${var.app_name}-primary"

  default_node_pool {
    name            = "default"
    node_count      = 3
    vm_size         = "Standard_D2s_v3"
    os_disk_size_gb = 50

    zones = ["1", "2", "3"]
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    service_cidr      = "10.0.0.0/16"
    dns_service_ip    = "10.0.0.10"
    docker_bridge_cidr = "172.17.0.1/16"
  }

  kubernetes_version = var.kubernetes_version

  tags = {
    environment = var.environment
    region      = var.primary_region
  }

  depends_on = [azurerm_resource_group.primary]
}
```

Cette configuration crée un cluster AKS avec trois nœuds répartis sur trois zones de disponibilité (zones 1, 2, 3) au sein de la région primaire. Cette distribution assure la résilience contre les défaillances de zone. L'identité système attribuée au cluster permet l'accès sécurisé aux ressources Azure.

#### Configuration du cluster secondaire

```hcl
resource "azurerm_resource_group" "secondary" {
  name     = "${var.app_name}-rg-${var.secondary_region}"
  location = var.secondary_region

  tags = {
    environment = var.environment
    region      = var.secondary_region
  }
}

resource "azurerm_kubernetes_cluster" "secondary" {
  name                = "${var.app_name}-aks-${var.secondary_region}"
  location            = azurerm_resource_group.secondary.location
  resource_group_name = azurerm_resource_group.secondary.name
  dns_prefix          = "${var.app_name}-secondary"

  default_node_pool {
    name            = "default"
    node_count      = 3
    vm_size         = "Standard_D2s_v3"
    os_disk_size_gb = 50

    zones = ["1", "2", "3"]
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    service_cidr      = "10.1.0.0/16"
    dns_service_ip    = "10.1.0.10"
    docker_bridge_cidr = "172.17.0.1/16"
  }

  kubernetes_version = var.kubernetes_version

  tags = {
    environment = var.environment
    region      = var.secondary_region
  }

  depends_on = [azurerm_resource_group.secondary]
}
```

Le cluster secondaire suit une configuration identique au cluster primaire, déployé dans une région distincte. L'utilisation de plages CIDR différentes (10.0.0.0/16 vs 10.1.0.0/16) évite les conflits d'adressage entre les régions.

### Déploiement de l'application sur les clusters

#### Script de déploiement de l'application

```bash
#!/bin/bash

set -e

# Variables de configuration
PRIMARY_RG="myapp-rg-westeurope"
PRIMARY_CLUSTER="myapp-aks-westeurope"
PRIMARY_REGION="westeurope"

SECONDARY_RG="myapp-rg-northeurope"
SECONDARY_CLUSTER="myapp-aks-northeurope"
SECONDARY_REGION="northeurope"

ACR_NAME="myappregistry"
ACR_RESOURCE_GROUP="myapp-rg-westeurope"

# Fonction pour obtenir les credentials du cluster
configure_cluster() {
    local rg=$1
    local cluster=$2
    local region=$3
    
    echo "Configuration de ${cluster} dans ${region}..."
    az aks get-credentials --resource-group "${rg}" --name "${cluster}" --overwrite-existing
    
    # Créer le namespace de production
    kubectl create namespace production --dry-run=client -o yaml | kubectl apply -f -
}

# Fonction pour déployer l'application
deploy_application() {
    local region=$1
    local instance_name=$2
    
    echo "Déploiement de l'application dans ${region}..."
    
    # Appliquer les manifests Kubernetes
    kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: production
data:
  REGION: "${region}"
  INSTANCE_ID: "${instance_name}"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: voting-app
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: voting-app
  template:
    metadata:
      labels:
        app: voting-app
    spec:
      containers:
      - name: voting-app
        image: ${ACR_NAME}.azurecr.io/voting-app:v1.0.0
        ports:
        - containerPort: 5000
        envFrom:
        - configMapRef:
            name: app-config
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: voting-app-service
  namespace: production
spec:
  type: LoadBalancer
  selector:
    app: voting-app
  ports:
  - port: 80
    targetPort: 5000
EOF
}

# Obtention des credentials pour les deux clusters
echo "=== Configuration des clusters AKS ==="
configure_cluster "${PRIMARY_RG}" "${PRIMARY_CLUSTER}" "${PRIMARY_REGION}"
configure_cluster "${SECONDARY_RG}" "${SECONDARY_CLUSTER}" "${SECONDARY_REGION}"

# Déploiement du cluster primaire
kubectl config use-context "${PRIMARY_CLUSTER}"
deploy_application "${PRIMARY_REGION}" "primary-instance"

# Déploiement du cluster secondaire
kubectl config use-context "${SECONDARY_CLUSTER}"
deploy_application "${SECONDARY_REGION}" "secondary-instance"

echo "=== Déploiement terminé ==="
kubectl config use-context "${PRIMARY_CLUSTER}"
echo "Contexte actif : ${PRIMARY_CLUSTER}"
```

Ce script automatise le processus de configuration des deux clusters et le déploiement de l'application avec les configurations régionales spécifiques. L'utilisation de ConfigMaps permet aux pods de connaître leur région et instance d'appartenance.

### Création du registre de conteneurs Azure

```hcl
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.primary.name
  location            = azurerm_resource_group.primary.location
  sku                 = "Premium"
  admin_enabled       = false

  tags = {
    environment = var.environment
  }
}

# Attribution de rôles pour l'accès au registre
resource "azurerm_role_assignment" "aks_primary_acr" {
  scope              = azurerm_container_registry.acr.id
  role_definition_name = "AcrPush"
  principal_id       = azurerm_kubernetes_cluster.primary.identity[0].principal_id
}

resource "azurerm_role_assignment" "aks_secondary_acr" {
  scope              = azurerm_container_registry.acr.id
  role_definition_name = "AcrPush"
  principal_id       = azurerm_kubernetes_cluster.secondary.identity[0].principal_id
}
```

Le registre de conteneurs centralise le stockage des images Docker utilisées par les deux clusters. Les attributions de rôles permettent aux clusters AKS de tirer les images sans gérer manuellement les credentials.

---

## Routage global avec Azure Front Door

### Architecture générale du routage

Azure Front Door constitue la couche supérieure d'une architecture de routage global distribuée.[4] Positionnée devant les backends distribués géographiquement, cette solution fournit un routage de couche sept sophistiqué, une mise en cache distribuée et une gestion automatique du basculement.

### Configuration de Base d'Azure Front Door

#### Création du profil Front Door

```hcl
resource "azurerm_cdn_frontdoor_profile" "main" {
  name                = "${var.app_name}-frontdoor"
  resource_group_name = azurerm_resource_group.primary.name
  sku_name            = "Standard_AzureFrontDoor"

  tags = {
    environment = var.environment
  }
}
```

Le profil Front Door constitue le conteneur principal pour toute la configuration de routage. La SKU Standard fournit les capacités essentielles pour une architecture haute disponibilité moderne.

#### Configuration des origines (origins)

```hcl
# Origine du cluster primaire
resource "azurerm_cdn_frontdoor_origin_group" "primary" {
  name                     = "primary-origin-group"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  session_affinity_enabled = true

  load_balancing {
    sample_size                 = 4
    successful_samples_required = 3
    additional_latency_in_milliseconds = 0
  }

  health_probe {
    interval_in_seconds = 100
    path                = "/health"
    protocol            = "Https"
    request_type        = "HEAD"
  }
}

resource "azurerm_cdn_frontdoor_origin" "primary_origin" {
  name                           = "primary-origin"
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.primary.id
  enabled                        = true
  http_port                      = 80
  https_port                     = 443
  origin_host_header             = azurerm_kubernetes_cluster.primary.fqdn
  priority                       = 1
  weight                         = 50
  certificate_name_check_enabled = true
  host_name                      = azurerm_kubernetes_cluster.primary.fqdn
}

# Origine du cluster secondaire
resource "azurerm_cdn_frontdoor_origin_group" "secondary" {
  name                     = "secondary-origin-group"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  session_affinity_enabled = true

  load_balancing {
    sample_size                 = 4
    successful_samples_required = 3
    additional_latency_in_milliseconds = 0
  }

  health_probe {
    interval_in_seconds = 100
    path                = "/health"
    protocol            = "Https"
    request_type        = "HEAD"
  }
}

resource "azurerm_cdn_frontdoor_origin" "secondary_origin" {
  name                           = "secondary-origin"
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.secondary.id
  enabled                        = true
  http_port                      = 80
  https_port                     = 443
  origin_host_header             = azurerm_kubernetes_cluster.secondary.fqdn
  priority                       = 1
  weight                         = 50
  certificate_name_check_enabled = true
  host_name                      = azurerm_kubernetes_cluster.secondary.fqdn
}
```

Chaque groupe d'origine contient un health probe qui vérifie la disponibilité des backends toutes les 100 secondes en effectuant une requête HEAD sur l'endpoint `/health`. Si trois requêtes consécutives échouent, l'origine est marquée comme indisponible. L'affinité de session assure que les requêtes d'un même client restent dirigées vers le même backend lorsque possible.[1]

La pondération (weight) et priorité (priority) définissent la distribution du trafic. Avec des poids égaux, le trafic se répartit équitablement. En cas de défaillance d'une région, tout le trafic bascule vers l'autre.

### Méthodes de routage

#### Routage pondéré (Weighted routing)

```hcl
resource "azurerm_cdn_frontdoor_route" "weighted_route" {
  name                          = "weighted-routing-rule"
  cdn_frontdoor_endpoint_id    = azurerm_cdn_frontdoor_endpoint.main.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.primary.id
  supported_protocols           = ["Http", "Https"]
  patterns_to_match             = ["/*"]
  forwarding_protocol           = "HttpsOnly"
  link_to_default_domain        = true
  https_redirect_enabled        = true

  # Configuration du cache pour les ressources statiques
  cache {
    query_string_caching_behavior = "UseQueryString"
    compression_enabled           = true
  }
}
```

Cette configuration dirige le trafic vers les backends en utilisant le schéma de pondération défini dans les groupes d'origine. Le routage se fait selon la latence mesurée et la disponibilité de chaque backend.

#### Routage basé sur le chemin (Path-based routing)

```hcl
resource "azurerm_cdn_frontdoor_route" "api_route" {
  name                          = "api-routing-rule"
  cdn_frontdoor_endpoint_id    = azurerm_cdn_frontdoor_endpoint.main.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.primary.id
  supported_protocols           = ["Https"]
  patterns_to_match             = ["/api/*"]
  forwarding_protocol           = "HttpsOnly"
  link_to_default_domain        = true
  https_redirect_enabled        = true

  cache {
    query_string_caching_behavior = "IgnoreQueryString"
    compression_enabled           = true
    default_ttl                   = 0  # Pas de cache pour les APIs
  }
}

resource "azurerm_cdn_frontdoor_route" "static_route" {
  name                          = "static-routing-rule"
  cdn_frontdoor_endpoint_id    = azurerm_cdn_frontdoor_endpoint.main.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.primary.id
  supported_protocols           = ["Https"]
  patterns_to_match             = ["/static/*", "*.js", "*.css", "*.jpg", "*.png", "*.gif"]
  forwarding_protocol           = "HttpsOnly"
  link_to_default_domain        = true
  https_redirect_enabled        = true

  cache {
    query_string_caching_behavior = "IgnoreQueryString"
    compression_enabled           = true"
    default_ttl                   = 86400  # Cache 24 heures
    max_ttl                       = 604800 # Maximum 7 jours
  }
}
```

Les règles de routage basées sur le chemin permettent de diriger différents types de requêtes vers des configurations optimisées. Les requêtes API ne se cachent pas (TTL=0) pour assurer la fraîcheur des données, tandis que les ressources statiques se cachent pendant 24 heures par défaut.[4]

### Configuration du point de terminaison Front Door

#### Création du point de terminaison

```hcl
resource "azurerm_cdn_frontdoor_endpoint" "main" {
  name                     = "${var.app_name}-endpoint"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  enabled                  = true

  tags = {
    environment = var.environment
  }
}
```

L'endpoint Front Door est le point d'entrée unique où les utilisateurs accèdent à l'application. Un FQDN automatiquement généré de la forme `example.azurefd.net` est attribué.

### Gestion du basculement et haute disponibilité

#### Configuration automatique du basculement

```hcl
resource "azurerm_cdn_frontdoor_origin_group" "failover_group" {
  name                     = "failover-origin-group"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  session_affinity_enabled = false

  load_balancing {
    sample_size                 = 4
    successful_samples_required = 3
    additional_latency_in_milliseconds = 100
  }

  health_probe {
    interval_in_seconds = 100
    path                = "/health"
    protocol            = "Https"
    request_type        = "HEAD"
  }
}

# Configuration de basculement en priorité
resource "azurerm_cdn_frontdoor_origin" "primary_for_failover" {
  name                           = "primary-failover"
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.failover_group.id
  enabled                        = true
  http_port                      = 80
  https_port                     = 443
  origin_host_header             = azurerm_kubernetes_cluster.primary.fqdn
  priority                       = 1  # Priorité haute - utilisé en premier
  weight                         = 100
  certificate_name_check_enabled = true
  host_name                      = azurerm_kubernetes_cluster.primary.fqdn
}

resource "azurerm_cdn_frontdoor_origin" "secondary_for_failover" {
  name                           = "secondary-failover"
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.failover_group.id
  enabled                        = true
  http_port                      = 80
  https_port                     = 443
  origin_host_header             = azurerm_kubernetes_cluster.secondary.fqdn
  priority                       = 2  # Priorité basse - utilisé en cas d'indisponibilité
  weight                         = 100
  certificate_name_check_enabled = true
  host_name                      = azurerm_kubernetes_cluster.secondary.fqdn
}
```

En mode basculement (failover), les requêtes se dirigent d'abord vers le backend prioritaire. Seulement si celui-ci devient indisponible, les requêtes basculent vers le backend de priorité inférieure. Cela contraste avec la distribution active/active où le trafic se répartit continuellement entre tous les backends sains.

### Mise en cache distribuée

#### Stratégies de cache optimisées

```hcl
resource "azurerm_cdn_frontdoor_route" "cache_optimized" {
  name                          = "cache-optimized-route"
  cdn_frontdoor_endpoint_id    = azurerm_cdn_frontdoor_endpoint.main.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.primary.id
  supported_protocols           = ["Https"]
  patterns_to_match             = ["/*"]
  forwarding_protocol           = "HttpsOnly"
  link_to_default_domain        = true
  https_redirect_enabled        = true

  cache {
    # Configuration avancée du cache
    query_string_caching_behavior = "UseQueryString"
    compression_enabled           = true
    
    # Headers personnalisés influençant le cache
    cache_key_query_string_include_nulls = false
    
    # Comportement par défaut
    default_ttl = 3600  # 1 heure
    min_ttl     = 60    # 1 minute
    max_ttl     = 604800 # 7 jours
  }
}
```

La stratégie de cache utilise les en-têtes HTTP standard (Cache-Control, ETag, Last-Modified) pour déterminer la durée de vie des objets. Azure Front Door compresse automatiquement les contenus supportant la compression (texte, JSON, CSS, JavaScript) pour réduire la consommation de bande passante.[4]

### Configuration des domaines personnalisés

#### Ajout d'un domaine personnalisé avec HTTPS

```hcl
resource "azurerm_cdn_frontdoor_custom_domain" "main" {
  name                     = "custom-domain"
  cdn_frontdoor_profile_id = azurerm_cdn_frontdoor_profile.main.id
  dns_zone_id              = azurerm_dns_zone.main.id
  host_name                = "app.example.com"

  tls {
    certificate_type    = "ManagedCertificate"
    minimum_tls_version = "TLS12"
  }
}

resource "azurerm_cdn_frontdoor_route" "custom_domain_route" {
  name                          = "custom-domain-route"
  cdn_frontdoor_endpoint_id    = azurerm_cdn_frontdoor_endpoint.main.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.primary.id
  supported_protocols           = ["Https"]
  patterns_to_match             = ["/*"]
  forwarding_protocol           = "HttpsOnly"
  custom_domains                = [azurerm_cdn_frontdoor_custom_domain.main.id]
  link_to_default_domain        = false
  https_redirect_enabled        = true

  cache {
    query_string_caching_behavior = "UseQueryString"
    compression_enabled           = true
  }
}
```

L'utilisation de domaines personnalisés avec certificats gérés offre une expérience utilisateur professionnelle. Azure Front Door gère automatiquement le renouvellement des certificats TLS.

### Règles d'acheminement avancées (Rules Engine)

#### Réécriture d'en-têtes HTTP

```hcl
resource "azurerm_cdn_frontdoor_route" "with_rules" {
  name                          = "route-with-rules"
  cdn_frontdoor_endpoint_id    = azurerm_cdn_frontdoor_endpoint.main.id
  cdn_frontdoor_origin_group_id = azurerm_cdn_frontdoor_origin_group.primary.id
  supported_protocols           = ["Https"]
  patterns_to_match             = ["/*"]
  forwarding_protocol           = "HttpsOnly"
  link_to_default_domain        = true

  # Règles d'acheminement avancées
  rule {
    name     = "add-security-headers"
    order    = 1
    operator = "Any"

    actions {
      response_header_actions {
        header_action = "Append"
        header_name   = "X-Content-Type-Options"
        value         = "nosniff"
      }
      response_header_actions {
        header_action = "Append"
        header_name   = "X-Frame-Options"
        value         = "DENY"
      }
      response_header_actions {
        header_action = "Append"
        header_name   = "X-XSS-Protection"
        value         = "1; mode=block"
      }
    }
  }

  rule {
    name     = "compression-optimization"
    order    = 2
    operator = "Any"

    actions {
      cache_expiration_actions {
        cache_behavior = "SetIfMissing"
        cache_duration = "1:30:00"
      }
    }
  }
}
```

Le moteur de règles Front Door permet de modifier les en-têtes, de rediriger les requêtes ou d'appliquer des transformations complexes. Ces règles s'exécutent à proximité de l'utilisateur final pour minimiser la latence.

### Déploiement complète de Front Door avec Terraform

#### Script d'application Terraform

```bash
#!/bin/bash

set -e

echo "=== Validation de la configuration Terraform ==="
terraform validate

echo "=== Formatage de la configuration Terraform ==="
terraform fmt -recursive

echo "=== Planification du déploiement ==="
terraform plan -out=tfplan

echo "=== Déploiement de l'infrastructure ==="
terraform apply tfplan

echo "=== Récupération des informations de sortie ==="
terraform output -json

echo "=== Déploiement terminé avec succès ==="
```

#### Outputs utiles

```hcl
output "primary_cluster_fqdn" {
  value       = azurerm_kubernetes_cluster.primary.fqdn
  description = "FQDN du cluster AKS primaire"
}

output "secondary_cluster_fqdn" {
  value       = azurerm_kubernetes_cluster.secondary.fqdn
  description = "FQDN du cluster AKS secondaire"
}

output "frontdoor_endpoint" {
  value       = azurerm_cdn_frontdoor_endpoint.main.host_name
  description = "Endpoint Azure Front Door"
}

output "frontdoor_id" {
  value       = azurerm_cdn_frontdoor_profile.main.id
  description = "ID du profil Azure Front Door"
}

output "acr_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "Serveur de connexion du registre de conteneurs"
}
```

Ces outputs facilitent la récupération des informations essentielles après le déploiement sans interroger manuellement le portail Azure.

### Monitoring et diagnostics avec Log Analytics

#### Configuration de Log Analytics

```lol
resource "azurerm_log_analytics_workspace" "shared" {
  name                = "${var.app_name}-law-shared"
  location            = azurerm_resource_group.primary.location
  resource_group_name = azurerm_resource_group.primary.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    environment = var.environment
  }
}

resource "azurerm_log_analytics_workspace" "primary" {
  name                = "${var.app_name}-law-${var.primary_region}"
  location            = azurerm_resource_group.primary.location
  resource_group_name = azurerm_resource_group.primary.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    environment = var.environment
    region      = var.primary_region
  }
}

resource "azurerm_log_analytics_workspace" "secondary" {
  name                = "${var.app_name}-law-${var.secondary_region}"
  location            = azurerm_resource_group.secondary.location
  resource_group_name = azurerm_resource_group.secondary.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    environment = var.environment
    region      = var.secondary_region
  }
}
```

Chaque région dispose de sa propre instance Log Analytics stockant les métriques et journaux de diagnostic régionaux. Une instance partagée centralise les données de toutes les régions pour l'analyse globale.[1]

### Tests de basculement et scénarios de résilience

#### Simulation d'une défaillance régionale

```bash
#!/bin/bash

# Script pour simuler une défaillance de région
REGION_TO_TEST="primary"
PRIMARY_CLUSTER="myapp-aks-westeurope"
PRIMARY_RG="myapp-rg-westeurope"

echo "=== Simulation de défaillance de ${REGION_TO_TEST} ==="

# Désactiver les pods dans la région primaire
kubectl config use-context "${PRIMARY_CLUSTER}"
kubectl scale deployment voting-app --replicas=0 -n production

echo "Pods arrêtés dans ${PRIMARY_CLUSTER}"
echo "Attendez que Front Door détecte la défaillance (jusqu'à 100 secondes)..."
sleep 120

# Vérifier que le trafic se dirige vers la région secondaire
echo "Envoi de requêtes de test..."
for i in {1..10}; do
  response=$(curl -s -H "User-Agent: TestClient" https://app.example.azurefd.net/api/metrics | jq .region)
  echo "Requête $i : région = ${response}"
done

# Redémarrer les pods
echo "Redémarrage des pods dans ${PRIMARY_CLUSTER}..."
kubectl scale deployment voting-app --replicas=3 -n production

echo "=== Test de basculement terminé ==="
```

Ce test vérifie que le système bascule correctement vers la région secondaire en cas d'indisponibilité de la région primaire. Azure Front Door détecte la défaillance via les health probes et redirige le trafic automatiquement.[1]

#### Utilisation d'Azure Chaos Studio

```bash
#!/bin/bash

# Déploiement d'une expérience de chaos pour tester la résilience
CHAOS_EXPERIMENT_NAME="aks-region-outage"
CLUSTER_RESOURCE_ID="/subscriptions/{subscription-id}/resourceGroups/myapp-rg-westeurope/providers/Microsoft.ContainerService/managedClusters/myapp-aks-westeurope"

echo "=== Configuration d'une expérience de chaos ==="

az rest --method put \
  --uri "https://management.azure.com${CLUSTER_RESOURCE_ID}/providers/Microsoft.Chaos/experiments/${CHAOS_EXPERIMENT_NAME}?api-version=2024-01-01" \
  --body '{
    "location": "westeurope",
    "identity": {
      "type": "SystemAssigned"
    },
    "properties": {
      "steps": [
        {
          "name": "simulate-pod-failure",
          "branches": [
            {
              "name": "kill-pods",
              "actions": [
                {
                  "type": "continuous",
                  "name": "urn:csci:microsoft:kubernetesCluster:podChaos/2.1",
                  "parameters": [
                    {
                      "name": "action",
                      "value": "kill"
                    },
                    {
                      "name": "namespace",
                      "value": "production"
                    }
                  ],
                  "duration": "PT5M"
                }
              ]
            }
          ]
        }
      ]
    }
  }' \
  --output json
```

Azure Chaos Studio permet de créer et d'exécuter des expériences contrôlées pour tester la résilience du système face à des défaillances simulées. Cela offre une validation pratique de la haute disponibilité.

### Validation et vérification du déploiement

#### Script de test complet

```bash
#!/bin/bash

set -e

FRONTDOOR_ENDPOINT="https://app.example.azurefd.net"

echo "=== Tests de validation de Front Door ==="

# Test 1 : Vérification de la disponibilité générale
echo "Test 1 : Disponibilité générale"
status=$(curl -s -o /dev/null -w "%{http_code}" "${FRONTDOOR_ENDPOINT}/")
if [ "$status" = "200" ]; then
    echo "✓ Endpoint accessible (HTTP $status)"
else
    echo "✗ Endpoint indisponible (HTTP $status)"
fi

# Test 2 : Vérification des health probes
echo "Test 2 : Health probes"
health=$(curl -s "${FRONTDOOR_ENDPOINT}/health" | jq .status)
echo "Statut de santé : ${health}"

# Test 3 : Vérification du routage
echo "Test 3 : Routage vers les backends"
for i in {1..5}; do
    region=$(curl -s "${FRONTDOOR_ENDPOINT}/api/metrics" | jq -r .region)
    instance=$(curl -s "${FRONTDOOR_ENDPOINT}/api/metrics" | jq -r .instance_id)
    echo "Requête $i : région=${region}, instance=${instance}"
done

# Test 4 : Performance et latence
echo "Test 4 : Performance"
time curl -s -o /dev/null "${FRONTDOOR_ENDPOINT}/"

# Test 5 : Compression de réponse
echo "Test 5 : Compression"
compression=$(curl -s -H "Accept-Encoding: gzip" -I "${FRONTDOOR_ENDPOINT}/" | grep -i "content-encoding")
echo "En-tête compression : ${compression}"

echo "=== Validation terminée ==="
```

Ce script effectue une série de tests pour valider le fonctionnement correct de Front Door, y compris la disponibilité, le routage, et les performances.

---

## Résumé du parcours d'apprentissage

La progression de ce module suit une structure logique progressant du général au spécifique. La préparation de l'environnement établit les fondations nécessaires à l'infrastructure. La compréhension du code de l'application et de son déploiement démonstrent comment les applications modernes s'intègrent dans les écosystèmes cloud. Enfin, la configuration détaillée d'Azure Front Door révèle comment construire une couche de routage sophistiquée et résiliente capable de servir des millions d'utilisateurs distribués géographiquement.

Les principes appliqués dans ce projet -- la redondance géographique, l'équilibrage de charge intelligent, la surveillance proactive et l'automatisation du basculement -- constituent les éléments fondamentaux d'une architecture cloud moderne hautement disponible. La maîtrise de ces concepts prépare aux défis réels du déploiement d'applications critiques à l'échelle globale.
