# Auditoría del calendario litúrgico — BCP 2019 (`bcp2019/js/calendar.js`)

Fecha de la auditoría: 2026-10-31. Solo lectura sobre el repositorio (`git status` al terminar: solo el `.claude/settings.json` sin seguimiento que ya existía). Todo lo escrito está en `…\scratchpad\audit\` con prefijo `cal_`.

**Fuente de autoridad:** `BCP2019-en.md` (libro oficial EN convertido con markitdown). Se cita por número de línea del markdown (`l.NNNNN`) y, cuando el pie de página lo permite, por página del libro (`p.`). Pie de página = número que aparece al final de cada página en el markdown; la página de una línea es la del primer pie que la sigue.
**Qué NO usé como autoridad:** `VERIFICACION-BCP2019.md`, comentarios «verificado» del código, `LOC-faltantes.md` (otro libro).
**Método:** (a) lectura del libro, pp. 687-715 (calendario, tablas), pp. 598-640 (rúbricas de las Colectas del Año Cristiano, que contienen reglas de calendario) y pp. 716-733 (leccionario dominical); (b) ejecución de `BCPCalendar` en el arnés Node (siempre a las 12:00 locales, como hace `app.js`, que usa `T12:00:00`); (c) comparación contra un algoritmo de Pascua independiente (Oudin 1940 y Gauss) y contra las tablas impresas del libro, parseadas del markdown.

---

## 1. Resumen

| Severidad | Cantidad | IDs |
|---|---|---|
| Alta (el día litúrgico sale mal o ausente) | 8 | CAL-01 … CAL-08 |
| Media (rango, nombre, regla sin base) | 3 | CAL-09, CAL-10, CAL-11 |
| Baja (cosmético / opcional no implementado / documentación) | 7 | CAL-12 … CAL-18 |
| **Total** | **18** | |

Lo más importante, en una frase cada uno:

1. **CAL-01** — Todos los Santos (Fiesta Principal) desaparece cuando el 1 de noviembre cae en domingo: **mañana, domingo 2026-11-01, el app imprime «Propio 26»**. Pasa 5 de 37 años (2024-2060).
2. **CAL-02** — Los Días Santos que caen en domingo no se observan ni se trasladan (el libro permite una de las dos): 121 apariciones perdidas en 2024-2060 solo en los tiempos donde el libro lo permite (162 en total, ver desglose).
3. **CAL-07** — Las ferias que siguen a Pentecostés y a la Trinidad reutilizan la colecta y las lecturas de esos domingos, cosa que el libro prohíbe expresamente (415 días en 37 años); además faltan `proper1`/`proper2`.
4. **CAL-04/05/06** — Jue-Sáb tras Ceniza (111 días), Vie-Sáb tras la Ascensión (70) y 29-31 dic. antes del 1.er domingo de Navidad (15) heredan del domingo equivocado; el libro nombra el día del que heredan.
5. **CAL-03** — Navidad en domingo ⇒ el 1 de enero (domingo) sale como «1.er domingo de Navidad»; el libro dice 2.º domingo de Navidad o Santo Nombre (4 de 37 años).

**Verificado y correcto (detalle en §6):** Pascua 120/120 años contra la tabla del libro y 301/301 contra Oudin; las 6 columnas de la «Tabla de fechas móviles» (pp. 714-715) en 120 años sin una discrepancia; ciclo A/B/C (15.341 días, 0 diferencias); los 29 rangos de Propio; las 32 fechas rojas del libro presentes.

---

## 2. Tabla maestra de hallazgos

| ID | Sev. | Hallazgo | Evidencia en el app | Evidencia en el libro |
|---|---|---|---|---|
| CAL-01 | Alta | Todos los Santos en domingo se pierde; además su rango sale `holyDay` en vez de `principal` | `calendar.js:392-398` (fiestas fijas solo `dow !== 0`), `:203` (entrada `11-01`) | l.19330-19340 (p.688), l.20267 (p.709), l.17483-17492 (p.622) |
| CAL-02 | Alta | Día Santo en domingo: ni se observa ni se traslada | `calendar.js:392-398`, `:347-349` | l.19363-19365 (p.689) |
| CAL-03 | Alta | 1-ene en domingo (Navidad en domingo) sale como 1.er domingo de Navidad | `calendar.js:342-349` | l.16835-16836 (p.600) |
| CAL-04 | Alta | Jue-Sáb tras Miércoles de Ceniza usan colecta/lecturas del domingo anterior (Transfiguración) | `calendar.js:325-328`; `app.js:35-41, 49-54` | l.16987-16988 (p.605) |
| CAL-05 | Alta | Vie-Sáb tras la Ascensión usan las del Domingo de Pascua VI | `calendar.js:310-313`; `app.js:35-41, 49-54` | l.17230-17231 (p.613) |
| CAL-06 | Alta | 29-31 dic. antes del 1.er domingo de Navidad toman Adviento IV | `calendar.js:357-365`; `app.js:35-41, 49-54` | l.16832-16834 (p.600) |
| CAL-07 | Alta | Ferias tras Pentecostés y tras Trinidad usan colecta/lecturas de Pentecostés/Trinidad; faltan Propios 1-2 | `calendar.js:407-410, 413-420`; `app.js:35-54`; `propers.js:23-66` | l.17261-17269 (p.614), l.17281-17297 (p.615), l.21082-21098 (p.725) |
| CAL-08 | Alta (costura) | Semana de Pascua (6 días) y Semana Santa (Lun-Mié): colecta y lecturas propias del libro no se resuelven | `calendar.js:289-291, 310-313`; `app.js:43-54`; `lectionary.js:143-157` | l.17046-17070 (pp.607-608), l.17130-17176 (pp.610-611), l.20847-20870 (p.721), l.20951-20990 (p.723) |
| CAL-09 | Media | Regla de traslado «a la semana tras Pascua II» atribuida al BCP 2019: no está en el libro; fiestas perdidas contra Ceniza/Ascensión sin traslado | `calendar.js:211-246` | l.19368-19369 (p.689): solo dice que no pueden reemplazar; no hay destino |
| CAL-10 | Media | Número de semana de las ferias de Cuaresma erróneo (70,1 % a las 12:00) | `calendar.js:325-328`, `:42-46` | El libro no numera semanas de Cuaresma; l.16987-16988 |
| CAL-11 | Media | 24-dic (Christmas Eve) sale como «Jueves de Adviento (semana 4)» | `calendar.js:335-338` | l.16814-16821 (p.599) |
| CAL-12 | Baja | Ember Days, Rogation Days, días nacionales, conmemoraciones, antífonas «O», Fieles Difuntos, Septuagésima…, Domingo Mundial de Misión, Domingo de Todos los Santos: no implementados | (ausentes) | l.19366-19413, l.19381-19389, l.20268-20270, l.20389-20409 |
| CAL-13 | Baja | `season:'pentecost'` no existe en el libro; Pentecostés es el día 50 de Pascua | `calendar.js:263, 302, 407-410` | l.17262 (p.614), l.19376 (p.689) |
| CAL-14 | Baja | Clave `properFeriaN_d` calcula N por la fecha de la feria, no por la del domingo de su semana | `calendar.js:413-420` | l.17282 etc. («Week of the Sunday from…») |
| CAL-15 | Baja | `getDay` da resultado distinto a las 00:00 que a las 12:00 (175 días en 2024-2060) | `calendar.js:42-46, 326` | — |
| CAL-16 | Baja | Nombres: falta «Circuncisión» el 1-ene; «Laetare»/«Gaudete» ajenos al libro; Domingo de Rogación sin rotular | `calendar.js:179, 323, 333, 348, 299` | l.19425-19429, l.16844-16845, l.17214-17215 |
| CAL-17 | Baja | Comentarios del código atribuyen al libro reglas que no están / siguen diciendo que el libro no estaba disponible | `calendar.js:12-16, 175-177, 211-220` | ver CAL-09 |
| CAL-18 | Baja (info) | El libro no especifica ningún color litúrgico: los 5 colores del app no son verificables | `calendar.js` (todos los `mk(...)`) | grep de colores: 0 resultados |

---

## 3. Detalle de cada hallazgo

### CAL-01 — Todos los Santos en domingo (ALTA)

- **Qué hace el app.** Las fiestas fijas solo se emiten si `dow !== 0` (`calendar.js:395`); el comentario de `:392-394` declara que «en domingo, el domingo siempre prevalece». `11-01` está en `FIXED_FEASTS` (`:203`) y se emite con `rank:'holyDay'` (`:397`). Resultado verificado: `getDay(2026-11-01)` devuelve `{key:'proper26', name:'Proper 26', rank:'sunday', color:'green'}`. Ocurre en **2026, 2037, 2043, 2048, 2054** (5 de 37 años de 2024-2060; 17 de 120 en 2001-2120). En los 32 años restantes sí sale `11-01`, pero con rango `holyDay` en vez de `principal`.
- **Qué dice el libro.** l.19330-19335 (p.688): Todos los Santos, 1 de noviembre, figura entre las **siete Fiestas Principales**, y estas «take precedence over any other day or observance». l.19336-19340: puede además celebrarse el domingo siguiente (adicional, no sustitutivo). Calendario: l.20267 (p.709). Colecta propia: l.17483-17492 (p.622). Lecturas: l.21285-21296 (p.728).
- **Contraste interno:** el propio app ya trata así a Navidad (`:341`, `md === '12-25'`) y Epifanía (`:368`, `md === '01-06'`), que sí funcionan en domingo.
- **Corrección propuesta (no aplicada).** Resolver `md === '11-01'` antes de las ramas de domingo/Propio, con `rank:'principal'`, `key:'11-01'`, igual que 12-25 y 01-06. Opcional: bandera para observar también el «domingo siguiente» (l.19336-19338). Dejar `FIXED_FEASTS['11-01']` para lecturas/colecta.

### CAL-02 — Día Santo en domingo: ni se observa ni se traslada (ALTA)

- **Qué hace el app.** Con `dow === 0` el domingo prevalece y la fiesta no aparece ningún día del año (`:395`; y en Navidad el rango Dec 26-31 devuelve `christmasSunday`, `:347-349`).
- **Qué dice el libro.** l.19363-19365 (p.689): cualquiera de los Días Santos que caiga en domingo, *salvo en Adviento, Cuaresma y Pascua*, **puede observarse ese domingo o trasladarse al día laborable siguiente más próximo**. El libro no contempla suprimirla.
- **Cuantificación** (`cal_sun.js`, `cal_sim.js` [C]; 30 fiestas × 37 años = 1.110 apariciones, 2024-2060): 933 mostradas, 14 trasladadas por Semana Santa/Pascua, **162 suprimidas por domingo**, 1 perdida contra Ascensión (2057-05-31). Desglose de las 162:
  - **121** en tiempo ordinario, Epifanía o Navidad (el libro permite observar o trasladar), según el domingo que las desplaza: Propios 77, Epifanía 20, Transfiguración 3, 1.er domingo de Navidad 21 (San Esteban 6, San Juan 5, Inocentes 6, Santo Nombre 4). Por fiesta, de 2 a 6 apariciones cada una (Visitación solo 2 porque 3 de sus 5 domingos los ocupa la Trinidad).
  - **29** en Adviento/Cuaresma/Pascua/Semana Santa: el libro las excluye de la opción; **no dice si se trasladan** → *AMBIGUO* (no se puede decidir con el texto).
  - **7** legítimas (ganan Fiestas Principales: Trinidad 4, Pascua 3).
  - **5** son CAL-01 (Todos los Santos).
- **2026-2027** (verificado día a día): se pierden 2026-01-18 (Confesión de Pedro), 2026-01-25 (Conversión de Pablo), 2026-10-18 (San Lucas), 2026-12-27 (San Juan); 2027-07-25 (Santiago), 2027-08-15 (Santa María), 2027-12-26 (San Esteban); más 2027-04-25 (San Marcos, en Pascua V: caso ambiguo) y, por precedencia legítima, 2026-05-31 (Visitación bajo la Trinidad).
- **Nota sobre CLAUDE.md:** dice «165 supresiones»; con mi regla de conteo salen 162 en 2024-2060 (164 en 2024-2061; 166 en 2023-2060): el rango exacto de esa cifra no está declarado. CLAUDE.md lo califica de criterio litúrgico; el libro, en cambio, sí establece la alternativa observar/trasladar, de modo que «no hacer ni lo uno ni lo otro» no es una de las opciones del libro.
- **Corrección propuesta (no aplicada).** Decidir con el usuario entre (a) observar en el domingo (la fiesta sustituye al domingo, con la ruta de lecturas de la fiesta), (b) trasladar al siguiente día laborable libre (cursor como el de `getTransferredFeasts`, saltando días con fiesta propia: 26→29-dic. en el caso San Esteban cuando 27 y 28 están ocupados) o (c) conmutador de usuario. Para los 29 casos de Adviento/Cuaresma/Pascua, esperar decisión: el libro no da destino.

### CAL-03 — 1 de enero en domingo (ALTA)

- **Qué hace el app.** `:347` añade `|| md === '01-01'` y devuelve `christmasSunday` («El 1.er domingo después de Navidad», `nameEs` «Domingo en la Octava de Navidad»). Casos 2024-2060: **2034, 2040, 2045, 2051** (18 de 120 en 2001-2120). 1-ene es domingo si y solo si el 25-dic anterior fue domingo.
- **Qué dice el libro.** l.16835-16836 (p.600): cuando el Día de Navidad cae en domingo, el domingo siguiente es el **2.º Domingo de Navidad** o la **Circuncisión y Santo Nombre**. No es el 1.er domingo (ese es el propio día de Navidad).
- **Efecto.** Lecturas y colecta del «1.er domingo de Navidad» (clave `christmasSunday`) y, por herencia, las de las ferias del 2 al 7 de enero.
- **Corrección propuesta.** En `:347-349`, separar el caso `md==='01-01'`: devolver `christmasSunday2` (o `01-01` con sus propios; elección litúrgica del usuario, el libro da ambas). Quitar `md === '01-01'` del chequeo del 1.er domingo.

### CAL-04 — Jueves-Sábado después del Miércoles de Ceniza (ALTA, costura calendario→propios)

- **Qué hace el app.** `getDay` devuelve `lentFeria1_4/5/6` (`:325-328`). `resolveLectionaryKey`/`resolveCollectKey` (`app.js:35-41, 49-54`) no encuentran esa clave y toman el **domingo previo**, que es el Último Domingo de Epifanía. Verificado 2026-02-19/20/21: lecturas y colecta = `transfiguration`. **111 de 111 días** (37 años × 3) en 2024-2060.
- **Qué dice el libro.** l.16987-16988 (p.605): la colecta del Miércoles de Ceniza, con su salmo y lecturas, sirve también para los días laborables siguientes, salvo disposición en contrario (el 1.er domingo de Cuaresma abre su propia semana).
- **Corrección propuesta.** Que `calendar.js` marque estos días (p.ej. campo `inheritsKey:'ashWednesday'`, o clave `ashWednesdayFeria_d`) y que `app.js` lo respete antes de caer al domingo previo.

### CAL-05 — Viernes y Sábado después de la Ascensión (ALTA, costura)

- **Qué hace el app.** `easterFeria6_5/6` → domingo previo = Pascua VI. Verificado 2026-05-15/16: `easter6`. **70 de 70** días (sin contar los que llevan fiesta propia) en 2024-2060.
- **Qué dice el libro.** l.17230-17231 (p.613): la colecta de la Ascensión, con salmo y lecturas, sirve también el viernes y el sábado siguientes, salvo disposición en contrario.
- **Corrección propuesta.** Igual que CAL-04, con `inheritsKey:'ascension'` para el viernes y sábado tras `F.ascension`.

### CAL-06 — 29-31 de diciembre antes del 1.er domingo de Navidad (ALTA, costura)

- **Qué hace el app.** `christmasFeria` (`:357-365`); herencia = domingo previo, que en esos años es **Adviento IV**. Verificado 2028-12-29/30: `advent4`. **15 días** en 10 años (2028, 2029, 2034, 2035, 2040, 2045, 2046, 2051, 2056, 2057; 2024-2060).
- **Qué dice el libro.** l.16832-16834 (p.600): colecta y lecturas del Día de Navidad sirven para los días laborables entre los Santos Inocentes y el 1.er domingo de Navidad.
- **Corrección propuesta.** `inheritsKey:'christmas'` para esos días (no hay problema cuando ya existe el domingo: 12 de los 27 casos revisados ya heredan bien de `christmas`).

### CAL-07 — Ferias tras Pentecostés y tras Trinidad (ALTA, costura)

- **Qué hace el app.** Lun-Sáb tras Pentecostés → `pentecostFeria_d` (`:407-410`) y tras Trinidad → `properFeriaN_d` (`:413-420`); ambas heredan del domingo previo, que es Pentecostés o la Trinidad. Verificado: 2026-05-25 → colecta `pentecost`; 2026-06-01 → colecta `trinitySunday`, lecturas `trinitySunday`. **206/206** ferias tras Pentecostés y **209/209** tras Trinidad (sin fiesta propia); 415 días con lecturas prestadas de esos dos domingos.
- **Qué dice el libro.** l.17262-17269 (p.614): la Pascua incluye y termina con Pentecostés; el 1.er domingo después de Pentecostés es la Trinidad; la colecta, lecturas y prefacio de Pentecostés y de la Trinidad **no se usan en los días laborables siguientes: se usan «los propios fechados» de la semana**. Cada Propio se titula «Week of the Sunday from X to Y» (l.17281-17518): el número de Propio de la semana lo da la fecha del *domingo que la abre* (el de Pentecostés o el de la Trinidad). Los Propios 1 y 2 existen solo para esto (l.21082-21098: «Weekdays following the Sunday from May 8 to May 14 / May 15 to May 21»): como la Trinidad nunca cae antes del 17-may, un Propio «de la semana del domingo 8-14 may» solo puede ser el de la semana de Pentecostés, lo que confirma que la semana de Pentecostés también toma su Propio por la fecha del domingo. (La correspondencia concreta fecha-de-domingo → Propio es inferencia directa de los encabezados «Week of the Sunday from X to Y»; el libro no da un ejemplo resuelto.)
- **Faltan textos.** `COLLECTS` empieza en `proper3` (`propers.js:66`) y `SUNDAY` no tiene `proper1`/`proper2`. En 2024-2060 hacen falta Propio 1 o 2 en **14 semanas** (Pentecostés: 2024, 2027, 2029, 2032, 2035, 2040, 2043, 2046, 2051, 2054, 2056, 2059; Trinidad: 2035, 2046). El libro trae ambas colectas (l.17281-17297) y sus lecturas; **hay que transcribirlas del libro, no inventarlas**.
- **Ejemplo 2026.** Pentecostés 24-may ⇒ semana de 22-28 may ⇒ Lun 25 – Sáb 30 mayo deberían usar Propio 3; Trinidad 31-may ⇒ semana 29 may-4 jun ⇒ Lun 1 – Sáb 6 jun, Propio 4.
- **Corrección propuesta.** Para esas semanas, `inheritsKey = 'proper' + getProperNumber(domingoDeLaSemana)` (Pentecostés o Trinidad inclusive), añadir `proper1`/`proper2` a colectas y leccionario desde el libro.

### CAL-08 — Semana de Pascua y Semana Santa (ALTA, costura; responsabilidad de propios/leccionario)

- **Qué hace el app.** El calendario sí emite `easterFeria1_1..6` (`:310-313`) y `holyWeekFeria_1..3` (`:289-291`), pero no existen en `COLLECTS` ni (para Pascua) en `SUNDAY`. Resultado verificado (`cal_seam2.js`, 2024-2060): los **222** días Lun-Sáb de Pascua usan colecta y lecturas del **Domingo de Pascua**; los **111** días Lun-Mié Santos usan la **colecta del Domingo de Ramos** (`app.js:43-48` lo defiende como correcto). Las lecturas `holyWeekFeria_1..3` (`lectionary.js:143-157`) declaran venir del Misal Romano, no del libro.
- **Qué dice el libro.** Colecta propia por día: Lunes/Martes/Miércoles Santo l.17046-17070 (pp.607-608); Lunes a Sábado de Pascua l.17130-17176 (pp.610-611). Lecturas propias: Semana Santa l.20847-20870 (p.721: Lun Is 42:1-9, Sal 36:5-10, Heb 11:39-12:3, Jn 12:1-11 o Mc 14:3-9; Mar Is 49:1-6, Sal 71:1-11, 1 Co 1:18-31, Jn 12:37-38,42-50 o Mc 11:15-19; Mié Is 50:4-9, Sal 69:6-14,21-22, Heb 9:11-28, Mt 26:1-5,14-25); Semana de Pascua l.20951-20990 (p.723, una lectura de Hechos/Evangelio/salmo por día).
- **Nota de alcance.** Es tarea de la auditoría de leccionario/propios; se deja aquí porque el comentario de `app.js:43-48` y de `lectionary.js:143-148` contradice el libro.

### CAL-09 — Traslado por Semana Santa/Pascua: destino sin base en el libro (MEDIA)

- **Qué hace el app.** `getTransferredFeasts` (`:222-246`) traslada las fiestas fijas que caen entre Domingo de Ramos y Pascua II (no domingo) al primer lunes disponible tras Pascua II (`:234`). 14 casos en 14 años de 2024-2060 (p.ej. 2027-03-25 Anunciación → 2027-04-05; 2024-03-25 → 2024-04-08; 2025-04-25 → 2025-04-28; 2035-03-19 → 2035-04-02). Sin anomalías internas: el origen deja de mostrar la fiesta y el destino la muestra marcada (`isTransferred`).
- **Qué dice el libro.** l.19368-19369 (p.689): ningún día santo ni observancia puede reemplazar los propios fijos del Miércoles de Ceniza, de Semana Santa ni de Semana de Pascua. **No hay regla de destino** (`grep` de «transfer»: solo l.19364 [domingos] y l.19404 [conmemoraciones]). El comentario del código (`:212-214`) la atribuye a «Concerning the Calendar» del BCP 2019; esa regla no está en el libro.
- **Parte correcta:** la no-sustitución (`0` fiestas fijas activas en Domingo de Ramos…Sábado de Pascua en 2001-2120).
- **Pérdidas silenciosas relacionadas (sin regla en el libro, sin traslado en el app):** Matías contra Miércoles de Ceniza en 2066, 2072, 2077; Visitación contra la Ascensión en 2057, 2068, 2114; Felipe y Santiago contra la Ascensión en 2008.
- **Corrección propuesta.** No cambiar la conducta sin decisión del usuario; sí corregir el comentario (CAL-17) para que diga que el destino es una decisión del proyecto, y decidir si el lunes tras Pascua II es el destino deseado.

### CAL-10 — Semanas de Cuaresma mal numeradas (MEDIA)

- **Qué hace el app.** `:325-328`: `week = Math.ceil(diffDays(F.ashWednesday, date) / 7)`. Como el ancla es un *miércoles*, la etiqueta cambia en jueves; y `diffDays` (`:42-46`) mezcla las 12:00 del día consultado con las 00:00 de `F.ashWednesday` y `Math.round` sube medio día. Medido en 2024-2060 (1.144 ferias de Cuaresma): a las 12:00, **802 (70,1 %)** llevan un número de semana distinto del domingo de Cuaresma que las precede (error en todos los miércoles, jueves, viernes y sábados); a las 00:00, 627 (54,8 %). Ejemplo: 2026-02-25 (miércoles tras Cuaresma I) sale «Miércoles de Cuaresma (semana 2)».
- **Qué dice el libro.** No numera semanas de Cuaresma; solo manda heredar la colecta del Miércoles de Ceniza hasta el sábado (l.16987-16988) y, después, la del domingo (l.21076: las lecturas de cada domingo sirven para la semana siguiente).
- **Efecto.** Visible en `nameEs`; las lecturas/colecta no se ven afectadas (se resuelven por el domingo previo).
- **Corrección propuesta.** Anclar al domingo precedente (número de domingos de Cuaresma transcurridos, 0 antes de Cuaresma I) con diferencia de días normalizada, o eliminar el número y rotular «Jueves después de Ceniza», «Lunes después del Domingo I de Cuaresma».

### CAL-11 — Nochebuena (24-dic) (MEDIA)

- **Qué hace el app.** 32 de 37 años (2024-2060) el 24-dic es feria: sale `adventFeria4_d` («Jueves de Adviento (semana 4)») con colecta de Adviento IV; 5 años es Adviento IV (domingo).
- **Qué dice el libro.** l.16814-16821 (p.599): «Christmas Eve» tiene colecta propia con Prefacio de Navidad.
- **AMBIGUO:** en las tablas del leccionario (pp.717-718) solo hay Navidad I/II/III; no vi lecturas específicas de Christmas Eve. Cotejar con el PDF p.717 antes de decidir.
- **Corrección propuesta.** Clave `christmasEve` para el 24-dic con su colecta desde el libro (el 24-dic en domingo sigue siendo Adviento IV por la mañana).

### CAL-12 — Elementos opcionales del libro no implementados (BAJA)

Todos son «puede/may» o días de ayuno/observancia; son carencias, no errores. Líneas del libro:
- **Ember Days** (miércoles, viernes y sábado tras Santa Lucía 13-dic, tras Cuaresma I, tras Pentecostés, tras Santa Cruz 14-sep): l.19381-19386; rúbricas l.16803-16804, 16997, 17259-17260; lecturas l.21485-21512.
- **Rogation Days** (lun-mié antes de la Ascensión): l.19387-19389, l.17223; lecturas l.21512-21523. El domingo previo es Pascua VI, que el libro rotula «Rogation» (l.17214-17215).
- **Días nacionales con lecturas** (Memorial Day, Canada Day, Independence Day, Thanksgiving, Remembrance Day): l.19392-19398 (p.690).
- **Conmemoraciones opcionales** («Black Letter Days»): l.19399-19413; en las tablas l.19419-20435. Cuántas son: ≈150 por un conteo heurístico de líneas que cierran con año (`cal_commem.js`); *AMBIGUO* porque las tablas salen fragmentadas, el total real es mayor.
- **Conmemoración de los Fieles Difuntos** (2-nov): l.20268-20270. **Antífonas «O»** (16-23 dic): l.20389-20409 (p.712) y l.2122.
- **Septuagésima/Sexagésima/Quincuagésima** (nombres opcionales de los 3 domingos antes de Cuaresma): l.19366-19367. **Domingo Mundial de Misión** (sustituible por cualquier domingo de Epifanía salvo el 1.º y el último): l.16954-16964, l.20755-20758, l.20807. **Todos los Santos el domingo siguiente**: l.19336-19340.

### CAL-13 — Temporada `pentecost` (BAJA)

- **Qué hace el app.** Pentecostés se emite con `season:'pentecost'` (`:302`); las ferias hasta la Trinidad también (`:407-410`); la Trinidad con `season:'ordinary'` (`:316`); `seasonForDate` (`:263`) usa un rango Pentecostés-Trinidad inclusive que a las 12:00 no incluye el día de la Trinidad.
- **Qué dice el libro.** l.17262 (p.614): la Pascua «incluye y termina» en Pentecostés (50 días de Pascua, l.19376); el 1.er domingo después de Pentecostés es la Trinidad (inicio de la «Season after Pentecost»).
- **Efecto.** Ninguno hoy (`shouldOmitGloria` solo mira `advent/lent/holyWeek`; `app.js:102` trata `pentecost` por clave). Corrección propuesta: Pentecostés → `season:'easter'`; ferias Lun-Sáb tras Pentecostés → temporada «después de Pentecostés».

### CAL-14 — Número de Propio de las ferias (BAJA, invisible)

- **Qué hace el app.** `properFeriaN_d` usa `getProperNumber(fecha de la feria)` (`:413-420`). En 2024-2060, **2.583 de 5.187** ferias (49,8 %) llevan un N distinto del Propio de su domingo (p.ej. Miércoles 2024-05-29 → Propio 4; su domingo 2024-05-26 es Propio 3).
- **Efecto actual.** Ninguno visible: el nombre no muestra N y las lecturas/colecta se heredan del domingo previo (correcto salvo CAL-07). Pero la clave contradice l.17282 («Week of the Sunday from…») y es un riesgo si alguien empieza a usarla (p.ej. para CAL-07).

### CAL-15 — `getDay` depende de la hora del día (BAJA)

- 175 de 13.515 días (2024-2060) dan clave distinta a las 00:00 y a las 12:00 (todos miércoles de Cuaresma, `lentFeriaN_3`). Causa: `diffDays` (`:42-46`) con medio día de desfase. La app real siempre pasa 12:00 (`app.js:305, 318`), pero cualquier prueba a medianoche daría resultados distintos. Comprobado independiente de la zona horaria: mismo hash en 7 zonas (UTC, New_York, Santiago, Mexico_City, Auckland, London, sistema) con DST.

### CAL-16 — Nombres (BAJA)

- 1-ene: el libro lo llama «The Circumcision and Holy Name of Our Lord Jesus Christ» (l.19425-19429, l.16844-16845); el app solo «Holy Name» / «El Santo Nombre» (`:179`); `circumcision` en `propers.js:180` es código muerto.
- `christmasSunday` se llama «Domingo en la Octava de Navidad»; el libro: «the first sunday of christmas» (l.16837).
- «Laetare» (`:323`) y «Gaudete» (`:333`): no aparecen en el libro (grep: 0 resultados).
- Pascua VI: el libro la rotula «Rogation» (l.17214-17215), el app solo «Sexto Domingo de Pascua» (`:299`).
- Los otros 29 nombres de fiestas fijas coinciden en sentido con el libro (cotejados contra l.19425-20427).

### CAL-17 — Comentarios y documentación (BAJA)

- `calendar.js:12-16` y `:175-177` siguen diciendo que el calendario oficial no estaba disponible y que el santoral está «reconstruido de conocimiento general»; ahora existe el libro y las 32 fechas rojas coinciden (véase §6).
- `:211-220` atribuye al BCP 2019 («Concerning the Calendar») una regla de traslado que el libro no contiene (CAL-09).
- `:151-162`: la ampliación del Propio 29 hasta el 3-dic. es una decisión técnica del proyecto (el libro: 20-26 nov., l.17518-17519); correcta en la práctica, solo conviene decirlo.

### CAL-18 — Colores (BAJA, informativa)

- **El libro no especifica colores litúrgicos** (grep de color/violeta/púrpura/escarlata/ornamentos: 0 apariciones relevantes). Todos los `color` de `getDay` (`white|red|violet|rose|green`) son convención ajena al libro; no se puede marcar acierto ni error. Observaciones neutras: Propio 29 (Cristo Rey) sale verde (`:417`); Sábado Santo, violeta (`:286`); Jueves Santo, blanco (`:287`); Viernes Santo y Domingo de Ramos, rojo (`:285, 288`); Laetare/Gaudete, rosa (`:323, 333`); Domingos de Epifanía 2-8, verde, pero Bautismo y Transfiguración, blanco.

---

## 4. Respuesta punto por punto al encargo

### 4.1 Fiestas Principales y Días Santos
- **Lista del libro:** 7 Fiestas Principales (Pascua, Ascensión, Pentecostés, Trinidad, y las tres de fecha fija: Navidad 25-dic, Epifanía 6-ene, Todos los Santos 1-nov; l.19330-19334) y 29 Días Santos de fecha fija (l.19341-19360 y calendario l.19419-20435): **32 fechas rojas fijas** en total (29 + las 3 principales fijas).
- **En `FIXED_FEASTS`:** 30 entradas (los 29 Días Santos + Todos los Santos); ausentes ahí solo 6-ene y 25-dic (se emiten con código propio, `:341, :368`). **Cero sobrantes** (ninguna fiesta del app falta en el libro) y **cero faltantes** (José 19-mar, Santiago de Jerusalén 23-oct, Visitación 31-may, Confesión de Pedro, Conversión de Pablo, Matías, Bernabé, Santiago el Mayor, Bartolomé, Mateo, Simón y Judas, Andrés, Tomás, Esteban, Juan, Inocentes, Marcos, Lucas, Felipe y Santiago, Natividad de Juan Bautista, Pedro y Pablo, Magdalena, Transfiguración, Santa María, Santa Cruz, San Miguel, Santo Nombre, Presentación, Anunciación, Todos los Santos: todas presentes con la misma fecha).
- **Rango:** las 7 principales: 6 salen `principal`; Todos los Santos sale `holyDay` (CAL-01). Miércoles de Ceniza, Jueves Santo, Viernes Santo y Sábado Santo salen `holyDay` (el libro los trata como días fijos, no como «Días Santos»; sin consecuencia).
- **Diferencias exactas:** CAL-01 (principal), CAL-12 (opcionales), CAL-16 (nombres).

### 4.2 Reglas de traslado y precedencia

| Regla | Libro | App | Veredicto |
|---|---|---|---|
| Fiestas Principales prevalecen sobre cualquier día | l.19335 | Pascua, Ascensión, Pentecostés, Trinidad, Navidad, Epifanía sí; Todos los Santos no en domingo | CAL-01 |
| Día Santo en domingo (fuera de Adviento/Cuaresma/Pascua): observar o trasladar | l.19363-19365 | Se omite | CAL-02 |
| Día Santo en domingo de Adviento/Cuaresma/Pascua | no dice | Se omite | AMBIGUO |
| Nada reemplaza propios de Ceniza, Semana Santa, Semana de Pascua | l.19368-19369 | Cumple: 0 fugas 2001-2120; Ceniza prevalece (3 casos de Matías sin traslado) | OK (+ CAL-09) |
| Destino de lo desplazado por Semana Santa/Pascua | no dice | Lunes tras Pascua II | CAL-09 |
| Todos los Santos también el domingo siguiente | l.19336-19338 | No existe | CAL-12 |
| Septuagésima…Quincuagésima «pueden» | l.19366-19367 | No existen | CAL-12 |
| Navidad en domingo ⇒ domingo siguiente = 2.º de Navidad o Santo Nombre | l.16835-16836 | 1.er domingo | CAL-03 |
| Epifanía en domingo ⇒ domingo siguiente = 1.º de Epifanía | l.16875-16876 | `getBaptismOfLord` correcto (6-ene domingo ⇒ 13-ene) | OK |
| Fiestas de «Navidad» (Esteban/Juan/Inocentes) en domingo | l.19363-19365 | Se pierden (21 casos en 2024-2060) | CAL-02 |

### 4.3 Temporadas y fronteras
- **Libro:** Adviento antes de Navidad; Navidad = 12 días (25-dic a 5-ene); Epifanía desde el 6-ene hasta Ceniza; Cuaresma; Pascua = 50 días e incluye Pentecostés; «Season after Pentecost» desde la Trinidad (l.19309-19318, 19376, 17262).
- **App (2024-2060, 37 años, `cal_sim.js` [I]):** Navidad (25-dic y 5-ene) `christmas`; 6-ene y día antes de Ceniza `epiphany`; Ceniza y sábado antes de Ramos `lent`; Ramos…Sábado Santo `holyWeek`; Pascua y Ascensión `easter`; Adviento I `advent`. La única frontera distinta del libro es Pentecostés/ferias hasta la Trinidad (CAL-13).
- **Rangos de Propio.** El libro **sí** los define: «Sunday from May 8 to May 14» … «November 20 to November 26» (l.21082-21332; colectas l.17281-17518). Los 29 rangos de `PROPER_RANGES` (`:139-150`) coinciden 29/29. Diferencia solo en 27-nov a 3-dic (Propio 29), extensión declarada del app (CAL-17), sin consecuencia para los domingos.
- **Domingos de Epifanía:** el libro admite de 4 a 9 (columna «sundays after epiphany», p.714, 35 filas); el app emite `epiphany1`…`epiphany8` + `transfiguration` (máx. 9).

### 4.4 Ciclo A/B/C
- **Regla del libro:** l.20549-20552 (p.716): el Año A comienza con el Adviento de los años divisibles entre 3; «Advent 2019 begins Year A».
- **App:** `getSundayCycle` (`:84-88`) = `(año − 2025) mod 3`, equivalente a `año mod 3` porque 2025 es múltiplo de 3.
- **Resultado:** Adviento 2023 → B, 2024 → C, 2025 → A, 2026 → B, 2027 → C, 2028 → A, 2029 → B, 2030 → C; Adviento 2019-2035 sin diferencias; barrido día a día 2019-2060: **15.341 días, 0 discrepancias**. Respuesta a la pregunta del encargo: **Adviento 2025 (30-nov-2025) inicia el Año A**; el 29-nov-2026 empieza el Año B y el 28-nov-2027 el C.

### 4.5 Colores
El libro no los especifica (CAL-18). No hay nada que cotejar.

### 4.6 Pascua
- `computeEaster` vs tabla impresa del libro (l.20443-20477, 2001-2120): **120/120** coincide (0 discrepancias).
- vs Oudin 1940 (independiente): **301/301** años 1900-2200; vs Gauss: **200/200** años 1900-2099; 2024-2060: 0/37 discrepancias; rango 23-mar a 25-abr (el libro: 22-mar a 25-abr, l.19312-19313; 22-mar no ocurre entre 1900 y 2200).

### 4.7 Barrido de 2026 y 2027
- 730 días volcados (`cal_2026_2027.tsv`). Invariantes: 0 claves rotas o `feria` genérico; 52 domingos por año, todos `sunday|principal`; fiestas fijas mostradas 24 (2026) y 26 (2027); 1 traslado (2027-04-05, Anunciación); ciclo cambia solo en Adviento I (2026-11-29 A→B; 2027-11-28 B→C).
- **79 fechas clave** cotejadas con el libro (`cal_dates.js`): cada fiesta principal, cada domingo de Adviento/Cuaresma/Pascua, Semana Santa, Propios, fiestas fijas en domingo, Jueves Santo en 25-mar. Resultado: **70 coinciden sin reservas; 7 coinciden con el app pero dependen de lo que el libro deja abierto** (2026-01-18, 2026-01-25, 2026-10-18, 2026-12-27, 2027-12-26: CAL-02; 2027-04-25: ambiguo; 2027-04-05: CAL-09); **2 difieren** (2026-11-01: el app da `proper26/sunday`, el libro `11-01/principal`; 2027-11-01: clave correcta, rango `holyDay` en vez de `principal`; ambos CAL-01).

---

## 5. Hallazgos adicionales en sondeo (sin hallazgo propio)

- `calendar.js` es insensible a la zona horaria: mismo hash SHA-1 del barrido 2001-2060 en 7 zonas, incluidas las con DST.
- Todas las claves no-feria emitidas en 2001-2120 (369 claves distintas) tienen lecturas en `BCPLectionary.SUNDAY` y colecta en `BCPPropers.COLLECTS`: ningún día cae en «Colecta no disponible».
- Código muerto confirmado: `getSundaysAfterPentecostLabel` (`:430-436`), `circumcision` en `propers.js:180`.

---

## 6. Lo que SÍ coincide (verificado y cómo)

| Verificación | Cómo | Resultado |
|---|---|---|
| Fecha de Pascua | `cal_easter.js`: tabla del libro l.20443-20477 (120 años) + Oudin (301 años) + Gauss (200 años) | 0 discrepancias en las tres |
| Tabla de fechas móviles pp.714-715 | `cal_table.js`: 35 filas parseadas (l.20490-20533); 120 años 2001-2120; 6 columnas (Ceniza con la nota de bisiestos l.20534-20536, Ascensión, Pentecostés, Adviento I, nº de domingos de Epifanía, 1.er Propio tras Trinidad) | 0 discrepancias en 720 comparaciones |
| Ciclo A/B/C | regla l.20549-20552; barrido 2019-2060 | 0 en 15.341 días |
| Rangos de Propio | 29 rangos del libro (l.21082-21332) frente a `getProperNumber` en los 365 días de 2023 | Igual, salvo 27-nov…3-dic (extensión declarada) |
| Fechas rojas | 32 del libro frente a `FIXED_FEASTS` + Navidad/Epifanía | 32/32 presentes, misma fecha |
| Semana Santa, Semana de Pascua y Ceniza intocables | `cal_collide.js` 2001-2120 | 0 fiestas fijas activas entre Domingo de Ramos y Sábado de Pascua |
| Epifanía en domingo | l.16875-16876 frente a `getBaptismOfLord` | Correcto |
| Domingos de Epifanía (4-9) | tabla p.714 | `epiphany1..8` + `transfiguration` |
| Navidad 12 días / frontera 5-6 ene. | l.19317-19318 | Correcta (37 años) |
| Integridad | 43.829 días 2001-2120 | 0 claves nulas, 0 `feria` genérico, 0 domingos con rango distinto de `sunday/principal` |
| Zonas horarias | `cal_robust.js hash` en 7 TZ | Mismo SHA-1 |

---

## 7. No pude verificar

- **Colores litúrgicos:** el libro no los dice. Nada que contrastar.
- **Destino de las fiestas desplazadas** por Semana Santa, Pascua, Ceniza o Principales y **fiestas en domingo de Adviento/Cuaresma/Pascua:** el libro no define qué ocurre (AMBIGUO; se necesita decisión del usuario).
- **Número exacto de conmemoraciones opcionales:** tablas fragmentadas por la extracción; mi conteo (≈150) es un mínimo heurístico. Requiere cotejo con el PDF pp. 691-712.
- **Christmas Eve:** si tiene lecturas propias (CAL-11), AMBIGUO; cotejar con el PDF p.717.
- **Textos litúrgicos:** el contenido de colectas/lecturas (propers.js / lectionary.js) está fuera de mi parte; solo comprobé que las claves existan y qué clave se resuelve.
- **Paginación:** las páginas citadas se deducen de los pies del markdown; las de las tablas muy fragmentadas (pp. 714-715) tienen un pie con texto duplicado («771144» = 714).
- **Cifra «165 supresiones» de CLAUDE.md:** no la pude reproducir (162 en 2024-2060).

---

## 8. Reproducción

Scripts (todos solo lectura, usan `harness.js`) en `…\scratchpad\audit\`:
- `cal_dump.js` → `cal_2026_2027.tsv` (730 días) · `cal_year.js` (invariantes 2026-2027)
- `cal_easter.js` (Pascua) · `cal_table.js` (tabla de fechas móviles, rangos de Propio, ciclo)
- `cal_sim.js` → `cal_sim_out.txt` (barridos A-J) · `cal_sun.js` (desglose CAL-02) · `cal_collide.js` · `cal_f4.js`
- `cal_dates.js` → `cal_dates_out.txt` (79 fechas clave) · `cal_seam2.js` (CAL-08) · `cal_robust.js hash|hours|lent|proper12`
- `cal_commem.js` · `cal_165.js`

Ejemplo: `node …\audit\cal_table.js`.
