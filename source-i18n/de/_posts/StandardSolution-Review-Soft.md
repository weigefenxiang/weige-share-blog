---
title: "Berechnungs- und Prüfsystem für Standardlösungen im Labor"
date: 2026-07-02 09:19:11
tags:
  - Python
  - PyQt6
  - Labor
  - Chemische Analyse
  - Normen
  - Standard-Titrationslösung
  - Standardlösung
categories:
  - Python
cover: https://img.weigshare.com/img/002.001.StandardSolution_Conver.png
description: "Windows-Desktopanwendung auf Basis von Python, PyQt6, QFluentWidgets und SQLite für Berechnung und Prüfung von Standardlösungen mit Temperatur- und Bürettenkorrektur, Parallelwerten und automatischer relativer Spannweite."
---

# Warum ich das Programm gebaut habe

Bei chemischen Analysen endet die Arbeit nach dem Ansetzen und Einstellen einer Maßlösung nicht. Danach müssen Konzentrationen berechnet, Korrekturwerte berücksichtigt, Parallelbestimmungen verglichen und die Ergebnisse geprüft werden. Wird das alles von Hand erledigt, kostet es viel Zeit und bei größeren Datenmengen steigt das Risiko für Rechen- oder Prüffehler.

- Ich habe das Programm neben der Arbeit entwickelt. Der Start war im April, die erste produktive Version war im November fertig. Insgesamt stecken mehr als sechs Monate Arbeit darin – und es war zugleich meine erste richtige GUI-Desktopanwendung.

- Während der Entwicklung habe ich mir Python und PyQt6 selbst beigebracht und Gestaltung, Rechenlogik, Tests und Bereitstellung eigenständig umgesetzt. QFluentWidgets sorgt für eine angenehmere Bedienung im Alltag.

- Im praktischen Einsatz spart das Tool pro Person mehr als eine Stunde Prüfarbeit pro Woche. Damit wurde eine kleine Idee aus einem späten Abend Wirklichkeit: einmal ein halbes Jahr investieren und danach jede Woche eine Stunde „zurückgewinnen“. 😆

- Nach meinem kürzlichen Jobwechsel hatte ich endlich Zeit, das Projekt aufzuräumen. Deshalb stelle ich es nun als Open Source zur Verfügung.

**[Web-Vorschau](https://www.weigshare.com/standard) ⬅** Hier öffnen

# Standardlösungs-Berechnungs- und Prüfsystem

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python">
  <img src="https://img.shields.io/badge/PyQt6-GUI-green" alt="PyQt6">
  <img src="https://img.shields.io/badge/SQLite-Database-blue" alt="SQLite">
  <img src="https://img.shields.io/badge/GPL--3.0-red" alt="GPL3">
</div>

Eine Desktop-Anwendung zur Standardisierung, Berechnung und Prüfung von Standardlösungen im Labor.

Unterstützt werden Temperaturkorrektur, Bürettenkorrektur, vier Parallelbestimmungen durch eine Person, acht Parallelbestimmungen durch zwei Personen sowie die automatische Berechnung der relativen Spannweite. Dadurch wird die Verwaltung von Standardlösungen effizienter.

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo_GIF.gif" >

Nach Eingabe der Messdaten werden Berechnung und Prüfung automatisch durchgeführt. Die [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases) kann direkt verwendet werden.

---

## Funktionen

✅ Temperaturkorrektur  
✅ Korrektur des Bürettenwerts  
✅ Automatische Berechnung der Konzentration der Standardlösung

✅ Vier Parallelbestimmungen durch eine Person  
✅ Acht Parallelbestimmungen durch zwei Personen  
✅ Berechnung der relativen Spannweite  
✅ Berechnung der auszugebenden Konzentration

---

## Unterstützte Standardlösungen

- Salzsäure, Natriumhydroxid, Schwefelsäure, Kaliumpermanganat, Silbernitrat, Natriumthiosulfat, Ethylendiamintetraessigsäure (EDTA), Zinkchlorid, Kaliumhydroxid-Ethanol, Natriumcarbonat usw.

- HCl, NaOH, H₂SO₄, KMnO₄, AgNO₃, Na₂S₂O₃, EDTA, ZnCl₂, KOH-Ethanol, Na₂CO₃, Custom Molar Mass (g/mol)

- **Benutzerdefiniert**

---

## Benutzeroberfläche

### Hauptfenster

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo.png" >

#### Alte Oberfläche

Die Oberfläche wurde mehrfach überarbeitet.

<img src=https://img.weigshare.com/img/002.002.StandardSolution_Review_System_Demo_old.png >

| **Eingabe** | **Automatisch erzeugt** |
| ---------------- | ---------------- |
| Masse der Primärsubstanz | Tatsächliches Titrationsvolumen |
| Verbrauchtes Titrationsvolumen | Vier Parallelkonzentrationen einer Person |
| Bürettenkorrektur | Acht Parallelkonzentrationen zweier Personen |
| Temperaturkorrektur | Relative Spannweite |
| Blindwertvolumen | Auszugebende Konzentration |

---

## Ausführen

### Release-Version

Die [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases) herunterladen und starten:

```text
StandardSolution_ReviewSystem.exe
```

## Aus dem Quellcode starten

<details>
    <summary>Zum Aufklappen klicken</summary>

### Entwicklungsumgebung

- Windows 11
- Python 3.12
- PyQt6
- QFluentWidgets
- SQLite
- Nuitka (für das Packaging)

### Abhängigkeiten installieren

```bash
pip install -r requirements.txt
```

### Programm starten

```bash
python Flu_Main.py
```

## Open-Source-Lizenz

Dieses Projekt wird unter der GPL-3.0 License veröffentlicht.

Bei Nutzung, Änderung und Weitergabe sind die Bedingungen der GPL-3.0 einzuhalten.

## Verwendete Open-Source-Komponenten

Das Projekt verwendet unter anderem:

- Python, PyQt6, QFluentWidgets, SQLite, Nuitka

Vielen Dank an alle Entwicklerinnen und Entwickler der verwendeten Open-Source-Projekte.

</details>
