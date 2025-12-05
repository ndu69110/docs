# Citations
- https://docs.rockylinux.org/10/fr/guides/automation/anacron/
- https://linux-fra.com/?p=1949
- http://doc.ubuntu-fr.org/anacron
- https://eric-wurbel.pedaweb.univ-amu.fr/extranet/Enseignement/R202/TP6.html
- https://docs.gandi.net/fr/hebergement_web/operations_courantes/anacron.html
- https://docs.redhat.com/fr/documentation/red_hat_enterprise_linux/7/html/system_administrators_guide/ch-automating_system_tasks
- https://lea-linux.org/documentations/Programmation_de_travaux_avec_at_cron_anacron
- http://doc.ubuntu-fr.org/cron
- https://tuxcare.com/fr/blog/centos-crontab/
- https://blog.stephane-robert.info/docs/admin-serveurs/linux/cron/


# Tokens
- prompt_tokens: 263
- completion_tokens: 8580
- total_tokens: 8843
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.129, 'request_cost': 0.006, 'total_cost': 0.135}


# Content
# Les Tâches Cron et Anacron sous Linux 🐧

## Introduction aux tâches planifiées

La planification de tâches est un élément fondamental de l'administration système Linux. Elle permet d'automatiser l'exécution de scripts, de commandes ou de logiciels à des moments précis ou selon des cycles réguliers, sans intervention manuelle. Linux propose plusieurs outils pour accomplir cette automatisation, chacun conçu pour des cas d'usage spécifiques.[2][6]

Les deux principaux outils de planification récurrente sont **cron** et **anacron**. Bien qu'ils partagent des objectifs similaires, ils fonctionnent selon des principes différents et s'adressent à des contextes d'utilisation distincts. Comprendre leurs différences et savoir quand utiliser l'un ou l'autre est essentiel pour une gestion efficace des systèmes Linux.

---

## Introduction aux Cron ⏰

### Qu'est-ce que cron ?

Cron est un **démon système** (service en arrière-plan) conçu pour exécuter des tâches programmées à des intervalles de temps spécifiés.[4][8][9] Ce démon s'exécute en permanence sur les systèmes Unix/Linux et représente le maître incontesté de l'automatisation des tâches planifiées.

### Fonctionnement fondamental de cron

Le service cron fonctionne selon un cycle régulier et méthodique :[4][10]

- Cron se réveille **toutes les minutes** et examine l'ensemble des crontab chargées dans le système
- Pour chaque minute, il vérifie toutes les commandes planifiées pour déterminer si elles doivent être exécutées durant cette minute spécifique
- Toute sortie générée par l'exécution de commandes est envoyée par courrier électronique au propriétaire de la crontab
- De plus, cron examine toutes les minutes si les fichiers de configuration ont changé et les relit automatiquement si nécessaire

### Cas d'usage idéal pour cron

Cron convient particulièrement aux **machines qui fonctionnent en continu 24 heures sur 24 et 7 jours sur 7**, telles que :[2]

- Les serveurs web et serveurs de bases de données
- Les systèmes d'hébergement mutualisé
- Les machines virtuelles fonctionnant sans interruption
- Les ordinateurs de bureau qui restent allumés en permanence

### Limitation majeure de cron

La principale limitation de cron est qu'**il ne rattrape pas les tâches manquées**. Si une machine est éteinte au moment prévu pour l'exécution d'une tâche planifiée avec cron, la tâche ne s'exécutera simplement pas.[2][7] Par exemple, si une tâche de sauvegarde est programmée tous les minuits et que l'ordinateur portable est éteint à ce moment-là, le script de sauvegarde ne sera pas exécuté et aucune tentative de rattrapage ne sera effectuée.

---

## Syntaxe pour la Crontab 📝

### Structure générale d'une entrée crontab

Chaque ligne d'une crontab (fichier de planification cron) suit un format standard composé de six champs :[2][4]

```
minute heure jour_du_mois mois jour_de_la_semaine commande
```

### Détail de chaque champ

