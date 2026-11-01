// lect2-diff.js — Diferencias app vs. libro (BCP 2019), parte 2: Propios (3-29) y fiestas fijas.
// SOLO LECTURA. Carga el app con el arnés compartido, normaliza referencias y compara campo a campo.
// Salida: lect2-diff.json (todas las filas) + resumen por consola.
const fs = require('fs');
const path = require('path');
const H = require('../harness.js');
const C = H.load();
const V = JSON.parse(fs.readFileSync(path.join(__dirname, 'lect2-verdad.json'), 'utf8'));
const MDLINES = fs.readFileSync('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md', 'utf8').split(/\r?\n/);

// ───────────────────────── normalización de libros ─────────────────────────
const BOOK_ALIASES = {
  'genesis': 'Genesis', 'gen': 'Genesis', 'exodus': 'Exodus', 'ex': 'Exodus', 'leviticus': 'Leviticus', 'lev': 'Leviticus',
  'numbers': 'Numbers', 'num': 'Numbers', 'deuteronomy': 'Deuteronomy', 'deut': 'Deuteronomy', 'joshua': 'Joshua', 'josh': 'Joshua',
  'judges': 'Judges', 'judg': 'Judges', 'ruth': 'Ruth', '1 samuel': '1 Samuel', '1 sam': '1 Samuel', '2 samuel': '2 Samuel', '2 sam': '2 Samuel',
  '1 kings': '1 Kings', '2 kings': '2 Kings', '1 chronicles': '1 Chronicles', '2 chronicles': '2 Chronicles', 'nehemiah': 'Nehemiah', 'neh': 'Nehemiah',
  'job': 'Job', 'psalm': 'Psalm', 'psalms': 'Psalm', 'ps': 'Psalm', 'proverbs': 'Proverbs', 'prov': 'Proverbs', 'ecclesiastes': 'Ecclesiastes', 'eccl': 'Ecclesiastes',
  'song of songs': 'Song of Songs', 'isaiah': 'Isaiah', 'isa': 'Isaiah', 'jeremiah': 'Jeremiah', 'jer': 'Jeremiah', 'lamentations': 'Lamentations', 'lam': 'Lamentations',
  'ezekiel': 'Ezekiel', 'ezek': 'Ezekiel', 'ezk': 'Ezekiel', 'daniel': 'Daniel', 'dan': 'Daniel', 'hosea': 'Hosea', 'hos': 'Hosea', 'joel': 'Joel', 'amos': 'Amos',
  'jonah': 'Jonah', 'jon': 'Jonah', 'micah': 'Micah', 'mic': 'Micah', 'habakkuk': 'Habakkuk', 'hab': 'Habakkuk', 'zephaniah': 'Zephaniah', 'zeph': 'Zephaniah',
  'haggai': 'Haggai', 'zechariah': 'Zechariah', 'zech': 'Zechariah', 'malachi': 'Malachi', 'mal': 'Malachi',
  'wisdom': 'Wisdom', 'ecclesiasticus': 'Sirach', 'sirach': 'Sirach', 'judith': 'Judith', 'baruch': 'Baruch',
  'matthew': 'Matthew', 'matt': 'Matthew', 'mark': 'Mark', 'luke': 'Luke', 'john': 'John', 'acts': 'Acts', 'romans': 'Romans', 'rom': 'Romans',
  '1 corinthians': '1 Corinthians', '1 cor': '1 Corinthians', '2 corinthians': '2 Corinthians', '2 cor': '2 Corinthians', 'galatians': 'Galatians', 'gal': 'Galatians',
  'ephesians': 'Ephesians', 'eph': 'Ephesians', 'philippians': 'Philippians', 'phil': 'Philippians', 'colossians': 'Colossians', 'col': 'Colossians',
  '1 thessalonians': '1 Thessalonians', '1 thess': '1 Thessalonians', '2 thessalonians': '2 Thessalonians', '2 thess': '2 Thessalonians',
  '1 timothy': '1 Timothy', '1 tim': '1 Timothy', '2 timothy': '2 Timothy', '2 tim': '2 Timothy', 'titus': 'Titus', 'philemon': 'Philemon',
  'hebrews': 'Hebrews', 'heb': 'Hebrews', 'james': 'James', '1 peter': '1 Peter', '1 pet': '1 Peter', '2 peter': '2 Peter', '2 pet': '2 Peter',
  '1 john': '1 John', '2 john': '2 John', '3 john': '3 John', 'jude': 'Jude', 'revelation': 'Revelation', 'rev': 'Revelation',
};
const ALIAS_KEYS = Object.keys(BOOK_ALIASES).sort((a, b) => b.length - a.length);
const SINGLE_CHAPTER = new Set(['Philemon', 'Jude', '2 John', '3 John', 'Obadiah']);
const CANTICLES = { 'magnificat': { book: 'Luke', iv: [[1046, 1055]], label: 'Magnificat (Luke 1:46-55)' }, 'ecce deus': { book: 'Isaiah', iv: [[12002, 12006]], label: 'Ecce Deus (Isaiah 12:2-6)' } };

