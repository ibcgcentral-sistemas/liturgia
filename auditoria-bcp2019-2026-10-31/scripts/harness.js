// Arnés compartido de auditoría — BCP 2019. SOLO LECTURA: no modifica el repo.
// Uso:  const H = require('<este archivo>'); const C = H.load(); C.BCPCalendar.getDay(new Date(2026,9,31,12))
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = 'C:/Users/gonza/OneDrive/Desktop/liturgia/bcp2019/js/';
// Orden igual que bcp2019/index.html (sin app.js/manual/librito/docx: tocan el DOM)
const FILES = ['calendar.js', 'lectionary.js', 'propers.js', 'eucharist.js', 'utils.js'];

function load() {
  const ctx = { console, Date, Math, JSON, Object, Array, String, Number, RegExp, Map, Set, Promise };
  ctx.window = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of FILES) {
    // `const X = ...` de nivel superior no se cuelga del contexto: se re-exporta al final.
    vm.runInContext(fs.readFileSync(ROOT + f, 'utf8') + '\n;', ctx, { filename: f });
  }
  // Las declaraciones `const` globales viven en el scope del contexto; las exponemos:
  const names = ['BCPCalendar', 'BCPLectionary', 'BCPPropers', 'BCPEucharist', 'translateBibleReference', 'shouldOmitGloria', 'GLORIA_OMITTED_RUBRIC', 'getColorName', 'getRankName'];
  const out = {};
  for (const n of names) {
    try { out[n] = vm.runInContext(`typeof ${n} !== 'undefined' ? ${n} : undefined`, ctx); } catch (e) { out[n] = undefined; }
  }
  return out;
}
module.exports = { load };

if (require.main === module) {
  const C = load();
  for (const k of Object.keys(C)) console.log(k, typeof C[k]);
  const d = new Date(2026, 9, 31, 12);
  console.log(JSON.stringify(C.BCPCalendar.getDay(d)));
}
