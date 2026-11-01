// sim_tz.js — firma del calendario 2024-2060 bajo una zona horaria dada (un proceso por zona).
// Uso: node sim_tz.js America/Santiago     (el TZ se fija antes de crear ningún Date)
process.env.TZ = process.argv[2] || 'UTC';
const crypto = require('crypto');
const L = require('./sim_lib');
const C = L.load({ bible: false });
const h = crypto.createHash('sha1'); let n = 0;
for (let y = 2024; y <= 2060; y++) for (let m = 0; m < 12; m++) for (let d = 1; d <= 31; d++) {
  const t = new Date(y, m, d, 12, 0, 0); if (t.getMonth() !== m) continue;
  const g = C.BCPCalendar.getDay(t);
  const lk = C.resolveLectionaryKey(g, t); const ck = C.resolveCollectKey(g, t);
  h.update(`${y}-${m}-${d}|${g.key}|${g.season}|${g.cycle}|${g.color}|${g.nameEs}|${lk.key}|${lk.cycle}|${ck};`); n++;
}
console.log(`${process.argv[2]} tz=${Intl.DateTimeFormat().resolvedOptions().timeZone} off(jul)=${new Date(2026,6,1,12).getTimezoneOffset()} off(ene)=${new Date(2026,0,1,12).getTimezoneOffset()} firma=${h.digest('hex').slice(0, 12)} (${n} días)`);
