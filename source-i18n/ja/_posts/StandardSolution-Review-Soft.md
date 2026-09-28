---
title: "標準液の計算・確認をまとめて行うレビューシステム"
date: 2026-07-02 09:19:11
tags:
  - Python
  - PyQt6
  - 研究室
  - 化学分析
  - 規格
  - 標準滴定液
  - 標準溶液
categories:
  - Python
cover: https://img.weigshare.com/img/002.001.StandardSolution_Conver.png
description: "Python、PyQt6、QFluentWidgets、SQLite で作成した Windows 向け研究室ツール。標準液の計算・確認、温度補正、ビュレット補正、並行測定の集計、相対範囲の自動計算に対応します。"
---

# 開発のきっかけ

化学分析では、標準滴定液の調製や標定を何度も行います。標定後には濃度を計算し、補正値を反映し、並行測定の結果を確認して、最後にレビューまで行う必要があります。これをすべて手作業で行うと時間がかかり、データ量が増えるほど計算ミスや確認漏れも起こりやすくなります。

- このツールは仕事の合間に少しずつ作りました。4 月に着手し、11 月に最初の正式版を完成。6 か月以上かけた、自分にとって初めての本格的な GUI デスクトップアプリです。

- 開発しながら Python と PyQt6 を独学し、画面設計、計算ロジック、テスト、配布まで一人で進めました。QFluentWidgets は日常的に使いやすい UI にするために採用しています。

- 実運用を始めてからは、一人あたり毎週 1 時間以上のレビュー作業を減らせました。「半年かけて道具を作って、その後は毎週 1 時間楽をする」という、ある夜に思いついた小さな目標も実現できました。😆

- 最近退職して少し時間ができたので、コードと資料を整理し、この機会にオープンソースとして公開することにしました。

**[Web プレビュー](https://www.weigshare.com/standard) ⬅** こちらから

# 標準溶液計算レビューシステム

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python">
  <img src="https://img.shields.io/badge/PyQt6-GUI-green" alt="PyQt6">
  <img src="https://img.shields.io/badge/SQLite-Database-blue" alt="SQLite">
  <img src="https://img.shields.io/badge/GPL--3.0-red" alt="GPL3">
</div>

研究室で標準溶液の標定、計算、レビューを行うためのデスクトップアプリです。

温度補正、ビュレット補正、一人による 4 並行、二人による 8 並行、相対範囲の自動計算に対応し、標準溶液管理の効率を高めます。

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo_GIF.gif" >

実験データを入力すると、計算とレビューを自動で完了できます。[exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases) から利用できます。

---

## 主な機能

✅ 温度補正計算  
✅ ビュレット補正値の補正  
✅ 標準溶液濃度の自動計算

✅ 一人 4 並行計算  
✅ 二人 8 並行計算  
✅ 相対範囲計算  
✅ 報告濃度の計算

---

## 対応する標準溶液

- 塩酸、水酸化ナトリウム、硫酸、過マンガン酸カリウム、硝酸銀、チオ硫酸ナトリウム、エチレンジアミン四酢酸（EDTA）、塩化亜鉛、水酸化カリウム-エタノール、炭酸ナトリウムなど

- HCl、NaOH、H₂SO₄、KMnO₄、AgNO₃、Na₂S₂O₃、EDTA、ZnCl₂、KOH-Ethanol、Na₂CO₃、Custom Molar Mass (g/mol)

- **カスタム**

---

## ソフトウェア画面

### メイン画面

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo.png" >

#### 旧画面

複数回の改良を重ねています。

<img src=https://img.weigshare.com/img/002.002.StandardSolution_Review_System_Demo_old.png >

| **入力できる項目** | **自動生成される項目** |
| ---------------- | ---------------- |
| 標準物質の質量 | 実滴定体積 |
| 滴定液の消費体積 | 一人 4 並行の濃度 |
| ビュレット補正値 | 二人 8 並行の濃度 |
| 温度補正値 | 相対範囲 |
| ブランク試験体積 | 報告濃度 |

---

## 実行方法

### リリース版

[exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases) をダウンロードして実行します。

```text
StandardSolution_ReviewSystem.exe
```

## ソースから実行

<details>
    <summary>クリックして展開</summary>

### 開発環境

- Windows 11
- Python 3.12
- PyQt6
- QFluentWidgets
- SQLite
- Nuitka（パッケージング用）

### 依存関係をインストール

```bash
pip install -r requirements.txt
```

### 実行

```bash
python Flu_Main.py
```

## オープンソースライセンス

本プロジェクトは GPL-3.0 License で公開しています。

利用、変更、再配布する場合は GPL-3.0 ライセンスの条件に従ってください。

## 使用しているサードパーティ OSS

以下のオープンソースプロジェクトを使用しています。

- Python、PyQt6、QFluentWidgets、SQLite、Nuitka

すべてのオープンソース開発者の貢献に感謝します。

</details>
