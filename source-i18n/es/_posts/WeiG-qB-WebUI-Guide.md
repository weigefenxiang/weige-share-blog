---
title: "WeiG qB WebUI: guía para principiantes de la interfaz Web alternativa de qBittorrent"
date: 2026-09-28 17:15:00
tags:
  - qBittorrent
  - WebUI
  - NAS
  - Docker
categories:
  - qBittorrent
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview-v1.1.0.gif
description: "Guía para instalar WeiG qB WebUI y usarlo como interfaz Web alternativa de qBittorrent en Windows, Linux, NAS y Docker."
---

Si normalmente administras qBittorrent desde el navegador —sobre todo en un **NAS, con Docker o desde el móvil**— WeiG qB WebUI hace mucho más cómoda la gestión diaria. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Vista previa en línea</a></strong>

En entornos con trackers privados, la estabilidad suele importar más que actualizar a cada versión nueva. Un qBittorrent instalado en un NAS puede llevar años compartiendo sin problemas y actualizar solo por la interfaz añade trabajo y posibles riesgos de migración. Al mismo tiempo, la interfaz Web original no resulta especialmente cómoda en el móvil y una pantalla muy clara molesta más por la noche. WeiG qB WebUI se diseñó precisamente pensando en esas necesidades: buen uso desde el teléfono, modo oscuro y compatibilidad amplia con versiones antiguas de qBittorrent. Actualmente funciona con versiones estables de **4.1.0 a 5.2.x**. Si encuentras una versión con problemas, puedes dejar un comentario.

**WeiG qB WebUI** es una **interfaz Web alternativa** para qBittorrent, pensada tanto para escritorio como para móvil:

- 📱 Diseño adaptable para móviles
- 🌙 Modo oscuro
- 🧱 Compatible con versiones antiguas de qBittorrent
- ✅ Compatible con **qBittorrent 4.1.0 → 5.2.x**
- 🐳 Funciona en Windows, Linux, Docker y NAS

