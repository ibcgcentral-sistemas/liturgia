// sim_keys.js — Consistencia entre calendar.js, lectionary.js y propers.js (claves emitidas vs. tablas)
// + lecturas/colectas prestadas con temporada distinta + sobre-escritura de fiestas fijas.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./sim_lib');
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'sweep.json'), 'utf8'));
const C = L.load({ bible: false });
const out = []; const P = (...a) => out.push(a.join(' '));
const cnt = (arr, f) => { const m = {}; for (const x of arr) { const k = f(x); m[k] = (m[k] || 0) + 1; } return m; };

const emitted = {};
for (const r of R) { const e = emitted[r.key] = emitted[r.key] || { n: 0, ranks: new Set(), seasons: new Set(), ex: r.d }; e.n++; e.ranks.add(r.rank); e.seasons.add(r.season); }
const SUN = C.BCPLectionary.SUNDAY, COL = C.BCPPropers.COLLECTS, PREF = C.BCPPropers.PREFACES;
P(`Claves distintas emitidas por getDay (2024-2060): ${Object.keys(emitted).length}`);

// 1) emitidas sin lectura propia
const noRead = Object.keys(emitted).filter(k => !SUN[k]);
P(`\n## Claves emitidas SIN entrada en BCPLectionary.SUNDAY: ${noRead.length}`);
const isFeria = k => /Feria/.test(k) || k === 'feria';
P('  de tipo feria (toman lecturas del domingo precedente, esperado): ' + noRead.filter(isFeria).length);
const nf = noRead.filter(k => !isFeria(k));
P('  NO feria (debieran tener lectura propia): ' + nf.length + ' -> ' + nf.map(k => `${k}(${emitted[k].n}d, ${[...emitted[k].ranks]})`).join(', '));

// 2) emitidas sin colecta propia
const noCol = Object.keys(emitted).filter(k => !COL[k]);
P(`\n## Claves emitidas SIN colecta propia: ${noCol.length}`);
P('  ferias: ' + noCol.filter(isFeria).length + ';  NO feria: ' + noCol.filter(k => !isFeria(k)).join(', '));
const feriaKeys = noCol.filter(isFeria);
P('  familias de feria: ' + [...new Set(feriaKeys.map(k => k.replace(/\d+/g, 'N')))].join(', '));

// 3) prefacio: a qué PREFACE resuelve cada clave
const prefMap = {};
for (const k of Object.keys(emitted)) {
  const season = [...emitted[k].seasons][0];
  const p = C.BCPPropers.getPreface(k, season);
  const t = Object.entries(PREF).find(([, v]) => v === p);
  (prefMap[t ? t[0] : '??'] = prefMap[t ? t[0] : '??'] || []).push(k);
}
P('\n## Prefacio resuelto por clave emitida (familias)');
for (const [pk, ks] of Object.entries(prefMap)) P(`  ${pk} (${ks.length} claves): ${ks.length > 14 ? ks.slice(0, 14).join(', ') + ' …' : ks.join(', ')}`);
const usedPref = new Set(Object.keys(prefMap));
P('  PREFACES NUNCA devueltos por getPreface para ninguna clave emitida (código muerto o fallo de mapeo): ' + Object.keys(PREF).filter(k => !usedPref.has(k)).join(', '));

// 4) claves de tablas que NUNCA se emiten
const emitSet = new Set(Object.keys(emitted));
const unusedLect = Object.keys(SUN).filter(k => !emitSet.has(k));
const unusedCol = Object.keys(COL).filter(k => !emitSet.has(k));
P('\n## Claves de BCPLectionary.SUNDAY que nunca emite el calendario (2024-2060): ' + unusedLect.join(', ') || '(ninguna)');
P('## Claves de BCPPropers.COLLECTS que nunca emite el calendario: ' + (unusedCol.join(', ') || '(ninguna)'));
P('## Claves en COLLECTS sin lectura en SUNDAY: ' + Object.keys(COL).filter(k => !SUN[k]).join(', '));
P('## Claves en SUNDAY sin colecta: ' + Object.keys(SUN).filter(k => !COL[k]).join(', '));

// 5) Claves rotas
const broken = Object.keys(emitted).filter(k => /null|undefined|NaN/.test(k));
P('\n## Claves emitidas con null/undefined/NaN: ' + (broken.join(', ') || 'ninguna'));
P('## Todas las claves emitidas con su recuento:');
P('  ' + Object.entries(emitted).sort().map(([k, e]) => `${k}:${e.n}`).join('  '));

