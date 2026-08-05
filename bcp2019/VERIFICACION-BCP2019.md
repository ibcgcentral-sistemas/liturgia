# ✠ Verificación — Libro de Oración Común (2019), ACNA

**Fecha:** 2026-08-05
**Estado:** ✅ FASE 1 COMPLETADA (arquitectura base + Santa Eucaristía)

---

## Resumen

Primera entrega del segundo generador de liturgia del proyecto, basado en el
*Libro de Oración Común (2019)* de la Iglesia Anglicana en Norteamérica
(ACNA) — Texto Estándar Anglicano de la Santa Eucaristía. Vive en `bcp2019/`,
completamente separado del Misal Anglicano (`index.html`, `js/`, `css/`
en la raíz), sin tocar ninguno de sus archivos. Plan aprobado en
`C:\Users\gonza\.claude\plans\concurrent-chasing-quiche.md`.

## Fuente y aviso de fidelidad

- **Ordinario de la Eucaristía y los 26 Prefacios Propios** (`js/eucharist.js`,
  `js/propers.js` → `PREFACES`): transcritos fielmente de
  `LOC-10-10-23.md` (PDF del libro convertido a Markdown), líneas 2649-4090.
- **Calendario, Leccionario Dominical (RCL) y Colectas de cada día**
  (`js/calendar.js`, `js/lectionary.js`, `js/propers.js` → `COLLECTS`):
  las páginas oficiales del libro (598-798: Colectas del Año Cristiano,
  Calendario, Leccionario Dominical y del Oficio Diario) no estaban
  disponibles. Por decisión explícita del usuario, se reconstruyeron con el
  Leccionario Común Revisado (RCL) estándar ecuménico que ACNA adopta, y con
  las colectas clásicas 1549/1662 en lenguaje contemporáneo para los tiempos
  con nombre. **No son una transcripción del texto oficial del BCP 2019** —
  si se consiguen las páginas 598-798, conviene contrastar y corregir por
  bloques (cada tabla lleva un comentario de aviso en el código señalando
  esto).

## Verificaciones realizadas

### ✅ Algoritmo de Pascua (Meeus/Jones/Butcher)
Copiado tal cual de `js/calendar.js` (Misal Anglicano), ya validado en
auditorías previas del proyecto. Confirmado: Pascua 2026 = 5 de abril,
2027 = 28 de marzo.

### ✅ Cobertura de calendario/leccionario/colectas — simulación de 7 años (2024-2030)
- 510 días de fiesta/domingo + 2047 días feria simulados.
- 0 colectas faltantes, 0 lecturas faltantes en los 510 días de
  fiesta/domingo (fallback genérico solo alcanzable en la clave `feria`,
  nunca disparada por un día real).
- Las 30 fiestas fijas del santoral (`FIXED_FEASTS`) tienen colecta y
  lectura propia, no solo las 55 claves de domingo/Propio.

### BUG encontrado y corregido: "Segundo Domingo después de Navidad" ausente
`calendar.js` no cubría el domingo que cae entre el 2 y el 5 de enero
(ocurre en años donde caben dos domingos entre Navidad y Epifanía — 2025,
2026, 2027, 2028 en la ventana simulada). Cualquier domingo en esa ventana
caía al fallback genérico `'feria'`. **Fix:** nuevo bloque explícito
(`key: 'christmasSunday2'`) + entrada correspondiente en `lectionary.js`
(Jeremías 31:7-14, Salmo 84, Efesios 1:3-14, Juan 1:1-18 — lectura fija,
no varía por ciclo).

### BUG encontrado y corregido: 35 referencias bíblicas con sufijo de media-versículo
El parser compartido (`js/lib/biblia-wrapper.js`, usado también por el
Misal Anglicano) no reconoce sufijos "a"/"b" en ningún patrón (`"19a"`,
`"3b-13"`, etc. — confirmado leyendo `parseRef()`, ninguno de sus 5 regex
de rango admite letras). Se validaron programáticamente las 710
referencias únicas del leccionario contra el parser real; 35 fallaban.
**Fix:** se quitó el sufijo de letra en las 35 (se muestra el versículo
completo en vez de la mitad — aceptable, preferible a que la lectura no
cargue). No se tocó la librería compartida.

