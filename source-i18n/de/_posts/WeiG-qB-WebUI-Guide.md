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
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif
description: "Einsteigerfreundliche Anleitung zur Installation von WeiG qB WebUI als alternative Weboberfläche von qBittorrent unter Windows, Linux, NAS und Docker."
---

Wenn du qBittorrent meist im Browser verwaltest – besonders auf einem **NAS, in Docker oder vom Smartphone** – macht WeiG qB WebUI die tägliche Bedienung deutlich angenehmer. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Online-Vorschau</a></strong>

Vor etwa sieben Jahren bin ich ein paar privaten Torrent-Trackern beigetreten. Damals habe ich qBittorrent 4.1.9 auf meinem NAS installiert – seinerzeit die neueste Version. Dass ich sie heute noch nutzen würde, hätte ich nie gedacht.

Ein größeres Update habe ich durchaus versucht (ich glaube, auf 4.2.5). Danach waren die Torrent-Aufträge im Client plötzlich verschwunden und ich konnte nicht mehr weiterseeden. Über die Jahre hatte sich einiges angesammelt; alles wiederherzustellen war mühsam. Seitdem lasse ich eine stabile Installation lieber in Ruhe.

Seit dem Studienabschluss und dem Berufseinstieg sitze ich viel seltener am Desktop. Mein NAS verwalte ich inzwischen meist vom Smartphone aus. Das originale WebUI ist dafür allerdings ziemlich umständlich. Andere alternative Weboberflächen habe ich ausprobiert, doch gerade bei älteren qBittorrent-Versionen haperte es oft an der Kompatibilität.

Aus diesen Erfahrungen ist WeiG qB WebUI entstanden. Es deckt mehrere stabile qBittorrent-Versionen von 4.1.x bis 5.2.x ab. Wenn bei deiner Version etwas nicht funktioniert oder du eine Idee hast, freue ich mich über einen Kommentar.

**WeiG qB WebUI** ist eine **alternative Weboberfläche** für qBittorrent und für Desktop wie Mobilgeräte ausgelegt:

- 📱 Responsive auf Smartphones
- 🌙 Dunkelmodus
- 🧱 Kompatibel mit älteren qBittorrent-Versionen
- ✅ Unterstützt **qBittorrent 4.1.x → 5.2.x**
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
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif" alt="WeiG qB WebUI Desktop-Oberfläche" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>


### Mobil

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
    <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview.gif" alt="WeiG qB WebUI auf dem Smartphone">
    <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview.png" alt="Mobile Ansichten von WeiG qB WebUI">
  </div>
</div>

## Installation für Einsteiger

<details>
<summary><b>Zum ersten Mal? 1-Minuten-Anleitung aufklappen</b></summary>

### 1. ZIP entpacken

