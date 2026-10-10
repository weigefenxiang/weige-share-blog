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
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif
description: "Guia para instalar o WeiG qB WebUI e utilizá-lo como WebUI alternativa do qBittorrent em Windows, Linux, NAS e Docker."
---

Se costuma administrar o qBittorrent pelo navegador — sobretudo num **NAS, em Docker ou no telemóvel** — o WeiG qB WebUI torna a utilização diária muito mais confortável. <strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">Pré-visualização online</a></strong>

Há cerca de sete anos, entrei em alguns trackers privados. Na altura instalei o qBittorrent 4.1.9 no meu NAS, que era então a versão mais recente. Nunca pensei que ainda o estaria a usar tantos anos depois.

Cheguei a tentar uma atualização importante (penso que para a 4.2.5), mas as tarefas de torrents desapareceram do cliente e deixei de conseguir fazer seeding. Já tinha tantos torrents acumulados que recuperá-los foi uma trabalheira. Desde então, se uma versão está estável, prefiro não mexer.

Depois de acabar os estudos e começar a trabalhar, passei a ter muito menos tempo ao computador. Hoje em dia, quase sempre administro o NAS pelo telemóvel. Só que a WebUI original não é prática num ecrã pequeno. Também experimentei algumas alternativas, mas muitas tinham problemas com versões antigas do qBittorrent.

Foi por isso que comecei a desenvolver o WeiG qB WebUI. O projeto abrange várias versões estáveis do qBittorrent, da 4.1.x à 5.2.x. Se encontrar algum problema de compatibilidade ou tiver sugestões, deixe um comentário.

**WeiG qB WebUI** é uma **WebUI alternativa** para qBittorrent, concebida para desktop e dispositivos móveis:

- 📱 Interface responsiva em telemóveis
- 🌙 Modo escuro
- 🧱 Compatível com versões antigas do qBittorrent
- ✅ Suporta **qBittorrent 4.1.x → 5.2.x**
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
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif" alt="Interface de desktop do WeiG qB WebUI" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
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
    <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview.gif" alt="Demonstração da utilização móvel do WeiG qB WebUI">
    <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview.png" alt="Ecrãs do WeiG qB WebUI no telemóvel">
  </div>
</div>

## Instalação para iniciantes

<details>
<summary><b>Primeira instalação? Abrir o guia de 1 minuto</b></summary>

### 1. Extrair o ZIP

