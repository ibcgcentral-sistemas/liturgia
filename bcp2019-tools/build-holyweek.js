// Genera bcp2019/js/holyweek-data.js con las liturgias de la Semana Santa, COPIADAS del libro oficial en español
// (LOC-10-10-23.md): Liturgia de las Palmas, Jueves Santo, Viernes Santo y Sábado Santo. El texto se corta por anclas
// del libro, no se reescribe: así no se transcribe nada a mano y test-bcp2019.js puede comprobar que el archivo
// generado sigue siendo idéntico a lo que da este script.
// Uso: node bcp2019-tools/build-holyweek.js [LOC-10-10-23.md]          (escribe el archivo)
//      node bcp2019-tools/build-holyweek.js --preview [secciones]      (lista cómo clasificó cada línea, para revisar)
// El libro no distingue en el Markdown las rúbricas del texto; se clasifican por su forma (ver `tipo`). Es heurística:
// por eso hay una vista previa y las excepciones van en OVERRIDES, por texto de la línea.
'use strict';
const fs = require('fs');
const path = require('path');

const LOC_POR_DEFECTO = 'C:/Users/gonza/OneDrive/Desktop/ESCRITORIO/Liturgia/LOC-10-10-23.md';

// Secciones: [ancla de inicio, ancla de fin (exclusiva; null = hasta una línea concreta), desde la línea N del libro]
// Cada ancla es el comienzo (trim) de una línea del libro.
const SECCIONES = {
  palmSundayPalms: { ini: 'LA LITURGIA DE LAS PALMAS', fin: 'EN LA EUCARISTÍA', desde: 14700 },
  maundyThursdayOpening: { ini: 'Esta liturgia se celebra por la tarde.', fin: 'LA ORACIÓN COLECTA', desde: 14800 },
  maundyThursdayFootWashing: { ini: 'LAVATORIO DE LOS PIES', fin: 'Cuando se desee administrar la Santa Comunión el Viernes Santo', desde: 14850 },
  maundyThursdayClosing: { ini: 'Cuando se desee administrar la Santa Comunión el Viernes Santo', fin: 'INDICACIONES ADICIONALES', desde: 14850 },
  goodFriday: { ini: 'En este día los ministros entran en silencio.', fin: 'LO CONCERNIENTE', desde: 14900, hastaIncluida: 'Los Ministros y el Pueblo se van en silencio.' },
  holySaturday: { ini: 'No hay celebración de la Eucaristía en este día.', fin: 'LO CONCERNIENTE A LA GRAN VIGILIA', desde: 15200 },
  // Texto Antiguo Renovado (la segunda forma de la Eucaristía). Su comienzo, hasta la Colecta y las lecturas, es el del Texto
  // Estándar y el app lo conserva; de ahí en adelante el libro da texto propio, y estas secciones lo copian. El lugar del
  // prefacio del día queda marcado como {t:'PREFACIO'} (en el libro: «Inserta el Prefacio indicado»).
  renewedCreed: { ini: 'EL CREDO NICENO', fin: 'ORACIONES DE LOS FIELES', desde: 3180 },
  renewedPrayers: { ini: 'ORACIONES DE LOS FIELES', fin: 'LA CONFESIÓN Y ABSOLUCIÓN DE LOS PECADOS', desde: 3180 },
  renewedConfession: { ini: 'LA CONFESIÓN Y ABSOLUCIÓN DE LOS PECADOS', fin: 'LA PAZ', desde: 3180 },
  renewedPeace: { ini: 'LA PAZ', fin: 'EL OFERTORIO', desde: 3180 },
  renewedOffertory: { ini: 'EL OFERTORIO', fin: 'EL SURSUM CORDA', desde: 3180 },
  renewedSursum: { ini: 'EL SURSUM CORDA', fin: 'LA ORACIÓN DE CONSAGRACIÓN', desde: 3180 },
  renewedConsecration: { ini: 'LA ORACIÓN DE CONSAGRACIÓN', fin: 'LA ORACIÓN DEL SEÑOR', desde: 3180 },
  renewedLordsPrayer: { ini: 'LA ORACIÓN DEL SEÑOR', fin: 'LA FRACCIÓN', desde: 3180 },
  renewedHumbleAccess: { ini: 'LA ORACIÓN DE HUMILDE ACCESO', fin: 'EL AGNUS DEI', desde: 3180 },
  renewedAgnusDei: { ini: 'EL AGNUS DEI', fin: 'LA ADMINISTRACIÓN DE LA COMUNIÓN', desde: 3180 },
  renewedAdministration: { ini: 'LA ADMINISTRACIÓN DE LA COMUNIÓN', fin: 'ORACIÓN DESPUÉS DE LA COMUNIÓN', desde: 3180 },
  renewedPostCommunion: { ini: 'ORACIÓN DESPUÉS DE LA COMUNIÓN', fin: 'LA BENDICIÓN', desde: 3180 },
  renewedBlessing: { ini: 'LA BENDICIÓN', fin: 'LA DESPEDIDA', desde: 3180 },
  renewedDismissal: { ini: 'LA DESPEDIDA', fin: 'Desde la Vigilia Pascual hasta el Día de Pentecostés', desde: 3180 },
  renewedDismissalAlleluia: { ini: 'Desde la Vigilia Pascual hasta el Día de Pentecostés', fin: 'INDICACIONES ADICIONALES', desde: 3180 },
  // Miércoles de Ceniza (el rito con Comunión): apertura, invitación a la santa Cuaresma con la colecta, salmo penitencial e
  // imposición de la ceniza, confesión y letanía, absolución con las palabras confortantes y la paz, y el cierre.
  ashWednesdayOpening: { ini: 'Los ministros pueden entrar en silencio', fin: 'El Oficiante invita al Pueblo a la observancia', desde: 14460 },
  ashWednesdayInvitation: { ini: 'El Oficiante invita al Pueblo a la observancia', fin: 'LAS LECTURAS', desde: 14460 },
  ashWednesdayAshes: { ini: 'SALMO PENITENCIAL E IMPOSICIÓN DE LA CENIZA', fin: 'CONFESIÓN Y LETANÍA DE PENITENCIA', desde: 14500 },
  ashWednesdayConfession: { ini: 'CONFESIÓN Y LETANÍA DE PENITENCIA', fin: 'LA ABSOLUCIÓN', desde: 14500 },
  ashWednesdayAbsolution: { ini: 'LA ABSOLUCIÓN', fin: 'Cuando hay Comunión, la liturgia continúa', desde: 14600 },
  ashWednesdayClosing: { ini: 'Cuando hay Comunión, la liturgia continúa', fin: 'INDICACCIONES ADICIONALES', desde: 14680 },
  // Gran Vigilia de Pascua: la introducción del libro (como rúbrica) y las cuatro partes de la liturgia.
  easterVigilIntro: { ini: 'La Gran Vigilia, cuando se observa', fin: 'LA', desde: 15300, comoRubrica: true },
  easterVigilLight: { ini: 'LA ILUMINACIÓN DEL CIRIO PASCUAL', fin: 'LAS LECTURAS', desde: 15330 },
  easterVigilReadings: { ini: 'LAS LECTURAS', fin: 'LA ACLAMACIÓN PASCUAL', desde: 15430 },
  // La Palabra termina en el Sermón y su título; la Renovación de los Votos Bautismales (texto del rito, l. 4835-4907 del
  // libro; sin su última línea, que dice que «excepto en la Vigilia Pascual» siguen las Oraciones del Pueblo) va después, y
  // el cierre «La celebración continúa con las Oración de los Fieles» (sic) y el prefacio de Pascua, tras ella.
  easterVigilWord: { ini: 'LA ACLAMACIÓN PASCUAL', fin: 'La celebración continúa con las Oración', desde: 15560 },
  easterVigilRenewal: { ini: 'RENOVACIÓN DE LAS PROMESAS BAUTISMALES', fin: 'Excepto en la Vigilia Pascual', desde: 4800 },
  easterVigilContinues: { ini: 'La celebración continúa con las Oración', fin: 'La siguiente bendición puede usarse', desde: 15620 },
  easterVigilBlessing: { ini: 'La siguiente bendición puede usarse', fin: 'DIRECCIONES ADICIONALES', desde: 15620 },
};
// Citas del libro que el app sustituye por el texto bíblico (lo pide al leccionario/Biblia de Jerusalén). La clave es
// el texto exacto de la línea del libro; `ref` es la cita en la forma que entiende BibliaJerusalen (numeración inglesa
// del libro; Daniel 3 se cuenta aquí a la católica porque la Biblia de Jerusalén intercala el Cántico de Azarías en
// 3:24-90, de modo que «3:1-28» inglés es «3:1-23, 91-95» allí).
const LECCIONES = {
  'GÉNESIS 1: 1—2: 3': { t: 'LECCION', ref: 'Genesis 1:1-2:3' },
  'GÉNESIS 3': { t: 'LECCION', ref: 'Genesis 3' },
  'GÉNESIS 7: 1-5, 11-18; 8: 6-20; 9: 8-13': { t: 'LECCION', ref: 'Genesis 7:1-5,11-18,8:6-20,9:8-13' },
  'GÉNESIS 22: 1-18': { t: 'LECCION', ref: 'Genesis 22:1-18' },
  'ÉXODO 14:10—15:1': { t: 'LECCION', ref: 'Exodus 14:10-15:1' },
  'ISAÍAS 4: 2-6': { t: 'LECCION', ref: 'Isaiah 4:2-6' },
  'ISAÍAS 55: 1-11': { t: 'LECCION', ref: 'Isaiah 55:1-11' },
  'EZEQUIEL 36: 24-28': { t: 'LECCION', ref: 'Ezekiel 36:24-28' },
  'EZEQUIEL 37:1-14': { t: 'LECCION', ref: 'Ezekiel 37:1-14' },
  'DANIEL 3:1-28': { t: 'LECCION', ref: 'Daniel 3:1-23,91-95' },
  'JONÁS 1:1—2:10': { t: 'LECCION', ref: 'Jonah 1:1-2:10' },
  'SOFONÍAS 3:12-20': { t: 'LECCION', ref: 'Zephaniah 3:12-20' },
  'ROMANOS 6:3-11': { t: 'LECCION', ref: 'Romans 6:3-11' },
  'MATEO 28: 1-10': { t: 'EVANGELIO', ref: 'Matthew 28:1-10' },
};
// Tramos que el app sustituye por las lecturas del día (las toma del leccionario): desde la línea que empieza así
// hasta la que empieza así (exclusiva). Se deja un marcador {t:'LECTURAS'}.
const LECTURAS = {
  goodFriday: { ini: 'LAS LECTURAS', fin: 'EL SERMÓN' },
  holySaturday: { ini: 'LAS LECTURAS', fin: 'Después del Evangelio, puede seguir una homilía.' },
};

