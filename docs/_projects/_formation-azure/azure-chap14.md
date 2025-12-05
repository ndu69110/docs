# Citations
- https://learn.microsoft.com/fr-fr/azure/architecture/guide/management-governance/management-governance-start-here
- https://learn.microsoft.com/fr-fr/azure/governance/management-groups/azure-management
- https://learn.microsoft.com/fr-fr/azure/cloud-adoption-framework/ready/landing-zone/design-area/governance
- https://www.axido.fr/gouvernance-azure-gardez-le-controle-reduisez-les-risques/
- https://learn.microsoft.com/fr-fr/azure/cloud-adoption-framework/govern/enforce-cloud-governance-policies
- https://www.datacamp.com/fr/blog/azure-project-ideas
- https://blog.silamind.cloud/api-microservices-et-gouvernance-les-cl%C3%A9s-dune-architecture-moderne-avec-azure-api-management
- https://azure.microsoft.com/fr-fr/solutions/azure-essentials/cloud-adoption-framework
- https://empower.bluesoft-group.com/comment-maitriser-les-couts-dans-azure-grace-a-la-gouvernance/
- https://smartcloudarchitect.fr


# Tokens
- prompt_tokens: 313
- completion_tokens: 9702
- total_tokens: 10015
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.146, 'request_cost': 0.006, 'total_cost': 0.152}


# Content
# 📘 Chapitre 14 : Projet 2 - Projet Cloud Complet

## 🏗️ Architecture, Gouvernance et Planification

### Fondamentaux de l'Architecture Azure

La conception d'une architecture cloud complète dans Azure repose sur des principes fondamentaux de gestion et de gouvernance[1]. Cette phase initiale définit les bases sur lesquelles reposera l'ensemble du projet. L'architecture doit intégrer des tâches critiques telles que la surveillance, l'audit, la création de rapports liés aux exigences de sécurité et métier, ainsi que l'implémentation de la sauvegarde, de la récupération d'urgence et de la haute disponibilité[1].

### Structuration des Environnements Azure

La première étape concrète consiste à organiser Azure de manière cohérente et scalable[4]. Cette structuration repose sur trois piliers fondamentaux :

**Gestion des abonnements et groupes de gestion** : L'utilisation de groupes de gestion permet d'organiser les abonnements de manière hiérarchique. Cette approche facilite l'application de politiques cohérentes à grande échelle et améliore la gouvernance globale[3].

**Application de règles de nommage standardisées** : L'établissement de conventions de nommage strictes évite l'anarchie technologique et facilite le reporting ainsi que les déploiements futurs[4].

**Classification avec les balises (tags)** : Les tags permettent de classifier les ressources par projet, service, coût ou entité, créant ainsi une structure logique facilitant la facturation et l'allocation des coûts[4].

### Gouvernance Azure : Mécanismes et Processus

La gouvernance dans Azure fournit des mécanismes et des processus permettant de contrôler les plateformes, les applications et les ressources[3]. Elle est principalement mise en œuvre à travers deux services clés[2] :

**Azure Policy** : Ce service crée, attribue et gère des définitions de stratégie pour appliquer des règles aux ressources, maintenant la conformité aux standards de l'entreprise[2].

**Azure Cost Management** : Cet outil suit l'utilisation du cloud et les dépenses liées aux ressources Azure et à d'autres fournisseurs de cloud[2].

### Avantages d'une Stratégie de Gouvernance Bien Définie

Une stratégie de gouvernance cohérente offre des avantages tangibles[4] :

- **Visibilité complète** : Surveillance des déploiements, évitement des doublons et garantie d'une utilisation maîtrisée des services cloud
- **Accélération des opérations** : Cadre de déploiement reproductible et fiable adapté aux enjeux d'évolutivité
- **Pilotage stratégique** : Indicateurs précis facilitant la prise de décision à tous les niveaux

### Hiérarchie des Groupes de Gestion

La structuration recommandée[3] inclut :

- Hiérarchie de groupe d'administration regroupant les ressources par fonction ou type de charge de travail
- Ensemble complet de stratégies Azure activant les contrôles au niveau du groupe d'administration
- Vérification que toutes les ressources demeurent dans le périmètre de gouvernance

