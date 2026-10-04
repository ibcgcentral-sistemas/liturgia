/**
 * eucharist.js — El Ordinario de la Santa Eucaristía (Texto Estándar Anglicano)
 * Libro de Oración Común (2019), ACNA
 *
 * Texto transcrito fielmente del PDF fuente (líneas 2649-3172 del Libro de
 * Oración Común 2019 convertido a Markdown). A diferencia del Misal
 * Anglicano (js/canon.js), este es un solo rito (sin variantes de Canon
 * 1549/1662/1928/Romano) y no maneja latín — el "Texto Estándar Anglicano"
 * se presenta enteramente en español contemporáneo.
 *
 * Solo tres piezas varían según el día (vienen de BCPPropers/BCPLectionary,
 * insertadas por app.js): la Colecta del Día, las Lecturas, y el Prefacio.
 * Todo lo demás — incluida la Oración de Poscomunión — es fijo.
 */

const BCPEucharist = (() => {

  const CEL    = txt => `<span class="lit-line sacerdote"><span class="lit-label">Cel.</span><span class="lit-text">${txt}</span></span>`;
  const PUEBLO = txt => `<span class="lit-line pueblo"><span class="lit-label">Pueblo</span><span class="lit-text">${txt}</span></span>`;
  const LECTOR = txt => `<span class="lit-line lector"><span class="lit-label">Lector</span><span class="lit-text">${txt}</span></span>`;
  const TODOS  = txt => `<span class="lit-line todos"><span class="lit-label">Todos</span><span class="lit-text">${txt}</span></span>`;
  const R      = txt => `<span class="lit-rubric">(${txt})</span>`;
  const TITLE  = txt => `<span class="lit-title">${txt}</span>`;
  const CONSEC = txt => `<span class="lit-consecracion">${txt}</span>`;
  const PRAYER = txt => `<span class="lit-prayer">${txt}</span>`;

  function render(arr) {
    return arr.map(item => {
      switch (item.type) {
        case 'CEL': return CEL(item.text);
        case 'PUEBLO': return PUEBLO(item.text);
        case 'LECTOR': return LECTOR(item.text);
        case 'TODOS': return TODOS(item.text);
        case 'R': return R(item.text);
        case 'T': return TITLE(item.text);
        case 'C': return CONSEC(item.text);
        case 'O': return PRAYER(item.text);
        default: return '';
      }
    }).join('');
  }

  // ── LA ACLAMACIÓN (con variantes de Cuaresma y Pascua) ──────────────────
  const ACCLAMATION_DATA = [
    { type: 'R', text: 'La gente de pie, el celebrante dice esto o un saludo de temporada.' },
    { type: 'CEL', text: 'Bendito sea Dios: Padre, Hijo y Espíritu Santo.' },
    { type: 'PUEBLO', text: 'Y bendito sea su reino, ahora y por siempre. Amén.' },
  ];
  const ACCLAMATION_LENT_DATA = [
    { type: 'R', text: 'En el tiempo de Cuaresma.' },
    { type: 'CEL', text: 'Bendigamos al Señor que perdona todos nuestros pecados.' },
    { type: 'PUEBLO', text: 'Su misericordia perdura para siempre.' },
  ];
  const ACCLAMATION_EASTER_DATA = [
    { type: 'R', text: 'Desde el día de Resurrección hasta la Víspera de Pentecostés.' },
    { type: 'CEL', text: '¡Aleluya! ¡Cristo ha resucitado!' },
    { type: 'PUEBLO', text: '¡Ciertamente el Señor ha resucitado! ¡Aleluya!' },
  ];

  // ── LA COLECTA POR PUREZA ────────────────────────────────────────────────
  const COLLECT_FOR_PURITY_DATA = [
    { type: 'R', text: 'El Celebrante reza (y la gente puede ser invitada a unirse).' },
    { type: 'O', text: 'Dios Todopoderoso, para quien todos los corazones están manifiestos, todos los deseos conocidos, y de Ti no se esconde ningún secreto: Limpia los pensamientos de nuestros corazones con la inspiración de tu Espíritu Santo, para que nuestro amor sea más perfecto y podamos engrandecer dignamente tu Santo Nombre; Por Cristo nuestro Señor. Amén.' },
  ];

  // ── RESUMEN DE LA LEY (o el Decálogo, en su lugar) ───────────────────────
  const SUMMARY_OF_LAW_DATA = [
    { type: 'T', text: 'Resumen de la Ley' },
    { type: 'CEL', text: 'Oigan lo que dice Jesucristo nuestro Señor: "Amarás al Señor tu Dios con todo tu corazón, con toda tu alma y con toda tu mente. Este es el primer y mayor mandamiento. Y el segundo es semejante a éste: amarás a tu prójimo como a ti mismo. De estos dos mandamientos dependen toda la Ley y los Profetas."' },
    { type: 'R', text: 'Mateo 22:37-40' },
  ];

  // ── KYRIE / TRISAGIO ─────────────────────────────────────────────────────
  const KYRIE_DATA = [
    { type: 'CEL', text: 'Señor, ten piedad de nosotros.' },
    { type: 'PUEBLO', text: 'Cristo, ten piedad de nosotros.' },
    { type: 'CEL', text: 'Señor, ten piedad de nosotros.' },
  ];
  const TRISAGION_DATA = [
    { type: 'TODOS', text: 'Santo Dios, Santo y Fuerte, Santo Inmortal, ten misericordia de nosotros.' },
  ];

  // ── EL GLORIA EN LAS ALTURAS ─────────────────────────────────────────────
  const GLORIA_DATA = [
    { type: 'R', text: 'Se puede cantar o decir el Gloria u otro cántico de alabanza, todos de pie. Es apropiado omitirlo en tiempos de penitencia y días de ayuno.' },
    { type: 'TODOS', text: 'Gloria a Dios en el cielo, y paz en la tierra a quienes ama el Señor. Por tu inmensa gloria te alabamos, te bendecimos, te adoramos, te glorificamos, te damos gracias; Señor Dios, Rey celestial, Dios Padre Todopoderoso. Señor, Hijo único Jesucristo, Señor Dios, Cordero de Dios, Hijo del Padre: Tú que quitas el pecado del mundo, ten piedad de nosotros; Tú que quitas el pecado del mundo, atiende a nuestra súplica; Tú que estás sentado a la derecha del Padre, ten piedad de nosotros. Porque solo tú eres Santo, sólo tú Señor, sólo tú Altísimo, Jesucristo, con el Espíritu Santo, en la gloria de Dios Padre. Amén.' },
  ];

  // ── SALUTACIÓN ANTES DE LA COLECTA DEL DÍA ──────────────────────────────
  const SALUTATION_DATA = [
    { type: 'CEL', text: 'El Señor esté con ustedes.' },
    { type: 'PUEBLO', text: 'Y con tu espíritu.' },
    { type: 'CEL', text: 'Oremos.' },
  ];

  // ── EL CREDO NICENO ───────────────────────────────────────────────────────
  const CREED_DATA = [
    { type: 'R', text: 'Los domingos y otros días festivos, todos se ponen de pie para recitar el Credo de Nicea.' },
    { type: 'CEL', text: 'Confesemos nuestra fe en las palabras del Credo Niceno:' },
    { type: 'TODOS', text: 'Creemos en un solo Dios, Padre todopoderoso, creador del cielo y de la tierra, de todo lo visible y lo invisible. Creemos en un solo Señor Jesucristo, Hijo único de Dios, nacido del Padre antes de todos los siglos: Dios de Dios, luz de luz, Dios verdadero de Dios verdadero, engendrado, no creado, de la misma naturaleza del Padre por quien todo fue hecho; que por nosotros y por nuestra salvación bajó del cielo: y por obra del Espíritu Santo se encarnó de María la Virgen, y se hizo hombre. Por nuestra causa fue crucificado en tiempos de Poncio Pilato: padeció y fue sepultado. Resucitó al tercer día, según las escrituras; subió al cielo, y está sentado a la derecha del Padre. De nuevo vendrá con gloria para juzgar a vivos y muertos, y su reino no tendrá fin. Creemos en el Espíritu Santo, Señor y dador de vida, que procede del Padre y del Hijo; que con el Padre y el Hijo recibe una misma adoración y gloria, y que habló por los profetas. Creemos en la Iglesia, que es una, santa, católica y apostólica. Confesamos que hay un solo Bautismo para el perdón de los pecados. Esperamos la resurrección de los muertos y la vida del mundo futuro. Amén.' },
  ];

  // ── ORACIÓN DE LOS FIELES (texto fijo, no varía por domingo) ────────────
  const PRAYERS_OF_THE_PEOPLE_DATA = [
    { type: 'R', text: 'El Diácono u otra persona designada dice estas oraciones.' },
    { type: 'LECTOR', text: 'Oremos por la Iglesia y por el mundo: Dios todopoderoso y eterno, tu santa Palabra nos enseña a ofrecer oraciones y súplicas y a dar gracias por todas las personas. Humildemente te pedimos que recibas nuestras oraciones con misericordia. Inspira continuamente a la Iglesia universal con el espíritu de verdad, unidad y concordia; y haz que todos los que confiesen tu santo Nombre estén de acuerdo en la verdad de tu Santa Palabra y vivan en unidad y piadoso amor.' },
    { type: 'R', text: 'Silencio' },
    { type: 'LECTOR', text: 'Señor, en tu misericordia:' },
    { type: 'PUEBLO', text: 'Escucha nuestra oración.' },
    { type: 'LECTOR', text: 'Te imploramos que conduzcas a las naciones del mundo por el camino de la justicia; y que asimismo guíes y dirijas a sus líderes, para que tu pueblo pueda disfrutar de las bendiciones de la libertad y la paz. Concede que nuestros líderes administren justicia imparcialmente, defiendan la integridad y la verdad, refrenen la maldad y el vicio, y protejan la verdadera religión y virtud.' },
    { type: 'R', text: 'Silencio' },
    { type: 'LECTOR', text: 'Señor, en tu misericordia:' },
    { type: 'PUEBLO', text: 'Escucha nuestra oración.' },
    { type: 'LECTOR', text: 'Dales gracia, Padre celestial, a todos los Obispos, Sacerdotes y Diáconos, para que, por sus vidas y enseñanzas, proclamen tu verdadera y vivificante Palabra, administrando justa y debidamente tus santos sacramentos. Y a todo tu pueblo dale tu gracia celestial, especialmente a esta Congregación, para que con corazones reverentes y obedientes podamos escuchar y recibir tu Santa Palabra, y servirte en santidad y justicia todos los días de nuestra vida.' },
    { type: 'R', text: 'Silencio' },
    { type: 'LECTOR', text: 'Señor, en tu misericordia:' },
    { type: 'PUEBLO', text: 'Escucha nuestra oración.' },
    { type: 'LECTOR', text: 'Te pedimos que hagas prosperar a todos los que proclaman el Evangelio de tu reino en todo el mundo, y que nos des fortaleza a fin de que cumplamos tu gran comisión de hacer discípulos a todas las naciones, bautizándolos y enseñándoles a obedecer todo lo que Tú nos has mandado.' },
    { type: 'R', text: 'Silencio' },
    { type: 'LECTOR', text: 'Señor, en tu misericordia:' },
    { type: 'PUEBLO', text: 'Escucha nuestra oración.' },
    { type: 'LECTOR', text: 'Te pedimos en tu bondad, oh Señor, que consueles y sostengas a todos los que en esta vida transitoria se encuentran en problemas, aflicciones, necesidades, enfermedades o cualquier otra adversidad.' },
    { type: 'R', text: 'Silencio' },
    { type: 'LECTOR', text: 'Señor, en tu misericordia:' },
    { type: 'PUEBLO', text: 'Escucha nuestra oración.' },
    { type: 'LECTOR', text: 'Recordamos ante Ti a todos tus siervos que han partido de esta vida en tu fe y temor, para que se cumpla tu voluntad en ellos; y te pedimos que nos des la gracia de seguir los buenos ejemplos de todos tus santos, para que podamos compartir con ellos en tu reino celestial.' },
    { type: 'R', text: 'Silencio' },
    { type: 'LECTOR', text: 'Señor, en tu misericordia:' },
    { type: 'PUEBLO', text: 'Escucha nuestra oración.' },
    { type: 'R', text: 'Se pueden agregar oraciones adicionales. El Celebrante concluye con esta u otra Colecta apropiada.' },
    { type: 'CEL', text: 'Padre Celestial, concédenos estas oraciones nuestras por amor a Jesucristo, nuestro único Mediador y Abogado, que vive y reina contigo en la unidad del Espíritu Santo, un solo Dios, ahora y por siempre. Amén.' },
  ];

  // ── CONFESIÓN Y ABSOLUCIÓN DE LOS PECADOS ────────────────────────────────
  const CONFESSION_DATA = [
    { type: 'R', text: 'El diácono u otra persona designada dice lo siguiente.' },
    { type: 'LECTOR', text: 'Todas las personas que se arrepienten verdadera y sinceramente de sus pecados, y buscan vivir en amor y caridad con su prójimo, y tienen la intención de llevar una nueva vida, siguiendo los mandamientos de Dios y caminando en sus santos caminos: acérquense con fe y hagan su humilde confesión a Dios Todopoderoso.' },
    { type: 'R', text: 'Silencio. El diácono y el pueblo se arrodillan si pueden y rezan.' },
    { type: 'TODOS', text: 'Dios Todopoderoso, Padre de nuestro Señor Jesucristo, Creador y juez de todos nosotros: Confesamos y lamentamos nuestros muchos pecados y ofensas, que hemos cometido de pensamiento, palabra y obra contra tu divina majestad, provocando muy justamente tu razonable ira contra nosotros. Sentimos profundamente nuestras transgresiones; la carga de ellas es más de lo que podemos soportar. Ten misericordia de nosotros, ten misericordia de nosotros, Padre misericordioso; por amor de tu Hijo, nuestro Señor Jesucristo, perdónanos todo lo pasado; y concédenos que podamos servirte y agradarte cada vez más en una vida nueva, para el honor y la gloria de tu Nombre; por Jesucristo nuestro Señor. Amén.' },
    { type: 'R', text: 'El obispo o sacerdote se pone de pie y dice.' },
    { type: 'CEL', text: 'Dios omnipotente, nuestro Padre celestial, que en su gran misericordia ha prometido el perdón de pecados a todos los que con sincero arrepentimiento y verdadera fe se vuelven a él, tenga misericordia de ustedes, los perdone y los libere de todos sus pecados, los confirme y los fortalezca en toda virtud, y los conduzca a la vida eterna; mediante Jesucristo nuestro Señor. Amén.' },
  ];

  // ── PALABRAS RECONFORTANTES ──────────────────────────────────────────────
  const COMFORTABLE_WORDS_DATA = [
    { type: 'R', text: 'El Celebrante puede entonces decir una o más de las siguientes, diciendo primero.' },
    { type: 'CEL', text: 'Escuchen la Palabra de Dios todos los que verdaderamente se vuelven a Él.' },
    { type: 'O', text: '"Vengan a mí todos ustedes que están cansados y agobiados, y yo les daré descanso." (Mateo 11:28)' },
    { type: 'O', text: 'Porque tanto amó Dios al mundo que dio a su Hijo unigénito, para que todo el que cree en Él no se pierda, sino que tenga vida eterna. (Juan 3:16)' },
    { type: 'O', text: 'Este mensaje es digno de crédito y merece ser aceptado por todos: que Cristo Jesús vino al mundo a salvar a los pecadores, de los cuales yo soy el primero. (1 Timoteo 1:15)' },
    { type: 'O', text: 'Mis queridos hijos, les escribo estas cosas para que no pequen. Pero, si alguno peca, tenemos ante el Padre a un intercesor, a Jesucristo, el Justo. Él es el sacrificio por el perdón de nuestros pecados, y no solo por los nuestros, sino por los de todo el mundo. (1 Juan 2:1-2)' },
  ];

  // ── LA PAZ ────────────────────────────────────────────────────────────────
  const PEACE_DATA = [
    { type: 'CEL', text: 'La paz del Señor esté siempre con ustedes.' },
    { type: 'PUEBLO', text: 'Y con tu espíritu.' },
    { type: 'R', text: 'Entonces los Ministros y el Pueblo podrán saludarse en el Nombre del Señor.' },
  ];

  // ── EL OFERTORIO ──────────────────────────────────────────────────────────
  const OFFERTORY_SENTENCE_DATA = [
    { type: 'R', text: 'El Celebrante puede comenzar el Ofertorio con un versículo de las Escrituras. El Pueblo se pone de pie mientras se presentan las ofrendas.' },
    { type: 'CEL', text: 'Tuyos son, Señor, la grandeza y el poder, la gloria, la victoria y la majestad. Tuyo es todo cuanto hay en el cielo y en la tierra. Tuyo también es el reino, Tú estás por encima de todo, y todas las cosas proceden de Ti, Señor,' },
    { type: 'PUEBLO', text: 'Y lo que te hemos dado, de Ti lo hemos recibido.' },
    { type: 'R', text: '1 Crónicas 29:11, 14' },
  ];

  // ── SURSUM CORDA (diálogo fijo; el Prefacio propio se inserta después) ──
  const SURSUM_CORDA_DATA = [
    { type: 'CEL', text: 'El Señor esté con ustedes.' },
    { type: 'PUEBLO', text: 'Y con tu espíritu.' },
    { type: 'CEL', text: 'Levantemos el corazón.' },
    { type: 'PUEBLO', text: 'Lo tenemos levantado hacia el Señor.' },
    { type: 'CEL', text: 'Demos gracias al Señor nuestro Dios.' },
    { type: 'PUEBLO', text: 'Es justo darle gracias y alabanza.' },
    { type: 'CEL', text: 'Realmente es justo, nuestro deber y nuestro gozo, darte gracias en todo tiempo y lugar, oh Señor Todopoderoso, Creador del cielo y de la tierra.' },
    { type: 'R', text: 'Aquí normalmente se canta o se dice el Prefacio indicado.' },
  ];
  const SURSUM_CORDA_CLOSE_DATA = [
    { type: 'CEL', text: 'Por lo tanto, nosotros te alabamos, uniendo nuestras voces a los Ángeles y Arcángeles y a toda la compañía del cielo, que cantan por siempre este himno para proclamar la gloria de tu Nombre:' },
  ];

  // ── EL SANCTUS ────────────────────────────────────────────────────────────
  const SANCTUS_DATA = [
    { type: 'TODOS', text: 'Santo, Santo, Santo es el Señor, Dios del universo, llenos están el cielo y la tierra de tu gloria. Hosanna en el cielo. Bendito el que viene en el Nombre del Señor. Hosanna en el cielo.' },
  ];

  // ── LA ORACIÓN DE CONSAGRACIÓN ───────────────────────────────────────────
  const PRAYER_OF_CONSECRATION_DATA = [
    { type: 'R', text: 'El pueblo se arrodilla o se pone de pie. El Celebrante continúa.' },
    { type: 'O', text: 'Toda alabanza y gloria es tuya, oh Dios nuestro Padre celestial, porque en tu tierna misericordia, diste a tu único Hijo Jesucristo para que sufriera la muerte en la Cruz por nuestra redención. De este modo, Él hizo de su única oblación de sí mismo ofrecida una vez, un sacrificio, oblación y satisfacción completos, perfectos y suficientes, por los pecados del mundo entero; y la instituyó, y en su Santo Evangelio nos ordenó continuar, un recuerdo perpetuo de su preciosa muerte y sacrificio, hasta su regreso.' },
    { type: 'O', text: 'Y ahora, Oh Padre misericordioso, en tu gran bondad, te pedimos que bendigas y santifiques, con tu Palabra y con tu Espíritu Santo, estos dones de pan y vino, para que nosotros, recibiéndolos según la santa institución de tu Hijo, nuestro Salvador Jesucristo, y en memoria de su pasión y muerte, podamos ser partícipes de su más bendito Cuerpo y Sangre.' },
    { type: 'R', text: 'En las palabras sobre el pan, el Celebrante sostiene o pone una mano sobre él, y puede partirlo; y en las palabras sobre el cáliz, sostiene o coloca una mano sobre el cáliz.' },
    { type: 'C', text: 'Porque, la misma noche en que fue traicionado, nuestro Señor Jesucristo tomó pan; y habiendo dado gracias, lo partió y se lo dio a sus discípulos, diciendo: "Tomen, y coman; Este es mi Cuerpo, que será entregado por ustedes: Hagan esto en memoria mía".' },
    { type: 'C', text: 'Asimismo, después de la cena, Jesús tomó el cáliz, y habiendo dado gracias, se lo dio a ellos, diciendo: "Beban todos de él; porque esta es mi Sangre de la Nueva Alianza, que será derramada por ustedes y por muchos para perdón de los pecados: Siempre que lo beban, háganlo en memoria de Mí".' },
    { type: 'O', text: 'Por lo tanto, Oh Señor y Padre celestial, según la institución de tu amado Hijo nuestro Salvador Jesucristo, nosotros tus humildes servidores, celebramos y hacemos aquí ante tu divina Majestad, con estos santos dones, el memorial que tu Hijo nos mandó hacer; recordando su bendita pasión y preciosa muerte, su poderosa resurrección y gloriosa ascensión, y su promesa de volver.' },
    { type: 'O', text: 'Y deseamos sinceramente que tu bondad paternal acepte misericordiosamente este, nuestro sacrificio de alabanza y acción de gracias; pidiéndote que nos concedas, por los méritos y la muerte de tu Hijo Jesucristo, y por la fe en su Sangre, que nosotros y toda tu Iglesia podamos obtener el perdón de nuestros pecados y todos los demás beneficios de su pasión.' },
    { type: 'O', text: 'Y aquí te ofrecemos y te presentamos, oh Señor, a nosotros mismos y nuestras almas y cuerpos, para ser un sacrificio razonable, santo y vivo. Oramos humildemente para que todos los que participan de esta Sagrada Comunión, reciban dignamente el precioso Cuerpo y Sangre de tu Hijo Jesucristo, que sean llenos de tu gracia y bendición celestial, y sean hechos un solo cuerpo con él, para que Él more en nosotros y nosotros en Él.' },
    { type: 'O', text: 'Y aunque somos indignos, debido a nuestros muchos pecados, de ofrecerte cualquier sacrificio; sin embargo, te pedimos que aceptes esta deuda y servicio que te debemos, no sopesando nuestros méritos, sino perdonando nuestras ofensas, por Jesucristo nuestro Señor.' },
    { type: 'O', text: 'Por Cristo, con Él, y en Él, en la unidad del Espíritu Santo, todo honor y toda gloria son tuyos, Padre Todopoderoso, ahora y por siempre. Amén.' },
  ];

  // ── LA ORACIÓN DEL SEÑOR ──────────────────────────────────────────────────
  const LORDS_PRAYER_DATA = [
    { type: 'R', text: 'Y ahora, orando como Nuestro Salvador Jesucristo nos enseñó, nos atrevemos a decir:' },
    { type: 'TODOS', text: 'Padre Nuestro que estás en el cielo, santificado sea tu Nombre, venga tu reino, hágase tu voluntad, en la tierra como en el cielo. Danos hoy nuestro pan de cada día. Perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden. No nos dejes caer en tentación y líbranos del mal. Porque tuyo es el reino, tuyo es el poder, y tuya es la gloria, ahora y por siempre. Amén.' },
  ];

  // ── LA FRACCIÓN (con variante de Cuaresma, sin Aleluya) ─────────────────
  const FRACTION_DATA = [
    { type: 'R', text: 'Si el Pan consagrado no se partió antes, el Celebrante lo parte ahora. Se guarda un período de silencio.' },
    { type: 'CEL', text: '[Aleluya.] Cristo, nuestra Pascua, es sacrificado por nosotros.' },
    { type: 'PUEBLO', text: 'Celebremos la fiesta. [Aleluya.]' },
    { type: 'R', text: 'En Cuaresma se omite el Aleluya, y puede omitirse en otros momentos excepto en Pascua.' },
  ];
  const FRACTION_LENT_DATA = [
    { type: 'R', text: 'Si el Pan consagrado no se partió antes, el Celebrante lo parte ahora. Se guarda un período de silencio.' },
    { type: 'CEL', text: 'Cristo, nuestra Pascua, es sacrificado por nosotros.' },
    { type: 'PUEBLO', text: 'Celebremos la fiesta.' },
    { type: 'R', text: 'En Cuaresma se omite el Aleluya.' },
  ];

  // ── ORACIÓN DE HUMILDE ACCESO ────────────────────────────────────────────
  const HUMBLE_ACCESS_DATA = [
    { type: 'R', text: 'Juntos, Celebrante y Pueblo pueden decir.' },
    { type: 'TODOS', text: 'Nosotros no nos atrevemos a venir a esta tu mesa, oh Señor misericordioso, confiados en nuestra rectitud, sino en tus muchas y grandes misericordias. No somos dignos ni aun de recoger las migajas debajo de tu mesa; mas Tú eres el mismo Señor, cuyo carácter es siempre de tener misericordia. Concédenos, por tanto, Señor, por tu clemencia, que de tal modo comamos la Carne de tu amado Hijo Jesucristo y bebamos su Sangre, que nuestros cuerpos pecadores sean purificados por su Cuerpo, y nuestras almas lavadas por su más Preciosa Sangre, y para que siempre vivamos en Él, y Él en nosotros. Amén.' },
  ];

  // ── EL AGNUS DEI ──────────────────────────────────────────────────────────
  const AGNUS_DEI_DATA = [
    { type: 'TODOS', text: 'Cordero de Dios, que quitas el pecado del mundo; ten misericordia de nosotros. Cordero de Dios, que quitas el pecado del mundo; ten misericordia de nosotros. Cordero de Dios, que quitas el pecado del mundo; danos tu paz.' },
  ];

  // ── LA ADMINISTRACIÓN DE LA COMUNIÓN ─────────────────────────────────────
  const ADMINISTRATION_DATA = [
    { type: 'R', text: 'Frente al Pueblo, el Celebrante puede decir la siguiente invitación.' },
    { type: 'CEL', text: 'Los Dones de Dios para el Pueblo de Dios. Tómenlos en memoria de que Cristo murió por ustedes, y aliméntense de Él en sus corazones, por fe y con agradecimiento.' },
    { type: 'R', text: 'Los ministros reciben el sacramento en ambas formas y luego lo entregan inmediatamente al pueblo. El Pan y el Cáliz se entregan a los comulgantes con estas palabras.' },
    { type: 'CEL', text: 'El Cuerpo de nuestro Señor Jesucristo, que fue entregado por ti, preserve tu cuerpo y alma para la vida eterna. Toma y come esto en memoria de que Cristo murió por ti, y aliméntate de Él en tu corazón por la fe, con acción de gracias.' },
    { type: 'CEL', text: 'La Sangre de nuestro Señor Jesucristo, que fue derramada por ti, preserve tu cuerpo y alma para la vida eterna. Bebe esto en memoria de que la Sangre de Cristo fue derramada por ti, y sé agradecido.' },
    { type: 'R', text: 'Durante la administración de la Comunión, se pueden cantar himnos, salmos o antífonas.' },
  ];

  // ── ORACIÓN DESPUÉS DE LA COMUNIÓN (texto fijo) ──────────────────────────
  const POST_COMMUNION_DATA = [
    { type: 'CEL', text: 'Oremos:' },
    { type: 'TODOS', text: 'Omnipotente y Eterno Dios, Te damos gracias porque nos has nutrido en estos santos misterios, con el alimento espiritual del preciosísimo Cuerpo y Sangre de tu Hijo, nuestro Salvador Jesucristo; y porque nos aseguras, por este sacramento, de tu favor y benevolencia hacia nosotros: que seamos verdaderos miembros del Cuerpo místico de tu Hijo, la bendita compañía de todos tus fieles; y que seamos también herederos, por la esperanza, de tu reino eterno. Y ahora, Padre celestial, humildemente te pedimos que nos asistas con tu gracia para continuar en tu santa comunión y caminar con todas las obras buenas que nos has preparado para realizar. Te lo pedimos por Jesucristo Nuestro Señor, quien contigo, y el Espíritu Santo, reciben todo honor y gloria, ahora y por siempre. Amén.' },
  ];

  // ── LA BENDICIÓN ──────────────────────────────────────────────────────────
  const BLESSING_DATA = [
    { type: 'R', text: 'El obispo, cuando está presente, o el sacerdote, da esta bendición o una alternativa.' },
    { type: 'CEL', text: 'La paz de Dios, que sobrepasa todo entendimiento, guarde su corazón y su mente en el conocimiento y el amor de Dios y de su Hijo Jesucristo, nuestro Señor; y la bendición de Dios Todopoderoso, Padre, Hijo y Espíritu Santo, esté con todos ustedes y permanezca para siempre. Amén.' },
  ];

  // ── LA DESPEDIDA ──────────────────────────────────────────────────────────
  const DISMISSAL_DATA = [
    { type: 'CEL', text: 'Salgamos en el Nombre de Cristo.' },
    { type: 'PUEBLO', text: 'Demos gracias a Dios.' },
  ];
  const DISMISSAL_ALLELUIA_DATA = [
    { type: 'CEL', text: 'Salgamos en el Nombre de Cristo, aleluya, aleluya.' },
    { type: 'PUEBLO', text: 'Demos gracias a Dios, aleluya, aleluya.' },
  ];

  // ── VERSIONES EN TEXTO PLANO ─────────────────────────────────────────────
  // El Librito del Pueblo (librito-pueblo.js) necesita el texto sin el HTML de
  // render(). Se derivan de los MISMOS arreglos *_DATA que la liturgia
  // principal — nunca se copia ni se redacta nada aparte, de modo que Misal y
  // Librito no pueden divergir. Cada pieza es una lista congelada de
  // { type, text } (mismos tipos que render(): CEL, PUEBLO, TODOS, LECTOR, R,
  // T, C, O); `text` no contiene HTML.
  const plainOf = arr => Object.freeze(arr.map(({ type, text }) => Object.freeze({ type, text })));
  const PLAIN = Object.freeze({
    OFFERTORY_SENTENCE: plainOf(OFFERTORY_SENTENCE_DATA),
    PRAYER_OF_CONSECRATION: plainOf(PRAYER_OF_CONSECRATION_DATA),
    HUMBLE_ACCESS: plainOf(HUMBLE_ACCESS_DATA),
    ADMINISTRATION: plainOf(ADMINISTRATION_DATA),
    POST_COMMUNION: plainOf(POST_COMMUNION_DATA),
  });

  return {
    PLAIN,
    ACCLAMATION: render(ACCLAMATION_DATA),
    ACCLAMATION_LENT: render(ACCLAMATION_LENT_DATA),
    ACCLAMATION_EASTER: render(ACCLAMATION_EASTER_DATA),
    COLLECT_FOR_PURITY: render(COLLECT_FOR_PURITY_DATA),
    SUMMARY_OF_LAW: render(SUMMARY_OF_LAW_DATA),
    KYRIE: render(KYRIE_DATA),
    TRISAGION: render(TRISAGION_DATA),
    GLORIA: render(GLORIA_DATA),
    SALUTATION: render(SALUTATION_DATA),
    CREED: render(CREED_DATA),
    PRAYERS_OF_THE_PEOPLE: render(PRAYERS_OF_THE_PEOPLE_DATA),
    CONFESSION: render(CONFESSION_DATA),
    COMFORTABLE_WORDS: render(COMFORTABLE_WORDS_DATA),
    PEACE: render(PEACE_DATA),
    OFFERTORY_SENTENCE: render(OFFERTORY_SENTENCE_DATA),
    SURSUM_CORDA: render(SURSUM_CORDA_DATA),
    SURSUM_CORDA_CLOSE: render(SURSUM_CORDA_CLOSE_DATA),
    SANCTUS: render(SANCTUS_DATA),
    PRAYER_OF_CONSECRATION: render(PRAYER_OF_CONSECRATION_DATA),
    LORDS_PRAYER: render(LORDS_PRAYER_DATA),
    FRACTION: render(FRACTION_DATA),
    FRACTION_LENT: render(FRACTION_LENT_DATA),
    HUMBLE_ACCESS: render(HUMBLE_ACCESS_DATA),
    AGNUS_DEI: render(AGNUS_DEI_DATA),
    ADMINISTRATION: render(ADMINISTRATION_DATA),
    POST_COMMUNION: render(POST_COMMUNION_DATA),
    BLESSING: render(BLESSING_DATA),
    DISMISSAL: render(DISMISSAL_DATA),
    DISMISSAL_ALLELUIA: render(DISMISSAL_ALLELUIA_DATA),
  };

})();
