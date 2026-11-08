/**
 * utils.js — Utilidades Compartidas
 * Libro de Oración Común (2019), ACNA
 * Adaptado de js/utils.js (Misal Anglicano) — funciones sueltas, sin IIFE,
 * ya que esta página nunca comparte scope global con el Misal.
 */

// ══════════════════════════════════════════════════════════════════════════
//  TRADUCCIONES BÍBLICAS
// ══════════════════════════════════════════════════════════════════════════

const BIBLE_TRANSLATIONS = {
  'Genesis':'Génesis','Exodus':'Éxodo','Leviticus':'Levítico','Numbers':'Números','Deuteronomy':'Deuteronomio',
  'Joshua':'Josué','Judges':'Jueces','Ruth':'Rut','1 Samuel':'I Samuel','2 Samuel':'II Samuel',
  '1 Kings':'I Reyes','2 Kings':'II Reyes','1 Chronicles':'I Crónicas','2 Chronicles':'II Crónicas',
  'Ezra':'Esdras','Nehemiah':'Nehemías','Esther':'Ester','Job':'Job','Psalms':'Salmos','Psalm':'Salmo','Proverbs':'Proverbios',
  'Ecclesiastes':'Eclesiastés','Song of Songs':'Cantar de los Cantares','Wisdom':'Sabiduría',
  'Sirach':'Eclesiástico','Baruch':'Baruc','Judith':'Judit','1 Maccabees':'I Macabeos','2 Maccabees':'II Macabeos','Isaiah':'Isaías','Jeremiah':'Jeremías',
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

const BIBLE_BOOK_PATTERN = new RegExp(`\\b(${Object.keys(BIBLE_TRANSLATIONS).map(b => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g');

function translateBibleReference(ref) {
  if (!ref) return ref;
  return ref.replace(BIBLE_BOOK_PATTERN, match => BIBLE_TRANSLATIONS[match]);
}

// ══════════════════════════════════════════════════════════════════════════
//  COLORES Y RANGOS LITÚRGICOS
// ══════════════════════════════════════════════════════════════════════════

const LITURGICAL_COLORS = { white: 'Blanco', red: 'Rojo', violet: 'Morado', rose: 'Rosa', green: 'Verde' };

// Jerarquía propia del BCP 2019 — más simple que las "clases" del Misal
// Anglicano: Fiesta Principal, Domingo, Día Santo (santoral fijo), Feria.
const RANK_NAMES = { principal: 'Fiesta Principal', sunday: 'Domingo', holyDay: 'Día Santo', feria: 'Feria' };

function getColorName(colorKey) { return LITURGICAL_COLORS[colorKey] || colorKey; }
function getRankName(rankKey) { return RANK_NAMES[rankKey] || rankKey; }

// ══════════════════════════════════════════════════════════════════════════
//  FORMATO DE FECHA
// ══════════════════════════════════════════════════════════════════════════

function formatLiturgyDate(date) {
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ══════════════════════════════════════════════════════════════════════════
//  DETECCIÓN DE AUTOR DEL EVANGELIO
// ══════════════════════════════════════════════════════════════════════════

// Acepta la referencia en inglés ("Matthew 4:1-11") o ya traducida
// ("Mateo 4:1-11"): app.js y librito-pueblo.js pasan la traducida. Devuelve ''
// si no reconoce el libro, para que el llamador omita el autor en vez de
// atribuir un Evangelio equivocado.
function getGospelAuthor(gospelRef) {
  if (!gospelRef) return '';
  const ref = String(gospelRef).trim();
  if (/^(Matthew|Mateo)(?![A-Za-z])/.test(ref)) return 'San Mateo';
  if (/^(Mark|Marcos)(?![A-Za-z])/.test(ref)) return 'San Marcos';
  if (/^(Luke|Lucas)(?![A-Za-z])/.test(ref)) return 'San Lucas';
  if (/^(John|Juan)(?![A-Za-z])/.test(ref)) return 'San Juan';
  return '';
}

// ══════════════════════════════════════════════════════════════════════════
//  GLORIA IN EXCELSIS: DÍAS EN QUE SE OMITE
// ══════════════════════════════════════════════════════════════════════════

// La ÚNICA regla del libro (Santa Eucaristía, Texto Estándar y Texto antiguo
// renovado) es: «Se puede cantar o decir el Gloria o algún otro cántico de
// alabanza, todos de pie. Es apropiado omitir el canto de alabanza durante los
// tiempos de penitencia y los días señalados para el ayuno». El libro llama
// penitencial a la Cuaresma («Lent and other penitential occasions») y no dice
// en ninguna parte que Adviento lo sea: lo presenta como el tiempo que precede
// a la Navidad. DECISIÓN DEL USUARIO (2026-11-02, tras comparar con el libro):
// se omite TAMBIÉN en Adviento, por la costumbre occidental tradicional y por
// coherencia con el Misal Anglicano de la raíz. El libro no lo exige (el BCP
// episcopal de 1979 sí lo omite en Adviento y Cuaresma). Una auditoría ya lo
// retiró una vez por esa razón: no volver a quitarlo sin que el usuario lo pida.
//
// Se omite, pues, en Adviento, Cuaresma y Semana Santa (season 'advent', 'lent'
// y 'holyWeek', domingos incluidos; el Domingo de Ramos queda omitido), salvo el
// Jueves Santo, donde sí se dice. No se omite en las FIESTAS fijas del santoral
// (dayInfo.isFixed) que caen dentro de esos tiempos (San Andrés, Santo Tomás,
// San Matías, San José, la Anunciación). Los días de ayuno que el libro señala
// fuera de la Cuaresma (Témporas, Rogativas, los viernes) son opcionales y el
// calendario no los emite. Lo usan app.js y librito-pueblo.js, así que ambos
// concuerdan.
function shouldOmitGloria(dayInfo) {
  if (!dayInfo) return false;
  if (dayInfo.key === 'maundyThursday') return false;
  if (dayInfo.isFixed === true) return false;
  return dayInfo.season === 'advent' || dayInfo.season === 'lent' || dayInfo.season === 'holyWeek';
}

// Qué Aclamación de apertura lleva el día: 'lent' | 'holyWeek' | 'easter' | 'pentecost' | 'ordinary'. El libro la
// rotula «En el tiempo de Cuaresma» (del Miércoles de Ceniza a la víspera del Domingo de Ramos), «Para la Semana
// Santa» (saludo propio, el mismo con que abre la liturgia del Jueves Santo), «Desde el día de Resurrección
// hasta la Víspera de Pentecostés» y «Para el Día de Pentecostés» (el saludo de Joel; DECISIÓN DEL USUARIO,
// 2026-11-02: se usa, en vez de la Aclamación fija que el libro también admite). El Día de Pentecostés no es
// Pascua para la Aclamación. Las otras opciones de esa página se usan igual (decisión del revisor con la autoridad
// delegada por el usuario, 2026-11-02, para que todos los tiempos con saludo propio lo lleven): Adviento; Navidad
// (hasta el 5 de enero) y la Presentación (2 feb); Epifanía hasta su final; Todos los Santos (1 nov). Lo demás (las
// semanas de Pentecostés a Adviento, el Tiempo Ordinario) lleva la Aclamación ordinaria.
// OJO: la Fracción sin Aleluya (Cuaresma y Semana Santa) y la Despedida con «aleluya, aleluya» (hasta el Día
// de Pentecostés inclusive) siguen otras reglas y las deciden app.js y librito-pueblo.js. Lo usan ambos.
function acclamationKind(dayInfo) {
  const s = dayInfo && dayInfo.season;
  if (dayInfo && dayInfo.key === 'pentecost') return 'pentecost';
  if (s === 'lent') return 'lent';
  if (s === 'holyWeek') return 'holyWeek';
  if (s === 'easter') return 'easter';
  if (dayInfo && dayInfo.key === '11-01') return 'allSaints';
  if (dayInfo && dayInfo.key === '02-02') return 'christmas';
  if (s === 'advent') return 'advent';
  if (s === 'christmas') return 'christmas';
  if (s === 'epiphany') return 'epiphany';
  return 'ordinary';
}

const GLORIA_OMITTED_RUBRIC ='Es apropiado omitir el canto de alabanza durante los tiempos de penitencia y los días señalados para el ayuno: en Cuaresma se omite el Gloria in excelsis.';
// En Adviento el libro no manda omitirlo: es costumbre, y la rúbrica impresa lo dice así en vez de llamarlo Cuaresma.
const GLORIA_OMITTED_RUBRIC_ADVENT = 'Por costumbre, en Adviento se omite el Gloria in excelsis (el Libro pide omitirlo en los tiempos de penitencia y los días señalados para el ayuno).';
function gloriaOmittedRubric(dayInfo) {
  return dayInfo && dayInfo.season === 'advent' ? GLORIA_OMITTED_RUBRIC_ADVENT : GLORIA_OMITTED_RUBRIC;
}

// ══════════════════════════════════════════════════════════════════════════
//  DÍAS SIN EUCARISTÍA: VIERNES SANTO Y SÁBADO SANTO
// ══════════════════════════════════════════════════════════════════════════

// El libro dice, en el rito propio de cada día, que la Eucaristía no se celebra:
// Viernes Santo (el rito empieza en la p. 565; la frase está en «Distribución de
// la Comunión», p. 575): «El rito de la Santa Eucaristía no se celebra en este
// día.»; Sábado Santo (p. 578): «No hay celebración de la Eucaristía en este
// día.». Este generador solo arma el Texto Estándar de la Santa Eucaristía y no
// modela esos dos ritos propios, así que en lugar de imprimir una Eucaristía
// completa, con Oración de Consagración, muestra la frase del libro y remite a
// la página donde empieza el rito. La Vigilia Pascual (p. 582) tampoco está
// modelada.
const NO_EUCHARIST_DAYS = {
  goodFriday:   { sentence: 'El rito de la Santa Eucaristía no se celebra en este día.', page: 565 },
  holySaturday: { sentence: 'No hay celebración de la Eucaristía en este día.', page: 578 },
};

// Devuelve el aviso (texto plano) si el día no tiene Eucaristía; '' si la tiene.
function noEucharistNotice(dayInfo) {
  const n = dayInfo && NO_EUCHARIST_DAYS[dayInfo.key];
  if (!n) return '';
  return n.sentence;
}

// ══════════════════════════════════════════════════════════════════════════
//  ESCAPE DE HTML (para mensajes de error inyectados con innerHTML)
// ══════════════════════════════════════════════════════════════════════════

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ══════════════════════════════════════════════════════════════════════════
//  SALMOS: TÍTULO FUNDIDO EN EL VERSÍCULO 1
// ══════════════════════════════════════════════════════════════════════════

// La Biblia de Jerusalén numera el título del salmo como versículo 1. En muchos
// salmos ocupa un versículo propio y biblia-wrapper.js ya lo salta
// (PSALM_TITLE_OFFSET); en los de esta tabla va fundido en el v. 1 con el
// comienzo del cuerpo («Salmo. De David. Yahveh es mi pastor, nada me falta.»)
// y el wrapper no puede saltarlo sin perder ese comienzo. El título no forma
// parte del salmo que se proclama: las citas del leccionario, con numeración
// inglesa, empiezan en el primer versículo del cuerpo.
//
// Cada entrada es el texto LITERAL del título, con su espacio final, tal como abre
// el v. 1 de la Biblia. Solo se recorta; no se añade ni se cambia ninguna palabra.
// La lista no sale de una heurística sino de leer el v. 1 de los 87 salmos que cita
// el leccionario; test-bcp2019.js comprueba que cada título sigue abriendo su
// versículo y que ningún salmo del día empieza con un título. Las letras del
// acróstico («Alef.», «Bet.») no son título y se dejan como están.
const PSALM_FUSED_TITLE = {
  // Los salmos 11 a 144 de abajo que no citan los domingos (11, 14, 28, 35, 73, 74, 79, 101, 109, 120, 125, 127-129, 131, 133,
  // 134, 141, 143 y 144) se añadieron el 2026-11-07 para el ciclo de 60 días del Leccionario del Oficio Diario, que recorre
  // todo el Salterio: se leyó el v. 1 de los 150 salmos y estos son los que traen título fundido (134 lo trae con la errata
  // «Cancion» de la Biblia cargada, que se copia tal cual).
  11: 'Del maestro de coro. De David. ',
  14: 'Del maestro de coro. De David. ',
  28: 'De David. ',
  35: 'De David. ',
  73: 'Salmo. De Asaf. ',
  74: 'Poema. De Asaf. ',
  79: 'Salmo. De Asaf. ',
  101: 'De David. Salmo. ',
  109: 'Del maestro de coro. De David. Salmo. ',
  120: 'Canción de las subidas. ',
  125: 'Canción de las subidas. ',
  127: 'Canción de las subidas. De Salomón. ',
  128: 'Canción de las subidas. ',
  129: 'Canción de las subidas. ',
  131: 'Canción de las subidas. De David. ',
  133: 'Canción de las subidas. De David. ',
  134: 'Cancion de las subidas. ',
  141: 'Salmo. De David. ',
  143: 'Salmo. De David. ',
  144: 'De David. ',
  15: 'Salmo. De David. ',
  16: 'A media voz. De David. ',
  17: 'Oración. De David. ',
  23: 'Salmo. De David. ',
  24: 'Salmo. De David. ',
  25: 'De David ',
  26: 'De David. ',
  27: 'De David. ',
  29: 'Salmo. De David. ',
  32: 'De David. Poema. ',
  37: 'De David. ',
  50: 'Salmo. De Asaf. ',
  66: 'Del maestro de coro. Cántico. Salmo. ',
  72: 'De Salomón. ',
  78: 'Poema. De Asaf. ',
  82: 'Salmo. De Asaf. ',
  86: 'Oración. De David. ',
  87: 'De los hijos de Coré. Salmo. Cántico. ',
  90: 'Oración. De Moisés, hombre de Dios. ',
  98: 'Salmo. ',
  100: 'Salmo. Para la acción de gracias. ',
  103: 'De David. ',
  110: 'De David. Salmo. ',
  121: 'Canción para las subidas. ',
  122: 'Canción de las subidas. De David. ',
  123: 'Canción de las subidas. ',
  124: 'Canción de las subidas. De David. ',
  126: 'Canción de las subidas. ',
  130: 'Canción de las subidas. ',
  132: 'Canción de las subidas. ',
  138: 'De David. ',
  139: 'Del maestro de coro. De David. Salmo. ',
  145: 'Himno. De David. ',
};

// Versículos de un salmo ({v, h, content}, como los devuelve BibliaJerusalen.getVerses)
// listos para mostrar: quita el título fundido del v. 1 si la cita lo incluye.
function cleanPsalmVerses(ref, verses) {
  const m = /^Psalms? (\d+)/.exec(String(ref || '').trim());
  const title = m && PSALM_FUSED_TITLE[+m[1]];
  if (!title || !verses || !verses.length) return verses;
  return verses.map(v => (v.h === '1' && String(v.content).startsWith(title)) ? { ...v, content: v.content.slice(title.length) } : v);
}

// ══════════════════════════════════════════════════════════════════════════
//  NUMERACIÓN DE VERSÍCULOS: LECCIONARIO (inglesa) → BIBLIA DE JERUSALÉN (hebrea)
// ══════════════════════════════════════════════════════════════════════════

// El leccionario del libro cita con la numeración de las Biblias inglesas; la
// Biblia de Jerusalén cargada sigue la hebrea, que en unos pocos pasajes parte
// el texto de otro modo (los Salmos los resuelve biblia-wrapper.js, no esta
// tabla). Cada fila: [libro, capítulo inglés, del v., al v., capítulo BdJ,
// desplazamiento de versículo]. Solo están los pasajes que usa el leccionario
// del BCP 2019 (test-bcp2019.js comprueba que cada cita devuelve texto): Is 9:1 inglés = 8:23
// hebreo, Is 64:1 = 63:19, Os 2:1-23 = 2:3-25, Jon 1:17 = 2:1 y Jon 2:1-10 = 2:2-11 (este último y el de la
// Gran Vigilia: Jonás 1:1-2:10), Mi 5:1 =
// 4:14 y 5:2-15 = 5:1-14, Mal 4:1-6 = 3:19-24, Gn 32:1-32 = 32:2-33 y
// Ex 22:1 = 21:37 y 22:2-31 = 22:1-30.
// A las citas del leccionario dominical se sumaron (2026-11-07) las del Leccionario del Oficio Diario (daily-office.js),
// que lee capítulos ENTEROS de toda la Biblia: aquí están también los demás capítulos cuya numeración inglesa parte el
// texto de otro modo que la hebrea (Gn 31-32, Ex 7-8 y 21-22, Nm 16-17, Dt 12-13 y 22-23, 1 S 20-24, 2 S 18-19, 1 R 4-5,
// 2 Cr 13-14, Ne 3-4 y 9-10, Job 40-41, Qo 4-5, Ct 6-7, Is 8-9 y 63-64, Jr 8-9, Ez 20-21, Dn 3-6, Os 1-2 y 11-14, Jl 2-3,
// Jon 1-2, Mi 4-5, Na 1-2, Za 1-2 y Mal 3-4). La concordancia es la estándar inglés↔hebreo y se comprobó contra el conteo de
// versículos de la Biblia de Jerusalén cargada (cada capítulo hebreo tiene los versículos que esa concordancia predice).
// Daniel sigue la Biblia de Jerusalén (versión griega): Dn 3:24-30 inglés = 3:91-97, 4:1-3 = 3:98-100 y 4:4-37 = 4:1-34,
// 5:31 = 6:1 y 6:1-28 = 6:2-29; las adiciones griegas de Dn 3 (la Oración de Azarías y el Cántico) no son de la cita inglesa.
// Límite: 1 S 20:42 inglés es el 20:42 y el 21:1 hebreos (el v. 42 se parte en dos), y Is 63:19 hebreo trae el 63:19 y el 64:1
// ingleses: el tramo del segundo no se puede separar por versículos.
const VERSE_SHIFTS = [
  ['Genesis', 31, 55, 55, 32, -54], ['Genesis', 32, 1, 32, 32, 1],
  ['Exodus', 8, 1, 4, 7, 25], ['Exodus', 8, 5, 32, 8, -4],
  ['Exodus', 22, 1, 1, 21, 36], ['Exodus', 22, 2, 31, 22, -1],
  ['Numbers', 16, 36, 50, 17, -35], ['Numbers', 17, 1, 13, 17, 15],
  ['Deuteronomy', 12, 32, 32, 13, -31], ['Deuteronomy', 13, 1, 18, 13, 1],
  ['Deuteronomy', 22, 30, 30, 23, -29], ['Deuteronomy', 23, 1, 25, 23, 1],
  ['1 Samuel', 21, 1, 15, 21, 1], ['1 Samuel', 23, 29, 29, 24, -28], ['1 Samuel', 24, 1, 22, 24, 1],
  ['2 Samuel', 18, 33, 33, 19, -32], ['2 Samuel', 19, 1, 43, 19, 1],
  ['1 Kings', 4, 21, 34, 5, -20], ['1 Kings', 5, 1, 18, 5, 14],
  ['2 Chronicles', 14, 1, 1, 13, 22], ['2 Chronicles', 14, 2, 15, 14, -1],
  ['Nehemiah', 4, 1, 6, 3, 32], ['Nehemiah', 4, 7, 23, 4, -6],
  ['Nehemiah', 9, 38, 38, 10, -37], ['Nehemiah', 10, 1, 39, 10, 1],
  ['Job', 41, 1, 8, 40, 24], ['Job', 41, 9, 34, 41, -8],
  ['Ecclesiastes', 5, 1, 1, 4, 16], ['Ecclesiastes', 5, 2, 20, 5, -1],
  ['Song of Songs', 6, 13, 13, 7, -12], ['Song of Songs', 7, 1, 13, 7, 1],
  ['Isaiah', 9, 1, 1, 8, 22], ['Isaiah', 9, 2, 21, 9, -1],
  ['Isaiah', 64, 1, 1, 63, 18], ['Isaiah', 64, 2, 12, 64, -1],
  ['Jeremiah', 9, 1, 1, 8, 22], ['Jeremiah', 9, 2, 26, 9, -1],
  ['Ezekiel', 20, 45, 49, 21, -44], ['Ezekiel', 21, 1, 32, 21, 5],
  ['Daniel', 3, 24, 30, 3, 67], ['Daniel', 4, 1, 3, 3, 97], ['Daniel', 4, 4, 37, 4, -3],
  ['Daniel', 5, 31, 31, 6, -30], ['Daniel', 6, 1, 28, 6, 1],
  ['Hosea', 1, 10, 11, 2, -9], ['Hosea', 2, 1, 23, 2, 2],
  ['Hosea', 11, 12, 12, 12, -11], ['Hosea', 12, 1, 14, 12, 1],
  ['Hosea', 13, 16, 16, 14, -15], ['Hosea', 14, 1, 9, 14, 1],
  ['Joel', 2, 28, 32, 3, -27], ['Joel', 3, 1, 21, 4, 0],
  ['Jonah', 2, 1, 10, 2, 1], ['Jonah', 1, 17, 17, 2, -16],
  ['Micah', 5, 1, 1, 4, 13], ['Micah', 5, 2, 15, 5, -1],
  ['Nahum', 1, 15, 15, 2, -14], ['Nahum', 2, 1, 13, 2, 1],
  ['Zechariah', 1, 18, 21, 2, -17], ['Zechariah', 2, 1, 13, 2, 4],
  ['Malachi', 4, 1, 6, 3, 18],
];
// Último versículo de un capítulo inglés, donde hace falta para abrir un tramo entre capítulos o para leer el capítulo
// entero sin arrastrar versículos que el inglés cuenta en el capítulo siguiente.
const ESV_CHAPTER_LAST = {
  'Malachi 3': 18, 'Exodus 7': 25, 'Exodus 21': 36, '2 Chronicles 13': 22, 'Nehemiah 3': 32, 'Job 40': 24, 'Ecclesiastes 4': 16,
  'Isaiah 8': 22, 'Jeremiah 8': 22, 'Daniel 3': 30, 'Micah 4': 13,
};

// Versículos que el leccionario pide y la Biblia de Jerusalén cargada NO trae en el texto (los remite a una nota por ser
// dudosos en los manuscritos). Se completan con otra traducción, a petición del usuario (2026-11-02), y la lectura lo
// avisa con una rúbrica para que nadie crea que es de la Biblia de Jerusalén. Mt 21:44 (pasaje del Propio 22, ciclo A):
// el texto es el de la NVI, la versión en que cita la Escritura el libro en español. Para cambiar de traducción basta
// con cambiar `text` y `source` (la Reina-Valera 1909, de dominio público, dice: «Y el que cayere sobre esta piedra,
// será quebrantado; y sobre quien ella cayere, le desmenuzará.»).
const VERSE_SUPPLEMENTS = [
  { book: 'Matthew', chapter: 21, verse: 44, source: 'NVI', text: 'El que caiga sobre esta piedra quedará despedazado, y si ella cae sobre alguien, lo hará polvo.' },
];

// Inserta en el texto de una cita de UN capítulo («Libro c:a-b») los versículos de VERSE_SUPPLEMENTS que la cita incluye y
// el texto no trae, en su sitio (antes del primer versículo mayor, o al final).
function applyVerseSupplements(ref, text) {
  const m = /^((?:[1-3] )?[A-Za-z ]+?)\s+(\d+):(\d+)-(\d+)$/.exec(String(ref || '').trim());
  if (!m || !text) return text;
  let out = text;
  for (const s of VERSE_SUPPLEMENTS) {
    if (s.book !== m[1] || s.chapter !== +m[2] || s.verse < +m[3] || s.verse > +m[4]) continue;
    const marca = `<sup class="verse-num">${s.verse}</sup>`;
    if (out.includes(marca)) continue;
    const nota = `<em class="rubric">[v. ${s.verse} según la ${s.source}; la Biblia de Jerusalén no lo trae en el texto]</em>`;
    const bloque = `${marca} ${s.text} ${nota}`;
    const sig = [...out.matchAll(/<sup class="verse-num">(\d+)[a-z]?<\/sup>/g)].find(x => +x[1] > s.verse);
    out = sig ? out.slice(0, sig.index) + bloque + ' ' + out.slice(sig.index) : out.trimEnd() + ' ' + bloque;
  }
  return out;
}

// Devuelve la cita partida en tramos de la Biblia de Jerusalén —cada uno con
// la etiqueta (versículo inglés) de su primer versículo— o null si la cita no
// necesita conversión (la gran mayoría) o no se entiende: entonces se lee tal cual.
function toBibliaPieces(ref) {
  const m = /^((?:[1-3] )?[A-Za-z ]+?)\s+(\d.*)$/.exec(String(ref || '').trim());
  if (!m || !VERSE_SHIFTS.some(s => s[0] === m[1])) return null;
  const book = m[1];
  const segs = []; let last = null;
  for (const raw of m[2].split(',')) {
    let mm = raw.match(/^(\d+):(\d+)-(\d+):(\d+)$/);
    if (!mm && last != null) { // «25-3:7»: del v. 25 del capítulo en curso al 3:7
      const x = raw.match(/^(\d+)-(\d+):(\d+)$/);
      if (x) mm = [raw, last, x[1], x[2], x[3]];
    }
    if (mm) {
      const c1 = +mm[1], c2 = +mm[3];
      for (let c = c1; c <= c2; c++) segs.push({ c, a: c === c1 ? +mm[2] : 1, b: c === c2 ? +mm[4] : (ESV_CHAPTER_LAST[book + ' ' + c] || 999) });
      last = c2;
    } else if ((mm = raw.match(/^(\d+):(\d+)-(\d+)$/))) { segs.push({ c: +mm[1], a: +mm[2], b: +mm[3] }); last = +mm[1]; }
    else if ((mm = raw.match(/^(\d+):(\d+)$/))) { segs.push({ c: +mm[1], a: +mm[2], b: +mm[2] }); last = +mm[1]; }
    else if (last != null && (mm = raw.match(/^(\d+)-(\d+)$/))) segs.push({ c: last, a: +mm[1], b: +mm[2] });
    else if (last != null && (mm = raw.match(/^(\d+)$/))) segs.push({ c: last, a: +mm[1], b: +mm[1] });
    // Capítulos enteros («Joel 2», «Job 25-26»), como los cita el Leccionario del Oficio Diario: hasta el último versículo
    // INGLÉS del capítulo (ESV_CHAPTER_LAST) si el hebreo trae más, que el inglés cuenta en el capítulo siguiente.
    else if (last == null && (mm = raw.match(/^(\d+)(?:-(\d+))?$/))) {
      const c1 = +mm[1], c2 = mm[2] ? +mm[2] : c1;
      for (let c = c1; c <= c2; c++) { const tope = ESV_CHAPTER_LAST[book + ' ' + c]; segs.push({ c, a: 1, b: tope || 999, tope: !!tope }); }
      last = c2;
    }
    else return null;
  }
  let changed = false;
  const pieces = [];
  for (const s of segs) {
    if (s.tope) changed = true;
    let cur = s.a;
    while (cur <= s.b) {
      const rule = VERSE_SHIFTS.find(r => r[0] === book && r[1] === s.c && cur >= r[2] && cur <= r[3]);
      if (rule) {
        const end = Math.min(s.b, rule[3]);
        pieces.push({ book, c: rule[4], a: cur + rule[5], b: end + rule[5], label: cur });
        cur = end + 1; changed = true;
      } else {
        const end = Math.min(s.b, ...VERSE_SHIFTS.filter(r => r[0] === book && r[1] === s.c && r[2] > cur).map(r => r[2] - 1));
        pieces.push({ book, c: s.c, a: cur, b: end, label: cur });
        cur = end + 1;
      }
    }
  }
  return changed ? pieces : null;
}

// Texto de una cita convertida con toBibliaPieces(): lee cada tramo de la Biblia
// de Jerusalén y rotula los versículos con la numeración del libro (la de la
// cita impresa en el encabezado), no con la hebrea.
function biblePassageFromPieces(ref, pieces) {
  const out = [];
  for (const p of pieces) {
    for (const v of window.BibliaJerusalen.getVerses(`${p.book} ${p.c}:${p.a}-${p.b}`)) {
      out.push(`<sup class="verse-num">${p.label + (parseInt(v.h, 10) - p.a)}</sup> ${v.content}`);
    }
  }
  if (!out.length) return { text: `<em class="rubric">[No se encontró: ${ref} — verifique el nombre del libro]</em>`, reference: ref };
  return { text: out.join(' '), reference: ref };
}
