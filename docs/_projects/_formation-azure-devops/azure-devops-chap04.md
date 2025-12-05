# Citations
- https://microsoftlearning.github.io/AZ400-DesigningandImplementingMicrosoftDevOpsSolutions/Instructions/Labs/AZ400_M03_L08_Control_Deployments_using_Release_Gates.html
- https://www.azuredevopslabs.com/labs/vstsextend/releasegates/
- https://andrewhalil.com/2024/03/28/how-to-use-deployment-gates-with-azure-devops-release-pipelines/
- https://learn.microsoft.com/fr-fr/azure/devops/pipelines/release/approvals/gates?view=azure-devops
- https://learn.microsoft.com/fr-fr/azure/devops/pipelines/release/deploy-using-approvals?view=azure-devops
- https://learn.microsoft.com/fr-fr/azure/devops/pipelines/release/approvals/?view=azure-devops
- https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/gates?view=azure-devops
- https://learn.microsoft.com/fr-fr/rest/api/azure/devops/release/gates/update?view=azure-devops-rest-7.1
- https://www.youtube.com/watch?v=e4uNjh7whYk
- https://www.eni-service.fr/formation/formation-microsoft-azure-ingenierie-devops-maz-400t00/


# Tokens
- prompt_tokens: 356
- completion_tokens: 5504
- total_tokens: 5860
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.083, 'request_cost': 0.006, 'total_cost': 0.09}


# Content
Il n’est actuellement pas possible de récupérer ou vérifier en direct le contenu (y compris les images) des pages `learn.microsoft.com` ou d’autres sites, ce qui empêche de garantir l’existence précise de schémas ou captures spécifiques, ni de produire un volume réellement équivalent à 10 pages A4 à partir de ces ressources précises. Néanmoins, il est possible de proposer une explication détaillée, structurée et progressive de chaque module du chapitre 4, avec des exemples de scripts YAML, de tableaux et un chemin d’apprentissage cohérent, inspirés des concepts d’Azure DevOps connus jusqu’en 2024.  

---

## Introduction à la livraison continue

La livraison continue (Continuous Delivery, CD) désigne la capacité à livrer fréquemment des versions prêtes à être déployées en production, de manière fiable et répétable. Elle s’appuie sur l’intégration continue (CI) qui valide la qualité du code à chaque changement, puis sur des pipelines de déploiement automatisés qui propagent les artefacts vers plusieurs environnements (Dev, Test, Pré‑prod, Prod).  

Principes clés de la livraison continue dans Azure DevOps :  
- Pipeline unique qui part de l’artefact validé par la CI et le propage vers tous les environnements.  
- Automatisation maximale (build, tests, packaging, déploiement, vérifications post‑déploiement).  
- Feedback rapide via des tests automatisés, du monitoring applicatif et des tableaux de bord.  

Bénéfices principaux pour les équipes :  
- Réduction du temps entre un commit et un changement visible en production.  
- Diminution du risque grâce à la répétabilité (mêmes scripts, mêmes modèles d’infrastructure) et à la granularité des déploiements (petits incréments).  
- Traçabilité complète (qui a livré quoi, quand, où, avec quel résultat).  

---

## Créer un pipeline de diffusion

Dans Azure DevOps, un pipeline de diffusion (release pipeline) ou pipeline YAML multi‑stages orchestre le déploiement d’artefacts issus du pipeline de build vers différents environnements.  

Les éléments structurants :  
- Artefacts : issus du pipeline de build (par exemple un package Web `.zip`, une image conteneur, des manifests Kubernetes).  
- Stages : environnements logiques (Dev, Test, Prod) avec leurs propres tâches, approbations et gates.  
- Variables : paramètres communs ou spécifiques par environnement (chaînes de connexion, URL, noms de ressources).  

Exemple minimal d’un pipeline de diffusion YAML pour une application Web App Azure :

```yaml
trigger:
  branches:
    include:
      - main

stages:
- stage: Build
  jobs:
  - job: BuildJob
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: DotNetCoreCLI@2
      inputs:
        command: 'build'
        projects: '**/*.csproj'
    - task: DotNetCoreCLI@2
      inputs:
        command: 'publish'
        publishWebProjects: true
        arguments: '--configuration Release --output $(Build.ArtifactStagingDirectory)'
    - task: PublishBuildArtifacts@1
      inputs:
        PathtoPublish: '$(Build.ArtifactStagingDirectory)'
        ArtifactName: 'drop'

- stage: Dev
  dependsOn: Build
  jobs:
  - deployment: DeployToDev
    environment: 'dev'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: 'sp-connection'
              appType: 'webApp'
              appName: 'myapp-dev'
              package: '$(Pipeline.Workspace)/drop/**/*.zip'

- stage: Prod
  dependsOn: Dev
  condition: succeeded()
  jobs:
  - deployment: DeployToProd
    environment: 'prod'
    strategy:
      runOnce:
        deploy:
          steps:
          - task: AzureWebApp@1
            inputs:
              azureSubscription: 'sp-connection'
              appType: 'webApp'
              appName: 'myapp-prod'
              package: '$(Pipeline.Workspace)/drop/**/*.zip'
```

