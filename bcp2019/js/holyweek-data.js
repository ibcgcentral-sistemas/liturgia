/**
 * holyweek-data.js — Liturgias de la Semana Santa (Libro de Oración Común 2019, ACNA).
 * GENERADO por bcp2019-tools/build-holyweek.js a partir del libro oficial en español (LOC-10-10-23.md); NO editar a
 * mano: test-bcp2019.js comprueba que sigue idéntico a lo que genera el script. Texto copiado, no traducido.
 * Procedencia: palmSundayPalms LOC l. 14728-14794; maundyThursdayOpening LOC l. 14844-14858; maundyThursdayFootWashing LOC l. 14875-14902; maundyThursdayClosing LOC l. 14903-14911; goodFriday LOC l. 14939-15244; holySaturday LOC l. 15248-15315; renewedCreed LOC l. 3283-3325; renewedPrayers LOC l. 3326-3365; renewedConfession LOC l. 3366-3409; renewedPeace LOC l. 3410-3413; renewedOffertory LOC l. 3414-3425; renewedSursum LOC l. 3426-3450; renewedConsecration LOC l. 3451-3494; renewedLordsPrayer LOC l. 3495-3515; renewedHumbleAccess LOC l. 3526-3542; renewedAgnusDei LOC l. 3543-3550; renewedAdministration LOC l. 3551-3567; renewedPostCommunion LOC l. 3568-3585; renewedBlessing LOC l. 3586-3595; renewedDismissal LOC l. 3596-3608; renewedDismissalAlleluia LOC l. 3609-3615; ashWednesdayOpening LOC l. 14474-14477; ashWednesdayInvitation LOC l. 14478-14502; ashWednesdayAshes LOC l. 14519-14568; ashWednesdayConfession LOC l. 14569-14649; ashWednesdayAbsolution LOC l. 14650-14685; ashWednesdayClosing LOC l. 14686-14697; easterVigilIntro LOC l. 15318-15337; easterVigilLight LOC l. 15341-15354; easterVigilCandle LOC l. 15677-15692 (recompuesta); easterVigilLightLit LOC l. 15355-15440; easterVigilReadings LOC l. 15441-15572; easterVigilWord LOC l. 15573-15631; easterVigilRenewal LOC l. 4835-4907; easterVigilContinues LOC l. 15632-15633; easterVigilBlessing LOC l. 15634-15641.
 * Tipos: T título, R rúbrica, P párrafo, V versos (líneas separadas por \n), REF cita bíblica, CEL/PUEBLO/DIAC/LECTOR/
 * OFIC/TODOS/OBISPO/PRES voces, LECTURAS = lugar donde el app inserta las lecturas del día.
 */
