---
title: "標準溶液計算與審核系統（Standard Solution Review System）"
date: 2026-07-02 09:19:11
tags:
  - Python
  - PyQt6
  - 實驗室
  - 化學分析
  - 國標
  - 標準滴定液
  - 標準溶液
categories:
  - Python
cover: https://img.weigshare.com/img/002.001.StandardSolution_Conver.png
description: "以 Python、PyQt6、QFluentWidgets 與 SQLite 開發的 Windows 實驗室工具，用於標準溶液計算與審核，支援溫度校正、滴定管校正、平行樣統計與相對極差自動計算。"
---

# 專案背景

化學分析工作經常需要配製與標定標準滴定溶液。標定完成後，還要進一步計算濃度、套用校正值、比較平行樣結果並完成審核。全部靠人工計算與覆核，不只花時間，資料一多也更容易出現計算或審核疏漏。

- 這套系統是在工作之餘慢慢做出來的，從 4 月開始，到 11 月完成第一個正式版本，前後花了 6 個多月，也是我第一個真正投入使用的 GUI 桌面程式。

- 開發過程中自學 Python 與 PyQt6，從介面、計算邏輯、測試到部署都自己完成；另外使用 QFluentWidgets 改善日常操作的體驗。

- 實際投入使用後，每人每週可以少花一個多小時在資料審核上。也算實現了某個晚上冒出的念頭——花半年做一個工具，之後每週替自己「偷懶」一小時。😆

- 最近剛離職，終於有時間把專案整理完整，乾脆一起開源分享。

**[網頁預覽](https://www.weigshare.com/standard) ⬅** 點這裡

# 標準溶液計算審核系統

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python">
  <img src="https://img.shields.io/badge/PyQt6-GUI-green" alt="PyQt6">
  <img src="https://img.shields.io/badge/SQLite-Database-blue" alt="SQLite">
  <img src="https://img.shields.io/badge/GPL--3.0-red" alt="GPL3">
</div>

一款用於實驗室標準溶液標定、計算與審核的軟體。

支援溫度校正、滴定管校正、單人四平行、雙人八平行及相對極差自動計算，提高實驗室標準溶液管理效率。

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo_GIF.gif" >

輸入實驗數據後，即可自動完成計算與審核。開始使用 [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases)。

---

## 功能特點

✅ 溫度校正計算  
✅ 滴定管校正值修正  
✅ 標液濃度自動計算

✅ 單人四平行計算  
✅ 雙人八平行計算  
✅ 相對極差計算  
✅ 標液報出濃度計算

---

## 支援的標準溶液

- 鹽酸、氫氧化鈉、硫酸、高錳酸鉀、硝酸銀、硫代硫酸鈉、乙二胺四乙酸（EDTA）、氯化鋅、氫氧化鉀-乙醇、碳酸鈉等

- HCl、NaOH、H₂SO₄、KMnO₄、AgNO₃、Na₂S₂O₃、EDTA、ZnCl₂、KOH-Ethanol、Na₂CO₃、Custom Molar Mass (g/mol)

- **自訂**

---

## 軟體介面

### 主介面

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo.png" >

#### 舊介面

經過多次迭代：

<img src=https://img.weigshare.com/img/002.002.StandardSolution_Review_System_Demo_old.png >

| **支援輸入** | **自動產生** |
| ---------------- | ---------------- |
| 基準物質質量 | 實際滴定體積 |
| 滴定液消耗體積 | 單人四平行濃度 |
| 滴定管校正值 | 雙人八平行濃度 |
| 溫度校正值 | 相對極差 |
| 空白試驗體積 | 報出濃度 |

---

## 執行方式

### 發布版

下載並執行 [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases)：

```text
StandardSolution_ReviewSystem.exe
```

## 從原始碼執行

<details>
    <summary>點擊展開</summary>

### 開發環境

- Windows 11
- Python 3.12
- PyQt6
- QFluentWidgets
- SQLite
- Nuitka（用於打包）

### 安裝依賴

```bash
pip install -r requirements.txt
```

### 執行程式

```bash
python Flu_Main.py
```

## 開源授權

本專案採用 GPL-3.0 License 開源。

使用、修改和散佈本專案時，請遵守 GPL-3.0 授權條款。

## 第三方開源元件

本專案使用以下開源專案：

- Python、PyQt6、QFluentWidgets、SQLite、Nuitka

感謝所有開源專案開發者的貢獻。

</details>
