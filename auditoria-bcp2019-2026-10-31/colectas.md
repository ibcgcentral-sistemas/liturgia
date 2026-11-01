# Auditoría de COLECTAS — generador BCP 2019 (`bcp2019/`)

Fecha de la auditoría: 2026-10-31. Solo lectura sobre el repositorio. No se propone ninguna redacción en español: donde el app no da la colecta oficial, se indica cuál correspondería (ubicación y primera frase en inglés).

Fuentes usadas: `bcp2019/js/propers.js` (COLLECTS, `getCollect`), `bcp2019/js/app.js` (`getPreviousSunday`, `resolveCollectKey`), `bcp2019/js/calendar.js` (claves de día), libro oficial en inglés (`BCP2019-en.md`, colectas del año en las líneas 16766-18018, pp. 598-640) y español oficial `LOC-10-10-23.md` (solo hasta p. 596). Las citas "l.NNNNN" son números de línea del markdown inglés; "LOC NNNNN" son líneas del markdown español. La página se deduce del pie "NNN collects & occasional prayers" que cierra cada página en la extracción (el texto anterior al pie pertenece a esa página).

## 0. Veredicto

1. **El app no da la colecta oficial en la mayoría de los casos.** De las 95 claves de `COLLECTS`: 35 coinciden con la colecta oficial (37 %), 14 son variantes (15 %) y 46 son otra colecta (48 %). Ninguna clave carece de colecta oficial en el libro (SIN FUENTE OFICIAL = 0), y no hay casos AMBIGUOS por extracción.
2. **Los Propios son casi todos incorrectos.** De los 27 Propios (3-29) solo 4 coinciden (13, 16, 17, 29). 9 imprimen la colecta oficial de OTRO Propio (p. ej. `proper5` y `proper20` imprimen ambos la del Propio 11; `proper16` y `proper25` imprimen la misma; `proper17`, `proper23` y `epiphany8` imprimen la misma) y 14 imprimen textos que no son colectas del libro (uno de ellos, el Propio 21, es la "Colecta por la paz" del Oficio Diario).
3. **Epifanía, Cuaresma y Pascua también.** Epifanía 2, 4, 5, 6, 7 y 8: ninguna correcta. Cuaresma 1-5: ninguna correcta (el 5º domingo imprime la colecta del VIERNES SANTO). Pascua 2, 3 y 6: ninguna correcta (el 3º imprime la del miércoles de la Semana de Pascua; el 6º imprime la "Colecta por la paz" del Oficio Diario).
4. **La lógica de elección también falla.** Contra las rúbricas del propio libro, 1.028 de 13.515 días (7,6 %) del barrido 2024-2060 reciben una colecta de otro día (31 en 2026, 29 en 2027). Ejemplos: jueves-sábado después del Miércoles de Ceniza imprimen la colecta de la Transfiguración; lunes-miércoles santos imprimen la de Ramos; las ferias de la Semana de Pascua imprimen la del Domingo de Resurrección.
5. **Efecto neto sobre el calendario.** En 2026 solo 112 de 365 días (30,7 %) imprimen la colecta que el libro prescribe (88 exactas + 24 en variante); 253 no. En 2027, 115 de 365 (31,5 %). Solo 17 de 52 domingos en cada uno de los dos años.
6. **Mañana, 1 nov. 2026 (domingo, Todos los Santos).** El libro (l.19330-19337) la declara Fiesta Principal que "precede a cualquier otro día"; el app imprime `proper26` (texto que no figura en el libro) y no la colecta de Todos los Santos que sí tiene.
7. **La interfaz no avisa de nada.** `app.js` l.196 solo rotula las lecturas prestadas; la colecta prestada o reconstruida de memoria se imprime sin rúbrica ni aviso. El aviso de fuente solo está en comentarios del código (`propers.js` l.8-15).

## 1. Método y cómo conté

- **Claves.** `Object.keys(BCPPropers.COLLECTS).length` = 95 (65 de tiempos móviles + 30 `MM-DD` del santoral). Las 30 fiestas de `FIXED_FEASTS` tienen colecta propia y no sobra ninguna colecta fija (`colectas-sim2.js`).
- **Clasificación.** Manual, clave por clave: leí el texto español del app (propers.js) y lo comparé por sentido con la colecta oficial inglesa de ese día. Criterio: COINCIDE = misma colecta (la traducción puede variar); VARIANTE = misma familia y misma petición con redacción sustancialmente distinta; DISTINTA = es otra colecta (la de otro día o una que no figura en el libro). Para afirmar que un texto del app "no figura en el libro" busqué conceptos distintivos con expresiones regulares en las líneas 16766-18018 y en todo el libro (`colectas-grep.js`): en ningún caso aparece como colecta del día; solo aparecen como otra oración la "Colecta por la paz" del Oficio Diario (l.1366-1371, usada en `easter6` y `proper21`).
- **Gravedad.** Alta = la colecta impresa no es la prescrita para ese día (es de otro día o temporada, o no figura en el libro). Media = variante sustancial, o colecta distinta del santo correcto. Baja = estilo, conclusión abreviada o diferencias menores.
- **Simulación.** Cargué `calendar.js`, `lectionary.js`, `propers.js`, `eucharist.js` y `utils.js` en un contexto `vm` con el arnés, y extraje `getPreviousSunday` y `resolveCollectKey` literalmente de `app.js` (no copiadas a mano). Para cada día a las 12:00 local: modo "propia" si `COLLECTS[dayInfo.key]`; "domingo precedente" si falla y `COLLECTS[claveDelDomingoAnterior]`; "respaldo genérico" si ninguna. Para contrastar con el libro construí una función `bookSlot(fecha)` que aplica las rúbricas citadas en §6.2 (`colectas-sim3.js`). Barrí 2026, 2027 y 2024-2060 (13.515 días).
- **Texto efectivo.** La columna "Evidencia" dice qué colecta oficial es en realidad el texto del app cuando lo he podido identificar dentro del libro.

## 2. Tabla clave por clave

Leyenda: "l.N" tras la clave = línea de `propers.js`. La columna de la colecta oficial lleva líneas del markdown inglés y página.

### 2A. Tiempos móviles (65 claves: 18 COINCIDE, 7 VARIANTE, 40 DISTINTA)