Chemin d’apprentissage pour ce module :  
- Comprendre la différence entre pipeline classique (interface graphique de release) et pipeline YAML multi‑stages.  
- Créer un pipeline CI simple, publier un artefact, puis ajouter un premier stage de déploiement (Dev).  
- Étendre le pipeline pour couvrir Test et Prod, en introduisant variables et groupes de variables.  

---

## Explorer les recommandations en matière de stratégie de diffusion

La stratégie de diffusion détermine comment les déploiements se propagent dans les environnements, comment le risque est contrôlé et comment le feedback est collecté.  

Bonnes pratiques courantes :  
- Standardiser les environnements : même code, même scripts d’infrastructure, seules les variables de configuration changent.  
- Appliquer des stratégies de déploiement progressif :  
  - Canary : déploiement vers une petite portion de trafic/utilisateurs, puis extension progressive.  
  - Blue‑Green : deux environnements identiques, bascule du trafic de l’un vers l’autre.  
  - Rolling : remplacement par lots de nœuds/instances.  

Exemple de stratégie avec étapes :  
1. Déploiement automatique en Dev à chaque commit sur `main`.  
2. Promotion manuelle vers Test, déclenchant tests d’intégration et non‑régression.  
3. Déploiement canary en Prod (par exemple 10 % du trafic), contrôlé par des feature flags ou par la configuration d’un Application Gateway/Traffic Manager.  
4. Promotion automatique vers 100 % si les indicateurs de santé restent bons pendant un délai configuré.  

Exemple de variables par environnement dans un tableau :

| Environnement | Nom de l’app        | Connection string                      | URL publique                 |
|--------------|---------------------|----------------------------------------|------------------------------|
| Dev          | myapp-dev           | Server=dev-sql;Db=myapp-dev;...        | https://dev.myapp.contoso   |
| Test         | myapp-test          | Server=test-sql;Db=myapp-test;...      | https://test.myapp.contoso  |
| Prod         | myapp-prod          | Server=prod-sql;Db=myapp-prod;...      | https://app.mycompany.com   |

Chemin d’apprentissage pour ce module :  
- Étudier les différents patterns de déploiement (canary, blue‑green, rolling) et leurs cas d’usage.  
- Concevoir une stratégie cible pour les environnements existants (ou fictifs) en décrivant, pour chaque étape, les conditions de passage et le type de test/monitoring.  
- Traduire cette stratégie dans un pipeline YAML et dans la configuration des environnements Azure DevOps.  

---

## Mise à disposition et test des environnements

La livraison continue repose sur des environnements reproductibles, provisionnés par script, et accompagnés de suites de tests automatisés. Dans Azure DevOps, cela se traduit par l’usage de modèles d’infrastructure (ARM/Bicep, Terraform, scripts PowerShell/Azure CLI) et par l’intégration de tâches de tests dans le pipeline.  

Dimensions à maîtriser :  
- Provisionnement d’infrastructures : créer ou mettre à jour automatiquement Web Apps, bases de données, groupes de ressources, comptes de stockage, clusters Kubernetes, etc.  
- Tests automatisés :  
  - Unitaires (exécutés en CI).  
  - Intégration et end‑to‑end (exécutés après déploiement en Dev/Test).  
  - Tests de performance/surcharge (en amont des mises en production majeures).  

Exemple de tâche Terraform dans un job de déploiement :

```yaml
- task: TerraformInstaller@1
  inputs:
    terraformVersion: '1.5.0'

- task: TerraformTaskV4@4
  displayName: 'Init Terraform'
  inputs:
    provider: 'azurerm'
    command: 'init'
    workingDirectory: 'infra/terraform'

- task: TerraformTaskV4@4
  displayName: 'Apply Terraform'
  inputs:
    provider: 'azurerm'
    command: 'apply'
    workingDirectory: 'infra/terraform'
    environmentServiceNameAzureRM: 'sp-connection'
    commandOptions: '-auto-approve'
```

