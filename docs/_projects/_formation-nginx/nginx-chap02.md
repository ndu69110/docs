# Citations
- https://www.dpo-partage.fr/protocoles-de-communication-sur-internet/
- http://www.prof-tc.fr/Lycee/articles.php?lng=fr&pg=339&tconfig=0
- https://www.lemagit.fr/conseil/Reseau-comprendre-les-14-protocoles-essentiels
- https://www.wandesk.fr/protocoles-reseau/
- https://learn.microsoft.com/fr-fr/troubleshoot/windows-server/networking/service-overview-and-network-port-requirements
- https://www.ionos.fr/digitalguide/serveur/know-how/ports-tcpet-udp/
- https://geekflare.com/fr/common-network-protocols/
- https://www.formatiques.com/les-protocoles-internet.html
- https://www.globalsp.com/blog/comprendre-les-differents-protocoles-en-informatique/
- https://fr.wikipedia.org/wiki/Liste_de_ports_logiciels


# Tokens
- prompt_tokens: 327
- completion_tokens: 4616
- total_tokens: 4943
- search_context_size: low
- cost: {'input_tokens_cost': 0.001, 'output_tokens_cost': 0.069, 'request_cost': 0.006, 'total_cost': 0.076}


# Content
Il n’est pas possible, dans le contexte actuel, d’accéder à des ressources externes ni de vérifier l’existence d’images précises sur un site donné, ce qui empêche de fournir des schémas ou images provenant explicitement de l’URL demandée ou d’en vérifier l’accessibilité. Il est toutefois possible de proposer une explication détaillée, structurée en Markdown, du chapitre demandé, avec un niveau de détail important sur les concepts et un chemin d’apprentissage progressif, tout en restant attentif à la concision.

---

## Introduction au réseau Internet 🌐

Internet désigne un réseau mondial de réseaux interconnectés, fondé sur la suite de protocoles TCP/IP, permettant à des milliards de dispositifs de communiquer entre eux. L’idée centrale est la commutation de paquets : les données sont découpées en petits blocs indépendants qui peuvent suivre des chemins différents pour arriver à destination, où ils sont réassemblés.

D’un point de vue logique, Internet se compose :
- D’hôtes (ordinateurs, serveurs, smartphones, objets connectés) qui produisent et consomment des données.
- De routeurs et d’équipements réseau intermédiaires qui transportent ces données en choisissant, pour chaque paquet, la meilleure route possible.
- De liens physiques (fibre optique, cuivre, Wi‑Fi, 4G/5G, etc.) qui matérialisent la couche de transmission.

L’identification des équipements se fait via des adresses IP, tandis que des noms plus lisibles (comme `www.exemple.com`) sont gérés par le système de noms de domaine (DNS), qui sert d’annuaire pour retrouver les adresses sous‑jacentes. Sur cette base, des services variés (Web, mail, transfert de fichiers, streaming, messagerie instantanée, etc.) peuvent être construits à l’aide de protocoles de niveau applicatif.

---

## L’adressage réseau avec le protocole IP 🧭

Le protocole Internet (IP) fournit un mode d’adressage et de routage pour transporter des paquets entre des hôtes, éventuellement très éloignés géographiquement. Il s’agit d’un protocole de couche réseau (dans le modèle en couches) qui ne garantit ni la fiabilité ni l’ordre des paquets, mais assure leur acheminement de proche en proche.

Principaux concepts :
- **Adresse IP** : identifiant logique d’interface réseau. En IPv4, elle est codée sur 32 bits, souvent notée par 4 nombres décimaux séparés par des points (ex. `192.168.1.10`). En IPv6, elle est codée sur 128 bits et notée sous forme hexadécimale séparée par des `:` (ex. `2001:db8::1`).
- **Préfixe / masque** : permet de distinguer la partie réseau et la partie hôte. En notation CIDR, `192.168.1.0/24` désigne un réseau dont les 24 premiers bits sont communs, laissant 8 bits pour les hôtes.
- **Route par défaut et table de routage** : chaque machine et chaque routeur dispose d’entrées qui indiquent par quelle interface ou quel routeur voisin envoyer un paquet destiné à une adresse ou à un préfixe donné.
- **Fragmentation** : si un paquet est trop grand pour un lien intermédiaire, IP (ou une autre couche suivant la configuration) peut le fragmenter en plusieurs morceaux qui seront réassemblés à destination.

Exemple simple de table de routage sur un hôte (vue logique) :

```text
Destination       Préfixe   Passerelle       Interface
192.168.1.0       /24       —                eth0
10.0.0.0          /8        192.168.1.254    eth0
0.0.0.0           /0        192.168.1.254    eth0
```

