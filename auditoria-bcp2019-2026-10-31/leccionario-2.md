# Auditoría del leccionario — parte 2 (Propios, Todos los Santos, Cristo Rey y fiestas fijas)

App: `bcp2019/js/lectionary.js` (BCPLectionary.SUNDAY) · Libro: BCP 2019 (ACNA), «Sunday, Holy Day, and Commemoration Lectionary», pp. 716-733 · Fecha de la auditoría: 2026-10-31 · Solo lectura (ningún archivo del repositorio fue modificado).

## 1. Resumen

**El leccionario de los Propios del app no es el del libro.** De 324 campos de Propios (27 Propios × 3 ciclos × 4 lecturas) solo **90 (27,8 %) coinciden** con el libro; **234 difieren** (152 con un pasaje distinto y 82 con el mismo pasaje pero otro corte de versículos). Solo **1 de 81** domingos-ciclo (Propio 10, Ciclo C) tiene las cuatro lecturas coincidentes; en 20 no coincide ninguna. Las **fiestas fijas están mucho más cerca** del libro: de 120 campos coinciden 80 (66,7 %) y difieren 40. El mapeo fecha → Propio **sí es correcto** (ver §5), con una excepción de calendario: Todos los Santos cuando el 1 de noviembre cae en domingo (mañana, 2026-11-01). **Claves ausentes** (el libro las tiene y el app no): Propios 1 y 2 (solo días de semana), Témporas I-II, Rogativas I-II, Acción de Gracias, Día de Canadá, Día de la Independencia, Remembrance/Memorial Day y los 10 «Commons» de las conmemoraciones (§6). Del lado del app no sobra ninguna clave con lecturas, salvo `circumcision` (duplicada de `01-01`, sin uso).

Severidad (definición en §2): Propios: **65 altas**, 99 medias, 70 bajas. Fiestas fijas: **9 altas**, 10 medias, 21 bajas.

| Subconjunto | Campos | IGUAL | EQUIVALENTE | DIFERENTE: corte de versículos | DIFERENTE: pasaje distinto | FALTA EN APP | FALTA EN LIBRO | Coinciden con el libro (IGUAL+EQUIV.) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **Propios 3-29 (total)** | 324 | 80 | 10 | 82 | 152 | 0 | 0 | 90 (27,8 %) |
| Propios, Ciclo A | 108 | 20 | 0 | 26 | 62 | 0 | 0 | 20 (18,5 %) |
| Propios, Ciclo B | 108 | 20 | 3 | 27 | 58 | 0 | 0 | 23 (21,3 %) |
| Propios, Ciclo C | 108 | 40 | 7 | 29 | 32 | 0 | 0 | 47 (43,5 %) |
| Propios, 1.ª lectura | 81 | 7 | 0 | 15 | 59 | 0 | 0 | 7 (8,6 %) |
| Propios, Salmo | 81 | 8 | 7 | 3 | 63 | 0 | 0 | 15 (18,5 %) |
| Propios, 2.ª lectura | 81 | 16 | 2 | 39 | 24 | 0 | 0 | 18 (22,2 %) |
| Propios, Evangelio | 81 | 49 | 1 | 25 | 6 | 0 | 0 | 50 (61,7 %) |
| **Fiestas fijas (30, sin la clave duplicada)** | 120 | 71 | 9 | 21 | 19 | 0 | 0 | 80 (66,7 %) |
| Fiestas, 1.ª lectura | 30 | 21 | 1 | 2 | 6 | 0 | 0 | 22 (73,3 %) |
| Fiestas, Salmo | 30 | 16 | 5 | 5 | 4 | 0 | 0 | 21 (70,0 %) |
| Fiestas, 2.ª lectura | 30 | 13 | 2 | 9 | 6 | 0 | 0 | 15 (50,0 %) |
| Fiestas, Evangelio | 30 | 21 | 1 | 5 | 3 | 0 | 0 | 22 (73,3 %) |
| Clave duplicada `circumcision` (=01-01) | 4 | 2 | 0 | 0 | 2 | 0 | 0 | 2 (50,0 %) |

Por ciclo y tipo de lectura (Propios, nº de campos que coinciden con el libro de 27):

| Ciclo | 1.ª lectura | Salmo | 2.ª lectura | Evangelio |
|:-:|:-:|:-:|:-:|:-:|
| A | 0 | 0 | 4 | 16 |
| B | 2 | 5 | 4 | 12 |
| C | 5 | 10 | 10 | 22 |

Observaciones cuantitativas:

- Los 27 salmos del Ciclo A del app difieren **todos** del libro (0/27); los de B coinciden 5/27 y los de C 10/27. El salmo es el campo con menos coincidencias (15/81 en total), seguido de la 1.ª lectura (7/81).
- El Evangelio es lo que más se parece (50/81 coinciden), pero 6 evangelios de Propios son otro pasaje y 25 tienen otro corte (varios con inicio/fin distinto en 1-2 versículos, otros mucho más largos o más cortos).
- Distribución de campos coincidentes por domingo-ciclo (de 81): 0 campos → 20, 1 → 39, 2 → 16, 3 → 5, 4 → 1.
- **No hay desfase de ciclo**: cruzando el ciclo X del app con el ciclo Y del libro, las coincidencias ocurren solo en la diagonal (X = Y) — no se corrige rotando A/B/C. El ciclo A/B/C del app sí concuerda con la regla del libro (md 20549-20552: Año A empieza en el Adviento de años divisibles por 3; verificado 2019-2060, 0 discrepancias).
- El encabezado de `lectionary.js` dice que el Antiguo Testamento usa «la pista complementaria»; en los datos, las primeras lecturas del Ciclo A de los Propios 4-28 forman una lectura continua Génesis → Éxodo → Deuteronomio → Josué → Jueces (Gn 6, 12, 18, 21, 22, 24, 25, 28, 29, 32, 37, 45; Ex 1, 3, 12, 14, 16, 17, 20, 32, 33; Dt 34; Jos 3, 24; Jue 4), es decir, serie continua y no complementaria. (Observación sobre el contenido del propio archivo; no la contrasto con el RCL.) El libro, en cambio, empareja la 1.ª lectura temáticamente con el Evangelio (p. ej. Propio 26 A: Mi 3:5-12 con Mt 23:1-12).

## 2. Método, fuentes y cómo conté

**Verdad (parte A, `lect2-verdad.json`).** Tres lecturas independientes del mismo libro (el PDF y su conversión a markdown):

1. `pdftotext -layout` del PDF oficial (`ACNA BCP - 2019.pdf`, págs. PDF 733-741 = págs. del libro 725-733) leído columna por columna y transcrito a mano (el markdown fragmenta las tablas; el texto con layout del PDF las conserva alineadas).
2. `pdftotext -raw` (orden del flujo de contenido: el PDF emite las celdas una por una, rótulo → 4 lecturas del Ciclo A → 4 del B → 4 del C), parseado automáticamente (`lect2-rawparse.js`). **Resultado: 348 de 348 campos de Propios y 120 de 120 de fiestas idénticos a la transcripción manual.**
3. El markdown de markitdown (`BCP2019-en.md`): 468 referencias contrastadas; 463 aparecen verbatim; las 5 restantes son celdas partidas en dos líneas por la extracción (Job 38:1-11(12-15)+16-18 L21126/L21129; Philemon (1-3)4-+21(22-25) L21211/L21214; Ecclesiasticus 27:30—+28:7 L21216/L21219; Wisdom 1:16—2:1,+12-22 L21229/L21232; Num 11:4-6,10-17,+24-29 L21246/L21248) y se resolvieron con las fuentes 1 y 2. Además, 90 de las 116 filas día × campo de Propios se confirman como fila de tabla (A|B|C en celdas consecutivas) en el md; las 26 restantes están en los bloques desordenados de los Propios 2, 4, 7, 9, 13, 14, 16, 18-21 y se confirman por las fuentes 1-2.

Como el PDF existe en el equipo del usuario, no hizo falta marcar nada como «AMBIGUO — requiere cotejo con el PDF»: el cotejo se hizo con el PDF.

Contenido de la verdad: 29 Propios (1-29; el 1 y el 2 solo «weekdays»), 30 fiestas fijas, y 18 «días» extra que el libro tiene y el app no (§6).

**Comparación (parte B, `lect2-diff.js`).** Se normalizan abreviaturas del libro a los nombres completos del app (Isa→Isaiah, Matt→Matthew, Ecclesiasticus→Sirach, Ps→Psalm…), guiones largos (—) y cortos, y se convierten las referencias a intervalos (capítulo×1000+verso). Un campo del app se compara con cada alternativa «or» del libro y se queda con el mejor resultado. Clases:

- **IGUAL**: misma referencia normalizada (incluye coincidir con una de las alternativas «or» del libro).
- **EQUIVALENTE**: mismos versículos salvo la notación del libro: versos opcionales entre paréntesis (el app los omite), verso parcial a/b, o salmo con sufijo `v` (numeración de versículos del Salterio Nuevo Coverdale, no comparable con la del app: se compara solo el número de salmo).
- **DIFERENTE — corte**: mismo libro y los intervalos se solapan (el app lee más o menos versículos, o los desplaza).
- **DIFERENTE — pasaje distinto**: otro libro o intervalos sin solape.
- **FALTA EN APP / FALTA EN LIBRO**: celda vacía de un lado: **0 casos** en las 448 comparaciones (todas las celdas existen en ambos).

