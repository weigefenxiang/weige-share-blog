---
title: "WeiG qB WebUI：qBittorrent の「別のWebUI」初心者向け導入ガイド"
date: 2026-09-28 17:15:00
tags:
  - qBittorrent
  - WebUI
  - NAS
  - Docker
categories:
  - qBittorrent
cover: https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif
description: "qBittorrent の「別のWebUI」として WeiG qB WebUI を導入する手順を、Windows・Linux・NAS・Docker のパスの違いも含めて初心者向けに説明します。"
---

qBittorrent を普段ブラウザーから管理しているなら、特に **NAS、Docker、スマートフォン** で使う場面では、WeiG qB WebUI にすると日常の操作がかなり楽になります。<strong><a href="https://weigefenxiang.github.io/WeiG-qB-WebUI/">オンラインプレビュー</a></strong>

約7年前、いくつかのプライベートトラッカーに参加しました。当時 NAS にインストールした qBittorrent 4.1.9 は、その時点での最新版。まさか今でも使っているとは思いませんでした。

一度だけ大きなアップグレードを試したことがあります（たしか 4.2.5 だったはずです）。ところがクライアントから torrent のジョブが消えてしまい、シードを続けられなくなりました。長年ため込んだジョブの復旧は大変で、それ以来、安定した環境をむやみに更新しなくなりました。

卒業して働き始めてからは、PC に向かう時間が減り、NAS の管理もほとんどスマートフォンです。ただ、標準の WebUI は小さな画面では使いづらいもの。ほかの代替 WebUI も試しましたが、古い qBittorrent ではうまく動かないものが少なくありませんでした。

そんな経験から作り始めたのが WeiG qB WebUI です。qBittorrent 4.1.x～5.2.x の幅広い安定版を対象にしています。互換性の問題や改善案があれば、ぜひコメントで教えてください。

**WeiG qB WebUI** は qBittorrent の **「別のWebUI」** として使える、デスクトップ・モバイル両対応のインターフェースです。

- 📱 スマートフォン向けレスポンシブ表示
- 🌙 ダークモード
- 🧱 古い qBittorrent バージョンにも対応
- ✅ **qBittorrent 4.1.x → 5.2.x** をサポート
- 🐳 Windows、Linux、Docker、NAS に対応

