// lect2-extra.js — Análisis complementarios (D y E): mapeo fecha→Propio, tabla de fechas móviles del libro,
// fiestas fijas en domingo, matriz de alineación de ciclos, ferias de Propios 1-2. SOLO LECTURA.
const fs = require('fs');
const path = require('path');
const D = require('./lect2-diff.js');
const { C, V, rows, compare } = D;
const Cal = C.BCPCalendar;
const mk = (y, m, d) => new Date(y, m - 1, d, 12);
const out = {};

// ── D1. Rangos de fechas del libro vs getProperNumber ──
const BOOK_RANGE = {}; // N → [mes,dia ini],[mes,dia fin]
const MONTHS = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
for (const [k, o] of Object.entries(V.propers)) {
  const m = o.rango.match(/^(\w+) (\d+) to (\w+ )?(\d+)/);
  const m1 = MONTHS[m[1]], d1 = +m[2], m2 = m[3] ? MONTHS[m[3].trim()] : m1, d2 = +m[4];
  BOOK_RANGE[o.numero] = [[m1, d1], [m2, d2]];
}
let rangeMismatch = [];
for (let y of [2023, 2024]) { // año común y bisiesto
  for (let dayN = 0; dayN < 366; dayN++) {
    const d = new Date(y, 0, 1 + dayN, 12); if (d.getFullYear() !== y) break;
    const md = (d.getMonth() + 1) * 100 + d.getDate();
    let bookN = null;
    for (const [n, [[m1, d1], [m2, d2]]] of Object.entries(BOOK_RANGE)) { if (md >= m1 * 100 + d1 && md <= m2 * 100 + d2) bookN = +n; }
    const appN = Cal.getProperNumber(d);
    if (md >= 508 && md <= 1126 && appN !== bookN) rangeMismatch.push(`${y}-${d.getMonth() + 1}-${d.getDate()} app=${appN} libro=${bookN}`);
    if (md > 1126 && appN !== null) { /* extensión 27 nov-3 dic: el libro termina en Nov 26 */ }
  }
}
out.rangeMismatch = rangeMismatch;
console.log('D1. Fechas 8 may–26 nov (años 2023 y 2024) donde getProperNumber ≠ rango del libro:', rangeMismatch.length, rangeMismatch.slice(0, 10));
// extensión de Proper 29 hasta 3 dic. (sólo ferias; el libro dice Nov 20-26)
let ext = []; for (let dd = 27; dd <= 30; dd++) ext.push(Cal.getProperNumber(mk(2024, 11, dd))); ext.push(Cal.getProperNumber(mk(2024, 12, 1)), Cal.getProperNumber(mk(2024, 12, 3)), Cal.getProperNumber(mk(2024, 12, 4)));
console.log('   getProperNumber 27-30 nov,1 dic,3 dic,4 dic =', ext.join(','), '(libro: Proper 29 = Nov 20-26)');

