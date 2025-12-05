# Citations
- https://www.it-connect.fr/debuter-script-bash-linux/
- https://linux.goffinet.org/administration/scripts-shell/
- https://www.datacamp.com/fr/tutorial/how-to-write-bash-script-tutorial
- https://www.hostinger.com/fr/tutoriels/script-bash
- https://tutoriels.lws.fr/vps/initiation-au-script-bash-linux-avec-exemples
- https://blog.stephane-robert.info/docs/admin-serveurs/linux/shells-linux/bash/
- http://doc.ubuntu-fr.org/tutoriel/script_shell
- https://www.youtube.com/watch?v=gBCGeLjYBgQ
- https://www.formatux.fr/formatux-bash/module-010-niveau1/index.html


# Tokens
- prompt_tokens: 309
- completion_tokens: 9026
- total_tokens: 9335
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.135, 'request_cost': 0.006, 'total_cost': 0.142}


# Content
# 📘 Guide Complet des Scripts Shell Bash sous Linux

## 🎯 Introduction aux Scripts Shell

Un script shell est un fichier texte contenant une série de commandes qui sont exécutées en séquence par l'interpréteur Bash[1][6]. Ces scripts permettent d'automatiser des tâches répétitives et de consolider plusieurs commandes longues en un seul code exécutable[4]. Bash est facilement disponible sur presque toutes les versions de Linux et ne nécessite aucune installation sépaée[4].

Un script Bash offre une puissance considérable pour les développeurs et administrateurs systèmes. Il réduit les tâches manuelles répétitives en un simple appel de fonction, améliorant ainsi l'efficacité du flux de travail[4].

### Structure Fondamentale d'un Script Bash

Tout script Bash doit débuter par le **shebang**, une ligne spéciale qui indique à Linux quel interpréteur utiliser pour exécuter le code[1][3]. Cette première ligne est cruciale et définit le chemin de l'interpréteur Bash :

```bash
#!/bin/bash
```

Alternativement, une forme plus portable existe :

```bash
#!/usr/bin/env bash
```

Cette seconde approche recherche l'exécutable bash dans le PATH du système, ce qui la rend plus adaptée aux environnements hétérogènes[6].

Après le shebang, le script contient les commandes et les instructions qui forment le corps du programme. Les commentaires peuvent être ajoutés en commençant une ligne par le caractère `#`[1].

### Exécution d'un Script Bash

Pour exécuter un script Bash, deux approches principales existent[5] :

La première méthode consiste à invoquer directement Bash avec le fichier en argument :

```bash
bash First.sh
```

La seconde méthode rend le fichier exécutable en modifiant ses permissions, puis l'exécute directement :

```bash
chmod a+x First.sh
./First.sh
```

La commande `chmod a+x` confère les droits d'exécution à tous les utilisateurs sur le fichier[1]. Sans cette modification, l'exécution directe du script échouerait.

---

## 🔧 Les Développements et les Inhibitions

### Concept de Développement et d'Inhibition

Dans le contexte des scripts Bash, les développements et inhibitions font référence à la façon dont Bash traite et interprète les variables, les commandes et les chaînes de caractères. Ce processus détermine comment les variables sont remplacées par leurs valeurs, comment les commandes de substitution sont exécutées, et comment les caractères spéciaux sont interprétés.

### Inhibition des Caractères Spéciaux

Bash possède plusieurs mécanismes pour inhiber ou empêcher l'interprétation de caractères spéciaux :

**L'échappement avec l'antislash** : Le caractère `\` permet d'échapper un caractère spécial pour empêcher son interprétation :

```bash
#!/bin/bash

# Sans échappement - le dollar est interprété
echo "$USER"  # Affiche le nom d'utilisateur

# Avec échappement - le dollar est littéral
echo "\$USER"  # Affiche littéralement: $USER
```

**Les guillemets simples** : Ils inhibent complètement l'interprétation de tous les caractères spéciaux :

```bash
#!/bin/bash

USER="Jean"
echo 'Bonjour $USER'  # Affiche littéralement: Bonjour $USER
echo "Bonjour $USER"  # Affiche: Bonjour Jean
```

**Les guillemets doubles** : Ils permettent une inhibition partielle, permettant la substitution des variables mais pas celle des commandes :

```bash
#!/bin/bash

fichier="test.txt"
echo "Le fichier est: $fichier"  # Substitution activée
```

### Substitution de Commandes

La substitution de commandes remplace une commande par son résultat :

```bash
#!/bin/bash