---

## 🚀 Déploiement de l'Infrastructure de Base

### Planification Infrastructure as Code (IaC)

Le déploiement de l'infrastructure de base s'effectue en utilisant l'Infrastructure as Code (IaC)[5]. Cette approche automatise les déploiements d'infrastructure en utilisant des modèles déclaratifs, stockés dans un système de contrôle de code source permettant le suivi des modifications et la collaboration.

### Outils de Déploiement Disponibles

Trois principaux outils facilitent le déploiement infrastructure dans Azure[5] :

- **Bicep** : Langage déclaratif conçu spécifiquement pour Azure
- **Terraform** : Outil d'infrastructure as code multi-cloud
- **Azure Resource Manager (modèles ARM)** : Modèles natives Azure en JSON

### Structure de Ressources Fondamentales

L'infrastructure de base comprend typiquement :

**Groupe de ressources** : Conteneur logique regroupant les ressources liées à un projet ou une charge de travail.

**Réseau virtuel (VNet)** : Infrastructure réseau fondamentale permettant la communication entre ressources Azure et la connectivité vers des réseaux externes.

**Sous-réseaux** : Segmentation logique du VNet facilitant la gestion du trafic et l'application de règles de sécurité.

**Comptes de stockage** : Infrastructure de stockage pour les données, fichiers et artefacts de l'application.

**Groupes de sécurité réseau (NSG)** : Pare-feu applicatif filtrant le trafic entrant et sortant.

### Exemple de Configuration de Ressources de Base

La création d'une infrastructure minimale requiert la définition de ressources fondamentales. Cette configuration établit les bases sur lesquelles les composants additionnels s'ajouteront progressivement :

```bicep
param location string = resourceGroup().location
param environment string = 'prod'
param projectName string = 'cloudproject'

var vnetName = '${projectName}-vnet-${environment}'
var subnetName = '${projectName}-subnet-${environment}'
var nsgName = '${projectName}-nsg-${environment}'
var storageAccountName = '${projectName}storage${environment}'

resource nsg 'Microsoft.Network/networkSecurityGroups@2021-02-01' = {
  name: nsgName
  location: location
  properties: {
    securityRules: [
      {
        name: 'AllowHTTP'
        properties: {
          protocol: '*'
          sourcePortRange: '*'
          destinationPortRange: '80'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 100
          direction: 'Inbound'
        }
      }
      {
        name: 'AllowHTTPS'
        properties: {
          protocol: '*'
          sourcePortRange: '*'
          destinationPortRange: '443'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 101
          direction: 'Inbound'
        }
      }
    ]
  }
}

resource subnet 'Microsoft.Network/virtualNetworks/subnets@2021-02-01' = {
  parent: vnet
  name: subnetName
  properties: {
    addressPrefix: '10.0.1.0/24'
    networkSecurityGroup: {
      id: nsg.id
    }
  }
}

resource vnet 'Microsoft.Network/virtualNetworks@2021-02-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: []
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    accessTier: 'Hot'
  }
}
```

### Gestion Centralisée des Mises à Jour

L'infrastructure de base intègre également la gestion des mises à jour[1]. Le gestionnaire de mise à jour Azure permet de gérer de manière centralisée les mises à jour et la conformité à grande échelle, garantissant que tous les systèmes restent à jour et conformes aux exigences de sécurité.

---

## 📦 Déploiement des Applications et Configuration du Stockage

### Stratégie de Déploiement d'Applications

Le déploiement des applications dans une infrastructure cloud complète nécessite une approche structurée. Les applications doivent être déployées dans des conteneurs ou des environnements d'exécution managés, permettant une scalabilité et une haute disponibilité.

### Services d'Hébergement d'Applications

Azure propose plusieurs options pour héberger des applications[1] :

**Azure App Service** : Plateforme managée pour héberger des applications web, mobiles et API avec mise à l'échelle automatique et déploiement continu.

**Azure Container Instances et Azure Kubernetes Service (AKS)** : Solutions de conteneurisation pour les applications modernes basées sur microservices.

