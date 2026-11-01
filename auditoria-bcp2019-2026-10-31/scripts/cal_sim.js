// Auditoría calendario — barridos estructurales (2001-2120 y 2024-2060). SOLO LECTURA.
const H = require('../harness.js');
const C = H.load();
const Cal = C.BCPCalendar;
const Lect = C.BCPLectionary;
const Prop = C.BCPPropers;

const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const mk = (y, m, d) => new Date(y, m, d, 12);
const addD = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);
function* days(y0, y1) { for (let d = mk(y0, 0, 1); d.getFullYear() <= y1; d = addD(d, 1)) yield d; }
const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// ── réplica EXACTA de app.js:29-54 (resolución de lecturas/colecta de ferias) ──
function getPreviousSunday(date) { const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12); d.setDate(d.getDate() - d.getDay()); return d; }
function resolveLectionaryKey(dayInfo, date) {
  if (Lect.SUNDAY[dayInfo.key]) return { key: dayInfo.key, borrowed: false };
  if (dayInfo.key && dayInfo.key.startsWith('holyWeekFeria')) return { key: null, borrowed: false };
  const prev = Cal.getDay(getPreviousSunday(date));
  if (Lect.SUNDAY[prev.key]) return { key: prev.key, borrowed: true };
  return { key: null, borrowed: false };
}
function resolveCollectKey(dayInfo, date) {
  if (Prop.COLLECTS[dayInfo.key]) return dayInfo.key;
  const prev = Cal.getDay(getPreviousSunday(date));
  if (Prop.COLLECTS[prev.key]) return prev.key;
  return dayInfo.key;
}

const out = {};

// ════ A. Sanidad de claves 2001-2120 ════
{
  let n = 0, bad = [], fallback = 0, keys = new Map();
  for (const d of days(2001, 2120)) {
    const r = Cal.getDay(d); n++;
    if (!r || /null|undefined|NaN/.test(String(r.key)) || !r.name || !r.nameEs) bad.push(iso(d) + ' ' + JSON.stringify(r));
    if (r.key === 'feria') fallback++;
    keys.set(r.key, (keys.get(r.key) || 0) + 1);
  }
  console.log(`[A] días 2001-2120: ${n}; claves rotas: ${bad.length}; fallback 'feria': ${fallback}; claves distintas: ${keys.size}`);
  if (bad.length) console.log(bad.slice(0, 10).join('\n'));
  // cobertura de claves en leccionario y colectas (solo claves de DOMINGO/FIESTA, no ferias)
  const noLect = [], noColl = [];
  for (const [k, c] of keys) {
    if (/Feria/.test(k) || k === 'feria') continue;
    if (!Lect.SUNDAY[k]) noLect.push(`${k}(${c})`);
    if (!Prop.COLLECTS[k]) noColl.push(`${k}(${c})`);
  }
  console.log('[A] claves no-feria sin lecciones en BCPLectionary.SUNDAY:', noLect.join(', ') || 'ninguna');
  console.log('[A] claves no-feria sin colecta en BCPPropers.COLLECTS:', noColl.join(', ') || 'ninguna');
  const ferias = [...keys.keys()].filter(k => /Feria/.test(k)).map(k => k.replace(/_\d$/, '').replace(/\d+$/, 'N'));
  out.keyFamilies = [...new Set(ferias)];
  console.log('[A] familias de clave de feria:', out.keyFamilies.join(', '));
  out.allKeys = [...keys.keys()];
}

