# Citations
- https://tutoriels.lws.fr/vps/initiation-au-script-bash-linux-avec-exemples
- https://www.datacamp.com/fr/tutorial/how-to-write-bash-script-tutorial
- https://blog.stephane-robert.info/docs/admin-serveurs/linux/shells-linux/bash/
- https://www-inf.telecom-sudparis.eu/COURS/CSC3102/Supports/ci5-processus/ci-processus.pptx.pdf
- https://www.hostinger.com/fr/tutoriels/gerer-processus-linux-ligne-commande
- https://linux.goffinet.org/administration/processus-et-demarrage/processus-linux/
- https://perso.liris.cnrs.fr/pierre-antoine.champin/enseignement/linux/s4.html
- https://serverspace.io/fr/support/help/bash-cheat-sheet/
- https://www.it-connect.fr/cours-tutoriels/administration-systemes/scripting/bash/


# Tokens
- prompt_tokens: 295
- completion_tokens: 6893
- total_tokens: 7188
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.103, 'request_cost': 0.006, 'total_cost': 0.11}


# Content
# 📚 Les Processus sous Linux et Bash - Guide Complet

## Introduction aux Processus 🔄

Un processus est l'exécution d'un programme en cours d'exécution sous Linux[7]. Chaque processus qui s'exécute sur un système Linux est une instance indépendante d'un programme avec son propre contexte d'exécution, ses ressources et son identifiant unique. Comprendre le fonctionnement des processus est fondamental pour administrer un système Linux efficacement, car ils constituent les briques élémentaires de tout ce qui s'exécute sur la machine.

### Identification des Processus

Chaque processus en cours d'exécution sur un système Linux reçoit un numéro unique appelé **PID (Process IDentifier)**[7]. Ce PID permet de référencer, contrôler et monitorer le processus. Au-delà du PID, chaque processus possède également un **PPID (Parent Process IDentifier)**, qui est l'identifiant du processus parent qui l'a créé. Cette relation parent-enfant crée une **hiérarchie de processus** où chaque processus (à l'exception du processus init avec le PID 1) a un processus parent.

Au sein des scripts Bash, plusieurs variables spéciales permettent d'accéder à des informations relatives aux processus[4]:

- **$$** : Représente le PID du processus Bash courant
- **$PPID** : Représente le PID du processus parent du Bash courant

Ces variables permettent au programmeur d'interroger l'environnement de son script et de comprendre sa place dans l'écosystème des processus en cours.

### Variables d'Environnement Essentielles

L'environnement de chaque processus contient plusieurs variables critiques[4]:

- **PS1** : Le prompt par défaut (généralement `$`)
- **PATH** : Liste des répertoires où le système cherche les commandes exécutables, avec les chemins séparés par des deux-points `:`

La commande `env` affiche l'ensemble des variables d'environnement du processus courant[4], ce qui permet de diagnostiquer le contexte d'exécution.

---

## Visualiser les Processus en Temps Réel avec top ⏱️

### Présentation et Utilisation

La commande `top` est un outil interactif qui affiche une liste dynamique et actualisée des processus en cours d'exécution sur le système[5]. Contrairement à d'autres commandes qui fournissent un snapshot statique, `top` rafraîchit continuellement l'affichage, généralement chaque seconde par défaut, permettant d'observer en temps réel la consommation des ressources système.

### Structure de l'Affichage top

Lorsqu'on lance la commande `top`, l'écran se divise en plusieurs sections:

**En-tête du système**: Les premières lignes affichent des informations globales sur le système, notamment:
- L'heure actuelle et le temps d'uptime (temps depuis le dernier redémarrage)
- Le nombre d'utilisateurs connectés
- La charge moyenne du système sur 1, 5 et 15 minutes
- L'utilisation mémoire totale (RAM)
- L'utilisation du swap