**Azure Virtual Machines** : Instances de calcul flexibles pour les charges de travail exigeantes des configurations spécifiques.

### Configuration du Stockage Azure

Le stockage Azure offre plusieurs types de solutions répondant à différents besoins[1] :

**Stockage d'objets blob** : Stockage non structuré pour les fichiers, images, vidéos et données massives.

**Stockage archive Azure** : Solution économique pour les données rarement utilisées, réduisant les coûts de stockage à long terme.

**File Storage** : Stockage de fichiers managé accessible via le protocole SMB.

**Table Storage** : Base de données NoSQL pour les données structurées.

### Exemple de Configuration de Stockage et Application

La configuration du stockage et du déploiement d'une application nécessite l'orchestration de plusieurs ressources :

```bicep
param location string = resourceGroup().location
param appServicePlanSku string = 'B1'
param storageAccountType string = 'Standard_LRS'

var appServicePlanName = 'appplan-${uniqueString(resourceGroup().id)}'
var appServiceName = 'app-${uniqueString(resourceGroup().id)}'
var storageAccountName = 'storage${uniqueString(resourceGroup().id)}'
var containerName = 'app-container'

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: storageAccountType
  }
  properties: {
    accessTier: 'Hot'
    minimumTlsVersion: 'TLS1_2'
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2021-06-01' = {
  parent: storageAccount
  name: 'default'
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-06-01' = {
  parent: blobService
  name: containerName
  properties: {
    publicAccess: 'None'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
  }
  properties: {
    reserved: false
  }
}

resource appService 'Microsoft.Web/sites@2021-02-01' = {
  name: appServiceName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
  }
}

resource appSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  parent: appService
  name: 'appsettings'
  properties: {
    STORAGE_CONNECTION_STRING: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${listKeys(storageAccount.id, '2021-06-01').keys[0].value}'
    CONTAINER_NAME: containerName
  }
}
```

### Gestion des Configurations d'Application

L'utilisation de Azure App Configuration permet de centraliser la gestion des configurations d'application[5]. Les configurations sont versionnées, permettant un déploiement progressif et une récupération rapide en cas de problème.

---

## 🔐 Sécurité, Identité et Contrôle d'Accès

### Principes de Sécurité en Couches

La sécurité d'une infrastructure cloud repose sur une approche en couches, intégrant plusieurs niveaux de protection[1]. Cette stratégie de défense en profondeur minimise les risques en combinant plusieurs mécanismes de sécurité.

### Contrôle d'Accès Basé sur les Rôles (RBAC)

Le contrôle d'accès en fonction du rôle Azure (RBAC) contrôle les actions pour les utilisateurs autorisés[3]. RBAC fonctionne en conjonction avec Azure Policy pour établir une gouvernance de sécurité complète.

**Rôles prédéfinis** : Azure fournit des rôles prédéfinis comme Propriétaire, Contributeur, Lecteur et Contributeur de stratégie de ressource.

**Rôles personnalisés** : Les organisations peuvent créer des rôles personnalisés répondant à des besoins spécifiques.

**Attribution de rôles** : L'attribution de rôles s'effectue au niveau du groupe de gestion, abonnement, groupe de ressources ou ressource individuelle.

### Gestion des Identités avec Microsoft Entra

Microsoft Entra (anciennement Azure AD) fournit une gestion centralisée des identités et des accès[3]. La gouvernance des ID Microsoft Entra automatise les flux de travail de demande d'accès, les affectations d'accès, les révisions et l'expiration.

### Configuration de RBAC et Identité

L'implémentation de RBAC et de la gestion d'identité nécessite une configuration précise :

```bicep
param principalId string
param roleDefinitionId string = '8e3af657-a8ff-443c-a75c-2fe8c4bcb635' // Lecteur

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = {
  name: guid(subscription().id, principalId, roleDefinitionId)
  properties: {
    roleDefinitionId: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/${roleDefinitionId}'
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}
```

### Microsoft Defender pour Cloud

Microsoft Defender pour Cloud offre une protection complète de la sécurité[5], fournissant des recommandations de sécurité, la détection des menaces et la réponse aux incidents.

### Azure Key Vault

