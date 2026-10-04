/**
 * commemorations.js — Lógica de Conmemoraciones
 * En el Misal Anglicano, cuando una fiesta de santo cae en un día de feria importante,
 * no se ignora ninguna: se celebra la principal y se "conmemora" la otra
 * añadiendo su Colecta, Secreta y Poscomunión al final de las del día.
 */

const Commemorations = (() => {

  // ══════════════════════════════════════════════════════════════════════════
  //  COLECTAS DE SANTOS (para uso como Conmemoración)
  // ══════════════════════════════════════════════════════════════════════════
  // Fuente única: Propers.COLLECTS (transcritas del Misal Anglicano 2013). Antes
  // esta tabla era una segunda copia del texto de cada colecta y las dos podían
  // divergir. propers.js se carga antes que este archivo. La Circuncisión y la
  // Epifanía tienen en Propers una clave semántica ('circumcision', 'epiphany'),
  // no 'MM-DD'; aquí se exponen con la fecha, que es como las busca
  // buildCommemorationHTML (feast.key = 'MM-DD').
  const SAINT_COLLECTS = (() => {
    const out = {};
    const src = (typeof Propers !== 'undefined' && Propers.COLLECTS) ? Propers.COLLECTS : {};
    Object.keys(src).forEach(k => { if (/^\d\d-\d\d$/.test(k)) out[k] = src[k]; });
    if (src.circumcision) out['01-01'] = src.circumcision;
    if (src.epiphany)     out['01-06'] = src.epiphany;
    return out;
  })();

  // Secretas para conmemoración (genérica si no hay propia)
  const SAINT_SECRETS = {
    default: `Acepta, Señor, los dones que te ofrecemos en memoria de tu Santo; y concede que, así como él fue glorificado confesando tu Nombre, así también nosotros, por tu misericordia, seamos fortalecidos; por Jesucristo nuestro Señor. Amén.`,
  };

  // Poscomuniones para conmemoración (genérica si no hay propia)
  const SAINT_POSTCOMMUNIONS = {
    default: `Habiéndonos alimentado con los sacrosantos misterios, te suplicamos, Señor, que nos concedas la gracia de imitar la virtud de tu Santo, cuya memoria hemos celebrado hoy; por Jesucristo nuestro Señor. Amén.`,
  };

  // ══════════════════════════════════════════════════════════════════════════
  //  LÓGICA DE PRIORIDAD RUBRICAL
  //  Determina si hay colisión y cuál celebración es principal
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * Dado el día litúrgico (dayInfo) y el calendario completo,
   * detecta si hay un santo fijo (FIXED_FEAST) que colisione con la
   * celebración movible, y determina cuál es principal y cuál es conmemoración.
   *
   * @param {object} dayInfo - Resultado de LiturgicalCalendar.getDay(date)
   * @param {Date}   date    - La fecha
   * @returns {{ principal: object, commemorations: object[] }}
   */
  // Número de día absoluto, para comparar fechas sin depender de la hora.
  function dnum(d) {
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  }

  /**
   * Días privilegiados en los que una fiesta fija impedida NO se conmemora:
   * del Domingo de Ramos a la Dominica in albis (Semana Santa, Triduo Sacro y
   * Octava de Pascua) y el Miércoles de Ceniza. calendar.js usa exactamente la
   * misma frontera para decidir la TRASLACIÓN de las fiestas de I clase; aquí
   * solo se impide que una fiesta impedida vuelva a entrar por la puerta de
   * atrás en forma de conmemoración.
   */
  function isPrivilegedDate(date) {
    const F = LiturgicalCalendar.getFeastDates(date.getFullYear());
    const n = dnum(date);
    if (n === dnum(F.ashWednesday)) return true;
    return n >= dnum(F.palmSunday) && n <= dnum(F.easter2);
  }

  /**
   * Domingo absorbido por una fiesta fija de I clase.
   *
   * calendar.js solo deja que una fiesta de I clase desplace a un Domingo en el
   * bloque de FIXED_FEASTS, que se evalúa DESPUÉS de todos los domingos de
   * Adviento, Navidad, Epifanía, Cuaresma y Pascua: el único domingo que puede
   * quedar absorbido es, por tanto, un Domingo después de la Trinidad. Su
   * número no se recalcula aquí (sería duplicar el cómputo del calendario):
   * se deduce del domingo vecino, que calendar.js sí numera.
   */
  function displacedSunday(date) {
    if (date.getDay() !== 0) return null;
    for (const delta of [-7, 7, -14, 14]) {
      const probe = new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta, 12, 0, 0);
      const info = LiturgicalCalendar.getDay(probe);
      const m = info && info.key && info.key.match(/^trinity(\d+)$/);
      if (!m) continue;
      const n = Number(m[1]) - delta / 7;
      if (n < 1 || n > 28) continue;
      const key = 'trinity' + n;
      const nameEs = `${n}° Domingo después de la Trinidad`;
      const P = (typeof Propers !== 'undefined') ? Propers : null;
      return {
        key,
        name: nameEs,
        nameEs,
        rank: 'semiDouble',
        isSunday: true,
        label: `del ${nameEs}`,
        collect:        P ? P.COLLECTS[key] : null,
        secret:         P ? P.getSecret(key, 'trinity') : null,
        postcommunion:  P ? P.getPostcommunion(key, 'trinity') : null,
      };
    }
    return null;
  }

  function resolveOccurrence(dayInfo, date) {
    const mmdd = String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

    const commemorations = [];
    const omitted = [];

    // ── 1) Fiesta fija que OCUPA un Domingo ────────────────────────────────
    // El caso inverso al de abajo, que antes no se contemplaba: cuando una
    // fiesta de I clase desplaza al Domingo, es el DOMINGO el que se conmemora,
    // según la misma rúbrica que esta función declara en su cabecera.
    if (dayInfo.isFixed && date.getDay() === 0) {
      const sunday = displacedSunday(date);
      if (sunday) commemorations.push(sunday);
    }

    // Fuente única de las 28 fiestas fijas: LiturgicalCalendar.FIXED_FEASTS
    // (calendar.js). Antes había aquí una segunda copia completa de la tabla,
    // sin nada que garantizara que las dos se mantuvieran sincronizadas.
    const cf = LiturgicalCalendar.FIXED_FEASTS[mmdd];
    if (!cf) return { principal: dayInfo, commemorations, omitted };
    const fixedFeast = { name: cf.nameEs, rank: cf.rank, key: mmdd };

    // Sin colisión: el día ya ES esa fiesta fija — bien porque coincide la clave
    // (mmdd), bien porque coincide el nombre (la Circuncisión y la Epifanía se
    // generan con una clave semántica propia, 'circumcision'/'epiphany', en vez
    // de '01-01'/'01-06', pero SÍ son la misma celebración que esta tabla).
    // NO basta con dayInfo.isFixed: en una fiesta de I clase TRASLADADA a este
    // día, isFixed también es true y sin embargo la fiesta fija propia de la
    // fecha sí queda desplazada y debe conmemorarse.
    if (dayInfo.key === mmdd || dayInfo.nameEs === fixedFeast.name) {
      return { principal: dayInfo, commemorations, omitted };
    }

    // ── 2) La fiesta fija ha sido TRASLADADA por calendar.js ───────────────
    // No se conmemora hoy: se celebrará íntegra en su nueva fecha. Sin esto la
    // misma fiesta aparecería a la vez trasladada y conmemorada.
    if (dayInfo.translatedFeast && dayInfo.translatedFeast.key === mmdd) {
      omitted.push(Object.assign({}, fixedFeast, {
        reason: 'translated',
        toISO: dayInfo.translatedFeast.toISO || null,
      }));
      return { principal: dayInfo, commemorations, omitted };
    }

    // ── 3) Días privilegiados: ninguna conmemoración ───────────────────────
    // Semana Santa, Triduo Sacro, Octava de Pascua y Miércoles de Ceniza no
    // admiten conmemoración alguna. (Las fiestas de I clase que caen ahí las
    // traslada calendar.js; las de rango inferior — p. ej. San Marcos el
    // Domingo de Pascua — simplemente ceden.)
    if (isPrivilegedDate(date)) {
      omitted.push(Object.assign({}, fixedFeast, { reason: 'privileged' }));
      return { principal: dayInfo, commemorations, omitted };
    }

    // ── 4) Colisión ordinaria: se conmemora la fiesta fija desplazada ──────
    commemorations.push(fixedFeast);
    return { principal: dayInfo, commemorations, omitted };
  }

  /**
   * Genera el HTML de las Conmemoraciones (Colecta + Secreta + Poscomunión)
   * @param {object[]} commemorations - Array de fiestas a conmemorar
   * @returns {string} HTML
   */
  // propers.js puede devolver un texto suelto o un objeto {text, supplied, season}
  // (señal de "texto del tiempo, no propio del día"). Aquí solo interesa el texto.
  function plain(v) {
    if (!v) return '';
    if (typeof v === 'string') return v;
    return v.text || v.ant || '';
  }

  function buildCommemorationHTML(commemorations) {
    if (!commemorations || commemorations.length === 0) return '';

    let html = `
    <div class="mass-section commemoration-section">
      <h3 class="section-title main-section">✠ CONMEMORACIÓN${commemorations.length > 1 ? 'ES' : ''}</h3>
      <p class="rubric">Según la tradición del Misal Anglicano, cuando una fiesta de mayor rango ocupa el día, la celebración de menor rango se <em>conmemora</em> añadiendo su Colecta, Secreta y Poscomunión.</p>
    `;

    commemorations.forEach(feast => {
      // Un Domingo conmemorado trae sus propios textos (Propers); un santo usa
      // su Colecta de esta tabla, y las fórmulas genéricas de Secreta y
      // Poscomunión cuando no la tiene propia.
      const collect       = plain(feast.collect)       || SAINT_COLLECTS[feast.key] ||
                            `Concede, Señor, que la intercesión de ${feast.name} nos obtenga tu favor; por Jesucristo nuestro Señor. Amén.`;
      const secret        = plain(feast.secret)        || SAINT_SECRETS[feast.key]        || SAINT_SECRETS.default;
      const postcommunion = plain(feast.postcommunion) || SAINT_POSTCOMMUNIONS[feast.key] || SAINT_POSTCOMMUNIONS.default;

      html += `
      <div class="commemoration-block">
        <h4 class="section-title commemoration-title">✠ Conmemoración ${feast.label || ('de ' + feast.name)}</h4>
        ${feast.isSunday ? '<p class="rubric commemoration-rubric">El Domingo, impedido hoy por una fiesta de I clase, se conmemora con sus propias oraciones.</p>' : ''}

        <p class="rubric commemoration-rubric">Colecta de la Conmemoración</p>
        <div class="prayer-text collect-text commemoration-collect">${collect}</div>

        <p class="rubric commemoration-rubric">Secreta de la Conmemoración <em>(dicha en secreto al fin del Ofertorio)</em></p>
        <div class="prayer-text commemoration-secret">${secret}</div>

        <p class="rubric commemoration-rubric">Poscomunión de la Conmemoración</p>
        <div class="prayer-text commemoration-postcommunion">${postcommunion}</div>
      </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────
  return {
    resolveOccurrence,
    buildCommemorationHTML,
    SAINT_COLLECTS,
  };

})();
