# Citations
- https://wiki.lezinter.net/_/Cours:Manipulation_de_fichiers_avec_Bash
- https://www.youtube.com/watch?v=jsl8yw8R0To
- https://www.it-connect.fr/trier-des-fichiers-selon-une-date-avec-find/
- https://www.youtube.com/watch?v=WZqUQPRSBBQ
- https://www.datanovia.com/books/linux/fr/data-manipulation.html
- https://blog.stephane-robert.info/docs/admin-serveurs/linux/commandes-avancees/
- https://abs.traduc.org/abs-fr/ch16s04.html
- https://fr.scribd.com/document/702285177/3-Exercices-Commandes-pipe


# Tokens
- prompt_tokens: 307
- completion_tokens: 6770
- total_tokens: 7077
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.102, 'request_cost': 0.006, 'total_cost': 0.108}


# Content
# 📚 Guide Complet : Rechercher, Trier et Filtrer des Fichiers sous Linux et Bash

## 🎯 Introduction au Module

La gestion efficace des fichiers constitue une compétence fondamentale dans l'administration Linux et la programmation Bash. Ce module présente les outils essentiels permettant de localiser, manipuler et traiter les données textuelles. Les commandes couvertes ici forment l'épine dorsale du traitement de fichiers en ligne de commande, permettant d'accomplir des tâches complexes de manière rapide et efficace.

## 1️⃣ Localiser un Fichier Rapidement avec `locate`

La commande `locate` constitue le point de départ pour la recherche de fichiers. Contrairement à `find`, qui parcourt le système de fichiers en temps réel, `locate` consulte une base de données pré-indexée, offrant une recherche extrêmement rapide.

### Fonctionnement et Configuration

`locate` maintient une base de données des fichiers et répertoires du système, mise à jour quotidiennement par défaut. Cette approche permet des recherches pratiquement instantanées, même sur des systèmes volumineux contenant des millions de fichiers.

```bash
# Syntaxe basique
locate nom_fichier

# Exemple concret
locate bash.rc
```

### Options Essentielles

| Option | Description | Exemple |
|--------|-------------|---------|
| `-i` | Recherche insensible à la casse | `locate -i BASH.RC` |
| `-c` | Affiche le nombre de résultats | `locate -c bash` |
| `-r` | Utilise les expressions régulières | `locate -r '\.conf$'` |
| `-S` | Affiche les statistiques de la base | `locate -S` |

### Mise à Jour de la Base de Données

```bash
# Mettre à jour manuellement la base de données
sudo updatedb

# Vérifier le statut de la base
locate -S
```

### Limitation et Précision

`locate` possède une limitation importante : elle ne détecte que les fichiers présents dans sa base de données. Les fichiers créés récemment n'apparaîtront que lors de la prochaine mise à jour. Pour une recherche en temps réel, `find` s'avère nécessaire.

## 2️⃣ La Commande `find` : Recherche Avancée de Fichiers

### Présentation Générale de `find`

`find` constitue l'outil le plus puissant et flexible pour rechercher des fichiers sous Linux. Contrairement à `locate`, elle effectue une recherche en temps réel dans la hiérarchie des répertoires, permettant l'application de critères de filtrage complexes.

### Syntaxe Fondamentale

```bash
find [chemin] [options] [critères] [actions]
```

Décomposition :
- **chemin** : Le répertoire de départ (par défaut, le répertoire courant)
- **options** : Des drapeaux modifiant le comportement
- **critères** : Les conditions de sélection des fichiers
- **actions** : Les opérations à effectuer sur les résultats

### Recherche par Nom

```bash
# Rechercher tous les fichiers .txt dans le répertoire courant
find . -name "*.txt"

# Rechercher en ignorant la casse
find . -iname "*.TXT"

# Recherche dans un répertoire spécifique
find /home/utilisateur -name "document.pdf"
```

### Recherche par Type

```bash
# Rechercher uniquement les répertoires
find . -type d -name "log*"

# Rechercher uniquement les fichiers réguliers
find . -type f -name "*.conf"

# Rechercher les liens symboliques
find . -type l

# Rechercher les fichiers spéciaux (sockets, tuyaux)
find . -type s
```

### Recherche par Date

La recherche temporelle permet de filtrer les fichiers selon plusieurs critères de date[3] :

