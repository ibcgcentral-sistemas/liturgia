// Inserta las tablas generadas (colectas-tablaA/B.md) en colectas.md (marcadores {{TABLA_A}} / {{TABLA_B}}).
const fs = require('fs');
const dir = 'C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/audit/';
let md = fs.readFileSync(dir + 'colectas.md', 'utf8');
const A = fs.readFileSync(dir + 'colectas-tablaA.md', 'utf8');
const B = fs.readFileSync(dir + 'colectas-tablaB.md', 'utf8');
if (md.includes('{{TABLA_A}}')) md = md.replace('{{TABLA_A}}', () => A);
if (md.includes('{{TABLA_B}}')) md = md.replace('{{TABLA_B}}', () => B);
fs.writeFileSync(dir + 'colectas.md', md, 'utf8');
console.log('ok', md.length, 'caracteres;', (md.match(/^\| \d+ \|/gm) || []).length, 'filas numeradas');
