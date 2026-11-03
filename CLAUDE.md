# CLAUDE.md — Misal Anglicano y generador BCP 2019

Contexto de proyecto para Claude Code. Última actualización: 2026-10-10.

## Qué es

Dos PWA estáticas, sin framework, servidas con `npx -y http-server` y desplegadas
en Netlify. No hay build, no hay bundler: los `<script>` se cargan en orden desde
`index.html` y cada módulo es un IIFE que expone un objeto global.

- **Raíz** — «Misal Anglicano»: generador de liturgia anglo-católica completa en
  español. Cuatro ritos (Canon Romano del Misal Anglicano, BCP 1549, 1662, 1928),
  tres idiomas del Ordinario (español, latín, bilingüe), cuatro modos votivos
  (ninguno, Réquiem, Espíritu Santo, Santa María). Exporta a Word y genera el
  Librito del Pueblo.
- **`/bcp2019`** — app hermana, más ligera, para el Libro de Oración Común 2019
  de la ACNA. Comparte la Biblia de Jerusalén y la librería `docx` de `../js/lib/`.

## Arquitectura

```
js/calendar.js        Calendario litúrgico. Emite ~420 claves de día.
js/lectionary.js      Leccionario por clave y ciclo A/B/C.
js/propers.js         Colectas, introitos, graduales, ofertorios, comuniones,
                      secretas, poscomuniones, prefacios. Cadena de respaldo.
js/commemorations.js  Conmemoraciones y resolución de ocurrencias.
js/canon.js           Ordinario y Canon en los cuatro ritos y tres idiomas.
js/intercessions.js   Oración de los Fieles.
js/app.js             Orquestador. Arma el HTML y guarda `currentMassState`.
js/librito-pueblo.js  Folleto de la asamblea. NO recalcula: lee currentMassState.
js/docx-export.js     Recorre el DOM ya renderizado y construye el .docx.
js/lib/               Biblia de Jerusalén (4,5 MB), docx, FileSaver.
```

Dependencia clave: `app.js` guarda el estado en `currentMassState` y tanto el
Librito como la exportación a Word parten de ahí. Si `app.js` deja de guardar un
campo, el Librito lo pierde **en silencio**, sin error. Ya ocurrió con el Gradual,
ausente del Librito todos los días de todos los años hasta el 20 de septiembre.

## Reglas de trabajo, no negociables

1. **No inventar textos litúrgicos.** Ni en español ni en latín. Ni colectas, ni
   secretas, ni antífonas, ni traducciones. Si falta un texto, se deja faltando y
   se anota en `Propers.MISSING_TEXTS`. Se puede corregir lógica, mapeos,
   referencias bíblicas mal formadas y erratas de codificación.
   **Única excepción, pedida por el usuario (2026-11-02):** las colectas del BCP 2019
   (`bcp2019/js/propers.js`) se tradujeron del inglés; ver «Colectas traducidas» en
   *Decisiones ya tomadas*. Fuera de eso la regla sigue en pie: en particular no se
   traduce nada del Misal de la raíz ni de otros textos sin que el usuario lo pida.
2. **No confiar en los documentos de verificación.** `VERIFICACION.md` declaró
   correcta durante meses una fórmula equivocada del ciclo ferial, y
   `test-logic.js` repetía el mismo error, así que los tests pasaban en verde
   contra una premisa falsa. Tampoco hay que fiarse de
   `bcp2019/VERIFICACION-BCP2019.md`, que el código cita tres veces como fuente
   de escrutinio (existe, en `bcp2019/`; `calendar.js` lo nombra sin ruta).
   Verificar ejecutando código, siempre.
3. **Verificar por simulación amplia, no por muestreo.** El método que funciona:
   cargar los módulos en un contexto `vm` de Node y barrer 2024-2060 (13.515
   días), generando la liturgia completa. Los fallos de este proyecto no lanzan
   excepciones: un *Communicantes* equivocado se imprime tan limpio como el
   correcto.
4. **Cuidado con el trabajo en paralelo.** Cada vez que varios cambios tocaron
   archivos distintos, la rotura apareció en las costuras: `canon.js` hablando un
   esquema de claves más viejo que `calendar.js`, o `librito-pueblo.js`
   consumiendo señales que `app.js` no enviaba. Tras cualquier cambio de
   estructura, cargar TODOS los módulos juntos y simular.
