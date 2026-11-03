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
  for (const f of ['calendar.js', 'lectionary.js', 'propers.js', 'eucharist.js', 'holyweek-data.js', 'holyweek.js', 'utils.js', 'app.js', 'librito-pueblo.js']) {
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
  const f = { colectaPrestada: [], excepcion: [], marcas: [], sinColecta: [], sinPrefacio: [], sinLecturas: [], sinPrimera: [], sinEvangelio: [], sinSalmo: [], noEucaristiaSinAviso: [], noEucaristiaConMisa: [], gloria: [], salmoMal: [], aclamacion: [], fraccion: [], despedida: [], salmoAlterna: [] };
  let days = 0, borrowed = 0, noEu = 0, inheritFallback = 0, colectasPrestadas = 0;
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
      // El Sábado Santo no tiene Eucaristía de día, pero la Gran Vigilia que se ofrece con él SÍ la celebra (comprobación 9).
      if (/ORACIÓN DE CONSAGRACIÓN/.test(text) && st.dayInfo.key !== 'holySaturday') f.noEucaristiaConMisa.push(date);
      continue;
    }
    // Gloria: el libro solo dice que es apropiado omitirlo en los tiempos de penitencia y días de ayuno, y no nombra
    // el Adviento. DECISIÓN DEL USUARIO (2026-11-02): se omite también en Adviento, por costumbre. Se omite en
    // Adviento, Cuaresma y Semana Santa, salvo Jueves Santo y fiestas fijas; la rúbrica impresa nombra el tiempo real.
    const gloriaOmitido = /se omite el Gloria in excelsis/.test(text);
    const debeOmitir = ['advent', 'lent', 'holyWeek'].includes(st.dayInfo.season) && !st.dayInfo.isFixed && st.dayInfo.key !== 'maundyThursday';
    // El Domingo de Ramos (Liturgia de las Palmas) y el Miércoles de Ceniza (invitación a la santa Cuaresma) traen su propio
    // comienzo, que sustituye a los Ritos Iniciales: sin la sección de Aclamación ni de Gloria (comprobaciones 9 y 10).
    const esRamos = ['palmSunday', 'ashWednesday'].includes(st.dayInfo.key);
    if (!esRamos && gloriaOmitido !== debeOmitir) f.gloria.push(`${date} ${st.dayInfo.key} (${st.dayInfo.season}): ${gloriaOmitido ? 'omitido' : 'presente'}`);
    if (!esRamos && debeOmitir && gloriaOmitido && !(st.dayInfo.season === 'advent' ? /en Adviento se omite el Gloria/ : /en Cuaresma se omite el Gloria/).test(text)) f.gloria.push(`${date} ${st.dayInfo.key} (${st.dayInfo.season}): la rúbrica nombra otro tiempo`);
    // Aclamación, Fracción y Despedida según el tiempo (comprobación 6). Se lee el HTML ya armado.
    {
      const s = st.dayInfo.season, k = st.dayInfo.key;
      const am = /LA ACLAMACIÓN<\/h4>([\s\S]*?)(?=<h[34])/.exec(html), fr = /LA FRACCIÓN<\/h3>([\s\S]*?)(?=ORACIÓN DE HUMILDE ACCESO)/.exec(html), dm = /LA BENDICIÓN Y LA DESPEDIDA<\/h3>([\s\S]*)$/.exec(html);
      const acl = !am ? 'ausente' : /Derramaré mi Espíritu/.test(am[1]) ? (joelCompleto(strip(am[1])) ? 'pentecostes' : 'pentecostes-incompleto') : /Bendito sea nuestro Dios/.test(am[1]) ? 'semana-santa' : /Bendigamos al Señor que perdona/.test(am[1]) ? 'cuaresma' : /Cristo ha resucitado/.test(am[1]) ? 'pascua' : /Sí, vengo pronto/.test(am[1]) ? 'adviento' : /nos ha nacido un niño/.test(am[1]) ? 'navidad' : /luz para las naciones/.test(am[1]) ? 'epifania' : /Digno eres, Señor y Dios nuestro/.test(am[1]) ? 'todos-santos' : /Bendito sea Dios: Padre/.test(am[1]) ? 'ordinaria' : 'desconocida';
      // Saludos para los Tiempos Litúrgicos (LOC p. 145-146): Adviento; Navidad y Presentación (2 feb); Epifanía; Todos los Santos (1 nov).
      const aclEsp = k === 'pentecost' ? 'pentecostes' : s === 'holyWeek' ? 'semana-santa' : s === 'lent' ? 'cuaresma' : s === 'easter' ? 'pascua' : k === '11-01' ? 'todos-santos' : k === '02-02' ? 'navidad' : s === 'advent' ? 'adviento' : s === 'christmas' ? 'navidad' : s === 'epiphany' ? 'epifania' : 'ordinaria';
      if (!esRamos && acl !== aclEsp) f.aclamacion.push(`${date} ${k} (${s}): ${acl}, debía ser ${aclEsp}`);
      const conAleluyaFr = !!fr && /\[Aleluya\.\]/.test(fr[1]), debeAleluyaFr = !['lent', 'holyWeek'].includes(s);
      if (conAleluyaFr !== debeAleluyaFr) f.fraccion.push(`${date} ${k} (${s}): ${conAleluyaFr ? 'con' : 'sin'} Aleluya`);
      const conAleluyaDesp = !!dm && /aleluya, aleluya/i.test(dm[1]), debeAleluyaDesp = s === 'easter' || k === 'pentecost';
      const sinDespedida = k === 'maundyThursday'; // el Jueves Santo «se omiten la bendición final y la despedida»
      if (!sinDespedida && conAleluyaDesp !== debeAleluyaDesp) f.despedida.push(`${date} ${k} (${s}): ${conAleluyaDesp ? 'con' : 'sin'} aleluya`);
      // El Librito no recalcula nada, pero decide estas tres cosas con su propio código: se mide igual.
      let lib = ''; try { lib = Librito.generateLibrito(st); } catch (e) { f.aclamacion.push(`${date} Librito lanzó: ${e.message}`); }
      // Colecta prestada: la feria sin colecta propia repite la del Domingo o fiesta precedente y la liturgia y el Librito lo dicen; si es propia, no.
      const prestada = st.collectKey !== st.dayInfo.key;
      if (prestada) colectasPrestadas++;
      if (prestada !== /Esta feria no tiene Colecta propia/.test(text)) f.colectaPrestada.push(`${date}: la rúbrica de colecta prestada ${prestada ? 'falta' : 'sobra'} en la liturgia`);
      if (prestada !== /Hoy se repite la Colecta del Domingo/.test(lib)) f.colectaPrestada.push(`${date} Librito: la indicación de colecta prestada ${prestada ? 'falta' : 'sobra'}`);
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
      if (lib && !esRamos && (!lgl || /se omite el Gloria in excelsis/.test(lgl[1]) !== debeOmitir)) f.gloria.push(`${date} ${k} (${s}) Librito: ${!lgl ? 'sin sección' : debeOmitir ? 'presente' : 'omitido'}`);
      const lam = /<h3>LA ACLAMACIÓN<\/h3>([\s\S]*?)(?=<h[23])/.exec(lib);
      const lacl = !lam ? 'ausente' : /Derramaré mi Espíritu/.test(lam[1]) ? (joelCompleto(strip(lam[1])) ? 'pentecostes' : 'pentecostes-incompleto') : /Bendito sea nuestro Dios/.test(lam[1]) ? 'semana-santa' : /Bendigamos al Señor que perdona/.test(lam[1]) ? 'cuaresma' : /Cristo ha resucitado/.test(lam[1]) ? 'pascua' : /Sí, vengo pronto/.test(lam[1]) ? 'adviento' : /nos ha nacido un niño/.test(lam[1]) ? 'navidad' : /luz para las naciones/.test(lam[1]) ? 'epifania' : /Digno eres, Señor y Dios nuestro/.test(lam[1]) ? 'todos-santos' : /Bendito sea Dios: Padre/.test(lam[1]) ? 'ordinaria' : 'desconocida';
      if (lib && !esRamos && lacl !== aclEsp) f.aclamacion.push(`${date} ${k} (${s}) Librito: ${lacl}, debía ser ${aclEsp}`);
      const lfr = /Celebrante: (\[Aleluya\.\] )?Cristo, nuestra Pascua/.exec(lib), ldm = /Salgamos en el Nombre de Cristo\.( Aleluya, aleluya\.)?/.exec(lib);
      if (lib && (!lfr || !!lfr[1] !== debeAleluyaFr)) f.fraccion.push(`${date} ${k} (${s}) Librito: ${!lfr ? 'sin Fracción' : lfr[1] ? 'con' : 'sin'} Aleluya`);
      if (lib && !sinDespedida && (!ldm || !!ldm[1] !== debeAleluyaDesp)) f.despedida.push(`${date} ${k} (${s}) Librito: ${!ldm ? 'sin Despedida' : ldm[1] ? 'con' : 'sin'} aleluya`);
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
  check('1m. Colecta prestada del Domingo o fiesta precedente: la liturgia y el Librito lo dicen (solo ese día)', f.colectaPrestada, days);
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
  check('6a. Aclamación según el tiempo (Adviento / Navidad y Presentación / Epifanía / Cuaresma / Semana Santa / Pascua / Joel en Pentecostés / Todos los Santos)', f.aclamacion, days - noEu);
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
  // Mt 21:44 (Propio 22, ciclo A): la Biblia de Jerusalén no lo trae en el texto; se completa con la NVI y se avisa con una
  // rúbrica (VERSE_SUPPLEMENTS en utils.js). Sin esto la lectura saldría hasta el v. 43.
  const mt2144 = (await fetchScripture('Matthew 21:33-44')).text;
  if (!/<sup class="verse-num">44<\/sup> El que caiga sobre esta piedra quedará despedazado, y si ella cae sobre alguien, lo hará polvo\./.test(mt2144) || !/\[v\. 44 según la NVI; la Biblia de Jerusalén no lo trae en el texto\]/.test(mt2144)) difVersos.push('Matthew 21:33-44: falta el v. 44 completado con la NVI y su rúbrica');
  check(`2d. Versículos impresos = pedidos (${versosComparadas} citas de un capítulo; ${Object.keys(DIF_CONOCIDAS).length} diferencias conocidas; Mt 21:44 completado con la NVI)`, difVersos, versosComparadas);

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

  // ── 9. Semana Santa ──────────────────────────────────────────────────────
  // Domingo de Ramos: Liturgia de las Palmas y, en la Eucaristía, sin Credo ni Oraciones del Pueblo; la Pasión sin las
  // respuestas habituales. Jueves Santo: apertura, lavatorio y cierre propios, sin bendición ni despedida. Viernes y
  // Sábado Santo: su rito propio, con las lecturas del día. Los textos vienen del libro en español (holyweek-data.js).
  const hw = []; let hwDias = 0;
  const HW = (cond, msg) => { if (!cond) hw.push(msg); };
  for (let y = Y0; y <= Y1; y++) {
    const F = Cal.getFeastDates(y);
    for (const [k, fecha] of [['palmSunday', F.palmSunday], ['maundyThursday', F.maundyThursday], ['goodFriday', F.goodFriday], ['holySaturday', F.holySaturday]]) {
      const d = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 12); hwDias++;
      let html, st; try { html = await generateLiturgy(d); st = C.state(); } catch (e) { hw.push(`${iso(d)} ${k}: lanzó ${e.message}`); continue; }
      const lib = Librito.generateLibrito(st), tx = strip(html), tl = strip(lib), w = `${iso(d)} ${k}`;
      const pasion = (h) => { const i = h.indexOf('LA PASIÓN'); if (i < 0) return null; const j = h.search(/class="(mass-section|librito-section)/); const rest = h.slice(i); const m = rest.search(/class="(mass-section|librito-section)/); return m < 0 ? rest : rest.slice(0, m); };
      if (k === 'palmSunday') {
        HW(/LA LITURGIA DE LAS PALMAS/.test(tx) && /Hosanna al Hijo de David/.test(tx), `${w}: falta la Liturgia de las Palmas`);
        HW(/LA LITURGIA DE LAS PALMAS/.test(tl) && /Hosanna al Hijo de David/.test(tl), `${w} Librito: falta la Liturgia de las Palmas`);
        HW(/EN LA EUCARISTÍA/.test(tx) && !/EL CREDO NICENO|ORACIÓN DE LOS FIELES/.test(tx), `${w}: debe omitir el Credo y las Oraciones del Pueblo`);
        HW(!/EL CREDO NICENO|ORACIÓN DE LOS FIELES/.test(tl), `${w} Librito: debe omitir el Credo y las Oraciones del Pueblo`);
        HW(/Dios todopoderoso y eterno, en tu tierno amor/.test(tx), `${w}: falta la colecta oficial de Ramos`);
      }
      if (k === 'palmSunday' || k === 'goodFriday') {
        const p = pasion(html), pl = pasion(lib);
        HW(p && p.length > 500 && !/Gloria a ti, Cristo Señor|Te alabamos, Cristo Señor/.test(p), `${w}: la Pasión debe ir sin las respuestas habituales`);
        HW(pl && pl.length > 500 && !/Gloria a ti, Cristo Señor|Te alabamos, Cristo Señor/.test(pl), `${w} Librito: la Pasión debe ir sin las respuestas habituales`);
      }
      if (k === 'maundyThursday') {
        for (const [t, n] of [[tx, ''], [tl, ' Librito']]) {
          HW(/Esta es la noche en que Cristo/.test(t) && /LAVATORIO DE LOS PIES/.test(t), `${w}${n}: faltan las palabras de apertura o el lavatorio`);
          HW(!/Salgamos en el Nombre de Cristo/.test(t) && /se omiten la bendición final y la despedida/i.test(t), `${w}${n}: el Jueves Santo no lleva bendición ni despedida`);
        }
      }
      if (k === 'goodFriday') {
        for (const [t, n] of [[tx, ''], [tl, ' Librito']]) {
          HW(/COLECTAS SOLEMNES/.test(t) && /IMPROPERIOS/.test(t) && /ORACIÓN CONCLUSIVA/.test(t) && /Señor Jesucristo, Hijo del Dios vivo/.test(t), `${w}${n}: falta parte del rito del Viernes Santo`);
          HW(!/ORACIÓN DE CONSAGRACIÓN/.test(t) && /no se celebra/.test(t), `${w}${n}: el Viernes Santo no tiene Eucaristía`);
          HW(/Génesis 22|Hebreos 10/.test(t) && /Juan/.test(t), `${w}${n}: faltan las lecturas del día`);
        }
      }
      if (k === 'holySaturday') {
        for (const [t, n] of [[tx, ''], [tl, ' Librito']]) {
          HW(/No hay celebración de la Eucaristía/.test(t) && /EL HIMNO/.test(t) && /Oh Dios, Creador del cielo y de la tierra/.test(t), `${w}${n}: falta parte del rito del Sábado Santo`);
          HW(/Job|1 Pedro/.test(t) && /Mateo/.test(t), `${w}${n}: faltan las lecturas del día`);
          // Gran Vigilia Pascual (el libro: Servicio de la Luz, Lecturas, Aclamación y Palabra, Eucaristía con prefacio de Pascua).
          HW(/LA GRAN VIGILIA DE RESURRECCIÓN/.test(t) && /EL PREGÓN PASCUAL/.test(t) && /Alégrense por fin, bóveda del cielo/.test(t) && /La luz de Cristo/.test(t), `${w}${n}: falta el Servicio de la Luz de la Vigilia`);
          HW(/Escuchemos el registro de las obras salvadoras de Dios/.test(t) && /LA CREACIÓN/.test(t) && /LIBERACIÓN DE ISRAEL EN EL MAR ROJO/.test(t) && /EL ENCUENTRO DEL PUEBLO DE DIOS/.test(t), `${w}${n}: faltan las lecciones de la Vigilia`);
          HW(/(Lectura de|LECCIÓN)\s+Éxodo 14:10-15:1/.test(t) && /(Lectura de|LECCIÓN)\s+Romanos 6:3-11/.test(t) && /(Lectura de|LECCIÓN)\s+Mateo 28:1-10/.test(t),`${w}${n}: falta el texto bíblico de la Vigilia (Éxodo, Epístola o Evangelio)`);
          HW(/¡Aleluya! ¡Cristo ha resucitado!/.test(t) && /Oh Dios, que hiciste resplandecer esta noche santísima/.test(t), `${w}${n}: falta la Aclamación Pascual o la colecta de la Vigilia`);
          HW(/PREFACIO: PASCUA/.test(t) && /ORACIÓN DE CONSAGRACIÓN/.test(t) && /\[Aleluya\.\] Cristo, nuestra Pascua/.test(t) && /aleluya, aleluya/i.test(t), `${w}${n}: la Eucaristía de la Vigilia debe llevar prefacio de Pascua, consagración, Fracción y Despedida con Aleluya`);
          // Renovación de los Votos Bautismales (LOC l. 4835-4907): tras el Sermón y antes de las Oraciones del Pueblo, sin Credo Niceno.
          const v = t.indexOf('LA GRAN VIGILIA DE RESURRECCIÓN'), parte = v < 0 ? '' : t.slice(v);
          // Marcado opcional del Cirio Pascual (LOC l. 15677-15691, recompuesto: el libro lo trae desordenado): entre la rúbrica que lo
          // pide y el encendido del Cirio, con cada palabra del celebrante tras su rúbrica y en el orden de la cruz, el Alfa y el Omega y el año.
          let pc = parte.indexOf('se hace en este momento'), faltaC = pc < 0 ? 'se hace en este momento' : '';
          for (const m of ['A medida que se traza la vertical de la cruz', 'Cristo, ayer y hoy,', 'el principio y el fin,', 'Como el Alfa es trazado', 'Alfa', 'Como el Omega es trazado', 'y Omega,', 'todo el tiempo le pertenece,', 'y todas las edades;', 'a Él sea la gloria y el poder,', 'a través de todos los tiempos y por siempre. Amén.', 'Por sus santas y gloriosas llagas', 'El Celebrante enciende el Cirio Pascual con el fuego']) { if (pc < 0) break; const j = parte.indexOf(m, pc); if (j < 0) { faltaC = faltaC || m; continue; } pc = j + m.length; }
          HW(!faltaC, `${w}${n}: el marcado del Cirio Pascual falta o está fuera de orden en el Servicio de la Luz (${faltaC})`);
          let pos = 0, falta = '';
          for (const m of ['EL SERMÓN', 'RENOVACIÓN DE LAS PROMESAS BAUTISMALES', '¿Renuevas tú, aquí en la presencia de Dios', 'Sí, me comprometo.', 'Desde allí ha de venir a juzgar a vivos y muertos.', 'y la vida eterna. Amén.', 'que has edificado a tu Iglesia sobre el fundamento', 'La celebración continúa con las Oración de los Fieles.', 'ORACIÓN DE LOS FIELES', 'PREFACIO: PASCUA']) { const j = parte.indexOf(m, pos); if (j < 0) { falta = falta || m; continue; } pos = j + m.length; }
          HW(!falta, `${w}${n}: la Renovación de los Votos Bautismales falta o está fuera de orden en la Vigilia (${falta})`);
          HW((parte.match(/Sí, renuncio\./g) || []).length === 3 && (parte.match(/Sí, creo\./g) || []).length === 3 && (parte.match(/¿Renuevas tú/g) || []).length === 1, `${w}${n}: la Renovación debe traer 3 «Sí, renuncio.», 3 «Sí, creo.» y una sola pregunta inicial`);
          HW(parte.includes('¿Renuncias a Satanás y a todas sus fuerzas espirituales de maldad que se rebelan contra Dios?') && !/(^|[^¿])Renuncias a Satanás/.test(parte), `${w}${n}: la pregunta «¿Renuncias a Satanás…?» debe llevar su «¿» de apertura (errata del libro corregida)`);
          HW(!/Excepto en la Vigilia Pascual|RITOS PASTORALES|Creemos en un solo Dios|EL CREDO NICENO/.test(parte), `${w}${n}: la Vigilia no lleva Credo Niceno ni la última línea del rito de la Renovación`);
        }
        HW(lib.includes('<strong>Pueblo: Sí, creo. Creo en Dios Padre todopoderoso'), `${w} Librito: «Sí, creo.» y el artículo del Credo deben ir juntos y en negrita (lo que dice el pueblo)`);
      }
    }
  }
  // Las 14 citas de la Gran Vigilia dan el nº de versículos del libro (numeración inglesa; Daniel 3 y Jonás 1:17 se
  // convierten a la de la Biblia de Jerusalén: sin esa conversión salen 26 de Jonás y el Cántico de Azarías en Daniel).
  const CUENTA_VIGILIA = { 'Genesis 1:1-2:3': 34, 'Genesis 3': 24, 'Genesis 7:1-5,11-18,8:6-20,9:8-13': 34, 'Genesis 22:1-18': 18, 'Exodus 14:10-15:1': 23, 'Isaiah 4:2-6': 5, 'Isaiah 55:1-11': 11,
    'Ezekiel 36:24-28': 5, 'Ezekiel 37:1-14': 14, 'Daniel 3:1-23,91-95': 28, 'Jonah 1:1-2:10': 27, 'Zephaniah 3:12-20': 9, 'Romans 6:3-11': 9, 'Matthew 28:1-10': 10 };
  const HWm = C.get('BCPHolyWeek');
  HW(JSON.stringify([...HWm.VIGIL_REFS].sort()) === JSON.stringify(Object.keys(CUENTA_VIGILIA).sort()), 'las citas de la Vigilia en holyweek-data.js no son las esperadas: ' + HWm.VIGIL_REFS.join(' | '));
  for (const [ref, n] of Object.entries(CUENTA_VIGILIA)) { const got = [...(await fetchScripture(ref)).text.matchAll(/<sup class="verse-num">/g)].length; HW(got === n, `${ref}: salen ${got} versículos y el libro tiene ${n}`); }
  // Ningún otro día lleva rito de Semana Santa: la Liturgia de las Palmas y el lavatorio no se cuelan.
  for (const k of ['2026-06-07', '2026-11-08', '2026-03-10']) { const d = new Date(k + 'T12:00:00'); const t = strip(await generateLiturgy(d)); HW(!/LITURGIA DE LAS PALMAS|LAVATORIO DE LOS PIES|IMPROPERIOS|IMPOSICIÓN DE LA CENIZA|LETANÍA DE PENITENCIA|RENOVACIÓN DE LAS PROMESAS BAUTISMALES/.test(t), `${k}: se coló un rito de Semana Santa o de Ceniza`); }
  // La Renovación de los Votos Bautismales y el cierre de la Vigilia son el texto del libro, línea por línea (LOC l. 4835-4907 y
  // 15632-15633): sin líneas en blanco, números de página ni etiquetas de quien habla, que el generador quita o convierte.
  try {
    const gen2 = require('./bcp2019-tools/build-holyweek.js'), D2 = C.get('BCP_HOLYWEEK_DATA'), n2 = s => String(s).replace(/\s+/g, ' ').trim();
    if (fs.existsSync(gen2.LOC_POR_DEFECTO)) {
      const L = fs.readFileSync(gen2.LOC_POR_DEFECTO, 'utf8').split(/\r?\n/);
      const libro = (a, b) => n2(L.slice(a - 1, b).map(l => l.trim()).filter(l => l && !/^\d{3}$/.test(l)).map(l => l.replace(/^(Celebrante|Pueblo|Pregunta)\s+/, '')).join(' '));
      const datos = n => n2(D2[n].map(i => i.x).join(' '));
      // Solo con las erratas que el usuario decidió corregir (CORRECCIONES en build-holyweek.js); todo lo demás, tal cual.
      let ren = libro(4835, 4907); for (const [de, a] of gen2.CORRECCIONES) ren = ren.replace(de, a);
      HW(ren === datos('easterVigilRenewal'), 'easterVigilRenewal no es el texto del libro (LOC l. 4835-4907) más las correcciones declaradas');
      HW(libro(15632, 15633) === datos('easterVigilContinues'), 'easterVigilContinues no es el texto del libro (LOC l. 15632-15633)');
    }
  } catch (e) { hw.push('no se pudo comprobar la Renovación de los Votos Bautismales: ' + e.message); }
  // El archivo generado sigue siendo idéntico al libro.
  try {
    const gen = require('./bcp2019-tools/build-holyweek.js');
    if (fs.existsSync(gen.LOC_POR_DEFECTO)) {
      const esperado = gen.archivo(gen.construir(gen.LOC_POR_DEFECTO)).replace(/\r\n/g, '\n'), actual = fs.readFileSync(path.join(__dirname, 'bcp2019', 'js', 'holyweek-data.js'), 'utf8').replace(/\r\n/g, '\n');
      HW(esperado === actual, 'holyweek-data.js ya no coincide con lo que genera bcp2019-tools/build-holyweek.js desde el libro en español (volver a ejecutarlo)');
    }
  } catch (e) { hw.push('no se pudo comprobar holyweek-data.js: ' + e.message); }
  check(`9. Semana Santa: Ramos, Jueves, Viernes y Sábado Santo con su rito del libro (${hwDias} días), en la liturgia y el Librito`, hw, hwDias);

  // ── 10. Miércoles de Ceniza ──────────────────────────────────────────────
  // Su rito propio (texto del libro en español, holyweek-data.js): apertura, invitación a la santa Cuaresma con su colecta
  // (una sola vez), imposición de la ceniza con el Salmo 51, confesión y letanía, absolución con las palabras confortantes
  // y la paz, y la Eucaristía con prefacio de Cuaresma. Sustituye a los Ritos Iniciales, el Credo y las Oraciones del Pueblo.
  const ce = []; let ceDias = 0;
  const CE = (cond, msg) => { if (!cond) ce.push(msg); };
  for (let y = Y0; y <= Y1; y++) {
    const f = Cal.getFeastDates(y).ashWednesday; const d = new Date(f.getFullYear(), f.getMonth(), f.getDate(), 12); ceDias++;
    let html; try { html = await generateLiturgy(d); } catch (e) { ce.push(`${iso(d)}: lanzó ${e.message}`); continue; }
    const st = C.state(), lib = Librito.generateLibrito(st), w = iso(d);
    for (const [h, n] of [[html, ''], [lib, ' Librito']]) {
      const t = strip(h);
      CE(/Bendito sea el Señor que perdona todos nuestros pecados/.test(t) && /INVITACIÓN A LA SANTA CUARESMA/.test(t) && /Los invito, pues, en nombre de la Iglesia/.test(t), `${w}${n}: falta la apertura o la invitación a la santa Cuaresma`);
      CE((t.match(/Dios todopoderoso y eterno, que nada de lo que has hecho odias/g) || []).length === 1, `${w}${n}: la colecta del Miércoles de Ceniza debe salir una sola vez`);
      CE(/IMPOSICIÓN DE LA CENIZA/.test(t) && /Recuerda que eres polvo y en polvo te convertirás/.test(t) && /1 Ten compasión de mí, oh Dios/.test(t) && /17 El sacrificio que te agrada/.test(t), `${w}${n}: falta la imposición de la ceniza o el Salmo 51 completo (versículos 1-17)`);
      CE(/LETANÍA DE PENITENCIA/.test(t) && (t.match(/Porque hemos pecado contra ti/g) || []).length >= 12 && /Muestra favor a tu pueblo, oh Señor/.test(t), `${w}${n}: falta la confesión y letanía de penitencia`);
      CE(/LA ABSOLUCIÓN/.test(t) && /LAS PALABRAS CONFORTANTES/.test(t) && /Vengan a mí todos ustedes que están cansados/.test(t) && /Señor Dios nuestro, concédenos la gracia de desearte/.test(t), `${w}${n}: falta la absolución, las palabras confortantes o la oración de cierre`);
      CE(/PREFACIO: CUARESMA/.test(t) && /ORACIÓN DE CONSAGRACIÓN/.test(t), `${w}${n}: la Eucaristía debe llevar prefacio de Cuaresma y consagración`);
      CE(!/EL CREDO NICENO|ORACIÓN DE LOS FIELES|LA COLECTA POR PUREZA|CONFESIÓN Y ABSOLUCIÓN/.test(t), `${w}${n}: el rito de Ceniza sustituye al Credo, las Oraciones del Pueblo, la Colecta por la Pureza y la confesión habitual`);
    }
  }
  check(`10. Miércoles de Ceniza con su rito del libro (${ceDias} días), en la liturgia y el Librito`, ce, ceDias);

  // ── 11. Eucaristía en Texto Antiguo Renovado ─────────────────────────────
  // La segunda forma del libro (holyweek-data.js, secciones `renewed*`, cortadas de LOC-10-10-23.md l. 3174-3612). Cada día,
  // en la liturgia y en el Librito: (a) sale entero y en orden cada bloque del libro que ese día toca (si app.js o el Librito
  // dejaran de pintar uno no lanzaría nada); (b) no se cuela ningún texto propio del Estándar (Confesión, Oraciones del Pueblo,
  // Humilde Acceso...); (c) el Aleluya de la Despedida solo desde la Vigilia hasta Pentecostés; (d) en la forma Estándar, a su
  // vez, no se cuela ningún texto del Renovado, y pedir {form:'standard'} es lo mismo que no pedir nada.
  const ra = []; let raDias = 0;
  const RA = (cond, msg) => { if (!cond) ra.push(msg); };
  const norm = s => String(s).replace(/\s+/g, ' ').trim();
  const escH = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ventana = (s, desde, n) => { s = norm(s); return s.length >= desde + n ? s.slice(desde, desde + n) : ''; };
  const HWD = C.get('BCP_HOLYWEEK_DATA'), Euc = C.get('BCPEucharist');
  const ratNames = Object.keys(HWD).filter(n => /^renewed/.test(n));
  const ratItems = n => HWD[n].filter(i => i.t !== 'T' && i.t !== 'PREFACIO' && i.x).map(i => norm(escH(i.x)));
  const ratTodo = ratNames.map(n => ratItems(n).join(' ')).join(' ');
  const hwTodo = Object.keys(HWD).filter(n => !/^renewed/.test(n)).map(n => HWD[n].filter(i => i.x).map(i => norm(escH(i.x))).join(' ')).join(' ');
  const domingo = new Date(2026, 5, 7, 12);
  const stdBase = norm(strip(await generateLiturgy(domingo))), ratBase = norm(strip(await generateLiturgy(domingo, { form: 'renewed' })));
  // Marcas: un trozo de 70 caracteres de cada pieza que solo existe en una de las dos formas (se calibran contra la página
  // ya pintada de un domingo en cada forma, para que las etiquetas «Cel.» y «Pueblo» cuenten).
  const stdMarcas = ['CONFESSION', 'COMFORTABLE_WORDS', 'PRAYERS_OF_THE_PEOPLE', 'CREED', 'PEACE', 'OFFERTORY_SENTENCE', 'PRAYER_OF_CONSECRATION', 'LORDS_PRAYER', 'HUMBLE_ACCESS', 'AGNUS_DEI', 'ADMINISTRATION', 'POST_COMMUNION', 'BLESSING']
    .map(n => ({ n, m: ventana(strip(Euc[n]), 15, 70) })).filter(x => x.m && !ratBase.includes(x.m) && !ratTodo.includes(x.m) && !hwTodo.includes(x.m));
  const ratMarcas = ratNames.map(n => ({ n, m: ventana(ratItems(n).sort((a, b) => b.length - a.length)[0] || '', 10, 70) })).filter(x => x.m && !stdBase.includes(x.m));
  RA(stdMarcas.length >= 8 && stdMarcas.every(x => stdBase.includes(x.m)), `la prueba no tiene marcas del Estándar fiables (${stdMarcas.length})`);
  RA(ratMarcas.length >= 10, `la prueba no tiene marcas del Renovado fiables (${ratMarcas.length})`);
  // Qué secciones del Renovado toca pintar ese día (el Miércoles de Ceniza y el Domingo de Ramos sustituyen partes; el Jueves
  // Santo cierra sin bendición ni despedida; la Vigilia no lleva Credo; el Aleluya de la Despedida es de Pascua).
  const seccionesRat = (dayInfo) => {
    const k = dayInfo.key, ash = k === 'ashWednesday', palm = k === 'palmSunday', maundy = k === 'maundyThursday', sat = k === 'holySaturday';
    const s = [];
    if (!palm && !ash && !sat) s.push('renewedCreed');
    if (sat) s.push('easterVigilRenewal');   // la Vigilia renueva los votos bautismales antes de las Oraciones del Pueblo
    if (!palm && !ash) s.push('renewedPrayers');
    if (!ash) s.push('renewedConfession', 'renewedPeace');
    s.push('renewedOffertory', 'renewedSursum', 'renewedConsecration', 'renewedLordsPrayer', 'renewedHumbleAccess', 'renewedAgnusDei', 'renewedAdministration', 'renewedPostCommunion');
    if (!maundy) s.push('renewedBlessing', 'renewedDismissal');
    if (!maundy && (sat || dayInfo.season === 'easter' || k === 'pentecost')) s.push('renewedDismissalAlleluia');
    return s;
  };
  for (let d = new Date(Y0, 0, 1, 12), i = 0; d.getFullYear() <= Y1; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12), i++) {
    raDias++;
    const w = iso(d);
    let html, st;
    try { html = await generateLiturgy(d, { form: 'renewed' }); st = C.state(); } catch (e) { ra.push(`${w}: lanzó ${e.message}`); continue; }
    const k = st.dayInfo.key;
    RA(st.form === 'renewed', `${w}: currentMassState no guarda la forma`);
    const vistas = [[norm(strip(html)), ''], [norm(strip(Librito.generateLibrito(st))), ' Librito']];
    for (const [t, n] of vistas) {
      // (el propio libro nombra al Texto Estándar en una rúbrica de la poscomunión: se miran la portada y el pie, no todo el texto)
      const rotulo = n ? 'Libro de Oración Común (2019) · ' : 'Santa Eucaristía — ';
      RA(t.includes(rotulo + 'Texto Antiguo Renovado') && !t.includes(rotulo + 'Texto Estándar Anglicano'), `${w}${n}: debe decir que es el Texto Antiguo Renovado y no el Estándar`);
      RA(stdMarcas.every(x => !t.includes(x.m)), `${w}${n}: se coló texto del Estándar (${(stdMarcas.find(x => t.includes(x.m)) || {}).n})`);
      if (k === 'goodFriday') { RA(ratMarcas.every(x => !t.includes(x.m)), `${w}${n}: el Viernes Santo no tiene Eucaristía y salió texto del Renovado`); continue; }
      const toca = seccionesRat(st.dayInfo);
      let pos = 0, perdido = '';
      for (const nombre of toca) for (const it of ratItems(nombre)) {
        const j = t.indexOf(it, pos);
        if (j < 0) { perdido = perdido || `${nombre}: «${it.slice(0, 50)}…»`; continue; }
        pos = j + it.length;
      }
      RA(!perdido, `${w}${n}: falta o está fuera de orden un bloque del libro (${perdido})`);
      RA(toca.includes('renewedDismissalAlleluia') === /Desde la Vigilia Pascual hasta el Día de Pentecostés/.test(t), `${w}${n}: el Aleluya de la Despedida debe salir solo de la Vigilia a Pentecostés`);
      const pf = k === 'holySaturday' ? Prop.PREFACES.easter : st.preface;
      RA(pf && (n ? t.includes('PREFACIO: ' + pf.title.toUpperCase()) : t.includes(ventana(strip(pf.text), 0, 60))), `${w}${n}: falta el prefacio del día en el Renovado`);
    }
    // La forma Estándar, en una muestra: igual con o sin pedirla, y sin nada del Renovado.
    if (i % 9 === 0) {
      let s1, s2, ls;
      try { s1 = await generateLiturgy(d); ls = Librito.generateLibrito(C.state()); s2 = await generateLiturgy(d, { form: 'standard' }); } catch (e) { ra.push(`${w}: la forma Estándar lanzó ${e.message}`); continue; }
      RA(s1 === s2, `${w}: pedir la forma Estándar no es lo mismo que no pedir ninguna`);
      for (const [t, n] of [[norm(strip(s1)), ''], [norm(strip(ls)), ' Librito']]) RA(t.includes((n ? 'Libro de Oración Común (2019) · ' : 'Santa Eucaristía — ') + 'Texto Estándar Anglicano') && ratMarcas.every(x => !t.includes(x.m)), `${w}${n} (Estándar): se coló texto del Renovado (${(ratMarcas.find(x => t.includes(x.m)) || {}).n})`);
    }
  }
  check(`11. Eucaristía en Texto Antiguo Renovado, la segunda forma del libro (${raDias} días), en la liturgia y el Librito`, ra, raDias);

  // ── 12. Vigilia: Santo Bautismo y Santo Bautismo con Confirmación ────────────────────────────────────────────────
  // Los otros dos ritos que el libro permite en la Vigilia (LOC l. 15643-15654): se eligen con `opts.baptism` ('baptism' o
  // 'baptismConf'; la Renovación de los Votos, por defecto, la vigila la comprobación 9). Cada Sábado Santo, en las dos formas de la
  // Eucaristía, en la liturgia y el Librito: (a) sale el rito entero, en orden, tras el Sermón; (b) no se cuelan los textos de los
  // otros ritos; (c) en el Santo Bautismo no se repiten la Oración de los Fieles, la confesión ni la paz (el rito trae sus propias
  // letanía y paz y sigue con el Ofertorio); (d) las palabras de cada sección son EXACTAMENTE las del libro.
  const bt = []; let btDias = 0;
  const BT = (cond, msg) => { if (!cond) bt.push(msg); };
  const D12 = C.get('BCP_HOLYWEEK_DATA');
  const items12 = n => D12[n].filter(i => i.x).map(i => norm(escH(i.x)));
  for (let y = Y0; y <= Y1; y++) {
    const f = Cal.getFeastDates(y).easter; const d0 = new Date(f.getFullYear(), f.getMonth(), f.getDate() - 1, 12); btDias++;
    for (const forma of ['standard', 'renewed']) for (const rito of ['baptism', 'baptismConf']) {
      const w = `${iso(d0)} ${forma}/${rito}`, sec = rito === 'baptism' ? 'easterVigilBaptism' : 'easterVigilBaptismConf';
      let html, lib; try { html = await generateLiturgy(d0, { form: forma, baptism: rito }); lib = Librito.generateLibrito(C.state()); } catch (e) { bt.push(`${w}: lanzó ${e.message}`); continue; }
      for (const [h, n] of [[html, ''], [lib, ' Librito']]) {
        const t = norm(strip(h)), v = t.indexOf('LA GRAN VIGILIA DE RESURRECCIÓN'), parte = v < 0 ? '' : t.slice(v);
        let pos = parte.indexOf('EL SERMÓN'), falta = pos < 0 ? 'EL SERMÓN' : '';
        for (const it of items12(sec)) { if (pos < 0) break; const j = parte.indexOf(it, pos); if (j < 0) { falta = falta || it.slice(0, 50); continue; } pos = j + it.length; }
        BT(!falta, `${w}${n}: falta o está fuera de orden un bloque del rito (${falta})`);
        BT(!/¿Renuevas tú/.test(parte), `${w}${n}: salió la Renovación de los Votos, que es otra opción`);
        BT((rito === 'baptism') !== /ORACIÓN DE LOS FIELES/.test(parte), `${w}${n}: la Oración de los Fieles ${rito === 'baptism' ? 'sobra (la Letanía por los Candidatos la sustituye)' : 'falta'}`);
        BT(rito !== 'baptism' || !/CONFESIÓN Y ABSOLUCIÓN/.test(parte), `${w}${n}: el Santo Bautismo no repite la confesión ni la paz`);
        BT(!/Que la luz de Cristo, elevándose en gloria.*ORACIÓN DE LOS FIELES.*ORACIÓN DESPUÉS DE LA COMUNIÓN.*Dios todopoderoso y eterno, que nada de lo que has hecho odias/.test(parte), `${w}${n}: se coló el cierre de Ceniza`);
      }
    }
  }
  // (d) Mismas palabras que el libro, sin las etiquetas de quien habla (el script las quita de unas líneas y deja otras): se comparan los
  // conjuntos de palabras, para que no sobre ni falte ninguna.
  try {
    const gen3 = require('./bcp2019-tools/build-holyweek.js');
    if (fs.existsSync(gen3.LOC_POR_DEFECTO)) {
      const L = fs.readFileSync(gen3.LOC_POR_DEFECTO, 'utf8').split(/\r?\n/);
      const ETQ = new Set(['celebrante', 'pueblo', 'pregunta', 'diácono', 'lector', 'oficiante', 'todos', 'obispo', 'presbítero']);
      const pal = s => s.toLowerCase().replace(/[.,;:¿?¡!()«»“”"⏎\[\]]/g, ' ').split(/\s+/).filter(x => x && !ETQ.has(x) && !/^\d{3}$/.test(x)).sort().join(' ');
      const tramo = (ini, desde) => { const a = L.findIndex((l, n) => n >= desde && l.trim().startsWith(ini)); const b = L.findIndex((l, n) => n > a && l.trim().startsWith('INDICACIONES ADICIONALES')); return L.slice(a, b).join(' '); };
      BT(pal(tramo('LA EXHORTACIÓN', 4140)) === pal(items12('easterVigilBaptism').join(' ')), 'easterVigilBaptism no tiene exactamente las palabras del libro (LOC l. 4144-4348)');
      BT(pal(tramo('LA PRESENTACIÓN', 4585)) === pal(items12('easterVigilBaptismConf').join(' ')), 'easterVigilBaptismConf no tiene exactamente las palabras del libro (LOC l. 4589-4817)');
    }
  } catch (e) { bt.push('no se pudo comprobar el texto del rito bautismal: ' + e.message); }
  check(`12. Vigilia con Santo Bautismo o con Confirmación (${btDias} Sábados Santos × 2 formas × 2 ritos), en la liturgia y el Librito`, bt, btDias * 4);

  // ── 13. Orden Penitencial ──────────────────────────────────────────────────────────────────────────────────────────
  // Alternativa de los Ritos Iniciales (`opts.opening === 'penitential'`; LOC l. 3623-3635): Aclamación, Colecta por la pureza, de rodillas
  // el Decálogo o el Resumen de la Ley, [Exhortación], Confesión y Absolución, Kyrie y Colecta del Día, SIN Gloria. Un día de cada tres
  // (alternando las dos formas de la Eucaristía) y todos los de rito propio: (a) los de Eucaristía ordinaria llevan ese orden, la
  // confesión una sola vez (no se repite tras las Oraciones del Pueblo) y la paz una; (b) Ramos, Ceniza, Jueves, Viernes y Sábado Santo
  // quedan IDÉNTICOS a su rito de siempre; (c) el Decálogo y la Exhortación tienen exactamente las palabras del libro.
  const op = []; let opDias = 0;
  const OP = (cond, msg) => { if (!cond) op.push(msg); };
  const RITO_PROPIO = new Set(['palmSunday', 'ashWednesday', 'maundyThursday', 'goodFriday', 'holySaturday']);
  for (let d = new Date(Y0, 0, 1, 12), i = 0; d.getFullYear() <= Y1; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12), i++) {
    const info = Cal.getDay(d), propio = RITO_PROPIO.has(info.key);
    if (!propio && i % 3 !== 0) continue;
    opDias++;
    const forma = (i % 2 === 0) ? 'standard' : 'renewed', w = `${iso(d)} ${info.key} ${forma}`;
    let html, lib; try { html = await generateLiturgy(d, { form: forma, opening: 'penitential' }); lib = Librito.generateLibrito(C.state()); } catch (e) { op.push(`${w}: lanzó ${e.message}`); continue; }
    if (propio) {
      const base = await generateLiturgy(d, { form: forma });
      OP(html === base, `${w}: el Orden Penitencial no debe cambiar el rito propio de este día`);
      continue;
    }
    const t = norm(strip(html));
    let pos = 0, falta = '';
    for (const m of ['RITOS INICIALES', 'LA ACLAMACIÓN', 'LA COLECTA POR PUREZA', 'RESUMEN DE LA LEY', 'EL DECÁLOGO', 'Dios habló estas palabras', 'LA EXHORTACIÓN', 'Amados míos en el Señor', 'CONFESIÓN Y ABSOLUCIÓN DE LOS PECADOS', 'KYRIE', 'LA COLECTA DEL DÍA']) { const j = t.indexOf(m, pos); if (j < 0) { falta = falta || m; continue; } pos = j + m.length; }
    OP(!falta, `${w}: el orden del Orden Penitencial falla en «${falta}»`);
    OP(!/GLORIA IN EXCELSIS/.test(t), `${w}: el Orden Penitencial no lleva Gloria`);
    OP((t.match(/CONFESIÓN Y ABSOLUCIÓN DE LOS PECADOS/g) || []).length === 1, `${w}: la confesión debe salir una sola vez`);
    OP((t.match(/✠ LA PAZ|LA PAZ/g) || []).length >= 1 && /LA PAZ/.test(t.slice(t.indexOf('ORACIÓN DE LOS FIELES'))), `${w}: tras las Oraciones del Pueblo debe ir la paz`);
    const tl = norm(strip(lib));
    OP(/ORDEN PENITENCIAL/.test(tl) && /inclinamos nuestro corazón a guardar esta ley/.test(tl) && !/GLORIA IN EXCELSIS/.test(tl) && (tl.match(/CONFESIÓN Y ABSOLUCIÓN/g) || []).length === 1, `${w} Librito: debe traer el Orden Penitencial con el Decálogo, sin Gloria y con una sola confesión`);
  }
  try {
    const gen4 = require('./bcp2019-tools/build-holyweek.js');
    if (fs.existsSync(gen4.LOC_POR_DEFECTO)) {
      const L = fs.readFileSync(gen4.LOC_POR_DEFECTO, 'utf8').split(/\r?\n/);
      const pal = s => s.toLowerCase().replace(/[.,;:¿?¡!()«»“”"⏎\[\]]/g, ' ').split(/\s+/).filter(x => x && !['celebrante', 'pueblo'].includes(x) && !/^\d{3}$/.test(x)).sort().join(' ');
      const tramo = (ini, fin, desde) => { const a = L.findIndex((l, n) => n >= desde && l.trim().startsWith(ini)); const b = L.findIndex((l, n) => n > a && l.trim().startsWith(fin)); return L.slice(a, b).join(' '); };
      OP(pal(tramo('Celebrante Dios habló estas palabras', 'ÉXODO 20:1-17', 2605)) === pal(items12('decalogue').join(' ')), 'decalogue no tiene exactamente las palabras del libro (LOC l. 2611-2643)');
      OP(pal(tramo('LA EXHORTACIÓN', 'MONICIONES PARA EL OFERTORIO', 3800)).replace(/^la exhortación /, '') === pal(items12('exhortation').join(' ')).replace(/^la exhortación /, ''), 'exhortation no tiene exactamente las palabras del libro (LOC l. 3806-3846)');
    }
  } catch (e) { op.push('no se pudo comprobar el texto del Decálogo y la Exhortación: ' + e.message); }
  check(`13. Orden Penitencial en vez de los Ritos Iniciales (${opDias} días, ambas formas), en la liturgia y el Librito`, op, opDias);

  // ── 8. Colectas ──────────────────────────────────────────────────────────
  // 5 oficiales (Ceniza y Semana Santa) idénticas al libro en español; 90 traducidas del inglés, de las que se
  // comprueba la forma (Amén, fórmula final, longitud, nombre del santo). El inglés no está en el repositorio: sin él
  // se omite esa comparación y se anota como pendiente.
  let colectas;
  try { colectas = require('./bcp2019-tools/check-colectas.js').compare(); } catch (e) { colectas = { total: 1, oficiales: 0, traducidas: 0, fallos: ['no se pudo comprobar: ' + e.message], notas: [] }; }
  check(`8. Colectas: ${colectas.oficialesComparadas} de ${colectas.oficiales} oficiales idénticas al libro en español y ${colectas.traducidas} traducidas con forma correcta`, colectas.fallos, colectas.total);

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
  console.log(`  - Colectas: ${colectas.traducidas} son traducción propia del inglés (el libro en español no trae «Colectas del Año Cristiano»), dadas por revisadas por delegación del usuario, no aprobadas por una autoridad eclesiástica; ver bcp2019/COLECTAS-REVISION.md.`);
  for (const n of colectas.notas || []) console.log('  - Colectas: ' + n + ' (ver bcp2019-tools/check-colectas.js).');
  console.log(`  - ${inheritFallback} días cuyo Propio de la semana es el 1 o el 2 usan la colecta del domingo anterior (sin texto español).`);
  console.log('  - Salmos: se leen de la Biblia de Jerusalén; el Salterio español del libro aún no se usa.');
  console.log('  - Lecturas: el libro en español no trae leccionario; el texto es de la Biblia de Jerusalén, que no trae Hechos 8:37 ni Marcos 9:44 y 9:46 (ver DIF_CONOCIDAS); Mateo 21:44 se completa con la NVI y lo avisa una rúbrica.');
  if (!prefacios) console.log('  - Prefacios: no se cotejaron con el libro (falta LOC-10-10-23.md; ver bcp2019-tools/check-prefacios.js).');
  console.log('  - Semana Santa y Ceniza (holyweek.js): Ceniza, Ramos, Jueves, Viernes, Sábado Santo y Gran Vigilia sí; sin modelar el Bautismo y la Renovación de los Votos de la Vigilia, y el texto de sus salmos y cánticos.');
  console.log(failed ? `\n${failed} comprobación(es) con fallos.` : '\nTodas las comprobaciones pasan.');
  process.exit(failed ? 1 : 0);
})();
