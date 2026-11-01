// sim_edges.js — Bordes del calendario: Pascua, ciclo A/B/C, transiciones de temporada, traslados/supresiones de
// fiestas fijas, bisiestos, 1-ene/31-dic, invariancia de zona horaria y de hora del día, numeración de semanas de Cuaresma.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const L = require('./sim_lib');
const C = L.load({ bible: false });
const Cal = C.BCPCalendar;
const out = []; const P = (...a) => out.push(a.join(' '));
const cnt = (arr, f) => { const m = {}; for (const x of arr) { const k = f(x); m[k] = (m[k] || 0) + 1; } return m; };
const days = []; for (const d of L.eachDay(2023, 2061)) days.push(d); // márgenes para transiciones
const info = days.map(d => ({ d, i: Cal.getDay(d) }));
const inRange = info.filter(x => x.d.getFullYear() >= 2024 && x.d.getFullYear() <= 2060);

// ── A) Pascua: contra algoritmo independiente (Gauss/«Anonymous» con otra formulación) ──
function easterIndep(Y) { // Butcher-Meeus, forma alternativa vía día juliano gregoriano de equinoccio (algoritmo de Oudin)
  const G = Y % 19, C_ = Math.floor(Y / 100);
  const H = (C_ - Math.floor(C_ / 4) - Math.floor((8 * C_ + 13) / 25) + 19 * G + 15) % 30;
  const I = H - Math.floor(H / 28) * (1 - Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11));
  const J = (Y + Math.floor(Y / 4) + I + 2 - C_ + Math.floor(C_ / 4)) % 7;
  const Lx = I - J;
  const month = 3 + Math.floor((Lx + 40) / 44);
  const day = Lx + 28 - 31 * Math.floor(month / 4);
  return new Date(Y, month - 1, day);
}
let easterBad = [];
for (let Y = 1900; Y <= 2100; Y++) { const a = Cal.computeEaster(Y), b = easterIndep(Y); if (+a !== +b) easterBad.push(Y); }
P('## A) Pascua'); P(`  computeEaster vs algoritmo de Oudin, años 1900-2100: discrepancias = ${easterBad.length}`);
const eas = []; for (let Y = 2024; Y <= 2060; Y++) eas.push([Y, Cal.computeEaster(Y)]);
eas.sort((a, b) => (a[1].getMonth() * 100 + a[1].getDate()) - (b[1].getMonth() * 100 + b[1].getDate()));
P(`  Pascua más temprana en 2024-2060: ${eas[0][0]}-${String(eas[0][1].getMonth() + 1).padStart(2, '0')}-${String(eas[0][1].getDate()).padStart(2, '0')}; más tardía: ${eas[eas.length - 1][0]}-${String(eas[eas.length - 1][1].getMonth() + 1).padStart(2, '0')}-${String(eas[eas.length - 1][1].getDate()).padStart(2, '0')}`);
P('  Pascuas conocidas (control externo): 2025-04-20, 2026-04-05, 2027-03-28, 2038-04-25, 2035-03-25: ' + [2025, 2026, 2027, 2038, 2035].map(y => L.iso(Cal.computeEaster(y))).join(', '));

