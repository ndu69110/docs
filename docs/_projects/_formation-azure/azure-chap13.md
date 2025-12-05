# Citations
- https://azure.microsoft.com/fr-fr/products/advisor
- https://learn.microsoft.com/fr-fr/azure/advisor/advisor-overview
- https://hichamkadiri.wordpress.com/2019/02/12/azure-governance-toolbox-azure-advisor-introduction-howto/
- https://vignon.cloud/2023/08/04/howtocomment-optimiser-vos-performances-votre-rentabilite-et-bien-plus-encore-avec-azure-advisor/
- https://learn.microsoft.com/fr-fr/azure/advisor/advisor-get-started
- https://learn.microsoft.com/fr-fr/shows/azure/azure-advisor-your-personalized-guide-to-optimal-resource-configuration
- https://learn.microsoft.com/fr-fr/azure/cost-management-billing/costs/tutorial-acm-opt-recommendations
- https://www.youtube.com/watch?v=RJVSNsC8Sks
- https://learn.microsoft.com/fr-fr/shows/azure-friday/azure-advisor--your-free-personalized-guide-to-azure-best-practices


# Tokens
- prompt_tokens: 229
- completion_tokens: 5299
- total_tokens: 5528
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.079, 'request_cost': 0.006, 'total_cost': 0.086}


# Content
# Chapitre 13 : Monitoring dans Azure

## Introduction à Advisor

### Présentation générale d'Azure Advisor

Azure Advisor est un assistant cloud numérique qui fonctionne de manière autonome pour analyser les configurations et l'utilisation des ressources Azure déployées[1][2]. Son rôle principal consiste à examiner la télémétrie de configuration et d'utilisation, puis formuler des recommandations personnalisées destinées à optimiser les déploiements cloud selon les meilleures pratiques Azure.

Le service opère en arrière-plan de manière continue, effectuant des analyses approfondies sur l'ensemble des ressources. Il est important de noter que pour les ressources nouvellement créées, l'obtention des recommandations peut prendre jusqu'à 24 heures[5].

### Objectifs stratégiques d'Azure Advisor

Azure Advisor poursuit plusieurs objectifs fondamentaux dans la gestion d'une infrastructure cloud :

**Amélioration de la rentabilité** : Le service identifie les ressources sous-utilisées, inactives ou surdimensionnées qui consomment des ressources inutilement[2][7]. Par exemple, une machine virtuelle configurée pour un environnement de production mais tournant à seulement 5% de sa capacité sera identifiée comme candidate à une réduction de taille.

**Optimisation des performances** : Azure Advisor analyse en profondeur les goulots d'étranglement potentiels et les configurations incorrectes qui impactent la vitesse d'exécution des applications[4]. Cela inclut l'identification de mauvaises configurations de mise en cache, de problèmes de configuration réseau ou de ressources insuffisantes.

**Renforcement de la sécurité** : Les recommandations de sécurité proviennent d'Azure Security Center (désormais Microsoft Defender pour le cloud)[3], permettant de détecter les menaces et vulnérabilités qui pourraient conduire à des failles de sécurité.

**Augmentation de la fiabilité** : Le service aide à identifier les opportunités d'amélioration de la haute disponibilité des services critiques en recommendant des configurations de redondance appropriées.

**Excellence opérationnelle** : Advisor fournit des conseils pour améliorer les pratiques de gestion et de gouvernance Azure globale[1].

### Architecture et fonctionnement interne

Azure Advisor fonctionne selon un modèle d'analyse multicouche qui combine plusieurs sources de données :

- **Télémétrie de configuration** : Analyse de la configuration actuelle de chaque ressource
- **Données d'utilisation** : Monitoring des performances et de l'utilisation réelle
- **Données de facturation** : Collectées depuis le portail Azure Enterprise et Cost Management
- **Recommandations d'outils partenaires** : Intégration avec Microsoft Defender pour le cloud et Azure Cost Management[4]

### Accès et interfaces d'Advisor

Azure Advisor est accessible selon plusieurs modalités pour s'adapter aux préférences et besoins des administrateurs :

**Portail Azure** : L'interface graphique principale accessible en recherchant « Advisor » dans le panneau de navigation[2][5]. Cette interface offre une vue complète avec des tableaux de bord visuels et des filtres avancés.

**Interface de ligne de commande (CLI)** : Pour les utilisateurs préférant l'automatisation et les scripts[1].

**API REST Advisor** : Pour l'intégration programmée dans des solutions personnalisées[1].

