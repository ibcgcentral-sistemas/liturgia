# Auditoría del Ordinario de la Eucaristía y los Prefacios — BCP 2019 (bcp2019/)

Fecha: 2026-10-31. Solo lectura sobre el repositorio. Nada del repo fue editado.

Archivos auditados: `bcp2019/js/eucharist.js`, `bcp2019/js/propers.js` (`PREFACES`, `getPreface`), `bcp2019/js/app.js` (`buildLiturgyHTML`, l. 94-286) y `bcp2019/js/utils.js` (`shouldOmitGloria`, `GLORIA_OMITTED_RUBRIC`, l. 89-96).

Abreviaturas de fuente:
- **L####** = línea del libro oficial en español `LOC-10-10-23.md` (el markdown de markitdown).
- **EN L####** = línea de `BCP2019-en.md` (libro en inglés, solo como apoyo).
- `archivo:línea` = código del app.

---

## 0. Resumen ejecutivo

| Severidad | Cantidad |
|---|---|
| Alta | 2 |
| Media | 13 |
| Baja | 7 |
| **Total** | **22** |

Dos hallazgos de fondo.

1. **El texto fijo del Ordinario es muy fiel.** Comparé 29 bloques, unas 2.650 palabras del libro, palabra por palabra. 19 bloques salen con cero diferencias y la Oración de Consagración coincide en sus 505 palabras. Los únicos recortes de contenido real en el Ordinario son los puntos de intención/nombre de la Oración de los Fieles y la formulación de la Despedida con Aleluya. El resto son rúbricas resumidas, citas «(NVI)» que el app no imprime y cuatro erratas del libro que el app corrige.
2. **Los problemas están en los Prefacios y en la lógica estacional.** De los 31 prefacios del código, 27 son exactos. Dos están alterados, y uno de ellos es el prefacio por defecto, que el app imprime en 372 de 730 días. El mapeo día→prefacio difiere del libro en 77 de los 321 días (2026-2027) en que el libro designa uno. Además el app genera una Eucaristía completa (con Oración de Consagración) para el Viernes Santo y el Sábado Santo, días en que el libro dice expresamente que no se celebra.

La documentación del proyecto afirma que «el Ordinario y los 26 Prefacios» están «transcritos fielmente» (`VERIFICACION-BCP2019.md:19-21`, `eucharist.js:5`, `propers.js:5`). Eso es falso en tres puntos. Son 31 claves, no 26. Hay 2 con texto alterado. Faltan 3 textos del libro. Véase ORD-16.

---

## 1. Hallazgos

### ALTA

#### ORD-01 — Prefacio «En Cualquier Tiempo» mutilado, y es el prefacio por defecto (alta)
- **App:** `propers.js:132` (`common`): «Porque él es tu Palabra viva desde antes del tiempo y para todos los tiempos; por él creaste todas las cosas, y por él haces nuevas todas las cosas.»
- **Libro:** L3929-3931: «**Por Jesucristo nuestro Señor;** porque él es tu Palabra viva desde antes del tiempo y para todos los tiempos; por él creaste todas las cosas…» (EN L4015-4017: «Through Jesus Christ our Lord; for he is…»).
- **Diferencia:** el app omite «Por Jesucristo nuestro Señor;» (4 palabras). El pronombre «él» queda sin antecedente. Tras el Sursum corda («…Señor Todopoderoso, Creador del cielo y de la tierra.») se lee como si «él» fuera el Creador. Se pierde la mención de Cristo como Palabra eterna, que es el contenido doctrinal del prefacio.
- **Segunda omisión:** el libro da una alternativa (L3933-3934: «Porque tú eres la fuente de luz y vida; nos hiciste a tu imagen y nos llamaste a una nueva vida en Jesucristo nuestro Señor.») que el app no ofrece. Esa va en ORD-17.
- **Alcance:** `getPreface` devuelve este prefacio como respaldo final (`propers.js:195` y `:199`). En la simulación de 2026+2027 se imprime en **372 de 730 días**: 49 domingos, 303 ferias y 20 fiestas fijas.
- **Corrección:** anteponer «Por Jesucristo nuestro Señor; » y poner «porque» en minúscula, como en L3929. Ofrecer además la alternativa de L3933-3934.

#### ORD-02 — Eucaristía completa generada para Viernes Santo y Sábado Santo (alta)
- **App:** `calendar.js:285-286` emite `goodFriday` y `holySaturday`. `app.js:94-286` no tiene ningún condicional por clave: imprime Ordinario, Prefacio de Semana Santa y Oración de Consagración. Simulado: 2026-04-03/04 y 2027-03-26/27, con `shouldOmitGloria` = true y el prefacio `holyWeek`.
- **Libro:**
  - Viernes Santo, L15177-15178: «DISTRIBUCIÓN DE LA COMUNIÓN: El rito de la Santa Eucaristía no se celebra en este día.»
  - La comunión de ese día se da con elementos consagrados el Jueves Santo (L14903-14904, L14913).
  - Sábado Santo, L15247-15248: «No hay celebración de la Eucaristía en este día.»
