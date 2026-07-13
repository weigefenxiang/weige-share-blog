---
title: 标准溶液计算审核系统（Standard Solution Review System）
date: 2026-07-02 09:19:11
sticky: 100
tags:
  - Python
  - PyQt6
  - 实验室
  - 化学分析
  - 国标
  - 标准滴定液
  - 标准溶液
categories:
  - Python
cover: https://img.weigeshare.cc.cd/img/002.001.StandardSolution_Conver.png
description: 基于 Python、PyQt6、QFluentWidgets 与 SQLite 开发的实验室Windows标准溶液计算审核系统，支持温度校正、滴定管校正、平行样统计及相对极差自动计算。
---
# 项目背景

化学分析工作中需要大量配制和标定标准滴定溶液。标定完成后，需根据实验数据进行浓度计算、校正值换算及审核确认。人工计算和复核方式不仅效率较低，还容易因数据量大而产生计算或审核误差，增加质量管理风险。

- 利用工作之余时间开发本系统，从 4 月立项到 11 月完成首个正式版本，历时 6 个多月，也是个人开发的第一个可视化桌面程序；

- 自主学习 Python 编程语言及 PyQt6 GUI 开发框架，独立完成软件设计、逻辑编码、测试与部署；QFluentWidgets 框架优化界面交互体验。

- 实际投入使用后，每人每周可节省约 1 小时以上的数据审核时间，实现了某个夜晚的一个梦——用半年开发一个工具，换来每周“偷懒”一小时。😆

- 近期刚离职，闲暇之余整理完毕，索性作为开源项目分享出来。

# 标准溶液计算审核系统

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python">
  <img src="https://img.shields.io/badge/PyQt6-GUI-green" alt="PyQt6">
  <img src="https://img.shields.io/badge/SQLite-Database-blue" alt="SQLite">
  <img src="https://img.shields.io/badge/GPL--3.0-red" alt="GPL3">
</div>

一款用于实验室标准溶液标定、计算与审核的软件。

支持温度校正、滴定管校正、单人四平行、双人八平行及相对极差自动计算，提高实验室标准溶液管理效率。

<img src="https://img.weigeshare.cc.cd/img/002.StandardSolution_Review_System_Demo_GIF.gif" >

输入实验数据后，即可自动完成计算与审核。开始使用 [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases)

---

## 功能特点

✅ 温度校正计算
✅ 滴定管校正值修正
✅ 标液浓度自动计算

✅ 单人四平行计算
✅ 双人八平行计算
✅ 相对极差计算 
✅ 标液报出浓度计算

---


## 支持的标准溶液

- 盐酸、氢氧化钠、硫酸、高锰酸钾、硝酸银、硫代硫酸钠、乙二胺四乙酸（EDTA）、氯化锌、氢氧化钾-乙醇、碳酸钠等

- HCl、NaOH、H₂SO₄、KMnO₄、AgNO₃、Na₂S₂O₃、EDTA、ZnCl₂、KOH-Ethanol、Na₂CO₃、Custom Molar Mass (g/mol)

- **自定义**

---

## 软件界面

### 主界面

<img src="https://img.weigeshare.cc.cd/img/002.StandardSolution_Review_System_Demo.png" >


| **支持录入**         | **自动生成**         |
| ---------------- | ---------------- |
| 基准物质质量     | 实际滴定体积     |
| 滴定液消耗体积   | 单人四平行浓度         |
| 滴定管校正值     | 双人八平行浓度   |
| 温度校正值       | 相对极差        |
| 空白试验体积     | 报出浓度          |
---

## 运行方式

### 发布版

下载 并 运行 [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases)：

```text
StandardSolution_ReviewSystem.exe
```

## 源码运行

<details>
    <summary>点击展开</summary>

### 开发环境

- Windows 11
- Python 3.12
- PyQt6
- QFluentWidgets
- SQLite
- Nuitka（用于打包）

### 安装依赖

```bash
pip install -r requirements.txt
```

### 运行程序

```bash
python Flu_Main.py
```

## 开源协议

本项目采用 GPL-3.0 License 开源。

使用、修改和分发本项目时，请遵守 GPL-3.0 许可证要求。

## 第三方开源组件

本项目使用了以下开源项目：

- Python、PyQt6、QFluentWidgets、SQLite、Nuitka

感谢所有开源项目开发者的贡献。



</details>