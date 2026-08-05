/**
 * manual.js — Manual de Instrucciones para el Sacerdote
 * Misal Anglicano — Tradición Anglo-Católica
 */

const PriestManual = (() => {

  const MANUAL_HTML = `
  <div class="manual-document">

    <div class="manual-header-block">
      <div class="manual-cross">✠</div>
      <h2>MANUAL DEL SACERDOTE</h2>
      <p class="manual-subtitle">Ceremonial Completo para la Celebración de la Santa Misa</p>
      <p class="manual-tradition">Misal Anglicano · Tradición Anglo-Católica · BCP 1662</p>
    </div>

    <nav class="manual-toc">
      <h3>✠ ÍNDICE</h3>
      <ol>
        <li><a href="#m-prep">Preparación Antes de la Misa</a></li>
        <li><a href="#m-vest">Vestimenta Sagrada (Ornamentos)</a></li>
        <li><a href="#m-colors">Colores Litúrgicos</a></li>
        <li><a href="#m-altar">Preparación del Altar</a></li>
        <li><a href="#m-procession">Procesión de Entrada</a></li>
        <li><a href="#m-ritos-iniciales">Ritos Iniciales</a></li>
        <li><a href="#m-palabra">Liturgia de la Palabra</a></li>
        <li><a href="#m-ofertorio">Ofertorio</a></li>
        <li><a href="#m-canon">Canon de la Misa</a></li>
        <li><a href="#m-comunion">Sagrada Comunión</a></li>
        <li><a href="#m-conclusion">Ritos de Conclusión</a></li>
        <li><a href="#m-gestos">Gestos y Posturas</a></li>
        <li><a href="#m-rubricas">Rúbricas Especiales por Tiempo</a></li>
      </ol>
    </nav>

    <section id="m-prep" class="manual-section">
      <h2>✠ 1. Preparación Antes de la Misa</h2>

      <h3>Preparación Espiritual (mínimo 15 minutos antes)</h3>
      <ul>
        <li>Recitar las <strong>oraciones preparatorias</strong> (Salmos 83, 84, 85, 115, 129) ante el Santísimo o en la sacristía.</li>
        <li>Hacer un acto de contrición y, si es necesario, recibir el sacramento de la Confesión.</li>
        <li>Meditar sobre el misterio del día y las lecturas.</li>
        <li>Verificar el ayuno eucarístico (mínimo 1 hora antes de la comunión).</li>
      </ul>

      <h3>Preparación Material en la Sacristía</h3>
      <ol>
        <li>Lavarse las manos diciendo: <em>"Da, Dómine, virtútem mánibus meis ad abstergéndam omnem máculam..."</em></li>
        <li>Verificar el <strong>misal</strong> abierto en el día correcto.</li>
        <li>Comprobar las <strong>vinajeras</strong> (vino y agua), <strong>cáliz</strong>, <strong>patena</strong>, <strong>hostias</strong>, <strong>corporales</strong>, <strong>purificadores</strong>.</li>
        <li>Encender las <strong>velas del altar</strong> (mínimo 2; en fiestas mayores 6 o más).</li>
        <li>Preparar <strong>incensario y naveta</strong> si es Misa Solemne.</li>
      </ol>
    </section>

    <section id="m-vest" class="manual-section">
      <h2>✠ 2. Vestimenta Sagrada (Ornamentos)</h2>
      <p class="rubric">Cada ornamento se reviste en orden estricto, recitando una oración propia.</p>

      <table class="manual-table">
        <thead>
          <tr><th>Orden</th><th>Ornamento</th><th>Cómo Vestirse</th><th>Oración</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><strong>Amito</strong></td>
            <td>Cuadrado de lino blanco. Se coloca sobre la cabeza, luego se baja sobre los hombros, atando las cintas alrededor de la cintura.</td>
            <td><em>"Impone, Dómine, cápiti meo gáleam salútis..."</em><br><small>"Pon, Señor, sobre mi cabeza el yelmo de la salvación."</small></td>
          </tr>
          <tr>
            <td>2</td>
            <td><strong>Alba</strong></td>
            <td>Túnica blanca larga hasta los pies.</td>
            <td><em>"Deálba me, Dómine, et munda cor meum..."</em><br><small>"Blanquéame, Señor, y purifica mi corazón."</small></td>
          </tr>
          <tr>
            <td>3</td>
            <td><strong>Cíngulo</strong></td>
            <td>Cordón blanco que se ata alrededor de la cintura sobre el alba.</td>
            <td><em>"Praecínge me, Dómine, cíngulo puritátis..."</em><br><small>"Cíñeme, Señor, con el cíngulo de la pureza."</small></td>
          </tr>
          <tr>
            <td>4</td>
            <td><strong>Manípulo</strong></td>
            <td>Banda en el antebrazo izquierdo. <em class="rubric">(Opcional en uso anglicano moderno)</em></td>
            <td><em>"Mérear, Dómine, portáre manípulum fletus et dolóris..."</em><br><small>"Merezca yo llevar el manípulo del llanto."</small></td>
          </tr>
          <tr>
            <td>5</td>
            <td><strong>Estola</strong></td>
            <td>Banda larga del color del día. Alrededor del cuello, cruzada sobre el pecho, asegurada con el cíngulo.</td>
            <td><em>"Redde mihi, Dómine, stolam immortalitátis..."</em><br><small>"Devuélveme, Señor, la estola de la inmortalidad."</small></td>
          </tr>
          <tr>
            <td>6</td>
            <td><strong>Casulla</strong></td>
            <td>Vestidura exterior del color del día, con la cruz al frente o detrás.</td>
            <td><em>"Dómine, qui dixísti: Iugum meum suáve est..."</em><br><small>"Señor, que dijiste: Mi yugo es suave."</small></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section id="m-colors" class="manual-section">
      <h2>✠ 3. Colores Litúrgicos según el Tiempo</h2>
      <table class="manual-table">
        <thead>
          <tr><th>Color</th><th>Cuándo se Usa</th><th>Significado</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>BLANCO</strong></td><td>Navidad, Pascua, Epifanía, fiestas de Cristo no mártir, fiestas de la Virgen, santos no mártires.</td><td>Pureza, alegría, gloria.</td></tr>
          <tr><td><strong>ROJO</strong></td><td>Pentecostés, Domingo de Ramos, Viernes Santo, mártires, apóstoles, Exaltación de la Cruz.</td><td>Sangre, fuego, martirio, Espíritu Santo.</td></tr>
          <tr><td><strong>MORADO</strong></td><td>Adviento, Cuaresma, vigilias penitenciales, Témporas.</td><td>Penitencia, preparación, espera.</td></tr>
          <tr><td><strong>ROSA</strong></td><td>Domingo Gaudete (III Adviento) y Domingo Laetare (IV Cuaresma).</td><td>Alegría moderada en tiempo penitencial.</td></tr>
          <tr><td><strong>VERDE</strong></td><td>Tiempo Ordinario (Domingos después de Epifanía y Trinidad).</td><td>Esperanza, vida, crecimiento.</td></tr>
          <tr><td><strong>NEGRO</strong></td><td>Misa de Réquiem, Viernes Santo (uso tradicional), Día de Difuntos.</td><td>Luto, muerte, recogimiento.</td></tr>
        </tbody>
      </table>
    </section>

    <section id="m-altar" class="manual-section">
      <h2>✠ 4. Preparación del Altar</h2>
      <ol>
        <li><strong>Mantel del altar:</strong> Limpio, blanco, almidonado.</li>
        <li><strong>Crucifijo:</strong> Centrado, visible para celebrante y fieles.</li>
        <li><strong>Velas:</strong> 2 mínimo (Misa rezada), 6 (Misa Solemne); encendidas antes de la Misa.</li>
        <li><strong>Misal:</strong> Sobre atril del lado de la <em>Epístola</em> (derecha del altar).</li>
        <li><strong>Cáliz preparado:</strong>
          <ul>
            <li>Patena con hostia magna sobre el cáliz</li>
            <li>Purificador doblado sobre el cáliz</li>
            <li>Palia (cuadrado rígido) sobre el cáliz</li>
            <li>Velo del color del día cubriendo todo</li>
            <li>Bolsa con corporales encima</li>
          </ul>
        </li>
        <li><strong>Vinajeras:</strong> En la credencia, con agua y vino.</li>
        <li><strong>Sagrario:</strong> Verificar lámpara encendida.</li>
      </ol>
    </section>

    <section id="m-procession" class="manual-section">
      <h2>✠ 5. Procesión de Entrada</h2>
      <p class="rubric"><strong>Orden (Misa Solemne):</strong></p>
      <ol>
        <li>Turiferario con incensario humeante</li>
        <li>Crucífero con cruz alta (entre dos ceroferarios)</li>
        <li>Acólitos</li>
        <li>Subdiácono (porta el Evangeliario)</li>
        <li>Diácono</li>
        <li><strong>Sacerdote celebrante</strong> (último, manos juntas)</li>
      </ol>

      <p class="rubric"><strong>El sacerdote:</strong></p>
      <ul>
        <li>Camina con paso digno, manos juntas a la altura del pecho.</li>
        <li>Ojos bajos, en actitud reverente.</li>
        <li>Al llegar al pie del altar: <strong>genuflexión simple</strong> (si hay Sagrario) o <strong>inclinación profunda</strong> al crucifijo.</li>
        <li>Ante el Santísimo expuesto: <strong>genuflexión con ambas rodillas</strong>.</li>
      </ul>
    </section>

    <section id="m-ritos-iniciales" class="manual-section">
      <h2>✠ 6. Ritos Iniciales</h2>

      <h3>Al Pie del Altar — Salmo 43 (Judica me)</h3>
      <ul>
        <li><strong>Postura:</strong> De pie al pie del altar, manos juntas.</li>
        <li>Hace la <strong>señal de la cruz</strong>: <em>"In nómine Patris..."</em> <em>(En el nombre del Padre...)</em></li>
        <li>Recita Salmo 43 alternando con los ministros.</li>
        <li><strong>Omitir Judica:</strong> Tiempo de Pasión y Misa de Difuntos.</li>
      </ul>

      <h3>Confiteor</h3>
      <ul>
        <li><strong>Profunda inclinación</strong> al recitarlo.</li>
        <li>Al decir <em>"mea culpa, mea culpa, mea máxima culpa"</em> <em>(por mi culpa, por mi culpa, por mi grandísima culpa)</em>: golpea el pecho 3 veces.</li>
        <li>Da la absolución a los ministros tras su Confiteor.</li>
      </ul>

      <h3>Subida al Altar</h3>
      <ul>
        <li>Sube los escalones.</li>
        <li><strong>Besa el altar</strong> en el centro (donde están las reliquias).</li>
        <li>Si es Misa Solemne, <strong>impone incienso</strong> y <strong>turifica el altar</strong>:
          <ul>
            <li>Comienza por la cruz (3 ductus dobles)</li>
            <li>Lado del Evangelio</li>
            <li>Lado de la Epístola</li>
            <li>Vuelve al centro</li>
          </ul>
        </li>
      </ul>

      <h3>Introito</h3>
      <ul>
        <li>Se desplaza al lado de la <strong>Epístola</strong> (derecha).</li>
        <li>Lee el Introito con manos juntas.</li>
        <li>Inclinación al <em>Glória Patri</em>.</li>
      </ul>

      <h3>Kyrie Eleison</h3>
      <ul>
        <li>En el centro del altar, manos juntas.</li>
        <li>9 invocaciones (3 + 3 + 3): Kyrie / Christe / Kyrie.</li>
      </ul>

      <h3>Gloria in Excelsis</h3>
      <ul>
        <li>Extiende y eleva las manos al iniciar.</li>
        <li>Junta las manos al decir <em>"Deo"</em>.</li>
        <li><strong>Inclinación de cabeza</strong> a: <em>Adoramus te, Gratias agimus tibi, Iesu Christe, Súscipe deprecatiónem nostram</em>.</li>
        <li><strong>Señal de la cruz</strong> al final.</li>
        <li><strong>OMITIR Gloria</strong> en: Adviento, Cuaresma (incluida la Semana Santa hasta el Jueves Santo) y Misas de Réquiem. <em>No</em> se omite en Pre-Cuaresma (Septuagésima-Quincuagésima) ni en ferias comunes del Tiempo Ordinario.</li>
      </ul>

      <h3>Colecta del Día</h3>
      <ul>
        <li>Saludo: <em>"Dóminus vobíscum"</em> <em>(El Señor esté con vosotros)</em> (manos extendidas).</li>
        <li><em>"Orémus"</em> <em>(Oremos)</em> (juntando las manos).</li>
        <li>Lee la colecta con manos extendidas.</li>
        <li>Inclinación al Santo Nombre de Jesús.</li>
      </ul>
    </section>

    <section id="m-palabra" class="manual-section">
      <h2>✠ 7. Liturgia de la Palabra</h2>

      <h3>Epístola (Primera Lectura)</h3>
      <ul>
        <li>Subdiácono o lector la lee desde el lado de la <strong>Epístola</strong>.</li>
        <li>Sacerdote escucha con manos juntas.</li>
        <li>Al final: <em>"Deo grátias"</em> <em>(Demos gracias a Dios)</em>.</li>
      </ul>

      <h3>Salmo / Gradual / Aleluya</h3>
      <ul>
        <li>En Cuaresma se omite el Aleluya y se canta <strong>Tracto</strong>.</li>
        <li>En Pascua: doble Aleluya.</li>
      </ul>

      <h3>Evangelio</h3>
      <p class="rubric"><strong>Procedimiento solemne:</strong></p>
      <ol>
        <li>Va al centro del altar.</li>
        <li><strong>Inclinación profunda</strong>: <em>"Munda cor meum..."</em> <em>(Limpia mi corazón...)</em></li>
        <li>Pide la bendición (si lo lee el diácono).</li>
        <li>Va al lado del <strong>Evangelio</strong> (izquierda) con el libro.</li>
        <li>Inciensa el libro 3 veces (Solemne).</li>
        <li>Saluda: <em>"Dóminus vobíscum"</em> <em>(El Señor esté con vosotros)</em>.</li>
        <li>Anuncia: <em>"Sequéntia Sancti Evangélii secúndum N."</em> <em>(Continuación del Santo Evangelio según N.)</em></li>
        <li>Hace <strong>señal de la cruz ✠</strong> sobre:
          <ul>
            <li>El libro</li>
            <li>Su frente (que la Palabra esté en mi mente)</li>
            <li>Sus labios (que la Palabra esté en mi boca)</li>
            <li>Su pecho (que la Palabra esté en mi corazón)</li>
          </ul>
        </li>
        <li>Lee el Evangelio.</li>
        <li>Al terminar: <strong>besa el libro</strong>: <em>"Per evangélica dicta deleántur nostra delícta"</em> <em>(Por las palabras del Evangelio sean borrados nuestros pecados)</em>.</li>
      </ol>

      <h3>Homilía</h3>
      <ul>
        <li>Predica desde el ambón o sede.</li>
        <li>Generalmente se quita el manípulo.</li>
        <li>Comienza con la señal de la cruz.</li>
      </ul>

      <h3>Credo Niceno</h3>
      <ul>
        <li>De pie, en el centro del altar.</li>
        <li>Extiende y eleva las manos al iniciar; las junta al decir <em>"Deum"</em>.</li>
        <li><strong>Inclinación profunda</strong> a: <em>"Et incarnátus est... et homo factus est"</em>.</li>
        <li>En Navidad y Anunciación: <strong>genuflexión</strong> en lugar de inclinación.</li>
        <li>Inclinación al Santo Nombre de Jesús.</li>
        <li>Señal de la cruz al final.</li>
        <li><strong>OMITIR Credo</strong> en: ferias sin rango especial.</li>
      </ul>
    </section>

    <section id="m-ofertorio" class="manual-section">
      <h2>✠ 8. Ofertorio</h2>

      <h3>Antífona de Ofertorio</h3>
      <ul>
        <li>Saluda: <em>"Dóminus vobíscum"</em>, <em>"Orémus"</em>.</li>
        <li>Lee la antífona.</li>
      </ul>

      <h3>Ofrecimiento del Pan</h3>
      <ol>
        <li>Toma la patena con la hostia.</li>
        <li>La eleva un poco con ambas manos.</li>
        <li>Reza: <em>"Súscipe, sancte Pater..."</em> <em>(Recibe, Padre Santo, esta hostia inmaculada...)</em></li>
        <li><strong>Señal de la cruz</strong> con la patena sobre el corporal.</li>
        <li>Coloca la hostia sobre el corporal.</li>
      </ol>

      <h3>Ofrecimiento del Cáliz</h3>
      <ol>
        <li>Subdiácono (o el sacerdote) <strong>vierte vino</strong> en el cáliz.</li>
        <li>Bendice el agua (excepto en Réquiem).</li>
        <li>Vierte unas <strong>gotas de agua</strong>: <em>"Deus, qui humánae substántiae..."</em> <em>(Oh Dios, que de modo admirable creaste la naturaleza humana...)</em></li>
        <li>Toma el cáliz y lo eleva un poco.</li>
        <li>Reza: <em>"Offérimus tibi, Dómine..."</em> <em>(Te ofrecemos, Señor, este cáliz de salvación...)</em></li>
        <li><strong>Señal de la cruz</strong> con el cáliz sobre el corporal.</li>
        <li>Coloca el cáliz detrás de la hostia.</li>
      </ol>

      <h3>In Spiritu Humilitatis</h3>
      <ul>
        <li>Inclinado profundamente, manos juntas sobre el altar.</li>
      </ul>

      <h3>Veni Sanctificator</h3>
      <ul>
        <li>De pie, eleva las manos al cielo.</li>
        <li>Hace señal de la cruz sobre hostia y cáliz.</li>
      </ul>

      <h3>Incensación de las Ofrendas (Misa Solemne)</h3>
      <ul>
        <li>Inciensa pan y cáliz: 3 cruces y 3 círculos.</li>
        <li>Inciensa el altar.</li>
        <li>Es incensado por el diácono.</li>
        <li>Después se inciensa al clero, ministros y pueblo.</li>
      </ul>

      <h3>Lavabo</h3>
      <ul>
        <li>Va al lado de la Epístola.</li>
        <li>Acólito le vierte agua sobre los dedos (pulgar e índice).</li>
        <li>Recita Salmo 26:6-12: <em>"Lavábo inter innocéntes manus meas..."</em> <em>(Lavaré mis manos entre los inocentes...)</em></li>
        <li>Vuelve al centro.</li>
      </ul>

      <h3>Oración Sobre las Ofrendas (Secreta)</h3>
      <ul>
        <li>Dicha en <strong>voz baja</strong>.</li>
        <li>Manos extendidas.</li>
        <li>Concluye en voz alta: <em>"...per ómnia saecula saeculórum"</em> <em>(...por todos los siglos de los siglos)</em>. R/. <em>"Amen"</em> <em>(Amén)</em>.</li>
      </ul>
    </section>

    <section id="m-canon" class="manual-section">
      <h2>✠ 9. Canon de la Misa (Plegaria Eucarística)</h2>

      <h3>Prefacio</h3>
      <ul>
        <li>Saluda: <em>"Dóminus vobíscum"</em> <em>(El Señor esté con vosotros)</em>.</li>
        <li><strong>Sursum corda</strong> <em>(Levantad el corazón)</em>: Eleva las manos; las junta al decir <em>"Habémus"</em> <em>(Lo tenemos levantado hacia el Señor)</em>.</li>
        <li>Lee el Prefacio (variable según el día) con manos extendidas.</li>
      </ul>

      <h3>Sanctus y Benedictus</h3>
      <ul>
        <li>Inclinación profunda al decir <em>"Sanctus, Sanctus, Sanctus"</em> <em>(Santo, Santo, Santo)</em>.</li>
        <li>Endereza al decir <em>"Pleni sunt caeli..."</em> <em>(Llenos están el cielo y la tierra...)</em></li>
        <li><strong>Señal de la cruz</strong> al decir <em>"Benedíctus qui venit ✠"</em> <em>(Bendito el que viene)</em>.</li>
      </ul>

      <h3>Te Igitur (Inicio del Canon)</h3>
      <ul>
        <li>Manos extendidas, ojos elevados al crucifijo, luego bajados.</li>
        <li><strong>Besa el altar</strong> al decir <em>"haec dona, haec múnera..."</em> <em>(estos dones, estas ofrendas...)</em></li>
        <li>Hace <strong>tres señales de la cruz</strong> sobre las ofrendas: <em>"benedícta ✠, adscrípta ✠, rata ✠"</em> <em>(bendita, aprobada, ratificada)</em></li>
      </ul>

      <h3>Memento de los Vivos</h3>
      <ul>
        <li>Manos juntas, ojos al cielo brevemente.</li>
        <li>Recordar nombres específicos en silencio.</li>
      </ul>

      <h3>Communicantes y Hanc Igitur</h3>
      <ul>
        <li>Manos extendidas.</li>
        <li>Hanc Igitur: <strong>extiende ambas manos sobre las ofrendas</strong> (gesto epicletico).</li>
      </ul>

      <h3>Quam Oblationem</h3>
      <ul>
        <li>Hace <strong>5 señales de la cruz</strong>: <em>"benedíctam ✠, adscríptam ✠, ratam ✠, rationábilem ✠, acceptabilémque ✠"</em> <em>(bendita, aprobada, ratificada, racional y agradable)</em></li>
        <li>Dos cruces sobre la hostia y el cáliz al decir <em>"Corpus ✠ et Sanguis ✠"</em> <em>(el Cuerpo y la Sangre)</em>.</li>
      </ul>

      <h3 class="warning-title">★ CONSAGRACIÓN DEL PAN ★</h3>
      <ol>
        <li><strong>Toma la hostia</strong> con ambas manos.</li>
        <li>La <strong>eleva ligeramente</strong>, ojos al cielo.</li>
        <li>Hace señal de la cruz sobre ella: <em>"benedíxit ✠"</em> <em>(la bendijo)</em></li>
        <li>Inclina la cabeza al decir las palabras consecratorias.</li>
        <li>Pronuncia <strong>distinta y reverentemente</strong>: <em>"HOC EST ENIM CORPUS MEUM"</em> <em>(ESTO ES MI CUERPO)</em>.</li>
        <li><strong>Genuflexión</strong> profunda en adoración.</li>
        <li><strong>Eleva la Hostia consagrada</strong> alta para que la vea el pueblo (acólito toca campanilla 3 veces).</li>
        <li>Vuelve a depositar la Hostia sobre el corporal.</li>
        <li>Otra <strong>genuflexión</strong>.</li>
      </ol>
      <p class="rubric warning"><strong>★ Desde aquí hasta las abluciones, mantiene unidos pulgar e índice de ambas manos (porque tocaron el Cuerpo de Cristo).</strong></p>

      <h3 class="warning-title">★ CONSAGRACIÓN DEL VINO ★</h3>
      <ol>
        <li>Destapa el cáliz (quita la palia).</li>
        <li><strong>Toma el cáliz</strong>, lo eleva ligeramente.</li>
        <li>Hace señal de la cruz: <em>"benedíxit ✠"</em></li>
        <li>Pronuncia: <em>"HIC EST ENIM CALIX SANGUINIS MEI, NOVI ET AETERNI TESTAMENTI..."</em> <em>(ESTE ES EL CÁLIZ DE MI SANGRE, DEL NUEVO Y ETERNO TESTAMENTO...)</em></li>
        <li><strong>Genuflexión</strong>.</li>
        <li><strong>Eleva el cáliz</strong> alto (3 toques de campanilla).</li>
        <li>Lo deposita y lo cubre con la palia.</li>
        <li><strong>Genuflexión</strong>.</li>
      </ol>

      <h3>Memento de los Difuntos</h3>
      <ul>
        <li>Manos juntas, breve silencio para los difuntos.</li>
      </ul>

      <h3>Nobis Quoque Peccatoribus</h3>
      <ul>
        <li>Se golpea el pecho una vez.</li>
        <li>Manos extendidas para el resto.</li>
      </ul>

      <h3>Doxología Final</h3>
      <ul>
        <li>Toma la Hostia con la mano derecha, el cáliz con la izquierda.</li>
        <li>Hace <strong>cinco señales de la cruz con la Hostia sobre el cáliz</strong>: <em>"Per ipsum ✠, et cum ipso ✠, et in ipso ✠, est tibi Deo Patri ✠ omnipoténti, in unitáte Spíritus ✠ Sancti..."</em> <em>(Por Él, con Él y en Él, a Ti, Dios Padre omnipotente, en la unidad del Espíritu Santo...)</em></li>
        <li><strong>Eleva ambos juntos</strong> (Pequeña Elevación): <em>"omnis honor et glória..."</em> <em>(todo honor y gloria...)</em></li>
        <li>Termina: <em>"per ómnia saecula saeculórum"</em> <em>(por todos los siglos de los siglos)</em>. R/. <em>"Amen"</em> <em>(Amén)</em>.</li>
      </ul>
    </section>

    <section id="m-comunion" class="manual-section">
      <h2>✠ 10. Sagrada Comunión</h2>

      <h3>Padre Nuestro</h3>
      <ul>
        <li>Manos extendidas.</li>
        <li><em>"Praecéptis salutáribus móniti..."</em> <em>(Amonestados por preceptos saludables...)</em></li>
        <li>Recita el Pater Noster.</li>
      </ul>

      <h3>Embolismo "Líbera nos"</h3>
      <ul>
        <li>Toma la patena con la mano derecha.</li>
        <li>Hace señal de la cruz sobre sí mismo.</li>
        <li>Coloca la patena bajo la Hostia.</li>
      </ul>

      <h3>Fracción del Pan</h3>
      <ol>
        <li><strong>Parte la Hostia</strong> en dos sobre el cáliz.</li>
        <li><strong>Parte una pequeña partícula</strong>.</li>
        <li>La coloca <strong>dentro del cáliz</strong>: <em>"Haec commíxtio..."</em> <em>(Esta mezcla y consagración...)</em> (signo de unión del Cuerpo y Sangre).</li>
      </ol>

      <h3>Agnus Dei</h3>
      <ul>
        <li>Inclinación a cada <em>"Agnus Dei"</em> <em>(Cordero de Dios)</em>.</li>
        <li>Golpe de pecho a cada <em>"miserére nobis"</em> <em>(ten piedad de nosotros)</em> y <em>"dona nobis pacem"</em> <em>(danos la paz)</em>.</li>
        <li>En Réquiem: <em>"dona eis réquiem"</em> <em>(dales el descanso eterno)</em>.</li>
      </ul>

      <h3>Beso de Paz (Misa Solemne)</h3>
      <ul>
        <li>Besa el altar.</li>
        <li>Da el beso de paz al diácono: <em>"Pax tecum"</em> <em>(La paz sea contigo)</em>.</li>
        <li>Se transmite del diácono al subdiácono, etc.</li>
      </ul>

      <h3>Tres Oraciones Privadas</h3>
      <ul>
        <li>Inclinado profundamente, manos juntas.</li>
        <li>Recita las tres oraciones de preparación a la comunión.</li>
      </ul>

      <h3>Comunión del Sacerdote</h3>
      <ol>
        <li><strong>Genuflexión.</strong></li>
        <li>Toma ambas mitades de la Hostia con la mano izquierda, sobre la patena.</li>
        <li>Se golpea 3 veces el pecho diciendo: <em>"Dómine, non sum dignus..."</em> (3 veces, en voz baja).</li>
        <li>Hace señal de la cruz con la Hostia: <em>"Corpus Dómini nostri Iesu Christi custódiat ánimam meam in vitam aetérnam. Amen."</em> <em>(El Cuerpo de Nuestro Señor Jesucristo guarde mi alma para la vida eterna. Amén.)</em></li>
        <li><strong>Recibe el Cuerpo</strong>.</li>
        <li>Pausa adorando en silencio.</li>
        <li>Recoge fragmentos de la patena con el dedo.</li>
        <li><strong>Genuflexión.</strong></li>
        <li>Toma el cáliz con ambas manos.</li>
        <li>Hace señal de la cruz con el cáliz: <em>"Sanguis Dómini nostri..."</em></li>
        <li><strong>Bebe la Preciosa Sangre</strong> entera.</li>
      </ol>

      <h3>Comunión de los Fieles</h3>
      <ul>
        <li>Distribuye la Hostia diciendo: <em>"Corpus Dómini nostri Iesu Christi custódiat ánimam tuam in vitam aetérnam. Amen."</em> <em>(El Cuerpo de Nuestro Señor Jesucristo guarde tu alma para la vida eterna. Amén.)</em></li>
        <li>Tradicional: comunión <strong>de rodillas</strong> y <strong>en la lengua</strong>.</li>
      </ul>

      <h3>Abluciones</h3>
      <ol>
        <li>Va al lado de la <strong>Epístola</strong>.</li>
        <li>Acólito vierte vino: <strong>1ª ablución</strong> — la consume.</li>
        <li>Acólito vierte vino y agua sobre los dedos: <strong>2ª ablución</strong> — la consume.</li>
        <li>Limpia el cáliz con el purificador.</li>
        <li>Ahora puede separar pulgar e índice.</li>
      </ol>

      <h3>Antífona de Comunión y Poscomunión</h3>
      <ul>
        <li>Lee la Antífona en el lado de la Epístola.</li>
        <li><em>"Dóminus vobíscum"</em> <em>(El Señor esté con vosotros)</em>, <em>"Orémus"</em> <em>(Oremos)</em>.</li>
        <li>Lee la oración de Poscomunión.</li>
      </ul>
    </section>

    <section id="m-conclusion" class="manual-section">
      <h2>✠ 11. Ritos de Conclusión</h2>

      <h3>Ite Missa Est</h3>
      <ul>
        <li>Saluda: <em>"Dóminus vobíscum"</em> <em>(El Señor esté con vosotros)</em>.</li>
        <li>Anuncia: <em>"Ite, missa est"</em> <em>(Podéis ir en paz; la Misa ha terminado)</em>. R/. <em>"Deo grátias"</em> <em>(Demos gracias a Dios)</em>.</li>
        <li><strong>Tiempo penitencial</strong>: <em>"Benedicámus Dómino"</em> <em>(Bendigamos al Señor)</em>.</li>
        <li><strong>Réquiem:</strong> <em>"Requiéscant in pace"</em> <em>(Descansen en paz)</em>.</li>
      </ul>

      <h3>Bendición Final</h3>
      <ul>
        <li>Inclinado, manos sobre el altar, recita: <em>"Pláceat tibi, sancta Trínitas..."</em></li>
        <li>Besa el altar.</li>
        <li>Se vuelve al pueblo.</li>
        <li>Bendice: <em>"Benedícat vos omnípotens Deus, ✠ Pater, et ✠ Filius, et Spíritus ✠ Sanctus"</em> <em>(Os bendiga Dios todopoderoso, ✠ Padre, ✠ Hijo y ✠ Espíritu Santo)</em>.
          <ul>
            <li><strong>3 cruces</strong> sobre el pueblo (una por cada Persona divina).</li>
            <li>En Misa Pontifical: 3 cruces dobles.</li>
          </ul>
        </li>
      </ul>

      <h3>Último Evangelio</h3>
      <ul>
        <li>Va al lado del Evangelio.</li>
        <li>Saluda: <em>"Dóminus vobíscum"</em> <em>(El Señor esté con vosotros)</em>.</li>
        <li>Anuncia: <em>"Inítium sancti Evangélii secúndum Ioánnem"</em> (Jn 1:1-14).</li>
        <li>Hace señal de la cruz triple (libro, frente, labios, pecho).</li>
        <li><strong>Genuflexión</strong> al decir: <em>"Et Verbum caro factum est"</em>.</li>
        <li>R/. <em>"Deo grátias"</em> <em>(Demos gracias a Dios)</em>.</li>
        <li>Se omite en Domingo de Ramos, Triduo Pascual y otras ocasiones.</li>
      </ul>

      <h3>Oraciones Leoninas (Misa rezada)</h3>
      <ul>
        <li>De rodillas al pie del altar:
          <ol>
            <li>3 Avemarías</li>
            <li>1 Salve Regina</li>
            <li>Oración: <em>"Deus, refúgium nostrum..."</em></li>
            <li>Oración a San Miguel Arcángel</li>
            <li>3 veces: <em>"Cor Iesu Sacratíssimum, miserére nobis"</em></li>
          </ol>
        </li>
        <li>Se omiten en Misa Solemne, Tiempo Pascual y Misas votivas.</li>
      </ul>

      <h3>Procesión de Salida</h3>
      <ul>
        <li>Mismo orden que la entrada (sin incienso).</li>
        <li>Sacerdote en último lugar.</li>
        <li>En la sacristía: <strong>desvestirse en orden inverso</strong>, recitando oración de acción de gracias.</li>
      </ul>
    </section>

    <section id="m-gestos" class="manual-section">
      <h2>✠ 12. Gestos y Posturas — Resumen</h2>
      <table class="manual-table">
        <thead><tr><th>Gesto</th><th>Cuándo se Realiza</th></tr></thead>
        <tbody>
          <tr><td><strong>Genuflexión simple</strong></td><td>Al pasar ante el Sagrario; antes y después de cada elevación; al recibir y dejar las Sagradas Especies.</td></tr>
          <tr><td><strong>Genuflexión profunda (ambas rodillas)</strong></td><td>Ante el Santísimo expuesto en custodia.</td></tr>
          <tr><td><strong>Inclinación profunda (cuerpo)</strong></td><td>Confiteor, "Munda cor meum", "In spíritu humilitátis", Sanctus, oración antes de comulgar, "Pláceat tibi".</td></tr>
          <tr><td><strong>Inclinación de cabeza</strong></td><td>Al Santo Nombre de Jesús, María, santo del día, "Glória Patri", al Papa, al obispo nombrado.</td></tr>
          <tr><td><strong>Beso del altar</strong></td><td>Al subir al altar, antes de "Dóminus vobíscum" repetidas, al decir "Pláceat tibi".</td></tr>
          <tr><td><strong>Beso del libro</strong></td><td>Al final del Evangelio.</td></tr>
          <tr><td><strong>Golpe de pecho</strong></td><td>Confiteor (3x), "Dómine non sum dignus" (3x), "Nobis quoque peccatoribus", "Agnus Dei" (3x).</td></tr>
          <tr><td><strong>Señal de la cruz sobre sí</strong></td><td>Inicio "In nómine", final del Gloria, final del Credo, "Adiutorium nostrum".</td></tr>
          <tr><td><strong>Señal de la cruz sobre las ofrendas</strong></td><td>Múltiples veces durante el Canon (ver sección Canon).</td></tr>
          <tr><td><strong>Manos juntas</strong></td><td>Posición habitual. Pulgares cruzados (derecho sobre izquierdo).</td></tr>
          <tr><td><strong>Manos extendidas</strong></td><td>Durante oraciones públicas (Colecta, Prefacio, Canon, etc.). Brazos abiertos a la altura de los hombros.</td></tr>
          <tr><td><strong>Manos elevadas</strong></td><td>"Sursum corda", "Gloria in excelsis" (al inicio), "Veni Sanctificator".</td></tr>
        </tbody>
      </table>
    </section>

    <section id="m-rubricas" class="manual-section">
      <h2>✠ 13. Rúbricas Especiales por Tiempo Litúrgico</h2>

      <h3>Adviento</h3>
      <ul>
        <li>Color: <strong>morado</strong> (rosa el III Domingo - Gaudete).</li>
        <li><strong>Omitir Gloria</strong> (excepto en fiestas).</li>
        <li>Mantener Aleluya.</li>
        <li>Omitir órgano salvo para sostener el canto.</li>
        <li>Altar más sobrio.</li>
      </ul>

      <h3>Cuaresma</h3>
      <ul>
        <li>Color: <strong>morado</strong> (rosa el IV Domingo - Laetare).</li>
        <li><strong>Omitir Gloria, Aleluya</strong>.</li>
        <li>Reemplazar Aleluya con <strong>Tracto</strong>.</li>
        <li>Omitir órgano y flores.</li>
        <li>Tono más sobrio en cantos.</li>
      </ul>

      <h3>Tiempo de Pasión (Lent V — Domingo de Ramos)</h3>
      <ul>
        <li><strong>Cubrir cruces e imágenes</strong> con velos morados.</li>
        <li>Omitir <em>Gloria Patri</em> en Introito y Lavabo.</li>
        <li>Omitir <em>Iudica me</em> (Salmo 43).</li>
      </ul>

      <h3>Triduo Pascual</h3>
      <ul>
        <li><strong>Jueves Santo:</strong> blanco; Gloria con campanas (luego silencio); lavatorio de los pies; traslado del Santísimo.</li>
        <li><strong>Viernes Santo:</strong> negro o morado; sin Misa; Liturgia de la Pasión; adoración de la Cruz; comunión de los Presantificados.</li>
        <li><strong>Sábado Santo:</strong> sin Misa hasta la Vigilia Pascual; bendición del fuego nuevo, cirio pascual, agua bautismal.</li>
      </ul>

      <h3>Tiempo Pascual</h3>
      <ul>
        <li>Color: <strong>blanco</strong>.</li>
        <li><strong>Doble Aleluya</strong> al final del Ite missa est.</li>
        <li>Cirio pascual encendido para todas las Misas.</li>
        <li>Asperges reemplazado por <strong>Vidi aquam</strong>.</li>
      </ul>

      <h3>Misa de Réquiem</h3>
      <ul>
        <li>Color: <strong>negro</strong>.</li>
        <li>Omitir: Iudica me, Gloria, Aleluya (reemplazar por Tracto), beso de paz.</li>
        <li>Sin bendición de agua para el cáliz.</li>
        <li>Al final: <em>"Requiéscant in pace"</em> <em>(Descansen en paz)</em> en lugar de <em>"Ite missa est"</em> <em>(Podéis ir en paz)</em>.</li>
        <li>Sin bendición final.</li>
        <li>Sin Último Evangelio (en algunos usos).</li>
        <li>Catafalco frente al altar (si hay cuerpo presente).</li>
        <li>Después de la Misa: <strong>Absolución del difunto</strong>.</li>
      </ul>
    </section>

    <div class="manual-footer">
      <p>✠ Ad Maiorem Dei Gloriam ✠</p>
      <p class="manual-note">Manual del Sacerdote · Misal Anglicano · Tradición Anglo-Católica</p>
      <p class="manual-note"><em>"Sacerdos in aeternum secundum ordinem Melchisedech"</em></p>
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
          <button class="manual-close-btn" onclick="PriestManual.hide()">✕ Cerrar</button>
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