// ── D2. Tabla del libro «collect to begin with after Trinity» (md líneas 20490-20533) ──
const md = fs.readFileSync('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md', 'utf8').split(/\r?\n/);
const tbl = [];
for (let i = 20489; i <= 20533; i++) {
  const ln = md[i];
  const m = ln.match(/^\|\s*(Mar|Apr) (\d+)\s*(\d)?\s*\|.*?\|\s*Proper (\d+)\s*\|\s*(Nov|Dec) (\d+)\s*\|/);
  if (m) tbl.push({ easter: [m[1] === 'Mar' ? 3 : 4, +m[2]], proper: +m[4], advent: [m[5] === 'Nov' ? 11 : 12, +m[6]], line: i + 1 });
}
console.log('D2. filas de la tabla de fechas móviles leídas del markdown:', tbl.length, '(esperadas 36: Mar 22–Apr 25)');
const have = new Set(tbl.map(t => t.easter.join('-'))); const missingRows = []; for (let dd = 0; dd < 36; dd++) { const dt = new Date(2001, 2, 22 + dd); const k = (dt.getMonth() + 1) + '-' + dt.getDate(); if (!have.has(k)) missingRows.push(k); }
console.log('   fechas de Pascua sin fila parseada:', missingRows.join(',') || '(ninguna)');
// Buscar años con cada fecha de Pascua (2024-2300 con computeEaster)
const byEaster = {};
for (let y = 2024; y <= 2400; y++) { const e = Cal.computeEaster(y); const k = (e.getMonth() + 1) + '-' + e.getDate(); (byEaster[k] = byEaster[k] || []).push(y); }
let tblMis = [], tblOK = 0, tblSkipped = 0;
for (const t of tbl) {
  const k = t.easter[0] + '-' + t.easter[1]; const years = byEaster[k] || [];
  if (!years.length) { tblSkipped++; continue; }
  const y = years[0];
  const F = Cal.getFeastDates(y);
  const sunAfterTrinity = new Date(F.trinitySunday.getFullYear(), F.trinitySunday.getMonth(), F.trinitySunday.getDate() + 7, 12);
  const info = Cal.getDay(sunAfterTrinity);
  const appProper = +(info.key.replace('proper', ''));
  const adv = F.advent1; // Advent 1 del mismo año civil
  const advOK = (adv.getMonth() + 1) === t.advent[0] && adv.getDate() === t.advent[1];
  if (appProper === t.proper && advOK) tblOK++; else tblMis.push(`Pascua ${k} (${y}): libro Proper ${t.proper}/Advent ${t.advent.join('-')} · app ${info.key}/Advent ${(adv.getMonth() + 1) + '-' + adv.getDate()} (línea ${t.line})`);
}
console.log('   Fechas de Pascua con año en 2024-2200:', tbl.length - tblSkipped, '| coinciden Proper(1.er domingo tras Trinidad)+Adviento:', tblOK, '| discrepancias:', tblMis.length);
tblMis.forEach(x => console.log('   ✗', x));
out.tblMis = tblMis;

// ── D3. Domingos de verano-otoño 2026, 2027, 2028 ──
for (const y of [2026, 2027, 2028]) {
  const F = Cal.getFeastDates(y);
  const lines = [];
  for (let d = new Date(F.trinitySunday.getFullYear(), F.trinitySunday.getMonth(), F.trinitySunday.getDate(), 12); d.getFullYear() === y && d.getMonth() < 11; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7, 12)) {
    const info = Cal.getDay(d);
    const md = (d.getMonth() + 1) + '/' + d.getDate();
    const n = Cal.getProperNumber(d);
    // Propio que dice el libro por fecha
    let bookN = null; const v = (d.getMonth() + 1) * 100 + d.getDate();
    for (const [nn, [[m1, d1], [m2, d2]]] of Object.entries(BOOK_RANGE)) if (v >= m1 * 100 + d1 && v <= m2 * 100 + d2) bookN = +nn;
    lines.push(`${md}:${info.key}(${info.cycle})${info.key === 'proper' + bookN || info.key === 'trinitySunday' ? '' : ' ✗libro=P' + bookN}`);
  }
  console.log(`D3. ${y} (Trinidad ${F.trinitySunday.getMonth() + 1}/${F.trinitySunday.getDate()}):`, lines.join('  '));
}

// ── D4. Domingos 2024-2060 con clave properN: ¿coincide con el rango del libro? ──
let sunTot = 0, sunBad = [];
const cnt = {};
for (let y = 2024; y <= 2060; y++) {
  for (let d = new Date(y, 4, 1, 12); d < new Date(y, 11, 31, 12); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)) {
    if (d.getDay() !== 0) continue;
    const info = Cal.getDay(d);
    if (!/^proper\d+$/.test(info.key)) continue;
    sunTot++;
    const n = +info.key.slice(6);
    const v = (d.getMonth() + 1) * 100 + d.getDate();
    const [[m1, d1], [m2, d2]] = BOOK_RANGE[n];
    if (!(v >= m1 * 100 + d1 && v <= m2 * 100 + d2)) sunBad.push(`${y}-${d.getMonth() + 1}-${d.getDate()} ${info.key}`);
    cnt[n] = (cnt[n] || 0) + 1;
  }
}
console.log('D4. Domingos 2024-2060 con clave properN:', sunTot, '| fuera del rango de fechas del libro:', sunBad.length, sunBad.slice(0, 5));
console.log('   Veces que sale cada Propio como domingo (2024-2060):', Object.entries(cnt).map(([k, v]) => 'P' + k + '=' + v).join(' '));
out.sunTot = sunTot; out.sunBad = sunBad;