Azure Key Vault stocke les secrets, certificats et clés de chiffrement de manière sécurisée[5], limitant l'accès aux données sensibles par le biais de la gestion des identités et des accès.

---

## 🔒 Sécurisation Avancée avec les Points de Terminaison Privés

### Architecture des Points de Terminaison Privés

Les points de terminaison privés établissent des connexions privées entre les services Azure et un réseau virtuel, éliminant l'exposition sur l'internet public[1]. Cette architecture avancée renforce significativement la posture de sécurité en restreignant l'accès réseau.

### Avantages des Points de Terminaison Privés

- **Isolation réseau** : Les services ne sont accessibles que depuis le VNet spécifié
- **Absence d'exposition publique** : Les services ne disposent pas d'adresses IP publiques
- **Contrôle du trafic** : Les groupes de sécurité réseau contrôlent strictement le trafic autorisé
- **Conformité renforcée** : Aide au respect des exigences de souveraineté des données

### Exemple de Configuration des Points de Terminaison Privés

La création de points de terminaison privés nécessite la configuration du réseau virtuel et des ressources de service :

```bicep
param location string = resourceGroup().location
param vnetName string
param subnetName string
param storageAccountId string
param privateDnsZoneName string = 'privatelink.blob.core.windows.net'

resource vnet 'Microsoft.Network/virtualNetworks@2021-02-01' existing = {
  name: vnetName
}

resource subnet 'Microsoft.Network/virtualNetworks/subnets@2021-02-01' existing = {
  parent: vnet
  name: subnetName
}

resource privateEndpoint 'Microsoft.Network/privateEndpoints@2021-02-01' = {
  name: 'pep-storage-${uniqueString(storageAccountId)}'
  location: location
  properties: {
    subnet: {
      id: subnet.id
    }
    privateLinkServiceConnections: [
      {
        name: 'storage-connection'
        properties: {
          privateLinkServiceId: storageAccountId
          groupIds: [
            'blob'
          ]
        }
      }
    ]
  }
}

resource privateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: privateDnsZoneName
  location: 'global'
}

resource privateDnsZoneVnetLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: privateDnsZone
  name: '${vnetName}-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnet.id
    }
  }
}

resource privateDnsARecord 'Microsoft.Network/privateDnsZones/A@2020-06-01' = {
  parent: privateDnsZone
  name: 'storage'
  properties: {
    ttl: 3600
    aRecords: [
      {
        ipv4Address: privateEndpoint.properties.customDnsConfigs[0].ipAddresses[0]
      }
    ]
  }
}
```

### Chaîne de Connectivité Sécurisée

L'établissement de la connectivité sécurisée comprend plusieurs étapes[1] :

1. Création du point de terminaison privé dans le VNet
2. Liaison de la zone DNS privée au VNet
3. Configuration des enregistrements DNS pointant vers l'IP privée
4. Mise à jour des configurations d'application pour utiliser le nom DNS privé

### Intégration avec Azure Private Link

Azure Private Link fournit une infrastructure réseau privée et sécurisée permettant l'accès à de nombreux services Azure sans exposition publique.

---

## ⚙️ Automatisation avec Azure Functions

### Architecture Serverless avec Azure Functions

Azure Functions offre une plateforme de calcul serverless permettant d'exécuter du code en réponse à des événements, sans gérer l'infrastructure sous-jacente[5]. Cette architecture élimine la complexité de la gestion des serveurs tout en offrant une scalabilité automatique.

### Déclencheurs et Liaisons

Les fonctions Azure s'activent via des déclencheurs :

- **Déclencheur de minuterie (Timer)** : Exécution selon un calendrier (cron)
- **Déclencheur de file d'attente (Queue)** : Réponse à des messages
- **Déclencheur Blob Storage** : Activation lors de modifications de fichiers
- **Déclencheur HTTP** : Invocation via requêtes HTTP
- **Déclencheur Cosmos DB** : Activation lors de changements de données

Les liaisons (bindings) permettent la connectivité à d'autres services Azure de manière déclarative.

### Exemple de Fonction Azure pour Traitement d'Images

Une fonction Azure typique traite les images uploadées automatiquement :

