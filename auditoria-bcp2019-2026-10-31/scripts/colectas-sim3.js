// Contraste dia a dia: colecta que elige el app vs la que el LIBRO prescribe (rubricas citadas en el informe).
// Las tablas CLS/TEXT son el resultado de mi cotejo manual clave por clave (ver colectas.md).
const fs = require('fs');
const S = require('./colectas-sim.js');
const { BCPCalendar, resolveCollectKey, COL, seasonOfKey } = S;

// ---------- clasificacion manual (C=COINCIDE V=VARIANTE D=DISTINTA) ----------
const CLS = {};
const TEXT = {};   // clave del app -> slot oficial cuyo texto es en realidad (null = no esta en el libro)
function set(k, c, t) { CLS[k] = c; TEXT[k] = t; }
// Adviento / Navidad
set('advent1', 'C', 'advent1'); set('advent2', 'C', 'advent2'); set('advent3', 'V', 'advent3'); set('advent4', 'D', null);
set('christmas', 'C', 'christmasDay'); set('christmasSunday', 'D', 'christmas2'); set('christmasSunday2', 'D', null); set('circumcision', 'V', 'holyName');
// Epifania
set('epiphany', 'C', 'epiphany'); set('epiphany1', 'V', 'epiphany1'); set('epiphany2', 'D', null); set('epiphany3', 'C', 'epiphany3');
set('epiphany4', 'D', null); set('epiphany5', 'D', 'epiphany2'); set('epiphany6', 'D', null); set('epiphany7', 'D', null);
set('epiphany8', 'D', 'proper17'); set('transfiguration', 'C', 'epiphanyLast');
// Cuaresma / Semana Santa
set('ashWednesday', 'C', 'ashWednesday'); set('lent1', 'D', null); set('lent2', 'D', null); set('lent3', 'D', 'lent2'); set('lent4', 'D', null); set('lent5', 'D', 'goodFriday');
set('palmSunday', 'V', 'palmSunday'); set('maundyThursday', 'C', 'maundyThursday'); set('goodFriday', 'C', 'goodFriday'); set('holySaturday', 'V', 'holySaturday');
// Pascua
set('easter', 'V', 'easterDay'); set('easter2', 'D', null); set('easter3', 'D', 'easterWeekWed'); set('easter4', 'C', 'easter4'); set('easter5', 'C', 'easter5');
set('easter6', 'D', null); set('easter7', 'C', 'easter7'); set('ascension', 'C', 'ascension'); set('pentecost', 'C', 'pentecost'); set('trinitySunday', 'V', 'trinity');
// Propios
const PR = { 3: ['D', null], 4: ['D', null], 5: ['D', 'proper11'], 6: ['D', 'proper15'], 7: ['D', 'proper2'], 8: ['D', null], 9: ['D', null], 10: ['D', null],
  11: ['D', 'proper4'], 12: ['D', null], 13: ['C', 'proper13'], 14: ['D', null], 15: ['D', null], 16: ['C', 'proper16'], 17: ['C', 'proper17'], 18: ['D', null],
  19: ['D', 'proper12'], 20: ['D', 'proper11'], 21: ['D', null], 22: ['D', null], 23: ['D', 'proper17'], 24: ['D', 'proper14'], 25: ['D', 'proper16'],
  26: ['D', null], 27: ['D', null], 28: ['D', null], 29: ['C', 'proper29'] };
for (const [n, [c, t]] of Object.entries(PR)) set('proper' + n, c, t);
// Santoral fijo
const FX_C = ['01-18', '01-25', '02-02', '02-24', '03-19', '03-25', '04-25', '06-29', '08-24', '09-14', '09-29', '10-18', '11-01', '11-30', '12-21', '12-26', '12-27'];
const FX_V = ['01-01', '05-01', '05-31', '06-11', '06-24', '09-21', '12-28'];
const FX_D = { '07-22': null, '07-25': null, '08-06': 'epiphanyLast', '08-15': null, '10-23': null, '10-28': null };
FX_C.forEach(k => set(k, 'C', k)); FX_V.forEach(k => set(k, 'V', k)); Object.entries(FX_D).forEach(([k, t]) => set(k, 'D', t));