- **Diferencia:** el app presenta como celebrable una Misa con consagración en dos días en que el libro la excluye. Hay una colecta del Viernes Santo y una del Sábado Santo (`propers.js:52-53`), pero el libro les da liturgias propias (Viernes Santo pp. 565-577, L14938-15245; Sábado Santo p. 578, L15247+).
- **Vigilia Pascual:** el libro prevé una Eucaristía en la Gran Vigilia (p. 582). Usa la Aclamación Pascual, el Gloria (L15578) y el Prefacio de Pascua (EN L17109 «Easter Eve… Preface of Easter»). El app no la modela. Quien pida el sábado ve Cuaresma/Semana Santa en vez de Pascua.
- **Corrección:** para `goodFriday` y `holySaturday`, no emitir la Eucaristía. Mostrar un aviso que remita a las liturgias de las pp. 565 y 578, o implementar esas liturgias. Si se modela la Vigilia, debe ir aparte, con Aclamación Pascual, Gloria, Prefacio de Pascua y Despedida con Aleluya.

---

### MEDIA

#### ORD-03 — Prefacio «El Día del Señor» alterado (media)
- **App:** `propers.js:131`: «**Porque** Jesucristo nuestro Señor, que el primer día de la semana venció…»
- **Libro:** L3926: «**Por** Jesucristo nuestro Señor, que el primer día de la semana venció a la muerte y al sepulcro…» (EN L4011: «Through Jesus Christ our Lord, who on the first day…»).
- **Diferencia:** «Por» pasó a «Porque». La oración queda sin verbo principal y cambia de «por medio de Cristo» a una causal.
- **Corrección:** «Por Jesucristo nuestro Señor, que…».
- **Nota:** hoy este texto solo se imprime el 1 de enero, por un mapeo equivocado (ORD-06). Al corregir ORD-04 se imprimiría en todos los domingos ordinarios, así que el texto debe quedar bien antes.

#### ORD-04 — Domingos después de Pentecostés: el app usa el prefacio común, no el del Día del Señor (media)
- **App:** `propers.js:195` (`key.startsWith('proper')` → `PREFACES.common`). El prefacio `lordsDay` solo se usa en `'01-01'` (`propers.js:198`).
- **Libro:** EN L17261-17269 (frase clave en L17267-17268): «There is no seasonal preface for the numbered propers. **Prefaces of the Lord’s Day are used on Sundays.** No preface is required on the weekdays of this season, except for Holy Days or commemorations.»
- **Resultado simulado (2026+2027):** 49 de 104 domingos (los `properN`) reciben «En Cualquier Tiempo». Ningún domingo recibe el prefacio del Día del Señor.
- **Ambigüedad que declaro:** el libro dice «Prefaces» en plural. El libro tiene «El Día del Señor» (L3925) y «En Cualquier Tiempo» (L3928) bajo la misma serie. Una lectura laxa admitiría ambos. Aun así el app no ofrece nunca el que el libro nombra explícitamente para domingos.
- **Corrección:** para `properN` en domingo (N≠29), usar `lordsDay`. En las ferias de esta temporada el libro no exige prefacio.

#### ORD-05 — Quinto Domingo de Cuaresma y Séptimo de Pascua con prefacio equivocado (media)
- **Cuaresma V:** `propers.js:178` manda `lent5` al Prefacio de Semana Santa. El libro lo asigna al de Cuaresma (EN L17024-17033, «the fifth sunday in lent… Preface of Lent»). La Semana Santa empieza el Domingo de Ramos (EN L17036-17045). Días: 2026-03-22 y 2027-03-14.
- **Pascua VII:** `propers.js:188` (`startsWith('easter')`) le da el Prefacio de Pascua. El libro lo asigna a la Ascensión (EN L17232-17239, «the sunday after the ascension… Preface of the Ascension»). Días: 2026-05-17 y 2027-05-09.
- **Corrección:** quitar `lent5` de la línea 178 (caerá en `startsWith('lent')`) y mapear `easter7` a `ascension` antes de la línea 188.

#### ORD-06 — Fiestas fijas: 16 de 30 con prefacio distinto del libro (media)
Mapeo del libro (EN, sección «Holy days», L17531-17830) frente a `propers.js:186, 196-199`:

| Fecha | App | Libro | EN |
|---|---|---|---|
| 01-01 Santo Nombre | Día del Señor | Presentación/Anunciación/Transfiguración | L16853, L17589 |
| 01-18 Confesión de S. Pedro | Cualquier Tiempo | Apóstoles | L17600 |
| 01-25 Conversión de S. Pablo | Cualquier Tiempo | Apóstoles | L17609 |
| 03-19 San José | Cualquier Tiempo | Presentación/Anunc./Transfig. | L17637 |
| 04-25 San Marcos | Apóstoles | Todos los Santos | L17658 |
| 05-31 Visitación | Cualquier Tiempo | Presentación/Anunc./Transfig. | L17676 |
| 06-24 Natividad S. Juan Bautista | Cualquier Tiempo | Adviento | L17699 |
| 07-22 Sta. María Magdalena | Cualquier Tiempo | Apóstoles | L17719 |
| 08-15 Sta. María Virgen | Cualquier Tiempo | Navidad | L17749 |
| 09-14 Exaltación de la Cruz | Cualquier Tiempo | Semana Santa | L17767 |
| 09-29 S. Miguel y los Ángeles | Cualquier Tiempo | Trinidad | L17788 |
| 10-18 San Lucas | Apóstoles | Todos los Santos | L17797 |
| 10-23 Santiago de Jerusalén | Cualquier Tiempo | Apóstoles | L17808 |
| 12-26 San Esteban | Cualquier Tiempo | Navidad | L17557 |
| 12-27 San Juan | Cualquier Tiempo | Navidad | L17568 |
| 12-28 Santos Inocentes | Cualquier Tiempo | Navidad | L17579 |

