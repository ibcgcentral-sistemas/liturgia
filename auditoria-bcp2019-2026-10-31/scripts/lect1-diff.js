// Script de diferencias — leccionario BCP 2019, parte 1 (Adviento .. Trinidad).
// SOLO LECTURA sobre el repo: carga bcp2019/js/*.js en un contexto vm (arnés compartido) y compara
// BCPLectionary.SUNDAY contra lect1-verdad.json (transcrito del libro; ver build-truth.js).
// Uso:  node lect1-diff.js        -> escribe lect1-diff-resultado.json y lect1-diff-tablas.md
const fs = require('fs');
const path = require('path');
const H = require('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/harness.js');
const C = H.load();
const SUNDAY = C.BCPLectionary.SUNDAY;
const TRUTH = JSON.parse(fs.readFileSync(path.join(__dirname, 'lect1-verdad.json'), 'utf8'));

// ---------------------------------------------------------------- libros
const BOOKS = {};
function reg(code, ...names) { names.forEach(n => { BOOKS[n.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ')] = code; }); }
reg('GEN', 'gen', 'genesis'); reg('EXO', 'ex', 'exodus'); reg('LEV', 'lev', 'leviticus'); reg('NUM', 'num', 'numbers'); reg('DEU', 'deut', 'deuteronomy');
reg('JOS', 'josh', 'joshua'); reg('JDG', 'judg', 'judges'); reg('RUT', 'ruth'); reg('1SA', '1 sam', '1 samuel'); reg('2SA', '2 sam', '2 samuel');
reg('1KI', '1 kings', '1 kgs'); reg('2KI', '2 kings', '2 kgs'); reg('1CH', '1 chr', '1 chronicles'); reg('2CH', '2 chr', '2 chronicles');
reg('NEH', 'neh', 'nehemiah'); reg('JOB', 'job'); reg('PSA', 'ps', 'psalm', 'psalms'); reg('PRO', 'prov', 'proverbs'); reg('ECC', 'eccl', 'ecclesiastes');
reg('SNG', 'song of songs', 'song of solomon'); reg('WIS', 'wisdom'); reg('SIR', 'ecclesiasticus', 'sirach'); reg('BAR', 'baruch');
reg('ISA', 'isa', 'isaiah'); reg('JER', 'jer', 'jeremiah'); reg('EZK', 'ezek', 'ezekiel'); reg('DAN', 'dan', 'daniel'); reg('HOS', 'hos', 'hosea');
reg('JOL', 'joel'); reg('AMO', 'amos'); reg('JON', 'jonah'); reg('MIC', 'mic', 'micah'); reg('ZEP', 'zeph', 'zephaniah'); reg('HAG', 'hag', 'haggai');
reg('HAB', 'hab', 'habakkuk'); reg('ZEC', 'zech', 'zechariah'); reg('MAL', 'mal', 'malachi');
reg('MAT', 'matt', 'matthew'); reg('MRK', 'mark'); reg('LUK', 'luke'); reg('JHN', 'john'); reg('ACT', 'acts'); reg('ROM', 'rom', 'romans');
reg('1CO', '1 cor', '1 corinthians'); reg('2CO', '2 cor', '2 corinthians'); reg('GAL', 'gal', 'galatians'); reg('EPH', 'eph', 'ephesians');
reg('PHP', 'phil', 'philippians'); reg('COL', 'col', 'colossians'); reg('1TH', '1 thess', '1 thessalonians'); reg('2TH', '2 thess', '2 thessalonians');
reg('1TI', '1 tim', '1 timothy'); reg('2TI', '2 tim', '2 timothy'); reg('TIT', 'titus'); reg('HEB', 'heb', 'hebrews'); reg('JAS', 'james');
reg('1PE', '1 pet', '1 peter'); reg('2PE', '2 pet', '2 peter'); reg('1JN', '1 john'); reg('2JN', '2 john'); reg('3JN', '3 john'); reg('JUD', 'jude'); reg('REV', 'rev', 'revelation');

// largo de capitulo, SOLO para expandir rangos que cruzan capitulos
const CH_LEN = {
  'ISA:61': 11, 'ISA:62': 12, 'ISA:63': 19, 'ISA:52': 15, 'ISA:8': 23, 'GAL:3': 29, 'PHP:3': 21, '2CO:5': 21, '2CO:3': 18, '1CO:12': 31,
  'GEN:1': 31, 'GEN:2': 25, 'JER:3': 25, 'REV:21': 27, 'MAT:26': 75, 'MRK:14': 72, 'LUK:22': 71, 'JHN:18': 40, 'ACT:6': 15, 'ACT:11': 30,
  'JOS:4': 24, 'JOL:2': 27, '1JN:1': 10, 'EXO:14': 31, 'ACT:5': 42,
};
const warnings = new Set();

function splitOptions(raw) {
  const parts = String(raw).split(/\s+or\s+/).map(s => s.trim().replace(/^or\s+/, '')).filter(Boolean);
  if (!parts.length) return parts;
  const m0 = /^((?:[123]\s*)?[A-Za-z][A-Za-z.]*(?:\s+of\s+[A-Za-z]+)?)/.exec(parts[0]);
  return parts.map((p, i) => (i > 0 && /^\d+(?:[:\-,]|$)/.test(p) && m0 ? m0[1] + ' ' + p : p));
}

function parseRef(str) {
  let s = String(str).trim().replace(/[—–]/g, '-').replace(/(\d)v\b/g, '$1').replace(/\bPs\./, 'Ps');
  const m = /^((?:[123]\s*)?[A-Za-z][A-Za-z.]*(?:\s+of\s+[A-Za-z]+)?)\s*(.*)$/.exec(s);
  if (!m) return { error: 'sin libro', raw: str };
  const nameKey = m[1].toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ');
  const code = BOOKS[nameKey];
  if (!code) return { error: 'libro desconocido: ' + m[1], raw: str };
  const spec = m[2];
  const core = new Set(), max = new Set();
  let whole = null;
  const addRange = (sc, sv, ec, ev, optional) => {
    for (let c = sc; c <= ec; c++) {
      const from = c === sc ? sv : 1;
      let to = c === ec ? ev : CH_LEN[code + ':' + c];
      if (to === undefined) { warnings.add(`capitulo ${code}:${c} sin largo; se asume 50 (ref "${str}")`); to = 50; }
      for (let v = from; v <= to; v++) { max.add(c + ':' + v); if (!optional) core.add(c + ':' + v); }
    }
  };
  let i = 0, opt = 0, cur = null;
  const L = spec.length;
  const num = () => { const mm = /^\d+/.exec(spec.slice(i)); if (!mm) return null; i += mm[0].length; return parseInt(mm[0], 10); };
  const suf = () => { while (i < L && /[a-z]/.test(spec[i])) i++; };
  while (i < L) {
    const ch = spec[i];
    if (/[\s,;]/.test(ch)) { i++; continue; }
    if (ch === '(') { opt++; i++; continue; }
    if (ch === ')') { opt = Math.max(0, opt - 1); i++; continue; }
    if (/\d/.test(ch)) {
      const n1 = num();
      let sc, sv;
      if (spec[i] === ':') {
        i++; cur = n1; sc = n1;
        while (i < L && (spec[i] === '(' || /\s/.test(spec[i]))) { if (spec[i] === '(') opt++; i++; }
        sv = num();
        if (sv === null) continue;
      } else if (cur === null) { sc = n1; sv = null; } else { sc = cur; sv = n1; }
      suf();
      let ec = sc, ev = sv;
      if (spec[i] === '-') {
        i++;
        const n2 = num();
        if (spec[i] === ':') { i++; ec = n2; ev = num(); cur = ec; } else { ev = n2; }
        suf();
      }
      if (sv === null) { whole = n1; cur = n1; } else addRange(sc, sv, ec, ev, opt > 0);
      continue;
    }
    i++;
  }
  const chap = whole !== null ? whole : (cur !== null ? cur : null);
  const norm = (code + ' ' + spec).toLowerCase().replace(/\s+/g, '').replace(/\(|\)/g, m2 => m2);
  return { code, raw: str, spec, core, max, whole, chap, norm };
}

function rel(app, bk) {
  if (app.error || bk.error) return { rank: -1, why: app.error || bk.error };
  if (app.code !== bk.code) return { rank: 0, why: 'otro libro/pasaje' };
  if (app.code === 'PSA') {
    const an = (app.whole !== null ? app.whole : app.chap), bn = (bk.whole !== null ? bk.whole : bk.chap);
    if (an !== bn) return { rank: 0, why: 'otro salmo' };
    if (app.norm === bk.norm) return { rank: 4, why: 'igual' };
    if (bk.whole !== null && app.whole === null) return { rank: 2, J: 1, sub: 'salmo-porcion', why: 'el app da una porción; el libro ofrece el salmo completo' };
    if (app.whole !== null && bk.whole === null) return { rank: 2, J: 1, sub: 'salmo-porcion', why: 'el app da el salmo completo; el libro una porción' };
    let inter = 0; app.max.forEach(x => { if (bk.max.has(x)) inter++; });
    const uni = app.max.size + bk.max.size - inter;
    const J = uni ? inter / uni : 0;
    const eqS = (a, b) => a.size === b.size && [...a].every(x => b.has(x));
    if (eqS(app.max, bk.max) || eqS(app.max, bk.core)) return { rank: 3, J: 1, sub: 'opcional', why: 'mismo tramo (paréntesis opcionales)' };
    if (J >= 0.5) return { rank: 2, J, sub: J >= 0.7 ? 'corte' : 'corte-debil', why: 'mismo salmo, corte distinto' };
    if (inter > 0) return { rank: 1, J, why: 'mismo salmo, tramo con solapamiento parcial' };
    return { rank: 1, J: 0, why: 'mismo salmo, tramo sin solapamiento' };
  }
  if (app.norm === bk.norm) return { rank: 4, why: 'igual' };
  const eq = (a, b) => a.size === b.size && [...a].every(x => b.has(x));
  if (eq(app.max, bk.max) || eq(app.max, bk.core)) return { rank: 3, J: 1, sub: 'opcional', why: 'mismo texto (parentesis opcionales / media-versiculo)' };
  let inter = 0; app.max.forEach(x => { if (bk.max.has(x)) inter++; });
  const uni = app.max.size + bk.max.size - inter;
  const J = uni ? inter / uni : 0;
  if (J >= 0.5) return { rank: 2, J, sub: J >= 0.7 ? 'corte' : 'corte-debil', why: 'mismo pasaje, corte distinto' };
  if (inter > 0) return { rank: 1, J, why: 'solapamiento parcial (corte muy distinto)' };
  return { rank: 0, J: 0, why: 'mismo libro, otro pasaje' };
}

// Correcciones MANUALES (verificadas a mano en la sección C del informe) por diferencia de numeración
// versicular hebrea/BJ (app) frente a la inglesa del libro (ESV).
const OVERRIDES = {
  'advent1.B.first': { status: 'EQUIVALENTE', why: 'misma perícopa; numeración hebrea/BJ (Isa 63:19b-64:8) vs inglesa del libro (Isa 64:1-9a)' },
  'advent4.C.first': { status: 'EQUIVALENTE', why: 'misma perícopa; numeración hebrea/BJ (Miq 5:1-4) vs inglesa del libro (Mic 5:2-5a)' },
};

const FIELDS = ['first', 'psalm', 'second', 'gospel'];
const STATUS_RANK = { IGUAL: 4, EQUIVALENTE: 3, PARCIAL: 2, DIFERENTE: 1 };
const rows = [];       // una por (dia, ciclo, campo)
const missingDays = []; // dias del libro sin clave en app
const appOnly = [];     // claves del app (alcance) sin entrada en la verdad

const scopeAppKeys = new Set(Object.values(TRUTH.days).map(d => d.appKey).filter(Boolean));

for (const [tkey, d] of Object.entries(TRUTH.days)) {
  if (!d.appKey) { missingDays.push({ key: tkey, label: d.label, libroPagina: d.libroPagina, mdLineas: d.mdLineas }); continue; }
  for (const cy of ['A', 'B', 'C']) {
    const appEntry = C.BCPLectionary.getSundayReadings(d.appKey, cy);
    const appIsAll = !!(SUNDAY[d.appKey] && SUNDAY[d.appKey].all);
    for (const f of FIELDS) {
      const bookRaw = d[cy][f];
      const appVal = appEntry ? appEntry[f] : undefined;
      const rowBase = { key: tkey, appKey: d.appKey, cycle: cy, field: f, app: appVal === undefined ? null : appVal, book: bookRaw, mdLine: d.lineas[cy][f], bookPage: d.libroPagina, uniform: d.cicloUnico, appAll: appIsAll };
      if ((bookRaw === null || bookRaw === undefined) && (appVal === null || appVal === undefined)) { rows.push({ ...rowBase, status: 'AMBOS-VACIOS' }); continue; }
      if (bookRaw === null || bookRaw === undefined) { rows.push({ ...rowBase, status: 'FALTA EN LIBRO', why: 'el libro no asigna esta lectura; el app sí' }); continue; }
      if (appVal === null || appVal === undefined) { rows.push({ ...rowBase, status: 'FALTA EN APP', why: 'el libro asigna lectura; el app no' }); continue; }
      const opts = splitOptions(bookRaw);
      const ap = parseRef(appVal);
      let best = null, bestOpt = null;
      for (const o of opts) {
        const bp = parseRef(o);
        const r = rel(ap, bp);
        if (best === null || r.rank > best.rank || (r.rank === best.rank && (r.J || 0) > (best.J || 0))) { best = r; bestOpt = o; }
      }
      let status = best.rank === 4 ? 'IGUAL' : best.rank >= 2 && best.rank <= 3 ? 'EQUIVALENTE' : best.rank === 1 ? 'PARCIAL' : 'DIFERENTE';
      let why = best.why;
      const ov = OVERRIDES[`${tkey}.${cy}.${f}`];
      if (ov) { status = ov.status; why = ov.why + ' [override manual]'; }
      rows.push({ ...rowBase, status, why, sub: ov ? 'numeracion' : (best.sub || null), J: best.J === undefined ? null : Math.round((best.J || 0) * 100) / 100, bestOption: bestOpt, nOptions: opts.length });
    }
  }
}
for (const k of Object.keys(SUNDAY)) if (!scopeAppKeys.has(k) && isInScopeKey(k)) appOnly.push(k);
function isInScopeKey(k) { return !/^proper\d+$/.test(k) && !/^\d\d-\d\d$/.test(k); }

// severidad
function sev(r) {
  if (r.status === 'IGUAL' || r.status === 'AMBOS-VACIOS') return null;
  if (r.status === 'EQUIVALENTE') return 'baja';
  const major = r.field === 'first' || r.field === 'gospel';
  if (r.status === 'DIFERENTE' || r.status === 'FALTA EN APP' || r.status === 'FALTA EN LIBRO') return major ? 'alta' : 'media';
  if (r.status === 'PARCIAL') return 'media';
  return null;
}
rows.forEach(r => { r.severidad = sev(r); });

// ---------------------------------------------------------------- conteos
function count(filter) {
  const out = { IGUAL: 0, EQUIVALENTE: 0, PARCIAL: 0, DIFERENTE: 0, 'FALTA EN APP': 0, 'FALTA EN LIBRO': 0, total: 0 };
  rows.filter(r => r.status !== 'AMBOS-VACIOS' && filter(r)).forEach(r => { out[r.status]++; out.total++; });
  return out;
}
const summary = { totalFilas: rows.length, ambosVacios: rows.filter(r => r.status === 'AMBOS-VACIOS').length };
summary.global = count(() => true);
summary.porCiclo = {}; ['A', 'B', 'C'].forEach(cy => { summary.porCiclo[cy] = count(r => r.cycle === cy); });
summary.porCampo = {}; FIELDS.forEach(f => { summary.porCampo[f] = count(r => r.field === f); });
summary.porCicloCampo = {}; ['A', 'B', 'C'].forEach(cy => FIELDS.forEach(f => { summary.porCicloCampo[cy + '.' + f] = count(r => r.cycle === cy && r.field === f); }));
// unicas: dias de lectura uniforme en el libro se cuentan una sola vez (ciclo A); el resto, por ciclo
// (unica = se colapsa a una sola fila cuando el valor del app y el del libro son identicos en A, B y C)
const grp3 = {};
rows.forEach(r => { (grp3[r.key + '|' + r.field] = grp3[r.key + '|' + r.field] || []).push(r); });
const collapsed = new Set();
Object.values(grp3).forEach(g => { if (g.length === 3 && g.every(x => x.app === g[0].app && x.book === g[0].book)) g.forEach(x => { if (x.cycle !== 'A') collapsed.add(x); }); });
const uniq = r => !collapsed.has(r);
summary.equivSub = {}; summary.equivSubUnicas = {};
rows.filter(r => r.status === 'EQUIVALENTE').forEach(r => { summary.equivSub[r.sub || 'otro'] = (summary.equivSub[r.sub || 'otro'] || 0) + 1; });
rows.filter(r => r.status === 'EQUIVALENTE' && uniq(r)).forEach(r => { summary.equivSubUnicas[r.sub || 'otro'] = (summary.equivSubUnicas[r.sub || 'otro'] || 0) + 1; });
summary.parcialesDeLasCuales = {};
summary.globalUnicas = count(uniq);
summary.porCampoUnicas = {}; FIELDS.forEach(f => { summary.porCampoUnicas[f] = count(r => uniq(r) && r.field === f); });
summary.severidad = { alta: 0, media: 0, baja: 0 };
rows.forEach(r => { if (r.severidad) summary.severidad[r.severidad]++; });
summary.severidadUnicas = { alta: 0, media: 0, baja: 0 };
rows.filter(uniq).forEach(r => { if (r.severidad) summary.severidadUnicas[r.severidad]++; });
// por tiempo litúrgico
const SEASON = k => /^advent/.test(k) ? 'Adviento' : /^christmas|^circumcision$/.test(k) ? 'Navidad' : /^epiphany|^transfiguration$/.test(k) ? 'Epifanía' : /^ashWed|^lent/.test(k) ? 'Cuaresma' : /^palmSunday|^holyWeek|^maundy|^goodFriday|^holySaturday/.test(k) ? 'Semana Santa' : /^easter|^ascension/.test(k) ? 'Pascua' : /^pentecost|^trinity/.test(k) ? 'Pentecostés/Trinidad' : 'otro';
summary.porTiempo = {};
rows.filter(r => r.status !== 'AMBOS-VACIOS').forEach(r => { const s = SEASON(r.appKey); (summary.porTiempo[s] = summary.porTiempo[s] || { total: 0, igual: 0, equivalente: 0, noCoincide: 0 }); const o = summary.porTiempo[s]; o.total++; if (r.status === 'IGUAL') o.igual++; else if (r.status === 'EQUIVALENTE') o.equivalente++; else o.noCoincide++; });
// dias completamente coincidentes
const dayStat = {};
rows.filter(r => r.status !== 'AMBOS-VACIOS').forEach(r => { const k = r.key + '|' + r.cycle; (dayStat[k] = dayStat[k] || []).push(r.status); });
summary.diasCicloTotales = Object.keys(dayStat).length;
summary.diasCicloTodoIgualOEquiv = Object.values(dayStat).filter(a => a.every(s => s === 'IGUAL' || s === 'EQUIVALENTE')).length;
summary.diasCicloAlgunDiferenteOFalta = summary.diasCicloTotales - summary.diasCicloTodoIgualOEquiv;
summary.diasCicloEvangelioIgualOEquiv = (() => { const g = rows.filter(r => r.field === 'gospel'); return g.filter(r => r.status === 'IGUAL' || r.status === 'EQUIVALENTE').length + '/' + g.length; })();
summary.diasCicloPrimeraIgualOEquiv = (() => { const g = rows.filter(r => r.field === 'first'); return g.filter(r => r.status === 'IGUAL' || r.status === 'EQUIVALENTE').length + '/' + g.length; })();

// ---------------------------------------------------------------- alternativas del libro ignoradas
const altRows = [];
{
  const seen = new Set();
  rows.filter(r => r.nOptions > 1).forEach(r => {
    const k = [r.key, r.field, r.book, r.app].join('|');
    // un solo renglón si es identico en los 3 ciclos
    const grp = r.uniform ? [r.key, r.field, 'u'].join('|') : [r.key, r.cycle, r.field].join('|');
    if (seen.has(grp)) return; seen.add(grp);
    altRows.push({ key: r.key, cycle: r.uniform ? 'A/B/C' : r.cycle, field: r.field, libro: r.book, app: r.app, status: r.status, linea: r.mdLine });
  });
}

const result = { generado: '2026-10-31', summary, warnings: [...warnings], missingDays, appOnly, altRows, rows };
fs.writeFileSync(path.join(__dirname, 'lect1-diff-resultado.json'), JSON.stringify(result, null, 1), 'utf8');

// ---------------------------------------------------------------- tablas markdown
const esc = s => String(s === null || s === undefined ? '—' : s).replace(/\|/g, '\\|');
const diffRows = rows.filter(r => ['DIFERENTE', 'PARCIAL', 'FALTA EN APP', 'FALTA EN LIBRO'].includes(r.status));
const eqRows = rows.filter(r => r.status === 'EQUIVALENTE');
let md = '';
const tbl = (list, withSev) => {
  let t = '| clave app | ciclo | campo | valor app | valor libro | estado | sev. | línea md | p. |\n|---|---|---|---|---|---|---|---|---|\n';
  list.forEach(r => { t += `| ${r.appKey} | ${r.cycle} | ${r.field} | ${esc(r.app)} | ${esc(r.book)} | ${r.status}${r.J !== null && r.J !== undefined && r.status !== 'DIFERENTE' ? ' (J=' + r.J + ')' : ''} | ${r.severidad || ''} | ${r.mdLine ? 'L' + r.mdLine : 'pdf-only'} | ${r.bookPage} |\n`; });
  return t;
};
md += '## DIFERENTES / PARCIALES / FALTA\n\n' + tbl(diffRows) + '\n## EQUIVALENTES\n\n' + tbl(eqRows) + '\n';
fs.writeFileSync(path.join(__dirname, 'lect1-diff-tablas.md'), md, 'utf8');

console.log(JSON.stringify(summary, null, 1));
console.log('advertencias:', [...warnings]);
console.log('dias del libro sin clave en app:', missingDays.map(d => d.key).join(', '));
console.log('claves del app (alcance) sin entrada en la verdad:', appOnly);
console.log('alternativas del libro (filas):', altRows.length);
