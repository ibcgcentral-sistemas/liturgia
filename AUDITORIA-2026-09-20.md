# ✠ Auditoría independiente — 2026-09-20

**Alcance:** lógica central del Misal Anglicano (`js/calendar.js`, `js/lectionary.js`,
`js/propers.js`, `js/commemorations.js`, `js/app.js`, `js/lib/biblia-wrapper.js`).

**Método:** dos revisiones simultáneas e independientes, con instrucción explícita de
**no confiar** en `VERIFICACION.md`, en los comentarios del código ni en `test-logic.js`.
El motivo: el bug del ciclo ferial I/II demostró que una auditoría previa puede declarar
correcta una fórmula equivocada y que los tests pueden repetir el mismo error. Cada
hallazgo se confirmó ejecutando código: los módulos se cargaron en contextos `vm` de Node
y se barrieron 13.515 días (2024-2060), resolviendo además cada cita bíblica contra la
Biblia de Jerusalén real que la app carga.

**Verificado como correcto por ambas revisiones** (no se reporta en detalle):
`computeEaster` (coincide con una implementación Gauss independiente en 1900-2200),
`getAdvent1`, el ciclo dominical A/B/C, el ciclo ferial I/II ya corregido hoy,
Ascensión/Corpus/Sagrado Corazón, la numeración de Domingos después de la Trinidad,
y el préstamo de colecta y lecturas del Domingo precedente en las 13.404 ferias.

---

## Nivel 1 — Afectan el texto que se reza o se imprime

### 1.1 El parser de citas convierte un versículo suelto en un capítulo entero
`js/lib/biblia-wrapper.js:158-161` (rama `chOnly`). En `"Mateo 1:16,18-21,24"` el
segmento `"24"` no casa con `verseOnly` (exige guion), cae en `chOnly` y se interpreta
como **capítulo 24 completo**; además reasigna `lastChapter` y contamina los segmentos
siguientes.

Casos verificados resolviendo contra la Biblia real:

- San José (19 mar), `Matthew 1:16,18-21,24` → **56 versículos**, terminando en el
  discurso escatológico de Mt 24:50-51 pegado al Evangelio de la fiesta.
- San Esteban (26 dic), `Psalm 31:3-4,6,8,16-17` → Sal 31:3-4 más el **Salmo 6 entero**
  y el **Salmo 8 entero**.
- `advent4` B, `2 Samuel 7:1-11,16` → 2 Sam 7 más 2 Sam 16 entero, en un domingo mayor.

17 citas defectuosas, 863 apariciones en 773 días del rango.
**Fix:** `chOnly` solo debe aplicarse si `lastChapter === null`.

### 1.2 Tres lecturas no se muestran: la app imprime un mensaje de error
- `js/lectionary.js:282` — `trinity4` C, `'Psalm 42-43'`: rango de capítulos sin `:`,
  `parseRef` devuelve `null` → `[Referencia no reconocida]`.
- `js/lectionary.js:331` — `trinity14` B, `'Song of Songs 2:8-13'`: `BOOK_MAP` traduce a
  `'Cantar de los Cantares'`, pero el libro se llama **`'Cantar'`**.
- `js/lectionary.js:337` — `trinity15` C, `'Philemon 1-21'`: rango sin capítulo, y
  `BOOK_MAP` apunta a `'Filemón'` cuando el libro es `'Filemon'`.

233 días afectados. (`'Nahum'→'Nahúm'` está igual de roto, hoy sin uso.)

### 1.3 Lunes, Martes y Miércoles Santos se generan sin ninguna lectura
`js/app.js:88` devuelve `{key:null}` para esas tres claves y `js/lectionary.js` no las
tiene. La app renderiza `[Primera lectura no especificada]` y `[Evangelio no
especificado]`. Son los **únicos 111 días de 13.515** sin lectura alguna. Evitar repetir
la Pasión de Ramos es correcto, pero deja la Misa sin Palabra: el Misal tiene propios
para esos días (Is 42/Jn 12, Is 49/Jn 13, Is 62/Lc 22).

### 1.4 Toda la Pre-Cuaresma está copiada de los domingos de Cuaresma
`js/lectionary.js:121-135`, comparado byte a byte:

- `sexagesima` A, B y C: copia literal de `lent2` A/B/C.
- `septuagesima` B y C: copia literal de `lent1` B y C.
- `quinquagesima` B: copia literal de `lent3` B.
- `quinquagesima` C: copia literal de **`ashWednesday`** — el domingo antes de Ceniza
  anticipa entera la misa que se repite tres días después.

Las tres dominicas tienen propios clásicos (Mt 20:1-16, Lc 8:4-15, Lc 18:31-43), que
`propers.js` ya refleja en sus graduales.

