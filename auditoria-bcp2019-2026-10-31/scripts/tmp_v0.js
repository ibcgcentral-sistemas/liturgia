const L=require('./sim_lib');const C=L.load();
const b=C.bible.getBook('Salmos');
for (const n of [105,107,114,116,117,118,136,147,104,106]) {
  const ch=b.chapters[n-1];
  const ks=Object.keys(ch.verses);
  const odd=ks.filter(k=>!/^[1-9]\d*$/.test(k) || false);
  console.log(n, 'keys:', ks.length, 'nonstandard:', JSON.stringify(odd), odd.map(k=>JSON.stringify(ch.verses[k]).slice(0,80)).join(' | '));
}
// any book with weird keys
let weird=0;
for (const bk of C.bible.getAllBooks()) {
  const book=C.bible.getBook(bk.name||bk);
  if(!book) continue;
  for (let i=0;i<book.chapters.length;i++){const ch=book.chapters[i];for(const k of Object.keys(ch.verses||{})){if(!/^[1-9]\d*$/.test(k)){weird++; if(weird<15)console.log('weird key',book.name||bk,i+1,JSON.stringify(k),JSON.stringify(ch.verses[k]).slice(0,60));}}}
}
console.log('weird total',weird);
console.log(typeof C.bible.getAllBooks()[0], JSON.stringify(C.bible.getAllBooks()[0]).slice(0,100));
