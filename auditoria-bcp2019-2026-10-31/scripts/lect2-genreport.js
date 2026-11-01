// lect2-genreport.js — Genera leccionario-2.md a partir de lect2-diff.json, lect2-extra.json,
// lect2-verify15.json y lect2-verdad.json. SOLO LECTURA sobre el repositorio.
const fs = require('fs');
const path = require('path');
const R = require('./lect2-diff.json');
const X = require('./lect2-extra.json');
const V15 = require('./lect2-verify15.json');
const V = require('./lect2-verdad.json');

const FIELDS = ['first', 'psalm', 'second', 'gospel'];
const FN = { first: '1.ª lectura', psalm: 'Salmo', second: '2.ª lectura', gospel: 'Evangelio' };
const WRAP = { 'proper7 B first': 'L21126+L21129', 'proper18 C second': 'L21211+L21214', 'proper19 A first': 'L21216+L21219', 'proper20 B first': 'L21229+L21232', 'proper21 B first': 'L21246+L21248' };
const isDiff = r => r.cls === 'CORTE' || r.cls === 'PASAJE_DISTINTO';
const same = r => r.cls === 'IGUAL' || r.cls === 'EQUIVALENTE';
const P = R.filter(r => r.scope === 'proper');
const F = R.filter(r => r.scope === 'feast' && r.key !== 'circumcision');
const CIRC = R.filter(r => r.key === 'circumcision');
const cnt = (arr, f) => arr.filter(f).length;
const pct = (a, b) => (100 * a / b).toFixed(1).replace('.', ',') + ' %';
const esc = s => String(s == null ? '' : s).replace(/\|/g, '\\|');
const line = r => WRAP[`${r.key} ${r.cycle} ${r.field}`] || (r.mdLine ? 'L' + r.mdLine : `bloque ${r.mdBlock}`);
const tidy = s => s.replace(/(\d+):0–\1:999/g, 'cap. $1 completo').replace(/(\d+):(\d+)–\1:(\d+)/g, '$1:$2–$3');
const pad = (r, n) => r.toString().padStart(n);

function classCounts(arr) {
  const t = { IGUAL: 0, EQUIVALENTE: 0, CORTE: 0, PASAJE_DISTINTO: 0, 'FALTA EN APP': 0, 'FALTA EN LIBRO': 0 };
  arr.forEach(r => { t[r.cls] = (t[r.cls] || 0) + 1; });
  return t;
}
function rowOf(label, arr) {
  const t = classCounts(arr);
  return `| ${label} | ${arr.length} | ${t.IGUAL} | ${t.EQUIVALENTE} | ${t.CORTE} | ${t.PASAJE_DISTINTO} | ${t['FALTA EN APP']} | ${t['FALTA EN LIBRO']} | ${arr.length - t.CORTE - t.PASAJE_DISTINTO} (${pct(arr.length - t.CORTE - t.PASAJE_DISTINTO, arr.length)}) |`;
}
const tHead = '| Subconjunto | Campos | IGUAL | EQUIVALENTE | DIFERENTE: corte de versículos | DIFERENTE: pasaje distinto | FALTA EN APP | FALTA EN LIBRO | Coinciden con el libro (IGUAL+EQUIV.) |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|';

const sev = arr => { const t = { alta: 0, media: 0, baja: 0 }; arr.forEach(r => { if (r.sev) t[r.sev]++; }); return t; };
const sP = sev(P), sF = sev(F);

// coincidencias por Propio × ciclo
const matchGrid = [];
for (const k of Object.keys(V.propers).filter(k => P.some(r => r.key === k))) {
  const cells = ['A', 'B', 'C'].map(c => P.filter(r => r.key === k && r.cycle === c && same(r)).length);
  matchGrid.push(`| ${k.replace('proper', 'Proper ')} | ${V.propers[k].rango} | ${cells[0]}/4 | ${cells[1]}/4 | ${cells[2]}/4 |`);
}

