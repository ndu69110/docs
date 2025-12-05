# Citations
- https://www.winside.fr/blog/introduction-a-la-ci-cd-avec-gitlab-pour-les-developpeurs
- https://about.gitlab.com/fr-fr/blog/getting-started-with-gitlab-understanding-ci-cd/
- https://about.gitlab.com/fr-fr/blog/ultimate-guide-to-ci-cd-fundamentals-to-advanced-implementation/
- https://blog.eleven-labs.com/fr/introduction-gitlab-ci/
- https://blog.stephane-robert.info/docs/pipeline-cicd/gitlab/
- https://www.youtube.com/watch?v=UkUF827CGJY
- https://openclassrooms.com/fr/courses/2035736-mettez-en-place-l-integration-et-la-livraison-continues-avec-la-demarche-devops
- https://documentation.univ-lyon1.fr/gitlab/ci/
- https://about.gitlab.com/fr-fr/blog/basics-of-gitlab-ci-updated/
- https://www.youtube.com/watch?v=017CQCh3ogY


# Tokens
- prompt_tokens: 277
- completion_tokens: 4023
- total_tokens: 4300
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.06, 'request_cost': 0.006, 'total_cost': 0.067}


# Content
# Chapitre 2 : Introduction à Gitlab CI/CD

## Introduction à Gitlab

GitLab est une plateforme DevOps intégrée qui fournit un ensemble complet d'outils pour gérer le cycle de vie du développement logiciel. Contrairement à des solutions fragmentées, GitLab offre une interface unifiée permettant de gérer les dépôts de code, de configurer des pipelines d'intégration et de déploiement continus, et de surveiller les performances des applications dans un seul écosystème[1].

### Qu'est-ce que GitLab CI/CD ?

GitLab CI/CD (Intégration Continue/Livraison Continue) est une solution intégrée dans la plateforme GitLab qui automatise les processus d'intégration continue et de déploiement continu[1]. Cette approche transforme le cycle de développement logiciel en éliminant les tâches manuelles répétitives et en garantissant que chaque modification de code est automatiquement compilée, testée et validée[2].

L'intégration continue (CI) signifie que chaque modification apportée au code est immédiatement intégrée au dépôt principal et soumise à une série de tests automatiques. Cela permet de détecter les bogues et les problèmes d'intégration à un stade précoce du développement, plutôt que de les découvrir tardivement en production[2].

### Les avantages clés de GitLab CI/CD

L'adoption de GitLab CI/CD offre plusieurs avantages majeurs aux équipes de développement :

**Automatisation complète du cycle de développement** : La compilation, les tests et le déploiement peuvent être entièrement orchestrés via le pipeline CI/CD, éliminant ainsi les étapes manuelles sujettes aux erreurs[2].

**Détection précoce des bogues** : Les problèmes sont identifiés et corrigés bien avant d'atteindre l'environnement de production, réduisant les coûts de correction et améliorant la qualité globale du logiciel[2].

**Livraison plus rapide** : En automatisant les processus, les équipes peuvent livrer des logiciels plus fréquemment et plus rapidement, permettant une mise en marché plus agile[2].

**Qualité du code garantie** : GitLab fournit une intégration avec des outils de qualité de code comme Code Climate pour analyser le code et générer des rapports, assurant un codebase sain et maintenable[1].

**Sécurité renforcée** : Les fonctionnalités d'analyse des conteneurs, d'analyse des dépendances et de scanning de sécurité peuvent être configurées pour s'exécuter automatiquement à chaque modification de code[3].

## Débuter avec Gitlab CI/CD

### Architecture et composants principaux

Avant de mettre en place une pipeline CI/CD, il est essentiel de comprendre les composants clés qui forment l'architecture de GitLab CI/CD[2].

**GitLab Runner** : Cet agent exécute les jobs CI/CD sur l'infrastructure de choix. Les runners peuvent fonctionner sur des machines physiques, des machines virtuelles, des conteneurs Docker ou des clusters Kubernetes. GitLab fournit par défaut des runners partagés qui peuvent être utilisés immédiatement sans configuration supplémentaire[1][2].

