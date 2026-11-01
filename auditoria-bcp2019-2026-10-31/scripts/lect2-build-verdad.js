// lect2-build-verdad.js — Construye lect2-verdad.json (BCP 2019, Propios y fiestas fijas).
// SOLO LECTURA sobre el repositorio. Fuente: texto del PDF oficial (pdftotext -layout,
// págs. PDF 733-739 = págs. del libro 725-731) transcrito a mano columna por columna, y
// contrastado automáticamente con el markdown de markitdown (BCP2019-en.md).
// Uso: node lect2-build-verdad.js
const fs = require('fs');
const path = require('path');
const OUT = __dirname;
const MD = 'C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md';

// [first, psalm, second, gospel] por ciclo A / B / C — texto verbatim del libro (con «—», paréntesis opcionales, «or», sufijo «v»).
// anchor = línea del markdown donde aparece el rótulo del Propio; pdfPage = página del libro.
const PROPERS = {
  1: { anchor: 21082, page: 725, range: 'May 8 to May 14 (solo «Weekdays following the Sunday»)',
    A: ['Ecclesiasticus 15:11-20', 'Ps 119:1-16', '1 Cor 3:1-9', 'Matt 5:21-37'],
    B: ['2 Kings 5:1-15a', 'Ps 42', '1 Cor 9:24-27', 'Mark 1:40-45'],
    C: ['Jer 17:5-10', 'Ps 1', '1 Cor 15:12-20', 'Luke 6:17-26'] },
  2: { anchor: 21090, page: 725, range: 'May 15 to May 21 (solo «Weekdays following the Sunday»)',
    A: ['Lev 19:1-2,9-18', 'Ps 71 or 71:11-23v', '1 Cor 3:10-23', 'Matt 5:38-48'],
    B: ['Isa 43:18-25', 'Ps 32', '2 Cor 1:18-22', 'Mark 2:1-12'],
    C: ['Gen 45:3-11,21-28', 'Ps 37:(1-6)7-17v', '1 Cor 15:35-49', 'Luke 6:27-38'] },
  3: { anchor: 21099, page: 725, range: 'May 22 to May 28',
    A: ['Isa 49:8-18(19-23)', 'Ps 62', '1 Cor 4:1-13', 'Matt 6:24-34'],
    B: ['Hos 2:14-23', 'Ps 103 or 103:1-14', '2 Cor 3:4-18', 'Mark 2:18-22'],
    C: ['Jer 7:1-15', 'Ps 92', '1 Cor 15:50-58', 'Luke 6:39-49'] },
  4: { anchor: 21104, page: 725, range: 'May 29 to June 4',
    A: ['Deut 11:18-32', 'Ps 31 or Ps 31:18-27v', 'Rom 3:21-31', 'Matt 7:21-27'],
    B: ['Deut 5:6-21', 'Ps 81:1-10(11-16)', '2 Cor 4:1-12', 'Mark 2:23-28'],
    C: ['1 Kings 8:22-30,41-43', 'Ps 96', 'Gal 1:1-10', 'Luke 7:1-10'] },
  5: { anchor: 21116, page: 726, range: 'June 5 to June 11',
    A: ['Hos 5:15—6:6', 'Ps 50', 'Rom 4:13-18', 'Matt 9:9-13'],
    B: ['Gen 3:1-21', 'Ps 130', '2 Cor 4:13-18', 'Mark 3:20-35'],
    C: ['1 Kings 17:17-24', 'Ps 30', 'Gal 1:11-24', 'Luke 7:11-17'] },
  6: { anchor: 21121, page: 726, range: 'June 12 to June 18',
    A: ['Ex 19:1-8', 'Ps 100', 'Rom 5:1-11', 'Matt 9:35—10:15'],
    B: ['Ezek 31:1-6(7-9)10-14', 'Ps 92', '2 Cor 5:1-10', 'Mark 4:26-34'],
    C: ['2 Sam 11:26—12:15', 'Ps 32:1-6(7-12)', 'Gal 2:11-21', 'Luke 7:36—8:3'] },
  7: { anchor: 21127, page: 726, range: 'June 19 to June 25',
    A: ['Jer 20:7-13', 'Ps 69:1-15(16-18)v', 'Rom 5:15b-19', 'Matt 10:16-33'],
    B: ['Job 38:1-11(12-15)16-18', 'Ps 107:1-3(4-22)23-32', '2 Cor 5:14-21', 'Mark 4:35-41(5:1-20)'],
    C: ['Zech 12:8-10,13:1', 'Ps 63', 'Gal 3:23-29', 'Luke 9:18-24'] },
  8: { anchor: 21139, page: 726, range: 'June 26 to July 2',
    A: ['Isa 2:10-17', 'Ps 89:1-18v', 'Rom 6:1-11', 'Matt 10:34-42'],
    B: ['Deut 15:7-11', 'Ps 112', '2 Cor 8:1-15', 'Mark 5:22-43'],
    C: ['1 Kings 19:15-21', 'Ps 16', 'Gal 5:1,13-25', 'Luke 9:51-62'] },
  9: { anchor: 21145, page: 726, range: 'July 3 to July 9',
    A: ['Zech 9:9-12', 'Ps 145:1-13(14-21)v', 'Rom 7:21—8:6', 'Matt 11:25-30'],
    B: ['Ezek 2:1-7', 'Ps 123', '2 Cor 12:2-10', 'Mark 6:1-6'],
    C: ['Isa 66:10-16', 'Ps 66 or 66:1-8v', 'Gal 6:(1-5)6-18', 'Luke 10:1-20'] },
  10: { anchor: 21151, page: 726, range: 'July 10 to July 16',
    A: ['Isa 55', 'Ps 65', 'Rom 8:7-17', 'Matt 13:1-9,18-23'],
    B: ['Amos 7:7-15', 'Ps 85', 'Eph 1:1-14(15-23)', 'Mark 6:7-13'],
    C: ['Deut 30:9-14', 'Ps 25:1-14(15-21)v', 'Col 1:1-14', 'Luke 10:25-37'] },
  11: { anchor: 21156, page: 726, range: 'July 17 to July 23',
    A: ['Wisdom 12:13, 16-19', 'Ps 86', 'Rom 8:18-25', 'Matt 13:24-30,34-43'],
    B: ['Isa 57:14-21', 'Ps 22:23-31v', 'Eph 2:11-22', 'Mark 6:30-44'],
    C: ['Gen 18:1-14', 'Ps 15', 'Col 1:21-29', 'Luke 10:38-42'] },
  12: { anchor: 21161, page: 726, range: 'July 24 to July 30',
    A: ['1 Kings 3:3-14', 'Ps 119:121-136', 'Rom 8:26-34', 'Matt 13:31-33,44-50'],
    B: ['2 Kings 2:1-15', 'Ps 114', 'Eph 3:(1-7)8-21', 'Mark 6:45-52'],
    C: ['Gen 18:20-33', 'Ps 138', 'Col 2:6-15', 'Luke 11:1-13'] },
  13: { anchor: 21176, page: 727, range: 'July 31 to August 6',
    A: ['Neh 9:16-21', 'Ps 78:(1-13)14-26v', 'Rom 8:35-39', 'Matt 14:13-21'],
    B: ['Ex 16:2-4(5-8)9-15', 'Ps 78:(1-13)14-26v', 'Eph 4:1-16', 'John 6:24-35'],
    C: ['Eccl 1:12—2:11', 'Ps 49:1-12(13-21)v', 'Col 3:5-17', 'Luke 12:13-21'] },
  14: { anchor: 21181, page: 727, range: 'August 7 to August 13',
    A: ['Jon 2:1-10', 'Ps 29', 'Rom 9:1-5', 'Matt 14:22-33'],
    B: ['Deut 8:1-10', 'Ps 34:(1-7)8-15(16-22)', 'Eph 4:17—5:2', 'John 6:37-51'],
    C: ['Gen 15:1-6', 'Ps 33(1-9)10-21v', 'Heb 11:1-16', 'Luke 12:32-40'] },
  15: { anchor: 21189, page: 727, range: 'August 14 to August 20',
    A: ['Isa 56:1-8', 'Ps 67', 'Rom 11:13-24', 'Matt 15:21-28'],
    B: ['Prov 9:1-6', 'Ps 147', 'Eph 5:3-14', 'John 6:53-59'],
    C: ['Jer 23:23-29', 'Ps 82', 'Heb 12:1-14', 'Luke 12:49-56'] },
  16: { anchor: 21194, page: 727, range: 'August 21 to August 27',
    A: ['Isa 51:1-6', 'Ps 138', 'Rom 11:25-36', 'Matt 16:13-20'],
    B: ['Josh 24:1-2a,14-25', 'Ps 16', 'Eph 5:15-33(6:1-9)', 'John 6:60-69'],
    C: ['Isa 28:14-22', 'Ps 46', 'Heb 12:(15-17)18-29', 'Luke 13:22-30'] },
  17: { anchor: 21201, page: 727, range: 'August 28 to September 3',
    A: ['Jer 15:15-21', 'Ps 26', 'Rom 12:1-8', 'Matt 16:21-27'],
    B: ['Deut 4:1-9', 'Ps 15', 'Eph 6:10-20', 'Mark 7:1-23'],
    C: ['Ecclesiasticus 10:7-18', 'Ps 112', 'Heb 13:1-8', 'Luke 14:1,7-14'] },
  18: { anchor: 21206, page: 727, range: 'September 4 to September 10',
    A: ['Ezek 33:1-11', 'Ps 119:33-48', 'Rom 12:9-21', 'Matt 18:15-20'],
    B: ['Isa 35:4-7a', 'Ps 146', 'James 1:17-27', 'Mark 7:31-37'],
    C: ['Deut 30:15-20', 'Ps 1', 'Philemon (1-3)4-21(22-25)', 'Luke 14:25-33'] },
  19: { anchor: 21217, page: 727, range: 'September 11 to September 17',
    A: ['Ecclesiasticus 27:30—28:7', 'Ps 103 or 103:1-14', 'Rom 14:5-12', 'Matt 18:21-35'],
    B: ['Isa 50:4-9', 'Ps 116:1-9(10-16)v', 'James 2:1-18', 'Mark 9:14-29'],
    C: ['Ex 32:1,7-14', 'Ps 51:1-17v', '1 Tim 1:12-17', 'Luke 15:1-10'] },
  20: { anchor: 21230, page: 727, range: 'September 18 to September 24',
    A: ['Jonah 3:10—4:11', 'Ps 145:(1-13)14-21v', 'Phil 1:21-27', 'Matt 20:1-16'],
    B: ['Wisdom 1:16—2:1,12-22', 'Ps 54', 'James 3:16—4:6', 'Mark 9:30-37'],
    C: ['Amos 8:4-12', 'Ps 138', '1 Tim 2:1-7(8-15)', 'Luke 16:1-13'] },
  21: { anchor: 21247, page: 728, range: 'September 25 to October 1',
    A: ['Ezek 18:1-4,25-32', 'Ps 25:1-14(15-21)', 'Phil 2:1-13', 'Matt 21:28-32'],
    B: ['Num 11:4-6,10-17,24-29', 'Ps 19:(1-6)7-14', 'James 4:7-12(13—5:6)', 'Mark 9:38-48'],
    C: ['Amos 6:1-7', 'Ps 146', '1 Tim 6:11-19', 'Luke 16:19-31'] },
  22: { anchor: 21256, page: 728, range: 'October 2 to October 8',
    A: ['Isa 5:1-7', 'Ps 80:(1-6)7-19v', 'Phil 3:14-21', 'Matt 21:33-44'],
    B: ['Gen 2:18-24', 'Ps 8', 'Heb 2:(1-8)9-18', 'Mark 10:2-16'],
    C: ['Hab 1:1-13, 2:1-4', 'Ps 37:1-17v', '2 Tim 1:1-14', 'Luke 17:5-10'] },
  23: { anchor: 21261, page: 728, range: 'October 9 to October 15',
    A: ['Isa 25:1-9', 'Ps 23', 'Phil 4:4-13', 'Matt 22:1-14'],
    B: ['Amos 5:6-15', 'Ps 90:1-12(13-17)', 'Heb 3:1-6', 'Mark 10:17-31'],
    C: ['Ruth 1:1-19a', 'Ps 113', '2 Tim 2:1-15', 'Luke 17:11-19'] },
  24: { anchor: 21269, page: 728, range: 'October 16 to October 22',
    A: ['Mal 3:6-12', 'Ps 96', '1 Thess 1:1-10', 'Matt 22:15-22'],
    B: ['Isa 53:4-12', 'Ps 91', 'Heb 4:12-16', 'Mark 10:35-45'],
    C: ['Gen 32:3-8,22-30', 'Ps 121', '2 Tim 3:14—4:5', 'Luke 18:1-8'] },
  25: { anchor: 21280, page: 728, range: 'October 23 to October 29',
    A: ['Ex 22:21-27', 'Ps 1', '1 Thess 2:1-8', 'Matt 22:34-46'],
    B: ['Isa 59:9-20', 'Ps 13', 'Heb 5:11—6:12', 'Mark 10:46-52'],
    C: ['Jer 14:(1-6)7-10,19-22', 'Ps 84', '2 Tim 4:6-18', 'Luke 18:9-14'] },
  26: { anchor: 21297, page: 728, range: 'October 30 to November 5',
    A: ['Mic 3:5-12', 'Ps 43', '1 Thess 2:9-20', 'Matt 23:1-12'],
    B: ['Deut 6:1-9', 'Ps 119:1-16', 'Heb 7:23-28', 'Mark 12:28-34'],
    C: ['Isa 1:10-20', 'Ps 32', '2 Thess 1:1-12', 'Luke 19:1-10'] },
  27: { anchor: 21311, page: 729, range: 'November 6 to November 12',
    A: ['Amos 5:18-24', 'Ps 70', '1 Thess 4:13-18', 'Matt 25:1-13'],
    B: ['1 Kings 17:8-16', 'Ps 146', 'Heb 9:24-28', 'Mark 12:38-44'],
    C: ['Job 19:23-27a', 'Ps 17', '2 Thess 2:13—3:5', 'Luke 20:27-38'] },
  28: { anchor: 21315, page: 729, range: 'November 13 to November 19',
    A: ['Zeph 1:7,12-18', 'Ps 90:1-12(13-17)', '1 Thess 5:1-10', 'Matt 25:14-30'],
    B: ['Dan 12:1-4a(4b-13)', 'Ps 16', 'Heb 10:31-39', 'Mark 13:14-23'],
    C: ['Mal 3:13—4:6', 'Ps 98', '2 Thess 3:6-16', 'Luke 21:5-19'] },
  29: { anchor: 21320, page: 729, range: 'November 20 to November 26 (Christ the King)',
    A: ['Ezek 34:11-20', 'Ps 95', '1 Cor 15:20-28', 'Matt 25:31-46'],
    B: ['Dan 7:9-14', 'Ps 93', 'Rev 1:1-8', 'John 18:33-37'],
    C: ['Jer 23:1-6', 'Ps 46', 'Col 1:11-20', 'Luke 23:35-43'] },
};

