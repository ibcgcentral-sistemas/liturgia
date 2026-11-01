// Ensambla leccionario-1.md sustituyendo marcadores {{...}} de informe-plantilla.md con tablas generadas
// desde lect1-diff-resultado.json y lect1-verdad.json (asi las tablas no dependen de copiar a mano).
const fs = require('fs'), path = require('path');
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'lect1-diff-resultado.json'), 'utf8'));
const T = JSON.parse(fs.readFileSync(path.join(__dirname, 'lect1-verdad.json'), 'utf8'));
const tpl = fs.readFileSync(path.join(__dirname, 'informe-plantilla.md'), 'utf8');
const esc = s => String(s === null || s === undefined ? '—' : s).replace(/\|/g, '\\|');
const FIELDN = { first: '1ª lectura', psalm: 'salmo', second: '2ª lectura', gospel: 'evangelio' };
const ORDER = Object.keys(T.days);
const ordKey = r => ORDER.indexOf(r.key) * 10 + ['first', 'psalm', 'second', 'gospel'].indexOf(r.field);

function group(rows) {
  const g = new Map();
  rows.forEach(r => {
    const k = [r.key, r.field, r.app, r.book, r.status, r.severidad].join('¦');
    if (!g.has(k)) g.set(k, { ...r, cycles: [] , lines: new Set() });
    const o = g.get(k); o.cycles.push(r.cycle); if (r.mdLine) o.lines.add(r.mdLine);
  });
  return [...g.values()].sort((a, b) => ordKey(a) - ordKey(b) || a.cycles[0].localeCompare(b.cycles[0]));
}
const cyc = a => a.length === 3 ? 'A/B/C' : a.join('/');
const lin = o => (o.lines.size ? [...o.lines].map(l => 'L' + l).join(',') : 'pdf-only');

function tablaDif() {
  const sevOrder = { alta: 0, media: 1, baja: 2 };
  const rows = R.rows.filter(r => ['DIFERENTE', 'PARCIAL', 'FALTA EN APP', 'FALTA EN LIBRO'].includes(r.status));
  const g = group(rows);
  let t = '| sev. | clave app | ciclo | campo | valor app | valor libro (tal cual) | estado | línea md | p. libro |\n|---|---|---|---|---|---|---|---|---|\n';
  g.forEach(o => { t += `| ${o.severidad} | ${o.appKey} | ${cyc(o.cycles)} | ${FIELDN[o.field]} | ${esc(o.app)} | ${esc(o.book)} | ${o.status}${o.status === 'PARCIAL' ? ' (J=' + o.J + ')' : ''} | ${lin(o)} | ${o.bookPage} |\n`; });
  return { t, n: g.length, nrows: rows.length };
}
function tablaEq() {
  const rows = R.rows.filter(r => r.status === 'EQUIVALENTE');
  const g = group(rows);
  let t = '| clave app | ciclo | campo | valor app | valor libro (tal cual) | tipo | J | línea md |\n|---|---|---|---|---|---|---|---|\n';
  g.forEach(o => { t += `| ${o.appKey} | ${cyc(o.cycles)} | ${FIELDN[o.field]} | ${esc(o.app)} | ${esc(o.book)} | ${o.sub} | ${o.J === null ? '—' : o.J} | ${lin(o)} |\n`; });
  return { t, n: g.length, nrows: rows.length };
}
function ausentes() {
  let t = '| clave del libro | día | p. libro | líneas md | qué hace el app hoy |\n|---|---|---|---|---|\n';
  const NOTA = {
    christmasDay2: 'Solo existe la clave christmas (= Día I). El Día II (Isa 62:6-12; Sal 97; Tit 3:4-7; Lc 2:(1-14)15-20) no existe.',
    christmasDay3: 'Idem: Día III (Isa 52:7-12; Sal 98; Heb 1:1-12; Jn 1:1-18) no existe.',
    worldMission: 'No existe; es un propio opcional que el libro permite en cualquier domingo de Epifanía salvo el primero y el último.',
    palmSundayPalms: 'palmSunday trae solo el propio de la Pasión; falta el Evangelio de la entrada (Mt 21:1-11 / Mr 11:1-11a / Lc 19:29-40) y el Sal 118:19-29.',
    easterVigil: 'No hay clave; calendar.js tampoco distingue la Vigilia (el Sábado Santo muestra holySaturday). Lecturas AT en md L20898-L20913, Epístola y Evangelio L20914-L20915; salmos y cánticos en la liturgia especial L16494-L16609.',
    easterEarly: 'No hay clave (el app solo tiene el servicio principal bajo easter). Rúbrica y lecturas en md L20922-L20927.',
    easterEvening: 'No hay clave.',
    easterMon: 'calendar.js emite easterFeria1_1; no está en SUNDAY, así que resolveLectionaryKey toma prestadas las lecturas de easter (Domingo de Pascua) con el ciclo del domingo.',
    easterTue: 'Idem (easterFeria1_2 → easter).', easterWed: 'Idem (easterFeria1_3 → easter).', easterThu: 'Idem (easterFeria1_4 → easter).',
    easterFri: 'Idem (easterFeria1_5 → easter).', easterSat: 'Idem (easterFeria1_6 → easter).',
  };
  Object.entries(T.days).filter(([k, d]) => !d.appKey).forEach(([k, d]) => {
    const ls = []; ['A', 'B', 'C'].forEach(cy => ['first', 'psalm', 'second', 'gospel'].forEach(f => { if (d.lineas[cy][f]) ls.push(d.lineas[cy][f]); }));
    const rng = ls.length ? (Math.min(...ls) === Math.max(...ls) ? 'L' + ls[0] : 'L' + Math.min(...ls) + '-L' + Math.max(...ls)) : '—';
    t += `| ${k} | ${esc(d.label)} | ${d.libroPagina} | ${rng} | ${esc(NOTA[k] || '')} |\n`;
  });
  return t;
}
function alternativas() {
  const rows = R.altRows.filter(a => a.field !== 'psalm' || /Ps \d+[^o]* or (Ps )?\d+(?!:)|110|\b47\b|40:1-16|31:1-6|88/.test(a.libro) && !/^Ps (\d+) or \1:/.test(a.libro));
  return rows;
}
function matriz() { return fs.readFileSync(path.join(__dirname, 'lect1-matriz.md'), 'utf8'); }