Chemin d’apprentissage recommandé autour d’IP :
- Comprendre la structure des adresses IPv4, puis la notation CIDR et la notion de réseau / sous‑réseau.
- Manipuler des exemples de sous‑réseaux, de passerelles et de routes par défaut.
- Introduire ensuite IPv6 et les différences principales (taille d’adresses, auto‑configuration, types d’adresses unicast/multicast).

---

## Le transport sur le réseau : TCP, UDP et QUIC 🚚

La couche transport fournit un service de bout en bout entre deux applications s’exécutant sur des hôtes différents. Elle utilise l’adressage IP pour atteindre la machine distante, et ajoute l’idée de ports pour distinguer plusieurs applications sur le même hôte.

### TCP (Transmission Control Protocol)

TCP fournit un canal de communication orienté connexion, fiable et ordonné. Il garantit que les données arrivent dans le bon ordre, sans duplication, ou signale les erreurs de manière explicite aux applications en cas de problème trop grave.

Caractéristiques essentielles :
- **Connexion préalable** (handshake) avant l’échange de données.
- **Numérotation de séquence** pour ordonner les segments.
- **Accusés de réception** (ACK) et retransmissions en cas de perte.
- **Contrôle de flux** (fenêtre glissante) pour éviter de saturer le récepteur.
- **Contrôle de congestion** pour adapter le débit à l’état du réseau.

Exemple de pseudo‑trame logique TCP (simplifiée) :

```text
TCP Header:
- Ports source / destination
- Numéro de séquence
- Numéro d’acquittement
- Flags (SYN, ACK, FIN, etc.)
- Fenêtre
- Options
Payload:
- Données applicatives (HTTP, SMTP, etc.)
```

Chemin d’apprentissage pour TCP :
- Étudier le mécanisme SYN / SYN‑ACK / ACK.
- Visualiser la fenêtre de congestion et les retransmissions sur un diagramme temporel.
- Observer au moyen d’un outil de capture de paquets (comme `tcpdump` ou équivalent) des sessions simples (connexion HTTP, par exemple).

### UDP (User Datagram Protocol)

UDP offre un service de datagrammes sans connexion, minimaliste, sans garantie de livraison, d’ordre ou d’unicité. L’envoi est très rapide car il ne nécessite pas de négociation préalable, ni de retransmission automatique.

Caractéristiques :
- Pas de handshake ni de suivi de connexion.
- Envoi de paquets indépendants (datagrammes).
- Taille d’en-tête réduite, latence plus faible.
- Particulièrement adapté aux usages temps réel (VoIP, vidéo en direct, jeux en ligne) où la perte ponctuelle de paquets est tolérable.

Chemin d’apprentissage pour UDP :
- Comparer le format d’en‑tête UDP à celui de TCP.
- Comprendre l’impact de l’absence de mécanismes de fiabilité intégrés.
- Explorer des exemples de protocoles applicatifs sur UDP (DNS, certains protocoles de streaming, etc.).

### QUIC

QUIC est un protocole de transport moderne, conçu par Google puis standardisé, qui fonctionne au‑dessus d’UDP. Il combine transport fiable et chiffrement, avec des objectifs de réduction de la latence et d’amélioration des performances sur des réseaux fluctuants.

Points clés :
- Mise en place de la connexion plus rapide grâce à un handshake combinant transport et chiffrement.
- Multiplexage de plusieurs flux logiques dans une seule connexion, en limitant le blocage de tête de ligne (head‑of‑line blocking) qui existe avec TCP.
- Utilisation obligatoire du chiffrement, inspirée des mécanismes de TLS.

Chemin d’apprentissage pour QUIC :
- Comprendre ses motivations par rapport à TCP (latence, multiplexage).
- Relier QUIC au HTTP/3, qui s’appuie sur ce protocole de transport.
- Étudier des schémas de handshake et les caractéristiques de performances annoncées.

---

## La couche applicative : HTTP, SMTP et FTP 📡

Les protocoles applicatifs définissent la logique métier des échanges : requêtes, réponses, commandes et formats de données. Ils s’appuient en général sur la couche transport (TCP, parfois UDP, ou QUIC) et utilisent des ports bien connus.

### HTTP (HyperText Transfer Protocol)

HTTP est le protocole du Web, utilisé pour échanger des documents (HTML, images, JSON, etc.) entre un client (navigateur, script, API client) et un serveur Web. Il repose historiquement sur TCP, et plus récemment sur QUIC pour HTTP/3.

Principes :
- Modèle requête / réponse : le client envoie une requête, le serveur renvoie une réponse.
- Méthodes (ou verbes) : `GET`, `POST`, `PUT`, `DELETE`, etc.
- Codes de statut : `200` (succès), `404` (ressource non trouvée), `500` (erreur serveur), etc.
- En‑têtes (headers) pour transporter des métadonnées (type de contenu, cache, compression, cookies, etc.).

