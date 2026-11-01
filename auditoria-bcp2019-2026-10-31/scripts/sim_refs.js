// sim_refs.js — Todas las referencias distintas de BCPLectionary.SUNDAY contra la Biblia de Jerusalén real.
// Clasifica: OK / vacío / versículos ausentes (cita excede el capítulo) / muy corto / error / no parseable.
// Salmos: contrasta la tabla PSALM_TITLE_OFFSET contra el nº de versículos de la BdJ y los recuentos ingleses estándar (KJV).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./sim_lib');
const C = L.load();
const B = C.Biblia, bible = C.bible;
const SUN = C.BCPLectionary.SUNDAY;
const out = []; const P = (...a) => out.push(a.join(' '));

// Recuentos ingleses estándar (KJV/NRSV) de versículos por salmo — conocimiento externo, no del proyecto.
const ENG = [6,12,8,8,12,10,17,9,20,18, 7,8,6,7,5,11,15,50,14,9, 13,31,6,10,22,12,14,9,11,12, 24,11,22,22,28,12,40,22,13,17,
  13,11,5,26,17,11,9,14,20,23, 19,9,6,7,23,13,11,11,17,12, 8,12,11,10,13,20,7,35,36,5, 24,20,28,23,10,12,20,72,13,19,
  16,8,18,12,13,17,7,18,52,17, 16,15,5,23,11,13,12,9,9,5, 8,28,22,35,45,48,43,13,31,7, 10,10,9,8,18,19,2,29,176,7,
  8,9,4,8,5,6,5,6,8,8, 3,18,3,3,21,26,9,8,24,13, 10,7,12,15,21,10,20,14,9,6];

// ── 1) Reunir referencias ──
const usage = new Map(); // ref -> [{key, cycle, role}]
for (const [key, entry] of Object.entries(SUN)) {
  for (const [cyc, r] of Object.entries(entry)) {
    for (const role of ['first', 'psalm', 'second', 'gospel']) {
      const ref = r[role]; if (!ref) continue;
      if (!usage.has(ref)) usage.set(ref, []);
      usage.get(ref).push({ key, cyc, role });
    }
  }
}
P(`Referencias distintas en BCPLectionary.SUNDAY: ${usage.size}  (usos totales: ${[...usage.values()].reduce((a, b) => a + b.length, 0)})`);
const byRole = {}; for (const [ref, us] of usage) for (const u of us) byRole[u.role] = (byRole[u.role] || new Set()).add(ref);
P('  distintas por rol: ' + Object.entries(byRole).map(([k, s]) => `${k}=${s.size}`).join(' '));
P('  con sufijo a/b/c: ' + [...usage.keys()].filter(r => /\d[a-c]\b/.test(r)).length);

