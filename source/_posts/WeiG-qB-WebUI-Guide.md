---
title: "WeiG qB WebUI: A Beginner’s Guide to qBittorrent’s Alternative WebUI"
date: 2026-09-28 17:15:00
tags:
  - qBittorrent
  - WebUI
  - NAS
  - Docker
categories:
  - qBittorrent
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif
description: "A beginner-friendly guide to installing WeiG qB WebUI and enabling qBittorrent’s alternative WebUI on Windows, Linux, NAS, and Docker."
---

If you usually manage qBittorrent from a browser—especially on a **NAS, in Docker, or from a phone**—WeiG qB WebUI provides a more comfortable interface for day-to-day use. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Live Preview</a></strong>

About seven years ago, I joined a few private torrent trackers. At the time, I installed qBittorrent 4.1.9 on my NAS—it was the latest release. I never imagined I'd still be using it today.

I once tried a major upgrade (to 4.2.5, if I remember correctly), but all the torrent tasks disappeared from the client and I couldn't keep seeding. I'd accumulated so many torrents that putting everything back was a nightmare. Since then, I've preferred to leave a stable setup alone.

After graduating and starting work, I spend less and less time at a desktop. These days I mostly manage my NAS from my phone. The stock WebUI isn't particularly pleasant on a small screen, and many of the alternative WebUIs I tried didn't work well with older qBittorrent releases.

That's why I built WeiG qB WebUI. It covers a range of stable releases from qBittorrent 4.1.x through 5.2.x. If you run into a compatibility issue or have a suggestion, I'd love to hear about it.

**WeiG qB WebUI** is an **alternative WebUI for qBittorrent** designed for desktop and mobile use:

- 📱 Responsive on phones
- 🌙 Dark mode
- 🧱 Works with older qBittorrent releases
- ✅ Supports **qBittorrent 4.1.x → 5.2.x**
- 🐳 Works on Windows, Linux, Docker, and NAS