### 1.5 Desfase de un domingo entre las colectas y las lecturas de Epifanía
**Confirmado por ambas revisiones.** `js/calendar.js:268-272` llama `epi1` al domingo que
el propio motor titula «Segundo Domingo después de Epifanía» (el Bautismo ocupa el
primero). `js/lectionary.js:77` le asigna coherentemente las lecturas de Epifanía 2, pero
`js/propers.js:34` le pone la colecta del **Primer** Domingo del BCP. El desfase se
arrastra toda la temporada y la colecta del último domingo nunca se alcanza.

### 1.6 Sin Secreta ni Poscomunión propias en casi todo el año
`js/propers.js:335-357`: `SECRETS` y `POSTCOMMUNIONS` tienen 8 claves. Todo lo demás cae
al texto de la Trinidad. Verificado sobre 208 claves: Cuaresma, Semana Santa, Triduo,
Pre-Cuaresma, Epifanía, los 28 domingos `trinity*`, Corpus, Sagrado Corazón y las 26
fiestas fijas. En concreto, **el Viernes Santo, el Miércoles de Ceniza y los Fieles
Difuntos rezan la Secreta y la Poscomunión del tiempo de la Trinidad.**

### 1.7 Las 26 fiestas fijas no tienen propios cantados, y 15 no tienen Epístola
Ninguna clave `MM-DD` aparece en `INTROITS`, `GRADUALS`, `OFFERTORIES` ni `COMMUNIONS`
(`js/propers.js:228, 259, 293, 310`), y `getSeasonFromKey('11-01')` devuelve `'ordinary'`,
que tampoco existe: Introito, Gradual, Ofertorio y Comunión de la Trinidad en Todos los
Santos, la Asunción, la Candelaria, San José. Además 15 fiestas tienen `second: null` y
`js/app.js:408` omite la Epístola en silencio, sin rúbrica.

---

## Nivel 2 — Calendario: días mal identificados

### 2.1 1.150 días caen al fallback genérico «Feria» verde
**Confirmado por ambas revisiones.** `js/calendar.js:352-353`. Ningún bloque cubre del 29
de diciembre a la víspera de Septuagésima. Consecuencias: color **verde** en plena Octava
de Navidad (donde el propio `getSeason()` devuelve `'christmas'`, contradicción interna),
prefacio común, propios genéricos, y con `rank:'feria'` el motor **omite el Credo** en
días de la Octava en que sí se dice. En el año litúrgico 2025-2026 son 28 días.

Nota de arquitectura: `LiturgicalCalendar.getSeason()` sí clasifica bien esas fechas,
pero `app.js` nunca la llama, porque usa su propio `getSeasonFromKey`.

### 2.2 Las fiestas fijas devuelven `season === 'ordinary'` y no suprimen el Aleluya
`js/calendar.js:362-379` (`getSeason` despacha sobre `day.key`) y `:287` (las fijas
reciben `key = 'MM-DD'`). `getOmissions()` devuelve `[]` porque ninguna regla contempla
claves `MM-DD`. De las 834 fiestas fijas celebradas en el rango, **101 caen entre
Septuagésima y Pascua sin que se suprima el Aleluya** (Candelaria 2024, San José 2025,
Anunciación 2025) y 15 caen en Tiempo de Pasión sin la nota de velos.

### 2.3 Numeración de ferias de Cuaresma desplazada en jueves, viernes y sábado
`js/calendar.js:306`: `Math.ceil(diffDays(F.ashWednesday, date) / 7)` ancla en miércoles,
de modo que la «semana» corta jueves a jueves. Verificado en 2026: el jueves 26 de
febrero sale como «Jueves de la Semana 2» siendo de la Semana 1, y el 26 de marzo como
«Semana 6 de Cuaresma», que no existe. Cada clave `lentFeria{N}_{dow}` mezcla días de dos
semanas, así que los propios y lecturas feriales de jue/vie/sáb salen de la semana
equivocada en toda la Cuaresma.

### 2.4 Las fiestas de I Clase desplazadas desaparecen sin trasladarse
**Confirmado por ambas revisiones.** `js/calendar.js:281-295`: el bloque `FIXED_FEASTS`
se evalúa después de los `return` de Cuaresma, Adviento y Pre-Cuaresma. Cuando una fiesta
de primera clase coincide con un domingo cuaresmal o una móvil superior, desaparece por
completo. Verificado: San José en 2028, 2034, 2045, 2051, 2056; la Anunciación en 2029,
2035, 2040, 2046; San Juan Bautista en 2033, 2038, 2044; Pedro y Pablo en 2057. La
precedencia es correcta, pero falta la **traslación** al primer día libre.

Efecto lateral: la regla de las líneas 285-286 («en domingo solo las de I Clase
prevalecen») es código muerto para `03-19` y `03-25`.

### 2.5 El 26 de diciembre suprime el Domingo en la Octava, contra la regla declarada
**Confirmado por ambas revisiones.** `js/calendar.js:243` se ejecuta antes del bloque de
domingo y antes de la puerta de rango que el propio archivo enuncia. San Esteban es
`doubleSecondClass`, así que debería ceder y conmemorarse. Verificado en 2027, 2032,
2038, 2049, 2055 y 2060: `key:'12-26'`, cero conmemoraciones. En cambio, 27 y 28 de
diciembre sí ceden al domingo, con rango idéntico: trato inconsistente entre los tres
*comites Christi*.

