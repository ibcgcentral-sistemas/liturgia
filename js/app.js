/**
 * app.js — Controlador Principal
 * Ensambla la liturgia completa para una fecha dada
 */

// Los relatos de la Pasión (Domingo de Ramos, Viernes Santo) llegan a ~17.700
// caracteres de forma legítima — el límite queda por encima de eso para no
// truncar Escritura real; solo protege contra un eventual bug de parseo.
const MAX_READING_LENGTH = 25000;
const TRUNCATE_AT = 22000;

// Estado de la última liturgia generada con éxito — el Librito del Pueblo
// se construye a partir de esto, nunca recalculando desde los controles,
// para garantizar que siempre corresponda a lo que está en pantalla.
let currentMassState = null;

async function fetchScripture(ref) {
  if (!ref) return { text: '<em class="rubric">[Lectura no especificada]</em>', reference: '' };

  if (window.BibliaJerusalen) {
    const result = window.BibliaJerusalen.getPassage(ref);
    if (result.text && result.text.length > MAX_READING_LENGTH) {
      console.warn(`Lectura sospechosamente larga para ${ref}: ${result.text.length} caracteres`);
      return {
        text: result.text.substring(0, TRUNCATE_AT) + '... <em class="rubric">[Lectura truncada]</em>',
        reference: ref
      };
    }
    return result;
  }
  return {
    text: `<em class="rubric">[Biblia de Jerusalén no disponible — ${ref}]</em>`,
    reference: ref,
  };
}

const DIRECT_LECTIONARY_KEYS = new Set([
  'advent1', 'advent2', 'advent3', 'advent4',
  'christmas', 'christmasSunday', 'christmasSunday2', 'circumcision',
  'epiphany', 'baptismLord',
  'epi1', 'epi2', 'epi3', 'epi4', 'epi5', 'epi6', 'epi7', 'epi8',
  'septuagesima', 'sexagesima', 'quinquagesima',
  'ashWednesday',
  'lent1', 'lent2', 'lent3', 'lent4', 'lent5',
  'palmSunday',
  // Lunes, Martes y Miércoles Santos: lectionary.js sirve ahora propios para los
  // tres. Antes no figuraban aquí y resolveLectionaryKey() los cortaba en seco,
  // de modo que eran los únicos días del año que se generaban sin Lectura ni
  // Evangelio.
  'mondayHolyWeek', 'tuesdayHolyWeek', 'wednesdayHolyWeek',
  'maundyThursday', 'goodFriday', 'holySaturday',
  'easter', 'easter2', 'easter3', 'easter4', 'easter5', 'easter6',
  'ascension', 'easter7', 'pentecost',
  'trinity', 'corpusChristi', 'sacredHeart',
]);

function getLectionaryKey(dayInfo) {
  const k = dayInfo.key;
  if (DIRECT_LECTIONARY_KEYS.has(k)) return k;
  if (k && k.startsWith('trinity')) return k;
  if (k && /^\d{2}-\d{2}$/.test(k)) return k;
  return null;
}