| Champ | Plage | Description | Exemples |
|-------|-------|-------------|----------|
| **minute** | 0-59 | Minute de l'heure | 0, 15, 30, 45, */5 |
| **heure** | 0-23 | Heure du jour (format 24h) | 0, 6, 12, 18, 23 |
| **jour_du_mois** | 1-31 | Jour du mois | 1, 15, 31 |
| **mois** | 1-12 | Mois de l'année | 1 (janvier), 6 (juin), 12 (décembre) |
| **jour_de_la_semaine** | 0-6 | Jour de la semaine (0=dimanche, 6=samedi) | 0, 1, 5 |
| **commande** | - | Commande ou script à exécuter | /usr/bin/backup.sh, echo "test" |

### Opérateurs et caractères spéciaux

La syntaxe crontab supporte plusieurs opérateurs pour créer des expressions complexes :

**L'astérisque (*)**

L'astérisque représente "toutes les valeurs" possibles pour ce champ. Par exemple, `*` dans le champ des heures signifie "chaque heure".

```
0 * * * * /usr/bin/script.sh
```

Cette ligne exécute le script `/usr/bin/script.sh` à 00:00 (minuit) de chaque jour.

**La virgule (,)**

La virgule permet de spécifier plusieurs valeurs distinctes.

```
0 9,12,17 * * * /usr/bin/rapport.sh
```

Cette ligne exécute le script à 9h, 12h et 17h chaque jour.

**L'intervalle (-)**

Le tiret définit une plage de valeurs.

```
0 9-17 * * * /usr/bin/verification.sh
```

Cette ligne exécute le script chaque heure de 9h à 17h, c'est-à-dire à 9h00, 10h00, 11h00... jusqu'à 17h00.

**L'intervalle avec répétition (*/n)**

L'expression `*/n` exécute une tâche tous les n intervalles.

```
*/15 * * * * /usr/bin/sync.sh
```

Cette ligne exécute le script toutes les 15 minutes (à 0, 15, 30, 45 minutes de chaque heure).

```
0 */6 * * * /usr/bin/maintenance.sh
```

Cette ligne exécute le script toutes les 6 heures (à 0h, 6h, 12h, 18h).

### Noms symboliques

Pour améliorer la lisibilité, crontab accepte les noms anglais pour les mois et les jours de la semaine :

**Mois :** jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec

**Jours :** sun, mon, tue, wed, thu, fri, sat

```
0 10 15 mar fri /usr/bin/rapport-trimestriel.sh
```

Cette ligne exécute le script le 15 mars à 10h s'il tombe un vendredi.

### Cas particuliers et raccourcis

Crontab propose des raccourcis pratiques pour les tâches courantes :

```
@yearly    0 0 1 1 *       Exécute une fois par année (1er janvier à minuit)
@annually  0 0 1 1 *       Identique à @yearly
@monthly   0 0 1 * *       Exécute une fois par mois (1er jour du mois à minuit)
@weekly    0 0 * * 0       Exécute une fois par semaine (dimanche à minuit)
@daily     0 0 * * *       Exécute une fois par jour (à minuit)
@midnight  0 0 * * *       Identique à @daily
@hourly    0 * * * *       Exécute une fois par heure (à la minute 0)
@reboot    -               Exécute une seule fois au démarrage du système
```

---

## Exemple de Crontab 📋

### Édition et gestion de la crontab

Pour éditer la crontab de l'utilisateur courant :

```bash
crontab -e
```

Cette commande ouvre un éditeur de texte (généralement vi ou nano) permettant de modifier les tâches programmées.

### Exemple de crontab commentée

Voici un fichier `/etc/crontab` typique avec annotations explicatives :