function keySlot(k) {
  if (!k) return null;
  let m;
  if ((m = /^advent(\d)$/.exec(k))) return 'advent' + m[1];
  if (k === 'christmas') return 'christmasDay';
  if (k === 'christmasSunday') return 'christmas1';
  if (k === 'christmasSunday2') return 'christmas2';
  if (k === 'circumcision') return 'holyName';
  if (k === 'epiphany') return 'epiphany';
  if ((m = /^epiphany(\d)$/.exec(k))) return 'epiphany' + m[1];
  if (k === 'transfiguration') return 'epiphanyLast';
  if (k === 'ashWednesday') return 'ashWednesday';
  if ((m = /^lent(\d)$/.exec(k))) return 'lent' + m[1];
  if (['palmSunday', 'maundyThursday', 'goodFriday', 'holySaturday'].includes(k)) return k;
  if (k === 'easter') return 'easterDay';
  if ((m = /^easter(\d)$/.exec(k))) return 'easter' + m[1];
  if (k === 'ascension') return 'ascension';
  if (k === 'pentecost') return 'pentecost';
  if (k === 'trinitySunday') return 'trinity';
  if ((m = /^proper(\d+)$/.exec(k))) return 'proper' + m[1];
  if (/^\d\d-\d\d$/.test(k)) return k;
  return null;
}

const DOWN = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function prevSunday(date) { const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12); d.setDate(d.getDate() - d.getDay()); return d; }
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Colecta que prescribe el LIBRO para ese dia -> {slot, regla}
function bookSlot(date, di) {
  const y = date.getFullYear(), dow = date.getDay();
  const F = BCPCalendar.getFeastDates(y);
  const md = String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  if (md === '11-01') return { slot: '11-01', rule: 'AllSaints-fiesta-principal' };            // p.687: Principal Feast, precede a cualquier otro dia
  if (dow === 0 || (di.isFixed && keySlot(di.key))) return { slot: keySlot(di.key), rule: 'propio' };
  if (di.key === 'pentecost' || di.key === 'ascension' || keySlot(di.key) && !/Feria/.test(di.key)) return { slot: keySlot(di.key), rule: 'propio' };
  // ferias
  if (/^holyWeekFeria_/.test(di.key)) return { slot: ['', 'holyWeekMon', 'holyWeekTue', 'holyWeekWed'][dow], rule: 'SemanaSanta-L-M-X-propias(p.607-608)' };
  const easter = F.easter;
  const dE = Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(easter.getFullYear(), easter.getMonth(), easter.getDate())) / 86400000);
  if (dE >= 1 && dE <= 6) return { slot: 'easterWeek' + DOWN[dow], rule: 'SemanaPascua-propias(p.609-611)' };
  if (date > F.ashWednesday && date < F.lent1) return { slot: 'ashWednesday', rule: 'Ceniza-sirve-dias-siguientes(p.605)' };
  if (sameDay(date, new Date(F.ascension.getFullYear(), F.ascension.getMonth(), F.ascension.getDate() + 1)) || sameDay(date, new Date(F.ascension.getFullYear(), F.ascension.getMonth(), F.ascension.getDate() + 2)))
    return { slot: 'ascension', rule: 'Ascension-vie-sab(p.613)' };
  const ps = prevSunday(date);
  const psInfo = BCPCalendar.getDay(ps);
  if (psInfo.key === 'pentecost' || psInfo.key === 'trinitySunday')
    return { slot: 'proper' + BCPCalendar.getProperNumber(ps), rule: (psInfo.key === 'pentecost' ? 'Pentecostes' : 'Trinidad') + '-ferias->propio-fechado(p.614)' };
  // Navidad: ferias entre Inocentes y el 1er domingo de Navidad
  const m = date.getMonth(), dd = date.getDate();
  if ((m === 11 && dd >= 29) || (m === 0 && dd <= 5)) {
    const chr = new Date(m === 11 ? y : y - 1, 11, 25, 12);
    if (ps <= chr) return { slot: 'christmasDay', rule: 'Navidad-ferias-Inocentes->1erDomNavidad(p.600)' };
  }
  if (di.key === 'epiphanyOctaveFeria') return { slot: 'epiphany', rule: 'Epifania-ferias-hasta-domingo(p.601)' };
  return { slot: keySlot(psInfo.key), rule: 'domingo-precedente(p.21/p.48)' };
}

