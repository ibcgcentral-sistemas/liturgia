const fs=require('fs'); const B=JSON.parse(fs.readFileSync(process.argv[2]+'/after.json','utf8'));
const left=B.filter(r=>(/^pentecostFeria_/.test(r.key)&&r.ck==='pentecost')||(/^properFeria/.test(r.key)&&r.ck==='trinitySunday'));
const byYear={}; for(const r of left){const y=r.d.slice(0,4); (byYear[y]??=[]).push(r.d.slice(5));}
console.log('días que aún usan el respaldo (Propio 1 o 2 sin texto):', left.length);
console.log(Object.entries(byYear).map(([y,a])=>y+':'+a.length).join('  '));