Severidad: **alta** = 1.ª lectura o Evangelio con pasaje distinto; **media** = Salmo o 2.ª lectura con pasaje distinto, y cualquier lectura con solape parcial desplazado (ni anidado ni con extremo común; hay 12, de ellas 2 evangelios: Propio 7 A y Propio 15 B); **baja** = el app es un subconjunto/superconjunto del libro o comparte un extremo (corte de versículos).

Recuento: 324 comparaciones de Propios (27 claves proper3-proper29 × A/B/C × 4 campos) + 120 de fiestas (30 claves × 4 campos; `all` = una sola lista, no por ciclo) + 4 de la clave duplicada `circumcision` = 448 filas; todas están en `lect2-diff.json`. «Coinciden» = IGUAL + EQUIVALENTE.

## 3. Tabla de coincidencias por Propio y ciclo (de 4 lecturas)

Rango de fechas = el que da el propio libro para ese Propio (md 21082-21332; págs. 725-729).

| Propio | Rango (libro) | A | B | C |
|---|---|:-:|:-:|:-:|
| Proper 3 | May 22 to May 28 | 1/4 | 0/4 | 1/4 |
| Proper 4 | May 29 to June 4 | 0/4 | 1/4 | 1/4 |
| Proper 5 | June 5 to June 11 | 1/4 | 2/4 | 2/4 |
| Proper 6 | June 12 to June 18 | 0/4 | 1/4 | 1/4 |
| Proper 7 | June 19 to June 25 | 0/4 | 1/4 | 1/4 |
| Proper 8 | June 26 to July 2 | 0/4 | 0/4 | 2/4 |
| Proper 9 | July 3 to July 9 | 0/4 | 1/4 | 1/4 |
| Proper 10 | July 10 to July 16 | 0/4 | 0/4 | 4/4 |
| Proper 11 | July 17 to July 23 | 0/4 | 1/4 | 2/4 |
| Proper 12 | July 24 to July 30 | 0/4 | 0/4 | 2/4 |
| Proper 13 | July 31 to August 6 | 1/4 | 2/4 | 2/4 |
| Proper 14 | August 7 to August 13 | 1/4 | 0/4 | 3/4 |
| Proper 15 | August 14 to August 20 | 1/4 | 0/4 | 3/4 |
| Proper 16 | August 21 to August 27 | 1/4 | 0/4 | 1/4 |
| Proper 17 | August 28 to September 3 | 0/4 | 2/4 | 1/4 |
| Proper 18 | September 4 to September 10 | 1/4 | 0/4 | 3/4 |
| Proper 19 | September 11 to September 17 | 1/4 | 0/4 | 3/4 |
| Proper 20 | September 18 to September 24 | 1/4 | 1/4 | 2/4 |
| Proper 21 | September 25 to October 1 | 1/4 | 1/4 | 1/4 |
| Proper 22 | October 2 to October 8 | 0/4 | 1/4 | 2/4 |
| Proper 23 | October 9 to October 15 | 1/4 | 1/4 | 1/4 |
| Proper 24 | October 16 to October 22 | 2/4 | 1/4 | 2/4 |
| Proper 25 | October 23 to October 29 | 2/4 | 1/4 | 1/4 |
| Proper 26 | October 30 to November 5 | 1/4 | 1/4 | 1/4 |
| Proper 27 | November 6 to November 12 | 2/4 | 2/4 | 1/4 |
| Proper 28 | November 13 to November 19 | 1/4 | 0/4 | 1/4 |
| Proper 29 | November 20 to November 26 (Christ the King) | 1/4 | 3/4 | 2/4 |

## 4. Tabla completa de DIFERENTES

Leyenda: «Línea md» es la línea de `BCP2019-en.md` donde figura el valor del libro (la más cercana al rótulo del Propio/fiesta; en las celdas partidas se citan las dos líneas). Los valores del libro se transcriben tal cual (paréntesis = versos opcionales; «v» = numeración Coverdale; «—» = rango entre capítulos). Las claves proper3-proper29 son las del app (`proper`+N = Propio N del libro).

### 4.1 Propios (234 filas: 152 pasaje distinto + 82 corte)

