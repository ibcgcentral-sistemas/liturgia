// sim_credo.js — Credo, Gloria, Confesión, Padrenuestro, Agnus Dei y Sanctus del Librito frente al Ordinario (texto íntegro, solo letras).
const L=require('./sim_lib');const C=L.load();
const letters=s=>String(s).replace(/<[^>]+>/g,' ').toLowerCase().replace(/[^a-záéíóúñü]/g,'');
(async()=>{
 const h=await C.generateLiturgy(L.D(2026,7,5));const lib=C.BCPLibrito.generateLibrito(C.getState());
 const mainLines=[...h.matchAll(/<span class="lit-text">([\s\S]*?)<\/span><\/span>/g)].map(m=>letters(m[1]));
 const find=(start)=>mainLines.find(x=>x.startsWith(start));
 const credoSec=lib.slice(lib.indexOf('<div class="librito-credo">'),lib.indexOf('ORACIÓN DE LOS FIELES'));
 const lcredo=letters(credoSec.replace(/✠[^<]*/g,'').replace('INCLINACIÓN',''));
 const mcredo=find('creemosenunsolodios');
 console.log('Credo íntegro Librito == principal:',lcredo===mcredo,lcredo.length,mcredo&&mcredo.length);
 const blocks={Gloria:'gloriaadiosenelcielo',Confesion:'diostodopoderosopadredenuestroseñorjesucristocreador',Padrenuestro:'padrenuestroqueestásenelcielo',Agnus:'corderodedios',Sanctus:'santosantosanto'};
 for(const [k,st] of Object.entries(blocks)){const m=find(st);const i=letters(lib).indexOf(st);let ok='no hallado en Librito';if(i>=0&&m){ok=letters(lib).includes(m)?'IGUAL (texto íntegro contenido)':'DIFIERE';}console.log(k,m?('principal len '+m.length):'no hallado en principal',ok);}
})();