const ROTULO = /^(Se (dice|canta|puede|pueden|utiliza|omiten|omite|guarda|lleva)|Luego[ ,]|A continuación|Todos (de pie|se |pueden)|El (Celebrante|Oficiante|Diácono|Presbítero|Obispo) (puede|dice|reza|lee|entonces|concluye|invita|se pone|se levanta)|El servicio siempre|El rito de la Santa Eucaristía no|No hay celebración de la Eucaristía|El Celebrante (enciende|puede presentar)|El oficiante dice|El Pueblo se pone|Todos de rodillas|El Lector solo continúa|Entonces todos rezan|Si está presente el Obispo|El Oficiante puede entonces|Cuando hay Comunión|El silencio puede seguir|El Diácono \(o el Celebrante|El [Dd]iácono (u otra|y el [Pp]ueblo)|El Pueblo permanece|El Celebrante continúa|La gente se pone de pie|En las siguientes palabras|El [Oo]bispo o sacerdote|El obispo, cuando|El diácono, o el sacerdote|Después de la Comunión|El Pan y el Cáliz se entregan|El Celebrante puede ofrecer|Durante el ministerio|Juntos, el Celebrante|Se puede cantar un himno|Si el Pan consagrado|En Cuaresma, se omite|Después de cada lectura|Se leen una o más|Se puede agregar una cita|O el lector puede|Puede seguir un momento|Un salmo, himno|Todos de pie, el diácono|Después del Evangelio, el lector|El Celebrante le dice|El Celebrante reza|Desde la Vigilia Pascual|Puede añadirse en otros|La gente responde|Antes de la celebración|El Celebrante puede comenzar|Durante el ofertorio|El Pueblo se pone de pie mientras|Entonces los Ministros|Se puede cantar o decir la Gloria|Luego sigue el Resumen|El celebrante y el pueblo rezan|El Celebrante y el pueblo rezan|El Cirio Pascual se coloca|El servicio continúa|Se leen |Después del Evangelio|La celebración continúa|El Prefacio de Pascua|La siguiente bendición|El Santo Bautismo puede|O, si las oraciones|Todos se ponen de pie|Se puede tocar|El Gloria in Excelsis, o algún otro|El Diácono, u otra persona|La Gran Vigilia, cuando|El Servicio de la Luz|El servicio de las lecturas|El Santo Bautismo es|La Sagrada Eucaristía es|En la oscuridad, el fuego|El Obispo o Sacerdote|El Diácono (u otra|y el Pueblo)|El Oficiante (y el|dice|entonces)|Los Ministros|Los ministros|La Congregación|Cuando |Si |Durante |Después |Siguiendo |En (un lugar|la ausencia|ausencia|este día los)|Puede |Pueden |Estas |Esta liturgia|Las peticiones|Las oraciones iniciales|El himno de|El Evangelio de la Pasión|Año [ABC] |Frente al|Pueden seguir|Ahora se puede|Entonces se puede|La liturgia continúa|Silencio)/;
const ROTULO_EXACTO = /^(o esto|o bien,?|O lo siguiente|Silencio\.?)$/;
// «Pueblo mío», «Todos los que…» y «Todos nosotros…» son texto, no la etiqueta de quien habla.
// «Pregunta» es la etiqueta que el libro pone a una de las preguntas del Celebrante en la Renovación de los Votos.
const ETIQUETA = /^(Pregunta|Celebrante|Pueblo(?! mío| de Dios| santo)|Diácono|Lector|Oficiante|Todos(?! los| nosotros)|Obispo|Presbítero)\s+(.+)$/;
const TIPO_ETIQUETA = { Pregunta: 'CEL', Celebrante: 'CEL', Pueblo: 'PUEBLO', 'Diácono': 'DIAC', Lector: 'LECTOR', Oficiante: 'OFIC', Todos: 'TODOS', Obispo: 'OBISPO', 'Presbítero': 'PRES' };
const MAYUSCULAS = /^[A-ZÁÉÍÓÚÜÑ0-9 ,.:;()¿?¡!\-—“”"'/]+$/;
const REFERENCIA = /^\(?(Año [ABC] )?([1-3] )?[A-ZÁÉÍÓÚÑ]{3,}( [A-ZÁÉÍÓÚÑ]{2,})*[ —]*\(?\d/;
const FIN_FRASE = /[.:;?!”»)"]$/;
// Un párrafo de texto corrido (P) NO se corta al final de cada frase: sigue hasta «Amén.» o hasta que empiece otro
// párrafo reconocible por su primera palabra. Es el único sitio donde hace falta enumerar comienzos.
const INICIO_PARRAFO = /^(La Sangre de Cristo, Cáliz|Por la paz del mundo|Asimismo, después de la cena|Por lo tanto, proclamamos|Celebramos el memorial|Santifícalos por tu Palabra|Todo esto te lo pedimos|Oremos |Encomendémonos|Amado Pueblo|Oramos, por tanto|Esta es la noche|Por lo tanto|Vengan ahora|Compañeros siervos|Queridos hermanos|Nosotros te alabamos|Concédenos que los que|Dios todopoderoso, cuyo Hijo amadísimo)/;
// Excepciones por texto exacto de la línea: lo que la heurística clasifica mal.
const OVERRIDES = {
  'Oremos:': 'P', 'Oremos.': 'P', 'Oremos': 'P',
  // Segunda línea de una respuesta del pueblo y «Amén.» suelto: continúan el item anterior.
  'Hosanna en las alturas.': 'CONT', 'Hosanna en el cielo.': 'CONT', 'Amén.': 'CONT', 'Amén': 'CONT', 'Patri.': 'CONT', 'Cruz.': 'CONT',
  // «Pueblo mío» y «Todos nosotros» son texto, no la etiqueta de quien habla.
  'Pueblo mío, ¿qué te he hecho?': 'P', 'Oh mi iglesia, ¿qué te he hecho?': 'P',
  // Vigilia: el libro imprime «Oremos.. Silencio» (sic) tras cada lección, y las fórmulas del Evangelio sin etiqueta.
  'Oremos.. Silencio': 'R', 'Oremos. Silencio': 'R',
  'El Santo Evangelio de nuestro Señor Jesucristo según San Mateo.': 'DIAC', 'El Evangelio del Señor.': 'LECTOR',
  'La luz de Cristo.': 'DIAC',
  'Bendito sea el Señor que perdona todos nuestros pecados.': 'OFIC',
  'LA PAZ': 'T',
  'Confirmación. Si no hay candidatos para el Bautismo o la Confirmación, la': 'CONT',
  'Anglicano):': 'CONT',
  // Renovación de los Votos Bautismales: la rúbrica de la introducción, la última línea de la rúbrica de la Renovación, la
  // primera pregunta (el libro no le pone etiqueta, como en inglés) y los artículos del Credo de los Apóstoles, que siguen
  // a su «Sí, creo.» y son parte de lo que dice el pueblo.
  'Congregación se une a la Renovación de los Votos Bautismales.': 'CONT',
  'El Credo Niceno no se dice.': 'CONT',
  '¿Renuevas tú, aquí en la presencia de Dios y de la Iglesia, las solemnes promesas y': 'CEL',
  'Creo en Dios Padre todopoderoso, creador del': 'CONT', 'Creo en Jesucristo, su único Hijo, Nuestro Señor,': 'CONT',
  'Desde allí ha de venir a juzgar a vivos y muertos.': 'CONT', 'Creo en el Espíritu Santo, la': 'CONT',
  // Últimas líneas de una rúbrica, que el ancho de la página parte y empiezan en mayúscula.
  'Colecta adecuada.': 'CONT', 'Confirmación, el Celebrante dirige al pueblo a la Renovación de los Votos Bautismales.': 'CONT',
  'Instrucciones Adicionales. En ausencia de Candidatos para el Bautismo o Confirmación, el Celebrante dirige al': 'CONT',
};
// Tramos en verso: líneas cortas que se conservan una por línea. Cada tramo va de la línea que empieza con `ini` hasta
// la anterior a la que empieza con `fin`, y se parte en estrofas donde una línea termina con `corta`.
const VERSOS = {
  goodFriday: [
    { ini: 'Todos nosotros nos descarriamos', fin: 'Pueblo Pero el Señor hizo', corta: /^$/ },
    { ini: 'Pueblo mío, ¿qué te he hecho?', fin: 'HIMNO 1', corta: /Ten piedad de nosotros\.$/ },
    { ini: 'Nos gloriamos en tu Cruz', fin: 'HIMNO 2', corta: /alegría ha venido a todo el mundo\.$|que todos los pueblos te alaben\.$/ },
    { ini: 'Te adoramos, oh Cristo', fin: 'Entonces se puede cantar el himno', corta: /redimiste al mundo\.$|reinaremos\.$/ },
    { ini: 'Dios todopoderoso, Padre de nuestro Señor Jesucristo,', fin: 'El Obispo o Sacerdote se pone de pie y dice', corta: /por nuestro Señor Jesucristo\. Amén\.$/ },
    { ini: 'Padre Nuestro que estás en el cielo,', fin: 'Frente al Pueblo, el Oficiante puede hacer', corta: /ahora y por siempre\. Amén\.$/ },
  ],
  holySaturday: [
    { ini: 'El hombre nacido de mujer', fin: 'El Oficiante y el Pueblo rezan juntos', corta: /nunca sigue igual\.$|muerte eterna\.$|nos apartemos de ti\.$/ },
    { ini: 'Padre Nuestro que estás en el cielo,', fin: 'El Oficiante concluye', corta: /ahora y por siempre\. Amén\.$/ },
  ],
  // Vigilia: el Pregón Pascual (Exsultet) en estrofas, y el Gloria. `fin` ausente = hasta el final de la sección.
  easterVigilLight: [
    { ini: 'Alégrense por fin', fin: 'Diácono El Señor esté con ustedes.', corta: /poderoso\.$|eterno\.$|pueblo\.$|siglos de los siglos\. Amén\.$/ },
    { ini: 'Verdaderamente es justo y necesario', corta: /y nos santifica\.$|victorioso de la tumba\.$|tan grande y glorioso!$|reconcilia con Dios\.$|por los siglos de los siglos\. Amén\.$/ },
  ],
  easterVigilWord: [
    { ini: 'Gloria a Dios en el cielo,', fin: 'LA ORACIÓN COLECTA', corta: /^Amén\.$/ },
  ],
  // Texto Antiguo Renovado: el Credo, la confesión, el Sanctus, la aclamación memorial, el Padrenuestro, la oración de acceso
  // humilde, el Agnus Dei y la oración después de la comunión van en verso (una línea por renglón del libro).
  renewedCreed: [
    { ini: 'Creemos en un solo Dios,', fin: '† La frase', corta: /vida del mundo futuro\. Amén\.$/ },
  ],
  renewedConfession: [
    { ini: 'Dios de gran misericordia,', fin: 'El obispo o sacerdote se pone de pie y dice', corta: /para gloria de tu nombre\. Amén\.$/ },
  ],
  renewedSursum: [
    { ini: 'Santo, Santo, Santo es el Señor', corta: /Hosanna en el cielo\.$/ },
  ],
  renewedConsecration: [
    { ini: 'Cristo ha muerto.', fin: 'Celebramos el memorial', corta: /vendrá de nuevo\.$/ },
  ],
  renewedLordsPrayer: [
    { ini: 'Padre Nuestro que estás en el cielo,', corta: /ahora y por siempre\. Amén\.$/ },
  ],
  renewedHumbleAccess: [
    { ini: 'Nosotros no nos atrevemos a venir', corta: /él en nosotros\. Amén\.$/ },
  ],
  renewedAgnusDei: [
    { ini: 'Cordero de Dios, que quitas el pecado del mundo;', corta: /Danos tu paz\.$/ },
  ],
  renewedPostCommunion: [
    { ini: 'Padre Celestial,', corta: /ahora y por siempre\. Amén\.$/ },
  ],
  // Ceniza: el Salmo 51 (texto del propio libro), un versículo cada dos líneas, y la confesión de la letanía.
  ashWednesdayAshes: [
    { ini: '1 Ten compasión de mí, oh Dios', cada: 2 },
  ],
  ashWednesdayConfession: [
    { ini: 'Padre santísimo y misericordioso,', fin: 'Lector Señor, ten piedad de nosotros:', corta: /Espíritu Santo\.$/ },
  ],
};

// Excepciones por comienzo de línea (cuando la línea es larga o varía): tipo que se le da.
const OVERRIDES_PREFIJO = [
  ['Mesa para la celebración.', 'CONT'],            // sigue la rúbrica «El Diácono o Sacerdote prepara la Santa»
  ['Si Mis queridos hijos', 'P'],                    // «Si» sobrante de la conversión del PDF: es el texto de 1 Juan 2:1-2
  ['Celebrante y ', 'R'],                             // «Celebrante y gente / y Pueblo / y las personas juntas pueden decir»: quién lo dice
];

function tipoLinea(l) {
  if (OVERRIDES[l]) return OVERRIDES[l];
  for (const [p, t] of OVERRIDES_PREFIJO) if (l.startsWith(p)) return t;
  if (ROTULO_EXACTO.test(l)) return 'R';
  if (/^(UN CANTO|EL CANTO DE|SEGURAMENTE ES DIOS)/.test(l)) return 'REF';   // cánticos que acompañan a una lección
  if (REFERENCIA.test(l) && !/[a-záéíóú]{3,} [a-záéíóú]{3,} [a-záéíóú]{3,}/.test(l.replace(/\(.*?\)/g, ''))) return 'REF';
  if (MAYUSCULAS.test(l) && /[A-ZÁÉÍÓÚÑ]{4,}/.test(l)) return 'T';
  if (ROTULO.test(l)) return 'R';
  if (ETIQUETA.test(l)) return TIPO_ETIQUETA[ETIQUETA.exec(l)[1]];
  return 'P';
}

function analizar(lineas) {
  const items = [];
  let cur = null;
  const cierra = () => { if (cur) { items.push(cur); cur = null; } };
  for (const bruta of lineas) {
    const l = bruta.trim();
    if (!l || /^\d{3}$/.test(l)) continue;
    if (l === '[[LECTURAS]]') { cierra(); items.push({ t: 'LECTURAS' }); continue; }
    const mv0 = /^\[\[V:(.*)\]\]$/s.exec(l);
    if (mv0) { cierra(); items.push({ t: 'V', x: mv0[1] }); continue; }
    if (l === '[[PREFACIO]]') { cierra(); items.push({ t: 'PREFACIO' }); continue; }
    const t = tipoLinea(l);
    if (t === 'CONT' && cur) { cur.lineas.push(l); continue; }
    // ¿Continúa la frase anterior? Solo si hay un item abierto de texto, esta línea no es título, referencia ni rúbrica
    // nueva, y (a) empieza en minúscula —sigue una frase cortada por el ancho de la página— o (b) el item anterior no
    // cerró su frase y la línea es texto corrido (P). Una rúbrica sin punto final seguida de mayúscula NO continúa.
    const empiezaMin = /^[a-záéíóúñ(«“¿]/.test(l);
    const ultima = cur ? cur.lineas[cur.lineas.length - 1] : '';
    const abierto = cur && ['R', 'P', 'CEL', 'PUEBLO', 'DIAC', 'LECTOR', 'OFIC', 'TODOS', 'OBISPO', 'PRES'].includes(cur.t) && !cur.exacto;
    const sigue = abierto && !['T', 'REF'].includes(t) && (
      (empiezaMin && (t === 'P' || t === 'R') && !ROTULO_EXACTO.test(l)) ||                             // frase cortada por el ancho de la página
      (t === 'P' && cur.t === 'P' && !/Amén\.?$/.test(ultima) && !INICIO_PARRAFO.test(l)) ||           // texto corrido
      (t === 'P' && cur.t !== 'P' && cur.t !== 'R' && !FIN_FRASE.test(ultima)));                       // voz que no cerró su frase
    if (sigue) { cur.lineas.push(l); continue; }
    const mv = /^\[\[V:(.*)\]\]$/s.exec(l);
    if (mv) { cierra(); items.push({ t: 'V', x: mv[1] }); continue; }
    cierra();
    const m = ETIQUETA.exec(l);
    const solo = m && TIPO_ETIQUETA[m[1]] === t ? m[2] : l;
    cur = { t, lineas: [solo], exacto: ROTULO_EXACTO.test(l) || /^Oremos[:.]?$/.test(solo) };
  }
  cierra();
  return items.map(it => {
    if (it.t === 'LECTURAS' || it.t === 'PREFACIO' || it.x !== undefined) return it;
    const ls = it.lineas;
    const corto = ls.length >= 3 && ls.every(x => x.length < 66);
    return { t: corto && it.t === 'P' ? 'V' : it.t, x: (corto && it.t === 'P' ? ls.join('\n') : ls.join(' ')).replace(/\s+/g, m => (m.includes('\n') ? m : ' ')) };
  });
}

function recorte(lineas, def, desde) {
  const i0 = lineas.findIndex((l, n) => n >= desde && l.trim().startsWith(def.ini));
  if (i0 < 0) throw new Error('no encuentro el comienzo «' + def.ini + '» en el libro (¿se volvió a convertir?)');
  let i1 = lineas.findIndex((l, n) => n > i0 && l.trim().startsWith(def.fin));
  if (i1 < 0) throw new Error('no encuentro el fin «' + def.fin + '» en el libro');
  if (def.hastaIncluida) { const j = lineas.findIndex((l, n) => n > i0 && l.trim().startsWith(def.hastaIncluida)); if (j < 0) throw new Error('no encuentro «' + def.hastaIncluida + '»'); i1 = j + 1; }
  return { desde: i0, hasta: i1, lineas: lineas.slice(i0, i1) };
}

// Sustituye un tramo en verso por marcadores «[[V:línea\nlínea…]]», uno por estrofa. Las líneas sueltas del número de página
// del libro se descartan.
function envuelveVersos(ls, v, nombre) {
  const a = ls.findIndex(l => l.trim().startsWith(v.ini));
  if (a < 0) throw new Error(`${nombre}: no encuentro el tramo en verso que empieza «${v.ini}»`);
  const b = v.fin ? ls.findIndex((l, n) => n > a && l.trim().startsWith(v.fin)) : ls.length;
  if (b < 0) throw new Error(`${nombre}: no encuentro el fin «${v.fin}» del tramo «${v.ini}»`);
  const estrofas = []; let cur = [];
  for (const raw of ls.slice(a, b)) {
    const l = raw.trim();
    if (!l || /^\d{3}$/.test(l)) continue;
    cur.push(l);
    if (v.cada ? cur.length === v.cada : v.corta.test(l)) { estrofas.push(cur); cur = []; }
  }
  if (cur.length) estrofas.push(cur);
  return ls.slice(0, a).concat(estrofas.map(e => '[[V:' + e.join('\n') + ']]'), ls.slice(b));
}

function construir(locPath) {
  const lineas = fs.readFileSync(locPath, 'utf8').split(/\r?\n/);
  const out = {}, origen = {};
  for (const [nombre, def] of Object.entries(SECCIONES)) {
    const r = recorte(lineas, def, def.desde);
    let ls = r.lineas.slice();
    // El libro dice «Inserta el Prefacio indicado (págs. 152-158)»: ahí va el prefacio del día (lo pone el app).
    ls = ls.map(l => (l.trim().startsWith('Inserta el Prefacio indicado') ? '[[PREFACIO]]' : l));
    if (LECTURAS[nombre]) {
      const a = ls.findIndex(l => l.trim().startsWith(LECTURAS[nombre].ini)), b = ls.findIndex((l, n) => n > a && l.trim().startsWith(LECTURAS[nombre].fin));
      if (a < 0 || b < 0) throw new Error('no encuentro el tramo de lecturas de ' + nombre);
      ls = ls.slice(0, a).concat(['[[LECTURAS]]'], ls.slice(b));
    }
    for (const v of VERSOS[nombre] || []) ls = envuelveVersos(ls, v, nombre);
    let items = analizar(ls);
    // Las citas bíblicas que el app sustituye por el texto (LECCION / EVANGELIO) y la introducción como rúbrica.
    items = items.map(it => (it.t === 'REF' && LECCIONES[it.x]) ? { t: LECCIONES[it.x].t, x: it.x, ref: LECCIONES[it.x].ref } : it);
    if (def.comoRubrica) items = items.map(it => (it.t === 'P' ? { t: 'R', x: it.x } : it));
    out[nombre] = items;
    origen[nombre] = `LOC l. ${r.desde + 1}-${r.hasta}`;
  }
  return { out, origen };
}

function archivo({ out, origen }) {
  return `/**
 * holyweek-data.js — Liturgias de la Semana Santa (Libro de Oración Común 2019, ACNA).
 * GENERADO por bcp2019-tools/build-holyweek.js a partir del libro oficial en español (LOC-10-10-23.md); NO editar a
 * mano: test-bcp2019.js comprueba que sigue idéntico a lo que genera el script. Texto copiado, no traducido.
 * Procedencia: ${Object.entries(origen).map(([k, v]) => k + ' ' + v).join('; ')}.
 * Tipos: T título, R rúbrica, P párrafo, V versos (líneas separadas por \\n), REF cita bíblica, CEL/PUEBLO/DIAC/LECTOR/
 * OFIC/TODOS/OBISPO/PRES voces, LECTURAS = lugar donde el app inserta las lecturas del día.
 */
const BCP_HOLYWEEK_DATA = ${JSON.stringify(out, null, 1)};
`;
}

module.exports = { construir, archivo, LOC_POR_DEFECTO };

if (require.main === module) {
  const args = process.argv.slice(2);
  const preview = args.includes('--preview');
  const loc = args.find(a => /\.md$/.test(a)) || LOC_POR_DEFECTO;
  const r = construir(loc);
  if (preview) {
    const quiere = args.filter(a => !a.startsWith('--') && !/\.md$/.test(a));
    for (const [n, items] of Object.entries(r.out)) {
      if (quiere.length && !quiere.includes(n)) continue;
      console.log(`\n=== ${n} (${r.origen[n]}) — ${items.length} items`);
      for (const it of items) console.log(String(it.t).padEnd(6), (it.x || '').replace(/\n/g, ' ⏎ ').slice(0, 118));
    }
  } else {
    fs.writeFileSync(path.join(__dirname, '..', 'bcp2019', 'js', 'holyweek-data.js'), archivo(r));
    console.log('escrito bcp2019/js/holyweek-data.js:', Object.entries(r.out).map(([k, v]) => `${k} ${v.length}`).join(', '));
  }
}