// ── D5. Ferias de Propios 1-2 (properFeria1/2_N) 2024-2060 y su lectura resuelta ──
let fer = 0, ferKeys = {}; const ferEx = [];
for (let y = 2024; y <= 2060; y++) {
  for (let d = new Date(y, 4, 1, 12); d < new Date(y, 5, 15, 12); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)) {
    const info = Cal.getDay(d);
    if (/^properFeria[12]_/.test(info.key)) { fer++; ferKeys[info.key.replace(/_\d$/, '')] = (ferKeys[info.key.replace(/_\d$/, '')] || 0) + 1; if (ferEx.length < 3) ferEx.push(`${y}-${d.getMonth() + 1}-${d.getDate()} ${info.key}`); }
  }
}
console.log('D5. Días 2024-2060 con clave properFeria1/2_N (el libro tiene Proper 1/2 «weekdays»; el app no tiene lecturas proper1/proper2):', fer, ferKeys, ferEx);
out.fer = fer;

// ── E1. Fiestas fijas que caen en domingo 2024-2060 y el app resuelve con el Domingo ──
const onSun = {}; let onSunTot = 0; const bySeason = {};
const seasonOf = key => /^advent/.test(key) ? 'Adviento' : /^lent|^ashW|^palmSunday|^holyWeek/.test(key) ? 'Cuaresma/Semana Santa' : /^easter|^ascension|^pentecost$/.test(key) ? 'Pascua' : /^christmas|^epiphany|^transfiguration/.test(key) ? 'Navidad/Epifanía' : 'Después de Pentecostés/Trinidad';
for (let y = 2024; y <= 2060; y++) {
  for (const k of Object.keys(Cal.FIXED_FEASTS)) {
    const [mm, dd] = k.split('-').map(Number);
    const d = new Date(y, mm - 1, dd, 12);
    if (d.getDay() !== 0) continue;
    const info = Cal.getDay(d);
    const isFeast = info.isFixed && info.key === k;
    if (!isFeast) { onSunTot++; onSun[k] = onSun[k] || []; onSun[k].push(`${y}→${info.key}`); const sn = seasonOf(info.key); bySeason[sn] = (bySeason[sn] || 0) + 1; }
  }
}
console.log('E1. Fiestas fijas en domingo (2024-2060) que el app NO celebra como fiesta:', onSunTot);
for (const [k, v] of Object.entries(onSun)) console.log('   ', k, V.feasts[k].nombre, v.length, 'veces; ej.:', v.slice(0, 4).join(' '));
console.log('   por tiempo litúrgico del domingo:', JSON.stringify(bySeason)); out.bySeason = bySeason;
const allSaintsSun = onSun['11-01'] || [];
console.log('   TODOS LOS SANTOS en domingo (fiesta principal, prevalece sobre el domingo según el libro, md 19330-19336):', allSaintsSun.length, allSaintsSun.join(' '));
out.onSunTot = onSunTot; out.allSaintsSun = allSaintsSun;
// 2026-11-01 concreto
const a = Cal.getDay(mk(2026, 11, 1));
console.log('   getDay(2026-11-01) =', a.key, a.nameEs, 'ciclo', a.cycle, '| lecturas app:', JSON.stringify(C.BCPLectionary.getSundayReadings(a.key, a.cycle)));
console.log('   libro Proper 26 A:', JSON.stringify(['first', 'psalm', 'second', 'gospel'].map(f => V.propers.proper26.A[f])), '| libro Todos los Santos:', JSON.stringify(['first', 'psalm', 'second', 'gospel'].map(f => V.feasts['11-01'][f])));

