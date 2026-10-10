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
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif
description: "Guía para instalar WeiG qB WebUI y usarlo como interfaz Web alternativa de qBittorrent en Windows, Linux, NAS y Docker."
---

Si normalmente administras qBittorrent desde el navegador —sobre todo en un **NAS, con Docker o desde el móvil**— WeiG qB WebUI hace mucho más cómoda la gestión diaria. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Vista previa en línea</a></strong>

Hace unos siete años me uní a varios trackers privados. Entonces instalé qBittorrent 4.1.9 en mi NAS: era la versión más reciente. Nunca pensé que seguiría utilizándola tantos años después.

Una vez intenté dar el salto a una versión importante (creo recordar que fue la 4.2.5). El problema es que desaparecieron las tareas de torrent del cliente y ya no podía seguir compartiendo. Había acumulado tantos torrents que recuperarlos fue un buen lío. Desde entonces, cuando una versión funciona bien, prefiero dejarla tranquila.

Desde que terminé los estudios y empecé a trabajar, paso cada vez menos tiempo frente al ordenador. Ahora gestiono el NAS casi siempre desde el móvil, pero la WebUI original de qBittorrent no resulta muy cómoda en una pantalla pequeña. Probé otras interfaces alternativas y muchas no funcionaban bien con versiones antiguas.

Por eso acabé creando WeiG qB WebUI. El proyecto cubre distintas versiones estables de qBittorrent, desde la 4.1.x hasta la 5.2.x. Si encuentras problemas de compatibilidad o tienes ideas para mejorarlo, estaré encantado de leerte.

**WeiG qB WebUI** es una **interfaz Web alternativa** para qBittorrent, pensada tanto para escritorio como para móvil:

- 📱 Diseño adaptable para móviles
- 🌙 Modo oscuro
- 🧱 Compatible con versiones antiguas de qBittorrent
- ✅ Compatible con **qBittorrent 4.1.x → 5.2.x**
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
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif" alt="Interfaz de escritorio de WeiG qB WebUI" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>


### Móvil

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
    <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview.gif" alt="Demostración de WeiG qB WebUI en el móvil">
    <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview.png" alt="Capturas de WeiG qB WebUI para móvil">
  </div>
</div>

## Instalación para principiantes

<details>
<summary><b>¿Es tu primera instalación? Despliega esta guía de 1 minuto</b></summary>

### 1. Extraer el ZIP

