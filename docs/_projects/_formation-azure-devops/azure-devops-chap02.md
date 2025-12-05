# Citations
- https://learn.microsoft.com/fr-fr/azure/devops/user-guide/what-is-azure-devops?view=azure-devops
- https://www.datacamp.com/fr/tutorial/azure-devops
- https://www.apog.net/azure-devops-pme-accelerer-developpement-logiciels/
- https://www.varonis.com/fr/blog/presentation-azure-devops
- https://azure.microsoft.com/fr-fr/solutions/devops/tutorial
- https://learn.microsoft.com/fr-fr/devops/develop/how-microsoft-develops-devops
- https://syslearn.fr/devops-nouvelle-culture-dans-les-entreprises/
- https://www.getguru.com/fr/reference/how-to-use-azure-devops-a-comprehensive-guide
- https://learn.microsoft.com/fr-fr/shows/azure-devops-launch-2018/a100


# Tokens
- prompt_tokens: 323
- completion_tokens: 5496
- total_tokens: 5819
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.082, 'request_cost': 0.006, 'total_cost': 0.089}


# Content
Il n’est pas possible, dans ce contexte, d’accéder aux pages demandées, de vérifier l’existence d’images ni d’extraire leur contenu. En revanche, il est possible de proposer une explication détaillée, structurée en chemin d’apprentissage, avec des exemples de scripts et de tableaux, couvrant chacun des points du chapitre 2 « Développement pour le DevOps d’entreprise ». Les captures, schémas et images devront ensuite être récupérés directement depuis la documentation Azure DevOps (par exemple sur learn.microsoft.com) pour respecter les contraintes de vérification et de droits.

---

## Structurer un dépôt Git pour le DevOps d’entreprise

Dans un contexte d’entreprise, la structure du dépôt Git doit faciliter la collaboration, l’industrialisation (CI/CD) et l’évolutivité des équipes et des applications. L’objectif est d’avoir des dépôts lisibles, modulaires, et adaptés au niveau d’indépendance souhaité entre composants.

### Monorepo, multirepo et hybrid-repo

- **Monorepo** : un seul dépôt Git contenant plusieurs services, composants et librairies internes.  
  - Avantages : vision globale, factorisation de code, un seul pipeline global possible, cohérence des versions.  
  - Inconvénients : historique volumineux, règles de protection plus complexes, builds globalement plus lents si mal segmentés.

- **Multirepo** : un dépôt par service, microservice ou domaine fonctionnel.  
  - Avantages : indépendance forte, pipelines ciblés, permissions fines par dépôt.  
  - Inconvénients : duplication possible, gestion des versions inter-dépôts plus complexe, fragmentation de la connaissance.

- **Approche hybride** : par exemple, un monorepo par domaine métier (ou par « bounded context ») avec plusieurs microservices dans chaque dépôt, plus quelques dépôts transverses (librairies, infra-as-code).

### Organisation interne du dépôt

Exemple de structure pour une application d’entreprise composée d’un front web, de plusieurs services et d’infrastructure-as-code :

```text
/ (racine du repo)
├─ docs/
│  ├─ architecture/
│  └─ decisions/          # ADR (Architectural Decision Records)
├─ src/
│  ├─ frontend/
│  │  ├─ app/
│  │  └─ tests/
│  ├─ services/
│  │  ├─ billing-service/
│  │  │  ├─ src/
│  │  │  └─ tests/
│  │  └─ auth-service/
│  │     ├─ src/
│  │     └─ tests/
│  └─ shared/
│     ├─ domain/
│     └─ infrastructure/
├─ infra/
│  ├─ bicep/
│  ├─ terraform/
│  └─ pipelines/
├─ .azure-pipelines/
│  ├─ ci-frontend.yml
│  ├─ ci-billing.yml
│  ├─ cd-prod.yml
│  └─ templates/
├─ .gitignore
└─ README.md
```

Cette structure rend explicites : la séparation code / infra / documentation, la localisation des pipelines, et les dépendances entre services (par exemple via `/src/shared`).

### Chemin d’apprentissage pour structurer un dépôt

1. Comprendre les besoins de l’entreprise : taille des équipes, nombre d’applications, fréquence de déploiement, exigences de sécurité.  
2. Expérimenter sur un projet pilote en choisissant un modèle (mono ou multi-repo) et en définissant un squelette type.  
3. Industrialiser : modèles de dépôt (templates), conventions de nommage, modèles de pipelines YAML, documentation standardisée (README, ADR).  
4. Généraliser progressivement à d’autres projets et harmoniser.