| # | Clave (propers.js) | Día (calendar.js) | Colecta oficial del día: libro (línea md / pág.) y primera frase EN | Clase | Evidencia / texto real del app | Sev. |
|---|---|---|---|---|---|---|
| 1 | `advent1` (l.24) | 1º Dom. Adviento | 16773-16781 / p.598: "Almighty God, give us grace to cast away the works of darkness" | **COINCIDE** | — | — |
| 2 | `advent2` (l.25) | 2º Dom. Adviento | 16782-16789 / p.598: "Blessed Lord, who caused all Holy Scriptures to be written for our learning" | **COINCIDE** | — | — |
| 3 | `advent3` (l.26) | 3º Dom. Adviento (Gaudete) | 16793-16801 / p.599: "O Lord Jesus Christ, you sent your messengers the prophets to preach repentance" | **VARIANTE** | Primera cláusula distinta ("tu mensajero" frente a "tus mensajeros los profetas") y el app omite la cláusula "volviendo los corazones de los desobedientes a la sabiduría de los justos". | baja |
| 4 | `advent4` (l.27) | 4º Dom. Adviento | 16805-16812 / p.599: "Stir up your power, O Lord, and with great might come among us" | **DISTINTA** | El texto del app ("Purifica nuestras conciencias… morada preparada") no figura en pp.598-640 (búsqueda de sus frases distintivas: 0 aciertos en la sección de colectas). | alta |
| 5 | `christmas` (l.28) | Natividad (25 dic) | 16824-16830 / p.600: "Almighty God, you have given your only-begotten Son to take our nature upon him" | **COINCIDE** | Cuerpo parafraseado; la conclusión difiere ("honor y gloria" en el libro). | baja |
| 6 | `christmasSunday` (l.29) | Dom. 26 dic-1 ene ("1º después de Navidad") | 16837-16842 / p.600: "Almighty God, you have poured upon us the new light of your incarnate Word" | **DISTINTA** | El texto del app es la colecta del 2º Domingo de Navidad (16856-16861, p.601). La del libro para este domingo no está en el app. | alta |
| 7 | `christmasSunday2` (l.30) | 2º Dom. después de Navidad (2-5 ene) | 16856-16861 / p.601: "O God, who wonderfully created, and yet more wonderfully restored, the dignity of human nature" | **DISTINTA** | Texto híbrido: abre como la del 1er Dom. de Navidad ("nueva luz") y cierra como la de Nochebuena (16816-16820, "known the mystery of that Light on earth… enjoy him perfectly in heaven"). La del libro para este domingo está, pero bajo la clave christmasSunday. | alta |
| 8 | `circumcision` (l.31) | (CLAVE HUÉRFANA: el calendario no la emite; el 1 ene usa "01-01") | 16844-16852 / p.600: "Almighty God, your blessed Son fulfilled the covenant of circumcision for our sake" | **VARIANTE** | Texto de la familia clásica ("circuncidado y obediente a la Ley"); inalcanzable. Verificado: 0 días en 2024-2060. | baja |
| 9 | `epiphany` (l.32) | La Epifanía (6 ene) | 16864-16870 / p.601: "O God, by the leading of a star you manifested your only Son to the peoples of the earth" | **COINCIDE** | Apertura distinta ("guiaste a los sabios hasta la adoración" frente a "manifestaste a tu único Hijo a los pueblos de la tierra"); el resto equivale. | baja |
| 10 | `epiphany1` (l.33) | Bautismo del Señor (Epif. 1) | 16877-16884 / p.601: "Eternal Father, at the baptism of Jesus you revealed him to be your Son, and your Holy Spirit descended upon him like a dove" | **VARIANTE** | Mismo tema, redacción distinta; la petición difiere ("guardar el pacto… confesar a Cristo" frente a "nacidos del agua y del Espíritu… fieles como hijos adoptivos"). | media |
| 11 | `epiphany2` (l.34) | 2º Dom. después de Epifanía | 16888-16894 / p.602: "Almighty God, whose Son our Savior Jesus Christ is the light of the world" | **DISTINTA** | Texto del app ("cuyo Hijo se manifestó en gran humildad… la belleza de su majestad") sin equivalente en pp.598-640. La del libro está, parafraseada, en la clave epiphany5. | alta |
| 12 | `epiphany3` (l.35) | 3º Dom. después de Epifanía | 16896-16901 / p.602: "Give us grace, O Lord, to answer readily the call of our Savior Jesus Christ" | **COINCIDE** | — | — |
| 13 | `epiphany4` (l.36) | 4º Dom. después de Epifanía | 16903-16910 / p.602: "O God, you know that we are set in the midst of many grave dangers" | **DISTINTA** | Texto del app (bienaventuranzas) sin equivalente en pp.598-640. | alta |
| 14 | `epiphany5` (l.37) | 5º Dom. después de Epifanía | 16922-16927 / p.603: "O Lord, our heavenly Father, keep your household the Church continually in your true religion" | **DISTINTA** | Texto del app = paráfrasis de la colecta del 2º Dom. de Epifanía (16888-16894). | alta |
| 15 | `epiphany6` (l.38) | 6º Dom. después de Epifanía | 16929-16933 / p.603: "Almighty God, look mercifully upon your people" | **DISTINTA** | Texto del app ("sabiduría para percibir tu voluntad…") sin equivalente en pp.598-640. | alta |
| 16 | `epiphany7` (l.39) | 7º Dom. después de Epifanía | 16935-16942 / p.603: "O God, the strength of all who put their trust in you" | **DISTINTA** | Texto del app ("amar a nuestros enemigos") sin equivalente en la sección de colectas. | alta |
| 17 | `epiphany8` (l.40) | 8º Dom. después de Epifanía | 16946-16952 / p.604: "Almighty and merciful God, in your goodness keep us, we pray, from all things that may hurt us" | **DISTINTA** | Texto del app = colecta del Propio 17 (17412-17415); idéntico a la clave proper17. | alta |
| 18 | `transfiguration` (l.41) | Último Dom. después de Epifanía (Transfiguración) | 16965-16973 / p.604: "O God, who before the passion of your only-begotten Son revealed his glory upon the holy mountain" | **COINCIDE** | — | — |
| 19 | `ashWednesday` (l.43) | Miércoles de Ceniza | 16978-16985 / p.605 y 15446-15452 / p.544: "Almighty and everlasting God, you hate nothing you have made" | **COINCIDE** | Omite la conclusión larga que sí trae el español oficial (LOC 14500-14502). | baja |
| 20 | `lent1` (l.44) | 1º Dom. de Cuaresma | 16990-16995 / p.605: "Almighty God, whose blessed Son was led by the Spirit to be tempted by Satan" | **DISTINTA** | Texto del app (ayuno de cuarenta días / abstinencia) sin equivalente en la sección de colectas. | alta |
| 21 | `lent2` (l.45) | 2º Dom. de Cuaresma | 16999-17005 / p.605: "Almighty God, you know that we have no power in ourselves to help ourselves" | **DISTINTA** | Texto del app ("cuya gloria es siempre tener misericordia") sin equivalente en la sección de colectas. La del libro está en la clave lent3. | alta |
| 22 | `lent3` (l.46) | 3º Dom. de Cuaresma | 17010-17015 / p.606: "Heavenly Father, you have made us for yourself, and our hearts are restless until they rest in you" | **DISTINTA** | Texto del app = colecta del 2º Dom. de Cuaresma (16999-17005). | alta |
| 23 | `lent4` (l.47) | 4º Dom. de Cuaresma (Laetare) | 17018-17022 / p.606: "Gracious Father, whose blessed Son Jesus Christ came down from heaven to be the true bread" | **DISTINTA** | Texto del app ("has prometido perdón y misericordia a los que se arrepienten") sin equivalente en la sección de colectas. | alta |
| 24 | `lent5` (l.48) | 5º Dom. de Cuaresma (Pasión) | 17026-17032 / p.606: "Almighty God, you alone can bring into order the unruly wills and affections of sinners" | **DISTINTA** | Texto del app = colecta del VIERNES SANTO (17081-17085; LOC 14947-14950): un domingo de Cuaresma imprime la oración del Viernes Santo. | alta |
| 25 | `palmSunday` (l.50) | Domingo de Ramos | 17038-17044 / p.607 y 15777-15783 / p.557: "Almighty and everlasting God, in your tender love for us you sent your Son our Savior Jesus Christ" | **VARIANTE** | Cotejo con LOC 14801-14806: el app dice "sigamos el ejemplo de su paciencia" (LOC: "caminemos en el camino de su sufrimiento"), "nuestra carne" (LOC: "naturaleza") y omite la conclusión larga. | baja |
| 26 | `maundyThursday` (l.51) | Jueves Santo | 17072-17078 / p.608 y 15849-15855 / p.561: "Almighty Father, whose most dear Son, on the night before he suffered, instituted the Sacrament of his Body and Blood" | **COINCIDE** | Cotejo con LOC 14863-14868: invocación "Dios Todopoderoso" (LOC: "Padre todopoderoso"), "en memoria de él" (LOC: "de Jesucristo nuestro Salvador") y conclusión distinta. | baja |
| 27 | `goodFriday` (l.52) | Viernes Santo | 17081-17085 / p.608 y 15942-15946 / p.565: "Almighty God, we beseech you graciously to behold this your family" | **COINCIDE** | Idéntica al español oficial (LOC 14947-14950) salvo artículos. | — |
| 28 | `holySaturday` (l.53) | Sábado Santo | 17087-17091 / p.608 (1ª) y 17095-17099 / p.609 (2ª); 16284-16294 / p.578: "O God, Creator of heaven and earth: Grant that, as the crucified body of your dear Son was laid in the tomb… (o) O God of the living, on this day your Son our Savior descended to the place of the dead" | **VARIANTE** | Cotejo con LOC 15251-15259: no coincide con ninguna de las dos opciones; sigue la estructura de la 1ª pero con otra invocación, añade "sepultados con él por el bautismo" y cambia la petición final ("la mañana de la resurrección" frente a "el tercer día… vida nueva"). | media |
| 29 | `easter` (l.55) | Domingo de Resurrección | 17111-17117 / p.609 (alt. 17123-17128 / p.610): "Almighty God, who through your only-begotten Son Jesus Christ overcame death and opened to us the gate of everlasting life" | **VARIANTE** | Primera mitad igual; la petición difiere ("como nos das el buen deseo… lo llevemos a buen efecto" frente a "celebrando con gozo la resurrección… libres del pecado y resucitados de la muerte"). | media |
| 30 | `easter2` (l.56) | 2º Dom. de Pascua | 17181-17186 / p.612: "Almighty and everlasting God, who in the Paschal mystery established the new covenant of reconciliation" | **DISTINTA** | Texto del app ("solemnidad pascual… herencia eterna") sin equivalente en la sección de colectas. | alta |
| 31 | `easter3` (l.57) | 3º Dom. de Pascua | 17189-17194 / p.612: "Almighty God, you gave your only Son to be for us both a sacrifice for sin and an example of godly living" | **DISTINTA** | Texto del app = colecta del MIÉRCOLES de la Semana de Pascua (17146-17150). | alta |
| 32 | `easter4` (l.58) | 4º Dom. de Pascua (Buen Pastor) | 17197-17202 / p.612: "O God, whose Son Jesus Christ is the Good Shepherd of your people" | **COINCIDE** | — | — |
| 33 | `easter5` (l.59) | 5º Dom. de Pascua | 17205-17212 / pp.612-613: "Almighty God, whom truly to know is everlasting life" | **COINCIDE** | Final parafraseado ("plenitud de tu presencia" frente a "the way that leads to eternal glory"). | baja |
| 34 | `easter6` (l.60) | 6º Dom. de Pascua | 17215-17221 / p.613: "O God, you have prepared for those who love you such good things as surpass our understanding" | **DISTINTA** | Texto del app = "Colecta por la paz" del Oficio Diario (1366-1371), no una colecta del año cristiano; idéntico en espíritu a proper21. | alta |
| 35 | `easter7` (l.61) | 7º Dom. de Pascua (Dom. después de la Ascensión) | 17233-17238 / p.613: "O God, the King of glory, you have exalted your only Son Jesus Christ with great triumph" | **COINCIDE** | — | — |
| 36 | `ascension` (l.62) | La Ascensión | 17225-17228 / p.613: "Almighty God, whose only-begotten Son our Lord Jesus Christ ascended into heaven" | **COINCIDE** | — | — |
| 37 | `pentecost` (l.63) | Día de Pentecostés | 17243-17249 (1ª) y 17252-17257 (2ª) / p.614: "Almighty God, on this day, through the outpouring of the Holy Spirit… (o) O God, who on this day taught the hearts of your faithful people" | **COINCIDE** | Corresponde a la 2ª opción ("or this"); la 1ª opción no está en el app. | baja |
| 38 | `trinitySunday` (l.64) | La Santísima Trinidad | 17273-17279 / p.615: "Almighty and everlasting God, you have given to us your servants grace, by the confession of a true faith" | **VARIANTE** | Primera parte igual; la petición final difiere ("mantennos firmes… nos defiendas de todo peligro" frente a "firmes en esta fe y adoración, y llévanos a ver tu gloria eterna"). | baja |
| 39 | `proper3` (l.66) | Propio 3 (dom. 22-28 may) | 17300-17306 / p.616: "O Lord, we entreat you mercifully to hear us" | **DISTINTA** | Texto del app ("gracia… purifique nuestros corazones… descansemos en ti") sin equivalente en la sección de colectas. | alta |
| 40 | `proper4` (l.67) | Propio 4 (dom. 29 may-4 jun) | 17307-17315 / p.616: "O God, the protector of all those who trust in you" | **DISTINTA** | Texto del app (casa sobre la roca) sin equivalente en la sección de colectas. | alta |
| 41 | `proper5` (l.68) | Propio 5 (dom. 5-11 jun) | 17316-17322 / p.616: "Grant, O Lord, that the course of this world may be so peaceably ordered" | **DISTINTA** | Texto del app = colecta del Propio 11 (17363-17370). | alta |
| 42 | `proper6` (l.69) | Propio 6 (dom. 12-18 jun) | 17323-17329 / p.616: "O Lord, from whom all good proceeds" | **DISTINTA** | Texto del app = colecta del Propio 15 (17396-17402). | alta |
| 43 | `proper7` (l.70) | Propio 7 (dom. 19-25 jun) | 17332-17339 / p.617: "Lord of all power and might, the author and giver of all good things" | **DISTINTA** | Texto del app = familia de la colecta del Propio 2 (17292-17297, "never fail to support and govern… perpetual fear and love of your holy Name"). | alta |
| 44 | `proper8` (l.71) | Propio 8 (dom. 26 jun-2 jul) | 17340-17346 / p.617: "O God, your never-failing providence sets in order all things both in heaven and on earth" | **DISTINTA** | Texto del app (Iglesia sobre el fundamento de apóstoles y profetas) sin equivalente en la sección de colectas. | alta |
| 45 | `proper9` (l.72) | Propio 9 (dom. 3-9 jul) | 17347-17353 / p.617: "Grant us, O Lord, we pray, the spirit to think and do always those things that are right" | **DISTINTA** | Texto del app ("yugo fácil… carga ligera") sin equivalente en la sección de colectas. | alta |
| 46 | `proper10` (l.73) | Propio 10 (dom. 10-16 jul) | 17354-17360 / p.617: "Let your merciful ears, O Lord, be open to the prayers of your humble servants" | **DISTINTA** | Texto del app ("corazón compasivo como el del buen samaritano") sin equivalente en ningún lugar del libro; forma no litúrgica. | alta |
| 47 | `proper11` (l.74) | Propio 11 (dom. 17-23 jul) | 17363-17370 / p.618: "O God, you declare your almighty power chiefly in showing mercy and pity" | **DISTINTA** | Texto del app = colecta del Propio 4 (17309-17315). | alta |
| 48 | `proper12` (l.75) | Propio 12 (dom. 24-30 jul) | 17371-17380 / p.618: "Almighty and everlasting God, you are always more ready to hear than we to pray" | **DISTINTA** | Texto del app ("enséñanos a orar") sin equivalente en el libro; la colecta oficial de este Propio está en la clave proper19. | alta |
| 49 | `proper13` (l.76) | Propio 13 (dom. 31 jul-6 ago) | 17381-17387 / p.618: "Almighty and merciful God, it is only by your grace that your faithful people offer you true and laudable service" | **COINCIDE** | — | — |
| 50 | `proper14` (l.77) | Propio 14 (dom. 7-13 ago) | 17388-17395 / pp.618-619: "Almighty God, give us the increase of faith, hope, and love" | **DISTINTA** | Texto del app ("fe para vivir sin temor, como Abraham") sin equivalente en el libro; la colecta oficial está en la clave proper24. | alta |
| 51 | `proper15` (l.78) | Propio 15 (dom. 14-20 ago) | 17396-17402 / p.619: "Keep your Church, O Lord, by your perpetual mercy" | **DISTINTA** | Texto del app ("cosas escondidas a los sabios") sin equivalente en el libro; la colecta oficial está en la clave proper6. | alta |
| 52 | `proper16` (l.79) | Propio 16 (dom. 21-27 ago) | 17403-17409 / p.619: "Let your continual mercy, O Lord, cleanse and defend your Church" | **COINCIDE** | Texto repetido en proper25. | baja |
| 53 | `proper17` (l.80) | Propio 17 (dom. 28 ago-3 sep) | 17410-17415 / p.619: "O Lord, we pray that your grace may always precede and follow after us" | **COINCIDE** | Texto repetido en epiphany8 y (casi igual) en proper23. | baja |
| 54 | `proper18` (l.81) | Propio 18 (dom. 4-10 sep) | 17416-17422 / p.619: "O Lord God, grant your people grace to withstand the temptations of the world, the flesh, and the devil" | **DISTINTA** | Texto del app (corrección fraterna) sin equivalente en la sección de colectas. | alta |
| 55 | `proper19` (l.82) | Propio 19 (dom. 11-17 sep) | 17425-17431 / p.620: "O God, because without you we are not able to please you" | **DISTINTA** | Texto del app = colecta del Propio 12 (17371-17380). | alta |
| 56 | `proper20` (l.83) | Propio 20 (dom. 18-24 sep) | 17434-17442 / p.620: "O Lord, you have taught us that without love, all our deeds are worth nothing" | **DISTINTA** | Texto del app = colecta del Propio 11 (17363-17370); idéntico a proper5. | alta |
| 57 | `proper21` (l.84) | Propio 21 (dom. 25 sep-1 oct) | 17443-17449 / p.620: "O merciful Lord, grant to your faithful people pardon and peace" | **DISTINTA** | Texto del app = "Colecta por la paz" del Oficio Diario (1366-1371); casi igual a easter6. | alta |
| 58 | `proper22` (l.85) | Propio 22 (dom. 2-8 oct) | 17450-17459 / pp.620-621: "Keep, O Lord, your household the Church in continual godliness" | **DISTINTA** | Texto del app ("Señor Jesucristo, uniste el cielo y la tierra…") sin equivalente en el libro. | alta |
| 59 | `proper23` (l.86) | Propio 23 (dom. 9-15 oct) | 17460-17466 / p.621: "O God, our refuge and strength, true source of all godliness" | **DISTINTA** | Texto del app = colecta del Propio 17 (17410-17415). | alta |
| 60 | `proper24` (l.87) | Propio 24 (dom. 16-22 oct) | 17467-17473 / p.621: "Set us free, loving Father, from the bondage of our sins" | **DISTINTA** | Texto del app = colecta del Propio 14 (17388-17395). | alta |
| 61 | `proper25` (l.88) | Propio 25 (dom. 23-29 oct) | 17474-17480 / p.621: "Almighty and everlasting God, you govern all things both in heaven and on earth" | **DISTINTA** | Texto del app = colecta del Propio 16 (17403-17409); idéntico a proper16. | alta |
| 62 | `proper26` (l.89) | Propio 26 (dom. 30 oct-5 nov) | 17493-17499 / p.622: "Grant us, Lord, not to be anxious about earthly things, but to love things heavenly" | **DISTINTA** | Texto del app ("fuente de toda santidad… tus santos") sin equivalente en la sección de colectas. | alta |
| 63 | `proper27` (l.90) | Propio 27 (dom. 6-12 nov) | 17500-17508 / p.622: "O God, whose blessed Son came into the world that he might destroy the works of the devil" | **DISTINTA** | Texto del app (viuda que dio todo) sin equivalente en la sección de colectas. | alta |
| 64 | `proper28` (l.91) | Propio 28 (dom. 13-19 nov) | 17509-17517 / pp.622-623: "Stir up, O Lord, the wills of your faithful people" | **DISTINTA** | Texto del app ("dio su Cuerpo a ser entregado… Santísimo Sacramento") sin equivalente en la sección de colectas. | alta |
| 65 | `proper29` (l.92) | Propio 29 (dom. 20 nov-3 dic) | 17518-17527 / p.623: "Almighty and everlasting God, whose will it is to restore all things in your well-beloved Son" | **COINCIDE** | — | — |