const BCP_HOLYWEEK_DATA = {
 "palmSundayPalms": [
  {
   "t": "T",
   "x": "LA LITURGIA DE LAS PALMAS"
  },
  {
   "t": "R",
   "x": "Cuando las circunstancias lo permitan, la Congregación podrá reunirse en un lugar aparte de la iglesia, para que todos entren en procesión a la iglesia. Las palmas u otros ramos para llevar en la procesión se pueden distribuir a las personas a medida que llegan, o después de la oración de bendición."
  },
  {
   "t": "R",
   "x": "Se dice o se canta el siguiente himno u otro himno adecuado."
  },
  {
   "t": "CEL",
   "x": "Hosanna al Hijo de David, Rey de Israel."
  },
  {
   "t": "PUEBLO",
   "x": "Bendito el que viene en el Nombre del Señor. Hosanna en las alturas."
  },
  {
   "t": "R",
   "x": "A continuación, el Celebrante saluda al pueblo y hace una breve introducción, invitándolo a participar en la celebración con estas u otras palabras similares"
  },
  {
   "t": "P",
   "x": "Queridos hermanos y hermanas, desde el comienzo de la Cuaresma hasta ahora hemos estado preparando nuestros corazones para el arrepentimiento y el sacrificio de uno mismo. Hoy, con toda la Iglesia, anunciamos el inicio de la celebración del misterio pascual. En este día Nuestro Señor Jesucristo entró en Jerusalén y fue recibido como Rey con palmas y gritos de alabanza. Hoy lo saludamos como nuestro Rey, aunque sabemos que su corona era una corona de espinas y su trono, una Cruz."
  },
  {
   "t": "P",
   "x": "Por lo tanto, los invito a seguir a nuestro Señor en esta Semana Santa, desde su entrada triunfal, pasando por su sufrimiento y muerte, hasta la gloria de su resurrección."
  },
  {
   "t": "CEL",
   "x": "El Señor esté con ustedes."
  },
  {
   "t": "PUEBLO",
   "x": "Y con tu espíritu."
  },
  {
   "t": "CEL",
   "x": "Oremos."
  },
  {
   "t": "P",
   "x": "Asístenos misericordiosamente con tu ayuda, oh Señor Dios de nuestra salvación, para que entremos con gozo en la contemplación de aquellos hechos poderosos, por los cuales nos has dado vida e inmortalidad; por Jesucristo nuestro Señor, que vive y reina contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén."
  },
  {
   "t": "R",
   "x": "Todos de pie, el Diácono o Presbítero lee el Evangelio de la Entrada Triunfal, diciendo primero"
  },
  {
   "t": "DIAC",
   "x": "El Santo Evangelio de nuestro Señor Jesucristo según ______________."
  },
  {
   "t": "PUEBLO",
   "x": "Gloria a ti, Señor Cristo."
  },
  {
   "t": "REF",
   "x": "Año A MATEO 21:1-11"
  },
  {
   "t": "REF",
   "x": "Año B MARCOS 11:1-11A"
  },
  {
   "t": "REF",
   "x": "Año C LUCAS 19:28-40"
  },
  {
   "t": "DIAC",
   "x": "El Evangelio del Señor."
  },
  {
   "t": "PUEBLO",
   "x": "Te alabamos, Cristo Señor."
  },
  {
   "t": "R",
   "x": "El Celebrante dice entonces"
  },
  {
   "t": "P",
   "x": "Oremos:"
  },
  {
   "t": "P",
   "x": "Nosotros te alabamos, Dios Todopoderoso, por las obras de amor con que nos has redimido por medio de tu Hijo Jesucristo nuestro Señor. En este día entró triunfante en la ciudad santa de Jerusalén, y fue aclamado como Rey por los que extendían sus mantos y ramos de palma a lo largo de su camino. Santifica estos ramos con tu bendición, te rogamos humildemente, para que sean para nosotros signos de su victoria."
  },
  {
   "t": "P",
   "x": "Concédenos que los que los llevamos en su Nombre lo aclamemos siempre como nuestro Rey, y lo sigamos en el camino que conduce a la vida eterna; que vive y reina contigo, en la unidad del Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén."
  },
  {
   "t": "R",
   "x": "El himno de apertura puede repetirse."
  },
  {
   "t": "CEL",
   "x": "Hosanna al Hijo de David, Rey de Israel."
  },
  {
   "t": "PUEBLO",
   "x": "Bendito el que viene en el Nombre del Señor. Hosanna en el cielo."
  },
  {
   "t": "T",
   "x": "LA PROCESIÓN"
  },
  {
   "t": "DIAC",
   "x": "Vayamos en paz."
  },
  {
   "t": "PUEBLO",
   "x": "En el Nombre de Cristo. Amén."
  },
  {
   "t": "R",
   "x": "Durante la procesión todos sostienen palmas o ramos, y se cantan himnos o antífonas apropiadas, tales como “Toda gloria, alabanza y honra” y el Salmo 118:19-29."
  },
  {
   "t": "R",
   "x": "En un lugar adecuado, la procesión puede detenerse mientras se dice la siguiente u otra oración apropiada."
  },
  {
   "t": "P",
   "x": "Dios todopoderoso, cuyo Hijo amadísimo no subió al gozo, sino que primero sufrió el dolor, y no entró en la gloria antes de ser crucificado: Concédenos misericordiosamente que, caminando por el camino de la Cruz, no encontremos otro, sino el camino de vida y paz; Por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "R",
   "x": "En la ausencia de un Obispo o Sacerdote, el servicio precedente puede ser dirigido por un diácono o un lector laico."
  }
 ],
 "maundyThursdayOpening": [
  {
   "t": "R",
   "x": "Esta liturgia se celebra por la tarde. Una procesión silenciosa puede reemplazar el himno procesional."
  },
  {
   "t": "CEL",
   "x": "Bendito sea nuestro Dios."
  },
  {
   "t": "PUEBLO",
   "x": "Ahora y por siempre. Amén."
  },
  {
   "t": "R",
   "x": "El Celebrante puede decir"
  },
  {
   "t": "P",
   "x": "Esta es la noche en que Cristo, el Hijo del Hombre, se reunió con sus discípulos en el Cenáculo."
  },
  {
   "t": "P",
   "x": "Esta es la noche en que Cristo nuestro Señor y Maestro tomó una toalla y lavó los pies de los discípulos, llamándonos a amarnos unos a otros como Él nos ha amado."
  },
  {
   "t": "P",
   "x": "Esta es la noche en que Cristo nuestro Dios nos dio esta santa fiesta, para que nosotros, los que comemos este pan y bebemos de este cáliz, proclamemos aquí su sacrificio perfecto."
  },
  {
   "t": "P",
   "x": "Esta es la noche en que Cristo, el Cordero de Dios, se entregó en manos de aquellos que lo matarían."
  }
 ],
 "maundyThursdayFootWashing": [
  {
   "t": "T",
   "x": "LAVATORIO DE LOS PIES"
  },
  {
   "t": "R",
   "x": "Cuando se observa, la ceremonia del lavatorio de pies sigue apropiadamente al sermón. Si se desea introducir la ceremonia con un breve discurso, se puede usar lo siguiente."
  },
  {
   "t": "P",
   "x": "Compañeros siervos de nuestro Señor Jesucristo: En la noche antes de su muerte, Jesús dio un ejemplo a sus discípulos al lavarles los pies, un acto de servicio humilde. Enseñó que la fuerza y el crecimiento en la vida del reino de Dios no provienen del poder y la autoridad mundanos, sino de un servicio humilde."
  },
  {
   "t": "P",
   "x": "Por lo tanto, los invito [a los que han sido nombrados representantes de la Congregación y] a los que participan del sacerdocio real de Cristo a que pasen al frente, para que recordemos de quién somos siervos siguiendo el ejemplo de nuestro Maestro."
  },
  {
   "t": "P",
   "x": "Vengan ahora recordando su advertencia de que lo que Él hace por ti, también tú lo harás a los demás. Graben en sus corazones y reflejen en sus acciones las palabras de Jesús: “Ningún siervo es más que su amo y ningún mensajero es más que el que lo envió. ¿Entienden esto? Dichosos serán si lo ponen en práctica."
  },
  {
   "t": "REF",
   "x": "(JUAN 13:16-17, NVI)"
  },
  {
   "t": "R",
   "x": "Durante la ceremonia, se pueden cantar o decir los siguientes u otros himnos o antífonas apropiados."
  },
  {
   "t": "P",
   "x": "El Señor Jesús, levantándose de la cena, se quitó las prendas exteriores, tomó una toalla y lavó los pies de sus discípulos. Entonces Él les dijo: “¿Entienden lo que he hecho con ustedes? Ustedes me llaman Maestro y Señor, y dicen bien, porque lo soy. Pues, si yo, el Señor y el Maestro, les he lavado los pies, también ustedes deben lavarse los pies los unos a los otros.\""
  },
  {
   "t": "REF",
   "x": "JUAN 13:12, 14 (NVI)"
  },
  {
   "t": "P",
   "x": "“Este mandamiento nuevo les doy: que se amen los unos a los otros. Así como yo los he amado, también ustedes deben amarse los unos a los otros”."
  },
  {
   "t": "REF",
   "x": "JUAN 13:34 (NVI)"
  },
  {
   "t": "R",
   "x": "La liturgia continúa con las Oraciones del Pueblo."
  }
 ],
 "maundyThursdayClosing": [
  {
   "t": "R",
   "x": "Cuando se desee administrar la Santa Comunión el Viernes Santo, el Sacramento para ese propósito se consagra en este servicio."
  },
  {
   "t": "R",
   "x": "Se utiliza el Prefacio del Jueves Santo."
  },
  {
   "t": "R",
   "x": "Si el Despojo del Altar se observa como una ceremonia pública, se lleva a cabo al final de la liturgia del Jueves Santo."
  },
  {
   "t": "R",
   "x": "Puede hacerse en silencio, o puede ir acompañada de la recitación del Salmo 22, que se canta o se dice sin el Gloria Patri."
  },
  {
   "t": "R",
   "x": "Se omiten la bendición final y la despedida. La Congregación se marcha en silencio."
  }
 ],
 "goodFriday": [
  {
   "t": "R",
   "x": "En este día los ministros entran en silencio."
  },
  {
   "t": "R",
   "x": "Luego todos se arrodillan para orar en silencio."
  },
  {
   "t": "R",
   "x": "El Oficiante se levanta y puede decir"
  },
  {
   "t": "V",
   "x": "Todos nosotros nos descarriamos como ovejas;\nNos hemos ido cada uno por nuestro propio camino,"
  },
  {
   "t": "PUEBLO",
   "x": "Pero el Señor hizo recaer sobre Él la iniquidad de todos nosotros. ."
  },
  {
   "t": "R",
   "x": "El Oficiante dice"
  },
  {
   "t": "P",
   "x": "Oremos:"
  },
  {
   "t": "P",
   "x": "Dios todopoderoso, te rogamos que mires compasivamente a esta tu familia, por la cual nuestro Señor Jesucristo estuvo dispuesto a ser traicionado y entregado en manos de los pecadores, y sufrir la muerte en la Cruz; que ahora vive y reina contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén."
  },
  {
   "t": "LECTURAS"
  },
  {
   "t": "T",
   "x": "EL SERMÓN"
  },
  {
   "t": "R",
   "x": "Se puede cantar un himno."
  },
  {
   "t": "T",
   "x": "LAS COLECTAS SOLEMNES"
  },
  {
   "t": "R",
   "x": "Todos de pie, dice el Oficiante"
  },
  {
   "t": "P",
   "x": "Amado Pueblo de Dios: Nuestro Padre celestial envió a su Hijo al mundo, no para condenar al mundo, sino para que el mundo sea salvo por Él; para que todos los que creen en Él sean librados del poder del pecado y de la muerte, y sean coherederos con El de la vida eterna."
  },
  {
   "t": "P",
   "x": "Oramos, por tanto, por las personas de todas partes de acuerdo con sus necesidades."
  },
  {
   "t": "R",
   "x": "Las peticiones pueden ser leídas por un Diácono u otra persona designada. El Oficiante dice las Colectas. Se puede indicar a la gente que se pongan de pie o se arrodillen."
  },
  {
   "t": "P",
   "x": "Oremos por la santa Iglesia en todo el mundo: para que el Señor nuestro Dios la conserve en la unidad, la paz y la seguridad, poniendo en sujeción divina todos los poderes y principados; y que nos conceda habitar en tal paz y tranquilidad que podamos manifestar la gloria de Dios."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Padre Todopoderoso, oramos por tu santa Iglesia católica. Llénala con toda verdad, en toda verdad, con toda la paz. Donde esté corrupta, purifícala; donde esté en error, dirígela; donde en algo está mal, refórmala; donde está bien, fortalécela; donde esté en necesidad, provéela; donde se divide, júntala; por Jesucristo tu Hijo nuestro Salvador. Amén."
  },
  {
   "t": "P",
   "x": "Oremos por N. nuestro Obispo y por N. nuestro Arzobispo: que el Señor nuestro Dios, que los ha puesto en este cargo, los conserve en salud y seguridad para el gobierno del pueblo santo de Dios."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Dios todopoderoso y eterno, cuyo juicio sustenta todas las cosas, tanto en el cielo como en la tierra: así como has designado a estos tus siervos para que sean nuestros Obispos, así también defiéndelos con tu misericordia contra todas las adversidades; que nosotros, reconociéndote como el gran Pastor y Guardián de nuestras almas, podamos prosperar tanto por su cuidado que podamos propagar el fruto de justicia; Por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "P",
   "x": "Oremos por todos los Obispos, Sacerdotes y Diáconos; y por todo el Pueblo santo de Dios."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Dios todopoderoso y eterno, por cuyo Espíritu es gobernado y santificado todo el cuerpo de tu pueblo fiel: Recibe nuestras súplicas y oraciones que te presentamos por todos los miembros de tu santa Iglesia, para que en su vocación y ministerio te sirvan verdadera y devotamente; por nuestro Señor y Salvador Jesucristo. Amén."
  },
  {
   "t": "P",
   "x": "Oremos por N. nuestro Presidente/Soberano/Primer Ministro, y por todos en la Autoridad Civil; que ellos, sabiendo de quién son ministros, busquen sobre todas las cosas el honor y la gloria de Dios; y que nosotros, recordando de quién es la autoridad que tienen, los honremos fiel y obedientemente de acuerdo con la santa Palabra de Dios."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Dios Todopoderoso, cuyo reino es eterno y cuyo poder es infinito: Encomendamos nuestra nación a tu cuidado misericordioso, para que, guiados por tu Providencia, podamos morar seguros en tu paz. Concede a nuestro Presidente/Soberano/Primer Ministro, y a todos en autoridad, sabiduría y fuerza para saber y hacer tu voluntad. Llénalos del amor a la verdad y la justicia; y hazlos siempre conscientes de su llamado a servir a este pueblo en tu temor; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "P",
   "x": "Oremos por los que se preparan para el Santo Bautismo (especialmente _________ ): para que el Señor nuestro Dios abra sus corazones a su gracia y misericordia; que por el lavado de regeneración puedan obtener la remisión de todos sus pecados, y ser hallados siervos fieles de nuestro Señor Jesucristo."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Dios todopoderoso y eterno, que multiplicas tu Iglesia en cada generación: Concede los dones de la fe y el entendimiento a los que se instruyen en tu santa Palabra; que, siendo lavados en las aguas del Bautismo, puedan nacer de nuevo y contarse entre tus hijos adoptivos; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "P",
   "x": "Oremos a Dios Padre Todopoderoso, que limpie el mundo de todo mal; líbralo de la pestilencia y del hambre; libera a los que están en cautiverio; restaura la salud de los enfermos; y lleva a los que viajan a un refugio de seguridad."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Dios misericordioso, el consuelo de todos los apesadumbrados, la fortaleza de todos los que sufren: Deja que el clamor de los que están en la miseria y la necesidad llegue a ti, para que encuentren tu misericordia presente con ellos en todas sus aflicciones; y danos, te rogamos, la fuerza para servirles por amor de aquel que sufrió por nosotros, tu Hijo Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "P",
   "x": "Oremos por todos los que están en herejía o cisma: que el Señor nuestro Dios los libre de toda falsa doctrina y los restaure en la fe y la unidad de la única, santa Iglesia católica y apostólica."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Oh Dios de verdad y de amor, que no deseas la muerte de los pecadores, sino que se aparten de su maldad y vivan: Mira con misericordia a los que son engañados por las mentiras del mundo, del demonio y de la carne; para que los corazones de los que se han descarriado sean restaurados a la sabiduría y regresen al camino de la verdad en la unidad de tu santa Iglesia; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "P",
   "x": "Oremos por el pueblo judío: para que el Señor nuestro Dios los mire con misericordia, y que lleguen a conocer a Jesús como el Mesías, y como el Señor de todos."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Dios todopoderoso y eterno, tú estableciste tu alianza con Abraham y su simiente: Escucha las oraciones de tu Iglesia, para que el pueblo a través del cual trajiste bendición al mundo reciba también la bendición de la salvación, por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "P",
   "x": "Oremos por todos aquellos que no creen en Cristo, para que el Espíritu Santo los ilumine a través del Evangelio y los lleve al camino de la salvación."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Dios misericordioso, creador de todos los pueblos de la tierra y amante de las almas: Ten compasión de todos los que no te conocen tal como te revelas en tu Hijo Jesucristo; que tu Evangelio sea predicado con gracia y poder a aquellos que no lo han oído; vuelve el corazón de los que lo resisten; y trae de nuevo a tu redil a los que se han descarriado; para que haya un solo rebaño bajo un solo Pastor, Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "P",
   "x": "Encomendémonos a nuestro Dios, y oremos por la gracia de una vida santa, para que, con todos los que han muerto en la paz de Cristo, y aquellos cuya fe sólo Dios conoce, seamos tenidos por dignos de entrar en la plenitud del gozo de nuestro Señor, y recibir la corona de la vida en el día de la resurrección."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "P",
   "x": "Oh Dios de poder inmutable y luz eterna: Mira favorablemente a toda tu Iglesia, ese misterio maravilloso y sagrado; por la obra eficaz de tu providencia, lleva a cabo con tranquilidad el plan de salvación; que todo el mundo vea y sepa que lo que estaba derribado se levanta, y lo que se había envejecido se hace nuevo, y que todas las cosas están siendo perfeccionadas por aquel por quien todas las cosas fueron hechas, por tu Hijo Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "R",
   "x": "Pueden seguir devociones apropiadas, que pueden incluir cualquiera o todas las siguientes. Si se desea, la liturgia puede terminar aquí con el canto de un himno o antífona, el Padrenuestro y la Oración Final."
  },
  {
   "t": "T",
   "x": "DEVOCIÓN ANTE LA CRUZ"
  },
  {
   "t": "R",
   "x": "Ahora se puede traer una cruz de madera a la iglesia y colocarla a la vista de la gente. La siguiente antífona se puede decir o cantar tres veces mientras se descubre la cruz."
  },
  {
   "t": "P",
   "x": "He aquí el madero de la Cruz, sobre el cual fue colgada la Salvación del mundo."
  },
  {
   "t": "PUEBLO",
   "x": "Venid, y adoremos."
  },
  {
   "t": "R",
   "x": "Se pueden decir o cantar los siguientes himnos u otros himnos adecuados."
  },
  {
   "t": "T",
   "x": "IMPROPERIOS"
  },
  {
   "t": "V",
   "x": "Pueblo mío, ¿qué te he hecho?\n¿En qué te he ofendido? Respóndeme.\nYo te saqué de la tierra de la servidumbre,\ny te conduje a través de las aguas de la salvación,\ny tú has preparado una Cruz para tu Salvador.\nSanto Dios,\nSanto y Poderoso,\nSanto Inmortal,\nTen piedad de nosotros."
  },
  {
   "t": "V",
   "x": "Yo los conduje por el desierto cuarenta años,\ny los sustenté con el pan del cielo;\nYo te traje a la tierra de promisión,\ny tú has preparado una Cruz para tu Salvador.\nSanto Dios,\nSanto y Poderoso,\nSanto Inmortal,\nTen piedad de nosotros."
  },
  {
   "t": "V",
   "x": "¿Qué podría haber hecho por ti que no haya hecho?\nYo te planté, viña mía, para que des frutos dulces;\npero te has vuelto muy amargo conmigo,\ny me diste vinagre para mi sed.\nSanto Dios,\nSanto y Poderoso,\nSanto Inmortal,\nTen piedad de nosotros."
  },
  {
   "t": "V",
   "x": "Yo pasé por alto a tus primogénitos y los libré de la muerte,\ny tú me entregaste en manos de mis enemigos;\nYo te conduje en la columna de nube,\ny me has conducido al pretorio de Pilato.\nPueblo mío, ¿qué te he hecho?\n¿En qué te he ofendido? Respóndeme.\nSanto Dios,\nSanto y Poderoso,\nSanto Inmortal,\nTen piedad de nosotros."
  },
  {
   "t": "V",
   "x": "Yo maté a los reyes de los cananeos por causa de ustedes,\ny ustedes me hirieron en la cabeza con una caña;\nTe di una herencia real,\ny coronaste mi cabeza con espinas.\nPueblo mío, ¿qué te he hecho?\n¿En qué te he ofendido? Respóndeme.\nSanto Dios,\nSanto y Poderoso,\nSanto Inmortal,\nTen piedad de nosotros."
  },
  {
   "t": "V",
   "x": "Yo abrí la peña y te di a beber del agua de la vida,\ny tú abriste mi costado con una lanza.\nTe elevé en lo alto con gran poder,\ny me has colgado en lo alto de la Cruz.\nOh mi iglesia, ¿qué te he hecho?\n¿En qué te he ofendido? Respóndeme.\nSanto Dios,\nSanto y Poderoso,\nSanto Inmortal,\nTen piedad de nosotros."
  },
  {
   "t": "REF",
   "x": "HIMNO 1"
  },
  {
   "t": "V",
   "x": "Nos gloriamos en tu Cruz, oh Señor,\ny alabamos y glorificamos tu santa resurrección;\nporque en virtud de tu Cruz\nalegría ha venido a todo el mundo."
  },
  {
   "t": "V",
   "x": "Que Dios tenga misericordia de nosotros y nos bendiga,\nmuestre la luz de su rostro, y venga a nosotros.\nSean conocidos en la tierra tus caminos,\ntu salud salvadora entre todas las naciones.\nQue los pueblos te alaben, oh Dios;\nque todos los pueblos te alaben."
  },
  {
   "t": "V",
   "x": "Nos gloriamos en tu Cruz, oh Señor,\ny alabamos y glorificamos tu santa resurrección;\nporque en virtud de tu Cruz\nalegría ha venido a todo el mundo."
  },
  {
   "t": "REF",
   "x": "HIMNO 2"
  },
  {
   "t": "V",
   "x": "Te adoramos, oh Cristo, y te bendecimos,\nporque por tu santa Cruz redimiste al mundo."
  },
  {
   "t": "V",
   "x": "Si hemos muerto con Él, también con Él viviremos;\nsi perseveramos con Él, también con Él reinaremos."
  },
  {
   "t": "V",
   "x": "Te adoramos, oh Cristo, y te bendecimos,\nporque por tu santa Cruz redimiste al mundo."
  },
  {
   "t": "R",
   "x": "Entonces se puede cantar el himno “Canta, lengua mía, la batalla gloriosa”, u otro himno que exalte la gloria de la Cruz."
  },
  {
   "t": "R",
   "x": "En ausencia de un Obispo o un Presbítero, todo lo que precede puede ser dirigido por un Diácono o un lector laico."
  },
  {
   "t": "T",
   "x": "DISTRIBUCIÓN DE LA COMUNIÓN"
  },
  {
   "t": "R",
   "x": "El rito de la Santa Eucaristía no se celebra en este día."
  },
  {
   "t": "R",
   "x": "Si no hay Comunión, la liturgia continúa con la Oración Final."
  },
  {
   "t": "R",
   "x": "Si la Comunión se va a administrar a partir de elementos previamente consagrados, se observará el siguiente orden."
  },
  {
   "t": "R",
   "x": "El Diácono u otra persona designada dice lo siguiente"
  },
  {
   "t": "P",
   "x": "Todos los que verdaderamente y con fervor se arrepientan de sus pecados, y busquen reconciliarse con su prójimo, y se propongan llevar una vida nueva, siguiendo los mandamientos de Dios y andando en sus santos caminos: acérquense con fe y hagan su humilde confesión a Dios Todopoderoso."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "R",
   "x": "El Diácono y el Pueblo se arrodillan como puedan y rezan"
  },
  {
   "t": "V",
   "x": "Dios todopoderoso, Padre de nuestro Señor Jesucristo,\nhacedor y juez de todos nosotros:\nReconocemos y lamentamos nuestros muchos pecados y ofensas,\nque hemos cometido de pensamiento, palabra y obra\ncontra vuestra divina majestad,\nprovocando merecidamente tu justa ira contra nosotros.\nEstamos profundamente apenados por estas nuestras transgresiones;\nla carga de ellas es más de lo que podemos soportar.\nTen misericordia de nosotros,\nTen misericordia de nosotros, misericordiosísimo Padre;\npor tu Hijo nuestro Señor Jesucristo,\nperdónanos todo lo pasado;\ny concédenos que siempre podamos servirte y agradarte en una vida nueva,\npara honra y gloria de tu Nombre;\npor nuestro Señor Jesucristo. Amén."
  },
  {
   "t": "R",
   "x": "El Obispo o Sacerdote se pone de pie y dice"
  },
  {
   "t": "P",
   "x": "Dios omnipotente, nuestro Padre celestial, que en su gran misericordia ha prometido el perdón de pecados a todos los que con sincero arrepentimiento y verdadera fe se vuelven a él, tenga misericordia de ustedes, los perdone y los libere de todos sus pecados, los confirme y los fortalezca en toda virtud, y los conduzca a la vida eterna; mediante Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "R",
   "x": "El Oficiante entonces dice"
  },
  {
   "t": "P",
   "x": "Y ahora, oremos como nuestro Salvador Jesucristo nos enseñó, y nosotros nos atrevemos a decir:"
  },
  {
   "t": "R",
   "x": "El Oficiante y el Pueblo rezan juntos el Padrenuestro. La doxología final se suele omitir."
  },
  {
   "t": "V",
   "x": "Padre Nuestro que estás en el cielo,\nsantificado sea tu Nombre,\nvenga tu reino,\nhágase tu voluntad,\nen la tierra como en el cielo.\nDanos hoy nuestro pan de cada día.\nPerdona nuestras ofensas,\ncomo también nosotros perdonamos a los que\nnos ofenden.\nNo nos dejes caer en tentación\ny líbranos del mal.\nPorque tuyo es el reino,\ntuyo es el poder,\ny tuya es la gloria,\nahora y por siempre. Amén."
  },
  {
   "t": "R",
   "x": "Frente al Pueblo, el Oficiante puede hacer la siguiente invitación"
  },
  {
   "t": "P",
   "x": "¡Aquí tienen al Cordero de Dios, que quita el pecado del mundo!"
  },
  {
   "t": "REF",
   "x": "JUAN 1:29 (NVI)"
  },
  {
   "t": "R",
   "x": "Los Ministros reciben el Sacramento, e inmediatamente lo entregan al Pueblo."
  },
  {
   "t": "T",
   "x": "ORACIÓN CONCLUSIVA"
  },
  {
   "t": "R",
   "x": "Si el Padrenuestro no se ha dicho todavía, se dice aquí. La doxología final se suele omitir."
  },
  {
   "t": "R",
   "x": "El servicio siempre concluye con la siguiente oración. No se añade ninguna bendición o despedida."
  },
  {
   "t": "P",
   "x": "Señor Jesucristo, Hijo del Dios vivo, te rogamos que pongas tu pasión, cruz y muerte entre tu juicio y nuestras almas, ahora y en la hora de nuestra muerte. Da misericordia y gracia a los vivos; paz y descanso a los muertos; a tu santa Iglesia unidad y concordia; y a nosotros pecadores vida eterna y gloria; porque con el Padre y el Espíritu Santo vives y reinas, un solo Dios, ahora y por los siglos de los siglos. Amén."
  },
  {
   "t": "R",
   "x": "Los Ministros y el Pueblo se van en silencio."
  }
 ],
 "holySaturday": [
  {
   "t": "R",
   "x": "No hay celebración de la Eucaristía en este día."
  },
  {
   "t": "R",
   "x": "El Oficiante dice"
  },
  {
   "t": "P",
   "x": "Oremos."
  },
  {
   "t": "P",
   "x": "Oh Dios, Creador del cielo y de la tierra: Concede que, así como el Cuerpo crucificado de tu amado Hijo fue puesto en el sepulcro y descansó en este santo sábado, esperemos con Él la llegada del tercer día, y resucitemos con Él a una vida nueva; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "R",
   "x": "o esto"
  },
  {
   "t": "P",
   "x": "Oh Dios de los vivos, en este día tu Hijo nuestro Salvador descendió al lugar de los muertos: Mira con bondad a todos nosotros que aguardamos con esperanza la liberación de la corrupción del pecado y la muerte; y, danos una porción de la gloria de los hijos de Dios; por Jesucristo tu Hijo nuestro Señor. Amén."
  },
  {
   "t": "LECTURAS"
  },
  {
   "t": "R",
   "x": "Después del Evangelio, puede seguir una homilía."
  },
  {
   "t": "R",
   "x": "Luego se canta o dice lo siguiente."
  },
  {
   "t": "T",
   "x": "EL HIMNO"
  },
  {
   "t": "V",
   "x": "El hombre nacido de mujer tiene poco tiempo de vida,\ny está lleno de miseria.\nBrota y se corta como una flor;\nhuye como una sombra,\ny nunca sigue igual."
  },
  {
   "t": "V",
   "x": "En medio de la vida estamos en la muerte:\n¿de quién buscamos la fuerza?\npero tú, oh Señor,\n¿Quién justamente está disgustado por nuestros pecados?\nSin embargo, Señor Dios santísimo,\nSeñor todopoderoso,\nOh santo y misericordioso Salvador,\nLíbranos de caer en los dolores de la muerte eterna."
  },
  {
   "t": "V",
   "x": "Ya sabes, Oh Señor, los secretos de nuestro corazón;\nno cierres tus oídos a nuestra oración;\npero perdónanos, Señor Santísimo,\nDios Todopoderoso,\nOh santo y misericordioso Salvador,\nMuy digno Juez eterno,\nno permitas, en esa nuestra hora final,\nal pasar el dolor de la muerte, que nos apartemos de ti."
  },
  {
   "t": "R",
   "x": "El Oficiante y el Pueblo rezan juntos el Padre Nuestro. La doxología final se suele omitir."
  },
  {
   "t": "V",
   "x": "Padre Nuestro que estás en el cielo,\nsantificado sea tu Nombre,\nvenga tu reino,\nhágase tu voluntad,\nen la tierra como en el cielo.\nDanos hoy nuestro pan de cada día.\nPerdona nuestras ofensas,\ncomo también nosotros perdonamos a los que\nnos ofenden.\nNo nos dejes caer en tentación\ny líbranos del mal.\nPorque tuyo es el reino,\ntuyo es el poder,\ny tuya es la gloria,\nahora y por siempre. Amén."
  },
  {
   "t": "R",
   "x": "El Oficiante concluye"
  },
  {
   "t": "P",
   "x": "Que la gracia del Señor Jesucristo, el amor de Dios y la comunión del Espíritu Santo sean con todos ustedes. Amén."
  },
  {
   "t": "REF",
   "x": "2 CORINTIOS 13:14 (NVI)"
  }
 ],
 "renewedCreed": [
  {
   "t": "T",
   "x": "EL CREDO NICENO"
  },
  {
   "t": "P",
   "x": "Los domingos, otros días festivos importantes y otras horas señaladas, todos se ponen de pie para recitar el Credo de Nicea, diciendo el Celebrante primero: Confesemos nuestra fe en las palabras del Credo Niceno:"
  },
  {
   "t": "R",
   "x": "Celebrante y gente"
  },
  {
   "t": "V",
   "x": "Creemos en un solo Dios,\nPadre todopoderoso,\ncreador del cielo y tierra,\nde todo lo visible e invisible.\nCreemos en un solo Señor Jesucristo,\nHijo único de Dios,\nnacido del Padre antes de todos los siglos:\nDios de Dios, luz de luz, Dios verdadero de\nDios verdadero, engendrado, no creado,\nde la misma naturaleza que el Padre\npor quien todo fue hecho;\nque por nosotros y por nuestra salvación\nbajo del cielo: por obra del Espíritu Santo se\nencarnó de María, la Virgen, y se hizo hombre.\nPor nuestra causa fue crucificado en tiempo\nde Poncio Pilato: padeció y fue sepultado.\nResucitó al tercer día según las escrituras;\nsubió al cielo, y está sentado a la derecha del Padre.\nDe nuevo vendrá con gloria para juzgar a vivos y muertos,\ny su reino no tendrá fin.\nCreemos en el Espíritu Santo, Señor y dador de vida,\nque procede del Padre y del Hijo;\nque con el Padre y el Hijo recibe una misma\nadoración y gloria, y que habló por los profetas.\nCreemos en la Iglesia,\nque es una, Santa, católica y apostólica.\nConfesamos un solo Bautismo\npara el perdón de los pecados.\nEsperamos la resurrección de los muertos\ny la vida del mundo futuro. Amén."
  },
  {
   "t": "P",
   "x": "† La frase “y el Hijo” (latín filioque) no está en el texto griego original. Véase la resolución del Colegio Episcopal sobre el filioque en Fundamentos Documentales (pág. 768)"
  }
 ],
 "renewedPrayers": [
  {
   "t": "T",
   "x": "ORACIONES DE LOS FIELES"
  },
  {
   "t": "R",
   "x": "El diácono u otra persona designada dice estas oraciones, o las oraciones de los fieles en el Texto Anglicano Estándar."
  },
  {
   "t": "P",
   "x": "El lector hace una pausa después de cada oración, y la gente puede agregar peticiones, ya sea en silencio o en voz alta."
  },
  {
   "t": "P",
   "x": "Oremos por la Iglesia y por el mundo, diciendo, \"Escucha nuestra oración\"."
  },
  {
   "t": "P",
   "x": "Por la paz del mundo entero, y por el bienestar y la unidad del pueblo de Dios."
  },
  {
   "t": "LECTOR",
   "x": "Señor, en tu misericordia:"
  },
  {
   "t": "PUEBLO",
   "x": "Escucha nuestra oración."
  },
  {
   "t": "P",
   "x": "Por N., nuestro Arzobispo, y N., nuestro Obispo, y por todos los clérigos y por toda la gente de nuestra Diócesis y Congregación."
  },
  {
   "t": "LECTOR",
   "x": "Señor, en tu misericordia:"
  },
  {
   "t": "PUEBLO",
   "x": "Escucha nuestra oración."
  },
  {
   "t": "P",
   "x": "Por todos los que proclaman el Evangelio aquí y en el extranjero; y por todos aquellos que enseñan y hacen discípulos."
  },
  {
   "t": "LECTOR",
   "x": "Señor, en tu misericordia:"
  },
  {
   "t": "PUEBLO",
   "x": "Escucha nuestra oración."
  },
  {
   "t": "P",
   "x": "Por nuestros hermanos y hermanas en Cristo que sufren persecución por su fe."
  },
  {
   "t": "LECTOR",
   "x": "Señor, en tu misericordia:"
  },
  {
   "t": "PUEBLO",
   "x": "Escucha nuestra oración."
  },
  {
   "t": "P",
   "x": "Por nuestro País, por los que ocupan posiciones de autoridad, y por todos los que sirven en el sector público [especialmente a ]."
  },
  {
   "t": "LECTOR",
   "x": "Señor, en tu misericordia:"
  },
  {
   "t": "PUEBLO",
   "x": "Escucha nuestra oración."
  },
  {
   "t": "P",
   "x": "Por todos aquellos que se encuentran en dificultades, angustias, necesidades, enfermedades o en cualquier otra adversidad [especialmente a _____]."
  },
  {
   "t": "LECTOR",
   "x": "Señor, en tu misericordia:"
  },
  {
   "t": "PUEBLO",
   "x": "Escucha nuestra oración."
  },
  {
   "t": "P",
   "x": "Por todos aquellos que han partido de esta vida en la esperanza segura de la resurrección, [especialmente a _____,] con corazones agradecidos, oremos."
  },
  {
   "t": "LECTOR",
   "x": "Señor, en tu misericordia:"
  },
  {
   "t": "PUEBLO",
   "x": "Escucha nuestra oración."
  },
  {
   "t": "R",
   "x": "Se pueden agregar peticiones adicionales. También se pueden invitar acciones de gracias."
  },
  {
   "t": "R",
   "x": "El Celebrante concluye con esta u otra Colecta apropiada."
  },
  {
   "t": "P",
   "x": "Padre Celestial, concede estas nuestras oraciones por amor a Jesucristo, nuestro único Mediador y Abogado, que vive y reina contigo en la unidad del Espíritu Santo, un solo Dios, ahora y por siempre. Amén."
  },
  {
   "t": "R",
   "x": "El Celebrante puede entonces decir la Exhortación."
  }
 ],
 "renewedConfession": [
  {
   "t": "T",
   "x": "LA CONFESIÓN Y ABSOLUCIÓN DE LOS PECADOS"
  },
  {
   "t": "R",
   "x": "El Diácono u otra persona designada dice lo siguiente"
  },
  {
   "t": "P",
   "x": "Confesemos humildemente nuestros pecados a Dios Todopoderoso."
  },
  {
   "t": "R",
   "x": "Silencio"
  },
  {
   "t": "R",
   "x": "El Diácono y el pueblo se arrodillan como pueden y rezan"
  },
  {
   "t": "V",
   "x": "Dios de gran misericordia,\nconfesamos que hemos pecado contra ti\nen pensamiento, palabra y obra,\npor lo que hemos hecho, y lo que hemos dejado de hacer.\nNo te hemos amado con todo el corazón;\nno hemos amado a nuestro prójimo como a nosotros mismos.\nEstamos apenados y humildemente nos arrepentimos.\nPor amor de tu Hijo Jesucristo,\nten piedad de nosotros y perdónanos;\npara que disfrutemos de hacer tu voluntad,\ny andar por tus caminos,\npara gloria de tu nombre. Amén."
  },
  {
   "t": "R",
   "x": "El obispo o sacerdote se pone de pie y dice"
  },
  {
   "t": "P",
   "x": "Dios omnipotente, nuestro Padre celestial, que en su gran misericordia ha prometido el perdón de pecados a todos los que con sincero arrepentimiento y verdadera fe se vuelven a él, tenga misericordia de ustedes, los perdone y los libere de todos sus pecados, los confirme y los fortalezca en toda virtud, y los conduzca a la vida eterna; mediante Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "PALABRAS RECONFORTANTES"
  },
  {
   "t": "R",
   "x": "El Celebrante puede entonces decir una o más de las siguientes oraciones, primero diciendo"
  },
  {
   "t": "P",
   "x": "Escuchen la Palabra de Dios, todos los que verdaderamente se vuelven a él. Vengan a mí, todos ustedes que están cansados y agobiados, y yo les daré descanso."
  },
  {
   "t": "REF",
   "x": "MATEO 11:28 (NVI)"
  },
  {
   "t": "P",
   "x": "Porque tanto amó Dios al mundo, que dio a su Hijo unigénito, para que todo aquel que cree en él no se pierda, sino que tenga vida eterna."
  },
  {
   "t": "REF",
   "x": "JOHN 3:16 (NVI)"
  },
  {
   "t": "P",
   "x": "Este mensaje es digno de crédito y merece ser aceptado por todos: que Cristo Jesús vino al mundo a salvar a los pecadores."
  },
  {
   "t": "REF",
   "x": "1 TIMOTEO 1:15 (NVI)"
  },
  {
   "t": "P",
   "x": "Si Mis queridos hijos, les escribo estas cosas para que no pequen. Pero, si alguno peca, tenemos ante el Padre a un intercesor, a Jesucristo, el Justo. Él es el sacrificio por el perdón de nuestros pecados, y no solo por los nuestros, sino por los de todo el mundo."
  },
  {
   "t": "REF",
   "x": "1 JUAN 2: 1-2 (NVI)"
  }
 ],
 "renewedPeace": [
  {
   "t": "T",
   "x": "LA PAZ"
  },
  {
   "t": "CEL",
   "x": "La paz del Señor esté siempre con ustedes."
  },
  {
   "t": "PUEBLO",
   "x": "Y con tu espíritu."
  },
  {
   "t": "R",
   "x": "Entonces los Ministros y el Pueblo podrán saludarse en el Nombre del Señor."
  }
 ],
 "renewedOffertory": [
  {
   "t": "T",
   "x": "EL OFERTORIO"
  },
  {
   "t": "R",
   "x": "El Celebrante puede comenzar el Ofertorio con uno de los versículos proporcionados en las Escrituras."
  },
  {
   "t": "R",
   "x": "Durante el ofertorio se puede cantar un himno, salmo o antífona. El Diácono o Sacerdote prepara la Santa Mesa para la celebración. Representantes de la congregación pueden traer al diácono o al sacerdote las ofrendas de pan y vino del pueblo, dinero u otras donaciones."
  },
  {
   "t": "R",
   "x": "El Pueblo se pone de pie mientras se presentan las ofrendas. Se puede decir lo siguiente:"
  },
  {
   "t": "CEL",
   "x": "Tuyos son, Señor, la grandeza, y el poder, la gloria, la victoria y la majestad; Tuyo es todo cuanto hay en el cielo y en la tierra; Tuyo también es el Reino, y tú estás por encima de todo. Todas las cosas proceden de Ti, Señor,"
  },
  {
   "t": "PUEBLO",
   "x": "Y lo que te hemos dado, de Ti lo hemos recibido."
  },
  {
   "t": "REF",
   "x": "1 CRÓNICAS 29:11, 14 (NVI)"
  }
 ],
 "renewedSursum": [
  {
   "t": "T",
   "x": "EL SURSUM CORDA"
  },
  {
   "t": "R",
   "x": "El Pueblo permanece de pie. El Celebrante frente a ellos canta o dice"
  },
  {
   "t": "P",
   "x": "El Señor esté con ustedes"
  },
  {
   "t": "PUEBLO",
   "x": "Y con tu espíritu."
  },
  {
   "t": "CEL",
   "x": "Levantemos el corazón."
  },
  {
   "t": "PUEBLO",
   "x": "Lo tenemos levantado hacia el Señor."
  },
  {
   "t": "CEL",
   "x": "Demos gracias al Señor nuestro Dios."
  },
  {
   "t": "PUEBLO",
   "x": "Es justo darle gracias y alabarlo."
  },
  {
   "t": "R",
   "x": "El Celebrante continúa"
  },
  {
   "t": "P",
   "x": "Es justo, nuestro deber y nuestro gozo, siempre y en todo lugar darte gracias, Padre Todopoderoso, Creador del cielo y de la tierra."
  },
  {
   "t": "PREFACIO"
  },
  {
   "t": "P",
   "x": "Por lo tanto, nosotros te alabamos, uniendo nuestras voces a los Ángeles y Arcángeles y a toda la compañía del cielo, que cantan por siempre este himno para proclamar la gloria de tu Nombre: El SANCTUS"
  },
  {
   "t": "R",
   "x": "Celebrante y Pueblo"
  },
  {
   "t": "V",
   "x": "Santo, Santo, Santo es el Señor, Dios del universo,\nllenos están el cielo y la tierra de tu gloria.\nHosanna en el cielo."
  },
  {
   "t": "V",
   "x": "Bendito el que viene en el Nombre del Señor.\nHosanna en el cielo."
  }
 ],
 "renewedConsecration": [
  {
   "t": "T",
   "x": "LA ORACIÓN DE CONSAGRACIÓN"
  },
  {
   "t": "R",
   "x": "La gente se pone de pie o se arrodilla. El Celebrante continúa:"
  },
  {
   "t": "P",
   "x": "Padre santo y misericordioso: En tu infinito amor nos hiciste para ti; y cuando habíamos pecado contra ti, y nos habíamos convertido en cautivos del mal y de la muerte, tú, en tu misericordia, enviaste a tu único Hijo Jesucristo al mundo para nuestra salvación. Por el Espíritu Santo y la Virgen María se hizo carne y habitó entre nosotros. Obedeciendo tu voluntad, extendió los brazos sobre la Cruz y se ofreció de una vez por todas para que por su sufrimiento y muerte fuéramos salvos. Con su resurrección rompió los lazos de la muerte, pisoteando al infierno y a Satanás bajo sus pies. Como nuestro gran sumo sacerdote, ascendió a tu diestra en gloria, para que pudiéramos acudir con confianza ante el trono de la gracia."
  },
  {
   "t": "R",
   "x": "En las siguientes palabras sobre el pan, el Celebrante debe sostenerlo o poner una mano sobre él, y aquí * puede partir el pan; y en las palabras sobre el Cáliz, sostiene o coloca una mano sobre el Cáliz y cualquier otro recipiente que contenga el vino destinado a ser consagrado."
  },
  {
   "t": "P",
   "x": "En la misma noche en que fue traicionado, nuestro Señor Jesucristo tomó pan; y habiendo dado gracias, lo partió, y se lo dio a sus discípulos, diciendo: “Tomen y coman. Este es mi Cuerpo que será entregado por ustedes: Hagan esto en memoria de Mí”."
  },
  {
   "t": "P",
   "x": "Asimismo, después de la cena, Jesús tomó el cáliz, y habiendo dado gracias, se lo dio a ellos, diciendo: “Beban todos de él; porque esta es mi Sangre de la Nueva Alianza, que será derramada por ustedes y por muchos para perdón de los pecados: Siempre que lo beban, háganlo en memoria de Mí."
  },
  {
   "t": "P",
   "x": "Por lo tanto, proclamamos el misterio de fe:"
  },
  {
   "t": "R",
   "x": "Celebrante y gente"
  },
  {
   "t": "V",
   "x": "Cristo ha muerto.\nCristo ha resucitado.\nCristo vendrá de nuevo."
  },
  {
   "t": "P",
   "x": "Celebramos el memorial de nuestra redención, oh Padre, en este sacrificio de alabanza y acción de gracias, y te ofrecemos estos dones."
  },
  {
   "t": "P",
   "x": "Santifícalos por tu Palabra y Espíritu Santo para que sean para tu pueblo el Cuerpo y la Sangre de tu Hijo Jesucristo. Santifícanos también, para que recibamos dignamente este santo Sacramento y seamos un solo cuerpo con él, para que él more en nosotros y nosotros en él. En el cumplimiento de los tiempos, pon todas las cosas en sujeción bajo Cristo y tráenos con todos tus santos al gozo de tu reino celestial, donde veremos a nuestro Señor cara a cara."
  },
  {
   "t": "P",
   "x": "Todo esto te lo pedimos por tu Hijo Jesucristo: Por él, y con él, y en él, en la unidad del Espíritu Santo, todo honor y gloria son tuyos, Padre Todopoderoso, ahora y por siempre. Amén."
  }
 ],
 "renewedLordsPrayer": [
  {
   "t": "T",
   "x": "LA ORACIÓN DEL SEÑOR"
  },
  {
   "t": "P",
   "x": "Y ahora, orando como nuestro Salvador Jesucristo nos enseñó, nos atrevemos a decir:"
  },
  {
   "t": "R",
   "x": "El celebrante y el pueblo rezan juntos"
  },
  {
   "t": "V",
   "x": "Padre Nuestro que estás en el cielo,\nsantificado sea tu Nombre,\nvenga tu reino,\nhágase tu voluntad,\nen la tierra como en el cielo.\nDanos hoy nuestro pan de cada día.\nPerdona nuestras ofensas,\ncomo también nosotros perdonamos a los que\nnos ofenden.\nNo nos dejes caer en tentación\ny líbranos del mal.\nPorque tuyo es el reino,\ntuyo es el poder,\ny tuya es la gloria,\nahora y por siempre. Amén."
  }
 ],
 "renewedHumbleAccess": [
  {
   "t": "T",
   "x": "LA ORACIÓN DE HUMILDE ACCESO"
  },
  {
   "t": "R",
   "x": "Celebrante y las personas juntas pueden decir"
  },
  {
   "t": "V",
   "x": "Nosotros no nos atrevemos a venir a esta tu mesa, oh Señor misericordioso,\nconfiados en nuestra rectitud,\nsino en tus muchas y grandes misericordias.\nNo somos dignos ni aun de recoger las migajas debajo de tu mesa;\nmas tú eres el mismo señor,\ncuyo carácter es siempre de tener misericordia.\nConcédenos, por tanto, Señor, por tu clemencia,\nQue de tal modo comamos la Carne de tu amado Hijo Jesucristo\ny bebamos su sangre,\nque nuestros cuerpos pecadores sean purificados por su Cuerpo, y nuestras\nalmas lavadas por su más preciosa Sangre, y para que siempre vivamos en él, y\nél en nosotros. Amén."
  }
 ],
 "renewedAgnusDei": [
  {
   "t": "T",
   "x": "EL AGNUS DEI"
  },
  {
   "t": "P",
   "x": "El siguiente himno o algún otro himno adecuado se puede cantar o decir aquí."
  },
  {
   "t": "V",
   "x": "Cordero de Dios, que quitas el pecado del mundo;\nTen misericordia de nosotros.\nCordero de Dios, que quitas el pecado del mundo;\nTen misericordia de nosotros.\nCordero de Dios, que quitas el pecado del mundo;\nDanos tu paz."
  }
 ],
 "renewedAdministration": [
  {
   "t": "T",
   "x": "LA ADMINISTRACIÓN DE LA COMUNIÓN"
  },
  {
   "t": "R",
   "x": "Frente al Pueblo, el Celebrante puede decir la siguiente invitación:"
  },
  {
   "t": "P",
   "x": "Los Dones de Dios para el Pueblo de Dios. [Tómenlos en memoria de que Cristo murió por ustedes, y aliméntense de Él en sus corazones, por fe, y con agradecimiento]. o esto, Aquí tienen al Cordero de Dios que quita el pecado del mundo. ¡Dichosos los que han sido convidados a la cena de las bodas del Cordero!"
  },
  {
   "t": "REF",
   "x": "JOHN 1:29, APOCALIPSIS 19:9 (NVI)"
  },
  {
   "t": "R",
   "x": "Los ministros reciben el sacramento en ambas formas y luego lo entregan inmediatamente al pueblo."
  },
  {
   "t": "R",
   "x": "El Pan y el Cáliz se entregan a los comulgantes con estas palabras:"
  },
  {
   "t": "P",
   "x": "El Cuerpo de Cristo, pan del cielo."
  },
  {
   "t": "P",
   "x": "La Sangre de Cristo, Cáliz de salvación."
  },
  {
   "t": "R",
   "x": "Durante el ministerio de la Comunión, se pueden cantar himnos, salmos o antífonas."
  },
  {
   "t": "R",
   "x": "El Celebrante puede ofrecer una frase de la Escritura al final de la Comunión."
  }
 ],
 "renewedPostCommunion": [
  {
   "t": "T",
   "x": "ORACIÓN DESPUÉS DE LA COMUNIÓN"
  },
  {
   "t": "R",
   "x": "Después de la Comunión, el Celebrante dice:"
  },
  {
   "t": "P",
   "x": "Oremos:"
  },
  {
   "t": "R",
   "x": "Juntos, el Celebrante y el pueblo dicen lo siguiente (o la oración posterior a la comunión en el Texto Estándar Anglicano):"
  },
  {
   "t": "V",
   "x": "Padre Celestial,\nte damos gracias porque nos has nutrido con el alimento espiritual\ndel preciosísimo Cuerpo y Sangre\nde tu Hijo, nuestro Salvador Jesucristo;\ny porque nos aseguras, en estos santos misterios,\nque somos miembros vivos del Cuerpo de tu Hijo\ny herederos de tu reino eterno.\nY ahora, Padre, envíanos al mundo para cumplir la\nMisión que tú nos has encomendado,\npara amarte y servirte\ncomo fieles testigos de Cristo nuestro Señor.\nA él, a ti y al Espíritu Santo,\nsea todo honor y gloria, ahora y por siempre. Amén."
  }
 ],
 "renewedBlessing": [
  {
   "t": "T",
   "x": "LA BENDICIÓN"
  },
  {
   "t": "R",
   "x": "El obispo, cuando está presente, o el sacerdote, da esta bendición o una alternativa."
  },
  {
   "t": "P",
   "x": "La paz de Dios, que sobrepasa todo entendimiento, mantenga su corazón y su mente en el conocimiento y el amor de Dios y de su Hijo Jesucristo, nuestro Señor; y la bendición de Dios Todopoderoso, Padre, Hijo y Espíritu Santo, esté con todos ustedes y permanezca para siempre. Amén."
  },
  {
   "t": "R",
   "x": "Se puede cantar un himno, salmo o antífona después de la bendición (o después de la despedida)."
  }
 ],
 "renewedDismissal": [
  {
   "t": "T",
   "x": "LA DESPEDIDA"
  },
  {
   "t": "R",
   "x": "El diácono, o el sacerdote, puede despedir al pueblo con estas palabras"
  },
  {
   "t": "P",
   "x": "Nos podemos retirar en el Nombre de Cristo."
  },
  {
   "t": "PUEBLO",
   "x": "Demos gracias a Dios."
  },
  {
   "t": "R",
   "x": "o bien,"
  },
  {
   "t": "DIAC",
   "x": "Vayan en paz para amar y servir al Señor."
  },
  {
   "t": "PUEBLO",
   "x": "Demos gracias a Dios."
  },
  {
   "t": "R",
   "x": "o bien,"
  },
  {
   "t": "DIAC",
   "x": "Vayamos al mundo, regocijándonos en el poder del Espíritu Santo."
  },
  {
   "t": "PUEBLO",
   "x": "Demos gracias a Dios."
  },
  {
   "t": "R",
   "x": "o bien,"
  },
  {
   "t": "DIAC",
   "x": "Bendigamos al Señor."
  },
  {
   "t": "PUEBLO",
   "x": "Demos gracias a Dios."
  }
 ],
 "renewedDismissalAlleluia": [
  {
   "t": "R",
   "x": "Desde la Vigilia Pascual hasta el Día de Pentecostés, “Aleluya, aleluya” se agrega a cualquiera de las despedidas."
  },
  {
   "t": "R",
   "x": "Puede añadirse en otros momentos, excepto durante la Cuaresma y en otras ocasiones penitenciales."
  },
  {
   "t": "R",
   "x": "La gente responde"
  },
  {
   "t": "P",
   "x": "Demos gracias a Dios. Aleluya, Aleluya."
  }
 ],
 "ashWednesdayOpening": [
  {
   "t": "R",
   "x": "Los ministros pueden entrar en silencio, o se puede cantar un himno, salmo o antífona."
  },
  {
   "t": "R",
   "x": "El Pueblo se pone de pie, y el Oficiante dice"
  },
  {
   "t": "OFIC",
   "x": "Bendito sea el Señor que perdona todos nuestros pecados."
  },
  {
   "t": "PUEBLO",
   "x": "Su misericordia perdura para siempre."
  }
 ],
 "ashWednesdayInvitation": [
  {
   "t": "R",
   "x": "El Oficiante invita al Pueblo a la observancia de una santa Cuaresma, ya sea aquí o después del sermón, diciendo"
  },
  {
   "t": "P",
   "x": "Querido Pueblo de Dios: Los primeros cristianos observaban con gran devoción los días de la pasión y resurrección del Señor, y se hizo costumbre de la Iglesia prepararlos con un tiempo de penitencia y ayuno. Esta temporada de Cuaresma proporcionó un tiempo en el que los conversos a la fe se prepararon para el Santo Bautismo. También fue un tiempo en que aquellos que, a causa de pecados notorios, habían sido separados del cuerpo de los fieles, fueron reconciliados por la penitencia y el perdón, y restaurados a la comunión de la Iglesia. De esta manera, se recordó a toda la Congregación el mensaje de perdón y absolución del Evangelio de nuestro Salvador, y la necesidad que tenemos todos los cristianos de renovar continuamente el arrepentimiento y la fe. Los invito, pues, en nombre de la Iglesia, a la observancia de una santa Cuaresma: mediante el autoexamen y el arrepentimiento; por la oración, el ayuno y la limosna; y leyendo y meditando en la santa Palabra de Dios. Y para hacer un buen comienzo, oremos ahora por gracia, para que podamos guardar fielmente esta Cuaresma."
  },
  {
   "t": "R",
   "x": "El Oficiante y el pueblo se arrodillan. Sigue un período de oración en silencio."
  },
  {
   "t": "R",
   "x": "El Oficiante entonces dice"
  },
  {
   "t": "P",
   "x": "Dios todopoderoso y eterno, que nada de lo que has hecho odias, y perdonas los pecados de todos los que se arrepienten: Crea y haz en nosotros corazones nuevos y contritos, para que, lamentando dignamente nuestros pecados y reconociendo nuestra miseria, podamos obtener de ti, el Dios de toda misericordia, perfecta remisión y perdón; por Jesucristo nuestro Señor, que vive y reina contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén."
  }
 ],
 "ashWednesdayAshes": [
  {
   "t": "T",
   "x": "SALMO PENITENCIAL E IMPOSICIÓN DE LA CENIZA"
  },
  {
   "t": "R",
   "x": "El oficiante dice"
  },
  {
   "t": "P",
   "x": "Recordemos ahora nuestro pecado y la infinita misericordia de Dios."
  },
  {
   "t": "R",
   "x": "Si se han de imponer cenizas, dice el Oficiante"
  },
  {
   "t": "P",
   "x": "Dios todopoderoso, nos has creado del polvo de la tierra: Haz que estas cenizas sean para nosotros un símbolo de nuestra mortalidad y un signo de nuestra penitencia, para que recordemos que es solo por tu gracia que recibimos el don de vida eterna por Jesucristo nuestro Salvador. Amén."
  },
  {
   "t": "R",
   "x": "Luego se imponen cenizas con las siguientes palabras"
  },
  {
   "t": "P",
   "x": "Recuerda que eres polvo y en polvo te convertirás."
  },
  {
   "t": "REF",
   "x": "SALMO 51"
  },
  {
   "t": "R",
   "x": "Todos de rodillas. El Salmo 51:1-17 se canta o se dice."
  },
  {
   "t": "V",
   "x": "1 Ten compasión de mí, oh Dios, conforme a tu gran amor; *\nconforme a tu inmensa bondad, borra mis pecados."
  },
  {
   "t": "V",
   "x": "2 Lávame de toda mi maldad, *\ny límpiame de mi pecado."
  },
  {
   "t": "V",
   "x": "3 Yo reconozco mis culpas; *\nsiempre tengo presente mi pecado."
  },
  {
   "t": "V",
   "x": "4 Contra ti he pecado, solo contra ti, y he hecho lo que es malo ante tus ojos; *\npor eso, tu sentencia es justa, y tu juicio, irreprochable."
  },
  {
   "t": "V",
   "x": "5 Yo sé que soy malo de nacimiento; *\npecador me concibió mi madre."
  },
  {
   "t": "V",
   "x": "6 Yo sé que tú amas la verdad en lo íntimo; *\nen lo secreto me has enseñado sabiduría."
  },
  {
   "t": "V",
   "x": "7 Purifícame con hisopo, y quedaré limpio; *\nlávame, y quedaré más blanco que la nieve."
  },
  {
   "t": "V",
   "x": "8 Anúnciame gozo y alegría; *\ninfunde gozo en estos huesos que has quebrantado."
  },
  {
   "t": "V",
   "x": "9 Aparta tu rostro de mis pecados*\ny borra toda mi maldad."
  },
  {
   "t": "V",
   "x": "10 Crea en mí, oh Dios, un corazón limpio, *\ny renueva la firmeza de mi espíritu."
  },
  {
   "t": "V",
   "x": "11 No me alejes de tu presencia*\nni me quites tu santo Espíritu."
  },
  {
   "t": "V",
   "x": "12 Devuélveme la alegría de tu salvación; *\nque un espíritu obediente me sostenga."
  },
  {
   "t": "V",
   "x": "13 Así enseñaré a los transgresores tus caminos, *\ny los pecadores se volverán a ti."
  },
  {
   "t": "V",
   "x": "14 Dios mío, Dios de mi salvación, líbrame de derramar sangre, *\ny mi lengua alabará tu justicia."
  },
  {
   "t": "V",
   "x": "15 Abre, Señor, mis labios, *\ny mi boca proclamará tu alabanza."
  },
  {
   "t": "V",
   "x": "16 Tú no te deleitas en los sacrificios, de lo contrario, te los ofrecería. *\nni te complacen los holocaustos;"
  },
  {
   "t": "V",
   "x": "17 El sacrificio que te agrada, es un espíritu quebrantado; *\ntú, oh Dios, no desprecias al corazón quebrantado y arrepentido."
  }
 ],
 "ashWednesdayConfession": [
  {
   "t": "T",
   "x": "CONFESIÓN Y LETANÍA DE PENITENCIA"
  },
  {
   "t": "R",
   "x": "El Diácono u otra persona designada dice"
  },
  {
   "t": "P",
   "x": "Confesemos humildemente nuestros pecados al Dios Todopoderoso."
  },
  {
   "t": "R",
   "x": "El silencio puede seguir. El Oficiante y el Pueblo juntos, todos de rodillas, rezan"
  },
  {
   "t": "V",
   "x": "Padre santísimo y misericordioso,\nNosotros confesamos a Ti y los unos a los otros,\ny a toda la comunión de los santos\nen el cielo y en la tierra,\nque hemos pecado, por nuestra propia culpa\nen pensamiento, palabra y obra;\npor lo que hemos hecho,\ny por lo que hemos dejado de hacer.\nNo te hemos amado con todo nuestro corazón, mente y fuerzas.\nNo hemos amado a nuestro prójimo como a nosotros mismos.\nNo hemos perdonado a los demás, como hemos sido perdonados.\nNos hemos hecho sordos a tu llamado de servir,\ncomo Cristo nos ha servido a nosotros.\nNo hemos sido fieles a la mente de Cristo.\nHemos entristecido a tu Espíritu Santo."
  },
  {
   "t": "LECTOR",
   "x": "Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "R",
   "x": "El Lector solo continúa, y el Pueblo responde"
  },
  {
   "t": "P",
   "x": "Por todas nuestras infidelidades y desobediencias; por la soberbia, vanidad e hipocresía de nuestras vidas; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por nuestra autocompasión e impaciencia, y nuestra envidia de aquellos que consideramos más afortunados que nosotros; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por nuestra ira, amargura y resentimiento injustos; por todas las mentiras, chismes y calumnias contra nuestro prójimo; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por nuestra impureza sexual, nuestra explotación de otras personas y nuestra incapacidad para darnos en amor; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por nuestros apetitos y maneras autoindulgentes, y nuestra búsqueda desmedida de bienes y comodidades mundanos; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por nuestra deshonestidad en la vida diaria y el trabajo, nuestra ingratitud por tus dones y nuestra falta de atención a tu llamada. Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por nuestra ceguera ante la necesidad y los sufrimientos humanos, y nuestra indiferencia ante la injusticia y la crueldad; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por nuestro despilfarro y mal uso de tu creación, y nuestra falta de preocupación por los que vienen después de nosotros; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por todos los juicios falsos, por el prejuicio y desprecio de los demás, y por todos los pensamientos poco caritativos hacia nuestro prójimo; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "V",
   "x": "Por nuestra negligencia en la oración y adoración;\npor nuestra presunción y abuso de tus medios de gracia;\nSeñor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por buscar la alabanza de los demás en lugar de la aprobación de Dios; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "P",
   "x": "Por nuestro fracaso en recomendar la fe que está en nosotros; Señor, ten piedad de nosotros:"
  },
  {
   "t": "PUEBLO",
   "x": "Porque hemos pecado contra ti."
  },
  {
   "t": "R",
   "x": "Entonces todos rezan"
  },
  {
   "t": "P",
   "x": "Muestra favor a tu pueblo, oh Señor, que se vuelve a ti con llanto, ayuno y oración. Porque tú eres un Dios misericordioso, lleno de compasión, paciente y grande en misericordia. Tú perdonas cuando merecemos castigo, y en tu ira te acuerdas de la misericordia. Perdona a tu pueblo, buen Señor, perdónanos; en la multitud de tus misericordias, míranos y perdónanos; por los méritos y mediación de tu bendito Hijo Jesucristo nuestro Señor. Amén."
  }
 ],
 "ashWednesdayAbsolution": [
  {
   "t": "T",
   "x": "LA ABSOLUCIÓN"
  },
  {
   "t": "R",
   "x": "Si está presente el Obispo, o el Sacerdote, solo se pone de pie y dice"
  },
  {
   "t": "P",
   "x": "Dios Todopoderoso, el Padre de nuestro Señor Jesucristo, no desea la muerte de los pecadores, sino que se conviertan de su maldad y vivan. Ha autorizado y mandado a sus ministros a pronunciar a su pueblo penitente, la absolución y la remisión de sus pecados. Él perdona y absuelve a todos los que verdaderamente se arrepienten y creen genuinamente en su santo Evangelio. Por eso le suplicamos que nos conceda el verdadero arrepentimiento y su Espíritu Santo, para que nuestras obras presentes le agraden, el resto de nuestra vida sea pura y santa, y lleguemos al fin a su gozo eterno; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "R",
   "x": "O lo siguiente"
  },
  {
   "t": "P",
   "x": "Dios omnipotente, nuestro Padre celestial, que en su gran misericordia ha prometido el perdón de pecados a todos los que con sincero arrepentimiento y verdadera fe se vuelven a él, tenga misericordia de ustedes, los perdone y los libere de todos sus pecados, los confirme y los fortalezca en toda virtud, y los conduzca a la vida eterna; mediante Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "LAS PALABRAS CONFORTANTES"
  },
  {
   "t": "R",
   "x": "El Oficiante puede entonces decir una o más de las siguientes oraciones, diciendo primero"
  },
  {
   "t": "P",
   "x": "Escuchen la Palabra de Dios todos los que de verdad se vuelven a Él. Vengan a mí todos ustedes que están cansados y agobiados, y yo les daré descanso."
  },
  {
   "t": "REF",
   "x": "MATEO 11:28, (NVI)"
  },
  {
   "t": "P",
   "x": "Porque tanto amó Dios al mundo que dio a su Hijo unigénito, para que todo el que cree en Él no se pierda, sino que tenga vida eterna."
  },
  {
   "t": "REF",
   "x": "JUAN 3:16T"
  },
  {
   "t": "P",
   "x": "Este mensaje es digno de crédito y merece ser aceptado por todos: que Cristo Jesús vino al mundo a salvar a los pecadores, de los cuales yo soy el primero"
  },
  {
   "t": "REF",
   "x": "1 TIMOTEO 1:15, (NVI)"
  },
  {
   "t": "P",
   "x": "Mis queridos hijos, les escribo estas cosas para que no pequen. Pero, si alguno peca, tenemos ante el Padre a un intercesor, a Jesucristo, el Justo. Él es el sacrificio por el perdón de nuestros pecados, y no solo por los nuestros, sino por los de todo el mundo."
  },
  {
   "t": "REF",
   "x": "1 JUAN 2:1-2T"
  },
  {
   "t": "T",
   "x": "LA PAZ"
  },
  {
   "t": "OFIC",
   "x": "La Paz del Señor esté siempre con ustedes."
  },
  {
   "t": "PUEBLO",
   "x": "Y con tu espíritu."
  }
 ],
 "ashWednesdayClosing": [
  {
   "t": "R",
   "x": "Cuando hay Comunión, la liturgia continúa con el Ofertorio. Se usa el Prefacio Propio de Cuaresma. La siguiente oración puede ser dicha por el Celebrante antes de la bendición final."
  },
  {
   "t": "R",
   "x": "Si no hay Comunión, entonces se reza el Padrenuestro. La siguiente oración puede usarse para concluir la liturgia."
  },
  {
   "t": "OFIC",
   "x": "Oremos"
  },
  {
   "t": "P",
   "x": "Señor Dios nuestro, concédenos la gracia de desearte con todo nuestro corazón: que, deseándote, te busquemos; y que, buscándote, podamos encontrarte; y que, al encontrarte, podamos amarte; y que, amándote, odiemos aquellos pecados de los cuales nos has librado; por Jesucristo nuestro Señor. Amén."
  }
 ],
 "easterVigilIntro": [
  {
   "t": "R",
   "x": "La Gran Vigilia, cuando se observa, es la primera liturgia del Día de Pascua. Se celebra en un tiempo conveniente entre la puesta del sol del Sábado Santo y el amanecer de la mañana de Pascua. Es apropiado que el servicio comience en la oscuridad. La liturgia normalmente consta de cuatro partes:"
  },
  {
   "t": "R",
   "x": "El Servicio de la Luz: se enciende un nuevo fuego, y de él se enciende el Cirio Pascual, que simboliza a Cristo, la luz del mundo. El Exsultet, una antigua canción de alabanza se canta o recita como punto culminante de esta parte de la liturgia."
  },
  {
   "t": "R",
   "x": "El servicio de las lecturas: pasajes clave de las Escrituras relatan la historia de los poderosos actos y promesas de Dios. Estas lecturas van acompañadas de salmos, cánticos y oraciones."
  },
  {
   "t": "R",
   "x": "El Santo Bautismo es el Sacramento a través del cual los candidatos se unen a la muerte y resurrección de Jesucristo (ROMANOS 6: 3-4), que la Iglesia celebra en esta noche santísima. Cuando el Obispo está presente, también se puede administrar la Confirmación. Si no hay candidatos para el Bautismo o la Confirmación, la Congregación se une a la Renovación de los Votos Bautismales."
  },
  {
   "t": "R",
   "x": "La Sagrada Eucaristía es la culminación apropiada de la Liturgia Pascual. Al celebrar esta santa fiesta, compartimos el gozo del triunfo de nuestro Salvador y su gracia nos fortalece para caminar en una vida nueva."
  }
 ],
 "easterVigilLight": [
  {
   "t": "T",
   "x": "LA ILUMINACIÓN DEL CIRIO PASCUAL"
  },
  {
   "t": "R",
   "x": "En la oscuridad, el fuego se enciende; después de lo cual el Celebrante dice"
  },
  {
   "t": "P",
   "x": "Queridos amigos en Cristo: En esta noche santísima, en la que nuestro Señor Jesús pasó de muerte a vida, la Iglesia invita a sus miembros, dispersos por todo el mundo, a reunirse en vigilia y oración. Porque esta es la Pascua del Señor, en la que, al escuchar su Palabra y celebrar sus sacramentos, compartimos su victoria sobre la muerte."
  },
  {
   "t": "R",
   "x": "El Celebrante puede decir la siguiente oración"
  },
  {
   "t": "P",
   "x": "Dios eterno, que hiciste brillar esta noche santísima con el resplandor de tu única luz verdadera: santifica este nuevo fuego, te rogamos, y enciéndenos así con el fuego de tu amor, para que con corazones puros y afectos ardientes podamos alcanzar al resplandor de tu gloria celestial; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "R",
   "x": "Si se va a marcar el Cirio Pascual, se hace en este momento (página 595)."
  }
 ],
 "easterVigilCandle": [
  {
   "t": "R",
   "x": "Si lo desea, el Cirio Pascual se puede marcar antes de que se encienda, de la siguiente manera."
  },
  {
   "t": "R",
   "x": "A medida que se traza la vertical de la cruz el celebrante dice"
  },
  {
   "t": "P",
   "x": "Cristo, ayer y hoy,"
  },
  {
   "t": "R",
   "x": "A medida que se traza la horizontal el celebrante dice"
  },
  {
   "t": "P",
   "x": "el principio y el fin,"
  },
  {
   "t": "R",
   "x": "Como el Alfa es trazado"
  },
  {
   "t": "P",
   "x": "Alfa"
  },
  {
   "t": "R",
   "x": "Como el Omega es trazado"
  },
  {
   "t": "P",
   "x": "y Omega,"
  },
  {
   "t": "R",
   "x": "A medida que se traza el primer número del año el celebrante dice"
  },
  {
   "t": "P",
   "x": "todo el tiempo le pertenece,"
  },
  {
   "t": "R",
   "x": "Como el segundo número es trazado"
  },
  {
   "t": "P",
   "x": "y todas las edades;"
  },
  {
   "t": "R",
   "x": "Como el tercer número es trazado"
  },
  {
   "t": "P",
   "x": "a Él sea la gloria y el poder,"
  },
  {
   "t": "R",
   "x": "Como el cuarto número es trazado"
  },
  {
   "t": "P",
   "x": "a través de todos los tiempos y por siempre. Amén."
  },
  {
   "t": "R",
   "x": "Clavos o granos de incienso pueden ser incrustados en el Cirio Pascual."
  },
  {
   "t": "P",
   "x": "Por sus santas y gloriosas llagas que Cristo nuestro Señor nos guarde y proteja. Amén."
  }
 ],
 "easterVigilLightLit": [
  {
   "t": "R",
   "x": "El Celebrante enciende el Cirio Pascual con el fuego recién encendido y dice"
  },
  {
   "t": "P",
   "x": "Que la luz de Cristo, elevándose en gloria, destierre toda oscuridad de nuestros corazones y mentes."
  },
  {
   "t": "R",
   "x": "El Diácono (o el Celebrante si no hay Diácono), portando la Vela, conduce la procesión hasta el presbiterio, haciendo tres pausas y cantando o diciendo"
  },
  {
   "t": "DIAC",
   "x": "La luz de Cristo."
  },
  {
   "t": "PUEBLO",
   "x": "Demos gracias a Dios."
  },
  {
   "t": "R",
   "x": "Si se han distribuido velas a los miembros de la Congregación, se encienden con el Cirio Pascual. También se pueden encender otras velas y lámparas de la iglesia, excepto las del Altar."
  },
  {
   "t": "R",
   "x": "El Cirio Pascual se coloca en su soporte."
  },
  {
   "t": "R",
   "x": "Luego, el Diácono, u otra persona designada, de pie cerca de la vela, canta o dice habitualmente el Exsultet."
  },
  {
   "t": "T",
   "x": "EL PREGÓN PASCUAL"
  },
  {
   "t": "V",
   "x": "Alégrense por fin, bóveda del cielo y coros de ángeles,\ny dejen que sus trompetas anuncien la Salvación\ny por la victoria de nuestro Rey tan poderoso."
  },
  {
   "t": "V",
   "x": "Regocíjate y canta ahora, toda la tierra entera,\ninundada de tanta claridad,\nporque las tinieblas han sido vencidas por nuestro Rey eterno."
  },
  {
   "t": "V",
   "x": "Alégrese y goce ahora, nuestra madre la Iglesia,\ny deja que tus santos atrios, en luz radiante,\nresuenen con aclamaciones de tu pueblo."
  },
  {
   "t": "V",
   "x": "Todos ustedes los que están cerca de esta llama santa y maravillosa,\noren conmigo a Dios Todopoderoso\npor la gracia de cantar la alabanza digna de esta gran luz;\nPor Jesucristo tu Hijo nuestro Señor,\nque vive y reina con Él,\nen la unidad del Espíritu Santo,\nun solo Dios, por los siglos de los siglos. Amén."
  },
  {
   "t": "DIAC",
   "x": "El Señor esté con ustedes."
  },
  {
   "t": "PUEBLO",
   "x": "Y con tu espíritu."
  },
  {
   "t": "DIAC",
   "x": "Levantemos el corazón."
  },
  {
   "t": "PUEBLO",
   "x": "Lo tenemos levantado hacia el Señor."
  },
  {
   "t": "DIAC",
   "x": "Demos gracias al Señor nuestro Dios."
  },
  {
   "t": "PUEBLO",
   "x": "Es justo darle gracias y alabarlo."
  },
  {
   "t": "V",
   "x": "Verdaderamente es justo y necesario, siempre y en todo lugar,\ncon todo nuestro corazón, mente y voz alabarte,\nDios invisible, todopoderoso y eterno,\ny a tu Hijo unigénito Jesucristo nuestro Señor;\nquien pagó por nosotros la deuda del pecado de Adán,\ny por su sangre libró a tu pueblo fiel;\nporque Él es el verdadero Cordero Pascual,\nel mismo Cordero de Dios,\ncuya sangre marca los dinteles de las puertas de los creyentes\ny nos santifica."
  },
  {
   "t": "V",
   "x": "Esta es la noche en que sacaste a nuestros antepasados,\nlos hijos de Israel, de la servidumbre en Egipto,\ny los condujiste a través del Mar Rojo en tierra seca.\nEsta es la noche en que con una columna de fuego\ndesterraste las tinieblas de nuestra iniquidad.\nEsta es la noche en que todos los que creen en Cristo\nson librados de la penumbra del pecado,\ny son restaurados a la gracia y la santidad de vida.\nEsta es la noche en que Cristo rompió los lazos de la muerte y el infierno,\ny se levantó victorioso de la tumba."
  },
  {
   "t": "V",
   "x": "Nuestro nacimiento no habría sido una ganancia\nsi no hubiéramos sido redimidos.\nQué maravilloso y más allá de nuestro conocimiento, oh Dios,\nestá tu misericordia y bondad amorosa para con nosotros,\nque, para redimir a un esclavo, le diste un Hijo.\n¡Oh maravillosa providencia del pecado de Adán\ndestruido completamente por la muerte de Cristo!\n¡Oh, feliz falta que nos ganó\nun Redentor tan grande y glorioso!"
  },
  {
   "t": "V",
   "x": "Esta es la noche de la que está escrito:\nla noche será tan brillante como el día.\nQué santa es esta noche en que la maldad se pone en fuga\ny el pecado se lava.\nDevuelve la inocencia a los caídos y la alegría a los que lloran.\nExpulsa el orgullo y el odio, y trae paz y concordia.\nQué bendita es esta noche en la que la tierra y el cielo se unen\ny el hombre se reconcilia con Dios."
  },
  {
   "t": "V",
   "x": "Por lo tanto, Oh Padre Santo, acepta nuestro sacrificio vespertino,\nla ofrenda de este cirio en tu honor,\nobra de las abejas y de las manos de tus siervos,\ndon de tu santísima Iglesia.\nQue se mezcle con las luces del cielo,\ny brille continuamente para ahuyentar toda oscuridad.\nQue Cristo, la estrella de la mañana que no tiene ocaso,\nla encuentre siempre ardiendo: El que da su luz a toda la creación,\ny que vive y reina por los siglos de los siglos. Amén."
  }
 ],
 "easterVigilReadings": [
  {
   "t": "T",
   "x": "LAS LECTURAS"
  },
  {
   "t": "R",
   "x": "El Celebrante puede presentar las lecturas de las Escrituras con estas palabras u otras similares"
  },
  {
   "t": "P",
   "x": "Escuchemos el registro de las obras salvadoras de Dios en la historia, recordando cómo salvó a su pueblo en épocas pasadas y en la plenitud de los tiempos envió a su Hijo para ser nuestro Redentor; y oremos para que Dios pueda completar en cada uno de nosotros la obra salvadora que ha comenzado."
  },
  {
   "t": "R",
   "x": "Se leen al menos tres de las siguientes lecturas, de las cuales una es siempre la lectura del Éxodo. Después de cada lectura, se puede decir o cantar el salmo o cánticos enumerados, o algún otro salmo, cántico o himno adecuado. Se puede guardar un período de silencio; y se puede decir la oración Colecta proporcionada, o alguna otra oración Colecta adecuada."
  },
  {
   "t": "T",
   "x": "LA CREACIÓN"
  },
  {
   "t": "LECCION",
   "x": "GÉNESIS 1: 1—2: 3",
   "ref": "Genesis 1:1-2:3"
  },
  {
   "t": "REF",
   "x": "SALMO 104: 1-13 (14-24) o"
  },
  {
   "t": "REF",
   "x": "UN CANTO A LA CREACIÓN (Cántico suplementario 10)"
  },
  {
   "t": "R",
   "x": "Oremos.. Silencio"
  },
  {
   "t": "P",
   "x": "Oh Dios, que creaste maravillosamente, y aún más maravillosamente restauraste la dignidad de la naturaleza humana: concédenos compartir la vida divina de Aquel que se humilló para compartir nuestra humanidad, tu Hijo Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "LA CAÍDA"
  },
  {
   "t": "LECCION",
   "x": "GÉNESIS 3",
   "ref": "Genesis 3"
  },
  {
   "t": "REF",
   "x": "SALMO 32"
  },
  {
   "t": "R",
   "x": "Oremos.. Silencio"
  },
  {
   "t": "P",
   "x": "Oh Dios, enviaste a tu bendito Hijo, la simiente de la mujer, para que aplastara la cabeza de la serpiente e hiciera nueva toda la creación: Concede que, teniendo esta esperanza, nos purifiquemos como Él es puro; para que, cuando vuelva con poder y gran gloria, seamos hechos como Él en su reino eterno y glorioso; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "LA INUNDACIÓN"
  },
  {
   "t": "LECCION",
   "x": "GÉNESIS 7: 1-5, 11-18; 8: 6-20; 9: 8-13",
   "ref": "Genesis 7:1-5,11-18,8:6-20,9:8-13"
  },
  {
   "t": "REF",
   "x": "SALMO 36 o SALMO 46"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Concede Señor, que nosotros, que somos bautizados en la muerte de tu Hijo, nuestro Salvador Jesucristo, continuamente destruyamos nuestros malos deseos y seamos sepultados con Él; y para que por el sepulcro y la puerta de la muerte pasemos a nuestra alegre resurrección; por los méritos de aquel que murió, fue sepultado y resucitó por nosotros, tu Hijo Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "ABRAHAM Y EL SACRIFICIO DE ISAAC"
  },
  {
   "t": "LECCION",
   "x": "GÉNESIS 22: 1-18",
   "ref": "Genesis 22:1-18"
  },
  {
   "t": "REF",
   "x": "PSALMO 16"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Dios Todopoderoso, cuyo siervo Abraham obedeció fielmente tu llamado, y se regocijó al ver el día de tu Hijo: Multiplica el número de tus hijos por la gracia del Cordero que fue inmolado; para que tu Iglesia también se regocije de ver cumplida tu promesa a nuestro padre Abraham; Por Jesucristo nuestro Señor. Amén"
  },
  {
   "t": "T",
   "x": "LA LIBERACIÓN DE ISRAEL EN EL MAR ROJO"
  },
  {
   "t": "LECCION",
   "x": "ÉXODO 14:10—15:1",
   "ref": "Exodus 14:10-15:1"
  },
  {
   "t": "REF",
   "x": "EL CANTO DE MOISES (Cántico Suplementario 5)"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Oh Dios, cuyas maravillas de antaño resplandecen hasta nuestros días, por el poder de tu brazo poderoso libraste una vez a tu pueblo escogido de la esclavitud bajo el mando del faraón, para que sea una señal para nosotros de la salvación que el agua del bautismo ofrece a todas las naciones: Haz que todos los pueblos de la tierra sean contados entre la descendencia de Abraham, y se regocijen en la heredad de Israel; Por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "LA PRESENCIA DE DIOS EN UN ISRAEL RENOVADO"
  },
  {
   "t": "LECCION",
   "x": "ISAÍAS 4: 2-6",
   "ref": "Isaiah 4:2-6"
  },
  {
   "t": "REF",
   "x": "SALMO 122"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Oh Dios, que guiaste a tu antiguo pueblo con una columna de nubes de día y una columna de fuego de noche: Concede que nosotros, que te servimos ahora en la tierra, lleguemos al gozo de esa Jerusalén celestial, donde todas las lágrimas son enjugadas y donde tus santos por siempre cantan tus alabanzas; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "LA SALVACIÓN ES OFRECIDA PARA TODOS"
  },
  {
   "t": "LECCION",
   "x": "ISAÍAS 55: 1-11",
   "ref": "Isaiah 55:1-11"
  },
  {
   "t": "REF",
   "x": "SEGURAMENTE ES DIOS QUIEN ME SALVA (Cántico Suplementario 8) o"
  },
  {
   "t": "REF",
   "x": "SALMO 42: 1-7"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Oh Dios, tú creaste todas las cosas con el poder de tu Palabra, y renuevas la tierra con tu Espíritu: Da el agua de la vida a todos los que tienen sed de ti, para que den fruto abundante en tu reino glorioso; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "UN NUEVO CORAZÓN Y UN NUEVO ESPÍRITU"
  },
  {
   "t": "LECCION",
   "x": "EZEQUIEL 36: 24-28",
   "ref": "Ezekiel 36:24-28"
  },
  {
   "t": "REF",
   "x": "SALMO 42: 1-7 o"
  },
  {
   "t": "REF",
   "x": "SEGURAMENTE ES DIOS QUIEN ME SALVA (Cántico Suplementario 8)"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Padre Celestial, por el poder de tu Espíritu Santo prometes a tu pueblo fiel nueva vida en el agua del Bautismo: Guíanos y fortalécenos por el mismo Espíritu, para que los que hemos nacido de nuevo te sirvamos en fe y amor, y crezcamos a la altura plena de tu Hijo Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "EL VALLE DE LOS HUESOS SECOS"
  },
  {
   "t": "LECCION",
   "x": "EZEQUIEL 37:1-14",
   "ref": "Ezekiel 37:1-14"
  },
  {
   "t": "REF",
   "x": "SALMO 30 o SALMO 126"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Señor Dios de nuestra salvación, tú hablas la palabra a tu pueblo esparcido, y nos levantas del valle de la muerte: Infunde tu Espíritu sobre tu Iglesia, para que podamos vivir y estar delante de ti confiando en tu Hijo resucitado, nuestro Salvador Jesucristo. Amén."
  },
  {
   "t": "T",
   "x": "LOS TRES HOMBRES EN EL HORNO ENCENDIDO"
  },
  {
   "t": "LECCION",
   "x": "DANIEL 3:1-28",
   "ref": "Daniel 3:1-23,91-95"
  },
  {
   "t": "REF",
   "x": "UN CANTO A LA CREACIÓN (Cántico Suplementario 10) o"
  },
  {
   "t": "REF",
   "x": "UN CANTO DE ALABANZA (Benedictus es, Domine)"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Oh Dios, tú sabes que estamos en medio de muchos peligros graves, y debido a la fragilidad de nuestra naturaleza no siempre podemos mantenernos firmes: Concede que tu presencia y protección nos sostenga en todas las pruebas y nos lleve a través de cada tentación; Por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "JONÁS Y EL PEZ"
  },
  {
   "t": "LECCION",
   "x": "JONÁS 1:1—2:10",
   "ref": "Jonah 1:1-2:10"
  },
  {
   "t": "REF",
   "x": "SALMO 130"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Dios Todopoderoso, por la resurrección de tu Hijo nos has sacado del pecado a la justicia y de la muerte a la vida: Concede a los sellados por tu Espíritu Santo la voluntad y el poder de proclamarte a todo el mundo; por Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "T",
   "x": "EL ENCUENTRO DEL PUEBLO DE DIOS"
  },
  {
   "t": "LECCION",
   "x": "SOFONÍAS 3:12-20",
   "ref": "Zephaniah 3:12-20"
  },
  {
   "t": "REF",
   "x": "SALMO 98"
  },
  {
   "t": "R",
   "x": "Oremos. Silencio"
  },
  {
   "t": "P",
   "x": "Dios Todopoderoso, llamaste a tu Iglesia a dar testimonio de que estabas en Cristo reconciliando el mundo hacia ti. Danos valor para proclamar la buena noticia de tu amor, para que todos los que la escuchen sean atraídos hacia ti; por Aquel que fue levantado sobre la cruz, Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "R",
   "x": "O, si las oraciones Solemnes no se dijeron el Viernes Santo, se puede usar lo siguiente"
  },
  {
   "t": "P",
   "x": "Oh Dios de poder inmutable y luz eterna: Mira con bondad a toda tu Iglesia, ese misterio maravilloso y sagrado; por la obra eficaz de tu providencia, lleva a cabo con tranquilidad el plan de salvación; deja que todo el mundo vea y sepa que las cosas que fueron derribadas se están levantando, y las cosas que habían envejecido se renuevan, y que todas las cosas están siendo perfeccionadas por Aquel por quien todas las cosas fueron hechas, tu Hijo Jesucristo nuestro Señor. Amén."
  },
  {
   "t": "R",
   "x": "El Santo Bautismo puede administrarse aquí o después del Evangelio (y sermón). La Confirmación también se puede administrar como se indica en Instrucciones Adicionales. En ausencia de Candidatos para el Bautismo o la Confirmación, el Celebrante dirige al pueblo a la Renovación de los Votos Bautismales."
  }
 ],
 "easterVigilWord": [
  {
   "t": "T",
   "x": "LA ACLAMACIÓN PASCUAL"
  },
  {
   "t": "CEL",
   "x": "¡Aleluya! ¡Cristo ha resucitado!"
  },
  {
   "t": "PUEBLO",
   "x": "¡El Señor ciertamente ha resucitado! ¡Aleluya!"
  },
  {
   "t": "R",
   "x": "Se puede tocar una alegre comparsa y se pueden tocar campanas. La iglesia está encendida y las velas del Altar ahora pueden encenderse con el Cirio Pascual."
  },
  {
   "t": "R",
   "x": "El Gloria in Excelsis, o algún otro himno de alabanza, se canta o dice"
  },
  {
   "t": "V",
   "x": "Gloria a Dios en el cielo,\ny paz en la tierra a quienes ama el Señor.\nPor tu inmensa gloria\nte alabamos,\nte bendecimos,\nte adoramos,\nte glorificamos,\nte damos gracias;\nSeñor Dios, Rey celestial,\nDios Padre Todopoderoso.\nSeñor, Hijo único Jesucristo,\nSeñor Dios, Cordero de Dios,\nHijo del Padre:\nTú que quitas el pecado del mundo,\nten piedad de nosotros;\nTú que quitas el pecado del mundo,\natiende a nuestra súplica;\nTú que estás sentado a la derecha del Padre,\nten piedad de nosotros.\nPorque solo tú eres Santo, sólo tú Señor,\nsólo tú Altísimo, Jesucristo, con el Espíritu Santo,\nen la gloria de Dios Padre.\nAmén."
  },
  {
   "t": "T",
   "x": "LA ORACIÓN COLECTA"
  },
  {
   "t": "CEL",
   "x": "El Señor esté con ustedes."
  },
  {
   "t": "PUEBLO",
   "x": "Y con tu espíritu."
  },
  {
   "t": "CEL",
   "x": "Oremos."
  },
  {
   "t": "P",
   "x": "Oh Dios, que hiciste resplandecer esta noche santísima con la gloria de la resurrección del Señor: despierta en tu Iglesia el Espíritu de adopción que nos fue dado en el Bautismo, para que, renovados en cuerpo y mente, te adoremos en sinceridad y verdad; por Jesucristo nuestro Señor, que vive y reina contigo, en la unidad del Espíritu Santo, un solo Dios, ahora y por siempre. Amén."
  },
  {
   "t": "R",
   "x": "El servicio continúa con la lectura de la Epístola"
  },
  {
   "t": "LECCION",
   "x": "ROMANOS 6:3-11",
   "ref": "Romans 6:3-11"
  },
  {
   "t": "R",
   "x": "Se puede decir o cantar el Salmo 114 o algún otro salmo, himno o cántico adecuado. El uso de \"Aleluya\" es particularmente apropiado."
  },
  {
   "t": "R",
   "x": "Todos se ponen de pie, y el Diácono o Sacerdote lee el evangelio, primero diciendo"
  },
  {
   "t": "DIAC",
   "x": "El Santo Evangelio de nuestro Señor Jesucristo según San Mateo."
  },
  {
   "t": "PUEBLO",
   "x": "Gloria a ti, Cristo Señor."
  },
  {
   "t": "EVANGELIO",
   "x": "MATEO 28: 1-10",
   "ref": "Matthew 28:1-10"
  },
  {
   "t": "R",
   "x": "Después del Evangelio, el lector dice"
  },
  {
   "t": "LECTOR",
   "x": "El Evangelio del Señor."
  },
  {
   "t": "PUEBLO",
   "x": "Te alabamos, Cristo Señor."
  },
  {
   "t": "T",
   "x": "EL SERMÓN"
  },
  {
   "t": "T",
   "x": "BAUTISMO, CONFIRMACION,"
  },
  {
   "t": "T",
   "x": "Y RENOVACIÓN DE LOS VOTOS BAUTISMALES"
  },
  {
   "t": "R",
   "x": "El Santo Bautismo puede administrarse aquí. La Confirmación también se puede administrar como se indica en Instrucciones Adicionales. En ausencia de Candidatos para el Bautismo o Confirmación, el Celebrante dirige al pueblo en la Renovación de los Votos Bautismales."
  }
 ],
 "easterVigilRenewal": [
  {
   "t": "T",
   "x": "RENOVACIÓN DE LAS PROMESAS BAUTISMALES"
  },
  {
   "t": "R",
   "x": "Si no hay bautismos o confirmaciones en la Vigilia Pascual, la Renovación de las Promesas Bautismales tiene lugar después del Servicio de las Lecturas o del Sermón. En otras ocasiones, la Renovación de Promesas sigue al Sermón. El Credo Niceno no se dice."
  },
  {
   "t": "R",
   "x": "La gente se pone de pie. El Celebrante se dirige a la Congregación con estas u otras palabras similares"
  },
  {
   "t": "P",
   "x": "Mediante el misterio Pascual, queridos hermanos, somos sepultados con Cristo por el Bautismo en su muerte y resucitados con él a la vida nueva. Por tanto, los exhorto [ahora que nuestra observancia de la Cuaresma ha terminado] a renovar las solemnes promesas y votos del Santo Bautismo, por las que una vez renunciamos a Satanás y a todas sus obras, y prometimos servir a Dios fielmente en su única santa Iglesia católica y apostólica."
  },
  {
   "t": "CEL",
   "x": "¿Renuevas tú, aquí en la presencia de Dios y de la Iglesia, las solemnes promesas y votos hechos en tu Bautismo y te comprometes a cumplirlos?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, me comprometo."
  },
  {
   "t": "CEL",
   "x": "¿Renuncias a Satanás y a todas sus fuerzas espirituales de maldad que se rebelan contra Dios?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, renuncio."
  },
  {
   "t": "CEL",
   "x": "¿Renuncias a las promesas vacías y los engaños mortales de este mundo que corrompen y destruyen a las criaturas de Dios?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, renuncio."
  },
  {
   "t": "CEL",
   "x": "¿Renuncias a los deseos pecaminosos de la carne que te apartan del amor de Dios?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, renuncio."
  },
  {
   "t": "CEL",
   "x": "¿Te conviertes a Jesucristo y lo confiesas como tu Señor y Salvador?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, lo confieso."
  },
  {
   "t": "CEL",
   "x": "¿Recibes con alegría la fe cristiana, como revelada en las Sagradas Escrituras del Antiguo y Nuevo Testamento?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, recibo la fe cristiana."
  },
  {
   "t": "CEL",
   "x": "¿Guardarás obedientemente la santa voluntad y los mandamientos de Dios y caminarás en ellos todos los días de tu vida?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, lo haré con la ayuda del Señor."
  },
  {
   "t": "R",
   "x": "El Celebrante continúa"
  },
  {
   "t": "P",
   "x": "Reafirmemos ahora nuestra fe en las palabras de la antigua confesión bautismal, el Credo de los Apóstoles."
  },
  {
   "t": "CEL",
   "x": "¿Creen y confían en Dios Padre?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, creo. Creo en Dios Padre todopoderoso, creador del cielo y de la tierra."
  },
  {
   "t": "CEL",
   "x": "¿Crees y confías en Jesucristo?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, creo. Creo en Jesucristo, su único Hijo, Nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos, y está sentado a la derecha de Dios Padre. Desde allí ha de venir a juzgar a vivos y muertos."
  },
  {
   "t": "CEL",
   "x": "¿Crees y confías en el Espíritu Santo?"
  },
  {
   "t": "PUEBLO",
   "x": "Sí, creo. Creo en el Espíritu Santo, la Santa Iglesia Católica, la comunión de los santos, el perdón de los pecados, la resurrección de los muertos y la vida eterna. Amén."
  },
  {
   "t": "R",
   "x": "El Celebrante concluye la Renovación de Votos de la siguiente manera"
  },
  {
   "t": "P",
   "x": "Oremos:"
  },
  {
   "t": "P",
   "x": "Dios Todopoderoso, que has edificado a tu Iglesia sobre el fundamento de los Apóstoles y Profetas, siendo el mismo Jesucristo la principal piedra angular: concédenos que estemos unidos en unidad de espíritu por su doctrina, para que seamos hechos un templo santo que te agrade; Por Jesucristo nuestro Señor, que vive y reina contigo y el Espíritu Santo, un solo Dios, por los siglos de los siglos. Amén."
  }
 ],
 "easterVigilContinues": [
  {
   "t": "R",
   "x": "La celebración continúa con las Oración de los Fieles."
  },
  {
   "t": "R",
   "x": "El Prefacio de Pascua se utiliza en la Eucaristía."
  }
 ],
 "easterVigilBlessing": [
  {
   "t": "R",
   "x": "La siguiente bendición puede usarse al final de la liturgia, en lugar de la bendición habitual."
  },
  {
   "t": "P",
   "x": "El Dios de paz, que resucitó de entre los muertos a nuestro Señor Jesucristo, el gran Pastor de las ovejas, por la sangre del pacto eterno, los perfeccione en toda buena obra para hacer su voluntad, obrando en ustedes lo bueno y agradable a su vista; y la bendición de Dios Todopoderoso, Padre, Hijo y Espíritu Santo, esté con ustedes y permanezca con ustedes para siempre. Amén"
  }
 ]
};
