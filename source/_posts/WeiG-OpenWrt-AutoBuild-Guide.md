---
title: 从零到一云编译自己的 OpenWrt 固件
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - 固件编译
categories:
  - OpenWrt
cover: https://img.weigeshare.cc.cd/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: 不需安装编译环境，用 WeiG OpenWrt 在线定制器让每个人体会手搓固件的乐趣。
---

想要一份适合自己的 OpenWrt 固件，不必在本地安装编译环境。打开 [WeiG OpenWrt 在线定制](https://www.weigefenxiang.cc.cd/wrt)，选择参数后提交到 GitHub Actions，等待云端编译即可。

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>



 <span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;"> 刷机有风险。请先确认路由器型号、分区与刷写方式；不确定时不要刷写。</span>


## 背景

- 想自己编译固件，体会手搓固件的乐趣。
- 某些插件一定要编译到固件里才可使用
- **配置环境** 对于大多数人来说相当复杂及繁琐，配置及网络环境无法满足。
- **未来:** 每个人都可一键 **folk** ,即可拥有自己的在线编译网站（**Page** + **Github**）
- 支持电脑、手机端

<div style="display:flex; gap:10px;">

<img src=https://img.weigeshare.cc.cd/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="200">

</div>

## 适用
当前仅适用以下机型，其它机型尚未验证，如您没有救砖工具，请勿使用，

- **源码： [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**

## 准备

- **[Github](https://github.com/)** 账号 (如果没有无法构建)
- 登录 **[WeiG OpenWrt 在线定制](https://www.weigefenxiang.cc.cd/wrt)**

<!-- 截图 1：网页首页，展示 Source、Branch、Target 与插件区域 -->

## 1. 选择参数

- **Source → Branch → Target System → Subtarget → Target Profile**。
  - 例 X86/64：  **ImmortalWrt → openwrt-24.10 → x86 → 64** → Generic x86/64

- **推荐：✔ 推荐项** 新手建议勾选“推荐项”（否则可能无法进入界面）。

- **Advanced menuconfig** → 勾选插件

然后按需；**时区**、**固件主题**、**NTP 服务器**和**软件源镜像** 一并设置。
<div style="display:flex; gap:10px;">

<img src=https://img.weigeshare.cc.cd/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="200">
<img src=https://img.weigeshare.cc.cd/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="200">
<img src=https://img.weigeshare.cc.cd/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="200">

</div>

### 已有配置
已有 `.config`、`config.buildinfo` 或以前下载的请求文件，可点底部“加载配置”，在确认框核对源码、分支、Target Profile、插件和固件设置。

## 2. 提交构建

点击右下角 **提交云编译**，

选择 **下载请求并打开 GitHub**：浏览器会下载一个 JSON 文件，并自动打开 GitHub 的新 Issue 页面。


将文件移动到 Issue 的对话框，直接点击 **Create**。

机器人会在 Issue 中回复本次构建的 Actions 链接。

<div style="display:flex; gap:10px;">
<img src=https://img.weigeshare.cc.cd/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="200">
<img src=https://img.weigeshare.cc.cd/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="200">
</div>


## 3. 下载固件

编译通常需要2~3小时。完成后进入 Actions 页面，在底部 **Artifacts** 下载：

- `FIRMWARE-ALL-…`：全部固件与校验资料；首次刷机通常找 `factory` 等文件。
- `CONFIG-…`：本次提交配置、最终配置和差异，建议留存。
- `BUILD-LOGS-…`：完整构建日志；用于排查原因。

<div style="display:flex; gap:10px;">
<img src=https://img.weigeshare.cc.cd/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigeshare.cc.cd/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 常见问题

- **构建失败怎么办？** 下载 `BUILD-LOGS-…`，查看最后出现的 `Error`；也可在 Issue 反馈。
- **如何取消？** 在自己的构建 Issue 回复 `/cancel`。
- **同时构建数量** 一个账号只允许同时2个构建任务，否则得排队。
- **为什么没有下载按钮？** GitHub 的 Artifacts 下载通常需要先登录账号。
- **公共仓库排队较久？** 未来做到 [Fork 本项目](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)，按页面提示提交到自己的仓库运行。就不会受到排队限制。

项目地址：[WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)。

## 鸣谢

- **源码：** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x) 

- **参考：** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)


- **LuCI 插件的全部作者**

- **每一位**参与的小伙伴
