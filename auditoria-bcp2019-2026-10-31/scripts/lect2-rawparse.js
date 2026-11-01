// lect2-rawparse.js — Reconstrucción AUTOMÁTICA e independiente de la «verdad» a partir de
// `pdftotext -raw` (orden del flujo de contenido del PDF: celda por celda, sin depender de la
// posición x), y comparación contra la transcripción manual lect2-verdad.json.
// Entrada: _pdf-raw-733-741.txt (PDF 733-741 = libro 725-733).
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const raw = fs.readFileSync(path.join(dir, '_pdf-raw-733-741.txt'), 'utf8').replace(/\r/g, '');
const pages = raw.split('\f');
const V = JSON.parse(fs.readFileSync(path.join(dir, 'lect2-verdad.json'), 'utf8'));

const MONTHS = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}$/;
const FOOT = /^(V Psalm verse numbers|day year a year b year c|holy days$|\d{3} c al|sunday, holy day, and commemoration lectionary|ember, rogation)/;

function isCont(prev, line) {
  return /^\s/.test(line) || /[,\-]$/.test(prev) || /\sor$/.test(prev) || /^or\s/.test(line);
}
// toma 4 lecturas (con sus continuaciones) a partir de lines[i]
function take4(lines, i) {
  const out = [];
  while (out.length < 4 && i < lines.length) {
    let cur = lines[i++];
    while (i < lines.length && isCont(cur, lines[i]) && !FOOT.test(lines[i].trim())) cur += ' ' + lines[i++].trim();
    out.push(cur.trim());
  }
  return { out, i };
}
const flat = s => s.replace(/--/g, '—').replace(/\s+/g, '').toLowerCase();

// ── Propios (págs. PDF 733-737) ──
const parsed = { propers: {}, feasts: {} };
for (const pi of [0, 1, 2, 3, 4]) {
  const lines = pages[pi].split('\n').filter(l => l.length && !FOOT.test(l.trim()));
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^proper (\d+)$/);
    if (!m) continue;
    let j = i + 1;
    // saltar rótulo: hasta que una línea sea «Month d» (último renglón del rótulo) o «Christ the King»
    while (j < lines.length && !/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}$/.test(lines[j].trim())) j++;
    j++; // después de la fecha final del rango
    if (lines[j] && /^Christ the King$/.test(lines[j].trim())) j++;
    const r = take4(lines, j);
    const b = take4(lines, r.i);
    const c = take4(lines, b.i);
    parsed.propers['proper' + m[1]] = { A: r.out, B: b.out, C: c.out };
  }
}
// ── Fiestas (págs. PDF 738-739) ──
for (const pi of [5, 6]) {
  const lines = pages[pi].split('\n').filter(l => l.length && !FOOT.test(l.trim()));
  const label = [];
  for (let i = 0; i < lines.length; i++) {
    if (MONTHS.test(lines[i].trim())) {
      const r = take4(lines, i + 1);
      parsed.feasts[lines[i].trim()] = { label: label.join(' '), r: r.out };
      label.length = 0; i = r.i - 1;
    } else label.push(lines[i].trim());
  }
}
// ── Comparación ──
const F = ['first', 'psalm', 'second', 'gospel'];
let pOK = 0, pBad = [];
for (const [k, o] of Object.entries(V.propers)) {
  const p = parsed.propers[k];
  if (!p) { pBad.push(`${k}: no parseado`); continue; }
  for (const c of ['A', 'B', 'C']) F.forEach((f, ix) => {
    const a = flat(o[c][f]), b = flat(p[c][ix] || '');
    a === b ? pOK++ : pBad.push(`${k} ${c} ${f}: manual=«${o[c][f]}» raw=«${p[c][ix]}»`);
  });
}
const MD2KEY = { 'November 30': '11-30', 'December 21': '12-21', 'December 26': '12-26', 'December 27': '12-27', 'December 28': '12-28', 'January 1': '01-01', 'January 18': '01-18', 'January 25': '01-25', 'February 2': '02-02', 'February 24': '02-24', 'March 19': '03-19', 'March 25': '03-25', 'April 25': '04-25', 'May 1': '05-01', 'May 31': '05-31', 'June 11': '06-11', 'June 24': '06-24', 'June 29': '06-29', 'July 22': '07-22', 'July 25': '07-25', 'August 6': '08-06', 'August 15': '08-15', 'August 24': '08-24', 'September 14': '09-14', 'September 21': '09-21', 'September 29': '09-29', 'October 18': '10-18', 'October 23': '10-23', 'October 28': '10-28', 'November 1': '11-01' };
let fOK = 0, fBad = [], seen = new Set();
for (const [dt, p] of Object.entries(parsed.feasts)) {
  const key = MD2KEY[dt];
  if (!key) { fBad.push(`fecha no mapeada: ${dt}`); continue; }
  seen.add(key);
  F.forEach((f, ix) => {
    const a = flat(V.feasts[key][f]), b = flat(p.r[ix] || '');
    a === b ? fOK++ : fBad.push(`${key} ${f}: manual=«${V.feasts[key][f]}» raw=«${p.r[ix]}»`);
  });
}
const missing = Object.keys(V.feasts).filter(k => !seen.has(k));
console.log('Propios parseados del flujo raw:', Object.keys(parsed.propers).length, '(esperados 29)');
console.log('Propios — campos idénticos manual vs raw:', pOK, 'de', 29 * 12, '| discrepancias:', pBad.length);
pBad.forEach(x => console.log('  ✗', x));
console.log('Fiestas parseadas del flujo raw:', Object.keys(parsed.feasts).length, '(esperadas 30)');
console.log('Fiestas — campos idénticos manual vs raw:', fOK, 'de', 30 * 4, '| discrepancias:', fBad.length);
fBad.forEach(x => console.log('  ✗', x));
console.log('Fiestas de la verdad no halladas en raw:', missing.join(', ') || '(ninguna)');
// Todos los Santos (bloque de la pág. 728, tres columnas idénticas): comprobar que coincide con la fiesta 11-01
const p728 = pages[3].split('\n');
const iAS = p728.findIndex(l => /^all saints' day$/.test(l.trim()));
console.log('Bloque «All Saints» pág. 728 en flujo raw, línea', iAS);
fs.writeFileSync(path.join(dir, 'lect2-rawparse-result.json'), JSON.stringify(parsed, null, 1));