// ── E2. Lecturas efectivas de cada fiesta fija en día de semana: ¿resuelve el app a la clave de la fiesta? ──
let notOwn = [];
for (const k of Object.keys(Cal.FIXED_FEASTS)) {
  let found = false;
  for (let y = 2024; y <= 2060 && !found; y++) {
    const [mm, dd] = k.split('-').map(Number); const d = new Date(y, mm - 1, dd, 12);
    if (d.getDay() === 0) continue;
    const info = Cal.getDay(d);
    // resolveLectionaryKey (app.js): SUNDAY[dayInfo.key] directo
    if (C.BCPLectionary.SUNDAY[info.key] && info.key === k) found = true;
    else if (C.BCPLectionary.SUNDAY[info.key]) { found = true; notOwn.push(`${k} ${y}→${info.key}`); }
    else { found = true; notOwn.push(`${k} ${y}→(sin lecturas) ${info.key}`); }
  }
}
console.log('E2. Fiestas fijas (primer año en día de semana) cuyo getDay no devuelve la clave propia de la fiesta:', notOwn.length, notOwn);

// ── Matriz de alineación de ciclos app→libro (Propios, ciclo X del app vs ciclo Y del libro) ──
const mat = {};
for (const f of D.FIELDS) { mat[f] = { A: { A: 0, B: 0, C: 0 }, B: { A: 0, B: 0, C: 0 }, C: { A: 0, B: 0, C: 0 } }; }
for (const k of Object.keys(V.propers)) {
  if (!C.BCPLectionary.SUNDAY[k]) continue;
  for (const ca of ['A', 'B', 'C']) for (const cb of ['A', 'B', 'C']) for (const f of D.FIELDS) {
    const r = compare(C.BCPLectionary.SUNDAY[k][ca][f], V.propers[k][cb][f], f);
    if (r.cls === 'IGUAL' || r.cls === 'EQUIVALENTE') mat[f][ca][cb]++;
  }
}
console.log('Matriz de alineación (nº de Propios, de 27, donde app ciclo X == libro ciclo Y), por campo:');
for (const f of D.FIELDS) console.log('  ', f, JSON.stringify(mat[f]));
out.mat = mat;

// ── Propios×ciclo con los 4 campos coincidentes ──
let fullOK = 0, gospelOK = 0, tot = 0, firstGospelBoth = 0;
for (const k of Object.keys(V.propers)) {
  if (!C.BCPLectionary.SUNDAY[k]) continue;
  for (const c of ['A', 'B', 'C']) {
    tot++;
    const rs = D.FIELDS.map(f => compare(C.BCPLectionary.SUNDAY[k][c][f], V.propers[k][c][f], f).cls);
    if (rs.every(x => x === 'IGUAL' || x === 'EQUIVALENTE')) fullOK++;
    if (rs[3] === 'IGUAL' || rs[3] === 'EQUIVALENTE') gospelOK++;
    if ((rs[0] === 'IGUAL' || rs[0] === 'EQUIVALENTE') && (rs[3] === 'IGUAL' || rs[3] === 'EQUIVALENTE')) firstGospelBoth++;
  }
}
console.log(`Domingos-ciclo (27×3=${tot}): 4 lecturas coincidentes=${fullOK}; evangelio coincidente=${gospelOK}; 1.ª lectura y evangelio coincidentes=${firstGospelBoth}`);
out.fullOK = fullOK; out.gospelOK = gospelOK; out.tot = tot; out.firstGospelBoth = firstGospelBoth;

// ── ¿Qué hace el app con book refs «Ecclesiasticus»/«Judith»? ──
const wrapper = fs.readFileSync('C:/Users/gonza/OneDrive/Desktop/liturgia/js/lib/biblia-wrapper.js', 'utf8');
out.wrapperHasJudith = /Judith|Jdt/.test(wrapper);
out.wrapperHasEcclesiasticus = /Ecclesiasticus/.test(wrapper);
console.log('biblia-wrapper.js menciona Judith:', out.wrapperHasJudith, '| Ecclesiasticus:', out.wrapperHasEcclesiasticus);
fs.writeFileSync(path.join(__dirname, 'lect2-extra.json'), JSON.stringify(out, null, 1));
