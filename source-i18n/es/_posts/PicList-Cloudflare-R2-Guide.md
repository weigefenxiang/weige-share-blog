---
title: "Montar un alojamiento de imágenes rápido y gratuito con PicList + Cloudflare R2"
date: 2026-07-08 21:10:08
tags:
  - Hexo
  - PicList
  - Cloudflare
  - R2
  - Alojamiento de imágenes
categories:
  - Creación de sitios
cover: https://img.weigshare.com/img/001.PicList-Cloudflare-R2-Guide_cover.png
description: "Guía para principiantes para usar PicList con Cloudflare R2 como alojamiento de imágenes, con dominio propio y distribución mediante CDN global."
---

# Antes de empezar

PicList funciona bastante bien con Cloudflare R2, pero la primera configuración todavía tiene algunos puntos en los que es fácil equivocarse:

- Hay bastantes campos y es fácil colocar un valor en el sitio incorrecto.
- No existe un botón específico para probar la conexión.
  - La forma más fiable de comprobar la configuración es subir una imagen de verdad.

En esta guía veremos paso a paso cómo conectar **PicList** con **Cloudflare R2** y utilizarlo como alojamiento de imágenes rápido, con dominio personalizado y CDN.

Si todavía no has creado el bucket de R2, también puedes consultar:

- **[Tutorial de Cloudflare R2](https://www.fecify.com/doc/cn-1.0/fecify-shop-helper-cloudflare-r2.html)**

Versión de PicList utilizada: **v3.5.0 (julio de 2026)**.

---

Hace poco migré las imágenes del blog a **Cloudflare R2** y lo combiné con **PicList**. El resultado ha sido muy bueno.

Ventajas:

✅ Gratis  ✅ Estable  ✅ Rápido  ✅ Dominio personalizado  ✅ CDN global  ✅ Sin carga para el VPS

---

# Configurar PicList

- Alojamiento de imágenes: se usa para subir imágenes
- Nube: se usa para que PicList acceda al bucket de Cloudflare

## Configuración del alojamiento de imágenes

En la navegación de la izquierda abre **Alojamiento de imágenes** → **AWS S3** → **Nueva configuración**:

<img src="https://img.weigshare.com/img/001.002_PicList_orign.png" width="120"/>

### Campos obligatorios

    ● Nombre de configuración: cualquiera
    ● AccessKeyId: 18e1************************c0858
    ● secretAccessKey: c8a3********************************************************fa6e
    ● Endpoint personalizado: https://770*************************39d8.r2.cloudflarestorage.com

Todos estos datos pueden obtenerse aquí: [imagen de la API](https://img.weigshare.com/img/001.005_CF_API_token.png).

* Permisos: **lectura y escritura de administrador** (de lo contrario, PicList no podrá acceder a la nube).
* Las credenciales solo se muestran una vez. Guárdalas o tendrás que volver a crearlas.

● Bucket: en mi caso es **hexo-img**. [Imagen](https://img.weigshare.com/img/001.003_CDF_bucket.png)

---

### Campos opcionales

■ Ruta de subida: **/** (directorio raíz)

Quiero guardar los archivos dentro de **img**, por eso uso **/img/**. [Imagen](https://img.weigshare.com/img/001.004_Directory.png)

● Dominio personalizado: https://img.weigshare.com/  
(Puede configurarse después de vincular un dominio. A partir de entonces las imágenes subidas usarán enlaces bajo ese dominio.) [Imagen](https://img.weigshare.com/img/001.004_Directory.png)

```shell
https://img.weigeshare.com/img/x.png
```

☐ Si no lo configuras, podrías obtener un enlace como este, que puede no abrirse directamente:

```text
    https://770*************************39d8.r2.cloudflarestorage.com/img/0.%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-07-08%20181820.png
```

☐ Region: **auto** (o us-east-1)

* Política de acceso del objeto subido: <span style="color:#ff69b4;font-weight:bold;">public-read</span> (recomendación oficial)

---

## Configuración de la nube

En la navegación de la izquierda abre **Nube** → **S3 API** → **Nueva configuración** → **Guardar**:

<img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration1.png" height="280"/> <img src="https://img.weigshare.com/img/001.005_piclist_cloud_configuration2.png" height="280"/>

### Campos obligatorios

    ● Nombre de configuración: cualquiera
    ● Access Key Id: 18e1************************c0858
    ● Access Key Secret: c8a3********************************************************fa6e
    ● endpoint / endpoint personalizado: https://770*************************39d8.r2.cloudflarestorage.com

Obtén el token de API aquí: [API](https://img.weigshare.com/img/001.005_CF_API_token.png).

* Permisos: **lectura y escritura de administrador** (de lo contrario, PicList no podrá acceder a la nube).

● Nombre del bucket: **hexo-img**. [Imagen](https://img.weigshare.com/img/001.003_CDF_bucket.png)

■ Directorio inicial: **/**

* Yo guardo los archivos en **/img/**. [Imagen](https://img.weigshare.com/img/001.004_Directory.png)

### Campos opcionales

■ Permiso de los archivos subidos: public-read (lectura pública, recomendado oficialmente)

---

# Preguntas frecuentes

## La subida termina correctamente, pero la imagen no abre

Comprueba:

- que el Bucket permita acceso público;
- que el dominio personalizado esté vinculado;
- que la resolución DNS ya esté activa.

## Aparece AccessDenied

Comprueba:

- que el Access Key ID sea correcto;
- que el Secret Access Key sea correcto;
- que el API Token tenga permisos de lectura y escritura.

## Aparece SignatureDoesNotMatch

Comprueba:

- que el Endpoint sea correcto.

# Resumen

La pila actual de mi blog:

```text
 Hexo + Butterfly + Github + Cloudflare R2 + Cloudflare CDN
```

Si buscas una solución de alojamiento de imágenes estable a largo plazo para un blog, PicList + Cloudflare R2 merece mucho la pena.
