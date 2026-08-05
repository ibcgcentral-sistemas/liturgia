/**
 * calendar.js — Motor del Calendario Litúrgico
 * Libro de Oración Común (2019), Iglesia Anglicana en Norteamérica (ACNA)
 *
 * A diferencia del calendario tradicional del Misal Anglicano (js/calendar.js,
 * nomenclatura "Domingos después de Trinidad"), este motor usa la nomenclatura
 * moderna ecuménica: "Domingos después de Pentecostés", numerados por el
 * sistema de "Propios" (Proper 1-29) del Leccionario Común Revisado (RCL),
 * anclados a fechas fijas del calendario civil — así el mismo Proper cae
 * siempre cerca de la misma fecha del año, sin importar cuándo cayó Pascua.
 *
 * AVISO DE FUENTE: el calendario oficial del BCP 2019 (páginas 687-734 del
 * libro) no estaba disponible al construir este motor — se reconstruye aquí
 * con el Leccionario Común Revisado estándar, que ACNA adopta. Ver
 * VERIFICACION-BCP2019.md para el detalle de este riesgo.
 */

const BCPCalendar = (() => {

  // ── CÁLCULO DE PASCUA (Meeus/Jones/Butcher) — idéntico a js/calendar.js ────
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

  function diffDays(d1, d2) {
    return Math.round((d2 - d1) / 86400000);
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
  }

  function mmdd(date) {
    return String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  const DAY_NAMES_ES = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const DAY_NAMES_EN = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // ── PRIMER DOMINGO DE ADVIENTO ───────────────────────────────────────────
  function getAdvent1(year) {
    const christmas = new Date(year, 11, 25);
    const dow = christmas.getDay();
    const daysBack = (dow === 0) ? 28 : dow + 21;
    const d = new Date(christmas);
    d.setDate(d.getDate() - daysBack);
    return d;
  }

  // ── AÑO LITÚRGICO (comienza en Adviento I) ──────────────────────────────
  function getLiturgicalYearStart(date) {
    const y = date.getFullYear();
    const advent1 = getAdvent1(y);
    return (date >= advent1) ? y : y - 1;
  }

  // ── CICLO DOMINICAL A/B/C — mismo ancla que el Misal actual ────────────
  function getSundayCycle(date) {
    const start = getLiturgicalYearStart(date);
    const r = ((start - 2025) % 3 + 3) % 3;
    return ['A', 'B', 'C'][r];
  }

  // ── BAUTISMO DEL SEÑOR (1er domingo después de Epifanía) ───────────────
  function getBaptismOfLord(year) {
    const epiphany = new Date(year, 0, 6);
    const dow = epiphany.getDay();
    const daysToSun = dow === 0 ? 7 : 7 - dow;
    const d = new Date(epiphany);
    d.setDate(d.getDate() + daysToSun);
    return d;
  }

  // ── FECHAS MÓVILES DE UN AÑO ─────────────────────────────────────────────
  function getFeastDates(year) {
    const easter = computeEaster(year);
    const easterMs = easter.getTime();
    const add = n => new Date(easterMs + n * 86400000);
    return {
      advent1: getAdvent1(year),
      advent2: new Date(getAdvent1(year).getTime() + 7 * 86400000),
      advent3: new Date(getAdvent1(year).getTime() + 14 * 86400000),
      advent4: new Date(getAdvent1(year).getTime() + 21 * 86400000),
      christmas: new Date(year, 11, 25),
      epiphany: new Date(year, 0, 6),
      baptismOfLord: getBaptismOfLord(year),
      ashWednesday: add(-46),
      lent1: add(-42),
      lent2: add(-35),
      lent3: add(-28),
      lent4: add(-21),
      lent5: add(-14),
      palmSunday: add(-7),
      maundyThursday: add(-3),
      goodFriday: add(-2),
      holySaturday: add(-1),
      easter: easter,
      easter2: add(7),
      easter3: add(14),
      easter4: add(21),
      easter5: add(28),
      easter6: add(35),
      ascension: add(39),
      easter7: add(42),
      pentecost: add(49),
      trinitySunday: add(56),
    };
  }

  // ── SISTEMA DE "PROPIOS" (RCL) — Domingos después de Pentecostés ────────
  // Cada Proper N corresponde al domingo que cae dentro de un rango fijo de
  // 7 días del calendario civil (estándar ecuménico del Leccionario Común
  // Revisado). Proper 29 = Cristo Rey, siempre el domingo antes de Adviento.
  const PROPER_RANGES = [
    [3, [5, 22], [5, 28]], [4, [5, 29], [6, 4]], [5, [6, 5], [6, 11]],
    [6, [6, 12], [6, 18]], [7, [6, 19], [6, 25]], [8, [6, 26], [7, 2]],
    [9, [7, 3], [7, 9]], [10, [7, 10], [7, 16]], [11, [7, 17], [7, 23]],
    [12, [7, 24], [7, 30]], [13, [7, 31], [8, 6]], [14, [8, 7], [8, 13]],
    [15, [8, 14], [8, 20]], [16, [8, 21], [8, 27]], [17, [8, 28], [9, 3]],
    [18, [9, 4], [9, 10]], [19, [9, 11], [9, 17]], [20, [9, 18], [9, 24]],
    [21, [9, 25], [10, 1]], [22, [10, 2], [10, 8]], [23, [10, 9], [10, 15]],
    [24, [10, 16], [10, 22]], [25, [10, 23], [10, 29]], [26, [10, 30], [11, 5]],
    [27, [11, 6], [11, 12]], [28, [11, 13], [11, 19]], [29, [11, 20], [11, 26]],
  ];

  function getProperNumber(date) {
    const m = date.getMonth() + 1, d = date.getDate();
    const val = m * 100 + d;
    for (const [proper, [sm, sd], [em, ed]] of PROPER_RANGES) {
      const startVal = sm * 100 + sd;
      const endVal = em * 100 + ed;
      if (val >= startVal && val <= endVal) return proper;
    }
    return null;
  }

  // ── SANTORAL FIJO (ACNA) ─────────────────────────────────────────────────
  // AVISO: reconstruido de conocimiento general (calendario occidental común
  // a ACNA/Episcopal), no transcrito del libro — ver aviso de fuente arriba.
  const FIXED_FEASTS = {
    '01-01': { name: 'The Holy Name of Our Lord Jesus Christ', nameEs: 'El Santo Nombre de Nuestro Señor Jesucristo', color: 'white' },
    '01-18': { name: 'The Confession of St. Peter', nameEs: 'La Confesión de San Pedro', color: 'white' },
    '01-25': { name: 'The Conversion of St. Paul', nameEs: 'La Conversión de San Pablo', color: 'white' },
    '02-02': { name: 'The Presentation of Our Lord', nameEs: 'La Presentación del Señor (Candelaria)', color: 'white' },
    '02-24': { name: 'St. Matthias, Apostle', nameEs: 'San Matías, Apóstol', color: 'red' },
    '03-19': { name: 'St. Joseph', nameEs: 'San José, Esposo de la Virgen María', color: 'white' },
    '03-25': { name: 'The Annunciation of Our Lord', nameEs: 'La Anunciación del Señor', color: 'white' },
    '04-25': { name: 'St. Mark, Evangelist', nameEs: 'San Marcos, Evangelista', color: 'red' },
    '05-01': { name: 'SS. Philip & James, Apostles', nameEs: 'SS. Felipe y Santiago, Apóstoles', color: 'red' },
    '05-31': { name: 'The Visitation of the B.V.M.', nameEs: 'La Visitación de la Virgen María', color: 'white' },
    '06-11': { name: 'St. Barnabas, Apostle', nameEs: 'San Bernabé, Apóstol', color: 'red' },
    '06-24': { name: 'The Nativity of St. John the Baptist', nameEs: 'Natividad de San Juan Bautista', color: 'white' },
    '06-29': { name: 'SS. Peter & Paul, Apostles', nameEs: 'SS. Pedro y Pablo, Apóstoles', color: 'red' },
    '07-22': { name: 'St. Mary Magdalene', nameEs: 'Santa María Magdalena', color: 'white' },
    '07-25': { name: 'St. James, Apostle', nameEs: 'Santiago, Apóstol', color: 'red' },
    '08-06': { name: 'The Transfiguration of Our Lord', nameEs: 'La Transfiguración del Señor', color: 'white' },
    '08-15': { name: 'St. Mary the Virgin', nameEs: 'Santa María Virgen', color: 'white' },
    '08-24': { name: 'St. Bartholomew, Apostle', nameEs: 'San Bartolomé, Apóstol', color: 'red' },
    '09-14': { name: 'Holy Cross Day', nameEs: 'La Exaltación de la Santa Cruz', color: 'red' },
    '09-21': { name: 'St. Matthew, Apostle & Evangelist', nameEs: 'San Mateo, Apóstol y Evangelista', color: 'red' },
    '09-29': { name: 'St. Michael & All Angels', nameEs: 'San Miguel y Todos los Ángeles', color: 'white' },
    '10-18': { name: 'St. Luke, Evangelist', nameEs: 'San Lucas, Evangelista', color: 'red' },
    '10-23': { name: 'St. James of Jerusalem', nameEs: 'Santiago de Jerusalén, Hermano del Señor', color: 'red' },
    '10-28': { name: 'SS. Simon & Jude, Apostles', nameEs: 'SS. Simón y Judas, Apóstoles', color: 'red' },
    '11-01': { name: "All Saints' Day", nameEs: 'Todos los Santos', color: 'white' },
    '11-30': { name: 'St. Andrew, Apostle', nameEs: 'San Andrés, Apóstol', color: 'red' },
    '12-21': { name: 'St. Thomas, Apostle', nameEs: 'Santo Tomás, Apóstol', color: 'red' },
    '12-26': { name: 'St. Stephen, Deacon and Martyr', nameEs: 'San Esteban, Diácono y Protomártir', color: 'red' },
    '12-27': { name: 'St. John, Apostle & Evangelist', nameEs: 'San Juan, Apóstol y Evangelista', color: 'white' },
    '12-28': { name: 'The Holy Innocents', nameEs: 'Los Santos Inocentes', color: 'red' },
  };

  // ── FÁBRICA DEL OBJETO "DÍA" ─────────────────────────────────────────────
  function mk(name, nameEs, color, rank, key, season, cycle, isFixed = false) {
    return { name, nameEs, color, rank, key, season, cycle, isFixed };
  }

  // Season real de una fecha, independiente de si es domingo o feria — usado
  // para que las fiestas fijas del santoral (que pueden caer en cualquier
  // tiempo litúrgico) hereden el season correcto en vez de un valor fijo.
  function seasonForDate(date, F, advent1) {
    if (date >= advent1 && date < F.christmas) return 'advent';
    if (date >= F.christmas || date < F.epiphany) return 'christmas';
    if (date >= F.epiphany && date < F.ashWednesday) return 'epiphany';
    if (date >= F.ashWednesday && date < F.palmSunday) return 'lent';
    if (date >= F.palmSunday && date < F.easter) return 'holyWeek';
    if (date >= F.easter && date < F.pentecost) return 'easter';
    if (date >= F.pentecost && date <= F.trinitySunday) return 'pentecost';
    return 'ordinary';
  }

  // ── PRINCIPAL: getDay(date) ──────────────────────────────────────────────
  function getDay(date) {
    const y = date.getFullYear();
    const F = getFeastDates(y);
    const dow = date.getDay();
    const md = mmdd(date);
    const cycle = getSundayCycle(date);
    const advent1 = getAdvent1(y);

    // ── SEMANA SANTA Y TRIDUO ──
    if (sameDay(date, F.goodFriday))     return mk('Good Friday', 'Viernes Santo', 'red', 'holyDay', 'goodFriday', 'holyWeek', cycle);
    if (sameDay(date, F.holySaturday))   return mk('Holy Saturday', 'Sábado Santo', 'violet', 'holyDay', 'holySaturday', 'holyWeek', cycle);
    if (sameDay(date, F.maundyThursday)) return mk('Maundy Thursday', 'Jueves Santo', 'white', 'holyDay', 'maundyThursday', 'holyWeek', cycle);
    if (sameDay(date, F.palmSunday))     return mk('Palm Sunday', 'Domingo de Ramos', 'red', 'sunday', 'palmSunday', 'holyWeek', cycle);
    if (date > F.palmSunday && date < F.maundyThursday && dow !== 0) {
      return mk(`${DAY_NAMES_EN[dow]} in Holy Week`, `${DAY_NAMES_ES[dow]} Santo`, 'violet', 'feria', `holyWeekFeria_${dow}`, 'holyWeek', cycle);
    }

    // ── PASCUA A PENTECOSTÉS ──
    if (sameDay(date, F.easter))     return mk('Easter Day', 'Domingo de Resurrección', 'white', 'principal', 'easter', 'easter', cycle);
    if (sameDay(date, F.easter2))    return mk('Easter II', 'Segundo Domingo de Pascua', 'white', 'sunday', 'easter2', 'easter', cycle);
    if (sameDay(date, F.easter3))    return mk('Easter III', 'Tercer Domingo de Pascua', 'white', 'sunday', 'easter3', 'easter', cycle);
    if (sameDay(date, F.easter4))    return mk('Easter IV (Good Shepherd)', 'Cuarto Domingo de Pascua (Buen Pastor)', 'white', 'sunday', 'easter4', 'easter', cycle);
    if (sameDay(date, F.easter5))    return mk('Easter V', 'Quinto Domingo de Pascua', 'white', 'sunday', 'easter5', 'easter', cycle);
    if (sameDay(date, F.easter6))    return mk('Easter VI', 'Sexto Domingo de Pascua', 'white', 'sunday', 'easter6', 'easter', cycle);
    if (sameDay(date, F.ascension))  return mk('Ascension Day', 'La Ascensión del Señor', 'white', 'principal', 'ascension', 'easter', cycle);
    if (sameDay(date, F.easter7))    return mk('Easter VII (Sunday after Ascension)', 'Séptimo Domingo de Pascua', 'white', 'sunday', 'easter7', 'easter', cycle);
    if (sameDay(date, F.pentecost))  return mk('The Day of Pentecost', 'Día de Pentecostés', 'red', 'principal', 'pentecost', 'pentecost', cycle);
    if (date > F.easter && date < F.pentecost && dow !== 0) {
      const week = Math.ceil(diffDays(F.easter, date) / 7);
      return mk(`${DAY_NAMES_EN[dow]} of Easter Week ${week}`, `${DAY_NAMES_ES[dow]} de Pascua (semana ${week})`, 'white', 'feria', `easterFeria${week}_${dow}`, 'easter', cycle);
    }

    // ── TRINIDAD ──
    if (sameDay(date, F.trinitySunday)) return mk('Trinity Sunday', 'La Santísima Trinidad', 'white', 'principal', 'trinitySunday', 'ordinary', cycle);

    // ── CUARESMA ──
    if (sameDay(date, F.ashWednesday)) return mk('Ash Wednesday', 'Miércoles de Ceniza', 'violet', 'holyDay', 'ashWednesday', 'lent', cycle);
    if (sameDay(date, F.lent1))        return mk('Lent I', 'Primer Domingo de Cuaresma', 'violet', 'sunday', 'lent1', 'lent', cycle);
    if (sameDay(date, F.lent2))        return mk('Lent II', 'Segundo Domingo de Cuaresma', 'violet', 'sunday', 'lent2', 'lent', cycle);
    if (sameDay(date, F.lent3))        return mk('Lent III', 'Tercer Domingo de Cuaresma', 'violet', 'sunday', 'lent3', 'lent', cycle);
    if (sameDay(date, F.lent4))        return mk('Lent IV (Laetare)', 'Cuarto Domingo de Cuaresma (Laetare)', 'rose', 'sunday', 'lent4', 'lent', cycle);
    if (sameDay(date, F.lent5))        return mk('Lent V (Passion Sunday)', 'Quinto Domingo de Cuaresma (Domingo de Pasión)', 'violet', 'sunday', 'lent5', 'lent', cycle);
    if (date >= F.ashWednesday && date < F.palmSunday && dow !== 0) {
      const week = Math.ceil(diffDays(F.ashWednesday, date) / 7);
      return mk(`${DAY_NAMES_EN[dow]} in Lent Week ${week}`, `${DAY_NAMES_ES[dow]} de Cuaresma (semana ${week})`, 'violet', 'feria', `lentFeria${week}_${dow}`, 'lent', cycle);
    }

    // ── ADVIENTO ──
    if (sameDay(date, F.advent1)) return mk('Advent I', 'Primer Domingo de Adviento', 'violet', 'sunday', 'advent1', 'advent', cycle);
    if (sameDay(date, F.advent2)) return mk('Advent II', 'Segundo Domingo de Adviento', 'violet', 'sunday', 'advent2', 'advent', cycle);
    if (sameDay(date, F.advent3)) return mk('Advent III', 'Tercer Domingo de Adviento (Gaudete)', 'rose', 'sunday', 'advent3', 'advent', cycle);
    if (sameDay(date, F.advent4)) return mk('Advent IV', 'Cuarto Domingo de Adviento', 'violet', 'sunday', 'advent4', 'advent', cycle);
    if (date >= advent1 && date < new Date(y, 11, 25) && dow !== 0) {
      const week = Math.ceil(diffDays(advent1, date) / 7);
      return mk(`${DAY_NAMES_EN[dow]} of Advent Week ${week}`, `${DAY_NAMES_ES[dow]} de Adviento (semana ${week})`, 'violet', 'feria', `adventFeria${week}_${dow}`, 'advent', cycle);
    }

    // ── NAVIDAD ──
    if (md === '12-25') return mk('The Nativity of Our Lord (Christmas Day)', 'Natividad del Señor', 'white', 'principal', 'christmas', 'christmas', cycle);
    if (dow === 0 && md >= '12-26' && md <= '12-31') {
      return mk('The First Sunday after Christmas Day', 'Domingo en la Octava de Navidad', 'white', 'sunday', 'christmasSunday', 'christmas', cycle);
    }
    // Segundo Domingo después de Navidad: solo ocurre en años donde caben dos
    // domingos entre Navidad y Epifanía (el domingo cae entre el 2 y el 5 de
    // enero). No siempre existe — la mayoría de los años el 6 de enero llega
    // antes de que haya lugar para un segundo domingo.
    if (dow === 0 && md >= '01-02' && md <= '01-05') {
      return mk('The Second Sunday after Christmas Day', 'Segundo Domingo después de Navidad', 'white', 'sunday', 'christmasSunday2', 'christmas', cycle);
    }
    if ((md >= '12-26' && md <= '12-31') || (md >= '01-01' && md <= '01-05')) {
      // Ferias de la Octava de Navidad (26-31 dic) y antes de Epifanía (1-5 ene),
      // salvo que una fiesta fija del santoral (26,27,28,01-01 ene) tenga
      // precedencia — ver bloque FIXED_FEASTS más abajo, que se evalúa antes
      // de este fallback porque esas fechas quedan cubiertas ahí.
      if (dow !== 0) {
        return mk(`${DAY_NAMES_EN[dow]} in Christmastide`, `${DAY_NAMES_ES[dow]} de Navidad`, 'white', 'feria', 'christmasFeria', 'christmas', cycle);
      }
    }

    // ── EPIFANÍA ──
    if (md === '01-06') return mk('The Epiphany of Our Lord', 'La Epifanía del Señor', 'white', 'principal', 'epiphany', 'epiphany', cycle);
    if (sameDay(date, F.baptismOfLord)) return mk('The Baptism of Our Lord (Epiphany I)', 'El Bautismo del Señor', 'white', 'sunday', 'epiphany1', 'epiphany', cycle);

    // Domingo de la Transfiguración: el último domingo antes de Cuaresma
    const lastEpiphanySunday = new Date(F.ashWednesday.getTime() - 3 * 86400000); // domingo anterior a Miércoles de Ceniza
    if (dow === 0 && date > F.baptismOfLord && sameDay(date, lastEpiphanySunday)) {
      return mk('The Last Sunday after the Epiphany (Transfiguration)', 'Último Domingo después de Epifanía (Transfiguración)', 'white', 'sunday', 'transfiguration', 'epiphany', cycle);
    }
    if (dow === 0 && date > F.baptismOfLord && date < lastEpiphanySunday) {
      const weeks = Math.round(diffDays(F.baptismOfLord, date) / 7);
      return mk(`Epiphany ${weeks + 1}`, `${weeks + 1}° Domingo después de Epifanía`, 'green', 'sunday', `epiphany${weeks + 1}`, 'epiphany', cycle);
    }
    if (date > F.baptismOfLord && date < F.ashWednesday && dow !== 0) {
      return mk(`${DAY_NAMES_EN[dow]} after Epiphany`, `${DAY_NAMES_ES[dow]} después de Epifanía`, 'green', 'feria', 'epiphanyFeria', 'epiphany', cycle);
    }
    if (md > '01-06' && md < '01-13' && dow !== 0 && date < F.baptismOfLord) {
      return mk(`${DAY_NAMES_EN[dow]} after Epiphany`, `${DAY_NAMES_ES[dow]} después de Epifanía`, 'white', 'feria', 'epiphanyOctaveFeria', 'epiphany', cycle);
    }

    // ── FIESTAS FIJAS DEL SANTORAL — antes del bloque genérico de Propios ──
    // (para que una fiesta en día de semana no quede invisible bajo la feria
    // genérica; en domingo, el domingo siempre prevalece — no se implementan
    // reglas de desplazamiento en esta fase).
    if (dow !== 0 && FIXED_FEASTS[md]) {
      const ff = FIXED_FEASTS[md];
      return { name: ff.name, nameEs: ff.nameEs, color: ff.color, rank: 'holyDay', key: md, season: seasonForDate(date, F, advent1), cycle, isFixed: true };
    }

    // ── DOMINGOS Y FERIAS DESPUÉS DE PENTECOSTÉS (sistema de Propios RCL) ──
    if (date > F.trinitySunday && date < advent1) {
      const properN = getProperNumber(date);
      if (dow === 0) {
        const label = properN === 29 ? ' (Cristo Rey)' : '';
        return mk(`Proper ${properN}${label}`, `Propio ${properN}${properN === 29 ? ' — Cristo Rey' : ''}`, 'green', 'sunday', `proper${properN}`, 'ordinary', cycle);
      }
      return mk(`${DAY_NAMES_EN[dow]} after Pentecost`, `${DAY_NAMES_ES[dow]} después de Pentecostés`, 'green', 'feria', `properFeria${properN}_${dow}`, 'ordinary', cycle);
    }

    // ── FALLBACK ──
    return mk('Feria', 'Feria', 'green', 'feria', 'feria', seasonForDate(date, F, advent1), cycle);
  }

  // ── NOMBRE VISIBLE "N° Domingo después de Pentecostés" ─────────────────
  // Distinto de la clave interna properN (anclada por fecha civil): cuenta
  // domingos reales desde Pentecostés ese año específico, como lo hace el
  // propio libro al nombrar los domingos.
  function getSundaysAfterPentecostLabel(date) {
    const y = date.getFullYear();
    const F = getFeastDates(y);
    if (date <= F.trinitySunday) return null;
    const weeks = Math.round(diffDays(F.trinitySunday, date) / 7);
    return weeks + 1; // Trinity Sunday es el domingo 1 después de Pentecostés
  }

  return {
    getDay,
    getSundayCycle,
    getFeastDates,
    getProperNumber,
    getSundaysAfterPentecostLabel,
    computeEaster,
    FIXED_FEASTS,
  };

})();
