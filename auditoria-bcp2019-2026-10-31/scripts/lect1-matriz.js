// Matriz compacta por dia/ciclo + ranking de gravedad a partir de lect1-diff-resultado.json
const fs = require('fs'), path = require('path');
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'lect1-diff-resultado.json'), 'utf8'));
const code = s => ({ IGUAL: 'I', EQUIVALENTE: 'E', PARCIAL: 'P', DIFERENTE: 'D', 'FALTA EN APP': 'F', 'FALTA EN LIBRO': 'L', 'AMBOS-VACIOS': '-' }[s]);
const keys = [...new Set(R.rows.map(r => r.appKey))];
let md = '| clave app | A (1ª·sal·2ª·ev) | B | C | alta | media | baja |\n|---|---|---|---|---|---|---|\n';
const rank = [];
for (const k of keys) {
  const cell = {};
  let alta = 0, media = 0, baja = 0;
  for (const cy of ['A', 'B', 'C']) {
    cell[cy] = ['first', 'psalm', 'second', 'gospel'].map(f => { const r = R.rows.find(x => x.appKey === k && x.cycle === cy && x.field === f); if (r.severidad === 'alta') alta++; else if (r.severidad === 'media') media++; else if (r.severidad === 'baja') baja++; return code(r.status); }).join('');
  }
  md += `| ${k} | ${cell.A} | ${cell.B} | ${cell.C} | ${alta} | ${media} | ${baja} |\n`;
  rank.push({ k, alta, media, baja, cell });
}
fs.writeFileSync(path.join(__dirname, 'lect1-matriz.md'), md, 'utf8');
console.log(md);
console.log('ranking por altas (dia): ', rank.sort((a, b) => b.alta - a.alta || b.media - a.media).slice(0, 14).map(r => `${r.k}:${r.alta}/${r.media}`).join('  '));
// dias con TODOS los campos IGUAL/EQUIV en los 3 ciclos
console.log('dias sin ninguna diferencia (todo I/E en A,B,C):', rank.filter(r => ['A', 'B', 'C'].every(c => /^[IE]{4}$/.test(r.cell[c]))).map(r => r.k).join(', '));
console.log('dias con las 4 lecturas I/E en al menos un ciclo:', rank.filter(r => ['A', 'B', 'C'].some(c => /^[IE]{4}$/.test(r.cell[c]))).map(r => r.k + '(' + ['A', 'B', 'C'].filter(c => /^[IE]{4}$/.test(r.cell[c])).join('') + ')').join(', '));
