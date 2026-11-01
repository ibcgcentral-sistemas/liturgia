// Desglose por tipo de dia (domingo / fiesta fija / otros propios / feria prestada) de los veredictos 2026-2027
const fs = require('fs');
const out = {};
for (const y of [2026, 2027]) {
  const f = `C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/audit/colectas-dias-${y}.csv`;
  const rows = fs.readFileSync(f, 'utf8').split('\n').slice(1).map(l => l.split(';'));
  const t = {};
  for (const r of rows) {
    const [iso, dow, key, nombre, ck, kslot, bslot, rule, tslot, clase, ver] = r;
    let tipo;
    if (dow === 'dom') tipo = 'domingo';
    else if (/^\d\d-\d\d$/.test(key)) tipo = 'fiesta fija';
    else if (!/Feria/.test(key)) tipo = 'dia propio (Ceniza, Jueves/Viernes Santo, Sabado Santo, Navidad, Epifania, Ascension)';
    else tipo = 'feria (colecta prestada)';
    const k = tipo + ' | ' + (ver === 'OK_C' ? 'OK exacto' : ver === 'OK_V' ? 'OK variante' : ver === 'LOGICA' ? 'ERROR de eleccion' : 'texto distinto');
    t[k] = (t[k] || 0) + 1;
  }
  out[y] = Object.fromEntries(Object.entries(t).sort());
}
console.log(JSON.stringify(out, null, 1));
