/**
 * app.js — Controlador Principal
 * Libro de Oración Común (2019), ACNA — Santa Eucaristía (Texto Estándar Anglicano)
 * Ensambla la liturgia completa para una fecha dada.
 */

const MAX_READING_LENGTH = 25000;
const TRUNCATE_AT = 22000;

// Estado de la última liturgia generada con éxito — el Librito se
// construye a partir de esto, nunca recalculando desde los controles, para
// garantizar que siempre corresponda a lo que está en pantalla.
let currentMassState = null;

async function fetchScripture(ref) {
  if (!ref) return { text: '<em class="rubric">[Lectura no especificada]</em>', reference: '' };
  if (window.BibliaJerusalen) {
    // El leccionario cita con numeración inglesa; unos pocos pasajes (Is 9, Is 64,
    // Os 2, Jon 2, Mi 5, Mal 4, Gn 32, Ex 22) la Biblia de Jerusalén los numera
    // distinto: ver VERSE_SHIFTS en utils.js.
    const pieces = toBibliaPieces(ref);
    const result = pieces ? biblePassageFromPieces(ref, pieces) : window.BibliaJerusalen.getPassage(ref);
    // Versículos que el leccionario pide y esa Biblia no trae en el texto (Mt 21:44): ver VERSE_SUPPLEMENTS en utils.js.
    if (result.text) result.text = applyVerseSupplements(ref, result.text);
    if (result.text && result.text.length > MAX_READING_LENGTH) {
      return { text: result.text.substring(0, TRUNCATE_AT) + '... <em class="rubric">[Lectura truncada]</em>', reference: ref };
    }
    return result;
  }
  return { text: `<em class="rubric">[Biblia de Jerusalén no disponible — ${ref}]</em>`, reference: ref };
}

