# Citations
- https://learn.microsoft.com/fr-fr/sharepoint/dev/spfx/toolchain/implement-ci-cd-with-azure-devops
- https://www.datacamp.com/fr/tutorial/azure-devops
- https://digital.ai/fr/catalyst-blog/building-cicd-pipeline-azure/
- https://learn.microsoft.com/fr-fr/devops/deliver/what-is-continuous-delivery
- https://azure.microsoft.com/fr-fr/solutions/devops/tutorial
- https://learn.microsoft.com/fr-fr/training/paths/az-400-implement-secure-continuous-deployment/
- https://www.varonis.com/fr/blog/presentation-azure-devops


# Tokens
- prompt_tokens: 409
- completion_tokens: 4987
- total_tokens: 5396
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.075, 'request_cost': 0.006, 'total_cost': 0.082}


# Content
Il n’est pas possible, dans ce contexte, d’aller vérifier en direct les ressources (textes et images) sur learn.microsoft.com ou d’autres sites ni de produire l’équivalent fiable de 10 pages A4 directement fondé sur ces contenus précis. En revanche, il est possible de proposer un cours structuré et détaillé sur chaque point du chapitre, avec YAML, scripts, tableaux et un chemin d’apprentissage progressif, en restant original et sans copier la documentation officielle.

---

## Introduction aux modèles de déploiement

Les modèles de déploiement décrivent la manière dont les nouvelles versions d’une application sont mises en production, tout en limitant le risque et l’interruption de service.

Principaux modèles utiles avec Azure Pipelines :

- Déploiement **blue‑green** : deux environnements quasi identiques (« blue » et « green »), l’un sert le trafic, l’autre reçoit la nouvelle version, puis un basculement du routage est réalisé.
- **Canary release** : une petite fraction des utilisateurs reçoit la nouvelle version en premier, pour observer le comportement réel avant une généralisation.
- **Dark launching** : la fonctionnalité est déployée côté back‑end, mais non visible pour les utilisateurs tant qu’un flag ou une configuration ne l’active pas.
- **A/B testing** : deux variantes (ou plus) sont déployées simultanément, avec mesure de métriques (conversion, latence, erreurs, etc.).
- **Diffusion graduelle** (progressive rollout / ring deployment) : mise en production par anneaux successifs (développeurs internes, bêta, production globale, régions, etc.).

### Exemple de logique de stratégie dans Azure Pipelines

Dans Azure Pipelines, ces modèles se traduisent par :

- Des **environnements** (staging, pré‑prod, prod).
- Des **stratégies de déploiement** (par exemple `runOnce`, `rolling`, `canary` dans les déploiements vers Kubernetes).
- Des **approbations manuelles**, des gates (contrôles automatiques) et des variables de configuration par environnement.

---

## Déploiement blue‑green et permutation des fonctionnalités

Le déploiement blue‑green vise à réduire au maximum les interruptions et à permettre un rollback rapide.

### Principe blue‑green

- Environnement « Blue » : version actuelle en production.
- Environnement « Green » : nouvelle version.
- Pipeline :
  1. Build et tests.
  2. Déploiement en « Green ».
  3. Tests fonctionnels / smoke tests sur « Green ».
  4. Basculement du trafic (DNS, load balancer, slot swap, etc.).
  5. Option de rollback vers « Blue » si incident.

### Exemple YAML pour deux environnements (simplifié)

```yaml
trigger:
  branches:
    include:
      - main

stages:
- stage: Build
  jobs:
  - job: BuildApp
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: DotNetCoreCLI@2
      inputs:
        command: 'build'
        projects: '**/*.csproj'

- stage: Deploy_Green
  dependsOn: Build
  jobs:
  - deployment: DeployToGreen
    environment: 'prod-green'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Déploiement de la nouvelle version sur Green"
            displayName: 'Deploy on Green'

- stage: Swap_Traffic
  dependsOn: Deploy_Green
  jobs:
  - job: Swap
    steps:
    - script: echo "Basculement du trafic de Blue vers Green"
      displayName: 'Swap Blue->Green'
```

