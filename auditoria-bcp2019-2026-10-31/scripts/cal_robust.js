// Auditoría calendario — robustez: zona horaria / hora del día / semanas de Cuaresma por día de la semana. SOLO LECTURA.
// Uso: node cal_robust.js hash   (imprime hash del barrido 2001-2060 a las 12:00; correrlo con distintas TZ)
//      node cal_robust.js hours  (compara 00:00 / 12:00 / 23:59)
//      node cal_robust.js lent   (etiquetas de semana en Cuaresma por día de la semana)
//      node cal_robust.js proper12 (cuántas semanas de Pentecostés/Trinidad requerirían Propio 1/2)
const crypto = require('crypto');
const H = require('../harness.js');
const Cal = H.load().BCPCalendar;
const mode = process.argv[2] || 'hash';
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const at = (y, m, d, h, mi = 0) => new Date(y, m, d, h, mi, 0);

if (mode === 'hash') {
  const h = crypto.createHash('sha1'); let n = 0;
  for (let y = 2001; y <= 2060; y++) for (let m = 0; m < 12; m++) for (let d = 1, dim = new Date(y, m + 1, 0).getDate(); d <= dim; d++) {
    const r = Cal.getDay(at(y, m, d, 12)); h.update(`${y}-${m}-${d}|${r.key}|${r.name}|${r.color}|${r.rank}|${r.season}|${r.cycle}\n`); n++;
  }
  console.log(`TZ=${process.env.TZ || '(sistema)'} offset(ene)=${new Date(2026, 0, 1).getTimezoneOffset()} offset(jul)=${new Date(2026, 6, 1).getTimezoneOffset()} días=${n} sha1=${h.digest('hex')}`);
}

if (mode === 'hours') {
  const diffs = []; let tot = 0;
  for (let y = 2024; y <= 2060; y++) for (let m = 0; m < 12; m++) for (let d = 1, dim = new Date(y, m + 1, 0).getDate(); d <= dim; d++) {
    const a = Cal.getDay(at(y, m, d, 12)), b = Cal.getDay(at(y, m, d, 0)), c = Cal.getDay(at(y, m, d, 23, 59));
    tot++;
    const sig = r => `${r.key}|${r.name}|${r.season}|${r.rank}`;
    if (sig(a) !== sig(b) || sig(a) !== sig(c)) diffs.push(`${y}-${pad(m + 1)}-${pad(d)} 12:00=${a.key} 00:00=${b.key} 23:59=${c.key}`);
  }
  console.log(`días 2024-2060: ${tot}; con resultado distinto según la hora (00:00 / 12:00 / 23:59): ${diffs.length}`);
  console.log(diffs.slice(0, 12).join('\n'));
  const byKeyFam = {};
  diffs.forEach(s => { const m = /12:00=(\S+)/.exec(s); const f = m[1].replace(/\d+/g, 'N'); byKeyFam[f] = (byKeyFam[f] || 0) + 1; });
  console.log(JSON.stringify(byKeyFam));
}

if (mode === 'lent') {
  const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const stat = {}; let tot = 0, bad = 0;
  for (const hour of [12, 0]) {
    const st = {}; let t = 0, b = 0;
    for (let y = 2024; y <= 2060; y++) {
      const F = Cal.getFeastDates(y);
      for (let d = new Date(F.ashWednesday.getFullYear(), F.ashWednesday.getMonth(), F.ashWednesday.getDate() + 1, hour); d < F.palmSunday; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, hour)) {
        if (d.getDay() === 0) continue;
        const r = Cal.getDay(d); if (!/^lentFeria/.test(r.key)) continue;
        const week = +r.key.match(/^lentFeria(\d+)_/)[1];
        const prevSun = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay(), 12);
        const lent1 = new Date(F.lent1.getFullYear(), F.lent1.getMonth(), F.lent1.getDate(), 12);
        const diff = Math.round((Date.UTC(prevSun.getFullYear(), prevSun.getMonth(), prevSun.getDate()) - Date.UTC(lent1.getFullYear(), lent1.getMonth(), lent1.getDate())) / 86400000);
        const correct = diff < 0 ? 0 : Math.floor(diff / 7) + 1;
        t++; st[DOW[d.getDay()]] = st[DOW[d.getDay()]] || { n: 0, bad: 0 }; st[DOW[d.getDay()]].n++;
        if (week !== correct) { b++; st[DOW[d.getDay()]].bad++; }
      }
    }
    console.log(`Hora ${hour}:00 -> ferias de Cuaresma 2024-2060: ${t}; etiqueta de semana ≠ domingo precedente: ${b} (${(100 * b / t).toFixed(1)}%)`, JSON.stringify(st));
  }
}

if (mode === 'proper12') {
  const cnt = { pentWeek: {}, trinWeek: {} };
  for (let y = 2024; y <= 2060; y++) {
    const F = Cal.getFeastDates(y);
    const pp = Cal.getProperNumber(F.pentecost), tp = Cal.getProperNumber(F.trinitySunday);
    cnt.pentWeek[pp] = (cnt.pentWeek[pp] || 0) + 1;
    cnt.trinWeek[tp] = (cnt.trinWeek[tp] || 0) + 1;
  }
  console.log('Propio que correspondería a la semana de Pentecostés (por la fecha del domingo) 2024-2060:', JSON.stringify(cnt.pentWeek));
  console.log('Propio que correspondería a la semana de Trinidad:', JSON.stringify(cnt.trinWeek));
  // años con Pentecostés en 8-21 may (Propios 1-2) o Trinidad en 15-21 may (Propio 2)
}
