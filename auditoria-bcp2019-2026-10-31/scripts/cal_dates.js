// Auditoría calendario — verificación de fechas clave 2026-2027 contra el libro (esperado derivado a mano / por reglas del libro). SOLO LECTURA.
const H = require('../harness.js');
const Cal = H.load().BCPCalendar;
const pad = n => String(n).padStart(2, '0');
const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
// [fecha, clave esperada, rango esperado, ciclo esperado, comentario/regla del libro]
const E = [
  // ── 2026 ──
  ['2026-01-01', '01-01', 'holyDay', 'A', 'Circuncisión y Santo Nombre, 1 ene (l.19345)'],
  ['2026-01-04', 'christmasSunday2', 'sunday', 'A', '2.º domingo de Navidad (l.16856)'],
  ['2026-01-06', 'epiphany', 'principal', 'A', 'Epifanía, fiesta principal (l.19332)'],
  ['2026-01-11', 'epiphany1', 'sunday', 'A', '1.er domingo de Epifanía = Bautismo (l.16877-16878)'],
  ['2026-01-18', 'epiphany2', 'sunday', 'A', 'Domingo; Confesión de Pedro 18-ene cae en domingo (l.19363: observar o trasladar)'],
  ['2026-01-25', 'epiphany3', 'sunday', 'A', 'Domingo; Conversión de Pablo cae en domingo'],
  ['2026-02-02', '02-02', 'holyDay', 'A', 'Presentación'],
  ['2026-02-15', 'transfiguration', 'sunday', 'A', 'Último domingo de Epifanía (l.16965)'],
  ['2026-02-18', 'ashWednesday', 'holyDay', 'A', 'Miércoles de Ceniza (tabla p.714: Pascua 5 abr -> 18 feb)'],
  ['2026-02-22', 'lent1', 'sunday', 'A', ''],
  ['2026-03-01', 'lent2', 'sunday', 'A', ''],
  ['2026-03-08', 'lent3', 'sunday', 'A', ''],
  ['2026-03-15', 'lent4', 'sunday', 'A', ''],
  ['2026-03-19', '03-19', 'holyDay', 'A', 'José (jueves, 4.ª semana... semana de Lent 4)'],
  ['2026-03-22', 'lent5', 'sunday', 'A', 'Domingo de Pasión (l.17025)'],
  ['2026-03-25', '03-25', 'holyDay', 'A', 'Anunciación: miércoles antes de Ramos (29 mar), sin choque'],
  ['2026-03-29', 'palmSunday', 'sunday', 'A', ''],
  ['2026-03-30', 'holyWeekFeria_1', 'feria', 'A', 'Lunes Santo'],
  ['2026-04-02', 'maundyThursday', 'holyDay', 'A', ''],
  ['2026-04-03', 'goodFriday', 'holyDay', 'A', ''],
  ['2026-04-04', 'holySaturday', 'holyDay', 'A', ''],
  ['2026-04-05', 'easter', 'principal', 'A', 'Pascua (tabla p.713: 2026 = Apr 5)'],
  ['2026-04-06', 'easterFeria1_1', 'feria', 'A', 'Lunes de Pascua'],
  ['2026-04-12', 'easter2', 'sunday', 'A', ''],
  ['2026-04-25', '04-25', 'holyDay', 'A', 'San Marcos (sábado, sem. de Pascua 3)'],
  ['2026-04-26', 'easter4', 'sunday', 'A', 'Buen Pastor (l.17196-17197)'],
  ['2026-05-01', '05-01', 'holyDay', 'A', 'Felipe y Santiago (viernes)'],
  ['2026-05-10', 'easter6', 'sunday', 'A', 'Rogation (l.17214-17215)'],
  ['2026-05-14', 'ascension', 'principal', 'A', 'Ascensión (tabla p.714: Pascua 5 abr -> May 14)'],
  ['2026-05-17', 'easter7', 'sunday', 'A', 'Domingo después de la Ascensión'],
  ['2026-05-24', 'pentecost', 'principal', 'A', 'Pentecostés (tabla: May 24)'],
  ['2026-05-31', 'trinitySunday', 'principal', 'A', 'Trinidad prevalece sobre Visitación (31 may)'],
  ['2026-06-07', 'proper5', 'sunday', 'A', 'Propio 5 = 5-11 jun (l.17316-17317; tabla: Proper 5)'],
  ['2026-06-24', '06-24', 'holyDay', 'A', 'Natividad de Juan Bautista'],
  ['2026-06-29', '06-29', 'holyDay', 'A', 'Pedro y Pablo'],
  ['2026-07-25', '07-25', 'holyDay', 'A', 'Santiago el Mayor (sábado)'],
  ['2026-08-06', '08-06', 'holyDay', 'A', 'Transfiguración (jueves)'],
  ['2026-09-14', '09-14', 'holyDay', 'A', 'Santa Cruz (lunes)'],
  ['2026-09-29', '09-29', 'holyDay', 'A', 'San Miguel (martes)'],
  ['2026-10-18', 'proper24', 'sunday', 'A', 'Domingo; San Lucas 18-oct en domingo (observar o trasladar)'],
  ['2026-10-23', '10-23', 'holyDay', 'A', 'Santiago de Jerusalén (viernes)'],
  ['2026-10-28', '10-28', 'holyDay', 'A', 'Simón y Judas (miércoles)'],
  ['2026-11-01', '11-01', 'principal', 'A', 'TODOS LOS SANTOS: fiesta principal "takes precedence over any other day" (l.19330-19335), cae en DOMINGO'],
  ['2026-11-22', 'proper29', 'sunday', 'A', 'Cristo Rey = Propio 29, 20-26 nov (l.17518-17520)'],
  ['2026-11-29', 'advent1', 'sunday', 'B', 'Adviento 2026: 2026 mod 3 = 1 -> Año B (l.20550-20552); tabla: Pascua 5 abr -> Nov 29'],
  ['2026-11-30', '11-30', 'holyDay', 'B', 'San Andrés (lunes)'],
  ['2026-12-06', 'advent2', 'sunday', 'B', ''],
  ['2026-12-13', 'advent3', 'sunday', 'B', ''],
  ['2026-12-20', 'advent4', 'sunday', 'B', ''],
  ['2026-12-21', '12-21', 'holyDay', 'B', 'Santo Tomás (lunes)'],
  ['2026-12-25', 'christmas', 'principal', 'B', ''],
  ['2026-12-26', '12-26', 'holyDay', 'B', 'San Esteban (sábado)'],
  ['2026-12-27', 'christmasSunday', 'sunday', 'B', '1.er domingo de Navidad; San Juan cae en domingo (observar o trasladar)'],
  ['2026-12-28', '12-28', 'holyDay', 'B', 'Inocentes (lunes)'],
  // ── 2027 ──
  ['2027-01-01', '01-01', 'holyDay', 'B', ''],
  ['2027-01-03', 'christmasSunday2', 'sunday', 'B', '2.º domingo de Navidad'],
  ['2027-01-06', 'epiphany', 'principal', 'B', ''],
  ['2027-01-10', 'epiphany1', 'sunday', 'B', 'Bautismo del Señor'],
  ['2027-02-07', 'transfiguration', 'sunday', 'B', 'Tabla: Pascua 28 mar -> 5 domingos tras Epifanía'],
  ['2027-02-10', 'ashWednesday', 'holyDay', 'B', 'Tabla p.714: Pascua Mar 28 -> Feb 10'],
  ['2027-02-14', 'lent1', 'sunday', 'B', ''],
  ['2027-03-19', '03-19', 'holyDay', 'B', 'José (viernes antes de Ramos)'],
  ['2027-03-21', 'palmSunday', 'sunday', 'B', ''],
  ['2027-03-25', 'maundyThursday', 'holyDay', 'B', 'Jueves Santo; la Anunciación (25 mar) no puede reemplazarlo (l.19368-19369)'],
  ['2027-03-26', 'goodFriday', 'holyDay', 'B', ''],
  ['2027-03-28', 'easter', 'principal', 'B', 'Tabla p.713: 2027 = Mar 28'],
  ['2027-04-04', 'easter2', 'sunday', 'B', ''],
  ['2027-04-05', '03-25', 'holyDay', 'B', 'Anunciación trasladada (destino NO regulado por el libro)'],
  ['2027-04-25', 'easter5', 'sunday', 'B', 'San Marcos 25-abr en domingo de Pascua (l.19363: Pascua excluida)'],
  ['2027-05-06', 'ascension', 'principal', 'B', 'Tabla: Mar 28 -> May 6'],
  ['2027-05-16', 'pentecost', 'principal', 'B', ''],
  ['2027-05-23', 'trinitySunday', 'principal', 'B', ''],
  ['2027-05-30', 'proper4', 'sunday', 'B', 'Tabla: Pascua Mar 28 -> Proper 4 (29 may-4 jun)'],
  ['2027-05-31', '05-31', 'holyDay', 'B', 'Visitación (lunes)'],
  ['2027-11-01', '11-01', 'principal', 'B', 'Todos los Santos (lunes)'],
  ['2027-11-21', 'proper29', 'sunday', 'B', 'Cristo Rey (21 nov)'],
  ['2027-11-28', 'advent1', 'sunday', 'C', 'Adviento 2027: 2027 mod 3 = 2 -> Año C; tabla: Pascua Mar 28 -> Nov 28'],
  ['2027-12-25', 'christmas', 'principal', 'C', ''],
  ['2027-12-26', 'christmasSunday', 'sunday', 'C', '1.er domingo de Navidad; San Esteban cae en domingo (observar o trasladar)'],
];
let ok = 0, bad = 0;
const rows = [];
for (const [ds, k, rk, cy, note] of E) {
  const [y, m, d] = ds.split('-').map(Number);
  const dt = new Date(y, m - 1, d, 12);
  const r = Cal.getDay(dt);
  const good = r.key === k && r.rank === rk && r.cycle === cy;
  good ? ok++ : bad++;
  rows.push(`${good ? 'OK  ' : 'DIFF'} ${ds} ${DOW[dt.getDay()]} esp=${k}/${rk}/${cy} app=${r.key}/${r.rank}/${r.cycle} color=${r.color} season=${r.season} "${r.nameEs}" ${good ? '' : '<<<< ' + note}`);
}
console.log(rows.join('\n'));
console.log(`\nFechas verificadas: ${E.length}; coinciden: ${ok}; difieren: ${bad}`);