### 2B. Santoral fijo (30 claves: 17 COINCIDE, 7 VARIANTE, 6 DISTINTA)

| # | Clave (propers.js) | Día (calendar.js) | Colecta oficial del día: libro (línea md / pág.) y primera frase EN | Clase | Evidencia / texto real del app | Sev. |
|---|---|---|---|---|---|---|
| 1 | `01-01` (l.95) | El Santo Nombre (1 ene) | 17580-17589 / p.625 (= 16844-16853 / p.600): "Almighty God, your blessed Son fulfilled the covenant of circumcision for our sake, and was given the Name that is above every name" | **VARIANTE** | Misma colecta en versión clásica ("circuncidado y obediente a la Ley… escribirlo en nuestros corazones"); idéntica en texto a la clave huérfana "circumcision". | baja |
| 2 | `01-18` (l.96) | La Confesión de San Pedro | 17592-17599 / p.626: "Almighty Father, who inspired Simon Peter, first among the apostles, to confess Jesus as Messiah" | **COINCIDE** | — | — |
| 3 | `01-25` (l.97) | La Conversión de San Pablo | 17601-17608 / p.626: "O God, by the preaching of your apostle Paul you have caused the light of the Gospel to shine throughout the world" | **COINCIDE** | — | — |
| 4 | `02-02` (l.98) | La Presentación del Señor | 17610-17616 / p.626 (= 16914-16920 / p.603): "Almighty and everliving God, we humbly pray that, as your only-begotten Son was this day presented in the temple" | **COINCIDE** | — | — |
| 5 | `02-24` (l.99) | San Matías | 17620-17627 / p.627: "Almighty God, who in the place of Judas chose your faithful servant Matthias" | **COINCIDE** | — | — |
| 6 | `03-19` (l.100) | San José | 17629-17636 / p.627: "O God, who from the family of your servant David raised up Joseph to be the guardian of your incarnate Son" | **COINCIDE** | — | — |
| 7 | `03-25` (l.101) | La Anunciación | 17638-17645 / p.627: "Pour your grace into our hearts, O Lord, that we who have known the incarnation of your Son Jesus Christ" | **COINCIDE** | — | — |
| 8 | `04-25` (l.102) | San Marcos | 17649-17657 / p.628: "Almighty God, by the hand of Mark the evangelist you have given to your Church the Gospel of Jesus Christ" | **COINCIDE** | El app omite la acción de gracias por su testimonio; el resto equivale. | baja |
| 9 | `05-01` (l.103) | SS. Felipe y Santiago | 17659-17666 / p.628: "Almighty God, you gave to your apostles Philip and James the grace and strength to bear witness to Jesus as the way, the truth, and the life" | **VARIANTE** | El cuerpo del app es la colecta del 5º Dom. de Pascua (a quien conocer es vida eterna) con los nombres de los apóstoles; comparte "camino, verdad y vida" pero no la petición oficial ("victoria de su fe… glorificar el Nombre"). | media |
| 10 | `05-31` (l.104) | La Visitación | 17668-17675 / p.628: "Almighty God, by whose grace Elizabeth rejoiced with the blessed Virgin Mary and greeted her as the mother of the Lord" | **VARIANTE** | Mismo tema (María e Isabel, "magnificar tu Nombre") con redacción distinta. Caso frontera VARIANTE/DISTINTA. | media |
| 11 | `06-11` (l.105) | San Bernabé | 17679-17687 / p.629: "Grant, O God, that we may follow the example of your faithful servant Barnabas" | **VARIANTE** | Comparten la imitación de su generosidad, pero el app abre con "dones del Espíritu Santo para consolar a los afligidos". Caso frontera VARIANTE/DISTINTA. | media |
| 12 | `06-24` (l.106) | Natividad de San Juan Bautista | 17689-17698 / p.629: "Almighty God, by whose providence your servant John the Baptist was wonderfully born" | **VARIANTE** | Versión abreviada: omite "arrepentirnos verdaderamente, reprender el vicio con valentía, sufrir con paciencia por la verdad". | baja |
| 13 | `06-29` (l.107) | SS. Pedro y Pablo | 17700-17707 / p.629: "Almighty God, whose blessed apostles Peter and Paul glorified you by their martyrdom" | **COINCIDE** | — | — |
| 14 | `07-22` (l.108) | Santa María Magdalena | 17711-17718 / p.630: "Almighty God, whose blessed Son restored Mary Magdalene to health of body and of mind" | **DISTINTA** | El app habla de la primera aparición y de proclamar a Cristo resucitado; el libro pide ser sanados de toda enfermedad. Sin equivalente en la sección de colectas. | media |
| 15 | `07-25` (l.109) | Santiago, Apóstol | 17720-17728 / p.630: "O gracious God, your servant and apostle James was first among the Twelve to suffer martyrdom" | **DISTINTA** | El app trae la colecta clásica del llamado de Santiago ("dejando padre y bienes… sin demora"); el libro pide el espíritu de servicio de los líderes de la Iglesia. Sin equivalente. | media |
| 16 | `08-06` (l.110) | La Transfiguración (6 ago) | 17730-17737 / p.630: "O God, who on the holy mount revealed to chosen witnesses your well-beloved Son, wonderfully transfigured" | **DISTINTA** | Texto del app = colecta del Último Dom. de Epifanía (16965-16973; idéntica a la clave transfiguration). El libro tiene otra para la fiesta. | media |
| 17 | `08-15` (l.111) | Santa María Virgen | 17741-17748 / p.631: "O God, you have taken to yourself the blessed Virgin Mary, mother of your incarnate Son" | **DISTINTA** | Texto del app (humildad de María, su intercesión) sin equivalente en la sección de colectas. | media |
| 18 | `08-24` (l.112) | San Bartolomé | 17750-17757 / p.631: "Almighty and everlasting God, you gave your apostle Bartholomew grace truly to believe and to preach your Word" | **COINCIDE** | — | — |
| 19 | `09-14` (l.113) | La Santa Cruz | 17759-17766 / p.631: "Almighty God, whose Son our Savior Jesus Christ was lifted high upon the Cross that he might draw the whole world to himself" | **COINCIDE** | — | — |
| 20 | `09-21` (l.114) | San Mateo | 17770-17777 / p.632: "Lord Jesus, you called Matthew from collecting taxes to become your apostle and evangelist" | **VARIANTE** | Versión clásica dirigida al Padre; el libro la dirige a Cristo y añade "proclamar al mundo las buenas nuevas". | baja |
| 21 | `09-29` (l.115) | San Miguel y Todos los Ángeles | 17779-17787 / p.632: "Everlasting God, you have ordained and constituted in a wonderful order the ministries of angels and mortals" | **COINCIDE** | — | — |
| 22 | `10-18` (l.116) | San Lucas | 17789-17796 / p.632: "Almighty God, you called your servant Luke to be an evangelist and physician of the soul" | **COINCIDE** | — | — |
| 23 | `10-23` (l.117) | Santiago de Jerusalén | 17800-17807 / p.633: "Grant, O God, that, following the example of your apostle James the Just, kinsman of our Lord" | **DISTINTA** | El app pide "piedad y prudencia" y habla de gobernar la Iglesia; el libro pide oración continua y reconciliación de los enemistados. Sin equivalente. | media |
| 24 | `10-28` (l.118) | SS. Simón y Judas | 17809-17815 / p.633: "Grant, O God, that as your apostles Simon and Jude were faithful and zealous in their mission" | **DISTINTA** | Texto del app ("conocimiento de tu Nombre… camino, verdad y vida") sin equivalente en la sección de colectas. | media |
| 25 | `11-01` (l.119) | Todos los Santos | 17817-17825 / p.633 (= 17483-17491 / p.622): "Almighty God, you have knit together your elect in one communion and fellowship" | **COINCIDE** | Falla la ELECCIÓN cuando 1 nov cae en domingo (ver §6). | — |
| 26 | `11-30` (l.120) | San Andrés | 17531-17538 / p.624: "Almighty God, you gave such grace to your apostle Andrew" | **COINCIDE** | — | — |
| 27 | `12-21` (l.121) | Santo Tomás | 17540-17547 / p.624: "Everliving God, you strengthened your apostle Thomas with firm and certain faith" | **COINCIDE** | — | — |
| 28 | `12-26` (l.122) | San Esteban | 17549-17556 / p.624: "O Glorious Lord, your servant Stephen looked up to heaven and prayed for his persecutors" | **COINCIDE** | Traducción muy libre; mismo sentido. | baja |
| 29 | `12-27` (l.123) | San Juan, Apóstol y Evangelista | 17560-17567 / p.625: "Shed upon your Church, O Lord, the brightness of your light" | **COINCIDE** | — | — |
| 30 | `12-28` (l.124) | Los Santos Inocentes | 17569-17578 / p.625: "Almighty God, out of the mouths of children you manifest your truth" | **VARIANTE** | Misma colecta con apertura distinta y sin la parte "te mostrarías fuerte en nuestra debilidad"; conserva "mortifica todo mal". Caso frontera. | media |

