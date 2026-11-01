// Auditoría calendario — colisiones y "intocables" 2001-2120. SOLO LECTURA.
const H = require('../harness.js');
const Cal = H.load().BCPCalendar;
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addD = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);
const FF = Cal.FIXED_FEASTS;

let leaked = [], ashColl = [], princColl = [], doubleBooked = 0, total = 0;
for (let y = 2001; y <= 2120; y++) {
  const F = Cal.getFeastDates(y);
  // 1. ninguna fiesta fija "activa" (isFixed) en Domingo de Ramos..Sábado Santo ni Pascua..Sábado de Pascua (salvo traslado)
  for (let d = F.palmSunday; d <= addD(F.easter, 6); d = addD(d, 1)) {
    const r = Cal.getDay(d);
    if (r.isFixed) leaked.push(`${iso(d)} ${r.key}`);
  }
  // 2. choques con Miércoles de Ceniza / fiestas principales móviles / Jueves-Viernes-Sábado santos
  for (const md of Object.keys(FF)) {
    const [mm, dd] = md.split('-').map(Number);
    const d = new Date(y, mm - 1, dd, 12); total++;
    const r = Cal.getDay(d);
    if (r.key === 'ashWednesday') ashColl.push(`${iso(d)} ${md}`);
    if (['ascension', 'pentecost', 'trinitySunday', 'easter', 'palmSunday'].includes(r.key)) princColl.push(`${iso(d)} ${md} -> ${r.key}`);
  }
}
console.log('Fiestas fijas "activas" dentro de Domingo de Ramos..Sábado de Pascua (esperado 0 salvo trasladadas, que no están ahí):', leaked.length, leaked.slice(0, 5).join(' | '));
console.log('Fiestas fijas que coinciden con Miércoles de Ceniza 2001-2120 (se pierden sin traslado):', ashColl.length, ashColl.join(' | '));
const byDay = {};
princColl.forEach(s => { const k = s.split('-> ')[1]; byDay[k] = (byDay[k] || 0) + 1; });
console.log('Fiestas fijas que coinciden con Ascensión/Pentecostés/Trinidad/Pascua/Ramos 2001-2120:', princColl.length, JSON.stringify(byDay));
console.log(princColl.filter(s => /ascension/.test(s)).join(' | '));
// Fiesta en Jueves/Viernes/Sábado santos ya contados como traslado; los 2024-2060 los lista cal_sim.js [D]
console.log('Total apariciones fiestas fijas 2001-2120:', total);