```python
import azure.functions as func
from azure.storage.blob import BlobServiceClient
import logging

def main(myblob: func.InputStream, context: func.Context) -> None:
    """
    Fonction déclenchée par l'upload d'une image dans Blob Storage.
    Effectue le traitement et stocke les métadonnées.
    """
    logging.info(f"Blob processing: {myblob.name}")
    
    try:
        # Lecture du contenu du blob
        blob_content = myblob.read()
        
        # Traitement du fichier (exemple : validation du format)
        if not is_valid_image(blob_content):
            logging.error("Invalid image format")
            return
        
        # Extraction des métadonnées
        metadata = extract_metadata(blob_content)
        
        # Stockage des métadonnées
        store_metadata(myblob.name, metadata)
        
        logging.info(f"Image processing completed: {myblob.name}")
        
    except Exception as e:
        logging.error(f"Error processing image: {str(e)}")
        raise

def is_valid_image(content):
    """Vérifie si le contenu est une image valide."""
    valid_signatures = {
        b'\xFF\xD8\xFF': 'jpeg',
        b'\x89PNG': 'png',
        b'GIF87a': 'gif',
        b'GIF89a': 'gif'
    }
    return any(content.startswith(sig) for sig in valid_signatures.keys())

def extract_metadata(content):
    """Extrait les métadonnées de l'image."""
    return {
        'size': len(content),
        'format': 'image',
        'processed_at': str(func.datetime.datetime.now())
    }

def store_metadata(blob_name, metadata):
    """Stocke les métadonnées dans une table ou base de données."""
    logging.info(f"Storing metadata for {blob_name}: {metadata}")
```

### Configuration de la Fonction Azure

La configuration s'effectue via un fichier function_app.py ou function.json :

```json
{
  "scriptFile": "function_app.py",
  "bindings": [
    {
      "name": "myblob",
      "type": "blobTrigger",
      "direction": "in",
      "path": "images/{name}",
      "connection": "AzureWebJobsStorage"
    },
    {
      "name": "tableOutput",
      "type": "table",
      "direction": "out",
      "tableName": "ImageMetadata",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

### Orchestration d'Activités Complexes

Pour les workflows complexes impliquant plusieurs étapes, Durable Functions permet l'orchestration d'activités avec gestion d'état et de transactions :

```python
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    """Orchestre le traitement d'image en plusieurs étapes."""
    
    # Étape 1 : Téléchargement et validation
    upload_result = yield context.call_activity('validate_image', 'image_id')
    
    if not upload_result['valid']:
        return {'status': 'failed', 'reason': 'Invalid image'}
    
    # Étape 2 : Redimensionnement
    resize_result = yield context.call_activity('resize_image', upload_result)
    
    # Étape 3 : Extraction de métadonnées
    metadata = yield context.call_activity('extract_metadata', resize_result)
    
    # Étape 4 : Stockage
    storage_result = yield context.call_activity('store_metadata', metadata)
    
    return {
        'status': 'completed',
        'original': upload_result,
        'processed': resize_result,
        'metadata': metadata
    }
```

### Intégration avec d'Autres Services

Azure Functions s'intègre naturellement avec d'autres services Azure via les liaisons[5], créant une architecture sans serveur complète pour les traitements automatisés.

---

## 📸 Upload et Affichage des Images

### Architecture d'Upload d'Images

L'implémentation d'un système complet d'upload et d'affichage d'images comprend plusieurs composants :

- **Interface utilisateur** : Application web permettant la sélection et l'upload de fichiers
- **API de réception** : Endpoint HTTP recevant et validant les uploads
- **Stockage** : Blob Storage Azure pour la persistance des images
- **Processing** : Functions pour le traitement et l'optimisation
- **Delivery** : CDN pour la distribution optimisée

### Exemple d'API d'Upload avec Validation

Une API HTTP gère les uploads avec validation et gestion d'erreurs :

```python
import azure.functions as func
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta
import hashlib
import logging
import os