[Project](https://github.com/weigefenxiang/WeiG-qB-WebUI)

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Shell-8A2BE2?logo=gnubash&logoColor=white" alt="Shell">
</div>

## Interface Preview

### Desktop

<p align="center">
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif" alt="WeiG qB WebUI desktop interface" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>


### Mobile

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
    <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview.gif" alt="WeiG qB WebUI mobile walkthrough">
    <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview.png" alt="WeiG qB WebUI mobile interface previews">
  </div>
</div>

## New User Installation

<details>
<summary><b>First time installing? Expand this 1-minute guide</b></summary>

### 1. Extract the ZIP

Download the latest stable release [**weig-qb-webui.zip**](https://github.com/weigefenxiang/WeiG-qB-WebUI/releases/latest/download/weig-qb-webui.zip) and extract it. The folder is already named correctly:

```text
weig-qb-webui/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

The entire **`weig-qb-webui` folder** is the WebUI root. Do not copy only `public` or `private`.

### 2. Move it to a permanent location

Put the whole `weig-qb-webui` folder somewhere you will not accidentally delete later, for example:

```text
Windows: D:\weig-qb-webui
Linux:   /opt/weig-qb-webui
```

This is the directory you will enter in qBittorrent.

### 3. Enable it in qBittorrent

Open qBittorrent:

**Tools → Options... → WebUI**

These are the current qBittorrent English UI terms. Then:

1. Enable **Use alternative WebUI**.
2. Find **Files location:**.
3. Enter the path to the `weig-qb-webui` folder.

Windows example:

```text
D:\weig-qb-webui
```

Regular Linux example:

```text
/opt/weig-qb-webui
```

4. Click **OK** to save.
5. Refresh the qBittorrent WebUI page. If the old page is still cached, try `Ctrl + F5` once.

> **How do I know the path is correct?** The directory you enter should directly contain `public`, `private`, `VERSION`, and the other WebUI files. If you need to enter another `weig-qb-webui` folder before seeing those files, your path is one level too high or too low.

> **Docker users:** qBittorrent runs inside a container, so you usually cannot enter the host path directly. See the **Docker** guide below for the difference between host and container paths.

</details>

## One-click Install

The Linux / NAS installer comes from the fixed Dev Pages URL below. **The download URL does not choose the release channel:** without `-dev` it installs the verified stable GitHub Release from `main`; with `-dev` it installs the current `dev` build pinned to an exact Git SHA. Keep the script in the current directory for future updates or rollbacks.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

<details>
<summary><b>Show script location and default WebUI install directory</b></summary>

```text
./install.sh
```

The WebUI itself is installed by default to:

```text
~/.local/share/weig-qb-webui
```

For example, when running as `root`, this is usually:

```text
/root/.local/share/weig-qb-webui
```

</details>

### Docker

<details>
<summary><b>Docker one-click install / multiple containers / path guide (recommended for beginners)</b></summary>

#### First understand “host” and “container”

If qBittorrent is running in Docker on a VPS, Linux server, Synology, QNAP, or another NAS:

- **Host**: the real Linux/NAS machine that runs Docker — the system you see after SSH login.
- **Container**: the isolated environment Docker creates for qBittorrent. qBittorrent can directly see container paths, not arbitrary host paths.

For example, your qBittorrent container may have this mapping:

```text
Host:      /root/qbittorrent/config
   ↓ mapped to
Container: /config
```

A typical Docker Compose entry looks like:

```yaml
volumes:
  - /root/qbittorrent/config:/config
```

The left side of the colon, `/root/qbittorrent/config`, is the **host path**. The right side, `/config`, is the **container path**.

If WeiG qB WebUI is physically installed at:

```text
Host: /root/qbittorrent/config/weig-qb-webui
```

then qBittorrent **Files location:** should be:

```text
/config/weig-qb-webui
```

**Do not enter `/root/qbittorrent/config/weig-qb-webui` in qBittorrent**, because the container usually cannot see that host path directly.

#### Case 1: only one running qBittorrent container

Use the normal one-click command:

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

The installer will try to detect the running qBittorrent container, detect its `/config` mapping, install the WebUI in the corresponding host location, and configure qBittorrent automatically.

#### Case 2: find the qBittorrent container name first

If you are not sure what the container is called:

```sh
sh install.sh --list-containers
```

You can also use Docker directly:

```sh
docker ps
```

If the qBittorrent container is named:

```text
qbittorrent
```

select it explicitly:

```sh
sh install.sh --container=qbittorrent -configure
```

#### Case 3: multiple qBittorrent containers

For example:

```text
qbittorrent
qbittorrent-test
```

List them first:

```sh
sh install.sh --list-containers
```

Install for the main `qbittorrent` container:

```sh
sh install.sh --container=qbittorrent -configure
```

Install for the test container:

```sh
sh install.sh --container=qbittorrent-test -configure
```

The installer will not silently guess between multiple qBittorrent containers.

#### Case 4: you already know the host directory mounted as `/config`

For example:

```text
/root/qbittorrent/config
```

Specify it directly:

```sh
sh install.sh --config-root=/root/qbittorrent/config -configure
```

A Synology path might look like:

```sh
sh install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Another NAS might use something like:

```sh
sh install.sh --config-root=/share/Container/qbittorrent -configure
```

These are examples only. **Replace them with the real host path that is mounted as qBittorrent `/config`.**

#### Case 5: choose the WebUI install path

After selecting a container, you can also choose the container-visible WebUI location:

```sh
sh install.sh --container=qbittorrent -o /config/weig-qb-webui -configure
```

The installer converts the `/config/...` container path to the corresponding host install path.

#### Case 6: update multiple existing WebUI directories with one download

For multiple qBittorrent instances, repeat `-o`. The payload is downloaded and verified once, all targets are prepared before switching, and each target keeps its own latest three backups under `~/.config/weig-qb-webui/backups/`.

```sh
sh install.sh -dev \
  -o /root/qbittorrent/config/weig-qb-webui \
  -o /root/qbittorrent3/config/weig-qb-webui
```

Do not add `-configure` in multi-target mode; each qBittorrent instance keeps its existing Alternative WebUI Root Folder. To see the current command syntax, run `sh install.sh -help`.

#### What should I see after installation?

A successful install prints values similar to:

```text
Host install path: /root/qbittorrent/config/weig-qb-webui
qBittorrent Root Folder: /config/weig-qb-webui
```

Meaning:

- `Host install path`: where the files are physically stored on the host;
- `qBittorrent Root Folder`: **the container path qBittorrent should use for Files location**.

If `-configure` successfully finds the qBittorrent configuration, the installer enables **Use alternative WebUI** and sets the path automatically. Otherwise, follow the manual steps in **New User Installation → Enable it in qBittorrent** above.

</details>

### Windows PowerShell

```powershell
Invoke-WebRequest https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.ps1 -OutFile .\install.ps1; powershell -ExecutionPolicy Bypass -File .\install.ps1 -configure
```

<details>
<summary><b>Show install directory</b></summary>

```text
C:\Users\<your-username>\AppData\Local\weig-qb-webui
```

</details>

## Common Options

<details>
<summary><b>Linux and Windows use the same option names; PowerShell option names are case-insensitive (click to expand)</b></summary>

Linux and Windows use the same public option names where practical. Documentation uses lowercase; PowerShell parameter names are case-insensitive.

| Purpose | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Stable main | Default, no option | Default, no option |
| Specific Release | `-version 1.2.0` | `-version 1.2.0` |
| Development build | `-dev` | `-dev` |
| Custom install directory | `-o /path` (repeatable on Linux) | `-o D:\path` or `-output D:\path` |
| Custom qBittorrent configuration file | — | `-qbconfig D:\path\qBittorrent.ini` |
| Configure qBittorrent automatically | `-configure` | `-configure` |
| Roll back the previous install | `-rollback` | `-rollback` |
| Complete uninstall (do not keep installer backups) | `-uninstall -purge` | `-uninstall -purge` |
| Full help | `-help` | `-help` |
| Select Docker container | `--container=NAME` | — |
| List Docker containers | `--list-containers` | — |
| Specify host directory mounted as Docker `/config` | `--config-root=/path` | — |

</details>

<details>
<summary><b>Notes: (click to expand)</b></summary>

- Without `-dev`, the installer uses the verified stable GitHub Release from `main`. Adding `-dev` selects the current `dev` build by exact Git SHA.
- `-o` means **output**; repeat it on Linux to update several existing WebUI directories in one verified download.
- Backups live in `~/.config/weig-qb-webui/backups/`, with the latest three kept independently for each install target.
- `-configure` enables **Use alternative WebUI** and sets **Files location** in qBittorrent. It can only be used with a single target.
- `-rollback` restores the selected target's latest installer-owned backup; repeat `-o` to roll back multiple explicit targets.
- `-uninstall -purge` removes the WebUI and that target's installer-owned backups and rollback state, without touching other targets. Empty shared state folders are cleaned up.
- Leave off `-purge` if you want to keep backups for a later `-rollback`.
- `-version 1.2.0` selects an exact GitHub Release. A missing release is an error; there is **no silent fallback** to latest or dev.
- `-help` lists the currently supported parameters.
- For multiple Docker containers, use `--list-containers` and `--container=NAME`, or select the host's qBittorrent config folder with `--config-root=/path`.

### Specific version and install directory

Linux:

```sh
sh install.sh -version 1.2.0 -o /opt/weig-qb-webui -configure
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -version 1.2.0 -o D:\weig-qb-webui -configure
```

### Rollback

Linux:

```sh
sh install.sh -rollback
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -rollback
```

</details>

## One-click Uninstall

<details>
<summary><b>Linux / NAS, Docker, and Windows PowerShell complete uninstall</b></summary>

The recommended command below performs a complete uninstall **without keeping installer backups**: it removes the WebUI, disables the matching alternative WebUI configuration, purges installer-owned backups / rollback state for this target, and then deletes the downloaded installer script from the current directory.

### Linux / NAS

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

For a custom install directory, add `-o /path/to/weig-qb-webui`.

### Docker

Single container / automatic detection:

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Multiple containers:

```sh
sh install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./install.sh
```

When using `--config-root`:

```sh
sh install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\install.ps1 -Force }
```

For a custom install directory, add `-o D:\weig-qb-webui`.

`-purge` only removes backups owned by the current uninstall target; it does not touch backups for other installations. When the shared state directory becomes empty, Linux `~/.config/weig-qb-webui` (for root: `/root/.config/weig-qb-webui`) or Windows `%APPDATA%\weig-qb-webui` is removed as well.

To keep installer backups for a later `-rollback`, simply omit `-purge`.

</details>

## More Help

For Docker multi-container setups, NAS deployment, custom paths, updates, and advanced installation details, see the detailed [Installation, Upgrade & Manual Deployment Guide](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.en.md).

## License

Licensed under the [GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
