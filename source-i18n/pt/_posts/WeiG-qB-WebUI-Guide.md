---
title: "WeiG qB WebUI: guia para iniciantes da WebUI alternativa do qBittorrent"
date: 2026-09-28 17:15:00
tags:
  - qBittorrent
  - WebUI
  - NAS
  - Docker
categories:
  - qBittorrent
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview-v1.1.0.gif
description: "Guia para instalar o WeiG qB WebUI e utilizá-lo como WebUI alternativa do qBittorrent em Windows, Linux, NAS e Docker."
---

Se costuma administrar o qBittorrent pelo navegador — sobretudo num **NAS, em Docker ou no telemóvel** — o WeiG qB WebUI torna a utilização diária muito mais confortável. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Pré-visualização online</a></strong>

Em ambientes de trackers privados, a estabilidade costuma ser mais importante do que atualizar a cada nova versão. Uma instalação do qBittorrent num NAS pode ficar anos a fazer seeding sem problemas, e atualizar apenas por causa da interface acrescenta trabalho e possíveis riscos de migração. Ao mesmo tempo, a WebUI original não é especialmente confortável no telemóvel e uma interface muito clara é cansativa à noite. O WeiG qB WebUI foi criado precisamente com estas necessidades em mente: boa utilização em dispositivos móveis, modo escuro e ampla compatibilidade com versões antigas do qBittorrent. Atualmente suporta versões estáveis de **4.1.0 a 5.2.x**. Se encontrar algum problema com uma versão, deixe um comentário.

**WeiG qB WebUI** é uma **WebUI alternativa** para qBittorrent, concebida para desktop e dispositivos móveis:

- 📱 Interface responsiva em telemóveis
- 🌙 Modo escuro
- 🧱 Compatível com versões antigas do qBittorrent
- ✅ Suporta **qBittorrent 4.1.0 → 5.2.x**
- 🐳 Funciona em Windows, Linux, Docker e NAS