```bash
# Fichiers modifiés il y a plus de 30 jours
find /home/mickael -type f -name "*.txt" -mtime +30

# Fichiers modifiés il y a moins de 7 jours
find . -type f -mtime -7

# Fichiers modifiés exactement il y a 1 jour
find . -type f -mtime 1
```

Les options temporelles principales :

| Option | Signification |
|--------|---------------|
| `-mtime` | Date de dernière modification (en jours) |
| `-atime` | Date de dernier accès (en jours) |
| `-ctime` | Date de dernier changement de métadonnées (en jours) |
| `-mmin` | Date de modification (en minutes)[3] |
| `-amin` | Date d'accès (en minutes) |
| `-cmin` | Changement de métadonnées (en minutes) |

Notation des périodes :
- `+N` : plus de N unités
- `-N` : moins de N unités
- `N` : exactement N unités

```bash
# Fichiers modifiés il y a moins de 30 minutes
find /home/utilisateur -type f -name "*.txt" -mmin -30

# Fichiers accédés il y a plus d'une heure
find . -type f -amin +60
```

### Recherche par Taille

```bash
# Fichiers de plus de 100 Mo
find . -type f -size +100M

# Fichiers de moins de 1 Mo
find . -type f -size -1M

# Fichiers d'exactement 5 Ko
find . -type f -size 5k

# Unités supportées : c (octets), k (Ko), M (Mo), G (Go)
```

### Recherche par Permissions

```bash
# Fichiers lisibles par tous
find . -type f -perm -004

# Fichiers accessibles en lecture/écriture pour le propriétaire uniquement
find . -type f -perm 600

# Fichiers exécutables
find . -type f -perm /111
```

### Recherche Avancée avec Conditions

```bash
# Combiner plusieurs critères (AND logique)
find . -type f -name "*.log" -mtime +7

# Fichiers ou répertoires (OR logique)
find . \( -name "*.tmp" -o -name "*.bak" \)

# Exclusion de critères (NOT logique)
find . -type f ! -name "*.txt"

# Plusieurs exclusions
find . -type f ! -name "*.txt" ! -name "*.pdf"
```

### Actions sur les Résultats

```bash
# Afficher les résultats (action par défaut)
find . -type f -name "*.log" -print

# Supprimer les fichiers trouvés (attention !)
find . -type f -name "*.tmp" -delete

# Exécuter une commande personnalisée
find . -type f -name "*.txt" -exec cat {} \;

# Utiliser xargs pour passer les résultats à une autre commande
find . -type f -name "*.log" | xargs ls -lh

# Afficher les résultats séparés par des zéros (plus sûr avec xargs)
find . -type f -name "*.log" -print0 | xargs -0 ls -lh
```

### Recherche par Date avec Format Avancé

Une fonctionnalité méconnue permet de spécifier une date précise[3] :

```bash
# Fichiers modifiés après une date spécifique
find . -newermt "2025-03-04"

# Fichiers modifiés avant une date
find . ! -newermt "2025-03-04"

# Format complet avec heure
find . -newermt "2025-03-04 21:01:39"

# Utiliser les variantes pour accès et changements
find . -neweract "2025-03-04"
find . -newerct "2025-03-03"
```

## 3️⃣ Filtrer les Données avec `grep`

### Introduction à `grep`

`grep` signifie "Global Regular Expression Print". Cette commande recherche des lignes contenant un motif spécifique dans un fichier ou un flux de données. Elle constitue l'outil de filtrage le plus utilisé en Bash[1][4].

### Syntaxe Basique

```bash
# Rechercher un mot dans un fichier
grep motif fichier

# Exemple concret
grep "error" /var/log/syslog
```

### Options Essentielles

```bash
# Recherche insensible à la casse
grep -i "ERROR" fichier.txt

# Afficher le numéro de ligne
grep -n "pattern" fichier.txt

# Inverser la sélection (lignes ne contenant pas le motif)
grep -v "pattern" fichier.txt

# Compter les occurrences
grep -c "pattern" fichier.txt

# Afficher le contexte (lignes avant et après)
grep -B 2 -A 2 "pattern" fichier.txt

# Recherche récursive dans tous les fichiers et sous-répertoires
grep -r "motif" /chemin/

# Expression régulière étendue
grep -E "^[0-9]+" fichier.txt

# Afficher uniquement la partie correspondante du motif
grep -o "pattern" fichier.txt
```

### Utilisation Avancée avec Expressions Régulières

