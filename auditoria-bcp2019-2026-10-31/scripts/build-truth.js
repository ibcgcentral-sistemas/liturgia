// Construye audit/lect1-verdad.json  (SOLO LECTURA sobre el repo; escribe en la carpeta audit).
// Fuente de la transcripcion: tabla "Sunday, Holy Day, and Commemoration Lectionary" (libro pp. 717-725)
// reconstruida por COLUMNAS a partir del PDF (coordenadas x/y de cada palabra; ver pdfcols.py) porque la
// extraccion markdown mezcla filas. Cada valor se coteja luego contra el markdown (lineas) y se marca
// "pdf-only" si el markdown no lo trae de forma localizable.
const fs = require('fs');
const path = require('path');
const MD = 'C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/BCP2019-en.md';
const OUT = path.join(__dirname, 'lect1-verdad.json');

// [first, psalm, second, gospel]; null = el libro no asigna esa lectura
// u: lectura unica (misma en A, B y C).  c: por ciclo.
const D = [
  // key, appKey (o null), etiqueta del libro, pagina del libro, anchor md, datos
  ['advent1', 'advent1', 'The First Sunday in Advent', 717, 'Isa 2:1-5', { c: {
    A: ['Isa 2:1-5', 'Ps 122', 'Rom 13:8-14', 'Matt 24:29-44'],
    B: ['Isa 64:1-9a', 'Ps 80 or 80:1-7v', '1 Cor 1:1-9', 'Mark 13:24-37'],
    C: ['Zech 14:(1-2)3-9', 'Ps 50 or 50:1-6', '1 Thess 3:6-13', 'Luke 21:25-33'] } }],
  ['advent2', 'advent2', 'The Second Sunday in Advent', 717, 'Isa 11:1-10', { c: {
    A: ['Isa 11:1-10', 'Ps 72:1-15(16-19)', 'Rom 15:1-13', 'Matt 3:1-12'],
    B: ['Isa 40:1-11', 'Ps 85', '2 Pet 3:8-18', 'Mark 1:1-8'],
    C: ['Mal 3:1-5', 'Ps 126', '1 Cor 4:(1-7)8-21', 'Luke 3:1-6'] } }],
  ['advent3', 'advent3', 'The Third Sunday in Advent', 717, 'Isa 35:1-10', { c: {
    A: ['Isa 35:1-10', 'Ps 146', 'James 5:7-20', 'Matt 11:2-19'],
    B: ['Isa 65:17-25', 'Ps 126', '1 Thess 5:12-28', 'John 3:22-30 or John 1:19-28'],
    C: ['Zeph 3:14-20', 'Ps 85', 'Phil 4:4-9', 'Luke 3:7-20'] } }],
  ['advent4', 'advent4', 'The Fourth Sunday in Advent (Annunciation)', 717, 'Isa 7:10-17', { c: {
    A: ['Isa 7:10-17', 'Ps 24', 'Rom 1:1-7', 'Matt 1:18-25'],
    B: ['2 Sam 7:1-17', 'Ps 132:(1-7) 8-19', 'Rom 16:25-27', 'Luke 1:26-38'],
    C: ['Mic 5:2-5a', 'Ps 80:1-7v', 'Heb 10:1-10', 'Luke 1:39-56'] } }],
  ['christmas', 'christmas', 'Christmas Day I', 718, 'Isa 9:1-7', { u: ['Isa 9:1-7', 'Ps 96', 'Titus 2:11-14', 'Luke 2:1-14(15-20)'] }],
  ['christmasDay2', null, 'Christmas Day II', 718, 'Isa 62:6-12', { u: ['Isa 62:6-12', 'Ps 97', 'Titus 3:4-7', 'Luke 2:(1-14)15-20'] }],
  ['christmasDay3', null, 'Christmas Day III', 718, 'Isa 52:7-12', { u: ['Isa 52:7-12', 'Ps 98', 'Heb 1:1-12', 'John 1:1-18'] }],
  ['christmasSunday', 'christmasSunday', 'The First Sunday of Christmas', 718, 'Isa 61:10', { u: ['Isa 61:10—62:5', 'Ps 147:12-20v', 'Gal 3:23—4:7', 'John 1:1-18'] }],
  ['circumcision', 'circumcision', 'The Circumcision & Holy Name of Our Lord Jesus Christ (January 1)', 718, 'Ex 34:1-9', { u: ['Ex 34:1-9', 'Ps 8', 'Rom 1:1-7', 'Luke 2:15-21'] }],
  ['christmasSunday2', 'christmasSunday2', 'The Second Sunday of Christmas', 718, 'Jer 31:7-14', { c: {
    A: ['Jer 31:7-14', 'Ps 84', 'Eph 1:3-14', 'Luke 2:41-52 or Matt 2:1-12'],
    B: ['Jer 31:7-14', 'Ps 84', 'Eph 1:3-14', 'Matt 2:13-23 or Matt 2:1-12'],
    C: ['Jer 31:7-14', 'Ps 84', 'Eph 1:3-14', 'Luke 2:22-40 or Matt 2:1-12'] } }],
  ['epiphany', 'epiphany', 'The Epiphany of Our Lord Jesus Christ (January 6)', 718, 'Isa 60:1-9', { u: ['Isa 60:1-9', 'Ps 72 or 72:1-11', 'Eph 3:1-13', 'Matt 2:1-12'] }],
  ['epiphany1', 'epiphany1', 'The First Sunday of Epiphany (Baptism of Our Lord)', 719, 'Isa 42:1-9', { c: {
    A: ['Isa 42:1-9', 'Ps 89:1-29v or 89:20-29v', 'Acts 10:34-38', 'Matt 3:13-17'],
    B: ['Isa 42:1-9', 'Ps 89:1-29v or 89:20-29v', 'Acts 10:34-38', 'Mark 1:7-11'],
    C: ['Isa 42:1-9', 'Ps 89:1-29v or 89:20-29v', 'Acts 10:34-38', 'Luke 3:15-22'] } }],
  ['epiphany2', 'epiphany2', 'The Second Sunday of Epiphany', 719, 'Ex 12:21-28', { c: {
    A: ['Ex 12:21-28', 'Ps 40:1-11v', '1 Cor 1:1-9', 'John 1:29-42'],
    B: ['1 Sam 3:1-20', 'Ps 63:1-9(10-12)v', '1 Cor 6:9-20', 'John 1:43-51'],
    C: ['Isa 62:1-5', 'Ps 96', '1 Cor 12:1-11', 'John 2:1-11'] } }],
  ['epiphany3', 'epiphany3', 'The Third Sunday of Epiphany', 719, 'Amos 3:1-11', { c: {
    A: ['Amos 3:1-11', 'Ps 139:1-18v', '1 Cor 1:10-17', 'Matt 4:12-22'],
    B: ['Jer 3:19-4:4', 'Ps 130', '1 Cor 7:17-24', 'Mark 1:14-20'],
    C: ['Neh 8:1-12', 'Ps 113', '1 Cor 12:12-27', 'Luke 4:14-21'] } }],
  ['epiphany4', 'epiphany4', 'The Fourth Sunday of Epiphany', 719, 'Mic 6:1-8', { c: {
    A: ['Mic 6:1-8', 'Ps 37:1-11v', '1 Cor 1:18-31', 'Matt 5:1-12'],
    B: ['Deut 18:15-22', 'Ps 111', '1 Cor 8:1-13', 'Mark 1:21-28'],
    C: ['Jer 1:4-10', 'Ps 71:11-20v', '1 Cor 14:12-25', 'Luke 4:21-32'] } }],
  ['epiphany5', 'epiphany5', 'The Fifth Sunday of Epiphany', 719, '2 Kings 22:8-20', { c: {
    A: ['2 Kings 22:8-20', 'Ps 27', '1 Cor 2:1-16', 'Matt 5:13-20'],
    B: ['2 Kings 4:8-21(22-31)32-37', 'Ps 142', '1 Cor 9:16-23', 'Mark 1:29-39'],
    C: ['Judg 6:11-24', 'Ps 85', '1 Cor 15:1-11', 'Luke 5:1-11'] } }],
  ['epiphany6', 'epiphany6', 'The Sixth Sunday of Epiphany', 719, 'Ecclesiasticus 15:11-20', { c: {
    A: ['Ecclesiasticus 15:11-20', 'Ps 119:(1-8)9-16', '1 Cor 3:1-9', 'Matt 5:21-37'],
    B: ['2 Kings 5:1-15a', 'Ps 42:1-7(8-15)', '1 Cor 9:24-27', 'Mark 1:40-45'],
    C: ['Jer 17:5-10', 'Ps 1', '1 Cor 15:12-20', 'Luke 6:17-26'] } }],
  ['epiphany7', 'epiphany7', 'The Seventh Sunday of Epiphany', 719, 'Lev 19:1-2,9-18', { c: {
    A: ['Lev 19:1-2,9-18', 'Ps 71 or 71:11-23v', '1 Cor 3:10-23', 'Matt 5:38-48'],
    B: ['Isa 43:18-25', 'Ps 32', '2 Cor 1:18-22', 'Mark 2:1-12'],
    C: ['Gen 45:3-11,21-28', 'Ps 37:(1-7)8-17v', '1 Cor 15:35-49', 'Luke 6:27-38'] } }],
  ['epiphany8', 'epiphany8', 'The Eighth Sunday of Epiphany', 720, 'Isa 49:8-18', { c: {
    A: ['Isa 49:8-18(19-23)', 'Ps 62', '1 Cor 4:1-13', 'Matt 6:24-34'],
    B: ['Hos 2:14-23', 'Ps 103 or 103:1-14', '2 Cor 3:4-18', 'Mark 2:18-22'],
    C: ['Jer 7:1-15', 'Ps 92', '1 Cor 15:50-58', 'Luke 6:39-49'] } }],
  ['worldMission', null, 'The Second to Last Sunday of Epiphany: World Mission (sustituye a cualquier domingo de Epifanía salvo el primero y el último)', 720, 'Isa 49:1-7', { c: {
    A: ['Isa 49:1-7', 'Ps 67', 'Acts 1:1-8', 'Matt 9:35-38'],
    B: ['Gen 12:1-3', 'Ps 86:8-13', 'Rev 7:9-17', 'Matt 28:16-20'],
    C: ['Isa 61:1-4', 'Ps 96', 'Rom 10:9-17', 'John 20:19-31'] } }],
  ['transfiguration', 'transfiguration', 'The Last Sunday of Epiphany: Transfiguration', 720, 'Ex 24:12-18', { c: {
    A: ['Ex 24:12-18', 'Ps 99', 'Phil 3:7-14', 'Matt 17:1-9'],
    B: ['1 Kings 19:9-18', 'Ps 27', '2 Pet 1:13-21', 'Mark 9:2-9'],
    C: ['Ex 34:29-35', 'Ps 99', '1 Cor 12:27—13:13', 'Luke 9:28-36'] } }],
  ['ashWednesday', 'ashWednesday', 'Ash Wednesday', 720, 'Joel 2:1-2', { u: ['Joel 2:1-2, 12-17 or Isa 58:1-12', 'Ps 103 or 103:8-14', '2 Cor 5:20—6:10', 'Matt 6:1-6, 16-21'] }],
  ['lent1', 'lent1', 'The First Sunday in Lent', 720, 'Gen 2:4-9', { c: {
    A: ['Gen 2:4-9, 15-17, 25—3:7', 'Ps 51 or Ps 51:1-12v', 'Rom 5:12-21', 'Matt 4:1-11'],
    B: ['Gen 9:8-17', 'Ps 25 or 25:3-9', '1 Pet 3:18-22', 'Mark 1:9-13'],
    C: ['Deut 26:(1-4)5-11', 'Ps 91 or 91:9-16', 'Rom 10:4-13', 'Luke 4:1-13'] } }],
  ['lent2', 'lent2', 'The Second Sunday in Lent', 720, 'Gen 12:1-9', { c: {
    A: ['Gen 12:1-9', 'Ps 33:12-21v', 'Rom 4:1-5(6-12)13-17', 'John 3:1-16'],
    B: ['Gen 22:1-14', 'Ps 16 or 16:6-12v', 'Rom 8:31-39', 'Mark 8:31-38'],
    C: ['Gen 15:1-18', 'Ps 27 or 27:9-17v', 'Phil 3:17—4:1', 'Luke 13:(22-30)31-35'] } }],
  ['lent3', 'lent3', 'The Third Sunday in Lent', 720, 'Ex 17:1-7', { c: {
    A: ['Ex 17:1-7', 'Ps 95', 'Rom 1:16-32', 'John 4:5-26(27-38)39-42'],
    B: ['Ex 20:1-21', 'Ps 19:7-14', 'Rom 7:12-25', 'John 2:13-22'],
    C: ['Ex 3:1-15', 'Ps 103 or 103:1-12', '1 Cor 10:1-13', 'Luke 13:1-9(10-17)'] } }],
  ['lent4', 'lent4', 'The Fourth Sunday in Lent', 721, '1 Sam 16:1-13', { c: {
    A: ['1 Sam 16:1-13', 'Ps 23', 'Eph 5:1-14', 'John 9:1-13, 28-38 (39-41)'],
    B: ['2 Chr 36:14-23', 'Ps 122', 'Eph 2:1-10', 'John 6:1-15'],
    C: ['Josh (4:19-24) 5:1(2-8)9-12', 'Ps 34 or 34:1-8', '2 Cor 5:17-21', 'Luke 15:11-32'] } }],
  ['lent5', 'lent5', 'The Fifth Sunday in Lent (Passion Sunday)', 721, 'Ezek 37:1-14', { c: {
    A: ['Ezek 37:1-14', 'Ps 130', 'Rom 6:15-23', 'John 11:(1-17)18-44'],
    B: ['Jer 31:31-34', 'Ps 51 or 51:10-15v', 'Heb (4:14-16) 5:1-10', 'John 12:20-33(34-36)'],
    C: ['Isa 43:16-21', 'Ps 126', 'Phil 3:7-16', 'Luke 20:9-19'] } }],
  ['palmSundayPalms', null, 'Palm Sunday: Liturgy of the Palms (evangelio de la entrada + salmo)', 721, 'Matt 21:1-11', { c: {
    A: [null, 'Ps 118:19-29', null, 'Matt 21:1-11'],
    B: [null, 'Ps 118:19-29', null, 'Mark 11:1-11a'],
    C: [null, 'Ps 118:19-29', null, 'Luke 19:29-40'] } }],
  ['palmSunday', 'palmSunday', 'Palm Sunday (propio de la Eucaristía / Pasión)', 721, 'Isa 52:13', { c: {
    A: ['Isa 52:13—53:12', 'Ps 22:1-21v or Ps 22:1-11v', 'Phil 2:5-11', 'Matt (26:36-75) 27:1-54 (55-66)'],
    B: ['Isa 52:13—53:12', 'Ps 22:1-11v or Ps 22:1-21v', 'Phil 2:5-11', 'Mark (14:32-72) 15:1-39 (40-47)'],
    C: ['Isa 52:13—53:12', 'Ps 22:1-11v or Ps 22:1-21v', 'Phil 2:5-11', 'Luke (22:39-71) 23:1-49 (50-56)'] } }],
  ['holyWeekFeria_1', 'holyWeekFeria_1', 'Monday in Holy Week', 721, 'Isa 42:1-9', { u: ['Isa 42:1-9', 'Ps 36:5-10', 'Heb 11:39—12:3', 'John 12:1-11 or Mark 14:3-9'] }],
  ['holyWeekFeria_2', 'holyWeekFeria_2', 'Tuesday in Holy Week', 721, 'Isa 49:1-6', { u: ['Isa 49:1-6', 'Ps 71:1-11v', '1 Cor 1:18-31', 'John 12:37-38,42-50 or Mark 11:15-19'] }],
  ['holyWeekFeria_3', 'holyWeekFeria_3', 'Wednesday in Holy Week', 721, 'Isa 50:4-9', { u: ['Isa 50:4-9', 'Ps 69:6-14,21-22v', 'Heb 9:11-28', 'Matt 26:1-5,14-25'] }],
  ['maundyThursday', 'maundyThursday', 'Maundy Thursday', 722, 'Ex 12:1-14', { u: ['Ex 12:1-14', 'Ps 78:15-26v', '1 Cor 11:23-26(27-34)', 'John 13:1-15 or Luke 22:14-30'] }],
  ['goodFriday', 'goodFriday', 'Good Friday', 722, 'Gen 22:1-18', { u: ['Gen 22:1-18 or Isa 52:13—53:12', 'Ps 22:1-11(12-21)v or Ps 40:1-16v or Ps 69:1-22v', 'Heb 10:1-25', 'John (18:1-40) 19:1-37'] }],
  ['holySaturday', 'holySaturday', 'Holy Saturday', 722, 'Job 14:1-17', { u: ['Job 14:1-17', 'Ps 130 or 31:1-6v', '1 Pet 4:1-8', 'Matt 27:57-66 or John 19:38-42'] }],
  ['easterVigil', null, 'The Great Vigil of Easter (12 lecturas AT; el servicio sigue con Epístola y Evangelio)', 722, 'Gen 1:1—2:3', { u: [
    'Gen 1:1—2:3; Gen 3; Gen 7:1-5,11-18; 8:6-20; 9:8-13; Gen 22:1-18; Ex 14:10—15:1; Isa 4:2-6; Isa 55:1-11; Ezek 36:24-28; Ezek 37:1-14; Dan 3:1-28; Jonah 1:1—2:10; Zeph 3:12-20',
    null, 'Rom 6:3-11', 'Matt 28:1-10'] }],
  ['easterEarly', null, 'Easter Day: early service', 723, 'Use one of the Old', { u: ['Use one of the Old Testament Lessons from the Vigil', 'Ps 114', 'Rom 6:3-11', 'Matt 28:1-10'] }],
  ['easter', 'easter', 'Easter Day: principal service', 723, 'Acts 10:34-43 or', { c: {
    A: ['Acts 10:34-43 or Ex 14:10-14,21-31', 'Ps 118:14-17,22-24', 'Col 3:1-4 or Acts 10:34-43', 'John 20:1-10(11-18) or Matt 28:1-10'],
    B: ['Acts 10:34-43 or Isa 25:6-9', 'Ps 118:14-17,22-24', 'Col 3:1-4 or Acts 10:34-43', 'Mark 16:1-8'],
    C: ['Acts 10:34-43 or Isa 51:9-11', 'Ps 118:14-17,22-24', 'Col 3:1-4 or Acts 10:34-43', 'Luke 24:1-12'] } }],
  ['easterEvening', null, 'Easter Day: evening service', 723, 'Dan 12:1-3', { u: ['Dan 12:1-3', 'Ps 136', '1 Cor 5:6-8', 'Luke 24:13-35'] }],
  ['easterMon', null, 'Monday of Easter Week', 723, 'Acts 2:14,22-32', { u: ['Acts 2:14,22-32', 'Ps 16', null, 'Matt 28:9-15'] }],
  ['easterTue', null, 'Tuesday of Easter Week', 723, 'Acts 2:14,36-41', { u: ['Acts 2:14,36-41', 'Ps 33:17-21v', null, 'John 20:11-18'] }],
  ['easterWed', null, 'Wednesday of Easter Week', 723, 'Acts 3:1-10', { u: ['Acts 3:1-10', 'Ps 105:1-8v', null, 'Luke 24:13-35'] }],
  ['easterThu', null, 'Thursday of Easter Week', 723, 'Acts 3:11-26', { u: ['Acts 3:11-26', 'Ps 8', null, 'Luke 24:36-49'] }],
  ['easterFri', null, 'Friday of Easter Week', 723, '1 Pet 1:3-9', { u: ['1 Pet 1:3-9', 'Ps 116:1-9v', null, 'John 21:1-14'] }],
  ['easterSat', null, 'Saturday of Easter Week', 723, 'Acts 4:1-22', { u: ['Acts 4:1-22', 'Ps 118:14-18', null, 'Mark 16:9-20'] }],
  ['easter2', 'easter2', 'The Second Sunday of Easter', 724, 'Acts 2:14a,22-32', { c: {
    A: ['Acts 2:14a,22-32 or Gen 8:6-16, 9:8-16', 'Ps 111', '1 Pet 1:3-9', 'John 20:19-31'],
    B: ['Acts 3:12a, 13-15,17-26 or Isa 26:1-9,19', 'Ps 111', '1 John 5:1-5', 'John 20:19-31'],
    C: ['Acts 5:12a, 17-22, 25-29 or Job 42:1-6', 'Ps 111', 'Rev 1:(1-8)9-19', 'John 20:19-31'] } }],
  ['easter3', 'easter3', 'The Third Sunday of Easter', 724, 'Acts 2:14a,36-47', { c: {
    A: ['Acts 2:14a,36-47 or Isa 43:1-12', 'Ps 116:11-16v', '1 Pet 1:13-25', 'Luke 24:13-35'],
    B: ['Acts 4:5-14 or Mic 4:1-5', 'Ps 98 or 98:1-5', '1 John 1:1-2:2', 'Luke 24:36-49'],
    C: ['Acts 9:1-19a or Jer 32:36-41', 'Ps 33 or 33:1-11v', 'Rev 5:(1-5)6-14', 'John 21:1-14'] } }],
  ['easter4', 'easter4', 'The Fourth Sunday of Easter (Good Shepherd)', 724, 'Acts 6:1-9', { c: {
    A: ['Acts 6:1-9, 7:2a,51-60 or Neh 9:(1-3)6-15', 'Ps 23', '1 Pet 2:13-25', 'John 10:1-10'],
    B: ['Acts 4:(23-31)32-37 or Ezek 34:1-10', 'Ps 23', '1 John 3:1-10', 'John 10:11-16'],
    C: ['Acts 13:14b-16, 26-39 or Num 27:12-23', 'Ps 100', 'Rev 7:9-17', 'John 10:22-30'] } }],
  ['easter5', 'easter5', 'The Fifth Sunday of Easter', 724, 'Acts 17:1-15', { c: {
    A: ['Acts 17:1-15 or Deut 6:20-25', 'Ps 66:1-11v or 66:1-8v', '1 Pet 2:1-12', 'John 14:1-14'],
    B: ['Acts 8:26-40 or Deut 4:32-40', 'Ps 66:1-11v or 66:1-8v', '1 John 3:(11-17)18-24', 'John 14:15-21'],
    C: ['Acts 13:44-52 or Lev 19:1-2,9-18', 'Ps 145 or 145:1-9v', 'Rev 19:1-9', 'John 13:31-35'] } }],
  ['easter6', 'easter6', 'The Sixth Sunday of Easter (Rogation Sunday)', 724, 'Acts 17:(16-21)', { c: {
    A: ['Acts 17:(16-21)22-34 or Isa 41:17-20', 'Ps 148 or 148:7-14', '1 Pet 3:8-18', 'John 15:1-11'],
    B: ['Acts 11:19-30 or Isa 45:11-13,18-19(20-25)', 'Ps 33 or 33:1-8,18-22v', '1 John 4:7-21', 'John 15:9-17'],
    C: ['Acts 14:8-18 or Joel 2:21-27', 'Ps 67', 'Rev 21:1-4,22-22:5', 'John 14:21-29'] } }],
  ['ascension', 'ascension', 'Ascension Day', 724, 'Acts 1:1-11', { u: ['Acts 1:1-11', 'Ps 47 or 110:1-5', 'Eph 1:15-23', 'Luke 24:44-53 or Mark 16:9-20'] }],
  ['easter7', 'easter7', 'The Sunday after Ascension Day', 724, 'Acts 1:(1-5)6-14', { c: {
    A: ['Acts 1:(1-5)6-14 or Ezek 39:21-29', 'Ps 68:1-20 or 47', '1 Pet 4:12-19', 'John 17:1-11'],
    B: ['Acts 1:15-26 or Ex 28:1-4,9-10,29-30', 'Ps 68:1-20 or 47', '1 John 5:6-15', 'John 17:11b-19'],
    C: ['Acts 16:16-34 or 1 Sam 12:19-24', 'Ps 68:1-20 or 47', 'Rev 22:10-21', 'John 17:20-26'] } }],
  ['pentecost', 'pentecost', 'The Day of Pentecost', 725, 'Gen 11:1-9', { u: ['Gen 11:1-9 or Acts 2:1-11(12-21)', 'Ps 104:24-35v', 'Acts 2:1-11(12-21) or 1 Cor 12:4-13', 'John 14:8-17'] }],
  ['trinitySunday', 'trinitySunday', 'Trinity Sunday', 725, 'Gen 1:1—2:3', { c: {
    A: ['Gen 1:1—2:3', 'Ps 150', '2 Cor 13:5-14', 'Matt 28:16-20'],
    B: ['Ex 3:1-6', 'Ps 93', 'Rom 8:12-17', 'John 3:1-16'],
    C: ['Isa 6:1-7', 'Ps 29', 'Rev 4:1-11', 'John 16:(5-11)12-15'] } }],
];