**PowerShell** : Alternative scripting pour la gestion automatisée[1].

Les droits d'accès sont basés sur les rôles Azure, nécessitant au minimum le rôle de lecteur sur un abonnement pour consulter les recommandations[1].

### Catégories de recommandations

Azure Advisor organise ses recommandations en cinq catégories distinctes :

| Catégorie | Objectif | Exemples de recommandations |
|-----------|---------|---------------------------|
| **Fiabilité** | Augmenter la disponibilité des services critiques | Configurations de haute disponibilité, points de défaillance uniques |
| **Sécurité** | Détecter menaces et vulnérabilités | Accès non sécurisé, configurations de pare-feu, gestion des secrets |
| **Performance** | Optimiser la vitesse et l'efficacité | Mise à l'échelle inappropriée, configurations de cache, optimisation de base de données |
| **Coût** | Réduire les dépenses Azure | Ressources inactives, VM sous-utilisées, réservations non optimales |
| **Excellence opérationnelle** | Améliorer les pratiques de gestion | Meilleures pratiques, gouvernance, conformité |

Advisor contient plus de 100 recommandations différentes, et Microsoft en ajoute continuellement de nouvelles[4].

### Services supportés par Azure Advisor

Azure Advisor fournit des recommandations pour une large gamme de services Azure[2] :

- Gestion des API Azure
- Azure Application Gateway
- Azure App Service
- Groupes à haute disponibilité
- Cache Azure
- Azure Database pour MySQL et PostgreSQL
- Azure FarmBeats
- Adresses IP publiques Azure
- Azure Synapse Analytics
- Log Analytics
- Azure Cache pour serveur Redis
- SQL Server
- Compte Stockage Azure
- Profil Azure Traffic Manager
- Machines virtuelles Azure
- Groupes de machines virtuelles identiques (VMSS)
- Passerelle de réseau virtuel Azure

### Fonctionnalités avancées de recommandation

**Recommandations prioritaires** : Les suggestions sont classées par ordre de priorité en fonction de l'estimation de leur importance pour chaque environnement spécifique[1].

**Azure Advisor Quick Fix** : Cette fonctionnalité permet de corriger simultanément les recommandations pour plusieurs ressources en seulement quelques clics, facilitant et accélérant l'optimisation à grande échelle[1].

**Actions proposées** : Chaque recommandation inclut des propositions d'actions intégrées permettant d'implémenter directement la remédiation[3].

### Personnalisation et configuration

Advisor offre une flexibilité importante pour adapter les recommandations aux contextes spécifiques :

**Ciblage par abonnement** : Configuration d'Advisor pour afficher les recommandations uniquement pour des abonnements spécifiques[1].

**Ciblage par groupe de ressources** : Possibilité de concentrer l'attention sur des groupes de ressources particuliers[1].

**Exclusion de ressources** : Possibility d'exclure les ressources de test ou certains environnements des recommandations[5].

**Alertes automatiques** : Configuration d'alertes pour être notifié automatiquement des nouvelles recommandations[1].

**Filtrage des états** : Gestion des recommandations selon leur état (Active, Reportée, Ignorée)[5].

### Suivi et amélioration continue

Azure Advisor fournit des tableaux de bord et des rapports détaillés permettant de suivre l'évolution des recommandations dans le temps[4]. Le système envoie des notifications proactives alertant des problèmes potentiels et des nouvelles recommandations basées sur les évolutions de l'environnement Azure[4]. Ces fonctionnalités permettent une démarche d'amélioration continue plutôt que ponctuelle.

---

## Azure Service Health

### Définition et rôle stratégique

Azure Service Health est un service de monitoring essentiel qui fournit une visibilité complète sur l'état de santé des services Azure et l'impact potentiel sur les ressources déployées. Contrairement à Azure Advisor qui recommande des optimisations, Azure Service Health informe sur l'état réel et la disponibilité des services de la plateforme Azure.

Le service joue un rôle critique dans la planification de la continuité d'activité et la gestion des incidents, permettant aux administrateurs de rester informés des problèmes affectant ou pouvant affecter leurs services.

### Composantes principales d'Azure Service Health

Azure Service Health se structure autour de trois composantes principales, chacune adressant un type d'information spécifique sur l'infrastructure Azure :

**Azure Status** : Cette composante affiche l'état global des services Azure dans toutes les régions du monde. Elle fournit une vision macroscopique de la santé de la plateforme sans être spécifique aux ressources d'un client particulier. Consultable publiquement, elle offre une transparence complète sur les problèmes à l'échelle de l'infrastructure.