// Ferias sin lecturas propias: se repiten las del Domingo precedente —
// la práctica anterior a la reforma del leccionario de dos años, y más
// razonable que no mostrar ninguna lectura. El Lunes, Martes y Miércoles
// Santos ya no necesitan excepción alguna: tienen lecturas propias en
// lectionary.js y no llegan nunca al préstamo dominical.
function getPreviousSunday(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

// La Colecta del Día toma prestada la del Domingo/fiesta precedente cuando la
// feria no tiene una propia — a diferencia de resolveLectionaryKey(), esto NO
// excluye la Semana Santa: repetir la Colecta de Ramos el Lunes/Martes/
// Miércoles Santo es correcto (a diferencia de repetir la Pasión completa).
// Sin esto, Propers.getCollect() caía siempre a la del 15° Domingo después de
// la Trinidad en cualquier feria de cualquier época del año — confirmado por
// simulación: 7.619 de 7.646 ferias (99,6%) en 2024-2050, incluidas 915 de
// Cuaresma y 535 de Adviento.
function resolveCollectKey(dayInfo, date) {
  if (Propers.COLLECTS[dayInfo.key]) return dayInfo.key;
  const prevInfo = LiturgicalCalendar.getDay(getPreviousSunday(date));
  if (Propers.COLLECTS[prevInfo.key]) return prevInfo.key;
  return dayInfo.key;
}

function resolveLectionaryKey(dayInfo, date) {
  const direct = getLectionaryKey(dayInfo);
  if (direct) return { key: direct, borrowedFromSunday: false };
  const prevKey = getLectionaryKey(LiturgicalCalendar.getDay(getPreviousSunday(date)));
  return prevKey ? { key: prevKey, borrowedFromSunday: true } : { key: null, borrowedFromSunday: false };
}

const SEASON_MAP = {
  christmas: 'christmas', christmasSunday: 'christmas', circumcision: 'christmas',
  epiphany: 'epiphany', baptismLord: 'epiphany',
  septuagesima: 'preLent', sexagesima: 'preLent', quinquagesima: 'preLent',
  ashWednesday: 'lent', palmSunday: 'lent', maundyThursday: 'triduum',
  goodFriday: 'triduum', holySaturday: 'triduum',
  ascension: 'easter', pentecost: 'pentecost',
  trinity: 'trinity', corpusChristi: 'trinity', sacredHeart: 'trinity',
};

// El orden importa: 'christmasSunday'/'christmasFeria' antes que 'christmas',
// 'pentecostFeria' antes que 'pentecost', 'preLent' antes que 'lent'.
// Cubre todas las familias de claves que emite calendar.js, incluidas las
// nuevas (christmasFeria_N, epiOctave_N, epiFeria{N}_{dow}, lentFeriaAsh_{dow},
// ordinaryFeria{N}_{dow}).
const PREFIX_SEASONS = [
  ['advent',        'advent'],
  ['christmas',     'christmas'],
  ['circumcision',  'christmas'],
  ['epi',           'epiphany'],
  ['baptismLord',   'epiphany'],
  ['preLent',       'preLent'],
  ['lent',          'lent'],
  ['easter',        'easter'],
  ['ascension',     'easter'],
  ['pentecostFeria','pentecost'],
  ['pentecost',     'pentecost'],
  ['trinity',       'trinity'],
  ['ordinaryFeria', 'trinity'],
];

function getSeasonFromKey(dayKey) {
  if (!dayKey) return 'ordinary';
  if (SEASON_MAP[dayKey]) return SEASON_MAP[dayKey];
  for (const [prefix, season] of PREFIX_SEASONS) {
    if (dayKey.startsWith(prefix)) return season;
  }
  return 'ordinary';
}

// calendar.js clasifica la temporada por FECHA y la adjunta a cada día
// (day.season): es la fuente correcta, y la única que acierta con las fiestas
// fijas, cuya clave es 'MM-DD' y no dice nada del tiempo litúrgico. Aquí solo
// se traduce su vocabulario al que usan propers.js e intercessions.js.
//  · 'passiontide' (Domingo de Pasión → Jueves Santo) no existe como clave de
//    propios: el Tiempo de Pasión toma los del tiempo de Cuaresma.
//  · getSeasonFromKey() queda como red de seguridad para las misas votivas y
//    para cualquier objeto de día antiguo que no traiga `season`.
const CALENDAR_SEASONS = {
  advent: 'advent', christmas: 'christmas', epiphany: 'epiphany',
  preLent: 'preLent', lent: 'lent', passiontide: 'lent', triduum: 'triduum',
  easter: 'easter', pentecost: 'pentecost', trinity: 'trinity',
};

function resolveSeason(dayInfo, date) {
  // Los días con clave propia conservan su clasificación explícita: es la que
  // distingue el Triduo (Jueves Santo incluido) dentro del Tiempo de Pasión.
  if (dayInfo && SEASON_MAP[dayInfo.key]) return SEASON_MAP[dayInfo.key];
  const cal = (dayInfo && dayInfo.season) ||
              (date && typeof LiturgicalCalendar !== 'undefined' ? LiturgicalCalendar.getSeason(date) : null);
  if (cal && CALENDAR_SEASONS[cal]) return CALENDAR_SEASONS[cal];
  return getSeasonFromKey(dayInfo && dayInfo.key);
}

// ══════════════════════════════════════════════════════════════════════════
//  GENERACIÓN DE LA LITURGIA PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════
async function generateLiturgy(date, canonType = 'roman', votiveType = 'none', lang = 'es') {
  let dayInfo = LiturgicalCalendar.getDay(date);
  let omissions = LiturgicalCalendar.getOmissions(dayInfo);

  // Inicializar idioma y día en Canon
  Canon.setLanguage(lang, dayInfo.key);

  if (votiveType !== 'none') {
    if (votiveType === 'requiem') {
      dayInfo = { ...dayInfo, name: 'Misa de Réquiem (Fieles Difuntos)', nameEs: 'Misa de Réquiem (Fieles Difuntos)', color: 'black', rank: 'double', key: 'requiem' };
      omissions = [{ part: 'gloria', reason: 'Misa de Réquiem' }, { part: 'credo', reason: 'Misa de Réquiem' }, { part: 'aleluya', reason: 'Se usa el Tracto' }, { part: 'judica', reason: 'Se omite en misas de difuntos' }];
    } else if (votiveType === 'holySpirit') {
      dayInfo = { ...dayInfo, name: 'Misa Votiva del Espíritu Santo', nameEs: 'Misa Votiva del Espíritu Santo', color: 'red', key: 'holySpirit' };
      omissions = omissions.filter(o => o.part !== 'aleluya' && o.part !== 'gloria');
    } else if (votiveType === 'bvm') {
      dayInfo = { ...dayInfo, name: 'Misa Votiva de Santa María Virgen', nameEs: 'Misa Votiva de Santa María Virgen', color: 'white', key: 'bvm' };
      omissions = omissions.filter(o => o.part !== 'aleluya');
    }
  }

  const cycle = dayInfo.cycle;
  // El ciclo ferial (I/II) ya no se anuncia: este misal no sirve leccionario
  // ferial propio — las ferias repiten las lecturas del Domingo precedente —,
  // de modo que rotular un ciclo ferial prometía una distinción que ninguna
  // página llegaba a aplicar. El ciclo dominical A/B/C sí es real y se mantiene.
  const season = resolveSeason(dayInfo, date);
  const { key: lKey, borrowedFromSunday } = resolveLectionaryKey(dayInfo, date);
  const readings = lKey ? Lectionary.getSundayReadings(lKey, cycle) : null;
  const key = dayInfo.key;

  // Propios. propers.js señala con `supplied: true` (más la temporada) los
  // textos que no son los propios del día sino los del tiempo; takeProper()
  // recoge esa señal en `suppliedProperNotes` y devuelve el texto en la misma
  // forma de siempre, de modo que el motor funciona igual si propers.js aún no
  // expone la señal.
  const suppliedProperNotes = [];
  const takeProper = (value, part, keepObject) => {
    if (value && typeof value === 'object' && value.supplied === true) {
      suppliedProperNotes.push({ part, season: value.season || season });
      if (!keepObject && typeof value.text === 'string') return value.text;
    }
    return value;
  };

  // Los getters antiguos de propers.js devuelven solo el valor y pierden los
  // metadatos, así que se consulta getProper() cuando está disponible: trae
  // `supplied`, `rubric` y `omitted` junto al texto. Si no existiera (versión
  // anterior de propers.js), se cae a los getters de siempre.
  // propers.js nombra las piezas en inglés; la interfaz las rotula en español.
  const PART_LABELS = {
    collect: 'Colecta', preface: 'Prefacio', introit: 'Introito', gradual: 'Gradual',
    offertory: 'Ofertorio', communion: 'Antífona de Comunión', secret: 'Secreta',
    postcommunion: 'Poscomunión',
  };
  const proper = (part, k, getter) => {
    if (typeof Propers.getProper === 'function') {
      const r = Propers.getProper(part, k, season) || {};
      if (r.supplied === true || r.omitted === true) {
        suppliedProperNotes.push({ part: PART_LABELS[part] || part, season: r.from || r.season || season, rubric: r.rubric, omitted: r.omitted === true, note: r.note || null });
      }
      if (r.value !== undefined && r.value !== null) return r.value;
    }
    return getter();
  };

  const collectKey = resolveCollectKey(dayInfo, date);
  const collect = proper('collect', collectKey, () => Propers.getCollect(collectKey)) || 'Colecta no disponible para este día.';
  const preface = proper('preface', key, () => Propers.getPreface(key, season));
  const introit = proper('introit', key, () => Propers.getIntroit(key, season)) || { ant:'' };
  const gradual = proper('gradual', key, () => Propers.getGradual(key, season)) || null;
  const offertory = proper('offertory', key, () => Propers.getOffertory(key, season)) || '';
  const communion = proper('communion', key, () => Propers.getCommunion(key, season)) || '';
  const secret = proper('secret', key, () => Propers.getSecret(key, season)) || '';
  const postcommunion = proper('postcommunion', key, () => Propers.getPostcommunion(key, season)) || '';

  // Omisiones
  const omitGloria = omissions.some(o => o.part === 'gloria');
  const omitAlleluia = omissions.some(o => o.part === 'aleluya' || o.part === 'alleluia');
  const omitCreed = omissions.some(o => o.part === 'credo' || o.part === 'creed');
  const omitJudica = Canon.omitJudica(key, dayInfo.color);
  const useBenoedicamus = omissions.some(o => o.part === 'ite missa est' || o.part === 'iteMissaEst');
  const veiled = omissions.some(o => o.part === 'velos' || o.part === 'crucifixVeiled');

  // Embolismos
  const communicantesEmbolism = Canon.getCommunicantesEmbolism(key);
  const hancIgitur = Canon.getHancIgitur(key);

  // Escritura — con timeout, nunca bloquea
  let firstReading = null, psalmVerses = [], secondReading = null, gospel = null;
  let psalmAnt = '';
  if (readings) {
    try {
      [firstReading, secondReading, gospel] = await Promise.all([
        fetchScripture(readings.first),
        readings.second ? fetchScripture(readings.second) : Promise.resolve(null),
        fetchScripture(readings.gospel),
      ]);
      psalmVerses = (window.BibliaJerusalen && readings.psalm)
        ? window.BibliaJerusalen.getVerses(readings.psalm)
        : [];
    } catch (e) {
      firstReading = { text: '<em class="rubric">[Error cargando lectura]</em>', reference: '' };
      psalmVerses = [];
      secondReading = null;
      gospel = { text: '<em class="rubric">[Error cargando evangelio]</em>', reference: '' };
    }
    psalmAnt = readings.psalmAnt || '';
  }

  // Intercesiones
  const gospelRef = readings ? readings.gospel : '';
  const gospelText = gospel ? gospel.text : '';
  const intercessions = Intercessions.generateIntercessions(gospelRef, dayInfo.name, season, cycle, gospelText, lKey);

  // Gradual / Aleluya / Tracto
  let gradualText = '';
  if (gradual) {
    gradualText = gradual.text || '';
  }

  // Conmemoraciones: detectar colisión con fiestas fijas desplazadas
  const occurrence = Commemorations.resolveOccurrence(dayInfo, date);
  const commemorations = occurrence.commemorations;
  const omittedFeasts = occurrence.omitted || [];

  // Capturar el estado exacto de esta liturgia para que el Librito del Pueblo
  // (botón "📕 Librito") corresponda siempre a lo que se acaba de generar.
  currentMassState = {
    date, dayInfo, readings, cycle, firstReading, secondReading, gospel,
    psalmVerses, psalmAnt, collect, introit, offertory, communion,
    omitGloria, omitCreed, omitAlleluia, canonType, intercessions, lang,
    secret, preface, postcommunion, omitJudica, season,
    commemorations, hancIgitur, useBenoedicamus, votiveType,
    omissions, borrowedFromSunday, omittedFeasts, suppliedProperNotes,
  };

  return buildLiturgyHTML({
    date, dayInfo, cycle, season, key, omissions, omittedFeasts, suppliedProperNotes,
    readings, firstReading, psalmVerses, psalmAnt, secondReading, gospel,
    collect, preface, introit, gradualText, offertory, communion, secret, postcommunion,
    omitGloria, omitAlleluia, omitCreed, omitJudica, useBenoedicamus, veiled,
    communicantesEmbolism, hancIgitur, intercessions, commemorations, canonType, votiveType,
    borrowedFromSunday,
  });
}

// ══════════════════════════════════════════════════════════════════════════
//  INCLINACIÓN DE CABEZA ANTE EL SANTO NOMBRE
// ══════════════════════════════════════════════════════════════════════════
function withJesusBow(html) {
  return html.replace(/\bJesús\b/g, 'Jesús <span class="lit-rubric">(inclinación de cabeza)</span>');
}

// ══════════════════════════════════════════════════════════════════════════
//  CONSTRUCTOR DE HTML
// ══════════════════════════════════════════════════════════════════════════
function buildLiturgyHTML(d) {
  const dateStr = formatLiturgyDate(d.date);
  const colorClass = `color-${d.dayInfo.color}`;
  const colorName = getColorName(d.dayInfo.color);
  const rankName = getRankName(d.dayInfo.rank);
  const cycleInfo = `Ciclo dominical ${d.cycle}`;

  const fmtReading = (ref, data, label, type) => {
    if (!data) return '';
    let header = '';
    if (type === 'first') header = `<h3 class="section-title">✠ PRIMERA LECTURA</h3><p class="rubric">Lectura de <em>${ref}</em></p>`;
    if (type === 'second') header = `<h3 class="section-title">✠ SEGUNDA LECTURA</h3><p class="rubric">Lectura de <em>${ref}</em></p>`;
    if (type === 'gospel') header = `<div style="text-align:center; margin-bottom:1.5rem;"><img src="img/woodcut-gospel.png" alt="Evangeliario" style="max-height:85px; opacity:0.85; filter: contrast(1.2) sepia(0.3) hue-rotate(-15deg);"></div><h3 class="section-title gospel-title">✠ SANTO EVANGELIO</h3><p class="rubric gospel-incensation">(El Sacerdote o Diácono inciensa el Evangeliario tres veces y hace la señal de la cruz ✠ sobre la frente, labios y pecho)</p><p class="rubric">Lectura del Santo Evangelio según <em>${ref}</em></p>`;
    return `
      <div class="reading ${type}-reading">
        ${header}
        ${type === 'gospel' ? '<p class="response"><strong>R/. Gloria a ti, Señor.</strong></p>' : ''}
        <div class="scripture-text">${data.text}</div>
        ${type === 'gospel'
          ? '<p class="response">Palabra del Señor. <strong>R/. Te alabamos, Señor.</strong></p>'
          : '<p class="response">Palabra de Dios. <strong>R/. Te alabamos, Señor.</strong></p>'}
      </div>`;
  };

  const fmtPsalm = (ref, verses, ant) => {
    if (!verses || verses.length === 0) return '';
    const antLine = ant
      ? `<span class="lit-line pueblo"><span class="lit-label">P.</span><span class="lit-text"><strong>R/. ${ant}</strong></span></span>`
      : '';

    // Agrupar versos en estrofas de 2 versos
    const strophes = [];
    for (let i = 0; i < verses.length; i += 2) {
      strophes.push(verses.slice(i, i + 2));
    }

    let html = `<div class="reading psalm-reading">
      <h3 class="section-title">✠ SALMO RESPONSORIAL</h3>
      <p class="rubric">${ref}</p>
      <div class="liturgical-text-block">
      ${antLine}`;

    strophes.forEach(strophe => {
      const stropheText = strophe
        .map(v => `<sup class="verse-num">${v.v}</sup> ${v.content}`)
        .join('<br>');
      html += `<span class="lit-line lector"><span class="lit-label">L.</span><span class="lit-text">${stropheText}</span></span>`;
      html += antLine;
    });

    html += `</div></div>`;
    return html;
  };

  const fmtIntercessions = (i) => {
    if (!i) return '';
    let html = `<div class="intercessions">
      <h3 class="section-title">✠ ORACIÓN DE LOS FIELES</h3>
      <div class="liturgical-text-block">${i.header}</div>`;
    i.petitions.forEach(p => {
      html += `<div class="petition">
        <p class="rubric petition-intro">${p.intro}</p>
        <p class="petition-text">${p.body}</p>
      </div>`;
    });
    html += `<div class="liturgical-text-block">${i.close}</div></div>`;
    return html;
  };

  // ── RÚBRICAS DE TRASLACIÓN ─────────────────────────────────────────────
  // calendar.js traslada las fiestas de I clase impedidas (Semana Santa,
  // Triduo, Octava de Pascua, Miércoles de Ceniza, Octava de Navidad).
  // Se anuncia en los dos extremos: en la fecha propia, adónde va la fiesta;
  // en la fecha de destino, de dónde viene y qué cede el día.
  const fmtDay = (v) => {
    if (!v) return '';
    const dt = (v instanceof Date) ? v : new Date(String(v) + 'T12:00:00');
    return isNaN(dt.getTime()) ? String(v) : formatLiturgyDate(dt);
  };
  const tf = d.dayInfo.translatedFeast;
  const translationHTML = [
    tf ? `<p class="rubric">✠ La fiesta de ${tf.nameEs || tf.name}, impedida hoy, ${
      (tf.to || tf.toISO)
        ? `se traslada al ${fmtDay(tf.to || tf.toISO)}`
        : 'se omite este año por no hallarse día libre'}.</p>` : '',
    d.dayInfo.isTranslated
      ? `<p class="rubric">✠ Fiesta trasladada${d.dayInfo.translatedFromISO ? ` desde el ${fmtDay(d.dayInfo.translatedFromISO)}` : ''}, por haber estado impedida en su fecha propia.${
        d.dayInfo.displacedDay && d.dayInfo.displacedDay.nameEs
          ? ` Hoy cede ante ella ${d.dayInfo.displacedDay.nameEs}.` : ''}</p>` : '',
    (d.omittedFeasts || []).filter(f => f.reason === 'privileged').map(f =>
      `<p class="rubric">✠ La fiesta de ${f.name} cede hoy ante el día privilegiado y no se conmemora.</p>`).join(''),
  ].join('');

  // Textos servidos del tiempo, no propios del día (señal `supplied` de
  // propers.js). Se marcan uno a uno, con una rúbrica discreta junto al texto:
  // «(Secreta del tiempo)», «(Introito del tiempo)»…
  // Una pieza OMITIDA (`omitted: true` — p. ej. el Ofertorio y la Secreta del
  // Viernes Santo, que la Misa de los Presantificados no tiene) no es una pieza
  // suplida: no debe llevar la rúbrica «del tiempo» sino la nota que explica por
  // qué no hay texto. Antes ambas señales se mezclaban y el Viernes Santo salía
  // con «(Ofertorio del tiempo)» seguido de «[Antífona de ofertorio no
  // disponible]», y con la Secreta en blanco y sin explicación.
  const suppliedParts = new Set((d.suppliedProperNotes || [])
    .filter(n => !n.omitted).map(n => n.part));
  const omittedNotes = new Map((d.suppliedProperNotes || [])
    .filter(n => n.omitted).map(n => [n.part, n.note]));
  const suppliedMark = (part) => suppliedParts.has(part)
    ? ` <em class="rubric">(${part} del tiempo)</em>` : '';
  // Texto a mostrar en lugar de una pieza que este día no tiene. La nota la
  // redacta propers.js; aquí no se inventa ninguna.
  const omittedText = (part) => omittedNotes.has(part)
    ? `<em class="rubric">${omittedNotes.get(part) || `[Hoy no se dice ${part}.]`}</em>` : null;

  const omissionHTML = d.omissions.length ?
    `<div class="omission-notes">
      <h3>✠ NOTAS DE OMISIONES Y VARIACIONES:</h3>
      <ul>${d.omissions.map(o => `<li>${o.part.toUpperCase()}: ${o.reason || o.note || ''}</li>`).join('')}</ul>
    </div>` : '';

  return `
  <div class="liturgy-document">

    <!-- PORTADA DEL MISAL -->
    <div class="cover-page">
      <div class="cover-cross">✠</div>
      <h2 class="cover-title">MISSALE<br>ANGLICANUM</h2>
      <div class="cover-divider"></div>
      <h2 class="cover-feast">${d.dayInfo.nameEs || d.dayInfo.name}</h2>
      <p class="cover-date">${dateStr}</p>
      ${getRandomFatherQuote(d.readings?.gospel, d.gospel?.text, d.date)}
    </div>

    <!-- ENCABEZADO -->
    <div class="feast-header ${colorClass}">
      <div class="color-band"></div>
      <div class="feast-info">
        <p class="feast-date">${dateStr}</p>
        <h2 class="feast-name-en">${d.dayInfo.nameEs || d.dayInfo.name}</h2>
        <p class="feast-meta">
          <span>Color litúrgico: <strong>${colorName}</strong></span>
          <span>Rango: <strong>${rankName}</strong></span>
          <span>${cycleInfo}</span>
        </p>
      </div>
    </div>

    ${translationHTML}

    ${omissionHTML}

    <!-- ═══════════════ RITOS INICIALES ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ RITOS INICIALES</h3>

      ${(d.date.getDay() === 0 && d.votiveType === 'none') ? (
      (d.season === 'easter' || d.key === 'pentecost')
        ? `<h4 class="section-title">RITO DE ASPERSIÓN — VIDI AQUAM</h4>
           <div class="liturgical-text-block">${Canon.VIDI_AQUAM}</div>`
        : `<h4 class="section-title">RITO DE ASPERSIÓN — ASPERGES ME</h4>
           <div class="liturgical-text-block">${Canon.getAspergesMe(d.key)}</div>`
    ) : ''}

      ${!d.omitJudica ? `
      <h4 class="section-title">SALMO 43 — AL PIE DEL ALTAR</h4>
      <div class="liturgical-text-block">${Canon.JUDICA_ME}</div>
      ` : '<p class="rubric">El Salmo 43 (Judica me) se <strong>omite</strong> hoy.</p>'}

      <h4 class="section-title">CONFITEOR</h4>
      <div class="liturgical-text-block">${Canon.CONFITEOR}</div>

      <h4 class="section-title">SUBIDA AL ALTAR</h4>
      <div class="liturgical-text-block">${Canon.ASCENT}</div>
    </div>

    <!-- INTROITO -->
    <div class="mass-section">
      <h3 class="section-title">✠ INTROITO</h3>${suppliedMark('Introito')}
      <p class="rubric">(El Sacerdote impone y bendice el incienso, y turifica el altar)</p>
      <p class="rubric">Se canta o dice al llegar al altar.</p>
      <div class="liturgical-text-block">${d.introit ? d.introit.ant : '<em class="rubric">[Introito propio no disponible — usar el del Común]</em>'}</div>
    </div>

    <!-- KYRIE -->
    <div class="mass-section">
      <h3 class="section-title">✠ KYRIE ELEISON</h3>
      <div class="liturgical-text-block">${Canon.KYRIE}</div>
    </div>

    <!-- GLORIA — En los ritos de 1662 y 1928 se traslada al final de la Misa -->
    <div class="mass-section">
      ${d.canonType === '1662' ?
      '<p class="rubric">✠ <em>El Gloria in excelsis se dice al final de la Misa, después de la Comunión, según el uso del BCP 1662.</em></p>' :
      d.canonType === '1928' ?
      '<p class="rubric">✠ <em>El Gloria in excelsis se dice al final de la Misa, después de la Comunión, según el uso del BCP 1928.</em></p>' :
      d.omitGloria ?
      '<p class="rubric">✠ <strong>GLORIA IN EXCELSIS DEO — OMITIDO</strong> por estar en tiempo penitencial (Adviento/Cuaresma/Réquiem).</p>' :
      `<h3 class="section-title">✠ GLORIA IN EXCELSIS DEO</h3><div class="liturgical-text-block">${Canon.GLORIA}</div>`}
    </div>

    <!-- COLECTA + CONMEMORACIÓN -->
    <div class="mass-section">
      <h3 class="section-title">✠ COLECTA DEL DÍA</h3>${suppliedMark('Colecta')}
      <div class="liturgical-text-block">${Canon.SALUTATION}</div>
      <div class="prayer-text collect-text">${withJesusBow(d.collect)}</div>
    </div>

    ${d.commemorations && d.commemorations.length > 0 ? Commemorations.buildCommemorationHTML(d.commemorations) : ''}

    <!-- ═══════════════ LITURGIA DE LA PALABRA ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ LITURGIA DE LA PALABRA</h3>

      ${d.borrowedFromSunday ? '<p class="rubric">✠ Esta feria no tiene lecturas propias asignadas: se repiten las del Domingo precedente, según la práctica tradicional.</p>' : ''}

      ${d.firstReading && d.readings ? fmtReading(translateBibleReference(d.readings.first), d.firstReading, '', 'first') : '<p class="rubric">[Primera lectura no especificada para este día]</p>'}

      ${d.psalmVerses && d.psalmVerses.length && d.readings ? fmtPsalm(translateBibleReference(d.readings.psalm), d.psalmVerses, d.psalmAnt) : ''}

      ${d.secondReading && d.readings && d.readings.second ? fmtReading(translateBibleReference(d.readings.second), d.secondReading, '', 'second') : ''}

      <!-- GRADUAL / ALELUYA / TRACTO -->
      <div class="gradual-section">
        <h3 class="section-title">✠ ${d.omitAlleluia ? 'GRADUAL / TRACTO' : 'GRADUAL / ALELUYA'}</h3>${suppliedMark('Gradual')}
        ${d.omitAlleluia ?
      '<p class="rubric">El Aleluya no se canta desde Septuagésima hasta la Vigilia Pascual. Se usa el Tracto.</p>' :
      '<p class="rubric">Se canta el Aleluya con su versículo: <em>Aleluya, aleluya. V. ' + (function(g){ if(!g || !g.text) return 'Muéstranos, Señor, tu misericordia y danos tu salvación.'; let t = g.text.replace(/<[^>]*>?/gm, '').trim(); t = t.replace(/^\s*\d+[\s\-\.]*/, ''); t = t.replace(/^En aquel tiempo,\s*/i, ''); let m = t.match(/^([^.?!;]+[.?!;])/); return m ? m[1].trim() : t.substring(0, 80).trim() + '...'; })(d.gospel) + ' Aleluya.</em></p>'}
        <div class="liturgical-text-block">${d.gradualText || '<em class="rubric">[Gradual propio no disponible]</em>'}</div>
      </div>

      ${d.gospel && d.readings ? fmtReading(translateBibleReference(d.readings.gospel), d.gospel, '', 'gospel') : '<p class="rubric">[Evangelio no especificado para este día]</p>'}
    </div>

    <!-- HOMILÍA -->
    <div class="mass-section">
      <p class="rubric">✠ HOMILÍA — El sacerdote predica. Sigue un momento de silencio.</p>
    </div>

    <!-- CREDO -->
    <div class="mass-section">
      ${d.omitCreed ?
      '<p class="rubric">✠ <strong>CREDO NICENO — OMITIDO</strong> hoy por ser feria sin rango especial.</p>' :
      `<h3 class="section-title">✠ CREDO NICENO</h3><div class="liturgical-text-block">${Canon.CREED}</div>`}
    </div>

    <!-- ORACIÓN DE LOS FIELES -->
    ${fmtIntercessions(d.intercessions)}

    <!-- ═══════════════ LITURGIA EUCARÍSTICA ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ LITURGIA EUCARÍSTICA — OFERTORIO</h3>
      <h4 class="section-title">ANTÍFONA DE OFERTORIO</h4>${suppliedMark('Ofertorio')}
      <p class="rubric">(El Sacerdote impone y bendice el incienso, y turifica el altar)</p>
      <div class="liturgical-text-block">${d.offertory || omittedText('Ofertorio') || '<em class="rubric">[Antífona de ofertorio no disponible]</em>'}</div>

      <div class="liturgical-text-block">${Canon.OFFERTORY}</div>

      <h4 class="section-title">ORACIÓN SOBRE LAS OFRENDAS (Secreta)</h4>${suppliedMark('Secreta')}
      <div class="prayer-text">${d.secret || omittedText('Secreta') || ''}</div>
    </div>

    ${d.canonType === '1662' ? `
    <!-- ORACIÓN POR LA IGLESIA MILITANTE (RITO DE 1662) — vivos y difuntos -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ ORACIÓN POR LA IGLESIA MILITANTE</h3>
      <div class="liturgical-text-block">${Canon.CHURCH_MILITANT_1662}</div>
    </div>
    ` : d.canonType === '1928' ? `
    <!-- ORACIÓN POR TODA LA IGLESIA (RITO DE 1928) — vivos y difuntos -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ ORACIÓN POR TODA LA IGLESIA</h3>
      <div class="liturgical-text-block">${Canon.CHURCH_MILITANT_1928}</div>
    </div>
    ` : ''}

    <!-- PREFACIO -->
    <div class="mass-section">
      <h3 class="section-title">✠ PREFACIO: ${d.preface ? d.preface.title.toUpperCase() : 'PREFACIO COMÚN'}</h3>
      <div class="liturgical-text-block">${Canon.SURSUM_CORDA}</div>
      <div class="prayer-text">${d.preface ? (d.preface.intro || d.preface.text || '') : ''}</div>
    </div>

    <!-- SANCTUS -->
    <div class="mass-section">
      <h3 class="section-title">✠ SANCTUS Y BENEDICTUS</h3>
      <div class="liturgical-text-block">${Canon.SANCTUS}</div>
    </div>

    <!-- EL CANON DE LA MISA -->
    <div class="mass-section canon-section">
      <div style="text-align:center; margin-bottom:2rem;"><img src="img/woodcut-canon.png" alt="Cáliz" style="max-height:110px; opacity:0.9; filter: contrast(1.2) sepia(0.3) hue-rotate(-15deg);"></div>
      ${d.canonType === '1549' ? `
        <h3 class="section-title main-section">✠ EL CANON (RITO DE 1549)</h3>
        <div class="liturgical-text-block">${Canon.CANON_1549}</div>
        ` : d.canonType === '1662' ? `
        <h3 class="section-title main-section">✠ EL CANON (RITO DE 1662)</h3>
        <div class="liturgical-text-block">${Canon.CANON_1662}</div>
        ` : d.canonType === '1928' ? `
        <h3 class="section-title main-section">✠ EL CANON (RITO DE 1928)</h3>
        <div class="liturgical-text-block">${Canon.CANON_1928}</div>
        ` : `
        <h3 class="section-title main-section">✠ EL CANON DE LA MISA (MISAL ANGLICANO)</h3>
        <div class="liturgical-text-block">${Canon.CANON_TEXT}</div>
        <div class="liturgical-text-block">${d.hancIgitur}</div>
        <div class="liturgical-text-block">${Canon.CANON_CONTINUED}</div>
      `}
    </div>

    <!-- PADRENUESTRO Y PAZ -->
    <div class="mass-section">
      ${d.canonType === '1662' ? `
        <h3 class="section-title">✠ FRACCIÓN DEL PAN</h3>
        <p class="rubric">En el rito de 1662, el Padre Nuestro se reza después de la Comunión. El Sacerdote procede directamente a la fracción del Pan.</p>
      ` : d.canonType === '1928' ? `
        <h3 class="section-title">✠ FRACCIÓN DEL PAN</h3>
        <p class="rubric">En el rito de 1928, el Padre Nuestro se reza después de la Comunión. El Sacerdote procede directamente a la fracción del Pan.</p>
      ` : `
        <h3 class="section-title">✠ PADRENUESTRO, FRACCIÓN Y PAZ</h3>
        ${d.canonType === '1549' ? `
          <div class="liturgical-text-block">${Canon.PATER_NOSTER.replace('Oremos. Fieles a la recomendación del Salvador', 'Como nuestro Salvador Cristo nos ha mandado y enseñado, nos atrevemos a decir:')}</div>
        ` : `
          <div class="liturgical-text-block">${Canon.PATER_NOSTER}</div>
        `}
      `}
    </div>

    <!-- COMUNIÓN -->
    <div class="mass-section">
      <div style="text-align:center; margin-bottom:1.5rem;"><img src="img/woodcut-agnus.png" alt="Agnus Dei" style="max-height:90px; opacity:0.85; filter: contrast(1.2) sepia(0.3) hue-rotate(-15deg);"></div>
      <h3 class="section-title">✠ SAGRADA COMUNIÓN</h3>
      <div class="liturgical-text-block">${Canon.COMMUNION_PREP}</div>

      <h4 class="section-title">ANTÍFONA DE COMUNIÓN</h4>${suppliedMark('Antífona de Comunión')}
      <div class="liturgical-text-block">${d.communion || ''}</div>

      <div class="liturgical-text-block">${Canon.ABLUTIONS}</div>
    </div>

    ${d.canonType === '1662' ? `
    <!-- PADRE NUESTRO POST-COMUNIÓN (RITO DE 1662) -->
    <div class="mass-section">
      <h3 class="section-title">✠ PADRENUESTRO (DESPUÉS DE LA COMUNIÓN)</h3>
      <p class="rubric">Según el rito de 1662, el Padre Nuestro se reza después de la Comunión.</p>
      <div class="liturgical-text-block">${Canon.PATER_NOSTER}</div>
    </div>

    <!-- ORACIÓN DE OBLACIÓN O ACCIÓN DE GRACIAS (1662) -->
    <div class="mass-section">
      <h3 class="section-title">✠ ORACIÓN DE OBLACIÓN (1662)</h3>
      <div class="prayer-text">Oh Señor y Padre celestial, nosotros, tus humildes siervos, deseamos enteramente que tu paternal bondad acepte misericordiosamente este nuestro sacrificio de alabanza y acción de gracias; suplicándote humildísimamente que nos concedas, por los méritos y muerte de tu Hijo Jesucristo, y por la fe en su Sangre, a nosotros y a toda tu Iglesia, la remisión de nuestros pecados, y todos los demás beneficios de su Pasión. Y aquí nos ofrecemos y presentamos a ti, oh Señor, nosotros mismos, nuestras almas y cuerpos, para ser un sacrificio razonable, santo y vivo ante ti; suplicándote humildemente que todos cuantos hemos sido partícipes de esta santa Comunión seamos llenos de tu gracia y bendición celestial. Y aunque somos indignos, por nuestros muchos pecados, de ofrecerte sacrificio alguno, te rogamos sin embargo que aceptes este nuestro deber y servicio obligado; no pesando nuestros méritos, sino perdonando nuestras ofensas; por Jesucristo nuestro Señor, por quien, y con quien, en la unidad del Espíritu Santo, todo honor y gloria sea a ti, oh Padre Todopoderoso, por los siglos de los siglos. Amén.</div>
    </div>

    <!-- GLORIA AL FINAL DE LA MISA (RITO DE 1662) -->
    <div class="mass-section">
      ${d.omitGloria ?
      '<p class="rubric">✠ <strong>GLORIA IN EXCELSIS DEO — OMITIDO</strong> por estar en tiempo penitencial.</p>' :
      `<h3 class="section-title">✠ GLORIA IN EXCELSIS DEO</h3>
       <p class="rubric">En el rito de 1662, el Gloria se dice al final de la Misa.</p>
       <div class="liturgical-text-block">${Canon.GLORIA}</div>`}
    </div>
    ` : ''}

    ${d.canonType === '1928' ? `
    <!-- PADRE NUESTRO POST-COMUNIÓN (RITO DE 1928) -->
    <div class="mass-section">
      <h3 class="section-title">✠ PADRENUESTRO (DESPUÉS DE LA COMUNIÓN)</h3>
      <p class="rubric">Según el rito de 1928, el Padre Nuestro se reza después de la Comunión.</p>
      <div class="liturgical-text-block">${Canon.PATER_NOSTER}</div>
    </div>

    <!-- ORACIÓN DE ACCIÓN DE GRACIAS (1928) -->
    <div class="mass-section">
      <h3 class="section-title">✠ ORACIÓN DE ACCIÓN DE GRACIAS (1928)</h3>
      <div class="liturgical-text-block">${Canon.THANKSGIVING_1928}</div>
    </div>

    <!-- GLORIA AL FINAL DE LA MISA (RITO DE 1928) -->
    <div class="mass-section">
      ${d.omitGloria ?
      '<p class="rubric">✠ <strong>GLORIA IN EXCELSIS DEO — OMITIDO</strong> por estar en tiempo penitencial.</p>' :
      `<h3 class="section-title">✠ GLORIA IN EXCELSIS DEO</h3>
       <p class="rubric">En el rito de 1928, el Gloria se dice al final de la Misa.</p>
       <div class="liturgical-text-block">${Canon.GLORIA}</div>`}
    </div>
    ` : ''}

    <!-- POSCOMUNIÓN -->
    <div class="mass-section">
      <h3 class="section-title">✠ ORACIÓN DE POSCOMUNIÓN</h3>${suppliedMark('Poscomunión')}
      <div class="prayer-text">${d.postcommunion}</div>
    </div>

    <!-- DESPEDIDA -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ BENDICIÓN Y DESPEDIDA</h3>
      <div class="liturgical-text-block">${(d.season === 'easter' || d.season === 'pentecost') ? Canon.DISMISSAL_PASCHALTIDE : Canon.DISMISSAL}</div>
      ${d.votiveType === 'requiem' ?
      '<p class="rubric">✠ En la Misa de Réquiem se dice: <strong>Requiéscant in pace</strong> (Descansen en paz). <strong>R/.</strong> Amén.</p>' :
      d.useBenoedicamus ?
      '<p class="rubric">✠ Hoy se dice <strong>Benedicámus Dómino</strong> (Bendigamos al Señor) en lugar de <em>Ite Missa Est</em>.</p>' :
      ''}
    </div>

    <!-- ÚLTIMO EVANGELIO -->
    <div class="mass-section">
      ${(d.key === 'goodFriday' || d.key === 'holySaturday' || d.key === 'palmSunday' || d.key === 'easter' || d.key === 'easter2' || (d.key && d.key.startsWith('easterFeria1_'))) ?
      '<p class="rubric">✠ El Último Evangelio se <strong>omite</strong> hoy.</p>' :
      `<h3 class="section-title">✠ ÚLTIMO EVANGELIO</h3><div class="liturgical-text-block">${Canon.LAST_GOSPEL}</div>`}
    </div>

    <!-- ORACIONES LEONINAS -->
    <div class="mass-section">
      <h3 class="section-title">✠ ORACIONES DESPUÉS DE LA MISA</h3>
      <div class="liturgical-text-block">${withJesusBow(
        (d.season === 'easter' || d.season === 'pentecost')
          ? Canon.LEONINE_PASCHALTIDE
          : Canon.LEONINE
      )}</div>
    </div>

    <!-- PIE -->
    <div class="liturgy-footer">
      <p>✠ Laus Deo Semper ✠</p>
      <p class="footer-note">Generado según el Misal Anglicano · Ciclo dominical ${d.cycle}</p>
    </div>

  </div>`;
}

// ══════════════════════════════════════════════════════════════════════════
//  CONTROLADOR UI
// ══════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const iso = today.toISOString().split('T')[0];
  document.getElementById('date-picker').value = iso;

  document.getElementById('date-picker').addEventListener('change', updateDayInfo);
  updateDayInfo();

  document.getElementById('generate-btn').addEventListener('click', handleGenerate);
});

