// Genera js/propers-do.js: los propios de la Misa (introito, gradual/tracto, ofertorio, comunión, secreta y poscomunión) que el
// Misal Anglicano impreso de 2013 no trae, tomados EN ESPAÑOL de Divinum Officium (licencia MIT), sin añadir ni cambiar palabras.
// Uso: node misal-tools/import-do.js <carpeta con Espanol/Tempora, Espanol/Sancti y Espanol/Ordo>   (o DO_CACHE=<carpeta>)
// Las carpetas se bajan de https://github.com/DivinumOfficium/divinum-officium (web/www/missa/Espanol/...). Los archivos se tratan
// como DATOS: se leen y se copian, nunca se ejecutan. Todo lo que no se puede resolver sin adivinar se OMITE y se cuenta: así lo que
// falte sigue faltando (Propers.MISSING_TEXTS) y no se inventa nada. propers.js solo usa estos textos donde el Misal impreso no
// trae el suyo.
'use strict';
const fs = require('fs');
const path = require('path');

const CACHE = process.argv[2] || process.env.DO_CACHE;
const SALIDA = path.join(__dirname, '..', 'js', 'propers-do.js');

// ── Qué archivo de Divinum Officium corresponde a cada clave del calendario de la raíz (js/calendar.js) ────────────────────────
// Los domingos después de la Trinidad se reparten POR LA COLECTA que imprime el Misal (decisión del usuario, 2026-11-02): cada
// domingo recibe la Misa romana cuya colecta es la misma que la suya, para que la secreta y la poscomunión vayan con ella.
const TRINIDAD = {};   // trinityN → 'Tempora/PentNN-0' (se rellena abajo)
const TIEMPOS = {
  epi1: 'Tempora/Epi1-0', epi2: 'Tempora/Epi2-0', epi3: 'Tempora/Epi3-0', epi4: 'Tempora/Epi4-0', epi5: 'Tempora/Epi5-0', epi6: 'Tempora/Epi6-0',
  septuagesima: 'Tempora/Quadp1-0', sexagesima: 'Tempora/Quadp2-0', quinquagesima: 'Tempora/Quadp3-0', ashWednesday: 'Tempora/Quadp3-3',
  lent1: 'Tempora/Quad1-0', lent2: 'Tempora/Quad2-0', lent3: 'Tempora/Quad3-0', lent4: 'Tempora/Quad4-0', lent5: 'Tempora/Quad5-0',
  palmSunday: 'Tempora/Quad6-0', mondayHolyWeek: 'Tempora/Quad6-1', tuesdayHolyWeek: 'Tempora/Quad6-2', wednesdayHolyWeek: 'Tempora/Quad6-3',
  maundyThursday: 'Tempora/Quad6-4', corpusChristi: 'Tempora/Pent01-4', sacredHeart: 'Tempora/Pent02-5',
};
// Fiestas fijas no marianas: clave del calendario → [archivo, título esperado]. El título se comprueba para no cargar la fiesta de otro día
// (p. ej. Felipe y Santiago es el 1 de mayo para los anglicanos y el 11 de mayo en el Misal Romano de 1962).
const FIJAS = {
  '02-24': ['Sancti/02-24', /Mat[ií]as/i], '03-19': ['Sancti/03-19', /Jos[eé]/i], '04-25': ['Sancti/04-25', /Marcos/i], '05-01': ['Sancti/05-11', /Felipe/i],
  '06-11': ['Sancti/06-11', /Bernab[eé]/i], '06-24': ['Sancti/06-24', /Juan/i], '06-29': ['Sancti/06-29', /Pedro/i], '07-25': ['Sancti/07-25', /Santiago/i],
  '08-06': ['Sancti/08-06', /Transfiguraci/i], '08-24': ['Sancti/08-24', /Bartolom/i], '09-14': ['Sancti/09-14', /Cruz/i], '09-21': ['Sancti/09-21', /Mateo/i],
  '09-29': ['Sancti/09-29', /Miguel|[ÁA]ngeles/i], '10-18': ['Sancti/10-18', /Lucas/i], '10-28': ['Sancti/10-28', /Sim[oó]n/i], '11-01': ['Sancti/11-01', /Santos/i],
  '11-30': ['Sancti/11-30', /Andr[eé]s/i], '12-21': ['Sancti/12-21', /Tom[aá]s/i], '12-26': ['Sancti/12-26', /Esteban/i], '12-27': ['Sancti/12-27', /Juan/i],
  '12-28': ['Sancti/12-28', /Inocentes/i],
};
// Conclusiones de las oraciones: el propio Divinum Officium las da como macros ($Per Dominum…); aquí solo se aceptan estas.
const MACROS = ['Per Dominum', 'Per Dominum eiusdem', 'Qui cum Patre', 'Per eumdem', 'Per eundem', 'Qui vivis', 'Qui tecum', 'Qui tecum eiusdem'];