| Clave | Ciclo | Campo | Sev. | Tipo | Valor del app | Valor del libro | Línea md |
|---|:-:|---|:-:|---|---|---|---|
| proper3 | A | 1.ª lectura | baja | corte distinto | Isaiah 49:8-16 | Isa 49:8-18(19-23) | L21099 |
| proper3 | A | Salmo | media | pasaje distinto | Psalm 131 | Ps 62 | L21101 |
| proper3 | A | 2.ª lectura | baja | corte distinto | 1 Corinthians 4:1-5 | 1 Cor 4:1-13 | L21102 |
| proper3 | B | 1.ª lectura | baja | corte distinto | Hosea 2:16-22 | Hos 2:14-23 | L21099 |
| proper3 | B | Salmo | baja | corte distinto | Psalm 103:1-13 | Ps 103 or 103:1-14 | L21101 |
| proper3 | B | 2.ª lectura | media | solape parcial desplazado | 2 Corinthians 3:1-6 | 2 Cor 3:4-18 | L21102 |
| proper3 | B | Evangelio | baja | corte distinto | Mark 2:13-22 | Mark 2:18-22 | L21103 |
| proper3 | C | 1.ª lectura | alta | pasaje distinto | Sirach 27:4-7 | Jer 7:1-15 | L21099 |
| proper3 | C | Salmo | baja | corte distinto | Psalm 92:1-4 | Ps 92 | L21101 |
| proper3 | C | 2.ª lectura | baja | corte distinto | 1 Corinthians 15:51-58 | 1 Cor 15:50-58 | L21102 |
| proper4 | A | 1.ª lectura | alta | pasaje distinto | Genesis 6:9-22 | Deut 11:18-32 | L21105 |
| proper4 | A | Salmo | media | pasaje distinto | Psalm 46 | Ps 31 or Ps 31:18-27v | L21107 |
| proper4 | A | 2.ª lectura | media | pasaje distinto | Romans 1:16-17 | Rom 3:21-31 | L21110 |
| proper4 | A | Evangelio | baja | corte distinto | Matthew 7:21-29 | Matt 7:21-27 | L21111 |
| proper4 | B | 1.ª lectura | baja | corte distinto | Deuteronomy 5:12-15 | Deut 5:6-21 | L21105 |
| proper4 | B | 2.ª lectura | baja | corte distinto | 2 Corinthians 4:5-12 | 2 Cor 4:1-12 | L21110 |
| proper4 | B | Evangelio | baja | corte distinto | Mark 2:23-3:6 | Mark 2:23-28 | L21111 |
| proper4 | C | 1.ª lectura | baja | corte distinto | 1 Kings 8:22-23 | 1 Kings 8:22-30,41-43 | L21105 |
| proper4 | C | Salmo | baja | corte distinto | Psalm 96:1-9 | Ps 96 | L21108 |
| proper4 | C | 2.ª lectura | baja | corte distinto | Galatians 1:1-12 | Gal 1:1-10 | L21110 |
| proper5 | A | 1.ª lectura | alta | pasaje distinto | Genesis 12:1-9 | Hos 5:15—6:6 | L21116 |
| proper5 | A | Salmo | media | pasaje distinto | Psalm 33:1-12 | Ps 50 | L21117 |
| proper5 | A | 2.ª lectura | baja | corte distinto | Romans 4:13-25 | Rom 4:13-18 | L21118 |
| proper5 | B | 1.ª lectura | baja | corte distinto | Genesis 3:8-15 | Gen 3:1-21 | L21116 |
| proper5 | B | 2.ª lectura | baja | corte distinto | 2 Corinthians 4:13-5:1 | 2 Cor 4:13-18 | L21118 |
| proper5 | C | 1.ª lectura | baja | corte distinto | 1 Kings 17:8-24 | 1 Kings 17:17-24 | L21116 |
| proper5 | C | Salmo | media | pasaje distinto | Psalm 146 | Ps 30 | L21117 |
| proper6 | A | 1.ª lectura | alta | pasaje distinto | Genesis 18:1-15 | Ex 19:1-8 | L21121 |
| proper6 | A | Salmo | media | pasaje distinto | Psalm 116:1-2 | Ps 100 | L21123 |
| proper6 | A | 2.ª lectura | baja | corte distinto | Romans 5:1-8 | Rom 5:1-11 | L21124 |
| proper6 | A | Evangelio | baja | corte distinto | Matthew 9:35-10:8 | Matt 9:35—10:15 | L21125 |
| proper6 | B | 1.ª lectura | alta | pasaje distinto | 1 Samuel 15:34-16:13 | Ezek 31:1-6(7-9)10-14 | L21121 |
| proper6 | B | Salmo | media | pasaje distinto | Psalm 20 | Ps 92 | L21123 |
| proper6 | B | 2.ª lectura | media | solape parcial desplazado | 2 Corinthians 5:6-17 | 2 Cor 5:1-10 | L21124 |
| proper6 | C | 1.ª lectura | alta | pasaje distinto | 1 Kings 21:1-21 | 2 Sam 11:26—12:15 | L21121 |
| proper6 | C | Salmo | media | pasaje distinto | Psalm 5:1-8 | Ps 32:1-6(7-12) | L21123 |
| proper6 | C | 2.ª lectura | baja | corte distinto | Galatians 2:15-21 | Gal 2:11-21 | L21124 |
| proper7 | A | 1.ª lectura | alta | pasaje distinto | Genesis 21:8-21 | Jer 20:7-13 | L21127 |
| proper7 | A | Salmo | media | pasaje distinto | Psalm 86:1-10 | Ps 69:1-15(16-18)v | L21130 |
| proper7 | A | 2.ª lectura | media | pasaje distinto | Romans 6:1-11 | Rom 5:15b-19 | L21133 |
| proper7 | A | Evangelio | media | solape parcial desplazado | Matthew 10:24-39 | Matt 10:16-33 | L21136 |
| proper7 | B | 1.ª lectura | alta | pasaje distinto | 1 Samuel 17:32-49 | Job 38:1-11(12-15)16-18 | L21126+L21129 |
| proper7 | B | Salmo | media | pasaje distinto | Psalm 9:9-20 | Ps 107:1-3(4-22)23-32 | L21132 |
| proper7 | B | 2.ª lectura | media | pasaje distinto | 2 Corinthians 6:1-13 | 2 Cor 5:14-21 | L21135 |
| proper7 | C | 1.ª lectura | alta | pasaje distinto | 1 Kings 19:1-15 | Zech 12:8-10,13:1 | L21127 |
| proper7 | C | Salmo | media | pasaje distinto | Psalm 42 | Ps 63 | L21130 |
| proper7 | C | Evangelio | alta | pasaje distinto | Luke 8:26-39 | Luke 9:18-24 | L21136 |
| proper8 | A | 1.ª lectura | alta | pasaje distinto | Genesis 22:1-14 | Isa 2:10-17 | L21139 |
| proper8 | A | Salmo | media | pasaje distinto | Psalm 13 | Ps 89:1-18v | L21141 |
| proper8 | A | 2.ª lectura | media | pasaje distinto | Romans 6:12-23 | Rom 6:1-11 | L21142 |
| proper8 | A | Evangelio | baja | corte distinto | Matthew 10:40-42 | Matt 10:34-42 | L21143 |
| proper8 | B | 1.ª lectura | alta | pasaje distinto | 2 Samuel 1:1,17-27 | Deut 15:7-11 | L21139 |
| proper8 | B | Salmo | media | pasaje distinto | Psalm 130 | Ps 112 | L21141 |
| proper8 | B | 2.ª lectura | baja | corte distinto | 2 Corinthians 8:7-15 | 2 Cor 8:1-15 | L21142 |
| proper8 | B | Evangelio | baja | corte distinto | Mark 5:21-43 | Mark 5:22-43 | L21143 |
| proper8 | C | 1.ª lectura | baja | corte distinto | 1 Kings 19:15-16 | 1 Kings 19:15-21 | L21139 |
| proper8 | C | 2.ª lectura | baja | corte distinto | Galatians 5:1-25 | Gal 5:1,13-25 | L21142 |
| proper9 | A | 1.ª lectura | alta | pasaje distinto | Genesis 24:34-67 | Zech 9:9-12 | L21145 |
| proper9 | A | Salmo | media | pasaje distinto | Psalm 45:11-18 | Ps 145:1-13(14-21)v | L21147 |
| proper9 | A | 2.ª lectura | media | solape parcial desplazado | Romans 7:15-25 | Rom 7:21—8:6 | L21149 |
| proper9 | A | Evangelio | baja | corte distinto | Matthew 11:16-30 | Matt 11:25-30 | L21150 |
| proper9 | B | 1.ª lectura | alta | pasaje distinto | 2 Samuel 5:1-10 | Ezek 2:1-7 | L21145 |
| proper9 | B | Salmo | media | pasaje distinto | Psalm 48 | Ps 123 | L21148 |
| proper9 | B | Evangelio | baja | corte distinto | Mark 6:1-13 | Mark 6:1-6 | L21150 |
| proper9 | C | 1.ª lectura | baja | corte distinto | Isaiah 66:10-14 | Isa 66:10-16 | L21145 |
| proper9 | C | 2.ª lectura | baja | corte distinto | Galatians 6:1-16 | Gal 6:(1-5)6-18 | L21149 |
| proper9 | C | Evangelio | baja | corte distinto | Luke 10:1-11 | Luke 10:1-20 | L21150 |
| proper10 | A | 1.ª lectura | alta | pasaje distinto | Genesis 25:19-34 | Isa 55 | L21151 |
| proper10 | A | Salmo | media | pasaje distinto | Psalm 119:105-112 | Ps 65 | L21152 |
| proper10 | A | 2.ª lectura | media | solape parcial desplazado | Romans 8:1-11 | Rom 8:7-17 | L21153 |
| proper10 | A | Evangelio | baja | corte distinto | Matthew 13:1-9 | Matt 13:1-9,18-23 | L21154 |
| proper10 | B | 1.ª lectura | alta | pasaje distinto | 2 Samuel 6:1-19 | Amos 7:7-15 | L21151 |
| proper10 | B | Salmo | media | pasaje distinto | Psalm 24 | Ps 85 | L21152 |
| proper10 | B | 2.ª lectura | baja | corte distinto | Ephesians 1:3-14 | Eph 1:1-14(15-23) | L21153 |
| proper10 | B | Evangelio | alta | pasaje distinto | Mark 6:14-29 | Mark 6:7-13 | L21154 |
| proper11 | A | 1.ª lectura | alta | pasaje distinto | Genesis 28:10-19 | Wisdom 12:13, 16-19 | L21156 |
| proper11 | A | Salmo | media | pasaje distinto | Psalm 139:1-11 | Ps 86 | L21158 |
| proper11 | A | 2.ª lectura | baja | corte distinto | Romans 8:12-25 | Rom 8:18-25 | L21159 |
| proper11 | A | Evangelio | baja | corte distinto | Matthew 13:24-30 | Matt 13:24-30,34-43 | L21160 |
| proper11 | B | 1.ª lectura | alta | pasaje distinto | 2 Samuel 7:1-14 | Isa 57:14-21 | L21156 |
| proper11 | B | Salmo | media | pasaje distinto | Psalm 89:20-37 | Ps 22:23-31v | L21158 |
| proper11 | B | Evangelio | baja | corte distinto | Mark 6:30-34 | Mark 6:30-44 | L21160 |
| proper11 | C | 1.ª lectura | baja | corte distinto | Genesis 18:1-10 | Gen 18:1-14 | L21156 |
| proper11 | C | 2.ª lectura | media | solape parcial desplazado | Colossians 1:15-28 | Col 1:21-29 | L21159 |
| proper12 | A | 1.ª lectura | alta | pasaje distinto | Genesis 29:15-28 | 1 Kings 3:3-14 | L21162 |
| proper12 | A | Salmo | media | pasaje distinto | Psalm 105:1-11 | Ps 119:121-136 | L21165 |
| proper12 | A | 2.ª lectura | baja | corte distinto | Romans 8:26-39 | Rom 8:26-34 | L21167 |
| proper12 | A | Evangelio | baja | corte distinto | Matthew 13:31-33 | Matt 13:31-33,44-50 | L21168 |
| proper12 | B | 1.ª lectura | alta | pasaje distinto | 2 Samuel 11:1-15 | 2 Kings 2:1-15 | L21162 |
| proper12 | B | Salmo | media | pasaje distinto | Psalm 14 | Ps 114 | L21165 |
| proper12 | B | 2.ª lectura | baja | corte distinto | Ephesians 3:14-21 | Eph 3:(1-7)8-21 | L21167 |
| proper12 | B | Evangelio | alta | pasaje distinto | John 6:1-21 | Mark 6:45-52 | L21168 |
| proper12 | C | 1.ª lectura | baja | corte distinto | Genesis 18:20-32 | Gen 18:20-33 | L21162 |
| proper12 | C | 2.ª lectura | baja | corte distinto | Colossians 2:6-19 | Col 2:6-15 | L21167 |
| proper13 | A | 1.ª lectura | alta | pasaje distinto | Genesis 32:23-32 | Neh 9:16-21 | L21176 |
| proper13 | A | Salmo | media | pasaje distinto | Psalm 17:1-7 | Ps 78:(1-13)14-26v | L21177 |
| proper13 | A | 2.ª lectura | media | pasaje distinto | Romans 9:1-5 | Rom 8:35-39 | L21178 |
| proper13 | B | 1.ª lectura | alta | pasaje distinto | 2 Samuel 11:26-12:13 | Ex 16:2-4(5-8)9-15 | L21176 |
| proper13 | B | Salmo | media | pasaje distinto | Psalm 51:1-13 | Ps 78:(1-13)14-26v | L21177 |
| proper13 | C | 1.ª lectura | baja | corte distinto | Ecclesiastes 1:2,12-14,2:18-23 | Eccl 1:12—2:11 | L21176 |
| proper13 | C | 2.ª lectura | media | solape parcial desplazado | Colossians 3:1-11 | Col 3:5-17 | L21178 |
| proper14 | A | 1.ª lectura | alta | pasaje distinto | Genesis 37:1-4 | Jon 2:1-10 | L21182 |
| proper14 | A | Salmo | media | pasaje distinto | Psalm 105:1-6 | Ps 29 | L21185 |
| proper14 | A | 2.ª lectura | media | pasaje distinto | Romans 10:5-15 | Rom 9:1-5 | L21187 |
| proper14 | B | 1.ª lectura | alta | pasaje distinto | 2 Samuel 18:5-9 | Deut 8:1-10 | L21182 |
| proper14 | B | Salmo | media | pasaje distinto | Psalm 130 | Ps 34:(1-7)8-15(16-22) | L21185 |
| proper14 | B | 2.ª lectura | baja | corte distinto | Ephesians 4:25-5:2 | Eph 4:17—5:2 | L21187 |
| proper14 | B | Evangelio | baja | corte distinto | John 6:35-51 | John 6:37-51 | L21188 |
| proper14 | C | 2.ª lectura | baja | corte distinto | Hebrews 11:1-3 | Heb 11:1-16 | L21187 |
| proper15 | A | 1.ª lectura | alta | pasaje distinto | Genesis 45:1-15 | Isa 56:1-8 | L21189 |
| proper15 | A | Salmo | media | pasaje distinto | Psalm 133 | Ps 67 | L21190 |
| proper15 | A | 2.ª lectura | media | pasaje distinto | Romans 11:1-2 | Rom 11:13-24 | L21191 |
| proper15 | B | 1.ª lectura | alta | pasaje distinto | 1 Kings 2:10-12 | Prov 9:1-6 | L21189 |
| proper15 | B | Salmo | media | pasaje distinto | Psalm 111 | Ps 147 | L21190 |
| proper15 | B | 2.ª lectura | media | pasaje distinto | Ephesians 5:15-20 | Eph 5:3-14 | L21191 |
| proper15 | B | Evangelio | media | solape parcial desplazado | John 6:51-58 | John 6:53-59 | L21192 |
| proper15 | C | 2.ª lectura | media | solape parcial desplazado | Hebrews 11:29-12:2 | Heb 12:1-14 | L21191 |
| proper16 | A | 1.ª lectura | alta | pasaje distinto | Exodus 1:8-2:10 | Isa 51:1-6 | L21195 |
| proper16 | A | Salmo | media | pasaje distinto | Psalm 124 | Ps 138 | L21197 |
| proper16 | A | 2.ª lectura | media | pasaje distinto | Romans 12:1-8 | Rom 11:25-36 | L21198 |
| proper16 | B | 1.ª lectura | baja | corte distinto | Joshua 24:1-2 | Josh 24:1-2a,14-25 | L21195 |
| proper16 | B | Salmo | media | pasaje distinto | Psalm 34:15-22 | Ps 16 | L21197 |
| proper16 | B | 2.ª lectura | media | pasaje distinto | Ephesians 6:10-20 | Eph 5:15-33(6:1-9) | L21198 |
| proper16 | B | Evangelio | baja | corte distinto | John 6:56-69 | John 6:60-69 | L21199 |
| proper16 | C | 1.ª lectura | alta | pasaje distinto | Isaiah 58:9-14 | Isa 28:14-22 | L21195 |
| proper16 | C | Salmo | media | pasaje distinto | Psalm 103:1-8 | Ps 46 | L21197 |
| proper16 | C | Evangelio | alta | pasaje distinto | Luke 13:10-17 | Luke 13:22-30 | L21199 |
| proper17 | A | 1.ª lectura | alta | pasaje distinto | Exodus 3:1-15 | Jer 15:15-21 | L21201 |
| proper17 | A | Salmo | media | pasaje distinto | Psalm 105:1-6 | Ps 26 | L21202 |
| proper17 | A | 2.ª lectura | media | pasaje distinto | Romans 12:9-21 | Rom 12:1-8 | L21203 |
| proper17 | A | Evangelio | baja | corte distinto | Matthew 16:21-28 | Matt 16:21-27 | L21204 |
| proper17 | B | 2.ª lectura | media | pasaje distinto | James 1:17-27 | Eph 6:10-20 | L21203 |
| proper17 | B | Evangelio | baja | corte distinto | Mark 7:1-8 | Mark 7:1-23 | L21204 |
| proper17 | C | 1.ª lectura | alta | pasaje distinto | Jeremiah 2:4-13 | Ecclesiasticus 10:7-18 | L21201 |
| proper17 | C | Salmo | media | pasaje distinto | Psalm 81:1,10-16 | Ps 112 | L21202 |
| proper17 | C | Evangelio | baja | corte distinto | Luke 14:1-14 | Luke 14:1,7-14 | L21204 |
| proper18 | A | 1.ª lectura | alta | pasaje distinto | Exodus 12:1-14 | Ezek 33:1-11 | L21208 |
| proper18 | A | Salmo | media | pasaje distinto | Psalm 149 | Ps 119:33-48 | L21210 |
| proper18 | A | 2.ª lectura | media | pasaje distinto | Romans 13:8-14 | Rom 12:9-21 | L21212 |
| proper18 | B | 1.ª lectura | alta | pasaje distinto | Proverbs 22:1-2 | Isa 35:4-7a | L21208 |
| proper18 | B | Salmo | media | pasaje distinto | Psalm 125 | Ps 146 | L21210 |
| proper18 | B | 2.ª lectura | media | pasaje distinto | James 2:1-17 | James 1:17-27 | L21212 |
| proper18 | B | Evangelio | baja | corte distinto | Mark 7:24-37 | Mark 7:31-37 | L21214 |
| proper18 | C | 2.ª lectura | baja | corte distinto | Philemon 1:1-21 | Philemon (1-3)4-21(22-25) | L21211+L21214 |
| proper19 | A | 1.ª lectura | alta | pasaje distinto | Exodus 14:19-31 | Ecclesiasticus 27:30—28:7 | L21216+L21219 |
| proper19 | A | Salmo | media | pasaje distinto | Psalm 114 | Ps 103 or 103:1-14 | L21222 |
| proper19 | A | 2.ª lectura | baja | corte distinto | Romans 14:1-12 | Rom 14:5-12 | L21225 |
| proper19 | B | 1.ª lectura | alta | pasaje distinto | Proverbs 1:20-33 | Isa 50:4-9 | L21217 |
| proper19 | B | Salmo | media | pasaje distinto | Psalm 19 | Ps 116:1-9(10-16)v | L21220 |
| proper19 | B | 2.ª lectura | media | pasaje distinto | James 3:1-12 | James 2:1-18 | L21223 |
| proper19 | B | Evangelio | alta | pasaje distinto | Mark 8:27-38 | Mark 9:14-29 | L21226 |
| proper19 | C | 1.ª lectura | baja | corte distinto | Exodus 32:7-14 | Ex 32:1,7-14 | L21217 |
| proper20 | A | 1.ª lectura | alta | pasaje distinto | Exodus 16:2-15 | Jonah 3:10—4:11 | L21230 |
| proper20 | A | Salmo | media | pasaje distinto | Psalm 105:1-6 | Ps 145:(1-13)14-21v | L21233 |
| proper20 | A | 2.ª lectura | baja | corte distinto | Philippians 1:21-30 | Phil 1:21-27 | L21236 |
| proper20 | B | 1.ª lectura | alta | pasaje distinto | Proverbs 31:10-31 | Wisdom 1:16—2:1,12-22 | L21229+L21232 |
| proper20 | B | Salmo | media | pasaje distinto | Psalm 1 | Ps 54 | L21235 |
| proper20 | B | 2.ª lectura | media | solape parcial desplazado | James 3:13-4:3 | James 3:16—4:6 | L21238 |
| proper20 | C | 1.ª lectura | alta | pasaje distinto | Jeremiah 8:18-9:1 | Amos 8:4-12 | L21230 |
| proper20 | C | Salmo | media | pasaje distinto | Psalm 79:1-9 | Ps 138 | L21233 |
| proper21 | A | 1.ª lectura | alta | pasaje distinto | Exodus 17:1-7 | Ezek 18:1-4,25-32 | L21247 |
| proper21 | A | Salmo | media | pasaje distinto | Psalm 78:1-4 | Ps 25:1-14(15-21) | L21249 |
| proper21 | A | Evangelio | baja | corte distinto | Matthew 21:23-32 | Matt 21:28-32 | L21253 |
| proper21 | B | 1.ª lectura | baja | corte distinto | Numbers 11:4-6 | Num 11:4-6,10-17,24-29 | L21246+L21248 |
| proper21 | B | 2.ª lectura | media | pasaje distinto | James 5:13-20 | James 4:7-12(13—5:6) | L21252 |
| proper21 | B | Evangelio | baja | corte distinto | Mark 9:38-50 | Mark 9:38-48 | L21254 |
| proper21 | C | 1.ª lectura | alta | pasaje distinto | Jeremiah 32:1-3 | Amos 6:1-7 | L21246 |
| proper21 | C | Salmo | media | pasaje distinto | Psalm 91:1-6 | Ps 146 | L21248 |
| proper21 | C | 2.ª lectura | baja | corte distinto | 1 Timothy 6:6-19 | 1 Tim 6:11-19 | L21250 |
| proper22 | A | 1.ª lectura | alta | pasaje distinto | Exodus 20:1-4 | Isa 5:1-7 | L21256 |
| proper22 | A | Salmo | media | pasaje distinto | Psalm 19 | Ps 80:(1-6)7-19v | L21257 |
| proper22 | A | 2.ª lectura | media | solape parcial desplazado | Philippians 3:4-14 | Phil 3:14-21 | L21258 |
| proper22 | A | Evangelio | baja | corte distinto | Matthew 21:33-46 | Matt 21:33-44 | L21259 |
| proper22 | B | 1.ª lectura | alta | pasaje distinto | Job 1:1,2:1-10 | Gen 2:18-24 | L21256 |
| proper22 | B | Salmo | media | pasaje distinto | Psalm 26 | Ps 8 | L21257 |
| proper22 | B | 2.ª lectura | media | pasaje distinto | Hebrews 1:1-4 | Heb 2:(1-8)9-18 | L21258 |
| proper22 | C | 1.ª lectura | alta | pasaje distinto | Lamentations 1:1-6 | Hab 1:1-13, 2:1-4 | L21256 |
| proper22 | C | Salmo | media | pasaje distinto | Psalm 137 | Ps 37:1-17v | L21257 |
| proper23 | A | 1.ª lectura | alta | pasaje distinto | Exodus 32:1-14 | Isa 25:1-9 | L21262 |
| proper23 | A | Salmo | media | pasaje distinto | Psalm 106:1-6 | Ps 23 | L21265 |
| proper23 | A | 2.ª lectura | media | solape parcial desplazado | Philippians 4:1-9 | Phil 4:4-13 | L21267 |
| proper23 | B | 1.ª lectura | alta | pasaje distinto | Job 23:1-9 | Amos 5:6-15 | L21262 |
| proper23 | B | Salmo | media | pasaje distinto | Psalm 22:1-15 | Ps 90:1-12(13-17) | L21265 |
| proper23 | B | 2.ª lectura | media | pasaje distinto | Hebrews 4:12-16 | Heb 3:1-6 | L21267 |
| proper23 | C | 1.ª lectura | alta | pasaje distinto | Jeremiah 29:1,4-7 | Ruth 1:1-19a | L21262 |
| proper23 | C | Salmo | media | pasaje distinto | Psalm 66:1-11 | Ps 113 | L21265 |
| proper23 | C | 2.ª lectura | baja | corte distinto | 2 Timothy 2:8-15 | 2 Tim 2:1-15 | L21267 |
| proper24 | A | 1.ª lectura | alta | pasaje distinto | Exodus 33:12-23 | Mal 3:6-12 | L21270 |
| proper24 | A | Salmo | media | pasaje distinto | Psalm 99 | Ps 96 | L21273 |
| proper24 | B | 1.ª lectura | alta | pasaje distinto | Job 38:1-7 | Isa 53:4-12 | L21270 |
| proper24 | B | Salmo | media | pasaje distinto | Psalm 104:1-9 | Ps 91 | L21273 |
| proper24 | B | 2.ª lectura | media | pasaje distinto | Hebrews 5:1-10 | Heb 4:12-16 | L21275 |
| proper24 | C | 1.ª lectura | alta | pasaje distinto | Jeremiah 31:27-34 | Gen 32:3-8,22-30 | L21270 |
| proper24 | C | Salmo | media | pasaje distinto | Psalm 119:97-104 | Ps 121 | L21273 |
| proper25 | A | 1.ª lectura | alta | pasaje distinto | Deuteronomy 34:1-12 | Ex 22:21-27 | L21280 |
| proper25 | A | Salmo | media | pasaje distinto | Psalm 90:1-6 | Ps 1 | L21282 |
| proper25 | B | 1.ª lectura | alta | pasaje distinto | Job 42:1-6 | Isa 59:9-20 | L21280 |
| proper25 | B | Salmo | media | pasaje distinto | Psalm 34:1-8 | Ps 13 | L21282 |
| proper25 | B | 2.ª lectura | media | pasaje distinto | Hebrews 7:23-28 | Heb 5:11—6:12 | L21283 |
| proper25 | C | 1.ª lectura | alta | pasaje distinto | Joel 2:23-27,3:1-5 | Jer 14:(1-6)7-10,19-22 | L21280 |
| proper25 | C | Salmo | media | pasaje distinto | Psalm 65 | Ps 84 | L21282 |
| proper25 | C | 2.ª lectura | baja | corte distinto | 2 Timothy 4:6-8 | 2 Tim 4:6-18 | L21283 |
| proper26 | A | 1.ª lectura | alta | pasaje distinto | Joshua 3:7-17 | Mic 3:5-12 | L21298 |
| proper26 | A | Salmo | media | pasaje distinto | Psalm 107:1-7 | Ps 43 | L21301 |
| proper26 | A | 2.ª lectura | baja | corte distinto | 1 Thessalonians 2:9-13 | 1 Thess 2:9-20 | L21303 |
| proper26 | B | 1.ª lectura | alta | pasaje distinto | Ruth 1:1-18 | Deut 6:1-9 | L21298 |
| proper26 | B | Salmo | media | pasaje distinto | Psalm 146 | Ps 119:1-16 | L21301 |
| proper26 | B | 2.ª lectura | media | pasaje distinto | Hebrews 9:11-14 | Heb 7:23-28 | L21303 |
| proper26 | C | 1.ª lectura | alta | pasaje distinto | Habakkuk 1:1-4 | Isa 1:10-20 | L21298 |
| proper26 | C | Salmo | media | pasaje distinto | Psalm 119:137-144 | Ps 32 | L21301 |
| proper26 | C | 2.ª lectura | baja | corte distinto | 2 Thessalonians 1:1-4 | 2 Thess 1:1-12 | L21303 |
| proper27 | A | 1.ª lectura | alta | pasaje distinto | Joshua 24:1-3 | Amos 5:18-24 | L21311 |
| proper27 | A | Salmo | media | pasaje distinto | Psalm 78:1-7 | Ps 70 | L21312 |
| proper27 | B | 1.ª lectura | alta | pasaje distinto | Ruth 3:1-5 | 1 Kings 17:8-16 | L21311 |
| proper27 | B | Salmo | media | pasaje distinto | Psalm 127 | Ps 146 | L21312 |
| proper27 | C | 1.ª lectura | alta | pasaje distinto | Haggai 1:15-2:9 | Job 19:23-27a | L21311 |
| proper27 | C | Salmo | media | pasaje distinto | Psalm 145:1-5 | Ps 17 | L21312 |
| proper27 | C | 2.ª lectura | media | pasaje distinto | 2 Thessalonians 2:1-5 | 2 Thess 2:13—3:5 | L21313 |
| proper28 | A | 1.ª lectura | alta | pasaje distinto | Judges 4:1-7 | Zeph 1:7,12-18 | L21315 |
| proper28 | A | Salmo | media | pasaje distinto | Psalm 123 | Ps 90:1-12(13-17) | L21316 |
| proper28 | A | 2.ª lectura | baja | corte distinto | 1 Thessalonians 5:1-11 | 1 Thess 5:1-10 | L21317 |
| proper28 | B | 1.ª lectura | alta | pasaje distinto | 1 Samuel 1:4-20 | Dan 12:1-4a(4b-13) | L21315 |
| proper28 | B | Salmo | media | pasaje distinto | 1 Samuel 2:1-10 | Ps 16 | L21316 |
| proper28 | B | 2.ª lectura | media | pasaje distinto | Hebrews 10:11-25 | Heb 10:31-39 | L21317 |
| proper28 | B | Evangelio | alta | pasaje distinto | Mark 13:1-8 | Mark 13:14-23 | L21318 |
| proper28 | C | 1.ª lectura | alta | pasaje distinto | Isaiah 65:17-25 | Mal 3:13—4:6 | L21315 |
| proper28 | C | Salmo | media | pasaje distinto | Isaiah 12 | Ps 98 | L21316 |
| proper28 | C | 2.ª lectura | baja | corte distinto | 2 Thessalonians 3:6-13 | 2 Thess 3:6-16 | L21317 |
| proper29 | A | 1.ª lectura | baja | corte distinto | Ezekiel 34:11-16 | Ezek 34:11-20 | L21321 |
| proper29 | A | Salmo | media | pasaje distinto | Psalm 100 | Ps 95 | L21324 |
| proper29 | A | 2.ª lectura | media | pasaje distinto | Ephesians 1:15-23 | 1 Cor 15:20-28 | L21327 |
| proper29 | B | 2.ª lectura | baja | corte distinto | Revelation 1:4-8 | Rev 1:1-8 | L21327 |
| proper29 | C | Salmo | media | pasaje distinto | Luke 1:68-79 | Ps 46 | L21324 |
| proper29 | C | Evangelio | baja | corte distinto | Luke 23:33-43 | Luke 23:35-43 | L21330 |