// ── B) Ciclo A/B/C ──
P('\n## B) Ciclo dominical');
const adv1 = y => { const nov27 = new Date(y, 10, 27); const dow = nov27.getDay(); return new Date(y, 10, 27 + ((7 - dow) % 7)); }; // domingo entre 27 nov y 3 dic
let advMismatch = 0; for (let y = 2023; y <= 2061; y++) if (+adv1(y) !== +Cal.getFeastDates(y).advent1) advMismatch++;
P(`  Adviento I (domingo 27-nov..3-dic) vs getFeastDates().advent1: discrepancias = ${advMismatch}`);
const letterOf = y => ['A', 'B', 'C'][y % 3]; // 2022 -> A (2022%3=0), 2023 -> B, 2024 -> C, 2025 -> A
let cycBad = [], changes = [];
for (let k = 0; k < info.length; k++) {
  const x = info[k]; const y = x.d.getFullYear();
  const a1 = adv1(y); const start = (x.d >= a1) ? y : y - 1; // x.d a las 12:00 >= a1 a las 00:00
  const exp = letterOf(start);
  if (x.i.cycle !== exp) cycBad.push(L.iso(x.d) + ` got=${x.i.cycle} exp=${exp}`);
  if (k > 0 && info[k - 1].i.cycle !== x.i.cycle) changes.push({ d: x.d, from: info[k - 1].i.cycle, to: x.i.cycle });
}
P(`  Días 2023-2061 cuyo ciclo difiere del cálculo independiente (A=Adviento 2022, 2025, ...): ${cycBad.length}${cycBad.length ? ' ' + cycBad.slice(0, 5).join('; ') : ''}`);
const badChanges = changes.filter(c => +new Date(c.d.getFullYear(), c.d.getMonth(), c.d.getDate()) !== +adv1(c.d.getFullYear()));
P(`  Cambios de ciclo entre días consecutivos: ${changes.length}; que NO caen en el 1.º domingo de Adviento: ${badChanges.length}`);
P('  Secuencia de cambios: ' + changes.slice(0, 6).map(c => `${L.iso(c.d)} ${c.from}→${c.to}`).join(', ') + ' …');
P('  Ciclo en Adviento I (Misal vs BCP) 2025-11-30: ' + Cal.getDay(L.D(2025, 11, 30)).cycle + ' (esperado A); 2025-11-29: ' + Cal.getDay(L.D(2025, 11, 29)).cycle + ' (esperado C)');
P('  Ciclo el 2026-10-31 (hoy): ' + Cal.getDay(L.D(2026, 10, 31)).cycle);

// ── C) Transiciones de temporada ──
P('\n## C) Transiciones de temporada día a día (2024-2060)');
const trans = {}; const flicker = [];
for (let k = 1; k < inRange.length; k++) {
  const a = inRange[k - 1].i.season, b = inRange[k].i.season;
  if (a !== b) { const t = `${a} → ${b}`; (trans[t] = trans[t] || []).push(L.iso(inRange[k].d)); }
}
const canon = new Set(['advent → christmas', 'christmas → epiphany', 'epiphany → lent', 'lent → holyWeek', 'holyWeek → easter', 'easter → pentecost', 'pentecost → ordinary', 'ordinary → advent']);
for (const [t, v] of Object.entries(trans).sort((a, b) => b[1].length - a[1].length)) P(`  ${String(v.length).padStart(4)}  ${t}${canon.has(t) ? '' : '   <-- NO canónica'}  p.ej. ${v.slice(0, 3).join(', ')}`);
// parpadeo: A→B→A en ≤3 días
for (let k = 2; k < inRange.length; k++) {
  const s0 = inRange[k - 2].i.season, s1 = inRange[k - 1].i.season, s2 = inRange[k].i.season;
  if (s0 === s2 && s1 !== s0) flicker.push(L.iso(inRange[k - 1].d) + ' ' + s0 + '→' + s1 + '→' + s2);
}
P(`  Parpadeos de temporada (A→B→A en 1 día): ${flicker.length}${flicker.length ? '  ' + flicker.slice(0, 8).join('; ') : ''}`);
// Temporada de Pentecostés/Trinidad: 'trinitySunday' tiene season ordinary pero seasonForDate daría pentecost
const trin = inRange.filter(x => x.i.key === 'trinitySunday'); P(`  Trinidad: season="${trin[0].i.season}" (el día anterior es "${inRange[inRange.indexOf(trin[0]) - 1].i.season}")`);
// color/season matriz
const mat = cnt(inRange, x => `${x.i.season}/${x.i.color}`);
P('  Matriz temporada/color (días): ' + Object.entries(mat).sort().map(([k, v]) => `${k}:${v}`).join('  '));
const colorsUnknown = inRange.filter(x => !['white', 'red', 'violet', 'rose', 'green'].includes(x.i.color)); P('  colores fuera de {white,red,violet,rose,green}: ' + colorsUnknown.length);