// ── Lectura de los archivos ──────────────────────────────────────────────────────────────────────────────────────────────────
const cacheArchivos = new Map();
function secciones(rel) {
  if (cacheArchivos.has(rel)) return cacheArchivos.get(rel);
  const f = path.join(CACHE, 'Espanol', rel + '.txt');
  let s = null;
  if (fs.existsSync(f)) {
    s = {};
    let cur = null;
    for (const l of fs.readFileSync(f, 'utf8').replace(/\r/g, '').replace(/­/g, '').split('\n')) {
      const m = /^\[([^\]]+)\]\s*$/.exec(l);
      if (m) { cur = m[1]; s[cur] = []; }
      else if (cur) s[cur].push(l);
      // Una primera línea «@Archivo» (antes de toda sección) es la regla de Divinum Officium para que el archivo herede de ese otro
      // lo que no trae: p. ej. el domingo XXIV hereda los cantos del XXIII, y el III remite a su variante Pent03-0r.
      else if (/^@[^:\s]+\s*$/.test(l.trim())) s.__hereda = l.trim().slice(1);
    }
  }
  cacheArchivos.set(rel, s);
  return s;
}
const motivos = {};
const omite = (motivo) => { motivos[motivo] = (motivos[motivo] || 0) + 1; return null; };
const macros = () => secciones('Ordo/Prayers');

