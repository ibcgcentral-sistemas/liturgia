const C = require(process.argv[2] + '/harness.js').load();
const {BCPCalendar:Cal, BCPPropers:P, BCPLectionary:L} = C;
function prevSunday(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate(),12);x.setDate(x.getDate()-x.getDay());return x;}
function ck(info,date){ if(P.COLLECTS[info.key]) return info.key; const p=Cal.getDay(prevSunday(date)); return P.COLLECTS[p.key]?p.key:info.key; }
function lk(info,date){ if(L.SUNDAY[info.key]) return info.key; const p=Cal.getDay(prevSunday(date)); return L.SUNDAY[p.key]?p.key:null; }
const show=(y,m,d)=>{const date=new Date(y,m-1,d,12),i=Cal.getDay(date);console.log(`${y}-${m}-${d} (${['dom','lun','mar','mié','jue','vie','sáb'][date.getDay()]})`,i.name,'| key',i.key,'| colecta←',ck(i,date),'| lecturas←',lk(i,date));};
console.log('— 1 de enero en domingo (CAL-03) —'); show(2034,1,1); show(2033,12,25);
console.log('— ferias tras Pentecostés 2026 (CAL-07) —'); show(2026,5,24); show(2026,5,25); show(2026,5,29);
console.log('— ferias tras Trinidad 2026 —'); show(2026,5,31); show(2026,6,1);
console.log('— Ceniza 2027 y jueves siguiente (CAL-04) —'); show(2027,2,10); show(2027,2,11);
console.log('— claves proper1/proper2 —', 'proper1' in P.COLLECTS, 'proper2' in P.COLLECTS, 'proper1' in L.SUNDAY);
