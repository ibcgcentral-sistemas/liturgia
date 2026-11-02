// Vigila las colectas de bcp2019/js/propers.js (BCPPropers.COLLECTS).
//  1. Las 5 de COLLECT_OFFICIAL (Miércoles de Ceniza y Semana Santa) deben ser IDÉNTICAS al libro en español
//     (LOC-10-10-23.md): se compara con el texto del libro, buscado por su comienzo, no por número de línea.
//  2. Las demás son TRADUCCIÓN del inglés y no se pueden comparar palabra por palabra; se comprueba lo que sí se puede:
//     que cada una termine en «Amén.», que no quede inglés suelto, que la fórmula final (por los siglos de los siglos /
//     ahora y por siempre / en gloria eterna) corresponda a la inglesa si se da el libro en inglés, y que su longitud sea
//     razonable respecto del original (la traducción no omite ni duplica oraciones).
// Uso: node bcp2019-tools/check-colectas.js [LOC-10-10-23.md] [BCP2019-en.md]     (código de salida 1 si algo difiere)
// Las rutas también pueden darse con LOC_MD y BCP_EN_MD. Sin el libro en español se salta el punto 1, y sin el inglés
// la comparación con el original; test-bcp2019.js lo anota como pendiente. El inglés NO está en el repositorio.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LOC = process.argv[2] || process.env.LOC_MD || 'C:/Users/gonza/OneDrive/Desktop/ESCRITORIO/Liturgia/LOC-10-10-23.md';
const EN = process.argv[3] || process.env.BCP_EN_MD || '';

// Comienzo del texto oficial de cada una en el libro en español.
const INICIO = {
  ashWednesday: 'Dios todopoderoso y eterno, que nada de lo que has hecho odias',
  palmSunday: 'Dios todopoderoso y eterno, en tu tierno amor por nosotros enviaste',
  maundyThursday: 'Padre todopoderoso, cuyo amadísimo Hijo, la noche antes de sufrir',
  goodFriday: 'Dios todopoderoso, te rogamos que mires compasivamente a esta tu familia',
  holySaturday: 'Oh Dios, Creador del cielo y de la tierra: Concede que, así como el Cuerpo crucificado',
};
// Que cada fiesta mencione a su santo o su misterio: guarda contra traducir la colecta de otro día.
const NOMBRES = {
  '11-30': ['Andrés'], '12-21': ['Tomás'], '12-26': ['Esteban'], '12-27': ['Juan'], '12-28': ['Inocentes'], '01-01': ['Nombre'], '01-18': ['Pedro'], '01-25': ['Pablo'], '02-02': ['templo'],
  '02-24': ['Matías'], '03-19': ['José'], '03-25': ['Virgen María'], '04-25': ['Marcos'], '05-01': ['Felipe', 'Santiago'], '05-31': ['Isabel'], '06-11': ['Bernabé'], '06-24': ['Juan el Bautista'],
  '06-29': ['Pedro', 'Pablo'], '07-22': ['María Magdalena'], '07-25': ['Santiago'], '08-06': ['transfigurado'], '08-15': ['Virgen María'], '08-24': ['Bartolomé'], '09-14': ['Cruz'],
  '09-21': ['Mateo'], '09-29': ['ángeles'], '10-18': ['Lucas'], '10-23': ['Santiago'], '10-28': ['Simón', 'Judas'], '11-01': ['santos'],
  christmas: ['Virgen'], epiphany: ['estrella'], epiphany1: ['bautismo'], transfiguration: ['monte santo'], lent1: ['tentado'], easter4: ['Pastor'], pentecost: ['Espíritu Santo'], trinitySunday: ['Trinidad'],
  ascension: ['ascendió'], proper29: ['Rey de reyes'],
};
const INGLES = /\b(the|and|your|Lord|Almighty|Grant|through|who lives|for ever|Amen)\b/;

function cargar() {
  const ctx = { console, Date, Math, JSON, Object, Array, String, Number, RegExp, Map, Set };
  ctx.window = ctx; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'bcp2019', 'js', 'propers.js'), 'utf8') + '\n;', ctx);
  return vm.runInContext('BCPPropers', ctx);
}

function textoOficial(lines, inicio) {
  const i = lines.findIndex((l, n) => n > 14400 && l.trim().startsWith(inicio));
  if (i < 0) return null;
  const t = [];
  for (let j = i; j < i + 12; j++) { const l = lines[j].trim(); if (!l) continue; t.push(l); if (/Amén\.?$/.test(l)) break; }
  return t.join(' ').replace(/\s+/g, ' ');
}

