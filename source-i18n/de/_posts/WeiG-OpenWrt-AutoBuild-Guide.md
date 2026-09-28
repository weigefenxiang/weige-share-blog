---
title: "Eigenes OpenWrt-Firmware-Image in der Cloud bauen: Einsteiger-Anleitung"
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - Firmware-Build
categories:
  - OpenWrt
cover: https://img.weigshare.com/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: "Mit dem Wei.G OpenWrt Online-Customizer und GitHub Actions ein eigenes OpenWrt-Image in der Cloud bauen – ohne lokale Build-Umgebung."
---

Du möchtest ein OpenWrt-Image, das wirklich zu deinem Router passt, aber nicht erst lokal eine komplette Build-Umgebung einrichten? Im [Wei.G Online-Customizer](https://www.weigshare.com/wrt) wählst du Quelle, Zielgerät, Pakete und Firmware-Einstellungen aus und schickst den Auftrag anschließend an GitHub Actions. Den eigentlichen Build übernimmt die Cloud.

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>

## Schnellstart

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Das Flashen von Firmware ist mit Risiken verbunden. Routermodell, Partitionierung und Flash-Methode vorher prüfen. Wenn etwas unklar ist, nicht flashen.</span>

- Bei **[GitHub](https://github.com/)** anmelden
- Den **[Wei.G Online-Customizer](https://www.weigshare.com/wrt)** öffnen
- Einsteiger sollten die folgende Anleitung lesen 👇

## Hintergrund

- **【Einfacher Einstieg】** Wer einmal selbst Firmware bauen möchte, aber nicht schon an der lokalen Toolchain scheitern will, bekommt hier einen deutlich niedrigeren Einstieg.
- **【Pakete und Abhängigkeiten】** Manche Plugins und Abhängigkeiten müssen bereits beim Build in die Firmware integriert werden.
- **【Konfigurationsaufwand】** OpenWrt bietet viele Build-Optionen; zusätzlich können Netzwerkbedingungen in Festlandchina den Download von Abhängigkeiten erschweren.
- **【Zeit】** Ein vollständiger Build kann mehrere Stunden dauern und trotzdem fehlschlagen. Die Fehlersuche kostet entsprechend Zeit.
- **【Ziel】** Langfristig soll jeder das Projekt forken und mit GitHub **Pages + Actions** eine eigene OpenWrt-Build-Seite betreiben können.
- **【Aktueller Stand】** Das Projekt befindet sich noch in der Testphase. Fehler sind möglich, und eine starke Nutzung des gemeinsamen Workflows kann an GitHub-Richtlinien oder Nutzungslimits stoßen.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.009.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Unterstützte Geräte

Derzeit sind nur die folgenden Ziele getestet. Andere Geräte wurden noch nicht verifiziert. Ohne Wiederherstellungsmöglichkeit sollte das Tool nicht verwendet werden.

- **Quellen: [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**
- Zugriff über Desktop und Mobilgeräte möglich

## Vorbereitung

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Das Flashen von Firmware ist mit Risiken verbunden. Routermodell, Partitionierung und Flash-Methode vorher prüfen. Wenn etwas unklar ist, nicht flashen.</span>

- Bei einem **[GitHub](https://github.com/)**-Konto anmelden. Ohne Konto kann kein Build gestartet werden.
- Den **[Wei.G Online-Customizer](https://www.weigshare.com/wrt)** öffnen.
  - **[Cloudflare-Dev-Seite](https://dev.weig-wrt.pages.dev/)** (experimentelle Funktionen, neuester Stand, kann aber Fehler enthalten)

<!-- Screenshot 1: Startseite mit Source-, Branch-, Target- und Plugin-Bereichen -->

## 1. Parameter auswählen

- Nach Auswahl der Quelle im Suchfeld das passende Gerät oder die gewünschte Umgebung suchen. Eine vorhandene config kann ebenfalls geladen werden.
- **Source → Branch → Target System → Subtarget → Target Profile** auswählen.
  - Beispiel x86/64: **ImmortalWrt → openwrt-24.10 → x86 → 64 → Generic x86/64**

- Unter **Advanced menuconfig › LuCI › 3. Applications** die gewünschten Anwendungen aktivieren.
- Weitere Optionen unter **Advanced menuconfig** nach Bedarf einstellen.

Anschließend nach Bedarf **Zeitzone**, **Firmware-Theme**, **NTP-Server** und **Paket-Mirror** konfigurieren.

<div style="display:flex; gap:10px;">

<img src=https://img.weigshare.com/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="150">

</div>

### Vorhandene Konfiguration

Wer bereits eine `.config`, `config.buildinfo` oder eine früher heruntergeladene Request-Datei besitzt, kann unten auf **Konfiguration laden** klicken. Im Bestätigungsdialog Quelle, Branch, Target Profile, Plugins und Firmware-Einstellungen prüfen.

## 2. Build starten

Unten rechts auf **Cloud-Build starten** klicken.

**Request herunterladen und GitHub öffnen** auswählen. Der Browser lädt eine JSON-Datei herunter und öffnet automatisch eine neue GitHub-Issue-Seite.

Die heruntergeladene Datei in das Issue-Feld ziehen und anschließend **Create** klicken.

Der Bot antwortet im Issue mit dem Actions-Link für den Build.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 3. Firmware herunterladen

Ein Build dauert normalerweise 2–4 Stunden. Nach Abschluss auf der Actions-Seite unten unter **Artifacts** herunterladen:

- `FIRMWARE-ALL-XXX`: alle Firmware-Dateien und Prüfsummen. Beim ersten Flash wird meist eine Datei wie `factory` benötigt.
- `CONFIG-XXX`: eingereichte Konfiguration, finale Konfiguration und Unterschiede. Aufbewahren wird empfohlen.
- `BUILD-LOGS-XXX`: vollständige Build-Logs zur Fehlersuche.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Häufige Fragen

- **Was tun, wenn der Build fehlschlägt?** `BUILD-LOGS-…` herunterladen und den letzten `Error` prüfen. Probleme können auch im Issue gemeldet werden.
- **Wie breche ich ab?** Im eigenen Build-Issue mit `/cancel` antworten.
- **Wie viele Builds gleichzeitig?** Pro Konto sind nur zwei gleichzeitige Build-Jobs erlaubt. Weitere Jobs müssen warten.
- **Warum gibt es keinen Download-Button?** Für den Download von GitHub-Action-Artefakten muss man in der Regel angemeldet sein.
- **Lange Wartezeit im öffentlichen Repository?** Später soll man [dieses Projekt forken](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild) und anhand der Hinweise auf der Seite im eigenen Repository bauen können. Damit entfällt die gemeinsame Warteschlange.

Projekt: [WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)

## Danksagung

- **Quellen:** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)

- **Referenz:** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)

- **Autorinnen und Autoren der LuCI-Plugins**

- **Alle**, die am Projekt beteiligt waren