// ---------- normalizacion para busqueda en el markdown ----------
const mdRaw = fs.readFileSync(MD, 'utf8').split(/\r?\n/);
const normMd = s => s.replace(/\|/g, ' ').replace(/[—–]/g, '-').replace(/(\d)v\b/g, '$1').replace(/\s*([,:\-()])\s*/g, '$1').replace(/\s+/g, ' ').trim().toLowerCase();
const mdN = mdRaw.map(normMd);
const LO = 20560, HI = 21700;

// anchors secuenciales
const anchors = [];
let prev = LO;
for (const row of D) {
  const a = normMd(row[4]);
  let found = null;
  for (let i = prev; i < HI; i++) if (mdN[i].includes(a)) { found = i; break; }
  anchors.push(found);
  if (found !== null) prev = found + 1;
}
const out = { meta: {
  generado: '2026-10-31',
  fuente: 'BCP 2019 (ACNA), tabla Sunday, Holy Day, and Commemoration Lectionary, libro pp. 717-725; markdown BCP2019-en.md (lineas 1-based) + PDF "ACNA BCP - 2019.pdf" (pagina PDF = pagina del libro + 8)',
  metodo: 'Transcripcion por columnas del PDF (coordenadas x/y) porque el markdown intercala filas; cada valor se busca despues en el markdown dentro de la ventana del dia. Valor sin linea => "pdf-only" (el markdown lo trae fragmentado/desplazado).',
  notacion: 'Se conserva la notacion del libro: v = numeracion del Nuevo Salterio Coverdale; (..) = versiculos opcionales; "A or B" = el libro ofrece dos lecturas alternativas; una sola cifra "Ps 80 or 80:1-7v" = salmo completo o la porcion indicada.',
  anchors_sin_localizar: [] }, days: {} };

