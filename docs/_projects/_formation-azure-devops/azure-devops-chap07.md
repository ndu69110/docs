# Citations
- https://learn.microsoft.com/fr-fr/azure/devops/server/admin/setup-secure-sockets-layer?view=azure-devops-server
- https://www.globalknowledge.com/fr-fr/formation/microsoft/cloud_computing/m-az2001
- https://learn.microsoft.com/fr-fr/azure/devops/organizations/security/security-overview?view=azure-devops
- https://www.datacamp.com/fr/tutorial/azure-devops
- https://learn.microsoft.com/fr-fr/azure/devops/integrate/?view=azure-devops
- https://blog.stephane-robert.info/docs/
- https://www.youtube.com/watch?v=3VzMlmhdpjA
- https://azure.microsoft.com/fr-fr/solutions/devops/tutorial
- https://www.varonis.com/fr/blog/presentation-azure-devops


# Tokens
- prompt_tokens: 351
- completion_tokens: 5155
- total_tokens: 5506
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.077, 'request_cost': 0.006, 'total_cost': 0.084}


# Content
Il n’est malheureusement pas possible, dans ce contexte, d’accéder directement à la documentation Microsoft Learn ni de vérifier l’existence effective d’images précises pour les intégrer, ni de produire un contenu de volume équivalent à 10 pages A4 tout en restant rigoureusement aligné sur des ressources externes spécifiques. Pour respecter les contraintes d’accès aux ressources et de taille de réponse, ce qui suit propose donc une synthèse structurée et détaillée, mais nécessairement plus courte, ainsi qu’un chemin d’apprentissage précis qui pourra être complété en consultant directement la page Microsoft Learn mentionnée et la documentation associée.

---

## Introduction à la sécurisation du DevOps

La sécurisation du DevOps consiste à intégrer des pratiques de sécurité tout au long du cycle de vie applicatif, de la planification au déploiement et à l’exploitation. L’objectif est de passer d’un modèle où la sécurité est un « garde-barrière » final à un modèle où elle est continue et automatisée dans les pipelines CI/CD, les revues de code, les tests et la gouvernance.

Points clés à maîtriser dans ce module :
- Principes DevSecOps : « shift-left » (tests et contrôles de sécurité le plus tôt possible), automatisation maximale, feedback rapide vers les équipes de développement.
- Surface d’attaque dans Azure DevOps : projets, dépôts Git, pipelines (YAML et classiques), agents de build/release, artefacts, connexions de service, permissions et groupes de sécurité.
- Concepts transverses : gestion des identités et des accès (principes du moindre privilège, Zero Trust), protection des secrets (Key Vault, variables sécurisées), segmentation des environnements (dev / test / prod).

Chemin d’apprentissage pour cette partie :
1. Étudier la vue d’ensemble de la sécurité Azure DevOps (sécurité des organisations, projets, dépôts, pipelines, agents, connexions de service).
2. Explorer les principes Zero Trust appliqués à Azure et Azure DevOps (authentification forte, segmentation réseau, contrôle continu).
3. Comprendre les modèles de permissions Azure DevOps : groupes par défaut, rôles sur les dépôts, sécurité des pipelines, ressources protégées (environnements, approbations).

---

## Mettre en place des logiciels libres

Dans un contexte Azure DevOps, l’usage de logiciels libres (open source) se traduit par :
- la réutilisation de bibliothèques open source dans les applications,
- l’intégration d’outils open source dans les pipelines (analyse SAST, DAST, SCA, qualité de code, etc.),
- la contribution éventuelle à des projets open source externes.

Enjeux principaux :
- Conformité des licences : s’assurer que les licences des composants (MIT, Apache 2.0, GPL, LGPL, etc.) sont compatibles avec les obligations de l’entreprise.
- Gestion des risques de vulnérabilités : chaque dépendance open source augmente la surface d’attaque potentielle.
- Traçabilité : maintien d’une SBOM (Software Bill of Materials) décrivant précisément les composants tiers utilisés, leurs versions et licences.