```
# /etc/crontab : fichier de crontab système
# Le format est identique aux crontab utilisateur, mais avec un champ supplémentaire
# pour spécifier l'utilisateur qui exécutera la tâche

SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# Sauvegarde quotidienne à 2h30 du matin
30 2 * * * root /usr/local/bin/backup-daily.sh

# Nettoyage des fichiers temporaires tous les jours à 3h
0 3 * * * root /usr/local/bin/cleanup-temp.sh

# Synchronisation des données vers le serveur distant tous les jours à 22h
0 22 * * * root /usr/local/bin/sync-remote.sh

# Mise à jour du système le 1er jour du mois à 1h du matin
0 1 1 * * root /usr/bin/apt update && /usr/bin/apt upgrade -y

# Vérification du disque dur tous les jours à 4h, du lundi au vendredi
0 4 * * 1-5 root /usr/local/bin/check-disk.sh

# Rapport de sécurité chaque dimanche à 6h
0 6 * * 0 root /usr/local/bin/security-report.sh

# Exécution horaire d'un script de maintenance
0 * * * * root /usr/local/bin/hourly-maintenance.sh

# Nettoyage des logs tous les 4 heures
0 */4 * * * root /usr/local/bin/clean-logs.sh

# Redémarrage des services critiques tous les jours à 5h du matin
0 5 * * * root systemctl restart apache2 mysql
```

### Déconstruction d'exemples pratiques

**Exemple 1 : Sauvegarde quotidienne**

```
30 2 * * * /home/user/backup.sh
```

- **30** : à la 30ème minute
- **2** : à 2h du matin
- **\*** : tous les jours du mois
- **\*** : tous les mois
- **\*** : tous les jours de la semaine
- Résultat : Le script s'exécute chaque jour à 2h30

**Exemple 2 : Tâche tous les jours ouvrables**

```
0 9 * * 1-5 /usr/local/bin/work-tasks.sh
```

- **0** : à la minute 0
- **9** : à 9h du matin
- **\*** : tous les jours du mois
- **\*** : tous les mois
- **1-5** : du lundi (1) au vendredi (5)
- Résultat : Le script s'exécute à 9h chaque jour ouvrable

**Exemple 3 : Tâche toutes les deux heures**

```
0 */2 * * * /usr/local/bin/frequent-check.sh
```

- **0** : à la minute 0
- **\*/2** : chaque 2 heures (0, 2, 4, 6... 22)
- **\*** : tous les jours du mois
- **\*** : tous les mois
- **\*** : tous les jours de la semaine
- Résultat : Le script s'exécute à 0h, 2h, 4h, 6h... 22h

**Exemple 4 : Tâche le 15 de chaque mois**

```
0 0 15 * * /usr/local/bin/monthly-tasks.sh
```

- **0** : à la minute 0
- **0** : à 0h (minuit)
- **15** : le 15 du mois
- **\*** : tous les mois
- **\*** : tous les jours de la semaine
- Résultat : Le script s'exécute à minuit le 15 de chaque mois

**Exemple 5 : Utilisation des raccourcis**

```
@hourly /usr/local/bin/check-status.sh
@daily /usr/local/bin/maintenance.sh
@weekly /usr/local/bin/full-backup.sh
```

Ces raccourcis sont plus lisibles que leur équivalent numérique.

### Script de sauvegarde planifié

Voici un exemple pratique : un script de sauvegarde à exécuter quotidiennement via cron.

```bash
#!/bin/bash
# Script: backup-daily.sh
# Description: Sauvegarde quotidienne des données système
# Scheduled: 0 2 * * * (2h du matin chaque jour)

BACKUP_DIR="/var/backups"
SOURCE_DIR="/home/data"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.tar.gz"
LOG_FILE="/var/log/backup.log"

# Créer le répertoire de sauvegarde s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Effectuer la sauvegarde
echo "[$(date)] Début de la sauvegarde de $SOURCE_DIR" >> "$LOG_FILE"

if tar -czf "$BACKUP_FILE" "$SOURCE_DIR" 2>> "$LOG_FILE"; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date)] Sauvegarde réussie: $BACKUP_FILE (taille: $SIZE)" >> "$LOG_FILE"
else
    echo "[$(date)] ERREUR: Échec de la sauvegarde" >> "$LOG_FILE"
    exit 1
fi

# Supprimer les sauvegardes de plus de 30 jours
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +30 -delete
echo "[$(date)] Nettoyage des anciennes sauvegardes effectué" >> "$LOG_FILE"
```