**Service Health** : Cette vue personnalisée affiche l'état des services Azure dans les régions où le client a déployé des ressources. Contrairement à Azure Status, elle est contextualisée selon la géographie d'utilisation du client, permettant de voir uniquement les informations pertinentes.

**Resource Health** : Cette composante fournit une analyse approfondie au niveau de chaque ressource individuelle. Elle permet de comprendre pourquoi une ressource spécifique peut être indisponible ou dégradée, en reliant les problèmes observés aux incidents ou maintenances au niveau de la plateforme.

### Catégories d'événements dans Azure Service Health

Azure Service Health catégorise les événements en plusieurs types, chacun nécessitant une réaction différente :

**Problèmes de service** : Représentent des incidents actuels affectant les services Azure. Par exemple, une région Azure où une défaillance matérielle importante impacte plusieurs services. Ces problèmes demandent une attention immédiate et constituent une urgence.

**Maintenances planifiées** : Les événements de maintenance sont notifiés à l'avance, permettant aux administrateurs de planifier les actions préventives. Une maintenance planifiée sur des ressources de calcul dans une région donnée sera communiquée plusieurs jours à l'avance.

**Avis de sécurité** : Alertent sur les problèmes de sécurité nécessitant une action de la part du client. Ces avis peuvent concerner une vulnérabilité nécessitant une mise à jour ou une reconfiguration.

**Avis de sante** : Informent sur les problèmes non critiques mais importants à connaître, comme des changements de comportement ou des limitations temporaires.

### Accès à Azure Service Health

**Portail Azure** : Accessible via le portail en recherchant « Service Health » dans le menu. Cette interface offre une vue complète avec les filtres et les options d'alertes.

**Alertes proactives** : Configuration d'alertes pour être notifié automatiquement des problèmes et maintenances affectant les services utilisés.

**API REST** : Accès programmé aux données d'Azure Service Health pour intégration dans des solutions de monitoring personnalisées.

### Scénarios d'utilisation pratiques

**Diagnostic d'incident** : Lorsqu'une ressource Azure devient indisponible, Resource Health permet de vérifier rapidement si le problème provient d'une maintenance planifiée ou d'une défaillance de l'infrastructure Azure plutôt que d'une mauvaise configuration.

**Planification de maintenance** : En consultant les maintenances planifiées, une entreprise peut synchroniser ses propres opérations de maintenance pour éviter une surcharge des services.

**Communication avec les équipes** : Les informations d'Azure Service Health peuvent être partagées avec les équipes de support ou les clients pour expliquer les problèmes de disponibilité.

**Rétention historique** : Azure Service Health conserve l'historique des incidents et maintenances, permettant d'analyser les tendances et d'identifier les régions ou services présentant les plus hauts taux de problèmes.

---

## Azure Monitor

### Architecture générale et position dans l'écosystème

Azure Monitor est le service central de monitoring et d'observabilité pour la plateforme Azure. Il constitue le pilier fondamental permettant de collecter, analyser et agir sur les données de télémétrie provenant de l'ensemble des ressources Azure et des applications qui y sont déployées.

Azure Monitor fonctionne selon une architecture multicouche composée de plusieurs services spécialisés qui travaillent conjointement pour fournir une observabilité complète :

### Composantes majeures d'Azure Monitor

**Métriques** : Représentent des mesures numériques sur les performances et le comportement des ressources. Exemples incluent le pourcentage d'utilisation CPU, la mémoire utilisée, le nombre de requêtes traitées par seconde ou la latence des réponses. Les métriques sont collectées à des intervalles réguliers (typiquement chaque minute) et stockées sous forme de séries temporelles.

**Journaux** : Contiennent les événements détaillés et structurés générés par les ressources et les applications. Les journaux fournissent des informations contextuelles enrichies impossibles à capturer dans les métriques simples. Exemples : logs d'erreurs d'applications, événements d'authentification, traces de transaction.

**Traces distribuées** : Permettent de suivre la progression d'une requête à travers une architecture microservices complexe, en identifiant où se produisent les latences ou les erreurs dans la chaîne de traitement.

**Alertes** : Notifications automatiques déclenchées lorsque des conditions spécifiques sont rencontrées. Par exemple, une alerte se déclenche lorsque l'utilisation CPU dépasse 80% pendant plus de 5 minutes.

