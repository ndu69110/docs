# Citations
- https://www.pierre-giraud.com/http-reseau-securite-cours/modele-reseau-osi-tcp-ip/
- https://docs.oracle.com/cd/E19957-01/820-2982/6nei1phdf/index.html
- https://aws.amazon.com/fr/what-is/osi-model/
- https://www.fortinet.com/fr/resources/cyberglossary/tcp-ip-model-vs-osi-model
- https://cisco.goffinet.org/ccna/fondamentaux/modeles-tcp-ip-osi/
- https://lfasquelle.forge.apps.education.fr/transmission/modele.html
- https://www.youtube.com/watch?v=26jazyc7VNk
- https://blog.stephane-robert.info/docs/reseaux/protocole-ip/
- https://www.reseaucerta.org/sites/default/files/modelesDeReference_etudiant.pdf
- https://btssri13.files.wordpress.com/2013/04/les-modc3a8les-osi-et-tcp-ip.pdf


# Tokens
- prompt_tokens: 316
- completion_tokens: 7968
- total_tokens: 8284
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.12, 'request_cost': 0.006, 'total_cost': 0.126}


# Content
# Chapitre 2 : Introduction aux protocoles réseaux

## Le réseau Internet

Internet représente une infrastructure mondiale de communication basée sur un ensemble de protocoles standardisés permettant l'interconnexion de millions d'ordinateurs et de dispositifs. Cette infrastructure s'appuie sur une architecture décentralisée où les données circulent en empruntant les chemins les plus efficaces à travers des routeurs interconnectés[1].

Le fonctionnement d'Internet repose sur une philosophie fondamentale : la transmission de données en paquets. Contrairement aux systèmes de communication traditionnels utilisant des connexions dédiées (comme le réseau téléphonique), Internet fragmentmente les informations en petites unités appelées paquets, chacun voyageant indépendamment vers sa destination[1]. Cette approche confère à Internet une résilience remarquable : si un chemin devient indisponible, les paquets peuvent emprunter des routes alternatives sans interruption majeure du service.

L'infrastructure Internet s'organise selon une hiérarchie de réseaux. Les fournisseurs d'accès Internet (FAI) interconnectent leurs réseaux aux points d'échange Internet (IXP), créant ainsi une toile complexe permettant à n'importe quel ordinateur de communiquer avec n'importe quel autre[1]. Les protocoles TCP/IP constituent le fondement technique de cette interconnexion, définissant les règles d'échange des données entre les ordinateurs.

## Présentation du modèle OSI et introduction à TCP/IP

La compréhension des modèles réseau constitue une étape essentielle pour maîtriser les technologies cloud d'Azure. Deux modèles théoriques dominent ce domaine : le modèle OSI et le modèle TCP/IP[1].

### Le modèle OSI (Open Systems Interconnection)

Le modèle OSI représente une approche **conceptuelle idéalisée** de la communication réseau. Il décompose le processus de communication en **sept couches distinctes**, permettant d'analyser et d'optimiser chaque aspect de la transmission de données de manière isolée[1][3].

| N° Couche | Nom de la couche | Unité de données | Rôle principal |
|---|---|---|---|
| 7 | Application | Données brutes | Protocoles utilisateur (HTTP, SMTP, FTP, DNS) |
| 6 | Présentation | Données brutes | Conversion de format, chiffrement, compression |
| 5 | Session | Données brutes | Gestion des sessions et dialogues |
| 4 | Transport | Segments | TCP, UDP, garantie de livraison |
| 3 | Réseau | Paquets | Routage, adressage IP |
| 2 | Liaison des données | Frames | Adressage MAC, détection d'erreurs |
| 1 | Physique | Bits | Transmission électrique/optique |

**La couche application (7)** comprend les protocoles de haut niveau destinés aux utilisateurs et aux applications. HTTP permet la consultation de pages web, SMTP gère l'envoi de courriels, FTP assure le transfert de fichiers, et DNS traduit les noms de domaine en adresses IP[1].

**La couche présentation (6)** transforme les données en un format lisible par l'application destinataire. Elle gère la conversion de codage de caractères, la compression des données et le chiffrement des informations sensibles[1].

**La couche session (5)** établit, maintient et termine les connexions entre applications. Elle contrôle le dialogue entre deux systèmes, évitant les conflits de transmission[1].

