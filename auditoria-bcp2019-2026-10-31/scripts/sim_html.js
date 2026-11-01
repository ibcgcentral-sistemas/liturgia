// sim_html.js — Buena formación del HTML (main y Librito) en los 13.515 días + Aleluya en Cuaresma + colectas casi duplicadas.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./sim_lib');
const C = L.load();
const out = []; const P = (...a) => out.push(a.join(' '));
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);
function check(html) {
  const errs = []; const stack = [];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)((?:\s+[^>]*?)?)\s*(\/?)>/g; let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) { const t = m[1].toLowerCase(); const top = stack.pop(); if (top !== t) { errs.push(`cierre </${t}> pero abierto <${top}>`); if (errs.length > 3) break; } }
    else { const t = m[2].toLowerCase(); if (!VOID.has(t) && !m[4]) { if (t === 'p' || t === 'span') { /* p no puede contener div/h */ } stack.push(t); } }
  }
  if (stack.length) errs.push('sin cerrar: ' + stack.join(','));
  // p que contiene bloque
  if (/<p[^>]*>(?:(?!<\/p>)[\s\S])*?<(div|h[1-6]|p)\b/.test(html)) errs.push('<p> contiene bloque (div/h/p)');
  return errs;
}
const issues = {}; const add = (k, d, x) => { (issues[k] = issues[k] || []).push(d + (x ? ' ' + x : '')); };
const stripRub = h => h.replace(/<span class="lit-rubric">[\s\S]*?<\/span>/g, '').replace(/<em class="rubric">[\s\S]*?<\/em>/g, '').replace(/<p class="rubric">[\s\S]*?<\/p>/g, '').replace(/<div class="librito-instruction[^"]*">[\s\S]*?<\/div>/g, '');
(async () => {
  let n = 0;
  for (const date of L.eachDay(2024, 2060)) {
    n++; const d = L.iso(date);
    const html = await C.generateLiturgy(date); const st = C.getState(); const lib = C.BCPLibrito.generateLibrito(st);
    for (const [k, h] of [['main', html], ['librito', lib]]) { const e = check(h); if (e.length) add('HTML mal formado ' + k, d, e[0]); }
    const season = st.dayInfo.season;
    const body = stripRub(html);
    const ale = (body.match(/leluya/gi) || []).length;
    if ((season === 'lent' || season === 'holyWeek')) {
      // quitar texto de la Escritura para separar el Aleluya de los textos litúrgicos
      const noScr = body.replace(/<div class="scripture-text">[\s\S]*?<\/div>/g, '').replace(/<div class="reading psalm-reading">[\s\S]*?<\/div>\s*<\/div>/g, '');
      if (/leluya/i.test(noScr)) add('Aleluya en texto litúrgico en Cuaresma/Semana Santa', d, st.dayInfo.key);
      const scr = (body.match(/<div class="scripture-text">[\s\S]*?<\/div>/g) || []).join('') + (body.match(/<div class="reading psalm-reading">[\s\S]*?<\/div>\s*<\/div>/g) || []).join('');
      if (/leluya/i.test(scr)) add('«Aleluya» dentro del texto bíblico/salmo leído en Cuaresma', d, st.dayInfo.key + ' ' + st.readings.psalm);
    }
    if (season === 'easter') { if (!/leluya/i.test(body)) add('Pascua sin ningún Aleluya fuera de rúbricas', d, st.dayInfo.key); }
    // «Colecta» prestada anunciada?
    if (!C.BCPPropers.COLLECTS[st.dayInfo.key]) { if (/colecta/i.test(stripHtmlBetween(html, 'LA COLECTA DEL DÍA', 'LITURGIA DE LA PALABRA').replace(/<div class="prayer-text[\s\S]*?<\/div>/, '').replace(/COLECTA/g, ''))) add('colecta prestada ANUNCIADA', d); else add('colecta prestada NO anunciada en el HTML', d); }
  }
  function stripHtmlBetween(h, a, b) { const i = h.indexOf(a), j = h.indexOf(b, i); return h.slice(i, j); }
  P(`## HTML y reglas de Aleluya: ${n} días`);
  for (const [k, v] of Object.entries(issues)) P(`  ${String(v.length).padStart(6)}  ${k}   p.ej. ${v.slice(0, 5).join(' | ')}`);
  if (!Object.keys(issues).length) P('  sin hallazgos');

  // colectas casi duplicadas (umbral 0.55)
  P('\n## Colectas con alta similitud léxica (Jaccard de palabras >= 0.55)');
  const COL = C.BCPPropers.COLLECTS; const keys = Object.keys(COL);
  const nrm = s => s.toLowerCase().replace(/[^a-záéíóúñ ]/g, '').replace(/\s+/g, ' ').split(' ').filter(w => w.length > 3);
  const pairs = [];
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    const a = new Set(nrm(COL[keys[i]])), b = new Set(nrm(COL[keys[j]])); let inter = 0; for (const w of a) if (b.has(w)) inter++;
    const jac = inter / (a.size + b.size - inter); if (jac >= 0.55) pairs.push([jac, keys[i], keys[j]]);
  }
  pairs.sort((x, y) => y[0] - x[0]).forEach(([j, a, b]) => P(`  ${j.toFixed(2)}  ${a} ~ ${b}`));
  fs.writeFileSync(path.join(__dirname, 'out', 'html.txt'), out.join('\n'));
  console.log('ok');
})();
