// test-bcp2019.js — Prueba de completitud del generador del Libro de Oración Común (2019).
// Uso: node test-bcp2019.js [añoIni=2024] [añoFin=2060]      (código de salida 1 si algo falla)
//
// Carga los módulos REALES de bcp2019/js (con app.js, Librito y la Biblia de Jerusalén) en un contexto
// vm y barre años enteros, porque los fallos de este proyecto no lanzan excepciones: un dato ausente o
// equivocado se imprime tan limpio como el correcto. Comprueba, por orden:
//   1. Mecánica: ningún día lanza, deja una marca de fallo, ni se queda sin colecta, prefacio, primera
//      lectura o Evangelio (salvo Viernes y Sábado Santo, que no tienen Eucaristía).
//   2. Citas: cada cita del leccionario devuelve texto de la Biblia de Jerusalén.
//   3. Leccionario = libro: bcp2019/js/lectionary.js coincide con lo que genera
//      bcp2019-tools/build-lectionary.js desde las tablas oficiales (pp. 717-733).
// Al final lista los PENDIENTES CONOCIDOS, que no son fallos de esta prueba pero tampoco están completos.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BCP = path.join(__dirname, 'bcp2019', 'js') + path.sep;
const LIB = path.join(__dirname, 'js', 'lib') + path.sep;
const Y0 = +(process.argv[2] || 2024), Y1 = +(process.argv[3] || 2060);

function load() {
  const noop = () => ({ classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} }, style: {}, addEventListener() {}, appendChild() {}, remove() {}, querySelector() { return null; }, querySelectorAll() { return []; }, setAttribute() {}, scrollIntoView() {}, value: '', textContent: '', innerHTML: '' });
  const warns = [];
  const ctx = { console: { log() {}, info() {}, debug() {}, warn: (...a) => warns.push(a.join(' ')), error: (...a) => warns.push('ERROR ' + a.join(' ')) },
    Date, Math, JSON, Object, Array, String, Number, RegExp, Map, Set, Promise, Boolean, Error, parseInt, parseFloat, isNaN, setTimeout, clearTimeout, Symbol, Intl };
  ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx; ctx.navigator = {};
  ctx.document = { addEventListener() {}, getElementById: noop, querySelectorAll: () => [], querySelector: () => null, createElement: noop, body: noop() };
  vm.createContext(ctx);
  const mod = { exports: {} };
  new Function('module', 'exports', fs.readFileSync(LIB + 'biblia-de-jerusalen.min.js', 'utf8'))(mod, mod.exports);
  ctx._BibliaInstance = new mod.exports.Bible();
  vm.runInContext(fs.readFileSync(LIB + 'biblia-wrapper.js', 'utf8') + '\n;', ctx, { filename: 'biblia-wrapper.js' });
  for (const f of ['calendar.js', 'lectionary.js', 'propers.js', 'eucharist.js', 'utils.js', 'app.js', 'librito-pueblo.js']) {
    vm.runInContext(fs.readFileSync(BCP + f, 'utf8') + '\n;', ctx, { filename: f });
  }
  const get = n => vm.runInContext(`typeof ${n} !== 'undefined' ? ${n} : undefined`, ctx);
  return { ctx, warns, get, state: () => vm.runInContext('currentMassState', ctx) };
}

const C = load();
const Cal = C.get('BCPCalendar'), Lect = C.get('BCPLectionary'), Prop = C.get('BCPPropers');
const Librito = C.get('BCPLibrito'), generateLiturgy = C.get('generateLiturgy'), fetchScripture = C.get('fetchScripture'), noEucharistNotice = C.get('noEucharistNotice');
const strip = h => String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Salmo listo para mostrar: sin título pegado al v. 1 y sin versículos repetidos (etiquetas estrictamente crecientes).
const TITULO_SALMO = /^(Salmo|De David|De Asaf|De Salomón|De Moisés|De los hijos|Del maestro|Canción|Oración|Himno|Poema|A media voz|Cántico)[\s.,]/;
function psalmProblem(verses) {
  if (!verses || !verses.length) return '';
  if (verses[0].h === '1' && TITULO_SALMO.test(strip(verses[0].content))) return `título pegado al v. 1: «${strip(verses[0].content).slice(0, 40)}…»`;
  for (let i = 1; i < verses.length; i++) if (+verses[i].v <= +verses[i - 1].v) return `versículo repetido o fuera de orden (${verses[i - 1].v} → ${verses[i].v})`;
  return '';
}