**La couche transport (4)** garantit le transport fiable des données entre deux ordinateurs. Les protocoles TCP et UDP opèrent à ce niveau, avec TCP offrant une transmission garantie et UDP privilégiant la rapidité[1].

**La couche réseau (3)** détermine le meilleur chemin pour acheminer les paquets à travers le réseau. Le protocole IP assigne les adresses uniques et gère le routage des données[1][3].

**La couche liaison des données (2)** gère les communications entre deux machines directement connectées. Elle découpe les données en frames de tailles variables et détecte les erreurs survenant lors de la transmission[1]. Les adresses MAC (Media Access Control) opèrent à ce niveau, permettant l'identification unique de chaque périphérique sur un segment réseau.

**La couche physique (1)** représente le niveau matériel où les bits (0 et 1) sont encodés sous forme de signaux électriques ou d'impulsions lumineuses dans les câbles ou la fibre optique[1].

### Le modèle TCP/IP (Transmission Control Protocol / Internet Protocol)

Le modèle TCP/IP constitue une **implémentation pratique** des principes de communication réseau. Contrairement au modèle OSI, il regroupé les sept couches conceptuelles en un nombre réduit de couches opérationnelles[1][4].

Des sources officielles mentionnent **quatre couches** tandis que d'autres en décrivent **cinq**, selon le degré de détail retenu[1][3][5]. La version à quatre couches agrège la couche physique avec la couche liaison des données dans une couche unique appelée "Accès réseau"[5].

| Couche TCP/IP | Équivalent OSI | Protocoles associés |
|---|---|---|
| Application | Couches 5, 6, 7 (Session, Présentation, Application) | HTTP, HTTPS, SMTP, POP3, IMAP, FTP, DNS, SSH, Telnet |
| Transport | Couche 4 (Transport) | TCP, UDP, QUIC, SCTP |
| Internet | Couche 3 (Réseau) | IP (IPv4, IPv6), ICMP, IGMP |
| Accès réseau | Couches 1, 2 (Physique, Liaison de données) | Ethernet, Wi-Fi, PPP, SLIP |

La distinction majeure entre les deux modèles réside dans la **granularité** : le modèle TCP/IP regroupe certaines fonctions du modèle OSI en couches unifiées pour refléter la réalité pratique des implémentations réseau contemporaines[1][4].

### Le processus d'encapsulation

La transmission de données à travers le modèle TCP/IP suit un processus appelé **encapsulation**. Chaque couche ajoute ses propres en-têtes aux données, transformant progressivement le message original[1].

Lorsqu'un navigateur demande une page web :

1. **Couche Application** : Le protocole HTTP crée une requête HTTP contenant l'URL et les paramètres demandés.

2. **Couche Transport** : TCP ajoute un en-tête de transport contenant le port source et le port destination, transformant le message en segment[1].

3. **Couche Internet** : IP ajoute un en-tête avec l'adresse IP source et l'adresse IP destination, créant un paquet[1].

4. **Couche Accès réseau** : Ethernet ajoute un en-tête contenant les adresses MAC source et destination, formant une frame. Les données sont ensuite transformées en bits (signaux électriques ou lumineux)[1].

À la réception, ce processus s'inverse : les bits se reconstituent en frames, puis en paquets, en segments, et finalement en données originales que l'application peut traiter[1].

## L'adressage réseau avec le protocole Internet (IP)

L'adressage IP représente le fondement de la routabilité sur Internet. Deux versions du protocole Internet coexistent actuellement : IPv4 et IPv6, chacune utilisant un système d'adressage distinct[1][3].

### IPv4 (Internet Protocol version 4)

IPv4 utilise des adresses de **32 bits** organisées en quatre octets (bytes), chacun pouvant représenter une valeur de 0 à 255. Cet ensemble de quatre nombres séparés par des points constitue la notation décimale pointée[1].

Exemple d'adresse IPv4 : `192.168.1.100`

Chaque octet représente 8 bits, permettant 256 valeurs possibles :
- `192` = `11000000` en binaire
- `168` = `10101000` en binaire
- `1` = `00000001` en binaire
- `100` = `01100100` en binaire

Les adresses IPv4 se divisent en deux composants logiques : l'adresse réseau et l'adresse d'hôte. Le masque de sous-réseau détermine où s'effectue cette division[1].

**Les classes d'adresses IPv4 (classique, obsolète pour les nouvelles allocations)** :

