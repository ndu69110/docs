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
- prompt_tokens: 284
- completion_tokens: 5771
- total_tokens: 6055
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.087, 'request_cost': 0.006, 'total_cost': 0.093}


# Content
# 📚 Chapitre 1 : Introduction au CI/CD

## A l'abordage ! 🚀

GitLab CI/CD représente une révolution dans les pratiques de développement logiciel moderne. Cette plateforme intégrée automatise entièrement le cycle de développement, de la compilation du code jusqu'au déploiement en production. L'adoption de CI/CD ne constitue plus une option mais une nécessité pour les équipes de développement contemporaines qui souhaitent livrer des logiciels de qualité à un rythme rapide et soutenu.[1][2]

Le cœur de cette automatisation repose sur un processus simple mais puissant : chaque modification de code déclenchée par un développeur initie automatiquement une séquence d'étapes prédéfinies. Ces étapes englobent la compilation du code source, l'exécution des tests automatisés, l'analyse de la qualité du code, et finalement le déploiement vers l'environnement cible.[1][2] Cette chaîne d'automatisation garantit que seul du code validé et testé atteint les utilisateurs finaux.

GitLab propose une solution CI/CD intégrée directement dans sa plateforme DevOps, éliminant le besoin d'outils externes fragmentés. Les développeurs bénéficient d'une interface unifiée pour gérer leurs dépôts de code, configurer les pipelines, surveiller les performances et analyser les résultats, tout au sein d'un seul et même écosystème.[1]

---

## Introduction au DevOps 🔧

### Fondamentaux du DevOps

DevOps représente une philosophie et un ensemble de pratiques qui fusionnent le développement logiciel (Dev) et les opérations informatiques (Ops). Cette approche vise à raccourcir le cycle de vie du développement et à améliorer la qualité et la fiabilité des applications en production.

Historiquement, les équipes de développement et d'opérations fonctionnaient de manière isolée. Les développeurs créaient du code, puis le transmettaient aux opérations qui s'occupaient du déploiement et de la maintenance. Cette séparation engendrait des frictions, des malentendus et des délais considérables entre la création du code et sa mise en production.

### Les piliers du DevOps

Le DevOps repose sur plusieurs piliers fondamentaux :

**Automatisation** : Chaque tâche répétitive du cycle de vie logiciel (compilation, tests, déploiement) est automatisée afin d'éliminer les erreurs manuelles et d'accélérer les processus.[2]

**Intégration continue** : Les développeurs intègrent leur code dans un dépôt central plusieurs fois par jour. Chaque intégration déclenche automatiquement une série de vérifications et de tests.

**Livraison continue** : Les applications demeurent constamment dans un état déployable. L'infrastructure et les processus permettent de déployer vers un environnement quelconque (préproduction, production) en un seul clic ou automatiquement.

**Déploiement continu** : Chaque compilation réussie est automatiquement poussée en production sans intervention manuelle, nécessitant une confiance absolue dans les tests automatisés.[2]

**Collaboration** : Les barrières entre les équipes se dissolvent. Développeurs et opérations travaillent ensemble vers des objectifs communs.

**Monitoring et feedback** : Les applications en production sont constamment surveillées. Les métriques et les alertes permettent une détection rapide des problèmes et une réaction immédiate.

### Avantages du DevOps

L'adoption de pratiques DevOps apporte des bénéfices tangibles :

- **Déploiements plus rapides** : Les cycles de libération passent de mois à jours ou heures
- **Amélioration de la stabilité** : Les tests automatisés et les vérifications continues réduisent les défauts
- **Réduction du temps d'arrêt** : Les problèmes sont détectés et corrigés rapidement
- **Meilleure collaboration** : Les équipes travaillent ensemble plutôt que de se bloquer mutuellement
- **Amélioration continue** : Les métriques et le feedback permettent une optimisation constante

---

## Qu'est-ce que l'intégration et la livraison continues ? 🔄

### Définition de l'intégration continue (CI)

L'intégration continue consiste à automatiser la compilation et les tests du code à chaque modification.[1][2] Dès qu'un développeur pousse ses modifications vers le dépôt central (via un commit), une série de vérifications s'amorce automatiquement.

Le processus d'intégration continue fonctionne selon ce flux :

