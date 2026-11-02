// Genera bcp2019/js/lectionary.js desde los datos oficiales del BCP 2019 (pp. 717-733) en ./data.
// Uso:  node bcp2019-tools/build-lectionary.js            -> reescribe bcp2019/js/lectionary.js
//       node bcp2019-tools/build-lectionary.js --diag     -> lista citas de libros con riesgo de numeración
//       node bcp2019-tools/build-lectionary.js <salida>   -> escribe en otro archivo
// Idempotente: las antífonas y los Lunes-Miércoles Santos se leen del lectionary.js vigente.
'use strict';
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, 'data') + '/';
const OLD = path.join(__dirname, '..', 'bcp2019', 'js', 'lectionary.js');
const j1 = JSON.parse(fs.readFileSync(DATA + 'lectionary-oficial-adviento-trinidad.json', 'utf8'));
const j2 = JSON.parse(fs.readFileSync(DATA + 'lectionary-oficial-propios-fiestas.json', 'utf8'));

const { normOne, pick, readingSet } = require('./lect-norm');

// ── Construcción de SUNDAY ────────────────────────────────────────────────
const out = {};           // key → {A,B,C} | {all}
const notes = [];
const EASTER_WEEK = { easterMon: 'easterFeria1_1', easterTue: 'easterFeria1_2', easterWed: 'easterFeria1_3', easterThu: 'easterFeria1_4', easterFri: 'easterFeria1_5', easterSat: 'easterFeria1_6' };
const KEEP_OLD = []; // entradas del lectionary.js vigente que se conservan en vez de tomarlas del libro (ninguna desde 2026-10-31)
const SKIP = new Set(['christmasDay2', 'christmasDay3', 'worldMission', 'palmSundayPalms', 'easterVigil', 'easterEarly', 'easterEvening', 'circumcision']);

for (const [k, v] of Object.entries(j1.days)) {
  if (SKIP.has(k) || KEEP_OLD.includes(k)) continue;
  const key = EASTER_WEEK[k] || v.appKey;
  if (!key) { notes.push('sin clave: ' + k); continue; }
  out[key] = v.cicloUnico ? { all: readingSet(v.A) } : { A: readingSet(v.A), B: readingSet(v.B), C: readingSet(v.C) };
}
for (const [k, v] of Object.entries(j2.propers)) out[k] = { A: readingSet(v.A), B: readingSet(v.B), C: readingSet(v.C) };
for (const [k, v] of Object.entries(j2.feasts)) out[k] = { all: readingSet(v) };

// ¿coincide 'circumcision' (j1) con la fiesta 01-01 (j2)?
{
  const a = JSON.stringify(readingSet(j1.days.circumcision.A)), b = JSON.stringify(out['01-01'].all);
  notes.push('circumcision(j1) vs 01-01(j2): ' + (a === b ? 'idénticos' : 'DIFIEREN ' + a + ' | ' + b));
}