### 4.2 Fiestas fijas (40 filas, más 2 de la clave duplicada `circumcision`)

La clave es `MM-DD` de `FIXED_FEASTS`. Págs. del libro 730-731 (md 21335-21482).

| Clave | Campo | Sev. | Tipo | Valor del app | Valor del libro | Línea md |
|---|---|:-:|---|---|---|---|
| 01-01 | 1.ª lectura | alta | pasaje distinto | Numbers 6:22-27 | Ex 34:1-9 | L21383 |
| 01-01 | 2.ª lectura | media | pasaje distinto | Philippians 2:5-11 | Rom 1:1-7 | L21389 |
| 01-18 | Salmo | media | pasaje distinto | Psalm 18:1-7 | Ps 23 | L21396 |
| 01-25 | Evangelio | baja | corte distinto | Matthew 10:16-22 | Matt 10:16-25 | L21412 |
| 02-24 | 2.ª lectura | baja | corte distinto | Philippians 3:13-21 | Phil 3:12-21 | L21353 |
| 03-19 | 1.ª lectura | baja | corte distinto | 2 Samuel 7:4-16 | 2 Sam 7:4,8-16 | L21357 |
| 03-19 | Evangelio | alta | pasaje distinto | Matthew 1:18-25 | Luke 2:41-52 | L21364 |
| 03-25 | 2.ª lectura | baja | corte distinto | Hebrews 10:4-10 | Heb 10:5-10 | L21373 |
| 04-25 | 2.ª lectura | baja | corte distinto | Ephesians 4:7-16 | Eph 4:7-8,11-16 | L21381 |
| 04-25 | Evangelio | alta | pasaje distinto | Mark 1:1-15 | Mark 16:15-20 | L21382 |
| 05-01 | 2.ª lectura | media | pasaje distinto | Ephesians 1:3-14 | 2 Cor 4:1-7 | L21390 |
| 05-31 | Salmo | media | pasaje distinto | Luke 1:46-55 | Ps 113 or Ecce Deus | L21397 |
| 05-31 | 2.ª lectura | media | pasaje distinto | Romans 12:9-16 | Col 3:12-17 | L21400 |
| 05-31 | Evangelio | baja | corte distinto | Luke 1:39-49 | Luke 1:39-56 | L21403 |
| 06-11 | 1.ª lectura | alta | pasaje distinto | Acts 11:19-30 | Isa 42:5-12 | L21406 |
| 06-11 | 2.ª lectura | media | pasaje distinto | Acts 4:32-37 | Acts 11:19-30,13:1-3 | L21410 |
| 06-11 | Evangelio | alta | pasaje distinto | John 15:12-16 | Matt 10:7-16 | L21413 |
| 07-22 | 1.ª lectura | alta | pasaje distinto | Song of Songs 3:1-4 | Judg 4:4-10 or Judith 9:1,11-14 | L21435 |
| 07-22 | 2.ª lectura | baja | corte distinto | 2 Corinthians 5:14-18 | 2 Cor 5:14-20a | L21437 |
| 07-25 | Salmo | baja | corte distinto | Psalm 7:1-10 | Ps 7:1-11(12-18) | L21443 |
| 08-15 | Salmo | media | pasaje distinto | Luke 1:46-55 | Ps 34 | L21461 |
| 08-24 | Salmo | baja | corte distinto | Psalm 91:1-10 | Ps 91 | L21472 |
| 08-24 | 2.ª lectura | baja | corte distinto | 1 Corinthians 4:9-15 | 1 Cor 4:9-16 | L21475 |
| 09-14 | 1.ª lectura | alta | pasaje distinto | Numbers 21:4-9 | Isa 45:21-25 | L21478 |
| 09-14 | Salmo | baja | corte distinto | Psalm 98:1-4 | Ps 98 | L21479 |
| 09-21 | 1.ª lectura | baja | corte distinto | Proverbs 3:1-6 | Prov 3:1-12 | L21419 |
| 09-21 | 2.ª lectura | baja | corte distinto | 2 Timothy 3:14-17 | 2 Tim 3:1-17 | L21424 |
| 09-29 | Salmo | baja | corte distinto | Psalm 103:19-22 | Ps 103 | L21429 |
| 10-18 | 1.ª lectura | alta | pasaje distinto | Isaiah 35:5-8 | Ecclesiasticus 38:1-14 | L21434 |
| 10-18 | 2.ª lectura | baja | corte distinto | 2 Timothy 4:5-13 | 2 Tim 4:1-13 | L21436 |
| 11-01 | Salmo | media | pasaje distinto | Psalm 34:1-10 | Ps 149 | L21464 |
| 11-01 | 2.ª lectura | media | pasaje distinto | 1 John 3:1-3 | Rev 7:9-17 or Eph 1:(11-14)15-23 | L21467 |
| 12-21 | 2.ª lectura | media | pasaje distinto | Ephesians 4:11-16 | Heb 10:35—11:1 | L21352 |
| 12-21 | Evangelio | baja | corte distinto | John 20:24-29 | John 20:19-29 | L21354 |
| 12-26 | 1.ª lectura | alta | pasaje distinto | 2 Chronicles 24:17-22 | Jer 26:1-9(10-11)12-15 | L21356 |
| 12-26 | 2.ª lectura | baja | corte distinto | Acts 6:8-7:2 | Acts 6:8—7:2a,51-60 | L21361 |
| 12-26 | Evangelio | baja | corte distinto | Matthew 23:34-39 | Matt 23:29-39 | L21363 |
| 12-27 | Salmo | baja | corte distinto | Psalm 92:1-4 | Ps 92:1-4(5-10)11-14 | L21366 |
| 12-27 | 2.ª lectura | baja | corte distinto | 1 John 1:1-9 | 1 John 1 | L21369 |
| 12-27 | Evangelio | baja | corte distinto | John 21:19-24 | John 21:9-25 or John 1:1-18 | L21372 |
| circumcision | 1.ª lectura | alta | pasaje distinto | Numbers 6:22-27 | Ex 34:1-9 | L21383 |
| circumcision | 2.ª lectura | media | pasaje distinto | Galatians 4:4-7 | Rom 1:1-7 | L21389 |