| Classe | Plage | Masque par défaut | Usage |
|---|---|---|---|
| A | 1.0.0.0 à 126.255.255.255 | 255.0.0.0 (/8) | Réseaux très larges |
| B | 128.0.0.0 à 191.255.255.255 | 255.255.0.0 (/16) | Réseaux de taille moyenne |
| C | 192.0.0.0 à 223.255.255.255 | 255.255.255.0 (/24) | Petits réseaux |
| D | 224.0.0.0 à 239.255.255.255 | - | Multicast |
| E | 240.0.0.0 à 255.255.255.255 | - | Réservé |

**Les adresses privées réservées** (RFC 1918) ne sont pas routables sur Internet :

- Classe A privée : `10.0.0.0/8` (10.0.0.0 à 10.255.255.255)
- Classe B privée : `172.16.0.0/16` (172.16.0.0 à 172.31.255.255)
- Classe C privée : `192.168.0.0/24` (192.168.0.0 à 192.168.255.255)

Ces plages s'utilisent couramment dans les réseaux d'entreprise et les environnements cloud privés.

### IPv6 (Internet Protocol version 6)

IPv6 résout la limitation majeure d'IPv4 : l'épuisement des adresses disponibles. Utilisant des adresses de **128 bits**, IPv6 offre un espace d'adressage pratiquement illimité[1][3].

Exemple d'adresse IPv6 : `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

La notation IPv6 s'écrit en hexadécimal, avec 8 groupes de 4 chiffres hexadécimaux séparés par des deux-points. Pour simplifier, les zéros à gauche peuvent s'omettre et les séquences de groupes contenant uniquement des zéros peuvent se remplacer par `::`

Forme simplifiée : `2001:db8:85a3::8a2e:370:7334`

**Les types d'adresses IPv6** :

- **Unicast** : Communication point à point (un expéditeur, un destinataire)
- **Multicast** : Communication un-vers-plusieurs (un expéditeur, plusieurs destinataires)
- **Anycast** : Communication vers le service le plus proche

### Le masque de sous-réseau et la notation CIDR

Le masque de sous-réseau détermine quels bits d'une adresse IP identifient le réseau et quels bits identifient l'hôte. La notation CIDR (Classless Inter-Domain Routing) simplifie cette représentation en indiquant le nombre de bits réseau[1].

Notation CIDR : `192.168.1.0/24`

- `/24` signifie que les 24 premiers bits identifient le réseau
- Les 8 bits restants (32 - 24) identifient les hôtes
- Ce réseau peut accueillir 254 adresses d'hôtes (256 - 2 : une pour le réseau, une pour le broadcast)

**Exemples de masques courants** :

| Notation CIDR | Masque décimal | Nombre d'hôtes |
|---|---|---|
| /8 | 255.0.0.0 | 16 777 214 |
| /16 | 255.255.0.0 | 65 534 |
| /24 | 255.255.255.0 | 254 |
| /30 | 255.255.255.252 | 2 |
| /32 | 255.255.255.255 | 1 (hôte unique) |

## Le transport sur le réseau avec les protocoles TCP, UDP et QUIC

La couche transport garantit l'acheminement fiable ou rapide des données entre processus sur différents ordinateurs. Trois protocoles dominent ce niveau : TCP, UDP et QUIC, chacun adapté à des besoins spécifiques[1].

### TCP (Transmission Control Protocol)

TCP fournit une communication **fiable, ordonnée et sans erreur** entre deux ordinateurs. Il établit une connexion avant de transmettre les données et garantit que tous les paquets arrivent à destination dans le bon ordre[1][4].

**Caractéristiques de TCP** :

- **Connexion établie** : Utilise une poignée de main à trois étapes (three-way handshake) avant transmission
- **Transmission fiable** : Retransmission automatique des paquets perdus
- **Contrôle de flux** : Régulation de la vitesse de transmission selon la capacité du récepteur
- **Détection d'erreurs** : Vérification d'intégrité des données via checksums
- **Ordonnancement** : Assemblage des segments dans le bon ordre

**Le processus de trois-way handshake** :

```
Client                                          Serveur
  |                                                |
  |-------- SYN (seq=x) ---------------------->   |
  |                                                |
  |  <----- SYN-ACK (seq=y, ack=x+1) ------  |
  |                                                |
  |-------- ACK (seq=x+1, ack=y+1) -------->   |
  |                                                |
  |--- Connexion établie, transfert de données -|
```

