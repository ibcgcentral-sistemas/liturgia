// sim_librito.js — Compara el Librito (BCPLibrito.generateLibrito(state)) con la liturgia principal (buildLiturgyHTML)
// en TODOS los días 2024-2060, y los bloques de texto fijo del Librito contra el Ordinario (BCPEucharist).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./sim_lib');
const C = L.load();
const out = []; const P = (...a) => out.push(a.join(' '));
const strip = h => String(h).replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const nospace = s => strip(s).replace(/\s+/g, '');
const norm = s => strip(s).toLowerCase().replace(/[“”«»"']/g, '').replace(/\s+/g, ' ');

// ───── 1) Qué campos de currentMassState consume el Librito / cuáles guarda app.js ─────
const libSrc = fs.readFileSync(L.BCP + 'librito-pueblo.js', 'utf8');
const appSrc = fs.readFileSync(L.BCP + 'app.js', 'utf8');
const destr = libSrc.match(/const \{([^}]+)\} = state;/);
const consumed = destr ? destr[1].split(',').map(s => s.trim()) : [];
const savedM = appSrc.match(/currentMassState = \{([\s\S]*?)\};/);
const saved = savedM ? savedM[1].split(',').map(s => s.trim()).filter(Boolean) : [];
P('## 1) Campos');
P('  app.js guarda: ' + saved.join(', '));
P('  librito-pueblo.js consume (desestructuración): ' + consumed.join(', '));
P('  consumidos que app.js NO guarda: ' + (consumed.filter(x => !saved.includes(x)).join(', ') || 'ninguno'));
P('  guardados que el Librito NO consume: ' + (saved.filter(x => !consumed.includes(x)).join(', ') || 'ninguno'));
// usos realmente referenciados en el cuerpo del Librito
const body = libSrc.slice(libSrc.indexOf('function generateLibrito'));
const usage = {}; for (const f of saved) usage[f] = (body.match(new RegExp('\\b' + f + '\\b', 'g')) || []).length;
P('  apariciones de cada campo en generateLibrito (>1 = realmente usado): ' + JSON.stringify(usage));
// En el estado real: ¿hay propiedades en currentMassState distintas a las declaradas?
// (se comprueba con el estado vivo más abajo)

// ───── 2) Comparación día a día ─────
const issues = {};
const add = (k, d, extra) => { (issues[k] = issues[k] || []).push(d + (extra ? ' ' + extra : '')); };
const getAll = (re, s) => [...s.matchAll(re)].map(m => m[1]);
let n = 0, stateKeysCheck = null;
(async () => {
  for (const date of L.eachDay(2024, 2060)) {
    n++;
    const d = L.iso(date);
    let html;
    try { html = await C.generateLiturgy(date); } catch (e) { add('exc generate', d, e.message); continue; }
    const st = C.getState();
    if (!stateKeysCheck) stateKeysCheck = Object.keys(st);
    let lib;
    try { lib = C.BCPLibrito.generateLibrito(st); } catch (e) { add('exc librito', d, e.message); continue; }
    // colecta
    const mCol = (html.match(/<div class="prayer-text collect-text">([\s\S]*?)<\/div>/) || [])[1];
    const lCol = (lib.match(/LA COLECTA DEL DÍA<\/h2>[\s\S]*?<div class="librito-text"><p>([\s\S]*?)<\/p>/) || [])[1];
    if (norm(mCol || '') !== norm(lCol || '')) add('colecta distinta', d);
    if (!lCol || !lCol.trim()) add('colecta vacía en Librito', d);
    // lecturas
    const mTexts = getAll(/<div class="scripture-text">([\s\S]*?)<\/div>/g, html);
    const lTexts = getAll(/<p class="reading-text">([\s\S]*?)<\/p>/g, lib);
    if (mTexts.length !== lTexts.length) add('nº de lecturas distinto', d, `main=${mTexts.length} librito=${lTexts.length}`);
    else for (let i = 0; i < mTexts.length; i++) if (norm(mTexts[i]) !== norm(lTexts[i])) add('texto de lectura distinto', d, `#${i}`);
    // referencias (cabeceras)
    const mRefs = getAll(/Lectura de <em>([^<]*)<\/em>/g, html);
    const lRefs = getAll(/<p class="reading-ref-small">([^<]*)<\/p>/g, lib).filter(x => !/^Según/.test(x) && !/^(Salmo|Isaías|Lucas|1 Samuel|Isaiah|Luke)\b.*/.test('') );
    // el Librito emite reading-ref-small para lecturas y evangelio ("Según X" en evangelio); comparar sólo las de lecturas
    const lRefsReadings = getAll(/<p class="reading-ref">(PRIMERA LECTURA|SEGUNDA LECTURA)<\/p>\s*<p class="reading-ref-small">([^<]*)<\/p>/g, lib);
    // salmo
    const mPs = getAll(/<div class="reading psalm-reading">([\s\S]*?)<\/div>\s*<\/div>/g, html)[0];
    const lPs = (lib.match(/<div class="librito-psalm">([\s\S]*?)<\/div>\s*(?=<div class="librito-reading">|<div class="librito-instruction">)/) || [])[1];
    if (!!mPs !== !!lPs) add('salmo presente en uno solo', d, `main=${!!mPs} librito=${!!lPs}`);
    else if (mPs) {
      const mV = [...mPs.matchAll(/<span class="lit-line lector">[\s\S]*?<span class="lit-text">([\s\S]*?)<\/span><\/span>/g)].map(m => nospace(m[1])).join('');
      const lV = [...lPs.matchAll(/<div class="psalm-verse"><p>([\s\S]*?)<\/p><\/div>/g)].map(m => nospace(m[1])).join('');
      if (mV !== lV) add('versículos del salmo distintos', d, `len ${mV.length} vs ${lV.length}`);
      const mAnt = (mPs.match(/<span class="lit-line pueblo"><span class="lit-label">Pueblo<\/span><span class="lit-text"><strong>([\s\S]*?)<\/strong>/) || [])[1];
      const lAnt = (lPs.match(/<p class="psalm-response">([\s\S]*?)<\/p>/) || [])[1];
      if (norm(mAnt || '') !== norm(lAnt || '')) add('antífona del salmo distinta', d);
    }
    // prefacio
    const mPref = (html.match(/✠ PREFACIO: ([^<]*)<\/h3>/) || [])[1];
    const lPref = (lib.match(/✠ PREFACIO: ([^<]*)<\/h2>/) || [])[1];
    if ((mPref || '').trim() !== (lPref || '').trim()) add('título de prefacio distinto', d, `${mPref} / ${lPref}`);
    // gloria
    const mG = /Gloria a Dios en el cielo/.test(html), lG = /Gloria a Dios en el cielo/.test(lib);
    if (mG !== lG) add('Gloria sí/no distinto', d, `main=${mG} librito=${lG}`);
    // aclamación
    const accOf = h => /Bendigamos al Señor que perdona/.test(h) ? 'lent' : /Cristo ha resucitado/.test(h) ? 'easter' : /Bendito sea Dios: Padre, Hijo/.test(h) ? 'std' : '??';
    if (accOf(html) !== accOf(lib)) add('aclamación distinta', d, `${accOf(html)} / ${accOf(lib)}`);
    // fracción
    const frOf = h => /\[Aleluya\.\] Cristo, nuestra Pascua/.test(h) ? 'std' : 'lent';
    if (frOf(html) !== frOf(lib)) add('fracción distinta', d);
    // despedida
    const disOf = h => /Salgamos en el Nombre de Cristo,? ?\.? ?[Aa]leluya|Nombre de Cristo\. Aleluya/.test(h) ? 'alleluia' : 'std';
    if (disOf(html) !== disOf(lib)) add('despedida distinta (Aleluya)', d);
    // prestadas
    const mB = /no tiene lecturas propias asignadas/.test(html), lB = /se repiten las lecturas del Domingo o fiesta precedente/.test(lib);
    if (mB !== lB) add('rúbrica de lecturas prestadas distinta', d);
    // cabecera: fecha, fiesta, color, ciclo
    const mFeast = (html.match(/<h2 class="feast-name-en">([^<]*)<\/h2>/) || [])[1];
    const lFeast = (lib.match(/<p class="librito-feast">([^<]*)<\/p>/) || [])[1];
    if (mFeast !== lFeast) add('nombre de fiesta distinto', d);
    const mCyc = (html.match(/Ciclo dominical: <strong>(\w)<\/strong>/) || [])[1];
    const lCyc = (lib.match(/Ciclo: <strong>(\w)<\/strong>/) || [])[1];
    if (mCyc !== lCyc) add('ciclo distinto', d);
    // marcas de fallo en Librito
    for (const [k, re] of Object.entries({ undefinedW: /\bundefined\b/, nullW: /\bnull\b/, NaN: /\bNaN\b/, obj: /\[object/, noDisp: /no disponible/, err: /\[Error/, noEsp: /no especificad/ })) if (re.test(lib)) add('marca de fallo en Librito: ' + k, d);
    // secciones vacías: lecturas ausentes en el Librito mientras readings existe
    const lHasFirst = /PRIMERA LECTURA/.test(lib), lHasGos = /SANTO EVANGELIO/.test(lib);
    if (st.readings && (!lHasFirst || !lHasGos)) add('Librito sin primera lectura o evangelio', d);
    // el estado contiene alguna propiedad no declarada en la desestructuración
    for (const k of Object.keys(st)) if (!consumed.includes(k)) add('campo de estado NO consumido por Librito: ' + k, d);
  }
  P(`\n## 2) Comparación Librito vs liturgia: ${n} días`);
  const keys = Object.keys(issues);
  if (!keys.length) P('  SIN divergencias');
  for (const k of keys) P(`  ${String(issues[k].length).padStart(6)}  ${k}   p.ej. ${issues[k].slice(0, 4).join(' | ')}`);

  // ───── 3) Bloques fijos del Librito contra el Ordinario (días-tipo) ─────
  P('\n## 3) Bloques de texto fijo del Librito frente al Ordinario de la liturgia principal');
  const samples = { std: L.D(2026, 7, 5), lent: L.D(2026, 3, 8), easter: L.D(2026, 4, 12), advent: L.D(2026, 12, 6) };
  for (const [nm, dt] of Object.entries(samples)) {
    const html = await C.generateLiturgy(dt);
    const st = C.getState();
    const lib = C.BCPLibrito.generateLibrito(st);
    // textos del main
    const mainTexts = [...html.matchAll(/<span class="lit-text">([\s\S]*?)<\/span><\/span>/g)].map(m => norm(m[1]));
    const mainPrayer = [...html.matchAll(/<span class="lit-prayer">([\s\S]*?)<\/span>/g)].map(m => norm(m[1]));
    const mainCons = [...html.matchAll(/<span class="lit-consecracion">([\s\S]*?)<\/span>/g)].map(m => norm(m[1]));
    const mainAll = mainTexts.concat(mainPrayer, mainCons);
    const bigMain = mainAll.join(' ¦ ');
    // bloques del Librito: <p> dentro de librito-text / librito-response / librito-credo / credo-incline
    const libBlocks = [];
    for (const m of lib.matchAll(/<div class="(librito-text|librito-response|librito-credo)">([\s\S]*?)<\/div>\s*(?=<(?:div|section|h2|h3)|$)/g)) {
      for (const p of m[2].matchAll(/<p>([\s\S]*?)<\/p>/g)) libBlocks.push(p[1]);
    }
    const miss = [];
    for (const b of libBlocks) {
      for (const seg of b.split(/<br\s*\/?>/)) {
        let t = norm(seg).replace(/^(celebrante|pueblo|lector|sacerdote): /, '');
        if (t.length < 12) continue;
        if (!bigMain.includes(t)) miss.push(t.slice(0, 100));
      }
    }
    P(`  [${nm} ${L.iso(dt)}] bloques del Librito analizados=${libBlocks.length}; segmentos (≥12 chars) NO hallados en la liturgia principal: ${miss.length}`);
    miss.slice(0, 12).forEach(x => P('       · «' + x + '»'));
    // credo: concatenación
    const credoParts = [...lib.matchAll(/<div class="librito-credo">([\s\S]*)<\/div>\s*<\/section>/g)];
    const lCredo = credoParts.length ? norm(credoParts[0][1].replace(/✠[^<]*/g, '')) : '';
    const mCredo = mainAll.find(x => x.startsWith('creemos en un solo dios')) || '';
    const cmp = (a, b) => { const A = a.replace(/[^a-záéíóúñ]/g, ''), B_ = b.replace(/[^a-záéíóúñ]/g, ''); return A === B_ ? 'IGUAL' : `DIFIERE (len ${A.length} vs ${B_.length})`; };
    P(`       credo (Librito sin marcas de inclinación) vs credo principal: ${cmp(lCredo.replace('inclinación', ''), mCredo)}`);
  }

  // despedida Aleluya: texto exacto
  P('\n## 4) Despedida con Aleluya: texto exacto (Pascua)');
  const hE = await C.generateLiturgy(L.D(2026, 4, 12)); const stE = C.getState(); const lE = C.BCPLibrito.generateLibrito(stE);
  P('  principal: ' + strip((hE.match(/Salgamos en el Nombre[\s\S]*?<\/span><\/span>[\s\S]*?<\/span><\/span>/) || [''])[0]));
  P('  Librito:   ' + strip((lE.match(/Salgamos en el Nombre[\s\S]*?<\/p>/) || [''])[0]));
  // 5) Fiesta fija en Cuaresma: aclamación vs Gloria
  fs.writeFileSync(path.join(__dirname, 'out', 'librito.txt'), out.join('\n'));
  console.log('ok');
})();
