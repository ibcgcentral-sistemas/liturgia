const L=require('./sim_lib');const C=L.load();
const b=C.bible.getBook('Salmos');
console.log('keys', Object.keys(b));
console.log('ctd_verses type', typeof b.ctd_verses, JSON.stringify(b.ctd_verses).slice(0,300));
const g=C.bible.getBook('Génesis'); console.log('Gen ctd', JSON.stringify(g.ctd_verses).slice(0,200));
// buscar caracteres peligrosos o raros en TODOS los versículos citados por el leccionario
const fs=require('fs');
const refs=JSON.parse(fs.readFileSync('out/refs.json','utf8'));
let bad={lt:0,gt:0,amp:0,pausa:0,repl:0,dblspace:0,ast:0,bracket:0,paren:0,empty:0};const ex={};
for(const r of refs){const vs=C.Biblia.getVerses(r.ref);for(const v of vs){const t=v.content;
 if(/</.test(t)){bad.lt++;(ex.lt=ex.lt||[]).push(r.ref+':'+v.v)}
 if(/>/.test(t)){bad.gt++;}
 if(/&/.test(t)){bad.amp++;(ex.amp=ex.amp||[]).push(r.ref+':'+v.v+' '+t.slice(t.indexOf('&')-10,t.indexOf('&')+15))}
 if(/Pausa|Selah/.test(t)){bad.pausa++;(ex.pausa=ex.pausa||new Set()).add(r.ref)}
 if(/\uFFFD/.test(t)){bad.repl++}
 if(/ {2,}/.test(t)){bad.dblspace++}
 if(/\*|†|‡/.test(t)){bad.ast++;(ex.ast=ex.ast||[]).push(r.ref+':'+v.v)}
 if(/\[|\]/.test(t)){bad.bracket++;(ex.bracket=ex.bracket||[]).push(r.ref+':'+v.v+' '+t.slice(Math.max(0,t.search(/\[/)-10),t.search(/\[/)+30))}
 if(!t.trim()){bad.empty++}
}}
console.log(JSON.stringify(bad));
for(const k of Object.keys(ex)){const a=ex[k] instanceof Set?[...ex[k]]:ex[k];console.log(k, a.slice(0,10).join(' | '), a.length)}
