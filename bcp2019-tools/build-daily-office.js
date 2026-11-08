// Genera bcp2019/js/daily-office.js, la tabla del Leccionario del Oficio Diario del BCP 2019 por fecha, a partir de
// bcp2019-tools/data/daily-office.json (que sale del PDF oficial con bcp2019-tools/extract-daily-office.py).
// Solo normaliza la FORMA de las citas (abreviaturas de libro → nombre completo en inglés, que es el que entiende
// BibliaJerusalen; «—» → «-»; «Job 25 & 26» → «Job 25-26»); no añade, quita ni cambia ninguna lectura. Lo que el PDF no
// deja normalizar sin adivinar hace fallar el script. test-bcp2019.js (15) comprueba que el archivo sigue siendo idéntico
// a lo que genera este script.
// Uso: node bcp2019-tools/build-daily-office.js
'use strict';
const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, 'data', 'daily-office.json');
const SALIDA = path.join(__dirname, '..', 'bcp2019', 'js', 'daily-office.js');

// Abreviatura del PDF → nombre completo en inglés (el de BOOK_MAP en js/lib/biblia-wrapper.js, o uno que
// daily-office.js traduce a la Biblia de Jerusalén).
const LIBROS = {
  Gen: 'Genesis', Exod: 'Exodus', Lev: 'Leviticus', Num: 'Numbers', Deut: 'Deuteronomy', Josh: 'Joshua', Judg: 'Judges', Ruth: 'Ruth',
  '1 Sam': '1 Samuel', '2 Sam': '2 Samuel', '1 Kings': '1 Kings', '2 Kings': '2 Kings', '1 Chron': '1 Chronicles', '2 Chron': '2 Chronicles',
  Ezra: 'Ezra', Neh: 'Nehemiah', Esth: 'Esther', Job: 'Job', Prov: 'Proverbs', Eccl: 'Ecclesiastes', 'Song of Songs': 'Song of Songs',
  Isa: 'Isaiah', Jer: 'Jeremiah', Lam: 'Lamentations', Ezek: 'Ezekiel', Dan: 'Daniel', Hos: 'Hosea', Joel: 'Joel', Amos: 'Amos',
  Obadiah: 'Obadiah', Jonah: 'Jonah', Mic: 'Micah', Nahum: 'Nahum', Hab: 'Habakkuk', Zeph: 'Zephaniah', Hag: 'Haggai', Zech: 'Zechariah', Mal: 'Malachi',
  Judith: 'Judith', Wisdom: 'Wisdom', Ecclesiasticus: 'Sirach', Baruch: 'Baruch', '1 Macc': '1 Maccabees', '2 Macc': '2 Maccabees',
  Matt: 'Matthew', Mark: 'Mark', Luke: 'Luke', John: 'John', Acts: 'Acts', Rom: 'Romans', '1 Cor': '1 Corinthians', '2 Cor': '2 Corinthians',
  Gal: 'Galatians', Eph: 'Ephesians', Phil: 'Philippians', Col: 'Colossians', '1 Thess': '1 Thessalonians', '2 Thess': '2 Thessalonians',
  '1 Tim': '1 Timothy', '2 Tim': '2 Timothy', Titus: 'Titus', Philemon: 'Philemon', Heb: 'Hebrews', Jas: 'James', '1 Pet': '1 Peter', '2 Pet': '2 Peter',
  '1 John': '1 John', '2 John': '2 John', '3 John': '3 John', Jude: 'Jude', Rev: 'Revelation',
};
// Libros de un solo capítulo: la cita es el libro entero.
const UN_CAPITULO = new Set(['Obadiah', 'Philemon', '2 John', '3 John', 'Jude']);

// Erratas del PDF que se corrigen al copiar (solo la forma de la cita): el PDF escribe «Luke:23:26-49» (dos veces).
const ERRATAS = { 'Luke:23:26-49': 'Luke 23:26-49' };

function normalizarCita(cruda, donde) {
  let r = ERRATAS[cruda] || cruda;
  r = r.replace(/\s*[—–]\s*/g, '-').replace(/-(\d+) end$/, '-$1:end').replace(/\s+/g, ' ').trim();
  // «Acts 6:8-7:6, 7:44-60» → sin espacio tras la coma.
  r = r.replace(/,\s+/g, ',');
  if (r === 'Susanna') return { ref: 'Daniel 13', label: 'Susana (Daniel 13)' };
  const m = /^((?:[1-3] )?[A-Za-z]+(?: of Songs)?)(?: (\d.*))?$/.exec(r);
  if (!m) throw new Error(`${donde}: no sé leer la cita «${cruda}»`);
  const libro = LIBROS[m[1]] || (Object.values(LIBROS).includes(m[1]) ? m[1] : null);   // el PDF a veces escribe el nombre completo (James)
  if (!libro) throw new Error(`${donde}: libro desconocido «${m[1]}» en «${cruda}»`);
  let resto = m[2];
  if (resto === undefined) {
    if (!UN_CAPITULO.has(m[1])) throw new Error(`${donde}: «${cruda}» no trae capítulo`);
    return { ref: `${libro} 1:1-end` };
  }
  resto = resto.replace(/^(\d+) & (\d+)$/, '$1-$2');       // «Job 25 & 26» → capítulos 25 a 26
  if (!/^\d+(?::\d+(?:-(?:\d+(?::(?:\d+|end))?|end))?(?:,\d+(?::\d+)?(?:-\d+(?::\d+)?)?)*)?(?:-\d+)?$/.test(resto)) throw new Error(`${donde}: la cita «${cruda}» queda como «${resto}», que no entiendo`);
  return { ref: `${libro} ${resto}` };
}