// ── D) Domingos ──
P('\n## D) Domingos');
const sundays = inRange.filter(x => x.d.getDay() === 0);
P(`  Domingos 2024-2060: ${sundays.length}`);
const notSun = sundays.filter(x => !['sunday', 'principal'].includes(x.i.rank));
P(`  Domingos cuyo rango no es sunday/principal: ${notSun.length}${notSun.length ? ' ' + notSun.slice(0, 5).map(x => L.iso(x.d) + ':' + x.i.key + ':' + x.i.rank).join('; ') : ''}`);
const feriaSun = sundays.filter(x => /Feria|^feria$/.test(x.i.key)); P(`  Domingos con clave de feria: ${feriaSun.length}`);
const nonSunWithSundayKey = inRange.filter(x => x.d.getDay() !== 0 && x.i.rank === 'sunday'); P(`  Días NO domingo con rango sunday: ${nonSunWithSundayKey.length}`);
// claves repetidas en un mismo año litúrgico
const byLY = {};
for (const x of sundays) { const y = x.d; const a1 = adv1(y.getFullYear()); const ly = (y >= a1) ? y.getFullYear() : y.getFullYear() - 1; (byLY[ly] = byLY[ly] || []).push(x.i.key); }
let dups = [];
for (const [ly, ks] of Object.entries(byLY)) { const c = cnt(ks, k => k); for (const [k, v] of Object.entries(c)) if (v > 1) dups.push(`${ly}:${k}x${v}`); }
P(`  Claves de domingo repetidas dentro de un mismo año litúrgico: ${dups.length}${dups.length ? ' ' + dups.slice(0, 10).join(', ') : ''}`);
const nSun = Object.values(byLY).map(a => a.length); P(`  Domingos por año litúrgico (años completos): min=${Math.min(...Object.entries(byLY).filter(([y]) => y >= 2024 && y <= 2059).map(([, a]) => a.length))} máx=${Math.max(...Object.entries(byLY).filter(([y]) => y >= 2024 && y <= 2059).map(([, a]) => a.length))}`);
// Secuencia tipo de un año
P('  Secuencia 2025-26 (año A): ' + byLY[2025].join(' '));
P('  Secuencia 2037-38 (Pascua 2038-04-25): ' + byLY[2037].join(' '));
P('  Secuencia 2034-35 (Pascua 2035-03-25): ' + byLY[2034].join(' '));