### Commandes de gestion de crontab

**Afficher la crontab actuelle :**

```bash
crontab -l
```

**Supprimer la crontab :**

```bash
crontab -r
```

**Éditer la crontab :**

```bash
crontab -e
```

**Installer une crontab à partir d'un fichier :**

```bash
crontab /chemin/vers/fichier
```

**Afficher la crontab d'un autre utilisateur (root requis) :**

```bash
crontab -u nomdutilisateur -l
```

---

## Anacron : La Solution pour les Machines non Permanentes 💾

### Qu'est-ce qu'anacron ?

Anacron est un utilitaire conçu pour exécuter des commandes périodiquement, avec une **fréquence définie en jours plutôt qu'en minutes** comme cron.[1][2][3] Il fonctionne différemment de cron et s'adresse spécifiquement aux machines qui ne fonctionnent pas en continu.

La grande particularité d'anacron est qu'il **garantit l'exécution des tâches même si la machine était éteinte au moment prévu**, à condition que la machine soit redémarrée dans l'intervalle de temps imparti.[2]

### Différences fondamentales entre cron et anacron

| Aspect | Cron | Anacron |
|--------|------|---------|
| **Fréquence** | Exprimée en minutes, heures, jours | Exprimée uniquement en jours |
| **Temps d'accès** | Précis, à la minute près | Approximatif (une fois par jour) |
| **Rattrapage** | Ne rattrape pas les tâches manquées | Rattrape les tâches si la machine était éteinte |
| **Cas d'usage** | Serveurs 24/7, tâches horaires | Ordinateurs portables, de bureau, ordinateurs intermittents |
| **Utilisateurs** | Peut être utilisé par tous les utilisateurs | Principalement réservé à root |
| **Relance** | Démon permanent | Doit être relancé régulièrement |

### Fonctionnement d'anacron

Anacron fonctionne selon un mécanisme basé sur les **fichiers d'horodatage** (timestamp files).[1][3][4]

1. **Vérification du timestamp** : Anacron lit le fichier de configuration `/etc/anacrontab` et examine les fichiers d'horodatage correspondants, situés généralement dans `/var/spool/anacron/`.

2. **Calcul de la différence** : Pour chaque tâche, anacron compare la date actuelle avec la date d'exécution précédente stockée dans le fichier timestamp.

3. **Décision d'exécution** : Si la différence entre la date actuelle et la dernière exécution dépasse le nombre de jours spécifié dans la configuration, anacron exécute la tâche.

4. **Attente** : Avant d'exécuter la commande, anacron attend le délai (en minutes) spécifié pour laisser le système se stabiliser après le démarrage.

5. **Mise à jour du timestamp** : Une fois la tâche exécutée, anacron enregistre la date d'exécution dans le fichier d'horodatage pour la prochaine vérification.

### Cycle de vie d'anacron

Il est important de noter qu'**anacron n'est pas un démon permanent**.[3] Après l'exécution de ses tâches, il se ferme. Pour cette raison, anacron doit être relancé régulièrement. Historiquement, cela était assuré par une tâche cron (voir `/etc/cron.d/anacron`), qui le lançait toutes les heures entre 7h30 et 23h30. Aujourd'hui, sur les systèmes modernes, cette planification est assurée par un **service et un "timer" systemd** plutôt que par une tâche cron traditionnelle.

```bash
systemctl cat anacron.timer
```

### Configuration d'anacron : `/etc/anacrontab`

#### Structure du fichier

Le fichier `/etc/anacrontab` contient les tâches anacron, avec un format similaire à crontab mais simplifié.[1][2][4]

```
period delay job-identifier command
```

#### Détail des champs

