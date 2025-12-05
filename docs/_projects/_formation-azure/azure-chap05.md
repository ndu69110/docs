# Citations
- https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/tutorial-create-and-manage-powershell
- https://www.youtube.com/watch?v=akjcVxHAAM0
- https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/tutorial-create-and-manage-cli
- https://docs.azure.cn/en-us/virtual-machine-scale-sets/tutorial-create-and-manage-powershell
- https://learn.microsoft.com/es-es/azure/virtual-machine-scale-sets/tutorial-create-and-manage-cli
- https://learn.microsoft.com/es-es/azure/virtual-machine-scale-sets/tutorial-create-and-manage-powershell
- https://learn.microsoft.com/es-es/azure/virtual-machine-scale-sets/
- https://www.youtube.com/watch?v=0KVNlOStnRY
- https://learn.microsoft.com/es-es/azure/virtual-machine-scale-sets/tutorial-use-disks-powershell


# Tokens
- prompt_tokens: 344
- completion_tokens: 9487
- total_tokens: 9831
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.142, 'request_cost': 0.006, 'total_cost': 0.149}


# Content
# Les Services de Calcul Azure : Guide Complet de Formation

## Présentation des Services de Calcul Azure

Les services de calcul Azure représentent l'ensemble des solutions proposées par Microsoft pour exécuter des applications, traiter des données et héberger des services dans le cloud. Ces services se distinguent par leur flexibilité, leur scalabilité et leur capacité à s'adapter à différents scénarios d'utilisation, allant des charges de travail traditionnelles aux architectures serverless modernes.

Azure propose une gamme diversifiée de services de calcul qui s'étendent sur un spectre allant du contrôle complet de l'infrastructure jusqu'à l'abstraction totale de celle-ci. Cette approche multi-niveaux permet aux organisations de choisir le niveau de gestion approprié selon leurs besoins spécifiques, leurs compétences techniques et leur modèle de coûts préféré.

## Présentation des Machines Virtuelles Azure

### Vue d'ensemble

Les Machines Virtuelles Azure constituent le fondement de l'infrastructure cloud proposée par Microsoft. Elles offrent un contrôle complet sur l'environnement d'exécution, permettant aux organisations de déployer des systèmes d'exploitation (Windows ou Linux) avec une configuration entièrement personnalisable[1].

Les machines virtuelles Azure fonctionnent selon un modèle de consommation à la demande, où les utilisateurs paient exclusivement pour les ressources utilisées. Ce modèle inclut le temps de calcul, le stockage associé et les transferts de données réseau sortants.

### Caractéristiques principales

**Flexibilité de configuration** : Les machines virtuelles Azure permettent une personnalisation complète de la configuration matérielle virtuelle, incluant le processeur, la mémoire RAM, le stockage et les adaptateurs réseau. Les administrateurs bénéficient d'un accès administrateur/root complet au système d'exploitation.

**Diversité des systèmes d'exploitation** : Azure supporte une large gamme de systèmes d'exploitation, notamment les distributions Linux populaires (Ubuntu, CentOS, Red Hat) et les variantes Windows (Windows Server 2019, 2022, etc.).

**Scalabilité verticale et horizontale** : Les machines virtuelles peuvent être redimensionnées pour augmenter ou réduire les ressources (scalabilité verticale), ou des instances multiples peuvent être déployées derrière un équilibreur de charge (scalabilité horizontale).

**Options de stockage avancées** : Azure propose plusieurs types de disques managés offrant différents niveaux de performance (SSD Premium, SSD Standard, HDD Standard), permettant d'optimiser les coûts selon les exigences d'I/O.

### Types de machines virtuelles disponibles

Azure propose plusieurs gammes de machines virtuelles optimisées pour différentes charges de travail :

| Gamme | Utilisation | Exemples |
|-------|-----------|----------|
| **Calcul optimisé** | Applications haute performance, analyse de données | F, Fsv2, Fx |
| **Mémoire optimisée** | Bases de données, caches, analyse en mémoire | D, E, M |
| **Stockage optimisé** | Data warehouse, bases de données NoSQL | L, Lsv2 |
| **GPU optimisé** | Machine Learning, rendu graphique | NC, ND, NV |
| **Usage général** | Applications web, petites bases de données | A, B, D |

## Création d'une Première VM Linux et Connexion SSH

### Processus de création via Azure PowerShell

La création d'une première machine virtuelle Linux constitue l'étape fondamentale pour débuter avec les ressources de calcul Azure. Le processus implique plusieurs étapes : préparation des identifiants, création du groupe de ressources, configuration de la machine virtuelle et établissement de la connexion.

### Étapes préalables

Avant de créer une machine virtuelle, il faut d'abord établir les éléments de base de l'infrastructure Azure :