D.forEach((row, idx) => {
  const [key, appKey, label, page, anchor, spec] = row;
  const a = anchors[idx];
  if (a === null) out.meta.anchors_sin_localizar.push(key);
  const lo = a === null ? null : Math.max(LO, a - 4);
  const nextA = anchors.slice(idx + 1).find(x => x !== null);
  const hi = nextA === undefined ? a + 40 : nextA + 1;
  const cyc = {};
  const lines = {};
  const pdfOnly = [];
  const fields = ['first', 'psalm', 'second', 'gospel'];
  const per = spec.u ? { A: spec.u, B: spec.u, C: spec.u } : spec.c;
  for (const cy of ['A', 'B', 'C']) {
    cyc[cy] = {}; lines[cy] = {};
    fields.forEach((f, fi) => {
      const raw = per[cy][fi];
      cyc[cy][f] = raw;
      if (raw === null || raw === undefined) { lines[cy][f] = null; return; }
      // cada opcion ("A or B") se busca por separado; la linea es la de la primera opcion localizada
      const opts = raw.split(/\s+or\s+/).map(s => s.replace(/^or\s+/, ''));
      let ln = null;
      for (const o of opts) {
        const n = normMd(o.replace(/^(Ps)\s+/, 'Ps '));
        if (n.length < 3) continue;
        const nTrim = n.replace(/^ps /, '');
        // 1a pasada: desde el ancla del dia hacia delante; 2a pasada: las 4 lineas previas (el markdown a veces
        // imprime una celda antes de su fila)
        const start = a === null ? LO : a;
        for (let i = start; i < hi && i < HI; i++) if (mdN[i].includes(n)) { ln = i + 1; break; }
        if (ln === null) for (let i = (lo === null ? LO : lo); i < start; i++) if (mdN[i].includes(n)) { ln = i + 1; break; }
        if (ln !== null) break;
      }
      lines[cy][f] = ln;
      if (ln === null && !String(raw).startsWith('Use one') && !String(raw).includes(';')) pdfOnly.push(`${cy}.${f}`);
    });
  }
  out.days[key] = {
    appKey, label, libroPagina: page, pdfPagina: page + 8,
    mdLineas: lo === null ? null : [lo + 1, Math.min(hi, HI)],
    cicloUnico: !!spec.u,
    ...cyc,
    lineas: lines,
    pdfOnly: Array.from(new Set(pdfOnly)),
  };
});
// Lecturas que el libro repite en las "special liturgies" (md); se transcriben con su linea para cotejo cruzado.
const ESPECIAL = {
  ashWednesday: [[15455, 'joel 2:1-2, 12-17 or isaiah 58:1-12'], [15456, 'psalm 103 or 103:8-14'], [15457, '2 corinthians 5:20—6:10'], [15458, 'matthew 6:1-6, 16-21']],
  palmSundayPalms: [[15731, 'Year A matthew 21:1-11'], [15732, 'Year B mark 11:1-11a'], [15733, 'Year C luke 19:28-40  (NOTA: la tabla del leccionario dice Luke 19:29-40)'], [15758, 'Psalm 118:19-29 (procesión)']],
  palmSunday: [[15784, 'isaiah 52:13—53:12'], [15785, 'psalm 22:1-22v, 22:1-11v or 31:10-18v  (NOTA: la tabla dice Ps 22:1-21v or 22:1-11v; aquí además aparece Sal 31:10-18v)'], [15786, 'philippians 2:5-11'], [15791, 'Year A matthew (26:36-75) 27:1-54 (55-66)'], [15792, 'Year B mark (14:32-72) 15:1-39 (40-47)'], [15793, 'Year C luke (22:39-71) 23:1-49 (50-56)']],
  maundyThursday: [[15857, 'exodus 12:1-14'], [15858, 'psalm 78:15-26v'], [15859, '1 corinthians 11:23-26(27-34)'], [15860, 'john 13:1-15 or luke 22:14-30']],
  goodFriday: [[15948, 'genesis 22:1-18 or isaiah 52:13—53:12'], [15949, 'psalm 22:1-11 (12-21)v or 40:1-16v or 69:1-22v'], [15950, 'hebrews 10:1-25'], [15956, 'john 18:1—19:37 or 19:1-37']],
  holySaturday: [[16298, 'job 14:1-14  (NOTA: la tabla dice Job 14:1-17)'], [16299, 'psalm 130 or 88 or 31:1-6v  (NOTA: la tabla dice Ps 130 or 31:1-6v; aquí añade Sal 88)'], [16300, '1 peter 4:1-8'], [16301, 'matthew 27:57-66 or john 19:38-42']],
  easterVigil: [[16494, 'genesis 1:1—2:3 / psalm 104:1-13 (14-24)v or Supplemental Canticle 10'], [16503, 'genesis 3 / psalm 32'], [16515, 'genesis 7:1-5, 11-18; 8:6-20; 9:8-13 / psalm 36 or 46'], [16525, 'genesis 22:1-18 / psalm 16'], [16537, 'exodus 14:10—15:1 / Supplemental Canticle 5'], [16548, 'isaiah 4:2-6 / psalm 122'], [16557, 'isaiah 55:1-11 / Supplemental Canticle 8 or psalm 42:1-7'], [16569, 'ezekiel 36:24-28 / psalm 42:1-7 or Canticle 8'], [16579, 'ezekiel 37:1-14 / psalm 30 or 126'], [16589, 'daniel 3:1-28 / Canticle 10 or Benedictus es'], [16599, 'jonah 1:1—2:10 / psalm 130'], [16608, 'zephaniah 3:12-20 / psalm 98'], [16669, 'romans 6:3-11 (Psalm 114 or other)'], [16678, 'matthew 28:1-10']],
};
for (const [k, arr] of Object.entries(ESPECIAL)) if (out.days[k]) out.days[k].especialesMd = arr.map(([l, t]) => ({ linea: l, texto: t }));
fs.writeFileSync(OUT, JSON.stringify(out, null, 1), 'utf8');
console.log('dias:', Object.keys(out.days).length, 'anchors sin localizar:', out.meta.anchors_sin_localizar);
let tot = 0, po = 0;
for (const [k, d] of Object.entries(out.days)) for (const cy of ['A', 'B', 'C']) for (const f of ['first', 'psalm', 'second', 'gospel']) if (d[cy][f] !== null) { tot++; if (d.lineas[cy][f] === null) po++; }
console.log('valores (dia x ciclo x campo no nulos):', tot, ' sin linea en md (pdf-only):', po);
