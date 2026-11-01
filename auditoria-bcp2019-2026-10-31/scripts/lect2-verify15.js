// lect2-verify15.js — Verificación «a mano» de 15 diferencias: para cada una se imprime la evidencia literal
// de las tres extracciones (markdown, pdftotext -layout, pdftotext -raw) y se decide si es artefacto.
const fs = require('fs');
const path = require('path');
const rows = require('./lect2-diff.json');
const parsed = require('./lect2-rawparse-result.json');
const MD = fs.readFileSync('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md', 'utf8').split(/\r?\n/);
const LAY = fs.readFileSync(path.join(__dirname, '_pdf-700-760.txt'), 'utf8').split('\n');
const FIELDS = ['first', 'psalm', 'second', 'gospel'];
const MD2KEY = { '11-01': 'November 1', '04-25': 'April 25', '12-26': 'December 26' };

const PICK = [
  ['proper26', 'A', 'first'], ['proper26', 'A', 'psalm'], ['proper26', 'A', 'second'],
  ['proper7', 'B', 'first'], ['proper7', 'C', 'gospel'], ['proper12', 'B', 'gospel'], ['proper28', 'B', 'gospel'],
  ['proper19', 'A', 'first'], ['proper29', 'A', 'second'], ['proper29', 'C', 'psalm'], ['proper18', 'C', 'second'],
  ['11-01', 'all', 'second'], ['11-01', 'all', 'psalm'], ['04-25', 'all', 'gospel'], ['12-26', 'all', 'first'],
];
const flat = s => s.replace(/[|\s]/g, '').replace(/[—–]|--/g, '-').toLowerCase();
const out = [];
let n = 0, okAll = 0;
for (const [key, cyc, fld] of PICK) {
  n++;
  const r = rows.find(x => x.key === key && x.cycle === cyc && x.field === fld);
  // evidencia 1: markdown
  const parts = r.book.split(/\s+or\s+/);
  const probe = flat(parts[0]);
  const mdHits = [];
  for (let i = Math.max(0, (r.mdLine || 21070) - 4); i < Math.min(MD.length, (r.mdLine || 21070) + 6); i++) if (flat(MD[i]).includes(probe.slice(0, Math.min(probe.length, 10)))) mdHits.push(`L${i + 1}: ${MD[i].replace(/\s+/g, ' ').trim()}`);
  // evidencia 2: pdftotext -layout
  const layHits = LAY.filter(l => flat(l).includes(probe.slice(0, Math.min(probe.length, 10)))).slice(0, 2).map(l => l.replace(/\s{2,}/g, ' | ').trim());
  // evidencia 3: flujo raw (celda)
  let rawCell = null;
  if (key.startsWith('proper')) rawCell = parsed.propers[key][cyc][FIELDS.indexOf(fld)];
  else rawCell = parsed.feasts[MD2KEY[key]].r[FIELDS.indexOf(fld)];
  const agree = flat(rawCell) === flat(r.book);
  if (agree) okAll++;
  out.push({ n, key, cyc, fld, app: r.app, book: r.book, mdLine: r.mdLine, mdHits, layHits, rawCell, agree, cls: r.cls, sev: r.sev });
}
fs.writeFileSync(path.join(__dirname, 'lect2-verify15.json'), JSON.stringify(out, null, 1));
for (const o of out) {
  console.log(`#${o.n} ${o.key} ${o.cyc} ${o.fld} [${o.cls}/${o.sev}]  app=«${o.app}»  libro=«${o.book}»`);
  console.log('   md     :', o.mdHits.join('  ||  ') || '(sin eco directo: celda fragmentada)');
  console.log('   layout :', o.layHits.join('  ||  '));
  console.log('   raw    : «' + o.rawCell + '»  ->', o.agree ? 'COINCIDE con la verdad' : '*** NO COINCIDE ***');
}
console.log(`\nVerificadas: ${n}; la celda del flujo raw del PDF coincide con la «verdad»: ${okAll}/${n}`);
