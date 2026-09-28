---
title: "Criar um alojamento de imagens rápido e gratuito com PicList + Cloudflare R2"
date: 2026-07-08 21:10:08
tags:
  - Hexo
  - PicList
  - Cloudflare
  - R2
  - Hospedagem de imagens
categories:
  - Criação de sites
cover: https://img.weigshare.com/img/001.PicList-Cloudflare-R2-Guide_cover.png
description: "Guia para iniciantes para usar PicList com Cloudflare R2 como alojamento de imagens, com domínio próprio e distribuição através da CDN global."
---

# Antes de começar

O PicList já funciona muito bem com o Cloudflare R2, mas a primeira configuração ainda tem alguns pontos onde é fácil enganar-se:

- há vários campos e é fácil colocar um valor no sítio errado;
- não existe um botão específico para testar a ligação;
  - a forma mais segura de confirmar a configuração é fazer realmente o upload de uma imagem.

Este guia mostra, passo a passo, como ligar o **PicList** ao **Cloudflare R2** e utilizá-lo como alojamento de imagens rápido, com domínio personalizado e CDN.

Se ainda não criou o bucket R2, pode consultar também:

- **[Tutorial Cloudflare R2](https://www.fecify.com/doc/cn-1.0/fecify-shop-helper-cloudflare-r2.html)**

Versão do PicList utilizada: **v3.5.0 (julho de 2026)**.

---

Recentemente migrei as imagens deste blog para o **Cloudflare R2** e passei a usá-lo em conjunto com o **PicList**. O resultado tem sido muito bom.

Vantagens:

✅ Gratuito  ✅ Estável  ✅ Rápido  ✅ Domínio personalizado  ✅ CDN global  ✅ Sem carga no VPS

---

# Configurar o PicList

- Hospedagem de imagens: usada para enviar imagens
- Nuvem: usada para o PicList acessar o bucket do Cloudflare

## Configuração da hospedagem de imagens

Na navegação à esquerda, abra **Hospedagem de imagens** → **AWS S3** → **Nova configuração**:

<img src="https://img.weigshare.com/img/001.002_PicList_orign.png" width="120"/>

### Campos obrigatórios

    ● Nome da configuração: qualquer nome
    ● AccessKeyId: 18e1************************c0858
    ● secretAccessKey: c8a3********************************************************fa6e
    ● Endpoint personalizado: https://770*************************39d8.r2.cloudflarestorage.com

Esses dados podem ser obtidos aqui: [imagem da API](https://img.weigshare.com/img/001.005_CF_API_token.png).

* Permissão: **leitura e escrita de administrador** (caso contrário, o acesso do PicList à nuvem falhará).
* As credenciais são exibidas apenas uma vez. Salve-as, ou será necessário criá-las novamente.

● Bucket: no meu caso, **hexo-img**. [Imagem](https://img.weigshare.com/img/001.003_CDF_bucket.png)

---

### Campos opcionais

■ Caminho de upload: **/** (diretório raiz)

Quero armazenar os arquivos dentro da pasta **img**, então uso **/img/**. [Imagem](https://img.weigshare.com/img/001.004_Directory.png)

● Domínio personalizado: https://img.weigshare.com/  
(Pode ser configurado depois que o domínio for vinculado. Os arquivos enviados passarão a usar links nesse domínio.) [Imagem](https://img.weigshare.com/img/001.004_Directory.png)

```shell
https://img.weigeshare.com/img/x.png
```

☐ Sem configurar um domínio personalizado, você pode receber um link como este, que talvez não abra diretamente:

```text
    https://770*************************39d8.r2.cloudflarestorage.com/img/0.%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-07-08%20181820.png
```

☐ Region: **auto** (ou us-east-1)

* Política de acesso do objeto enviado: <span style="color:#ff69b4;font-weight:bold;">public-read</span> (recomendação oficial)

---

## Configuração da nuvem

Na navegação à esquerda, abra **Nuvem** → **S3 API** → **Nova configuração** → **Salvar**:

<img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration1.png" height="280"/> <img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration2.png" height="280"/>

### Campos obrigatórios

    ● Nome da configuração: qualquer nome
    ● Access Key Id: 18e1************************c0858
    ● Access Key Secret: c8a3********************************************************fa6e
    ● endpoint / endpoint personalizado: https://770*************************39d8.r2.cloudflarestorage.com

Obtenha o token da API aqui: [API](https://img.weigshare.com/img/001.005_CF_API_token.png).

* Permissão: **leitura e escrita de administrador** (caso contrário, o acesso do PicList à nuvem falhará).

● Nome do bucket: **hexo-img**. [Imagem](https://img.weigshare.com/img/001.003_CDF_bucket.png)

■ Diretório inicial: **/**

* Eu armazeno os arquivos em **/img/**. [Imagem](https://img.weigshare.com/img/001.004_Directory.png)

### Campos opcionais

■ Permissão dos arquivos enviados: public-read (leitura pública, recomendação oficial)

---

# Perguntas frequentes

## O upload funciona, mas a imagem não abre

Verifique:

- se o Bucket permite acesso público;
- se o domínio personalizado está vinculado;
- se a resolução DNS já entrou em vigor.

## Aparece AccessDenied

Verifique:

- se o Access Key ID está correto;
- se o Secret Access Key está correto;
- se o API Token tem permissão de leitura e escrita.

## Aparece SignatureDoesNotMatch

Verifique:

- se o Endpoint foi preenchido corretamente.

# Resumo

A pilha atual do meu blog:

```text
 Hexo + Butterfly + Github + Cloudflare R2 + Cloudflare CDN
```

Se você procura uma solução de hospedagem de imagens estável para uso de longo prazo em um blog, PicList + Cloudflare R2 vale muito a pena.