// tablas de DIFERENTES
function diffTable(arr, withCycle) {
  const head = withCycle
    ? '| Clave | Ciclo | Campo | Sev. | Tipo | Valor del app | Valor del libro | Línea md |\n|---|:-:|---|:-:|---|---|---|---|'
    : '| Clave | Campo | Sev. | Tipo | Valor del app | Valor del libro | Línea md |\n|---|---|:-:|---|---|---|---|';
  const body = arr.filter(isDiff).map(r => {
    const tipo = r.cls === 'CORTE' ? (r.sub.startsWith('solape') ? 'solape parcial desplazado' : 'corte distinto') : 'pasaje distinto';
    return withCycle
      ? `| ${r.key} | ${r.cycle} | ${FN[r.field]} | ${r.sev} | ${tipo} | ${esc(r.app)} | ${esc(r.book)} | ${line(r)} |`
      : `| ${r.key} | ${FN[r.field]} | ${r.sev} | ${tipo} | ${esc(r.app)} | ${esc(r.book)} | ${line(r)} |`;
  });
  return head + '\n' + body.join('\n');
}
const eqRows = R.filter(r => r.cls === 'EQUIVALENTE').map(r => `| ${r.key}${r.cycle !== 'all' ? ' ' + r.cycle : ''} | ${FN[r.field]} | ${esc(r.app)} | ${esc(r.book)} | ${tidy(r.sub)} |`).join('\n');
const altRowsArr = R.filter(r => r.cls === 'IGUAL' && /\sor\s/.test(r.book));
const altRows = altRowsArr.map(r => `| ${r.key} | ${FN[r.field]} | ${esc(r.app)} | ${esc(r.book)} | coincide con «${esc(r.bookAlt)}» |`).join('\n');

const v15rows = V15.map(o => `| ${o.n} | ${o.key}${o.cyc !== 'all' ? ' ' + o.cyc : ''} · ${FN[o.fld]} | ${esc(o.app)} | ${esc(o.book)} | ${o.mdLine ? 'L' + o.mdLine : (WRAP[`${o.key} ${o.cyc} ${o.fld}`] || '-')} | ${esc(o.mdHits[0] ? o.mdHits[0].replace(/^L\d+: /, '') : '(celda fragmentada en el md; ver PDF)')} | «${esc(o.rawCell)}» | ${o.agree ? 'sí' : 'NO'} |`).join('\n');

// totales de gospels/first
const pFirst = P.filter(r => r.field === 'first'), pGos = P.filter(r => r.field === 'gospel'), pPs = P.filter(r => r.field === 'psalm'), pSec = P.filter(r => r.field === 'second');
const byCycle = c => P.filter(r => r.cycle === c);

