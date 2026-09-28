---
title: "Sistema de cálculo e revisão de soluções padrão para laboratório"
date: 2026-07-02 09:19:11
tags:
  - Python
  - PyQt6
  - Laboratório
  - Análise química
  - Normas
  - Solução titulante padrão
  - Solução padrão
categories:
  - Python
cover: https://img.weigshare.com/img/002.001.StandardSolution_Conver.png
description: "Aplicação Windows desenvolvida com Python, PyQt6, QFluentWidgets e SQLite para cálculo e revisão de soluções padrão, incluindo correções de temperatura e bureta, resultados em paralelo e cálculo automático da amplitude relativa."
---

# Porque criei esta ferramenta

No trabalho de análise química, a tarefa não termina quando uma solução titulante é preparada e padronizada. Depois é preciso calcular concentrações, aplicar correções, comparar resultados paralelos e rever os dados finais. Fazer tudo manualmente demora tempo e, quando a quantidade de dados aumenta, também cresce o risco de erros de cálculo ou de revisão.

- Desenvolvi este sistema nos meus tempos livres. O projeto começou em abril e a primeira versão pronta para utilização real ficou concluída em novembro — mais de seis meses de trabalho e também a minha primeira aplicação de desktop com interface gráfica.

- Durante o desenvolvimento aprendi Python e PyQt6 por conta própria e tratei sozinho do design, da lógica de cálculo, dos testes e da implementação. O QFluentWidgets foi usado para tornar a interface mais agradável no dia a dia.

- Depois de entrar em utilização real, a ferramenta passou a poupar mais de uma hora de revisão por pessoa todas as semanas. Era a concretização de uma pequena ideia: passar meio ano a criar uma ferramenta para depois “recuperar” uma hora todas as semanas. 😆

- Saí recentemente do meu emprego e finalmente tive tempo para organizar o projeto, por isso decidi publicá-lo como código aberto.

**[Pré-visualização Web](https://www.weigshare.com/standard) ⬅** Abrir

# Sistema de cálculo e revisão de soluções padrão

<div align="left" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:left;">
  <img src="https://img.shields.io/badge/Python-3.12-blue" alt="Python">
  <img src="https://img.shields.io/badge/PyQt6-GUI-green" alt="PyQt6">
  <img src="https://img.shields.io/badge/SQLite-Database-blue" alt="SQLite">
  <img src="https://img.shields.io/badge/GPL--3.0-red" alt="GPL3">
</div>

Um aplicativo de desktop para padronização, cálculo e revisão de soluções padrão em laboratório.

Ele oferece correção de temperatura, correção de bureta, quatro determinações paralelas por uma pessoa, oito determinações paralelas por duas pessoas e cálculo automático da amplitude relativa, aumentando a eficiência da gestão de soluções padrão.

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo_GIF.gif" >

Após inserir os dados experimentais, o sistema conclui automaticamente o cálculo e a revisão. Baixe o [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases) para começar.

---

## Funcionalidades

✅ Cálculo de correção de temperatura  
✅ Ajuste da correção de bureta  
✅ Cálculo automático da concentração da solução padrão

✅ Quatro determinações paralelas por uma pessoa  
✅ Oito determinações paralelas por duas pessoas  
✅ Cálculo da amplitude relativa  
✅ Cálculo da concentração reportada

---

## Soluções padrão compatíveis

- Ácido clorídrico, hidróxido de sódio, ácido sulfúrico, permanganato de potássio, nitrato de prata, tiossulfato de sódio, ácido etilenodiaminotetracético (EDTA), cloreto de zinco, hidróxido de potássio em etanol, carbonato de sódio etc.

- HCl, NaOH, H₂SO₄, KMnO₄, AgNO₃, Na₂S₂O₃, EDTA, ZnCl₂, KOH-Ethanol, Na₂CO₃, Custom Molar Mass (g/mol)

- **Personalizada**

---

## Interface do software

### Interface principal

<img src="https://img.weigshare.com/img/002.StandardSolution_Review_System_Demo.png" >

#### Interface antiga

A interface passou por várias iterações.

<img src=https://img.weigshare.com/img/002.002.StandardSolution_Review_System_Demo_old.png >

| **Entrada suportada** | **Gerado automaticamente** |
| ---------------- | ---------------- |
| Massa da substância padrão | Volume real de titulação |
| Volume de titulante consumido | Quatro concentrações paralelas por uma pessoa |
| Correção de bureta | Oito concentrações paralelas por duas pessoas |
| Correção de temperatura | Amplitude relativa |
| Volume do branco | Concentração reportada |

---

## Como executar

### Versão publicada

Baixe e execute o [exe](https://github.com/weigefenxiang/StandardSolutionReviewSystem/releases):

```text
StandardSolution_ReviewSystem.exe
```

## Executar pelo código-fonte

<details>
    <summary>Clique para expandir</summary>

### Ambiente de desenvolvimento

- Windows 11
- Python 3.12
- PyQt6
- QFluentWidgets
- SQLite
- Nuitka (para empacotamento)

### Instalar dependências

```bash
pip install -r requirements.txt
```

### Executar

```bash
python Flu_Main.py
```

## Licença de código aberto

Este projeto é distribuído sob a licença GPL-3.0.

Ao usar, modificar ou redistribuir o projeto, siga os termos da licença GPL-3.0.

## Componentes de código aberto de terceiros

O projeto usa:

- Python, PyQt6, QFluentWidgets, SQLite, Nuitka

Obrigado a todos os desenvolvedores dos projetos de código aberto utilizados.

</details>
