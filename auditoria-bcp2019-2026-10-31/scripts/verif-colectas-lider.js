const C = require(process.argv[2] + '/harness.js').load();
const {BCPCalendar:Cal, BCPPropers:P} = C;
function prevSunday(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate(),12);x.setDate(x.getDate()-x.getDay());return x;}
function collectKey(info,date){ if(P.COLLECTS[info.key]) return info.key; const p=Cal.getDay(prevSunday(date)); if(P.COLLECTS[p.key]) return p.key; return info.key; }
const strip = s => String(s).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
for (const [y,m,d] of [[2026,10,31],[2026,11,1],[2026,11,2]]) {
  const date=new Date(y,m-1,d,12), info=Cal.getDay(date), k=collectKey(info,date);
  console.log(`${y}-${m}-${d}`, JSON.stringify({key:info.key,name:info.name,rank:info.rank,season:info.season}), '→ colecta de clave:', k);
  console.log('   ', strip(P.getCollect(k)).slice(0,140));
}
// ¿qué claves comparten texto idéntico?
const groups={}; for (const [k,v] of Object.entries(P.COLLECTS)) (groups[strip(v)] ||= []).push(k);
console.log('Grupos de claves con texto idéntico:', JSON.stringify(Object.values(groups).filter(g=>g.length>1)));
console.log('allSaints en COLLECTS?', 'allSaints' in P.COLLECTS, '| claves que contienen "saints":', Object.keys(P.COLLECTS).filter(k=>/saint/i.test(k)));
