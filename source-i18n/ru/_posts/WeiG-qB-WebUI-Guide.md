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
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif
description: "Руководство для начинающих по установке WeiG qB WebUI и включению его как альтернативного веб-интерфейса qBittorrent в Windows, Linux, NAS и Docker."
---

Если вы обычно управляете qBittorrent через браузер — особенно на **NAS, в Docker или с телефона** — WeiG qB WebUI делает повседневную работу заметно удобнее. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Онлайн-просмотр</a></strong>

Около семи лет назад я зарегистрировался на нескольких приватных торрент-трекерах. Тогда я установил на NAS qBittorrent 4.1.9 — на тот момент это была последняя версия. Кто бы мог подумать, что я до сих пор буду ею пользоваться!

Однажды я попробовал обновиться через несколько крупных версий (кажется, до 4.2.5). После этого задания с торрентами исчезли из клиента, и продолжать раздачу стало невозможно. За годы их накопилось очень много, поэтому восстановление оказалось настоящей головной болью. С тех пор предпочитаю не трогать версию, которая работает стабильно.

После учёбы и начала работы я стал реже пользоваться компьютером. Теперь NAS почти всегда управляю с телефона, но штатный WebUI qBittorrent для маленького экрана неудобен. Я пробовал другие альтернативные интерфейсы, однако со старыми версиями многие из них работали плохо.

Так и появился WeiG qB WebUI. Сейчас он охватывает ряд стабильных версий qBittorrent от 4.1.x до 5.2.x. Если обнаружите проблему совместимости или захотите предложить улучшение, пишите в комментариях.

**WeiG qB WebUI** — это **альтернативный веб-интерфейс** qBittorrent для настольных и мобильных устройств:

- 📱 Адаптивный интерфейс для телефонов
- 🌙 Тёмный режим
- 🧱 Совместимость со старыми версиями qBittorrent
- ✅ Поддержка **qBittorrent 4.1.x → 5.2.x**
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
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif" alt="Настольный интерфейс WeiG qB WebUI" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>


### Мобильная версия

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
    <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview.gif" alt="Демонстрация WeiG qB WebUI на телефоне">
    <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview.png" alt="Скриншоты мобильного WeiG qB WebUI">
  </div>
</div>

## Установка для начинающих

<details>
<summary><b>Устанавливаете впервые? Откройте минутную инструкцию</b></summary>

### 1. Распакуйте ZIP