**Tableau des processus**: La section principale liste chaque processus avec plusieurs colonnes:
- **PID**: Identifiant du processus
- **USER**: Utilisateur propriétaire du processus
- **PR**: Priorité du processus
- **NI**: Valeur de "nice" (ajustement de priorité)
- **VIRT**: Mémoire virtuelle utilisée
- **RES**: Mémoire physique (RAM) utilisée
- **SHR**: Mémoire partagée
- **S**: État du processus (R=running, S=sleeping, Z=zombie, etc.)
- **%CPU**: Pourcentage d'utilisation CPU
- **%MEM**: Pourcentage d'utilisation mémoire
- **TIME+**: Temps CPU cumulé depuis le démarrage du processus
- **COMMAND**: Nom de la commande/programme

### Commandes Interactives dans top

Lorsque `top` est en cours d'exécution, plusieurs touches permettent de contrôler l'affichage:

- **k**: Tue un processus (demande le PID)
- **r**: Change la priorité d'un processus (nice)
- **h**: Affiche l'aide
- **q**: Quitte top
- **Espace**: Force un rafraîchissement immédiat
- **u**: Filtre les processus par utilisateur
- **M**: Trie les processus par utilisation mémoire
- **P**: Trie les processus par utilisation CPU (défaut)
- **T**: Trie les processus par temps CPU
- **f**: Personnalise les colonnes affichées

### Exemple d'Utilisation

```bash
# Lancer top avec rafraîchissement toutes les 2 secondes
top -d 2

# Lancer top en affichant seulement 10 processus avant de quitter
top -n 1 | head -20

# Lancer top en filtrant les processus d'un utilisateur spécifique
top -u nomutilisateur
```

### Cas d'Usage Pratiques

La commande `top` s'avère particulièrement utile pour:
- **Diagnostiquer les problèmes de performance**: Identifier rapidement quel processus consume le plus de CPU ou de mémoire
- **Monitorer l'activité système en temps réel**: Observer comment les ressources sont distribuées
- **Détecter les fuites mémoire**: Voir si la consommation mémoire d'un processus augmente constamment
- **Identifier les processus zombies**: Les processus à l'état Z qui doivent être nettoyés

---

## Visualiser un Snapshot des Processus avec ps et pstree 📸

### La Commande ps

Contrairement à `top` qui propose une vue dynamique, `ps` (Process Status) fournit un **snapshot statique** des processus à un moment donné[5]. Elle ne s'actualise pas automatiquement et nécessite d'être relancée pour obtenir une nouvelle vue.

### Syntaxe et Options Courantes

```bash
# Afficher tous les processus de l'utilisateur courant
ps

# Afficher tous les processus du système (avec options BSD)
ps aux

# Afficher tous les processus avec leur arborescence parent-enfant
ps ef

# Afficher seulement les processus en cours d'exécution (pas les threads)
ps -e

# Afficher un processus spécifique
ps -p PID
```

### Interprétation de la Sortie ps aux

Lorsqu'on exécute `ps aux`, plusieurs colonnes apparaissent:

| Colonne | Signification |
|---------|---------------|
| USER | Utilisateur propriétaire du processus |
| PID | Identifiant unique du processus |
| %CPU | Pourcentage d'utilisation CPU |
| %MEM | Pourcentage d'utilisation mémoire |
| VSZ | Mémoire virtuelle en kilobytes |
| RSS | Mémoire physique en kilobytes |
| TTY | Terminal associé au processus (? = pas de TTY) |
| STAT | État du processus |
| START | Moment du démarrage du processus |
| TIME | Temps CPU total utilisé |
| COMMAND | Commande qui a lancé le processus |

### États des Processus (Colonne STAT)