// ════ B. Fiestas principales cada año 2001-2120 ════
{
  const need = ['easter', 'ascension', 'pentecost', 'trinitySunday', 'christmas', 'epiphany'];
  let miss = 0, asRank = {};
  const allSaintsLost = [];
  for (let y = 2001; y <= 2120; y++) {
    const F = Cal.getFeastDates(y);
    const probe = {
      easter: F.easter, ascension: F.ascension, pentecost: F.pentecost, trinitySunday: F.trinitySunday,
      christmas: mk(y, 11, 25), epiphany: mk(y, 0, 6),
    };
    for (const k of need) { const r = Cal.getDay(probe[k]); if (r.key !== k) { miss++; } asRank[k] = r.rank; }
    const as = Cal.getDay(mk(y, 10, 1));
    if (as.key !== '11-01') allSaintsLost.push(`${y} (${DOW[mk(y, 10, 1).getDay()]}) -> ${as.key}`);
    asRank['11-01'] = as.rank;
  }
  console.log('[B] fiestas principales perdidas (excepto Todos los Santos) 2001-2120:', miss, '| rango emitido:', JSON.stringify(asRank));
  console.log('[B] años 2001-2120 en que 1-nov NO sale como 11-01:', allSaintsLost.length, 'de 120');
  const a2460 = allSaintsLost.filter(s => +s.slice(0, 4) >= 2024 && +s.slice(0, 4) <= 2060);
  console.log('[B] ... dentro de 2024-2060:', a2460.length, 'de 37 ->', a2460.join('; '));
  out.allSaintsLost = allSaintsLost;
  const nov1 = Cal.getDay(mk(2026, 10, 1));
  console.log('[B] 2026-11-01 (domingo):', JSON.stringify(nov1));
}

// ════ C. Fiestas fijas: qué ocurre con cada aparición 2024-2060 ════
{
  const FF = Cal.FIXED_FEASTS;
  const res = {}; // md -> {shown, sunday:{season->n}, moved, other:[...]}
  const totals = { shown: 0, sunday: 0, moved: 0, other: 0, total: 0 };
  const sundayBySeason = {};
  const sundayList = [];
  const otherList = [];
  for (let y = 2024; y <= 2060; y++) {
    for (const md of Object.keys(FF)) {
      const [mm, dd] = md.split('-').map(Number);
      const d = mk(y, mm - 1, dd);
      const r = Cal.getDay(d);
      totals.total++;
      const o = res[md] = res[md] || { shown: 0, sunday: 0, moved: 0, other: 0 };
      if (r.key === md && r.isFixed) { o.shown++; totals.shown++; continue; }
      if (d.getDay() === 0) {
        o.sunday++; totals.sunday++;
        sundayBySeason[r.season] = (sundayBySeason[r.season] || 0) + 1;
        sundayList.push({ y, md, key: r.key, season: r.season, date: iso(d) });
        continue;
      }
      const T = Cal.getTransferredFeasts(y);
      if (T.from.has(md)) { o.moved++; totals.moved++; continue; }
      o.other++; totals.other++; otherList.push(`${iso(d)} ${md} -> ${r.key}`);
    }
  }
  console.log('[C] apariciones de fiestas fijas 2024-2060:', JSON.stringify(totals));
  console.log('[C] suprimidas por caer en domingo, por temporada del domingo:', JSON.stringify(sundayBySeason));
  console.log('[C] otras (no domingo, no trasladadas, no mostradas):', otherList.length, otherList.slice(0, 20).join(' | '));
  // desglose por fiesta
  const lines = Object.entries(res).map(([md, o]) => `${md}: mostrada ${o.shown}, domingo ${o.sunday}, trasladada ${o.moved}, otra ${o.other}`);
  console.log(lines.join('\n'));
  out.sundayList = sundayList;
  // ¿qué clave ocupa el domingo cuando suprime?
  const byKey = {};
  for (const s of sundayList) byKey[s.key.replace(/\d+$/, 'N')] = (byKey[s.key.replace(/\d+$/, 'N')] || 0) + 1;
  console.log('[C] claves que ocupan el domingo:', JSON.stringify(byKey));
  // Domingos en que la fiesta suprimida cae fuera de Adviento/Cuaresma/Pascua (libro: "may be observed on that Sunday or transferred")
  const free = sundayList.filter(s => !['advent', 'lent', 'holyWeek', 'easter'].includes(s.season));
  console.log('[C] ... de ellas, fuera de Adviento/Cuaresma/Semana Santa/Pascua (el libro permite observar o trasladar):', free.length, 'de', sundayList.length);
  const freeByMd = {};
  free.forEach(s => freeByMd[s.md] = (freeByMd[s.md] || 0) + 1);
  console.log('[C] ... por fiesta:', JSON.stringify(freeByMd));
  const by2627 = sundayList.filter(s => s.y === 2026 || s.y === 2027);
  console.log('[C] 2026-2027:', by2627.map(s => `${s.date} ${s.md}->${s.key}(${s.season})`).join(' | '));
}

