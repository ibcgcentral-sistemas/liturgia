// Vuelca estructura de los 150 salmos de la BdJ cargada: nº de versículos hebreos y primeros versículos.
'use strict';
const L = require('./sim_lib');
const fs = require('fs');
const C = L.load();
const b = C.bible.getBook('Salmos');
const out = [];
out.push('chapters in book: ' + b.chapters.length);
for (let i = 0; i < b.chapters.length; i++) {
  const ch = b.chapters[i];
  const keys = Object.keys(ch.verses).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
  out.push(`Sal ${i + 1}: n=${keys.length} max=${keys[keys.length - 1]} chapterField=${ch.chapter}  v1="${(ch.verses['1'] || '').slice(0, 110)}"  v2="${(ch.verses['2'] || '').slice(0, 70)}"  v3="${(ch.verses['3'] || '').slice(0, 50)}"`);
}
fs.writeFileSync(__dirname + '/out/psalms-dump.txt', out.join('\n'));
console.log(out.length);
console.log(Object.keys(b));