```powershell
# Configuration initiale - Authentification auprès d'Azure
Connect-AzAccount

# Définition du contexte (abonnement)
Set-AzContext -SubscriptionId "votre-id-abonnement"

# Création du groupe de ressources
$resourceGroupName = "myResourceGroup"
$location = "EastUS"
New-AzResourceGroup -Name $resourceGroupName -Location $location
```

### Création de la machine virtuelle Linux

```powershell
# Définition des paramètres de la VM
$vmName = "myLinuxVM"
$computerName = "linuxvm01"
$vmSize = "Standard_B2s"

# Configuration des identifiants administrateur
$adminUsername = "azureuser"
$adminPassword = ConvertTo-SecureString "Passw0rd123!" -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($adminUsername, $adminPassword)

# Création de la configuration de la VM
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize $vmSize

# Configuration du système d'exploitation (Ubuntu 20.04 LTS)
$vmConfig = Set-AzVMOperatingSystem -VM $vmConfig -Linux -ComputerName $computerName -Credential $credential

# Définition de l'image de marché (Ubuntu)
$vmConfig = Set-AzVMSourceImage -VM $vmConfig -PublisherName "Canonical" `
    -Offer "0001-com-ubuntu-server-focal" -Skus "20_04-lts-gen2" -Version "latest"

# Configuration de la carte réseau
$subnetConfig = New-AzVirtualNetworkSubnetConfig -Name "default" -AddressPrefix "10.0.0.0/24"
$vnetConfig = New-AzVirtualNetwork -ResourceGroupName $resourceGroupName `
    -Location $location -Name "myVnet" -AddressPrefix "10.0.0.0/16" `
    -Subnet $subnetConfig

$nicConfig = New-AzNetworkInterface -ResourceGroupName $resourceGroupName `
    -Location $location -Name "myNIC" -Subnet $vnetConfig.Subnets[0]

$vmConfig = Add-AzVMNetworkInterface -VM $vmConfig -Id $nicConfig.Id

# Création de la machine virtuelle
New-AzVM -ResourceGroupName $resourceGroupName -Location $location -VM $vmConfig
```

### Configuration SSH et connexion

Après la création de la machine virtuelle, l'accès SSH doit être configuré. Azure permet d'utiliser soit des mots de passe, soit des clés publiques SSH pour l'authentification.

```powershell
# Génération d'une paire de clés SSH (sur la machine locale)
# Sur Linux/Mac
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa

# Récupération de l'adresse IP publique de la VM
$publicIP = Get-AzPublicIpAddress -ResourceGroupName $resourceGroupName `
    -Name "myPublicIP"
$ipAddress = $publicIP.IpAddress

# Connexion SSH à la machine virtuelle
# ssh azureuser@votre-adresse-ip-publique
```

### Connexion depuis un terminal

```bash
# Connexion SSH basique avec mot de passe
ssh azureuser@<adresse-ip-publique>

# Connexion SSH avec clé privée
ssh -i ~/.ssh/id_rsa azureuser@<adresse-ip-publique>
```

Une fois connecté, l'utilisateur accède à un shell Linux avec les droits de l'utilisateur configuré. Pour effectuer des opérations administratives, la commande `sudo` peut être utilisée.

```bash
# Vérification de la version du système d'exploitation
lsb_release -a

# Mise à jour des packages système
sudo apt update && sudo apt upgrade -y

# Installation d'outils supplémentaires
sudo apt install -y curl wget git
```

## Création d'une Première VM Windows et Connexion RDP

### Configuration et création d'une machine virtuelle Windows

La création d'une machine virtuelle Windows suit un processus similaire à celui de Linux, mais avec des spécificités propres à Windows et à l'authentification RDP.

### Préparation et création

```powershell
# Paramètres de la machine virtuelle Windows
$vmName = "myWindowsVM"
$computerName = "winvm01"
$vmSize = "Standard_B2s"
$resourceGroupName = "myResourceGroup"
$location = "EastUS"

# Création de la configuration de la VM
$vmConfig = New-AzVMConfig -VMName $vmName -VMSize $vmSize

# Configuration du système d'exploitation Windows
$adminUsername = "azureuser"
$adminPassword = ConvertTo-SecureString "Passw0rd123!" -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($adminUsername, $adminPassword)

$vmConfig = Set-AzVMOperatingSystem -VM $vmConfig -Windows -ComputerName $computerName `
    -Credential $credential -ProvisionVMAgent -EnableAutoUpdate

# Sélection de l'image Windows Server 2022
$vmConfig = Set-AzVMSourceImage -VM $vmConfig -PublisherName "MicrosoftWindowsServer" `
    -Offer "WindowsServer" -Skus "2022-datacenter-azure-edition" -Version "latest"

# Configuration de la carte réseau (réutilisation de la config réseau précédente)
$nicConfig = Get-AzNetworkInterface -ResourceGroupName $resourceGroupName -Name "myNIC-Windows"
$vmConfig = Add-AzVMNetworkInterface -VM $vmConfig -Id $nicConfig.Id