**Étapes (Stages)** : Elles définissent l'ordre d'exécution logique des jobs au sein du pipeline. Par exemple, un pipeline typique peut contenir les étapes suivantes : build, test, et deploy. Ces étapes s'exécutent dans l'ordre spécifié, et l'étape suivante commence seulement une fois que tous les jobs de l'étape précédente sont terminés[2].

**Jobs** : Chaque job représente une unité de travail spécifique exécutée lors de l'étape correspondante. Un job peut compiler du code, exécuter des tests, déployer dans un environnement de préproduction, ou effectuer n'importe quelle autre tâche automatisable[2].

### Le fichier `.gitlab-ci.yml`

Le cœur de la configuration CI/CD dans GitLab est le fichier `.gitlab-ci.yml`, qui doit être placé à la racine du projet[1][3]. Ce fichier YAML définit la structure complète du pipeline, les étapes, les jobs et les actions à automatiser.

GitLab détecte automatiquement ce fichier et commence à exécuter le pipeline à chaque fois que des modifications sont transmises via un push vers le dépôt[3]. Le fichier `.gitlab-ci.yml` offre une flexibilité et une personnalisation élevées, permettant de définir exactement ce qui doit être exécuté et comment[1].

### Le modèle de livraison continue

Pour bien comprendre le cycle CI/CD, il est important de distinguer trois concepts :

**Intégration Continue (CI)** : Le code est automatiquement compilé et testé à chaque modification. Cela signifie que les changements sont validés immédiatement après leur soumission[2].

**Livraison Continue (CD)** : Cette approche complète l'intégration continue en automatisant le pipeline pour la sortie de nouvelles versions. À tout moment, l'application reste déployable vers un environnement donné (par exemple, préproduction, production), en un seul clic ou par le biais d'un déclenchement automatique[2].

**Déploiement Continu** : Cet niveau pousse encore plus loin la logique d'automatisation. Chaque compilation réussie est directement mise en production, sans validation manuelle. Ce niveau d'automatisation requiert une confiance totale dans les tests automatisés et les processus de déploiement[2].

## Premier pipeline

### Configuration de base

La création d'une première pipeline CI/CD avec GitLab commence par l'ajout du fichier `.gitlab-ci.yml` à la racine du projet. Ce fichier définit les étapes de base et les jobs[3].

Voici un exemple élémentaire de pipeline :

```yaml
stages:
  - build
  - test
  - deploy

build_job:
  stage: build
  script:
    - echo "Building the application..."

test_job:
  stage: test
  script:
    - echo "Running tests..."

deploy_job:
  stage: deploy
  script:
    - echo "Deploying to production..."
  environment:
    name: production
```

Cette configuration définit trois étapes clés : compilation, test et déploiement[2]. Chaque étape contient un job qui exécute un script simple. L'élément `stages` énumère l'ordre d'exécution des étapes, tandis que chaque job définit le travail à effectuer dans l'étape correspondante.

Le mot-clé `script` contient les commandes shell à exécuter. L'élément `environment` permet de définir l'environnement de destination pour le déploiement[2].

### Étapes prédéfinies

GitLab propose deux stages prédéfinis qui sont toujours lancés automatiquement[5] :

- `.pre` : S'exécute au début du pipeline, avant tous les autres stages
- `.post` : S'exécute à la fin du pipeline, après tous les autres stages

Ces stages peuvent être utilisés pour des tâches de préparation ou de nettoyage globales sans modifier la structure principale du pipeline.

### Déclenchement automatique

Une fonctionnalité fondamentale de GitLab CI/CD est le déclenchement automatique des pipelines[1]. À chaque push ou merge request, le pipeline est automatiquement lancé, garantissant que chaque modification est testée et validée avant d'être fusionnée dans la branche principale.

Cette automatisation élimine le risque oubli d'exécuter manuellement les tests, assurant une cohérence et une fiabilité accrues dans le processus de développement.

## Onglets Code et Build

### Navigation dans l'interface GitLab

