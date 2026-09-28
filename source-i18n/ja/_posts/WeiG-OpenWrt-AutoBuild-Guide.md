---
title: "OpenWrt ファームウェアをクラウドで自作する：初心者向けガイド"
date: 2026-08-01 20:11:00
sticky: 100
tags:
  - OpenWrt
  - ImmortalWrt
  - GitHub Actions
  - ファームウェアビルド
categories:
  - OpenWrt
cover: https://img.weigshare.com/img/003.001.WeiG-OpenWrt-AutoBuild-Guide.png
description: "ローカルにビルド環境を用意せず、Wei.G OpenWrt オンラインカスタマイザーと GitHub Actions で自分用のファームウェアをクラウドビルドします。"
---

自分のルーターに合わせた OpenWrt ファームウェアが欲しくても、最初からローカルに重いビルド環境を用意する必要はありません。[Wei.G オンラインカスタマイザー](https://www.weigshare.com/wrt) でソース、ターゲット、パッケージ、各種設定を選び、GitHub Actions に送信すれば、あとはクラウド側のビルドを待つだけです。

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/JavaScript-ES2020-f7df1e?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/HTML-5-e34f26?logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/CSS-3-1572b6?logo=css3&logoColor=white" alt="CSS">
  <img src="https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Bash-5-4eaa25?logo=gnubash&logoColor=white" alt="Bash">
  <img src="https://img.shields.io/badge/YAML-1.2-cb171e?logo=yaml&logoColor=white" alt="YAML">
</div>

## クイックスタート

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">ファームウェアの書き込みにはリスクがあります。ルーターの型番、パーティション構成、書き込み方法を事前に確認してください。不明な場合は書き込まないでください。</span>

- **[GitHub](https://github.com/)** にログイン
- **[Wei.G オンラインカスタマイザー](https://www.weigshare.com/wrt)** を開く
- 初めての方は下の手順を確認してください👇

## 背景

- **【始めやすさ】** 自分でファームウェアをビルドしてみたいけれど、まずローカル環境を整えるところで止まりたくない人向けの入口です。
- **【パッケージと依存関係】** 一部のプラグインや依存関係は、利用する前にファームウェアへ組み込んでビルドする必要があります。
- **【設定の手間】** OpenWrt のビルド設定は項目が多く、中国本土のネットワーク環境では依存ファイルの取得がさらに面倒になることがあります。
- **【時間】** フルビルドには数時間かかることがあり、それでも失敗する場合があります。原因調査にも時間が必要です。
- **【今後】** 将来的には、誰でもプロジェクトを Fork して GitHub **Pages + Actions** 上に自分専用の OpenWrt ビルドサイトを持てる形を目指しています。
- **【現在】** まだテスト段階なので不具合が残っている可能性があります。また、共有ワークフローを大量に使うと GitHub のポリシーや利用枠に触れる可能性があります。

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.009.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.010.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 対応対象

現在は以下の対象のみ確認済みです。その他の機種は未検証です。復旧手段がない場合は使用しないでください。

- **ソース：[OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)**
- **x86 / 64**
- PC・スマートフォンの両方からアクセス可能

## 準備

<span style="color:#ffc107;">⚠️ </span> <span style="color:#ff7b72;">ファームウェアの書き込みにはリスクがあります。ルーターの型番、パーティション構成、書き込み方法を事前に確認してください。不明な場合は書き込まないでください。</span>

- **[GitHub](https://github.com/)** アカウントにログインします。アカウントがないとビルドできません。
- **[Wei.G オンラインカスタマイザー](https://www.weigshare.com/wrt)** を開きます。
  - **[Cloudflare dev ページ](https://dev.weig-wrt.pages.dev/)**（実験機能。最新機能を試せますが bug が含まれる可能性があります）

<!-- スクリーンショット 1：ホーム画面。Source、Branch、Target、プラグイン領域を表示 -->

## 1. パラメータを選ぶ

- ソースを選んだ後、検索欄で対応する機種や環境を検索します。config を読み込むこともできます。
- **Source → Branch → Target System → Subtarget → Target Profile** の順に選択します。
  - x86/64 の例：**ImmortalWrt → openwrt-24.10 → x86 → 64 → Generic x86/64**

- **Advanced menuconfig › LuCI › 3. Applications** で必要なアプリケーションを選択します。
- **Advanced menuconfig** のその他の詳細設定は必要に応じて調整してください。

続いて、**タイムゾーン**、**ファームウェアテーマ**、**NTP サーバー**、**パッケージミラー**も必要に応じて設定します。

<div style="display:flex; gap:10px;">

<img src=https://img.weigshare.com/img/003.002.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.003.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.004.WeiG-OpenWrt-AutoBuild-Guide.png height="150">

</div>

### 既存設定を使う

`.config`、`config.buildinfo`、以前ダウンロードしたリクエストファイルがある場合は、画面下部の **設定を読み込む** をクリックします。確認画面でソース、ブランチ、Target Profile、プラグイン、ファームウェア設定を確認してください。

## 2. ビルドを送信する

右下の **クラウドビルドを送信** をクリックします。

**リクエストをダウンロードして GitHub を開く** を選ぶと、JSON ファイルがダウンロードされ、GitHub の新規 Issue ページが自動で開きます。

ダウンロードしたファイルを Issue の入力欄へ移動し、そのまま **Create** をクリックします。

Bot が Issue 内に今回のビルド用 Actions リンクを返信します。

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.005.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.006.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## 3. ファームウェアをダウンロードする

ビルドには通常 2～4 時間かかります。完了後、Actions ページ下部の **Artifacts** からダウンロードします。

- `FIRMWARE-ALL-XXX`：すべてのファームウェアとチェックサム。初回書き込みでは通常 `factory` などのファイルを使います。
- `CONFIG-XXX`：今回送信した設定、最終設定、差分。保存しておくことを推奨します。
- `BUILD-LOGS-XXX`：完全なビルドログ。トラブルシューティングに使用します。

<div style="display:flex; gap:10px;">
<img src=https://img.weigshare.com/img/003.007.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
<img src=https://img.weigshare.com/img/003.008.WeiG-OpenWrt-AutoBuild-Guide.png height="150">
</div>

## よくある質問

- **ビルドに失敗したら？** `BUILD-LOGS-…` をダウンロードし、最後に出た `Error` を確認してください。Issue で報告することもできます。
- **キャンセル方法は？** 自分のビルド Issue に `/cancel` と返信します。
- **同時に何件ビルドできますか？** 1 アカウントにつき同時に 2 件までです。それを超えると待機になります。
- **ダウンロードボタンがないのはなぜ？** GitHub の Artifacts は通常、ログインしていないとダウンロードできません。
- **公開リポジトリの待ち時間が長い？** 将来的には [このプロジェクトを Fork](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild) し、画面の案内に従って自分のリポジトリでビルドを実行できるようにする予定です。これにより共有キューの影響を避けられます。

プロジェクト：[WeiG-OpenWrt-AutoBuild](https://github.com/weigefenxiang/WeiG-OpenWrt-AutoBuild)

## 謝辞

- **ソース：** [OpenWrt](https://github.com/openwrt/openwrt) · [ImmortalWrt](https://github.com/immortalwrt/immortalwrt) · [LEDE](https://github.com/coolsnowwolf/lede) · [hanwckf](https://github.com/hanwckf/immortalwrt-mt798x)

- **参考：** [P3TERX](https://github.com/P3TERX/Actions-OpenWrt)

- **LuCI プラグインの作者の皆さん**

- **参加してくれたすべての方**