# Création de la machine virtuelle
New-AzVM -ResourceGroupName $resourceGroupName -Location $location -VM $vmConfig

# Configuration du groupe de sécurité réseau pour RDP (port 3389)
$nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name "AllowRDP" -Protocol Tcp `
    -Direction Inbound -Priority 1000 -SourceAddressPrefix '*' -SourcePortRange '*' `
    -DestinationAddressPrefix '*' -DestinationPortRange 3389 -Access Allow

$nsg = New-AzNetworkSecurityGroup -ResourceGroupName $resourceGroupName `
    -Location $location -Name "myNSG" -SecurityRules $nsgRuleRDP
```

### Connexion RDP à la machine virtuelle Windows

Le protocole RDP (Remote Desktop Protocol) permet une connexion graphique à la machine virtuelle Windows.

```powershell
# Récupération de l'adresse IP publique
$publicIP = Get-AzPublicIpAddress -ResourceGroupName $resourceGroupName `
    -Name "myPublicIP-Windows"
$ipAddress = $publicIP.IpAddress

# Téléchargement du fichier RDP
Get-AzRemoteDesktopFile -ResourceGroupName $resourceGroupName `
    -Name $vmName -LocalPath "C:\temp\myWindowsVM.rdp"
```

### Utilisation de l'outil RDP natif

**Sur Windows** : Utiliser l'application "Connexion Bureau à distance" :
- Appuyer sur Win + R
- Taper : `mstsc`
- Entrer l'adresse IP publique de la VM
- Fournir les identifiants : azureuser / Passw0rd123!

**Sur macOS et Linux** : Utiliser un client RDP tiers comme Remmina ou Microsoft Remote Desktop

Une fois connecté au bureau Windows, tous les outils Windows standards sont disponibles (PowerShell, Gestionnaire des tâches, Gestionnaire de fichiers, etc.).

## Mise à l'Échelle Automatique : Virtual Machine Scale Sets

### Concept fondamental

Les Virtual Machine Scale Sets (VMSS) représentent une avancée significative dans la gestion de la scalabilité des applications. Contrairement à la création manuelle de plusieurs machines virtuelles, un Scale Set automatise le déploiement, la configuration et la gestion d'un groupe de machines virtuelles identiques[1].

Les Scale Sets utilisent la scalabilité horizontale pour distribuer automatiquement la charge à travers un groupe de machines virtuelles. Cette approche garantit que les applications maintiennent des performances optimales même lors de pics de charge imprévisibles[2].

### Architecture et composants

Un Virtual Machine Scale Set se compose de plusieurs éléments interconnectés :

- **Instances de VM** : Machines virtuelles identiques avec la même configuration
- **Profil de VM** : Définit l'image, la taille, la configuration réseau et les extensions
- **Règles de mise à l'échelle** : Critères déterminant quand augmenter ou réduire les instances
- **Équilibreur de charge** : Distribue le trafic entrant entre les instances
- **Groupe de ressources** : Conteneur logique pour toutes les ressources du Scale Set

### Création d'un Scale Set via PowerShell

```powershell
# Authentification et contexte
Connect-AzAccount
Set-AzContext -SubscriptionId "votre-id-abonnement"

# Création du groupe de ressources
$resourceGroupName = "myResourceGroup"
$location = "EastUS"
New-AzResourceGroup -Name $resourceGroupName -Location $location

# Configuration des identifiants
$cred = Get-Credential

# Création du Scale Set avec configuration de base
New-AzVmss `
  -ResourceGroupName $resourceGroupName `
  -VMScaleSetName "myScaleSet" `
  -OrchestrationMode "Flexible" `
  -VMSize "Standard_B2s" `
  -Location $location `
  -Credential $cred
```

### Modification de la capacité du Scale Set

La capacité d'un Scale Set détermine le nombre d'instances déployées. Cette valeur peut être augmentée ou diminuée selon les besoins[1].

```powershell
# Récupération du Scale Set existant
$vmss = Get-AzVmss -ResourceGroupName $resourceGroupName -VMScaleSetName "myScaleSet"

# Augmentation de la capacité à 3 instances
$vmss.sku.capacity = 3
Update-AzVmss -ResourceGroupName $resourceGroupName -Name "myScaleSet" `
  -VirtualMachineScaleSet $vmss

# Vérification de la nouvelle capacité
Get-AzVmss -ResourceGroupName $resourceGroupName -VMScaleSetName "myScaleSet" | 
  Select-Object -ExpandProperty Sku
```

### Gestion du démarrage et arrêt

```powershell
# Démarrage de toutes les instances du Scale Set
Start-AzVmss -ResourceGroupName $resourceGroupName -VMScaleSetName "myScaleSet"

# Arrêt de toutes les instances
Stop-AzVmss -ResourceGroupName $resourceGroupName -VMScaleSetName "myScaleSet"