// 6) Tipos de entrada del lectionary: all vs A/B/C
const miss3 = Object.entries(SUN).filter(([k, v]) => !v.all && !(v.A && v.B && v.C)).map(([k]) => k);
P('\n## Entradas de SUNDAY con ciclos incompletos: ' + (miss3.join(', ') || 'ninguna'));
const noPsalmAnt = Object.entries(SUN).flatMap(([k, v]) => Object.entries(v).filter(([c, r]) => !r.psalmAnt).map(([c]) => k + '/' + c));
const withAnt = Object.entries(SUN).flatMap(([k, v]) => Object.entries(v).filter(([c, r]) => r.psalmAnt).map(([c]) => k + '/' + c));
P(`## psalmAnt (antífona/estribillo del salmo) definido en ${withAnt.length} entradas clave/ciclo: ${withAnt.join(', ')}; ausente en ${noPsalmAnt.length}`);
const daysNoAnt = R.filter(r => r.refs && r.refs.psalm && !r.psalmAnt).length;
P(`   días con salmo y SIN antífona: ${daysNoAnt} de ${R.length}`);

// 7) Lecturas prestadas con temporada distinta
const keyInfo = {};
const borrowed = R.filter(r => r.borrowed);
const mm = {};
for (const r of borrowed) {
  const d = L.D(+r.d.slice(0, 4), +r.d.slice(5, 7), +r.d.slice(8, 10));
  const prev = C.BCPCalendar.getDay(C.getPreviousSunday(d));
  const k = `${r.season} (${r.key.replace(/\d+/g, 'N')}) -> ${prev.season} (${prev.key.replace(/\d+/g, 'N')})`;
  if (prev.season !== r.season) { (mm[k] = mm[k] || []).push(r.d); }
}
P('\n## Lecturas prestadas con TEMPORADA distinta a la del domingo precedente');
let tot = 0; for (const [k, v] of Object.entries(mm)) { tot += v.length; P(`  ${String(v.length).padStart(4)}  ${k}  p.ej. ${v.slice(0, 3).join(', ')}`); }
P('  total: ' + tot);

// 8) Comparación de ciclo: lcycle vs ciclo del día
const cyc = borrowed.filter(r => r.lcycle !== r.cycle);
P('\n## Lecturas prestadas cuyo ciclo difiere del ciclo del día: ' + cyc.length + (cyc.length ? ' p.ej. ' + cyc.slice(0, 5).map(r => `${r.d} día=${r.cycle} lect=${r.lcycle}`).join('; ') : ''));

// 9) Colecta prestada con textos idénticos (proper5 vs proper20 etc.)
const seen = {};
for (const [k, v] of Object.entries(COL)) (seen[v] = seen[v] || []).push(k);
const dup = Object.values(seen).filter(a => a.length > 1);
P('\n## Colectas con texto idéntico en varias claves: ' + (dup.map(a => a.join('=')).join('; ') || 'ninguna'));
// parecidas
const norm = s => s.toLowerCase().replace(/[^a-záéíóúñ ]/g, '').replace(/\s+/g, ' ');
const keys = Object.keys(COL); const near = [];
for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
  const a = norm(COL[keys[i]]).split(' '), b = norm(COL[keys[j]]).split(' ');
  const sa = new Set(a); let inter = 0; for (const w of new Set(b)) if (sa.has(w)) inter++;
  const jac = inter / (new Set([...a, ...b]).size);
  if (jac > 0.8) near.push(`${keys[i]}~${keys[j]} (${jac.toFixed(2)})`);
}
P('## Colectas casi idénticas (Jaccard de palabras > 0.8): ' + (near.join('; ') || 'ninguna'));

// 10) Lecturas duplicadas: mismos refs en claves distintas (para sospechar copia)
const sig = {};
for (const [k, v] of Object.entries(SUN)) for (const [c, r] of Object.entries(v)) { const s = `${r.first}|${r.gospel}`; (sig[s] = sig[s] || []).push(`${k}/${c}`); }
const dupRead = Object.entries(sig).filter(([, a]) => a.length > 1);
P('\n## Pares (primera lectura + evangelio) idénticos en entradas distintas: ' + dupRead.length);
dupRead.forEach(([s, a]) => P('   ' + s + '  <-  ' + a.join(', ')));
// Misma lectura de Evangelio en el mismo ciclo, en dos domingos
const gos = {};
for (const [k, v] of Object.entries(SUN)) for (const [c, r] of Object.entries(v)) { const s = `${c}|${r.gospel}`; (gos[s] = gos[s] || []).push(k); }
const gdup = Object.entries(gos).filter(([, a]) => a.length > 1 && !a.every(x => /^(holyWeek)/.test(x)));
P('## Mismo Evangelio repetido en 2 o más domingos DENTRO DEL MISMO CICLO: ' + gdup.length);
gdup.forEach(([s, a]) => P('   ' + s + '  <-  ' + a.join(', ')));

fs.writeFileSync(path.join(__dirname, 'out', 'keys.txt'), out.join('\n'));
console.log(out.join('\n'));
