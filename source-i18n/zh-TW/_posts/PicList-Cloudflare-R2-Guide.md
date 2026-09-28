---
title: "用 PicList + Cloudflare R2 搭建免費高速圖床"
date: 2026-07-08 21:10:08
tags:
  - Hexo
  - PicList
  - Cloudflare
  - R2
  - 圖床
categories:
  - 網站搭建
cover: https://img.weigshare.com/img/001.PicList-Cloudflare-R2-Guide_cover.png
description: "新手也能照著完成的 PicList + Cloudflare R2 圖床設定教學，支援自訂網域與全球 CDN 加速。"
---

# 前言

PicList 現在對 Cloudflare R2 的支援已經相當完整，不過第一次設定時還是有幾個地方容易踩雷：

- 設定欄位不少，新手很容易把參數填錯位置。
- 目前沒有專門的連線測試按鈕。
  - 最直接的驗證方式，就是實際上傳一張圖片。

這篇文章會一步一步說明如何把 **PicList** 接到 **Cloudflare R2**，作為速度快、可搭配自訂網域與 CDN 的圖床。

如果 R2 儲存桶還沒建立，可以先參考：

- **[Cloudflare R2 教學](https://www.fecify.com/doc/cn-1.0/fecify-shop-helper-cloudflare-r2.html)**

本文使用的 PicList 版本為 **v3.5.0（2026 年 7 月）**。

---

最近將部落格圖片遷移到了 **Cloudflare R2**，搭配 **PicList** 使用，效果非常不錯：

優點：

✅ 免費  ✅ 穩定  ✅ 高速  ✅ 自訂網域  ✅ 全球 CDN 加速  ✅ VPS 零壓力

---

# 設定 PicList

- 圖床：用於圖片上傳
- 雲端：用於 PicList 存取 Cloudflare 的圖床

## 圖床設定

在左側導覽視窗【**圖床**】-【**AWS S3**】-【**新增設定**】：

<img src="https://img.weigshare.com/img/001.002_PicList_orign.png" width="120"/>

### 必填項

    ● 設定名稱：任意
    ● AccessKeyId：18e1************************c0858
    ● secretAccessKey：c8a3********************************************************fa6e
    ● 自訂節點：https://770*************************39d8.r2.cloudflarestorage.com

以上均可在此取得：[API 圖示](https://img.weigshare.com/img/001.005_CF_API_token.png)。

* 權限：**管理員讀和寫**（否則 **PicList** 雲端存取會失敗）
* 金鑰只顯示一次，記得保存，否則需要重新建立。

● Bucket（儲存桶）：我的名稱是 **hexo-img**。[圖示](https://img.weigshare.com/img/001.003_CDF_bucket.png)

---

### 非必需項

■ 上傳路徑：**/**（根目錄）

我想放在 **img** 目錄下，因此設定為 **/img/**。[圖示](https://img.weigshare.com/img/001.004_Directory.png)

● 自訂網域：https://img.weigshare.com/  
（綁定網域後才能設定，上傳後即可取得對應網域的連結。）[圖示](https://img.weigshare.com/img/001.004_Directory.png)

```shell
https://img.weigeshare.com/img/x.png
```

☐ 若不設定，可能取得以下連結，而且可能無法直接開啟：

```text
    https://770*************************39d8.r2.cloudflarestorage.com/img/0.%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-07-08%20181820.png
```

☐ Region：**auto**（或 us-east-1）

* 上傳資源的存取策略：<span style="color:#ff69b4;font-weight:bold;">public-read</span>（官方建議）

---

## 雲端設定

在左側導覽視窗【**雲端**】-【**S3 API**】-【**新增設定**】-【**保存**】：

<img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration1.png" height="280"/> <img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration2.png" height="280"/>

### 必填項

    ● 設定名稱：任意
    ● Access Key Id：18e1************************c0858
    ● Access Key Secret：c8a3********************************************************fa6e
    ● endpoint 自訂節點：https://770*************************39d8.r2.cloudflarestorage.com

API Token 可在此取得：[API](https://img.weigshare.com/img/001.005_CF_API_token.png)。

* 權限：**管理員讀和寫**（否則 **PicList** 雲端存取會失敗）

● 儲存桶名稱（Bucket）：**hexo-img**。[圖示](https://img.weigshare.com/img/001.003_CDF_bucket.png)

■ 起始目錄：**/**

* 我想儲存在 **/img/** 目錄下：[圖示](https://img.weigshare.com/img/001.004_Directory.png)

### 非必需項

■ 上傳檔案權限：public-read（公開讀取，官方建議）

---

# 常見問題

## 上傳成功但圖片打不開

檢查：

- Bucket 是否允許公開存取
- 自訂網域是否已綁定
- DNS 解析是否已生效

## 出現 AccessDenied

檢查：

- Access Key ID 是否正確
- Secret Access Key 是否正確
- API Token 是否具有讀寫權限

## 出現 SignatureDoesNotMatch

檢查：

- Endpoint 是否填寫正確

# 總結

目前我的部落格方案：

```text
 Hexo + Butterfly + Github + Cloudflare R2 + Cloudflare CDN
```

如果你正在尋找一個長期穩定的部落格圖床方案，PicList + Cloudflare R2 非常值得嘗試。
