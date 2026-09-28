---
title: "Собираем собственную прошивку OpenWrt в облаке: руководство для начинающих"
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - Сборка прошивки
categories:
  - OpenWrt
cover: https://img.weigshare.com/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: "Создавайте собственную сборку OpenWrt через онлайн-конфигуратор Wei.G и GitHub Actions без локальной среды компиляции."
---

Нужна прошивка OpenWrt под ваш роутер, но не хочется сначала разворачивать полноценную среду сборки на компьютере? Откройте [онлайн-конфигуратор Wei.G](https://www.weigshare.com/wrt), выберите исходники, целевое устройство, пакеты и параметры прошивки, затем отправьте запрос в GitHub Actions — сборку выполнит облако.

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>

## Быстрый старт

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Прошивка устройства связана с риском. Сначала проверьте модель роутера, разметку разделов и способ прошивки. Если не уверены — не прошивайте.</span>

- Войдите в **[GitHub](https://github.com/)**
- Откройте **[онлайн-конфигуратор Wei.G](https://www.weigshare.com/wrt)**
- Если вы используете его впервые, следуйте инструкции ниже 👇

## Предыстория

- **【Простой старт】** Если хочется попробовать собрать собственную прошивку, но не хочется начинать с настройки всей локальной toolchain, этот проект даёт более простой вход.
- **【Пакеты и зависимости】** Некоторые плагины и зависимости нужно включить в прошивку ещё на этапе сборки.
- **【Настройка】** У OpenWrt много параметров сборки, а сетевые условия в материковом Китае могут дополнительно затруднять загрузку зависимостей.
- **【Время】** Полная сборка может занимать несколько часов и всё равно завершиться ошибкой, поэтому поиск причины тоже требует времени.
- **【Цель】** В дальнейшем любой пользователь сможет сделать fork проекта и запустить собственный сайт для сборки OpenWrt на GitHub **Pages + Actions**.
- **【Текущий этап】** Проект всё ещё тестируется. Ошибки возможны, а интенсивное использование общего workflow может упереться в политики или лимиты GitHub.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.009.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Поддерживаемые устройства

Сейчас проверены только следующие цели. Остальные устройства ещё не тестировались. Если у вас нет способа восстановить устройство после неудачной прошивки, не используйте этот инструмент.

- **Исходники: [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**
- Доступ с компьютера и телефона

## Подготовка

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Прошивка устройства связана с риском. Сначала проверьте модель роутера, разметку разделов и способ прошивки. Если не уверены — не прошивайте.</span>

- Войдите в аккаунт **[GitHub](https://github.com/)**. Без аккаунта запустить сборку нельзя.
- Откройте **[онлайн-конфигуратор Wei.G](https://www.weigshare.com/wrt)**.
  - **[Cloudflare dev](https://dev.weig-wrt.pages.dev/)** (экспериментальные и самые новые функции, возможны bugs)

<!-- Скриншот 1: главная страница с областями Source, Branch, Target и плагинами -->

## 1. Выберите параметры

- После выбора источника найдите через поиск нужную модель или окружение. Также можно загрузить существующую config.
- Выберите **Source → Branch → Target System → Subtarget → Target Profile**.
  - Пример для x86/64: **ImmortalWrt → openwrt-24.10 → x86 → 64 → Generic x86/64**

- В **Advanced menuconfig › LuCI › 3. Applications** отметьте нужные приложения.
- Остальные расширенные параметры в **Advanced menuconfig** настройте по необходимости.

Затем при необходимости задайте **часовой пояс**, **тему прошивки**, **NTP-серверы** и **зеркало пакетов**.

<div style="display:flex; gap:10px;">

<img src=https://img.weigshare.com/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="150">

</div>

### Готовая конфигурация

Если у вас уже есть `.config`, `config.buildinfo` или ранее скачанный файл запроса, нажмите **Загрузить конфигурацию** в нижней части страницы. В окне подтверждения проверьте источник, ветку, Target Profile, плагины и настройки прошивки.

## 2. Отправьте сборку

Нажмите **Отправить облачную сборку** в правом нижнем углу.

Выберите **Скачать запрос и открыть GitHub**. Браузер загрузит JSON-файл и автоматически откроет страницу создания нового GitHub Issue.

Перетащите загруженный файл в поле Issue и нажмите **Create**.

Бот ответит в Issue ссылкой на Actions для этой сборки.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 3. Скачайте прошивку

Сборка обычно занимает 2–4 часа. После завершения откройте страницу Actions и скачайте файлы из раздела **Artifacts**:

- `FIRMWARE-ALL-XXX`: все файлы прошивки и контрольные суммы. Для первой прошивки обычно нужен файл типа `factory`.
- `CONFIG-XXX`: отправленная конфигурация, итоговая конфигурация и отличия. Рекомендуется сохранить.
- `BUILD-LOGS-XXX`: полные логи сборки для диагностики.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Частые вопросы

- **Что делать, если сборка завершилась ошибкой?** Скачайте `BUILD-LOGS-…` и посмотрите последний `Error`. Также можно сообщить о проблеме в Issue.
- **Как отменить?** Ответьте `/cancel` в своём Issue сборки.
- **Сколько сборок можно запускать одновременно?** Один аккаунт может выполнять только две задачи одновременно, остальные ждут в очереди.
- **Почему нет кнопки скачивания?** Для скачивания GitHub Actions Artifacts обычно требуется войти в аккаунт.
- **Слишком длинная очередь в публичном репозитории?** В дальнейшем можно будет [сделать fork этого проекта](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild) и запускать сборку в своём репозитории по подсказкам на странице, избегая общей очереди.

Проект: [WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)

## Благодарности

- **Исходники:** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)

- **Ориентир:** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)

- **Авторы LuCI-плагинов**

- **Все**, кто участвовал в проекте