## 3. Conteos

| Clasificación | Tiempos móviles (65) | Santoral (30) | Total (95) | % |
|---|---|---|---|---|
| COINCIDE | 18 | 17 | **35** | 36,8 |
| VARIANTE | 7 | 7 | **14** | 14,7 |
| DISTINTA | 40 | 6 | **46** | 48,4 |
| SIN FUENTE OFICIAL | 0 | 0 | **0** | 0 |
| AMBIGUO | 0 | 0 | **0** | 0 |

Desglose de las 46 DISTINTA: 16 imprimen el texto de otra colecta oficial (`christmasSunday`→2º dom. de Navidad; `epiphany5`→Epifanía 2; `epiphany8`→Propio 17; `lent3`→Cuaresma 2; `lent5`→Viernes Santo; `easter3`→miércoles de Pascua; `proper5`, `proper20`→Propio 11; `proper6`→Propio 15; `proper7`→Propio 2 (familia); `proper11`→Propio 4; `proper19`→Propio 12; `proper23`→Propio 17; `proper24`→Propio 14; `proper25`→Propio 16; `08-06`→Último dom. de Epifanía) y 30 no están en el libro como colecta del día (de esas 30, `easter6` y `proper21` son la "Colecta por la paz" del Oficio Diario; en las otras 28 no encontré equivalente en ningún lugar del libro con mi búsqueda de frases distintivas).

