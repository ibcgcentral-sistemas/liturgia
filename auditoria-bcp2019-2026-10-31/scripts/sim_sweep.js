// sim_sweep.js — Barrido 2024-01-01 .. 2060-12-31 con generateLiturgy() REAL (con Biblia real).
// Escribe out/sweep.json (un registro por día) y out/sweep-summary.json.
// Uso: node sim_sweep.js [añoIni=2024] [añoFin=2060]
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./sim_lib');

const Y0 = +(process.argv[2] || 2024), Y1 = +(process.argv[3] || 2060);
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const C = L.load();
const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// Marcas de fallo buscadas en el HTML generado
const MARKS = {
  lecturaNoEspecificada: /\[Lectura no especificada/,
  primeraNoEspecificada: /\[Primera lectura no especificada/,
  evangelioNoEspecificado: /\[Evangelio no especificado/,
  noEspecificad: /no especificad/,
  errorBr: /\[Error/,
  undefinedW: /\bundefined\b/,
  NaN: /\bNaN\b/,
  objectObject: /\[object/,
  nullW: /\bnull\b/,
  lecturaTruncada: /Lectura truncada/,
  noDisponible: /no disponible/,
  refNoReconocida: /Referencia no reconocida/,
  libroNoEncontrado: /Libro no encontrado/,
  noSeEncontro: /No se encontr/,
  colectaNoDisponible: /Colecta no disponible/,
  bibliaNoCargada: /Biblia de Jerusal[eé]n no cargada/,
  invalidDate: /Invalid Date/,
};

const NOISE_RE = /<em class="rubric">\[[^\]]*\]<\/em>/g;

function variants(html) {
  const t = strip(html);
  const acc = /Bendigamos al Señor que perdona/.test(t) ? 'lent' : /¡Aleluya! ¡Cristo ha resucitado!/.test(t) ? 'easter' : /Bendito sea Dios: Padre, Hijo y Espíritu Santo/.test(t) ? 'std' : 'UNKNOWN';
  const gloria = /Gloria a Dios en el cielo/.test(t);
  const gloriaRubric = /El Gloria in excelsis se omite/.test(t);
  const fraction = /\[Aleluya\.\] Cristo, nuestra Pascua/.test(t) ? 'std' : (/Cristo, nuestra Pascua, es sacrificado por nosotros/.test(t) ? 'lent' : 'UNKNOWN');
  const dismissal = /Salgamos en el Nombre de Cristo, aleluya, aleluya/.test(t) ? 'alleluia' : /Salgamos en el Nombre de Cristo\./.test(t) ? 'std' : 'UNKNOWN';
  return { acc, gloria, gloriaRubric, fraction, dismissal };
}

(async () => {
  const recs = [];
  const t0 = Date.now();
  let n = 0;
  for (const date of L.eachDay(Y0, Y1)) {
    n++;
    const r = { d: L.iso(date), dow: date.getDay() };
    let dayInfo;
    try {
      dayInfo = C.BCPCalendar.getDay(date);
    } catch (e) { r.exc = 'getDay: ' + e.message; recs.push(r); continue; }
    Object.assign(r, { key: dayInfo.key, season: dayInfo.season, cycle: dayInfo.cycle, rank: dayInfo.rank, color: dayInfo.color, isFixed: !!dayInfo.isFixed, isTransferred: !!dayInfo.isTransferred, name: dayInfo.nameEs || dayInfo.name });
    // Resolución (replica app.js llamando a las funciones reales)
    try {
      const lk = C.resolveLectionaryKey(dayInfo, date);
      r.lkey = lk.key; r.borrowed = !!lk.borrowedFromSunday; r.lcycle = lk.cycle || dayInfo.cycle;
      const ck = C.resolveCollectKey(dayInfo, date);
      r.ckey = ck;
      r.collectOwn = !!C.BCPPropers.COLLECTS[dayInfo.key];
      r.collectFound = !!C.BCPPropers.COLLECTS[ck];
      if (!r.collectOwn && r.collectFound) {
        const prev = C.BCPCalendar.getDay(C.getPreviousSunday(date));
        r.prevSundayKey = prev.key; r.prevSundaySeason = prev.season; r.prevSundayDate = L.iso(C.getPreviousSunday(date));
      }
    } catch (e) { r.exc = 'resolve: ' + e.message; }

    const before = C.warns.length;
    let html = null;
    try {
      html = await C.generateLiturgy(date);
    } catch (e) { r.exc = (r.exc ? r.exc + ' | ' : '') + 'generate: ' + (e && e.stack ? e.stack.split('\n').slice(0, 2).join(' ') : e); }
    r.warns = C.warns.length - before;
    if (r.warns) r.warnTxt = C.warns.slice(before, before + 2);

    const st = C.getState();
    if (html != null && st) {
      r.htmlLen = html.length;
      const marks = [];
      for (const [k, re] of Object.entries(MARKS)) if (re.test(html)) marks.push(k);
      // 'null'/'undefined' también en estado
      r.marks = marks;
      const rd = st.readings;
      r.hasReadings = !!rd;
      if (rd) {
        r.refs = { first: rd.first, psalm: rd.psalm, second: rd.second || null, gospel: rd.gospel };
        const len = x => (x && x.text) ? x.text.length : 0;
        const bad = x => !!(x && /<em class="rubric">\[/.test(x.text || ''));
        r.firstLen = len(st.firstReading); r.firstBad = bad(st.firstReading);
        r.secondLen = rd.second ? len(st.secondReading) : null; r.secondBad = rd.second ? bad(st.secondReading) : false;
        r.gospelLen = len(st.gospel); r.gospelBad = bad(st.gospel);
        r.psalmN = st.psalmVerses ? st.psalmVerses.length : 0;
        r.psalmAnt = !!st.psalmAnt;
      }
      r.collectLen = (st.collect || '').length;
      r.prefaceTitle = st.preface ? st.preface.title : null;
      r.prefaceLen = st.preface && st.preface.text ? st.preface.text.length : 0;
      Object.assign(r, { v: variants(html) });
      // Secciones de lecturas realmente presentes en el HTML
      r.htmlHasFirst = /PRIMERA LECTURA/.test(html);
      r.htmlHasSecond = /SEGUNDA LECTURA/.test(html);
      r.htmlHasGospel = /SANTO EVANGELIO/.test(html);
      r.htmlHasPsalm = /SALMO RESPONSORIAL/.test(html);
      r.htmlNoFirst = /\[Primera lectura no especificada/.test(html);
      r.htmlNoGospel = /\[Evangelio no especificado/.test(html);
    }
    recs.push(r);
  }
  const ms = Date.now() - t0;
  fs.writeFileSync(path.join(OUT, 'sweep.json'), JSON.stringify(recs));
  console.log(`días simulados: ${recs.length} en ${ms} ms; con excepción: ${recs.filter(r => r.exc).length}; warns totales: ${C.warns.length}`);
  fs.writeFileSync(path.join(OUT, 'sweep-warns.json'), JSON.stringify(C.warns.slice(0, 500)));
})();