function startsWithBook(s) {
  const l = s.toLowerCase();
  for (const k of ALIAS_KEYS) {
    if (l.startsWith(k) && (l.length === k.length || /[\s\d]/.test(l[k.length]))) return { canon: BOOK_ALIASES[k], rest: s.slice(k.length).trim() };
  }
  return null;
}
const ord = (c, v) => c * 1000 + v;

// parsea el cuerpo (sin libro) de una referencia en intervalos [ini,fin] ordinales (capítulo*1000+verso)
function parseBody(body, book, mode /* 'core'|'full' */) {
  let s = body.replace(/[—–]/g, '-').replace(/v\s*$/i, '').trim();
  s = s.replace(/^(\d+)\(/, '$1:(');                 // «33(1-9)10-21» → «33:(1-9)10-21»
  if (SINGLE_CHAPTER.has(book) && !/^\d+:/.test(s)) s = '1:' + s; // Philemon (1-3)4-21 → 1:(1-3)4-21
  if (mode === 'core') s = s.replace(/\([^)]*\)/g, ',').replace(/:,/g, ':').replace(/,+/g, ',').replace(/^,|,$/g, '');
  else s = s.replace(/\(/g, ',').replace(/\)/g, ',').replace(/:,/g, ':').replace(/,+/g, ',').replace(/^,|,$/g, '');
  s = s.replace(/(\d)[a-c]\b/g, '$1');               // 9a, 15b → 9, 15
  const toks = s.split(',').map(t => t.trim()).filter(Boolean);
  const iv = []; let ch = null;
  for (const t of toks) {
    let m;
    if ((m = t.match(/^(\d+):(\d+)-(\d+):(\d+)$/))) { ch = +m[3]; iv.push([ord(+m[1], +m[2]), ord(+m[3], +m[4])]); }
    else if ((m = t.match(/^(\d+):(\d+)-(\d+)$/))) { ch = +m[1]; iv.push([ord(ch, +m[2]), ord(ch, +m[3])]); }
    else if ((m = t.match(/^(\d+):(\d+)$/))) { ch = +m[1]; iv.push([ord(ch, +m[2]), ord(ch, +m[2])]); }
    else if ((m = t.match(/^(\d+)-(\d+):(\d+)$/)) && ch != null) { iv.push([ord(ch, +m[1]), ord(+m[2], +m[3])]); ch = +m[2]; }
    else if ((m = t.match(/^(\d+)-(\d+)$/)) && ch != null) iv.push([ord(ch, +m[1]), ord(ch, +m[2])]);
    else if ((m = t.match(/^(\d+)-(\d+)$/)) && ch == null) { iv.push([ord(+m[1], 0), ord(+m[2], 999)]); }
    else if ((m = t.match(/^(\d+)$/))) { if (ch == null) { ch = +m[1]; iv.push([ord(ch, 0), ord(ch, 999)]); } else iv.push([ord(ch, +m[1]), ord(ch, +m[1])]); }
    else return { iv: null, err: `no parseable: «${t}» en «${body}»` };
  }
  return { iv: mergeIv(iv) };
}
function mergeIv(iv) {
  iv = iv.slice().sort((a, b) => a[0] - b[0]); const out = [];
  for (const x of iv) { const l = out[out.length - 1]; if (l && x[0] <= l[1] + 1) l[1] = Math.max(l[1], x[1]); else out.push(x.slice()); }
  return out;
}