- Coinciden las otras 14: 02-02, 02-24, 03-25, 05-01, 06-11, 06-29, 07-25, 08-06, 08-24, 09-21, 10-28, 11-01, 11-30, 12-21.
- **Días afectados en 2026+2027:** 24 (las 8 fechas del 01-01, 03-19, 06-24, 07-22, 09-14, 09-29, 10-23 y 12-28 caen 2 veces; las otras 8 una vez).
- **Matiz:** San Marcos y San Lucas no son apóstoles, y el Prefacio de Apóstoles dice «envió a sus apóstoles» (L4007-4009). Es el único caso donde el prefacio erróneo contradice la identidad del santo.
- **Corrección:** ampliar la tabla de fiestas con la columna del libro (arriba).

#### ORD-07 — Aclamación de Cuaresma durante toda la Semana Santa (media)
- **App:** `app.js:101` (`isLent` incluye `holyWeek`) y `app.js:168` imprimen «Bendigamos al Señor que perdona todos nuestros pecados» del Domingo de Ramos al Sábado Santo. Son 7 días por año (14 en 2026+2027).
- **Libro, saludos de temporada (L3777-3783):**
  - «DESDE EL MIÉRCOLES DE CENIZA A LA VÍSPERA DEL DOMINGO DE RAMOS» → «Bendice al Señor que perdona…».
  - «**PARA LA SEMANA SANTA** → Celebrante: Bendito sea nuestro Dios. / Pueblo: Ahora y por siempre. Amén.»
  - Además, la liturgia del Jueves Santo abre con ese saludo (L14845-14846).
- **Diferencia:** el app trata la Semana Santa como Cuaresma para la aclamación. El libro le da saludo propio. La rúbrica del Texto Estándar (L2685 «En el tiempo de Cuaresma») queda acotada por L3777.
- **Corrección:** `holyWeek` → «Bendito sea nuestro Dios. / Ahora y por siempre. Amén.». Mantener la Fracción sin Aleluya (eso sí es correcto en Cuaresma y Semana Santa).

#### ORD-08 — Aclamación de Pascua en el Día de Pentecostés (media)
- **App:** `app.js:102` (`isEaster = season==='easter' || key==='pentecost'`) y `app.js:168` usan la aclamación pascual el día de Pentecostés (2026-05-24 y 2027-05-16). El rótulo impreso sigue diciendo «Desde el día de Resurrección hasta la Víspera de Pentecostés» (`eucharist.js:55`).
- **Libro:** L2688 «hasta la Víspera de Pentecostés». L3784-3786 lo repite. Para el Día de Pentecostés (L3787-3798) hay saludo propio: «Derramaré mi Espíritu sobre todo el género humano…».
- **Nota:** `isEaster` sí es correcto para la Despedida con Aleluya, que llega «hasta el Día de Pentecostés» inclusive (L3167). Una sola variable sirve a dos reglas distintas.
- **Corrección:** separar `isEasterAcclamation` (Pascua → víspera de Pentecostés) de `isEasterDismissal` (Vigilia → Pentecostés inclusive). El Día de Pentecostés debe usar la aclamación estándar o el saludo de Joel.

#### ORD-09 — Kyrie: voces repartidas que el libro no asigna (media)
- **App:** `eucharist.js:74-78` reparte «Señor, ten piedad» (`CEL`), «Cristo, ten piedad» (`PUEBLO`), «Señor, ten piedad» (`CEL`).
- **Libro:** L2709 «**El celebrante y el pueblo rezan**» (EN L2784 «The Celebrant and People pray»). Las tres líneas se rezan juntas. No hay reparto celebrante/pueblo.
- **Corrección:** mostrar las tres líneas como `TODOS`, con la rúbrica «El celebrante y el pueblo rezan».

#### ORD-10 — La invitación al Padrenuestro se imprime como rúbrica (media)
- **App:** `eucharist.js:206` la tipifica `R` (el render la envuelve en paréntesis): «(Y ahora, orando como Nuestro Salvador Jesucristo nos enseñó, nos atrevemos a decir:)».
- **Libro:** L3046-3047 «**Luego el Celebrante dice** / Y ahora, orando como…». Es texto pronunciado. La rúbrica es «Luego el Celebrante dice» (EN L3114-3115).
- **Efecto:** el texto aparece en estilo de rúbrica (no se lee en voz alta), y la rúbrica verdadera («El celebrante y el pueblo rezan juntos», L3048) se pierde.
- **Corrección:** `CEL` para la invitación. La rúbrica de L3048 como `R`.

#### ORD-11 — Fórmula de anuncio del Evangelio alterada (media)
- **App:** `app.js:109`: «Lectura del Santo Evangelio según San X».
- **Libro:** L2776-2777: «Todos de pie, el diácono o sacerdote lee el evangelio, primero diciendo: **El Santo Evangelio de nuestro Señor Jesucristo según** _____. / Pueblo ¡Gloria a ti, Cristo Señor!»
- **Diferencia:** la fórmula fija que da pie a la aclamación del pueblo cambió y perdió «de nuestro Señor Jesucristo».
- **Coincide:** la respuesta «Gloria a ti, Cristo Señor» y el cierre «El Evangelio del Señor. / Te alabamos, Cristo Señor» (L2778-2781).
- **Corrección:** «El Santo Evangelio de nuestro Señor Jesucristo según San X».

