/**
 * biblia-wrapper.js
 * Adapta biblia-de-jerusalen.cjs (CommonJS) para uso en el navegador.
 * Expone window.BibliaJerusalen con método getPassage(ref) -> [{v, content}]
 */
(function () {
  'use strict';

  // ── Polyfill mínimo de CommonJS para cargar el módulo CJS en el navegador ──
  const module = { exports: {} };
  const exports = module.exports;

  // El archivo CJS usa "exports.Bible = ..." — lo evaluamos en este contexto
  // (el script se carga antes que este wrapper via <script> tag no-module)

  // Mapa de referencias lectcionario → nombre canónico en la Biblia de Jerusalén
  const BOOK_MAP = {
    // Pentateuco
    'Genesis':'Génesis','Gen':'Génesis','Gn':'Génesis',
    'Exodus':'Éxodo','Ex':'Éxodo',
    'Leviticus':'Levítico','Lev':'Levítico',
    'Numbers':'Números','Num':'Números',
    'Deuteronomy':'Deuteronomio','Dt':'Deuteronomio',
    // Históricos
    'Joshua':'Josué','Jos':'Josué',
    'Judges':'Jueces','Jdg':'Jueces',
    'Ruth':'Rut','Ru':'Rut',
    '1 Samuel':'I Samuel','1Sam':'I Samuel',
    '2 Samuel':'II Samuel','2Sam':'II Samuel',
    '1 Kings':'I Reyes','1Ki':'I Reyes',
    '2 Kings':'II Reyes','2Ki':'II Reyes',
    '1 Chronicles':'I Crónicas','1Ch':'I Crónicas',
    '2 Chronicles':'II Crónicas','2Ch':'II Crónicas',
    'Ezra':'Esdras','Ezr':'Esdras',
    'Nehemiah':'Nehemías','Ne':'Nehemías',
    // Sapienciales
    'Job':'Job',
    'Psalms':'Salmos','Psalm':'Salmos','Ps':'Salmos',
    'Proverbs':'Proverbios','Pr':'Proverbios',
    'Ecclesiastes':'Eclesiastés','Ec':'Eclesiastés',
    // El libro se llama 'Cantar' (no 'Cantar de los Cantares') en la edición
    // de la Biblia de Jerusalén que carga la app.
    'Song of Songs':'Cantar','Song':'Cantar',
    'Wisdom':'Sabiduría','Wis':'Sabiduría',
    'Sirach':'Eclesiástico','Sir':'Eclesiástico',
    'Baruch':'Baruc','Bar':'Baruc',
    // Profetas
    'Isaiah':'Isaías','Isa':'Isaías','Is':'Isaías',
    'Jeremiah':'Jeremías','Jer':'Jeremías',
    'Lamentations':'Lamentaciones','Lam':'Lamentaciones',
    'Ezekiel':'Ezequiel','Eze':'Ezequiel',
    'Daniel':'Daniel','Dan':'Daniel',
    'Hosea':'Oseas','Hos':'Oseas',
    'Joel':'Joel',
    'Amos':'Amós','Amo':'Amós',
    'Obadiah':'Abdías',
    'Jonah':'Jonás','Jon':'Jonás',
    'Micah':'Miqueas','Mic':'Miqueas',
    'Nahum':'Nahún','Na':'Nahún',   // grafía real en la Biblia cargada: 'Nahún'
    'Habakkuk':'Habacuc','Hab':'Habacuc',
    'Zephaniah':'Sofonías','Zep':'Sofonías',
    'Haggai':'Ageo','Hag':'Ageo',
    'Zechariah':'Zacarías','Zec':'Zacarías',
    'Malachi':'Malaquías','Mal':'Malaquías',
    // NT
    'Matthew':'Mateo','Mt':'Mateo',
    'Mark':'Marcos','Mk':'Marcos','Mc':'Marcos',
    'Luke':'Lucas','Lk':'Lucas','Lc':'Lucas',
    'John':'Juan','Jn':'Juan',
    'Acts':'Hechos','Ac':'Hechos',
    'Romans':'Romanos','Rm':'Romanos','Rom':'Romanos',
    '1 Corinthians':'I Corintios','1Cor':'I Corintios','1 Cor':'I Corintios',
    '2 Corinthians':'II Corintios','2Cor':'II Corintios','2 Cor':'II Corintios',
    'Galatians':'Gálatas','Gal':'Gálatas',
    'Ephesians':'Efesios','Eph':'Efesios',
    'Philippians':'Filipenses','Phi':'Filipenses','Phil':'Filipenses',
    'Colossians':'Colosenses','Col':'Colosenses',
    '1 Thessalonians':'I Tesalonicenses','1Th':'I Tesalonicenses','1 Thess':'I Tesalonicenses',
    '2 Thessalonians':'II Tesalonicenses','2Th':'II Tesalonicenses',
    '1 Timothy':'I Timoteo','1Ti':'I Timoteo','1 Tim':'I Timoteo',
    '2 Timothy':'II Timoteo','2Ti':'II Timoteo','2 Tim':'II Timoteo',
    'Titus':'Tito','Tit':'Tito',
    'Philemon':'Filemon','Phm':'Filemon',   // sin tilde en la Biblia cargada
    'Hebrews':'Hebreos','Heb':'Hebreos',
    'James':'Santiago','Jam':'Santiago','Jas':'Santiago',
    '1 Peter':'I Pedro','1Pe':'I Pedro','1 Pet':'I Pedro',
    '2 Peter':'II Pedro','2Pe':'II Pedro',
    '1 John':'I Juan','1Jn':'I Juan','1 John':'I Juan',
    '2 John':'II Juan','2Jn':'II Juan',
    '3 John':'III Juan','3Jn':'III Juan',
    'Jude':'Judas','Jud':'Judas',
    'Revelation':'Apocalipsis','Rev':'Apocalipsis','Ap':'Apocalipsis',
  };

  // Libros de un solo capítulo (nombre canónico en la Biblia de Jerusalén).
  const SINGLE_CHAPTER_BOOKS = new Set(['Abdías', 'Filemon', 'II Juan', 'III Juan', 'Judas']);

  /**
   * Parsea una referencia tipo "Isaiah 52:13-53:12" o "Psalm 22:1-31" o "Matthew 5:1-12"
   * Retorna { book, ranges: [{chapter, verseStart, verseEnd}] }
   */
  function parseRef(ref) {
    if (!ref) return null;
    ref = ref.trim();

    // VALIDACIÓN: Evitar referencias sospechosamente largas
    if (ref.length > 100) {
      console.warn('Referencia bíblica sospechosamente larga:', ref.substring(0, 50) + '...');
      return null;
    }

    // Separar libro y capítulos/versos
    // Libro puede tener número al inicio: "1 Corinthians 11:23-26"
    const match = ref.match(/^((?:\d\s+)?[A-Za-zÀ-ú\s]+?)\s+(\d.*)$/);
    if (!match) return null;

    const bookRaw = match[1].trim();
    const chapVerse = match[2].trim();

    // Mapear nombre del libro
    const bookName = BOOK_MAP[bookRaw] || bookRaw;

    // Parsear rangos: "22:1-31" o "11:23-26" o "52:13-53:12" o "1-14" o "1:1"
    // Puede haber comas: "11:1-18,22-26" o "116:1-4,12-19"
    const segments = chapVerse.split(',').map(s => s.trim());
    let lastChapter = null;
    const ranges = [];

    for (const seg of segments) {
      if (!seg) continue; // Ignorar segmentos vacíos

      // seg puede ser: "52:13-53:12" | "22:1-31" | "1:1" | "22-26" (continuación)
      const crossChap = seg.match(/^(\d+):(\d+)-(\d+):(\d+)$/);
      const sameChap  = seg.match(/^(\d+):(\d+)-(\d+)$/);
      const single    = seg.match(/^(\d+):(\d+)$/);
      const verseOnly = seg.match(/^(\d+)-(\d+)$/);
      const chOnly    = seg.match(/^(\d+)$/);

      if (crossChap) {
        // Multi-chapter: 52:13-53:12
        const ch1 = parseInt(crossChap[1]);
        const ch2 = parseInt(crossChap[3]);
        // Validación: no más de 5 capítulos
        if (ch2 - ch1 > 5) {
          console.warn(`Referencia cruzada muy larga: ${ch1}:${crossChap[2]}-${ch2}:${crossChap[4]}`);
          continue;
        }
        for (let ch = ch1; ch <= ch2; ch++) {
          const vStart = ch === ch1 ? parseInt(crossChap[2]) : 1;
          const vEnd   = ch === ch2 ? parseInt(crossChap[4]) : 999;
          ranges.push({ chapter: ch, verseStart: vStart, verseEnd: vEnd });
        }
        lastChapter = ch2;
      } else if (sameChap) {
        lastChapter = parseInt(sameChap[1]);
        ranges.push({ chapter: lastChapter, verseStart: parseInt(sameChap[2]), verseEnd: parseInt(sameChap[3]) });
      } else if (single) {
        lastChapter = parseInt(single[1]);
        ranges.push({ chapter: lastChapter, verseStart: parseInt(single[2]), verseEnd: parseInt(single[2]) });
      } else if (verseOnly && lastChapter) {
        // Continuación de capítulo anterior: "22-26" → same chapter
        ranges.push({ chapter: lastChapter, verseStart: parseInt(verseOnly[1]), verseEnd: parseInt(verseOnly[2]) });
      } else if (verseOnly) {
        // Rango sin capítulo previo ni "cap:ver" ("Psalm 42-43", "Philemon 1-21").
        // En los libros de un solo capítulo son versículos del capítulo 1; en el
        // resto (Salmos, etc.) son capítulos enteros. Antes devolvía vacío.
        const n1 = parseInt(verseOnly[1]);
        const n2 = parseInt(verseOnly[2]);
        if (SINGLE_CHAPTER_BOOKS.has(bookName)) {
          lastChapter = 1;
          ranges.push({ chapter: 1, verseStart: n1, verseEnd: n2 });
        } else if (n2 >= n1 && n2 - n1 <= 5) {
          for (let ch = n1; ch <= n2; ch++) ranges.push({ chapter: ch, verseStart: 1, verseEnd: 999 });
          lastChapter = n2;
        }
      } else if (chOnly && lastChapter !== null) {
        // Número suelto DESPUÉS de un segmento "cap:ver": es un VERSÍCULO del
        // último capítulo citado, no un capítulo nuevo.
        //   "Matthew 1:16,18-21,24"  →  1:16, 1:18-21, 1:24
        // Antes, "24" caía en la rama de capítulo suelto y devolvía el capítulo
        // 24 ENTERO, y además reasignaba lastChapter, contaminando todos los
        // segmentos posteriores ("Psalm 31:3-4,6,8,16-17" → 6 entero, 8 entero,
        // y luego 8:16-17). NO se toca lastChapter aquí.
        const v = parseInt(chOnly[1]);
        ranges.push({ chapter: lastChapter, verseStart: v, verseEnd: v });
      } else if (chOnly) {
        // Capítulo suelto sin contexto previo ("Philemon 1"): capítulo entero.
        lastChapter = parseInt(chOnly[1]);
        ranges.push({ chapter: lastChapter, verseStart: 1, verseEnd: 999 });
      }
    }

    return ranges.length > 0 ? { bookName, ranges } : null;
  }

  // ── Desfase de versículos en los Salmos ──────────────────────────────────
  // Los leccionarios (js/lectionary.js y bcp2019/js/lectionary.js) citan los
  // salmos con la numeración de las Biblias inglesas / litúrgicas, donde el
  // título ("Del maestro de coro. Salmo de David") NO se numera. La Biblia de
  // Jerusalén cargada sigue la numeración hebrea, que cuenta el título como
  // versículo(s) 1 (o 1-2). PSALM_TITLE_OFFSET da, por salmo, cuántos versículos
  // iniciales son SOLO título (d): el versículo n de la cita equivale al
  // versículo n+d de la Biblia. Los salmos que no figuran tienen d=0: o no
  // llevan título numerado, o éste va fundido en el v.1 con el comienzo del
  // cuerpo (p. ej. 23, 100, 130).
  //
  // Tabla verificada contra el texto real (v.1 solo título y v.(d+1) arranca el
  // cuerpo) y contra la versificación hebrea↔inglesa estándar; coinciden en los
  // 150 salmos. Irregularidad conocida: en el Sal 13 el v.6 hebreo equivale a
  // 5-6 inglés (la cita 13:6 sola se acota al último versículo).
  const PSALM_TITLE_OFFSET = {
    3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 12:1, 13:1,
    18:1, 19:1, 20:1, 21:1, 22:1, 30:1, 31:1, 34:1, 36:1,
    38:1, 39:1, 40:1, 41:1, 42:1, 44:1, 45:1, 46:1, 47:1, 48:1, 49:1,
    51:2, 52:2, 53:1, 54:2, 55:1, 56:1, 57:1, 58:1, 59:1, 60:2,
    61:1, 62:1, 63:1, 64:1, 65:1, 67:1, 68:1, 69:1, 70:1,
    75:1, 76:1, 77:1, 80:1, 81:1, 83:1, 84:1, 85:1, 88:1, 89:1,
    92:1, 102:1, 108:1, 140:1, 142:1,
  };

  // CONTRATO DE NUMERACIÓN (idempotencia): getPassage/getVerses reciben SIEMPRE
  // numeración inglesa/litúrgica y aplican el desfase una sola vez, aquí.
  // Nadie debe pasarles números ya desplazados (hebreos). Cada versículo
  // devuelto es {v, h, content}: `v` es la etiqueta que se muestra al lector
  // (numeración inglesa = hebrea − d, coherente con la cita impresa en el
  // encabezado, p. ej. "Salmo 51:1-13"); `h` es el número real en la Biblia de
  // Jerusalén. Quien consume solo usa `v` y `content`.

  /** Versículos iniciales de título del salmo `chapter` (0 si no lo hay). */
  function psalmTitleOffset(bookName, chapter) {
    return bookName === 'Salmos' ? (PSALM_TITLE_OFFSET[chapter] || 0) : 0;
  }

  /**
   * Resuelve los rangos de una referencia a una lista de {v, h, content}.
   * Para los Salmos traduce de numeración inglesa a hebrea (+d, por capítulo).
   * Una cita sin versículos ("Psalm 96", rango 1-999) empieza tras el título.
   */
  function resolveVerses(book, bookName, ranges, ctx) {
    const out = [];
    for (const range of ranges) {
      try {
        // En los datos de la Biblia de Jerusalén el Eclesiástico (Sirácida)
        // trae el Prólogo como PRIMER elemento del arreglo de capítulos, así que
        // el capítulo N está en el índice N (no N-1). Sin esto, «Sirach 24:9-11»
        // imprimía el capítulo 23. Se detecta por el contenido para no depender
        // del orden si los datos se corrigen.
        let chIdx = range.chapter - 1;
        if (bookName === 'Eclesiástico' && book.chapters[0] && book.chapters[0].verses &&
            /Muchas e importantes lecciones/.test(String(book.chapters[0].verses['1'] || ''))) {
          chIdx = range.chapter;
        }
        const chapter = book.chapters[chIdx];
        if (!chapter || !chapter.verses) continue;
        const d = psalmTitleOffset(bookName, range.chapter);
        let hStart = range.verseStart + d;
        let hEnd = range.verseEnd >= 999 ? range.verseEnd : range.verseEnd + d;
        if (d > 0) {
          // Si la cita cae más allá del final hebreo (Sal 13:6), se acota al
          // último versículo en vez de devolver un rango vacío.
          const keys = Object.keys(chapter.verses).map(Number).filter(n => !isNaN(n));
          const last = keys.length ? Math.max.apply(null, keys) : 0;
          if (hStart > last) hStart = last;
          if (hEnd > last) hEnd = last;
        }
        for (let h = hStart; h <= hEnd; h++) {
          const verseText = chapter.verses[h.toString()];
          if (verseText) out.push({ v: (h - d).toString(), h: h.toString(), content: verseText });
        }
      } catch (e) {
        console.warn(ctx, bookName, range, e);
      }
    }
    return out;
  }

  /**
   * Obtiene el texto de una referencia bíblica usando la Biblia de Jerusalén local.
   * @param {string} ref  e.g. "Isaiah 52:13-53:12"
   * @returns {{ text: string, reference: string }}
   */
  function getPassage(ref) {
    if (!ref) return { text: '', reference: '' };
    const parsed = parseRef(ref);
    if (!parsed) return { text: `<em class="rubric">[Referencia no reconocida: ${ref}]</em>`, reference: ref };

    const { bookName, ranges } = parsed;

    if (!window._BibliaInstance) {
      return { text: `<em class="rubric">[Biblia de Jerusalén no cargada]</em>`, reference: ref };
    }

    const bible = window._BibliaInstance;
    const book = bible.getBook(bookName);
    if (!book) {
      return {
        text: `<em class="rubric">[Libro no encontrado: ${bookName}]</em>`,
        reference: ref,
      };
    }

    const allVerses = resolveVerses(book, bookName, ranges, 'BibliaJerusalen error:');

    if (allVerses.length === 0) {
      return {
        text: `<em class="rubric">[No se encontró: ${ref} — verifique el nombre del libro]</em>`,
        reference: ref,
      };
    }

    const text = allVerses
      .map(v => `<sup class="verse-num">${v.v}</sup> ${v.content}`)
      .join(' ');

    return { text, reference: ref };
  }

  /**
   * Igual que getPassage pero retorna el array de versos {v, h, content} sin unir.
   * Usado para formateo responsorial por estrofas.
   */
  function getVerses(ref) {
    if (!ref) return [];
    const parsed = parseRef(ref);
    if (!parsed) return [];

    const { bookName, ranges } = parsed;
    if (!window._BibliaInstance) return [];

    const bible = window._BibliaInstance;
    const book = bible.getBook(bookName);
    if (!book) return [];

    return resolveVerses(book, bookName, ranges, 'getVerses error:');
  }

  // Exponer globalmente
  window.BibliaJerusalen = { getPassage, getVerses, parseRef, BOOK_MAP, PSALM_TITLE_OFFSET };

})();
