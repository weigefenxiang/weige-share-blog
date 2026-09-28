---
title: "PicList + Cloudflare R2로 빠르고 무료인 이미지 호스팅 만들기"
date: 2026-07-08 21:10:08
tags:
  - Hexo
  - PicList
  - Cloudflare
  - R2
  - 이미지 호스팅
categories:
  - 웹사이트 구축
cover: https://img.weigshare.com/img/001.PicList-Cloudflare-R2-Guide_cover.png
description: "PicList와 Cloudflare R2를 연결해 사용자 지정 도메인과 글로벌 CDN을 활용하는 이미지 호스팅을 구성하는 초보자용 가이드입니다."
---

# 시작하기 전에

PicList는 Cloudflare R2를 꽤 잘 지원하지만, 처음 설정할 때는 몇 가지 헷갈리기 쉬운 부분이 있습니다.

- 입력해야 할 항목이 많아 값을 잘못 넣기 쉽습니다.
- 이 구성에는 별도의 연결 테스트 버튼이 없습니다.
  - 실제로 이미지를 한 장 업로드해 보는 것이 가장 확실한 확인 방법입니다.

이 글에서는 **PicList**를 **Cloudflare R2**에 연결하고, 사용자 지정 도메인과 CDN을 사용할 수 있는 이미지 호스팅으로 구성하는 과정을 차근차근 설명합니다.

R2 버킷을 아직 만들지 않았다면 다음 자료도 참고할 수 있습니다.

- **[Cloudflare R2 튜토리얼](https://www.fecify.com/doc/cn-1.0/fecify-shop-helper-cloudflare-r2.html)**

이 글에서 사용한 PicList 버전은 **v3.5.0(2026년 7월)** 입니다.

---

최근 블로그 이미지를 **Cloudflare R2**로 이전하고 **PicList**와 함께 사용하고 있는데 결과가 매우 좋습니다.

장점:

✅ 무료  ✅ 안정적  ✅ 빠름  ✅ 사용자 지정 도메인  ✅ 글로벌 CDN 가속  ✅ VPS 부하 없음

---

# PicList 설정

- 이미지 호스트: 이미지 업로드에 사용
- 클라우드: PicList에서 Cloudflare 버킷에 접근할 때 사용

## 이미지 호스트 설정

왼쪽 메뉴에서 【**이미지 호스트**】-【**AWS S3**】-【**새 설정**】을 선택합니다.

<img src="https://img.weigshare.com/img/001.002_PicList_orign.png" width="120"/>

### 필수 항목

    ● 설정 이름: 자유롭게 지정
    ● AccessKeyId: 18e1************************c0858
    ● secretAccessKey: c8a3********************************************************fa6e
    ● 사용자 지정 endpoint: https://770*************************39d8.r2.cloudflarestorage.com

위 값은 [API 이미지](https://img.weigshare.com/img/001.005_CF_API_token.png)에서 확인할 수 있습니다.

* 권한: **관리자 읽기 및 쓰기** (그렇지 않으면 PicList의 클라우드 접근이 실패합니다)
* 자격 증명은 한 번만 표시되므로 반드시 저장하세요. 잃어버리면 다시 생성해야 합니다.

● Bucket(버킷): 제 경우 **hexo-img**입니다. [이미지](https://img.weigshare.com/img/001.003_CDF_bucket.png)

---

### 선택 항목

■ 업로드 경로: **/** (루트 디렉터리)

저는 **img** 디렉터리 아래에 저장하므로 **/img/**를 사용합니다. [이미지](https://img.weigshare.com/img/001.004_Directory.png)

● 사용자 지정 도메인: https://img.weigshare.com/  
(도메인을 연결한 뒤 설정할 수 있으며 업로드 후 해당 도메인의 링크를 받을 수 있습니다.) [이미지](https://img.weigshare.com/img/001.004_Directory.png)

```shell
https://img.weigeshare.com/img/x.png
```

☐ 설정하지 않으면 다음과 같은 링크가 생성되며 직접 열리지 않을 수 있습니다.

```text
    https://770*************************39d8.r2.cloudflarestorage.com/img/0.%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-07-08%20181820.png
```

☐ Region: **auto** (또는 us-east-1)

* 업로드 리소스 접근 정책: <span style="color:#ff69b4;font-weight:bold;">public-read</span> (공식 권장)

---

## 클라우드 설정

왼쪽 메뉴에서 【**클라우드**】-【**S3 API**】-【**새 설정**】-【**저장**】을 선택합니다.

<img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration1.png" height="280"/> <img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration2.png" height="280"/>

### 필수 항목

    ● 설정 이름: 자유롭게 지정
    ● Access Key Id: 18e1************************c0858
    ● Access Key Secret: c8a3********************************************************fa6e
    ● endpoint / 사용자 지정 endpoint: https://770*************************39d8.r2.cloudflarestorage.com

API 토큰은 여기에서 발급받습니다: [API](https://img.weigshare.com/img/001.005_CF_API_token.png)

* 권한: **관리자 읽기 및 쓰기** (그렇지 않으면 PicList의 클라우드 접근이 실패합니다)

● 버킷 이름: **hexo-img**. [이미지](https://img.weigshare.com/img/001.003_CDF_bucket.png)

■ 시작 디렉터리: **/**

* 저는 **/img/** 디렉터리에 저장합니다. [이미지](https://img.weigshare.com/img/001.004_Directory.png)

### 선택 항목

■ 업로드 파일 권한: public-read (공개 읽기, 공식 권장)

---

# 자주 묻는 질문

## 업로드는 성공하지만 이미지가 열리지 않음

확인:

- Bucket이 공개 접근을 허용하는지
- 사용자 지정 도메인이 연결되어 있는지
- DNS가 정상적으로 적용되었는지

## AccessDenied가 표시됨

확인:

- Access Key ID가 올바른지
- Secret Access Key가 올바른지
- API Token에 읽기/쓰기 권한이 있는지

## SignatureDoesNotMatch가 표시됨

확인:

- Endpoint가 올바른지

# 정리

현재 제 블로그 구성:

```text
 Hexo + Butterfly + Github + Cloudflare R2 + Cloudflare CDN
```

장기적으로 안정적인 블로그 이미지 호스팅을 찾고 있다면 PicList + Cloudflare R2는 충분히 시도해볼 만한 조합입니다.