#### ORD-12 — Oración de los Fieles: faltan los puntos de intención y de nombre (media)
`eucharist.js:104-132` omite, sin rúbrica sustitutiva, todos los puntos donde el libro prevé nombrar personas:

| Libro | Texto omitido |
|---|---|
| L2840-2841 | «especialmente a N., nuestro Presidente / Soberano / Primer Ministro» |
| L2849 | «y especialmente a tus siervos N., nuestro Arzobispo / Obispo / Sacerdote / Diácono, etc.» |
| L2871 | «[especialmente _____]» (los afligidos) |
| L2876 | «[especialmente _____,]» (los difuntos) |
| L2877 | «[N., y]» (los santos) |

- **Efecto:** el celebrante no ve dónde nombrar al obispo, a la autoridad civil, a los enfermos ni a los difuntos. La oración por el obispo queda genérica.
- **Corrección:** conservar los corchetes del libro como texto editable, o añadir una rúbrica «aquí se pueden nombrar…».
- **Coincide:** el resto del texto (el app corrige además «ante de Ti» → «ante Ti», errata del libro en L2875).

#### ORD-13 — Despedida con Aleluya: formulación distinta del libro, y Misal y Librito discrepan (media)
- **App (`eucharist.js:262-265`):** «Salgamos en el Nombre de Cristo, **aleluya, aleluya.**» / «Demos gracias a Dios, **aleluya, aleluya.**»
- **Librito (`librito-pueblo.js:288`):** «Salgamos en el Nombre de Cristo. Aleluya, aleluya.» / «Demos gracias a Dios. Aleluya, aleluya.» Misal y Librito no coinciden entre sí.
- **Libro:**
  - L3167-3170: «“Aleluya, aleluya” se agrega a cualquiera de las despedidas… La gente responde: **Demos gracias a Dios. Aleluya, Aleluya.**»
  - L3692-3694: «se suele añadir “Aleluya, aleluya” **al comienzo del verso del diácono** cuando se dice hablado, o al final cuando se canta.»
- **Diferencia:** el app coloca el «aleluya» en medio de la respuesta («Demos gracias a Dios, aleluya, aleluya»), con coma. El libro lo pone como adición tras el punto.
- **Corrección:** Cel.: «Aleluya, aleluya. Salgamos en el Nombre de Cristo.» Pueblo: «Demos gracias a Dios. Aleluya, aleluya.» Unificar con el Librito.

#### ORD-14 — Reglas del Gloria que el libro no establece (media)
- **App:** `utils.js:89-96` omite el Gloria en Adviento, Cuaresma y Semana Santa. Imprime la rúbrica «El Gloria in excelsis se omite en Adviento y Cuaresma» (`utils.js:96`). Lo conserva el Jueves Santo y en fiestas fijas.
- **Libro (L2730-2732):** «Se puede cantar o decir el Gloria… **Es apropiado omitir** el canto de alabanza durante los tiempos de penitencia y los días señalados para el ayuno.»
- **Diferencias:**
  1. **Adviento.** El libro no llama penitencial al Adviento en ningún lugar. Busqué «Adviento» y «penitencial» en el libro español y en el inglés. Las menciones penitenciales son la Cuaresma (L3777-3778, EN L3865) y las «ocasiones penitenciales». El app presenta como regla del libro lo que es una convención heredada del Misal. Impacto en 2026+2027: **49 días**, 8 de ellos domingos.
  2. **Verbo.** El libro dice «es apropiado omitir» (recomendación sobre un canto opcional). El app dice «se omite» (imperativo).
  3. **Jueves Santo.** `utils.js:91` fuerza el Gloria el Jueves Santo. El orden del Jueves Santo del libro (L14843-14912) no incluye Gloria. La Vigilia Pascual sí (L15578), pero el app no la modela (ORD-02).
- **Pregunta abierta:** la regla puede ser una decisión del usuario. CLAUDE.md registra la decisión «Gloria: uso tradicional» solo para el Misal. No sé si se extendió a esta app.
- **Corrección:** si se mantiene, rotular como convención («En Cuaresma y otras ocasiones penitenciales es apropiado omitirlo; según el uso tradicional también en Adviento») y dejar de atribuir al libro la regla de Adviento y la excepción del Jueves Santo.

#### ORD-15 — Los ritos propios de Miércoles de Ceniza, Domingo de Ramos y Jueves Santo no están modelados (media)
El app imprime el Texto Estándar completo para esos días. El libro tiene un orden distinto, con divergencias verificables:

| Día | Libro | App |
|---|---|---|
| Miércoles de Ceniza (p. 543, L14473-14697) | Saludo propio, Invitación a la Cuaresma, lecturas, sermón, imposición de ceniza, confesión y letanía de penitencia, absolución, Paz, y luego el Ofertorio con el Prefacio de Cuaresma (L14686) | Aclamación estándar, Colecta por pureza, Resumen de la Ley, Kyrie… sin ceniza ni letanía |
| Domingo de Ramos (L14795-14825) | La Eucaristía **comienza con el Saludo y la Colecta del Día**; «**Se omiten las respuestas habituales antes y después del Evangelio**» de la Pasión (L14812); el Credo y las Oraciones del Pueblo «pueden omitirse» (L14823-14824) | `app.js:113-116` imprime siempre «Gloria a ti, Cristo Señor» y «Te alabamos, Cristo Señor»; imprime Credo y Oración de los Fieles |
| Jueves Santo (L14843-14912) | Saludo «Bendito sea nuestro Dios», Colecta, lecturas, sermón, Lavatorio; «**Se omiten la bendición final y la despedida**» (L14909) | `app.js:274-278` imprime Bendición y Despedida |