- **R**: Processus en cours d'exécution (Running)
- **S**: Processus endormi en attente d'événement (Sleeping)
- **D**: Processus en sommeil non interruptible (Disk I/O)
- **Z**: Processus zombie (terminé mais pas nettoyé)
- **T**: Processus arrêté (stopped)
- **W**: Processus en page sur disque
- **X**: Processus mort
- **<**: Processus avec haute priorité (moins de nice)
- **N**: Processus avec basse priorité (plus de nice)
- **L**: Processus avec pages verrouillées en mémoire
- **s**: Leader de session
- **l**: Multi-threadé

### Exemples d'Utilisation Avancée

```bash
# Rechercher un processus spécifique
ps aux | grep bash

# Afficher les processus avec plus de détails
ps -ef

# Afficher les processus en arborescence
ps -e --forest

# Afficher seulement les PID et commandes
ps -eo pid,cmd

# Afficher les processus triés par utilisation mémoire
ps aux --sort=-%mem | head -10

# Afficher les processus triés par utilisation CPU
ps aux --sort=-%cpu | head -10

# Afficher les threads d'un processus spécifique
ps -eLf | grep PID_CIBLE
```

### La Commande pstree

`pstree` affiche l'**arborescence des processus** de manière visuelle et hiérarchique[6], ce qui facilite la compréhension des relations parent-enfant. C'est particulièrement utile pour comprendre comment les processus sont liés les uns aux autres.

```bash
# Afficher l'arborescence complète des processus
pstree

# Afficher l'arborescence avec les PID
pstree -p

# Afficher l'arborescence pour un utilisateur spécifique
pstree -u nomutilisateur

# Afficher l'arborescence sans compaction des processus identiques
pstree -a

# Afficher l'arborescence à partir d'un processus spécifique
pstree -p PID
```

### Exemple de Sortie pstree

Une sortie typique ressemble à:

```
init─┬─acpid
     ├─cron
     ├─dbus-daemon
     ├─getty
     ├─httpd───┬─httpd
     │         ├─httpd
     │         └─httpd
     ├─sshd
     ├─syslog-ng
     └─systemd-journald
```

Cette représentation graphique montre immédiatement que le processus httpd (serveur web) a trois processus enfants, ce qui est typique pour un serveur multiprocessus.

---

## Envoyer des Signaux aux Processus 📡

### Comprendre les Signaux

Les signaux sont des mécanismes de communication entre processus et le système d'exploitation[5]. Un signal est une notification asynchrone envoyée à un processus pour lui demander d'effectuer une action spécifique. Les signaux permettent de contrôler finement le comportement des processus en cours d'exécution.

### Signaux Linux Essentiels

| Signal | Numéro | Comportement | Usage |
|--------|--------|-------------|-------|
| SIGHUP | 1 | Raccroché (fermeture de terminal) | Redémarrage de certains services |
| SIGINT | 2 | Interruption (Ctrl+C) | Arrêt rapide |
| SIGQUIT | 3 | Quitter avec core dump | Diagnostic |
| SIGKILL | 9 | Tuer le processus (irrésistible) | Arrêt forcé |
| SIGTERM | 15 | Terminer le processus (défaut) | Arrêt gracieux |
| SIGSTOP | 19 | Suspendre le processus | Pause |
| SIGCONT | 18 | Continuer le processus suspendu | Reprise |
| SIGUSR1 | 10 | Signal utilisateur 1 | Défini par l'application |
| SIGUSR2 | 12 | Signal utilisateur 2 | Défini par l'application |

### La Commande kill

La commande `kill` envoie un signal à un processus identifié par son PID:

```bash
# Envoyer SIGTERM (arrêt gracieux) - défaut
kill PID

# Envoyer SIGKILL (arrêt forcé) - irrésistible
kill -9 PID
kill -KILL PID

# Envoyer SIGSTOP (suspendre)
kill -STOP PID

# Envoyer SIGCONT (reprendre)
kill -CONT PID

# Envoyer SIGHUP (redémarrage)
kill -HUP PID

# Envoyer un signal spécifique
kill -TERM PID
kill -15 PID
```