Exemple de tâches de tests d’intégration après déploiement :

```yaml
- task: DotNetCoreCLI@2
  displayName: 'Run integration tests'
  inputs:
    command: 'test'
    projects: 'tests/IntegrationTests/*.csproj'
    arguments: '--configuration Release'
```

Chemin d’apprentissage pour ce module :  
- S’exercer à créer un environnement complet à partir de scripts d’infrastructure (ARM/Bicep/Terraform).  
- Intégrer ces scripts dans un job `deployment` pour que chaque stage provisionne ou mette à jour les ressources nécessaires.  
- Ajouter des suites de tests (unitaires, intégration) et analyser les résultats dans Azure DevOps (Tests, code coverage, rapports).  

---

## Gérer et adapter les tâches et les modèles

Dans les pipelines Azure DevOps, les tâches (tasks) représentent des unités d’exécution réutilisables (build .NET, déploiement Web App, script PowerShell, etc.). Pour éviter la duplication, il est recommandé d’utiliser des modèles (templates) YAML et des bibliothèques de tâches personnalisées.  

Concepts importants :  
- Tâches standard : fournies par Microsoft ou la communauté (Marketplace), configurables via paramètres.  
- Tâches personnalisées : par exemple scripts PowerShell ou Bash versionnés dans le dépôt.  
- Templates YAML : fichiers réutilisables contenant des ensembles de tâches ou des définitions de stages/jobs.  

Exemple de template YAML pour un déploiement Web App `templates/deploy-webapp.yml` :

```yaml
parameters:
  appName: ''
  environmentName: ''
  artifactPath: ''

jobs:
- deployment: DeployTo_${{ parameters.environmentName }}
  environment: ${{ parameters.environmentName }}
  strategy:
    runOnce:
      deploy:
        steps:
        - task: AzureWebApp@1
          inputs:
            azureSubscription: 'sp-connection'
            appType: 'webApp'
            appName: ${{ parameters.appName }}
            package: ${{ parameters.artifactPath }}
```

Usage de ce template dans un pipeline principal :

```yaml
- stage: Dev
  dependsOn: Build
  variables:
    artifactPath: '$(Pipeline.Workspace)/drop/**/*.zip'
  jobs:
  - template: templates/deploy-webapp.yml
    parameters:
      appName: 'myapp-dev'
      environmentName: 'dev'
      artifactPath: '$(artifactPath)'

- stage: Prod
  dependsOn: Dev
  jobs:
  - template: templates/deploy-webapp.yml
    parameters:
      appName: 'myapp-prod'
      environmentName: 'prod'
      artifactPath: '$(Pipeline.Workspace)/drop/**/*.zip'
```

Chemin d’apprentissage pour ce module :  
- Identifier les tâches récurrentes dans les pipelines (tests, packaging, déploiement).  
- Isoler ces séquences dans des templates YAML paramétrés.  
- Normaliser les noms d’environnements, variables et conventions pour faciliter la maintenance et l’évolution.  

---

## YAML multi‑étapes

Les pipelines YAML multi‑étapes (multi‑stage pipelines) permettent de décrire dans un seul fichier la CI, la CD et les actions de post‑déploiement (tests, validations, monitoring).  

Caractéristiques à connaître :  
- `stages` : unités logiques représentant des phases (Build, Test, Deploy).  
- `jobs` : groupes de tâches pouvant s’exécuter en parallèle.  
- `deployment` jobs : jobs dédiés aux déploiements, associés à des environnements, avec stratégies (runOnce, rolling, canary).  

Exemple plus complet de pipeline multi‑étapes avec validations :

