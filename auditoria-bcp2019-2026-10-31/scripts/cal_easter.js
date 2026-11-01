// Auditoría calendario — Pascua: computeEaster vs (a) Tablas del libro pp. 713-715 y (b) algoritmo independiente. SOLO LECTURA.
const fs = require('fs');
const H = require('../harness.js');
const Cal = H.load().BCPCalendar;
const MD = 'C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md';
const lines = fs.readFileSync(MD, 'utf8').split(/\r?\n/);
const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

// ── (a) tabla del libro: líneas 20443-20477 (1-indexed) ──
const table = new Map();
for (let i = 20443 - 1; i <= 20477 - 1; i++) {
  const re = /(\d{4})\s*\|?\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2})/g;
  let m;
  while ((m = re.exec(lines[i]))) table.set(+m[1], { m: MON[m[2]], d: +m[3] });
}
console.log('Años en la tabla del libro (líneas 20443-20477):', table.size, 'rango', Math.min(...table.keys()), '-', Math.max(...table.keys()));
const missing = [];
for (let y = 2001; y <= 2120; y++) if (!table.has(y)) missing.push(y);
console.log('Años 2001-2120 no extraídos:', missing.length ? missing.join(',') : 'ninguno');

// ── (b) algoritmo independiente: Oudin (1940), distinto de Meeus/Jones/Butcher ──
function oudin(Y) {
  const C = Math.floor(Y / 100);
  const N = Y - 19 * Math.floor(Y / 19);
  const K = Math.floor((C - 17) / 25);
  let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I = I - 30 * Math.floor(I / 30);
  I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
  let J = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
  J = J - 7 * Math.floor(J / 7);
  const L = I - J;
  const M = 3 + Math.floor((L + 40) / 44);
  const D = L + 28 - 31 * Math.floor(M / 4);
  return { m: M - 1, d: D };
}
// Tercer método independiente: Gauss con excepciones (válido 1900-2099), solo para contraste adicional.
function gauss(Y) {
  const a = Y % 19, b = Y % 4, c = Y % 7;
  const k = Math.floor(Y / 100), p = Math.floor((13 + 8 * k) / 25), q = Math.floor(k / 4);
  const M = (15 - p + k - q) % 30, N = (4 + k - q) % 7;
  const d = (19 * a + M) % 30, e = (2 * b + 4 * c + 6 * d + N) % 7;
  let day = 22 + d + e, month = 2; // marzo
  if (day > 31) { day -= 31; month = 3; }
  if (month === 3 + 0 && false) {}
  // excepciones de Gauss
  if (month === 3 && day === 26 + 0 && false) {}
  if (month === 3 && day > 31) {}
  // 26 abril -> 19 abril ; 25 abril con d=28,e=6,a>10 -> 18 abril
  if (month === 3 && day === 26) day = 19;
  if (month === 3 && day === 25 && d === 28 && e === 6 && a > 10) day = 18;
  return { m: month, d: day };
}

let bad = 0, badBook = 0, badGauss = 0, tot = 0;
const diffs = [];
for (let y = 1900; y <= 2200; y++) {
  const mine = oudin(y);
  const app = Cal.computeEaster(y);
  tot++;
  if (app.getMonth() !== mine.m || app.getDate() !== mine.d) { bad++; diffs.push(`${y}: app ${app.getMonth() + 1}/${app.getDate()} vs Oudin ${mine.m + 1}/${mine.d}`); }
  if (app.getDay() !== 0) diffs.push(`${y}: app Pascua no cae en domingo`);
  if (y <= 2099) { const g = gauss(y); if (app.getMonth() !== g.m || app.getDate() !== g.d) badGauss++; }
}
console.log(`computeEaster vs Oudin, 1900-2200: ${tot} años, ${bad} discrepancias`);
console.log(`computeEaster vs Gauss, 1900-2099: ${badGauss} discrepancias`);
let tb = 0;
for (const [y, v] of table) {
  tb++;
  const app = Cal.computeEaster(y);
  if (app.getMonth() !== v.m || app.getDate() !== v.d) { badBook++; diffs.push(`${y}: app ${app.getMonth() + 1}/${app.getDate()} vs LIBRO ${v.m + 1}/${v.d}`); }
}
console.log(`computeEaster vs tabla del libro: ${tb} años cotejados, ${badBook} discrepancias`);
// 2024-2060 explícito
let b2 = 0;
for (let y = 2024; y <= 2060; y++) { const a = Cal.computeEaster(y), o = oudin(y), t = table.get(y); if (a.getMonth() !== o.m || a.getDate() !== o.d || (t && (a.getMonth() !== t.m || a.getDate() !== t.d))) b2++; }
console.log('2024-2060: años con discrepancia (Oudin o libro):', b2, 'de', 2060 - 2024 + 1);
console.log(diffs.slice(0, 30).join('\n'));
// Rango Pascua
let min = null, max = null;
for (let y = 1900; y <= 2200; y++) { const e = Cal.computeEaster(y); const k = e.getMonth() * 100 + e.getDate(); if (min === null || k < min) min = k; if (max === null || k > max) max = k; }
console.log('Rango Pascua 1900-2200 (mmdd):', min, max, '(libro: 22 mar - 25 abr)');
