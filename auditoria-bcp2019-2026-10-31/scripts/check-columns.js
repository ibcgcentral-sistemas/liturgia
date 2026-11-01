// Verificacion independiente de la ASIGNACION DE COLUMNA (ciclo) y del ORDEN de la verdad: cada valor de
// lect1-verdad.json debe aparecer, en orden, en la columna A/B/C correspondiente del volcado de coordenadas del PDF
// (pdf-cols.txt, generado por pdfcols.py a partir de las paginas PDF 725-733 = libro pp. 717-725).
const fs = require('fs'), path = require('path');
const dump = fs.readFileSync(path.join(__dirname, 'pdf-cols.txt'), 'utf8').split(/\r?\n/);
const truth = JSON.parse(fs.readFileSync(path.join(__dirname, 'lect1-verdad.json'), 'utf8'));
const norm = s => String(s).toLowerCase().replace(/[—–]/g, '-').replace(/\./g, '').replace(/\s+/g, '').replace(/([\d)])v/g, '$1');
const cols = { A: '', B: '', C: '' };
let page = 0, col = null;
for (const l of dump) {
  let m = /^=== PDF p\.(\d+)/.exec(l); if (m) { page = +m[1]; col = null; continue; }
  m = /^-- col (\w)/.exec(l); if (m) { col = m[1]; continue; }
  m = /^\s+y=\s*\d+ x=\s*[\d.]+ (.*?)(  \[ITALIC\])?$/.exec(l);
  if (!m || !col || !Object.prototype.hasOwnProperty.call(cols, col)) continue;
  const t = m[1].trim();
  if (/^(v|v v)$/.test(t)) continue;
  cols[col] += norm(t);
}
let ok = 0; const bad = [];
for (const cy of ['A', 'B', 'C']) {
  let pos = 0;
  for (const [k, d] of Object.entries(truth.days)) {
    if (k === 'easterVigil') continue;
    // en la Liturgia de las Palmas el libro imprime primero el evangelio y despues el salmo
    for (const f of (k === 'palmSundayPalms' ? ['gospel', 'psalm'] : ['first', 'psalm', 'second', 'gospel'])) {
      const raw = d[cy][f]; if (raw === null) continue;
      const n = norm(raw);
      let i = cols[cy].indexOf(n, pos);
      if (i < 0) i = cols[cy].indexOf(n.replace(/[()]/g, ''), pos);
      if (i < 0) bad.push(`${k}.${cy}.${f}: ${raw}`); else { ok++; pos = i + 1; }
    }
  }
}
console.log('valores localizados en orden en su columna del PDF:', ok, ' no localizados:', bad.length);
bad.forEach(b => console.log('  ', b));