---

## Gérer les branches et les workflows Git

Les branches structurent le flux de développement, les revues de code et les déploiements. Dans Azure Repos, l’enjeu est d’aligner stratégie de branchement et pipeline.

### Stratégies de branchement courantes

- **Trunk-based (branche `main` unique et branches de courte durée)**  
  - Branches : `main` + branches de fonctionnalité courtes (`feature/xyz`), éventuellement `hotfix/*`.  
  - Intérêt : simplicité, intégration continue réelle, peu de branches longues.

- **GitFlow (plus classique, orienté releases)**  
  - Branches longues : `main`, `develop`, `release/*`, `hotfix/*`, `feature/*`.  
  - Intérêt : adapté aux cycles de release plus formels, versionning appuyé.

- **GitHub Flow / Azure DevOps Flow simplifié**  
  - Une branche principale (`main`), fonctionnalités via `feature/*`, mises en prod après validation des PR.

### Exemple de workflow basé sur trunk-based

- `main` : toujours déployable sur production, protégée (PR obligatoires, validation par build).  
- `develop` (optionnel) : environnement d’intégration ou de préproduction.  
- Branches de fonctionnalités : `feature/PROJ-1234-ajout-notifications`.  
- Branches de correctifs : `hotfix/incident-789-prod`.

Tableau de synthèse :

| Type de branche | Durée de vie typique | Cible de merge | Usage principal                              |
|-----------------|----------------------|----------------|---------------------------------------------|
| `main`          | Longue               | N/A            | Production                                  |
| `develop`       | Longue (optionnel)   | `main`         | Intégration / préproduction                 |
| `feature/*`     | Courte               | `develop` ou `main` | Nouvelles fonctionnalités             |
| `hotfix/*`      | Courte               | `main` (+ `develop`) | Correctifs urgents en production     |
| `release/*`     | Moyenne              | `main` + `develop` | Stabilisation d’une version            |

### Exemple de règles dans Azure Repos

- Protection de la branche `main` :
  - Validation par au moins 2 reviewers.
  - Build de validation Azure Pipelines obligatoire (CI).  
  - Interdiction de pousser directement (merge uniquement via PR).  
  - Politique de « rebase and fast-forward » pour garder un historique linéaire.

### Chemin d’apprentissage sur les workflows Git

1. Maîtriser les commandes Git de base : `clone`, `branch`, `checkout`, `commit`, `merge`, `rebase`, `push`, `pull`.  
2. Mettre en place, sur un petit projet, un workflow simple (par exemple trunk-based) avec politiques de branche sur `main`.  
3. Introduire graduellement les branches `release/*` et `hotfix/*` lorsque les cycles de release le justifient.  
4. Documenter la stratégie de branchement et la faire évoluer au rythme de l’organisation.

---

## Collaborer avec les Pull Requests dans Azure Repos

La Pull Request (PR) constitue l’élément central de la revue de code et de la qualité en DevOps d’entreprise. Elle s’intègre à Azure Repos et Azure Pipelines.

### Anatomie d’une Pull Request Azure Repos

Une PR associe :

- La branche source (ex. `feature/PROJ-1234-ajout-notifications`) et la branche cible (`main` ou `develop`).  
- Un titre et une description clairs, souvent liés à un ou plusieurs Work Items (User Stories, Bugs).  
- Des reviewers désignés (obligatoires ou suggérés) et, éventuellement, des « required reviewers » définis par politique.  
- Des validations automatiques : build CI, tests unitaires, analyse de code, règles de sécurité.

Exemple d’éléments recommandés dans la description d’une PR (en pseudo-modèle) :

```text
Titre : PROJ-1234 – Ajout du système de notifications email

Description :
- Ajout d’un service NotificationService pour l’envoi d’emails transactionnels.
- Configuration d’une nouvelle variable de pipeline : NOTIFICATION_API_KEY.
- Ajout de tests unitaires et mise à jour de la documentation.

Tests :
- Tests unitaires : OK (dotnet test).
- Tests d’intégration manuels sur l’environnement de dev.

Impacts :
- Ajout de la dépendance vers le service externe EmailX.
- Changement du schéma de la table Notifications (colonne Status).
```

### Intégration avec Azure Pipelines

Le pipeline de build peut être configuré pour s’exécuter automatiquement sur toute PR ciblant `main` ou `develop`.

