// Barrido antes/después de las correcciones de lógica del BCP 2019.
// Carga los módulos REALES de bcp2019/js (incluido app.js con un document falso)
// y registra, por día, qué elige el app. Uso: node drive.js <salida.json>
const fs = require('fs');
const vm = require('vm');
const ROOT = 'C:/Users/gonza/OneDrive/Desktop/liturgia/bcp2019/js/';
const FILES = ['calendar.js', 'lectionary.js', 'propers.js', 'eucharist.js', 'utils.js', 'app.js'];

function load() {
  const doc = { addEventListener() {}, getElementById() { return null; } };
  const ctx = { console, Date, Math, JSON, Object, Array, String, Number, RegExp, Map, Set, Promise, document: doc };
  ctx.window = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of FILES) vm.runInContext(fs.readFileSync(ROOT + f, 'utf8') + '\n;', ctx, { filename: f });
  const get = n => vm.runInContext(n, ctx);
  return { ctx, get };
}

function sweep() {
  const { get } = load();
  const Cal = get('BCPCalendar'), L = get('BCPLectionary'), P = get('BCPPropers');
  const resColl = get('resolveCollectKey'), resLect = get('resolveLectionaryKey');
  const rows = [];
  for (let d = new Date(2024, 0, 1, 12); d.getFullYear() <= 2060; d.setDate(d.getDate() + 1)) {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
    const info = Cal.getDay(date);
    const lk = resLect(info, date);
    const ck = resColl(info, date);
    rows.push({
      d: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      dow: date.getDay(), key: info.key, name: info.name, rank: info.rank, season: info.season,
      ck, lk: lk.key, borrowed: !!lk.borrowedFromSunday,
    });
  }
  return rows;
}
module.exports = { load, sweep };
if (require.main === module) {
  const out = process.argv[2];
  const rows = sweep();
  fs.writeFileSync(out, JSON.stringify(rows));
  console.log('días:', rows.length, '->', out);
}