// Fiestas fijas: una sola lista (no por ciclo). anchor = línea md aprox. del rótulo; page = pág. del libro.
const FEASTS = {
  '01-01': { name: 'The Circumcision & Holy Name (Jan 1)', anchor: 21383, page: 730, r: ['Ex 34:1-9', 'Ps 8', 'Rom 1:1-7', 'Luke 2:15-21'] },
  '01-18': { name: 'Confession of St. Peter', anchor: 21394, page: 730, r: ['Acts 4:8-13', 'Ps 23', '1 Pet 5:1-11', 'Matt 16:13-19'] },
  '01-25': { name: 'Conversion of St. Paul', anchor: 21405, page: 730, r: ['Acts 26:9-21', 'Ps 67', 'Gal 1:11-24', 'Matt 10:16-25'] },
  '02-02': { name: 'The Presentation of Christ in the Temple', anchor: 21337, page: 730, r: ['Mal 3:1-4', 'Ps 84', 'Heb 2:14-18', 'Luke 2:22-40'] },
  '02-24': { name: 'St. Matthias', anchor: 21351, page: 730, r: ['Acts 1:15-26', 'Ps 15', 'Phil 3:12-21', 'John 15:1-16'] },
  '03-19': { name: 'St. Joseph', anchor: 21360, page: 730, r: ['2 Sam 7:4,8-16', 'Ps 89:1-4(5-18)19-29v', 'Rom 4:13-18', 'Luke 2:41-52'] },
  '03-25': { name: 'The Annunciation', anchor: 21368, page: 730, r: ['Isa 7:10-14', 'Ps 40:1-13v or Magnificat', 'Heb 10:5-10', 'Luke 1:26-38'] },
  '04-25': { name: 'St. Mark', anchor: 21380, page: 730, r: ['Isa 52:7-10', 'Ps 2', 'Eph 4:7-8,11-16', 'Mark 16:15-20'] },
  '05-01': { name: 'St. Philip & St. James', anchor: 21386, page: 730, r: ['Isa 30:18-21', 'Ps 119:33-40', '2 Cor 4:1-7', 'John 14:6-14'] },
  '05-31': { name: 'The Visitation', anchor: 21397, page: 730, r: ['Zeph 3:14-18', 'Ps 113 or Ecce Deus', 'Col 3:12-17', 'Luke 1:39-56'] },
  '06-11': { name: 'St. Barnabas', anchor: 21408, page: 730, r: ['Isa 42:5-12', 'Ps 112', 'Acts 11:19-30,13:1-3', 'Matt 10:7-16'] },
  '06-24': { name: 'Nativity of St. John the Baptist', anchor: 21419, page: 731, r: ['Isa 40:1-11', 'Ps 85:7-13', 'Acts 13:14b-26', 'Luke 1:57-80'] },
  '06-29': { name: 'St. Peter & St. Paul', anchor: 21428, page: 731, r: ['Ezek 34:11-16', 'Ps 87', '2 Tim 4:1-8', 'John 21:15-19'] },
  '07-22': { name: 'St. Mary Magdalene', anchor: 21435, page: 731, r: ['Judg 4:4-10 or Judith 9:1,11-14', 'Ps 42:1-7(8-15)', '2 Cor 5:14-20a', 'John 20:11-18'] },
  '07-25': { name: 'St. James', anchor: 21443, page: 731, r: ['Jer 45:1-5', 'Ps 7:1-11(12-18)', 'Acts 11:27—12:3', 'Matt 20:20-28'] },
  '08-06': { name: 'The Transfiguration', anchor: 21450, page: 731, r: ['Ex 34:29-35', 'Ps 99', '2 Pet 1:13-21', 'Luke 9:28-36'] },
  '08-15': { name: 'St. Mary the Virgin', anchor: 21460, page: 731, r: ['Isa 61:10-11', 'Ps 34', 'Gal 4:4-7', 'Luke 1:46-55'] },
  '08-24': { name: 'St. Bartholomew', anchor: 21472, page: 731, r: ['Deut 18:15-18', 'Ps 91', '1 Cor 4:9-16', 'Luke 22:24-30'] },
  '09-14': { name: 'Holy Cross Day', anchor: 21479, page: 731, r: ['Isa 45:21-25', 'Ps 98', 'Phil 2:5-11', 'John 12:31-36a'] },
  '09-21': { name: 'St. Matthew', anchor: 21421, page: 731, r: ['Prov 3:1-12', 'Ps 119:33-40', '2 Tim 3:1-17', 'Matt 9:9-13'] },
  '09-29': { name: 'Holy Michael & All Angels', anchor: 21428, page: 731, r: ['Gen 28:10-17', 'Ps 103', 'Rev 12:7-12', 'John 1:47-51'] },
  '10-18': { name: 'St. Luke', anchor: 21435, page: 731, r: ['Ecclesiasticus 38:1-14', 'Ps 147:1-11v', '2 Tim 4:1-13', 'Luke 4:14-21'] },
  '10-23': { name: 'St. James of Jerusalem', anchor: 21440, page: 731, r: ['Acts 15:12-22a', 'Ps 1', '1 Cor 15:1-11', 'Matt 13:54-58'] },
  '10-28': { name: 'St. Simon & St. Jude', anchor: 21450, page: 731, r: ['Deut 32:1-4', 'Ps 119:89-96', 'Eph 2:13-22', 'John 15:17-27'] },
  '11-01': { name: "All Saints' Day", anchor: 21467, page: 731, r: ['Ecclesiasticus 44:1-14 or Rev 7:9-17', 'Ps 149', 'Rev 7:9-17 or Eph 1:(11-14)15-23', 'Matt 5:1-12 or Luke 6:20-26(27-36)'] },
  '11-30': { name: 'St. Andrew', anchor: 21340, page: 730, r: ['Deut 30:11-14', 'Ps 19 or 19:1-6', 'Rom 10:8b-18', 'Matt 4:18-22'] },
  '12-21': { name: 'St. Thomas', anchor: 21349, page: 730, r: ['Hab 2:1-4', 'Ps 126', 'Heb 10:35—11:1', 'John 20:19-29'] },
  '12-26': { name: 'St. Stephen', anchor: 21358, page: 730, r: ['Jer 26:1-9(10-11)12-15', 'Ps 31:1-6(7-27)v', 'Acts 6:8—7:2a,51-60', 'Matt 23:29-39'] },
  '12-27': { name: 'St. John', anchor: 21368, page: 730, r: ['Ex 33:18-23', 'Ps 92:1-4(5-10)11-14', '1 John 1', 'John 21:9-25 or John 1:1-18'] },
  '12-28': { name: 'The Holy Innocents', anchor: 21378, page: 730, r: ['Jer 31:15-17', 'Ps 124', 'Rev 21:1-7', 'Matt 2:13-18'] },
};

