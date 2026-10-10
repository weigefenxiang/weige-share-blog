---
title: "WeiG qB WebUI：qBittorrent「替補 WebUI」新手安裝教學"
date: 2026-09-28 17:15:00
tags:
  - qBittorrent
  - WebUI
  - NAS
  - Docker
categories:
  - qBittorrent
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif
description: "從下載到啟用 qBittorrent 的「替補 WebUI」，帶新手一步一步安裝 WeiG qB WebUI，並說明 Windows、Linux、NAS 與 Docker 的路徑差異。"
---

如果你平常都是透過瀏覽器管理 qBittorrent，尤其是在 **NAS、Docker 或手機** 上使用，WeiG qB WebUI 可以讓日常操作舒服很多。<strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">線上預覽</a></strong>

大約七年前，我加入了幾個 PT 站。當時 NAS 上裝的是最新版 qBittorrent 4.1.9，沒想到一用就用到現在。

我也曾試過跨大版本升級（印象中是 4.2.5），結果用戶端裡的種子任務全都不見了，沒辦法正常做種。累積的種子太多，光是恢復就很麻煩。從那之後，只要系統運作穩定，我就不太敢隨便升級了。

畢業開始工作以後，坐在電腦前的時間愈來愈少，NAS 也大多直接用手機管理。可是 qBittorrent 原本的 WebUI 在手機上不太順手；我還試過幾款替代 WebUI，很多卻對舊版本支援得不理想。

於是就有了 WeiG qB WebUI。目前涵蓋 qBittorrent 4.1.x 到 5.2.x 的多個穩定版本。如果遇到相容性問題，或有改善建議，都歡迎留言交流。

**WeiG qB WebUI** 是給 qBittorrent 使用的 **替補 WebUI**，同時照顧桌面與手機操作：

- 📱 手機版自適應
- 🌙 暗夜模式
- 🧱 相容較舊的 qBittorrent 版本
- ✅ 支援 **qBittorrent 4.1.x → 5.2.x**
- 🐳 適用於 Windows、Linux、Docker、NAS

