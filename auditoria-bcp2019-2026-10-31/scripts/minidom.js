// minidom.js — DOM mínimo (sólo lo que usa bcp2019/js/docx-export.js) para ejecutar el exportador real sin navegador.
'use strict';
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);
const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

class TextNode {
  constructor(t) { this.nodeType = 3; this._t = t; this.parentNode = null; }
  get textContent() { return this._t; }
}
class El {
  constructor(tag, attrs) {
    this.nodeType = 1; this.tagName = tag.toUpperCase(); this.attrs = attrs || {}; this.childNodes = []; this.parentNode = null;
    const cls = (this.attrs.class || '').split(/\s+/).filter(Boolean);
    this._cls = new Set(cls);
    this.classList = { contains: c => this._cls.has(c), add: c => this._cls.add(c), remove: c => this._cls.delete(c) };
    this.id = this.attrs.id || '';
    this.className = cls.join(' ');
    this.style = {};
  }
  get children() { return this.childNodes.filter(n => n.nodeType === 1); }
  get textContent() { return this.childNodes.map(c => c.textContent).join(''); }
  get innerText() {
    const f = n => n.nodeType === 3 ? n._t : (n.tagName === 'BR' ? '\n' : n.childNodes.map(f).join(''));
    return f(this);
  }
  append(c) { c.parentNode = this; this.childNodes.push(c); }
  _all(out) { for (const c of this.childNodes) if (c.nodeType === 1) { out.push(c); c._all(out); } return out; }
  _matchSimple(sel) { // .a.b | tag | tag.cls
    const m = sel.match(/^([a-zA-Z0-9]+)?((?:\.[\w-]+)*)$/);
    if (!m) throw new Error('selector no soportado: ' + sel);
    if (m[1] && this.tagName !== m[1].toUpperCase()) return false;
    const cls = (m[2] || '').split('.').filter(Boolean);
    return cls.every(c => this._cls.has(c));
  }
  _matches(sel) { // lista con comas, con descendientes
    return sel.split(',').map(s => s.trim()).some(part => {
      const toks = part.split(/\s+/);
      let node = this;
      if (!node._matchSimple(toks[toks.length - 1])) return false;
      let i = toks.length - 2; let p = node.parentNode;
      while (i >= 0 && p && p.nodeType === 1) { if (p._matchSimple(toks[i])) i--; p = p.parentNode; }
      return i < 0;
    });
  }
  querySelectorAll(sel) { return this._all([]).filter(e => e._matches(sel)); }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  getAttribute(a) { return this.attrs[a]; }
  setAttribute() {} addEventListener() {} appendChild() {} remove() {} scrollIntoView() {}
}

function parse(html) {
  const root = new El('div', {});
  let cur = root;
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)((?:\s+[a-zA-Z_:][-\w:.]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+)|</g;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    if (m[1]) { // cierre
      let n = cur; const t = m[1].toLowerCase();
      while (n && n !== root && n.tagName.toLowerCase() !== t) n = n.parentNode;
      if (n && n !== root) cur = n.parentNode;
    } else if (m[2]) {
      const attrs = {};
      for (const a of (m[3] || '').matchAll(/([a-zA-Z_:][-\w:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1]] = a[2] ?? a[3] ?? a[4] ?? '';
      const el = new El(m[2], attrs);
      cur.append(el);
      if (!VOID.has(m[2].toLowerCase()) && !m[4]) cur = el;
    } else if (m[5] !== undefined) {
      cur.append(new TextNode(decode(m[5])));
    } else { cur.append(new TextNode('<')); }
  }
  return root;
}
module.exports = { parse, El, TextNode };
