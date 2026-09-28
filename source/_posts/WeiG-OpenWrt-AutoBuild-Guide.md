---
title: "Build Your Own OpenWrt Firmware in the Cloud: A Beginner’s Guide"
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - Firmware Build
categories:
  - OpenWrt
cover: https://img.weigshare.com/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: "Build a customized OpenWrt firmware image with the Wei.G online customizer and GitHub Actions—no local build environment required."
---

Need an OpenWrt image tailored to your router but do not want to maintain a local build environment? Open the [Wei.G Online Customizer](https://www.weigshare.com/wrt), choose the source, target, packages, and firmware options you need, then send the request to GitHub Actions and let the cloud do the build.

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>

## Quick Start

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Flashing firmware carries risk. Confirm your router model, partition layout, and flashing method first. If you are unsure, do not flash.</span>

- Sign in to **[GitHub](https://github.com/)**
- Open the **[Wei.G Online Customizer](https://www.weigshare.com/wrt)**
- If you are new, follow the tutorial below 👇

## Background

- **[A simpler starting point]** If you want to learn what goes into a custom firmware image without first setting up a full local toolchain, this project gives you an easier place to begin.
- **[Packages and dependencies]** Some plugins and dependencies must be compiled into the firmware before they can be used.
- **[Configuration]** OpenWrt build configuration can be time-consuming, and network conditions in mainland China can make dependency downloads especially painful.
- **[Build time]** A full build can take several hours and can still fail, so troubleshooting locally is costly.
- **[Where this is going]** The long-term goal is to let anyone fork the project and run their own OpenWrt build site with GitHub **Pages + Actions**.
- **[Current stage]** The project is still being tested. Bugs are expected, and heavy use of the shared public workflow may run into GitHub policy or quota limits.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.009.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Supported Devices

The following targets are currently supported. Other devices have not yet been verified. If you do not have a recovery method, do not use this tool.

- **Sources: [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**
- Accessible from both desktop and mobile devices

## Preparation

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Flashing firmware carries risk. Confirm your router model, partition layout, and flashing method first. If you are unsure, do not flash.</span>

- Sign in to a **[GitHub](https://github.com/)** account. Without an account, you cannot start a build.
- Open the **[Wei.G Online Customizer](https://www.weigshare.com/wrt)**.
  - **[Cloudflare dev page](https://dev.weig-wrt.pages.dev/)** (experimental features; newest functions, but may contain bugs)

<!-- Screenshot 1: website home page showing Source, Branch, Target and plugin areas -->

## 1. Choose Parameters

- After choosing a source, search for the corresponding device model or environment. You can also load a config file.
- Select **Source → Branch → Target System → Subtarget → Target Profile**.
  - Example for x86/64: **ImmortalWrt → openwrt-24.10 → x86 → 64 → Generic x86/64**

- Under **Advanced menuconfig › LuCI › 3. Applications**, select the applications you want.
- Explore other advanced settings under **Advanced menuconfig** as needed.

Then configure the **time zone**, **firmware theme**, **NTP servers**, and **package mirror** as required.

<div style="display:flex; gap:10px;">

<img src=https://img.weigshare.com/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="150">

</div>

### Existing Configuration

If you already have a `.config`, `config.buildinfo`, or a previously downloaded request file, click **Load Configuration** at the bottom. In the confirmation dialog, verify the source, branch, Target Profile, plugins, and firmware settings.

## 2. Submit a Build

Click **Submit Cloud Build** in the lower-right corner.

Choose **Download Request and Open GitHub**. The browser downloads a JSON file and automatically opens a new GitHub Issue page.

Move the downloaded file into the Issue dialog and click **Create**.

The bot replies in the Issue with the Actions link for the build.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 3. Download the Firmware

A build usually takes 2–4 hours. When it is complete, open the Actions page and download the artifacts at the bottom:

- `FIRMWARE-ALL-XXX`: all firmware files and checksums. For a first flash, you will usually look for files such as `factory`.
- `CONFIG-XXX`: the submitted configuration, final configuration, and differences. Keeping this is recommended.
- `BUILD-LOGS-XXX`: complete build logs for troubleshooting.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## FAQ

- **What if the build fails?** Download `BUILD-LOGS-…` and check the last `Error`. You can also report the problem in the Issue.
- **How do I cancel?** Reply with `/cancel` in your build Issue.
- **How many builds can run at once?** One account can run only two build jobs at the same time; additional jobs must wait.
- **Why is there no download button?** GitHub usually requires you to sign in before downloading Actions artifacts.
- **Long queue in the public repository?** A future workflow will let you [fork this project](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild) and submit builds to your own repository by following the page instructions, avoiding the shared queue.

Project: [WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)

## Acknowledgements

- **Sources:** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)

- **Reference:** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)

- **LuCI plugin authors**

- **Everyone** who has participated in the project