### La Commande killall

`killall` permet d'envoyer un signal à tous les processus d'un nom donné:

```bash
# Terminer tous les processus nommés "firefox"
killall firefox

# Forcer l'arrêt de tous les processus "bash"
killall -9 bash

# Afficher quels processus seraient tués sans les tuer vraiment
killall -i bash
```

### La Commande pkill

`pkill` combine les fonctionnalités de `ps` et `kill` en permettant de chercher les processus par pattern et de leur envoyer un signal:

```bash
# Terminer tous les processus contenant "apache" dans leur commande
pkill apache

# Forcer l'arrêt de tous les processus d'un utilisateur spécifique
pkill -u nomutilisateur

# Terminer tous les processus dont le nom commence par "python"
pkill ^python

# Terminer les processus créés avant une certaine durée
pkill -f "processus_ancien"
```

### Script Exemple: Monitoring et Contrôle de Processus

```bash
#!/bin/bash

# Script pour monitorer un processus et le redémarrer s'il s'arrête

PROCESS_NAME="mon_application"
CHECK_INTERVAL=5

while true; do
    # Vérifier si le processus existe
    if ! pgrep -f "$PROCESS_NAME" > /dev/null; then
        echo "Processus $PROCESS_NAME arrêté, relance..."
        /chemin/vers/$PROCESS_NAME &
        sleep 2
    fi
    
    # Attendre avant le prochain check
    sleep $CHECK_INTERVAL
done
```

---

## Exécuter des Processus en Arrière Plan ⚙️

### Concepts Fondamentaux

En Linux, chaque commande exécutée peut s'exécuter soit au **premier plan (foreground)** soit en **arrière-plan (background)**. Lorsqu'une commande s'exécute au premier plan, elle monopolise le terminal et l'utilisateur doit attendre sa complètion. En arrière-plan, le processus s'exécute indépendamment, permettant à l'utilisateur de continuer à utiliser le terminal.

### Lancer un Processus en Arrière-Plan

Pour exécuter une commande en arrière-plan, il suffit d'ajouter un `&` à la fin de la commande:

```bash
# Lancer une commande en arrière-plan
./mon_script.sh &

# Lancer plusieurs commandes en arrière-plan
backup_database.sh &
clean_logs.sh &
generate_reports.sh &

# Lancer avec redirection d'output
./application.sh > output.log 2>&1 &
```

Après avoir lancé une commande en arrière-plan, le shell affiche un **numéro de travail (job number)** entre crochets et le **PID** du processus.

### Gestion des Travaux avec jobs

La commande `jobs` affiche la liste de tous les travaux lancés depuis le shell courant:

```bash
# Afficher tous les travaux
jobs

# Afficher les travaux avec leurs PID
jobs -l

# Afficher seulement les travaux en cours d'exécution
jobs -r

# Afficher seulement les travaux arrêtés
jobs -s
```

La sortie de `jobs` ressemble à:

```
[1]   Running                 ./backup.sh &
[2]-  Running                 ./monitoring.sh &
[3]+  Stopped                 tail -f /var/log/syslog
```

Les symboles `+` et `-` indiquent les travaux par défaut (le `+` est le plus récent).

### Suspendre et Reprendre les Processus

- **Ctrl+Z**: Suspend le processus au premier plan (l'envoit en arrière-plan avec l'état Stopped)
- **fg**: Ramène un travail d'arrière-plan au premier plan
- **bg**: Continue l'exécution d'un travail suspendu en arrière-plan

```bash
# Supposons qu'on a lancé: tail -f /var/log/syslog
# Appuyer sur Ctrl+Z pour le suspendre

# Afficher les travaux
jobs

# Reprendre en arrière-plan
bg

# Ou ramener au premier plan
fg
```

### Contrôle Avancé des Processus

