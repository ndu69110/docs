# Citations
- https://learn.microsoft.com/fr-fr/training/modules/manage-build-dependencies/
- https://www.varonis.com/fr/blog/presentation-azure-devops
- https://learn.microsoft.com/fr-fr/shows/azure-devops-launch-2018/a106
- https://learn.microsoft.com/fr-fr/azure/devops/artifacts/start-using-azure-artifacts?view=azure-devops
- https://learn.microsoft.com/fr-fr/azure/devops/pipelines/release/artifacts?view=azure-devops
- https://learn.microsoft.com/fr-fr/azure/devops/project/navigation/add-artifact-team?view=azure-devops
- https://www.datacamp.com/fr/tutorial/azure-devops
- https://blog.stephane-robert.info/docs/developper/artefacts/
- https://learn.microsoft.com/fr-fr/azure/devops/artifacts/tutorials/protect-oss-packages-with-upstream-sources?view=azure-devops
- https://www.getguru.com/fr/reference/how-to-use-azure-devops-a-comprehensive-guide


# Tokens
- prompt_tokens: 323
- completion_tokens: 5796
- total_tokens: 6119
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.087, 'request_cost': 0.006, 'total_cost': 0.094}


# Content
Il n’est pas possible dans ce contexte de vérifier l’existence d’images ni de les insérer depuis la documentation Microsoft ou d’autres sites, car l’accès direct aux ressources externes est désactivé dans cet environnement. Il est néanmoins possible de proposer un parcours détaillé, structuré et illustré par des scripts, tableaux et descriptions textuelles de schémas, afin de guider un apprentissage complet sur la gestion des dépendances avec Azure DevOps et Azure Artifacts.

---

## Vue d’ensemble du chapitre 8

Ce chapitre couvre la gestion des dépendances de paquets dans un environnement Azure DevOps, depuis l’analyse des dépendances, la compréhension des types de registres de paquets, la migration et la sécurisation des artefacts, jusqu’à la mise en œuvre d’une stratégie de versioning et l’introduction à GitHub Packages. L’objectif est de donner une vision de bout en bout : produire des artefacts dans des pipelines, les stocker dans Azure Artifacts ou GitHub Packages, les consommer dans d’autres projets, puis les sécuriser et les versionner de manière maîtrisée.

---

## Analyse des dépendances des paquets

L’analyse des dépendances consiste à comprendre quels paquets sont utilisés par quelles applications, à quels endroits ils sont déclarés et comment ces dépendances transitives influencent la maintenance, la sécurité et la performance des builds. Dans Azure DevOps, cette analyse se fait à la fois au niveau du code (fichiers de configuration de dépendances) et des pipelines (tâches qui restaurent et publient des paquets).

### Fichiers de dépendances typiques

Quelques exemples de fichiers de dépendances courants :

- Projets .NET : `*.csproj`, `packages.config`, `Directory.Packages.props`
- Node.js / front-end : `package.json`, `package-lock.json` ou `yarn.lock`
- Java / Maven : `pom.xml`
- Python : `requirements.txt`, `pyproject.toml`

Chaque fichier exprime :
- Les noms des paquets.
- Les contraintes de version (exacte, intervalle, préversion, etc.).
- Parfois le registre à utiliser (scopes npm, sources NuGet, etc.).

Exemple simplifié d’un `package.json` (Node.js) :