// ════ D. Traslados (Semana Santa / Semana de Pascua) 2024-2060 ════
{
  let nT = 0, yrs = 0; const list = []; let problems = [];
  for (let y = 2024; y <= 2060; y++) {
    const T = Cal.getTransferredFeasts(y);
    if (T.from.size) yrs++;
    for (const [md, dest] of T.from) {
      nT++;
      const [mm, dd] = md.split('-').map(Number);
      const orig = Cal.getDay(mk(y, mm - 1, dd));
      const tgt = Cal.getDay(dest);
      list.push(`${iso(mk(y, mm - 1, dd))} (${DOW[mk(y, mm - 1, dd).getDay()]}) ${md} -> ${iso(dest)} (${DOW[dest.getDay()]}) [destino: ${tgt.key}${tgt.isTransferred ? ',trasl' : ''}; origen: ${orig.key}]`);
      if (!tgt.isTransferred) problems.push('destino sin marca ' + iso(dest));
      if (orig.key === md) problems.push('origen aún muestra la fiesta ' + iso(mk(y, mm - 1, dd)));
    }
  }
  console.log(`[D] traslados 2024-2060: ${nT} fiestas en ${yrs} años; anomalías: ${problems.length}`);
  console.log(list.join('\n'));
}

// ════ E. Propio de las ferias: fecha del día vs. Domingo de su semana ════
{
  let tot = 0, mism = 0; const ex = [];
  let wkTrin = 0, wkTrinN = 0;
  for (let y = 2024; y <= 2060; y++) {
    const F = Cal.getFeastDates(y);
    for (let d = addD(F.trinitySunday, 1); d < F.advent1; d = addD(d, 1)) {
      if (d.getDay() === 0) continue;
      const r = Cal.getDay(d);
      if (!/^properFeria/.test(r.key)) continue;
      tot++;
      const sun = getPreviousSunday(d);
      const pn = Cal.getProperNumber(d), sn = Cal.getProperNumber(sun);
      // la semana de Cristo Rey (Propio 29) se extiende hasta el 3 dic: ambos devuelven 29
      if (pn !== sn) { mism++; if (ex.length < 6) ex.push(`${iso(d)} (${DOW[d.getDay()]}) feria usa Propio ${pn}; su domingo ${iso(sun)} es Propio ${sn}`); }
    }
  }
  console.log(`[E] ferias después de Trinidad 2024-2060: ${tot} días; Propio por fecha ≠ Propio del domingo de su semana: ${mism} (${(100 * mism / tot).toFixed(1)}%)`);
  console.log(ex.join('\n'));
  // ¿Importa? qué se usa realmente: colecta/lecturas vía domingo previo
  const sample = mk(2026, 5, 4); // jueves después de Trinidad 2026 (31-may)
}