Exemple minimal de pipeline YAML de validation de PR (.azure-pipelines/ci-pr.yml) :

```yaml
trigger:
  branches:
    include:
      - main

pr:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: UseDotNet@2
    inputs:
      packageType: 'sdk'
      version: '8.0.x'

  - script: dotnet restore
    displayName: 'Restore'

  - script: dotnet build --no-restore --configuration Release
    displayName: 'Build'

  - script: dotnet test --no-build --configuration Release
    displayName: 'Tests unitaires'
```

### Chemin d’apprentissage sur les Pull Requests

1. Apprendre à créer une PR, à commenter (ligne par ligne et vue globale) et à gérer les discussions.  
2. Configurer des politiques de branche : reviewers obligatoires, build obligatoire, limitation des tailles de PR.  
3. Ajouter progressivement des vérifications automatiques avancées : couverture de tests, analyse statique, scans de sécurité.  
4. Former l’équipe à une culture de revue constructive (commentaires précis, suggestions d’amélioration, adoption de standards).

---

## Explorer les hooks Git

Les hooks Git permettent d’exécuter automatiquement des scripts à certains moments du cycle de vie Git. En DevOps d’entreprise, ils servent à appliquer des conventions, faire des validations préalables et automatiser certaines tâches.

### Types de hooks côté client (local)

- `pre-commit` : exécution avant l’enregistrement du commit (formatage du code, lancement de tests rapides).  
- `commit-msg` : validation du message de commit (ex : vérifier la présence d’un identifiant de ticket).  
- `pre-push` : exécution avant l’envoi d’une branche vers le serveur (par exemple, vérification que les tests unitaires passent).

Exemple de hook `commit-msg` en bash pour imposer un identifiant de ticket (dans `.git/hooks/commit-msg`, exécutable) :

```bash
#!/usr/bin/env bash

COMMIT_MSG_FILE="$1"
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

if ! [[ "$COMMIT_MSG" =~ ^(PROJ|BUG|TASK)-[0-9]+ ]]; then
  echo "Le message de commit doit commencer par un identifiant de ticket, ex : PROJ-1234."
  exit 1
fi

exit 0
```

### Hooks côté serveur (Azure DevOps)

Azure DevOps ne permet pas l’installation directe de hooks Git « classiques » côté serveur, mais offre des **abonnements de service (Service Hooks)** ou des **politiques de branche** qui jouent un rôle similaire :

- Service Hooks pour déclencher des actions (webhooks vers Jenkins, Teams, Slack, etc.) lors de push, création de PR, etc.  
- Politiques pour imposer un build, un scan de sécurité ou un outil d’analyse de code avant le merge.

Exemple d’utilisation typique :

- Lorsqu’une PR est créée ou mise à jour, un Service Hook déclenche un système externe qui exécute des tests de sécurité avancés, puis poste le résultat dans la PR.

### Chemin d’apprentissage sur les hooks

1. Comprendre la différence entre hooks locaux et mécanismes d’automatisation côté serveur.  
2. Mettre en place des hooks locaux légers sur un projet (formatage, vérification des messages de commit).  
3. Introduire des Service Hooks pour intégrer Azure DevOps à d’autres outils (notifications, scanners, outils internes).  
4. Documenter et standardiser les scripts pour éviter des comportements divergents entre développeurs.

---

## Planifier et renforcer la source interne

« Renforcer la source interne » renvoie à l’idée de traiter le code source comme un actif stratégique : planifié, sécurisé, documenté et aligné sur les objectifs de l’entreprise.

### Planification de la source

- Alignement avec le portefeuille de produits : chaque dépôt et chaque module doivent correspondre à un périmètre métier clair.  
- Roadmap technique : gestion de l’évolution des API internes, des dépendances, des versions, et de la migration technologique.  
- Couplage avec la gestion de projet (Azure Boards) : chaque évolution du code est liée à des Work Items (User Stories, Tasks, Bugs, Epics).

Exemple de lien Work Item ↔ Commit / PR :

- Les messages de commit et titres de PR font référence à un identifiant de Work Item (ex : `AB#1234`), ce qui permet de tracer automatiquement les changements.

### Renforcement de la source (qualité, sécurité, gouvernance)

- Qualité :  
  - Conventions de codage partagées, linters et formatters.  
  - Tests unitaires, d’intégration, E2E.  
  - Revue de code systématique via PR.