// ── E) Fiestas fijas: celebradas / trasladadas / suprimidas ──
P('\n## E) Fiestas fijas (' + Object.keys(Cal.FIXED_FEASTS).length + ' del santoral): destino en 2024-2060');
let celebrated = 0, transferred = 0, suppressed = 0; const cause = {}; const trList = [];
const supList = [];
for (let y = 2024; y <= 2060; y++) {
  const T = Cal.getTransferredFeasts(y);
  for (const md of Object.keys(Cal.FIXED_FEASTS)) {
    const [mm, dd] = md.split('-').map(Number); const dt = L.D(y, mm, dd); const g = Cal.getDay(dt);
    if (g.key === md && !g.isTransferred) { celebrated++; continue; }
    if (T.from.has(md)) {
      const to = T.from.get(md); const gt = Cal.getDay(new Date(to.getFullYear(), to.getMonth(), to.getDate(), 12));
      if (gt.key === md && gt.isTransferred) { transferred++; trList.push(`${y} ${md}→${L.iso(to)} (${gt.nameEs.slice(0, 22)})`); } else { supList.push(`${y} ${md}: traslado a ${L.iso(to)} pero allí sale ${gt.key}`); }
      continue;
    }
    suppressed++; const k = dt.getDay() === 0 ? 'domingo (' + g.key.replace(/\d+/g, 'N') + ')' : 'día no domingo (' + g.key.replace(/_?\d+/g, 'N') + ')'; cause[k] = (cause[k] || 0) + 1;
    if (supList.length < 400) supList.push(`${y} ${md} (${['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][dt.getDay()]}) → ${g.key}`);
  }
}
P(`  celebradas en su fecha: ${celebrated}; trasladadas (con destino verificado): ${transferred}; SUPRIMIDAS sin traslado: ${suppressed}`);
P('  causa de la supresión: ' + JSON.stringify(cause));
P('  traslados (muestra): ' + trList.slice(0, 14).join('; ') + (trList.length > 14 ? ` … (${trList.length})` : ''));
P('  Traslados cuyo destino NO devuelve la fiesta: ' + supList.filter(s => /traslado a/.test(s)).length);
const supFeast = cnt(supList.filter(s => !/traslado a/.test(s)), s => s.split(' ')[1]); P('  suprimidas por fiesta: ' + Object.entries(supFeast).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(' '));
const nonSunSupp = supList.filter(s => !/traslado a/.test(s) && !/\(dom\)/.test(s)); P('  suprimidas en día NO domingo (y sin traslado): ' + nonSunSupp.length + ' → ' + nonSunSupp.slice(0, 20).join('; '));
// Fiestas con prioridad del propio día: ver qué día especial las desplaza
// ── F) Fecha especial ──
P('\n## F) Bisiestos y bordes');
const leap = [2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060];
let leapBad = [];
for (const y of leap) {
  const a = Cal.getDay(L.D(y, 2, 28)), b = Cal.getDay(L.D(y, 2, 29)), c = Cal.getDay(L.D(y, 3, 1));
  if (!a.key || !b.key || !c.key || /null|undefined/.test(a.key + b.key + c.key)) leapBad.push(y);
  const nxt = new Date(y, 1, 28, 12); nxt.setDate(nxt.getDate() + 1); if (nxt.getMonth() !== 1 || nxt.getDate() !== 29) leapBad.push('fecha ' + y);
}
P(`  29-feb en bisiestos ${leap.join(',')}: anomalías = ${leapBad.length}`);
P('  29-feb-2024: ' + JSON.stringify(Cal.getDay(L.D(2024, 2, 29))));
P('  1-ene en cada día de la semana → clave: ' + [2024, 2023, 2025, 2026, 2027, 2028, 2029].map(y => `${y}(${['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][L.D(y, 1, 1).getDay()]})=${Cal.getDay(L.D(y, 1, 1)).key}`).join('  '));
P('  31-dic en 2024-2060: claves distintas: ' + [...new Set(inRange.filter(x => x.d.getMonth() === 11 && x.d.getDate() === 31).map(x => x.i.key.replace(/\d+/g, 'N')))].join(', '));
P('  25-dic en 2024-2060: ' + [...new Set(inRange.filter(x => x.d.getMonth() === 11 && x.d.getDate() === 25).map(x => x.i.key))].join(', '));
P('  6-ene (Epifanía) en 2024-2060: ' + [...new Set(inRange.filter(x => x.d.getMonth() === 0 && x.d.getDate() === 6).map(x => x.i.key))].join(', '));