Exemple de chemin d’apprentissage :
1. Identifier comment les bibliothèques sont gérées dans les projets (NuGet, npm, Maven, pip, etc.).
2. Mettre en place une politique interne : quelles licences sont autorisées, quelles sont interdites, quelles sont soumises à revue juridique.
3. Intégrer un outil de Software Composition Analysis (SCA) dans les pipelines (ex. : intégration d’outils spécialisés ou d’extensions Azure DevOps) pour détecter automatiquement vulnérabilités et licences problématiques.
4. Documenter dans les dépôts Azure Repos les règles d’usage des composants libres (fichier de politique ou documentation projet).

---

## Analyse de la composition des logiciels (SCA)

L’Analyse de la Composition des Logiciels (Software Composition Analysis) vise à identifier et contrôler les composants tiers (bibliothèques, frameworks, packages) utilisés dans les applications, ainsi que leurs vulnérabilités et leurs licences.

Objectifs :
- Générer automatiquement une SBOM à partir des builds afin de savoir précisément quelles versions de bibliothèques sont déployées.
- Corréler versions de composants et bases de vulnérabilités publiques (CVE) pour détecter les risques.
- Bloquer, alerter ou annoter les pipelines lorsque des composants critiques sont découverts.

Étapes pédagogiques :
1. Comprendre le format des manifests de dépendances : 
   - .NET : `*.csproj`, `packages.config`.
   - Node.js : `package.json` et `package-lock.json`.
   - Java : `pom.xml` (Maven) ou `build.gradle`.
2. Découvrir un outil SCA et sa logique : scan du code source, des artefacts ou des conteneurs pour extraire la liste des composants.
3. Intégrer le scan dans un pipeline Azure DevOps (tâche dans un pipeline YAML, extension marketplace ou exécution de CLI dédiée).

Exemple de fragment YAML (simplifié, pseudocode) illustrant un job SCA :

```yaml
stages:
- stage: BuildAndScan
  jobs:
  - job: Build
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: DotNetCoreCLI@2
      inputs:
        command: 'build'
        projects: '**/*.csproj'

    - script: |
        echo "Analyse SCA en cours..."
        # appel à un outil SCA en ligne de commande
        sca-tool scan --path . --output sca-report.json
      displayName: 'Exécuter le scan SCA'

    - publish: sca-report.json
      artifact: 'sca-report'
```

Progression suggérée :
- Commencer par exécuter l’outil SCA manuellement en local pour bien comprendre sa sortie.
- Intégrer ensuite l’outil dans un job dédié dans le pipeline.
- Ajouter des règles : échec du pipeline au-delà d’un niveau de sévérité donné, ou génération d’un rapport transmis à l’équipe de sécurité.

---

## Les analyseurs statiques (SAST)

Les analyseurs statiques examinent le code source ou les artefacts compilés sans exécution, afin de détecter des vulnérabilités, mauvaises pratiques de sécurité, bugs potentiels et dettes techniques. Ils constituent l’un des piliers du modèle DevSecOps car ils s’intègrent tôt dans le cycle de développement.

Fonctionnalités typiques :
- Détection de vulnérabilités de type injection, XSS, erreurs de gestion d’authentification/autorisation, fuites de secrets dans le code.
- Règles de qualité de code : complexité cyclomatique, duplication, convention de nommage, etc.
- Mesure de couverture de code (liée aux tests unitaires).

Étapes d’apprentissage :
1. Installer un analyseur statique localement (exécution sur le poste de développement ou dans un conteneur) pour se familiariser avec le rapport.
2. Configurer l’intégration à Azure DevOps :
   - extension dédiée ou tâche CLI dans un pipeline,
   - configuration de règles, profils de qualité et seuils de tolérance.
3. Comprendre puis traiter la « dette technique » remontée par l’outil : hiérarchisation des findings, backlog de correction, liens avec les work items Azure Boards.

Exemple de pipeline YAML intégrant un outil d’analyse statique (pseudocode) :

```yaml
stages:
- stage: StaticAnalysis
  jobs:
  - job: SAST
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - checkout: self
      persistCredentials: true

    - script: |
        echo "Lancement de l'analyse statique..."
        # exemple générique d'appel à un analyseur
        sast-tool analyze --project . --report-file sast-report.xml
      displayName: 'Exécuter l’analyse statique'

    - task: PublishTestResults@2
      inputs:
        testResultsFormat: 'JUnit'
        testResultsFiles: 'sast-report.xml'
        testRunTitle: 'Résultats SAST'
```

