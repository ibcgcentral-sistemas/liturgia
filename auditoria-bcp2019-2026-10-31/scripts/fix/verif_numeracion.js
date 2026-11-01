const L = require(process.argv[2] + '/sim_lib');
const C = L.load();
const strip = h => String(h).replace(/<sup[^>]*>(\d+)<\/sup>/g, '[$1]').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
(async () => {
  const refs = ['Isaiah 9:1-7', 'Isaiah 64:1-9', 'Hosea 2:14-23', 'Jonah 2:1-10', 'Micah 5:2-5', 'Malachi 3:13-4:6', 'Genesis 32:3-8,22-30', 'Exodus 22:21-27', 'Isaiah 52:13-53:12', 'Genesis 2:4-9,15-17,2:25-3:7'];
  for (const r of refs) {
    const pieces = C.ctx.toBibliaPieces ? C.ctx.toBibliaPieces(r) : null;
    const res = await C.fetchScripture(r);
    const t = strip(res.text);
    const labels = [...res.text.matchAll(/<sup class="verse-num">(\d+)<\/sup>/g)].map(m => m[1]);
    console.log('\n' + r + '  → ' + (pieces ? pieces.map(p => `${p.c}:${p.a}-${p.b}`).join(' + ') : '(sin conversión)') + '  etiquetas: ' + labels.join(','));
    console.log('   inicio: ' + t.slice(0, 110));
    console.log('   final : …' + t.slice(-90));
  }
})();
