// Busca conceptos distintivos de las colectas del app dentro del libro EN (SOLO colectas del año: lineas 16766-18018)
// y dentro de TODO el libro, para confirmar que un texto NO esta en el libro.
const fs = require('fs');
const BOOK = 'C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md';
const lines = fs.readFileSync(BOOK, 'utf8').split(/\r?\n/);
const tests = {
  advent4_conscience: /mansion|daily visitation|purge|purify our conscience/i,
  epiphany2_humility: /great humility|beauty of his majesty|revealed in great/i,
  epiphany4_beatitudes: /beatitudes|poor in spirit|hunger and thirst/i,
  epiphany6_perceive: /perceive your will|patience to believe|wisdom to perceive/i,
  epiphany7_enemies: /love our enemies|pray for those who persecute|commanded us to love/i,
  lent1_fast: /forty days|fast|abstinence/i,
  lent2_astray: /gone astray|glory is always|whose glory/i,
  lent4_promised: /promised forgiveness|forgiveness and mercy|repent and believe/i,
  easter2_solemnity: /solemnity|eternal inheritance|knowledge of this mystery/i,
  easter6_peace: /peace which the world|peace that the world|world cannot give/i,
  proper3_quiet: /restlessness|rest in you above|seek first/i,
  proper4_rock: /rock|storm/i,
  proper8_cornerstone: /foundation of the apostles|cornerstone|chief corner/i,
  proper9_yoke: /yoke|meekness/i,
  proper10_samaritan: /samaritan|compassionate heart/i,
  proper12_teachpray: /teach us to pray|as you taught/i,
  proper14_abraham: /abraham|live without fear/i,
  proper15_hidden: /hidden|wise and the prudent|wise and prudent/i,
  proper18_fraternal: /fraternal|correction|reconciliation before/i,
  proper21_peace: /peace which the world|peace that the world|world cannot give/i,
  proper22_sacrifice: /one perfect sacrifice|heaven and earth|bound together/i,
  proper26_saints: /perfect love|rejoiced in your/i,
  proper27_widow: /widow|open hands|give generously/i,
  proper28_sacrament: /blessed sacrament|body to be given|thankful remembrance/i,
  mary_magdalene_first: /first appeared|appeared first/i,
  barnabas_gifts: /singular gifts|console|consolation/i,
  mary_virgin_humility: /lowliness|humility of the blessed|intercession/i,
  james_jerusalem_believe: /govern your church with wisdom/i,
  simon_jude_knowledge: /knowledge of your name|knowledge of him who is the way/i,
  holysat_baptism: /buried with him|baptized into the death/i,
};
const out = {};
for (const [name, re] of Object.entries(tests)) {
  const hitsCol = [], hitsAll = [];
  lines.forEach((l, i) => {
    if (re.test(l)) {
      const n = i + 1;
      if (n >= 16766 && n <= 18018) hitsCol.push(n + ': ' + l.trim().slice(0, 90));
      else hitsAll.push(n);
    }
  });
  out[name] = { enColectas: hitsCol, fueraDeColectas_n: hitsAll.length, fuera_ej: hitsAll.slice(0, 8) };
}
console.log(JSON.stringify(out, null, 1));
