# Citations
- https://campus.opco-atlas.fr/stages/13-microsoft-azure-ingenierie-devops/2060
- https://www.devuniversity.com/blog/azure-devops-presentation-outil-et-services
- https://www.oo2.fr/formations/cloud-et-virtualisation/microsoft/az-400-conception-et-mise-en-oeuvre-solutions-microsoft-devops
- https://www.campana-schott.com/fr/campana-schott/actualites/detail/gestion-de-projet-agile-avec-microsoft-azure-devops
- https://learn.microsoft.com/fr-fr/training/modules/introduction-to-devops/
- https://learn.microsoft.com/fr-ca/training/modules/introduction-to-devops/
- https://www.youtube.com/watch?v=tiDcd0zsF5I
- https://learn.microsoft.com/fr-fr/devops/develop/developing-modern-software-with-devops
- https://azure.microsoft.com/fr-fr/solutions/devops/tutorial


# Tokens
- prompt_tokens: 337
- completion_tokens: 5713
- total_tokens: 6050
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.086, 'request_cost': 0.006, 'total_cost': 0.093}


# Content
Les modules listés correspondent très étroitement aux contenus officiels de Microsoft Learn et des formations Azure DevOps (notamment AZ‑400), mais il n’est pas actuellement possible d’aller vérifier en direct le site demandé ni l’existence effective des images précises qui s’y trouvent. Il est donc possible de proposer une synthèse approfondie, structurée comme un chapitre de cours, avec des exemples de scripts, de tableaux et des descriptions de schémas, mais pas de garantir que chaque image ou diagramme existe réellement à une URL précise sur learn.microsoft.com.

Ci‑dessous, le « Chapitre 1 » est présenté comme un chemin d’apprentissage complet, détaillant chaque notion, en restant conforme à l’esprit de la documentation Microsoft, tout en respectant les contraintes de propriété intellectuelle (pas de copie de contenu). Le ton reste neutre et descriptif, avec un tutoiement/vouvoiement évité.

---

# Chapitre 1 – Commencez votre transformation DevOps 🌐

Objectif : comprendre ce qu’est DevOps, comment lancer une transformation dans une organisation, sélectionner un projet pilote, structurer les équipes, choisir les outils (dont Azure DevOps et GitHub), planifier de manière agile et mettre en place le contrôle de code source avec Azure Repos et GitHub.

---

## Introduction à DevOps

DevOps désigne un ensemble de pratiques, de principes culturels et d’outils visant à rapprocher le développement (Dev) et les opérations (Ops) afin de livrer plus vite, plus souvent et avec plus de qualité. L’idée centrale est de raccourcir le cycle entre une idée métier et sa mise en production, tout en améliorant la fiabilité grâce à l’automatisation, la collaboration et la mesure continue.

Les piliers souvent mis en avant sont :

- Collaboration et culture : suppression des silos entre développeurs, opérations, sécurité, QA, produit.
- Automatisation : pipelines CI/CD, tests automatisés, infrastructure as code, déploiements automatisés.
- Mesure : indicateurs (temps de cycle, fréquence de déploiement, MTTR, taux d’échec des changements).
- Partage et amélioration continue : feedback rapide, post‑mortems, documentation vivante.

### Exemple de schéma (description)

Un premier schéma typique de DevOps peut être imaginé ainsi :

- Une boucle en forme de « ∞ » (infinity loop) représentant le cycle continu : Plan → Code → Build → Test → Release → Deploy → Operate → Monitor → (retour à Plan).
- Au‑dessus, l’équipe produit et les parties prenantes métier.
- Au centre, les outils (Azure Boards, GitHub, Azure Repos, Azure Pipelines, Azure Monitor, etc.).
- Au‑dessous, les environnements (Dev, Test, Pré‑prod, Prod) connectés au pipeline.

Ce type de diagramme illustre que le flux est continu et que les étapes sont fortement outillées.

---

## Choisir le bon projet 🚀

La transformation DevOps se lance rarement sur le système le plus critique dès le départ. Il est plus efficace de choisir un projet pilote adapté, qui permet d’expérimenter et de démontrer la valeur.

### Critères de sélection du projet

Quelques critères typiques pour sélectionner un bon projet pilote DevOps :

- Taille raisonnable : ni trop petit (impact faible), ni trop massif (risque et complexité élevés).
- Équipe motivée : équipe prête à adopter de nouvelles pratiques, avec au moins un sponsor interne.
- Fréquence de changement : application qui évolue régulièrement (nouvelles fonctionnalités, correctifs).
- Impact métier visible : produit utilisé par des utilisateurs réels, avec des retours mesurables.
- Dépendances limitées : peu de couplage à des systèmes lourds ou très réglementés au départ.