5. **Subir el cache-buster.** Los `<script src="js/x.js?v=NN">` de `index.html`
   llevan versión y `sw.js` cachea por URL. Si se tocan los JS y no se sube el
   número, los navegadores con el service worker activo siguen sirviendo el
   código viejo. Actualmente en `?v=31` (Misal) y `?v=25` (bcp2019; la hoja de estilo, `?v=7`).

## Fuente litúrgica autorizada (2026-10-04)

El usuario designó como fuente su **Misal Anglicano impreso** (Sociedad Sacerdotal
Corpus Christi, 2013): `C:/Users/gonza/OneDrive/Desktop/MISAL ANGLICANO.pdf`.
Contiene colectas de todo el año, prefacios, Semana Mayor, Plegarias Eucarísticas y
el Canon Gregoriano. **No contiene secretas, poscomuniones, introitos ni graduales
por día** (remite al Prayer Book / Misal Anglicano), así que esos textos de
`Propers.MISSING_TEXTS` siguen sin fuente. Colectas, prefacios y Viernes Santo
(`js/holyweek.js`) están transcritos de ese misal. Para convertirlo a texto usar
`markitdown`, que en Windows lo guarda en cp1252: decodificar como cp1252.

Rito de 1928: el texto inglés se cotejó con el BCP 1928 (aocinternational.org);
la versión española es traducción propia y debe revisarse.

## Estado al 2026-09-20

Verificado por simulación: 124.188 generaciones completas del Misal (37 años ×
4 ritos × 3 idiomas × 4 modos votivos) y 13.515 días del BCP 2019. Cero
excepciones, cero días sin colecta o sin lecturas, cero divergencias entre el
Misal y el Librito, cero bloques perdidos al exportar a Word. `test-logic.js` en
17/17.

Advertencia honesta: esto está verificado por simulación, **no por uso real en el
altar**. `calendar.js` pasó de 452 a 790 líneas en un solo día. Conviene generar
liturgias concretas y cotejarlas con el Misal impreso antes de usarlas en público.

## Git y remoto

- **Remoto:** `origin` → <https://github.com/ibcgcentral-sistemas/liturgia>
  (repositorio **privado**; contiene la Biblia de Jerusalén en `js/lib/`). Rama
  `main`, con seguimiento de `origin/main`.
- **Identidad** ya fijada en el propio repositorio (`user.name` Alexis González
  Matus, `user.email` alexveo855@gmail.com): no hace falta pasarla a mano.
- **`.claude/settings.json` no se versiona**: lleva una ruta absoluta local y un
  hook que arranca un servidor en el puerto 8080. Aparece como archivo sin
  seguimiento; es lo esperado.
- **Historial:** nueve commits locales, de `b6edf31` (2026-08-05) a `415d7a6`
  (2026-10-04); el «Initial commit» de GitHub (`4f89ea6`, solo `README.md`); el
  merge `3e95e16` que los une, y `b03d4f9` (ritos 1662 y 1928). `git log` es la
  fuente de verdad.

## Trabajo pendiente, por orden de valor

### 1. Textos litúrgicos que faltan (bloquea el uso real)

Listados en `Propers.MISSING_TEXTS` (`js/propers.js:490`). Hoy se sirve el texto
del tiempo con una rúbrica que lo declara suplido, en vez de rezar calladamente la
Secreta de la Trinidad el Jueves Santo. Faltan, y hay que transcribirlos del Misal
impreso:

- Secretas y Poscomuniones de Epifanía, Pre-Cuaresma, Cuaresma, Tiempo de Pasión,
  Triduo, Miércoles de Ceniza, los 28 Domingos después de la Trinidad, Corpus,
  Sagrado Corazón y las fiestas fijas no marianas.
- Oración sobre el pueblo del Viernes Santo (*super populum*).
- Introitos de Pre-Cuaresma: *Circumdederunt*, *Exsurge quare obdormis*,
  *Esto mihi*.
- Graduales, tractos, ofertorios y comuniones de los Domingos después de la
  Trinidad y de las fiestas fijas no marianas.

### 2. Salmos del BCP 2019: título y versículos (resuelto en lo medible, 2026-11-02)