Lade die neueste stabile Version [**weig-qb-webui.zip**](https://github.com/weigefenxiang/WeiG-qB-WebUI/releases/latest/download/weig-qb-webui.zip) herunter und entpacke sie. Der Ordner ist bereits richtig benannt:

```text
weig-qb-webui/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

Der gesamte Ordner **`weig-qb-webui`** ist das WebUI-Stammverzeichnis. Nicht nur `public` oder `private` kopieren.

### 2. An einen festen Ort verschieben

Zum Beispiel:

```text
Windows: D:\weig-qb-webui
Linux:   /opt/weig-qb-webui
```

Diesen Pfad trägst du anschließend in qBittorrent ein.

### 3. In qBittorrent aktivieren

Öffne qBittorrent:

**Werkzeuge → Optionen ... → WebUI**

Das sind die aktuellen Begriffe der offiziellen deutschen qBittorrent-Oberfläche. Danach:

1. **Alternative Weboberfläche verwenden** aktivieren.
2. **Speicherort der Dateien:** suchen.
3. Den Pfad zum Ordner `weig-qb-webui` eintragen.

Windows-Beispiel:

```text
D:\weig-qb-webui
```

Linux-Beispiel:

```text
/opt/weig-qb-webui
```

4. Mit **OK** speichern.
5. Die qBittorrent-WebUI neu laden. Falls die alte Ansicht im Cache bleibt, `Ctrl + F5` verwenden.

> **Pfad prüfen:** Im eingetragenen Ordner müssen `public`, `private`, `VERSION` usw. direkt sichtbar sein.

> **Docker:** qBittorrent läuft im Container. Deshalb muss in qBittorrent normalerweise ein container-sichtbarer Pfad eingetragen werden, nicht der Host-Pfad.

</details>

## Ein-Klick-Installation

Das Installationsskript für Linux / NAS kommt über den festen Dev-Pages-Link unten. **Die URL legt den Installationskanal nicht fest:** Ohne `-dev` wird der geprüfte GitHub-Release von `main` installiert, mit `-dev` der aktuelle Entwicklungsstand von `dev` anhand seines exakten Git-SHA. Das Skript bleibt für spätere Updates und Rollbacks im aktuellen Verzeichnis.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

<details>
<summary><b>Skript- und Standard-Installationspfad anzeigen</b></summary>

```text
./install.sh
```

Standardpfad der WebUI:

```text
~/.local/share/weig-qb-webui
```

Bei Ausführung als `root` typischerweise:

```text
/root/.local/share/weig-qb-webui
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
/root/qbittorrent/config/weig-qb-webui
```

muss qBittorrent bei **Speicherort der Dateien:** verwenden:

```text
/config/weig-qb-webui
```

#### Ein qBittorrent-Container

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

Der Installer versucht Container und `/config`-Mount automatisch zu erkennen.

#### Container anzeigen

```sh
sh install.sh --list-containers
```

Oder:

```sh
docker ps
```

Einen Container ausdrücklich wählen:

```sh
sh install.sh --container=qbittorrent -configure
```

Bei mehreren qBittorrent-Containern wählt der Installer nicht automatisch einen aus.

#### Fall 3: mehrere qBittorrent-Container

Laufen zum Beispiel `qbittorrent` und `qbittorrent-test`, lass dir zuerst die Container anzeigen und wähle einen ausdrücklich aus. Der Installer rät nicht:

```sh
sh install.sh --list-containers
sh install.sh --container=qbittorrent -configure
sh install.sh --container=qbittorrent-test -configure
```

#### Host-Pfad für `/config` angeben

```sh
sh install.sh --config-root=/root/qbittorrent/config -configure
```

Synology-Beispiel:

```sh
sh install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Anderes NAS:

```sh
sh install.sh --config-root=/share/Container/qbittorrent -configure
```

#### WebUI-Zielpfad festlegen

```sh
sh install.sh --container=qbittorrent -o /config/weig-qb-webui -configure
```

#### Fall 6: mehrere bestehende WebUI-Verzeichnisse zusammen aktualisieren

Bei mehreren qBittorrent-Instanzen kannst du `-o` mehrfach angeben. Das Paket wird nur einmal geladen und geprüft; erst wenn alle Ziele vorbereitet sind, beginnt der Wechsel. Unter `~/.config/weig-qb-webui/backups/` bleiben die letzten drei Backups pro Ziel separat erhalten.

```sh
sh install.sh -dev \
  -o /root/qbittorrent/config/weig-qb-webui \
  -o /root/qbittorrent3/config/weig-qb-webui
```

Bei mehreren Zielen `-configure` weglassen. Jede Instanz nutzt weiterhin ihren eingestellten WebUI-Pfad. Alle Optionen zeigt `sh install.sh -help`.

#### Pfade nach der Installation prüfen

Nach der Installation zeigt das Skript etwa Folgendes an: Der erste Pfad bezeichnet den Installationsort auf dem Host, der zweite den Container-Pfad für **Files location** in qBittorrent.

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
<summary><b>Installationspfad anzeigen</b></summary>

```text
C:\Users\<Benutzername>\AppData\Local\weig-qb-webui
```

</details>

## Häufige Optionen

<details>
<summary><b>Linux und Windows verwenden dieselben Optionsnamen; PowerShell unterscheidet keine Groß- und Kleinschreibung (aufklappen)</b></summary>

PowerShell-Parameternamen unterscheiden nicht zwischen Groß- und Kleinschreibung.

| Zweck | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Neuester stabiler Release | Standard | Standard |
| Bestimmter Release | `-version 1.2.0` | `-version 1.2.0` |
| Entwicklungsstand | `-dev` | `-dev` |
| Zielordner | `-o /path` (unter Linux mehrfach möglich) | `-o D:\path` oder `-output D:\path` |
| Eigene qBittorrent-Konfigurationsdatei angeben | — | `-qbconfig D:\path\qBittorrent.ini` |
| qBittorrent automatisch konfigurieren | `-configure` | `-configure` |
| Vorherige Installation wiederherstellen | `-rollback` | `-rollback` |
| Vollständig deinstallieren (keine Installer-Backups behalten) | `-uninstall -purge` | `-uninstall -purge` |
| Hilfe | `-help` | `-help` |
| Docker-Container wählen | `--container=NAME` | — |
| Docker-Container auflisten | `--list-containers` | — |
| Host-Pfad des Docker-`/config` angeben | `--config-root=/path` | — |

</details>

<details>
<summary><b>Hinweise: (zum Aufklappen klicken)</b></summary>

- Ohne `-dev` wird der geprüfte stabile GitHub-Release von `main` installiert; mit `-dev` der aktuelle Entwicklungsstand von `dev` anhand seines exakten Git-SHA.
- `-o` steht für **output** und kann unter Linux mehrfach angegeben werden, um bestehende WebUI-Verzeichnisse mit einem verifizierten Download zu aktualisieren.
- Backups liegen unter `~/.config/weig-qb-webui/backups/`; pro Installationsziel werden die letzten drei getrennt vorgehalten.
- `-configure` aktiviert in qBittorrent **Use alternative WebUI** und setzt **Files location**. Es ist nur für ein einzelnes Ziel zulässig.
- `-rollback` stellt das jüngste Installer-Backup des ausgewählten Ziels wieder her; mehrere explizite Ziele können mit wiederholtem `-o` zurückgesetzt werden.
- `-uninstall -purge` entfernt WebUI und Backups samt Rollback-Status nur dieses Ziels. Backups anderer Ziele bleiben erhalten; leere gemeinsame Statusverzeichnisse werden aufgeräumt.
- Wer später `-rollback` nutzen möchte, lässt bei der Deinstallation `-purge` weg.
- Mit `-version 1.2.0` lässt sich ein bestimmter GitHub-Release installieren. Existiert dieser nicht, gibt es einen Fehler – **kein automatischer Wechsel zu latest oder dev**.
- `-help` zeigt die aktuell unterstützten Optionen.
- Bei mehreren Docker-Containern zunächst `--list-containers` aufrufen und mit `--container=NAME` den gewünschten auswählen. Alternativ `--config-root=/path` angeben.

### Bestimmte Version und Installationsverzeichnis

Linux-Beispiel:

```sh
sh install.sh -version 1.2.0 -o /opt/weig-qb-webui -configure
```

Windows-Beispiel:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -version 1.2.0 -o D:\weig-qb-webui -configure
```

### Rollback

Rollback:

```sh
sh install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -rollback
```

</details>

## Ein-Klick-Deinstallation

<details>
<summary><b>Vollständige Deinstallation für Linux / NAS, Docker und Windows PowerShell</b></summary>

Empfohlen ist standardmäßig die **vollständige Deinstallation ohne Installer-Backups**: WebUI entfernen, die passende Alternative-WebUI-Konfiguration deaktivieren, die installer-eigenen Backups / den Rollback-Status dieses Ziels bereinigen und anschließend das heruntergeladene Installationsskript im aktuellen Verzeichnis löschen.

### Linux / NAS

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Bei einem eigenen Installationspfad `-o /path/to/weig-qb-webui` ergänzen.

### Docker

Ein Container / automatische Erkennung:

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Mehrere Container:

```sh
sh install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./install.sh
```

Bei Verwendung von `--config-root`:

```sh
sh install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\install.ps1 -Force }
```

Bei einem eigenen Installationspfad `-o D:\weig-qb-webui` ergänzen.

`-purge` entfernt nur Backups des aktuellen Deinstallationsziels und lässt andere Installationen unangetastet. Ist das gemeinsame Statusverzeichnis danach leer, wird unter Linux auch `~/.config/weig-qb-webui` (für root: `/root/.config/weig-qb-webui`) bzw. unter Windows `%APPDATA%\weig-qb-webui` entfernt.

Sollen Backups für ein späteres `-rollback` erhalten bleiben, `-purge` einfach weglassen.

</details>

## Weitere Hilfe

Docker, NAS, benutzerdefinierte Pfade, Aktualisierung und manuelle Installation: [Installations-, Upgrade- und Bereitstellungsanleitung](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.de.md).

## Lizenz

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