**Utilisations courantes** :
- HTTP/HTTPS (navigation web)
- SMTP (envoi de courriels)
- FTP (transfert de fichiers)
- SSH (accès sécurisé à distance)
- Bases de données (MySQL, PostgreSQL, SQL Server)

### UDP (User Datagram Protocol)

UDP privilégie la **vitesse plutôt que la fiabilité**. Il ne garantit pas la livraison des paquets ni leur ordre d'arrivée, mais offre une latence minimale, d'où son utilisation pour les applications temps réel[1][4].

**Caractéristiques d'UDP** :

- **Sans connexion** : Pas d'établissement de connexion préalable
- **Transmission non fiable** : Les paquets perdus ne sont pas retransmis
- **Pas d'ordonnancement** : Les paquets peuvent arriver désordonnés
- **En-têtes légers** : Surcharge minimale par rapport à TCP
- **Broadcast et multicast** : Support de la transmission à plusieurs destinataires

**Utilisations courantes** :
- VoIP (communication vocale)
- Vidéoconférence
- Jeux en ligne
- Streaming vidéo
- Requêtes DNS
- NTP (synchronisation d'horloge)

### QUIC (Quick UDP Internet Connections)

QUIC représente un protocole **moderne** qui combine les avantages de TCP et UDP. Développé par Google et standardisé par l'IETF, QUIC s'intègre à HTTP/3 pour offrir des performances améliorées[4].

**Caractéristiques de QUIC** :

- **Basé sur UDP** : Hérite de la vitesse d'UDP
- **Fiabilité comme TCP** : Garantit la livraison et l'ordonnancement
- **Établissement de connexion rapide** : Réduit la latence initiale
- **Migration de connexion** : Préserve la connexion lors d'un changement de réseau (WiFi vers cellulaire)
- **Chiffrement natif** : TLS 1.3 intégré par défaut
- **Multiplexing** : Gestion simultanée de plusieurs flux de données

**Utilisations courantes** :
- HTTP/3 et navigation web moderne
- Applications cloud
- Streaming média
- Applications mobiles

### Comparaison des protocoles de transport

| Caractéristique | TCP | UDP | QUIC |
|---|---|---|---|
| Fiabilité | Garantie | Non garantie | Garantie |
| Ordre de livraison | Préservé | Non préservé | Préservé |
| Latence | Plus élevée | Minimale | Minimale |
| Établissement connexion | Oui (3 étapes) | Non | Oui (1 RTT) |
| Surcharge en-têtes | Moyenne | Faible | Faible |
| Contrôle de flux | Oui | Non | Oui |
| Chiffrement natif | Non (via TLS) | Non | Oui (TLS 1.3) |
| Migration connexion | Non | N/A | Oui |

## La couche applicative avec les protocoles HTTP, SMTP et FTP

La couche application englobe tous les protocoles permettant aux utilisateurs et aux applications d'interagir avec le réseau. Trois protocoles essentiels dominent ce domaine[1].

### HTTP (HyperText Transfer Protocol) et HTTPS

HTTP constitue le **protocole fondateur** du Web. Il définit les règles d'échange de documents hypertexte entre un client (navigateur) et un serveur[1].

**Caractéristiques de HTTP** :

- **Architecture requête/réponse** : Le client envoie une requête, le serveur répond
- **Sans état** : Chaque requête s'exécute indépendamment, les cookies et sessions assurent la persistance
- **Basé sur TCP** : Utilise TCP comme protocole de transport (port 80 par défaut)

**Les méthodes HTTP principales** :

| Méthode | Description | Sûre | Idempotente |
|---|---|---|---|
| GET | Récupère une ressource | Oui | Oui |
| POST | Crée une ressource | Non | Non |
| PUT | Remplace une ressource | Non | Oui |
| PATCH | Modifie partiellement une ressource | Non | Non |
| DELETE | Supprime une ressource | Non | Oui |
| HEAD | Comme GET mais sans corps de réponse | Oui | Oui |
| OPTIONS | Décrit les options de communication | Oui | Oui |

**Exemple d'une requête HTTP** :

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html,application/xhtml+xml
Accept-Language: fr-FR
Connection: keep-alive
```

**Exemple d'une réponse HTTP** :

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
Cache-Control: max-age=3600
Connection: keep-alive

<!DOCTYPE html>
<html>
<head><title>Accueil</title></head>
<body>
...contenu de la page...
</body>
</html>
```

**Les codes de statut HTTP** :

- **1xx (Information)** : 100 Continue, 101 Switching Protocols
- **2xx (Succès)** : 200 OK, 201 Created, 204 No Content
- **3xx (Redirection)** : 301 Moved Permanently, 302 Found, 304 Not Modified
- **4xx (Erreur client)** : 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- **5xx (Erreur serveur)** : 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable

**HTTPS (HTTP Secure)** chiffre la communication en ajoutant une couche SSL/TLS au-dessus d'HTTP. Cette protection s'avère essentielle pour les transactions sensibles[1].

### SMTP (Simple Mail Transfer Protocol)

SMTP gère l'**envoi de courriels** depuis un client vers un serveur de messagerie ou d'un serveur à un autre[1].

**Caractéristiques de SMTP** :

- **Port 25 (non chiffré), 465 (SMTPS), 587 (SMTP avec STARTTLS)** : Ports standards de connexion
- **Basé sur TCP** : Utilise TCP comme protocole de transport
- **Architecture requête/réponse** : Dialogue texte entre client et serveur

**Exemple d'une session SMTP** :

```
220 mail.example.com ESMTP server ready
EHLO client.example.com
250-mail.example.com
250-STARTTLS
250-AUTH LOGIN PLAIN
250 HELP
STARTTLS
220 Ready to start TLS
AUTH LOGIN
334 VXNlcm5hbWU6
dXNlckBleGFtcGxlLmNvbQ==
334 UGFzc3dvcmQ6
cGFzc3dvcmQxMjM=
235 2.7.0 Accepted
MAIL FROM:<sender@example.com>
250 OK
RCPT TO:<recipient@example.com>
250 OK
DATA
354 Start mail input; end with <CRLF>.<CRLF>
From: sender@example.com
To: recipient@example.com
Subject: Test
This is a test email.
.
250 OK
QUIT
221 Goodbye
```

### Protocoles complémentaires de messagerie

**POP3 (Post Office Protocol version 3)** permet le téléchargement de courriels depuis un serveur. Une fois téléchargés, les messages s'effacent généralement du serveur (bien que cette suppression puisse s'éviter)[1].