// Ferias sin lecturas propias: se toman prestadas las del Domingo/fiesta
// precedente — mismo criterio que el Misal Anglicano (js/app.js).
function getPreviousSunday(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function resolveLectionaryKey(dayInfo, date) {
  if (BCPLectionary.SUNDAY[dayInfo.key]) return { key: dayInfo.key, borrowedFromSunday: false };
  // Ferias con propios que el libro señala (calendar.js, `inherits`): van antes
  // del Domingo precedente, que en esos casos es de otro tiempo o el libro lo
  // excluye. Sin entrada en el leccionario (Propios 1 y 2) se cae al respaldo.
  if (dayInfo.inherits && BCPLectionary.SUNDAY[dayInfo.inherits]) return { key: dayInfo.inherits, borrowedFromSunday: true, cycle: dayInfo.cycle };
  if (dayInfo.key && dayInfo.key.startsWith('holyWeekFeria')) return { key: null, borrowedFromSunday: false };
  const prevInfo = BCPCalendar.getDay(getPreviousSunday(date));
  if (BCPLectionary.SUNDAY[prevInfo.key]) return { key: prevInfo.key, borrowedFromSunday: true, cycle: prevInfo.cycle };
  return { key: null, borrowedFromSunday: false };
}

// Las colectas, salvo las de Ceniza, Semana Santa y la Anunciación, son traducción del inglés hecha en este proyecto (ver
// propers.js, COLLECT_OFFICIAL). La nota bajo la colecta decía que faltaba la revisión litúrgica; el 2026-11-02 el usuario
// delegó en el revisor la autoridad litúrgica sobre cada colecta y la revisión se dio por hecha, así que se apagó (ver
// COLECTAS-REVISION.md). Ponerla en true la muestra de nuevo (la prueba de test-bcp2019.js no depende de esto).
const SHOW_COLLECT_TRANSLATION_NOTE = false;
const COLLECT_TRANSLATION_NOTE = 'Colecta traducida del inglés (BCP 2019).';

// La Colecta del Día toma prestada la del Domingo/fiesta precedente cuando la
// feria no tiene una propia — a diferencia de resolveLectionaryKey(), esto NO
// excluye la Semana Santa: repetir la Colecta de Ramos el Lunes/Martes/
// Miércoles Santo es correcto (a diferencia de repetir la Pasión completa).
// Sin esto, BCPPropers.getCollect() caía siempre a "Proper 11" en cualquier
// feria de cualquier época del año — Adviento, Cuaresma, Navidad, Pascua...
function resolveCollectKey(dayInfo, date) {
  if (BCPPropers.COLLECTS[dayInfo.key]) return dayInfo.key;
  if (dayInfo.inherits && BCPPropers.COLLECTS[dayInfo.inherits]) return dayInfo.inherits;
  const prevInfo = BCPCalendar.getDay(getPreviousSunday(date));
  if (BCPPropers.COLLECTS[prevInfo.key]) return prevInfo.key;
  return dayInfo.key;
}

// ══════════════════════════════════════════════════════════════════════════
//  GENERACIÓN DE LA LITURGIA
// ══════════════════════════════════════════════════════════════════════════
// `opts.form`: 'standard' (Texto Estándar, la primera forma del libro) o 'renewed' (Texto Antiguo Renovado, la segunda).
async function generateLiturgy(date, opts = {}) {
  const form = opts.form === 'renewed' ? 'renewed' : 'standard';
  const dayInfo = BCPCalendar.getDay(date);
  const { key: lKey, borrowedFromSunday, cycle: borrowedCycle } = resolveLectionaryKey(dayInfo, date);
  const readings = lKey ? BCPLectionary.getSundayReadings(lKey, borrowedCycle || dayInfo.cycle) : null;

  const collectKey = resolveCollectKey(dayInfo, date);
  const collect = BCPPropers.getCollect(collectKey);
  const preface = BCPPropers.getPreface(dayInfo.key, dayInfo.season);

  let firstReading = null, psalmVerses = [], secondReading = null, gospel = null, psalmAnt = '';
  if (readings) {
    try {
      [firstReading, secondReading, gospel] = await Promise.all([
        fetchScripture(readings.first),
        readings.second ? fetchScripture(readings.second) : Promise.resolve(null),
        fetchScripture(readings.gospel),
      ]);
      psalmVerses = (window.BibliaJerusalen && readings.psalm) ? cleanPsalmVerses(readings.psalm, window.BibliaJerusalen.getVerses(readings.psalm)) : [];
    } catch (e) {
      firstReading = { text: '<em class="rubric">[Error cargando lectura]</em>', reference: '' };
      gospel = { text: '<em class="rubric">[Error cargando evangelio]</em>', reference: '' };
    }
    psalmAnt = readings.psalmAnt || '';
  }

  // Sábado Santo: junto al rito del día se ofrece la Gran Vigilia Pascual, cuyas lecciones, Epístola y Evangelio salen
  // de la Biblia de Jerusalén. Se piden todas aquí (la liturgia se arma luego de forma síncrona) y van al estado para
  // que el Librito no vuelva a pedirlas.
  const vigilTexts = {};
  if (dayInfo.key === 'holySaturday') {
    await Promise.all(BCPHolyWeek.VIGIL_REFS.map(async ref => {
      try { vigilTexts[ref] = await fetchScripture(ref); } catch (e) { vigilTexts[ref] = { text: '<em class="rubric">[Error cargando lectura]</em>', reference: ref }; }
    }));
  }

  currentMassState = {
    date, dayInfo, readings, firstReading, secondReading, gospel, psalmVerses, psalmAnt,
    collect, collectKey, preface, borrowedFromSunday, vigilTexts, form,
  };

  return buildLiturgyHTML(currentMassState);
}

// ══════════════════════════════════════════════════════════════════════════
//  CONSTRUCTOR DE HTML
// ══════════════════════════════════════════════════════════════════════════
function buildLiturgyHTML(d) {
  const dateStr = formatLiturgyDate(d.date);
  const colorClass = `color-${d.dayInfo.color}`;
  const colorName = getColorName(d.dayInfo.color);
  const rankName = getRankName(d.dayInfo.rank);
  // Tres reglas distintas, no una sola variable: la Aclamación la decide acclamationKind (utils.js; la Semana
  // Santa tiene saludo propio y el Día de Pentecostés usa la ordinaria); la Fracción sin Aleluya rige en
  // Cuaresma Y Semana Santa (isLent); la Despedida con «aleluya, aleluya» llega hasta el Día de Pentecostés
  // inclusive (isEaster).
  const acclamation = acclamationKind(d.dayInfo);
  const isLent = d.dayInfo.season === 'lent' || d.dayInfo.season === 'holyWeek';
  const isEaster = d.dayInfo.season === 'easter' || d.dayInfo.key === 'pentecost';
  // Semana Santa (BCP 2019, Texto Estándar): el Domingo de Ramos y el Viernes Santo el Evangelio es la Pasión, que se
  // anuncia «La Pasión de Nuestro Señor Jesucristo según …» y «se omiten las respuestas habituales antes y después del
  // Evangelio». El Domingo de Ramos la Liturgia de las Palmas precede a la Eucaristía; el Jueves Santo lleva su
  // propia apertura, lavatorio y cierre sin bendición ni despedida (holyweek.js, texto del libro en español).
  const key = d.dayInfo.key;
  const isPalm = key === 'palmSunday', isMaundy = key === 'maundyThursday', isPassion = isPalm || key === 'goodFriday';
  // Miércoles de Ceniza: su rito propio (invitación a la Cuaresma, imposición de la ceniza con el Salmo 51, confesión y
  // letanía, absolución, palabras confortantes y paz) sustituye a los Ritos Iniciales, la colecta aparte, el Credo, las
  // Oraciones del Pueblo y la confesión habitual (holyweek.js, texto del libro en español).
  const isAsh = key === 'ashWednesday';
  // Segunda forma del libro, el Texto Antiguo Renovado: comparte con el Estándar el comienzo (Aclamación, Colecta por
  // pureza, Resumen de la Ley, Kyrie, Gloria, Colecta del Día) y la Liturgia de la Palabra; desde el Credo es texto propio
  // (holyweek.js, secciones `renewed*`, cortadas del libro en español). Los ritos propios de la Semana Santa y de Ceniza
  // siguen siendo los mismos, y entre ellos se inserta esta forma.
  const renewed = d.form === 'renewed';
  const formName = renewed ? 'Texto Antiguo Renovado' : 'Texto Estándar Anglicano';
  // Una sección del Texto Antiguo Renovado, sin su título (el app pone el suyo); `prefacio` es lo que va donde el libro
  // dice «Inserta el Prefacio indicado».
  const rat = (nombre, prefacio = null) => BCPHolyWeek.render(nombre, '', null, prefacio, { sinTitulo: true });

  const fmtReading = (ref, data, type) => {
    if (!data) return '';
    let header = '';
    if (type === 'first') header = `<h3 class="section-title">✠ PRIMERA LECTURA</h3><p class="rubric">Lectura de <em>${ref}</em></p>`;
    if (type === 'second') header = `<h3 class="section-title">✠ SEGUNDA LECTURA</h3><p class="rubric">Lectura de <em>${ref}</em></p>`;
    // Lecciones de la Gran Vigilia: el rito del libro ya trae el título, el Evangelio y sus respuestas; aquí solo va el texto.
    if (type === 'vigil') return `<div class="reading vigil-reading"><p class="rubric">Lectura de <em>${ref}</em></p><div class="scripture-text">${data.text}</div></div>`;
    if (type === 'gospel' && isPassion) header = `<h3 class="section-title gospel-title">✠ LA PASIÓN</h3><p class="rubric">La Pasión de Nuestro Señor Jesucristo${getGospelAuthor(ref) ? ' según ' + getGospelAuthor(ref) : ''}</p>`;
    else if (type === 'gospel') header = `<h3 class="section-title gospel-title">✠ SANTO EVANGELIO</h3><p class="rubric">Lectura del Santo Evangelio${getGospelAuthor(ref) ? ' según ' + getGospelAuthor(ref) : ''}</p>`;
    return `
      <div class="reading ${type}-reading">
        ${header}
        ${type === 'gospel' && !isPassion ? '<p class="response"><strong>Pueblo: Gloria a ti, Cristo Señor.</strong></p>' : ''}
        <div class="scripture-text">${data.text}</div>
        ${type === 'gospel'
          ? (isPassion ? '' : '<p class="response">El Evangelio del Señor. <strong>Pueblo: Te alabamos, Cristo Señor.</strong></p>')
          : '<p class="response">Palabra del Señor. <strong>Pueblo: Demos gracias a Dios.</strong></p>'}
      </div>`;
  };

  const fmtPsalm = (ref, verses, ant) => {
    if (!verses || verses.length === 0) return '';
    // El salmo se reza ALTERNANDO por versículos (decisión del usuario, 2026-11-02): el Lector lee el primero que
    // se muestra, el Pueblo el siguiente, y así hasta el final, sin importar su número. El libro solo dice que
    // «un salmo, himno o antífona puede seguir a cada lectura»; la forma de rezarlo no está prescrita. Si el día
    // trae antífona, el Pueblo la dice al comienzo y al final, no tras cada estrofa, para no romper la alternancia.
    const antLine = ant ? `<span class="lit-line pueblo"><span class="lit-label">Pueblo</span><span class="lit-text"><strong>${ant}</strong></span></span>` : '';
    let html = `<div class="reading psalm-reading">
      <h3 class="section-title">✠ SALMO RESPONSORIAL</h3>
      <p class="rubric">${ref}</p>
      <p class="rubric">Se reza alternando los versículos: el Lector lee el primero y el Pueblo el siguiente.</p>
      <div class="liturgical-text-block">${antLine}`;
    verses.forEach((v, i) => {
      const role = i % 2 === 0 ? 'lector' : 'pueblo';
      html += `<span class="lit-line ${role}"><span class="lit-label">${role === 'lector' ? 'Lector' : 'Pueblo'}</span><span class="lit-text"><sup class="verse-num">${v.v}</sup> ${v.content}</span></span>`;
    });
    html += `${antLine}</div></div>`;
    return html;
  };

  const headHtml = `
    <div class="cover-page">
      <div class="cover-cross">✠</div>
      <h2 class="cover-title">LIBRO DE ORACIÓN<br>COMÚN · 2019</h2>
      <p class="cover-subtitle">Santa Eucaristía — ${formName}</p>
      <div class="cover-divider"></div>
      <h2 class="cover-feast">${d.dayInfo.nameEs || d.dayInfo.name}</h2>
      <p class="cover-date">${dateStr}</p>
    </div>

    <div class="feast-header ${colorClass}">
      <div class="color-band"></div>
      <div class="feast-info">
        <p class="feast-date">${dateStr}</p>
        <h2 class="feast-name-en">${d.dayInfo.nameEs || d.dayInfo.name}</h2>
        <p class="feast-meta">
          <span>Color litúrgico: <strong>${colorName}</strong></span>
          <span>Rango: <strong>${rankName}</strong></span>
          <span>Ciclo dominical: <strong>${d.dayInfo.cycle}</strong></span>
        </p>
      </div>
    </div>`;

  const footHtml = `
    <div class="liturgy-footer">
      <p>✠ Soli Deo Gloria ✠</p>
      <p class="footer-note">Libro de Oración Común (2019) · ${formName} · Ciclo ${d.dayInfo.cycle}</p>
    </div>`;

  // Final de la Eucaristía, de la Confesión a la Despedida: lo comparten la Eucaristía de cada día y la de la Gran Vigilia,
  // que cambia el prefacio (el de Pascua), la Fracción y la Despedida (con Aleluya) y añade su bendición opcional.
  // El Miércoles de Ceniza (ash) trae su propia confesión, absolución, palabras confortantes y paz (holyweek.js): aquí se
  // salta lo habitual y, antes de la bendición, va la oración de cierre del libro.
  const eucharistEndHtml = ({ preface = d.preface, vigil = false, ash = false } = {}) => {
    const pf = preface;
    const fraccionSinAleluya = vigil ? false : isLent, despedidaConAleluya = vigil ? true : isEaster;
    const bendicionVigilia = vigil ? BCPHolyWeek.render('easterVigilBlessing') : '';
    const cierreCeniza = ash ? BCPHolyWeek.render('ashWednesdayClosing') : '';
    if (renewed) {
      // Texto Antiguo Renovado: de la Confesión a la Despedida con el texto propio del libro. La Fracción es la misma
      // que en el Estándar (el libro la repite); el Miércoles de Ceniza salta la confesión y la paz, como arriba.
      const prefacioHtml = () => `<div class="prayer-text">${pf ? pf.text : ''}</div>`;
      return `
    ${ash ? '' : `<div class="mass-section">
      <h3 class="section-title">✠ CONFESIÓN Y ABSOLUCIÓN DE LOS PECADOS</h3>
      ${rat('renewedConfession')}
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ LA PAZ</h3>
      ${rat('renewedPeace')}
    </div>`}

    <!-- ═══════════════ LITURGIA EUCARÍSTICA ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ LITURGIA EUCARÍSTICA — EL OFERTORIO</h3>
      ${rat('renewedOffertory')}
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ PREFACIO: ${pf ? pf.title.toUpperCase() : 'PREFACIO COMÚN'}</h3>
      ${rat('renewedSursum', prefacioHtml)}
    </div>

    <div class="mass-section canon-section">
      <h3 class="section-title main-section">✠ LA ORACIÓN DE CONSAGRACIÓN</h3>
      ${rat('renewedConsecration')}
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ LA ORACIÓN DEL SEÑOR</h3>
      ${rat('renewedLordsPrayer')}
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ LA FRACCIÓN</h3>
      <div class="liturgical-text-block">${fraccionSinAleluya ? BCPEucharist.FRACTION_LENT : BCPEucharist.FRACTION}</div>
      <h4 class="section-title">ORACIÓN DE HUMILDE ACCESO</h4>
      ${rat('renewedHumbleAccess')}
      <h4 class="section-title">EL AGNUS DEI</h4>
      ${rat('renewedAgnusDei')}
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ LA ADMINISTRACIÓN DE LA COMUNIÓN</h3>
      ${rat('renewedAdministration')}
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ ORACIÓN DESPUÉS DE LA COMUNIÓN</h3>
      ${rat('renewedPostCommunion')}
    </div>

    ${isMaundy ? `<div class="mass-section">
      <h3 class="section-title main-section">✠ AL TERMINAR LA LITURGIA</h3>
      ${BCPHolyWeek.render('maundyThursdayClosing')}
    </div>` : `<div class="mass-section">
      <h3 class="section-title main-section">✠ LA BENDICIÓN Y LA DESPEDIDA</h3>
      ${cierreCeniza}
      ${rat('renewedBlessing')}
      ${bendicionVigilia}
      ${rat('renewedDismissal')}
      ${despedidaConAleluya ? BCPHolyWeek.render('renewedDismissalAlleluia') : ''}
    </div>`}
`;
    }
    return `
    ${ash ? '' : `<div class="mass-section">
      <h3 class="section-title">✠ CONFESIÓN Y ABSOLUCIÓN DE LOS PECADOS</h3>
      <div class="liturgical-text-block">${BCPEucharist.CONFESSION}</div>
      <h4 class="section-title">PALABRAS RECONFORTANTES</h4>
      <div class="liturgical-text-block">${BCPEucharist.COMFORTABLE_WORDS}</div>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ LA PAZ</h3>
      <div class="liturgical-text-block">${BCPEucharist.PEACE}</div>
    </div>`}

    <!-- ═══════════════ LITURGIA EUCARÍSTICA ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ LITURGIA EUCARÍSTICA — EL OFERTORIO</h3>
      <div class="liturgical-text-block">${BCPEucharist.OFFERTORY_SENTENCE}</div>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ PREFACIO: ${pf ? pf.title.toUpperCase() : 'PREFACIO COMÚN'}</h3>
      <div class="liturgical-text-block">${BCPEucharist.SURSUM_CORDA}</div>
      <div class="prayer-text">${pf ? pf.text : ''}</div>
      <div class="liturgical-text-block">${BCPEucharist.SURSUM_CORDA_CLOSE}</div>
      <h4 class="section-title">EL SANCTUS</h4>
      <div class="liturgical-text-block">${BCPEucharist.SANCTUS}</div>
    </div>

    <div class="mass-section canon-section">
      <h3 class="section-title main-section">✠ LA ORACIÓN DE CONSAGRACIÓN</h3>
      <div class="liturgical-text-block">${BCPEucharist.PRAYER_OF_CONSECRATION}</div>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ LA ORACIÓN DEL SEÑOR</h3>
      <div class="liturgical-text-block">${BCPEucharist.LORDS_PRAYER}</div>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ LA FRACCIÓN</h3>
      <div class="liturgical-text-block">${fraccionSinAleluya ? BCPEucharist.FRACTION_LENT : BCPEucharist.FRACTION}</div>
      <h4 class="section-title">ORACIÓN DE HUMILDE ACCESO</h4>
      <div class="liturgical-text-block">${BCPEucharist.HUMBLE_ACCESS}</div>
      <h4 class="section-title">EL AGNUS DEI</h4>
      <div class="liturgical-text-block">${BCPEucharist.AGNUS_DEI}</div>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ LA ADMINISTRACIÓN DE LA COMUNIÓN</h3>
      <div class="liturgical-text-block">${BCPEucharist.ADMINISTRATION}</div>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ ORACIÓN DESPUÉS DE LA COMUNIÓN</h3>
      <div class="liturgical-text-block">${BCPEucharist.POST_COMMUNION}</div>
    </div>

    ${isMaundy ? `<div class="mass-section">
      <h3 class="section-title main-section">✠ AL TERMINAR LA LITURGIA</h3>
      ${BCPHolyWeek.render('maundyThursdayClosing')}
    </div>` : `<div class="mass-section">
      <h3 class="section-title main-section">✠ LA BENDICIÓN Y LA DESPEDIDA</h3>
      ${cierreCeniza}
      <div class="liturgical-text-block">${BCPEucharist.BLESSING}</div>
      ${bendicionVigilia}
      <div class="liturgical-text-block">${despedidaConAleluya ? BCPEucharist.DISMISSAL_ALLELUIA : BCPEucharist.DISMISSAL}</div>
    </div>`}
`;
  };

  // El Credo y las Oraciones del Pueblo: en el Texto Antiguo Renovado el libro trae su propia redacción de ambos.
  const prayersHtml = `<div class="mass-section intercessions">
      <h3 class="section-title main-section">✠ ORACIÓN DE LOS FIELES</h3>
      ${renewed ? rat('renewedPrayers') : `<div class="liturgical-text-block">${BCPEucharist.PRAYERS_OF_THE_PEOPLE}</div>`}
    </div>`;
  const creedAndPrayersHtml = `<div class="mass-section">
      <h3 class="section-title">✠ EL CREDO NICENO</h3>
      ${renewed ? rat('renewedCreed') : `<div class="liturgical-text-block">${BCPEucharist.CREED}</div>`}
    </div>

    ${prayersHtml}`;

  // Las cuatro lecturas del día (primera, salmo, segunda, Evangelio). Las usa la Liturgia de la Palabra y, el Viernes y el
  // Sábado Santo, el rito propio, donde sustituyen al marcador LECTURAS de holyweek-data.js.
  const readingsHtml = `
      ${d.firstReading && d.readings ? fmtReading(translateBibleReference(d.readings.first), d.firstReading, 'first') : '<p class="rubric">[Primera lectura no especificada para este día]</p>'}
      ${d.psalmVerses && d.psalmVerses.length && d.readings ? fmtPsalm(translateBibleReference(d.readings.psalm), d.psalmVerses, d.psalmAnt) : ''}
      ${d.secondReading && d.readings && d.readings.second ? fmtReading(translateBibleReference(d.readings.second), d.secondReading, 'second') : ''}
      ${d.gospel && d.readings ? fmtReading(translateBibleReference(d.readings.gospel), d.gospel, 'gospel') : '<p class="rubric">[Evangelio no especificado para este día]</p>'}`;

  // Viernes y Sábado Santo: el libro no celebra la Eucaristía esos días; tienen su rito propio (holyweek.js, texto del
  // libro en español). El Sábado Santo añade la Gran Vigilia Pascual, que SÍ lleva Eucaristía (la primera de Pascua).
  const noEucharist = noEucharistNotice(d.dayInfo);
  if (noEucharist) {
    const leerVigilia = (ref, cita, tipo) => d.vigilTexts && d.vigilTexts[ref] ? fmtReading(translateBibleReference(ref), d.vigilTexts[ref], 'vigil') : '';
    const vigiliaHtml = key !== 'holySaturday' ? '' : `
    <div class="mass-section vigil-section">
      <h3 class="section-title main-section">✠ LA GRAN VIGILIA DE RESURRECCIÓN</h3>
      ${BCPHolyWeek.render('easterVigilIntro')}
    </div>
    <div class="mass-section vigil-section">
      <h3 class="section-title main-section">✠ EL SERVICIO DE LA LUZ</h3>
      ${BCPHolyWeek.render('easterVigilLight')}
    </div>
    <div class="mass-section vigil-section">
      <h3 class="section-title main-section">✠ EL SERVICIO DE LAS LECTURAS</h3>
      ${BCPHolyWeek.render('easterVigilReadings', '', leerVigilia)}
    </div>
    <div class="mass-section vigil-section">
      <h3 class="section-title main-section">✠ LA ACLAMACIÓN PASCUAL Y LA PALABRA</h3>
      ${BCPHolyWeek.render('easterVigilWord', '', leerVigilia)}
    </div>
    <!-- Sin candidatos para el Bautismo o la Confirmación, el libro manda la Renovación de los Votos Bautismales tras el
         Sermón; el Bautismo y la Confirmación solo constan como la rúbrica del libro. No se dice el Credo Niceno. -->
    <div class="mass-section vigil-section">
      <h3 class="section-title main-section">✠ RENOVACIÓN DE LOS VOTOS BAUTISMALES</h3>
      ${BCPHolyWeek.render('easterVigilRenewal')}
      ${BCPHolyWeek.render('easterVigilContinues')}
    </div>
    ${prayersHtml}
    ${eucharistEndHtml({ preface: BCPPropers.PREFACES.easter, vigil: true })}`;
    return `
  <div class="liturgy-document">
    ${headHtml}

    <div class="mass-section">
      <h3 class="section-title main-section">✠ ${d.dayInfo.nameEs || d.dayInfo.name}</h3>
      ${BCPHolyWeek.render(key, readingsHtml)}
    </div>
    ${vigiliaHtml}

    ${footHtml}
  </div>`;
  }

  return `
  <div class="liturgy-document">

    ${headHtml}

    ${isPalm ? `<!-- ═══════════════ LITURGIA DE LAS PALMAS ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ DOMINGO DE RAMOS</h3>
      ${BCPHolyWeek.render('palmSundayPalms')}
    </div>` : ''}

    <!-- ═══════════════ RITOS INICIALES ═══════════════ -->
    ${isPalm ? `<div class="mass-section">
      <h3 class="section-title main-section">✠ EN LA EUCARISTÍA</h3>
      <p class="rubric">Cuando la Liturgia de las Palmas precede inmediatamente a la Eucaristía, la celebración comienza con el Saludo y la Colecta del Día.</p>
    </div>` : isAsh ? `<div class="mass-section">
      <h3 class="section-title main-section">✠ MIÉRCOLES DE CENIZA</h3>
      ${BCPHolyWeek.render('ashWednesdayOpening')}
    </div>

    <div class="mass-section">
      <h3 class="section-title main-section">✠ INVITACIÓN A LA SANTA CUARESMA</h3>
      ${BCPHolyWeek.render('ashWednesdayInvitation')}
    </div>` : `<div class="mass-section">
      <h3 class="section-title main-section">✠ RITOS INICIALES</h3>
      <h4 class="section-title">LA ACLAMACIÓN</h4>
      <div class="liturgical-text-block">${isMaundy ? '' : acclamation === 'lent' ? BCPEucharist.ACCLAMATION_LENT : acclamation === 'holyWeek' ? BCPEucharist.ACCLAMATION_HOLYWEEK : acclamation === 'easter' ? BCPEucharist.ACCLAMATION_EASTER : acclamation === 'pentecost' ? BCPEucharist.ACCLAMATION_PENTECOST : BCPEucharist.ACCLAMATION}</div>
      ${isMaundy ? BCPHolyWeek.render('maundyThursdayOpening') : ''}

      <h4 class="section-title">LA COLECTA POR PUREZA</h4>
      <div class="liturgical-text-block">${BCPEucharist.COLLECT_FOR_PURITY}</div>

      <h4 class="section-title">RESUMEN DE LA LEY</h4>
      <div class="liturgical-text-block">${BCPEucharist.SUMMARY_OF_LAW}</div>

      <h4 class="section-title">KYRIE</h4>
      <div class="liturgical-text-block">${BCPEucharist.KYRIE}</div>

      <h4 class="section-title">GLORIA IN EXCELSIS</h4>
      ${shouldOmitGloria(d.dayInfo)
        ? `<p class="rubric">${gloriaOmittedRubric(d.dayInfo)}</p>`
        : `<div class="liturgical-text-block">${BCPEucharist.GLORIA}</div>`}
    </div>`}

    <!-- COLECTA DEL DÍA (el Miércoles de Ceniza va dentro de la Invitación a la santa Cuaresma, tras el silencio) -->
    ${isAsh ? '' : `<div class="mass-section">
      <h3 class="section-title">✠ LA COLECTA DEL DÍA</h3>
      <div class="liturgical-text-block">${BCPEucharist.SALUTATION}</div>
      <div class="prayer-text collect-text">${d.collect}</div>
      ${SHOW_COLLECT_TRANSLATION_NOTE && BCPPropers.isCollectTranslated(d.collectKey) ? `<p class="rubric">${COLLECT_TRANSLATION_NOTE}</p>` : ''}
    </div>`}

    <!-- ═══════════════ LITURGIA DE LA PALABRA ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ LITURGIA DE LA PALABRA</h3>

      ${d.borrowedFromSunday ? '<p class="rubric">✠ Esta feria no tiene lecturas propias asignadas: se repiten las del Domingo o fiesta correspondiente.</p>' : ''}

      ${readingsHtml}
    </div>

    <div class="mass-section">
      <p class="rubric">✠ EL SERMÓN — El Celebrante predica. Sigue un momento de silencio.</p>
    </div>

    ${isMaundy ? `<div class="mass-section">
      ${BCPHolyWeek.render('maundyThursdayFootWashing')}
    </div>` : ''}

    ${isPalm ? `<div class="mass-section">
      <p class="rubric">Siguiendo el Sermón, cuando ha precedido la Liturgia de las Palmas, el Credo de Nicea y las Oraciones del Pueblo pueden omitirse en la Eucaristía.</p>
    </div>` : isAsh ? `<div class="mass-section">
      <h3 class="section-title main-section">✠ SALMO PENITENCIAL E IMPOSICIÓN DE LA CENIZA</h3>
      ${BCPHolyWeek.render('ashWednesdayAshes')}
    </div>

    <div class="mass-section">
      <h3 class="section-title main-section">✠ CONFESIÓN Y LETANÍA DE PENITENCIA</h3>
      ${BCPHolyWeek.render('ashWednesdayConfession')}
    </div>

    <div class="mass-section">
      ${BCPHolyWeek.render('ashWednesdayAbsolution')}
    </div>` : creedAndPrayersHtml}

    ${eucharistEndHtml({ ash: isAsh })}

    ${footHtml}

  </div>`;
}

// ══════════════════════════════════════════════════════════════════════════
//  CONTROLADOR UI
// ══════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Fecha local (toISOString() usa UTC y por la tarde/noche en América da el
  // día siguiente).
  const today = new Date();
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('date-picker').value = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  document.getElementById('date-picker').addEventListener('change', updateDayInfo);
  updateDayInfo();
  document.getElementById('generate-btn').addEventListener('click', handleGenerate);
});

