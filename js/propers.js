/**
 * propers.js — Colectas, Prefacios, Introitos, Graduales, Ofertorios, Comuniones
 * Todo en español — tradición del Misal Anglicano
 *
 * ══════════════════════════════════════════════════════════════════════════
 *  CADENA DE RESPALDO POR TIEMPO  ·  CÓMO CONSUMIR LA SEÑAL `supplied`
 * ══════════════════════════════════════════════════════════════════════════
 *  Ningún propio se resuelve ya al texto de la Trinidad «por descarte». El
 *  orden de búsqueda para TODA pieza (introito, gradual, ofertorio, comunión,
 *  colecta, secreta, poscomunión, prefacio) es:
 *
 *     1. clave exacta del día  (p. ej. 'lent1', '11-02', 'easter3')
 *     2. común de la fiesta    (Virgen María, Difuntos… ver FEAST_COMMON)
 *     3. propio DEL TIEMPO     (Adviento, Navidad, Epifanía, Pre-Cuaresma,
 *                               Cuaresma, Pasión, Pascua, Pentecostés, Trinidad)
 *     4. texto genérico del Común (último recurso)
 *
 *  API CON METADATOS (la que debe usar app.js para poder imprimir la rúbrica):
 *
 *     Propers.getProper(part, dayKey, season, date)
 *       date: opcional, un Date. Solo lo usa el Prefacio, para las octavas que la
 *             clave del día no delimita (Epifanía, Todos los Santos).
 *       part ∈ 'introit'|'gradual'|'offertory'|'communion'|'collect'|
 *              'secret'|'postcommunion'|'preface'
 *       season: el `season` que devuelve LiturgicalCalendar.getDay(date).season
 *               ('advent'|'christmas'|'epiphany'|'preLent'|'lent'|'passiontide'|
 *                'triduum'|'easter'|'pentecost'|'trinity'). Se puede omitir: en
 *               ese caso se deduce de la clave del día. OJO: app.js pasa hoy el
 *               resultado de su propio getSeasonFromKey(), que devuelve
 *               'ordinary' para las fiestas fijas 'MM-DD'; ese valor se ignora
 *               y se usa la deducción interna. Pasar dayInfo.season es mejor,
 *               porque permite dar a una fiesta fija el propio del tiempo en
 *               que cae.
 *
 *     Devuelve SIEMPRE un objeto:
 *       {
 *         value:    <el texto/objeto tal como lo devolvía la API antigua>,
 *         supplied: true|false,      // true = NO es el propio del día
 *         source:   'proper'|'common'|'season'|'generic'|'none',
 *         from:     'lent' | 'bvm' | 'requiem' | null,   // de dónde se tomó
 *         rubric:   '(Secreta del tiempo de Cuaresma, suplida)' | null,
 *         omitted:  true            // solo cuando el día NO tiene esa pieza
 *         note:     '…'             // motivo de la omisión
 *       }
 *
 *     Uso previsto en app.js:
 *         const s = Propers.getProper('secret', key, dayInfo.season);
 *         html += s.omitted
 *           ? `<em class="rubric">${s.note}</em>`
 *           : `<div class="prayer-text">${s.value}</div>` +
 *             (s.supplied ? `<em class="rubric">${s.rubric}</em>` : '');
 *
 *  API ANTIGUA (getIntroit, getSecret, …): intacta y con las MISMAS formas de
 *  retorno de siempre (string, {ant}, {type,text}, {title,intro}); ahora se
 *  limita a devolver `getProper(...).value`, de modo que app.js sigue
 *  funcionando sin cambios hasta que se adapte.
 *
 *  REGLA ABSOLUTA: en este archivo NO se redacta ningún texto litúrgico nuevo.
 *  Donde el Misal impreso haría falta y no hay texto, la cadena cae al genérico
 *  y se marca `supplied`. Las piezas que faltan están listadas en
 *  MISSING_TEXTS, al final del archivo, y expuestas como Propers.MISSING_TEXTS.
 */