// ── 2) Análisis ──
const chapLen = (book, ch) => { const c = book.chapters[ch - 1]; if (!c || !c.verses) return 0; return Object.keys(c.verses).map(Number).filter(n => n >= 1).reduce((a, b) => Math.max(a, b), 0); };
const res = [];
for (const [ref, us] of usage) {
  const rec = { ref, uses: us.map(u => `${u.key}/${u.cyc}/${u.role}`), problems: [] };
  let parsed = null;
  try { parsed = B.parseRef(ref); } catch (e) { rec.problems.push('parse-throws: ' + e.message); }
  if (!parsed) { rec.problems.push('NO PARSEABLE'); res.push(rec); continue; }
  rec.book = parsed.bookName;
  const book = bible.getBook(parsed.bookName);
  if (!book) { rec.problems.push('LIBRO NO ENCONTRADO: ' + parsed.bookName); res.push(rec); continue; }
  const isPs = parsed.bookName === 'Salmos';
  const sirOffset = parsed.bookName === 'Eclesiástico' && book.chapters[0] && /Muchas e importantes lecciones/.test(String(book.chapters[0].verses['1'] || ''));
  // esperado
  let expected = 0, missing = [];
  for (const rg of parsed.ranges) {
    const ci = sirOffset ? rg.chapter : rg.chapter - 1;
    const c = book.chapters[ci];
    if (!c) { missing.push(`cap ${rg.chapter} inexistente`); continue; }
    const L_ = Math.max(...Object.keys(c.verses).map(Number).filter(n => n >= 1));
    const d = isPs ? (B.PSALM_TITLE_OFFSET[rg.chapter] || 0) : 0;
    if (isPs) {
      const engLen = ENG[rg.chapter - 1];
      const e0 = rg.verseEnd >= 999 ? engLen : rg.verseEnd;
      if (rg.verseEnd < 999 && rg.verseEnd > engLen) missing.push(`Sal ${rg.chapter}: v.${rg.verseEnd} > ${engLen} versículos ingleses`);
      expected += Math.max(0, Math.min(e0, engLen) - rg.verseStart + 1);
    } else {
      const e0 = rg.verseEnd >= 999 ? L_ : rg.verseEnd;
      if (rg.verseEnd < 999 && rg.verseEnd > L_) missing.push(`cap ${rg.chapter}: v.${rg.verseEnd} > último de BdJ (${L_})`);
      if (rg.verseStart > L_) missing.push(`cap ${rg.chapter}: inicio v.${rg.verseStart} > último de BdJ (${L_})`);
      expected += Math.max(0, Math.min(e0, L_) - rg.verseStart + 1);
    }
  }
  let verses = [], err = null;
  try { verses = B.getVerses(ref); } catch (e) { err = e.message; }
  let pass = { text: '' }; try { pass = B.getPassage(ref); } catch (e) { err = (err || '') + ' getPassage: ' + e.message; }
  rec.expected = expected; rec.returned = verses.length;
  const chars = verses.reduce((a, v) => a + v.content.length, 0);
  rec.chars = chars; rec.cpv = verses.length ? Math.round(chars / verses.length) : 0;
  if (err) rec.problems.push('LANZA ERROR: ' + err);
  if (!verses.length) rec.problems.push('VACÍO');
  else if (verses.length < expected) rec.problems.push(`CORTO: devuelve ${verses.length} de ${expected} versículos esperados`);
  else if (verses.length > expected) rec.problems.push(`LARGO: devuelve ${verses.length} > ${expected} esperados`);
  if (missing.length) rec.problems.push('EXCEDE BdJ/INGLÉS: ' + missing.join('; '));
  if (pass.text && /class="rubric"/.test(pass.text)) rec.problems.push('getPassage devuelve rúbrica de error: ' + pass.text.slice(0, 80));
  if (pass.text && pass.text.length > 22000) rec.problems.push('TRUNCADA (>' + 22000 + ' chars): ' + pass.text.length);
  if (verses.length && rec.cpv < 25) rec.problems.push('texto muy corto por versículo (' + rec.cpv + ' chars)');
  // duplicados de etiqueta v
  const labels = verses.map(v => v.v); if (new Set(labels).size !== labels.length) rec.problems.push('etiquetas de versículo duplicadas: ' + labels.join(','));
  // PSALMS: primer versículo con aspecto de título
  if (isPs && verses.length) {
    const t0 = verses[0].content;
    if (/^(Del maestro de coro|Salmo\.|Salmo |Cántico|Himno|Poema|Oración|Canción|Cancion|A media voz|De David|De Asaf|De los hijos|De Salomón|Lamentación|Plegaria)/.test(t0)) {
      rec.problems.push('SALMO: el primer versículo mostrado empieza con el TÍTULO/encabezado («' + t0.slice(0, 60) + '…»)');
      rec.titleInV1 = true;
    }
    // etiqueta mostrada vs. cita
    const firstReqChap = parsed.ranges[0];
    if (verses[0].v !== String(firstReqChap.verseStart) && firstReqChap.verseEnd < 999) rec.problems.push(`SALMO: etiqueta inicial ${verses[0].v} ≠ cita ${firstReqChap.verseStart}`);
  }
  rec.sample = verses.length ? (verses[0].content.slice(0, 70) + ' … ' + verses[verses.length - 1].content.slice(-50)) : '';
  rec.ranges = parsed.ranges.map(r => `${r.chapter}:${r.verseStart}-${r.verseEnd >= 999 ? 'fin' : r.verseEnd}`).join(' ; ');
  res.push(rec);
}
fs.writeFileSync(path.join(__dirname, 'out', 'refs.json'), JSON.stringify(res, null, 1));

