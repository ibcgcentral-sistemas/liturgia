// sim_refs2.js — Análisis complementario de referencias:
//  (a) solapamientos entre lecturas de una misma entrada (misma cita dos veces el mismo día),
//  (b) rangos que arrancan o terminan a mitad de frase (indicio de límites mal puestos),
//  (c) días con el título del salmo fundido en v.1,
//  (d) la misma cita en dos papeles distintos.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./sim_lib');
const C = L.load();
const B = C.Biblia, bible = C.bible;
const SUN = C.BCPLectionary.SUNDAY;
const out = []; const P = (...a) => out.push(a.join(' '));
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'sweep.json'), 'utf8'));

function verseSet(ref) {
  const p = B.parseRef(ref); if (!p) return new Set();
  const s = new Set();
  const book = bible.getBook(p.bookName);
  for (const rg of p.ranges) {
    const c = book && book.chapters[rg.chapter - 1];
    const last = c ? Math.max(...Object.keys(c.verses).map(Number).filter(n => n >= 1)) : rg.verseEnd;
    const end = rg.verseEnd >= 999 ? last : rg.verseEnd;
    for (let v = rg.verseStart; v <= end; v++) s.add(`${p.bookName}|${rg.chapter}|${v}`);
  }
  return s;
}

// (a) solapamientos dentro de una misma entrada
P('## (a) Solapamiento de versículos entre lecturas de la MISMA entrada (clave/ciclo)');
let na = 0;
for (const [key, entry] of Object.entries(SUN)) for (const [cyc, r] of Object.entries(entry)) {
  const roles = ['first', 'psalm', 'second', 'gospel'].filter(x => r[x]);
  for (let i = 0; i < roles.length; i++) for (let j = i + 1; j < roles.length; j++) {
    const a = verseSet(r[roles[i]]), b = verseSet(r[roles[j]]);
    let inter = 0; for (const x of a) if (b.has(x)) inter++;
    if (inter) { na++; P(`  ${key}/${cyc}: ${roles[i]} «${r[roles[i]]}» ∩ ${roles[j]} «${r[roles[j]]}» = ${inter} versículo(s) comunes`); }
  }
}
if (!na) P('  ninguno');
// días del barrido afectados por cada uno
const SUNdays = {};
for (const r of R) { SUNdays[r.lkey + '/' + r.lcycle] = (SUNdays[r.lkey + '/' + r.lcycle] || 0) + 1; }
// (d) misma cita en dos papeles
P('\n## (d) Misma cita literal en dos papeles dentro de una entrada');
for (const [key, entry] of Object.entries(SUN)) for (const [cyc, r] of Object.entries(entry)) {
  const roles = ['first', 'psalm', 'second', 'gospel'].filter(x => r[x]);
  for (let i = 0; i < roles.length; i++) for (let j = i + 1; j < roles.length; j++) if (r[roles[i]] === r[roles[j]]) {
    const lk = key + '/' + (entry.all ? 'all' : cyc);
    const days = R.filter(d => (d.key === key || d.lkey === key) && (d.lcycle === cyc || entry.all)).length;
    P(`  ${key}/${cyc}: ${roles[i]} == ${roles[j]} == «${r[roles[i]]}»  (días en el barrido: ${days})`);
  }
}

