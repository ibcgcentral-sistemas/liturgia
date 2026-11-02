/**
 * lectionary.js — Leccionario Dominical, de Días Santos y Conmemorativo
 * Libro de Oración Común (2019), ACNA
 *
 * FUENTE: transcrito de la tabla «Sunday, Holy Day, and Commemoration
 * Lectionary» del libro (pp. 717-733), contrastado con el PDF oficial. Sustituye
 * a la tabla anterior, que se reconstruyó de memoria a partir del Leccionario
 * Común Revisado y coincidía con el libro en menos de la mitad de las lecturas.
 *
 * CÓMO SE LEYÓ EL LIBRO (decisiones reversibles, hechas al generar este archivo):
 *  - Las citas conservan la NUMERACIÓN del libro (inglesa). La conversión a la de
 *    la Biblia de Jerusalén (hebrea) se hace al leer el texto: ver
 *    VERSE_SHIFTS/toBibliaPieces en utils.js. Aquí no hay ninguna conversión.
 *  - Los versículos opcionales, entre paréntesis en el libro, se INCLUYEN.
 *  - Los sufijos a/b de medio versículo se descartan (se lee el versículo entero).
 *  - Cuando el libro ofrece alternativas («A or B») se toma la PRIMERA; en los
 *    salmos («Ps 80 or 80:1-7v»: el salmo completo o una porción) se toma la
 *    porción más corta. El sufijo «v» (numeración del Salterio Coverdale) se
 *    descarta: los salmos se leen con la numeración inglesa de la Biblia de
 *    Jerusalén. Pendiente: leerlos del Salterio español del propio libro.
 *  - Los Propios 1 y 2 solo se usan en días de semana (el libro los llama
 *    «Weekdays»): ningún domingo cae en esas fechas.
 *  - NO incluidos (el calendario no los emite): Navidad Día II y III, Misa de la
 *    Aurora y de la tarde de Pascua, Vigilia Pascual, Liturgia de las Palmas,
 *    Domingo de Misión Mundial, Témporas, Rogativas, Acción de Gracias, días
 *    nacionales y Comunes.
 *  - Lunes, Martes y Miércoles Santos: lecturas propias del libro. Antes eran las
 *    del Misal Romano, elegidas cuando se creía que el libro no las asignaba; el
 *    usuario pidió pasar a las oficiales el 2026-10-31.
 *  - Las antífonas de salmo (psalmAnt) se conservaron SOLO donde el salmo no
 *    cambió respecto de la tabla anterior.
 *
 * Formato de referencia: en inglés (compatible con js/lib/biblia-wrapper.js y
 * translateBibleReference), p.ej. "Genesis 1:1-5".
 * Regenerar: ver bcp2019-tools/build-lectionary.js.
 */