Descarga la última versión estable [**weig-qb-webui.zip**](https://github.com/weigefenxiang/WeiG-qB-WebUI/releases/latest/download/weig-qb-webui.zip) y descomprímela. El archivo ya incluye la carpeta raíz con el nombre correcto:

```text
weig-qb-webui/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

La carpeta **`weig-qb-webui` completa** es la raíz de la WebUI. No copies solo `public` o `private`.

### 2. Moverla a una ubicación fija

```text
Windows: D:\weig-qb-webui
Linux:   /opt/weig-qb-webui
```

Ese es el directorio que indicarás en qBittorrent.

### 3. Activarla en qBittorrent

Abre qBittorrent:

**Herramientas → Opciones... → WebUI**

Estos son los términos actuales de la traducción oficial al español de qBittorrent. Después:

1. Activa **Usar la interfaz Web alternativa**.
2. Busca **Ubicación de archivos:**.
3. Introduce la ruta de la carpeta `weig-qb-webui`.

Ejemplo en Windows:

```text
D:\weig-qb-webui
```

Ejemplo en Linux:

```text
/opt/weig-qb-webui
```

4. Pulsa **OK** para guardar.
5. Recarga la WebUI. Si sigue apareciendo la interfaz antigua, prueba `Ctrl + F5`.

> **Cómo comprobar la ruta:** dentro del directorio indicado debes ver directamente `public`, `private`, `VERSION` y los demás archivos.

> **Docker:** qBittorrent se ejecuta dentro de un contenedor, por lo que normalmente debes usar una ruta visible desde el contenedor y no la ruta real del host.

</details>

## Instalación con un solo comando

El instalador de Linux / NAS se descarga desde la dirección fija de Dev Pages. **Esa dirección no determina la versión instalada:** sin `-dev`, se usa la versión estable y verificada de GitHub desde `main`; con `-dev`, la versión actual de `dev` fijada a un SHA de Git exacto. El script queda en el directorio actual para futuras actualizaciones o restauraciones.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

<details>
<summary><b>Ver ubicación del script y directorio de instalación predeterminado</b></summary>

```text
./install.sh
```

Ruta predeterminada de la WebUI:

```text
~/.local/share/weig-qb-webui
```

Si se ejecuta como `root`:

```text
/root/.local/share/weig-qb-webui
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
/root/qbittorrent/config/weig-qb-webui
```

entonces **Ubicación de archivos:** en qBittorrent debe ser:

```text
/config/weig-qb-webui
```

#### Un único contenedor qBittorrent

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

El instalador intenta detectar automáticamente el contenedor y el montaje `/config`.

#### Listar contenedores

```sh
sh install.sh --list-containers
```

O:

```sh
docker ps
```

Elegir un contenedor explícitamente:

```sh
sh install.sh --container=qbittorrent -configure
```

Si hay varios contenedores qBittorrent, el instalador no elige uno al azar.

#### Caso 3: varios contenedores qBittorrent

Si tienes `qbittorrent` y `qbittorrent-test`, consulta primero la lista y después selecciona cuál quieres configurar. El instalador no elige por su cuenta:

```sh
sh install.sh --list-containers
sh install.sh --container=qbittorrent -configure
sh install.sh --container=qbittorrent-test -configure
```

#### Indicar el directorio del host montado como `/config`

```sh
sh install.sh --config-root=/root/qbittorrent/config -configure
```

Synology:

```sh
sh install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Otro NAS:

```sh
sh install.sh --config-root=/share/Container/qbittorrent -configure
```

#### Elegir la ruta WebUI

```sh
sh install.sh --container=qbittorrent -o /config/weig-qb-webui -configure
```

#### Caso 6: actualizar varias carpetas WebUI existentes

Si gestionas varias instancias de qBittorrent, repite `-o` para indicar sus carpetas. El paquete se descarga y verifica una sola vez; los cambios se aplican después de preparar todos los destinos. Cada uno conserva sus tres copias más recientes por separado en `~/.config/weig-qb-webui/backups/`.

```sh
sh install.sh -dev \
  -o /root/qbittorrent/config/weig-qb-webui \
  -o /root/qbittorrent3/config/weig-qb-webui
```

No uses `-configure` con varios destinos: cada instancia seguirá usando su ruta WebUI configurada. Ejecuta `sh install.sh -help` para ver las opciones.

#### Comprobar las rutas después de instalar

Al terminar, el instalador muestra rutas parecidas a estas. La primera es la ubicación real en el host; la segunda es la ruta dentro del contenedor que debes escribir en **Files location** de qBittorrent.

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
<summary><b>Ver directorio de instalación</b></summary>

```text
C:\Users\<tu-usuario>\AppData\Local\weig-qb-webui
```

</details>

## Opciones habituales

<details>
<summary><b>Linux y Windows comparten las opciones; PowerShell no distingue mayúsculas y minúsculas (desplegar)</b></summary>

Los nombres de parámetros de PowerShell no distinguen mayúsculas y minúsculas.

| Uso | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Última Release estable | Predeterminado | Predeterminado |
| Release específica | `-version 1.2.0` | `-version 1.2.0` |
| Versión de desarrollo | `-dev` | `-dev` |
| Directorio de instalación | `-o /path` (se puede repetir en Linux) | `-o D:\path` o `-output D:\path` |
| Archivo de configuración personalizado de qBittorrent | — | `-qbconfig D:\path\qBittorrent.ini` |
| Configurar qBittorrent | `-configure` | `-configure` |
| Restaurar instalación anterior | `-rollback` | `-rollback` |
| Desinstalación completa (sin copias del instalador) | `-uninstall -purge` | `-uninstall -purge` |
| Ayuda | `-help` | `-help` |
| Elegir contenedor Docker | `--container=NAME` | — |
| Listar contenedores Docker | `--list-containers` | — |
| Ruta del host montada como `/config` | `--config-root=/path` | — |

</details>

<details>
<summary><b>Notas: (haz clic para desplegar)</b></summary>

- Sin `-dev`, se instala la versión estable de GitHub verificada desde `main`. Con `-dev`, el desarrollo actual de `dev` mediante su SHA exacto.
- `-o` significa **output**. En Linux puedes repetirlo para actualizar varias carpetas WebUI existentes con una descarga verificada.
- Las copias se guardan en `~/.config/weig-qb-webui/backups/`, conservando las tres más recientes por destino.
- `-configure` activa **Use alternative WebUI** y configura **Files location** en qBittorrent. Solo admite un destino a la vez.
- `-rollback` restaura la última copia del instalador para el destino indicado. Repite `-o` para restaurar varios destinos explícitos.
- `-uninstall -purge` elimina la WebUI y las copias / el estado de restauración de ese destino sin afectar a otros. El directorio compartido se limpia si queda vacío.
- Si quieres conservar las copias para usar `-rollback` más adelante, omite `-purge`.
- `-version 1.2.0` instala un GitHub Release concreto. Si no existe, se produce un error y **no se cambia automáticamente a latest ni dev**.
- `-help` muestra las opciones disponibles.
- Para varios contenedores Docker, usa `--list-containers` y `--container=NAME`, o indica la configuración del host con `--config-root=/path`.

### Versión específica y directorio de instalación

Linux:

```sh
sh install.sh -version 1.2.0 -o /opt/weig-qb-webui -configure
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -version 1.2.0 -o D:\weig-qb-webui -configure
```

### Reversión

Rollback:

```sh
sh install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -rollback
```

</details>

## Desinstalación con un solo comando

<details>
<summary><b>Desinstalación completa para Linux / NAS, Docker y Windows PowerShell</b></summary>

De forma predeterminada se recomienda la **desinstalación completa sin conservar copias del instalador**: elimina el WebUI, desactiva la interfaz alternativa correspondiente, purga las copias / el estado de rollback propiedad de ese destino y después elimina el script de instalación descargado en el directorio actual.

### Linux / NAS

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Para una ruta personalizada, añade `-o /path/to/weig-qb-webui`.

### Docker

Un contenedor / detección automática:

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Varios contenedores:

```sh
sh install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./install.sh
```

Al usar `--config-root`:

```sh
sh install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\install.ps1 -Force }
```

Para una ruta personalizada, añade `-o D:\weig-qb-webui`.

`-purge` solo elimina las copias pertenecientes al destino que se está desinstalando y no afecta a otras instalaciones. Si el directorio de estado compartido queda vacío, también se elimina `~/.config/weig-qb-webui` en Linux (root: `/root/.config/weig-qb-webui`) o `%APPDATA%\weig-qb-webui` en Windows.

Para conservar las copias y poder usar `-rollback` más adelante, simplemente omite `-purge`.

</details>

## Más ayuda

Para Docker, NAS, rutas personalizadas, actualizaciones e instalación manual, consulta [Instalación, actualización y despliegue manual](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.es.md).

## Licencia

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
