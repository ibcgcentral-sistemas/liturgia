// Conclusiones doxologicas: claves cuyo texto en el app NO contiene "reina/reinas/reinar" (formula corta)
const { COL } = require('./colectas-sim.js');
const { CLS } = require('./colectas-sim3.js');
const short = [], longc = [];
for (const [k, t] of Object.entries(COL)) {
  if (/reina|reinas|reinar|reinamos/i.test(t)) longc.push(k); else short.push(k);
}
console.log('total', Object.keys(COL).length, 'con formula larga', longc.length, 'sin ella', short.length);
console.log('sin formula larga y clase C/V:', short.filter(k => CLS[k] !== 'D').join(', '));
console.log('sin formula larga y clase D:', short.filter(k => CLS[k] === 'D').join(', '));
// colectas duplicadas (mismo texto normalizado) dentro de COLLECTS
const norm = s => s.toLowerCase().replace(/[^a-záéíóúñ ]/g, '').replace(/\s+/g, ' ').slice(0, 90);
const seen = {};
for (const [k, t] of Object.entries(COL)) { const n = norm(t); (seen[n] = seen[n] || []).push(k); }
console.log('textos con inicio identico (90 car.):', Object.values(seen).filter(v => v.length > 1));
