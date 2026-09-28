---
title: "클라우드에서 나만의 OpenWrt 펌웨어 빌드하기: 초보자 가이드"
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - 펌웨어 빌드
categories:
  - OpenWrt
cover: https://img.weigshare.com/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: "로컬 빌드 환경 없이 Wei.G OpenWrt 온라인 커스터마이저와 GitHub Actions를 이용해 원하는 OpenWrt 펌웨어를 클라우드에서 빌드합니다."
---

내 라우터에 맞는 OpenWrt 펌웨어가 필요해도 처음부터 로컬 빌드 환경을 구성할 필요는 없습니다. [Wei.G 온라인 커스터마이저](https://www.weigshare.com/wrt)에서 소스, 타깃, 패키지와 펌웨어 설정을 고른 뒤 GitHub Actions로 보내면, 나머지는 클라우드에서 빌드할 수 있습니다.

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>

## 빠른 시작

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">펌웨어 플래시는 위험할 수 있습니다. 먼저 라우터 모델, 파티션 구성, 플래시 방법을 확인하세요. 확실하지 않다면 플래시하지 마세요.</span>

- **[GitHub](https://github.com/)**에 로그인
- **[Wei.G 온라인 커스터마이저](https://www.weigshare.com/wrt)** 열기
- 처음 사용하는 경우 아래 안내를 참고하세요 👇

## 배경

- **【시작하기 쉽게】** 직접 펌웨어를 빌드해 보고 싶지만 로컬 툴체인을 준비하는 단계부터 막히고 싶지 않은 사람을 위한 진입점입니다.
- **【패키지와 의존성】** 일부 플러그인이나 의존성은 사용하기 전에 펌웨어에 포함해 빌드해야 합니다.
- **【설정 부담】** OpenWrt 빌드 옵션은 많고, 중국 본토의 네트워크 환경에서는 의존 파일 다운로드가 특히 번거로울 수 있습니다.
- **【시간】** 전체 빌드는 몇 시간이 걸릴 수 있고 그 뒤에도 실패할 수 있어, 원인을 직접 찾는 데도 시간이 많이 듭니다.
- **【앞으로의 방향】** 누구나 프로젝트를 Fork해 GitHub **Pages + Actions**로 자기만의 OpenWrt 온라인 빌드 사이트를 운영할 수 있게 하는 것이 장기 목표입니다.
- **【현재 단계】** 아직 테스트 단계라 버그가 남아 있을 수 있습니다. 공유 워크플로를 과도하게 사용하면 GitHub 정책이나 사용량 제한에 걸릴 가능성도 있습니다.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.009.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 지원 대상

현재는 아래 대상만 확인되었습니다. 다른 기기는 아직 검증되지 않았으며 복구 수단이 없다면 사용하지 마세요.

- **소스: [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**
- PC와 모바일에서 모두 접근 가능

## 준비

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">펌웨어 플래시는 위험할 수 있습니다. 먼저 라우터 모델, 파티션 구성, 플래시 방법을 확인하세요. 확실하지 않다면 플래시하지 마세요.</span>

- **[GitHub](https://github.com/)** 계정에 로그인합니다. 계정이 없으면 빌드를 시작할 수 없습니다.
- **[Wei.G 온라인 커스터마이저](https://www.weigshare.com/wrt)**를 엽니다.
  - **[Cloudflare dev 페이지](https://dev.weig-wrt.pages.dev/)** (실험 기능, 최신 기능을 체험할 수 있지만 bug가 있을 수 있습니다)

<!-- 스크린샷 1: 홈페이지에서 Source, Branch, Target, 플러그인 영역 표시 -->

## 1. 파라미터 선택

- 소스를 선택한 뒤 검색창에서 해당 기기 모델이나 환경을 검색합니다. config를 불러올 수도 있습니다.
- **Source → Branch → Target System → Subtarget → Target Profile** 순서로 선택합니다.
  - x86/64 예시: **ImmortalWrt → openwrt-24.10 → x86 → 64 → Generic x86/64**

- **Advanced menuconfig › LuCI › 3. Applications**에서 원하는 애플리케이션을 선택합니다.
- **Advanced menuconfig**의 나머지 고급 설정은 필요에 따라 조정합니다.

그다음 필요에 따라 **시간대**, **펌웨어 테마**, **NTP 서버**, **패키지 미러**를 설정합니다.

<div style="display:flex; gap:10px;">

<img src=https://img.weigshare.com/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="150">

</div>

### 기존 설정 사용

이미 `.config`, `config.buildinfo`, 또는 이전에 내려받은 요청 파일이 있다면 하단의 **설정 불러오기**를 클릭합니다. 확인 창에서 소스, 브랜치, Target Profile, 플러그인, 펌웨어 설정을 확인하세요.

## 2. 빌드 제출

오른쪽 아래의 **클라우드 빌드 제출**을 클릭합니다.

**요청 다운로드 및 GitHub 열기**를 선택하면 브라우저가 JSON 파일을 내려받고 GitHub의 새 Issue 페이지를 자동으로 엽니다.

다운로드한 파일을 Issue 입력창으로 이동한 뒤 **Create**를 클릭합니다.

봇이 Issue에 이번 빌드의 Actions 링크를 답글로 남깁니다.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 3. 펌웨어 다운로드

빌드는 보통 2~4시간이 걸립니다. 완료되면 Actions 페이지 하단의 **Artifacts**에서 다운로드합니다.

- `FIRMWARE-ALL-XXX`: 모든 펌웨어와 체크섬 자료. 처음 플래시할 때는 보통 `factory` 등의 파일을 찾습니다.
- `CONFIG-XXX`: 제출한 설정, 최종 설정, 차이점. 보관을 권장합니다.
- `BUILD-LOGS-XXX`: 전체 빌드 로그. 문제 해결에 사용합니다.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 자주 묻는 질문

- **빌드가 실패하면?** `BUILD-LOGS-…`를 다운로드해 마지막 `Error`를 확인하세요. Issue에서 문제를 보고할 수도 있습니다.
- **취소하려면?** 자신의 빌드 Issue에 `/cancel`이라고 답글을 남기세요.
- **동시에 몇 개까지 빌드할 수 있나요?** 한 계정에서 동시에 2개의 빌드 작업만 허용되며 그 이상은 대기합니다.
- **다운로드 버튼이 없는 이유는?** GitHub Actions의 Artifacts는 일반적으로 로그인해야 다운로드할 수 있습니다.
- **공개 저장소 대기 시간이 길다면?** 앞으로는 [이 프로젝트를 Fork](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)하고 페이지 안내에 따라 자신의 저장소에서 빌드를 실행할 수 있도록 할 예정입니다. 그러면 공유 대기열의 영향을 받지 않습니다.

프로젝트: [WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)

## 감사

- **소스:** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)

- **참고:** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)

- **LuCI 플러그인 개발자 여러분**

- **프로젝트에 참여한 모든 분들**
