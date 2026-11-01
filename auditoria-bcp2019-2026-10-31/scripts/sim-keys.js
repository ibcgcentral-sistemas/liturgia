const C = require('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/harness.js').load();
const S = C.BCPLectionary.SUNDAY;
const cnt = {}; const feriaKeys = {}; const nonSunday = {};
let d = new Date(2024, 0, 1, 12), end = new Date(2060, 11, 31, 12);
let days = 0;
while (d <= end) {
  const di = C.BCPCalendar.getDay(d); days++;
  const k = di.key;
  if (S[k]) cnt[k] = (cnt[k] || 0) + 1;
  else { const f = k.replace(/\d+_\d+$/, 'N_D').replace(/\d+$/, 'N'); feriaKeys[f] = (feriaKeys[f] || 0) + 1; }
  d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12);
}
console.log('dias simulados', days);
const mine = ['advent1','advent2','advent3','advent4','christmas','christmasSunday','circumcision','christmasSunday2','epiphany','epiphany1','epiphany2','epiphany3','epiphany4','epiphany5','epiphany6','epiphany7','epiphany8','transfiguration','ashWednesday','lent1','lent2','lent3','lent4','lent5','palmSunday','holyWeekFeria_1','holyWeekFeria_2','holyWeekFeria_3','maundyThursday','goodFriday','holySaturday','easter','easter2','easter3','easter4','easter5','easter6','easter7','ascension','pentecost','trinitySunday'];
console.log(mine.map(k => k + ':' + (cnt[k] || 0)).join('  '));
console.log('claves sin lectura propia (ferias) que ocurren:', JSON.stringify(feriaKeys));
