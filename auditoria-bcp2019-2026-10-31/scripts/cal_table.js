// Auditoría calendario — Tabla de fechas móviles del libro (pp. 714-715) vs app; rangos de Propio; ciclo A/B/C. SOLO LECTURA.
const fs = require('fs');
const H = require('../harness.js');
const Cal = H.load().BCPCalendar;
const MD = 'C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md';
const lines = fs.readFileSync(MD, 'utf8').split(/\r?\n/);
const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const mdStr = (d) => `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]} ${d.getDate()}`;

// ── parseo de la tabla del libro: líneas 20490-20533 ──
const re = /(Mar|Apr)\s+(\d+)\s+(\d+)\s+(Feb|Mar)\s+(\d+)\s+(Apr|May|Jun)\s+(\d+)\s+(May|Jun)\s+(\d+)\s+Proper\s+(\d+)\s+(Nov|Dec)\s+(\d+)/;
const rows = new Map(); // key 'Mar 22' -> fila
for (let i = 20490 - 1; i <= 20533 - 1; i++) {
  const m = re.exec(lines[i].replace(/\|/g, ' '));
  if (!m) continue;
  rows.set(`${m[1]} ${+m[2]}`, {
    easter: [MON[m[1]], +m[2]], sundays: +m[3], ash: [MON[m[4]], +m[5]], asc: [MON[m[6]], +m[7]],
    pent: [MON[m[8]], +m[9]], proper: +m[10], advent: [MON[m[11]], +m[12]], line: i + 1,
  });
}
console.log('Filas de la tabla de fechas móviles extraídas:', rows.size, '(esperadas 35: 22 mar - 25 abr)');
const sortedKeys = [...rows.keys()];
console.log('Primera/última:', sortedKeys[0], sortedKeys[sortedKeys.length - 1]);

const isLeap = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const eq = (d, [m, dd]) => d.getMonth() === m && d.getDate() === dd;

// Domingos después de Epifanía según el app (cuenta de Domingos entre 7-ene y el Miércoles de Ceniza)
function appEpiphanySundays(y) {
  const F = Cal.getFeastDates(y);
  let n = 0; const keys = [];
  for (let d = new Date(y, 0, 7, 12); d < F.ashWednesday; d = new Date(y, d.getMonth(), d.getDate() + 1, 12)) {
    if (d.getDay() === 0) { n++; keys.push(Cal.getDay(d).key); }
  }
  return { n, keys };
}
function firstSundayAfterTrinity(y) {
  const F = Cal.getFeastDates(y);
  const d = new Date(F.trinitySunday.getFullYear(), F.trinitySunday.getMonth(), F.trinitySunday.getDate() + 7, 12);
  return Cal.getDay(d);
}

let tested = 0, bad = { ash: 0, asc: 0, pent: 0, advent: 0, sundays: 0, proper: 0 };
const detail = [];
for (let y = 2001; y <= 2120; y++) {
  const E = Cal.computeEaster(y);
  const F = Cal.getFeastDates(y);
  const row = rows.get(mdStr(E));
  if (!row) { detail.push(`${y}: sin fila para Pascua ${mdStr(E)}`); continue; }
  tested++;
  const leap = isLeap(y);
  // Ceniza: en año bisiesto, +1 día si la fecha impresa cae en febrero (nota p. 715, línea 20534-20536)
  let expAsh = row.ash.slice();
  if (leap && expAsh[0] === 1) expAsh = [1, expAsh[1] + 1];
  if (!eq(F.ashWednesday, expAsh)) { bad.ash++; detail.push(`${y}: Ceniza app ${mdStr(F.ashWednesday)} vs libro ${expAsh}`); }
  if (!eq(F.ascension, row.asc)) { bad.asc++; detail.push(`${y}: Ascensión app ${mdStr(F.ascension)} vs libro ${row.asc}`); }
  if (!eq(F.pentecost, row.pent)) { bad.pent++; detail.push(`${y}: Pentecostés app ${mdStr(F.pentecost)} vs libro ${row.pent}`); }
  if (!eq(F.advent1, row.advent)) { bad.advent++; detail.push(`${y}: Adviento I app ${mdStr(F.advent1)} vs libro ${row.advent}`); }
  // Domingos tras Epifanía: bisiesto = fila de Pascua+1 día
  let expSun = row.sundays;
  if (leap) {
    const E1 = new Date(y, E.getMonth(), E.getDate() + 1);
    const r1 = rows.get(mdStr(E1));
    expSun = r1 ? r1.sundays : null;
  }
  const a = appEpiphanySundays(y);
  if (expSun !== null && a.n !== expSun) { bad.sundays++; detail.push(`${y}${leap ? '(bis)' : ''}: Dom. Epifanía app ${a.n} vs libro ${expSun}`); }
  const p = firstSundayAfterTrinity(y);
  const expP = 'proper' + row.proper;
  if (p.key !== expP) { bad.proper++; detail.push(`${y}: 1er domingo tras Trinidad app ${p.key} vs libro ${expP}`); }
}
console.log('Años cotejados 2001-2120 con la tabla:', tested);
console.log('Discrepancias:', JSON.stringify(bad));
console.log(detail.slice(0, 40).join('\n'));

