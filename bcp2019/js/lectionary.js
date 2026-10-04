/**
 * lectionary.js — Leccionario Dominical (Leccionario Común Revisado, 3 años)
 * Libro de Oración Común (2019), ACNA
 *
 * AVISO DE FUENTE: reconstruido de memoria a partir del Leccionario Común
 * Revisado (RCL) ecuménico estándar — el propio libro (páginas 716-733) no
 * estaba disponible al construirlo. Las referencias de Evangelio y Epístola
 * siguen el patrón de "lectura continua" bien documentado del RCL; las del
 * Antiguo Testamento usan la pista "complementaria" (temáticamente ligada al
 * Evangelio), la más cercana al uso tradicional anglicano. Verificar contra
 * el texto oficial si se obtiene — ver bcp2019/VERIFICACION-BCP2019.md.
 *
 * Formato de referencia: en inglés (compatible con js/lib/biblia-wrapper.js
 * y BCPUtils.translateBibleReference), p.ej. "Genesis 1:1-5".
 */

const BCPLectionary = (() => {

  const SUNDAY = {

    // ═══════════════ ADVIENTO ═══════════════
    advent1: {
      A: { first: 'Isaiah 2:1-5', psalm: 'Psalm 122', second: 'Romans 13:8-14', gospel: 'Matthew 24:29-44' },
      B: { first: 'Isaiah 63:19,64:1-8', psalm: 'Psalm 80:1-7', second: '1 Corinthians 1:1-9', gospel: 'Mark 13:24-37' },
      C: { first: 'Jeremiah 33:14-16', psalm: 'Psalm 25:1-9', second: '1 Thessalonians 3:9-13', gospel: 'Luke 21:25-36' },
    },
    advent2: {
      A: { first: 'Isaiah 11:1-10', psalm: 'Psalm 72:1-8', second: 'Romans 15:4-13', gospel: 'Matthew 3:1-12' },
      B: { first: 'Isaiah 40:1-11', psalm: 'Psalm 85:8-13', second: '2 Peter 3:8-15', gospel: 'Mark 1:1-8' },
      C: { first: 'Baruch 5:1-9', psalm: 'Psalm 126', second: 'Philippians 1:3-11', gospel: 'Luke 3:1-6' },
    },
    advent3: {
      A: { first: 'Isaiah 35:1-10', psalm: 'Psalm 146:4-9', second: 'James 5:7-10', gospel: 'Matthew 11:2-11' },
      B: { first: 'Isaiah 61:1-4', psalm: 'Psalm 126', second: '1 Thessalonians 5:16-24', gospel: 'John 1:6-8' },
      C: { first: 'Zephaniah 3:14-20', psalm: 'Isaiah 12:2-6', second: 'Philippians 4:4-7', gospel: 'Luke 3:7-18' },
    },
    advent4: {
      A: { first: 'Isaiah 7:10-16', psalm: 'Psalm 80:1-7', second: 'Romans 1:1-7', gospel: 'Matthew 1:18-25' },
      B: { first: '2 Samuel 7:1-11', psalm: 'Luke 1:46-55', second: 'Romans 16:25-27', gospel: 'Luke 1:26-38' },
      C: { first: 'Micah 5:1-4', psalm: 'Luke 1:46-55', second: 'Hebrews 10:5-10', gospel: 'Luke 1:39-45' },
    },

    // ═══════════════ NAVIDAD Y EPIFANÍA ═══════════════
    christmas: {
      all: { first: 'Isaiah 9:1-6', psalm: 'Psalm 96', second: 'Titus 2:11-14', gospel: 'Luke 2:1-20', psalmAnt: 'Hoy nos ha nacido un Salvador.' },
    },
    christmasSunday: {
      A: { first: 'Isaiah 63:7-9', psalm: 'Psalm 148', second: 'Hebrews 2:10-18', gospel: 'Matthew 2:13-23' },
      B: { first: 'Isaiah 61:10-62:3', psalm: 'Psalm 148', second: 'Galatians 4:4-7', gospel: 'Luke 2:22-40' },
      C: { first: '1 Samuel 2:18-20', psalm: 'Psalm 148', second: 'Colossians 3:12-17', gospel: 'Luke 2:41-52' },
    },
    circumcision: {
      all: { first: 'Numbers 6:22-27', psalm: 'Psalm 8', second: 'Galatians 4:4-7', gospel: 'Luke 2:15-21' },
    },
    christmasSunday2: {
      all: { first: 'Jeremiah 31:7-14', psalm: 'Psalm 84', second: 'Ephesians 1:3-14', gospel: 'John 1:1-18' },
    },
    epiphany: {
      all: { first: 'Isaiah 60:1-6', psalm: 'Psalm 72:1-7', second: 'Ephesians 3:1-12', gospel: 'Matthew 2:1-12', psalmAnt: 'Todos los reyes te rendirán homenaje.' },
    },
    epiphany1: {
      A: { first: 'Isaiah 42:1-9', psalm: 'Psalm 29', second: 'Acts 10:34-43', gospel: 'Matthew 3:13-17' },
      B: { first: 'Genesis 1:1-5', psalm: 'Psalm 29', second: 'Acts 19:1-7', gospel: 'Mark 1:4-11' },
      C: { first: 'Isaiah 43:1-7', psalm: 'Psalm 29', second: 'Acts 8:14-17', gospel: 'Luke 3:15-17' },
    },
    epiphany2: {
      A: { first: 'Isaiah 49:1-7', psalm: 'Psalm 40:1-11', second: '1 Corinthians 1:1-9', gospel: 'John 1:29-42' },
      B: { first: '1 Samuel 3:1-10', psalm: 'Psalm 139:1-5', second: '1 Corinthians 6:12-20', gospel: 'John 1:43-51' },
      C: { first: 'Isaiah 62:1-5', psalm: 'Psalm 36:5-10', second: '1 Corinthians 12:1-11', gospel: 'John 2:1-11' },
    },
    epiphany3: {
      A: { first: 'Isaiah 8:23-9:3', psalm: 'Psalm 27:1-9', second: '1 Corinthians 1:10-18', gospel: 'Matthew 4:12-23' },
      B: { first: 'Jonah 3:1-5', psalm: 'Psalm 62:5-12', second: '1 Corinthians 7:29-31', gospel: 'Mark 1:14-20' },
      C: { first: 'Nehemiah 8:1-10', psalm: 'Psalm 19', second: '1 Corinthians 12:12-31', gospel: 'Luke 4:14-21' },
    },
    epiphany4: {
      A: { first: 'Micah 6:1-8', psalm: 'Psalm 15', second: '1 Corinthians 1:18-31', gospel: 'Matthew 5:1-12' },
      B: { first: 'Deuteronomy 18:15-20', psalm: 'Psalm 111', second: '1 Corinthians 8:1-13', gospel: 'Mark 1:21-28' },
      C: { first: 'Jeremiah 1:4-10', psalm: 'Psalm 71:1-6', second: '1 Corinthians 13:1-13', gospel: 'Luke 4:21-30' },
    },
    epiphany5: {
      A: { first: 'Isaiah 58:1-9', psalm: 'Psalm 112:1-9', second: '1 Corinthians 2:1-12', gospel: 'Matthew 5:13-20' },
      B: { first: 'Isaiah 40:21-31', psalm: 'Psalm 147:1-11', second: '1 Corinthians 9:16-23', gospel: 'Mark 1:29-39' },
      C: { first: 'Isaiah 6:1-8', psalm: 'Psalm 138', second: '1 Corinthians 15:1-11', gospel: 'Luke 5:1-11' },
    },
    epiphany6: {
      A: { first: 'Deuteronomy 30:15-20', psalm: 'Psalm 119:1-8', second: '1 Corinthians 3:1-9', gospel: 'Matthew 5:21-37' },
      B: { first: '2 Kings 5:1-14', psalm: 'Psalm 30', second: '1 Corinthians 9:24-27', gospel: 'Mark 1:40-45' },
      C: { first: 'Jeremiah 17:5-10', psalm: 'Psalm 1', second: '1 Corinthians 15:12-20', gospel: 'Luke 6:17-26' },
    },
    epiphany7: {
      A: { first: 'Leviticus 19:1-2', psalm: 'Psalm 119:33-40', second: '1 Corinthians 3:10-23', gospel: 'Matthew 5:38-48' },
      B: { first: 'Isaiah 43:18-25', psalm: 'Psalm 41', second: '2 Corinthians 1:18-22', gospel: 'Mark 2:1-12' },
      C: { first: 'Genesis 45:3-11', psalm: 'Psalm 37:1-12', second: '1 Corinthians 15:35-49', gospel: 'Luke 6:27-38' },
    },
    epiphany8: {
      A: { first: 'Isaiah 49:8-16', psalm: 'Psalm 131', second: '1 Corinthians 4:1-13', gospel: 'Matthew 6:24-34' },
      B: { first: 'Hosea 2:16-22', psalm: 'Psalm 103:1-13', second: '2 Corinthians 3:1-6', gospel: 'Mark 2:18-22' },
      C: { first: 'Isaiah 55:10-13', psalm: 'Psalm 92:1-4', second: '1 Corinthians 15:50-58', gospel: 'Luke 6:39-49' },
    },
    transfiguration: {
      A: { first: 'Exodus 24:12-18', psalm: 'Psalm 2', second: '2 Peter 1:16-21', gospel: 'Matthew 17:1-9' },
      B: { first: '2 Kings 2:1-12', psalm: 'Psalm 50:1-6', second: '2 Corinthians 4:3-6', gospel: 'Mark 9:2-9' },
      C: { first: 'Exodus 34:29-35', psalm: 'Psalm 99', second: '2 Corinthians 3:12-4:2', gospel: 'Luke 9:28-36' },
    },

    // ═══════════════ CUARESMA ═══════════════
    ashWednesday: {
      all: { first: 'Joel 2:1-2', psalm: 'Psalm 103:8-14', second: '2 Corinthians 5:20-6:10', gospel: 'Matthew 6:1-6', psalmAnt: 'El Señor es clemente y compasivo.' },
    },
    lent1: {
      A: { first: 'Genesis 2:15-17', psalm: 'Psalm 32', second: 'Romans 5:12-19', gospel: 'Matthew 4:1-11' },
      B: { first: 'Genesis 9:8-17', psalm: 'Psalm 25:1-9', second: '1 Peter 3:18-22', gospel: 'Mark 1:9-13' },
      C: { first: 'Deuteronomy 26:1-11', psalm: 'Psalm 91:1-2', second: 'Romans 10:8-13', gospel: 'Luke 4:1-13' },
    },
    lent2: {
      A: { first: 'Genesis 12:1-4', psalm: 'Psalm 121', second: 'Romans 4:1-5', gospel: 'John 3:1-17' },
      B: { first: 'Genesis 17:1-7', psalm: 'Psalm 22:22-30', second: 'Romans 4:13-25', gospel: 'Mark 8:31-38' },
      C: { first: 'Genesis 15:1-12', psalm: 'Psalm 27', second: 'Philippians 3:17-4:1', gospel: 'Luke 13:31-35' },
    },
    lent3: {
      A: { first: 'Exodus 17:1-7', psalm: 'Psalm 95', second: 'Romans 5:1-11', gospel: 'John 4:5-42' },
      B: { first: 'Exodus 20:1-17', psalm: 'Psalm 19', second: '1 Corinthians 1:18-25', gospel: 'John 2:13-22' },
      C: { first: 'Isaiah 55:1-9', psalm: 'Psalm 63:1-8', second: '1 Corinthians 10:1-13', gospel: 'Luke 13:1-9' },
    },
    lent4: {
      A: { first: '1 Samuel 16:1-13', psalm: 'Psalm 23', second: 'Ephesians 5:8-14', gospel: 'John 9:1-41' },
      B: { first: 'Numbers 21:4-9', psalm: 'Psalm 107:1-3', second: 'Ephesians 2:1-10', gospel: 'John 3:14-21' },
      C: { first: 'Joshua 5:9-12', psalm: 'Psalm 32', second: '2 Corinthians 5:16-21', gospel: 'Luke 15:1-3' },
    },
    lent5: {
      A: { first: 'Ezekiel 37:1-14', psalm: 'Psalm 130', second: 'Romans 8:6-11', gospel: 'John 11:1-45' },
      B: { first: 'Jeremiah 31:31-34', psalm: 'Psalm 51:1-13', second: 'Hebrews 5:5-10', gospel: 'John 12:20-33' },
      C: { first: 'Isaiah 43:16-21', psalm: 'Psalm 126', second: 'Philippians 3:4-14', gospel: 'John 12:1-8' },
    },

    // ═══════════════ SEMANA SANTA ═══════════════
    palmSunday: {
      A: { first: 'Isaiah 50:4-9', psalm: 'Psalm 31:9-16', second: 'Philippians 2:5-11', gospel: 'Matthew 26:14-27:66' },
      B: { first: 'Isaiah 50:4-9', psalm: 'Psalm 31:9-16', second: 'Philippians 2:5-11', gospel: 'Mark 14:1-15:47' },
      C: { first: 'Isaiah 50:4-9', psalm: 'Psalm 31:9-16', second: 'Philippians 2:5-11', gospel: 'Luke 22:14-23:56' },
    },
    // Lunes, Martes y Miércoles Santos (calendar.js los emite como
    // holyWeekFeria_1/2/3). El BCP 2019 no asigna lecturas propias a estos
    // tres días: estas tres entradas NO provienen del leccionario del BCP 2019
    // sino del MISAL ROMANO, por decisión expresa del usuario, y se copiaron
    // de js/lectionary.js (Misal Anglicano de la raíz) SOLO como referencias
    // bíblicas. No llevan antífona de salmo (no se copia texto litúrgico).
    holyWeekFeria_1: {
      all: { first: 'Isaiah 50:5-10', psalm: 'Psalm 35:1-3', second: null, gospel: 'John 12:1-9' },
    },
    holyWeekFeria_2: {
      all: { first: 'Jeremiah 11:18-20', psalm: 'Psalm 67:1-2', second: null, gospel: 'John 13:21-38' },
    },
    holyWeekFeria_3: {
      all: { first: 'Isaiah 62:11-63:7', psalm: 'Psalm 102:1-2', second: null, gospel: 'Luke 22:39-71,23:1-53' },
    },
    maundyThursday: {
      all: { first: 'Exodus 12:1-14', psalm: 'Psalm 116:1-2', second: '1 Corinthians 11:23-26', gospel: 'John 13:1-17' },
    },
    goodFriday: {
      all: { first: 'Isaiah 52:13-53:12', psalm: 'Psalm 22:1-11', second: 'Hebrews 10:1-25', gospel: 'John 18:1-19:37' },
    },
    holySaturday: {
      all: { first: 'Job 14:1-14', psalm: 'Psalm 130', second: '1 Peter 4:1-8', gospel: 'Matthew 27:57-66' },
    },

    // ═══════════════ PASCUA ═══════════════
    easter: {
      A: { first: 'Acts 10:34-43', psalm: 'Psalm 118:1-2', second: 'Colossians 3:1-4', gospel: 'John 20:1-18', psalmAnt: 'Este es el día que hizo el Señor: alegrémonos y gocemos en él.' },
      B: { first: 'Acts 10:34-43', psalm: 'Psalm 118:1-2', second: '1 Corinthians 15:1-11', gospel: 'Mark 16:1-8', psalmAnt: 'Este es el día que hizo el Señor: alegrémonos y gocemos en él.' },
      C: { first: 'Acts 10:34-43', psalm: 'Psalm 118:1-2', second: '1 Corinthians 15:19-26', gospel: 'Luke 24:1-12', psalmAnt: 'Este es el día que hizo el Señor: alegrémonos y gocemos en él.' },
    },
    easter2: {
      A: { first: 'Acts 2:14,22-32', psalm: 'Psalm 16', second: '1 Peter 1:3-9', gospel: 'John 20:19-31' },
      B: { first: 'Acts 4:32-35', psalm: 'Psalm 133', second: '1 John 1:1-2:2', gospel: 'John 20:19-31' },
      C: { first: 'Acts 5:27-32', psalm: 'Psalm 118:14-29', second: 'Revelation 1:4-8', gospel: 'John 20:19-31' },
    },
    easter3: {
      A: { first: 'Acts 2:14,36-41', psalm: 'Psalm 116:1-4', second: '1 Peter 1:17-23', gospel: 'Luke 24:13-35' },
      B: { first: 'Acts 3:12-19', psalm: 'Psalm 4', second: '1 John 3:1-7', gospel: 'Luke 24:36-48' },
      C: { first: 'Acts 9:1-6', psalm: 'Psalm 30', second: 'Revelation 5:11-14', gospel: 'John 21:1-19' },
    },
    easter4: {
      A: { first: 'Acts 2:42-47', psalm: 'Psalm 23', second: '1 Peter 2:19-25', gospel: 'John 10:1-10' },
      B: { first: 'Acts 4:5-12', psalm: 'Psalm 23', second: '1 John 3:16-24', gospel: 'John 10:11-18' },
      C: { first: 'Acts 9:36-43', psalm: 'Psalm 23', second: 'Revelation 7:9-17', gospel: 'John 10:22-30' },
    },
    easter5: {
      A: { first: 'Acts 7:55-60', psalm: 'Psalm 31:1-5', second: '1 Peter 2:2-10', gospel: 'John 14:1-14' },
      B: { first: 'Acts 8:26-40', psalm: 'Psalm 22:24-30', second: '1 John 4:7-21', gospel: 'John 15:1-8' },
      C: { first: 'Acts 11:1-18', psalm: 'Psalm 148', second: 'Revelation 21:1-6', gospel: 'John 13:31-35' },
    },
    easter6: {
      A: { first: 'Acts 17:22-31', psalm: 'Psalm 66:7-18', second: '1 Peter 3:13-22', gospel: 'John 14:15-21' },
      B: { first: 'Acts 10:44-48', psalm: 'Psalm 98', second: '1 John 5:1-6', gospel: 'John 15:9-17' },
      C: { first: 'Acts 16:9-15', psalm: 'Psalm 67', second: 'Revelation 21:10,21:22-22:5', gospel: 'John 14:23-29' },
    },
    easter7: {
      A: { first: 'Acts 1:6-14', psalm: 'Psalm 68:1-10', second: '1 Peter 4:12-14', gospel: 'John 17:1-11' },
      B: { first: 'Acts 1:15-17,21-26', psalm: 'Psalm 1', second: '1 John 5:9-13', gospel: 'John 17:6-19' },
      C: { first: 'Acts 16:16-34', psalm: 'Psalm 97', second: 'Revelation 22:12-14', gospel: 'John 17:20-26' },
    },
    ascension: {
      all: { first: 'Acts 1:1-11', psalm: 'Psalm 47', second: 'Ephesians 1:15-23', gospel: 'Luke 24:44-53', psalmAnt: 'Dios asciende entre aclamaciones; el Señor, al son de trompetas.' },
    },
    pentecost: {
      A: { first: 'Acts 2:1-21', psalm: 'Psalm 104:25-35', second: '1 Corinthians 12:3-13', gospel: 'John 20:19-23' },
      B: { first: 'Acts 2:1-21', psalm: 'Psalm 104:25-35', second: 'Romans 8:22-27', gospel: 'John 15:26-27' },
      C: { first: 'Acts 2:1-21', psalm: 'Psalm 104:25-35', second: 'Romans 8:14-17', gospel: 'John 14:8-17' },
    },
    trinitySunday: {
      A: { first: 'Genesis 1:1-2:4', psalm: 'Psalm 8', second: '2 Corinthians 13:11-13', gospel: 'Matthew 28:16-20' },
      B: { first: 'Isaiah 6:1-8', psalm: 'Psalm 29', second: 'Romans 8:12-17', gospel: 'John 3:1-17' },
      C: { first: 'Proverbs 8:1-4', psalm: 'Psalm 8', second: 'Romans 5:1-5', gospel: 'John 16:12-15' },
    },

    // ═══════════════ TIEMPO DESPUÉS DE PENTECOSTÉS — PROPIOS (RCL) ═══════════════
    proper3: {
      A: { first: 'Isaiah 49:8-16', psalm: 'Psalm 131', second: '1 Corinthians 4:1-5', gospel: 'Matthew 6:24-34' },
      B: { first: 'Hosea 2:16-22', psalm: 'Psalm 103:1-13', second: '2 Corinthians 3:1-6', gospel: 'Mark 2:13-22' },
      C: { first: 'Sirach 27:4-7', psalm: 'Psalm 92:1-4', second: '1 Corinthians 15:51-58', gospel: 'Luke 6:39-49' },
    },
    proper4: {
      A: { first: 'Genesis 6:9-22', psalm: 'Psalm 46', second: 'Romans 1:16-17', gospel: 'Matthew 7:21-29' },
      B: { first: 'Deuteronomy 5:12-15', psalm: 'Psalm 81:1-10', second: '2 Corinthians 4:5-12', gospel: 'Mark 2:23-3:6' },
      C: { first: '1 Kings 8:22-23', psalm: 'Psalm 96:1-9', second: 'Galatians 1:1-12', gospel: 'Luke 7:1-10' },
    },
    proper5: {
      A: { first: 'Genesis 12:1-9', psalm: 'Psalm 33:1-12', second: 'Romans 4:13-25', gospel: 'Matthew 9:9-13' },
      B: { first: 'Genesis 3:8-15', psalm: 'Psalm 130', second: '2 Corinthians 4:13-5:1', gospel: 'Mark 3:20-35' },
      C: { first: '1 Kings 17:8-24', psalm: 'Psalm 146', second: 'Galatians 1:11-24', gospel: 'Luke 7:11-17' },
    },
    proper6: {
      A: { first: 'Genesis 18:1-15', psalm: 'Psalm 116:1-2', second: 'Romans 5:1-8', gospel: 'Matthew 9:35-10:8' },
      B: { first: '1 Samuel 15:34-16:13', psalm: 'Psalm 20', second: '2 Corinthians 5:6-17', gospel: 'Mark 4:26-34' },
      C: { first: '1 Kings 21:1-21', psalm: 'Psalm 5:1-8', second: 'Galatians 2:15-21', gospel: 'Luke 7:36-8:3' },
    },
    proper7: {
      A: { first: 'Genesis 21:8-21', psalm: 'Psalm 86:1-10', second: 'Romans 6:1-11', gospel: 'Matthew 10:24-39' },
      B: { first: '1 Samuel 17:32-49', psalm: 'Psalm 9:9-20', second: '2 Corinthians 6:1-13', gospel: 'Mark 4:35-41' },
      C: { first: '1 Kings 19:1-15', psalm: 'Psalm 42', second: 'Galatians 3:23-29', gospel: 'Luke 8:26-39' },
    },
    proper8: {
      A: { first: 'Genesis 22:1-14', psalm: 'Psalm 13', second: 'Romans 6:12-23', gospel: 'Matthew 10:40-42' },
      B: { first: '2 Samuel 1:1,17-27', psalm: 'Psalm 130', second: '2 Corinthians 8:7-15', gospel: 'Mark 5:21-43' },
      C: { first: '1 Kings 19:15-16', psalm: 'Psalm 16', second: 'Galatians 5:1-25', gospel: 'Luke 9:51-62' },
    },
    proper9: {
      A: { first: 'Genesis 24:34-67', psalm: 'Psalm 45:11-18', second: 'Romans 7:15-25', gospel: 'Matthew 11:16-30' },
      B: { first: '2 Samuel 5:1-10', psalm: 'Psalm 48', second: '2 Corinthians 12:2-10', gospel: 'Mark 6:1-13' },
      C: { first: 'Isaiah 66:10-14', psalm: 'Psalm 66:1-8', second: 'Galatians 6:1-16', gospel: 'Luke 10:1-11' },
    },
    proper10: {
      A: { first: 'Genesis 25:19-34', psalm: 'Psalm 119:105-112', second: 'Romans 8:1-11', gospel: 'Matthew 13:1-9' },
      B: { first: '2 Samuel 6:1-19', psalm: 'Psalm 24', second: 'Ephesians 1:3-14', gospel: 'Mark 6:14-29' },
      C: { first: 'Deuteronomy 30:9-14', psalm: 'Psalm 25:1-9', second: 'Colossians 1:1-14', gospel: 'Luke 10:25-37' },
    },
    proper11: {
      A: { first: 'Genesis 28:10-19', psalm: 'Psalm 139:1-11', second: 'Romans 8:12-25', gospel: 'Matthew 13:24-30' },
      B: { first: '2 Samuel 7:1-14', psalm: 'Psalm 89:20-37', second: 'Ephesians 2:11-22', gospel: 'Mark 6:30-34' },
      C: { first: 'Genesis 18:1-10', psalm: 'Psalm 15', second: 'Colossians 1:15-28', gospel: 'Luke 10:38-42' },
    },
    proper12: {
      A: { first: 'Genesis 29:15-28', psalm: 'Psalm 105:1-11', second: 'Romans 8:26-39', gospel: 'Matthew 13:31-33' },
      B: { first: '2 Samuel 11:1-15', psalm: 'Psalm 14', second: 'Ephesians 3:14-21', gospel: 'John 6:1-21' },
      C: { first: 'Genesis 18:20-32', psalm: 'Psalm 138', second: 'Colossians 2:6-19', gospel: 'Luke 11:1-13' },
    },
    proper13: {
      A: { first: 'Genesis 32:23-32', psalm: 'Psalm 17:1-7', second: 'Romans 9:1-5', gospel: 'Matthew 14:13-21' },
      B: { first: '2 Samuel 11:26-12:13', psalm: 'Psalm 51:1-13', second: 'Ephesians 4:1-16', gospel: 'John 6:24-35' },
      C: { first: 'Ecclesiastes 1:2,12-14,2:18-23', psalm: 'Psalm 49:1-11', second: 'Colossians 3:1-11', gospel: 'Luke 12:13-21' },
    },
    proper14: {
      A: { first: 'Genesis 37:1-4', psalm: 'Psalm 105:1-6', second: 'Romans 10:5-15', gospel: 'Matthew 14:22-33' },
      B: { first: '2 Samuel 18:5-9', psalm: 'Psalm 130', second: 'Ephesians 4:25-5:2', gospel: 'John 6:35-51' },
      C: { first: 'Genesis 15:1-6', psalm: 'Psalm 33:12-22', second: 'Hebrews 11:1-3', gospel: 'Luke 12:32-40' },
    },
    proper15: {
      A: { first: 'Genesis 45:1-15', psalm: 'Psalm 133', second: 'Romans 11:1-2', gospel: 'Matthew 15:21-28' },
      B: { first: '1 Kings 2:10-12', psalm: 'Psalm 111', second: 'Ephesians 5:15-20', gospel: 'John 6:51-58' },
      C: { first: 'Jeremiah 23:23-29', psalm: 'Psalm 82', second: 'Hebrews 11:29-12:2', gospel: 'Luke 12:49-56' },
    },
    proper16: {
      A: { first: 'Exodus 1:8-2:10', psalm: 'Psalm 124', second: 'Romans 12:1-8', gospel: 'Matthew 16:13-20' },
      B: { first: 'Joshua 24:1-2', psalm: 'Psalm 34:15-22', second: 'Ephesians 6:10-20', gospel: 'John 6:56-69' },
      C: { first: 'Isaiah 58:9-14', psalm: 'Psalm 103:1-8', second: 'Hebrews 12:18-29', gospel: 'Luke 13:10-17' },
    },
    proper17: {
      A: { first: 'Exodus 3:1-15', psalm: 'Psalm 105:1-6', second: 'Romans 12:9-21', gospel: 'Matthew 16:21-28' },
      B: { first: 'Deuteronomy 4:1-9', psalm: 'Psalm 15', second: 'James 1:17-27', gospel: 'Mark 7:1-8' },
      C: { first: 'Jeremiah 2:4-13', psalm: 'Psalm 81:1,10-16', second: 'Hebrews 13:1-8', gospel: 'Luke 14:1-14' },
    },
    proper18: {
      A: { first: 'Exodus 12:1-14', psalm: 'Psalm 149', second: 'Romans 13:8-14', gospel: 'Matthew 18:15-20' },
      B: { first: 'Proverbs 22:1-2', psalm: 'Psalm 125', second: 'James 2:1-17', gospel: 'Mark 7:24-37' },
      C: { first: 'Deuteronomy 30:15-20', psalm: 'Psalm 1', second: 'Philemon 1:1-21', gospel: 'Luke 14:25-33' },
    },
    proper19: {
      A: { first: 'Exodus 14:19-31', psalm: 'Psalm 114', second: 'Romans 14:1-12', gospel: 'Matthew 18:21-35' },
      B: { first: 'Proverbs 1:20-33', psalm: 'Psalm 19', second: 'James 3:1-12', gospel: 'Mark 8:27-38' },
      C: { first: 'Exodus 32:7-14', psalm: 'Psalm 51:1-11', second: '1 Timothy 1:12-17', gospel: 'Luke 15:1-10' },
    },
    proper20: {
      A: { first: 'Exodus 16:2-15', psalm: 'Psalm 105:1-6', second: 'Philippians 1:21-30', gospel: 'Matthew 20:1-16' },
      B: { first: 'Proverbs 31:10-31', psalm: 'Psalm 1', second: 'James 3:13-4:3', gospel: 'Mark 9:30-37' },
      C: { first: 'Jeremiah 8:18-9:1', psalm: 'Psalm 79:1-9', second: '1 Timothy 2:1-7', gospel: 'Luke 16:1-13' },
    },
    proper21: {
      A: { first: 'Exodus 17:1-7', psalm: 'Psalm 78:1-4', second: 'Philippians 2:1-13', gospel: 'Matthew 21:23-32' },
      B: { first: 'Numbers 11:4-6', psalm: 'Psalm 19:7-14', second: 'James 5:13-20', gospel: 'Mark 9:38-50' },
      C: { first: 'Jeremiah 32:1-3', psalm: 'Psalm 91:1-6', second: '1 Timothy 6:6-19', gospel: 'Luke 16:19-31' },
    },
    proper22: {
      A: { first: 'Exodus 20:1-4', psalm: 'Psalm 19', second: 'Philippians 3:4-14', gospel: 'Matthew 21:33-46' },
      B: { first: 'Job 1:1,2:1-10', psalm: 'Psalm 26', second: 'Hebrews 1:1-4', gospel: 'Mark 10:2-16' },
      C: { first: 'Lamentations 1:1-6', psalm: 'Psalm 137', second: '2 Timothy 1:1-14', gospel: 'Luke 17:5-10' },
    },
    proper23: {
      A: { first: 'Exodus 32:1-14', psalm: 'Psalm 106:1-6', second: 'Philippians 4:1-9', gospel: 'Matthew 22:1-14' },
      B: { first: 'Job 23:1-9', psalm: 'Psalm 22:1-15', second: 'Hebrews 4:12-16', gospel: 'Mark 10:17-31' },
      C: { first: 'Jeremiah 29:1,4-7', psalm: 'Psalm 66:1-11', second: '2 Timothy 2:8-15', gospel: 'Luke 17:11-19' },
    },
    proper24: {
      A: { first: 'Exodus 33:12-23', psalm: 'Psalm 99', second: '1 Thessalonians 1:1-10', gospel: 'Matthew 22:15-22' },
      B: { first: 'Job 38:1-7', psalm: 'Psalm 104:1-9', second: 'Hebrews 5:1-10', gospel: 'Mark 10:35-45' },
      C: { first: 'Jeremiah 31:27-34', psalm: 'Psalm 119:97-104', second: '2 Timothy 3:14-4:5', gospel: 'Luke 18:1-8' },
    },
    proper25: {
      A: { first: 'Deuteronomy 34:1-12', psalm: 'Psalm 90:1-6', second: '1 Thessalonians 2:1-8', gospel: 'Matthew 22:34-46' },
      B: { first: 'Job 42:1-6', psalm: 'Psalm 34:1-8', second: 'Hebrews 7:23-28', gospel: 'Mark 10:46-52' },
      C: { first: 'Joel 2:23-27,3:1-5', psalm: 'Psalm 65', second: '2 Timothy 4:6-8', gospel: 'Luke 18:9-14' },
    },
    proper26: {
      A: { first: 'Joshua 3:7-17', psalm: 'Psalm 107:1-7', second: '1 Thessalonians 2:9-13', gospel: 'Matthew 23:1-12' },
      B: { first: 'Ruth 1:1-18', psalm: 'Psalm 146', second: 'Hebrews 9:11-14', gospel: 'Mark 12:28-34' },
      C: { first: 'Habakkuk 1:1-4', psalm: 'Psalm 119:137-144', second: '2 Thessalonians 1:1-4', gospel: 'Luke 19:1-10' },
    },
    proper27: {
      A: { first: 'Joshua 24:1-3', psalm: 'Psalm 78:1-7', second: '1 Thessalonians 4:13-18', gospel: 'Matthew 25:1-13' },
      B: { first: 'Ruth 3:1-5', psalm: 'Psalm 127', second: 'Hebrews 9:24-28', gospel: 'Mark 12:38-44' },
      C: { first: 'Haggai 1:15-2:9', psalm: 'Psalm 145:1-5', second: '2 Thessalonians 2:1-5', gospel: 'Luke 20:27-38' },
    },
    proper28: {
      A: { first: 'Judges 4:1-7', psalm: 'Psalm 123', second: '1 Thessalonians 5:1-11', gospel: 'Matthew 25:14-30' },
      B: { first: '1 Samuel 1:4-20', psalm: '1 Samuel 2:1-10', second: 'Hebrews 10:11-25', gospel: 'Mark 13:1-8' },
      C: { first: 'Isaiah 65:17-25', psalm: 'Isaiah 12', second: '2 Thessalonians 3:6-13', gospel: 'Luke 21:5-19' },
    },
    proper29: {
      A: { first: 'Ezekiel 34:11-16', psalm: 'Psalm 100', second: 'Ephesians 1:15-23', gospel: 'Matthew 25:31-46', psalmAnt: 'El Señor es nuestro Dios, y nosotros su pueblo, ovejas de su prado.' },
      B: { first: 'Daniel 7:9-14', psalm: 'Psalm 93', second: 'Revelation 1:4-8', gospel: 'John 18:33-37', psalmAnt: 'El Señor reina, vestido de majestad.' },
      C: { first: 'Jeremiah 23:1-6', psalm: 'Luke 1:68-79', second: 'Colossians 1:11-20', gospel: 'Luke 23:33-43', psalmAnt: 'Bendito el Señor, Dios de Israel, porque ha visitado a su pueblo.' },
    },

    // ═══════════════ SANTORAL FIJO ═══════════════
    '01-01': { all: { first: 'Numbers 6:22-27', psalm: 'Psalm 8', second: 'Philippians 2:5-11', gospel: 'Luke 2:15-21' } },
    '01-18': { all: { first: 'Acts 4:8-13', psalm: 'Psalm 18:1-7', second: '1 Peter 5:1-11', gospel: 'Matthew 16:13-19' } },
    '01-25': { all: { first: 'Acts 26:9-21', psalm: 'Psalm 67', second: 'Galatians 1:11-24', gospel: 'Matthew 10:16-22' } },
    '02-02': { all: { first: 'Malachi 3:1-4', psalm: 'Psalm 84', second: 'Hebrews 2:14-18', gospel: 'Luke 2:22-40' } },
    '02-24': { all: { first: 'Acts 1:15-26', psalm: 'Psalm 15', second: 'Philippians 3:13-21', gospel: 'John 15:1-16' } },
    '03-19': { all: { first: '2 Samuel 7:4-16', psalm: 'Psalm 89:1-4', second: 'Romans 4:13-18', gospel: 'Matthew 1:18-25' } },
    '03-25': { all: { first: 'Isaiah 7:10-14', psalm: 'Psalm 40:5-10', second: 'Hebrews 10:4-10', gospel: 'Luke 1:26-38' } },
    '04-25': { all: { first: 'Isaiah 52:7-10', psalm: 'Psalm 2', second: 'Ephesians 4:7-16', gospel: 'Mark 1:1-15' } },
    '05-01': { all: { first: 'Isaiah 30:18-21', psalm: 'Psalm 119:33-40', second: 'Ephesians 1:3-14', gospel: 'John 14:6-14' } },
    '05-31': { all: { first: 'Zephaniah 3:14-18', psalm: 'Luke 1:46-55', second: 'Romans 12:9-16', gospel: 'Luke 1:39-49' } },
    '06-11': { all: { first: 'Acts 11:19-30', psalm: 'Psalm 112', second: 'Acts 4:32-37', gospel: 'John 15:12-16' } },
    '06-24': { all: { first: 'Isaiah 40:1-11', psalm: 'Psalm 85:7-13', second: 'Acts 13:14-26', gospel: 'Luke 1:57-80' } },
    '06-29': { all: { first: 'Ezekiel 34:11-16', psalm: 'Psalm 87', second: '2 Timothy 4:1-8', gospel: 'John 21:15-19' } },
    '07-22': { all: { first: 'Song of Songs 3:1-4', psalm: 'Psalm 42:1-7', second: '2 Corinthians 5:14-18', gospel: 'John 20:11-18' } },
    '07-25': { all: { first: 'Jeremiah 45:1-5', psalm: 'Psalm 7:1-10', second: 'Acts 11:27-12:3', gospel: 'Matthew 20:20-28' } },
    '08-06': { all: { first: 'Exodus 34:29-35', psalm: 'Psalm 99', second: '2 Peter 1:13-21', gospel: 'Luke 9:28-36' } },
    '08-15': { all: { first: 'Isaiah 61:10-11', psalm: 'Luke 1:46-55', second: 'Galatians 4:4-7', gospel: 'Luke 1:46-55' } },
    '08-24': { all: { first: 'Deuteronomy 18:15-18', psalm: 'Psalm 91:1-10', second: '1 Corinthians 4:9-15', gospel: 'Luke 22:24-30' } },
    '09-14': { all: { first: 'Numbers 21:4-9', psalm: 'Psalm 98:1-4', second: 'Philippians 2:5-11', gospel: 'John 12:31-36' } },
    '09-21': { all: { first: 'Proverbs 3:1-6', psalm: 'Psalm 119:33-40', second: '2 Timothy 3:14-17', gospel: 'Matthew 9:9-13' } },
    '09-29': { all: { first: 'Genesis 28:10-17', psalm: 'Psalm 103:19-22', second: 'Revelation 12:7-12', gospel: 'John 1:47-51' } },
    '10-18': { all: { first: 'Isaiah 35:5-8', psalm: 'Psalm 147:1-7', second: '2 Timothy 4:5-13', gospel: 'Luke 4:14-21' } },
    '10-23': { all: { first: 'Acts 15:12-22', psalm: 'Psalm 1', second: '1 Corinthians 15:1-11', gospel: 'Matthew 13:54-58' } },
    '10-28': { all: { first: 'Deuteronomy 32:1-4', psalm: 'Psalm 119:89-96', second: 'Ephesians 2:13-22', gospel: 'John 15:17-27' } },
    '11-01': { all: { first: 'Revelation 7:9-17', psalm: 'Psalm 34:1-10', second: '1 John 3:1-3', gospel: 'Matthew 5:1-12' } },
    '11-30': { all: { first: 'Deuteronomy 30:11-14', psalm: 'Psalm 19:1-6', second: 'Romans 10:8-18', gospel: 'Matthew 4:18-22' } },
    '12-21': { all: { first: 'Habakkuk 2:1-4', psalm: 'Psalm 126', second: 'Ephesians 4:11-16', gospel: 'John 20:24-29' } },
    '12-26': { all: { first: '2 Chronicles 24:17-22', psalm: 'Psalm 31:1-5', second: 'Acts 6:8-7:2', gospel: 'Matthew 23:34-39' } },
    '12-27': { all: { first: 'Exodus 33:18-23', psalm: 'Psalm 92:1-4', second: '1 John 1:1-9', gospel: 'John 21:19-24' } },
    '12-28': { all: { first: 'Jeremiah 31:15-17', psalm: 'Psalm 124', second: 'Revelation 21:1-7', gospel: 'Matthew 2:13-18' } },
  };

  function getSundayReadings(key, cycle) {
    const entry = SUNDAY[key];
    if (!entry) return null;
    return entry.all || entry[cycle] || entry.A || null;
  }

  return { SUNDAY, getSundayReadings };

})();
