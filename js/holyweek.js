/**
 * holyweek.js — Semana Santa: ritos propios que NO son la Misa ordinaria.
 *
 * Hoy contiene el VIERNES SANTO tal como lo trae el Misal Anglicano impreso
 * (sección «VIERNES SANTO»: Colecta del Día, lecturas, Colectas Solemnes,
 * antífonas ante la cruz, comunión con el Sacramento reservado y oración
 * final). Todos los textos están TRANSCRITOS del Misal; no se ha redactado
 * ninguno. Lo único que se corrigió son artefactos de la conversión del
 * impreso (letras capitulares partidas, palabras cortadas por el renglón, Amen
 * sin tilde). Las rúbricas del Misal se conservan como rúbricas.
 *
 * El rito es el mismo en los cuatro ritos del Ordinario y en los tres idiomas:
 * el Misal no trae latín para este día, de modo que no se inventa ninguno.
 *
 * Fuentes (líneas de misal_utf8.txt, el Misal convertido a texto):
 *   · Viernes Santo ............ 1210-1387
 *   · Confesión de Pecado ...... 3342-3398 (Invitación, Confesión General,
 *                                Absolución y Palabras de consolación del
 *                                Ordinario: el Viernes Santo solo dice
 *                                «Confesión de Pecado» y no imprime el texto)
 *   · Padre Nuestro ............ 4488-4499 (del Ordinario, igual razón)
 *   · Comunión ................. 4545-4596 (del Ordinario, igual razón)
 *
 * Expone el global `HolyWeek`. Lo consumen app.js (Misal) y
 * librito-pueblo.js (Librito); docx-export.js recorre el DOM ya renderizado
 * y por eso las dos presentaciones usan las clases que ya conoce
 * (mass-section, section-title, rubric, liturgical-text-block, lit-line,
 * prayer-text, scripture-text).
 */
