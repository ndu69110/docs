# Citations
- https://docs.cherryservers.com/knowledge/how-to-connect-to-a-linux-server-using-ssh
- https://hostman.com/tutorials/how-to-install-and-configure-ssh-on-an-ubuntu-server/
- https://www.zenarmor.com/docs/linux-tutorials/how-to-configure-and-enable-ssh-in-ubuntu
- https://www.geeksforgeeks.org/linux-unix/linux-ssh-server-sshd-configuration-and-security-options-with-examples/
- https://www.ssh.com/academy/ssh/command
- https://supporthost.com/it/connessione-ssh/
- https://www.youtube.com/watch?v=wZ5uMcqxjXo
- https://guide.debianizzati.org/index.php/OpenSSH
- https://www.digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server
- https://introserv.com/it/tutorials/changing-the-ssh-port/


# Tokens
- prompt_tokens: 296
- completion_tokens: 2721
- total_tokens: 3017
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.041, 'request_cost': 0.006, 'total_cost': 0.048}


# Content
```markdown
# Chapitre 13 : Le protocole SSH

Le protocole SSH (Secure Shell) est un protocole réseau cryptographique utilisé pour établir des connexions sécurisées à distance entre deux systèmes. Il permet de gérer des serveurs, d’exécuter des commandes, de transférer des fichiers et de configurer des tunnels sécurisés. Ce chapitre détaille les aspects fondamentaux du protocole SSH, avec des exemples pratiques, des scripts Bash, des tableaux explicatifs et des schémas illustratifs.

---

## Introduction au protocole SSH

SSH est un protocole standard pour l’accès sécurisé à distance à des systèmes Linux/Unix. Il remplace les protocoles anciens et non sécurisés comme Telnet ou rlogin.

### Fonctionnalités principales

- Accès à distance sécurisé (chiffrement des données)
- Authentification forte (mot de passe, clés RSA/DSA/ECDSA)
- Transfert de fichiers (SCP, SFTP)
- Tunneling et redirection de ports

### Architecture SSH

SSH fonctionne selon un modèle client-serveur :
- Le **client SSH** initie la connexion (ex : `ssh`, PuTTY)
- Le **serveur SSH** (sshd) écoute sur un port (par défaut 22) et gère les connexions entrantes

### Versions du protocole

| Version | Description |
|---------|-------------|
| SSH-1   | Ancienne version, vulnérable, déconseillée |
| SSH-2   | Version actuelle, sécurisée, recommandée |

---

## Connexion à un serveur

La connexion SSH se fait via la commande `ssh` sur la plupart des systèmes Linux, macOS et Windows (avec OpenSSH ou PuTTY).

### Syntaxe de base

```bash
ssh [options] [utilisateur@]adresse_ip [-p port]
```

### Exemple de connexion

```bash
ssh admin@192.168.1.10
```

- Si le port n’est pas le 22, spécifier avec `-p` :
```bash
ssh admin@192.168.1.10 -p 2222
```

### Schéma de connexion SSH

```
+----------------+       +-----------------+
|   Client SSH   | ----> |   Serveur SSH   |
| (ssh, PuTTY)   |       |   (sshd)        |
+----------------+       +-----------------+
```

---

## Configuration sécurisée du serveur

Configurer correctement le serveur SSH est essentiel pour éviter les attaques.

### Installation du serveur SSH (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install openssh-server
```

### Fichier de configuration

Le fichier principal est `/etc/ssh/sshd_config`.

#### Exemple de configuration sécurisée

```conf
# Désactiver l'accès root
PermitRootLogin no

# Changer le port par défaut
Port 2222

# Désactiver l'authentification par mot de passe
PasswordAuthentication no

# Autoriser uniquement l'authentification par clé
PubkeyAuthentication yes

# Limiter les utilisateurs autorisés
AllowUsers admin user1

# Désactiver les protocoles anciens
Protocol 2

# Limiter le nombre de tentatives
MaxAuthTries 3
```

### Redémarrer le service SSH

```bash
sudo systemctl restart ssh
```

### Tableau des options de sécurité

| Option                  | Valeur recommandée | Description |
|-------------------------|--------------------|-------------|
| PermitRootLogin         | no                 | Interdire l’accès root |
| PasswordAuthentication  | no                 | Désactiver l’authentification par mot de passe |
| PubkeyAuthentication    | yes                | Activer l’authentification par clé |
| Port                    | 2222               | Changer le port par défaut |
| AllowUsers              | admin user1        | Limiter les utilisateurs autorisés |
| Protocol                | 2                  | Utiliser SSH-2 uniquement |
| MaxAuthTries            | 3                  | Limiter les tentatives |

---

## Protéger ses clés privées et configurer des options SSH sur le client

Les clés SSH sont sensibles. Il est crucial de les protéger.

### Génération d’une paire de clés

```bash
ssh-keygen -t rsa -b 4096 -C "comment"
```

- `-t rsa` : type de clé
- `-b 4096` : taille de la clé
- `-C "comment"` : commentaire optionnel

### Protection des clés

- Stocker la clé privée dans `~/.ssh/id_rsa`
- Protéger la clé avec un mot de passe (passphrase)
- Changer les permissions :
```bash
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### Configuration du client SSH

Le fichier `~/.ssh/config` permet de configurer des options par défaut.

#### Exemple de configuration

```conf
Host mon-serveur
    HostName 192.168.1.10
    User admin
    Port 2222
    IdentityFile ~/.ssh/id_rsa
