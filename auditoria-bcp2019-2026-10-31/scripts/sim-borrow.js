const C = require('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/harness.js').load();
const S = C.BCPLectionary.SUNDAY;
const prevSun = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); x.setDate(x.getDate() - x.getDay()); return x; };
function resolve(date) {
  const di = C.BCPCalendar.getDay(date);
  if (S[di.key]) return { di, key: di.key, borrowed: false };
  const p = C.BCPCalendar.getDay(prevSun(date));
  return S[p.key] ? { di, key: p.key, borrowed: true, cycle: p.cycle } : { di, key: null };
}
for (const [y, m, d] of [[2027, 2, 29], [2027, 2, 31], [2027, 3, 3], [2026, 11, 25], [2026, 11, 26], [2027, 0, 1], [2027, 0, 2], [2027, 0, 5], [2026, 11, 27], [2026, 11, 28]]) {
  const r = resolve(new Date(y, m, d, 12));
  console.log(`${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')} ${r.di.name} key=${r.di.key} cycle=${r.di.cycle} -> lect=${r.key}${r.borrowed ? ' (prestada, ciclo ' + r.cycle + ')' : ''}`);
}
// Domingo despues de Navidad 2026 y Epifanias 2027
for (let dt = new Date(2026, 11, 1, 12); dt <= new Date(2027, 2, 14, 12); dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + 1, 12)) {
  if (dt.getDay() === 0) { const di = C.BCPCalendar.getDay(dt); console.log(dt.toISOString().slice(0, 10), di.key, di.cycle); }
}