- **Corrección:** como mínimo, anunciar en pantalla que esos tres días tienen rito propio en el libro (pp. 543, 554, 560) y suprimir las respuestas del Evangelio, la Bendición y la Despedida donde el libro las omite. La implementación completa es otra tarea.
- **No verifiqué** el texto de esos ritos palabra por palabra.

---

### BAJA

#### ORD-16 — La documentación sobre fidelidad y líneas citadas es inexacta (baja)
- **«26 Prefacios»** (`VERIFICACION-BCP2019.md:19`). El código tiene **31** claves en `PREFACES`. El libro tiene 33 encabezados de prefacio (34 textos, contando la alternativa de «En Cualquier Tiempo»). De esos, 27 coinciden exactamente, 2 están alterados (ORD-01, ORD-03) y 3 textos del libro faltan (ORD-17).
- **«transcritos fielmente»** (`eucharist.js:5`, `propers.js:5, :128`). Es cierto para el Ordinario, salvo ORD-12. No lo es para 2 prefacios. Los rangos de línea citados son aproximados. El Ordinario real ocupa L2673-3171. Los Prefacios, L3924-4086.
- **Corrección:** actualizar los comentarios con los conteos reales y con los defectos conocidos.

#### ORD-17 — Prefacios del libro ausentes en `PREFACES` (baja)
- Alternativa de «En Cualquier Tiempo» (L3933-3934).
- «Día de Canadá o Día de la Independencia» (L4040-4043): «Porque nos hiciste a tu imagen, para que te sirvamos en la tierra con libertad, justicia y paz…».
- «Día de Conmemoración o Día de los Caídos» (L4047-4049): «Por el sacrificio de tu Hijo en la Cruz, todos los que se vuelvan a Él en la tribulación de la guerra…».
- Ninguno es alcanzable por el calendario del app (que no tiene días nacionales), así que el efecto práctico es nulo hoy. Es una omisión de opciones del libro.

#### ORD-18 — Opciones del Texto Estándar que el app no ofrece (baja)
Son opciones del libro, no obligaciones. Lista con fuente:
- Decálogo en vez del Resumen de la Ley (L2702; el texto está en p. 100).
- **Trisagio:** el dato existe (`eucharist.js:79-81`, exportado en `:291`) pero `app.js:176-177` solo imprime el Kyrie. Es dato muerto.
- Formas alternas del Kyrie (L2713-2720).
- **Exhortación** (L3806-3843). El libro dice que tradicionalmente se lee el primer domingo de Adviento, el primero de Cuaresma y el de la Trinidad (L3651-3652). El app no la ofrece nunca.
- Moniciones del Ofertorio: 20 versículos (L3847-3920).
- **Saludos de temporada (L3759-3802).** El app usa solo 3 de las 9 formas: estándar, Cuaresma y Pascua. No usa Adviento, Navidad/Presentación, Epifanía, Semana Santa (ORD-07), Pentecostés (ORD-08) ni Todos los Santos.
- Segunda fórmula de la Fracción (L3070-3072) y segunda invitación a comulgar (L3107-3109).
- Tres despedidas alternas (L3159-3166).
- Aclamación memorial «Por lo tanto, proclamamos el misterio de nuestra fe» (L3659-3666).
- Orden penitencial y orden de 1662 (L3623-3632, L3706-3733), con la nota ‡ de la consagración (L3015-3016).
- Credo de Atanasio en Trinidad (L3633).
- Confesión alterna «Confesemos humildemente…» (L2897-2898).
- «Y también contigo» (L3621-3622).

#### ORD-19 — Prefacio «Común para Cualquier Conmemoración» sin el marcador de nombre (baja)
`propers.js:161`: «Por la gracia y la virtud manifestadas en tus santos…». Libro L4085: «manifestadas en **[N. y todos]** tus santos». Se pierde el espacio para nombrar al santo conmemorado.

#### ORD-20 — Rúbricas resumidas o alteradas (baja)
- **Sermón** (`app.js:205`): «El Celebrante predica. Sigue un momento de silencio.» El libro solo dice «EL SERMÓN» (L2782; EN L3799). El silencio tras las lecturas es opcional y se menciona en otro lugar (L2774). «El Celebrante predica» restringe al predicador.
- **Credo** (`eucharist.js:98`): «Los domingos y otros días festivos». El libro (L2784): «Los domingos, otros días festivos importantes y otras horas señaladas». El Credo se imprime en todos los días, incluso en ferias, con una rúbrica que dice «domingos y festivos». Falta la nota del filioque (L2822-2823).
- **Consagración** (`eucharist.js:194`): omite «y sobre cualquier otro recipiente que contenga el vino» (L3004-3005) y el asterisco que marca dónde se parte el pan. El libro dice «debe sostenerlo»; el app lo vuelve descriptivo.
- **Fracción** (`eucharist.js:213-214`): imprime «[Aleluya.]» entre corchetes en todos los días fuera de Cuaresma. En Pascua el Aleluya no puede omitirse (L3076), de modo que los corchetes inducen a error.
- **Administración** (`eucharist.js:240-241`): imprime completas las fórmulas que el libro pone entre corchetes (L3112-3117). Es aceptable, pero el libro marca la forma breve como opción.
- **Ofertorio** (`eucharist.js:163`): el libro dice «Se puede decir lo siguiente» (L2954). El app presenta «Tuyos son, Señor…» como el texto fijo.
- **Rúbricas sin equivalente** en varios bloques, omitidas por resumen: Salutación sin «Pueblo: Amén» propio tras la colecta, «Se puede cantar un himno» en entrada, ofertorio, Agnus y bendición.
- **Citas (NVI):** el app no imprime «(NVI)» tras Mt 11:28, Jn 3:16, 1 Tim 1:15, 1 Jn 2:1-2 ni 1 Cr 29:11,14.