### 4.3 Clasificados EQUIVALENTE (19), para que se pueda discutir el criterio

| Clave | Campo | App | Libro | Motivo |
|---|---|---|---|---|
| proper4 B | Salmo | Psalm 81:1-10 | Ps 81:1-10(11-16) | versos opcionales entre paréntesis |
| proper7 B | Evangelio | Mark 4:35-41 | Mark 4:35-41(5:1-20) | versos opcionales entre paréntesis |
| proper9 C | Salmo | Psalm 66:1-8 | Ps 66 or 66:1-8v | sufijo v; alternativa «or» del libro |
| proper10 C | Salmo | Psalm 25:1-9 | Ps 25:1-14(15-21)v | mismo salmo; versículos en numeración Salterio Coverdale (v), no comparables con los del app |
| proper13 C | Salmo | Psalm 49:1-11 | Ps 49:1-12(13-21)v | mismo salmo; versículos en numeración Salterio Coverdale (v), no comparables con los del app |
| proper14 C | Salmo | Psalm 33:12-22 | Ps 33(1-9)10-21v | mismo salmo; versículos en numeración Salterio Coverdale (v), no comparables con los del app |
| proper16 C | 2.ª lectura | Hebrews 12:18-29 | Heb 12:(15-17)18-29 | versos opcionales entre paréntesis |
| proper19 C | Salmo | Psalm 51:1-11 | Ps 51:1-17v | mismo salmo; versículos en numeración Salterio Coverdale (v), no comparables con los del app |
| proper20 C | 2.ª lectura | 1 Timothy 2:1-7 | 1 Tim 2:1-7(8-15) | versos opcionales entre paréntesis |
| proper21 B | Salmo | Psalm 19:7-14 | Ps 19:(1-6)7-14 | versos opcionales entre paréntesis |
| 03-19 | Salmo | Psalm 89:1-4 | Ps 89:1-4(5-18)19-29v | mismo salmo; versículos en numeración Salterio Coverdale (v), no comparables con los del app |
| 03-25 | Salmo | Psalm 40:5-10 | Ps 40:1-13v or Magnificat | mismo salmo; versículos en numeración Salterio Coverdale (v), no comparables con los del app |
| 06-24 | 2.ª lectura | Acts 13:14-26 | Acts 13:14b-26 | verso parcial a/b |
| 07-22 | Salmo | Psalm 42:1-7 | Ps 42:1-7(8-15) | versos opcionales entre paréntesis |
| 09-14 | Evangelio | John 12:31-36 | John 12:31-36a | verso parcial a/b |
| 10-18 | Salmo | Psalm 147:1-7 | Ps 147:1-11v | mismo salmo; versículos en numeración Salterio Coverdale (v), no comparables con los del app |
| 10-23 | 1.ª lectura | Acts 15:12-22 | Acts 15:12-22a | verso parcial a/b |
| 11-30 | 2.ª lectura | Romans 10:8-18 | Rom 10:8b-18 | verso parcial a/b |
| 12-26 | Salmo | Psalm 31:1-5 | Ps 31:1-6(7-27)v | mismo salmo; versículos en numeración Salterio Coverdale (v), no comparables con los del app |