const BCPLectionary = (() => {

  const SUNDAY = {

    // ═══════════════ ADVIENTO ═══════════════
    advent1: {
      A: { first: 'Isaiah 2:1-5', psalm: 'Psalm 122', second: 'Romans 13:8-14', gospel: 'Matthew 24:29-44' },
      B: { first: 'Isaiah 64:1-9', psalm: 'Psalm 80:1-7', second: '1 Corinthians 1:1-9', gospel: 'Mark 13:24-37' },
      C: { first: 'Zechariah 14:1-9', psalm: 'Psalm 50:1-6', second: '1 Thessalonians 3:6-13', gospel: 'Luke 21:25-33' },
    },
    advent2: {
      A: { first: 'Isaiah 11:1-10', psalm: 'Psalm 72:1-19', second: 'Romans 15:1-13', gospel: 'Matthew 3:1-12' },
      B: { first: 'Isaiah 40:1-11', psalm: 'Psalm 85', second: '2 Peter 3:8-18', gospel: 'Mark 1:1-8' },
      C: { first: 'Malachi 3:1-5', psalm: 'Psalm 126', second: '1 Corinthians 4:1-21', gospel: 'Luke 3:1-6' },
    },
    advent3: {
      A: { first: 'Isaiah 35:1-10', psalm: 'Psalm 146', second: 'James 5:7-20', gospel: 'Matthew 11:2-19' },
      B: { first: 'Isaiah 65:17-25', psalm: 'Psalm 126', second: '1 Thessalonians 5:12-28', gospel: 'John 3:22-30' },
      C: { first: 'Zephaniah 3:14-20', psalm: 'Psalm 85', second: 'Philippians 4:4-9', gospel: 'Luke 3:7-20' },
    },
    advent4: {
      A: { first: 'Isaiah 7:10-17', psalm: 'Psalm 24', second: 'Romans 1:1-7', gospel: 'Matthew 1:18-25' },
      B: { first: '2 Samuel 7:1-17', psalm: 'Psalm 132:1-19', second: 'Romans 16:25-27', gospel: 'Luke 1:26-38' },
      C: { first: 'Micah 5:2-5', psalm: 'Psalm 80:1-7', second: 'Hebrews 10:1-10', gospel: 'Luke 1:39-56' },
    },

    // ═══════════════ NAVIDAD Y EPIFANÍA ═══════════════
    christmas: { all: { first: 'Isaiah 9:1-7', psalm: 'Psalm 96', second: 'Titus 2:11-14', gospel: 'Luke 2:1-20', psalmAnt: 'Hoy nos ha nacido un Salvador.' } },
    christmasSunday: { all: { first: 'Isaiah 61:10-62:5', psalm: 'Psalm 147:12-20', second: 'Galatians 3:23-4:7', gospel: 'John 1:1-18' } },
    christmasSunday2: {
      A: { first: 'Jeremiah 31:7-14', psalm: 'Psalm 84', second: 'Ephesians 1:3-14', gospel: 'Luke 2:41-52' },
      B: { first: 'Jeremiah 31:7-14', psalm: 'Psalm 84', second: 'Ephesians 1:3-14', gospel: 'Matthew 2:13-23' },
      C: { first: 'Jeremiah 31:7-14', psalm: 'Psalm 84', second: 'Ephesians 1:3-14', gospel: 'Luke 2:22-40' },
    },
    epiphany: { all: { first: 'Isaiah 60:1-9', psalm: 'Psalm 72:1-11', second: 'Ephesians 3:1-13', gospel: 'Matthew 2:1-12' } },
    epiphany1: {
      A: { first: 'Isaiah 42:1-9', psalm: 'Psalm 89:20-29', second: 'Acts 10:34-38', gospel: 'Matthew 3:13-17' },
      B: { first: 'Isaiah 42:1-9', psalm: 'Psalm 89:20-29', second: 'Acts 10:34-38', gospel: 'Mark 1:7-11' },
      C: { first: 'Isaiah 42:1-9', psalm: 'Psalm 89:20-29', second: 'Acts 10:34-38', gospel: 'Luke 3:15-22' },
    },
    epiphany2: {
      A: { first: 'Exodus 12:21-28', psalm: 'Psalm 40:1-11', second: '1 Corinthians 1:1-9', gospel: 'John 1:29-42' },
      B: { first: '1 Samuel 3:1-20', psalm: 'Psalm 63:1-9,10-12v', second: '1 Corinthians 6:9-20', gospel: 'John 1:43-51' },
      C: { first: 'Isaiah 62:1-5', psalm: 'Psalm 96', second: '1 Corinthians 12:1-11', gospel: 'John 2:1-11' },
    },
    epiphany3: {
      A: { first: 'Amos 3:1-11', psalm: 'Psalm 139:1-18', second: '1 Corinthians 1:10-17', gospel: 'Matthew 4:12-22' },
      B: { first: 'Jeremiah 3:19-4:4', psalm: 'Psalm 130', second: '1 Corinthians 7:17-24', gospel: 'Mark 1:14-20' },
      C: { first: 'Nehemiah 8:1-12', psalm: 'Psalm 113', second: '1 Corinthians 12:12-27', gospel: 'Luke 4:14-21' },
    },
    epiphany4: {
      A: { first: 'Micah 6:1-8', psalm: 'Psalm 37:1-11', second: '1 Corinthians 1:18-31', gospel: 'Matthew 5:1-12' },
      B: { first: 'Deuteronomy 18:15-22', psalm: 'Psalm 111', second: '1 Corinthians 8:1-13', gospel: 'Mark 1:21-28' },
      C: { first: 'Jeremiah 1:4-10', psalm: 'Psalm 71:11-20', second: '1 Corinthians 14:12-25', gospel: 'Luke 4:21-32' },
    },
    epiphany5: {
      A: { first: '2 Kings 22:8-20', psalm: 'Psalm 27', second: '1 Corinthians 2:1-16', gospel: 'Matthew 5:13-20' },
      B: { first: '2 Kings 4:8-37', psalm: 'Psalm 142', second: '1 Corinthians 9:16-23', gospel: 'Mark 1:29-39' },
      C: { first: 'Judges 6:11-24', psalm: 'Psalm 85', second: '1 Corinthians 15:1-11', gospel: 'Luke 5:1-11' },
    },
    epiphany6: {
      A: { first: 'Sirach 15:11-20', psalm: 'Psalm 119:1-16', second: '1 Corinthians 3:1-9', gospel: 'Matthew 5:21-37' },
      B: { first: '2 Kings 5:1-15', psalm: 'Psalm 42:1-15', second: '1 Corinthians 9:24-27', gospel: 'Mark 1:40-45' },
      C: { first: 'Jeremiah 17:5-10', psalm: 'Psalm 1', second: '1 Corinthians 15:12-20', gospel: 'Luke 6:17-26' },
    },
    epiphany7: {
      A: { first: 'Leviticus 19:1-2,9-18', psalm: 'Psalm 71:11-23', second: '1 Corinthians 3:10-23', gospel: 'Matthew 5:38-48' },
      B: { first: 'Isaiah 43:18-25', psalm: 'Psalm 32', second: '2 Corinthians 1:18-22', gospel: 'Mark 2:1-12' },
      C: { first: 'Genesis 45:3-11,21-28', psalm: 'Psalm 37:1-17', second: '1 Corinthians 15:35-49', gospel: 'Luke 6:27-38' },
    },
    epiphany8: {
      A: { first: 'Isaiah 49:8-23', psalm: 'Psalm 62', second: '1 Corinthians 4:1-13', gospel: 'Matthew 6:24-34' },
      B: { first: 'Hosea 2:14-23', psalm: 'Psalm 103:1-14', second: '2 Corinthians 3:4-18', gospel: 'Mark 2:18-22' },
      C: { first: 'Jeremiah 7:1-15', psalm: 'Psalm 92', second: '1 Corinthians 15:50-58', gospel: 'Luke 6:39-49' },
    },
    transfiguration: {
      A: { first: 'Exodus 24:12-18', psalm: 'Psalm 99', second: 'Philippians 3:7-14', gospel: 'Matthew 17:1-9' },
      B: { first: '1 Kings 19:9-18', psalm: 'Psalm 27', second: '2 Peter 1:13-21', gospel: 'Mark 9:2-9' },
      C: { first: 'Exodus 34:29-35', psalm: 'Psalm 99', second: '1 Corinthians 12:27-13:13', gospel: 'Luke 9:28-36' },
    },

    // ═══════════════ CUARESMA Y SEMANA SANTA ═══════════════
    ashWednesday: { all: { first: 'Joel 2:1-2,12-17', psalm: 'Psalm 103:8-14', second: '2 Corinthians 5:20-6:10', gospel: 'Matthew 6:1-6,16-21', psalmAnt: 'El Señor es clemente y compasivo.' } },
    lent1: {
      A: { first: 'Genesis 2:4-9,15-17,2:25-3:7', psalm: 'Psalm 51:1-12', second: 'Romans 5:12-21', gospel: 'Matthew 4:1-11' },
      B: { first: 'Genesis 9:8-17', psalm: 'Psalm 25:3-9', second: '1 Peter 3:18-22', gospel: 'Mark 1:9-13' },
      C: { first: 'Deuteronomy 26:1-11', psalm: 'Psalm 91:9-16', second: 'Romans 10:4-13', gospel: 'Luke 4:1-13' },
    },
    lent2: {
      A: { first: 'Genesis 12:1-9', psalm: 'Psalm 33:12-21', second: 'Romans 4:1-17', gospel: 'John 3:1-16' },
      B: { first: 'Genesis 22:1-14', psalm: 'Psalm 16:6-12', second: 'Romans 8:31-39', gospel: 'Mark 8:31-38' },
      C: { first: 'Genesis 15:1-18', psalm: 'Psalm 27:9-17', second: 'Philippians 3:17-4:1', gospel: 'Luke 13:22-35' },
    },
    lent3: {
      A: { first: 'Exodus 17:1-7', psalm: 'Psalm 95', second: 'Romans 1:16-32', gospel: 'John 4:5-42' },
      B: { first: 'Exodus 20:1-21', psalm: 'Psalm 19:7-14', second: 'Romans 7:12-25', gospel: 'John 2:13-22' },
      C: { first: 'Exodus 3:1-15', psalm: 'Psalm 103:1-12', second: '1 Corinthians 10:1-13', gospel: 'Luke 13:1-17' },
    },
    lent4: {
      A: { first: '1 Samuel 16:1-13', psalm: 'Psalm 23', second: 'Ephesians 5:1-14', gospel: 'John 9:1-13,28-41' },
      B: { first: '2 Chronicles 36:14-23', psalm: 'Psalm 122', second: 'Ephesians 2:1-10', gospel: 'John 6:1-15' },
      C: { first: 'Joshua 4:19-24,5:1-12', psalm: 'Psalm 34:1-8', second: '2 Corinthians 5:17-21', gospel: 'Luke 15:11-32' },
    },
    lent5: {
      A: { first: 'Ezekiel 37:1-14', psalm: 'Psalm 130', second: 'Romans 6:15-23', gospel: 'John 11:1-44' },
      B: { first: 'Jeremiah 31:31-34', psalm: 'Psalm 51:10-15', second: 'Hebrews 4:14-16,5:1-10', gospel: 'John 12:20-36' },
      C: { first: 'Isaiah 43:16-21', psalm: 'Psalm 126', second: 'Philippians 3:7-16', gospel: 'Luke 20:9-19' },
    },
    palmSunday: {
      A: { first: 'Isaiah 52:13-53:12', psalm: 'Psalm 22:1-11', second: 'Philippians 2:5-11', gospel: 'Matthew 26:36-75,27:1-66' },
      B: { first: 'Isaiah 52:13-53:12', psalm: 'Psalm 22:1-11', second: 'Philippians 2:5-11', gospel: 'Mark 14:32-72,15:1-47' },
      C: { first: 'Isaiah 52:13-53:12', psalm: 'Psalm 22:1-11', second: 'Philippians 2:5-11', gospel: 'Luke 22:39-71,23:1-56' },
    },
    holyWeekFeria_1: { all: { first: 'Isaiah 42:1-9', psalm: 'Psalm 36:5-10', second: 'Hebrews 11:39-12:3', gospel: 'John 12:1-11' } },
    holyWeekFeria_2: { all: { first: 'Isaiah 49:1-6', psalm: 'Psalm 71:1-11', second: '1 Corinthians 1:18-31', gospel: 'John 12:37-38,42-50' } },
    holyWeekFeria_3: { all: { first: 'Isaiah 50:4-9', psalm: 'Psalm 69:6-14,21-22', second: 'Hebrews 9:11-28', gospel: 'Matthew 26:1-5,14-25' } },
    maundyThursday: { all: { first: 'Exodus 12:1-14', psalm: 'Psalm 78:15-26', second: '1 Corinthians 11:23-34', gospel: 'John 13:1-15' } },
    goodFriday: { all: { first: 'Genesis 22:1-18', psalm: 'Psalm 22:1-11,12-21v', second: 'Hebrews 10:1-25', gospel: 'John 18:1-40,19:1-37' } },
    holySaturday: { all: { first: 'Job 14:1-17', psalm: 'Psalm 31:1-6', second: '1 Peter 4:1-8', gospel: 'Matthew 27:57-66' } },

    // ═══════════════ PASCUA, ASCENSIÓN, PENTECOSTÉS Y TRINIDAD ═══════════════
    easter: {
      A: { first: 'Acts 10:34-43', psalm: 'Psalm 118:14-17,22-24', second: 'Colossians 3:1-4', gospel: 'John 20:1-18' },
      B: { first: 'Acts 10:34-43', psalm: 'Psalm 118:14-17,22-24', second: 'Colossians 3:1-4', gospel: 'Mark 16:1-8' },
      C: { first: 'Acts 10:34-43', psalm: 'Psalm 118:14-17,22-24', second: 'Colossians 3:1-4', gospel: 'Luke 24:1-12' },
    },
    easterFeria1_1: { all: { first: 'Acts 2:14,22-32', psalm: 'Psalm 16', second: null, gospel: 'Matthew 28:9-15' } },
    easterFeria1_2: { all: { first: 'Acts 2:14,36-41', psalm: 'Psalm 33:17-21', second: null, gospel: 'John 20:11-18' } },
    easterFeria1_3: { all: { first: 'Acts 3:1-10', psalm: 'Psalm 105:1-8', second: null, gospel: 'Luke 24:13-35' } },
    easterFeria1_4: { all: { first: 'Acts 3:11-26', psalm: 'Psalm 8', second: null, gospel: 'Luke 24:36-49' } },
    easterFeria1_5: { all: { first: '1 Peter 1:3-9', psalm: 'Psalm 116:1-9', second: null, gospel: 'John 21:1-14' } },
    easterFeria1_6: { all: { first: 'Acts 4:1-22', psalm: 'Psalm 118:14-18', second: null, gospel: 'Mark 16:9-20' } },
    easter2: {
      A: { first: 'Acts 2:14,22-32', psalm: 'Psalm 111', second: '1 Peter 1:3-9', gospel: 'John 20:19-31' },
      B: { first: 'Acts 3:12-15,17-26', psalm: 'Psalm 111', second: '1 John 5:1-5', gospel: 'John 20:19-31' },
      C: { first: 'Acts 5:12,17-22,25-29', psalm: 'Psalm 111', second: 'Revelation 1:1-19', gospel: 'John 20:19-31' },
    },
    easter3: {
      A: { first: 'Acts 2:14,36-47', psalm: 'Psalm 116:11-16', second: '1 Peter 1:13-25', gospel: 'Luke 24:13-35' },
      B: { first: 'Acts 4:5-14', psalm: 'Psalm 98:1-5', second: '1 John 1:1-2:2', gospel: 'Luke 24:36-49' },
      C: { first: 'Acts 9:1-19', psalm: 'Psalm 33:1-11', second: 'Revelation 5:1-14', gospel: 'John 21:1-14' },
    },
    easter4: {
      A: { first: 'Acts 6:1-9,7:2,51-60', psalm: 'Psalm 23', second: '1 Peter 2:13-25', gospel: 'John 10:1-10' },
      B: { first: 'Acts 4:23-37', psalm: 'Psalm 23', second: '1 John 3:1-10', gospel: 'John 10:11-16' },
      C: { first: 'Acts 13:14-16,26-39', psalm: 'Psalm 100', second: 'Revelation 7:9-17', gospel: 'John 10:22-30' },
    },
    easter5: {
      A: { first: 'Acts 17:1-15', psalm: 'Psalm 66:1-8', second: '1 Peter 2:1-12', gospel: 'John 14:1-14' },
      B: { first: 'Acts 8:26-40', psalm: 'Psalm 66:1-8', second: '1 John 3:11-24', gospel: 'John 14:15-21' },
      C: { first: 'Acts 13:44-52', psalm: 'Psalm 145:1-9', second: 'Revelation 19:1-9', gospel: 'John 13:31-35' },
    },
    easter6: {
      A: { first: 'Acts 17:16-34', psalm: 'Psalm 148:7-14', second: '1 Peter 3:8-18', gospel: 'John 15:1-11' },
      B: { first: 'Acts 11:19-30', psalm: 'Psalm 33:1-8,18-22', second: '1 John 4:7-21', gospel: 'John 15:9-17' },
      C: { first: 'Acts 14:8-18', psalm: 'Psalm 67', second: 'Revelation 21:1-4,21:22-22:5', gospel: 'John 14:21-29' },
    },
    ascension: { all: { first: 'Acts 1:1-11', psalm: 'Psalm 110:1-5', second: 'Ephesians 1:15-23', gospel: 'Luke 24:44-53' } },
    easter7: {
      A: { first: 'Acts 1:1-14', psalm: 'Psalm 68:1-20', second: '1 Peter 4:12-19', gospel: 'John 17:1-11' },
      B: { first: 'Acts 1:15-26', psalm: 'Psalm 68:1-20', second: '1 John 5:6-15', gospel: 'John 17:11-19' },
      C: { first: 'Acts 16:16-34', psalm: 'Psalm 68:1-20', second: 'Revelation 22:10-21', gospel: 'John 17:20-26' },
    },
    pentecost: { all: { first: 'Genesis 11:1-9', psalm: 'Psalm 104:24-35', second: 'Acts 2:1-21', gospel: 'John 14:8-17' } },
    trinitySunday: {
      A: { first: 'Genesis 1:1-2:3', psalm: 'Psalm 150', second: '2 Corinthians 13:5-14', gospel: 'Matthew 28:16-20' },
      B: { first: 'Exodus 3:1-6', psalm: 'Psalm 93', second: 'Romans 8:12-17', gospel: 'John 3:1-16' },
      C: { first: 'Isaiah 6:1-7', psalm: 'Psalm 29', second: 'Revelation 4:1-11', gospel: 'John 16:5-15' },
    },

    // ═══════════════ DOMINGOS DESPUÉS DE PENTECOSTÉS (PROPIOS) ═══════════════
    proper1: {
      A: { first: 'Sirach 15:11-20', psalm: 'Psalm 119:1-16', second: '1 Corinthians 3:1-9', gospel: 'Matthew 5:21-37' },
      B: { first: '2 Kings 5:1-15', psalm: 'Psalm 42', second: '1 Corinthians 9:24-27', gospel: 'Mark 1:40-45' },
      C: { first: 'Jeremiah 17:5-10', psalm: 'Psalm 1', second: '1 Corinthians 15:12-20', gospel: 'Luke 6:17-26' },
    },
    proper2: {
      A: { first: 'Leviticus 19:1-2,9-18', psalm: 'Psalm 71:11-23', second: '1 Corinthians 3:10-23', gospel: 'Matthew 5:38-48' },
      B: { first: 'Isaiah 43:18-25', psalm: 'Psalm 32', second: '2 Corinthians 1:18-22', gospel: 'Mark 2:1-12' },
      C: { first: 'Genesis 45:3-11,21-28', psalm: 'Psalm 37:1-17', second: '1 Corinthians 15:35-49', gospel: 'Luke 6:27-38' },
    },
    proper3: {
      A: { first: 'Isaiah 49:8-23', psalm: 'Psalm 62', second: '1 Corinthians 4:1-13', gospel: 'Matthew 6:24-34' },
      B: { first: 'Hosea 2:14-23', psalm: 'Psalm 103:1-14', second: '2 Corinthians 3:4-18', gospel: 'Mark 2:18-22' },
      C: { first: 'Jeremiah 7:1-15', psalm: 'Psalm 92', second: '1 Corinthians 15:50-58', gospel: 'Luke 6:39-49' },
    },
    proper4: {
      A: { first: 'Deuteronomy 11:18-32', psalm: 'Psalm 31:18-27', second: 'Romans 3:21-31', gospel: 'Matthew 7:21-27' },
      B: { first: 'Deuteronomy 5:6-21', psalm: 'Psalm 81:1-16', second: '2 Corinthians 4:1-12', gospel: 'Mark 2:23-28' },
      C: { first: '1 Kings 8:22-30,41-43', psalm: 'Psalm 96', second: 'Galatians 1:1-10', gospel: 'Luke 7:1-10' },
    },
    proper5: {
      A: { first: 'Hosea 5:15-6:6', psalm: 'Psalm 50', second: 'Romans 4:13-18', gospel: 'Matthew 9:9-13' },
      B: { first: 'Genesis 3:1-21', psalm: 'Psalm 130', second: '2 Corinthians 4:13-18', gospel: 'Mark 3:20-35' },
      C: { first: '1 Kings 17:17-24', psalm: 'Psalm 30', second: 'Galatians 1:11-24', gospel: 'Luke 7:11-17' },
    },
    proper6: {
      A: { first: 'Exodus 19:1-8', psalm: 'Psalm 100', second: 'Romans 5:1-11', gospel: 'Matthew 9:35-10:15' },
      B: { first: 'Ezekiel 31:1-14', psalm: 'Psalm 92', second: '2 Corinthians 5:1-10', gospel: 'Mark 4:26-34' },
      C: { first: '2 Samuel 11:26-12:15', psalm: 'Psalm 32:1-12', second: 'Galatians 2:11-21', gospel: 'Luke 7:36-8:3' },
    },
    proper7: {
      A: { first: 'Jeremiah 20:7-13', psalm: 'Psalm 69:1-15,16-18v', second: 'Romans 5:15-19', gospel: 'Matthew 10:16-33' },
      B: { first: 'Job 38:1-18', psalm: 'Psalm 107:1-32', second: '2 Corinthians 5:14-21', gospel: 'Mark 4:35-41,5:1-20' },
      C: { first: 'Zechariah 12:8-10,13:1', psalm: 'Psalm 63', second: 'Galatians 3:23-29', gospel: 'Luke 9:18-24' },
    },
    proper8: {
      A: { first: 'Isaiah 2:10-17', psalm: 'Psalm 89:1-18', second: 'Romans 6:1-11', gospel: 'Matthew 10:34-42' },
      B: { first: 'Deuteronomy 15:7-11', psalm: 'Psalm 112', second: '2 Corinthians 8:1-15', gospel: 'Mark 5:22-43' },
      C: { first: '1 Kings 19:15-21', psalm: 'Psalm 16', second: 'Galatians 5:1,13-25', gospel: 'Luke 9:51-62' },
    },
    proper9: {
      A: { first: 'Zechariah 9:9-12', psalm: 'Psalm 145:1-13,14-21v', second: 'Romans 7:21-8:6', gospel: 'Matthew 11:25-30' },
      B: { first: 'Ezekiel 2:1-7', psalm: 'Psalm 123', second: '2 Corinthians 12:2-10', gospel: 'Mark 6:1-6' },
      C: { first: 'Isaiah 66:10-16', psalm: 'Psalm 66:1-8', second: 'Galatians 6:1-18', gospel: 'Luke 10:1-20' },
    },
    proper10: {
      A: { first: 'Isaiah 55', psalm: 'Psalm 65', second: 'Romans 8:7-17', gospel: 'Matthew 13:1-9,18-23' },
      B: { first: 'Amos 7:7-15', psalm: 'Psalm 85', second: 'Ephesians 1:1-23', gospel: 'Mark 6:7-13' },
      C: { first: 'Deuteronomy 30:9-14', psalm: 'Psalm 25:1-14,15-21v', second: 'Colossians 1:1-14', gospel: 'Luke 10:25-37' },
    },
    proper11: {
      A: { first: 'Wisdom 12:13,16-19', psalm: 'Psalm 86', second: 'Romans 8:18-25', gospel: 'Matthew 13:24-30,34-43' },
      B: { first: 'Isaiah 57:14-21', psalm: 'Psalm 22:23-31', second: 'Ephesians 2:11-22', gospel: 'Mark 6:30-44' },
      C: { first: 'Genesis 18:1-14', psalm: 'Psalm 15', second: 'Colossians 1:21-29', gospel: 'Luke 10:38-42' },
    },
    proper12: {
      A: { first: '1 Kings 3:3-14', psalm: 'Psalm 119:121-136', second: 'Romans 8:26-34', gospel: 'Matthew 13:31-33,44-50' },
      B: { first: '2 Kings 2:1-15', psalm: 'Psalm 114', second: 'Ephesians 3:1-21', gospel: 'Mark 6:45-52' },
      C: { first: 'Genesis 18:20-33', psalm: 'Psalm 138', second: 'Colossians 2:6-15', gospel: 'Luke 11:1-13' },
    },
    proper13: {
      A: { first: 'Nehemiah 9:16-21', psalm: 'Psalm 78:1-26', second: 'Romans 8:35-39', gospel: 'Matthew 14:13-21' },
      B: { first: 'Exodus 16:2-15', psalm: 'Psalm 78:1-26', second: 'Ephesians 4:1-16', gospel: 'John 6:24-35' },
      C: { first: 'Ecclesiastes 1:12-2:11', psalm: 'Psalm 49:1-12,13-21v', second: 'Colossians 3:5-17', gospel: 'Luke 12:13-21' },
    },
    proper14: {
      A: { first: 'Jonah 2:1-10', psalm: 'Psalm 29', second: 'Romans 9:1-5', gospel: 'Matthew 14:22-33' },
      B: { first: 'Deuteronomy 8:1-10', psalm: 'Psalm 34:1-22', second: 'Ephesians 4:17-5:2', gospel: 'John 6:37-51' },
      C: { first: 'Genesis 15:1-6', psalm: 'Psalm 33,1-9,10-21', second: 'Hebrews 11:1-16', gospel: 'Luke 12:32-40' },
    },
    proper15: {
      A: { first: 'Isaiah 56:1-8', psalm: 'Psalm 67', second: 'Romans 11:13-24', gospel: 'Matthew 15:21-28' },
      B: { first: 'Proverbs 9:1-6', psalm: 'Psalm 147', second: 'Ephesians 5:3-14', gospel: 'John 6:53-59' },
      C: { first: 'Jeremiah 23:23-29', psalm: 'Psalm 82', second: 'Hebrews 12:1-14', gospel: 'Luke 12:49-56' },
    },
    proper16: {
      A: { first: 'Isaiah 51:1-6', psalm: 'Psalm 138', second: 'Romans 11:25-36', gospel: 'Matthew 16:13-20' },
      B: { first: 'Joshua 24:1-2,14-25', psalm: 'Psalm 16', second: 'Ephesians 5:15-33,6:1-9', gospel: 'John 6:60-69' },
      C: { first: 'Isaiah 28:14-22', psalm: 'Psalm 46', second: 'Hebrews 12:15-29', gospel: 'Luke 13:22-30' },
    },
    proper17: {
      A: { first: 'Jeremiah 15:15-21', psalm: 'Psalm 26', second: 'Romans 12:1-8', gospel: 'Matthew 16:21-27' },
      B: { first: 'Deuteronomy 4:1-9', psalm: 'Psalm 15', second: 'Ephesians 6:10-20', gospel: 'Mark 7:1-23' },
      C: { first: 'Sirach 10:7-18', psalm: 'Psalm 112', second: 'Hebrews 13:1-8', gospel: 'Luke 14:1,7-14' },
    },
    proper18: {
      A: { first: 'Ezekiel 33:1-11', psalm: 'Psalm 119:33-48', second: 'Romans 12:9-21', gospel: 'Matthew 18:15-20' },
      B: { first: 'Isaiah 35:4-7', psalm: 'Psalm 146', second: 'James 1:17-27', gospel: 'Mark 7:31-37' },
      C: { first: 'Deuteronomy 30:15-20', psalm: 'Psalm 1', second: 'Philemon 1-3,4-21,22-25', gospel: 'Luke 14:25-33' },
    },
    proper19: {
      A: { first: 'Sirach 27:30-28:7', psalm: 'Psalm 103:1-14', second: 'Romans 14:5-12', gospel: 'Matthew 18:21-35' },
      B: { first: 'Isaiah 50:4-9', psalm: 'Psalm 116:1-9,10-16v', second: 'James 2:1-18', gospel: 'Mark 9:14-29' },
      C: { first: 'Exodus 32:1,7-14', psalm: 'Psalm 51:1-17', second: '1 Timothy 1:12-17', gospel: 'Luke 15:1-10' },
    },
    proper20: {
      A: { first: 'Jonah 3:10-4:11', psalm: 'Psalm 145:1-21', second: 'Philippians 1:21-27', gospel: 'Matthew 20:1-16' },
      B: { first: 'Wisdom 1:16-2:1,12-22', psalm: 'Psalm 54', second: 'James 3:16-4:6', gospel: 'Mark 9:30-37' },
      C: { first: 'Amos 8:4-12', psalm: 'Psalm 138', second: '1 Timothy 2:1-15', gospel: 'Luke 16:1-13' },
    },
    proper21: {
      A: { first: 'Ezekiel 18:1-4,25-32', psalm: 'Psalm 25:1-21', second: 'Philippians 2:1-13', gospel: 'Matthew 21:28-32' },
      B: { first: 'Numbers 11:4-6,10-17,24-29', psalm: 'Psalm 19:1-14', second: 'James 4:7-12,4:13-5:6', gospel: 'Mark 9:38-48' },
      C: { first: 'Amos 6:1-7', psalm: 'Psalm 146', second: '1 Timothy 6:11-19', gospel: 'Luke 16:19-31' },
    },
    proper22: {
      A: { first: 'Isaiah 5:1-7', psalm: 'Psalm 80:1-19', second: 'Philippians 3:14-21', gospel: 'Matthew 21:33-44' },
      B: { first: 'Genesis 2:18-24', psalm: 'Psalm 8', second: 'Hebrews 2:1-18', gospel: 'Mark 10:2-16' },
      C: { first: 'Habakkuk 1:1-13,2:1-4', psalm: 'Psalm 37:1-17', second: '2 Timothy 1:1-14', gospel: 'Luke 17:5-10' },
    },
    proper23: {
      A: { first: 'Isaiah 25:1-9', psalm: 'Psalm 23', second: 'Philippians 4:4-13', gospel: 'Matthew 22:1-14' },
      B: { first: 'Amos 5:6-15', psalm: 'Psalm 90:1-17', second: 'Hebrews 3:1-6', gospel: 'Mark 10:17-31' },
      C: { first: 'Ruth 1:1-19', psalm: 'Psalm 113', second: '2 Timothy 2:1-15', gospel: 'Luke 17:11-19' },
    },
    proper24: {
      A: { first: 'Malachi 3:6-12', psalm: 'Psalm 96', second: '1 Thessalonians 1:1-10', gospel: 'Matthew 22:15-22' },
      B: { first: 'Isaiah 53:4-12', psalm: 'Psalm 91', second: 'Hebrews 4:12-16', gospel: 'Mark 10:35-45' },
      C: { first: 'Genesis 32:3-8,22-30', psalm: 'Psalm 121', second: '2 Timothy 3:14-4:5', gospel: 'Luke 18:1-8' },
    },
    proper25: {
      A: { first: 'Exodus 22:21-27', psalm: 'Psalm 1', second: '1 Thessalonians 2:1-8', gospel: 'Matthew 22:34-46' },
      B: { first: 'Isaiah 59:9-20', psalm: 'Psalm 13', second: 'Hebrews 5:11-6:12', gospel: 'Mark 10:46-52' },
      C: { first: 'Jeremiah 14:1-10,19-22', psalm: 'Psalm 84', second: '2 Timothy 4:6-18', gospel: 'Luke 18:9-14' },
    },
    proper26: {
      A: { first: 'Micah 3:5-12', psalm: 'Psalm 43', second: '1 Thessalonians 2:9-20', gospel: 'Matthew 23:1-12' },
      B: { first: 'Deuteronomy 6:1-9', psalm: 'Psalm 119:1-16', second: 'Hebrews 7:23-28', gospel: 'Mark 12:28-34' },
      C: { first: 'Isaiah 1:10-20', psalm: 'Psalm 32', second: '2 Thessalonians 1:1-12', gospel: 'Luke 19:1-10' },
    },
    proper27: {
      A: { first: 'Amos 5:18-24', psalm: 'Psalm 70', second: '1 Thessalonians 4:13-18', gospel: 'Matthew 25:1-13' },
      B: { first: '1 Kings 17:8-16', psalm: 'Psalm 146', second: 'Hebrews 9:24-28', gospel: 'Mark 12:38-44' },
      C: { first: 'Job 19:23-27', psalm: 'Psalm 17', second: '2 Thessalonians 2:13-3:5', gospel: 'Luke 20:27-38' },
    },
    proper28: {
      A: { first: 'Zephaniah 1:7,12-18', psalm: 'Psalm 90:1-17', second: '1 Thessalonians 5:1-10', gospel: 'Matthew 25:14-30' },
      B: { first: 'Daniel 12:1-13', psalm: 'Psalm 16', second: 'Hebrews 10:31-39', gospel: 'Mark 13:14-23' },
      C: { first: 'Malachi 3:13-4:6', psalm: 'Psalm 98', second: '2 Thessalonians 3:6-16', gospel: 'Luke 21:5-19' },
    },
    proper29: {
      A: { first: 'Ezekiel 34:11-20', psalm: 'Psalm 95', second: '1 Corinthians 15:20-28', gospel: 'Matthew 25:31-46' },
      B: { first: 'Daniel 7:9-14', psalm: 'Psalm 93', second: 'Revelation 1:1-8', gospel: 'John 18:33-37', psalmAnt: 'El Señor reina, vestido de majestad.' },
      C: { first: 'Jeremiah 23:1-6', psalm: 'Psalm 46', second: 'Colossians 1:11-20', gospel: 'Luke 23:35-43' },
    },

    // ═══════════════ SANTORAL FIJO ═══════════════
    '01-01': { all: { first: 'Exodus 34:1-9', psalm: 'Psalm 8', second: 'Romans 1:1-7', gospel: 'Luke 2:15-21' } },
    '01-18': { all: { first: 'Acts 4:8-13', psalm: 'Psalm 23', second: '1 Peter 5:1-11', gospel: 'Matthew 16:13-19' } },
    '01-25': { all: { first: 'Acts 26:9-21', psalm: 'Psalm 67', second: 'Galatians 1:11-24', gospel: 'Matthew 10:16-25' } },
    '02-02': { all: { first: 'Malachi 3:1-4', psalm: 'Psalm 84', second: 'Hebrews 2:14-18', gospel: 'Luke 2:22-40' } },
    '02-24': { all: { first: 'Acts 1:15-26', psalm: 'Psalm 15', second: 'Philippians 3:12-21', gospel: 'John 15:1-16' } },
    '03-19': { all: { first: '2 Samuel 7:4,8-16', psalm: 'Psalm 89:1-29', second: 'Romans 4:13-18', gospel: 'Luke 2:41-52' } },
    '03-25': { all: { first: 'Isaiah 7:10-14', psalm: 'Psalm 40:1-13', second: 'Hebrews 10:5-10', gospel: 'Luke 1:26-38' } },
    '04-25': { all: { first: 'Isaiah 52:7-10', psalm: 'Psalm 2', second: 'Ephesians 4:7-8,11-16', gospel: 'Mark 16:15-20' } },
    '05-01': { all: { first: 'Isaiah 30:18-21', psalm: 'Psalm 119:33-40', second: '2 Corinthians 4:1-7', gospel: 'John 14:6-14' } },
    '05-31': { all: { first: 'Zephaniah 3:14-18', psalm: 'Psalm 113', second: 'Colossians 3:12-17', gospel: 'Luke 1:39-56' } },
    '06-11': { all: { first: 'Isaiah 42:5-12', psalm: 'Psalm 112', second: 'Acts 11:19-30,13:1-3', gospel: 'Matthew 10:7-16' } },
    '06-24': { all: { first: 'Isaiah 40:1-11', psalm: 'Psalm 85:7-13', second: 'Acts 13:14-26', gospel: 'Luke 1:57-80' } },
    '06-29': { all: { first: 'Ezekiel 34:11-16', psalm: 'Psalm 87', second: '2 Timothy 4:1-8', gospel: 'John 21:15-19' } },
    '07-22': { all: { first: 'Judges 4:4-10', psalm: 'Psalm 42:1-15', second: '2 Corinthians 5:14-20', gospel: 'John 20:11-18' } },
    '07-25': { all: { first: 'Jeremiah 45:1-5', psalm: 'Psalm 7:1-18', second: 'Acts 11:27-12:3', gospel: 'Matthew 20:20-28' } },
    '08-06': { all: { first: 'Exodus 34:29-35', psalm: 'Psalm 99', second: '2 Peter 1:13-21', gospel: 'Luke 9:28-36' } },
    '08-15': { all: { first: 'Isaiah 61:10-11', psalm: 'Psalm 34', second: 'Galatians 4:4-7', gospel: 'Luke 1:46-55' } },
    '08-24': { all: { first: 'Deuteronomy 18:15-18', psalm: 'Psalm 91', second: '1 Corinthians 4:9-16', gospel: 'Luke 22:24-30' } },
    '09-14': { all: { first: 'Isaiah 45:21-25', psalm: 'Psalm 98', second: 'Philippians 2:5-11', gospel: 'John 12:31-36' } },
    '09-21': { all: { first: 'Proverbs 3:1-12', psalm: 'Psalm 119:33-40', second: '2 Timothy 3:1-17', gospel: 'Matthew 9:9-13' } },
    '09-29': { all: { first: 'Genesis 28:10-17', psalm: 'Psalm 103', second: 'Revelation 12:7-12', gospel: 'John 1:47-51' } },
    '10-18': { all: { first: 'Sirach 38:1-14', psalm: 'Psalm 147:1-11', second: '2 Timothy 4:1-13', gospel: 'Luke 4:14-21' } },
    '10-23': { all: { first: 'Acts 15:12-22', psalm: 'Psalm 1', second: '1 Corinthians 15:1-11', gospel: 'Matthew 13:54-58' } },
    '10-28': { all: { first: 'Deuteronomy 32:1-4', psalm: 'Psalm 119:89-96', second: 'Ephesians 2:13-22', gospel: 'John 15:17-27' } },
    '11-01': { all: { first: 'Sirach 44:1-14', psalm: 'Psalm 149', second: 'Revelation 7:9-17', gospel: 'Matthew 5:1-12' } },
    '11-30': { all: { first: 'Deuteronomy 30:11-14', psalm: 'Psalm 19:1-6', second: 'Romans 10:8-18', gospel: 'Matthew 4:18-22' } },
    '12-21': { all: { first: 'Habakkuk 2:1-4', psalm: 'Psalm 126', second: 'Hebrews 10:35-11:1', gospel: 'John 20:19-29' } },
    '12-26': { all: { first: 'Jeremiah 26:1-15', psalm: 'Psalm 31:1-6,7-27v', second: 'Acts 6:8-7:2,51-60', gospel: 'Matthew 23:29-39' } },
    '12-27': { all: { first: 'Exodus 33:18-23', psalm: 'Psalm 92:1-14', second: '1 John 1', gospel: 'John 21:9-25' } },
    '12-28': { all: { first: 'Jeremiah 31:15-17', psalm: 'Psalm 124', second: 'Revelation 21:1-7', gospel: 'Matthew 2:13-18' } },
  };

  function getSundayReadings(key, cycle) {
    const entry = SUNDAY[key];
    if (!entry) return null;
    return entry.all || entry[cycle] || entry.A || null;
  }

  return { SUNDAY, getSundayReadings };
})();
