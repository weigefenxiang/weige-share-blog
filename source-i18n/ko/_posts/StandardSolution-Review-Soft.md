---
title: "실험실 표준용액 계산·검토 시스템"
date: 2026-07-02 09:19:11
tags:
  - Python
  - PyQt6
  - 실험실
  - 화학 분석
  - 표준
  - 표준 적정액
  - 표준용액
categories:
  - Python
cover: https://img.weigshare.com/img/002.001.StandardSolution_Conver.png
description: "Python, PyQt6, QFluentWidgets, SQLite로 만든 Windows용 실험실 도구로, 표준용액 계산과 검토, 온도·뷰렛 보정, 반복 측정 통계, 상대 범위 자동 계산을 지원합니다."
---

# 만든 이유

화학 분석에서는 표준 적정용액을 조제하고 표정한 뒤에도 해야 할 일이 많습니다. 농도를 계산하고, 보정값을 반영하고, 반복 측정 결과를 비교한 다음 최종 검토까지 해야 합니다. 이 과정을 전부 손으로 처리하면 시간이 오래 걸리고, 데이터가 많아질수록 계산 실수나 검토 누락이 생기기 쉽습니다.

- 이 프로그램은 업무 외 시간을 이용해 만들었습니다. 4월에 시작해 11월에 첫 정식 버전을 완성했고, 6개월 넘게 걸린 제 첫 GUI 데스크톱 프로그램이기도 합니다.

- 개발하면서 Python과 PyQt6를 독학했고, 화면 설계부터 계산 로직, 테스트, 배포까지 직접 진행했습니다. QFluentWidgets는 실제 업무에서 더 편하게 사용할 수 있도록 UI를 다듬는 데 사용했습니다.

- 실제로 사용해 보니 한 사람당 매주 1시간 이상 검토 시간을 줄일 수 있었습니다. “반년 동안 도구 하나를 만들고, 그 뒤에는 매주 한 시간씩 편해지자”라는 어느 날 밤의 작은 생각을 실현한 셈입니다. 😆

- 최근 퇴사한 뒤 여유가 생겨 프로젝트를 정리했고, 이참에 오픈 소스로 공개하기로 했습니다.

**[웹 미리보기](https://www.weigshare.com/standard) ⬅** 여기에서 확인

# 표준용액 계산 검토 시스템

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python">
  <img src="https://img.shields.io/badge/PyQt6-GUI-green" alt="PyQt6">
  <img src="https://img.shields.io/badge/SQLite-Database-blue" alt="SQLite">
  <img src="https://img.shields.io/badge/GPL--3.0-red" alt="GPL3">
</div>

실험실에서 표준용액의 표정, 계산 및 검토를 수행하기 위한 데스크톱 프로그램입니다.

온도 보정, 뷰렛 보정, 1인 4회 평행시험, 2인 8회 평행시험, 상대범위 자동 계산을 지원해 실험실 표준용액 관리 효율을 높입니다.

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo_GIF.gif" >

실험 데이터를 입력하면 계산과 검토가 자동으로 완료됩니다. [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases)를 다운로드해 사용할 수 있습니다.

---

## 주요 기능

✅ 온도 보정 계산  
✅ 뷰렛 보정값 적용  
✅ 표준용액 농도 자동 계산

✅ 1인 4회 평행시험 계산  
✅ 2인 8회 평행시험 계산  
✅ 상대범위 계산  
✅ 보고 농도 계산

---

## 지원 표준용액

- 염산, 수산화나트륨, 황산, 과망간산칼륨, 질산은, 티오황산나트륨, 에틸렌디아민테트라아세트산(EDTA), 염화아연, 수산화칼륨-에탄올, 탄산나트륨 등

- HCl, NaOH, H₂SO₄, KMnO₄, AgNO₃, Na₂S₂O₃, EDTA, ZnCl₂, KOH-Ethanol, Na₂CO₃, Custom Molar Mass (g/mol)

- **사용자 지정**

---

## 소프트웨어 화면

### 메인 화면

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo.png" >

#### 이전 화면

여러 차례 개선을 거쳤습니다.

<img src=https://img.weigshare.com/img/002.002.StandardSolution_Review_System_Demo_old.png >

| **입력 항목** | **자동 생성 항목** |
| ---------------- | ---------------- |
| 표준물질 질량 | 실제 적정 부피 |
| 적정액 소비 부피 | 1인 4회 평행 농도 |
| 뷰렛 보정값 | 2인 8회 평행 농도 |
| 온도 보정값 | 상대범위 |
| 공시험 부피 | 보고 농도 |

---

## 실행 방법

### 배포 버전

[exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases)를 다운로드해 실행합니다.

```text
StandardSolution_ReviewSystem.exe
```

## 소스 코드로 실행

<details>
    <summary>펼치기</summary>

### 개발 환경

- Windows 11
- Python 3.12
- PyQt6
- QFluentWidgets
- SQLite
- Nuitka (패키징용)

### 의존성 설치

```bash
pip install -r requirements.txt
```

### 실행

```bash
python Flu_Main.py
```

## 오픈소스 라이선스

이 프로젝트는 GPL-3.0 License로 공개됩니다.

사용, 수정, 배포 시 GPL-3.0 라이선스 조건을 따라주세요.

## 서드파티 오픈소스 구성요소

다음 오픈소스 프로젝트를 사용합니다.

- Python, PyQt6, QFluentWidgets, SQLite, Nuitka

모든 오픈소스 개발자의 기여에 감사드립니다.

</details>
