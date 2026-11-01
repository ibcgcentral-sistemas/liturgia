// sim_lib.js — Cargador ampliado para la auditoría por simulación del BCP 2019.
// SOLO LECTURA sobre el repo. Carga en un contexto vm:
//   calendar, lectionary, propers, eucharist, utils, app (con document falso),
//   la Biblia de Jerusalén real (biblia-de-jerusalen.min.js + biblia-wrapper.js),
//   manual.js y librito-pueblo.js (opcional).
// Uso:  const L = require('./sim_lib'); const C = L.load();  C.generateLiturgy(date) ...
'use strict';
const fs = require('fs');
const vm = require('vm');

const REPO = 'C:/Users/gonza/OneDrive/Desktop/liturgia/';
const BCP = REPO + 'bcp2019/js/';
const LIB = REPO + 'js/lib/';

function noopEl() {
  const el = {
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    style: {}, addEventListener() {}, appendChild() {}, remove() {}, querySelector() { return null; },
    querySelectorAll() { return []; }, setAttribute() {}, scrollIntoView() {},
    set innerHTML(v) { this._h = v; }, get innerHTML() { return this._h || ''; },
    value: '', textContent: '',
  };
  return el;
}

function load(opts = {}) {
  const warns = [];
  const logs = [];
  const fakeConsole = {
    log: (...a) => logs.push(a.join(' ')),
    warn: (...a) => warns.push(a.map(x => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ')),
    error: (...a) => warns.push('ERROR ' + a.map(x => (typeof x === 'string' ? x : String(x))).join(' ')),
    info() {}, debug() {},
  };
  const ctx = {
    console: fakeConsole, Date, Math, JSON, Object, Array, String, Number, RegExp, Map, Set, Promise,
    Boolean, Error, parseInt, parseFloat, isNaN, setTimeout, clearTimeout, Symbol, Intl,
  };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
  ctx.document = {
    addEventListener() {}, getElementById: () => noopEl(), querySelectorAll: () => [], querySelector: () => null,
    createElement: () => noopEl(), body: noopEl(),
  };
  ctx.navigator = {};
  vm.createContext(ctx);

  // 1) Biblia de Jerusalén real (módulo CJS) -> window._BibliaInstance
  if (opts.bible !== false) {
    const src = fs.readFileSync(LIB + 'biblia-de-jerusalen.min.js', 'utf8');
    const _module = { exports: {} };
    new Function('module', 'exports', src)(_module, _module.exports);
    const BibliaClass = _module.exports.Bible;
    ctx._BibliaInstance = new BibliaClass();
    // biblia-wrapper.js (IIFE que define window.BibliaJerusalen)
    vm.runInContext(fs.readFileSync(LIB + 'biblia-wrapper.js', 'utf8') + '\n;', ctx, { filename: 'biblia-wrapper.js' });
  }

  const files = ['calendar.js', 'lectionary.js', 'propers.js', 'eucharist.js', 'utils.js', 'app.js', 'manual.js', 'librito-pueblo.js'];
  for (const f of files) {
    vm.runInContext(fs.readFileSync(BCP + f, 'utf8') + '\n;', ctx, { filename: f });
  }

  const names = ['BCPCalendar', 'BCPLectionary', 'BCPPropers', 'BCPEucharist', 'BCPLibrito', 'translateBibleReference',
    'shouldOmitGloria', 'GLORIA_OMITTED_RUBRIC', 'getColorName', 'getRankName', 'getGospelAuthor',
    'getPreviousSunday', 'resolveLectionaryKey', 'resolveCollectKey', 'buildLiturgyHTML', 'generateLiturgy',
    'fetchScripture', 'formatLiturgyDate'];
  const out = { warns, logs, ctx };
  for (const n of names) {
    try { out[n] = vm.runInContext(`typeof ${n} !== 'undefined' ? ${n} : undefined`, ctx); } catch (e) { out[n] = undefined; }
  }
  out.getState = () => vm.runInContext('currentMassState', ctx);
  out.Biblia = ctx.BibliaJerusalen;
  out.bible = ctx._BibliaInstance;
  return out;
}

// Fecha a las 12:00 local
const D = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0);
function* eachDay(y0, y1) {
  for (let t = D(y0, 1, 1); t.getFullYear() <= y1; t = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1, 12, 0, 0)) yield t;
}
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

module.exports = { load, D, eachDay, iso, REPO, BCP, LIB };

if (require.main === module) {
  const C = load();
  console.log('Biblia libros:', C.bible.getAllBooks().length);
  const dayInfo = C.BCPCalendar.getDay(D(2026, 10, 31));
  console.log(JSON.stringify(dayInfo));
  C.generateLiturgy(D(2026, 10, 31)).then(h => {
    console.log('HTML len', h.length, 'state keys', Object.keys(C.getState()));
    console.log('warns', C.warns.length);
  });
}
