---
title: "WeiG qB WebUI : guide débutant pour l’IU Web alternative de qBittorrent"
date: 2026-09-28 17:15:00
tags:
  - qBittorrent
  - WebUI
  - NAS
  - Docker
categories:
  - qBittorrent
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif
description: "Guide pour installer WeiG qB WebUI et l’utiliser comme IU Web alternative de qBittorrent sous Windows, Linux, NAS et Docker."
---

Si vous administrez habituellement qBittorrent depuis un navigateur — notamment sur un **NAS, dans Docker ou depuis un téléphone** — WeiG qB WebUI rend les opérations quotidiennes bien plus confortables. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Aperçu en ligne</a></strong>

Il y a environ sept ans, j’ai rejoint quelques trackers privés. À l’époque, j’avais installé qBittorrent 4.1.9 sur mon NAS : c’était la toute dernière version. Je n’aurais jamais imaginé l’utiliser encore aujourd’hui.

J’ai bien tenté une grosse mise à jour une fois (vers la 4.2.5, si ma mémoire est bonne), mais les tâches torrent ont disparu du client et je ne pouvais plus continuer à partager. Avec tout ce que j’avais accumulé, la remise en état était devenue un vrai casse-tête. Depuis, lorsqu’une version fonctionne correctement, je préfère ne pas y toucher.

Après mes études et mon entrée dans la vie active, je passe beaucoup moins de temps devant un ordinateur. Je gère désormais surtout mon NAS depuis mon téléphone. Or, l’interface Web d’origine n’est pas très pratique sur petit écran. J’ai essayé d’autres interfaces alternatives, mais leur compatibilité avec les anciennes versions laissait souvent à désirer.

C’est ce qui m’a donné envie de créer WeiG qB WebUI. Le projet prend en charge plusieurs versions stables de qBittorrent, de 4.1.x à 5.2.x. Si vous rencontrez un problème ou avez une suggestion, n’hésitez pas à laisser un commentaire.

**WeiG qB WebUI** est une **IU Web alternative** pour qBittorrent, pensée pour ordinateur comme pour mobile :

- 📱 Interface adaptée aux téléphones
- 🌙 Mode sombre
- 🧱 Compatible avec les anciennes versions de qBittorrent
- ✅ Prend en charge **qBittorrent 4.1.x → 5.2.x**
- 🐳 Fonctionne sous Windows, Linux, Docker et NAS