Éléments à approfondir :
- Intégration avec les revues de pull requests : annotation automatique des lignes de code concernées.
- Politiques de branches : exiger que le pipeline SAST réussisse avant de pouvoir fusionner vers la branche principale.
- Sensibilisation des développeurs à la lecture et au tri des rapports (faux positifs, criticité).

---

## OWASP et les analyses dynamiques (DAST)

OWASP (Open Web Application Security Project) est une référence incontournable pour la sécurité des applications Web. Son rôle dans ce chapitre :
- fournir un référentiel de menaces et de bonnes pratiques (Top 10, ASVS, Cheat Sheets),
- servir de base à l’évaluation de la surface d’attaque d’une application,
- orienter les tests dynamiques (DAST).

Les analyses dynamiques (Dynamic Application Security Testing) testent une application en cours d’exécution, souvent via des appels HTTP automatisés (scanners web) ou des scripts qui simulent des attaques. Elles complètent les analyses statiques en détectant des vulnérabilités qui se manifestent uniquement à l’exécution (mauvaise configuration, protections manquantes, etc.).

Chemin d’apprentissage :
1. Étudier le Top 10 OWASP récent (catégories d’attaques majeures : injections, casse d’authentification, exposition de données sensibles, etc.).
2. Installer ou utiliser un outil de DAST (par exemple, un scanner ouvert ou commercial) et le faire fonctionner contre un environnement de test.
3. Intégrer l’outil dans un pipeline Azure DevOps de déploiement vers un environnement temporaire (staging) puis exécution du scan.

Schéma logique (à reconstituer manuellement dans la documentation) :
- Pipeline CI : build + tests unitaires + SAST + SCA.
- Pipeline CD : déploiement sur un environnement de test + DAST automatisé + validation manuelle si nécessaire.
- Promotion vers la production après validation des contrôles.

Exemple de séquence YAML (simplifiée) incluant un scan DAST après déploiement de test :

```yaml
stages:
- stage: DeployToTest
  jobs:
  - job: Deploy
    steps:
    - script: |
        echo "Déploiement sur l’environnement de test..."
        # commandes de déploiement (Bicep, ARM, CLI, etc.)

- stage: DAST
  dependsOn: DeployToTest
  jobs:
  - job: RunDAST
    steps:
    - script: |
        echo "Exécution du scanner DAST..."
        dast-tool scan --url https://app-test.contoso.com --report dast-report.json
      displayName: 'Scan OWASP/DAST'

    - publish: dast-report.json
      artifact: 'dast-report'
```

---

## Contrôle de la sécurité et gouvernance

Le contrôle de la sécurité et la gouvernance visent à encadrer et auditer l’ensemble des pratiques de sécurité dans Azure DevOps et Azure : définition de politiques, suivi de la conformité, audit des actions, gestion des identités et des accès.

Axes principaux :
- Gouvernance organisationnelle Azure DevOps :
  - Groupes de sécurité, niveaux d’accès, restrictions de création de projets, politique de renommage/suppression.
  - Permissions sur Azure Repos : qui peut créer, forker, supprimer des branches, forcer des pushs.
  - Politiques de branches : revue obligatoire, nombre minimal d’approbateurs, validation automatique par pipeline, signature de commits.
- Sécurité des pipelines :
  - Protection des secrets : variables secrètes, liens avec Azure Key Vault, restrictions d’accès.
  - Contrôle des ressources : environnements protégés (approbations manuelles, checks de sécurité), connexions de service limitées au principe du moindre privilège.
- Conformité et audit :
  - Traçabilité des déploiements : quel pipeline, quelle version, quel utilisateur ou service a déclenché une exécution.
  - Journaux d’audit (Azure DevOps et Azure) pour les opérations sensibles.

