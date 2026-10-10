# CLAUDE.md — Misal Anglicano y generador BCP 2019

Contexto de proyecto para Claude Code. Última actualización: 2026-09-20.

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
2. **No confiar en los documentos de verificación.** `VERIFICACION.md` declaró
   correcta durante meses una fórmula equivocada del ciclo ferial, y
   `test-logic.js` repetía el mismo error, así que los tests pasaban en verde
   contra una premisa falsa. Peor: `bcp2019/VERIFICACION-BCP2019.md` es citado
   tres veces por el código como fuente de escrutinio y **no existe**. Verificar
   ejecutando código, siempre.
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
   código viejo. Actualmente en `?v=30` (Misal) y `?v=5` (bcp2019).

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

## PRIMERA TAREA: cerrar el commit pendiente

El árbol de trabajo tiene 14 archivos modificados **sin confirmar**, todos
verificados. El commit quedó bloqueado por un `.git/index.lock` residual que el
entorno anterior no tenía permiso para borrar:

```bash
cd "C:\Users\gonza\OneDrive\Desktop\liturgia"
del .git\index.lock          # o: rm -f .git/index.lock
git add -A
git commit -F mensaje.txt
```

El mensaje de commit sugerido está al final de este archivo. Conviene además
fijar la identidad de una vez, porque el repositorio no tiene `user.name` ni
`user.email` y los commits anteriores se hicieron pasando la autoría a mano:

```bash
git config user.name "Alexis González Matus"
git config user.email "alexveo855@gmail.com"
```

No hay remoto configurado. Historial: `b6edf31` inicial, luego `2a26378`,
`166bae7`, `35c0583`, `2ae466c`, `1f69308`.

## Trabajo pendiente, por orden de valor

### 1. Textos litúrgicos que faltan (bloquea el uso real)

Listados en `Propers.MISSING_TEXTS` (`js/propers.js:436`). Hoy se sirve el texto
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

### 2. Desfase de versículos en los salmos del BCP 2019

La Biblia de Jerusalén numera el encabezamiento como versículo, y el desfase
**varía salmo por salmo**: el 51 va desplazado dos (el `Psalm 51:1-13` imprime dos
líneas de rúbrica y se queda en el v. 11 del Miserere), el 31 uno, el 23 ninguno
porque su título va fundido en el v. 1. Afecta a entre 46 y 63 de los 137 salmos
citados. Ninguna heurística automática resulta fiable: hace falta una tabla de
desfase cotejada con el salterio oficial.

### 3. Huecos conocidos, menores

- `bcp2019/js/lectionary.js`: faltan los propios del Lunes, Martes y Miércoles
  Santos. La app hermana ya los tiene; esta imprime «[Primera lectura no
  especificada]» esos 111 días del rango.
- 10.400 días toman la Colecta del Domingo precedente sin anunciarlo. Las lecturas
  prestadas sí llevan rúbrica; la colecta no. Rotularla «(Colecta del tiempo)»
  sería falso, porque es la del domingo anterior: hace falta decidir la redacción.
- `js/intercessions.js` no tiene intención estacional para Pre-Cuaresma (629 días).
- Erratas en el latín de `canon.js`: `regnat` por *regnas* (l. 267); «Señor,
  escucha **nuestra** oración» frente a *orationem **meam*** (l. 160-161); el
  *Introibo* latino truncado respecto del español (l. 134); numeración de salmos
  mezclando Vulgata y hebrea (l. 216, 333, 353).
- `bcp2019`: 165 supresiones de fiestas fijas en domingo, sin traslado ni
  conmemoración. El BCP 2019 permite ambas cosas; es criterio litúrgico, no error.
- Código muerto inocuo: `takeProper()` en `app.js`, el alias `ordinaryFeria` en
  `propers.js`, `circumcision` y `getSundaysAfterPentecostLabel()` en `bcp2019`.

## Decisiones ya tomadas por el usuario

No volver a plantearlas salvo que él las reabra:

- **Gloria**: uso tradicional. Se omite desde Septuagésima (domingos de
  Pre-Cuaresma incluidos) y en el Domingo de Ramos.
- **Color del Domingo de Ramos**: se queda en rojo, sin cambiar.
- **Ciclo ferial I/II**: se retiró el anuncio de la interfaz, porque el
  leccionario ferial no está implementado y las ferias reutilizan las lecturas del
  Domingo precedente. `getWeekdayCycle` sigue en `calendar.js`, correcto pero sin
  anunciarse. Se designa por el año civil en que **termina** el año litúrgico:
  final impar es Ciclo I, final par es Ciclo II.
- **Propios faltantes**: cadena de respaldo por tiempo con rúbrica visible, nunca
  inventar el texto.

## Historial de auditorías

`VERIFICACION.md` recoge ocho auditorías entre abril y septiembre de 2026, con 38
bugs documentados. `AUDITORIA-2026-09-20.md` es la auditoría independiente que
encontró 24 hallazgos adicionales confirmados por ejecución, todos ya corregidos,
incluido el bug del ciclo ferial que las ocho auditorías previas habían dado por
bueno. Ese documento vale sobre todo como advertencia de método.

---

## Mensaje de commit sugerido para los 14 archivos pendientes

```
Auditoria y correccion de canon, librito, exportacion a Word y BCP 2019

Canon: Communicantes propio ausente en 552 dias (comites Christi, Bautismo del
Senor, Ascension, Vigilia de Pentecostes); Hanc Igitur bautismal en la Vigilia;
condicion de carrera real en setLanguage; misas votivas que arrastraban el
embolismo del dia; rubricas en latin y duplicadas en bilingue; Lavabo marcado
como oracion privada del Sacerdote.

Librito: rango del dia ausente en 13.106 dias; Gradual ausente en todos; Gloria
duplicado en 1662 y 1928; Viernes Santo anunciando como fallo de datos una
Secreta y un Ofertorio que esa Misa no tiene; Amen de la doxologia perdido;
Oracion de Oblacion de 1662 ausente; cabecera de intercesiones perdida.

Word: documentos sin numeracion de pagina (Header, Footer y PageNumber se
importaban sin usarse), sin niveles de encabezado, titulo de las notas de
omision perdido, pie aplastado en un renglon.

BCP 2019: 206 dias sin cobertura entre Pentecostes y Trinidad; clave rota
properFerianull_N con Pascua temprana; fiestas fijas aplastando la Semana Santa;
8 pericopas reducidas a un solo versiculo; todos los encabezados del librito
perdidos al exportar a Word.

Integracion: librito-pueblo.js consumia tres senales que app.js no enviaba;
carrera de idioma entre generaciones concurrentes; Gradual sin guardar en
currentMassState.

Simulacion final: 124.188 generaciones del Misal y 13.515 dias del BCP 2019,
sin excepciones ni divergencias.
```