### 2.6 El domingo absorbido por una fiesta fija desaparece sin conmemoración
`js/commemorations.js:82`: la función solo sabe conmemorar la fiesta fija desplazada, no
el caso inverso. 28 domingos absorbidos en el rango sin dejar rastro (Pedro y Pablo 2025,
Todos los Santos 2026, Asunción 2027, Juan Bautista 2029), contra la rúbrica que el
propio archivo declara en su cabecera.

### 2.7 La Anunciación se conmemora en el Triduo y en el Domingo de Pascua
`js/commemorations.js:91` devuelve `[fixedFeast]` sin excluir Semana Santa, Triduo ni
Octava de Pascua. Verificado: **2035-03-25 y 2046-03-25 añaden la conmemoración de la
Anunciación al Domingo de Resurrección**; 2027 y 2032 al Jueves Santo; San Marcos al
Domingo de Pascua en 2038. Una fiesta que cae ahí se traslada, no se conmemora.

### 2.8 Epifanía devuelve `'christmas'`, y el Tiempo de Pasión dura un solo día
`js/calendar.js:368`: la rama de Navidad se evalúa antes que la de Epifanía, así que el 6
de enero nunca alcanza `'epiphany'`. `:373`: `'passiontide'` se asigna solo a
`palmSunday`; el Domingo de Pasión (`lent5`, inicio real del tiempo), sus ferias y el
lunes a jueves de Semana Santa devuelven `'lent'`.

### 2.9 Octava de Navidad con prefacio común
`js/propers.js:362` y `js/app.js:94` comparan por igualdad exacta con
`christmas`/`christmasSunday`/`circumcision`. Quedan fuera `christmasSunday2`, `12-26`,
`12-27` y `12-28`: prefacio común y, al resolver `season` como `'ordinary'`, tampoco hay
Introito ni Gradual de Navidad.

### 2.10 141 días comparten la clave `ordinaryFeria`
`js/calendar.js:340`. Ni `propers.js` ni `lectionary.js` tienen esa entrada, así que esos
días quedan sin propios. Solo 182 días del año litúrgico tienen clave única.

---

## Nivel 3 — Criterio litúrgico, requiere decisión

Estos tres puntos dependen del uso que se quiera seguir. Se documentan sin corregir.

- **Gloria en el Domingo de Ramos** (`js/calendar.js:211`, `:402-408`): hoy no se omite.
  En el uso tradicional, la Misa del día es cuaresmal y no lleva Gloria. Relacionado: el
  color devuelto es rojo, cuando en el Missal anglicano el rojo corresponde a la
  bendición y procesión de palmas, y la Misa es morada.
- **Gloria en los domingos de Pre-Cuaresma** (`js/calendar.js:231-233` frente a `:301`):
  el motor se contradice, porque las ferias de Pre-Cuaresma sí lo omiten y los domingos
  que las rigen no. En el uso tradicional, desde Septuagésima se omite.
- **Ciclo ferial anunciado pero no usado** (`js/lectionary.js:499-527`, `js/app.js:241`):
  la interfaz muestra «Ciclo ferial: I/II», pero `getWeekdayReadings` no se invoca desde
  ningún punto del proyecto y la tabla `WEEKDAY` tiene 6 entradas con I y II idénticos.
  O se implementa, o no se anuncia.

---

## Nivel 4 — Menor

- **Claves inalcanzables:** `epi6`, `epi7`, `epi8` (cero apariciones en 37 años; `epi8`
  contiene la Transfiguración, que nunca se mostrará), `trinity28`, y la clave `'01-06'`
  de `lectionary.js:411`, duplicado inerte de `epiphany`.
- **Versificación:** `trinity9` C `'Hosea 1:2-10'` (Oseas 1 tiene 9 versículos en esta
  Biblia) y `trinity22` C `'Joel 2:23-32'` (Joel 2 tiene 27) truncan en silencio. En el
  segundo caso se pierde «derramaré mi espíritu», núcleo de la perícopa.
- **Rangos fuera del vocabulario:** Viernes y Sábado Santo usan `rank:'fast'`, ausente de
  `RANK_ORDER`, así que cualquier comparación de precedencia los trata como feria.
- **Código muerto:** `feastsPrev`/`FP` y `feastNext` se calculan en cada llamada a
  `getDay()` y nunca se usan.

---

## Nota sobre este documento

Los hallazgos de ejecución (conteos, fechas, citas resueltas) son reproducibles. Los
juicios litúrgicos de fondo (qué debería hacer el Misal en cada caso) merecen contraste
con las fuentes impresas antes de tocar el código, sobre todo en el Nivel 3. Esta
auditoría no revisó `/bcp2019`, ni el canon, ni la exportación a Word, ni el librito del
pueblo.

**Fecha:** 2026-09-20
