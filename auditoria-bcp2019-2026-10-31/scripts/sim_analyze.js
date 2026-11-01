// sim_analyze.js — Análisis de out/sweep.json (producido por sim_sweep.js)
'use strict';
const fs = require('fs');
const path = require('path');
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'sweep.json'), 'utf8'));
const out = [];
const P = (...a) => out.push(a.join(' '));
const cnt = (arr, f) => { const m = {}; for (const x of arr) { const k = f(x); m[k] = (m[k] || 0) + 1; } return m; };
const sortObj = o => Object.entries(o).sort((a, b) => b[1] - a[1]);
const show = (title, o, lim = 60) => { P(`\n## ${title}`); sortObj(o).slice(0, lim).forEach(([k, v]) => P(`  ${String(v).padStart(6)}  ${k}`)); };

P(`Días simulados: ${R.length}  (${R[0].d} .. ${R[R.length - 1].d})`);
P(`Con excepción: ${R.filter(r => r.exc).length}`);
P(`Con warnings de consola: ${R.filter(r => r.warns).length}`);

// 1) Marcas de fallo
const marks = {};
for (const r of R) for (const m of (r.marks || [])) { (marks[m] = marks[m] || []).push(r); }
P('\n## Marcas de fallo en HTML (días afectados)');
for (const [m, rs] of Object.entries(marks)) {
  P(`  ${String(rs.length).padStart(6)}  ${m}   p.ej. ${rs.slice(0, 4).map(r => r.d + ' ' + r.key).join(' | ')}`);
}
if (!Object.keys(marks).length) P('  (ninguna)');

// 2) Días sin lecturas
const noRead = R.filter(r => !r.hasReadings);
P(`\n## Días sin lecturas (readings=null): ${noRead.length}`);
show('  por key (sin lecturas)', cnt(noRead, r => r.key));
show('  por season (sin lecturas)', cnt(noRead, r => r.season));
show('  por mes (sin lecturas)', cnt(noRead, r => r.d.slice(5, 7)), 12);
P('  htmlNoFirst: ' + R.filter(r => r.htmlNoFirst).length + '  htmlNoGospel: ' + R.filter(r => r.htmlNoGospel).length);
const semSanta = noRead.filter(r => /^holyWeekFeria/.test(r.key));
P('  de ellos holyWeekFeria: ' + semSanta.length);
// Qué días de Semana Santa carecen de primera lectura
const hw = R.filter(r => r.season === 'holyWeek');
show('  Semana Santa por key: días totales', cnt(hw, r => r.key));
show('  Semana Santa sin primera lectura por key', cnt(hw.filter(r => r.htmlNoFirst), r => r.key));

// 3) Lecturas con problemas
P('\n## Estados de lecturas');
P('  firstBad: ' + R.filter(r => r.firstBad).length + '  secondBad: ' + R.filter(r => r.secondBad).length + '  gospelBad: ' + R.filter(r => r.gospelBad).length);
P('  psalm ref presente pero 0 versículos devueltos: ' + R.filter(r => r.refs && r.refs.psalm && r.psalmN === 0).length);
P('  second ref presente pero HTML sin SEGUNDA LECTURA: ' + R.filter(r => r.refs && r.refs.second && !r.htmlHasSecond).length);
P('  lecturas con len < 150 (first/second/gospel): ' + R.filter(r => r.hasReadings && (r.firstLen < 150 || r.gospelLen < 150 || (r.secondLen != null && r.secondLen < 150))).length);

// 4) Colectas
const own = R.filter(r => r.collectOwn);
const prevS = R.filter(r => !r.collectOwn && r.collectFound);
const miss = R.filter(r => !r.collectFound);
P(`\n## Colectas: propia=${own.length}  tomada del domingo precedente=${prevS.length}  sin colecta (mensaje 'Colecta no disponible')=${miss.length}`);
show('  sin colecta por key', cnt(miss, r => r.key));
P('  collectLen==0: ' + R.filter(r => !r.collectLen).length + '; collect "Colecta no disponible": ' + R.filter(r => (r.marks || []).includes('colectaNoDisponible')).length);
P('  respaldo genérico Proper 11: el código ya no lo usa (getCollect devuelve mensaje). Días cuya colecta == texto de proper11 y key no es proper11/ferias de proper11: ver más abajo');
show('  colecta prestada: por season del día', cnt(prevS, r => r.season));
show('  colecta prestada: pares (season día -> season domingo precedente) con season distinta', cnt(prevS.filter(r => r.season !== r.prevSundaySeason), r => `${r.season} -> ${r.prevSundaySeason}`));
const ptype = r => r.key.replace(/_\d$/, '').replace(/\d+$/, 'N');
show('  colecta prestada: por tipo de clave', cnt(prevS, ptype));
// Sábados/Jueves.. después de Ceniza
const afterAsh = prevS.filter(r => /^lentFeria1_/.test(r.key));
P(`  Ferias lentFeria1_* (jue-sáb tras Ceniza): ${afterAsh.length} días; domingo precedente = ${[...new Set(afterAsh.map(r => r.prevSundayKey))].join(',')}`);
show('  colecta prestada: key del domingo precedente (todas)', cnt(prevS, r => r.prevSundayKey), 80);

// 5) Lecturas prestadas
const borrowed = R.filter(r => r.borrowed);
P(`\n## Lecturas prestadas del domingo (borrowedFromSunday): ${borrowed.length}`);
show('  por season', cnt(borrowed, r => r.season));
show('  lkey usada', cnt(borrowed, r => r.lkey), 80);
const bm = borrowed.filter(r => r.prevSundaySeason && r.prevSundaySeason !== r.season);
// prevSundaySeason sólo existe si !collectOwn; recalcular con lkey no es posible aquí => se calcula en sim_borrow.js
P('  (los desajustes de temporada de las lecturas prestadas se calculan en sim_borrow.js)');

// 6) Prefacios
P('\n## Prefacios');
show('  título del prefacio', cnt(R, r => r.prefaceTitle));
P('  prefaceLen==0: ' + R.filter(r => !r.prefaceLen).length);
const pref = {};
for (const r of R) { const k = `${r.season}|${r.prefaceTitle}`; pref[k] = (pref[k] || 0) + 1; }
show('  season|prefacio', pref, 100);

// 7) Variantes estacionales
P('\n## Variantes por season (conteo de días)');
const varKey = r => `acc=${r.v.acc} gloria=${r.v.gloria ? 'SI' : 'omitido'}${r.v.gloriaRubric ? '(rúbrica)' : ''} fracción=${r.v.fraction} despedida=${r.v.dismissal}`;
const bySeason = {};
for (const r of R) { if (!r.v) continue; const s = r.season; (bySeason[s] = bySeason[s] || {}); const k = varKey(r); bySeason[s][k] = (bySeason[s][k] || 0) + 1; }
for (const [s, o] of Object.entries(bySeason)) { P(`  [${s}]`); sortObj(o).forEach(([k, v]) => P(`     ${String(v).padStart(5)}  ${k}`)); }
P('  variantes UNKNOWN: ' + R.filter(r => r.v && Object.values(r.v).includes('UNKNOWN')).length);

fs.writeFileSync(path.join(__dirname, 'out', 'analysis.txt'), out.join('\n'));
console.log(out.join('\n'));
