---
title: "WeiG qB WebUI: руководство для начинающих по альтернативному веб-интерфейсу qBittorrent"
date: 2026-09-28 17:15:00
tags:
  - qBittorrent
  - WebUI
  - NAS
  - Docker
categories:
  - qBittorrent
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview-v1.1.0.gif
description: "Руководство для начинающих по установке WeiG qB WebUI и включению его как альтернативного веб-интерфейса qBittorrent в Windows, Linux, NAS и Docker."
---

Если вы обычно управляете qBittorrent через браузер — особенно на **NAS, в Docker или с телефона** — WeiG qB WebUI делает повседневную работу заметно удобнее. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Онлайн-просмотр</a></strong>

Для приватных трекеров стабильность часто важнее постоянных обновлений. qBittorrent на NAS может годами спокойно раздавать торренты на одной и той же версии, а обновление только ради интерфейса добавляет лишнюю работу и риск при переносе данных. При этом штатный WebUI не слишком удобен на телефоне, а яркая тема особенно неприятна ночью. WeiG qB WebUI создавался именно под такие сценарии: удобство на мобильных устройствах, тёмный режим и широкая совместимость со старыми версиями qBittorrent. Сейчас поддерживаются стабильные версии **4.1.0–5.2.x**. Если какая-то версия работает неправильно, напишите об этом в комментариях.

**WeiG qB WebUI** — это **альтернативный веб-интерфейс** qBittorrent для настольных и мобильных устройств:

- 📱 Адаптивный интерфейс для телефонов
- 🌙 Тёмный режим
- 🧱 Совместимость со старыми версиями qBittorrent
- ✅ Поддержка **qBittorrent 4.1.0 → 5.2.x**
- 🐳 Windows, Linux, Docker и NAS