const bad = res.filter(r => r.problems.length);
const kinds = {};
for (const r of bad) for (const p of r.problems) { const k = p.split(':')[0].split('(')[0].trim(); kinds[k] = (kinds[k] || 0) + 1; }
P(`\nReferencias con algún problema: ${bad.length} de ${res.length}`);
P('Tipos: ' + JSON.stringify(kinds));
P('\n### Listado de problemas por referencia (con usos)');
for (const r of bad) {
  P(`- ${r.ref}  [${r.ranges}]  usos: ${r.uses.slice(0, 8).join(', ')}${r.uses.length > 8 ? ' …(' + r.uses.length + ')' : ''}`);
  for (const p of r.problems) P('     · ' + p);
}

// ── 3) Verificación de la tabla de desfase de salmos ──
P('\n### Tabla PSALM_TITLE_OFFSET frente a recuentos (BdJ n − d  vs  inglés)');
const psBook = bible.getBook('Salmos');
const mism = [];
const titleRe = /^(Del maestro de coro|Salmo\.|Salmo |Cántico|Himno|Poema|Oración|Canción|Cancion|A media voz|De David|De Asaf|De los hijos|De Salomón|Lamentación|Plegaria|Lámed|Alef)/;
let tableOK = 0;
for (let n = 1; n <= 150; n++) {
  const ch = psBook.chapters[n - 1];
  const ks = Object.keys(ch.verses).map(Number).filter(x => x >= 1);
  const count = ks.length;
  const d = B.PSALM_TITLE_OFFSET[n] || 0;
  if (count - d === ENG[n - 1]) tableOK++; else mism.push({ n, bdj: count, d, eng: ENG[n - 1] });
}
P(`  Salmos donde (nº versículos BdJ − d) = recuento inglés: ${tableOK} de 150`);
P('  Discrepancias: ' + (mism.map(m => `Sal ${m.n}: BdJ=${m.bdj} d=${m.d} ing=${m.eng}`).join(' | ') || 'ninguna'));
// Salmos citados: cuáles tienen título fundido en v1 (d=0 pero v1 empieza con encabezado)
const used = new Set(); for (const r of res) if (r.book === 'Salmos') for (const m of r.ranges.matchAll(/(\d+):/g)) used.add(+m[1]);
// Capítulos de salmo citados (incluye cánticos que no son Salmos? no: sólo book==Salmos)
const fused = [];
for (const n of [...used].sort((a, b) => a - b)) {
  const v1 = psBook.chapters[n - 1].verses['1'];
  const d = B.PSALM_TITLE_OFFSET[n] || 0;
  if (d === 0 && titleRe.test(v1)) fused.push(n);
}
P(`  Salmos distintos citados: ${used.size}.  Con título FUNDIDO en v.1 (d=0 y v.1 empieza con encabezado): ${fused.length} -> ${fused.join(', ')}`);
// En d>0, comprobar que el verso 1 (h=1..d) realmente parece título
const notTitle = [];
for (const n of [...used].sort((a, b) => a - b)) {
  const d = B.PSALM_TITLE_OFFSET[n] || 0; if (!d) continue;
  for (let h = 1; h <= d; h++) { const t = psBook.chapters[n - 1].verses[String(h)]; if (!titleRe.test(t) && !/^(Cuando|Para|Según|«)/.test(t)) notTitle.push(`Sal ${n} v${h}: «${t.slice(0, 50)}»`); }
  const t = psBook.chapters[n - 1].verses[String(d + 1)];
  if (titleRe.test(t) && !/^(Cuando|Para)/.test(t)) notTitle.push(`Sal ${n} v${d + 1} (primero mostrado) parece título: «${t.slice(0, 50)}»`);
}
P('  d>0 donde un versículo omitido NO parece título, o el primero mostrado sí lo parece: ' + (notTitle.join(' | ') || 'ninguno'));

