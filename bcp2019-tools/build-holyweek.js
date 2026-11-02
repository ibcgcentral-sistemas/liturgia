// Genera bcp2019/js/holyweek-data.js con las liturgias de la Semana Santa, COPIADAS del libro oficial en español
// (LOC-10-10-23.md): Liturgia de las Palmas, Jueves Santo, Viernes Santo y Sábado Santo. El texto se corta por anclas
// del libro, no se reescribe: así no se transcribe nada a mano y test-bcp2019.js puede comprobar que el archivo
// generado sigue siendo idéntico a lo que da este script.
// Uso: node bcp2019-tools/build-holyweek.js [LOC-10-10-23.md]          (escribe el archivo)
//      node bcp2019-tools/build-holyweek.js --preview [secciones]      (lista cómo clasificó cada línea, para revisar)
// El libro no distingue en el Markdown las rúbricas del texto; se clasifican por su forma (ver `tipo`). Es heurística:
// por eso hay una vista previa y las excepciones van en OVERRIDES, por texto de la línea.
'use strict';
const fs = require('fs');
const path = require('path');

const LOC_POR_DEFECTO = 'C:/Users/gonza/OneDrive/Desktop/ESCRITORIO/Liturgia/LOC-10-10-23.md';

// Secciones: [ancla de inicio, ancla de fin (exclusiva; null = hasta una línea concreta), desde la línea N del libro]
// Cada ancla es el comienzo (trim) de una línea del libro.
const SECCIONES = {
  palmSundayPalms: { ini: 'LA LITURGIA DE LAS PALMAS', fin: 'EN LA EUCARISTÍA', desde: 14700 },
  maundyThursdayOpening: { ini: 'Esta liturgia se celebra por la tarde.', fin: 'LA ORACIÓN COLECTA', desde: 14800 },
  maundyThursdayFootWashing: { ini: 'LAVATORIO DE LOS PIES', fin: 'Cuando se desee administrar la Santa Comunión el Viernes Santo', desde: 14850 },
  maundyThursdayClosing: { ini: 'Cuando se desee administrar la Santa Comunión el Viernes Santo', fin: 'INDICACIONES ADICIONALES', desde: 14850 },
  goodFriday: { ini: 'En este día los ministros entran en silencio.', fin: 'LO CONCERNIENTE', desde: 14900, hastaIncluida: 'Los Ministros y el Pueblo se van en silencio.' },
  holySaturday: { ini: 'No hay celebración de la Eucaristía en este día.', fin: 'LO CONCERNIENTE A LA GRAN VIGILIA', desde: 15200 },
};
// Tramos que el app sustituye por las lecturas del día (las toma del leccionario): desde la línea que empieza así
// hasta la que empieza así (exclusiva). Se deja un marcador {t:'LECTURAS'}.
const LECTURAS = {
  goodFriday: { ini: 'LAS LECTURAS', fin: 'EL SERMÓN' },
  holySaturday: { ini: 'LAS LECTURAS', fin: 'Después del Evangelio, puede seguir una homilía.' },
};