Transfira a versão estável mais recente [**weig-qb-webui.zip**](https://github.com/weigefenxiang/WeiG-qB-WebUI/releases/latest/download/weig-qb-webui.zip) e extraia o ficheiro. A pasta principal já tem o nome correto:

```text
weig-qb-webui/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

A pasta **`weig-qb-webui` completa** é a raiz da WebUI. Não copie apenas `public` ou `private`.

### 2. Mover para uma localização permanente

```text
Windows: D:\weig-qb-webui
Linux:   /opt/weig-qb-webui
```

Este é o diretório que deverá indicar no qBittorrent.

### 3. Ativar no qBittorrent

Abra o qBittorrent:

**Ferramentas → Opções... → WebUI**

Estes são os termos atuais da tradução oficial portuguesa do qBittorrent. Depois:

1. Ative **Usar interface web alternativa**.
2. Procure **Localização dos ficheiros:**.
3. Introduza o caminho para a pasta `weig-qb-webui`.

Exemplo Windows:

```text
D:\weig-qb-webui
```

Exemplo Linux:

```text
/opt/weig-qb-webui
```

4. Clique em **OK** para guardar.
5. Atualize a página da WebUI. Se a interface antiga continuar em cache, experimente `Ctrl + F5`.

> **Como confirmar o caminho:** dentro do diretório indicado deve conseguir ver diretamente `public`, `private`, `VERSION` e os restantes ficheiros.

> **Docker:** o qBittorrent é executado dentro de um contentor. Normalmente deve indicar um caminho visível pelo contentor, não o caminho real do anfitrião.

</details>

## Instalação com um comando

O instalador para Linux / NAS é obtido no endereço fixo de Dev Pages abaixo. **O endereço não determina a versão instalada:** sem `-dev`, é usada a versão estável e verificada do GitHub Release de `main`; com `-dev`, a versão atual de `dev` identificada pelo SHA Git exato. O script fica no diretório atual para futuras atualizações ou restauros.

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

<details>
<summary><b>Mostrar localização do script e diretório de instalação predefinido</b></summary>

```text
./install.sh
```

Diretório predefinido da WebUI:

```text
~/.local/share/weig-qb-webui
```

Ao executar como `root`:

```text
/root/.local/share/weig-qb-webui
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
/root/qbittorrent/config/weig-qb-webui
```

então **Localização dos ficheiros:** no qBittorrent deve ser:

```text
/config/weig-qb-webui
```

#### Apenas um contentor qBittorrent

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

O instalador tenta detetar automaticamente o contentor e a montagem `/config`.

#### Listar contentores

```sh
sh install.sh --list-containers
```

Ou:

```sh
docker ps
```

Selecionar explicitamente um contentor:

```sh
sh install.sh --container=qbittorrent -configure
```

Se existirem vários contentores qBittorrent, o instalador não escolhe um ao acaso.

#### Caso 3: vários contentores qBittorrent

Se existirem `qbittorrent` e `qbittorrent-test`, liste os contentores e indique qual pretende configurar. O instalador não escolhe por adivinhação:

```sh
sh install.sh --list-containers
sh install.sh --container=qbittorrent -configure
sh install.sh --container=qbittorrent-test -configure
```

#### Indicar a pasta do anfitrião montada como `/config`

```sh
sh install.sh --config-root=/root/qbittorrent/config -configure
```

Synology:

```sh
sh install.sh --config-root=/volume1/docker/qbittorrent -configure
```

Outro NAS:

```sh
sh install.sh --config-root=/share/Container/qbittorrent -configure
```

#### Escolher o caminho da WebUI

```sh
sh install.sh --container=qbittorrent -o /config/weig-qb-webui -configure
```

#### Caso 6: atualizar várias pastas WebUI existentes

Com várias instâncias do qBittorrent, pode repetir `-o` para indicar os destinos. O pacote é transferido e verificado uma única vez; a mudança começa depois de todos os destinos estarem preparados. Cada um guarda as três últimas cópias separadamente em `~/.config/weig-qb-webui/backups/`.

```sh
sh install.sh -dev \
  -o /root/qbittorrent/config/weig-qb-webui \
  -o /root/qbittorrent3/config/weig-qb-webui
```

Não junte `-configure` à instalação de vários destinos. Cada instância mantém o caminho WebUI já configurado. Consulte `sh install.sh -help` para as opções.

#### Verificar os caminhos após a instalação

No fim, o instalador apresenta caminhos semelhantes aos seguintes. O primeiro é a pasta real no anfitrião; o segundo é o caminho dentro do contentor que deve introduzir em **Files location** no qBittorrent.

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
<summary><b>Mostrar diretório de instalação</b></summary>

```text
C:\Users\<nome-do-utilizador>\AppData\Local\weig-qb-webui
```

</details>

## Opções comuns

<details>
<summary><b>Linux e Windows usam as mesmas opções; no PowerShell, os nomes não distinguem maiúsculas e minúsculas (expandir)</b></summary>

Os nomes dos parâmetros PowerShell não distinguem maiúsculas de minúsculas.

| Utilização | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| Release estável mais recente | Predefinição | Predefinição |
| Release específica | `-version 1.2.0` | `-version 1.2.0` |
| Versão de desenvolvimento | `-dev` | `-dev` |
| Diretório de instalação | `-o /path` (pode repetir no Linux) | `-o D:\path` ou `-output D:\path` |
| Ficheiro de configuração personalizado do qBittorrent | — | `-qbconfig D:\path\qBittorrent.ini` |
| Configurar o qBittorrent | `-configure` | `-configure` |
| Restaurar a instalação anterior | `-rollback` | `-rollback` |
| Desinstalação completa (sem cópias do instalador) | `-uninstall -purge` | `-uninstall -purge` |
| Ajuda | `-help` | `-help` |
| Selecionar contentor Docker | `--container=NAME` | — |
| Listar contentores Docker | `--list-containers` | — |
| Caminho do anfitrião montado como `/config` | `--config-root=/path` | — |

</details>

<details>
<summary><b>Notas: (clique para expandir)</b></summary>

- Sem `-dev`, é usado o GitHub Release estável e verificado de `main`; com `-dev`, a versão atual de `dev` identificada pelo SHA Git exato.
- `-o` significa **output**. No Linux pode repeti-lo para atualizar várias pastas WebUI existentes com uma única transferência verificada.
- As cópias de segurança ficam em `~/.config/weig-qb-webui/backups/`, guardando as três mais recentes por destino.
- `-configure` ativa **Use alternative WebUI** e define **Files location** no qBittorrent. Só funciona com um destino de cada vez.
- `-rollback` restaura a última cópia do instalador para o destino escolhido. Pode repetir `-o` para repor vários destinos específicos.
- `-uninstall -purge` remove a WebUI e as cópias / o estado de restauro do destino, sem afetar outras instalações. A pasta partilhada é apagada quando fica vazia.
- Para guardar as cópias e poder usar `-rollback` mais tarde, retire `-purge` ao desinstalar.
- `-version 1.2.0` instala um GitHub Release específico. Se não existir, dá erro e **não muda automaticamente para latest ou dev**.
- `-help` mostra as opções suportadas.
- Se houver vários contentores Docker, use `--list-containers` e `--container=NAME`, ou `--config-root=/path` para o diretório de configuração no anfitrião.

### Versão específica e diretório de instalação

Linux:

```sh
sh install.sh -version 1.2.0 -o /opt/weig-qb-webui -configure
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -version 1.2.0 -o D:\weig-qb-webui -configure
```

### Restauro

Restauro:

```sh
sh install.sh -rollback
```

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -rollback
```

</details>

## Desinstalação com um comando

<details>
<summary><b>Desinstalação completa em Linux / NAS, Docker e Windows PowerShell</b></summary>

Por predefinição, recomendamos a **desinstalação completa sem manter cópias do instalador**: remove o WebUI, desativa a interface alternativa correspondente, elimina as cópias / estado de rollback pertencentes a esse destino e, por fim, remove o script de instalação transferido no diretório atual.

### Linux / NAS

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Para um caminho personalizado, acrescente `-o /path/to/weig-qb-webui`.

### Docker

Um contentor / deteção automática:

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

Vários contentores:

```sh
sh install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./install.sh
```

Ao usar `--config-root`:

```sh
sh install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\install.ps1 -Force }
```

Para um caminho personalizado, acrescente `-o D:\weig-qb-webui`.

`-purge` elimina apenas as cópias pertencentes ao destino que está a ser desinstalado e não afeta outras instalações. Se o diretório de estado partilhado ficar vazio, `~/.config/weig-qb-webui` no Linux (root: `/root/.config/weig-qb-webui`) ou `%APPDATA%\weig-qb-webui` no Windows também é removido.

Para manter as cópias e poder usar `-rollback` mais tarde, basta omitir `-purge`.

</details>

## Mais ajuda

Para Docker, NAS, caminhos personalizados, atualizações e instalação manual, consulte [Instalação, atualização e implementação manual](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.pt.md).

## Licença

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE).

Copyright © 2026 Wei.G / WeiG Share.