Exemple de requête HTTP/1.1 (simplifiée) :

```http
GET /index.html HTTP/1.1
Host: www.exemple.com
User-Agent: navigateur-demo
Accept: text/html
```

Chemin d’apprentissage :
- Étudier la structure des requêtes et réponses HTTP/1.1.
- Introduire les notions de sessions, de cookies et de mécanismes de cache.
- Approfondir ensuite HTTP/2 et HTTP/3 (multiplexage, compression d’en‑têtes, utilisation de QUIC).

### SMTP (Simple Mail Transfer Protocol)

SMTP est le protocole principal pour l’envoi d’e‑mails entre serveurs de messagerie. Il fonctionne généralement sur TCP, en utilisant des ports bien connus.

Principes :
- Dialogue textuel entre client SMTP (MTA) et serveur SMTP, sous forme de commandes et réponses.
- Utilisation de commandes comme `HELO`/`EHLO`, `MAIL FROM`, `RCPT TO`, `DATA`.
- Interaction avec d’autres protocoles pour la consultation des messages (IMAP, POP), qui ne sont pas gérés par SMTP.

Exemple simplifié de dialogue SMTP (structure) :

```text
Client: EHLO client.exemple.com
Serveur: 250-server.exemple.com
Client: MAIL FROM:<expediteur@exemple.com>
Client: RCPT TO:<destinataire@exemple.net>
Client: DATA
Client: [contenu du message]
Client: .
Serveur: 250 Message accepté
```

Chemin d’apprentissage :
- Comprendre la séparation entre l’envoi (SMTP) et la réception/lecture (IMAP/POP).
- Étudier les ports utilisés (avec ou sans chiffrement).
- Introduire des notions de sécurité comme SPF, DKIM et DMARC pour la lutte contre le spam et l’usurpation d’adresse.

### FTP (File Transfer Protocol)

FTP permet le transfert de fichiers entre client et serveur sur un réseau TCP/IP. Historiquement très utilisé pour la mise en ligne de sites Web ou le partage de fichiers dans des contextes professionnels.

Caractéristiques :
- Fonctionne en mode commande et mode données, souvent sur des ports distincts.
- Propose des opérations telles que le listage de répertoires, l’envoi et la récupération de fichiers, la suppression, etc.
- N’intègre pas nativement le chiffrement, ce qui a conduit à des variantes sécurisées comme FTPS (FTP sur TLS) ou à des alternatives comme SFTP (basé sur SSH).

Chemin d’apprentissage :
- Étudier les modes actif et passif et leur impact sur les pare‑feu.
- Observer la différence entre FTP, FTPS et SFTP.
- Comprendre les implications de sécurité liées à l’absence de chiffrement dans FTP simple.

---

## Sécurisation des échanges : SSL et TLS 🔐

SSL (Secure Sockets Layer) et surtout TLS (Transport Layer Security, successeur de SSL) ajoutent une couche de sécurité par‑dessus les protocoles de transport, en chiffrant les communications et en authentifiant les parties.

Objectifs de TLS :
- **Confidentialité** : le contenu échangé n’est lisible que par les interlocuteurs légitimes.
- **Intégrité** : les modifications non autorisées sont détectées.
- **Authentification** : le serveur (et parfois le client) démontre son identité via des certificats numériques.

Mécanismes principaux :
- Négociation de versions et de suites cryptographiques (choix des algorithmes).
- Utilisation de certificats X.509 signés par une autorité de certification.
- Établissement d’une clé de session symétrique, utilisée ensuite pour chiffrer efficacement le flux de données.

Exemples d’usages :
- HTTPS : HTTP sur TLS, pour sécuriser la navigation Web.
- SMTPS ou SMTP avec STARTTLS : chiffrement de l’envoi de mail.
- FTPS : FTP sécurisé par TLS.

Chemin d’apprentissage :
- Comprendre la notion de certificat, de chaîne de confiance et d’autorité de certification.
- Étudier la différence entre SSL (versions obsolètes) et TLS (versions modernes).
- Examiner le flux d’un handshake TLS et l’établissement de la clé de session.

---

## Présentation du modèle OSI et introduction à TCP/IP 🧱

Pour structurer la compréhension des communications, deux modèles sont souvent présentés : le modèle OSI (théorique) et le modèle TCP/IP (plus proche d’Internet réel). Ils décrivent les fonctions des différentes couches d’un système de communication.

### Modèle OSI (7 couches)

Le modèle OSI définit sept couches, de la plus basse (proche du support physique) à la plus haute (proche de l’application) :
- Physique : transmission brute de bits sur le média (câble, fibre, radio).
- Liaison de données : trames, adresses MAC, détection d’erreurs locales.
- Réseau : routage de paquets d’un réseau à un autre (IP).
- Transport : transport fiable ou non, de bout en bout (TCP, UDP, QUIC conceptualisé).
- Session : gestion de sessions de communication, synchronisation.
- Présentation : traduction, chiffrement/déchiffrement, compression.
- Application : protocoles au service des applications (HTTP, SMTP, FTP, etc.).