// parsea una referencia completa (puede traer «or» → alternativas)
function parseRef(str) {
  if (!str) return null;
  const parts = str.trim().split(/\s+or\s+/i);
  const alts = []; let lastBook = null;
  for (const p of parts) {
    const low = p.trim().toLowerCase();
    if (CANTICLES[low]) { alts.push({ raw: p.trim(), canticle: low, book: CANTICLES[low].book === 'Luke' ? 'Luke' : 'Isaiah', core: CANTICLES[low].iv, full: CANTICLES[low].iv, v: false, optional: false, letters: false, norm: low }); continue; }
    let b = startsWithBook(p.trim());
    let book, rest;
    if (b) { book = b.canon; rest = b.rest; lastBook = book; }
    else if (lastBook) { book = lastBook; rest = p.trim(); }
    else return { alts: [], err: `libro no reconocido: «${p}»` };
    const v = /v\s*$/i.test(rest);
    const optional = /\(/.test(rest);
    const letters = /\d[a-c]\b/.test(rest);
    const core = parseBody(rest, book, 'core'), full = parseBody(rest, book, 'full');
    if (!core.iv || !full.iv) return { alts: [], err: core.err || full.err };
    const norm = (book + ' ' + rest.replace(/[—–]/g, '-').replace(/\s+/g, '')).toLowerCase();
    alts.push({ raw: p.trim(), book, rest, core: core.iv, full: full.iv, v, optional, letters, norm });
  }
  return { alts };
}

const ivEq = (a, b) => a.length === b.length && a.every((x, i) => x[0] === b[i][0] && x[1] === b[i][1]);
const span = iv => [iv[0][0], iv[iv.length - 1][1]];
const overlap = (a, b) => a.some(x => b.some(y => x[0] <= y[1] && y[0] <= x[1]));
const fmt = o => `${Math.floor(o / 1000)}:${o % 1000}`;

// Compara un valor del app con el valor del libro. Devuelve {cls, sub, note, bookAlt}
function compare(appStr, bookStr, field) {
  if (!appStr && !bookStr) return { cls: 'IGUAL', sub: 'ambos vacíos' };
  if (!appStr) return { cls: 'FALTA EN APP', sub: '' };
  if (!bookStr) return { cls: 'FALTA EN LIBRO', sub: '' };
  const A = parseRef(appStr), B = parseRef(bookStr);
  if (!A || A.err || A.alts.length === 0) return { cls: 'ERROR', sub: 'app: ' + (A && A.err) };
  if (!B || B.err) return { cls: 'ERROR', sub: 'libro: ' + (B && B.err) };
  const a = A.alts[0];
  let best = null;
  const rank = { IGUAL: 0, EQUIVALENTE: 1, CORTE: 2, PASAJE_DISTINTO: 3 };
  B.alts.forEach((b, bi) => {
    let r;
    const sameBook = a.book === b.book;
    if (!sameBook) r = { cls: 'PASAJE_DISTINTO', sub: `otro libro (${a.book} vs ${b.book})`, bookAlt: b.raw };
    else if (a.norm === b.norm && !b.canticle) r = { cls: 'IGUAL', sub: bi > 0 ? 'igual a la alternativa «or» del libro' : '', bookAlt: b.raw };
    else if (ivEq(a.full, b.core) || ivEq(a.full, b.full)) {
      const why = [];
      if (b.optional) why.push('versos opcionales entre paréntesis'); if (b.letters) why.push('verso parcial a/b'); if (b.v) why.push('sufijo v'); if (bi > 0) why.push('alternativa «or» del libro');
      r = { cls: 'EQUIVALENTE', sub: why.join('; ') || 'misma extensión', bookAlt: b.raw };
    } else if (field === 'psalm' && b.v && Math.floor(a.full[0][0] / 1000) === Math.floor(b.full[0][0] / 1000) && a.book === 'Psalm') {
      r = { cls: 'EQUIVALENTE', sub: 'mismo salmo; versículos en numeración Salterio Coverdale (v), no comparables con los del app', bookAlt: b.raw, vOnly: true };
    } else if (overlap(a.full, b.full)) {
      const [as, ae] = span(a.full), [bs, be] = span(b.full);
      const nested = (as >= bs && ae <= be) || (bs >= as && be <= ae) || as === bs || ae === be;
      r = { cls: 'CORTE', sub: nested ? `mismo pasaje, corte distinto (app ${fmt(as)}–${fmt(ae)} / libro ${fmt(bs)}–${fmt(be)})` : `solape parcial desplazado (app ${fmt(as)}–${fmt(ae)} / libro ${fmt(bs)}–${fmt(be)})`, shifted: !nested, bookAlt: b.raw };
    } else r = { cls: 'PASAJE_DISTINTO', sub: `${a.book}: pasaje distinto`, bookAlt: b.raw };
    if (!best || rank[r.cls] < rank[best.cls]) best = r;
  });
  return best;
}
function severity(field, r) {
  if (r.cls === 'PASAJE_DISTINTO') return (field === 'first' || field === 'gospel') ? 'alta' : 'media';
  if (r.cls === 'CORTE') return r.shifted ? 'media' : 'baja';
  return '';
}

// ───────────────────────── localización de la línea del markdown ─────────────────────────
const stripF = s => s.replace(/[|\s]/g, '').replace(/[—–]/g, '-').toLowerCase();
const MDF = MDLINES.map(stripF);
function findMdLine(bookStr, anchor, lo, hi) {
  const alts = bookStr.split(/\s+or\s+/i);
  const hits = [];
  for (const alt of alts) {
    const f = stripF(alt.replace(/^(ps\.?)\s*/i, 'ps'));
    if (!f) continue;
    for (let i = Math.max(0, lo - 1); i < Math.min(MDF.length, hi); i++) if (MDF[i].includes(f)) hits.push(i + 1);
  }
  if (!hits.length) return null;
  hits.sort((x, y) => Math.abs(x - anchor) - Math.abs(y - anchor));
  return hits[0];
}

// ───────────────────────── comparación ─────────────────────────
const FIELDS = ['first', 'psalm', 'second', 'gospel'];
const rows = [];
const SUN = C.BCPLectionary.SUNDAY;
const properKeys = Object.keys(SUN).filter(k => /^proper\d+$/.test(k));
const anchors = Object.values(V.propers).map(p => p.lineaMarkdown).sort((a, b) => a - b);
function nextAnchor(a) { const i = anchors.indexOf(a); return i >= 0 && i + 1 < anchors.length ? anchors[i + 1] : a + 14; }

for (const k of properKeys) {
  const bk = V.propers[k];
  for (const cyc of ['A', 'B', 'C']) {
    const app = SUN[k][cyc];
    for (const f of FIELDS) {
      const bookVal = bk[cyc][f], appVal = app ? app[f] : null;
      const r = compare(appVal, bookVal, f);
      const line = findMdLine(bookVal, bk.lineaMarkdown, bk.lineaMarkdown - 4, nextAnchor(bk.lineaMarkdown) + 2);
      rows.push({ scope: 'proper', key: k, cycle: cyc, field: f, app: appVal, book: bookVal, cls: r.cls, sub: r.sub || '', sev: severity(f, r), bookAlt: r.bookAlt || '', mdLine: line, mdBlock: `${bk.lineaMarkdown}-${nextAnchor(bk.lineaMarkdown) - 1}`, page: bk.paginaLibro });
    }
  }
}
const feastKeys = Object.keys(SUN).filter(k => /^\d\d-\d\d$/.test(k)).concat(['circumcision']);
for (const k of feastKeys) {
  const bk = V.feasts[k === 'circumcision' ? '01-01' : k];
  const app = SUN[k].all;
  for (const f of FIELDS) {
    const bookVal = bk[f], appVal = app ? app[f] : null;
    const r = compare(appVal, bookVal, f);
    const line = findMdLine(bookVal, bk.lineaMarkdown, bk.lineaMarkdown - 12, bk.lineaMarkdown + 12);
    rows.push({ scope: 'feast', key: k, cycle: 'all', field: f, app: appVal, book: bookVal, cls: r.cls, sub: r.sub || '', sev: severity(f, r), bookAlt: r.bookAlt || '', mdLine: line, mdBlock: `≈${bk.lineaMarkdown}±12`, page: bk.paginaLibro });
  }
}
fs.writeFileSync(path.join(__dirname, 'lect2-diff.json'), JSON.stringify(rows, null, 1), 'utf8');

// ───────────────────────── resumen ─────────────────────────
module.exports = { compare, parseRef, severity, rows, V, C, FIELDS };
if (require.main !== module) return;
function tally(sel) { const t = {}; rows.filter(sel).forEach(r => { t[r.cls] = (t[r.cls] || 0) + 1; }); return t; }
const CLS = ['IGUAL', 'EQUIVALENTE', 'CORTE', 'PASAJE_DISTINTO', 'FALTA EN APP', 'FALTA EN LIBRO', 'ERROR'];
function line(label, sel) { const t = tally(sel); const n = rows.filter(sel).length; return `${label.padEnd(26)} n=${String(n).padStart(3)}  ` + CLS.map(c => `${c}:${t[c] || 0}`).join('  '); }
console.log('FILAS TOTALES', rows.length);
console.log(line('TODO', () => true));
console.log(line('PROPIOS', r => r.scope === 'proper'));
console.log(line('FIESTAS (incl. circumcision)', r => r.scope === 'feast'));
for (const c of ['A', 'B', 'C']) console.log(line('Propios ciclo ' + c, r => r.scope === 'proper' && r.cycle === c));
for (const f of FIELDS) console.log(line('Propios campo ' + f, r => r.scope === 'proper' && r.field === f));
for (const c of ['A', 'B', 'C']) for (const f of FIELDS) console.log(line(`  ${c} ${f}`, r => r.scope === 'proper' && r.cycle === c && r.field === f));
for (const f of FIELDS) console.log(line('Fiestas campo ' + f, r => r.scope === 'feast' && r.field === f));
const sevT = {}; rows.forEach(r => { if (r.sev) sevT[r.sev] = (sevT[r.sev] || 0) + 1; });
console.log('Severidad (todas las filas):', JSON.stringify(sevT));
const sevP = {}; rows.filter(r => r.scope === 'proper' && r.sev).forEach(r => { sevP[r.sev] = (sevP[r.sev] || 0) + 1; });
const sevF = {}; rows.filter(r => r.scope === 'feast' && r.sev).forEach(r => { sevF[r.sev] = (sevF[r.sev] || 0) + 1; });
console.log('Severidad propios:', JSON.stringify(sevP), ' fiestas:', JSON.stringify(sevF));
const errs = rows.filter(r => r.cls === 'ERROR'); if (errs.length) console.log('ERRORES', errs.map(e => `${e.key} ${e.cycle} ${e.field}: ${e.sub}`));
// líneas md sin localizar
const nol = rows.filter(r => (r.cls === 'CORTE' || r.cls === 'PASAJE_DISTINTO') && !r.mdLine);
console.log('Diferencias sin línea md localizada:', nol.length);
