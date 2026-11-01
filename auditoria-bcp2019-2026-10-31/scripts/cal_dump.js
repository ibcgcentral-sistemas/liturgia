// Auditoría calendario — vuelca getDay() de 2026 y 2027 completos a TSV. SOLO LECTURA.
const fs = require('fs');
const H = require('../harness.js');
const C = H.load();
const Cal = C.BCPCalendar;
const OUT = __dirname + '/cal_2026_2027.tsv';
const rows = ['fecha\tdow\tclave\tnombre_en\tnombre_es\tcolor\trango\ttemporada\tciclo\tisFixed\tisTransferred'];
const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
let n = 0;
for (const y of [2026, 2027]) {
  for (let m = 0; m < 12; m++) {
    const dim = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= dim; d++) {
      const dt = new Date(y, m, d, 12);
      const r = Cal.getDay(dt);
      const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      rows.push([iso, DOW[dt.getDay()], r.key, r.name, r.nameEs, r.color, r.rank, r.season, r.cycle, !!r.isFixed, !!r.isTransferred].join('\t'));
      n++;
    }
  }
}
fs.writeFileSync(OUT, rows.join('\n'), 'utf8');
console.log('días volcados:', n, '->', OUT);