# Syntaxe ancienne (backticks)
date_actuelle=`date`

# Syntaxe moderne (préférée)
date_actuelle=$(date)

echo "La date actuelle est: $date_actuelle"
```

---

## 🧪 Tests et Expressions Conditionnelles

### Syntaxe Générale des Tests

Les tests dans Bash évaluent des conditions et retournent un code de sortie : 0 pour vrai, non-zéro pour faux. Les tests utilisant la syntaxe `[ ]` ou `[[ ]]` :

```bash
[ expression ]
[[ expression ]]
```

La syntaxe `[[ ]]` est plus moderne et offre des fonctionnalités supplémentaires, bien que `[ ]` soit plus portable[2].

### Tests sur les Fichiers

Bash offre une variété de tests pour examiner les propriétés des fichiers :

```bash
#!/bin/bash

# Test d'existence de fichier
if [ -e /etc/passwd ]; then
    echo "Le fichier existe"
fi

# Test de fichier régulier
if [ -f /etc/passwd ]; then
    echo "C'est un fichier régulier"
fi

# Test de répertoire
if [ -d /home ]; then
    echo "C'est un répertoire"
fi

# Test de fichier lisible
if [ -r /etc/passwd ]; then
    echo "Le fichier est lisible"
fi

# Test de fichier accessible en écriture
if [ -w test.txt ]; then
    echo "Le fichier est accessible en écriture"
fi

# Test de fichier exécutable
if [ -x /bin/bash ]; then
    echo "Le fichier est exécutable"
fi
```

### Tests sur les Chaînes de Caractères

Les tests sur les chaînes permettent de comparer des textes :

```bash
#!/bin/bash

chaine1="Bonjour"
chaine2="Bonjour"
chaine_vide=""

# Test d'égalité
if [ "$chaine1" = "$chaine2" ]; then
    echo "Les chaînes sont identiques"
fi

# Test d'inégalité
if [ "$chaine1" != "Adieu" ]; then
    echo "Les chaînes sont différentes"
fi

# Test de chaîne vide
if [ -z "$chaine_vide" ]; then
    echo "La chaîne est vide"
fi

# Test de chaîne non vide
if [ -n "$chaine1" ]; then
    echo "La chaîne n'est pas vide"
fi
```

### Tests Numériques

Les tests numériques permettent de comparer des nombres entiers :

```bash
#!/bin/bash

nombre1=10
nombre2=20

# Égalité numérique
if [ "$nombre1" -eq "$nombre2" ]; then
    echo "Les nombres sont égaux"
fi

# Inégalité numérique
if [ "$nombre1" -ne "$nombre2" ]; then
    echo "Les nombres sont différents"
fi

# Inférieur à
if [ "$nombre1" -lt "$nombre2" ]; then
    echo "$nombre1 est inférieur à $nombre2"
fi

# Supérieur à
if [ "$nombre1" -gt "$nombre2" ]; then
    echo "$nombre1 est supérieur à $nombre2"
fi

# Inférieur ou égal à
if [ "$nombre1" -le "$nombre2" ]; then
    echo "$nombre1 est inférieur ou égal à $nombre2"
fi

# Supérieur ou égal à
if [ "$nombre1" -ge "$nombre2" ]; then
    echo "$nombre1 est supérieur ou égal à $nombre2"
fi
```

### Opérateurs Logiques

Les opérateurs logiques permettent de combiner plusieurs expressions :

```bash
#!/bin/bash

age=25
revenu=50000

# Opérateur ET logique
if [ "$age" -gt 18 ] && [ "$revenu" -gt 30000 ]; then
    echo "Éligible pour le crédit"
fi

# Opérateur OU logique
if [ "$age" -lt 18 ] || [ "$age" -gt 65 ]; then
    echo "Catégorie spéciale"
fi

# Négation logique
if [ ! -f /tmp/fichier_inexistant ]; then
    echo "Le fichier n'existe pas"
fi
```

---

## 📥 Obtenir des Données Entrées par l'Utilisateur

### Utilisation de la Commande `read`

La commande `read` permet de capturer des données saisies au clavier par l'utilisateur :

```bash
#!/bin/bash

echo "Quel est votre nom ?"
read nom

echo "Bonjour, $nom !"
```

### Lecture Avec Invite

L'option `-p` permet d'afficher une invite directement :

```bash
#!/bin/bash

read -p "Entrez votre nom: " nom
read -p "Entrez votre âge: " age