const md = `# Auditoría del leccionario — parte 2 (Propios, Todos los Santos, Cristo Rey y fiestas fijas)

App: \`bcp2019/js/lectionary.js\` (BCPLectionary.SUNDAY) · Libro: BCP 2019 (ACNA), «Sunday, Holy Day, and Commemoration Lectionary», pp. 716-733 · Fecha de la auditoría: 2026-10-31 · Solo lectura (ningún archivo del repositorio fue modificado).

## 1. Resumen

**El leccionario de los Propios del app no es el del libro.** De ${P.length} campos de Propios (27 Propios × 3 ciclos × 4 lecturas) solo **${cnt(P, same)} (${pct(cnt(P, same), P.length)}) coinciden** con el libro; **${cnt(P, isDiff)} difieren** (${cnt(P, r => r.cls === 'PASAJE_DISTINTO')} con un pasaje distinto y ${cnt(P, r => r.cls === 'CORTE')} con el mismo pasaje pero otro corte de versículos). Solo **1 de 81** domingos-ciclo (Propio 10, Ciclo C) tiene las cuatro lecturas coincidentes; en 20 no coincide ninguna. Las **fiestas fijas están mucho más cerca** del libro: de ${F.length} campos coinciden ${cnt(F, same)} (${pct(cnt(F, same), F.length)}) y difieren ${cnt(F, isDiff)}. El mapeo fecha → Propio **sí es correcto** (ver §5), con una excepción de calendario: Todos los Santos cuando el 1 de noviembre cae en domingo (mañana, 2026-11-01). **Claves ausentes** (el libro las tiene y el app no): Propios 1 y 2 (solo días de semana), Témporas I-II, Rogativas I-II, Acción de Gracias, Día de Canadá, Día de la Independencia, Remembrance/Memorial Day y los 10 «Commons» de las conmemoraciones (§6). Del lado del app no sobra ninguna clave con lecturas, salvo \`circumcision\` (duplicada de \`01-01\`, sin uso).

Severidad (definición en §2): Propios: **${sP.alta} altas**, ${sP.media} medias, ${sP.baja} bajas. Fiestas fijas: **${sF.alta} altas**, ${sF.media} medias, ${sF.baja} bajas.

${tHead}
${rowOf('**Propios 3-29 (total)**', P)}
${rowOf('Propios, Ciclo A', byCycle('A'))}
${rowOf('Propios, Ciclo B', byCycle('B'))}
${rowOf('Propios, Ciclo C', byCycle('C'))}
${rowOf('Propios, 1.ª lectura', pFirst)}
${rowOf('Propios, Salmo', pPs)}
${rowOf('Propios, 2.ª lectura', pSec)}
${rowOf('Propios, Evangelio', pGos)}
${rowOf('**Fiestas fijas (30, sin la clave duplicada)**', F)}
${rowOf('Fiestas, 1.ª lectura', F.filter(r => r.field === 'first'))}
${rowOf('Fiestas, Salmo', F.filter(r => r.field === 'psalm'))}
${rowOf('Fiestas, 2.ª lectura', F.filter(r => r.field === 'second'))}
${rowOf('Fiestas, Evangelio', F.filter(r => r.field === 'gospel'))}
${rowOf('Clave duplicada \`circumcision\` (=01-01)', CIRC)}

Por ciclo y tipo de lectura (Propios, nº de campos que coinciden con el libro de 27):

| Ciclo | 1.ª lectura | Salmo | 2.ª lectura | Evangelio |
|:-:|:-:|:-:|:-:|:-:|
${['A', 'B', 'C'].map(c => `| ${c} | ${FIELDS.map(f => cnt(P.filter(r => r.cycle === c && r.field === f), same)).join(' | ')} |`).join('\n')}

Observaciones cuantitativas:

- Los 27 salmos del Ciclo A del app difieren **todos** del libro (0/27); los de B coinciden 5/27 y los de C 10/27. El salmo es el campo con menos coincidencias (${cnt(pPs, same)}/81 en total), seguido de la 1.ª lectura (${cnt(pFirst, same)}/81).
- El Evangelio es lo que más se parece (${cnt(pGos, same)}/81 coinciden), pero ${cnt(pGos, r => r.cls === 'PASAJE_DISTINTO')} evangelios de Propios son otro pasaje y ${cnt(pGos, r => r.cls === 'CORTE')} tienen otro corte (varios con inicio/fin distinto en 1-2 versículos, otros mucho más largos o más cortos).
- Distribución de campos coincidentes por domingo-ciclo (de 81): 0 campos → 20, 1 → 39, 2 → 16, 3 → 5, 4 → 1.
- **No hay desfase de ciclo**: cruzando el ciclo X del app con el ciclo Y del libro, las coincidencias ocurren solo en la diagonal (X = Y) — no se corrige rotando A/B/C. El ciclo A/B/C del app sí concuerda con la regla del libro (md 20549-20552: Año A empieza en el Adviento de años divisibles por 3; verificado 2019-2060, 0 discrepancias).
- El encabezado de \`lectionary.js\` dice que el Antiguo Testamento usa «la pista complementaria»; en los datos, las primeras lecturas del Ciclo A de los Propios 4-28 forman una lectura continua Génesis → Éxodo → Deuteronomio → Josué → Jueces (Gn 6, 12, 18, 21, 22, 24, 25, 28, 29, 32, 37, 45; Ex 1, 3, 12, 14, 16, 17, 20, 32, 33; Dt 34; Jos 3, 24; Jue 4), es decir, serie continua y no complementaria. (Observación sobre el contenido del propio archivo; no la contrasto con el RCL.) El libro, en cambio, empareja la 1.ª lectura temáticamente con el Evangelio (p. ej. Propio 26 A: Mi 3:5-12 con Mt 23:1-12).

## 2. Método, fuentes y cómo conté

**Verdad (parte A, \`lect2-verdad.json\`).** Tres lecturas independientes del mismo libro (el PDF y su conversión a markdown):

1. \`pdftotext -layout\` del PDF oficial (\`ACNA BCP - 2019.pdf\`, págs. PDF 733-741 = págs. del libro 725-733) leído columna por columna y transcrito a mano (el markdown fragmenta las tablas; el texto con layout del PDF las conserva alineadas).
2. \`pdftotext -raw\` (orden del flujo de contenido: el PDF emite las celdas una por una, rótulo → 4 lecturas del Ciclo A → 4 del B → 4 del C), parseado automáticamente (\`lect2-rawparse.js\`). **Resultado: 348 de 348 campos de Propios y 120 de 120 de fiestas idénticos a la transcripción manual.**
3. El markdown de markitdown (\`BCP2019-en.md\`): 468 referencias contrastadas; 463 aparecen verbatim; las 5 restantes son celdas partidas en dos líneas por la extracción (Job 38:1-11(12-15)+16-18 L21126/L21129; Philemon (1-3)4-+21(22-25) L21211/L21214; Ecclesiasticus 27:30—+28:7 L21216/L21219; Wisdom 1:16—2:1,+12-22 L21229/L21232; Num 11:4-6,10-17,+24-29 L21246/L21248) y se resolvieron con las fuentes 1 y 2. Además, 90 de las 116 filas día × campo de Propios se confirman como fila de tabla (A|B|C en celdas consecutivas) en el md; las 26 restantes están en los bloques desordenados de los Propios 2, 4, 7, 9, 13, 14, 16, 18-21 y se confirman por las fuentes 1-2.

Como el PDF existe en el equipo del usuario, no hizo falta marcar nada como «AMBIGUO — requiere cotejo con el PDF»: el cotejo se hizo con el PDF.

Contenido de la verdad: 29 Propios (1-29; el 1 y el 2 solo «weekdays»), 30 fiestas fijas, y 18 «días» extra que el libro tiene y el app no (§6).

**Comparación (parte B, \`lect2-diff.js\`).** Se normalizan abreviaturas del libro a los nombres completos del app (Isa→Isaiah, Matt→Matthew, Ecclesiasticus→Sirach, Ps→Psalm…), guiones largos (—) y cortos, y se convierten las referencias a intervalos (capítulo×1000+verso). Un campo del app se compara con cada alternativa «or» del libro y se queda con el mejor resultado. Clases:

- **IGUAL**: misma referencia normalizada (incluye coincidir con una de las alternativas «or» del libro).
- **EQUIVALENTE**: mismos versículos salvo la notación del libro: versos opcionales entre paréntesis (el app los omite), verso parcial a/b, o salmo con sufijo \`v\` (numeración de versículos del Salterio Nuevo Coverdale, no comparable con la del app: se compara solo el número de salmo).
- **DIFERENTE — corte**: mismo libro y los intervalos se solapan (el app lee más o menos versículos, o los desplaza).
- **DIFERENTE — pasaje distinto**: otro libro o intervalos sin solape.
- **FALTA EN APP / FALTA EN LIBRO**: celda vacía de un lado: **0 casos** en las 448 comparaciones (todas las celdas existen en ambos).

Severidad: **alta** = 1.ª lectura o Evangelio con pasaje distinto; **media** = Salmo o 2.ª lectura con pasaje distinto, y cualquier lectura con solape parcial desplazado (ni anidado ni con extremo común; hay 12, de ellas 2 evangelios: Propio 7 A y Propio 15 B); **baja** = el app es un subconjunto/superconjunto del libro o comparte un extremo (corte de versículos).

Recuento: ${P.length} comparaciones de Propios (27 claves proper3-proper29 × A/B/C × 4 campos) + ${F.length} de fiestas (30 claves × 4 campos; \`all\` = una sola lista, no por ciclo) + ${CIRC.length} de la clave duplicada \`circumcision\` = ${R.length} filas; todas están en \`lect2-diff.json\`. «Coinciden» = IGUAL + EQUIVALENTE.

## 3. Tabla de coincidencias por Propio y ciclo (de 4 lecturas)

Rango de fechas = el que da el propio libro para ese Propio (md 21082-21332; págs. 725-729).

| Propio | Rango (libro) | A | B | C |
|---|---|:-:|:-:|:-:|
${matchGrid.join('\n')}

## 4. Tabla completa de DIFERENTES

Leyenda: «Línea md» es la línea de \`BCP2019-en.md\` donde figura el valor del libro (la más cercana al rótulo del Propio/fiesta; en las celdas partidas se citan las dos líneas). Los valores del libro se transcriben tal cual (paréntesis = versos opcionales; «v» = numeración Coverdale; «—» = rango entre capítulos). Las claves proper3-proper29 son las del app (\`proper\`+N = Propio N del libro).

### 4.1 Propios (${cnt(P, isDiff)} filas: ${cnt(P, r => r.cls === 'PASAJE_DISTINTO')} pasaje distinto + ${cnt(P, r => r.cls === 'CORTE')} corte)

${diffTable(P, true)}

### 4.2 Fiestas fijas (${cnt(F, isDiff)} filas, más ${cnt(CIRC, isDiff)} de la clave duplicada \`circumcision\`)

La clave es \`MM-DD\` de \`FIXED_FEASTS\`. Págs. del libro 730-731 (md 21335-21482).

${diffTable(F.concat(CIRC), false)}

### 4.3 Clasificados EQUIVALENTE (${cnt(R, r => r.cls === 'EQUIVALENTE')}), para que se pueda discutir el criterio

| Clave | Campo | App | Libro | Motivo |
|---|---|---|---|---|
${eqRows}

### 4.4 IGUAL porque coincide con una de las alternativas «or» del libro (${altRowsArr.length})

El libro ofrece las dos; el app muestra una. No es discrepancia, pero conviene saberlo si algún día se quiere ofrecer ambas.

| Clave | Campo | App | Libro | Nota |
|---|---|---|---|---|
${altRows}

## 5. Parte D — numeración de los Propios y mapeo de fechas

- **Numeración del libro: Proper 1-29** (md 21082-21332). Cada Propio se define por un **rango de fechas del domingo**, p. ej. «Proper 3: Sunday from May 22 to May 28» … «Proper 29: Sunday from November 20 to November 26 (Christ the King)». Los Propios 1 y 2 (May 8-14 / May 15-21) traen solo lecturas «Weekdays following the Sunday…», no para domingo.
- **El app tiene Propios 3-29** y los mapea con \`PROPER_RANGES\` (calendar.js). Comprobado por código:
  - \`getProperNumber\` coincide con el rango del libro **en todos los días del 8 de mayo al 26 de noviembre** (años 2023 y 2024, común y bisiesto): **0 discrepancias** (el app extiende el Propio 29 hasta el 3 de diciembre y define los Propios 1-2 solo para ferias; el libro termina el 29 el 26 de nov.; no afecta a ningún domingo).
  - **Tabla de «fechas móviles» del libro** (md 20490-20533, «collect to begin with after Trinity» + «Advent Sunday»): para cada una de las **35 fechas posibles de Pascua (22 mar-25 abr)** el libro indica con qué Propio empieza el primer domingo después de Trinidad y la fecha del Adviento. El app reproduce **35 de 35** (Propio del primer domingo tras Trinidad y fecha de Adviento I).
  - **Domingos reales 2024-2060** con clave \`properN\`: ${X.sunTot} domingos, **${X.sunBad.length} fuera del rango de fechas del libro**. Ejemplos 2026: Trinidad 31 may → 7 jun = Propio 5 … 22 nov = Propio 29 (Cristo Rey) → 29 nov = Adviento I; 2027: Trinidad 23 may → 30 may = Propio 4 … 21 nov = Propio 29; 2028: Trinidad 11 jun → 18 jun = Propio 6 … 26 nov = Propio 29. Todos concuerdan con el rango del libro.
  - Propio 29 = «Cristo Rey»: el app lo etiqueta «Propio 29 — Cristo Rey»; el libro lo llama «Christ the King» (md 21332) y remite a él las «Propers for Christ the King» (md 21590). Correcto.
- **Caso obvio que falla (calendario, no lectura): Todos los Santos en domingo.** El libro lo lista entre los **Principal Feasts** («take precedence over any other day or observance», md 19330-19335) y permite además celebrarlo el domingo siguiente al 1 de noviembre. El app, en domingo, deja siempre ganar al Domingo (\`calendar.js\`: \`dow !== 0 && FIXED_FEASTS[md]\`). Resultado: **mañana, domingo 2026-11-01, \`getDay\` devuelve \`proper26\` (Ciclo A)** con Josué 3:7-17 / Salmo 107:1-7 / 1 Tes 2:9-13 / Mt 23:1-12; ni es Todos los Santos ni coincide con el Propio 26 A del libro (Mi 3:5-12 / Sal 43 / 1 Tes 2:9-20 / Mt 23:1-12). Ocurre ${X.allSaintsSun.length} veces en 2024-2060 (${X.allSaintsSun.map(s => s.split('→')[0]).join(', ')}).
- **Propios 1-2 (solo ferias).** El app no tiene \`proper1\`/\`proper2\`. En 2024-2060 solo 2 días caen en \`properFeria2_N\` (2035-05-21 y 2046-05-21, lunes tras Trinidad): se resuelven con las lecturas del Domingo precedente (Trinidad). **AMBIGUO**: el libro dice «Weekdays following the Sunday from May 15 to May 21», pero no aclara si eso incluye los días tras el domingo de Trinidad (que tiene lecturas propias) ni si el Propio 1 sirve a las ferias tras Pentecostés cuando este cae el 8-14 de mayo (Pascua 22-26 mar.; 2035 y 2046 en el rango). Requiere criterio litúrgico, no es verificable solo con el libro.

## 6. Parte E — fiestas fijas: ¿lecturas propias para todas?

- **Sí.** Las 30 fiestas de \`FIXED_FEASTS\` tienen lecturas propias en el libro (30/30; también la clave sobrante \`circumcision\` = Circuncisión y Santo Nombre, 1 de enero). Y el app tiene lecturas propias para las 30 (0 «FALTA EN APP»/«FALTA EN LIBRO» entre las claves comunes).
- **Fiestas que el app resuelve con las lecturas del Domingo aunque el libro tiene lecturas propias** (cuando la fecha cae en domingo): ${X.onSunTot} apariciones entre 2024 y 2060, en las 30 fiestas (4-6 veces cada una). Desglose por el tiempo del domingo que prevalece: ${Object.entries(X.bySeason).map(([k, v]) => `${k}: ${v}`).join('; ')}. En Adviento, Cuaresma y Pascua (${X.bySeason['Adviento'] + X.bySeason['Cuaresma/Semana Santa'] + X.bySeason['Pascua']} casos) el libro dice que gana el domingo (md 19363-19365), así que es correcto; en los **${X.onSunTot - X.bySeason['Adviento'] - X.bySeason['Cuaresma/Semana Santa'] - X.bySeason['Pascua']} restantes** el libro dice «may be observed on that Sunday or transferred to the nearest following weekday». El app no hace ninguna de las dos cosas: la fiesta desaparece en silencio. (Criterio litúrgico del usuario. CLAUDE.md anota 165 supresiones en bcp2019; mi recuento con 2024-2060 da ${X.onSunTot}.) **Excepción no opcional: Todos los Santos (Fiesta Principal)** — ver §5.
- En día de semana, 29 de las 30 fiestas devuelven su clave propia (comprobado en el primer año 2024-2060 en que cada una cae entre lunes y sábado). La excepción es la Anunciación de 2024 (lunes de Semana Santa): el app la desplaza y deja el Lunes Santo, coherente con md 19368-19369 («No holy day … can replace the fixed propers for … Holy Week»); el destino del traslado es asunto del calendario y no lo audito.
- **Días con lecturas propias en el libro que el app NO modela** (FALTA EN APP, texto en \`lect2-verdad.json\` → \`extraBookDays\`): Proper 1 y Proper 2 (weekdays); Ember Days I y II (miércoles-viernes-sábado tras Santa Lucía, 1.º de Cuaresma, Pentecostés y Santa Cruz; md 19381-19386); Rogation Days I y II (md 19387); National Days: **Thanksgiving Day** (Canadá: 2.º lunes de octubre; EE. UU.: 4.º jueves de noviembre), Canada Day (1 jul.), Independence Day (4 jul.), Remembrance Day (Canadá, 11 nov.) / Memorial Day (EE. UU., lunes más cercano al 28 may.); y los «Commons» de las Conmemoraciones (Martyr, Missionary or Evangelist, Pastor, Teacher of the Faith, Monastic or Religious, Ecumenist, Reformer of the Church, Renewer of Society, Any I, Any II; págs. 732-733). Ninguno existe en \`calendar.js\` ni en \`lectionary.js\`. No hay «Acción de Gracias» en el app.
- **FALTA EN LIBRO**: no hay lecturas del app sin contraparte, salvo la clave \`circumcision\` (no la emite \`calendar.js\`: código muerto, ya anotado en CLAUDE.md; sus lecturas además difieren del libro, ver 4.2).
- Aclaración sobre claves no cubiertas aquí: la clave \`transfiguration\` (último domingo de Epifanía) y \`trinitySunday\` son del otro agente; esta auditoría solo cubre la fiesta fija 08-06.

## 7. Parte C — verificación manual de 15 diferencias (descartar artefactos de extracción)

Para cada una se leyó el texto del PDF (layout y flujo raw) y la línea del markdown. En las 15, la celda del flujo raw del PDF **coincide** con el valor del libro usado en la comparación; **ningún artefacto de extracción**. Las celdas partidas (4, 8, 11) se resolvieron con el PDF.

| # | Campo | App | Libro | Línea md | Texto md (literal) | Flujo raw del PDF | Coincide |
|--:|---|---|---|---|---|---|:-:|
${v15rows}

Selección: Propio 26 A completo (relevante para el 1 nov. 2026); tres de los seis evangelios de Propios con pasaje distinto (7 C, 12 B, 28 B; los otros tres están en §4.1); las tres celdas partidas por la extracción (Job 38 B, Eclesiástico 27 A, Filemón C; las otras dos, Sabiduría 1 B y Números 11 B, siguen el mismo patrón y también las resolvió el flujo raw); Propio 29 (Cristo Rey); Todos los Santos (2.ª lectura y salmo); y dos fiestas con evangelio o 1.ª lectura distintos (San Marcos, San Esteban).

## 8. Hallazgos más graves

1. **Los Propios no son del libro**: ${pct(cnt(P, same), P.length)} de coincidencia, ${sP.alta} diferencias altas (59 primeras lecturas distintas de las 81, 6 evangelios). 80 de los 81 domingos-ciclo tienen al menos una lectura distinta de la del libro; el Evangelio es lo único que se parece (61,7 %).
2. **Todos los Santos en domingo (2026-11-01, mañana)** sale como Propio 26 con lecturas que no son ni las de Todos los Santos ni las del Propio 26 del libro.
3. **Salmos**: ninguno de los 27 salmos del Ciclo A coincide; en total ${81 - cnt(pPs, same)} de 81 salmos de Propios difieren. (El Propio 29 lleva además antífonas \`psalmAnt\` ligadas a los salmos del app: A «Sal 100» y C «Benedictus»; el libro da Sal 95 y Sal 46, así que esas antífonas dejarían de corresponder si se corrigen los salmos.)
4. **Fiestas con evangelio/1.ª lectura distintos** (${sF.alta} altas): San José (Mt 1:18-25 en vez de Lc 2:41-52), San Marcos (Mc 1:1-15 en vez de Mc 16:15-20), San Bernabé (1.ª lectura Hch 11:19-30 en vez de Is 42:5-12 y evangelio Jn 15:12-16 en vez de Mt 10:7-16), Santo Nombre, María Magdalena (Cantar 3:1-4 en vez de Jue 4:4-10 o Jdt 9:1,11-14), Santa Cruz, San Lucas y San Esteban.
5. **Supresión silenciosa de fiestas fijas en domingo** (${X.onSunTot} casos en 2024-2060; ${X.onSunTot - X.bySeason['Adviento'] - X.bySeason['Cuaresma/Semana Santa'] - X.bySeason['Pascua']} fuera de Adviento/Cuaresma/Pascua, donde el libro permite celebrar o trasladar).
6. **Propios 1-2, Témporas, Rogativas, Acción de Gracias y días nacionales** del libro no existen en el app.

## 9. Restricciones para quien corrija (no aplico correcciones)

- \`js/lib/biblia-wrapper.js\` no tiene alias para **\`Ecclesiasticus\`** (usa \`Sirach\`→«Eclesiástico») ni para **\`Judith\`** (los datos de la Biblia de Jerusalén sí contienen «Judit»): hay que escribir \`Sirach\` y añadir el alias de Judit (07-22 ofrece «Judg 4:4-10 or Judith 9:1,11-14»). No pude ejecutar el navegador para comprobar cómo se resuelve hoy \`Judith\`.
- El wrapper parsea solo \`libro cap:ver-ver,…\`: **no admite paréntesis** (versos opcionales), letras \`a/b\`, \`—\` ni «or». Hay que decidir cómo representar los versos opcionales del libro (p. ej. «Isa 49:8-18(19-23)») o ampliar el parser. Los casos de \`Isa 55\` (capítulo entero) sí los admite (\`chOnly\`).
- Los salmos con sufijo \`v\` (numeración Coverdale) no se pueden trasladar a la numeración del app sin la tabla de desfase de salmos que ya figura como pendiente en CLAUDE.md (§2 «Desfase de versículos en los salmos»). Hay ${cnt(R, r => r.cls === 'EQUIVALENTE' && /Coverdale/.test(r.sub))} salmos del app clasificados EQUIVALENTE por esa razón sin poder validar sus versículos.
- Respecto a la regla de CLAUDE.md «no inventar textos litúrgicos»: copiar solo referencias bíblicas del libro es legítimo; el libro no da antífonas de salmo, así que las \`psalmAnt\` existentes (proper29, entre otras) no tienen contraparte en el lectionary del libro.

## 10. Ambigüedades y «No pude verificar»

- **Propios 1-2** (ver §5): alcance de «Weekdays following the Sunday…» ambiguo.
- **Salmos con \`v\`**: no comparo los versículos (numeración del Salterio Coverdale distinta). Si coincidiera con la numeración de la Biblia de Jerusalén (que cuenta el encabezado como versículo) no lo sé; no lo verifiqué.
- **Severidad de los solapes parciales**: los clasifiqué «media» (pasaje desplazado). Se pueden reclasificar en el JSON (\`sub\` empieza por «solape»); son 12.
- **Verso opcional entre paréntesis**: lo trato como EQUIVALENTE si el app coincide con el texto con o sin el opcional; si el app lee otra extensión, es DIFERENTE (corte).
- **Líneas del markdown de las fiestas**: el md mezcla las dos columnas de cada página; las líneas se localizaron por búsqueda del valor más cercano al rótulo de la fiesta y verifiqué a mano 15; para refs muy cortas («Ps 1», «Ps 99») la línea podría ser la de una celda vecina idéntica, pero la verdad no depende del md (viene del PDF).
- **No pude verificar** la lectura real que se imprime en pantalla (no ejecuté \`app.js\`: toca el DOM; usé \`getDay\` y \`getSundayReadings\` del arnés) ni la resolución de pasajes por el wrapper de la Biblia.
- Hallazgo colateral fuera de mi alcance (para el otro agente): el comentario de \`lectionary.js\` (\`holyWeekFeria_1/2/3\`) afirma que el BCP 2019 no asigna lecturas propias al Lunes, Martes y Miércoles Santos, pero el libro sí las trae (md 20849-20867, «monday/tuesday/wednesday in holy week») y su introducción dice que hay lecturas para «the days of Holy Week and Easter Week» (md 20555-20557). Todo lo de Adviento→Trinidad es del otro agente.

## 11. Archivos (carpeta \`audit\`)

- \`lect2-verdad.json\` — verdad: 29 Propios × A/B/C × 4 lecturas, 30 fiestas, 18 días extra.
- \`lect2-diff.json\` — las ${R.length} filas de comparación (clave, ciclo, campo, app, libro, clase, subtipo, severidad, línea md, página).
- \`lect2-build-verdad.js\`, \`lect2-rawparse.js\`, \`lect2-rowcheck.js\` — construcción y contraste de la verdad.
- \`lect2-diff.js\`, \`lect2-extra.js\`, \`lect2-verify15.js\`, \`lect2-genreport.js\` — comparación, análisis D/E, verificación de las 15 y este informe.
- \`_pdf-700-760.txt\`, \`_pdf-raw-733-741.txt\` — extracción del PDF usada como prueba.
`;
fs.writeFileSync(path.join(__dirname, 'leccionario-2.md'), md, 'utf8');
console.log('escrito leccionario-2.md', md.length, 'caracteres,', md.split('\n').length, 'líneas');
