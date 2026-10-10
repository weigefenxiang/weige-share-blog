---
title: "WeiG qB WebUI: qBittorrent 대체 WebUI 초보자 설치 가이드"
date: 2026-09-28 17:15:00
tags:
  - qBittorrent
  - WebUI
  - NAS
  - Docker
categories:
  - qBittorrent
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif
description: "Windows, Linux, NAS, Docker에서 WeiG qB WebUI를 설치하고 qBittorrent의 대체 WebUI로 활성화하는 과정을 초보자 기준으로 설명합니다."
---

브라우저에서 qBittorrent를 관리하고 있다면, 특히 **NAS, Docker, 모바일** 환경에서는 WeiG qB WebUI를 사용했을 때 일상적인 조작이 훨씬 편해집니다. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">온라인 미리보기</a></strong>

약 7년 전, 몇몇 비공개 토렌트 트래커에 가입했습니다. 당시 NAS에 설치한 qBittorrent 4.1.9는 최신 버전이었는데, 지금까지 쓰게 될 줄은 몰랐습니다.

한 번은 메이저 버전 업데이트를 시도했습니다. 기억으로는 4.2.5였는데, 업데이트 후 클라이언트에서 토렌트 작업이 사라져 시딩을 이어 갈 수 없었습니다. 쌓여 있던 토렌트가 워낙 많아 복구하는 데 꽤 애를 먹었죠. 그 뒤로는 잘 돌아가는 버전을 굳이 건드리지 않게 됐습니다.

졸업하고 일을 시작한 뒤로는 PC 앞에 앉아 있는 시간이 줄었고, NAS도 대부분 휴대폰으로 관리합니다. 하지만 기본 WebUI는 작은 화면에서 쓰기 불편했습니다. 다른 대체 WebUI도 사용해 봤지만 구버전 qBittorrent와 호환되지 않는 경우가 적지 않았습니다.

그래서 직접 WeiG qB WebUI를 만들기 시작했습니다. 현재 qBittorrent 4.1.x부터 5.2.x까지 여러 안정 버전을 지원합니다. 호환성 문제나 개선 아이디어가 있다면 댓글로 알려 주세요.

**WeiG qB WebUI**는 데스크톱과 모바일에서 사용할 수 있는 qBittorrent의 **대체 WebUI**입니다.

- 📱 모바일 반응형
- 🌙 다크 모드
- 🧱 오래된 qBittorrent 버전과 호환
- ✅ **qBittorrent 4.1.x → 5.2.x** 지원
- 🐳 Windows, Linux, Docker, NAS 지원