### BUG encontrado y corregido: libro "Ester" no soportado por la Biblia cargada
`Esther 7:1-6` (Propio 21, año B) no tiene entrada en el `BOOK_MAP` de
`biblia-wrapper.js` — el libro de Ester no está indexado en absoluto en
`biblia-de-jerusalen.min.js`. **Fix:** sustituido por la lectura alternativa
real del RCL para ese domingo (Números 11:4-6, con Salmo 19:7-14), que sí
está disponible y mantiene la conexión temática con el Evangelio del día.

### BUG encontrado y corregido: rutas relativas rompían con URL sin barra final
Al servir `bcp2019/index.html` desde una URL sin `/` final (`/bcp2019` en
vez de `/bcp2019/`), las rutas relativas (`js/calendar.js`, `css/style.css`)
se resolvían contra la raíz del sitio — cargando por coincidencia de nombre
el `calendar.js` **del Misal Anglicano** en vez del propio, dejando
`BCPCalendar` sin definir. **Fix:** todas las rutas de `<link>`/`<script>`
en `bcp2019/index.html` (y el enlace cruzado en ambos `index.html`) pasaron
a ser absolutas (`/bcp2019/css/style.css`, `/bcp2019/js/calendar.js`, etc.),
robusto ante cualquier forma de hosting.

### Detalle corregido: `season` de fiestas fijas
Las 30 entradas de `FIXED_FEASTS` inicialmente recibían `season: 'ordinary'`
fijo sin importar la fecha real (p. ej. el 1 de enero, dentro de la Octava
de Navidad, mostraba season incorrecto). **Fix:** nueva función
`seasonForDate()` que deriva el season real por comparación de fechas,
reutilizada tanto en el bloque de fiestas fijas como en el fallback final.

### Detalle corregido: prefacio de `palmSunday`
`BCPPropers.getPreface()` no tenía condición explícita para `palmSunday` ni
`lent5` (Domingo de Pasión), cayendo al prefacio genérico "En Cualquier
Tiempo" en vez de "Semana Santa". **Fix:** añadidos a la condición de
`PREFACES.holyWeek`, igual que hace `js/propers.js` del Misal Anglicano.

## Verificación en navegador (`npx http-server` / `serve`, puerto 3000)

- **Domingo de Resurrección (2026-04-05):** Aclamación pascual con Aleluya,
  Prefacio "Pascua y Resurrección", Fracción con Aleluya — generado completo
  sin huecos, lecturas reales cargadas (Hechos 10:34-43, Salmo 118, Colosenses
  3:1-4, Juan 20:1-18).
- **Propio 11 / Domingo ordinario (2026-07-19):** Aclamación estándar,
  Prefacio "En Cualquier Tiempo", lectura de Génesis 28:10-19 verificada
  tras el fix de sufijos — generado completo sin huecos.
- **Modo Noche:** paleta oscura aplicada correctamente en controles y en el
  documento litúrgico, buen contraste verificado visualmente.
- **Navegación cruzada:** enlace `bcp2019/index.html → index.html` y
  viceversa verificados, Misal Anglicano confirmado intacto (todos sus
  recursos cargan 200/304, sin ningún archivo modificado).

**Verificado por:** Claude Code Assistant
**Fecha de verificación:** 2026-08-05

---

## ✠ Segunda entrega — 2026-08-05 (Manual del Oficiante y Librito del Pueblo)

Paridad de funciones adelantada desde la Fase 8 del plan, a pedido explícito
del usuario. Añade `js/manual.js` (`BCPManual`) y `js/librito-pueblo.js`
(`BCPLibrito`), con sus botones en `index.html` y su bloque de CSS
(`.manual-*` en paleta marrón/ocre, `.librito-*` en paleta verde — ambas
distinguibles de la paleta azul del documento principal y entre sí, mismo
principio que el Misal Anglicano).

