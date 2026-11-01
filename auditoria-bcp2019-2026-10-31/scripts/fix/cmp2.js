const fs = require('fs'); const d = process.argv[2] + '/';
const A = JSON.parse(fs.readFileSync(d + 'after.json', 'utf8')), B = JSON.parse(fs.readFileSync(d + 'after2.json', 'utf8'));
const cat = r => r.lk === null ? 'sin lecturas' : (r.borrowed ? 'prestadas' : 'propias');
const cnt = rows => rows.reduce((m, r) => (m[cat(r)] = (m[cat(r)] || 0) + 1, m), {});
console.log('antes de este cambio:', JSON.stringify(cnt(A)));
console.log('después             :', JSON.stringify(cnt(B)));
const noEu = new Set(['goodFriday', 'holySaturday']);
console.log('días sin lecturas que NO son Viernes/Sábado Santo:', B.filter(r => r.lk === null && !noEu.has(r.key)).length);
// Semana de Pascua: ahora con lecturas propias
const ew = B.filter(r => /^easterFeria1_/.test(r.key));
console.log('Semana de Pascua (días):', ew.length, '| con lecturas propias:', ew.filter(r => !r.borrowed).length, '| ej.', ew.slice(0, 2).map(r => r.d + ' ' + r.key + '→' + r.lk).join(', '));
// claves de colecta: no debe haber cambiado nada respecto de la corrección anterior
let ck = 0; for (let i = 0; i < A.length; i++) if (A[i].ck !== B[i].ck || A[i].key !== B[i].key) ck++;
console.log('días cuya colecta o clave cambió con el leccionario:', ck);
