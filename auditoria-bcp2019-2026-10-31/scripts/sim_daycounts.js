// sim_daycounts.js — días del barrido afectados por grupos de referencias/claves señaladas.
const fs=require('fs');const R=JSON.parse(fs.readFileSync(__dirname+'/out/sweep.json','utf8'));
const has=(r,list)=>r.refs&&['first','psalm','second','gospel'].some(x=>list.includes(r.refs[x]));
const g={
 'finMitadFrase(11 refs)':['Isaiah 58:1-9','1 Corinthians 2:1-12','Acts 3:12-19','Genesis 1:1-2:4','1 Kings 8:22-23','2 Samuel 7:1-14','Jeremiah 8:18-9:1','Jeremiah 32:1-3','Acts 4:8-13','Luke 1:39-49','Acts 6:8-7:2'],
 'versiculosAusentesBdJ(critico)':['Acts 8:26-40','Mark 9:38-50','Matthew 21:33-46','Mark 14:1-15:47','Luke 22:14-23:56','Luke 22:39-71,23:1-53'],
 'Sal45:11-18':['Psalm 45:11-18'],'Sal22(22-30,24-30)':['Psalm 22:22-30','Psalm 22:24-30'],'Sal146:4-9':['Psalm 146:4-9'],'Sal13':['Psalm 13'],
 'Lc1:46-55 (08-15 salmo=evangelio)':[], 
};
const out={};
for(const [k,l] of Object.entries(g)){ if(!l.length) continue; out[k]=R.filter(r=>has(r,l)).length; }
out['08-15 (salmo==evangelio)']=R.filter(r=>r.key==='08-15').length;
out['05-31 (evangelio solapa salmo)']=R.filter(r=>r.key==='05-31').length;
out['01-01 prefacio El Día del Señor']=R.filter(r=>r.prefaceTitle==='El Día del Señor').length;
out['12-26/27/28 prefacio común']=R.filter(r=>['12-26','12-27','12-28'].includes(r.key)&&r.prefaceTitle==='En Cualquier Tiempo').length;
out['01-18/01-25 prefacio común']=R.filter(r=>['01-18','01-25'].includes(r.key)).length;
out['Buen Viernes+Sábado Santo (Eucaristía completa)']=R.filter(r=>['goodFriday','holySaturday'].includes(r.key)).length;
out['Pentecostés (acl. pascual con rúbrica "hasta Víspera")']=R.filter(r=>r.key==='pentecost').length;
out['fiesta fija en Cuaresma con Gloria+aclam.penitencial']=R.filter(r=>r.season==='lent'&&r.v&&r.v.gloria).length;
out['pentecostFeria (sin Aleluya)']=R.filter(r=>/^pentecostFeria/.test(r.key)).length;
out['borrowed total']=R.filter(r=>r.borrowed).length;
console.log(JSON.stringify(out,null,1));
