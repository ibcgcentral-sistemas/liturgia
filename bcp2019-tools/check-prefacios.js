// Coteja los prefacios de bcp2019/js/propers.js (BCPPropers.PREFACES) con el libro oficial en español
// (LOC-10-10-23.md, «Prefacios propios», líneas 3924-4086) y los compara signo a signo.
// Uso: node bcp2019-tools/check-prefacios.js [ruta a LOC-10-10-23.md]      (código de salida 1 si algo difiere)
// La ruta también puede darse con la variable LOC_MD. Sin el libro, test-bcp2019.js lo anota como pendiente.
//
// Los rangos de línea son los del markdown que hizo markitdown; si se vuelve a convertir el libro y las
// líneas se mueven, la comparación falla en voz alta en vez de pasar en silencio.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LOC = process.argv[2] || process.env.LOC_MD || 'C:/Users/gonza/OneDrive/Desktop/ESCRITORIO/Liturgia/LOC-10-10-23.md';

// clave de PREFACES → [primera línea, última línea] del texto, sin el encabezado.
const RANGOS = {
  lordsDay: [3926, 3927], common: [3929, 3931], advent: [3936, 3939], christmas: [3941, 3944], epiphany: [3949, 3950],
  transfiguration: [3952, 3954], lent: [3956, 3959], holyWeek: [3961, 3963], maundyThursday: [3965, 3968],
  easter: [3973, 3976], ascension: [3978, 3981], pentecost: [3983, 3987], trinity: [3989, 3992],
  allSaints: [3997, 4000], christTheKing: [4002, 4005], apostles: [4007, 4009], dedication: [4011, 4013],
  baptism: [4015, 4017], marriage: [4022, 4024], burial: [4027, 4031], penitential: [4033, 4035],
  thanksgiving: [4037, 4039], martyr: [4051, 4052], missionary: [4054, 4056], pastor: [4058, 4060],
  teacher: [4062, 4064], religious: [4066, 4068], ecumenist: [4073, 4075], socialReformer: [4077, 4079],
  churchReformer: [4081, 4083], anyCommemoration: [4085, 4086],
};

// Desviaciones deliberadas del app, aplicadas al texto del libro antes de comparar: así solo ocultan
// ESA diferencia y cualquier otra sigue saltando.
const DELIBERADAS = {
  lent: { nota: 'el libro dice «Tu pides» (errata); el app imprime «Tú pides»', libro: t => t.replace(/^Tu pides/, 'Tú pides') },
  marriage: { nota: 'el libro no cierra con punto; el app sí', libro: t => t + '.' },
};

function compare(locPath = LOC) {
  if (!fs.existsSync(locPath)) return null;
  const libro = fs.readFileSync(locPath, 'utf8').split(/\r?\n/);
  const ctx = { console, Date, Math, JSON, Object, Array, String, Number, RegExp, Map, Set };
  ctx.window = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'bcp2019', 'js', 'propers.js'), 'utf8') + '\n;', ctx);
  const P = vm.runInContext('BCPPropers', ctx).PREFACES;
  const diferencias = [], deliberadas = [];
  let exactos = 0;
  for (const k of Object.keys(P)) {
    if (!RANGOS[k]) { diferencias.push(`${k}: no tiene rango del libro en check-prefacios.js`); continue; }
    let esperado = libro.slice(RANGOS[k][0] - 1, RANGOS[k][1]).join(' ').replace(/\s+/g, ' ').trim();
    const d = DELIBERADAS[k];
    if (d) esperado = d.libro(esperado);
    if (P[k].text === esperado) { if (d) deliberadas.push(`${k}: ${d.nota}`); else exactos++; continue; }
    diferencias.push(`${k} (${P[k].title}, líneas ${RANGOS[k][0]}-${RANGOS[k][1]}): app «${P[k].text.slice(0, 60)}…» ≠ libro «${esperado.slice(0, 60)}…»`);
  }
  return { total: Object.keys(P).length, exactos, deliberadas, diferencias };
}

module.exports = { compare, LOC };

if (require.main === module) {
  const r = compare();
  if (!r) { console.error('No se encontró el libro en español: ' + LOC); process.exit(2); }
  console.log(`Prefacios: ${r.exactos} idénticos al libro, ${r.deliberadas.length} con desviación deliberada, ${r.diferencias.length} con diferencias (de ${r.total}).`);
  for (const d of r.deliberadas) console.log('  deliberada  ' + d);
  for (const d of r.diferencias) console.log('  DIFERENCIA  ' + d);
  process.exit(r.diferencias.length ? 1 : 0);
}