```bash
# Ramener le travail numéro 1 au premier plan
fg %1

# Continuer le travail numéro 2 en arrière-plan
bg %2

# Ramener le dernier travail suspendu au premier plan
fg

# Continuer le dernier travail en arrière-plan
bg
```

### Script Exemple: Orchestration de Tâches en Arrière-Plan

```bash
#!/bin/bash

# Script pour exécuter plusieurs tâches en parallèle en arrière-plan

echo "Démarrage des tâches..."

# Lancer les tâches en arrière-plan
long_task_1.sh > /tmp/task1.log 2>&1 &
PID_1=$!

long_task_2.sh > /tmp/task2.log 2>&1 &
PID_2=$!

long_task_3.sh > /tmp/task3.log 2>&1 &
PID_3=$!

echo "Tâche 1 (PID: $PID_1)"
echo "Tâche 2 (PID: $PID_2)"
echo "Tâche 3 (PID: $PID_3)"

# Attendre que toutes les tâches se terminent
wait $PID_1 $PID_2 $PID_3

echo "Toutes les tâches sont complétées!"

# Vérifier les codes de sortie
if [ $? -eq 0 ]; then
    echo "Succès!"
else
    echo "Une tâche a échoué!"
fi
```

### Utilisation de nohup pour la Persistance

Lorsqu'on ferme la session terminal, tous les processus enfants reçoivent un signal SIGHUP. Pour éviter cela, on utilise `nohup`:

```bash
# Exécuter une commande qui survivra à la fermeture du terminal
nohup ./longue_application.sh > output.log 2>&1 &

# Détacher un processus du terminal courant avec disown
./application.sh &
disown
```

---

## Les Daemons ou Services 🖥️

### Définition et Caractéristiques

Un **daemon** (ou **service**) est un processus qui s'exécute en arrière-plan de manière continue, sans interaction directe avec l'utilisateur. Les daemons fournissent des services aux autres processus et sont essentiels au fonctionnement du système. Contrairement aux processus normaux, les daemons n'ont généralement pas de terminal associé et continuent à s'exécuter même quand aucun utilisateur n'est connecté.

### Caractéristiques des Daemons

- **Pas de terminal associé**: Les daemons s'exécutent sans TTY (terminal)
- **Exécution en arrière-plan**: Ils ne bloquent pas le shell
- **Longue durée de vie**: Ils restent actifs jusqu'à l'arrêt du système ou leur arrêt explicite
- **Processus orphelin au démarrage**: Les daemons sont généralement reparentés au processus init (PID 1)
- **Redirection des I/O**: Les entrées/sorties sont généralement redirigées vers `/dev/null` ou des fichiers journaux

### Identification des Daemons

En examinant la sortie de `ps`, les daemons se reconnaissent par:

```bash
# Les daemons n'ont pas de TTY associé (colonne TTY = ?)
ps aux | grep ?
```

Des exemples courants de daemons:

- **sshd**: Daemon SSH pour l'accès distant
- **httpd** ou **apache2**: Serveur web
- **mysqld**: Serveur de base de données MySQL
- **cron**: Planificateur de tâches
- **syslog-ng**: Collecteur de logs
- **ntpd**: Synchronisation de l'heure

### Démarrage et Arrêt des Services

Sous les systèmes modernes utilisant **systemd**:

```bash
# Démarrer un service
systemctl start nom_service

# Arrêter un service
systemctl stop nom_service

# Redémarrer un service
systemctl restart nom_service

# Rechcharger la configuration sans redémarrer
systemctl reload nom_service

# Activer un service au démarrage
systemctl enable nom_service

# Désactiver un service au démarrage
systemctl disable nom_service

# Afficher l'état d'un service
systemctl status nom_service
```

### Création d'un Service Personnalisé

Pour créer un daemon personnalisé, il faut d'abord créer le **unit file** systemd:

```bash
# Créer le fichier de service
sudo nano /etc/systemd/system/mon_service.service
```

Contenu typique d'un unit file:

```ini
[Unit]
Description=Mon Service Personnalisé
After=network.target

[Service]
Type=simple
User=nomutilisateur
WorkingDirectory=/chemin/vers/application
ExecStart=/chemin/vers/mon_application
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Ensuite, recharger les configurations et démarrer le service:

```bash
# Recharger la configuration systemd
sudo systemctl daemon-reload

# Démarrer le service
sudo systemctl start mon_service

# Vérifier l'état
sudo systemctl status mon_service
```

### Script Bash pour Créer un Daemon Basique

```bash
#!/bin/bash

# Script daemon simple avec logging

LOGFILE="/var/log/mon_daemon.log"
PIDFILE="/var/run/mon_daemon.pid"

# Fonction pour loguer les événements
log_event() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOGFILE"
}

# Vérifier si déjà en cours d'exécution
if [ -f "$PIDFILE" ]; then
    PID=$(cat "$PIDFILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "Le daemon est déjà en cours d'exécution (PID: $PID)"
        exit 1
    fi
fi

# Démarrer le daemon en arrière-plan
(
    # Écrire le PID
    echo $$ > "$PIDFILE"
    
    log_event "Daemon démarré"
    
    # Boucle principale
    while true; do
        log_event "Exécution du travail périodique"
        
        # Effectuer le travail ici
        # ...
        
        # Attendre avant le prochain cycle
        sleep 60
    done
) &

echo "Daemon lancé avec PID: $!"
```

### Gestion des Logs pour les Daemons

Les daemons génèrent généralement des logs. La gestion appropriée est cruciale:

```bash
# Vérifier les logs d'un service
journalctl -u nom_service

# Afficher les 50 dernières lignes
journalctl -u nom_service -n 50

# Afficher les logs en temps réel
journalctl -u nom_service -f

# Afficher les logs depuis une heure
journalctl -u nom_service --since "1 hour ago"
```

---

## Relation Processus-Parent et Hiérarchie 🌳

### L'Arborescence des Processus

Chaque processus Linux (sauf init avec PID 1) possède exactement un processus parent. Cette relation crée une **hiérarchie d'arborescence** où le processus init est à la racine. Comprendre cette hiérarchie est essentiel pour gérer les processus efficacement.

### Visualiser l'Arborescence

```bash
# Afficher l'arborescence complète avec pstree
pstree

# Afficher l'arborescence avec les PID
pstree -p

# Afficher l'arborescence d'un utilisateur spécifique
pstree -u nomutilisateur

# Afficher l'arborescence à partir d'un processus spécifique
pstree -p PID
```

### Reparentage Automatique

Lorsqu'un processus parent se termine avant ses enfants, le système d'exploitation orpheline ces processus. Sous Linux, les processus orphelins sont automatiquement reparentés au processus init (PID 1), ce qui garantit qu'ils peuvent être monitorer et contrôler.

### Script Exemple: Analyse de la Hiérarchie des Processus

```bash
#!/bin/bash

# Script pour analyser les processus enfants d'un processus parent

if [ -z "$1" ]; then
    echo "Usage: $0 <PID>"
    exit 1
fi

PARENT_PID=$1

echo "Processus parent: PID $PARENT_PID"
echo ""

# Afficher le processus parent
ps -p $PARENT_PID

echo ""
echo "Processus enfants directs:"

# Utiliser ps pour trouver les enfants
ps --ppid $PARENT_PID

echo ""
echo "Toute l'arborescence:"

# Utiliser pstree
pstree -p $PARENT_PID
```

---

## Commandes de Diagnostic Avancé 🔍

### Utilisation Combinée de ps, top et pstree

Pour un diagnostic complet des processus:

```bash
# 1. Identifier les processus consommant le plus de ressources
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10

# 2. Vérifier la hiérarchie d'un processus spécifique
pstree -p NOM_PROCESSUS

# 3. Monitorer les changements en temps réel
top -p PID1,PID2,PID3

# 4. Chercher un processus spécifique et obtenir tous les détails
ps -ef | grep processus_cible
ps -p PID -o pid,ppid,cmd,etime,user
```

### Recherche Avancée avec grep et awk

```bash
# Trouver tous les processus d'un utilisateur spécifique consommant plus de 10% CPU
ps aux | awk '$1=="nomutilisateur" && $3>10'

# Trouver tous les processus qui utilisent plus de 50MB de RAM
ps aux | awk '$6>50000'

# Afficher les informations structurées d'un processus
ps -p PID -o pid,ppid,cmd,vsz,rss,etime,%cpu,%mem
```

---

## Concepts de Priorité et Nice 🎯

### Comprendre les Priorités

Chaque processus a une **priorité** qui détermine la fréquence à laquelle le CPU l'exécute. Les processus avec une priorité plus élevée reçoivent plus de temps CPU.

### Valeur de Nice

La valeur de **nice** est utilisée pour ajuster la priorité:
- Valeur de nice de **-20** = priorité très haute (seulement root)
- Valeur de nice de **0** = priorité standard (défaut)
- Valeur de nice de **+19** = priorité très basse

### Modifier la Priorité

```bash
# Lancer un processus avec une valeur de nice spécifique
nice -n 10 ./mon_application.sh

# Lancer avec priorité haute (seulement root)
nice -n -5 ./important_task.sh

# Modifier la priorité d'un processus existant
renice +5 -p PID
renice -10 -p PID

# Modifier la priorité pour tous les processus d'un utilisateur
renice +5 -u nomutilisateur
```

---

## Conclusion: Chemin d'Apprentissage Proposé 🎓

Pour maîtriser la gestion des processus sous Linux, le chemin d'apprentissage recommandé est:

**Phase 1 - Fondamentaux** (1-2 semaines)
Commencer par comprendre les concepts de base: PIDs, PPIDs, et la hiérarchie des processus. Utiliser `ps` pour examiner les processus existants et comprendre les colonnes de sortie. Pratiquer avec `pstree` pour visualiser les relations parent-enfant.

**Phase 2 - Monitoring** (2-3 semaines)
Maitriser `top` pour l'observation en temps réel des ressources. Apprendre à identifier les processus problématiques et comprendre l'utilisation CPU/mémoire. Pratiquer la filtration et le tri des processus.

**Phase 3 - Contrôle** (2-3 semaines)
Apprendre à envoyer des signaux avec `kill`, `killall` et `pkill`. Comprendre les différents signaux (SIGTERM, SIGKILL, etc.) et leurs utilisations appropriées. Pratiquer l'arrêt gracieux vs forcé des processus.

**Phase 4 - Exécution en Arrière-Plan** (1-2 semaines)
Maitriser le lancement de processus en arrière-plan avec `&`. Apprendre à utiliser `jobs`, `fg` et `bg` pour contrôler les travaux. Pratiquer l'orchestration de multiples tâches parallèles.

**Phase 5 - Services et Daemons** (2-3 semaines)
Comprendre le concept de daemon et ses caractéristiques. Utiliser `systemctl` pour gérer les services. Créer des services personnalisés avec les unit files systemd. Apprendre la gestion des logs avec `journalctl`.

**Phase 6 - Scripting et Automatisation** (3-4 semaines)
Combiner toutes les connaissances pour créer des scripts bash sophistiqués de monitoring et de contrôle de processus. Utiliser les variables spéciales `$$` et `$PPID`. Créer des systèmes de watchdog qui relancent les processus défaillants. Implémenter la gestion des signaux dans les scripts.

Cette progression crée une base solide passant du plus simple (observation) au plus complexe (création et gestion de services personnalisés), permettant au praticien de progresser graduellement en maîtrisant chaque aspect des processus Linux avant d'aborder le suivant.