function altTable() {
  // alternativas de LECTURA distinta (no solo "salmo completo o porción"): first / second / gospel + salmos con otro salmo como alternativa
  const distinctPsalm = a => { const o = a.libro.split(/\s+or\s+/); const nums = o.map(x => (x.replace(/^Ps\s*/, '').match(/^\d+/) || [''])[0]); return new Set(nums.filter(Boolean)).size > 1; };
  const rows = R.altRows.filter(a => a.field !== 'psalm' || distinctPsalm(a));
  let t = '| clave app | ciclo | campo | alternativas del libro | valor app | estado | línea md |\n|---|---|---|---|---|---|---|\n';
  rows.forEach(a => { t += `| ${a.key} | ${a.cycle} | ${FIELDN[a.field]} | ${esc(a.libro)} | ${esc(a.app)} | ${a.status} | ${a.linea ? 'L' + a.linea : 'pdf-only'} |\n`; });
  return { t, n: rows.length, total: R.altRows.length };
}

const dif = tablaDif(), eq = tablaEq(), alt = altTable();
const out = tpl
  .replace('{{TABLA_DIF}}', dif.t).replace('{{N_DIF_GRUPOS}}', dif.n).replace('{{N_DIF_FILAS}}', dif.nrows)
  .replace('{{TABLA_EQ}}', eq.t).replace('{{N_EQ_GRUPOS}}', eq.n)
  .replace('{{AUSENTES}}', ausentes())
  .replace('{{ALT}}', alt.t).replace('{{N_ALT}}', alt.n).replace('{{N_ALT_TOTAL}}', alt.total).replace('{{N_ALT_PORCION}}', alt.total - alt.n)
  .replace('{{MATRIZ}}', matriz());
fs.writeFileSync(path.join(__dirname, 'leccionario-1.md'), out, 'utf8');
console.log('ok; grupos DIF', dif.n, 'filas', dif.nrows, '; EQ grupos', eq.n, 'filas', eq.nrows, '; alt', alt.n, '/', alt.total);
