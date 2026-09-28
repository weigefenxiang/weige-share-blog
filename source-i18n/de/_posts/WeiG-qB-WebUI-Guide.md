---
title: "WeiG qB WebUI: Einsteiger-Anleitung für qBittorrents alternative Weboberfläche"
date: 2026-09-28 17:15:00
tags:
  - qBittorrent
  - WebUI
  - NAS
  - Docker
categories:
  - qBittorrent
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview-v1.1.0.gif
description: "Einsteigerfreundliche Anleitung zur Installation von WeiG qB WebUI als alternative Weboberfläche von qBittorrent unter Windows, Linux, NAS und Docker."
---

Wenn du qBittorrent meist im Browser verwaltest – besonders auf einem **NAS, in Docker oder vom Smartphone** – macht WeiG qB WebUI die tägliche Bedienung deutlich angenehmer. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Online-Vorschau</a></strong>

Bei Private-Tracker-Setups ist Stabilität oft wichtiger als jedes neue Release. Auf einem NAS läuft qBittorrent nicht selten jahrelang mit derselben Version zuverlässig weiter, und nur wegen der Weboberfläche zu aktualisieren bedeutet unnötigen Migrationsaufwand und mögliche Risiken. Gleichzeitig ist die Standardoberfläche auf dem Smartphone eher umständlich, und nachts ist eine helle Ansicht wenig angenehm. WeiG qB WebUI wurde genau für diese Praxis entwickelt: gute Bedienung auf Mobilgeräten, Dunkelmodus und breite Kompatibilität mit älteren qBittorrent-Versionen. Unterstützt werden derzeit stabile Versionen von **4.1.0 bis 5.2.x**. Falls eine Version Probleme macht, hinterlasse gern einen Kommentar.

**WeiG qB WebUI** ist eine **alternative Weboberfläche** für qBittorrent und für Desktop wie Mobilgeräte ausgelegt:

- 📱 Responsive auf Smartphones
- 🌙 Dunkelmodus
- 🧱 Kompatibel mit älteren qBittorrent-Versionen
- ✅ Unterstützt **qBittorrent 4.1.0 → 5.2.x**
- 🐳 Für Windows, Linux, Docker und NAS