- Sécurité :  
  - Scans de vulnérabilités des dépendances.  
  - Analyse statique (SAST).  
  - Secrets gérés dans un coffre-fort (Azure Key Vault) et non dans le code ou les pipelines.  
  - Politiques de sécurité sur les branches et les dépôts.

- Gouvernance :  
  - Organisation des permissions par groupe (équipes de dev, Ops, auditeurs).  
  - Règles de rétention pour le code, les artefacts, les logs de builds.  
  - Documentation standardisée et tenue à jour.

### Chemin d’apprentissage sur la planification et le renforcement

1. Cartographier les dépôts existants et leurs périmètres métier.  
2. Définir une politique de qualité (tests, couverture, conventions) minimale à respecter.  
3. Introduire progressivement des outils de sécurité et d’analyse statique dans les pipelines.  
4. Formaliser la gouvernance : charte de développement, règles de PR, gestion des droits, stratégie de documentation.

---

## Gérer les dépôts Git dans Azure DevOps

La gestion des dépôts dans Azure Repos regroupe création, droits d’accès, politiques communes et automatisation des opérations.

### Création, import et structuration

- Création d’un dépôt par projet ou par application selon la stratégie choisie (monorepo/multirepo).  
- Import de projets existants via l’URL Git (`git clone --mirror` puis push vers Azure Repos).  
- Utilisation de **templates de dépôt** (ou de scripts d’initialisation) pour appliquer automatiquement :
  - Arborescence standard (`src`, `infra`, `docs`, `.azure-pipelines`).  
  - Fichiers de base (`README`, `CONTRIBUTING`, `.gitignore`).

### Gestion des permissions et politiques

- Permissions par dépôt :
  - Lecture seule pour certains rôles (auditeurs, parties prenantes non techniques).  
  - Contribution pour les équipes de développement.  
  - Mainteneurs/administrateurs pour les responsables techniques.  

- Politiques :
  - Protection de branches critiques (`main`, `release/*`).  
  - Obligation de PR, build de validation, check de commentaires résolus, interdiction de « force push ».  
  - Limitation des merges « sans fast-forward » pour garder un historique propre.

Tableau de bonnes pratiques :

| Aspect              | Recommandation principale                               |
|---------------------|---------------------------------------------------------|
| Nommage             | Clairs, liés au domaine métier (ex: `billing-service`) |
| Permissions         | Gestion par groupes, pas par utilisateurs individuellement |
| Branches protégées  | PR obligatoires + build CI                             |
| Templates           | Répertoire type, fichiers de base, pipelines type      |

### Automatisation de la gestion des dépôts

- Utilisation d’API ou de CLI (Azure DevOps CLI) pour :
  - Créer ou archiver des dépôts.  
  - Appliquer automatiquement certaines politiques.  
  - Générer des rapports (nombre de PR, activité par dépôt, etc.).

Exemple de script CLI (pseudo-code) pour créer un dépôt :

```bash
az devops configure --defaults organization=https://dev.azure.com/ORG project=ProjetX

az repos create \
  --name "billing-service" \
  --project "ProjetX"
```

### Chemin d’apprentissage sur la gestion des dépôts

1. Prendre en main Azure Repos : création de dépôt, clonage, push/pull.  
2. Expérimenter avec les permissions et les politiques sur un projet pilote.  
3. Industrialiser la création de dépôts via scripts ou modèles, et documenter ces procédures.  
4. Mettre en place une supervision simple (tableaux de bord, rapports d’activité) pour suivre la santé du portefeuille de dépôts.

---

## Déterminer la dette technique

La dette technique correspond à l’écart entre le code actuel et le code idéalement maintenable, sécurisé et performant. En DevOps d’entreprise, sa gestion devient un processus continu et mesurable.

### Types de dette technique

- **Code** : duplication, complexité cyclomatique élevée, manque de tests, architecture peu claire.  
- **Architecture** : dépendances circulaires entre services, absence de limites claires entre domaines, API trop couplées.  
- **Infrastructure** : scripts manuels, absence d’infra-as-code, environnements non reproductibles.  
- **Processus** : pipelines fragiles, absence d’automatisation, revues de code peu utilisées.

### Mesurer la dette technique

- Outils d’analyse de code (SonarQube, etc.) pour obtenir :
  - Complexité par fichier, couverture de tests, taux de duplication, vulnérabilités.  
- Indicateurs de pipeline :
  - Temps moyen de build, fréquence d’échec de builds, durée de tests.  