function updateDayInfo() {
  const val = document.getElementById('date-picker').value;
  if (!val) return;
  const date = new Date(val + 'T12:00:00');
  const dayInfo = LiturgicalCalendar.getDay(date);

  const infoEl = document.getElementById('liturgy-info');
  infoEl.classList.remove('hidden');
  document.getElementById('feast-name').textContent = dayInfo.nameEs || dayInfo.name;
  const colorName = getColorName(dayInfo.color);
  document.getElementById('season-info').textContent = `Color: ${colorName} · Rango: ${getRankName(dayInfo.rank)}`;
  document.getElementById('cycle-info').textContent = `Ciclo dominical: ${dayInfo.cycle}`;
}

async function handleGenerate() {
  const val = document.getElementById('date-picker').value;
  if (!val) { alert('Por favor selecciona una fecha.'); return; }
  const date = new Date(val + 'T12:00:00');

  const canonTypeEl = document.getElementById('canon-select');
  const canonType = canonTypeEl ? canonTypeEl.value : 'roman';

  const votiveSelectEl = document.getElementById('votive-select');
  const votiveType = votiveSelectEl ? votiveSelectEl.value : 'none';

  const langEl = document.getElementById('lang-select');
  const lang = langEl ? langEl.value : 'es';

  const loading = document.getElementById('loading');
  const output = document.getElementById('liturgy-output');
  loading.classList.remove('hidden');
  output.classList.add('hidden');
  output.innerHTML = '';

  currentMassState = null; // se reasigna dentro de generateLiturgy() solo si tiene éxito

  // Deshabilitado mientras genera: Canon.setLanguage() usa estado compartido del
  // módulo (currentLang/currentDayKey), así que un doble clic durante la espera
  // podría mezclar el idioma/día de dos generaciones distintas.
  const generateBtn = document.getElementById('generate-btn');
  if (generateBtn) generateBtn.disabled = true;

  try {
    const html = await generateLiturgy(date, canonType, votiveType, lang);
    output.innerHTML = html;
    output.classList.remove('hidden');
    output.scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    console.error('Error generando liturgia:', e);
    output.innerHTML = `<div class="liturgy-document" style="padding:2rem"><p class="error">Error al generar la liturgia: ${e.message}</p><pre style="font-size:0.8rem;color:#666">${e.stack || ''}</pre></div>`;
    output.classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
    if (generateBtn) generateBtn.disabled = false;
  }
}

