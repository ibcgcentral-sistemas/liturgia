/**
 * biblia-loader.js
 * Carga el módulo CJS de Biblia de Jerusalén en el navegador
 * usando un polyfill mínimo de module/exports/require.
 */
(function () {
  // Simular entorno CommonJS
  const _module = { exports: {} };
  // El archivo CJS usará "exports.Bible = ..."
  // Lo cargamos con un XMLHttpRequest síncrono e eval en este scope
  // NOTA: esto funciona en file:// y http://localhost

  const scriptPath = (function () {
    const scripts = document.querySelectorAll('script[src]');
    for (const s of scripts) {
      if (s.src.includes('biblia-loader')) {
        return s.src.replace('biblia-loader.js', 'biblia-de-jerusalen.min.js');
      }
    }
    // fallback relativo
    return 'js/lib/biblia-de-jerusalen.min.js';
  })();

  const xhr = new XMLHttpRequest();
  xhr.open('GET', scriptPath, false); // síncrono
  try {
    xhr.send();
  } catch (e) {
    console.warn('BibliaLoader: no se pudo cargar', scriptPath, e);
    return;
  }

  if (xhr.status !== 200 && xhr.status !== 0) {
    console.warn('BibliaLoader: HTTP', xhr.status);
    return;
  }

  // Evaluar el módulo CJS inyectando module/exports
  try {
    const fn = new Function('module', 'exports', xhr.responseText);
    fn(_module, _module.exports);
  } catch (e) {
    console.error('BibliaLoader: error al evaluar módulo', e);
    return;
  }

  // Instanciar y exponer globalmente
  const BibliaClass = _module.exports.Bible;
  if (!BibliaClass) {
    console.error('BibliaLoader: exports.Bible no encontrado');
    return;
  }

  window._BibliaInstance = new BibliaClass();
  console.log('✠ Biblia de Jerusalén cargada localmente —', window._BibliaInstance.getAllBooks().length, 'libros');
})();