**IMAP (Internet Message Access Protocol)** offre un contrôle plus granulaire. Les courriels restent sur le serveur, permettant à plusieurs clients d'accéder à la même boîte de réception[1].

### FTP (File Transfer Protocol)

FTP assure le **transfert de fichiers** entre ordinateurs sur un réseau. Il utilise deux canaux TCP distincts : un canal de contrôle (port 21) pour les commandes et un canal de données (port 20) pour le contenu des fichiers[1].

**Caractéristiques de FTP** :

- **Mode actif et passif** : Deux modes de fonctionnement selon que le serveur ou le client établit la connexion de données
- **Authentification** : Nom d'utilisateur et mot de passe généralement requis (transmis en clair, d'où le risque de sécurité)
- **Répertoires virtuels** : Navigation dans une arborescence de fichiers

**Mode passif (recommandé)** :

```
Client                                   Serveur FTP
  |                                            |
  |---- CONNECTION (port 21) --------->        |
  |  <------ 220 Service Ready -------         |
  |                                            |
  |---- USER anonymous -------->               |
  |  <------ 331 Password required ---         |
  |                                            |
  |---- PASS user@example.com ------->         |
  |  <------ 230 Logged in --------           |
  |                                            |
  |---- PASV (Port passif) -------->           |
  |  <------ 227 Entering Passive Mode        |
  |          (192,168,1,100,15,16) ---         |
  |                                            |
  |---- Connexion données (port 3856) ------->|
  |  <----- 150 Opening data connection       |
  |                                            |
  |  <----- Données de fichier -------        |
  |                                            |
  |  <----- 226 Transfer complete ---         |
  |                                            |
  |---- QUIT ------------------------------>  |
  |  <------ 221 Goodbye --------             |
```

**Commandes FTP courantes** :

- `USER` : Authentification utilisateur
- `PASS` : Mot de passe
- `LIST` : Listing des fichiers du répertoire courant
- `CWD` : Changement de répertoire
- `RETR` : Téléchargement (récupération)
- `STOR` : Upload (stockage)
- `DEL` : Suppression de fichier
- `MKD` : Création de répertoire
- `RMD` : Suppression de répertoire
- `QUIT` : Déconnexion

**SFTP (SSH File Transfer Protocol)** et **SCP (Secure Copy Protocol)** constituent des alternatives sécurisées à FTP, utilisant SSH pour chiffrer les communications.