[Projekt](https://github.com/weigefenxiang/WeiG-qB-WebUI)

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Shell-8A2BE2?logo=gnubash&logoColor=white" alt="Shell">
</div>

## Oberflächenvorschau

### Desktop

<p align="center">
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview-v1.1.0.gif" alt="WeiG qB WebUI Desktop-Oberfläche" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>

### Mobil

#### Dynamische Demo

<p align="center">
  <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview-v1.1.0.gif" alt="WeiG qB WebUI Mobil-Animation" style="display:block;width:20%;height:auto;margin:0 auto;">
</p>

#### Oberflächen-Screenshot

<p align="center">
  <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview-v1.1.0.png" alt="WeiG qB WebUI Mobil-Oberfläche" style="display:block;width:auto;max-width:100%;height:auto;margin:0 auto;">
</p>
## Installation für Einsteiger

<details>
<summary><b>Zum ersten Mal? 1-Minuten-Anleitung aufklappen</b></summary>

### 1. ZIP entpacken

Lade `WeiG-qB-WebUI.zip` herunter, entpacke es und benenne den entpackten Ordner `WeiG-qB-WebUI` anschließend in `WeiG_qB-WebUI` um. Danach sollte die Struktur so aussehen:

```text
WeiG_qB-WebUI/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

Der gesamte Ordner **`WeiG_qB-WebUI`** ist das WebUI-Stammverzeichnis. Nicht nur `public` oder `private` kopieren.

### 2. An einen festen Ort verschieben

Zum Beispiel:

```text
Windows: D:\WeiG_qB-WebUI
Linux:   /opt/WeiG_qB-WebUI
```

Diesen Pfad trägst du anschließend in qBittorrent ein.

### 3. In qBittorrent aktivieren

Öffne qBittorrent:

**Werkzeuge → Optionen ... → WebUI**

Das sind die aktuellen Begriffe der offiziellen deutschen qBittorrent-Oberfläche. Danach:

1. **Alternative Weboberfläche verwenden** aktivieren.
2. **Speicherort der Dateien:** suchen.
3. Den Pfad zum Ordner `WeiG_qB-WebUI` eintragen.

Windows-Beispiel:

```text
D:\WeiG_qB-WebUI
```

Linux-Beispiel:

```text
/opt/WeiG_qB-WebUI
```

4. Mit **OK** speichern.
5. Die qBittorrent-WebUI neu laden. Falls die alte Ansicht im Cache bleibt, `Ctrl + F5` verwenden.

> **Pfad prüfen:** Im eingetragenen Ordner müssen `public`, `private`, `VERSION` usw. direkt sichtbar sein.

> **Docker:** qBittorrent läuft im Container. Deshalb muss in qBittorrent normalerweise ein container-sichtbarer Pfad eingetragen werden, nicht der Host-Pfad.

</details>

## Ein-Klick-Installation

Das Linux-/NAS-Installationsskript wird immer über den festen Dev-Pages-Link unten geladen. **Die Skriptadresse bestimmt nicht den Installationskanal:** ohne `-dev` wird die neueste stabile Version installiert; mit `-dev` die neueste Entwicklungsversion des aktuellen `dev`-Branches. Das Installationsskript bleibt im aktuellen Verzeichnis und kann später für Updates oder Rollbacks verwendet werden.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o weig_qb-webui_install.sh && sh weig_qb-webui_install.sh -configure
```

<details>
<summary><b>Skript- und Standard-Installationspfad anzeigen</b></summary>

```text
./weig_qb-webui_install.sh
```

Standardpfad der WebUI:

```text
~/.local/share/weig_qb-webui
```

Bei Ausführung als `root` typischerweise:

```text
/root/.local/share/weig_qb-webui
```

</details>

### Docker

<details>
<summary><b>Docker-Ein-Klick-Installation / mehrere Container / Pfade</b></summary>

#### Host und Container

- **Host**: das Linux-/NAS-System, auf dem Docker läuft.
- **Container**: die isolierte Umgebung, in der qBittorrent läuft.

Beispiel:

```text
Host:      /root/qbittorrent/config
   ↓ gemountet als
Container: /config
```

Docker Compose:

```yaml
volumes:
  - /root/qbittorrent/config:/config
```

Liegt die WebUI auf dem Host unter:

```text
/root/qbittorrent/config/weig_qb-webui
```

muss qBittorrent bei **Speicherort der Dateien:** verwenden:

```text
/config/weig_qb-webui
```

#### Ein qBittorrent-Container

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o weig_qb-webui_install.sh && sh weig_qb-webui_install.sh -configure
```

Der Installer versucht Container und `/config`-Mount automatisch zu erkennen.

#### Container anzeigen

```sh
sh weig_qb-webui_install.sh --list-containers
```

Oder:

```sh
docker ps
```

Einen Container ausdrücklich wählen:

```sh
sh weig_qb-webui_install.sh --container=qbittorrent -configure
```

Bei mehreren qBittorrent-Containern wählt der Installer nicht automatisch einen aus.

#### Host-Pfad für `/config` angeben

```sh
sh weig_qb-webui_install.sh --config-root=/root/qbittorrent/config -configure
```

Synology-Beispiel:

```sh
sh weig_qb-webui_install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Anderes NAS:

```sh
sh weig_qb-webui_install.sh --config-root=/share/Container/qbittorrent -configure
```

#### WebUI-Zielpfad festlegen

```sh
sh weig_qb-webui_install.sh --container=qbittorrent -o /config/weig_qb-webui -configure
```

</details>

### Windows PowerShell

```powershell
Invoke-WebRequest https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.ps1 -OutFile .\weig_qb-webui_install.ps1; powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -configure
```

<details>
<summary><b>Installationspfad anzeigen</b></summary>

```text
C:\Users\<Benutzername>\AppData\Local\WeiG_qB-WebUI
```

</details>

## Häufige Optionen
PowerShell-Parameternamen unterscheiden nicht zwischen Groß- und Kleinschreibung.

| Zweck | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Neuester stabiler Release | Standard | Standard |
| Bestimmter Release | `-version 1.0.0` | `-version 1.0.0` |
| Entwicklungsstand | `-dev` | `-dev` |
| Zielordner | `-o /path` oder `-o /path` | `-o D:\path` oder `-output D:\path` |
| qBittorrent automatisch konfigurieren | `-configure` | `-configure` |
| Vorherige Installation wiederherstellen | `-rollback` | `-rollback` |
| Vollständig deinstallieren (keine Installer-Backups behalten) | `-uninstall -purge` | `-uninstall -purge` |
| Hilfe | `-help` | `-help` |
| Docker-Container wählen | `--container=NAME` | — |
| Docker-Container auflisten | `--list-containers` | — |
| Host-Pfad des Docker-`/config` angeben | `--config-root=/path` | — |

<details>
<summary><b>Hinweise: (zum Aufklappen klicken)</b></summary>

- Eine nicht vorhandene Version fällt **nicht** automatisch auf latest oder dev zurück.
- Ohne `-dev`: neueste stabile Version installieren; mit `-dev`: neueste Entwicklungsversion des aktuellen `dev`-Branches installieren.

### Bestimmte Version und Installationsverzeichnis

Linux-Beispiel:

```sh
sh weig_qb-webui_install.sh -version 1.0.0 -o /opt/weig_qb-webui -configure
```

Windows-Beispiel:

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -version 1.0.0 -o D:\WeiG_qB-WebUI -configure
```

### Rollback

Rollback:

```sh
sh weig_qb-webui_install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -rollback
```

</details>

## Ein-Klick-Deinstallation

<details>
<summary><b>Vollständige Deinstallation für Linux / NAS, Docker und Windows PowerShell</b></summary>

Empfohlen ist standardmäßig die **vollständige Deinstallation ohne Installer-Backups**: WebUI entfernen, die passende Alternative-WebUI-Konfiguration deaktivieren, die installer-eigenen Backups / den Rollback-Status dieses Ziels bereinigen und anschließend das heruntergeladene Installationsskript im aktuellen Verzeichnis löschen.

### Linux / NAS

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge && rm -f -- ./weig_qb-webui_install.sh
```

Bei einem eigenen Installationspfad `-o /path/to/weig_qb-webui` ergänzen.

### Docker

Ein Container / automatische Erkennung:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge && rm -f -- ./weig_qb-webui_install.sh
```

Mehrere Container:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./weig_qb-webui_install.sh
```

Bei Verwendung von `--config-root`:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./weig_qb-webui_install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\weig_qb-webui_install.ps1 -Force }
```

Bei einem eigenen Installationspfad `-o D:\WeiG_qB-WebUI` ergänzen.

`-purge` entfernt nur Backups des aktuellen Deinstallationsziels und lässt andere Installationen unangetastet. Ist das gemeinsame Statusverzeichnis danach leer, wird unter Linux auch `~/.config/weig_qb-webui` (für root: `/root/.config/weig_qb-webui`) bzw. unter Windows `%APPDATA%\WeiG_qB-WebUI` entfernt.

Sollen Backups für ein späteres `-rollback` erhalten bleiben, `-purge` einfach weglassen.

</details>

## Weitere Hilfe

Docker, NAS, benutzerdefinierte Pfade, Aktualisierung und manuelle Installation: [Installations-, Upgrade- und Bereitstellungsanleitung](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.de.md).

## Lizenz

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