function analyze(y0, y1, csv) {
  const agg = { dias: 0, OK_C: 0, OK_V: 0, LOGICA: 0, TEXTO: 0, porRegla: {}, porReglaOK: {}, ej: {} };
  const rowsCsv = [];
  const seasonMismatch = [];
  for (let y = y0; y <= y1; y++) for (let m = 0; m < 12; m++) {
    const dim = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= dim; d++) {
      const date = new Date(y, m, d, 12);
      const di = BCPCalendar.getDay(date);
      const ck = resolveCollectKey(di, date);
      const bk = bookSlot(date, di);
      const textSlot = Object.prototype.hasOwnProperty.call(TEXT, ck) ? TEXT[ck] : undefined;
      const kSlot = keySlot(ck);
      let verdict;
      if (textSlot && textSlot === bk.slot) verdict = CLS[ck] === 'C' ? 'OK_C' : 'OK_V';
      else if (kSlot !== bk.slot) verdict = 'LOGICA';
      else verdict = 'TEXTO';
      agg.dias++; agg[verdict]++;
      if (verdict === 'LOGICA') { agg.porRegla[bk.rule] = (agg.porRegla[bk.rule] || 0) + 1; (agg.ej[bk.rule] = agg.ej[bk.rule] || []).length < 3 && agg.ej[bk.rule].push(`${y}-${m + 1}-${d} ${di.nameEs} -> app:${ck} (${kSlot}) / libro:${bk.slot}`); }
      if (y0 === y1 || csv) {
        const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        rowsCsv.push([iso, ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'][date.getDay()], di.key, di.nameEs.replace(/;/g, ','), ck, kSlot, bk.slot, bk.rule, textSlot === undefined ? '' : textSlot, CLS[ck] || '', verdict].join(';'));
      }
      // temporada manifiestamente ajena (solo ferias no santoral)
      if (!di.isFixed) {
        const sk = seasonOfKey(ck);
        const fam = s => (s === 'pentecost' || s === 'ordinary') ? 'post' : s;
        if (sk !== '?' && fam(sk) !== fam(di.season)) seasonMismatch.push(`${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')} ${di.nameEs} [${di.season}] -> clave ${ck} [${sk}]`);
      }
    }
  }
  return { agg, rowsCsv, seasonMismatch };
}

module.exports = { CLS, TEXT, keySlot, bookSlot, analyze };

if (require.main === module) {
  const cnt = { C: 0, V: 0, D: 0 };
  Object.keys(CLS).forEach(k => cnt[CLS[k]]++);
  console.log('claves clasificadas:', Object.keys(CLS).length, cnt, ' | sin clasificar:', Object.keys(COL).filter(k => !CLS[k]));
  const fixedCnt = { C: 0, V: 0, D: 0 }; Object.keys(CLS).filter(k => /^\d\d-\d\d$/.test(k)).forEach(k => fixedCnt[CLS[k]]++);
  console.log('santoral fijo:', fixedCnt);
  const header = 'fecha;dow;clave_dia;dia;clave_colecta_app;slot_de_la_clave;slot_prescrito_libro;regla_libro;slot_del_TEXTO_del_app;clase;veredicto';
  for (const y of [2026, 2027]) {
    const r = analyze(y, y);
    console.log(y, JSON.stringify(r.agg, null, 1));
    console.log('temporada ajena:', r.seasonMismatch.length);
    r.seasonMismatch.slice(0, 40).forEach(s => console.log('   ', s));
    fs.writeFileSync(`C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/audit/colectas-dias-${y}.csv`, [header, ...r.rowsCsv].join('\n'), 'utf8');
  }
  const big = analyze(2024, 2060);
  console.log('2024-2060', JSON.stringify(big.agg, null, 1));
  console.log('temporada ajena 2024-2060:', big.seasonMismatch.length);
}