// Días que el libro tiene y el app no modela (referencia, no se compara).
const EXTRA_BOOK_DAYS = {
  'Ember Days I': { page: 732, r: ['Num 11:16-17,24-29', 'Ps 99', '1 Cor 3:5-11', 'John 4:31-38'] },
  'Ember Days II': { page: 732, r: ['1 Sam 3:1-10', 'Ps 63:1-8v', 'Eph 4:11-16', 'Matt 9:35-38'] },
  'Rogation Days I': { page: 732, r: ['Deut 11:10-15', 'Ps 147', 'Rom 8:18-25', 'Mark 4:26-32'] },
  'Rogation Days II': { page: 732, r: ['Ecclesiasticus 38:27-32', 'Ps 107:1-9', '1 Cor 3:10-14', 'Matt 6:19-24'] },
  'Thanksgiving Day (Canada/USA)': { page: 732, r: ['Deut 8', 'Ps 65:1-8(9-14)', 'James 1:17-27', 'Matt 6:25-33'] },
  'Canada Day (Jul 1)': { page: 732, r: ['Deut 6:1-15', 'Ps 145', '1 Peter 2:1-6', 'Matt 22:16-21 or Matt 25:14-30'] },
  'Independence Day (Jul 4)': { page: 732, r: ['Deut 10:17-21', 'Ps 145', 'Heb 11:8-16', 'Matt 5:43-48'] },
  'Remembrance Day / Memorial Day': { page: 732, r: ['Wisdom 3:1-9', 'Ps 121', 'Rev 7:9-17', 'John 11:21-27 or John 15:12-17'] },
  'Common: Martyr': { page: 732, r: ['Jer 15:15-21', 'Ps 34', 'Rev 7:9-17', 'Luke 12:4-12'] },
  'Common: Missionary or Evangelist': { page: 732, r: ['Isa 49:1-7', 'Ps 98', 'Rom 10:11-18', 'Luke 5:1-11'] },
  'Common: Pastor': { page: 732, r: ['Isa 6:1-8', 'Ps 71:17-24v', '1 Pet 5:1-11 or Acts 20:24-35', 'Matt 24:42-50'] },
  'Common: Teacher of the Faith': { page: 732, r: ['Prov 3:13-26', 'Ps 119:89-106', '1 John 1:1-10', 'Matt 13:47-52'] },
  'Common: Monastic or Religious': { page: 732, r: ['Lam 3:22-33', 'Ps 1', 'Heb 4:1-13 or Acts 2:42-47', 'Mark 10:23-31'] },
  'Common: Ecumenist': { page: 732, r: ['Ezk 34:11-16', 'Ps 133', 'Eph 3:14-21', 'John 17:10-26'] },
  'Common: Reformer of the Church': { page: 732, r: ['Jer 1:4-10', 'Ps 46', '1 Cor 3:10-23', 'Matt 5:13-20'] },
  'Common: Renewer of Society': { page: 732, r: ['Ex 3:7-12', 'Ps 145:1-13v', 'Rom 12:9-21', 'Luke 6:20-38'] },
  'Common: Any Commemoration I': { page: 733, r: ['Mic 6:6-8', 'Ps 1', '1 Cor 1:18-31', 'John 3:16-21'] },
  'Common: Any Commemoration II': { page: 733, r: ['Wisdom 3:1-9', 'Ps 15', 'Phil 4:4-9', 'Luke 6:17-23'] },
};

