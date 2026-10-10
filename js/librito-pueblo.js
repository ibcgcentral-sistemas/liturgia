/**
 * librito-pueblo.js — Librito de Misa para el Pueblo
 * Solo las partes que corresponden a los fieles
 * Respuestas, rúbricas de movimiento, Evangelio en español
 */

const LibritoPueblo = (() => {

  function generateLibrito(date, dayInfo, readings, cycle, firstReading, secondReading, gospel, psalmVerses, psalmAnt, collect, introit, offertory, communion, omitGloria, omitCreed, omitAlleluia, canonType = 'roman', intercessions = null, lang = 'es', extras = {}) {
    const dateStr = formatLiturgyDate(date);
    const colorName = getColorName(dayInfo.color);
    const { secret, preface, postcommunion, omitJudica, season, commemorations, hancIgitur, useBenoedicamus, votiveType, omissions, borrowedFromSunday, omittedFeasts, suppliedProperNotes, gradualText } = extras;
    const key = dayInfo.key || '';
    const rankName = getRankName(dayInfo.rank);
    // Viernes Santo: rito del Misal (holyweek.js), el mismo que imprime el Misal
    // (app.js): Colecta del Día, lecturas, Colectas Solemnes, antífonas ante la
    // cruz, comunión con el Sacramento reservado y oración final. Con una misa
    // votiva dayInfo.key es la del votivo y la liturgia sale completa.
    const presanctified = key === 'goodFriday';

    const omissionHTML = (omissions && omissions.length) ? `
      <div class="omission-notes">
        <h3>✠ NOTAS DE OMISIONES Y VARIACIONES:</h3>
        <ul>${omissions.map(o => `<li>${o.part.toUpperCase()}: ${o.reason || o.note || ''}</li>`).join('')}</ul>
      </div>` : '';

    // ── RÚBRICAS DE TRASLACIÓN ─────────────────────────────────────────────
    // Mismas señales que imprime el Misal (app.js) a partir de los campos
    // `translatedFeast`, `isTranslated` / `displacedDay` de calendar.js y de
    // `omittedFeasts` de commemorations.js. El Librito las callaba: el pueblo
    // veía una fiesta trasladada sin explicación alguna.
    const fmtDay = (v) => {
      if (!v) return '';
      const dt = (v instanceof Date) ? v : new Date(String(v) + 'T12:00:00');
      return isNaN(dt.getTime()) ? String(v) : formatLiturgyDate(dt);
    };
    const tf = dayInfo.translatedFeast;
    const translationHTML = [
      tf ? `<p class="rubric">✠ La fiesta de ${tf.nameEs || tf.name}, impedida hoy, ${
        (tf.to || tf.toISO)
          ? `se traslada al ${fmtDay(tf.to || tf.toISO)}`
          : 'se omite este año por no hallarse día libre'}.</p>` : '',
      dayInfo.isTranslated
        ? `<p class="rubric">✠ Fiesta trasladada${dayInfo.translatedFromISO ? ` desde el ${fmtDay(dayInfo.translatedFromISO)}` : ''}, por haber estado impedida en su fecha propia.${
          dayInfo.displacedDay && dayInfo.displacedDay.nameEs
            ? ` Hoy cede ante ella ${dayInfo.displacedDay.nameEs}.` : ''}</p>` : '',
      (omittedFeasts || []).filter(f => f.reason === 'privileged').map(f =>
        `<p class="rubric">✠ La fiesta de ${f.name} cede hoy ante el día privilegiado y no se conmemora.</p>`).join(''),
    ].join('');

    // ── TEXTOS SUPLIDOS DEL TIEMPO Y PIEZAS OMITIDAS ───────────────────────
    // Señal `supplied` / `omitted` que devuelve propers.js. Se marcan igual que
    // en el Misal para que ambos documentos digan lo mismo. Una pieza OMITIDA
    // (p. ej. el Ofertorio y la Secreta del Viernes Santo) lleva la nota que
    // explica por qué no hay texto, no el marcador «no disponible».
    // La rúbrica es la que redacta propers.js según el origen real del texto
    // (Común de la Virgen, de Difuntos, genérico, del tiempo…); si no la trae, se
    // cae a «(X del tiempo)». Igual que en el Misal (app.js).
    const suppliedParts = new Map((suppliedProperNotes || [])
      .filter(n => !n.omitted).map(n => [n.part, n.rubric || null]));
    const omittedNotes = new Map((suppliedProperNotes || [])
      .filter(n => n.omitted).map(n => [n.part, n.note]));
    const suppliedMark = (part) => suppliedParts.has(part)
      ? ` <em class="rubric">${suppliedParts.get(part) || `(${part} del tiempo)`}</em>` : '';
    const omittedText = (part) => omittedNotes.has(part)
      ? `<em class="rubric">${omittedNotes.get(part) || `[Hoy no se dice ${part}.]`}</em>` : null;

    // Sincroniza el Ordinario (Canon.js) con el idioma de la liturgia recién generada,
    // para que el Kyrie, Gloria, Credo, Sanctus, Padre Nuestro, etc. salgan en el
    // mismo formato bilingüe (Español|Latín) que el Misal principal.
    Canon.setLanguage(lang, dayInfo.key, date);

    const html = `
    <div class="librito-document">

      <!-- PORTADA DEL LIBRITO -->
      <div class="cover-page">
        <div class="cover-cross">✠</div>
        <h2 class="cover-title">LIBRITO DE MISA</h2>
        <p class="cover-subtitle">Partes del Pueblo Cristiano</p>
        <div class="cover-divider"></div>
        <h2 class="cover-feast">${dayInfo.nameEs || dayInfo.name}</h2>
        <p class="cover-date">${dateStr}</p>
        ${getRandomFatherQuote(readings?.gospel, gospel?.text, date)}
      </div>

      <div class="librito-header">
        <div class="librito-cross">✠</div>
        <h2>LIBRITO DE MISA</h2>
        <p class="librito-subtitle">Partes del Pueblo Cristiano</p>
        <p class="librito-date">${dateStr}</p>
        <p class="librito-feast">${dayInfo.nameEs || dayInfo.name}</p>
        <p class="librito-meta">
          Color: <strong>${colorName}</strong> · Rango: <strong>${rankName}</strong> · Ciclo: <strong>${cycle}</strong>
        </p>
      </div>

      ${translationHTML}

      ${omissionHTML}

      ${presanctified ? HolyWeek.goodFridayLibritoHTML({
        collect, readings, firstReading, psalmVerses, secondReading, gospel,
      }) : `<!-- RÚBRICA INICIAL -->
      <section class="librito-section">
        <h2>✠ ANTES DE COMENZAR</h2>
        <div class="librito-instruction">
          <p><strong>Se arrodillan en silencio.</strong> Cada uno reza para preparar el alma para recibir a Nuestro Señor Jesucristo. El Sacerdote comienza los Ritos Iniciales al pie del altar.</p>
        </div>
      </section>

      ${(date.getDay() === 0 && (votiveType || 'none') === 'none') ? (() => {
        // Mismo criterio que el Misal: la elección Vidi Aquam / Asperges Me
        // depende del TIEMPO litúrgico (campo `season` de calendar.js), no del
        // prefijo de la clave del día — una fiesta fija (clave «MM-DD») que
        // caiga en un domingo de Pascua daba Asperges Me en el Librito y Vidi
        // Aquam en el Misal.
        const isEasterSeason = (season === 'easter' || key === 'pentecost');
        return isEasterSeason ? `
      <section class="librito-section">
        <h2>✠ RITO DE ASPERSIÓN (VIDI AQUAM)</h2>
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> El Sacerdote asperja al pueblo con agua bendita mientras se canta:</p>
        </div>
        <div class="liturgical-text-block">${Canon.VIDI_AQUAM}</div>
      </section>
        ` : `
      <section class="librito-section">
        <h2>✠ RITO DE ASPERSIÓN (ASPERGES ME)</h2>
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> El Sacerdote asperja al pueblo con agua bendita mientras se canta:</p>
        </div>
        <div class="liturgical-text-block">${Canon.getAspergesMe(key)}</div>
      </section>
        `
      })() : ''}

      <!-- RITOS INICIALES -->
      <section class="librito-section">
        <h2>✠ RITOS INICIALES — PRECES AL PIE DEL ALTAR</h2>
        ${!omitJudica ? `
        <h3>SALMO 43 — JUDICA ME</h3>
        <div class="librito-instruction">
          <p><strong>Se arrodillan.</strong> El Sacerdote, al pie del altar, reza alternadamente con los ministros:</p>
        </div>
        <div class="liturgical-text-block">${Canon.JUDICA_ME_PUEBLO}</div>
        ` : `
        <div class="librito-instruction">
          <p><strong>Se arrodillan.</strong> El Salmo 43 (Judica me) se <strong>omite</strong> hoy.</p>
        </div>
        `}

        <h3>CONFITEOR</h3>
        <div class="librito-instruction">
          <p>El Sacerdote y los ministros rezan el Confiteor alternadamente.</p>
        </div>
        <div class="liturgical-text-block">${Canon.CONFITEOR_PUEBLO}</div>

        <h3>SUBIDA AL ALTAR</h3>
        <div class="librito-instruction">
          <p>El Sacerdote sube al altar y reza:</p>
        </div>
        <div class="liturgical-text-block">${Canon.ASCENT_PUEBLO}</div>

        <h3>INTROITO</h3>${suppliedMark('Introito')}
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> Se canta o recita el Introito del día.</p>
        </div>
        <div class="librito-prayer">
          <p>${introit ? introit.ant : (omittedText('Introito') || '[Introito no disponible]')}</p>
          ${introit && introit.psalm ? `<p><em>Salmo:</em> ${translateBibleReference(introit.psalm)}</p>
          <p>Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.</p>
          <p><em>(Se repite la antífona)</em> ${introit.ant}</p>` : ''}
        </div>

        <h3>KYRIE ELEISON</h3>
        <div class="liturgical-text-block">${Canon.KYRIE}</div>
      </section>

      <!-- GLORIA -->
      <section class="librito-section">
        ${(canonType === '1662' || canonType === '1928') ? `
        <div class="librito-instruction">
          <p><strong>Nota:</strong> En el rito de ${canonType}, el Gloria in excelsis se dice al final de la Misa, después de la Comunión. Véase el final de este librito.</p>
        </div>
        ` : omitGloria ? `
        <div class="librito-instruction">
          <p><strong>Nota:</strong> Se omite el Gloria en Adviento, Cuaresma y Misas de Réquiem.</p>
        </div>
        ` : `
        <h2>✠ GLORIA IN EXCELSIS DEO</h2>
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> Se canta o recita el Gloria:</p>
        </div>
        <div class="liturgical-text-block">${Canon.GLORIA}</div>
        `}
      </section>

      <!-- COLECTA -->
      <section class="librito-section">
        <h2>✠ COLECTA DEL DÍA</h2>${suppliedMark('Colecta')}
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> El Sacerdote saluda y dice la Colecta:</p>
        </div>
        <div class="liturgical-text-block">${Canon.SALUTATION}</div>
        <div class="librito-instruction">
          <p>El Sacerdote reza la Colecta en voz alta. Todos escuchan y al final responden:</p>
        </div>
        <div class="librito-prayer" style="margin-top: 0.5rem; text-align: justify; font-style: normal;">
          <p><em>${collect ? collect.replace(/\bJesús\b/g, 'Jesús <span class="lit-rubric" style="color:#cc0000; font-size:0.85em;">(inclinación de cabeza)</span>') : '[Colecta no disponible]'}</em></p>
        </div>
        <div class="librito-response">
          <p><strong>R/. Amén.</strong></p>
        </div>
      </section>

      ${commemorations && commemorations.length > 0 ? `
      <!-- CONMEMORACIONES -->
      <section class="librito-section">
        <h2>✠ CONMEMORACIONES</h2>
        <div class="librito-instruction">
          <p>Se conmemoran los siguientes santos o fiestas:</p>
        </div>
        ${Commemorations.buildCommemorationHTML(commemorations)}
      </section>
      ` : ''}

      <!-- LITURGIA DE LA PALABRA -->
      <section class="librito-section">
        <h2>✠ LITURGIA DE LA PALABRA</h2>
        ${(borrowedFromSunday && !(readings && readings.votive)) ? `
        <div class="librito-instruction">
          <p><em>Esta feria no tiene lecturas propias asignadas: se repiten las del Domingo precedente.</em></p>
        </div>
        ` : ''}

        ${(readings && readings.votive && !readings.first) ? '' : `<h3>PRIMERA LECTURA</h3>
        <div class="librito-instruction">
          <p><strong>Se sientan.</strong> Se lee la Primera Lectura (Epístola):</p>
        </div>
        ${firstReading ? `
        <div class="librito-reading">
          <p class="reading-ref"><strong>${readings && readings.first ? translateBibleReference(readings.first) : 'Primera Lectura'}</strong></p>
          <p class="reading-text">${firstReading.text || '[Lectura no disponible]'}</p>
        </div>
        <div class="librito-response">
          <p>Palabra de Dios. <strong>R/. Te alabamos, Señor.</strong></p>
        </div>
        ` : '<div class="librito-instruction"><p><em>No hay lectura asignada para este día.</em></p></div>'}`}

        ${(readings && readings.votive && !readings.psalm) ? '' : `<h3>SALMO RESPONSORIAL</h3>
        <div class="librito-instruction">
          <p>Se canta o recita el Salmo del día, respondiendo al Salmista con la antífona:</p>
        </div>
        ${psalmAnt ? `<div class="librito-response"><p><strong>R/. ${psalmAnt}</strong></p></div>` : ''}
        ${psalmVerses && psalmVerses.length > 0 ? (() => {
          const strophes = [];
          for (let i = 0; i < psalmVerses.length; i += 2) {
            strophes.push(psalmVerses.slice(i, i + 2));
          }
          return `
          <div class="librito-psalm">
            <p class="rubric"><em>Salmo ${readings && readings.psalm ? translateBibleReference(readings.psalm) : ''}</em></p>
            ${strophes.map(strophe => `
              <div class="psalm-strophe" style="margin-bottom: 1rem;">
                <p style="margin-bottom: 0.4rem; line-height: 1.4;">${strophe.map(v => `<sup class="verse-num">${v.v}</sup> ${v.content}`).join('<br>')}</p>
                ${psalmAnt ? `<p class="psalm-response"><strong>R/. ${psalmAnt}</strong></p>` : ''}
              </div>
            `).join('')}
          </div>
          `;
        })() : ''}`}

        ${secondReading ? `
        <h3>${(readings && readings.votive && !readings.first) ? 'EPÍSTOLA' : 'SEGUNDA LECTURA'}</h3>
        <div class="librito-instruction">
          <p>${(readings && readings.votive && !readings.first) ? '<strong>Se sientan.</strong> Se lee la Epístola:' : 'Se lee la Segunda Lectura:'}</p>
        </div>
        <div class="librito-reading">
          <p class="reading-ref"><strong>${readings && readings.second ? translateBibleReference(readings.second) : 'Segunda Lectura'}</strong></p>
          <p class="reading-text">${secondReading.text || '[Lectura no disponible]'}</p>
        </div>
        <div class="librito-response">
          <p>Palabra de Dios. <strong>R/. Te alabamos, Señor.</strong></p>
        </div>
        ` : ''}

        <!-- GRADUAL. app.js lo guarda ya en currentMassState y lo pasa por
             extras, de modo que el Librito imprime el mismo texto que el Misal
             sin recalcular propios. Lleva su marca de texto suplido del tiempo:
             el pueblo veía el Gradual del tiempo sin anunciarlo. -->
        ${gradualText ? `
        <h3>${omitAlleluia ? 'GRADUAL / TRACTO' : 'GRADUAL'}</h3>${suppliedMark('Gradual')}
        <div class="librito-reading">
          <p class="reading-text">${gradualText}</p>
        </div>
        ` : ''}

        <h3>${omitAlleluia ? 'TRACTO' : 'ALELUYA'}</h3>
        ${omitAlleluia ? `
        <div class="librito-instruction">
          <p>El Aleluya no se canta desde Septuagésima hasta la Vigilia Pascual. Se usa el Tracto.</p>
        </div>
        ` : `
        <div class="librito-instruction">
          <p>Se canta el Aleluya con su versículo propio.</p>
        </div>
        `}
      </section>

      <!-- EVANGELIO -->
      <section class="librito-section">
        <div style="text-align:center; margin-bottom:1.5rem;"><img src="img/woodcut-gospel.png" alt="Evangeliario" style="max-height:85px; opacity:0.85; filter: contrast(1.2) sepia(0.3) hue-rotate(-15deg);"></div>
        <h2>✠ SANTO EVANGELIO</h2>
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> El Sacerdote anuncia el Evangelio. Todos responden:</p>
        </div>
        <div class="librito-response">
          <p><strong>R/. Gloria a ti, Señor.</strong></p>
        </div>

        ${gospel ? `
        <div class="librito-gospel">
          <p class="gospel-ref"><strong>Evangelio según ${getGospelAuthor(readings?.gospel)}</strong></p>
          <p class="reading-ref-small"><strong>${readings && readings.gospel ? translateBibleReference(readings.gospel) : '[Referencia no disponible]'}</strong></p>
          <p class="reading-text">${gospel.text || '[Evangelio no disponible]'}</p>
        </div>
        ` : '<div class="librito-instruction"><p><em>No hay Evangelio asignado para este día.</em></p></div>'}

        ${gospel ? `
        <div class="librito-instruction">
          <p><strong>Al terminar el Evangelio:</strong></p>
        </div>
        <div class="librito-response">
          <p>Palabra del Señor. <strong>R/. Te alabamos, Señor.</strong></p>
        </div>
        ` : ''}
      </section>

      <!-- HOMILÍA -->
      <section class="librito-section">
        <h2>✠ HOMILÍA</h2>
        <div class="librito-instruction">
          <p><strong>Se sientan.</strong> El Sacerdote predica. Luego hay un momento de silencio para meditar.</p>
        </div>
      </section>

      <!-- CREDO NICENO -->
      <section class="librito-section">
        ${omitCreed ? `
        <div class="librito-instruction">
          <p><strong>Nota:</strong> Se omite hoy el Credo Niceno por ser feria sin rango especial.</p>
        </div>
        ` : `
        <h2>✠ CREDO NICENO</h2>
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> Se recita o canta el Credo. Al llegar a "Et incarnatus est" / "Y por obra del Espíritu Santo", todos se arrodillan brevemente.</p>
        </div>
        <div class="liturgical-text-block">${Canon.CREED}</div>
        `}
      </section>

      <!-- ORACIÓN DE LOS FIELES -->
      <section class="librito-section">
        <h2>✠ ORACIÓN DE LOS FIELES</h2>
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> El Diácono o Sacerdote presenta las intenciones. Después de cada una, el pueblo responde:</p>
        </div>
        ${intercessions ? `
        ${intercessions.header ? `<div class="liturgical-text-block">${intercessions.header}</div>` : ''}
        <div class="librito-response" style="margin-bottom:1.2rem;">
          <p><strong>R/. Señor, escucha nuestra oración.</strong></p>
        </div>
        ${intercessions.petitions.map(p => `
        <div class="librito-petition">
          <p class="rubric" style="font-style:italic; color:#8b1a1a; font-size:0.9em; margin-bottom:0.3rem;">${p.intro}</p>
          <p class="librito-petition-text">${p.body}</p>
        </div>
        `).join('')}
        <div class="librito-instruction" style="margin-top:1rem; border-top:1px solid #c8b87a; padding-top:0.8rem;">
          <p><em>(El Sacerdote concluye:)</em></p>
        </div>
        <div class="librito-petition" style="margin-top:0.5rem;">
          <p><span class="lit-label" style="font-weight:bold; color:#2C1A0E;">S.</span> ${intercessions.close.replace(/<[^>]+>/g, '').replace(/^\(El Sacerdote concluye:\)\s*S\.\s*/, '').replace(/\s*M\.\s*Amén\.?$/, '')}</p>
          <div class="librito-response">
            <p><span class="lit-label" style="font-weight:bold; color:#2C1A0E;">M.</span> <strong>Amén.</strong></p>
          </div>
        </div>
        ` : `
        <div class="librito-response">
          <p><strong>R/. Señor, escucha nuestra oración.</strong></p>
        </div>
        `}
      </section>

      <!-- OFERTORIO -->
      <section class="librito-section">
        <h2>✠ OFERTORIO</h2>${suppliedMark('Ofertorio')}
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> Se canta la Antífona de Ofertorio. El Sacerdote prepara las ofrendas en el altar.</p>
        </div>
        <div class="librito-prayer" style="margin-top: 0.5rem; text-align: justify; font-style: normal;">
          <p>${offertory ? `<em>${offertory}</em>` : (omittedText('Ofertorio') || '<em>[Antífona de Ofertorio no disponible]</em>')}</p>
        </div>
        <div class="librito-instruction">
          <p><strong>Se sientan.</strong> El Sacerdote reza las oraciones del Ofertorio:</p>
        </div>
        <div class="liturgical-text-block">${Canon.OFFERTORY_PUEBLO}</div>

        <h3>ORACIÓN SOBRE LAS OFRENDAS (Secreta)</h3>${suppliedMark('Secreta')}
        ${secret ? `
        <div class="librito-instruction">
          <p>El Sacerdote reza en secreto la Oración sobre las Ofrendas:</p>
        </div>
        <div class="librito-prayer" style="margin-top: 0.5rem; text-align: justify; font-style: normal;">
          <p><em>${secret}</em></p>
        </div>
        <div class="librito-response">
          <p><strong>R/. Amén.</strong></p>
        </div>
        ` : `
        <div class="librito-instruction">
          <p>${omittedText('Secreta') || '[Secreta no disponible]'}</p>
        </div>
        `}
      </section>

      ${canonType === '1662' ? `
      <!-- ORACIÓN POR LA IGLESIA MILITANTE (RITO DE 1662) — vivos y difuntos -->
      <section class="librito-section">
        <h2>✠ ORACIÓN POR LA IGLESIA MILITANTE</h2>
        <div class="librito-instruction">
          <p>El Sacerdote ora por toda la Iglesia, por los vivos y da gracias por los difuntos:</p>
        </div>
        <div class="liturgical-text-block">${Canon.CHURCH_MILITANT_1662}</div>
      </section>
      ` : canonType === '1928' ? `
      <!-- ORACIÓN POR TODA LA IGLESIA (RITO DE 1928) — vivos y difuntos -->
      <section class="librito-section">
        <h2>✠ ORACIÓN POR TODA LA IGLESIA</h2>
        <div class="librito-instruction">
          <p>El Sacerdote ora por toda la Iglesia, por los vivos y da gracias por los difuntos:</p>
        </div>
        <div class="liturgical-text-block">${Canon.CHURCH_MILITANT_1928}</div>
      </section>
      ` : ''}

      <!-- PREFACIO -->
      <section class="librito-section">
        <h2>✠ PREFACIO: ${(preface && preface.title) ? preface.title.toUpperCase() : 'PREFACIO COMÚN'}</h2>
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> El Sacerdote saluda:</p>
        </div>
        <div class="liturgical-text-block">${Canon.SURSUM_CORDA}</div>
        ${preface ? `
        <div class="librito-prayer" style="margin-top: 0.5rem; text-align: justify; font-style: normal;">
          <p><em>${preface.intro || preface.text || ''}</em></p>
        </div>
        ` : `
        <div class="librito-instruction">
          <p>El Sacerdote reza el Prefacio propio del día.</p>
        </div>
        `}
        <div class="librito-instruction">
          <p>Al final del Prefacio, todos cantan o recitan:</p>
        </div>
      </section>

      <!-- SANCTUS -->
      <section class="librito-section">
        <h2>✠ SANCTUS (Santo, Santo, Santo)</h2>
        <div class="liturgical-text-block">${Canon.SANCTUS}</div>
        <div class="librito-instruction">
          <p><strong>Se arrodillan.</strong> Comienza el Canon (Plegaria Eucarística). El Sacerdote reza en silencio.</p>
        </div>
      </section>

      <!-- CONSAGRACIÓN -->
      <section class="librito-section warning">
        <div style="text-align:center; margin-bottom:2rem;"><img src="img/woodcut-canon.png" alt="Cáliz" style="max-height:110px; opacity:0.9; filter: contrast(1.2) sepia(0.3) hue-rotate(-15deg);"></div>
        <h2>✠ CONSAGRACIÓN</h2>
        <div class="librito-instruction warning">
          <p><strong>Se arrodillan en profunda adoración.</strong></p>
          <p>El Sacerdote pronuncia las palabras de consagración. En el momento de la Elevación:</p>
          <p class="highlight"><strong>Se toca la campanilla. La Hostia consagrada es elevada.</strong></p>
          <p><strong>Se adora en silencio profundo.</strong> Es el momento más sagrado de la Misa. Muchos fieles hacen un acto de contrición.</p>
          <p style="margin-top: 1rem;"><strong>Se toca la campanilla nuevamente. El cáliz con la Preciosa Sangre es elevado.</strong></p>
          <p><strong>Se adora nuevamente en profundo recogimiento.</strong></p>
        </div>
        <div class="librito-instruction">
          <p>El Sacerdote termina el Canon con la doxología final. Es la única respuesta del pueblo dentro del Canon:</p>
        </div>
        <div class="librito-response">
          <p><strong>R/. Amén.</strong></p>
        </div>
      </section>

      <!-- PADRE NUESTRO Y CORDERO DE DIOS -->
      <section class="librito-section">
        <div style="text-align:center; margin-bottom:1.5rem;"><img src="img/woodcut-agnus.png" alt="Agnus Dei" style="max-height:90px; opacity:0.85; filter: contrast(1.2) sepia(0.3) hue-rotate(-15deg);"></div>
        ${canonType === '1662' ? `
        <h2>✠ FRACCIÓN DEL PAN, PAZ Y AGNUS DEI</h2>
        <div class="librito-instruction">
          <p>En el rito de 1662, el Padre Nuestro se reza después de la Comunión. Antes de comulgar se conservan el embolismo, la paz y el Agnus Dei:</p>
        </div>
        <div class="liturgical-text-block">${Canon.PATER_NOSTER_REST_PUEBLO}</div>
        ` : canonType === '1928' ? `
        <h2>✠ PADRENUESTRO, FRACCIÓN Y PAZ</h2>
        <div class="librito-instruction">
          <p>En el rito de 1928, el Padre Nuestro se dice inmediatamente después de la Consagración y antes de la Comunión. Todos juntos:</p>
        </div>
        <div class="liturgical-text-block">${Canon.getPaterNosterOnly('1928', true)}</div>
        <div class="liturgical-text-block">${Canon.PATER_NOSTER_REST_PUEBLO}</div>
        ` : `
        <h2>✠ PADRE NUESTRO Y AGNUS DEI</h2>
        <div class="librito-instruction">
          <p>El Sacerdote introduce el Padre Nuestro. Todos recitan o cantan:</p>
        </div>
        <div class="liturgical-text-block">${Canon.getPaterNoster(canonType, true)}</div>
        `}
      </section>

      <!-- COMUNIÓN -->
      <section class="librito-section">
        <h2>✠ SAGRADA COMUNIÓN</h2>
        <div class="librito-instruction">
          <p><strong>Se arrodillan.</strong> El Sacerdote se prepara para comulgar:</p>
        </div>
        <div class="liturgical-text-block">${Canon.COMMUNION_PREP_PUEBLO}</div>
        <div class="librito-instruction">
          <p>El Sacerdote distribuye la Sagrada Comunión a los fieles.</p>
        </div>
        <div class="librito-response">
          <p><strong>Sacerdote: Corpus Dómini nostri Iesu Christi.</strong> <em>(El Cuerpo de Nuestro Señor Jesucristo...)</em><br>
          <strong>R/. Amén.</strong></p>
        </div>
        <div class="librito-instruction">
          <p><strong>Al terminar, se canta la Antífona de Comunión:</strong></p>${suppliedMark('Antífona de Comunión')}
        </div>
        <div class="librito-prayer" style="margin-top: 0.5rem; text-align: justify; font-style: normal;">
          <p>${communion ? `<em>${communion}</em>` : (omittedText('Antífona de Comunión') || '<em>[Antífona de Comunión no disponible]</em>')}</p>
        </div>
        <div class="librito-instruction">
          <p><strong>Después de comulgar:</strong> Se levanta y vuelve a su lugar. Reza en silencio una acción de gracias:</p>
        </div>
        <div class="librito-prayer">
          <p><em>"Te doy gracias, Señor Jesucristo, por haber entrado en mi alma. Tu Cuerpo Preciosísimo y tu Sangre Santísima me guarden y conserven para la vida eterna. Amén."</em></p>
        </div>

        <h3>ABLUCIONES</h3>
        <div class="librito-instruction">
          <p>El Sacerdote purifica el cáliz y la patena:</p>
        </div>
        <div class="liturgical-text-block">${Canon.ABLUTIONS_PUEBLO}</div>
      </section>

      ${canonType === '1662' ? `
      <!-- PADRE NUESTRO POST-COMUNIÓN (RITO DE 1662) -->
      <section class="librito-section">
        <h2>✠ PADRENUESTRO (DESPUÉS DE LA COMUNIÓN)</h2>
        <div class="librito-instruction">
          <p>Según el rito de 1662, el Padre Nuestro se reza después de la Comunión.</p>
        </div>
        <div class="liturgical-text-block">${Canon.PATER_NOSTER_ONLY_PUEBLO}</div>
      </section>

      <!-- ORACIÓN DE OBLACIÓN (RITO DE 1662) — la reza el Sacerdote en nombre
           de todos («nosotros, tus humildes siervos»): el pueblo la sigue.
           Texto tomado literalmente del Misal (app.js); no se ha redactado aquí. -->
      <section class="librito-section">
        <h2>✠ ORACIÓN DE OBLACIÓN (1662)</h2>
        <div class="librito-prayer" style="margin-top: 0.5rem; text-align: justify; font-style: normal;">
          <p>Oh Señor y Padre celestial, nosotros, tus humildes siervos, deseamos enteramente que tu paternal bondad acepte misericordiosamente este nuestro sacrificio de alabanza y acción de gracias; suplicándote humildísimamente que nos concedas, por los méritos y muerte de tu Hijo Jesucristo, y por la fe en su Sangre, a nosotros y a toda tu Iglesia, la remisión de nuestros pecados, y todos los demás beneficios de su Pasión. Y aquí nos ofrecemos y presentamos a ti, oh Señor, nosotros mismos, nuestras almas y cuerpos, para ser un sacrificio razonable, santo y vivo ante ti; suplicándote humildemente que todos cuantos hemos sido partícipes de esta santa Comunión seamos llenos de tu gracia y bendición celestial. Y aunque somos indignos, por nuestros muchos pecados, de ofrecerte sacrificio alguno, te rogamos sin embargo que aceptes este nuestro deber y servicio obligado; no pesando nuestros méritos, sino perdonando nuestras ofensas; por Jesucristo nuestro Señor, por quien, y con quien, en la unidad del Espíritu Santo, todo honor y gloria sea a ti, oh Padre Todopoderoso, por los siglos de los siglos. Amén.</p>
        </div>
      </section>

      <!-- GLORIA AL FINAL (RITO DE 1662) -->
      <section class="librito-section">
        ${omitGloria ?
        '<div class="librito-instruction"><p>✠ <strong>GLORIA IN EXCELSIS DEO — OMITIDO</strong> por estar en tiempo penitencial.</p></div>' :
        `<h2>✠ GLORIA IN EXCELSIS DEO</h2>
        <div class="librito-instruction">
          <p>En el rito de 1662, el Gloria se dice al final de la Misa.</p>
        </div>
        <div class="liturgical-text-block">${Canon.GLORIA}</div>`}
      </section>
      ` : ''}

      ${canonType === '1928' ? `
      <!-- ORACIÓN DE ACCIÓN DE GRACIAS (1928) — el Padrenuestro ya se dijo antes de la Comunión -->
      <section class="librito-section">
        <h2>✠ ORACIÓN DE ACCIÓN DE GRACIAS (1928)</h2>
        <div class="liturgical-text-block">${Canon.THANKSGIVING_1928}</div>
      </section>

      <!-- GLORIA AL FINAL (RITO DE 1928) -->
      <section class="librito-section">
        ${omitGloria ?
        '<div class="librito-instruction"><p>✠ <strong>GLORIA IN EXCELSIS DEO — OMITIDO</strong> por estar en tiempo penitencial.</p></div>' :
        `<h2>✠ GLORIA IN EXCELSIS DEO</h2>
        <div class="librito-instruction">
          <p>En el rito de 1928, el Gloria se dice al final de la Misa.</p>
        </div>
        <div class="liturgical-text-block">${Canon.GLORIA}</div>`}
      </section>
      ` : ''}

      <!-- POSCOMUNIÓN -->
      <section class="librito-section">
        <h2>✠ ORACIÓN DE POSCOMUNIÓN</h2>${suppliedMark('Poscomunión')}
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> El Sacerdote saluda:</p>
        </div>
        <div class="librito-response">
          <p><strong>Sacerdote: Dóminus vobíscum.</strong> <em>(El Señor esté con vosotros)</em><br>
          <strong>R/. Et cum spíritu tuo.</strong> <em>(Y con tu espíritu)</em></p>
        </div>
        <div class="librito-instruction">
          <p><strong>Sacerdote: Orémus.</strong> <em>(Oremos.)</em> El Sacerdote reza la Poscomunión:</p>
        </div>
        ${postcommunion ? `
        <div class="librito-prayer" style="margin-top: 0.5rem; text-align: justify; font-style: normal;">
          <p><em>${postcommunion}</em></p>
        </div>
        ` : ''}
        <div class="librito-response">
          <p><strong>R/. Amén.</strong></p>
        </div>
      </section>

      <!-- BENDICIÓN Y DESPEDIDA -->
      <section class="librito-section">
        <h2>✠ BENDICIÓN Y DESPEDIDA</h2>
        <div class="librito-instruction">
          <p><strong>El Sacerdote se vuelve al pueblo para bendecirlo.</strong> El pueblo se levanta.</p>
        </div>
        <div class="liturgical-text-block">${(season === 'easter' || season === 'pentecost') ? Canon.DISMISSAL_PASCHALTIDE : Canon.DISMISSAL}</div>
        ${votiveType === 'requiem' ?
        '<div class="librito-instruction"><p>En la Misa de Réquiem se dice: <strong>Requiéscant in pace</strong> (Descansen en paz). <strong>R/.</strong> Amén.</p></div>' :
        useBenoedicamus ?
        '<div class="librito-instruction"><p>Hoy se dice <strong>Benedicámus Dómino</strong> (Bendigamos al Señor) en lugar de <em>Ite Missa Est</em>. <strong>R/.</strong> Deo grátias.</p></div>' :
        ''}
      </section>

      <!-- ÚLTIMO EVANGELIO -->
      <section class="librito-section">
        ${(key === 'holySaturday' || key === 'palmSunday' || key === 'easter' || key === 'easter2' || (key && key.startsWith('easterFeria1_'))) ?
        `<div class="librito-instruction">
          <p>✠ El Último Evangelio se <strong>omite</strong> hoy.</p>
        </div>` :
        `<h2>✠ ÚLTIMO EVANGELIO</h2>
        <div class="librito-instruction">
          <p><strong>Se levanta.</strong> El Sacerdote lee el Último Evangelio en el lado del Evangelio. Todos escuchan.</p>
        </div>
        <div class="liturgical-text-block">${Canon.LAST_GOSPEL}</div>`}
      </section>

      <!-- ORACIONES LEONINAS (DESPUÉS DE LA MISA) -->
      <section class="librito-section">
        <h2>✠ ORACIONES DESPUÉS DE LA MISA</h2>
        <div class="librito-instruction">
          <p><strong>Se arrodillan.</strong> El Sacerdote y los fieles rezan juntos las oraciones leoninas:</p>
        </div>
        <div class="liturgical-text-block">${withJesusBow(
          (season === 'easter' || season === 'pentecost')
            ? Canon.LEONINE_PASCHALTIDE
            : Canon.LEONINE
        )}</div>
      </section>

      <!-- ACCIÓN DE GRACIAS FINAL -->
      <section class="librito-section">
        <h2>✠ ACCIÓN DE GRACIAS FINAL</h2>
        <div class="librito-instruction">
          <p><strong>Se sientan.</strong> Rezan en silencio una oración de acción de gracias o cantan un himno. El pueblo puede rezar:</p>
        </div>
        <div class="librito-prayer">
          <p><em>"Gracias te doy, Dios mío, por este día, por tu Santísimo Cuerpo y Sangre que he recibido, por tu gran misericordia. Ayúdame a vivir como cristiano durante esta semana. Protege a mi familia. Dígnate concedernos la paz en la tierra y la vida eterna. Amén."</em></p>
        </div>
        <div class="librito-instruction">
          <p><strong>La Misa ha terminado.</strong> <em>"Laus Deo semper."</em> — Alabanza a Dios siempre.</p>
        </div>
      </section>`}

      <div class="librito-footer">
        <p>✠ Gloria a Dios en las alturas ✠</p>
        <p>Librito de Misa para el Pueblo Cristiano</p>
        <p><em>"En memoria de mí haced esto."</em> — Lucas 22:19</p>
      </div>

    </div>
    `;

    return html;
  }

  function show(date, dayInfo, readings, cycle, firstReading, secondReading, gospel, psalmVerses, psalmAnt, collect, introit, offertory, communion, omitGloria, omitCreed, omitAlleluia, canonType = 'roman', intercessions = null, lang = 'es', extras = {}) {
    if (document.getElementById('librito-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'librito-overlay';
    overlay.className = 'librito-overlay';

    const html = generateLibrito(date, dayInfo, readings, cycle, firstReading, secondReading, gospel, psalmVerses, psalmAnt, collect, introit, offertory, communion, omitGloria, omitCreed, omitAlleluia, canonType, intercessions, lang, extras);

    overlay.innerHTML = `
      <div class="librito-modal">
        <div class="librito-controls">
          <button class="librito-print-btn" onclick="window.print()">⬡ Imprimir Librito</button>
          <button class="librito-docx-btn" type="button">⬇ Descargar DOCX</button>
          <button class="librito-close-btn" onclick="LibritoPueblo.hide()">✕ Cerrar</button>
        </div>
        ${html}
      </div>
    `;

    // El nombre de la fiesta nunca se interpola en un onclick="…('…')": una
    // comilla en el nombre (p. ej. «Santa María d'…») rompía el atributo. Se
    // engancha el manejador aquí, con el valor en una variable.
    const feastName = dayInfo.nameEs || dayInfo.name;
    const docxBtn = overlay.querySelector('.librito-docx-btn');
    if (docxBtn) docxBtn.addEventListener('click', () => downloadLibritoDOCX(feastName));

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    // Marca que hay un overlay a pantalla completa: en @media print el CSS oculta
    // entonces el Misal de fondo y solo se imprime el Librito.
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

// Función para descargar el Librito en DOCX
async function downloadLibritoDOCX(feastName) {
  const libritoDoc = document.querySelector('.librito-document');
  if (!libritoDoc) {
    alert('No se encontró el Librito. Por favor, genera la liturgia primero.');
    return;
  }

  const btn = document.querySelector('.librito-docx-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Generando...'; }

  try {
    const {
      Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, ImageRun,
      TabStopType, Table, TableRow, TableCell, WidthType, ShadingType, VerticalAlign
    } = window.docx;

    // ── Precarga de Imágenes EN PARALELO ────────────────────────────────────
    const imageCache = {};
    const imgUrls = ['img/woodcut-gospel.png', 'img/woodcut-canon.png', 'img/woodcut-agnus.png'];
    await Promise.all(imgUrls.map(async url => {
      try {
        const res = await fetch(url);
        if (res.ok) imageCache[url] = await res.arrayBuffer();
      } catch (e) { console.warn('No se pudo cargar imagen DOCX', url); }
    }));

    // Ceder el hilo al navegador para que renderice el botón "Generando..."
    await new Promise(resolve => setTimeout(resolve, 0));

    // ── Constantes tipográficas ──────────────────────────────────────────────
    const FONT  = 'Palatino Linotype';
    const SZ    = 22;   // 11pt
    const SZ_SM = 18;   // 9pt  — rúbricas
    const SZ_LG = 26;   // 13pt — títulos de sección
    const SZ_XL = 36;   // 18pt — nombre de la fiesta
    const C_INK = '2C1A0E';  // marrón oscuro
    const C_RUB = 'B22222';  // rojo cardenal
    const C_META = '666666'; // gris

    // ── Helpers ──────────────────────────────────────────────────────────────

    // ── Sanitizador de texto: elimina caracteres inválidos en XML 1.0 ───────────
    function sanitizeText(t) {
      if (!t) return '';
      // eslint-disable-next-line no-control-regex
      return String(t).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    }

    const emptyLine = (after = 80) =>
      new Paragraph({ children: [new TextRun(' ')], spacing: { before: 0, after } });

    function buildRuns(node, opts = {}) {
      const { bold = false, italic = false, color = '000000', size = SZ } = opts;
      const runs = [];

      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const t = sanitizeText(child.textContent);
          if (t) runs.push(new TextRun({ text: t, bold, italics: italic, color, size, font: FONT }));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const cls = child.classList;
          const tag = child.tagName;

          if (tag === 'BR') {
            runs.push(new TextRun({ break: 1 }));
          } else if (tag === 'STRONG') {
            runs.push(...buildRuns(child, { bold: true, italic, color, size }));
          } else if (tag === 'EM') {
            runs.push(...buildRuns(child, { bold, italic: true, color, size }));
          } else if (tag === 'SUP' && cls.contains('verse-num')) {
            runs.push(new TextRun({ text: sanitizeText(child.textContent), superScript: true, size: 16, color: '888888', font: FONT }));
          } else {
            runs.push(...buildRuns(child, opts));
          }
        }
      }
      return runs.length ? runs : [new TextRun({ text: ' ', size, font: FONT })];
    }

    // ── Conversión de bloques del Ordinario (Canon.js) con soporte de tabla
    // bilingüe Español | Latín — usado dentro de .liturgical-text-block ──────
    const C_TINT = 'F5F1E3';

    function convertLiturgicalBlock(container) {
      const out = [];

      // Bloque de texto plano con renglones separados por <br> (las antífonas del
      // Viernes Santo, de holyweek.js): no lleva spans lit-*, y el recorrido de
      // abajo solo mira elementos hijos, de modo que el texto se perdía entero al
      // exportar a Word. Se marca con .lit-plain para no alterar el resto de
      // bloques del Ordinario.
      if (container.classList.contains('lit-plain')) {
        if (container.textContent.trim()) {
          out.push(new Paragraph({
            children: buildRuns(container, { italic: false }),
            indent: { left: 360, right: 360 },
            spacing: { before: 80, after: 80, line: 276 },
          }));
        }
        return out;
      }

      function walkEl(el) {
        const cls = el.classList;
        const tag = el.tagName;

        // Fila bilingüe: tabla Español (izquierda) | Latín (derecha, con tinte)
        if (cls.contains('lit-bilingual-row')) {
          const colLa = el.querySelector('.lit-column-la');
          const colEs = el.querySelector('.lit-column-es');
          if (colLa && colEs) {
            const esParas = [];
            for (const child of colEs.childNodes) if (child.nodeType === Node.ELEMENT_NODE) collectSpan(child, esParas);
            if (esParas.length === 0) esParas.push(new Paragraph({ children: buildRuns(colEs) }));

            const laParas = [];
            for (const child of colLa.childNodes) if (child.nodeType === Node.ELEMENT_NODE) collectSpan(child, laParas);
            if (laParas.length === 0) laParas.push(new Paragraph({ children: buildRuns(colLa) }));

            out.push(new Table({
              columnWidths: [4350, 4350],
              layout: docx.TableLayoutType ? docx.TableLayoutType.FIXED : "fixed",
              rows: [new TableRow({
                children: [
                  new TableCell({ children: esParas, width: { size: 4350, type: WidthType.DXA }, margins: { top: 40, bottom: 40, right: 200 } }),
                  new TableCell({ children: laParas, width: { size: 4350, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 200 }, shading: { type: ShadingType.CLEAR, color: 'auto', fill: C_TINT } }),
                ]
              })],
              borders: {
                top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.DOTTED, size: 4, color: 'C5A059', space: 0 },
              },
              width: { size: 100, type: WidthType.PERCENTAGE },
            }));
          }
          return;
        }

        // No es fila bilingüe: tratar como span lit-* normal
        collectSpan(el, out);
      }

      function collectSpan(span, target) {
        const cls = span.classList;

        if (span.classList.contains('lit-bilingual-row')) { walkEl(span); return; }

        if (cls.contains('lit-rubric')) {
          const t = span.textContent.trim();
          if (t) target.push(new Paragraph({
            children: [new TextRun({ text: t, italics: true, color: 'B22222', size: SZ_SM, font: FONT })],
            spacing: { before: 40, after: 40 },
          }));
          return;
        }

        if (cls.contains('lit-title')) {
          target.push(new Paragraph({
            children: [new TextRun({ text: sanitizeText(span.textContent.trim()).toUpperCase(), bold: true, size: SZ, color: 'B22222', font: FONT })],
            spacing: { before: 120, after: 40 },
          }));
          return;
        }

        if (cls.contains('lit-prayer')) {
          target.push(new Paragraph({
            children: buildRuns(span),
            indent: { left: 360 },
            spacing: { before: 40, after: 40 },
          }));
          return;
        }

        if (cls.contains('lit-line')) {
          const label  = span.querySelector('.lit-label')?.textContent?.trim() ?? '';
          const textEl = span.querySelector('.lit-text');
          if (!textEl) return;
          const isPeoplePart = cls.contains('pueblo') || cls.contains('todos') || cls.contains('ministros') || cls.contains('lector');
          target.push(new Paragraph({
            children: [
              new TextRun({ text: label + '\t', bold: true, size: SZ, color: 'B22222', font: FONT }),
              ...buildRuns(textEl, { bold: isPeoplePart }),
            ],
            tabStops: [{ type: TabStopType.LEFT, position: 600 }],
            indent: { left: 600, hanging: 600 },
            spacing: { before: 30, after: 30, line: 264 },
          }));
          return;
        }

        // Elemento desconocido: recorrer hijos
        for (const child of span.children) collectSpan(child, target);
      }

      for (const child of container.children) walkEl(child);
      return out;
    }

    // ── Recolector de párrafos ────────────────────────────────────────────────
    const paras = [];

    // ── Procesar la portada ──────────────────────────────────────────────────
    const cover = libritoDoc.querySelector('.cover-page');
    if (cover) {
      const title    = cover.querySelector('.cover-title')?.textContent?.trim() || 'LIBRITO DE MISA';
      const feast    = cover.querySelector('.cover-feast')?.textContent?.trim() || '';
      const date     = cover.querySelector('.cover-date')?.textContent?.trim() || '';
      const quote    = cover.querySelector('.quote-text')?.textContent?.trim() || '';
      const author   = cover.querySelector('.quote-author')?.textContent?.trim() || '';

      paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '✠', size: 100, color: C_RUB, font: FONT })],
        spacing: { before: 1800, after: 800 },
      }));
      
      paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: title, bold: true, size: 72, color: C_INK, font: FONT })],
        spacing: { before: 0, after: 1200 },
      }));

      paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: feast.toUpperCase(), bold: true, size: 40, color: C_RUB, font: FONT })],
        spacing: { before: 0, after: 400 },
      }));

      paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: date, italics: true, size: 28, color: C_META, font: FONT })],
        spacing: { before: 0, after: 2400 },
      }));

      if (quote) {
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: quote, italics: true, size: 24, color: C_INK, font: FONT })],
          spacing: { before: 0, after: 200 },
        }));
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: author, bold: true, size: 20, color: C_RUB, font: FONT })],
          spacing: { before: 0, after: 0 },
        }));
      }

      // PAGE BREAK
      paras.push(new Paragraph({
        children: [new TextRun({ text: "" })],
        pageBreakBefore: true
      }));
    }

    // ── Procesar la cabecera ─────────────────────────────────────────────────
    const header = libritoDoc.querySelector('.librito-header');
    if (header) {
      const headerTitle = header.querySelector('h2')?.textContent?.trim() || '';
      const headerSubtitle = header.querySelector('.librito-subtitle:first-of-type')?.textContent?.trim() || '';
      const headerDate = header.querySelector('.librito-date')?.textContent?.trim() || '';
      const headerFeast = header.querySelector('.librito-feast')?.textContent?.trim() || '';
      const headerMeta = header.querySelector('.librito-meta')?.textContent?.trim() || '';

      paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '✠  ' + headerTitle + '  ✠', bold: true, size: 24, color: C_INK, font: FONT })],
        spacing: { before: 0, after: 60 },
      }));

      if (headerSubtitle) {
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: headerSubtitle, italics: true, size: 20, color: C_META, font: FONT })],
          spacing: { before: 0, after: 40 },
        }));
      }

      if (headerFeast) {
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: headerFeast, bold: true, size: SZ_XL, color: C_INK, font: FONT })],
          spacing: { before: 20, after: 40 },
        }));
      }

      if (headerDate) {
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: headerDate, italics: true, size: 20, color: C_META, font: FONT })],
          spacing: { before: 0, after: 20 },
        }));
      }

      if (headerMeta) {
        paras.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: headerMeta, size: 18, color: C_META, font: FONT })],
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: C_INK, space: 4 } },
          spacing: { before: 0, after: 200 },
        }));
      }
    }

    // ── Rúbricas de traslación y notas de omisiones ──────────────────────────
    // Cuelgan de .librito-document, no de una .librito-section, y el recorrido
    // de abajo sólo mira las secciones: el bloque entero — el título y todas las
    // notas («GLORIA: se omite…», «VELOS: …», «INCIENSO: …») — se perdía al
    // exportar el Librito a Word, mientras que el Misal sí lo lleva. Eran las
    // únicas notas que el pueblo no recibía en su copia impresa.
    for (const el of libritoDoc.children) {
      if (el.tagName === 'P' && el.classList.contains('rubric')) {
        const t = el.textContent.trim();
        if (t) paras.push(new Paragraph({
          children: [new TextRun({ text: t, italics: true, color: C_RUB, size: SZ_SM, font: FONT })],
          spacing: { before: 60, after: 60 },
        }));
        continue;
      }
      if (!el.classList.contains('omission-notes')) continue;
      const head = el.querySelector('h3, h4');
      if (head && head.textContent.trim()) {
        paras.push(new Paragraph({
          children: [new TextRun({ text: head.textContent.trim().toUpperCase(), bold: true, size: SZ, color: C_INK, font: FONT })],
          keepNext: true,
          spacing: { before: 240, after: 120 },
        }));
      }
      el.querySelectorAll('li').forEach(li => {
        const t = li.textContent.trim();
        if (!t) return;
        paras.push(new Paragraph({
          children: [new TextRun({ text: '• ' + t, italics: true, color: C_RUB, size: SZ_SM, font: FONT })],
          indent: { left: 360 },
          spacing: { before: 40, after: 40 },
        }));
      });
    }

    // ── Procesar secciones ───────────────────────────────────────────────────
    const sections = libritoDoc.querySelectorAll('.librito-section');
    sections.forEach(section => {
      // Título de sección (h2)
      const h2 = section.querySelector('h2');
      if (h2) {
        paras.push(new Paragraph({
          children: [new TextRun({ text: h2.textContent.trim(), bold: true, allCaps: true, size: SZ_LG, color: C_INK, font: FONT })],
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C_INK, space: 3 } },
          spacing: { before: 480, after: 240 },
        }));
      }

      // Procesar elementos dentro de la sección
      for (const el of section.children) {
        if (el.tagName === 'H2') continue;

        if (el.tagName === 'H3') {
          // Subtítulo
          paras.push(new Paragraph({
            children: [new TextRun({ text: el.textContent.trim(), bold: true, size: 22, color: C_INK, font: FONT })],
            spacing: { before: 240, after: 120 },
          }));
          continue;
        }

        // Bloques del Ordinario (Kyrie, Gloria, Credo, Sanctus, Padre Nuestro, etc.)
        // generados por Canon.js — incluyen tabla bilingüe Español|Latín cuando corresponde.
        if (el.classList.contains('liturgical-text-block')) {
          paras.push(...convertLiturgicalBlock(el));
          continue;
        }

        // Imágenes
        if (el.tagName === 'DIV' && el.querySelector('img')) {
          const img = el.querySelector('img');
          const srcAttr = img.getAttribute('src');
          if (srcAttr && imageCache[srcAttr]) {
            let w = 85; let h = 85;
            if (srcAttr.includes('canon')) { w = 110; h = 110; }
            else if (srcAttr.includes('agnus')) { w = 90; h = 90; }
            paras.push(new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new ImageRun({
                data: imageCache[srcAttr],
                type: 'png',
                transformation: { width: w, height: h }
              })],
              spacing: { before: 240, after: 240 }
            }));
          }
          continue;
        }

        // Conmemoraciones (Commemorations.buildCommemorationHTML): el bloque lleva
        // títulos (h3, h4), rúbricas (p) y las oraciones en div.prayer-text, que
        // no es un <p>. Recorrerlo solo por <p> exportaba las rúbricas y perdía
        // los títulos y TODAS las oraciones (Colecta, Secreta, Poscomunión).
        if (el.classList.contains('commemoration-section')) {
          el.querySelectorAll('h3, h4, p, .prayer-text').forEach(node => {
            const text = node.textContent.trim();
            if (!text) return;
            if (node.tagName === 'P' && node.closest('.prayer-text')) return;
            if (node.tagName === 'H3' || node.tagName === 'H4') {
              paras.push(new Paragraph({
                children: [new TextRun({ text: sanitizeText(text), bold: true, size: SZ, color: C_INK, font: FONT })],
                keepNext: true,
                spacing: { before: 200, after: 80 },
              }));
            } else if (node.classList.contains('prayer-text')) {
              paras.push(new Paragraph({
                children: buildRuns(node, { italic: true, size: SZ, color: C_INK }),
                indent: { left: 180, right: 180 },
                alignment: AlignmentType.JUSTIFIED,
                spacing: { before: 60, after: 120, line: 300 },
              }));
            } else {
              paras.push(new Paragraph({
                children: buildRuns(node, { italic: true, color: C_RUB, size: SZ_SM }),
                spacing: { before: 60, after: 60 },
              }));
            }
          });
          continue;
        }

        // Para los demás contenedores, iterar sobre sus <p> internos
        const pTags = el.querySelectorAll('p');
        if (pTags.length > 0) {
          pTags.forEach(p => {
            let pOpts = { spacing: { before: 120, after: 120, line: 300 } };
            let runOpts = { size: SZ };

            if (el.classList.contains('librito-instruction')) {
              runOpts.italic = true;
              runOpts.color = C_RUB;
              runOpts.size = SZ_SM;
              pOpts.spacing = { before: 80, after: 80 };
            } else if (el.classList.contains('librito-response')) {
              pOpts.spacing = { before: 80, after: 80 };
            } else if (el.classList.contains('librito-reading') || el.classList.contains('librito-gospel')) {
              if (p.classList.contains('reading-ref') || p.classList.contains('gospel-ref') || p.classList.contains('reading-ref-small')) {
                runOpts.bold = true;
                pOpts.spacing = { before: 120, after: 40 };
              } else if (p.classList.contains('reading-text')) {
                pOpts.indent = { left: 360, right: 360 };
                pOpts.spacing = { before: 40, after: 120, line: 300 };
                pOpts.alignment = AlignmentType.JUSTIFIED;
              }
            } else if (el.classList.contains('librito-credo')) {
              pOpts.indent = { left: 180 };
              pOpts.spacing = { before: 80, after: 80, line: 276 };
            } else if (el.classList.contains('librito-psalm')) {
              if (p.classList.contains('rubric')) {
                runOpts.italic = true;
                runOpts.size = SZ_SM;
                pOpts.alignment = AlignmentType.CENTER;
                pOpts.spacing = { before: 80, after: 80 };
              } else if (p.classList.contains('psalm-response')) {
                runOpts.bold = true;
                pOpts.indent = { left: 360, right: 360 };
                pOpts.spacing = { before: 60, after: 120 };
              } else {
                pOpts.indent = { left: 360, right: 360 };
                pOpts.spacing = { before: 120, after: 20, line: 276 };
              }
            } else if (el.classList.contains('librito-prayer') || el.classList.contains('librito-text')) {
              pOpts.indent = { left: 180, right: 180 };
              pOpts.alignment = AlignmentType.JUSTIFIED;
            }

            // Manejo especial para la inclinación del Credo
            if (p.closest('.credo-incline')) {
              runOpts.bold = true;
              runOpts.italic = true;
              runOpts.color = C_RUB;
              pOpts.indent = { left: 360, right: 360 };
              pOpts.spacing = { before: 60, after: 60 };
            }

            const text = p.textContent.trim();
            if (text) {
              paras.push(new Paragraph({
                ...pOpts,
                children: buildRuns(p, runOpts),
              }));
            }
          });
          // Marcas sueltas DENTRO del contenedor, fuera de todo <p>: la del
          // Ofertorio y la de la Antífona de Comunión cuelgan de un
          // .librito-instruction, no de la sección. Recorrerlo por <p> las
          // dejaba fuera del .docx.
          for (const loose of el.children) {
            if (loose.tagName !== 'EM' && loose.tagName !== 'SPAN') continue;
            const lt = loose.textContent.trim();
            if (!lt) continue;
            paras.push(new Paragraph({
              children: buildRuns(loose, { italic: true, color: C_RUB, size: SZ_SM }),
              spacing: { before: 30, after: 30 },
            }));
          }
        } else if (el.tagName === 'P' || el.tagName === 'EM' || el.tagName === 'SPAN') {
          // Párrafos y marcas sueltos directamente dentro de la sección.
          // Las marcas de texto suplido del tiempo — « (Introito del tiempo) » —
          // son un <em class="rubric"> suelto que sigue al <h3>, sin <p> dentro:
          // esta rama sólo miraba los <p>, así que las seis marcas del día se
          // imprimían en el Librito en pantalla y desaparecían al exportarlo a
          // Word, mientras el Misal sí las llevaba. Verificado: 6/6 marcas
          // perdidas antes, 6/6 conservadas después.
          const text = el.textContent.trim();
          if (text) {
            const isRubric = el.tagName === 'EM' || el.classList.contains('rubric');
            paras.push(new Paragraph({
              children: buildRuns(el, isRubric ? { italic: true, color: C_RUB, size: SZ_SM } : {}),
              spacing: { before: 30, after: 30 },
            }));
          }
        }
      }
    });

    // ── Procesar el pie de página ────────────────────────────────────────────
    const footer = libritoDoc.querySelector('.librito-footer');
    if (footer) {
      paras.push(emptyLine(120));
      paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: footer.textContent.trim().replace(/\s+/g, ' '), italics: true, size: 18, color: C_META, font: FONT })],
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: C_INK, space: 4 } },
        spacing: { before: 120, after: 0 },
      }));
    }

    // ── Nombre del archivo ────────────────────────────────────────────────────
    const safeName = feastName.replace(/[^\wáéíóúñÁÉÍÓÚÑ\s]/g, '').trim().substring(0, 40);
    const filename = ('Librito-' + safeName + '.docx').replace(/\s+/g, '-');

    // ── Construir documento ───────────────────────────────────────────────────
    const wordDoc = new Document({
      creator: 'Misal Anglicano',
      title: 'Librito del Pueblo - ' + feastName,
      description: 'Librito de Misa para el Pueblo Cristiano. Generado por el Misal Anglicano',
      styles: {
        default: { document: { run: { font: FONT, size: SZ } } },
      },
      sections: [{
        properties: {
          page: {
            size:   { width: 11906, height: 16838 },
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children: paras,
      }],
    });

    // Packer.toBlob() es verdaderamente asíncrono — no bloquea el hilo principal
    const rawBlob = await Packer.toBlob(wordDoc);
    // Tipo MIME correcto para .docx — evita que el navegador muestre caracteres basura
    const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const blob = new Blob([rawBlob], { type: DOCX_MIME });

    // Compatibilidad con Edge Legacy
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else if (typeof saveAs === 'function') {
      saveAs(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      a.type = DOCX_MIME;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 5000);
    }

  } catch (err) {
    console.error('Error generando DOCX del Librito:', err);
    alert('Error al generar el documento Word: ' + err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '⬇ Descargar DOCX'; }
  }
}
