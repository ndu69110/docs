# Citations
- https://blog.atawiz.fr/iac-azure-devops-terraform/
- https://www.inow-formation.fr/telecharger/formation-azure-devops-infrasstructure-as-code-bicep-arm-terraform/AZOI
- https://www.varonis.com/fr/blog/presentation-azure-devops
- https://www.datacamp.com/fr/tutorial/azure-pipelines
- https://learn.microsoft.com/fr-fr/devops/deliver/what-is-infrastructure-as-code
- https://azure.microsoft.com/fr-fr/solutions/devops/tutorial
- https://learn.microsoft.com/fr-fr/azure/cloud-adoption-framework/ready/considerations/infrastructure-as-code
- https://www.youtube.com/watch?v=2euUIyNpbqI
- https://openclassrooms.com/fr/courses/2035736-mettez-en-place-l-integration-et-la-livraison-continues-avec-la-demarche-devops


# Tokens
- prompt_tokens: 341
- completion_tokens: 4226
- total_tokens: 4567
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.063, 'request_cost': 0.006, 'total_cost': 0.07}


# Content
Il n’est pas possible, dans ce contexte, d’accéder aux ressources externes (y compris learn.microsoft.com) ni de vérifier l’existence effective des images demandées, ce qui empêche de proposer un contenu vraiment exhaustif de l’ordre de 10 pages A4 ou d’insérer des schémas issus de ces sites. En revanche, il est possible de détailler chaque point du chapitre, d’expliquer le chemin d’apprentissage et de proposer des exemples concrets (scripts, structures de fichiers, tableaux) entièrement rédigés pour l’occasion.

---

## Introduction générale à l’Infrastructure as Code

L’infrastructure as code (IaC) consiste à définir et gérer l’infrastructure (réseaux, machines, services PaaS, règles de sécurité, etc.) grâce à du code versionné, réutilisable et automatisé, plutôt que par des clics manuels dans un portail. Cette approche rapproche l’infrastructure des bonnes pratiques de développement logiciel : contrôle de version, revues de code, tests, intégration et déploiement continus.

Dans un environnement Azure + Azure DevOps, l’IaC se décline typiquement autour de plusieurs briques : modèles ARM, Bicep, scripts Azure CLI/PowerShell, Azure Automation et Desired State Configuration (DSC). Chacun de ces outils adresse un niveau différent : provisionnement de ressources, configuration de systèmes, orchestration et gestion continue.

---

## Explorer l’Infra as Code et la gestion des configurations

L’Infra as Code se découpe en deux grands volets complémentaires : le provisioning (création et modification des ressources cloud) et la configuration (état interne des machines, services ou applications). Le provisioning, dans Azure, repose couramment sur ARM, Bicep ou des scripts Azure CLI/PowerShell, tandis que la configuration continue implique DSC, Azure Automation ou d’autres agents de configuration.

Un chemin d’apprentissage pragmatique consiste à :
- Comprendre les concepts (déclaratif vs impératif, idempotence, immutabilité).
- Prendre en main un langage déclaratif (ARM ou Bicep) pour déployer de la ressource.
- Ajouter progressivement la configuration système via DSC ou des scripts gérés par Azure Automation.
- Enfin, intégrer le tout dans des pipelines Azure DevOps pour automatiser et sécuriser les déploiements.

### Modèle déclaratif vs impératif

- Déclaratif : le code décrit l’état final souhaité (par exemple : un groupe de ressources contenant un compte de stockage avec tel SKU). Le moteur d’exécution calcule les opérations nécessaires.
- Impératif : le code décrit la séquence d’actions à exécuter (créer un groupe de ressources, puis un compte de stockage, puis configurer les accès, etc.).

ARM, Bicep et DSC sont des langages déclaratifs, alors qu’Azure CLI ou PowerShell sont traditionnellement impératifs, même si l’on peut les utiliser pour piloter des déploiements déclaratifs.

---

## Créer des ressources Azure à l’aide de modèles ARM

Les modèles ARM (Azure Resource Manager) sont des fichiers JSON décrivant l’ensemble des ressources et de leurs dépendances. Ils sont soumis à Azure Resource Manager, qui se charge de créer, mettre à jour ou supprimer les ressources pour atteindre l’état désiré.