#### ORD-21 — Erratas del libro que el app corrige en silencio (baja, informativo)
Diferencias con el libro que son mejoras. El libro (markdown) tiene estas erratas:
- «bajo del cielo» → app «**bajó** del cielo» (Credo, L2803).
- «Tu pides» → app «**Tú** pides» (Prefacio de Cuaresma, L3956).
- «ante de Ti» → app «ante Ti» (L2875).
- «el mismo señor» → app «Señor» (Humilde Acceso, L3083).
Podrían ser también defectos de conversión del markdown, no del libro impreso (véase «No pude verificar»).

#### ORD-22 — Código muerto o inconsistente (baja)
- `getPreface(key, season)` ignora el segundo parámetro (`propers.js:177`).
- `propers.js:180`: la clave `'circumcision'` nunca la emite el calendario (usa `'01-01'`).
- `propers.js:181`: `key === 'epiphany' || key === 'epiphany1' || startsWith('epiphany')` es redundante.
- `eucharist.js:79-81` y `:291`: el Trisagio se define y no se usa (ORD-18).
- Librito (`librito-pueblo.js:132-134, 244, 288`) reescribe a mano la Aclamación, la Fracción y la Despedida en vez de derivarlas de los `*_DATA`. El comentario de `eucharist.js:267-273` promete lo contrario. Ya divergen (ORD-13).

---

## 2. Orden y estructura

El orden de `buildLiturgyHTML` (`app.js:164-278`) coincide con el del Texto Estándar (L2680-3157).

| # | Libro | App | ¿Coincide? |
|---|---|---|---|
| 1 | Aclamación (L2681) | `app.js:167-168` | sí |
| 2 | Colecta por pureza (L2694) | `:170-171` | sí |
| 3 | Resumen de la Ley o Decálogo (L2701) | `:173-174` (solo el Resumen) | sí, sin Decálogo |
| 4 | Kyrie o Trisagio (L2708) | `:176-177` (solo Kyrie) | sí, sin Trisagio |
| 5 | Gloria (L2730) | `:179-182` | sí; reglas en ORD-14 |
| 6 | Colecta del día (L2756) | `:186-190` | sí |
| 7 | Lecturas, Evangelio (L2766) | `:193-202` | sí; fórmula en ORD-11 |
| 8 | Sermón (L2782) | `:204-206` | sí |
| 9 | Credo (L2783) | `:208-211` | sí |
| 10 | Oración de los Fieles (L2827) | `:213-216` | sí |
| 11 | Exhortación opcional (L2890) | no | falta, opcional |
| 12 | **Confesión y Absolución** (L2891) | `:218-223` | **sí: después de la Oración de los Fieles, como el libro** |
| 13 | Palabras reconfortantes (L2926) | `:221-222` | sí |
| 14 | **La Paz** (L2945) | `:225-228` | **sí: tras las Palabras reconfortantes y antes del Ofertorio, como el libro** |
| 15 | Ofertorio (L2949) | `:231-234` | sí |
| 16 | Sursum corda, Prefacio, Sanctus (L2964-2985) | `:236-243` | sí |
| 17 | Oración de Consagración (L2986) | `:245-248` | sí |
| 18 | Padrenuestro (L3045) | `:250-253` | sí; ORD-10 |
| 19 | Fracción, Humilde Acceso, Agnus Dei (L3064-3098) | `:255-262` | sí, mismo orden |
| 20 | Administración (L3099) | `:264-267` | sí |
| 21 | Poscomunión (L3120) | `:269-272` | sí |
| 22 | Bendición y Despedida (L3144-3170) | `:274-278` | sí |

- **Obligatorio omitido:** no encontré ninguna pieza obligatoria del Texto Estándar omitida, salvo los puntos de nombre de la Oración de los Fieles (ORD-12), el reparto del Kyrie (ORD-09) y la fórmula del Evangelio (ORD-11).
- **Fuera de las reglas del libro:** ORD-02 (Eucaristía en días sin Eucaristía) y ORD-15 (ritos propios).
- **Opciones omitidas:** ORD-18.

---

## 3. Reglas estacionales — resumen con cita