// ── 4) Cánticos usados como «salmo» ──
P('\n### Cánticos (no-Salmos) usados como «salmo»');
for (const r of res) if (r.uses.some(u => u.endsWith('/psalm')) && r.book !== 'Salmos') P(`  ${r.ref} [${r.ranges}] ret=${r.returned}/${r.expected} usos=${r.uses.join(', ')} :: ${r.sample}`);

// ── 5) Deuterocanónicos ──
P('\n### Deuterocanónicos');
for (const r of res) if (/Baruc|Sabidur|Eclesiást|Judit|Tobit|Macabeos/.test(r.book || '') && r.book !== 'Eclesiastés') P(`  ${r.ref} (${r.book}) [${r.ranges}] ret=${r.returned}/${r.expected} :: ${r.sample}`);

// ── 6) Estadística de longitud ──
const lens = res.filter(r => r.chars).map(r => r.chars).sort((a, b) => a - b);
P(`\n### Longitud (caracteres) de referencias: min=${lens[0]} mediana=${lens[Math.floor(lens.length / 2)]} máx=${lens[lens.length - 1]}`);
const longest = res.slice().sort((a, b) => b.chars - a.chars).slice(0, 6).map(r => `${r.ref}=${r.chars}`);
P('  más largas: ' + longest.join(', '));
const shortest = res.filter(r => r.book !== 'Salmos').sort((a, b) => a.chars - b.chars).slice(0, 8).map(r => `${r.ref}=${r.chars}`);
P('  más cortas (no salmos): ' + shortest.join(', '));

// ── 7) Referencias traducidas: ¿queda algún nombre inglés? ──
P('\n### translateBibleReference: nombres de libro sin traducir');
const stray = [];
for (const [ref] of usage) {
  const t = C.translateBibleReference(ref);
  if (/[A-Za-z]{4,}/.test(t.replace(/\b(Isaías|Jeremías|Génesis|Éxodo|Levítico|Números|Deuteronomio|Josué|Jueces|Rut|Samuel|Reyes|Crónicas|Esdras|Nehemías|Job|Salmo|Proverbios|Eclesiastés|Cantar|Sabiduría|Eclesiástico|Baruc|Lamentaciones|Ezequiel|Daniel|Oseas|Joel|Amós|Abdías|Jonás|Miqueas|Nahúm|Habacuc|Sofonías|Ageo|Zacarías|Malaquías|Mateo|Marcos|Lucas|Juan|Hechos|Romanos|Corintios|Gálatas|Efesios|Filipenses|Colosenses|Tesalonicenses|Timoteo|Tito|Filemón|Hebreos|Santiago|Pedro|Judas|Apocalipsis|de|los|Cantares)\b/g, ''))) stray.push(`${ref} -> ${t}`);
}
P('  ' + (stray.join(' | ') || 'ninguno'));
// y ¿el nombre traducido coincide con un libro de la BdJ vía BOOK_MAP?  (reutiliza parseRef)

// ── 8) Días del barrido afectados por cada referencia problemática ──
const R = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'sweep.json'), 'utf8'));
const badRefs = new Set(bad.map(b => b.ref));
const dayHit = {};
for (const r of R) if (r.refs) for (const role of ['first', 'psalm', 'second', 'gospel']) { const x = r.refs[role]; if (x && badRefs.has(x)) { (dayHit[x] = dayHit[x] || { n: 0, ex: r.d }).n++; } }
P('\n### Días del barrido 2024-2060 que muestran una referencia problemática: ' + Object.values(dayHit).reduce((a, b) => a + b.n, 0) + ' apariciones en ' + new Set(R.filter(r => r.refs && ['first', 'psalm', 'second', 'gospel'].some(role => badRefs.has(r.refs[role]))).map(r => r.d)).size + ' días distintos');
Object.entries(dayHit).sort((a, b) => b[1].n - a[1].n).slice(0, 40).forEach(([k, v]) => P(`   ${String(v.n).padStart(5)}  ${k}  (p.ej. ${v.ex})`));

fs.writeFileSync(path.join(__dirname, 'out', 'refs.txt'), out.join('\n'));
console.log('ok', out.length);
