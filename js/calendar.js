/**
 * calendar.js — Liturgical Calendar Engine
 * Anglo-Catholic usage, Anglican Missal tradition
 * Covers: Advent, Christmas, Epiphany, Pre-Lent, Lent, Holy Week,
 *         Easter Triduum, Eastertide, Ascension, Pentecost, Trinity, Ordinary Time
 */

const LiturgicalCalendar = (() => {

  // ── EASTER CALCULATION (Meeus/Jones/Butcher) ──────────────────────────────
  function computeEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  // ── HELPER: date difference in days ─────────────────────────────────────
  function diffDays(d1, d2) {
    return Math.round((d2 - d1) / 86400000);
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
  }

  // ── FIRST SUNDAY OF ADVENT ───────────────────────────────────────────────
  function getAdvent1(year) {
    // 4th Sunday before Christmas (Dec 25)
    const christmas = new Date(year, 11, 25);
    const dow = christmas.getDay(); // 0=Sun
    // Days back to nearest Sunday, then 3 more weeks
    const daysBack = (dow === 0) ? 28 : dow + 21;
    const d = new Date(christmas);
    d.setDate(d.getDate() - daysBack);
    return d;
  }

  // ── LITURGICAL YEAR (begins Advent 1) ────────────────────────────────────
  // Returns the calendar year in which Advent 1 falls for this liturgical year
  function getLiturgicalYearStart(date) {
    const y = date.getFullYear();
    const advent1 = getAdvent1(y);
    return (date >= advent1) ? y : y - 1;
  }

  // ── SUNDAY CYCLE A / B / C ───────────────────────────────────────────────
  // Liturgical year 2025-2026 → Year A, 2026-2027 → Year B, 2027-2028 → Year C
  function getSundayCycleFixed(date) {
    const start = getLiturgicalYearStart(date);
    const r = ((start - 2025) % 3 + 3) % 3;
    return ['A', 'B', 'C'][r];
  }

  // ── WEEKDAY CYCLE I / II ─────────────────────────────────────────────────
  // El ciclo ferial se designa por el año civil en que TERMINA el año litúrgico
  // (el año en que cae la mayor parte de él), no por el año en que comienza:
  // año civil final impar = Ciclo I, par = Ciclo II.
  // Ej.: Adviento 2024 – noviembre 2025 → termina en 2025 (impar) → Ciclo I.
  //      Adviento 2023 – noviembre 2024 → termina en 2024 (par)   → Ciclo II.
  function getWeekdayCycle(date) {
    const start = getLiturgicalYearStart(date);   // año civil del Adviento I
    const end   = start + 1;                      // año civil en que termina
    return (end % 2 !== 0) ? 'I' : 'II';
  }

  // ── MOVEABLE FEAST DATES FOR A GIVEN YEAR ────────────────────────────────
  function getFeastDates(year) {
    const easter        = computeEaster(year);
    const easterMs      = easter.getTime();
    const add = n => new Date(easterMs + n * 86400000);

    return {
      advent1:          getAdvent1(year),
      advent2:          new Date(getAdvent1(year).getTime() + 7*86400000),
      advent3:          new Date(getAdvent1(year).getTime() + 14*86400000),
      advent4:          new Date(getAdvent1(year).getTime() + 21*86400000),
      christmas:        new Date(year, 11, 25),
      epiphany:         new Date(year, 0, 6),
      baptismOfLord:    getBaptismOfLord(year),
      septuagesima:     add(-63),
      sexagesima:       add(-56),
      quinquagesima:    add(-49),
      shrovetuesday:    add(-47),
      ashWednesday:     add(-46),
      lent1:            add(-42),
      lent2:            add(-35),
      lent3:            add(-28),
      lent4:            add(-21),
      lent5:            add(-14),   // Passion Sunday
      palmSunday:       add(-7),
      mondayHolyWeek:   add(-6),
      tuesdayHolyWeek:  add(-5),
      wednesdayHolyWeek:add(-4),
      maundyThursday:   add(-3),
      goodFriday:       add(-2),
      holySaturday:     add(-1),
      easter:           easter,
      easter2:          add(7),
      easter3:          add(14),
      easter4:          add(21),
      easter5:          add(28),
      easter6:          add(35),
      ascension:        add(39),
      easter7:          add(42),
      pentecost:        add(49),
      trinitySunday:    add(56),
      corpusChristi:    add(60),
      sacredHeart:      add(68),
    };
  }

  function getBaptismOfLord(year) {
    // First Sunday after Epiphany (Jan 6)
    const epiphany = new Date(year, 0, 6);
    const dow = epiphany.getDay();
    const daysToSun = dow === 0 ? 7 : 7 - dow;
    const d = new Date(epiphany);
    d.setDate(d.getDate() + daysToSun);
    return d;
  }

  // ── FIXED FEAST DAYS ─────────────────────────────────────────────────────
  const FIXED_FEASTS = {
    '01-01': { name: 'The Circumcision of Christ', nameEs: 'La Circuncisión del Señor', color: 'white', rank: 'doubleFirstClass', omitGloria: false },
    '01-06': { name: 'The Epiphany of Our Lord', nameEs: 'La Epifanía del Señor', color: 'white', rank: 'doubleFirstClass', omitGloria: false },
    '02-02': { name: 'The Purification of the B.V.M. (Candlemas)', nameEs: 'La Purificación de la B.V.M. (Candelaria)', color: 'white', rank: 'doubleSecondClass', omitGloria: false },
    '02-24': { name: 'St. Matthias, Apostle', nameEs: 'San Matías, Apóstol', color: 'red', rank: 'double', omitGloria: false },
    '03-19': { name: 'St. Joseph, Husband of the B.V.M.', nameEs: 'San José, Esposo de la B.V.M.', color: 'white', rank: 'doubleFirstClass', omitGloria: false },
    '03-25': { name: 'The Annunciation of the B.V.M.', nameEs: 'La Anunciación de la B.V.M.', color: 'white', rank: 'doubleFirstClass', omitGloria: false },
    '04-25': { name: 'St. Mark, Evangelist', nameEs: 'San Marcos, Evangelista', color: 'red', rank: 'double', omitGloria: false },
    '05-01': { name: 'SS. Philip & James, Apostles', nameEs: 'SS. Felipe y Santiago, Apóstoles', color: 'red', rank: 'double', omitGloria: false },
    '06-11': { name: 'St. Barnabas, Apostle', nameEs: 'San Bernabé, Apóstol', color: 'red', rank: 'double', omitGloria: false },
    '06-24': { name: 'The Nativity of St. John the Baptist', nameEs: 'Natividad de San Juan Bautista', color: 'white', rank: 'doubleFirstClass', omitGloria: false },
    '06-29': { name: 'SS. Peter & Paul, Apostles', nameEs: 'SS. Pedro y Pablo, Apóstoles', color: 'red', rank: 'doubleFirstClass', omitGloria: false },
    '07-25': { name: 'St. James, Apostle', nameEs: 'Santiago, Apóstol', color: 'red', rank: 'double', omitGloria: false },
    '08-06': { name: 'The Transfiguration of Our Lord', nameEs: 'La Transfiguración del Señor', color: 'white', rank: 'doubleSecondClass', omitGloria: false },
    '08-15': { name: 'The Assumption of the B.V.M.', nameEs: 'La Asunción de la B.V.M.', color: 'white', rank: 'doubleFirstClass', omitGloria: false },
    '08-24': { name: 'St. Bartholomew, Apostle', nameEs: 'San Bartolomé, Apóstol', color: 'red', rank: 'double', omitGloria: false },
    '09-08': { name: 'The Nativity of the B.V.M.', nameEs: 'Natividad de la B.V.M.', color: 'white', rank: 'doubleSecondClass', omitGloria: false },
    '09-14': { name: 'The Exaltation of the Holy Cross', nameEs: 'La Exaltación de la Santa Cruz', color: 'red', rank: 'doubleSecondClass', omitGloria: false },
    '09-21': { name: 'St. Matthew, Apostle & Evangelist', nameEs: 'San Mateo, Apóstol y Evangelista', color: 'red', rank: 'double', omitGloria: false },
    '09-29': { name: 'St. Michael & All Angels (Michaelmas)', nameEs: 'San Miguel y Todos los Ángeles', color: 'white', rank: 'double', omitGloria: false },
    '10-18': { name: 'St. Luke, Evangelist', nameEs: 'San Lucas, Evangelista', color: 'red', rank: 'double', omitGloria: false },
    '10-28': { name: 'SS. Simon & Jude, Apostles', nameEs: 'SS. Simón y Judas, Apóstoles', color: 'red', rank: 'double', omitGloria: false },
    '11-01': { name: 'All Saints\' Day', nameEs: 'Todos los Santos', color: 'white', rank: 'doubleFirstClass', omitGloria: false },
    '11-02': { name: 'All Souls\' Day', nameEs: 'Todos los Fieles Difuntos', color: 'black', rank: 'double', omitGloria: true },
    '11-30': { name: 'St. Andrew, Apostle', nameEs: 'San Andrés, Apóstol', color: 'red', rank: 'double', omitGloria: false },
    '12-21': { name: 'St. Thomas, Apostle', nameEs: 'Santo Tomás, Apóstol', color: 'red', rank: 'double', omitGloria: false },
    '12-26': { name: 'St. Stephen, Protomartyr', nameEs: 'San Esteban, Protomártir', color: 'red', rank: 'doubleSecondClass', omitGloria: false },
    '12-27': { name: 'St. John, Apostle & Evangelist', nameEs: 'San Juan, Apóstol y Evangelista', color: 'white', rank: 'doubleSecondClass', omitGloria: false },
    '12-28': { name: 'The Holy Innocents', nameEs: 'Los Santos Inocentes', color: 'red', rank: 'doubleSecondClass', omitGloria: true },
  };

  // ── MAIN: getLiturgicalDay ────────────────────────────────────────────────
  function getLiturgicalDay(date) {
    const y = date.getFullYear();
    const feasts = getFeastDates(y);
    const feastsPrev = getFeastDates(y - 1);
    const feastNext = getFeastDates(y + 1);

    const mmdd = String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    const dow  = date.getDay(); // 0=Sun

    const cycle  = getSundayCycleFixed(date);
    const wcycle = getWeekdayCycle(date);
    const litYearStart = getLiturgicalYearStart(date);

    // Check fixed feasts — but NOT before checking triduum and major moveable feasts
    // (handled below, after moveable feasts of highest rank)

    // Work through the moveable calendar
    // Use current year feasts, but handle Jan dates that may belong to previous year's Easter cycle
    const F = feasts;
    const FP = feastsPrev;

    // ── TRIDUUM ──
    if (sameDay(date, F.goodFriday))       return mk('Good Friday',        'El Viernes Santo',        'red',   'fast', false, true, 'goodFriday', cycle, wcycle);
    if (sameDay(date, F.holySaturday))     return mk('Holy Saturday',      'El Sábado Santo',         'black', 'fast', true, true, 'holySaturday', cycle, wcycle);
    if (sameDay(date, F.maundyThursday))   return mk('Maundy Thursday',    'El Jueves Santo',         'white', 'doubleFirstClass', false, true, 'maundyThursday', cycle, wcycle);
    if (sameDay(date, F.ashWednesday))     return mk('Ash Wednesday',      'El Miércoles de Ceniza',  'violet','feria', true, false, 'ashWednesday', cycle, wcycle);

    // ── EASTER OCTAVE / SEASON ──
    if (sameDay(date, F.easter))           return mk('Easter Day',         'Domingo de Resurrección', 'white', 'doubleFirstClass', false, false, 'easter', cycle, wcycle);
    if (sameDay(date, F.easter2))          return mk('Low Sunday (Easter II)', 'Domingo de Pascua II', 'white','doubleFirstClass', false, false, 'easter2', cycle, wcycle);
    if (sameDay(date, F.easter3))          return mk('Easter III',         'Tercer Domingo de Pascua','white','doubleSecondClass', false, false, 'easter3', cycle, wcycle);
    if (sameDay(date, F.easter4))          return mk('Easter IV (Good Shepherd)', 'Cuarto Domingo de Pascua','white','doubleSecondClass', false, false, 'easter4', cycle, wcycle);
    if (sameDay(date, F.easter5))          return mk('Easter V',           'Quinto Domingo de Pascua','white','doubleSecondClass', false, false, 'easter5', cycle, wcycle);
    if (sameDay(date, F.easter6))          return mk('Easter VI (Rogation Sunday)', 'Sexto Domingo de Pascua','white','doubleSecondClass', false, false, 'easter6', cycle, wcycle);
    if (sameDay(date, F.ascension))        return mk('The Ascension of Our Lord', 'La Ascensión del Señor', 'white','doubleFirstClass', false, false, 'ascension', cycle, wcycle);
    if (sameDay(date, F.easter7))          return mk('Sunday after Ascension', 'Domingo después de la Ascensión', 'white','doubleSecondClass', false, false, 'easter7', cycle, wcycle);
    if (sameDay(date, F.pentecost))        return mk('Whitsunday (Pentecost)', 'Domingo de Pentecostés','red','doubleFirstClass', false, false, 'pentecost', cycle, wcycle);
    if (sameDay(date, F.trinitySunday))    return mk('Trinity Sunday',     'La Santísima Trinidad',   'white','doubleFirstClass', false, false, 'trinity', cycle, wcycle);
    if (sameDay(date, F.corpusChristi))    return mk('Corpus Christi',     'Corpus Christi',          'white','doubleFirstClass', false, false, 'corpusChristi', cycle, wcycle);
    if (sameDay(date, F.sacredHeart))      return mk('The Sacred Heart of Jesus', 'El Sagrado Corazón de Jesús', 'white','doubleFirstClass', false, false, 'sacredHeart', cycle, wcycle);

    // ── PALM SUNDAY / HOLY WEEK ──
    if (sameDay(date, F.palmSunday))       return mk('Palm Sunday',        'Domingo de Ramos',        'red',  'doubleFirstClass', false, false, 'palmSunday', cycle, wcycle);
    if (sameDay(date, F.mondayHolyWeek))   return mk('Monday in Holy Week','Lunes Santo',             'violet','feria', true, true, 'mondayHolyWeek', cycle, wcycle);
    if (sameDay(date, F.tuesdayHolyWeek))  return mk('Tuesday in Holy Week','Martes Santo',           'violet','feria', true, true, 'tuesdayHolyWeek', cycle, wcycle);
    if (sameDay(date, F.wednesdayHolyWeek)) return mk('Wednesday in Holy Week','Miércoles Santo',     'violet','feria', true, true, 'wednesdayHolyWeek', cycle, wcycle);


    // ── FIXED FEASTS — checked after major moveable feasts ──
    // On Sundays, fixed feasts only override if they are doubleFirstClass
    // (e.g. Annunciation on a Lent Sunday). Otherwise the Sunday prevails
    // and the fixed feast is handled as a commemoration.
    // Moved AFTER Lent/Pre-Lent/Advent Sunday checks below.

    // ── LENT ──
    if (sameDay(date, F.lent5))            return mk('Passion Sunday (Lent V)', 'Domingo de Pasión (Cuaresma V)', 'violet','doubleSecondClass', true, false, 'lent5', cycle, wcycle);
    if (sameDay(date, F.lent4))            return mk('Laetare Sunday (Lent IV)', 'Domingo Laetare (Cuaresma IV)', 'rose','doubleSecondClass', true, false, 'lent4', cycle, wcycle);
    if (sameDay(date, F.lent3))            return mk('Lent III',            'Tercer Domingo de Cuaresma','violet','doubleSecondClass', true, false, 'lent3', cycle, wcycle);
    if (sameDay(date, F.lent2))            return mk('Lent II',             'Segundo Domingo de Cuaresma','violet','doubleSecondClass', true, false, 'lent2', cycle, wcycle);
    if (sameDay(date, F.lent1))            return mk('Lent I',              'Primer Domingo de Cuaresma','violet','doubleSecondClass', true, false, 'lent1', cycle, wcycle);

    // ── PRE-LENT (traditional Anglican reckoning) — Alleluia is suppressed from Septuagesima ──
    if (sameDay(date, F.septuagesima))     return mk('Septuagesima Sunday', 'Domingo de Septuagésima','violet','semiDouble', false, true, 'septuagesima', cycle, wcycle);
    if (sameDay(date, F.sexagesima))       return mk('Sexagesima Sunday',   'Domingo de Sexagésima', 'violet','semiDouble', false, true, 'sexagesima', cycle, wcycle);
    if (sameDay(date, F.quinquagesima))    return mk('Quinquagesima Sunday','Domingo de Quincuagésima','violet','semiDouble', false, true, 'quinquagesima', cycle, wcycle);

    // ── ADVENT ──
    if (sameDay(date, F.advent1))          return mk('Advent I',           'Primer Domingo de Adviento','violet','doubleSecondClass', true, false, 'advent1', cycle, wcycle);
    if (sameDay(date, F.advent2))          return mk('Advent II',          'Segundo Domingo de Adviento','violet','doubleSecondClass', true, false, 'advent2', cycle, wcycle);
    if (sameDay(date, F.advent3))          return mk('Advent III (Gaudete)','Tercer Domingo de Adviento (Gaudete)','rose','doubleSecondClass', true, false, 'advent3', cycle, wcycle);
    if (sameDay(date, F.advent4))          return mk('Advent IV',          'Cuarto Domingo de Adviento','violet','doubleSecondClass', true, false, 'advent4', cycle, wcycle);

    // ── CHRISTMAS SEASON ──
    if (mmdd === '12-25') return mk('Christmas Day', 'Natividad del Señor', 'white', 'doubleFirstClass', false, false, 'christmas', cycle, wcycle);
    if (mmdd === '12-26') return FIXED_FEASTS['12-26'] ? { ...FIXED_FEASTS['12-26'], key:'12-26', cycle, wcycle, isFixed:true, isSunday:dow===0 } : mk('26 December','26 de Diciembre','white','feria',false,false,'dec26',cycle,wcycle);

    // Sunday in Christmas octave
    if (dow === 0 && mmdd >= '12-26' && mmdd <= '12-31') {
      return mk('Sunday within the Octave of Christmas', 'Domingo en la Octava de Navidad', 'white', 'doubleSecondClass', false, false, 'christmasSunday', cycle, wcycle);
    }
    // Segundo Domingo después de Navidad: solo existe en años donde caben dos
    // domingos entre Navidad y Epifanía (este cae entre el 2 y el 5 de enero).
    // Sin este bloque, un domingo en ese rango no coincidía con ningún chequeo
    // (ni con las fiestas fijas, que exigen día de semana) y caía al fallback
    // final 'Feria' — con rank 'feria', omitiendo incorrectamente el Credo un domingo.
    if (dow === 0 && mmdd >= '01-02' && mmdd <= '01-05') {
      return mk('The Second Sunday after Christmas Day', 'Segundo Domingo después de Navidad', 'white', 'doubleSecondClass', false, false, 'christmasSunday2', cycle, wcycle);
    }
    // Holy Name / New Year
    if (mmdd === '01-01') return mk('The Circumcision of Christ', 'La Circuncisión del Señor', 'white', 'doubleFirstClass', false, false, 'circumcision', cycle, wcycle);

    // Sundays after Epiphany / Baptism of Lord
    if (mmdd === '01-06') return mk('The Epiphany of Our Lord', 'La Epifanía del Señor', 'white', 'doubleFirstClass', false, false, 'epiphany', cycle, wcycle);
    if (sameDay(date, getBaptismOfLord(y))) return mk('The Baptism of Our Lord', 'El Bautismo del Señor', 'white', 'doubleFirstClass', false, false, 'baptismLord', cycle, wcycle);

    // ── EPIPHANY SUNDAYS ──
    const epiph = getBaptismOfLord(y);
    if (dow === 0 && date > epiph && date < F.septuagesima) {
      const weeks = Math.round(diffDays(epiph, date) / 7);
      const keys  = ['epi1','epi2','epi3','epi4','epi5','epi6','epi7','epi8'];
      const names = ['The Second Sunday after Epiphany','The Third Sunday after Epiphany','The Fourth Sunday after Epiphany','The Fifth Sunday after Epiphany','The Sixth Sunday after Epiphany','The Seventh Sunday after Epiphany','The Eighth Sunday after Epiphany','The Ninth Sunday after Epiphany'];
      const namesEs=['Segundo Domingo después de Epifanía','Tercer Domingo después de Epifanía','Cuarto Domingo después de Epifanía','Quinto Domingo después de Epifanía','Sexto Domingo después de Epifanía','Séptimo Domingo después de Epifanía','Octavo Domingo después de Epifanía','Noveno Domingo después de Epifanía'];
      const idx = Math.min(weeks - 1, 7);
      return mk(names[idx] || 'Sunday after Epiphany', namesEs[idx] || 'Domingo después de Epifanía', 'green', 'semiDouble', false, false, keys[idx] || 'epi'+weeks, cycle, wcycle);
    }

    // ── FIXED FEASTS (checked after all moveable Sunday/season checks, but
    // BEFORE the generic feria/ordinary-time catch-all blocks below — those
    // blocks have no upper date bound and would otherwise swallow every fixed
    // feast that falls on a weekday from Pre-Lent through the end of Advent). ──
    // On Sundays, only doubleFirstClass fixed feasts override the Sunday.
    // Lower-rank feasts will be handled as commemorations by commemorations.js.
    if (FIXED_FEASTS[mmdd]) {
      const ff = FIXED_FEASTS[mmdd];
      const RANK_ORDER = { 'doubleFirstClass': 1, 'doubleSecondClass': 2, 'double': 3, 'semiDouble': 4, 'simplex': 5, 'feria': 6 };
      const ffRank = RANK_ORDER[ff.rank] || 6;
      // On Sundays, only allow doubleFirstClass feasts to override
      if (dow !== 0 || ffRank <= 1) {
        return {
          ...ff,
          key: mmdd,
          cycle, wcycle,
          isFixed: true,
          isSunday: dow === 0,
        };
      }
    }

    // ── PRE-LENT FERIAS (Septuagesima to Ash Wednesday) ──
    if (date > F.septuagesima && date < F.ashWednesday && dow !== 0) {
      const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      return mk(`${dayNames[dow]} (Pre-Lent)`, `${dayNamesEs[dow]} (Tiempo de Pre-Cuaresma)`, 'violet', 'feria', true, true, `preLentFeria_${dow}`, cycle, wcycle);
    }

    // ── LENTEN FERIAS ──
    if (date >= F.ashWednesday && date < F.palmSunday && dow !== 0) {
      const week = Math.ceil(diffDays(F.ashWednesday, date) / 7);
      const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      return mk(`${dayNames[dow]} in Lent Week ${week}`, `${dayNamesEs[dow]} de la Semana ${week} de Cuaresma`, 'violet', 'feria', true, false, `lentFeria${week}_${dow}`, cycle, wcycle);
    }

    // ── EASTER SEASON FERIAS ──
    if (date > F.easter && date < F.pentecost && dow !== 0) {
      const easterWeek = Math.ceil(diffDays(F.easter, date) / 7);
      const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      return mk(`${dayNames[dow]} of Easter Week ${easterWeek}`, `${dayNamesEs[dow]} de la Semana de Pascua ${easterWeek}`, 'white', 'feria', false, false, `easterFeria${easterWeek}_${dow}`, cycle, wcycle);
    }

    // ── PENTECOST OCTAVE FERIAS ──
    if (date > F.pentecost && date < F.trinitySunday && dow !== 0) {
      const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      return mk(`${dayNames[dow]} in the Octave of Pentecost`, `${dayNamesEs[dow]} de la Octava de Pentecostés`, 'red', 'feria', false, false, `pentecostFeria_${dow}`, cycle, wcycle);
    }

    // ── ORDINARY TIME AFTER PENTECOST ──
    if (date > F.trinitySunday && date < getAdvent1(y)) {
      if (dow === 0) {
        const weeks = Math.round(diffDays(F.pentecost, date) / 7);
        // Sundays after Trinity
        const sunNames = ['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth','Twenty-First','Twenty-Second','Twenty-Third','Twenty-Fourth','Twenty-Fifth','Twenty-Sixth','Twenty-Seventh','Twenty-Eighth'];
        const n = weeks - 1;
        const sunN = Math.max(1, Math.min(n, 28));
        return mk(`The ${sunNames[sunN] || sunN+'th'} Sunday after Trinity`, `${sunN}° Domingo después de la Trinidad`, 'green', 'semiDouble', false, false, `trinity${sunN}`, cycle, wcycle);
      } else {
        // Ferias in Ordinary Time
        const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        return mk(`${dayNames[dow]} (Ordinary Time)`, `${dayNamesEs[dow]} (Tiempo Ordinario)`, 'green', 'feria', false, false, `ordinaryFeria`, cycle, wcycle);
      }
    }

    // ── ADVENT FERIAS ──
    if (date >= getAdvent1(y) && date < new Date(y, 11, 25) && dow !== 0) {
      const weekNum = Math.ceil(diffDays(getAdvent1(y), date) / 7);
      const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      return mk(`${dayNames[dow]} of Advent Week ${weekNum}`, `${dayNamesEs[dow]} de la Semana ${weekNum} de Adviento`, 'violet', 'feria', true, false, `adventFeria${weekNum}_${dow}`, cycle, wcycle);
    }

    // ── FALLBACK ──
    return mk('Feria', 'Feria', 'green', 'feria', false, false, 'feria', cycle, wcycle);
  }

  // ── HELPER FACTORY ──────────────────────────────────────────────────────
  function mk(name, nameEs, color, rank, omitGloria, omitAlleluia, key, cycle, wcycle) {
    return { name, nameEs, color, rank, omitGloria, omitAlleluia, key, cycle, wcycle, isFixed: false };
  }

  // ── SEASON DETERMINATION ─────────────────────────────────────────────────
  function getSeason(date) {
    const day = getLiturgicalDay(date);
    const k   = day.key || '';
    const md  = mmdd(date);
    if (k.startsWith('advent'))            return 'advent';
    if (k === 'christmas' || k === 'christmasSunday') return 'christmas';
    if (k === 'circumcision' || (md >= '12-25' || md < '01-07')) return 'christmas';
    if (k === 'epiphany' || k.startsWith('epi'))      return 'epiphany';
    if (k === 'baptismLord')               return 'epiphany';
    if (k === 'septuagesima' || k === 'sexagesima' || k === 'quinquagesima' || k.startsWith('preLent')) return 'preLent';
    if (k === 'ashWednesday' || k.startsWith('lent') || k.endsWith('HolyWeek') || k === 'maundyThursday') return 'lent';
    if (k === 'palmSunday')                return 'passiontide';
    if (k === 'goodFriday' || k === 'holySaturday') return 'triduum';
    if (k.startsWith('easter') || k === 'ascension') return 'easter';
    if (k === 'pentecost' || k.startsWith('pentecostFeria')) return 'pentecost';
    if (k === 'trinity' || k.startsWith('trinity')) return 'trinity';
    return 'ordinary';
  }

  function mmdd(date) {
    return String(date.getMonth() + 1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
  }

  // Ferias entre el Domingo de Pasión y el Domingo de Ramos: lunes-miércoles quedan
  // etiquetados como lentFeria5_{1,2,3} (misma "semana" que el jueves-sábado ANTERIOR
  // al Domingo de Pasión, que NO es Semana de Pasión) y jueves-sábado como lentFeria6_{4,5,6}.
  function isPassionWeekFeria(dayKey) {
    const m = dayKey && dayKey.match(/^lentFeria(\d+)_(\d+)$/);
    if (!m) return false;
    const week = Number(m[1]), dow = Number(m[2]);
    return (week === 5 && dow <= 3) || (week === 6 && dow >= 4);
  }

  // ── OMISSION LOGIC ───────────────────────────────────────────────────────
  function getOmissions(day) {
    const omissions = [];
    const k = day.key || '';

    // Gloria in Excelsis — se omite en Adviento, Cuaresma, Semana Santa y Réquiem
    // NO se omite en Pre-Cuaresma (Septuagésima, Sexagésima, Quincuagésima)
    if (day.omitGloria ||
        k.startsWith('advent') || k.startsWith('adventFeria') ||
        k.startsWith('lent') || k.startsWith('lentFeria') ||
        k === 'ashWednesday' ||
        k.endsWith('HolyWeek') ||
        k === 'goodFriday' || k === 'holySaturday' ||
        day.color === 'black') {
      omissions.push({ part: 'gloria', reason: 'Se omite en tiempos penitenciales (Adviento, Cuaresma) y días de ayuno/réquiem.' });
    }

    // Alleluia
    if (day.omitAlleluia || k === 'ashWednesday' || k.startsWith('lent') || k === 'palmSunday' || k.endsWith('HolyWeek') || k === 'maundyThursday' || k === 'goodFriday' || k === 'holySaturday' || k === 'septuagesima' || k === 'sexagesima' || k === 'quinquagesima' || k.startsWith('preLent')) {
      omissions.push({ part: 'aleluya', reason: 'El Aleluya no se canta desde Septuagésima hasta la Vigilia Pascual. En su lugar se usa el Tracto.' });
    }

    // Credo (Nicene Creed) — only on Sundays, Doubles, and certain feasts
    if (day.rank === 'feria') {
      omissions.push({ part: 'credo', reason: 'El Credo se omite en las ferias comunes.' });
    }

    // Ite Missa Est vs Benedicamus
    if (day.omitGloria) {
      omissions.push({ part: 'ite missa est', note: 'Se dice Benedicamus Domino (Bendigamos al Señor) en lugar de Ite Missa Est.' });
    }

    // Passiontide veiling
    if (k === 'lent5' || k === 'palmSunday' || k.endsWith('HolyWeek') || k === 'maundyThursday' || k === 'goodFriday' || k === 'holySaturday' || isPassionWeekFeria(k)) {
      omissions.push({ part: 'velos', reason: 'Las imágenes y el crucifijo se cubren con velos morados desde el Domingo de Pasión. El velo de la cruz se retira durante la adoración el Viernes Santo.' });
    }

    // Incense at Good Friday
    if (k === 'goodFriday') {
      omissions.push({ part: 'incienso', reason: 'No se usa incienso en la Misa de los Presantificados.' });
    }

    return omissions;
  }

  // ── PUBLIC API ───────────────────────────────────────────────────────────
  return {
    getDay:         getLiturgicalDay,
    getSundayCycle: getSundayCycleFixed,
    getWeekdayCycle,
    getFeastDates,
    getSeason,
    getOmissions,
    computeEaster,
    FIXED_FEASTS,
  };

})();