La Biblia de Jerusalén numera el título como versículo 1. Hay dos casos y cada uno
tiene su tabla: `PSALM_TITLE_OFFSET` (`js/lib/biblia-wrapper.js`) salta el título
cuando ocupa su propio versículo (el 51 lo salta en dos), y `PSALM_FUSED_TITLE`
(`bcp2019/js/utils.js`) recorta el título que va fundido en el v. 1 con el comienzo
del cuerpo (23, 130 y otros 31; 33 salmos en total). Solo recorta texto de la Biblia,
no añade nada. `test-bcp2019.js` (1l, 2b, 2c) falla si un salmo del día empieza con
título, repite versículos, o si un título de la tabla deja de abrir su v. 1.

Límites: se comprobó el comienzo del cuerpo en los 87 salmos que cita el leccionario,
no cada versículo interior ni los cortes de final de cita. Las letras del acróstico
(«Alef.», «Bet.» en los salmos 25, 34, 37, 111, 112, 119 y 145) siguen impresas.
`js/app.js` del Misal de la raíz lee los salmos con el mismo wrapper y **no** aplica
`cleanPsalmVerses`, así que cualquier salmo con título fundido que cite su leccionario
sale con título (no se midió cuántos).

### 3. Huecos conocidos, menores

- `bcp2019/js/lectionary.js` se genera desde las tablas oficiales del libro
  (pp. 717-733) con `node bcp2019-tools/build-lectionary.js`; `node
  test-bcp2019.js` barre 2024-2060 y falla si algo falta o se aparta del libro.
  Lunes a Miércoles Santos llevan ya las lecturas del libro (`fa4d8f3`), no las del
  Misal Romano.
- 10.400 días toman la Colecta del Domingo precedente sin anunciarlo. Las lecturas
  prestadas sí llevan rúbrica; la colecta no. Rotularla «(Colecta del tiempo)»
  sería falso, porque es la del domingo anterior: hace falta decidir la redacción.
- `js/intercessions.js` no tiene intención estacional para Pre-Cuaresma (629 días).
- Erratas en el latín de `canon.js`: ya corregidas `regnat` por *regnas*, «mi
  oración» / «mi clamor» frente a *orationem meam* y el Salmo 51 del Asperges
  (`425a258`). Queda por decidir el Lavabo, que dice «Salmo 26» en español y
  «Psalmus 25» en latín (numeración hebrea frente a Vulgata, l. 219). El
  *Introibo* (l. 141-142) figura completo en ambos idiomas, así que la nota
  anterior de que estaba truncado no se pudo reproducir.
- `bcp2019`: las fiestas fijas que caen en domingo se trasladan al primer día de
  semana libre (decisión del usuario, 2026-10-31, `fa4d8f3`), salvo en Adviento,
  Cuaresma y Pascua, donde ceden ante el domingo como pide el libro, y salvo Todos
  los Santos y el Santo Nombre. `test-bcp2019.js` 1k lo vigila (153 casos). No se
  comprobó si las que ceden ante el domingo se conmemoran.
- `bcp2019`, prefacios (2026-11-02): el **texto** se cotejó con el libro en español
  (`node bcp2019-tools/check-prefacios.js`; 29 de 31 idénticos y 2 desviaciones
  deliberadas, «Tú pides» y el punto final del Matrimonio). El **mapeo día→prefacio**
  (ORD-04 a ORD-06) se replicó por simulación y se corrigió en `getPreface`
  (`propers.js`): los domingos de Propio llevan el del Día del Señor, el V de Cuaresma
  el de Cuaresma, el VII de Pascua el de la Ascensión, y las 30 fiestas fijas el que
  rotula el libro en inglés (tabla `FEAST_PREFACE`; 16 diferían). Cambian 1.517 de
  13.515 días; en 2026-27 son 83, frente a los 77 de la auditoría (no se reconcilió
  día a día; el traslado de fiestas en domingo es posterior a la auditoría).
  `test-bcp2019.js` 5 vigila la tabla contra una copia literal sacada del libro. Las
  **ferias** de Tiempo Ordinario conservan «En Cualquier Tiempo» (el libro no exige
  prefacio entre semana; se deja uno para que la Eucaristía no quede sin él). Los
  domingos 5.º-8.º de Epifanía llevan el de Epifanía, que el libro admite junto al del
  Día del Señor. Sin hacer: faltan la alternativa de «En Cualquier Tiempo» y los
  prefacios de Canadá/Independencia y de Caídos, que el calendario no emite.
