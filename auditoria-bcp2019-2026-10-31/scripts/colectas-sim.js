// Auditoria COLECTAS BCP2019 - simulacion. SOLO LECTURA sobre el repo.
const fs = require('fs');
const vm = require('vm');
const H = require('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/harness.js');
const C = H.load();
const { BCPCalendar, BCPPropers } = C;

// --- Extraer del app.js REAL las funciones getPreviousSunday / resolveCollectKey (no copiadas a mano)
const appSrc = fs.readFileSync('C:/Users/gonza/OneDrive/Desktop/liturgia/bcp2019/js/app.js', 'utf8');
const i0 = appSrc.indexOf('function getPreviousSunday');
const i1 = appSrc.indexOf('function resolveLectionaryKey');
const j0 = appSrc.indexOf('function resolveCollectKey');
const j1 = appSrc.indexOf('// ══', j0);
const code = appSrc.slice(i0, i1) + '\n' + appSrc.slice(j0, j1);
const ctx = { Date, BCPCalendar, BCPPropers };
vm.createContext(ctx);
vm.runInContext(code + '\n;this.getPreviousSunday=getPreviousSunday;this.resolveCollectKey=resolveCollectKey;', ctx);
const resolveCollectKey = ctx.resolveCollectKey;

const COL = BCPPropers.COLLECTS;
const FALLBACK = BCPPropers.getCollect('__zzz__');

function seasonOfKey(k) {
  if (!k) return '?';
  if (/^advent/.test(k)) return 'advent';
  if (/^christmas|^circumcision|^\d\d-\d\d$/.test(k)) return /^\d\d-\d\d$/.test(k) ? 'santoral' : 'christmas';
  if (/^epiphany|^transfiguration/.test(k)) return 'epiphany';
  if (/^lent|^ashWednesday/.test(k)) return 'lent';
  if (/^palmSunday|^maundy|^goodFriday|^holySaturday|^holyWeek/.test(k)) return 'holyWeek';
  if (/^easter|^ascension/.test(k)) return 'easter';
  if (/^pentecost|^trinity/.test(k)) return 'pentecost';
  if (/^proper/.test(k)) return 'ordinary';
  return '?';
}

function runYear(y, verbose) {
  const rows = [];
  for (let m = 0; m < 12; m++) {
    const dim = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= dim; d++) {
      const date = new Date(y, m, d, 12, 0, 0);
      const di = BCPCalendar.getDay(date);
      const ck = resolveCollectKey(di, date);
      let mode;
      if (COL[di.key]) mode = 'propia';
      else if (COL[ck]) mode = 'domingo-precedente';
      else mode = 'RESPALDO-generico';
      rows.push({ date, iso: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`, dow: date.getDay(), key: di.key, nameEs: di.nameEs, season: di.season, rank: di.rank, ck, mode, isFixed: !!di.isFixed });
    }
  }
  return rows;
}

module.exports = { C, BCPCalendar, BCPPropers, resolveCollectKey, runYear, seasonOfKey, COL, FALLBACK };

if (require.main === module) {
  const out = {};
  for (const y of [2026, 2027]) {
    const rows = runYear(y);
    const cnt = {};
    rows.forEach(r => cnt[r.mode] = (cnt[r.mode] || 0) + 1);
    out[y] = { n: rows.length, cnt };
    // sub-desglose: domingos vs ferias vs fiestas
    const bySub = {};
    rows.forEach(r => {
      const k = (r.dow === 0 ? 'domingo' : (r.isFixed ? 'fiesta-fija' : 'feria-otro')) + '/' + r.mode;
      bySub[k] = (bySub[k] || 0) + 1;
    });
    out[y].bySub = bySub;
  }
  console.log(JSON.stringify(out, null, 1));
}