Ce pipeline illustre l’idée : d’abord construire, ensuite déployer sur un environnement « Green », puis opérer un basculement logique (par exemple un slot swap App Service ou une mise à jour du routage).

### Permutation des fonctionnalités (feature toggles)

La permutation des fonctionnalités consiste à contrôler finement quelles fonctionnalités sont visibles ou actives via des **feature flags**.

Bénéfices :

- Activation progressive sans nouveau déploiement.
- Possibilité de désactiver une fonctionnalité défaillante en production.
- Expérimentation (A/B, dark launch) via configuration.

Exemple de code (C# pseudo‑code) utilisant un flag issu d’une configuration (App Configuration, Key Vault, config file) :

```csharp
public class CheckoutController
{
    private readonly IFeatureManager _featureManager;

    public CheckoutController(IFeatureManager featureManager)
    {
        _featureManager = featureManager;
    }

    public async Task<IActionResult> Index()
    {
        if (await _featureManager.IsEnabledAsync("NewCheckoutFlow"))
        {
            return View("NewCheckout");
        }

        return View("LegacyCheckout");
    }
}
```

Le pipeline ne fait alors que déployer le code ; l’activation de `NewCheckoutFlow` se gère par configuration.

---

## Canary release et dark launching

### Canary release

Objectif : limiter l’impact d’un bug en exposant d’abord la nouvelle version à un petit pourcentage d’utilisateurs (ou de pods).

Scénarios typiques :

- Déploiement sur un petit sous‑ensemble d’instances (par exemple quelques pods Kubernetes étiquetés « canary »).
- Routage de 5 % du trafic vers la version canary via le load balancer ou le gateway.
- Surveillance de métriques (erreurs, latence, taux de conversion).
- Élargissement progressif (25 %, 50 %, 100 %) si tout reste stable.

Exemple YAML (déploiement canary simplifié vers Kubernetes) :

```yaml
stages:
- stage: Deploy_Canary
  jobs:
  - deployment: DeployCanary
    environment: 'prod-canary'
    strategy:
      canary:
        increments: [10, 50, 100]
        preDeploy:
          steps:
          - script: echo "Déploiement canary - préparation"
        deploy:
          steps:
          - task: KubernetesManifest@1
            inputs:
              action: deploy
              manifests: 'manifests/canary.yaml'
        routeTraffic:
          steps:
          - script: echo "Mise à jour du routage trafic"
        postRouteTraffic:
          steps:
          - script: echo "Surveiller les métriques avant étape suivante"
```

Ici, l’idée est de monter progressivement le pourcentage de trafic (increments).

### Dark launching

Le dark launching permet de déployer une fonctionnalité **complète côté serveur**, mais sans la rendre visible aux utilisateurs finaux.

Mécanismes :

- Flags internes (non exposés au produit) activés seulement pour des comptes internes ou des requêtes spécifiques.
- Endpoints API accessibles uniquement via un header ou un token.
- Configuration dynamique (App Configuration, Key Vault, etc.) pour piloter cette visibilité.

Exemple simple : une nouvelle version du moteur de recommandation est disponible, mais elle est utilisée uniquement pour logger des résultats comparatifs sans impacter réellement les recommandations servies aux utilisateurs.

---

## Tests A/B et diffusion graduelle

### Tests A/B

Les tests A/B visent à comparer deux variantes (A et B) en production, en mesurant des indicateurs métier ou techniques.

Étapes typiques :

1. Déployer les deux variantes (A & B) dans l’environnement de production.
2. Configurer un répartiteur de trafic (front‑door, gateway, feature flag avec pourcentage) :
   - 50 % des utilisateurs → A
   - 50 % des utilisateurs → B
3. Collecter les métriques dans Application Insights, Log Analytics ou une solution d’analytics métier.
4. Décider de la variante gagnante et basculer tout le trafic dessus.

Exemple de pseudo‑configuration de feature flags (JSON) :

```json
{
  "Features": {
    "NewLandingPage": {
      "enabled": true,
      "variants": [
        { "name": "A", "percentage": 50 },
        { "name": "B", "percentage": 50 }
      ]
    }
  }
}
```

### Diffusion graduelle (ring deployment)

La diffusion graduelle consiste à déployer progressivement par « anneaux » (rings) :

- Ring 0 : équipe interne (dogfooding).
- Ring 1 : petit groupe d’utilisateurs externes.
- Ring 2 : région ou segment plus large.
- Ring N : l’ensemble des utilisateurs.

Exemple de structure de pipeline avec plusieurs stages :

```yaml
stages:
- stage: Deploy_Ring0
  jobs:
  - deployment: Ring0
    environment: 'prod-ring0'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Déploiement Ring 0 (interne)"

- stage: Deploy_Ring1
  dependsOn: Deploy_Ring0
  condition: succeeded('Deploy_Ring0')
  jobs:
  - deployment: Ring1
    environment: 'prod-ring1'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Déploiement Ring 1 (bêta)"

- stage: Deploy_Ring2
  dependsOn: Deploy_Ring1
  condition: succeeded('Deploy_Ring1')
  jobs:
  - deployment: Ring2
    environment: 'prod-ring2'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Déploiement Ring 2 (général)"
```

Chaque ring peut intégrer des gates : seuil d’erreurs, qualité, métriques.

---

## Intégration aux systèmes de gestion de l’identité

Un déploiement continu sécurisé implique une intégration forte avec les systèmes de gestion d’identité (Azure AD / Entra ID, identités managées, etc.) et le contrôle d’accès.

### Concepts essentiels

- **Service connections** dans Azure DevOps : objets représentant des identités techniques pour se connecter à Azure, GitHub, Docker registries, etc.
- **Principe du moindre privilège** : le service connection doit n’avoir que les droits nécessaires (par exemple, « Contributor » sur un groupe de ressources spécifique, pas sur l’abonnement entier).
- **Identités managées** (Managed Identities) : identités gérées par Azure pour les ressources (App Service, VM, Functions), à utiliser pour accéder aux secrets ou à d’autres services sans gérer de secrets dans le pipeline.

### Exemple de tâche Azure CLI avec service principal

```yaml
- task: AzureCLI@2
  inputs:
    azureSubscription: 'svc-connection-to-azure'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az webapp deployment slot swap \
        --name myapp \
        --resource-group my-rg \
        --slot green \
        --target-slot production
```

`azureSubscription` fait référence à une connexion de service configurée dans le projet Azure DevOps.

### RBAC et permissions

Points d’attention :

- Isoler les environnements par **resource groups** ou par abonnements.
- Utiliser des rôles intégrés adaptés (Reader, Contributor, Web Deploy, etc.).
- Limiter les permissions des comptes utilisateurs qui modifient les pipelines (séparation des rôles : dev, ops, sécurité).

---

## Gestion des données de configuration des applications

Une architecture de déploiement moderne distingue clairement **code**, **configuration** et **secrets**.

### Types de données de configuration

- Paramètres fonctionnels (feature flags, tailles de cache, URLs de services).
- Paramètres d’infrastructure (sku de base de données, type d’instance).
- Chaînes de connexion, clés API, certificats.

Pratiques recommandées :

- Centraliser la configuration applicative dans un service dédié (par exemple, un service de configuration géré).
- Externaliser les secrets dans un coffre‑fort.
- Versionner des valeurs par environnement (dev, test, prod).
- Charger dynamiquement la configuration (sans redéploiement) si possible.

### Exemple de variables par environnement dans un pipeline

```yaml
variables:
- template: vars/common.yml
- template: vars/vars-dev.yml  # pour un stage dev
```

Fichier `vars/vars-dev.yml` :

```yaml
variables:
  APP_ENV: 'dev'
  API_BASE_URL: 'https://api-dev.contoso.com'
  FEATURE_NEW_CHECKOUT: 'false'
```

L’application consomme ensuite ces variables via des mécaniques de substitution (`fileTransform`, `variable substitution`, etc.).

---

## Travaux pratiques : pipelines as code avec YAML

Ce module vise la maîtrise de la description des pipelines en YAML, ce qui apporte traçabilité, revue de code et réutilisation.

### Étape 1 : pipeline CI de base

Exemple pour une application .NET :

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '8.0.x'

- script: dotnet restore
  displayName: 'Restore'

- script: dotnet build --configuration Release
  displayName: 'Build'

- script: dotnet test --configuration Release --logger trx
  displayName: 'Tests unitaires'
```

Objectifs pédagogiques :

- Comprendre `trigger`, `pool`, `steps`.
- Apprendre à utiliser des tasks (UseDotNet, DotNetCoreCLI, etc.).
- Introduire les tests automatisés.

### Étape 2 : séparation CI / CD avec stages

```yaml
stages:
- stage: Build
  jobs:
  - job: BuildAndTest
    steps:
    - script: dotnet build
    - script: dotnet test

- stage: Deploy_Dev
  dependsOn: Build
  jobs:
  - deployment: DeployToDev
    environment: 'dev'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Déploiement en Dev"

- stage: Deploy_Prod
  dependsOn: Deploy_Dev
  condition: succeeded('Deploy_Dev')
  jobs:
  - deployment: DeployToProd
    environment: 'prod'
    strategy:
      runOnce:
        deploy:
          steps:
          - script: echo "Déploiement en Prod"
```

Ce pipeline illustre la progression : CI → Dev → Prod, avec des environnements distincts et une chaîne de dépendances.

---

## Travaux pratiques : mise en place et exécution de tests fonctionnels

Les tests fonctionnels ou end‑to‑end (E2E) valident une fonctionnalité du point de vue de l’utilisateur.

### Organisation des tests

- Dossier dédié dans le repo (`tests/e2e`).
- Outil adapté : Selenium, Playwright, Cypress, Postman/Newman, etc.
- Données de test gérées par environnement (URLs, utilisateurs de test, etc.).

### Exemple d’intégration de tests Postman/Newman

```yaml
- task: NodeTool@0
  inputs:
    versionSpec: '18.x'

- script: |
    npm install -g newman
    newman run tests/e2e/collection.json \
      --environment tests/e2e/env-dev.json \
      --reporters cli,junit \
      --reporter-junit-export $(System.DefaultWorkingDirectory)/test-results/e2e.xml
  displayName: 'Tests E2E Newman'

- task: PublishTestResults@2
  inputs:
    testResultsFiles: '**/e2e.xml'
    testResultsFormat: 'JUnit'
    testRunTitle: 'Tests E2E'
```

L’objectif pédagogique : relier la réussite du déploiement à la réussite des tests de bout en bout.

---

## Travaux pratiques : intégration d’Azure Key Vault à Azure DevOps

Ce module porte sur la sécurisation des secrets utilisés par les pipelines et par les applications déployées.

### Étapes conceptuelles

1. Créer un coffre‑fort de clés (Key Vault).
2. Définir les secrets (par exemple `DbConnectionString`, `ApiKeyPayment`).
3. Autoriser le service principal / l’identité managée du pipeline à `get` ces secrets.
4. Ajouter une tâche ou une liaison dans Azure Pipelines pour consommer ces secrets.

### Exemple d’utilisation de secrets dans un pipeline

```yaml
variables:
  - group: kv-secrets  # variable group lié au coffre-fort

steps:
- script: |
    echo "Db connection: $(DbConnectionString)"
  displayName: 'Utilisation du secret'
```

Lors de la configuration, le variable group `kv-secrets` est connecté au coffre‑fort et les noms de variables correspondent aux noms de secrets.

### Accès direct via une tâche dédiée

```yaml
- task: AzureKeyVault@2
  inputs:
    azureSubscription: 'svc-connection-to-azure'
    KeyVaultName: 'my-kv'
    SecretsFilter: 'DbConnectionString,ApiKeyPayment'
    RunAsPreJob: true
```

Les secrets deviennent alors accessibles via `$(DbConnectionString)` et `$(ApiKeyPayment)` dans les steps suivants.

---

## Travaux pratiques : configuration dynamique et flags de fonctionnalités

Ce module assemble les notions de configuration externe et de feature flags pour un déploiement vraiment flexible.

### Objectifs

- Découpler le cycle de vie du code de celui des fonctionnalités.
- Permettre l’activation/désactivation de fonctionnalités sans redéploiement.
- Supporter les scénarios canary, dark launch et A/B tests.

### Étapes pédagogiques

1. Ajouter un package de gestion des flags dans l’application (SDK approprié).
2. Créer un magasin de configuration (fichier, service externe, base de données).
3. Brancher l’application sur cette source de configuration.
4. Configurer le pipeline pour déployer la configuration ou mettre à jour le service de configuration à chaque release.

### Exemple : feature flag piloté par variable de pipeline

Pipeline :

```yaml
variables:
  Feature_NewCheckout: 'false'

steps:
- script: echo "FEATURE_NEW_CHECKOUT=$(Feature_NewCheckout)" >> .env
  displayName: 'Génération des variables de fonctionnalité'
```

Code applicatif (pseudo‑code) :

```python
import os

if os.getenv("FEATURE_NEW_CHECKOUT", "false").lower() == "true":
    # Nouveau parcours
    ...
else:
    # Ancien parcours
    ...
```

Pour un canary, la valeur de `Feature_NewCheckout` peut être progressive : `10%`, `50%`, `100%` et l’application applique alors une stratégie de routage interne par pourcentage d’utilisateurs.

---

## Chemin d’apprentissage détaillé pour ce chapitre

Pour assimiler le chapitre 5 de manière progressive et approfondie, un chemin possible est le suivant :

1. **Concepts généraux (1–2 jours)**  
   - Étudier les notions de CI/CD, d’environnements (dev/test/staging/prod).  
   - Comprendre les modèles de déploiement blue‑green, canary, dark launch, A/B, rings, ainsi que leurs avantages/inconvénients.

2. **Pipelines YAML de base (1–3 jours)**  
   - Créer un pipeline CI simple à partir d’un repo existant.  
   - Ajouter des tests unitaires, des artefacts de build, et séparer les stages Build / Deploy.

3. **Déploiement sécurisé multi‑environnements (3–5 jours)**  
   - Ajouter des environnements (dev, test, prod), avec approbations manuelles et gates.  
   - Mettre en œuvre un flux blue‑green ou slots pour les déploiements web.  
   - Intégrer les systèmes de gestion de l’identité via des connexions de service et un RBAC strict.

4. **Stratégies avancées et tests (3–5 jours)**  
   - Mettre en place un canary release et une diffusion graduelle par rings.  
   - Ajouter des tests fonctionnels/E2E dans le pipeline et lier la réussite du déploiement à leur exécution.

5. **Sécurité et configuration (3–5 jours)**  
   - Centraliser les secrets dans un coffre‑fort et les consommer depuis les pipelines.  
   - Introduire un système de configuration externe et des feature flags.  
   - Pratiquer le dark launching et des scénarios simples d’A/B testing.

6. **Industrialisation (continu)**  
   - Factoriser les pipelines avec des templates YAML.  
   - Mettre en place des conventions (naming, structure de repo, gestion des environnements).  
   - Intégrer la surveillance (logs, métriques, traces) dans les stratégies de déploiement (gates automatiques).

---

Si un approfondissement sur un point précis (par exemple « canary sur AKS », « Azure App Configuration + feature flags » ou « Key Vault + identités managées ») est souhaité, un focus détaillé avec plus de code et de scénarios concrets peut être proposé.
