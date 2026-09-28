---
title: "Sistema de cálculo y revisión de soluciones patrón para laboratorio"
date: 2026-07-02 09:19:11
tags:
  - Python
  - PyQt6
  - Laboratorio
  - Análisis químico
  - Normas
  - Solución de valoración
  - Solución patrón
categories:
  - Python
cover: https://img.weigshare.com/img/002.001.StandardSolution_Conver.png
description: "Aplicación de escritorio para Windows creada con Python, PyQt6, QFluentWidgets y SQLite para calcular y revisar soluciones patrón, con correcciones de temperatura y bureta, resultados paralelos y cálculo automático del rango relativo."
---

# Por qué hice esta herramienta

En el trabajo de análisis químico, la tarea no termina al preparar y estandarizar una solución titulante. Después hay que calcular concentraciones, aplicar correcciones, comparar resultados paralelos y revisar los datos finales. Hacer todo esto a mano consume tiempo y, cuando aumenta el volumen de datos, también aumenta la posibilidad de cometer errores de cálculo o de revisión.

- Desarrollé este sistema en mi tiempo libre. Empecé el proyecto en abril y terminé la primera versión lista para uso real en noviembre: más de seis meses de trabajo y, además, mi primera aplicación de escritorio con interfaz gráfica.

- Durante el proceso aprendí Python y PyQt6 por mi cuenta y me encargué del diseño, la lógica de cálculo, las pruebas y el despliegue. QFluentWidgets me ayudó a conseguir una interfaz más cómoda para el uso diario.

- Una vez puesto en producción, el programa permitió ahorrar más de una hora de revisión por persona cada semana. Era una pequeña idea que tuve una noche: invertir medio año en una herramienta para recuperar después una hora libre cada semana. 😆

- Hace poco dejé mi trabajo y por fin tuve tiempo de ordenar el proyecto, así que decidí publicarlo como software de código abierto.

**[Vista previa Web](https://www.weigshare.com/standard) ⬅** Abrir

# Sistema de cálculo y revisión de soluciones patrón

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python">
  <img src="https://img.shields.io/badge/PyQt6-GUI-green" alt="PyQt6">
  <img src="https://img.shields.io/badge/SQLite-Database-blue" alt="SQLite">
  <img src="https://img.shields.io/badge/GPL--3.0-red" alt="GPL3">
</div>

Una aplicación de escritorio para la estandarización, el cálculo y la revisión de soluciones patrón en laboratorio.

Admite corrección de temperatura, corrección de bureta, cuatro réplicas realizadas por una persona, ocho réplicas realizadas por dos personas y cálculo automático del rango relativo, mejorando la eficiencia de la gestión de soluciones patrón.

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo_GIF.gif" >

Después de introducir los datos experimentales, el cálculo y la revisión se completan automáticamente. Descarga el [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases) para empezar.

---

## Funciones

✅ Cálculo de corrección de temperatura  
✅ Corrección del valor de la bureta  
✅ Cálculo automático de la concentración de la solución patrón

✅ Cuatro réplicas por una persona  
✅ Ocho réplicas por dos personas  
✅ Cálculo del rango relativo  
✅ Cálculo de la concentración reportada

---

## Soluciones patrón compatibles

- Ácido clorhídrico, hidróxido de sodio, ácido sulfúrico, permanganato de potasio, nitrato de plata, tiosulfato de sodio, ácido etilendiaminotetraacético (EDTA), cloruro de zinc, hidróxido de potasio en etanol, carbonato de sodio, etc.

- HCl, NaOH, H₂SO₄, KMnO₄, AgNO₃, Na₂S₂O₃, EDTA, ZnCl₂, KOH-Ethanol, Na₂CO₃, Custom Molar Mass (g/mol)

- **Personalizada**

---

## Interfaz del software

### Interfaz principal

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo.png" >

#### Interfaz antigua

La interfaz ha pasado por varias iteraciones.

<img src=https://img.weigshare.com/img/002.002.StandardSolution_Review_System_Demo_old.png >

| **Entrada compatible** | **Generado automáticamente** |
| ---------------- | ---------------- |
| Masa de la sustancia patrón | Volumen real de valoración |
| Volumen de titulante consumido | Cuatro concentraciones paralelas de una persona |
| Corrección de bureta | Ocho concentraciones paralelas de dos personas |
| Corrección de temperatura | Rango relativo |
| Volumen del blanco | Concentración reportada |

---

## Ejecución

### Versión publicada

Descarga y ejecuta el [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases):

```text
StandardSolution_ReviewSystem.exe
```

## Ejecutar desde el código fuente

<details>
    <summary>Haz clic para desplegar</summary>

### Entorno de desarrollo

- Windows 11
- Python 3.12
- PyQt6
- QFluentWidgets
- SQLite
- Nuitka (para empaquetado)

### Instalar dependencias

```bash
pip install -r requirements.txt
```

### Ejecutar

```bash
python Flu_Main.py
```

## Licencia de código abierto

Este proyecto se publica bajo la licencia GPL-3.0.

Al usar, modificar o redistribuir el proyecto, respeta los términos de la licencia GPL-3.0.

## Componentes de código abierto de terceros

Este proyecto utiliza:

- Python, PyQt6, QFluentWidgets, SQLite, Nuitka

Gracias a todos los desarrolladores de los proyectos de código abierto utilizados.

</details>
