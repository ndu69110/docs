# Citations
- https://www.hostinger.com/fr/tutoriels/variable-d-environnement-linux
- https://www.digitalocean.com/community/tutorials/how-to-read-and-set-environmental-and-shell-variables-on-linux-fr
- https://www.it-connect.fr/definir-des-variables-denvironnement-sous-linux/
- http://doc.ubuntu-fr.org/variables_d_environnement
- https://www.youtube.com/watch?v=NiVdWplY7Xo
- https://labex.io/fr/tutorials/linux-how-to-make-environment-variables-persistent-in-linux-409875
- https://blog.stephane-robert.info/docs/admin-serveurs/linux/shells-linux/bash/
- https://buzut.net/maitriser-les-variables-d-environnement/


# Tokens
- prompt_tokens: 264
- completion_tokens: 7158
- total_tokens: 7422
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.107, 'request_cost': 0.006, 'total_cost': 0.114}


# Content
# 📚 Chapitre 11 : Modifier son environnement sous Linux et Bash

## Introduction aux variables d'environnement

Les variables d'environnement constituent un élément fondamental de tout système Linux. Elles agissent comme des conteneurs d'informations globales accessibles à l'ensemble des programmes et processus exécutés sur le système. Ces variables influencent directement le comportement des logiciels et des commandes shell, en fournissant des paramètres de configuration essentiels.[1]

Une variable d'environnement peut être définie comme une paire clé-valeur où la clé est le nom de la variable (toujours en majuscules par convention) et la valeur est le contenu qu'elle renferme. Contrairement aux variables shell ordinaires qui ne sont accessibles que dans le shell actuel, les variables d'environnement se propagent aux processus enfants générés par le shell parent.[2]

### Distinction entre variables shell et variables d'environnement

La différenciation entre ces deux types de variables représente un point d'apprentissage critique. Une variable shell locale, créée sans la commande `export`, reste confinée au shell actuel et n'est pas transmise aux sous-processus. En revanche, une variable d'environnement, créée avec la commande `export`, est héritée par tous les processus enfants lancés depuis ce shell.[2]

Pour illustrer cette distinction, considérer l'exemple suivant :

```bash
# Création d'une variable shell locale
TEST_VAR="Hello World"

# Tentative d'accès dans un sous-shell
bash
echo $TEST_VAR
# Résultat : vide (la variable n'est pas accessible)
exit

# Création d'une variable d'environnement
export TEST_VAR="Hello World"

# Accès dans un sous-shell
bash
echo $TEST_VAR
# Résultat : Hello World (la variable est accessible)
exit
```

Cette distinction fondamentale détermine la portée et la disponibilité des variables lors de l'exécution des scripts et des commandes.

### Utilité pratique des variables d'environnement

Les variables d'environnement servent plusieurs objectifs critiques dans un environnement Linux :

**Configuration système** : Des variables comme `PATH` définissent où le système recherche les exécutables, tandis que `HOME` indique le répertoire personnel de l'utilisateur.

**Configuration applicative** : De nombreux logiciels consulte des variables d'environnement pour adapter leur comportement, notamment les chemins de base de données, les clés d'API, ou les niveaux de journalisation.

**Environnement de shell** : Des variables comme `SHELL`, `TERM`, et `PS1` définissent le type de shell, le type de terminal émulé, et l'apparence du prompt.

**Héritage de processus** : Les processus enfants héritent automatiquement des variables d'environnement du processus parent, permettant une transmission hiérarchique de la configuration.[2]

## Définition temporaire versus définition permanente

Une distinction essentielle doit être établie entre les modifications temporaires et permanentes des variables d'environnement.

### Modifications temporaires

L'utilisation de la commande `export` dans le terminal produit une modification qui persiste uniquement pour la session shell actuelle. Cette approche convient pour les tests ou les configurations ponctuelles.[1]

```bash
# Définition temporaire d'une variable
export MY_VAR="valeur_temporaire"

# Vérification
echo $MY_VAR
# Résultat : valeur_temporaire

# Après redémarrage du système ou fermeture du terminal, la variable disparaît
```

### Modifications permanentes