[Proyecto](https://github.com/weigefenxiang/WeiG-qB-WebUI)

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Shell-8A2BE2?logo=gnubash&logoColor=white" alt="Shell">
</div>

## Vista previa de la interfaz

### Escritorio

<p align="center">
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview-v1.1.0.gif" alt="Interfaz de escritorio de WeiG qB WebUI" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>

### Móvil

#### Demostración animada

<p align="center">
  <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview-v1.1.0.gif" alt="Animación móvil de WeiG qB WebUI" style="display:block;width:20%;height:auto;margin:0 auto;">
</p>

#### Captura de la interfaz

<p align="center">
  <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview-v1.1.0.png" alt="Interfaz móvil de WeiG qB WebUI" style="display:block;width:auto;max-width:100%;height:auto;margin:0 auto;">
</p>
## Instalación para principiantes

<details>
<summary><b>¿Es tu primera instalación? Despliega esta guía de 1 minuto</b></summary>

### 1. Extraer el ZIP

Descarga `WeiG-qB-WebUI.zip`, extráelo y cambia el nombre de la carpeta extraída `WeiG-qB-WebUI` a `WeiG_qB-WebUI`. La estructura final debe ser:

```text
WeiG_qB-WebUI/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

La carpeta **`WeiG_qB-WebUI` completa** es la raíz de la WebUI. No copies solo `public` o `private`.

### 2. Moverla a una ubicación fija

```text
Windows: D:\WeiG_qB-WebUI
Linux:   /opt/WeiG_qB-WebUI
```

Ese es el directorio que indicarás en qBittorrent.

### 3. Activarla en qBittorrent

Abre qBittorrent:

**Herramientas → Opciones... → WebUI**

Estos son los términos actuales de la traducción oficial al español de qBittorrent. Después:

1. Activa **Usar la interfaz Web alternativa**.
2. Busca **Ubicación de archivos:**.
3. Introduce la ruta de la carpeta `WeiG_qB-WebUI`.

Ejemplo en Windows:

```text
D:\WeiG_qB-WebUI
```

Ejemplo en Linux:

```text
/opt/WeiG_qB-WebUI
```

4. Pulsa **OK** para guardar.
5. Recarga la WebUI. Si sigue apareciendo la interfaz antigua, prueba `Ctrl + F5`.

> **Cómo comprobar la ruta:** dentro del directorio indicado debes ver directamente `public`, `private`, `VERSION` y los demás archivos.

> **Docker:** qBittorrent se ejecuta dentro de un contenedor, por lo que normalmente debes usar una ruta visible desde el contenedor y no la ruta real del host.

</details>

## Instalación con un solo comando

El instalador para Linux/NAS se descarga siempre desde el enlace fijo de Dev Pages que aparece abajo. **La dirección del script no decide el canal de instalación:** sin `-dev`, instala la última versión estable; con `-dev`, instala la última versión de desarrollo de la rama `dev` actual. El script se guarda en el directorio actual para futuras actualizaciones o restauraciones.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o weig_qb-webui_install.sh && sh weig_qb-webui_install.sh -configure
```

<details>
<summary><b>Ver ubicación del script y directorio de instalación predeterminado</b></summary>

```text
./weig_qb-webui_install.sh
```

Ruta predeterminada de la WebUI:

```text
~/.local/share/weig_qb-webui
```

Si se ejecuta como `root`:

```text
/root/.local/share/weig_qb-webui
```

</details>

### Docker

<details>
<summary><b>Instalación Docker / varios contenedores / rutas</b></summary>

#### Host y contenedor

- **Host**: el sistema Linux/NAS donde se ejecuta Docker.
- **Contenedor**: el entorno aislado donde se ejecuta qBittorrent.

Ejemplo:

```text
Host:       /root/qbittorrent/config
   ↓ montado como
Contenedor: /config
```

Docker Compose:

```yaml
volumes:
  - /root/qbittorrent/config:/config
```

Si la WebUI está instalada en el host en:

```text
/root/qbittorrent/config/weig_qb-webui
```

entonces **Ubicación de archivos:** en qBittorrent debe ser:

```text
/config/weig_qb-webui
```

#### Un único contenedor qBittorrent

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o weig_qb-webui_install.sh && sh weig_qb-webui_install.sh -configure
```

El instalador intenta detectar automáticamente el contenedor y el montaje `/config`.

#### Listar contenedores

```sh
sh weig_qb-webui_install.sh --list-containers
```

O:

```sh
docker ps
```

Elegir un contenedor explícitamente:

```sh
sh weig_qb-webui_install.sh --container=qbittorrent -configure
```

Si hay varios contenedores qBittorrent, el instalador no elige uno al azar.

#### Indicar el directorio del host montado como `/config`

```sh
sh weig_qb-webui_install.sh --config-root=/root/qbittorrent/config -configure
```

Synology:

```sh
sh weig_qb-webui_install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Otro NAS:

```sh
sh weig_qb-webui_install.sh --config-root=/share/Container/qbittorrent -configure
```

#### Elegir la ruta WebUI

```sh
sh weig_qb-webui_install.sh --container=qbittorrent -o /config/weig_qb-webui -configure
```

</details>

### Windows PowerShell

```powershell
Invoke-WebRequest https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.ps1 -OutFile .\weig_qb-webui_install.ps1; powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -configure
```

<details>
<summary><b>Ver directorio de instalación</b></summary>

```text
C:\Users\<tu-usuario>\AppData\Local\WeiG_qB-WebUI
```

</details>

## Opciones habituales
Los nombres de parámetros de PowerShell no distinguen mayúsculas y minúsculas.

| Uso | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Última Release estable | Predeterminado | Predeterminado |
| Release específica | `-version 1.0.0` | `-version 1.0.0` |
| Versión de desarrollo | `-dev` | `-dev` |
| Directorio de instalación | `-o /path` o `-o /path` | `-o D:\path` o `-output D:\path` |
| Configurar qBittorrent | `-configure` | `-configure` |
| Restaurar instalación anterior | `-rollback` | `-rollback` |
| Desinstalación completa (sin copias del instalador) | `-uninstall -purge` | `-uninstall -purge` |
| Ayuda | `-help` | `-help` |
| Elegir contenedor Docker | `--container=NAME` | — |
| Listar contenedores Docker | `--list-containers` | — |
| Ruta del host montada como `/config` | `--config-root=/path` | — |

<details>
<summary><b>Notas: (haz clic para desplegar)</b></summary>

- Una versión inexistente no cambia automáticamente a latest o dev.
- Sin `-dev`: instalar la última versión estable; con `-dev`: instalar la última versión de desarrollo de la rama `dev` actual.

### Versión específica y directorio de instalación

Linux:

```sh
sh weig_qb-webui_install.sh -version 1.0.0 -o /opt/weig_qb-webui -configure
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -version 1.0.0 -o D:\WeiG_qB-WebUI -configure
```

### Reversión

Rollback:

```sh
sh weig_qb-webui_install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -rollback
```

</details>

## Desinstalación con un solo comando

<details>
<summary><b>Desinstalación completa para Linux / NAS, Docker y Windows PowerShell</b></summary>

De forma predeterminada se recomienda la **desinstalación completa sin conservar copias del instalador**: elimina el WebUI, desactiva la interfaz alternativa correspondiente, purga las copias / el estado de rollback propiedad de ese destino y después elimina el script de instalación descargado en el directorio actual.

### Linux / NAS

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge && rm -f -- ./weig_qb-webui_install.sh
```

Para una ruta personalizada, añade `-o /path/to/weig_qb-webui`.

### Docker

Un contenedor / detección automática:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge && rm -f -- ./weig_qb-webui_install.sh
```

Varios contenedores:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./weig_qb-webui_install.sh
```

Al usar `--config-root`:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./weig_qb-webui_install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\weig_qb-webui_install.ps1 -Force }
```

Para una ruta personalizada, añade `-o D:\WeiG_qB-WebUI`.

`-purge` solo elimina las copias pertenecientes al destino que se está desinstalando y no afecta a otras instalaciones. Si el directorio de estado compartido queda vacío, también se elimina `~/.config/weig_qb-webui` en Linux (root: `/root/.config/weig_qb-webui`) o `%APPDATA%\WeiG_qB-WebUI` en Windows.

Para conservar las copias y poder usar `-rollback` más adelante, simplemente omite `-purge`.

</details>

## Más ayuda

Para Docker, NAS, rutas personalizadas, actualizaciones e instalación manual, consulta [Instalación, actualización y despliegue manual](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.es.md).

## Licencia

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