echo "Vous vous appelez $nom et vous avez $age ans"
```

### Lecture de Multiples Variables

Une seule ligne de `read` peut capturer plusieurs variables :

```bash
#!/bin/bash

read -p "Entrez votre prénom et votre nom: " prenom nom

echo "Prénom: $prenom"
echo "Nom: $nom"
```

### Lecture Silencieuse (Mots de Passe)

L'option `-s` masque l'affichage des caractères saisis, utile pour les mots de passe :

```bash
#!/bin/bash

read -sp "Entrez votre mot de passe: " motdepasse
echo
echo "Mot de passe reçu (masqué lors de la saisie)"
```

### Lecture de Fichiers

La commande `read` peut aussi lire ligne par ligne un fichier :

```bash
#!/bin/bash

while read ligne; do
    echo "Ligne lue: $ligne"
done < /etc/hostname
```

### Paramètres Positionnels

Au-delà de l'interactivité, les scripts reçoivent des arguments via la ligne de commande :

```bash
#!/bin/bash

echo "Nom du script: $0"
echo "Premier argument: $1"
echo "Deuxième argument: $2"
echo "Nombre d'arguments: $#"
echo "Tous les arguments: $@"
```

Exécution :

```bash
./script.sh argument1 argument2
```

---

## 📊 Les Paramètres et les Variables

### Déclaration et Assignation de Variables

Les variables dans Bash sont déclarées simplement en les assignant :

```bash
#!/bin/bash

# Assignation simple
prenom="Marie"
age=30
prix=19.99

# Utilisation des variables
echo "Prénom: $prenom"
echo "Âge: $age"
echo "Prix: $prix"
```

**Important** : Aucun espace n'est autorisé autour du signe `=` lors de l'assignation.

### Variables Internes (Prédéfinies)

Bash fournit plusieurs variables prédéfinies :

```bash
#!/bin/bash

# $0 : Nom du script
echo "Script: $0"

# $1, $2, etc. : Arguments positionnels
echo "Premier argument: $1"

# $# : Nombre d'arguments
echo "Nombre d'arguments: $#"

# $@ : Tous les arguments
echo "Tous les arguments: $@"

# $* : Tous les arguments (différent dans les boucles)
echo "Tous les arguments (*): $*"

# $? : Code de retour de la dernière commande
ls /tmp
echo "Code de retour: $?"

# $$ : PID du processus shell actuel
echo "PID du shell: $$"

# $! : PID du dernier processus lancé en arrière-plan
sleep 100 &
echo "PID du dernier processus: $!"

# $- : Options du shell
echo "Options du shell: $-"

# $PWD : Répertoire de travail actuel
echo "Répertoire actuel: $PWD"

# $HOME : Répertoire personnel de l'utilisateur
echo "Répertoire personnel: $HOME"

# $USER : Nom de l'utilisateur actuel
echo "Utilisateur: $USER"
```

### Portée des Variables

Par défaut, les variables sont globales dans le script. Le mot-clé `local` les rend locales au contexte d'une fonction :

```bash
#!/bin/bash

variable_globale="Je suis globale"

ma_fonction() {
    local variable_locale="Je suis locale"
    echo "Dans la fonction: $variable_locale"
    echo "Variable globale: $variable_globale"
}

ma_fonction

echo "Hors de la fonction: $variable_globale"
# echo "Hors de la fonction: $variable_locale"  # Erreur - variable inexistante
```

### Substitution de Variables

Les variables peuvent être modifiées et manipulées :

```bash
#!/bin/bash

texte="Bonjour le monde"

# Longueur de la chaîne
echo "Longueur: ${#texte}"

# Extraction de sous-chaîne
echo "Sous-chaîne: ${texte:0:7}"  # Affiche: Bonjour

# Remplacement
echo "Remplacé: ${texte/monde/univers}"  # Affiche: Bonjour l'univers

# Valeur par défaut si variable non définie
echo "Valeur: ${variable_inexistante:-valeur_defaut}"
```

---

## 🔧 Les Fonctions

### Définition et Appel de Fonctions

Les fonctions permettent de regrouper du code réutilisable :

```bash
#!/bin/bash

# Définition d'une fonction
saluer() {
    echo "Bonjour, bienvenue dans mon script !"
}

# Appel de la fonction
saluer
```

### Fonctions Avec Paramètres

Les fonctions reçoivent des paramètres comme les scripts principaux :

```bash
#!/bin/bash