// ════ F. Reglas "el día siguiente usa la colecta/lecciones de X" del libro vs. app ════
{
  function show(label, d) {
    const r = Cal.getDay(d);
    const lk = resolveLectionaryKey(r, d), ck = resolveCollectKey(r, d);
    return `${label} ${iso(d)} (${DOW[d.getDay()]}) clave=${r.key} | lecturas=${lk.key}${lk.borrowed ? '(prestadas)' : ''} | colecta=${ck}`;
  }
  // F1. Jueves-sábado después de Miércoles de Ceniza (libro 16987-16988)
  console.log('[F1] Jue-Sáb tras Ceniza, ej. 2026:');
  for (let i = 1; i <= 3; i++) console.log('   ' + show('', addD(Cal.getFeastDates(2026).ashWednesday, i)));
  let f1 = 0, f1n = 0;
  for (let y = 2024; y <= 2060; y++) for (let i = 1; i <= 3; i++) {
    const d = addD(Cal.getFeastDates(y).ashWednesday, i); const r = Cal.getDay(d); f1n++;
    const lk = resolveLectionaryKey(r, d), ck = resolveCollectKey(r, d);
    if (lk.key !== 'ashWednesday' || ck !== 'ashWednesday') f1++;
  }
  console.log(`[F1] 2024-2060: ${f1} de ${f1n} días (Jue-Sáb tras Ceniza) no usan colecta/lecciones de Miércoles de Ceniza`);
  // F2. Viernes-sábado después de la Ascensión (libro 17230-17231)
  console.log('[F2] Vie-Sáb tras Ascensión, ej. 2026:');
  for (let i = 1; i <= 2; i++) console.log('   ' + show('', addD(Cal.getFeastDates(2026).ascension, i)));
  let f2 = 0, f2n = 0;
  for (let y = 2024; y <= 2060; y++) for (let i = 1; i <= 2; i++) {
    const d = addD(Cal.getFeastDates(y).ascension, i); const r = Cal.getDay(d);
    if (Cal.getDay(d).isFixed) continue; f2n++;
    const lk = resolveLectionaryKey(r, d), ck = resolveCollectKey(r, d);
    if (lk.key !== 'ascension' || ck !== 'ascension') f2++;
  }
  console.log(`[F2] 2024-2060: ${f2} de ${f2n} días (Vie/Sáb tras Ascensión sin fiesta propia) no usan colecta/lecciones de la Ascensión`);
  // F3. Ferias entre Pentecostés y Trinidad y después de Trinidad (libro 17262-17269)
  let f3 = 0, f3n = 0, f3t = 0, f3tn = 0;
  for (let y = 2024; y <= 2060; y++) {
    const F = Cal.getFeastDates(y);
    for (let i = 1; i <= 6; i++) {
      const d = addD(F.pentecost, i); const r = Cal.getDay(d); if (r.isFixed) continue; f3n++;
      const ck = resolveCollectKey(r, d); if (ck === 'pentecost') f3++;
    }
    for (let i = 1; i <= 6; i++) {
      const d = addD(F.trinitySunday, i); const r = Cal.getDay(d); if (r.isFixed) continue; f3tn++;
      const ck = resolveCollectKey(r, d); if (ck === 'trinitySunday') f3t++;
    }
  }
  console.log(`[F3] ferias tras Pentecostés (sin fiesta propia) 2024-2060: ${f3} de ${f3n} usan la colecta de Pentecostés (el libro lo prohíbe: "not used on the following weekdays")`);
  console.log(`[F3] ferias tras Trinidad: ${f3t} de ${f3tn} usan la colecta de Trinidad (el libro lo prohíbe)`);
  console.log('   ' + show('', addD(Cal.getFeastDates(2026).pentecost, 1)));
  console.log('   ' + show('', addD(Cal.getFeastDates(2026).trinitySunday, 1)));
  console.log('   ' + show('', addD(Cal.getFeastDates(2026).trinitySunday, 5)));
  // lecturas también
  let f3l = 0;
  for (let y = 2024; y <= 2060; y++) { const F = Cal.getFeastDates(y); for (let i = 1; i <= 6; i++) { for (const base of [F.pentecost, F.trinitySunday]) { const d = addD(base, i); const r = Cal.getDay(d); if (r.isFixed) continue; const lk = resolveLectionaryKey(r, d); if (lk.key === 'pentecost' || lk.key === 'trinitySunday') f3l++; } } }
  console.log(`[F3] lecturas prestadas de Pentecostés/Trinidad en ferias siguientes: ${f3l}`);
  // F4. Días entre los Santos Inocentes y el 1.er domingo de Navidad (libro 16832-16834)
  let f4 = 0, f4n = 0; const f4ex = [];
  for (let y = 2024; y <= 2060; y++) {
    for (let day = 29; day <= 31; day++) {
      const d = mk(y, 11, day); if (d.getDay() === 0) continue;
      const prevSun = getPreviousSunday(d);
      // solo si todavía no ha llegado el 1.er domingo de Navidad (el domingo previo es Adviento IV o es Navidad en domingo)
      const pr = Cal.getDay(prevSun);
      if (pr.key === 'christmasSunday' || pr.key === 'christmasSunday2') continue;
      const r = Cal.getDay(d); if (r.isFixed) continue; f4n++;
      const ck = resolveCollectKey(r, d), lk = resolveLectionaryKey(r, d);
      if (ck !== 'christmas' || lk.key !== 'christmas') { f4++; if (f4ex.length < 5) f4ex.push(show('', d)); }
    }
  }
  console.log(`[F4] 29-31 dic. antes del 1.er domingo de Navidad (sin fiesta): ${f4} de ${f4n} no usan la colecta/lecciones del Día de Navidad`);
  console.log(f4ex.join('\n'));
  // F5. Días entre Epifanía y el domingo siguiente (libro 16872-16874)
  let f5n = 0; const f5 = {};
  for (let y = 2024; y <= 2060; y++) {
    for (let day = 7; day <= 12; day++) {
      const d = mk(y, 0, day); if (d.getDay() === 0) break;
      if (Cal.getDay(d).key === 'epiphany1') break;
      const r = Cal.getDay(d); if (r.isFixed) continue; f5n++;
      const ck = resolveCollectKey(r, d); f5[ck] = (f5[ck] || 0) + 1;
    }
  }
  console.log(`[F5] ferias entre Epifanía y el domingo siguiente 2024-2060: ${f5n}; colecta usada:`, JSON.stringify(f5), '(libro: colecta de la Epifanía, o lecciones del 2.º Domingo de Navidad)');
  // F6. Semana Santa y Semana de Pascua: ¿colecta propia de cada día?
  const need = [];
  for (const k of ['holyWeekFeria_1', 'holyWeekFeria_2', 'holyWeekFeria_3', 'easterFeria1_1', 'easterFeria1_2', 'easterFeria1_3', 'easterFeria1_4', 'easterFeria1_5', 'easterFeria1_6']) {
    need.push(`${k}: colecta=${!!Prop.COLLECTS[k]} lecciones=${!!Lect.SUNDAY[k]}`);
  }
  console.log('[F6] colectas/lecciones propias de la semana (libro: 17046-17070 y 17130-17176; 20849-20990):\n   ' + need.join('\n   '));
  console.log('   Claves de colecta existentes tipo feria:', Object.keys(Prop.COLLECTS).filter(k => /eria/.test(k)).join(', ') || '(ninguna)');
  console.log('   Claves de lecciones tipo feria:', Object.keys(Lect.SUNDAY).filter(k => /eria/.test(k)).join(', ') || '(ninguna)');
  console.log('   ¿Existen COLLECTS para christmasEve / easterEve / rogation / ember?', ['christmasEve', 'easterEve', 'rogation', 'ember'].map(k => k + '=' + !!Prop.COLLECTS[k]).join(' '));
  console.log('   Claves de COLLECTS (', Object.keys(Prop.COLLECTS).length, '):', Object.keys(Prop.COLLECTS).join(' '));
}