1. Un développeur fait un commit et pousse le code vers le dépôt
2. GitLab détecte cette modification
3. Un pipeline CI se déclenche automatiquement
4. Le code est compilé
5. Des tests automatisés s'exécutent
6. Des analyses de qualité et de sécurité sont conduites
7. Les résultats sont communiqués au développeur

Cette approche présente plusieurs avantages cruciaux. Premièrement, elle **détecte les bogues à un stade précoce**, bien avant qu'ils n'atteignent l'environnement de production.[2] Un problème identifié dès la phase de compilation est bien moins coûteux à corriger qu'un bug découvert après le déploiement.

Deuxièmement, l'intégration continue **force les développeurs à intégrer leur code fréquemment**, réduisant ainsi la complexité des fusions (merges) ultérieures et minimisant les conflits de code.

Troisièmement, elle **garantit la maintenabilité du codebase**. Un code continuellement testé et vérifié reste propre, lisible et facile à maintenir.[1]

### Définition de la livraison continue (CD)

La livraison continue complète l'intégration continue en automatisant le pipeline jusqu'au déploiement.[2] Elle représente une extension naturelle de la CI.

Avec la livraison continue, dès que le code passe tous les tests et les vérifications d'intégration continue, il est automatiquement préparé pour être déployé. L'application demeure constamment dans un état déployable. Un administrateur ou un responsable peut déployer vers un environnement cible (préproduction, production) en un seul clic ou via un déclenchement manuel.

La livraison continue ne pousse pas automatiquement les modifications en production. Elle les prépare et les rend disponibles, mais c'est un humain qui décide du moment du déploiement réel. Cette distinction est cruciale pour les environnements sensibles où des déploiements non contrôlés pourraient causer des interruptions de service.

### Différenciation : Livraison continue vs Déploiement continu

Il existe une distinction importante entre la livraison continue (CD) et le déploiement continu.

**Livraison continue** : L'application est constamment prête à être déployée, mais le déploiement en production nécessite une approbation manuelle.[2]

**Déploiement continu** : Pousse la logique d'automatisation encore plus loin. Chaque compilation réussie est directement mise en production sans validation manuelle. Ce niveau d'automatisation requiert une confiance totale dans les tests automatisés et les processus de déploiement.[2]

### Bénéfices concrets du CI/CD

L'implémentation de CI/CD offre des avantages tangibles :

**Détection précoce des défauts** : Les problèmes sont identifiés et corrigés bien avant d'atteindre l'environnement de production.[2]

**Automatisation complète** : Compilation, tests et déploiement sont orchestrés sans intervention manuelle.[2]

**Livraison plus rapide** : Les logiciels sont livrés plus rapidement et plus fréquemment, permettant une réactivité accrue aux besoins des utilisateurs.[2]

**Réduction des risques** : Les processus standardisés et testés réduisent les erreurs humaines et les déploiements non contrôlés.

**Feedback immédiat** : Les développeurs reçoivent un retour immédiat sur la qualité de leur code.

### Cycle de développement transformé

Le cycle de développement logiciel se transforme complètement avec CI/CD. Imaginez un cycle dans lequel chaque modification de code est automatiquement compilée, testée, puis préparée pour le déploiement.[2] Cette vision, autrefois utopique, devient réalité avec les outils appropriés.

---

## Le langage YAML 📝

### Qu'est-ce que YAML ?

YAML signifie "YAML Ain't Markup Language". Il s'agit d'un langage de sérialisation de données conçu pour être lisible par les humains. YAML utilise une syntaxe basée sur l'indentation et des structures simples pour représenter des données complexes.

Contrairement à JSON ou XML, YAML privilégie la lisibilité. Le code YAML ressemble presque à du texte naturel, ce qui le rend accessible même aux personnes n'ayant pas d'expérience en programmation.

### Syntaxe fondamentale de YAML

#### Structures de base

YAML fonctionne autour de trois structures principales : les clés-valeurs, les listes et les commentaires.

**Clés-valeurs** :

```yaml
nom: Jean
age: 30
ville: Paris
```

Les clés et les valeurs sont séparées par deux points. Chaque paire clé-valeur est sur sa propre ligne. L'indentation définit la hiérarchie.

**Imbrication d'objets** :

```yaml
personne:
  nom: Marie
  age: 28
  adresse:
    rue: Rue de la Paix
    ville: Lyon
    codepostal: 69000
```

Les objets imbriqués sont indentés de 2 espaces supplémentaires. Cette imbrication crée une structure hiérarchique.