- `bcp2019`, Aclamación de apertura (ORD-07/08, 2026-11-02): la Semana Santa llevaba la
  fórmula de Cuaresma y el Día de Pentecostés la pascual (222 días en 2024-2060).
  Ahora `acclamationKind()` (`utils.js`, la usan `app.js` y el Librito) da Cuaresma
  solo de Ceniza al sábado antes de Ramos, «Bendito sea nuestro Dios / Ahora y por
  siempre. Amén.» en Semana Santa (texto del libro, p. 146), la pascual hasta la
  víspera de Pentecostés, y el saludo de Joel el Día de Pentecostés (**decisión del
  usuario**, 2026-11-02: el libro admite también la fija; texto de la p. 146 copiado
  sin puntuación añadida, y el libro lo da además para confirmación y ordenación, que
  el generador no modela). La Fracción sin Aleluya (Cuaresma y Semana Santa) y la
  Despedida con «aleluya, aleluya» (hasta Pentecostés inclusive) eran correctas y
  siguen con su propia regla; `test-bcp2019.js` 6a-6c vigila las tres, en la liturgia y
  en el Librito, y 6a exige el saludo de Joel completo y en orden. Siguen sin estar los
  saludos de Adviento, Navidad, Epifanía y Todos los Santos de esa misma página,
  porque el libro los da como opcionales («puede ser reemplazada»).
- `bcp2019`, **formas de la Eucaristía** (2026-11-02): el libro da DOS (*Concerning the
  Holy Eucharist*, EN l. 2729-2745): el **Texto Estándar Anglicano** (de 1662 y sus
  sucesores, en lenguaje contemporáneo) y el **Texto Antiguo Renovado** (de la Iglesia
  primitiva, cercano al Rito II de 1979), más las *Additional Directions* (orden de
  1662, Orden Penitencial, abreviaturas, Oración de los Fieles alternativas). El
  generador ofrece **las dos formas** (selector «Forma de la Eucaristía»;
  `generateLiturgy(date, {form})` guarda `form` en `currentMassState`). El Estándar sale
  de `eucharist.js`; el **Texto Antiguo Renovado** (2026-11-02) son las secciones
  `renewed*` de `holyweek-data.js`, cortadas del libro en español (`LOC-10-10-23.md`
  l. 3174-3612) por `build-holyweek.js`, copiadas y no traducidas. Comparten el comienzo
  (Aclamación, Pureza, Ley, Kyrie, Gloria), la Colecta, las lecturas y la Fracción; desde
  el Credo hasta la Despedida el Renovado trae texto propio, en la liturgia y en el
  Librito (el Prefacio lo dice el Celebrante: el Librito pone solo la indicación). Los
  ritos de Ceniza, Ramos, Jueves y la Vigilia usan la forma elegida para lo que les
  queda de Eucaristía. `test-bcp2019.js` 11 barre 2024-2060 y comprueba que sale cada
  bloque del libro que ese día toca, en orden, que no se cuela texto del Estándar (ni al
  revés) y que el Aleluya de la Despedida es de Pascua. **No están:** el Orden
  Penitencial, el reordenamiento de 1662 y el Trisagio (hay texto en `eucharist.js`, no
  se ofrece); el Sermón sí figura como rúbrica. Se vio en el navegador la liturgia y el
  Librito del 2026-06-07 (sin errores de consola) y se exportó a Word, liturgia y
  Librito: los 116 bloques del libro llegan al `document.xml`, con los versos en líneas
  separadas (`<br>` es un salto real de Word). También en Ceniza, Ramos, Jueves Santo,
  Sábado Santo (Vigilia) y Pascua de 2026: ningún bloque perdido, ningún texto del
  Estándar, el rito propio presente, el Jueves sin despedida y el Aleluya solo en Vigilia
  y Pascua. La prueba 11 se mutó a propósito (quitar el
  Humilde Acceso de la liturgia, el Agnus Dei del Librito, forzar las Oraciones del
  Estándar, el Aleluya fuera de Pascua, el Renovado en la forma Estándar y el Librito sin
  recibir la forma): detectó las seis.
  El libro imprime «JOHN 1:29» en una referencia de la Administración; se copió tal cual.
