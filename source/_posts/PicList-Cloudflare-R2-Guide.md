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

最大的痛点之一就是PicList的配置，起步较晚，配置比较繁琐，且没有测试键。

配置好了 **AWS S3** 图床后，云端按同样配置，却打不开，对小白很不友好，得去翻 **issue**

最近将博客图片迁移到了 **Cloudflare R2**，配合 **PicList** 使用，效果非常不错：

✅ 免费额度充足  
✅ 全球 CDN 加速  
✅ 支持自定义域名  
✅ 不占用 VPS 空间  
✅ 与 Hexo 完美搭配

---


---

# 配置 PicList
## 图床

在左边导航窗口【**图床**】-【**AWS S3**】-【**新增配置**】：

<img src="https://img.weigeshare.cc.cd/img/001.002_PicList_orign.png" width="150"/>





### 必填项目

    ● 配置名：任意
    ● 设定 AccessKeyld：18e1************************c0858
    ● 设定 secretAccessKey：c8a3********************************************************fa6e
    ● 设定 Bucket：
    ● 设定自定义节点：https://770*************************39d8.r2.cloudflarestorage.com

■ 设定上传路径：img（我根目录下 **img**）[图示](https://img.weigeshare.cc.cd/img/001.003_CDF_bucket.png)

    ●设定自定义域名：（绑定了域名才能设置，上传后就可拿到对应域名的链接 ）
 
```shell
https://img.weigeshare.com/img/x.png
```

☐ 不设置的话，拿到以下这种链接


```shell
    https://770*************************39d8.r2.cloudflarestorage.com/img/0.%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-07-08%20181820.png
```

☐ 设定 Region（例如: auto 或 us-east-1）：auto  
    （ **PicList** 填不填无所谓）

* 设定上传资源的访问策略：<span style="color:#ff69b4;font-weight:bold;">public-read</span>


---

# 总结

目前我的博客方案：

```text
Hexo
+
Butterfly
+
PicList
+
Cloudflare R2
+
Cloudflare CDN
```

优点：

✅ 免费  ✅ 稳定  ✅ 高速  ✅ 自定义域名  ✅ 全球 CDN 加速  ✅ VPS 零压力

如果你正在寻找一个长期稳定的博客图床方案，PicList + Cloudflare R2 非常值得尝试。
