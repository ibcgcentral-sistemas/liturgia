// Extrae del BCP 2019 en inglés (convertido a Markdown con markitdown; NO está en el repositorio) la colecta de cada
// clave de bcp2019/js/propers.js («Collects of the Christian Year»). Lo usa check-colectas.js para comparar la traducción
// con el original, y sirve para revisar: node bcp2019-tools/extraer-colectas-en.js BCP2019-en.md [clave ...]
'use strict';
const fs = require('fs');

// clave de la app → título de la colecta en el libro en inglés (línea completa, en minúsculas)
const SUN = {
  advent1: 'the first sunday in advent', advent2: 'the second sunday in advent', advent3: 'the third sunday in advent', advent4: 'the fourth sunday in advent',
  christmas: 'christmas day', christmasSunday: 'the first sunday of christmas', christmasSunday2: 'the second sunday of christmas', epiphany: 'the epiphany',
  epiphany1: 'the first sunday of epiphany', epiphany2: 'the second sunday of epiphany', epiphany3: 'the third sunday of epiphany', epiphany4: 'the fourth sunday of epiphany',
  epiphany5: 'the fifth sunday of epiphany', epiphany6: 'the sixth sunday of epiphany', epiphany7: 'the seventh sunday of epiphany', epiphany8: 'the eighth sunday of epiphany',
  transfiguration: 'the last sunday of epiphany', ashWednesday: 'ash wednesday', lent1: 'the first sunday in lent', lent2: 'the second sunday in lent', lent3: 'the third sunday in lent',
  lent4: 'the fourth sunday in lent', lent5: 'the fifth sunday in lent', palmSunday: 'palm sunday', maundyThursday: 'maundy thursday', goodFriday: 'good friday', holySaturday: 'holy saturday',
  easter: 'easter day', easter2: 'the second sunday of easter', easter3: 'the third sunday of easter', easter4: 'the fourth sunday of easter', easter5: 'the fifth sunday of easter',
  easter6: 'the sixth sunday of easter', ascension: 'ascension day', easter7: 'the sunday after the ascension', pentecost: 'day of pentecost', trinitySunday: 'trinity sunday',
};
for (let n = 1; n <= 29; n++) SUN['proper' + n] = 'proper ' + n;
const MD = {
  '11-30': 'saint andrew', '12-21': 'saint thomas', '12-26': 'saint stephen', '12-27': 'saint john the evangelist', '12-28': 'the holy innocents', '01-01': 'the circumcision and holy name',
  '01-18': 'confession of saint peter', '01-25': 'conversion of saint paul', '02-02': 'the presentation of christ in the temple', '02-24': 'saint matthias', '03-19': 'saint joseph',
  '03-25': 'the annunciation', '04-25': 'saint mark', '05-01': 'saint philip and saint james', '05-31': 'the visitation', '06-11': 'saint barnabas', '06-24': 'the nativity of saint john the baptist',
  '06-29': 'saint peter and saint paul', '07-22': 'saint mary magdalene', '07-25': 'saint james', '08-06': 'the transfiguration', '08-15': 'saint mary the virgin', '08-24': 'saint bartholomew',
  '09-14': 'holy cross day', '09-21': 'saint matthew', '09-29': 'holy michael and all angels', '10-18': 'saint luke', '10-23': 'saint james of jerusalem', '10-28': 'saint simon and saint jude',
  '11-01': 'all saints’ day',
};
const isHeader = l => /^\d{3}\s+[a-z&| ]+$|^[a-z&| ]+\s+\d{3}$/.test(l);
const SUBTITLE = /^(Week of\s*the\s*Sunday\b.*$|Passion Sunday|Whitsunday|World Mission Sunday|Christ the King|Good Shepherd|Rogation|The Manifestation|The Baptism of Our Lord|Baptism of the Lord|Easter Eve|Christmas Eve|Palm Sunday|Transfiguration|Annunciation|of our lord jesus christ)(\s*$|\s+(?=[A-Z]))/;
const FECHA = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d+$/;

function extraer(ruta) {
  const lines = fs.readFileSync(ruta, 'utf8').replace(/\r/g, '').split('\n');
  const START = lines.findIndex((l, i) => /^c o l l e c t s of the/.test(l) && i > 16000);
  const END = lines.findIndex((l, i) => i > 17900 && /^(contents|1\. for the universal church)/i.test(l.trim()));
  if (START < 0 || END < 0) throw new Error('no encuentro la sección «Collects of the Christian Year» en ' + ruta);
  const grab = from => {
    const t = [];
    for (let i = from; i < END; i++) {
      const l = lines[i].trim();
      if (!l || isHeader(l) || SUBTITLE.test(l) || FECHA.test(l)) continue;
      if (/^Preface\b/.test(l)) break;
      t.push(t.length ? l : l.replace(/^(Transfiguration|Passion Sunday|World Mission Sunday|Christ the King|Good Shepherd|Rogation|Whitsunday)\s+/, '').replace(/^Week of\s*the\s*Sunday from [A-Za-z]+ \d+ to [A-Za-z]+ \d+\s+/, ''));
      if (/Amen\.$/.test(l) || t.length > 18) break;
    }
    return t.join(' ').replace(/\s+/g, ' ').replace(/(\w)- (\w)/g, '$1$2');
  };
  const find = (titulo, desde) => { for (let i = desde; i < END; i++) if (lines[i].trim().toLowerCase() === titulo) return i; return -1; };
  const out = {};
  for (const [k, h] of Object.entries(SUN)) { const i = find(h, START + 1); if (i >= 0) out[k] = { line: i + 1, english: grab(i + 1) }; }
  const HD = lines.findIndex((l, i) => i > START && l.trim().toLowerCase() === 'holy days');
  for (const [k, h] of Object.entries(MD)) { const i = find(h, k === '11-01' ? HD + 1 : HD); if (i >= 0) out[k] = { line: i + 1, english: grab(i + 1) }; }
  out.circumcision = out['01-01'];
  return out;
}

module.exports = { extraer };

if (require.main === module) {
  const o = extraer(process.argv[2]);
  const claves = process.argv.slice(3).length ? process.argv.slice(3) : Object.keys(o);
  for (const k of claves) console.log(`[${k}] ${o[k] ? o[k].english : '(sin colecta)'}`);
}