```json
{
  "name": "front-end-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "@org/shared-ui": "1.3.0"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

Schéma textuel possible pour visualiser les dépendances :

- Application `front-end-app`
  - Dépend de `react` (librairie externe, registre public)
  - Dépend de `@org/shared-ui` (librairie interne, registre Azure Artifacts)
  - Dépend de `jest` (développement uniquement)

Ce type de schéma peut être représenté sous forme de graphe de dépendances où chaque nœud est un paquet et chaque arête une relation « dépend de ».

### Table de cartographie des dépendances

Un tableau permet de lister les dépendances critiques, leur source et leur criticité :

| Application         | Paquet              | Version    | Registre cible           | Criticité | Commentaire                             |
|---------------------|---------------------|-----------:|--------------------------|-----------|-----------------------------------------|
| front-end-app       | react               | ^18.2.0    | npm public               | Élevée    | Impact sur toute l’UI                   |
| front-end-app       | @org/shared-ui      | 1.3.0      | Azure Artifacts npm feed | Élevée    | Lib interne à maintenir en priorité     |
| api-orders          | Newtonsoft.Json     | 13.0.1     | NuGet public             | Moyenne   | Version stable, surveiller les failles  |
| api-orders          | Company.Core        | 2.1.0      | Azure Artifacts NuGet    | Critique  | Paquet métier central                   |

Une bonne pratique consiste à maintenir ce type de cartographie au moins pour les paquets internes stratégiques (librairies partagées, SDK internes) et pour les dépendances externes critiques (frameworks, bibliothèques de sécurité, etc.).

---

## Comprendre la gestion des paquets

La gestion des paquets dans Azure DevOps repose principalement sur Azure Artifacts, qui fournit des flux (feeds) servant de registres privés pour différents formats de paquets : NuGet, npm, Maven, Python, paquets universels, etc. Ces flux sont utilisés à la fois pour publier les artefacts produits par les pipelines, et pour restaurer les dépendances lors des builds et des exécutions.

### Concepts principaux

- Flux (feed) : référentiel logique qui stocke des versions de paquets pour un ou plusieurs formats.
- Portée du flux : organisation, projet ou personnel, ce qui conditionne la visibilité et la gouvernance.
- Upstream sources : mécanisme permettant de chaîner des flux, par exemple un flux interne qui met en cache un registre public tout en permettant le contrôle des versions autorisées.
- Clients : outils et SDK utilisés pour publier et restaurer les paquets (dotnet CLI, NuGet CLI, npm, Maven, pip, etc.).

Schéma textuel typique :

1. Un pipeline de build produit un package (par exemple un `.nupkg` NuGet).
2. Le pipeline publie ce package dans un flux Azure Artifacts.
3. D’autres pipelines ou développeurs restaurent ce package à partir du flux.
4. Les applications construites sont déployées en s’appuyant sur ces paquets versionnés.

### Exemple de configuration NuGet dans Azure DevOps

Exemple de tâche YAML qui configure NuGet pour utiliser un flux Azure Artifacts :

```yaml
- task: NuGetAuthenticate@1
  inputs:
    nuGetServiceConnections: 'ConnectionToArtifacts'

- task: DotNetCoreCLI@2
  displayName: 'Restore packages'
  inputs:
    command: 'restore'
    projects: '**/*.csproj'
```

Cette configuration assure que les commandes de restauration utilisent les bonnes informations d’authentification pour accéder au flux privé.

---

## Migrer, consolider et sécuriser les artefacts

Avec le temps, les artefacts (bibliothèques, binaires, paquets) peuvent se retrouver dispersés dans plusieurs registres ou systèmes (fichiers partagés, anciens serveurs NuGet, registries npm internes, etc.). Une stratégie de migration et de consolidation est essentielle pour réduire la complexité et améliorer la sécurité.

### Étapes typiques de migration

1. **Inventaire**  
   - Lister les sources existantes : serveurs NuGet on-prem, registries npm, repos Maven, dossiers réseau, etc.  
   - Identifier les paquets réellement utilisés dans les projets actifs.

2. **Plan de consolidation**  
   - Choisir un ou plusieurs flux Azure Artifacts comme registres de référence.  
   - Définir l’architecture : un flux global par type de paquet, un flux par domaine métier, ou un mix des deux.

3. **Migration des paquets**  
   - Exporter et republier les paquets dans Azure Artifacts via les CLI (nuget, npm, twine, etc.).  
   - Mettre à jour les fichiers de configuration pour pointer vers les nouveaux flux (par exemple `nuget.config`, `.npmrc`, `settings.xml` pour Maven).

4. **Nettoyage et décommissionnement**  
   - Désactiver progressivement les registres anciens après validation que tous les pipelines utilisent les ressources migrées.  
   - Archiver ou supprimer les paquets obsolètes.

### Exemple : migration d’un paquet NuGet

Supposons un paquet interne `Company.Core.2.1.0.nupkg` stocké dans un dossier réseau. La migration manuelle vers Azure Artifacts peut se faire comme suit :

1. Configurer la source Azure Artifacts dans `nuget.config` :

```xml
<configuration>
  <packageSources>
    <add key="AzureArtifacts" value="https://pkgs.dev.azure.com/ORG/PROJECT/_packaging/FEED_NAME/nuget/v3/index.json" />
  </packageSources>
