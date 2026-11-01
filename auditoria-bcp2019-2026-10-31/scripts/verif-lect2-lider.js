const C = require(process.argv[2] + '/harness.js').load();
const {BCPCalendar:Cal, BCPLectionary:L} = C;
const i = Cal.getDay(new Date(2026,10,1,12));
console.log('app 2026-11-01:', i.key, 'ciclo', i.cycle, JSON.stringify(L.getSundayReadings(i.key, i.cycle)));
console.log('app clave 11-01 (Todos los Santos):', JSON.stringify(L.SUNDAY['11-01']));