# Démarrage d'une instance spécifique
Start-AzVM -ResourceGroupName $resourceGroupName -Name "myScaleSet_0"

# Arrêt d'une instance spécifique
Stop-AzVM -ResourceGroupName $resourceGroupName -Name "myScaleSet_0"
```

### Règles de mise à l'échelle automatique

Les règles de mise à l'échelle automatique permettent au Scale Set d'ajuster le nombre d'instances en fonction de métriques comme l'utilisation CPU ou la mémoire[2].

```powershell
# Création d'une configuration de mise à l'échelle automatique
$autoscaleConfig = New-AzAutoscaleNotification -EmailCustom `
  -SendEmailToSubscriptionAdministrator

# Définition des seuils de mise à l'échelle
# Augmentation : > 70% CPU pendant 5 minutes
# Réduction : < 30% CPU pendant 10 minutes
$scaleRuleUp = New-AzAutoscaleRule -MetricName "Percentage CPU" `
  -MetricResourceId "/subscriptions/votre-id/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet" `
  -Operator GreaterThan -MetricStatistic Average -Threshold 70 `
  -TimeGrain 00:01:00 -TimeWindow 00:05:00 `
  -ScaleActionDirection Increase -ScaleActionScaleType ChangeCount -ScaleActionValue 1

$scaleRuleDown = New-AzAutoscaleRule -MetricName "Percentage CPU" `
  -MetricResourceId "/subscriptions/votre-id/resourceGroups/$resourceGroupName/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet" `
  -Operator LessThan -MetricStatistic Average -Threshold 30 `
  -TimeGrain 00:01:00 -TimeWindow 00:10:00 `
  -ScaleActionDirection Decrease -ScaleActionScaleType ChangeCount -ScaleActionValue 1
```

## Garantir la Haute Disponibilité : Availability Sets

### Principes de haute disponibilité

Les Availability Sets constituent une approche fondamentale pour assurer la continuité de service des applications critiques. Contrairement à un déploiement concentré sur une seule machine physique, un Availability Set distribue les instances de machines virtuelles sur plusieurs domaines de défaillance et domaines de mise à jour, minimisant ainsi les risques d'interruption de service[1].

### Domaines de défaillance et mise à jour

**Domaines de défaillance** : Chaque Availability Set inclut jusqu'à 3 domaines de défaillance, chacun représentant une unité de matériel physique indépendante. En cas de défaillance d'une unité, les machines virtuelles dans d'autres domaines continuent de fonctionner sans interruption.