// ── G) Invariancia de hora del día y de zona horaria ──
P('\n## G) Invariancia');
const sig = (mk) => { const h = crypto.createHash('sha1'); let n = 0, diff = []; for (let y = 2024; y <= 2060; y++) for (let m = 0; m < 12; m++) for (let dd = 1; dd <= 31; dd++) { const t = mk(y, m, dd); if (t.getMonth() !== m) continue; const g = Cal.getDay(t); h.update(`${y}-${m}-${dd}|${g.key}|${g.season}|${g.cycle}|${g.color}|${g.nameEs};`); n++; } return h.digest('hex').slice(0, 12) + `(${n})`; };
const base = sig((y, m, d) => new Date(y, m, d, 12, 0, 0));
P('  base 12:00 local: ' + base);
for (const [h, mi, s] of [[0, 0, 0], [0, 30, 0], [23, 59, 59], [6, 0, 0], [18, 0, 0]]) P(`  hora ${h}:${mi}:${s} → ${sig((y, m, d) => new Date(y, m, d, h, mi, s))}${sig((y, m, d) => new Date(y, m, d, h, mi, s)) === base ? ' IGUAL' : '  <-- DIFIERE'}`);
// qué días difieren a las 00:00
{
  let diffs = [];
  for (const x of inRange) { const t0 = new Date(x.d.getFullYear(), x.d.getMonth(), x.d.getDate(), 0, 0, 0); const g = Cal.getDay(t0); if (g.key !== x.i.key || g.season !== x.i.season) diffs.push(L.iso(x.d) + ` ${x.i.key}→${g.key}`); }
  P(`  días cuya clave/temporada cambia entre 12:00 y 00:00: ${diffs.length}${diffs.length ? '  ' + diffs.slice(0, 6).join('; ') : ''}`);
  let d2 = [];
  for (const x of inRange) { const t0 = new Date(x.d.getFullYear(), x.d.getMonth(), x.d.getDate(), 23, 59, 59); const g = Cal.getDay(t0); if (g.key !== x.i.key || g.season !== x.i.season) d2.push(L.iso(x.d) + ` ${x.i.key}→${g.key}`); }
  P(`  días cuya clave/temporada cambia entre 12:00 y 23:59:59: ${d2.length}${d2.length ? '  ' + d2.slice(0, 6).join('; ') : ''}`);
}
/* TZ: ver sim_tz.js (un proceso por zona, el caché interno del calendario guarda Date en la zona inicial) */
// ── H) Ferias de Cuaresma: numeración de semana ──
P('\n## H) Nombres de ferias de Cuaresma (nameEs) — año 2026 (Pascua 2026-04-05)');
const lentD = inRange.filter(x => x.d.getFullYear() === 2026 && x.i.season === 'lent');
P('  ' + lentD.map(x => `${L.iso(x.d).slice(5)} ${['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][x.d.getDay()]}: ${x.i.nameEs}`).join('\n  '));
// recuento de días con semana equivocada: semana correcta = nº de domingos de cuaresma ya pasados (Mon-Sat tras Lent N = N); jue-sáb tras Ceniza = 0
let wrong = 0, tot = 0; const wrongEx = [];
for (const x of inRange) {
  const m = x.i.key.match(/^lentFeria(\d+)_(\d)$/); if (!m) continue; tot++;
  const F = Cal.getFeastDates(x.d.getFullYear());
  const dsSinceLent1 = Math.round((Date.UTC(x.d.getFullYear(), x.d.getMonth(), x.d.getDate()) - Date.UTC(F.lent1.getFullYear(), F.lent1.getMonth(), F.lent1.getDate())) / 86400000);
  const correct = dsSinceLent1 < 0 ? 0 : Math.floor(dsSinceLent1 / 7) + 1; // semana tras el domingo N
  if (+m[1] !== correct) { wrong++; if (wrongEx.length < 6) wrongEx.push(`${L.iso(x.d)} ${x.i.nameEs} (clave ${x.i.key}; correcto: semana ${correct || 'tras Ceniza'})`); }
}
P(`  ferias de Cuaresma (lentFeria): ${tot}; con número de semana distinto del de la semana litúrgica real: ${wrong}  (${(100 * wrong / tot).toFixed(0)}%)`);
wrongEx.forEach(e => P('     · ' + e));
// Ferias de Pascua/Adviento: controlar
let wrongE = 0, totE = 0;
for (const x of inRange) {
  const m = x.i.key.match(/^easterFeria(\d+)_(\d)$/); if (!m) continue; totE++;
  const F = Cal.getFeastDates(x.d.getFullYear()); const ds = Math.round((Date.UTC(x.d.getFullYear(), x.d.getMonth(), x.d.getDate()) - Date.UTC(F.easter.getFullYear(), F.easter.getMonth(), F.easter.getDate())) / 86400000);
  if (+m[1] !== Math.floor(ds / 7) + 1) wrongE++;
}
P(`  control — ferias de Pascua con semana incorrecta: ${wrongE} de ${totE}`);
let wrongA = 0, totA = 0;
for (const x of inRange) {
  const m = x.i.key.match(/^adventFeria(\d+)_(\d)$/); if (!m) continue; totA++;
  const F = Cal.getFeastDates(x.d.getFullYear()); const ds = Math.round((Date.UTC(x.d.getFullYear(), x.d.getMonth(), x.d.getDate()) - Date.UTC(F.advent1.getFullYear(), F.advent1.getMonth(), F.advent1.getDate())) / 86400000);
  if (+m[1] !== Math.floor(ds / 7) + 1) wrongA++;
}
P(`  control — ferias de Adviento con semana incorrecta: ${wrongA} de ${totA}`);
// causa: diffDays con 12:00 vs 00:00
P('  diffDays(ceniza 00:00, ceniza+1 a las 12:00) devuelto por el código (vía clave): ver Cal… no exportado; evidencia: lentFeria2_3 (miércoles tras 1.º dom.) = ' + (inRange.find(x => x.i.key === 'lentFeria2_3') ? L.iso(inRange.find(x => x.i.key === 'lentFeria2_3').d) : '?'));