// ════ G. Numeración de semanas de Cuaresma ════
{
  let tot = 0, bad = 0; const ex = [];
  for (let y = 2024; y <= 2060; y++) {
    const F = Cal.getFeastDates(y);
    for (let d = addD(F.ashWednesday, 1); d < F.palmSunday; d = addD(d, 1)) {
      if (d.getDay() === 0) continue;
      const r = Cal.getDay(d); if (!/^lentFeria/.test(r.key)) continue;
      tot++;
      const week = +r.key.match(/^lentFeria(\d+)_/)[1];
      // semana "correcta": nº del último domingo de Cuaresma transcurrido (0 antes del 1.er domingo)
      const prev = getPreviousSunday(d);
      const diff = Math.round((Date.UTC(prev.getFullYear(), prev.getMonth(), prev.getDate()) - Date.UTC(F.lent1.getFullYear(), F.lent1.getMonth(), F.lent1.getDate())) / 86400000);
      const correct = diff < 0 ? 0 : Math.floor(diff / 7) + 1;
      if (week !== correct) { bad++; if (ex.length < 5) ex.push(`${iso(d)} (${DOW[d.getDay()]}) etiqueta semana ${week}; lo correcto: ${correct} -> "${r.nameEs}"`); }
    }
  }
  console.log(`[G] ferias de Cuaresma 2024-2060: ${tot}; con número de semana distinto del domingo que las precede: ${bad} (${(100 * bad / tot).toFixed(1)}%)`);
  console.log(ex.join('\n'));
}

