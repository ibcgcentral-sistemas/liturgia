/**
 * Test script para verificar la lógica del calendario litúrgico y lectiones
 */

// ════════════════════════════════════════════════════════════════════════════
// CARGAR MÓDULOS
// ════════════════════════════════════════════════════════════════════════════
const fs = require('fs');

// Leer y evaluar los módulos
// Nota: `const` dentro de eval() queda confinado al scope del eval y no se filtra
// al scope del módulo, por lo que hay que capturar el valor explícitamente.
const LiturgicalCalendar = eval(fs.readFileSync('./js/calendar.js', 'utf8') + '\nLiturgicalCalendar');
const Lectionary = eval(fs.readFileSync('./js/lectionary.js', 'utf8') + '\nLectionary');
const Propers = eval(fs.readFileSync('./js/propers.js', 'utf8') + '\nPropers');

// ════════════════════════════════════════════════════════════════════════════
// PRUEBAS
// ════════════════════════════════════════════════════════════════════════════

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║          PRUEBAS DE LÓGICA — MISAL ANGLICANO                   ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// ──────────────────────────────────────────────────────────────────────────────
// TEST 1: Cálculo de Pascua
// ──────────────────────────────────────────────────────────────────────────────
console.log('✠ TEST 1: Cálculo de Pascua (Meeus/Jones/Butcher)');
console.log('─'.repeat(60));

const easterTests = [
  { year: 2025, expected: '2025-04-20', desc: 'Pascua 2025' },
  { year: 2026, expected: '2026-04-05', desc: 'Pascua 2026' },
  { year: 2027, expected: '2027-03-28', desc: 'Pascua 2027' },
];

easterTests.forEach(test => {
  const date = LiturgicalCalendar.getDay(new Date(test.expected + 'T12:00:00'));
  const isEaster = date.key && (date.key === 'easter' || date.key.includes('easter'));
  console.log(`  ${test.desc}: ${test.expected} → ${isEaster ? '✓ CORRECTO' : '✗ ERROR'}`);
});

// ──────────────────────────────────────────────────────────────────────────────
// TEST 2: Ciclos dominicales (A/B/C)
// ──────────────────────────────────────────────────────────────────────────────
console.log('\n✠ TEST 2: Ciclos Dominicales (A/B/C)');
console.log('─'.repeat(60));

const cycleTests = [
  { date: '2025-11-30', cycle: 'A', desc: 'Primer Domingo Adviento 2025' },
  { date: '2026-11-29', cycle: 'B', desc: 'Primer Domingo Adviento 2026' },
  { date: '2027-11-28', cycle: 'C', desc: 'Primer Domingo Adviento 2027' },
];

cycleTests.forEach(test => {
  const date = new Date(test.date + 'T12:00:00');
  const dayInfo = LiturgicalCalendar.getDay(date);
  const correct = dayInfo.cycle === test.cycle;
  console.log(`  ${test.desc}: Ciclo ${dayInfo.cycle} (esperado ${test.cycle}) → ${correct ? '✓' : '✗'}`);
});

// ──────────────────────────────────────────────────────────────────────────────
// TEST 3: Ciclos feriales (I/II)
// ──────────────────────────────────────────────────────────────────────────────
console.log('\n✠ TEST 3: Ciclos Feriales (I/II)');
console.log('─'.repeat(60));

const weekcycleTests = [
  // El ciclo se designa por el año civil en que TERMINA el año litúrgico.
  { date: '2024-11-15', wcycle: 'II', desc: 'nov 2024 (año litúrgico Adv 2023–nov 2024, termina en 2024 par) → Ciclo II' },
  { date: '2025-11-15', wcycle: 'I',  desc: 'nov 2025 (año litúrgico Adv 2024–nov 2025, termina en 2025 impar) → Ciclo I' },
  { date: '2025-01-15', wcycle: 'I',  desc: 'ene 2025 (mismo año litúrgico que nov 2025) → Ciclo I' },
  { date: '2026-01-15', wcycle: 'II', desc: 'ene 2026 (año litúrgico Adv 2025–nov 2026, termina en 2026 par) → Ciclo II' },
];

weekcycleTests.forEach(test => {
  const date = new Date(test.date + 'T12:00:00');
  const dayInfo = LiturgicalCalendar.getDay(date);
  const correct = dayInfo.wcycle === test.wcycle;
  console.log(`  ${test.desc}: Ciclo ${dayInfo.wcycle} (esperado ${test.wcycle}) → ${correct ? '✓' : '✗'}`);
});