**Listes** :

```yaml
fruits:
  - pomme
  - banane
  - orange
  - raisin
```

Les listes sont définies avec un trait d'union suivi d'un espace. Chaque élément de la liste est sur sa propre ligne avec la même indentation.

**Listes de dictionnaires** :

```yaml
employes:
  - nom: Alice
    poste: Développeur
    salaire: 45000
  - nom: Bob
    poste: Manager
    salaire: 55000
  - nom: Charlie
    poste: Testeur
    salaire: 40000
```

Cette structure combine listes et dictionnaires, utile pour représenter des collections d'objets complexes.

#### Types de données

YAML supporte plusieurs types de données :

**Chaînes de caractères** :

```yaml
description: "Ceci est une chaîne de caractères"
autre_description: Ceci aussi est une chaîne
multi_ligne: |
  Ceci est une chaîne
  sur plusieurs lignes
  maintenant
```

Les chaînes peuvent être entre guillemets ou sans. Le caractère `|` permet les chaînes multi-lignes.

**Nombres** :

```yaml
entier: 42
decimal: 3.14
notation_scientifique: 1.23e-4
```

**Booléens** :

```yaml
actif: true
termine: false
option1: yes
option2: no
```

Les booléens acceptent plusieurs représentations : `true`/`false`, `yes`/`no`, `on`/`off`.

**Valeurs nulles** :

```yaml
valeur_nulle: null
autre_vide: ~
```

**Commentaires** :

```yaml
# Ceci est un commentaire
nom: Jean  # Commentaire en fin de ligne
# age: 30  # Cette ligne est commentée
```

Les commentaires commencent par le caractère `#`.

### Contexte GitLab CI/CD

Dans GitLab CI/CD, YAML est le langage de configuration exclusif. Le fichier `.gitlab-ci.yml` à la racine du projet définit entièrement le comportement du pipeline.[1][2][3][4]

Ce fichier YAML décrit :

- Les étapes du pipeline (stages)
- Les jobs associés à chaque étape
- Les scripts à exécuter pour chaque job
- Les runners à utiliser
- Les variables d'environnement
- Les conditions d'exécution
- Les artefacts à générer
- Les dépendances entre jobs

### Exemple de fichier `.gitlab-ci.yml` simple

```yaml
stages:
  - build
  - test
  - deploy

build_job:
  stage: build
  script:
    - echo "Compilation de l'application..."
    - npm install

test_job:
  stage: test
  script:
    - echo "Exécution des tests..."
    - npm test

deploy_job:
  stage: deploy
  script:
    - echo "Déploiement en production..."
    - npm run deploy
  environment:
    name: production
```

Cette configuration illustre les concepts clés :

- **stages** : Les trois étapes du pipeline (build, test, deploy)
- **build_job, test_job, deploy_job** : Les trois jobs, chacun assigné à une étape
- **script** : Les commandes à exécuter pour chaque job
- **environment** : La configuration de l'environnement de déploiement

### Pourquoi YAML pour GitLab CI/CD ?

YAML a été choisi pour GitLab CI/CD pour plusieurs raisons :

**Simplicité** : La syntaxe YAML est intuitive et ne nécessite pas de connaissances approfondies en programmation.[4]

**Lisibilité** : Un fichier `.gitlab-ci.yml` bien structuré se lit comme de la documentation.[4]

**Flexibilité** : YAML permet d'exprimer des configurations complexes tout en restant accessible.

**Standardisation** : YAML est devenu le standard pour de nombreux outils DevOps (Docker Compose, Kubernetes, Ansible, etc.), facilitant la cohérence entre les outils.

---

## Mise en place de l'environnement ⚙️

### Architecture globale de GitLab CI/CD

Avant de configurer l'environnement, il est essentiel de comprendre l'architecture sous-jacente de GitLab CI/CD.

L'architecture repose sur plusieurs composants interconnectés :

**GitLab Server** : Le serveur central hébergeant les dépôts Git, les configurations de pipeline et les historiques d'exécution.

**GitLab Runner** : Un agent chargé d'exécuter les jobs définis dans le pipeline.[2][4] Les runners peuvent être installés sur n'importe quelle infrastructure (machines physiques, machines virtuelles, conteneurs Docker, clusters Kubernetes).

**Pipeline** : L'ensemble des étapes et des jobs configurés pour transformer le code source en application déployée.