// ── I) Propios ──
P('\n## I) Propios (domingos tras Trinidad)');
const propers = inRange.filter(x => /^proper\d+$/.test(x.i.key));
const firstProper = {}; for (const x of propers) { const y = x.d.getFullYear(); if (!firstProper[y]) firstProper[y] = x.i.key; }
P('  primer Propio tras Trinidad por año: ' + Object.entries(firstProper).map(([y, k]) => `${y}:${k.replace('proper', 'P')}`).join(' '));
// Propio 29 siempre el domingo previo a Adviento I
let p29bad = 0; for (const x of propers) if (x.i.key === 'proper29') { const nx = new Date(x.d.getFullYear(), x.d.getMonth(), x.d.getDate() + 7, 12); if (Cal.getDay(nx).key !== 'advent1') p29bad++; }
P('  Propio 29 (Cristo Rey) que NO precede inmediatamente a Adviento I: ' + p29bad);
const skip = []; for (let y = 2024; y <= 2060; y++) { const ps = propers.filter(x => x.d.getFullYear() === y).map(x => +x.i.key.replace('proper', '')); for (let k = 1; k < ps.length; k++) if (ps[k] - ps[k - 1] !== 1) skip.push(`${y}: P${ps[k - 1]}→P${ps[k]}`); }
P('  saltos/repeticiones en la numeración consecutiva de Propios dentro de un año: ' + skip.length + (skip.length ? ' ' + skip.slice(0, 8).join('; ') : ''));
// Días entre Pentecostés y Trinidad / Trinidad y primer propio
// Domingo siguiente a Trinidad: ¿es Propio? (Trinidad+7)
let afterTrin = {}; for (let y = 2024; y <= 2060; y++) { const F = Cal.getFeastDates(y); const nx = new Date(y, F.trinitySunday.getMonth(), F.trinitySunday.getDate() + 7, 12); const k = Cal.getDay(nx).key; afterTrin[k] = (afterTrin[k] || 0) + 1; }
P('  domingo siguiente a Trinidad: ' + JSON.stringify(afterTrin));

fs.writeFileSync(path.join(__dirname, 'out', 'edges.txt'), out.join('\n'));
console.log('ok');
