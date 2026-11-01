// Auditoría calendario — años/días de F4 (29-31 dic antes del 1.er domingo de Navidad) y años con Propio 1/2 semanales. SOLO LECTURA.
const H = require('../harness.js');
const Cal = H.load().BCPCalendar;
const pad = n => String(n).padStart(2, '0');
const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
function prevSun(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay(), 12); }
const ys = {};
for (let y = 2024; y <= 2060; y++) for (let day = 29; day <= 31; day++) {
  const d = new Date(y, 11, day, 12); if (d.getDay() === 0) continue;
  if (Cal.getDay(d).isFixed) continue;
  const p = Cal.getDay(prevSun(d));
  if (p.key === 'advent4') (ys[y] = ys[y] || []).push(`${pad(day)}-dic(${DOW[d.getDay()]})`);
}
console.log('Días 29-31 dic cuya colecta/lecturas salen de Adviento IV (el libro: Día de Navidad):', Object.values(ys).flat().length);
console.log(Object.entries(ys).map(([y, v]) => `${y}: ${v.join(',')}`).join(' | '));
// Semanas que necesitarían Propio 1/2 (Pentecostés o Trinidad con domingo 8-21 may)
const p12 = [];
for (let y = 2024; y <= 2060; y++) {
  const F = Cal.getFeastDates(y);
  const a = Cal.getProperNumber(F.pentecost), b = Cal.getProperNumber(F.trinitySunday);
  if (a <= 2) p12.push(`${y}: semana de Pentecostés -> Propio ${a} (${pad(F.pentecost.getDate())}-may)`);
  if (b <= 2) p12.push(`${y}: semana de Trinidad -> Propio ${b} (${pad(F.trinitySunday.getDate())}-may)`);
}
console.log('Semanas de Pentecostés/Trinidad que requieren Propio 1 o 2 (inexistentes en COLLECTS y SUNDAY), 2024-2060:', p12.length);
console.log(p12.join('\n'));
