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

  // Número de día absoluto (UTC) a partir del año/mes/día locales.
  // Se usa para comparar rangos sin que el horario de verano desplace las
  // fechas móviles (que se calculan sumando milisegundos a la Pascua).
  function dnum(d) {
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  }
  function dateOnly(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  function addDays(d, n) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  }

  // ── PRECEDENCIA DE RANGOS ────────────────────────────────────────────────
  // 'fast' (Viernes y Sábado Santo) es el grado más privilegiado del año:
  // nada lo desplaza, por eso ocupa el valor 0. Antes faltaba en esta tabla y
  // cualquier comparación de precedencia lo degradaba a feria (valor 6).
  const RANK_ORDER = {
    'fast': 0,
    'doubleFirstClass': 1,
    'doubleSecondClass': 2,
    'double': 3,
    'semiDouble': 4,
    'simplex': 5,
    'feria': 6,
  };
  function rankOf(r) {
    return (RANK_ORDER[r] !== undefined) ? RANK_ORDER[r] : 6;
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
    // Aritmética de calendario (no de milisegundos): con horario de verano,
    // sumar n*86400000 a una fecha local a medianoche puede caer a las 23:00
    // del día anterior y romper sameDay().
    const add = n => addDays(easter, n);

    return {
      advent1:          getAdvent1(year),
      advent2:          addDays(getAdvent1(year), 7),
      advent3:          addDays(getAdvent1(year), 14),
      advent4:          addDays(getAdvent1(year), 21),
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

  // ── OCURRENCIA: día litúrgico SIN aplicar traslaciones ───────────────────
  // getLiturgicalDay() (más abajo) envuelve a esta función y añade la
  // traslación de las fiestas de I clase impedidas y el campo `season`.
  function computeOccurringDay(date) {
    const y = date.getFullYear();
    const feasts = getFeastDates(y);

    const mmdd = String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    const dow  = date.getDay(); // 0=Sun

    const cycle  = getSundayCycleFixed(date);
    const wcycle = getWeekdayCycle(date);

    // Check fixed feasts — but NOT before checking triduum and major moveable feasts
    // (handled below, after moveable feasts of highest rank)

    // Work through the moveable calendar
    const F = feasts;

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
    // El Gloria se omite el Domingo de Ramos (uso tradicional). El color
    // permanece ROJO por decisión del usuario, documentada aparte.
    if (sameDay(date, F.palmSunday))       return mk('Palm Sunday',        'Domingo de Ramos',        'red',  'doubleFirstClass', true, true, 'palmSunday', cycle, wcycle);
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

    // ── PRE-LENT (traditional Anglican reckoning) ──
    // Desde Septuagésima se suprimen el Aleluya Y el Gloria in excelsis en los
    // domingos y ferias de Pre-Cuaresma (uso tradicional). Las fiestas que
    // caen en estos días sí conservan el Gloria: la omisión se aplica al
    // oficio del tiempo, no a las fiestas (ver getOmissions()).
    if (sameDay(date, F.septuagesima))     return mk('Septuagesima Sunday', 'Domingo de Septuagésima','violet','semiDouble', true, true, 'septuagesima', cycle, wcycle);
    if (sameDay(date, F.sexagesima))       return mk('Sexagesima Sunday',   'Domingo de Sexagésima', 'violet','semiDouble', true, true, 'sexagesima', cycle, wcycle);
    if (sameDay(date, F.quinquagesima))    return mk('Quinquagesima Sunday','Domingo de Quincuagésima','violet','semiDouble', true, true, 'quinquagesima', cycle, wcycle);

    // ── ADVENT ──
    if (sameDay(date, F.advent1))          return mk('Advent I',           'Primer Domingo de Adviento','violet','doubleSecondClass', true, false, 'advent1', cycle, wcycle);
    if (sameDay(date, F.advent2))          return mk('Advent II',          'Segundo Domingo de Adviento','violet','doubleSecondClass', true, false, 'advent2', cycle, wcycle);
    if (sameDay(date, F.advent3))          return mk('Advent III (Gaudete)','Tercer Domingo de Adviento (Gaudete)','rose','doubleSecondClass', true, false, 'advent3', cycle, wcycle);
    if (sameDay(date, F.advent4))          return mk('Advent IV',          'Cuarto Domingo de Adviento','violet','doubleSecondClass', true, false, 'advent4', cycle, wcycle);

    // ── CHRISTMAS SEASON ──
    if (mmdd === '12-25') return mk('Christmas Day', 'Natividad del Señor', 'white', 'doubleFirstClass', false, false, 'christmas', cycle, wcycle);
    // NOTA: el 26 de diciembre (San Esteban) NO se resuelve aquí. Es
    // doubleSecondClass, igual que San Juan (27) y los Santos Inocentes (28),
    // y por la regla de este archivo ("en domingo solo las doubleFirstClass
    // desplazan al domingo") debe ceder al Domingo en la Octava de Navidad y
    // conmemorarse. Los tres comites Christi se resuelven ahora de forma
    // uniforme en el bloque FIXED_FEASTS, que va después del bloque de
    // domingo en la octava.

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
      const ffRank = rankOf(ff.rank);
      // On Sundays, only allow doubleFirstClass feasts to override.
      // Entre el Domingo de Ramos y el II de Pascua (Semana Santa y Octava de
      // Pascua) solo las fiestas de I clase prevalecen; las demás ('double' y
      // menores) ceden ante la octava (p. ej. San Marcos el 25-abr en la Octava).
      const inEasterOctave = dnum(date) >= dnum(F.palmSunday) && dnum(date) <= dnum(F.easter2);
      if ((dow !== 0 || ffRank <= 1) && !(inEasterOctave && ffRank > 1)) {
        return {
          ...ff,
          key: mmdd,
          cycle, wcycle,
          isFixed: true,
          isSunday: dow === 0,
        };
      }
    }

    // ── FERIAS DE LA OCTAVA Y DEL TIEMPO DE NAVIDAD ──────────────────────────
    // Cubren 29-31 de diciembre y 2-5 de enero (el 25, 26, 27, 28 de diciembre
    // y el 1 y 6 de enero ya se han resuelto arriba; los domingos, por los
    // bloques christmasSunday / christmasSunday2). Sin este bloque estos días
    // caían al fallback genérico 'Feria' en verde.
    // N = día del tiempo de Navidad contado desde el 25 de diciembre (25-dic = 1).
    // Los días 1-8 pertenecen a la Octava de Navidad: allí SÍ se dice el Credo,
    // por eso llevan rank 'semiDouble' y no 'feria' (con rank 'feria' el motor
    // omite el Credo).
    {
      let nChristmas = 0;
      if (mmdd >= '12-26' && mmdd <= '12-31') nChristmas = date.getDate() - 24;
      else if (mmdd >= '01-02' && mmdd <= '01-05') nChristmas = date.getDate() + 7; // 2-ene = 9
      if (nChristmas > 0 && dow !== 0) {
        const ord   = ['','Primero','Segundo','Tercero','Cuarto','Quinto','Sexto','Séptimo','Octavo'];
        const ordEn = ['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth'];
        const dayNames   = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        if (nChristmas <= 8) {
          return mk(`The ${ordEn[nChristmas]} Day within the Octave of Christmas`,
                    `${ord[nChristmas]} día en la Octava de Navidad`,
                    'white', 'semiDouble', false, false, `christmasFeria_${nChristmas}`, cycle, wcycle);
        }
        return mk(`${dayNames[dow]} in Christmastide`,
                  `${dayNamesEs[dow]} del Tiempo de Navidad`,
                  'white', 'feria', false, false, `christmasFeria_${nChristmas}`, cycle, wcycle);
      }
    }

    // ── FERIAS DEL TIEMPO DE EPIFANÍA ────────────────────────────────────────
    // Del 7 de enero a la víspera de Septuagésima. Sin este bloque también
    // caían al fallback genérico.
    //  · 7-ene hasta la víspera del Bautismo del Señor (primer domingo después
    //    de la Epifanía): días dentro de la Octava de la Epifanía → blanco,
    //    clave epiOctave_{dow}.
    //  · a partir del Bautismo: verde, clave epiFeria{N}_{dow}, donde N es el
    //    número del domingo después de la Epifanía que PRECEDE a la feria
    //    (N = 1 → semana que sigue al Bautismo; N = 2 → semana que sigue a
    //    'epi1', que es el Segundo Domingo después de la Epifanía, etc.).
    if (dow !== 0 && mmdd >= '01-07' && date < F.septuagesima) {
      const dayNames   = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      const baptism = getBaptismOfLord(y);
      if (dnum(date) < dnum(baptism)) {
        return mk(`${dayNames[dow]} within the Octave of the Epiphany`,
                  `${dayNamesEs[dow]} en la Octava de la Epifanía`,
                  'white', 'feria', false, false, `epiOctave_${dow}`, cycle, wcycle);
      }
      const n = Math.ceil((dnum(date) - dnum(baptism)) / 7);
      return mk(`${dayNames[dow]} after the ${n}. Sunday after Epiphany`,
                `${dayNamesEs[dow]} de la Semana ${n} después de la Epifanía`,
                'green', 'feria', false, false, `epiFeria${n}_${dow}`, cycle, wcycle);
    }

    // ── PRE-LENT FERIAS (Septuagesima to Ash Wednesday) ──
    if (date > F.septuagesima && date < F.ashWednesday && dow !== 0) {
      const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      return mk(`${dayNames[dow]} (Pre-Lent)`, `${dayNamesEs[dow]} (Tiempo de Pre-Cuaresma)`, 'violet', 'feria', true, true, `preLentFeria_${dow}`, cycle, wcycle);
    }

    // ── LENTEN FERIAS ──
    // La semana cuaresmal se ancla en el DOMINGO (F.lent1), no en el Miércoles
    // de Ceniza: anclando en miércoles la "semana" cortaba de jueves a jueves y
    // el jueves, viernes y sábado llevaban el número de la semana siguiente
    // (p. ej. 2026: el jueves 26-feb salía "Semana 2" siendo de la Semana 1, y
    // el 26-mar salía "Semana 6", semana que no existe).
    // Los tres días que siguen al Miércoles de Ceniza son anteriores al Primer
    // Domingo de Cuaresma y no pertenecen a ninguna semana numerada: se
    // etiquetan "después de Ceniza".
    if (date >= F.ashWednesday && date < F.palmSunday && dow !== 0) {
      const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      if (dnum(date) < dnum(F.lent1)) {
        return mk(`${dayNames[dow]} after Ash Wednesday`,
                  `${dayNamesEs[dow]} después de Ceniza`,
                  'violet', 'feria', true, true, `lentFeriaAsh_${dow}`, cycle, wcycle);
      }
      const week = Math.ceil((dnum(date) - dnum(F.lent1)) / 7);   // 1..5
      // La semana 5 es la que sigue al Domingo de Pasión: Semana de Pasión.
      const nameEs = (week === 5)
        ? `${dayNamesEs[dow]} de la Semana de Pasión`
        : `${dayNamesEs[dow]} de la Semana ${week} de Cuaresma`;
      const nameEn = (week === 5)
        ? `${dayNames[dow]} in Passion Week`
        : `${dayNames[dow]} in Lent Week ${week}`;
      return mk(nameEn, nameEs, 'violet', 'feria', true, true, `lentFeria${week}_${dow}`, cycle, wcycle);
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
        // Ferias in Ordinary Time.
        // Antes TODAS compartían la clave genérica 'ordinaryFeria', que no
        // existe ni en propers.js ni en lectionary.js, de modo que 141 días por
        // año quedaban sin propios. Ahora llevan el número de la semana,
        // coherente con las claves trinityN de los domingos: N es el número del
        // Domingo después de la Trinidad que PRECEDE a la feria.
        // N = 0 → semana que sigue al propio Domingo de la Santísima Trinidad.
        // Se conserva la clave genérica en `keyAliases` para que cualquier
        // consumidor que siga buscando 'ordinaryFeria' continúe funcionando.
        const dayNames = ['','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const dayNamesEs = ['','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
        const prevSun = addDays(date, -dow);
        const n = Math.max(0, Math.min(Math.round(diffDays(F.pentecost, prevSun) / 7) - 1, 28));
        const nameEs = (n === 0)
          ? `${dayNamesEs[dow]} de la semana de la Santísima Trinidad`
          : `${dayNamesEs[dow]} de la Semana ${n} después de la Trinidad`;
        const nameEn = (n === 0)
          ? `${dayNames[dow]} after Trinity Sunday`
          : `${dayNames[dow]} after the ${n}. Sunday after Trinity`;
        return mk(nameEn, nameEs, 'green', 'feria', false, false, `ordinaryFeria${n}_${dow}`, cycle, wcycle,
                  { keyAliases: ['ordinaryFeria'] });
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
    // Con los bloques de Navidad y Epifanía añadidos arriba este retorno ya no
    // debería alcanzarse nunca (barrido 2024-2060: 0 días). Se conserva como
    // red de seguridad.
    return mk('Feria', 'Feria', 'green', 'feria', false, false, 'feria', cycle, wcycle);
  }

  // ── HELPER FACTORY ──────────────────────────────────────────────────────
  function mk(name, nameEs, color, rank, omitGloria, omitAlleluia, key, cycle, wcycle, extra) {
    return Object.assign(
      { name, nameEs, color, rank, omitGloria, omitAlleluia, key, cycle, wcycle, isFixed: false },
      extra || {}
    );
  }

  // ── TRASLACIÓN DE FIESTAS DE I CLASE ─────────────────────────────────────
  // El bloque FIXED_FEASTS se evalúa después de los retornos de Cuaresma,
  // Adviento, Pre-Cuaresma y del Triduo, de modo que una fiesta de I clase que
  // coincide con un domingo cuaresmal, con la Semana Santa o con una móvil
  // superior simplemente desaparecía del calendario. La precedencia es
  // correcta (la fiesta cede); lo que faltaba era TRASLADARLA al primer día
  // libre. Ej.: la Anunciación en Semana Santa o en la Octava de Pascua se
  // traslada al lunes después de la Dominica in albis.
  const FIRST_CLASS_FIXED = Object.keys(FIXED_FEASTS)
    .filter(k => FIXED_FEASTS[k].rank === 'doubleFirstClass');

  // ¿Es `date` un día privilegiado que impide (o rechaza) una fiesta de I clase?
  function isPrivilegedDate(date) {
    const F = getFeastDates(date.getFullYear());
    const n = dnum(date);
    if (n === dnum(F.ashWednesday)) return true;
    // Del Domingo de Ramos a la Dominica in albis (Pascua II) inclusive:
    // Semana Santa, Triduo y Octava de Pascua.
    if (n >= dnum(F.palmSunday) && n <= dnum(F.easter2)) return true;
    // Octava de Navidad (25-dic a 1-ene).
    const md = mmdd(date);
    if (md >= '12-25' || md === '01-01') return true;
    return false;
  }

  // Algunas fiestas fijas se resuelven arriba bajo una clave móvil propia
  // (el 1 de enero como 'circumcision' y el 6 de enero como 'epiphany'):
  // se celebran en su fecha, así que NO están impedidas pese a que la clave
  // del día no coincida con 'MM-DD'.
  const FIXED_KEY_ALIASES = {
    '01-01': ['circumcision'],
    '01-06': ['epiphany'],
  };

  // ¿Está impedida la fiesta fija `key` en su fecha propia `date`?
  function isImpeded(date, key) {
    const occ = computeOccurringDay(date);
    const aliases = FIXED_KEY_ALIASES[key];
    if (aliases && aliases.indexOf(occ.key) >= 0) return false;
    // Días privilegiados (Miércoles de Ceniza, Semana Santa, Triduo y Octava
    // de Pascua hasta la Dominica in albis, Octava de Navidad): aunque el
    // bloque FIXED_FEASTS dejara "ganar" a la fiesta, esta cede y se traslada.
    if (isPrivilegedDate(date)) return true;
    return occ.key !== key;
  }

  // Primer día libre a partir de `from` (excluido) para acoger la fiesta.
  // `taken` es el conjunto de días ya ocupados por otra fiesta trasladada
  // (dos fiestas de I clase impedidas el mismo año pueden competir por el
  // mismo día: p. ej. en 2035 y 2046, San José y la Anunciación).
  function findTranslationTarget(from, taken) {
    for (let i = 1; i <= 60; i++) {
      const cand = addDays(from, i);
      if (cand.getDay() === 0) continue;              // nunca a un domingo
      if (isPrivilegedDate(cand)) continue;
      if (taken && taken.has(dnum(cand))) continue;   // ya ocupado por otra traslación
      const occ = computeOccurringDay(cand);
      if (rankOf(occ.rank) <= 2) continue;            // ocupado por I o II clase
      return cand;
    }
    return null;
  }

  // Resuelve, para un año civil dado, todas las traslaciones de fiestas de I
  // clase impedidas, en orden de fecha propia (la primera impedida elige antes).
  // Ninguna de las fiestas fijas de I clase cae en diciembre, así que la
  // resolución por año civil es suficiente (el desplazamiento máximo es de
  // unas semanas y nunca cruza el cambio de año).
  const _translationCache = {};
  function resolveTranslations(year) {
    if (_translationCache[year]) return _translationCache[year];
    const byTargetDnum = {};   // dnum destino -> { key, feast, from }
    const byKey = {};          // 'MM-DD' -> Date destino
    const taken = new Set();
    const entries = FIRST_CLASS_FIXED.map(key => {
      const [mm, dd] = key.split('-').map(Number);
      return { key, proper: new Date(year, mm - 1, dd) };
    }).sort((a, b) => dnum(a.proper) - dnum(b.proper));

    for (const e of entries) {
      if (!isImpeded(e.proper, e.key)) continue;
      const target = findTranslationTarget(e.proper, taken);
      byKey[e.key] = target;
      if (target) {
        taken.add(dnum(target));
        byTargetDnum[dnum(target)] = { key: e.key, feast: FIXED_FEASTS[e.key], from: e.proper };
      }
    }
    _translationCache[year] = { byTargetDnum, byKey };
    return _translationCache[year];
  }

  // Devuelve { key, feast, from } si alguna fiesta de I clase se traslada a `date`.
  function translatedFeastArrivingOn(date) {
    const n = dnum(date);
    for (const yy of [date.getFullYear(), date.getFullYear() - 1]) {
      const hit = resolveTranslations(yy).byTargetDnum[n];
      if (hit) return hit;
    }
    return null;
  }

  // ── MAIN: getLiturgicalDay ────────────────────────────────────────────────
  function getLiturgicalDay(date) {
    const d = dateOnly(date);
    const base = computeOccurringDay(d);
    const season = getSeason(d);
    const cycle = base.cycle, wcycle = base.wcycle;

    // 1) ¿Llega hoy una fiesta de I clase trasladada?
    const arriving = translatedFeastArrivingOn(d);
    if (arriving && rankOf(base.rank) > 1) {
      return Object.assign({}, arriving.feast, {
        key: arriving.key,
        cycle, wcycle,
        isFixed: true,
        isSunday: d.getDay() === 0,
        season,
        isTranslated: true,
        translatedFrom: arriving.key,
        translatedFromDate: arriving.from,
        translatedFromISO: isoDate(arriving.from),
        displacedDay: { key: base.key, name: base.name, nameEs: base.nameEs },
      });
    }

    // 2) ¿Hoy es la fecha propia de una fiesta de I clase impedida?
    //    Se expone para que el resto de la app pueda anunciar la traslación.
    const out = Object.assign({}, base, { season });
    const md = mmdd(d);
    if (FIRST_CLASS_FIXED.indexOf(md) >= 0 && out.key !== md && isImpeded(d, md)) {
      const target = resolveTranslations(d.getFullYear()).byKey[md] || null;
      const ff = FIXED_FEASTS[md];
      out.translatedFeast = {
        key: md,
        name: ff.name,
        nameEs: ff.nameEs,
        color: ff.color,
        rank: ff.rank,
        to: target,
        toISO: target ? isoDate(target) : null,
      };
    }
    return out;
  }

  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');
  }

  // ── SEASON DETERMINATION ─────────────────────────────────────────────────
  // Antes se despachaba sobre day.key. Como las fiestas fijas reciben
  // key = 'MM-DD', TODA fiesta fija devolvía 'ordinary' y, en consecuencia,
  // ninguna suprimía el Aleluya entre Septuagésima y Pascua ni llevaba la nota
  // de velos en Tiempo de Pasión. La temporada se deriva ahora de la FECHA,
  // comparándola con getFeastDates(), y es por tanto independiente del rango
  // del día.
  //
  // Correcciones adicionales respecto de la versión anterior:
  //  · El 6 de enero devuelve 'epiphany' (antes la rama de Navidad,
  //    md >= '12-25' || md < '01-07', se evaluaba primero y lo absorbía).
  //  · 'passiontide' abarca desde el Domingo de Pasión (lent5, comienzo real
  //    del Tiempo de Pasión) hasta el Jueves Santo inclusive; antes solo se
  //    asignaba al Domingo de Ramos.
  function getSeason(date) {
    const d = dateOnly(date);
    const y = d.getFullYear();
    const F = getFeastDates(y);
    const n = dnum(d);
    const md = mmdd(d);

    // Adviento y Navidad del propio año civil
    if (n >= dnum(F.advent1) && n < dnum(F.christmas)) return 'advent';
    if (n >= dnum(F.christmas))                        return 'christmas';

    // Enero: resto del tiempo de Navidad, Epifanía, Pre-Cuaresma…
    if (md <= '01-05')                                 return 'christmas';
    if (md === '01-06')                                return 'epiphany';

    if (n <  dnum(F.septuagesima))                     return 'epiphany';
    if (n <  dnum(F.ashWednesday))                     return 'preLent';
    if (n <  dnum(F.lent5))                            return 'lent';
    if (n <= dnum(F.maundyThursday))                   return 'passiontide';
    if (n <= dnum(F.holySaturday))                     return 'triduum';
    if (n <  dnum(F.pentecost))                        return 'easter';
    if (n <  dnum(F.trinitySunday))                    return 'pentecost';
    return 'trinity';
  }

  function mmdd(date) {
    return String(date.getMonth() + 1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
  }

  // Ferias de la Semana de Pasión. Con la numeración anclada en el domingo
  // (ver bloque de ferias cuaresmales) la Semana de Pasión es exactamente la
  // semana 5: lentFeria5_{1..6}. La semana 6 ya no existe.
  function isPassionWeekFeria(dayKey) {
    const m = dayKey && dayKey.match(/^lentFeria(\d+)_(\d+)$/);
    if (!m) return false;
    return Number(m[1]) === 5;
  }

  // ── OMISSION LOGIC ───────────────────────────────────────────────────────
  // `day` es el objeto devuelto por getDay(), que ahora incluye `season`.
  // Se acepta opcionalmente la fecha como segundo argumento para poder
  // derivar la temporada si se invoca con un objeto antiguo sin `season`.
  function getOmissions(day, date) {
    const omissions = [];
    const k = day.key || '';
    const season = day.season || (date ? getSeason(date) : null);
    const isFeast = day.isFixed === true;

    // ── Gloria in excelsis ──
    // Se omite en los tiempos penitenciales (Adviento, Pre-Cuaresma desde
    // Septuagésima, Cuaresma, Tiempo de Pasión y Semana Santa) y en las misas
    // de difuntos. NO se omite en las FIESTAS que caen dentro de esos tiempos:
    // por eso la regla de temporada solo se aplica cuando el día no es una
    // fiesta fija (day.isFixed). Las fiestas con Gloria omitido propio
    // (p. ej. Fieles Difuntos) lo declaran con omitGloria/color negro.
    // El Jueves Santo es la única excepción dentro del Tiempo de Pasión:
    // en la Misa in Cena Domini SÍ se canta el Gloria in excelsis.
    const penitentialSeason = (season === 'advent' || season === 'preLent' ||
                               season === 'lent' || season === 'passiontide' ||
                               season === 'triduum') && k !== 'maundyThursday';
    const omitGloria = day.omitGloria ||
        day.color === 'black' ||
        (!isFeast && penitentialSeason) ||
        // Compatibilidad con claves antiguas por si se invoca sin `season`.
        k.startsWith('advent') || k.startsWith('lent') ||
        k === 'ashWednesday' || k.endsWith('HolyWeek') ||
        k === 'goodFriday' || k === 'holySaturday' ||
        k === 'septuagesima' || k === 'sexagesima' || k === 'quinquagesima' ||
        k.startsWith('preLent') || k === 'palmSunday';
    if (omitGloria) {
      omissions.push({ part: 'gloria', reason: 'Se omite en tiempos penitenciales (Adviento, Pre-Cuaresma desde Septuagésima, Cuaresma y Tiempo de Pasión) y en días de ayuno o réquiem.' });
    }

    // ── Aleluya ──
    // Se calla desde Septuagésima hasta la Vigilia Pascual, TAMBIÉN en las
    // fiestas que caen en ese período (regla de temporada, no de rango).
    const alleluiaSeason = (season === 'preLent' || season === 'lent' ||
                            season === 'passiontide' || season === 'triduum');
    if (day.omitAlleluia || alleluiaSeason ||
        k === 'ashWednesday' || k.startsWith('lent') || k === 'palmSunday' ||
        k.endsWith('HolyWeek') || k === 'maundyThursday' ||
        k === 'goodFriday' || k === 'holySaturday' ||
        k === 'septuagesima' || k === 'sexagesima' || k === 'quinquagesima' ||
        k.startsWith('preLent')) {
      omissions.push({ part: 'aleluya', reason: 'El Aleluya no se canta desde Septuagésima hasta la Vigilia Pascual. En su lugar se usa el Tracto.' });
    }

    // Credo (Nicene Creed) — only on Sundays, Doubles, and certain feasts
    if (day.rank === 'feria') {
      omissions.push({ part: 'credo', reason: 'El Credo se omite en las ferias comunes.' });
    }

    // Ite Missa Est vs Benedicamus
    if (omitGloria) {
      omissions.push({ part: 'ite missa est', note: 'Se dice Benedicamus Domino (Bendigamos al Señor) en lugar de Ite Missa Est.' });
    }

    // ── Velos del Tiempo de Pasión ──
    // Regla de temporada: alcanza también a las fiestas fijas que caen entre
    // el Domingo de Pasión y el Sábado Santo.
    if (season === 'passiontide' || season === 'triduum' ||
        k === 'lent5' || k === 'palmSunday' || k.endsWith('HolyWeek') ||
        k === 'maundyThursday' || k === 'goodFriday' || k === 'holySaturday' ||
        isPassionWeekFeria(k)) {
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
    // Día tal como OCURRE, sin aplicar la traslación de fiestas impedidas.
    getOccurringDay: computeOccurringDay,
  };

})();