- `bcp2019`, **Semana Santa** (2026-11-02): Domingo de Ramos, Jueves, Viernes y Sábado
  Santo llevan su rito del libro en español, **copiado, no traducido**. `bcp2019-tools/
  build-holyweek.js` corta el libro por anclas y genera `bcp2019/js/holyweek-data.js`
  (no editar a mano; `test-bcp2019.js` 9 comprueba que sigue idéntico a lo que genera el
  script, y `holyweek.js` lo pinta en la liturgia y en el Librito). Ramos: Liturgia de las
  Palmas, y en la Eucaristía el Saludo y la Colecta sin Ritos Iniciales, sin Credo ni
  Oraciones del Pueblo (el libro dice «pueden omitirse»: se omiten, rúbrica incluida) y la
  Pasión sin las respuestas habituales. Jueves: apertura y lavatorio del libro, y **sin
  bendición ni despedida** («la Congregación se marcha en silencio»; antes las imprimía).
  Viernes y Sábado Santo: rito completo (Colectas Solemnes, Improperios, Distribución de la
  Comunión; himno del Sábado) con las lecturas del leccionario. El libro no distingue
  rúbricas de texto en el Markdown: el script las clasifica por su forma (heurística;
  `--preview` muestra cómo) y las excepciones van en `OVERRIDES`. **Gran Vigilia
  Pascual** (2026-11-02): se ofrece en la página del **Sábado Santo**, tras el rito del día
  (`easterVigil*` en `holyweek-data.js`): Servicio de la Luz con el Pregón (Exsultet),
  las **12 lecciones** con su colecta y salmos (el libro pide «al menos tres, siempre el
  Éxodo»: se imprimen todas, el celebrante elige), Aclamación Pascual, Gloria, colecta,
  Epístola y Evangelio, y la Eucaristía de Pascua (prefacio de Pascua, Fracción y
  Despedida con Aleluya, bendición opcional de la Vigilia). Los textos bíblicos son de la
  Biblia de Jerusalén; Daniel 3 se pide como `3:1-23,91-95` y Jonás 1:17 tiene regla en
  `VERSE_SHIFTS` (`test-bcp2019.js` 9 cuenta los versículos de las 14 citas). **No están:**
  el texto de los salmos y cánticos de la Vigilia (solo sus citas, como en el libro), el
  Santo Bautismo y la Confirmación (necesitan candidatos y obispo; el libro remite a otro rito y
  solo queda su rúbrica; tampoco hay acción de gracias sobre el agua ni aspersión, que no están en
  el libro para la Vigilia) y la marca del Cirio Pascual. **Renovación de los Votos Bautismales**
  (2026-11-02): sí está (`easterVigilRenewal` y `easterVigilContinues`, LOC l. 4835-4907 y
  15632-15633), tras el Sermón y antes de las Oraciones del Pueblo, sin Credo Niceno; se copió tal
  cual, con las erratas del libro («¿Creen y confían?» en plural, «las Oración de los Fieles»),
  salvo una que el usuario mandó corregir: el «¿» de apertura de «¿Renuncias a Satanás…?», que el
  libro omite (`CORRECCIONES` en `build-holyweek.js`: el script falla si el libro cambia y la
  corrección ya no encuentra su texto). `test-bcp2019.js` 9 compara esas dos secciones con el
  libro más solo esas correcciones.
  Solo se modela la posición tras el Sermón (el libro permite también tras las lecturas). **Miércoles de Ceniza** (2026-11-02): su rito propio
  (`ashWednesday*` en `holyweek-data.js`, `test-bcp2019.js` 10) sustituye a los Ritos
  Iniciales, la colecta aparte, el Credo, las Oraciones del Pueblo y la confesión
  habitual: apertura, Invitación a la santa Cuaresma con su colecta (oficial), imposición
  de la ceniza con el Salmo 51 (texto del propio libro, no de la Biblia de Jerusalén),
  Confesión y Letanía de Penitencia, Absolución (las dos fórmulas), palabras confortantes
  y paz, y la Eucaristía con prefacio de Cuaresma y la oración de cierre del libro. Se
  imprime siempre el rito con Comunión; el de sin Comunión (Padrenuestro y oración
  final), la absolución de un diácono o laico y la ceniza «con las Palmas del año
  anterior» solo figuran como rúbricas del libro. **Discrepancia del libro, no
  corregida:** la página del Sábado
  Santo pide Job 14:1-14 y la tabla del leccionario (`lectionary.js`) Job 14:1-17; se
  sigue la tabla. El Jueves Santo conserva Colecta por la Pureza, Kyrie y Gloria porque el
  libro no los quita, aunque tampoco los nombra.
