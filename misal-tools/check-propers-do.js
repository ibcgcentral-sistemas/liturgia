// Vigila los propios de la Misa que js/propers-do.js (Divinum Officium) añade al Misal de la raíz.
// Uso: node misal-tools/check-propers-do.js [carpeta con Espanol/...]      (código de salida 1 si algo falla)
// Barre 2024-2060 (13.515 días) con calendar.js + propers-do.js + propers.js y comprueba, ejecutando el código y no fiándose de los documentos:
//  1. Ninguna pieza lanza, sale vacía ni lleva restos de marcas de Divinum Officium ($ @ & < > { } o guiones blandos).
//  2. Secretas y poscomuniones: solo el Viernes y el Sábado Santo (sin Misa) siguen cayendo al genérico.
//  3. El Misal impreso manda: ningún texto que propers.js ya traía fue sustituido por uno de propers-do.js.
//  4. Cada Domingo después de la Trinidad mapeado recibe SU Misa romana (TRINIDAD de import-do.js), no la de otra semana.
//  5. Con la carpeta de Divinum Officium (argumento 1 o DO_CACHE), propers-do.js es idéntico a lo que genera import-do.js.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const R = path.join(__dirname, '..') + path.sep;
const PARTES = ['introit', 'gradual', 'offertory', 'communion', 'secret', 'postcommunion'];
const fallos = [];
const F = (cond, msg) => { if (!cond && fallos.length < 40) fallos.push(msg); };

function cargar(conDO) {
  const c = { console, Date, Math, JSON, Object, Array, String, Number, RegExp, Map, Set }; c.window = c; vm.createContext(c);
  for (const f of ['calendar.js', ...(conDO ? ['propers-do.js'] : []), 'propers.js']) vm.runInContext(fs.readFileSync(R + 'js/' + f, 'utf8') + ';', c);
  return { Cal: vm.runInContext('LiturgicalCalendar', c), P: vm.runInContext('Propers', c), DO: conDO ? vm.runInContext('PROPERS_DO', c) : null };
}
const con = cargar(true), sin = cargar(false);
const valor = r => typeof r.value === 'string' ? r.value : ((r.value && (r.value.ant || r.value.text)) || '');
let dias = 0, genericasFueraDeLugar = 0;
for (let d = new Date(2024, 0, 1, 12); d.getFullYear() <= 2060; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)) {
  dias++;
  const i = con.Cal.getDay(d), w = d.toISOString().slice(0, 10) + ' ' + i.key;
  for (const p of PARTES) {
    let r, antes;
    try { r = con.P.getProper(p, i.key, i.season, d); antes = sin.P.getProper(p, i.key, i.season, d); } catch (e) { F(false, `${w} ${p}: lanzó ${e.message}`); continue; }
    const v = valor(r);
    F(v && !/[$@&<>{}]|­/.test(v), `${w} ${p}: pieza vacía o con restos de marcas`);
    if (!antes.supplied) F(valor(antes) === v, `${w} ${p}: propers-do.js sustituyó un texto del Misal impreso`);
    if ((p === 'secret' || p === 'postcommunion') && r.supplied && r.source === 'generic' && !/^(goodFriday|holySaturday)$/.test(i.key) && !/Feria|^ordinary/.test(i.key)) genericasFueraDeLugar++;
  }
}
F(genericasFueraDeLugar === 0, `${genericasFueraDeLugar} secretas o poscomuniones de días con Misa caen aún al genérico`);

// Cada Domingo después de la Trinidad mapeado tiene SU Misa romana: la del mapa de import-do.js (que sale de las colectas del Misal).
const mapa = JSON.parse(fs.readFileSync(R + 'misal-tools/trinidad-do.json', 'utf8'));
F(Object.keys(mapa).length === 23, `el mapa de la Trinidad debería tener 23 domingos y tiene ${Object.keys(mapa).length}`);
for (const [clave, rel] of Object.entries(mapa)) {
  const n = +clave.replace('trinity', ''), m = +/Pent(\d\d)-0/.exec(rel)[1];
  F(n === 2 ? m === 2 : m === n - 1, `${clave} apunta a ${rel}: el desfase no es el medido (trinityN = Pentecostés N−1 desde trinity4)`);
  F(con.DO.fuente['secret.' + clave] === rel, `${clave}: la secreta no viene de ${rel}`);
  for (const p of PARTES) F(con.DO[p][clave], `${clave}: falta ${p}`);
}

// 5. Idéntico a lo que genera el importador (solo si está la carpeta de Divinum Officium).
const CACHE = process.argv[2] || process.env.DO_CACHE;
if (CACHE && fs.existsSync(path.join(CACHE, 'Espanol'))) {
  process.argv[2] = CACHE; process.env.DO_CACHE = CACHE;
  const imp = require('./import-do.js');
  Object.assign(imp.TRINIDAD, mapa);
  const esperado = imp.archivo(imp.construir()).replace(/\r\n/g, '\n'), actual = fs.readFileSync(R + 'js/propers-do.js', 'utf8').replace(/\r\n/g, '\n');
  F(esperado === actual, 'js/propers-do.js ya no coincide con lo que genera misal-tools/import-do.js (volver a ejecutarlo)');
} else console.log('nota: sin la carpeta de Divinum Officium no se comprobó que propers-do.js coincida con el importador');

console.log(`Propios de Divinum Officium: ${dias} días × ${PARTES.length} piezas, ${Object.keys(mapa).length} domingos de la Trinidad mapeados: ${fallos.length ? fallos.length + ' fallo(s)' : 'sin fallos'}`);
for (const f of fallos.slice(0, 8)) console.log('  FALLA  ' + f);
process.exit(fallos.length ? 1 : 0);