**Domaines de mise à jour** : Azure divise également les instances en domaines de mise à jour (jusqu'à 20). Lors de mises à jour système, Azure met à jour séquentiellement un domaine à la fois, assurant qu'au moins une partie de l'application reste disponible.

### Création et configuration d'un Availability Set

```powershell
# Création d'un Availability Set
$availabilitySet = New-AzAvailabilitySet `
  -ResourceGroupName $resourceGroupName `
  -Name "myAvailabilitySet" `
  -Location $location `
  -PlatformFaultDomainCount 3 `
  -PlatformUpdateDomainCount 5

# Création de machines virtuelles dans l'Availability Set
$vm1Config = New-AzVMConfig -VMName "myVM1" -VMSize "Standard_B2s"
$vm1Config = Set-AzVMOperatingSystem -VM $vm1Config -Windows `
  -ComputerName "vm1" -Credential $credential -ProvisionVMAgent -EnableAutoUpdate
$vm1Config = Set-AzVMSourceImage -VM $vm1Config -PublisherName "MicrosoftWindowsServer" `
  -Offer "WindowsServer" -Skus "2022-datacenter-azure-edition" -Version "latest"

# Association au groupe de disponibilité
$vm1Config = New-AzVMConfig -VMName "myVM1" -VMSize "Standard_B2s" `
  -AvailabilitySetId $availabilitySet.Id

# Création des autres VMs de manière similaire
New-AzVM -ResourceGroupName $resourceGroupName -Location $location -VM $vm1Config
```

### Comparaison : Availability Sets vs Zones de disponibilité

| Aspect | Availability Set | Zone de disponibilité |
|--------|------------------|----------------------|
| **Isolation** | Domaines au sein d'un datacenter | Datacenters géographiquement séparés |
| **Défaillances** | Pannes matérielles locales | Défaillances de datacenter complet |
| **Latence réseau** | Très faible (< 1ms) | Faible (< 2ms) |
| **Coûts de transfer** | Gratuit | Frais applicables |
| **Utilisation** | Applications critiques standard | Applications ultra-critiques |

## Introduction à Azure Virtual Desktop (AVD)

### Vue d'ensemble

Azure Virtual Desktop (AVD) constitue une solution complète de virtualisation de bureau fournie par Microsoft, permettant aux organisations de déployer des environnements de bureau Windows sécurisés et scalables dans le cloud[1]. Cette approche élimine les limitations des solutions traditionnelles de Remote Desktop Protocol en offrant une expérience utilisateur optimisée et une gestion simplifiée.

### Architecture d'AVD

Une implémentation Azure Virtual Desktop repose sur plusieurs composants essentiels :

- **Environnement hôte de session** : Serveurs exécutant Windows 10 Enterprise multi-session ou Windows 11
- **Pools d'hôtes** : Groupements logiques d'hôtes de session
- **Espace de travail** : Point d'accès pour les utilisateurs aux ressources de bureau
- **Application groups** : Collections d'applications disponibles pour les utilisateurs
- **Infrastructure réseau** : Réseaux virtuels sécurisés et connexions directes

### Avantages principales d'AVD

**Scalabilité élastique** : L'infrastructure peut augmenter ou réduire dynamiquement en fonction des utilisateurs connectés, optimisant les coûts énergétiques et réduisant les dépenses d'exploitation.

**Accès multi-appareil** : Les utilisateurs peuvent accéder à leurs environnements de bureau depuis n'importe quel appareil (ordinateur, tablette, smartphone) via des clients légers ou des navigateurs web.

**Sécurité renforcée** : Toutes les données restent dans le datacenter Azure, les appareils locaux ne stockent que des données d'affichage. L'authentification multi-facteurs et l'accès conditionnel renforcent la sécurité.

**Licences optimisées** : Les abonnements Microsoft 365 ou Windows existants couvrent souvent les coûts de licence AVD, réduisant les investissements supplémentaires.

### Cas d'usage courants

- **Travail hybride** : Fournir un environnement de bureau cohérent pour les employés distants et au bureau
- **Environnements de développement** : Offrir des environnements standardisés et isolés pour les développeurs
- **Accès sécurisé pour contractants** : Fournir un accès temporaire et contrôlé sans installer de logiciels localement
- **Applications graphiquement intensives** : Exécuter des applications 3D ou de création multimédia sur du matériel puissant dans le cloud

## Héberger des Applications Web avec Azure App Service

### Concept fondamental

Azure App Service représente une plateforme d'hébergement entièrement managée pour construire et héberger des applications web, des API REST et des backends mobiles. Contrairement aux machines virtuelles, App Service abstrait la complexité de gestion de l'infrastructure sous-jacente, permettant aux développeurs de se concentrer exclusivement sur le code applicatif[1].

### Caractéristiques principales

**Gestion automatique de l'infrastructure** : Azure gère entièrement la mise à jour du système d'exploitation, les correctifs de sécurité et la maintenance du serveur web. Les développeurs n'interviennent jamais à ce niveau.

**Support multi-langage** : App Service supporte nativement .NET, Java, Python, Node.js, PHP, Ruby et Go, permettant une flexibilité technologique considérable.

**Déploiement continu** : Intégration native avec les dépôts Git (GitHub, Azure Repos, Bitbucket), permettant un déploiement automatique à chaque commit.

**Scalabilité intégrée** : La plateforme supporte l'auto-scaling horizontal automatique en fonction de métriques définies par l'utilisateur.

### Plans App Service disponibles

| Plan | Description | Utilisation |
|------|-------------|-----------|
| **Free** | Partage de ressources, limites strictes | Développement, prototypage |
| **Shared** | Toujours partage, plus de ressources que Free | Applications légères |
| **Basic** | Calcul dédié, pas d'auto-scaling | Développement, small business |
| **Standard** | Auto-scaling, SSL gratuit | Applications de production |
| **Premium** | Environnements isolés, hautes performances | Applications critiques |
| **Isolated** | Environnement dédié complet | Applications nécessitant isolation |

### Architecture d'App Service

Un Plan App Service fournit des ressources de calcul partagées entre plusieurs App Services. Plusieurs applications peuvent être hébergées sur un même plan, réduisant les coûts. Chaque App Service dispose de son propre espace de noms d'application.

```
Plan App Service (ressources de calcul partagées)
├── Web App 1 (exemple.azurewebsites.net)
├── Web App 2 (exemple2.azurewebsites.net)
└── Web App 3 (exemple3.azurewebsites.net)
```

## Créer une Application Web sur App Service

### Création via Azure PowerShell

La création d'une première application web constitue l'étape essentielle pour démarrer avec la plateforme App Service.

```powershell
# Authentification
Connect-AzAccount

# Configuration de base
$resourceGroupName = "myResourceGroup"
$appServicePlanName = "myAppServicePlan"
$webAppName = "mywebapp" # Doit être globalement unique
$location = "EastUS"

# Création du groupe de ressources
New-AzResourceGroup -Name $resourceGroupName -Location $location

# Création du plan App Service
$appServicePlan = New-AzAppServicePlan `
  -ResourceGroupName $resourceGroupName `
  -Name $appServicePlanName `
  -Location $location `
  -Tier "Standard" `
  -WorkerSize "Small" `
  -NumberofWorkers 1

# Création de l'application web
$webApp = New-AzWebApp `
  -ResourceGroupName $resourceGroupName `
  -Name $webAppName `
  -AppServicePlan $appServicePlan
```

### Déploiement du code source

```powershell
# Configuration du déploiement Git local
$publishingProfile = Get-AzWebAppPublishingProfile `
  -ResourceGroupName $resourceGroupName `
  -Name $webAppName `
  -OutputFile "publishingprofile.xml"

# Alternative : Déploiement via ZIP
$sourceCodePath = "C:\MonApplicationWeb\*"
$zipPath = "C:\temp\app.zip"

# Compression du code source
Compress-Archive -Path $sourceCodePath -DestinationPath $zipPath -Force

# Upload via API
$resourceId = (Get-AzWebApp -ResourceGroupName $resourceGroupName -Name $webAppName).Id
Publish-AzWebapp -ResourceGroupName $resourceGroupName -Name $webAppName `
  -ArchivePath $zipPath
```

### Configuration des paramètres d'application

```powershell
# Définition de variables d'environnement (App Settings)
$appSettings = @{
  "WEBSITE_NODE_DEFAULT_VERSION" = "16.13.0"
  "DATABASE_CONNECTION_STRING" = "Server=myserver;Database=mydb"
  "API_KEY" = "secret-key-value"
}

Set-AzWebApp -ResourceGroupName $resourceGroupName -Name $webAppName `
  -AppSettings $appSettings

# Configuration des paramètres de connexion
$connectionStrings = @{
  "DefaultConnection" = @{
    "Value" = "Server=myserver;Database=mydb;User=admin;Password=secret;"
    "Type" = "SQLServer"
  }
}

# Note : La définition des connection strings nécessite l'utilisation du portail
# ou d'API REST spécifiques
```

### Activation de HTTPS et certificats SSL

```powershell
# Récupération du domaine par défaut Azure
$defaultDomain = Get-AzWebApp -ResourceGroupName $resourceGroupName `
  -Name $webAppName | Select-Object -ExpandProperty DefaultHostName

# Activation du HTTPS minimum TLS 1.2
Set-AzWebApp -ResourceGroupName $resourceGroupName -Name $webAppName `
  -MinTlsVersion "1.2"

# Import d'un certificat personnalisé (si disponible)
# Nécessite un certificat PFX pré-acheté
$certPath = "C:\certs\mycertificate.pfx"
$certPassword = ConvertTo-SecureString "CertPassword123!" -AsPlainText -Force

New-AzWebAppSSLBinding -ResourceGroupName $resourceGroupName `
  -WebAppName $webAppName -CertificateFilePath $certPath `
  -CertificatePassword $certPassword -Name "www.mondomaine.com"
```

### Monitoring et diagnostics

```powershell
# Activation des logs d'application
Set-AzAppServicePlanConfig -ResourceGroupName $resourceGroupName `
  -Name $appServicePlanName -NumberofWorkers 2

# Configuration des diagnostics
$diagnostics = New-AzWebAppDiagnosticSetting `
  -ResourceGroupName $resourceGroupName `
  -Name $webAppName `
  -ApplicationLogging $true `
  -WebServerLogging $true `
  -DetailedErrorMessages $true `
  -FailedRequestTracing $true

# Récupération des logs
Get-AzWebAppLog -ResourceGroupName $resourceGroupName -Name $webAppName `
  -Tail 100
```

## Le Calcul Serverless avec Azure Functions

### Concept du serverless

Azure Functions incarne la philosophie serverless en abstrayant complètement la gestion de l'infrastructure. Les développeurs écrivent uniquement les fonctions métier sans se préoccuper des serveurs sous-jacents, de la scalabilité ou de la gestion des patchs système. Azure gère automatiquement l'allocation des ressources, la scalabilité horizontale et la facturation à la milliseconde près[1].

### Avantages du modèle serverless

**Scalabilité transparente** : Les fonctions s'adaptent automatiquement du néant à des milliers d'exécutions parallèles sans intervention manuelle. Le coûts suit exactement l'utilisation réelle.

**Coûts optimisés** : Facturation uniquement au moment de l'exécution effective. Pour les charges de travail intermittentes ou imprévisibles, les économies peuvent atteindre 90% par rapport aux architectures traditionnelles.

**Réduction de la complexité opérationnelle** : Élimination complète des tâches d'administration système. Les développeurs ne gèrent que le code et la configuration métier.

**Déploiement rapide** : Les fonctions peuvent être déployées en secondes depuis un éditeur en ligne ou via des outils de développement standard.

### Modèles de déclenchement

Azure Functions supporte une diversité de déclencheurs permettant l'invocation selon différents contextes :

| Déclencheur | Cas d'usage | Exemple |
|------------|-----------|---------|
| **HTTP** | API REST, webhooks | Traitement de requêtes web |
| **Timer** | Tâches planifiées | Nettoyage de bases de données |
| **Storage Queue** | Traitement asynchrone | Traitement de fichiers uploadés |
| **Service Bus** | Intégration d'applications | Processus métier distribués |
| **Event Grid** | Événements système | Notifications d'événements |
| **Cosmos DB** | Réactivité aux changements | Synchronisation de données |
| **Blob Storage** | Réaction aux modifications | Traitement d'images |

### Création d'une fonction Azure simple

```powershell
# Authentification et setup
Connect-AzAccount

$resourceGroupName = "myResourceGroup"
$functionAppName = "myfunctionapp"
$storageAccountName = "myfunctionstg"
$location = "EastUS"

# Création du groupe de ressources
New-AzResourceGroup -Name $resourceGroupName -Location $location

# Création du compte de stockage (obligatoire pour les Functions)
$storageAccount = New-AzStorageAccount `
  -ResourceGroupName $resourceGroupName `
  -Name $storageAccountName `
  -SkuName "Standard_LRS" `
  -Location $location

# Création du plan de Function App (Consumption = serverless)
$functionApp = New-AzFunctionApp `
  -ResourceGroupName $resourceGroupName `
  -Name $functionAppName `
  -StorageAccountName $storageAccountName `
  -Runtime "PowerShell" `
  -RuntimeVersion "7.2" `
  -Location $location `
  -FunctionsVersion 4
```

### Exemple de fonction HTTP en C#

```csharp
using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

public static class HttpTriggerFunction
{
    [Function("HttpTrigger")]
    public static HttpResponseData Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]
        HttpRequestData req,
        FunctionContext executionContext)
    {
        var logger = executionContext.GetLogger("HttpTrigger");
        logger.LogInformation("Fonction HTTP déclenchée");

        // Récupération des paramètres
        string name = req.Query.GetValues("name").FirstOrDefault() ?? "World";
        
        // Création de la réponse
        var response = req.CreateResponse(HttpStatusCode.OK);
        response.Headers.Add("Content-Type", "text/plain; charset=utf-8");
        response.WriteString($"Hello, {name}!");
        
        return response;
    }
}
```

### Exemple de fonction avec déclencheur Timer

```csharp
using System;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