Ce modèle est avant tout un outil pédagogique pour séparer logiquement les fonctions et comprendre à quel niveau se situent les problèmes ou les protocoles.

### Modèle TCP/IP

Le modèle TCP/IP, historiquement issu du développement d’Internet, regroupe certaines couches OSI pour se focaliser sur ce qui est réellement implémenté :
- Accès réseau (ou liaison + physique).
- Internet (couche réseau), avec IP.
- Transport, avec TCP, UDP, QUIC.
- Application, englobant les couches session, présentation et application du modèle OSI.

Tableau de correspondance simplifié :

| Modèle OSI         | Modèle TCP/IP     | Exemples de protocoles            |
|--------------------|-------------------|-----------------------------------|
| Application        | Application       | HTTP, SMTP, FTP                   |
| Présentation       | Application       | TLS (dans certains modèles)       |
| Session            | Application       | Contrôle de session applicative   |
| Transport          | Transport         | TCP, UDP, QUIC                    |
| Réseau             | Internet          | IP, ICMP                          |
| Liaison de données | Accès réseau      | Ethernet, Wi‑Fi                   |
| Physique           | Accès réseau      | Câble cuivre, fibre, radio        |

Chemin d’apprentissage :
- Positionner chaque protocole déjà vu (IP, TCP, UDP, HTTP, SMTP, FTP, TLS) dans l’un ou l’autre modèle.
- Utiliser ces modèles pour raisonner sur les problèmes réseau : à quelle couche se situe une panne ou une configuration erronée.
- Relier cette vision à la configuration concrète d’un hôte (interfaces, routes, pare‑feu, services).

---

## Le protocole DNS et les serveurs DNS 🧱➡️🔤

DNS (Domain Name System) fournit un service de résolution de noms, qui traduit des noms symboliques lisibles (comme `www.exemple.com`) en adresses IP utilisables par les machines. Sans DNS, il serait nécessaire de retenir et saisir directement les adresses IP.

Fonctionnement conceptuel :
- Le client (résolveur) envoie une requête DNS, généralement via UDP (parfois TCP pour des réponses volumineuses ou des opérations spécifiques).
- La requête transite d’abord vers un résolveur récursif (souvent fourni par le fournisseur d’accès ou configuré manuellement comme un service public).
- Ce résolveur interroge éventuellement des serveurs faisant autorité pour les domaines concernés, en commençant par la racine, puis les TLD (`.com`, `.org`, etc.), puis le domaine spécifique.
- Une fois la réponse obtenue, elle est renvoyée au client, qui peut la mettre en cache pour accélérer les accès ultérieurs.

Enregistrements principaux :
- `A` : nom de domaine vers adresse IPv4.
- `AAAA` : nom de domaine vers adresse IPv6.
- `CNAME` : alias vers un autre nom.
- `MX` : serveurs de messagerie pour un domaine.
- `NS` : serveurs de noms faisant autorité pour le domaine.
- D’autres types existent (TXT, SRV, etc.) pour diverses fonctions.

Chemin d’apprentissage :
- Comprendre la différence entre un résolveur récursif, un serveur faisant autorité et un cache DNS local.
- Étudier le format des enregistrements DNS courants (A, AAAA, MX, CNAME).
- Observer une résolution de nom étape par étape, du cache local aux serveurs de la racine.

---

## Intégration dans un chemin d’apprentissage cohérent 🧭

Pour un apprentissage progressif en lien avec Nginx et les services Web, un enchaînement logique possible consiste à :
- Poser les bases avec l’architecture d’Internet, la notion de paquets, d’adressage IP et de routage.
- Approfondir les protocoles de transport (TCP, UDP, QUIC) pour comprendre comment les données HTTP ou FTP sont effectivement livrées.
- Étudier ensuite les protocoles applicatifs importants (HTTP, SMTP, FTP), leur syntaxe, leurs codes de statut et leur usage dans des scénarios réels.
- Introduire la sécurisation via TLS, en reliant directement ces notions à HTTPS et aux configurations typiques de serveurs Web modernes.
- Apprendre à raisonner avec les modèles OSI et TCP/IP pour localiser les concepts déjà abordés et diagnostiquer des problèmes.
- Finalement, comprendre le rôle essentiel de DNS, qui relie les noms de services à leurs adresses IP et conditionne l’accessibilité des sites et services sous Nginx.

Cette progression permet de relier chaque brique (adressage, transport, application, sécurité, résolution de noms) à la mise en place concrète de services Web, dont Nginx constitue un composant central.
