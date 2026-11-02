/**
 * holyweek-data.js — Liturgias de la Semana Santa (Libro de Oración Común 2019, ACNA).
 * GENERADO por bcp2019-tools/build-holyweek.js a partir del libro oficial en español (LOC-10-10-23.md); NO editar a
 * mano: test-bcp2019.js comprueba que sigue idéntico a lo que genera el script. Texto copiado, no traducido.
 * Procedencia: palmSundayPalms LOC l. 14728-14794; maundyThursdayOpening LOC l. 14844-14858; maundyThursdayFootWashing LOC l. 14875-14902; maundyThursdayClosing LOC l. 14903-14911; goodFriday LOC l. 14939-15244; holySaturday LOC l. 15248-15315; easterVigilIntro LOC l. 15318-15337; easterVigilLight LOC l. 15341-15440; easterVigilReadings LOC l. 15441-15572; easterVigilWord LOC l. 15573-15633; easterVigilBlessing LOC l. 15634-15641.
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
   "x": "El Santo Bautismo es el Sacramento a través del cual los candidatos se unen a la muerte y resurrección de Jesucristo (ROMANOS 6: 3-4), que la Iglesia celebra en esta noche santísima. Cuando el Obispo está presente, también se puede administrar la Confirmación. Si no hay candidatos para el Bautismo o la Confirmación, la"
  },
  {
   "t": "R",
   "x": "Congregación se une a la Renovación de los Votos Bautismales."
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
  },
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
  },
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