```bash
# Rechercher les lignes commençant par un chiffre
grep "^[0-9]" fichier.txt

# Lignes se terminant par ".txt"
grep "\.txt$" fichier.txt

# Mots entiers uniquement
grep -w "server" config.conf

# Une ou plusieurs occurrences
grep "e\+" fichier.txt

# Exactement deux occurrences
grep "e\{2\}" fichier.txt

# Plages de caractères
grep "[a-zA-Z0-9]" fichier.txt
```

### Combinaison avec d'autres Commandes

```bash
# Pipeline avec grep
cat fichier.txt | grep "error"

# Filtrer le résultat de ps
ps aux | grep "bash"

# Compter les utilisateurs actifs
who | grep -c "^"

# Afficher les fichiers contenant un motif spécifique
ls -la | grep "\.conf$"
```

## 4️⃣ Trier les Résultats avec `sort`

### Principes Fondamentaux de `sort`

La commande `sort` trie les lignes d'un fichier ou d'un flux de données selon divers critères. Elle constitue un élément incontournable du traitement de données en Bash[1][6][7].

### Tri Basique

```bash
# Tri alphabétique croissant (par défaut)
sort fichier.txt

# Tri alphabétique décroissant
sort -r fichier.txt

# Tri numérique (important pour les nombres)
sort -n fichier.txt

# Tri numérique décroissant
sort -nr fichier.txt
```

### Options de Tri Spécialisées

| Option | Description | Exemple |
|--------|-------------|---------|
| `-f` | Ignorer la casse (majuscules/minuscules) | `sort -f fichier.txt` |
| `-d` | Tri dictionnaire | `sort -d fichier.txt` |
| `-u` | Unique (supprimer les doublons) | `sort -u fichier.txt` |
| `-R` | Mélange aléatoire[5] | `sort -R fichier.txt` |
| `-k` | Trier sur une colonne spécifique | `sort -k 2 fichier.txt` |
| `-t` | Définir le séparateur de champs | `sort -t: -k 1 /etc/passwd` |

### Tri sur Colonnes et Champs

```bash
# Tri sur la première colonne (index 1)
sort -k 1 donnees.csv

# Tri sur la deuxième colonne
sort -k 2 donnees.txt

# Tri sur le 5ème caractère de la première colonne
sort -k 1.5 donnees.csv

# Définir un séparateur personnalisé (deux-points)
sort -t: -k 3 -n /etc/passwd

# Tri primaire sur colonne 1, tri secondaire sur colonne 2
sort -k 1,1 -k 2,2n donnees.txt
```

### Combinaison avec d'autres Commandes

```bash
# Obtenir le nombre minimum/maximum
sort -n fichier.txt | head -n 1  # Minimum
sort -n fichier.txt | tail -n 1  # Maximum

# Combiner avec uniq pour analyser les doublons
sort fichier.txt | uniq

# Supprimer les doublons et afficher la fréquence
sort fichier.txt | uniq -c

# Tri par fréquence (le plus courant en premier)
sort fichier.txt | uniq -c | sort -nr
```

## 5️⃣ Commandes de Manipulation de Texte : `rev`, `tac`, `cut`, `uniq`

### `rev` : Inverser les Lignes

La commande `rev` inverse l'ordre des caractères dans chaque ligne, utile pour des manipulations textuelles spéciales.

```bash
# Inverser les caractères d'une ligne
echo "hello" | rev
# Résultat : olleh

# Inverser le contenu d'un fichier ligne par ligne
rev fichier.txt

# Trouver les rimes (inverser les mots pour comparer les terminaisons)
cat texte.txt | tr ' ' '\n' | rev | sort | uniq -c
```

### `tac` : Inverser l'Ordre des Lignes