- `bcp2019`, **lecturas en español** (2026-11-02): el libro en español NO trae leccionario,
  así que el texto de las lecturas es de la **Biblia de Jerusalén** (elección del
  proyecto), pedida por la cita inglesa del libro. Medido por simulación: las 876
  referencias coinciden con las tablas oficiales (prueba 3); las 715 citas devuelven
  texto (2); y de 532 citas de un solo capítulo, 531 imprimen exactamente los versículos
  pedidos (2d). Las 4 distintas están fijadas en `DIF_CONOCIDAS` de `test-bcp2019.js`:
  Hechos 8:37 y Marcos 9:44 y 46 (variantes textuales que la Biblia de Jerusalén no
  trae), y Romanos 11:35-36 y 2 Corintios 13:12-13 (versículos fundidos, texto
  completo). **Mateo 21:44** (Propio 22, ciclo A) tampoco lo trae esa Biblia: **se
  completa con la NVI** (la versión en que cita el libro en español; decisión del
  usuario, 2026-11-02) mediante `VERSE_SUPPLEMENTS` en `utils.js`, y la lectura lo avisa
  con una rúbrica «[v. 44 según la NVI; la Biblia de Jerusalén no lo trae en el
  texto]». No se pudo obtener el texto de la Biblia de Jerusalén para ese versículo (no
  está en la web consultada ni en el archivo local). Alternativa de dominio público: la
  Reina-Valera 1909 (está anotada en el comentario). Las citas de varios capítulos solo
  se compararon por su primer y último versículo. **No** se verificó que la traducción
  sea fiel ni, en los salmos, cada versículo interior.
- Código muerto inocuo: `takeProper()` en `app.js`, el alias `ordinaryFeria` en
  `propers.js`, `circumcision` y `getSundaysAfterPentecostLabel()` en `bcp2019`.

## Decisiones ya tomadas por el usuario

No volver a plantearlas salvo que él las reabra:

- **Colectas traducidas del inglés en el BCP 2019** (2026-11-02): el usuario pidió expresamente
  traducir, «a pesar de la regla del proyecto». Las colectas que traía `propers.js` estaban
  reconstruidas de memoria y no coincidían con el libro (el Propio 3 era otra oración).
  Ahora hay 95: **6 oficiales** (Ceniza, Ramos, Jueves, Viernes y Sábado Santo y la Anunciación,
  copiadas del libro en español, `COLLECT_OFFICIAL`) y **89 traducidas** por este proyecto del *Collects of the
  Christian Year* del BCP 2019. Son traducciones propias, **pendientes de revisión litúrgica**
  (`bcp2019/COLECTAS-REVISION.md`); la liturgia imprime bajo cada una la nota «Colecta traducida
  del inglés», que se apaga con `SHOW_COLLECT_TRANSLATION_NOTE = false` en `app.js`. Fórmulas
  finales del propio libro en español. `test-bcp2019.js` 8 y `bcp2019-tools/check-colectas.js`
  vigilan que las oficiales sigan idénticas al libro y que las traducidas tengan la forma, la
  longitud y el santo correctos; no pueden juzgar la calidad del español. El inglés no está en
  el repositorio: `BCP_EN_MD=ruta/BCP2019-en.md` activa la comparación con el original.
  **Revisión asistida (2026-11-02):** a petición del usuario, tres agentes contrastaron las 89
  colectas con el inglés y el léxico del libro, un modelo distinto consolidó, y se verificaron las
  citas antes de aplicar: 6 cambios en colectas (ver `COLECTAS-REVISION.md`). Lo hizo un modelo,
  **no un liturgista**: las 89 traducciones siguen pendientes. Decisiones del usuario: el 2.º
  Domingo de Navidad conserva la traducción propia aunque el libro lo traiga en la Vigilia, y
  «Santísima Virgen María» unifica 05-31 y 08-15 (única forma del libro, l. 6492). Después, a
  petición del usuario, el revisor tomó las decisiones de estilo que quedaban: siete retoques de
  fidelidad (Epifanía 2 y 8, Pascua 4, Propio 20, 11 jun, 21 sep y 25 ene; ver
  `COLECTAS-REVISION.md`) y el resto se dejó como está. Lo único que falta es la aprobación de
  una autoridad litúrgica, que un modelo no puede dar: por eso la nota impresa sigue en pie.
  Las pruebas se corren con años (`node test-bcp2019.js 2026 2026`): `check-colectas.js` ya no toma
  esos años por rutas (antes se saltaba en silencio la comparación con el libro y la prueba decía
  «oficiales idénticas»; ahora el rótulo cuenta las comparadas).