[Projet](https://github.com/weigefenxiang/WeiG-qB-WebUI)

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Shell-8A2BE2?logo=gnubash&logoColor=white" alt="Shell">
</div>

## Aperçu de l’interface

### Bureau

<p align="center">
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif" alt="Interface bureau de WeiG qB WebUI" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>


### Mobile

<style>
/* Scoped to the mobile preview in this article */
.weig-qb-mobile-preview {
  width: 100%;
  container-type: inline-size;
}

.weig-qb-mobile-preview-images {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px;
  width: 100%;
}

.weig-qb-mobile-preview-images img {
  display: block;
  flex: 0 1 auto;
  min-width: 0;
  width: auto;
  height: min(341px, 38cqw);
  max-width: 100%;
  object-fit: contain;
}

/* Stack when the article column is narrow */
@container (max-width: 640px) {
  .weig-qb-mobile-preview-images {
    flex-direction: column;
  }

  .weig-qb-mobile-preview-images img {
    flex: none;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 341px;
  }
}
</style>

<div class="weig-qb-mobile-preview">
  <div class="weig-qb-mobile-preview-images">
    <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview.gif" alt="Démonstration de WeiG qB WebUI sur téléphone">
    <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview.png" alt="Aperçu des écrans mobiles de WeiG qB WebUI">
  </div>
</div>

## Installation pour débutants

<details>
<summary><b>Première installation ? Déplier le guide d'une minute</b></summary>

### 1. Extraire l'archive

Téléchargez la dernière version stable [**weig-qb-webui.zip**](https://github.com/weigefenxiang/WeiG-qB-WebUI/releases/latest/download/weig-qb-webui.zip) et décompressez l’archive. Le dossier porte déjà le bon nom :

```text
weig-qb-webui/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

Le dossier **`weig-qb-webui` entier** est la racine WebUI. Ne copiez pas uniquement `public` ou `private`.

### 2. Déplacer le dossier vers un emplacement permanent

```text
Windows : D:\weig-qb-webui
Linux :   /opt/weig-qb-webui
```

C'est ce chemin qu'il faudra renseigner dans qBittorrent.

### 3. Activer dans qBittorrent

Ouvrez qBittorrent :

**Outils → Options… → WebUI**

Ce sont les termes de l'interface française officielle actuelle de qBittorrent. Ensuite :

1. Activez **Utiliser l'IU Web alternative**.
2. Repérez **Emplacement des fichiers :**.
3. Saisissez le chemin du dossier `weig-qb-webui`.

Exemple Windows :

```text
D:\weig-qb-webui
```

Exemple Linux :

```text
/opt/weig-qb-webui
```

4. Cliquez sur **OK** pour enregistrer.
5. Rechargez la page WebUI. Si l'ancienne interface reste en cache, essayez `Ctrl + F5`.

> **Vérification du chemin :** `public`, `private`, `VERSION` et les autres fichiers doivent être directement visibles dans le dossier indiqué.

> **Docker :** qBittorrent fonctionne dans un conteneur. Il faut donc généralement saisir le chemin visible depuis le conteneur, et non le chemin de l'hôte.

</details>

## Installation en une commande

Le script Linux / NAS se télécharge depuis l’adresse Dev Pages ci-dessous. **Cette adresse ne choisit pas la version installée :** sans `-dev`, l’installateur utilise la version GitHub stable et vérifiée de `main` ; avec `-dev`, la version de développement de `dev` identifiée par son SHA Git exact. Le script reste dans le dossier courant pour les mises à jour et restaurations.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

<details>
<summary><b>Afficher l'emplacement du script et le dossier d'installation par défaut</b></summary>

```text
./install.sh
```

Répertoire WebUI par défaut :

```text
~/.local/share/weig-qb-webui
```

Avec l'utilisateur `root` :

```text
/root/.local/share/weig-qb-webui
```

</details>

### Docker

<details>
<summary><b>Installation Docker / plusieurs conteneurs / chemins</b></summary>

#### Hôte et conteneur

- **Hôte** : le système Linux/NAS qui exécute Docker.
- **Conteneur** : l'environnement dans lequel qBittorrent s'exécute.

Exemple :

```text
Hôte :      /root/qbittorrent/config
   ↓ monté vers
Conteneur : /config
```

Docker Compose :

```yaml
volumes:
  - /root/qbittorrent/config:/config
```

Si la WebUI est installée sur l'hôte dans :

```text
/root/qbittorrent/config/weig-qb-webui
```

alors **Emplacement des fichiers :** dans qBittorrent doit être :

```text
/config/weig-qb-webui
```

#### Un seul conteneur qBittorrent

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

Le programme d'installation essaie de détecter automatiquement le conteneur et le montage `/config`.

#### Lister les conteneurs

```sh
sh install.sh --list-containers
```

Ou :

```sh
docker ps
```

Choisir explicitement un conteneur :

```sh
sh install.sh --container=qbittorrent -configure
```

S'il y a plusieurs conteneurs qBittorrent, le programme d'installation refuse d'en choisir un au hasard.

#### Cas 3 : plusieurs conteneurs qBittorrent

Si vous avez `qbittorrent` et `qbittorrent-test`, affichez les conteneurs puis sélectionnez celui à configurer : l’installateur ne choisit pas au hasard.

```sh
sh install.sh --list-containers
sh install.sh --container=qbittorrent -configure
sh install.sh --container=qbittorrent-test -configure
```

#### Indiquer le chemin hôte correspondant à `/config`

```sh
sh install.sh --config-root=/root/qbittorrent/config -configure
```

Synology :

```sh
sh install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Autre NAS :

```sh
sh install.sh --config-root=/share/Container/qbittorrent -configure
```

#### Choisir le chemin WebUI

```sh
sh install.sh --container=qbittorrent -o /config/weig-qb-webui -configure
```

#### Cas 6 : mettre à jour plusieurs dossiers WebUI existants

Avec plusieurs instances qBittorrent, répétez `-o` pour indiquer chaque dossier. L’archive est téléchargée et vérifiée une seule fois ; le basculement commence après la préparation de toutes les cibles. Les trois dernières sauvegardes sont conservées séparément pour chacune dans `~/.config/weig-qb-webui/backups/`.

```sh
sh install.sh -dev \
  -o /root/qbittorrent/config/weig-qb-webui \
  -o /root/qbittorrent3/config/weig-qb-webui
```

N’utilisez pas `-configure` avec plusieurs cibles : chaque instance garde son chemin WebUI configuré. Lancez `sh install.sh -help` pour les options.

#### Vérifier les chemins après l’installation

Une fois l’installation terminée, le script affiche des chemins similaires à ceux-ci. Le premier correspond au dossier réel sur l’hôte ; le second est le chemin à renseigner dans **Files location** de qBittorrent, à l’intérieur du conteneur.

```text
Host install path: /root/qbittorrent/config/weig-qb-webui
qBittorrent Root Folder: /config/weig-qb-webui
```

</details>

### Windows PowerShell

```powershell
Invoke-WebRequest https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.ps1 -OutFile .\install.ps1; powershell -ExecutionPolicy Bypass -File .\install.ps1 -configure
```

<details>
<summary><b>Afficher le dossier d'installation</b></summary>

```text
C:\Users\<votre-nom>\AppData\Local\weig-qb-webui
```

</details>

## Options courantes

<details>
<summary><b>Linux et Windows utilisent les mêmes options ; PowerShell ignore la casse des noms de paramètres (déplier)</b></summary>

Les noms des paramètres PowerShell ne sont pas sensibles à la casse.

| Usage | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Dernière version stable | Par défaut | Par défaut |
| Release précise | `-version 1.2.0` | `-version 1.2.0` |
| Version de développement | `-dev` | `-dev` |
| Dossier d'installation | `-o /path` (répétable sous Linux) | `-o D:\path` ou `-output D:\path` |
| Fichier de configuration qBittorrent personnalisé | — | `-qbconfig D:\path\qBittorrent.ini` |
| Configurer qBittorrent | `-configure` | `-configure` |
| Restaurer l'installation précédente | `-rollback` | `-rollback` |
| Désinstallation complète (sans sauvegardes de l’installateur) | `-uninstall -purge` | `-uninstall -purge` |
| Aide | `-help` | `-help` |
| Choisir un conteneur Docker | `--container=NAME` | — |
| Lister les conteneurs Docker | `--list-containers` | — |
| Chemin hôte monté sur `/config` | `--config-root=/path` | — |

</details>

<details>
<summary><b>Remarques : (cliquer pour développer)</b></summary>

- Sans `-dev`, l’installateur utilise le GitHub Release stable et vérifié depuis `main` ; avec `-dev`, la version actuelle de `dev` à son SHA Git exact.
- `-o` signifie **output**. Sous Linux, répétez-le pour mettre à jour plusieurs dossiers WebUI existants avec une seule archive vérifiée.
- Les sauvegardes se trouvent dans `~/.config/weig-qb-webui/backups/` ; seules les trois plus récentes sont conservées par cible.
- `-configure` active **Use alternative WebUI** et définit **Files location** dans qBittorrent. Une seule cible à la fois.
- `-rollback` restaure la dernière sauvegarde de la cible choisie. Plusieurs `-o` permettent de revenir en arrière sur plusieurs cibles explicites.
- `-uninstall -purge` supprime le WebUI et les sauvegardes / l’état de retour arrière propres à la cible. Les autres installations ne sont pas touchées, et le dossier commun est supprimé s’il devient vide.
- Pour garder les sauvegardes en vue d’un futur `-rollback`, omettez `-purge`.
- `-version 1.2.0` choisit un GitHub Release précis. S’il n’existe pas, l’installation échoue **sans basculer vers latest ou dev**.
- `-help` affiche les options actuellement disponibles.
- Avec plusieurs conteneurs Docker, consultez `--list-containers` puis ciblez-en un avec `--container=NAME`, ou utilisez `--config-root=/path`.

### Version précise et répertoire d’installation

Linux :

```sh
sh install.sh -version 1.2.0 -o /opt/weig-qb-webui -configure
```

Windows :

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -version 1.2.0 -o D:\weig-qb-webui -configure
```

### Retour arrière

Retour arrière :

```sh
sh install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -rollback
```

</details>

## Désinstallation en une commande

<details>
<summary><b>Désinstallation complète Linux / NAS, Docker et Windows PowerShell</b></summary>

Par défaut, nous recommandons la **désinstallation complète sans conserver les sauvegardes de l’installateur** : suppression du WebUI, désactivation de l’interface alternative correspondant à la cible, purge des sauvegardes / de l’état de rollback appartenant à cette cible, puis suppression du script d’installation téléchargé dans le dossier courant.

### Linux / NAS

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Pour un répertoire personnalisé, ajoutez `-o /path/to/weig-qb-webui`.

### Docker

Un seul conteneur / détection automatique :

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Plusieurs conteneurs :

```sh
sh install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./install.sh
```

Avec `--config-root` :

```sh
sh install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\install.ps1 -Force }
```

Pour un répertoire personnalisé, ajoutez `-o D:\weig-qb-webui`.

`-purge` ne supprime que les sauvegardes appartenant à la cible en cours de désinstallation et ne touche pas aux autres installations. Si le répertoire d’état partagé devient vide, `~/.config/weig-qb-webui` sous Linux (root : `/root/.config/weig-qb-webui`) ou `%APPDATA%\weig-qb-webui` sous Windows est également supprimé.

Pour conserver les sauvegardes afin d’utiliser `-rollback` plus tard, retirez simplement `-purge`.

</details>

## Aide supplémentaire

Pour Docker, NAS, les chemins personnalisés, les mises à jour et le déploiement manuel, consultez [Installation, mise à niveau et déploiement manuel](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.fr.md).

## Licence

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
