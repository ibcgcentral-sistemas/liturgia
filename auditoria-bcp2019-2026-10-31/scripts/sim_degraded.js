// sim_degraded.js — Control negativo y modo degradado: ¿qué ocurre si la Biblia no carga (offline / XHR fallido)?
// También valida que los detectores de marcas del barrido SÍ saltan cuando hay fallo.
const L = require('./sim_lib');
const C = L.load();
const dates = [L.D(2026, 10, 31), L.D(2026, 11, 1), L.D(2026, 12, 25), L.D(2027, 3, 26)];
(async () => {
  C.ctx._BibliaInstance = null; // simula fallo de carga de la Biblia
  for (const d of dates) {
    const h = await C.generateLiturgy(d); const st = C.getState(); const lib = C.BCPLibrito.generateLibrito(st);
    const marks = ['Biblia de Jerusalén no cargada', 'Lectura no especificada', 'Libro no encontrado', 'No se encontr'].filter(m => h.includes(m));
    console.log(L.iso(d), st.dayInfo.key, '| main marcas:', marks.join(',') || '(ninguna)', '| salmo mostrado:', /SALMO RESPONSORIAL/.test(h), '| Librito contiene aviso:', /Biblia de Jerusal[eé]n no cargada/.test(lib), '| Librito sin salmo:', !/librito-psalm/.test(lib), '| warns:', C.warns.length);
  }
  // control de buena formación (detector sensible)
  const VOID = new Set(['br']);
  const bad = '<div><p>hola</div></p>';
  const re = /<\/([a-z]+)>|<([a-z]+)[^>]*>/g; let m; const st = []; let err = 0;
  while ((m = re.exec(bad))) { if (m[1]) { if (st.pop() !== m[1]) err++; } else st.push(m[2]); }
  console.log('control detector de etiquetas (esperado >0):', err);
})();