</configuration>
```

2. Publier le paquet :

```bash
nuget push Company.Core.2.1.0.nupkg -Source AzureArtifacts -ApiKey AZURE_DEVOPS_ARTIFACTS
```

Une fois le paquet migré, les projets consommateurs doivent être mis à jour pour référencer la nouvelle source NuGet et, si nécessaire, pour verrouiller ou ajuster les versions.

### Sécurisation des artefacts

La sécurisation concerne principalement :

- Les permissions de lecture / contribution sur les flux (RBAC).
- Les politiques de rétention et de nettoyage automatique.
- La protection contre les paquets malveillants via les upstream sources contrôlées.
- La gestion des identifiants et des jetons d’accès dans les pipelines (variables secrètes, connexions de service, etc.).

Exemples de bonnes pratiques :

- Restreindre l’accès en écriture aux flux à un groupe dédié (équipe plateforme ou DevOps).
- Autoriser la lecture à l’ensemble des équipes qui consomment les paquets, mais interdire la publication non contrôlée.
- Configurer des politiques pour supprimer automatiquement les versions obsolètes après un certain nombre de jours tout en gardant les versions marquées comme LTS.

Tableau de stratégie de permissions :

| Flux              | Rôle « Contributeur »        | Rôle « Lecteur »                    | Politiques clés                         |
|-------------------|------------------------------|-------------------------------------|-----------------------------------------|
| libs-backend      | Équipe Plateforme Backend    | Toutes les équipes backend          | Rétention 180 jours, validation manuelle|
| libs-frontend     | Équipe Plateforme Frontend   | Toutes les équipes frontend         | Rétention 90 jours, scan sécurité       |
| shared-components | Équipe Architecture & DevOps | Toutes les équipes de développement | Tagging obligatoire (stable, preview)   |

---

## Mise en œuvre d’une stratégie de gestion des versions

Une stratégie de versioning cohérente est centrale pour gérer les dépendances. Le plus courant est le versioning sémantique (SemVer), structuré en `MAJEUR.MINOR.PATCH` avec éventuellement des suffixes de préversion.

### Principes de versioning sémantique

- Version majeure (MAJEUR) : augmente en cas de changements incompatibles (breaking changes).
- Version mineure (MINOR) : augmente pour ajouter des fonctionnalités rétro-compatibles.
- Version de correctif (PATCH) : augmente pour des corrections de bugs sans impact sur l’API publique.

Exemples de versions :

- `1.0.0` : version initiale stable.
- `1.1.0` : ajout d’une fonctionnalité compatible.
- `1.1.1` : correctif de bug.
- `2.0.0` : changement incompatible qui impose une migration.

### Intégration du versioning dans Azure DevOps

Une bonne pratique consiste à lier la version d’un paquet à :

- La version déclarée dans le code (par exemple dans un fichier `.csproj` ou `package.json`).
- Les numéros de build générés par les pipelines Azure.
- Les tags Git (par exemple `v1.2.0`).

Exemple de génération de version dynamique dans un pipeline YAML (C#) :

```yaml
trigger:
  branches:
    include:
      - main

variables:
  major: '1'
  minor: '2'

steps:
- script: |
    patch=$(Build.BuildId)
    echo "##vso[task.setvariable variable=PackageVersion]$(major).$(minor).$patch"
  displayName: 'Calculer la version du paquet'