| Champ | Description | Exemple |
|-------|-------------|---------|
| **period** | Intervalle en jours | 1 (quotidien), 7 (hebdomadaire), 30 (mensuel) |
| **delay** | Délai d'attente en minutes avant l'exécution | 5, 10, 30, 45 |
| **job-identifier** | Identifiant unique pour la tâche | cron.daily, cron.weekly, backup |
| **command** | Commande ou script à exécuter | /usr/bin/run-parts /etc/cron.daily |

#### Exemple de fichier anacrontab

```
# /etc/anacrontab
# Exécuter les tâches dans /etc/cron.daily quotidiennement
# Attendre 5 minutes après le démarrage, puis vérifier
# Si non exécuté aujourd'hui, lancer la tâche

1 5 cron.daily nice run-parts /etc/cron.daily

# Exécuter les tâches dans /etc/cron.weekly hebdomadairement
# Attendre 25 minutes après le démarrage, puis vérifier
# Si non exécuté depuis une semaine, lancer la tâche

7 25 cron.weekly nice run-parts /etc/cron.weekly

# Exécuter les tâches dans /etc/cron.monthly mensuellement
# Attendre 45 minutes après le démarrage, puis vérifier
# Si non exécuté depuis un mois, lancer la tâche

@monthly 45 cron.monthly nice run-parts /etc/cron.monthly
```

### Déconstruction d'un exemple anacron

Analysons la première ligne du fichier anacrontab :

```
1 5 cron.daily nice run-parts /etc/cron.daily
```

- **1** : Période de 1 jour. Anacron vérifiera si la tâche a été exécutée dans les dernières 24 heures.
- **5** : Délai de 5 minutes. Après le démarrage de la machine, anacron attendra 5 minutes avant d'exécuter cette tâche.
- **cron.daily** : Identifiant unique pour cette tâche. Le fichier d'horodatage correspondant est `/var/spool/anacron/cron.daily`.
- **nice run-parts /etc/cron.daily** : La commande à exécuter. Elle lance tous les scripts se trouvant dans le répertoire `/etc/cron.daily` avec une priorité réduite (nice).

### Contraintes d'exécution d'anacron

Bien que anacron soit flexible, certaines contraintes s'appliquent par défaut :[1]

1. **Plage horaire restreinte** : Par défaut, anacron ne peut exécuter ses tâches que **de 3h à 22h** (ou 23h selon la configuration).

2. **Délai aléatoire entre tâches** : Lorsque le premier travail est en cours d'exécution, les tâches suivantes subissent un délai aléatoire de **0 à 45 minutes** pour éviter une surcharge système.

3. **Vérification du fichier de lock** : Pour éviter l'exécution simultanée de la même tâche, anacron utilise des fichiers de verrous.

### Fichiers d'horodatage d'anacron

Les fichiers d'horodatage sont stockés dans `/var/spool/anacron/` :[1][4]

```bash
ls -la /var/spool/anacron/
```

Exemple de sortie :

```
-rw------- 1 root root 19 Dec  3 09:15 cron.daily
-rw------- 1 root root 19 Nov 26 08:30 cron.weekly
-rw------- 1 root root 19 Oct 31 10:45 cron.monthly
```

Chaque fichier contient simplement la date de la dernière exécution :

```bash
cat /var/spool/anacron/cron.daily
```

Exemple de contenu :

```
20251203
```

Cela signifie que la tâche `cron.daily` a été exécutée le 3 décembre 2025.

### Options de ligne de commande pour anacron

Anacron peut être utilisé directement avec plusieurs options :[3]

| Option | Description |
|--------|-------------|
| `-f` | Force l'exécution immédiate des tâches, en ignorant les fichiers d'horodatage |
| `-u` | Met à jour la date courante dans les fichiers d'horodatage, mais ne lance rien |
| `-s` | Met en série l'exécution des tâches (une seule à la fois) |
| `-n` | Ignore le délai spécifié et exécute les tâches immédiatement |

Exemples d'utilisation :

```bash
# Forcer l'exécution de toutes les tâches anacron maintenant
anacron -f

# Mettre à jour les timestamps sans exécuter les tâches
anacron -u

# Exécuter les tâches en série (une à la fois)
anacron -s

# Ignorer les délais et exécuter immédiatement
anacron -n
```