### Flux de collecte de données

Azure Monitor fonctionne selon un modèle de collecte en trois phases :

**Phase 1 - Collecte** : Les données de télémétrie sont collectées à partir de multiples sources, incluant les ressources Azure natives, les applications déployées sur ces ressources, les systèmes d'exploitation invités, et même les ressources externes via des agents.

**Phase 2 - Agrégation et enrichissement** : Les données brutes sont traitées, filtrées, agrégées et enrichies avec des métadonnées contextuelles permettant une analyse plus intelligente.

**Phase 3 - Stockage et analyse** : Les données sont stockées dans des repositories spécialisés permettant l'interrogation, l'analyse et la génération de rapports.

### Types de métriques collectées

**Métriques des ressources** : Collectées automatiquement par Azure Monitor pour toutes les ressources Azure sans configuration supplémentaire. Chaque type de ressource dispose d'un ensemble standard de métriques pertinentes à sa fonction.

**Métriques personnalisées** : Les applications peuvent envoyer des métriques personnalisées reflétant des indicateurs métier spécifiques. Par exemple, un e-commerce peut envoyer des métriques sur le nombre de commandes par minute ou la valeur moyenne des paniers.

**Métriques d'invité** : Collectées depuis l'intérieur de la machine virtuelle, nécessitant l'installation d'un agent. Incluent des métriques au niveau du système d'exploitation comme la température du CPU ou l'utilisation de la mémoire swap.

### Outils d'analyse et de visualisation

**Explorateur de métriques** : Interface interactive permettant de construire des graphiques pour visualiser les métriques au fil du temps. Inclut des options d'agrégation, de filtrage et de comparaison entre multiples ressources.

**Log Analytics** : Environment d'interrogation avancée utilisant KQL (Kusto Query Language) pour analyser les journaux et les données de performance. Permet des analyses complexes et des requêtes multidimensionnelles.

**Classeurs (Workbooks)** : Tableaux de bord interactifs combinant des visualisations, du texte explicatif et des contrôles permettant une exploration approfondie des données.

**Application Insights** : Spécialisé dans le monitoring des applications web et mobiles, fournissant des métriques détaillées sur les performances, la disponibilité et les erreurs.

### Configuration des alertes

Les alertes Azure Monitor fonctionnent selon un système sophistiqué de règles :

**Condition d'alerte** : Définie par une expression logique. Exemple : « Si la métrique CPU dépasse 80% pour une durée de 5 minutes, déclenche l'alerte ».

**Actions** : Définissent ce qui se produit quand l'alerte se déclenche. Exemples : envoi d'email, appel de webhook, création d'un ticket incident, exécution d'une runbook Automation.

**Groupes d'actions** : Collections réutilisables d'actions permettant de définir une seule fois comment gérer un type d'alerte, puis de l'appliquer à plusieurs règles.

**États d'alerte** : Une alerte peut être dans les états « Alertée » (condition respectée), « Résolue » (condition plus respectée), ou « Supprimée » (temporairement désactivée).

### Hiérarchie de stockage des données

Azure Monitor implémente une hiérarchie sophistiquée de stockage optimisant la performance et le coût :

**Stockage haute résolution court terme** : Les 93 jours les plus récents des données sont stockés avec résolution d'une minute, permettant des analyses détaillées à court terme.

**Stockage basse résolution long terme** : Les données plus anciennes sont compressées et stockées avec résolution d'une heure, conservant l'historique mais avec moins de détail.

**Export long terme** : Possibilité d'exporter les données anciennes vers des systèmes externes pour archivage et conformité réglementaire.

### Intégration avec d'autres services Azure

**Azure Automation** : Azure Monitor peut déclencher des runbooks Automation pour automatiser les réactions aux problèmes détectés.

**Gestion des événements Azure (Event Grid)** : Permet de router les événements d'alertes vers d'autres services pour orchestration complexe.

**Power BI** : Intégration pour créer des rapports visuels à partir des données collectées.

**Splunk et autres SIEM** : Export des données vers des outils de sécurité et analyse tiers.

### Best practices pour l'utilisation d'Azure Monitor