[Projeto](https://github.com/weigefenxiang/WeiG-qB-WebUI)

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Shell-8A2BE2?logo=gnubash&logoColor=white" alt="Shell">
</div>

## Pré-visualização da interface

### Desktop

<p align="center">
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview-v1.1.0.gif" alt="Interface de desktop do WeiG qB WebUI" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>

### Mobile

#### Demonstração animada

<p align="center">
  <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview-v1.1.0.gif" alt="Animação mobile do WeiG qB WebUI" style="display:block;width:20%;height:auto;margin:0 auto;">
</p>

#### Captura da interface

<p align="center">
  <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview-v1.1.0.png" alt="Interface mobile do WeiG qB WebUI" style="display:block;width:auto;max-width:100%;height:auto;margin:0 auto;">
</p>
## Instalação para iniciantes

<details>
<summary><b>Primeira instalação? Abrir o guia de 1 minuto</b></summary>

### 1. Extrair o ZIP

Transfira `WeiG-qB-WebUI.zip`, extraia-o e depois mude o nome da pasta extraída `WeiG-qB-WebUI` para `WeiG_qB-WebUI`. A estrutura final deve ser:

```text
WeiG_qB-WebUI/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

A pasta **`WeiG_qB-WebUI` completa** é a raiz da WebUI. Não copie apenas `public` ou `private`.

### 2. Mover para uma localização permanente

```text
Windows: D:\WeiG_qB-WebUI
Linux:   /opt/WeiG_qB-WebUI
```

Este é o diretório que deverá indicar no qBittorrent.

### 3. Ativar no qBittorrent

Abra o qBittorrent:

**Ferramentas → Opções... → WebUI**

Estes são os termos atuais da tradução oficial portuguesa do qBittorrent. Depois:

1. Ative **Usar interface web alternativa**.
2. Procure **Localização dos ficheiros:**.
3. Introduza o caminho para a pasta `WeiG_qB-WebUI`.

Exemplo Windows:

```text
D:\WeiG_qB-WebUI
```

Exemplo Linux:

```text
/opt/WeiG_qB-WebUI
```

4. Clique em **OK** para guardar.
5. Atualize a página da WebUI. Se a interface antiga continuar em cache, experimente `Ctrl + F5`.

> **Como confirmar o caminho:** dentro do diretório indicado deve conseguir ver diretamente `public`, `private`, `VERSION` e os restantes ficheiros.

> **Docker:** o qBittorrent é executado dentro de um contentor. Normalmente deve indicar um caminho visível pelo contentor, não o caminho real do anfitrião.

</details>

## Instalação com um comando

O instalador para Linux/NAS é sempre descarregado pelo endereço fixo do Dev Pages abaixo. **O endereço do script não escolhe o canal de instalação:** sem `-dev`, instala a versão estável mais recente; com `-dev`, instala a versão de desenvolvimento mais recente da branch `dev` atual. O script de instalação fica guardado no diretório atual para futuras atualizações ou rollback.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o weig_qb-webui_install.sh && sh weig_qb-webui_install.sh -configure
```

<details>
<summary><b>Mostrar localização do script e diretório de instalação predefinido</b></summary>

```text
./weig_qb-webui_install.sh
```

Diretório predefinido da WebUI:

```text
~/.local/share/weig_qb-webui
```

Ao executar como `root`:

```text
/root/.local/share/weig_qb-webui
```

</details>

### Docker

<details>
<summary><b>Instalação Docker / vários contentores / caminhos</b></summary>

#### Anfitrião e contentor

- **Anfitrião**: o sistema Linux/NAS onde o Docker é executado.
- **Contentor**: o ambiente isolado onde o qBittorrent é executado.

Exemplo:

```text
Anfitrião: /root/qbittorrent/config
   ↓ montado em
Contentor: /config
```

Docker Compose:

```yaml
volumes:
  - /root/qbittorrent/config:/config
```

Se a WebUI estiver instalada no anfitrião em:

```text
/root/qbittorrent/config/weig_qb-webui
```

então **Localização dos ficheiros:** no qBittorrent deve ser:

```text
/config/weig_qb-webui
```

#### Apenas um contentor qBittorrent

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o weig_qb-webui_install.sh && sh weig_qb-webui_install.sh -configure
```

O instalador tenta detetar automaticamente o contentor e a montagem `/config`.

#### Listar contentores

```sh
sh weig_qb-webui_install.sh --list-containers
```

Ou:

```sh
docker ps
```

Selecionar explicitamente um contentor:

```sh
sh weig_qb-webui_install.sh --container=qbittorrent -configure
```

Se existirem vários contentores qBittorrent, o instalador não escolhe um ao acaso.

#### Indicar a pasta do anfitrião montada como `/config`

```sh
sh weig_qb-webui_install.sh --config-root=/root/qbittorrent/config -configure
```

Synology:

```sh
sh weig_qb-webui_install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Outro NAS:

```sh
sh weig_qb-webui_install.sh --config-root=/share/Container/qbittorrent -configure
```

#### Escolher o caminho da WebUI

```sh
sh weig_qb-webui_install.sh --container=qbittorrent -o /config/weig_qb-webui -configure
```

</details>

### Windows PowerShell

```powershell
Invoke-WebRequest https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.ps1 -OutFile .\weig_qb-webui_install.ps1; powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -configure
```

<details>
<summary><b>Mostrar diretório de instalação</b></summary>

```text
C:\Users\<nome-do-utilizador>\AppData\Local\WeiG_qB-WebUI
```

</details>

## Opções comuns
Os nomes dos parâmetros PowerShell não distinguem maiúsculas de minúsculas.

| Utilização | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Release estável mais recente | Predefinição | Predefinição |
| Release específica | `-version 1.0.0` | `-version 1.0.0` |
| Versão de desenvolvimento | `-dev` | `-dev` |
| Diretório de instalação | `-o /path` ou `-o /path` | `-o D:\path` ou `-output D:\path` |
| Configurar o qBittorrent | `-configure` | `-configure` |
| Restaurar a instalação anterior | `-rollback` | `-rollback` |
| Desinstalação completa (sem cópias do instalador) | `-uninstall -purge` | `-uninstall -purge` |
| Ajuda | `-help` | `-help` |
| Selecionar contentor Docker | `--container=NAME` | — |
| Listar contentores Docker | `--list-containers` | — |
| Caminho do anfitrião montado como `/config` | `--config-root=/path` | — |

<details>
<summary><b>Notas: (clique para expandir)</b></summary>

- Uma versão inexistente não muda automaticamente para latest ou dev.
- Sem `-dev`: instalar a versão estável mais recente; com `-dev`: instalar a versão de desenvolvimento mais recente da branch `dev` atual.

### Versão específica e diretório de instalação

Linux:

```sh
sh weig_qb-webui_install.sh -version 1.0.0 -o /opt/weig_qb-webui -configure
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -version 1.0.0 -o D:\WeiG_qB-WebUI -configure
```

### Restauro

Restauro:

```sh
sh weig_qb-webui_install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -rollback
```

</details>

## Desinstalação com um comando

<details>
<summary><b>Desinstalação completa em Linux / NAS, Docker e Windows PowerShell</b></summary>

Por predefinição, recomendamos a **desinstalação completa sem manter cópias do instalador**: remove o WebUI, desativa a interface alternativa correspondente, elimina as cópias / estado de rollback pertencentes a esse destino e, por fim, remove o script de instalação transferido no diretório atual.

### Linux / NAS

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge && rm -f -- ./weig_qb-webui_install.sh
```

Para um caminho personalizado, acrescente `-o /path/to/weig_qb-webui`.

### Docker

Um contentor / deteção automática:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge && rm -f -- ./weig_qb-webui_install.sh
```

Vários contentores:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./weig_qb-webui_install.sh
```

Ao usar `--config-root`:

```sh
sh weig_qb-webui_install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./weig_qb-webui_install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\weig_qb-webui_install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\weig_qb-webui_install.ps1 -Force }
```

Para um caminho personalizado, acrescente `-o D:\WeiG_qB-WebUI`.

`-purge` elimina apenas as cópias pertencentes ao destino que está a ser desinstalado e não afeta outras instalações. Se o diretório de estado partilhado ficar vazio, `~/.config/weig_qb-webui` no Linux (root: `/root/.config/weig_qb-webui`) ou `%APPDATA%\WeiG_qB-WebUI` no Windows também é removido.

Para manter as cópias e poder usar `-rollback` mais tarde, basta omitir `-purge`.

</details>

## Mais ajuda

Para Docker, NAS, caminhos personalizados, atualizações e instalação manual, consulte [Instalação, atualização e implementação manual](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.pt.md).

## Licença

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