[プロジェクト](https://github.com/weigefenxiang/WeiG-qB-WebUI)

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/-Shell-8A2BE2?logo=gnubash&logoColor=white" alt="Shell">
</div>

## 画面プレビュー

### デスクトップ

<p align="center">
  <img src="https://img.weigshare.com/img/004.001.weig-qb-webui-desktop-overview.gif" alt="WeiG qB WebUI デスクトップ画面" style="display:block;width:100%;max-width:900px;height:auto;margin:0 auto;">
</p>


### モバイル

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
    <img src="https://img.weigshare.com/img/004.002.weig-qb-webui-mobile-overview.gif" alt="WeiG qB WebUI スマートフォンでの操作デモ">
    <img src="https://img.weigshare.com/img/004.003.weig-qb-webui-mobile-overview.png" alt="WeiG qB WebUI スマートフォンの画面プレビュー">
  </div>
</div>

## 初心者向けインストール

<details>
<summary><b>初めてインストールしますか？1分ガイドを展開</b></summary>

### 1. ZIP を展開

最新の正式版 [**weig-qb-webui.zip**](https://github.com/weigefenxiang/WeiG-qB-WebUI/releases/latest/download/weig-qb-webui.zip) をダウンロードして展開します。最初から次のフォルダー構成になっているので、名前の変更は不要です。

```text
weig-qb-webui/
├── public/
├── private/
├── VERSION
└── GIT_SHA
```

**`weig-qb-webui` フォルダー全体**が WebUI のルートです。`public` や `private` だけをコピーしないでください。

### 2. 固定した場所へ移動

`weig-qb-webui` フォルダー全体を、あとで誤って削除しない場所へ移動します。例：

```text
Windows：D:\weig-qb-webui
Linux：  /opt/weig-qb-webui
```

このディレクトリを qBittorrent に指定します。

### 3. qBittorrent で有効化

qBittorrent を開きます。

**ツール → オプション... → WebUI**

これは現在の qBittorrent 日本語公式 UI の用語です。続いて：

1. **別のWebUIを使用する** を有効にします。
2. **ファイルの場所:** を探します。
3. 保存した `weig-qb-webui` フォルダーのパスを入力します。

Windows の例：

```text
D:\weig-qb-webui
```

通常の Linux の例：

```text
/opt/weig-qb-webui
```

4. **OK** を押して保存します。
5. qBittorrent WebUI のページを再読み込みします。古い画面が残る場合は `Ctrl + F5` を試してください。

> **パスが正しいか確認する方法：** 指定したディレクトリの直下に `public`、`private`、`VERSION` などが見える必要があります。さらにもう一つ `weig-qb-webui` フォルダーへ入らないと見えない場合は、パスの階層がずれています。

> **Docker ユーザー：** qBittorrent はコンテナー内で動作するため、通常はホスト側の実パスをそのまま指定できません。下の **Docker** ガイドを参照してください。

</details>

## ワンクリックインストール

Linux / NAS 用のインストーラーは下の固定 Dev Pages URL から取得します。**URL 自体はインストールする版を決めません。** `-dev` なしなら `main` の検証済み GitHub Release、`-dev` 付きなら現在の `dev` の exact-SHA 版を使用します。スクリプトは現在のディレクトリに残り、更新やロールバックにも使えます。

### Linux / NAS

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

<details>
<summary><b>スクリプトの場所と既定の WebUI インストール先を表示</b></summary>

```text
./install.sh
```

WebUI 本体の既定インストール先：

```text
~/.local/share/weig-qb-webui
```

`root` ユーザーで実行する場合は通常：

```text
/root/.local/share/weig-qb-webui
```

</details>

### Docker

<details>
<summary><b>Docker ワンクリック / 複数コンテナー / パス説明（初心者向け）</b></summary>

#### 「ホスト」と「コンテナー」

VPS、Linux サーバー、Synology、QNAP などで Docker を使用している場合：

- **ホスト**：Docker を実際に動かしている Linux / NAS。本体側のシステムです。
- **コンテナー**：Docker が qBittorrent 用に作る独立した実行環境です。qBittorrent はコンテナー内のパスを参照します。

たとえば次のマウントがあるとします。

```text
ホスト：      /root/qbittorrent/config
   ↓ マウント
コンテナー：  /config
```

Docker Compose では一般に：

```yaml
volumes:
  - /root/qbittorrent/config:/config
```

左側が**ホストパス**、右側が**コンテナーパス**です。

WebUI がホスト側の：

```text
/root/qbittorrent/config/weig-qb-webui
```

にある場合、qBittorrent の **ファイルの場所:** には：

```text
/config/weig-qb-webui
```

を指定します。ホストパスをそのまま指定しないでください。

#### 1つだけ qBittorrent コンテナーがある場合

```sh
curl -fsSL https://weigefenxiang.github.io/WeiG-qB-WebUI/downloads/dev/install.sh -o install.sh && sh install.sh -configure
```

インストーラーが実行中の qBittorrent コンテナーと `/config` マウントを検出し、適切なホスト側の場所へ WebUI を配置して設定を行います。

#### コンテナー名を確認する

```sh
sh install.sh --list-containers
```

Docker 自体でも確認できます。

```sh
docker ps
```

名前が `qbittorrent` の場合：

```sh
sh install.sh --container=qbittorrent -configure
```

#### 複数の qBittorrent コンテナーがある場合

```text
qbittorrent
qbittorrent-test
```

まず一覧を表示：

```sh
sh install.sh --list-containers
```

使用するコンテナーを明示します。

```sh
sh install.sh --container=qbittorrent -configure
```

テスト用なら：

```sh
sh install.sh --container=qbittorrent-test -configure
```

複数ある場合、インストーラーは勝手に選択しません。

#### ホスト側の `/config` ディレクトリが分かっている場合

```sh
sh install.sh --config-root=/root/qbittorrent/config -configure
```

Synology の例：

```sh
sh install.sh --config-root=/volume1/docker/qbittorrent -configure
```

その他の NAS の例：

```sh
sh install.sh --config-root=/share/Container/qbittorrent -configure
```

実際の環境のパスへ置き換えてください。

#### WebUI のパスを指定する

```sh
sh install.sh --container=qbittorrent -o /config/weig-qb-webui -configure
```

インストーラーが `/config/...` を対応するホスト側パスへ変換します。

#### ケース 6：既存の WebUI を複数まとめて更新

qBittorrent を複数運用している場合は `-o` を繰り返し指定できます。パッケージのダウンロードと検証は一度だけ行い、すべてのターゲットを準備してから切り替えます。バックアップは `~/.config/weig-qb-webui/backups/` に対象ごとに直近 3 件ずつ保存します。

```sh
sh install.sh -dev \
  -o /root/qbittorrent/config/weig-qb-webui \
  -o /root/qbittorrent3/config/weig-qb-webui
```

複数ターゲットの場合は `-configure` を付けないでください。各インスタンスは既存の WebUI パスを使い続けます。詳しくは `sh install.sh -help` をご覧ください。

#### インストール後の確認

成功すると、次のようなパスが表示されます。前者はホストの保存先、後者は qBittorrent の「Files location」に指定するコンテナー内のパスです。

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
<summary><b>インストール先を表示</b></summary>

```text
C:\Users\<ユーザー名>\AppData\Local\weig-qb-webui
```

</details>

## よく使うオプション

<details>
<summary><b>Linux と Windows でオプション名は共通です。PowerShell は大文字・小文字を区別しません（クリックして展開）</b></summary>

PowerShell のパラメーター名は大文字・小文字を区別しません。

| 用途 | Linux / Docker / NAS | Windows PowerShell |
|---|---|---|
| 最新正式版 | 既定、引数不要 | 既定、引数不要 |
| 正式版を指定 | `-version 1.2.0` | `-version 1.2.0` |
| 開発版 | `-dev` | `-dev` |
| インストール先を指定 | `-o /path` （Linux では複数指定可） | `-o D:\path` または `-output D:\path` |
| qBittorrent の設定ファイルを指定 | — | `-qbconfig D:\path\qBittorrent.ini` |
| qBittorrent を自動設定 | `-configure` | `-configure` |
| 前回のインストールへ戻す | `-rollback` | `-rollback` |
| 完全アンインストール（バックアップを残さない） | `-uninstall -purge` | `-uninstall -purge` |
| ヘルプ | `-help` | `-help` |
| Docker コンテナー指定 | `--container=NAME` | — |
| Docker コンテナー一覧 | `--list-containers` | — |
| Docker `/config` のホストパス指定 | `--config-root=/path` | — |

</details>

<details>
<summary><b>説明：（クリックして展開）</b></summary>

- `-dev` がなければ `main` の検証済み GitHub Release、あれば現在の `dev` を exact SHA で指定した開発版をインストールします。
- `-o` は **output** の略。Linux では繰り返し指定でき、複数の既存 WebUI を一度のダウンロードで更新できます。
- バックアップは `~/.config/weig-qb-webui/backups/` に保存され、インストール先ごとに直近 3 件のみ保持します。
- `-configure` は qBittorrent の **Use alternative WebUI** と **Files location** を設定します。複数ターゲットとの併用はできません。
- `-rollback` で選択先の最新バックアップに戻せます。`-o` を繰り返せば複数の明示した対象もまとめてロールバックできます。
- `-uninstall -purge` は対象の WebUI、バックアップ、ロールバック情報を削除します。ほかのインストール先には影響せず、共有状態ディレクトリも空になれば削除します。
- 後で `-rollback` する可能性があるなら、アンインストール時は `-purge` を外してください。
- `-version 1.2.0` のように GitHub Release を指定できます。存在しなければエラーとなり、**latest や dev には自動的に切り替わりません**。
- `-help` で現在利用できるオプションを確認できます。
- Docker コンテナーが複数なら `--list-containers` で確認し、`--container=NAME` で選択します。ホスト側の設定ディレクトリが分かれば `--config-root=/path` も使えます。

### バージョンと保存先を同時指定

Linux：

```sh
sh install.sh -version 1.2.0 -o /opt/weig-qb-webui -configure
```

Windows：

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -version 1.2.0 -o D:\weig-qb-webui -configure
```

### ロールバック

Linux：

```sh
sh install.sh -rollback
```

Windows：

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -rollback
```

</details>

## ワンクリックアンインストール

<details>
<summary><b>Linux / NAS、Docker、Windows PowerShell の完全アンインストール</b></summary>

既定では**インストーラーバックアップを残さない完全アンインストール**を推奨します。WebUI を削除し、対象の代替 WebUI 設定を無効化し、その対象に属する installer-owned backups / rollback 状態を削除した後、現在のディレクトリにあるインストーラースクリプトも削除します。

### Linux / NAS

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

カスタムインストール先では `-o /path/to/weig-qb-webui` を追加してください。

### Docker

単一コンテナを自動検出：

```sh
sh install.sh -uninstall -configure -purge && rm -f -- ./install.sh
```

複数コンテナ：

```sh
sh install.sh -uninstall -configure -purge --container=qbittorrent && rm -f -- ./install.sh
```

`--config-root` を使う場合：

```sh
sh install.sh -uninstall -configure -purge --config-root=/path/to/qbittorrent/config && rm -f -- ./install.sh
```

### Windows PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -uninstall -configure -purge; if ($LASTEXITCODE -eq 0) { Remove-Item .\install.ps1 -Force }
```

カスタムインストール先では `-o D:\weig-qb-webui` を追加してください。

`-purge` は現在のアンインストール対象に属するバックアップだけを削除し、他のインストールには触れません。共有状態ディレクトリが空になれば、Linux の `~/.config/weig-qb-webui`（root は `/root/.config/weig-qb-webui`）または Windows の `%APPDATA%\weig-qb-webui` も削除されます。

後で `-rollback` できるようバックアップを残す場合は、`-purge` を外してください。

</details>

## 詳細ヘルプ

Docker、NAS、カスタムパス、更新、手動展開については [インストール・更新・手動展開](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/translations/installation-guide/deployment-guide.ja.md) を参照してください。

## ライセンス

[GNU General Public License v3](https://github.com/weigefenxiang/WeiG-qB-WebUI/blob/main/LICENSE) の下で公開されています。

Copyright © 2026 Wei.G / WeiG Share。