## Le protocole DNS et serveurs DNS

DNS (Domain Name System) traduit les **noms de domaine lisibles** en **adresses IP routables** que les ordinateurs peuvent utiliser[1].

### Fonctionnement du DNS

Lorsqu'un navigateur visite `www.example.com`, plusieurs étapes s'exécutent en arrière-plan :

1. **Requête au résolveur local** : L'ordinateur client envoie une requête DNS à son résolveur configuré (généralement fourni par le FAI)

2. **Requête aux serveurs racine** : Si le résolveur ne connaît pas la réponse, il interroge un serveur racine qui répond avec l'adresse d'un serveur de noms TLD

3. **Requête au serveur TLD** : Le résolveur interroge le serveur TLD (com, fr, org, etc.) qui répond avec l'adresse du serveur de noms autoritaire pour example.com

4. **Requête au serveur autoritaire** : Le résolveur interroge le serveur de noms autoritaire qui fournit l'adresse IP réelle

5. **Réponse au client** : Le résolveur renvoie l'adresse IP au client, qui établit une connexion[1]

### Hiérarchie DNS et types d'enregistrements

La structure DNS s'organise hiérarchiquement du plus général au plus spécifique :

```
.                          (racine)
├── com
│   └── example.com
│       ├── www
│       ├── mail
│       └── ftp
├── fr
│   └── example.fr
├── org
└── ...
```

**Les enregistrements DNS principaux** :

| Type | Description | Exemple |
|---|---|---|
| A | Adresse IPv4 | `www.example.com → 192.0.2.1` |
| AAAA | Adresse IPv6 | `www.example.com → 2001:db8::1` |
| CNAME | Alias de domaine | `alias.example.com → www.example.com` |
| MX | Serveur de messagerie | `example.com → mail.example.com` |
| NS | Serveur de noms | `example.com → ns1.example.com` |
| TXT | Enregistrement texte | `example.com → SPF, DKIM, etc.` |
| SOA | Autorité de zone | Informations administratives |
| PTR | Reverse DNS | `1.2.0.192.in-addr.arpa → www.example.com` |
| SRV | Service | `_service._proto.name → serveur:port` |

### Configuration DNS dans Azure

Dans Azure, les services DNS se configurent via Azure DNS qui héberge les zones DNS avec haute disponibilité[1].

```yaml
Zone: example.com
Enregistrements:
  - Type: A
    Nom: www
    TTL: 3600
    Valeur: 20.84.156.23
  
  - Type: A
    Nom: api
    TTL: 3600
    Valeur: 20.84.156.24
  
  - Type: CNAME
    Nom: blog
    TTL: 3600
    Valeur: www.example.com
  
  - Type: MX
    Nom: @
    TTL: 3600
    Priorité: 10
    Valeur: mail.example.com
  
  - Type: TXT
    Nom: @
    TTL: 3600
    Valeur: v=spf1 include:_spf.google.com ~all
```

### Mise en cache DNS

Le DNS utilise un système de **mise en cache** pour réduire le trafic réseau. Chaque enregistrement possède une valeur TTL (Time To Live) en secondes indiquant la durée pendant laquelle la réponse peut être mise en cache[1].

| TTL | Signification |
|---|---|
| 300 | 5 minutes (changements fréquents attendus) |
| 3600 | 1 heure (configuration stable) |
| 86400 | 24 heures (configuration très stable) |

## Sécurisation des échanges avec les protocoles SSL et TLS

La sécurité des communications réseau repose sur la **chiffrement et l'authentification** fournis par SSL (Secure Sockets Layer) et son successeur TLS (Transport Layer Security)[1].

### SSL et TLS : concepts fondamentaux

SSL/TLS opère à la **couche 5 ou 6 du modèle OSI** (entre la couche application et la couche transport), créant un tunnel sécurisé pour les données sensibles[1].

**Versions historiques et actuelles** :

| Version | Date | Statut | Notes |
|---|---|---|---|
| SSL 2.0 | 1995 | Obsolète | De nombreuses vulnérabilités |
| SSL 3.0 | 1996 | Obsolète | Vulnérabilités découvertes |
| TLS 1.0 | 1999 | Dépréciée | Basée sur SSL 3.0, vulnérabilités |
| TLS 1.1 | 2006 | Dépréciée | Améliorations limitées |
| TLS 1.2 | 2008 | Recommandée | Largement déployée |
| TLS 1.3 | 2018 | Actuelle | Plus rapide, plus sûre |