// Saludo del Día de Pentecostés (Saludos para los Tiempos Litúrgicos, p. 146; LOC-10-10-23.md l. 3789-3796), tal como
// lo imprime el libro. Debe salir completo y en orden, no solo su primera línea.
const JOEL = ['Derramaré mi Espíritu sobre todo el género humano.', 'Y los hijos y las hijas de ustedes profetizarán.', 'Tendrán sueños los ancianos', 'Y visiones los jóvenes.',
  'Entonces sabrán que yo estoy en medio de Israel,', 'Que yo soy el Señor su Dios y no hay otro fuera de Mí', 'Y esto sucederá', 'Que todo el que invoque el Nombre del Señor será salvado.'];
function joelCompleto(txt) { let p = 0; for (const l of JOEL) { const i = txt.indexOf(l, p); if (i < 0) return false; p = i + l.length; } return true; }

const results = [];
function check(name, failures, total) {
  results.push({ name, fails: failures.length, total, examples: failures.slice(0, 4) });
}
const MARKS = [/\[Lectura no especificada/, /\[Primera lectura no especificada/, /\[Evangelio no especificado/, /no especificad/, /\[Error/, /\bundefined\b/, /\bNaN\b/, /\[object/, /\bnull\b/,
  /Lectura truncada/, /no disponible/, /Referencia no reconocida/, /Libro no encontrado/, /No se encontr/, /Colecta no disponible/, /Invalid Date/];
const ERR_IN_TEXT = /Referencia no reconocida|Libro no encontrado|No se encontr|no cargada|Lectura no especificada/;

(async () => {
  // ── 1. Mecánica ──────────────────────────────────────────────────────────
  const f = { excepcion: [], marcas: [], sinColecta: [], sinPrefacio: [], sinLecturas: [], sinPrimera: [], sinEvangelio: [], sinSalmo: [], noEucaristiaSinAviso: [], noEucaristiaConMisa: [], gloria: [], salmoMal: [], aclamacion: [], fraccion: [], despedida: [], salmoAlterna: [] };
  let days = 0, borrowed = 0, noEu = 0, inheritFallback = 0;
  for (let d = new Date(Y0, 0, 1, 12); d.getFullYear() <= Y1; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)) {
    days++;
    const date = iso(d);
    let html, st;
    try { html = await generateLiturgy(d); st = C.state(); } catch (e) { f.excepcion.push(date + ' ' + e.message); continue; }
    const text = strip(html);
    const bad = MARKS.find(rx => rx.test(text));
    if (bad) f.marcas.push(date + ' ' + bad);
    if (st.borrowedFromSunday) borrowed++;
    if (st.dayInfo.inherits && st.collect && Prop.COLLECTS[st.dayInfo.inherits] === undefined) inheritFallback++;
    if (!st.collect || !strip(st.collect)) f.sinColecta.push(date);
    if (!st.preface || !strip(st.preface.text || '')) f.sinPrefacio.push(date);
    if (noEucharistNotice(st.dayInfo)) {
      noEu++;
      if (!/no se celebra|No hay celebración/.test(text)) f.noEucaristiaSinAviso.push(date);
      if (/ORACIÓN DE CONSAGRACIÓN/.test(text)) f.noEucaristiaConMisa.push(date);
      continue;
    }
    // Gloria: el libro solo dice que es apropiado omitirlo en los tiempos de penitencia y días de ayuno, y no nombra
    // el Adviento. DECISIÓN DEL USUARIO (2026-11-02): se omite también en Adviento, por costumbre. Se omite en
    // Adviento, Cuaresma y Semana Santa, salvo Jueves Santo y fiestas fijas; la rúbrica impresa nombra el tiempo real.
    const gloriaOmitido = /se omite el Gloria in excelsis/.test(text);
    const debeOmitir = ['advent', 'lent', 'holyWeek'].includes(st.dayInfo.season) && !st.dayInfo.isFixed && st.dayInfo.key !== 'maundyThursday';
    if (gloriaOmitido !== debeOmitir) f.gloria.push(`${date} ${st.dayInfo.key} (${st.dayInfo.season}): ${gloriaOmitido ? 'omitido' : 'presente'}`);
    if (debeOmitir && gloriaOmitido && !(st.dayInfo.season === 'advent' ? /en Adviento se omite el Gloria/ : /en Cuaresma se omite el Gloria/).test(text)) f.gloria.push(`${date} ${st.dayInfo.key} (${st.dayInfo.season}): la rúbrica nombra otro tiempo`);
    // Aclamación, Fracción y Despedida según el tiempo (comprobación 6). Se lee el HTML ya armado.
    {
      const s = st.dayInfo.season, k = st.dayInfo.key;
      const am = /LA ACLAMACIÓN<\/h4>([\s\S]*?)(?=<h[34])/.exec(html), fr = /LA FRACCIÓN<\/h3>([\s\S]*?)(?=ORACIÓN DE HUMILDE ACCESO)/.exec(html), dm = /LA BENDICIÓN Y LA DESPEDIDA<\/h3>([\s\S]*)$/.exec(html);
      const acl = !am ? 'ausente' : /Derramaré mi Espíritu/.test(am[1]) ? (joelCompleto(strip(am[1])) ? 'pentecostes' : 'pentecostes-incompleto') : /Bendito sea nuestro Dios/.test(am[1]) ? 'semana-santa' : /Bendigamos al Señor que perdona/.test(am[1]) ? 'cuaresma' : /Cristo ha resucitado/.test(am[1]) ? 'pascua' : /Bendito sea Dios: Padre/.test(am[1]) ? 'ordinaria' : 'desconocida';
      const aclEsp = k === 'pentecost' ? 'pentecostes' : s === 'holyWeek' ? 'semana-santa' : s === 'lent' ? 'cuaresma' : s === 'easter' ? 'pascua' : 'ordinaria';
      if (acl !== aclEsp) f.aclamacion.push(`${date} ${k} (${s}): ${acl}, debía ser ${aclEsp}`);
      const conAleluyaFr = !!fr && /\[Aleluya\.\]/.test(fr[1]), debeAleluyaFr = !['lent', 'holyWeek'].includes(s);
      if (conAleluyaFr !== debeAleluyaFr) f.fraccion.push(`${date} ${k} (${s}): ${conAleluyaFr ? 'con' : 'sin'} Aleluya`);
      const conAleluyaDesp = !!dm && /aleluya, aleluya/i.test(dm[1]), debeAleluyaDesp = s === 'easter' || k === 'pentecost';
      if (conAleluyaDesp !== debeAleluyaDesp) f.despedida.push(`${date} ${k} (${s}): ${conAleluyaDesp ? 'con' : 'sin'} aleluya`);
      // El Librito no recalcula nada, pero decide estas tres cosas con su propio código: se mide igual.
      let lib = ''; try { lib = Librito.generateLibrito(st); } catch (e) { f.aclamacion.push(`${date} Librito lanzó: ${e.message}`); }
      // Salmo alternado: Lector el primer versículo que se muestra, Pueblo el siguiente, sin saltarse ninguno y en orden.
      if (st.psalmVerses && st.psalmVerses.length && st.readings) {
        const pm = /SALMO RESPONSORIAL<\/h3>([\s\S]*?)<\/div><\/div>/.exec(html);
        const rowsA = pm ? [...pm[1].matchAll(/<span class="lit-line (lector|pueblo)"><span class="lit-label">[^<]*<\/span><span class="lit-text"><sup class="verse-num">([^<]*)<\/sup>([\s\S]*?)<\/span><\/span>/g)].map(m => ({ role: m[1], v: m[2], t: strip(m[3]) })) : [];
        const lm2 = /<div class="librito-psalm">([\s\S]*?)<\/div>\s*(?=<\/div>|<div class="librito-|<h[23])/.exec(lib);
        const rowsB = [...lib.matchAll(/<div class="psalm-verse psalm-(lector|pueblo)"><p><span class="psalm-role">[^<]*<\/span> (?:<strong>)?<span class="verse-num">([^<]*)<\/span>([\s\S]*?)(?:<\/strong>)?<\/p><\/div>/g)].map(m => ({ role: m[1], v: m[2], t: strip(m[3]) }));
        const prob = (rows, donde) => {
          if (rows.length !== st.psalmVerses.length) return `${donde}: ${rows.length} versículos impresos de ${st.psalmVerses.length}`;
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].role !== (i % 2 === 0 ? 'lector' : 'pueblo')) return `${donde}: el versículo ${i + 1} lo dice ${rows[i].role}`;
            if (rows[i].v !== String(st.psalmVerses[i].v) || rows[i].t !== strip(st.psalmVerses[i].content)) return `${donde}: el versículo ${i + 1} no coincide con el de la Biblia`;
          }
          return '';
        };
        const p1 = prob(rowsA, 'liturgia'), p2 = prob(rowsB, 'Librito');
        if (p1) f.salmoAlterna.push(`${date} ${st.readings.psalm}: ${p1}`);
        if (p2) f.salmoAlterna.push(`${date} ${st.readings.psalm}: ${p2}`);
      }
      const lgl = /<h3>GLORIA IN EXCELSIS<\/h3>([\s\S]*?)(?=<h[23])/.exec(lib);
      if (lib && (!lgl || /se omite el Gloria in excelsis/.test(lgl[1]) !== debeOmitir)) f.gloria.push(`${date} ${k} (${s}) Librito: ${!lgl ? 'sin sección' : debeOmitir ? 'presente' : 'omitido'}`);
      const lam = /<h3>LA ACLAMACIÓN<\/h3>([\s\S]*?)(?=<h[23])/.exec(lib);
      const lacl = !lam ? 'ausente' : /Derramaré mi Espíritu/.test(lam[1]) ? (joelCompleto(strip(lam[1])) ? 'pentecostes' : 'pentecostes-incompleto') : /Bendito sea nuestro Dios/.test(lam[1]) ? 'semana-santa' : /Bendigamos al Señor que perdona/.test(lam[1]) ? 'cuaresma' : /Cristo ha resucitado/.test(lam[1]) ? 'pascua' : /Bendito sea Dios: Padre/.test(lam[1]) ? 'ordinaria' : 'desconocida';
      if (lib && lacl !== aclEsp) f.aclamacion.push(`${date} ${k} (${s}) Librito: ${lacl}, debía ser ${aclEsp}`);
      const lfr = /Celebrante: (\[Aleluya\.\] )?Cristo, nuestra Pascua/.exec(lib), ldm = /Salgamos en el Nombre de Cristo\.( Aleluya, aleluya\.)?/.exec(lib);
      if (lib && (!lfr || !!lfr[1] !== debeAleluyaFr)) f.fraccion.push(`${date} ${k} (${s}) Librito: ${!lfr ? 'sin Fracción' : lfr[1] ? 'con' : 'sin'} Aleluya`);
      if (lib && (!ldm || !!ldm[1] !== debeAleluyaDesp)) f.despedida.push(`${date} ${k} (${s}) Librito: ${!ldm ? 'sin Despedida' : ldm[1] ? 'con' : 'sin'} aleluya`);
    }
    if (!st.readings) { f.sinLecturas.push(date + ' ' + st.dayInfo.key); continue; }
    if (!st.firstReading || strip(st.firstReading.text || '').length < 40) f.sinPrimera.push(date + ' ' + st.readings.first);
    if (!st.gospel || strip(st.gospel.text || '').length < 40) f.sinEvangelio.push(date + ' ' + st.readings.gospel);
    if (st.readings.psalm && (!st.psalmVerses || !st.psalmVerses.length)) f.sinSalmo.push(date + ' ' + st.readings.psalm);
    const pp = psalmProblem(st.psalmVerses); if (pp) f.salmoMal.push(`${date} ${st.readings.psalm}: ${pp}`);
  }
  check(`1a. Sin excepciones (${days} días, ${Y0}-${Y1})`, f.excepcion, days);
  check('1b. Sin marcas de fallo en el HTML (16 patrones)', f.marcas, days);
  check('1c. Todo día tiene colecta', f.sinColecta, days);
  check('1d. Todo día tiene prefacio', f.sinPrefacio, days);
  check('1e. Todo día con Eucaristía tiene lecturas', f.sinLecturas, days - noEu);
  check('1f. …y primera lectura con texto', f.sinPrimera, days - noEu);
  check('1g. …y Evangelio con texto', f.sinEvangelio, days - noEu);
  check('1h. …y salmo con versículos', f.sinSalmo, days - noEu);
  check('1i. Viernes y Sábado Santo muestran el aviso sin Eucaristía', f.noEucaristiaSinAviso.concat(f.noEucaristiaConMisa), noEu);
  check('1j. Gloria: se omite en Adviento, Cuaresma y Semana Santa (salvo Jueves Santo y fiestas), en la liturgia y el Librito', f.gloria, days - noEu);
  check('1l. Salmo del día: sin título pegado al v. 1 ni versículos repetidos', f.salmoMal, days - noEu);
  // Libro: la Aclamación de Cuaresma rige «desde el Miércoles de Ceniza a la víspera del Domingo de Ramos»; la Semana
  // Santa tiene la suya («Bendito sea nuestro Dios»); la pascual va «desde el día de Resurrección hasta la Víspera de
  // Pentecostés», así que el Día de Pentecostés lleva el saludo de Joel (decisión del usuario, 2026-11-02; el libro
  // admite también la fija). La Fracción omite el Aleluya en Cuaresma y Semana Santa. La Despedida lleva «aleluya, aleluya» «desde la Vigilia Pascual hasta el Día de Pentecostés» inclusive.
  check('6a. Aclamación según el tiempo (Cuaresma / Semana Santa / Pascua hasta la víspera / saludo de Joel en Pentecostés)', f.aclamacion, days - noEu);
  check('6b. Fracción sin Aleluya en Cuaresma y Semana Santa, con él en el resto', f.fraccion, days - noEu);
  check('6c. Despedida con «aleluya, aleluya» de Pascua al Día de Pentecostés inclusive', f.despedida, days - noEu);
  check('7. Salmo alternado Lector/Pueblo por versículos, completo y en orden (liturgia y Librito)', f.salmoAlterna, days - noEu);

  // ── 1k. Fiestas fijas en domingo ─────────────────────────────────────────
  // Fuera de Adviento, Cuaresma y Pascua el libro permite observarlas ese domingo o trasladarlas al día de semana
  // siguiente: se trasladan (una sola vez, dentro de los 7 días siguientes). Dentro de esos tiempos no.
  const mal = []; let fiestasDomingo = 0;
  for (let y = Y0; y <= Y1; y++) {
    const F = Cal.getFeastDates(y);
    for (const md of Object.keys(Cal.FIXED_FEASTS)) {
      if (md === '11-01' || md === '01-01') continue; // Todos los Santos prevalece; el Santo Nombre compite con el 2.º Domingo de Navidad
      const [mm, dd] = md.split('-').map(Number);
      const d = new Date(y, mm - 1, dd, 12);
      if (d.getDay() !== 0) continue;
      fiestasDomingo++;
      const dia0 = new Date(y, mm - 1, dd);
      const enATP = (dia0 >= F.advent1 && dia0 < F.christmas) || (dia0 >= F.ashWednesday && dia0 < F.easter) || (dia0 >= F.easter && dia0 <= F.pentecost);
      const hits = [];
      for (let k = 1; k <= 7; k++) { const di = Cal.getDay(new Date(y, mm - 1, dd + k, 12)); if (di.key === md) hits.push(di); }
      if (enATP ? hits.length !== 0 : !(hits.length === 1 && hits[0].isTransferred)) mal.push(`${y}-${md}: ${hits.length} apariciones en los 7 días siguientes${enATP ? ' (no debía trasladarse)' : ''}`);
    }
  }
  check(`1k. Fiestas fijas en domingo: se trasladan fuera de Adviento, Cuaresma y Pascua (${fiestasDomingo} casos)`, mal, fiestasDomingo);

  // ── 2. Citas del leccionario ─────────────────────────────────────────────
  const refs = new Map();
  for (const [key, e] of Object.entries(Lect.SUNDAY)) for (const c of (e.all ? ['all'] : ['A', 'B', 'C'])) {
    const set = e.all || e[c]; for (const s of ['first', 'psalm', 'second', 'gospel']) if (set[s]) { const r = set[s]; (refs.get(r + '|' + s) || refs.set(r + '|' + s, { r, s, where: [] }).get(r + '|' + s)).where.push(key + '/' + c); }
  }
  const badRefs = [];
  for (const { r, s, where } of refs.values()) {
    if (s === 'psalm') { if (!C.ctx.BibliaJerusalen.getVerses(r).length) badRefs.push(`${r} (${where[0]})`); continue; }
    const res = await fetchScripture(r);
    if (!res.text || ERR_IN_TEXT.test(res.text) || strip(res.text).length < 25) badRefs.push(`${r} (${where[0]})`);
  }
  check(`2. Cada cita del leccionario devuelve texto (${refs.size} citas distintas)`, badRefs, refs.size);

  // ── 2b. Salmos: cada cita, tal como se muestra, y la tabla de títulos fundidos ─
  const cleanPsalmVerses = C.get('cleanPsalmVerses'), FUSED = C.get('PSALM_FUSED_TITLE') || {};
  const psalmRefs = [...refs.values()].filter(x => x.s === 'psalm');
  const badPsalms = [];
  for (const { r, where } of psalmRefs) {
    const p = psalmProblem(cleanPsalmVerses ? cleanPsalmVerses(r, C.ctx.BibliaJerusalen.getVerses(r)) : C.ctx.BibliaJerusalen.getVerses(r));
    if (p) badPsalms.push(`${r} (${where[0]}): ${p}`);
  }
  check(`2b. Citas de salmo (${psalmRefs.length}): sin título pegado ni versículos repetidos`, badPsalms, psalmRefs.length);
  // La tabla recorta texto de la Biblia de Jerusalén: cada título debe seguir siendo el comienzo literal del v. 1.
  const badFused = [];
  for (const [n, t] of Object.entries(FUSED)) {
    const v = C.ctx.BibliaJerusalen.getVerses(`Psalm ${n}:1`);
    if (!v.length || v[0].h !== '1' || !v[0].content.startsWith(t)) badFused.push(`Sal ${n}: «${t}» ya no abre el v. 1 (${v.length ? strip(v[0].content).slice(0, 40) : 'sin texto'})`);
  }
  check(`2c. Tabla de títulos fundidos: cada título abre el v. 1 de la Biblia (${Object.keys(FUSED).length} salmos)`, badFused, Math.max(1, Object.keys(FUSED).length));

  // ── 2d. Los versículos impresos son los que pide la cita ─────────────────
  // El texto sale de la Biblia de Jerusalén (el libro en español no trae leccionario) y el libro cita con numeración
  // inglesa. Para cada cita de UN solo capítulo se compara la secuencia de versículos pedida con la impresa. Las
  // diferencias de abajo se midieron el 2026-11-02 y son TODAS las que hay; cualquier otra, o que una deje de serlo,
  // falla. Las citas de varios capítulos se comparan solo por su primer y último versículo.
  const DIF_CONOCIDAS = {
    'Acts 8:26-40': 'la BdJ no trae el v. 37 (variante textual)',
    'Mark 9:38-48': 'la BdJ no trae los vv. 44 y 46 (variantes textuales)',
    'Romans 11:25-36': 'la BdJ junta 11:35-36 en su v. 35: el texto sale completo, con un versículo menos rotulado',
    '2 Corinthians 13:5-14': 'la BdJ junta 13:12-13 en su v. 12 y numera la gracia como 13:13: texto completo',
    'Matthew 21:33-44': 'FALTA el v. 44: la BdJ no lo trae (sale hasta el 43)',
  };
  const versosPedidos = ref => {
    const m = /^((?:[1-3] )?[A-Za-z ]+?)\s+(\d.*)$/.exec(ref); if (!m || !/:/.test(m[2])) return null;
    let ch = null; const out = [];
    for (const s of m[2].split(',')) {
      let x;
      if ((x = s.match(/^(\d+):(\d+)-(\d+)$/))) { if (ch != null && ch !== +x[1]) return null; ch = +x[1]; for (let v = +x[2]; v <= +x[3]; v++) out.push(v); }
      else if ((x = s.match(/^(\d+):(\d+)$/))) { if (ch != null && ch !== +x[1]) return null; ch = +x[1]; out.push(+x[2]); }
      else if (ch != null && (x = s.match(/^(\d+)-(\d+)$/))) { for (let v = +x[1]; v <= +x[2]; v++) out.push(v); }
      else if (ch != null && (x = s.match(/^(\d+)$/))) out.push(+x[1]);
      else return null;
    }
    return out;
  };
  const difVersos = []; let versosComparadas = 0; const vistas = new Set();
  for (const { r, s, where } of refs.values()) {
    if (s === 'psalm') continue;
    const exp = versosPedidos(r); if (!exp) continue;
    versosComparadas++;
    const got = [...(await fetchScripture(r)).text.matchAll(/<sup class="verse-num">(\d+)[a-z]?<\/sup>/g)].map(x => +x[1]);
    const igual = JSON.stringify(exp) === JSON.stringify(got);
    if (!igual && !DIF_CONOCIDAS[r]) difVersos.push(`${r} (${where[0]}): pedido ${exp[0]}..${exp[exp.length - 1]} (${exp.length}), impreso ${got.length ? got[0] + '..' + got[got.length - 1] : 'nada'} (${got.length})`);
    if (igual && DIF_CONOCIDAS[r]) difVersos.push(`${r}: ya no difiere; quitarla de DIF_CONOCIDAS`);
    if (!igual) vistas.add(r);
  }
  for (const r of Object.keys(DIF_CONOCIDAS)) if (!vistas.has(r) && !difVersos.some(x => x.startsWith(r + ':'))) difVersos.push(`${r}: la cita ya no está en el leccionario; quitarla de DIF_CONOCIDAS`);
  check(`2d. Versículos impresos = pedidos (${versosComparadas} citas de un capítulo; ${Object.keys(DIF_CONOCIDAS).length} diferencias conocidas)`, difVersos, versosComparadas);

  // ── 3. Leccionario = libro ───────────────────────────────────────────────
  let drift = [], compared = 0;
  try {
    const exp = require('./bcp2019-tools/build-lectionary.js').out;
    for (const [key, e] of Object.entries(exp)) {
      const got = Lect.SUNDAY[key];
      if (!got) { drift.push(`falta la clave ${key}`); continue; }
      for (const c of (e.all ? ['all'] : ['A', 'B', 'C'])) for (const s of ['first', 'psalm', 'second', 'gospel']) {
        compared++;
        const a = (got.all || got[c] || {})[s] ?? null, b = (e.all || e[c])[s] ?? null;
        if (a !== b) drift.push(`${key}/${c}/${s}: app «${a}» ≠ libro «${b}»`);
      }
    }
  } catch (e) { drift.push('no se pudo comparar: ' + e.message); }
  check(`3. lectionary.js coincide con las tablas oficiales (${compared} lecturas comparadas)`, drift, compared);

  // ── 4. Prefacios = libro ─────────────────────────────────────────────────
  // Se compara con el libro en español, que vive fuera del repositorio: sin él, se anota como pendiente.
  let prefacios = null;
  try { prefacios = require('./bcp2019-tools/check-prefacios.js').compare(); } catch (e) { prefacios = { total: 1, diferencias: ['no se pudo comparar: ' + e.message] }; }
  if (prefacios) check(`4. Prefacios: texto idéntico al libro en español (${prefacios.total} prefacios, ${(prefacios.deliberadas || []).length} desviaciones deliberadas)`, prefacios.diferencias, prefacios.total);

  // ── 5. Qué prefacio lleva cada día ───────────────────────────────────────
  // El texto de cada prefacio lo cubre la comprobación 4; esta cubre CUÁL se imprime cada día. La tabla sale
  // del libro en inglés (rótulo «Preface of …» bajo cada colecta de «Holy Days» y de los domingos de
  // Cuaresma, Pascua y Ascensión). El libro en español reúne Presentación, Anunciación y Transfiguración en uno.
  const FIESTA_PREFACIO = {
    '11-30': 'apostles', '12-21': 'apostles', '12-26': 'christmas', '12-27': 'christmas', '12-28': 'christmas',
    '01-01': 'transfiguration', '01-18': 'apostles', '01-25': 'apostles', '02-02': 'transfiguration', '02-24': 'apostles',
    '03-19': 'transfiguration', '03-25': 'transfiguration', '04-25': 'allSaints', '05-01': 'apostles', '05-31': 'transfiguration',
    '06-11': 'apostles', '06-24': 'advent', '06-29': 'apostles', '07-22': 'apostles', '07-25': 'apostles',
    '08-06': 'transfiguration', '08-15': 'christmas', '08-24': 'apostles', '09-14': 'holyWeek', '09-21': 'apostles',
    '09-29': 'trinity', '10-18': 'allSaints', '10-23': 'apostles', '10-28': 'apostles', '11-01': 'allSaints',
  };
  // «There is no seasonal preface for the numbered propers. Prefaces of the Lord's Day are used on Sundays.»
  // En las ferias de esa temporada el libro no exige prefacio: no se comprueban (conservan «En Cualquier Tiempo»).
  function prefacioEsperado(key) {
    if (FIESTA_PREFACIO[key]) return FIESTA_PREFACIO[key];
    if (key === 'proper29') return 'christTheKing';
    if (/^proper\d+$/.test(key)) return 'lordsDay';
    if (/^lent[1-5]$/.test(key) || key === 'ashWednesday') return 'lent';
    if (key === 'palmSunday') return 'holyWeek';
    if (key === 'ascension' || key === 'easter7') return 'ascension';
    if (key === 'pentecost') return 'pentecost';
    if (key === 'trinitySunday') return 'trinity';
    return null;
  }
  const prefMal = []; let prefCubiertos = 0; const prefCasos = new Set();
  for (let d = new Date(Y0, 0, 1, 12); d.getFullYear() <= Y1; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)) {
    const info = Cal.getDay(d), exp = prefacioEsperado(info.key);
    if (!exp) continue;
    prefCubiertos++; prefCasos.add(info.key);
    const got = Prop.getPreface(info.key, info.season);
    if (got !== Prop.PREFACES[exp]) prefMal.push(`${iso(d)} ${info.key}: ${got && got.title} ≠ ${Prop.PREFACES[exp].title}`);
  }
  check(`5. Prefacio de cada día = el del libro (${prefCubiertos} días, ${prefCasos.size} claves)`, prefMal, prefCubiertos);

  // ── Informe ──────────────────────────────────────────────────────────────
  let failed = 0;
  console.log(`\nPrueba de completitud — BCP 2019, ${Y0}-${Y1}\n`);
  for (const r of results) {
    const ok = r.fails === 0; if (!ok) failed++;
    console.log(`${ok ? 'OK    ' : 'FALLA '} ${r.name}${ok ? '' : `  → ${r.fails} de ${r.total}`}`);
    for (const ex of r.examples) console.log('         ' + ex);
  }
  console.log(`\nDías con lecturas prestadas del domingo o fiesta correspondiente: ${borrowed} de ${days}`);
  console.log('\nPENDIENTES CONOCIDOS (no los comprueba esta prueba):');
  console.log('  - Colectas: el texto español oficial (pp. 598-641) no existe; el app usa colectas reconstruidas.');
  console.log(`  - ${inheritFallback} días cuyo Propio de la semana es el 1 o el 2 usan la colecta del domingo anterior (sin texto español).`);
  console.log('  - Salmos: se leen de la Biblia de Jerusalén; el Salterio español del libro aún no se usa.');
  console.log('  - Lecturas: el libro en español no trae leccionario; el texto es de la Biblia de Jerusalén, que no trae Mateo 21:44, Hechos 8:37 ni Marcos 9:44 y 9:46 (ver DIF_CONOCIDAS).');
  if (!prefacios) console.log('  - Prefacios: no se cotejaron con el libro (falta LOC-10-10-23.md; ver bcp2019-tools/check-prefacios.js).');
  console.log('  - Ritos propios de Ceniza, Ramos, Jueves, Viernes, Sábado y Vigilia no modelados.');
  console.log(failed ? `\n${failed} comprobación(es) con fallos.` : '\nTodas las comprobaciones pasan.');
  process.exit(failed ? 1 : 0);
})();
