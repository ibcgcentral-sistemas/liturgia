const L = require('./sim_lib'); const fs = require('fs');
const C = L.load();
const strip = h => h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
(async () => {
  const fechas = ['2026-10-31','2026-11-01','2027-03-26','2027-03-27','2027-02-11','2026-05-25','2026-06-01','2034-01-01','2028-12-29','2026-05-15'];
  for (const s of fechas) {
    const [y,m,d] = s.split('-').map(Number); const date = new Date(y,m-1,d,12);
    const html = await C.generateLiturgy(date); const st = C.getState(); const t = strip(html);
    const lib = strip(C.BCPLibrito.generateLibrito(st));
    console.log(`\n${s} ${st.dayInfo.nameEs} [${st.dayInfo.key}, ${st.dayInfo.rank}]`);
    console.log('  consagración en liturgia:', /ORACIÓN DE CONSAGRACIÓN/.test(t), '| en Librito:', /Consagraci|institución/i.test(lib), '| prestada:', st.borrowedFromSunday);
    if (st.readings) console.log('  lecturas:', [st.readings.first, st.readings.second, st.readings.gospel].filter(Boolean).join(' · '));
    else console.log('  lecturas: (ninguna)');
    console.log('  colecta:', strip(String(st.collect)).slice(0, 90));
    const aviso = t.match(/(El rito de la Santa Eucaristía no se celebra|No hay celebración de la Eucaristía)[^✠]{0,140}/);
    if (aviso) console.log('  aviso:', aviso[0]);
  }
  // marcas de fallo en TODO el barrido
  const sw = JSON.parse(fs.readFileSync('out/sweep.json','utf8'));
  console.log('\nregistros del barrido:', sw.length, '| claves del registro:', Object.keys(sw[0]).join(','));
})();
