// Casos de borde: Todos los Santos en domingo, 1 ene en domingo, fiestas fijas en domingo, uso de claves en 2026-2027
const S = require('./colectas-sim.js');
const { BCPCalendar, resolveCollectKey, COL } = S;
const ff = Object.keys(BCPCalendar.FIXED_FEASTS);

const allSaintsSun = [], jan1Sun = [];
const ffSunday = { 2026: [], 2027: [] };
let ffSundayTotal = 0, ffSundayPrincipal = 0;
const useCount = { 2026: {}, 2027: {} };
const dec24 = [];
for (let y = 2024; y <= 2060; y++) {
  for (const md of ff) {
    const [mm, dd] = md.split('-').map(Number);
    const d = new Date(y, mm - 1, dd, 12);
    if (d.getDay() === 0) {
      ffSundayTotal++;
      const di = BCPCalendar.getDay(d);
      if (md === '11-01') allSaintsSun.push(y + ' -> app muestra ' + di.key);
      if (y === 2026 || y === 2027) ffSunday[y].push(`${md} ${BCPCalendar.FIXED_FEASTS[md].nameEs} -> app muestra ${di.key}`);
    }
  }
  const j = new Date(y, 0, 1, 12);
  if (j.getDay() === 0) jan1Sun.push(`${y}-01-01 -> app: ${BCPCalendar.getDay(j).key}`);
}
for (const y of [2026, 2027]) {
  for (let m = 0; m < 12; m++) {
    const dim = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= dim; d++) {
      const date = new Date(y, m, d, 12);
      const di = BCPCalendar.getDay(date);
      const ck = resolveCollectKey(di, date);
      useCount[y][ck] = (useCount[y][ck] || 0) + 1;
      if (m === 11 && d === 24) dec24.push(`${y}-12-24 ${di.nameEs} -> ${ck}`);
    }
  }
}
console.log('Todos los Santos (1 nov) en domingo 2024-2060:', allSaintsSun);
console.log('1 de enero en domingo (=> Navidad cayó en domingo):', jan1Sun);
console.log('fiestas fijas en domingo 2024-2060 (total, el domingo prevalece):', ffSundayTotal);
console.log('fiestas fijas en domingo 2026:', ffSunday[2026]);
console.log('fiestas fijas en domingo 2027:', ffSunday[2027]);
console.log('24 dic:', dec24);
console.log('claves de colecta usadas 2026 (top):', Object.entries(useCount[2026]).sort((a, b) => b[1] - a[1]).slice(0, 12));
const d = new Date(2026, 10, 1, 12); console.log('1 nov 2026 dow=', d.getDay(), BCPCalendar.getDay(d).key);
const t = new Date(2026, 9, 31, 12); console.log('31 oct 2026 dow=', t.getDay(), BCPCalendar.getDay(t).key, resolveCollectKey(BCPCalendar.getDay(t), t));
