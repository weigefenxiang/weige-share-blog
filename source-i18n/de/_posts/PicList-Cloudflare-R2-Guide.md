---
title: "Schnelles, kostenloses Bilderhosting mit PicList + Cloudflare R2 einrichten"
date: 2026-07-08 21:10:08
tags:
  - Hexo
  - PicList
  - Cloudflare
  - R2
  - Bildhosting
categories:
  - Website-Aufbau
cover: https://img.weigshare.com/img/001.PicList-Cloudflare-R2-Guide_cover.png
description: "Einsteigerfreundliche Anleitung für PicList und Cloudflare R2 als Bilderhosting mit eigener Domain und globaler CDN-Auslieferung."
---

# Bevor es losgeht

PicList arbeitet inzwischen gut mit Cloudflare R2 zusammen. Bei der ersten Einrichtung gibt es trotzdem ein paar Stellen, an denen man leicht hängen bleibt:

- Es gibt viele Eingabefelder, und Werte landen schnell im falschen Feld.
- Für diese Konfiguration gibt es keinen eigenen Verbindungstest.
  - Am zuverlässigsten ist es deshalb, nach der Einrichtung tatsächlich ein Bild hochzuladen.

Diese Anleitung zeigt Schritt für Schritt, wie **PicList** mit **Cloudflare R2** verbunden und als schnelles Bilderhosting mit eigener Domain und CDN genutzt wird.

Falls der R2-Bucket noch nicht eingerichtet ist, hilft auch diese Anleitung:

- **[Cloudflare-R2-Anleitung](https://www.fecify.com/doc/cn-1.0/fecify-shop-helper-cloudflare-r2.html)**

Verwendete PicList-Version: **v3.5.0 (Juli 2026)**.

---

Vor Kurzem habe ich die Bilder dieses Blogs zu **Cloudflare R2** migriert und nutze sie zusammen mit **PicList**. Das Ergebnis ist sehr gut:

Vorteile:

✅ Kostenlos  ✅ Stabil  ✅ Schnell  ✅ Eigene Domain  ✅ Globale CDN-Beschleunigung  ✅ Keine Last auf dem VPS

---

# PicList konfigurieren

- Bildhosting: für das Hochladen von Bildern
- Cloud: damit PicList auf den Cloudflare-Bucket zugreifen kann

## Bildhosting-Konfiguration

In der linken Navigation **Bildhosting** → **AWS S3** → **Neue Konfiguration** öffnen:

<img src="https://img.weigshare.com/img/001.002_PicList_orign.png" width="120"/>

### Pflichtfelder

    ● Konfigurationsname: beliebig
    ● AccessKeyId: 18e1************************c0858
    ● secretAccessKey: c8a3********************************************************fa6e
    ● Benutzerdefinierter Endpoint: https://770*************************39d8.r2.cloudflarestorage.com

Alle Werte können hier abgerufen werden: [API-Abbildung](https://img.weigshare.com/img/001.005_CF_API_token.png).

* Berechtigung: **Administrator Lesen und Schreiben** (sonst schlägt der Cloud-Zugriff von PicList fehl).
* Die Zugangsdaten werden nur einmal angezeigt. Deshalb unbedingt speichern, sonst müssen sie neu erstellt werden.

● Bucket: Bei mir heißt er **hexo-img**. [Abbildung](https://img.weigshare.com/img/001.003_CDF_bucket.png)

---

### Optionale Felder

■ Upload-Pfad: **/** (Stammverzeichnis)

Ich möchte die Dateien im Verzeichnis **img** speichern und verwende deshalb **/img/**. [Abbildung](https://img.weigshare.com/img/001.004_Directory.png)

● Benutzerdefinierte Domain: https://img.weigshare.com/  
(Sie kann nach dem Verknüpfen der Domain gesetzt werden. Danach verwenden hochgeladene Dateien URLs unter dieser Domain.) [Abbildung](https://img.weigshare.com/img/001.004_Directory.png)

```shell
https://img.weigeshare.com/img/x.png
```

☐ Ohne benutzerdefinierte Domain erhält man möglicherweise einen Link wie diesen, der sich eventuell nicht direkt öffnen lässt:

```text
    https://770*************************39d8.r2.cloudflarestorage.com/img/0.%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-07-08%20181820.png
```

☐ Region: **auto** (oder us-east-1)

* Zugriffsrichtlinie für hochgeladene Objekte: <span style="color:#ff69b4;font-weight:bold;">public-read</span> (offizielle Empfehlung)

---

## Cloud-Konfiguration

In der linken Navigation **Cloud** → **S3 API** → **Neue Konfiguration** → **Speichern** öffnen:

<img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration1.png" height="280"/> <img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration2.png" height="280"/>

### Pflichtfelder

    ● Konfigurationsname: beliebig
    ● Access Key Id: 18e1************************c0858
    ● Access Key Secret: c8a3********************************************************fa6e
    ● Endpoint / benutzerdefinierter Endpoint: https://770*************************39d8.r2.cloudflarestorage.com

Den API-Token gibt es hier: [API](https://img.weigshare.com/img/001.005_CF_API_token.png).

* Berechtigung: **Administrator Lesen und Schreiben** (sonst schlägt der Cloud-Zugriff von PicList fehl).

● Bucket-Name: **hexo-img**. [Abbildung](https://img.weigshare.com/img/001.003_CDF_bucket.png)

■ Startverzeichnis: **/**

* Ich speichere unter **/img/**: [Abbildung](https://img.weigshare.com/img/001.004_Directory.png)

### Optionale Felder

■ Dateiberechtigung beim Upload: public-read (öffentlich lesbar, offiziell empfohlen)

---

# Häufige Fragen

## Upload erfolgreich, aber das Bild lässt sich nicht öffnen

Prüfen:

- Ob der Bucket öffentlichen Zugriff erlaubt.
- Ob die benutzerdefinierte Domain verknüpft ist.
- Ob die DNS-Auflösung bereits funktioniert.

## AccessDenied

Prüfen:

- Ob die Access Key ID korrekt ist.
- Ob der Secret Access Key korrekt ist.
- Ob der API-Token Lese- und Schreibrechte besitzt.

## SignatureDoesNotMatch

Prüfen:

- Ob der Endpoint korrekt eingetragen ist.

# Fazit

Mein aktueller Blog-Stack:

```text
 Hexo + Butterfly + Github + Cloudflare R2 + Cloudflare CDN
```

Wer für einen Blog eine langfristig stabile Bildhosting-Lösung sucht, sollte PicList + Cloudflare R2 definitiv ausprobieren.
