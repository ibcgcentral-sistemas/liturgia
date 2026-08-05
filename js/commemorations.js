/**
 * commemorations.js — Lógica de Conmemoraciones
 * En el Misal Anglicano, cuando una fiesta de santo cae en un día de feria importante,
 * no se ignora ninguna: se celebra la principal y se "conmemora" la otra
 * añadiendo su Colecta, Secreta y Poscomunión al final de las del día.
 */

const Commemorations = (() => {

  // ══════════════════════════════════════════════════════════════════════════
  //  COLECTAS DE SANTOS (para uso como Conmemoración)
  // ══════════════════════════════════════════════════════════════════════════
  const SAINT_COLLECTS = {
    '01-01': `Dios Todopoderoso, que hiciste que tu Hijo bendito fuera circuncidado y obediente a la ley por el hombre; concédenos la verdadera circuncisión del Espíritu; para que, mortificados nuestros corazones de toda concupiscencia mundana y carnal, obedezcamos en todo tu santa voluntad; por el mismo tu Hijo Jesucristo nuestro Señor. Amén.`,
    '01-06': `Oh Dios, que por la guía de una estrella manifestaste a tu Hijo Unigénito a los gentiles; concede misericordiosamente que nosotros, que ahora te conocemos por la fe, después de esta vida tengamos la fruición de tu gloriosa divinidad; por Cristo nuestro Señor. Amén.`,
    '02-02': `Dios Todopoderoso y Eterno, te suplicamos humildemente que, así como tu Hijo Unigénito fue presentado este día en el Templo en nuestra carne, así nosotros seamos presentados ante ti con corazones puros y limpios; por el mismo tu Hijo Jesucristo nuestro Señor. Amén.`,
    '02-24': `Dios Todopoderoso, que en el lugar del traidor Judas elegiste a tu fiel siervo Matías para que fuera del número de los doce Apóstoles; concede que tu Iglesia, libre de ministros falsos, sea siempre gobernada y santificada por siervos suyos fieles y verídicos; por Jesucristo nuestro Señor. Amén.`,
    '03-19': `Oh Dios, que escogiste al bienaventurado José para ser esposo de tu Santísima Madre; concédenos, te suplicamos, que así como la veneramos como nuestro protector en la tierra, así merezcamos tenerle como intercesor en los cielos; que vive y reina contigo, por los siglos de los siglos. Amén.`,
    '03-25': `Derrama tu gracia sobre nuestros corazones, te suplicamos, Señor; para que así como por el mensaje de un Ángel hemos conocido la Encarnación de tu Hijo Jesucristo, así por su Pasión y Cruz, seamos llevados a la gloria de su Resurrección; por el mismo Jesucristo nuestro Señor. Amén.`,
    '04-25': `Oh Dios Todopoderoso, que inspiraste a tu Evangelista San Marcos a registrar en el sagrado Evangelio el glorioso Evangelio de tu Hijo; concédenos que, andando en conformidad con él, seamos llenos de los dones del Espíritu Santo; por Jesucristo nuestro Señor. Amén.`,
    '05-01': `Oh Dios Todopoderoso, que en la fiesta de los Santos Apóstoles Felipe y Jacobo nos has dado una santa alegría; concede que tengamos parte en el gozo eterno de aquéllos cuya intercesión imploramos; por Jesucristo nuestro Señor. Amén.`,
    '06-11': `Oh Señor Dios Todopoderoso, que enriqueciste con grandes dones a tu bienaventurado Apóstol Bernabé; concede a tu Iglesia que siempre ame lo que él amó y enseñe lo que él enseñó; por Jesucristo nuestro Señor. Amén.`,
    '06-24': `Dios Todopoderoso, por cuya providencia el precursor de tu Hijo, San Juan Bautista, nació en el tiempo señalado, y fue martirizado por la verdad; concede que sigamos sus doctrinas y santos ejemplos, y que busquemos la verdad que él proclamó; por Jesucristo nuestro Señor. Amén.`,
    '06-29': `Oh Dios Todopoderoso, que diste a tus Apóstoles Pedro y Pablo la gracia de morir mártires por el amor de tu Hijo; fortalece a tu Iglesia por su doctrina y ejemplo, y otórgale esa unidad y paz que no puede el mundo dar; por Jesucristo nuestro Señor. Amén.`,
    '07-25': `Oh Graciosa Dios, cuyo siervo Santiago, dejando a su padre y todas las cosas que tenía, sin tardanza obedeció la llamada de tu Hijo Jesucristo y le siguió; concede gracia a todos nosotros para que, abandonando todos los cuidados y estudios mundanos, podamos con prontitud y presto obedecer los sagrados mandamientos de Jesucristo nuestro Salvador; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,
    '08-06': `Oh Dios, que en la gloriosa Transfiguración de tu Hijo Unigénito confirmaste los misterios de la fe por el testimonio de Moisés y Elías, y que por una voz celestial maravillosamente prefiguraste la perfecta adopción de nosotros tus hijos; concede misericordiosamente que, escuchando la voz de tu amado Hijo, seamos hechos coherederos con él; por el mismo Jesucristo nuestro Señor. Amén.`,
    '08-15': `Oh Dios, que tomaste para ti la Gloriosa Siempre-Virgen María, Madre de tu Hijo, con cuerpo y alma a la gloria celestial; concede que, mirando siempre a las cosas de lo alto, merezcamos participar de su gloria; por Jesucristo nuestro Señor. Amén.`,
    '08-24': `Oh Dios Todopoderoso y Eterno, que diste a tu Apóstol Bartolomé la gracia de creer verdaderamente en tu Hijo y predicar su Evangelio; concede, te suplicamos, que tu Iglesia ame lo que él creyó y predique lo que él enseñó; por Jesucristo nuestro Señor. Amén.`,
    '09-08': `Infunde, Señor, en nuestras almas, la gracia de tu Espíritu; para que así como anunciamos al pueblo la natividad de la bienaventurada Virgen María, por su tierna intercesión nos veamos libres de las calamidades que merecemos nuestros pecados; por Jesucristo nuestro Señor. Amén.`,
    '09-14': `Oh Dios, que en la Exaltación de la Santa Cruz quisiste alejar de nosotros la antigua herida del maligno; concede que, gozando de la gracia de su redención en este mundo, nos sea dada la salvación eterna en el cielo; por Jesucristo nuestro Señor. Amén.`,
    '09-21': `Oh Dios Todopoderoso, que por tu bienaventurado Hijo llamaste a San Mateo, el publicano, del manejo de las monedas mundanas, a entrar en el servicio de tu economía celestial; síguenos llamando desde cosas viles y esclavas a las más altas riquezas de tu gracia; por Jesucristo nuestro Señor. Amén.`,
    '09-29': `Oh Dios Eterno, que ordenaste y estableciste los ministerios de los Ángeles y de los Hombres en orden maravilloso; concede misericordiosamente que los que siempre te sirven en el cielo, así también en todo tiempo nos socorran y defiendan en la tierra; por Jesucristo nuestro Señor. Amén.`,
    '10-18': `Dios Todopoderoso, que llamaste a tu siervo Lucas el Médico, cuya alabanza está en el Evangelio, para ser Evangelista y Médico del alma; concede que, por la medicina del Evangelio y los Hechos de los Apóstoles, todas las enfermedades de nuestras almas sean sanadas; por la virtud de tu Santo Nombre; por Jesucristo nuestro Señor. Amén.`,
    '10-28': `Oh Dios Todopoderoso, que entre los Apóstoles de tu Hijo edificaste a tu bienaventurada Iglesia sobre el fundamento de los Santos Simón y Judas; concede que por su intercesión tu Iglesia sea siempre preservada de los errores y guardada en toda verdad; por Jesucristo nuestro Señor. Amén.`,
    '11-01': `Oh Dios Todopoderoso, que has unido a tus elegidos en una sola comunión y hermandad en el Cuerpo Místico de tu Hijo Cristo nuestro Señor; concédenos gracia para seguir a tus bienaventurados Santos en toda vida virtuosa y piadosa; por Jesucristo nuestro Señor. Amén.`,
    '11-02': `Oh Dios misericordioso, Padre de nuestro Señor Jesucristo, que es la resurrección y la vida; en quien todos los que creen, aunque estén muertos, vivirán; y quien vive y cree en él no morirá eternamente: te damos gracias por aquellos tus siervos que han descansado en su fe; y te suplicamos que en la resurrección general del último día sean hallados aceptos ante tus ojos; por Jesucristo nuestro Señor. Amén.`,
    '11-30': `Dios Todopoderoso, que diste a tu Apóstol Andrés la gracia de obedecer prontamente la llamada de tu Hijo Jesucristo y de traer a su hermano consigo; danos a nosotros la misma gracia de llamar a los que son queridos para nosotros para que vengan a tu servicio; por el mismo Jesucristo nuestro Señor. Amén.`,
    '12-21': `Dios Todopoderoso, que diste a tu Apóstol Tomás la voluntad de dudar, para que por su duda pudiéramos ser fortalecidos en la fe; concede que, no dudando más, creamos en tu Hijo Jesucristo, tanto como Señor como Dios; quien vive y reina contigo, en la unidad del Espíritu Santo, un solo Dios, ahora y por los siglos de los siglos. Amén.`,
    '12-26': `Concede, Señor, que en todos nuestros sufrimientos por la verdad y la justicia tengamos con nosotros ese mismo espíritu que hizo a tu primer mártir San Esteban orar por sus perseguidores; por Jesucristo nuestro Señor. Amén.`,
    '12-27': `Señor Misericordioso, que permitiste a tu Apóstol y Evangelista San Juan beber de la copa de tus sufrimientos en este mundo; concédenos, que también nosotros, fortalecidos por su ejemplo, y fieles a tu verdad, podamos beber de la misma copa y ser bautizados con el mismo bautismo; por Jesucristo nuestro Señor. Amén.`,
    '12-28': `Dios Todopoderoso, que desde la boca de los niños de pecho perfeccionaste la alabanza; confunde las maquinaciones de los crueles y descarta la soberbia de los malvados; pues los Santos Inocentes en este día confiesan y alaban tu Majestad con su muerte; por Jesucristo nuestro Señor. Amén.`,
  };

  // Secretas para conmemoración (genérica si no hay propia)
  const SAINT_SECRETS = {
    default: `Acepta, Señor, los dones que te ofrecemos en memoria de tu Santo; y concede que, así como él fue glorificado confesando tu Nombre, así también nosotros, por tu misericordia, seamos fortalecidos; por Jesucristo nuestro Señor. Amén.`,
  };

  // Poscomuniones para conmemoración (genérica si no hay propia)
  const SAINT_POSTCOMMUNIONS = {
    default: `Habiéndonos alimentado con los sacrosantos misterios, te suplicamos, Señor, que nos concedas la gracia de imitar la virtud de tu Santo, cuya memoria hemos celebrado hoy; por Jesucristo nuestro Señor. Amén.`,
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  LÓGICA DE PRIORIDAD RUBRICAL
  //  Determina si hay colisión y cuál celebración es principal
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * Dado el día litúrgico (dayInfo) y el calendario completo,
   * detecta si hay un santo fijo (FIXED_FEAST) que colisione con la
   * celebración movible, y determina cuál es principal y cuál es conmemoración.
   *
   * @param {object} dayInfo - Resultado de LiturgicalCalendar.getDay(date)
   * @param {Date}   date    - La fecha
   * @returns {{ principal: object, commemorations: object[] }}
   */
  function resolveOccurrence(dayInfo, date) {
    const mmdd = String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

    // Fuente única de las 28 fiestas fijas: LiturgicalCalendar.FIXED_FEASTS
    // (calendar.js). Antes había aquí una segunda copia completa de la tabla,
    // sin nada que garantizara que las dos se mantuvieran sincronizadas.
    const cf = LiturgicalCalendar.FIXED_FEASTS[mmdd];
    if (!cf) return { principal: dayInfo, commemorations: [] };
    const fixedFeast = { name: cf.nameEs, rank: cf.rank, key: mmdd };

    // Sin colisión: el día ya ES esa fiesta fija — bien porque calendar.js marcó
    // isFixed, bien porque coincide la clave (mmdd), bien porque coincide el nombre
    // (la Circuncisión y la Epifanía se generan con una clave semántica propia,
    // 'circumcision'/'epiphany', en vez de '01-01'/'01-06', pero SÍ son la misma
    // celebración que esta tabla).
    if (dayInfo.isFixed || dayInfo.key === mmdd || dayInfo.nameEs === fixedFeast.name) {
      return { principal: dayInfo, commemorations: [] };
    }

    // Hay colisión real: calendar.js mostró otra celebración (un domingo o una feria
    // privilegiada) sin siquiera haber considerado esta fiesta fija — calendar.js solo
    // deja que una fiesta de "I Clase" desplace un domingo, y ninguna fiesta fija
    // desplaza jamás Adviento, Cuaresma, Pascua o la Semana Santa. Se conmemora
    // siempre, según la tradición del Misal Anglicano de no omitir ninguna celebración.
    return { principal: dayInfo, commemorations: [fixedFeast] };
  }

  /**
   * Genera el HTML de las Conmemoraciones (Colecta + Secreta + Poscomunión)
   * @param {object[]} commemorations - Array de fiestas a conmemorar
   * @returns {string} HTML
   */
  function buildCommemorationHTML(commemorations) {
    if (!commemorations || commemorations.length === 0) return '';

    let html = `
    <div class="mass-section commemoration-section">
      <h3 class="section-title main-section">✠ CONMEMORACIÓN${commemorations.length > 1 ? 'ES' : ''}</h3>
      <p class="rubric">Según la tradición del Misal Anglicano, cuando una fiesta de mayor rango ocupa el día, la celebración de menor rango se <em>conmemora</em> añadiendo su Colecta, Secreta y Poscomunión.</p>
    `;

    commemorations.forEach(feast => {
      const collect       = SAINT_COLLECTS[feast.key]       || `Concede, Señor, que la intercesión de ${feast.name} nos obtenga tu favor; por Jesucristo nuestro Señor. Amén.`;
      const secret        = SAINT_SECRETS[feast.key]        || SAINT_SECRETS.default;
      const postcommunion = SAINT_POSTCOMMUNIONS[feast.key] || SAINT_POSTCOMMUNIONS.default;

      html += `
      <div class="commemoration-block">
        <h4 class="section-title commemoration-title">✠ Conmemoración de ${feast.name}</h4>

        <p class="rubric commemoration-rubric">Colecta de la Conmemoración</p>
        <div class="prayer-text collect-text commemoration-collect">${collect}</div>

        <p class="rubric commemoration-rubric">Secreta de la Conmemoración <em>(dicha en secreto al fin del Ofertorio)</em></p>
        <div class="prayer-text commemoration-secret">${secret}</div>

        <p class="rubric commemoration-rubric">Poscomunión de la Conmemoración</p>
        <div class="prayer-text commemoration-postcommunion">${postcommunion}</div>
      </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────
  return {
    resolveOccurrence,
    buildCommemorationHTML,
    SAINT_COLLECTS,
  };

})();