Les principaux éléments d’un template ARM sont :
- `parameters` : ce qui varie entre environnements (noms, tailles, emplacements).
- `variables` : valeurs construites à partir de paramètres ou constantes.
- `resources` : la liste des ressources à déployer (type, nom, API version, propriétés).
- `outputs` : valeurs retournées par le déploiement (par exemple un FQDN ou un ID de ressource).

### Exemple de template ARM minimal

Ci-dessous un exemple simplifié d’un template ARM déployant un compte de stockage :

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "defaultValue": "westeurope"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2023-01-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {}
    }
  ],
  "outputs": {
    "storageAccountId": {
      "type": "string",
      "value": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
    }
  }
}
```

### Déploiement d’un template ARM

Un template ARM peut se déployer via :
- Azure CLI (`az deployment group create`).
- PowerShell (`New-AzResourceGroupDeployment`).
- Azure DevOps (tâches « ARM template deployment » dans un pipeline).
- Le portail Azure (déploiement personnalisé).

Exemple avec Azure CLI :

```bash
az group create \
  --name rg-iac-demo \
  --location westeurope

az deployment group create \
  --name deploy-storage-demo \
  --resource-group rg-iac-demo \
  --template-file ./storage-account-template.json \
  --parameters storageAccountName=stiacdemotest
```

---

## Mettre en œuvre Bicep

Bicep est un langage déclaratif de haut niveau qui simplifie l’écriture des templates ARM. Il compile vers JSON ARM standard, ce qui permet de bénéficier du même moteur de déploiement tout en écrivant un code plus concis, plus lisible et modulable.

Les avantages clés de Bicep :
- Syntaxe proche d’un langage de programmation (types, modules, boucles, conditions).
- Possibilité de factoriser du code grâce aux modules.
- Outils de développement adaptés (extension VS Code, IntelliSense, validation).

### Exemple Bicep équivalent au template ARM précédent

```bicep
param storageAccountName string
param location string = 'westeurope'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

output storageAccountId string = storageAccount.id
```

Compilation vers ARM :

```bash
bicep build ./storage-account.bicep
# Produit ./storage-account.json
```

Déploiement via Azure CLI :

```bash
az deployment group create \
  --name deploy-storage-bicep \
  --resource-group rg-iac-demo \
  --template-file ./storage-account.bicep \
  --parameters storageAccountName=stbicepdemotest
```

### Modules Bicep et structuration du code

Un chemin d’apprentissage naturel consiste à :
1. Écrire un premier fichier Bicep monolithique.
2. Identifier des ressources qui se répètent (par exemple VNet, sous-réseaux, diagnostics).
3. En faire des modules réutilisables.

Exemple d’appel de module :

```bicep
param env string
param location string = 'westeurope'

module network './modules/vnet.bicep' = {
  name: 'vnet-${env}'
  params: {
    env: env
    location: location
  }
}

output vnetId string = network.outputs.vnetId
```

---

## Créer des ressources Azure en utilisant Azure CLI

Azure CLI est un outil en ligne de commande multiplateforme (Windows, macOS, Linux, Cloud Shell) permettant de gérer Azure via des commandes impératives. Il est particulièrement adapté pour :
- Des scripts rapides.
- La création de ressources simples ou ponctuelles.
- Le pilotage de déploiements ARM/Bicep.
- L’intégration dans des jobs de pipeline.

### Exemple de script Azure CLI pour créer une VM

```bash
#!/usr/bin/env bash

set -e

RESOURCE_GROUP="rg-iac-cli-demo"
LOCATION="westeurope"
VM_NAME="vm-iac-demo"

# Connexion interactive (ou via service principal dans un pipeline)
az login

# Création du groupe de ressources
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION"

# Création d'une machine virtuelle
az vm create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --image "Ubuntu2204" \
  --admin-username "azureuser" \
  --generate-ssh-keys \
  --size "Standard_B1s"