### 4.4 IGUAL porque coincide con una de las alternativas «or» del libro (3)

El libro ofrece las dos; el app muestra una. No es discrepancia, pero conviene saberlo si algún día se quiere ofrecer ambas.

| Clave | Campo | App | Libro | Nota |
|---|---|---|---|---|
| 11-01 | 1.ª lectura | Revelation 7:9-17 | Ecclesiasticus 44:1-14 or Rev 7:9-17 | coincide con «Rev 7:9-17» |
| 11-01 | Evangelio | Matthew 5:1-12 | Matt 5:1-12 or Luke 6:20-26(27-36) | coincide con «Matt 5:1-12» |
| 11-30 | Salmo | Psalm 19:1-6 | Ps 19 or 19:1-6 | coincide con «19:1-6» |

## 5. Parte D — numeración de los Propios y mapeo de fechas

- **Numeración del libro: Proper 1-29** (md 21082-21332). Cada Propio se define por un **rango de fechas del domingo**, p. ej. «Proper 3: Sunday from May 22 to May 28» … «Proper 29: Sunday from November 20 to November 26 (Christ the King)». Los Propios 1 y 2 (May 8-14 / May 15-21) traen solo lecturas «Weekdays following the Sunday…», no para domingo.
- **El app tiene Propios 3-29** y los mapea con `PROPER_RANGES` (calendar.js). Comprobado por código:
  - `getProperNumber` coincide con el rango del libro **en todos los días del 8 de mayo al 26 de noviembre** (años 2023 y 2024, común y bisiesto): **0 discrepancias** (el app extiende el Propio 29 hasta el 3 de diciembre y define los Propios 1-2 solo para ferias; el libro termina el 29 el 26 de nov.; no afecta a ningún domingo).
  - **Tabla de «fechas móviles» del libro** (md 20490-20533, «collect to begin with after Trinity» + «Advent Sunday»): para cada una de las **35 fechas posibles de Pascua (22 mar-25 abr)** el libro indica con qué Propio empieza el primer domingo después de Trinidad y la fecha del Adviento. El app reproduce **35 de 35** (Propio del primer domingo tras Trinidad y fecha de Adviento I).
  - **Domingos reales 2024-2060** con clave `properN`: 909 domingos, **0 fuera del rango de fechas del libro**. Ejemplos 2026: Trinidad 31 may → 7 jun = Propio 5 … 22 nov = Propio 29 (Cristo Rey) → 29 nov = Adviento I; 2027: Trinidad 23 may → 30 may = Propio 4 … 21 nov = Propio 29; 2028: Trinidad 11 jun → 18 jun = Propio 6 … 26 nov = Propio 29. Todos concuerdan con el rango del libro.
  - Propio 29 = «Cristo Rey»: el app lo etiqueta «Propio 29 — Cristo Rey»; el libro lo llama «Christ the King» (md 21332) y remite a él las «Propers for Christ the King» (md 21590). Correcto.