**Jobs** : Les unités individuelles de travail exécutées lors d'une étape donnée (par exemple, compiler du code, exécuter des tests ou déployer dans un environnement).[2]

**Étapes (Stages)** : Elles définissent l'ordre d'exécution des jobs.[2] Les jobs d'une même étape s'exécutent en parallèle, tandis que les étapes s'exécutent séquentiellement.

### Conditions préalables

Pour mettre en place GitLab CI/CD, certaines conditions doivent être remplies :

**Accès à GitLab** : Un compte GitLab actif avec au moins un projet créé.

**Dépôt Git** : Un dépôt git configuré et synchronisé avec GitLab.

**Permissions** : Les droits d'écriture sur le projet pour créer et modifier le fichier `.gitlab-ci.yml`.

**Runners disponibles** : GitLab fournit des runners partagés par défaut accessibles immédiatement sans configuration supplémentaire.[1] Ces runners sont préconfigurés pour exécuter les jobs CI/CD.

### Création du fichier `.gitlab-ci.yml`

La première étape consiste à créer le fichier `.gitlab-ci.yml` à la racine du projet.[1][3][8]

Pour créer ce fichier :

1. Se connecter à GitLab et accéder au projet
2. Cliquer sur le bouton "+" pour ajouter un nouveau fichier
3. Nommer le fichier `.gitlab-ci.yml`
4. Ajouter le contenu YAML du pipeline
5. Valider la création du fichier

Alternativement, en ligne de commande :

```bash
cd /chemin/vers/projet
cat > .gitlab-ci.yml << 'EOF'
stages:
  - build
  - test
  - deploy

build_job:
  stage: build
  script:
    - echo "Compilation..."
EOF
git add .gitlab-ci.yml
git commit -m "Ajout de la configuration CI/CD"
git push origin main
```

Une fois le fichier commité et poussé, GitLab détecte automatiquement ce fichier et commence à exécuter le pipeline à chaque modification ultérieure.[3]

### Configuration des runners

GitLab propose deux approches concernant les runners :

**Runners partagés** : GitLab fournit des runners partagés par défaut. Ces runners sont maintenu par GitLab et accessibles sans configuration. Ils conviennent pour la majorité des projets.[1]

**Runners personnalisés** : Pour des besoins spécifiques (infrastructure propriétaire, environnements isolés, outils spécialisés), des runners personnalisés peuvent être configurés.[1]

### Pipeline basique

Un pipeline basique typique se structure comme suit :

```yaml
stages:
  - Compilation
  - Test
  - Déploiement

job_compilation:
  stage: Compilation
  script:
    - echo "Compilation du code..."
    - # Commandes de compilation spécifiques

job_test_unitaires:
  stage: Test
  script:
    - echo "Exécution des tests unitaires..."
    - # Commandes de test

job_test_integration:
  stage: Test
  script:
    - echo "Exécution des tests d'intégration..."
    - # Commandes de test d'intégration

job_deploiement:
  stage: Déploiement
  script:
    - echo "Déploiement en production..."
    - # Commandes de déploiement
```

Cette structure comprend :

- Une étape de compilation où le code source est compilé et des artefacts sont générés
- Une étape de test où les tests unitaires et d'intégration s'exécutent
- Une étape de déploiement où l'application est déployée

### Suivi de l'exécution des pipelines

Une fois le fichier `.gitlab-ci.yml` créé et le code poussé, le pipeline s'exécute automatiquement.[5] Pour suivre son exécution :

1. Accéder à la page du projet GitLab
2. Cliquer sur "CI/CD" dans le menu latéral
3. Sélectionner "Pipelines" pour voir la liste des exécutions
4. Cliquer sur une exécution pour voir les détails
5. Consulter les logs de chaque job pour diagnostiquer les problèmes

### Variables d'environnement

GitLab CI/CD supporte les variables d'environnement, essentielles pour gérer les informations sensibles et les configurations spécifiques à chaque environnement.

```yaml
variables:
  NODE_ENV: "production"
  LOG_LEVEL: "debug"
  DATABASE_URL: $DATABASE_URL  # Variable protégée définie dans les paramètres du projet

build_job:
  stage: build
  script:
    - echo "Environnement: $NODE_ENV"
    - echo "Niveau de log: $LOG_LEVEL"
```