[Проект](https://github.com/weigefenxiang/WeiG-qB-WebUI)

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Shell-8A2BE2?logo=gnubash&logoColor=white" alt="Shell">
</div>

## Предпросмотр интерфейса

### Настольная версия

<p align="center">
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview-v1.1.0.gif" alt="Настольный интерфейс WeiG qB WebUI" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>

### Мобильная версия

#### Динамическая демонстрация

<p align="center">
  <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview-v1.1.0.gif" alt="Анимация мобильного интерфейса WeiG qB WebUI" style="display:block;width:20%;height:auto;margin:0 auto;">
</p>

#### Снимок интерфейса

<p align="center">
  <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview-v1.1.0.png" alt="Мобильный интерфейс WeiG qB WebUI" style="display:block;width:auto;max-width:100%;height:auto;margin:0 auto;">
</p>
## Установка для начинающих

<details>
<summary><b>Устанавливаете впервые? Откройте минутную инструкцию</b></summary>

### 1. Распакуйте ZIP

Скачайте `WeiG-qB-WebUI.zip`, распакуйте архив и переименуйте полученную папку `WeiG-qB-WebUI` в `WeiG_qB-WebUI`. Итоговая структура должна выглядеть так:

```text
WeiG_qB-WebUI/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

Вся папка **`WeiG_qB-WebUI`** является корнем WebUI. Не копируйте только `public` или `private`.

### 2. Переместите в постоянное место

Например:

```text
Windows: D:\WeiG_qB-WebUI
Linux:   /opt/WeiG_qB-WebUI
```

Этот путь затем нужно указать в qBittorrent.

### 3. Включите в qBittorrent

Откройте qBittorrent:

**Сервис → Настройки… → WebUI**

Это текущие термины официального русского перевода qBittorrent. Затем:

1. Включите **Использовать альтернативный веб-интерфейс**.
2. Найдите **Расположение файлов:**.
3. Укажите путь к папке `WeiG_qB-WebUI`.

Пример Windows:

```text
D:\WeiG_qB-WebUI
```

Пример Linux:

```text
/opt/WeiG_qB-WebUI
```

4. Нажмите **OK** для сохранения.
5. Обновите страницу WebUI. Если осталась старая версия из кэша, попробуйте `Ctrl + F5`.

> **Проверка пути:** в указанном каталоге должны сразу быть видны `public`, `private`, `VERSION` и другие файлы.

> **Docker:** qBittorrent работает внутри контейнера, поэтому обычно нужно указывать путь, видимый из контейнера, а не реальный путь хоста.

</details>

## Установка одной командой

Однокликовый установщик для Linux/NAS всегда загружается по фиксированному адресу Dev Pages ниже. **Адрес скрипта не определяет канал установки:** без `-dev` устанавливается последняя стабильная версия; с `-dev` — последняя версия разработки из текущей ветки `dev`. Скрипт установки сохраняется в текущем каталоге для последующих обновлений или отката.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o weig_qb-webui_install.sh && sh weig_qb-webui_install.sh -configure
```

<details>
<summary><b>Показать путь скрипта и каталог установки по умолчанию</b></summary>

```text
./weig_qb-webui_install.sh
```

Каталог WebUI по умолчанию:

```text
~/.local/share/weig_qb-webui
```

При запуске от `root` обычно:

```text
/root/.local/share/weig_qb-webui
```

</details>

### Docker

<details>
<summary><b>Docker / несколько контейнеров / объяснение путей</b></summary>

#### Хост и контейнер

- **Хост**: Linux/NAS, на котором запущен Docker.
- **Контейнер**: изолированная среда, где работает qBittorrent.

Пример:

```text
Хост:       /root/qbittorrent/config
   ↓ смонтировано как
Контейнер:  /config
```

Docker Compose:

```yaml
volumes:
  - /root/qbittorrent/config:/config
```

Если WebUI на хосте находится здесь:

```text
/root/qbittorrent/config/weig_qb-webui
```

то в **Расположение файлов:** qBittorrent нужно указать:

```text
/config/weig_qb-webui
```

#### Один контейнер qBittorrent

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o weig_qb-webui_install.sh && sh weig_qb-webui_install.sh -configure
```

Установщик попытается автоматически определить контейнер и монтирование `/config`.

#### Показать контейнеры

```sh
sh weig_qb-webui_install.sh --list-containers
```

Или:

```sh
docker ps
```

Явно выбрать контейнер:

```sh
sh weig_qb-webui_install.sh --container=qbittorrent -configure
```

Если найдено несколько контейнеров qBittorrent, установщик не выбирает один случайно.

#### Указать путь хоста, смонтированный как `/config`

```sh
sh weig_qb-webui_install.sh --config-root=/root/qbittorrent/config -configure
```

Synology:

```sh
sh weig_qb-webui_install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Другой NAS:

```sh
sh weig_qb-webui_install.sh --config-root=/share/Container/qbittorrent -configure
```

#### Указать путь WebUI

```sh
sh weig_qb-webui_install.sh --container=qbittorrent -o /config/weig_qb-webui -configure
```

</details>

### Windows PowerShell

```powershell
Invoke-WebRequest https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.ps1 -OutFile .\weig_qb-webui_install.ps1; powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -configure
```

<details>
<summary><b>Показать каталог установки</b></summary>

```text
C:\Users\<имя-пользователя>\AppData\Local\WeiG_qB-WebUI
```

</details>

## Основные параметры
Имена параметров PowerShell не зависят от регистра.

| Назначение | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Последний стабильный Release | По умолчанию | По умолчанию |
| Конкретный Release | `-version 1.0.0` | `-version 1.0.0` |
| Версия разработки | `-dev` | `-dev` |
| Каталог установки | `-o /path` или `-o /path` | `-o D:\path` или `-output D:\path` |
| Автоматически настроить qBittorrent | `-configure` | `-configure` |
| Откатить предыдущую установку | `-rollback` | `-rollback` |
| Полное удаление (не сохранять резервные копии установщика) | `-uninstall -purge` | `-uninstall -purge` |
| Справка | `-help` | `-help` |
| Выбрать Docker-контейнер | `--container=NAME` | — |
| Показать Docker-контейнеры | `--list-containers` | — |
| Путь хоста, смонтированный как `/config` | `--config-root=/path` | — |

<details>
<summary><b>Примечания: (нажмите, чтобы раскрыть)</b></summary>

- Несуществующая версия не переключается автоматически на latest или dev.
- Без `-dev`: установить последнюю стабильную версию; с `-dev`: установить последнюю версию разработки из текущей ветки `dev`.

### Конкретная версия и каталог установки

Linux:

```sh
sh weig_qb-webui_install.sh -version 1.0.0 -o /opt/weig_qb-webui -configure
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -version 1.0.0 -o D:\WeiG_qB-WebUI -configure
```

### Откат

Откат:

```sh
sh weig_qb-webui_install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -rollback
```

</details>

## Удаление одной командой

<details>
<summary><b>Полное удаление для Linux / NAS, Docker и Windows PowerShell</b></summary>

По умолчанию рекомендуется **полное удаление без сохранения резервных копий установщика**: удалить WebUI, отключить соответствующий альтернативный WebUI, очистить принадлежащие этой цели резервные копии / состояние rollback, а затем удалить загруженный скрипт установки из текущего каталога.

### Linux / NAS

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge && rm -f -- ./weig_qb-webui_install.sh
```

Для собственного пути установки добавьте `-o /path/to/weig_qb-webui`.

### Docker

Один контейнер / автоопределение:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge && rm -f -- ./weig_qb-webui_install.sh
```

Несколько контейнеров:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./weig_qb-webui_install.sh
```

При использовании `--config-root`:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./weig_qb-webui_install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\weig_qb-webui_install.ps1 -Force }
```

Для собственного пути установки добавьте `-o D:\WeiG_qB-WebUI`.

`-purge` удаляет только резервные копии текущей цели и не затрагивает другие установки. Если общий каталог состояния становится пустым, также удаляется `~/.config/weig_qb-webui` в Linux (для root: `/root/.config/weig_qb-webui`) или `%APPDATA%\WeiG_qB-WebUI` в Windows.

Чтобы сохранить резервные копии для последующего `-rollback`, просто уберите `-purge`.

</details>

## Дополнительная помощь

Docker, NAS, пользовательские пути, обновление и ручное развёртывание: [Установка, обновление и ручное развёртывание](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.ru.md).

## Лицензия

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
