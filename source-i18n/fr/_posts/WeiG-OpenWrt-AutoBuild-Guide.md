---
title: "Construire son propre firmware OpenWrt dans le cloud : guide pour débutants"
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - Compilation de firmware
categories:
  - OpenWrt
cover: https://img.weigshare.com/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: "Créez une image OpenWrt personnalisée avec le configurateur en ligne Wei.G et GitHub Actions, sans installer d’environnement de compilation local."
---

Vous voulez une image OpenWrt adaptée à votre routeur sans installer toute une chaîne de compilation sur votre machine ? Ouvrez le [configurateur en ligne Wei.G](https://www.weigshare.com/wrt), choisissez la source, la cible, les paquets et les options souhaitées, puis envoyez la demande à GitHub Actions. La compilation se fait ensuite dans le cloud.

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>

## Démarrage rapide

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Le flashage d’un firmware comporte des risques. Vérifiez d’abord le modèle du routeur, le partitionnement et la méthode de flashage. En cas de doute, ne flashez pas.</span>

- Connectez-vous à **[GitHub](https://github.com/)**
- Ouvrez le **[personnalisateur en ligne Wei.G](https://www.weigshare.com/wrt)**
- Si vous débutez, suivez le tutoriel ci-dessous 👇

## Contexte

- **【Un point de départ plus simple】** Le projet permet de découvrir la compilation d’un firmware personnalisé sans devoir commencer par mettre en place toute une chaîne de compilation locale.
- **【Paquets et dépendances】** Certains plugins ou dépendances doivent être intégrés au firmware au moment de la compilation.
- **【Configuration】** OpenWrt propose de nombreuses options et, en Chine continentale, les conditions réseau peuvent compliquer encore davantage le téléchargement des dépendances.
- **【Temps】** Une compilation complète peut durer plusieurs heures et tout de même échouer ; le diagnostic peut donc coûter beaucoup de temps.
- **【Objectif】** À terme, chacun devrait pouvoir forker le projet et héberger son propre site de compilation OpenWrt avec GitHub **Pages + Actions**.
- **【État actuel】** Le projet est encore en phase de test. Des bugs peuvent subsister et une utilisation intensive du workflow partagé peut rencontrer les politiques ou quotas de GitHub.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.009.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Appareils pris en charge

Seules les cibles suivantes ont été vérifiées pour le moment. Les autres appareils n’ont pas encore été testés. Si vous ne disposez pas d’une méthode de récupération, n’utilisez pas cet outil.

- **Sources : [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**
- Accessible depuis un ordinateur ou un téléphone

## Préparation

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Le flashage d’un firmware comporte des risques. Vérifiez d’abord le modèle du routeur, le partitionnement et la méthode de flashage. En cas de doute, ne flashez pas.</span>

- Connectez-vous à un compte **[GitHub](https://github.com/)**. Sans compte, vous ne pourrez pas lancer de compilation.
- Ouvrez le **[personnalisateur en ligne Wei.G](https://www.weigshare.com/wrt)**.
  - **[Page Cloudflare dev](https://dev.weig-wrt.pages.dev/)** (fonctions expérimentales et nouveautés, avec un risque de bugs)

<!-- Capture 1 : page d’accueil montrant Source, Branch, Target et la zone des plugins -->

## 1. Choisir les paramètres

- Après avoir choisi une source, recherchez le modèle ou l’environnement correspondant. Vous pouvez aussi charger une config existante.
- Sélectionnez **Source → Branch → Target System → Subtarget → Target Profile**.
  - Exemple pour x86/64 : **ImmortalWrt → openwrt-24.10 → x86 → 64 → Generic x86/64**

- Dans **Advanced menuconfig › LuCI › 3. Applications**, cochez les applications souhaitées.
- Les autres réglages de **Advanced menuconfig** peuvent être adaptés selon vos besoins.

Configurez ensuite si nécessaire le **fuseau horaire**, le **thème du firmware**, les **serveurs NTP** et le **miroir de paquets**.

<div style="display:flex; gap:10px;">

<img src=https://img.weigshare.com/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="150">

</div>

### Configuration existante

Si vous disposez déjà d’un fichier `.config`, `config.buildinfo` ou d’une requête précédemment téléchargée, cliquez sur **Charger la configuration** en bas. Dans la boîte de confirmation, vérifiez la source, la branche, le Target Profile, les plugins et les réglages du firmware.

## 2. Envoyer la compilation

Cliquez sur **Envoyer la compilation cloud** en bas à droite.

Choisissez **Télécharger la requête et ouvrir GitHub**. Le navigateur télécharge un fichier JSON puis ouvre automatiquement une nouvelle page GitHub Issue.

Déplacez le fichier téléchargé dans la zone de l’Issue puis cliquez sur **Create**.

Le bot répond dans l’Issue avec le lien Actions correspondant à cette compilation.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 3. Télécharger le firmware

La compilation prend généralement 2 à 4 heures. Une fois terminée, ouvrez la page Actions et téléchargez les éléments dans **Artifacts** :

- `FIRMWARE-ALL-XXX` : tous les fichiers de firmware et les sommes de contrôle. Pour un premier flashage, recherchez généralement un fichier tel que `factory`.
- `CONFIG-XXX` : configuration envoyée, configuration finale et différences. Il est conseillé de la conserver.
- `BUILD-LOGS-XXX` : journaux complets de compilation, utiles pour le diagnostic.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Questions fréquentes

- **Que faire si la compilation échoue ?** Téléchargez `BUILD-LOGS-…` et examinez le dernier `Error`. Vous pouvez aussi signaler le problème dans l’Issue.
- **Comment annuler ?** Répondez `/cancel` dans votre Issue de compilation.
- **Combien de compilations simultanées ?** Un compte ne peut exécuter que deux tâches en même temps ; les suivantes attendent.
- **Pourquoi n’y a-t-il pas de bouton de téléchargement ?** GitHub demande généralement d’être connecté pour télécharger les Artifacts d’Actions.
- **File d’attente trop longue sur le dépôt public ?** À l’avenir, vous pourrez [forker ce projet](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild) puis lancer les compilations dans votre propre dépôt en suivant les indications du site, ce qui évitera la file d’attente partagée.

Projet : [WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)

## Remerciements

- **Sources :** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)

- **Référence :** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)

- **Les auteurs des plugins LuCI**

- **Toutes les personnes** ayant participé au projet