async def main(req: func.HttpRequest) -> func.HttpResponse:
    """
    API endpoint pour l'upload d'images.
    Accepte multipart/form-data avec fichier image.
    """
    try:
        # Récupération du fichier uploadé
        uploaded_file = req.files.get('file')
        if not uploaded_file:
            return func.HttpResponse(
                '{"error": "No file provided"}',
                status_code=400
            )
        
        # Validation du type de fichier
        if not is_valid_image_type(uploaded_file.filename):
            return func.HttpResponse(
                '{"error": "Invalid file type. Only images allowed"}',
                status_code=400
            )
        
        # Validation de la taille
        file_content = uploaded_file.read()
        max_size = 10 * 1024 * 1024  # 10 MB
        if len(file_content) > max_size:
            return func.HttpResponse(
                '{"error": "File too large. Maximum 10MB"}',
                status_code=400
            )
        
        # Génération d'un nom unique pour le fichier
        file_hash = hashlib.md5(file_content).hexdigest()
        file_extension = os.path.splitext(uploaded_file.filename)[1]
        blob_name = f"images/{datetime.utcnow().strftime('%Y/%m/%d')}/{file_hash}{file_extension}"
        
        # Upload vers Blob Storage
        connection_string = os.environ['AzureWebJobsStorage']
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        blob_client = blob_service_client.get_blob_client(
            container='uploads',
            blob=blob_name
        )
        
        blob_client.upload_blob(file_content, overwrite=True)
        
        # Génération d'une URL SAS avec expiration
        sas_url = generate_blob_sas(
            account_name=blob_service_client.account_name,
            container_name='uploads',
            blob_name=blob_name,
            account_key=os.environ['STORAGE_ACCOUNT_KEY'],
            permission=BlobSasPermissions(read=True),
            expiry=datetime.utcnow() + timedelta(days=365)
        )
        
        full_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/uploads/{blob_name}?{sas_url}"
        
        return func.HttpResponse(
            f'{{"success": true, "url": "{full_url}", "blob_name": "{blob_name}"}}',
            status_code=200,
            mimetype="application/json"
        )
        
    except Exception as e:
        logging.error(f"Error uploading file: {str(e)}")
        return func.HttpResponse(
            f'{{"error": "{str(e)}"}}',
            status_code=500,
            mimetype="application/json"
        )

def is_valid_image_type(filename):
    """Valide l'extension du fichier."""
    valid_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    _, ext = os.path.splitext(filename.lower())
    return ext in valid_extensions
