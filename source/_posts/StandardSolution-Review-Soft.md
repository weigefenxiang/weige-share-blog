---
title: "Laboratory Standard Solution Calculation and Review System"
date: 2026-07-02 09:19:11
tags:
  - Python
  - PyQt6
  - Laboratory
  - Chemical Analysis
  - Standards
  - Standard Titration Solution
  - Standard Solution
categories:
  - Python
cover: https://img.weigshare.com/img/002.001.StandardSolution_Conver.png
description: "A Windows desktop tool built with Python, PyQt6, QFluentWidgets, and SQLite for standard-solution calculations and review, including temperature and burette corrections, parallel results, and relative-range checks."
---

# Why I Built It

Standardizing titration solutions creates a surprising amount of follow-up work: concentrations need to be calculated, correction values applied, parallel results compared, and the final data reviewed. Doing all of that by hand is slow, and the more data there is, the easier it becomes to miss a calculation or review error.

- I built this tool in my spare time. The project started in April, and the first production-ready release was finished in November—more than six months of work and my first GUI desktop application.

- Along the way I taught myself Python and PyQt6, then handled the application design, calculation logic, testing, and deployment myself. QFluentWidgets is used to make the interface more pleasant to work with.

- After the tool was put into real use, it saved each person more than an hour of review work per week. That was the little idea behind the project: spend half a year building something once, then “steal back” an hour every week. 😆

- I recently left my job and finally had time to clean up the project, so I decided to publish it as open source.

**[Web Preview](https://www.weigshare.com/standard) ⬅** Click here

# Standard Solution Calculation Review System

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python">
  <img src="https://img.shields.io/badge/PyQt6-GUI-green" alt="PyQt6">
  <img src="https://img.shields.io/badge/SQLite-Database-blue" alt="SQLite">
  <img src="https://img.shields.io/badge/GPL--3.0-red" alt="GPL3">
</div>

A desktop application for standard-solution standardization, calculation, and review in laboratories.

It supports temperature correction, burette correction, four parallel determinations by one analyst, eight parallel determinations by two analysts, and automatic relative-range calculation, improving the efficiency of laboratory standard-solution management.

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo_GIF.gif" >

After entering experimental data, the system automatically completes the calculation and review. Get started with the [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases).

---

## Features

✅ Temperature-correction calculation  
✅ Burette-correction adjustment  
✅ Automatic standard-solution concentration calculation

✅ Four parallel determinations by one analyst  
✅ Eight parallel determinations by two analysts  
✅ Relative-range calculation  
✅ Reported concentration calculation

---

## Supported Standard Solutions

- Hydrochloric acid, sodium hydroxide, sulfuric acid, potassium permanganate, silver nitrate, sodium thiosulfate, ethylenediaminetetraacetic acid (EDTA), zinc chloride, potassium hydroxide in ethanol, sodium carbonate, and more.

- HCl, NaOH, H₂SO₄, KMnO₄, AgNO₃, Na₂S₂O₃, EDTA, ZnCl₂, KOH-Ethanol, Na₂CO₃, Custom Molar Mass (g/mol)

- **Custom**

---

## User Interface

### Main Interface

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo.png" >

#### Old Interface

The interface has gone through multiple iterations.

<img src=https://img.weigshare.com/img/002.002.StandardSolution_Review_System_Demo_old.png >

| **Input Supported** | **Generated Automatically** |
| ---------------- | ---------------- |
| Primary-standard mass | Actual titration volume |
| Titrant consumption volume | Four parallel concentrations by one analyst |
| Burette correction | Eight parallel concentrations by two analysts |
| Temperature correction | Relative range |
| Blank-test volume | Reported concentration |

---

## How to Run

### Release Build

Download and run the [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases):

```text
StandardSolution_ReviewSystem.exe
```

## Run from Source

<details>
    <summary>Click to expand</summary>

### Development Environment

- Windows 11
- Python 3.12
- PyQt6
- QFluentWidgets
- SQLite
- Nuitka (for packaging)

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run

```bash
python Flu_Main.py
```

## Open-Source License

This project is released under the GPL-3.0 License.

When using, modifying, or distributing the project, please comply with the GPL-3.0 license terms.

## Third-Party Open-Source Components

This project uses the following open-source projects:

- Python, PyQt6, QFluentWidgets, SQLite, Nuitka

Thanks to all open-source developers for their contributions.

</details>
