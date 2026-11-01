// Auditoría calendario — ¿de dónde sale la cifra "165 supresiones" de CLAUDE.md? SOLO LECTURA.
const H = require('../harness.js');
const Cal = H.load().BCPCalendar;
const FF = Object.keys(Cal.FIXED_FEASTS);
function count(y0, y1, extra) {
  let n = 0;
  for (let y = y0; y <= y1; y++) for (const md of FF) { const [m, d] = md.split('-').map(Number); if (new Date(y, m - 1, d, 12).getDay() === 0) n++; }
  return n;
}
for (const [a, b] of [[2024, 2060], [2024, 2050], [2025, 2060], [2024, 2061], [2026, 2060], [2023, 2060]]) console.log(a, b, count(a, b));
// incluyendo 6-ene y 25-dic (principales) en domingo
let ex = 0; for (let y = 2024; y <= 2060; y++) { if (new Date(y, 0, 6, 12).getDay() === 0) ex++; if (new Date(y, 11, 25, 12).getDay() === 0) ex++; }
console.log('Epifanía+Navidad en domingo 2024-2060:', ex, '(no se suprimen: son principales)');