function updateDayInfo() {
  const val = document.getElementById('date-picker').value;
  if (!val) return;
  const date = new Date(val + 'T12:00:00');
  if (isNaN(date.getTime())) return;
  const dayInfo = BCPCalendar.getDay(date);
  const infoEl = document.getElementById('liturgy-info');
  infoEl.classList.remove('hidden');
  document.getElementById('feast-name').textContent = dayInfo.nameEs || dayInfo.name;
  document.getElementById('season-info').textContent = `Color: ${getColorName(dayInfo.color)} · Rango: ${getRankName(dayInfo.rank)}`;
  document.getElementById('cycle-info').textContent = `Ciclo dominical: ${dayInfo.cycle}`;
}

async function handleGenerate() {
  const val = document.getElementById('date-picker').value;
  if (!val) { alert('Por favor selecciona una fecha.'); return; }
  const date = new Date(val + 'T12:00:00');
  if (isNaN(date.getTime())) { alert('La fecha no es válida. Por favor selecciona una fecha.'); return; }

  const loading = document.getElementById('loading');
  const output = document.getElementById('liturgy-output');
  loading.classList.remove('hidden');
  output.classList.add('hidden');
  output.innerHTML = '';

  currentMassState = null; // se reasigna dentro de generateLiturgy() solo si tiene éxito

  const generateBtn = document.getElementById('generate-btn');
  if (generateBtn) generateBtn.disabled = true;

  try {
    const formSelect = document.getElementById('form-select');
    const html = await generateLiturgy(date, { form: formSelect ? formSelect.value : 'standard' });
    output.innerHTML = html;
    output.classList.remove('hidden');
    output.scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    console.error('Error generando liturgia:', e);
    output.innerHTML = `<div class="liturgy-document" style="padding:2rem"><p class="error">Error al generar la liturgia: ${escapeHtml(e.message)}</p><pre style="font-size:0.8rem;color:#666">${escapeHtml(e.stack || '')}</pre></div>`;
    output.classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
    if (generateBtn) generateBtn.disabled = false;
  }
}

function openLibrito() {
  if (!currentMassState) {
    alert('Por favor, genera la liturgia primero pulsando "✠ GENERAR LA SANTA EUCARISTÍA".');
    return;
  }
  BCPLibrito.show(currentMassState);
}

window.toggleDarkMode = function () {
  document.body.classList.toggle('dark-mode');
  const btn = document.getElementById('dark-mode-btn');
  if (document.body.classList.contains('dark-mode')) {
    btn.innerHTML = '☀️ Modo Claro';
  } else {
    btn.innerHTML = '🌙 Modo Noche';
  }
};
