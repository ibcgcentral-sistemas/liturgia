// Compara before.json y after.json: agrupa cada cambio por transición.
const fs = require('fs');
const dir = __dirname + '/';
const A = JSON.parse(fs.readFileSync(dir + 'before.json', 'utf8'));
const B = JSON.parse(fs.readFileSync(dir + 'after.json', 'utf8'));
if (A.length !== B.length) throw new Error('longitudes distintas');
const groups = new Map();
let changed = 0;
for (let i = 0; i < A.length; i++) {
  const a = A[i], b = B[i];
  if (a.d !== b.d) throw new Error('desalineado ' + a.d);
  const diffs = [];
  if (a.key !== b.key) diffs.push(`key ${a.key}→${b.key}`);
  if (a.name !== b.name) diffs.push(`name "${a.name}"→"${b.name}"`);
  if (a.rank !== b.rank) diffs.push(`rank ${a.rank}→${b.rank}`);
  if (a.ck !== b.ck) diffs.push(`colecta ${a.ck}→${b.ck}`);
  if (a.lk !== b.lk) diffs.push(`lecturas ${a.lk}→${b.lk}`);
  if (a.borrowed !== b.borrowed) diffs.push(`prestada ${a.borrowed}→${b.borrowed}`);
  if (!diffs.length) continue;
  changed++;
  // clase de la fila: familia de la clave previa (sin número) + resumen
  const fam = a.key.replace(/\d+/g, 'N');
  const sig = `${fam}: ${diffs.join(' | ')}`.replace(/(proper|lentFeria|easterFeria|properFeria)\d+/g, '$1N');
  if (!groups.has(sig)) groups.set(sig, []);
  groups.get(sig).push(a.d);
}
console.log('días que cambian:', changed, 'de', A.length);
const rows = [...groups.entries()].sort((x, y) => y[1].length - x[1].length);
for (const [sig, ds] of rows) console.log(String(ds.length).padStart(4), sig, '  ej:', ds.slice(0, 3).join(', '));
