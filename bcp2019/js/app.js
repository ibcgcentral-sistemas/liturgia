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
    const result = window.BibliaJerusalen.getPassage(ref);
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
  if (dayInfo.key && dayInfo.key.startsWith('holyWeekFeria')) return { key: null, borrowedFromSunday: false };
  const prevInfo = BCPCalendar.getDay(getPreviousSunday(date));
  if (BCPLectionary.SUNDAY[prevInfo.key]) return { key: prevInfo.key, borrowedFromSunday: true, cycle: prevInfo.cycle };
  return { key: null, borrowedFromSunday: false };
}

// La Colecta del Día toma prestada la del Domingo/fiesta precedente cuando la
// feria no tiene una propia — a diferencia de resolveLectionaryKey(), esto NO
// excluye la Semana Santa: repetir la Colecta de Ramos el Lunes/Martes/
// Miércoles Santo es correcto (a diferencia de repetir la Pasión completa).
// Sin esto, BCPPropers.getCollect() caía siempre a "Proper 11" en cualquier
// feria de cualquier época del año — Adviento, Cuaresma, Navidad, Pascua...
function resolveCollectKey(dayInfo, date) {
  if (BCPPropers.COLLECTS[dayInfo.key]) return dayInfo.key;
  const prevInfo = BCPCalendar.getDay(getPreviousSunday(date));
  if (BCPPropers.COLLECTS[prevInfo.key]) return prevInfo.key;
  return dayInfo.key;
}