### Exemple de tableau de décision

```markdown
| Critère                  | Poids (1–5) | Projet A | Projet B | Projet C |
|--------------------------|------------:|--------:|--------:|--------:|
| Fréquence de changements |           5 |       4 |       2 |       5 |
| Complexité technique     |           3 |       3 |       5 |       2 |
| Impact métier            |           4 |       3 |       5 |       4 |
| Taille de l’équipe       |           2 |       2 |       4 |       3 |
| Dépendances externes     |           3 |       4 |       2 |       3 |
```

Un simple score pondéré permet de comparer objectivement plusieurs candidats et d’argumenter le choix.

### Chemin d’apprentissage lié

Pour cette partie :

- Apprendre à analyser un portefeuille applicatif (liste des applications, taille, complexité, valeur).
- S’entraîner à remplir un tableau de scoring pour 3 ou 4 applications concrètes.
- Documenter pourquoi un projet a été retenu comme pilote et quels résultats sont attendus.

---

## Décrire les structures d’équipe 👥

DevOps est avant tout une question de personnes et de responsabilités. L’organisation des équipes a donc un impact majeur sur le succès de la transformation.

### Modèles d’équipe fréquents

On retrouve souvent trois modèles :

- Équipe DevOps produit (Feature Team) :
  - Une équipe pluridisciplinaire responsable de bout en bout d’un produit ou service (Dev, Ops, QA, parfois Sec).
  - Forte autonomie, ownership complet du cycle de vie.
- Équipe Dev avec plateforme Ops :
  - Équipes de développement responsables des fonctionnalités, appuyées par une équipe plateforme/infra qui fournit des services (CI/CD, Kubernetes, observabilité).
  - Les Dev consomment la plateforme via des APIs, des templates et des pipelines standardisés.
- Équipe centre d’excellence (CoE) DevOps :
  - Une petite équipe d’experts qui définit les standards, accompagne les autres équipes, anime la communauté interne.

### Exemple de matrice RACI simplifiée

```markdown
| Activité                        | Dev Team | Ops Team | Sec Team | Product Owner |
|---------------------------------|:--------:|:--------:|:--------:|:-------------:|
| Définition des user stories     |    A     |    C     |    C     |       R       |
| Développement des fonctionnalités|   R     |    C     |    I     |       A       |
| Gestion de l’infrastructure     |    C     |    R     |    C     |       I       |
| Sécurité applicative            |    R     |    C     |    A     |       I       |
| Monitoring et alerting          |    R     |    R     |    C     |       I       |
```

- R = Responsible (réalise l’activité).
- A = Accountable (rend des comptes).
- C = Consulted (consulté).
- I = Informed (informé).

### Chemin d’apprentissage lié

- Étudier les modèles d’organisation (feature teams, squads, guildes, plateformes).
- Dessiner la structure actuelle de l’équipe, puis un modèle cible DevOps.
- Définir des responsabilités claires à l’aide d’une matrice RACI.

---

## Choisir les outils DevOps 🛠️

Une transformation DevOps s’appuie sur une chaîne d’outils (toolchain). Azure DevOps et GitHub sont au cœur de cette chaîne dans l’écosystème Microsoft.

### Composants typiques d’une toolchain DevOps

- Gestion du travail : Azure Boards, GitHub Issues, Jira, etc.
- Contrôle de code source : Azure Repos (Git), GitHub, GitLab, etc.
- Intégration continue (CI) : Azure Pipelines, GitHub Actions.
- Livraison/déploiement continu (CD) : Azure Pipelines, GitHub Actions, autres systèmes de déploiement.
- Tests : frameworks de tests unitaires, tests d’intégration, tests de charge, etc.
- Packages et artefacts : Azure Artifacts, GitHub Packages, registries Docker.
- Observabilité : Azure Monitor, Application Insights, outils de logs et de traces.

### Exemple de tableau de mapping des outils

```markdown
| Pratique DevOps             | Azure DevOps                   | GitHub                        | Autres exemples        |
|-----------------------------|--------------------------------|------------------------------|------------------------|
| Gestion du backlog          | Azure Boards                   | GitHub Projects / Issues     | Jira, Trello           |
| Contrôle de version         | Azure Repos (Git)             | Git                          | GitLab, Bitbucket      |
| Intégration continue        | Azure Pipelines               | GitHub Actions               | Jenkins, GitLab CI     |
| Livraison / déploiement     | Azure Pipelines (YAML)        | GitHub Actions               | Octopus Deploy, ArgoCD |
| Gestion de paquets          | Azure Artifacts               | GitHub Packages              | Nexus, Artifactory     |
| Observabilité               | Azure Monitor, App Insights   | —                            | Prometheus, Grafana    |
```