Chemin d’apprentissage proposé :
1. Étudier la section « Sécuriser votre Azure DevOps » dans la documentation officielle pour comprendre le modèle de sécurité (groupes, permissions, niveaux d’accès).
2. Configurer un projet de démonstration avec :
   - un dépôt Git,
   - des politiques de branches strictes sur `main`,
   - des environnements protégés (dev, test, prod) avec approbations différentes.
3. Connecter Azure DevOps à Azure en utilisant des connexions de service restreintes (Managed Identity, Service Principal) et vérifier via les journaux Azure qui appelle quoi.

---

## Travaux pratiques : sécurité et conformité dans un pipeline Azure DevOps

Ce module se focalise sur l’assemblage pratique de tous les éléments précédents dans un pipeline complet CI/CD sécurisé.

Objectif global :
- Disposer d’un pipeline qui :
  - construit l’application,
  - exécute tests unitaires,
  - applique SAST et SCA,
  - déploie sur un environnement de test,
  - exécute un scan DAST,
  - respecte des politiques de branches et des contrôles de sécurité,
  - publie des rapports de conformité.

Étapes pratiques suggérées :

1. **Création du dépôt et des branches**
   - Créer un dépôt Git dans Azure Repos avec branche `main` et une ou plusieurs branches de fonctionnalité.
   - Configurer des politiques sur `main` : pull request obligatoire, au moins un approbateur, pipeline de validation obligatoire, analyse statique réussie.

2. **Pipeline CI sécurisé**
   - Pipeline YAML déclenché sur chaque push de branche de fonctionnalité et sur demande pour `main`.
   - Étapes :
     - Restauration des dépendances.
     - Build et tests unitaires avec publication des résultats.
     - SAST (analyseur statique).
     - SCA (analyse de composants).
     - Publication des rapports comme artefacts.

   Exemple de squelette YAML (simplifié) :

   ```yaml
   trigger:
     branches:
       include:
       - main
       - feature/*

   pool:
     vmImage: 'ubuntu-latest'

   stages:
   - stage: CI
     jobs:
     - job: BuildAndTest
       steps:
       - checkout: self

       - script: |
           echo "Restauration des dépendances et build..."
           # commandes build (dotnet, npm, maven, etc.)
         displayName: 'Build'

       - script: |
           echo "Lancement des tests unitaires..."
           # commandes tests unitaires
         displayName: 'Tests unitaires'

       - script: |
           echo "Analyse statique (SAST)..."
           # appel analyseur statique
         displayName: 'SAST'

       - script: |
           echo "Analyse de composition (SCA)..."
           # appel outil SCA
         displayName: 'SCA'
   ```

3. **Pipeline CD avec contrôles**
   - Environnement `test` protégé par des approbations ou des checks (par exemple, approbation d’un responsable sécurité).
   - Déploiement vers `test` uniquement à partir de la branche `main` après validation CI.
   - Étapes :
     - Déploiement de l’application.
     - DAST automatisé.
     - Publication du rapport de sécurité.
   - Optionnel : étape de « gates » ou de qualité qui lit les rapports SAST/SCA/DAST et décide de la promotion ou non.

4. **Gestion des secrets et connexions de service**
   - Configuration d’un Key Vault dans Azure contenant secrets (chaînes de connexion, mots de passe, clés API).
   - Connexion de service Azure DevOps liée à ce Key Vault, avec accès minimal.
   - Utilisation de variables de pipeline liées à Key Vault pour injecter les secrets lors du déploiement ou des scans.

---

## Travaux pratiques : gérer la dette technique avec SonarQube et Azure DevOps

SonarQube est un outil largement utilisé pour mesurer la qualité du code et la dette technique, avec une forte dimension sécurité (détection de vulnérabilités et de code smell). Intégré à Azure DevOps, il permet de suivre la qualité sur chaque build et de bloquer les merges non conformes.

Objectifs pédagogiques :
- Installer ou utiliser un serveur SonarQube (ou SonarCloud).
- Connecter Azure DevOps à SonarQube via une extension et un token.
- Intégrer l’analyse dans le pipeline CI.
- Configurer des Quality Gates pour imposer un niveau minimal de qualité/sécurité.

Chemin d’apprentissage :

