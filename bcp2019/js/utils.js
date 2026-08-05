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

function getGospelAuthor(gospelRef) {
  if (!gospelRef) return 'San Juan';
  if (gospelRef.includes('Matthew')) return 'San Mateo';
  if (gospelRef.includes('Mark')) return 'San Marcos';
  if (gospelRef.includes('Luke')) return 'San Lucas';
  return 'San Juan';
}