```

### Tableau des options de configuration client

| Option          | Description |
|-----------------|-------------|
| Host            | Alias pour la connexion |
| HostName        | Adresse IP ou nom d’hôte |
| User            | Utilisateur distant |
| Port            | Port SSH |
| IdentityFile    | Chemin vers la clé privée |

---

## Développement distant avec SSH et VS Code

VS Code permet de développer directement sur un serveur distant via SSH.

### Installation de l’extension Remote-SSH

- Ouvrir VS Code
- Installer l’extension "Remote-SSH"
- Se connecter via l’icône "Remote Explorer"

### Connexion avec VS Code

- Cliquer sur "Connect to Host"
- Entrer la configuration SSH (alias, IP, port, clé)

### Schéma de développement distant

```
+----------------+       +-----------------+       +-----------------+
|   VS Code      | ----> |   SSH Client    | ----> |   Serveur SSH   |
|   (Local)      |       |   (ssh)         |       |   (sshd)        |
+----------------+       +-----------------+       +-----------------+
```

---

## Les paires de clé

Les paires de clés SSH sont composées d’une clé publique et d’une clé privée.

### Génération d’une paire de clés

```bash
ssh-keygen -t rsa -b 4096 -C "admin@serveur"
```

### Copie de la clé publique sur le serveur

```bash
ssh-copy-id admin@192.168.1.10
```

### Structure des fichiers

| Fichier           | Description |
|-------------------|-------------|
| `id_rsa`          | Clé privée |
| `id_rsa.pub`      | Clé publique |
| `authorized_keys` | Clés publiques autorisées sur le serveur |

### Schéma de génération et d’utilisation des clés

```
+----------------+       +-----------------+
|   Client SSH   | ----> |   Serveur SSH   |
|   (id_rsa)     |       |   (authorized_keys) |
+----------------+       +-----------------+
```

---

## Exemples de scripts Bash

### Script de connexion SSH

```bash
#!/bin/bash
# Connexion SSH à un serveur
ssh admin@192.168.1.10 -p 2222
```

### Script de génération de clés

```bash
#!/bin/bash
# Génération d'une paire de clés SSH
ssh-keygen -t rsa -b 4096 -C "admin@serveur"
```

### Script de copie de clé publique

```bash
#!/bin/bash
# Copie de la clé publique sur le serveur
ssh-copy-id admin@192.168.1.10
```

---

## Tableaux récapitulatifs

### Tableau des commandes SSH

| Commande                  | Description |
|---------------------------|-------------|
| `ssh user@host`           | Connexion SSH |
| `ssh-keygen`              | Génération de clés |
| `ssh-copy-id`             | Copie de la clé publique |
| `scp`                     | Transfert de fichiers |
| `sftp`                    | Transfert de fichiers sécurisé |

### Tableau des options de sécurité

| Option                  | Valeur recommandée | Description |
|-------------------------|--------------------|-------------|
| PermitRootLogin         | no                 | Interdire l’accès root |
| PasswordAuthentication  | no                 | Désactiver l’authentification par mot de passe |
| PubkeyAuthentication    | yes                | Activer l’authentification par clé |
| Port                    | 2222               | Changer le port par défaut |
| AllowUsers              | admin user1        | Limiter les utilisateurs autorisés |
| Protocol                | 2                  | Utiliser SSH-2 uniquement |
| MaxAuthTries            | 3                  | Limiter les tentatives |

---

## Schémas et illustrations

### Schéma de connexion SSH

```
+----------------+       +-----------------+
|   Client SSH   | ----> |   Serveur SSH   |
| (ssh, PuTTY)   |       |   (sshd)        |
+----------------+       +-----------------+
```

### Schéma de génération et d’utilisation des clés

```
+----------------+       +-----------------+
|   Client SSH   | ----> |   Serveur SSH   |
|   (id_rsa)     |       |   (authorized_keys) |
+----------------+       +-----------------+
```

### Schéma de développement distant

```
+----------------+       +-----------------+       +-----------------+
|   VS Code      | ----> |   SSH Client    | ----> |   Serveur SSH   |
|   (Local)      |       |   (ssh)         |       |   (sshd)        |
+----------------+       +-----------------+       +-----------------+
```

---

## Conclusion

Le protocole SSH est un outil essentiel pour l’administration système et le développement distant. Une configuration sécurisée, l’utilisation de paires de clés et la protection des clés privées sont des pratiques fondamentales pour garantir la sécurité des connexions à distance.

---

## Références

- [Cherry Servers - How to connect to a Linux server using SSH](https://docs.cherryservers.com/knowledge/how-to-connect-to-a-linux-server-using-ssh)
- [Hostman - How to install and configure SSH on an Ubuntu server](https://hostman.com/tutorials/how-to-install-and-configure-ssh-on-an-ubuntu-server/)
- [Zenarmor - How to Configure and Enable SSH in Ubuntu](https://www.zenarmor.com/docs/linux-tutorials/how-to-configure-and-enable-ssh-in-ubuntu)
- [GeeksforGeeks - Linux SSH Server (sshd) Configuration and Security](https://www.geeksforgeeks.org/linux-unix/linux-ssh-server-sshd-configuration-and-security-options-with-examples/)
- [SSH Academy - SSH command usage, options, and configuration in Linux](https://www.ssh.com/academy/ssh/command)
- [Supporthost - Connexion SSH](https://supporthost.com/it/connessione-ssh/)
- [Guide Debianizzati - OpenSSH](https://guide.debianizzati.org/index.php/OpenSSH)
- [DigitalOcean - How to Use SSH to Connect to a Remote Server](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-to-connect-to-a-remote-server)
- [Introserv - Modification de la porte SSH](https://introserv.com/it/tutorials/changing-the-ssh-port/)
```