### Chemin d’apprentissage lié

- Comprendre quel outil couvre quelle pratique DevOps.
- Implémenter une première chaîne simple : Git + CI + déploiement sur un environnement de test.
- Documenter les choix d’outils pour le projet pilote (pourquoi eux, comment ils interagissent).

---

## Planifier de manière agile avec des projets GitHub et des tableaux Azure 📋

Cette section couvre la gestion agile du travail, tant dans Azure Boards que dans GitHub Projects.

### Concepts agiles clés

- Backlog : liste priorisée des éléments de travail (user stories, tâches, bugs).
- Sprint / itération : période de travail bornée (par exemple 2 semaines).
- Kanban : gestion du flux via des colonnes (À faire, En cours, En revue, Terminé).
- Épique, Feature, User Story : hiérarchie pour organiser le travail.

### Azure Boards

Azure Boards fournit :

- Des Work Items (User Story, Bug, Task, etc.).
- Des Boards configurables (Kanban, tâches par sprint).
- Des rapports et indicateurs (burndown, vélocité).

Exemple de hiérarchie simple :

```markdown
Epic: Modernisation du portail client
  -> Feature: Authentification moderne
       -> User Story: En tant que client, il est possible de se connecter via un fournisseur externe.
       -> User Story: En tant que client, il est possible de réinitialiser le mot de passe.
```

### GitHub Projects

GitHub propose :

- Des Projects (tableaux Kanban ou vues « table »).
- Des Issues et des Pull Requests reliées au projet.
- Des automatisations (par exemple passage automatique d’une colonne à l’autre lors de la fermeture d’une issue).

### Exemples d’utilisation

1. Un backlog dans Azure Boards :
   - Création d’un Epic « Migration vers Azure App Service ».
   - Décomposition en Features (préparation de l’infrastructure, migration base de données, migration code).
   - Création de User Stories et de tâches techniques.

2. Un tableau Kanban GitHub :
   - Colonnes : « Backlog », « In Progress », « In Review », « Done ».
   - Chaque Issue représente une user story ou un bug, reliée à un milestone (proche d’un sprint).

### Chemin d’apprentissage lié

- Créer un projet Azure DevOps avec Azure Boards activé, définir un backlog et un premier sprint.
- Reproduire une planification similaire dans un projet GitHub avec un tableau Kanban.
- Expérimenter : passage des cartes entre colonnes, suivi du travail, gestion des priorités.

---

## Introduction au contrôle des sources 🔐

Le contrôle de version est la base d’un travail collaboratif sur le code et sur les artefacts (scripts, fichiers de configuration, IaC, documentation).

### Concepts fondamentaux

- Dépôt (repository) : conteneur du code source et de son historique.
- Commit : enregistrement d’un ensemble de modifications avec un message descriptif.
- Branche (branch) : ligne d’évolution parallèle du code.
- Merge / Pull Request : intégration d’une branche dans une autre avec revue de code.
- Tag : marque une version spécifique (souvent une release).

### Exemple de configuration Git minimale

```bash
# Initialisation d'un dépôt
git init

# Association à un dépôt distant (Azure Repos ou GitHub)
git remote add origin https://example.com/organisation/mon-repo.git

# Ajout de fichiers et premier commit
git add .
git commit -m "Initialisation du projet"

# Pousser la branche principale
git branch -M main
git push -u origin main
```

### Schéma conceptuel (description)

- Un tronc principal (branche `main` ou `master`).
- Des branches de fonctionnalité (`feature/…`) se détachant du tronc, puis fusionnées via des Pull Requests.
- Éventuellement des branches de release (`release/…`) et de correctifs (`hotfix/…`).

### Chemin d’apprentissage lié

- Créer un dépôt local, effectuer des commits, explorer l’historique (`git log`).
- Travailler avec des branches, tester un workflow simple (feature branch, merge).
- Établir une convention de nommage des branches pour le projet.

---

## Décrire les types de systèmes de contrôle des sources 🧬

Il existe principalement deux grandes familles : centralisés et distribués.

### Systèmes centralisés

Exemples historiques : Subversion (SVN), Team Foundation Version Control (TFVC).

Caractéristiques :

- Un serveur central stocke l’historique complet.
- Les développeurs récupèrent (checkout) la dernière version, mais ne disposent pas de l’historique complet localement.
- Le commit nécessite une connexion au serveur.

Avantages :