function openLibritoPueblo() {
  if (!currentMassState) {
    alert('Por favor, genera la liturgia primero pulsando "✠ GENERAR LITURGIA COMPLETA".');
    return;
  }
  const s = currentMassState;
  LibritoPueblo.show(s.date, s.dayInfo, s.readings, s.cycle, s.firstReading, s.secondReading, s.gospel,
    s.psalmVerses, s.psalmAnt, s.collect, s.introit, s.offertory, s.communion,
    s.omitGloria, s.omitCreed, s.omitAlleluia, s.canonType, s.intercessions, s.lang, {
      secret: s.secret, preface: s.preface, postcommunion: s.postcommunion,
      omitJudica: s.omitJudica, season: s.season, commemorations: s.commemorations,
      hancIgitur: s.hancIgitur, useBenoedicamus: s.useBenoedicamus, votiveType: s.votiveType,
      omissions: s.omissions, borrowedFromSunday: s.borrowedFromSunday,
    });
}

window.toggleDarkMode = function () {
  document.body.classList.toggle('dark-mode');
  const btn = document.getElementById('dark-mode-btn');
  if (document.body.classList.contains('dark-mode')) {
    btn.innerHTML = '☀️ Modo Claro';
  } else {
    btn.innerHTML = '🌙 Modo Altar';
  }
};