public static class TimerTriggerFunction
{
    [Function("TimerTrigger")]
    public static void Run(
        [TimerTrigger("0 */5 * * * *")] TimerInfo myTimer,
        FunctionContext context)
    {
        var logger = context.GetLogger("TimerTrigger");
        
        if (myTimer. isPastDue)
        {
            logger.LogWarning("La fonction a dépassé l'horaire prévu");
        }
        
        logger.LogInformation($"Exécution à : {DateTime.Now}");
        // Logique métier : nettoyage de base de données, envoi de rapport, etc.
    }
}
```

### Intégration avec d'autres services Azure

```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Logging;

public static class QueueTriggerFunction
{
    [Function("ProcessQueueMessage")]
    public static async Task Run(
        [QueueTrigger("myqueue-items")] string queueItem,
        [Table("ProcessedItems")] IAsyncCollector<ProcessedItem> outputTable,
        ILogger log)
    {
        log.LogInformation($"Message traité : {queueItem}");
        
        // Traitement du message
        var processedItem = new ProcessedItem 
        { 
            PartitionKey = "processed",
            RowKey = Guid.NewGuid().ToString(),
            Message = queueItem,
            ProcessedTime = DateTime.UtcNow
        };
        
        // Sauvegarde en Table Storage
        await outputTable.AddAsync(processedItem);
    }
}

