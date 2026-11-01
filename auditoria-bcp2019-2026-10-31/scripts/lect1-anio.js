// Exposicion concreta: año litúrgico 2026-27 (Ciclo B; Adviento 1 = 2026-11-29) hasta Trinidad 2027.
// Para cada fecha cuya clave del calendario esté en el alcance (domingos y días propios), muestra los 4 estados.
const fs = require('fs'), path = require('path');
const C = require('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/harness.js').load();
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'lect1-diff-resultado.json'), 'utf8'));
const code = s => ({ IGUAL: 'I', EQUIVALENTE: 'E', PARCIAL: 'P', DIFERENTE: 'D', 'FALTA EN APP': 'F' }[s]);
const keys = new Set(R.rows.map(r => r.appKey));
let md = '| fecha | día (calendar.js) | clave | ciclo | 1ª·sal·2ª·ev |\n|---|---|---|---|---|\n';
let n = 0, nAlta = 0, nEv = 0, nPrim = 0;
for (let d = new Date(2026, 10, 29, 12); d <= new Date(2027, 4, 23, 12); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)) {
  const di = C.BCPCalendar.getDay(d);
  if (!keys.has(di.key)) continue;
  const rows = ['first', 'psalm', 'second', 'gospel'].map(f => R.rows.find(r => r.appKey === di.key && r.cycle === di.cycle && r.field === f));
  const c = rows.map(r => code(r.status)).join('');
  n++;
  if (rows.some(r => r.severidad === 'alta')) nAlta++;
  if (['D', 'P', 'F'].includes(c[3])) nEv++;
  if (['D', 'P', 'F'].includes(c[0])) nPrim++;
  md += `| ${d.toISOString().slice(0, 10)} | ${di.name} | ${di.key} | ${di.cycle} | ${c} |\n`;
}
md += `\nFechas con clave en el alcance: ${n}; con al menos una diferencia ALTA (1ª lectura o evangelio DIFERENTE/FALTA): ${nAlta}; con evangelio DIFERENTE/PARCIAL: ${nEv}; con 1ª lectura DIFERENTE/PARCIAL: ${nPrim}.\n`;
fs.writeFileSync(path.join(__dirname, 'lect1-anio-2026-27.md'), md, 'utf8');
console.log(md);
