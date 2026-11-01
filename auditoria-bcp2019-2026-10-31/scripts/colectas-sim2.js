// Barrido amplio 2024-2060: claves emitidas por el calendario vs COLLECTS; huerfanas; respaldo generico.
const S = require('./colectas-sim.js');
const { BCPCalendar, BCPPropers, resolveCollectKey, COL, FALLBACK } = S;

const emitted = {};      // key -> {n, dowSet:Set, hasCollect}
let totalDays = 0, nRespaldo = 0, nPropia = 0, nDomingo = 0;
const respaldoEj = [];
const sundayNoCollect = {};   // key -> n (domingos/fiestas cuya clave propia no tiene colecta)
const modeByYear = {};
for (let y = 2024; y <= 2060; y++) {
  for (let m = 0; m < 12; m++) {
    const dim = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= dim; d++) {
      const date = new Date(y, m, d, 12, 0, 0);
      const di = BCPCalendar.getDay(date);
      totalDays++;
      const e = emitted[di.key] || (emitted[di.key] = { n: 0, dows: new Set(), ejemplo: null });
      e.n++; e.dows.add(date.getDay()); if (!e.ejemplo) e.ejemplo = `${y}-${m + 1}-${d}`;
      const ck = resolveCollectKey(di, date);
      if (COL[di.key]) nPropia++;
      else if (COL[ck]) nDomingo++;
      else { nRespaldo++; if (respaldoEj.length < 10) respaldoEj.push(`${y}-${m + 1}-${d} ${di.key}`); }
      if (date.getDay() === 0 && !COL[di.key]) sundayNoCollect[di.key] = (sundayNoCollect[di.key] || 0) + 1;
    }
  }
}
console.log('dias', totalDays, 'propia', nPropia, 'domingo-prec', nDomingo, 'respaldo', nRespaldo, respaldoEj);
console.log('DOMINGOS sin colecta propia (usan la del domingo anterior en silencio):', sundayNoCollect);

// claves de COLLECTS nunca emitidas por el calendario
const never = Object.keys(COL).filter(k => !emitted[k]);
console.log('COLLECTS nunca emitidas (huerfanas):', never);
console.log('n claves COLLECTS:', Object.keys(COL).length, ' fijas:', Object.keys(COL).filter(k => /^\d\d-\d\d$/.test(k)).length);

// Claves emitidas que NO son colecta propia, agrupadas por patron
const noCol = {};
for (const [k, e] of Object.entries(emitted)) if (!COL[k]) {
  const pat = k.replace(/\d+/g, 'N');
  noCol[pat] = noCol[pat] || { claves: 0, dias: 0, ej: k };
  noCol[pat].claves++; noCol[pat].dias += e.n;
}
console.log('claves emitidas sin colecta propia, por patron:', noCol);

// FIXED_FEASTS vs COLLECTS
const ff = Object.keys(BCPCalendar.FIXED_FEASTS);
console.log('FIXED_FEASTS:', ff.length, ' sin colecta:', ff.filter(k => !COL[k]), ' colectas fijas sin fiesta:', Object.keys(COL).filter(k => /^\d\d-\d\d$/.test(k) && !ff.includes(k)));

// Domingos de Epifanía emitidos (numeracion maxima)
console.log('claves epiphany*:', Object.keys(emitted).filter(k => /^epiphany|^transf/.test(k)).sort());
console.log('claves proper* dom:', Object.keys(emitted).filter(k => /^proper\d+$/.test(k)).sort((a, b) => a.slice(6) - b.slice(6)).join(','));