// ──────────────────────────────────────────────────────────────────────────────
// TEST 4: Temporadas litúrgicas
// ──────────────────────────────────────────────────────────────────────────────
console.log('\n✠ TEST 4: Temporadas Litúrgicas');
console.log('─'.repeat(60));

const seasonTests = [
  { date: '2025-11-30', season: 'Adviento', desc: '1º Dom Adviento' },
  { date: '2025-12-25', season: 'Navidad', desc: 'Navidad' },
  { date: '2026-01-06', season: 'Epifanía', desc: 'Epifanía' },
  { date: '2026-02-18', season: 'Cuaresma', desc: 'Miércoles de Ceniza' },
  { date: '2026-03-29', season: 'Semana Santa', desc: 'Domingo de Ramos' },
  { date: '2026-04-05', season: 'Pascua', desc: 'Domingo de Pascua' },
];

const seasonMap = {
  'advent': 'Adviento', 'christmas': 'Navidad', 'epiphany': 'Epifanía',
  'preLent': 'Pre-Cuaresma', 'lent': 'Cuaresma', 'triduum': 'Semana Santa',
  'easter': 'Pascua', 'pentecost': 'Pentecostés', 'trinity': 'Trinidad',
  'ordinary': 'Tiempo Ordinario'
};

seasonTests.forEach(test => {
  const date = new Date(test.date + 'T12:00:00');
  const dayInfo = LiturgicalCalendar.getDay(date);
  const key = dayInfo.key;

  // Determinar temporada
  let season = 'unknown';
  if (key && key.startsWith('advent')) season = 'advent';
  else if (key === 'christmas' || key === 'christmasSunday') season = 'christmas';
  else if (key === 'epiphany' || key && key.startsWith('epi')) season = 'epiphany';
  else if (key === 'ashWednesday' || key && key.startsWith('lent')) season = 'lent';
  else if (key === 'goodFriday' || key === 'palmSunday') season = 'triduum';
  else if (key && key.startsWith('easter')) season = 'easter';
  else if (key === 'pentecost') season = 'pentecost';

  console.log(`  ${test.desc}: ${dayInfo.name} (${seasonMap[season] || season})`);
});

// ──────────────────────────────────────────────────────────────────────────────
// TEST 5: Lecturas dominicales
// ──────────────────────────────────────────────────────────────────────────────
console.log('\n✠ TEST 5: Lecturas Dominicales');
console.log('─'.repeat(60));

const readingTests = [
  { date: '2025-12-07', cycle: 'A', expect: 'Matthew 24:36-44' },
  { date: '2026-12-06', cycle: 'B', expect: 'Mark 13:24-37' },
];

readingTests.forEach(test => {
  const date = new Date(test.date + 'T12:00:00');
  const dayInfo = LiturgicalCalendar.getDay(date);
  const readings = Lectionary.getSundayReadings('advent1', test.cycle);
  const correct = readings && readings.gospel === test.expect;
  console.log(`  ${test.date} (Ciclo ${test.cycle}): ${readings ? readings.gospel : 'NO ENCONTRADO'} → ${correct ? '✓' : '✗'}`);
});

// ──────────────────────────────────────────────────────────────────────────────
// TEST 6: Colores litúrgicos
// ──────────────────────────────────────────────────────────────────────────────
console.log('\n✠ TEST 6: Colores Litúrgicos');
console.log('─'.repeat(60));

const colorTests = [
  { date: '2025-11-30', color: 'violet', season: 'Adviento' },
  { date: '2025-12-25', color: 'white', season: 'Navidad' },
  { date: '2026-02-18', color: 'violet', season: 'Miércoles de Ceniza' },
  { date: '2026-04-05', color: 'white', season: 'Domingo de Pascua' },
];

colorTests.forEach(test => {
  const date = new Date(test.date + 'T12:00:00');
  const dayInfo = LiturgicalCalendar.getDay(date);
  const correct = dayInfo.color === test.color;
  console.log(`  ${test.season}: ${dayInfo.color} (esperado ${test.color}) → ${correct ? '✓' : '✗'}`);
});

console.log('\n' + '═'.repeat(60));
console.log('RESUMEN: Verifica que todos los tests muestren ✓\n');