Gravedad (95 claves): alta 40 · media 13 · baja 17 · sin hallazgo 25. (Las 40 altas son todas DISTINTA de tiempos móviles; las 6 DISTINTA del santoral son media porque el santo es el correcto; media también incluye 7 VARIANTE.)

Cobertura frente al libro: el libro tiene 129 colectas distintas en pp. 598-640 (cuento alternativas por separado; Presentación, Santo Nombre y Todos los Santos aparecen dos veces con texto idéntico y las cuento una). El app tiene clave para 94 de ellas; reproduce fielmente 35 (27 %), en variante 13 (10 %), con otro texto 46 (36 %), y 35 (27 %) no tienen clave (§4).

**Efecto por día (simulación, `colectas-sim.js`/`colectas-sim3.js`):**

| | 2026 | 2027 | 2024-2060 |
|---|---|---|---|
| Días | 365 | 365 | 13.515 |
| Colecta propia del día | 83 | 85 | 3.127 (23,1 %) |
| Tomada del domingo precedente | 282 | 280 | 10.388 (76,9 %) |
| Respaldo genérico ("Colecta no disponible…") | 0 | 0 | 0 |
| Imprime la colecta prescrita (exacta) | 88 | 90 | 3.393 (25,1 %) |
| Imprime la prescrita en variante | 24 | 25 | 862 (6,4 %) |
| Imprime otra por error de ELECCIÓN | 31 | 29 | 1.028 (7,6 %) |
| Imprime otra por TEXTO erróneo en su clave | 222 | 221 | 8.232 (60,9 %) |

