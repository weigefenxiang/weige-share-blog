---
title: "Crear tu propio firmware OpenWrt en la nube: guía para principiantes"
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - Compilación de firmware
categories:
  - OpenWrt
cover: https://img.weigshare.com/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: "Crea una imagen OpenWrt personalizada con el configurador online de Wei.G y GitHub Actions, sin instalar un entorno de compilación local."
---

¿Quieres un firmware OpenWrt adaptado a tu router sin tener que preparar primero todo un entorno de compilación local? Abre el [configurador online de Wei.G](https://www.weigshare.com/wrt), elige la fuente, el dispositivo objetivo, los paquetes y las opciones del firmware y envía la solicitud a GitHub Actions. La compilación se realizará en la nube.

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>

## Inicio rápido

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Flashear firmware conlleva riesgos. Comprueba primero el modelo del router, las particiones y el método de flasheo. Si no estás seguro, no flashees.</span>

- Inicia sesión en **[GitHub](https://github.com/)**
- Abre el **[personalizador en línea de Wei.G](https://www.weigshare.com/wrt)**
- Si eres nuevo, consulta el tutorial siguiente 👇

## Contexto

- **【Un punto de partida más sencillo】** Si quieres aprender a compilar tu propio firmware pero no quieres empezar montando toda la cadena de herramientas en local, este proyecto ofrece una entrada más accesible.
- **【Paquetes y dependencias】** Algunos plugins y dependencias deben integrarse en el firmware durante la compilación para poder utilizarlos.
- **【Configuración】** OpenWrt ofrece muchas opciones de compilación y, en China continental, las condiciones de red pueden complicar aún más la descarga de dependencias.
- **【Tiempo】** Una compilación completa puede tardar varias horas y aun así fallar, por lo que investigar los errores también lleva tiempo.
- **【Objetivo】** A largo plazo, la idea es que cualquiera pueda hacer un fork del proyecto y ejecutar su propio sitio de compilación de OpenWrt con GitHub **Pages + Actions**.
- **【Estado actual】** El proyecto sigue en fase de pruebas. Puede haber errores y un uso intensivo del flujo compartido puede encontrarse con políticas o límites de GitHub.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.009.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Dispositivos compatibles

Por ahora solo se han verificado los siguientes objetivos. Otros dispositivos aún no se han probado. Si no tienes una forma de recuperación, no utilices esta herramienta.

- **Fuentes: [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**
- Accesible desde ordenador y móvil

## Preparación

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Flashear firmware conlleva riesgos. Comprueba primero el modelo del router, las particiones y el método de flasheo. Si no estás seguro, no flashees.</span>

- Inicia sesión con una cuenta de **[GitHub](https://github.com/)**. Sin cuenta no se puede iniciar una compilación.
- Abre el **[personalizador en línea de Wei.G](https://www.weigshare.com/wrt)**.
  - **[Página Cloudflare dev](https://dev.weig-wrt.pages.dev/)** (funciones experimentales y novedades; puede contener bugs)

<!-- Captura 1: página principal con Source, Branch, Target y zona de plugins -->

## 1. Elegir parámetros

- Después de elegir la fuente, busca el modelo o entorno correspondiente. También puedes cargar una config existente.
- Selecciona **Source → Branch → Target System → Subtarget → Target Profile**.
  - Ejemplo x86/64: **ImmortalWrt → openwrt-24.10 → x86 → 64 → Generic x86/64**

- En **Advanced menuconfig › LuCI › 3. Applications**, marca las aplicaciones que quieras.
- Ajusta las demás opciones de **Advanced menuconfig** según sea necesario.

Después configura, si procede, la **zona horaria**, el **tema del firmware**, los **servidores NTP** y el **mirror de paquetes**.

<div style="display:flex; gap:10px;">

<img src=https://img.weigshare.com/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="150">

</div>

### Configuración existente

Si ya tienes un archivo `.config`, `config.buildinfo` o una solicitud descargada anteriormente, pulsa **Cargar configuración** en la parte inferior. En la ventana de confirmación revisa la fuente, la rama, el Target Profile, los plugins y los ajustes del firmware.

## 2. Enviar la compilación

Pulsa **Enviar compilación en la nube** en la esquina inferior derecha.

Elige **Descargar solicitud y abrir GitHub**. El navegador descargará un archivo JSON y abrirá automáticamente una nueva página de GitHub Issue.

Mueve el archivo descargado al cuadro del Issue y pulsa **Create**.

El bot responderá en el Issue con el enlace de Actions correspondiente a la compilación.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 3. Descargar el firmware

La compilación suele tardar entre 2 y 4 horas. Cuando termine, entra en la página de Actions y descarga los elementos de **Artifacts**:

- `FIRMWARE-ALL-XXX`: todos los archivos de firmware y las sumas de comprobación. Para un primer flasheo normalmente se busca un archivo como `factory`.
- `CONFIG-XXX`: configuración enviada, configuración final y diferencias. Se recomienda conservarla.
- `BUILD-LOGS-XXX`: logs completos de compilación para diagnóstico.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Preguntas frecuentes

- **¿Qué hago si falla la compilación?** Descarga `BUILD-LOGS-…` y revisa el último `Error`. También puedes informar del problema en el Issue.
- **¿Cómo cancelo?** Responde `/cancel` en tu Issue de compilación.
- **¿Cuántas compilaciones pueden ejecutarse a la vez?** Una cuenta solo puede ejecutar dos tareas al mismo tiempo; las demás deben esperar.
- **¿Por qué no aparece el botón de descarga?** GitHub suele exigir que hayas iniciado sesión para descargar Artifacts de Actions.
- **¿La cola del repositorio público tarda demasiado?** En el futuro podrás [hacer fork de este proyecto](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild) y ejecutar las compilaciones en tu propio repositorio siguiendo las indicaciones de la página, evitando así la cola compartida.

Proyecto: [WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)

## Agradecimientos

- **Fuentes:** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)

- **Referencia:** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)

- **Autores de los plugins LuCI**

- **Todas las personas** que han participado en el proyecto