// El PDF marca con † los capítulos que pueden abreviarse: «2 Chron 29 † 1-11,20-30,35-36». Aquí la forma abreviada es
// los mismos capítulo y versículos; se guarda aparte (`abrev`) y la liturgia avisa de que puede abreviarse.
function leccion(l, donde) {
  const c = normalizarCita(l.ref, donde);
  const out = { ref: c.ref };
  if (c.label) out.label = c.label;
  if (l.abrev) {
    if (!/^[\d,\-: ]+$/.test(l.abrev) || !/^[A-Za-z0-9 ]+ \d+$/.test(c.ref)) throw new Error(`${donde}: la abreviatura «${l.abrev}» de «${l.ref}» no es de un capítulo entero`);
    out.abrev = l.abrev.replace(/\s+/g, '');
  }
  return out;
}

function salmos(lista, donde) {
  const out = []; let alt = false;
  for (const s0 of lista) {
    for (const [i, s] of s0.split(/\s+or\s+/).entries()) {
      if (i > 0) alt = true;
      const m = /^(\d+)(?::(\d+-\d+))?v?$/.exec(s.trim());
      if (!m) throw new Error(`${donde}: salmo «${s}» ilegible`);
      out.push(`Psalm ${m[1]}${m[2] ? ':' + m[2] : ''}`);
    }
  }
  return { psalms: out, alt };
}

function construir() {
  const crudo = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const tabla = {};
  for (const [mes, dias] of Object.entries(crudo)) {
    for (const [dia, v] of Object.entries(dias)) {
      const k = `${mes}-${dia.padStart(2, '0')}`;
      const t = {};
      if (v.name) t.name = v.name;
      for (const of of ['mp', 'ep']) {
        const donde = `${k} ${of}`;
        const s = salmos(v[of].psalms, donde);
        t[of] = { first: leccion(v[of].first, donde + ' 1.ª lección'), second: leccion(v[of].second, donde + ' 2.ª lección'), psalms: s.psalms };
        if (s.alt) t[of].psalmsOr = true;
      }
      tabla[k] = t;
    }
  }
  return tabla;
}

function archivo(tabla) {
  const filas = Object.keys(tabla).sort().map(k => `    ${JSON.stringify(k)}: ${JSON.stringify(tabla[k])},`).join('\n');
  return `/**
 * daily-office.js — Leccionario del Oficio Diario del BCP 2019 (ACNA), por fecha.
 * GENERADO por bcp2019-tools/build-daily-office.js desde bcp2019-tools/data/daily-office.json, que sale del PDF oficial
 * «Daily Office Lectionary» (St. Andrew's Day Final Revision, 2018) con bcp2019-tools/extract-daily-office.py. NO editar a mano.
 *
 * Son CITAS bíblicas: el texto sale de la Biblia de Jerusalén. Cada día del año (366, con el 29 de febrero) trae las lecciones de
 * la Oración Matutina (mp) y la Vespertina (ep), primera y segunda, y el salmo o salmos del ciclo de 60 días. La Eucaristía de una
 * feria sin lecturas propias las ofrece todas y el celebrante elige (decisión del usuario, 2026-11-07). \`abrev\` es el pasaje que
 * el PDF marca con † como forma abreviada de un capítulo; \`label\` es el rótulo del PDF cuando la cita se tradujo a la Biblia
 * de Jerusalén (Susana es Daniel 13). Las citas de salmo con «v» del PDF (numeración del Salterio New Coverdale) van sin ella.
 */

const BCPDailyOffice = (() => {
  const TABLE = {
${filas}
  };

  // Libros que BibliaJerusalen.getPassage no conoce por su nombre inglés: se piden por el nombre que tienen en esa Biblia.
  const FETCH_ALIAS = { Esther: 'Ester', Judith: 'Judit', '1 Maccabees': 'I Macabeos', '2 Maccabees': 'II Macabeos' };

  /** La entrada del día \`date\` (Date) o null. */
  function get(date) {
    const k = String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    return TABLE[k] || null;
  }

  /** La cita tal como se pide a BibliaJerusalen / fetchScripture: «end» pasa a un versículo final que no existe (999). */
  function fetchRef(ref) {
    let r = ref.replace(/(:|-)end$/, '$1999');
    for (const [en, es] of Object.entries(FETCH_ALIAS)) if (r.startsWith(en + ' ')) r = es + r.slice(en.length);
    return r;
  }

  /** La cita tal como se imprime, sin traducir el libro (eso lo hace translateBibleReference): «end» pasa a «fin». */
  function shownRef(ref) {
    return ref.replace(/^(Obadiah|Philemon|Jude|[1-3] John) 1:1-end$/, '$1').replace(/-end$/, '-fin').replace(/:end$/, ':fin');
  }

  return { TABLE, get, fetchRef, shownRef };
})();
`;
}

module.exports = { construir, archivo, JSON_PATH, SALIDA };

if (require.main === module) {
  const tabla = construir();
  fs.writeFileSync(SALIDA, archivo(tabla));
  console.log(`escrito ${path.relative(process.cwd(), SALIDA)}: ${Object.keys(tabla).length} días`);
}
