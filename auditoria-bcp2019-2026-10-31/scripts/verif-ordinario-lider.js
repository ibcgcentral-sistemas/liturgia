const C = require(process.argv[2] + '/harness.js').load();
const {BCPCalendar:Cal, BCPPropers:P} = C;
for (const [y,m,d] of [[2027,3,25],[2027,3,26],[2027,3,27],[2027,3,28]]) {
  const info=Cal.getDay(new Date(y,m-1,d,12));
  console.log(`${y}-${m}-${d}`, info.name, '| key:', info.key, '| season:', info.season, '| preface:', (P.getPreface(info.key, info.season)||{}).title);
}
