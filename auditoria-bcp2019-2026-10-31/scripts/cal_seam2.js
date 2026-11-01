// Auditoría calendario — Semana Santa / Semana de Pascua / Nochebuena: qué colecta y lecturas se resuelven. SOLO LECTURA.
const H = require('../harness.js');
const C = H.load();
const Cal = C.BCPCalendar, Lect = C.BCPLectionary, Prop = C.BCPPropers;
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addD = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);
function getPreviousSunday(date) { const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12); d.setDate(d.getDate() - d.getDay()); return d; }
function lk(r, date) { if (Lect.SUNDAY[r.key]) return r.key; if (r.key.startsWith('holyWeekFeria')) return null; const p = Cal.getDay(getPreviousSunday(date)); return Lect.SUNDAY[p.key] ? p.key : null; }
function ck(r, date) { if (Prop.COLLECTS[r.key]) return r.key; const p = Cal.getDay(getPreviousSunday(date)); return Prop.COLLECTS[p.key] ? p.key : r.key; }

let ew = 0, ewL = {}, ewC = {}, hw = 0, hwC = {}, hwL = {};
for (let y = 2024; y <= 2060; y++) {
  const F = Cal.getFeastDates(y);
  for (let i = 1; i <= 6; i++) { const d = addD(F.easter, i); const r = Cal.getDay(d); ew++; const l = lk(r, d), c = ck(r, d); ewL[l] = (ewL[l] || 0) + 1; ewC[c] = (ewC[c] || 0) + 1; }
  for (let i = 1; i <= 3; i++) { const d = addD(F.palmSunday, i); const r = Cal.getDay(d); hw++; const l = lk(r, d), c = ck(r, d); hwL[l] = (hwL[l] || 0) + 1; hwC[c] = (hwC[c] || 0) + 1; }
}
console.log(`Semana de Pascua (Lun-Sáb) 2024-2060: ${ew} días; lecturas resueltas:`, JSON.stringify(ewL), '; colecta resuelta:', JSON.stringify(ewC));
console.log(`Semana Santa (Lun-Mié) 2024-2060: ${hw} días; lecturas:`, JSON.stringify(hwL), '; colecta:', JSON.stringify(hwC));
// Nochebuena
const eve = {}; let n = 0;
for (let y = 2024; y <= 2060; y++) { const d = new Date(y, 11, 24, 12); const r = Cal.getDay(d); n++; const k = r.key.replace(/_\d$/, '').replace(/\d/, 'N'); eve[k] = (eve[k] || 0) + 1; }
console.log('24-dic 2024-2060 (37 años) claves:', JSON.stringify(eve), '| ejemplo 2026-12-24:', JSON.stringify(Cal.getDay(new Date(2026, 11, 24, 12))));
// Sábado Santo / Vigilia
console.log('Sábado Santo 2026:', JSON.stringify(Cal.getDay(new Date(2026, 3, 4, 12))), '| colecta existe:', !!Prop.COLLECTS.holySaturday, '| lecciones existen:', !!Lect.SUNDAY.holySaturday);
// ¿llaves de lecciones de los 3 días de Semana Santa traen contenido?
console.log('holyWeekFeria_1 lecciones:', JSON.stringify(Lect.SUNDAY.holyWeekFeria_1).slice(0, 220));