### Diseño
- **Manual del Oficiante**: contenido estático (no depende de la fecha),
  igual patrón que `js/manual.js` del Misal — overlay creado dinámicamente,
  `show()`/`hide()`. El ceremonial descrito es deliberadamente más sobrio que
  el del Misal Anglo-Católico (sin incienso obligatorio, sin ritual de
  vestición con oraciones en latín, sin genuflexiones múltiples) — refleja
  el carácter real del Texto Estándar Anglicano frente al Canon Romano.
- **Librito del Pueblo**: a diferencia del Misal, el Texto Estándar
  Anglicano no tiene partes "secretas" del Celebrante (todo el Ordinario,
  incluida la Oración de Consagración, se dice en voz alta) — el Librito
  incluye el texto completo de cada sección, con rúbricas de postura
  dirigidas al fiel en vez de instrucciones técnicas. Reutiliza siempre
  `currentMassState` (nuevo en `app.js`, capturado al final de
  `generateLiturgy()`, reseteado a `null` antes de cada intento) — nunca
  recalcula, mismo principio que el Misal.
- **Firma más simple que el original**: `BCPLibrito.show(state)` recibe un
  solo objeto en vez de la lista de 19 parámetros posicionales que usa
  `LibritoPueblo.show(...)` en el Misal — evita el riesgo de sincronía
  manual entre llamador y firma que señalé como fricción del original en el
  plan de diseño.
- **Sin exportación DOCX** para ninguno de los dos todavía — el usuario pidió
  específicamente "Manual y Librito"; DOCX queda para cuando se aborde el
  exportador genérico de la Fase 8.

### Verificación en navegador
- Los dos scripts nuevos cargan sin error (200 OK) junto con el resto.
- `BCPManual`/`BCPLibrito` definidos correctamente; `currentMassState` nulo
  al cargar, poblado tras generar.
- Generado el Domingo de Resurrección (2026-04-05): Manual se abre con las
  13 secciones completas y el índice navegable; Librito se abre reutilizando
  exactamente el mismo día/lecturas/colecta ya en pantalla (incluida la
  Aclamación pascual y la lectura real de Hechos 10:34-43), sin recalcular.
  Ambos overlays cierran correctamente (botón "Cerrar" y clic fuera del
  modal).
- Botones "📖 Manual" / "📕 Librito" verificados en Modo Claro y Modo Noche —
  mantienen su color distintivo y buen contraste en ambos (colores fijos con
  `!important`, no dependen de las variables que cambian con el tema).

**Verificado por:** Claude Code Assistant
**Fecha de verificación:** 2026-08-05

---

## ✠ Tercera entrega — 2026-08-05 (Exportación a Word)

Añade `bcp2019/js/docx-export.js` (`BCPDocxExport`), a pedido explícito del
usuario ("para el sacerdote y para el pueblo").

### Diseño
- **Un solo exportador, no dos**: en vez de duplicar el transpilador
  DOM→docx.js una tercera vez (el Misal Anglicano ya tiene dos copias casi
  gemelas — `js/docx-export.js` y la función interna de
  `js/librito-pueblo.js`), este archivo expone `downloadDocx()` (documento
  principal) y `downloadLibritoDocx()` (Librito) compartiendo el mismo
  núcleo `renderToParagraphs()`. Es posible porque el vocabulario de clases
  CSS de ambos documentos no colisiona (`.mass-section`/`.liturgical-text-
  block` vs. `.librito-section`/`.librito-text`) — tal como se dejó
  planteado en el diseño original de la Fase 1.
- Paleta tipográfica propia (Palatino Linotype, tinta azul `#16233A`, rojo
  `#A4243B`, acento azul `#2C5C8F` para el documento principal; acento verde
  `#1A5C42` para las secciones de vocabulario `.librito-*`) — misma familia
  visual que la página, distinta de la paleta marrón/dorado del exportador
  del Misal.
- Sin imágenes, filas bilingües ni `.petition` en el dispatcher — ese
  vocabulario no existe en el HTML de este generador (a diferencia del
  Misal), así que se omitió en vez de dejar ramas muertas.

