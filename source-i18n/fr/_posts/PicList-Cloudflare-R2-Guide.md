---
title: "Mettre en place un hébergement d’images rapide et gratuit avec PicList + Cloudflare R2"
date: 2026-07-08 21:10:08
tags:
  - Hexo
  - PicList
  - Cloudflare
  - R2
  - Hébergement d’images
categories:
  - Création de site
cover: https://img.weigshare.com/img/001.PicList-Cloudflare-R2-Guide_cover.png
description: "Guide pour débutants afin d’utiliser PicList avec Cloudflare R2 comme hébergement d’images, avec domaine personnalisé et diffusion via CDN mondial."
---

# Avant de commencer

PicList fonctionne désormais très bien avec Cloudflare R2, mais la première configuration comporte encore quelques pièges classiques :

- il y a plusieurs champs à remplir et il est facile de placer une valeur au mauvais endroit ;
- il n’existe pas de bouton de test de connexion pour cette configuration ;
  - le moyen le plus fiable de vérifier les réglages reste donc d’envoyer réellement une image.

Ce guide explique pas à pas comment connecter **PicList** à **Cloudflare R2** et l’utiliser comme hébergement d’images rapide avec domaine personnalisé et CDN.

Si le bucket R2 n’est pas encore créé, vous pouvez aussi consulter :

- **[Tutoriel Cloudflare R2](https://www.fecify.com/doc/cn-1.0/fecify-shop-helper-cloudflare-r2.html)**

Version de PicList utilisée ici : **v3.5.0 (juillet 2026)**.

---

J’ai récemment migré les images du blog vers **Cloudflare R2** et je l’utilise avec **PicList**. Le résultat est très satisfaisant.

Avantages :

✅ Gratuit  ✅ Stable  ✅ Rapide  ✅ Domaine personnalisé  ✅ CDN mondial  ✅ Aucune charge sur un VPS

---

# Configurer PicList

- Hébergement d’images : utilisé pour envoyer les images
- Cloud : utilisé par PicList pour accéder au bucket Cloudflare

## Configuration de l’hébergement d’images

Dans la navigation de gauche, ouvrez **Hébergement d’images** → **AWS S3** → **Nouvelle configuration** :

<img src="https://img.weigshare.com/img/001.002_PicList_orign.png" width="120"/>

### Champs obligatoires

    ● Nom de la configuration : au choix
    ● AccessKeyId : 18e1************************c0858
    ● secretAccessKey : c8a3********************************************************fa6e
    ● Endpoint personnalisé : https://770*************************39d8.r2.cloudflarestorage.com

Ces informations sont disponibles ici : [capture de l’API](https://img.weigshare.com/img/001.005_CF_API_token.png).

* Autorisation : **lecture et écriture administrateur** (sinon l’accès Cloud de PicList échouera).
* Les identifiants ne sont affichés qu’une seule fois. Enregistrez-les, sinon il faudra les recréer.

● Bucket : le mien s’appelle **hexo-img**. [Capture](https://img.weigshare.com/img/001.003_CDF_bucket.png)

---

### Champs facultatifs

■ Chemin d’envoi : **/** (racine)

Je souhaite stocker les fichiers dans le dossier **img**, j’utilise donc **/img/**. [Capture](https://img.weigshare.com/img/001.004_Directory.png)

● Domaine personnalisé : https://img.weigshare.com/  
(Il peut être configuré après avoir associé le domaine. Les fichiers envoyés utiliseront alors des liens sous ce domaine.) [Capture](https://img.weigshare.com/img/001.004_Directory.png)

```shell
https://img.weigeshare.com/img/x.png
```

☐ Sans domaine personnalisé, un lien de ce type peut être renvoyé et il peut ne pas être accessible directement :

```text
    https://770*************************39d8.r2.cloudflarestorage.com/img/0.%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-07-08%20181820.png
```

☐ Region : **auto** (ou us-east-1)

* Politique d’accès des objets envoyés : <span style="color:#ff69b4;font-weight:bold;">public-read</span> (recommandation officielle)

---

## Configuration Cloud

Dans la navigation de gauche, ouvrez **Cloud** → **S3 API** → **Nouvelle configuration** → **Enregistrer** :

<img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration1.png" height="280"/> <img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration2.png" height="280"/>

### Champs obligatoires

    ● Nom de la configuration : au choix
    ● Access Key Id : 18e1************************c0858
    ● Access Key Secret : c8a3********************************************************fa6e
    ● endpoint / endpoint personnalisé : https://770*************************39d8.r2.cloudflarestorage.com

Obtenez le jeton API ici : [API](https://img.weigshare.com/img/001.005_CF_API_token.png).

* Autorisation : **lecture et écriture administrateur** (sinon l’accès Cloud de PicList échouera).

● Nom du bucket : **hexo-img**. [Capture](https://img.weigshare.com/img/001.003_CDF_bucket.png)

■ Répertoire de départ : **/**

* Je stocke les fichiers sous **/img/** : [Capture](https://img.weigshare.com/img/001.004_Directory.png)

### Champs facultatifs

■ Autorisation des fichiers envoyés : public-read (lecture publique, recommandation officielle)

---

# Questions fréquentes

## L’envoi réussit mais l’image ne s’ouvre pas

Vérifiez :

- que le bucket autorise l’accès public ;
- que le domaine personnalisé est bien associé ;
- que la résolution DNS est active.

## AccessDenied

Vérifiez :

- que l’Access Key ID est correct ;
- que le Secret Access Key est correct ;
- que le jeton API dispose des droits de lecture et d’écriture.

## SignatureDoesNotMatch

Vérifiez :

- que l’Endpoint est correct.

# Conclusion

La pile actuelle de mon blog :

```text
 Hexo + Butterfly + Github + Cloudflare R2 + Cloudflare CDN
```

Si vous recherchez une solution d’hébergement d’images stable sur le long terme pour un blog, PicList + Cloudflare R2 mérite vraiment d’être essayé.
