// lect2-rowcheck.js — Confirma la asignación de columnas (A/B/C) y de campo de la «verdad» contra FILAS
// de tabla del markdown (líneas que empiezan con «|»). Lo que no se pueda confirmar por fila queda listado
// para revisión manual contra el PDF.
const fs = require('fs');
const path = require('path');
const V = JSON.parse(fs.readFileSync(path.join(__dirname, 'lect2-verdad.json'), 'utf8'));
const md = fs.readFileSync('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md', 'utf8').split(/\r?\n/);
const norm = s => s.replace(/[—–]/g, '-').replace(/\s+/g, '').toLowerCase();
const rows = [];
for (let i = 21068; i < 21490; i++) {
  const ln = md[i];
  if (!ln.startsWith('|') || /^\|\s*-/.test(ln)) continue;
  const cells = ln.split('|').slice(1, -1).map(c => norm(c.trim()));
  rows.push({ line: i + 1, cells });
}
const F = ['first', 'psalm', 'second', 'gospel'];
const alt = s => s.split(/\s+or\s+/).map(norm);
// una celda «coincide» si contiene (o es parte de) la referencia, para tolerar «or» partidos en 2 filas
const cellMatches = (cell, ref) => { const r = norm(ref); if (!r) return cell === ''; return cell === r || cell.includes(r) || alt(ref).some(a => a && cell.includes(a)); };
let confirmed = 0, unconfirmed = [];
for (const [k, o] of Object.entries(V.propers)) {
  for (const f of F) {
    // filas que contienen A, B y C en celdas consecutivas (con o sin celda de rótulo antes)
    const found = rows.find(r => {
      for (let s = 0; s + 2 < r.cells.length; s++) {
        if (cellMatches(r.cells[s], o.A[f]) && cellMatches(r.cells[s + 1], o.B[f]) && cellMatches(r.cells[s + 2], o.C[f])) return true;
      }
      return false;
    });
    if (found) confirmed++; else unconfirmed.push(`${k} ${f}`);
  }
}
// fiestas: celda de lectura en fila (col 1 o 3, dos columnas por página); confirmamos sólo que la ref aparece en alguna celda
let fConfirmed = 0, fUnconf = [];
for (const [k, o] of Object.entries(V.feasts)) for (const f of F) {
  const alts = alt(o[f]);
  const ok = rows.some(r => r.cells.some(c => alts.every(a => c.includes(a)) || alts.some(a => c === a)));
  ok ? fConfirmed++ : fUnconf.push(`${k} ${f}`);
}
console.log('Propios: filas (día×campo) confirmadas por fila de tabla del markdown:', confirmed, 'de', Object.keys(V.propers).length * 4);
console.log('No confirmables por fila:', unconfirmed.length, '\n ', unconfirmed.join(', '));
console.log('Fiestas: referencia hallada en alguna celda de fila:', fConfirmed, 'de', Object.keys(V.feasts).length * 4, '(el markdown fragmenta las 2 columnas de la página; las no halladas están fuera de fila)');
console.log('  no halladas:', fUnconf.join(', '));
