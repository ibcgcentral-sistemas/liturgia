/**
 * librito-pueblo.js — Librito de la Santa Eucaristía para el Pueblo
 * Libro de Oración Común (2019), ACNA — Texto Estándar Anglicano
 *
 * Reutiliza siempre el estado ya calculado por generateLiturgy() (guardado
 * en currentMassState por app.js) — nunca recalcula fecha, lecturas ni
 * colecta por su cuenta, para garantizar que corresponda exactamente a lo
 * que está en pantalla. Mismo principio que js/librito-pueblo.js del Misal.
 *
 * A diferencia del Librito del Misal Anglicano, el Texto Estándar Anglicano
 * no tiene partes "secretas" del Celebrante que deban omitirse — todo el
 * Ordinario, incluida la Oración de Consagración, se dice en voz alta y es
 * audible para el pueblo. Este Librito añade rúbricas de postura dirigidas
 * al fiel en vez de instrucciones técnicas dirigidas al Celebrante.
 *
 * CRITERIO DE COMPLETITUD: nada se resume con "…". Todo lo que se dice en voz
 * alta —lo que el pueblo reza o sigue con el oído— va ÍNTEGRO, tomado de
 * BCPEucharist.PLAIN (los mismos arreglos de texto que imprime la liturgia
 * principal): Ofertorio, Oración de Consagración, Humilde Acceso, fórmulas e
 * invitación de la Comunión y Poscomunión (esta es oración "de Todos"). El
 * Texto Estándar Anglicano no tiene oraciones secretas del sacerdote, así que
 * a diferencia del Misal (SECRET_NOTE_ES) no hay nada que resumir con una
 * rúbrica. Solo se omiten las rúbricas dirigidas al Celebrante, que el
 * Librito reemplaza por indicaciones de postura para el fiel.
 */