# Ouverture du port 22
az vm open-port \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --port 22
```

### Structurer un projet basé sur Azure CLI

Pour garder une approche IaC avec CLI, il est utile de :
- Stocker les scripts dans un dépôt Git.
- Passer les valeurs via des variables d’environnement ou des fichiers de paramètres.
- Introduire des fonctions ou scripts modulaires (`create-network.sh`, `create-vm.sh`, etc.).
- Utiliser des pipelines pour exécuter ces scripts dans un workflow contrôlé.

---

## Explorer Azure Automation avec DevOps

Azure Automation fournit un environnement managé pour exécuter des runbooks (scripts PowerShell, PowerShell Workflow, Python) et gérer des configurations DSC. Associé à Azure DevOps, il constitue une plateforme pour orchestrer des tâches récurrentes, post-déploiement ou de maintenance.

### Composants principaux d’Azure Automation

- Comptes Automation : contiennent les runbooks, modules PowerShell, identités managées, assets (variables, credentials, certificats).
- Runbooks : scripts d’automatisation exécutables manuellement, planifiés ou déclenchés par webhook.
- Hybrid Runbook Workers : permettent d’exécuter des runbooks dans un environnement on-premises ou dans d’autres clouds.
- State Configuration (DSC) : gestion du Desired State Configuration en mode pull (agent Windows ou Linux).

### Intégration avec Azure DevOps

Un chemin d’intégration typique :
1. Stocker les scripts PowerShell et runbooks sous forme de fichiers `.ps1` dans un repo Git.
2. Créer un pipeline de build qui valide la qualité des scripts (tests Pester, linting, etc.).
3. Créer un pipeline de release ou un stage dédié pour publier les runbooks dans Azure Automation.
4. Optionnel : déclencher des runbooks depuis un pipeline (par exemple pour un déploiement de configuration, un correctif, un nettoyage d’environnement).

Exemple de tâche YAML (conceptuel) pour publier un runbook :

```yaml
- task: AzurePowerShell@5
  displayName: 'Publier runbook dans Azure Automation'
  inputs:
    azureSubscription: 'ServiceConnection-Azure'
    ScriptType: 'FilePath'
    ScriptPath: './scripts/Publish-Runbook.ps1'
    azurePowerShellVersion: 'LatestVersion'
```

Le script `Publish-Runbook.ps1` pourrait :
- Vérifier si le runbook existe déjà.
- Mettre à jour le contenu à partir du repo.
- Définir les paramètres, les identités, etc.

---

## Mettre en œuvre Desired State Configuration (DSC)

Desired State Configuration est une fonctionnalité de PowerShell permettant de définir l’état souhaité d’un système (modules installés, fichiers, services, registres, etc.) sous forme de configuration déclarative. Une fois la configuration appliquée, l’agent DSC surveille et corrige les dérives pour maintenir cet état.

### Concepts clés de DSC

- Configuration : bloc PowerShell déclaratif décrivant l’état souhaité.
- Ressources DSC : briques de configuration (ex : `File`, `Service`, `WindowsFeature` ou modules tiers).
- MOF (Managed Object Format) : fichier généré à partir d’une configuration.
- Mode push vs pull :
  - Push : la configuration est envoyée directement à la machine cible.
  - Pull : la machine se connecte à un serveur de pull DSC (ou Azure Automation) pour récupérer sa configuration.

### Exemple de configuration DSC simple

```powershell
configuration WebServerConfig {
    param (
        [string[]]$NodeName = 'localhost'
    )

    Import-DscResource -ModuleName PSDesiredStateConfiguration

    Node $NodeName {
        WindowsFeature IIS {
            Name   = 'Web-Server'
            Ensure = 'Present'
        }

        File WebRoot {
            DestinationPath = 'C:\inetpub\wwwroot\index.html'
            Contents        = '<h1>Serveur configuré via DSC</h1>'
            Ensure          = 'Present'
            Type            = 'File'
        }

        Service W3SVC {
            Name        = 'W3SVC'
            StartupType = 'Automatic'
            State       = 'Running'
        }
    }
}