`tac` (l'inverse de `cat`) affiche un fichier en ordre inverse, ligne par ligne.

```bash
# Afficher un fichier de bas en haut
tac fichier.txt

# Combiner avec grep pour obtenir la dernière occurrence
tac fichier.log | grep "error" | head -n 1

# Consulter les événements les plus récents en premier
tac /var/log/syslog | head -n 20
```

### `cut` : Extraire des Colonnes

`cut` extrait des colonnes ou des champs spécifiques d'un fichier texte.

```bash
# Extraire les caractères 1 à 5
cut -c 1-5 fichier.txt

# Extraire les caractères 1, 3, 5
cut -c 1,3,5 fichier.txt

# Extraire un champ avec séparateur
cut -d: -f 1 /etc/passwd  # Affiche les noms d'utilisateurs

# Extraire plusieurs champs
cut -d, -f 1,3 donnees.csv

# Complément de sélection (tous sauf le champ 2)
cut -d: -f 1,3- /etc/passwd
```

### `uniq` : Supprimer ou Analyser les Doublons

`uniq` détecte ou supprime les lignes dupliquées consécutives[1].

```bash
# Supprimer les doublons consécutifs (doit être trié d'abord)
sort fichier.txt | uniq

# Afficher uniquement les doublons
sort fichier.txt | uniq -d

# Afficher les hapax (lignes uniques)
sort fichier.txt | uniq -u

# Compter les occurrences de chaque ligne
sort fichier.txt | uniq -c

# Afficher le nombre de doublons seulement
sort fichier.txt | uniq -c | grep -v "^[[:space:]]*1"
```

### Cas d'Usage Intégré : Analyse de Mots

```bash
# Convertir un texte en liste de mots triés avec fréquence[1]
cat texte.txt | tr ' ' '\n' | sort | uniq -c | sort -nr

# Trouver les mots apparaissant exactement 5 fois
cat texte.txt | tr ' ' '\n' | sort | uniq -c | grep "^[[:space:]]*5"

# Rechercher un mot spécifique dans la liste des mots
cat texte.txt | tr ' ' '\n' | sort | uniq -c | grep "saucisson"

# Analyser les rimes (mots inversés)[1]
cat texte.txt | tr ' ' '\n' | rev | sort | uniq -c
```

## 6️⃣ La Commande `sed` : Édition de Flux

### Introduction à `sed`

`sed` (Stream EDitor) édite des flux de texte selon des commandes spécifiées, permettant de transformer du texte de manière automatisée et scriptée.

### Syntaxe Basique

```bash
sed [options] 'commande' fichier

# Option -e pour plusieurs commandes
sed -e 'commande1' -e 'commande2' fichier

# Option -i pour éditer en place
sed -i 'commande' fichier

# En mode pipeline
cat fichier | sed 'commande'
```

### Substitution : Commande `s`

```bash
# Substitution basique (première occurrence par ligne)
sed 's/ancien/nouveau/' fichier.txt

# Substitution globale (toutes les occurrences)
sed 's/ancien/nouveau/g' fichier.txt

# Substitution avec confirmation interactive
sed 's/ancien/nouveau/p' fichier.txt

# Insensible à la casse
sed 's/ancien/nouveau/i' fichier.txt

# Afficher uniquement les lignes modifiées (avec -n)
sed -n 's/ancien/nouveau/p' fichier.txt
```

### Sélection de Lignes

```bash
# Opérer sur les lignes 1 à 5
sed '1,5s/ancien/nouveau/' fichier.txt

# Opérer sur la ligne 10 uniquement
sed '10s/ancien/nouveau/' fichier.txt

# Opérer sur les lignes correspondant à un motif
sed '/pattern/s/ancien/nouveau/' fichier.txt

# Plages avec motifs
sed '/debut/,/fin/s/ancien/nouveau/' fichier.txt
```

### Suppressions et Additions

```bash
# Supprimer les lignes vides
sed '/^$/d' fichier.txt

# Supprimer les lignes contenant un motif
sed '/motif/d' fichier.txt

# Supprimer les lignes 1 à 5
sed '1,5d' fichier.txt

# Ajouter une ligne après une ligne correspondante
sed '/motif/a\Nouvelle ligne' fichier.txt

# Insérer une ligne avant une ligne correspondante
sed '/motif/i\Nouvelle ligne' fichier.txt

# Remplacer une ligne entière
sed '/motif/c\Ligne de remplacement' fichier.txt
```

### Extraction et Affichage Sélectif

```bash
# Afficher uniquement les lignes 10 à 20
sed -n '10,20p' fichier.txt

# Afficher les lignes correspondant à un motif
sed -n '/motif/p' fichier.txt

# Afficher les lignes précédant un motif
sed -n '/motif/!p' fichier.txt
```

### Expressions Régulières dans `sed`

```bash
# Utiliser des groupes de capture
sed 's/\([a-z]*\) \([a-z]*\)/\2 \1/' fichier.txt

# Caractères spéciaux
sed 's/\$/€/g' fichier.txt

# Délimiteurs personnalisés (utile pour les chemins)
sed 's|/ancien/chemin|/nouveau/chemin|g' fichier.txt

# Ancres de ligne
sed 's/^/PREFIX-/' fichier.txt  # Ajouter un préfixe
sed 's/$/-SUFFIX/' fichier.txt  # Ajouter un suffixe
```

## 7️⃣ La Commande `awk` : Traitement Avancé de Données

### Introduction à `awk`

`awk` constitue un outil puissant pour l'analyse et la transformation de données textuelles structurées. Contrairement à `sed` qui opère ligne par ligne, `awk` traite les données champ par champ, offrant des capacités de programmation plus avancées.

### Principes Fondamentaux

```bash
# Syntaxe de base
awk 'pattern { action }' fichier

# Afficher la totalité du fichier
awk '{ print }' fichier.txt

# Afficher le premier champ (colonne)
awk '{ print $1 }' fichier.txt

# Afficher les champs 1 et 3
awk '{ print $1, $3 }' fichier.txt
```

### Variables Spéciales

| Variable | Description |
|----------|-------------|
| `$0` | Ligne entière |
| `$1, $2, ...` | Champs individuels |
| `NF` | Nombre de champs |
| `NR` | Numéro de ligne courant |
| `FILENAME` | Nom du fichier traité |
| `FS` | Séparateur de champs (par défaut : espace) |
| `OFS` | Séparateur de sortie |
| `ORS` | Séparateur de ligne de sortie |

### Utilisation Pratique

```bash
# Afficher avec un séparateur personnalisé
awk -F: '{ print $1, $3 }' /etc/passwd

# Afficher le nombre de champs par ligne
awk '{ print NF }' fichier.txt

# Afficher le numéro de ligne et le contenu
awk '{ print NR, $0 }' fichier.txt

# Afficher les lignes plus longues que 80 caractères
awk 'length($0) > 80 { print }' fichier.txt

# Filtrer les lignes correspondant à une condition
awk '$3 > 100 { print $1, $3 }' donnees.txt

# Afficher les champs en ordre inverse
awk '{ for(i=NF; i>=1; i--) printf "%s ", $i; print "" }' fichier.txt
```

### Motifs et Conditions

```bash
# Motif spécifique
awk '/pattern/ { print }' fichier.txt

# Lignes ne correspondant pas au motif
awk '!/pattern/ { print }' fichier.txt

# Condition numérique
awk '$2 > 50 { print $1, $2 }' donnees.txt

# Condition combinée
awk '$1 == "admin" && $3 > 1000 { print }' fichier.txt

# Lignes vides
awk 'NF == 0 { print "Ligne vide détectée" }' fichier.txt
```

### Actions Avancées

```bash
# Calculer la somme d'une colonne
awk '{ sum += $2 } END { print "Total:", sum }' donnees.txt

# Compter les occurrences
awk '{ count[$1]++ } END { for(mot in count) print mot, count[mot] }' fichier.txt

# Moyenne d'une colonne
awk '{ sum += $2; n++ } END { print "Moyenne:", sum/n }' donnees.txt

# Afficher les lignes dupliquées
awk '!seen[$0]++' fichier.txt

# Traiter les début et fin d'un fichier
awk 'BEGIN { print "Début du traitement" } { print NR, $0 } END { print "Total:", NR }' fichier.txt
```

### Cas d'Usage Pratique : Analyse d'Accès

```bash
# Compter les accès par adresse IP dans un fichier log
awk '{ print $1 }' access.log | sort | uniq -c | sort -nr

# Extraire et analyser les heures de connexion
awk '{ print $4 }' access.log | cut -d: -f1 | sort | uniq -c

# Calculer le volume de données par utilisateur
awk '{ total[$1] += $10 } END { for(user in total) print user, total[user] }' access.log
```

## 8️⃣ Intégration Pratique : Pipeline Complet

### Exemple Complet : Analyse de Fichier Log

```bash
# Rechercher les erreurs, les trier par fréquence, et afficher les top 10
grep "ERROR" /var/log/application.log | \
  awk '{ print $NF }' | \
  sort | \
  uniq -c | \
  sort -nr | \
  head -n 10
```

### Exemple : Traitement de Données CSV

```bash
# Extraire les utilisateurs avec un salaire supérieur à 50000
awk -F, '$3 > 50000 { print $1, $2, $3 }' employes.csv | \
  sort -t, -k3 -nr

# Générer un rapport
awk -F, 'BEGIN { print "Rapport des employés" } \
  { sum += $3; count++ } \
  END { print "Salaire moyen:", sum/count }' employes.csv
```

### Exemple : Nettoyage de Fichier

```bash
# Supprimer les espaces en début et fin de ligne, puis les doublons
sed 's/^[[:space:]]*//;s/[[:space:]]*$//' fichier.txt | \
  sort | \
  uniq > fichier_propre.txt
```

## 9️⃣ Chemin d'Apprentissage Recommandé

### Phase 1 : Les Fondamentaux (Semaine 1)

Commencer par maîtriser les commandes de base :

1. **`locate` et `find`** : Comprendre comment parcourir le système de fichiers
2. **`grep`** : Apprendre à filtrer du contenu texte
3. **`sort`** : Maîtriser les différents types de tri

À cette phase, l'apprenti doit être capable de :
- Localiser un fichier spécifique
- Rechercher du texte dans des fichiers
- Trier des listes de données

### Phase 2 : Manipulation Intermédiaire (Semaine 2-3)

Progresser vers des outils de transformation :

1. **`rev`, `tac`, `cut`, `uniq`** : Manipuler la structure du texte
2. **Combinaison de pipelines** : Chaîner plusieurs commandes

Les compétences acquises :
- Transformer et restructurer des données
- Extraire des colonnes spécifiques
- Détecter et gérer les doublons

### Phase 3 : Édition et Traitement (Semaine 4-5)

Approfondir avec des outils puissants :

1. **`sed`** : Édition en flux, substitution, extraction sélective
2. **`awk`** : Traitement avancé de données, programmation légère

À cette étape, la capacité à traiter des fichiers volumineux et complexes se développe.

### Phase 4 : Intégration et Automatisation (Semaine 6+)

Combiner tous les outils :

1. Créer des scripts Bash complexes utilisant les pipelines
2. Automatiser le traitement de données récurrentes
3. Optimiser les performances pour les gros fichiers

### Progression Pratique : Exercices Suggérés

**Niveau 1 : Recherche**
```bash
# Trouver tous les fichiers .sh modifiés aujourd'hui
find . -name "*.sh" -type f -mtime 0

# Chercher les erreurs de connexion en SSH
grep "Failed password" /var/log/auth.log
```

**Niveau 2 : Tri et Analyse**
```bash
# Afficher les top 5 des utilisateurs ayant le plus de fichiers
find /home -type f | cut -d/ -f3 | sort | uniq -c | sort -nr | head -5

# Générer un rapport de fréquence de mots
cat fichier.txt | tr ' ' '\n' | grep -v '^$' | sort | uniq -c | sort -nr
```

**Niveau 3 : Transformation Avancée**
```bash
# Convertir CSV en format humanisé
awk -F, 'BEGIN { print "Nom\tDépartement\tSalaire" } \
  { printf "%s\t%s\t%.2f€\n", $1, $2, $3 }' employes.csv

# Nettoyer et analyser un fichier log
sed 's/\[.*\]//g' access.log | awk '{ print $1 }' | \
  sort | uniq -c | sort -nr
```

**Niveau 4 : Cas Réel**
```bash
# Générer un rapport quotidien des erreurs système
grep "$(date +%Y-%m-%d)" /var/log/syslog | \
  grep -i "error\|critical" | \
  awk '{ print $NF }' | \
  sort | uniq -c | sort -nr > rapport_erreurs.txt

# Archiver les fichiers log anciens
find /var/log -name "*.log" -type f -mtime +30 -exec gzip {} \;
```

## 🔟 Conclusion et Points Clés

La maîtrise de ces commandes constitue la fondation d'une utilisation efficace de Linux et Bash. Chaque outil possède un objectif spécifique :

- **Localisation** : `locate`, `find`
- **Filtrage** : `grep`
- **Tri** : `sort`
- **Transformation** : `rev`, `tac`, `cut`, `uniq`
- **Édition** : `sed`
- **Analyse Avancée** : `awk`

L'apprentissage progressif, partant des commandes simples vers des combinaisons complexes, permet de construire une compréhension solide. La pratique régulière avec des cas réels consolide ces connaissances et développe l'intuition nécessaire pour résoudre efficacement les problèmes courants d'administration système et de traitement de données.