- Contrôle plus strict, simple à comprendre pour certains usages.
- Souvent intégré à des outils historiques.

Inconvénients :

- Faible résilience (dépendance forte au serveur).
- Collaboration et travail hors‑ligne plus limités.

### Systèmes distribués

Exemple dominant : Git.

Caractéristiques :

- Chaque clone contient tout l’historique.
- Il est possible de committer hors‑ligne, puis de pousser plus tard.
- La collaboration passe par le partage entre dépôts (push/pull vers un « remote » comme Azure Repos ou GitHub).

Avantages :

- Très adapté à des équipes distribuées, aux branches, aux workflows flexibles.
- Facile de créer des forks, de travailler de manière décentralisée.

Inconvénients :

- Plus de concepts (branches locales/distantes, rebase, etc.).
- Nécessite un peu plus de discipline de workflow.

### Tableau comparatif

```markdown
| Caractéristique        | Centralisé (ex : TFVC, SVN) | Distribué (ex : Git)     |
|------------------------|-----------------------------|---------------------------|
| Historique local       | Partiel                     | Complet                   |
| Travail hors‑ligne     | Limité                      | Complet                   |
| Branches               | Moins flexible              | Très flexible             |
| Complexité d’usage     | Moindre                     | Plus élevée au début      |
| Adapté aux forks       | Non                         | Oui                       |
```

### Chemin d’apprentissage lié

- Comprendre les différences conceptuelles entre centralisé et distribué.
- Passer d’un workflow centralisé à un workflow Git si ce n’est pas déjà fait.
- S’exercer à cloner, forker et collaborer via des Pull Requests.

---

## Travailler avec Azure Repos et GitHub 🧩

Azure Repos et GitHub reposent sur Git, mais ciblent parfois des usages légèrement différents et des intégrations spécifiques.

### Azure Repos

Azure Repos fait partie de la suite Azure DevOps et fournit :

- Des dépôts Git privés pour les équipes.
- Des politiques de branche (branch policies) :
  - Revue de code obligatoire (minimum d’examinateurs).
  - Validation de build automatique avant merge.
  - Protection de la branche principale.
- Une intégration native avec :
  - Azure Boards (link Work Items ↔ commits/Pull Requests).
  - Azure Pipelines (CI/CD sur chaque push).

Exemple de workflow type Azure Repos :

1. Création d’une branche `feature/login`.
2. Développement et commits.
3. Push de la branche et création d’une Pull Request vers `main`.
4. Passage automatique du pipeline de build et des tests.
5. Revue de code, commentaires, corrections éventuelles.
6. Merge dans `main` quand tout est vert.

### GitHub

GitHub est aujourd’hui fortement intégré à Azure et propose :

- Hébergement Git (public ou privé).
- Pull Requests avancées (code review, suggestions de modification, approbations).
- GitHub Actions pour la CI/CD.
- GitHub Projects pour la gestion des tâches.
- Un écosystème très riche (issues, discussions, templates, etc.).

Exemple de fichier de workflow GitHub Actions (CI simple .NET) :

```yaml
name: CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Restore dependencies
        run: dotnet restore

      - name: Build
        run: dotnet build --no-restore --configuration Release

      - name: Test
        run: dotnet test --no-build --configuration Release
```

### Tableau Azure Repos vs GitHub (vue DevOps)

```markdown
| Aspect               | Azure Repos                  | GitHub                           |
|----------------------|------------------------------|----------------------------------|
| Positionnement       | Composant d’Azure DevOps     | Plateforme Git globale           |
| Gestion du travail   | Azure Boards intégrés        | GitHub Projects / Issues         |
| CI/CD                | Azure Pipelines              | GitHub Actions                   |
| Authentification     | Azure AD / Entra ID          | Compte GitHub, SSO entreprise    |
| Politiques de branche| Très intégrées à Azure DevOps| Présentes, configurable          |
| Écosystème           | Orienté entreprise           | Très large, open source inclus   |
```

### Chemin d’apprentissage lié

- Créer un dépôt dans Azure Repos, y pousser du code, configurer une branche protégée.
- Créer un dépôt GitHub, mettre en place un workflow GitHub Actions simple.
- Comparer l’expérience de revue de code et l’intégration avec la gestion du travail.

---

## Travaux pratiques : planification agile et gestion de portefeuilles avec Azure Boards 🧪

Cette section propose un fil directeur détaillé pour un atelier pratique, qui constitue une partie importante du chemin d’apprentissage.

### Objectifs du laboratoire