// Distribución de la cuenta de Domingos de Epifanía y claves emitidas
const keysSeen = new Set(); let maxN = 0;
for (let y = 2001; y <= 2120; y++) { const a = appEpiphanySundays(y); maxN = Math.max(maxN, a.n); a.keys.forEach(k => keysSeen.add(k)); }
console.log('Claves de Domingo de Epifanía emitidas 2001-2120:', [...keysSeen].sort().join(', '), '| máx. domingos:', maxN);

// ── Rangos de Propio: libro vs PROPER_RANGES (vía getProperNumber), todos los días de un año no bisiesto ──
const BOOK = [ // [N, mesIni, diaIni, mesFin, diaFin]  líneas del libro entre paréntesis
  [1, 5, 8, 5, 14], [2, 5, 15, 5, 21], [3, 5, 22, 5, 28], [4, 5, 29, 6, 4], [5, 6, 5, 6, 11], [6, 6, 12, 6, 18],
  [7, 6, 19, 6, 25], [8, 6, 26, 7, 2], [9, 7, 3, 7, 9], [10, 7, 10, 7, 16], [11, 7, 17, 7, 23], [12, 7, 24, 7, 30],
  [13, 7, 31, 8, 6], [14, 8, 7, 8, 13], [15, 8, 14, 8, 20], [16, 8, 21, 8, 27], [17, 8, 28, 9, 3], [18, 9, 4, 9, 10],
  [19, 9, 11, 9, 17], [20, 9, 18, 9, 24], [21, 9, 25, 10, 1], [22, 10, 2, 10, 8], [23, 10, 9, 10, 15], [24, 10, 16, 10, 22],
  [25, 10, 23, 10, 29], [26, 10, 30, 11, 5], [27, 11, 6, 11, 12], [28, 11, 13, 11, 19], [29, 11, 20, 11, 26],
];
function bookProper(m, d) { const v = m * 100 + d; for (const [n, a, b, c, e] of BOOK) if (v >= a * 100 + b && v <= c * 100 + e) return n; return null; }
let diffRanges = [];
for (let m = 1; m <= 12; m++) for (let d = 1; d <= new Date(2023, m, 0).getDate(); d++) {
  const dt = new Date(2023, m - 1, d, 12);
  const a = Cal.getProperNumber(dt), b = bookProper(m, d);
  if (a !== b) diffRanges.push(`${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}: app ${a} vs libro ${b}`);
}
console.log('Días del año (no bisiesto) con Propio distinto de los rangos del libro:', diffRanges.length);
console.log(diffRanges.join('\n'));

// ── Ciclo A/B/C ──
console.log('\nCiclo A/B/C por Domingo I de Adviento (libro: A si el año es divisible entre 3; línea 20550-20552):');
for (let y = 2019; y <= 2035; y++) {
  const adv = Cal.getFeastDates(y).advent1;
  const before = new Date(y, adv.getMonth(), adv.getDate() - 1, 12);
  const book = ['A', 'B', 'C'][y % 3];
  const appAdv = Cal.getSundayCycle(new Date(y, adv.getMonth(), adv.getDate(), 12));
  const appBefore = Cal.getSundayCycle(before);
  console.log(`Adviento ${y} (${mdStr(adv)}): libro ${book} | app ${appAdv}${appAdv === book ? ' OK' : ' ** DIFIERE **'} | día previo (año ${y - 1}): app ${appBefore} libro ${['A', 'B', 'C'][(y - 1) % 3]}`);
}
// barrido completo de ciclo 2019-2060 día por día
let cycBad = 0, cycTot = 0;
for (let y = 2019; y <= 2060; y++) {
  const adv = Cal.getFeastDates(y).advent1;
  for (let d = new Date(y, 0, 1, 12); d.getFullYear() === y; d = new Date(y, d.getMonth(), d.getDate() + 1, 12)) {
    const liturgicalYear = d >= adv ? y : y - 1;
    const exp = ['A', 'B', 'C'][liturgicalYear % 3];
    cycTot++;
    if (Cal.getDay(d).cycle !== exp) cycBad++;
  }
}
console.log(`Barrido ciclo 2019-2060: ${cycTot} días, ${cycBad} discrepancias con la regla del libro`);