Pour que les variables d'environnement persistent après le redémarrage du système ou la fermeture du terminal, elles doivent être écrites dans les fichiers de configuration du shell. Cette approche garantit que la configuration est chargée automatiquement à chaque nouvelle session.[1]

## Les fichiers d'environnement

La gestion de l'environnement sous Linux passe obligatoirement par la compréhension des fichiers de configuration du shell. Plusieurs fichiers interviennent à différents niveaux de priorité et de portée.

### Architecture générale des fichiers d'environnement

L'ordre de chargement des fichiers de configuration suit une hiérarchie précise qui détermine quelles variables sont définies et dans quel contexte. Cette hiérarchie varie selon que le shell est un shell de connexion (login shell) ou un shell interactif ordinaire.[2]

### Le fichier ~/.bashrc

Le fichier `~/.bashrc` est le fichier de configuration utilisateur le plus couramment modifié pour définir des variables d'environnement persistantes au niveau de l'utilisateur actuel. Ce fichier est exécuté automatiquement chaque fois qu'un shell bash interactif non-login est lancé.[1][2]

**Syntaxe et édition du fichier ~/.bashrc**

```bash
# Ouverture du fichier avec nano
sudo nano ~/.bashrc

# Ou avec l'utilisateur courant (sans sudo)
nano ~/.bashrc
```

À l'intérieur du fichier, les variables doivent être définies avec la syntaxe `export` :

```bash
# Exemple de variables dans ~/.bashrc
export MY_PROJECT="/home/utilisateur/mon_projet"
export API_KEY="123456789"
export LOG_LEVEL="debug"
export DATABASE_URL="https://example.tld/database"
```

**Sauvegarde et activation des modifications**

Après modification du fichier avec nano ou vi :

1. Appuyer sur `Ctrl+X`, `Y`, puis `Entrée` pour nano
2. Appuyer sur `Échap`, `:wq`, puis `Entrée` pour vi

Pour appliquer immédiatement les modifications à la session shell actuelle sans la fermer :

```bash
source ~/.bashrc
```

La prochaine fois qu'un shell bash interactif est lancé, les variables définies dans `~/.bashrc` sont automatiquement chargées.[1][2]

### Le fichier ~/.profile

Le fichier `~/.profile` s'exécute lors de la connexion à un shell de connexion (login shell) et avant que `~/.bashrc` soit lu. Contrairement à `~/.bashrc` qui cible les shells interactifs, `~/.profile` est utilisé pour configurer l'environnement global de connexion.[1]

Ce fichier est particulièrement utile pour définir des variables qui doivent être disponibles dans tous les shells de connexion, y compris les shells non-bash comme `sh` ou `ksh`.

```bash
# Édition de ~/.profile
nano ~/.profile

# Ajout de variables
export JAVA_HOME="/usr/lib/jvm/java-11-openjdk"
export CLASSPATH="$CLASSPATH:$JAVA_HOME/lib"
```

### Le fichier /etc/environment

Le fichier `/etc/environment` définit les variables d'environnement au niveau du système entier, applicables à tous les utilisateurs. Contrairement à `~/.bashrc` ou `~/.profile`, ce fichier est lu par le système lors du processus de démarrage, avant même que les shells utilisateur ne soient initialisés.[1]

**Importante remarque syntaxique** : Le fichier `/etc/environment` utilise une syntaxe légèrement différente - les variables ne doivent pas être précédées du mot-clé `export`[1] :

```bash
# Édition de /etc/environment
sudo nano /etc/environment

# Syntaxe correcte (sans export)
JAVA_HOME="/usr/lib/jvm/java-11-openjdk"
MY_SYSTEM_VAR="valeur_globale"
DATABASE_HOST="db.example.com"
```

Pour appliquer les modifications à `/etc/environment`, il est nécessaire de se reconnecter ou de redémarrer le système :

```bash
reboot
```

### Le répertoire /etc/profile.d/

Le répertoire `/etc/profile.d/` constitue un mécanisme alternatif élégant pour définir des variables d'environnement au niveau du système. Ce répertoire contient des fichiers shell supplémentaires exécutés lors de la connexion à un shell de connexion.[3]

