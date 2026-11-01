# Simulación amplia end-to-end — Libro de Oración Común 2019 (`bcp2019/`)

Fecha de la auditoría: 2026-10-31. Solo lectura sobre el repositorio (no se editó, commiteó ni sirvió nada).
Todo se ejecutó con los módulos reales cargados en un contexto `vm` de Node 24 (calendar, lectionary, propers, eucharist, utils, **app.js real**, manual, **librito-pueblo.js real**, **docx-export.js real** + `docx.iife.js`) y la **Biblia de Jerusalén real** (`biblia-de-jerusalen.min.js` + `biblia-wrapper.js`). Fecha siempre a las 12:00 local (zona del sistema: America/Mexico_City). No me apoyé en `VERIFICACION-BCP2019.md` ni en comentarios «verificado».

Carpeta de trabajo y scripts: `C:\Users\gonza\AppData\Local\Temp\claude\C--Users-gonza--claude-spares-spare-320q1O\32d60538-cb48-45dc-a1f2-a08867b44fe6\scratchpad\audit\` (salidas en `audit\out\`).

---

## 1. Cifras principales

| Medida | Resultado | Cómo se contó |
|---|---|---|
| Días simulados con `generateLiturgy()` + `buildLiturgyHTML()` reales | **13.515** (2024-01-01 a 2060-12-31) | `sim_sweep.js` |
| Excepciones (getDay o generateLiturgy) | **0** | idem |
| `console.warn`/`error` emitidos (p. ej. «Referencia cruzada muy larga») | **0** | idem |
| Días con alguna marca de fallo en el HTML (17 patrones: `[Lectura no especificada`, `no especificad`, `[Error`, `undefined`, `NaN`, `[object`, `null`, `Lectura truncada`, `no disponible`, `Referencia no reconocida`, `Libro no encontrado`, `No se encontr`, `Colecta no disponible`, `Biblia … no cargada`, `Invalid Date`…) | **0** | regex sobre el HTML de cada día. Control positivo: con la Biblia desactivada (`sim_degraded.js`) el detector SÍ salta |
| Días sin lecturas (`readings = null`) / sin primera lectura / sin evangelio | **0 / 0 / 0** (Lunes-Martes-Miércoles Santos incluidos: 37 años × 3 = 111 días con lectura) | `sim_analyze.js` |
| Texto de lectura vacío, < 150 caracteres o truncado (> 22.000) | **0** (máx. real: 13.510 car. en Mt 26:14-27:66) | idem |
| Salmo citado pero 0 versículos devueltos | **0** | idem |
| Colecta vacía / prefacio vacío | **0 / 0** | idem |
| Colecta **propia** del día | 3.127 | `COLLECTS[dayInfo.key]` |
| Colecta **tomada del domingo precedente** | **10.388** (111 de ellos son ferias de Semana Santa que sí tienen lecturas propias) | `resolveCollectKey` |
| Días que caen al respaldo `Colecta no disponible` (antes `Proper 11`) | **0** (el comentario de `propers.js` «no se dispara ningún día» es cierto) | idem |
| Días con **lecturas** prestadas (`borrowedFromSunday`) | **10.277** (5.187 ordinario, 1.429 Pascua, 1.361 Epifanía, 1.144 Cuaresma, 729 Adviento, 221 Navidad, 206 Pentecostés) | idem |
| Claves distintas emitidas por `getDay` | 367 (270 sin entrada propia en `SUNDAY`: **todas** ferias; 273 sin colecta propia: **todas** ferias) | `sim_keys.js` |
| Referencias bíblicas distintas en `BCPLectionary.SUNDAY` | **721** (193 primera lectura, 145 salmo, 189 segunda, 197 evangelio; 837 usos) | `sim_refs.js` |
| …devuelven vacío / lanzan error / no se parsean / libro no encontrado | **0 / 0 / 0 / 0** | idem |
| …con sufijos a/b/c en la cita | 0 (el wrapper no los soporta; ninguna cita los usa) | idem |
| …con algún problema (ver §4) | **59** de 721 (45 por título de salmo fundido en v.1, 7 «cortas», 9 con etiquetas de versículo repetidas por cruzar capítulo, 1 fuera de rango, solapadas entre sí) | idem |
| Librito vs liturgia principal (colecta, lecturas, salmo, antífona, prefacio, Gloria sí/no, aclamación, fracción, despedida, rúbrica de prestadas, fiesta, ciclo) | **0 divergencias en 13.515 días** | `sim_librito.js` |
| Exportación a Word (liturgia + Librito) | 186 días × 2 documentos: **76.557 trozos de texto, 0 ausentes** en el `.docx` | `sim_docx.js` (control negativo: desactivando 2 bloques en memoria detecta 1.579 ausencias) |
| HTML bien formado (main y Librito, 27.030 documentos) | 0 errores de anidamiento | `sim_html.js` |
| Invariancia por zona horaria (9 zonas con y sin DST, incl. Lord Howe y Apia) | firma idéntica del calendario 2024-2060 + resolución de lecturas/colecta | `sim_tz.js` |

Resumen: **no hay fallos mecánicos clásicos** (excepciones, vacíos, claves rotas, lecturas ausentes). Los hallazgos son de **coherencia litúrgica interna**, **texto bíblico que se muestra con adherencias** y **etiquetado**.

---

## 2. Hallazgos

Severidad: **alta** = día/lectura/colecta equivocada o ausente, o pérdida silenciosa; **media**; **baja**.

### SIM-01 (alta) — Ferias que toman colecta y lecturas de un domingo de OTRA temporada: 205 días
`resolveLectionaryKey()` / `resolveCollectKey()` usan siempre `getPreviousSunday(date)`. Cuando ese domingo pertenece a otro tiempo litúrgico, la feria hereda colecta, lecturas y rúbrica de otro tiempo (y conserva el prefacio, color y Gloria del suyo). Recuento por pares (día → domingo prestado), 2024-2060:

| Día | Domingo prestado | Días | Ejemplos |
|---|---|---|---|
| Jueves-Sábado tras Miércoles de Ceniza (`lentFeria1_4/5/6`, Cuaresma, morado, sin Gloria) | `transfiguration` (Epifanía, blanco): colecta de la Transfiguración + Evangelio de la Transfiguración | **107** | 2024-02-15/16/17 |
| Ferias 7-12 ene. antes del Bautismo (`epiphanyOctaveFeria`) | `christmasSunday`/`christmasSunday2` (Navidad) | **83** (79+4) | 2025-01-07/08/09, 2034-01-07 |
| Ferias 29-31 dic. cuando el domingo anterior es Adviento IV (`christmasFeria`, con prefacio de Navidad y Gloria) | `advent4`: colecta «Purifica nuestras conciencias… cuando tu Hijo venga» + Evangelio de Adviento | **15** | 2028-12-29, 2028-12-30, 2029-12-29 |

Evidencia: `node sim_keys.js` → sección «Lecturas prestadas con TEMPORADA distinta» (`out\keys.txt`, líneas 43-48) y `node sim_analyze.js` → «colecta prestada: pares … season distinta» (`out\analysis.txt`, líneas 51-54). Los dos recuentos coinciden (205). Ningún caso de ciclo distinto (0).
Nota: que las ferias repitan el domingo es decisión del proyecto; lo anómalo es **cruzar de temporada**.

### SIM-02 (alta) — Salmo responsorial con el TÍTULO del salmo pegado al versículo 1 (4.888 días, 36,2 %)
`PSALM_TITLE_OFFSET` solo descuenta títulos que ocupan un versículo propio. En 39 de los 98 salmos distintos citados el encabezado de la BdJ va **fundido** en el v.1 (`Sal 23: «Salmo. De David. Yahveh es mi pastor…»`, `Sal 122/126/130/131/121/123/124/125/127/133: «Canción de las subidas…»`, `Sal 15, 24, 25, 26, 27, 29, 32, 35, 37, 50, 66, 72, 78, 79, 82, 86, 87, 90, 98, 100, 103, 138, 139, 145, 14, 16, 17`). Esa cabecera se imprime como texto del Lector. Además salen impresos nombres de letras de acróstico (`Alef.`, `Bet.`, `Guímel`…) en 14 citas (`Sal 25:1-9, 34:1-8, 34:1-10, 34:15-22, 37:1-12, 111, 112, 112:1-9, 119:1-8, 119:89-96, 119:97-104, 119:105-112, 119:137-144, 145:1-5`) y un «Pausa» al final del Sal 24.
Días: Sal 29 (335), 130 (326), 23 (324), 126 (282), 15 (265), 25:1-9 (254), 32 (159), 133 (158), 16 (156), 138 (154)…; total 4.888 de 13.515.
Evidencia: `node sim_refs.js` (`out\refs.txt`, líneas 9-129) y `node sim_refs2.js` (`out\refs2.txt`, líneas 55-58).
Corrección de la documentación del proyecto: el «desfase 46–63 de 137 salmos» de CLAUDE.md **ya no se reproduce**: `PSALM_TITLE_OFFSET` es coherente en **149 de 150 salmos** (n.º de versículos de la BdJ − d = n.º de versículos ingleses estándar; única excepción conocida: Sal 13, ver SIM-09). Lo que sigue abierto es lo descrito aquí.

### SIM-03 (media) — Nombre/clave de las ferias de Cuaresma con número de semana incorrecto (802 de 1.144 = 70 %) y dependiente de la hora
En `calendar.js` (`week = Math.ceil(diffDays(F.ashWednesday, date) / 7)`) la semana se cuenta desde el **Miércoles de Ceniza**, así que el número cambia en miércoles, no en domingo; además `diffDays` redondea con 12:00 frente a 00:00 y suma 1 día. Resultado en 2026: `Miércoles de Cuaresma (semana 2)` el 25-feb (es el miércoles de la semana 1, tras el 1.º domingo del 22-feb); `Jueves de Cuaresma (semana 6)` el 26-mar (es semana 5; Cuaresma no tiene semana 6). Los jueves-sábados tras Ceniza salen como «semana 1».
Prueba de dependencia horaria: las claves de **175 días** cambian entre 12:00 y 00:00 (`lentFeria2_3 → lentFeria1_3`); a las 06:00 y 00:30 también. El UI siempre usa 12:00, así que el efecto visible es el rótulo erróneo en portada y cabecera (y en el nombre del `.docx`). Control: Pascua 0/1.429 y Adviento 0/729 mal numerados. No afecta a lecturas ni colectas (la feria las toma del domingo).
Evidencia: `node sim_edges.js` (`out\edges.txt` §G y §H).

### SIM-04 (media) — Rangos de salmo que no coinciden con el versificado usado por el wrapper
- **Sal 45:11-18** (proper9/A, 84 días): la cita excede los 17 versículos de numeración inglesa. Con `d=1` el wrapper devuelve h12-h18 etiquetados 11-17 y **omite** «Escucha, hija, mira y pon atento oído» (h11). La cabecera dice «Salmo 45:11-18». Parece cita en numeración hebrea/romana pasada por un mapeo inglés.
- **Sal 22:22-30 y 22:24-30** (lent2/B, easter5/B; 172 días): termina en «ella hablará del Señor a la edad» (la frase sigue en h32: «venidera…»).
- **Sal 146:4-9** (advent3/A, 78 días): arranca en «su soplo exhala, a su barro retorna…» (continuación de la frase del v.3) y termina en «… tuerce;».
- Otros 17 salmos terminan en coma/dos puntos (heurística, ver `out\refs2.txt` §b): 72:1-7, 37:1-12, 103:1-13, 103:1-8, 92:1-4, 31:1-5, 66:1-8, 66:1-11, 139:1-11, 105:1-6, 78:1-4, 78:1-7, 106:1-6, 18:1-7, 7:1-10, 91:1-10, 147:1-7. Son **indicios** (en poesía litúrgica un corte así puede ser legítimo); requieren cotejo con el libro.

### SIM-05 (media) — Misma lectura repetida / solapada dentro de un mismo día
- `08-15` (Santa María Virgen, 31 días): `psalm: 'Luke 1:46-55'` **y** `gospel: 'Luke 1:46-55'`: el Magníficat se lee dos veces.
- `05-31` (Visitación, 31 días): evangelio `Luke 1:39-49` (termina en mitad del Magníficat: «…Santo es su nombre») y salmo `Luke 1:46-55`: 4 versículos comunes.
Evidencia: `out\refs2.txt` líneas 1-6 (`node sim_refs2.js`). Que el cántico sirva de salmo es normal; que el evangelio sea el mismo texto, no.

### SIM-06 (media) — Lecturas que terminan a mitad de frase (sin soporte de «a/b»): 11 citas, 567 días
Terminan con coma/«;»: `Isaiah 58:1-9`, `1 Corinthians 2:1-12`, `Acts 3:12-19`, `Genesis 1:1-2:4` (v.4 entero, sin 4a), `1 Kings 8:22-23`, `2 Samuel 7:1-14`, `Jeremiah 8:18-9:1`, `Jeremiah 32:1-3`, `Acts 4:8-13`, `Luke 1:39-49`, `Acts 6:8-7:2`. Ninguna cita usa sufijos y `parseRef` no los entiende, así que el texto se corta donde acaba el versículo. Evidencia: `out\refs2.txt` §b y `out\daycounts.txt`.

### SIM-07 (media) — Colecta prestada del domingo precedente no anunciada: 10.388 días
La rúbrica de «lecturas prestadas» existe; para la colecta no hay ninguna (verificado en el HTML de los 10.388 días: ni menciona la colecta). Ya figuraba como pendiente en CLAUDE.md (cifra allí: ~10.400).

### SIM-08 (media) — Mapeo de prefacios con incoherencias internas
(`BCPPropers.getPreface`, sin cotejar con el libro; son contradicciones entre reglas del propio código.)
- `01-01` (Santo Nombre, 33 días) recibe «El Día del Señor» (`lordsDay`), preface de domingo, en un día de semana.
- `12-26/27/28` (94 días) reciben «En Cualquier Tiempo» mientras `christmasFeria` (29-31 dic., 2-5 ene.) recibe «Navidad».
- `01-18` y `01-25` (Confesión de San Pedro, Conversión de San Pablo; 62 días) y `12-27` (San Juan Apóstol) no están en `apostleFeasts`, aunque sí lo están Bernabé, Marcos y Lucas.
- 15 prefacios de `PREFACES` no los devuelve `getPreface` para ninguna clave: `dedication, baptism, marriage, burial, penitential, thanksgiving, martyr, missionary, pastor, teacher, religious, ecumenist, socialReformer, churchReformer, anyCommemoration` (`martyr`, `missionary`, `pastor` podrían servir a 12-26, 12-28, 10-23, 04-25…).
- Las ferias de Pentecostés (206 días) y las de Pascua posteriores a la Ascensión usan «En Cualquier Tiempo»/«Pascua» respectivamente (sin prefacio de Ascensión/Pentecostés): posible, a confirmar.
Evidencia: `node sim_keys.js` (`out\keys.txt` líneas 11-28) y `out\analysis.txt` líneas 201-252.

### SIM-09 (baja) — Presentación del texto bíblico
- **Versículos que la BdJ no trae**: 316 días muestran una cita con versículos inexistentes en la Biblia cargada y saltos en la numeración visible: `Mk 14:1-15:47` (118/119; etiquetas `…27,29…`), `Lk 22:14-23:56` (113/114; `…16,18…`), `Lk 22:39-71,23:1-53` (85/86), `Acts 8:26-40` (14/15), `Mk 9:38-50` (11/13), `Mt 21:33-46` (13/14). *Supuesto*: omisiones de texto crítico (Hch 8:37, Mc 9:44.46, Mt 21:44, Mc 15:28, Lc 23:17); solo vi directamente los saltos de Mc 15 y Lc 23.
- Citas que cruzan capítulo repiten numeración sin marcar el capítulo (`Mt 26:14-27:66`: 14…75, 1…66; `Gn 1:1-2:4`, `Ex 1:8-2:10`, `1 Jn 1:1-2:2`, `Jb 1:1,2:1-10`): 9 citas.
- **Sal 13** (79 días): imprime 5 versículos etiquetados 1-5 (el hebreo h6 reúne 5c-6 ingleses). Irregularidad ya anotada en el wrapper.
- Los `¡Aleluya!` finales que la BdJ guarda como «versículo 0» (Sal 105, 107, 114, 116, 117, 118, 136, 147) nunca se muestran.
- El salmo se titula «SALMO RESPONSORIAL» pero solo **10 entradas** clave/ciclo tienen antífona (`christmas, epiphany, ashWednesday, easter A/B/C, ascension, proper29 A/B/C`): **12.823 de 13.515 días** (94,9 %) llevan salmo sin respuesta del Pueblo. No inventar texto es regla del proyecto; se anota como hueco visible.

### SIM-10 (baja) — Reglas estacionales: combinaciones a revisar
Tabla completa en §3. Casos:
- **Pentecostés** (37 días): se usa la aclamación pascual **con su rúbrica impresa «Desde el día de Resurrección hasta la Víspera de Pentecostés»**, es decir, la rúbrica dice que no corresponde ese día (`isEaster` incluye `key === 'pentecost'`). Las ferias tras Pentecostés (206 días) vuelven a la aclamación estándar y a la despedida sin Aleluya (coherente con esa rúbrica, incoherente con tratar Pentecostés como Pascua).
- **Fiestas fijas en Cuaresma** (San Matías, San José, Anunciación; 77 días): Gloria **sí** (`isFixed`) pero aclamación penitencial y Fracción sin Aleluya (por `season`). Posible a propósito.
- **Fiestas fijas en Adviento** (46 días; San Andrés, Santo Tomás): Gloria sí.
- **Jueves Santo**: Gloria sí + aclamación/fracción de Cuaresma (37 días). Coherente con `shouldOmitGloria`.
- **Viernes Santo y Sábado Santo** (74 días) generan la Eucaristía completa (Gloria omitido, prefacio «Semana Santa»). No verificable sin el libro: ver «No pude verificar».
- Trinidad: `season = 'ordinary'` aunque el día anterior es `pentecost` y `seasonForDate` daría `pentecost` (etiqueta incoherente; sin efecto observable).
- Ningún caso de: aclamación pascual fuera de Pascua/Pentecostés; Aleluya en Cuaresma (comprobado también dentro de salmos y lecturas: 0); Gloria omitido en Domingo de Pascua; Pascua sin Aleluya (0 días).

### SIM-11 (baja) — Librito
- Estado: `app.js` guarda 11 campos y `librito-pueblo.js` consume exactamente esos 11 (cada uno se usa ≥ 2 veces en `generateLibrito`). **No hay pérdida silenciosa de campos** (no hay equivalente al Gradual del Misal). Verificado por lectura de código y por ejecución (0 divergencias en 13.515 días).
- La despedida con Aleluya difiere en puntuación: principal «Salgamos en el Nombre de Cristo, aleluya, aleluya. / Demos gracias a Dios, aleluya, aleluya.»; Librito «…de Cristo. Aleluya, aleluya. / …a Dios. Aleluya, aleluya.» (`out\librito.txt` líneas 69-71).
- Gloria, Credo, Confesión, Padrenuestro, Agnus Dei, Sanctus y Kyrie están **copiados a mano** en el Librito (solo 5 piezas se derivan de `BCPEucharist.PLAIN`). Hoy son idénticos al Ordinario (comprobado texto íntegro, `out\credo.txt`: Credo 907 letras = 907; los demás idénticos), pero es riesgo de deriva futura.
- El Librito no emite marcador si falta primera lectura/evangelio (hoy ocurre 0 veces); la liturgia principal sí lo hace.
- El Librito solo usa el *título* del prefacio (no `preface.text`): por diseño.

### SIM-12 (baja) — Modo degradado: sin Biblia no hay aviso
Si la Biblia no carga (XHR fallido/offline), `generateLiturgy` no falla: imprime tres veces «[Biblia de Jerusalén no cargada]», el salmo **desaparece sin ninguna rúbrica**, y el Librito arrastra los avisos. Solo el `console.warn` del loader lo indica. Evidencia: `node sim_degraded.js` (`out\degraded.log`).

### SIM-13 (baja) — Fiestas fijas suprimidas, código muerto y colectas parecidas
- 933 fiestas fijas se celebran en su fecha, 14 se trasladan (todos los destinos verificados: el día destino devuelve la fiesta, `isTransferred`), **163 se suprimen sin traslado**: 162 caen en domingo (4-6 por fiesta) y 1 en la Ascensión (Visitación, 2057-05-31). CLAUDE.md dice 165 (otro rango o recuento).
- Código/datos muertos confirmados: clave `circumcision` (lectionary y colecta; nunca emitida), 15 prefacios (SIM-08), rama `holyWeekFeria` de `resolveLectionaryKey` (inalcanzable: esas claves ya existen en `SUNDAY`), `BCPEucharist.TRISAGION` (no se usa en `app.js`), `getSundaysAfterPentecostLabel`.
- Colectas de texto casi igual (Jaccard de palabras): `epiphany8~proper17` 0,94; `transfiguration~08-06` 0,80; `proper5~proper20` 0,80; `lent5~goodFriday` 0,78; `proper17~proper23` 0,76; `proper16~proper25` 0,73; `epiphany8~proper23` 0,72; `easter6~proper21` 0,68; `easter5~05-01` 0,59. Ninguna idéntica.

### SIM-14 (informativo) — Documentación del proyecto desactualizada (verificado por ejecución)
- «bcp2019/js/lectionary.js: faltan los propios del Lunes, Martes y Miércoles Santos… 111 días con `[Primera lectura no especificada]`» → **ya no ocurre** (0 días; las tres claves existen con referencias del Misal Romano, sin antífona).
- «desfase de salmos en 46-63 de 137» → ver SIM-02 (149/150 coherentes).
- «10.400 días toman la colecta del domingo» → 10.388 en 2024-2060.

---

## 3. Variantes estacionales observadas (días, 2024-2060)

Cada línea: aclamación / Gloria / Fracción / Despedida.

| `dayInfo.season` | Días | Aclamación | Gloria | Fracción | Despedida |
|---|---|---|---|---|---|
| advent | 923 | estándar | omitido 877; sí 46 (fiestas fijas) | con [Aleluya] | sin Aleluya |
| christmas | 444 | estándar | sí | con [Aleluya] | sin Aleluya |
| epiphany | 1.752 | estándar | sí | con [Aleluya] | sin Aleluya |
| lent | 1.443 | penitencial | omitido 1.366; sí 77 (fiestas fijas) | sin Aleluya | sin Aleluya |
| holyWeek | 259 | penitencial | omitido 222; sí 37 (Jueves Santo) | sin Aleluya | sin Aleluya |
| easter | 1.813 | pascual | sí | con [Aleluya] | con Aleluya |
| pentecost | 259 | estándar 222 (ferias); pascual 37 (Pentecostés) | sí | con [Aleluya] | sin Aleluya 222; con Aleluya 37 |
| ordinary | 6.622 | estándar | sí | con [Aleluya] | sin Aleluya |

Fuente: `out\analysis.txt` líneas 254-275 (`node sim_analyze.js`). Variantes no reconocidas: 0.

Matriz temporada/color (días): advent violeta 840, rosa 37 (Gaudete), rojo 46 (fiestas); lent violeta 1.329, rosa 37 (Laetare), blanco 56, rojo 21; holyWeek violeta 148, rojo 74, blanco 37; sin colores fuera de {blanco, rojo, morado, rosa, verde}.

---

## 4. Referencias bíblicas: resultado por tipo

- 721 referencias, **ninguna** vacía, con error, no parseable o de libro desconocido. Libros deuterocanónicos: `Baruch 5:1-9` → Baruc 9/9 versículos; `Sirach 27:4-7` → 4/4 (el wrapper corrige el índice por el Prólogo; el texto devuelto es «Cuando la criba se sacude…», que corresponde a Eclesiástico 27). Cánticos usados como salmo: `Isaiah 12:2-6` 5/5, `Isaiah 12` 6/6, `Luke 1:46-55` 10/10, `Luke 1:68-79` 12/12, `1 Samuel 2:1-10` 10/10.
- Citas con coma: `Isaiah 63:19,64:1-8` → 9 versículos etiquetados 19,1…8 (correcto según la lógica del wrapper); `Revelation 21:10,21:22-22:5` → 12; `Ecclesiastes 1:2,12-14,2:18-23` → 10; `Joel 2:23-27,3:1-5` → 10; `Job 1:1,2:1-10` → 11 (el «1» aparece dos veces, uno por capítulo).
- `translateBibleReference` no deja ningún nombre de libro en inglés.
- Salmos: tabla `PSALM_TITLE_OFFSET` coherente con los recuentos ingleses estándar en 149/150 (**recuentos ingleses tomados de mi conocimiento del salterio KJV, no del proyecto**).
- Días con alguna referencia señalada en la lista de 59: 5.494 días distintos (la inmensa mayoría por SIM-02).
- Lista completa por referencia con sus usos (clave/ciclo/rol): `out\refs.txt`, `out\refs.json`.

---

## 5. Bordes y calendario (lo que SÍ está bien)

- Pascua: 0 discrepancias con el algoritmo de Oudin (1900-2100). En 2024-2060: más temprana 2035-03-25, más tardía 2038-04-25 (no se alcanza el 22-mar). Secuencias de domingos revisadas en 2025-26, 2034-35 (Pascua temprana: Propio 3 es el primero) y 2037-38 (tardía: Epifanía 8 y Propio 8 primero).
- Ciclo A/B/C: 0 días discrepantes frente a un cálculo independiente; 39 cambios de ciclo, **los 39 en el 1.º domingo de Adviento**; 2025-11-30 → A, 2025-11-29 → C; hoy (2026-10-31) → A.
- Temporadas día a día: solo las 8 transiciones canónicas (37 cada una); 0 parpadeos.
- Domingos: 1.930, todos con rango `sunday`/`principal`; ninguno cae en clave de feria; ninguna clave repetida en un mismo año litúrgico; 52 o 53 por año. Propio 29 siempre precede a Adviento I; numeración de Propios sin saltos.
- Bisiestos (2024…2060): 29-feb sin anomalías. 1-ene en los 7 días de la semana, 31-dic, 25-dic y 6-ene: claves correctas.
- Hora del día: idéntico a las 12:00, 18:00 y 23:59:59; **distinto a las 00:00, 00:30 y 06:00** (175 días, SIM-03).
- Zona horaria/DST: firma idéntica en UTC, Santiago, Nueva York, Ciudad de México, Madrid, Tokio, Auckland, Lord Howe y Apia (cada una en proceso aparte).
- Propios 1 y 2: nunca son domingo; solo ferias `properFeria2_1` (2 días); `properFeriaN` sin `null`.

---

## 6. Reproducción

Desde `audit\` (Node 24; el shell de Git Bash imprime ruido de `/etc/…` al arrancar: ignorarlo; conviene redirigir a archivo):

```
node sim_sweep.js 2024 2060          -> out\sweep.json  (13.515 registros; 8 s)
node sim_analyze.js                  -> out\analysis.txt (marcas, colectas, prefacios, variantes)
node sim_keys.js                     -> out\keys.txt     (consistencia de claves, préstamos entre temporadas)
node sim_refs.js ; node sim_refs2.js -> out\refs.txt, refs.json, refs2.txt
node sim_librito.js                  -> out\librito.txt  (campos + 13.515 días + bloques fijos)
node sim_credo.js                    -> out\credo.txt
node sim_docx.js 7 2026 2028         -> out\docx.txt     (186 días, exportador real + minidom.js)
CONTROL=1 node sim_docx.js 60 2026 2026   (control negativo en memoria)
node sim_edges.js                    -> out\edges.txt
node sim_tz.js <Zona/IANA>           -> una línea de firma por zona
node sim_html.js                     -> out\html.txt
node sim_degraded.js                 -> out\degraded.log
node sim_daycounts.js                -> out\daycounts.txt
```
Auxiliares: `sim_lib.js` (cargador vm con Biblia y app.js reales), `minidom.js` (DOM mínimo para correr `docx-export.js` sin navegador), `sim_psalms_dump.js` (volcado de los 150 salmos → `out\psalms-dump.txt`), `tmp_*.js` (sondeos puntuales; `out\spot.txt`).

Salidas clave citadas arriba (extractos):
- `out\analysis.txt`: «Días simulados: 13515 … Con excepción: 0 … Marcas de fallo: (ninguna) … Colectas: propia=3127 tomada del domingo precedente=10388 sin colecta=0».
- `out\keys.txt` l.44-47: `107 lent (lentFeriaN_N) -> epiphany (transfiguration)`, `79 epiphany (epiphanyOctaveFeria) -> christmas`, `15 christmas (christmasFeria) -> advent`, `4 … -> christmasSunday`; total 205.
- `out\refs.txt` l.132-134: «Salmos donde (nº versículos BdJ − d) = recuento inglés: 149 de 150 … Con título FUNDIDO en v.1: 39».
- `out\refs2.txt` l.56: «días con salmo: 13515; con título fundido en v.1: 4888 (36.2%)».
- `out\librito.txt` l.9: «SIN divergencias» (13.515 días).
- `out\docx-full.log`: «Átomos … liturgia principal: 45787; AUSENTES del .docx: 0 / Librito: 30770; AUSENTES: 0».
- `out\edges.txt`: «ciclo difiere … 0», «Cambios de ciclo … 39; que NO caen en el 1.º domingo de Adviento: 0», «ferias de Cuaresma … 802 (70%)».

---

## 7. No pude verificar

- **Contenido litúrgico contra el libro** (fuera de alcance por instrucción): si las citas del leccionario, el santoral, las colectas y los prefacios son los del BCP 2019. Los casos de SIM-04, SIM-05, SIM-06 y SIM-08 son indicios internos, no cotejados.
- Que los versículos ausentes de la BdJ (SIM-09) sean omisiones de texto crítico: lo supongo; solo confirmé los saltos de Mc 15 y Lc 23 en las etiquetas.
- Los recuentos ingleses de versículos por salmo vienen de mi conocimiento externo (salterio inglés estándar), no del proyecto ni de una fuente descargada.
- Si Viernes Santo/Sábado Santo deben generar una Eucaristía completa (74 días): depende del libro.
- Renderizado real en navegador (CSS, impresión, `innerText`), apertura del `.docx` en Word y comportamiento del Service Worker. El exportador se ejecutó con un DOM mínimo propio (`minidom.js`): comprobé que el texto llega al `document.xml` del `.docx` (con control negativo), no su aspecto en Word.
- Zonas horarias: probadas con ICU de Node, no con navegadores.
- Carga real de la Biblia por XHR síncrono en un navegador (cargué el módulo directamente) y el comportamiento offline real del Service Worker (solo simulé la ausencia de `_BibliaInstance`).
- `manual.js` (Manual del Oficiante) y `sw.js`: solo los leí por encima; no están en el alcance del barrido.
- Años fuera de 2024-2060.