### Cas pratique : Sauvegarde avec anacron

Voici un exemple pratique de configuration anacron pour une sauvegarde sur un ordinateur portable :

```
# /etc/anacrontab - Configuration pour ordinateur portable

# Sauvegarde quotidienne - Attendre 10 minutes après le démarrage
1 10 backup.daily /usr/local/bin/backup-daily.sh

# Nettoyage des fichiers temporaires - Attendre 20 minutes
7 20 cleanup.weekly /usr/local/bin/cleanup-temp.sh

# Synchronisation avec le serveur distant - Attendre 30 minutes
14 30 sync.monthly /usr/local/bin/sync-remote.sh
```

Script de sauvegarde correspondant :

```bash
#!/bin/bash
# Script: backup-daily.sh
# Description: Sauvegarde quotidienne pour ordinateur portable
# Scheduled: Anacron, quotidien, 10 minutes après démarrage

BACKUP_DIR="$HOME/.backups"
IMPORTANT_DIRS=("$HOME/Documents" "$HOME/Projets" "$HOME/Photos")
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.tar.gz"
LOG_FILE="$BACKUP_DIR/backup.log"

# Créer le répertoire de sauvegarde s'il n'existe pas
mkdir -p "$BACKUP_DIR"

echo "[$(date)] === Début de la sauvegarde ===" >> "$LOG_FILE"

# Sauvegarde des répertoires importants
for DIR in "${IMPORTANT_DIRS[@]}"; do
    if [ -d "$DIR" ]; then
        echo "[$(date)] Sauvegarde de $DIR..." >> "$LOG_FILE"
        tar -czf "$BACKUP_DIR/backup_$(basename $DIR)_$DATE.tar.gz" "$DIR" 2>> "$LOG_FILE"
    fi
done

echo "[$(date)] Sauvegarde complétée" >> "$LOG_FILE"

# Supprimer les sauvegardes de plus de 7 jours
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
```

---

## Relations entre Cron et Anacron 🔗

### Configuration par défaut sur les systèmes Linux

Sur la plupart des distributions Linux modernes, cron et anacron travaillent ensemble de façon harmonieuse.[4] En regardant les fichiers `/etc/crontab` et `/etc/anacrontab`, on découvre que :

- **Si anacron est installé**, il est configuré par défaut pour exécuter les tâches quotidiennes, hebdomadaires et mensuelles présentes dans les répertoires `/etc/cron.daily`, `/etc/cron.weekly` et `/etc/cron.monthly`.
- **Si anacron n'est pas installé**, cron exécute ces mêmes tâches directement.

Cela signifie qu'anacron remplace partiellement cron pour les tâches récurrentes simples.

### Intégration dans `/etc/cron.d/0hourly`

Le fichier `/etc/cron.d/0hourly` est un bon exemple d'intégration :[1]

```
# Run the hourly jobs

SHELL=/bin/bash

PATH=/sbin:/bin:/usr/sbin:/usr/bin

MAILTO=root

01 * * * * root run-parts /etc/cron.hourly
```

Ce fichier est géré directement par cron et exécute toutes les tâches du répertoire `/etc/cron.hourly` à la première minute de chaque heure.

### Vérification du service cron actif

Pour vérifier que les tâches sont bien exécutées par le service approprié :

```bash
journalctl -u crond.service
```

Ou sur les systèmes utilisant systemd :

```bash
systemctl status cron
systemctl status anacron
```

---

## Bonnes pratiques et recommandations 🎯

### Pour cron

1. **Utiliser des chemins absolus** : Toujours spécifier le chemin complet des commandes et scripts pour éviter les erreurs de répertoire de travail.

```
# ❌ Mauvais
0 2 * * * backup.sh

# ✅ Bon
0 2 * * * /usr/local/bin/backup.sh
```

2. **Rediriger les sorties** : Rediriger stdout et stderr vers un fichier pour un débogage plus facile.

```
# ✅ Bonne pratique
0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
```