[프로젝트](https://github.com/weigefenxiang/WeiG-qB-WebUI)

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Shell-8A2BE2?logo=gnubash&logoColor=white" alt="Shell">
</div>

## 인터페이스 미리보기

### 데스크톱

<p align="center">
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif" alt="WeiG qB WebUI 데스크톱 화면" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>


### 모바일

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
    <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview.gif" alt="WeiG qB WebUI 모바일 사용 시연">
    <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview.png" alt="WeiG qB WebUI 모바일 화면 모음">
  </div>
</div>

## 초보자 설치

<details>
<summary><b>처음 설치하나요? 1분 가이드 펼치기</b></summary>

### 1. 압축 풀기

최신 정식 버전 [**weig-qb-webui.zip**](https://github.com/weigefenxiang/WeiG-qB-WebUI/releases/latest/download/weig-qb-webui.zip)을 내려받아 압축을 풀면 다음 폴더가 바로 생성됩니다. 이름을 바꿀 필요는 없습니다.

```text
weig-qb-webui/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

**`weig-qb-webui` 전체 폴더**가 WebUI 루트입니다. `public`이나 `private`만 복사하지 마세요.

### 2. 고정된 위치로 이동

나중에 실수로 삭제하지 않을 위치에 전체 폴더를 옮깁니다.

```text
Windows: D:\weig-qb-webui
Linux:   /opt/weig-qb-webui
```

이 경로를 qBittorrent에 입력합니다.

### 3. qBittorrent에서 활성화

qBittorrent를 엽니다.

**도구 → 옵션… → WebUI**

현재 qBittorrent 공식 한국어 UI 용어입니다. 이어서:

1. **대체 WebUI 사용**을 켭니다.
2. **파일 위치:**를 찾습니다.
3. 저장한 `weig-qb-webui` 폴더 경로를 입력합니다.

Windows 예시:

```text
D:\weig-qb-webui
```

Linux 예시:

```text
/opt/weig-qb-webui
```

4. **확인/OK**을 눌러 저장합니다.
5. qBittorrent WebUI 페이지를 새로고침합니다. 이전 화면이 남으면 `Ctrl + F5`를 눌러 보세요.

> **경로가 맞는지 확인하는 방법:** 입력한 폴더 안에 `public`, `private`, `VERSION` 등이 바로 보여야 합니다.

> **Docker 사용자:** qBittorrent는 컨테이너 안에서 실행되므로 호스트 경로를 그대로 입력할 수 없는 경우가 많습니다. 아래 Docker 안내를 확인하세요.

</details>

## 원클릭 설치

Linux / NAS 설치 스크립트는 아래 고정 Dev Pages 주소에서 받습니다. **스크립트 주소가 설치 채널을 결정하지는 않습니다.** `-dev`가 없으면 `main`의 검증된 최신 GitHub 정식 버전을, `-dev`가 있으면 현재 `dev`의 exact-SHA 개발 버전을 설치합니다. 스크립트는 이후 업데이트와 롤백을 위해 현재 폴더에 남습니다.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

<details>
<summary><b>스크립트 위치와 기본 WebUI 설치 경로 보기</b></summary>

```text
./install.sh
```

기본 WebUI 설치 경로:

```text
~/.local/share/weig-qb-webui
```

`root`로 실행한 경우 일반적으로:

```text
/root/.local/share/weig-qb-webui
```

</details>

### Docker

<details>
<summary><b>Docker 원클릭 설치 / 여러 컨테이너 / 경로 설명</b></summary>

#### 호스트와 컨테이너

- **호스트**: Docker가 실제로 실행되는 Linux/NAS 시스템입니다.
- **컨테이너**: qBittorrent가 실행되는 Docker 환경입니다.

예를 들어:

```text
호스트:      /root/qbittorrent/config
   ↓ 매핑
컨테이너:    /config
```

Docker Compose 예시:

```yaml
volumes:
  - /root/qbittorrent/config:/config
```

WebUI가 호스트의:

```text
/root/qbittorrent/config/weig-qb-webui
```

에 설치되었다면 qBittorrent의 **파일 위치:**에는:

```text
/config/weig-qb-webui
```

를 입력해야 합니다.

#### qBittorrent 컨테이너가 하나뿐인 경우

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

설치기가 실행 중인 qBittorrent 컨테이너와 `/config` 매핑을 자동으로 찾습니다.

#### 컨테이너 목록 보기

```sh
sh install.sh --list-containers
```

또는:

```sh
docker ps
```

`qbittorrent`를 명시적으로 선택:

```sh
sh install.sh --container=qbittorrent -configure
```

여러 컨테이너가 있으면 설치기는 임의로 선택하지 않습니다.

#### 상황 3: qBittorrent 컨테이너가 여러 개일 때

`qbittorrent`와 `qbittorrent-test`가 모두 있다면 목록을 먼저 확인하고 설치 대상을 지정하세요. 설치 프로그램이 임의로 선택하지 않습니다.

```sh
sh install.sh --list-containers
sh install.sh --container=qbittorrent -configure
sh install.sh --container=qbittorrent-test -configure
```

#### 호스트의 `/config` 경로를 알고 있는 경우

```sh
sh install.sh --config-root=/root/qbittorrent/config -configure
```

Synology 예시:

```sh
sh install.sh --config-root=/volume1/docker/qbittorrent -configure
```

다른 NAS 예시:

```sh
sh install.sh --config-root=/share/Container/qbittorrent -configure
```

#### WebUI 경로 지정

```sh
sh install.sh --container=qbittorrent -o /config/weig-qb-webui -configure
```

#### 상황 6: 기존 WebUI 여러 개를 한 번에 업데이트

qBittorrent 인스턴스를 여러 개 사용한다면 `-o`를 반복해 지정할 수 있습니다. 설치 파일은 한 번만 내려받아 검증하고, 모든 대상을 준비한 뒤 전환합니다. 백업은 `~/.config/weig-qb-webui/backups/`에 대상별로 최근 3개씩 따로 보관됩니다.

```sh
sh install.sh -dev \
  -o /root/qbittorrent/config/weig-qb-webui \
  -o /root/qbittorrent3/config/weig-qb-webui
```

다중 대상 설치에는 `-configure`를 사용하지 마세요. 각 인스턴스는 기존 WebUI 경로를 유지합니다. 옵션은 `sh install.sh -help`에서 확인할 수 있습니다.

#### 설치 후 경로 확인

설치가 완료되면 다음과 비슷한 경로가 표시됩니다. 첫 번째는 호스트의 실제 설치 위치이고, 두 번째는 qBittorrent의 **Files location**에 입력할 컨테이너 내부 경로입니다.

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
<summary><b>설치 경로 보기</b></summary>

```text
C:\Users\<사용자 이름>\AppData\Local\weig-qb-webui
```

</details>

## 자주 쓰는 옵션

<details>
<summary><b>Linux와 Windows는 같은 옵션 이름을 사용하며 PowerShell은 대소문자를 구분하지 않습니다 (펼치기)</b></summary>

PowerShell 매개변수 이름은 대소문자를 구분하지 않습니다.

| 용도 | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| 최신 정식 버전 | 기본값 | 기본값 |
| 특정 Release | `-version 1.2.0` | `-version 1.2.0` |
| 개발 버전 | `-dev` | `-dev` |
| 설치 경로 지정 | `-o /path` (Linux에서는 여러 번 지정 가능) | `-o D:\path` 또는 `-output D:\path` |
| 사용자 지정 qBittorrent 설정 파일 | — | `-qbconfig D:\path\qBittorrent.ini` |
| qBittorrent 자동 설정 | `-configure` | `-configure` |
| 이전 설치로 롤백 | `-rollback` | `-rollback` |
| 완전 제거(설치 프로그램 백업 미보관) | `-uninstall -purge` | `-uninstall -purge` |
| 도움말 | `-help` | `-help` |
| Docker 컨테이너 지정 | `--container=NAME` | — |
| Docker 컨테이너 목록 | `--list-containers` | — |
| Docker `/config` 호스트 경로 지정 | `--config-root=/path` | — |

</details>

<details>
<summary><b>설명: (클릭하여 펼치기)</b></summary>

- `-dev` 없이 실행하면 `main`의 검증된 GitHub 정식 릴리스를 설치합니다. `-dev`는 현재 `dev`의 exact-SHA 개발 빌드를 선택합니다.
- `-o`는 **output**의 약자로, Linux에서 여러 번 지정하면 한 번의 다운로드로 기존 WebUI 폴더들을 업데이트할 수 있습니다.
- 백업은 `~/.config/weig-qb-webui/backups/`에 저장되며 설치 대상별로 최신 3개씩 보관됩니다.
- `-configure`는 qBittorrent의 **Use alternative WebUI**를 켜고 **Files location**을 지정합니다. 단일 대상만 지원합니다.
- `-rollback`은 선택한 대상의 최근 설치 프로그램 백업을 복원합니다. `-o`를 반복하면 여러 명시적 대상도 롤백할 수 있습니다.
- `-uninstall -purge`는 해당 대상의 WebUI와 백업, 롤백 상태를 제거하되 다른 대상의 백업은 그대로 두며 공유 폴더는 비었을 때만 정리합니다.
- 나중에 `-rollback`을 쓸 계획이라면 제거할 때 `-purge`를 생략하세요.
- `-version 1.2.0`처럼 GitHub 정식 릴리스를 지정할 수 있습니다. 없으면 오류가 나며 **latest나 dev로 자동 전환하지 않습니다**.
- `-help`로 현재 지원하는 옵션을 확인할 수 있습니다.
- Docker 컨테이너가 여러 개면 `--list-containers`로 확인한 뒤 `--container=NAME`으로 선택하세요. 호스트 설정 디렉터리는 `--config-root=/path`로 지정할 수 있습니다.

### 특정 버전과 설치 디렉터리

Linux 예시:

```sh
sh install.sh -version 1.2.0 -o /opt/weig-qb-webui -configure
```

Windows 예시:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -version 1.2.0 -o D:\weig-qb-webui -configure
```

### 롤백

롤백:

```sh
sh install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -rollback
```

</details>

## 원클릭 제거

<details>
<summary><b>Linux / NAS, Docker, Windows PowerShell 완전 제거</b></summary>

기본적으로 **설치 프로그램 백업을 남기지 않는 완전 제거**를 권장합니다. WebUI를 제거하고 현재 대상의 대체 WebUI 설정을 비활성화한 뒤, 해당 대상의 installer-owned backups / rollback 상태와 현재 디렉터리의 설치 스크립트까지 정리합니다.

### Linux / NAS

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

사용자 지정 설치 경로라면 `-o /path/to/weig-qb-webui`를 추가하세요.

### Docker

단일 컨테이너 자동 감지:

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

여러 컨테이너:

```sh
sh install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./install.sh
```

`--config-root` 사용 시:

```sh
sh install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\install.ps1 -Force }
```

사용자 지정 설치 경로라면 `-o D:\weig-qb-webui`를 추가하세요.

`-purge`는 현재 제거 대상이 소유한 백업만 삭제하며 다른 설치의 백업은 건드리지 않습니다. 공유 상태 디렉터리가 비면 Linux의 `~/.config/weig-qb-webui`(root는 `/root/.config/weig-qb-webui`) 또는 Windows의 `%APPDATA%\weig-qb-webui`도 함께 제거됩니다.

나중에 `-rollback`을 위해 백업을 남기려면 `-purge`만 빼면 됩니다.

</details>

## 추가 도움말

Docker, NAS, 사용자 지정 경로, 업데이트 및 수동 배포는 [설치, 업그레이드 및 수동 배포](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.ko.md)를 참고하세요.

## 라이선스

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