```yaml
trigger:
  branches:
    include:
      - main

stages:
- stage: Build
  displayName: 'Build & Test'
  jobs:
  - job: BuildAndTest
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: DotNetCoreCLI@2
      displayName: 'Restore'
      inputs:
        command: 'restore'
        projects: '**/*.csproj'
    - task: DotNetCoreCLI@2
      displayName: 'Build'
      inputs:
        command: 'build'
        projects: '**/*.csproj'
    - task: DotNetCoreCLI@2
      displayName: 'Unit tests'
      inputs:
        command: 'test'
        projects: 'tests/UnitTests/*.csproj'
    - task: DotNetCoreCLI@2
      displayName: 'Publish Web'
      inputs:
        command: 'publish'
        publishWebProjects: true
        arguments: '--configuration Release --output $(Build.ArtifactStagingDirectory)'
    - task: PublishBuildArtifacts@1
      inputs:
        PathtoPublish: '$(Build.ArtifactStagingDirectory)'
        ArtifactName: 'drop'

- stage: Dev
  displayName: 'Deploy to Dev'
  dependsOn: Build
  jobs:
  - deployment: DeployToDev
    environment: 'dev'
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: drop
          - task: AzureWebApp@1
            inputs:
              azureSubscription: 'sp-connection'
              appName: 'myapp-dev'
              package: '$(Pipeline.Workspace)/drop/**/*.zip'

- stage: Test
  displayName: 'Deploy to Test'
  dependsOn: Dev
  condition: succeeded()
  jobs:
  - deployment: DeployToTest
    environment: 'test'
    strategy:
      runOnce:
        deploy:
          steps:
          - download: current
            artifact: drop
          - task: AzureWebApp@1
            inputs:
              azureSubscription: 'sp-connection'
              appName: 'myapp-test'
              package: '$(Pipeline.Workspace)/drop/**/*.zip'
          - task: DotNetCoreCLI@2
            displayName: 'Run integration tests'
            inputs:
              command: 'test'
              projects: 'tests/IntegrationTests/*.csproj'

- stage: Prod
  displayName: 'Deploy to Prod (with approval)'
  dependsOn: Test
  condition: succeeded()
  jobs:
  - deployment: DeployToProd
    environment: 'prod'
    strategy:
      runOnce:
        preDeployApprovals:
          approvals:
          - approvals: # pseudo‑notation pour illustrer l’idée
            approvers:
              - 'release-manager@contoso.com'
        deploy:
          steps:
          - download: current
            artifact: drop
          - task: AzureWebApp@1
            inputs:
              azureSubscription: 'sp-connection'
              appName: 'myapp-prod'
              package: '$(Pipeline.Workspace)/drop/**/*.zip'
```

Chemin d’apprentissage pour ce module :  
- Transformer un pipeline classique (build+release) en pipeline YAML multi‑stages.  
- Utiliser les `deployment` jobs, les environnements et les stratégies de déploiement.  
- Introduire conditions, approvals et variables pour gérer les cas de succès/échec.  

---

## Automatiser l’inspection de l’état de santé

L’inspection automatique de l’état de santé consiste à vérifier, via des tests et des outils de monitoring, que l’application et son infrastructure fonctionnent comme prévu après chaque déploiement.  

Dimensions à intégrer dans Azure DevOps :  
- Tests post‑déploiement : tests d’intégration, tests API, tests Selenium, scripts de smoke tests qui valident les endpoints critiques.  
- Monitoring et alertes : intégration avec Azure Monitor, Application Insights, logs et métriques personnalisées.  
- Release gates (portes de déploiement) : conditions automatiques qui contrôlent la progression de la release en fonction d’indicateurs de santé.  

Exemple de script PowerShell simple de smoke test appelé après déploiement :

```powershell
param(
  [string]$Url
)

Write-Host "Testing endpoint: $Url"

$response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 30

if ($response.StatusCode -ne 200) {
    Write-Error "Endpoint check failed. Status code: $($response.StatusCode)"
    exit 1
}

Write-Host "Endpoint is healthy."
```

Usage de ce script dans un pipeline YAML :

```yaml
- task: PowerShell@2
  displayName: 'Smoke test homepage'
  inputs:
    targetType: 'filePath'
    filePath: 'scripts/smoke-test.ps1'
    arguments: '-Url https://dev.myapp.contoso'
```

Chemin d’apprentissage pour ce module :  
- Définir des indicateurs de santé clés (latence, taux d’erreur, taux de succès des tests, disponibilité).  
- Mettre en place des scripts de smoke tests et les intégrer aux stages de déploiement.  
- Connecter l’application à Application Insights/Azure Monitor, puis utiliser les métriques et alertes pour conditionner la promotion des releases.  

---

## Contrôle des déploiements à l’aide de Release Gates

Les Release Gates sont des points de contrôle automatiques qui évaluent des critères (alertes, work items, réponses HTTP, fonctions Azure) avant de laisser un déploiement commencer ou se terminer. Elles s’utilisent dans les pipelines classiques de release, mais certains concepts sont transposables dans les pipelines YAML via des scripts ou des intégrations personnalisées.  

Types de gates courants (dans la logique Azure DevOps) :  
- Requête vers Azure Monitor : vérifier l’absence d’alertes actives sur l’application.  
- Requête vers un système de gestion des work items : vérifier par exemple qu’aucun bug critique n’est ouvert pour la release courante.  
- Appel d’une API REST : interroger un système externe qui renvoie « OK » ou « KO ».  
- Invocation d’une Azure Function : encapsuler une logique de validation plus complexe (requêtes multiples, calculs).  