const Propers = (() => {

  // ══════════════════════════════════════════════════════════════════════════
  //  COLECTAS
  // ══════════════════════════════════════════════════════════════════════════
  // FUENTE: «Misal Anglicano para la Provincia Católica de Rito Anglicano en
  // América Latina» (Sociedad Sacerdotal Corpus Christi, 2013), sección
  // «COLECTAS» (pp. 57-103): Adviento a Trinidad, días santos y solemnidades.
  // Los textos están transcritos tal como los imprime ese Misal (su ortografía
  // incluida: «fué», «substancia», «El» sin tilde); solo se corrigieron
  // artefactos de la extracción (letra capital partida, palabras cortadas,
  // r+n leída como m, tildes de mayúsculas, espacios y puntos espurios).
  // NO figuran en ese Misal, y por eso conservan el texto anterior, sin
  // verificar contra él: baptismLord, 03-19, 09-14, 11-02, requiem, holySpirit,
  // bvm y trinity26-28 (ver MISSING_TEXTS al final del archivo).
  // Cuando el Misal da varias colectas para un día (Pascua, Pentecostés, Viernes
  // Santo, Purificación, Anunciación…) aquí va la principal de la sección
  // «COLECTAS»; las alternativas no se han cargado.
  const COLLECTS = {
    advent1: `Dios Todopoderoso, concédenos que echemos de nosotros las obras de las tinieblas, y nos revistamos con las armas de luz en esta vida mortal, a la cual Jesucristo tu Hijo, con grande humildad vino a visitarnos; para que en el día postrero, cuando vuelva con Majestad gloriosa a juzgar a los vivos y a los muertos, resucitemos a la vida inmortal, por el mismo Jesucristo, que vive y reina contigo y el Espíritu Santo, ahora y por siempre. Amén.`,

    advent2: `Bendito Señor, que hiciste que las Santas Escrituras se escribiesen para nuestra enseñanza; Concede que de tal manera las oigamos, las leamos, las consideremos, las aprendamos y las examinemos cuidadosamente, que podamos asimilarlas en nuestro interior, para que por medio de la paciencia, y del consuelo de tu santa Palabra, abracemos y conservemos hasta el fin, la esperanza bendita de la vida eterna, que Tú nos has dado en Jesucristo nuestro Salvador. Amén.`,

    advent3: `Oh Señor Jesucristo, que en tu primera venida enviaste tu mensajero a preparar tu camino delante de ti; Concede que los ministros y dispensadores de tus misterios preparen también, y dispongan tu camino, volviendo los corazones de los desobedientes a la sabiduría de los justos, para que en tu segunda venida a juzgar al mundo encuentres que somos un pueblo agradable a tus ojos; Tú que vives y reinas con el Padre y el Espíritu Santo siempre, Dios, por los siglos de los siglos. Amén.`,

    advent4: `Oh Señor, te rogamos que exaltes tu poder, y vengas a socorrernos con tu gran potencia y ya que por nuestros pecados y maldades nos hallamos abrumados e inhábiles para contender en la carrera que se nos propone, que tu gracia y tu misericordia abundantes prontamente nos libren y ayuden; mediante Jesucristo nuestro Señor, a quien, contigo y el Espíritu Santo, sean dadas honra y gloria eternamente. Amén.`,

    christmas: `Omnipotente Dios, que nos diste a tu unigénito Hijo para que tomase sobre sí nuestra naturaleza, y naciese en un tiempo como éste de una virgen pura; Concede, que siendo regenerados y hechos tus hijos por adopción y gracia, seamos cada día renovados con tu Santo Espíritu; mediante el mismo nuestro Señor Jesucristo, que vive y reina contigo y el mismo Espíritu siempre, Dios, por los siglos de los siglos. Amén.`,

    christmasSunday: `Omnipotente Dios, que nos diste a tu unigénito Hijo para que tomase sobre sí nuestra naturaleza, y naciese en un tiempo como éste de una virgen pura; Concede que siendo regenerados y hechos tus hijos por adopción y gracia, seamos cada día renovados con tu Santo Espíritu; mediante el mismo nuestro Señor Jesucristo, que contigo y el mismo Espíritu siempre es un solo Dios, y vive y reina por los siglos de los siglos. Amén.`,
    // «Segunda Domínica después de la Natividad»: el Misal le da colecta propia
    // (antes se repetía la de christmasSunday).
    christmasSunday2: `Dios Omnipotente, que has derramado sobre nosotros la nueva luz del Verbo encarnado; Concede que esa misma luz encendida en nuestros corazones pueda también brillar en nuestras vidas; mediante Jesucristo nuestro Señor. Amén.`,

    circumcision: `Dios Todopoderoso, que permitiste que tu bendito Hijo fuese circuncidado, y sujeto a la ley de los hombres; Otórganos la verdadera circuncisión del Espíritu; para que teniendo nuestros corazones y cuerpos mortificados para todo deseo mundano y carnal, te obedezcamos en todo y por todo según tu santa voluntad; mediante el mismo Jesucristo tu Hijo, nuestro Señor. Amén.`,

    epiphany: `Oh Dios, que por medio de una estrella manifestaste tu unigénito Hijo a los Gentiles; Concede por tu misericordia que nosotros que ahora te conocemos por medio de la fe, después de esta vida tengamos la fruición de tu Gloriosa Deidad; mediante Jesucristo nuestro Señor. Amén.`,

    // El Misal Anglicano 2013 no trae la fiesta del Bautismo del Señor: texto
    // anterior, sin verificar. Su domingo es, en el Misal, la «Primera Domínica
    // después de Epifanía» (colecta en epiphanySeason).
    baptismLord: `Oh Padre Eterno, que en el Bautismo de Jesús lo revelaste como tu Hijo, ungiéndolo con el Espíritu Santo; concede a todos los bautizados en su Nombre que, muriendo al pecado, resuciten a la justicia, y siendo sepultados con él en una muerte semejante a la suya, conozcan también el poder de su resurrección; que vive y reina contigo, en la unidad del mismo Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    // ── DESFASE DE EPIFANÍA (corregido) ─────────────────────────────────────
    // calendar.js reserva el PRIMER domingo después de la Epifanía para el
    // Bautismo del Señor y numera los siguientes epi1..epi5, titulándolos
    // «Segundo…Sexto Domingo después de Epifanía»; lectionary.js les asigna
    // coherentemente las lecturas del 2°…6°. Por eso epiN lleva la colecta del
    // (N+1)° domingo después de Epifanía del Misal:
    //   epi1 → 2ª   epi2 → 3ª   epi3 → 4ª   epi4 → 5ª   epi5 → 6ª
    // Barrido 2024-2060: epi5 («Sexto Domingo después de Epifanía») es el
    // máximo que el calendario puede emitir.
    epi1: `Omnipotente y Eterno Dios, que gobiernas todas las cosas en el cielo y en la tierra; Oye misericordiosamente las súplicas de tu pueblo, y concédenos tu paz todos los días de nuestra vida; mediante Jesucristo nuestro Señor. Amén.`,
    epi2: `Omnipotente y eterno Dios, mira misericordiosamente nuestra fragilidad, y en todos nuestros peligros y necesidades extiende tu diestra para ayudarnos y defendernos: mediante Jesucristo nuestro Señor. Amén.`,
    epi3: `Oh Dios, que sabes nos hallamos rodeados de tantos y tan grandes peligros, que a causa de la fragilidad de nuestra naturaleza no podemos estar siempre firmes en lo justo; Concédenos la fortaleza y la protección necesarias para sostenernos en todo peligro, y triunfar de toda tentación; mediante Jesucristo nuestro Señor. Amén.`,
    epi4: `Oh Señor, te suplicamos guardes continuamente a tu Iglesia y Familia en tu verdadera religión; para que quienes confían solo en la esperanza de tu gracia celestial, sean defendidos siempre por tu gran poder; mediante Jesucristo, nuestro Señor. Amén.`,
    epi5: `Oh Dios, cuyo bendito Hijo fué manifestado para que destruyese las obras del diablo, y nos hiciese hijos de Dios, y herederos de vida eterna; Concédenos, te suplicamos, que, teniendo esta esperanza, imitemos su pureza; para que cuando aparezca otra vez con poder y grande gloria, seamos hechos semejantes a El en su eterno y glorioso reino; donde contigo, oh Padre, y contigo, oh Espíritu Santo, El vive y reina siempre, Dios, por los siglos de los siglos. Amén.`,
    // Colecta de la «Primera Domínica después de Epifanía» del Misal. Su domingo
    // lo ocupa en calendar.js el Bautismo del Señor (que el Misal no trae), así
    // que se conserva como COLECTA DEL TIEMPO de la Epifanía: es el eslabón «del
    // tiempo» de la cadena de respaldo para cualquier feria o fiesta de Epifanía
    // sin colecta propia.
    epiphanySeason: `Oh Señor, suplicámoste que por tu gran clemencia recibas los ruegos de tu pueblo que te invoca; y concedas que conozca y comprenda lo que le es conveniente hacer, y que tu gracia y virtud le muevan a cumplirlo fielmente; mediante Jesucristo nuestro Señor. Amén.`,

    septuagesima: `Suplicámoste Señor, oigas benignamente los ruegos de tu pueblo; para que los que justamente somos castigados por nuestras culpas, seamos por tu bondad misericordiosamente librados, para gloria de tu Nombre; mediante Jesucristo nuestro Salvador, quien siendo un solo Dios contigo y el Espíritu Santo, vive y reina, por los siglos de los siglos. Amén.`,
    sexagesima: `Señor Dios, que conoces que no podemos confiar en nada de lo que hacemos; Otorga misericordiosamente, que seamos por tu poder librados de toda adversidad; mediante Jesucristo nuestro Señor. Amén.`,
    quinquagesima: `Oh Señor, que nos has enseñado que todas nuestras obras sin caridad son de ningún valor; de tal modo que los que viven sin ella están muertos para ti; Auxílianos con tu Espíritu Santo, y derrama en nuestros corazones el don excelentísimo de la caridad, que es el verdadero vínculo de la paz y de todas las virtudes. Haz esto por amor de tu Hijo único Jesucristo. Amén.`,

    ashWednesday: `Omnipotente y Eterno Dios, que no sientes aversión por nada de lo que has creado, y que perdonas a los que, con verdadera fe se arrepienten; Crea en nosotros contritos corazones, y concédenos perfecto perdón ¡oh Dios de toda misericordia! a los que lamentamos nuestros pecados y reconocemos nuestra miseria; por Jesucristo nuestro Señor. Amén.`,

    lent1: `Oh Señor, que por amor nuestro ayunaste cuarenta días y cuarenta noches; Concédenos que vivamos con tal abstinencia, que, estando nuestra carne sujeta al Espíritu, obedezcamos siempre tus divinas inspiraciones en verdadera justicia y santidad, para honra y gloria tuya, que siendo un solo Dios con el Padre y el Espíritu Santo, vives y reinas por los siglos de los siglos. Amén.`,
    lent2: `Dios Todopoderoso, que sabes bien que no hay en nosotros poder alguno para defendernos; Guárdanos exteriormente en nuestros cuerpos, e interiormente en nuestras almas; para que seamos librados de todas las adversidades que puedan molestar al cuerpo, y de los malos pensamientos que puedan ofender y dañar al alma; por Jesucristo nuestro Señor. Amén.`,
    lent3: `Te suplicamos, Omnipotente Dios, que atiendas a los vivos deseos de tus humildes siervos, y extiendas la diestra de tu Majestad, para que sea nuestra defensa contra todos nuestros enemigos; mediante Jesucristo nuestro Señor. Amén.`,
    lent4: `Concede, suplicámoste, Omnipotente Dios, que aunque por nuestras malas obras merecemos, en justicia, ser castigados, por tu gracia misericordiosa obtengamos el perdón; mediante nuestro Señor y Redentor Jesucristo. Amén.`,
    lent5: `Suplicámoste, Omnipotente Dios, que mires misericordiosamente a tu pueblo; para que por tu gran bondad sea gobernado y preservado siempre, en cuerpo y alma; mediante Jesucristo nuestro Señor. Amén.`,

    palmSunday: `Dios Eterno y Todopoderoso, que, por tu tierno amor al género humano, enviaste a tu Hijo, nuestro Salvador Jesucristo, a revestirse con nuestra carne, y a sufrir muerte en la cruz, para que todo el género humano siguiese el ejemplo de su grande humildad; Concédenos, por tu misericordia, que imitemos el dechado de su paciencia, y seamos partícipes de su resurrección; mediante el mismo Jesucristo nuestro Señor. Amén.`,

    mondayHolyWeek: `Dios Todopoderoso, cuyo muy querido Hijo tuvo que padecer antes de subir al cielo, y ser crucificado antes de entrar en la gloria; Concede misericordiosamente que nosotros siguiendo la vía de la cruz, comprendamos que ella es la senda de vida y paz; mediante el mismo tu Hijo Jesucristo nuestro Señor. Amén.`,

    tuesdayHolyWeek: `Oh Señor Dios, cuyo bendito Hijo, nuestro Salvador, entregó sus espaldas a los sayones y no escondió su rostro ante la ignominia; Concédenos gracia para aceptar resignadamente los sufrimientos de esta vida, en la completa seguridad de la gloria que ha de ser revelada; mediante el mismo tu Hijo Jesucristo nuestro Señor. Amén.`,

    wednesdayHolyWeek: `Asístenos misericordiosamente con tu ayuda, Oh Señor Dios de nuestra salvación; para que podamos dedicarnos con gozo a la meditación de estos grandiosos acontecimientos, por medio de los cuales nos has dado vida e inmortalidad; mediante Jesucristo nuestro Señor. Amén.`,

    maundyThursday: `Padre Omnipotente, cuyo querido Hijo, en la noche antes de padecer, instituyó el Sacramento de su Cuerpo y Sangre; Concede misericordiosamente que podamos recibir con gratitud este Sacramento en memoria de El, que en estos santos misterios nos da una prenda de vida eterna; por el mismo tu Hijo Jesucristo nuestro Señor, que contigo y el Espíritu Santo es un solo Dios y vive y reina ahora y por los siglos de los siglos. Amén.`,

    holySaturday: `Concede, oh Señor, que los que estamos bautizados en la muerte de tu bendito Hijo, nuestro Salvador Jesucristo, podamos ser sepultados con El por la continua mortificación de nuestras malas inclinaciones; para que, después de pasar por el sepulcro y las puertas de la muerte, lleguemos a una resurrección llena de alegría; por los méritos del que murió, fué sepultado y resucitó por nosotros, tu Hijo Jesucristo nuestro Señor. Amén.`,

    easter: `Dios Todopoderoso, que por tu unigénito Hijo Jesucristo triunfaste de la muerte, y nos abriste la puerta de la vida eterna; Suplicámoste humildemente que, así como por medio de tu gracia especial, nos inspiras buenos deseos, así también con tu continuo auxilio podamos llevarlos a debido efecto; mediante Jesucristo nuestro Señor, que contigo y el Espíritu Santo es siempre un solo Dios, que vive y reina por los siglos de los siglos. Amén.`,

    easterFeria1_1: `Oh Dios, cuyo bendito Hijo se manifestó a sus discípulos al partir el pan; Abre, te suplicamos, los ojos de nuestra fe, para que podamos reconocerte en todas tus obras; mediante el mismo tu Hijo Jesucristo nuestro Señor. Amén.`,

    easterFeria1_2: `Concede, te suplicamos, Dios Todopoderoso, que los que celebramos con reverencia la fiesta de Pascua, seamos dignos de alcanzar el gozo eterno; mediante Jesucristo nuestro Señor. Amén.`,

    easter2: `Padre Omnipotente, que diste a tu Hijo unigénito para morir por nuestros pecados, y resucitar para nuestra justificación; Concede que apartando de nosotros la levadura de malicia e iniquidad, te sirvamos siempre en pureza de vida y verdad; por los méritos del mismo tu Hijo Jesucristo nuestro Señor. Amén.`,
    easter3: `Dios Todopoderoso, que nos has dado a tu único Hijo para que sea sacrificio por el pecado, y dechado de santidad de vida; Danos gracia para que recibamos este inestimable beneficio con perpetuo agradecimiento, y que nos esforcemos cada día a seguir los sagrados pasos de su santísima vida; mediante el mismo Jesucristo nuestro Señor. Amén.`,
    easter4: `Dios Todopoderoso, que manifiestas la luz de tu verdad a los que se hallan en error, para que puedan volver al camino de la justicia; Concede que todos los que son recibidos en la comunión de la Fe Cristiana, eviten todo lo que es contrario a su profesión, y sigan lo que es conforme a ella; mediante nuestro Señor Jesucristo. Amén.`,
    easter5: `Dios Todopoderoso, que eres el único que puede gobernar las voluntades y afectos rebeldes de los pecadores; Concede a tu pueblo la gracia de que ame tus mandatos, y aspire a tus promesas; para que de este modo, en medio de los varios y numerosos acontecimientos y mudanzas de este mundo, nuestras almas miren hacia la sola mansión de la verdadera felicidad; mediante Jesucristo nuestro Señor. Amén.`,
    easter6: `Oh Señor, de quien procede todo lo bueno; Concede a tus humildes siervos, que por medio de tu santa inspiración pensemos en lo bueno, y por tu dirección misericordiosa lo ejecutemos; mediante nuestro Señor Jesucristo. Amén.`,

    ascension: `Otórganos, suplicámoste, oh Dios Omnipotente, que así como creemos que tu unigénito Hijo Jesucristo nuestro Señor subió a los cielos; así también ascendamos allá con nuestro corazón y nuestra mente, y habitemos siempre con El, quien contigo, y el Espíritu Santo es un solo Dios, y vive y reina por los siglos de los siglos. Amén.`,

    easter7: `Oh Dios, Rey de la Gloria, que exaltaste con gran triunfo a Jesucristo tu único Hijo a tu reino celestial; Suplicámoste que no nos dejes desconsolados; antes bien auxílianos con tu Santo Espíritu, para que nos consuele, y dirija al mismo lugar adonde nuestro Salvador Cristo nos ha precedido; quien contigo, y el mismo Espíritu Santo, es un solo Dios, que vive y reina por los siglos de los siglos. Amén.`,

    pentecost: `Oh Dios, que como en un tiempo como éste instruíste los corazones de tus fieles, enviándoles la luz de tu Espíritu Santo; Concédenos por medio del mismo Espíritu un juicio acertado en todo, y el gozo constante en su santo consuelo; por los méritos de Cristo Jesús nuestro Salvador, que vive y reina, en unidad contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    pentecostFeria_1: `Envía, te suplicamos, Omnipotente Dios, tu Santo Espíritu a nuestros corazones, a fin de que pueda dirigirnos y gobernarnos según tu voluntad, consolarnos en todas nuestras aflicciones, defendernos de todo error, y guiarnos a toda verdad; mediante Jesucristo nuestro Señor, quien contigo y el mismo Espíritu Santo es un solo Dios, que vive y reina por los siglos de los siglos. Amén.`,

    pentecostFeria_2: `Concede, te suplicamos, Dios misericordioso, que tu Iglesia, siendo congregada en unidad por tu Santo Espíritu, pueda manifestar tu poder entre todas las naciones, para gloria de tu nombre; mediante Jesucristo nuestro Señor, quien contigo y el mismo Espíritu es un solo Dios, que vive y reina por los siglos de los siglos. Amén.`,

    trinity: `Dios Omnipotente y Eterno, que has concedido a tus siervos la gracia de reconocer, por la confesión de la verdadera fe, la gloria de la Eterna Trinidad, y en el poder de la Majestad Divina adorar la Unidad; Te suplicamos nos conserves firmes en esta fe, y nos defiendas siempre de toda adversidad, Tú que vives y reinas, un solo Dios, por los siglos de los siglos. Amén.`,

    corpusChristi: `Oh Dios que bajo un Sacramento admirable, nos dejaste el memorial de tu Pasión; Pedímoste, Señor, nos concedas celebrar de tal manera los Sagrados Misterios de tu Cuerpo y Sangre que sintamos constantemente en nosotros el fruto de tu Redención. Que vives y reinas. Amén.`,

    sacredHeart: `Oh Dios, que te dignas prodigarnos misericordiosamente los infinitos tesoros de tu amor en el Corazón de tu Hijo herido por nuestros pecados. Te pedimos nos concedas que, al ofrecerle el devoto obsequio de nuestra piedad, cumplamos con el deber de una digna reparación. Por el mismo Jesucristo Nuestro Señor. Amén.`,

    trinity1: `Oh Dios que eres la fortaleza de cuantos ponen su confianza en ti; Recibe misericordiosamente nuestras súplicas; y puesto que a causa de la fragilidad de nuestra naturaleza mortal nada bueno podemos hacer sin ti, concédenos el auxilio de tu gracia, para que guardando tus mandamientos podamos agradarte tanto de corazón como de obra; mediante Jesucristo nuestro Señor. Amén.`,
    trinity2: `Oh Señor, que nunca dejas de ayudar y dirigir a los que enseñas a amarte y reverenciarte; Consérvanos, suplicámoste, bajo el amparo de tu benigna providencia, y haz que amemos y reverenciemos sin cesar tu Santo Nombre; mediante Jesucristo nuestro Señor. Amén.`,
    trinity3: `Oh Señor, suplicámoste nos oigas misericordiosamente; y concedas a los que nos has dado un ferviente deseo de orar, que por tu poderoso auxilio seamos defendidos y consolados en todos los peligros y adversidades; por Jesucristo nuestro Señor. Amén.`,
    trinity4: `Oh Dios, defensor de los que en ti confían, sin quien nada es fuerte, nada santo; Acrecienta y multiplica tu misericordia para con nosotros; a fin de que siendo Tú nuestro director y guía, pasemos de tal modo por las cosas temporales, que no perdamos finalmente las eternas. Concédenos esto, ¡oh! Padre celestial, por amor de Jesucristo nuestro Señor. Amén.`,
    trinity5: `Concede, oh Señor, te suplicamos, que el curso de este mundo sea tan pacíficamente ordenado por tu poder, que tu Iglesia pueda servirte alegremente en completa y piadosa tranquilidad; mediante Jesucristo nuestro Señor. Amén.`,
    trinity6: `Oh Dios, que has preparado para los que te aman cosas tan buenas que sobrepasan la inteligencia humana; Infunde en nuestros corazones tal amor hacia ti, que amándote sobre todas las cosas logremos tus promesas, que exceden a cuanto podamos desear; por Jesucristo nuestro Señor. Amén.`,
    trinity7: `Oh Señor de todo poder y fuerza, Autor y Dador de todo bien; Injerta en nuestros corazones el amor a tu Nombre, aumenta en nosotros la verdadera religión, nútrenos de toda bondad, y por tu gran misericordia guárdanos en la misma; mediante Jesucristo nuestro Señor. Amén.`,
    trinity8: `Oh Dios, cuya infalible providencia ordena todas las cosas en el cielo y en la tierra; Suplicámoste humildemente, que te dignes apartar de nosotros todas las cosas nocivas, y otorgarnos las que sean provechosas; mediante Jesucristo nuestro Señor. Amén.`,
    trinity9: `Suplicámoste, Señor, nos concedas, el espíritu de pensar y hacer siempre lo que es justo; para que nosotros, que sin ti nada bueno podemos hacer, seamos por ti capaces de vivir según tu santa voluntad; mediante Jesucristo nuestro Señor. Amén.`,
    trinity10: `Escucha, oh Señor, las oraciones de tus humildes siervos; y, para que puedan obtener sus peticiones, haz que pidan las cosas que sean de tu agrado; mediante Jesucristo nuestro Señor. Amén.`,
    trinity11: `Oh Dios, que manifiestas tu poder supremo principalmente mostrando piedad y misericordia; Concédenos misericordiosamente tu gracia en tal medida que siguiendo el camino de tus mandamientos, logremos tus bondadosas promesas, y seamos partícipes de tu tesoro celestial; por Jesucristo nuestro Señor. Amén.`,
    trinity12: `Omnipotente y eterno Dios, que estás siempre más dispuesto para oírnos que nosotros para pedirte, y que acostumbras darnos más de lo que deseamos y merecemos; Derrama sobre nosotros la abundancia de tu misericordia; perdonándonos todo aquello por lo que nuestras conciencias están temerosas, y dándonos las cosas buenas que no somos dignos de pedirte, sino por los méritos y mediación de Jesucristo, tu Hijo, nuestro Señor. Amén.`,
    trinity13: `Dios Omnipotente y misericordioso, de quien solamente proviene el don de que tu pueblo fiel sea capaz de servirte sincera y laudablemente; Suplicámoste nos concedas que podamos servirte tan fielmente en esta vida, que obtengamos al fin tus promesas celestiales; por los méritos de Jesucristo nuestro Señor. Amén.`,
    trinity14: `Poderoso y Eterno Dios, danos el aumento de la fe, de la esperanza y de la caridad; y, para que obtengamos lo que prometes, haz que amemos lo que mandas; mediante Jesucristo nuestro Señor. Amén.`,
    trinity15: `Suplicámoste, oh Señor, que con tu perpetua misericordia guardes a tu Iglesia; y puesto que la fragilidad humana sin ti no puede menos que caer, defiéndenos siempre con tu auxilio de cuanto nos pueda dañar, y dirígenos a cuanto conduzca a nuestra salvación; mediante Jesucristo nuestro Señor. Amén.`,
    trinity16: `Oh Señor, te suplicamos, que con tu continua piedad purifiques y defiendas a tu Iglesia; y, por cuanto ella no puede continuar en seguridad sin tu socorro, presérvala siempre con tu ayuda y bondad; mediante Jesucristo nuestro Señor. Amén.`,
    trinity17: `Señor, suplicámoste, que tu gracia nos prevenga y acompañe siempre, haciendo que nos empleemos continuamente en buenas obras; mediante Jesucristo nuestro Señor. Amén.`,
    trinity18: `Señor, te suplicamos, concedas gracia a tu pueblo para resistir las tentaciones del mundo, de la carne y del diablo, y para seguirte con corazones y ánimos puros, a ti el único Dios; mediante Jesucristo nuestro Señor. Amén.`,
    trinity19: `Oh Dios, puesto que sin ti no podemos complacerte; Concede misericordiosamente, que tu Santo Espíritu dirija y gobierne nuestros corazones en todas las cosas; mediante Jesucristo nuestro Señor. Amén.`,
    trinity20: `Dios Omnipotente y muy misericordioso, suplicámoste que por tu generosa bondad nos preserves de todas las cosas que puedan hacernos daño; para que, estando dispuestos en cuerpo y alma cumplamos alegremente con todo lo que mandas; por Jesucristo nuestro Señor. Amén.`,
    trinity21: `Suplicámoste, oh misericordioso Señor, que concedas a tus fieles perdón y paz, para que sean limpios de todos sus pecados, y te sirvan con ánimo tranquilo; mediante Jesucristo nuestro Señor. Amén.`,
    trinity22: `Señor, te suplicamos, conserves a tu familia, la Iglesia, en continua piedad; para que por tu protección esté libre de todas las adversidades, y se consagre devotamente a servirte con buenas obras, para gloria de tu Nombre; por Jesucristo nuestro Señor. Amén.`,
    trinity23: `Oh Dios, nuestro refugio y fortaleza, que eres autor de toda piedad; Te suplicamos que estés siempre dispuesto a escuchar los humildes ruegos de tu Iglesia, y a conceder que lo que te pedimos con verdadera fe, lo obtengamos efectivamente; mediante Jesucristo nuestro Señor. Amén.`,
    trinity24: `Oh Señor, suplicámoste, que absuelvas a tu pueblo de sus ofensas; para que por tu benignidad seamos libres de las ataduras de los pecados, que por nuestra fragilidad hemos cometido. Concédenos esto, ¡oh Padre Celestial!, por amor de Jesucristo nuestro bendito Señor y Salvador. Amén.`,
    // «Domínica antes de Adviento» del Misal. OJO: el Misal manda, en los años con
    // 26 o 27 domingos después de la Trinidad, decir en el 25° (y 26°) el Oficio de
    // la 6ª (y 5ª) Domínica después de Epifanía, y reservar esta colecta para el
    // último domingo del año. Como la clave trinityN no sabe cuántos domingos tiene
    // el año, aquí queda solo en trinity25: aplicar la rúbrica exige que calendar.js
    // o app.js pasen el total de domingos del año (pendiente de decisión).
    trinity25: `Te suplicamos, ¡oh Señor! muevas la voluntad de tu pueblo fiel, y concédele para que produciendo abundantemente los frutos de buenos obras, reciba de ti abundante premio; mediante Jesucristo nuestro Señor. Amén.`,
    // trinity26-28: texto anterior, NO figura en el Misal Anglicano 2013 (su
    // «Fiesta de Cristo Rey» trae otra colecta). Se conserva sin verificar.
    trinity26: `Oh Señor Jesucristo, que eres el Rey de reyes y Señor de señores; concede que todos los reinos de este mundo sean el reino de nuestro Señor y de su Cristo; para que bajo tu suave yugo todas las naciones encuentren su verdadera paz, y así te rindan el homenaje de sus corazones y sus vidas; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    // 27°/28° Domingo después de la Trinidad: solo ocurren cuando Pascua cae muy
    // temprano (p.ej. 2035, 2046, 2062). Se repite aquí el texto de trinity26.
    trinity27: `Oh Señor Jesucristo, que eres el Rey de reyes y Señor de señores; concede que todos los reinos de este mundo sean el reino de nuestro Señor y de su Cristo; para que bajo tu suave yugo todas las naciones encuentren su verdadera paz, y así te rindan el homenaje de sus corazones y sus vidas; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,
    trinity28: `Oh Señor Jesucristo, que eres el Rey de reyes y Señor de señores; concede que todos los reinos de este mundo sean el reino de nuestro Señor y de su Cristo; para que bajo tu suave yugo todas las naciones encuentren su verdadera paz, y así te rindan el homenaje de sus corazones y sus vidas; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    // Colectas de fiestas fijas. Fuente única: commemorations.js (SAINT_COLLECTS)
    // las deriva de aquí cuando la fiesta se conmemora. 03-19, 09-14 y 11-02 NO
    // figuran en el Misal Anglicano 2013 y conservan su texto anterior.
    // 06-29: el Misal solo trae la colecta de San Pedro (29 de junio).
    '02-02': `Omnipotente y Eterno Dios, humildemente suplicamos a tu Majestad, que, como tu unigénito Hijo fué en un tiempo como éste presentado en el templo en la substancia de nuestra carne, así seamos presentados a ti con corazones puros y limpios; por el mismo tu Hijo Jesucristo nuestro Señor. Amén.`,
    '02-24': `Dios Omnipotente, que escogiste en lugar de Judas el traidor, a tu fiel siervo Matías, para que fuese contado entre los doce Apóstoles; Concede que tu Iglesia preservada siempre de falsos apóstoles, sea gobernada y dirigida por fieles, y verdaderos pastores; mediante Jesucristo nuestro Señor. Amén.`,
    '03-19': `Oh Dios, que escogiste al bienaventurado José para ser esposo de tu Santísima Madre; concédenos, te suplicamos, que así como la veneramos como nuestro protector en la tierra, así merezcamos tenerle como intercesor en los cielos; que vive y reina contigo, por los siglos de los siglos. Amén.`,
    '03-25': `Suplicámoste, oh Señor, difundas tu gracia en nuestros corazones; para que como por el mensaje de un ángel hemos conocido la Encarnación de tu Hijo Jesucristo, así por su cruz y pasión seamos llevados a la gloria de su Resurrección; mediante el mismo Jesucristo nuestro Señor. Amén.`,
    '04-25': `Dios Todopoderoso, que has instruído a tu Santa Iglesia con la celestial doctrina de tu Evangelista San Marcos; Danos gracia para que no seamos como niños movidos por cualquier soplo de vana doctrina, sino que permanezcamos firmes en la verdad de tu Santo Evangelio; mediante Jesucristo nuestro Señor. Amén.`,
    '05-01': `Dios Todopoderoso, a quien conocer verdaderamente es vida eterna; Concede que conozcamos perfectamente que tu Hijo Jesucristo es el camino, la verdad y la vida; para que, siguiendo los pasos de tus Santos Apóstoles, San Felipe y Santiago, recorramos con perseverancia el camino que conduce a la vida eterna; mediante el mismo tu Hijo Jesucristo nuestro Señor. Amén.`,
    '06-11': `Oh Señor Dios Todopoderoso, que investiste a tu Santo Apóstol Bernabé con dones excelentes del Espíritu Santo; No permitas que seamos desprovistos de la abundancia de tus dones, ni de la gracia de usarlos para tu honra y gloria; mediante Jesucristo nuestro Señor. Amén.`,
    '06-24': `Dios Todopoderoso, por cuya providencia tu siervo Juan Bautista nació milagrosamente, y fué enviado a preparar el camino de tu Hijo, nuestro Salvador, predicando el arrepentimiento; Concede que sigamos de tal manera su santa vida y doctrina, que de acuerdo con su predicación nos arrepintamos verdaderamente; y que a ejemplo suyo hablemos la verdad constantemente, reprochemos con denuedo los vicios y suframos con toda paciencia por causa de la verdad; mediante Jesucristo nuestro Señor. Amén.`,
    '06-29': `Dios Todopoderoso, que por tu Hijo Jesucristo dotaste de excelentes dones a tu Apóstol San Pedro, y le ordenaste apacentar con todo empeño tu rebaño; Te suplicamos que concedas a todos los obispos y pastores la gracia de predicar diligentemente tu santa palabra, y al pueblo el deseo de cumplirla obedientemente, a fin de que pueda recibir la corona de la gloria eterna; mediante Jesucristo nuestro Señor. Amén.`,
    '07-25': `Oh Dios misericordioso, concede, que como tu Apóstol Santiago, dejando a su padre y todo lo que tenía, sin tardanza alguna obedeció el llamamiento de tu Hijo Jesucristo, y le siguió; así nosotros abandonemos nuestros afectos mundanos y carnales y estemos siempre dispuestos a seguir tus santos mandamientos; mediante Jesucristo nuestro Señor. Amén.`,
    '08-06': `Oh Dios, que en el monte revelaste ante escogidos testigos a tu unigénito Hijo maravillosamente transfigurado, con vestiduras blancas y resplandecientes; Concede misericordiosamente que, siendo libertados de las inquietudes de este mundo, podamos contemplar al Rey en toda su hermosura, quien contigo, Oh Padre, y contigo, Oh Espíritu Santo, es un solo Dios, que vive y reina, por los siglos de los siglos. Amén.`,
    '08-15': `Oh Dios Eterno, que en este día tomaste para ti a la Bienaventurada Virgen María, Madre de tu Hijo único: Concede que nosotros los redimidos por la sangre del Cristo, seamos partícipes de la gloria de su madre en el reino eterno; por Jesucristo tu Hijo, Nuestro Señor, que vive y reina contigo y el Espíritu Santo, un solo Dios, ahora y por siempre. Amén.`,
    '08-24': `Dios Eterno y Todopoderoso, que concediste a tu Apóstol Bartolomé la gracia de creer verdaderamente y predicar tu Palabra; Te suplicamos concedas a tu Iglesia, que ame esa misma Palabra, la reciba y la predique; mediante Jesucristo nuestro Señor. Amén.`,
    '09-08': `Dios Todopoderoso, que revestiste de gracia a la Bendita Virgen María, la Madre de nuestro Señor: Te suplicamos que santifiques nuestros cuerpos en la pureza, y nuestras almas en la humildad y el amor. Por el mismo Jesucristo nuestros Señor y Salvador. Amén.`,
    '09-14': `Oh Dios, que en la Exaltación de la Santa Cruz quisiste alejar de nosotros la antigua herida del maligno; concede que, gozando de la gracia de su redención en este mundo, nos sea dada la salvación eterna en el cielo; por Jesucristo nuestro Señor. Amén.`,
    '09-21': `Oh Todopoderoso Dios, que por la boca de tu bendito Hijo llamaste a San Mateo, del banco de los tributos, para que de publicano se convirtiese en Apóstol y Evangelista; Danos gracia para renunciar a toda avaricia, y desordenado deseo de riquezas, y para seguir al mismo Jesucristo tu Hijo, que en unidad del Espíritu Santo vive y reina contigo eternamente. Amén.`,
    '09-29': `Oh Dios Eterno, que has ordenado y constituido los servicios de los Angeles y de los hombres en orden maravilloso; Otorga misericordiosamente que, como tus santos Angeles te sirven siempre en el cielo, así, por tu mandato, nos socorran y defiendan en la tierra; mediante Jesucristo nuestro Señor. Amén.`,
    '10-18': `Omnipotente Dios, que inspiraste a tu siervo San Lucas el Médico, a manifestar en el Evangelio el amor y el poder sanativo de tu Hijo; Demuestra en tu Iglesia el mismo poder y amor, para salud de nuestros cuerpos y salvación de nuestras almas; mediante tu Hijo Jesucristo nuestro Señor. Amén.`,
    '10-28': `Dios Todopoderoso, que edificaste tu Iglesia sobre el fundamento de los Apóstoles y Profetas, siendo Jesucristo la principal piedra angular; Concede que estemos tan estrechamente unidos en espíritu, por medio de su doctrina, que seamos hechos un templo santo y aceptable a ti; mediante Jesucristo, nuestro Señor. Amén.`,
    '11-30': `Dios Todopoderoso, que por tu gracia hiciste que tu Santo Apóstol Andrés obedeciese prestamente al llamamiento de tu Hijo Jesucristo, y a El siguiese sin dilación alguna; Danos también gracia a todos nosotros, para que, siendo llamados por tu santa Palabra, nos entreguemos sin tardanza a cumplir obedientemente tus santos mandamientos; mediante el mismo Jesucristo nuestro Señor. Amén.`,
    '12-21': `Dios Eterno y Todopoderoso, que, para mayor confirmación de la fe, permitiste que tu Apóstol Santo Tomás dudase de la resurrección de tu Hijo; Concede que creamos tan indubitable y perfectamente en tu Hijo Jesucristo, que nuestra fe ante ti sea irreprensible. Óyenos oh Señor; mediante el mismo Jesucristo, a quién contigo y el Espíritu Santo, sea todo honor y gloria ahora y por siempre. Amén.`,
    '12-26': `Concede, oh Señor, que, en todos nuestros padecimientos aquí en la tierra por atestiguar tu verdad, fijemos nuestra vista en el Cielo, y por medio de la fe contemplemos la gloria que nos ha de ser revelada; y que, llenos del Espíritu Santo, aprendamos a amar y bendecir a nuestros perseguidores, según el ejemplo de tu primer Mártir San Esteban, quien te rogó por sus verdugos, oh bendito Jesús, Tú que estás a la diestra de Dios para socorrer a todos los que sufren por ti, nuestro solo Mediador y Abogado. Amén.`,
    '12-27': `Misericordioso Señor, te suplicamos que derrames sobre tu Iglesia los brillantes rayos de tu luz, para que, siendo iluminada con la doctrina de tu bendito Apóstol y Evangelista San Juan, camine de tal modo a la luz de tu verdad, que finalmente alcance la vida celestial; mediante Jesucristo nuestro Señor. Amén.`,
    '12-28': `Omnipotente Dios, que por boca de los pequeñuelos y de los niños de pecho fundaste la fortaleza e hiciste que los parvulitos te glorificaran con su muerte; Mortifica y destruye en nosotros todo género de vicios y fortalécenos con tu gracia, para que por la inocencia de nuestras vidas, y por la constancia de nuestra fe aun hasta la muerte, glorifiquemos tu Santo Nombre; mediante Jesucristo nuestro Señor. Amén.`,
    '11-01': `Dios Todopoderoso, que en el cuerpo místico de tu Hijo, Cristo nuestro Señor, has reunido a todos tus escogidos en una sola comunión y hermandad; Danos gracia para que imitemos a tus benditos santos en toda virtuosa y santa vida, y que lleguemos a los indecibles gozos que tú has preparado para los que te aman sinceramente; mediante Jesucristo nuestro Señor. Amén.`,
    '11-02': `Oh Dios misericordioso, Padre de nuestro Señor Jesucristo, que es la resurrección y la vida; te suplicamos humildemente, oh Padre, que nos resucites de la muerte del pecado a la vida de la justicia; para que cuando partamos de esta vida, descansemos en él; y que en la resurrección general del último día seamos hallados aceptos ante tus ojos; por Jesucristo nuestro Señor. Amén.`,
    // requiem, holySpirit y bvm: no están en la sección «COLECTAS» del Misal 2013
    // (solo trae una «Colecta General de la Bendita Virgen María» con un hueco
    // para la advocación, y colectas de entierro). Texto anterior, sin verificar.
    requiem: `Oh Dios, Creador y Redentor de todos los fieles, concede a las almas de tus siervos y siervas la remisión de todos sus pecados; para que, mediante nuestras piadosas súplicas, obtengan el perdón que siempre han deseado; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,
    holySpirit: `Oh Dios, que iluminaste los corazones de tus fieles con la luz del Espíritu Santo; concédenos que por el mismo Espíritu saboreemos la rectitud y nos gocemos siempre en su consuelo; por Jesucristo nuestro Señor, que vive y reina contigo, en la unidad del mismo Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,
    bvm: `Te suplicamos, Señor, que derrames tu gracia en nuestras almas; para que los que hemos conocido, por el anuncio del ángel, la Encarnación de tu Hijo Jesucristo, por su Pasión y su Cruz seamos llevados a la gloria de su Resurrección; por el mismo Jesucristo nuestro Señor. Amén.`,
  };

  // Octava de la Ascensión. El Misal manda decir la colecta de la Ascensión
  // «durante la Octava»; son los mismos días a los que PREFACE_BY_KEY da el
  // Prefacio de la Ascensión y canon.js el Communicantes de la Ascensión. Antes
  // llevaban la colecta del domingo precedente (Rogación o Domínica después de
  // la Ascensión).
  const ASCENSION_OCTAVE_KEYS = ['easterFeria6_5', 'easterFeria6_6', 'easterFeria7_1',
    'easterFeria7_2', 'easterFeria7_3', 'easterFeria7_4', 'easterFeria7_5'];
  ASCENSION_OCTAVE_KEYS.forEach(k => { COLLECTS[k] = COLLECTS.ascension; });

  // ══════════════════════════════════════════════════════════════════════════
  //  PREFACIOS PROPIOS
  // ══════════════════════════════════════════════════════════════════════════
  // FUENTE: Misal Anglicano 2013 (Sociedad Sacerdotal Corpus Christi), sección
  // «PREFACIOS PROPIOS (Del libro de Oración Común de 1928)», l. 3403-3617, y
  // «LA GRAN PLEGARIA EUCARÍSTICA», l. 3622-3654 (numeración de la herramienta
  // Read sobre misal_utf8.txt). Textos transcritos tal como los imprime el Misal,
  // con su ortografía («El» sin tilde, «substancia», mayúsculas tras punto y coma);
  // solo se corrigieron artefactos de extracción (palabras partidas por el salto de
  // línea: «enseñar les», «presidir lo»; tilde perdida: «cesó»). Texto sospechoso
  // que se deja COMO LO IMPRIME el Misal: «nos da la virtud» (Cuaresma, probable
  // «nos das»), «cambia más no termina» (Difuntos, probable «mas»).
  //
  // ESTRUCTURA DEL MISAL: tras el Sursum corda el celebrante dice la APERTURA fija
  // («Es verdaderamente digno, justo y de nuestro deber… Omnipotente y eterno
  // Dios.»), después el prefacio propio («Aquí se dirá el prefacio Propio según el
  // tiempo o la fiesta») y cierra con «Por tanto, con los Ángeles y Arcángeles…»
  // (cada prefacio propio termina en el Misal con «Por tanto, con Ángeles, etc.»).
  // framed() arma el texto completo apertura + cláusula propia + cierre; así el
  // Misal, el Librito y el Word imprimen lo mismo sin tocar canon.js (cuyo Sursum
  // corda termina en «Es justo y necesario» y no se modifica).
  // El Prefacio Común (más abajo) NO es del Misal y trae su propia apertura y cierre.
  const PREFACE_OPENING = `Es verdaderamente digno, justo y de nuestro deber, que en todo tiempo y en todo lugar, te demos gracias, oh Señor, Santo Padre, Omnipotente y eterno Dios.`;
  const PREFACE_CLOSING = `Por tanto, con los Ángeles y Arcángeles, y con toda la compañía del cielo, alabamos y magnificamos tu glorioso Nombre; ensalzándote siempre y diciendo:`;
  const framed = (title, proper) => ({ title, intro: `${PREFACE_OPENING} ${proper} ${PREFACE_CLOSING}` });
  const bvmPreface = (phrase) => framed('Prefacio de la Bienaventurada Virgen María',
    `Y alabar, bendecir y proclamar tu gloria ${phrase} de Santa María, siempre Virgen; porque ella concibió a tu único hijo por obra del Espíritu Santo, y sin perder la gloria de su virginidad, derramó sobre el mundo la luz eterna, Jesucristo Nuestro Señor.`);
  const PREFACES = {
    // Prefacio Común. NO es del Misal: el Misal no trae un prefacio «común» sino
    // los tres «De Dios Padre / Hijo / Espíritu Santo» (ver MISSING_TEXTS). Es el
    // texto romano que el proyecto ya tenía; lleva su propia apertura y cierre.
    common: {
      title: 'Prefacio Común',
      text: `En verdad es justo y necesario, es nuestro deber y salvación, darte gracias siempre y en todo lugar, Señor, Padre Santo, Dios Todopoderoso y Eterno. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
      intro: `En verdad es justo y necesario, es nuestro deber y salvación, darte gracias siempre y en todo lugar, Señor, Padre Santo, Dios Todopoderoso y Eterno. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    // Misal 2013, PREFACIO DE ADVIENTO, l. 3494-3499
    advent: framed('Prefacio de Adviento', `Porque enviaste a tu amado Hijo para redimirnos del pecado y de la muerte, y para hacernos en él herederos de la vida eterna; para que, cuando vuelva en poder y gran triunfo a juzgar el mundo, nos gocemos contemplando su manifestación, sin temor ni vergüenza.`),
    // Misal 2013, NAVIDAD, l. 3421-3428
    christmas: framed('Prefacio de la Natividad', `Porque nos diste a tu Hijo único, Jesucristo, para que naciese por nosotros en un tiempo como éste; Quien, por obra del Espíritu Santo, fue hecho verdadero hombre, de la substancia de su bendita madre, la Virgen María; y esto sin mancha de pecado, para que nos limpiase de todo pecado.`),
    // Misal 2013, EPIFANÍA, l. 3431-3435
    epiphany: framed('Prefacio de la Epifanía', `Por Jesucristo nuestro Señor; Quien, en la substancia de nuestra carne mortal, manifestó su gloria; para poder traernos de las tinieblas a su luz gloriosa.`),
    // Misal 2013, PURIFICACIÓN, ANUNCIACIÓN Y TRANSFIGURACIÓN, l. 3436-3442
    incarnationWord: framed('Prefacio de la Purificación, la Anunciación y la Transfiguración', `Porque en el Misterio del Verbo hecho carne, creaste nueva luz para iluminar nuestros corazones, y darnos el conocimiento de tu gloria en la faz de tu Hijo, Jesucristo nuestro Señor.`),
    // Misal 2013, CUARESMA, l. 3483-3486
    lent: framed('Prefacio de Cuaresma', `Que por el ayuno corporal refrenas nuestras pasiones, elevas nuestra mente y espíritu, nos da la virtud y el premio, por Jesucristo nuestro Señor.`),
    // Misal 2013, PREFACIO DE SEMANA SANTA, l. 3489-3493
    holyWeek: framed('Prefacio de Semana Santa', `Por nuestro Señor Jesucristo. Por nuestros pecados fue levantado sobre la cruz, para que pudiera atraer hacia él a todo el mundo; y, por su sufrimiento y muerte, llegó a ser la fuente de salvación eterna para cuantos confían en él.`),
    // Misal 2013, PASCUA DE RESURRECCIÓN, l. 3443-3450
    easter: framed('Prefacio de Pascua', `Más principalmente estamos obligados a bendecirte por la gloriosa Resurrección de tu Hijo Jesucristo nuestro Señor: porque El es el verdadero Cordero Pascual, que se ofreció por nosotros, y ha quitado los pecados del mundo; El que por su muerte ha destruido la muerte, y por su Resurrección nos ha restaurado a la vida eterna.`),
    // Misal 2013, ASCENSIÓN, l. 3451-3458
    ascension: framed('Prefacio de la Ascensión', `Por tu amadísimo Hijo Jesucristo nuestro Señor; Quien, después de su gloriosísima Resurrección, apareció claramente a todos sus Apóstoles, y en su presencia ascendió a los cielos, a preparar un lugar para nosotros; para que podamos también ascender a donde El está, y reinar con El en gloria.`),
    // Misal 2013, PENTECOSTÉS, l. 3461-3470
    pentecost: framed('Prefacio de Pentecostés', `Por Jesucristo nuestro Señor; conforme a cuya fiel promesa, el Espíritu Santo descendió del cielo, en un tiempo como éste, reposando sobre los Discípulos, para enseñarles, y guiarles a toda verdad; dándoles valor para que con ferviente celo predicasen constantemente el Evangelio a todas las naciones; por cuyo medio hemos sido sacados de tinieblas y error a la luz clara y al conocimiento verdadero de ti, y de tu Hijo Jesucristo.`),
    // Misal 2013, DOMÍNICA DE LA TRINIDAD, l. 3471-3477 (primera forma; la segunda, «O éste», l. 3478-3482, no se usa: ver MISSING_TEXTS)
    trinity: framed('Prefacio de la Santísima Trinidad', `Que, con tu Unigénito Hijo, y el Espíritu Santo, eres un solo Dios, un solo Señor, en Trinidad de Personas y en Unidad de Substancia. Porque lo que creemos de tu gloria, oh Padre, lo mismo creemos del Hijo, y del Espíritu Santo, sin ninguna diferencia de desigualdad.`),
    // Misal 2013, APÓSTOLES Y ORDENACIONES, l. 3528-3532
    apostles: framed('Prefacio de los Apóstoles y Ordenaciones', `Por el gran pastor de tu rebaño, nuestro Señor Jesucristo; quien, después de su resurrección, envió a sus apóstoles a predicar el Evangelio y enseñar a todas las naciones; y prometió estar con ellos siempre, hasta el fin de los siglos.`),
    // Misal 2013, CONMEMORACIÓN DE LOS FIELES DIFUNTOS, l. 3588-3594
    requiem: framed('Prefacio de Difuntos', `Por nuestro Señor Jesucristo; quien se levantó victorioso de la muerte, y nos fortalece con la bendita esperanza de la vida eterna. Pues, para tu pueblo fiel, oh Señor, la vida cambia más no termina; y cuando nuestro cuerpo mortal yazca en muerte, haya preparada para nosotros una morada eterna en el cielo.`),
    // Misal 2013, PREFACIO DEL SAGRADO CORAZÓN, l. 3554-3561
    sacredHeart: framed('Prefacio del Sagrado Corazón', `Porque has querido que tu hijo único clavado en la Cruz, fuera traspasado por la lanza del soldado, para que su corazón abierto, santuario de la generosidad divina, derramara sobre nosotros torrentes de gracia y perdón; y ya que nunca cesó de arder por amor nuestro, fuera descanso para los que te aman, y para los que se arrepienten refugio siempre abierto de Salvación.`),
    // Misal 2013, TODOS LOS SANTOS, l. 3506-3512
    allSaints: framed('Prefacio de Todos los Santos', `Que, en la multitud de tus santos, nos has rodeado con una nube tan grande de testigos para que, regocijándonos en su comunión, podamos correr con paciencia la carrera que nos es propuesta, y, junto con ellos, recibir la inmarcesible corona de gloria.`),
    // Misal 2013, PREFACIO DE LA CRUZ, l. 3549-3553
    cross: framed('Prefacio de la Cruz', `Que pusiste la salvación del género humano en el árbol de la Cruz, para que de donde salió la muerte, de allí renaciese la vida, y el que en un árbol venció, en un árbol fuese vencido por Cristo Nuestro Señor.`),
    // Misal 2013, PREFACIO DE SAN JOSÉ, l. 3564-3570
    stJoseph: framed('Prefacio de San José', `Y el glorificarte, bendecirte y ensalzarte con las debidas alabanzas en la Festividad de San José. Este fue el varón justo que diste por Esposo a la Virgen Madre de Dios; constituyéndole fiel servidor y prudente sobre tu Familia, para que guardase con paternal solicitud a tu Unigénito Jesucristo, Señor nuestro, concebido por obra del Espíritu Santo.`),
    // Misal 2013, PREFACIO DE CRISTO REY, l. 3577-3585 — SIN ASIGNAR: calendar.js no emite clave para esa fiesta
    christKing: framed('Prefacio de Cristo Rey', `Porque consagraste sacerdote eterno y Rey del Universo, a tu único hijo, nuestro Señor Jesucristo ungiéndolo con óleo de alegría, para que ofreciéndose a sí mismo, como víctima perfecta y pacificadora en el Altar de la Cruz, consumara el misterio de la redención humana; y sometiendo a su poder la creación eterna, entregara a tu Majestad infinita un reino eterno y universal; el Reino de la verdad y la vida el reino de la santidad y la gracia, el reino de la justicia, el amor y la paz.`),
    // Prefacio de la Santísima Virgen (l. 3595-3600) con la palabra variable de las
    // l. 3601-3617: el Misal imprime «en la +++ de Santa María» y manda poner
    // «Festividad» (regla general) o la voz propia de cada fiesta.
    bvmFestividad:   bvmPreface('en la Festividad'),
    bvmAnnunciation: bvmPreface('en la Anunciación'),   // 25 de marzo
    bvmDormition:    bvmPreface('en la Dormición'),     // 15 de agosto
    bvmNativity:     bvmPreface('en el Nacimiento'),    // 8 de septiembre
    bvm:             bvmPreface('en la Veneración'),    // «Misas de los Sábados y Votivas»
    // Del proyecto, NO del Misal (el Misal 2013 no trae prefacio de Corpus Christi);
    // sin fuente cotejada (ver MISSING_TEXTS). Se enmarca con la apertura y el cierre
    // del Misal como los demás.
    corpusChristi: framed('Prefacio del Corpus Christi', `Por Jesucristo nuestro Señor; quien la víspera de su Pasión tomó el pan en sus santas y venerables manos, y elevando los ojos hacia ti, Dios su Padre Todopoderoso, dándote gracias, lo bendijo, lo partió y lo dio a sus discípulos diciendo: Tomad y comed todos de él, porque éste es mi Cuerpo.`),
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  INTROITOS (en español)
  // ══════════════════════════════════════════════════════════════════════════
  const INTROITS = {
    advent1: { ant:'A ti, Señor, levanto mi alma; Dios mío, en ti confío: no sea confundido, no triunfen sobre mí mis enemigos; ninguno de los que en ti esperan será confundido. Sal. Muéstrame, Señor, tus caminos; enséñame tus sendas. ℣. Gloria al Padre… A ti, Señor…' },
    advent2: { ant:'Pueblo de Sión, he aquí que el Señor vendrá a salvar a las naciones; y el Señor hará oír la gloria de su voz en la alegría de vuestro corazón.' },
    advent3: { ant:'Estad siempre gozosos en el Señor; otra vez digo, gozaos. Vuestra gentileza sea conocida de todos los hombres: el Señor está cerca. Por nada estéis afanosos; sino que en todo, con oración y súplica, con acción de gracias, sean conocidas vuestras peticiones ante Dios.' },
    advent4: { ant:'Destilad, cielos, el rocío de lo alto, y las nubes lluevan la justicia; ábrase la tierra y produzca al Salvador.' },
    christmas: { ant:'Porque un niño nos es nacido, hijo nos es dado; y el gobierno estará sobre su hombro; y se llamará su nombre Consejero del gran consejo.' },
    epiphany: { ant:'He aquí que viene el Señor dominador; y el reino está en su mano, y el poder y el dominio.' },
    lent1: { ant:'Me invocará, y yo le responderé; lo libraré y lo honraré; lo saciaré de larga vida.' },
    lent2: { ant:'Acuérdate, Señor, de tus piedades y de tus misericordias, que son perpetuas. No triunfen sobre mí mis enemigos; porque en ti he esperado.' },
    lent3: { ant:'Mis ojos están siempre puestos en el Señor; porque él sacará mis pies de la red.' },
    lent4: { ant:'Regocíjate, Jerusalén, y reuníos todos los que la amáis; gozaos con alegría los que habéis estado en tristeza; para que os regocijéis y os saciéis de los pechos de vuestra consolación.' },
    lent5: { ant:'Júzgame, oh Dios, y defiende mi causa contra la gente impía; líbrame del hombre engañoso e inicuo.' },
    palmSunday: { ant:'Oh Señor, tú eres mi Dios; hosanna, bendito el que viene en el nombre del Señor.' },
    easter:  { ant:'He resucitado, y aún estoy contigo, aleluya; pusiste sobre mí tu mano, aleluya, aleluya, aleluya. Sal. Señor, tú me has examinado y conocido; tú conoces mi sentarme y mi levantarme.' },
    easter2: { ant:'Como niños recién nacidos, desead la leche espiritual y pura, aleluya; para que con ella crezcáis para la salvación, aleluya, aleluya, aleluya. Sal. Exultad en Dios, fortaleza nuestra; aclamad con júbilo al Dios de Jacob.' },
    easter3: { ant:'Aclamad a Dios, toda la tierra, aleluya; cantad la gloria de su nombre, aleluya; dad gloria a su alabanza, aleluya, aleluya, aleluya. Sal. Decid a Dios: ¡Qué grandes son tus obras! Por la grandeza de tu poder te adulará tu enemigo.' },
    easter4: { ant:'De la misericordia del Señor está llena la tierra, aleluya; por la palabra del Señor fueron confirmados los cielos, aleluya, aleluya. Sal. Aclamad con júbilo al Señor, tierra toda; cantad, exultad y tocad.' },
    easter5: { ant:'Cantad al Señor un cántico nuevo, aleluya; porque el Señor ha hecho maravillas, aleluya, aleluya. Sal. Su diestra le ha dado la victoria y su santo brazo.' },
    easter6: { ant:'Proclamad con voz de alegría, aleluya; y que se oiga, aleluya; anunciadlo hasta los confines de la tierra: el Señor ha libertado a su pueblo, aleluya, aleluya. Sal. Aclamad al Señor, tierra toda; responded, exultad y cantad.' },
    easter7: { ant:'Oye, Señor, mi voz con que te invoco, aleluya; me dijo mi corazón: buscad su rostro; buscaré, Señor, tu rostro; no escondas de mí tu faz, aleluya, aleluya. Sal. El Señor es mi luz y mi salvación; ¿a quién temeré?' },
    ascension: { ant:'Varones galileos, ¿por qué estáis mirando al cielo? Este Jesús que ha sido tomado de entre vosotros al cielo, así vendrá como le habéis visto ir al cielo, aleluya, aleluya.' },
    pentecost: { ant:'El Espíritu del Señor llena el mundo, aleluya; y lo que todo lo contiene tiene conocimiento de la voz, aleluya, aleluya.' },
    trinity: { ant:'Bendita sea la Santísima Trinidad y la Unidad indivisa; le daremos gloria porque ha mostrado su misericordia con nosotros.' },
    requiem: { ant:'Dales, Señor, el descanso eterno, y brille para ellos la luz perpetua. Sal. A ti, oh Dios, se debe alabanza en Sión; a ti se cumplirán los votos en Jerusalén; tú que escuchas la oración, a ti vendrá toda carne.' },
    holySpirit: { ant:'El Espíritu del Señor llena el mundo, aleluya; y lo que todo lo contiene tiene conocimiento de la voz, aleluya, aleluya. Sal. Levántese Dios, sean esparcidos sus enemigos; huyan de su presencia los que le aborrecen.' },
    bvm: { ant:'Salve, Santa Madre, que diste a luz al Rey que gobierna el cielo y la tierra por los siglos de los siglos. Sal. Mi corazón rebosa de palabras buenas; dirijo mis obras al Rey.' },
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  GRADUALES
  // ══════════════════════════════════════════════════════════════════════════
  const GRADUALS = {
    advent1: { type:'gradual', text:'De lo profundo, oh Señor, a ti clamo: Señor, oye mi voz. ℣. Si mirares a los pecados, ¿quién, oh Señor, podrá mantenerse?' },
    advent3: { type:'alleluia', text:'Aleluya, aleluya. ℣. Ven y muéstranos tu rostro, oh Señor, tú que te sientas sobre los querubines: y seremos salvos. Aleluya.' },
    christmas: { type:'gradual', text:'Más hermoso eres que los hijos de los hombres: la gracia se derramó en tus labios. ℣. Ciñe tu espada sobre tu muslo, oh poderoso: con tu gloria y tu majestad.' },
    lent1: { type:'tract', text:'El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente. ℣. Diré yo al Señor: Refugio mío y fortaleza mía; mi Dios, en quien confiaré. ℣. Pues a sus ángeles mandará acerca de ti, que te guarden en todos tus caminos. ℣. En las manos te llevarán, para que tu pie no tropiece en piedra.' },
    lent2: { type:'tract', text:'Oh Señor, no nos trates según nuestros pecados, ni nos castigues según nuestras iniquidades. ℣. Señor, no te acuerdes de nuestras antiguas iniquidades; ven pronto a nuestro encuentro con tus misericordias, porque estamos muy abatidos. ℣. Ayúdanos, oh Dios, Salvador nuestro, y por la gloria de tu Nombre, líbranos; y perdona nuestros pecados por amor de tu Nombre.' },
    lent3: { type:'tract', text:'A ti, Señor, levanto mi alma; Dios mío, en ti confío, no sea yo avergonzado. ℣. Que no triunfen sobre mí mis enemigos; pues ninguno de los que en ti esperan será confundido. ℣. Muéstrame, Señor, tus caminos; enséñame tus sendas.' },
    lent4: { type:'tract', text:'Los que confían en el Señor son como el monte de Sión, que no se mueve, sino que permanece para siempre. ℣. Los montes están alrededor de Jerusalén, y el Señor alrededor de su pueblo, desde ahora y para siempre. ℣. Los que sembraron con lágrimas, con regocijo segarán.' },
    lent5: { type:'tract', text:'Muchas veces me han angustiado desde mi juventud; dígalo ahora Israel. ℣. Muchas veces me han angustiado desde mi juventud; mas no prevalecieron contra mí. ℣. Sobre mis espaldas araron los aradores; hicieron largos surcos. ℣. Mas el Señor, que es justo, cortó las coyundas de los impíos.' },
    easter:  { type:'alleluia', text:'Aleluya, aleluya. ℣. Cristo, nuestra Pascua, fue inmolado; celebremos la fiesta con los panes ázimos de la sinceridad y de la verdad. Aleluya. ℣. Alabad a Dios en su santuario; alabadle en la magnificencia de su firmamento. Aleluya.' },
    easter2: { type:'alleluia', text:'Aleluya, aleluya. ℣. Después de que resucitó el Señor Jesús de entre los muertos, se apareció a sus discípulos con las puertas cerradas. Aleluya. ℣. Ocho días después, Jesús se presentó en medio de ellos y dijo: La paz sea con vosotros. Aleluya.' },
    easter3: { type:'alleluia', text:'Aleluya, aleluya. ℣. El Señor Resucitado se manifestó a sus discípulos en el camino de Emaús y fue reconocido de ellos en la fracción del pan. Aleluya. ℣. Cristo resucitó de entre los muertos, primicia de los que durmieron. Aleluya.' },
    easter4: { type:'alleluia', text:'Aleluya, aleluya. ℣. Yo soy el buen pastor, que da su vida por las ovejas, dice el Señor. Aleluya. ℣. Mis ovejas escuchan mi voz; yo las conozco y ellas me siguen. Aleluya.' },
    easter5: { type:'alleluia', text:'Aleluya, aleluya. ℣. Yo soy el camino, la verdad y la vida; nadie viene al Padre sino por mí, dice el Señor. Aleluya. ℣. Si permanecéis en mí y mis palabras permanecen en vosotros, pedid lo que queráis y se os dará. Aleluya.' },
    easter6: { type:'alleluia', text:'Aleluya, aleluya. ℣. El Espíritu Santo os enseñará todas las cosas y os recordará todo lo que yo os he dicho. Aleluya. ℣. Si alguien me ama, guardará mi palabra, y mi Padre le amará. Aleluya.' },
    easter7: { type:'alleluia', text:'Aleluya, aleluya. ℣. Padre santo, guarda en tu nombre a los que me diste, para que sean uno como nosotros. Aleluya. ℣. No ruego sólo por éstos, sino también por cuantos creerán en mí por su palabra. Aleluya.' },
    pentecost: { type:'alleluia', text:'Aleluya, aleluya. ℣. El Espíritu Santo procederá del Padre, aleluya: él dará testimonio acerca de mí, aleluya. Aleluya.' },
    trinity: { type:'alleluia', text:'Bendito eres, Señor, que penetras los abismos y estás sentado sobre los querubines. ℣. Bendito eres, Señor, en el firmamento del cielo, y digno de alabanza por los siglos. Aleluya, aleluya. ℣. Bendito eres, Señor, Dios de nuestros padres, y digno de alabanza por los siglos. Aleluya.' },
    // Seasonal fallback for Sundays after Trinity (ordinary time)
    trinityGeneric: { type:'alleluia', text:'Aleluya, aleluya. ℣. El Señor es grande y digno de toda alabanza; y su grandeza es inescrutable. Aleluya. ℣. Bienaventurado el pueblo cuyo Dios es el Señor. Aleluya.' },
    // Seasonal fallback for Epiphany
    epiphany: { type:'alleluia', text:'Aleluya, aleluya. ℣. El Señor reina, se viste de majestad; el Señor se viste, se ciñe de poder. Aleluya. ℣. El Señor es mi luz y mi salvación; ¿de quién temeré? Aleluya.' },
    // Pre-Lent (Septuagesima) — Alleluia is suppressed; use tract
    septuagesima: { type:'tract', text:'De los profundo, Señor, a ti clamo: Señor, oye mi voz. ℣. Estén atentos tus oídos a la voz de mi súplica. ℣. Si mirares a los pecados, ¿quién, oh Señor, podrá mantenerse? Mas en ti hay perdón, para que seas reverenciado.' },
    sexagesima: { type:'tract', text:'Conmoviste, oh Señor, la tierra; la abriste. Sana sus roturas, porque se estremece. ℣. Para que escapen los que amas, sálvanos con tu diestra y respóndenos.' },
    quinquagesima: { type:'tract', text:'Aclamad al Señor con alegría, toda la tierra; servid al Señor con gozo; venid ante su presencia con regocijo. ℣. Sabed que el Señor, él es Dios; él nos hizo y no nosotros a nosotros mismos.' },
    requiem: { type:'tract', text:'Dales, Señor, el descanso eterno, y brille para ellos la luz perpetua. ℣. El justo será en memoria eterna; no temerá de mala fama.' },
    holySpirit: { type:'alleluia', text:'Aleluya, aleluya. ℣. Ven, Espíritu Santo, llena los corazones de tus fieles y enciende en ellos el fuego de tu amor. Aleluya.' },
    bvm: { type:'gradual', text:'Bendita y venerable eres, oh Virgen María; que sin mancha de pudor fuiste hallada Madre del Salvador. ℣. Virgen Madre de Dios, el que el mundo entero no puede contener se encerró en tus entrañas, hecho hombre.' },
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  OFERTORIOS
  // ══════════════════════════════════════════════════════════════════════════
  const OFFERTORIES = {
    advent1: 'A ti, Señor, levanto mi alma; Dios mío, en ti confío, no sea confundido; ninguno de los que en ti esperan será confundido.',
    christmas: 'Alégrense los cielos, y gócese la tierra, delante del Señor; porque viene.',
    epiphany: 'Los reyes de Tarsis y de las costas traerán presentes; los reyes de Sabá y de Seba ofrecerán dones; sí, todos los reyes se postrarán delante de él.',
    lent1: 'Meditaré en la ley del Señor día y noche, para que recibas todo lo que hago, oh Señor, esperanza mía.',
    easter: 'Alabaré al Señor con todo mi corazón; mientras viva alabaré al Señor; sí, mientras tenga ser, cantaré alabanzas a mi Dios, aleluya.',
    pentecost: 'Confirma esto, oh Dios, que has obrado para nosotros, desde tu santo templo que está en Jerusalén; aleluya, aleluya.',
    trinity: 'Bendito sea Dios el Padre, y el Hijo Unigénito de Dios, y también el Espíritu Santo; porque ha mostrado su misericordia con nosotros.',
    trinity1: 'Confía en el Señor, y haz el bien; habita en la tierra, y ciertamente serás sustentado.',
    requiem: 'Oh Señor Jesucristo, Rey de gloria, libra a las almas de todos los fieles difuntos de las penas del infierno y del abismo profundo.',
    holySpirit: 'Confirma esto, oh Dios, que has obrado para nosotros, desde tu santo templo que está en Jerusalén; aleluya, aleluya.',
    bvm: 'Dios te salve, María, llena eres de gracia; el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre.',
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  COMUNIONES
  // ══════════════════════════════════════════════════════════════════════════
  const COMMUNIONS = {
    advent1: 'El Señor mostrará su amorosa bondad; y nuestra tierra dará su fruto.',
    advent4: 'He aquí que una virgen concebirá y dará a luz un hijo, y llamará su nombre Emanuel.',
    christmas: 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios: y aquel Verbo fue hecho carne, y habitó entre nosotros: y vimos su gloria, gloria como del unigénito del Padre.',
    epiphany: 'Hemos visto su estrella en el oriente, y venimos con dones a adorar al Señor.',
    lent1: 'A sus ángeles mandará acerca de ti, que te guarden en todos tus caminos; en las manos te llevarán, para que tu pie no tropiece en piedra.',
    easter:  'Nuestra pascua, que es Cristo, ya fue sacrificada por nosotros; así que celebremos la fiesta con los panes sin levadura de sinceridad y de verdad, aleluya, aleluya, aleluya.',
    easter2: 'Pon tu mano y reconoce el lugar de los clavos, aleluya; y no seas incrédulo, sino fiel, aleluya, aleluya.',
    easter3: 'Los discípulos reconocieron al Señor Jesús, aleluya, en la fracción del pan, aleluya, aleluya.',
    easter4: 'Resucitó el buen pastor, que dio su vida por sus ovejas y se dignó morir por su rebaño, aleluya.',
    easter5: 'Yo soy la verdadera vid y vosotros los sarmientos, dice el Señor; quien permanece en mí y yo en él, ése da mucho fruto, aleluya.',
    easter6: 'Si alguien me ama, guardará mi palabra, aleluya; y mi Padre le amará, aleluya; y vendremos a él, aleluya, aleluya.',
    easter7: 'Padre, cuando estaba con ellos, yo los guardaba en tu nombre; a los que me diste, aleluya; ahora vengo a ti: santifícalos en tu verdad, aleluya, aleluya.',
    ascension: 'No os dejaré huérfanos: me fui, y vengo a vosotros, aleluya; y vuestro corazón se alegrará, aleluya, aleluya.',
    pentecost: 'El Espíritu Santo os enseñará, aleluya, todas las cosas que os he dicho, aleluya, aleluya.',
    trinity: 'Cuando despierte a tu semejanza, seré satisfecho.',
    trinity1: 'Cantaré al Señor, porque me ha hecho bien.',
    requiem: 'Brille para ellos la luz perpetua, oh Señor, con tus Santos para siempre, porque eres piadoso.',
    holySpirit: 'De repente vino del cielo un estruendo como de un viento impetuoso, donde estaban sentados; y todos fueron llenos del Espíritu Santo, anunciando las maravillas de Dios, aleluya, aleluya.',
    bvm: 'Bienaventuradas las entrañas de la Virgen María, que llevaron al Hijo del Padre Eterno.',
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  SECRETAS Y POSCOMUNIONES
  // ══════════════════════════════════════════════════════════════════════════
  const SECRETS = {
    advent1: `Dígnate, Señor, te suplicamos, recibir misericordiosamente este nuestro sacrificio de alabanza; para que por estos sacrosantos misterios seamos purificados de todos nuestros pecados y obtengamos la gracia que nos conduzca al fin que nos has preparado; por Jesucristo nuestro Señor. Amén.`,
    christmas: `Acepta, Señor, la ofrenda que hacemos en este tu santo día; para que por estos sacratísimos misterios seamos purificados de nuestra antigua iniquidad y renovados en tu santo nacimiento; por Jesucristo nuestro Señor. Amén.`,
    easter: `Recibe, Señor, las oraciones y oblaciones de tu pueblo; y como nos has concedido gozarnos en la sagrada obra de nuestra redención, así que estos misterios celestiales sean para nosotros medicina de vida, ahora y en el mundo venidero; por Jesucristo nuestro Señor. Amén.`,
    pentecost: `Santifica, Señor, estas nuestras ofrendas por la nueva luz de tu Espíritu eterno; así como has iluminado las mentes de tus fieles por el mismo Espíritu. Por Jesucristo nuestro Señor. Amén.`,
    trinity: `Santifica, Señor Dios, te suplicamos, este nuestro sacrificio; y por tu continua protección limpia nuestros corazones de todo pensamiento pecaminoso; por Jesucristo nuestro Señor. Amén.`,
    requiem: `Te suplicamos, Señor, que mires propicio esta ofrenda que te presentamos por las almas de tus siervos y siervas; para que los que purificas por estos misterios celestiales descansen en tu paz; por Jesucristo nuestro Señor. Amén.`,
    holySpirit: `Santifica, Señor, te suplicamos, estas nuestras ofrendas; y límpianos de toda mancha de pecado por la luz de tu Espíritu Santo; por Jesucristo nuestro Señor. Amén.`,
    bvm: `Que por tu misericordia, Señor, y por la intercesión de la Bienaventurada Virgen María, esta oblación nos obtenga paz y prosperidad, tanto ahora como en la vida venidera; por Jesucristo nuestro Señor. Amén.`,
  };

  const POSTCOMMUNIONS = {
    advent1: `Purifícanos, Señor, te suplicamos, por el ministerio de estos santos misterios; y recibe con bondad las oraciones de tus suplicantes; para que nosotros, que hemos sido tocados por las cosas celestiales, seamos librados de todos los pecados; por Jesucristo nuestro Señor. Amén.`,
    christmas: `Concede, Señor, te suplicamos, que el nacimiento de tu Hijo Unigénito, que por esta santa comunión hemos recibido, nos libre de todos nuestros pecados; por el mismo Jesucristo nuestro Señor. Amén.`,
    easter: `Dígnate, Señor, guardar en novedad de vida el misterio sacrificial que hemos recibido; de modo que, por la participación en este sacramento celestial, pasemos de la muerte a la vida; por Jesucristo nuestro Señor. Amén.`,
    pentecost: `Te suplicamos, Señor, que el don celestial de tu gracia obre de tal manera en nuestros corazones, que merezcamos obtener continuamente tu misericordioso auxilio; por Jesucristo nuestro Señor. Amén.`,
    trinity: `Concede, te suplicamos, Dios Todopoderoso, que el don de esta oblación nos santifique y purifique; para que lo que te agrada nos aproveche; por Jesucristo nuestro Señor. Amén.`,
    requiem: `Concede, Señor, te suplicamos, que las almas de tus siervos y siervas, purificadas por este sacrificio celestial, obtengan el perdón y el descanso sempiterno; por Jesucristo nuestro Señor. Amén.`,
    holySpirit: `Te suplicamos, Señor, que el Espíritu Santo nos renueve mediante estos celestiales misterios, pues él es la remisión de todos los pecados; por Jesucristo nuestro Señor. Amén.`,
    bvm: `Habiendo recibido los sacramentos de nuestra salvación, concédenos, Señor, que seamos protegidos en todas partes por la intercesión de la Bienaventurada Virgen María, en cuyo honor hemos ofrecido a tu majestad este sacrificio; por Jesucristo nuestro Señor. Amén.`,
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  TEXTOS QUE FALTAN (para transcribir del Misal impreso)
  // ══════════════════════════════════════════════════════════════════════════
  // Inventario explícito de las piezas para las que el archivo NO tiene texto
  // propio ni del tiempo y, por tanto, caen al genérico del Común marcadas con
  // `supplied`. NO se han redactado: se declaran aquí para que puedan
  // transcribirse del Misal Anglicano impreso.
  const MISSING_TEXTS = [
    { part: 'canon1928',     need: 'Revisar la traducción española del BCP 1928 (Canon.CANON_1928, CHURCH_MILITANT_1928, THANKSGIVING_1928 y la introducción del Padrenuestro): el texto inglés está cotejado con el BCP 1928, pero la versión española es traducción propia, no de una edición impresa en español' },
    { part: 'secret',        need: 'Secreta del tiempo de Epifanía' },
    { part: 'secret',        need: 'Secreta del tiempo de Pre-Cuaresma (Septuagésima)' },
    { part: 'secret',        need: 'Secreta del tiempo de Cuaresma' },
    { part: 'secret',        need: 'Secreta del Tiempo de Pasión y de la Semana Santa' },
    { part: 'secret',        need: 'Secreta del Miércoles de Ceniza' },
    { part: 'secret',        need: 'Secretas propias de los 28 Domingos después de la Trinidad' },
    { part: 'secret',        need: 'Secreta de Corpus Christi y del Sagrado Corazón' },
    { part: 'secret',        need: 'Secretas de las fiestas fijas no marianas (Apóstoles, Evangelistas, Todos los Santos, Transfiguración, Santa Cruz, San Miguel, comites Christi)' },
    { part: 'postcommunion', need: 'Poscomunión del tiempo de Epifanía' },
    { part: 'postcommunion', need: 'Poscomunión del tiempo de Pre-Cuaresma (Septuagésima)' },
    { part: 'postcommunion', need: 'Poscomunión del tiempo de Cuaresma' },
    { part: 'postcommunion', need: 'Poscomunión del Tiempo de Pasión y de la Semana Santa' },
    { part: 'postcommunion', need: 'Poscomunión del Miércoles de Ceniza' },
    { part: 'postcommunion', need: 'Oración sobre el pueblo del Viernes Santo (super populum)' },
    { part: 'postcommunion', need: 'Poscomuniones propias de los 28 Domingos después de la Trinidad' },
    { part: 'postcommunion', need: 'Poscomunión de Corpus Christi y del Sagrado Corazón' },
    { part: 'postcommunion', need: 'Poscomuniones de las fiestas fijas no marianas' },
    { part: 'introit',       need: 'Introito del tiempo de Pre-Cuaresma (Circumdederunt / Exsurge / Esto mihi)' },
    { part: 'introit',       need: 'Introitos propios de los 28 Domingos después de la Trinidad' },
    { part: 'introit',       need: 'Introitos de las fiestas fijas no marianas (incl. Todos los Santos, San José, Apóstoles)' },
    { part: 'introit',       need: 'Introito del Jueves Santo, Viernes Santo y Sábado Santo' },
    // Prefacios (Misal 2013, «PREFACIOS PROPIOS», l. 3403-3617). Los textos que
    // trae el Misal ya están transcritos en Propers.PREFACES; esto es lo que queda.
    { part: 'preface',       need: 'Prefacio de Corpus Christi: el Misal 2013 NO trae prefacio propio de esa fiesta. El texto que se sirve (narración de la Institución, «quien la víspera de su Pasión tomó el pan…») es del proyecto y no tiene fuente cotejada; no es un prefacio sino texto del Canon. Sin cotejar: sustituir por el que indique el Misal impreso o dejar el que corresponda al tiempo' },
    { part: 'preface',       need: 'Prefacio de Cristo Rey: el texto del Misal (l. 3577-3585) está en PREFACES.christKing, pero calendar.js no emite una clave para la Fiesta de Cristo Rey («Último Domingo de Octubre», l. 2845), de modo que no se imprime nunca. Falta la clave en calendar.js' },
    { part: 'preface',       need: 'Domingos y ferias ordinarios (después de la Trinidad, de la Epifanía y de Pascua, Pre-Cuaresma, 2 a 5 de enero y días fuera de octava): el Misal da tres prefacios «De Dios Padre / De Dios Hijo / De Dios Espíritu Santo» (l. 3408-3420), unidos por «o éste», sin decir cuál va cada día. Se sirve el Prefacio Común, que es texto romano del proyecto y NO está en el Misal. Decisión pendiente: cuál de los tres, o cuál regla de rotación' },
    { part: 'preface',       need: 'Purificación (02-02) y Anunciación (03-25): el Misal las nombra a la vez en el prefacio «Purificación, Anunciación y Transfiguración» (l. 3436-3442) y, la Anunciación, en la tabla de variantes del prefacio de la Virgen (l. 3601-3617). Conflicto entre dos rúbricas; se conserva el de la Virgen. Decisión pendiente' },
    { part: 'preface',       need: 'Domingo de Pasión y Semana de Pasión (lent5, lentFeria5_*): el Misal llama «Semana Santa» a la que empieza el Domingo de Ramos (l. 110, 124, 3489) y no dice qué prefacio va antes. Conservan el de Semana Santa, como antes; podría corresponderles el de Cuaresma. Decisión pendiente' },
    { part: 'preface',       need: 'Octava de la Ascensión: la rúbrica (l. 3452) da «siete días después», que acaba el jueves easterFeria7_4; el viernes easterFeria7_5 conserva Communicantes y Colecta de la Ascensión (canon.js, COLLECTS) pero ya no el prefacio. Decisión pendiente: si la octava llega al viernes, ampliar la regla' },
    { part: 'preface',       need: 'Prefacios del Misal sin día asignado en el calendario: «De Dios Padre/Hijo/Espíritu Santo», Encarnación (l. 3500), Un santo (tres formas, l. 3515-3527), Apóstoles y Evangelistas (l. 3571, segunda redacción; se usa «Apóstoles y Ordenaciones»), Dedicación de una iglesia, Bautismo, Matrimonio y el de la Misa Crismal (l. 1178). Trinidad: la segunda forma («O éste», l. 3478-3482) no se usa. No hay rúbrica que las vincule a un día; los santos no apostólicos llevan hoy el Prefacio Común' },
    { part: 'preface',       need: 'Erratas probables del Misal, transcritas como están impresas: «nos da la virtud y el premio» (Cuaresma, ¿«nos das»?), «cambia más no termina» (Difuntos, ¿«mas»?), comas que faltan en Cristo Rey y Apóstoles y Evangelistas, y «hijo» en minúscula en varios prefacios. Decidir si se corrigen' },
    { part: 'gradual',       need: 'Graduales propios de los 28 Domingos después de la Trinidad' },
    { part: 'gradual',       need: 'Graduales/Tractos de las fiestas fijas no marianas' },
    { part: 'offertory',     need: 'Ofertorio del tiempo de Pre-Cuaresma' },
    { part: 'offertory',     need: 'Ofertorios propios de Adviento II-IV, Cuaresma II-V y de los Domingos después de la Trinidad' },
    { part: 'offertory',     need: 'Ofertorios de las fiestas fijas no marianas' },
    { part: 'communion',     need: 'Comunión del tiempo de Pre-Cuaresma' },
    { part: 'communion',     need: 'Comuniones propias de Adviento II-III, Cuaresma II-V y de los Domingos después de la Trinidad' },
    { part: 'communion',     need: 'Comuniones de las fiestas fijas no marianas' },
    { part: 'collect',       need: 'Colectas propias de las ferias de Cuaresma, Adviento y Tiempo de Navidad (hoy toman la del domingo precedente, uso admitido)' },
    // Cotejo de las colectas con el Misal Anglicano 2013 (Sociedad Sacerdotal
    // Corpus Christi; sección «COLECTAS», pp. 57-103). Ese Misal NO trae secretas,
    // poscomuniones, introitos ni graduales por día (dice que el Introito «se toma
    // del Prayer Book o del Misal Anglicano»), así que esas entradas siguen
    // faltando. Lo que sigue es lo que de las COLECTAS no se pudo cotejar:
    { part: 'collect',       need: 'Colectas sin cotejar porque el Misal Anglicano 2013 no las trae (conservan el texto anterior): Bautismo del Señor, San José (03-19), Exaltación de la Santa Cruz (09-14), Fieles Difuntos (11-02), misas votivas de Réquiem, del Espíritu Santo y de Santa María, y los Domingos 26°-28° después de la Trinidad (Cristo Rey)' },
    { part: 'collect',       need: 'Domingos 25° y 26° después de la Trinidad en años con 26 o 27 domingos: el Misal manda decir en ellos el Oficio de la 6ª y 5ª Domínica después de Epifanía y dejar la «Domínica antes de Adviento» para el último; requiere que calendar.js/app.js informen del total de domingos del año' },
    { part: 'collect',       need: 'Colectas del Misal 2013 sin clave en calendar.js: Conversión de San Pablo (01-25), Visitación, Preciosísima Sangre (1 jul), Concepción de la B.V.M. (8 dic), Maternidad Divina (11 oct), Presentación de la B.V.M. (21 nov), Sagrada Familia, Cristo Rey, Témporas, Rogativas, Dedicación de una Iglesia, Independencia, Acción de Gracias, Conmemoración de un Santo, Matrimonio y Entierro' },
    { part: 'collect',       need: 'Colectas alternativas del Misal 2013 que no se cargaron (el archivo guarda una sola por día): Pascua y Pentecostés (segunda colecta de la primera misa), Viernes Santo (otras dos), Purificación y Anunciación (versión de las solemnidades marianas, p. 100) y las redacciones de Miércoles de Ceniza, Domingo de Ramos, Jueves Santo y Viernes Santo del rito (pp. 18-39), distintas de las de la sección COLECTAS' },
    { part: 'secret',        need: 'Conmemoraciones de santos (commemorations.js: SAINT_SECRETS.default y SAINT_POSTCOMMUNIONS.default): son fórmulas genéricas que no proceden de ningún misal; sustituirlas por las propias de cada fiesta cuando se transcriban' },
    // Misas votivas (selector del Misal). Las LECTURAS propias ya están en
    // lectionary.js (Lectionary.VOTIVE); lo que sigue son los propios cantados y
    // las oraciones que esas misas piden y el proyecto no tiene.
    { part: 'gradual',       need: 'Misa votiva del Espíritu Santo: Gradual (Beata gens / Verbo Domini) y Tracto de Septuagésima a Pascua. Hoy solo existe el verso del Aleluya; en tiempo penitencial no se imprime y se rotula la falta, porque no se puede decir el Aleluya' },
    { part: 'gradual',       need: 'Misa votiva de Santa María: Aleluya con sus versos (Post partum / Virga Jesse) del Tiempo Pascual y Tracto de Septuagésima (Gaude Maria); hoy se sirve siempre el Gradual Benedicta et venerabilis' },
    { part: 'bvm',           need: 'Misas votivas de Santa María de Adviento (Rorate caeli) y de Navidad a la Purificación (Vultum tuum): sus LECTURAS propias sí están, pero faltan introito, colecta, gradual, ofertorio, secreta, comunión y poscomunión propios; se sirven los de la Misa «Salve sancta parens»' },
    { part: 'requiem',       need: 'Misa de Réquiem: Tracto Absolve y Secuencia Dies irae; colectas, secretas y poscomuniones propias de cada ocasión (día del entierro, tercer/séptimo/trigésimo día, aniversario, obispos y sacerdotes, hermanos y bienhechores). Cotejar con el Misal impreso la Secreta y la Poscomunión que hoy se sirven: la Colecta coincide con la de «Fieles Difuntos» (Fidelium Deus) pero la Poscomunión no coincide literalmente con la de esa Misa' },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  //  DEDUCCIÓN DEL TIEMPO LITÚRGICO A PARTIR DE LA CLAVE DEL DÍA
  // ══════════════════════════════════════════════════════════════════════════
  // Cubre las 420 claves que emite calendar.js (barrido 2024-2060). Devuelve
  // null para las claves votivas (requiem, holySpirit, bvm), para las fiestas
  // fijas 'MM-DD' —cuyo tiempo depende del año y solo lo sabe calendar.js— y
  // para la clave de seguridad 'feria'.
  const SEASON_RULES = [
    [/^advent([1-4])?$/,                'advent'],
    [/^adventFeria\d+_\d+$/,            'advent'],
    [/^christmas$/,                     'christmas'],
    [/^christmasSunday2?$/,             'christmas'],
    [/^christmasFeria_\d+$/,            'christmas'],
    [/^circumcision$/,                  'christmas'],
    [/^epiphany$/,                      'epiphany'],
    [/^baptismLord$/,                   'epiphany'],
    [/^epi\d+$/,                        'epiphany'],
    [/^epiOctave_\d+$/,                 'epiphany'],
    [/^epiFeria\d+_\d+$/,               'epiphany'],
    [/^(septuagesima|sexagesima|quinquagesima)$/, 'preLent'],
    [/^preLentFeria_\d+$/,              'preLent'],
    // Tiempo de Pasión ANTES que Cuaresma: lent5 (Domingo de Pasión) y toda la
    // Semana de Pasión (lentFeria5_*, redefinida por calendar.js) pertenecen al
    // Tiempo de Pasión, igual que la Semana Santa y el Jueves Santo.
    [/^lent5$/,                         'passiontide'],
    [/^lentFeria5_\d+$/,                'passiontide'],
    [/^palmSunday$/,                    'passiontide'],
    [/HolyWeek$/,                       'passiontide'],
    [/^maundyThursday$/,                'passiontide'],
    [/^(goodFriday|holySaturday)$/,     'triduum'],
    [/^ashWednesday$/,                  'lent'],
    [/^lent[1-4]$/,                     'lent'],
    [/^lentFeria[1-4]_\d+$/,            'lent'],
    [/^lentFeriaAsh_\d+$/,              'lent'],
    [/^easter\d*$/,                     'easter'],
    [/^easterFeria\d+_\d+$/,            'easter'],
    [/^ascension$/,                     'easter'],
    [/^pentecost$/,                     'pentecost'],
    [/^pentecostFeria_\d+$/,            'pentecost'],
    [/^trinity\d*$/,                    'trinity'],
    [/^ordinaryFeria\d*(_\d+)?$/,       'trinity'],
    [/^(corpusChristi|sacredHeart)$/,   'trinity'],
  ];
  const VALID_SEASONS = ['advent','christmas','epiphany','preLent','lent',
                         'passiontide','triduum','easter','pentecost','trinity'];

  function seasonOfKey(key) {
    if (!key) return null;
    for (const [re, s] of SEASON_RULES) if (re.test(key)) return s;
    return null;
  }

  // El tiempo efectivo: la deducción por clave manda (es exacta para las 393
  // claves temporales); si la clave no la da —fiestas fijas 'MM-DD'— se acepta
  // el `season` que pase quien llama, siempre que sea uno de los reconocidos.
  // app.js pasa hoy 'ordinary', que no lo es y por tanto se descarta.
  // Fiestas fijas cuya fecha cae SIEMPRE en el mismo tiempo litúrgico, sea cual
  // sea el año: sirven de red cuando quien llama no pasa un `season` válido
  // (como hoy hace app.js, que pasa 'ordinary' para toda clave 'MM-DD').
  // El resto de las fiestas fijas cambia de tiempo según el año y solo puede
  // resolverse pasando dayInfo.season.
  const FEAST_SEASON_FIXED = {
    '12-21': 'advent',
    '12-26': 'christmas',
    '12-27': 'christmas',
    '12-28': 'christmas',
  };

  function effectiveSeason(key, season) {
    return seasonOfKey(key) ||
           (VALID_SEASONS.indexOf(season) >= 0 ? season : null) ||
           FEAST_SEASON_FIXED[key] || null;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  COMÚN DE LAS FIESTAS FIJAS
  // ══════════════════════════════════════════════════════════════════════════
  // Antes ninguna clave 'MM-DD' aparecía en INTROITS/GRADUALS/OFFERTORIES/
  // COMMUNIONS y getSeasonFromKey('11-01') devolvía 'ordinary' (que tampoco es
  // clave): Todos los Santos, la Asunción, la Candelaria y San José cantaban
  // los propios de la Trinidad. Las fiestas de la Virgen y la de los Fieles
  // Difuntos tienen ya en este archivo los textos del Común correspondiente
  // ('bvm', 'requiem'), así que se enlazan aquí. Para los Apóstoles solo existe
  // el Prefacio; el resto de sus piezas sigue faltando (ver MISSING_TEXTS).
  const FEAST_COMMON = {
    '02-02': 'bvm',      // Purificación (Candelaria)
    '03-25': 'bvm',      // Anunciación
    '08-15': 'bvm',      // Asunción
    '09-08': 'bvm',      // Natividad de la B.V.M.
    '11-02': 'requiem',  // Fieles Difuntos
  };
  const APOSTLE_FEASTS = ['02-24','04-25','05-01','06-11','06-29','07-25',
                          '08-24','09-21','10-18','10-28','11-30','12-21','12-27'];

  // ══════════════════════════════════════════════════════════════════════════
  //  CADENAS DE RESPALDO POR PIEZA
  // ══════════════════════════════════════════════════════════════════════════
  // Para cada pieza: el mapa de textos, qué clave usar como propio DEL TIEMPO
  // y cuál como genérico del Común. Un tiempo ausente de `bySeason` significa
  // que NO hay texto propio de ese tiempo en el archivo: la cadena salta al
  // genérico y la pieza queda anotada en MISSING_TEXTS. No se inventa nada.
  const CHAINS = {
    introit: {
      map: INTROITS, label: 'Introito', gender: 'm', generic: 'trinity',
      bySeason: { advent:'advent1', christmas:'christmas', epiphany:'epiphany',
                  lent:'lent1', passiontide:'lent5', triduum:'lent5',
                  easter:'easter', pentecost:'pentecost', trinity:'trinity' },
    },
    gradual: {
      map: GRADUALS, label: 'Gradual', gender: 'm', generic: 'trinityGeneric',
      bySeason: { advent:'advent1', christmas:'christmas', epiphany:'epiphany',
                  preLent:'septuagesima', lent:'lent1', passiontide:'lent5',
                  triduum:'lent5', easter:'easter', pentecost:'pentecost',
                  trinity:'trinityGeneric' },
    },
    offertory: {
      map: OFFERTORIES, label: 'Ofertorio', gender: 'm', generic: 'trinity1',
      bySeason: { advent:'advent1', christmas:'christmas', epiphany:'epiphany',
                  lent:'lent1', passiontide:'lent1', triduum:'lent1',
                  easter:'easter', pentecost:'pentecost', trinity:'trinity1' },
    },
    communion: {
      map: COMMUNIONS, label: 'Comunión', gender: 'f', generic: 'trinity1',
      bySeason: { advent:'advent1', christmas:'christmas', epiphany:'epiphany',
                  lent:'lent1', passiontide:'lent1', triduum:'lent1',
                  easter:'easter', pentecost:'pentecost', trinity:'trinity1' },
    },
    collect: {
      map: COLLECTS, label: 'Colecta', gender: 'f', generic: 'trinity1',
      bySeason: { advent:'advent1', christmas:'christmas',
                  epiphany:'epiphanySeason', preLent:'septuagesima',
                  lent:'lent1', passiontide:'lent5', triduum:'holySaturday',
                  easter:'easter', pentecost:'pentecost', trinity:'trinity1' },
    },
    secret: {
      map: SECRETS, label: 'Secreta', gender: 'f', generic: 'trinity',
      // Faltan: epiphany, preLent, lent, passiontide, triduum.
      bySeason: { advent:'advent1', christmas:'christmas', easter:'easter',
                  pentecost:'pentecost', trinity:'trinity' },
    },
    postcommunion: {
      map: POSTCOMMUNIONS, label: 'Poscomunión', gender: 'f', generic: 'trinity',
      // Faltan: epiphany, preLent, lent, passiontide, triduum.
      bySeason: { advent:'advent1', christmas:'christmas', easter:'easter',
                  pentecost:'pentecost', trinity:'trinity' },
    },
  };

  const SEASON_LABEL = {
    advent:     'del tiempo de Adviento',
    christmas:  'del tiempo de Navidad',
    epiphany:   'del tiempo de Epifanía',
    preLent:    'del tiempo de Pre-Cuaresma',
    lent:       'del tiempo de Cuaresma',
    passiontide:'del Tiempo de Pasión',
    triduum:    'del Triduo Sacro',
    easter:     'del tiempo de Pascua',
    pentecost:  'del tiempo de Pentecostés',
    trinity:    'del tiempo después de la Trinidad',
  };
  const COMMON_LABEL = {
    bvm:     'del Común de la Santísima Virgen',
    requiem: 'de la Misa de Difuntos',
  };

  function rubricFor(part, source, from) {
    const c = CHAINS[part];
    if (!c || source === 'proper') return null;
    const suf = (c.gender === 'f') ? 'suplida' : 'suplido';
    if (source === 'common')  return `(${c.label} ${COMMON_LABEL[from] || 'del Común'}, ${suf})`;
    if (source === 'season')  return `(${c.label} ${SEASON_LABEL[from] || 'del tiempo'}, ${suf})`;
    return `(${c.label} del Común, ${suf})`;
  }

  // ── Piezas que el día NO tiene ───────────────────────────────────────────
  // Vacío a propósito: el Viernes Santo se celebra con js/holyweek.js (Misa de los
  // Presantificados del Misal impreso), y app.js vacía allí Introito, Gradual,
  // Ofertorio, Prefacio, Secreta, Comunión y Poscomunión y toma la Colecta de
  // HolyWeek.GOOD_FRIDAY. Las entradas OMITTED.goodFriday y COLLECTS.goodFriday
  // quedaron muertas y se retiraron; el mecanismo se conserva por si otro día
  // careciera de alguna pieza: { claveDelDia: { pieza: 'nota' } }.
  const OMITTED = {};

  function none(part, key) {
    const note = OMITTED[key] && OMITTED[key][part];
    return { value: (part === 'introit') ? { ant:'' } : (part === 'gradual' ? null : ''),
             supplied: false, source: 'none', from: null, rubric: null,
             omitted: true, note: note || null };
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  RESOLUCIÓN GENERAL: clave exacta → Común de la fiesta → tiempo → genérico
  // ══════════════════════════════════════════════════════════════════════════
  function resolve(part, dayKey, season, date) {
    if (part === 'preface') return resolvePreface(dayKey, season, date);
    const c = CHAINS[part];
    if (!c) throw new Error('Propers: pieza desconocida «' + part + '»');
    if (OMITTED[dayKey] && OMITTED[dayKey][part]) return none(part, dayKey);

    const map = c.map;
    const hit = (k, source, from) => ({
      value: map[k], supplied: source !== 'proper', source, from,
      rubric: rubricFor(part, source, from), omitted: false, note: null,
    });

    // 1) clave exacta del día
    if (dayKey && map[dayKey] !== undefined) return hit(dayKey, 'proper', null);

    // 1 bis) alias histórico de calendar.js para las ferias del Tiempo Ordinario
    if (dayKey && /^ordinaryFeria\d+_\d+$/.test(dayKey) && map['ordinaryFeria'] !== undefined) {
      return hit('ordinaryFeria', 'proper', null);
    }

    // 2) Común de la fiesta fija (Virgen, Difuntos…)
    const common = FEAST_COMMON[dayKey];
    if (common && map[common] !== undefined) return hit(common, 'common', common);

    // 3) propio del tiempo
    const s = effectiveSeason(dayKey, season);
    if (s && c.bySeason[s] && map[c.bySeason[s]] !== undefined) {
      return hit(c.bySeason[s], 'season', s);
    }

    // 4) genérico del Común
    if (map[c.generic] !== undefined) return hit(c.generic, 'generic', null);
    return none(part, dayKey);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  PREFACIO
  // ══════════════════════════════════════════════════════════════════════════
  // ASIGNACIÓN DE PREFACIOS. Cada regla cita la rúbrica del Misal Anglicano 2013
  // (l. = línea según la herramienta Read sobre misal_utf8.txt). Solo se aplica lo
  // que el Misal dice sin ambigüedad; el resto cae al Prefacio Común (ver
  // MISSING_TEXTS, entradas «preface»).
  //
  //   Navidad       l. 3422  «En el Día de Navidad, y siete días después»
  //                          → 25 dic.–1 ene. (christmas, 12-26/27/28, christmasSunday,
  //                          christmasFeria_5..7, circumcision). Del 2 al 5 de enero: Común.
  //   Epifanía      l. 3432  «En la Epifanía, y siete días después» → 6–13 ene.
  //                          (epiphany, baptismLord, epiOctave_*, y epiFeria1_* si la
  //                          fecha es ≤ 13 ene.). Pasado el 13: Común.
  //   Pascua        l. 3444  «En el día de Pascua de Resurrección, y siete días
  //                          después» → easter, easterFeria1_* y easter2 (Domingo II,
  //                          octavo día). Del lunes de la 2ª semana a la Vigilia de
  //                          Pentecostés: Común (salvo la octava de la Ascensión).
  //   Ascensión     l. 3452  «En el día de la Ascensión, y siete días después» →
  //                          jueves de la Ascensión + 7 días: easterFeria6_5, 6_6,
  //                          easter7, easterFeria7_1..7_4. OJO: el viernes
  //                          easterFeria7_5 (octavo día) NO lleva ya este prefacio,
  //                          aunque canon.js y COLLECTS le siguen dando el
  //                          Communicantes y la Colecta de la Ascensión.
  //   Pentecostés   l. 3462  «En la Dominica de Pentecostés, y los seis días
  //                          siguientes» → pentecost y pentecostFeria_1..6. La Vigilia
  //                          (easterFeria7_6) no está en esa rúbrica: Común.
  //   Trinidad      l. 3472  «En la Fiesta de la Trinidad solamente» → solo la clave
  //                          'trinity'. Los domingos y ferias después de la Trinidad
  //                          ya NO llevan el Prefacio de la Trinidad (antes sí: 28
  //                          domingos por año).
  //   Todos los S.  l. 3507  «En el día de Todos los Santos, y siete días después» →
  //                          1–8 nov. (por fecha; el 2 de nov. manda el de Difuntos).
  //   Transfiguración l. 3438 «En las Fiestas de la Purificación, la Anunciación y la
  //                          Transfiguración» → 08-06. La Purificación (02-02) y la
  //                          Anunciación (03-25) también las nombra la tabla de
  //                          variantes del prefacio de la Virgen (l. 3601-3617:
  //                          «25 de marzo: …en la Anunciación…»): dos reglas del
  //                          Misal en conflicto, no se resuelve y se conserva el de la
  //                          Virgen (con su variante).
  //   Virgen        l. 3601-3617 variantes de «Festividad» (ver PREFACES.bvm*).
  //   Cruz / San José: l. 3549 y 3564, sin rúbrica de fecha → 14 sep. y 19 mar.
  //   Adviento / Cuaresma / Semana Santa: l. 3494, 3483, 3489, sin rúbrica de
  //                          rango; se asignan al tiempo que nombran. Semana Santa:
  //                          Domingo de Ramos a Sábado Santo. El Domingo y la Semana
  //                          de Pasión (lent5, lentFeria5_*) conservan el mismo texto
  //                          que antes (el de Semana Santa): el Misal no los nombra.
  //
  // Las fiestas fijas con prefacio propio ganan a las octavas (como antes).
  // NOTA: un prefacio tomado del tiempo NO es una suplencia: el prefacio propio de
  // un día de Adviento ES el de Adviento. Por eso `supplied` es siempre false para
  // esta pieza y no lleva rúbrica.
  const PREFACE_BY_SEASON = {
    advent:      'advent',
    lent:        'lent',
    passiontide: 'holyWeek',
    triduum:     'holyWeek',
  };
  const PREFACE_BY_KEY = {
    ascension: 'ascension',
    trinity: 'trinity',
    corpusChristi: 'corpusChristi',   // sin fuente en el Misal (ver MISSING_TEXTS)
    sacredHeart: 'sacredHeart',
    requiem: 'requiem',
    holySpirit: 'pentecost',          // misa votiva: decisión previa del proyecto
    bvm: 'bvm',                       // misa votiva: «…en la Veneración…» (l. 3617)
    '11-01': 'allSaints',
    '11-02': 'requiem',
    '02-02': 'bvmFestividad',
    '03-25': 'bvmAnnunciation',
    '08-15': 'bvmDormition',
    '09-08': 'bvmNativity',
    '03-19': 'stJoseph',
    '08-06': 'incarnationWord',
    '09-14': 'cross',
    // Los comites Christi (26, 27 y 28 de diciembre) caen dentro de la Octava
    // de Navidad y llevan el Prefacio de la Natividad, no el de Apóstoles.
    '12-26': 'christmas',
    '12-27': 'christmas',
    '12-28': 'christmas',
  };
  // Ascensión + siete días: viernes, sábado, domingo (easter7) y lunes a jueves de
  // la semana 7 de Pascua. Más corto que ASCENSION_OCTAVE_KEYS (que llega al viernes).
  ['easterFeria6_5', 'easterFeria6_6', 'easter7', 'easterFeria7_1', 'easterFeria7_2',
   'easterFeria7_3', 'easterFeria7_4'].forEach(k => { PREFACE_BY_KEY[k] = 'ascension'; });
  // Octavas que la propia clave delimita.
  const PREFACE_OCTAVE_KEYS = [
    [/^(christmas|christmasSunday|circumcision)$/, 'christmas'],
    [/^christmasFeria_[1-8]$/,                     'christmas'],
    [/^(epiphany|baptismLord)$/,                   'epiphany'],
    [/^epiOctave_\d+$/,                            'epiphany'],
    [/^(easter|easter2)$/,                         'easter'],
    [/^easterFeria1_\d+$/,                         'easter'],
    [/^(pentecost|pentecostFeria_\d+)$/,           'pentecost'],
  ];
  function resolvePreface(dayKey, season, date) {
    const wrap = (name, source, from) => ({
      value: PREFACES[name], supplied: false, source, from,
      rubric: null, omitted: false, note: null,
    });
    if (dayKey && PREFACE_BY_KEY[dayKey]) return wrap(PREFACE_BY_KEY[dayKey], 'proper', null);
    if (APOSTLE_FEASTS.indexOf(dayKey) >= 0) return wrap('apostles', 'proper', null);
    for (const [re, name] of PREFACE_OCTAVE_KEYS) {
      if (re.test(dayKey || '')) return wrap(name, 'proper', null);
    }
    const s = effectiveSeason(dayKey, season);
    // Octavas que la clave sola no delimita: hace falta la fecha. Sin ella (quien
    // llama no la pasa) la Epifanía conserva el comportamiento anterior y la
    // octava de Todos los Santos no se reconoce.
    if (s === 'epiphany' && /^epiFeria\d+_\d+$/.test(dayKey || '')) {
      if (!(date instanceof Date) || (date.getMonth() === 0 && date.getDate() <= 13)) {
        return wrap('epiphany', 'proper', null);
      }
    }
    if (date instanceof Date && date.getMonth() === 10 && date.getDate() >= 1 && date.getDate() <= 8) {
      return wrap('allSaints', 'proper', null);
    }
    if (s && PREFACE_BY_SEASON[s]) return wrap(PREFACE_BY_SEASON[s], 'season', s);
    return wrap('common', 'generic', null);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  API PÚBLICA
  // ══════════════════════════════════════════════════════════════════════════
  // getProper() devuelve texto + metadatos (`supplied`, `source`, `from`,
  // `rubric`, `omitted`). Los getters antiguos devuelven solo el valor, con las
  // mismas formas de retorno de siempre, para no romper app.js.
  function getProper(part, dayKey, season, date) {
    return resolve(part, dayKey, season, date);
  }
  const valueOf = (part, key, season, date) => resolve(part, key, season, date).value;

  return {
    getProper,
    getCollect:      (key, season) => valueOf('collect', key, season) || 'Colecta no disponible para este día.',
    getPreface:      (key, season, date) => valueOf('preface', key, season, date),
    getIntroit:      (key, season) => valueOf('introit', key, season) || { ant:'' },
    getGradual:      (key, season) => valueOf('gradual', key, season) || null,
    getOffertory:    (key, season) => valueOf('offertory', key, season) || '',
    getCommunion:    (key, season) => valueOf('communion', key, season) || '',
    getSecret:       (key, season) => valueOf('secret', key, season) || '',
    getPostcommunion:(key, season) => valueOf('postcommunion', key, season) || '',
    seasonOfKey,
    PREFACES, COLLECTS, INTROITS, GRADUALS, OFFERTORIES, COMMUNIONS,
    SECRETS, POSTCOMMUNIONS, FEAST_COMMON, MISSING_TEXTS,
  };
})();