- task: DotNetCoreCLI@2
  displayName: 'Pack'
  inputs:
    command: 'pack'
    packagesToPack: '**/*.csproj'
    versioningScheme: 'byEnvVar'
    versionEnvVar: 'PackageVersion'
```

Dans cet exemple, chaque build sur la branche principale produit un paquet dont la version PATCH est dérivée de l’identifiant de build. Les versions MAJEUR et MINOR restent sous contrôle explicite (variables ou fichier de configuration).

### Politique de version côté consommateurs

Les projets consommateurs doivent exprimer leur tolérance aux changements via les contraintes de versions :

- Verrouillage strict : `1.2.5` (version exacte, stabilité maximale).
- Compatibilité mineure : `^1.2.0` (npm) ou `[1.2.0,2.0.0)` (NuGet/Maven-like), ce qui autorise les mises à jour de correctifs et de versions mineures.
- Environnement de test : autoriser les préversions (`1.3.0-preview.1`) pour valider les nouvelles fonctionnalités.

Tableau de recommandations :

| Type de composant           | Environnement    | Politique de version recommandée         |
|----------------------------|------------------|------------------------------------------|
| Librairies partagées métier| Production       | Version exacte ou compatibilité mineure  |
| Bibliothèques UI           | Préproduction    | Compatibilité mineure avec tests visuels |
| Outils internes CLI        | Développement    | Préversions autorisées                   |

---

## Introduction aux paquets GitHub

GitHub Packages est une offre de registre de paquets intégrée à GitHub, souvent utilisée conjointement avec GitHub Actions, mais qui peut aussi être consommée depuis des projets Azure DevOps. Le principe reste le même : héberger des paquets (npm, NuGet, Maven, Docker, etc.) et les consommer dans les builds.

### Scénarios d’usage avec Azure DevOps

- Code et CI/CD dans Azure DevOps, mais dépendances partagées via GitHub Packages (par exemple pour une organisation déjà fortement investie sur GitHub).
- Utilisation de packages open source ou internes publiés sur GitHub Packages, restaurés dans des pipelines Azure DevOps.

Exemple de configuration npm pour consommer un package depuis GitHub Packages :

```bash
npm config set @org:registry=https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Dans un pipeline Azure DevOps, le jeton GitHub peut être stocké comme variable secrète et injecté au moment de la restauration des paquets.

### Intégration NuGet avec GitHub Packages

Pour NuGet, un `nuget.config` peut contenir une source GitHub Packages :

```xml
<configuration>
  <packageSources>
    <add key="github" value="https://nuget.pkg.github.com/ORG/index.json" />
  </packageSources>
  <packageSourceCredentials>
    <github>
      <add key="Username" value="GITHUB_USERNAME" />
      <add key="ClearTextPassword" value="GITHUB_TOKEN" />
    </github>
  </packageSourceCredentials>
</configuration>
```

Dans Azure DevOps, il est recommandé de ne pas stocker les identifiants en clair, mais de les fournir via des variables sécurisées ou des fichiers de configuration générés à la volée dans les étapes du pipeline.

---

## Travaux pratiques : gestion des paquets avec Azure Artifacts

Cette partie décrit un chemin d’apprentissage pratique, étape par étape, pour maîtriser la gestion des paquets avec Azure Artifacts dans Azure DevOps.

### Étape 1 : Création d’un flux Azure Artifacts

Objectif : créer un flux qui servira de registre privé pour un type de paquet choisi (par exemple NuGet ou npm).

Chemin recommandé :

1. Créer un projet Azure DevOps dédié au laboratoire (par exemple `DevOps-Dependencies-Lab`).
2. Accéder au service Artifacts et créer un flux nommé `libs-shared`.
3. Choisir le format de paquet principal (NuGet, npm…) et configurer éventuellement des upstream sources vers les registres publics (nuget.org, npmjs.com, etc.).
4. Définir des permissions de base : contributions pour le groupe de laboratoire, lecture pour le reste de l’organisation (si nécessaire).