const BCPLibrito = (() => {

  // Texto plano de una pieza de BCPEucharist.PLAIN, filtrado por tipo.
  const plainItems = (piece, ...types) => BCPEucharist.PLAIN[piece].filter(i => types.includes(i.type));
  const celLine = text => `<strong>Celebrante: ${text}</strong>`;
  const puebloLine =text => `<strong>Pueblo: ${text}</strong>`;

  // Oración de Consagración completa. Las palabras de la institución (tipo 'C')
  // van precedidas de la indicación de silencio reverente, y el resto sigue en
  // orden de fuente.
  function consecrationHtml() {
    let html = '', open = false, instructed = false;
    for (const it of plainItems('PRAYER_OF_CONSECRATION', 'O', 'C')) {
      if (it.type === 'C' && !instructed) {
        if (open) html += '</div>';
        html += `<div class="librito-instruction warning">
          <p><strong>Al pronunciar las palabras de la institución sobre el pan y el cáliz</strong>, guardamos un silencio reverente. Muchos fieles se inclinan en este momento en adoración.</p>
        </div>`;
        open = false;
        instructed = true;
      }
      if (!open) { html += '<div class="librito-text">'; open = true; }
      html += `<p>${it.text}</p>`;
    }
    return html + (open ? '</div>' : '');
  }

  function generateLibrito(state) {
    const { date, dayInfo, readings, firstReading, secondReading, gospel, psalmVerses, psalmAnt, collect, preface, borrowedFromSunday } = state;
    const dateStr = formatLiturgyDate(date);
    const colorName = getColorName(dayInfo.color);
    // Semana Santa (season 'holyWeek') cuenta como Cuaresma: aclamación
    // penitencial y Fracción sin Aleluya (igual que app.js).
    const isLent = dayInfo.season === 'lent' || dayInfo.season === 'holyWeek';
    const isEaster = dayInfo.season === 'easter' || dayInfo.key === 'pentecost';
    const omitGloria = shouldOmitGloria(dayInfo);

    const fmtReading = (ref, data, label) => {
      if (!data) return '';
      return `
        <div class="librito-reading">
          <p class="reading-ref">${label}</p>
          <p class="reading-ref-small">${ref}</p>
          <p class="reading-text">${data.text}</p>
        </div>`;
    };

    const fmtGospel = (ref, data) => {
      if (!data) return '';
      return `
        <div class="librito-gospel">
          <p class="gospel-ref">✠ SANTO EVANGELIO</p>
          ${getGospelAuthor(ref) ? `<p class="reading-ref-small">Según ${getGospelAuthor(ref)}</p>` : ''}
          <div class="librito-response"><p>Sacerdote: El Santo Evangelio de nuestro Señor Jesucristo.<br><strong>Pueblo: Gloria a ti, Cristo Señor.</strong></p></div>
          <p class="reading-text">${data.text}</p>
          <div class="librito-response"><p>Sacerdote: El Evangelio del Señor.<br><strong>Pueblo: Te alabamos, Cristo Señor.</strong></p></div>
        </div>`;
    };

    const fmtPsalm = (ref, verses, ant) => {
      if (!verses || !verses.length) return '';
      let html = `<div class="librito-psalm"><p class="rubric">${ref}</p>`;
      if (ant) html += `<p class="psalm-response">${ant}</p>`;
      verses.forEach(v => {
        html += `<div class="psalm-verse"><p><span class="verse-num">${v.v}</span>${v.content}</p></div>`;
      });
      if (ant) html += `<p class="psalm-response">${ant}</p>`;
      html += `</div>`;
      return html;
    };

    return `
    <div class="librito-document">

      <div class="cover-page">
        <div class="cover-cross">✠</div>
        <h2 class="cover-title">LIBRITO DE LA<br>SANTA EUCARISTÍA</h2>
        <p class="cover-subtitle">Partes del Pueblo Cristiano</p>
        <div class="cover-divider"></div>
        <h2 class="cover-feast">${dayInfo.nameEs || dayInfo.name}</h2>
        <p class="cover-date">${dateStr}</p>
      </div>

      <div class="librito-header">
        <div class="librito-cross">✠</div>
        <h2>LIBRITO DE LA SANTA EUCARISTÍA</h2>
        <p class="librito-subtitle">Libro de Oración Común (2019) · Texto Estándar Anglicano</p>
        <p class="librito-date">${dateStr}</p>
        <p class="librito-feast">${dayInfo.nameEs || dayInfo.name}</p>
        <p class="librito-meta">Color: <strong>${colorName}</strong> · Ciclo: <strong>${dayInfo.cycle}</strong></p>
      </div>

      <section class="librito-section">
        <h2>✠ ANTES DE COMENZAR</h2>
        <div class="librito-instruction">
          <p><strong>Nos preparamos en silencio.</strong> Cada uno reza para disponer el alma a recibir a Nuestro Señor Jesucristo.</p>
        </div>
      </section>

      <section class="librito-section">
        <h2>✠ RITOS INICIALES</h2>
        <div class="librito-instruction"><p><strong>Todos de pie.</strong></p></div>

        <h3>LA ACLAMACIÓN</h3>
        <div class="librito-response">
          ${isEaster ? `<p><strong>Celebrante: ¡Aleluya! ¡Cristo ha resucitado!</strong><br><strong>Pueblo: ¡Ciertamente el Señor ha resucitado! ¡Aleluya!</strong></p>`
          : isLent ? `<p><strong>Celebrante: Bendigamos al Señor que perdona todos nuestros pecados.</strong><br><strong>Pueblo: Su misericordia perdura para siempre.</strong></p>`
          : `<p><strong>Celebrante: Bendito sea Dios: Padre, Hijo y Espíritu Santo.</strong><br><strong>Pueblo: Y bendito sea su reino, ahora y por siempre. Amén.</strong></p>`}
        </div>

        <h3>KYRIE</h3>
        <div class="librito-response">
          <p><strong>Celebrante: Señor, ten piedad de nosotros.</strong><br><strong>Pueblo: Cristo, ten piedad de nosotros.</strong><br><strong>Celebrante: Señor, ten piedad de nosotros.</strong></p>
        </div>

        <h3>GLORIA IN EXCELSIS</h3>
        ${omitGloria
          ? `<div class="librito-instruction"><p>${GLORIA_OMITTED_RUBRIC}</p></div>`
          : `<div class="librito-instruction"><p>Todos juntos:</p></div>
        <div class="librito-text">
          <p>Gloria a Dios en el cielo, y paz en la tierra a quienes ama el Señor. Por tu inmensa gloria te alabamos, te bendecimos, te adoramos, te glorificamos, te damos gracias; Señor Dios, Rey celestial, Dios Padre Todopoderoso. Señor, Hijo único Jesucristo, Señor Dios, Cordero de Dios, Hijo del Padre: Tú que quitas el pecado del mundo, ten piedad de nosotros; Tú que quitas el pecado del mundo, atiende a nuestra súplica; Tú que estás sentado a la derecha del Padre, ten piedad de nosotros. Porque solo tú eres Santo, sólo tú Señor, sólo tú Altísimo, Jesucristo, con el Espíritu Santo, en la gloria de Dios Padre. Amén.</p>
        </div>`}
      </section>

      <section class="librito-section">
        <h2>✠ LA COLECTA DEL DÍA</h2>
        <div class="librito-response"><p><strong>Celebrante: El Señor esté con ustedes.</strong><br><strong>Pueblo: Y con tu espíritu.</strong></p></div>
        <div class="librito-text"><p>${collect}</p></div>
      </section>

      <section class="librito-section">
        <h2>✠ LITURGIA DE LA PALABRA</h2>
        <div class="librito-instruction"><p><strong>Nos sentamos.</strong></p></div>
        ${borrowedFromSunday ? '<div class="librito-instruction"><p>Hoy se repiten las lecturas del Domingo o fiesta precedente.</p></div>' : ''}

        ${firstReading && readings ? fmtReading(translateBibleReference(readings.first), firstReading, 'PRIMERA LECTURA') : ''}
        ${psalmVerses && psalmVerses.length && readings ? fmtPsalm(translateBibleReference(readings.psalm), psalmVerses, psalmAnt) : ''}
        ${secondReading && readings && readings.second ? fmtReading(translateBibleReference(readings.second), secondReading, 'SEGUNDA LECTURA') : ''}

        <div class="librito-instruction"><p><strong>Nos ponemos de pie</strong> para el Evangelio.</p></div>
        ${gospel && readings ? fmtGospel(translateBibleReference(readings.gospel), gospel) : ''}

        <div class="librito-instruction"><p><strong>Nos sentamos</strong> para el Sermón.</p></div>

        <h3>EL CREDO NICENO</h3>
        <div class="librito-instruction"><p><strong>Nos ponemos de pie.</strong></p></div>
        <div class="librito-credo">
          <p>Creemos en un solo Dios, Padre todopoderoso, creador del cielo y de la tierra, de todo lo visible y lo invisible. Creemos en un solo Señor Jesucristo, Hijo único de Dios, nacido del Padre antes de todos los siglos: Dios de Dios, luz de luz, Dios verdadero de Dios verdadero, engendrado, no creado, de la misma naturaleza del Padre por quien todo fue hecho; que por nosotros y por nuestra salvación bajó del cielo:</p>
          <div class="credo-incline">
            <p>✠ INCLINACIÓN ✠</p>
            <p><em>y por obra del Espíritu Santo se encarnó de María la Virgen, y se hizo hombre.</em></p>
            <p>✠ ✠ ✠</p>
          </div>
          <p>Por nuestra causa fue crucificado en tiempos de Poncio Pilato: padeció y fue sepultado. Resucitó al tercer día, según las escrituras; subió al cielo, y está sentado a la derecha del Padre. De nuevo vendrá con gloria para juzgar a vivos y muertos, y su reino no tendrá fin. Creemos en el Espíritu Santo, Señor y dador de vida, que procede del Padre y del Hijo; que con el Padre y el Hijo recibe una misma adoración y gloria, y que habló por los profetas. Creemos en la Iglesia, que es una, santa, católica y apostólica. Confesamos que hay un solo Bautismo para el perdón de los pecados. Esperamos la resurrección de los muertos y la vida del mundo futuro. Amén.</p>
        </div>
      </section>

      <section class="librito-section">
        <h2>✠ ORACIÓN DE LOS FIELES</h2>
        <div class="librito-instruction"><p>Un Lector dirige las peticiones. Después de cada una:</p></div>
        <div class="librito-response"><p><strong>Lector: Señor, en tu misericordia:</strong><br><strong>Pueblo: Escucha nuestra oración.</strong></p></div>
      </section>

      <section class="librito-section">
        <h2>✠ CONFESIÓN Y ABSOLUCIÓN</h2>
        <div class="librito-instruction"><p><strong>Nos arrodillamos si podemos.</strong> Todos juntos:</p></div>
        <div class="librito-text">
          <p>Dios Todopoderoso, Padre de nuestro Señor Jesucristo, Creador y juez de todos nosotros: Confesamos y lamentamos nuestros muchos pecados y ofensas, que hemos cometido de pensamiento, palabra y obra contra tu divina majestad, provocando muy justamente tu razonable ira contra nosotros. Sentimos profundamente nuestras transgresiones; la carga de ellas es más de lo que podemos soportar. Ten misericordia de nosotros, ten misericordia de nosotros, Padre misericordioso; por amor de tu Hijo, nuestro Señor Jesucristo, perdónanos todo lo pasado; y concédenos que podamos servirte y agradarte cada vez más en una vida nueva, para el honor y la gloria de tu Nombre; por Jesucristo nuestro Señor. Amén.</p>
        </div>
        <div class="librito-instruction"><p>El Celebrante pronuncia la Absolución.</p></div>
      </section>

      <section class="librito-section">
        <h2>✠ LA PAZ</h2>
        <div class="librito-instruction"><p><strong>Nos ponemos de pie</strong> y nos saludamos en el Nombre del Señor.</p></div>
        <div class="librito-response"><p><strong>Celebrante: La paz del Señor esté siempre con ustedes.</strong><br><strong>Pueblo: Y con tu espíritu.</strong></p></div>
      </section>

      <section class="librito-section">
        <h2>✠ EL OFERTORIO</h2>
        <div class="librito-instruction"><p>Se presentan el pan, el vino y las ofrendas del pueblo.</p></div>
        <div class="librito-response"><p>${celLine(plainItems('OFFERTORY_SENTENCE', 'CEL')[0].text)}<br>${puebloLine(plainItems('OFFERTORY_SENTENCE', 'PUEBLO')[0].text)}</p></div>
      </section>

      <section class="librito-section">
        <h2>✠ PREFACIO: ${preface ? preface.title.toUpperCase() : 'PREFACIO COMÚN'}</h2>
        <div class="librito-response">
          <p><strong>Celebrante: Levantemos el corazón.</strong><br><strong>Pueblo: Lo tenemos levantado hacia el Señor.</strong><br>
          <strong>Celebrante: Demos gracias al Señor nuestro Dios.</strong><br><strong>Pueblo: Es justo darle gracias y alabanza.</strong></p>
        </div>
        <div class="librito-instruction"><p>El Celebrante continúa con el Prefacio propio del día, y todos cantan o recitan:</p></div>
      </section>

      <section class="librito-section">
        <h2>✠ SANCTUS</h2>
        <div class="librito-text">
          <p>Santo, Santo, Santo es el Señor, Dios del universo, llenos están el cielo y la tierra de tu gloria. Hosanna en el cielo. Bendito el que viene en el Nombre del Señor. Hosanna en el cielo.</p>
        </div>
        <div class="librito-instruction"><p><strong>Nos arrodillamos.</strong> Comienza la Oración de Consagración.</p></div>
      </section>

      <section class="librito-section warning">
        <h2>✠ LA ORACIÓN DE CONSAGRACIÓN</h2>
        <div class="librito-instruction warning">
          <p><strong>Nos arrodillamos en reverencia.</strong> A diferencia de otras tradiciones, en este rito la Plegaria se dice en voz alta y es compartida por toda la congregación — no hay partes secretas.</p>
        </div>
        ${consecrationHtml()}
      </section>

      <section class="librito-section">
        <h2>✠ EL PADRENUESTRO</h2>
        <div class="librito-text">
          <p>Padre Nuestro que estás en el cielo, santificado sea tu Nombre, venga tu reino, hágase tu voluntad, en la tierra como en el cielo. Danos hoy nuestro pan de cada día. Perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden. No nos dejes caer en tentación y líbranos del mal. Porque tuyo es el reino, tuyo es el poder, y tuya es la gloria, ahora y por siempre. Amén.</p>
        </div>

        <h3>LA FRACCIÓN</h3>
        <div class="librito-response">
          <p><strong>Celebrante: ${isLent ? 'Cristo, nuestra Pascua, es sacrificado por nosotros.' : '[Aleluya.] Cristo, nuestra Pascua, es sacrificado por nosotros.'}</strong><br><strong>Pueblo: Celebremos la fiesta.${isLent ? '' : ' [Aleluya.]'}</strong></p>
        </div>

        <h3>ORACIÓN DE HUMILDE ACCESO</h3>
        <div class="librito-instruction"><p>${plainItems('HUMBLE_ACCESS', 'R')[0].text}</p></div>
        <div class="librito-text">
          <p>${plainItems('HUMBLE_ACCESS', 'TODOS')[0].text}</p>
        </div>

        <h3>EL AGNUS DEI</h3>
        <div class="librito-text">
          <p>Cordero de Dios, que quitas el pecado del mundo; ten misericordia de nosotros. Cordero de Dios, que quitas el pecado del mundo; ten misericordia de nosotros. Cordero de Dios, que quitas el pecado del mundo; danos tu paz.</p>
        </div>
      </section>

      <section class="librito-section">
        <h2>✠ LA SAGRADA COMUNIÓN</h2>
        ${(() => {
          // Invitación y fórmulas de distribución, íntegras: son las palabras
          // que cada comulgante oye al recibir el Pan y el Cáliz.
          const [invitation, ...formulas] = plainItems('ADMINISTRATION', 'CEL').map(i => i.text);
          return `<div class="librito-response"><p>${celLine(invitation)}</p></div>
        <div class="librito-instruction"><p>Nos acercamos a recibir el Pan y el Cáliz.</p></div>
        <div class="librito-response">
          <p>${formulas.map(celLine).join('<br>')}</p>
        </div>`;
        })()}
        <div class="librito-instruction"><p><strong>Después de comulgar</strong>, volvemos a nuestro lugar y oramos en silencio.</p></div>
      </section>

      <section class="librito-section">
        <h2>✠ ORACIÓN DE POSCOMUNIÓN</h2>
        <div class="librito-instruction"><p><strong>Nos ponemos de pie.</strong></p></div>
        <div class="librito-response"><p>${celLine(plainItems('POST_COMMUNION', 'CEL')[0].text)}</p></div>
        <div class="librito-instruction"><p>Todos juntos:</p></div>
        <div class="librito-text">
          <p>${plainItems('POST_COMMUNION', 'TODOS')[0].text}</p>
        </div>
      </section>

      <section class="librito-section">
        <h2>✠ LA BENDICIÓN Y LA DESPEDIDA</h2>
        <div class="librito-instruction"><p>El Celebrante da la Bendición final.</p></div>
        <div class="librito-response">
          <p><strong>Celebrante: Salgamos en el Nombre de Cristo.${isEaster ? ' Aleluya, aleluya.' : ''}</strong><br><strong>Pueblo: Demos gracias a Dios.${isEaster ? ' Aleluya, aleluya.' : ''}</strong></p>
        </div>
      </section>

      <div class="librito-footer">
        <p>✠ Soli Deo Gloria ✠</p>
        <p>Librito de la Santa Eucaristía para el Pueblo Cristiano</p>
        <p><em>"Haced esto en memoria de mí."</em> — Lucas 22:19</p>
      </div>

    </div>
    `;
  }

  function show(state) {
    if (document.getElementById('librito-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'librito-overlay';
    overlay.className = 'librito-overlay';

    const html = generateLibrito(state);

    overlay.innerHTML = `
      <div class="librito-modal">
        <div class="librito-controls">
          <button class="librito-print-btn" onclick="window.print()">⬡ Imprimir Librito</button>
          <button id="librito-docx-btn" class="librito-docx-btn" onclick="BCPDocxExport.downloadLibritoDocx()">⬇ Descargar DOCX</button>
          <button class="librito-close-btn" onclick="BCPLibrito.hide()">✕ Cerrar</button>
        </div>
        ${html}
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    // @media print oculta la liturgia principal mientras hay un overlay abierto,
    // para que "Imprimir Librito" no imprima antes toda la liturgia.
    document.body.classList.add('overlay-open');

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hide();
    });
  }

  function hide() {
    const overlay = document.getElementById('librito-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
    document.body.classList.remove('overlay-open');
  }

  return { show, hide, generateLibrito };
})();