Por tipo de día (2026 / 2027): domingos 12+5 exactos/variante de 52 (igual en 2027: 17 de 52); fiestas fijas 18 de 24 / 22 de 26; días propios (Ceniza, Jueves Santo, Viernes Santo, Sábado Santo, Navidad, Epifanía, Ascensión) 7 de 7 en ambos años (el Sábado Santo en variante); ferias con colecta prestada: 70 de 282 / 69 de 280. Detalle día por día: `colectas-dias-2026.csv` y `colectas-dias-2027.csv`.

## 4. Colectas oficiales sin clave en el app

El app no tiene clave para 35 colectas oficiales. Ninguno de esos días cae al respaldo genérico: `resolveCollectKey` siempre encuentra la clave del domingo precedente y la imprime sin rúbrica (0 de 13.515 días llegan a "Colecta no disponible").

| Colecta oficial | Libro (línea md / pág.) | Primera frase EN | Qué hace el app |
|---|---|---|---|
| Nochebuena (Christmas Eve) | 16815-16821 / p.599 | O God, you have caused this holy night to shine with the brightness of the true Light | 24 dic. es una feria de Adviento: imprime la del 4º domingo de Adviento (`advent4`, texto que no es del libro) |
| Lunes Santo | 17046-17053 / p.607 (= colecta de procesión 15761-15765 / p.556; LOC 14788-14791) | Almighty God, whose most dear Son went not up to joy but first he suffered pain | Imprime `palmSunday` (111 días en 2024-2060 con martes y miércoles) |
| Martes Santo | 17054-17061 / p.607 | O Lord our God, whose blessed Son gave his back to be whipped | Imprime `palmSunday` |
| Miércoles Santo | 17064-17070 / p.608 | Assist us mercifully with your grace, Lord God of our salvation | Imprime `palmSunday` |
| Sábado Santo, 2ª opción | 17094-17099 / p.609 (16290-16294 / p.578; LOC 15256-15259) | O God of the living, on this day your Son our Savior descended to the place of the dead | No está; `holySaturday` es una variante de la 1ª opción |
| Vigilia Pascual: Easter Eve | 17101-17108 / p.609 (16661-16667 / p.592; LOC 15608-15612) | O God, you made this most holy night to shine with the glory of the Lord's resurrection | La Vigilia no existe en el calendario; el app no emite clave |
| Domingo de Resurrección, 2ª opción | 17122-17128 / p.610 | O God, who for our redemption gave your only begotten Son to die upon the Cross | No está |
| Lunes de la Semana de Pascua | 17130-17136 / p.610 | Grant, we pray, Almighty God, that we who celebrate with reverence the Paschal feast | Imprime `easter` (las 6 ferias suman 222 días en 2024-2060) |
| Martes | 17137-17144 / p.610 | O God, who by the glorious resurrection of your Son Jesus Christ destroyed death | Imprime `easter` |
| Miércoles | 17145-17151 / p.610 | O God, whose blessed Son made himself known to his disciples in the breaking of bread | Imprime `easter` (este texto sí está en el app, pero en `easter3`) |
| Jueves | 17154-17161 / p.611 | Almighty God, you show those in error the light of your truth | Imprime `easter` |
| Viernes | 17162-17169 / p.611 | Almighty Father, who gave your only Son to die for our sins and to rise for our justification | Imprime `easter` |
| Sábado | 17170-17177 / p.611 | Heavenly Father, you have delivered us from the dominion of sin and death | Imprime `easter` |
| Pentecostés, 1ª opción | 17243-17249 / p.614 | Almighty God, on this day, through the outpouring of the Holy Spirit | No está (el app tiene la 2ª opción) |
| Penúltimo domingo de Epifanía (World Mission Sunday, sustituible) | 16954-16964 / p.604 | Almighty God, through the outpouring of the Holy Spirit, you revealed the way of eternal life to every race and nation | No está |
| Propio 1 | 17281-17289 / p.615 | O God, the strength of all who put their trust in you | No existe clave. Aplica a ferias tras Trinidad/Pentecostés cuando Pentecostés cae temprano (§6.2) |
| Propio 2 | 17290-17297 / p.615 | O Lord, you never fail to support and govern those whom you bring up in your steadfast love and fear | Ídem |
| Témporas (2 opciones) | 17829-17850 / p.634 | Almighty God, the giver of all good gifts… / O God, you led your holy apostles to ordain ministers | El calendario no modela las Témporas |
| Rogativas (2 opciones) | 17853-17871 / p.635 | Almighty God, Lord of heaven and earth… / Almighty God, whose Son Jesus Christ in his earthly life shared our toil | Lunes-miércoles antes de la Ascensión imprimen `easter6` (texto del Oficio Diario) |
| Memorial Day / Remembrance Day | 17875-17885 / p.636 | O King and Judge of the nations | No se modelan días nacionales |
| Canada Day | 17886-17894 / p.636 | Almighty God, whose wisdom and love are over all | Ídem |
| Independence Day | 17895-17902 / p.636 | Lord God, by your providence our founders won their liberties of old | Ídem |
| Thanksgiving Day | 17905-17913 / p.637 | Most merciful Father, we humbly thank you for all your gifts | Ídem |
| Común de conmemoraciones (9 categorías + 1 alternativa) | 17921-18016 / pp.637-640 | Mártir, Misionero, Pastor, Maestro, Religioso, Ecumenista, Reformador, Renovador de la sociedad, Cualquier conmemoración (2) | No se modelan conmemoraciones |

Recuento: 1+1+1+3+1+6+1+1+2+2+2+4+10 = 35.

## 5. Fiestas fijas (`FIXED_FEASTS`, 30 entradas)

- El libro tiene colecta propia para las 30 fiestas fijas del app (l.17530-17826 y 16914-16921): Santo Nombre, Confesión de San Pedro, Conversión de San Pablo, Presentación, San Matías, San José, Anunciación, San Marcos, Felipe y Santiago, Visitación, San Bernabé, Natividad de Juan Bautista, Pedro y Pablo, María Magdalena, Santiago, Transfiguración, Santa María Virgen, San Bartolomé, Santa Cruz, San Mateo, San Miguel, San Lucas, Santiago de Jerusalén, Simón y Judas, Todos los Santos, San Andrés, Santo Tomás, San Esteban, San Juan, Santos Inocentes. Verificado por código: ninguna fiesta fija sin colecta y ninguna colecta fija sin fiesta.
- Calidad del texto: 17 COINCIDE, 7 VARIANTE, 6 DISTINTA (`07-22`, `07-25`, `08-06`, `08-15`, `10-23`, `10-28`). Detalle en la tabla 2B.
- `08-06` (Transfiguración, 6 ago.) imprime la colecta del Último Domingo de Epifanía (la misma que `transfiguration`); el libro tiene otra para la fiesta (l.17730-17737).
- El libro permite o exige otras cosas que el app no hace y que afectan qué colecta se imprime: (a) las Fiestas Principales (Epifanía, Todos los Santos, entre otras) "preceden a cualquier otro día" (l.19330-19337); (b) las demás fiestas que caen en domingo, fuera de Adviento, Cuaresma y Pascua, "pueden observarse ese domingo o trasladarse al siguiente día de semana" (l.19363-19365). El app deja siempre ganar al domingo y pierde la fiesta (162 fiestas fijas en domingo en 2024-2060; en 2026: 18 ene., 25 ene., 31 may., 18 oct., 1 nov. y 27 dic.; en 2027: 25 abr., 25 jul., 15 ago. y 26 dic.). Para Todos los Santos esto contradice (a): cae en domingo en 2026, 2037, 2043, 2048 y 2054. Para las demás es criterio litúrgico permitido por (b).
- Semana Santa y Pascua: las fijas se trasladan a la semana siguiente al 2º domingo de Pascua; consistente con l.19368-19369 ("ningún día santo puede reemplazar los propios fijos del Miércoles de Ceniza, Semana Santa o Semana de Pascua").