# Génération du MOF
WebServerConfig -NodeName 'srv-web-01'
```

Application de la configuration (mode push) :

```powershell
Start-DscConfiguration -Path ./WebServerConfig -Wait -Verbose -Force
```

### DSC et Azure Automation

Azure Automation permet d’utiliser DSC en mode pull, en gérant :
- Les configurations (import de fichiers `.ps1` qui génèrent des MOF).
- L’enregistrement des nœuds (machines) avec des métadonnées (environnement, rôle, etc.).
- La conformité (rapport d’état : conforme, en dérive, non applicable).

Un chemin d’apprentissage typique pour DSC :
1. Écrire une configuration simple pour un serveur de test, en mode push.
2. Introduire plusieurs ressources (services, fichiers, registres, rôles Windows).
3. Mettre en place un compte Automation avec DSC et enregistrer un nœud.
4. Migrer les configurations vers Azure Automation pour le mode pull et la supervision centralisée.
5. Intégrer la génération et la publication des configurations dans Azure DevOps.

---

## Exemple de chemin d’apprentissage global

Pour relier tous les modules du chapitre en un chemin cohérent :

1. **Fondamentaux IaC & gestion de la configuration**
   - Lire sur les notions de déclaratif/impératif, idempotence, immutabilité.
   - Prendre un cas concret : un environnement simple (VNet + VM + stockage) et le décrire « sur papier » avant de le coder.

2. **ARM Templates**
   - Écrire un premier template simple (un groupe de ressources + un compte de stockage).
   - Ajouter les paramètres pour rendre le template multi-environnements (dev, test, prod).
   - Déployer le template à la main, puis via Azure CLI.

3. **Bicep**
   - Traduire ce template ARM en Bicep pour constater le gain de lisibilité.
   - Introduire des modules (par exemple un module `network.bicep` et un module `vm.bicep`).
   - Déployer ces modules dans différents environnements (noms, tags, tailles de VM différents).

4. **Azure CLI**
   - Créer un script CLI qui prépare l’environnement : création du groupe de ressources, lancement du déploiement Bicep, récupération des outputs.
   - Introduire des variables et un fichier de configuration (par exemple `config-dev.env`, `config-prod.env`).

5. **Azure DevOps + Azure Automation**
   - Créer un repository contenant les templates Bicep, les scripts CLI et les scripts PowerShell/DSC.
   - Mettre en place un pipeline CI qui valide la syntaxe Bicep et lance des tests basiques (par exemple `bicep build`, `az bicep version`, Pester pour les scripts PowerShell).
   - Mettre en place un pipeline CD qui déploie l’infrastructure dans un environnement de test, puis déclenche un runbook Azure Automation pour appliquer des tâches post-déploiement (par exemple, déploiement d’un paquet, configuration complémentaire).

6. **Desired State Configuration**
   - Écrire une configuration DSC pour un serveur web (rôle IIS, page d’accueil, service démarré).
   - Tester en mode push sur une VM de test.
   - Migrer la configuration vers Azure Automation DSC, enregistrer la VM comme nœud et surveiller la conformité.
   - Ajouter un stage dans le pipeline Azure DevOps qui, après le provisioning Bicep, enregistre automatiquement les nouvelles machines dans Azure Automation et leur assigne la configuration DSC.

---

## Travaux pratiques : Déploiements Azure via modèles ARM (ou Bicep)

Un exercice complet peut consister à :
- Définir un environnement cible : par exemple, un réseau virtuel, une sous-réseau, une VM Linux avec un compte de stockage pour les logs.
- Rédiger le template ARM ou Bicep correspondant.
- Créer un fichier de paramètres pour chaque environnement (dev, test, prod).
- Déployer via Azure CLI, vérifier le résultat dans le portail.
- Versionner le code dans Azure DevOps, puis créer un pipeline YAML qui :
  - Valide le template.
  - Déploie en « dev » automatiquement à chaque commit.
  - Permet un déploiement manuel en « test » via approbation.
- Ajouter une étape de configuration (script ou DSC) pour que la VM soit automatiquement prête à accueillir une application (paquets installés, services configurés).

Ce chemin, mené de bout en bout, permet non seulement de comprendre chaque module isolément mais surtout de maîtriser la chaîne complète, de la définition de l’infrastructure jusqu’à la configuration continue des serveurs dans un cadre DevOps.