const FIELDS = ['first', 'psalm', 'second', 'gospel'];
const verdad = { _meta: {
  fuente: 'BCP 2019 (ACNA), «Sunday, Holy Day, and Commemoration Lectionary», pp. 725-733 del libro (PDF 733-741). Transcrito de pdftotext -layout y contrastado con BCP2019-en.md.',
  nota: 'Cada lectura es el texto verbatim del libro («—» = rango entre capítulos; paréntesis = verso opcional; «or» = alternativa; sufijo «v» = numeración de versículos del Salterio Nuevo Coverdale).',
  generado: new Date().toISOString() }, propers: {}, feasts: {}, extraBookDays: EXTRA_BOOK_DAYS };

for (const [n, p] of Object.entries(PROPERS)) {
  const o = { numero: Number(n), rango: p.range, paginaLibro: p.page, lineaMarkdown: p.anchor };
  for (const c of ['A', 'B', 'C']) { o[c] = {}; FIELDS.forEach((f, i) => { o[c][f] = p[c][i]; }); }
  verdad.propers['proper' + n] = o;
}
for (const [k, f] of Object.entries(FEASTS)) {
  const o = { nombre: f.name, paginaLibro: f.page, lineaMarkdown: f.anchor };
  FIELDS.forEach((fld, i) => { o[fld] = f.r[i]; });
  verdad.feasts[k] = o;
}
fs.writeFileSync(path.join(OUT, 'lect2-verdad.json'), JSON.stringify(verdad, null, 1), 'utf8');