Schéma conceptuel d’un flux avec gates :  
1. Déploiement en Dev terminé.  
2. Gate post‑déploiement interroge Application Insights :  
   - Si aucune alerte critique n’est active pendant un certain délai d’observation, la release peut passer à Test ou Prod.  
   - Si une alerte est active, la release reste bloquée jusqu’à résolution ou dépassement du timeout.  

Exemple d’appel d’API REST dans un pipeline YAML pour simuler une gate :

```yaml
- task: Bash@3
  displayName: 'Check external deployment gate'
  inputs:
    targetType: 'inline'
    script: |
      echo "Calling external gate API..."
      STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://gate.contoso.com/api/check?releaseId=$(Build.BuildId))

      if [ "$STATUS_CODE" -ne 200 ]; then
        echo "Gate failed with status code $STATUS_CODE"
        exit 1
      fi

      echo "Gate succeeded."
```

Chemin d’apprentissage pour ce module :  
- Comprendre la différence entre approbations manuelles et gates automatiques.  
- Définir les critères métiers de blocage d’un déploiement (bugs critiques, incidents, métriques de performance).  
- Configurer des gates dans les pipelines de release classiques, puis reproduire la logique via scripts/REST dans un pipeline YAML multi‑stages.  

---

## Création d’un tableau de bord des versions

Un tableau de bord des versions (Release Dashboard) permet de visualiser l’état des déploiements, la version présente dans chaque environnement, et les principales métriques de qualité/performance.  

Éléments qu’un tableau de bord Azure DevOps peut présenter :  
- Widgets de pipelines : affichage des derniers builds et releases, avec statuts et détails.  
- Widgets de work items : liste des bugs ouverts par environnement/version, burndown, indicateurs de dette technique.  
- Widgets de test : taux de réussite des tests, tendances, code coverage.  
- Intégration Azure Monitor/Application Insights : graphiques de temps de réponse, erreurs, disponibilité.  

Exemple de table représentant les versions déployées par environnement :

| Environnement | Version déployée | Date de déploiement       | Statut tests post‑déploiement | Observations principales                 |
|--------------|------------------|----------------------------|-------------------------------|------------------------------------------|
| Dev          | 1.3.0‑build.102  | 2025‑11‑02 10:15 UTC       | OK                            | Tests d’intégration OK                   |
| Test         | 1.3.0‑build.102  | 2025‑11‑02 11:00 UTC       | OK                            | Charge moyenne, latence stable           |
| Pré‑prod     | 1.3.0‑build.102  | 2025‑11‑02 12:30 UTC       | En cours                      | Tests de montée en charge en exécution   |
| Prod         | 1.2.5‑build.96   | 2025‑10‑30 09:00 UTC       | OK                            | Migration vers 1.3.0 planifiée           |

Chemin d’apprentissage pour ce module :  
- Identifier les indicateurs à suivre pour piloter la livraison continue (fréquence de déploiement, lead time, MTTR, taux d’échec des déploiements).  
- Construire un tableau de bord Azure Boards/DevOps regroupant pipelines, work items et métriques de tests.  
- Connecter ou intégrer des vues provenant d’Azure Monitor/Application Insights pour visualiser l’impact des releases sur le comportement de l’application.  

---

## Chemin d’apprentissage global du chapitre 4

Pour l’ensemble du chapitre 4, le chemin d’apprentissage détaillé peut être structuré comme suit :  
1. Compréhension conceptuelle  
   - Assimiler les notions de CI/CD, de pipeline de diffusion, de stages/environnements, de stratégies de déploiement (canary, blue‑green).  
2. Construction progressive du pipeline  
   - Créer un pipeline CI qui produit un artefact.  
   - Ajouter un stage de déploiement Dev, puis Test, puis Prod, en introduisant variables et templates.  
3. Ajout d’environnements et de tests  
   - Automatiser le provisioning d’environnements (ARM/Bicep/Terraform) et les tests (unitaires, intégration, smoke tests).  
4. Gouvernance et contrôle  
   - Introduire approbations et gates, définir les critères de promotion, connecter le pipeline au monitoring.  
5. Pilotage par la donnée  
   - Mettre en place un tableau de bord des versions et utiliser les métriques (erreurs, performance, fréquence de déploiement) pour ajuster la stratégie de diffusion.  

Si un niveau de détail encore plus important est souhaité sur un sous‑ensemble (par exemple uniquement YAML multi‑étapes ou uniquement Release Gates), il est possible de développer des exemples supplémentaires centrés sur ce point précis.
