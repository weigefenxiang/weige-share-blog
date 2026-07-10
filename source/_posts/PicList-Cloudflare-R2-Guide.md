---
title: 使用 PicList + Cloudflare R2 搭建免费高速图床
date: 2026-07-08 21:10:08
tags:
  - Hexo
  - PicList
  - Cloudflare
  - R2
  - 图床
categories:
  - 网站搭建
cover: https://img.weigeshare.cc.cd/img/001.PicList-Cloudflare-R2-Guide_cover.png
description: 使用 PicList 配合 Cloudflare R2 搭建免费、高速、全球 CDN 加速的图床。
---

# 前言

PicList 目前对 Cloudflare R2 的支持已经比较完善，但在配置过程中仍存在一些小问题： 
- 配置项较多，新手容易填错
- 缺少连接测试功能
- 配置是否正确只能通过实际上传验证

本文将介绍如何使用 PicList 连接 Cloudflare R2，实现免费、高速、支持 CDN 的图床方案。
Cloudflare R2 图床的搭建可参照
- [Cloudflare R2 教程](https://www.fecify.com/doc/cn-1.0/fecify-shop-helper-cloudflare-r2.html)

PicList 版本当前为26年7月v3.5.0

---

最近将博客图片迁移到了 **Cloudflare R2**，配合 **PicList** 使用，效果非常不错：

✅ 免费额度充足  ✅ 全球 CDN 加速  ✅ 支持自定义域名  ✅ 不占用 VPS 空间  ✅ 与 Hexo 完美搭配

---

# 配置 PicList

- 图床：用于图片上传6
- 云端：用于 PicList 访问CF的图床

## 图床配置

在左边导航窗口【**图床**】-【**AWS S3**】-【**新增配置**】：

<img src="https://img.weigeshare.cc.cd/img/001.002_PicList_orign.png" width="120"/>

### 必填项

    ● 配置名：任意
    ● 设定 AccessKeyId：18e1************************c0858
    ● 设定 secretAccessKey：c8a3********************************************************fa6e
    ● 设定自定义节点：https://770*************************39d8.r2.cloudflarestorage.com

以上均可在此获取 [API图示](https://img.weigeshare.cc.cd/img/001.005_CF_API_token.png)。

* 权限： **管理员读和写** （否则 **PicLlist** 云端访问失败）
* 只展示一次，记得保存，否则得重新弄。

● 设定 Bucket（存储桶）： （我的是**hexo-img** ）[图示](https://img.weigeshare.cc.cd/img/001.003_CDF_bucket.png)


 

---

### 非必需项

■ 设定上传路径：**/**（根目录）

我想放在目录 **img** 下： **/img/** [图示](https://img.weigeshare.cc.cd/img/001.004_Directory.png)


 ●设定自定义域名：  https://img.weigeshare.cc.cd/     （绑定了域名才能设置，上传后就可拿到对应域名的链接 ）[图示](https://img.weigeshare.cc.cd/img/001.004_Directory.png)

 ```shell
https://img.weigeshare.com/img/x.png
```

☐ 不设置的话，拿到以下这种链接，可能打不开

```text
    https://770*************************39d8.r2.cloudflarestorage.com/img/0.%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-07-08%20181820.png
```

☐ 设定 Region：**auto** （ 或 us-east-1）

* 设定上传资源的访问策略：<span style="color:#ff69b4;font-weight:bold;">public-read</span> （官方建议）
---
## 云端配置

在左边导航窗口【**云端**】-【**S3 API**】-【**新增配置**】-【**保存**】：

<img src="https://img.weigeshare.cc.cd/img/001.005_piclist_cloud_configuration1.png" height="280"/> <img src="https://img.weigeshare.cc.cd/img/001.005_piclist_cloud_configuration2.png" height="280"/>

### 必填项

    ● 配置别：任意
    ● Access Key Id：18e1************************c0858
    ● Access Key Secret：c8a3********************************************************fa6e
    ● endpoint 自定义节点：https://770*************************39d8.r2.cloudflarestorage.com

API令牌在此获取 [API](https://img.weigeshare.cc.cd/img/001.005_CF_API_token.png)。

* 权限： **管理员读和写** （否则 **PicLlist** 云端访问失败）

● 存储桶名（Bucket）： **hexo-img**  [图示](https://img.weigeshare.cc.cd/img/001.003_CDF_bucket.png)

■ 起始目录：**/**

* 我想储存在 **/img/** 目录下：[图示](https://img.weigeshare.cc.cd/img/001.004_Directory.png)


### 非必需项

■ 上传文件权限设置：public-read（公共读，官方建议 ）

---
# 常见问题

## 上传成功但图片打不开

检查：

- Bucket 是否允许公共访问
- 自定义域名是否已绑定
- DNS 解析是否生效

## 提示 AccessDenied

检查：

- Access Key ID 是否正确
- Secret Access Key 是否正确
- API Token 是否拥有读写权限

## 提示 SignatureDoesNotMatch

检查：

- Endpoint 是否填写正确

# 总结

目前我的博客方案：

```text
 Hexo + Butterfly + Github + Cloudflare R2 + Cloudflare CDN
```

优点：

✅ 免费  ✅ 稳定  ✅ 高速  ✅ 自定义域名  ✅ 全球 CDN 加速  ✅ VPS 零压力

如果你正在寻找一个长期稳定的博客图床方案，PicList + Cloudflare R2 非常值得尝试。
