// Auditoría calendario — desglose exacto de fiestas fijas suprimidas por domingo (2024-2060). SOLO LECTURA.
const H = require('../harness.js');
const Cal = H.load().BCPCalendar;
const FF = Object.keys(Cal.FIXED_FEASTS);
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const cat = { principalWins: [], allSaints: [], permitted: [], adventLentEaster: [] };
for (let y = 2024; y <= 2060; y++) for (const md of FF) {
  const [m, d] = md.split('-').map(Number); const dt = new Date(y, m - 1, d, 12);
  if (dt.getDay() !== 0) continue;
  const r = Cal.getDay(dt);
  if (md === '11-01') cat.allSaints.push(iso(dt));
  else if (['trinitySunday', 'pentecost', 'easter'].includes(r.key)) cat.principalWins.push(`${iso(dt)} ${md}->${r.key}`);
  else if (['advent', 'lent', 'holyWeek', 'easter'].includes(r.season)) cat.adventLentEaster.push(`${iso(dt)} ${md}->${r.key}`);
  else cat.permitted.push(`${iso(dt)} ${md}->${r.key}`);
}
for (const [k, v] of Object.entries(cat)) console.log(k, v.length);
console.log('adventLentEaster:', cat.adventLentEaster.join(' | '));
console.log('principalWins:', cat.principalWins.join(' | '));
const byMd = {}; cat.permitted.forEach(s => { const md = s.split(' ')[1].split('->')[0]; byMd[md] = (byMd[md] || 0) + 1; });
console.log('permitted por fiesta:', JSON.stringify(byMd));
const bySeasonKey = {}; cat.permitted.forEach(s => { const k = s.split('->')[1].replace(/\d+$/, 'N'); bySeasonKey[k] = (bySeasonKey[k] || 0) + 1; });
console.log('permitted por clave que ocupa:', JSON.stringify(bySeasonKey));
console.log('Navidad (St Stephen/John/Innocents en domingo):', cat.permitted.filter(s => /->christmasSunday/.test(s)).length);