**Définition d'indicateurs métier** : Au-delà des métriques techniques, définir des indicateurs alignés avec les objectifs métier de l'organisation (chiffre d'affaires, satisfaction client, temps de réponse).

**Alerting intelligent** : Éviter l'excès d'alertes (alert fatigue) en définissant des seuils pertinents et en groupant les alertes connexes.

**Documentation des seuils** : Documenter les raisons derrière chaque seuil d'alerte pour faciliter les ajustements futurs.

**Révision régulière** : Passer en revue régulièrement les alertes pour identifier les fausses positives et les opportunités d'amélioration.

---

## Intégration croisée des trois services de monitoring

### Complémentarité fonctionnelle

Les trois composantes du monitoring Azure (Advisor, Service Health, Monitor) forment un écosystème intégré où chaque service joue un rôle distinct mais complémentaire :

**Azure Advisor** fournit l'optimisation proactive basée sur les meilleures pratiques et l'analyse de configuration. Il répond à la question « Comment pouvons-nous mieux utiliser nos ressources ? »

**Azure Service Health** fournit la transparence sur l'état de la plateforme Azure elle-même. Il répond à la question « La plateforme Azure est-elle en bon état ? »

**Azure Monitor** fournit l'observabilité détaillée des ressources déployées et des applications. Il répond à la question « Comment se comportent nos ressources et nos applications ? »

### Flux d'information intégré

Un administrateur Azure typique utiliserait ces trois services dans un flux :

1. **Détection initiale via Azure Monitor** : Une alerte se déclenche indiquant une latence élevée.

2. **Consultation d'Azure Service Health** : Vérifier si Azure Service Health signale une maintenance ou un incident pouvant expliquer la dégradation.

3. **Analyse via Azure Monitor** : Explorer les données détaillées pour identifier la cause racine spécifique.

4. **Recommendations via Advisor** : Vérifier si Advisor propose des optimisations pertinentes basées sur les observations.

5. **Action corrective** : Basée sur les informations consolidées de ces trois services.

### Scénario d'utilisation intégré pratique

Considérons le scénario suivant : une application web hébergée sur Azure App Service commence à afficher une latence accrue.

**Étape 1 - Détection** : Azure Monitor génère une alerte sur la métrique de latence des requêtes HTTP.

**Étape 2 - Investigation du contexte** : L'administrateur consulte Azure Service Health pour vérifier si une maintenance affecte la région contenant l'App Service. Supposons qu'une maintenance soit en cours sur le réseau régional.

**Étape 3 - Analyse détaillée** : Dans Azure Monitor, l'administrateur consulte les logs détaillés de l'App Service pour identifier que certaines erreurs de timeouts apparaissent lors des connexions aux bases de données.

**Étape 4 - Vérification des recommandations** : Azure Advisor recommande de migrer la base de données vers un SKU supérieur ou d'activer un cache Redis pour réduire la charge.

**Étape 5 - Décision** : L'administrateur attend la fin de la maintenance (identifiée via Service Health) tout en implémentant la recommandation d'Advisor concernant le cache Redis.

Cet exemple montre comment les trois services collaborent pour fournir une vision holistique permettant une prise de décision éclairée.

---

## Configuration pratique et implémentation

### Accès centralisé via le Portail Azure

L'accès aux trois services de monitoring se fait principalement via le portail Azure unifié :

1. Connectez-vous au portail Azure (portal.azure.com)
2. Recherchez le service souhaité (Advisor, Service Health, ou Monitor) dans la barre de recherche
3. Chaque service ouvre dans un environnement dédié offrant ses propres outils et visualisations

### Notifications et alertes unifiées

Les trois services peuvent être configurés pour envoyer des notifications via :

- Email
- SMS
- Notifications Push dans le portail
- Webhooks pour intégration personnalisée
- Intégration avec des outils tiers comme Slack ou PagerDuty

### Reporting et conformité

Les données de ces trois services peuvent être consolidées pour :

- Générer des rapports mensuels sur l'état de santé de l'infrastructure
- Démontrer la conformité avec les SLA convenus
- Identifier les tendances et les points d'amélioration
- Justifier les investissements en infrastructure

---

## Conclusion du chapitre

Le monitoring dans Azure s'articule autour de trois piliers distincts mais complémentaires. **Azure Advisor** guide l'optimisation continue à travers des recommandations basées sur les meilleures pratiques. **Azure Service Health** fournit la transparence sur l'état de la plateforme et les maintenances planifiées. **Azure Monitor** offre l'observabilité détaillée permettant de comprendre le comportement réel des ressources et des applications.

Une maîtrise effective de ces trois services constitue la fondation d'une gestion professionnelle de l'infrastructure Azure, permettant aux administrateurs de maintenir des systèmes performants, fiables et sécurisés tout en contrôlant les coûts.