// ── Contraste automático con el markdown (independiente: otra extracción) ──
const md = fs.readFileSync(MD, 'utf8').split(/\r?\n/);
const BLOCK = md.slice(21068, 21490);               // líneas 21069-21490
const strip = s => s.replace(/[|\s]/g, '').replace(/[—–]/g, '-').replace(/\u00a0/g, '').toLowerCase();
const blockFlat = strip(BLOCK.join(' '));
const fails = [];
let total = 0;
function check(label, ref) {
  total++;
  // cada alternativa «X or Y» se comprueba por separado
  const parts = ref.split(/\s+or\s+/);
  for (const part of parts) {
    const flat = strip(part);
    if (!blockFlat.includes(flat)) fails.push({ label, ref, part });
  }
}
for (const [k, o] of Object.entries(verdad.propers)) for (const c of ['A', 'B', 'C']) for (const f of FIELDS) check(`${k} ${c} ${f}`, o[c][f]);
for (const [k, o] of Object.entries(verdad.feasts)) for (const f of FIELDS) check(`${k} ${f}`, o[f]);
fs.writeFileSync(path.join(OUT, 'lect2-verdad-crosscheck.json'), JSON.stringify({ total, fallos: fails }, null, 1), 'utf8');
console.log('Propios:', Object.keys(verdad.propers).length, 'Fiestas:', Object.keys(verdad.feasts).length);
console.log('Referencias contrastadas con markdown:', total, '— no halladas verbatim en el markdown:', fails.length);
for (const f of fails) console.log('  -', f.label, '|', f.part);