### Verificación
- `node --check` limpio.
- Documento principal: exportado el Domingo de Resurrección — DOCX válido
  (`Packer.toBlob()` no lanzó ninguna excepción), 21.150 bytes, tipo MIME
  correcto, nombre `BCP2019-Domingo-de-Resurrección.docx` (verificado
  interceptando `saveAs` para inspeccionar el Blob en vez de depender de la
  carpeta de descargas del navegador de vista previa, que usa un perfil
  aislado).
- Librito: exportado reutilizando el mismo estado ya en pantalla — 15.252
  bytes, tipo MIME correcto, nombre `Librito-BCP2019-Domingo-de-
  Resurrección.docx`.
- **BUG encontrado y corregido**: el botón "⬇ Descargar DOCX" del Librito
  restauraba su texto a "⬇ DOCX" (copiado del botón del documento
  principal) en vez de su propio texto original — tras la primera
  descarga, el botón perdía la palabra "Descargar" permanentemente.
  Corregido y reverificado con clic real (no interceptado): el texto se
  restaura correctamente.

**Verificado por:** Claude Code Assistant
**Fecha de verificación:** 2026-08-05

---

## ✠ Cuarta entrega — 2026-08-05 (rúbricas en rojo dentro de ambos DOCX)

El usuario señaló que las rúbricas debían verse en rojo en los dos
documentos Word — auditoría dirigida a confirmarlo.

