// Auditoría calendario — resumen de los 730 días de 2026-2027 (invariantes). SOLO LECTURA.
const fs = require('fs');
const rows = fs.readFileSync(__dirname + '/cal_2026_2027.tsv', 'utf8').split('\n').slice(1).map(l => l.split('\t'));
for (const y of ['2026', '2027']) {
  const R = rows.filter(r => r[0].startsWith(y));
  const cnt = (i) => R.reduce((a, r) => (a[r[i]] = (a[r[i]] || 0) + 1, a), {});
  console.log(`== ${y}: ${R.length} días`);
  console.log(' rangos:', JSON.stringify(cnt(6)));
  console.log(' temporadas:', JSON.stringify(cnt(7)));
  console.log(' colores:', JSON.stringify(cnt(5)));
  console.log(' ciclos:', JSON.stringify(cnt(8)));
  const dom = R.filter(r => r[1] === 'Dom');
  console.log(' domingos:', dom.length, '| rango distinto de sunday/principal:', dom.filter(r => !['sunday', 'principal'].includes(r[6])).length);
  console.log(' fiestas fijas mostradas (isFixed):', R.filter(r => r[9] === 'true').length, '| trasladadas:', R.filter(r => r[10] === 'true').map(r => r[0] + ' ' + r[2]).join(', ') || 'ninguna');
  console.log(' claves rotas/fallback:', R.filter(r => /null|undefined|NaN/.test(r[2]) || r[2] === 'feria').length);
  // cambios de ciclo
  let prev = null; const ch = [];
  R.forEach(r => { if (prev && prev !== r[8]) ch.push(`${r[0]} ${prev}->${r[8]} (${r[2]})`); prev = r[8]; });
  console.log(' cambios de ciclo:', ch.join(' | '));
}