if (require.main === module && process.argv[2] === '--diag') {
  const RISK = new Set(['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '2 Chronicles', 'Nehemiah', 'Job', 'Ecclesiastes', 'Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Jonah', 'Micah', 'Nahum', 'Zechariah', 'Malachi', 'Sirach', 'Wisdom', 'Judith', 'Baruch', 'Habakkuk', 'Zephaniah', 'Haggai', 'Amos']);
  const seen = new Map();
  const walk = (key, c, set) => { for (const s of ['first', 'second']) { const r = set[s]; if (!r) continue; const b = r.replace(/\s\d.*$/, ''); if (RISK.has(b)) (seen.get(r) || seen.set(r, []).get(r)).push(key + (c ? '/' + c : '')); } };
  for (const [k, e] of Object.entries(out)) { if (e.all) walk(k, '', e.all); else for (const c of 'ABC') walk(k, c, e[c]); }
  for (const r of [...seen.keys()].sort()) console.log(r.padEnd(34), seen.get(r).slice(0, 3).join(', '));
  console.log('\nnotas:', notes.join(' | '));
  process.exit(0);
}
// ── Emisión de lectionary.js ──────────────────────────────────────────────
const vm = require('vm');
const old = (() => { // SUNDAY del archivo anterior (snapshot), para conservar antífonas y Lunes-Miércoles Santos
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(OLD, 'utf8') + '\n;this.__L = BCPLectionary;', ctx);
  return ctx.__L.SUNDAY;
})();
for (const k of KEEP_OLD) out[k] = old[k];

const stats = { antKept: 0, antDropped: 0 };
const q = s => s == null ? 'null' : "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
function line(e, oldE, label) {
  const parts = [`first: ${q(e.first)}`, `psalm: ${q(e.psalm)}`, `second: ${q(e.second)}`, `gospel: ${q(e.gospel)}`];
  const oe = oldE && (oldE[label] || oldE.all);
  if (oe && oe.psalmAnt) {
    if (oe.psalm === e.psalm) { parts.push(`psalmAnt: ${q(oe.psalmAnt)}`); stats.antKept++; } else stats.antDropped++;
  }
  return `{ ${parts.join(', ')} }`;
}
const SECTIONS = [
  ['ADVIENTO', k => /^advent/.test(k)],
  ['NAVIDAD Y EPIFANÍA', k => /^christmas|^epiphany|^transfiguration$/.test(k)],
  ['CUARESMA Y SEMANA SANTA', k => /^ashWednesday|^lent|^palm|^holyWeek|^maundy|^goodFriday|^holySaturday/.test(k)],
  ['PASCUA, ASCENSIÓN, PENTECOSTÉS Y TRINIDAD', k => /^easter|^ascension|^pentecost|^trinity/.test(k)],
  ['DOMINGOS DESPUÉS DE PENTECOSTÉS (PROPIOS)', k => /^proper\d+$/.test(k)],
  ['SANTORAL FIJO', k => /^\d\d-\d\d$/.test(k)],
];
const num = k => +(k.match(/\d+/g) || [0]).join('');
let body = '', used = new Set();
for (const [title, test] of SECTIONS) {
  const keys = Object.keys(out).filter(k => test(k) && !used.has(k));
  keys.forEach(k => used.add(k));
  if (!keys.length) continue;
  body += `\n    // ═══════════════ ${title} ═══════════════\n`;
  for (const k of keys) {
    const e = out[k], oe = old[k];
    const kk = /^\d\d-\d\d$/.test(k) ? `'${k}'` : k;
    if (e.all) body += `    ${kk}: { all: ${line(e.all, oe, 'all')} },\n`;
    else body += `    ${kk}: {\n` + ['A', 'B', 'C'].map(c => `      ${c}: ${line(e[c], oe, c)},\n`).join('') + `    },\n`;
  }
}
const leftover = Object.keys(out).filter(k => !used.has(k));
if (leftover.length) throw new Error('claves sin sección: ' + leftover.join(', '));

const HEADER = `/**
 * lectionary.js — Leccionario Dominical, de Días Santos y Conmemorativo
 * Libro de Oración Común (2019), ACNA
 *
 * FUENTE: transcrito de la tabla «Sunday, Holy Day, and Commemoration
 * Lectionary» del libro (pp. 717-733), contrastado con el PDF oficial. Sustituye
 * a la tabla anterior, que se reconstruyó de memoria a partir del Leccionario
 * Común Revisado y coincidía con el libro en menos de la mitad de las lecturas.
 *
 * CÓMO SE LEYÓ EL LIBRO (decisiones reversibles, hechas al generar este archivo):
 *  - Las citas conservan la NUMERACIÓN del libro (inglesa). La conversión a la de
 *    la Biblia de Jerusalén (hebrea) se hace al leer el texto: ver
 *    VERSE_SHIFTS/toBibliaPieces en utils.js. Aquí no hay ninguna conversión.
 *  - Los versículos opcionales, entre paréntesis en el libro, se INCLUYEN.
 *  - Los sufijos a/b de medio versículo se descartan (se lee el versículo entero).
 *  - Cuando el libro ofrece alternativas («A or B») se toma la PRIMERA; en los
 *    salmos («Ps 80 or 80:1-7v»: el salmo completo o una porción) se toma la
 *    porción más corta. El sufijo «v» (numeración del Salterio Coverdale) se
 *    descarta: los salmos se leen con la numeración inglesa de la Biblia de
 *    Jerusalén. Pendiente: leerlos del Salterio español del propio libro.
 *  - Los Propios 1 y 2 solo se usan en días de semana (el libro los llama
 *    «Weekdays»): ningún domingo cae en esas fechas.
 *  - NO incluidos (el calendario no los emite): Navidad Día II y III, Misa de la
 *    Aurora y de la tarde de Pascua, Vigilia Pascual, Liturgia de las Palmas,
 *    Domingo de Misión Mundial, Témporas, Rogativas, Acción de Gracias, días
 *    nacionales y Comunes.
 *  - Lunes, Martes y Miércoles Santos: lecturas propias del libro. Antes eran las
 *    del Misal Romano, elegidas cuando se creía que el libro no las asignaba; el
 *    usuario pidió pasar a las oficiales el 2026-10-31.
 *  - Las antífonas de salmo (psalmAnt) se conservaron SOLO donde el salmo no
 *    cambió respecto de la tabla anterior.
 *
 * Formato de referencia: en inglés (compatible con js/lib/biblia-wrapper.js y
 * translateBibleReference), p.ej. "Genesis 1:1-5".
 * Regenerar: ver bcp2019-tools/build-lectionary.js.
 */

const BCPLectionary = (() => {

  const SUNDAY = {
`;
const FOOTER = `  };

  function getSundayReadings(key, cycle) {
    const entry = SUNDAY[key];
    if (!entry) return null;
    return entry.all || entry[cycle] || entry.A || null;
  }

  return { SUNDAY, getSundayReadings };
})();
`;
if (require.main === module && process.argv[2] !== '--diag') {
  fs.writeFileSync(process.argv[2] || OLD, HEADER + body + FOOTER, 'utf8');
  console.log('claves:', Object.keys(out).length, '| antífonas conservadas:', stats.antKept, '| descartadas:', stats.antDropped, '| notas:', notes.join(' ; '));
}
module.exports = { out, notes, pick, normOne, readingSet, OLD };

