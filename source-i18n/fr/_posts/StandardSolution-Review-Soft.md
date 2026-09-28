---
title: "Système de calcul et de vérification des solutions étalons en laboratoire"
date: 2026-07-02 09:19:11
tags:
  - Python
  - PyQt6
  - Laboratoire
  - Analyse chimique
  - Normes
  - Solution titrée
  - Solution étalon
categories:
  - Python
cover: https://img.weigshare.com/img/002.001.StandardSolution_Conver.png
description: "Application Windows développée avec Python, PyQt6, QFluentWidgets et SQLite pour calculer et vérifier les solutions étalons, avec corrections de température et de burette, séries parallèles et calcul automatique de l’étendue relative."
---

# Pourquoi j’ai créé cet outil

En analyse chimique, le travail ne s’arrête pas à la préparation et à l’étalonnage des solutions titrantes. Il faut ensuite calculer les concentrations, appliquer les corrections, comparer les essais parallèles et valider les résultats. Tout faire manuellement prend du temps et, lorsque les données s’accumulent, augmente le risque d’erreur de calcul ou de vérification.

- J’ai développé ce système sur mon temps libre. Le projet a commencé en avril et la première version réellement utilisable a été terminée en novembre, soit plus de six mois de travail. C’était aussi ma première véritable application de bureau avec interface graphique.

- J’ai appris Python et PyQt6 au fil du projet, puis réalisé seul la conception, la logique de calcul, les tests et le déploiement. QFluentWidgets m’a permis d’obtenir une interface plus agréable au quotidien.

- Une fois utilisé en conditions réelles, l’outil a permis d’économiser plus d’une heure de vérification par personne et par semaine. C’était l’idée de départ : passer six mois à fabriquer un outil pour « récupérer » ensuite une heure chaque semaine. 😆

- Ayant récemment quitté mon emploi, j’ai enfin eu le temps de nettoyer le projet et j’ai choisi de le publier en open source.

**[Aperçu Web](https://www.weigshare.com/standard) ⬅** Ouvrir

# Système de calcul et de vérification des solutions étalons

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python">
  <img src="https://img.shields.io/badge/PyQt6-GUI-green" alt="PyQt6">
  <img src="https://img.shields.io/badge/SQLite-Database-blue" alt="SQLite">
  <img src="https://img.shields.io/badge/GPL--3.0-red" alt="GPL3">
</div>

Une application de bureau destinée à l’étalonnage, au calcul et à la vérification des solutions étalons en laboratoire.

Elle prend en charge la correction de température, la correction de burette, quatre essais parallèles réalisés par une personne, huit essais parallèles réalisés par deux personnes et le calcul automatique de l’étendue relative, afin d’améliorer l’efficacité de la gestion des solutions étalons.

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo_GIF.gif" >

Après saisie des données expérimentales, le calcul et la vérification sont effectués automatiquement. Téléchargez l’[exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases) pour commencer.

---

## Fonctionnalités

✅ Calcul de correction de température  
✅ Correction de la burette  
✅ Calcul automatique de la concentration de la solution étalon

✅ Quatre essais parallèles pour une personne  
✅ Huit essais parallèles pour deux personnes  
✅ Calcul de l’étendue relative  
✅ Calcul de la concentration à reporter

---

## Solutions étalons prises en charge

- Acide chlorhydrique, hydroxyde de sodium, acide sulfurique, permanganate de potassium, nitrate d’argent, thiosulfate de sodium, acide éthylènediaminetétraacétique (EDTA), chlorure de zinc, hydroxyde de potassium dans l’éthanol, carbonate de sodium, etc.

- HCl, NaOH, H₂SO₄, KMnO₄, AgNO₃, Na₂S₂O₃, EDTA, ZnCl₂, KOH-Ethanol, Na₂CO₃, Custom Molar Mass (g/mol)

- **Personnalisé**

---

## Interface du logiciel

### Interface principale

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo.png" >

#### Ancienne interface

L’interface a connu plusieurs itérations.

<img src=https://img.weigshare.com/img/002.002.StandardSolution_Review_System_Demo_old.png >

| **Saisie prise en charge** | **Généré automatiquement** |
| ---------------- | ---------------- |
| Masse de la substance de référence | Volume réel de titrage |
| Volume de titrant consommé | Quatre concentrations parallèles par une personne |
| Correction de burette | Huit concentrations parallèles par deux personnes |
| Correction de température | Étendue relative |
| Volume du blanc | Concentration à reporter |

---

## Exécution

### Version publiée

Téléchargez puis lancez l’[exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases) :

```text
StandardSolution_ReviewSystem.exe
```

## Exécution depuis le code source

<details>
    <summary>Cliquez pour développer</summary>

### Environnement de développement

- Windows 11
- Python 3.12
- PyQt6
- QFluentWidgets
- SQLite
- Nuitka (pour le packaging)

### Installer les dépendances

```bash
pip install -r requirements.txt
```

### Lancer le programme

```bash
python Flu_Main.py
```

## Licence open source

Ce projet est publié sous licence GPL-3.0.

Toute utilisation, modification ou redistribution doit respecter les conditions de la GPL-3.0.

## Composants open source tiers

Le projet utilise notamment :

- Python, PyQt6, QFluentWidgets, SQLite, Nuitka

Merci à tous les développeurs des projets open source utilisés.

</details>
