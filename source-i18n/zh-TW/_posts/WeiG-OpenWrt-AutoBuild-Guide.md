---
title: "從零開始：用雲端編譯自己的 OpenWrt 韌體"
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - 韌體編譯
categories:
  - OpenWrt
cover: https://img.weigshare.com/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: "不用在本機安裝編譯環境，透過 Wei.G OpenWrt 線上定製器與 GitHub Actions 在雲端產生自己的 OpenWrt 韌體。"
---

想要一份真正符合自己需求的 OpenWrt 韌體，不一定要先在電腦上架好完整的編譯環境。打開 [Wei.G 線上定製](https://www.weigshare.com/wrt)，選好原始碼、機型、套件與韌體設定，提交到 GitHub Actions 後，讓雲端完成後續編譯即可。

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>

## 快速開始

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">刷機有風險。請先確認路由器型號、分割區與刷寫方式；不確定時不要刷寫。</span>

- 登入 **[GitHub](https://github.com/)**
- 開啟 **[Wei.G 線上定製](https://www.weigshare.com/wrt)**
- 新手請看下方教學👇

## 背景

- **【比較容易上手的起點】** 想自己動手編譯韌體、了解「手搓韌體」的過程，但又不想先折騰完整本機環境，這個專案就是一個較輕鬆的入口。
- **【套件與依賴】** 有些外掛或依賴必須在編譯階段直接放進韌體，安裝完成後才可以使用。
- **【設定成本】** OpenWrt 的編譯選項很多，中國大陸的網路環境也可能讓依賴下載變得更麻煩。
- **【耗時】** 一次完整編譯可能要等數小時，即使如此仍有失敗的可能，自己排查也很花時間。
- **【未來方向】** 希望之後每個人都能直接 Fork 專案，用 GitHub **Pages + Actions** 建立屬於自己的 OpenWrt 線上編譯站。
- **【目前階段】** 專案仍在測試，出現 bug 很正常；共用工作流如果被大量使用，也可能碰到 GitHub 的政策或配額限制。

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.009.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 適用

目前僅適用以下機型，其他機型尚未驗證；如果沒有救磚工具，請勿使用。

- **來源：[OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**
- 支援電腦、手機端存取

## 準備

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">刷機有風險。請先確認路由器型號、分割區與刷寫方式；不確定時不要刷寫。</span>

- 登入 **[GitHub](https://github.com/)** 帳號（沒有帳號則無法建置）
- 開啟 **[Wei.G 線上定製](https://www.weigshare.com/wrt)**
  - **[Cloudflare dev 頁](https://dev.weig-wrt.pages.dev/)**（實驗功能，可體驗最新功能，但可能有 bug）

<!-- 截圖 1：網頁首頁，展示 Source、Branch、Target 與外掛區域 -->

## 1. 選擇參數

- 選擇來源後，在搜尋框搜尋對應機型或環境，也可以載入 config。
- **Source → Branch → Target System → Subtarget → Target Profile**。
  - 例如 X86/64：**ImmortalWrt → openwrt-24.10 → x86 → 64 → Generic x86/64**

- 在 **Advanced menuconfig › LuCI › 3. Applications** 勾選你想要的應用程式。
- **Advanced menuconfig** 其他進階設定可自行探索。

然後依需求設定 **時區**、**韌體主題**、**NTP 伺服器**和**軟體來源鏡像**。

<div style="display:flex; gap:10px;">

<img src=https://img.weigshare.com/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="150">

</div>

### 已有設定

已有 `.config`、`config.buildinfo` 或以前下載的請求檔案，可點底部「載入設定」，在確認框核對來源、分支、Target Profile、外掛和韌體設定。

## 2. 提交建置

點擊右下角 **提交雲端編譯**。

選擇 **下載請求並開啟 GitHub**：瀏覽器會下載一個 JSON 檔案，並自動開啟 GitHub 的新 Issue 頁面。

將檔案移入 Issue 對話框，直接點擊 **Create**。

機器人會在 Issue 中回覆本次建置的 Actions 連結。

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 3. 下載韌體

編譯通常需要 2～4 小時。完成後進入 Actions 頁面，在底部 **Artifacts** 下載：

- `FIRMWARE-ALL-XXX`：全部韌體與校驗資料；首次刷機通常找 `factory` 等檔案。
- `CONFIG-XXX`：本次提交設定、最終設定和差異，建議保存。
- `BUILD-LOGS-XXX`：完整建置日誌，用於排查原因。

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 常見問題

- **建置失敗怎麼辦？** 下載 `BUILD-LOGS-…`，查看最後出現的 `Error`；也可在 Issue 回報。
- **如何取消？** 在自己的建置 Issue 回覆 `/cancel`。
- **同時建置數量？** 一個帳號只允許同時 2 個建置任務，超出的需要排隊。
- **為什麼沒有下載按鈕？** GitHub 的 Artifacts 通常需要先登入帳號才能下載。
- **公共倉庫排隊較久？** 未來會支援 [Fork 本專案](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)，按照頁面提示提交到自己的倉庫執行，就不會受到公共佇列限制。

專案地址：[WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)

## 鳴謝

- **原始碼：** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)

- **參考：** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)

- **LuCI 外掛的作者們**

- **每一位**參與的小夥伴