### BUG encontrado y corregido: `.librito-instruction` sin color en el DOCX
Las 21 instrucciones de postura del Librito ("Nos ponemos de pie", "Nos
arrodillamos", etc. — rúbricas dirigidas al fiel, no texto a decir) se
exportaban en `bcp2019/js/docx-export.js` con `buildRuns(p)` sin pasar
color, heredando el color de tinta normal (`16233A`) en vez del rojo de
rúbrica (`A4243B`) que sí llevan en la página web (`.rubric`/`.lit-rubric`
del documento principal ya lo hacían bien). **Fix:** `buildRuns(p, {
italic: true, color: C_RUB, size: SZ_SM })`, misma convención que el resto
de rúbricas del exportador.

### Verificación: inspección directa del color real, no solo del tamaño del archivo
En vez de confiar en que el Blob se generó sin errores, se interceptó el
constructor `TextRun` de `window.docx` para capturar los argumentos reales
con los que se construye cada fragmento de texto antes de empaquetarse —
497 `TextRun` capturados entre ambos documentos (Domingo de Resurrección).
- Las 14 rúbricas de muestra verificadas por texto (`"Nos ponemos de
  pie"`, `"El Celebrante predica"`, `"Nos arrodillamos en reverencia"`,
  etc., de ambos documentos) resultaron con `color: "A4243B"`.
- Búsqueda inversa (palabras típicas de rúbrica con color distinto de
  `A4243B`): un único resultado, y es un falso positivo esperado — texto
  real del Evangelio de Juan ("se volvió y vio a Jesús, **de pie**"),
  correctamente sin colorear por ser Escritura y no instrucción.
- Confirma que el fix cubre las 21 instrucciones del Librito sin afectar
  ningún otro texto.

**Verificado por:** Claude Code Assistant
**Fecha de verificación:** 2026-08-05

---

## ✠ Quinta entrega — 2026-08-05 (responsive para móvil)

Auditoría dirigida a móvil: simulación de 375px, 320px (iPhone SE 1ª gen,
el ancho común más angosto) y desktop, midiendo `scrollWidth` real de todo
el árbol del DOM (no solo inspección visual) en las 3 vistas del sitio
(documento principal, Manual, Librito) y en modo claro/oscuro.

### BUG encontrado y corregido: `.cover-title` desbordaba en 375px
La portada del documento (`.cover-title`, `font-size: 3rem`) no tenía
reducción en el `@media (max-width: 680px)` existente — a 413px de ancho el
título medía 452px reales (39px de overflow horizontal real, confirmado
programáticamente antes y después del fix). **Fix:** añadido bloque
completo de portada al media query (`.cover-cross`, `.cover-title`,
`.cover-subtitle`, `.cover-feast`, `.cover-date`, `.cover-page`, y de paso
`.feast-header`/`.feast-meta` para mejor aprovechamiento de espacio, y
`.lit-line { flex-wrap: wrap }` como margen de seguridad para diálogos con
etiquetas largas).

### BUG encontrado y corregido: `.manual-header-block h2` sin reducir
Mismo patrón que el Misal Anglicano (ver su propio `VERIFICACION.md`) —
`.librito-header h2` sí tenía reducción en su media query de 768px, pero
`.manual-header-block h2` no. No llegó a causar overflow real en las
pruebas (queda justo al límite), pero se corrigió por consistencia y
margen de seguridad ante otras fuentes/dispositivos.

### Verificación
- Simulación con medición directa de `scrollWidth` vs `innerWidth` sobre
  todo `document.body` (no muestreo visual) en 375px y 320px, para las 3
  vistas (documento generado, Manual, Librito) y en modo oscuro: **0
  elementos con overflow** tras los fixes.
- Botones y campos verificados con `getBoundingClientRect()`: botón
  Generar 311×85px, botones secundarios 148×51px, inputs 311×49px — todos
  por encima del mínimo táctil recomendado (44px).

**Verificado por:** Claude Code Assistant
**Fecha de verificación:** 2026-08-05

---

## ✠ Sexta entrega — 2026-08-05 (PWA instalable con icono en pantalla de inicio)

Misma implementación PWA del Misal Anglicano (ver su propio `VERIFICACION.md`,
Séptima Auditoría), adaptada a este sitio con identidad y `scope` propios para que
ambos generadores se instalen como apps independientes en el mismo dispositivo.

### Implementación
- **Iconos:** generados a partir de `bcp2019/img/icon-bcp2019.svg` (fondo azul
  `#16233a` + cruz griega, misma técnica de rasterización vía `<canvas>` que el
  Misal): `favicon-32.png`, `apple-touch-icon.png` (180×180), `icon-192.png`,
  `icon-512.png` — archivos e identidad visual propios, sin compartir con el Misal.
- **`bcp2019/manifest.json`:** `start_url: /bcp2019/index.html`, `scope: /bcp2019/`,
  `theme_color: #16233a` (ya coincidía con el meta `theme-color` existente, sin
  necesidad de corregirlo), `background_color: #f2f5f9`, los 3 iconos propios.
- **`bcp2019/sw.js`:** mismo patrón *stale-while-revalidate* que `../sw.js`, con
  `PRECACHE_URLS` apuntando a las rutas absolutas `/bcp2019/...` (necesario por el
  bug de resolución de rutas relativas ya documentado en la Primera entrega).
- **`bcp2019/index.html`:** añadidos `<link rel="manifest">`, `<link rel="apple-
  touch-icon">`, `<link rel="icon" sizes="192x192">`, meta `mobile-web-app-capable`
  / `apple-mobile-web-app-*` (título "BCP 2019"), y script de registro del Service
  Worker con `scope: '/bcp2019/'` explícito antes de `</body>`. Todas las rutas en
  absoluto (`/bcp2019/...`), igual que el resto del archivo. CSS bump `?v=1` → `?v=2`.

### Validación
- **Local** (`http://localhost:3000/bcp2019/`): `fetch('/bcp2019/manifest.json')` →
  200 con el JSON esperado; los 3 iconos → 200, `content-type: image/png`;
  `navigator.serviceWorker.getRegistrations()` → 2 registros (uno por cada sitio
  visitado en la sesión), el de este sitio con `scope: http://localhost:3000/bcp2019/`.
- **Producción** (`https://liturgia-anglicana.netlify.app/bcp2019/`, tras `netlify
  deploy --prod`): misma verificación repetida en vivo — manifest 200, los 3 iconos
  200/`image/png`, Service Worker activo con `scope: https://liturgia-anglicana.
  netlify.app/bcp2019/`, coexistiendo sin conflicto con el del Misal Anglicano
  (`scope: .../`) en la misma sesión de navegador.
- Un error 404 aislado en consola, investigado y descartado como ruido residual de
  una página de prueba ya eliminada (`_icon-generator-temp`) — sin request 404 real
  en el listado de red; detalle completo en la Séptima Auditoría del Misal Anglicano.

**Verificado por:** Claude Code Assistant
**Fecha de verificación:** 2026-08-05
