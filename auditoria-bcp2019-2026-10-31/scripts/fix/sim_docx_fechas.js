// sim_docx.js — Ejecuta el exportador REAL (bcp2019/js/docx-export.js + docx.iife.js) sobre el HTML real de la
// liturgia y del Librito, con un DOM mínimo, y comprueba qué texto del HTML NO llega al .docx.
// Uso: node sim_docx.js [paso=7] [añoIni=2026] [añoFin=2028]
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const L = require('./sim_lib');
const { parse } = require('./minidom');
const JSZip = require('C:/Users/gonza/OneDrive/Desktop/liturgia/node_modules/jszip');

const STEP = +(process.argv[2] || 7), Y0 = +(process.argv[3] || 2026), Y1 = +(process.argv[4] || 2028);
const out = []; const P = (...a) => out.push(a.join(' '));
const C = L.load();

// Contexto del exportador
const dctx = { console, Date, Math, JSON, Object, Array, String, Number, RegExp, Map, Set, Promise, Blob, TextEncoder, TextDecoder, Uint8Array, ArrayBuffer, setTimeout, clearTimeout, atob, btoa, URL, Error, Symbol, Intl, parseInt, parseFloat, isNaN, Boolean };
dctx.window = dctx; dctx.self = dctx; dctx.globalThis = dctx;
dctx.navigator = {};
dctx.Node = { TEXT_NODE: 3, ELEMENT_NODE: 1 };
let lastBlob = null, lastName = null;
dctx.saveAs = (b, n) => { lastBlob = b; lastName = n; };
const registry = {};
dctx.alert = m => { registry.alert = m; };
dctx.document = {
  getElementById: id => registry[id] || null,
  querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ style: {}, click() {}, }), body: { appendChild() {}, removeChild() {} },
};
vm.createContext(dctx);
vm.runInContext(fs.readFileSync(L.LIB + 'docx.iife.js', 'utf8'), dctx, { filename: 'docx.iife.js' });
if (!dctx.docx) { console.error('docx no cargó en el contexto'); process.exit(1); }
let __src = fs.readFileSync(L.BCP + 'docx-export.js', 'utf8');
if (process.env.CONTROL) { // control negativo: se desactivan bloques EN MEMORIA (el repo no se toca)
  __src = __src.replace("cls.contains('psalm-verse')", 'false').replace("cls.contains('scripture-text')", 'false');
  console.log('CONTROL: psalm-verse y scripture-text desactivados en memoria');
}
vm.runInContext(__src + '\n;', dctx, { filename: 'docx-export.js' });
const Exp = vm.runInContext('BCPDocxExport', dctx);

const norm = s => String(s).toLowerCase().replace(/\s+/g, '').replace(/[^\p{L}\p{N}]/gu, '');
async function docxText(blob) {
  const buf = Buffer.from(await blob.arrayBuffer());
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file('word/document.xml').async('string');
  // texto: concatenar w:t por párrafo
  const paras = [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map(p => [...p[0].matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map(t => t[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")).join(''));
  return { paras, xml };
}

function atomsOf(root) { // textos de nodo de texto (>=4 caracteres alfanuméricos), con el ancestro de clase más cercano
  const res = [];
  const walk = (n, ctxCls) => {
    if (n.nodeType === 3) { const t = n.textContent.trim(); if (norm(t).length >= 4) res.push({ t, cls: ctxCls }); return; }
    const c = [...n._cls].join('.') || n.tagName.toLowerCase();
    for (const ch of n.childNodes) walk(ch, c);
  };
  walk(root, 'root');
  return res;
}

const stats = { dias: 0, mainAtoms: 0, mainMiss: 0, libAtoms: 0, libMiss: 0 };
const missByCls = {}; const examples = [];
const DATES = ['2027-03-26','2027-03-27','2027-03-25','2027-03-28','2026-11-01','2026-11-02','2027-02-10','2027-02-11','2028-12-29','2025-01-08','2026-05-15','2026-05-25','2026-06-01','2026-06-06','2034-01-01','2034-01-03','2026-10-31','2026-12-25'];
const days = DATES.map(s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d, 12); });
(async () => {
  for (const date of days) {
    const html = await C.generateLiturgy(date);
    const st = C.getState();
    const libHtml = C.BCPLibrito.generateLibrito(st);
    stats.dias++;
    for (const [kind, h, rootSel] of [['main', html, 'liturgy'], ['lib', libHtml, 'librito']]) {
      const root = parse(h);
      // registrar elementos para downloadDocx
      const out_ = new (require('./minidom').El)('div', { id: 'liturgy-output', class: '' });
      if (kind === 'main') {
        registry['liturgy-output'] = root; root.id = 'liturgy-output';
        registry['docx-btn'] = { disabled: false, textContent: '' };
      } else {
        const ov = new (require('./minidom').El)('div', { id: 'librito-overlay', class: 'librito-overlay' });
        ov.append(root.children[0]);
        registry['librito-overlay'] = ov;
        registry['librito-docx-btn'] = { disabled: false, textContent: '' };
      }
      lastBlob = null; registry.alert = null;
      try {
        if (kind === 'main') await Exp.downloadDocx(); else await Exp.downloadLibritoDocx();
      } catch (e) { P(`!! excepción exportando ${kind} ${L.iso(date)}: ${e.stack.split('\n').slice(0, 3).join(' | ')}`); continue; }
      if (!lastBlob) { P(`!! sin blob ${kind} ${L.iso(date)} alert=${registry.alert}`); continue; }
      const { paras } = await docxText(lastBlob);
      const dtxt = norm(paras.join(' '));
      const atoms = atomsOf(kind === 'main' ? registry['liturgy-output'] : registry['librito-overlay']);
      let miss = 0;
      for (const a of atoms) {
        if (!dtxt.includes(norm(a.t))) { miss++; const key = kind + ' · ' + a.cls; missByCls[key] = (missByCls[key] || 0) + 1; if (examples.length < 40 && !examples.some(e => e.cls === key)) examples.push({ cls: key, t: a.t.slice(0, 90), d: L.iso(date) }); }
      }
      stats[kind === 'main' ? 'mainAtoms' : 'libAtoms'] += atoms.length;
      stats[kind === 'main' ? 'mainMiss' : 'libMiss'] += miss;
    }
  }
  P(`Días exportados: ${stats.dias} (cada uno a Word principal + Librito)`);
  P(`Átomos de texto (nodos de texto >=4 alfanuméricos) liturgia principal: ${stats.mainAtoms}; AUSENTES del .docx: ${stats.mainMiss}`);
  P(`Átomos del Librito: ${stats.libAtoms}; AUSENTES del .docx: ${stats.libMiss}`);
  P('\nAusentes por clase del nodo padre:');
  Object.entries(missByCls).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => P(`  ${String(v).padStart(6)}  ${k}`));
  P('\nEjemplos:'); examples.forEach(e => P(`  [${e.cls}] ${e.d}: «${e.t}»`));
  fs.writeFileSync(path.join(__dirname, 'out', 'docx.txt'), out.join('\n'));
  console.log(out.join('\n').slice(0, 3000));
})();