const HolyWeek = (() => {
  'use strict';

  // ══════════════════════════════════════════════════════════════════════════
  //  TEXTOS DEL VIERNES SANTO
  // ══════════════════════════════════════════════════════════════════════════
  const GOOD_FRIDAY = {
    key: 'goodFriday',

    // Lecturas que asigna el Misal (ll. 1223-1230). El leccionario de
    // lectionary.js trae para este día otra Epístola (Hebreos 4:14-16; 5:7-9) y
    // el Evangelio hasta 19:42: contradicen al Misal, de modo que app.js impone
    // estas referencias. `display` es la línea tal como la imprime el Misal.
    readings: {
      first:   { ref: 'Isaiah 52:13-53:12', display: 'Isaías 52:13-53:12, ó Génesis 22:1-18, ó Sabiduría 2:1, 12-24' },
      psalm:   { ref: 'Psalm 22:1-21',      display: 'Salmo 22:1-11(12-21), ó 40:10-14, ó 69:1-23' },
      second:  { ref: 'Hebrews 10:1-25',    display: 'Hebreos 10:1-25' },
      gospel:  { ref: 'John 18:1-19:37',    display: 'San Juan 18:1-19:37, ó 19:1-37' },
    },

    // ── Entrada y Colecta (ll. 1211-1222) ───────────────────────────────────
    entryRubric: 'En este día los ministros entran en silencio. Todos se arrodillan para una oración en silencio después de lo cual el Celebrante poniéndose de pie comienza la Liturgia con la Colecta del Día.',
    beforeCollectRubric: 'Inmediatamente antes de la Colecta el Celebrante puede decir:',
    blessing: { priest: 'Bendito sea nuestro Dios.', people: 'Por los siglos de los siglos. Amén.' },
    oremus: 'Oremos.',
    collect: 'Mira con bondad, te suplicamos, Dios omnipotente, a esta tu familia, por la cual nuestro Señor Jesucristo aceptó ser traicionado y entregado a hombres crueles, y sufrir muerte en la cruz; quien vive ahora y reina contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.',

    // ── Pasión (ll. 1227-1235) ──────────────────────────────────────────────
    passionAnnounceRubric: 'El Evangelio de la Pasión se anuncia de la siguiente manera:',
    passionTitle: 'La Pasión de nuestro Señor Jesucristo según San Juan.',
    passionNoResponsesRubric: 'Las respuestas acostumbradas antes y después del Evangelio se omiten.',
    passionRubric: 'El Evangelio de la Pasión puede ser leído o cantado por laicos. Pueden asignarse partes específicas a distintas personas y la congregación asume la parte de la muchedumbre. La congregación puede sentarse durante la primera porción de la Pasión. En el versículo que menciona la llegada al Gólgota (San Juan 19:17) todos se ponen de pie.',
    sermonRubric: 'Sigue el Sermón. Puede cantarse entonces un himno.',

    // ── Colectas Solemnes (ll. 1236-1334) ───────────────────────────────────
    solemnIntroRubric: 'Todos de pie el Diácono, u otra persona señalada dice al pueblo:',
    solemnInvitation: [
      'Amado Pueblo de Dios: Nuestro Padre celestial envió a su Hijo al mundo no para condenarlo, sino para que el mundo, por medio de él, pudiera ser salvo; para que cuantos creen en él sean librados del poder del pecado y de la muerte, y lleguen a ser herederos con él de la vida sempiterna.',
      'Por tanto, oremos por todas las personas en todos los lugares, según sus necesidades.',
    ],
    solemnRubric: 'En las invitaciones que siguen las peticiones específicas endentadas pueden adaptarse por medio de adiciones u omisiones a discreción del Celebrante. Se le indica al pueblo ponerse de pie o de rodillas. Las invitaciones pueden ser leídas por un Diácono u otra persona señalada, El Celebrante dice las Colectas.',
    silence: 'Silencio',
    // Cada invitación: `lines` son los renglones que el Misal imprime (las
    // peticiones endentadas llegan pegadas en el texto convertido y aquí se
    // separan en su renglón; las palabras son las del Misal).
    solemnCollects: [
      {
        lines: [
          'Oremos por la santa Iglesia Católica de Cristo esparcida por todo el mundo;',
          'por su unidad en el testimonio y servicio',
          'Por todos los obispos y demás ministros, y por el pueblo al que sirven',
          'Por N., nuestro Obispo, y todo el pueblo de esta diócesis',
          'Por todos los cristianos de esta comunidad',
          'Por los que van a ser bautizados (especialmente _________)',
          'Para que Dios confirme a su Iglesia en la fe, la acreciente en el amor y la conserve en paz.',
        ],
        collect: 'Dios todopoderoso y eterno, cuyo Espíritu gobierna y santifica a todo el cuerpo de tu pueblo fiel: Recibe las súplicas y oraciones que te ofrecemos por todos los miembros de tu santa Iglesia, para que en su vocación y ministerio te sirvan verdadera y devotamente; por nuestro Señor y Salvador Jesucristo. Amén.',
      },
      {
        lines: [
          'Oremos por todas las naciones y los pueblos de la tierra, y por todos los que en ellos ejercen autoridad;',
          'Por N., el Presidente de esta nación',
          'Por el Congreso y la Corte Suprema',
          'Por los Miembros y Representantes de las Naciones Unidas',
          'Por cuantos sirven al bien común',
          'Para que, con el auxilio de Dios, busquen la justicia y la verdad, y vivan en paz y concordia.',
        ],
        collect: 'Dios omnipotente, enciende, te suplicamos, en cada corazón el verdadero amor a la paz, y dirige con tu sabiduría a los que deliberan en nombre de las naciones de la tierra; para que en tranquilidad tu señorío aumente hasta que toda la tierra se colme con el conocimiento de tu amor; por Jesucristo nuestro Señor. Amén.',
      },
      {
        lines: [
          'Oremos por todos los que sufren y están afligidos en cuerpo o en mente;',
          'Por los que carecen de pan o de hogar, los indigentes y los oprimidos',
          'Por los enfermos, los heridos y los inválidos',
          'Por los que se hallan solos, en temor y angustia',
          'Por los que se enfrentan a la tentación, la duda y la desesperación',
          'Por los desconsolados y los acongojados',
          'Por los prisioneros y cautivos, y los que se hallan en peligro mortal',
          'Para que Dios, en su misericordia, les consuele y alivie, les conceda el conocimiento de su amor, y estimule en nosotros la voluntad y la paciencia para ministrar a sus necesidades.',
        ],
        collect: 'Dios bondadoso, consuelo de todos los afligidos y fortaleza de todos los que sufren: Haz que el clamor de los que se hallan en miseria y necesidad, llegue hasta ti, para que sepan que tu misericordia está presente con ellos en todas sus aflicciones; y concédenos, te suplicamos, la fortaleza para servirles por amor de aquél que sufrió por nosotros, tu Hijo Jesucristo nuestro Señor. Amén.',
      },
      {
        lines: [
          'Oremos por cuantos no han recibido el Evangelio de Cristo;',
          'Por los que nunca han oído la palabra de salvación',
          'Por los que han perdido la fe',
          'Por los que se han endurecido a causa del pecado o la indiferencia.',
          'Por los que desprecian y hacen escarnio del Evangelio',
          'Por los que son enemigos de la cruz de Cristo y perseguidores de sus discípulos',
          'Por los que, en nombre de Cristo, han perseguido a otros',
          'Para que Dios abra sus corazones a la verdad y los conduzca a la fe y la obediencia.',
        ],
        collect: 'Dios de misericordia, Creador de todos los pueblos de la tierra y amante de las almas: Ten compasión de todos los que no te conocen como te has revelado en tu Hijo Jesucristo; haz que tu Evangelio sea predicado con gracia y poder a cuantos no lo han escuchado; vuelve los corazones de los que lo resisten; y trae de nuevo a tu redil a los que se han extraviado; a fin de que haya un solo rebaño bajo un solo pastor, Jesucristo nuestro Señor. Amén.',
      },
      {
        lines: [
          'Encomendémonos a nuestro Dios, y pidámosle la gracia de una vida santa, para que, con todos cuantos han partido de este mundo y han muerto en la paz de Cristo, y con aquéllos cuya fe sólo Dios conoce, seamos hallados dignos de entrar en la plenitud del gozo de nuestro Señor, y recibamos la corona de vida en el día de la resurrección.',
        ],
        collect: 'Dios de poder inmutable y luz eterna: Mira con favor a toda tu Iglesia, ese maravilloso y sagrado misterio; por la operación eficaz de tu providencia lleva a cabo en tranquilidad el plan de salvación; haz que todo el mundo vea y sepa que las cosas que han sido derribadas son levantadas, las cosas que han envejecido son renovadas, y que todas las cosas están siendo llevadas a su perfección, mediante aquél por quien fueron hechas, tu Hijo Jesucristo nuestro Señor; que vive y reina contigo, en la unidad del Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.',
      },
    ],

    // ── Devociones ante la cruz (ll. 1335-1373) ─────────────────────────────
    crossRubric: 'La Liturgia puede concluir con un himno o antífona el Padre Nuestro y la oración final. Si se desea una cruz de madera puede ser llevada a la iglesia y colocada delante del pueblo. Pueden seguir devociones apropiadas incluyendo todas o cualquiera de las antífonas siguientes u otras adecuadas. Si los textos se recitan en vez de cantarse la congregación lee las partes en cursiva.',
    antiphons: [
      {
        title: 'Antífona 1',
        lines: [
          'Nos gloriamos en tu cruz, oh Señor;',
          'tu santa resurrección alabamos y glorificamos;',
          'porque por medio de tu cruz',
          'gozo ha venido a todo el mundo.',
          'Dios tenga misericordia de nosotros, y nos bendiga;',
          'haga resplandecer su rostro, y venga a nosotros.',
          'Que sea conocido en la tierra tu camino,',
          'en todas las naciones tu salvación.',
          'Te alaben los pueblos, oh Dios;',
          'todos los pueblos te alaben.',
          'Nos gloriamos en tu cruz, oh Señor,',
          'tu santa resurrección alabamos y glorificamos;',
          'porque por medio de tu cruz',
          'gozo ha venido a todo el mundo.',
        ],
      },
      {
        title: 'Antífona 2',
        lines: [
          'Te adoramos, oh Cristo, y te bendecimos,',
          'porque con tu santa cruz has redimido al mundo.',
          'Si hemos muerto con él, también viviremos con él;',
          'si nos mantenemos firmes, también reinaremos con él.',
          'Te adoramos, oh Cristo, y te bendecimos,',
          'porque con tu santa cruz has redimido al mundo.',
        ],
      },
      {
        title: 'Antífona 3',
        lines: [
          'Oh Salvador del mundo,',
          'que por tu cruz y preciosa sangre nos has redimido,',
          'Sálvanos y ayúdanos, humildemente te suplicamos, oh Señor.',
        ],
      },
    ],
    afterCrossRubric: 'Se canta el himno, "Canta, oh lengua, y pregona", u otro himno que exalte la gloria de la cruz. La Liturgia puede concluirse con el Padre Nuestro y la oración final. En ausencia de un obispo o un presbítero, todo lo anterior puede dirigirlo un diácono o lector laico. En lugares donde se administre la Santa Comunión con el Sacramento reservado, se observa el orden siguiente:',

    // ── Comunión con el Sacramento reservado ────────────────────────────────
    // El Viernes Santo solo nombra «Confesión de Pecado, Padre Nuestro,
    // Comunión» (ll. 1376-1378). Los textos son los que el Misal imprime para
    // esas piezas en su Ordinario (ver cabecera).
    confession: {
      invitationHeading: 'Invitación a la confesión',
      invitationRubric: 'El celebrante en preparación a la comunión dice:',
      invitation: 'Vosotros quienes verdadera y ardientemente os arrepentís de vuestros pecados y estáis en el amor y la caridad con vuestros semejantes, e intentáis llevar una nueva vida observando los Mandamientos de Dios y caminando de aquí en adelante en sus santos caminos, acercaos con fe y tomad de este Santo Sacramento para vuestro auxilio y haced vuestra humilde confesión a Dios Todopoderoso, devotamente arrodillados.',
      generalHeading: 'Confesión general',
      exhortRubric: 'El sacerdote podrá exhortar al pueblo a realizar una reconciliación con Dios, que aproveche al alma el sacramento de la penitencia, y de manera especial a utilizar la confesión privada ante el sacerdote para obtener, el consuelo, dirección espiritual y recibir una particular confirmación del perdón de Dios.',
      generalRubric: 'Celebrante y Pueblo:',
      general: 'Omnipotente Dios, Padre de Nuestro Señor Jesucristo, Creador de todas las cosas, Juez de todos los hombres, nosotros confesamos y lamentamos nuestros numerosos pecados y maldades, los cuales en varias ocasiones, muy penosamente hemos cometido, por pensamiento, palabra y obra, contra tu Divina Majestad, provocando muy justamente tu cólera e indignación contra nosotros. Sinceramente nos arrepentimos y de todo corazón nos dolemos de todas nuestras culpas, su recuerdo nos aflige. Ten misericordia de nosotros, ten misericordia misericordiosísimo Padre, por el amor de tu Hijo Nuestro Señor Jesucristo, perdónanos todo nuestro pasado y concede que podamos en adelante servirte y agradarte con una nueva vida, para honra y gloria de tu Nombre, mediante Jesucristo Nuestro Señor. Amén.',
      absolutionHeading: 'La absolución',
      absolutionRubric: 'Mientras el pueblo permanece de rodillas, el sacerdote de pie pronuncia la absolución de los pecados, diciendo las fórmulas de absolución.',
      absolution: 'El Dios Todopoderoso, Padre Nuestro Celestial, que por su gran misericordia ha prometido el perdón de los pecados de todos aquellos que con sincero arrepentimiento y verdadera fe se conviertan a Él; tenga misericordia de vosotros;+ os perdone y libre de todos vuestros pecados; os confirme y fortalezca en toda virtud; y os conduzca a la Vida Eterna; por Jesucristo Nuestro Señor. Amén.',
      comfortHeading: 'Palabras de consolación',
      comfortRubric: 'El Celebrante dirá uno o todos estos versículos:',
      comfort: [
        'Oíd qué confortables palabras Nuestro Salvador Cristo dijo a todos los que se convierten verdaderamente a Él.',
        '"Venid a mí, todos los que estáis cansados y agobiados, que Yo os aliviaré". Mateo 11, 28.',
        '"Porque tanto amó Dios al mundo, que le dio su Unigénito Hijo, para que todo el que crea en Él no perezca, sino que tenga la Vida Eterna". Juan 3, 16.',
        'Oíd también lo que dice San Pablo:',
        '"Cierto es y digno de ser por todos recibido, que Cristo Jesús vino al mundo para salvar a los pecadores." 1 Timoteo 1, 15.',
        'Oíd también lo que dice San Juan:',
        '"Si alguno peca, abogado tenemos ante el Padre, a Jesucristo, Justo. Él es la propiciación por nuestros pecados." 1 San Juan 2, 1-2',
      ],
    },
    paterNoster: {
      intro: 'Y ahora, como Nuestro Salvador Cristo nos ha enseñado, nosotros nos atrevemos a decir:',
      text: 'Padre nuestro, que estás en el cielo, santificado sea tu Nombre, venga tu Reino. Hágase tu voluntad, en la tierra como en el cielo. El pan nuestro de cada día dánosle hoy, y perdónanos nuestras deudas, así como nosotros perdonamos a nuestros deudores y no nos dejes caer en la tentación, más líbranos del mal.',
    },
    communion: {
      humbleAccessHeading: 'Oración de humilde acceso',
      humbleAccess: 'Nosotros no nos atrevemos a acercarnos a tu mesa, oh Misericordioso Señor, confiando más que en nuestra rectitud, en tus muchas y grandes misericordias. Nosotros no somos dignos ni aun de recoger las migajas que caen debajo de tu mesa, más Tú eres el mismo Señor, siempre misericordioso por naturaleza, concédenos por lo tanto, Señor, por tu clemencia, que de tal modo comamos la Carne de tu amado Hijo Jesucristo y bebamos su Sangre, que nuestros cuerpos pecadores, sean limpios por su Cuerpo y nuestras almas lavadas por su preciosa Sangre, y que siempre vivamos en Él, y Él en nosotros. Amén.',
      ecceRubric: 'Antes de recibir la Comunión, el Celebrante se dirige al Pueblo y sosteniendo en alto el Bendito Sacramento, repite las palabras de San Juan el Bautista cuando dice:',
      ecce: [
        'He aquí el Cordero de Dios +',
        'He aquí el que quita el Pecado del Mundo.',
        'Dichosos los llamados a esta Cena.',
      ],
      centurionRubric: 'El pueblo repite tres veces las palabras del Centurión quien con humildad y fe obtiene la curación de su siervo por Nuestro Señor:',
      centurion: [
        'Señor, no soy digno que entres en mi casa,',
        'pero una palabra tuya bastará para sanarme.',
      ],
      formulaHeading: 'Corpus Domini',
      formulaRubric: 'El Sacerdote también podrá usar la antífona del Libro de Oración Común de 1928, para dar la Santa Comunión, Al administrar el Cuerpo dice:',
      formula: 'El Cuerpo de nuestro Señor Jesucristo, que fue dado por ti, preserve tu cuerpo y alma para la vida eterna. Toma y come esto en memoria de que Cristo murió por ti, y aliméntate de Él en tu corazón por fe, con acción de gracias.',
    },

    // ── Oración final (ll. 1379-1387) ───────────────────────────────────────
    finalRubric: 'La Liturgia concluye con la oración siguiente. No se añade bendición ni despedida.',
    finalPrayer: 'Oh Señor Jesucristo, Hijo del Dios vivo, te suplicamos que pongas tu pasión, tu cruz y tu muerte entre tu juicio y nuestras almas, ahora y en la hora de nuestra muerte. Concede misericordia y gracia a los vivos, perdón y descanso a los difuntos, paz y concordia a tu santa Iglesia, y a nosotros pecadores, la vida y la gloria eternas: tú que vives y reinas con el Padre, en la unidad del Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.',
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  LECTURAS
  // ══════════════════════════════════════════════════════════════════════════
  // Devuelve las lecturas del Viernes Santo según el Misal, partiendo de las
  // que dé el leccionario (se conserva todo lo que no contradice al Misal:
  // p. ej. la Primera lectura, Isaías 52:13-53:12). Se omite la antífona del
  // salmo: es una antífona de responsorial romano que el Misal no trae para
  // este día.
  function goodFridayReadings(base) {
    const r = GOOD_FRIDAY.readings;
    return Object.assign({}, base || {}, {
      first: (base && base.first) || r.first.ref,
      psalm: r.psalm.ref,
      second: r.second.ref,
      gospel: r.gospel.ref,
      psalmAnt: '',
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  PRESENTACIONES (misma estructura, dos «pieles»)
  // ══════════════════════════════════════════════════════════════════════════
  const MISAL = {
    section: (inner) => `<div class="mass-section">${inner}</div>`,
    main: (t) => `<h3 class="section-title main-section">✠ ${t}</h3>`,
    sub: (t) => `<h3 class="section-title">✠ ${t}</h3>`,
    sub2: (t) => `<h4 class="section-title">${t}</h4>`,
    rubric: (t) => `<p class="rubric">${t}</p>`,
    block: (inner) => `<div class="liturgical-text-block">${inner}</div>`,
    plain: (inner) => `<div class="liturgical-text-block">${inner}</div>`,
    prayer: (t) => `<div class="prayer-text">${t}</div>`,
    collect: (t) => `<div class="prayer-text collect-text">${t}</div>`,
    scripture: (ref, text) => `<div class="reading">
        <p class="rubric">${ref}</p>
        <div class="scripture-text">${text}</div>
      </div>`,
    verses: (ref, verses) => `<div class="reading psalm-reading">
        <p class="rubric">${ref}</p>
        <div class="liturgical-text-block">${verses}</div>
      </div>`,
  };

  const LIBRITO = {
    section: (inner) => `<section class="librito-section">${inner}</section>`,
    main: (t) => `<h2>✠ ${t}</h2>`,
    sub: (t) => `<h2>✠ ${t}</h2>`,
    sub2: (t) => `<h3>${t}</h3>`,
    rubric: (t) => `<div class="librito-instruction"><p>${t}</p></div>`,
    block: (inner) => `<div class="liturgical-text-block">${inner}</div>`,
    plain: (inner) => `<div class="liturgical-text-block lit-plain">${inner}</div>`,
    prayer: (t) => `<div class="librito-prayer" style="margin-top: 0.5rem; text-align: justify; font-style: normal;"><p><em>${t}</em></p></div>`,
    collect: (t) => `<div class="librito-prayer" style="margin-top: 0.5rem; text-align: justify; font-style: normal;"><p><em>${t}</em></p></div>`,
    scripture: (ref, text) => `<div class="librito-reading">
          <p class="reading-ref"><strong>${ref}</strong></p>
          <p class="reading-text">${text}</p>
        </div>`,
    verses: (ref, verses) => `<div class="librito-psalm">
            <p class="rubric"><em>${ref}</em></p>
            <p style="margin-bottom: 0.4rem; line-height: 1.4;">${verses}</p>
          </div>`,
  };

  const line = (kind, label, text) =>
    `<span class="lit-line ${kind}"><span class="lit-label">${label}</span><span class="lit-text">${text}</span></span>`;
  const br = (lines) => lines.join('<br>');

  // Bow ante el Santo Nombre en las oraciones del sacerdote (solo el Misal).
  function bowed(skin, text, withBow) {
    if (!withBow) return text;
    return typeof withJesusBow === 'function' ? withJesusBow(text) : text;
  }

  function disp(ref) {
    return typeof translateBibleReference === 'function' ? translateBibleReference(ref) : ref;
  }

  /**
   * Cuerpo completo del Viernes Santo. `o` = {
   *   collect, firstReading, psalmVerses, secondReading, gospel, readings }
   * Devuelve el HTML (de «Colecta del Día» a la oración final); el llamador
   * pone la portada, el encabezado y el pie.
   */
  function build(skin, o, withBow) {
    const G = GOOD_FRIDAY;
    const R = G.readings;
    const out = [];

    // 1. Entrada y Colecta del Día
    out.push(skin.section(
      skin.sub('COLECTA DEL DÍA') +
      skin.rubric(G.entryRubric) +
      skin.rubric(G.beforeCollectRubric) +
      skin.block(line('sacerdote', 'S.', G.blessing.priest) + line('pueblo', 'P.', G.blessing.people) + line('sacerdote', 'S.', G.oremus)) +
      skin.collect(bowed(skin, o.collect || G.collect, withBow))
    ));

    // 2. Liturgia de la Palabra
    const scriptureOr = (data, fallback) => (data && data.text) ? data.text : `<em class="rubric">${fallback}</em>`;
    let word = skin.main('LITURGIA DE LA PALABRA');
    word += skin.sub2('ANTIGUO TESTAMENTO') + skin.rubric(R.first.display) +
      skin.scripture(disp((o.readings && o.readings.first) || R.first.ref), scriptureOr(o.firstReading, '[Lectura no disponible]'));

    word += skin.sub2('SALMO') + skin.rubric(R.psalm.display);
    if (o.psalmVerses && o.psalmVerses.length) {
      const verses = o.psalmVerses.map(v => `<sup class="verse-num">${v.v}</sup> ${v.content}`).join('<br>');
      word += skin.verses(disp((o.readings && o.readings.psalm) || R.psalm.ref), verses);
    }

    word += skin.sub2('EPÍSTOLA') + skin.rubric(R.second.display) +
      skin.scripture(disp((o.readings && o.readings.second) || R.second.ref), scriptureOr(o.secondReading, '[Lectura no disponible]'));

    word += skin.rubric(G.passionAnnounceRubric) +
      skin.sub2(G.passionTitle.replace(/\.$/, '').toUpperCase()) +
      skin.rubric(G.passionNoResponsesRubric) +
      skin.rubric(R.gospel.display) +
      skin.rubric(G.passionRubric) +
      skin.scripture(disp((o.readings && o.readings.gospel) || R.gospel.ref), scriptureOr(o.gospel, '[Evangelio no disponible]'));
    out.push(skin.section(word));

    // 3. Sermón
    out.push(skin.section(skin.sub('SERMÓN') + skin.rubric(G.sermonRubric)));

    // 4. Colectas Solemnes
    let solemn = skin.main('COLECTAS SOLEMNES') + skin.rubric(G.solemnIntroRubric) +
      skin.block(line('diacono', 'D.', G.solemnInvitation.join('<br><br>'))) +
      skin.rubric(G.solemnRubric);
    G.solemnCollects.forEach((c) => {
      solemn += skin.block(line('diacono', 'D.', br(c.lines))) +
        skin.rubric(G.silence) +
        skin.prayer(bowed(skin, c.collect, withBow));
    });
    out.push(skin.section(solemn));

    // 5. Adoración de la Cruz
    let cross = skin.main('ADORACIÓN DE LA CRUZ') + skin.rubric(G.crossRubric);
    G.antiphons.forEach((a) => {
      cross += skin.sub2(a.title.toUpperCase()) + skin.plain(br(a.lines));
    });
    cross += skin.rubric(G.afterCrossRubric);
    out.push(skin.section(cross));

    // 6. Comunión con el Sacramento reservado: Confesión, Padre Nuestro, Comunión
    const C = G.confession, P = G.paterNoster, K = G.communion;
    let comm = skin.main('COMUNIÓN CON EL SACRAMENTO RESERVADO');
    comm += skin.sub2('CONFESIÓN DE PECADO') +
      skin.rubric(`<strong>${C.invitationHeading.toUpperCase()}</strong>`) + skin.rubric(C.invitationRubric) +
      skin.block(line('sacerdote', 'S.', C.invitation)) +
      skin.rubric(`<strong>${C.generalHeading.toUpperCase()}</strong>`) + skin.rubric(C.exhortRubric) + skin.rubric(C.generalRubric) +
      skin.block(line('todos', 'S.+P.', C.general)) +
      skin.rubric(`<strong>${C.absolutionHeading.toUpperCase()}</strong>`) + skin.rubric(C.absolutionRubric) +
      skin.block(line('sacerdote', 'S.', C.absolution)) +
      skin.rubric(`<strong>${C.comfortHeading.toUpperCase()}</strong>`) + skin.rubric(C.comfortRubric) +
      skin.block(line('sacerdote', 'S.', br(C.comfort)));
    comm += skin.sub2('PADRE NUESTRO') +
      skin.block(line('sacerdote', 'S.', P.intro) + line('todos', 'S.+P.', P.text));
    comm += skin.sub2('COMUNIÓN') +
      skin.rubric(`<strong>${K.humbleAccessHeading.toUpperCase()}</strong>`) +
      skin.block(line('todos', 'S.+P.', K.humbleAccess)) +
      skin.rubric(K.ecceRubric) +
      skin.block(line('sacerdote', 'S.', br(K.ecce))) +
      skin.rubric(K.centurionRubric) +
      skin.block(line('pueblo', 'P.', br(K.centurion)) + line('pueblo', 'P.', br(K.centurion)) + line('pueblo', 'P.', br(K.centurion))) +
      skin.rubric(`<strong>${K.formulaHeading.toUpperCase()}</strong>`) + skin.rubric(K.formulaRubric) +
      skin.block(line('sacerdote', 'S.', K.formula));
    out.push(skin.section(comm));

    // 7. Oración final (sin bendición ni despedida)
    out.push(skin.section(
      skin.main('ORACIÓN FINAL') + skin.rubric(G.finalRubric) + skin.prayer(bowed(skin, G.finalPrayer, withBow))
    ));

    return out.join('\n\n    ');
  }

  return {
    GOOD_FRIDAY,
    goodFridayReadings,
    goodFridayMisalHTML: (o) => build(MISAL, o, true),
    goodFridayLibritoHTML: (o) => build(LIBRITO, o, false),
  };
})();