public class ProcessedItem : TableEntity
{
    public string Message { get; set; }
    public DateTime ProcessedTime { get; set; }
}
```

## Introduction aux Conteneurs

### Concept des conteneurs

Les conteneurs représentent une révolution dans le déploiement et la gestion des applications. Contrairement aux machines virtuelles qui virtualisent le matériel complet, les conteneurs virtualisent uniquement le système d'exploitation, ce qui les rend extrêmement légers et portables[1].

Un conteneur encapsule complètement une application avec ses dépendances, bibliothèques et configurations. Cette encapsulation garantit que l'application fonctionne de manière identique quel que soit l'environnement d'exécution (ordinateur portable du développeur, serveur de test, production).

### Avantages des conteneurs

**Légèreté** : Un conteneur Docker typique occupe 50 à 100 MB, comparé à 1 à 10 GB pour une machine virtuelle. Cela permet d'empiler des centaines de conteneurs sur une même infrastructure.

**Portabilité** : Construire une fois, exécuter n'importe où. Un conteneur fonctionne identiquement sur un ordinateur personnel, un serveur on-premises ou le cloud Azure.

**Déploiement rapide** : Les conteneurs démarrent en millisecondes comparé aux secondes ou minutes nécessaires à une machine virtuelle.

**Isolation des processus** : Chaque conteneur exécute ses propres processus, fichiers et réseau, sans interférer avec les autres conteneurs.

### Comparaison architecturale

```
Architecture Machine Virtuelle :
┌─────────────────────────────────────────┐
│ Hyperviseur (VMware, Hyper-V, KVM)      │
├────────────────┬────────────────┬───────┤
│ Système Linux  │ Système Linux  │  Win  │
│ Application A  │ Application B  │  Sys  │
│ Dépendances    │ Dépendances    │ Deps  │
└────────────────┴────────────────┴───────┘