Скачайте последнюю стабильную версию [**weig-qb-webui.zip**](https://github.com/weigefenxiang/WeiG-qB-WebUI/releases/latest/download/weig-qb-webui.zip) и распакуйте архив. Папка уже имеет нужное имя:

```text
weig-qb-webui/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

Вся папка **`weig-qb-webui`** является корнем WebUI. Не копируйте только `public` или `private`.

### 2. Переместите в постоянное место

Например:

```text
Windows: D:\weig-qb-webui
Linux:   /opt/weig-qb-webui
```

Этот путь затем нужно указать в qBittorrent.

### 3. Включите в qBittorrent

Откройте qBittorrent:

**Сервис → Настройки… → WebUI**

Это текущие термины официального русского перевода qBittorrent. Затем:

1. Включите **Использовать альтернативный веб-интерфейс**.
2. Найдите **Расположение файлов:**.
3. Укажите путь к папке `weig-qb-webui`.

Пример Windows:

```text
D:\weig-qb-webui
```

Пример Linux:

```text
/opt/weig-qb-webui
```

4. Нажмите **OK** для сохранения.
5. Обновите страницу WebUI. Если осталась старая версия из кэша, попробуйте `Ctrl + F5`.

> **Проверка пути:** в указанном каталоге должны сразу быть видны `public`, `private`, `VERSION` и другие файлы.

> **Docker:** qBittorrent работает внутри контейнера, поэтому обычно нужно указывать путь, видимый из контейнера, а не реальный путь хоста.

</details>

## Установка одной командой

Скрипт для Linux / NAS всегда загружается по постоянной ссылке Dev Pages ниже. **Сама ссылка не определяет канал установки:** без `-dev` устанавливается проверенный стабильный GitHub Release из `main`, а с `-dev` — текущая сборка `dev` с точной привязкой к Git SHA. Скрипт остаётся в текущем каталоге для обновления или отката.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

<details>
<summary><b>Показать путь скрипта и каталог установки по умолчанию</b></summary>

```text
./install.sh
```

Каталог WebUI по умолчанию:

```text
~/.local/share/weig-qb-webui
```

При запуске от `root` обычно:

```text
/root/.local/share/weig-qb-webui
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
/root/qbittorrent/config/weig-qb-webui
```

то в **Расположение файлов:** qBittorrent нужно указать:

```text
/config/weig-qb-webui
```

#### Один контейнер qBittorrent

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

Установщик попытается автоматически определить контейнер и монтирование `/config`.

#### Показать контейнеры

```sh
sh install.sh --list-containers
```

Или:

```sh
docker ps
```

Явно выбрать контейнер:

```sh
sh install.sh --container=qbittorrent -configure
```

Если найдено несколько контейнеров qBittorrent, установщик не выбирает один случайно.

#### Случай 3: несколько контейнеров qBittorrent

Если запущены `qbittorrent` и `qbittorrent-test`, сначала выведите список, а затем явно укажите нужный контейнер. Установщик не выбирает наугад:

```sh
sh install.sh --list-containers
sh install.sh --container=qbittorrent -configure
sh install.sh --container=qbittorrent-test -configure
```

#### Указать путь хоста, смонтированный как `/config`

```sh
sh install.sh --config-root=/root/qbittorrent/config -configure
```

Synology:

```sh
sh install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Другой NAS:

```sh
sh install.sh --config-root=/share/Container/qbittorrent -configure
```

#### Указать путь WebUI

```sh
sh install.sh --container=qbittorrent -o /config/weig-qb-webui -configure
```

#### Случай 6: обновление нескольких существующих папок WebUI

Для нескольких экземпляров qBittorrent можно повторить параметр `-o`. Пакет скачивается и проверяется один раз; переключение начинается после подготовки всех целей. В `~/.config/weig-qb-webui/backups/` для каждой цели отдельно остаются три последние резервные копии.

```sh
sh install.sh -dev \
  -o /root/qbittorrent/config/weig-qb-webui \
  -o /root/qbittorrent3/config/weig-qb-webui
```

Не используйте `-configure` с несколькими целями: каждый экземпляр qBittorrent сохранит свой текущий путь WebUI. Список параметров доступен через `sh install.sh -help`.

#### Проверка путей после установки

После установки скрипт выводит примерно такие пути. Первый — фактическая папка на хосте, второй — путь внутри контейнера, который нужно указать в **Files location** qBittorrent.

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
<summary><b>Показать каталог установки</b></summary>

```text
C:\Users\<имя-пользователя>\AppData\Local\weig-qb-webui
```

</details>

## Основные параметры

<details>
<summary><b>В Linux и Windows одинаковые параметры; в PowerShell регистр букв не важен (раскрыть)</b></summary>

Имена параметров PowerShell не зависят от регистра.

| Назначение | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Последний стабильный Release | По умолчанию | По умолчанию |
| Конкретный Release | `-version 1.2.0` | `-version 1.2.0` |
| Версия разработки | `-dev` | `-dev` |
| Каталог установки | `-o /path` (в Linux можно повторять) | `-o D:\path` или `-output D:\path` |
| Собственный файл конфигурации qBittorrent | — | `-qbconfig D:\path\qBittorrent.ini` |
| Автоматически настроить qBittorrent | `-configure` | `-configure` |
| Откатить предыдущую установку | `-rollback` | `-rollback` |
| Полное удаление (не сохранять резервные копии установщика) | `-uninstall -purge` | `-uninstall -purge` |
| Справка | `-help` | `-help` |
| Выбрать Docker-контейнер | `--container=NAME` | — |
| Показать Docker-контейнеры | `--list-containers` | — |
| Путь хоста, смонтированный как `/config` | `--config-root=/path` | — |

</details>

<details>
<summary><b>Примечания: (нажмите, чтобы раскрыть)</b></summary>

- Без `-dev` устанавливается проверенный стабильный GitHub Release из `main`. С `-dev` используется текущая сборка `dev`, закреплённая за конкретным Git SHA.
- `-o` означает **output**. В Linux параметр можно повторять, чтобы обновить несколько WebUI за одну проверенную загрузку.
- Резервные копии находятся в `~/.config/weig-qb-webui/backups/`; для каждой цели отдельно сохраняются последние три.
- `-configure` включает в qBittorrent **Use alternative WebUI** и указывает **Files location**. Параметр работает только с одной целью.
- `-rollback` восстанавливает последнюю копию для выбранной цели; для отката нескольких целей повторите `-o`.
- `-uninstall -purge` удаляет WebUI и резервные копии / состояние отката выбранной цели, сохраняя копии других установок. Общий каталог удаляется, только когда пуст.
- Чтобы сохранить копии для будущего `-rollback`, не добавляйте `-purge` при удалении.
- `-version 1.2.0` задаёт конкретный GitHub Release. Если версии нет, будет ошибка: **автоматического перехода на latest или dev не происходит**.
- `-help` выводит поддерживаемые параметры.
- Если контейнеров Docker несколько, используйте `--list-containers` и `--container=NAME`, либо укажите `--config-root=/path`.

### Конкретная версия и каталог установки

Linux:

```sh
sh install.sh -version 1.2.0 -o /opt/weig-qb-webui -configure
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -version 1.2.0 -o D:\weig-qb-webui -configure
```

### Откат

Откат:

```sh
sh install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -rollback
```

</details>

## Удаление одной командой

<details>
<summary><b>Полное удаление для Linux / NAS, Docker и Windows PowerShell</b></summary>

По умолчанию рекомендуется **полное удаление без сохранения резервных копий установщика**: удалить WebUI, отключить соответствующий альтернативный WebUI, очистить принадлежащие этой цели резервные копии / состояние rollback, а затем удалить загруженный скрипт установки из текущего каталога.

### Linux / NAS

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Для собственного пути установки добавьте `-o /path/to/weig-qb-webui`.

### Docker

Один контейнер / автоопределение:

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Несколько контейнеров:

```sh
sh install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./install.sh
```

При использовании `--config-root`:

```sh
sh install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\install.ps1 -Force }
```

Для собственного пути установки добавьте `-o D:\weig-qb-webui`.

`-purge` удаляет только резервные копии текущей цели и не затрагивает другие установки. Если общий каталог состояния становится пустым, также удаляется `~/.config/weig-qb-webui` в Linux (для root: `/root/.config/weig-qb-webui`) или `%APPDATA%\weig-qb-webui` в Windows.

Чтобы сохранить резервные копии для последующего `-rollback`, просто уберите `-purge`.

</details>

## Дополнительная помощь

Docker, NAS, пользовательские пути, обновление и ручное развёртывание: [Установка, обновление и ручное развёртывание](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.ru.md).

## Лицензия

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