3. **Tester les scripts** : Toujours tester le script manuellement avant de le planifier.

```bash
/usr/local/bin/backup.sh
# Vérifier les erreurs
echo $?
```

4. **Documenter les tâches** : Ajouter des commentaires expliquant chaque tâche.

```
# Sauvegarde quotidienne à 2h30 du matin
30 2 * * * /usr/local/bin/backup.sh
```

### Pour anacron

1. **Adapter les délais à la machine** : Augmenter les délais si la machine est lente ou surchargée.

```
# Pour une machine puissante
1 5 cron.daily nice run-parts /etc/cron.daily

# Pour une machine lente
1 15 cron.daily nice run-parts /etc/cron.daily
```

2. **Utiliser des délais différents** : Espacer les tâches pour éviter une surcharge.

```
1 5 backup1 /usr/local/bin/backup1.sh
7 30 backup2 /usr/local/bin/backup2.sh
14 55 backup3 /usr/local/bin/backup3.sh
```

3. **Vérifier les logs** : Consulter les logs d'exécution pour s'assurer que les tâches s'exécutent.

```bash
grep anacron /var/log/syslog
tail -f /var/log/cron
```

---

## Matrice de décision : Cron vs Anacron 🗂️

Avant de choisir entre cron et anacron, utiliser cette matrice de décision :

| Situation | Recommandation | Justification |
|-----------|----------------|---------------|
| Serveur fonctionnant 24/7 | **Cron** | Les tâches doivent s'exécuter précisément aux heures prévues |
| Ordinateur portable ou de bureau | **Anacron** | Rattrape les tâches manquées quand l'ordinateur est rallumé |
| Tâche horaire ou minute-précise | **Cron** | Anacron n'offre que la précision journalière |
| Tâche quotidienne/hebdomadaire/mensuelle | **Anacron** | Granularité suffisante et meilleure adaptation aux machines intermittentes |
| Machine qui s'éteint régulièrement | **Anacron** | Garantit l'exécution même si la machine était éteinte |
| Plusieurs tâches à exécuter la même minute | **Cron** | Plus de flexibilité et contrôle |
| Environnement d'hébergement partagé | **Cron** | Meilleure isolation entre utilisateurs |
| Script de maintenance système critique | **Anacron** | Exécution garantie au moins une fois par jour |

---

## Concepts avancés et optimisations ⚡

### Nice et priorités d'exécution

Dans les exemples anacron, on remarque l'utilisation de la commande `nice`. Cette commande ajuste la priorité d'exécution d'un processus :[1]

```bash
nice -n 19 /usr/local/bin/heavy-backup.sh
```

- `-n 19` : Priorité la plus basse (tâche exécutée quand le système n'a rien d'autre à faire)
- `-n 0` : Priorité normale
- `-n -20` : Priorité la plus haute (réservée à root)

### Exécution limitée en ressources

Pour limiter l'impact d'une tâche cron sur les ressources système :

```bash
# Limiter à 50% de CPU et 500 Mo de RAM
0 2 * * * ionice -c3 /usr/local/bin/limited-backup.sh
```

### Gestion des erreurs dans les tâches

Les sorties d'erreur et les statuts de sortie sont cruciaux pour le débogage :

```bash
#!/bin/bash
# Script avec gestion d'erreur

set -e  # Sortir en cas d'erreur

exec 1>/var/log/backup.log
exec 2>&1

echo "Début de la sauvegarde : $(date)"

if ! tar -czf /backup/data.tar.gz /home/data; then
    echo "ERREUR: Échec de la sauvegarde"
    exit 1
fi

echo "Sauvegarde complétée avec succès : $(date)"
```

### Stockage des résultats dans des bases de données

Pour une meilleure traçabilité, enregistrer les résultats dans une base de données :