Architecture Conteneur :
┌──────────────────────────────────┐
│ Moteur Conteneur (Docker, etc)   │
├───────┬───────┬───────┬──────────┤
│ App A │ App B │ App C │   App D  │
│ Deps  │ Deps  │ Deps  │   Deps   │
└───────┴───────┴───────┴──────────┘
(Tous partagent le noyau Linux)
```

### Solutions de conteneurs Azure

Azure propose plusieurs services pour exécuter et orchestrer des conteneurs :

**Azure Container Instances (ACI)** : Exécution simple de conteneurs sans orchestration complexe. Idéal pour les tâches ponctuelles ou les applications simples.

**Azure Kubernetes Service (AKS)** : Orchestration de conteneurs à grande échelle avec Kubernetes. Gère automatiquement le déploiement, la scalabilité et la mise en réseau de centaines ou milliers de conteneurs.

**App Service for Containers** : Hébergement de conteneurs via App Service, combinant la simplicité d'App Service avec la flexibilité des conteneurs.

**Azure Container Registry** : Registre privé pour stocker et gérer les images conteneur, similaire à Docker Hub mais avec contrôle complet et sécurité améliorée.

### Exemple Dockerfile

Un Dockerfile décrit les couches constituant une image conteneur :

```dockerfile
# Image de base
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers d'application
COPY ./bin/Release/net6.0/publish/ .

# Configuration du point d'entrée
ENTRYPOINT ["dotnet", "MyApplication.dll"]

# Exposition du port
EXPOSE 80
```

### Déploiement sur Azure Container Instances

```powershell
# Authentification
Connect-AzAccount

# Paramètres
$resourceGroupName = "myResourceGroup"
$containerGroupName = "mycontainergroup"
$imageName = "myregistry.azurecr.io/myapp:latest"
$location = "EastUS"

# Création du groupe de ressources
New-AzResourceGroup -Name $resourceGroupName -Location $location

# Déploiement du conteneur
$container = New-AzContainerInstanceObject `
  -Name "mycontainer" `
  -Image $imageName `
  -RequestCpu 1 `
  -RequestMemoryInGb 1.5 `
  -Port 80

New-AzContainerGroup `
  -ResourceGroupName $resourceGroupName `
  -Name $containerGroupName `
  -Container $container `
  -OsType Linux `
  -IpAddressType Public
```

### Déploiement sur Azure Kubernetes Service (AKS)

```powershell
# Création d'un cluster AKS
$clusterName = "myAKSCluster"
$nodeCount = 3

New-AzAksCluster `
  -ResourceGroupName $resourceGroupName `
  -Name $clusterName `
  -NodeCount $nodeCount `
  -VmSetType "VirtualMachineScaleSets" `
  -NetworkPlugin "azure"

# Récupération des credentials
Get-AzAksCluster -ResourceGroupName $resourceGroupName -Name $clusterName |
  Import-AzAksCredential -Force

# Vérification du cluster
kubectl get nodes
```

### Fichier de déploiement Kubernetes (YAML)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-deployment
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myregistry.azurecr.io/myapp:v1
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

## Résumé du Chemin d'Apprentissage

Le parcours d'apprentissage des services de calcul Azure progresse logiquement de l'infrastructure fondamentale vers les abstractions de plus haut niveau :

1. **Fondations** : Les Machines Virtuelles offrent le contrôle total et constituent le point de départ pour comprendre l'infrastructure cloud.

2. **Scalabilité** : Les Virtual Machine Scale Sets introduisent l'automatisation et la gestion de multiples instances, essentiels pour les applications modernes.

3. **Haute disponibilité** : Les Availability Sets et les Zones de disponibilité garantissent la continuité de service sans interruption.

4. **Abstractions managées** : Azure App Service et Azure Virtual Desktop masquent la complexité infrastructure en proposant des services entièrement managés.

5. **Sans serveur** : Azure Functions représente le degré d'abstraction maximal, permettant de coder sans penser à l'infrastructure.

6. **Conteneurisation** : Les conteneurs et Kubernetes (AKS) introduisent la portabilité et la flexibilité de déploiement.

Ce parcours prépare les architectes et développeurs à choisir la solution optimale selon les besoins spécifiques de chaque application et charge de travail[1][2][3].