## 6. Lógica de elección y respaldo

### 6.1 Qué hace el código

- `propers.js` l.173-175: `getCollect(key)` devuelve `COLLECTS[key]` o `'Colecta no disponible para este día.'`. El comentario de `app.js` l.47 ("caía siempre a Proper 11") describe el comportamiento anterior; hoy ya no es cierto.
- `app.js` l.49-54: `resolveCollectKey` devuelve (1) la clave del propio día si tiene colecta, (2) si no, la clave del domingo anterior si la tiene, (3) si no, la clave del día (que `getCollect` convierte en el aviso). No distingue temporada, no marca la colecta como prestada y no consulta rúbricas.
- Resultado medido: 0 de 13.515 días llegan al aviso; todo domingo emitido por el calendario tiene colecta propia. El "respaldo" nunca se activa, de modo que todo hueco queda cubierto en silencio por el domingo anterior.
- `app.js` l.43-46 afirma que repetir la colecta de Ramos el lunes, martes y miércoles santos "es correcto". El libro lo contradice: trae colecta propia para cada uno de esos tres días (l.17046-17070).

### 6.2 Qué prescribe el libro para los días de semana

Regla general: la Colecta del Día es "la del domingo o fiesta principal y de los días de semana siguientes, o la de la fiesta que se celebra" (l.685-688, p.22; l.1351-1354, p.49; también la nota del leccionario: las lecturas del domingo se usan "durante la semana siguiente", l.21076). Esto respalda la regla de `resolveCollectKey` para la mayoría de las ferias (252 de las 282 ferias prestadas de 2026 y 251 de 280 de 2027).

Excepciones explícitas del libro que el app no aplica (días afectados por la simulación, `colectas-sim3.js`):

| Rúbrica del libro | Cita | 2026 | 2027 | 2024-2060 | Lo que imprime el app |
|---|---|---|---|---|---|
| La colecta del Miércoles de Ceniza "sirve también para los días de semana siguientes" | l.16987-16988, p.605 | 3 | 3 | 107 | jue.-sáb. tras Ceniza: colecta de la Transfiguración (`transfiguration`), temporada de Epifanía |
| Lunes, martes y miércoles santos tienen colecta propia | l.17046-17070, pp.607-608 | 3 | 3 | 111 | colecta del Domingo de Ramos |
| Cada día de la Semana de Pascua tiene colecta propia (lunes a sábado) | l.17130-17177, pp.610-611 | 6 | 6 | 222 | colecta del Domingo de Resurrección |
| La colecta de la Ascensión sirve el viernes y sábado siguientes | l.17230-17231, p.613 | 2 | 2 | 70 | colecta del 6º domingo de Pascua (`easter6`, que además no es la oficial) |
| Las colectas de Pentecostés y Trinidad "no se usan en los días de semana siguientes; en su lugar se usan los propios fechados de la semana" | l.17262-17269, p.614 | 6 (Pentecostés) + 6 (Trinidad) | 6 + 6 | 206 + 209 | colecta de Pentecostés o de la Trinidad. Ver AMBIGUO en §9 |
| La colecta de Navidad sirve entre los Inocentes y el 1er domingo de Navidad | l.16832-16834, p.600 | 0 | 0 | 15 | colecta del 4º domingo de Adviento el 29-31 dic. cuando aún no ha pasado el 1er domingo de Navidad (p. ej. 2028, 2029) |
| La colecta de la Epifanía sirve entre la Epifanía y el domingo siguiente | l.16872-16874, p.601 | 4 | 3 | 83 | colecta del 2º domingo de Navidad (`christmasSunday2`) |
| Todos los Santos es Fiesta Principal y precede a cualquier otro día | l.19330-19337, p.688 | 1 | 0 | 5 | colecta del Propio 26 (1 nov. en domingo) |
| **Total** | | **31** | **29** | **1.028** | |

### 6.3 Ejemplos concretos de colecta de otra temporada

- **Jue.-sáb. 19-21 feb. 2026** (jueves a sábado después del Miércoles de Ceniza, temporada de Cuaresma): clave `transfiguration`, colecta del Último Domingo de Epifanía ("Dios Todopoderoso, cuyo Hijo antes de su pasión fue transfigurado…"). Igual el 11-13 feb. 2027.
- **Mié.-sáb. 7-10 ene. 2026** (días después de la Epifanía): clave `christmasSunday2`, un texto de Navidad que además no es el del libro. En 2027, 7-9 ene.
- **29-30 dic. 2028 y 29 dic. 2029** (días de Navidad): clave `advent4`; la colecta de Adviento ("Purifica nuestras conciencias, Señor Todopoderoso, con tu diaria visitación…") se reza después de Navidad. 15 días en 2024-2060.
- **Lunes Santo 30 mar. 2026 a miércoles 1 abr.**: colecta de Ramos; **lunes 6 a sábado 11 abr. 2026**: colecta del Domingo de Resurrección en la Semana de Pascua.
- **Mañana, domingo 1 nov. 2026**: Propio 26 en lugar de Todos los Santos. **Hoy, sábado 31 oct. 2026**: clave `proper25`, cuyo texto es la colecta que el libro asigna al Propio 16; el libro prescribe para esta semana la del Propio 25 ("Almighty and everlasting God, you govern all things both in heaven and on earth", l.17476).
- **Textos de otra temporada en su propio domingo:** 22 mar. 2026 (5º de Cuaresma) imprime la colecta del Viernes Santo; 19 abr. 2026 (3º de Pascua) imprime la del miércoles de la Semana de Pascua; 10 may. 2026 (6º de Pascua) y 27 sep. 2026 (Propio 21) imprimen la "Colecta por la paz" del Oficio Diario.
- Las 7 ferias de 2026 (y 6 de 2027) donde la clave elegida pertenece a otra temporada según el calendario son las de Epifanía y Cuaresma indicadas arriba; en 2024-2060 son 205 días (107 + 83 + 15).

### 6.4 Lo que falla en domingos de Navidad

- `christmasSunday` (1er domingo después de Navidad) imprime la colecta del libro para el 2º domingo de Navidad; la del 1er domingo ("Almighty God, you have poured upon us the new light of your incarnate Word", l.16837-16843) no está en ninguna clave. `christmasSunday2` imprime un texto híbrido que no es ninguno de los dos.
- Rúbrica del libro (l.16835-16836): si Navidad cae en domingo, el domingo siguiente es el 2º de Navidad o el Santo Nombre. El app llama a ese domingo `christmasSunday` (1.º): ocurre el 1 ene. de 2034, 2040, 2045 y 2051. En esos años el texto impreso, por coincidencia, es el del 2º domingo de Navidad.

## 7. Semana Santa, Triduo y Vigilia contra el español oficial

La versión española oficial (`LOC-10-10-23.md`) incluye estas colectas. Comparación por contenido, no por puntuación:

| Colecta | App (`propers.js`) | Español oficial (LOC) | Diferencias de contenido |
|---|---|---|---|
| Miércoles de Ceniza | l.43 | 14497-14502 | Falta la conclusión "que vive y reina contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos". El resto es estilo ("forma"/"haz", "obtengamos"/"podamos obtener"). |
| Domingo de Ramos (Eucaristía) | l.50 | 14801-14806 | App: "sigamos el ejemplo de su paciencia"; oficial: "caminemos en el camino de su sufrimiento". App: "nuestra carne"; oficial: "nuestra naturaleza". App: "en tu tierno amor hacia el género humano"; oficial: "por nosotros". Falta la conclusión larga. |
| Colecta de procesión de Ramos / Lunes Santo | no está | 14788-14791 | Ausente. |
| Jueves Santo | l.51 | 14863-14868 | App: "Dios Todopoderoso"; oficial: "Padre todopoderoso". App: "en memoria de él"; oficial: "en recuerdo agradecido de Jesucristo nuestro Salvador". Conclusión distinta ("el mismo Jesucristo nuestro Señor, que vive y reina… ahora y por siempre" frente a "y quien vive y reina… por los siglos de los siglos"). |
| Viernes Santo | l.52 | 14947-14950 | Sin diferencias de contenido (solo artículos: "los pecadores", "la Cruz"). |
| Sábado Santo | l.53 | 15251-15259 (dos opciones) | No es ninguna de las dos. Invocación distinta ("Dios Todopoderoso" frente a "Oh Dios, Creador del cielo y de la tierra"); añade "sepultados con él por el bautismo en su muerte" (no figura); petición final distinta ("la mañana de la resurrección" frente a "la llegada del tercer día, y resucitemos con Él a una vida nueva"). |
| Vigilia Pascual | no está | 15608-15612 | Ausente. |

Es decir: del Triduo, solo el Viernes Santo coincide con el español oficial; Ceniza, Jueves Santo y Ramos coinciden en sustancia con diferencias menores; el Sábado Santo es una versión distinta de la oficial; la Vigilia y los tres días entre Ramos y el Jueves Santo no tienen colecta propia.

Observación fuera del alcance de las colectas: el libro dice del Sábado Santo "There is no celebration of the Eucharist on this day" (l.16281); el app genera una Santa Eucaristía completa (con colecta) para ese día.

## 8. Hallazgos por gravedad

**Alta**

1. 40 colectas de tiempos móviles no son la que el libro asigna a ese día: Adviento 4; Navidad 1 y 2; Epifanía 2, 4, 5, 6, 7 y 8; Cuaresma 1-5; Pascua 2, 3 y 6; y 23 de los 27 Propios (todos salvo 13, 16, 17 y 29). Ver §2A.
2. En los Propios, 23 de 27 son incorrectos y hay colectas duplicadas entre claves distintas (`proper5`/`proper20`; `proper16`/`proper25`; `proper17`/`proper23`/`epiphany8`; `proper7` es la del Propio 2; `proper6`, `proper11`, `proper19`, `proper24` están desplazadas). Las ferias heredan el error.
3. Domingos de Cuaresma: ninguna correcta; el 5º imprime la oración del Viernes Santo.
4. 1.028 días (7,6 %) del barrido 2024-2060 reciben una colecta contraria a una rúbrica explícita del libro (§6.2): 107 tras Ceniza, 111 de Semana Santa, 222 de Semana de Pascua, 70 tras la Ascensión, 206 tras Pentecostés, 209 tras la Trinidad, 83 tras la Epifanía, 15 de Navidad y 5 domingos de Todos los Santos.
5. Todos los Santos en domingo (1 nov. 2026): el app imprime el Propio 26, cuyo texto no figura en el libro.
6. Ausencia de rúbricas o avisos en la UI: nada indica que la colecta es prestada ni "reconstruida de memoria".

**Media**

7. Variantes sustanciales: `epiphany1` (Bautismo), `easter` (Día de Pascua), `holySaturday`, y los santos `05-01`, `05-31`, `06-11`, `12-28`.
8. Colectas de santos con otro texto: `07-22`, `07-25`, `08-06`, `08-15`, `10-23`, `10-28`.
9. 35 colectas oficiales no tienen clave (§4), entre ellas 3 de Semana Santa, 6 de la Semana de Pascua, Nochebuena y la Vigilia.
10. Santo Nombre (`01-01`): texto de familia clásica pero no el del libro; la clave `circumcision` es huérfana (0 días en 2024-2060).

**Baja**

11. Conclusión abreviada: 64 de las 95 claves del app terminan sin la fórmula "…que vive y reina…". De las 49 colectas COINCIDE o VARIANTE, 27 terminan así y en 26 de ellas el libro sí imprime la fórmula larga (el Sábado Santo, 1ª opción, es corta también en el libro).
12. Parafraseos menores en Navidad, Epifanía, Pascua 5, Jueves Santo, San Marcos, San Esteban.
13. Coincidencias de inicio (`circumcision`/`01-01`, `epiphany8`/`proper17`, `transfiguration`/`08-06`, `proper5`/`proper20`): mismo texto repetido en claves distintas.

## 9. Ambigüedades y "No pude verificar"

**AMBIGUO (criterio mío, no de extracción)**

- *Pentecostés y Trinidad en ferias (l.17262-17269, p.614).* Interpreté que "los propios fechados de la semana" son los del Propio que corresponde a la fecha del domingo anterior (así los numera la tabla del leccionario, "Weekdays following the Sunday from May 8 to May 14", l.21082-21098). Requiere cotejo con el PDF p.614 y pp.724-725 para confirmar si debe aplicarse también a las ferias entre Pentecostés y Trinidad. Si solo aplicara a las ferias tras la Trinidad, los 206 días de la semana de Pentecostés dejarían de ser error y el total de errores de elección bajaría de 1.028 a 822.
- *Frontera VARIANTE/DISTINTA:* `05-31`, `06-11`, `12-28` y `05-01`. Si el criterio fuera más estricto pasarían a DISTINTA (media), lo que daría 10 VARIANTE y 50 DISTINTA.
- *Navidad en domingo (l.16835-16836):* el libro admite "Segundo Domingo de Navidad o Santo Nombre"; no determiné cuál es obligatoria.

**No pude verificar**

- El español oficial de las colectas del año (pp.598-640): el `LOC-10-10-23.md` llega hasta la p.596. Solo cotejé en español Ceniza, Ramos (ambas colectas), Jueves Santo, Viernes Santo, Sábado Santo y Vigilia. Para las 90 claves restantes comparé el texto español del app con el inglés oficial por sentido; no puedo decir si coincide con la traducción española oficial.
- El PDF: trabajé sobre la extracción markdown. Las 129 colectas del libro se leen limpias, con pies de página mezclados. La paginación que cito sale de los pies "NNN collects & occasional prayers"; no verifiqué visualmente cada página.
- Las referencias históricas ("clásica", "1662") que doy en las notas son identificación mía a partir del contenido; no son verificables con el libro.
- Si el BCP 2019 permite sustituir la colecta del día en otras circunstancias (misas votivas, ocasionales): busqué rúbricas con "Collect of the Day" y no hallé ninguna regla de sustitución para la Eucaristía dominical.
- No revisé el Oficio Diario ni las Oraciones Ocasionales más allá de lo necesario para identificar el origen de `easter6` y `proper21`.

## 10. Archivos de evidencia (todos en la carpeta de salida)

- `colectas-sim.js` — modo de colecta (propia / domingo / respaldo) por día; usa el `resolveCollectKey` real de `app.js`.
- `colectas-sim2.js` — barrido 2024-2060: claves emitidas sin colecta, claves de `COLLECTS` nunca emitidas (solo `circumcision`), cobertura de `FIXED_FEASTS`.
- `colectas-sim3.js` — clasificación clave por clave, función `bookSlot` con las rúbricas y veredicto por día; genera los CSV.
- `colectas-sim4.js` — Todos los Santos en domingo, 1 de enero en domingo, fiestas fijas en domingo.
- `colectas-sim5.js` / `colectas-sim6.js` — conclusiones abreviadas, textos duplicados, desglose por tipo de día.
- `colectas-grep.js` — búsqueda de frases distintivas del app dentro de pp.598-640 y del libro entero.
- `colectas-tabla.js` — genera las tablas 2A/2B (lee `propers.js` para los números de línea).
- `colectas-dias-2026.csv`, `colectas-dias-2027.csv` — un registro por día: clave del día, clave de colecta elegida, slot prescrito por el libro, veredicto.
