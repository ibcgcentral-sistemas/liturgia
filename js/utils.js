/**
 * utils.js — Utilidades Compartidas
 * Funciones y constantes reutilizables en toda la aplicación
 */

// ══════════════════════════════════════════════════════════════════════════
//  TRADUCCIONES BÍBLICAS
// ══════════════════════════════════════════════════════════════════════════

const BIBLE_TRANSLATIONS = {
  'Genesis':'Génesis','Exodus':'Éxodo','Leviticus':'Levítico','Numbers':'Números','Deuteronomy':'Deuteronomio',
  'Joshua':'Josué','Judges':'Jueces','Ruth':'Rut','1 Samuel':'I Samuel','2 Samuel':'II Samuel',
  '1 Kings':'I Reyes','2 Kings':'II Reyes','1 Chronicles':'I Crónicas','2 Chronicles':'II Crónicas',
  'Ezra':'Esdras','Nehemiah':'Nehemías','Job':'Job','Psalms':'Salmos','Psalm':'Salmo','Proverbs':'Proverbios',
  'Ecclesiastes':'Eclesiastés','Song of Songs':'Cantar de los Cantares','Wisdom':'Sabiduría',
  'Sirach':'Eclesiástico','Baruch':'Baruc','Isaiah':'Isaías','Jeremiah':'Jeremías',
  'Lamentations':'Lamentaciones','Ezekiel':'Ezequiel','Daniel':'Daniel','Hosea':'Oseas',
  'Joel':'Joel','Amos':'Amós','Obadiah':'Abdías','Jonah':'Jonás','Micah':'Miqueas',
  'Nahum':'Nahúm','Habakkuk':'Habacuc','Zephaniah':'Sofonías','Haggai':'Ageo',
  'Zechariah':'Zacarías','Malachi':'Malaquías','Matthew':'Mateo','Mark':'Marcos',
  'Luke':'Lucas','John':'Juan','Acts':'Hechos','Romans':'Romanos','1 Corinthians':'I Corintios',
  '2 Corinthians':'II Corintios','Galatians':'Gálatas','Ephesians':'Efesios','Philippians':'Filipenses',
  'Colossians':'Colosenses','1 Thessalonians':'I Tesalonicenses','2 Thessalonians':'II Tesalonicenses',
  '1 Timothy':'I Timoteo','2 Timothy':'II Timoteo','Titus':'Tito','Philemon':'Filemón',
  'Hebrews':'Hebreos','James':'Santiago','1 Peter':'I Pedro','2 Peter':'II Pedro',
  '1 John':'I Juan','2 John':'II Juan','3 John':'III Juan','Jude':'Judas','Revelation':'Apocalipsis',
};