const ROTULO = /^(Se (dice|canta|puede|pueden|utiliza|omiten|omite|guarda|lleva)|Luego |A continuación|Todos (de pie|se |pueden)|El (Celebrante|Oficiante|Diácono|Presbítero|Obispo) (puede|dice|reza|lee|entonces|concluye|invita|se pone|se levanta)|El servicio siempre|El rito de la Santa Eucaristía no|No hay celebración de la Eucaristía|El Obispo o Sacerdote|El Diácono (u otra|y el Pueblo)|El Oficiante (y el|dice|entonces)|Los Ministros|Los ministros|La Congregación|Cuando |Si |Durante |Después |Siguiendo |En (un lugar|la ausencia|ausencia|este día los)|Puede |Pueden |Estas |Esta liturgia|Las peticiones|Las oraciones iniciales|El himno de|El Evangelio de la Pasión|Año [ABC] |Frente al|Pueden seguir|Ahora se puede|Entonces se puede|La liturgia continúa|Silencio)/;
const ROTULO_EXACTO = /^(o esto|o bien,?|Silencio\.?)$/;
// «Pueblo mío», «Todos los que…» y «Todos nosotros…» son texto, no la etiqueta de quien habla.
const ETIQUETA = /^(Celebrante|Pueblo(?! mío| de Dios| santo)|Diácono|Lector|Oficiante|Todos(?! los| nosotros)|Obispo|Presbítero)\s+(.+)$/;
const TIPO_ETIQUETA = { Celebrante: 'CEL', Pueblo: 'PUEBLO', 'Diácono': 'DIAC', Lector: 'LECTOR', Oficiante: 'OFIC', Todos: 'TODOS', Obispo: 'OBISPO', 'Presbítero': 'PRES' };
const MAYUSCULAS = /^[A-ZÁÉÍÓÚÜÑ0-9 ,.:;()¿?¡!\-—“”"'/]+$/;
const REFERENCIA = /^\(?(Año [ABC] )?([1-3] )?[A-ZÁÉÍÓÚÑ]{3,}( [A-ZÁÉÍÓÚÑ]{2,})*[ —]*\(?\d/;
const FIN_FRASE = /[.:;?!”»)"]$/;
// Un párrafo de texto corrido (P) NO se corta al final de cada frase: sigue hasta «Amén.» o hasta que empiece otro
// párrafo reconocible por su primera palabra. Es el único sitio donde hace falta enumerar comienzos.
const INICIO_PARRAFO = /^(Oremos |Encomendémonos|Amado Pueblo|Oramos, por tanto|Esta es la noche|Por lo tanto|Vengan ahora|Compañeros siervos|Queridos hermanos|Nosotros te alabamos|Concédenos que los que|Dios todopoderoso, cuyo Hijo amadísimo)/;
// Excepciones por texto exacto de la línea: lo que la heurística clasifica mal.
const OVERRIDES = {
  'Oremos:': 'P', 'Oremos.': 'P', 'Oremos': 'P',
  // Segunda línea de una respuesta del pueblo y «Amén.» suelto: continúan el item anterior.
  'Hosanna en las alturas.': 'CONT', 'Hosanna en el cielo.': 'CONT', 'Amén.': 'CONT', 'Amén': 'CONT', 'Patri.': 'CONT', 'Cruz.': 'CONT',
  // «Pueblo mío» y «Todos nosotros» son texto, no la etiqueta de quien habla.
  'Pueblo mío, ¿qué te he hecho?': 'P', 'Oh mi iglesia, ¿qué te he hecho?': 'P',
};
// Tramos en verso: líneas cortas que se conservan una por línea. Cada tramo va de la línea que empieza con `ini` hasta
// la anterior a la que empieza con `fin`, y se parte en estrofas donde una línea termina con `corta`.
const VERSOS = {
  goodFriday: [
    { ini: 'Todos nosotros nos descarriamos', fin: 'Pueblo Pero el Señor hizo', corta: /^$/ },
    { ini: 'Pueblo mío, ¿qué te he hecho?', fin: 'HIMNO 1', corta: /Ten piedad de nosotros\.$/ },
    { ini: 'Nos gloriamos en tu Cruz', fin: 'HIMNO 2', corta: /alegría ha venido a todo el mundo\.$|que todos los pueblos te alaben\.$/ },
    { ini: 'Te adoramos, oh Cristo', fin: 'Entonces se puede cantar el himno', corta: /redimiste al mundo\.$|reinaremos\.$/ },
    { ini: 'Dios todopoderoso, Padre de nuestro Señor Jesucristo,', fin: 'El Obispo o Sacerdote se pone de pie y dice', corta: /por nuestro Señor Jesucristo\. Amén\.$/ },
    { ini: 'Padre Nuestro que estás en el cielo,', fin: 'Frente al Pueblo, el Oficiante puede hacer', corta: /ahora y por siempre\. Amén\.$/ },
  ],
  holySaturday: [
    { ini: 'El hombre nacido de mujer', fin: 'El Oficiante y el Pueblo rezan juntos', corta: /nunca sigue igual\.$|muerte eterna\.$|nos apartemos de ti\.$/ },
    { ini: 'Padre Nuestro que estás en el cielo,', fin: 'El Oficiante concluye', corta: /ahora y por siempre\. Amén\.$/ },
  ],
};

function tipoLinea(l) {
  if (OVERRIDES[l]) return OVERRIDES[l];
  if (ROTULO_EXACTO.test(l)) return 'R';
  if (REFERENCIA.test(l) && !/[a-záéíóú]{3,} [a-záéíóú]{3,} [a-záéíóú]{3,}/.test(l.replace(/\(.*?\)/g, ''))) return 'REF';
  if (MAYUSCULAS.test(l) && /[A-ZÁÉÍÓÚÑ]{4,}/.test(l)) return 'T';
  if (ROTULO.test(l)) return 'R';
  if (ETIQUETA.test(l)) return TIPO_ETIQUETA[ETIQUETA.exec(l)[1]];
  return 'P';
}

function analizar(lineas) {
  const items = [];
  let cur = null;
  const cierra = () => { if (cur) { items.push(cur); cur = null; } };
  for (const bruta of lineas) {
    const l = bruta.trim();
    if (!l || /^\d{3}$/.test(l)) continue;
    if (l === '[[LECTURAS]]') { cierra(); items.push({ t: 'LECTURAS' }); continue; }
    const t = tipoLinea(l);
    if (t === 'CONT' && cur) { cur.lineas.push(l); continue; }
    // ¿Continúa la frase anterior? Solo si hay un item abierto de texto, esta línea no es título, referencia ni rúbrica
    // nueva, y (a) empieza en minúscula —sigue una frase cortada por el ancho de la página— o (b) el item anterior no
    // cerró su frase y la línea es texto corrido (P). Una rúbrica sin punto final seguida de mayúscula NO continúa.
    const empiezaMin = /^[a-záéíóúñ(«“¿]/.test(l);
    const ultima = cur ? cur.lineas[cur.lineas.length - 1] : '';
    const abierto = cur && ['R', 'P', 'CEL', 'PUEBLO', 'DIAC', 'LECTOR', 'OFIC', 'TODOS', 'OBISPO', 'PRES'].includes(cur.t) && !cur.exacto;
    const sigue = abierto && !['T', 'REF'].includes(t) && (
      (empiezaMin && (t === 'P' || t === 'R') && !ROTULO_EXACTO.test(l)) ||                             // frase cortada por el ancho de la página
      (t === 'P' && cur.t === 'P' && !/Amén\.?$/.test(ultima) && !INICIO_PARRAFO.test(l)) ||           // texto corrido
      (t === 'P' && cur.t !== 'P' && cur.t !== 'R' && !FIN_FRASE.test(ultima)));                       // voz que no cerró su frase
    if (sigue) { cur.lineas.push(l); continue; }
    const mv = /^\[\[V:(.*)\]\]$/s.exec(l);
    if (mv) { cierra(); items.push({ t: 'V', x: mv[1] }); continue; }
    cierra();
    const m = ETIQUETA.exec(l);
    cur = { t, lineas: [m && TIPO_ETIQUETA[m[1]] === t ? m[2] : l], exacto: ROTULO_EXACTO.test(l) || /^Oremos[:.]?$/.test(l) };
  }
  cierra();
  return items.map(it => {
    if (it.t === 'LECTURAS' || it.x !== undefined) return it;
    const ls = it.lineas;
    const corto = ls.length >= 3 && ls.every(x => x.length < 66);
    return { t: corto && it.t === 'P' ? 'V' : it.t, x: (corto && it.t === 'P' ? ls.join('\n') : ls.join(' ')).replace(/\s+/g, m => (m.includes('\n') ? m : ' ')) };
  });
}

function recorte(lineas, def, desde) {
  const i0 = lineas.findIndex((l, n) => n >= desde && l.trim().startsWith(def.ini));
  if (i0 < 0) throw new Error('no encuentro el comienzo «' + def.ini + '» en el libro (¿se volvió a convertir?)');
  let i1 = lineas.findIndex((l, n) => n > i0 && l.trim().startsWith(def.fin));
  if (i1 < 0) throw new Error('no encuentro el fin «' + def.fin + '» en el libro');
  if (def.hastaIncluida) { const j = lineas.findIndex((l, n) => n > i0 && l.trim().startsWith(def.hastaIncluida)); if (j < 0) throw new Error('no encuentro «' + def.hastaIncluida + '»'); i1 = j + 1; }
  return { desde: i0, hasta: i1, lineas: lineas.slice(i0, i1) };
}

// Sustituye un tramo en verso por marcadores «[[V:línea\nlínea…]]», uno por estrofa. Las líneas sueltas del número de página
// del libro se descartan.
function envuelveVersos(ls, v, nombre) {
  const a = ls.findIndex(l => l.trim().startsWith(v.ini));
  if (a < 0) throw new Error(`${nombre}: no encuentro el tramo en verso que empieza «${v.ini}»`);
  const b = ls.findIndex((l, n) => n > a && l.trim().startsWith(v.fin));
  if (b < 0) throw new Error(`${nombre}: no encuentro el fin «${v.fin}» del tramo «${v.ini}»`);
  const estrofas = []; let cur = [];
  for (const raw of ls.slice(a, b)) {
    const l = raw.trim();
    if (!l || /^\d{3}$/.test(l)) continue;
    cur.push(l);
    if (v.corta.test(l)) { estrofas.push(cur); cur = []; }
  }
  if (cur.length) estrofas.push(cur);
  return ls.slice(0, a).concat(estrofas.map(e => '[[V:' + e.join('\n') + ']]'), ls.slice(b));
}

function construir(locPath) {
  const lineas = fs.readFileSync(locPath, 'utf8').split(/\r?\n/);
  const out = {}, origen = {};
  for (const [nombre, def] of Object.entries(SECCIONES)) {
    const r = recorte(lineas, def, def.desde);
    let ls = r.lineas.slice();
    if (LECTURAS[nombre]) {
      const a = ls.findIndex(l => l.trim().startsWith(LECTURAS[nombre].ini)), b = ls.findIndex((l, n) => n > a && l.trim().startsWith(LECTURAS[nombre].fin));
      if (a < 0 || b < 0) throw new Error('no encuentro el tramo de lecturas de ' + nombre);
      ls = ls.slice(0, a).concat(['[[LECTURAS]]'], ls.slice(b));
    }
    for (const v of VERSOS[nombre] || []) ls = envuelveVersos(ls, v, nombre);
    out[nombre] = analizar(ls);
    origen[nombre] = `LOC l. ${r.desde + 1}-${r.hasta}`;
  }
  return { out, origen };
}

function archivo({ out, origen }) {
  return `/**
 * holyweek-data.js — Liturgias de la Semana Santa (Libro de Oración Común 2019, ACNA).
 * GENERADO por bcp2019-tools/build-holyweek.js a partir del libro oficial en español (LOC-10-10-23.md); NO editar a
 * mano: test-bcp2019.js comprueba que sigue idéntico a lo que genera el script. Texto copiado, no traducido.
 * Procedencia: ${Object.entries(origen).map(([k, v]) => k + ' ' + v).join('; ')}.
 * Tipos: T título, R rúbrica, P párrafo, V versos (líneas separadas por \\n), REF cita bíblica, CEL/PUEBLO/DIAC/LECTOR/
 * OFIC/TODOS/OBISPO/PRES voces, LECTURAS = lugar donde el app inserta las lecturas del día.
 */
const BCP_HOLYWEEK_DATA = ${JSON.stringify(out, null, 1)};
`;
}

module.exports = { construir, archivo, LOC_POR_DEFECTO };

if (require.main === module) {
  const args = process.argv.slice(2);
  const preview = args.includes('--preview');
  const loc = args.find(a => /\.md$/.test(a)) || LOC_POR_DEFECTO;
  const r = construir(loc);
  if (preview) {
    const quiere = args.filter(a => !a.startsWith('--') && !/\.md$/.test(a));
    for (const [n, items] of Object.entries(r.out)) {
      if (quiere.length && !quiere.includes(n)) continue;
      console.log(`\n=== ${n} (${r.origen[n]}) — ${items.length} items`);
      for (const it of items) console.log(String(it.t).padEnd(6), (it.x || '').replace(/\n/g, ' ⏎ ').slice(0, 118));
    }
  } else {
    fs.writeFileSync(path.join(__dirname, '..', 'bcp2019', 'js', 'holyweek-data.js'), archivo(r));
    console.log('escrito bcp2019/js/holyweek-data.js:', Object.entries(r.out).map(([k, v]) => `${k} ${v.length}`).join(', '));
  }
}