Schéma textuel :

- Projet `DevOps-Dependencies-Lab`
  - Flux `libs-shared`
    - Packages : `Company.Core`, `Company.Logging`, `Company.UI`

### Étape 2 : Création d’une bibliothèque packagée

Objectif : créer un mini-projet de bibliothèque (par exemple une librairie .NET ou un module npm) et le transformer en paquet versionné.

Exemple .NET minimal (bibliothèque C#) :

1. Dans un dépôt Git Azure DevOps, créer un projet :

```bash
dotnet new classlib -n Company.Core
```

2. Modifier la version dans le fichier `Company.Core.csproj` :

```xml
<PropertyGroup>
  <TargetFramework>net8.0</TargetFramework>
  <Version>1.0.0</Version>
</PropertyGroup>
```

3. Générer un paquet localement :

```bash
dotnet pack Company.Core/Company.Core.csproj -c Release -o ./nupkgs
```

Un fichier `Company.Core.1.0.0.nupkg` est produit et prêt à être publié.

### Étape 3 : Publication automatique via pipeline

Objectif : automatiser la publication du paquet vers le flux Azure Artifacts via un pipeline YAML.

Exemple de pipeline Azure DevOps (fichier `azure-pipelines.yml`) :

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: UseDotNet@2
  displayName: 'Use .NET SDK'
  inputs:
    packageType: 'sdk'
    version: '8.x'

- task: DotNetCoreCLI@2
  displayName: 'Restore'
  inputs:
    command: 'restore'
    projects: 'Company.Core/Company.Core.csproj'

- task: DotNetCoreCLI@2
  displayName: 'Build'
  inputs:
    command: 'build'
    projects: 'Company.Core/Company.Core.csproj'
    arguments: '--configuration Release'

- task: DotNetCoreCLI@2
  displayName: 'Pack'
  inputs:
    command: 'pack'
    packagesToPack: 'Company.Core/Company.Core.csproj'
    configuration: 'Release'
    includesymbols: true
    versioningScheme: 'off'

- task: NuGetAuthenticate@1
  displayName: 'Authenticate to Azure Artifacts'

- task: DotNetCoreCLI@2
  displayName: 'Push to Azure Artifacts'
  inputs:
    command: 'push'
    publishVstsFeed: 'libs-shared'
    packagesToPush: '$(Build.SourcesDirectory)/**/bin/Release/*.nupkg'
```

Ce pipeline :

- Restaure les dépendances.
- Compile la bibliothèque.
- Crée le paquet.
- Authentifie le pipeline auprès d’Azure Artifacts.
- Pousse le paquet dans le flux `libs-shared`.

### Étape 4 : Consommation du paquet dans une autre application

Objectif : utiliser le paquet `Company.Core` depuis une autre application (par exemple une API).

Chemin :

1. Créer un second dépôt et projet (par exemple `Orders.Api`).
2. Configurer `nuget.config` pour pointer vers le flux Azure Artifacts.
3. Ajouter une référence au paquet `Company.Core` dans le fichier `.csproj` de l’API :

```xml
<ItemGroup>
  <PackageReference Include="Company.Core" Version="1.0.0" />
</ItemGroup>
```

4. Mettre en place un pipeline pour restaurer les dépendances, construire et exécuter les tests de l’API.

Exemple de tâche de restauration :

```yaml
- task: NuGetAuthenticate@1
  displayName: 'Authenticate to Azure Artifacts'

- task: DotNetCoreCLI@2
  displayName: 'Restore packages'
  inputs:
    command: 'restore'
    projects: 'Orders.Api/Orders.Api.csproj'
```

### Étape 5 : Gestion des versions et mises à jour

Objectif : simuler l’évolution de la bibliothèque `Company.Core` et la mise à jour de l’API consommatrice.

Chemin :

1. Modifier la bibliothèque `Company.Core`, par exemple ajout d’une nouvelle méthode.
2. Augmenter la version dans `Company.Core.csproj` en fonction du type de changement :
   - Ajout de fonctionnalité compatible : `1.1.0`.
   - Correctif : `1.0.1`.
   - Rupture de compatibilité : `2.0.0`.
3. Lancer le pipeline de build de la bibliothèque pour publier la nouvelle version.
4. Dans l’API `Orders.Api`, mettre à jour la référence de paquet :
   - Soit automatiquement si la contrainte de version le permet.
   - Soit manuellement en ajustant la version dans le `.csproj`.

Tableau de suivi des versions :

| Paquet         | Version | Type de changement     | Applications consommatrices impactées   |
|----------------|---------|------------------------|-----------------------------------------|
| Company.Core   | 1.0.0   | Version initiale       | Orders.Api 1.0.0                        |
| Company.Core   | 1.1.0   | Ajout fonctionnalité   | Orders.Api 1.1.0 (mise à jour requise)  |
| Company.Core   | 2.0.0   | Changement incompatible| Orders.Api 2.0.0 (migration majeure)    |

### Étape 6 : Sécurisation et nettoyage

Objectif : mettre en place des mesures pour que le flux reste propre et sécurisé.

Actions possibles :

- Configurer une politique de rétention pour supprimer les versions de paquets non téléchargées depuis un certain temps (par exemple 180 jours).
- Mettre en place un processus de revue avant publication de nouvelles versions majeures (via pull requests et validations de pipeline).
- Centraliser la configuration d’accès aux flux (groupes et permissions) et vérifier régulièrement les droits.

---

## Chemin d’apprentissage détaillé

Un chemin d’apprentissage structuré autour de ce chapitre peut se dérouler de la manière suivante, en s’appuyant progressivement sur les notions abordées :

1. **Fondations de la gestion de paquets**
   - Étudier les formats de paquets utilisés dans l’écosystème ciblé (NuGet, npm, Maven, Python).
   - Comprendre l’expression des dépendances dans les fichiers de configuration et les implications des contraintes de version.
   - Cartographier les dépendances critiques dans les projets existants.

2. **Découverte d’Azure Artifacts**
   - Comprendre le rôle des flux (feeds) et leurs types.
   - Créer un premier flux de test, publier un paquet simple, puis le consommer dans un second projet.
   - Prendre en main les tâches de pipeline liées aux paquets (authentification, pack, push, restore).

3. **Migration et consolidation**
   - Réaliser un inventaire des sources de paquets existantes.
   - Concevoir une architecture cible des flux (par domaine ou par type).
   - Mettre en œuvre un plan de migration progressif, avec mises à jour des références dans les pipelines et les projets.

4. **Stratégie de versioning avancée**
   - Adopter une convention de versioning sémantique adaptée à l’organisation.
   - Intégrer le versioning dans les pipelines (calcul automatique de patch, versions de préproduction, tags Git).
   - Définir des règles explicites pour les consommateurs (verrouillage, compatibilité mineure, tests de régression).

5. **Ouverture à GitHub Packages**
   - Explorer l’utilisation de registres GitHub Packages pour des projets open source ou hybrides.
   - Configurer la consommation de paquets GitHub dans des pipelines Azure DevOps via des jetons sécurisés.
   - Comparer les cas d’usage pertinents entre Azure Artifacts et GitHub Packages, voire leur cohabitation.

6. **Industrialisation et gouvernance**
   - Standardiser les modèles de pipelines pour la création et la publication de paquets.
   - Documenter clairement les flux, les conventions de nommage, les stratégies de versioning et les règles de sécurité.
   - Mettre en place une gouvernance (groupe responsable des flux, revue périodique des dépendances, scan de sécurité).

Ce chemin permet à la fois une montée en compétence progressive et un alignement avec les besoins réels d’un environnement d’entreprise : centralisation des dépendances, réduction de la dette technique, amélioration de la sécurité et maîtrise des versions tout au long du cycle de vie applicatif.