Une fois le fichier `.gitlab-ci.yml` commité et pushé, GitLab commence automatiquement à exécuter le pipeline[3]. Les résultats peuvent être suivis via l'interface web de GitLab.

### Onglet Build (CI/CD)

L'onglet CI/CD dans GitLab permet de suivre l'exécution du pipeline en temps réel[5]. Cet onglet fournit une vue détaillée de chaque étape et de chaque job du pipeline.

**Visualisation des étapes** : Chaque étape du pipeline est affichée horizontalement, montrant son statut actuel (en cours, réussi, échoué). Les jobs contenus dans chaque étape sont visibles individuellement.

**Détails des jobs** : En cliquant sur un job, les utilisateurs peuvent voir les détails complets de son exécution, y compris les logs en temps réel de la sortie du script. Ces logs sont essentiels pour diagnostiquer les problèmes ou comprendre le flux d'exécution[5].

**Runners utilisés** : GitLab affiche le runner Docker utilisé pour exécuter les jobs. Par défaut, `gitlab.com` utilise un runner Docker avec une image prédéfinie. Dans l'exemple suivant, le runner utilise l'image `ruby:2.5` pour exécuter un job Ruby[5].

### Onglet Code

L'onglet Code fournit une vue sur la structure du dépôt, permettant de visualiser et d'accéder aux fichiers du projet[2]. C'est ici que le fichier `.gitlab-ci.yml` doit être placé et commité pour que GitLab détecte et exécute la pipeline.

## Plus de détails sur les pipelines

### Structure avancée des pipelines

Au-delà de la configuration de base, GitLab CI/CD offre des capacités avancées pour structurer et optimiser les pipelines[3].

#### Compilation d'une application Node.js

Un exemple concret d'une pipeline plus sophistiquée pourrait être la compilation et le déploiement d'une application Node.js :

```yaml
stages:
  - build
  - test
  - deploy

build_job:
  stage: build
  image: node:14
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

test_job:
  stage: test
  image: node:14
  script:
    - npm install
    - npm test
  coverage: '/Coverage: \d+\.\d+%/'

deploy_job:
  stage: deploy
  image: ruby:latest
  script:
    - apt-get update && apt-get install -y dpl
    - dpl --provider=heroku --app=$HEROKU_APP --api-key=$HEROKU_API_KEY
  environment:
    name: production
    url: https://my-app.herokuapp.com
  only:
    - main
```

Cette pipeline illustre plusieurs concepts avancés[2] :

- **Images Docker** : Chaque job peut utiliser une image Docker différente adaptée à ses besoins
- **Artefacts** : Les fichiers de sortie (comme `dist/`) peuvent être conservés et transmis aux jobs suivants
- **Variables d'environnement** : Des variables sensibles comme `$HEROKU_API_KEY` sont stockées de manière sécurisée
- **Conditions d'exécution** : Le job de déploiement s'exécute uniquement sur la branche `main`
- **Couverture de code** : Les métriques de couverture peuvent être extraites des logs

#### Déploiement vers plusieurs environnements

Une capacité essentielle des pipelines modernes est la gestion des déploiements vers différents environnements[2]. GitLab propose des fonctionnalités natives pour gérer cela :

```yaml
stages:
  - build
  - test
  - deploy_staging
  - deploy_production

build_job:
  stage: build
  script:
    - echo "Building application..."

test_job:
  stage: test
  script:
    - echo "Running tests..."

deploy_staging:
  stage: deploy_staging
  script:
    - echo "Deploying to staging environment..."
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_production:
  stage: deploy_production
  script:
    - echo "Deploying to production..."
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main
```

Dans cet exemple, la configuration diffère selon l'environnement[2] :

- **Staging** : Le déploiement s'effectue automatiquement sur la branche `develop`
- **Production** : Le déploiement requiert une approbation manuelle (`when: manual`) pour éviter tout déploiement accidentel, et n'est disponible que sur la branche `main`

### Gestion des runners

GitLab fournit des runners partagés par défaut qui peuvent être utilisés immédiatement sans configuration supplémentaire[1]. Ces runners sont préconfigurés pour exécuter les jobs CI/CD. Cependant, si des besoins spécifiques existent, il est possible de configurer des runners personnalisés pour un contrôle plus granulaire[1].