// Líneas de una sección con las referencias (@Archivo:Sección) ya resueltas, o null si no se puede sin adivinar.
function lineas(rel, sec, prof = 0) {
  const s = secciones(rel);
  if (!s) return null;
  if (prof > 4) return null;
  if (!s[sec]) return s.__hereda ? lineas(s.__hereda, sec, prof + 1) : null;
  const out = [];
  for (const raw of s[sec]) {
    const l = raw.trim();
    if (!l || l.startsWith('#')) continue;
    if (/^\(.*\)$|^\(/.test(l)) return omite('condicional de rúbrica');
    if (l.startsWith('@')) {
      const m = /^@([^:]+)(?::([^:]+))?$/.exec(l);
      if (!m) return omite('referencia con sustitución');
      const r = lineas(m[1], m[2] || sec, prof + 1);
      if (!r) return omite('referencia sin resolver');
      out.push(...r);
      continue;
    }
    out.push(l);
  }
  return out;
}
const macro = (nombre) => {
  const ls = macros() && macros()[nombre];
  return ls ? ls.map(x => x.trim()).filter(Boolean).map(x => x.replace(/^[rR]\.\s*/, '')).join(' ') : null;
};
// Texto corrido de una sección: sin citas bíblicas (!…), sin la marca &Gloria, con las conclusiones expandidas.
function texto(rel, sec) {
  const ls = lineas(rel, sec);
  if (!ls) return null;
  const partes = [];
  for (const l of ls) {
    if (l.startsWith('!') || l === '&Gloria') continue;
    if (l.startsWith('$')) {
      const nombre = l.slice(1).trim();
      const t = MACROS.includes(nombre) ? macro(nombre) : null;
      if (!t) return omite('macro desconocida');
      partes.push(t);
      continue;
    }
    partes.push(l.replace(/^v\.\s*/, '').replace(/^V\.\s*/, '℣. ').replace(/^R\.\s*/, '℟. '));
  }
  const t = partes.join(' ').replace(/\s+/g, ' ').trim();
  if (!t || /[$@&<>{}]/.test(t) || /^\(|\[/.test(t)) return omite('marcas sin resolver');
  return t;
}

// ── Piezas ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
function introito(rel) {
  const ls = lineas(rel, 'Introitus');
  if (!ls) return null;
  const primera = ls.filter(l => !l.startsWith('!') && l !== '&Gloria')[0];
  if (!primera) return omite('introito vacío');
  const ant = primera.replace(/^v\.\s*/, '').trim();
  return /[$@&]/.test(ant) ? omite('marcas sin resolver') : { ant };
}
function gradual(rel) {
  const tracto = texto(rel, 'Tractus');
  if (tracto) return { type: 'tract', text: tracto };
  const g = texto(rel, 'Graduale');
  if (!g) return null;
  return { type: /^Aleluya/.test(g) ? 'alleluia' : 'gradual', text: g };
}
const PIEZAS = {
  introit: introito,
  gradual: gradual,
  offertory: rel => texto(rel, 'Offertorium'),
  communion: rel => texto(rel, 'Communio'),
  secret: rel => texto(rel, 'Secreta'),
  postcommunion: rel => texto(rel, 'Postcommunio'),
};

// Erratas de puntuación de la fuente (autorizadas por el usuario, 2026-11-08). Única excepción a «copiar sin cambiar»:
// [parte, clave, texto de la fuente, texto corregido]. Si la fuente cambia y el texto ya no está, construir() falla.
const CORRECCIONES = [
  ['offertory', 'epi3', 'me ha salvado» No moriré', 'me ha salvado. No moriré'], // «» de cierre sin apertura
  ['offertory', '11-30', 'Oh Dios! Veo', '¡Oh Dios! Veo'], // falta el «¡» de apertura
];

function construir() {
  const datos = { introit: {}, gradual: {}, offertory: {}, communion: {}, secret: {}, postcommunion: {} };
  const fuente = {};
  const intenta = (clave, rel) => {
    for (const [parte, f] of Object.entries(PIEZAS)) {
      const v = f(rel);
      if (v) { datos[parte][clave] = v; fuente[parte + '.' + clave] = rel; }
    }
  };
  for (const [clave, rel] of Object.entries(TRINIDAD)) intenta(clave, rel);
  for (const [clave, rel] of Object.entries(TIEMPOS)) intenta(clave, rel);
  for (const [clave, [rel, titulo]] of Object.entries(FIJAS)) {
    const s = secciones(rel);
    if (!s || !s.Officium || !titulo.test(s.Officium.join(' '))) { omite('fiesta fija con otro título'); continue; }
    intenta(clave, rel);
  }
  for (const [parte, clave, viejo, nuevo] of CORRECCIONES) {
    const v = datos[parte] && datos[parte][clave];
    if (!v || !v.includes(viejo)) throw new Error(`CORRECCIONES: ya no aparece «${viejo}» en ${parte}.${clave}; revisar la tabla`);
    datos[parte][clave] = v.replace(viejo, nuevo);
  }
  return { datos, fuente };
}

const CABECERA = `/* GENERADO por misal-tools/import-do.js; NO editar a mano. Se regenera con el mismo script.
 *
 * Propios de la Misa (introito, gradual o tracto, ofertorio, comunión, secreta y poscomunión) tomados EN ESPAÑOL de Divinum Officium,
 * https://github.com/DivinumOfficium/divinum-officium (web/www/missa/Espanol), sin añadir ni cambiar palabras. Son traducción de
 * terceros, de calidad y registro no auditados (el propio proyecto los da como «still under development»); el Misal Anglicano
 * impreso de 2013, que es la fuente autorizada, manda siempre: js/propers.js solo usa estos textos donde ese Misal no trae el suyo.
 * Los domingos después de la Trinidad se reparten por la colecta que imprime el Misal (decisión del usuario, 2026-11-02).
 *
 * MIT License
 *
 * Copyright (c) 2026 Divinum Officium
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT
 * SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
`;

function archivo(r) {
  return CABECERA + 'const PROPERS_DO = ' + JSON.stringify({ ...r.datos, fuente: r.fuente }, null, 1) + ';\n';
}

module.exports = { construir, archivo, TRINIDAD, TIEMPOS, FIJAS };

if (require.main === module) {
  if (!CACHE || !fs.existsSync(path.join(CACHE, 'Espanol'))) { console.error('Falta la carpeta con Espanol/Tempora… (argumento 1 o DO_CACHE)'); process.exit(1); }
  const mapa = path.join(__dirname, 'trinidad-do.json');
  if (fs.existsSync(mapa)) Object.assign(TRINIDAD, JSON.parse(fs.readFileSync(mapa, 'utf8')));
  const r = construir();
  fs.writeFileSync(SALIDA, archivo(r), 'utf8');
  const cuenta = Object.fromEntries(Object.entries(r.datos).map(([k, v]) => [k, Object.keys(v).length]));
  console.log('escrito js/propers-do.js:', JSON.stringify(cuenta));
  console.log('omitido:', JSON.stringify(motivos));
}