// ════ H. Domingo 1.º de enero (Navidad en domingo) y domingos de Navidad ════
{
  const list = [];
  for (let y = 2001; y <= 2120; y++) {
    const d = mk(y, 0, 1);
    if (d.getDay() === 0) { const r = Cal.getDay(d); list.push(`${y}-01-01: key=${r.key} (${r.nameEs})`); }
  }
  console.log('[H] 1-ene en domingo (Navidad cayó en domingo el año anterior), 2001-2120:', list.length, 'años');
  console.log(list.join('\n'));
  const inRange = list.filter(s => +s.slice(0, 4) >= 2024 && +s.slice(0, 4) <= 2060);
  console.log('[H] dentro de 2024-2060:', inRange.length, '->', inRange.map(s => s.slice(0, 4)).join(', '));
}

// ════ I. Fronteras de temporada ════
{
  let off = [];
  for (let y = 2024; y <= 2060; y++) {
    const F = Cal.getFeastDates(y);
    const chk = (label, d, exp) => { const s = Cal.getDay(d).season; if (s !== exp) off.push(`${y} ${label} ${iso(d)}: ${s} (esperado ${exp})`); };
    chk('Navidad', mk(y, 11, 25), 'christmas');
    chk('5-ene', mk(y, 0, 5), 'christmas');
    chk('6-ene', mk(y, 0, 6), 'epiphany');
    chk('día antes de Ceniza', addD(F.ashWednesday, -1), 'epiphany');
    chk('Ceniza', F.ashWednesday, 'lent');
    chk('sábado antes de Ramos', addD(F.palmSunday, -1), 'lent');
    chk('Ramos', F.palmSunday, 'holyWeek');
    chk('Sábado Santo', F.holySaturday, 'holyWeek');
    chk('Pascua', F.easter, 'easter');
    chk('Ascensión', F.ascension, 'easter');
    chk('Pentecostés (libro: la Pascua "incluye y termina" en Pentecostés)', F.pentecost, 'easter');
    chk('lunes tras Pentecostés', addD(F.pentecost, 1), 'ordinary'); // libro: temporada después de Pentecostés
    chk('Trinidad', F.trinitySunday, 'ordinary');
    chk('Adviento I', F.advent1, 'advent');
  }
  const bySig = {};
  off.forEach(s => { const k = s.replace(/^\d+ /, '').replace(/ \d{4}-\d\d-\d\d.*/, ''); bySig[k] = (bySig[k] || 0) + 1; });
  console.log('[I] fronteras de temporada que difieren de la definición del libro (2024-2060):', JSON.stringify(bySig));
  // Pentecostés → Trinidad: inconsistencia interna del propio app
  const F = Cal.getFeastDates(2026);
  console.log('[I] 2026: Pentecostés', Cal.getDay(F.pentecost).season, '| lunes tras Pent.', Cal.getDay(addD(F.pentecost, 1)).season, '| Trinidad', Cal.getDay(F.trinitySunday).season, '| fiesta fija en esa ventana (p.ej. 31-may Trinidad 2026) -> seasonForDate no exportado');
}

// ════ J. Domingos: cobertura ════
{
  let bad = [];
  for (let y = 2001; y <= 2120; y++) for (const d of days(y, y)) {
    if (d.getDay() !== 0) continue;
    const r = Cal.getDay(d);
    if (!['sunday', 'principal'].includes(r.rank)) bad.push(`${iso(d)} ${r.key} ${r.rank}`);
  }
  console.log('[J] domingos 2001-2120 con rango distinto de sunday/principal:', bad.length, bad.slice(0, 5).join(' | '));
}
