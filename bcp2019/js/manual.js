/**
 * manual.js — Manual del Oficiante
 * Libro de Oración Común (2019), ACNA — Santa Eucaristía, Texto Estándar Anglicano
 *
 * Contenido enteramente estático (no depende de la fecha), igual patrón que
 * js/manual.js del Misal Anglicano. El ceremonial es deliberadamente más
 * sobrio que el del Misal: el Texto Estándar Anglicano no exige incienso,
 * genuflexiones múltiples ni ritual individual por cada prenda — es la
 * tradición "Common Prayer" clásica, no el ceremonial Anglo-Católico.
 */

const BCPManual = (() => {

  const MANUAL_HTML = `
  <div class="manual-document">

    <div class="manual-header-block">
      <div class="manual-cross">✠</div>
      <h2>MANUAL DEL OFICIANTE</h2>
      <p class="manual-subtitle">Guía para la Celebración de la Santa Eucaristía</p>
      <p class="manual-tradition">Libro de Oración Común (2019) · Texto Estándar Anglicano · ACNA</p>
    </div>

    <nav class="manual-toc">
      <h3>✠ ÍNDICE</h3>
      <ol>
        <li><a href="#m-prep">Preparación Antes del Servicio</a></li>
        <li><a href="#m-vest">Vestimenta</a></li>
        <li><a href="#m-colors">Colores Litúrgicos</a></li>
        <li><a href="#m-mesa">Preparación de la Santa Mesa</a></li>
        <li><a href="#m-ritos-iniciales">Ritos Iniciales</a></li>
        <li><a href="#m-palabra">Liturgia de la Palabra</a></li>
        <li><a href="#m-fieles">Oración de los Fieles y Confesión</a></li>
        <li><a href="#m-ofertorio">La Paz y el Ofertorio</a></li>
        <li><a href="#m-plegaria">La Gran Plegaria Eucarística</a></li>
        <li><a href="#m-comunion">La Sagrada Comunión</a></li>
        <li><a href="#m-conclusion">Ritos de Conclusión</a></li>
        <li><a href="#m-gestos">Posturas y Gestos — Resumen</a></li>
        <li><a href="#m-rubricas">Notas por Tiempo Litúrgico</a></li>
      </ol>
    </nav>

    <section id="m-prep" class="manual-section">
      <h2>✠ 1. Preparación Antes del Servicio</h2>
      <ul>
        <li>Dedicar un tiempo breve a la oración silenciosa y al examen de conciencia antes de vestirse.</li>
        <li>Repasar la Colecta, las Lecturas y el Prefacio propio del día.</li>
        <li>Verificar que el pan y el vino estén preparados, y que el Libro esté disponible en el pasaje correcto.</li>
        <li>Encender las velas de la Santa Mesa (número y disposición según la costumbre local — el Libro no lo prescribe).</li>
      </ul>
      <p class="rubric">A diferencia del ceremonial romano tradicional, el Texto Estándar Anglicano no exige un rito fijo de preparación en la sacristía — se deja a la piedad y a la costumbre de cada parroquia.</p>
    </section>

    <section id="m-vest" class="manual-section">
      <h2>✠ 2. Vestimenta</h2>
      <p class="rubric">El Libro no prescribe un ceremonial de vestición con oraciones individuales por prenda (a diferencia del Misal Anglo-Católico). La vestimenta habitual es:</p>
      <ul>
        <li><strong>Alba</strong> (o sotana y sobrepelliz) — vestidura blanca básica de todo ministro.</li>
        <li><strong>Estola</strong> del color del día, según el rango del ministro ordenado.</li>
        <li><strong>Casulla</strong> (opcional) — vestidura exterior del color del día para el Celebrante principal, según la costumbre local.</li>
        <li><strong>Cíngulo</strong> (opcional) — cordón para ceñir el alba.</li>
      </ul>
      <p class="rubric">Muchas congregaciones ACNA usan vestimenta más sencilla (alba y estola) para servicios ordinarios, reservando la casulla para las fiestas principales — ambos usos son legítimos.</p>
    </section>

    <section id="m-colors" class="manual-section">
      <h2>✠ 3. Colores Litúrgicos según el Tiempo</h2>
      <table class="manual-table">
        <thead><tr><th>Color</th><th>Cuándo se Usa</th></tr></thead>
        <tbody>
          <tr><td><strong>BLANCO</strong></td><td>Navidad, Epifanía, Pascua, Ascensión, Trinidad, fiestas principales de Cristo, fiestas de santos no mártires.</td></tr>
          <tr><td><strong>ROJO</strong></td><td>Pentecostés, Domingo de Ramos, Semana Santa (excepto Jueves Santo), fiestas de mártires y apóstoles, Cristo Rey.</td></tr>
          <tr><td><strong>MORADO</strong></td><td>Adviento, Cuaresma, ocasiones penitenciales.</td></tr>
          <tr><td><strong>ROSA</strong></td><td>Opcional, III Domingo de Adviento y IV Domingo de Cuaresma.</td></tr>
          <tr><td><strong>VERDE</strong></td><td>Domingos después de Epifanía y después de Pentecostés (Tiempo "Ordinario").</td></tr>
        </tbody>
      </table>
    </section>

    <section id="m-mesa" class="manual-section">
      <h2>✠ 4. Preparación de la Santa Mesa</h2>
      <ul>
        <li>Mantel blanco limpio.</li>
        <li>Cruz o crucifijo visible.</li>
        <li>Pan y vino preparados en la patena y el cáliz, cubiertos hasta el Ofertorio (o presentados por el pueblo en ese momento, según la costumbre local).</li>
        <li>El Libro abierto, o el texto preparado, en un atril accesible.</li>
      </ul>
    </section>

    <section id="m-ritos-iniciales" class="manual-section">
      <h2>✠ 5. Ritos Iniciales</h2>

      <h3>La Aclamación</h3>
      <ul>
        <li>Todos de pie. El Celebrante dice la Aclamación fija, o un saludo propio de la temporada (Adviento, Navidad, Epifanía, Cuaresma — ver "Saludos para los Tiempos Litúrgicos" del Libro).</li>
        <li>En Cuaresma se usa la fórmula penitencial; desde Pascua hasta la víspera de Pentecostés, la fórmula pascual con "Aleluya".</li>
      </ul>

      <h3>Colecta por Pureza</h3>
      <ul>
        <li>El Celebrante puede invitar al pueblo a unirse en voz alta o rezarla solo.</li>
      </ul>

      <h3>Kyrie o Trisagio</h3>
      <ul>
        <li>Se usa uno u otro, no ambos — el Trisagio ("Santo Dios, Santo y Fuerte...") es una alternativa contemporánea al Kyrie clásico.</li>
      </ul>

      <h3>Gloria in Excelsis</h3>
      <ul>
        <li>Se omite en tiempos de penitencia (Adviento, Cuaresma) y en días de ayuno — no es obligatorio fuera de esos tiempos, pero es lo habitual.</li>
      </ul>

      <h3>La Colecta del Día</h3>
      <ul>
        <li>Saludo ("El Señor esté con ustedes" / "Y con tu espíritu"), "Oremos", y la Colecta propia del día.</li>
      </ul>
    </section>

    <section id="m-palabra" class="manual-section">
      <h2>✠ 6. Liturgia de la Palabra</h2>
      <ul>
        <li><strong>Primera Lectura</strong> (Antiguo Testamento) y <strong>Salmo Responsorial</strong>, dicho o cantado.</li>
        <li><strong>Segunda Lectura</strong> (Epístola) — se omite solo si el día no la trae.</li>
        <li><strong>Santo Evangelio</strong>: todos de pie; el lector puede decir "El Santo Evangelio de nuestro Señor Jesucristo según N." e incensar el Evangeliario si es costumbre local (no obligatorio).</li>
        <li><strong>El Sermón</strong>, seguido de un momento de silencio.</li>
        <li><strong>Credo Niceno</strong>: todos de pie, los domingos y días festivos señalados. Muchos fieles hacen una inclinación de cabeza en "y por obra del Espíritu Santo se encarnó... y se hizo hombre" — costumbre piadosa, no rúbrica obligatoria del Libro.</li>
      </ul>
    </section>

    <section id="m-fieles" class="manual-section">
      <h2>✠ 7. Oración de los Fieles y Confesión</h2>
      <ul>
        <li>Un Diácono o lector designado dirige la Oración de los Fieles; se pueden añadir peticiones libres antes de la colecta final del Celebrante.</li>
        <li><strong>Confesión y Absolución</strong>: todos se arrodillan si pueden. Tras el silencio, todos rezan juntos la Confesión; el Celebrante (si es obispo o sacerdote) se pone de pie para la Absolución.</li>
        <li>Las Palabras Reconfortantes son opcionales ("una o más") — el Celebrante elige cuántas usar.</li>
      </ul>
    </section>

    <section id="m-ofertorio" class="manual-section">
      <h2>✠ 8. La Paz y el Ofertorio</h2>
      <ul>
        <li><strong>La Paz</strong>: el Celebrante la anuncia; el pueblo puede saludarse mutuamente en el nombre del Señor (apretón de manos, o costumbre local).</li>
        <li><strong>El Ofertorio</strong>: se presentan el pan y el vino junto con las ofrendas del pueblo. El versículo de 1 Crónicas 29 es la opción fija del Texto Estándar; puede sustituirse por otro versículo de las Escrituras.</li>
      </ul>
    </section>

    <section id="m-plegaria" class="manual-section">
      <h2>✠ 9. La Gran Plegaria Eucarística</h2>

      <h3>Sursum Corda y Prefacio</h3>
      <ul>
        <li>Diálogo fijo ("Levantemos el corazón..."), seguido del Prefacio propio del día o de la temporada.</li>
      </ul>

      <h3>Sanctus</h3>
      <ul>
        <li>Todos, de pie o de rodillas según la costumbre local.</li>
      </ul>

      <h3 class="warning-title">★ LA ORACIÓN DE CONSAGRACIÓN ★</h3>
      <ul>
        <li>Todos de rodillas (o de pie, si así lo indica la costumbre de la congregación).</li>
        <li>En las palabras sobre el pan, el Celebrante lo sostiene o pone la mano sobre él, y puede partirlo en ese momento.</li>
        <li>En las palabras sobre el cáliz, lo sostiene o pone la mano sobre él.</li>
        <li>El Libro no exige elevación ni campanilla — son costumbres locales legítimas, no rúbricas del Texto Estándar Anglicano.</li>
      </ul>
      <p class="rubric warning"><strong>A diferencia del Canon Romano, esta Plegaria se dice en voz alta y de forma audible para todo el pueblo — no hay partes "secretas" del Celebrante en este rito.</strong></p>

      <h3>El Padrenuestro y la Fracción</h3>
      <ul>
        <li>Todos juntos, de pie o de rodillas.</li>
        <li>Si el Pan no se partió durante la Consagración, el Celebrante lo parte ahora, en silencio.</li>
        <li>El Aleluya de la Fracción se omite en Cuaresma; se usa en Pascua y, opcionalmente, el resto del año.</li>
      </ul>
    </section>

    <section id="m-comunion" class="manual-section">
      <h2>✠ 10. La Sagrada Comunión</h2>
      <ul>
        <li>Oración de Humilde Acceso y Agnus Dei, opcionales según el uso local.</li>
        <li>El Celebrante y los ministros comulgan primero, y luego administran al pueblo.</li>
        <li>Palabras de administración fijas para el Pan y el Cáliz, tal como las da el Libro.</li>
        <li>Se pueden cantar himnos, salmos o antífonas durante la distribución.</li>
      </ul>
    </section>

    <section id="m-conclusion" class="manual-section">
      <h2>✠ 11. Ritos de Conclusión</h2>
      <ul>
        <li><strong>Oración de Poscomunión</strong>: fija, dicha por todos juntos tras la invitación del Celebrante.</li>
        <li><strong>La Bendición</strong>: el Obispo, si está presente, o el Sacerdote.</li>
        <li><strong>La Despedida</strong>: "Salgamos en el Nombre de Cristo" / "Demos gracias a Dios" — con "aleluya, aleluya" añadido en tiempo pascual.</li>
      </ul>
    </section>

    <section id="m-gestos" class="manual-section">
      <h2>✠ 12. Posturas y Gestos — Resumen</h2>
      <p class="rubric">El Texto Estándar Anglicano deja mucho más a la costumbre local que el ceremonial Anglo-Católico. Esta tabla resume la práctica más común, no una obligación rubrical.</p>
      <table class="manual-table">
        <thead><tr><th>Postura o Gesto</th><th>Cuándo</th></tr></thead>
        <tbody>
          <tr><td><strong>De pie</strong></td><td>Aclamación, Gloria, Evangelio, Credo, La Paz, Sursum Corda-Sanctus, Padrenuestro (según costumbre), Bendición y Despedida.</td></tr>
          <tr><td><strong>Sentados</strong></td><td>Primera y Segunda Lectura, el Sermón.</td></tr>
          <tr><td><strong>De rodillas</strong></td><td>Confesión, Oración de Consagración (según costumbre), Humilde Acceso, después de comulgar.</td></tr>
          <tr><td><strong>Inclinación de cabeza</strong></td><td>Al Santo Nombre de Jesús — costumbre piadosa extendida, no obligatoria.</td></tr>
        </tbody>
      </table>
    </section>

    <section id="m-rubricas" class="manual-section">
      <h2>✠ 13. Notas por Tiempo Litúrgico</h2>

      <h3>Adviento</h3>
      <ul>
        <li>Color morado (rosa opcional el III Domingo).</li>
        <li>Se omite el Gloria; se mantiene el Aleluya.</li>
      </ul>

      <h3>Cuaresma</h3>
      <ul>
        <li>Color morado (rosa opcional el IV Domingo).</li>
        <li>Se omiten el Gloria y el Aleluya (la Fracción usa la forma sin Aleluya).</li>
        <li>Tono general más sobrio: se recomienda moderar el uso de flores e instrumentos.</li>
      </ul>

      <h3>Semana Santa</h3>
      <ul>
        <li>Domingo de Ramos: rojo, con la lectura completa de la Pasión.</li>
        <li>Jueves Santo: blanco; puede incluir el lavatorio de los pies.</li>
        <li>Viernes Santo y Sábado Santo: liturgias propias (ver <code>bcp2019</code> fase de Cuaresma y Semana Santa, aún no implementada en este generador).</li>
      </ul>

      <h3>Tiempo Pascual</h3>
      <ul>
        <li>Color blanco.</li>
        <li>Aclamación pascual ("¡Aleluya! ¡Cristo ha resucitado!") en lugar de la fórmula ordinaria.</li>
        <li>Despedida con doble "aleluya".</li>
      </ul>
    </section>

    <div class="manual-footer">
      <p>✠ Soli Deo Gloria ✠</p>
      <p class="manual-note">Manual del Oficiante · Libro de Oración Común (2019) · Texto Estándar Anglicano</p>
    </div>

  </div>
  `;

  function show() {
    if (document.getElementById('manual-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'manual-overlay';
    overlay.className = 'manual-overlay';
    overlay.innerHTML = `
      <div class="manual-modal">
        <div class="manual-controls">
          <button class="manual-print-btn" onclick="window.print()">⬡ Imprimir Manual</button>
          <button class="manual-close-btn" onclick="BCPManual.hide()">✕ Cerrar</button>
        </div>
        ${MANUAL_HTML}
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hide();
    });
  }

  function hide() {
    const overlay = document.getElementById('manual-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
  }

  return { show, hide };
})();
