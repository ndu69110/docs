# Citations
- https://www.datacamp.com/fr/tutorial/git-rebase
- https://www.atlassian.com/fr/git/tutorials/rewriting-history/git-rebase
- https://grafikart.fr/tutoriels/amend-rebase-588
- https://git-scm.com/docs/git-rebase/fr
- https://git-scm.com/book/fr/v2/Les-branches-avec-Git-Rebaser-Rebasing
- https://www.miximum.fr/blog/git-rebase/
- https://www.youtube.com/watch?v=BqMfUhl3nz8
- https://www.ionos.fr/digitalguide/sites-internet/developpement-web/git-rebase/
- https://docs.github.com/fr/get-started/using-git/about-git-rebase
- https://learn.microsoft.com/fr-fr/azure/devops/repos/git/rebase?view=azure-devops


# Tokens
- prompt_tokens: 254
- completion_tokens: 1484
- total_tokens: 1738
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.022, 'request_cost': 0.006, 'total_cost': 0.029}


# Content
# Chapitre 6 : Modifier des commits

Ce chapitre explore les différentes méthodes pour modifier l’historique des commits dans Git. Il aborde les commandes essentielles pour corriger, réorganiser ou simplifier l’historique d’un projet, en mettant l’accent sur la maîtrise des outils avancés de Git.

---

## Introduction et `git commit --amend`

La commande `git commit --amend` permet de modifier le dernier commit effectué. Elle est utile pour corriger une erreur dans le message du commit, ajouter des fichiers oubliés ou modifier le contenu du commit.

### Fonctionnement

- Si le commit n’a pas encore été poussé sur un dépôt distant, il est possible de le modifier sans risque.
- Si le commit a été poussé, il est déconseillé de l’amender, car cela modifie l’historique et peut causer des conflits pour les autres contributeurs.

### Exemple

Supposons qu’un commit a été effectué avec un message incorrect :

```bash
git add fichier.txt
git commit -m "Ajout du fichier"
```

Pour corriger le message du dernier commit :

```bash
git commit --amend -m "Ajout du fichier important"
```

Si des fichiers ont été oubliés, ils peuvent être ajoutés avant d’exécuter la commande :

```bash
git add fichier_oublie.txt
git commit --amend
```

### Schéma

```
Avant amend :
A---B---C

Après amend :
A---B---C'
```

---

## Le reflog

Le reflog (reference log) est un journal qui enregistre toutes les modifications apportées à la référence HEAD. Il permet de retrouver des commits perdus ou d’annuler des erreurs.

### Fonctionnement

- Le reflog enregistre chaque changement de la branche courante, y compris les rebasages, les fusions et les resets.
- Il est utile pour récupérer des commits supprimés ou pour revenir à un état antérieur.

### Exemple

Pour afficher le reflog :

```bash
git reflog
```

Pour revenir à un commit spécifique :

```bash
git reset --hard HEAD@{2}
```

### Schéma

```
reflog :
HEAD@{0}: rebase: commit C
HEAD@{1}: commit: commit B
HEAD@{2}: checkout: commit A
```

---

## `git rebase`

La commande `git rebase` permet de déplacer ou de réappliquer des commits d’une branche sur une autre. Elle est utilisée pour obtenir un historique linéaire et éviter les commits de fusion.

### Fonctionnement

- Le rebase prend les commits d’une branche et les applique sur une autre branche.
- Il est important de comprendre que le rebase réécrit l’historique, ce qui peut causer des problèmes si la branche a été poussée sur un dépôt distant.

### Exemple

Supposons que la branche `feature` a été créée à partir de `main` :

```
main: A---B---C
feature:      D---E
```

Pour rebaser `feature` sur `main` :

```bash
git checkout feature
git rebase main
```

Résultat :

```
main: A---B---C
feature:          D'---E'
```

### Schéma

```
Avant rebase :
main: A---B---C
feature:      D---E

Après rebase :
main: A---B---C
feature:          D'---E'
```

---

## Le rebasage interactif

Le rebasage interactif (`git rebase -i`) permet de modifier, réorganiser ou supprimer des commits pendant le processus de rebase.

### Fonctionnement

- Le rebasage interactif ouvre un éditeur où il est possible de choisir les actions à effectuer sur chaque commit.
- Les actions possibles incluent la modification du message, la suppression, la fusion ou la réorganisation des commits.

### Exemple

Pour lancer un rebasage interactif sur les 3 derniers commits :

```bash
git rebase -i HEAD~3
```

Dans l’éditeur, il est possible de modifier les lignes pour choisir les actions :

```
pick 1234567 Commit 1
pick 2345678 Commit 2
pick 3456789 Commit 3
```

Pour fusionner les deux premiers commits :

```
squash 1234567 Commit 1
pick 2345678 Commit 2
pick 3456789 Commit 3
```

### Schéma

```
Avant rebasage interactif :
A---B---C---D---E

Après rebasage interactif :
A---B---C'---D---E
```

---

## Utilisation de `git merge --squash`

La commande `git merge --squash` permet de fusionner une branche en créant un seul commit qui regroupe toutes les modifications.

### Fonctionnement

- Le squash fusionne toutes les modifications d’une branche en un seul commit, sans conserver l’historique des commits individuels.
- Il est utile pour simplifier l’historique lors de la fusion de branches de fonctionnalités.

### Exemple

Pour fusionner la branche `feature` en un seul commit :

```bash
git checkout main
git merge --squash feature
git commit -m "Fusion de la branche feature"
```

### Schéma

```
Avant merge --squash :
main: A---B---C
feature:      D---E---F

Après merge --squash :
main: A---B---C---G
```

---

## Conclusion

La modification des commits dans Git est un outil puissant pour maintenir un historique propre et organisé. Les commandes présentées dans ce chapitre permettent de corriger, réorganiser ou simplifier l’historique d’un projet, en adaptant les outils à chaque situation.

---

## Ressources complémentaires

- [Documentation officielle Git](https://git-scm.com/docs/git-rebase/fr)
- [Atlassian Git Tutorial](https://www.atlassian.com/fr/git/tutorials/rewriting-history/git-rebase)
- [DataCamp Git Rebase Guide](https://www.datacamp.com/fr/tutorial/git-rebase)

---

Ce chapitre fournit une base solide pour maîtriser la modification des commits dans Git, en combinant théorie, exemples pratiques et schémas explicatifs.