Cette approche offre plusieurs avantages :
- Meilleure organisation que de modifier directement `/etc/environment`
- Facile à gérer lors de l'installation/désinstallation d'applications
- Chaque application peut maintenir son propre fichier de configuration

**Création d'un fichier de variables personnalisées**

```bash
# Création d'un nouveau fichier dans /etc/profile.d/
sudo nano /etc/profile.d/mon_app.sh

# Contenu du fichier (avec export)
export APP_HOME="/opt/mon_application"
export APP_CONFIG="/etc/mon_application"
export APP_LOG="/var/log/mon_application"
```

Les fichiers dans `/etc/profile.d/` doivent avoir l'extension `.sh` et sont automatiquement exécutés lors d'une nouvelle connexion shell.

### Hiérarchie de chargement des fichiers

L'ordre de chargement des fichiers de configuration suit une séquence précise :

**Pour un shell de connexion (login shell)** :
1. `/etc/profile` (fichier système)
2. Fichiers dans `/etc/profile.d/`
3. `~/.profile` (fichier utilisateur)
4. `~/.bash_profile` (s'il existe)

**Pour un shell interactif ordinaire** :
1. `~/.bashrc` (fichier utilisateur)

**Pour un shell non-interactif** :
1. Variable d'environnement `BASH_ENV` (si définie)

Cette hiérarchie explique pourquoi une variable définie dans `/etc/environment` est disponible globalement, tandis qu'une variable définie dans `~/.bashrc` ne s'applique qu'à l'utilisateur courant dans les shells interactifs.[2]

## Les commandes env et printenv

Ces deux commandes constituent les outils essentiels pour afficher, examiner et manipuler les variables d'environnement dans un terminal Linux.

### La commande printenv

La commande `printenv` affiche toutes les variables d'environnement actuelles ou la valeur d'une variable spécifique.[1]

**Affichage de toutes les variables**

```bash
printenv
```

Cette commande produit une liste exhaustive de toutes les variables d'environnement disponibles dans la session courante :

```
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOME=/home/utilisateur
USER=utilisateur
SHELL=/bin/bash
TERM=xterm-256color
LANG=fr_FR.UTF-8
PWD=/home/utilisateur
LOGNAME=utilisateur
```

**Affichage d'une variable spécifique**

```bash
printenv HOME
# Résultat : /home/utilisateur

printenv PATH
# Résultat : /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

### La commande env

La commande `env` offre plusieurs fonctionnalités complémentaires. Elle peut afficher l'environnement complet, mais elle possède également la capacité unique de modifier l'environnement pour une seule commande sans affecter la session actuelle.[2]

**Affichage de l'environnement complet**

```bash
env
```

Le résultat ressemble fortement à celui de `printenv`, bien que l'ordre et la présentation puissent varier légèrement.

**Modification temporaire de l'environnement pour une seule commande**

```bash
# Exécution d'une commande avec des variables modifiées
env VAR1="valeur1" VAR2="valeur2" command_to_run

# Exemple concret : exécution d'un script avec des variables personnalisées
env API_KEY="secret123" DATABASE_URL="mongodb://localhost" ./mon_script.sh
```

Cette capacité s'avère extrêmement utile pour :
- Tester des scripts avec différentes configurations sans les modifications permanentes
- Surcharger temporairement des variables d'environnement existantes
- Exécuter des commandes dans un environnement isolé

**Redirection et combinaison avec d'autres commandes**

```bash
# Envoyer la sortie de env dans un fichier
env > mon_environnement.txt

# Compter le nombre de variables
env | wc -l

# Chercher une variable spécifique
env | grep JAVA

# Triée les variables alphabétiquement
env | sort
```

### La commande set

La commande `set`, bien que légèrement différente, fournit des informations complémentaires sur l'environnement shell.[2]

```bash
# Affichage de toutes les variables shell et d'environnement
set

# Résultat incluant les variables locales, les fonctions et les options du shell
BASH=/bin/bash
BASHOPTS=checkwinsize:cmdhist:expand_aliases:extglob:extquote:force_fignore:histappend:interactive_comments:login_shell:progcomp:promptvars:sourcepath
BASH_ALIASES=()
BASH_ARGC=()
BASH_ARGV=()
# ... et bien d'autres
```

### La commande echo avec les variables

Pour accéder à la valeur d'une variable et l'afficher, la syntaxe utilise le signe dollar (`$`) :

```bash
# Affichage d'une variable
echo $HOME
# Résultat : /home/utilisateur

echo $USER
# Résultat : utilisateur

# Utilisation dans des chaînes de caractères
echo "Je suis l'utilisateur $USER dans le répertoire $HOME"
# Résultat : Je suis l'utilisateur utilisateur dans le répertoire /home/utilisateur
```

### Tableau comparatif des commandes

| Commande | Affichage de l'environnement | Modification temporaire | Variables locales | Fonctions shell |
|----------|------|-----|----|----|
| `printenv` | ✅ Oui | ❌ Non | ❌ Non | ❌ Non |
| `env` | ✅ Oui | ✅ Oui | ❌ Non | ❌ Non |
| `set` | ✅ Oui | ❌ Non | ✅ Oui | ✅ Oui |
| `echo $VAR` | ✅ Spécifique | ❌ Non | ✅ Oui | ❌ Non |

## Les alias et la variable PS1

### Les alias : définition et utilité

Un alias bash constitue un raccourci personnalisé pour une commande ou une série de commandes. Les alias permettent de simplifier les commandes fréquemment utilisées en remplaçant une longue commande par un mot-clé court et mémorisable.[1]

**Cas d'usage courants des alias** :
- Abréger les commandes longues ou complexes
- Ajouter des options de sécurité aux commandes dangereuses
- Créer des commandes composées personnalisées
- Améliorer la productivité et réduire les erreurs de frappe

### Création temporaire d'alias

La création temporaire d'un alias affecte uniquement la session shell actuelle. Cette approche convient pour les tests ou les expérimentations.

```bash
# Syntaxe de base
alias nom_alias='commande'

# Exemple : alias pour lister les fichiers avec détails
alias ll='ls -lh'

# Exemple : alias pour la navigation
alias ..='cd ..'
alias ...='cd ../..'

# Exemple : alias pour des commandes de suppression sécurisée
alias rm='rm -i'  # demande confirmation avant suppression
alias mv='mv -i'  # demande confirmation en cas de collision

# Utilisation de l'alias
ll
# Exécute en réalité : ls -lh
```

### Affichage des alias existants

```bash
# Affichage de tous les alias
alias

# Résultat possible :
alias ll='ls -l'
alias la='ls -A'
alias l='ls -CF'

# Affichage d'un alias spécifique
alias ll
# Résultat : alias ll='ls -l'
```

### Suppression d'alias

```bash
# Suppression d'un alias pour la session actuelle
unalias nom_alias

# Suppression de tous les alias
unalias -a
```

### Création permanente d'alias

Pour que les alias persistent après la fermeture du terminal, ils doivent être définis dans le fichier `~/.bashrc` :

```bash
# Édition du fichier
nano ~/.bashrc

# Ajout d'alias dans le fichier (généralement à la fin)
alias ll='ls -lh'
alias la='ls -la'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias mkdir='mkdir -pv'
alias mount='mount | column -t'
alias psaux='ps aux | grep'
alias df='df -h'
alias du='du -ch'
alias clear='clear && echo "Écran effacé"'
alias md5='md5sum'
alias sha1='sha1sum'

# Sauvegarde et fermeture
# Ctrl+X, Y, Entrée (pour nano)
```

Après modification, charger les alias immédiatement :

```bash
source ~/.bashrc
```

### Alias complexes avec plusieurs commandes

Les alias peuvent exécuter plusieurs commandes en succession :

```bash
# Alias combinant plusieurs commandes
alias mkedit='mkdir -pv $1 && cd $1'

# Alias pour nettoyer le système
alias cleanup='sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y'

# Alias pour afficher les 10 répertoires les plus volumineux
alias diskusage='du -s */ | sort -rn | head -n 10'

# Alias pour synchroniser l'heure
alias synctime='timedatectl set-ntp true && timedatectl status'
```

**Important** : Pour les alias complexes avec des paramètres, il est préférable de créer une fonction bash plutôt qu'un alias.

### Création de fonctions bash pour les besoins avancés

Lorsque les alias deviennent trop complexes ou nécessitent des paramètres, les fonctions bash offrent une meilleure solution :

```bash
# Définition d'une fonction dans ~/.bashrc
# Fonction pour créer un répertoire et y entrer
mkcd() {
    mkdir -pv "$1"
    cd "$1"
}

# Fonction pour rechercher dans les fichiers
search() {
    grep -r "$1" . --include="*.${2:-*}"
}

# Fonction pour afficher l'utilisation disque formatée
diskspace() {
    du -sh "$1" | sort -rh
}

# Utilisation
mkcd nouveau_projet
search "motif" "txt"
diskspace ~
```

### La variable PS1 : personnalisation du prompt

La variable `PS1` (Prompt String 1) contrôle l'apparence du prompt affiché dans le terminal. Cette variable constitue un outil puissant pour personnaliser l'environnement de travail et améliorer la lisibilité du terminal.

### Comprendre la structure de PS1

Le prompt par défaut dans bash ressemble généralement à :

```
utilisateur@hote:~/repertoire$
```

Cette apparence est contrôlée par la variable `PS1`. La valeur par défaut est souvent :

```bash
\u@\h:\w\$
```

### Codes d'échappement de PS1

Les codes spéciaux dans `PS1` représentent différents éléments du système :

| Code | Signification | Exemple |
|------|-----|---------|
| `\u` | Nom d'utilisateur | `utilisateur` |
| `\h` | Nom d'hôte court | `hote` |
| `\H` | Nom d'hôte complet | `hote.domaine.com` |
| `\w` | Répertoire courant (chemin complet) | `/home/utilisateur/projets` |
| `\W` | Répertoire courant (dossier uniquement) | `projets` |
| `\d` | Date au format "Jou Moi Date" | `Jeu 03 Déc` |
| `\t` | Heure au format HH:MM:SS | `14:32:45` |
| `\T` | Heure au format HH:MM:SS (12h) | `02:32:45` |
| `\@` | Heure au format HH:MM am/pm | `02:32 pm` |
| `\n` | Nouvelle ligne | Saute à la ligne suivante |
| `\$` | `#` si root, sinon `$` | `$` ou `#` |
| `\!` | Numéro de l'historique | `42` |
| `\\` | Barre oblique inverse | `\` |

### Codes de couleur pour PS1

Les codes de couleur utilisent la séquence d'échappement ANSI. Bien que complexes, ils offrent un contrôle complet sur l'apparence visuelle du prompt.

Les codes ANSI basiques utilisent la format `\e[COULEURm` :

```bash
# Codes de couleur simples
\e[30m  # Noir
\e[31m  # Rouge
\e[32m  # Vert
\e[33m  # Jaune
\e[34m  # Bleu
\e[35m  # Magenta
\e[36m  # Cyan
\e[37m  # Blanc
\e[0m   # Réinitialiser à la couleur par défaut

# Modèle combiné
\e[1;33m  # Jaune en gras
\e[1;31m  # Rouge en gras
```

### Exemples de personnalisation de PS1

**Prompt minimaliste et coloré**

```bash
# Édition du fichier
nano ~/.bashrc

# Recherche et modification de PS1
export PS1="\[\e[1;32m\]\u@\h:\[\e[0m\]\w\$ "

# Explication :
# \[\e[1;32m\] : Début de la couleur verte en gras
# \u@\h:        : Utilisateur@hôte:
# \[\e[0m\]     : Réinitialisation des couleurs
# \w\$          : Répertoire courant et symbole $
```

Résultat visuel :
```
utilisateur@hote:~/repertoire$ 
```
(où "utilisateur@hote:" s'affiche en vert)

**Prompt avec horodatage**

```bash
export PS1="\[\e[1;34m\][\t]\[\e[0m\] \[\e[1;32m\]\u@\h:\[\e[0m\]\w\$ "

# Résultat visuel :
[14:32:45] utilisateur@hote:~/repertoire$ 
```

**Prompt multi-ligne**

```bash
export PS1="\[\e[1;32m\]\u@\h\[\e[0m\] \[\e[1;33m\]\w\[\e[0m\]\n\[\e[1;31m\]→\[\e[0m\] "

# Résultat visuel :
utilisateur@hote ~/repertoire
→ 
```

**Prompt avec statut de la dernière commande**

```bash
# Cette version montre le code de statut et change de couleur en cas d'erreur
export PS1="\[\e[1;32m\]\u@\h\[\e[0m\] \[\e[1;34m\]\w\[\e[0m\] \$([ \$? = 0 ] && echo '\[\e[1;32m\]✓' || echo '\[\e[1;31m\]✗')\[\e[0m\] \$ "
```

### Variables PS supplémentaires

Bien que `PS1` soit la plus importante, d'autres variables de prompt existent pour des cas spécifiques :

**PS2 : Prompt de continuation**

Utilisé lorsqu'une commande s'étend sur plusieurs lignes :

```bash
export PS2="\[\e[1;33m\]→\[\e[0m\] "

# Exemple d'utilisation (après avoir saisi une commande incomplète) :
$ echo "ceci est une
> commande longue"
```

**PS3 : Prompt pour la boucle select**

```bash
export PS3="Sélectionnez une option : "

# Utilisation dans un script
select option in "Option 1" "Option 2" "Quitter"
do
    case $option in
        "Option 1") echo "Vous avez choisi 1" ;;
        "Option 2") echo "Vous avez choisi 2" ;;
        "Quitter") break ;;
    esac
done
```

**PS4 : Prompt pour le débogage**

```bash
export PS4="\[\e[1;35m\][DEBUG]\[\e[0m\] "

# Utilisation lors du débogage de scripts :
bash -x mon_script.sh
```

### Sauvegarde des modifications de PS1

Pour rendre permanents les changements de `PS1`, modifier le fichier `~/.bashrc` :

```bash
nano ~/.bashrc

# Localiser la ligne PS1= existante ou ajouter en fin de fichier
export PS1="\[\e[1;32m\]\u@\h:\[\e[0m\]\w\$ "

# Sauvegarder et fermer
source ~/.bashrc
```

### Tableau récapitulatif des éléments de configuration d'environnement

| Élément | Portée | Fichier de configuration | Persistance |
|---------|--------|-----|--------|
| Variables d'environnement utilisateur | Utilisateur actuel | `~/.bashrc` ou `~/.profile` | ✅ Persistant |
| Variables d'environnement système | Tous les utilisateurs | `/etc/environment` ou `/etc/profile.d/` | ✅ Persistant |
| Alias utilisateur | Utilisateur actuel | `~/.bashrc` | ✅ Persistant |
| PS1 (prompt) | Utilisateur actuel | `~/.bashrc` | ✅ Persistant |
| Variables temporaires | Session actuelle | Commande `export` | ❌ Temporaire |
| Alias temporaires | Session actuelle | Commande `alias` | ❌ Temporaire |

## Synthèse pratique : Flux de travail complet

### Scénario 1 : Configuration d'une application personnalisée

Un développeur souhaite configurer une application avec des variables d'environnement personnalisées :

```bash
# 1. Édition de ~/.bashrc pour les variables utilisateur
nano ~/.bashrc

# 2. Ajout des variables (à la fin du fichier)
export APP_HOME="/home/utilisateur/mon_app"
export APP_CONFIG="/home/utilisateur/mon_app/config"
export LOG_LEVEL="debug"
export DATABASE_URL="postgresql://localhost/mydb"

# 3. Ajout d'alias utiles
alias startapp="cd $APP_HOME && npm start"
alias stopapp="pkill -f 'npm start'"
alias applog="tail -f $APP_HOME/logs/app.log"

# 4. Personnalisation du prompt
export PS1="\[\e[1;36m\][APP]\[\e[0m\] \[\e[1;32m\]\u@\h:\[\e[0m\]\w\$ "

# 5. Sauvegarde
source ~/.bashrc

# 6. Vérification
echo $APP_HOME
printenv | grep APP
alias | grep app
```

### Scénario 2 : Configuration système multi-utilisateurs

Un administrateur système configure un serveur pour plusieurs développeurs :

```bash
# 1. Configuration au niveau du système
sudo nano /etc/profile.d/app_config.sh

# 2. Contenu du fichier (version pour tous les utilisateurs)
export COMPANY_PROJECT="/opt/company"
export SHARED_CONFIG="/etc/company/config"
export LOG_DIR="/var/log/company"

# 3. Vérification de la syntaxe
sudo source /etc/profile.d/app_config.sh

# 4. Test pour chaque utilisateur
su - utilisateur1 -c "echo $COMPANY_PROJECT"
su - utilisateur2 -c "echo $COMPANY_PROJECT"
```

### Scénario 3 : Script automatisé de configuration

Un développeur crée un script qui configure automatiquement tout l'environnement :

```bash
#!/bin/bash
# Script : setup_environment.sh

# Couleurs pour l'affichage
RED='\e[1;31m'
GREEN='\e[1;32m'
BLUE='\e[1;34m'
NC='\e[0m'

echo -e "${BLUE}Configuration de l'environnement...${NC}"

# Vérifier que nano ou vi est disponible
if ! command -v nano &> /dev/null; then
    echo -e "${RED}nano n'est pas installé${NC}"
    exit 1
fi

# Chemin du fichier bashrc
BASHRC_FILE="$HOME/.bashrc"

# Variables à ajouter
VARIABLES=(
    'export PROJECT_ROOT="$HOME/projects"'
    'export API_KEY="secretkey123"'
    'export LOG_LEVEL="info"'
)

# Alias à ajouter
ALIASES=(
    'alias ll="ls -lh"'
    'alias la="ls -la"'
    'alias goproject="cd $PROJECT_ROOT"'
)

# Ajouter les variables
echo -e "${BLUE}Ajout des variables...${NC}"
for var in "${VARIABLES[@]}"; do
    if ! grep -q "$var" "$BASHRC_FILE"; then
        echo "$var" >> "$BASHRC_FILE"
        echo -e "${GREEN}✓ Ajout : $var${NC}"
    fi
done

# Ajouter les alias
echo -e "${BLUE}Ajout des alias...${NC}"
for alias in "${ALIASES[@]}"; do
    if ! grep -q "$alias" "$BASHRC_FILE"; then
        echo "$alias" >> "$BASHRC_FILE"
        echo -e "${GREEN}✓ Ajout : $alias${NC}"
    fi
done

# Charger la nouvelle configuration
echo -e "${BLUE}Chargement de la configuration...${NC}"
source "$BASHRC_FILE"

echo -e "${GREEN}Configuration terminée avec succès !${NC}"
echo -e "${BLUE}Variables disponibles :${NC}"
printenv | grep PROJECT
echo -e "${BLUE}Aliases disponibles :${NC}"
alias | grep -E "(ll|la|goproject)"
```

Exécution du script :

```bash
chmod +x setup_environment.sh
./setup_environment.sh
```

## Points clés à retenir

L'apprentissage de la gestion de l'environnement sous Linux et Bash repose sur plusieurs compréhensions fondamentales :

**1. Hiérarchie des modifications** : Les modifications temporaires avec `export` ou `env` ne persistent pas, tandis que les modifications dans les fichiers de configuration (`.bashrc`, `.profile`, `/etc/environment`) sont permanentes.

**2. Propagation aux processus enfants** : Seules les variables d'environnement (créées avec `export`) sont transmises aux sous-processus, pas les variables shell ordinaires.

**3. Ordre de chargement** : Comprendre quand et dans quel ordre les fichiers de configuration sont exécutés détermine le comportement final de l'environnement.

**4. Outils de diagnostic** : Les commandes `printenv`, `env`, et `set` offrent différentes perspectives sur l'environnement et servent à diagnostiquer les problèmes de configuration.

**5. Personnalisation progressive** : Commencer par des modifications simples (alias basiques) avant de progresser vers des configurations plus complexes (fonctions bash, scripts d'automatisation).

**6. Portée et responsabilité** : Distinguer entre la configuration utilisateur (fichiers dans le répertoire home) et la configuration système (fichiers dans `/etc/`) pour éviter les conflits et maintenir une séparation des responsabilités.

La maîtrise de ces concepts permet de créer un environnement de travail efficace, productif et bien organisé sous Linux et Bash.[1][2][3]