// Compilar regex una sola vez para mejor rendimiento
const BIBLE_BOOK_PATTERN = new RegExp(`\\b(${Object.keys(BIBLE_TRANSLATIONS).map(b => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g');

function translateBibleReference(ref) {
  if (!ref) return ref;
  return ref.replace(BIBLE_BOOK_PATTERN, match => BIBLE_TRANSLATIONS[match]);
}

// ══════════════════════════════════════════════════════════════════════════
//  COLORES Y RANGOS LITÚRGICOS
// ══════════════════════════════════════════════════════════════════════════

const LITURGICAL_COLORS = {
  white:'Blanco', red:'Rojo', violet:'Morado', rose:'Rosa', black:'Negro', green:'Verde'
};

const RANK_NAMES = {
  'doubleFirstClass':'Fiesta de I Clase', 'doubleSecondClass':'Fiesta de II Clase',
  'double':'Doble', 'semiDouble':'Semidoble', 'simplex':'Simple', 'feria':'Feria', 'fast':'Ayuno',
};

function getColorName(colorKey) {
  return LITURGICAL_COLORS[colorKey] || colorKey;
}

function getRankName(rankKey) {
  return RANK_NAMES[rankKey] || rankKey;
}

// ══════════════════════════════════════════════════════════════════════════
//  FORMATO DE FECHA
// ══════════════════════════════════════════════════════════════════════════

function formatLiturgyDate(date) {
  return date.toLocaleDateString('es-ES', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

// ══════════════════════════════════════════════════════════════════════════
//  DETECCIÓN DE AUTOR DEL EVANGELIO
// ══════════════════════════════════════════════════════════════════════════

function getGospelAuthor(gospelRef) {
  if (!gospelRef) return 'San Juan';
  if (gospelRef.includes('Matthew')) return 'San Mateo';
  if (gospelRef.includes('Mark')) return 'San Marcos';
  if (gospelRef.includes('Luke')) return 'San Lucas';
  return 'San Juan';
}

// ══════════════════════════════════════════════════════════════════════════
//  CITAS DE LOS PADRES DE LA IGLESIA — SEGÚN EL EVANGELIO
// ══════════════════════════════════════════════════════════════════════════

const FATHERS_QUOTES_BY_THEME = {
  fe: [
    { text: "La fe es el principio de la vida cristiana; sin ella nadie puede agradar a Dios.", author: "San Agustín de Hipona" },
    { text: "La fe no es algo que se piensa, sino una forma de caminar.", author: "San Gregorio de Nisa" },
    { text: "La fe que no obra no es fe verdadera.", author: "San Juan Crisóstomo" },
    { text: "Si crees lo que te gusta en el Evangelio y rechazas lo que no te gusta, no es en el Evangelio en lo que crees, sino en ti mismo.", author: "San Agustín de Hipona" },
  ],
  sanación: [
    { text: "Cristo es el médico que cura nuestras heridas. A él debemos acudir con nuestras enfermedades.", author: "San Agustín de Hipona" },
    { text: "El Señor cura al enfermo con su palabra y le devuelve a la vida con su poder.", author: "San Efrén de Siria" },
    { text: "No es un remedio terreno lo que el alma necesita, sino la medicina celestial del Señor.", author: "San Ambrosio de Milán" },
  ],
  perdón: [
    { text: "Si perdonas a los demás, tienes un argumento para pedir perdón a Dios; pero si no perdonas, ¿con qué rostro pedirás misericordia?", author: "San Juan Crisóstomo" },
    { text: "Mientras estés vivo, ningún pecado es irreparable. Para eso vino Cristo: para salvar a los que se arrepienten.", author: "San Cirilo de Jerusalén" },
    { text: "La misericordia de Dios es como un mar infinito en el que nuestros pecados se sumergen.", author: "San Juan María Vianney" },
  ],
  amor: [
    { text: "Ama y haz lo que quieras: si callas, calla por amor; si gritas, grita por amor; si corriges, corrige por amor.", author: "San Agustín de Hipona" },
    { text: "El amor de Dios no es un sentimiento, sino un acto de voluntad por el que deseamos el bien del otro.", author: "Santo Tomás de Aquino" },
    { text: "No hay mayor prueba de amor que dar la vida por los amigos.", author: "San Gregorio Magno" },
  ],
  servicio: [
    { text: "Nadie es más rico que el que lleva a Dios en su pecho; nadie es más pobre que el que no tiene caridad.", author: "San Ambrosio de Milán" },
    { text: "Si realmente quieres amar a Jesús, antes aprende a sufrir por él, pues el amor se prueba en la tribulación.", author: "San Ignacio de Antioquía" },
    { text: "El servicio verdadero es ver a Cristo en el pobre y al pobre en Cristo.", author: "San Juan Crisóstomo" },
  ],
  oración: [
    { text: "Orad siempre y no os canséis: orad con alegría, orad con lágrimas, orad en silencio; pero orad.", author: "San Agustín de Hipona" },
    { text: "La oración es la respiración del alma. Sin oración, el alma muere.", author: "San Juan María Vianney" },
    { text: "Dios no pide grandes obras, sino gran fe y determinación en la oración.", author: "Santa Teresa de Ávila" },
  ],
  arrepentimiento: [
    { text: "No desesperes de la misericordia de Dios, por grande que sea tu pecado: la gracia de Dios es más grande.", author: "San Isidoro de Sevilla" },
    { text: "Dios no rechaza a un corazón contrito y humillado.", author: "San Juan Crisóstomo" },
    { text: "La penitencia es la segunda tabla de salvación después del naufragio del pecado.", author: "San Jerónimo" },
  ],
  esperanza: [
    { text: "Nuestra esperanza no está en la tierra, sino en el cielo; por eso no debemos temer las tormentas del mundo.", author: "San Agustín de Hipona" },
    { text: "La esperanza es la compañera de la fe y la hermana de la caridad.", author: "San Bernardo de Claraval" },
    { text: "No te aflijas por lo que el mundo te quita, sino alégrate por lo que Dios te promete.", author: "San Juan Crisóstomo" },
  ],
  caridad: [
    { text: "La caridad es el alma de todas las virtudes; sin ella las demás son cuerpo sin vida.", author: "Santo Tomás de Aquino" },
    { text: "Si deseas la paz, trabaja por la justicia; si deseas la justicia, practica la misericordia.", author: "San León Magno" },
    { text: "Lo que hagáis al más pequeño de mis hermanos, a mí me lo hacéis.", author: "San Juan Crisóstomo" },
  ],
  paz: [
    { text: "La paz de Cristo no es la ausencia de conflicto, sino la presencia de Dios en medio de él.", author: "San Agustín de Hipona" },
    { text: "Bienaventurados los pacíficos, porque ellos serán llamados hijos de Dios.", author: "San León Magno" },
    { text: "La verdadera paz consiste en la voluntad que se somete a Dios.", author: "San Gregorio Magno" },
  ],
  resurrección: [
    { text: "Si Cristo no ha resucitado, vana es nuestra predicación; pero ha resucitado, y con él resucitan todas nuestras esperanzas.", author: "San Agustín de Hipona" },
    { text: "La resurrección de Cristo es nuestra esperanza; la ascensión, nuestra glorificación.", author: "San León Magno" },
    { text: "Hemos sido sepultados con Cristo por el bautismo para resucitar con él a una vida nueva.", author: "San Cirilo de Jerusalén" },
  ],
  vigilancia: [
    { text: "Velad, porque no sabéis el día ni la hora. La vida cristiana es una vigilia constante.", author: "San Agustín de Hipona" },
    { text: "El que no vigila, perece. El que vigila, se salva. Dios viene como ladrón en la noche.", author: "San Efrén de Siria" },
    { text: "Estad preparados con la lámpara encendida del amor, para que cuando llegue el Esposo os encuentre dignos.", author: "San Gregorio Magno" },
  ],
  milagro: [
    { text: "Los milagros de Cristo no son simples prodigios; son signos que revelan el misterio del Reino.", author: "San Agustín de Hipona" },
    { text: "Cada sacramento es un milagro mayor que los prodigios visibles, pues transforma el alma.", author: "Santo Tomás de Aquino" },
  ],
  verdad: [
    { text: "La verdad no tiene necesidad de ser defendida: basta con ser proclamada. Ella se defiende sola.", author: "San Atanasio de Alejandría" },
    { text: "Cristo no dijo: Yo soy la costumbre, sino: Yo soy la Verdad.", author: "Tertuliano" },
  ],
  justicia: [
    { text: "La justicia sin misericordia es crueldad; la misericordia sin justicia es debilidad.", author: "Santo Tomás de Aquino" },
    { text: "Es injusto que un cristiano viva en la opulencia mientras su hermano muere de hambre.", author: "San Basilio Magno" },
  ],
  humildad: [
    { text: "La humildad es el fundamento de todas las virtudes. Sin ella, ninguna virtud subsiste.", author: "San Agustín de Hipona" },
    { text: "Dios resiste a los soberbios, pero a los humildes da la gracia.", author: "San Bernardo de Claraval" },
    { text: "La humildad es la madre y raíz de todas las virtudes.", author: "San Juan Crisóstomo" },
  ],
  tentación: [
    { text: "No temáis la tentación: temed al consentimiento. La tentación prueba; el consentimiento condena.", author: "San Agustín de Hipona" },
    { text: "Dios permite la tentación para que crezcamos en virtud y conozcamos nuestra debilidad.", author: "San Juan Crisóstomo" },
  ],
  eucaristía: [
    { text: "La Eucaristía es la medicina de la inmortalidad, el antídoto contra la muerte.", author: "San Ignacio de Antioquía" },
    { text: "Lo que era visible en nuestro Redentor ha pasado a los sacramentos.", author: "San León Magno" },
    { text: "Reconocemos a Cristo en la fracción del pan.", author: "San Agustín de Hipona" },
    { text: "Si vosotros mismos sois el Cuerpo de Cristo y sus miembros, es vuestro propio misterio el que descansa sobre la mesa del Señor.", author: "San Agustín de Hipona" },
    { text: "El pan que ves en el altar, santificado por la palabra de Dios, es el Cuerpo de Cristo.", author: "San Ambrosio de Milán" },
    { text: "Acércate a recibir el Cuerpo y la Sangre del Señor... Acércate con fe y devoción.", author: "San Cirilo de Jerusalén" },
  ],
};

// Mapeo directo de algunas referencias del Evangelio a temas específicos
const GOSPEL_TO_THEME = {
  'Matthew 4:1-11': 'tentación', 'Luke 4:1-13': 'tentación', 'Mark 1:9-15': 'fe',
  'Matthew 5:1-12': 'caridad', 'Matthew 5:13-20': 'verdad', 'Matthew 5:21-37': 'justicia',
  'Matthew 5:38-48': 'amor', 'Matthew 6:1-6,16-21': 'oración', 'Matthew 6:24-34': 'esperanza',
  'John 3:1-17': 'fe', 'John 3:14-21': 'amor', 'John 4:5-42': 'fe',
  'John 6:1-21': 'milagro', 'John 6:24-35': 'eucaristía', 'John 6:35,41-51': 'eucaristía',
  'John 6:51-58': 'eucaristía', 'John 6:56-69': 'eucaristía',
  'John 9:1-41': 'sanación', 'John 10:1-10': 'fe', 'John 10:11-18': 'amor',
  'John 10:22-30': 'fe', 'John 11:1-45': 'resurrección', 'John 11:17-27': 'resurrección',
  'John 13:1-17,31-35': 'servicio', 'John 13:31-35': 'amor',
  'John 14:1-14': 'fe', 'John 14:15-21': 'amor', 'John 14:23-29': 'paz',
  'John 15:1-8': 'fe', 'John 15:9-17': 'amor', 'John 15:26-27,16:4-15': 'verdad',
  'John 16:12-15': 'verdad', 'John 17:1-11': 'oración', 'John 17:6-19': 'oración',
  'John 17:20-26': 'amor', 'John 18:33-37': 'verdad', 'John 20:1-18': 'resurrección',
  'John 20:19-23': 'paz', 'John 20:19-31': 'fe', 'John 20:24-29': 'fe',
  'John 21:1-19': 'servicio',
  'Luke 1:26-38': 'fe', 'Luke 1:39-45': 'fe', 'Luke 1:39-56': 'humildad',
  'Luke 2:1-14': 'esperanza', 'Luke 2:22-40': 'fe',
  'Luke 7:1-10': 'fe', 'Luke 7:11-17': 'milagro', 'Luke 7:36-8:3': 'perdón',
  'Luke 9:28-36': 'fe', 'Luke 10:1-11,16-20': 'servicio', 'Luke 10:25-37': 'caridad',
  'Luke 10:38-42': 'oración', 'Luke 11:1-13': 'oración',
  'Luke 12:13-21': 'justicia', 'Luke 12:32-40': 'vigilancia', 'Luke 12:49-56': 'verdad',
  'Luke 13:1-9': 'arrepentimiento', 'Luke 13:10-17': 'sanación',
  'Luke 14:1,7-14': 'humildad', 'Luke 14:25-33': 'fe',
  'Luke 15:1-3,11-32': 'perdón', 'Luke 15:1-10': 'perdón', 'Luke 15:3-7': 'amor',
  'Luke 16:1-13': 'justicia', 'Luke 16:19-31': 'caridad',
  'Luke 17:5-10': 'fe', 'Luke 17:11-19': 'fe',
  'Luke 18:1-8': 'oración', 'Luke 18:9-14': 'humildad',
  'Luke 19:1-10': 'arrepentimiento', 'Luke 19:28-40': 'humildad',
  'Luke 21:5-19': 'vigilancia', 'Luke 21:25-36': 'vigilancia',
  'Luke 23:33-43': 'perdón', 'Luke 24:13-35': 'eucaristía',
  'Luke 24:36-48': 'resurrección', 'Luke 24:44-53': 'esperanza',
  'Matthew 1:18-25': 'fe', 'Matthew 2:1-12': 'fe', 'Matthew 2:13-23': 'esperanza',
  'Matthew 3:1-12': 'arrepentimiento', 'Matthew 3:13-17': 'humildad',
  'Matthew 9:9-13': 'perdón', 'Matthew 9:35-10:8': 'servicio',
  'Matthew 10:17-22': 'fe', 'Matthew 10:24-39': 'fe', 'Matthew 10:40-42': 'servicio',
  'Matthew 11:2-11': 'esperanza', 'Matthew 11:16-19,25-30': 'humildad',
  'Matthew 13:1-9,18-23': 'fe', 'Matthew 13:24-30,36-43': 'justicia',
  'Matthew 14:13-21': 'milagro', 'Matthew 14:22-33': 'fe',
  'Matthew 16:13-19': 'fe', 'Matthew 16:13-20': 'fe', 'Matthew 16:21-28': 'fe',
  'Matthew 17:1-9': 'fe', 'Matthew 18:1-5,10': 'humildad',
  'Matthew 18:15-20': 'perdón', 'Matthew 18:21-35': 'perdón',
  'Matthew 20:1-16': 'justicia', 'Matthew 20:20-28': 'servicio',
  'Matthew 22:1-14': 'vigilancia', 'Matthew 22:15-22': 'verdad',
  'Matthew 22:34-46': 'amor', 'Matthew 24:36-44': 'vigilancia',
  'Matthew 25:1-13': 'vigilancia', 'Matthew 25:14-30': 'servicio',
  'Matthew 25:31-46': 'caridad', 'Matthew 28:16-20': 'fe',
  'Mark 1:1-8': 'arrepentimiento', 'Mark 1:4-11': 'fe', 'Mark 1:14-20': 'fe',
  'Mark 1:21-28': 'milagro', 'Mark 1:29-39': 'sanación', 'Mark 1:40-45': 'sanación',
  'Mark 2:1-12': 'perdón', 'Mark 2:13-22': 'fe', 'Mark 2:23-3:6': 'verdad',
  'Mark 4:26-34': 'fe', 'Mark 4:35-41': 'fe',
  'Mark 5:21-43': 'fe', 'Mark 6:1-13': 'fe', 'Mark 6:14-29': 'verdad',
  'Mark 6:30-34,53-56': 'caridad', 'Mark 7:1-8,14-15,21-23': 'verdad',
  'Mark 7:24-37': 'fe', 'Mark 8:27-38': 'fe', 'Mark 8:31-38': 'fe',
  'Mark 9:2-9': 'fe', 'Mark 9:30-37': 'humildad', 'Mark 9:38-50': 'servicio',
  'Mark 10:2-16': 'amor', 'Mark 10:17-31': 'justicia', 'Mark 10:35-45': 'servicio',
  'Mark 10:46-52': 'fe', 'Mark 12:28-34': 'amor', 'Mark 12:38-44': 'humildad',
  'Mark 13:1-8': 'vigilancia', 'Mark 13:24-37': 'vigilancia',
  'Mark 14:1-15:47': 'amor', 'Mark 14:12-16,22-26': 'eucaristía',
  'Mark 16:15-20': 'fe',
};

function _detectQuoteTheme(gospelRef, gospelText) {
  // 1. Mapa directo por referencia del Evangelio
  if (gospelRef && GOSPEL_TO_THEME[gospelRef]) {
    return GOSPEL_TO_THEME[gospelRef];
  }
  // 2. Análisis de palabras clave en el texto
  if (gospelText) {
    const text = gospelText.toLowerCase();
    const keywords = {
      'fe': /\bfe\b|\bcreer\b|\bcrey[oó]\b|\bconfi[aá]/i,
      'sanación': /\bsan[aó]\b|\bsanar\b|\benferm[oa]s?\b|\bcur[aó]\b/i,
      'perdón': /\bperd[oó]n\b|\bperdonar\b/i,
      'amor': /\bamor\b|\bamar\b|\bcaridad\b/i,
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
    };
    let topTheme = '', maxMatches = 0;
    for (const [theme, regex] of Object.entries(keywords)) {
      const matches = (text.match(new RegExp(regex, 'gi')) || []).length;
      if (matches > maxMatches) { maxMatches = matches; topTheme = theme; }
    }
    if (topTheme) return topTheme;
  }
  // 3. Fallback: eucaristía (siempre apropiado en una Misa)
  return 'eucaristía';
}

function getFatherQuote(gospelRef, gospelText, date) {
  const theme = _detectQuoteTheme(gospelRef, gospelText);
  const quotes = FATHERS_QUOTES_BY_THEME[theme] || FATHERS_QUOTES_BY_THEME['eucaristía'];
  let idx;
  if (date instanceof Date && !isNaN(date)) {
    // Índice basado en semanas desde una época fija: avanza exactamente 1 cada 7 días,
    // así que dos domingos consecutivos (aunque compartan tema) nunca repiten la misma cita
    // (garantizado siempre que el tema tenga 2 o más citas, que es el caso de todos).
    const weekIndex = Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
    idx = ((weekIndex % quotes.length) + quotes.length) % quotes.length;
  } else {
    // Sin fecha disponible: hash determinista de la referencia (mismo evangelio = misma cita)
    let hash = 0;
    const seed = gospelRef || 'default';
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    idx = Math.abs(hash) % quotes.length;
  }
  const q = quotes[idx];
  return `<div class="cover-quote"><p class="quote-text">«${q.text}»</p><p class="quote-author">— ${q.author}</p></div>`;
}

// Mantener retrocompatibilidad para llamadas sin parámetros
function getRandomFatherQuote(gospelRef, gospelText, date) {
  return getFatherQuote(gospelRef, gospelText, date);
}