// ══════════════════════════════════════════════════════════════════════════
//  GENERACIÓN DE LA LITURGIA
// ══════════════════════════════════════════════════════════════════════════
async function generateLiturgy(date) {
  const dayInfo = BCPCalendar.getDay(date);
  const { key: lKey, borrowedFromSunday, cycle: borrowedCycle } = resolveLectionaryKey(dayInfo, date);
  const readings = lKey ? BCPLectionary.getSundayReadings(lKey, borrowedCycle || dayInfo.cycle) : null;

  const collect = BCPPropers.getCollect(resolveCollectKey(dayInfo, date));
  const preface = BCPPropers.getPreface(dayInfo.key, dayInfo.season);

  let firstReading = null, psalmVerses = [], secondReading = null, gospel = null, psalmAnt = '';
  if (readings) {
    try {
      [firstReading, secondReading, gospel] = await Promise.all([
        fetchScripture(readings.first),
        readings.second ? fetchScripture(readings.second) : Promise.resolve(null),
        fetchScripture(readings.gospel),
      ]);
      psalmVerses = (window.BibliaJerusalen && readings.psalm) ? window.BibliaJerusalen.getVerses(readings.psalm) : [];
    } catch (e) {
      firstReading = { text: '<em class="rubric">[Error cargando lectura]</em>', reference: '' };
      gospel = { text: '<em class="rubric">[Error cargando evangelio]</em>', reference: '' };
    }
    psalmAnt = readings.psalmAnt || '';
  }

  currentMassState = {
    date, dayInfo, readings, firstReading, secondReading, gospel, psalmVerses, psalmAnt,
    collect, preface, borrowedFromSunday,
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
  const isLent = d.dayInfo.season === 'lent';
  const isEaster = d.dayInfo.season === 'easter' || d.dayInfo.key === 'pentecost';

  const fmtReading = (ref, data, type) => {
    if (!data) return '';
    let header = '';
    if (type === 'first') header = `<h3 class="section-title">✠ PRIMERA LECTURA</h3><p class="rubric">Lectura de <em>${ref}</em></p>`;
    if (type === 'second') header = `<h3 class="section-title">✠ SEGUNDA LECTURA</h3><p class="rubric">Lectura de <em>${ref}</em></p>`;
    if (type === 'gospel') header = `<h3 class="section-title gospel-title">✠ SANTO EVANGELIO</h3><p class="rubric">Lectura del Santo Evangelio según ${getGospelAuthor(ref)}</p>`;
    return `
      <div class="reading ${type}-reading">
        ${header}
        ${type === 'gospel' ? '<p class="response"><strong>Pueblo: Gloria a ti, Cristo Señor.</strong></p>' : ''}
        <div class="scripture-text">${data.text}</div>
        ${type === 'gospel'
          ? '<p class="response">El Evangelio del Señor. <strong>Pueblo: Te alabamos, Cristo Señor.</strong></p>'
          : '<p class="response">Palabra del Señor. <strong>Pueblo: Demos gracias a Dios.</strong></p>'}
      </div>`;
  };

  const fmtPsalm = (ref, verses, ant) => {
    if (!verses || verses.length === 0) return '';
    const antLine = ant ? `<span class="lit-line pueblo"><span class="lit-label">Pueblo</span><span class="lit-text"><strong>${ant}</strong></span></span>` : '';
    const strophes = [];
    for (let i = 0; i < verses.length; i += 2) strophes.push(verses.slice(i, i + 2));
    let html = `<div class="reading psalm-reading">
      <h3 class="section-title">✠ SALMO RESPONSORIAL</h3>
      <p class="rubric">${ref}</p>
      <div class="liturgical-text-block">${antLine}`;
    strophes.forEach(strophe => {
      const text = strophe.map(v => `<sup class="verse-num">${v.v}</sup> ${v.content}`).join('<br>');
      html += `<span class="lit-line lector"><span class="lit-label">Lector</span><span class="lit-text">${text}</span></span>`;
      if (antLine) html += antLine;
    });
    html += `</div></div>`;
    return html;
  };

  return `
  <div class="liturgy-document">

    <div class="cover-page">
      <div class="cover-cross">✠</div>
      <h2 class="cover-title">LIBRO DE ORACIÓN<br>COMÚN · 2019</h2>
      <p class="cover-subtitle">Santa Eucaristía — Texto Estándar Anglicano</p>
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
    </div>

    <!-- ═══════════════ RITOS INICIALES ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ RITOS INICIALES</h3>
      <h4 class="section-title">LA ACLAMACIÓN</h4>
      <div class="liturgical-text-block">${isLent ? BCPEucharist.ACCLAMATION_LENT : isEaster ? BCPEucharist.ACCLAMATION_EASTER : BCPEucharist.ACCLAMATION}</div>

      <h4 class="section-title">LA COLECTA POR PUREZA</h4>
      <div class="liturgical-text-block">${BCPEucharist.COLLECT_FOR_PURITY}</div>

      <h4 class="section-title">RESUMEN DE LA LEY</h4>
      <div class="liturgical-text-block">${BCPEucharist.SUMMARY_OF_LAW}</div>

      <h4 class="section-title">KYRIE</h4>
      <div class="liturgical-text-block">${BCPEucharist.KYRIE}</div>

      <h4 class="section-title">GLORIA IN EXCELSIS</h4>
      <div class="liturgical-text-block">${BCPEucharist.GLORIA}</div>
    </div>

    <!-- COLECTA DEL DÍA -->
    <div class="mass-section">
      <h3 class="section-title">✠ LA COLECTA DEL DÍA</h3>
      <div class="liturgical-text-block">${BCPEucharist.SALUTATION}</div>
      <div class="prayer-text collect-text">${d.collect}</div>
    </div>

    <!-- ═══════════════ LITURGIA DE LA PALABRA ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ LITURGIA DE LA PALABRA</h3>

      ${d.borrowedFromSunday ? '<p class="rubric">✠ Esta feria no tiene lecturas propias asignadas: se repiten las del Domingo o fiesta precedente.</p>' : ''}

      ${d.firstReading && d.readings ? fmtReading(translateBibleReference(d.readings.first), d.firstReading, 'first') : '<p class="rubric">[Primera lectura no especificada para este día]</p>'}
      ${d.psalmVerses && d.psalmVerses.length && d.readings ? fmtPsalm(translateBibleReference(d.readings.psalm), d.psalmVerses, d.psalmAnt) : ''}
      ${d.secondReading && d.readings && d.readings.second ? fmtReading(translateBibleReference(d.readings.second), d.secondReading, 'second') : ''}
      ${d.gospel && d.readings ? fmtReading(translateBibleReference(d.readings.gospel), d.gospel, 'gospel') : '<p class="rubric">[Evangelio no especificado para este día]</p>'}
    </div>

    <div class="mass-section">
      <p class="rubric">✠ EL SERMÓN — El Celebrante predica. Sigue un momento de silencio.</p>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ EL CREDO NICENO</h3>
      <div class="liturgical-text-block">${BCPEucharist.CREED}</div>
    </div>

    <div class="mass-section intercessions">
      <h3 class="section-title main-section">✠ ORACIÓN DE LOS FIELES</h3>
      <div class="liturgical-text-block">${BCPEucharist.PRAYERS_OF_THE_PEOPLE}</div>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ CONFESIÓN Y ABSOLUCIÓN DE LOS PECADOS</h3>
      <div class="liturgical-text-block">${BCPEucharist.CONFESSION}</div>
      <h4 class="section-title">PALABRAS RECONFORTANTES</h4>
      <div class="liturgical-text-block">${BCPEucharist.COMFORTABLE_WORDS}</div>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ LA PAZ</h3>
      <div class="liturgical-text-block">${BCPEucharist.PEACE}</div>
    </div>

    <!-- ═══════════════ LITURGIA EUCARÍSTICA ═══════════════ -->
    <div class="mass-section">
      <h3 class="section-title main-section">✠ LITURGIA EUCARÍSTICA — EL OFERTORIO</h3>
      <div class="liturgical-text-block">${BCPEucharist.OFFERTORY_SENTENCE}</div>
    </div>

    <div class="mass-section">
      <h3 class="section-title">✠ PREFACIO: ${d.preface ? d.preface.title.toUpperCase() : 'PREFACIO COMÚN'}</h3>
      <div class="liturgical-text-block">${BCPEucharist.SURSUM_CORDA}</div>
      <div class="prayer-text">${d.preface ? d.preface.text : ''}</div>
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
      <div class="liturgical-text-block">${isLent ? BCPEucharist.FRACTION_LENT : BCPEucharist.FRACTION}</div>
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

    <div class="mass-section">
      <h3 class="section-title main-section">✠ LA BENDICIÓN Y LA DESPEDIDA</h3>
      <div class="liturgical-text-block">${BCPEucharist.BLESSING}</div>
      <div class="liturgical-text-block">${isEaster ? BCPEucharist.DISMISSAL_ALLELUIA : BCPEucharist.DISMISSAL}</div>
    </div>

    <div class="liturgy-footer">
      <p>✠ Soli Deo Gloria ✠</p>
      <p class="footer-note">Libro de Oración Común (2019) · Texto Estándar Anglicano · Ciclo ${d.dayInfo.cycle}</p>
    </div>

  </div>`;
}

// ══════════════════════════════════════════════════════════════════════════
//  CONTROLADOR UI
// ══════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  document.getElementById('date-picker').value = today.toISOString().split('T')[0];
  document.getElementById('date-picker').addEventListener('change', updateDayInfo);
  updateDayInfo();
  document.getElementById('generate-btn').addEventListener('click', handleGenerate);
});

function updateDayInfo() {
  const val = document.getElementById('date-picker').value;
  if (!val) return;
  const date = new Date(val + 'T12:00:00');
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

  const loading = document.getElementById('loading');
  const output = document.getElementById('liturgy-output');
  loading.classList.remove('hidden');
  output.classList.add('hidden');
  output.innerHTML = '';

  currentMassState = null; // se reasigna dentro de generateLiturgy() solo si tiene éxito

  const generateBtn = document.getElementById('generate-btn');
  if (generateBtn) generateBtn.disabled = true;

  try {
    const html = await generateLiturgy(date);
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