- **Caso obvio que falla (calendario, no lectura): Todos los Santos en domingo.** El libro lo lista entre los **Principal Feasts** («take precedence over any other day or observance», md 19330-19335) y permite además celebrarlo el domingo siguiente al 1 de noviembre. El app, en domingo, deja siempre ganar al Domingo (`calendar.js`: `dow !== 0 && FIXED_FEASTS[md]`). Resultado: **mañana, domingo 2026-11-01, `getDay` devuelve `proper26` (Ciclo A)** con Josué 3:7-17 / Salmo 107:1-7 / 1 Tes 2:9-13 / Mt 23:1-12; ni es Todos los Santos ni coincide con el Propio 26 A del libro (Mi 3:5-12 / Sal 43 / 1 Tes 2:9-20 / Mt 23:1-12). Ocurre 5 veces en 2024-2060 (2026, 2037, 2043, 2048, 2054).
- **Propios 1-2 (solo ferias).** El app no tiene `proper1`/`proper2`. En 2024-2060 solo 2 días caen en `properFeria2_N` (2035-05-21 y 2046-05-21, lunes tras Trinidad): se resuelven con las lecturas del Domingo precedente (Trinidad). **AMBIGUO**: el libro dice «Weekdays following the Sunday from May 15 to May 21», pero no aclara si eso incluye los días tras el domingo de Trinidad (que tiene lecturas propias) ni si el Propio 1 sirve a las ferias tras Pentecostés cuando este cae el 8-14 de mayo (Pascua 22-26 mar.; 2035 y 2046 en el rango). Requiere criterio litúrgico, no es verificable solo con el libro.

## 6. Parte E — fiestas fijas: ¿lecturas propias para todas?

- **Sí.** Las 30 fiestas de `FIXED_FEASTS` tienen lecturas propias en el libro (30/30; también la clave sobrante `circumcision` = Circuncisión y Santo Nombre, 1 de enero). Y el app tiene lecturas propias para las 30 (0 «FALTA EN APP»/«FALTA EN LIBRO» entre las claves comunes).
- **Fiestas que el app resuelve con las lecturas del Domingo aunque el libro tiene lecturas propias** (cuando la fecha cae en domingo): 162 apariciones entre 2024 y 2060, en las 30 fiestas (4-6 veces cada una). Desglose por el tiempo del domingo que prevalece: Después de Pentecostés/Trinidad: 86; Navidad/Epifanía: 44; Adviento: 12; Pascua: 12; Cuaresma/Semana Santa: 8. En Adviento, Cuaresma y Pascua (32 casos) el libro dice que gana el domingo (md 19363-19365), así que es correcto; en los **130 restantes** el libro dice «may be observed on that Sunday or transferred to the nearest following weekday». El app no hace ninguna de las dos cosas: la fiesta desaparece en silencio. (Criterio litúrgico del usuario. CLAUDE.md anota 165 supresiones en bcp2019; mi recuento con 2024-2060 da 162.) **Excepción no opcional: Todos los Santos (Fiesta Principal)** — ver §5.
- En día de semana, 29 de las 30 fiestas devuelven su clave propia (comprobado en el primer año 2024-2060 en que cada una cae entre lunes y sábado). La excepción es la Anunciación de 2024 (lunes de Semana Santa): el app la desplaza y deja el Lunes Santo, coherente con md 19368-19369 («No holy day … can replace the fixed propers for … Holy Week»); el destino del traslado es asunto del calendario y no lo audito.
- **Días con lecturas propias en el libro que el app NO modela** (FALTA EN APP, texto en `lect2-verdad.json` → `extraBookDays`): Proper 1 y Proper 2 (weekdays); Ember Days I y II (miércoles-viernes-sábado tras Santa Lucía, 1.º de Cuaresma, Pentecostés y Santa Cruz; md 19381-19386); Rogation Days I y II (md 19387); National Days: **Thanksgiving Day** (Canadá: 2.º lunes de octubre; EE. UU.: 4.º jueves de noviembre), Canada Day (1 jul.), Independence Day (4 jul.), Remembrance Day (Canadá, 11 nov.) / Memorial Day (EE. UU., lunes más cercano al 28 may.); y los «Commons» de las Conmemoraciones (Martyr, Missionary or Evangelist, Pastor, Teacher of the Faith, Monastic or Religious, Ecumenist, Reformer of the Church, Renewer of Society, Any I, Any II; págs. 732-733). Ninguno existe en `calendar.js` ni en `lectionary.js`. No hay «Acción de Gracias» en el app.
- **FALTA EN LIBRO**: no hay lecturas del app sin contraparte, salvo la clave `circumcision` (no la emite `calendar.js`: código muerto, ya anotado en CLAUDE.md; sus lecturas además difieren del libro, ver 4.2).
- Aclaración sobre claves no cubiertas aquí: la clave `transfiguration` (último domingo de Epifanía) y `trinitySunday` son del otro agente; esta auditoría solo cubre la fiesta fija 08-06.

## 7. Parte C — verificación manual de 15 diferencias (descartar artefactos de extracción)

Para cada una se leyó el texto del PDF (layout y flujo raw) y la línea del markdown. En las 15, la celda del flujo raw del PDF **coincide** con el valor del libro usado en la comparación; **ningún artefacto de extracción**. Las celdas partidas (4, 8, 11) se resolvieron con el PDF.

