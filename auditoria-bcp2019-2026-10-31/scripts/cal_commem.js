// Auditoría calendario — estimación del nº de conmemoraciones opcionales del libro (calendario pp. 691-712, líneas 19419-20435). SOLO LECTURA.
const fs = require('fs');
const lines = fs.readFileSync('C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md', 'utf8').split(/\r?\n/);
let withYear = 0; const ex = [];
const reYear = /(\b(c\.|ca\.)\s*\d{3,4}|\b\d{3,4}(, \d{3,4})?|\b\d(st|nd|rd|th) c\.)\s*(\|.*)?$/;
for (let i = 19419 - 1; i <= 20435 - 1; i++) {
  const t = lines[i].replace(/^\|\s*\d+\s*\|\s*/, '').replace(/\|/g, ' ').trim();
  if (!t) continue;
  if (/^(january|february|march|april|may|june|july|august|september|october|november|december|optional|red-letter|day|holy days|anglican|ecumenical|commemorations)/i.test(t)) continue;
  if (/calendars & lectionaries|holy days and commemorations \d+/.test(t)) continue;
  if (reYear.test(t) && /[A-Za-z]/.test(t)) { withYear++; if (ex.length < 3) ex.push(`${i + 1}: ${t}`); }
}
console.log('Líneas que cierran una conmemoración con año/siglo (aprox.):', withYear);
console.log(ex.join('\n'));