```

### Interface Frontend pour l'Upload

L'interface utilisateur facilite l'upload et l'affichage des images :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload et Affichage d'Images</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 600px;
            width: 100%;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .upload-area {
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #f8f9ff;
        }
        
        .upload-area:hover {
            border-color: #764ba2;
            background: #f0f2ff;
        }
        
        .upload-area.dragover {
            border-color: #764ba2;
            background: #e8ebff;
            transform: scale(1.02);
        }
        
        .upload-area p {
            color: #666;
            margin: 10px 0;
        }
        
        #fileInput {
            display: none;
        }
        
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .progress {
            margin-top: 20px;
            display: none;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.3s ease;
        }
        
        .images-grid {
            margin-top: 40px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .image-card {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .image-card:hover {
            transform: scale(1.05);
        }
        
        .image-card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
        }
        
        .error {
            color: #d32f2f;
            background: #ffebee;
            padding: 12px;
            border-radius: 5px;
            margin-top: 15px;
            display: none;
        }
        
        .success {
            color: #388e3c;
            background: #e8f5e9;
            padding: 12px;
            border-radius: 5px;
            margin-top: 15px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📸 Upload d'Images</h1>
            <p>Glissez-déposez ou cliquez pour sélectionner une image</p>
        </div>
        
        <div class="upload-area" id="uploadArea">
            <p>Glissez une image ici</p>
            <button class="btn" onclick="document.getElementById('fileInput').click()">
                Sélectionner une image
            </button>
            <input type="file" id="fileInput" accept="image/*">
        </div>
        
        <div class="progress" id="progress">
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
        </div>
        
        <div class="error" id="error"></div>
        <div class="success" id="success"></div>
        
        <div class="images-grid" id="imagesGrid"></div>
    </div>
    
    <script>
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const progress = document.getElementById('progress');
        const progressFill = document.getElementById('progressFill');
        const errorDiv = document.getElementById('error');
        const successDiv = document.getElementById('success');
        const imagesGrid = document.getElementById('imagesGrid');
        
        // Gestion du glisser-déposer
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                uploadFile(files[0]);
            }
        });
        
        // Gestion de la sélection de fichier
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                uploadFile(e.target.files[0]);
            }
        });
        
        async function uploadFile(file) {
            // Validation du type
            if (!file.type.startsWith('image/')) {
                showError('Veuillez sélectionner une image valide');
                return;
            }
            
            // Validation de la taille
            if (file.size > 10 * 1024 * 1024) {
                showError('La taille du fichier ne doit pas dépasser 10 MB');
                return;
            }
            
            const formData = new FormData();
            formData.append('file', file);
            
            progress.style.display = 'block';
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            
            try {
                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        progressFill.style.width = percentComplete + '%';
                    }
                });
                
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        addImageToGrid(response.url, file.name);
                        showSuccess('Image uploadée avec succès');
                        fileInput.value = '';
                        progressFill.style.width = '0%';
                    } else {
                        const error = JSON.parse(xhr.responseText);
                        showError(error.error || 'Erreur lors de l\'upload');
                    }
                });
                
                xhr.addEventListener('error', () => {
                    showError('Erreur de connexion');
                });
                
                xhr.open('POST', '/api/upload');
                xhr.send(formData);
                
            } catch (error) {
                showError('Erreur: ' + error.message);
            }
        }
        
        function addImageToGrid(imageUrl, imageName) {
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            imageCard.innerHTML = `<img src="${imageUrl}" alt="${imageName}" title="${imageName}">`;
            imagesGrid.appendChild(imageCard);
        }
        
        function showError(message) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
        
        function showSuccess(message) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 5000);
        }
    </script>
</body>
</html>
```

### Optimisation du Stockage et de la Distribution

Les images uploadées bénéficient d'une optimisation automatique :

- **Redimensionnement** : Création de thumbnails et de versions optimisées
- **Compression** : Réduction de la taille sans perte de qualité
- **CDN** : Distribution globale via Azure Content Delivery Network

---

## 🌍 Routage Global, Surveillance et Opérations

### Architecture Globale avec Azure Front Door

Azure Front Door fournit un routage global intelligent et une accélération des applications au niveau mondial[1]. Ce service assure une latence minimale en dirigeant les utilisateurs vers les serveurs les plus proches.

### Surveillance Complète avec Azure Monitor

Azure Monitor offre une observabilité complète des applications, de l'infrastructure et du réseau[1]. La surveillance s'effectue à travers plusieurs couches :

**Métriques** : Indicateurs de performance en temps réel collectés automatiquement.

**Journaux** : Événements détaillés stockés dans Log Analytics permettant l'analyse approfondie.

**Traces distribuées** : Suivi des requêtes à travers les services distribués.

**Alertes** : Notifications automatiques lorsque les seuils sont dépassés.

### Configuration de Surveillance avec Application Insights

Application Insights intègre la surveillance des applications à Azure Monitor :

```bicep
param location string = resourceGroup().location
param appName string = 'myapp'
param environment string = 'prod'

var workspaceName = '${appName}-workspace-${environment}'
var appInsightsName = '${appName}-ai-${environment}'

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-06-01' = {
  name: workspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: workspace.id
    RetentionInDays: 30
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource alertActionGroup 'Microsoft.Insights/actionGroups@2021-09-01' = {
  name: '${appName}-alerts-${environment}'
  location: 'global'
  properties: {
    groupShortName: 'AlertGroup'
    enabled: true
  }
}

resource highCpuAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: '${appName}-cpu-alert-${environment}'
  location: 'global'
  properties: {
    description: 'Alert when CPU usage exceeds 80%'
    severity: 2
    enabled: true
    scopes: [
      appInsights.id
    ]
    evaluationFrequency: 'PT5M'
    windowSize: 'PT15M'
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
      allOf: [
        {
          name: 'Percentage CPU'
          metricName: 'Percentage CPU'
          operator: 'GreaterThan'
          threshold: 80
          timeAggregation: 'Average'
        }
      ]
    }
    actions: [
      {
        actionGroupId: alertActionGroup.id
      }
    ]
  }
}
```