GitLab Runner, un projet open source écrit en Go, fonctionne sur des machines physiques, virtuelles ou dans des conteneurs pour exécuter les jobs définis dans le fichier `.gitlab-ci.yml`[4].

### Réutilisation et optimisation des pipelines

GitLab révolutionne la gestion des pipelines CI/CD en introduisant deux innovations majeures[3] :

**Le catalogue CI/CD** : Une plateforme centralisée où les équipes peuvent découvrir, réutiliser et optimiser les différents composants CI/CD. Cela évite la duplication de code et standardise les bonnes pratiques au sein de l'organisation[3].

**CI/CD Steps** : Un nouveau langage de programmation expérimental dédié à l'automatisation DevSecOps, permettant une personnalisation encore plus poussée des pipelines[3].

### Sécurité dans les pipelines

La sécurité est intégrée dans la pipeline CI/CD dès le départ. Le fichier `.gitlab-ci.yml` peut être configuré pour déclencher automatiquement des scans de sécurité à plusieurs étapes[3] :

- Validation initiale du code
- Analyse des conteneurs
- Analyse des dépendances
- Scanning de sécurité dynamique et statique (SAST)

Ces fonctionnalités s'exécutent automatiquement à chaque modification de code pour rechercher les vulnérabilités, les violations des exigences de conformité et les erreurs de configuration de sécurité[3].

### Variables d'environnement et secrets

Les variables d'environnement jouent un rôle crucial dans les pipelines[2]. Elles permettent de stocker des informations sensibles (identifiants de connexion, clés d'API, tokens) et de les utiliser en toute sécurité dans les processus CI/CD sans les exposer dans le code source.

### Logs et débogage

La visualisation des logs de pipeline est essentielle pour comprendre les défaillances ou le comportement des jobs. Chaque job génère des logs détaillés que les développeurs peuvent consulter pour diagnostiquer les problèmes. Ces logs affichent la sortie complète des scripts exécutés, permettant une analyse approfondie des erreurs[5].

### Conditions d'exécution avancées

GitLab permet de définir des conditions complexes pour contrôler quand les jobs s'exécutent[2] :

- **only** : Le job n'exécute que si certaines conditions sont remplies (branches, tags, événements)
- **except** : Le job s'exécute sauf si certaines conditions sont remplies
- **when** : Permet de spécifier si le job s'exécute automatiquement ou manuellement
- **rules** : Un système plus puissant et flexible pour contrôler l'exécution des jobs

### Artefacts et dépendances

Les artefacts permettent de conserver les fichiers générés lors de l'exécution d'un job et de les transmettre aux jobs suivants[2]. Cela est essentiel pour les pipelines multi-étapes où le résultat d'une étape est nécessaire pour la suivante. Par exemple, une phase de build génère des binaires qui doivent être testés dans la phase de test.

### Métriques de qualité et rapports

GitLab intègre nativement la génération de rapports sur la qualité du code, la couverture des tests, les performances et la sécurité. Ces métriques peuvent être extraites automatiquement des logs ou générés explicitement par des outils spécialisés, fournissant une visibilité complète sur la santé du projet.

### Intégration avec d'autres outils

GitLab CI/CD peut être intégré avec d'autres outils populaires du DevOps comme Code Climate pour l'analyse de qualité, des services de déploiement comme Heroku, ou des systèmes de notification pour alerter les développeurs des défaillances de pipeline.

---

Ce chapitre constitue une fondation solide pour comprendre GitLab CI/CD. Le cheminement d'apprentissage commence par la compréhension des concepts fondamentaux de l'intégration et de la livraison continues, puis progresse vers la configuration pratique d'une première pipeline simple. Les utilisateurs acquièrent ensuite la capacité à lire et interpréter l'interface de GitLab, avant de se familiariser avec des configurations plus complexes incluant plusieurs environnements, des scans de sécurité et des optimisations avancées. Cette progression logique permet une montée en compétence graduelle et une maîtrise progressive de GitLab CI/CD.