| # | Campo | App | Libro | Línea md | Texto md (literal) | Flujo raw del PDF | Coincide |
|--:|---|---|---|---|---|---|:-:|
| 1 | proper26 A · 1.ª lectura | Joshua 3:7-17 | Mic 3:5-12 | L21298 | \| \| Mic 3:5-12 \| Deut 6:1-9 \| Isa 1:10-20 \| | «Mic 3:5-12» | sí |
| 2 | proper26 A · Salmo | Psalm 107:1-7 | Ps 43 | L21301 | \| \| Ps 43 \| Ps 119:1-16 \| Ps 32 \| | «Ps 43» | sí |
| 3 | proper26 A · 2.ª lectura | 1 Thessalonians 2:9-13 | 1 Thess 2:9-20 | L21303 | \| October 30 to \| 1 Thess 2:9-20 \| Heb 7:23-28 \| 2 Thess 1:1-12 \| | «1 Thess 2:9-20» | sí |
| 4 | proper7 B · 1.ª lectura | 1 Samuel 17:32-49 | Job 38:1-11(12-15)16-18 | L21126+L21129 | (celda fragmentada en el md; ver PDF) | «Job 38:1-11(12-15) 16-18» | sí |
| 5 | proper7 C · Evangelio | Luke 8:26-39 | Luke 9:18-24 | L21136 | \| June 25 \| Matt 10:16-33 \| \| Luke 9:18-24 \| | «Luke 9:18-24» | sí |
| 6 | proper12 B · Evangelio | John 6:1-21 | Mark 6:45-52 | L21168 | \| \| Matt 13:31-33,44-50 \| Mark 6:45-52 \| Luke 11:1-13 \| | «Mark 6:45-52» | sí |
| 7 | proper28 B · Evangelio | Mark 13:1-8 | Mark 13:14-23 | L21318 | \| \| Matt 25:14-30 \| Mark 13:14-23 \| Luke 21:5-19 \| | «Mark 13:14-23» | sí |
| 8 | proper19 A · 1.ª lectura | Exodus 14:19-31 | Ecclesiasticus 27:30—28:7 | L21216+L21219 | (celda fragmentada en el md; ver PDF) | «Ecclesiasticus 27:30-- 28:7» | sí |
| 9 | proper29 A · 2.ª lectura | Ephesians 1:15-23 | 1 Cor 15:20-28 | L21327 | \| \| 1 Cor 15:20-28 \| Rev 1:1-8 \| Col 1:11-20 \| | «1 Cor 15:20-28» | sí |
| 10 | proper29 C · Salmo | Luke 1:68-79 | Ps 46 | L21324 | \| \| Ps 95 \| Ps 93 \| Ps 46 \| | «Ps 46» | sí |
| 11 | proper18 C · 2.ª lectura | Philemon 1:1-21 | Philemon (1-3)4-21(22-25) | L21211+L21214 | (celda fragmentada en el md; ver PDF) | «Philemon (1-3)4- 21(22-25)» | sí |
| 12 | 11-01 · 2.ª lectura | 1 John 3:1-3 | Rev 7:9-17 or Eph 1:(11-14)15-23 | L21467 | \| \| Luke 1:46-55 \| all saints’ day \| Rev 7:9-17 or \| | «Rev 7:9-17 or Eph 1:(11-14)15-23» | sí |
| 13 | 11-01 · Salmo | Psalm 34:1-10 | Ps 149 | L21464 | \| \| Gal 4:4-7 \| \| Ps 149 \| | «Ps 149» | sí |
| 14 | 04-25 · Evangelio | Mark 1:1-15 | Mark 16:15-20 | L21382 | Mark 16:15-20 | «Mark 16:15-20» | sí |
| 15 | 12-26 · 1.ª lectura | 2 Chronicles 24:17-22 | Jer 26:1-9(10-11)12-15 | L21356 | Jer 26:1-9(10-11)12-15 | «Jer 26:1-9(10-11)12-15» | sí |

Selección: Propio 26 A completo (relevante para el 1 nov. 2026); tres de los seis evangelios de Propios con pasaje distinto (7 C, 12 B, 28 B; los otros tres están en §4.1); las tres celdas partidas por la extracción (Job 38 B, Eclesiástico 27 A, Filemón C; las otras dos, Sabiduría 1 B y Números 11 B, siguen el mismo patrón y también las resolvió el flujo raw); Propio 29 (Cristo Rey); Todos los Santos (2.ª lectura y salmo); y dos fiestas con evangelio o 1.ª lectura distintos (San Marcos, San Esteban).

## 8. Hallazgos más graves

1. **Los Propios no son del libro**: 27,8 % de coincidencia, 65 diferencias altas (59 primeras lecturas distintas de las 81, 6 evangelios). 80 de los 81 domingos-ciclo tienen al menos una lectura distinta de la del libro; el Evangelio es lo único que se parece (61,7 %).
2. **Todos los Santos en domingo (2026-11-01, mañana)** sale como Propio 26 con lecturas que no son ni las de Todos los Santos ni las del Propio 26 del libro.
3. **Salmos**: ninguno de los 27 salmos del Ciclo A coincide; en total 66 de 81 salmos de Propios difieren. (El Propio 29 lleva además antífonas `psalmAnt` ligadas a los salmos del app: A «Sal 100» y C «Benedictus»; el libro da Sal 95 y Sal 46, así que esas antífonas dejarían de corresponder si se corrigen los salmos.)
4. **Fiestas con evangelio/1.ª lectura distintos** (9 altas): San José (Mt 1:18-25 en vez de Lc 2:41-52), San Marcos (Mc 1:1-15 en vez de Mc 16:15-20), San Bernabé (1.ª lectura Hch 11:19-30 en vez de Is 42:5-12 y evangelio Jn 15:12-16 en vez de Mt 10:7-16), Santo Nombre, María Magdalena (Cantar 3:1-4 en vez de Jue 4:4-10 o Jdt 9:1,11-14), Santa Cruz, San Lucas y San Esteban.
5. **Supresión silenciosa de fiestas fijas en domingo** (162 casos en 2024-2060; 130 fuera de Adviento/Cuaresma/Pascua, donde el libro permite celebrar o trasladar).
6. **Propios 1-2, Témporas, Rogativas, Acción de Gracias y días nacionales** del libro no existen en el app.

## 9. Restricciones para quien corrija (no aplico correcciones)

- `js/lib/biblia-wrapper.js` no tiene alias para **`Ecclesiasticus`** (usa `Sirach`→«Eclesiástico») ni para **`Judith`** (los datos de la Biblia de Jerusalén sí contienen «Judit»): hay que escribir `Sirach` y añadir el alias de Judit (07-22 ofrece «Judg 4:4-10 or Judith 9:1,11-14»). No pude ejecutar el navegador para comprobar cómo se resuelve hoy `Judith`.
- El wrapper parsea solo `libro cap:ver-ver,…`: **no admite paréntesis** (versos opcionales), letras `a/b`, `—` ni «or». Hay que decidir cómo representar los versos opcionales del libro (p. ej. «Isa 49:8-18(19-23)») o ampliar el parser. Los casos de `Isa 55` (capítulo entero) sí los admite (`chOnly`).
- Los salmos con sufijo `v` (numeración Coverdale) no se pueden trasladar a la numeración del app sin la tabla de desfase de salmos que ya figura como pendiente en CLAUDE.md (§2 «Desfase de versículos en los salmos»). Hay 8 salmos del app clasificados EQUIVALENTE por esa razón sin poder validar sus versículos.
- Respecto a la regla de CLAUDE.md «no inventar textos litúrgicos»: copiar solo referencias bíblicas del libro es legítimo; el libro no da antífonas de salmo, así que las `psalmAnt` existentes (proper29, entre otras) no tienen contraparte en el lectionary del libro.

## 10. Ambigüedades y «No pude verificar»

- **Propios 1-2** (ver §5): alcance de «Weekdays following the Sunday…» ambiguo.
- **Salmos con `v`**: no comparo los versículos (numeración del Salterio Coverdale distinta). Si coincidiera con la numeración de la Biblia de Jerusalén (que cuenta el encabezado como versículo) no lo sé; no lo verifiqué.
- **Severidad de los solapes parciales**: los clasifiqué «media» (pasaje desplazado). Se pueden reclasificar en el JSON (`sub` empieza por «solape»); son 12.
- **Verso opcional entre paréntesis**: lo trato como EQUIVALENTE si el app coincide con el texto con o sin el opcional; si el app lee otra extensión, es DIFERENTE (corte).
- **Líneas del markdown de las fiestas**: el md mezcla las dos columnas de cada página; las líneas se localizaron por búsqueda del valor más cercano al rótulo de la fiesta y verifiqué a mano 15; para refs muy cortas («Ps 1», «Ps 99») la línea podría ser la de una celda vecina idéntica, pero la verdad no depende del md (viene del PDF).
- **No pude verificar** la lectura real que se imprime en pantalla (no ejecuté `app.js`: toca el DOM; usé `getDay` y `getSundayReadings` del arnés) ni la resolución de pasajes por el wrapper de la Biblia.
- Hallazgo colateral fuera de mi alcance (para el otro agente): el comentario de `lectionary.js` (`holyWeekFeria_1/2/3`) afirma que el BCP 2019 no asigna lecturas propias al Lunes, Martes y Miércoles Santos, pero el libro sí las trae (md 20849-20867, «monday/tuesday/wednesday in holy week») y su introducción dice que hay lecturas para «the days of Holy Week and Easter Week» (md 20555-20557). Todo lo de Adviento→Trinidad es del otro agente.

## 11. Archivos (carpeta `audit`)

- `lect2-verdad.json` — verdad: 29 Propios × A/B/C × 4 lecturas, 30 fiestas, 18 días extra.
- `lect2-diff.json` — las 448 filas de comparación (clave, ciclo, campo, app, libro, clase, subtipo, severidad, línea md, página).
- `lect2-build-verdad.js`, `lect2-rawparse.js`, `lect2-rowcheck.js` — construcción y contraste de la verdad.
- `lect2-diff.js`, `lect2-extra.js`, `lect2-verify15.js`, `lect2-genreport.js` — comparación, análisis D/E, verificación de las 15 y este informe.
- `_pdf-700-760.txt`, `_pdf-raw-733-741.txt` — extracción del PDF usada como prueba.