| Regla | Libro | App | Estado |
|---|---|---|---|
| Aclamación de Cuaresma | L2685-2687; hasta la víspera del Domingo de Ramos (L3777) | `app.js:168` | **mal en Semana Santa (ORD-07)** |
| Aclamación de Semana Santa | L3781-3783 | no existe | falta (ORD-07) |
| Aclamación de Pascua | L2688-2690; «hasta la Víspera de Pentecostés» | `app.js:102, 168` | **mal el Día de Pentecostés (ORD-08)** |
| Saludo de Pentecostés | L3787-3798 | no existe | falta (opcional) |
| Gloria | L2730-2732 | `utils.js:89-96` | **Adviento y Jueves Santo sin base (ORD-14)** |
| Fracción de Cuaresma sin Aleluya | L3076 | `app.js:257` | correcto |
| Fracción de Pascua con Aleluya obligatorio | L3076 | siempre `[Aleluya.]` | corchetes engañosos (ORD-20) |
| Despedida con Aleluya | L3167-3170, L3692-3694 | `app.js:277` | rango correcto; formulación distinta (ORD-13) |
| Despedida sin Aleluya en Cuaresma | L3168 | `isEaster` no se activa | correcto |
| Prefacios por día | EN L16770-18030 | `propers.js:177-200` | **77 días mal (ORD-04/05/06)** |

---

## 4. Lo que SÍ coincide