### Requêtes KQL pour l'Analyse Avancée

Le langage de requête Kusto (KQL) permet des analyses avancées des journaux :

```kusto
// Analyse du taux d'erreur par endpoint
requests
| where timestamp > ago(24h)
| summarize 
    TotalRequests=count(),
    FailedRequests=sum(toint(success == false)),
    ErrorRate=100*sum(toint(success == false))/count()
    by name
| order by ErrorRate desc

// Identification des utilisateurs affectés par les erreurs
requests
| where success == false and timestamp > ago(1h)
| join (users) on user_Id
| project 
    timestamp,
    name,
    resultCode,
    user_AuthenticatedId,
    client_City

// Performance des dépendances externes
dependencies
| where timestamp > ago(24h)
| summarize 
    AvgDuration=avg(duration),
    P95Duration=percentile(duration, 95),
    FailureCount=sum(toint(success == false))
    by target
| order by AvgDuration desc

// Analyse des exceptions
exceptions
| where timestamp > ago(24h)
| summarize 
    Count=count(),
    UniqueUsers=dcount(user_Id)
    by exceptionType
| order by Count desc
```

### Configuration de la Disponibilité Globale

La gestion des instances distribuées à travers plusieurs régions assure la résilience[1] :

| Aspect | Configuration | Bénéfice |
|--------|--------------|----------|
| **Zones de disponibilité** | Déploiement dans 3 zones | Tolérance aux pannes de zone |
| **Géoredondance** | Réplication multi-régions | Continuité en cas de catastrophe régionale |
| **Équilibrage de charge** | Load Balancer Azure | Distribution du trafic |
| **Basculement automatique** | Traffic Manager | Redirection rapide en cas de panne |

### Gestion des Logs et Diagnostics

La capture des diagnostics s'effectue à plusieurs niveaux :

```bicep
param location string = resourceGroup().location
param appName string
param diagnosticsRetentionDays int = 30

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${appName}-diag'
  properties: {
    workspaceId: workspace.id
    logs: [
      {
        category: 'FunctionAppLogs'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: diagnosticsRetentionDays
        }
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: diagnosticsRetentionDays
        }
      }
    ]
  }
}
```

### Tableaux de Bord et Rapports de Synthèse

Les tableaux de bord consolident les métriques critiques pour une visualisation centralisée :

| Métrique | Seuil d'alerte | Fréquence | Action |
|----------|----------------|-----------|--------|
| **Disponibilité** | < 99.5% | Horaire | Escalade |
| **Latence P95** | > 500ms | Continues | Investigation |
| **Taux d'erreur** | > 0.5% | Continues | Alerte |
| **Utilisation CPU** | > 80% | 5 minutes | Scaling |
| **Utilisation mémoire** | > 85% | 5 minutes | Redémarrage |

---

## 🎯 Synthèse du Parcours d'Apprentissage

Le projet cloud complet représente une progression logique intégrant tous les aspects de l'infrastructure Azure moderne. Le chemin d'apprentissage commence par les fondations architecturales et gouvernance, progressant vers l'automatisation et la surveillance avancée.

**Phase 1 - Fondations** : Architecture, gouvernance et planification établissent le socle permettant des déploiements cohérents et conformes.

**Phase 2 - Infrastructure** : Le déploiement de l'infrastructure de base et des applications crée l'environnement d'exécution.

**Phase 3 - Sécurité** : La sécurité, l'identité et le contrôle d'accès protègent les ressources et les données.

**Phase 4 - Optimisation** : Les points de terminaison privés, l'automatisation et le routage global optimisent performance, coûts et résilience.

**Phase 5 - Observabilité** : La surveillance et les opérations complètent la chaîne, assurant une gestion proactive et une amélioration continue.

Cette architecture intégrée fournit les bases pour construire des applications cloud scalables, sécurisées et performantes dans Azure, avec une approche systématique de la gestion, de la gouvernance et de l'optimisation opérationnelle.