[專案地址](https://github.com/weigefenxiang/WeiG-qB-WebUI)

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Shell-8A2BE2?logo=gnubash&logoColor=white" alt="Shell">
</div>

## 介面預覽

### 桌面端

<p align="center">
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif" alt="WeiG qB WebUI 桌面端介面" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>


### 手機端

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
    <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview.gif" alt="WeiG qB WebUI 手機操作動態示範">
    <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview.png" alt="WeiG qB WebUI 手機多畫面預覽">
  </div>
</div>

## 新手安裝

<details>
<summary><b>第一次安裝？點擊展開 1 分鐘教學</b></summary>

### 1. 解壓縮

下載最新正式版 [**weig-qb-webui.zip**](https://github.com/weigefenxiang/WeiG-qB-WebUI/releases/latest/download/weig-qb-webui.zip)，解壓縮後就會直接得到以下資料夾結構，無須重新命名：

```text
weig-qb-webui/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

整個 **`weig-qb-webui` 資料夾**就是 WebUI 根目錄，不要只複製 `public` 或 `private`。

### 2. 放到固定位置

把整個 `weig-qb-webui` 資料夾移到之後不會隨便刪除的位置，例如：

```text
Windows：D:\weig-qb-webui
Linux：  /opt/weig-qb-webui
```

之後 qBittorrent 要填寫的就是這個目錄。

### 3. 在 qBittorrent 中啟用

開啟 qBittorrent：

**工具 → 選項… → WebUI**

這是 qBittorrent 目前繁體中文官方用語。接著：

1. 勾選 **使用替補 WebUI**。
2. 找到 **檔案位置：**。
3. 填入剛才儲存的 `weig-qb-webui` 資料夾路徑。

Windows 範例：

```text
D:\weig-qb-webui
```

一般 Linux 範例：

```text
/opt/weig-qb-webui
```

4. 按一下 **確定** 儲存設定。
5. 重新整理 qBittorrent WebUI 頁面。如果瀏覽器仍顯示舊頁面，可再按一次 `Ctrl + F5` 強制重新整理。

> **怎麼判斷路徑填對了？** 你填寫的目錄裡應該能直接看到 `public`、`private`、`VERSION` 等檔案/目錄。如果還要再進入一層 `weig-qb-webui` 才能看到這些內容，表示路徑多填或少填了一層。

> **Docker 使用者注意：** qBittorrent 執行在容器裡，因此這裡通常不能直接填宿主機上的真實路徑。Docker 的「宿主機 / 容器」差異與正確路徑寫法請看下面 **Docker** 折疊教學。

</details>

## 一鍵安裝

Linux / NAS 安裝腳本固定從下方 Dev Pages 取得。**腳本網址不決定安裝通道：**不加 `-dev` 會安裝 `main` 最新且經過驗證的 GitHub Release；加上 `-dev` 才會安裝目前 `dev` 的 exact-SHA 開發版。腳本會留在目前目錄，方便日後更新或回滾。

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

<details>
<summary><b>查看腳本位置與 WebUI 預設安裝目錄</b></summary>

```text
./install.sh
```

WebUI 本體預設安裝到：

```text
~/.local/share/weig-qb-webui
```

例如使用 `root` 使用者執行時，通常就是：

```text
/root/.local/share/weig-qb-webui
```

</details>

### Docker

<details>
<summary><b>Docker 一鍵安裝 / 多容器 / 路徑說明（新手建議展開）</b></summary>

#### 先理解「宿主機」和「容器」

如果你是在 VPS、Linux 伺服器、Synology、QNAP 等裝置上執行 Docker：

- **宿主機**：真正執行 Docker 的那台 Linux / NAS，也就是你 SSH 登入後看到的系統。
- **容器**：Docker 為 qBittorrent 建立的獨立執行環境。qBittorrent 可以直接看到容器內路徑，但不能任意看到宿主機路徑。

例如 Docker 建立 qBittorrent 時有這樣的目錄映射：

```text
宿主機：/root/qbittorrent/config
   ↓ 映射到
容器內：/config
```

Docker Compose 常見寫法類似：

```yaml
volumes:
  - /root/qbittorrent/config:/config
```

冒號左邊 `/root/qbittorrent/config` 是**宿主機路徑**，右邊 `/config` 是**容器內路徑**。

如果 WeiG qB WebUI 實際安裝到了：

```text
宿主機：/root/qbittorrent/config/weig-qb-webui
```

那麼 qBittorrent 的 **檔案位置：** 應填寫：

```text
/config/weig-qb-webui
```

**不要填 `/root/qbittorrent/config/weig-qb-webui`**，因為 qBittorrent 容器通常看不到這個宿主機路徑。

#### 情況 1：只有一個正在執行的 qBittorrent Docker 容器

最簡單，直接執行：

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

安裝器會嘗試自動找到正在執行的 qBittorrent 容器、辨識它的 `/config` 映射，把 WebUI 安裝到對應的宿主機位置，並自動設定 qBittorrent。

#### 情況 2：先查看機器上有哪些 qBittorrent 容器

如果不確定容器叫什麼：

```sh
sh install.sh --list-containers
```

也可以直接用 Docker 查看目前執行中的容器：

```sh
docker ps
```

例如你看到 qBittorrent 容器名稱是：

```text
qbittorrent
```

就可以明確指定：

```sh
sh install.sh --container=qbittorrent -configure
```

#### 情況 3：機器上有多個 qBittorrent 容器

例如同時有：

```text
qbittorrent
qbittorrent-test
```

先執行：

```sh
sh install.sh --list-containers
```

安裝正式使用的 `qbittorrent`：

```sh
sh install.sh --container=qbittorrent -configure
```

安裝測試容器 `qbittorrent-test`：

```sh
sh install.sh --container=qbittorrent-test -configure
```

安裝器不會在多個 qBittorrent 容器之間隨便猜一個。

#### 情況 4：你知道 qBittorrent `/config` 對應的宿主機目錄

例如 Docker 設定目錄是：

```text
/root/qbittorrent/config
```

可以直接指定：

```sh
sh install.sh --config-root=/root/qbittorrent/config -configure
```

Synology 上可能類似：

```sh
sh install.sh --config-root=/volume1/docker/qbittorrent -configure
```

其他 NAS 可能類似：

```sh
sh install.sh --config-root=/share/Container/qbittorrent -configure
```

這些只是範例，**請換成你自己的 qBittorrent `/config` 真實宿主機目錄**。

#### 情況 5：指定 WebUI 安裝目錄

已經指定容器時，也可以指定容器內希望使用的 WebUI 路徑：

```sh
sh install.sh --container=qbittorrent -o /config/weig-qb-webui -configure
```

安裝器會依照 Docker `/config` 映射換算成宿主機上的實際安裝目錄。

#### 情況 6：一次更新多個現有 WebUI 目錄

如果有多個 qBittorrent 實例，可以重複指定 `-o`。安裝器只下載並驗證一次套件，等所有目標準備好才進行切換。每個目標都會在 `~/.config/weig-qb-webui/backups/` 獨立保留最近 3 份備份。

```sh
sh install.sh -dev \
  -o /root/qbittorrent/config/weig-qb-webui \
  -o /root/qbittorrent3/config/weig-qb-webui
```

多目標模式不要加 `-configure`；各個實例仍沿用原本設定的 WebUI 路徑。參數請見 `sh install.sh -help`。

#### 安裝後應該看到什麼

安裝成功時腳本會輸出類似：

```text
Host install path: /root/qbittorrent/config/weig-qb-webui
qBittorrent Root Folder: /config/weig-qb-webui
```

意思是：

- `Host install path`：檔案實際儲存在宿主機哪裡；
- `qBittorrent Root Folder`：**你在 qBittorrent「檔案位置：」中應填寫的容器內路徑**。

如果使用 `-configure` 並成功找到 qBittorrent 設定，安裝器會自動啟用 **使用替補 WebUI** 並設定路徑；否則請依照上面的「新手安裝 → 在 qBittorrent 中啟用」手動填寫。

</details>

### Windows PowerShell

```powershell
Invoke-WebRequest https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.ps1 -OutFile .\install.ps1; powershell -ExecutionPolicy Bypass -File .\install.ps1 -configure
```

<details>
<summary><b>查看安裝目錄</b></summary>

```text
C:\Users\<你的使用者名稱>\AppData\Local\weig-qb-webui
```

</details>

## 常用參數

<details>
<summary><b>Linux 和 Windows 使用相同的參數名稱；PowerShell 不分大小寫（點擊展開）</b></summary>

Linux 與 Windows 盡量使用相同的公開參數名稱；文件統一使用小寫。PowerShell 參數名稱本身不區分大小寫。

| 用途 | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| 最新穩定版 | 預設，不需參數 | 預設，不需參數 |
| 指定正式版本 | `-version 1.2.0` | `-version 1.2.0` |
| 開發版 | `-dev` | `-dev` |
| 指定安裝目錄 | `-o /path` （Linux 可重複指定） | `-o D:\path` 或 `-output D:\path` |
| 指定 qBittorrent 設定檔 | — | `-qbconfig D:\path\qBittorrent.ini` |
| 自動設定 qBittorrent | `-configure` | `-configure` |
| 回滾上一次安裝 | `-rollback` | `-rollback` |
| 完整解除安裝（不保留安裝器備份） | `-uninstall -purge` | `-uninstall -purge` |
| 查看完整說明 | `-help` | `-help` |
| 指定 Docker 容器 | `--container=NAME` | — |
| 列出 Docker 容器 | `--list-containers` | — |
| 指定 Docker `/config` 宿主機目錄 | `--config-root=/path` | — |

</details>

<details>
<summary><b>說明：</b> <b>（點擊展開）</b></summary>

- 不加 `-dev` 使用 `main` 最新且經過驗證的 GitHub Release；加 `-dev` 才安裝目前 `dev` 的 exact-SHA 開發版。
- `-o` 是 **output**，Linux 可重複指定多個現有安裝目錄，下載與驗證套件只需一次。
- 備份放在 `~/.config/weig-qb-webui/backups/`，每個安裝目標獨立保留最近 3 份。
- `-configure` 會啟用 **使用備選 WebUI / Use alternative WebUI** 並設定 **檔案位置 / Files location**，僅能用於單一目標。
- `-rollback` 可還原所選目標最近的安裝器備份；重複 `-o` 也能一次回滾多個指定目標。
- `-uninstall -purge` 只清理該目標的 WebUI、安裝器備份和回滾狀態，不會影響其他目標；共享狀態目錄為空時也會清除。
- 若要保留備份日後使用 `-rollback`，解除安裝時請去掉 `-purge`。
- `-version 1.2.0` 可指定 GitHub Release；版本不存在會報錯，**不會自動切換到 latest 或 dev**。
- `-help` 顯示目前安裝器支援的參數。
- 多個 Docker 容器請先用 `--list-containers` 查看，再用 `--container=NAME` 指定；或使用 `--config-root=/path` 指定宿主機上的設定目錄。

### 指定版本與安裝目錄

Linux：

```sh
sh install.sh -version 1.2.0 -o /opt/weig-qb-webui -configure
```

Windows：

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -version 1.2.0 -o D:\weig-qb-webui -configure
```

### 回滾

Linux：

```sh
sh install.sh -rollback
```

Windows：

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -rollback
```

</details>

## 一鍵解除安裝

<details>
<summary><b>Linux / NAS、Docker、Windows PowerShell 一鍵完整解除安裝</b></summary>

預設建議**不保留安裝器備份**：解除安裝 WebUI、關閉目前目標的備選 WebUI、清理該目標的 installer-owned backups / rollback 狀態，並刪除目前目錄中下載的安裝腳本。

### Linux / NAS

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

自訂安裝目錄請再加上 `-o /你的/weig-qb-webui`。

### Docker

單一容器自動辨識：

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

多個容器：

```sh
sh install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./install.sh
```

使用 `--config-root` 時：

```sh
sh install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\install.ps1 -Force }
```

自訂安裝目錄請再加上 `-o D:\weig-qb-webui`。

`-purge` 只會清理目前解除安裝目標的備份，不會刪除其他安裝實例。共享狀態目錄沒有其他內容時，Linux 的 `~/.config/weig-qb-webui`（root 為 `/root/.config/weig-qb-webui`）或 Windows 的 `%APPDATA%\weig-qb-webui` 也會一併清除。

若要保留備份以便之後使用 `-rollback`，只需移除 `-purge`。

</details>

## 更多說明

Docker 多容器、NAS、自訂路徑、更新及進階部署說明請參閱：[安裝、升級與手動部署](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.zh-TW.md)。

## 授權條款

本專案使用 [GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE)。

Copyright © 2026 Wei.G / WeiG Share。