# Fonction avec paramètres
calculer_somme() {
    local nombre1=$1
    local nombre2=$2
    local somme=$((nombre1 + nombre2))
    echo "La somme de $nombre1 et $nombre2 est: $somme"
}

# Appel de la fonction avec arguments
calculer_somme 10 20
calculer_somme 5 15
```

### Retour de Valeurs

Les fonctions retournent une valeur d'état (code de sortie) :

```bash
#!/bin/bash

# Fonction avec code de retour
verifier_nombre() {
    if [ "$1" -gt 0 ]; then
        echo "Nombre positif"
        return 0  # Succès
    else
        echo "Nombre zéro ou négatif"
        return 1  # Erreur
    fi
}

# Utilisation du code de retour
verifier_nombre 5
if [ $? -eq 0 ]; then
    echo "Vérification réussie"
fi

verifier_nombre -3
if [ $? -ne 0 ]; then
    echo "Vérification échouée"
fi
```

### Récupération de Résultats Depuis une Fonction

Pour retourner des données, une fonction peut utiliser `echo` :

```bash
#!/bin/bash

# Fonction retournant une chaîne
obtenir_date_formatee() {
    local format="$1"
    date +"$format"
}

# Capture du résultat
date_longue=$(obtenir_date_formatee "%d/%m/%Y à %H:%M:%S")
echo "Date et heure: $date_longue"
```

### Structure Complète Avec Fonction Principale

Une organisation professionnelle inclut une fonction `main` :

```bash
#!/bin/bash

# Fonction secondaire
traiter_fichier() {
    local fichier="$1"
    if [ -f "$fichier" ]; then
        echo "Nombre de lignes dans $fichier: $(wc -l < "$fichier")"
        return 0
    else
        echo "Erreur: le fichier $fichier n'existe pas"
        return 1
    fi
}

# Fonction principale
main() {
    if [ $# -lt 1 ]; then
        echo "Utilisation: $0 <fichier>"
        return 1
    fi
    
    traiter_fichier "$1"
}

# Exécution
main "$@"
```

---

## 🧮 Les Opérations Arithmétiques

### Syntaxe de l'Arithmétique

Bash offre plusieurs syntaxes pour effectuer des calculs mathématiques :

```bash
#!/bin/bash

# Syntaxe $((expression))
resultat=$((10 + 5))
echo "10 + 5 = $resultat"

# Syntaxe $[expression]
resultat=$[20 - 8]
echo "20 - 8 = $resultat"

# Utilisation du programme expr
resultat=$(expr 15 \* 3)
echo "15 * 3 = $resultat"
```

### Opérateurs Arithmétiques

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `+` | Addition | `$((5 + 3))` → 8 |
| `-` | Soustraction | `$((10 - 4))` → 6 |
| `*` | Multiplication | `$((6 * 7))` → 42 |
| `/` | Division entière | `$((20 / 3))` → 6 |
| `%` | Modulo (reste) | `$((20 % 3))` → 2 |
| `**` | Exponentiation | `$((2 ** 8))` → 256 |

### Opérateurs Composés

Les opérateurs composés modifient une variable en place :

```bash
#!/bin/bash

compteur=10

# Incrément
((compteur++))
echo "Après ++ : $compteur"  # 11

# Décément
((compteur--))
echo "Après -- : $compteur"  # 10

# Ajout composé
((compteur += 5))
echo "Après += 5 : $compteur"  # 15

# Soustraction composée
((compteur -= 3))
echo "Après -= 3 : $compteur"  # 12

# Multiplication composée
((compteur *= 2))
echo "Après *= 2 : $compteur"  # 24
```

### Calculs Avec Décimales

Bash ne gère nativement que les entiers. Pour les décimales, utiliser `bc` ou `awk` :

```bash
#!/bin/bash

# Utilisation de bc
resultat=$(echo "scale=2; 10 / 3" | bc)
echo "10 / 3 = $resultat"  # 3.33

# Utilisation d'awk
resultat=$(awk "BEGIN {print 5.5 + 2.3}")
echo "5.5 + 2.3 = $resultat"  # 7.8
```

---

## 🔀 Les Branchements Conditionnels

### Structure if-then-else

La structure conditionnelle de base :

```bash
#!/bin/bash

note=75

if [ "$note" -ge 90 ]; then
    echo "Excellent!"
elif [ "$note" -ge 80 ]; then
    echo "Très bien!"
elif [ "$note" -ge 70 ]; then
    echo "Bien!"
else
    echo "À revoir"
fi
```

### Structure case

L'instruction `case` simplifie les branchements multiples :

```bash
#!/bin/bash

read -p "Choisissez un jour (1-7): " jour

case "$jour" in
    1)
        echo "Lundi"
        ;;
    2)
        echo "Mardi"
        ;;
    3)
        echo "Mercredi"
        ;;
    4)
        echo "Jeudi"
        ;;
    5)
        echo "Vendredi"
        ;;
    6|7)
        echo "Weekend"
        ;;
    *)
        echo "Jour invalide"
        ;;
