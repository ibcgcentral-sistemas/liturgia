const L=require('./sim_lib');const C=L.load();const B=C.Biblia;
function show(ref){const vs=B.getVerses(ref);console.log('\n'+ref+' => '+vs.length+' versos: etiquetas '+vs.map(v=>v.v+(v.h&&v.h!==v.v?'(h'+v.h+')':'')).join(','));vs.forEach((v,i)=>{if(i<2||i>=vs.length-2)console.log('   '+v.v+': '+v.content.slice(0,95))});}
['Isaiah 63:19,64:1-8','Psalm 45:11-18','Psalm 22:22-30','Psalm 22:24-30','Psalm 146:4-9','Psalm 51:1-13','Psalm 51:1-11','Psalm 13','Psalm 31:9-16','Hosea 2:16-22','Joel 2:23-27,3:1-5','Joel 2:1-2','Micah 5:1-4','Isaiah 8:23-9:3','Isaiah 9:1-6','Jonah 3:1-5','Malachi 3:1-4','Zephaniah 3:14-20','Isaiah 12:2-6','Daniel 7:9-14','Revelation 21:10,21:22-22:5','Ecclesiastes 1:2,12-14,2:18-23','Song of Songs 3:1-4','Psalm 96:1-9','Psalm 118:1-2','Psalm 116:1-2','Psalm 119:1-8','Psalm 67','Psalm 8','Psalm 84'].forEach(show);
// siguiente versículo tras el final del Salmo 22:22-30 (h 32 / 33)
const ps=C.bible.getBook('Salmos');
console.log('\nSal 22 h31:',ps.chapters[21].verses['31']); console.log('Sal 22 h32:',ps.chapters[21].verses['32']);
console.log('Sal 146 h3:',ps.chapters[145].verses['3']);console.log('Sal 146 h4:',ps.chapters[145].verses['4']);console.log('Sal 146 h5:',ps.chapters[145].verses['5']);
console.log('Sal 45 h11:',ps.chapters[44].verses['11']);console.log('Sal 45 h12:',ps.chapters[44].verses['12']);
