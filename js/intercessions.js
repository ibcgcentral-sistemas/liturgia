/**
 * intercessions.js — Oración de los Fieles
 * Adaptada dinámicamente al Evangelio y las lecturas del día — Todo en español
 */

const Intercessions = (() => {

  // ══════════════════════════════════════════════════════════════════════════
  //  TEMAS DEL EVANGELIO — Mapa directo por referencia
  // ══════════════════════════════════════════════════════════════════════════
  const GOSPEL_THEMES = {
    'Matthew 24:36-44': 'vigilancia', 'Matthew 3:1-12': 'arrepentimiento',
    'Matthew 11:2-11': 'esperanza', 'Matthew 1:18-25': 'fe',
    'Matthew 4:1-11': 'tentación', 'Matthew 5:1-12': 'caridad',
    'Matthew 5:13-20': 'verdad', 'Matthew 5:21-37': 'justicia',
    'Matthew 5:38-48': 'amor', 'Matthew 6:1-6,16-21': 'oración',
    'Matthew 6:24-34': 'esperanza', 'Matthew 17:1-9': 'fe',
    'Matthew 28:16-20': 'servicio', 'Matthew 9:9-13': 'perdón',
    'Matthew 9:35-10:8': 'servicio', 'Matthew 10:24-39': 'fe',
    'Matthew 10:40-42': 'servicio', 'Matthew 11:16-19,25-30': 'humildad',
    'Matthew 13:1-9,18-23': 'fe', 'Matthew 13:24-30,36-43': 'justicia',
    'Matthew 14:13-21': 'milagro', 'Matthew 14:22-33': 'fe',
    'Matthew 16:13-19': 'fe', 'Matthew 16:13-20': 'fe',
    'Matthew 16:21-28': 'fe', 'Matthew 18:1-5,10': 'humildad',
    'Matthew 18:15-20': 'perdón', 'Matthew 18:21-35': 'perdón',
    'Matthew 20:1-16': 'justicia', 'Matthew 20:20-28': 'servicio',
    'Matthew 22:1-14': 'vigilancia', 'Matthew 22:15-22': 'verdad',
    'Matthew 22:34-46': 'amor', 'Matthew 24:36-44': 'vigilancia',
    'Matthew 25:1-13': 'vigilancia', 'Matthew 25:14-30': 'servicio',
    'Matthew 25:31-46': 'caridad', 'Matthew 2:1-12': 'fe',
    'Matthew 10:17-22': 'fe', 'Matthew 1:1-16,18-23': 'fe',
    'Matthew 1:16,18-21,24': 'fe', 'Matthew 2:13-18': 'esperanza',
    'Mark 1:1-8': 'arrepentimiento', 'Mark 1:4-11': 'fe',
    'Mark 1:9-15': 'fe', 'Mark 1:14-20': 'fe',
    'Mark 1:21-28': 'milagro', 'Mark 1:29-39': 'sanación',
    'Mark 1:40-45': 'sanación', 'Mark 2:1-12': 'perdón',
    'Mark 4:26-34': 'fe', 'Mark 4:35-41': 'fe',
    'Mark 5:21-43': 'fe', 'Mark 6:1-13': 'fe',
    'Mark 6:14-29': 'verdad', 'Mark 7:1-8,14-15,21-23': 'verdad',
    'Mark 7:24-37': 'fe', 'Mark 8:27-38': 'fe',
    'Mark 9:2-9': 'fe', 'Mark 9:30-37': 'humildad',
    'Mark 9:38-50': 'servicio', 'Mark 10:2-16': 'amor',
    'Mark 10:17-31': 'justicia', 'Mark 10:35-45': 'servicio',
    'Mark 10:46-52': 'fe', 'Mark 12:28-34': 'amor',
    'Mark 12:38-44': 'humildad', 'Mark 13:1-8': 'vigilancia',
    'Mark 13:24-37': 'vigilancia', 'Mark 14:12-16,22-26': 'eucaristía',
    'Mark 16:15-20': 'fe',
    'Luke 1:26-38': 'fe', 'Luke 1:39-45': 'fe',
    'Luke 1:39-56': 'humildad', 'Luke 1:57-66,80': 'esperanza',
    'Luke 2:1-14': 'esperanza', 'Luke 2:22-40': 'fe',
    'Luke 3:1-6': 'arrepentimiento', 'Luke 3:10-18': 'arrepentimiento',
    'Luke 4:1-13': 'tentación', 'Luke 4:14-21': 'servicio',
    'Luke 5:1-11': 'fe', 'Luke 7:1-10': 'fe',
    'Luke 7:11-17': 'milagro', 'Luke 7:36-8:3': 'perdón',
    'Luke 9:28-36': 'fe', 'Luke 10:1-9': 'servicio',
    'Luke 10:1-11,16-20': 'servicio', 'Luke 10:25-37': 'caridad',
    'Luke 10:38-42': 'oración', 'Luke 11:1-13': 'oración',
    'Luke 12:13-21': 'justicia', 'Luke 12:32-40': 'vigilancia',
    'Luke 13:1-9': 'arrepentimiento', 'Luke 13:10-17': 'sanación',
    'Luke 14:1,7-14': 'humildad', 'Luke 14:25-33': 'fe',
    'Luke 15:1-3,11-32': 'perdón', 'Luke 15:1-10': 'perdón',
    'Luke 16:1-13': 'justicia', 'Luke 16:19-31': 'caridad',
    'Luke 17:5-10': 'fe', 'Luke 17:11-19': 'fe',
    'Luke 18:1-8': 'oración', 'Luke 18:9-14': 'humildad',
    'Luke 19:1-10': 'arrepentimiento', 'Luke 19:28-40': 'humildad',
    'Luke 21:5-19': 'vigilancia', 'Luke 21:25-36': 'vigilancia',
    'Luke 23:33-43': 'perdón', 'Luke 24:13-35': 'eucaristía',
    'Luke 24:36-48': 'resurrección', 'Luke 6:12-16': 'servicio',
    'John 1:29-42': 'fe', 'John 2:1-11': 'milagro',
    'John 3:1-17': 'fe', 'John 3:13-17': 'amor',
    'John 3:14-21': 'amor', 'John 4:5-42': 'fe',
    'John 6:1-21': 'milagro', 'John 6:24-35': 'eucaristía',
    'John 6:35,41-51': 'eucaristía', 'John 6:51-58': 'eucaristía',
    'John 9:1-41': 'sanación', 'John 10:1-10': 'fe',
    'John 10:11-18': 'amor', 'John 11:1-45': 'resurrección',
    'John 11:17-27': 'resurrección', 'John 13:1-17,31-35': 'servicio',
    'John 13:31-35': 'amor', 'John 14:1-14': 'fe',
    'John 14:15-21': 'amor', 'John 14:23-29': 'paz',
    'John 15:1-8': 'fe', 'John 15:9-17': 'amor',
    'John 15:26-27,16:4-15': 'verdad', 'John 16:12-15': 'verdad',
    'John 17:1-11': 'oración', 'John 17:6-19': 'oración',
    'John 17:20-26': 'amor', 'John 18:33-37': 'verdad',
    'John 20:1-18': 'resurrección', 'John 20:2-8': 'fe',
    'John 20:19-23': 'paz', 'John 20:19-31': 'fe',
    'John 20:24-29': 'fe', 'John 21:1-19': 'servicio',
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  DESCRIPCIONES DE TEMA (para la introducción del sacerdote)
  // ══════════════════════════════════════════════════════════════════════════
  const THEME_DESCRIPTIONS = {
    'fe': 'la fe en Jesucristo y la confianza en la providencia de Dios',
    'sanación': 'la sanación de nuestros males corporales y espirituales',
    'perdón': 'el perdón de los pecados y la misericordia divina',
    'amor': 'el amor de Dios que nos transforma y nos une como hermanos',
    'servicio': 'el servicio humilde a nuestros hermanos en la persona de Cristo',
    'oración': 'la oración confiada y perseverante como aliento de nuestra fe',
    'arrepentimiento': 'el arrepentimiento sincero y la conversión del corazón',
    'esperanza': 'la esperanza en la promesa de Dios y la vida eterna',
    'caridad': 'la caridad y la misericordia hacia los pobres y necesitados',
    'paz': 'la paz de Cristo que sobrepasa todo entendimiento',
    'resurrección': 'la resurrección de Cristo como fundamento de nuestra fe',
    'vigilancia': 'la vigilancia y la preparación para el encuentro con el Señor',
    'milagro': 'los milagros de Cristo como signos de su poder y compasión',
    'verdad': 'la verdad del Evangelio que nos libera del pecado',
    'justicia': 'la justicia y el reino de Dios entre nosotros',
    'humildad': 'la humildad de corazón que nos acerca a Dios',
    'tentación': 'la fortaleza para resistir la tentación y el mal',
    'eucaristía': 'el Pan de Vida que Cristo nos da en el Sacramento del Altar',
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  INTENCIONES ESTACIONALES
  // ══════════════════════════════════════════════════════════════════════════
  function getSeasonalIntention(season) {
    const intentions = {
      advent: `En este santo tiempo de Adviento, mientras nos preparamos para la venida del Señor: que dispongamos nuestros corazones mediante el arrepentimiento, la oración y las obras de misericordia; que la Iglesia sea hallada vigilante y fiel; y que todos los alejados de Dios sean atraídos a la luz de Cristo. Roguemos al Señor.
<strong>R/. Señor, escucha nuestra oración.</strong>`,
      christmas: `En la alegría de este santo tiempo de Navidad, dando gracias por el misterio de la Encarnación: que así como el Verbo se hizo carne y habitó entre nosotros, Cristo more en nuestros corazones por la fe; que los pobres y olvidados, como los pastores de Belén, escuchen la buena nueva de gran gozo. Roguemos al Señor.
<strong>R/. Señor, escucha nuestra oración.</strong>`,
      epiphany: `En este tiempo de Epifanía, cuando Cristo se manifiesta a todas las naciones: que la luz de Cristo brille en cada rincón oscuro del mundo; que todos los pueblos vengan a adorar al Dios verdadero; y que la Iglesia sea audaz en proclamar el Evangelio. Roguemos al Señor.
<strong>R/. Señor, escucha nuestra oración.</strong>`,
      lent: `En este santo tiempo de Cuaresma, cuando ayunamos, oramos y hacemos obras de misericordia: que entremos más profundamente en el Misterio Pascual de la muerte y resurrección de Cristo; que nuestro ayuno sea aceptable a Dios y fructífero para nuestras almas; y que renovemos con sinceridad nuestras promesas bautismales. Roguemos al Señor.
<strong>R/. Señor, escucha nuestra oración.</strong>`,
      triduum: `En estos sacratísimos días del Triduo, al pie de la Cruz de Cristo: que nos unamos a nuestro Señor en su sufrimiento y muerte; que todo el mundo conozca la redención que él ha ganado; y que nunca tomemos a la ligera el precio que fue pagado por nuestra salvación. Roguemos al Señor.
<strong>R/. Señor, escucha nuestra oración.</strong>`,
      easter: `En este glorioso tiempo de Pascua, gozándonos en la Resurrección de nuestro Señor Jesucristo: que la luz de la Pascua disipe toda tiniebla de nuestros corazones; que toda la Iglesia se llene de alegría pascual; y que todo el mundo venga a conocer al Dios que resucita a los muertos. ¡Aleluya! Roguemos al Señor.
<strong>R/. Señor, escucha nuestra oración.</strong>`,
      pentecost: `En esta fiesta de Pentecostés, celebrando la efusión del Espíritu Santo sobre la Iglesia: que los dones del Espíritu sean renovados en cada miembro del Cuerpo de Cristo; que la Iglesia hable con audacia las maravillas de Dios; y que todos los bautizados caminen por el Espíritu. Roguemos al Señor.
<strong>R/. Señor, escucha nuestra oración.</strong>`,
      trinity: `Al celebrar el misterio de la Santísima Trinidad: que seamos atraídos más profundamente al amor del Padre, del Hijo y del Espíritu Santo; que la Iglesia sea signo e instrumento de esa unidad divina; y que nuestras vidas reflejen la comunión de amor que existe en la Trinidad. Roguemos al Señor.
<strong>R/. Señor, escucha nuestra oración.</strong>`,
    };
    return intentions[season] || null;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  DETECCIÓN DE TEMA
  // ══════════════════════════════════════════════════════════════════════════
  function detectThemeKey(gospelRef, gospelText) {
    // 1. Mapa directo
    if (gospelRef && GOSPEL_THEMES[gospelRef]) return GOSPEL_THEMES[gospelRef];
    // 2. Análisis de texto
    if (gospelText) {
      const text = gospelText.toLowerCase();
      const keywords = {
        'fe': /\bfe\b|\bcreer\b|\bcrey[oó]\b|\bconfi[aá]/i,
        'sanación': /\bsan[aó]\b|\bsanar\b|\benferm[oa]s?\b|\bcur[aó]\b/i,
        'perdón': /\bperd[oó]n\b|\bperdonar\b/i,
        'amor': /\bamor\b|\bamar\b/i,
        'servicio': /\bservi[dr]\b|\bservicio\b|\bsirv/i,
        'oración': /\boraci[oó]n\b|\brezar\b|\borar\b/i,
        'arrepentimiento': /\barrepient|\barrepent|\bpenitencia\b/i,
        'esperanza': /\besperanza\b|\besperar\b/i,
        'caridad': /\bcaridad\b|\bmisericord/i,
        'paz': /\bpaz\b|\bpacífic/i,
        'resurrección': /\bresurrecci|\bresucit/i,
        'vigilancia': /\bvigil|\balerta\b/i,
        'humildad': /\bhumil/i,
        'tentación': /\btentaci/i,
        'milagro': /\bmilagro|\bprodigi|\bseñal\b/i,
        'verdad': /\bverdad\b|\bverdader/i,
        'justicia': /\bjusticia\b|\bjust[oa]s?\b/i,
      };
      let topTheme = '', maxMatches = 0;
      for (const [theme, regex] of Object.entries(keywords)) {
        const matches = (text.match(new RegExp(regex, 'gi')) || []).length;
        if (matches > maxMatches) { maxMatches = matches; topTheme = theme; }
      }
      if (topTheme) return topTheme;
    }
    return 'fe'; // fallback
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  PETICIONES ADAPTADAS POR TEMA
  //  Cada categoría (Iglesia, Mundo, Parroquia, Enfermos, Difuntos, Evangelio)
  //  tiene variantes específicas según el tema del Evangelio
  // ══════════════════════════════════════════════════════════════════════════

  // ── POR LA IGLESIA ──
  const CHURCH_PETITIONS = {
    fe:               'Que la Iglesia sea firme en la fe que hemos recibido de los Apóstoles; que los obispos, sacerdotes y diáconos prediquen con valentía la fe que salva; y que todos los bautizados profundicen su relación con Cristo mediante los sacramentos.',
    sanación:         'Que la Iglesia sea instrumento de sanación en un mundo herido; que sus ministros lleven el bálsamo del consuelo a los que sufren; y que toda la comunidad eclesial sea hospital de almas como nos enseñó el Señor.',
    perdón:           'Que la Iglesia anuncie sin cesar el perdón de Dios a todos los pecadores; que el sacramento de la Reconciliación sea frecuentado con devoción; y que la comunidad eclesial sea un espacio de misericordia donde nadie se sienta rechazado.',
    amor:             'Que la Iglesia, fundada en el amor de Cristo, sea signo visible de ese amor ante el mundo; que sus miembros se amen unos a otros como Cristo nos ha amado; y que los pastores guíen al pueblo con la ternura del Buen Pastor.',
    servicio:         'Que la Iglesia siga el ejemplo de Cristo siervo, lavando los pies de los que necesitan; que sus instituciones sirvan a los más pobres y vulnerables; y que todo ministerio sea ejercido como servicio y no como poder.',
    oración:          'Que la Iglesia persevere en la oración como la primera comunidad de Jerusalén; que la liturgia de las Horas santifique cada momento del día; y que toda la Iglesia sea una comunidad orante que intercede por el mundo entero.',
    arrepentimiento:  'Que la Iglesia, siempre necesitada de reforma, se convierta continuamente al Evangelio; que reconozca con humildad sus faltas y dé testimonio de conversión; y que los pastores guíen al pueblo por el camino de la penitencia con su propio ejemplo.',
    esperanza:        'Que la Iglesia sea portadora de la esperanza que no defrauda; que en medio de las pruebas y persecuciones mantenga firme su confianza en las promesas de Dios; y que su testimonio encienda la esperanza en los corazones de los desesperanzados.',
    caridad:          'Que la Iglesia sea la primera en practicar la caridad que predica; que sus obras de misericordia alcancen a los últimos de la sociedad; y que todo cristiano vea en el rostro del pobre el rostro de Cristo.',
    paz:              'Que la Iglesia sea artesana de paz entre las naciones y las culturas; que sus líderes promuevan el diálogo y la reconciliación donde hay división; y que cada comunidad cristiana sea oasis de paz en medio de un mundo en conflicto.',
    resurrección:     'Que la Iglesia proclame con alegría la Resurrección de Cristo como centro de su fe; que los que dudan sean confirmados por el testimonio gozoso de los creyentes; y que la esperanza en la vida eterna anime a toda la Iglesia en su misión.',
    vigilancia:       'Que la Iglesia permanezca vigilante esperando al Señor que viene; que no se duerma en la comodidad ni se distraiga con lo mundano; y que sus pastores mantengan encendida la lámpara de la fe en toda la grey.',
    milagro:          'Que la Iglesia reconozca y celebre las maravillas que Dios sigue obrando hoy; que sus ministros sean instrumentos del poder de Cristo; y que la comunidad eclesial viva en la expectativa alegre de los signos del Reino.',
    verdad:           'Que la Iglesia sea columna y baluarte de la verdad como la llama el Apóstol; que proclame la verdad del Evangelio sin temor ni contemporización; y que sus maestros guíen al pueblo en la sana doctrina.',
    justicia:         'Que la Iglesia levante su voz profética en defensa de la justicia; que denuncie con valentía las estructuras de pecado que oprimen a los débiles; y que trabaje por un orden social conforme al Evangelio.',
    humildad:         'Que la Iglesia imite la humildad de su Señor, que no vino a ser servido sino a servir; que sus líderes ejerzan la autoridad con mansedumbre; y que toda la comunidad se revista de humildad unos para con otros.',
    tentación:        'Que la Iglesia, tentada como su Señor en el desierto, permanezca fiel a la Palabra de Dios; que no sucumba a las seducciones del poder, la riqueza o la vanagloria; y que sus miembros encuentren en los sacramentos la fuerza para resistir al Maligno.',
    eucaristía:       'Que la Iglesia, alimentada por el Cuerpo y la Sangre de Cristo, sea fortalecida en la unidad de la fe; que la celebración eucarística sea el centro de toda vida parroquial; y que ningún cristiano se aparte de la Mesa del Señor.',
  };

  // ── POR EL MUNDO ──
  const WORLD_PETITIONS = {
    fe:               'Que los gobernantes de las naciones busquen la verdad con rectitud de corazón; que los pueblos que aún no conocen a Cristo encuentren en los creyentes un testimonio creíble de fe; y que la libertad religiosa sea respetada en toda la tierra.',
    sanación:         'Que los que tienen autoridad promuevan sistemas de salud accesibles a todos, especialmente a los más pobres; que los médicos, enfermeros y cuidadores encuentren fuerza y consuelo en su labor; y que las naciones colaboren para erradicar las enfermedades y pandemias.',
    perdón:           'Que las naciones encuentren caminos de reconciliación donde hay conflicto y odio; que los líderes del mundo tengan el valor de pedir perdón por las injusticias cometidas; y que los pueblos heridos por la guerra encuentren sanación y paz duradera.',
    amor:             'Que el amor de Cristo transforme las relaciones entre las naciones; que donde hay odio se siembre amor, donde hay guerra se busque la paz; y que la familia humana se reconozca unida en la fraternidad que Dios quiere para todos sus hijos.',
    servicio:         'Que los que ejercen autoridad política la ejerzan como servicio al bien común; que los poderosos del mundo pongan sus recursos al servicio de los necesitados; y que la comunidad internacional coopere para combatir la pobreza y la injusticia.',
    oración:          'Que los gobernantes del mundo busquen la sabiduría de Dios en la oración antes de tomar decisiones; que la paz entre las naciones se construya sobre la roca de la justicia y la oración; y que el ejemplo de los santos inspire a los líderes a gobernar con integridad.',
    arrepentimiento:  'Que los líderes del mundo reconozcan las consecuencias de la injusticia y la codicia; que las naciones se arrepientan de la destrucción del medio ambiente y busquen cuidar la creación de Dios; y que la humanidad se convierta de los caminos de violencia a los caminos de paz.',
    esperanza:        'Que los pueblos oprimidos no pierdan la esperanza en la justicia de Dios; que los refugiados y desplazados encuentren acogida y dignidad; y que las naciones construyan un futuro de paz y prosperidad para las generaciones venideras.',
    caridad:          'Que las naciones ricas compartan sus recursos con las más necesitadas; que el hambre, la sed y la falta de vivienda sean combatidas con urgencia; y que todo ser humano sea tratado con la dignidad que merece como imagen de Dios.',
    paz:              'Que cesen las guerras y los conflictos armados que devastan tantas regiones del mundo; que los artesanos de la paz sean apoyados y protegidos; y que todos los pueblos se sienten a la mesa del diálogo para construir una paz justa y duradera.',
    resurrección:     'Que las naciones que han conocido muerte y destrucción experimenten la esperanza de una nueva vida; que los pueblos que lloran sean consolados; y que la victoria de Cristo sobre la muerte inspire a la humanidad a no rendirse ante el mal.',
    vigilancia:       'Que los líderes del mundo estén atentos a las necesidades de sus pueblos y no se dejen corromper; que la comunidad internacional vigile por la justicia y los derechos humanos; y que todos estemos alerta ante las injusticias que se cometen en silencio.',
    milagro:          'Que Dios obre maravillas entre las naciones, transformando corazones de piedra en corazones de carne; que donde parece imposible la paz, Dios abra caminos insospechados; y que los pueblos reconozcan la mano de Dios en la historia.',
    verdad:           'Que la verdad prevalezca en el discurso público y los medios de comunicación; que los gobernantes hablen con sinceridad a sus pueblos; y que la mentira, la manipulación y la desinformación sean vencidas por la luz de la verdad.',
    justicia:         'Que la justicia reine en todas las naciones de la tierra; que los tribunales juzguen con rectitud y sin acepción de personas; y que los sistemas económicos sean transformados para servir a todos y no solo a unos pocos.',
    humildad:         'Que los poderosos del mundo aprendan la lección de la humildad evangélica; que reconozcan que toda autoridad viene de Dios y debe ejercerse en su temor; y que las naciones abandonen la soberbia y la rivalidad en busca del bien común.',
    tentación:        'Que los líderes del mundo resistan la tentación del poder absoluto y la corrupción; que los pueblos no caigan en la desesperación ni en la violencia; y que la humanidad rechace las falsas promesas de felicidad que alejan de Dios.',
    eucaristía:       'Que así como Cristo se parte y se reparte en la Eucaristía, las naciones aprendan a compartir los bienes de la tierra; que el pan sea partido con justicia y que nadie pase hambre mientras otros abundan; y que el banquete eucarístico inspire un mundo más justo.',
  };

  // ── POR LA PARROQUIA ──
  const PARISH_PETITIONS = {
    fe:               'Que esta comunidad crezca en la fe que profesamos cada domingo en el Credo; que las familias transmitan la fe a sus hijos con alegría; y que los catecúmenos y los que se preparan para los sacramentos sean fortalecidos en su camino.',
    sanación:         'Que esta comunidad sea lugar de sanación para los corazones heridos; que encontremos las palabras justas para consolar a los que sufren entre nosotros; y que nuestras visitas a los enfermos lleven el consuelo de Cristo.',
    perdón:           'Que en esta comunidad practiquemos el perdón mutuo como nos enseña el Evangelio; que las heridas entre hermanos sean sanadas por la gracia; y que nuestro ejemplo de reconciliación inspire a los que nos rodean.',
    amor:             'Que el amor fraterno sea la marca distintiva de esta comunidad; que nos amemos unos a otros no solo de palabra sino con obras y en verdad; y que nuestra parroquia sea conocida como un lugar donde se vive el mandamiento nuevo del Señor.',
    servicio:         'Que cada miembro de esta comunidad descubra su vocación de servicio; que nuestros ministerios parroquiales respondan a las necesidades reales de la gente; y que sirvamos a Cristo en los más pequeños de nuestros hermanos.',
    oración:          'Que esta comunidad sea reconocida como una comunidad que ora; que la oración personal y comunitaria sean el fundamento de nuestra vida parroquial; y que aprendamos del Señor a orar con confianza y perseverancia.',
    arrepentimiento:  'Que esta comunidad se renueve continuamente mediante la conversión; que nos examinemos con sinceridad y reconozcamos nuestras faltas; y que el sacramento de la Confesión sea frecuentado con devoción y confianza en la misericordia de Dios.',
    esperanza:        'Que esta comunidad sea signo de esperanza para el barrio y la ciudad; que en medio de las dificultades mantengamos viva la llama de la esperanza cristiana; y que nuestra alegría sea contagiosa para los que nos rodean.',
    caridad:          'Que esta comunidad multiplique sus obras de caridad hacia los más necesitados; que nuestras puertas estén siempre abiertas para el hambriento, el sediento y el extranjero; y que cada parroquiano se comprometa en alguna obra de misericordia.',
    paz:              'Que esta comunidad sea un espacio de paz donde todos se sientan acogidos; que los conflictos entre nosotros se resuelvan con espíritu evangélico; y que llevemos la paz de Cristo a nuestras familias y lugares de trabajo.',
    resurrección:     'Que esta comunidad viva la alegría de la Resurrección cada día, no solo en Pascua; que la esperanza en la vida eterna nos anime en nuestro peregrinar; y que demos testimonio gozoso de que Cristo está vivo y reina.',
    vigilancia:       'Que esta comunidad permanezca vigilante en la espera del Señor; que no nos dejemos arrastrar por la pereza espiritual ni la tibieza; y que mantengamos encendida la lámpara de la fe, siempre preparados para el encuentro con Cristo.',
    milagro:          'Que esta comunidad tenga ojos para ver las maravillas que Dios obra entre nosotros cada día; que celebremos con gratitud los pequeños y grandes milagros de la gracia; y que nuestra confianza en el poder de Dios nunca desfallezca.',
    verdad:           'Que esta comunidad se arraigue cada vez más en la verdad del Evangelio; que nuestra formación en la fe sea sólida y profunda; y que seamos capaces de dar razón de nuestra esperanza a todo el que nos pregunte.',
    justicia:         'Que esta comunidad promueva la justicia social en su entorno; que denunciemos las injusticias con valentía y trabajemos por un mundo más justo; y que nuestras acciones reflejen la preocupación de Dios por los oprimidos.',
    humildad:         'Que en esta comunidad valoremos la humildad como la más bella de las virtudes; que los que sirven lo hagan sin buscar reconocimiento; y que aprendamos a considerarnos los últimos para ser los primeros ante Dios.',
    tentación:        'Que esta comunidad se apoye mutuamente en las luchas contra la tentación; que los más fuertes sostengan a los más débiles; y que en la vida sacramental encontremos la gracia necesaria para perseverar en la fidelidad.',
    eucaristía:       'Que esta comunidad valore cada vez más la gracia de la Santa Eucaristía; que nuestra participación en la Misa sea devota y fructífera; y que la comunión sacramental nos una más profundamente a Cristo y entre nosotros.',
  };

  // ── POR LOS ENFERMOS Y NECESITADOS ──
  const SUFFERING_PETITIONS = {
    fe:               'Que los que atraviesan pruebas y sufrimientos no pierdan la fe en la bondad de Dios; que los que cuidan de los enfermos sean sostenidos por la fe; y que los moribundos encuentren en la fe cristiana la paz y el consuelo del Señor.',
    sanación:         'Que los enfermos de cuerpo y alma experimenten la sanación que solo Cristo puede dar; que los médicos y enfermeros sean instrumentos de la misericordia divina; y que los que sufren enfermedades crónicas encuentren sentido y fortaleza en la Cruz de Cristo.',
    perdón:           'Que los que están heridos por la falta de perdón sean liberados de su amargura; que los que cargan con culpas encuentren en la confesión el alivio y la paz; y que la misericordia de Dios toque los corazones más endurecidos.',
    amor:             'Que los que se sienten solos y no amados experimenten el abrazo del amor de Dios; que los que sufren violencia doméstica encuentren refugio y protección; y que el amor de esta comunidad alcance a los más aislados y olvidados.',
    servicio:         'Que los que dedican su vida al servicio de los demás no caigan en el agotamiento; que los voluntarios y trabajadores sociales sean reconocidos y apoyados; y que los necesitados encuentren siempre manos dispuestas a ayudar.',
    oración:          'Que los que no saben cómo orar en su dolor encuentren quien les acompañe; que nuestra oración comunitaria sostenga a los que ya no pueden orar; y que el Espíritu Santo interceda por nosotros con gemidos inefables cuando las palabras nos faltan.',
    arrepentimiento:  'Que los que sufren las consecuencias de sus propios pecados encuentren misericordia y caminos de restauración; que los adictos y los atrapados en conductas destructivas hallen la gracia de la conversión; y que nadie desespere del perdón de Dios.',
    esperanza:        'Que los que han perdido toda esperanza vuelvan a descubrir la luz al final del túnel; que los que sufren depresión y angustia encuentren ayuda profesional y el consuelo de la fe; y que los que lloran sean consolados con la esperanza de la vida eterna.',
    caridad:          'Que los hambrientos sean alimentados, los sedientos saciados y los sin techo cobijados; que los que viven en la miseria sean atendidos con urgencia por la comunidad; y que nuestras limosnas y obras de caridad alcancen a los que más lo necesitan.',
    paz:              'Que los que sufren ansiedad e inquietud interior encuentren la paz que solo Cristo puede dar; que los que viven en zonas de conflicto sean protegidos; y que los traumatizados por la violencia encuentren sanación y reconciliación.',
    resurrección:     'Que los que lloran la muerte de un ser querido sean consolados por la esperanza de la resurrección; que los moribundos no teman, sabiendo que Cristo ha vencido la muerte; y que los que sufren enfermedades terminales entreguen su dolor al Señor Resucitado.',
    vigilancia:       'Que estemos atentos a las necesidades de los que sufren a nuestro alrededor; que no pasemos de largo ante el dolor de nuestros hermanos; y que los que están en peligro encuentren quien vigile por su seguridad y bienestar.',
    milagro:          'Que los enfermos que anhelan la sanación confíen en el poder de Dios que obra maravillas; que los médicos reciban la inspiración divina en sus diagnósticos y tratamientos; y que reconozcamos con gratitud cada recuperación como don de la providencia de Dios.',
    verdad:           'Que los que sufren a causa de la mentira y la calumnia sean reivindicados por la verdad; que los perseguidos por causa de la justicia encuentren amparo; y que la verdad del Evangelio sea consuelo para los afligidos.',
    justicia:         'Que los que padecen injusticia social encuentren quien abogue por ellos; que los trabajadores explotados reciban un salario justo; y que los presos inocentes sean liberados y los culpables tratados con la dignidad que merece toda persona humana.',
    humildad:         'Que los que sufren en silencio sin pedir ayuda sean descubiertos y atendidos; que los más pequeños y vulnerables de la sociedad reciban protección; y que aprendamos a acompañar al que sufre sin juzgar ni sermonear.',
    tentación:        'Que los que luchan contra adicciones y tentaciones persistentes no se rindan; que los jóvenes tentados por las falsas promesas del mundo encuentren en Cristo la plenitud verdadera; y que los caídos se levanten con la ayuda de la gracia.',
    eucaristía:       'Que los enfermos que no pueden asistir a la Santa Misa reciban la Sagrada Comunión por manos de los ministros extraordinarios; que el Viático fortalezca a los moribundos; y que el Sacramento del Altar sea medicina del alma para todos los que sufren.',
  };

  // ── POR LOS DIFUNTOS ──
  const DEAD_PETITIONS = {
    fe:               'Que los que murieron en la fe de Cristo sean recibidos en la gloria eterna; que su fe, vivida con fidelidad en este mundo, sea coronada en el cielo; y que nosotros perseveremos en la misma fe hasta el último aliento.',
    sanación:         'Que los que murieron después de larga enfermedad gocen de la salud perfecta en la presencia de Dios; que los que les cuidaron en vida encuentren consuelo; y que las almas del purgatorio alcancen pronto la sanación definitiva de la visión beatífica.',
    perdón:           'Que la misericordia infinita de Dios acoja a los difuntos que confiaron en su perdón; que las almas del purgatorio sean purificadas por el amor de Dios; y que nadie que haya invocado la misericordia divina sea rechazado.',
    amor:             'Que los que vivieron y murieron en el amor de Cristo sean abrazados eternamente por el Padre; que el amor que sembraron en vida dé fruto en la eternidad; y que nos reunamos un día con ellos en el banquete del amor eterno.',
    servicio:         'Que los que sirvieron a Cristo en esta vida reciban la recompensa prometida a los siervos fieles; que su ejemplo de servicio nos inspire a ser más generosos; y que las almas de los que dieron su vida por otros descansen en la paz eterna.',
    oración:          'Que nuestras oraciones por los difuntos sean eficaces ante el trono de Dios; que no olvidemos orar por las almas del purgatorio, especialmente las más abandonadas; y que la oración de la Iglesia militante alcance misericordia para la Iglesia purgante.',
    arrepentimiento:  'Que los que se arrepintieron en su última hora sean acogidos por la misericordia divina como el buen ladrón; que ningún difunto sea privado de la oración de la Iglesia; y que la sangre de Cristo cubra los pecados de los que partieron con corazón contrito.',
    esperanza:        'Que los que murieron con la esperanza de la resurrección la vean cumplida; que los que perdieron seres queridos mantengan viva la esperanza del reencuentro; y que la promesa de la vida eterna consuele a todos los que lloran.',
    caridad:          'Que los difuntos que practicaron la caridad en vida reciban la recompensa eterna; que las almas de los pobres y olvidados de este mundo sean las primeras en el Reino; y que la caridad de la Iglesia se extienda también a los muertos mediante la oración.',
    paz:              'Que los difuntos descansen en la paz eterna del Señor; que las almas atormentadas encuentren la serenidad que no tuvieron en vida; y que la luz perpetua brille para todos los que durmieron en Cristo.',
    resurrección:     'Que los difuntos resuciten con Cristo en el último día, revestidos de cuerpos gloriosos; que la fe en la resurrección consuele a los que lloran; y que vivamos de tal manera que merezcamos la resurrección de los justos.',
    vigilancia:       'Que los que murieron preparados para el encuentro con el Señor gocen ya de su presencia; que su vigilancia en vida les haya merecido la entrada en el banquete eterno; y que nosotros aprendamos de su ejemplo a estar siempre preparados.',
    milagro:          'Que el poder de Dios que resucitó a Cristo de entre los muertos se manifieste también en favor de nuestros difuntos; que confiemos en que Dios puede hacer maravillas más allá de la muerte; y que la intercesión de los santos alcance misericordia para las almas del purgatorio.',
    verdad:           'Que los difuntos que buscaron la verdad en vida contemplen ahora la Verdad misma cara a cara; que los que sufrieron por causa de la verdad sean glorificados; y que nosotros, al contemplar la brevedad de la vida, busquemos la verdad eterna.',
    justicia:         'Que la justicia divina, que es también misericordia, acoja a los difuntos en su seno; que las víctimas de la injusticia humana reciban la justicia de Dios; y que los que lucharon por la justicia en este mundo reciban la corona de la vida.',
    humildad:         'Que los humildes de corazón que han partido de este mundo sean ensalzados en la gloria; que los que sirvieron en silencio reciban el reconocimiento eterno del Padre; y que nosotros vivamos con la humildad de los que saben que este mundo es pasajero.',
    tentación:        'Que los que sucumbieron a la tentación pero se arrepintieron sean acogidos por la misericordia de Dios; que la sangre de Cristo lave toda mancha de pecado; y que los difuntos que lucharon contra el mal reciban la corona de la victoria.',
    eucaristía:       'Que el Santo Sacrificio de la Misa que ofrecemos sea provechoso para las almas de los difuntos; que la Sangre de Cristo derramada en el altar alcance misericordia para los que han partido; y que todos los que se alimentaron del Pan de Vida en este mundo entren en el banquete eterno.',
  };

  // ── PETICIÓN FINAL — SEGÚN EL EVANGELIO ──
  const GOSPEL_PETITIONS = {
    fe:               'Que la fe proclamada en el Evangelio de hoy arraigue profundamente en nuestros corazones; que no seamos de los que oyen la Palabra y la olvidan, sino de los que la guardan y dan fruto; y que nuestra fe sea fuente de obras que glorifiquen al Padre.',
    sanación:         'Que el poder sanador de Cristo, manifestado en el Evangelio de hoy, toque nuestras heridas más profundas; que acudamos a él con la confianza de los enfermos del Evangelio; y que seamos instrumentos de su misericordia sanadora para los demás.',
    perdón:           'Que el mensaje de perdón que hemos escuchado en el Evangelio transforme nuestras relaciones; que perdonemos de corazón a los que nos han ofendido; y que experimentemos la libertad que solo el perdón de Dios puede dar.',
    amor:             'Que el mandamiento del amor que el Evangelio de hoy nos recuerda sea la ley suprema de nuestra vida; que amemos no solo a los que nos aman, sino también a los que nos hacen daño; y que nuestro amor sea reflejo del amor infinito de Dios.',
    servicio:         'Que la llamada al servicio que resuena en el Evangelio de hoy nos impulse a servir a Cristo en los más pequeños; que no busquemos los primeros puestos sino el último lugar; y que en el servicio humilde descubramos la verdadera grandeza.',
    oración:          'Que la enseñanza sobre la oración que hemos recibido hoy en el Evangelio renueve nuestra vida de oración; que oremos sin desfallecer como nos enseña el Señor; y que el Espíritu Santo nos enseñe a orar como conviene.',
    arrepentimiento:  'Que el llamado a la conversión del Evangelio de hoy nos mueva a un examen sincero de conciencia; que no endurezcamos nuestro corazón sino que volvamos al Señor con todo nuestro ser; y que la penitencia produzca en nosotros frutos dignos de conversión.',
    esperanza:        'Que la promesa de esperanza que brilla en el Evangelio de hoy ilumine nuestros momentos más oscuros; que no nos dejemos vencer por el desánimo ni la desesperación; y que la esperanza cristiana nos impulse a trabajar por un mundo mejor.',
    caridad:          'Que la caridad que el Evangelio de hoy nos exige sea concreta y eficaz; que no nos limitemos a palabras bonitas sino que actuemos en favor de los necesitados; y que al final de nuestra vida podamos decir que vestimos al desnudo, alimentamos al hambriento y visitamos al preso.',
    paz:              'Que la paz que Cristo ofrece en el Evangelio de hoy llene nuestros corazones inquietos; que seamos artesanos de paz en nuestras familias y comunidades; y que la paz de Cristo, que el mundo no puede dar, sea nuestra herencia y nuestro don.',
    resurrección:     'Que el mensaje de la Resurrección proclamado en el Evangelio de hoy renueve nuestra esperanza; que creamos firmemente que la muerte no tiene la última palabra; y que vivamos ya como resucitados, iluminados por la luz de Cristo.',
    vigilancia:       'Que la urgencia de la vigilancia que nos enseña el Evangelio de hoy sacuda nuestra comodidad; que vivamos cada día como si fuera el último; y que cuando el Señor venga nos encuentre fieles, con las lámparas encendidas y la obra terminada.',
    milagro:          'Que los prodigios narrados en el Evangelio de hoy fortalezcan nuestra confianza en el poder de Dios; que no limitemos a Dios con nuestra incredulidad; y que estemos abiertos a las maravillas que él quiere obrar en nuestra vida.',
    verdad:           'Que la verdad proclamada en el Evangelio de hoy nos libere de toda esclavitud del engaño; que tengamos el valor de vivir en la verdad aunque nos cueste; y que Cristo, que es la Verdad, sea la roca sobre la que edifiquemos nuestra vida.',
    justicia:         'Que la justicia del Reino anunciada en el Evangelio de hoy nos impulse a ser agentes de cambio; que no nos conformemos con la injusticia del mundo; y que busquemos primero el Reino de Dios y su justicia, confiando en que lo demás se nos dará por añadidura.',
    humildad:         'Que la humildad que el Evangelio de hoy nos enseña nos lleve a descender para que Cristo crezca en nosotros; que no busquemos honores humanos sino la aprobación de Dios; y que sigamos el camino de Cristo que, siendo Dios, se humilló haciéndose obediente hasta la muerte.',
    tentación:        'Que la victoria de Cristo sobre la tentación, proclamada en el Evangelio de hoy, nos dé ánimo en nuestras propias luchas; que acudamos a la Palabra de Dios como arma contra el Tentador; y que nunca presumamos de nuestra fuerza sino que confiemos en la gracia.',
    eucaristía:       'Que las palabras de Cristo sobre el Pan de Vida, proclamadas en el Evangelio de hoy, aviven nuestra devoción eucarística; que cada comunión sea un encuentro transformador con el Señor; y que la Eucaristía nos una más estrechamente a Cristo y a su Iglesia.',
  };

  // ── ORACIÓN DE CONCLUSIÓN SEGÚN EL TEMA ──
  const CLOSING_PRAYERS = {
    fe:               'Oh Señor Dios nuestro, que fortaleces la fe de los que confían en ti; recibe las oraciones de tu pueblo fiel y concede que, iluminados por la Palabra proclamada hoy, crezcamos en la fe que nos une a tu Hijo. Por el mismo Jesucristo nuestro Señor.',
    sanación:         'Médico celestial, que sanas todas nuestras dolencias; escucha las oraciones que hoy te ofrecemos y extiende tu mano poderosa sobre los enfermos y afligidos, para que experimenten tu toque sanador. Por Jesucristo nuestro Señor.',
    perdón:           'Padre de misericordia, que no quieres la muerte del pecador sino que se convierta y viva; acoge nuestras oraciones y derrama tu perdón sobre todos los que te invocan con corazón contrito. Por Jesucristo nuestro Señor.',
    amor:             'Dios de amor, que nos has amado primero y nos mandas amarnos unos a otros; recibe nuestras súplicas y enciende en nosotros la llama de tu caridad, para que amemos como tú nos has amado. Por Jesucristo nuestro Señor.',
    servicio:         'Señor Jesucristo, que no viniste a ser servido sino a servir; escucha las peticiones de tus siervos y concédenos la gracia de seguir tu ejemplo, sirviendo a los demás con generosidad y alegría. Tú que vives y reinas por los siglos de los siglos.',
    oración:          'Padre celestial, que nos invitas a orar sin desfallecer; recibe estas oraciones que con humildad te presentamos y enséñanos a perseverar en la oración, confiando en que tú escuchas el clamor de tus hijos. Por Jesucristo nuestro Señor.',
    arrepentimiento:  'Señor Dios, que llamas a todos los hombres a la conversión; acoge estas oraciones y concede a los pecadores la gracia del arrepentimiento, para que, volviendo a ti, encuentren vida y salvación. Por Jesucristo nuestro Señor.',
    esperanza:        'Dios de la esperanza, que llenas de gozo y paz a los que creen; escucha nuestras oraciones y concede que la esperanza que no defrauda sostenga a todos los que sufren y esperan en ti. Por Jesucristo nuestro Señor.',
    caridad:          'Padre de los pobres, que cuidas de los más pequeños; recibe las oraciones que te ofrecemos en favor de los necesitados y mueve nuestros corazones a la caridad efectiva, para que nadie carezca de lo necesario. Por Jesucristo nuestro Señor.',
    paz:              'Príncipe de la Paz, que dejaste tu paz a tus discípulos; escucha nuestras oraciones y derrama tu paz sobre un mundo dividido por el conflicto y la violencia, para que todos los pueblos vivan en concordia. Tú que vives y reinas por los siglos de los siglos.',
    resurrección:     'Dios de los vivos, que resucitaste a tu Hijo de entre los muertos; recibe nuestras oraciones y concede que, fortalecidos por la esperanza de la resurrección, caminemos sin temor hacia la vida eterna. Por Jesucristo nuestro Señor.',
    vigilancia:       'Señor Dios, que vienes cuando menos lo esperamos; acoge nuestras oraciones y concédenos la gracia de vivir vigilantes, con las lámparas encendidas, para que tu venida nos encuentre preparados. Por Jesucristo nuestro Señor.',
    milagro:          'Dios Todopoderoso, para quien nada es imposible; escucha las súplicas de tu pueblo y obra maravillas entre nosotros, para que tu Nombre sea glorificado y tu poder sea reconocido en toda la tierra. Por Jesucristo nuestro Señor.',
    verdad:           'Dios de verdad, que enviaste a tu Hijo para dar testimonio de la verdad; recibe nuestras oraciones y líbranos de todo engaño, para que caminemos siempre en la luz de tu verdad. Por Jesucristo nuestro Señor.',
    justicia:         'Juez justo, que amas la justicia y aborreces la iniquidad; escucha nuestras oraciones y establece tu justicia entre las naciones, para que los oprimidos sean liberados y tu Reino venga con poder. Por Jesucristo nuestro Señor.',
    humildad:         'Señor Jesucristo, manso y humilde de corazón; acoge las oraciones de tus siervos y concédenos la gracia de la humildad, para que, vaciándonos de nosotros mismos, seamos llenos de tu presencia. Tú que vives y reinas por los siglos de los siglos.',
    tentación:        'Dios fiel, que no permites que seamos tentados más allá de nuestras fuerzas; escucha nuestras oraciones y danos la fortaleza de resistir al Maligno, confiando en la victoria de tu Hijo sobre el pecado y la muerte. Por Jesucristo nuestro Señor.',
    eucaristía:       'Señor Jesucristo, Pan vivo bajado del cielo; recibe las oraciones que te ofrecemos en torno a tu altar y concede que la participación en tu Cuerpo y Sangre nos transforme y nos una en un solo cuerpo. Tú que vives y reinas por los siglos de los siglos.',
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  PETICIONES ESPECÍFICAS POR DOMINGO Y CICLO
  //  Cada entrada referencia directamente las lecturas concretas de ESE domingo
  //  (no solo el tema general). Es la fuente preferida; el sistema de temas de
  //  arriba queda como respaldo para ferias, misas votivas, o cualquier clave
  //  que todavía no tenga entrada específica aquí.
  // ══════════════════════════════════════════════════════════════════════════
  const INTERCESSIONS_BY_SUNDAY = {
  "advent1": {
    "A": {
      "church": "Que la Iglesia, como los siervos vigilantes del Evangelio de hoy, permanezca despierta y preparada para la venida del Hijo del Hombre, sin dejarse sorprender como los contemporáneos de Noé que comían y bebían sin advertirlo.",
      "world": "Que las naciones conviertan sus espadas en arados y sus lanzas en hoces, según la visión de Isaías, y que los pueblos suban al monte del Señor para aprender sus caminos en vez de adiestrarse para la guerra.",
      "parish": "Que esta comunidad viva revestida de las armas de la luz que menciona san Pablo, dejando a un lado las obras de las tinieblas mientras aguarda con vigilancia la venida del Señor.",
      "suffering": "Que los que sufren en la noche de la enfermedad o la angustia encuentren en la vigilancia del Evangelio no temor sino esperanza, sabiendo que el Señor viene a visitar a los suyos como un dueño que regresa a su casa.",
      "dead": "Que los que murieron velando en la fe sean hallados preparados en el día en que el Hijo del Hombre venga, como los que fueron tomados y no los que quedaron dormidos en la indiferencia.",
      "gospel": "Que sepamos vivir cada día como si fuera la hora en que el Señor ha de venir, vigilando sin descanso como el dueño de casa que no sabe a qué hora entrará el ladrón.",
      "closing": "Señor de la historia, que vendrás cuando menos lo esperemos como en los días de Noé: mantennos despiertos y vestidos de luz, para que tu venida nos halle preparados y no sorprendidos. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia sea el portero fiel del Evangelio de hoy, vigilando sin saber la hora en que el dueño de la casa ha de volver, ya sea al atardecer, a medianoche, al canto del gallo o al amanecer.",
      "world": "Que ante el silencio de Dios que lamenta Isaías -- 'ojalá rasgaras los cielos y bajaras' -- los gobernantes busquen con humildad la justicia, reconociendo que somos barro y el Señor es el alfarero que nos formó.",
      "parish": "Que esta parroquia, enriquecida en todo don como recuerda san Pablo a los corintios, no carezca de ningún carisma mientras aguarda la manifestación de nuestro Señor Jesucristo.",
      "suffering": "Que los que se sienten como hojas marchitas arrastradas por el viento, según la imagen de Isaías, sean sostenidos por la mano del alfarero divino que no abandona la obra de sus manos.",
      "dead": "Que los que ya no vigilan en esta vida sean hallados despiertos por el Señor de la casa en su venida final, confirmados hasta el fin e irreprochables en el día de nuestro Señor Jesucristo.",
      "gospel": "Que velemos como el portero encargado de su tarea, no sea que el Señor llegue de improviso y nos halle dormidos, sino que digamos a cada hora: 'velad'.",
      "closing": "Padre, que bajaste los cielos y viniste a nosotros como el alfarero que modela el barro: no recuerdes nuestra culpa para siempre y mantennos vigilantes hasta que vuelvas. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Que la Iglesia, ante las señales en el sol, la luna y las estrellas que anuncia Lucas, levante la cabeza sin temor, sabiendo que su liberación está cerca y que el retoño justo prometido por Jeremías ya ha brotado.",
      "world": "Que las naciones angustiadas por el estruendo del mar y sus olas, como describe el Evangelio de hoy, encuentren en el retoño de justicia anunciado por Jeremías un modelo de gobierno recto y seguro para todos los pueblos.",
      "parish": "Que esta comunidad, como pide san Pablo a los tesalonicenses, crezca y abunde en amor mutuo mientras aguarda irreprochable en santidad la venida de nuestro Señor Jesús con todos sus santos.",
      "suffering": "Que los que desfallecen de miedo ante las conmociones del mundo, como advierte el Evangelio, no se dejen abrumar por los excesos ni las preocupaciones de esta vida, sino que hallen fuerza para mantenerse en pie ante el Hijo del Hombre.",
      "dead": "Que los que confiaron en el Señor que 'ejercerá el derecho y la justicia en el país', según Jeremías, permanezcan seguros y a salvo, y levanten la cabeza el día en que su redención llegue plenamente.",
      "gospel": "Que no dejemos que nuestros corazones se embeban en juergas, borracheras y las preocupaciones de la vida, para que aquel día no caiga de repente sobre nosotros como un lazo, sino que estemos siempre orando y velando.",
      "closing": "Señor, tú eres nuestro retoño de justicia y nuestra esperanza cuando el mundo se estremece: enséñanos tus caminos y guíanos con tu verdad, para que levantemos la cabeza cuando se acerque nuestra liberación. Por Jesucristo nuestro Señor."
    }
  },
  "advent2": {
    "A": {
      "church": "Que la Iglesia sea como el vástago que brota del tronco de Jesé, llena del espíritu de sabiduría y consejo, y predique con la voz de Juan Bautista en el desierto: 'preparad el camino del Señor'.",
      "world": "Que las naciones vivan la visión de Isaías donde el lobo mora con el cordero y el leopardo se acuesta con el cabrito, y que los gobernantes juzguen a los pobres con justicia, sin dejarse guiar por lo que ven sus ojos.",
      "parish": "Que esta comunidad reciba a los de credo y origen diversos con la misma acogida con que Cristo nos recibió, como exhorta san Pablo a los romanos, para que unánimes glorifiquemos a Dios con una sola voz.",
      "suffering": "Que los enfermos y afligidos encuentren consuelo en la promesa de Isaías de que ya no habrá daño ni ruina en todo el monte santo, porque la tierra se llenará del conocimiento del Señor como las aguas cubren el mar.",
      "dead": "Que los difuntos que esperaron al vástago de Jesé participen ya de la paz donde el lobo y el cordero conviven, y que su esperanza se cumpla plenamente en la casa del Padre.",
      "gospel": "Que produzcamos frutos dignos de conversión, como exige Juan Bautista a quienes se acercaban a él, y no nos apoyemos en falsas seguridades, pues ya el hacha está puesta a la raíz de los árboles.",
      "closing": "Dios que haces brotar un retoño del tronco de Jesé, lleno de tu Espíritu de sabiduría y fortaleza: prepara nuestros corazones como caminos rectos para tu venida y llena la tierra de tu paz. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia sea la voz que clama en el desierto anunciada por Isaías, consolando al pueblo de Dios y anunciando que ha terminado su servidumbre, mientras proclama con Juan Bautista que uno más poderoso viene detrás.",
      "world": "Que los gobernantes escuchen el mandato de Isaías de subir a un monte alto y anunciar con fuerza a las ciudades: 'aquí está vuestro Dios', gobernando como el pastor que apacienta su rebaño y lleva en brazos a los corderos.",
      "parish": "Que esta parroquia, mientras aguarda nuevos cielos y una nueva tierra donde habite la justicia, se empeñe en ser hallada por el Señor sin mancha e irreprochable, en paz, como recuerda la segunda carta de Pedro.",
      "suffering": "Que los que se sienten como hierba que se seca, según la imagen de Isaías, hallen consuelo sabiendo que aunque la hierba se agosta, la palabra de nuestro Dios permanece firme para siempre.",
      "dead": "Que los difuntos descansen en la paz de aquel día del Señor que llega como ladrón en la noche, y que sean hallados sin mancha por Aquel que quiere que todos lleguen a la conversión.",
      "gospel": "Que, como Juan Bautista reconoció no ser digno de desatar la correa de las sandalias del que venía, vivamos con humildad preparando el camino del Señor en nuestro propio corazón.",
      "closing": "Dios de la consolación, que hablas al corazón de tu pueblo y anuncias el fin de su servidumbre: haz de nuestras vidas un camino recto para el que viene, más poderoso que nosotros, a bautizarnos en el Espíritu Santo. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia se despoje, como Jerusalén en el libro de Baruc, del vestido de tristeza y aflicción, y se revista para siempre de la hermosura de la gloria que viene de Dios, anunciando que todo valle será rellenado y todo monte rebajado.",
      "world": "Que los gobernantes de las naciones -- Tiberio, Poncio Pilato, Herodes y los demás nombrados por Lucas al inicio del Evangelio -- den paso al reinado de la justicia, y que los caminos torcidos de la política se enderecen para que todos vean la salvación de Dios.",
      "parish": "Que esta comunidad crezca en el amor cada vez más, en ciencia y en todo conocimiento, como ora san Pablo por los filipenses, para discernir lo mejor y llegar sin tacha al día de Cristo.",
      "suffering": "Que los que caminan por barrancos y lugares escabrosos, como describe Baruc, vean allanado su camino, y que Dios los guíe con su misericordia y su justicia hasta la luz de su gloria.",
      "dead": "Que los difuntos, a quienes Dios lleva alzados como en un trono de gloria según la imagen de Baruc, entren ya en la ciudad de la paz duradera y de la gloria que viene del Señor.",
      "gospel": "Que preparemos el camino del Señor enderezando nuestros senderos, como predicó Juan Bautista, para que toda carne vea la salvación de Dios que se acerca.",
      "closing": "Dios que allanas los valles y rebajas los montes para que tu pueblo camine seguro hacia ti: quítanos el vestido de tristeza y revístenos de tu gloria mientras aguardamos tu venida. Por Jesucristo nuestro Señor."
    }
  },
  "advent3": {
    "A": {
      "church": "Que la Iglesia anuncie a los que dudan, como Juan Bautista desde la cárcel preguntó '¿eres tú el que ha de venir?', las obras de Cristo: los ciegos ven, los cojos andan, los leprosos quedan limpios y a los pobres se les anuncia la Buena Nueva.",
      "world": "Que las naciones vean florecer el desierto como promete Isaías, que las manos débiles de los gobernantes se fortalezcan y las rodillas vacilantes se afiancen, para que los pueblos caminen por la senda santa sin extraviarse.",
      "parish": "Que esta comunidad tenga la paciencia del labrador que espera el fruto valioso de la tierra, como exhorta Santiago, afianzando el corazón porque la venida del Señor está cerca.",
      "suffering": "Que los ojos de los ciegos se abran y los oídos de los sordos se despejen, que el cojo salte como un ciervo, según la promesa de Isaías, y que los enfermos hallen en esta imagen un consuelo verdadero para su espera.",
      "dead": "Que los difuntos caminen ya por el camino santo del que habla Isaías, donde no pasará ningún impuro y donde el rescatado del Señor llega a Sión coronado de alegría eterna.",
      "gospel": "Que no nos escandalicemos de Cristo, como advierte a los enviados de Juan, sino que reconozcamos en los signos humildes del Evangelio la presencia del que había de venir.",
      "closing": "Señor, tú que abres los ojos de los ciegos y secas las lágrimas de todo rostro: fortalece nuestras manos débiles y nuestras rodillas vacilantes, y llévanos por tu camino santo hasta la alegría sin fin. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, ungida por el Espíritu del Señor como proclama Isaías, anuncie la buena nueva a los humildes, vende a los quebrantados de corazón y proclame la libertad a los cautivos, como Juan Bautista que dio testimonio de la luz sin ser él la luz.",
      "world": "Que las naciones vean cumplida la promesa de Isaías de que se reconstruirán las ruinas antiguas y se restaurarán las ciudades devastadas, y que los gobernantes amen el derecho y aborrezcan la iniquidad como el Señor mismo.",
      "parish": "Que esta comunidad viva alegre siempre, ore sin cesar y dé gracias en toda ocasión, como pide san Pablo a los tesalonicenses, sin extinguir el Espíritu ni menospreciar las profecías.",
      "suffering": "Que los quebrantados de corazón sean vendados y los que lloran reciban óleo de alegría en vez de vestido de luto, cumpliendo en ellos la promesa que Isaías anuncia y que Jesús proclamó suya en la sinagoga.",
      "dead": "Que los difuntos, vestidos ya con el manto de la justicia como promete Isaías, se alegren en el Dios que hace brotar la justicia y la alabanza ante todas las naciones.",
      "gospel": "Que, como Juan Bautista, sepamos decir con humildad 'yo no soy el Cristo' y señalemos siempre hacia Aquel que viene, dando testimonio de la luz sin buscar la gloria para nosotros mismos.",
      "closing": "Espíritu del Señor, que unges a los pobres de espíritu y vendas a los quebrantados de corazón: haznos testigos humildes de tu luz, como Juan, mientras esperamos la plenitud de tu alegría. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Que la Iglesia, como pide Sofonías, no tema ni deje que sus manos flaqueen, sino que se alegre y goce de todo corazón porque el Señor, rey de Israel, está en medio de ella y se recrea con ella con cantos de alegría.",
      "world": "Que las multitudes que preguntaban a Juan Bautista '¿qué debemos hacer?' encuentren eco en los gobernantes de hoy: que el que tenga dos túnicas comparta con el que no tiene, y que nadie exija más de lo establecido ni maltrate a nadie.",
      "parish": "Que esta comunidad esté siempre alegre en el Señor, sin ansiedad alguna, presentando a Dios sus peticiones con acción de gracias, como escribe san Pablo a los filipenses, para que la paz de Dios custodie sus corazones.",
      "suffering": "Que los que sufren escuchen la promesa de Sofonías de que el Señor cambiará su suerte, reunirá a los dispersos y transformará su vergüenza en alabanza en toda la tierra.",
      "dead": "Que los difuntos reposen ya donde el Señor enjuga toda lágrima, cumpliéndose en ellos la promesa de que Dios renovará su amor y se gozará con ellos con gritos de júbilo.",
      "gospel": "Que, siguiendo el consejo concreto de Juan Bautista a publicanos y soldados, compartamos lo que tenemos, no exijamos de más y nos contentemos con lo justo, dando frutos dignos de conversión.",
      "closing": "Señor, rey de Israel que te recreas con tu pueblo con cantos de júbilo: quita de nosotros todo temor, cambia nuestra suerte y enséñanos a compartir lo que tenemos como pedía Juan Bautista. Por Jesucristo nuestro Señor."
    }
  },
  "advent4": {
    "A": {
      "church": "Que la Iglesia acoja sin temor los designios de Dios, como José que dudaba de María hasta que el ángel le dijo en sueños 'no temas tomar contigo a María', y reconozca en el Emmanuel la señal de que Dios está con nosotros.",
      "world": "Que los gobernantes de las naciones, como el rey Ajaz al que Isaías ofrece una señal, no rechacen por soberbia los signos que Dios pone ante ellos, sino que reconozcan la presencia divina en medio de su pueblo.",
      "parish": "Que esta comunidad, llamada como los romanos por san Pablo a ser 'amados de Dios, santos por vocación', viva la obediencia de la fe entre todas las naciones por el nombre de Cristo.",
      "suffering": "Que los que sufren en la duda y la oscuridad, como José antes de recibir el mensaje del ángel, encuentren consuelo sabiendo que Dios actúa en sueños y silencios para traer luz a las situaciones más inciertas.",
      "dead": "Que los difuntos descansen ya en la certeza del Emmanuel, el Dios-con-nosotros anunciado por Isaías, que acompaña a su pueblo más allá de la muerte con su presencia fiel.",
      "gospel": "Que, como José, obedezcamos sin demora lo que Dios nos pide aunque no comprendamos del todo, tomando bajo nuestro cuidado lo que el Señor nos confía.",
      "closing": "Dios con nosotros, que hablaste a José en sueños para disipar su temor: danos la misma disponibilidad para acoger tu voluntad, aunque no la comprendamos plenamente, y haznos instrumentos de tu presencia entre los hombres. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como María en la Anunciación, responda con fe al anuncio del ángel -- 'el Espíritu Santo vendrá sobre ti' -- y acepte con humildad ser instrumento de la promesa hecha a David de un reino sin fin.",
      "world": "Que los gobernantes recuerden que ninguna casa construida por manos humanas dura para siempre, como aprendió David cuando quiso edificar un templo, y que busquen edificar naciones sobre la justicia que perdura.",
      "parish": "Que esta comunidad, iluminada por el misterio revelado en Cristo y manifestado ahora por las Escrituras proféticas, como escribe san Pablo a los romanos, anuncie este misterio a todas las naciones para llevarlas a la obediencia de la fe.",
      "suffering": "Que los que se sienten pequeños e incapaces, como María se preguntó '¿cómo será esto?', encuentren fuerza en la respuesta del ángel: 'para Dios nada hay imposible'.",
      "dead": "Que los difuntos participen ya de la casa eterna prometida a David, un trono sin fin que Dios estableció y que ahora se cumple en el Hijo de María engendrado por el Espíritu Santo.",
      "gospel": "Que respondamos como María con un 'hágase en mí según tu palabra', confiando en que para Dios nada hay imposible, incluso cuando el camino nos parezca incomprensible.",
      "closing": "Dios que prometiste a David una casa eterna y la cumpliste en el seno de María por obra del Espíritu Santo: haz que también nosotros respondamos 'hágase en mí' ante tu voluntad. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Que la Iglesia, como Isabel al recibir la visita de María, reconozca con alegría la presencia de Cristo en medio de ella y proclame con voz fuerte 'bendita tú entre las mujeres' a quien lleva al Señor a los demás.",
      "world": "Que de Belén, la más pequeña entre los clanes de Judá según Miqueas, siga surgiendo un modelo de gobierno humilde y pastoral, donde los que gobiernan apacienten a su pueblo con la fuerza del Señor y no con el poder impuesto.",
      "parish": "Que esta comunidad, como el Hijo que vino a hacer la voluntad de Dios según la carta a los Hebreos, ofrezca su vida en servicio antes que en sacrificios rituales vacíos.",
      "suffering": "Que los que llevan cargas pesadas encuentren consuelo en el gesto de María, que corrió sin demora a servir a su prima Isabel, y descubran que la visita del que sufre con nosotros trae siempre alegría, como saltó de gozo el niño en el seno de Isabel.",
      "dead": "Que los difuntos sean recibidos con el mismo gozo con que el niño saltó en el vientre de Isabel al oír el saludo de María, y que reposen en la paz del pastor que Miqueas anuncia desde Belén.",
      "gospel": "Que, como Isabel, sepamos reconocer y bendecir la presencia de Cristo en los demás, dejándonos llenar del Espíritu Santo ante cada visita del Señor a nuestra vida.",
      "closing": "Señor, que desde la pequeñez de Belén y en la prisa amorosa de María hacia Isabel mostraste tu grandeza: visítanos también a nosotros y llénanos de tu Espíritu para reconocerte en cada hermano. Por Jesucristo nuestro Señor."
    }
  },
  "christmas": {
    "A": {
      "church": "Que la Iglesia proclame sin cesar el nombre que Isaías da al niño nacido en Belén -- 'Consejero admirable, Dios guerrero, Padre eterno, Príncipe de la paz' -- y que como los pastores, corra a anunciar lo que ha visto y oído esta noche santa.",
      "world": "Que las naciones que caminaban en tinieblas y hoy ven una luz grande, según la profecía de Isaías, depongan la vara del opresor y el bastón que gravita sobre sus hombros, y conozcan la paz sin límites del Príncipe recién nacido.",
      "parish": "Que esta comunidad, instruida por la gracia de Dios que se ha manifestado como salvación para todos los hombres según san Pablo a Tito, renuncie a la impiedad y a las pasiones mundanas y viva con sobriedad, justicia y piedad.",
      "suffering": "Que los que hoy sienten el peso de la noche encuentren, como los pastores en el campo, que la gloria del Señor los envuelve de claridad, y que el ángel les diga también a ellos: 'no temáis, os traigo una buena noticia de gran alegría'.",
      "dead": "Que los difuntos participen ya del gozo que los ángeles cantaron en Belén -- 'gloria a Dios en el cielo y en la tierra paz' -- y que descansen en la luz del Príncipe de la paz nacido esta noche.",
      "gospel": "Que, como los pastores que fueron corriendo a Belén y luego contaron lo que se les había dicho del niño, no guardemos para nosotros la alegría de esta noche, sino que la anunciemos con gozo a los que encontremos.",
      "closing": "Dios de toda gracia, que esta noche nos has dado un niño y un Príncipe de la paz sobre sus hombros: haz que, como los pastores, no callemos la buena noticia, y que tu gloria envuelva también nuestra vida. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, envuelta esta noche por la gloria del Señor como los pastores en el campo de Belén, anuncie sin miedo el nacimiento de Cristo el Señor y sea mensajera de la gran alegría que será para todo el pueblo.",
      "world": "Que sobre los hombros de los que gobiernan pese, como anuncia Isaías del niño nacido, el imperio de la paz sin límite, y que su trono se afiance en el derecho y la justicia desde ahora y para siempre.",
      "parish": "Que esta parroquia aguarde con esperanza la manifestación gloriosa de nuestro gran Dios y Salvador Jesucristo, que se entregó por nosotros para purificarnos como pueblo suyo, según escribe san Pablo a Tito.",
      "suffering": "Que a los que hoy están sumidos en oscuridad, como el pueblo que caminaba en tinieblas según Isaías, les nazca hoy la luz grande de Belén, y encuentren en el pesebre humilde un signo de que Dios se acerca a los pequeños.",
      "dead": "Que los difuntos, purificados ya por Aquel que se entregó por nosotros para hacernos pueblo suyo, participen del canto eterno de los ángeles: 'gloria a Dios en las alturas'.",
      "gospel": "Que, como los pastores que hallaron a María, a José y al niño reclinado en un pesebre, sepamos reconocer a Dios en la sencillez y la pobreza, y guardemos estas cosas meditándolas en el corazón como hizo María.",
      "closing": "Señor, que naciste en un pesebre y enviaste a los pastores como primeros testigos de tu gloria: haznos mensajeros de esta noche santa y guarda en nuestro corazón, como María, la memoria de tu venida. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Que la Iglesia sea como María, que guardaba todas estas cosas y las meditaba en su corazón, custodiando con fidelidad la memoria de esta noche en que se nos ha nacido un niño y se nos ha dado un hijo.",
      "world": "Que la señal dada a los pastores -- 'encontraréis un niño envuelto en pañales y acostado en un pesebre' -- recuerde a los poderosos del mundo que la paz verdadera nace de la humildad y no del poderío, y que el imperio de la paz se extienda sin límites.",
      "parish": "Que esta comunidad, enseñada por la gracia de Dios a vivir con sobriedad, justicia y piedad en este mundo, aguarde la bienaventurada esperanza de la manifestación de nuestro Salvador, como escribe san Pablo a Tito.",
      "suffering": "Que los pastores que velaban de noche sus rebaños y fueron los primeros en recibir la buena nueva nos recuerden que Dios se revela primero a los sencillos, y que los que sufren en el olvido sean los primeros destinatarios de su alegría.",
      "dead": "Que los difuntos entren en la multitud del ejército celestial que alababa a Dios diciendo 'gloria a Dios en el cielo y en la tierra paz a los hombres', y descansen en la paz del niño de Belén.",
      "gospel": "Que, glorificando y alabando a Dios como hicieron los pastores por todo lo que habían visto y oído, llevemos también nosotros esta alegría a quienes nos rodean sin guardarla solo para nosotros.",
      "closing": "Dios altísimo, que enviaste a tu Hijo envuelto en pañales y acostado en un pesebre como señal de tu amor: haz que guardemos esta noche en nuestro corazón como María y la compartamos como los pastores. Por Jesucristo nuestro Señor."
    }
  },
  "christmasSunday": {
    "A": {
      "church": "Que la Iglesia, como la Sagrada Familia que huyó a Egipto ante la persecución de Herodes, acompañe y proteja a las familias perseguidas y desplazadas, confiando en que Dios guía a su pueblo aun en la huida y el exilio.",
      "world": "Que los gobernantes no imiten a Herodes, que por conservar su poder persiguió al Niño inocente, sino que protejan a los más vulnerables y a los niños de toda violencia y amenaza.",
      "parish": "Que esta comunidad recuerde las misericordias del Señor y sus hazañas gloriosas, como proclama Isaías, y sea familia acogedora para quienes hoy huyen del peligro como José, María y el Niño huyeron a Egipto.",
      "suffering": "Que las familias que hoy huyen de la violencia, como la Sagrada Familia que escapó de noche hacia Egipto, encuentren caminos seguros, refugio y compasión en su travesía.",
      "dead": "Que los inocentes de toda época, como los niños de Belén asesinados por Herodes, y todos los difuntos que sufrieron violencia, descansen en los brazos del Dios que se hizo niño y compartió nuestra fragilidad.",
      "gospel": "Que, como José que obedeció sin demora la orden del ángel de huir a Egipto para salvar al Niño, actuemos con prontitud para proteger a los indefensos cuando el peligro amenaza a los más pequeños.",
      "closing": "Dios que guardaste a tu Hijo en la huida a Egipto y lo trajiste de vuelta a salvo, alaben todos tu nombre por tus misericordias: protege a las familias que hoy huyen del peligro y guíalas como guiaste a la Sagrada Familia. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como Simeón y Ana que reconocieron al Mesías en el templo, viva siempre atenta a los signos de la presencia de Dios y anuncie sin cansancio la redención de Jerusalén a cuantos la esperan.",
      "world": "Que los pueblos que hoy aguardan liberación como Ana la profetisa, encuentren en la presentación del Niño en el templo un signo de esperanza para la justicia y la redención de las naciones oprimidas.",
      "parish": "Que esta comunidad, revestida de entrañas de misericordia, bondad, humildad, mansedumbre y paciencia como pide san Pablo a los gálatas, acoja al Niño presentado en el templo con la misma fe de Simeón.",
      "suffering": "Que los ancianos que como Simeón esperan con paciencia el cumplimiento de la promesa de Dios encuentren consuelo, y que puedan decir también ellos: 'ahora, Señor, puedes dejar que tu siervo se vaya en paz'.",
      "dead": "Que los difuntos, como Simeón que pudo partir en paz después de ver la salvación de Dios, hayan visto ya con sus propios ojos la luz que alumbra a las naciones y descansen en esa misma paz.",
      "gospel": "Que, como Simeón que tomó al Niño en sus brazos y bendijo a Dios, sepamos reconocer y acoger a Cristo cuando se presenta en nuestra vida, aunque llegue de manera sencilla e inesperada.",
      "closing": "Señor, que fuiste presentado en el templo y reconocido por Simeón como luz para alumbrar a las naciones: concédenos también a nosotros ojos para verte y un corazón en paz al encontrarte. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Que la Iglesia crezca como el niño Samuel ante el Señor, y busque siempre, como los padres de Jesús que lo hallaron enseñando en el templo, comprender que la casa de Dios es también su propia casa.",
      "world": "Que las familias y las sociedades formen a sus jóvenes como Elcaná y Ana formaron a Samuel, dedicándolo al servicio del Señor, para que las nuevas generaciones crezcan en sabiduría y en gracia.",
      "parish": "Que esta comunidad, revestida de las virtudes que san Pablo recomienda a los colosenses -- misericordia, bondad, humildad, mansedumbre y paciencia -- deje que la paz de Cristo reine en sus corazones como en una sola familia.",
      "suffering": "Que los padres angustiados, como José y María que buscaron a Jesús durante tres días con gran angustia, encuentren consuelo cuando parece que han perdido lo que más aman, confiando en que el Señor cuida de los suyos.",
      "dead": "Que los difuntos, como el niño Samuel que fue dedicado al Señor todos los días de su vida, hayan cumplido su servicio y entren ya en la casa del Padre a la que Jesús decía pertenecer.",
      "gospel": "Que, como Jesús que respondió a sus padres '¿no sabíais que yo debía estar en la casa de mi Padre?', busquemos siempre primero las cosas de Dios, sin dejar de ser obedientes también en las tareas sencillas de cada día.",
      "closing": "Dios y Padre, en cuya casa se encontró a Jesús enseñando a los doctores: ayúdanos a buscarte con la misma perseverancia de María y José, y haz que nuestras familias crezcan en sabiduría, edad y gracia. Por Jesucristo nuestro Señor."
    }
  },
  "circumcision": {
    "A": {
      "church": "Que la Iglesia bendiga a los pueblos con la bendición sacerdotal que Dios entregó a Moisés -- 'el Señor te bendiga y te guarde, ilumine su rostro sobre ti' -- y proclame el nombre de Jesús, puesto por el ángel antes de que fuera concebido.",
      "world": "Que las naciones experimenten que Dios hace resplandecer su rostro sobre ellas y les otorga su favor, según la bendición de Números, y que los gobernantes gobiernen recordando que solo Dios pone su nombre sobre los pueblos para bendecirlos.",
      "parish": "Que esta comunidad, hecha hija de Dios y no ya esclava, como escribe san Pablo a los gálatas, viva la libertad de los hijos herederos por medio de Dios en este primer día del año nuevo.",
      "suffering": "Que los que sufren reciban hoy la bendición sacerdotal completa: que el Señor los guarde, ilumine su rostro sobre ellos y les conceda la paz, en este primer día del calendario que ponemos bajo su protección.",
      "dead": "Que los difuntos, sobre quienes el Señor hizo resplandecer su rostro en vida, gocen ya para siempre de la paz plena prometida en la bendición sacerdotal de Números.",
      "gospel": "Que, como los pastores que hallaron todo tal como se les había dicho y luego regresaron glorificando a Dios, comencemos este año nuevo dando gracias por el nombre de Jesús que hoy se proclama.",
      "closing": "Señor, que hiciste resplandecer tu rostro sobre nosotros y nos diste el nombre de Jesús para nuestra salvación: bendícenos en este año que comienza y guárdanos en tu paz todos sus días. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, enviada como los pastores a contar lo que se les había dicho del Niño, proclame en este nuevo año el nombre de Jesús con la misma alegría con que ellos volvieron glorificando y alabando a Dios.",
      "world": "Que sobre las naciones se cumpla la bendición de Números -- que el Señor haga resplandecer su rostro y les conceda la paz -- y que los pueblos reconozcan, como escribe san Pablo a los gálatas, que ya no son esclavos sino hijos.",
      "parish": "Que esta comunidad, hecha heredera por medio de Dios según la carta a los gálatas, inicie este año nuevo con la confianza de un hijo que clama '¡Abba, Padre!' por el Espíritu enviado a nuestros corazones.",
      "suffering": "Que los que sufren en este comienzo de año sientan sobre ellos la bendición antigua: que el Señor les bendiga, les guarde y les conceda la paz en medio de sus dificultades.",
      "dead": "Que los difuntos, ya liberados de toda esclavitud como hijos herederos de Dios, descansen bajo la bendición eterna del rostro del Señor que resplandece sobre ellos.",
      "gospel": "Que, como María que guardaba todas las cosas meditándolas en su corazón, empecemos este año meditando el nombre de Jesús y su significado para nuestra vida.",
      "closing": "Padre, que nos enviaste a tu Hijo bajo la ley para hacernos hijos tuyos y no esclavos: bendícenos en este año nuevo con el rostro resplandeciente de tu bendición y tu paz. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Que la Iglesia comience el año proclamando el nombre santo de Jesús, puesto por el ángel antes de su concepción, y sea instrumento de la bendición que Dios promete a Moisés: 'pondrán mi nombre sobre los hijos de Israel y yo los bendeciré'.",
      "world": "Que en este primer día del año las naciones reciban la paz que solo Dios concede, según la bendición sacerdotal de Números, y que los gobernantes busquen que el rostro del Señor resplandezca sobre sus pueblos.",
      "parish": "Que esta comunidad, hecha hija de Dios por medio de Cristo nacido de mujer y bajo la ley, como escribe san Pablo a los gálatas, viva este año nuevo con la libertad y la confianza de quien puede llamar a Dios '¡Abba, Padre!'",
      "suffering": "Que los que sufren al comenzar este año encuentren consuelo en la antigua bendición: que el Señor los guarde, les muestre su rostro y les dé paz en medio de toda incertidumbre.",
      "dead": "Que los difuntos participen ya plenamente de la bendición sacerdotal pronunciada sobre el pueblo de Dios, con el rostro del Señor resplandeciendo sobre ellos para siempre.",
      "gospel": "Que, al circuncidar y nombrar a Jesús a los ocho días como manda la ley, aprendamos a comenzar cada año y cada etapa de la vida bajo el nombre y la protección de Cristo.",
      "closing": "Dios eterno, que a través de los siglos bendices a tu pueblo con tu nombre y tu rostro resplandeciente: acompaña este año que comienza bajo el nombre de Jesús y concédenos tu paz todos los días. Por Jesucristo nuestro Señor."
    }
  },
  "epiphany": {
    "A": {
      "church": "Que la Iglesia, iluminada por la gloria del Señor como Jerusalén en la profecía de Isaías, se levante y brille para que todas las naciones caminen hacia su luz; y que los misioneros lleven esta claridad hasta los confines de la tierra.",
      "world": "Que los reyes y gobernantes de la tierra, como los sabios de Oriente, se dejen guiar por una estrella de justicia y verdad; y que las naciones traigan sus mejores dones al servicio del bien común.",
      "parish": "Que esta parroquia sea como la estrella que guio a los Magos, señalando siempre el camino hacia Cristo para quienes buscan sentido; y que sepamos acoger al forastero como se acogió a los visitantes venidos de lejos.",
      "suffering": "Que los que caminan hoy en tinieblas de dolor o enfermedad vean levantarse sobre ellos la luz del Señor; y que quienes los acompañan sean para ellos oro de consuelo, incienso de oración y mirra de ternura.",
      "dead": "Que nuestros difuntos, guiados en vida como los Magos por la fe, contemplen ahora sin velos la gloria que vieron anunciada en la estrella; y que caminemos hacia la misma luz que ellos alcanzaron.",
      "gospel": "Que sepamos, como los Magos, postrarnos ante Cristo y ofrecerle lo mejor de nosotros mismos; y que, advertidos como ellos en sueños, sepamos tomar caminos distintos cuando el mal acecha nuestra vida.",
      "closing": "Dios que guiaste a los Magos de Oriente con una estrella hasta la cuna de tu Hijo, guía también nuestros pasos hacia la luz de Cristo; concede que, habiéndolo hallado, le ofrezcamos el oro de nuestro amor, el incienso de nuestra oración y la mirra de nuestra entrega. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia se revista de la luz de la que habla Isaías y refleje sobre todos los pueblos la gloria del Señor que ha nacido; y que jamás oculte esta luz por temor o comodidad.",
      "world": "Que las naciones traigan, como los Magos, sus riquezas al servicio de la paz y no de la guerra; y que los gobernantes reconozcan que ante Cristo todo poder humano debe inclinarse.",
      "parish": "Que nuestra comunidad, al ver la estrella de la fe, se llene de alegría inmensa como los Magos al llegar a Belén; y que sepamos compartir esa misma alegría con quienes aún no conocen a Cristo.",
      "suffering": "Que quienes sufren encuentren en Cristo, manifestado a las naciones, la certeza de que ninguna oscuridad tiene la última palabra; y que los que cuidan de ellos sean mensajeros de esa luz.",
      "dead": "Que nuestros hermanos difuntos hayan sido recibidos por la luz eterna hacia la que se dirigía la estrella de Belén; y que un día nos reunamos con ellos ante el mismo Niño que los Magos adoraron.",
      "gospel": "Que, como los Magos que regresaron por otro camino, sepamos que el encuentro con Cristo transforma la dirección de nuestra vida; y que no volvamos jamás a los caminos de antes.",
      "closing": "Padre, que manifestaste a tu Hijo a los Magos venidos de tierras lejanas, haz que toda la humanidad reconozca en Cristo la luz de las naciones; concede que nuestra vida entera sea una ofrenda digna puesta a sus pies. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, misterio revelado a Pablo según leemos en Efesios, anuncie sin descanso las insondables riquezas de Cristo a judíos y gentiles por igual; y que ningún pueblo quede fuera de esta promesa.",
      "world": "Que los pueblos de la tierra, representados en los Magos venidos de Oriente, reconozcan en Cristo al Rey que no divide sino que congrega; y que las fronteras entre naciones no impidan buscar juntos la misma estrella.",
      "parish": "Que esta comunidad parroquial sea un lugar donde todos, como los Magos de tierras diversas, se sientan bienvenidos ante el pesebre; y que ofrezcamos siempre lo mejor que tenemos para el servicio de Cristo.",
      "suffering": "Que los que sufren hallen en la promesa de Isaías —'ha llegado tu luz'— la certeza de que su noche también será alumbrada; y que no les falte quien camine a su lado como una estrella.",
      "dead": "Que nuestros difuntos, coherederos de la misma promesa anunciada por Pablo a los gentiles, participen ya de la plenitud de la luz que vislumbraron en la fe; y que un día los sigamos hasta esa misma gloria.",
      "gospel": "Que sepamos, como los Magos, no dejarnos desviar por los Herodes de nuestro tiempo que buscan usar a Cristo para sus propios fines; y que guardemos siempre la sencillez de quien solo busca adorar.",
      "closing": "Dios eterno, que reúnes a todos los pueblos bajo la misma estrella de tu Hijo, haz de tu Iglesia un signo visible de esa unidad prometida a Abraham; concede que ofrezcamos a Cristo el oro de la fe, el incienso de la esperanza y la mirra de la caridad. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "baptismLord": {
    "A": {
      "church": "Que la Iglesia, siervo humilde anunciado por Isaías, no quiebre la caña cascada ni apague la mecha que aún humea; y que trate con la misma delicadeza a los débiles en la fe que se acercan a ella.",
      "world": "Que los gobernantes ejerzan la justicia sin gritar ni levantar la voz en las plazas, como el siervo del Señor; y que las naciones aprendan a gobernar con mansedumbre y no con estrépito.",
      "parish": "Que esta parroquia acoja a los recién bautizados como Dios acogió a Jesús en el Jordán, reconociéndolos como hijos amados; y que cada bautismo celebrado aquí sea ocasión de verdadero gozo comunitario.",
      "suffering": "Que los que se sienten como cañas cascadas o mechas que apenas humean encuentren en Cristo a quien no los quiebra ni los apaga, sino que los sostiene; y que nadie desprecie al débil o al herido.",
      "dead": "Que nuestros difuntos, sellados un día con las aguas del bautismo, hayan escuchado ya la voz del Padre que los llama hijos amados; y que nosotros sigamos fieles a esa misma alianza hasta el final.",
      "gospel": "Que, como Jesús en el Jordán, vivamos nuestro bautismo como una entrega total a la voluntad del Padre; y que estemos atentos a la voz que también sobre nosotros dice: 'este es mi hijo amado'.",
      "closing": "Padre, que sobre las aguas del Jordán proclamaste a Jesús tu Hijo amado, renueva en nosotros la gracia de nuestro propio bautismo; concede que, como la caña cascada que no quiebras, seamos sostenidos por tu fidelidad. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, nacida del Espíritu que un día se cernía sobre las aguas primordiales, sea instrumento de una nueva creación en medio del caos del mundo; y que nunca deje de invocar a ese mismo Espíritu.",
      "world": "Que las naciones, sumidas a veces en el desorden y el vacío del que habla el Génesis, encuentren en el Espíritu de Dios la fuerza para ordenar la convivencia humana con justicia; y que la creación entera sea respetada como obra buena de Dios.",
      "parish": "Que en esta parroquia el Espíritu descienda sobre cada bautizado como paloma sobre Jesús en el Jordán; y que cada nuevo miembro de la comunidad sea recibido como hijo amado del Padre.",
      "suffering": "Que los que atraviesan un caos interior semejante al de las aguas primordiales sientan que el Espíritu de Dios se cierne también sobre ellos, trayendo orden y esperanza; y que no les falte compañía en su noche.",
      "dead": "Que nuestros difuntos, formados por el mismo Espíritu que aleteaba sobre las aguas en el principio, sean llevados ahora a la plenitud de la nueva creación; y que descansen en la luz que separó las tinieblas.",
      "gospel": "Que, al ver al Espíritu descender sobre Jesús como paloma en el Jordán, reconozcamos que también nosotros llevamos ese mismo Espíritu desde nuestro bautismo; y que vivamos como verdaderos hijos amados del Padre.",
      "closing": "Dios creador, que en el principio tu Espíritu se cernía sobre las aguas y que en el Jordán descendió como paloma sobre tu Hijo, haz nueva nuestra vida bautismal; concede que vivamos siempre bajo la voz que nos llama amados. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia proclame sin cesar la palabra de Isaías: 'no temas, te he redimido, te llamé por tu nombre'; y que cada bautizado sepa que pertenece a Dios de manera irrevocable, pase por agua o por fuego.",
      "world": "Que las naciones que atraviesan ríos de dificultad o llamas de conflicto escuchen la promesa hecha a Israel de que Dios está con ellas; y que ningún pueblo se sienta abandonado en su prueba.",
      "parish": "Que esta comunidad llame a cada uno de sus miembros por su nombre, como Dios llamó a Israel, reconociendo el valor único de cada persona; y que nadie se sienta un número anónimo entre nosotros.",
      "suffering": "Que los que sienten que las aguas los anegan o el fuego los consume escuchen la promesa de Isaías: 'no temas, yo te he redimido'; y que Dios esté verdaderamente con ellos al cruzar sus ríos.",
      "dead": "Que nuestros difuntos, llamados por Dios por su propio nombre desde antes de nacer, hayan cruzado ya las aguas de la muerte hacia la vida sin fin; y que la misma promesa nos sostenga a nosotros.",
      "gospel": "Que, como el pueblo que esperaba junto a Juan en el Jordán, nos dispongamos a escuchar la voz del cielo que también sobre nosotros proclama la filiación divina recibida en el bautismo.",
      "closing": "Señor, que llamaste a tu pueblo por su nombre y le dijiste 'no temas, yo te he redimido', y que sobre las aguas del Jordán abriste los cielos sobre tu Hijo, no permitas que las aguas ni el fuego nos separen de ti. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "epi1": {
    "A": {
      "church": "Que la Iglesia, como el siervo de Isaías llamado desde el seno materno, reconozca que su misión de anunciar a Cristo estaba prevista desde antes de su nacimiento; y que jamás dude de su vocación aun cuando parezca trabajar en vano.",
      "world": "Que las naciones vean cumplida la promesa hecha al siervo de ser 'luz de las naciones para que la salvación llegue hasta los confines de la tierra'; y que ningún pueblo quede excluido de esa luz.",
      "parish": "Que esta parroquia, como Juan el Bautista, sepa señalar a Cristo sin atraer la atención sobre sí misma, diciendo también hoy 'he ahí el Cordero de Dios' a quienes buscan sentido en sus vidas.",
      "suffering": "Que los que sienten haber trabajado en vano, como a veces temía el siervo de Isaías, descubran que su esfuerzo y su dolor tienen un valor oculto ante Dios; y que no pierdan la esperanza.",
      "dead": "Que nuestros difuntos, formados por Dios desde el vientre materno para ser suyos, hayan sido recibidos en la gloria por Aquel que los llamó por su nombre antes de que existieran.",
      "gospel": "Que, al escuchar a Juan Bautista señalar a Jesús como el Cordero de Dios, nosotros también sigamos a Cristo sin demora, como hicieron los primeros discípulos que se quedaron con él aquel día.",
      "closing": "Señor, que llamaste a tu siervo desde el seno materno para ser luz de las naciones, haznos también instrumentos de esa misma luz; concede que, al escuchar el testimonio del Bautista, sigamos sin vacilar al Cordero de Dios. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia aprenda de Samuel a responder con prontitud 'habla, que tu siervo escucha' cada vez que Dios la llama en medio de la noche de la historia; y que nunca confunda la voz de Dios con el ruido del mundo.",
      "world": "Que los pueblos y sus gobernantes reconozcan que el cuerpo humano, del que habla Pablo a los Corintios, es templo del Espíritu Santo; y que las leyes protejan siempre la dignidad de toda persona.",
      "parish": "Que esta comunidad sea como Elí, que ayudó a Samuel a reconocer la voz de Dios; y que sepamos acompañar a los jóvenes de la parroquia para que descubran su propia vocación.",
      "suffering": "Que los que sufren en soledad, como Samuel en el silencio del templo antes de conocer a Dios, escuchen finalmente una voz que los llama por su nombre; y que encuentren quien los acompañe como Elí acompañó al joven profeta.",
      "dead": "Que nuestros difuntos, conocidos por Dios en lo más íntimo de su ser como canta el salmo 139, descansen ahora ante Aquel que escudriña el corazón y no se equivoca jamás.",
      "gospel": "Que, como Natanael al escuchar 'te vi bajo la higuera', reconozcamos que Cristo nos conocía antes de que nosotros lo buscáramos; y que respondamos con la misma fe: 'Tú eres el Hijo de Dios'.",
      "closing": "Señor, que llamaste a Samuel en el silencio de la noche y viste a Natanael bajo la higuera antes de que te buscara, sigue llamándonos por nuestro nombre; concede que respondamos siempre: 'aquí estoy, habla, que tu siervo escucha'. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia reconozca, como enseña Pablo a los Corintios, que hay diversidad de dones pero un mismo Espíritu que los reparte; y que cada carisma se ponga siempre al servicio del bien común.",
      "world": "Que las naciones vean en la promesa de Isaías a Sion —'ya no te llamarán abandonada'— un signo de que ningún pueblo está condenado al olvido; y que los desposeídos recuperen su dignidad como una esposa amada.",
      "parish": "Que esta parroquia, como María en las bodas de Caná, esté atenta a las necesidades escondidas de la comunidad y sepa interceder ante su Hijo diciendo 'no tienen vino' cuando algo falta.",
      "suffering": "Que los que sufren como agua sin sabor encuentren en Cristo, que transformó el agua en vino en Caná, la fuerza para transformar también su dolor en signo de vida nueva.",
      "dead": "Que nuestros difuntos, invitados como los novios de Caná al banquete de las bodas del Cordero, gocen ya del vino nuevo y abundante que Cristo reserva para el final de los tiempos.",
      "gospel": "Que, como los sirvientes de Caná que llenaron las tinajas sin entender del todo lo que sucedía, obedezcamos la palabra de Cristo aunque no comprendamos aún sus designios: 'haced lo que él os diga'.",
      "closing": "Señor, que en las bodas de Caná transformaste el agua en vino a petición de tu Madre, transforma también nuestra pobreza en abundancia; concede que sepamos reconocer los dones que tu Espíritu reparte entre nosotros. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "epi2": {
    "A": {
      "church": "Que la Iglesia sea para los pueblos que caminan en tinieblas la gran luz anunciada por Isaías; y que, unida en torno a Cristo y no dividida en facciones como reprochaba Pablo a los corintios, brille con un solo mensaje.",
      "world": "Que las naciones sumidas en sombra de guerra o desesperanza vean levantarse sobre ellas la luz de la que habla Isaías; y que los gobernantes trabajen por disipar esas tinieblas con justicia.",
      "parish": "Que esta parroquia, junto al 'mar de Galilea' de nuestra vida cotidiana, escuche la llamada de Cristo a dejarlo todo y seguirlo, como hicieron Pedro, Andrés, Santiago y Juan.",
      "suffering": "Que los que caminan en tinieblas de enfermedad o angustia vean la gran luz que Isaías anunció al pueblo oprimido; y que el Señor sea, como canta el salmo, su luz y su salvación.",
      "dead": "Que nuestros difuntos, que caminaron en la tiniebla de esta vida mortal, contemplen ahora la gran luz reservada a quienes esperaron en el Señor como su luz y su salvación.",
      "gospel": "Que, como Pedro y Andrés que dejaron las redes al instante, respondamos sin demora a la llamada de Cristo a seguirlo, dejando atrás lo que nos ata a la orilla.",
      "closing": "Señor, que eres nuestra luz y salvación, disipa las tinieblas que aún envuelven a los pueblos y a nuestros propios corazones; concede que, llamados junto al mar como los primeros discípulos, dejemos las redes y te sigamos sin tardanza. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia predique con la urgencia de Jonás en Nínive, sabiendo que el tiempo apremia; y que, como aquella ciudad pagana, los pueblos que escuchan su predicación se conviertan de veras.",
      "world": "Que las naciones, como Nínive ante la predicación de Jonás, sepan reconocer sus errores a tiempo y cambiar de rumbo antes de que sea demasiado tarde; y que ningún gobernante endurezca el corazón ante la llamada a la conversión.",
      "parish": "Que esta comunidad, llamada como Pedro y Andrés junto al mar de Galilea, deje las redes de la rutina y del miedo para convertirse en pescadora de hombres al servicio del Evangelio.",
      "suffering": "Que los que sufren descansen en Dios solo, como canta el salmo, sin poner su esperanza en riquezas ni en seguridades pasajeras que no pueden sanar su dolor.",
      "dead": "Que nuestros difuntos, que vivieron 'como si no' poseyeran las cosas de este mundo pasajero según la enseñanza de Pablo, hayan entrado ya en lo único que permanece para siempre.",
      "gospel": "Que, al escuchar a Jesús decir 'os haré pescadores de hombres', dejemos también nosotros las redes que nos atan y sigamos su llamada con la misma prontitud que Pedro y Andrés.",
      "closing": "Señor, que llamaste a los ninivitas a la conversión y a Pedro y Andrés a dejar las redes junto al mar, llama también a nuestro corazón fácilmente distraído; concede que descansemos en ti solo, como en nuestra única roca. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, un solo cuerpo con muchos miembros según la imagen de Pablo a los Corintios, valore por igual a cada uno de sus miembros; y que ninguna parte del cuerpo se sienta innecesaria para las demás.",
      "world": "Que las naciones escuchen la Ley leída solemnemente por Esdras como el pueblo en Nehemías, y que el gozo del Señor sea también su fortaleza en tiempos de reconstrucción y esperanza.",
      "parish": "Que esta parroquia, como la sinagoga de Nazaret donde Jesús leyó a Isaías, sea un lugar donde hoy mismo se cumpla la Escritura: donde se dé buena noticia a los pobres y libertad a los oprimidos.",
      "suffering": "Que los que sufren escuchen de nuevo la promesa que Jesús proclamó en Nazaret: 'me ha enviado a anunciar a los pobres la Buena Nueva, a vendar los corazones rotos, a dar libertad a los cautivos'.",
      "dead": "Que nuestros difuntos, miembros de un mismo cuerpo del que Cristo es cabeza, participen ya plenamente de la vida que en esta tierra solo vislumbraron como miembros dispersos.",
      "gospel": "Que, como los que escuchaban a Jesús en la sinagoga de Nazaret, reconozcamos que hoy mismo se cumple ante nosotros la Escritura, y que no la dejemos pasar como una palabra más.",
      "closing": "Señor, que en la sinagoga de Nazaret proclamaste el cumplimiento de la promesa de Isaías, haz que también hoy se cumpla tu palabra entre nosotros; concede que, como un solo cuerpo, cada miembro de tu Iglesia encuentre su lugar y su gozo. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "epi3": {
    "A": {
      "church": "Que la Iglesia practique la justicia, ame la misericordia y camine humildemente con su Dios, como resume el profeta Miqueas toda la Ley; y que nunca sustituya estas exigencias por sacrificios vacíos.",
      "world": "Que los gobernantes recuerden lo que pide el Señor, según Miqueas: actuar con justicia y amar la misericordia; y que las naciones no confundan el poder con el derecho a oprimir al débil.",
      "parish": "Que esta parroquia viva las Bienaventuranzas como programa de vida, sabiendo que Dios ha escogido lo débil del mundo para avergonzar a los fuertes, según escribe Pablo a los Corintios.",
      "suffering": "Que los que lloran, los mansos, los que tienen hambre y sed de justicia encuentren consuelo en la promesa de Jesús: 'bienaventurados', pues de ellos será el Reino de los cielos.",
      "dead": "Que nuestros difuntos, que caminaron humildemente con su Dios como pide Miqueas, vivan ahora en la presencia del Señor prometida a quienes obraron la justicia en esta vida.",
      "gospel": "Que las Bienaventuranzas proclamadas por Jesús en la montaña sean nuestra brújula diaria; y que aprendamos a ver bendición donde el mundo solo ve debilidad, pobreza o mansedumbre.",
      "closing": "Señor, que por boca de Miqueas nos pediste actuar con justicia, amar la misericordia y caminar humildemente contigo, y que en la montaña proclamaste bienaventurados a los pobres y mansos, haznos vivir según esa misma sabiduría que el mundo no comprende. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia sea aquel profeta como Moisés que Dios prometió a su pueblo en el Deuteronomio, hablando con la misma autoridad con que Jesús habló en la sinagoga de Cafarnaún.",
      "world": "Que las naciones reconozcan la autoridad verdadera, no la que oprime sino la que libera, como la de Jesús que expulsó al espíritu impuro en Cafarnaún ante el asombro de todos.",
      "parish": "Que en esta comunidad ejerzamos la libertad con responsabilidad hacia los más débiles en la fe, como enseña Pablo a los Corintios sobre comer carne sacrificada a los ídolos, para no ser piedra de tropiezo.",
      "suffering": "Que los que están atados por espíritus de angustia o adicción encuentren en Cristo, que liberó al poseído en la sinagoga de Cafarnaún, la misma palabra de autoridad que libera y sana.",
      "dead": "Que nuestros difuntos hayan escuchado ya, definitivamente libres de toda atadura, la voz de Aquel que habla con autoridad y que un día expulsó de este mundo todo espíritu de muerte.",
      "gospel": "Que, como los presentes en la sinagoga de Cafarnaún, nos asombremos de la autoridad de Cristo sobre el mal; y que le pidamos que expulse también de nuestra vida cuanto nos esclaviza.",
      "closing": "Señor, que en la sinagoga de Cafarnaún hablaste con autoridad y expulsaste al espíritu impuro ante el asombro de todos, libéranos también a nosotros de cuanto nos esclaviza; concede que tu palabra tenga la última voz en nuestra vida. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia recuerde, como Jeremías, que fue conocida por Dios antes de ser formada en el vientre; y que anuncie sin miedo la Palabra aunque encuentre el rechazo que Jesús sufrió en su propia Nazaret.",
      "world": "Que las naciones aprendan de Pablo a los Corintios que sin caridad nada son, aunque tuvieran toda la elocuencia o el conocimiento; y que gobiernen con amor y no solo con poder.",
      "parish": "Que esta parroquia no rechace a los profetas que Dios envía en su propio seno, como Nazaret rechazó a Jesús; y que sepamos acoger la palabra incómoda que también viene de los nuestros.",
      "suffering": "Que los que sufren rechazo o incomprensión, como Jeremías o como el propio Jesús en Nazaret, encuentren fuerza en saber que Dios los formó y los conoció antes de nacer.",
      "dead": "Que nuestros difuntos, formados por Dios en el vientre materno según la vocación de Jeremías, hayan llegado ya a la plenitud del amor que, como canta Pablo, nunca pasa.",
      "gospel": "Que no rechacemos a Cristo cuando se presenta de forma incómoda o familiar, como le ocurrió en Nazaret; y que estemos dispuestos a acoger la Palabra aun cuando venga de labios conocidos.",
      "closing": "Señor, que conociste a Jeremías antes de formarlo en el vientre y que fuiste rechazado en tu propia Nazaret, danos oídos para acoger tu palabra venga de donde venga; concede que la caridad, que nunca pasa, presida todas nuestras obras. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "epi4": {
    "A": {
      "church": "Que la Iglesia practique el ayuno que agrada a Dios según Isaías: partir el pan con el hambriento y romper las cadenas de la injusticia; y que sea sal de la tierra y luz del mundo como pide Jesús.",
      "world": "Que los gobernantes trabajen por el ayuno verdadero que pide Isaías: liberar al oprimido, compartir el pan y no volver la espalda al necesitado; y que la justicia social sea prioridad de las naciones.",
      "parish": "Que esta parroquia sea sal que no pierde su sabor ni luz escondida bajo el celemín, como enseña Jesús; y que nuestras buenas obras iluminen a cuantos nos rodean.",
      "suffering": "Que los hambrientos encuentren pan compartido y los sin techo hallen cobijo, cumpliendo así el ayuno que Isaías pide: 'partir tu pan con el hambriento, alojar a los pobres sin hogar'.",
      "dead": "Que nuestros difuntos, que fueron luz para otros en esta vida según su medida, brillen ahora como el justo que, según el salmo, es luz en las tinieblas para los rectos.",
      "gospel": "Que seamos sal de la tierra y luz del mundo, como pide Jesús en el Sermón del Monte; y que nuestra luz brille ante los hombres para gloria del Padre que está en los cielos.",
      "closing": "Señor, que por boca de Isaías pediste un ayuno de justicia y compartir el pan con el hambriento, y que llamaste a los tuyos sal de la tierra y luz del mundo, no dejes que nuestra sal pierda su sabor. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia levante vuelo como las águilas de la promesa de Isaías, renovando sus fuerzas en el Señor sin cansarse jamás de anunciar el Evangelio a toda criatura.",
      "world": "Que las naciones agotadas por el conflicto esperen en el Señor para renovar sus fuerzas, como promete Isaías a quienes esperan en él: 'levantarán vuelo como águilas'.",
      "parish": "Que esta comunidad, como Jesús que sanó a la suegra de Pedro y a muchos enfermos a la puerta de la casa, sea lugar de sanación y acogida para cuantos llegan buscando alivio.",
      "suffering": "Que los enfermos experimenten la cercanía de Cristo, que tomó de la mano a la suegra de Pedro y la levantó de la fiebre; y que Dios sane también los corazones destrozados, como canta el salmo.",
      "dead": "Que nuestros difuntos, cansados y agotados por esta vida mortal, hayan encontrado ya en el Señor la fuerza para levantar vuelo como águilas hacia la vida eterna.",
      "gospel": "Que, como Jesús que se retiraba a un lugar solitario a orar antes del amanecer, encontremos también nosotros tiempo y espacio para el silencio y la oración en medio de nuestras ocupaciones.",
      "closing": "Señor, que prometes fuerzas nuevas a quienes esperan en ti y que sanaste a la suegra de Pedro tomándola de la mano, levántanos también a nosotros de nuestra fiebre y cansancio; concede que renovemos nuestras fuerzas como el águila que levanta el vuelo. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Isaías ante la visión del Señor en el templo, responda con humildad 'heme aquí, envíame a mí' cuando Dios la llama a una misión que parece superior a sus fuerzas.",
      "world": "Que las naciones reconozcan su pequeñez ante la santidad de Dios, como Isaías al exclamar '¡ay de mí, que soy hombre de labios impuros!'; y que gobiernen con la humildad que exige el verdadero servicio.",
      "parish": "Que esta parroquia, como Simón Pedro que tras la pesca milagrosa dejó las barcas para seguir a Jesús, confíe en la palabra del Señor aun cuando la experiencia diga que no hay nada que pescar.",
      "suffering": "Que los que se sienten indignos o pecadores, como Pedro que exclamó 'apártate de mí, Señor, que soy un pecador', descubran que Cristo no los rechaza sino que los llama precisamente así.",
      "dead": "Que nuestros difuntos, purificados como Isaías por el carbón encendido del altar, hayan sido llevados a la presencia de Aquel cuya gloria llena toda la tierra.",
      "gospel": "Que, como Pedro tras la pesca abundante en el lago de Genesaret, dejemos las barcas de nuestras seguridades para convertirnos también nosotros en pescadores de hombres.",
      "closing": "Señor, que te apareciste a Isaías en el templo entre serafines que cantaban 'santo, santo, santo', y que llenaste las redes de Pedro hasta romperlas, llena también nuestra vida vacía; concede que respondamos como ellos: 'heme aquí, envíame a mí'. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "epi5": {
    "A": {
      "church": "Que la Iglesia proponga siempre a sus fieles, como el Deuteronomio a Israel, la vida y el bien frente a la muerte y el mal; y que nunca deje de invitar a elegir el camino que conduce a Dios.",
      "world": "Que las naciones elijan la vida y no la muerte en sus políticas y decisiones, como pide Moisés a Israel antes de entrar en la tierra prometida; y que los pueblos prosperen bajo leyes justas.",
      "parish": "Que esta comunidad camine en la ley del Señor con integridad de corazón, como canta el salmo 119, dichosos los que la guardan y la buscan de todo corazón.",
      "suffering": "Que los que sufren por la ira ajena, por promesas rotas o por relaciones dañadas encuentren en la radicalización del amor que pide Jesús una senda de reconciliación y sanación.",
      "dead": "Que nuestros difuntos, que en vida eligieron el camino de la bendición y no el de la maldición, hayan entrado ya en la vida plena que el Deuteronomio prometía a quien elige a Dios.",
      "gospel": "Que llevemos a plenitud, como pide Jesús, no solo la letra de los mandamientos sino su espíritu: reconciliándonos antes de ofrecer nuestro don, y siendo veraces en nuestra palabra sin necesidad de juramentos.",
      "closing": "Señor, que pusiste ante Israel el camino de la vida y el de la muerte, y que en el monte nos enseñaste a llevar la Ley a su cumplimiento en el amor, ayúdanos a elegir siempre la vida; concede que nuestra palabra sea sencilla y verdadera. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia sea, como Jesús ante el leproso, aquella mano que se extiende y toca al excluido diciendo 'quiero, queda limpio'; y que nunca levante muros donde Cristo tiende puentes.",
      "world": "Que las naciones acojan a quienes hoy son tratados como leprosos por su origen, enfermedad o condición social; y que, como Naamán en el Jordán, encuentren un camino de dignidad y sanación.",
      "parish": "Que esta parroquia no excluya a nadie por vergüenza o prejuicio, recordando que Jesús extendió la mano y tocó al leproso cuando nadie más se atrevía a acercarse.",
      "suffering": "Que los enfermos de cuerpo y alma, como Naamán que se lavó siete veces en el Jordán, encuentren sanación en los medios sencillos que Dios dispone, aunque parezcan insuficientes a sus ojos.",
      "dead": "Que nuestros difuntos, purificados como el leproso que Jesús tocó y sanó, gocen ahora de la plenitud del cuerpo glorioso alejado de toda mancha o enfermedad.",
      "gospel": "Que, como el leproso que se postró ante Jesús diciendo 'si quieres, puedes limpiarme', acudamos con humilde confianza a Cristo con nuestras propias impurezas y heridas.",
      "closing": "Señor, que extendiste la mano para tocar al leproso y que llevaste a Naamán a lavarse en las aguas del Jordán, límpianos también a nosotros de cuanto nos aparta de ti; concede que te alabemos, pues nos has librado. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia sea como el árbol plantado junto a la corriente del que habla Jeremías, con raíces hundidas en la confianza en Dios y no en la fuerza humana; y que jamás confíe en el poder de este mundo.",
      "world": "Que las naciones no pongan su confianza en alianzas de conveniencia ni en su propia fuerza, como advierte Jeremías, sino en la justicia que solo Dios puede garantizar de manera duradera.",
      "parish": "Que esta comunidad viva las Bienaventuranzas y los ayes proclamados por Jesús en el llano, prefiriendo la pobreza compartida y el hambre de justicia a la saciedad indiferente.",
      "suffering": "Que los pobres, los que lloran y los perseguidos que Jesús proclama dichosos en el llano encuentren en esta bienaventuranza la certeza de que Dios no ha olvidado su condición.",
      "dead": "Que nuestros difuntos, que confiaron en el Señor y no en el hombre como enseña Jeremías, sean ahora como el árbol junto a la corriente que jamás deja de dar fruto ni de tener hojas verdes.",
      "gospel": "Que, al escuchar las Bienaventuranzas y los ayes que Jesús proclamó en el llano, revisemos en qué ponemos nuestra seguridad: en las riquezas y la saciedad de hoy, o en la promesa del Reino.",
      "closing": "Señor, que prometiste ser como corriente de agua para el árbol plantado junto a ella, y que en el llano proclamaste dichosos a los pobres y a los que lloran, arraiga nuestra confianza únicamente en ti. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "epi6": {
    "A": {
      "church": "Que la Iglesia sea santa como el Levítico pide a Israel: 'sed santos, porque yo, el Señor vuestro Dios, soy santo'; y que ame al prójimo como a sí misma dejando espiga para el pobre en los márgenes de sus campos.",
      "world": "Que las naciones dejen, como manda el Levítico, espigas para el pobre y el forastero en los márgenes de sus cosechas; y que la justicia social no olvide a quien nada tiene.",
      "parish": "Que esta parroquia ame a sus enemigos y ponga la otra mejilla, como pide Jesús en el Sermón del Monte, superando la ley del talión con la lógica desbordante del amor.",
      "suffering": "Que los que son maltratados o explotados encuentren en la comunidad cristiana quien no los juzgue ni los abandone, cumpliendo el mandato de amar al prójimo como a uno mismo.",
      "dead": "Que nuestros difuntos, que buscaron ser santos como Dios es santo, participen ya de esa misma santidad en la presencia definitiva del Señor.",
      "gospel": "Que amemos a nuestros enemigos y oremos por quienes nos persiguen, como enseña Jesús, sabiendo que así seremos verdaderamente hijos de nuestro Padre celestial.",
      "closing": "Señor, que nos mandaste ser santos como tú eres santo y amar al prójimo como a nosotros mismos, y que en el monte nos pediste amar incluso a los enemigos, enséñanos tus caminos. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia anuncie la novedad de la que habla Isaías —'yo hago algo nuevo, no os acordéis de las cosas antiguas'— y no quede anclada en viejas heridas que le impiden avanzar en la misión.",
      "world": "Que las naciones divididas por rencores antiguos escuchen la promesa de Isaías de que Dios hace algo nuevo, abriendo caminos en el desierto y ríos en la estepa de la reconciliación.",
      "parish": "Que esta comunidad, como los que bajaron al paralítico por el techo ante Jesús, no se detenga ante obstáculos cuando se trata de acercar a alguien necesitado a la misericordia de Dios.",
      "suffering": "Que los enfermos y los que se sienten paralizados por el pecado o el dolor escuchen las palabras de Jesús al paralítico: 'tus pecados te son perdonados, levántate y anda'.",
      "dead": "Que nuestros difuntos, cuyas culpas Dios ha borrado como promete Isaías ('yo soy quien borra tus crímenes por amor de mí mismo'), descansen ya libres de toda carga en la paz del Señor.",
      "gospel": "Que, como los amigos que abrieron un boquete en el techo para bajar al paralítico ante Jesús, no dejemos de acercar a otros a Cristo aunque los caminos habituales estén bloqueados.",
      "closing": "Señor, que anuncias hacer algo nuevo y abrir caminos en el desierto, y que perdonaste y sanaste al paralítico bajado por el techo, sana también nuestra alma, pues hemos pecado contra ti. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como José ante sus hermanos que lo vendieron, sepa perdonar sin reservas a quienes le han hecho daño; y que sea siempre instrumento de reconciliación entre los pueblos y las familias.",
      "world": "Que las naciones enemistadas encuentren, como los hermanos de José, un camino de reconciliación cuando menos lo esperan; y que el perdón sea posible incluso después de las peores traiciones.",
      "parish": "Que esta comunidad ame a sus enemigos y haga el bien a quienes la aborrecen, como pide Jesús en el llano, y que la medida generosa con que demos nos sea devuelta.",
      "suffering": "Que los que han sido traicionados como José por sus propios hermanos encuentren la fuerza para perdonar y ver, más allá del mal recibido, un designio de bien que Dios puede sacar incluso del dolor.",
      "dead": "Que nuestros difuntos, sembrados en la debilidad como el grano de trigo del que habla Pablo, resuciten revestidos de un cuerpo espiritual glorioso, incorruptible e inmortal.",
      "gospel": "Que amemos a nuestros enemigos, hagamos bien a quienes nos odian y prestemos sin esperar nada a cambio, como pide Jesús, confiando en la medida generosa que Dios nos devolverá.",
      "closing": "Señor, que hiciste que José perdonara a sus hermanos que lo vendieron, y que nos pides amar incluso a nuestros enemigos, enséñanos a confiar en ti como el salmo pide, sin envidia ni rencor. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "epi7": {
    "A": {
      "church": "Que la Iglesia confíe en la promesa de Isaías: '¿puede una madre olvidar a su hijo? Aunque ella lo olvidara, yo no te olvidaré'; y que anuncie sin descanso esta fidelidad inquebrantable de Dios.",
      "world": "Que las naciones no sirvan al dinero como a un dios, según advierte Jesús, sino que busquen primero el Reino de Dios y su justicia, confiando en que lo demás se les dará por añadidura.",
      "parish": "Que esta comunidad mire a las aves del cielo y a los lirios del campo, como enseña Jesús, para aprender a confiar en la providencia de Dios sin angustiarse por el mañana.",
      "suffering": "Que los que se sienten olvidados escuchen la promesa de Isaías de que Dios los lleva grabados en las palmas de sus manos, y que jamás los olvidará como una madre no olvida a su hijo.",
      "dead": "Que nuestros difuntos, grabados en las palmas de las manos de Dios según la promesa de Isaías, descansen en la certeza de un amor que ninguna madre humana podría igualar.",
      "gospel": "Que no nos angustiemos por el mañana, como pide Jesús, confiando en que el Padre que viste a los lirios del campo cuidará también de nosotros, hijos de mayor valor que las aves del cielo.",
      "closing": "Señor, que nos llevas grabados en las palmas de tus manos y que nunca podrías olvidarnos como una madre no olvida a su hijo, líbranos de la angustia por el mañana; concede que en ti hallemos nuestra paz. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia sea desposada por Dios para siempre, como anuncia Oseas, en justicia, derecho, amor y compasión; y que responda a este desposorio con fidelidad renovada cada día.",
      "world": "Que las naciones reconozcan, como el pueblo infiel al que Oseas llama al desierto para hablarle al corazón, que Dios busca siempre reconciliarse antes que castigar.",
      "parish": "Que esta parroquia, como Jesús que llamó a Leví el publicano a su mesa, no excluya a los pecadores ni a los marginados, recordando que 'no vine a llamar a justos, sino a pecadores'.",
      "suffering": "Que los que sufren enfermedad o pecado experimenten la compasión y misericordia de Dios, como canta el salmo 103: 'el Señor es compasivo y misericordioso, lento a la cólera y rico en clemencia'.",
      "dead": "Que nuestros difuntos, desposados por Dios en la fidelidad prometida por Oseas, participen ya del banquete nupcial eterno al que Cristo invitó también a publicanos y pecadores.",
      "gospel": "Que, como Leví que dejó su mesa de cobrador de impuestos para seguir a Jesús, respondamos también nosotros sin excusas a la llamada de Cristo, aunque el mundo nos juzgue indignos.",
      "closing": "Señor, que prometiste desposarte con tu pueblo en justicia y compasión, y que llamaste a Leví a tu mesa sin mirar su pasado, acércate también a nosotros pecadores; concede que respondamos como él, dejándolo todo. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia confíe en que su predicación, como la lluvia y la nieve de las que habla Isaías, no volverá vacía sino que hará germinar y fructificar la semilla del Evangelio en todo corazón.",
      "world": "Que las naciones edifiquen su convivencia sobre roca y no sobre arena, como enseña Jesús, escuchando su palabra y poniéndola en práctica antes de que lleguen las tormentas.",
      "parish": "Que esta comunidad sea reconocida por sus frutos, como enseña Jesús: 'no hay árbol bueno que dé fruto malo, ni árbol malo que dé fruto bueno'; y que nuestras obras reflejen lo que llevamos dentro.",
      "suffering": "Que los que sufren encuentren consuelo en la promesa de Isaías: la palabra de Dios no vuelve vacía sino que cumple aquello para lo que fue enviada, también en medio del dolor.",
      "dead": "Que nuestros difuntos, sembrados como semilla en tierra buena, hayan dado ya el fruto pleno de la resurrección prometida por Pablo: 'la muerte ha sido devorada por la victoria'.",
      "gospel": "Que edifiquemos nuestra vida sobre la roca de la palabra de Jesús escuchada y practicada, para que resista firme cuando lleguen las inundaciones y los vientos de la adversidad.",
      "closing": "Señor, que tu palabra desciende como la lluvia y no vuelve a ti vacía sin haber fecundado la tierra, haz que edifiquemos nuestra vida sobre la roca de tu enseñanza; concede que demos fruto bueno como buen árbol. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "epi8": {
    "A": {
      "church": "Que la Iglesia, como Pedro, Santiago y Juan en el monte de la Transfiguración, escuche siempre la voz que dice 'este es mi Hijo amado, escuchadle'; y que no se detenga en construir tiendas sino que baje al valle a servir.",
      "world": "Que las naciones reconozcan en Cristo transfigurado la gloria del verdadero Rey, más alto que todo poder humano, como canta el salmo: 'el Señor es rey, el más alto sobre toda la tierra'.",
      "parish": "Que esta parroquia, iluminada como Moisés al subir al Sinaí para recibir la ley, refleje en su vida diaria algo del resplandor de Dios contemplado en la oración y el culto.",
      "suffering": "Que los que atraviesan un valle oscuro reciban, como los apóstoles en el monte Tabor, un momento de luz y consuelo que los sostenga hasta que puedan volver a bajar con fuerzas renovadas.",
      "dead": "Que nuestros difuntos contemplen ya sin velos la gloria que Pedro, Santiago y Juan vislumbraron por un instante en el monte de la Transfiguración, y que un día compartamos esa misma visión.",
      "gospel": "Que, como los apóstoles en el Tabor, no queramos quedarnos siempre en la montaña de las experiencias gozosas, sino que bajemos dispuestos a servir y a cargar la cruz con Cristo.",
      "closing": "Señor, que te transfiguraste ante Pedro, Santiago y Juan en el monte y la voz del Padre proclamó 'este es mi Hijo amado, escuchadle', transfigura también nuestra vida ordinaria; concede que bajemos del monte dispuestos a servir. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como Eliseo que no quiso dejar a Elías, persevere unida a Cristo hasta recibir una doble porción de su Espíritu para continuar la misión profética en el mundo.",
      "world": "Que las naciones vean, más allá del velo que Pablo describe cubriendo tantos corazones, el resplandor del Evangelio de la gloria de Cristo, y que ese velo sea retirado por la fe.",
      "parish": "Que esta comunidad, como Pedro en el monte que quería levantar tres tiendas, aprenda que los momentos de gloria no son para quedarse sino para fortalecernos antes de bajar a servir.",
      "suffering": "Que los que se sienten abandonados como Eliseo ante la partida de su maestro Elías encuentren consuelo en saber que el Espíritu de Dios no los deja huérfanos, sino que permanece con ellos.",
      "dead": "Que nuestros difuntos, como Elías arrebatado en un carro de fuego hacia el cielo, hayan sido llevados ya a la presencia definitiva de Dios más allá de la muerte.",
      "gospel": "Que escuchemos la voz que desde la nube dijo a los apóstoles 'este es mi Hijo amado, escuchadle', y que no confundamos los momentos de consuelo espiritual con el destino final de nuestra vida cristiana.",
      "closing": "Señor, que arrebataste a Elías en un carro de fuego y transfiguraste a tu Hijo ante Pedro, Santiago y Juan, retira el velo que cubre nuestro entendimiento; concede que veamos tu gloria reflejada en el rostro de Cristo. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Moisés que bajaba del Sinaí con el rostro resplandeciente sin saberlo, refleje la gloria de Dios ante el mundo sin buscar el reconocimiento para sí misma.",
      "world": "Que las naciones tiemblen ante la santidad de Dios que reina sobre los pueblos, como proclama el salmo 99, y que reconozcan que ningún poder humano se equipara al suyo.",
      "parish": "Que esta parroquia, como Moisés que se cubría el rostro con un velo ante el pueblo, sepa cuándo mostrar sin reservas la luz que ha recibido de Dios y cuándo servir con humilde discreción.",
      "suffering": "Que los que sufren encuentren, como los apóstoles adormilados que se despertaron para ver la gloria de Cristo en el Tabor, un despertar a la esperanza en medio de su propio cansancio.",
      "dead": "Que nuestros difuntos, transformados de gloria en gloria como enseña Pablo a los Corintios, contemplen ya a rostro descubierto la gloria del Señor sin necesidad de velo alguno.",
      "gospel": "Que, como Pedro, Santiago y Juan que vieron la gloria de Cristo hablando con Moisés y Elías sobre su próximo éxodo en Jerusalén, comprendamos que la gloria pasa necesariamente por la cruz.",
      "closing": "Señor, que el rostro de Moisés resplandeció al bajar del Sinaí y que te transfiguraste hablando de tu éxodo en Jerusalén, transfórmanos de gloria en gloria según tu propia imagen; concede que no temamos el camino que lleva de la montaña a la cruz. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  // Septuagésima, Sexagésima y Quincuagésima: SIN entrada propia. Las que había
  // (tres ciclos cada una) mezclaban peticiones de otros domingos — Eva y el arco
  // iris, Abram y Nicodemo, Joel y el templo purificado — que no corresponden a las
  // lecturas que sirve lectionary.js (Mt 20,1-16; Lc 8,4-15; Lc 18,31-43), de modo
  // que se rezaba por temas ajenos al Evangelio del día. Sin entrada, estos días
  // caen al mecanismo de respaldo por tema (detectThemeKey sobre el Evangelio).
  "ashWednesday": {
    "A": {
      "church": "Que la Iglesia, ministra de la reconciliación, repita hoy con Joel el llamado urgente: convertíos de todo corazón, con ayuno, llanto y lamento.",
      "world": "Que los pueblos, invitados por San Pablo a no recibir en vano la gracia de Dios, reconozcan en este día de ceniza una ocasión favorable de conversión.",
      "parish": "Que esta comunidad, marcada hoy con la ceniza, recuerde que es polvo y al polvo ha de volver, y viva ya reconciliada con Dios y con los hermanos.",
      "suffering": "Que los enfermos y los que sienten cercana la fragilidad del polvo encuentren en la ceniza no una condena sino la promesa de un corazón nuevo y contrito.",
      "dead": "Que los difuntos, que ya volvieron al polvo del que fueron formados, hayan sido revestidos por Cristo con la vida que no conoce ocaso.",
      "gospel": "Que ayunemos, oremos y demos limosna en secreto, sin poner cara triste como los hipócritas, confiando la recompensa al Padre que ve en lo escondido.",
      "closing": "Ten misericordia, Señor, porque hemos pecado: acepta el signo de esta ceniza como comienzo humilde de nuestra vuelta a ti. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia inicie hoy la cuaresma anunciando con Joel: rasgad el corazón y no las vestiduras, y volved al Señor vuestro Dios.",
      "world": "Que las naciones escuchen la súplica de San Pablo: reconciliaos con Dios, porque ahora es el tiempo favorable, ahora es el día de la salvación.",
      "parish": "Que esta parroquia entre en la cuaresma no con el rostro desfigurado como los hipócritas, sino ungida de alegría interior según el mandato de Cristo.",
      "suffering": "Que los que sufren y sienten sobre sí el peso del polvo humano hallen en el Miserere de David un camino de esperanza y no de desesperación.",
      "dead": "Que los difuntos, formados del polvo de la tierra, hayan alcanzado ya el corazón limpio y el espíritu firme que pedía el salmista penitente.",
      "gospel": "Que guardemos nuestra limosna, oración y ayuno lejos de toda ostentación, atesorando en el cielo lo que aquí hacemos en secreto.",
      "closing": "Crea en nosotros, oh Dios, un corazón limpio en este comienzo de cuaresma, y no rechaces a quien viene hoy a recibir tu ceniza. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia toque hoy la trompeta en Sión, según el mandato de Joel, y convoque a todo su pueblo, desde el más pequeño hasta el más anciano, a la conversión.",
      "world": "Que los que gobiernan reconozcan, con las palabras de San Pablo, que no ponemos tropiezo a nadie para que no sea vituperado nuestro ministerio.",
      "parish": "Que esta comunidad reciba hoy la ceniza en la frente no como espectáculo sino como signo humilde de un ayuno vivido ante Dios y no ante los hombres.",
      "suffering": "Que los necesitados encuentren en esta cuaresma que empieza una comunidad dispuesta a la limosna verdadera, la que se da sin sonar la trompeta.",
      "dead": "Que los difuntos, recordados hoy en el polvo que también nosotros somos, descansen en la misericordia de Dios lento a la ira y grande en amor.",
      "gospel": "Que oremos a puerta cerrada, en lo secreto, confiando en que el Padre que ve en lo escondido nos recompensará abiertamente.",
      "closing": "Ten misericordia, Señor, porque hemos pecado: que la ceniza de hoy nos disponga a un ayuno sincero y a una Pascua de vida nueva. Por Jesucristo nuestro Señor."
    }
  },
  "lent1": {
    "A": {
      "church": "Que la Iglesia enseñe a discernir la voz de la serpiente que promete ser como dioses, y guíe a sus hijos de vuelta al árbol de la vida que es la Cruz.",
      "world": "Que las naciones no busquen convertir en pan las piedras de la injusticia, recordando con Cristo que no solo de pan vive el hombre.",
      "parish": "Que esta comunidad resista, como Cristo en el desierto, la tentación de tirarse del templo esperando un prodigio en vez de confiar humildemente en Dios.",
      "suffering": "Que los que son probados como Eva ante el fruto apetecible encuentren en Cristo, vencedor del tentador, la fuerza para resistir.",
      "dead": "Que los difuntos, alcanzados por el pecado que entró por un solo hombre, hayan recibido en abundancia la gracia que Cristo trajo para todos.",
      "gospel": "Que rechacemos con Cristo la oferta de todos los reinos del mundo a cambio de postrarnos ante otro que no sea el único Señor.",
      "closing": "Señor, acompáñame en la tribulación como acompañaste a Adán expulsado del jardín; guíanos por el desierto de la cuaresma hasta el árbol de la vida. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, salvada por las aguas que prefiguró el arca de Noé, predique el bautismo que salva no por quitar la suciedad del cuerpo sino por la buena conciencia ante Dios.",
      "world": "Que los pueblos vivan bajo la señal del arco iris, promesa de que Dios no volverá a destruir la tierra por el diluvio de la violencia humana.",
      "parish": "Que esta comunidad entre al desierto de la cuaresma como Cristo, servida por ángeles en medio de las fieras, para salir anunciando que el reino de Dios está cerca.",
      "suffering": "Que los que atraviesan tentaciones y pruebas confíen en el arco tendido en las nubes, señal de que Dios recuerda su alianza eterna con toda carne.",
      "dead": "Que los difuntos, pasados ya por las aguas que en figura los salvó como a Noé en el arca, gocen de la resurrección de Jesucristo.",
      "gospel": "Que convirtamos nuestra vida y creamos en la Buena Nueva, como Cristo predicó nada más salir del desierto de la tentación.",
      "closing": "Tus caminos, Señor, son amor y verdad: guárdanos bajo el signo del arco iris y llévanos a través del desierto hasta la alegría de tu reino. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia ofrezca las primicias de su fe como el israelita ante el altar, proclamando que Dios la sacó de la esclavitud con mano fuerte y brazo extendido.",
      "world": "Que los pueblos aprendan del Deuteronomio a no olvidar que fueron extranjeros, y traten con justicia al forastero que hoy vive entre ellos.",
      "parish": "Que esta comunidad confiese con los labios y crea en el corazón que Jesús es el Señor, segura de que quien invoca su nombre será salvo.",
      "suffering": "Que los tentados en su fragilidad, como Cristo lo fue en el desierto por hambre, poder y soberbia, hallen fuerza en la misma Palabra que él opuso al tentador.",
      "dead": "Que los difuntos moren ya bajo el amparo del Altísimo, protegidos por sus ángeles como promete el salmo que Satanás citó y Cristo no aceptó tergiversar.",
      "gospel": "Que no tentemos al Señor nuestro Dios, sino que le adoremos solo a él, como respondió Cristo al tentador en el desierto.",
      "closing": "Señor, acompáñame en la tribulación: que tu palabra esté cerca de mí, en mi boca y en mi corazón, para resistir toda tentación como resistió tu Hijo. Por Jesucristo nuestro Señor."
    }
  },
  "lent2": {
    "A": {
      "church": "Que la Iglesia, llamada a salir de su tierra como Abram, sea bendición para todas las familias de la tierra sin apoyarse en más certeza que la promesa de Dios.",
      "world": "Que las naciones alcen los ojos a los montes de donde viene el auxilio, sabiendo que su guardián no dormita ni duerme.",
      "parish": "Que esta comunidad, como Nicodemo, no tema acercarse de noche a Cristo, y acepte nacer de nuevo del agua y del Espíritu para ver el reino de Dios.",
      "suffering": "Que los que sufren recuerden que tanto amó Dios al mundo que dio a su Hijo único, para que todo el que crea en él no perezca.",
      "dead": "Que los difuntos, justificados por la fe como Abraham antes de la circuncisión, hayan pasado ya de la condenación a la vida eterna prometida en Juan.",
      "gospel": "Que no vengamos a la luz por vergüenza de nuestras obras, sino que obremos la verdad para que se vea que actuamos según Dios.",
      "closing": "Nuestro auxilio viene del Señor, que hizo el cielo y la tierra: haznos nacer de nuevo del agua y del Espíritu como pediste a Nicodemo. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, heredera de la alianza sellada con Abraham al recibir un nombre nuevo, anuncie sin miedo que el Hijo del hombre debía padecer y resucitar al tercer día.",
      "world": "Que los pueblos, como Abraham y Sara en su vejez, no duden de que Dios puede dar vida a lo que parece estéril y sin futuro.",
      "parish": "Que esta comunidad tome su cruz y siga a Cristo, sin avergonzarse de sus palabras ante una generación adúltera y pecadora.",
      "suffering": "Que los que llevan una cruz de dolor escuchen la promesa hecha a Abraham, padre de una multitud de naciones aun en la debilidad de la carne.",
      "dead": "Que los difuntos, que perdieron su vida por Cristo y el Evangelio, la hayan encontrado ya salvada según la palabra de Marcos.",
      "gospel": "Que no pensemos según los hombres, como reprochó Cristo a Pedro, sino que aceptemos el camino de la cruz como camino de gloria.",
      "closing": "Tus caminos, Señor, son amor y verdad: danos, como a Abraham, la fe para creer contra toda esperanza y la fuerza para tomar nuestra cruz. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia sea, como Abram entre los animales partidos, testigo del fuego que sella para siempre la alianza de Dios con su pueblo.",
      "world": "Que las naciones busquen la ciudadanía celestial de la que habla Filipenses, y no pongan su gloria en cosas terrenas que llevan a la ruina.",
      "parish": "Que esta comunidad no rechace, como Jerusalén, al que quiere reunirla bajo sus alas como la gallina a sus polluelos.",
      "suffering": "Que el Señor, luz y salvación en el peligro, sea fortaleza de los que sufren, como lo fue de Abram bajo el cielo estrellado.",
      "dead": "Que los difuntos, cuyo cuerpo humilde Cristo transformará según el poder que todo lo somete, descansen ya en la alianza sellada por el fuego de la promesa.",
      "gospel": "Que sigamos nuestro camino con la firmeza de Cristo, decidido a llegar a Jerusalén a pesar de toda amenaza de Herodes.",
      "closing": "El Señor es mi luz y mi salvación, ¿a quién temeré? Reúnenos bajo tus alas como quisiste reunir a Jerusalén, y no permitas que te rechacemos. Por Jesucristo nuestro Señor."
    }
  },
  "lent3": {
    "A": {
      "church": "Que la Iglesia, como Moisés golpeando la roca en Horeb, sea instrumento para que el agua viva brote en medio del pueblo sediento y quejumbroso.",
      "world": "Que los pueblos no tienten al Señor como en Masá y Meribá, preguntando si Dios está entre ellos o no, sino que reconozcan sus beneficios.",
      "parish": "Que la Iglesia, como el Señor junto al pozo de Jacob, ofrezca sin distinción de personas el agua viva a todo el que tiene sed de Dios.",
      "suffering": "Que los que sufren sed de sentido, como la samaritana que había tenido cinco maridos, encuentren en Cristo a quien conoce toda su historia y aun así les ofrece agua que salta hasta la vida eterna.",
      "dead": "Que los difuntos, reconciliados con Dios por Cristo mientras éramos aún pecadores, hayan bebido ya del agua que se convierte en manantial que salta hasta la vida eterna.",
      "gospel": "Que dejemos, como la samaritana, nuestro cántaro junto al pozo para ir a anunciar a otros que hemos encontrado al que nos dijo todo lo que hemos hecho.",
      "closing": "Si escucháis hoy su voz, no endurezcáis vuestros corazones: dame, Señor, de esa agua que quita para siempre la sed, como diste a la samaritana junto al pozo de Jacob. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, guardiana de los diez mandamientos dados en el Sinaí, predique a Cristo crucificado, escándalo para unos y sabiduría de Dios para los que se salvan.",
      "world": "Que los pueblos no busquen señales ni sabiduría humana, sino que reconozcan la fuerza de Dios en lo que el mundo juzga necio y débil.",
      "parish": "Que esta parroquia, como el templo purificado por Cristo con el látigo de cuerdas, sea casa de oración libre de todo comercio indigno.",
      "suffering": "Que los que sufren encuentren en los mandamientos del Sinaí, más deseables que el oro, no un yugo sino luz para los ojos y alegría para el corazón.",
      "dead": "Que los difuntos, purificados como el templo de Jerusalén, hayan sido reedificados por Cristo, el templo que la muerte no pudo destruir por más de tres días.",
      "gospel": "Que ardamos con el mismo celo de Cristo por la casa del Padre, sin convertir en mercado lo que debe ser lugar de encuentro con Dios.",
      "closing": "Señor, tú tienes palabras de vida eterna: destruye en nosotros todo templo de mercancía y edifica en tres días el templo de un corazón limpio. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Moisés ante la zarza que ardía sin consumirse, se descalce con reverencia frente al Dios que se revela como Yo Soy el que Soy.",
      "world": "Que los gobernantes escuchen, como el Faraón debió escuchar, el clamor del pueblo oprimido que sube hasta Dios.",
      "parish": "Que esta comunidad no piense que quienes sufren una desgracia son más pecadores que los demás, sino que se convierta de corazón como pide Cristo en la parábola de la higuera.",
      "suffering": "Que los que padecen, como los galileos degollados por Pilato o los aplastados por la torre de Siloé, no sean juzgados por su dolor sino acompañados con la misericordia del viñador que aún espera fruto.",
      "dead": "Que los difuntos, alcanzados como el pueblo en el desierto que bebió de la misma roca espiritual que era Cristo, hayan llegado a la tierra que no conoce sed.",
      "gospel": "Que aprovechemos, como la higuera estéril, el tiempo de gracia que el viñador pide para cavar alrededor y abonar antes de que sea tarde.",
      "closing": "Mi alma tiene sed de ti, Señor Dios mío: como a Moisés ante la zarza, muéstranos tu nombre y no permitas que sigamos estériles como la higuera sin fruto. Por Jesucristo nuestro Señor."
    }
  },
  "lent4": {
    "A": {
      "church": "Que la Iglesia, como Samuel ante los hijos de Jesé, aprenda a mirar el corazón y no las apariencias al reconocer a quien Dios ha ungido.",
      "world": "Que las naciones caminen como hijos de la luz, dejando atrás las obras estériles de las tinieblas de las que habla Efesios.",
      "parish": "Que esta comunidad, como el ciego de nacimiento que se lavó en la piscina de Siloé, pueda decir con sencillez: era ciego y ahora veo.",
      "suffering": "Que los enfermos de los ojos del cuerpo o del alma reciban de Cristo el barro que devuelve la vista, y no sean expulsados como el ciego lo fue de la sinagoga.",
      "dead": "Que los difuntos, ungidos como David el más pequeño de los hijos de Jesé, hayan sido llamados por Dios que no mira las apariencias sino el corazón.",
      "gospel": "Que no repitamos la ceguera de los fariseos que, viendo, no quisieron creer, sino que confesemos con el ciego sanado que Jesús es el Señor.",
      "closing": "El Señor es mi pastor, nada me falta: unge nuestros ojos como al ciego de nacimiento y condúcenos, como a David, del rebaño al trono de tu gracia. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia levante a Cristo como Moisés levantó la serpiente de bronce en el desierto, para que todo el que mire a él con fe tenga vida eterna.",
      "world": "Que los pueblos, mordidos por sus propias serpientes de queja e ingratitud, se vuelvan hacia quien puede sanarlos, como el pueblo de Israel en el desierto.",
      "parish": "Que esta parroquia recuerde que fuimos salvados por gracia mediante la fe, y no por obras, para que nadie se gloríe según Efesios.",
      "suffering": "Que los que sufren mordidos por el veneno del dolor o el pecado alcen la vista hacia Cristo levantado en la cruz y encuentren la sanación prometida.",
      "dead": "Que los difuntos, a quienes Dios dio vida junto con Cristo estando aún muertos por sus delitos, gocen ya de las riquezas de la gracia según Efesios.",
      "gospel": "Que no amemos las tinieblas más que la luz, sino que vengamos a la luz para que se vea que nuestras obras están hechas según Dios.",
      "closing": "Dad gracias al Señor, su misericordia es eterna: levántanos como levantaste la serpiente en el desierto, para que quien te mire con fe tenga vida eterna. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia sea embajadora de la reconciliación, anunciando con San Pablo que quien está en Cristo es una nueva creación: pasó lo viejo, todo es nuevo.",
      "world": "Que los pueblos, como el pueblo de Josué al cesar el maná, aprendan a comer del fruto de la tierra que Dios les concede sin dejar de reconocer su providencia.",
      "parish": "Que esta comunidad salga al camino a recibir a los que vuelven, como el padre que corrió al encuentro del hijo pródigo antes de que él terminara su discurso.",
      "suffering": "Que los que se sienten lejos de Dios, como el hijo menor entre las porquerizas, encuentren en esta comunidad el abrazo del padre y no el reproche del hermano mayor.",
      "dead": "Que los difuntos, que estaban muertos y han vuelto a la vida, se hayan perdido y sido hallados como el hijo pródigo en el banquete eterno del Padre.",
      "gospel": "Que no seamos como el hermano mayor, incapaz de alegrarse, sino que celebremos con el padre cuando un pecador vuelve a casa.",
      "closing": "Gustad y ved qué bueno es el Señor, que sale al camino a nuestro encuentro; visteno con el mejor traje, como al hijo pródigo, y haznos entrar en tu fiesta. Por Jesucristo nuestro Señor."
    }
  },
  "lent5": {
    "A": {
      "church": "Que la Iglesia sea, como el profeta Ezequiel ante los huesos secos, instrumento del Espíritu que hace revivir lo que parecía irremediablemente muerto.",
      "world": "Que los pueblos, dispersos como los huesos del valle de Ezequiel, escuchen la promesa de Dios de abrir sus sepulcros y devolverlos a su tierra.",
      "parish": "Que esta comunidad, ante la tumba de Lázaro, no dude en quitar la piedra cuando Cristo lo pide, aunque tema el mal olor de lo que parece definitivamente perdido.",
      "suffering": "Que los que claman desde lo profundo, como el salmista, encuentren en Cristo, que lloró ante la tumba de su amigo, a quien comparte su dolor antes de vencer la muerte.",
      "dead": "Que los difuntos escuchen la voz de Cristo que llamó a Lázaro, sal fuera, y salgan de sus sepulcros para la resurrección de la vida.",
      "gospel": "Que creamos con Marta que Cristo es la resurrección y la vida, aun antes de ver el signo del sepulcro abierto.",
      "closing": "En el Señor hay misericordia y plena redención: llama también a nuestros huesos secos como llamaste a Lázaro, para que salgamos de todo sepulcro a la vida. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia anuncie la nueva alianza que Dios promete por Jeremías, escrita ya no en tablas de piedra sino en lo íntimo del corazón.",
      "world": "Que los pueblos conozcan al Señor no por imposición sino porque su ley está grabada en el corazón de todos, del más pequeño al más grande.",
      "parish": "Que esta comunidad sea grano de trigo que cae en tierra y muere, para dar fruto abundante como enseña Cristo antes de su pasión.",
      "suffering": "Que los que sufren encuentren, como el salmista del Miserere, que Dios no rechaza el corazón contrito ni el espíritu quebrantado.",
      "dead": "Que los difuntos, sellados con la nueva alianza escrita en el corazón, hayan alcanzado el perdón de la culpa que Jeremías anuncia sin más memoria del pecado.",
      "gospel": "Que no amemos nuestra vida hasta perderla, sino que, como el grano de trigo, aceptemos morir para dar mucho fruto con Cristo.",
      "closing": "Crea en mí, oh Dios, un corazón limpio: escribe en él tu nueva alianza como prometiste por Jeremías, y haznos grano que muere para dar fruto. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia reconozca la obra nueva que Dios realiza, un camino en el desierto y ríos en la estepa, como anuncia Isaías a un pueblo que vuelve del destierro.",
      "world": "Que los pueblos, sembrando entre lágrimas como canta el salmo, puedan un día segar con gritos de alegría.",
      "parish": "Que esta comunidad derrame, como María de Betania, todo su perfume a los pies de Cristo, sin calcular el costo del amor gastado en él.",
      "suffering": "Que los que sufren consideren, con San Pablo, que las pérdidas de esta vida son basura comparadas con la excelencia de conocer a Cristo Jesús.",
      "dead": "Que los difuntos hayan llegado ya al camino nuevo que Dios abre en el desierto y a los ríos que hace brotar en la tierra estéril, según la promesa de Isaías.",
      "gospel": "Que no reprochemos, como Judas, el perfume derramado en el amor a Cristo, sino que aprendamos de María de Betania a darlo todo sin reserva.",
      "closing": "El Señor ha estado grande con nosotros y estamos llenos de alegría: abre en nuestro desierto un camino nuevo, como prometiste por Isaías, y acepta el perfume de nuestra entrega. Por Jesucristo nuestro Señor."
    }
  },
  "palmSunday": {
    "A": {
      "church": "Que la Iglesia, como el Siervo de Isaías, no esconda su rostro ante el insulto ni la contradicción; que los pastores sostengan con fe firme el mismo camino de entrega que hoy proclamamos en la Pasión según San Mateo.",
      "world": "Por los gobernantes y jueces del mundo, para que no repitan el juicio injusto de Pilato ni se laven las manos ante la sangre inocente; que busquen la verdad y protejan al indefenso.",
      "parish": "Que esta comunidad entone hoy su hosanna sin olvidar la sombra de la cruz que se levanta al final del camino; que acompañemos a Cristo tanto en el triunfo como en el abandono.",
      "suffering": "Por cuantos, como el Señor en Getsemaní, sienten el alma triste hasta la muerte; que no estén solos en su agonía y encuentren quien vele junto a ellos.",
      "dead": "Por los que murieron traicionados, negados u olvidados por los suyos; que el Crucificado que perdonó desde la cruz los reciba en su reino.",
      "gospel": "Que quienes hoy agitamos ramos en señal de fiesta no huyamos mañana como los discípulos en Getsemaní; que la entrega de Cristo hasta la muerte de cruz nos enseñe una fidelidad que no depende del aplauso.",
      "closing": "Señor Jesús, que entraste en Jerusalén aclamado por el pueblo y pocos días después fuiste entregado a la muerte, danos la firmeza de acompañarte también en la hora de la cruz. Tú que vives y reinas por los siglos de los siglos."
    },
    "B": {
      "church": "Que la Iglesia entera, al escuchar hoy la Pasión según San Marcos, reconozca en la huida de los discípulos su propia debilidad y renueve su confianza solo en la gracia de Cristo.",
      "world": "Por las naciones y sus gobernantes, para que ninguno actúe como la multitud que gritó '¡Crucifícale!' movida por la presión de la masa; que prevalezca siempre la justicia sobre el clamor fácil.",
      "parish": "Por esta congregación, que hoy recibe a Cristo con ramos de olivo; que sepamos permanecer junto a la cruz como la mujer que ungió su cabeza en Betania, sin calcular el costo del amor.",
      "suffering": "Por los que sufren la soledad de Getsemaní, cuando ni los más cercanos permanecen despiertos junto a ellos; que descubran en el Cristo abandonado a un compañero fiel en su dolor.",
      "dead": "Por los fieles difuntos, especialmente los que murieron sin el consuelo de nadie a su lado, como José de Arimatea que recogió el cuerpo del Señor; que reciban una sepultura digna en la misericordia de Dios.",
      "gospel": "Que la centurión que reconoció 'verdaderamente este hombre era Hijo de Dios' al pie de la cruz nos anime a confesar a Cristo no solo en el triunfo de los ramos, sino ante el escándalo de la cruz.",
      "closing": "Dios de la Pasión y la gloria, que en un mismo domingo nos muestras la aclamación del pueblo y el silencio del sepulcro, enséñanos a permanecer fieles cuando el camino se vuelve difícil. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como los discípulos que trajeron el pollino a Jesús, ponga con sencillez lo que tiene al servicio del Señor; que sus pastores preparen el camino con mantos y ramas de humildad, no de vanagloria.",
      "world": "Por las naciones del mundo, para que reconozcan que la verdadera paz no viene de los poderosos que entran a caballo, sino del Rey manso que llega sobre un pollino, según proclamamos hoy en el Evangelio de Lucas.",
      "parish": "Por esta comunidad, que hoy extiende sus mantos en el camino y aclama '¡Bendito el que viene en nombre del Señor!'; que esa misma alabanza no se apague cuando la semana avance hacia la Pasión.",
      "suffering": "Por los enfermos y necesitados, a quienes Jesús se acerca hoy con la misma mansedumbre con que entró en Jerusalén; que hallen en él un Rey que consuela antes que juzgar.",
      "dead": "Por los fieles difuntos, que un día aclamaron a Cristo con fe sencilla; que el mismo Señor que aceptó las alabanzas de la multitud los reciba hoy en la Jerusalén celestial.",
      "gospel": "Que las piedras no tengan que clamar en nuestro lugar; que nosotros, como los discípulos en el monte de los Olivos, sepamos alabar a Dios en voz alta por todos los milagros que hemos visto.",
      "closing": "Señor Jesús, Rey manso que entraste en la ciudad santa sobre un pollino en medio de la alabanza del pueblo, concédenos reconocerte y aclamarte también cuando el camino te lleve a la cruz. Por Jesucristo nuestro Señor."
    }
  },
  "maundyThursday": {
    "A": {
      "church": "Que la Iglesia, nacida del mandato 'haced esto en memoria mía', custodie con reverencia el don de la Eucaristía; que obispos, sacerdotes y diáconos vivan el sacerdocio como servicio y no como privilegio.",
      "world": "Por las naciones del mundo, para que aprendan del gesto de Jesús que se ciñó una toalla y lavó los pies de sus discípulos, que el verdadero poder se ejerce sirviendo y no dominando.",
      "parish": "Por esta comunidad parroquial, reunida esta noche como en el cenáculo; que al recibir el Cuerpo y la Sangre de Cristo se convierta cada vez más en un solo cuerpo unido por el mandamiento nuevo del amor.",
      "suffering": "Por los enfermos y los que sufren, que participan del cáliz de dolor de Cristo; que el mismo Señor que se entregó como cordero pascual sea su fortaleza y su alimento.",
      "dead": "Por los fieles difuntos que se alimentaron en vida del Pan de Vida instituido esta noche; que participen ya del banquete eterno que este sacramento anuncia y prefigura.",
      "gospel": "Que el mandamiento nuevo, 'amaos los unos a los otros como yo os he amado', se traduzca en gestos concretos de servicio humilde, como el lavatorio de los pies que Cristo nos dejó por ejemplo.",
      "closing": "Señor Jesús, que la noche antes de tu Pasión nos diste tu Cuerpo y tu Sangre y te arrodillaste para lavar nuestros pies, enséñanos a servir a los demás como tú nos serviste. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, congregada en torno al altar como Israel en torno al cordero pascual, viva de la Eucaristía como fuente y culmen de toda su vida; que nunca falten manos consagradas para partir el Pan.",
      "world": "Por los pueblos y gobernantes del mundo, para que en lugar de buscar el primer lugar en la mesa aprendan, como Cristo ante sus discípulos, a ocupar el lugar del que sirve.",
      "parish": "Por esta parroquia, que esta noche recuerda cómo Jesús tomó el pan, dio gracias, lo partió y dijo 'esto es mi cuerpo'; que cada Eucaristía nos una más estrechamente unos a otros y a Cristo.",
      "suffering": "Por los que sufren en cuerpo o espíritu, que se sientan acompañados por Aquel que se hizo servidor de todos antes de entregar su vida en la cruz.",
      "dead": "Por los fieles difuntos, que comieron el Pan bajado del cielo; que resuciten en el último día para el banquete eterno del que esta cena es anticipo.",
      "gospel": "Que el ejemplo de Jesús lavando los pies de Pedro, a pesar de su resistencia inicial, nos enseñe a dejarnos servir por Dios y a servir sin excusas a quienes nos rodean.",
      "closing": "Dios nuestro, que en la Última Cena nos diste el memorial perpetuo de tu Pasión, concédenos venerar los sagrados misterios de tu Cuerpo y tu Sangre de manera que experimentemos siempre en nosotros el fruto de tu redención. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia transmita fielmente, como San Pablo a los corintios, lo que ella misma recibió del Señor: el Cuerpo entregado y la Sangre derramada; que ningún sacerdote celebre este misterio con rutina, sino con asombro.",
      "world": "Por las naciones del mundo, para que el poder se ejerza como servicio y no como dominio, siguiendo el ejemplo del Maestro que se ciñó la toalla de siervo ante sus propios discípulos.",
      "parish": "Por esta comunidad parroquial, que esta noche se arrodilla ante el mandato del lavatorio de los pies; que aprendamos a servirnos unos a otros sin considerar indigno ningún servicio hecho por amor.",
      "suffering": "Por los enfermos, los que sufren y los necesitados, a quienes Cristo se acerca esta noche como quien se arrodilla para lavar los pies; que reciban de la Iglesia ese mismo servicio humilde y concreto.",
      "dead": "Por los fieles difuntos que anunciaron con su vida la muerte del Señor 'hasta que vuelva'; que participen ya de la vida sin fin que este sacramento promete.",
      "gospel": "Que el mandamiento nuevo del amor, sellado esta noche con el gesto del lavatorio de los pies, sea la señal por la que todos reconozcan que somos discípulos de Cristo.",
      "closing": "Señor Jesús, cordero pascual verdadero, que instituiste la Eucaristía como memorial de tu entrega y nos diste ejemplo de servicio humilde, haz que vivamos siempre de este don y lo compartamos sirviendo a los demás. Por Jesucristo nuestro Señor."
    }
  },
  "goodFriday": {
    "A": {
      "church": "Por la santa Iglesia de Dios, esparcida por toda la tierra, que como el Siervo sufriente de Isaías es a veces despreciada y desechada de los hombres; que el Padre la sostenga en la fe y la una en un mismo Espíritu bajo el sucesor de Pedro.",
      "world": "Por quienes gobiernan las naciones, para que reconozcan, como el centurión al pie de la cruz, que la verdadera autoridad se manifiesta en la entrega y no en la fuerza; y por la paz que el mundo no puede dar.",
      "parish": "Por esta comunidad, reunida hoy en silencio ante la Cruz, para que como Cristo, Sumo Sacerdote que aprendió obediencia por lo que padeció, sepamos ofrecer nuestros propios sufrimientos unidos a los suyos.",
      "suffering": "Por los enfermos y moribundos, por los que llevan heridas que no sanan, que hallen fuerza en Aquel que fue 'herido por nuestras rebeliones y molido por nuestros pecados' y con cuyas llagas fuimos curados.",
      "dead": "Por todos los que ya han muerto en la paz de Cristo, y por quienes nadie ora; que el mismo Señor que dijo 'está cumplido' y entregó su espíritu al Padre los reciba en su descanso eterno.",
      "gospel": "Por los catecúmenos y por todos los que aún no conocen a Cristo, para que la Pasión narrada hoy según San Juan, con el prendimiento en Getsemaní, el juicio ante Pilato y la muerte en el Gólgota, mueva sus corazones a la fe.",
      "closing": "Padre santo, que entregaste a tu único Hijo para que, herido por nuestras rebeliones, nos trajera la paz con sus cicatrices; míranos con misericordia en esta hora solemne y no apartes de nosotros el fruto de su sacrificio. Por Jesucristo nuestro Señor, que vive y reina contigo y el Espíritu Santo por los siglos de los siglos."
    },
    "B": {
      "church": "Por la santa Iglesia Católica, que hoy contempla postrada el silencio del Viernes Santo; que el Sumo Sacerdote que se ofreció una sola vez por todos mantenga unidos a los obispos, sacerdotes y fieles en la fe de la cruz.",
      "world": "Por los que gobiernan y juzgan en la tierra, para que no repitan la sentencia de Pilato que entregó al inocente por complacer a la multitud; que la justicia de los hombres se acerque más a la justicia de Dios.",
      "parish": "Por esta comunidad parroquial, que venera hoy el madero de la cruz; que grabemos en nuestro corazón las palabras 'Dios mío, Dios mío, ¿por qué me has abandonado?' como expresión de todo dolor humano asumido por Cristo.",
      "suffering": "Por los que sufren en cuerpo y alma, por los que se sienten abandonados de Dios y de los hombres; que en el grito del Salmo veintidós reconozcan que Cristo mismo hizo suyo su dolor hasta el final.",
      "dead": "Por los difuntos que partieron encomendando su espíritu al Padre, como hizo Jesús en la cruz; que la obediencia hasta la muerte del Hijo les abra las puertas de la vida eterna.",
      "gospel": "Por la unidad de todos los cristianos, para que ante el escándalo de la cruz proclamado hoy según San Juan no haya divisiones, sino un mismo testimonio del amor que se entrega hasta el extremo.",
      "closing": "Señor Jesucristo, que en la hora novena clamaste al Padre y entregaste tu espíritu por nuestra salvación, concédenos venerar hoy tu cruz con fe viva y esperar con vigilancia el amanecer de la Resurrección. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Por el Papa, los obispos y todo el pueblo santo de Dios, que hoy se postra ante la cruz desnuda; que la Iglesia entera aprenda del Siervo que 'no abrió su boca' ante la injusticia a permanecer fiel en medio de la persecución.",
      "world": "Por quienes no conocen a Cristo y por los que no creen en Dios, para que la entrega del Hijo en la cruz, memoria que hoy hacemos, alcance a todos los corazones aún distantes de la fe.",
      "parish": "Por esta comunidad, que hoy acompaña en oración la agonía y muerte del Señor; que aprendamos de Cristo, Sumo Sacerdote compasivo, a acercarnos con confianza al trono de la gracia en nuestras propias pruebas.",
      "suffering": "Por los afligidos, los presos, los perseguidos y todos los que cargan una cruz pesada; que el Varón de dolores, experimentado en quebrantos, cargue con ellos el peso que no pueden llevar solos.",
      "dead": "Por todos los fieles difuntos y por los que murieron sin nadie que rezara por ellos; que Cristo, que descendió a lo más bajo por nuestra salvación, los levante a la vida que no tiene fin.",
      "gospel": "Por los pueblos que aún no oyeron el Evangelio, para que la Pasión según San Juan, con la crucifixión en el Gólgota y el costado abierto de donde brotó sangre y agua, sea semilla de fe en toda la tierra.",
      "closing": "Dios eterno, que en tu Hijo colgado del madero nos mostraste hasta dónde llega tu amor, guarda silencio en nuestro corazón esta tarde solemne y enséñanos a esperar en la cruz la fuente de toda vida. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "holySaturday": {
    "A": {
      "church": "Por la santa Iglesia, que hoy vela en silencio junto al sepulcro sellado, como la guardia que Pilato ordenó apostar; que en este día sin sacramentos aprenda a esperar sin desesperar, confiando en la promesa del tercer día.",
      "world": "Por las naciones del mundo, que a menudo viven como si la muerte tuviera la última palabra; que descubran, en el silencio de este día, que hay una esperanza más fuerte que el sepulcro cerrado con una piedra.",
      "parish": "Por esta comunidad parroquial, reunida en la quietud de hoy, para que como José de Arimatea, que envolvió el cuerpo de Jesús en una sábana limpia, sepamos ofrecer a Dios lo mejor que tenemos incluso en la hora de la aparente derrota.",
      "suffering": "Por los que agonizan y por los que acompañan a un ser querido en sus últimos días, haciéndose eco de la pregunta de Job, '¿si el hombre muere, volverá a vivir?'; que no pierdan la esperanza mientras esperan en silencio.",
      "dead": "Por todos los fieles difuntos, que como el grano sembrado en la tierra aguardan su día; que descansen en paz hasta que la piedra del sepulcro sea removida definitivamente por la gloria de la Resurrección.",
      "gospel": "Que aprendamos del silencio de este día, cuando el sepulcro estaba cerrado y sellado y una guardia vigilaba; que nuestra fe no dependa de ver, sino de confiar en las manos del Padre, como confió Jesús al morir.",
      "closing": "Padre eterno, en cuyas manos encomendó tu Hijo su espíritu antes de descansar en el sepulcro, concédenos velar hoy con fe silenciosa hasta que amanezca el día de la Resurrección. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Por la santa Iglesia Católica, que hoy no celebra la Eucaristía y permanece como en ayuno y vela ante la tumba de Cristo; que su silencio de hoy se convierta en la voz del anuncio pascual de mañana.",
      "world": "Por las naciones y los pueblos que viven bajo la sombra de la muerte y la violencia; que el descenso de Cristo a la región de los muertos, que hoy conmemoramos, sea anuncio de que ningún abismo humano queda fuera del alcance de Dios.",
      "parish": "Por esta congregación, que aguarda hoy en la oscuridad de la fe, como los discípulos dispersos tras la sepultura del Señor; que perseveremos en la oración aun cuando no veamos signos visibles de esperanza.",
      "suffering": "Por los enfermos graves y los que sienten que sus días son 'como la sombra que pasa', según la meditación de Job; que hallen consuelo sabiendo que Cristo mismo atravesó la muerte antes que ellos.",
      "dead": "Por los fieles difuntos, que aguardan como Cristo en el sepulcro la plenitud de la vida; que Aquel que padeció en la carne por nosotros les conceda participar de la vida según el Espíritu.",
      "gospel": "Que la piedra grande rodada a la entrada del sepulcro y el sello puesto sobre ella no cierren nuestra esperanza; que aprendamos a esperar en silencio, confiados en que Dios tiene la última palabra sobre la muerte.",
      "closing": "Señor, que reposaste en el sepulcro este día para santificar el descanso de los que duermen en ti, concédenos velar con paciencia y fe hasta el amanecer de tu gloria. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Por la santa Iglesia, que como los guardias apostados por los sumos sacerdotes vigila hoy junto al sepulcro sellado, aunque con una vigilancia distinta: la de la esperanza que aguarda la Resurrección; que ningún poder humano pueda finalmente contener a Cristo.",
      "world": "Por los que gobiernan y por quienes, como Pilato, sellan tumbas para acallar la verdad; que las naciones descubran que ningún sello ni ninguna piedra puede detener el designio de Dios.",
      "parish": "Por esta comunidad parroquial, que hoy medita en silencio la fragilidad de nuestros días, tal como lo expresa Job, 'el hombre nacido de mujer, corto de días y hastiado de sinsabores'; que aprendamos a poner nuestra esperanza solo en Dios.",
      "suffering": "Por los moribundos y por cuantos hoy sienten que la vida se agota como agua derramada; que el Señor, que asumió nuestra mortalidad hasta el sepulcro, les sostenga con su presencia silenciosa.",
      "dead": "Por los fieles difuntos, sepultados como Cristo en la tierra, aguardando el día en que la vida vuelva a llamarlos por su nombre; que descansen en la misma paz del sepulcro que hoy veneramos.",
      "gospel": "Que el silencio del sepulcro sellado y custodiado por la guardia nos enseñe a esperar sin ruido, confiando en que Dios actúa incluso cuando todo parece terminado y clausurado.",
      "closing": "Dios de la vida, que permitiste que tu Hijo descansara en el sepulcro antes de resucitar glorioso, enséñanos a esperar en silencio y fe los tiempos que solo tú conoces. Por Jesucristo nuestro Señor."
    }
  },
  "easter": {
    "A": {
      "church": "Que la Iglesia entera proclame con Pedro ante la casa de Cornelio que a Cristo 'le mataron colgándolo de un madero, pero Dios lo resucitó al tercer día'; que este anuncio resuene con la misma audacia en cada rincón del mundo. Aleluya.",
      "world": "Por las naciones del mundo, para que reconozcan en la Resurrección de Cristo la victoria definitiva sobre toda muerte y toda tiniebla; que los pueblos busquen 'las cosas de arriba' antes que las ambiciones que pasan.",
      "parish": "Por esta comunidad parroquial, que hoy proclama con el salmo 'este es el día que hizo el Señor: alegrémonos y regocijémonos en él'; que nuestra alegría pascual se extienda más allá de este día a toda nuestra vida en común.",
      "suffering": "Por los enfermos y los que sufren, que como María Magdalena buscan al Señor entre lágrimas; que escuchen su nombre pronunciado con ternura y reconozcan, como ella, la voz del Resucitado.",
      "dead": "Por los fieles difuntos, que resucitarán con Cristo así como él resucitó de entre los muertos; que quienes buscaron al Señor 'entre los muertos' en su día final le encuentren vivo para siempre. Aleluya.",
      "gospel": "Que el sepulcro vacío y el grito de gozo de María Magdalena, '¡He visto al Señor!', nos impulsen a anunciar sin miedo la Resurrección a quienes todavía viven encerrados en su propio duelo.",
      "closing": "Dios de vida, que en la mañana de este día hiciste resplandecer sobre el mundo la luz de la Resurrección de tu Hijo, concédenos vivir siempre buscando las cosas de arriba, donde Cristo está sentado a tu diestra. Por Jesucristo nuestro Señor. Aleluya."
    },
    "B": {
      "church": "Que la Iglesia transmita, como hizo San Pablo a los corintios, lo que ella misma recibió: que Cristo murió, fue sepultado y resucitó al tercer día según las Escrituras; que ninguna generación deje de anunciar este fundamento de la fe. Aleluya.",
      "world": "Por las naciones del mundo, que necesitan escuchar que la muerte no tiene la última palabra; que el anuncio pascual, 'este es el día que hizo el Señor', llegue a los pueblos sumidos en el desánimo y la violencia.",
      "parish": "Por esta congregación, reunida hoy para regocijarse en el día que hizo el Señor; que la alegría de la piedra removida del sepulcro se traduzca en comunidades donde nada quede sellado por el rencor o la indiferencia.",
      "suffering": "Por los que sufren y padecen, que como María Magdalena corren hacia el sepulcro con el corazón cargado de dolor; que encuentren, como ella, que la piedra ha sido removida y la desesperanza no tiene la última palabra.",
      "dead": "Por los fieles difuntos, que aguardan la plenitud de lo que Cristo, primicia de los que durmieron, ya alcanzó; que en él resuciten todos a la vida sin fin. Aleluya.",
      "gospel": "Que la carrera de Pedro y del otro discípulo hacia el sepulcro vacío, y la fe de quien 'vio y creyó', nos anime a acercarnos también nosotros a los signos de la Resurrección sin quedarnos solo en la duda.",
      "closing": "Padre de la gloria, que resucitaste a tu Hijo de entre los muertos como primicia de los que duermen, haz que toda la Iglesia proclame con una sola voz este día que tú mismo has hecho. Por Jesucristo nuestro Señor. Aleluya."
    },
    "C": {
      "church": "Que la Iglesia proclame sin titubeos que si la esperanza en Cristo fuera solo para esta vida seríamos los más dignos de lástima, pero Cristo ha resucitado como primicia de los que durmieron; que este anuncio sostenga la predicación de obispos, sacerdotes y diáconos. Aleluya.",
      "world": "Por las naciones del mundo, que a menudo viven como si esta vida fuera la única esperanza posible; que el testimonio de la Resurrección abra sus corazones a la vida que no termina.",
      "parish": "Por esta comunidad parroquial, que hoy repite con el salmo 'la piedra que desecharon los arquitectos es ahora la piedra angular'; que reconozcamos a Cristo resucitado como fundamento de toda nuestra vida en común.",
      "suffering": "Por los enfermos y los necesitados, que como María Magdalena y las mujeres se acercan al sepulcro cargando su propio dolor; que hallen la piedra removida y descubran que Cristo vive y camina con ellos.",
      "dead": "Por los fieles difuntos, en quienes se cumple ya la promesa de que en Cristo todos volverán a la vida, cada uno en su orden; que participen de la primicia de la Resurrección que hoy celebramos. Aleluya.",
      "gospel": "Que el sepulcro vacío y los lienzos dejados en su lugar, vistos por Pedro y el discípulo amado, nos enseñen que la fe pascual no se apoya en evidencias parciales sino en el encuentro vivo con el Resucitado.",
      "closing": "Dios de la esperanza, que en Cristo resucitado nos diste la certeza de que la muerte ha sido vencida, concédenos vivir ya desde ahora como quienes esperan la resurrección de la carne y la vida del mundo futuro. Por Jesucristo nuestro Señor. Aleluya."
    }
  },
  "easter2": {
    "A": {
      "church": "Que la Iglesia, nacida el día de Pentecostés cuando Pedro predicó que Dios resucitó a Jesús librándolo de las ligaduras de la muerte, persevere fiel 'en la enseñanza de los apóstoles, en la comunión, en la fracción del pan y en las oraciones'. Aleluya.",
      "world": "Por las naciones del mundo, para que conozcan la 'esperanza viva' de la que habla San Pedro, nacida de la Resurrección de Jesucristo de entre los muertos, y encuentren en ella un motivo de paz duradera.",
      "parish": "Por esta comunidad parroquial, que como Tomás a veces necesita tocar las llagas para creer; que también nosotros, sin haber visto, seamos contados entre los 'dichosos que no han visto y han creído'.",
      "suffering": "Por los enfermos y los que sufren, custodiados 'por el poder de Dios mediante la fe' como escribe San Pedro; que sus pruebas, más preciosas que el oro, se purifiquen en la esperanza de la Resurrección.",
      "dead": "Por los fieles difuntos, que creyeron sin haber visto al Resucitado; que reciban ya 'la herencia incorruptible, incontaminada e inmarchitable' reservada en los cielos para ellos. Aleluya.",
      "gospel": "Que como Tomás, quien exigió ver las llagas del Señor para creer, nosotros también llevemos nuestras dudas ante Cristo con sinceridad, hasta poder confesar con él: 'Señor mío y Dios mío'.",
      "closing": "Señor Jesús, que a los ocho días te apareciste a tus discípulos y a Tomás le mostraste tus manos y tu costado, aumenta nuestra fe para que, sin haberte visto, creamos y tengamos vida en tu nombre. Por Jesucristo nuestro Señor. Aleluya."
    },
    "B": {
      "church": "Que la Iglesia viva hoy como la primera comunidad de Jerusalén, de la que se dice que 'tenían un solo corazón y una sola alma' y ponían todo en común; que esa unidad sea también signo visible de nuestra fe.",
      "world": "Por las naciones del mundo, divididas por el egoísmo y la desigualdad; que aprendan del ejemplo de los primeros cristianos, entre quienes 'no había ningún necesitado', a compartir sus bienes con justicia.",
      "parish": "Por esta comunidad parroquial, para que, como Tomás, ausente cuando el Señor se apareció por primera vez, ninguno de nuestros hermanos se quede fuera del anuncio pascual; que todos oigan y crean el mensaje de vida que San Juan proclama.",
      "suffering": "Por los enfermos y necesitados, recordando que en la comunidad primitiva 'no había entre ellos ningún necesitado', pues todo lo compartían; que también hoy la Iglesia sea signo de esa comunión solidaria.",
      "dead": "Por los fieles difuntos, que caminaron en la luz como Dios está en la luz, según escribe San Juan; que la sangre de Jesucristo, que nos purifica de todo pecado, los limpie para la vida eterna. Aleluía.",
      "gospel": "Que las llagas de Cristo mostradas a Tomás nos recuerden que la fe pascual no elude las heridas, sino que las reconoce transformadas en signos de vida; que también nosotros toquemos esas llagas en los heridos de hoy.",
      "closing": "Dios de comunión, que congregaste a los primeros discípulos en un solo corazón y una sola alma, únenos también a nosotros en la fe pascual que Tomás proclamó: 'Señor mío y Dios mío'. Por Jesucristo nuestro Señor. Aleluya."
    },
    "C": {
      "church": "Que la Iglesia, siguiendo a los apóstoles que ante el Sanedrín respondieron 'hay que obedecer a Dios antes que a los hombres', tenga la valentía de predicar el Evangelio aun bajo presión o amenaza.",
      "world": "Por las naciones y sus gobernantes, para que reconozcan, como proclama el Apocalipsis, a Jesucristo como 'el Alfa y la Omega', el que rige la historia humana más allá de todo poder terreno.",
      "parish": "Por esta comunidad parroquial, que necesita a veces, como Tomás, tocar las llagas de Cristo en los hermanos que sufren para creer de verdad en su presencia entre nosotros.",
      "suffering": "Por los enfermos, los presos y los perseguidos, recordando a los apóstoles azotados por predicar a Cristo y que 'se fueron gozosos' de haber padecido por su nombre; que el sufrimiento por la fe no les quite la alegría pascual.",
      "dead": "Por los fieles difuntos, que un día confiaron en Aquel que se presenta en el Apocalipsis como 'el que vive; estuve muerto, y ahora vivo por los siglos de los siglos'; que él mismo les abra las puertas de la vida.",
      "gospel": "Que Tomás, quien tocó las llagas del Resucitado y exclamó 'Señor mío y Dios mío', nos enseñe que la duda sincera, llevada ante Cristo, puede convertirse en la confesión de fe más profunda.",
      "closing": "Señor Jesucristo, primero y último, el que vive y estuvo muerto y ahora vives por los siglos de los siglos, danos la valentía de los apóstoles para obedecerte antes que a cualquier poder humano. Tú que vives y reinas por los siglos de los siglos. Aleluya."
    }
  },
  "easter3": {
    "A": {
      "church": "Que la Iglesia, como los discípulos de Emaús, reconozca a Cristo resucitado al partir el pan en cada Eucaristía; que los predicadores expliquen las Escrituras de tal modo que los corazones de los fieles ardan al escucharlas.",
      "world": "Que las naciones escuchen el llamado de Pedro a arrepentirse y cambiar de vida; que gobernantes y pueblos abandonen la violencia y busquen la conversión sincera que trae la paz.",
      "parish": "Que esta comunidad, como los tres mil que se bautizaron el día de Pentecostés, persevere en la enseñanza de los apóstoles, en la comunión fraterna y en la fracción del pan.",
      "suffering": "Que los que caminan hoy tristes y desconcertados, como los discípulos por el camino a Emaús, sientan a Cristo caminar a su lado aunque no lo reconozcan; que los enfermos y necesitados hallen consuelo en su compañía.",
      "dead": "Que quienes murieron redimidos, no con oro ni plata sino con la sangre preciosa de Cristo, como recuerda san Pedro, gocen ya de la herencia incorruptible reservada en los cielos.",
      "gospel": "Que reconozcamos al Señor resucitado en la fracción del pan, como lo reconocieron los de Emaús cuando sus ojos se abrieron; que no dejemos partir a Cristo sin invitarlo a quedarse con nosotros.",
      "closing": "Señor Jesús, que te hiciste conocer a los discípulos al partir el pan; quédate con nosotros, porque atardece y el día ya ha declinado. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, enviada como testigo del Resucitado, anuncie con la audacia de Pedro que Jesús vive y que en su nombre hay perdón para todos los pueblos.",
      "world": "Que las naciones reconozcan, como Pedro proclamó ante el pueblo de Jerusalén, que obraron por ignorancia, y se abran al arrepentimiento que trae tiempos de consuelo de parte del Señor.",
      "parish": "Que esta congregación, al ver al Señor resucitado comer pescado asado entre nosotros, crea sin dudar que Cristo vive con cuerpo real y glorioso, no como fantasma sino como Señor de la vida.",
      "suffering": "Que a quienes dudan como los apóstoles llenos de miedo y asombro, Cristo les muestre sus manos y sus pies y les diga 'la paz esté con vosotros'; que los enfermos palpen su cercanía sanadora.",
      "dead": "Que los difuntos, purificados como quienes esperan verlo tal cual es, participen de la promesa de ser semejantes a Cristo cuando él se manifieste en su gloria.",
      "gospel": "Que como Cristo mostró sus manos y sus pies y comió ante los discípulos para probar que no era un espíritu, también nosotros demos testimonio corporal y concreto de su resurrección con obras de caridad.",
      "closing": "Dios de vida, que hiciste palpar a tus discípulos las llagas gloriosas de tu Hijo resucitado; abre también nuestra mente para entender las Escrituras y ser testigos de tu perdón. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Saulo derribado en el camino de Damasco, se deje transformar por la voz de Cristo aun en medio de su ceguera, y que los que persiguen el Evangelio se conviertan en sus más ardientes apóstoles.",
      "world": "Que las naciones que respiran amenazas contra los discípulos de Cristo, como hacía Saulo antes de su conversión, encuentren en el camino una luz que las derribe y las convierta en instrumentos de paz.",
      "parish": "Que esta comunidad parroquial, como Pedro junto al lago de Tiberíades, reconozca al Señor en la barca vacía que de pronto se llena, y eche de nuevo las redes cuando parezca que ya no hay nada que pescar.",
      "suffering": "Que a quienes se sienten indignos por sus caídas, como Pedro que negó tres veces a Jesús, el Señor les pregunte con ternura '¿me amas?' y les confíe de nuevo la tarea de apacentar a sus hermanos.",
      "dead": "Que los difuntos escuchen ya la voz de todas las criaturas, en el cielo y en la tierra, que aclaman al Cordero degollado: a él la alabanza, el honor, la gloria y el poder por los siglos de los siglos.",
      "gospel": "Que respondamos a la triple pregunta de Jesús a Pedro junto al lago, 'Simón, hijo de Juan, ¿me amas más que estos?', apacentando a sus corderos y cuidando de sus ovejas con el mismo amor que él nos pide.",
      "closing": "Señor resucitado, que llamaste a Pablo por su nombre y devolviste a Pedro su misión de pastor; levántanos también a nosotros de nuestras caídas y confíanos tu rebaño. Por Jesucristo nuestro Señor."
    }
  },
  "easter4": {
    "A": {
      "church": "Que la Iglesia viva la comunión de los primeros cristianos: perseverante en la enseñanza de los apóstoles, en la fracción del pan y en las oraciones, con un solo corazón y bienes puestos en común.",
      "world": "Que los pueblos del mundo entren por la puerta que es Cristo y no por atajos de violencia o engaño, escuchando su voz que promete vida en abundancia para todos.",
      "parish": "Que esta parroquia, como aquella primera comunidad de Jerusalén, comparta lo que tiene con alegría y sencillez de corazón, alabando a Dios y siendo bien vista por todo el pueblo.",
      "suffering": "Que quienes sufren como ovejas sin voz encuentren en Cristo, la puerta verdadera, entrada segura a los pastos de vida abundante que él prometió a los suyos.",
      "dead": "Que los fieles difuntos, que siguieron la voz del Pastor en vida, entren ya por la puerta que es Cristo a los pastos eternos donde tienen vida en abundancia.",
      "gospel": "Que reconozcamos la voz de Cristo, la puerta de las ovejas, y no sigamos las voces de ladrones y salteadores que solo buscan robar, matar y destruir, pues él vino para que tengamos vida y la tengamos en abundancia.",
      "closing": "Señor Jesús, puerta de las ovejas, que has venido para que tengamos vida en abundancia; guíanos a los pastos donde se encuentra la salvación. Tú que vives y reinas por los siglos de los siglos."
    },
    "B": {
      "church": "Que la Iglesia proclame, con la valentía de Pedro ante el Sanedrín, que no hay otro nombre bajo el cielo dado a los hombres por el que podamos salvarnos, sino el de Jesucristo.",
      "world": "Que las naciones reconozcan en Cristo la piedra angular que los constructores desecharon, y edifiquen sus leyes y su justicia sobre el fundamento sólido de la verdad y el amor.",
      "parish": "Que esta comunidad ame no de palabra ni de labios, sino con obras y según la verdad, poniendo los bienes a disposición del hermano necesitado como enseña la carta de Juan.",
      "suffering": "Que los enfermos y los que sufren experimenten al Buen Pastor que da la vida por sus ovejas, y no como el asalariado que, viendo venir al lobo, abandona el rebaño y huye.",
      "dead": "Que los difuntos, conocidos por el Buen Pastor como él conoce al Padre, descansen ya en el redil eterno donde Cristo dio su vida por ellos.",
      "gospel": "Que la Iglesia, guiada por pastores que, como Cristo el Buen Pastor, den la vida por sus ovejas y no huyan como el asalariado ante el lobo, congregue también a otras ovejas que no son de este redil.",
      "closing": "Buen Pastor, que diste tu vida por tus ovejas y conoces a cada una por su nombre; reúne en un solo rebaño a cuantos aún no han oído tu voz. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Pedro que devolvió la vida a Tabita llena de buenas obras y limosnas, se distinga por su servicio a los pobres y su fe activa que resucita a los desanimados.",
      "world": "Que las naciones vean un día a la gran multitud de toda nación, raza, pueblo y lengua vestida de blanco ante el trono del Cordero, y busquen ya desde ahora la justicia que anticipa esa visión.",
      "parish": "Que esta congregación oiga la voz del Pastor y le siga, confiada en que nadie podrá arrebatarla de su mano ni de la mano del Padre, uno con el Hijo.",
      "suffering": "Que quienes lloran, como lloraban las viudas junto al cuerpo de Tabita mostrando las túnicas que ella les había hecho, encuentren en Cristo consuelo y la certeza de que él enjugará toda lágrima.",
      "dead": "Que los difuntos se cuenten entre la gran multitud vestida con vestiduras blanqueadas en la sangre del Cordero, sin hambre ni sed, guiados a fuentes de aguas vivas.",
      "gospel": "Que escuchemos la voz del Pastor que dice 'mis ovejas oyen mi voz, yo las conozco y ellas me siguen; yo les doy vida eterna y nadie las arrebatará de mi mano'.",
      "closing": "Padre, tú que eres uno con el Hijo, el Buen Pastor; guarda en tu mano a cuantos escuchan su voz y no permitas que nadie nos arrebate de ti. Por Jesucristo nuestro Señor."
    }
  },
  "easter5": {
    "A": {
      "church": "Que la Iglesia, edificada como piedras vivas sobre Cristo, la piedra angular, sea un sacerdocio santo que ofrezca sacrificios espirituales agradables a Dios.",
      "world": "Que en las muchas moradas de la casa del Padre haya lugar también para las naciones divididas por el odio, y que Cristo, camino, verdad y vida, las conduzca a la reconciliación.",
      "parish": "Que esta comunidad crea firmemente que quien ha visto a Cristo ha visto al Padre, y viva las obras que él hizo e incluso obras mayores, confiando en su promesa.",
      "suffering": "Que los que sufren, como Esteban apedreado, puedan levantar los ojos al cielo y ver la gloria de Dios que sostiene a quienes son fieles hasta la persecución y la muerte.",
      "dead": "Que los difuntos, como Esteban que encomendó su espíritu diciendo 'Señor Jesús, recibe mi espíritu', descansen ya en las muchas moradas que Cristo fue a prepararles.",
      "gospel": "Que no se turbe nuestro corazón, pues Cristo nos ha dicho: 'yo soy el camino, la verdad y la vida; nadie va al Padre sino por mí', y en su casa hay muchas moradas preparadas para nosotros.",
      "closing": "Señor Jesús, camino, verdad y vida, que preparas un lugar para nosotros en la casa del Padre; no dejes que se turbe nuestro corazón. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia sea la vid verdadera cuyos sarmientos, unidos a Cristo, den fruto abundante, y que quienes se alejan de él sean podados y vueltos a injertar por la misericordia divina.",
      "world": "Que las naciones descubran, como el eunuco etíope guiado por Felipe, que nada les impide acercarse a las aguas de la vida cuando el corazón busca sinceramente la verdad.",
      "parish": "Que esta comunidad permanezca unida a Cristo como el sarmiento a la vid, sabiendo que separados de él nada podemos hacer, y que el que permanece en él da mucho fruto.",
      "suffering": "Que quienes se sienten secos y estériles en su dolor sean podados por el Padre, viñador cuidadoso, para que den más fruto y experimenten que Dios es amor, como enseña san Juan.",
      "dead": "Que los difuntos, injertados en la vid verdadera que es Cristo, permanezcan ya para siempre unidos a él, dando fruto eterno en la casa del Padre.",
      "gospel": "Que permanezcamos en Cristo, la vid verdadera, sabiendo que el sarmiento no puede dar fruto por sí mismo si no permanece unido a la vid, y que sin él nada podemos hacer.",
      "closing": "Padre, viñador de nuestras vidas, que podas los sarmientos para que den más fruto; mantennos unidos a Cristo, la vid verdadera, para no quedar secos y estériles. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Pedro ante los que criticaban el bautismo de los gentiles, reconozca que Dios no hace acepción de personas y abra sus puertas a todo el que el Espíritu llame.",
      "world": "Que las naciones esperen con nosotros el cielo nuevo y la tierra nueva donde Dios enjugará toda lágrima y ya no habrá muerte, ni llanto, ni dolor, porque las cosas viejas pasaron.",
      "parish": "Que esta comunidad viva el mandamiento nuevo de Cristo: 'amaos los unos a los otros como yo os he amado', para que en ese amor mutuo el mundo reconozca a sus verdaderos discípulos.",
      "suffering": "Que a quienes lloran y sufren el Señor les diga desde su trono: 'yo hago nuevas todas las cosas', enjugando sus lágrimas y dándoles de beber gratuitamente de la fuente del agua de la vida.",
      "dead": "Que los difuntos habiten ya la ciudad santa donde Dios mismo estará con ellos, morada de Dios con los hombres, sin muerte ni llanto ni dolor, porque las cosas viejas pasaron.",
      "gospel": "Que cumplamos el mandamiento nuevo que Cristo nos dejó: 'que os améis los unos a los otros; como yo os he amado, así amaos también vosotros', signo distintivo de sus verdaderos discípulos.",
      "closing": "Dios que haces nuevas todas las cosas, que prometes un cielo nuevo y una tierra nueva sin muerte ni llanto; enséñanos a amarnos unos a otros como Cristo nos amó. Por Jesucristo nuestro Señor."
    }
  },
  "easter6": {
    "A": {
      "church": "Que la Iglesia, como Pablo en el Areópago de Atenas, sepa hablar con respeto a quienes buscan a tientas a un Dios desconocido, anunciándoles que en Cristo ya no está lejos de ninguno de nosotros.",
      "world": "Que las naciones que erigen altares 'al Dios desconocido', como los atenienses, descubran en Cristo al Dios que no habita en templos hechos por manos humanas sino cerca de todo corazón que lo busca.",
      "parish": "Que esta comunidad reciba al Espíritu Consolador que Cristo prometió enviar, para que esté con nosotros para siempre y no nos deje huérfanos.",
      "suffering": "Que quienes padecen injustamente por hacer el bien, como exhorta la carta de Pedro, hallen fortaleza en Cristo, que padeció una sola vez por los pecados para llevarnos a Dios.",
      "dead": "Que los difuntos, guardados por el Espíritu Consolador que Cristo prometió, gocen ya de la presencia definitiva de Aquel que dijo 'no os dejaré huérfanos, volveré a vosotros'.",
      "gospel": "Que recibamos al Espíritu de la verdad que Cristo promete enviarnos, el Consolador que permanecerá con nosotros para siempre, pues él dijo: 'no os dejaré huérfanos, volveré a vosotros'.",
      "closing": "Dios cercano, que no habitas en templos hechos por manos humanas sino en el corazón que te busca; envíanos tu Espíritu Consolador para que no quedemos huérfanos. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia reconozca, como Pedro al ver caer el Espíritu sobre la casa de Cornelio, que Dios no hace distinción de personas, y bautice con alegría a todo el que el Espíritu ya ha tocado.",
      "world": "Que las naciones aprendan de Cristo que nadie tiene amor más grande que el que da la vida por sus amigos, y transformen la rivalidad entre pueblos en amistad sincera.",
      "parish": "Que esta comunidad se ame como Cristo la amó, recordando sus palabras: 'ya no os llamo siervos, sino amigos, porque os he dado a conocer todo lo que oí de mi Padre'.",
      "suffering": "Que quienes se sienten solos o abandonados descubran que Cristo los llama amigos y no siervos, y que ese amor que da la vida por los amigos los sostiene en medio del dolor.",
      "dead": "Que los difuntos, elegidos y puestos por Cristo para dar fruto duradero, gocen ya de la amistad eterna de quien dio su vida por ellos.",
      "gospel": "Que vivamos el mandamiento de Cristo de amarnos unos a otros como él nos amó, recordando que nadie tiene amor más grande que el que da la vida por sus amigos, y que él nos ha llamado amigos, no siervos.",
      "closing": "Señor Jesús, que nos llamas amigos y no siervos, y nos elegiste para que demos fruto duradero; enséñanos a amarnos unos a otros como tú nos has amado. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, guiada por el Espíritu como Pablo fue llevado por la visión del hombre macedonio, cruce fronteras nuevas y anuncie el Evangelio donde aún no ha sido oído.",
      "world": "Que las naciones sean como la ciudad santa que no necesita templo, porque el Señor Dios y el Cordero son su templo, ni necesita sol ni luna, porque la gloria de Dios la ilumina.",
      "parish": "Que esta comunidad, como Lidia, la vendedora de púrpura que abrió su corazón y su casa a Pablo, reciba con generosidad la Palabra y comparta con hospitalidad lo que ha recibido.",
      "suffering": "Que a quienes sufren turbación y miedo, Cristo les repita: 'la paz os dejo, mi paz os doy; no os la doy como el mundo la da; no se turbe vuestro corazón ni tenga miedo'.",
      "dead": "Que los difuntos entren ya en la ciudad santa, la nueva Jerusalén, donde no hay templo porque Dios y el Cordero son su templo, y donde caminan las naciones a su luz.",
      "gospel": "Que recibamos la paz que Cristo nos deja, distinta de la paz del mundo, para que nuestro corazón no se turbe ni tenga miedo, confiando en el Espíritu Santo que el Padre enviará en su nombre.",
      "closing": "Señor de la paz, que nos dejas una paz distinta de la del mundo; aquieta nuestro corazón turbado y líbranos de todo temor por la fuerza de tu Espíritu. Por Jesucristo nuestro Señor."
    }
  },
  "ascension": {
    "A": {
      "church": "Que la Iglesia, enviada por Cristo a hacer discípulos de todas las naciones, no se quede mirando al cielo como los apóstoles en el monte, sino que salga a bautizar y enseñar hasta los confines de la tierra.",
      "world": "Que las naciones reconozcan a Cristo sentado a la derecha del Padre, muy por encima de todo principado, autoridad, poder y señorío, y sometan sus propios poderes a su justicia.",
      "parish": "Que esta comunidad recuerde la promesa del Señor ascendido: 'yo estoy con vosotros todos los días, hasta el fin del mundo', y viva sin temor esa presencia constante.",
      "suffering": "Que los que sufren miren hacia lo alto con la certeza de los ángeles: 'este mismo Jesús, que ha sido llevado al cielo, volverá tal como lo habéis visto marcharse'.",
      "dead": "Que los difuntos participen ya de la herencia gloriosa que Cristo ascendido posee entre los santos, conforme a la fuerza de su poder que resucita y eleva a los suyos.",
      "gospel": "Que salgamos a hacer discípulos de todas las naciones, bautizándolos en el nombre del Padre, del Hijo y del Espíritu Santo, confiados en la promesa de Cristo: 'yo estoy con vosotros todos los días'.",
      "closing": "Señor ascendido, que subiste al cielo entre aclamaciones y prometiste estar con nosotros hasta el fin del mundo; danos fuerza para ir y hacer discípulos de todas las naciones. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, iluminados los ojos de su corazón como pide Pablo, conozca la esperanza a la que ha sido llamada y la riqueza de la herencia gloriosa reservada a los santos.",
      "world": "Que los reinos de la tierra reconozcan a Aquel a quien Dios sentó a su derecha en los cielos, muy por encima de todo principado, potestad, virtud y dominación.",
      "parish": "Que esta comunidad, bendecida por Cristo mientras él subía al cielo, vuelva a Jerusalén con gran gozo, como los discípulos, y esté siempre en el templo bendiciendo a Dios.",
      "suffering": "Que quienes atraviesan pruebas confíen en el poder incomparable de Dios hacia los que creemos, según la eficacia de la fuerza que desplegó en Cristo al resucitarlo y sentarlo en los cielos.",
      "dead": "Que los difuntos sean ya parte del cuerpo de Cristo, cabeza sobre todas las cosas, que llena todo en todos, participando de la plenitud reservada a los santos.",
      "gospel": "Que como Cristo, alzando sus manos, bendijo a los discípulos mientras se separaba de ellos y era llevado al cielo, también nosotros vivamos bendiciendo a Dios con gran gozo cada día.",
      "closing": "Padre, que sentaste a tu Hijo a tu derecha en los cielos sobre todo principado y potestad; abre los ojos de nuestro corazón para conocer la esperanza a la que nos llamas. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia continúe la obra que Jesús comenzó a hacer y a enseñar, según registra Lucas, dando testimonio de la penitencia y el perdón de los pecados a todas las naciones desde Jerusalén.",
      "world": "Que las naciones, ante quienes se predicará en nombre de Cristo la penitencia y el perdón de los pecados, se abran a la conversión que trae verdadera paz.",
      "parish": "Que esta comunidad revestida de la fuerza de lo alto, como prometió el Señor antes de subir al cielo, sea testigo valiente de todo lo que ha visto y oído.",
      "suffering": "Que quienes sufren encuentren consuelo en la bendición del Señor ascendido, cuyas manos alzadas sobre los discípulos siguen alzadas sobre todo el que sufre hoy.",
      "dead": "Que los difuntos, revestidos ya de la fuerza de lo alto, participen de la gloria del Cristo llevado al cielo entre bendiciones.",
      "gospel": "Que permanezcamos en la ciudad, revestidos de la fuerza de lo alto que Cristo prometió, antes de salir a predicar en su nombre la conversión y el perdón de los pecados a todas las naciones.",
      "closing": "Señor Jesús, que antes de subir al cielo prometiste revestirnos de la fuerza de lo alto; envía sobre nosotros esa fuerza para ser testigos de tu perdón. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "easter7": {
    "A": {
      "church": "Que la Iglesia, como los apóstoles reunidos en el cenáculo con María la madre de Jesús, persevere unánime en la oración mientras espera la fuerza del Espíritu prometido.",
      "world": "Que las naciones, en lugar de preguntar como los apóstoles '¿restaurarás ahora el reino a Israel?', busquen ser testigos de Cristo hasta los confines de la tierra en verdadera justicia.",
      "parish": "Que esta comunidad, unida en oración con una sola alma junto a María, aguarde confiada la fuerza del Espíritu Santo que Cristo prometió antes de subir al cielo.",
      "suffering": "Que quienes participan de los sufrimientos de Cristo, como escribe Pedro, se alegren también cuando se manifieste su gloria, sabiendo que el Espíritu de Dios reposa sobre ellos.",
      "dead": "Que los difuntos, glorificados ya por el Padre a quien Cristo pidió 'glorifica a tu Hijo', participen de la vida eterna que consiste en conocer al único Dios verdadero y a Jesucristo su enviado.",
      "gospel": "Que, como Cristo oró 'Padre, glorifica a tu Hijo para que el Hijo te glorifique', nuestra vida entera glorifique al Padre cumpliendo la obra que él nos ha encomendado.",
      "closing": "Padre santo, a quien Cristo pidió ser glorificado antes de su pasión; concédenos la vida eterna, que consiste en conocerte a ti y a tu Hijo Jesucristo. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como los apóstoles que eligieron a Matías para completar el número de los Doce, discierna con oración a quienes ha de confiar el ministerio y el apostolado.",
      "world": "Que las naciones se guarden del maligno, como pidió Cristo por los suyos, y encuentren en la verdad de la Palabra la consagración que las libra del odio del mundo.",
      "parish": "Que esta comunidad sea guardada en el nombre del Padre, como pidió Jesús en su oración, para que sea una sola, igual que el Padre y el Hijo son uno.",
      "suffering": "Que quienes son odiados por el mundo a causa de su fe, como advirtió Cristo a sus discípulos, sientan la alegría cumplida en ellos y la protección del nombre del Padre.",
      "dead": "Que los difuntos, guardados en el nombre del Padre mientras vivieron, y a quienes ninguno se perdió excepto el hijo de perdición, participen ya de la vida eterna en Cristo.",
      "gospel": "Que vivamos consagrados en la verdad, como pidió Cristo al Padre por nosotros: 'no te pido que los saques del mundo, sino que los guardes del maligno'.",
      "closing": "Padre santo, guarda en tu nombre a los que nos has dado, para que seamos uno como tú y el Hijo sois uno; consérvanos en la verdad. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Pablo y Silas cantando himnos en la cárcel de Filipos a medianoche, mantenga la alabanza aun en la prisión y en la persecución, confiando en que Dios abre las puertas cerradas.",
      "world": "Que las naciones, como el carcelero de Filipos que preguntó temblando '¿qué debo hacer para salvarme?', se abran a la fe que trae salvación a toda su casa.",
      "parish": "Que esta comunidad viva la oración de Cristo 'que todos sean uno, como tú, Padre, en mí y yo en ti', superando divisiones para que el mundo crea que el Padre lo envió.",
      "suffering": "Que quienes están encadenados como Pablo y Silas, presos por su fe o por su dolor, experimenten el terremoto que sacude sus cadenas y la libertad que Cristo concede.",
      "dead": "Que los difuntos beban ya gratuitamente del agua de la vida, pues Cristo, el Alfa y la Omega, el primero y el último, invita a todo el que tiene sed a acercarse a la fuente.",
      "gospel": "Que vivamos la unidad por la que Cristo oró: 'que todos sean uno, como tú, Padre, estás en mí y yo en ti, para que el mundo crea que tú me enviaste'.",
      "closing": "Señor, Alfa y Omega, principio y fin, que invitas a todo el que tiene sed a beber gratuitamente del agua de la vida; concede que todos seamos uno como tú y el Padre sois uno. Por Jesucristo nuestro Señor."
    }
  },
  "pentecost": {
    "A": {
      "church": "Que la Iglesia, nacida cuando un viento impetuoso llenó la casa y lenguas de fuego se posaron sobre los apóstoles, siga hablando hoy en las lenguas de cada pueblo las maravillas de Dios.",
      "world": "Que las naciones reunidas en Jerusalén aquel día, partas, medos, elamitas y gente de toda lengua, escuchen de nuevo el Evangelio en su propia lengua y reconozcan las maravillas de Dios.",
      "parish": "Que esta comunidad, formando un solo cuerpo con muchos miembros, reconozca que hay diversidad de dones pero un mismo Espíritu que reparte a cada uno según su bien.",
      "suffering": "Que sobre los que sufren se derrame el Espíritu que Dios prometió por el profeta Joel, para que también ellos profeticen esperanza y vean visiones de un futuro nuevo.",
      "dead": "Que los difuntos, sellados por el mismo Espíritu que da vida, participen ya de la renovación de la faz de la tierra que el Salmo pide para toda la creación.",
      "gospel": "Que recibamos el Espíritu Santo que Cristo sopló sobre los discípulos diciendo 'como el Padre me envió, también yo os envío', y ejerzamos con humildad el perdón que él nos confía.",
      "closing": "Espíritu Santo, que llenaste de fuego y de lenguas nuevas a los apóstoles en Jerusalén; envíate sobre nosotros y renueva la faz de la tierra. Tú que vives y reinas por los siglos de los siglos."
    },
    "B": {
      "church": "Que la Iglesia, un solo cuerpo con muchos dones repartidos por el mismo Espíritu, dé testimonio unánime de Cristo ante el mundo, sin dejarse dividir por la diversidad de carismas.",
      "world": "Que la creación entera, que gime a una como con dolores de parto según escribe Pablo, sea liberada por el Espíritu que intercede por nosotros con gemidos indecibles.",
      "parish": "Que esta comunidad experimente al Espíritu que viene en ayuda de nuestra debilidad, intercediendo por nosotros cuando no sabemos ni qué pedir ni cómo orar como conviene.",
      "suffering": "Que los que gimen bajo el peso del dolor sepan que el Espíritu mismo intercede por ellos con gemidos que no pueden expresarse en palabras, según escribe Pablo a los romanos.",
      "dead": "Que los difuntos, adoptados como hijos por el Espíritu que clama en nosotros 'Abba, Padre', hereden ya la gloria prometida a los que sufrieron con Cristo.",
      "gospel": "Que el Espíritu de la verdad, que procede del Padre y que Cristo enviará, dé testimonio de Jesús también a través de nosotros, sus testigos desde el principio.",
      "closing": "Espíritu Santo, que intercedes por nosotros con gemidos indecibles y nos haces clamar 'Abba, Padre'; ven en ayuda de nuestra debilidad y renueva la faz de la tierra. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Que la Iglesia, guiada a la verdad completa por el Espíritu que Cristo prometió enviar en su nombre, enseñe fielmente todo lo que Jesús dijo a sus discípulos.",
      "world": "Que las naciones reciban un espíritu de hijos de adopción, y no un espíritu de esclavitud que induzca de nuevo al temor, como escribe Pablo a los romanos.",
      "parish": "Que esta comunidad, morada donde el Padre y el Hijo vienen a habitar como prometió Jesús a quien lo ama y guarda su palabra, sea hogar del Espíritu Santo.",
      "suffering": "Que a los afligidos el Espíritu Santo, el Consolador que el Padre enviará en nombre de Cristo, les enseñe todo y les recuerde las palabras de paz que Jesús dejó: 'no se turbe vuestro corazón ni tenga miedo'.",
      "dead": "Que los difuntos, herederos de Dios y coherederos con Cristo, gocen ya de la paz que Jesús dejó, distinta de la que da el mundo, en la casa donde el Padre y el Hijo hacen su morada.",
      "gospel": "Que guardemos la palabra de Cristo para que el Padre y el Hijo vengan a nosotros y hagan en nosotros su morada, enviándonos al Espíritu Santo que nos lo enseñará todo.",
      "closing": "Padre, que junto al Hijo vienes a habitar en quien guarda su palabra; envíanos el Espíritu Consolador que nos enseñe todo y aquiete nuestro corazón. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "trinity": {
    "A": {
      "church": "Que la Iglesia, enviada a bautizar en el nombre del Padre, del Hijo y del Espíritu Santo, enseñe a guardar todo lo que Cristo mandó, confiada en su promesa: 'yo estoy con vosotros todos los días'.",
      "world": "Que las naciones, ante quien midió las aguas con el hueco de su mano y niveló los cielos con su palmo, reconozcan su pequeñez y busquen la sabiduría que Isaías proclama.",
      "parish": "Que esta comunidad viva la gracia del Señor Jesucristo, el amor de Dios y la comunión del Espíritu Santo, saludándose unos a otros con el ósculo santo que pide san Pablo.",
      "suffering": "Que los que desfallecen y no tienen fuerzas oigan la promesa de Isaías: 'los que esperan en el Señor renovarán sus fuerzas, levantarán el vuelo como águilas'.",
      "dead": "Que los difuntos, contados por Dios que llama por su nombre a las estrellas del cielo, descansen en el poder de Aquel para quien nada se pierde ni se le escapa.",
      "gospel": "Que salgamos a hacer discípulos de todas las naciones, bautizándolos en el nombre del Padre, del Hijo y del Espíritu Santo, seguros de que Cristo está con nosotros hasta el fin del mundo.",
      "closing": "Padre, Hijo y Espíritu Santo, un solo Dios admirable en toda la tierra; concede que la gracia, el amor y la comunión que son tu vida misma habiten siempre entre nosotros. Tú que vives y reinas por los siglos de los siglos."
    },
    "B": {
      "church": "Que la Iglesia, como Isaías ante el trono, exclame con los serafines 'Santo, Santo, Santo es el Señor de los ejércitos', y responda igual que el profeta: 'aquí estoy, envíame'.",
      "world": "Que las naciones den al Señor la gloria y el honor debidos a su nombre, como proclama el Salmo 29, y su voz truene sobre las aguas para traer paz en lugar de destrucción.",
      "parish": "Que esta comunidad, que ha recibido un espíritu de hijos de adopción, clame con Pablo '¡Abba, Padre!' y viva como coheredera de Cristo en el gozo del Espíritu.",
      "suffering": "Que a quienes sufren el Padre les repita lo que dijo a Nicodemo por medio de su Hijo: 'de tal manera amó Dios al mundo que le dio a su Hijo único, para que todo el que cree en él no se pierda'.",
      "dead": "Que los difuntos, como Nicodemo llamado a nacer de nuevo del agua y del Espíritu, gocen ya de la vida eterna prometida a todo el que cree en el Hijo enviado por amor.",
      "gospel": "Que como Nicodemo, que se acercó de noche a preguntar, busquemos nacer de nuevo del agua y del Espíritu, creyendo que Dios amó tanto al mundo que entregó a su Hijo único.",
      "closing": "Dios tres veces santo, que amaste tanto al mundo que entregaste a tu Hijo único; haznos nacer de nuevo por el agua y el Espíritu para no perecer sino tener vida eterna. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Que la Iglesia, como la Sabiduría que jugaba delante de Dios en la creación del mundo según Proverbios, se deleite en la obra de Dios y encuentre su gozo entre los hijos de los hombres.",
      "world": "Que las naciones descubran la paz con Dios por nuestro Señor Jesucristo, y que el amor de Dios derramado en los corazones por el Espíritu Santo sostenga su esperanza que no defrauda.",
      "parish": "Que esta comunidad se gloríe incluso en las tribulaciones, sabiendo, como escribe Pablo, que la tribulación produce paciencia, la paciencia virtud probada, y la virtud probada esperanza.",
      "suffering": "Que quienes padecen tribulación encuentren, como enseña Pablo a los romanos, que el amor de Dios ha sido derramado en sus corazones por el Espíritu Santo que les fue dado.",
      "dead": "Que los difuntos participen de la verdad completa a la que el Espíritu guía, recibiendo de Cristo lo que es del Padre, según prometió Jesús en su despedida.",
      "gospel": "Que el Espíritu de la verdad nos guíe a la verdad completa, tomando de lo que es de Cristo para anunciárnoslo, pues todo lo que tiene el Padre es también del Hijo.",
      "closing": "Dios admirable en toda la tierra, Sabiduría eterna que te deleitas entre los hijos de los hombres; derrama tu amor en nuestros corazones por el Espíritu que nos has dado. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "corpusChristi": {
    "A": {
      "church": "Que la Iglesia, alimentada con el pan vivo bajado del cielo, recuerde el maná que Dios dio a Israel en el desierto para enseñarle que no solo de pan vive el hombre, sino de toda palabra que sale de la boca de Dios.",
      "world": "Que las naciones que pasan hambre, como Israel en el desierto, reciban tanto el pan material como el Pan de vida que Cristo ofrece para que nadie muera de hambre.",
      "parish": "Que esta comunidad, al comer del único pan, sea un solo cuerpo, pues todos participamos de ese único pan, como enseña Pablo a los corintios.",
      "suffering": "Que quienes padecen hambre o carencia recuerden que Dios humilló a su pueblo en el desierto para hacerle bien al final, alimentándolo con maná que ni él ni sus padres conocían.",
      "dead": "Que los difuntos, que comieron en vida el pan bajado del cielo, resuciten en el último día, según la promesa de Cristo: 'el que come mi carne y bebe mi sangre tiene vida eterna'.",
      "gospel": "Que recibamos con fe el pan vivo bajado del cielo que es la carne de Cristo dada por la vida del mundo, pues quien come de este pan vivirá para siempre.",
      "closing": "Señor Jesús, pan vivo bajado del cielo, que nos alimentas como Dios alimentó a Israel con el maná en el desierto; danos siempre este pan que da vida eterna. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, rociada como el pueblo de Israel con la sangre de la alianza en el Sinaí, viva fiel al nuevo pacto sellado por Cristo con su propia sangre en la cruz.",
      "world": "Que las naciones alcancen la paz mediante la sangre de la alianza nueva y eterna, aquella que Cristo derramó de una vez para siempre, según enseña la carta a los Hebreos.",
      "parish": "Que esta comunidad, reunida en torno a la mesa donde Cristo dijo 'esto es mi cuerpo, esto es mi sangre de la alianza', celebre cada Eucaristía como memorial vivo de la Última Cena.",
      "suffering": "Que quienes sufren encuentren consuelo en el cáliz de la salvación que Cristo ofreció a sus discípulos, sangre derramada por muchos para el perdón de los pecados.",
      "dead": "Que los difuntos, redimidos por la sangre de Cristo que purifica la conciencia de las obras muertas, entren ya en la herencia eterna prometida a los llamados.",
      "gospel": "Que recordemos, como en la Última Cena, las palabras de Cristo sobre el pan y el cáliz: 'esto es mi cuerpo... esto es mi sangre de la alianza, que es derramada por muchos'.",
      "closing": "Señor Jesús, que en la Última Cena nos diste tu cuerpo y tu sangre como alianza nueva y eterna; que cada Eucaristía nos una más a tu sacrificio. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, sacerdocio según el orden de Melquisedec que ofreció pan y vino, celebre la Eucaristía como memorial vivo del cuerpo entregado y la sangre derramada por Cristo.",
      "world": "Que las naciones hambrientas, como la multitud que siguió a Jesús hasta lugares desiertos, sean alimentadas cuando la Iglesia comparta generosamente los pocos panes y peces que tiene.",
      "parish": "Que esta comunidad, al partir el pan y bendecirlo como hizo Cristo con los cinco panes y los dos peces, descubra que en sus manos alcanza y sobra para saciar a todos.",
      "suffering": "Que quienes tienen hambre y sed de justicia sean saciados como la multitud en el desierto, donde Cristo tomó los panes, los bendijo, los partió y dio de comer a cinco mil hombres.",
      "dead": "Que los difuntos participen ya del banquete eterno prefigurado por Melquisedec, rey de Salem, que salió al encuentro de Abrahán con pan y vino y lo bendijo.",
      "gospel": "Que aprendamos de Cristo a compartir lo poco que tenemos, como los cinco panes y los dos peces que, bendecidos y partidos, alcanzaron para saciar a la multitud con doce cestos de sobra.",
      "closing": "Señor Jesús, sacerdote según el orden de Melquisedec, que multiplicas lo poco que ponemos en tus manos; parte y reparte también hoy el pan de tu Eucaristía entre nosotros. Por Jesucristo nuestro Señor."
    }
  },
  "sacredHeart": {
    "A": {
      "church": "Que la Iglesia recuerde que Dios la eligió no por ser más numerosa que otros pueblos, sino por puro amor, y responda a esa elección gratuita con fidelidad y gratitud.",
      "world": "Que las naciones descubran que Dios es amor, como escribe san Juan, y que quien no ama no ha conocido a Dios, para que el amor mutuo sustituya al odio entre los pueblos.",
      "parish": "Que esta comunidad acuda a Cristo que llama: 'venid a mí todos los que estáis cansados y agobiados, y yo os aliviaré', aprendiendo de él que es manso y humilde de corazón.",
      "suffering": "Que los cansados y agobiados encuentren descanso en el Corazón manso y humilde de Cristo, que promete un yugo suave y una carga ligera a quien se acerca a él.",
      "dead": "Que los difuntos, elegidos por el amor gratuito de Dios y no por sus propios méritos, descansen ya en la misericordia eterna que se extiende de generación en generación.",
      "gospel": "Que aprendamos de Cristo, manso y humilde de corazón, acercándonos a él con nuestro cansancio y nuestra carga, confiados en que su yugo es suave y su carga ligera.",
      "closing": "Corazón manso y humilde de Jesús, que llamas a los cansados y agobiados a encontrar descanso en ti; alivia hoy nuestra carga y enséñanos tu mansedumbre. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como el pueblo de Efraín a quien Dios enseñó a caminar tomándolo de los brazos, se deje conducir con cuerdas de amor y no de terror por su Dios.",
      "world": "Que las naciones conozcan el amor de Cristo que sobrepasa todo conocimiento, según pide Pablo para los Efesios, y sean así colmadas con toda la plenitud de Dios.",
      "parish": "Que esta comunidad saque agua con gozo de las fuentes de la salvación que brotan del costado traspasado de Cristo, del cual manó sangre y agua.",
      "suffering": "Que los que sufren recuerden las palabras de Oseas: 'yo enseñé a caminar a Efraín, tomándolo de los brazos... con cuerdas humanas los atraje, con lazos de amor', imagen de la ternura de Dios hacia el dolor.",
      "dead": "Que los difuntos, alcanzados por la lanza que traspasó el costado de Cristo del que brotó sangre y agua, participen ya del torrente de vida que allí manó para el mundo.",
      "gospel": "Que contemplemos el costado traspasado de Cristo, del cual brotó al instante sangre y agua, fuente inagotable de la que sacamos agua con gozo, según la salvación anunciada por Isaías.",
      "closing": "Corazón traspasado de Jesús, del cual brotaron sangre y agua para nuestra salvación; que saquemos con gozo de esa fuente el agua de la vida eterna. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como el Buen Pastor de Ezequiel que busca la oveja perdida y la extraviada, salga siempre en busca de quien se ha alejado del rebaño.",
      "world": "Que las naciones experimenten la reconciliación que Pablo anuncia a los Romanos: 'cuando éramos enemigos, fuimos reconciliados con Dios por la muerte de su Hijo'.",
      "parish": "Que esta comunidad imite al pastor de la parábola que, al encontrar la oveja perdida, la carga sobre sus hombros lleno de alegría y convoca a los vecinos para celebrar con él.",
      "suffering": "Que los que se sienten perdidos u olvidados escuchen la promesa de Ezequiel: 'yo mismo apacentaré mis ovejas... buscaré la oveja perdida, curaré a la herida, fortaleceré a la enferma'.",
      "dead": "Que los difuntos sean ya la oveja que el Pastor cargó sobre sus hombros con alegría, llevada a casa para el banquete donde se celebra con los amigos y vecinos.",
      "gospel": "Que Cristo, como el pastor de la parábola, deje las noventa y nueve para ir tras la oveja perdida hasta encontrarla, y la cargue sobre sus hombros lleno de alegría.",
      "closing": "Buen Pastor, cuyo Corazón busca a la oveja perdida y la carga sobre sus hombros con alegría; sal también hoy en busca de quien se ha extraviado de ti. Por Jesucristo nuestro Señor."
    }
  },
  "trinity1": {
    "A": {
      "church": "Que la Iglesia, como el arca de Noé, sea refugio seguro para todo el que busca salvación en medio del diluvio de este mundo; que sus puertas permanezcan abiertas a quien Dios llama a entrar.",
      "world": "Que las naciones reconozcan, como Noé, la necesidad de prepararse ante los peligros que se avecinan; que gobernantes y pueblos actúen con previsión y responsabilidad ante las crisis comunes.",
      "parish": "Que esta comunidad parroquial edifique su vida, como enseña el Evangelio, sobre la roca firme de la palabra de Cristo escuchada y puesta en práctica, y no sobre la arena de las apariencias.",
      "suffering": "Que los enfermos y los que sufren hallen en Dios de Jacob su alcázar y fortaleza, como canta el salmo, y no sean arrastrados por las aguas de la angustia.",
      "dead": "Que los fieles difuntos, justificados por la fe como enseña Pablo a los Romanos, reposen en la paz de quien los salvó no por sus obras sino por su gracia.",
      "gospel": "Que no seamos como el que oye las palabras de Cristo y no las cumple, edificando sobre arena; que nuestra vida entera repose sobre la roca de su enseñanza, firme ante viento y tormenta.",
      "closing": "Señor de los ejércitos, Dios de Jacob, que fuiste alcázar para Noé en medio del diluvio; haznos firmes como la casa edificada sobre roca y justos por la fe que nos has dado. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como el joven Samuel en el templo, aprenda a responder «Habla, Señor, que tu siervo escucha»; que pastores y fieles no confundan la voz de Dios con el ruido del mundo.",
      "world": "Que las naciones lleven con humildad el tesoro de su dignidad humana en vasijas de barro, como escribe Pablo, sabiendo que el poder que las sostiene viene de Dios y no de sí mismas.",
      "parish": "Que esta comunidad parroquial, como el hombre de la mano seca en la sinagoga, se atreva a acercarse a Cristo aun en día de descanso, confiando en que él quiere hacer el bien y sanar.",
      "suffering": "Que los enfermos y los que sufren sean como Samuel sondeado y conocido por Dios, según el salmo; que sientan que ninguna tiniebla les es oscura ante quien todo lo conoce.",
      "dead": "Que los fieles difuntos, que llevaron el tesoro de la vida en frágiles vasijas de barro, manifiesten ahora la vida de Jesús en la resurrección prometida.",
      "gospel": "Que aprendamos del Señor del sábado que las instituciones existen para servir al hombre y no al revés; que nuestras prácticas religiosas nunca nos endurezcan el corazón ante quien sufre.",
      "closing": "Señor, tú me sondeas y me conoces; como llamaste a Samuel en la noche, sigue llamándonos por nuestro nombre y danos un corazón dispuesto a responder. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Elías en el monte Carmelo, no tema estar sola frente a los falsos profetas de la época, confiando en que el fuego del Señor consumirá todo sacrificio ofrecido con fe verdadera.",
      "world": "Que todos los pueblos proclamen las maravillas del Señor entre las naciones, como canta el salmo, y abandonen los ídolos vanos que prometen fuego y no responden.",
      "parish": "Que esta comunidad parroquial imite al centurión del Evangelio, reconociendo con humildad «no soy digno de que entres bajo mi techo» y confiando en la sola palabra de Cristo para ser sanada.",
      "suffering": "Que los enfermos y los que sufren obtengan la curación que alcanzó el siervo del centurión, sanado a distancia por la sola palabra de Jesús, sin que la enfermedad tenga la última palabra.",
      "dead": "Que los fieles difuntos, purificados por el único Evangelio que Pablo dice haber recibido por revelación de Jesucristo y no de hombres, participen ya de la gloria que ese Evangelio promete.",
      "gospel": "Que como el centurión reconozcamos la autoridad de la sola palabra de Cristo para sanar y salvar, sin necesitar señales mayores que la fe humilde que él tanto elogió.",
      "closing": "Dios que respondiste con fuego a la oración de Elías en el Carmelo, enciende también en nosotros la fe humilde del centurión que confió en tu sola palabra. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "trinity2": {
    "A": {
      "church": "Que la Iglesia, llamada como Abram a salir de su tierra hacia lo desconocido, no se aferre a seguridades pasadas sino que camine confiada hacia la tierra que Dios le muestra.",
      "world": "Que las naciones de la tierra reconozcan, como promete Dios a Abram, que en ellas puede obrar la bendición cuando se abren a la justicia y no a la codicia.",
      "parish": "Que esta comunidad parroquial acoja al pecador como Cristo acogió a Mateo el publicano en su mesa, sin escandalizarse de comer con quienes más necesitan misericordia.",
      "suffering": "Que los enfermos y los que sufren experimenten la fe de la mujer que tocó el manto de Jesús y de Jairo que imploró por su hija, y hallen en Cristo la misma curación y vida.",
      "dead": "Que los fieles difuntos participen de la fe de Abraham, quien creyó contra toda esperanza que Dios da vida a los muertos y llama a la existencia lo que no existe.",
      "gospel": "Que como Mateo dejemos la mesa de nuestras seguridades al oír «Sígueme», y que como Jairo no dejemos de creer aun cuando todo parezca perdido, pues la niña «no está muerta, está dormida».",
      "closing": "Dios de Abraham, que llamaste a nuestro padre en la fe a salir hacia una tierra desconocida; llámanos también a nosotros a confiar sin ver, como Jairo confió en tu Hijo. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia no busque, como el pueblo de Israel ante Samuel, un rey o poder según el mundo, sino que reconozca en Cristo al único pastor que necesita.",
      "world": "Que los gobernantes de las naciones no repitan el error del pueblo que pidió un rey «como tienen todas las naciones», olvidando que el Señor mismo reina sobre ellos.",
      "parish": "Que esta comunidad parroquial reconozca como hermanos de Cristo a quienes hacen la voluntad de Dios, superando divisiones familiares o de sangre, según enseña el Evangelio de hoy.",
      "suffering": "Que los enfermos y los que sufren no desfallezcan aunque este cuerpo mortal se vaya consumiendo, sabiendo con Pablo que el hombre interior se renueva de día en día.",
      "dead": "Que los fieles difuntos, cuya morada terrena se ha deshecho, reciban ya la casa eterna no hecha por manos humanas que Pablo anuncia a los Corintios.",
      "gospel": "Que no juzguemos a Cristo como lo hicieron los suyos, que lo creyeron fuera de sí; que reconozcamos que quien hace la voluntad del Padre entra en la verdadera familia de Jesús.",
      "closing": "Señor, tu amor es eterno; no abandones la obra de tus manos, como no abandonaste a Israel aun cuando pidió un rey contra tu consejo. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Elías con la viuda de Sarepta, confíe en que la harina y el aceite no se agotarán mientras se comparte lo poco con el necesitado.",
      "world": "Que las naciones alimenten al hambriento como la viuda de Sarepta alimentó al profeta, confiando que la generosidad hacia el forastero no empobrece sino que multiplica.",
      "parish": "Que esta comunidad parroquial, conmovida como Jesús ante la viuda de Naín, no permanezca indiferente ante quien llora la pérdida de un hijo, sino que se acerque a consolar y a actuar.",
      "suffering": "Que los enfermos y los que sufren experimenten, como el hijo de la viuda de Naín, que Cristo se compadece y dice también sobre ellos «no llores», devolviéndoles vida y esperanza.",
      "dead": "Que los fieles difuntos oigan la voz de Cristo que dijo al joven de Naín «Muchacho, a ti te digo, levántate», y resuciten para consuelo de quienes por ellos lloran.",
      "gospel": "Que aprendamos de la compasión de Jesús ante el cortejo fúnebre de Naín; que su palabra que devuelve la vida al hijo de la viuda renueve también nuestra fe en su poder sobre la muerte.",
      "closing": "Dios que por Elías multiplicaste la harina y el aceite de la viuda, y que por tu Hijo devolviste la vida al hijo de la viuda de Naín, sostén a quienes hoy pasan necesidad y aflicción. Por Jesucristo nuestro Señor."
    }
  },
  "trinity3": {
    "A": {
      "church": "Que la Iglesia acoja al forastero como Abraham acogió a los tres visitantes junto a la encina de Mamré, sin saber que recibía la promesa de Dios en su propia tienda.",
      "world": "Que las naciones no se rían con incredulidad como Sara ante la promesa divina, sino que crean que nada hay imposible para el Señor, ni siquiera la paz que parece lejana.",
      "parish": "Que esta comunidad parroquial envíe, como los Doce enviados por Jesús, obreros a una mies que es mucha, sin quedarse solo contemplando la necesidad ajena.",
      "suffering": "Que los enfermos y los que sufren reciban a Cristo, muerto por nosotros siendo aún pecadores, como prueba de que el amor de Dios no espera a que seamos dignos para socorrernos.",
      "dead": "Que los fieles difuntos caminen ya en presencia del Señor en el país de la vida, como canta el salmo, liberados de la muerte por quien murió y resucitó por ellos.",
      "gospel": "Que como los Doce enviados sin oro ni plata, salgamos a proclamar que el Reino de los cielos está cerca, confiando más en la providencia de Dios que en nuestros propios recursos.",
      "closing": "Dios que visitaste a Abraham junto a la encina de Mamré y cumpliste tu promesa a pesar de la risa de Sara, envíanos como a los Doce a anunciar que tu Reino está cerca. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, sembrada como el grano de mostaza, no desprecie sus pequeños comienzos sabiendo que Dios la hace crecer hasta dar cobijo a las aves del cielo.",
      "world": "Que las naciones reconozcan al más pequeño, como Dios eligió a David entre sus hermanos, y no midan el valor de las personas por apariencia o estatura.",
      "parish": "Que esta comunidad parroquial, hecha nueva creación en Cristo según Pablo, deje atrás los criterios meramente humanos de juzgar a las personas.",
      "suffering": "Que los enfermos y los que sufren respondan al Señor cuando lo invocan, como pide el salmo, confiando en quien mira el corazón y no las apariencias, como miró el corazón de David.",
      "dead": "Que los fieles difuntos, que vivieron para Cristo que murió y resucitó por todos, sean encontrados en él vestidos ya de la nueva creación que no pasa.",
      "gospel": "Que aprendamos del Reino de Dios comparado con el grano de mostaza: que no despreciemos los pequeños comienzos de fe en nuestra vida, confiando en que Dios los hace crecer.",
      "closing": "Señor, que elegiste a David, el más pequeño entre sus hermanos, para ser rey de tu pueblo; haz crecer en nosotros la semilla pequeña de la fe hasta que dé cobijo a otros. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como la mujer pecadora que ungió los pies de Jesús en casa del fariseo, ame mucho porque mucho se le ha perdonado, sin avergonzarse de mostrar su gratitud.",
      "world": "Que los poderosos de las naciones no repitan la injusticia de Acab y Jezabel contra Nabot, usurpando lo ajeno con violencia y falsos testigos.",
      "parish": "Que esta comunidad parroquial no juzgue como el fariseo Simón a quien se acerca a Cristo con lágrimas y perfume, sino que reconozca en cada pecador arrepentido un signo de amor grande.",
      "suffering": "Que los enfermos y los que sufren experimenten, como la mujer del Evangelio, que sus pecados y sus penas quedan perdonados y aliviados por la compasión de Cristo.",
      "dead": "Que los fieles difuntos, justificados no por las obras de la ley sino por la fe en Cristo, como escribe Pablo a los Gálatas, entren en la paz que él mereció para ellos.",
      "gospel": "Que como la mujer que lavó con lágrimas los pies de Jesús, no calculemos cuánto merecemos ser perdonados, sino que amemos mucho sabiendo cuánto se nos ha perdonado.",
      "closing": "Señor, guíame en tu justicia como pide el salmo; tú que perdonaste a la mujer pecadora por su gran amor, enséñanos a amar sin medida ni cálculo. Por Jesucristo nuestro Señor."
    }
  },
  "trinity4": {
    "A": {
      "church": "Que la Iglesia recuerde que Dios escuchó el llanto de Agar e Ismael en el desierto y abrió sus ojos para ver el pozo de agua; que nunca abandone al expulsado ni al descartado.",
      "world": "Que las naciones no repitan la expulsión de Agar e Ismael hacia el desierto, sino que Dios, bueno y clemente como canta el salmo, provea agua y futuro a todo desplazado.",
      "parish": "Que esta comunidad parroquial no tema a los que matan el cuerpo, según enseña el Evangelio, sino que confiese con valentía a Cristo ante cualquier oposición.",
      "suffering": "Que los enfermos y los que sufren experimenten que ni un solo cabello de su cabeza cae sin que el Padre lo sepa, como asegura Jesús en el Evangelio de hoy.",
      "dead": "Que los fieles difuntos, muertos al pecado y vivos para Dios en Cristo Jesús como escribe Pablo, hayan perdido su vida por él para encontrarla plenamente.",
      "gospel": "Que quien pierde su vida por causa de Cristo la encuentre, como promete el Evangelio; que no temamos más a quienes solo pueden dañar el cuerpo y no el alma.",
      "closing": "Señor, eres bueno y clemente; tú que abriste los ojos de Agar para ver el pozo en el desierto, abre también los nuestros para ver tu providencia en toda necesidad. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia enfrente a los gigantes de nuestro tiempo con la misma confianza de David ante Goliat, sabiendo que no salva la espada ni la lanza sino el Señor de los ejércitos.",
      "world": "Que el Señor, que juzgará al mundo con justicia según el salmo, dé a las naciones la valentía de David frente a los poderes que hoy desafían la paz.",
      "parish": "Que esta comunidad parroquial, sacudida a veces por tempestades como la barca de los discípulos, escuche la voz de Cristo que calma el viento y las olas.",
      "suffering": "Que los enfermos y los que sufren oigan a Cristo decirles, como a los discípulos aterrados en la barca, «¿por qué tenéis tanto miedo? ¿Aún no tenéis fe?».",
      "dead": "Que los fieles difuntos descansen en la paz de quien calmó la tempestad con su palabra, confiando en el juicio justo que el salmo anuncia para todo el mundo.",
      "gospel": "Que aprendamos de los discípulos en la barca sacudida por la tempestad; que la presencia de Cristo dormido en la popa no es indiferencia sino la calma que precede a su palabra de poder.",
      "closing": "El Señor juzgará al mundo con justicia; tú que calmaste la tempestad con una palabra, calma también las tormentas de nuestra fe pequeña. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Elías huyendo de Jezabel hasta el Horeb, reconozca la voz de Dios no en el huracán ni en el fuego sino en el silbo apacible y delicado.",
      "world": "Que las naciones perseguidas y sus profetas, como Elías amenazado de muerte, no pierdan la esperanza, sabiendo que Dios sostiene al que desfallece bajo la retama.",
      "parish": "Que esta comunidad parroquial libere al endemoniado gadareno que aún hoy vive entre nosotros, encadenado por miedos y exclusiones, y lo devuelva vestido y en su sano juicio a la comunidad.",
      "suffering": "Que los enfermos y los que sufren, como el ciervo que desea las corrientes de agua según el salmo, encuentren en Dios la fuente que calma su sed más honda.",
      "dead": "Que los fieles difuntos, hechos uno en Cristo sin distinción alguna como enseña Pablo a los Gálatas, participen de la libertad plena que ya no depende de la ley sino de la fe.",
      "gospel": "Que como el gadareno liberado de la legión de demonios, anunciemos por toda la ciudad cuánto ha hecho Dios con nosotros, en vez de callar por miedo o vergüenza.",
      "closing": "Como el ciervo desea las corrientes de agua, así te desea nuestra alma, Dios mío; tú que hablaste a Elías en el silbo apacible, habla también a nuestro corazón inquieto. Por Jesucristo nuestro Señor."
    }
  },
  "trinity5": {
    "A": {
      "church": "Que la Iglesia confíe como Abraham en el monte Moria que Dios proveerá, aun cuando el camino que recorre parezca conducir al sacrificio más doloroso.",
      "world": "Que las naciones, esclavas muchas veces del pecado según describe Pablo, se pongan al servicio de la justicia y no de la injusticia que las corrompe.",
      "parish": "Que esta comunidad parroquial no desprecie el vaso de agua fresca dado en nombre de Cristo, sabiendo que quien recibe al pequeño recibe al mismo Señor.",
      "suffering": "Que los enfermos y los que sufren sean mirados y respondidos por el Señor, como suplica el salmo, y no queden atados como esclavos de su dolor sino libres en la esperanza.",
      "dead": "Que los fieles difuntos, liberados de ser esclavos del pecado para convertirse en esclavos de la justicia como escribe Pablo, reciban la vida eterna como don de Dios en Cristo Jesús.",
      "gospel": "Que aprendamos que quien recibe al profeta, al justo o al pequeño en nombre de Cristo recibe recompensa; que ningún gesto de acogida, ni un vaso de agua fresca, quede sin valor ante Dios.",
      "closing": "Señor, mira y respóndeme; tú que proveíste el cordero para Abraham en el monte, provee también para nosotros en las pruebas que no comprendemos. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia llore como David lloró la muerte de Saúl y Jonatán, sin alegrarse jamás de la caída del adversario sino honrando la vida de todo ser humano.",
      "world": "Que las naciones vivan la igualdad que predica Pablo a los Corintios, de modo que la abundancia de unas remedie la escasez de otras, como el maná repartido sin que sobrara ni faltara.",
      "parish": "Que esta comunidad parroquial extienda la fe de la mujer que tocó el manto de Jesús y la confianza de Jairo, acercándose sin vergüenza a Cristo en busca de sanación.",
      "suffering": "Que los enfermos y los que sufren, como la hemorroísa sanada al instante y la hija de Jairo levantada con las palabras «talitha cumi», experimenten el poder de Cristo sobre toda enfermedad y muerte.",
      "dead": "Que los fieles difuntos, como la hija de Jairo a quien Jesús dijo «no está muerta, sino que duerme», despierten a la vida verdadera por la palabra del Señor.",
      "gospel": "Que como la mujer que dijo «si toco tan solo su manto, quedaré sana», nos acerquemos a Cristo con fe sencilla y perseverante en medio de la multitud que nos rodea.",
      "closing": "Desde lo hondo a ti grito, Señor; tú que dijiste a la hija de Jairo «talitha cumi, levántate», levanta también a los que hoy claman desde su propia oscuridad. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Eliseo que dejó sus bueyes y quemó el arado para seguir a Elías, no mire hacia atrás una vez puesta la mano en la obra del Reino.",
      "world": "Que las naciones vivan la libertad para la que Cristo nos liberó, como escribe Pablo a los Gálatas, dando fruto del Espíritu y no obras de la carne que dividen a los pueblos.",
      "parish": "Que esta comunidad parroquial no ponga excusas como los que Jesús encontró en el camino a Jerusalén, sino que responda sin demora al llamado de seguirlo.",
      "suffering": "Que los enfermos y los que sufren hallen en el Señor su heredad y su copa, como proclama el salmo, y sepan que él no los abandonará en la fosa.",
      "dead": "Que los fieles difuntos, que dieron fruto del Espíritu —amor, gozo y paz— en su vida, hereden ahora la plenitud que Pablo promete a quienes viven guiados por él.",
      "gospel": "Que como Eliseo que no volvió la vista atrás, pongamos nuestra mano en el arado del Reino sin distraernos con las despedidas y ataduras que nos retienen.",
      "closing": "Tú, Señor, eres mi heredad; tú que llamaste a Eliseo detrás del arado, llámanos también a nosotros a seguirte sin mirar atrás. Por Jesucristo nuestro Señor."
    }
  },
  "trinity6": {
    "A": {
      "church": "Que la Iglesia sea como Rebeca junto al pozo, pronta a servir generosamente al forastero, reconociendo en ese servicio la mano providente de Dios que guía su historia.",
      "world": "Que las naciones aprendan de Pablo que no siempre hacen el bien que quieren sino el mal que no quieren, y busquen humildemente en Cristo la liberación de ese conflicto interior.",
      "parish": "Que esta comunidad parroquial acoja la invitación de Jesús: «Venid a mí todos los que estáis cansados y agobiados», descansando en el yugo suave y la carga ligera del Señor.",
      "suffering": "Que los enfermos y los que sufren escuchen la voz que dice «Escúchame, hija; mira e inclina tu oído», y encuentren descanso para su alma en el Cristo manso y humilde de corazón.",
      "dead": "Que los fieles difuntos sean liberados del cuerpo de muerte que atormentaba a Pablo, y reciban por Jesucristo la liberación plena que él anhelaba con gemidos.",
      "gospel": "Que como los cansados y agobiados a quienes Jesús llama, aprendamos de él, que es manso y humilde de corazón, y hallemos descanso llevando su yugo, que es suave, y su carga, que es ligera.",
      "closing": "Escúchame, hija; mira e inclina tu oído, como pide el salmo; tú que llamas a los cansados y agobiados a tu descanso, alivia hoy nuestra carga. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como David ungido rey de todo Israel, sea signo de unidad entre pueblos antes divididos, congregando a todos bajo el único pastor que es Cristo.",
      "world": "Que las naciones descubran, como enseña Pablo, que la gracia de Dios basta y que su poder se realiza en la debilidad, y no en la fuerza de las armas.",
      "parish": "Que esta comunidad parroquial no repita el rechazo que sufrió Jesús en su propia tierra, sino que reciba con fe a quien anuncia la Palabra, por conocido o cercano que sea.",
      "suffering": "Que los enfermos y los que sufren experimenten que el poder de Cristo se realiza precisamente en la debilidad, como Pablo aprendió cuando el Señor le dijo «mi gracia te basta».",
      "dead": "Que los fieles difuntos, ciudadanos ya de la Jerusalén celeste que canta el salmo, entren en la ciudad de nuestro Dios donde él es grande y muy laudable.",
      "gospel": "Que no seamos como los paisanos de Jesús que no creyeron en el profeta de su tierra; que sepamos reconocer la presencia de Dios en lo cercano y lo cotidiano.",
      "closing": "Grande es el Señor y muy laudable en la ciudad de nuestro Dios; tú que dijiste a Pablo «mi gracia te basta», bástanos también a nosotros en nuestra debilidad. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia envíe, como Cristo envió a los setenta discípulos de dos en dos, obreros a una mies que sigue siendo mucha, confiando la victoria al Señor de la mies.",
      "world": "Que las naciones vivan la libertad para la que Cristo nos liberó, dando fruto del Espíritu y no obras de la carne que dividen a los pueblos, como escribe Pablo a los Gálatas.",
      "parish": "Que esta comunidad parroquial reciba con gozo a quienes anuncian que «el Reino de Dios está cerca», acogiéndolos como se acoge al mismo Cristo que los envía.",
      "suffering": "Que los enfermos y los que sufren hallen en el Señor su heredad y su copa, como proclama el salmo, confiando en los setenta enviados a sanar y a anunciar la paz.",
      "dead": "Que los fieles difuntos, cuyos nombres están escritos en los cielos como Jesús dijo a los setenta, gocen ya de esa alegría más honda que cualquier poder sobre el mal.",
      "gospel": "Que como los setenta discípulos enviados sin bolsa ni sandalias, confiemos más en la providencia de Dios que en nuestra propia provisión al anunciar que el Reino está cerca.",
      "closing": "Tú, Señor, eres mi heredad; tú que enviaste a los setenta de dos en dos a proclamar la paz, envíanos también a nosotros sin miedo a anunciar tu Reino. Por Jesucristo nuestro Señor."
    }
  },
  "trinity7": {
    "A": {
      "church": "Que la Iglesia nunca venda, como Esaú, su primogenitura espiritual por un plato de lentejas, sino que valore por encima de todo el don recibido en el bautismo.",
      "world": "Que las naciones sean tierra buena donde la palabra de Dios dé fruto abundante, como en la parábola del sembrador, y no camino, pedregal o zarzal que la ahoguen.",
      "parish": "Que esta comunidad parroquial sea buena tierra para la semilla de la Palabra, dando fruto al ciento, al sesenta o al treinta por uno, según la parábola que hoy escuchamos.",
      "suffering": "Que los enfermos y los que sufren hallen en la palabra de Dios una lámpara para sus pasos y una luz en su sendero, como proclama el salmo, en medio de la oscuridad de su dolor.",
      "dead": "Que los fieles difuntos, que vivieron según el Espíritu y no según la carne como enseña Pablo a los Romanos, cosechen ahora el fruto eterno de esa semilla sembrada en vida.",
      "gospel": "Que examinemos qué clase de tierra somos ante la semilla del sembrador: camino endurecido, pedregal superficial, zarzal de preocupaciones, o tierra buena que da fruto abundante.",
      "closing": "Tu palabra es una lámpara para mis pasos y una luz en mi sendero; tú que sembraste la semilla del Reino en nuestro corazón, haznos tierra buena que dé fruto abundante. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia entre en la nueva Jerusalén danzando de gozo como David ante el arca de la alianza, sin avergonzarse de expresar públicamente su fe y su alegría.",
      "world": "Que las naciones descubran que fueron elegidas en Cristo antes de la fundación del mundo, como escribe Pablo a los Efesios, y vivan a la altura de esa dignidad.",
      "parish": "Que esta comunidad parroquial no calle la verdad por miedo, recordando el precio que pagó Juan el Bautista ante Herodes y Herodías por denunciar la injusticia.",
      "suffering": "Que los enfermos y los que sufren sean, como el pueblo que anhela ver el rostro de Dios según el salmo, consolados con la certeza de que ese rostro se les mostrará.",
      "dead": "Que los fieles difuntos, entre ellos los mártires como Juan el Bautista degollado por decir la verdad, reciban la corona que se promete a quienes son fieles hasta la muerte.",
      "gospel": "Que el martirio de Juan el Bautista, decapitado por la venganza de Herodías, nos recuerde el precio de la fidelidad profética y nos anime a no callar la verdad por miedo o conveniencia.",
      "closing": "Señor, este es el pueblo que anhela ver tu rostro; tú que llenaste de gozo a David ante tu arca, y de valentía a Juan el Bautista ante Herodes, danos ese mismo valor. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia se examine, como Israel ante la plomada que Amós vio en visión, y no se aparte de la línea recta de la justicia y la verdad del Evangelio.",
      "world": "Que las naciones no repitan la injusticia que denunció Amós, enviado a profetizar contra la opresión, sino que hagan justicia a los pobres y necesitados como pide el salmo.",
      "parish": "Que esta comunidad parroquial actúe como el samaritano de la parábola, deteniéndose a curar las heridas del caído en el camino en vez de pasar de largo como el sacerdote y el levita.",
      "suffering": "Que los enfermos y los que sufren encuentren siempre un buen samaritano que se compadezca de ellos, les vende las heridas y pague por su cuidado, como en la parábola de hoy.",
      "dead": "Que los fieles difuntos, reconciliados con Dios por la sangre de la cruz de Cristo según Colosenses, entren en la paz plena que él vino a traer a todas las cosas.",
      "gospel": "Que preguntemos, como el doctor de la ley, «¿quién es mi prójimo?», y respondamos con obras, como el samaritano, sin excusarnos en la distancia, el prejuicio o la ocupación.",
      "closing": "Levántate, Dios, juzga la tierra; tú que enviaste a Amós a denunciar la injusticia, haznos samaritanos compasivos ante el caído en el camino. Por Jesucristo nuestro Señor."
    }
  },
  "trinity8": {
    "A": {
      "church": "Que la Iglesia, como Jacob al despertar de su sueño, reconozca «en verdad el Señor está en este lugar y yo no lo sabía», y encuentre en cada lugar una puerta del cielo.",
      "world": "Que las naciones escuchen el gemido de la creación entera con dolores de parto, como describe Pablo a los Romanos, y trabajen por su liberación y renovación.",
      "parish": "Que esta comunidad parroquial deje crecer juntos el trigo y la cizaña hasta la siega, como enseña la parábola, sin pretender arrancar antes de tiempo lo que solo Dios puede juzgar.",
      "suffering": "Que los enfermos y los que sufren repitan con el salmo «te alabo porque soy una maravilla», confiando en que Dios los conoce por completo aun en su fragilidad.",
      "dead": "Que los fieles difuntos, que gimieron con toda la creación esperando la redención del cuerpo según Pablo, brillen ya como el sol en el Reino de su Padre.",
      "gospel": "Que aceptemos la paciencia de Dios que deja crecer juntos el trigo y la cizaña hasta la siega, confiando el juicio final a quien solo él conoce el corazón de cada uno.",
      "closing": "Te alabo porque soy una maravilla; tú que te apareciste a Jacob en el camino y le prometiste tu compañía, acompáñanos también en nuestro propio camino. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia sea la casa que Dios promete edificar para siempre, como a David, cimentada no en la fuerza humana sino en la fidelidad eterna del Señor.",
      "world": "Que las naciones derriben el muro de separación y la enemistad que las divide, como Cristo derribó el muro entre judíos y gentiles según Efesios.",
      "parish": "Que esta comunidad parroquial tenga compasión de la multitud como ovejas sin pastor, según vio Jesús, y no deje a nadie sin el cuidado y la enseñanza que necesita.",
      "suffering": "Que los enfermos y los que sufren sean tocados aunque sea el borde del manto de Cristo, como la multitud que se agolpaba para tocarlo, y queden sanos por su poder.",
      "dead": "Que los fieles difuntos habiten para siempre en la casa que Dios prometió edificar a David, cantando eternamente las misericordias del Señor como proclama el salmo.",
      "gospel": "Que como Jesús que tuvo compasión de la multitud «porque andaban como ovejas sin pastor», nunca dejemos de mirar con misericordia a quienes carecen de guía y de consuelo.",
      "closing": "Cantaré eternamente las misericordias del Señor; tú que prometiste a David una casa eterna y derribaste el muro entre los pueblos, únenos en un solo rebaño. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como el canasto de fruta madura que vio Amós en visión, no deje pasar el tiempo favorable sino que responda con urgencia al hambre de oír la palabra del Señor.",
      "world": "Que las naciones no padezcan el hambre y la sed de la palabra de Dios que anunció Amós, sino que busquen con sinceridad la verdad que solo el Señor puede saciar.",
      "parish": "Que esta comunidad parroquial escoja, como María de Betania, la mejor parte: sentarse a los pies del Señor a escuchar su palabra, sin dejar que las muchas ocupaciones de Marta lo impidan.",
      "suffering": "Que los enfermos y los que sufren confíen en la misericordia de Dios por siempre jamás, como proclama el salmo, hallando en Cristo, imagen del Dios invisible, su consuelo.",
      "dead": "Que los fieles difuntos, reconciliados en el cuerpo de Cristo, imagen del Dios invisible según Colosenses, participen ya de la plenitud que en él habita.",
      "gospel": "Que como Marta, agobiada con tantos quehaceres, aprendamos de María a elegir la mejor parte: escuchar a los pies del Señor antes que perdernos en la ansiedad de lo urgente.",
      "closing": "Confío en la misericordia de Dios por siempre jamás; tú que elogiaste a María por escoger la mejor parte, enséñanos también a nosotros a sentarnos a tus pies. Por Jesucristo nuestro Señor."
    }
  },
  "trinity9": {
    "A": {
      "church": "Que la Iglesia, como Jacob que sirvió con paciencia por Raquel aunque fue engañado con Lía, persevere fielmente aun cuando el camino no resulte como esperaba.",
      "world": "Que las naciones descubran, como el tesoro escondido y la perla de gran precio de la parábola, que el Reino de Dios vale más que cualquier posesión o poder terreno.",
      "parish": "Que esta comunidad parroquial crezca como el grano de mostaza y fermente como la levadura en la masa, confiando en que las pequeñas semillas de fe transforman a toda la comunidad.",
      "suffering": "Que los enfermos y los que sufren se aferren a la certeza de Pablo de que nada, ni la tribulación ni la angustia, podrá separarlos del amor de Dios en Cristo Jesús.",
      "dead": "Que los fieles difuntos, a quienes nada en la muerte ni en la vida pudo separar del amor de Dios según Romanos, hallen ya el descanso que temían y esperaban.",
      "gospel": "Que como quien halla un tesoro escondido en un campo o una perla de gran precio, vendamos con alegría todo lo demás para hacer nuestro el Reino de los cielos.",
      "closing": "Dichosos los que temen al Señor; tú que en Cristo nos aseguraste que nada nos separará de tu amor, ayúdanos a vender todo por el tesoro escondido de tu Reino. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia no repita el pecado de David con Betsabé ni el envío de Urías a la muerte, sino que examine con honestidad sus propias faltas de poder y encubrimiento.",
      "world": "Que las naciones no digan en su corazón «no hay Dios», como el necio del salmo, sino que reconozcan la justicia divina por encima de todo abuso de poder.",
      "parish": "Que esta comunidad parroquial, arraigada y cimentada en el amor como ora Pablo a los Efesios, ponga sus pocos panes y peces en manos de Cristo para que él los multiplique.",
      "suffering": "Que los enfermos y los que sufren sean alimentados como la multitud junto al lago de Galilea, confiando en que Cristo puede multiplicar lo poco que tienen hasta que sobre.",
      "dead": "Que los fieles difuntos conozcan ya la anchura, la longitud, la altura y la profundidad del amor de Cristo que sobrepasa todo conocimiento, como ora Pablo a los Efesios.",
      "gospel": "Que la Iglesia, como los Apóstoles ante la multitud hambrienta junto al lago, no diga «despídelos» sino que ponga en manos de Cristo lo poco que tiene para que él lo multiplique.",
      "closing": "El necio dice en su corazón «no hay Dios»; tú que multiplicaste los panes y caminaste sobre el agua para calmar el miedo de tus discípulos, fortalece nuestra fe. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia sea fiel al esposo divino a pesar de sus propias infidelidades, como Oseas amó a Gómer, confiando en que el amor de Dios no se rinde ante nuestra inconstancia.",
      "world": "Que las naciones, muchas veces infieles como Gómer, experimenten la misericordia y la salvación que proclama el salmo, y vuelvan al Dios que nunca deja de amarlas.",
      "parish": "Que esta comunidad parroquial pida con insistencia como enseña el Padre Nuestro, confiando en que quien pide recibe, quien busca encuentra y a quien llama se le abre.",
      "suffering": "Que los enfermos y los que sufren llamen a la puerta del Padre con la confianza que Jesús enseña en el Evangelio, sabiendo que él no les dará una piedra en vez de pan.",
      "dead": "Que los fieles difuntos, reconciliados con Dios en la plenitud de Cristo según Colosenses, reciban la misericordia y la salvación que el salmo pide para el pueblo.",
      "gospel": "Que como enseña el Padre Nuestro, pidamos el pan de cada día y el perdón de las deudas con la confianza de un hijo, sabiendo que el Padre da el Espíritu Santo a quien se lo pide.",
      "closing": "Muéstranos, Señor, tu misericordia; danos tu salvación; tú que amaste a tu pueblo infiel como Oseas amó a Gómer, enséñanos a orar con la confianza de hijos. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "trinity10": {
    "A": {
      "church": "Que la Iglesia, como Jacob junto al Jaboc, luche en oración hasta el amanecer y no suelte a Dios hasta recibir su bendición; que los pastores no teman quedar heridos en la lucha por la fe.",
      "world": "Por las naciones, para que reconozcan que el pan no alcanza si no se comparte; que los gobernantes, ante multitudes hambrientas como las de Betsaida, no despidan a los pobres con las manos vacías.",
      "parish": "Que esta parroquia, al partir el pan de cada Eucaristía, descubra que lo poco puesto en las manos de Cristo se multiplica; que nadie se retire de aquí sin haber sido alimentado.",
      "suffering": "Por los que cargan una herida como la de Jacob en la cadera, marcados para siempre por una lucha; que hallen en Cristo, que multiplicó panes y peces, la fuerza para seguir caminando aunque cojeando.",
      "dead": "Por nuestros difuntos, que como Jacob recibieron un nombre nuevo al encontrarse con Dios cara a cara; que ahora contemplen ese rostro sin velos ni sombras.",
      "gospel": "Que ante la multitud cansada y hambrienta del desierto, la Iglesia no diga 'despídelos', sino que ofrezca lo poco que tiene para que Cristo lo bendiga y lo multiplique.",
      "closing": "Dios que en el desierto multiplicaste cinco panes y dos peces para saciar a las multitudes, multiplica también nuestra escasa entrega en abundancia para los hambrientos de hoy. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia tenga profetas como Natán, capaces de decir a los poderosos 'tú eres ese hombre', sin miedo a incomodar; que jerarcas y fieles acojan la corrección con el arrepentimiento de David.",
      "world": "Por quienes gobiernan las naciones, para que no repitan el pecado de David que tomó lo que no era suyo; que escuchen las voces proféticas que denuncian el abuso del poder.",
      "parish": "Por esta comunidad, un solo cuerpo con muchos miembros como enseña Pablo a los Efesios; que cada don recibido edifique a los demás en vínculo de paz.",
      "suffering": "Por los que llevan la culpa de un pecado escondido como David; que se atrevan a decir 'he pecado contra el Señor' y reciban, como él, la misericordia que perdona.",
      "dead": "Por los que ya no comen el pan que perece sino que esperan el pan de vida bajado del cielo; que Cristo, que se dio a sí mismo, los sacie para siempre.",
      "gospel": "Que quienes buscan a Cristo solo por el pan que se come y se acaba, aprendan con la muchedumbre de Cafarnaún a buscar el pan de vida que él mismo es.",
      "closing": "Dios que por boca de Natán llamaste a David al arrepentimiento y le creaste un corazón nuevo, crea también en nosotros un corazón limpio y renueva en nuestro interior un espíritu firme. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia sea como el padre de Oseas que enseñó a caminar a Efraín tomándolo de los brazos; que nunca deje de tender la mano a los hijos que se alejan tras otros dioses.",
      "world": "Por las naciones ricas, para que no repitan la insensatez del hombre que solo pensó en ensanchar sus graneros; que compartan sus bienes con los que nada tienen.",
      "parish": "Que esta parroquia no acumule graneros para sí misma, sino que sea rica ante Dios compartiendo lo que tiene con los que llaman a su puerta.",
      "suffering": "Por los que esta misma noche podrían escuchar 'te reclaman el alma', que no vivan atados a lo que poseen sino confiados en el Dios que los ama como a Efraín.",
      "dead": "Por nuestros difuntos, que ya no acumulan bienes en graneros terrenos; que hayan sido hallados ricos ante Dios y gocen ahora de la herencia que no perece.",
      "gospel": "Que ninguno de nosotros sea como el rico insensato que se dijo 'alma, tienes bienes para muchos años, descansa'; que vivamos ricos ante Dios y no solo para nosotros mismos.",
      "closing": "Dios que amaste a Efraín como un padre y lo llamaste desde Egipto, líbranos de poner nuestra confianza en graneros que no salvan y hazte tú nuestra única riqueza. Por Jesucristo nuestro Señor."
    }
  },
  "trinity11": {
    "A": {
      "church": "Que la Iglesia no repita el pecado de los hermanos de José, que vendieron por veinte monedas al que después los salvaría del hambre; que sepa reconocer a Cristo en los descartados de hoy.",
      "world": "Por las naciones, para que no vendan a los pobres como José fue vendido a los mercaderes; que los pueblos aprendan a predicar la buena noticia antes que a explotarse unos a otros.",
      "parish": "Que esta comunidad, como Pedro sobre las aguas, se atreva a caminar hacia Cristo aun con miedo a hundirse; que cuando flaqueemos, extienda la mano que nos sostiene.",
      "suffering": "Por los que hoy se sienten vendidos y traicionados como José por sus propios hermanos; que Dios convierta su cautiverio en camino de salvación para muchos.",
      "dead": "Por nuestros difuntos, que como Pedro clamaron 'Señor, sálvame' en la hora de su muerte; que la mano de Cristo los haya sostenido sobre las aguas del tránsito final.",
      "gospel": "Que ante el viento contrario y las olas de la vida, no apartemos los ojos de Cristo como hizo Pedro, sino que su mano nos sostenga cuando comencemos a hundirnos.",
      "closing": "Dios que enviaste a José a Egipto para preparar la salvación de su familia y tendiste tu mano a Pedro cuando se hundía en el mar, sostennos en las tempestades y saca bien de nuestros peores momentos. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia sea imitadora de Dios como hijos amados, según pide Pablo a los Efesios; que no deje que el sol se ponga sobre su enojo ni permita que la amargura divida a sus miembros.",
      "world": "Por los gobernantes de las naciones, para que aprendan de la tragedia de Absalón que la ambición desmedida por el poder termina en llanto; que David clamó '¡hijo mío!' incluso por el hijo que lo traicionó.",
      "parish": "Que esta parroquia sea pan vivo bajado del cielo los unos para los otros; que ningún miembro de esta familia sea tratado como enemigo, sino con la compasión de un padre que perdona.",
      "suffering": "Por los padres que, como David ante Absalón, lloran a hijos perdidos por la violencia o el distanciamiento; que hallen consuelo en Aquel que da su carne por la vida del mundo.",
      "dead": "Por nuestros difuntos, que ya comieron del pan vivo bajado del cielo; que ese pan que Cristo dio por la vida del mundo los levante en el último día.",
      "gospel": "Que no murmuremos como los judíos ante Jesús diciendo 'no es este el hijo de José', sino que reconozcamos en él el pan vivo bajado del cielo que da vida verdadera.",
      "closing": "Dios que escuchaste el clamor de David desde lo hondo de su dolor por Absalón, escucha también nuestro clamor y aliméntanos con el pan vivo que baja del cielo. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia responda a la invitación de Isaías 'venid, razonemos', dejando lavar sus pecados aunque sean como la escarlata; que peregrine con la fe de Abraham hacia la patria que Dios promete.",
      "world": "Por las naciones que ofrecen sacrificios vacíos mientras oprimen al huérfano y a la viuda, como denunció Isaías; que aprendan a hacer el bien y buscar la justicia antes que el rito sin corazón.",
      "parish": "Que esta comunidad sea el pequeño rebaño al que Cristo dice 'no temáis', ceñida y con las lámparas encendidas, esperando con vigilancia el regreso del Señor.",
      "suffering": "Por los que se sienten un pequeño rebaño frágil ante las dificultades; que escuchen la promesa de Cristo: 'no temáis, pequeño rebaño, porque el Padre ha querido daros el reino'.",
      "dead": "Por nuestros difuntos, peregrinos que como Abraham buscaron una patria mejor, la celestial; que Dios, que no se avergüenza de llamarse su Dios, les haya preparado ya esa ciudad.",
      "gospel": "Que estemos ceñidos y con las lámparas encendidas como siervos que aguardan a su señor, para que cuando Cristo llegue y llame, le abramos enseguida la puerta.",
      "closing": "Dios que invitas a razonar contigo aunque nuestros pecados sean como la escarlata, lávanos y vístenos de blanco, y haznos vigilantes como siervos que esperan a su Señor. Por Jesucristo nuestro Señor."
    }
  },
  "trinity12": {
    "A": {
      "church": "Que la Iglesia imite a José, que lloró en alta voz y dijo a sus hermanos 'yo soy José, ¿vive aún mi padre?', ofreciendo perdón donde hubo traición; que sea lugar de reconciliación entre hermanos separados.",
      "world": "Por las naciones divididas por antiguos rencores, para que como los hermanos de José se reconcilien y aprendan que lo que se pensó para mal, Dios puede convertirlo en bien.",
      "parish": "Que esta comunidad viva la dulzura del Salmo 133, hermanos que habitan unidos como bálsamo derramado; que ningún rencor guardado entre nosotros se convierta en muro.",
      "suffering": "Por los que, como la mujer cananea, claman con insistencia por sus hijos enfermos; que no se rindan ante el silencio aparente de Dios, sino que persistan hasta ser escuchados.",
      "dead": "Por nuestros difuntos, que en Cristo hallaron la mesa donde hasta los perritos comen las migajas que caen; que gocen ahora del banquete completo del Reino.",
      "gospel": "Que aprendamos de la fe insistente de la mujer cananea que no se dio por vencida ante el silencio de Jesús, hasta escuchar 'mujer, grande es tu fe'.",
      "closing": "Dios que en José convertiste la traición de sus hermanos en salvación para muchos y en la mujer cananea premiaste la fe perseverante, enséñanos a perdonar y a no cansarnos de pedir. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia pida como Salomón, no riquezas ni larga vida, sino un corazón que sepa escuchar y discernir el bien del mal; que sus pastores gobiernen al pueblo de Dios con esa misma sabiduría.",
      "world": "Por quienes gobiernan las naciones, para que como Salomón en Gabaón antepongan la sabiduría al poder y a la riqueza, y gobiernen buscando la justicia del pueblo que se les ha confiado.",
      "parish": "Que esta parroquia se alimente de la carne y la sangre de Cristo, verdadera comida y verdadera bebida, y así permanezca en él como él permanece en nosotros.",
      "suffering": "Por los que necesitan un corazón sabio para afrontar sus pruebas, como pidió Salomón; que Cristo, que se da como pan de vida, sea su alimento en la debilidad.",
      "dead": "Por nuestros difuntos, que se alimentaron de la carne y la sangre de Cristo en esta vida; que él los resucite, como prometió, en el último día.",
      "gospel": "Que no nos escandalicemos ante la palabra dura de Jesús 'mi carne es verdadera comida, mi sangre verdadera bebida', sino que la recibamos como fuente de vida eterna.",
      "closing": "Dios que diste a Salomón un corazón sabio y entendido, y que en Cristo nos das tu propia carne y sangre como alimento, concédenos la sabiduría de acoger este don sin escándalo. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, rodeada de la nube de testigos que menciona la carta a los Hebreos, corra con paciencia la carrera puestos los ojos en Jesús, autor y consumador de la fe.",
      "world": "Por las naciones sacudidas por divisiones y conflictos, recordando que Cristo vino a traer fuego a la tierra y no la paz fácil que ignora la injusticia; que el fuego del Evangelio purifique, no destruya.",
      "parish": "Que esta comunidad sea como los testigos que corrieron la carrera antes que nosotros; que despojada de todo peso y del pecado que nos asedia, corra con constancia hacia Cristo.",
      "suffering": "Por los que sufren division en sus propias familias a causa del Evangelio, como anunció Jesús; que hallen fuerza en la nube de testigos que ya terminó la carrera.",
      "dead": "Por nuestros difuntos, que forman ya la gran nube de testigos que nos rodea; que descansen habiendo corrido con paciencia la carrera que se les propuso.",
      "gospel": "Que sepamos interpretar las señales de los tiempos como se interpretan las nubes y el viento, y no seamos sordos a la palabra de Dios que es como fuego, según dijo Jeremías.",
      "closing": "Dios que rodeaste a Jesús de la nube de testigos y le hiciste correr la carrera hasta la cruz, fija nuestros ojos en él para que no desfallezcamos en el camino. Por Jesucristo nuestro Señor."
    }
  },
  "trinity13": {
    "A": {
      "church": "Que la Iglesia se edifique sobre la roca de la confesión de Pedro, 'tú eres el Cristo, el Hijo de Dios vivo', para que ni las puertas del infierno prevalezcan contra ella.",
      "world": "Por las naciones, recordando que Moisés fue salvado de las aguas del Nilo para liberar a su pueblo; que los líderes de hoy protejan a los niños amenazados como él lo fue.",
      "parish": "Que esta parroquia ofrezca su cuerpo como sacrificio vivo y santo, según pide Pablo a los Romanos, y no se conforme a este mundo sino que se transforme por la renovación de su mente.",
      "suffering": "Por los que hoy, como el niño Moisés en su cesta de juncos, dependen enteramente de la providencia de Dios y de manos ajenas para sobrevivir; que encuentren quien los rescate de las aguas.",
      "dead": "Por nuestros difuntos, que en vida confesaron con Pedro que Jesús es el Cristo; que sobre esa misma roca de fe descansen ahora para siempre.",
      "gospel": "Que respondamos como Pedro a la pregunta de Jesús 'y vosotros, ¿quién decís que soy yo?', confesando sin miedo que él es el Cristo, el Hijo del Dios vivo.",
      "closing": "Dios que salvaste a Moisés de las aguas del Nilo para liberar a tu pueblo y edificaste tu Iglesia sobre la confesión de Pedro, hazla firme como roca contra toda adversidad. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como el Templo que Salomón dedicó a Dios, sea casa de oración para todos los pueblos; que se revista de la armadura de Dios para resistir en el día malo.",
      "world": "Por las naciones, para que reconozcan, como oró Salomón, que ni los cielos más altos pueden contener a Dios; que ningún poder humano se erija en templo de sí mismo.",
      "parish": "Que esta comunidad se ciña con el cinturón de la verdad y se revista de la coraza de la justicia, como enseña Pablo, para resistir firme en medio de las pruebas del mundo.",
      "suffering": "Por los que, ante palabras difíciles de aceptar, se sienten tentados a marcharse como algunos discípulos; que con Pedro digan a Cristo 'tú tienes palabras de vida eterna'.",
      "dead": "Por nuestros difuntos, que habitaron las moradas amables del Señor de los ejércitos; que ahora more su alma para siempre en los atrios celestiales que anhelaba el salmista.",
      "gospel": "Que ante la palabra dura de Jesús que hizo alejarse a muchos discípulos, respondamos con Pedro: 'Señor, ¿a quién iremos? Tú tienes palabras de vida eterna'.",
      "closing": "Dios que llenaste de tu gloria el Templo que Salomón dedicó y hablas palabras de vida eterna a quienes no te abandonan, revístenos de tu armadura para permanecer fieles. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia ofrezca su pan al hambriento como pide Isaías, para que su luz nazca como la aurora; que sea reino inconmovible del que habla la carta a los Hebreos, agradecida y reverente.",
      "world": "Por las naciones, para que dejen de señalar con el dedo y hablar iniquidad, como reprocha Isaías, y en cambio sacien el hambre del afligido.",
      "parish": "Que esta comunidad, como la mujer encorvada dieciocho años que Jesús enderezó en sábado, sea liberada de todo lo que la mantiene inclinada e incapaz de mirar al cielo.",
      "suffering": "Por los que llevan dieciocho años, o toda una vida, encorvados por el sufrimiento como aquella mujer en la sinagoga; que Cristo los toque y los enderece hoy.",
      "dead": "Por nuestros difuntos, que ya no están encorvados por ninguna atadura; que hayan sido liberados por Cristo para alabar a Dios con la espalda erguida por la eternidad.",
      "gospel": "Que la Iglesia no se escandalice, como el jefe de la sinagoga, de que Cristo sane en sábado a los encorvados por el sufrimiento; que ponga siempre la compasión sobre la norma rígida.",
      "closing": "Dios compasivo y misericordioso, que enderezaste a la mujer encorvada dieciocho años y prometiste un reino inconmovible, endereza también nuestras espaldas cargadas y danos tu paz. Por Jesucristo nuestro Señor."
    }
  },
  "trinity14": {
    "A": {
      "church": "Que la Iglesia escuche, como Moisés ante la zarza que ardía sin consumirse, la voz de Dios que se revela 'Yo Soy el que Soy'; que no se acomode nunca al ídolo de la comodidad sino al fuego que llama y no destruye.",
      "world": "Por las naciones, para que el amor sea sin fingimiento como pide Pablo, aborreciendo el mal y venciéndolo con el bien, y no la violencia con más violencia.",
      "parish": "Que esta comunidad, como Moisés descalzo ante suelo sagrado, reconozca la presencia santa de Dios en medio de su vida ordinaria y responda 'aquí estoy'.",
      "suffering": "Por los que llevan una cruz como la que Cristo anunció a sus discípulos, 'el que quiera salvar su vida la perderá'; que descubran que perder por amor es hallar la vida verdadera.",
      "dead": "Por nuestros difuntos, que en su bautismo escucharon el llamado de Dios que se reveló a Moisés como 'Yo Soy'; que ahora contemplen sin velos a Aquel que siempre ha sido.",
      "gospel": "Que aceptemos, como pidió Jesús a sus discípulos tras el primer anuncio de la Pasión, tomar nuestra cruz y seguirlo, confiando en que quien pierde la vida por él la encuentra.",
      "closing": "Dios que te revelaste a Moisés desde la zarza ardiente como el que Eres, enciende también en nosotros un fuego que no se apague al tomar la cruz de cada día. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia sea hacedora de la palabra y no solo oyente, como advierte Santiago, cuidando de huérfanos y viudas en su aflicción y guardándose sin mancha del mundo.",
      "world": "Por las naciones, recordando el Cantar de los Cantares, 'levántate, amada mía, ya pasó el invierno'; que los pueblos en tiempo de frío y conflicto vean llegar la primavera de la paz.",
      "parish": "Que en esta parroquia no contamine lo que entra de fuera, sino que se cuide lo que sale del corazón, como enseñó Jesús contra la hipocresía de una religión solo de apariencias.",
      "suffering": "Por los que atraviesan un largo invierno de dolor; que escuchen la voz del Cantar que dice 'levántate, amada mía, y ven', anuncio de que el invierno no es para siempre.",
      "dead": "Por nuestros difuntos, que fueron hacedores de la palabra y no solo oyentes olvidadizos; que la corona de la vida prometida a los perseverantes sea ya suya.",
      "gospel": "Que examinemos nuestro propio corazón, de donde según Jesús salen los malos pensamientos que contaminan, y no juzguemos por lavarse o no las manos según la tradición.",
      "closing": "Dios que en el Cantar llamas a tu amada a levantarse porque el invierno ya pasó, levanta también nuestro corazón y purifícalo de toda hipocresía. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia practique la hospitalidad que recomienda la carta a los Hebreos, sin olvidar que algunos, sin saberlo, hospedaron ángeles; que reciba siempre al forastero como a Cristo mismo.",
      "world": "Por las naciones, para que no se acomoden en el puesto de honor como advierte Proverbios, sino que cedan el lugar a los últimos y a los que nada tienen.",
      "parish": "Que esta comunidad, al preparar sus banquetes, invite como pide Jesús a los pobres, lisiados, cojos y ciegos, y no solo a quienes puedan devolver la invitación.",
      "suffering": "Por los pobres, lisiados, cojos y ciegos que Jesús manda invitar a la mesa; que esta comunidad los reciba con el mismo honor que a los primeros puestos.",
      "dead": "Por nuestros difuntos, que practicaron la hospitalidad sin saber que quizás hospedaban ángeles; que ahora brillen como el sol en el reino de su Padre, según la promesa del Evangelio.",
      "gospel": "Que no busquemos los primeros puestos como los invitados de la parábola, sino que aprendamos de Jesús a ocupar el último lugar, para ser luego invitados a subir más arriba.",
      "closing": "Dios que recompensas a quienes hospedan al necesitado y llamas a los últimos a los primeros puestos, enséñanos la humildad de quien no busca ser honrado sino servir. Por Jesucristo nuestro Señor."
    }
  },
  "trinity15": {
    "A": {
      "church": "Que la Iglesia, congregada en el nombre de Cristo como enseña el Evangelio, sea lugar donde 'donde dos o tres se reúnen en mi nombre, allí estoy yo'; que practique la corrección fraterna con amor y no con juicio.",
      "world": "Por las naciones, recordando la Pascua instituida en Egipto, cordero inmolado y sangre en los dinteles; que los pueblos reconozcan al Cordero que libera de toda esclavitud.",
      "parish": "Que esta parroquia no deba a nadie nada, según Pablo, más que amarse unos a otros; que la corrección fraterna se practique en privado y con humildad, buscando ganar al hermano.",
      "suffering": "Por los que se sienten señalados o corregidos con dureza; que esta comunidad aprenda del Evangelio a buscar primero el diálogo a solas, con amor y no con humillación.",
      "dead": "Por nuestros difuntos, marcados como en la primera Pascua por la sangre del Cordero en el dintel de sus vidas; que la muerte haya pasado de largo sobre ellos hacia la vida eterna.",
      "gospel": "Que sepamos practicar la corrección fraterna como enseña Jesús, hablando primero a solas con quien nos ofende, buscando reconciliar antes que condenar.",
      "closing": "Dios que instituiste la Pascua para liberar a tu pueblo de la esclavitud y prometiste estar donde dos o tres se reúnen en tu nombre, únenos en amor fraterno. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia tenga una fe que se demuestre en obras, como enseña Santiago, sin favoritismos entre ricos y pobres en la asamblea; que no sea fe de palabra solamente.",
      "world": "Por las naciones, para que no exploten al pobre ni oigan con indiferencia el clamor del necesitado, como advierten los Proverbios; que los gobernantes protejan al débil.",
      "parish": "Que esta comunidad, como la sirofenicia que perseveró pidiendo por su hija, no se rinda en la oración insistente por los que ama; que aquí se digan también, con Jesús, 'effeta, ábrete'.",
      "suffering": "Por los sordos y mudos de nuestro tiempo, incapaces de escuchar o de expresar su dolor; que Cristo les diga 'effeta, ábrete' y se abran sus oídos y su lengua.",
      "dead": "Por nuestros difuntos, cuya fe se demostró en obras según pide Santiago; que ahora escuchen sin sordera y hablen sin atadura en la presencia de Dios.",
      "gospel": "Que aprendamos de la fe persistente de la mujer sirofenicia, que no se rindió ante la aparente negativa de Jesús, para alcanzar la sanación de los que amamos.",
      "closing": "Dios que dijiste 'effeta, ábrete' al sordomudo y abriste sus oídos y su lengua, abre también los nuestros para escuchar tu palabra y proclamarla sin miedo. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia elija la vida y la bendición, como propone Deuteronomio a Israel, y no la muerte y la maldición; que como Pablo ante Filemón, interceda por los esclavizados de hoy para que sean recibidos como hermanos.",
      "world": "Por las naciones, para que elijan entre la vida y la muerte, la bendición y la maldición, como Moisés propuso a Israel; que opten siempre por la vida.",
      "parish": "Que esta comunidad calcule el costo de seguir a Cristo, como quien antes de construir una torre se sienta a calcular los gastos; que ningún miembro comience el camino sin la firme decisión de perseverar.",
      "suffering": "Por los que cargan una cruz pesada como advierte el Evangelio, 'el que no carga su cruz no puede ser mi discípulo'; que no carguen solos ese peso, sino acompañados por esta comunidad.",
      "dead": "Por nuestros difuntos, que en vida eligieron la bendición y no la maldición según la exhortación de Moisés; que ahora gocen de la vida que eligieron con toda el alma.",
      "gospel": "Que consideremos con seriedad el costo de ser discípulos, como quien calcula antes de construir una torre, sabiendo que seguir a Cristo exige cargar la cruz de cada día.",
      "closing": "Dios que pusiste ante tu pueblo la vida y la muerte, la bendición y la maldición, ayúdanos siempre a elegir la vida y a cargar con alegría la cruz de cada día. Por Jesucristo nuestro Señor."
    }
  },
  "trinity16": {
    "A": {
      "church": "Que la Iglesia, como Israel al cruzar el Mar Rojo, cante con Miriam la victoria de Dios sobre toda esclavitud; que perdone setenta veces siete como Cristo enseñó, sin guardar la dureza del siervo despiadado.",
      "world": "Por las naciones, para que no se juzguen unas a otras, como advierte Pablo a los Romanos, sino que reconozcan que cada pueblo responde ante Dios, no ante sus vecinos.",
      "parish": "Que esta comunidad perdone de corazón como pide Cristo en la parábola del siervo despiadado, sin exigir de otros la deuda que Dios mismo nos ha perdonado a nosotros.",
      "suffering": "Por los que sienten el peso de una deuda impagable, como el siervo de la parábola; que experimenten la misericordia que Dios ya les ha concedido sin condiciones.",
      "dead": "Por nuestros difuntos, que cruzaron como Israel el mar de la muerte hacia la libertad definitiva; que canten ahora con Miriam el cántico de la victoria eterna.",
      "gospel": "Que perdonemos no siete veces, sino setenta veces siete como pide Jesús, recordando que a nosotros se nos ha perdonado una deuda mucho mayor que cualquier ofensa recibida.",
      "closing": "Dios que abriste el Mar Rojo para liberar a tu pueblo y nos enseñaste a perdonar sin límite como el rey misericordioso de la parábola, líbranos de toda dureza de corazón. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia escuche a la Sabiduría que clama en las calles, según Proverbios, y no se tape los oídos; que confiese con Pedro en Cesarea de Filipo que Jesús es el Cristo, dispuesta a tomar la cruz.",
      "world": "Por las naciones, para que dominen la lengua, ese fuego pequeño que Santiago compara con un incendio que arrasa un bosque entero; que las palabras de los líderes construyan y no destruyan.",
      "parish": "Que esta comunidad no rehúya la cruz cuando Cristo diga 'toma tu cruz y sígueme', y que como Pedro, corrija sus propias resistencias a aceptar el camino del Mesías sufriente.",
      "suffering": "Por los que cargan una cruz que no eligieron; que hallen fuerza en la confesión de Pedro, sabiendo que quien sigue a Cristo no camina solo en el sufrimiento.",
      "dead": "Por nuestros difuntos, que confesaron con Pedro que Jesús es el Cristo y cargaron su cruz cada día; que ahora reciban la vida que prometió a quien la pierde por él.",
      "gospel": "Que como Pedro en Cesarea de Filipo confesemos sin titubear que Jesús es el Cristo, y aceptemos también sus palabras exigentes: tomar la cruz y seguirlo cada día.",
      "closing": "Dios que pusiste tu Sabiduría a clamar en las calles y llamaste a Pedro a confesar que Jesús es el Cristo, danos oídos atentos y valentía para cargar la cruz. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia interceda como Moisés ante el becerro de oro, suplicando por un pueblo que se extravía; que celebre como el padre de la parábola cuando el hijo pródigo regresa, con fiesta y sin reproches.",
      "world": "Por las naciones tentadas a fabricarse becerros de oro, ídolos de riqueza y poder; que Dios, aplacado por la intercesión de los justos, les conceda tiempo de conversión.",
      "parish": "Que esta comunidad sea como el pastor que deja las noventa y nueve para buscar la oveja perdida, y como la mujer que enciende la lámpara y barre la casa hasta hallar la moneda extraviada.",
      "suffering": "Por los que se sienten como la oveja perdida en el desierto o la moneda caída entre el polvo; que esta parroquia no descanse hasta encontrarlos y traerlos de vuelta con alegría.",
      "dead": "Por nuestros difuntos, pecadores salvados como Pablo se reconoció el primero de ellos ante Timoteo; que Cristo, que vino a salvar a los pecadores, los haya recibido con la misma misericordia.",
      "gospel": "Que la Iglesia, como el pastor que deja las noventa y nueve para buscar la oveja perdida, no se resigne a perder a ninguno de sus hijos alejados.",
      "closing": "Dios que intercediste ante Moisés por un pueblo idólatra y te alegras más por una oveja recuperada que por noventa y nueve seguras, sal siempre a buscar a los que se han extraviado. Por Jesucristo nuestro Señor."
    }
  },
  "trinity17": {
    "A": {
      "church": "Que la Iglesia no murmure contra Dios en el desierto como el pueblo que añoraba las ollas de carne de Egipto, sino que confíe en el maná diario que Dios provee; que acoja a los últimos como al primero, sin envidia.",
      "world": "Por las naciones, para que abandonen la lógica de la queja constante del desierto y en cambio den gracias al Señor e invoquen su nombre entre los pueblos.",
      "parish": "Que en esta comunidad nadie envidie la generosidad de Dios hacia el otro, como los primeros obreros de la viña; que todos se alegren de que el Señor sea bueno con todos por igual.",
      "suffering": "Por los que llegan tarde a la viña de la vida, marginados o excluidos por mucho tiempo; que como los últimos obreros de la parábola reciban el mismo salario de la misericordia de Dios.",
      "dead": "Por nuestros difuntos, alimentados como Israel en el desierto con el maná del cielo; que hayan sido llamados a la viña del Señor y recibido el jornal de la vida eterna.",
      "gospel": "Que no protestemos como los primeros obreros de la viña ante la generosidad de Dios hacia los últimos, sino que nos alegremos de que 'los últimos serán primeros'.",
      "closing": "Dios que alimentaste a tu pueblo con maná en el desierto y pagas el mismo jornal a los últimos obreros que a los primeros, líbranos de la envidia y enséñanos tu generosidad. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia rechace la conspiración de los impíos contra el justo, de la que habla el libro de la Sabiduría; que sus pastores sean los primeros en hacerse servidores de todos, como pidió Jesús a los discípulos que discutían quién era el mayor.",
      "world": "Por las naciones, para que examinen de dónde vienen las guerras y los conflictos entre ellas, como pregunta Santiago, y descubran que nacen de las pasiones que combaten en su interior.",
      "parish": "Que en esta comunidad el que quiera ser primero se haga servidor de todos, como enseñó Jesús a los discípulos que discutían en el camino quién era el más grande.",
      "suffering": "Por los justos que hoy son perseguidos y acechados como advierte el libro de la Sabiduría; que el Señor sostenga su vida y no permita que la conspiración de los impíos prevalezca.",
      "dead": "Por nuestros difuntos, que en esta vida buscaron ser servidores de todos como pidió Jesús; que ahora sean los primeros en el reino donde el último es el mayor.",
      "gospel": "Que aprendamos de la corrección de Jesús a sus discípulos, que discutían en el camino quién era el mayor, para hacernos servidores de todos como él nos enseñó.",
      "closing": "Dios que sostienes la vida del justo acechado por los impíos y enseñaste a tus discípulos a ser servidores de todos, líbranos de toda ambición de poder. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia denuncie como Amós a los que alteran las balanzas y explotan al pobre 'comprando al desvalido por un par de sandalias'; que ore como pide Pablo a Timoteo por todos los hombres y por los que gobiernan.",
      "world": "Por las naciones, para que no impacienten el sábado esperando vender el trigo con medidas falsas, como denuncia Amós; que la justicia económica proteja al pobre de la explotación.",
      "parish": "Que esta comunidad use con astucia los bienes de este mundo para el Reino, como el administrador infiel de la parábola, sin servir jamás al dinero en lugar de a Dios.",
      "suffering": "Por los pobres que Amós describe comprados 'por un par de sandalias' y las balanzas falseadas contra ellos; que el Señor que levanta al pobre del polvo los saque de la miseria.",
      "dead": "Por nuestros difuntos, que no sirvieron al dinero sino a Dios, como enseñó Jesús que no se puede servir a dos señores; que hayan sido hallados fieles en lo poco para recibir lo mucho.",
      "gospel": "Que administremos con sabiduría los bienes que se nos han confiado, recordando la advertencia de Jesús de que no se puede servir a Dios y al dinero a la vez.",
      "closing": "Dios que levantas al pobre del polvo y condenas las balanzas falsas de los que explotan al desvalido, líbranos de servir al dinero y enséñanos a servirte solo a ti. Por Jesucristo nuestro Señor."
    }
  },
  "trinity18": {
    "A": {
      "church": "Que la Iglesia tenga los mismos sentimientos de Cristo, que se humilló hasta la muerte de cruz, como pide Pablo a los Filipenses; que no cuestione la autoridad de Jesús como hicieron los sumos sacerdotes.",
      "world": "Por las naciones sedientas como Israel en Masá y Meribá, para que no pongan a prueba a Dios con sus quejas, sino que confíen en que él puede hacer brotar agua de la roca.",
      "parish": "Que esta comunidad tenga los mismos sentimientos de Cristo Jesús, que no hizo alarde de su categoría de Dios sino que se rebajó hasta la muerte y muerte de cruz.",
      "suffering": "Por los que claman como Israel en el desierto '¿hay o no hay Señor entre nosotros?'; que descubran, en medio de su sed, que Dios hace brotar agua de la roca más dura.",
      "dead": "Por nuestros difuntos, que en el bautismo recibieron a Cristo que se humilló hasta la muerte para exaltarlos con él; que ahora toda rodilla se doble ante ellos en la gloria del Padre.",
      "gospel": "Que como el hijo que primero dijo no y luego fue a trabajar la viña, nuestras obras hablen más que nuestras palabras a la hora de responder al llamado de Dios.",
      "closing": "Dios que hiciste brotar agua de la roca en Masá y Meribá y exaltaste a Cristo por haberse humillado hasta la cruz, danos su mismo sentir humilde. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia no impida a nadie hacer el bien en nombre de Cristo, recordando que 'el que no está contra nosotros está por nosotros'; que ore unos por otros como pide Santiago para ser sanados.",
      "world": "Por las naciones, para que el Espíritu que se repartió sobre los setenta ancianos en el desierto siga inspirando a los que gobiernan a compartir el peso del liderazgo sin celos.",
      "parish": "Que en esta comunidad nadie sea ocasión de pecado para los pequeños, según la advertencia radical de Jesús de cortar la mano o el pie antes que hacer tropezar a un niño.",
      "suffering": "Por los enfermos que necesitan la oración eficaz del justo, como enseña Santiago; que los ancianos de la Iglesia los unjan con aceite en el nombre del Señor.",
      "dead": "Por nuestros difuntos, sobre quienes como en los setenta ancianos del desierto reposó el Espíritu de Dios; que hayan entrado en la vida donde nada les es ya ocasión de pecado.",
      "gospel": "Que no seamos como Josué, que quiso impedir a Eldad y Medad profetizar; que reconozcamos con Jesús que 'el que no está contra nosotros está por nosotros'.",
      "closing": "Dios que repartiste tu Espíritu sobre los setenta ancianos y escuchas la oración eficaz del justo, líbranos de estorbar el bien que otros hacen en tu nombre. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Jeremías que compró un campo en Anatot mientras la ciudad estaba sitiada, sea signo de esperanza aun en tiempos de ruina; que no ame el dinero, raíz de todos los males según Pablo a Timoteo.",
      "world": "Por las naciones sitiadas por la guerra o la crisis, para que como el campo que Jeremías compró en medio del asedio, crean que 'todavía se comprarán casas, campos y viñas en esta tierra'.",
      "parish": "Que esta comunidad no sea indiferente como el rico Epulón ante Lázaro cubierto de llagas a su puerta; que reconozca a Cristo en el pobre que yace junto a nuestro umbral.",
      "suffering": "Por los que como Lázaro yacen cubiertos de llagas junto a la puerta del rico, ignorados y hambrientos; que esta comunidad no aparte la mirada de ellos como hizo Epulón.",
      "dead": "Por nuestros difuntos, que confiaron como Jeremías en la esperanza de un futuro más allá del asedio y la ruina; que ahora descansen en el seno de Abraham junto a Lázaro.",
      "gospel": "Que no seamos indiferentes como el rico Epulón que ni siquiera reparó en Lázaro a su puerta, sino que abramos los ojos al pobre que sufre junto a nosotros, antes de que sea demasiado tarde.",
      "closing": "Dios que llenaste de esperanza a Jeremías cuando compró un campo en medio del asedio y advertiste contra la indiferencia del rico Epulón, abre nuestros ojos al pobre que está a nuestra puerta. Por Jesucristo nuestro Señor."
    }
  },
  "trinity19": {
    "A": {
      "church": "Que la Iglesia, como Israel al pie del Sinaí, reciba con temor y amor los mandamientos de Dios; que sus pastores los enseñen sin componendas; y que ningún viñador homicida se apodere de la viña del Señor.",
      "world": "Que las naciones escuchen el mandamiento de no matar y de no codiciar los bienes ajenos; que los gobernantes administren justicia como quien rendirá cuentas al dueño de la viña; y que cesen la violencia y el robo entre los pueblos.",
      "parish": "Que esta comunidad guarde los mandamientos escritos en el Sinaí como camino de libertad y no de esclavitud; y que, como Pablo, consideremos todo lo demás basura con tal de ganar a Cristo.",
      "suffering": "Que los que sufren experimenten que el Señor tiene palabras de vida eterna; que los que han sido despojados por otros como los viñadores despojaron al dueño, hallen justicia; y que el Espíritu conforte a los débiles.",
      "dead": "Que los difuntos, que corrieron hacia la meta como Pablo hacia el premio de la vocación celestial, descansen ya alcanzados por Cristo Jesús.",
      "gospel": "Que la parábola de los viñadores homicidas nos advierta contra el desprecio de los enviados de Dios; que reconozcamos al Hijo cuando venga a pedirnos fruto; y que la viña del Reino nos sea confiada con fidelidad.",
      "closing": "Señor Dios, que diste tus mandamientos como camino de vida y enviaste a tu Hijo a la viña que rechazamos; enséñanos a estimar todo lo demás como pérdida con tal de ganar a Cristo. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, esposa de Cristo formada de su costado como Eva del costado de Adán, viva la unidad que Dios quiso desde el principio; y que sus ministros custodien el don del matrimonio como imagen sagrada.",
      "world": "Que las naciones reconozcan que no es bueno que el ser humano esté solo, y tejan redes de comunidad y ayuda mutua; que los gobernantes protejan a las familias y a los pequeños que Jesús acogió en sus brazos.",
      "parish": "Que esta congregación acoja a los niños como Cristo los acogió, sin impedirles llegar a él; y que los esposos entre nosotros vivan la unión de una sola carne con fidelidad y ternura.",
      "suffering": "Que los que sufren soledad encuentren en la Iglesia la ayuda que Dios prometió a Adán; que los matrimonios heridos hallen sanación; y que los niños abandonados o maltratados sean protegidos y consolados.",
      "dead": "Que los difuntos, coronados de gloria y honor como dice el salmo, entren en el descanso que Cristo, coronado por sus sufrimientos, les ha ganado a precio de su sangre.",
      "gospel": "Que recibamos el Reino de Dios como niños, con sencillez y confianza; que ninguna dureza de corazón nos impida acoger la voluntad de Dios sobre el matrimonio y la familia; y que Cristo nos tome en sus brazos y nos bendiga.",
      "closing": "Señor Dios, que desde el principio hiciste al varón y a la mujer para que fueran una sola carne y que abres tus brazos a los niños; bendice nuestras familias y guarda nuestra unidad. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia no olvide, como advierte Lamentaciones, cómo Jerusalén desolada lloró su ruina; que avivemos el don de Dios recibido por la imposición de manos, sin avergonzarnos del testimonio del Señor.",
      "world": "Que las naciones que hoy se lamentan como la ciudad solitaria y viuda de Lamentaciones hallen consuelo y reconstrucción; y que los gobernantes no abandonen a los pueblos afligidos por la guerra y el destierro.",
      "parish": "Que esta comunidad, siervos que solo cumplimos nuestro deber, sirvamos sin buscar mérito ni reconocimiento; y que digamos con los apóstoles: auméntanos la fe.",
      "suffering": "Que los que se sientan junto a los ríos de Babilonia llorando su exilio hallen consuelo; que los enfermos y afligidos reciban la fuerza, el amor y la templanza que Dios nos ha dado, no un espíritu de cobardía.",
      "dead": "Que los difuntos, que guardaron el depósito de la fe hasta el fin, lo hallen custodiado por Dios para aquel día; y que descansen de sus lamentos en la paz eterna.",
      "gospel": "Que aunque nuestra fe sea como un grano de mostaza, confiemos en que puede arrancar árboles de raíz; que sirvamos a Dios no por mérito sino porque somos siervos que cumplimos lo que se nos manda; y que nunca olvidemos las obras del Señor.",
      "closing": "Señor Dios, que consuelas a Jerusalén desolada y avivas en nosotros el don recibido en el bautismo; auméntanos la fe y haznos siervos fieles de tu voluntad. Por Jesucristo nuestro Señor."
    }
  },
  "trinity20": {
    "A": {
      "church": "Que la Iglesia no se forje becerros de oro cuando el Señor parece tardar; que sus pastores intercedan como Moisés ante el pecado del pueblo; y que todos los bautizados vengan al banquete de bodas del Reino ataviados con el traje de fiesta.",
      "world": "Que las naciones no adoren dioses fabricados por sus propias manos, ni el oro ni el poder; que los gobernantes recuerden lo verdadero, lo honesto y lo justo de que habla Pablo; y que reine la concordia entre los pueblos.",
      "parish": "Que esta comunidad piense en todo lo que es verdadero, respetable, justo, puro y amable, como exhorta la carta a los Filipenses; y que nadie de nosotros se presente al banquete del Señor sin el traje de la gracia.",
      "suffering": "Que los que sufren hallen la paz de Dios que sobrepasa todo entendimiento, guardando sus corazones y sus pensamientos en Cristo Jesús; y que ninguno sea dejado fuera, en las tinieblas, sin consuelo.",
      "dead": "Que los difuntos, invitados al banquete de bodas del Cordero, entren revestidos por la gracia de Cristo en el gozo eterno que no conoce fin.",
      "gospel": "Que la parábola del banquete de bodas nos convoque desde los caminos y las encrucijadas a la fiesta del Reino; que no despreciemos la invitación del Rey; y que nos revistamos del traje de bodas que es Cristo mismo.",
      "closing": "Señor Dios, que nos invitas al banquete de tu Reino y aborreces los ídolos que fabricamos con nuestras manos; vístenos con el traje de la gracia y guarda nuestros corazones en tu paz. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia busque el bien y no el mal, como clama Amós, para que el Señor esté verdaderamente con ella; que la palabra de Dios, viva y eficaz como espada de dos filos, penetre y purifique el corazón de sus ministros.",
      "world": "Que las naciones no pisoteen al pobre ni tuerzan en los tribunales el derecho del necesitado, como denuncia Amós; y que los gobernantes busquen el bien, aborrezcan el mal y establezcan la justicia en las puertas de sus ciudades.",
      "parish": "Que esta congregación nos acerquemos con confianza al trono de la gracia, para alcanzar misericordia y hallar gracia en el momento oportuno; y que ningún apego a las riquezas nos impida seguir a Cristo como al joven rico.",
      "suffering": "Que los que sufren pobreza e injusticia sean escuchados por Aquel ante quien nada de lo creado está oculto; que hallen ayuda oportuna en su necesidad; y que nadie tuerza su derecho en las puertas de la ciudad.",
      "dead": "Que los difuntos, que dejaron casas, hermanos o riquezas por Cristo, reciban ahora el ciento por uno y la vida eterna que él prometió a quien todo lo deja por su nombre.",
      "gospel": "Que ante el llamado del joven rico a venderlo todo y seguir a Cristo, no nos vayamos tristes por nuestras posesiones; que recordemos que para los hombres es imposible, mas no para Dios; y que soltemos lo que nos impide entrar en el Reino.",
      "closing": "Señor Dios, cuya palabra es viva y eficaz y penetra el corazón; líbranos del apego a las riquezas que aparta al joven rico de tu llamado, y hazte camino donde a nosotros nos parece imposible. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Naamán, se despoje de su orgullo y se sumerja en las aguas sencillas del Jordán que Dios le ofrece; que sus ministros no encadenen la Palabra, aunque ellos mismos sufran cadenas por el Evangelio.",
      "world": "Que las naciones acojan al extranjero como Naamán el sirio fue acogido y sanado en Israel; que los gobernantes no desprecien los remedios sencillos de Dios por buscar soluciones grandiosas y vanas.",
      "parish": "Que esta comunidad sea, como el único leproso samaritano que volvió, un pueblo agradecido que regresa a dar gracias a Dios en voz alta; y que si morimos con Cristo, vivamos también con él.",
      "suffering": "Que los enfermos como Naamán hallen su Jordán de sanación en las aguas del bautismo y en la misericordia de Dios; que los diez leprosos de hoy sean limpiados en cuerpo y alma; y que ninguno olvide volver a dar gracias.",
      "dead": "Que los difuntos, que padecieron con Cristo, resuciten también con él a la vida gloriosa, pues el temor del Señor, principio de la sabiduría, los condujo a puerto seguro.",
      "gospel": "Que de los diez leprosos sanados no seamos de los nueve que siguieron su camino, sino del samaritano que volvió a postrarse y a dar gracias; que la fe que nos salva se exprese siempre en gratitud.",
      "closing": "Señor Dios, que sanaste a Naamán en las aguas del Jordán y a los diez leprosos con tu palabra; concédenos ser como el samaritano agradecido que vuelve a alabarte. Por Jesucristo nuestro Señor."
    }
  },
  "trinity21": {
    "A": {
      "church": "Que la Iglesia, como Moisés escondido en la hendidura de la roca, contemple la bondad de Dios que pasa aunque no pueda ver su rostro; que dé al César lo que es del César y a Dios lo único que verdaderamente le pertenece: el corazón entero.",
      "world": "Que las naciones tiemblen ante el Señor que es rey y no ante los poderes de este mundo; que los gobernantes reconozcan los límites legítimos de su autoridad, sin usurpar lo que solo a Dios corresponde.",
      "parish": "Que esta comunidad imite a los tesalonicenses, cuya fe se propagó por todas partes; y que discernamos con sabiduría qué pertenece al César y qué pertenece a Dios en nuestra propia vida.",
      "suffering": "Que los que sufren, como Moisés que solo pudo ver la espalda de Dios y no su rostro, confíen en que la bondad divina pasa junto a ellos aunque no la vean plenamente; que hallen alivio en la tribulación.",
      "dead": "Que los difuntos, cuya moneda llevaba la imagen de este mundo, entren ahora en la posesión de Aquel cuya imagen llevaban grabada en el alma desde el bautismo.",
      "gospel": "Que la pregunta sobre el tributo al César no nos distraiga de la pregunta verdadera: qué llevamos grabado en el corazón; que demos a Dios lo que lleva su imagen y semejanza, que somos nosotros mismos.",
      "closing": "Señor Dios, que dejaste ver tu bondad a Moisés en la hendidura de la roca y reclamas para ti lo que lleva tu imagen; graba en nosotros tu semejanza y acompáñanos en toda tribulación. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, siguiendo al Siervo sufriente herido por nuestras rebeliones, entienda que el Hijo del hombre no vino a ser servido sino a servir; que sus pastores rechacen los primeros puestos que pidieron Santiago y Juan.",
      "world": "Que las naciones dejen de buscar sentarse a la derecha y a la izquierda del poder, y aprendan del Siervo que cargó nuestras culpas y por cuyas llagas fuimos curados; que los gobernantes sirvan y no se sirvan de su pueblo.",
      "parish": "Que esta comunidad no busque los primeros puestos como Santiago y Juan, sino que beba el cáliz del servicio que Cristo bebió; y que hallemos gracia y ayuda oportuna en el trono de la misericordia.",
      "suffering": "Que los que sufren se reconozcan en el Siervo herido, molido por nuestros pecados, y hallen en sus llagas la fuente de su propia curación; y que el Señor los acompañe en la tribulación.",
      "dead": "Que los difuntos, redimidos por el Siervo que entregó su vida en sacrificio por el pecado, vean el fruto del trabajo de su alma y se sacien de su gloria.",
      "gospel": "Que ante la petición de Santiago y Juan de sentarse en los primeros puestos, aprendamos que la grandeza en el Reino consiste en servir a los demás; que bebamos el cáliz de Cristo con humildad.",
      "closing": "Señor Dios, que en tu Siervo cargaste nuestras culpas y en tu Hijo nos mostraste que servir es reinar; enséñanos a beber su cáliz y a servir como él sirvió. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como Jacob junto al Yaboc, luche con Dios hasta el amanecer y salga cojeando pero bendecida; que sus predicadores insistan a tiempo y a destiempo, como pide Pablo a Timoteo, sin cansarse jamás.",
      "world": "Que las naciones, como la viuda insistente ante el juez injusto, no se cansen de clamar por justicia; y que los gobernantes hagan justicia pronto a quienes claman día y noche, sin la dureza del juez de la parábola.",
      "parish": "Que esta comunidad persevere en la oración sin desfallecer, como enseña la parábola de la viuda; y que nuestro auxilio, como canta el salmo, venga siempre del Señor que hizo el cielo y la tierra.",
      "suffering": "Que los que sufren luchen como Jacob junto al vado de Yaboc hasta obtener la bendición; que el Señor no permita que su pie resbale y guarde su salida y su entrada, ahora y para siempre.",
      "dead": "Que los difuntos, que lucharon como Jacob y guardaron la fe como Pablo instruyó a Timoteo, reciban ya la bendición del nuevo nombre y el descanso definitivo junto a Dios.",
      "gospel": "Que la parábola de la viuda insistente nos enseñe a orar siempre sin desanimarnos; que si un juez injusto acaba haciendo justicia, cuánto más nuestro Padre hará justicia a sus escogidos que claman día y noche.",
      "closing": "Señor Dios, que bendijiste a Jacob tras su lucha nocturna y prometiste hacer justicia a quienes claman sin desanimarse; sostennos en la oración perseverante. Por Jesucristo nuestro Señor."
    }
  },
  "trinity22": {
    "A": {
      "church": "Que la Iglesia, como Moisés que vio la tierra prometida desde el monte Nebo sin poder entrar en ella, confíe en que otros continuarán la obra que Dios le encomendó; que sus ministros amen a Dios y al prójimo como el mandamiento mayor exige.",
      "world": "Que las naciones recuerden que en todas las edades el Señor ha sido nuestro refugio, antes de que naciesen los montes; y que los gobernantes gobiernen sabiendo que sus días, como los de Moisés, están contados por Dios.",
      "parish": "Que esta comunidad aprenda a contar bien sus días para adquirir un corazón sabio, como pide el salmo noventa; y que resuma toda la Ley y los Profetas en amar a Dios con todo el corazón y al prójimo como a nosotros mismos.",
      "suffering": "Que los que sufren hallen en el Señor su refugio de generación en generación, como Moisés lo halló al final de su vida; que la brevedad de nuestros días no nos aparte de la esperanza en la misericordia divina.",
      "dead": "Que los difuntos, como Moisés que contempló la tierra prometida sin entrar en ella en esta vida, entren ya plenamente en la herencia eterna que Dios les tenía reservada.",
      "gospel": "Que el mandamiento mayor —amar a Dios con todo el corazón, con toda el alma y con toda la mente, y al prójimo como a nosotros mismos— sea la medida de toda nuestra vida y de toda ley.",
      "closing": "Señor Dios, que has sido nuestro refugio en todas las edades y nos diste en Moisés la Ley y en tu Hijo su cumplimiento en el amor; enséñanos a contar bien nuestros días y a amarte sobre todas las cosas. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia reúna a los dispersos que anuncia Jeremías, entre ellos ciegos y cojos, mujeres embarazadas y parturientas, en una gran asamblea de regreso a casa; que sus ministros clamen como Bartimeo: Hijo de David, ten compasión.",
      "world": "Que las naciones consuelen a los que lloran, como promete Jeremías, y guíen a los dispersos por caminos llanos junto a arroyos de agua; y que los gobernantes no dejen a nadie mendigando junto al camino como el ciego Bartimeo.",
      "parish": "Que esta comunidad, como Bartimeo, grite sin callarse hasta que Cristo se detenga a escucharnos; y que el Señor, que ha estado grande con nosotros, nos llene de la misma alegría que canta el salmo del regreso del destierro.",
      "suffering": "Que los ciegos, los cojos y los que sufren como Bartimeo junto al camino sean escuchados por Cristo que se detiene ante su clamor; que el Señor los consuele y los guíe por sendas llanas, sin que tropiecen.",
      "dead": "Que los difuntos, reunidos por Dios de entre los confines de la tierra como anuncia Jeremías, sean guiados a las fuentes de aguas vivas y no tropiecen jamás en el camino a la vida eterna.",
      "gospel": "Que el clamor del ciego Bartimeo, arrojando su manto para correr hacia Cristo, sea también nuestro clamor de fe; que Jesús se detenga también por nosotros y nos pregunte qué queremos que haga.",
      "closing": "Señor Dios, que reúnes a los dispersos entre ellos ciegos y cojos, y te detuviste ante el clamor de Bartimeo; abre nuestros ojos y guíanos por sendas llanas hasta ti. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia reciba el Espíritu que Dios promete derramar sobre toda carne por medio de Joel, para que hijos e hijas profeticen; que sus ministros, como Pablo, puedan decir al final: he peleado la buena batalla, he guardado la fe.",
      "world": "Que las naciones vean cumplida la promesa de Joel de lluvias tempranas y tardías que devuelven la fertilidad a la tierra devastada por la langosta; y que los gobernantes actúen con la humildad del publicano y no con la soberbia del fariseo.",
      "parish": "Que esta comunidad ore como el publicano, golpeándose el pecho y diciendo: Dios mío, ten compasión de mí que soy pecador; y que ninguno se exalte como el fariseo que confiaba en su propia justicia.",
      "suffering": "Que los que sufren reciban el Espíritu derramado sobre toda carne que promete Joel, sin distinción de edad, sexo o condición; y que como el publicano hallen misericordia al reconocerse necesitados de Dios.",
      "dead": "Que los difuntos, que como Pablo pelearon la buena batalla y guardaron la fe hasta el final, reciban ya la corona de justicia reservada para quienes esperan con amor la manifestación del Señor.",
      "gospel": "Que la parábola del fariseo y el publicano nos enseñe que quien se enaltece será humillado y quien se humilla será enaltecido; que oremos con la sinceridad del publicano y no con la vanidad del fariseo.",
      "closing": "Señor Dios, que derramas tu Espíritu sobre toda carne y escuchas al pecador que se golpea el pecho; ten compasión de nosotros y concédenos pelear la buena batalla hasta el fin. Por Jesucristo nuestro Señor."
    }
  },
  "trinity23": {
    "A": {
      "church": "Que la Iglesia, como el arca que detuvo las aguas del Jordán para que el pueblo pasara en seco, abra camino a los que buscan a Dios; que sus ministros no impongan cargas pesadas a los demás mientras ellos mismos no las tocan, como los escribas y fariseos.",
      "world": "Que las naciones crucen sus propios Jordanes de división y conflicto, guiadas por la justicia como Israel fue guiado por el arca de la alianza; y que los gobernantes no busquen los primeros puestos ni los títulos de honor, sino el servicio humilde.",
      "parish": "Que esta comunidad no busque saludos en las plazas ni el título de maestro, recordando que uno solo es nuestro Maestro y todos somos hermanos; y que quien se enaltece entre nosotros aprenda a humillarse.",
      "suffering": "Que los que sufren experimenten, como Israel al cruzar el Jordán en seco, que Dios abre caminos donde parece no haberlos; que el Señor sacie al alma sedienta y colme de bienes al hambriento, como canta el salmo.",
      "dead": "Que los difuntos, que cruzaron ya su Jordán hacia la tierra prometida, descansen en la ribera definitiva donde no hay más ríos que atravesar ni cargas pesadas que llevar.",
      "gospel": "Que la denuncia de Jesús contra la hipocresía de los escribas y fariseos, que dicen y no hacen, nos examine a nosotros mismos; que practiquemos lo que enseñamos y nos humillemos para ser enaltecidos por Dios.",
      "closing": "Señor Dios, que abriste las aguas del Jordán para tu pueblo y denuncias la hipocresía de quien impone cargas que no lleva; líbranos de la soberbia y enséñanos el servicio humilde. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia aprenda la lealtad de Rut, que dijo a Noemí: donde tú vayas iré yo y tu pueblo será mi pueblo; que sus ministros, como el escriba del Evangelio, no estén lejos del Reino de Dios por amar a Dios y al prójimo de verdad.",
      "world": "Que las naciones acojan al extranjero como Noemí acogió la lealtad de Rut la moabita; y que los gobernantes protejan a las viudas, los huérfanos y los forasteros, como alaba el salmo ciento cuarenta y seis.",
      "parish": "Que esta comunidad viva la lealtad de Rut hacia Noemí como modelo de fidelidad entre nosotros; y que ninguno de nosotros esté lejos del Reino de Dios, sino cerca por el amor verdadero a Dios y al prójimo.",
      "suffering": "Que los que sufren viudez, migración o desarraigo, como Rut y Noemí, encuentren comunidades que los acojan; que el Señor sostenga al huérfano y a la viuda, como proclama el salmo.",
      "dead": "Que los difuntos, purificados por la sangre de Cristo que limpia la conciencia de las obras muertas, sirvan ya al Dios vivo en la liturgia eterna del cielo.",
      "gospel": "Que al escriba que preguntó por el mandamiento mayor se le respondió que amar a Dios con todo el corazón y al prójimo como a uno mismo vale más que todos los holocaustos; que también nosotros no estemos lejos del Reino de Dios.",
      "closing": "Señor Dios, que bendijiste la lealtad de Rut hacia Noemí y acercas al Reino a quien ama de verdad; danos un corazón fiel como el de Rut y sabio como el del escriba. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como el profeta Habacuc en su atalaya esperando la respuesta de Dios, viva por la fe, pues el justo vivirá por ella; que sus ministros anuncien con Zaqueo que hoy ha entrado la salvación en esta casa.",
      "world": "Que las naciones, atormentadas por la violencia y la injusticia que denuncia Habacuc, esperen la visión que a su tiempo se cumplirá sin tardar; y que los gobernantes actúen con la rectitud del Señor cuyas sentencias son justas.",
      "parish": "Que esta comunidad, como Zaqueo subido al sicómoro, busque ver a Jesús por encima de todo obstáculo; y que recibamos al Señor en nuestra casa con la misma alegría con que Zaqueo lo recibió.",
      "suffering": "Que los que sufren violencia, pleitos y discordia, como lamenta Habacuc, hallen consuelo en que el justo vivirá por su fe; que como Zaqueo, hallen en Cristo la salvación que entra hoy en su propia casa.",
      "dead": "Que los difuntos, que vivieron por la fe como enseña Habacuc, sean juzgados dignos de la vocación con que Dios los llamó y hallen en Cristo la gloria prometida.",
      "gospel": "Que el episodio de Zaqueo, subido al sicómoro para ver a Jesús, nos enseñe que nadie está demasiado perdido para que el Señor lo busque; que también en nuestra casa entre hoy la salvación.",
      "closing": "Señor Dios, que dijiste al justo que vivirá por la fe y entraste en la casa de Zaqueo trayendo la salvación; entra también en nuestra casa y en nuestra vida hoy. Por Jesucristo nuestro Señor."
    }
  },
  "trinity24": {
    "A": {
      "church": "Que la Iglesia, reunida en su propio Siquem, escoja hoy a quién servir, como exhortó Josué al pueblo; que sus ministros mantengan las lámparas encendidas con aceite de reserva, como las vírgenes prudentes de la parábola.",
      "world": "Que las naciones escojan servir al Señor y no a los dioses extraños de sus antepasados, como propuso Josué a Israel; y que los gobernantes velen por sus pueblos con la previsión de las vírgenes prudentes.",
      "parish": "Que esta comunidad diga con Josué: nosotros serviremos al Señor; y que ninguno de nosotros sea hallado como las vírgenes necias, sin aceite, cuando llegue el esposo a medianoche.",
      "suffering": "Que los que sufren se apoyen en la promesa de Pablo a los Tesalonicenses: que estaremos siempre con el Señor; que ese consuelo sostenga a quienes lloran a sus seres queridos.",
      "dead": "Que los difuntos que murieron en Cristo resuciten primero, como Pablo consuela a los Tesalonicenses; que Dios los traiga consigo, y que nos reunamos todos con ellos en las nubes al encuentro del Señor, para estar siempre con él.",
      "gospel": "Que la parábola de las diez vírgenes nos urja a mantener encendida la lámpara de la fe con el aceite de las buenas obras; que no seamos hallados sin provisión cuando llegue el Esposo, sino velando y preparados.",
      "closing": "Señor Dios, que invitaste a Israel en Siquem a escoger a quién servir y prometiste por Pablo que estaremos siempre contigo; mantennos con las lámparas encendidas hasta el encuentro final. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como Rut que dio a luz por medio de Booz a Obed, abuelo de David, sea fecunda en dar frutos de vida al mundo; que sus ministros no midan la generosidad por la cantidad, como Cristo no la midió en el óbolo de la viuda.",
      "world": "Que las naciones no exploten a las viudas, como denunció Jesús de los escribas que devoraban sus casas; y que los gobernantes valoren más la ofrenda pequeña y sincera que la abundancia ostentosa de los poderosos.",
      "parish": "Que esta comunidad imite a la viuda del Evangelio, que dio de su pobreza todo lo que tenía para vivir; y que reconozcamos que si el Señor no construye la casa, en vano trabajan los constructores.",
      "suffering": "Que las viudas y los pobres, como aquella que echó dos moneditas en el tesoro del templo, sean vistos y honrados por Dios aunque el mundo los pase por alto; que su necesidad sea suplida con generosidad.",
      "dead": "Que los difuntos, a quienes Cristo aparecerá una segunda vez no para expiar el pecado sino para salvarlos, como enseña Hebreos, esperen ya en paz esa manifestación gloriosa y definitiva.",
      "gospel": "Que el óbolo de la viuda, dos moneditas que eran todo su sustento, nos enseñe que Dios no mira la cantidad sino la entrega del corazón; que demos de nuestra necesidad y no solo de nuestra abundancia.",
      "closing": "Señor Dios, que valoraste más las dos moneditas de la viuda que las grandes ofrendas de los ricos; enséñanos a dar de nuestra pobreza y no solo de nuestra abundancia. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia, como el templo reconstruido que anuncia Ageo, tenga una gloria postrera mayor que la primera; que sus ministros anuncien con los saduceos refutados que Dios no es Dios de muertos sino de vivos, pues para él todos viven.",
      "world": "Que las naciones reconstruyan lo que la guerra y el olvido han derribado, con la promesa de Ageo de que mayor será la gloria de esta casa postrera que la de la primera; y que los gobernantes no se dejen perturbar por falsas alarmas del fin, como advierte Pablo a los Tesalonicenses.",
      "parish": "Que esta comunidad, como el templo que Ageo ve reconstruirse con más gloria que antes, se anime a edificar con esperanza; y que permanezcamos firmes, sin dejarnos sacudir por rumores sobre el día del Señor.",
      "suffering": "Que los que sufren pérdida y desolación, como el pueblo que lloraba por el templo destruido, reciban la promesa de Ageo de una gloria postrera mayor que la primera; que Dios los consuele en su duelo.",
      "dead": "Que los difuntos, sobre quienes los saduceos dudaban, descansen en la certeza que Cristo mismo proclamó: que Dios no es Dios de muertos sino de vivos, pues para él todos viven; que resuciten a la vida sin fin.",
      "gospel": "Que la respuesta de Jesús a los saduceos sobre la resurrección afirme nuestra esperanza: Dios no es Dios de muertos sino de vivos, porque para él todos viven; que esta certeza disipe todo temor ante la muerte.",
      "closing": "Señor Dios, que prometiste una gloria postrera mayor que la primera y declaraste que no eres Dios de muertos sino de vivos; consuela a los que lloran y afirma nuestra esperanza en la resurrección. Por Jesucristo nuestro Señor."
    }
  },
  "trinity25": {
    "A": {
      "church": "Que la Iglesia, como los siervos de la parábola de los talentos, negocie con valentía los dones recibidos y no los entierre por miedo; que sus ministros vivan alerta, pues el día del Señor llega como ladrón en la noche, según escribe Pablo a los Tesalonicenses.",
      "world": "Que las naciones, gobernadas por jueces como Débora que juzgó a Israel bajo la palmera de Efraín, hallen liderazgo justo y valiente; y que los gobernantes no vivan en la falsa paz y seguridad de que advierte Pablo, sino vigilantes.",
      "parish": "Que esta comunidad multiplique los talentos recibidos de Dios sin miedo a arriesgar por amor a él; y que, como hijos de la luz, no seamos sorprendidos por el día del Señor como ladrón en la noche.",
      "suffering": "Que los que sufren tengan sus ojos puestos en el Señor hasta que se apiade de ellos, como ora el salmo ciento veintitrés; que no sean como el siervo temeroso que enterró su talento, sino que confíen en la providencia divina.",
      "dead": "Que los difuntos, que no vivieron en tinieblas sino como hijos de la luz y del día, sean hallados vestidos con la coraza de la fe y del amor cuando llegue el día del Señor.",
      "gospel": "Que la parábola de los talentos nos anime a poner al servicio de Dios lo que hemos recibido, por poco que parezca; que no enterremos por miedo lo que se nos ha confiado, sino que lo hagamos fructificar.",
      "closing": "Señor Dios, que confías talentos a tus siervos y nos llamas hijos de la luz y no de las tinieblas; danos valentía para negociar tus dones y vigilancia para el día que ha de venir. Por Jesucristo nuestro Señor."
    },
    "B": {
      "church": "Que la Iglesia, como Ana que oró con el corazón derramado ante el Señor pidiendo un hijo, persevere en la oración confiada; que sus ministros esperen sin vacilar, sosteniendo la esperanza que profesamos, como exhorta Hebreos.",
      "world": "Que las naciones no se dejen alarmar por guerras y rumores de guerra, ni por la caída de templos y monumentos como el anunciado por Jesús; y que los gobernantes reconozcan que ninguna piedra sobre piedra permanecerá si falta la justicia.",
      "parish": "Que esta comunidad cante con Ana: mi corazón se regocija en el Señor, mi Salvador; y que nos animemos unos a otros al amor y a las buenas obras, sin dejar de congregarnos.",
      "suffering": "Que las mujeres estériles y afligidas, como Ana en el templo de Silo, sean escuchadas por Dios que da la vida donde parecía imposible; que su llanto se convierta en el cántico de alegría que ella entonó.",
      "dead": "Que los difuntos, purificados por el único sacrificio de Cristo ofrecido una vez para siempre, como enseña Hebreos, esperen ya perfeccionados para siempre el descanso definitivo.",
      "gospel": "Que ante el anuncio de la destrucción del templo y las señales del fin, no nos dejemos engañar ni aterrorizar; que estas cosas son principio de dolores, pero el Señor permanece fiel más allá de toda piedra derribada.",
      "closing": "Señor Dios, que escuchaste el clamor de Ana y le diste a Samuel, y que permaneces fiel cuando todo templo terreno se derrumba; escucha nuestra oración y sostén nuestra esperanza. Por Jesucristo nuestro Señor."
    },
    "C": {
      "church": "Que la Iglesia anuncie los cielos nuevos y la tierra nueva que promete Isaías, donde ya no habrá llanto ni clamor de angustia; que sus ministros no se cansen de hacer el bien, como pide Pablo a los Tesalonicenses, aunque el fin parezca tardar.",
      "world": "Que las naciones vivan ya un anticipo de los cielos nuevos y la tierra nueva de Isaías, donde el lobo y el cordero pastarán juntos; y que los gobernantes, ante persecuciones y templos derribados, actúen con la firmeza que Jesús pide en el Evangelio.",
      "parish": "Que esta comunidad, con la perseverancia que pide Jesús, salve su alma en medio de toda prueba; y que gritemos con alegría, pues grande en medio de nosotros es el Santo de Israel, como canta el cántico de Isaías.",
      "suffering": "Que los que hoy lloran hallen cumplida la promesa de Isaías de que Dios enjugará toda lágrima y no habrá ya más llanto ni muerte prematura; que en su perseverancia hallen la salvación de sus almas.",
      "dead": "Que los difuntos entren ya en los cielos nuevos y la tierra nueva que anuncia Isaías, donde nadie edificará para que otro habite ni plantará para que otro coma, sino que gozarán para siempre de la obra de sus manos.",
      "gospel": "Que ante el anuncio de persecuciones y templos derribados, Jesús nos asegura que ni un cabello de nuestra cabeza perecerá; que con nuestra perseverancia salvemos nuestras almas, sin ceder al miedo.",
      "closing": "Señor Dios, que prometes cielos nuevos y tierra nueva donde ya no habrá llanto, y nos pides perseverar hasta el fin; sostennos en toda prueba y séllanos con tu promesa. Por Jesucristo nuestro Señor."
    }
  },
  "trinity26": {
    "A": {
      "church": "Que la Iglesia sea el rebaño que el Señor mismo apacienta, buscando a la oveja perdida y vendando a la que sufre, como promete Ezequiel; que sus ministros vean a Cristo cabeza de la Iglesia, sentado a la derecha del Padre por encima de todo principado.",
      "world": "Que las naciones sean juzgadas, como enseña Mateo, por haber dado de comer al hambriento, de beber al sediento y vestido al desnudo; que los gobernantes recuerden que lo que hicieron o dejaron de hacer al más pequeño se lo hicieron a Cristo mismo.",
      "parish": "Que esta comunidad reconozca a Cristo en el hambriento, el sediento, el forastero, el desnudo, el enfermo y el preso, pues quien apacienta al pequeño apacienta al Rey; y que seamos hallados entre las ovejas y no entre las cabras.",
      "suffering": "Que los enfermos, encarcelados y desnudos de este mundo sean vestidos, visitados y consolados como si fueran el mismo Cristo Rey; que el buen Pastor de Ezequiel busque a los descarriados y venda a los heridos.",
      "dead": "Que los difuntos, ovejas del rebaño que Dios mismo apacienta según Ezequiel, sean recibidos entre los benditos del Padre que heredan el Reino preparado desde la fundación del mundo.",
      "gospel": "Que el Juicio Final que describe Mateo nos examine hoy mismo: cuanto hicimos al más pequeño de los hermanos de Cristo, a él se lo hicimos; que seamos hallados entre quienes dieron de comer, vistieron y visitaron al Rey escondido en el necesitado.",
      "closing": "Señor Dios, que apacientas tu rebaño y te escondes en el hambriento, el sediento y el preso; concédenos reconocerte en el más pequeño y ser hallados entre tus ovejas el día del juicio. Tú que vives y reinas por los siglos de los siglos."
    },
    "B": {
      "church": "Que la Iglesia proclame que Jesucristo es el Alfa y la Omega, el que es, que era y que ha de venir, como anuncia el Apocalipsis; que sus ministros anuncien ante los poderes del mundo, como Cristo ante Pilato, que su reino no es de este mundo.",
      "world": "Que las naciones reconozcan que solo Dios es el Todopoderoso, más allá de todo imperio pasajero; y que los gobernantes gobiernen, como David en sus últimas palabras, con la justicia de quien reina en el temor de Dios.",
      "parish": "Que esta comunidad viva bajo el reinado de Cristo, no impuesto por la fuerza como los reinos de este mundo, sino por la verdad que él vino a testificar; y que todo el que es de la verdad escuche su voz.",
      "suffering": "Que los que sufren bajo poderes injustos de este mundo encuentren consuelo en que Cristo, ante Pilato, proclamó un reino que no se impone por la espada sino por la verdad y el amor.",
      "dead": "Que los difuntos, lavados de sus pecados por la sangre de Cristo, que los hizo reyes y sacerdotes para Dios su Padre, como proclama el Apocalipsis, reinen ya con él por los siglos de los siglos.",
      "gospel": "Que ante Pilato, Jesús proclama que su reino no es de este mundo y que vino para dar testimonio de la verdad; que todos los que somos de la verdad escuchemos su voz y reconozcamos en él a nuestro único Rey.",
      "closing": "Señor Dios, que en tu Hijo nos revelas al Alfa y la Omega, el que es, que era y que ha de venir; hazlo reinar en nuestros corazones con la verdad que no se impone por la fuerza. Tú que vives y reinas por los siglos de los siglos."
    },
    "C": {
      "church": "Que la Iglesia reconozca en Cristo la imagen del Dios invisible, en quien todo fue creado y todo subsiste, como proclama la carta a los Colosenses; que sus ministros anuncien, como el buen ladrón en la cruz, que hoy mismo se puede estar con Cristo en el paraíso.",
      "world": "Que las naciones vean levantarse el renuevo justo que promete Jeremías, un rey que reine con sabiduría y practique la justicia y el derecho en la tierra; y que los gobernantes gobiernen con esa misma rectitud.",
      "parish": "Que esta comunidad, como el buen ladrón crucificado junto a Cristo, reconozca en él a su Rey incluso en la hora de mayor debilidad y vergüenza; y que digamos con humildad: acuérdate de mí cuando llegues a tu Reino.",
      "suffering": "Que los que sufren como el buen ladrón en su propia cruz, condenados injustamente o abandonados, escuchen de labios de Cristo la misma promesa: hoy estarás conmigo en el paraíso.",
      "dead": "Que los difuntos escuchen ya, como el buen ladrón crucificado junto a Cristo, la promesa que no falla: hoy estarás conmigo en el paraíso, pues en Cristo, imagen del Dios invisible, todo ha sido reconciliado.",
      "gospel": "Que la palabra de Cristo al buen ladrón —hoy estarás conmigo en el paraíso— sea también nuestra esperanza cuando nada quede de nuestra propia justicia; que reconozcamos a nuestro Rey incluso crucificado entre malhechores.",
      "closing": "Señor Dios, que en tu Hijo crucificado entre dos ladrones revelaste al Rey que reconcilia todas las cosas; acuérdate también de nosotros y llévanos contigo al paraíso. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "01-06": {
    "all": {
      "church": "Que la Iglesia, como los Magos que siguieron la estrella, guíe a todos los pueblos hacia Cristo; que los misioneros lleven el Evangelio hasta los confines de la tierra; y que los pastores ofrezcan a Dios lo mejor de sus dones.",
      "world": "Por los gobernantes de las naciones, para que reconozcan al verdadero Rey como lo hicieron los sabios de Oriente; por los pueblos que aún no conocen a Cristo; y por la paz entre las naciones representadas por el oro, el incienso y la mirra.",
      "parish": "Que esta comunidad parroquial se ponga en camino como los Magos, buscando a Cristo sin descanso; que ofrezcamos nuestros propios dones al Señor; y que nadie en esta familia parroquial deje de encontrar la luz de la estrella.",
      "suffering": "Por los que caminan en oscuridad buscando sentido a su sufrimiento; por los que se sienten perdidos como viajeros sin estrella; y por los enfermos, para que la luz de Cristo ilumine su camino.",
      "dead": "Por los difuntos que siguieron la estrella de la fe hasta el final de sus vidas; que gocen ya de la luz que no conoce ocaso; y que nosotros sepamos seguir su ejemplo de búsqueda constante de Dios.",
      "gospel": "Que como los Magos, ofrezcamos a Cristo oro de nuestra fe, incienso de nuestra oración y mirra de nuestro sacrificio; y que regresemos transformados, por otro camino, a nuestra vida cotidiana.",
      "closing": "Señor, que hiciste brillar una estrella para guiar a los Magos hasta el Niño de Belén, guíanos también a nosotros con tu luz para que te reconozcamos y te adoremos con todo lo que somos. Por Jesucristo nuestro Señor."
    }
  },
  "02-02": {
    "all": {
      "church": "Que la Iglesia, como Simeón en el templo, reconozca en Cristo la luz para iluminar a las naciones; que los ancianos y los que esperan con paciencia sean modelo de fe para las nuevas generaciones; y que los sacerdotes presenten a Cristo al pueblo cada día.",
      "world": "Por las naciones del mundo, para que sean iluminadas por la luz que Simeón vio con sus propios ojos; por los que gobiernan, para que busquen la verdadera gloria del Rey; y por la paz que anunció Simeón al sostener al Niño.",
      "parish": "Que esta parroquia presente a Cristo en cada celebración como María y José lo presentaron en el templo; que los que hemos esperado largamente una gracia veamos, como Simeón y Ana, el cumplimiento de la promesa; y que las velas que hoy bendecimos nos recuerden llevar la luz de Cristo a casa.",
      "suffering": "Por los que, como Simeón, esperan con paciencia el consuelo en medio del dolor; por los ancianos que sostienen su fe hasta el final de sus días; y por los enfermos, para que sus ojos vean también la salvación de Dios.",
      "dead": "Por los difuntos que, como Simeón, pudieron partir en paz habiendo visto la salvación; que descansen en la luz que no se apaga; y que nosotros vivamos preparados para el encuentro final con el Señor.",
      "gospel": "Que sepamos reconocer a Cristo como lo reconoció Simeón, aunque viniera envuelto en la sencillez de un niño pobre; y que la espada que atravesó el corazón de María nos enseñe a acompañar a quienes sufren.",
      "closing": "Señor de la gloria, que fuiste presentado en el templo y reconocido por Simeón como luz de las naciones, concédenos ojos limpios para reconocerte en lo sencillo de cada día. Por Jesucristo nuestro Señor."
    }
  },
  "03-19": {
    "all": {
      "church": "Que la Iglesia imite la obediencia silenciosa de San José, que aceptó sin demora la voluntad de Dios revelada en sueños; que los que ejercen autoridad en ella custodien a la familia de Cristo como José custodió a María y al Niño; y que crezca la devoción a este esposo justo y fiel.",
      "world": "Por los gobernantes de las naciones, para que gobiernen con la justicia silenciosa de San José; por las familias que huyen de la violencia como la Sagrada Familia huyó a Egipto; y por quienes trabajan calladamente sin buscar reconocimiento.",
      "parish": "Que esta comunidad parroquial encuentre en San José un modelo de fidelidad discreta y obediente; que los padres y esposos de esta parroquia asuman su vocación con la misma entrega silenciosa; y que San José custodie a esta familia parroquial como custodió a la Sagrada Familia.",
      "suffering": "Por los que enfrentan decisiones difíciles en la oscuridad y el silencio, como José ante el embarazo de María; por los que se sienten confundidos y necesitan una palabra de Dios que los oriente; y por quienes cargan responsabilidades familiares en soledad.",
      "dead": "Por los difuntos que, como José, vivieron su fe en el silencio del trabajo cotidiano; que San José, patrono de la buena muerte, los acompañe ante el trono de Dios; y que descansen en la paz de los justos.",
      "gospel": "Que sepamos obedecer a Dios con la prontitud de José, que se levantó de su sueño e hizo lo que el ángel del Señor le había mandado; y que su linaje perpetuo en Cristo sea también nuestra herencia de fe.",
      "closing": "Dios fiel, que elegiste a José como esposo justo de María y guardián de tu Hijo, concédenos su misma disposición sencilla para cumplir tu voluntad apenas la reconozcamos. Por Jesucristo nuestro Señor."
    }
  },
  "03-25": {
    "all": {
      "church": "Que la Iglesia diga con María, ante cada llamado de Dios, 'hágase en mí según tu palabra'; que los consagrados vivan la entrega total que ella mostró ante el ángel Gabriel; y que toda vocación en la Iglesia nazca de esa misma disponibilidad confiada.",
      "world": "Por las naciones del mundo, para que acojan los designios de Dios como lo hizo María, sin resistencia ni cálculo; por los gobernantes, para que actúen con humildad ante lo que se les pide; y por los pueblos que esperan una señal de esperanza como la esperó Acaz.",
      "parish": "Que esta comunidad parroquial aprenda de María a decir sí a Dios sin condiciones ni reservas; que quienes discutan una vocación en esta parroquia encuentren en la Anunciación luz para su decisión; y que celebremos con gozo el misterio de la Encarnación que comenzó con un simple 'sí'.",
      "suffering": "Por los que enfrentan un anuncio que les cambia la vida, como María ante el ángel; por los que se turban al escuchar la voluntad de Dios y necesitan la seguridad de que 'nada hay imposible para Dios'; y por las madres en situaciones difíciles.",
      "dead": "Por los difuntos que dijeron sí a la voluntad de Dios a lo largo de su vida; que como María, hayan encontrado gracia a los ojos del Señor; y que su ejemplo de entrega nos anime a vivir preparados para el encuentro final.",
      "gospel": "Que, como María ante el ángel Gabriel, respondamos a Dios 'aquí estoy, hágase en mí según tu palabra'; y que el Verbo que se hizo carne en su vientre siga encarnándose hoy en nuestras decisiones concretas.",
      "closing": "Dios eterno, que por el anuncio del ángel hiciste que tu Verbo se encarnara en el seno de la Virgen María, concédenos decir con ella un sí incondicional a tu voluntad. Por Jesucristo nuestro Señor."
    }
  },
  "04-25": {
    "all": {
      "church": "Que la Iglesia se revista de humildad como pide San Marcos en su carta, resistiendo firme al que busca devorarla como león rugiente; que los evangelizadores vayan por todo el mundo proclamando la Buena Nueva sin miedo; y que el testimonio de Marcos anime a los predicadores de hoy.",
      "world": "Por las naciones del mundo, para que escuchen el Evangelio proclamado a toda criatura; por los que sufren persecución por causa de la fe en tierras lejanas; y por la paz entre los pueblos a quienes se anuncia la Buena Nueva.",
      "parish": "Que esta comunidad parroquial vaya y proclame el Evangelio como Marcos exhorta, con obras y palabras; que los catequistas y misioneros de esta parroquia sean fieles a su misión; y que la humildad que pide la primera carta de Pedro marque nuestra vida comunitaria.",
      "suffering": "Por los que son perseguidos como un león rugiente busca devorar a su presa, según la imagen de San Pedro; por los que sufren ansiedad y necesitan echar sobre Dios sus congojas; y por los enfermos que esperan signos de sanación.",
      "dead": "Por los difuntos que en vida proclamaron el Evangelio con su testimonio; que reciban la corona incorruptible de gloria prometida a los fieles; y que descansen en la paz que anunciaron a otros.",
      "gospel": "Que vayamos por todo el mundo y proclamemos el Evangelio a toda criatura, confiando en que el Señor actuará con nosotros y confirmará la Palabra con las señales que la acompañan.",
      "closing": "Señor Jesús, que enviaste a tus discípulos a proclamar el Evangelio a toda criatura, confirma también hoy nuestra palabra con signos de tu presencia viva. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "05-01": {
    "all": {
      "church": "Que la Iglesia no se turbe ante las pruebas, confiando en que Cristo prepara muchas moradas para los suyos; que los pastores muestren al Padre como Cristo respondió a Felipe: 'el que me ha visto a mí, ha visto al Padre'; y que el trabajo silencioso de San José siga siendo modelo para todo bautizado.",
      "world": "Por los trabajadores de todo el mundo, para que su labor sea reconocida con dignidad como la de José el carpintero; por los gobernantes, para que promuevan condiciones justas de trabajo; y por quienes buscan sentido a su esfuerzo diario.",
      "parish": "Que esta comunidad parroquial no turbe su corazón en tiempos de incertidumbre, creyendo en Dios y creyendo también en Cristo; que los trabajadores de esta parroquia encuentren en San José un patrono cercano; y que preparemos con esperanza el lugar que Cristo nos tiene reservado.",
      "suffering": "Por los que, como Felipe, piden ver al Padre en medio de su angustia; por los desempleados y los que sufren la precariedad laboral; y por los enfermos que necesitan la certeza de que hay muchas moradas preparadas para ellos.",
      "dead": "Por los difuntos que trabajaron con honradez, como José en su taller de Nazaret; que Cristo los reciba en la morada que les preparó; y que su fe en la casa del Padre sostenga nuestra propia esperanza.",
      "gospel": "Que no se turbe nuestro corazón, sino que creamos en Dios y en Cristo, sabiendo que él es el camino, la verdad y la vida hacia la casa del Padre.",
      "closing": "Padre de todas las moradas, que en Cristo nos preparas un lugar y nos muestras tu rostro, aparta de nosotros la turbación y afianza nuestra fe. Por Jesucristo nuestro Señor."
    }
  },
  "06-11": {
    "all": {
      "church": "Que la Iglesia tenga hombres buenos y llenos del Espíritu Santo como Bernabé, capaces de reconocer y enviar a nuevos obreros a la misión; que los que curan enfermos y anuncian el reino lo hagan dando gratis lo que gratis recibieron; y que crezca el número de los que se convierten al Señor.",
      "world": "Por las naciones del mundo, para que reciban con alegría a quienes llevan la Buena Nueva como Bernabé y Pablo la llevaron a Antioquía; por los pueblos divididos, para que hombres de paz los reconcilien; y por quienes trabajan por unir a comunidades distintas.",
      "parish": "Que esta comunidad parroquial tenga, como Bernabé, generosidad para acoger a los nuevos en la fe; que sepamos animar y enviar a otros a servir, como él hizo con Pablo; y que se multipliquen entre nosotros los hombres y mujeres buenos, llenos del Espíritu Santo.",
      "suffering": "Por los enfermos, para que sean curados como Cristo mandó a sus discípulos; por los necesitados que esperan recibir gratis lo que otros deben dar gratis; y por los que se sienten excluidos y necesitan a alguien como Bernabé que los acoja.",
      "dead": "Por los difuntos que, como Bernabé, fueron hombres y mujeres buenos llenos del Espíritu Santo; que el Señor dé a conocer en ellos su victoria; y que su generosidad en vida sea semilla de bien para quienes los recuerdan.",
      "gospel": "Que anunciemos que el reino de los cielos está cerca, curando enfermos y dando gratis lo que gratis hemos recibido, sin oro ni plata en el cinto, confiando solo en la providencia de Dios.",
      "closing": "Señor, que llenaste a Bernabé de fe y del Espíritu Santo para animar a la Iglesia naciente, suscita hoy también hombres y mujeres generosos que acojan y envíen a nuevos obreros. Por Jesucristo nuestro Señor."
    }
  },
  "06-24": {
    "all": {
      "church": "Que la Iglesia reconozca, como Isaías, que Dios la llamó desde el seno materno para ser luz de las naciones; que los profetas de hoy preparen los caminos del Señor como Juan el Bautista; y que el nacimiento de Juan renueve nuestra fe en los designios de Dios.",
      "world": "Por las naciones del mundo, para que sean alcanzadas por la luz que Dios formó desde el vientre de Juan; por los pueblos que esperan una voz profética que les muestre el camino; y por quienes trabajan por la justicia como precursores de la paz.",
      "parish": "Que esta comunidad parroquial se alegre como los vecinos de Zacarías e Isabel ante los signos de Dios; que los padres presentes den gracias por sus hijos como Zacarías dio gracias al recobrar el habla; y que preguntemos con asombro '¿qué será de este niño?' ante cada nueva vida que Dios nos confía.",
      "suffering": "Por los que, como Zacarías, han perdido la voz por la duda o el sufrimiento y esperan recobrarla; por los matrimonios que esperan un hijo con dificultad, como Isabel y Zacarías; y por los enfermos que aguardan una señal de la bondad de Dios.",
      "dead": "Por los difuntos formados portentosamente por Dios desde el vientre materno; que hayan cumplido, como Juan, la misión que Dios les confió; y que descansen sabiendo que su vida no fue en vano ante los ojos del Señor.",
      "gospel": "Que preparemos los caminos del Señor como lo hizo Juan desde su nacimiento, dando gracias a Dios que nos formó portentosamente y nos llamó por nuestro nombre desde antes de nacer.",
      "closing": "Dios que formaste a Juan en el vientre de Isabel para ser precursor de tu Hijo, forma también en nosotros un corazón dispuesto a preparar tu camino. Por Jesucristo nuestro Señor."
    }
  },
  "06-29": {
    "all": {
      "church": "Que la Iglesia, edificada sobre la confesión de Pedro, 'tú eres el Cristo, el Hijo de Dios vivo', permanezca firme como roca frente a las puertas del infierno; que los sucesores de los Apóstoles peleen la buena batalla como Pablo hasta el final; y que Pedro y Pablo sigan intercediendo por la unidad de los creyentes.",
      "world": "Por las naciones del mundo, para que reconozcan en Cristo al Hijo del Dios vivo como lo confesó Pedro; por los presos y perseguidos que esperan, como Pedro en la cárcel de Herodes, la liberación del ángel del Señor; y por los gobernantes que ejercen el poder con justicia.",
      "parish": "Que esta comunidad parroquial confiese a Cristo con la misma firmeza que Pedro en Cesarea de Filipo; que guardemos la fe hasta el final como Pablo, sabiendo que nos espera la corona de justicia; y que Pedro y Pablo intercedan por esta Iglesia local edificada sobre su testimonio.",
      "suffering": "Por los que están encadenados física o espiritualmente y esperan la liberación como Pedro esperó al ángel que lo libró de la cárcel; por los que sienten que el Señor los abandona en la prueba, aunque él nos libra de todas nuestras ansias; y por los perseguidos por causa de la fe.",
      "dead": "Por los difuntos que, como Pablo, pelearon la buena batalla y guardaron la fe hasta el final; que reciban la corona de justicia reservada a los que aman la venida del Señor; y que Pedro y Pablo los reciban en la Jerusalén celestial.",
      "gospel": "Que confesemos con Pedro 'tú eres el Cristo, el Hijo de Dios vivo', y que sobre esa roca de fe Cristo siga edificando su Iglesia, cuyas puertas del infierno no prevalecerán.",
      "closing": "Señor, que edificaste tu Iglesia sobre la fe de Pedro y la extendiste por el celo misionero de Pablo, guarda a tu pueblo firme en la misma confesión que ellos proclamaron. Por Jesucristo nuestro Señor."
    }
  },
  "07-25": {
    "all": {
      "church": "Que la Iglesia lleve el tesoro del Evangelio en vasijas de barro como enseña Pablo, sabiendo que el poder desbordante viene de Dios y no de nosotros; que el martirio de Santiago, el primero de los Apóstoles en derramar su sangre, siga fortaleciendo a los perseguidos de hoy; y que los obispos sirvan como Cristo pidió a los hijos de Zebedeo.",
      "world": "Por las naciones del mundo, para que le alaben los pueblos como pide el salmo; por los que sufren persecución bajo gobernantes como Herodes, que mandó matar a Santiago; y por quienes trabajan por la justicia arriesgando su propia vida.",
      "parish": "Que esta comunidad parroquial aprenda de Santiago a beber el cáliz que Cristo bebió, sirviendo en vez de buscar los primeros puestos; que quienes peregrinan a Compostela encuentren en este apóstol un guía firme; y que sirvamos unos a otros como el que quiere ser grande entre nosotros.",
      "suffering": "Por los perseguidos y encarcelados por causa de su fe, como lo fue Santiago antes de su martirio; por los que llevan el tesoro de la fe en vasijas de barro frágiles, atribulados pero no aplastados; y por quienes sufren injusticia bajo el poder de otros.",
      "dead": "Por los difuntos que, como Santiago, dieron su vida por Cristo o vivieron con fe hasta el final; que lleven ya en gloria el tesoro que aquí llevaron en vasijas de barro; y que su testimonio anime a quienes aún caminamos.",
      "gospel": "Que aprendamos de Santiago y Juan que la grandeza en el reino de Cristo consiste en servir y no en ser servido, bebiendo el mismo cáliz que Cristo bebió por amor a nosotros.",
      "closing": "Dios de las naciones, que llamaste a Santiago a beber el cáliz de tu Hijo y a dar testimonio con su sangre, concédenos servir a los demás como él sirvió hasta el martirio. Por Jesucristo nuestro Señor."
    }
  },
  "08-06": {
    "all": {
      "church": "Que la Iglesia, testigo ocular de la majestad de Cristo como Pedro, Santiago y Juan en el Tabor, anuncie con firmeza la palabra profética; que los pastores escuchen la voz del Padre que dice 'este es mi Hijo amado, escuchadlo'; y que el resplandor de la Transfiguración ilumine el camino hacia la cruz.",
      "world": "Por las naciones del mundo, para que reconozcan al Hijo del hombre a quien fue dado el dominio, la gloria y el reino, como vio Daniel en su visión; por los pueblos que buscan una gloria pasajera; y por quienes anhelan ver la majestad de Dios en medio de la historia.",
      "parish": "Que esta comunidad parroquial, como Pedro en el monte, desee construir tiendas para permanecer en la presencia de Dios; que no bajemos del monte sin antes escuchar la voz del Padre; y que la luz de la Transfiguración nos acompañe cuando descendamos a las dificultades cotidianas.",
      "suffering": "Por los que atraviesan momentos oscuros y necesitan un destello de la gloria de Dios como lo tuvieron los discípulos en el Tabor; por los que temen, como los Apóstoles cuando oyeron la voz del Padre, y necesitan que Cristo los toque y les diga 'levantaos, no temáis'.",
      "dead": "Por los difuntos que ya contemplan sin velos la gloria que los discípulos vislumbraron en el Tabor; que su rostro haya resplandecido como el sol al presentarse ante Dios; y que nosotros esperemos participar de esa misma transfiguración final.",
      "gospel": "Que escuchemos al Hijo amado del Padre, transfigurado ante Pedro, Santiago y Juan, y que su resplandor nos sostenga cuando debamos bajar del monte hacia el valle de la cruz.",
      "closing": "Dios que te revelaste en el monte Tabor transfigurando a tu Hijo ante los ojos asombrados de sus discípulos, transforma también nuestra vida con el resplandor de tu gloria. Por Jesucristo nuestro Señor."
    }
  },
  "08-15": {
    "all": {
      "church": "Que la Iglesia proclame con María que el Todopoderoso ha hecho grandes cosas en ella; que los humildes sean exaltados como anuncia el Magníficat; y que la Asunción de María en cuerpo y alma sea signo de la esperanza que aguarda a todo el Pueblo de Dios.",
      "world": "Por las naciones del mundo, para que Dios derribe del trono a los poderosos y enaltezca a los humildes, como canta María; por los pueblos hambrientos, a quienes Dios colma de bienes; y por los gobernantes soberbios, a quienes Dios dispersa según el Magníficat.",
      "parish": "Que esta comunidad parroquial visite a los necesitados como María visitó a Isabel, llevando a Cristo consigo; que cantemos con alegría las grandes cosas que Dios hace también entre nosotros; y que la reina asunta a los cielos interceda por esta familia parroquial.",
      "suffering": "Por los humildes y hambrientos que Dios colma de bienes, según el Magníficat; por los enfermos que esperan, como María en su Asunción, ser glorificados en cuerpo y alma; y por los que necesitan sentir que Dios mira su bajeza con misericordia.",
      "dead": "Por los difuntos que esperan, como primicia en María asunta a los cielos, la resurrección de su cuerpo y de su alma; que Cristo, primicia de los que durmieron, los resucite en el día final; y que la reina de los cielos interceda por su descanso eterno.",
      "gospel": "Que digamos con María 'proclama mi alma la grandeza del Señor', reconociendo que el Todopoderoso hace en nosotros las mismas grandes cosas que hizo en ella para gloria de su nombre.",
      "closing": "Dios que llevaste en cuerpo y alma a la gloria del cielo a la Virgen María, primicia de la Iglesia, atrae también a nosotros hacia la plenitud que en ella ya contemplamos. Por Jesucristo nuestro Señor."
    }
  },
  "08-24": {
    "all": {
      "church": "Que la Iglesia siga haciendo signos y prodigios en el nombre de Jesús como los Apóstoles en el pórtico de Salomón; que los pastores, elegidos tras una noche entera de oración como los Doce, guíen al pueblo con la misma entrega; y que crezca el número de los que se adhieren al Señor.",
      "world": "Por las naciones del mundo, para que tus fieles proclamen la gloria de tu reinado en cada rincón de la tierra; por los pueblos que buscan signos de esperanza en medio de la incertidumbre; y por quienes ejercen autoridad, para que la ejerzan con la humildad de los Apóstoles.",
      "parish": "Que esta comunidad parroquial dedique tiempo a la oración prolongada antes de tomar decisiones importantes, como Jesús antes de elegir a los Doce; que los enfermos de esta parroquia sean traídos a Cristo como los llevaban a las plazas; y que Bartolomé interceda por quienes buscan sinceramente la verdad.",
      "suffering": "Por los enfermos que eran llevados a las plazas para que al menos la sombra de Pedro los tocara; por los atormentados por espíritus impuros que buscaban ser sanados; y por todos los que hoy necesitan signos tangibles de la cercanía de Dios.",
      "dead": "Por los difuntos que fueron sanados en vida por el poder de Cristo obrando en su Iglesia; que tus fieles proclamen ya la gloria de tu reinado en la asamblea celestial; y que descansen entre los santos que vieron los signos y prodigios de Dios.",
      "gospel": "Que imitemos a Jesús que pasó la noche entera en oración antes de elegir a los Doce, aprendiendo que toda misión importante nace primero del silencio y la oración ante el Padre.",
      "closing": "Señor, que después de orar toda la noche elegiste a los Doce para tu misión, concédenos discernir tu voluntad primero en la oración antes de actuar. Por Jesucristo nuestro Señor."
    }
  },
  "09-08": {
    "all": {
      "church": "Que la Iglesia se alegre por el nacimiento de María, de quien saldría el que ha de gobernar y apacentar con la fuerza del Señor, según la profecía de Miqueas; que los pastores apacienten a su grey con la misma fortaleza; y que este nacimiento sea aurora de la salvación anunciada.",
      "world": "Por las naciones del mundo, para que sean apacentadas por el que nacería de Belén y sería grande hasta los confines de la tierra; por los pueblos pequeños y olvidados, como Belén, de los que Dios se sirve para grandes designios; y por la paz que trae el príncipe anunciado por Miqueas.",
      "parish": "Que esta comunidad parroquial celebre con gozo el nacimiento de María, aurora que anuncia el sol de justicia; que los niños de esta parroquia crezcan bajo su protección maternal; y que la genealogía de fe que nos precede, como la genealogía de Jesús, siga dando frutos en nosotros.",
      "suffering": "Por los que se sienten pequeños e insignificantes como Belén entre los clanes de Judá, y a quienes Dios mira con predilección; por las familias que esperan un nacimiento con dificultad; y por los necesitados que aguardan la paz que trae el Mesías.",
      "dead": "Por los difuntos que forman parte de la genealogía de fe que culmina en Cristo; que, como María en su nacimiento, hayan sido preparados por Dios para su gloria; y que descansen en la paz anunciada por los profetas.",
      "gospel": "Que nos alegremos por la salvación de Dios, que trazó una genealogía de generaciones enteras para preparar el nacimiento de María y, en ella, la venida de su Hijo entre nosotros.",
      "closing": "Dios eterno, que preparaste el nacimiento de María como aurora de la salvación del mundo, haz que también nosotros seamos signos de tu luz que amanece. Por Jesucristo nuestro Señor."
    }
  },
  "09-14": {
    "all": {
      "church": "Que la Iglesia levante en alto la Cruz como Moisés levantó la serpiente de bronce en el desierto, para que todo el que mire a Cristo crucificado tenga vida; que los predicadores no olviden las obras del Señor, como pide el salmo; y que la humillación de Cristo hasta la muerte de cruz sea camino de exaltación para todos.",
      "world": "Por las naciones del mundo, mordidas hoy por tantas serpientes de violencia y desesperanza, para que miren a la Cruz y vivan; por los pueblos que han olvidado las obras del Señor, como advierte el salmo; y por la paz que solo la Cruz de Cristo puede dar.",
      "parish": "Que esta comunidad parroquial exalte la Cruz no como símbolo de derrota sino de victoria, como la exaltó Cristo mismo; que quienes atraviesan el desierto de la duda miren a la Cruz como Israel miró la serpiente de bronce; y que nadie en esta parroquia olvide las obras del Señor.",
      "suffering": "Por los que se sienten mordidos por serpientes de dolor, adicción o desesperación, para que levanten los ojos hacia la Cruz como Israel los levantó hacia la serpiente de bronce; por los enfermos que buscan sanación en la mirada puesta en Cristo crucificado.",
      "dead": "Por los difuntos que cargaron su cruz siguiendo a Cristo hasta el final; que, humillados con él, participen ahora de su exaltación gloriosa; y que no olvidemos las obras que el Señor hizo en sus vidas.",
      "gospel": "Que, como Moisés levantó la serpiente en el desierto, contemplemos a Cristo levantado en la Cruz, sabiendo que Dios no envió a su Hijo para condenar al mundo, sino para que el mundo se salve por él.",
      "closing": "Dios que exaltaste a tu Hijo humillado hasta la muerte de cruz, concédenos no avergonzarnos jamás de la Cruz que es camino de vida y de salvación. Por Jesucristo nuestro Señor."
    }
  },
  "09-21": {
    "all": {
      "church": "Que la Iglesia sea un solo cuerpo y un solo Espíritu como pide Pablo a los Efesios, con apóstoles, evangelistas y pastores que edifiquen el cuerpo de Cristo; que, como Mateo dejó su mesa de recaudador al oír 'sígueme', los llamados de hoy respondan sin demora.",
      "world": "Por las naciones del mundo, para que a toda la tierra alcance el pregón del Evangelio; por los que la sociedad margina, como marginaba a los publicanos y pecadores con quienes Jesús se sentó a comer; y por quienes ejercen profesiones mal vistas y necesitan una mirada de misericordia.",
      "parish": "Que esta comunidad parroquial acoja a los pecadores y alejados como Cristo acogió a Mateo en su propia mesa; que ninguno se sienta excluido de la mesa del Señor por su pasado; y que la unidad de un solo cuerpo y un solo Espíritu marque nuestra vida comunitaria.",
      "suffering": "Por los que se sienten como Mateo en su mesa de impuestos, despreciados y juzgados por otros; por los enfermos, recordando que Cristo dijo 'no necesitan médico los sanos, sino los que están mal'; y por los pecadores que esperan una llamada de misericordia.",
      "dead": "Por los difuntos que, como Mateo, dejaron todo para seguir a Cristo cuando escucharon su llamada; que hayan sido recibidos en la mesa eterna del Reino; y que a toda la tierra alcance también el pregón de su fe vivida.",
      "gospel": "Que escuchemos como Mateo la llamada de Cristo en medio de nuestra vida ordinaria, y que nos levantemos sin demora, recordando que él no vino a llamar a justos sino a pecadores.",
      "closing": "Señor, que llamaste a Mateo desde su mesa de recaudador para hacerlo apóstol y evangelista, llama también a los que hoy se sienten indignos de tu mesa. Por Jesucristo nuestro Señor."
    }
  },
  "09-29": {
    "all": {
      "church": "Que la Iglesia militante cuente con la protección de San Miguel en su batalla contra el dragón y sus ángeles; que los pastores hagan suyo el testimonio del Cordero contra el acusador de los hermanos; y que la Iglesia se haga pequeña como un niño para entrar en el Reino.",
      "world": "Por las naciones del mundo, amenazadas por fuerzas de mal semejantes al dragón derrotado por San Miguel; por los que luchan por la justicia y necesitan la protección de los ángeles de Dios; y por la paz que sigue a la victoria del bien sobre el mal.",
      "parish": "Que esta comunidad parroquial se haga pequeña como un niño para ser grande en el Reino de los cielos; que San Miguel y todos los ángeles custodien a esta familia parroquial contra toda asechanza; y que bendigamos al Señor con todos sus ángeles, como pide el salmo.",
      "suffering": "Por los que luchan contra fuerzas que los oprimen como el dragón que Miguel combatió; por los pequeños y vulnerables, cuyos ángeles ven siempre el rostro del Padre; y por quienes necesitan protección espiritual en momentos de tentación.",
      "dead": "Por los difuntos, para que San Miguel los lleve a la luz santa como pide la antigua oración de la Iglesia; que sean liberados de todo poder del acusador de los hermanos; y que bendigan ya al Señor junto con todos los ángeles.",
      "gospel": "Que nos hagamos pequeños como niños para entrar en el Reino de los cielos, confiando en que nuestros ángeles ven siempre el rostro del Padre que está en los cielos.",
      "closing": "Dios de los ejércitos celestiales, que enviaste a San Miguel a vencer al dragón antiguo, defiéndenos también a nosotros en la lucha contra el mal. Por Jesucristo nuestro Señor."
    }
  },
  "10-18": {
    "all": {
      "church": "Que la Iglesia envíe obreros de dos en dos como Cristo envió a los setenta discípulos, aunque la mies sea mucha y los obreros pocos; que los evangelistas de hoy, como Lucas que permaneció fiel junto a Pablo cuando otros lo abandonaron, no falten a quienes predican el Evangelio.",
      "world": "Por las naciones del mundo, a las que se envían mensajeros de paz como corderos en medio de lobos; por los pueblos que aún no han recibido a los enviados del Señor; y por quienes acompañan fielmente a otros en tiempos de abandono, como Lucas acompañó a Pablo.",
      "parish": "Que esta comunidad parroquial envíe misioneros de dos en dos, apoyándose mutuamente como Cristo mandó; que los médicos y sanadores de esta parroquia, como Lucas médico, cuiden de los enfermos con caridad; y que nadie en esta familia parroquial quede solo cuando otros se alejan.",
      "suffering": "Por los enfermos, a quienes los discípulos enviados por Cristo debían curar diciendo 'está cerca el reino de Dios'; por los que se sienten abandonados como Pablo cuando otros lo dejaron, agradeciendo a los pocos que permanecen fieles; y por los médicos y personal de salud.",
      "dead": "Por los difuntos que, como Lucas, permanecieron fieles al Evangelio hasta el final de su vida; que tus fieles proclamen la gloria de tu reinado también desde la asamblea de los santos; y que su fidelidad discreta encuentre su recompensa en el cielo.",
      "gospel": "Que salgamos como los setenta discípulos enviados de dos en dos, sin alforja ni sandalias, confiando solo en que el Señor de la mies provee lo necesario a quienes envía.",
      "closing": "Señor de la mies, que enviaste a los setenta discípulos a preparar tu llegada a cada pueblo y ciudad, envíanos también a nosotros como obreros fieles. Por Jesucristo nuestro Señor."
    }
  },
  "10-28": {
    "all": {
      "church": "Que la Iglesia, edificada sobre el fundamento de los Apóstoles y los profetas, con Cristo mismo como piedra angular, permanezca firme en la fe transmitida por Simón y Judas; que los pastores elegidos tras una noche de oración, como los Doce, sirvan con la misma entrega.",
      "world": "Por las naciones del mundo, para que a toda la tierra alcance el pregón de los Apóstoles; por los pueblos divididos que necesitan reconciliación, recordando que Simón el Zelote y otros de convicciones distintas fueron unidos por Cristo en un mismo colegio apostólico.",
      "parish": "Que esta comunidad parroquial se edifique sobre el fundamento de los Apóstoles, creciendo hasta ser un templo santo en el Señor; que quienes tienen convicciones diversas encuentren en Simón y Judas un ejemplo de unidad en Cristo; y que dediquemos tiempo a la oración antes de las decisiones importantes.",
      "suffering": "Por los que se sienten olvidados como estos dos apóstoles menos conocidos, Simón y Judas, cuyo testimonio no por discreto es menos valioso; por los necesitados de reconciliación entre posturas opuestas; y por quienes buscan un fundamento firme en medio de la incertidumbre.",
      "dead": "Por los difuntos edificados sobre el fundamento de los Apóstoles y los profetas; que Cristo, piedra angular, los reciba en el templo santo de la Jerusalén celestial; y que a toda la tierra alcance el pregón de su fe silenciosa.",
      "gospel": "Que recordemos que Jesús eligió a los Doce tras pasar la noche entera en oración, y que entre ellos hubo hombres tan distintos como Simón el Zelote y Judas, unidos solo por el llamado de Cristo.",
      "closing": "Señor, que edificaste tu Iglesia sobre el fundamento de los Apóstoles Simón y Judas, mantennos unidos en ti como piedra angular a pesar de nuestras diferencias. Por Jesucristo nuestro Señor."
    }
  },
  "11-01": {
    "all": {
      "church": "Que la Iglesia peregrina se una a la multitud incontable que nadie podía contar, vestida con vestiduras blancas, de toda nación, raza, pueblo y lengua; que los santos, bienaventurados los pobres de espíritu, los mansos y los que lloran, sean modelo vivo para cada generación.",
      "world": "Por las naciones del mundo, de las que salió la gran multitud que está de pie ante el trono y ante el Cordero, con palmas en la mano; por los pueblos perseguidos por causa de la justicia, a quienes las Bienaventuranzas prometen el Reino de los cielos.",
      "parish": "Que esta comunidad parroquial busque la santidad de las Bienaventuranzas: ser pobre de espíritu, misericordiosa, limpia de corazón y constructora de paz; que los santos que hoy celebramos intercedan por cada familia de esta parroquia; y que seamos semejantes a Dios porque lo veremos tal cual es.",
      "suffering": "Por los que lloran, prometidos consuelo en las Bienaventuranzas; por los que tienen hambre y sed de justicia; y por los perseguidos por causa de la justicia, a quienes pertenece el Reino de los cielos según la promesa de Cristo en el monte.",
      "dead": "Por todos los santos y difuntos que forman ya la gran multitud vestida de blanco ante el trono de Dios, que nadie podía contar; que hayan lavado sus vestiduras en la sangre del Cordero; y que nosotros, sus hermanos, esperemos unirnos un día a esa asamblea innumerable.",
      "gospel": "Que vivamos las Bienaventuranzas proclamadas por Cristo en el monte: pobres de espíritu, mansos, misericordiosos, limpios de corazón y constructores de paz, confiando en que el Reino de los cielos es nuestro.",
      "closing": "Dios de todos los santos, que reúnes ante tu trono una multitud incontable de toda nación, raza, pueblo y lengua, admítenos un día a esa asamblea gloriosa. Por Jesucristo nuestro Señor."
    }
  },
  "11-02": {
    "all": {
      "church": "Que la Iglesia entera, en comunión con los fieles difuntos, proclame con Marta ante la tumba de Lázaro: 'yo soy la resurrección y la vida'; que los pastores acompañen a los que lloran con la misma cercanía con que Cristo se conmovió ante la tumba de su amigo; y que toda la Iglesia viva en la esperanza de la resurrección de la carne.",
      "world": "Por las naciones del mundo, para que la creación entera, que gime con dolores de parto según Pablo, alcance la libertad gloriosa de los hijos de Dios; por los pueblos que sufren guerra y muerte, para que conozcan el descanso eterno que hoy pedimos para nuestros difuntos.",
      "parish": "Que esta comunidad parroquial recuerde hoy con cariño a cada uno de sus difuntos, confiando en que las almas de los justos están en manos de Dios y ningún tormento las alcanzará; que visitemos las tumbas de nuestros seres queridos como signo de comunión; y que ofrezcamos Misas por su eterno descanso.",
      "suffering": "Por los que hoy lloran la pérdida reciente de un ser querido, como lloraron Marta y María la muerte de Lázaro; por los que sufren y necesitan escuchar que Cristo es la resurrección y la vida; y por quienes cuidan enfermos terminales con amor hasta el último instante.",
      "dead": "Concédeles, Señor, el descanso eterno y que la luz perpetua los ilumine; que las almas de los justos, en paz según la Sabiduría, no sean tocadas por tormento alguno; que como el Señor es su pastor, reposen en verdes praderas junto a aguas tranquilas; que la creación gemebunda encuentre en ellos ya la libertad de los hijos de Dios; y que Cristo, que lloró ante la tumba de Lázaro, los llame a la vida como llamó a su amigo, diciendo también sobre cada uno de ellos: 'Yo soy la resurrección y la vida; el que cree en mí, aunque haya muerto, vivirá.' Que descansen en paz.",
      "gospel": "Que creamos con Marta, ante la tumba de nuestros difuntos, que Cristo es la resurrección y la vida, y que el que cree en él, aunque muera, vivirá; y que esta fe seque nuestras lágrimas como Cristo enjugó las de Marta y María.",
      "closing": "Señor, tú que eres la resurrección y la vida y lloraste ante la tumba de tu amigo Lázaro, concede a nuestros difuntos el descanso eterno y consuela a los que hoy los lloramos. Por Jesucristo nuestro Señor."
    }
  },
  "11-30": {
    "all": {
      "church": "Que la Iglesia envíe predicadores hermosos de pies, como dice Pablo, para que todos oigan hablar de Cristo y crean; que los pastores, como Andrés, dejen las redes al instante para seguir la llamada de Cristo sin demora; y que ningún bautizado calle la fe que ha recibido.",
      "world": "Por las naciones del mundo, para que a toda la tierra alcance el pregón del Evangelio, como proclama el salmo; por los pescadores y trabajadores del mar, patronos de San Andrés; y por los pueblos que aún no han oído hablar de Cristo, sin quien no pueden creer, según razona Pablo.",
      "parish": "Que esta comunidad parroquial deje las redes, como Andrés y Pedro, para seguir a Cristo sin mirar atrás; que quienes fueron llamados por otros a la fe, como Andrés llamó a su hermano Simón, hagan lo mismo con los suyos; y que San Andrés interceda por los misioneros de esta parroquia.",
      "suffering": "Por los pescadores y trabajadores que, como Andrés y Pedro, dependen del mar para su sustento; por los que necesitan a alguien que les anuncie la Buena Nueva, pues ¿cómo creerán si no hay quien les predique?; y por los que dudan y esperan una palabra de fe.",
      "dead": "Por los difuntos que dejaron todo al instante para seguir a Cristo, como Andrés dejó sus redes junto al mar; que hayan tenido hermosos los pies de quienes anuncian buenas nuevas; y que descansen en la paz de los que creyeron sin haber visto.",
      "gospel": "Que dejemos las redes al instante como Andrés y Pedro junto al mar de Galilea, siguiendo a Cristo sin condiciones cuando nos dice 'venid conmigo, os haré pescadores de hombres'.",
      "closing": "Señor, que llamaste a Andrés junto al mar de Galilea y él te siguió al instante dejando sus redes, llámanos también a nosotros a seguirte sin demora. Por Jesucristo nuestro Señor."
    }
  },
  "12-21": {
    "all": {
      "church": "Que la Iglesia, edificada sobre el fundamento de los Apóstoles, acoja también a los que dudan como acogió a Tomás, dándoles tiempo y paciencia hasta que puedan tocar las llagas de Cristo; que los pastores respondan a la duda sincera con la misma paciencia que Cristo mostró con Tomás.",
      "world": "Por las naciones del mundo, para que alaben al Señor todos los pueblos, como pide el salmo; por quienes en el mundo dudan de la fe y necesitan tocar de algún modo las llagas de Cristo vivo en su Iglesia; y por los pueblos alejados que aún no han creído sin haber visto.",
      "parish": "Que esta comunidad parroquial acompañe con paciencia a quienes, como Tomás, necesitan pruebas antes de creer; que confesemos con él 'Señor mío y Dios mío' cada vez que recibimos la Eucaristía; y que estemos edificados sobre el fundamento de los Apóstoles como piedras vivas.",
      "suffering": "Por los que dudan en medio del sufrimiento, como Tomás dudó de la resurrección; por los que necesitan tocar con sus propias manos una señal de que Dios está presente en su dolor; y por quienes se sienten ausentes, como Tomás estuvo ausente cuando Cristo se apareció a los demás.",
      "dead": "Por los difuntos que, como Tomás, llegaron a la fe plena y proclamaron a Cristo 'Señor mío y Dios mío'; que alaben ya al Señor todas las naciones desde la gloria; y que su camino de duda a la fe sea consuelo para quienes aún dudamos.",
      "gospel": "Que confesemos con Tomás, al tocar las llagas del Resucitado, 'Señor mío y Dios mío', y que Cristo nos conceda la bienandanza prometida a los que creen sin haber visto.",
      "closing": "Señor resucitado, que mostraste tus llagas a Tomás para confirmar su fe vacilante, fortalece también nuestra fe cuando dudemos de tu presencia viva. Por Jesucristo nuestro Señor."
    }
  },
  "12-26": {
    "all": {
      "church": "Que la Iglesia, nacida de la sangre de mártires como Esteban, siga anunciando con valentía la fe aunque sea odiada por causa del nombre de Cristo; que los diáconos sirvan con el mismo celo con que Esteban sirvió a las viudas y a los pobres; y que el perdón de Esteban a sus verdugos sea ejemplo para toda la Iglesia perseguida.",
      "world": "Por las naciones del mundo donde los cristianos siguen siendo perseguidos y entregados como lo fue Esteban ante el Sanedrín; por quienes juzgan injustamente a los inocentes; y por la conversión de los perseguidores, como se convirtió Saulo que presenció el martirio de Esteban.",
      "parish": "Que esta comunidad parroquial persevere hasta el final como prometió Cristo a quienes serían odiados por su nombre; que sepamos perdonar a quienes nos ofenden como Esteban perdonó a quienes lo apedreaban; y que el primer mártir interceda por los diáconos y servidores de esta parroquia.",
      "suffering": "Por los perseguidos por causa de la fe en todo el mundo, llevados ante tribunales como fue llevado Esteban; por los que sufren violencia injusta y necesitan la fuerza para perdonar a sus verdugos; y por quienes son odiados por causa del nombre de Cristo.",
      "dead": "Por los difuntos que, como Esteban, encomendaron su espíritu a Cristo en la hora de la muerte; que hayan visto, como él, los cielos abiertos y a Cristo de pie a la derecha del Padre; y que su perdón hacia los que les hicieron mal sea intercesión por sus propias almas.",
      "gospel": "Que perseveremos hasta el final, aunque seamos odiados por causa del nombre de Cristo, sabiendo que el que persevere se salvará, como perseveró Esteban hasta entregar su espíritu al Señor.",
      "closing": "Señor Jesús, que recibiste el espíritu de Esteban mientras él te veía de pie a la derecha del Padre y perdonaba a sus verdugos, concédenos su misma fortaleza y su mismo perdón. Tú que vives y reinas por los siglos de los siglos."
    }
  },
  "12-27": {
    "all": {
      "church": "Que la Iglesia anuncie lo que ha visto y oído, como Juan, para que todos tengamos comunión con el Padre y con el Hijo; que los pastores corran hacia el sepulcro vacío con la misma prisa de Juan y Pedro, buscando la verdad de la resurrección; y que crezca el gozo de quienes vieron y creyeron.",
      "world": "Por las naciones del mundo, para que se alegren en el Señor como piden los justos en el salmo; por los pueblos que buscan una palabra de vida como la que Juan proclamó, 'lo que hemos visto y oído os lo anunciamos'; y por quienes anuncian el Evangelio con el mismo amor que caracterizó al discípulo amado.",
      "parish": "Que esta comunidad parroquial corra hacia Cristo con la prontitud de Juan llegando al sepulcro vacío; que compartamos la comunión que Juan proclamó entre nosotros y con el Padre; y que el discípulo amado interceda por quienes aman profundamente a Cristo en esta parroquia.",
      "suffering": "Por los que buscan a Cristo entre la incertidumbre, como Juan y Pedro corrieron al sepulcro sin saber aún lo que encontrarían; por los que necesitan ver para creer, y por los que, como Juan, ven y creen sin necesidad de más pruebas.",
      "dead": "Por los difuntos que vieron y creyeron, como Juan ante el sepulcro vacío; que se alegren ya en el Señor, como piden los justos en el salmo; y que compartan la comunión eterna con el Padre y con el Hijo que Juan proclamó.",
      "gospel": "Que corramos hacia Cristo como Juan corrió al sepulcro vacío, y que al ver los signos de su resurrección, como él, veamos y creamos sin necesidad de más señales.",
      "closing": "Señor, que revelaste tu resurrección primero al discípulo amado que vio y creyó junto al sepulcro vacío, concédenos ver y creer con esa misma prontitud del corazón. Por Jesucristo nuestro Señor."
    }
  },
  "12-28": {
    "all": {
      "church": "Que la Iglesia llore con Raquel a los inocentes de todo tiempo y lugar, víctimas de la violencia de nuevos Herodes; que confiese sus pecados sabiendo que Dios es fiel y justo para perdonarla, como enseña Juan; y que defienda siempre la vida de los más pequeños e indefensos.",
      "world": "Por las naciones del mundo donde hoy se repite la matanza de los inocentes en la violencia contra los niños; por los gobernantes que, como Herodes, temen perder el poder y oprimen a los débiles; y por la conversión de quienes causan daño a los más pequeños.",
      "parish": "Que esta comunidad parroquial proteja la vida de los niños como José protegió al Niño huyendo a Egipto; que nadie en esta parroquia calle ante la injusticia contra los inocentes; y que caminemos en la luz confesando nuestros pecados, como pide la primera carta de Juan.",
      "suffering": "Por los niños víctimas de violencia, guerra y abandono en el mundo entero, como los inocentes de Belén; por las madres que, como Raquel, lloran a sus hijos y no quieren consuelo; y por quienes trabajan para proteger a la infancia vulnerable.",
      "dead": "Por los niños inocentes que mueren hoy víctimas de la violencia, como los de Belén bajo la orden de Herodes; que nuestro auxilio, el nombre del Señor, los reciba en su gloria; y que Raquel deje de llorar al ver a sus hijos consolados en Dios.",
      "gospel": "Que protejamos a los más indefensos como José protegió al Niño Jesús huyendo de la furia de Herodes, y que el clamor de Raquel por sus hijos nos mueva a defender siempre la vida inocente.",
      "closing": "Dios de los pequeños e indefensos, que permitiste que los inocentes de Belén dieran testimonio de tu Hijo con su propia sangre, protege hoy a todos los niños amenazados por la violencia. Por Jesucristo nuestro Señor."
    }
  }
};

  function getSpecificPetitions(lKey, cycle) {
    if (!lKey) return null;
    const entry = INTERCESSIONS_BY_SUNDAY[lKey];
    if (!entry) return null;
    return entry[cycle] || entry.all || null;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  GENERACIÓN DINÁMICA DE INTERCESIONES
  // ══════════════════════════════════════════════════════════════════════════
  // `dayKey` (opcional) es la clave del día de calendar.js. Hace falta además de
  // `lKey` porque las ferias que siguen a la Trinidad toman prestadas las
  // lecturas del Domingo (lKey === 'trinity') sin ser la solemnidad.
  function generateIntercessions(gospelRef, dayName, season, cycle, gospelText, lKey, dayKey) {
    const themeKey = detectThemeKey(gospelRef, gospelText);
    const themeDesc = THEME_DESCRIPTIONS[themeKey] || THEME_DESCRIPTIONS['fe'];
    const response = '<strong>R/. Señor, escucha nuestra oración.</strong>';
    // La intención «Al celebrar el misterio de la Santísima Trinidad» es propia de
    // la solemnidad (clave 'trinity'), no del tiempo después de la Trinidad: con
    // season === 'trinity' se rezaba en los ~6.600 domingos y ferias de todo ese
    // tiempo. Fuera de la solemnidad no se añade intención estacional. Si quien
    // llama no pasa dayKey, se decide por lKey como antes.
    const isTrinitySolemnity = (dayKey !== undefined && dayKey !== null) ? dayKey === 'trinity' : lKey === 'trinity';
    const seasonal = (season === 'trinity' && !isTrinitySolemnity) ? null : getSeasonalIntention(season);
    const specific = getSpecificPetitions(lKey, cycle);

    const header = `<span class="lit-rubric">(El Sacerdote o Diácono introduce las oraciones:)</span>
<span class="lit-line sacerdote"><span class="lit-label">S.</span><span class="lit-text">Oremos al Señor, recordando el tema del Santo Evangelio de hoy: <em>${themeDesc}</em>.</span></span>`;

    const petitions = [];

    // 1. Por la Iglesia (específica del domingo, o por tema si no hay entrada)
    petitions.push({
      intro: 'Por la Santa Iglesia Católica:',
      body: `${(specific && specific.church) || CHURCH_PETITIONS[themeKey] || CHURCH_PETITIONS['fe']} Roguemos al Señor.
${response}`,
    });

    // 2. Intención estacional (si aplica)
    if (seasonal) {
      petitions.push({
        intro: 'Intención propia de la temporada:',
        body: seasonal,
      });
    }

    // 3. Por el mundo (específica del domingo, o por tema si no hay entrada)
    petitions.push({
      intro: 'Por las naciones del mundo y los que las gobiernan:',
      body: `${(specific && specific.world) || WORLD_PETITIONS[themeKey] || WORLD_PETITIONS['fe']} Roguemos al Señor.
${response}`,
    });

    // 4. Por la parroquia (específica del domingo, o por tema si no hay entrada)
    petitions.push({
      intro: 'Por esta congregación y comunidad parroquial:',
      body: `${(specific && specific.parish) || PARISH_PETITIONS[themeKey] || PARISH_PETITIONS['fe']} Roguemos al Señor.
${response}`,
    });

    // 5. Por los enfermos y necesitados (específica del domingo, o por tema si no hay entrada)
    petitions.push({
      intro: 'Por los enfermos, los que sufren y los necesitados:',
      body: `${(specific && specific.suffering) || SUFFERING_PETITIONS[themeKey] || SUFFERING_PETITIONS['fe']} Roguemos al Señor.
${response}`,
    });

    // 6. Por los difuntos (específica del domingo, o por tema si no hay entrada)
    petitions.push({
      intro: 'Por los fieles difuntos:',
      body: `${(specific && specific.dead) || DEAD_PETITIONS[themeKey] || DEAD_PETITIONS['fe']} Roguemos al Señor.
${response}`,
    });

    // 7. Petición del Evangelio (específica del domingo, o por tema si no hay entrada)
    petitions.push({
      // La referencia llega en inglés («Matthew 21:23-32»): solo el rótulo se traduce.
      intro: `En el espíritu del Evangelio de hoy (${gospelRef ? (typeof translateBibleReference === 'function' ? translateBibleReference(gospelRef) : gospelRef) : 'del día'}):`,
      body: `${(specific && specific.gospel) || GOSPEL_PETITIONS[themeKey] || GOSPEL_PETITIONS['fe']} Roguemos al Señor.
${response}`,
    });

    // Oración de conclusión (específica del domingo, o por tema si no hay entrada)
    const closingPrayer = (specific && specific.closing) || CLOSING_PRAYERS[themeKey] || CLOSING_PRAYERS['fe'];
    const close = `<span class="lit-rubric">(El Sacerdote concluye:)</span>
<span class="lit-line sacerdote"><span class="lit-label">S.</span><span class="lit-text">${closingPrayer}</span></span>
<span class="lit-line ministros"><span class="lit-label">M.</span><span class="lit-text">Amén.</span></span>`;

    return { header, petitions, close };
  }

  return { generateIntercessions };
})();
