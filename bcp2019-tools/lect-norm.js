// Normalización de la notación del leccionario del BCP 2019 («Sunday, Holy Day, and Commemoration
// Lectionary», pp. 717-733) a las citas que usa bcp2019/js/lectionary.js. La comparten el generador
// (build-lectionary.js) y la prueba (test-bcp2019.js), así que no pueden discrepar.
//
//  - guion largo entre capítulos → "-"; abreviaturas del libro → nombre inglés completo;
//  - los sufijos a/b/c (medio versículo) y «v» (numeración del Salterio) se descartan;
//  - los versículos opcionales, entre paréntesis, se INCLUYEN;
//  - se fusionan segmentos contiguos o solapados del mismo capítulo («14:1-2,3-9» → «14:1-9»);
//  - «A or B»: se toma la primera alternativa; en los salmos, la porción más corta.
'use strict';

const BOOKS = {
  Gen: 'Genesis', Ex: 'Exodus', Lev: 'Leviticus', Num: 'Numbers', Deut: 'Deuteronomy', Josh: 'Joshua', Judg: 'Judges', Ruth: 'Ruth',
  '1 Sam': '1 Samuel', '2 Sam': '2 Samuel', '1 Kings': '1 Kings', '2 Kings': '2 Kings', '1 Chr': '1 Chronicles', '2 Chr': '2 Chronicles',
  Neh: 'Nehemiah', Job: 'Job', Ps: 'Psalm', Prov: 'Proverbs', Eccl: 'Ecclesiastes', Isa: 'Isaiah', Jer: 'Jeremiah', Ezek: 'Ezekiel',
  Dan: 'Daniel', Hos: 'Hosea', Joel: 'Joel', Amos: 'Amos', Jon: 'Jonah', Jonah: 'Jonah', Mic: 'Micah', Hab: 'Habakkuk', Zeph: 'Zephaniah',
  Hag: 'Haggai', Zech: 'Zechariah', Mal: 'Malachi', Wisdom: 'Wisdom', Ecclesiasticus: 'Sirach', Baruch: 'Baruch', Judith: 'Judith',
  Matt: 'Matthew', Mark: 'Mark', Luke: 'Luke', John: 'John', Acts: 'Acts', Rom: 'Romans', '1 Cor': '1 Corinthians', '2 Cor': '2 Corinthians',
  Gal: 'Galatians', Eph: 'Ephesians', Phil: 'Philippians', Col: 'Colossians', '1 Thess': '1 Thessalonians', '2 Thess': '2 Thessalonians',
  '1 Tim': '1 Timothy', '2 Tim': '2 Timothy', Titus: 'Titus', Philemon: 'Philemon', Heb: 'Hebrews', James: 'James', '1 Pet': '1 Peter',
  '2 Pet': '2 Peter', '1 John': '1 John', '2 John': '2 John', '3 John': '3 John', Jude: 'Jude', Rev: 'Revelation',
};

function parseSeg(seg, lastCh) {
  let m;
  if ((m = seg.match(/^(\d+):(\d+)-(\d+):(\d+)$/))) return { c1: +m[1], a: +m[2], c2: +m[3], b: +m[4] };
  if ((m = seg.match(/^(\d+):(\d+)-(\d+)$/))) return { c1: +m[1], a: +m[2], c2: +m[1], b: +m[3] };
  if ((m = seg.match(/^(\d+):(\d+)$/))) return { c1: +m[1], a: +m[2], c2: +m[1], b: +m[2] };
  if (lastCh != null) {
    if ((m = seg.match(/^(\d+)-(\d+):(\d+)$/))) return { c1: lastCh, a: +m[1], c2: +m[2], b: +m[3] };
    if ((m = seg.match(/^(\d+)-(\d+)$/))) return { c1: lastCh, a: +m[1], c2: lastCh, b: +m[2] };
    if ((m = seg.match(/^(\d+)$/))) return { c1: lastCh, a: +m[1], c2: lastCh, b: +m[1] };
  }
  return null;
}

function mergeSegs(rest) {
  const raw = rest.split(',').filter(Boolean);
  if (!raw.length) return rest;
  if (!/:/.test(raw[0])) return raw.join(','); // capítulo entero o libro de un capítulo ("Ps 122", "Philemon 1-21")
  const segs = []; let last = null;
  for (const r of raw) {
    const p = parseSeg(r, last);
    if (!p) return raw.join(',');
    const prev = segs[segs.length - 1];
    if (prev && prev.c2 === p.c1 && prev.c1 === prev.c2 && p.c1 === p.c2 && p.a <= prev.b + 1) prev.b = Math.max(prev.b, p.b);
    else segs.push(p);
    last = p.c2;
  }
  const out = []; let lastC = null;
  for (const s of segs) {
    if (s.c1 !== s.c2) { out.push(`${s.c1}:${s.a}-${s.c2}:${s.b}`); lastC = s.c2; continue; }
    const body = s.a === s.b ? `${s.a}` : `${s.a}-${s.b}`;
    out.push(s.c1 === lastC ? body : `${s.c1}:${body}`);
    lastC = s.c1;
  }
  return out.join(',');
}

// Una sola cita del libro → cita normalizada, o null si no es una cita bíblica.
function normOne(raw) {
  const s = String(raw).trim().replace(/[—–]/g, '-').replace(/\s+/g, ' ');
  // El libro puede abrir un paréntesis justo tras el libro: «Matt (26:36-75) 27:1-54 (55-66)».
  const m = s.match(/^((?:[1-3] )?[A-Za-z]+)\s+\(?(\d.*)$/);
  if (!m) return null;
  const book = BOOKS[m[1]];
  if (!book) throw new Error('libro desconocido «' + m[1] + '» en «' + raw + '»');
  let rest = m[2];
  rest = rest.replace(/(\d)[a-d]\b/g, '$1').replace(/(\d)v\b/g, '$1');
  rest = rest.replace(/\)(?=\d)/g, ',').replace(/(\d)\(/g, '$1,').replace(/[()]/g, '');
  rest = rest.replace(/\s+/g, ',').replace(/,+/g, ',').replace(/^,|,$/g, '');
  return `${book} ${mergeSegs(rest)}`;
}

// Nº aproximado de versículos, para elegir la porción más corta de un salmo.
function size(ref) {
  const r = ref.replace(/^[^\d]*/, '');
  if (!/:/.test(r)) return 100;
  return r.split(',').reduce((n, seg) => {
    const m = seg.match(/(\d+)(?:-(\d+))?$/);
    return n + (m ? ((m[2] ? +m[2] : +m[1]) - +m[1] + 1) : 1);
  }, 0);
}

function pick(raw, slot) {
  if (raw == null) return null;
  const alts = String(raw).split(/\s+or\s+/).map(a => a.trim()).filter(Boolean);
  const norm = [];
  for (const a of alts) {
    let n = normOne(a);
    if (!n && /^\d/.test(a) && slot === 'psalm') n = normOne('Ps ' + a); // "80:1-7v" = porción del mismo salmo
    if (n) norm.push(n);
  }
  if (!norm.length) return null;
  if (slot === 'psalm') return norm.reduce((best, n) => (size(n) < size(best) ? n : best));
  return norm[0];
}

function readingSet(o) {
  const g = s => pick(o[s], s);
  return { first: g('first'), psalm: g('psalm'), second: g('second'), gospel: g('gospel') };
}

module.exports = { BOOKS, normOne, pick, readingSet, mergeSegs, parseSeg };