Les variables définies au niveau du projet (via les paramètres GitLab) sont injectées automatiquement dans les jobs. Cela permet de stocker des informations sensibles (identifiants, tokens API) de manière sécurisée sans les inclure dans le code.[2]

### Exemple pratique pour une application Node.js

Voici un exemple concret de pipeline pour une application Node.js :

```yaml
image: node:16

stages:
  - build
  - test
  - deploy

variables:
  NPM_REGISTRY: "https://registry.npmjs.org"

build_job:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

test_job:
  stage: test
  script:
    - npm install
    - npm test
  coverage: '/Coverage: \d+\.\d+%/'

deploy_job:
  stage: deploy
  script:
    - npm install --production
    - npm start
  environment:
    name: production
    url: https://monapp.com
  only:
    - main
```

Ce pipeline :

- Utilise l'image Docker `node:16` pour tous les jobs
- Compile l'application et génère des artefacts dans l'étape build
- Exécute les tests dans l'étape test
- Déploie en production dans l'étape deploy, uniquement si la branche est `main`

### Artefacts et dépendances

Les artefacts permettent de transmettre des fichiers entre les jobs d'un pipeline.[1]

```yaml
build_job:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day

test_job:
  stage: test
  dependencies:
    - build_job
  script:
    - npm test
```

Le job `build_job` génère des artefacts dans le répertoire `dist/`. Le job `test_job` déclare une dépendance envers `build_job`, ce qui signifie que les artefacts seront automatiquement téléchargés avant l'exécution des tests.

### Étapes prédéfinies

GitLab CI/CD fournit deux étapes prédéfinies spéciales :[5]

**.pre** : Cette étape s'exécute toujours au début du pipeline, avant toutes les autres étapes. Utile pour des vérifications préalables ou de l'initialisation.

**.post** : Cette étape s'exécute toujours à la fin du pipeline, après toutes les autres étapes, même en cas d'erreur. Utile pour du nettoyage ou des notifications.

```yaml
.pre:
  stage: .pre
  script:
    - echo "Initialisation du pipeline..."

build_job:
  stage: build
  script:
    - echo "Compilation..."

.post:
  stage: .post
  script:
    - echo "Nettoyage et fin du pipeline..."
```

### Environnements et déploiements multiples

GitLab permet de déployer vers différents environnements avec un contrôle granulaire.[2]

```yaml
stages:
  - build
  - test
  - deploy_staging
  - deploy_production

build_job:
  stage: build
  script:
    - npm run build

test_job:
  stage: test
  script:
    - npm test

deploy_staging:
  stage: deploy_staging
  script:
    - echo "Déploiement en préproduction..."
    - ./deploy.sh staging
  environment:
    name: staging
    url: https://staging.monapp.com
  only:
    - develop

deploy_production:
  stage: deploy_production
  script:
    - echo "Déploiement en production..."
    - ./deploy.sh production
  environment:
    name: production
    url: https://monapp.com
  when: manual
  only:
    - main
```

Dans cet exemple :

- Le déploiement en staging (préproduction) s'exécute automatiquement sur la branche `develop`
- Le déploiement en production s'exécute uniquement sur la branche `main` et nécessite une approbation manuelle (`when: manual`)

### Vérification et diagnostic

Lorsque l'exécution d'un pipeline rencontre des problèmes, plusieurs outils de diagnostic sont disponibles :

**Logs des jobs** : Chaque job affiche des logs détaillés montrant l'exécution de chaque commande du script.

**Statut du pipeline** : Le statut global (succès, échec, arrêté) est visible immédiatement.

**Artefacts générés** : Les artefacts créés par les jobs peuvent être téléchargés pour examen.

**Historique des pipelines** : Un historique complet de toutes les exécutions est conservé, permettant d'identifier les patterns d'erreurs.

---

## Conclusion du chapitre 1

Ce premier chapitre a établi les fondations essentielles pour comprendre GitLab CI/CD. De l'introduction générale aux concepts DevOps, en passant par les principes de CI/CD et la syntaxe YAML, jusqu'à la mise en place concrète de l'environnement, les éléments clés ont été présentés.

La compréhension de ces concepts fondamentaux est cruciale avant d'explorer les configurations plus avancées. L'automatisation des processus de développement, réalisée via GitLab CI/CD, transforme profondément les workflows et améliore significativement la qualité et la vitesse de livraison des applications.