- **Gloria**: uso tradicional. Se omite desde Septuagésima (domingos de
  Pre-Cuaresma incluidos) y en el Domingo de Ramos.
- **Gloria en el BCP 2019** (2026-11-02): se omite en **Adviento**, Cuaresma y
  Semana Santa, salvo Jueves Santo y las fiestas fijas de santos. El libro de la ACNA
  solo pide omitirlo «en los tiempos de penitencia y los días de ayuno» y **no nombra
  el Adviento**; el BCP episcopal de 1979 sí lo omite en Adviento y Cuaresma. Una
  auditoría lo había retirado del Adviento por esa razón y el usuario lo restituyó:
  no volver a quitarlo (`shouldOmitGloria`, `utils.js`; la rúbrica impresa dice que es
  costumbre, no mandato del libro). `test-bcp2019.js` 1j lo vigila.
- **Salmo alternado en el BCP 2019** (2026-11-02): el salmo del día se reza alternando por
  versículos, el **Lector** el primero que se muestra y el **Pueblo** el siguiente, en la
  liturgia, el Librito y el Word. El libro solo dice que «un salmo, himno o antífona
  puede seguir a cada lectura» y no prescribe la forma. Si el día trae antífona (4 días),
  el Pueblo la dice al comienzo y al final, no tras cada estrofa. `test-bcp2019.js` 7 lo
  vigila. Efecto lateral: en el Word el Lector ya no sale en negrita (antes sí, a
  diferencia de la pantalla), para que se distinga del Pueblo.
- **Color del Domingo de Ramos**: se queda en rojo, sin cambiar.
- **Ciclo ferial I/II**: se retiró el anuncio de la interfaz, porque el
  leccionario ferial no está implementado y las ferias reutilizan las lecturas del
  Domingo precedente. `getWeekdayCycle` sigue en `calendar.js`, correcto pero sin
  anunciarse. Se designa por el año civil en que **termina** el año litúrgico:
  final impar es Ciclo I, final par es Ciclo II.
- **Propios faltantes**: cadena de respaldo por tiempo con rúbrica visible, nunca
  inventar el texto.
- **Ceremonial uniforme en los cuatro ritos** (uso anglocatólico): el Asperges me
  / Vidi Aquam, el Salmo 43 (Judica me), las rúbricas de incienso y las
  campanillas, tanto del Sanctus como de la elevación, no dependen del rito. En
  1662 y 1928 se añadieron, por decisión del usuario, el embolismo, la paz y el
  Agnus Dei antes de la Comunión (`b03d4f9`) y las campanillas de la elevación
  (el Librito ya las anunciaba en todos los ritos), aunque esos libros históricos
  no los traigan. No señalarlo como incoherencia.

## Historial de auditorías

`VERIFICACION.md` recoge ocho auditorías entre abril y septiembre de 2026, con 38
bugs documentados. `AUDITORIA-2026-09-20.md` es la auditoría independiente que
encontró 24 hallazgos adicionales confirmados por ejecución, todos ya corregidos,
incluido el bug del ciclo ferial que las ocho auditorías previas habían dado por
bueno. Ese documento vale sobre todo como advertencia de método.