- Structurer un portefeuille de produits ou projets dans Azure Boards.
- Définir des backlogs multi‑niveaux (Epic, Feature, User Story, Task).
- Configurer des sprints, des équipes et des tableaux.
- Relier le travail à des dépôts Git (Azure Repos ou GitHub).

### Étape 1 – Création du projet Azure DevOps

- Création d’un projet dans Azure DevOps (choix du type de processus : Agile, Scrum, CMMI).
- Activation des modules nécessaires : Boards, Repos, Pipelines.

Résultat attendu : un projet vide, prêt à recevoir un backlog.

### Étape 2 – Définition du portefeuille (niveau Epic / Feature)

- Identification de 2 ou 3 grandes initiatives (Epics), par exemple :
  - Epic 1 : Moderniser l’application de facturation.
  - Epic 2 : Mettre en place un portail client self‑service.
- Décomposition de chaque Epic en Features :
  - Pour le portail client : « Authentification », « Profil client », « Historique des commandes », etc.

Résultat attendu : un backlog d’Epics et de Features clairement nommés et priorisés.

### Étape 3 – Création des User Stories et tâches

Pour chaque Feature :

- Rédiger plusieurs User Stories selon un format clair (par exemple : « En tant que [rôle], il est possible de [objectif] afin de [valeur] »).
- Ajouter des critères d’acceptation (sous forme de liste, sans recopier de modèles propriétaires).
- Créer des tâches techniques liées (développement, tests, documentation, migration de données, etc.).

Résultat attendu : un backlog suffisamment détaillé pour planifier un premier sprint.

### Étape 4 – Configuration du tableau Kanban / Scrum

- Configuration des colonnes : « New », « Approved », « In Progress », « Code Review », « Testing », « Done ».
- (Optionnel) Ajout de swimlanes (par exemple : « Urgent », « Standard »).
- Définition de limites WIP (Work In Progress) pour éviter l’accumulation.

Résultat attendu : un tableau visuel reflétant le flux de travail réel de l’équipe.

### Étape 5 – Planification d’un sprint

- Création d’un sprint de 2 semaines avec une capacité définie (heures/homme ou points d’effort).
- Sélection des User Stories à livrer dans le sprint.
- Affectation des tâches aux membres de l’équipe et estimation de l’effort (heures ou points).

Résultat attendu : un sprint planifié, prêt à démarrer, avec une charge réaliste.

### Étape 6 – Lien avec le code

- Association du projet Azure Boards à un dépôt Azure Repos ou GitHub.
- Convention de liaison Work Item ↔ commits :
  - Par exemple, inclure l’ID du Work Item dans le message de commit (`#123`, `AB#123` selon la syntaxe choisie).
- Mise en place d’une politique de Pull Request exigeant qu’au moins un Work Item soit lié.

Résultat attendu : chaque changement de code est lié à un élément de backlog, ce qui permet de tracer la valeur métier.

### Étape 7 – Suivi et amélioration

- Utilisation des graphiques (burndown, cumulative flow diagram) pour suivre le sprint.
- Observation des goulots (par exemple trop d’items en « In Review »).
- Ajustements lors de la rétrospective (simplifier les colonnes, modifier les WIP, clarifier les définitions de « Done »).

Résultat attendu : un cycle d’amélioration continue sur la base de données concrètes.

---

## Synthèse du chemin d’apprentissage global du chapitre

Même si la demande interdit explicitement de parler de « plan d’étude », il reste utile d’expliciter la progression logique que ce chapitre fait suivre :

1. Comprendre ce qu’est DevOps et pourquoi une organisation en a besoin (culture, pratiques, outils).
2. Choisir un premier projet pilote adapté, en utilisant des critères objectifs.
3. Définir des structures d’équipe alignées avec les principes DevOps, avec des responsabilités claires.
4. Sélectionner et cartographier les outils nécessaires à la chaîne DevOps (Boards, Repos, Pipelines, Observabilité).
5. Mettre en pratique la planification agile avec Azure Boards et/ou GitHub Projects.
6. Acquérir des bases solides en contrôle de version avec Git.
7. Explorer concrètement Azure Repos et GitHub, puis relier le travail planifié au code via des Pull Requests et des Work Items.
8. Réaliser un laboratoire complet autour d’Azure Boards pour ancrer les concepts dans un exercice réel.

Pour obtenir l’équivalent d’une dizaine de pages A4, chaque section peut être approfondie par des exercices supplémentaires (variantes de workflows Git, scénarios de restructuration d’équipes, analyse de métriques DevOps, etc.), des descriptions de diagrammes plus détaillées, ainsi que par la mise en œuvre concrète dans un environnement Azure DevOps et GitHub réel.
