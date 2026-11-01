const L = require(process.argv[2] + '/sim_lib');
const C = L.load();
const strip = h => String(h).replace(/<sup[^>]*>\d+<\/sup>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
(async () => {
  const refs = new Map();
  for (const [key, e] of Object.entries(C.BCPLectionary.SUNDAY)) for (const c of (e.all ? ['all'] : ['A', 'B', 'C'])) {
    const set = e.all || e[c]; for (const s of ['first', 'second', 'gospel']) if (set[s]) (refs.get(set[s]) || refs.set(set[s], []).get(set[s])).push(key + '/' + c);
  }
  const badStart = [], badEnd = [];
  for (const [r, where] of refs) {
    const t = strip((await C.fetchScripture(r)).text);
    if (!/^[A-ZÁÉÍÓÚÑ¡¿«“"(\[—\-]/.test(t)) badStart.push(r + '  «' + t.slice(0, 50) + '»  ' + where[0]);
    if (!/[.!?»”"':;)\]…]$/.test(t)) badEnd.push(r + '  «…' + t.slice(-50) + '»  ' + where[0]);
  }
  console.log('lecturas distintas (no salmos):', refs.size);
  console.log('\nEMPIEZAN a media frase (' + badStart.length + '):\n' + badStart.join('\n'));
  console.log('\nACABAN a media frase (' + badEnd.length + '):\n' + badEnd.join('\n'));
})();