function compare(locPath = LOC, enPath = EN) {
  const P = cargar();
  const fallos = [], notas = [];
  const claves = Object.keys(P.COLLECTS);
  const oficiales = Object.keys(P.COLLECT_OFFICIAL || {});
  // 0. Toda clave de COLLECT_OFFICIAL es una colecta que existe, y las INICIO coinciden con ellas.
  for (const k of Object.keys(INICIO)) if (!(k in P.COLLECT_OFFICIAL)) fallos.push(`${k}: debería figurar en COLLECT_OFFICIAL`);
  for (const k of oficiales) if (!INICIO[k]) fallos.push(`${k}: figura en COLLECT_OFFICIAL pero check-colectas.js no sabe dónde está en el libro`);
  // 1. Las oficiales, idénticas al libro en español.
  let oficialesComparadas = 0;
  if (fs.existsSync(locPath)) {
    const lines = fs.readFileSync(locPath, 'utf8').split(/\r?\n/);
    for (const k of oficiales) {
      const esperado = textoOficial(lines, INICIO[k]);
      if (esperado === null) { fallos.push(`${k}: no encuentro su texto en el libro en español`); continue; }
      oficialesComparadas++;
      if (P.COLLECTS[k] !== esperado) fallos.push(`${k}: no coincide con el libro en español (l. ${P.COLLECT_OFFICIAL[k]}): app «${P.COLLECTS[k].slice(0, 50)}…» ≠ libro «${esperado.slice(0, 50)}…»`);
    }
  } else notas.push('sin el libro en español: no se compararon las oficiales');
  // 2. Las traducidas: forma y longitud.
  let ing = null;
  if (enPath && fs.existsSync(enPath)) ing = require('./extraer-colectas-en.js').extraer(enPath);
  else notas.push('sin el BCP en inglés: no se compararon formulas ni longitudes con el original');
  let traducidas = 0;
  for (const k of claves) {
    if (!P.isCollectTranslated(k)) continue;
    traducidas++;
    const es = P.COLLECTS[k];
    if (!/Amén\.$/.test(es)) fallos.push(`${k}: no termina en «Amén.»`);
    if (INGLES.test(es)) fallos.push(`${k}: queda texto en inglés («${(INGLES.exec(es) || [])[0]}»)`);
    if (es.length < 120) fallos.push(`${k}: demasiado corta (${es.length} caracteres)`);
    for (const n of NOMBRES[k] || []) if (!es.includes(n)) fallos.push(`${k}: debería mencionar «${n}»`);
    if (ing && ing[k]) {
      const en = ing[k].english, r = es.split(/\s+/).length / en.split(/\s+/).length;
      // Medido el 2026-11-02 sobre las 90: de 0.86 a 1.09, mediana 0.99. Una cláusula omitida baja la razón de 0.8.
      if (r < 0.78 || r > 1.30) fallos.push(`${k}: la longitud no cuadra con el original (${es.split(/\s+/).length} palabras frente a ${en.split(/\s+/).length}; razón ${r.toFixed(2)})`);
      const formula = [[/for ever and ever\. Amen\.$/, /por los siglos de los siglos\. Amén\.$/], [/now and for ever\. Amen\.$/, /ahora y por siempre\. Amén\.$/], [/in glory everlasting\. Amen\.$/, /en gloria eterna\. Amén\.$/], [/world without end\. Amen\.$/, /por los siglos de los siglos\. Amén\.$/]];
      for (const [e, s] of formula) if (e.test(en) && !s.test(es)) fallos.push(`${k}: la fórmula final no corresponde a la inglesa («${en.slice(-30)}» → «${es.slice(-40)}»)`);
      if (/\[[^\]]+\]/.test(en) !== /\[[^\]]+\]/.test(es)) fallos.push(`${k}: el original ${/\[[^\]]+\]/.test(en) ? 'trae' : 'no trae'} una parte entre corchetes y la traducción ${/\[[^\]]+\]/.test(es) ? 'sí' : 'no'}`);
    }
  }
  return { total: claves.length, oficiales: oficiales.length, oficialesComparadas, traducidas, comparadasConIngles: ing ? traducidas : 0, fallos, notas };
}

module.exports = { compare, LOC, EN };

if (require.main === module) {
  const r = compare();
  console.log(`Colectas: ${r.total} (${r.oficiales} oficiales, ${r.traducidas} traducidas); ${r.fallos.length} fallos.`);
  for (const n of r.notas) console.log('  nota  ' + n);
  for (const f of r.fallos) console.log('  FALLA  ' + f);
  process.exit(r.fallos.length ? 1 : 0);
}