```bash
#!/bin/bash
# Script avec enregistrement en base de données

TASK_NAME="backup"
START_TIME=$(date +%s)
STATUS="STARTED"

# Effectuer la tâche
if /usr/local/bin/backup.sh; then
    STATUS="SUCCESS"
    DURATION=$(($(date +%s) - START_TIME))
else
    STATUS="FAILED"
    DURATION=$(($(date +%s) - START_TIME))
fi

# Enregistrer dans la base de données (exemple avec sqlite3)
sqlite3 /var/db/tasks.db <<EOF
INSERT INTO task_log (task_name, status, duration, timestamp)
VALUES ('$TASK_NAME', '$STATUS', $DURATION, datetime('now'));
EOF
```

---

## Dépannage et diagnostique 🔧

### Cron ne s'exécute pas

1. **Vérifier si le service est en cours d'exécution :**

```bash
systemctl status cron
# ou
systemctl status crond
```

2. **Vérifier la syntaxe de la crontab :**

```bash
crontab -l  # Afficher la crontab actuelle
```

3. **Consulter les logs :**

```bash
journalctl -u cron -n 50
tail -f /var/log/cron
```

### Anacron ne s'exécute pas

1. **Vérifier le timer systemd :**

```bash
systemctl status anacron.timer
systemctl list-timers --all | grep anacron
```

2. **Forcer l'exécution pour tester :**

```bash
anacron -f
```

3. **Consulter les fichiers d'horodatage :**

```bash
ls -la /var/spool/anacron/
cat /var/spool/anacron/cron.daily
```

### Emails de cron manquants

Si cron n'envoie pas les emails de sortie :

1. **Vérifier la variable MAILTO :**

```bash
grep MAILTO /etc/crontab
crontab -l | grep MAILTO
```

2. **Installer postfix ou sendmail :**

```bash
apt install postfix
# ou
yum install postfix
```

3. **Rediriger manuellement :**

```
0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
```

---

## Conclusion et cheminement d'apprentissage 📚

### Progression recommandée

La maîtrise de cron et anacron suit un cheminement logique :

1. **Étape 1 : Comprendre les bases de cron** - Apprendre la syntaxe simple et les cas d'usage courants. Pratiquer avec des tâches simples comme l'affichage de l'heure ou la création de fichiers de test.

2. **Étape 2 : Créer des scripts exécutables** - Développer des scripts bash testables en ligne de commande avant de les ajouter à cron.

3. **Étape 3 : Intégrer des tâches à cron** - Planifier les scripts créés avec des fréquences variables et vérifier l'exécution via les logs.

4. **Étape 4 : Découvrir anacron** - Comprendre les limitations de cron et pourquoi anacron offre une solution meilleure pour les machines intermittentes.

5. **Étape 5 : Cas d'usage complexes** - Combiner cron et anacron, gérer les erreurs, implémenter la redondance et la surveillance.

6. **Étape 6 : Optimisation en production** - Appliquer les bonnes pratiques, monitorer l'exécution, et maintenir une documentation précise.

### Compétences acquises

À la fin de ce module, maîtriser :

- ✓ La syntaxe complète de crontab et anacrontab
- ✓ La création et la gestion des fichiers de configuration
- ✓ La différence fondamentale entre cron et anacron
- ✓ Le choix approprié de l'outil selon le contexte
- ✓ La création de scripts robustes et testables
- ✓ La gestion des erreurs et la journalisation
- ✓ Le dépannage et la résolution de problèmes courants
- ✓ L'optimisation des performances et des ressources

### Points clés à retenir

- **Cron** est le démon de base pour les tâches programmées précises sur les systèmes toujours actifs.
- **Anacron** garantit l'exécution des tâches même sur les machines intermittentes.
- Les **fichiers d'horodatage** d'anacron permettent de rattraper les tâches manquées.
- La **syntaxe crontab** utilise cinq ou six champs pour définir le moment d'exécution.
- Les **redirections** (>, >>, 2>&1) sont essentielles pour déboguer les tâches planifiées.
- La **documentation** et les **commentaires** facilitent la maintenance à long terme.

La maîtrise de ces outils est fondamentale pour devenir un administrateur système Linux efficace et capable de gérer l'automatisation complexe dans tous les contextes possibles.
