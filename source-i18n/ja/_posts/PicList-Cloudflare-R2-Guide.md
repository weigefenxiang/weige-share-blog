---
title: "PicList + Cloudflare R2 で無料・高速な画像ホスティングを作る"
date: 2026-07-08 21:10:08
tags:
  - Hexo
  - PicList
  - Cloudflare
  - R2
  - 画像ホスティング
categories:
  - サイト構築
cover: https://img.weigshare.com/img/001.PicList-Cloudflare-R2-Guide_cover.png
description: "PicList と Cloudflare R2 を使い、独自ドメインと CDN に対応した高速な画像ホスティングを構築する初心者向けガイド。"
---

# はじめに

PicList は Cloudflare R2 にかなり対応していますが、初回設定ではいくつか迷いやすいポイントがあります。

- 入力項目が多く、値を入れる場所を間違えやすい。
- この構成専用の接続テスト機能がない。
  - そのため、実際に画像を 1 枚アップロードするのが一番確実な確認方法です。

この記事では **PicList** を **Cloudflare R2** に接続し、独自ドメインや CDN を使える画像ホスティングとして運用するまでを順番に説明します。

R2 バケットをまだ作っていない場合は、こちらも参考にしてください。

- **[Cloudflare R2 チュートリアル](https://www.fecify.com/doc/cn-1.0/fecify-shop-helper-cloudflare-r2.html)**

この記事で使用している PicList は **v3.5.0（2026 年 7 月）** です。

---

最近、このブログの画像を **Cloudflare R2** に移行し、**PicList** と組み合わせて使っています。使い勝手はとても良好です。

メリット：

✅ 無料  ✅ 安定  ✅ 高速  ✅ 独自ドメイン  ✅ グローバル CDN  ✅ VPS に負荷をかけない

---

# PicList の設定

- 画像ホスト：画像アップロード用
- クラウド：PicList から Cloudflare のバケットへアクセスするために使用

## 画像ホスト設定

左側ナビゲーションから【**画像ホスト**】-【**AWS S3**】-【**新しい設定**】を開きます。

<img src="https://img.weigshare.com/img/001.002_PicList_orign.png" width="120"/>

### 必須項目

    ● 設定名：任意
    ● AccessKeyId：18e1************************c0858
    ● secretAccessKey：c8a3********************************************************fa6e
    ● カスタムエンドポイント：https://770*************************39d8.r2.cloudflarestorage.com

これらは [API の図](https://img.weigshare.com/img/001.005_CF_API_token.png) から取得できます。

* 権限：**管理者の読み取り・書き込み**（不足していると PicList のクラウドアクセスに失敗します）
* 資格情報は一度しか表示されないため、必ず保存してください。紛失した場合は作り直す必要があります。

● Bucket（バケット）：私の場合は **hexo-img** です。[図](https://img.weigshare.com/img/001.003_CDF_bucket.png)

---

### 任意項目

■ アップロード先：**/**（ルート）

私は **img** ディレクトリ配下に保存したいので **/img/** にしています。[図](https://img.weigshare.com/img/001.004_Directory.png)

● カスタムドメイン：https://img.weigshare.com/  
（ドメインをバインドしてから設定できます。設定後はアップロードした画像の URL にそのドメインを使えます。）[図](https://img.weigshare.com/img/001.004_Directory.png)

```shell
https://img.weigeshare.com/img/x.png
```

☐ 設定しない場合、次のような URL が返り、直接開けないことがあります。

```text
    https://770*************************39d8.r2.cloudflarestorage.com/img/0.%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-07-08%20181820.png
```

☐ Region：**auto**（または us-east-1）

* アップロードしたオブジェクトの ACL：<span style="color:#ff69b4;font-weight:bold;">public-read</span>（公式推奨）

---

## クラウド設定

左側ナビゲーションから【**クラウド**】-【**S3 API**】-【**新しい設定**】-【**保存**】を開きます。

<img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration1.png" height="280"/> <img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration2.png" height="280"/>

### 必須項目

    ● 設定名：任意
    ● Access Key Id：18e1************************c0858
    ● Access Key Secret：c8a3********************************************************fa6e
    ● endpoint / カスタムエンドポイント：https://770*************************39d8.r2.cloudflarestorage.com

API トークンはこちらから取得します：[API](https://img.weigshare.com/img/001.005_CF_API_token.png)

* 権限：**管理者の読み取り・書き込み**（不足していると PicList のクラウドアクセスに失敗します）

● バケット名：**hexo-img**。[図](https://img.weigshare.com/img/001.003_CDF_bucket.png)

■ 開始ディレクトリ：**/**

* 私は **/img/** に保存しています。[図](https://img.weigshare.com/img/001.004_Directory.png)

### 任意項目

■ アップロードファイルの権限：public-read（公開読み取り、公式推奨）

---

# よくある質問

## アップロードには成功するが画像を開けない

確認項目：

- Bucket で公開アクセスが許可されているか
- カスタムドメインをバインド済みか
- DNS が反映されているか

## AccessDenied と表示される

確認項目：

- Access Key ID が正しいか
- Secret Access Key が正しいか
- API Token に読み書き権限があるか

## SignatureDoesNotMatch と表示される

確認項目：

- Endpoint が正しいか

# まとめ

現在のブログ構成：

```text
 Hexo + Butterfly + Github + Cloudflare R2 + Cloudflare CDN
```

ブログ用に長く安定して使える画像ホスティングを探しているなら、PicList + Cloudflare R2 は十分試す価値があります。
