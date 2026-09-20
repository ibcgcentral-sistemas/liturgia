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
 *     Propers.getProper(part, dayKey, season)
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
  const COLLECTS = {
    advent1: `Dios Todopoderoso, danos gracia para que desechemos las obras de las tinieblas y nos revistamos con las armas de la luz, ahora en el tiempo de esta vida mortal, en la cual tu Hijo Jesucristo vino a visitarnos en gran humildad; para que en el último día, cuando venga de nuevo en su gloriosa Majestad a juzgar a vivos y muertos, resucitemos a la vida inmortal, por medio de Aquel que vive y reina contigo y el Espíritu Santo, ahora y siempre. Amén.`,

    advent2: `Señor misericordioso, que hiciste escribir todas las Santas Escrituras para nuestra enseñanza; concédenos que de tal modo las oigamos, leamos, meditemos, aprendamos e interioricemos, que por la paciencia y el consuelo de tu santa Palabra, abracemos y retengamos siempre la esperanza bienaventurada de la vida eterna, que nos has dado en nuestro Salvador Jesucristo. Amén.`,

    advent3: `Oh Señor Jesucristo, que en tu primera venida enviaste a tu mensajero a preparar tu camino delante de ti; concede que los ministros y dispensadores de tus misterios preparen y dispongan también tu camino, convirtiendo los corazones de los desobedientes a la sabiduría de los justos, para que en tu segunda venida a juzgar al mundo nos encuentres como pueblo aceptable ante tus ojos; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    advent4: `Señor, levanta tu poder, te lo suplicamos, y ven a nosotros, y con gran fortaleza socórrenos; para que lo que por nuestros pecados y maldades nos es impedido y estorbado para correr la carrera que nos ha sido propuesta, tu bondadosa gracia y misericordia nos ayude y libre prontamente; por la satisfacción de tu Hijo nuestro Señor, a quien contigo y el Espíritu Santo sea honor y gloria, por los siglos de los siglos. Amén.`,

    christmas: `Dios Todopoderoso, que nos has dado a tu Hijo Unigénito para que tomara nuestra naturaleza, y como en este tiempo naciera de una Virgen pura; concede que nosotros, regenerados y hechos tus hijos por adopción y gracia, seamos renovados cada día por tu Espíritu Santo; por el mismo nuestro Señor Jesucristo, que vive y reina contigo y el mismo Espíritu, un solo Dios, por los siglos de los siglos. Amén.`,

    christmasSunday: `Dios Todopoderoso, que nos has dado a tu Hijo Unigénito para que tomara nuestra naturaleza; concede que, regenerados y hechos tus hijos por adopción y gracia, seamos renovados cada día por tu Espíritu Santo; por el mismo Jesucristo nuestro Señor. Amén.`,
    // Reutiliza la colecta de christmasSunday: mismo tiempo litúrgico, mismo tema
    // (la Encarnación); no existe un texto clásico 1549/1662 propio de este
    // segundo domingo, que es una adición posterior del leccionario.
    christmasSunday2: `Dios Todopoderoso, que nos has dado a tu Hijo Unigénito para que tomara nuestra naturaleza; concede que, regenerados y hechos tus hijos por adopción y gracia, seamos renovados cada día por tu Espíritu Santo; por el mismo Jesucristo nuestro Señor. Amén.`,

    circumcision: `Dios Todopoderoso, que hiciste que tu Hijo bendito fuera circuncidado y obediente a la ley, por el hombre; concédenos la verdadera circuncisión del Espíritu; para que, mortificados nuestros corazones y todos nuestros miembros de toda concupiscencia mundana y carnal, obedezcamos en todo tu santa voluntad; por el mismo tu Hijo Jesucristo nuestro Señor. Amén.`,

    epiphany: `Oh Dios, que por la guía de una estrella manifestaste a tu Hijo Unigénito a los gentiles; concede misericordiosamente que nosotros, que ahora te conocemos por la fe, después de esta vida tengamos la fruición de tu gloriosa divinidad; por Cristo nuestro Señor. Amén.`,

    baptismLord: `Oh Padre Eterno, que en el Bautismo de Jesús lo revelaste como tu Hijo, ungiéndolo con el Espíritu Santo; concede a todos los bautizados en su Nombre que, muriendo al pecado, resuciten a la justicia, y siendo sepultados con él en una muerte semejante a la suya, conozcan también el poder de su resurrección; que vive y reina contigo, en la unidad del mismo Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    // ── DESFASE DE EPIFANÍA (corregido) ─────────────────────────────────────
    // calendar.js reserva el PRIMER domingo después de la Epifanía para el
    // Bautismo del Señor y numera los siguientes epi1..epi5, titulándolos
    // «Segundo…Sexto Domingo después de Epifanía»; lectionary.js les asigna
    // coherentemente las lecturas del 2°…6°. Antes, epi1 llevaba la colecta del
    // PRIMER Domingo después de la Epifanía del BCP: el desfase de un puesto se
    // arrastraba toda la temporada y la colecta del último domingo (BCP VI)
    // nunca se alcanzaba. Ahora epiN lleva la colecta BCP del (N+1)° domingo:
    //   epi1 → BCP II   epi2 → BCP III   epi3 → BCP IV
    //   epi4 → BCP V    epi5 → BCP VI
    // Barrido 2024-2060: epi5 («Sexto Domingo después de Epifanía») es el
    // máximo que el calendario puede emitir, de modo que las seis colectas
    // BCP quedan cubiertas sin sobrar ni faltar ninguna.
    epi1: `Dios Todopoderoso y Eterno, que gobiernas todas las cosas en el cielo y en la tierra; escucha misericordiosamente las súplicas de tu pueblo, y concédenos tu paz todos los días de nuestra vida; por Jesucristo nuestro Señor. Amén.`,
    epi2: `Dios Todopoderoso y Eterno, mira misericordiosamente nuestras debilidades, y en todos nuestros peligros y necesidades extiende tu diestra para ayudarnos y defendernos; por Jesucristo nuestro Señor. Amén.`,
    epi3: `Oh Dios, que sabes que estamos puestos en medio de tantos y tan grandes peligros, que por la fragilidad de nuestra naturaleza no podemos estar siempre firmes; concédenos tal fortaleza y protección que nos sostenga en todos los peligros y nos lleve a través de todas las tentaciones; por Jesucristo nuestro Señor. Amén.`,
    epi4: `Oh Señor, te suplicamos que guardes tu Iglesia y familia continuamente en tu verdadera religión; para que los que se apoyan sólo en la esperanza de tu gracia celestial sean siempre defendidos por tu poderoso auxilio; por Jesucristo nuestro Señor. Amén.`,
    epi5: `Oh Dios, cuyo bendito Hijo fue manifestado para destruir las obras del diablo y hacernos hijos de Dios y herederos de la vida eterna; concédenos, te suplicamos, que teniendo esta esperanza, nos purifiquemos como él es puro; para que cuando aparezca de nuevo con poder y gran gloria, seamos hechos semejantes a él en su reino eterno y glorioso; donde contigo, oh Padre, y contigo, oh Espíritu Santo, vive y reina, un solo Dios, por los siglos de los siglos. Amén.`,
    // Colecta del PRIMER Domingo después de la Epifanía del BCP. Su domingo lo
    // ocupa ahora el Bautismo del Señor (que tiene colecta propia), así que en
    // vez de suprimirla se conserva como COLECTA DEL TIEMPO de la Epifanía:
    // es el eslabón «del tiempo» de la cadena de respaldo para cualquier feria
    // o fiesta de Epifanía sin colecta propia. No es texto inventado.
    epiphanySeason: `Oh Señor, te suplicamos que recibas misericordiosamente las oraciones de tu pueblo que te invoca; y concede que conozcan y entiendan las cosas que deben hacer, y tengan gracia y poder para cumplirlas fielmente; por Jesucristo nuestro Señor. Amén.`,

    septuagesima: `Oh Señor, te suplicamos que oigas favorablemente las oraciones de tu pueblo; para que nosotros, que somos justamente castigados por nuestras ofensas, seamos misericordiosamente librados por tu bondad, para gloria de tu Nombre; por Jesucristo nuestro Salvador. Amén.`,
    sexagesima: `Oh Señor Dios, que ves que no ponemos nuestra confianza en cosa alguna que hagamos; concede misericordiosamente que por tu poder seamos defendidos contra toda adversidad; por Jesucristo nuestro Señor. Amén.`,
    quinquagesima: `Oh Señor, que nos has enseñado que sin caridad todo lo que hacemos nada vale; envía tu Espíritu Santo y derrama en nuestros corazones aquel excelentísimo don de la caridad, vínculo de la paz y de todas las virtudes; concede esto por tu único Hijo Jesucristo. Amén.`,

    ashWednesday: `Dios Todopoderoso y Eterno, que no aborreces nada de lo que has hecho, y perdonas los pecados de todos los que son penitentes; crea y forma en nosotros corazones nuevos y contritos, para que, lamentando dignamente nuestros pecados y reconociendo nuestra miseria, obtengamos de ti, Dios de toda misericordia, perfecto perdón y remisión; por Jesucristo nuestro Señor. Amén.`,

    lent1: `Oh Señor, que por nosotros ayunaste cuarenta días y cuarenta noches; danos gracia para usar tal abstinencia, que nuestra carne, sometida al Espíritu, obedezca siempre tus santas inspiraciones en justicia y verdadera santidad, para tu honor y gloria; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,
    lent2: `Dios Todopoderoso, que ves que no tenemos poder por nosotros mismos para ayudarnos; guárdanos tanto exteriormente en nuestros cuerpos como interiormente en nuestras almas; para que seamos defendidos de toda adversidad que pueda acontecer al cuerpo, y de todo mal pensamiento que pueda asaltar y dañar el alma; por Jesucristo nuestro Señor. Amén.`,
    lent3: `Te suplicamos, Dios Todopoderoso, mira los fervientes deseos de tus humildes siervos, y extiende la diestra de tu Majestad, para ser nuestra defensa contra todos nuestros enemigos; por Jesucristo nuestro Señor. Amén.`,
    lent4: `Concede, te suplicamos, Dios Todopoderoso, que nosotros, que por nuestras malas obras merecemos justamente ser castigados, por el consuelo de tu gracia seamos misericordiosamente aliviados; por nuestro Señor y Salvador Jesucristo. Amén.`,
    lent5: `Te suplicamos, Dios Todopoderoso, mira misericordiosamente a tu pueblo; para que por tu gran bondad sea gobernado y preservado siempre, tanto en cuerpo como en alma; por Jesucristo nuestro Señor. Amén.`,

    palmSunday: `Dios Todopoderoso y Eterno, que por tu tierno amor hacia el género humano enviaste a tu Hijo nuestro Salvador Jesucristo a tomar nuestra carne y a sufrir muerte en la cruz, para que todo el género humano siguiese el ejemplo de su gran humildad; concede misericordiosamente que sigamos el ejemplo de su paciencia y seamos hechos partícipes de su resurrección; por el mismo Jesucristo nuestro Señor. Amén.`,

    maundyThursday: `Señor Jesucristo, que en tu Última Cena, la noche en que fuiste entregado, instituiste el misterio de tu Cuerpo y Sangre; concede misericordiosamente que nosotros, no indignos receptores, recibamos tu santo Cuerpo y Sangre como remedio salvador para la salud del cuerpo y del alma, y como memorial perpetuo de tu Pasión; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    goodFriday: `Dios Todopoderoso, te suplicamos que mires con bondad a esta tu familia, por la cual nuestro Señor Jesucristo se dignó ser entregado en manos de hombres malvados y sufrir muerte en la cruz; que ahora vive y reina contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    holySaturday: `Concede, oh Señor, que así como somos bautizados en la muerte de tu Hijo bendito nuestro Salvador Jesucristo, así por la continua mortificación de nuestras corruptas afecciones seamos sepultados con él; y que por la puerta de la muerte pasemos a nuestra gozosa resurrección; por los méritos de Aquel que murió, fue sepultado y resucitó por nosotros. Amén.`,

    easter: `Dios Todopoderoso, que por tu Hijo Unigénito Jesucristo has vencido la muerte y nos has abierto la puerta de la vida eterna; te suplicamos humildemente que, así como por tu gracia especial que nos previene pones en nuestras mentes buenos deseos, así por tu continua ayuda los llevemos a buen efecto; por Jesucristo nuestro Señor, que vive y reina contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    easter2: `Padre Todopoderoso, que has dado a tu Hijo Unigénito para morir por nuestros pecados y resucitar para nuestra justificación; concédenos que de tal manera apartemos la levadura de malicia y maldad, que siempre te sirvamos en pureza de vida y verdad; por los méritos del mismo tu Hijo Jesucristo nuestro Señor. Amén.`,
    easter3: `Dios Todopoderoso, que muestras a los que están en error la luz de tu verdad para que puedan volver al camino de la justicia; concede a todos los que son admitidos en la comunión de la Religión de Cristo, que eviten lo que es contrario a su profesión y sigan lo que es conforme a ella; por nuestro Señor Jesucristo. Amén.`,
    easter4: `Dios Todopoderoso, que has preparado para los que te aman bienes tales que superan todo entendimiento humano; derrama en nuestros corazones tal amor hacia ti, que amándote en todas las cosas y sobre todas las cosas, obtengamos tus promesas, que exceden todo cuanto podemos desear; por Jesucristo nuestro Señor. Amén.`,
    easter5: `Oh Señor, de quien provienen todos los bienes; concede a nosotros, tus humildes siervos, que por tu santa inspiración pensemos lo que es bueno, y por tu guía misericordiosa lo realicemos; por nuestro Señor Jesucristo. Amén.`,
    easter6: `Oh Dios, Rey de gloria, que has exaltado a tu Hijo Unigénito Jesucristo con gran triunfo a tu Reino en el cielo; te suplicamos, no nos dejes desamparados, sino envíanos tu Espíritu Santo para consolarnos y exaltarnos al mismo lugar adonde nuestro Salvador Cristo nos ha precedido. Amén.`,

    ascension: `Concede, te suplicamos, Dios Todopoderoso, que así como creemos que tu Hijo Unigénito nuestro Señor Jesucristo ascendió a los cielos, así también nosotros ascendamos allí con el corazón y la mente, y moremos continuamente con él; que vive y reina contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    easter7: `Oh Dios, Rey de gloria, que has exaltado a tu Hijo Unigénito Jesucristo con gran triunfo a tu Reino en el cielo; te suplicamos, no nos dejes desamparados, sino envíanos tu Espíritu Santo para consolarnos. Amén.`,

    pentecost: `Dios, que como en este tiempo enseñaste los corazones de tu pueblo fiel enviándoles la luz de tu Espíritu Santo; concédenos por el mismo Espíritu tener recto juicio en todas las cosas y gozar siempre de su santo consuelo; por los méritos de Jesucristo nuestro Salvador, que vive y reina contigo, en la unidad del mismo Espíritu, un solo Dios, por los siglos de los siglos. Amén.`,

    trinity: `Dios Todopoderoso y Eterno, que nos has dado a nosotros tus siervos la gracia de reconocer la gloria de la eterna Trinidad por la confesión de la verdadera fe, y de adorar la Unidad en el poder de la Divina Majestad; te suplicamos nos guardes firmes en esta fe y nos defiendas siempre de toda adversidad; tú que vives y reinas, un solo Dios, por los siglos de los siglos. Amén.`,

    corpusChristi: `Oh Dios, que en este admirable Sacramento nos dejaste el memorial de tu Pasión; concédenos, te suplicamos, venerar de tal modo los sagrados misterios de tu Cuerpo y Sangre, que percibamos siempre en nosotros el fruto de tu redención; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    sacredHeart: `Oh Señor Jesucristo, que inflamaste los corazones de tus santos con amor por ti y deseas que seamos consumidos por la caridad hacia Dios y hacia los hombres; concede, te suplicamos, que el ardor de aquella dulcísima caridad sea encendido en nuestros corazones, de modo que todo frío de corazón sea enteramente consumido y nos unamos a ti, Señor y Dios nuestro, con todo nuestro corazón; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    trinity1: `Oh Dios, fortaleza de todos los que en ti confían; acepta misericordiosamente nuestras oraciones; y porque por la debilidad de nuestra naturaleza mortal nada bueno podemos hacer sin ti, concédenos la ayuda de tu gracia, para que guardando tus mandamientos te agrademos tanto en la voluntad como en las obras; por Jesucristo nuestro Señor. Amén.`,
    trinity2: `Oh Señor, haz que tengamos perpetuo amor y reverencia a tu santo Nombre; porque nunca dejas de ayudar y gobernar a aquellos a quienes educas en tu firme temor y amor; por Jesucristo nuestro Señor. Amén.`,
    trinity3: `Oh Señor, te suplicamos que nos oigas misericordiosamente; y concede que nosotros, a quienes has dado ferviente deseo de orar, seamos por tu poderoso auxilio defendidos y consolados en todos los peligros y adversidades; por Jesucristo nuestro Señor. Amén.`,
    trinity4: `Oh Dios, protector de todos los que en ti confían, sin quien nada es fuerte, nada es santo; acrecienta y multiplica sobre nosotros tu misericordia; para que, siendo tú nuestro rector y guía, de tal modo pasemos por los bienes temporales que finalmente no perdamos los eternos; concede esto, oh Padre celestial, por amor de Jesucristo nuestro Señor. Amén.`,
    trinity5: `Concede, oh Señor, te suplicamos, que el curso de este mundo sea tan pacíficamente ordenado por tu gobierno, que tu Iglesia te sirva con gozo en toda santa quietud; por Jesucristo nuestro Señor. Amén.`,
    trinity6: `Oh Dios, que has preparado para los que te aman bienes tales que superan todo entendimiento humano; derrama en nuestros corazones tal amor hacia ti, que amándote sobre todas las cosas, obtengamos tus promesas que exceden todo cuanto podemos desear; por Jesucristo nuestro Señor. Amén.`,
    trinity7: `Señor de todo poder y fortaleza, que eres autor y dador de todos los bienes; injerta en nuestros corazones el amor de tu Nombre, acrecienta en nosotros la verdadera religión, aliméntanos con toda bondad, y por tu gran misericordia guárdanos en ella; por Jesucristo nuestro Señor. Amén.`,
    trinity8: `Oh Dios, cuya providencia nunca falla y ordena todas las cosas en el cielo y en la tierra; te suplicamos humildemente que apartes de nosotros todo lo dañoso y nos des lo que nos es provechoso; por Jesucristo nuestro Señor. Amén.`,
    trinity9: `Concédenos, Señor, te suplicamos, el espíritu de pensar y hacer siempre lo que es justo; para que nosotros, que no podemos hacer nada bueno sin ti, seamos habilitados por ti para vivir según tu voluntad; por Jesucristo nuestro Señor. Amén.`,
    trinity10: `Que tus misericordiosos oídos, oh Señor, estén abiertos a las oraciones de tus humildes siervos; y para que obtengan sus peticiones, haz que pidan lo que te agrada; por Jesucristo nuestro Señor. Amén.`,
    trinity11: `Oh Dios, que declaras tu poder todopoderoso principalmente mostrando misericordia y piedad; concédenos misericordiosamente tal medida de tu gracia, que corriendo por el camino de tus mandamientos, obtengamos tus bondadosas promesas y seamos hechos partícipes de tu tesoro celestial; por Jesucristo nuestro Señor. Amén.`,
    trinity12: `Dios Todopoderoso y Eterno, que siempre estás más pronto a oír que nosotros a orar, y acostumbras dar más de lo que deseamos o merecemos; derrama sobre nosotros la abundancia de tu misericordia; perdonándonos aquellas cosas de las cuales nuestra conciencia tiene temor, y dándonos aquellos bienes que no somos dignos de pedir sino por los méritos y mediación de Jesucristo, tu Hijo, nuestro Señor. Amén.`,
    trinity13: `Dios Todopoderoso y misericordioso, de cuyo solo don viene que tu pueblo fiel te rinda verdadero y laudable servicio; concédenos, te suplicamos, que te sirvamos tan fielmente en esta vida, que finalmente no dejemos de alcanzar tus promesas celestiales; por los méritos de Jesucristo nuestro Señor. Amén.`,
    trinity14: `Oh Dios, pues sin ti no somos capaces de agradarte; concede misericordiosamente que tu Espíritu Santo en todas las cosas dirija y gobierne nuestros corazones; por Jesucristo nuestro Señor. Amén.`,
    trinity15: `Guarda, te suplicamos, oh Señor, tu Iglesia con tu perpetua misericordia; y porque la fragilidad del hombre sin ti no puede sino caer, guárdanos siempre por tu ayuda de todo lo dañoso y condúcenos a todo lo que es provechoso para nuestra salvación; por Jesucristo nuestro Señor. Amén.`,
    trinity16: `Oh Señor, te suplicamos que tu continua misericordia limpie y defienda tu Iglesia; y porque sin tu socorro no puede continuar en seguridad, consérvala siempre por tu ayuda y bondad; por Jesucristo nuestro Señor. Amén.`,
    trinity17: `Señor, te rogamos que tu gracia nos prevenga y nos siga siempre, y nos haga continuamente dedicados a todas las buenas obras; por Jesucristo nuestro Señor. Amén.`,
    trinity18: `Señor, te suplicamos, concede a tu pueblo gracia para resistir las tentaciones del mundo, la carne y el diablo, y con corazones y mentes puros seguirte a ti, el único Dios; por Jesucristo nuestro Señor. Amén.`,
    trinity19: `Oh Dios, pues sin ti no somos capaces de agradarte; concede misericordiosamente que tu Espíritu Santo en todas las cosas dirija y gobierne nuestros corazones; por Jesucristo nuestro Señor. Amén.`,
    trinity20: `Dios Todopoderoso y misericordiosísimo, concede, te suplicamos, a nosotros que nos hemos desviado, la gracia de tu Espíritu Santo, para que, corregidos de nuestras errantes andanzas, permanezcamos firmes en el camino de la salvación; por Jesucristo nuestro Señor. Amén.`,
    trinity21: `Concede, te suplicamos, Señor misericordioso, a tu pueblo fiel perdón y paz, para que sea limpiado de todos sus pecados y te sirva con ánimo tranquilo; por Jesucristo nuestro Señor. Amén.`,
    trinity22: `Señor, te suplicamos que guardes tu familia la Iglesia en continua piedad; para que por tu protección esté libre de toda adversidad, y devotamente dedicada a servirte en buenas obras, para gloria de tu Nombre; por Jesucristo nuestro Señor. Amén.`,
    trinity23: `Oh Dios, nuestro refugio y fortaleza, autor de toda piedad; está pronto, te suplicamos, a oír las devotas oraciones de tu Iglesia; y concede que lo que pedimos fielmente, lo obtengamos efectivamente; por Jesucristo nuestro Señor. Amén.`,
    trinity24: `Oh Señor, te suplicamos, absuelve a tu pueblo de sus ofensas; para que por tu bondadosa generosidad seamos todos librados de las ataduras de aquellos pecados que por nuestra fragilidad hemos cometido; concede esto, oh Padre celestial, por amor de Jesucristo, nuestro bendito Señor y Salvador. Amén.`,
    trinity25: `Despierta, te suplicamos, oh Señor, las voluntades de tu pueblo fiel; para que, produciendo abundantemente el fruto de buenas obras, sean de ti abundantemente recompensados; por Jesucristo nuestro Señor. Amén.`,
    trinity26: `Oh Señor Jesucristo, que eres el Rey de reyes y Señor de señores; concede que todos los reinos de este mundo sean el reino de nuestro Señor y de su Cristo; para que bajo tu suave yugo todas las naciones encuentren su verdadera paz, y así te rindan el homenaje de sus corazones y sus vidas; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    // 27°/28° Domingo después de la Trinidad: solo ocurren cuando Pascua cae muy
    // temprano (p.ej. 2035, 2046, 2062). El Libro de Oración Común clásico no
    // define colectas propias más allá del 25°/26°; siguiendo el espíritu de su
    // rúbrica (reutilizar propios ya aprobados en vez de dejar el domingo sin
    // colecta), se repite aquí la del 26°.
    trinity27: `Oh Señor Jesucristo, que eres el Rey de reyes y Señor de señores; concede que todos los reinos de este mundo sean el reino de nuestro Señor y de su Cristo; para que bajo tu suave yugo todas las naciones encuentren su verdadera paz, y así te rindan el homenaje de sus corazones y sus vidas; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,
    trinity28: `Oh Señor Jesucristo, que eres el Rey de reyes y Señor de señores; concede que todos los reinos de este mundo sean el reino de nuestro Señor y de su Cristo; para que bajo tu suave yugo todas las naciones encuentren su verdadera paz, y así te rindan el homenaje de sus corazones y sus vidas; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,

    // Colectas de fiestas fijas — copiadas de SAINT_COLLECTS en commemorations.js
    // (que hasta ahora solo se usaban cuando la fiesta se conmemora, nunca cuando
    // ES la celebración principal del día). Sin esta entrada, Propers.getCollect()
    // caía al 15° Domingo después de la Trinidad en cualquier año en que la fiesta
    // cayera en feria — es decir, la mayoría de las veces.
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
    '11-30': `Dios Todopoderoso, que diste a tu Apóstol Andrés la gracia de obedecer prontamente la llamada de tu Hijo Jesucristo y de traer a su hermano consigo; danos a nosotros la misma gracia de llamar a los que son queridos para nosotros para que vengan a tu servicio; por el mismo Jesucristo nuestro Señor. Amén.`,
    '12-21': `Dios Todopoderoso, que diste a tu Apóstol Tomás la voluntad de dudar, para que por su duda pudiéramos ser fortalecidos en la fe; concede que, no dudando más, creamos en tu Hijo Jesucristo, tanto como Señor como Dios; quien vive y reina contigo, en la unidad del Espíritu Santo, un solo Dios, ahora y por los siglos de los siglos. Amén.`,
    '12-26': `Concede, Señor, que en todos nuestros sufrimientos por la verdad y la justicia tengamos con nosotros ese mismo espíritu que hizo a tu primer mártir San Esteban orar por sus perseguidores; por Jesucristo nuestro Señor. Amén.`,
    '12-27': `Señor Misericordioso, que permitiste a tu Apóstol y Evangelista San Juan beber de la copa de tus sufrimientos en este mundo; concédenos, que también nosotros, fortalecidos por su ejemplo, y fieles a tu verdad, podamos beber de la misma copa y ser bautizados con el mismo bautismo; por Jesucristo nuestro Señor. Amén.`,
    '12-28': `Dios Todopoderoso, que desde la boca de los niños de pecho perfeccionaste la alabanza; confunde las maquinaciones de los crueles y descarta la soberbia de los malvados; pues los Santos Inocentes en este día confiesan y alaban tu Majestad con su muerte; por Jesucristo nuestro Señor. Amén.`,
    '11-01': `Oh Dios Todopoderoso, que has unido a tus elegidos en una sola comunión y hermandad en el Cuerpo Místico de tu Hijo Cristo nuestro Señor; concédenos gracia para seguir a tus bienaventurados Santos en toda vida virtuosa y piadosa, para que lleguemos a aquellos gozos inefables que has preparado para los que te aman sin fingimiento; por Jesucristo nuestro Señor. Amén.`,
    '11-02': `Oh Dios misericordioso, Padre de nuestro Señor Jesucristo, que es la resurrección y la vida; te suplicamos humildemente, oh Padre, que nos resucites de la muerte del pecado a la vida de la justicia; para que cuando partamos de esta vida, descansemos en él; y que en la resurrección general del último día seamos hallados aceptos ante tus ojos; por Jesucristo nuestro Señor. Amén.`,
    requiem: `Oh Dios, Creador y Redentor de todos los fieles, concede a las almas de tus siervos y siervas la remisión de todos sus pecados; para que, mediante nuestras piadosas súplicas, obtengan el perdón que siempre han deseado; tú que vives y reinas con el Padre y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,
    holySpirit: `Oh Dios, que iluminaste los corazones de tus fieles con la luz del Espíritu Santo; concédenos que por el mismo Espíritu saboreemos la rectitud y nos gocemos siempre en su consuelo; por Jesucristo nuestro Señor, que vive y reina contigo, en la unidad del mismo Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén.`,
    bvm: `Te suplicamos, Señor, que derrames tu gracia en nuestras almas; para que los que hemos conocido, por el anuncio del ángel, la Encarnación de tu Hijo Jesucristo, por su Pasión y su Cruz seamos llevados a la gloria de su Resurrección; por el mismo Jesucristo nuestro Señor. Amén.`,
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  PREFACIOS PROPIOS
  // ══════════════════════════════════════════════════════════════════════════
  const PREFACES = {
    common: {
      title: 'Prefacio Común',
      text: `En verdad es justo y necesario, es nuestro deber y salvación, darte gracias siempre y en todo lugar, Señor, Padre Santo, Dios Todopoderoso y Eterno. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
      intro: `En verdad es justo y necesario, es nuestro deber y salvación, darte gracias siempre y en todo lugar, Señor, Padre Santo, Dios Todopoderoso y Eterno. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    advent: {
      title: 'Prefacio de Adviento',
      intro: `Porque tu Hijo, nuestro Señor Jesucristo, en su primera venida se humilló y tomó la forma de siervo, para librarnos de la esclavitud del pecado; y vendrá de nuevo en la majestad de tu gloria, para presentarte un reino eterno y universal: reino de verdad y vida, de santidad y gracia, de justicia, amor y paz. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    christmas: {
      title: 'Prefacio de la Natividad',
      intro: `Porque diste a Jesucristo tu Hijo Unigénito para nacer como en este tiempo por nosotros; quien por obra del Espíritu Santo fue hecho verdadero hombre de la sustancia de la Virgen María su madre; y esto sin mancha de pecado, para limpiarnos de todo pecado. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    epiphany: {
      title: 'Prefacio de la Epifanía',
      intro: `Por Jesucristo nuestro Señor; quien en la sustancia de nuestra carne mortal manifestó su gloria, para sacarnos de las tinieblas a su luz admirable. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    lent: {
      title: 'Prefacio de Cuaresma',
      intro: `Por Jesucristo nuestro Señor; que fue tentado en todo como nosotros, pero sin pecado; que ayunó cuarenta días y cuarenta noches en el desierto; y nos ha mandado negarnos a nosotros mismos, tomar nuestra cruz y seguirle; para que, siguiendo su santo ejemplo, obtengamos gracia para mortificar nuestras malas pasiones y obedecer su santa voluntad. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    holyWeek: {
      title: 'Prefacio de la Pasión',
      intro: `Por Jesucristo nuestro Señor; quien en el árbol de la Cruz dio la salvación al género humano; para que de donde vino la muerte, de allí surgiera también la vida; y el que por un árbol venció, por un árbol fuera también vencido; por Cristo nuestro Señor. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    easter: {
      title: 'Prefacio de Pascua',
      intro: `Pero principalmente estamos obligados a alabarte por la gloriosa Resurrección de tu Hijo Jesucristo nuestro Señor; porque él es el verdadero Cordero Pascual que fue ofrecido por nosotros y ha quitado el pecado del mundo; quien por su muerte ha destruido la muerte, y resucitando a la vida nos ha devuelto la vida eterna. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    ascension: {
      title: 'Prefacio de la Ascensión',
      intro: `Por tu amadísimo Hijo Jesucristo nuestro Señor; quien después de su gloriosísima Resurrección se manifestó a todos sus Apóstoles, y a la vista de ellos ascendió al cielo para prepararnos un lugar; para que donde él está, allí ascendamos también nosotros y reinemos con él en la gloria. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    pentecost: {
      title: 'Prefacio de Pentecostés',
      intro: `Por Jesucristo nuestro Señor; conforme a cuya verdadera promesa, el Espíritu Santo descendió como en este tiempo del cielo con un estruendo repentino y grande, como de un viento impetuoso, en forma de lenguas de fuego, posándose sobre los Apóstoles, para enseñarles y conducirles a toda verdad; dándoles el don de diversas lenguas y también osadía con ferviente celo para predicar constantemente el Evangelio a todas las naciones. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    trinity: {
      title: 'Prefacio de la Santísima Trinidad',
      intro: `Que eres un solo Dios, un solo Señor; no una sola Persona, sino tres Personas en una sola Sustancia. Porque lo que creemos de la gloria del Padre, lo mismo creemos del Hijo y del Espíritu Santo, sin ninguna diferencia ni desigualdad. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    apostles: {
      title: 'Prefacio de los Apóstoles',
      intro: `Por el gran pastor de tus ovejas, Jesucristo nuestro Señor; quien después de su Resurrección envió a sus Apóstoles a predicar el Evangelio a todas las naciones y a congregar para sí una Iglesia santa y sin mancha, edificada sobre el fundamento de los Apóstoles y Profetas, siendo Cristo mismo la piedra angular. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    bvm: {
      title: 'Prefacio de la Bienaventurada Virgen María',
      intro: `Y darte gracias por la Virgen Madre María; de la cual nació Jesucristo, nuestro Señor y Dios. Quien por obra del Espíritu Santo fue concebido en su vientre virginal; y permaneciendo siempre Virgen, dio a luz al mundo la Luz eterna, Jesucristo nuestro Señor. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    requiem: {
      title: 'Prefacio de Difuntos',
      intro: `Por Jesucristo nuestro Señor; en quien la esperanza de la bienaventurada resurrección ha brillado sobre nosotros, para que aquellos que se entristecen por la certeza de morir sean consolados por la promesa de la inmortalidad futura. Porque para tus fieles, Señor, la vida no termina, se transforma; y al deshacerse nuestra morada terrenal, adquirimos una mansión eterna en el cielo. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    corpusChristi: {
      title: 'Prefacio del Corpus Christi',
      intro: `Por Jesucristo nuestro Señor; quien la víspera de su Pasión tomó el pan en sus santas y venerables manos, y elevando los ojos hacia ti, Dios su Padre Todopoderoso, dándote gracias, lo bendijo, lo partió y lo dio a sus discípulos diciendo: Tomad y comed todos de él, porque éste es mi Cuerpo. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    sacredHeart: {
      title: 'Prefacio del Sagrado Corazón',
      intro: `Por Jesucristo tu Hijo, nuestro Señor; quien levantado en la Cruz abrió las corrientes de tu misericordia, y de su costado traspasado derramó Sangre y Agua, fuentes de la gracia sacramental; y abierto su corazón para nosotros, se convirtió en puerta de la salvación eterna. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
    allSaints: {
      title: 'Prefacio de Todos los Santos',
      intro: `Que en la multitud de tus Santos nos has rodeado con tan gran nube de testigos, para que, gozándonos en su compañía, corramos con perseverancia la carrera que nos ha sido propuesta; y juntamente con ellos recibamos la corona de gloria que no se marchita. Por eso, con los Ángeles y Arcángeles, y con toda la corte celestial, alabamos y magnificamos tu glorioso Nombre; siempre alabándote y diciendo:`,
    },
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
    { part: 'gradual',       need: 'Graduales propios de los 28 Domingos después de la Trinidad' },
    { part: 'gradual',       need: 'Graduales/Tractos de las fiestas fijas no marianas' },
    { part: 'offertory',     need: 'Ofertorio del tiempo de Pre-Cuaresma' },
    { part: 'offertory',     need: 'Ofertorios propios de Adviento II-IV, Cuaresma II-V y de los Domingos después de la Trinidad' },
    { part: 'offertory',     need: 'Ofertorios de las fiestas fijas no marianas' },
    { part: 'communion',     need: 'Comunión del tiempo de Pre-Cuaresma' },
    { part: 'communion',     need: 'Comuniones propias de Adviento II-III, Cuaresma II-V y de los Domingos después de la Trinidad' },
    { part: 'communion',     need: 'Comuniones de las fiestas fijas no marianas' },
    { part: 'collect',       need: 'Colectas propias de las ferias de Cuaresma, Adviento y Tiempo de Navidad (hoy toman la del domingo precedente, uso admitido)' },
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
  // El Viernes Santo se celebra la Misa de los Presantificados: no hay
  // Ofertorio ni Secreta (ni Canon ni Prefacio). Antes rezaba la Secreta del
  // tiempo de la Trinidad por puro descarte.
  const OMITTED = {
    goodFriday: {
      offertory: 'La Misa de los Presantificados del Viernes Santo no tiene Ofertorio.',
      secret:    'La Misa de los Presantificados del Viernes Santo no tiene Secreta: no hay ofrenda ni Canon.',
    },
  };

  function none(part, key) {
    const note = OMITTED[key] && OMITTED[key][part];
    return { value: (part === 'introit') ? { ant:'' } : (part === 'gradual' ? null : ''),
             supplied: false, source: 'none', from: null, rubric: null,
             omitted: true, note: note || null };
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  RESOLUCIÓN GENERAL: clave exacta → Común de la fiesta → tiempo → genérico
  // ══════════════════════════════════════════════════════════════════════════
  function resolve(part, dayKey, season) {
    if (part === 'preface') return resolvePreface(dayKey, season);
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
  // Antes la lista comparaba por igualdad exacta contra christmas /
  // christmasSunday / circumcision, de modo que christmasSunday2, el 26, 27 y
  // 28 de diciembre y las ferias christmasFeria_* de la Octava se quedaban con
  // el Prefacio Común. Ahora el despacho es: fiesta concreta → tiempo deducido
  // de la clave (que cubre las 420 claves de calendar.js) → Común.
  // NOTA: un prefacio tomado del tiempo NO es una suplencia: el prefacio propio
  // de un día de Adviento ES el de Adviento. Por eso `supplied` es siempre
  // false para esta pieza y no lleva rúbrica.
  const PREFACE_BY_SEASON = {
    advent:     'advent',
    christmas:  'christmas',
    epiphany:   'epiphany',
    preLent:    'common',
    lent:       'lent',
    passiontide:'holyWeek',
    triduum:    'holyWeek',
    easter:     'easter',
    pentecost:  'pentecost',
    trinity:    'trinity',
  };
  const PREFACE_BY_KEY = {
    ascension: 'ascension',
    trinity: 'trinity',
    corpusChristi: 'corpusChristi',
    sacredHeart: 'sacredHeart',
    requiem: 'requiem',
    holySpirit: 'pentecost',
    bvm: 'bvm',
    '11-01': 'allSaints',
    '11-02': 'requiem',
    '02-02': 'bvm',
    '03-25': 'bvm',
    '08-15': 'bvm',
    '09-08': 'bvm',
    // Los comites Christi (26, 27 y 28 de diciembre) caen dentro de la Octava
    // de Navidad y llevan el Prefacio de la Natividad, no el de Apóstoles.
    '12-26': 'christmas',
    '12-27': 'christmas',
    '12-28': 'christmas',
  };
  function resolvePreface(dayKey, season) {
    const wrap = (name, source, from) => ({
      value: PREFACES[name], supplied: false, source, from,
      rubric: null, omitted: false, note: null,
    });
    if (dayKey && PREFACE_BY_KEY[dayKey]) return wrap(PREFACE_BY_KEY[dayKey], 'proper', null);
    if (APOSTLE_FEASTS.indexOf(dayKey) >= 0) return wrap('apostles', 'proper', null);
    // El Prefacio de la Santísima Trinidad se dice en los DOMINGOS del tiempo
    // después de la Trinidad que no tienen prefacio propio; las ferias de ese
    // tiempo (ordinaryFeria*) llevan el Prefacio Común. Se conserva así el
    // comportamiento anterior, que en este punto era el correcto.
    if (/^ordinaryFeria/.test(dayKey || '')) return wrap('common', 'season', 'trinity');
    const s = effectiveSeason(dayKey, season);
    if (s && PREFACE_BY_SEASON[s]) return wrap(PREFACE_BY_SEASON[s], 'season', s);
    return wrap('common', 'generic', null);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  API PÚBLICA
  // ══════════════════════════════════════════════════════════════════════════
  // getProper() devuelve texto + metadatos (`supplied`, `source`, `from`,
  // `rubric`, `omitted`). Los getters antiguos devuelven solo el valor, con las
  // mismas formas de retorno de siempre, para no romper app.js.
  function getProper(part, dayKey, season) {
    return resolve(part, dayKey, season);
  }
  const valueOf = (part, key, season) => resolve(part, key, season).value;

  return {
    getProper,
    getCollect:      (key, season) => valueOf('collect', key, season) || 'Colecta no disponible para este día.',
    getPreface:      (key, season) => valueOf('preface', key, season),
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