1. **Configuration de SonarQube / SonarCloud**
   - Création d’un projet Sonar correspondant au dépôt Azure Repos.
   - Génération d’un token pour l’authentification depuis Azure DevOps.
   - Définition des Quality Gates : seuils sur dette technique, couverture de tests, vulnérabilités, bugs.

2. **Intégration dans Azure DevOps**
   - Installation de l’extension SonarQube / SonarCloud dans l’organisation Azure DevOps.
   - Création d’un Service Connection Sonar.
   - Modification du pipeline YAML pour inclure :
     - préparation de l’analyse,
     - exécution de l’analyse,
     - publication du résultat et évaluation de la Quality Gate.

   Exemple (schématique) de pipeline YAML avec SonarQube :

   ```yaml
   trigger:
     branches:
       include:
       - main
       - feature/*

   pool:
     vmImage: 'ubuntu-lest'

   steps:
   - task: SonarQubePrepare@5
     inputs:
       SonarQube: 'SonarQubeServiceConnection'
       scannerMode: 'Other'
       configMode: 'manual'
       projectKey: 'mon-projet'
       projectName: 'Mon Projet'

   - script: |
       echo "Build et tests..."
       # commandes de build et test
     displayName: 'Build et tests'

   - task: SonarQubeAnalyze@5
     displayName: 'Analyse SonarQube'

   - task: SonarQubePublish@5
     inputs:
       pollingTimeoutSec: '300'
     displayName: 'Vérifier la Quality Gate'
   ```

3. **Exploitation de la dette technique**
   - Analyse des rapports SonarQube pour identifier :
     - Vulnérabilités,
     - Bugs,
     - Code smells,
     - Couverture de tests,
     - Duplication de code.
   - Création de work items dans Azure Boards à partir des findings importants (par exemple via intégrations ou manuellement) pour planifier la réduction de dette.
   - Mise en place de règles : pour les nouveaux développements (new code), aucune nouvelle vulnérabilité ou dette au-delà d’un certain seuil n’est tolérée.

---

## Exemple de tableau de synthèse des modules

| Module                                   | Objectif principal                                        | Outils typiques                       | Pratique clé dans Azure DevOps                         |
|------------------------------------------|-----------------------------------------------------------|---------------------------------------|--------------------------------------------------------|
| Introduction à la sécurisation DevOps    | Intégrer sécurité dans tout le cycle DevOps              | Azure DevOps Security, Zero Trust     | Groupes, permissions, pipelines sécurisés              |
| Logiciels libres                         | Gérer licences et risques des composants open source     | Gestion de paquets, SCA               | Politique interne, SBOM, scan de dépendances           |
| Analyse de composition (SCA)            | Inventorier composants et vulnérabilités                 | Outils SCA                            | Tâches de scan dans pipeline, rapport d’artefacts      |
| Analyseurs statiques (SAST)             | Détecter vulnérabilités et mauvais patterns dans le code | Analyseurs de code, SonarQube         | Étapes SAST CI, politiques de branches                 |
| OWASP & analyses dynamiques (DAST)      | Tester l’appli en exécution contre attaques Web          | Scanners DAST, référentiels OWASP     | Scan post-déploiement sur environnement de test        |
| Contrôle sécurité & gouvernance         | Encadrer et auditer sécurité et conformité               | Azure DevOps Security, audit Azure    | Politiques de branches, environnements, audit          |
| TP sécurité & conformité pipeline       | Construire un pipeline CI/CD sécurisé de bout en bout    | Azure Pipelines, Key Vault, SAST/SCA  | Pipeline complet avec gates et rapports                |
| TP dette technique avec SonarQube       | Suivre et réduire la dette technique                     | SonarQube / SonarCloud, Azure Boards  | Quality Gates, backlog de correction de findings       |

---

Pour aller jusqu’au niveau de détail équivalent à une dizaine de pages A4, il est recommandé de reprendre chacun des modules ci-dessus, de le décliner en tutoriels pratiques complets (captures d’écran, scripts détaillés, rapports d’exemples), et de s’appuyer directement sur la documentation officielle Azure DevOps et sur les guides SonarQube/OWASP afin de respecter les droits d’auteur et de disposer d’informations parfaitement à jour.
