/**
 * holyweek.js — Pinta las liturgias de la Semana Santa (BCP 2019, Texto Estándar) a partir de holyweek-data.js.
 *
 * Los textos NO se escriben aquí: vienen del libro oficial en español, cortados por bcp2019-tools/build-holyweek.js.
 * Este archivo solo sabe presentarlos: en la liturgia principal (mismo marcado que eucharist.js, para que la
 * exportación a Word los reconozca) y en el Librito del pueblo.
 *
 * Secciones (ver holyweek-data.js): palmSundayPalms, maundyThursdayOpening, maundyThursdayFootWashing,
 * maundyThursdayClosing, goodFriday, holySaturday. El marcador LECTURAS lo sustituye el app con las lecturas del día.
 */
const BCPHolyWeek = (() => {
  const DATA = BCP_HOLYWEEK_DATA;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ETIQUETA = { CEL: ['Cel.', 'sacerdote'], OFIC: ['Ofic.', 'sacerdote'], OBISPO: ['Obispo', 'sacerdote'], PRES: ['Pres.', 'sacerdote'], DIAC: ['Diác.', 'sacerdote'],
    LECTOR: ['Lector', 'lector'], PUEBLO: ['Pueblo', 'pueblo'], TODOS: ['Todos', 'todos'] };

  // Liturgia principal: devuelve el HTML de la sección. `lecturas` es el HTML con las lecturas que sustituye a LECTURAS.
  // `leer(ref, citaDelLibro, tipo)` devuelve el HTML del texto bíblico de una lección de la Vigilia (tipo 'LECCION' o
  // 'EVANGELIO'); sin él, esas citas no se pintan.
  function render(nombre, lecturas = '', leer = null) {
    const items = DATA[nombre];
    if (!items) return '';
    let html = '', bloque = '';
    const cierra = () => { if (bloque) { html += `<div class="liturgical-text-block holyweek-rite">${bloque}</div>`; bloque = ''; } };
    for (const it of items) {
      if (it.t === 'LECTURAS') { cierra(); html += lecturas; continue; }
      if (it.t === 'LECCION' || it.t === 'EVANGELIO') { cierra(); html += leer ? leer(it.ref, it.x, it.t) : ''; continue; }
      const x = esc(it.x);
      if (it.t === 'T') bloque += `<span class="lit-title">${x}</span>`;
      else if (it.t === 'R') bloque += `<span class="lit-rubric">(${x})</span>`;
      else if (it.t === 'REF') bloque += `<span class="lit-rubric">${x}</span>`;
      else if (it.t === 'P') bloque += `<span class="lit-prayer">${x}</span>`;
      else if (it.t === 'V') bloque += `<span class="lit-prayer">${x.replace(/\n/g, '<br>')}</span>`;
      else if (ETIQUETA[it.t]) bloque += `<span class="lit-line ${ETIQUETA[it.t][1]}"><span class="lit-label">${ETIQUETA[it.t][0]}</span><span class="lit-text">${x}</span></span>`;
    }
    cierra();
    return html;
  }

  // Librito del pueblo: las rúbricas como instrucciones, las partes del pueblo en negrita, las oraciones íntegras.
  function renderLibrito(nombre, lecturas = '', leer = null) {
    const items = DATA[nombre];
    if (!items) return '';
    let html = '';
    for (const it of items) {
      if (it.t === 'LECTURAS') { html += lecturas; continue; }
      if (it.t === 'LECCION' || it.t === 'EVANGELIO') { html += leer ? leer(it.ref, it.x, it.t) : ''; continue; }
      const x = esc(it.x);
      if (it.t === 'T') html += `<h3>${x}</h3>`;
      else if (it.t === 'R') html += `<div class="librito-instruction"><p>${x}</p></div>`;
      else if (it.t === 'REF') html += `<div class="librito-instruction"><p>${x}</p></div>`;
      else if (it.t === 'P') html += `<div class="librito-text"><p>${x}</p></div>`;
      else if (it.t === 'V') html += `<div class="librito-text"><p>${x.replace(/\n/g, '<br>')}</p></div>`;
      else if (it.t === 'PUEBLO' || it.t === 'TODOS') html += `<div class="librito-response"><p><strong>${ETIQUETA[it.t][0]}: ${x}</strong></p></div>`;
      else if (ETIQUETA[it.t]) html += `<div class="librito-response"><p>${ETIQUETA[it.t][0]}: ${x}</p></div>`;
    }
    return html;
  }

  // Citas bíblicas de la Gran Vigilia (las doce lecciones, la Epístola y el Evangelio), en el orden del libro.
  const VIGIL_REFS = [];
  for (const sec of ['easterVigilReadings', 'easterVigilWord']) for (const it of DATA[sec] || []) if ((it.t === 'LECCION' || it.t === 'EVANGELIO') && !VIGIL_REFS.includes(it.ref)) VIGIL_REFS.push(it.ref);

  return { render, renderLibrito, VIGIL_REFS, SECCIONES: Object.keys(DATA) };
})();
