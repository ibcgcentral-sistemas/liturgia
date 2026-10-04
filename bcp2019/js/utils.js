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

// Misma regla que el Misal Anglicano de la raíz (Calendar.getOmissions): el
// Gloria se omite en el oficio de los tiempos penitenciales —aquí Adviento,
// Cuaresma y Semana Santa (season 'advent', 'lent' y 'holyWeek', domingos
// incluidos; el Domingo de Ramos queda omitido)— salvo el Jueves Santo, donde
// sí se dice. No se omite en las FIESTAS fijas del santoral (dayInfo.isFixed)
// que caen dentro de esos tiempos (San Matías, San José, la Anunciación, San
// Andrés, Santo Tomás). Navidad, Epifanía, Pascua y el tiempo ordinario no
// cambian. Lo usan app.js y librito-pueblo.js, así que ambos concuerdan.
function shouldOmitGloria(dayInfo) {
  if (!dayInfo) return false;
  if (dayInfo.key === 'maundyThursday') return false;
  if (dayInfo.isFixed === true) return false;
  return dayInfo.season === 'advent' || dayInfo.season === 'lent' || dayInfo.season === 'holyWeek';
}

const GLORIA_OMITTED_RUBRIC = 'El Gloria in excelsis se omite en Adviento y Cuaresma.';

// ══════════════════════════════════════════════════════════════════════════
//  ESCAPE DE HTML (para mensajes de error inyectados con innerHTML)
// ══════════════════════════════════════════════════════════════════════════

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