esac
```

### Pattern Matching Avancé

La structure `case` supporte les expressions régulières :

```bash
#!/bin/bash

read -p "Entrez un nom de fichier: " fichier

case "$fichier" in
    *.txt)
        echo "Fichier texte détecté"
        ;;
    *.pdf)
        echo "Fichier PDF détecté"
        ;;
    *.jpg|*.png|*.gif)
        echo "Fichier image détecté"
        ;;
    *)
        echo "Type de fichier inconnu"
        ;;
esac
```

### Structure select

L'instruction `select` crée un menu interactif :

```bash
#!/bin/bash

echo "Que désirez-vous faire ?"
select choix in "Créer un fichier" "Lister les fichiers" "Supprimer un fichier" "Quitter"
do
    case "$choix" in
        "Créer un fichier")
            read -p "Nom du fichier: " nom
            touch "$nom"
            echo "Fichier créé"
            ;;
        "Lister les fichiers")
            ls -la
            ;;
        "Supprimer un fichier")
            read -p "Nom du fichier à supprimer: " nom
            rm "$nom"
            echo "Fichier supprimé"
            ;;
        "Quitter")
            break
            ;;
        *)
            echo "Choix invalide"
            ;;
    esac
done
```

---

## 🔁 Les Structures Itératives

### Boucle while

La boucle `while` s'exécute tant qu'une condition est vraie :

```bash
#!/bin/bash

compteur=1

while [ "$compteur" -le 5 ]; do
    echo "Itération $compteur"
    ((compteur++))
done
```

### Boucle until

La boucle `until` s'exécute tant qu'une condition est fausse :

```bash
#!/bin/bash

compteur=1

until [ "$compteur" -gt 5 ]; do
    echo "Itération $compteur"
    ((compteur++))
done
```

### Boucle for

La boucle `for` itère sur une liste de valeurs :

```bash
#!/bin/bash

# Itération sur une liste explicite
for jour in "Lundi" "Mardi" "Mercredi" "Jeudi" "Vendredi"; do
    echo "Jour: $jour"
done

# Itération sur une séquence
for nombre in {1..5}; do
    echo "Nombre: $nombre"
done

