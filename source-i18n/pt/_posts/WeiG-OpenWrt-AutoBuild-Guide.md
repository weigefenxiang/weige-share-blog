---
title: "Criar o seu próprio firmware OpenWrt na cloud: guia para iniciantes"
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - Compilação de firmware
categories:
  - OpenWrt
cover: https://img.weigshare.com/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: "Crie uma imagem OpenWrt personalizada com o configurador online Wei.G e o GitHub Actions, sem instalar um ambiente de compilação local."
---

Quer um firmware OpenWrt ajustado ao seu router sem ter de preparar primeiro um ambiente completo de compilação no computador? Abra o [configurador online Wei.G](https://www.weigshare.com/wrt), escolha a origem, o alvo, os pacotes e as opções do firmware e envie o pedido para o GitHub Actions. A compilação fica a cargo da cloud.

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>

## Início rápido

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Gravar firmware envolve riscos. Confirme primeiro o modelo do roteador, o particionamento e o método de gravação. Se não tiver certeza, não faça o flash.</span>

- Entre no **[GitHub](https://github.com/)**
- Abra o **[personalizador online do Wei.G](https://www.weigshare.com/wrt)**
- Se for iniciante, consulte o tutorial abaixo 👇

## Contexto

- **【Um ponto de partida mais simples】** Para quem quer experimentar compilar firmware próprio sem começar por montar toda a toolchain local, este projeto oferece uma entrada mais acessível.
- **【Pacotes e dependências】** Alguns plugins e dependências precisam de ser integrados no firmware durante a compilação para poderem ser utilizados.
- **【Configuração】** O OpenWrt tem muitas opções de build e, na China continental, as condições de rede podem tornar a transferência das dependências ainda mais difícil.
- **【Tempo】** Uma compilação completa pode demorar várias horas e ainda assim falhar, pelo que a investigação dos erros também pode ser dispendiosa.
- **【Objetivo】** A longo prazo, a ideia é permitir que qualquer pessoa faça fork do projeto e mantenha o seu próprio site de compilação OpenWrt com GitHub **Pages + Actions**.
- **【Estado atual】** O projeto ainda está em testes. Podem existir bugs e uma utilização intensiva do workflow partilhado pode esbarrar nas políticas ou limites do GitHub.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.009.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Dispositivos suportados

No momento, apenas os alvos abaixo foram verificados. Outros dispositivos ainda não foram testados. Se você não tiver uma forma de recuperação, não use esta ferramenta.

- **Fontes: [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**
- Acesso por computador e celular

## Preparação

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">Gravar firmware envolve riscos. Confirme primeiro o modelo do roteador, o particionamento e o método de gravação. Se não tiver certeza, não faça o flash.</span>

- Entre em uma conta do **[GitHub](https://github.com/)**. Sem uma conta não é possível iniciar a compilação.
- Abra o **[personalizador online do Wei.G](https://www.weigshare.com/wrt)**.
  - **[Página Cloudflare dev](https://dev.weig-wrt.pages.dev/)** (recursos experimentais e novidades; pode conter bugs)

<!-- Captura 1: página inicial mostrando Source, Branch, Target e a área de plugins -->

## 1. Escolher parâmetros

- Depois de escolher a fonte, pesquise o modelo ou ambiente correspondente. Também é possível carregar uma config existente.
- Selecione **Source → Branch → Target System → Subtarget → Target Profile**.
  - Exemplo x86/64: **ImmortalWrt → openwrt-24.10 → x86 → 64 → Generic x86/64**

- Em **Advanced menuconfig › LuCI › 3. Applications**, marque os aplicativos desejados.
- Ajuste as demais opções de **Advanced menuconfig** conforme necessário.

Depois configure, se necessário, o **fuso horário**, o **tema do firmware**, os **servidores NTP** e o **mirror de pacotes**.

<div style="display:flex; gap:10px;">

<img src=https://img.weigshare.com/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="150">

</div>

### Configuração existente

Se você já tem um arquivo `.config`, `config.buildinfo` ou uma solicitação baixada anteriormente, clique em **Carregar configuração** na parte inferior. Na janela de confirmação, confira a fonte, a branch, o Target Profile, os plugins e as configurações do firmware.

## 2. Enviar a compilação

Clique em **Enviar compilação na nuvem** no canto inferior direito.

Escolha **Baixar solicitação e abrir GitHub**. O navegador baixará um arquivo JSON e abrirá automaticamente uma nova página de GitHub Issue.

Mova o arquivo baixado para a caixa do Issue e clique em **Create**.

O bot responderá no Issue com o link do Actions correspondente à compilação.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 3. Baixar o firmware

A compilação normalmente leva de 2 a 4 horas. Quando terminar, abra a página do Actions e baixe os itens em **Artifacts**:

- `FIRMWARE-ALL-XXX`: todos os arquivos de firmware e checksums. No primeiro flash normalmente você procurará um arquivo como `factory`.
- `CONFIG-XXX`: configuração enviada, configuração final e diferenças. Recomenda-se guardar.
- `BUILD-LOGS-XXX`: logs completos da compilação para diagnóstico.

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## Perguntas frequentes

- **E se a compilação falhar?** Baixe `BUILD-LOGS-…` e verifique o último `Error`. Também é possível relatar o problema no Issue.
- **Como cancelar?** Responda `/cancel` no seu Issue de compilação.
- **Quantas compilações podem rodar ao mesmo tempo?** Uma conta pode executar apenas duas tarefas simultaneamente; as demais precisam aguardar.
- **Por que não há botão de download?** O GitHub normalmente exige login para baixar Artifacts de Actions.
- **Fila muito longa no repositório público?** No futuro será possível [fazer fork deste projeto](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild) e executar as compilações no seu próprio repositório seguindo as instruções da página, evitando a fila compartilhada.

Projeto: [WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)

## Agradecimentos

- **Fontes:** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)

- **Referência:** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)

- **Autores dos plugins LuCI**

- **Todas as pessoas** que participaram do projeto