- Indicateurs opérationnels :
  - Nombre d’incidents, temps moyen de résolution, fréquence de déploiement.  

Exemple de tableau de suivi mensuel simple :

| Domaine        | Indicateur                    | Valeur actuelle | Objectif | Tendance |
|----------------|--------------------------------|-----------------|----------|----------|
| Qualité code   | Couverture de tests (%)       | 45              | 70       | ↑       |
| Qualité code   | Duplication (%)              | 15              | 5        | ↘       |
| Pipelines      | Taux de succès des builds (%) | 82              | 95       | ↗       |
| Sécurité       | Vulnérabilités ouvertes       | 23              | 0        | ↘       |

### Réduire la dette technique dans un flux DevOps

- Intégrer la dette dans le backlog (Work Items dédiés).  
- Allouer systématiquement une part du sprint/iteration à la dette technique.  
- Mettre en place des « gardes-fous » dans les pipelines (règles d’échec si certains seuils sont dépassés).  
- Traiter les causes racines (amélioration de la conception, formation, refactoring progressif).

### Chemin d’apprentissage autour de la dette technique

1. Comprendre la notion de dette technique et ses impacts (coûts, délais, risques).  
2. Installer des outils de mesure et les intégrer aux pipelines.  
3. Construire un tableau de bord simple de dette technique, mis à jour régulièrement.  
4. Apprendre à prioriser la dette en fonction de la valeur métier et du risque, puis installer une discipline de réduction continue.

---

## Travaux pratiques : Contrôle de version avec Git dans Azure Repos

Les travaux pratiques visent à mettre en application les points étudiés : structure de dépôt, stratégies de branches, PR, hooks, qualité du code.

### Objectifs des travaux pratiques

- Initialiser et structurer un dépôt dans Azure Repos.  
- Mettre en place une stratégie de branches simple.  
- Créer des PR avec validation automatique par pipeline.  
- Introduire un hook local simple et/ou des vérifications dans le pipeline.  
- Observer où et comment apparaît la dette technique (au moins conceptuellement).

### Fil conducteur des exercices

1. **Initialisation du dépôt et structure de base**  
   - Créer un dépôt `demo-enterprise-devops`.  
   - Pousser une première structure : `/src`, `/tests`, `/infra`, `/docs`, `.azure-pipelines`.  
   - Ajouter un `README` expliquant le but du dépôt.

2. **Mise en place d’une stratégie de branches**  
   - Créer la branche `main` (protégée) et `develop`.  
   - Configurer une politique : PR obligatoire pour `main`, au moins 1 reviewer, build de validation.

3. **Pipeline de build et validation de PR**  
   - Créer un pipeline CI YAML dans `.azure-pipelines/ci.yml`.  
   - Activer l’exécution sur :
     - Tout commit sur `develop`.  
     - Toute PR vers `main`.  
   - Ajouter des tests unitaires simples (ex. un test trivial dans `/tests`).

4. **Pull Requests et revue de code**  
   - Créer une branche `feature/TP-1-ajout-fonctionnalite`.  
   - Ajouter une petite fonctionnalité (par exemple, une fonction calculant un total avec TVA).  
   - Ouvrir une PR, lier un Work Item, demander une revue, corriger selon commentaires, merger.

5. **Hook Git local et conventions de commit**  
   - Ajouter un hook `commit-msg` pour imposer un préfixe (ex. `TP-1` dans chaque message).  
   - Faire plusieurs commits pour voir le hook en action.

6. **Introduction à la dette technique**  
   - Ajouter volontairement une fonction trop complexe ou du code dupliqué.  
   - Lancer un outil d’analyse (même simple) ou simuler un rapport, et créer un Work Item « Réduire la complexité de X ».  
   - Discuter/consigner comment ce type de dette pourrait être réduit (refactoring, tests, meilleure conception).

---

### Remarque sur les images et schémas

Pour intégrer des images ou schémas :

- Utiliser la documentation officielle Azure DevOps (par exemple les guides d’introduction, les tutoriels sur Azure Repos et Azure Pipelines) en respectant strictement la propriété intellectuelle.  
- Vérifier manuellement l’URL de chaque image et son existence, et ne jamais recopier ni intégrer de contenu protégé sans les autorisations appropriées.  
- Reproduire éventuellement la logique des schémas sous forme de diagrammes personnels (par exemple au format texte ou utilisant un outil interne) sans copier les originaux.