### Fonctionnement de la poignée de main TLS 1.2

La poignée de main TLS établit une connexion sécurisée entre client et serveur en plusieurs étapes :

```
Client                                  Serveur
  |                                        |
  |------ ClientHello -------->            |
  |   (versions supportées,                |
  |    cipher suites, etc.)                |
  |                                        |
  |       <------ ServerHello --------     |
  |       (version TLS choisie,            |
  |        cipher suite, certificat)       |
  |                                        |
  |       <------ ServerKeyExchange       |
  |       (paramètres de clé)              |
  |                                        |
  |       <------ ServerHelloDone -       |
  |                                        |
  |------ ClientKeyExchange ------>        |
  |   (clé de session chiffrée)            |
  |                                        |
  |------ ChangeCipherSpec ------>        |
  |------ Finished -------->               |
  |                                        |
  |       <------ ChangeCipherSpec       |
  |       <------ Finished -------        |
  |                                        |
  |= = = = Connexion sécurisée = = = = = =|
```

### Certificats X.509

Les certificats X.509 authentifient l'identité d'un serveur. Ils contiennent :

- **Informations du sujet** : Domaine, organisation
- **Clé publique** : Utilisée pour chiffrer les données
- **Signature de l'autorité de certification (CA)** : Valide le certificat
- **Période de validité** : Date de début et d'expiration
- **Extensions** : SAN (Subject Alternative Names), contraintes, etc.

**Exemple de certificat** :

```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 03:f5:5f:8b:5d:f3:24:d9
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C=US, O=Let's Encrypt, CN=R3
        Validity
            Not Before: Dec  2 07:31:40 2024 GMT
            Not After : Mar  2 07:31:39 2025 GMT
        Subject: CN=www.example.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (2048 bit)
        X509v3 extensions:
            X509v3 Subject Alternative Name:
                DNS:www.example.com, DNS:example.com
```

### Types de certificats SSL/TLS

| Type | Domaines couverts | Coût | Validation |
|---|---|---|---|
| Wildcard | Un domaine et tous les sous-domaines | Modéré | Domaine |
| Multi-SAN | Plusieurs domaines spécifiques | Modéré à élevé | Domaines |
| Single | Un seul domaine exact | Faible | Domaine |
| EV (Extended Validation) | Un domaine avec validation approfondie | Élevé | Organisation |

### Implémentation de HTTPS dans Azure

Azure fournit des certificats SSL/TLS gérés pour les services cloud. Azure Application Gateway, Azure CDN et App Service proposent tous des options de certificats gratuits via Let's Encrypt ou des certificats personnalisés importés[1].

```yaml
# Configuration Azure Application Gateway
Listeners:
  - Protocol: HTTPS
    Port: 443
    Certificate: 
      Name: www-example-com-cert
      Thumbprint: A1B2C3D4E5F6...
    HostName: www.example.com

Backend Settings:
  - Protocol: HTTPS
    Port: 443
    BackendHttpSettings:
      CookieBasedAffinity: Enabled
      RequestTimeout: 30
```

### Chaîne de certificats et autorités de certification

Un certificat valide s'accompagne d'une **chaîne de confiance** reliant le certificat du serveur à un certificat racine de confiance du système d'exploitation ou du navigateur[1].

Exemple de chaîne :

```
Certificat serveur (www.example.com)
        ↓
Certificat intermédiaire (Let's Encrypt R3)
        ↓
Certificat racine (ISRG Root X1)
        ↓
Store de certificats racines du système
```

## Intégration des protocoles réseau dans Azure

La maîtrise de ces protocoles réseau s'avère essentielle pour configurer correctement les services Azure. Les services réseau d'Azure s'appuient sur ces protocoles pour assurer la communication sécurisée et efficace.

**Azure Virtual Network (VNet)** gère les adresses IP, les sous-réseaux et le routage au niveau 3 (réseau)[1]. **Azure Network Security Groups** contrôle le trafic TCP et UDP au niveau 4 (transport)[1]. **Azure Application Gateway** assure le routage HTTP/HTTPS au niveau 7 (application)[1].

La compréhension approfondie de ces protocoles permet de diagnostiquer les problèmes de connectivité, d'optimiser les performances et de sécuriser les communications au sein d'une infrastructure cloud d'Azure.