### 4.1 Método
Con el arnés `harness.js` cargué `BCPEucharist` y `BCPPropers.PREFACES`. Scripts (en la carpeta de salida, `audit\work\`):
- `cmp.js`: 29 comparaciones del Ordinario.
- `cmp2.js`: segunda pasada que distingue ortografía, mayúsculas y puntuación.
- `pref2.js`: 31 prefacios.
- `sim.js` y `sim2.js`: simulación 2026+2027.

Procedimiento:
1. Del libro tomé rangos de línea explícitos (indicados en la columna «Libro») y descarté los números de página. Quité las etiquetas de rol («Celebrante», «Pueblo», «Lector», «Diácono»).
2. Del app quité las etiquetas `lit-label` y separé las rúbricas (`lit-rubric`) del texto. Quité el HTML.
3. **Pasada 1:** normalicé a minúsculas, sin comillas ni puntuación ni corchetes ni †‡*, **conservando las tildes**. Diferencia palabra por palabra con LCS. Las diferencias que desaparecen al quitar tildes se clasifican como ortografía.
4. **Pasada 2:** comparé tokens conservando mayúsculas y puntuación, para ver las diferencias tipográficas.
5. Las rúbricas las leí a mano contra el libro, porque el app las resume.

### 4.2 Resultados del Ordinario (pasada 1)

| Bloque | Libro (líneas) | Palabras libro/app | Dif. de contenido |
|---|---|---|---|
| Aclamación | L2683-2684 | 18/18 | 0 |
| Aclamación Cuaresma | L2686-2687 | 13/13 | 0 |
| Aclamación Pascua | L2689-2690 | 10/10 | 0 |
| Colecta por pureza | L2696-2700 | 53/53 | 0 |
| Resumen de la Ley | L2703-2707 | 62/62 | 0 de contenido (8 palabras = el título y la cita «Mateo 22:37-40», que el app pone en otro sitio) |
| Kyrie | L2710-2712 | 15/15 | 0 (roles: ORD-09) |
| Trisagio | L2723-2726 | 11/11 | 0 |
| Gloria | L2733-2755 | 108/108 | 0 |
| Salutación | L2758-2760 | 10/10 | 0 |
| Credo | L2791-2820 | 220/220 | 0 de contenido (1 tilde: «bajó») |
| Oración de los Fieles | L2830-2889 | 477/425 | 52, todos puntos de nombre y rúbricas (ORD-12) |
| Confesión y Absolución | L2893-2925 | 232/222 | 10 palabras, todas de la rúbrica «El obispo o sacerdote se pone de pie y dice» (el app la tiene como `R`) |
| Palabras reconfortantes | L2928-2944 | 154/150 | 0 de contenido (4 = «NVI») |
| Paz | L2946-2947 | 12/12 | 0 |
| Ofertorio | L2955-2960 | 63/57 | 0 de contenido (6 = cita y «NVI») |
| Sursum corda | L2966-2974 | 58/55 | 0 (3 = rúbrica «El Celebrante continúa») |
| Cierre del Sursum | L2976-2978 | 34/34 | 0 |
| Sanctus | L2981-2985 | 36/36 | 0 |
| **Consagración** | L2991-3041 | **505/505** | **0** |
| Padrenuestro | L3049-3063 | 85/72 | 0 de contenido (13 = la invitación, que el app pone en rúbrica: ORD-10) |
| Fracción | L3067-3068 | 12/12 | 0 |
| Fracción Cuaresma | L3067-3068 | 12/10 | 2 = «[Aleluya.]» omitido a propósito en Cuaresma |
| Humilde Acceso | L3079-3090 | 103/103 | 0 |
| Agnus Dei | L3093-3098 | 38/38 | 0 |
| Administración | L3104-3117 | 113/113 | 0 |
| Poscomunión | L3122-3143 | 129/129 | 0 |
| Bendición | L3146-3149 | 49/49 | 0 |
| Despedida | L3156-3157 | 10/10 | 0 |
| Despedida con Aleluya | L3156-3170 | 16/14 | 6 (ORD-13) |

- 29 comparaciones. 19 con cero diferencias de ningún tipo. 10 con diferencias, todas explicadas arriba.
- Total del libro comparado: unas 2.650 palabras.
- Segunda pasada (22 bloques, mayúsculas y puntuación): 16 grupos de diferencias. Todos son tipográficos o erratas del libro:
  - mayúsculas tras salto de línea del libro («Ten/ten», «Danos/danos»);
  - corchetes del libro en la Administración;
  - «bajo/bajó», «señor/Señor»;
  - un espacio en «Él ,»;
  - un punto tras «Amén».

### 4.3 Resultados de los prefacios

| Resultado | Claves |
|---|---|
| Idénticos (0 diferencias con tildes) | advent, christmas, epiphany, transfiguration, holyWeek, maundyThursday, easter, ascension, pentecost, trinity, allSaints, christTheKing, apostles, dedication, baptism, marriage, burial, penitential, thanksgiving, martyr, missionary, pastor, teacher, religious, ecumenist, socialReformer, churchReformer **(27)** |
| Solo ortografía del libro corregida | lent («Tu pides» → «Tú pides») |
| Alterados | lordsDay (ORD-03), common (ORD-01) |
| Sin marcador de nombre | anyCommemoration (ORD-19) |

Los 31 textos de `PREFACES` tienen contraparte en el libro. Los encabezados del app corresponden a los del libro (por ejemplo «Presentación, Anunciación y Transfiguración» para `transfiguration`).

### 4.4 Mapeo día→prefacio, simulación

- **Método:** `BCPCalendar.getDay` a las 12:00 locales para cada día de 2026 y 2027 (730 días). Comparé `BCPPropers.getPreface(key, season)` con una tabla que construí desde las asignaciones del libro en EN L16770-18030. Los días sin designación del libro (ferias de Adviento, Epifanía, Pentecostés y Propios; Viernes y Sábado Santo) no se cuentan como error.
- **Resultados:**

| Concepto | Días |
|---|---|
| Con prefacio designado por el libro | 321 |
| de ellos, el app coincide | 244 (76,0 %) |
| de ellos, el app difiere | **77** (24,0 %) |
| Sin designación del libro | 409 |

- **Desglose de los 77:** 49 por ORD-04 (domingos `properN`), 2 por `lent5` y 2 por `easter7` (ORD-05) y 24 por fiestas fijas (ORD-06). Suma: 49 + 2 + 2 + 24 = 77. Fiestas fijas, 24 días: 01-01 ×2, 03-19 ×2, 06-24 ×2, 07-22 ×2, 09-14 ×2, 09-29 ×2, 10-23 ×2, 12-28 ×2, y una vez cada una 04-25, 08-15, 12-26, 01-18, 01-25, 05-31, 10-18, 12-27.
- **Domingos:** 104 en total. 53 con prefacio distinto del libro (49 + 2 + 2).
- **Respaldo genérico:** el app imprime «En Cualquier Tiempo» en 372 de 730 días (51 %).
- **Coinciden** (entre otros): Adviento I-IV, Navidad y su octava, Epifanía, Cuaresma excepto el V, Semana Santa, Jueves Santo, Pascua II-VI, Ascensión, Pentecostés, Trinidad, Cristo Rey, Todos los Santos, Presentación, Anunciación, Transfiguración, y los apóstoles Matías, Felipe y Santiago, Bernabé, Pedro y Pablo, Santiago, Bartolomé, Mateo, Simón y Judas, Andrés, Tomás. En Epifanía V-VIII y en el último domingo de Epifanía el libro admite también el del Día del Señor o el de la Transfiguración (EN L16928-16974), y el app usa el de Epifanía, que es válido.

---

## 5. No pude verificar

1. **El mapeo día→prefacio no está en el libro en español.** Las asignaciones («Preface of Advent» tras cada colecta) están en la sección «Colectas del Año Cristiano» (pp. 598-642), que no está en el markdown español (llega a la p. 596). Usé el inglés (EN L16770-18030) como fuente. No puedo citar las palabras españolas de esas asignaciones. Las rúbricas de los ritos propios (Ceniza, Ramos, Jueves Santo) sí están en español y las cito.
2. **Posibles erratas de conversión.** Todo el contraste se hizo contra un markdown generado por markitdown, no contra la página impresa. Las erratas de ORD-21 («bajo», «Tu pides», «ante de Ti», «señor») pueden ser del libro o de la conversión. Los símbolos †‡* no siempre aparecen donde están en la página (por ejemplo, el asterisco de la fracción del pan en L3007).
3. **Fidelidad de la traducción.** No audité si la versión española del libro traduce bien el inglés. El libro español es la autoridad pedida.
4. **Texto de los ritos propios.** No comparé palabra por palabra el Miércoles de Ceniza, el Domingo de Ramos, el Jueves Santo, el Viernes Santo ni la Vigilia Pascual. Solo contrasté las rúbricas citadas en ORD-02, ORD-14 y ORD-15.
5. **Intención del Gloria de Adviento.** Desconozco si la regla de `utils.js:81-93` («misma regla que el Misal») es una decisión expresa del usuario para esta app (ORD-14).
6. **Presentación en pantalla.** Analicé cadenas de texto y HTML, no el renderizado con CSS. No sé si los paréntesis de las rúbricas (`R`) se ven en cursiva o rojo.
7. **Librito, manual y exportación a Word.** Solo cité `librito-pueblo.js:132-134, 244, 288` por su divergencia con `eucharist.js`. No auditoré los demás módulos.
8. **Lectionary, colectas, calendario.** Fuera de mi parte. Usé el calendario solo como entrada para la simulación de prefacios.