// (b) límites a mitad de frase
P('\n## (b) Indicios de límites a mitad de frase (heurística: primer versículo empieza en minúscula; último no termina en . ! ? » ” … ; etc.)');
const lowerStart = s => /^[a-záéíóúñü(\[]/.test(s.trim());
const okEnd = s => /[.!?»”…\)\]]\s*$/.test(s.trim()) || /[.!?»”…][»”"]?\s*$/.test(s.trim());
const rows = [];
const seen = new Set();
for (const [key, entry] of Object.entries(SUN)) for (const [cyc, r] of Object.entries(entry)) for (const role of ['first', 'psalm', 'second', 'gospel']) {
  const ref = r[role]; if (!ref || seen.has(role + ref)) continue; seen.add(role + ref);
  let vs = []; try { vs = B.getVerses(ref); } catch (e) {}
  if (!vs.length) continue;
  const first = vs[0].content, last = vs[vs.length - 1].content;
  const sMid = lowerStart(first), eMid = !okEnd(last);
  if (sMid || eMid) rows.push({ role, ref, sMid, eMid, first: first.slice(0, 55), last: last.slice(-45), use: `${key}/${cyc}` });
}
const cntRole = {}; for (const x of rows) { const k = x.role + (x.sMid ? ' inicio' : '') + (x.eMid ? ' fin' : ''); cntRole[k] = (cntRole[k] || 0) + 1; }
P('  refs distintas con indicio: ' + rows.length + '  ' + JSON.stringify(cntRole));
const nonPs = rows.filter(x => x.role !== 'psalm');
P('  --- NO salmos (lecturas y evangelios) ---');
for (const x of nonPs) P(`   [${x.role}] ${x.ref}  (${x.use})  ${x.sMid ? 'INICIO «' + x.first + '»' : ''} ${x.eMid ? ' FIN «…' + x.last + '»' : ''}`);
P('  --- salmos (en poesía, empezar en minúscula es frecuente; sólo se listan los FIN a mitad: termina en coma/dos puntos) ---');
for (const x of rows.filter(x => x.role === 'psalm' && x.eMid)) P(`   ${x.ref}  (${x.use})  FIN «…${x.last}»`);

// (c) días con título de salmo en v.1
P('\n## (c) Días con el título/encabezado fundido en el primer versículo del salmo mostrado');
const refsJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'refs.json'), 'utf8'));
const titleRefs = new Set(refsJson.filter(x => x.titleInV1).map(x => x.ref));
let dayTitle = 0, dayPsalm = 0; const perRef = {};
for (const d of R) {
  if (!d.refs || !d.refs.psalm) continue; dayPsalm++;
  if (titleRefs.has(d.refs.psalm)) { dayTitle++; perRef[d.refs.psalm] = (perRef[d.refs.psalm] || 0) + 1; }
}
P(`  días con salmo: ${dayPsalm};  con título fundido en v.1: ${dayTitle} (${(100 * dayTitle / dayPsalm).toFixed(1)}%);  refs de salmo afectadas: ${titleRefs.size}`);
// letras alfabéticas (Alef., Bet.) impresas
const acros = refsJson.filter(x => x.book === 'Salmos' && /(^|\s)(Alef|Bet|Guímel|Guimel|Dálet|He|Vau|Zain|Jet|Tet|Yod|Kaf|Lámed|Mem|Nun|Sámek|Ayin|Pe|Sade|Qof|Resh|Shin|Tau)\.\s/.test(x.sample));
P('  refs de salmo cuyo texto muestra nombres de letras del acróstico («Alef.», «Bet.»…) en la muestra: ' + acros.map(a => a.ref).join(', '));
// recorrer todos los versículos devueltos buscando letras acrósticas
const acroRe = /\b(Alef|Bet|Guímel|Dálet|Vau|Zain|Jet|Tet|Yod|Kaf|Lámed|Mem|Nun|Sámek|Ayin|Sade|Qof|Resh|Shin|Tau|Guimel|Dalet)\.\s/;
const acroRefs = [];
for (const [ref, ] of new Map(refsJson.filter(x => x.book === 'Salmos').map(x => [x.ref, 1]))) { const vs = B.getVerses(ref); if (vs.some(v => acroRe.test(v.content)) || vs.some(v => /\b(Alef|Bet|Guímel|Dálet)\b/.test(v.content))) acroRefs.push(ref); }
P('  refs de salmo con letras de acróstico en el texto mostrado: ' + acroRefs.join(', '));

fs.writeFileSync(path.join(__dirname, 'out', 'refs2.txt'), out.join('\n'));
console.log('ok');