# Itération sur les fichiers d'un répertoire
for fichier in /etc/*.conf; do
    echo "Configuration: $(basename "$fichier")"
done
```

### Boucle for Classique (Style C)

Pour une itération numérique classique :

```bash
#!/bin/bash

# Style C avec triple expression
for ((i=1; i<=5; i++)); do
    echo "Itération $i"
done
```

### Itération sur les Arguments

Parcourir les paramètres passés au script :

```bash
#!/bin/bash

echo "Traitement des arguments:"
for arg in "$@"; do
    echo "Argument: $arg"
done
```

### Contrôle du Flux : break et continue

Les instructions de contrôle modifient le flux itératif :

```bash
#!/bin/bash

# Utilisation de break
for i in {1..10}; do
    if [ "$i" -eq 5 ]; then
        echo "Arrêt à $i"
        break
    fi
    echo "Nombre: $i"
done

# Utilisation de continue
for i in {1..5}; do
    if [ "$i" -eq 3 ]; then
        echo "Saut de $i"
        continue
    fi
    echo "Nombre: $i"
done
```

### Lecture Itérative de Fichiers

Traiter chaque ligne d'un fichier :

```bash
#!/bin/bash

while IFS= read -r ligne; do
    echo "Ligne traitée: $ligne"
done < /etc/passwd
```

La variable `IFS` (Internal Field Separator) contrôle le séparateur de champs. En la fixant à vide, on préserve les espaces de la ligne.

---

## 💡 Exemples Pratiques Complets

### Exemple 1 : Script de Sauvegarde Incrémentale

Ce script crée une sauvegarde datée d'un répertoire :

```bash
#!/bin/bash

# Configuration
REPERTOIRE_SOURCE="$HOME/Documents"
REPERTOIRE_BACKUP="$HOME/Backups"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
NOM_ARCHIVE="backup_$DATE.tar.gz"

# Vérification de l'existence du répertoire de destination
if [ ! -d "$REPERTOIRE_BACKUP" ]; then
    mkdir -p "$REPERTOIRE_BACKUP"
    echo "Répertoire de sauvegarde créé"
fi

# Création de l'archive
echo "Sauvegarde en cours..."
tar -czf "$REPERTOIRE_BACKUP/$NOM_ARCHIVE" "$REPERTOIRE_SOURCE"

# Vérification du succès
if [ $? -eq 0 ]; then
    echo "Sauvegarde réussie: $NOM_ARCHIVE"
    ls -lh "$REPERTOIRE_BACKUP/$NOM_ARCHIVE"
else
    echo "Erreur lors de la sauvegarde"
    exit 1
fi

# Nettoyage des anciennes sauvegardes (garder 7 derniers jours)
echo "Nettoyage des anciennes sauvegardes..."
find "$REPERTOIRE_BACKUP" -name "backup_*.tar.gz" -mtime +7 -delete
```

### Exemple 2 : Script d'Administration Système

Affiche les informations du système :

```bash
#!/bin/bash

afficher_info_systeme() {
    echo "╔════════════════════════════════════════╗"
    echo "║     INFORMATIONS SYSTÈME               ║"
    echo "╚════════════════════════════════════════╝"
    echo
    
    echo "Nom d'hôte: $(hostname)"
    echo "Utilisateur: $(whoami)"
    echo "Répertoire personnel: $HOME"
    echo "Shell: $SHELL"
    echo
    
    echo "Système d'exploitation: $(lsb_release -ds)"
    echo "Noyau: $(uname -r)"
    echo "Architecture: $(uname -m)"
    echo
    
    echo "Processeurs: $(nproc) cores"
    echo "Mémoire disponible: $(free -h | awk '/^Mem:/ {print $7}')"
    echo "Espace disque: $(df -h / | awk 'NR==2 {print $4 " disponible sur " $2}')"
    echo
    
    echo "Uptime: $(uptime -p)"
    echo "Charge système: $(uptime | awk -F'load average:' '{print $2}')"
}

afficher_info_systeme
```

### Exemple 3 : Gestionnaire de Fichier de Configuration

Applique des configurations selon les préférences :

```bash
#!/bin/bash

CONFIG_FILE="$HOME/.mon_config"

sauvegarder_config() {
    cat > "$CONFIG_FILE" << 'EOF'
# Configuration personnelle
EDITEUR="nano"
COULEURS="oui"
VERBEUX="non"
REPERTOIRE_TRAVAIL="$HOME/Projets"
EOF
    echo "Configuration sauvegardée"
}

charger_config() {
    if [ -f "$CONFIG_FILE" ]; then
        source "$CONFIG_FILE"
        echo "Configuration chargée"
    else
        echo "Fichier de configuration non trouvé"
        sauvegarder_config
    fi
}

afficher_config() {
    if [ -f "$CONFIG_FILE" ]; then
        echo "Configuration actuelle:"
        grep -v "^#" "$CONFIG_FILE" | grep -v "^$"
    fi
}

main() {
    case "${1:-afficher}" in
        charger)
            charger_config
            ;;
        sauvegarder)
            sauvegarder_config
            ;;
        afficher)
            afficher_config
            ;;
        *)
            echo "Utilisation: $0 {charger|sauvegarder|afficher}"
            exit 1
            ;;
    esac
}

main "$@"
```

### Exemple 4 : Script de Vérification de Santé du Système

Alerte si des seuils sont dépassés :

```bash
#!/bin/bash

# Seuils d'alerte
SEUIL_CPU=80
SEUIL_MEMOIRE=85
SEUIL_DISQUE=90

verifier_processeur() {
    local charge=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}')
    local nb_cores=$(nproc)
    local pourcentage=$(echo "scale=0; ($load * 100) / $nb_cores" | bc)
    
    if [ "$pourcentage" -gt "$SEUIL_CPU" ]; then
        echo "⚠️  ALERTE CPU: $pourcentage%"
        return 1
    fi
    echo "✓ CPU OK: $pourcentage%"
    return 0
}

verifier_memoire() {
    local memoire_utilisee=$(free | awk '/^Mem:/ {printf "%.0f", ($3/$2)*100}')
    
    if [ "$memoire_utilisee" -gt "$SEUIL_MEMOIRE" ]; then
        echo "⚠️  ALERTE MÉMOIRE: ${memoire_utilisee}%"
        return 1
    fi
    echo "✓ Mémoire OK: ${memoire_utilisee}%"
    return 0
}

verifier_disque() {
    local disque_utilise=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$disque_utilise" -gt "$SEUIL_DISQUE" ]; then
        echo "⚠️  ALERTE DISQUE: ${disque_utilise}%"
        return 1
    fi
    echo "✓ Disque OK: ${disque_utilise}%"
    return 0
}

main() {
    echo "╔════════════════════════════════════════╗"
    echo "║  VÉRIFICATION DE LA SANTÉ DU SYSTÈME   ║"
    echo "║  $(date +"%d/%m/%Y à %H:%M:%S")       ║"
    echo "╚════════════════════════════════════════╝"
    echo
    
    local status_global=0
    
    verifier_processeur || status_global=1
    verifier_memoire || status_global=1
    verifier_disque || status_global=1
    
    echo
    if [ "$status_global" -eq 0 ]; then
        echo "✓ Système en bon état"
    else
        echo "⚠️  Des alertes ont été détectées"
    fi
    
    return $status_global
}

main
```

### Exemple 5 : Script de Gestion d'Utilisateurs

Crée, modifie ou supprime des comptes utilisateurs :

```bash
#!/bin/bash

creer_utilisateur() {
    local nom="$1"
    local groupe="$2"
    
    if id "$nom" &>/dev/null; then
        echo "L'utilisateur $nom existe déjà"
        return 1
    fi
    
    sudo useradd -m -g "$groupe" "$nom"
    if [ $? -eq 0 ]; then
        echo "Utilisateur $nom créé avec succès"
        return 0
    else
        echo "Erreur lors de la création de $nom"
        return 1
    fi
}

lister_utilisateurs() {
    echo "Utilisateurs du système:"
    cut -d: -f1 /etc/passwd | tail -n +4
}

supprimer_utilisateur() {
    local nom="$1"
    
    if ! id "$nom" &>/dev/null; then
        echo "L'utilisateur $nom n'existe pas"
        return 1
    fi
    
    read -p "Êtes-vous sûr de vouloir supprimer $nom ? (oui/non): " confirmation
    
    if [ "$confirmation" = "oui" ]; then
        sudo userdel -r "$nom"
        echo "Utilisateur $nom supprimé"
        return 0
    else
        echo "Suppression annulée"
        return 1
    fi
}

main() {
    case "${1:-aide}" in
        creer)
            if [ -z "$2" ] || [ -z "$3" ]; then
                echo "Utilisation: $0 creer <nom> <groupe>"
                exit 1
            fi
            creer_utilisateur "$2" "$3"
            ;;
        lister)
            lister_utilisateurs
            ;;
        supprimer)
            if [ -z "$2" ]; then
                echo "Utilisation: $0 supprimer <nom>"
                exit 1
            fi
            supprimer_utilisateur "$2"
            ;;
        *)
            echo "Utilisation: $0 {creer|lister|supprimer}"
            exit 1
            ;;
    esac
}

main "$@"
```

---

## 🎓 Chemin d'Apprentissage Progressif

### Première Étape : Maîtrise des Fondamentaux (2-3 semaines)

La progression débute par la compréhension de la structure basique d'un script Bash[1][3]. L'apprenant doit devenir à l'aise avec la création d'un fichier script, l'ajout du shebang, et l'exécution basique de commandes. Cette phase inclut la modification des permissions avec `chmod` et la familiarisation avec l'environnement Linux terminal.

Pendant cette période, expérimenter avec des scripts simples affichant du texte, invoquant des commandes système, et comprenant le flux d'exécution linéaire. Des exemples à maîtriser : affichage de l'heure système, listing de fichiers, création de répertoires.

### Deuxième Étape : Variables et Entrées Utilisateur (3-4 semaines)

Une fois les fondamentaux assimilés, l'étape suivante concerne la manipulation des variables et l'interaction avec l'utilisateur. Comprendre comment stocker des données, les récupérer depuis la ligne de commande avec les paramètres positionnels, et les capturer interactivement avec `read`.

Cette phase introduit également les variables prédéfinies de Bash comme `$#`, `$@`, `$$`, `$?`. Expérimenter avec des scripts qui demandent des informations à l'utilisateur et les réutilisent dans le traitement.

### Troisième Étape : Tests et Conditions (4-5 semaines)

Après avoir maîtrisé les variables, l'apprenant doit comprendre les mécanismes de décision. Les tests sur les fichiers, les comparaisons numériques et textuelles, et les opérateurs logiques deviennent essentiels. Cette phase est fondamentale pour toute automatisation réelle.

Construire des scripts qui évaluent des conditions, prennent des décisions basées sur des résultats, et gèrent différents scénarios d'erreur. Tester des fichiers existants, comparer des valeurs, combiner des conditions avec `&&` et `||`.

### Quatrième Étape : Fonctions et Organisation du Code (5-6 semaines)

L'introduction des fonctions apporte un changement de paradigme important. Plutôt que d'écrire du code linéaire, l'apprenant organise désormais le code en modules réutilisables. Cette phase enseigne la structure professionnelle avec une fonction `main`, la portée des variables, et la réutilisabilité du code.

Refactoriser des scripts précédents en utilisant des fonctions. Créer des bibliothèques de fonctions pouvant être réutilisées. Comprendre le retour de valeurs et le passage de paramètres.

### Cinquième Étape : Boucles et Itération (6-7 semaines)

Les structures itératives permettent de traiter des collections de données et de répéter des tâches. Cette phase couvre les boucles `for`, `while`, et `until`, ainsi que les mécanismes de contrôle `break` et `continue`.

Des cas d'usage pratiques incluent le traitement de fichiers dans un répertoire, l'itération sur les paramètres passés au script, ou le traitement ligne par ligne d'un fichier. La compréhension du séparateur de champs (IFS) devient importante.

### Sixième Étape : Opérations Arithmétiques et Calculs (7-8 semaines)

Bien que Bash soit conçu pour l'administration système plutôt que les calculs complexes, il supporte les opérations arithmétiques entières natives. Cette phase enseigne la syntaxe `$(( ))`, les opérateurs composés, et quand faire appel à des outils externes comme `bc` pour les décimales.

Construire des scripts de calcul simple, des compteurs, des conversions d'unités. Comprendre les limitations et savoir quand déléguer les calculs complexes à d'autres outils.

### Septième Étape : Branchements Avancés et Menus (8-9 semaines)

Au-delà du simple `if-then-else`, l'instruction `case` offre une meilleure readabilité pour les décisions multiples. La structure `select` crée des interfaces de menu interactives. Cette phase améliore l'expérience utilisateur des scripts.

Convertir des blocs `if` imbriqués en structures `case` plus lisibles. Créer des menus interactifs où l'utilisateur choisit parmi plusieurs options. Implémenter des validations robustes des entrées utilisateur.

### Huitième Étape : Scripts Complexes et Production (9-10 semaines)

La dernière étape de ce cycle synthétise tout l'apprentissage. L'apprenant crée des scripts complets, bien structurés, à usage professionnel. Gestion d'erreurs complète, logging approprié, documentation du code, gestion des signaux du système.

Exemples avancés : scripts de sauvegarde automatique, monitoring système, gestion de bases de données simples, orchestration de tâches complexes, intégration avec le cron pour l'automatisation programmée.

### Pratique Continue et Projets Personnels

Tout au long de ce parcours, la pratique constante est essentielle. Commencer par reproduire les exemples présentés, puis les modifier, puis en créer de nouveaux adaptés à des besoins spécifiques. Les projets personnels renforcent la compréhension et bâtissent la confiance.

Des idées de projets progressifs : script de gestion personnelle de fichiers, outil de surveillance des logs système, gestionnaire de configurations personnelles, automatisation de tâches administratives récurrentes, création d'outils collaboratifs pour l'équipe.

---

## 🔗 Concepts Interconnectés

La puissance de Bash réside dans la combinaison de ces éléments. Un script complet[2] de gestion de fichiers pourrait associer :

- Des **tests** pour vérifier l'existence des fichiers
- Des **boucles** pour traiter plusieurs fichiers
- Des **fonctions** pour organiser le code
- Des **variables** pour stocker les résultats intermédiaires
- Des **conditions** pour gérer les différents cas
- De l'**arithmétique** pour calculer des statistiques

Cette composition crée des outils puissants d'automatisation et d'administration système. Bash transforme ainsi les tâches répétitives et manuelles en processus automatisés, améliorant l'efficacité et réduisant les erreurs humaines.
