# Auditoría del leccionario BCP 2019 — parte 1 (Adviento → Trinidad)

Fecha: 2026-10-31. Alcance: `bcp2019/js/lectionary.js`, objeto `BCPLectionary.SUNDAY`, las 41 claves de Adviento a Trinidad. Solo lectura sobre el repositorio: no se editó ningún archivo del repo, no hubo commits ni servidores. Todo lo generado está en la carpeta `audit\` del scratchpad.

**Veredicto.** El leccionario del app no es el del libro. Sobre 492 comparaciones (41 claves × 3 ciclos × 4 campos), solo 179 (36 %) son idénticas al libro; con cortes de versículos distintos o paréntesis opcionales (equivalentes) llegan a 299 (61 %); las otras 193 (39 %) son otra lectura, un corte muy distinto o una lectura que falta. El evangelio es lo más cercano (82 % idéntico o equivalente) y el salmo lo más lejano (44 %). Como el año litúrgico que empieza el 2026-11-29 es Ciclo B, 19 de las 36 fechas con clave en este alcance mostrarían primera lectura o evangelio distintos a los del libro (sección 3.4).

---

## 1. Fuentes y método

**Libro.** Tabla «Sunday, Holy Day, and Commemoration Lectionary», pp. 717-725 del libro (md líneas 20560-21112), más las liturgias especiales: Miércoles de Ceniza (md L15455-15458), Domingo de Ramos (L15731-15793), Jueves Santo (L15857-15860), Viernes Santo (L15948-15956), Sábado Santo (L16298-16301) y Vigilia Pascual (L16494-16678).

**Problema de la extracción.** El markdown intercala filas y suelta celdas fuera de la tabla (por ejemplo las pruebas en md L20774-20805, L20813-20829, L20928-20944). Con ese texto, una lectura como la 1ª de Adviento 3 Ciclo B (`Isa 65:17-25`, md L20602) no se puede asignar a su columna: aparece suelta antes de la fila de Adviento 3. No adiviné: reconstruí la tabla **por columnas** a partir de las coordenadas x/y de cada palabra en el PDF original (`C:\Users\gonza\OneDrive\Desktop\ESCRITORIO\Otros\usb roja\Nueva carpeta\modelos ACNA\ACNA BCP - 2019.pdf`; 812 págs.; **página PDF = página del libro + 8**; pp. 717-725 del libro = PDF 725-733). Volcado: `audit\pdf-cols.txt`; scripts `audit\pdfcols.py`, `audit\pdfrange.py`.

**Tres controles de la transcripción** (`lect1-verdad.json`, 54 días/servicios, 621 valores no nulos):

1. **Contra el markdown.** Cada valor se busca en el md dentro de la ventana de su día. 607 de 621 se localizan (línea en `lineas`). Los 14 restantes son 8 referencias que el md trae partidas en varias celdas (Epifanía 5 B 1ª: `2 Kings 4:8-21` en L20711 y `(22-31)32-37` en L20714; Cuaresma 1 A 1ª; Cuaresma 3 A evangelio; Cuaresma 4 A evangelio y C 1ª; los tres evangelios de la Pasión de Ramos) y 6 textos que no son una sola referencia (la lista de lecturas de la Vigilia y la rúbrica «Use one of the Old Testament Lessons» del servicio temprano de Pascua). Las 8 primeras están marcadas `pdfOnly` en el JSON.
2. **Contra la columna del PDF.** `audit\check-columns.js` comprueba que cada valor aparece, en orden, dentro de la columna A/B/C que le corresponde en el volcado: 612 de 612 (excluida la Vigilia, que es una lista).
3. **A mano.** 15 diferencias relevantes releídas en el md línea por línea (sección 4).

Qué comprueba y qué no: los controles 1 y 2 detectan erratas de transcripción y columnas cruzadas; no prueban que el PDF coincida con la edición oficial impresa (ver sección 9).

**Comparación** (`audit\lect1-diff.js`). El app se lee con `BCPLectionary.getSundayReadings(clave, ciclo)`, o sea con la misma lógica que usa `app.js` (`entry.all || entry[ciclo]`). Cada referencia se normaliza: abreviaturas del libro a nombre largo, `—` a `-`, se quita la `v` final (numeración del Nuevo Salterio Coverdale), los paréntesis son versículos opcionales (se calculan el conjunto de versículos «núcleo» y el «máximo»), `a`/`b` de medio versículo se ignoran, y las alternativas «A or B» se separan (el app se compara con la mejor opción). Estados:

| estado | criterio |
|---|---|
| IGUAL | misma referencia normalizada |
| EQUIVALENTE | mismo libro y (a) mismo conjunto de versículos salvo paréntesis opcionales o medio versículo (`opcional`), o (b) corte distinto con solapamiento J ≥ 0,5, J = versículos comunes / versículos de la unión (`corte` si J ≥ 0,7; `corte-debil` si 0,5 ≤ J < 0,7); en salmos, mismo salmo y una de las dos partes es el salmo completo (`salmo-porcion`) o los tramos solapan; más 2 casos de numeración verificados a mano (`numeracion`) |
| PARCIAL | mismo libro o salmo con 0 < J < 0,5, o salmo con tramos sin ningún versículo común |
| DIFERENTE | otro libro, otro pasaje o otro salmo |
| FALTA EN APP / FALTA EN LIBRO | un lado vacío |

Severidad (la definió el encargo): **alta** = 1ª lectura o evangelio DIFERENTE (o falta); **media** = salmo o 2ª lectura DIFERENTE/falta, y cualquier PARCIAL; **baja** = EQUIVALENTE. El umbral J = 0,5 es una heurística mía: las 31 filas `corte-debil` conviene mirarlas una a una en la sección 6.

**Cómo conté.** Una «comparación» es una fila (clave, ciclo, campo). Las claves con lectura única en el libro y en el app cuentan 3 veces (una por ciclo), porque cada ciclo las mostraría. Las cifras «únicas» colapsan a una fila cuando app y libro coinciden de texto en A, B y C (382 filas en vez de 492).

---

## 2. Resumen cuantitativo

### 2.1 Global

| | IGUAL | EQUIVALENTE | PARCIAL | DIFERENTE | FALTA EN APP | FALTA EN LIBRO | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| **todas las filas** | 179 (36,4 %) | 120 (24,4 %) | 28 (5,7 %) | 156 (31,7 %) | 9 (1,8 %) | 0 | 492 |
| **filas únicas** | 135 | 92 | 24 | 128 | 3 | 0 | 382 |

Subtipos de los 120 EQUIVALENTE: `opcional` 24, `corte` 52, `corte-debil` 31, `salmo-porcion` 11, `numeracion` 2.
Severidad (filas): alta 65, media 128, baja 120. Únicas: alta 51, media 104, baja 92.

### 2.2 Por ciclo (164 comparaciones cada uno)

| ciclo | IGUAL | EQUIV. | PARCIAL | DIFER. | FALTA | idéntico o equivalente |
|---|---:|---:|---:|---:|---:|---:|
| A | 64 | 42 | 12 | 43 | 3 | 106 (64,6 %) |
| B | 57 | 39 | 5 | 60 | 3 | 96 (58,5 %) |
| C | 58 | 39 | 11 | 53 | 3 | 97 (59,1 %) |

### 2.3 Por tipo de lectura (123 comparaciones cada una)

| campo | IGUAL | EQUIV. | PARCIAL | DIFER. | FALTA | idéntico o equivalente |
|---|---:|---:|---:|---:|---:|---:|
| 1ª lectura | 36 | 33 | 9 | 45 | 0 | 69 (56,1 %) |
| salmo | 34 | 20 | 6 | 63 | 0 | 54 (43,9 %) |
| 2ª lectura | 47 | 28 | 11 | 28 | 9 | 75 (61,0 %) |
| evangelio | 62 | 39 | 2 | 20 | 0 | 101 (82,1 %) |

### 2.4 Por ciclo y campo (41 comparaciones cada celda)

| | IGUAL | EQUIV. | PARCIAL | DIFER. | FALTA |
|---|---:|---:|---:|---:|---:|
| A · 1ª | 14 | 11 | 4 | 12 | 0 |
| A · salmo | 12 | 6 | 3 | 20 | 0 |
| A · 2ª | 16 | 12 | 5 | 5 | 3 |
| A · evangelio | 22 | 13 | 0 | 6 | 0 |
| B · 1ª | 10 | 13 | 1 | 17 | 0 |
| B · salmo | 10 | 8 | 1 | 22 | 0 |
| B · 2ª | 16 | 6 | 3 | 13 | 3 |
| B · evangelio | 21 | 12 | 0 | 8 | 0 |
| C · 1ª | 12 | 9 | 4 | 16 | 0 |
| C · salmo | 12 | 6 | 2 | 21 | 0 |
| C · 2ª | 15 | 10 | 3 | 10 | 3 |
| C · evangelio | 19 | 14 | 2 | 6 | 0 |

### 2.5 Por tiempo litúrgico (filas; «coincide» = idéntico o equivalente)

| tiempo | filas | IGUAL | EQUIV. | no coincide | coincide |
|---|---:|---:|---:|---:|---:|
| Adviento | 48 | 20 | 15 | 13 | 72,9 % |
| Navidad (incl. Domingos 1 y 2 y Circuncisión) | 48 | 21 | 7 | 20 | 58,3 % |
| Epifanía (Epifanía, domingos 1-8, Transfiguración) | 120 | 52 | 28 | 40 | 66,7 % |
| Cuaresma (Ceniza + 5 domingos) | 72 | 26 | 22 | 24 | 66,7 % |
| Semana Santa (Ramos, Lun-Mié, Jueves, Viernes, Sábado) | 84 | 21 | 21 | 42 | 50,0 % |
| Pascua (Día, domingos 2-7, Ascensión) | 96 | 36 | 17 | 43 | 55,2 % |
| Pentecostés y Trinidad | 24 | 3 | 10 | 11 | 54,2 % |

### 2.6 Por día entero

De las 123 combinaciones día × ciclo, solo 25 tienen sus cuatro lecturas idénticas o equivalentes. Cinco claves no tienen ninguna diferencia sustantiva en ningún ciclo: `christmas`, `epiphany`, `goodFriday`, `holySaturday` y `ascension`. La matriz por día está en la sección 10.

---

## 3. Hallazgos

### 3.1 El libro no sigue el RCL

El encabezado de `lectionary.js` (l. 5-12) declara el leccionario «reconstruido de memoria» del RCL con la pista complementaria. Es la premisa equivocada: el leccionario del libro es otro. Lo vi en tres rasgos:

- **Navidad.** Hay conjuntos únicos (iguales en A, B y C) para el Día I, II y III, el Domingo 1 de Navidad (`Isa 61:10—62:5`, Sal 147:12-20, `Gal 3:23—4:7`, Jn 1:1-18), la Circuncisión y la Epifanía. El app inventa lecturas por ciclo A/B/C en `christmasSunday`.
- **Epifanía 1 (Bautismo).** La 1ª lectura, el salmo y la 2ª son iguales los tres años (`Isa 42:1-9`, Sal 89, `Acts 10:34-38`); solo cambia el evangelio. El app pone Gn 1:1-5 (B), Is 43:1-7 (C), Hch 19:1-7 (B), Hch 8:14-17 (C) y el Sal 29.
- **Pascua.** El libro ofrece «Hechos *o* un texto del AT» como 1ª lectura de los domingos 2-7 (ver sección 8), y en los ciclos B y C la 1ª y la 2ª lectura del app difieren (DIFERENTE o PARCIAL) en 18 de 24 filas de los domingos 2-7.

### 3.2 Semana Santa lunes-miércoles: el comentario del app es falso

`lectionary.js` l. 143-148 dice que «el BCP 2019 no asigna lecturas propias a estos tres días» y que las tres entradas vienen del Misal Romano «por decisión expresa del usuario». El libro sí las asigna (p. 721, md L20847-20869) y son completas, con cuatro lecturas cada día:

| día | 1ª | salmo | 2ª | evangelio |
|---|---|---|---|---|
| Lunes | `Isa 42:1-9` | Sal 36:5-10 | `Heb 11:39—12:3` | Jn 12:1-11 o Mr 14:3-9 |
| Martes | `Isa 49:1-6` | Sal 71:1-11 | `1 Cor 1:18-31` | Jn 12:37-38,42-50 o Mr 11:15-19 |
| Miércoles | `Isa 50:4-9` | Sal 69:6-14,21-22 | `Heb 9:11-28` | Mt 26:1-5,14-25 |

El app tiene `second: null` los tres días (9 filas FALTA EN APP) y solo el evangelio del lunes coincide (equivalente). La decisión de usar el Misal Romano es del usuario; lo que debe saber es que se tomó creyendo que el libro no tenía esas lecturas. Además `CLAUDE.md` (sección «Huecos conocidos») dice que a `bcp2019` «faltan los propios» de estos días: ya no faltan, pero son los del Misal Romano, no los del libro.

### 3.3 Otros bloques con diferencias graves

- **Domingo 1 de Navidad** (`christmasSunday`): 11 de 12 comparaciones son DIFERENTE o PARCIAL; la única equivalente es la 1ª lectura de B (`Isaiah 61:10-62:3` frente a `Isa 61:10—62:5`).
- **Domingo 2 de Navidad** (`christmasSunday2`): el evangelio del app es Jn 1:1-18 los tres años; el libro da Lc 2:41-52 (A), Mt 2:13-23 (B), Lc 2:22-40 (C), cada uno «o Mt 2:1-12» (md L20659-20660). Primera lectura, salmo y 2ª coinciden.
- **Domingo de Ramos**: 1ª lectura (Is 50:4-9 frente a `Isa 52:13—53:12`) y salmo (31:9-16 frente a 22) distintos; falta la Liturgia de las Palmas (evangelio de la entrada y Sal 118:19-29).
- **Adviento**: 1C (Jr 33:14-16 frente a `Zech 14:(1-2)3-9`), 2C (Ba 5:1-9 frente a `Mal 3:1-5`), 3B (Is 61:1-4 y Jn 1:6-8 frente a `Isa 65:17-25` y Jn 3:22-30 o 1:19-28).
- **Pentecostés**: el evangelio del app es Jn 20:19-23 (A) y Jn 15:26-27 (B); el libro da `John 14:8-17` los tres años (md L21073).
- **Salmos**: 63 de 123 son DIFERENTES (51 %); solo 34 son idénticos al libro. Es el campo que menos se parece, y el menos visible a primera vista.

### 3.4 Exposición inmediata: año litúrgico 2026-27 (Ciclo B)

El Adviento 2026 (2026-11-29) abre el Ciclo B. De las 36 fechas con clave en este alcance hasta la Trinidad (2027-05-23), **19** tienen al menos una diferencia alta (1ª lectura o evangelio), **16** tienen la 1ª lectura DIFERENTE o PARCIAL y **8** el evangelio DIFERENTE o PARCIAL. La lista fecha por fecha está en `audit\lect1-anio-2026-27.md`. Las 19 fechas con diferencia alta: 2026-12-13, 2026-12-27, 2027-01-03, 2027-01-10, 2027-01-24, 2027-02-07, 2027-02-21, 2027-03-07, 2027-03-21, 2027-03-22, 2027-03-23, 2027-03-24, 2027-04-04, 2027-04-11, 2027-04-18, 2027-04-25, 2027-05-02, 2027-05-16 y 2027-05-23. Solo 5 de las 36 fechas (Navidad, Epifanía, Ascensión, Viernes y Sábado Santo) no tienen ninguna diferencia sustantiva.

---

## 4. Verificación manual de 15 diferencias

Para cada una releí las líneas del md citadas y la columna correspondiente del PDF. Ninguna es un artefacto de extracción. Cuando el md deja la celda suelta, lo digo.

| # | caso | app | libro | evidencia |
|---|---|---|---|---|
| 1 | Adviento 1 C: 1ª y salmo | Jeremiah 33:14-16; Psalm 25:1-9 | Zech 14:(1-2)3-9; Ps 50 or 50:1-6 | md L20585 y L20588; PDF p.725 col. C |
| 2 | Adviento 2 C: 1ª y 2ª | Baruch 5:1-9; Philippians 1:3-11 | Mal 3:1-5; 1 Cor 4:(1-7)8-21 | md L20596 y L20599; PDF p.725 col. C |
| 3 | Adviento 3 B: 1ª y evangelio | Isaiah 61:1-4; John 1:6-8 | Isa 65:17-25; John 3:22-30 or John 1:19-28 | md L20602, L20609, L20612 (celdas sueltas fuera de la tabla, **AMBIGUO en md**; columna B resuelta con PDF p.725 x=184,9) |
| 4 | Domingo 1 de Navidad, A/B/C (12 filas) | A: Is 63:7-9, Sal 148, Heb 2:10-18, Mt 2:13-23. B: Is 61:10-62:3, Sal 148, Gal 4:4-7, Lc 2:22-40. C: 1 S 2:18-20, Sal 148, Col 3:12-17, Lc 2:41-52 | Isa 61:10—62:5; Ps 147:12-20v; Gal 3:23—4:7; John 1:1-18 (los 3 ciclos) | md L20636-20644; PDF p.726 |
| 5 | Domingo 2 de Navidad: evangelio | John 1:1-18 (A/B/C) | Luke 2:41-52 / Matt 2:13-23 / Luke 2:22-40, cada uno or Matt 2:1-12 | md L20659-20660 |
| 6 | Epifanía 1 (Bautismo): 1ª, salmo, 2ª | B: Gn 1:1-5, Sal 29, Hch 19:1-7. C: Is 43:1-7, Sal 29, Hch 8:14-17 | Isa 42:1-9; Ps 89:1-29v or 89:20-29v; Acts 10:34-38 (los 3 ciclos) | md L20674-20677 |
| 7 | Epifanía 5: 1ª lectura A/B/C | Isaiah 58:1-9 / 40:21-31 / 6:1-8 | 2 Kings 22:8-20 / 2 Kings 4:8-21(22-31)32-37 / Judg 6:11-24 | md L20711-20714 (B partida en dos líneas, **AMBIGUO en md**; resuelto con PDF p.727 col. B) |
| 8 | Epifanía 6 A: 1ª | Deuteronomy 30:15-20 | Ecclesiasticus 15:11-20 | md L20721; PDF p.727 col. A |
| 9 | Transfiguración: 1ª B, 2ª A/B/C, salmos | B: 2 R 2:1-12. 2ª: 2 P 1:16-21 (A), 2 Co 4:3-6 (B), 2 Co 3:12-4:2 (C). Salmos 2, 50:1-6 | 1 Kings 19:9-18. 2ª: Phil 3:7-14, 2 Pet 1:13-21, 1 Cor 12:27—13:13. Ps 99, 27, 99 | md L20759-20762 |
| 10 | Cuaresma 3 C, 4 B, 5 C | 3C 1ª Is 55:1-9. 4B Nm 21:4-9, Sal 107:1-3, Jn 3:14-21. 5C Jn 12:1-8 | Ex 3:1-15. 2 Chr 36:14-23, Ps 122, John 6:1-15. Luke 20:9-19 | md L20796, L20813-20824, L20829 (celdas sueltas; resuelto con PDF p.728-729) |
| 11 | Domingo de Ramos: 1ª y salmo | Isaiah 50:4-9; Psalm 31:9-16 | Isa 52:13—53:12; Ps 22:1-21v or 22:1-11v | md L20838-20841; liturgia especial L15784-15785, donde el salmo se amplía a «22:1-22v, 22:1-11v or 31:10-18v» |
| 12 | Lunes a Miércoles Santos (conjunto completo) | Is 50:5-10 / Jr 11:18-20 / Is 62:11-63:7, etc. (Misal Romano) | tabla de 3.2 | md L20847-20869 |
| 13 | Jueves Santo: salmo | Psalm 116:1-2 | Ps 78:15-26v | md L20875; liturgia especial L15858 |
| 14 | Pentecostés: evangelio y 2ª | Jn 20:19-23 (A), Jn 15:26-27 (B); 2ª: Rm 8:22-27 (B), Rm 8:14-17 (C) | John 14:8-17; Acts 2:1-11(12-21) or 1 Cor 12:4-13 | md L21066-21073 |
| 15 | Trinidad B y C | B 1ª Is 6:1-8, salmo 29. C 1ª Pr 8:1-4, 2ª Rm 5:1-5 | B Ex 3:1-6, Ps 93. C Isa 6:1-7, Rev 4:1-11 | md L21077-21081 |

Casos de numeración verificados además a mano, y por eso clasificados EQUIVALENTE y no DIFERENTE: `advent1` B 1ª (el app escribe `Isaiah 63:19,64:1-8`, numeración hebrea/BJ; el libro `Isa 64:1-9a`, numeración inglesa: es la misma perícopa; el verso inicial, el de «rasgar los cielos», es 63:19b en la numeración hebrea y 64:1 en la inglesa) y `advent4` C 1ª (`Micah 5:1-4` en numeración BJ frente a `Mic 5:2-5a` del libro). Eran dos de los «indicios fuertes» del encargo; el primero no es una divergencia real.

---

## 5. Tabla completa de diferencias (DIFERENTE, PARCIAL y FALTA EN APP)

Una fila por (clave, campo, valor) con los ciclos agrupados cuando app y libro coinciden de texto en A/B/C. 193 filas de comparación en 154 filas de tabla. Orden: orden del libro. «Valor libro» es el texto tal cual del libro, con alternativas «or»; «L» es la línea del markdown (primera coincidencia dentro de la ventana de su día), `pdf-only` indica que esa lectura no se localiza en el md.

| sev. | clave app | ciclo | campo | valor app | valor libro (tal cual) | estado | línea md | p. libro |
|---|---|---|---|---|---|---|---|---|
| alta | advent1 | C | 1ª lectura | Jeremiah 33:14-16 | Zech 14:(1-2)3-9 | DIFERENTE | L20585 | 717 |
| media | advent1 | C | salmo | Psalm 25:1-9 | Ps 50 or 50:1-6 | DIFERENTE | L20588 | 717 |
| alta | advent2 | C | 1ª lectura | Baruch 5:1-9 | Mal 3:1-5 | DIFERENTE | L20596 | 717 |
| media | advent2 | A | salmo | Psalm 72:1-8 | Ps 72:1-15(16-19) | PARCIAL (J=0.42) | L20597 | 717 |
| media | advent2 | C | 2ª lectura | Philippians 1:3-11 | 1 Cor 4:(1-7)8-21 | DIFERENTE | L20599 | 717 |
| alta | advent3 | B | 1ª lectura | Isaiah 61:1-4 | Isa 65:17-25 | DIFERENTE | L20602 | 717 |
| media | advent3 | C | salmo | Isaiah 12:2-6 | Ps 85 | DIFERENTE | L20606 | 717 |
| media | advent3 | A | 2ª lectura | James 5:7-10 | James 5:7-20 | PARCIAL (J=0.29) | L20608 | 717 |
| alta | advent3 | B | evangelio | John 1:6-8 | John 3:22-30 or John 1:19-28 | DIFERENTE | L20609 | 717 |
| media | advent4 | A | salmo | Psalm 80:1-7 | Ps 24 | DIFERENTE | L20615 | 717 |
| media | advent4 | B | salmo | Luke 1:46-55 | Ps 132:(1-7) 8-19 | DIFERENTE | L20615 | 717 |
| media | advent4 | C | salmo | Luke 1:46-55 | Ps 80:1-7v | DIFERENTE | L20615 | 717 |
| media | advent4 | C | evangelio | Luke 1:39-45 | Luke 1:39-56 | PARCIAL (J=0.39) | L20617 | 717 |
| alta | christmasSunday | A | 1ª lectura | Isaiah 63:7-9 | Isa 61:10—62:5 | DIFERENTE | L20636 | 718 |
| alta | christmasSunday | C | 1ª lectura | 1 Samuel 2:18-20 | Isa 61:10—62:5 | DIFERENTE | L20636 | 718 |
| media | christmasSunday | A/B/C | salmo | Psalm 148 | Ps 147:12-20v | DIFERENTE | L20638 | 718 |
| media | christmasSunday | A | 2ª lectura | Hebrews 2:10-18 | Gal 3:23—4:7 | DIFERENTE | L20641 | 718 |
| media | christmasSunday | B | 2ª lectura | Galatians 4:4-7 | Gal 3:23—4:7 | PARCIAL (J=0.29) | L20641 | 718 |
| media | christmasSunday | C | 2ª lectura | Colossians 3:12-17 | Gal 3:23—4:7 | DIFERENTE | L20641 | 718 |
| alta | christmasSunday | A | evangelio | Matthew 2:13-23 | John 1:1-18 | DIFERENTE | L20644 | 718 |
| alta | christmasSunday | B | evangelio | Luke 2:22-40 | John 1:1-18 | DIFERENTE | L20644 | 718 |
| alta | christmasSunday | C | evangelio | Luke 2:41-52 | John 1:1-18 | DIFERENTE | L20644 | 718 |
| alta | circumcision | A/B/C | 1ª lectura | Numbers 6:22-27 | Ex 34:1-9 | DIFERENTE | L20647 | 718 |
| media | circumcision | A/B/C | 2ª lectura | Galatians 4:4-7 | Rom 1:1-7 | DIFERENTE | L20650 | 718 |
| alta | christmasSunday2 | A | evangelio | John 1:1-18 | Luke 2:41-52 or Matt 2:1-12 | DIFERENTE | L20659 | 718 |
| alta | christmasSunday2 | B | evangelio | John 1:1-18 | Matt 2:13-23 or Matt 2:1-12 | DIFERENTE | L20659 | 718 |
| alta | christmasSunday2 | C | evangelio | John 1:1-18 | Luke 2:22-40 or Matt 2:1-12 | DIFERENTE | L20659 | 718 |
| alta | epiphany1 | B | 1ª lectura | Genesis 1:1-5 | Isa 42:1-9 | DIFERENTE | L20674 | 719 |
| alta | epiphany1 | C | 1ª lectura | Isaiah 43:1-7 | Isa 42:1-9 | DIFERENTE | L20674 | 719 |
| media | epiphany1 | A/B/C | salmo | Psalm 29 | Ps 89:1-29v or 89:20-29v | DIFERENTE | L20675 | 719 |
| media | epiphany1 | B | 2ª lectura | Acts 19:1-7 | Acts 10:34-38 | DIFERENTE | L20677 | 719 |
| media | epiphany1 | C | 2ª lectura | Acts 8:14-17 | Acts 10:34-38 | DIFERENTE | L20677 | 719 |
| media | epiphany1 | C | evangelio | Luke 3:15-17 | Luke 3:15-22 | PARCIAL (J=0.38) | L20678 | 719 |
| alta | epiphany2 | A | 1ª lectura | Isaiah 49:1-7 | Ex 12:21-28 | DIFERENTE | L20679 | 719 |
| media | epiphany2 | B | salmo | Psalm 139:1-5 | Ps 63:1-9(10-12)v | DIFERENTE | L20680 | 719 |
| media | epiphany2 | C | salmo | Psalm 36:5-10 | Ps 96 | DIFERENTE | L20681 | 719 |
| alta | epiphany3 | A | 1ª lectura | Isaiah 8:23-9:3 | Amos 3:1-11 | DIFERENTE | L20688 | 719 |
| alta | epiphany3 | B | 1ª lectura | Jonah 3:1-5 | Jer 3:19-4:4 | DIFERENTE | L20688 | 719 |
| media | epiphany3 | A | salmo | Psalm 27:1-9 | Ps 139:1-18v | DIFERENTE | L20689 | 719 |
| media | epiphany3 | B | salmo | Psalm 62:5-12 | Ps 130 | DIFERENTE | L20690 | 719 |
| media | epiphany3 | C | salmo | Psalm 19 | Ps 113 | DIFERENTE | L20690 | 719 |
| media | epiphany3 | B | 2ª lectura | 1 Corinthians 7:29-31 | 1 Cor 7:17-24 | DIFERENTE | L20693 | 719 |
| media | epiphany4 | A | salmo | Psalm 15 | Ps 37:1-11v | DIFERENTE | L20699 | 719 |
| media | epiphany4 | C | salmo | Psalm 71:1-6 | Ps 71:11-20v | PARCIAL (J=0) | L20699 | 719 |
| media | epiphany4 | C | 2ª lectura | 1 Corinthians 13:1-13 | 1 Cor 14:12-25 | DIFERENTE | L20702 | 719 |
| alta | epiphany5 | A | 1ª lectura | Isaiah 58:1-9 | 2 Kings 22:8-20 | DIFERENTE | L20712 | 719 |
| alta | epiphany5 | B | 1ª lectura | Isaiah 40:21-31 | 2 Kings 4:8-21(22-31)32-37 | DIFERENTE | pdf-only | 719 |
| alta | epiphany5 | C | 1ª lectura | Isaiah 6:1-8 | Judg 6:11-24 | DIFERENTE | L20712 | 719 |
| media | epiphany5 | A | salmo | Psalm 112:1-9 | Ps 27 | DIFERENTE | L20715 | 719 |
| media | epiphany5 | B | salmo | Psalm 147:1-11 | Ps 142 | DIFERENTE | L20716 | 719 |
| media | epiphany5 | C | salmo | Psalm 138 | Ps 85 | DIFERENTE | L20715 | 719 |
| alta | epiphany6 | A | 1ª lectura | Deuteronomy 30:15-20 | Ecclesiasticus 15:11-20 | DIFERENTE | L20721 | 719 |
| media | epiphany6 | B | salmo | Psalm 30 | Ps 42:1-7(8-15) | DIFERENTE | L20724 | 719 |
| media | epiphany7 | A | 1ª lectura | Leviticus 19:1-2 | Lev 19:1-2,9-18 | PARCIAL (J=0.17) | L20732 | 719 |
| media | epiphany7 | A | salmo | Psalm 119:33-40 | Ps 71 or 71:11-23v | DIFERENTE | L20733 | 719 |
| media | epiphany7 | B | salmo | Psalm 41 | Ps 32 | DIFERENTE | L20734 | 719 |
| alta | epiphany8 | C | 1ª lectura | Isaiah 55:10-13 | Jer 7:1-15 | DIFERENTE | L20745 | 720 |
| media | epiphany8 | A | salmo | Psalm 131 | Ps 62 | DIFERENTE | L20747 | 720 |
| media | epiphany8 | B | 2ª lectura | 2 Corinthians 3:1-6 | 2 Cor 3:4-18 | PARCIAL (J=0.17) | L20750 | 720 |
| alta | transfiguration | B | 1ª lectura | 2 Kings 2:1-12 | 1 Kings 19:9-18 | DIFERENTE | L20759 | 720 |
| media | transfiguration | A | salmo | Psalm 2 | Ps 99 | DIFERENTE | L20760 | 720 |
| media | transfiguration | B | salmo | Psalm 50:1-6 | Ps 27 | DIFERENTE | L20760 | 720 |
| media | transfiguration | A | 2ª lectura | 2 Peter 1:16-21 | Phil 3:7-14 | DIFERENTE | L20761 | 720 |
| media | transfiguration | B | 2ª lectura | 2 Corinthians 4:3-6 | 2 Pet 1:13-21 | DIFERENTE | L20761 | 720 |
| media | transfiguration | C | 2ª lectura | 2 Corinthians 3:12-4:2 | 1 Cor 12:27—13:13 | DIFERENTE | L20761 | 720 |
| media | ashWednesday | A/B/C | 1ª lectura | Joel 2:1-2 | Joel 2:1-2, 12-17 or Isa 58:1-12 | PARCIAL (J=0.25) | L20764 | 720 |
| media | lent1 | A | 1ª lectura | Genesis 2:15-17 | Gen 2:4-9, 15-17, 25—3:7 | PARCIAL (J=0.18) | pdf-only | 720 |
| media | lent1 | A | salmo | Psalm 32 | Ps 51 or Ps 51:1-12v | DIFERENTE | L20779 | 720 |
| media | lent2 | A | 1ª lectura | Genesis 12:1-4 | Gen 12:1-9 | PARCIAL (J=0.44) | L20784 | 720 |
| alta | lent2 | B | 1ª lectura | Genesis 17:1-7 | Gen 22:1-14 | DIFERENTE | L20784 | 720 |
| media | lent2 | A | salmo | Psalm 121 | Ps 33:12-21v | DIFERENTE | L20787 | 720 |
| media | lent2 | B | salmo | Psalm 22:22-30 | Ps 16 or 16:6-12v | DIFERENTE | L20787 | 720 |
| media | lent2 | A | 2ª lectura | Romans 4:1-5 | Rom 4:1-5(6-12)13-17 | PARCIAL (J=0.29) | L20790 | 720 |
| media | lent2 | B | 2ª lectura | Romans 4:13-25 | Rom 8:31-39 | DIFERENTE | L20790 | 720 |
| alta | lent3 | C | 1ª lectura | Isaiah 55:1-9 | Ex 3:1-15 | DIFERENTE | L20796 | 720 |
| media | lent3 | C | salmo | Psalm 63:1-8 | Ps 103 or 103:1-12 | DIFERENTE | L20799 | 720 |
| media | lent3 | A | 2ª lectura | Romans 5:1-11 | Rom 1:16-32 | DIFERENTE | L20801 | 720 |
| media | lent3 | B | 2ª lectura | 1 Corinthians 1:18-25 | Rom 7:12-25 | DIFERENTE | L20802 | 720 |
| alta | lent4 | B | 1ª lectura | Numbers 21:4-9 | 2 Chr 36:14-23 | DIFERENTE | L20814 | 721 |
| media | lent4 | C | 1ª lectura | Joshua 5:9-12 | Josh (4:19-24) 5:1(2-8)9-12 | PARCIAL (J=0.22) | pdf-only | 721 |
| media | lent4 | B | salmo | Psalm 107:1-3 | Ps 122 | DIFERENTE | L20817 | 721 |
| media | lent4 | C | salmo | Psalm 32 | Ps 34 or 34:1-8 | DIFERENTE | L20818 | 721 |
| alta | lent4 | B | evangelio | John 3:14-21 | John 6:1-15 | DIFERENTE | L20823 | 721 |
| alta | lent4 | C | evangelio | Luke 15:1-3 | Luke 15:11-32 | DIFERENTE | L20824 | 721 |
| media | lent5 | A | 2ª lectura | Romans 8:6-11 | Rom 6:15-23 | DIFERENTE | L20828 | 721 |
| media | lent5 | B | 2ª lectura | Hebrews 5:5-10 | Heb (4:14-16) 5:1-10 | PARCIAL (J=0.46) | L20828 | 721 |
| alta | lent5 | C | evangelio | John 12:1-8 | Luke 20:9-19 | DIFERENTE | L20829 | 721 |
| alta | palmSunday | A/B/C | 1ª lectura | Isaiah 50:4-9 | Isa 52:13—53:12 | DIFERENTE | L20838 | 721 |
| media | palmSunday | A | salmo | Psalm 31:9-16 | Ps 22:1-21v or Ps 22:1-11v | DIFERENTE | L20840 | 721 |
| media | palmSunday | B/C | salmo | Psalm 31:9-16 | Ps 22:1-11v or Ps 22:1-21v | DIFERENTE | L20840 | 721 |
| alta | holyWeekFeria_1 | A/B/C | 1ª lectura | Isaiah 50:5-10 | Isa 42:1-9 | DIFERENTE | L20847 | 721 |
| media | holyWeekFeria_1 | A/B/C | salmo | Psalm 35:1-3 | Ps 36:5-10 | DIFERENTE | L20848 | 721 |
| media | holyWeekFeria_1 | A/B/C | 2ª lectura | — | Heb 11:39—12:3 | FALTA EN APP | L20850 | 721 |
| alta | holyWeekFeria_2 | A/B/C | 1ª lectura | Jeremiah 11:18-20 | Isa 49:1-6 | DIFERENTE | L20856 | 721 |
| media | holyWeekFeria_2 | A/B/C | salmo | Psalm 67:1-2 | Ps 71:1-11v | DIFERENTE | L20857 | 721 |
| media | holyWeekFeria_2 | A/B/C | 2ª lectura | — | 1 Cor 1:18-31 | FALTA EN APP | L20859 | 721 |
| alta | holyWeekFeria_2 | A/B/C | evangelio | John 13:21-38 | John 12:37-38,42-50 or Mark 11:15-19 | DIFERENTE | L20862 | 721 |
| alta | holyWeekFeria_3 | A/B/C | 1ª lectura | Isaiah 62:11-63:7 | Isa 50:4-9 | DIFERENTE | L20865 | 721 |
| media | holyWeekFeria_3 | A/B/C | salmo | Psalm 102:1-2 | Ps 69:6-14,21-22v | DIFERENTE | L20866 | 721 |
| media | holyWeekFeria_3 | A/B/C | 2ª lectura | — | Heb 9:11-28 | FALTA EN APP | L20867 | 721 |
| alta | holyWeekFeria_3 | A/B/C | evangelio | Luke 22:39-71,23:1-53 | Matt 26:1-5,14-25 | DIFERENTE | L20869 | 721 |
| media | maundyThursday | A/B/C | salmo | Psalm 116:1-2 | Ps 78:15-26v | DIFERENTE | L20875 | 722 |
| media | easter | A/B/C | salmo | Psalm 118:1-2 | Ps 118:14-17,22-24 | PARCIAL (J=0) | L20934 | 723 |
| media | easter | B | 2ª lectura | 1 Corinthians 15:1-11 | Col 3:1-4 or Acts 10:34-43 | DIFERENTE | L20937 | 723 |
| media | easter | C | 2ª lectura | 1 Corinthians 15:19-26 | Col 3:1-4 or Acts 10:34-43 | DIFERENTE | L20937 | 723 |
| alta | easter2 | B | 1ª lectura | Acts 4:32-35 | Acts 3:12a, 13-15,17-26 or Isa 26:1-9,19 | DIFERENTE | L20996 | 724 |
| media | easter2 | C | 1ª lectura | Acts 5:27-32 | Acts 5:12a, 17-22, 25-29 or Job 42:1-6 | PARCIAL (J=0.2) | L20996 | 724 |
| media | easter2 | A | salmo | Psalm 16 | Ps 111 | DIFERENTE | L21000 | 724 |
| media | easter2 | B | salmo | Psalm 133 | Ps 111 | DIFERENTE | L21000 | 724 |
| media | easter2 | C | salmo | Psalm 118:14-29 | Ps 111 | DIFERENTE | L21000 | 724 |
| media | easter2 | B | 2ª lectura | 1 John 1:1-2:2 | 1 John 5:1-5 | DIFERENTE | L21001 | 724 |
| media | easter2 | C | 2ª lectura | Revelation 1:4-8 | Rev 1:(1-8)9-19 | PARCIAL (J=0.26) | L21001 | 724 |
| alta | easter3 | B | 1ª lectura | Acts 3:12-19 | Acts 4:5-14 or Mic 4:1-5 | DIFERENTE | L21003 | 724 |
| media | easter3 | C | 1ª lectura | Acts 9:1-6 | Acts 9:1-19a or Jer 32:36-41 | PARCIAL (J=0.32) | L21003 | 724 |
| media | easter3 | A | salmo | Psalm 116:1-4 | Ps 116:11-16v | PARCIAL (J=0) | L21007 | 724 |
| media | easter3 | B | salmo | Psalm 4 | Ps 98 or 98:1-5 | DIFERENTE | L21008 | 724 |
| media | easter3 | C | salmo | Psalm 30 | Ps 33 or 33:1-11v | DIFERENTE | L21007 | 724 |
| media | easter3 | B | 2ª lectura | 1 John 3:1-7 | 1 John 1:1-2:2 | DIFERENTE | L21009 | 724 |
| media | easter3 | C | 2ª lectura | Revelation 5:11-14 | Rev 5:(1-5)6-14 | PARCIAL (J=0.29) | L21009 | 724 |
| alta | easter4 | A | 1ª lectura | Acts 2:42-47 | Acts 6:1-9, 7:2a,51-60 or Neh 9:(1-3)6-15 | DIFERENTE | L21013 | 724 |
| alta | easter4 | B | 1ª lectura | Acts 4:5-12 | Acts 4:(23-31)32-37 or Ezek 34:1-10 | DIFERENTE | L21013 | 724 |
| alta | easter4 | C | 1ª lectura | Acts 9:36-43 | Acts 13:14b-16, 26-39 or Num 27:12-23 | DIFERENTE | L21013 | 724 |
| media | easter4 | C | salmo | Psalm 23 | Ps 100 | DIFERENTE | L21018 | 724 |
| media | easter4 | B | 2ª lectura | 1 John 3:16-24 | 1 John 3:1-10 | DIFERENTE | L21021 | 724 |
| alta | easter5 | A | 1ª lectura | Acts 7:55-60 | Acts 17:1-15 or Deut 6:20-25 | DIFERENTE | L21024 | 724 |
| alta | easter5 | C | 1ª lectura | Acts 11:1-18 | Acts 13:44-52 or Lev 19:1-2,9-18 | DIFERENTE | L21024 | 724 |
| media | easter5 | A | salmo | Psalm 31:1-5 | Ps 66:1-11v or 66:1-8v | DIFERENTE | L21026 | 724 |
| media | easter5 | B | salmo | Psalm 22:24-30 | Ps 66:1-11v or 66:1-8v | DIFERENTE | L21026 | 724 |
| media | easter5 | C | salmo | Psalm 148 | Ps 145 or 145:1-9v | DIFERENTE | L21026 | 724 |
| media | easter5 | B | 2ª lectura | 1 John 4:7-21 | 1 John 3:(11-17)18-24 | DIFERENTE | L21027 | 724 |
| media | easter5 | C | 2ª lectura | Revelation 21:1-6 | Rev 19:1-9 | DIFERENTE | L21027 | 724 |
| alta | easter5 | B | evangelio | John 15:1-8 | John 14:15-21 | DIFERENTE | L21029 | 724 |
| alta | easter6 | B | 1ª lectura | Acts 10:44-48 | Acts 11:19-30 or Isa 45:11-13,18-19(20-25) | DIFERENTE | L21030 | 724 |
| alta | easter6 | C | 1ª lectura | Acts 16:9-15 | Acts 14:8-18 or Joel 2:21-27 | DIFERENTE | L21031 | 724 |
| media | easter6 | A | salmo | Psalm 66:7-18 | Ps 148 or 148:7-14 | DIFERENTE | L21037 | 724 |
| media | easter6 | B | salmo | Psalm 98 | Ps 33 or 33:1-8,18-22v | DIFERENTE | L21039 | 724 |
| media | easter6 | A | 2ª lectura | 1 Peter 3:13-22 | 1 Pet 3:8-18 | PARCIAL (J=0.4) | L21040 | 724 |
| media | easter6 | B | 2ª lectura | 1 John 5:1-6 | 1 John 4:7-21 | DIFERENTE | L21042 | 724 |
| alta | easter6 | A | evangelio | John 14:15-21 | John 15:1-11 | DIFERENTE | L21043 | 724 |
| media | easter7 | B | salmo | Psalm 1 | Ps 68:1-20 or 47 | DIFERENTE | L21056 | 724 |
| media | easter7 | C | salmo | Psalm 97 | Ps 68:1-20 or 47 | DIFERENTE | L21056 | 724 |
| media | easter7 | A | 2ª lectura | 1 Peter 4:12-14 | 1 Pet 4:12-19 | PARCIAL (J=0.38) | L21057 | 724 |
| media | easter7 | C | 2ª lectura | Revelation 22:12-14 | Rev 22:10-21 | PARCIAL (J=0.25) | L21057 | 724 |
| media | pentecost | B | 2ª lectura | Romans 8:22-27 | Acts 2:1-11(12-21) or 1 Cor 12:4-13 | DIFERENTE | L21066 | 725 |
| media | pentecost | C | 2ª lectura | Romans 8:14-17 | Acts 2:1-11(12-21) or 1 Cor 12:4-13 | DIFERENTE | L21066 | 725 |
| alta | pentecost | A | evangelio | John 20:19-23 | John 14:8-17 | DIFERENTE | L21073 | 725 |
| alta | pentecost | B | evangelio | John 15:26-27 | John 14:8-17 | DIFERENTE | L21073 | 725 |
| alta | trinitySunday | B | 1ª lectura | Isaiah 6:1-8 | Ex 3:1-6 | DIFERENTE | L21077 | 725 |
| alta | trinitySunday | C | 1ª lectura | Proverbs 8:1-4 | Isa 6:1-7 | DIFERENTE | L21077 | 725 |
| media | trinitySunday | A | salmo | Psalm 8 | Ps 150 | DIFERENTE | L21079 | 725 |
| media | trinitySunday | B | salmo | Psalm 29 | Ps 93 | DIFERENTE | L21079 | 725 |
| media | trinitySunday | C | salmo | Psalm 8 | Ps 29 | DIFERENTE | L21079 | 725 |
| media | trinitySunday | A | 2ª lectura | 2 Corinthians 13:11-13 | 2 Cor 13:5-14 | PARCIAL (J=0.3) | L21080 | 725 |
| media | trinitySunday | C | 2ª lectura | Romans 5:1-5 | Rev 4:1-11 | DIFERENTE | L21080 | 725 |


---

## 6. Equivalentes (para revisar, sobre todo los `corte-debil`)

No son errores de lectura, sino cortes de versículos distintos. 92 filas de tabla. Los `corte-debil` (0,5 ≤ J < 0,7) tienen la mitad o menos de versículos comunes: por ejemplo Misa de Ceniza (Mt 6:1-6 sin los vv. 16-21, que son el pasaje del ayuno) y Epifanía 1 A 2ª (Hch 10:34-43 frente a 34-38).

| clave app | ciclo | campo | valor app | valor libro (tal cual) | tipo | J | línea md |
|---|---|---|---|---|---|---|---|
| advent1 | B | 1ª lectura | Isaiah 63:19,64:1-8 | Isa 64:1-9a | numeracion | 0.8 | L20585 |
| advent1 | C | 2ª lectura | 1 Thessalonians 3:9-13 | 1 Thess 3:6-13 | corte-debil | 0.63 | L20591 |
| advent1 | C | evangelio | Luke 21:25-36 | Luke 21:25-33 | corte | 0.75 | L20594 |
| advent2 | B | salmo | Psalm 85:8-13 | Ps 85 | salmo-porcion | 1 | L20597 |
| advent2 | A | 2ª lectura | Romans 15:4-13 | Rom 15:1-13 | corte | 0.77 | L20599 |
| advent2 | B | 2ª lectura | 2 Peter 3:8-15 | 2 Pet 3:8-18 | corte | 0.73 | L20599 |
| advent3 | A | salmo | Psalm 146:4-9 | Ps 146 | salmo-porcion | 1 | L20606 |
| advent3 | B | 2ª lectura | 1 Thessalonians 5:16-24 | 1 Thess 5:12-28 | corte-debil | 0.53 | L20608 |
| advent3 | C | 2ª lectura | Philippians 4:4-7 | Phil 4:4-9 | corte-debil | 0.67 | L20608 |
| advent3 | A | evangelio | Matthew 11:2-11 | Matt 11:2-19 | corte-debil | 0.56 | L20610 |
| advent3 | C | evangelio | Luke 3:7-18 | Luke 3:7-20 | corte | 0.86 | L20610 |
| advent4 | A | 1ª lectura | Isaiah 7:10-16 | Isa 7:10-17 | corte | 0.88 | L20613 |
| advent4 | B | 1ª lectura | 2 Samuel 7:1-11 | 2 Sam 7:1-17 | corte-debil | 0.65 | L20613 |
| advent4 | C | 1ª lectura | Micah 5:1-4 | Mic 5:2-5a | numeracion | 0.6 | L20613 |
| advent4 | C | 2ª lectura | Hebrews 10:5-10 | Heb 10:1-10 | corte-debil | 0.6 | L20616 |
| christmas | A/B/C | 1ª lectura | Isaiah 9:1-6 | Isa 9:1-7 | corte | 0.86 | L20623 |
| christmas | A/B/C | evangelio | Luke 2:1-20 | Luke 2:1-14(15-20) | opcional | 1 | L20627 |
| christmasSunday | B | 1ª lectura | Isaiah 61:10-62:3 | Isa 61:10—62:5 | corte | 0.71 | L20636 |
| epiphany | A/B/C | 1ª lectura | Isaiah 60:1-6 | Isa 60:1-9 | corte-debil | 0.67 | L20662 |
| epiphany | A/B/C | salmo | Psalm 72:1-7 | Ps 72 or 72:1-11 | salmo-porcion | 1 | L20664 |
| epiphany | A/B/C | 2ª lectura | Ephesians 3:1-12 | Eph 3:1-13 | corte | 0.92 | L20665 |
| epiphany1 | A | 2ª lectura | Acts 10:34-43 | Acts 10:34-38 | corte-debil | 0.5 | L20677 |
| epiphany1 | B | evangelio | Mark 1:4-11 | Mark 1:7-11 | corte-debil | 0.63 | L20678 |
| epiphany2 | B | 1ª lectura | 1 Samuel 3:1-10 | 1 Sam 3:1-20 | corte-debil | 0.5 | L20679 |
| epiphany2 | B | 2ª lectura | 1 Corinthians 6:12-20 | 1 Cor 6:9-20 | corte | 0.75 | L20683 |
| epiphany3 | C | 1ª lectura | Nehemiah 8:1-10 | Neh 8:1-12 | corte | 0.83 | L20688 |
| epiphany3 | A | 2ª lectura | 1 Corinthians 1:10-18 | 1 Cor 1:10-17 | corte | 0.89 | L20693 |
| epiphany3 | C | 2ª lectura | 1 Corinthians 12:12-31 | 1 Cor 12:12-27 | corte | 0.8 | L20693 |
| epiphany3 | A | evangelio | Matthew 4:12-23 | Matt 4:12-22 | corte | 0.92 | L20696 |
| epiphany4 | B | 1ª lectura | Deuteronomy 18:15-20 | Deut 18:15-22 | corte | 0.75 | L20698 |
| epiphany4 | C | evangelio | Luke 4:21-30 | Luke 4:21-32 | corte | 0.83 | L20704 |
| epiphany5 | A | 2ª lectura | 1 Corinthians 2:1-12 | 1 Cor 2:1-16 | corte | 0.75 | L20717 |
| epiphany6 | B | 1ª lectura | 2 Kings 5:1-14 | 2 Kings 5:1-15a | corte | 0.93 | L20721 |
| epiphany6 | A | salmo | Psalm 119:1-8 | Ps 119:(1-8)9-16 | corte-debil | 0.5 | L20724 |
| epiphany7 | C | 1ª lectura | Genesis 45:3-11 | Gen 45:3-11,21-28 | corte-debil | 0.53 | L20732 |
| epiphany7 | C | salmo | Psalm 37:1-12 | Ps 37:(1-7)8-17v | corte | 0.71 | L20733 |
| epiphany8 | A | 1ª lectura | Isaiah 49:8-16 | Isa 49:8-18(19-23) | corte-debil | 0.56 | L20745 |
| epiphany8 | B | 1ª lectura | Hosea 2:16-22 | Hos 2:14-23 | corte | 0.7 | L20745 |
| epiphany8 | B | salmo | Psalm 103:1-13 | Ps 103 or 103:1-14 | salmo-porcion | 1 | L20747 |
| epiphany8 | C | salmo | Psalm 92:1-4 | Ps 92 | salmo-porcion | 1 | L20747 |
| ashWednesday | A/B/C | evangelio | Matthew 6:1-6 | Matt 6:1-6, 16-21 | corte-debil | 0.5 | L20773 |
| lent1 | C | 1ª lectura | Deuteronomy 26:1-11 | Deut 26:(1-4)5-11 | opcional | 1 | L20775 |
| lent1 | B | salmo | Psalm 25:1-9 | Ps 25 or 25:3-9 | salmo-porcion | 1 | L20778 |
| lent1 | C | salmo | Psalm 91:1-2 | Ps 91 or 91:9-16 | salmo-porcion | 1 | L20778 |
| lent1 | A | 2ª lectura | Romans 5:12-19 | Rom 5:12-21 | corte | 0.8 | L20781 |
| lent1 | C | 2ª lectura | Romans 10:8-13 | Rom 10:4-13 | corte-debil | 0.6 | L20780 |
| lent2 | C | 1ª lectura | Genesis 15:1-12 | Gen 15:1-18 | corte-debil | 0.67 | L20784 |
| lent2 | A | evangelio | John 3:1-17 | John 3:1-16 | corte | 0.94 | L20793 |
| lent2 | C | evangelio | Luke 13:31-35 | Luke 13:(22-30)31-35 | opcional | 1 | L20793 |
| lent3 | B | 1ª lectura | Exodus 20:1-17 | Ex 20:1-21 | corte | 0.81 | L20796 |
| lent3 | B | salmo | Psalm 19 | Ps 19:7-14 | salmo-porcion | 1 | L20799 |
| lent3 | A | evangelio | John 4:5-42 | John 4:5-26(27-38)39-42 | opcional | 1 | pdf-only |
| lent3 | C | evangelio | Luke 13:1-9 | Luke 13:1-9(10-17) | opcional | 1 | L20804 |
| lent4 | A | 2ª lectura | Ephesians 5:8-14 | Eph 5:1-14 | corte-debil | 0.5 | L20818 |
| lent4 | C | 2ª lectura | 2 Corinthians 5:16-21 | 2 Cor 5:17-21 | corte | 0.83 | L20821 |
| lent4 | A | evangelio | John 9:1-41 | John 9:1-13, 28-38 (39-41) | corte-debil | 0.66 | pdf-only |
| lent5 | B | salmo | Psalm 51:1-13 | Ps 51 or 51:10-15v | salmo-porcion | 1 | L20827 |
| lent5 | C | 2ª lectura | Philippians 3:4-14 | Phil 3:7-16 | corte-debil | 0.62 | L20828 |
| lent5 | A | evangelio | John 11:1-45 | John 11:(1-17)18-44 | corte | 0.98 | L20829 |
| lent5 | B | evangelio | John 12:20-33 | John 12:20-33(34-36) | opcional | 1 | L20829 |
| palmSunday | A | evangelio | Matthew 26:14-27:66 | Matt (26:36-75) 27:1-54 (55-66) | corte | 0.83 | pdf-only |
| palmSunday | B | evangelio | Mark 14:1-15:47 | Mark (14:32-72) 15:1-39 (40-47) | corte | 0.74 | pdf-only |
| palmSunday | C | evangelio | Luke 22:14-23:56 | Luke (22:39-71) 23:1-49 (50-56) | corte | 0.78 | pdf-only |
| holyWeekFeria_1 | A/B/C | evangelio | John 12:1-9 | John 12:1-11 or Mark 14:3-9 | corte | 0.82 | L20853 |
| maundyThursday | A/B/C | 2ª lectura | 1 Corinthians 11:23-26 | 1 Cor 11:23-26(27-34) | opcional | 1 | L20877 |
| maundyThursday | A/B/C | evangelio | John 13:1-17 | John 13:1-15 or Luke 22:14-30 | corte | 0.88 | L20879 |
| goodFriday | A/B/C | salmo | Psalm 22:1-11 | Ps 22:1-11(12-21)v or Ps 40:1-16v or Ps 69:1-22v | opcional | 1 | L20884 |
| goodFriday | A/B/C | evangelio | John 18:1-19:37 | John (18:1-40) 19:1-37 | opcional | 1 | L20890 |
| holySaturday | A/B/C | 1ª lectura | Job 14:1-14 | Job 14:1-17 | corte | 0.82 | L20891 |
| easter | A | evangelio | John 20:1-18 | John 20:1-10(11-18) or Matt 28:1-10 | opcional | 1 | L20941 |
| easter2 | A | 1ª lectura | Acts 2:14,22-32 | Acts 2:14a,22-32 or Gen 8:6-16, 9:8-16 | opcional | 1 | L20996 |
| easter3 | A | 1ª lectura | Acts 2:14,36-41 | Acts 2:14a,36-47 or Isa 43:1-12 | corte-debil | 0.54 | L21003 |
| easter3 | A | 2ª lectura | 1 Peter 1:17-23 | 1 Pet 1:13-25 | corte-debil | 0.54 | L21009 |
| easter3 | B | evangelio | Luke 24:36-48 | Luke 24:36-49 | corte | 0.93 | L21011 |
| easter3 | C | evangelio | John 21:1-19 | John 21:1-14 | corte | 0.74 | L21011 |
| easter4 | A | 2ª lectura | 1 Peter 2:19-25 | 1 Pet 2:13-25 | corte-debil | 0.54 | L21021 |
| easter4 | B | evangelio | John 10:11-18 | John 10:11-16 | corte | 0.75 | L21023 |
| easter5 | A | 2ª lectura | 1 Peter 2:2-10 | 1 Pet 2:1-12 | corte | 0.75 | L21027 |
| easter6 | A | 1ª lectura | Acts 17:22-31 | Acts 17:(16-21)22-34 or Isa 41:17-20 | corte-debil | 0.53 | L21031 |
| easter6 | C | 2ª lectura | Revelation 21:10,21:22-22:5 | Rev 21:1-4,22-22:5 | corte-debil | 0.69 | L21040 |
| easter6 | C | evangelio | John 14:23-29 | John 14:21-29 | corte | 0.78 | L21043 |
| easter7 | A | 1ª lectura | Acts 1:6-14 | Acts 1:(1-5)6-14 or Ezek 39:21-29 | opcional | 1 | L21052 |
| easter7 | B | 1ª lectura | Acts 1:15-17,21-26 | Acts 1:15-26 or Ex 28:1-4,9-10,29-30 | corte | 0.75 | L21052 |
| easter7 | A | salmo | Psalm 68:1-10 | Ps 68:1-20 or 47 | corte-debil | 0.5 | L21056 |
| easter7 | B | 2ª lectura | 1 John 5:9-13 | 1 John 5:6-15 | corte-debil | 0.5 | L21057 |
| easter7 | B | evangelio | John 17:6-19 | John 17:11b-19 | corte-debil | 0.64 | L21058 |
| pentecost | A/B/C | 1ª lectura | Acts 2:1-21 | Gen 11:1-9 or Acts 2:1-11(12-21) | opcional | 1 | L21065 |
| pentecost | A/B/C | salmo | Psalm 104:25-35 | Ps 104:24-35v | corte | 0.92 | L21067 |
| pentecost | A | 2ª lectura | 1 Corinthians 12:3-13 | Acts 2:1-11(12-21) or 1 Cor 12:4-13 | corte | 0.91 | L21066 |
| trinitySunday | A | 1ª lectura | Genesis 1:1-2:4 | Gen 1:1—2:3 | corte | 0.97 | L21077 |
| trinitySunday | B | evangelio | John 3:1-17 | John 3:1-16 | corte | 0.94 | L21081 |
| trinitySunday | C | evangelio | John 16:12-15 | John 16:(5-11)12-15 | opcional | 1 | L21081 |


---

## 7. Claves ausentes

### 7.1 Días o servicios que el libro tiene y el app no (13)

| clave del libro | día | p. libro | líneas md | qué hace el app hoy |
|---|---|---|---|---|
| christmasDay2 | Christmas Day II | 718 | L20628-L20631 | Solo existe la clave christmas (= Día I). El Día II (Isa 62:6-12; Sal 97; Tit 3:4-7; Lc 2:(1-14)15-20) no existe. |
| christmasDay3 | Christmas Day III | 718 | L20632-L20635 | Idem: Día III (Isa 52:7-12; Sal 98; Heb 1:1-12; Jn 1:1-18) no existe. |
| worldMission | The Second to Last Sunday of Epiphany: World Mission (sustituye a cualquier domingo de Epifanía salvo el primero y el último) | 720 | L20755-L20758 | No existe; es un propio opcional que el libro permite en cualquier domingo de Epifanía salvo el primero y el último. |
| palmSundayPalms | Palm Sunday: Liturgy of the Palms (evangelio de la entrada + salmo) | 721 | L20832-L20835 | palmSunday trae solo el propio de la Pasión; falta el Evangelio de la entrada (Mt 21:1-11 / Mr 11:1-11a / Lc 19:29-40) y el Sal 118:19-29. |
| easterVigil | The Great Vigil of Easter (12 lecturas AT; el servicio sigue con Epístola y Evangelio) | 722 | L20914-L20915 | No hay clave; calendar.js tampoco distingue la Vigilia (el Sábado Santo muestra holySaturday). Lecturas AT en md L20898-L20913, Epístola y Evangelio L20914-L20915; salmos y cánticos en la liturgia especial L16494-L16609. |
| easterEarly | Easter Day: early service | 723 | L20925-L20927 | No hay clave (el app solo tiene el servicio principal bajo easter). Rúbrica y lecturas en md L20922-L20927. |
| easterEvening | Easter Day: evening service | 723 | L20945-L20949 | No hay clave. |
| easterMon | Monday of Easter Week | 723 | L20950-L20955 | calendar.js emite easterFeria1_1; no está en SUNDAY, así que resolveLectionaryKey toma prestadas las lecturas de easter (Domingo de Pascua) con el ciclo del domingo. |
| easterTue | Tuesday of Easter Week | 723 | L20957-L20962 | Idem (easterFeria1_2 → easter). |
| easterWed | Wednesday of Easter Week | 723 | L20964-L20969 | Idem (easterFeria1_3 → easter). |
| easterThu | Thursday of Easter Week | 723 | L20971-L20976 | Idem (easterFeria1_4 → easter). |
| easterFri | Friday of Easter Week | 723 | L20978-L20983 | Idem (easterFeria1_5 → easter). |
| easterSat | Saturday of Easter Week | 723 | L20985-L20990 | Idem (easterFeria1_6 → easter). |


El calendario las trata así: las ferias de Pascua (`easterFeria1_N`) toman prestadas las lecturas del Domingo de Pascua con `resolveLectionaryKey` (app.js l. 35-41), con lo que el lunes a sábado de la octava muestran Hechos 10:34-43 y las demás lecturas del Domingo, y no las propias del libro. La simulación 2024-2060 (13.515 días) cuenta 222 días en esa octava (6 por año × 37 años). Las otras ferias de Pascua, de Adviento, de Cuaresma, etc. no tienen lecturas propias en esta tabla del libro y no se cuentan.

### 7.2 Claves del app sin entrada en el libro

Ninguna dentro del alcance: las 41 claves tienen su día. Una aclaración: `circumcision` (`Numbers 6:22-27` / Sal 8 / `Galatians 4:4-7` / Lc 2:15-21) no la emite `calendar.js` (0 apariciones en 2024-2060): el 1 de enero sale con la clave `01-01`, que cae en el alcance del otro agente. Contra el libro (Circuncisión y Santo Nombre, p. 718, md L20647-20652: `Ex 34:1-9`, Ps 8, `Rom 1:1-7`, `Luke 2:15-21`), la clave `circumcision` coincide en salmo y evangelio y difiere en 1ª y 2ª. `01-01` del app trae `Numbers 6:22-27` y `Philippians 2:5-11`: también distintas de las del libro en 1ª y 2ª lectura (lo anoto para el otro agente; no lo audité).

---

## 8. Alternativas del libro que el app ignora

71 grupos (día, ciclo, campo) del libro ofrecen más de una opción. De ellos 44 son alternativas de lectura distinta (no solo «salmo completo o porción»); el app ofrece una sola. La columna «estado» compara el valor del app con la mejor de las opciones del libro. Lista:

| clave app | ciclo | campo | alternativas del libro | valor app | estado | línea md |
|---|---|---|---|---|---|---|
| advent3 | B | evangelio | John 3:22-30 or John 1:19-28 | John 1:6-8 | DIFERENTE | L20609 |
| christmasSunday2 | A | evangelio | Luke 2:41-52 or Matt 2:1-12 | John 1:1-18 | DIFERENTE | L20659 |
| christmasSunday2 | B | evangelio | Matt 2:13-23 or Matt 2:1-12 | John 1:1-18 | DIFERENTE | L20659 |
| christmasSunday2 | C | evangelio | Luke 2:22-40 or Matt 2:1-12 | John 1:1-18 | DIFERENTE | L20659 |
| ashWednesday | A/B/C | 1ª lectura | Joel 2:1-2, 12-17 or Isa 58:1-12 | Joel 2:1-2 | PARCIAL | L20764 |
| holyWeekFeria_1 | A/B/C | evangelio | John 12:1-11 or Mark 14:3-9 | John 12:1-9 | EQUIVALENTE | L20853 |
| holyWeekFeria_2 | A/B/C | evangelio | John 12:37-38,42-50 or Mark 11:15-19 | John 13:21-38 | DIFERENTE | L20862 |
| maundyThursday | A/B/C | evangelio | John 13:1-15 or Luke 22:14-30 | John 13:1-17 | EQUIVALENTE | L20879 |
| goodFriday | A/B/C | 1ª lectura | Gen 22:1-18 or Isa 52:13—53:12 | Isaiah 52:13-53:12 | IGUAL | L20882 |
| goodFriday | A/B/C | salmo | Ps 22:1-11(12-21)v or Ps 40:1-16v or Ps 69:1-22v | Psalm 22:1-11 | EQUIVALENTE | L20884 |
| holySaturday | A/B/C | salmo | Ps 130 or 31:1-6v | Psalm 130 | IGUAL | L20893 |
| holySaturday | A/B/C | evangelio | Matt 27:57-66 or John 19:38-42 | Matthew 27:57-66 | IGUAL | L20895 |
| easter | A | 1ª lectura | Acts 10:34-43 or Ex 14:10-14,21-31 | Acts 10:34-43 | IGUAL | L20928 |
| easter | A | 2ª lectura | Col 3:1-4 or Acts 10:34-43 | Colossians 3:1-4 | IGUAL | L20937 |
| easter | A | evangelio | John 20:1-10(11-18) or Matt 28:1-10 | John 20:1-18 | EQUIVALENTE | L20941 |
| easter | B | 1ª lectura | Acts 10:34-43 or Isa 25:6-9 | Acts 10:34-43 | IGUAL | L20928 |
| easter | B | 2ª lectura | Col 3:1-4 or Acts 10:34-43 | 1 Corinthians 15:1-11 | DIFERENTE | L20937 |
| easter | C | 1ª lectura | Acts 10:34-43 or Isa 51:9-11 | Acts 10:34-43 | IGUAL | L20928 |
| easter | C | 2ª lectura | Col 3:1-4 or Acts 10:34-43 | 1 Corinthians 15:19-26 | DIFERENTE | L20937 |
| easter2 | A | 1ª lectura | Acts 2:14a,22-32 or Gen 8:6-16, 9:8-16 | Acts 2:14,22-32 | EQUIVALENTE | L20996 |
| easter2 | B | 1ª lectura | Acts 3:12a, 13-15,17-26 or Isa 26:1-9,19 | Acts 4:32-35 | DIFERENTE | L20996 |
| easter2 | C | 1ª lectura | Acts 5:12a, 17-22, 25-29 or Job 42:1-6 | Acts 5:27-32 | PARCIAL | L20996 |
| easter3 | A | 1ª lectura | Acts 2:14a,36-47 or Isa 43:1-12 | Acts 2:14,36-41 | EQUIVALENTE | L21003 |
| easter3 | B | 1ª lectura | Acts 4:5-14 or Mic 4:1-5 | Acts 3:12-19 | DIFERENTE | L21003 |
| easter3 | C | 1ª lectura | Acts 9:1-19a or Jer 32:36-41 | Acts 9:1-6 | PARCIAL | L21003 |
| easter4 | A | 1ª lectura | Acts 6:1-9, 7:2a,51-60 or Neh 9:(1-3)6-15 | Acts 2:42-47 | DIFERENTE | L21013 |
| easter4 | B | 1ª lectura | Acts 4:(23-31)32-37 or Ezek 34:1-10 | Acts 4:5-12 | DIFERENTE | L21013 |
| easter4 | C | 1ª lectura | Acts 13:14b-16, 26-39 or Num 27:12-23 | Acts 9:36-43 | DIFERENTE | L21013 |
| easter5 | A | 1ª lectura | Acts 17:1-15 or Deut 6:20-25 | Acts 7:55-60 | DIFERENTE | L21024 |
| easter5 | B | 1ª lectura | Acts 8:26-40 or Deut 4:32-40 | Acts 8:26-40 | IGUAL | L21024 |
| easter5 | C | 1ª lectura | Acts 13:44-52 or Lev 19:1-2,9-18 | Acts 11:1-18 | DIFERENTE | L21024 |
| easter6 | A | 1ª lectura | Acts 17:(16-21)22-34 or Isa 41:17-20 | Acts 17:22-31 | EQUIVALENTE | L21031 |
| easter6 | B | 1ª lectura | Acts 11:19-30 or Isa 45:11-13,18-19(20-25) | Acts 10:44-48 | DIFERENTE | L21030 |
| easter6 | C | 1ª lectura | Acts 14:8-18 or Joel 2:21-27 | Acts 16:9-15 | DIFERENTE | L21031 |
| ascension | A/B/C | salmo | Ps 47 or 110:1-5 | Psalm 47 | IGUAL | L21048 |
| ascension | A/B/C | evangelio | Luke 24:44-53 or Mark 16:9-20 | Luke 24:44-53 | IGUAL | L21050 |
| easter7 | A | 1ª lectura | Acts 1:(1-5)6-14 or Ezek 39:21-29 | Acts 1:6-14 | EQUIVALENTE | L21052 |
| easter7 | A | salmo | Ps 68:1-20 or 47 | Psalm 68:1-10 | EQUIVALENTE | L21056 |
| easter7 | B | 1ª lectura | Acts 1:15-26 or Ex 28:1-4,9-10,29-30 | Acts 1:15-17,21-26 | EQUIVALENTE | L21052 |
| easter7 | B | salmo | Ps 68:1-20 or 47 | Psalm 1 | DIFERENTE | L21056 |
| easter7 | C | 1ª lectura | Acts 16:16-34 or 1 Sam 12:19-24 | Acts 16:16-34 | IGUAL | L21052 |
| easter7 | C | salmo | Ps 68:1-20 or 47 | Psalm 97 | DIFERENTE | L21056 |
| pentecost | A/B/C | 1ª lectura | Gen 11:1-9 or Acts 2:1-11(12-21) | Acts 2:1-21 | EQUIVALENTE | L21065 |
| pentecost | A/B/C | 2ª lectura | Acts 2:1-11(12-21) or 1 Cor 12:4-13 | 1 Corinthians 12:3-13 | EQUIVALENTE | L21066 |


Las alternativas «salmo completo o porción» (por ejemplo `Ps 80 or 80:1-7v`) son los otros 27 grupos del conjunto; el app suele traer la porción.

---

## 9. Discrepancias internas del libro (no del app)

En mi alcance el libro se contradice a sí mismo en estos puntos; conviene saberlo antes de corregir:

| lugar | tabla del leccionario | liturgia especial |
|---|---|---|
| Domingo de Ramos, evangelio de las Palmas C | `Luke 19:29-40` (PDF p.729, md L20832) | `luke 19:28-40` (md L15733) |
| Domingo de Ramos, salmo | `Ps 22:1-21v or Ps 22:1-11v` (L20840) | `psalm 22:1-22v, 22:1-11v or 31:10-18v` (L15785) |
| Sábado Santo, 1ª lectura | `Job 14:1-17` (L20891) | `job 14:1-14` (L16298) |
| Sábado Santo, salmo | `Ps 130 or 31:1-6v` (L20893) | `psalm 130 or 88 or 31:1-6v` (L16299) |
| Epifanía 7 C, salmo | `Ps 37:(1-7)8-17v` (L20733 y PDF p.727) | en la tabla de los Propios (Propio 2 C, otro agente) dice `Ps 37:(1-6)7-17v` (L21094) |

Dato al margen: el app usa `Job 14:1-14` (coincide con la liturgia especial, no con la tabla). Y la opción «31:10-18v» de la liturgia especial de Ramos es el único lugar del libro donde aparece el Sal 31 ese día; el app (RCL) trae 31:9-16, que no coincide exactamente con ninguna de las dos fuentes del libro.

---

## 10. Matriz por día

Código por campo (orden 1ª · salmo · 2ª · evangelio): I = IGUAL, E = EQUIVALENTE, P = PARCIAL, D = DIFERENTE, F = FALTA EN APP.

| clave app | A (1ª·sal·2ª·ev) | B | C | alta | media | baja |
|---|---|---|---|---|---|---|
| advent1 | IIII | EIII | DDEE | 1 | 1 | 3 |
| advent2 | IPEI | IEEI | DIDI | 1 | 2 | 3 |
| advent3 | IEPE | DIED | IDEE | 2 | 2 | 5 |
| advent4 | EDII | EDII | EDEP | 0 | 4 | 4 |
| christmas | EIIE | EIIE | EIIE | 0 | 0 | 6 |
| christmasSunday | DDDD | EDPD | DDDD | 5 | 6 | 1 |
| circumcision | DIDI | DIDI | DIDI | 3 | 3 | 0 |
| christmasSunday2 | IIID | IIID | IIID | 3 | 0 | 0 |
| epiphany | EEEI | EEEI | EEEI | 0 | 0 | 9 |
| epiphany1 | IDEI | DDDE | DDDP | 2 | 6 | 2 |
| epiphany2 | DIII | EDEI | IDII | 1 | 2 | 2 |
| epiphany3 | DDEE | DDDI | EDEI | 2 | 4 | 4 |
| epiphany4 | IDII | EIII | IPDE | 0 | 3 | 2 |
| epiphany5 | DDEI | DDII | DDII | 3 | 3 | 1 |
| epiphany6 | DEII | EDII | IIII | 1 | 1 | 2 |
| epiphany7 | PDII | IDII | EEII | 0 | 3 | 2 |
| epiphany8 | EDII | EEPI | DEII | 1 | 2 | 4 |
| transfiguration | IDDI | DDDI | IIDI | 1 | 5 | 0 |
| ashWednesday | PIIE | PIIE | PIIE | 0 | 3 | 3 |
| lent1 | PDEI | IEII | EEEI | 0 | 2 | 5 |
| lent2 | PDPE | DDDI | EIIE | 1 | 5 | 3 |
| lent3 | IIDE | EEDI | DDIE | 1 | 3 | 4 |
| lent4 | IIEE | DDID | PDED | 3 | 3 | 3 |
| lent5 | IIDE | IEPE | IIED | 1 | 2 | 4 |
| palmSunday | DDIE | DDIE | DDIE | 3 | 3 | 3 |
| holyWeekFeria_1 | DDFE | DDFE | DDFE | 3 | 6 | 3 |
| holyWeekFeria_2 | DDFD | DDFD | DDFD | 6 | 6 | 0 |
| holyWeekFeria_3 | DDFD | DDFD | DDFD | 6 | 6 | 0 |
| maundyThursday | IDEE | IDEE | IDEE | 0 | 3 | 6 |
| goodFriday | IEIE | IEIE | IEIE | 0 | 0 | 6 |
| holySaturday | EIII | EIII | EIII | 0 | 0 | 3 |
| easter | IPIE | IPDI | IPDI | 0 | 5 | 1 |
| easter2 | EDII | DDDI | PDPI | 1 | 6 | 1 |
| easter3 | EPEI | DDDE | PDPE | 1 | 6 | 4 |
| easter4 | DIEI | DIDE | DDII | 3 | 2 | 2 |
| easter5 | DDEI | IDDD | DDDI | 3 | 5 | 1 |
| easter6 | EDPD | DDDI | DIEE | 3 | 4 | 3 |
| ascension | IIII | IIII | IIII | 0 | 0 | 0 |
| easter7 | EEPI | EDEE | IDPI | 0 | 4 | 5 |
| pentecost | EEED | EEDD | EEDI | 2 | 2 | 7 |
| trinitySunday | EDPI | DDIE | DDDE | 2 | 5 | 3 |


---

## 11. Ambigüedades de extracción y cómo se resolvieron

| dónde | problema en el md | resolución |
|---|---|---|
| Adviento 3 B (L20602-20612) | 1ª, salmo, 2ª y evangelio de la columna B flotan fuera de la tabla | PDF p.725, columna B (`Isa 65:17-25`, `Ps 126`, `1 Thess 5:12-28`, `John 3:22-30 or John 1:19-28`) |
| Epifanía 2 C salmo, Epifanía 3 A salmo, Epifanía 4 B salmo (L20681, L20689, L20700) | salmos sueltos tras la tabla | PDF p.727, columnas C, A y B respectivamente |
| Epifanía 5 B (L20711-20720) | la columna B se parte en tres fragmentos | PDF p.727 col. B: `2 Kings 4:8-21(22-31)32-37`, `Ps 142`, `1 Cor 9:16-23`, `Mark 1:29-39` |
| Cuaresma 1 a 4 (L20774-20824) | celdas partidas y desplazadas (`Gen 2:4-9, 15-17, 25—3:7`, `John 4:5-26(27-38)39-42`, `John 9:1-13, 28-38 (39-41)`, `Josh (4:19-24) 5:1(2-8)9-12`) | PDF p.728-729, columnas por coordenada |
| Ramos, Pasión (L20845-20846) | cada Pasión ocupa dos líneas | PDF p.729: `Matt (26:36-75) 27:1-54 (55-66)` y análogas |
| Pascua, Día principal (L20928-20944) | 1ª, salmo, 2ª y evangelio de A, B y C intercalados | PDF p.731, columnas A/B/C |
| Pascua 2 a 6 (L20996-21045) | cada «or» y la alternativa AT sueltos | PDF p.732, columnas A/B/C |
| Vigilia Pascual (L20897-20915) | lista de 12 lecturas AT sin salmos | salmos y cánticos tomados de la liturgia especial (L16494-16609) |

En todos estos casos resolví con el PDF, no a ojo; el control 2 de la sección 1 confirma el orden y la columna.

---

## 12. No pude verificar

- **Que el PDF sea la edición oficial vigente.** Los 607 valores localizados en el md coinciden con el PDF, y la paginación (p. 717-725) también, pero no tengo un tercer ejemplar impreso ni fe de erratas.
- **Numeración versicular entre el libro (inglesa) y el app (BJ).** Detecté a mano dos casos (Is 63:19/64, Miq 5). Sospecho otros en `Hosea 2:16-22` (app, Epifanía 8 B, numeración hebrea) frente a `Hos 2:14-23` (libro, inglesa) e `Isaiah 8:23-9:3` (app, Epifanía 3 A, numeración de la Vulgata/BJ); no los verifiqué contra el texto de la Biblia de Jerusalén. `lectionary.js` dice que las referencias están en inglés, pero la BJ cargada sigue la numeración hebrea; si se adoptan las referencias del libro tal cual, esos pasajes pueden imprimirse corridos.
- **Numeración de los salmos con `v`** (Nuevo Salterio Coverdale): comparé por número de salmo y rango literal; no verifiqué si el salterio del libro desplaza versículos respecto de la numeración del app (CLAUDE.md, pendiente 2).
- **Cursivas (Apócrifo) del libro.** El volcado del PDF marca cursiva en cada línea con «or», así que no sirve para identificar apócrifos; sé que `Ecclesiasticus 15:11-20` es deuterocanónico, pero no revisé si hay otros en mi alcance ni si la BJ del app los trae con esa referencia.
- **`psalmAnt`** (antífonas en español de `christmas`, `epiphany`, `ashWednesday`, `easter`, `ascension`) y los textos que el app muestra después de la referencia: no son referencias y no los comparé con nada.
- **El umbral J = 0,5** y la elección de la «mejor alternativa» son decisiones mías; las filas `corte-debil`, `salmo-porcion` y los PARCIAL (28) son las más discutibles.

---

## 13. Archivos generados (carpeta `audit\`)

- `lect1-verdad.json` — verdad extraída del libro (54 días, A/B/C × 4 campos, líneas md, `pdfOnly`, textos de las liturgias especiales).
- `lect1-diff.js` — script de diferencias (carga el app con el arnés compartido y compara).
- `lect1-diff-resultado.json` — las 492 comparaciones con estado, J, severidad y líneas, más el resumen.
- `lect1-diff-tablas.md` — tablas planas de DIFERENTES y EQUIVALENTES (sin agrupar).
- `lect1-matriz.md`, `lect1-anio-2026-27.md` — matriz por día y exposición del año B.
- `build-truth.js`, `check-columns.js`, `pdfcols.py`, `pdf-cols.txt` — reconstrucción de la tabla por columnas y su verificación.
- `sim-keys.js`, `sim-borrow.js` — simulación 2024-2060 de las claves que emite `calendar.js` y de cómo `resolveLectionaryKey` presta lecturas.
- `lect1-matriz.js`, `lect1-anio.js`, `gen-informe.js`, `informe-plantilla.md` — generación de matriz, año B 2026-27 y de este informe (las tablas de las secciones 5, 6, 7 y 8 salen del JSON, no de copia manual).
- Formato de `lect1-verdad.json`: `{ meta, days: { clave: { appKey, label, libroPagina, pdfPagina, mdLineas, cicloUnico, A:{first,psalm,second,gospel}, B:{…}, C:{…}, lineas, pdfOnly, especialesMd? } } }`; los días que el libro tiene y el app no llevan `appKey: null`.
