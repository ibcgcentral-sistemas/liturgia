// Genera las tablas markdown clave-por-clave y los conteos. Las lineas del app se leen de propers.js (no a mano).
const fs = require('fs');
const P = fs.readFileSync('C:/Users/gonza/OneDrive/Desktop/liturgia/bcp2019/js/propers.js', 'utf8').split(/\r?\n/);
function appLine(key) {
  const re = /^\d\d-\d\d$/.test(key) ? new RegExp("^\\s+'" + key + "':") : new RegExp('^\\s+' + key + ':');
  for (let i = 0; i < 130; i++) if (re.test(P[i])) return i + 1;
  return '?';
}
const { CLS } = require('./colectas-sim3.js');

// [clave, dia (calendar.js), ref libro (lineas md / pagina), primera frase EN, clase, nota, sev]
const A = [
 ['advent1','1º Dom. Adviento','16773-16781 / p.598','Almighty God, give us grace to cast away the works of darkness','COINCIDE','',''],
 ['advent2','2º Dom. Adviento','16782-16789 / p.598','Blessed Lord, who caused all Holy Scriptures to be written for our learning','COINCIDE','',''],
 ['advent3','3º Dom. Adviento (Gaudete)','16793-16801 / p.599','O Lord Jesus Christ, you sent your messengers the prophets to preach repentance','VARIANTE','Primera cláusula distinta ("tu mensajero" frente a "tus mensajeros los profetas") y el app omite la cláusula "volviendo los corazones de los desobedientes a la sabiduría de los justos".','baja'],
 ['advent4','4º Dom. Adviento','16805-16812 / p.599','Stir up your power, O Lord, and with great might come among us','DISTINTA','El texto del app ("Purifica nuestras conciencias… morada preparada") no figura en pp.598-640 (búsqueda de sus frases distintivas: 0 aciertos en la sección de colectas).','alta'],
 ['christmas','Natividad (25 dic)','16824-16830 / p.600','Almighty God, you have given your only-begotten Son to take our nature upon him','COINCIDE','Cuerpo parafraseado; la conclusión difiere ("honor y gloria" en el libro).','baja'],
 ['christmasSunday','Dom. 26 dic-1 ene ("1º después de Navidad")','16837-16842 / p.600','Almighty God, you have poured upon us the new light of your incarnate Word','DISTINTA','El texto del app es la colecta del 2º Domingo de Navidad (16856-16861, p.601). La del libro para este domingo no está en el app.','alta'],
 ['christmasSunday2','2º Dom. después de Navidad (2-5 ene)','16856-16861 / p.601','O God, who wonderfully created, and yet more wonderfully restored, the dignity of human nature','DISTINTA','Texto híbrido: abre como la del 1er Dom. de Navidad ("nueva luz") y cierra como la de Nochebuena (16816-16820, "known the mystery of that Light on earth… enjoy him perfectly in heaven"). La del libro para este domingo está, pero bajo la clave christmasSunday.','alta'],
 ['circumcision','(CLAVE HUÉRFANA: el calendario no la emite; el 1 ene usa "01-01")','16844-16852 / p.600','Almighty God, your blessed Son fulfilled the covenant of circumcision for our sake','VARIANTE','Texto de la familia clásica ("circuncidado y obediente a la Ley"); inalcanzable. Verificado: 0 días en 2024-2060.','baja'],
 ['epiphany','La Epifanía (6 ene)','16864-16870 / p.601','O God, by the leading of a star you manifested your only Son to the peoples of the earth','COINCIDE','Apertura distinta ("guiaste a los sabios hasta la adoración" frente a "manifestaste a tu único Hijo a los pueblos de la tierra"); el resto equivale.','baja'],
 ['epiphany1','Bautismo del Señor (Epif. 1)','16877-16884 / p.601','Eternal Father, at the baptism of Jesus you revealed him to be your Son, and your Holy Spirit descended upon him like a dove','VARIANTE','Mismo tema, redacción distinta; la petición difiere ("guardar el pacto… confesar a Cristo" frente a "nacidos del agua y del Espíritu… fieles como hijos adoptivos").','media'],
 ['epiphany2','2º Dom. después de Epifanía','16888-16894 / p.602','Almighty God, whose Son our Savior Jesus Christ is the light of the world','DISTINTA','Texto del app ("cuyo Hijo se manifestó en gran humildad… la belleza de su majestad") sin equivalente en pp.598-640. La del libro está, parafraseada, en la clave epiphany5.','alta'],
 ['epiphany3','3º Dom. después de Epifanía','16896-16901 / p.602','Give us grace, O Lord, to answer readily the call of our Savior Jesus Christ','COINCIDE','',''],
 ['epiphany4','4º Dom. después de Epifanía','16903-16910 / p.602','O God, you know that we are set in the midst of many grave dangers','DISTINTA','Texto del app (bienaventuranzas) sin equivalente en pp.598-640.','alta'],
 ['epiphany5','5º Dom. después de Epifanía','16922-16927 / p.603','O Lord, our heavenly Father, keep your household the Church continually in your true religion','DISTINTA','Texto del app = paráfrasis de la colecta del 2º Dom. de Epifanía (16888-16894).','alta'],
 ['epiphany6','6º Dom. después de Epifanía','16929-16933 / p.603','Almighty God, look mercifully upon your people','DISTINTA','Texto del app ("sabiduría para percibir tu voluntad…") sin equivalente en pp.598-640.','alta'],
 ['epiphany7','7º Dom. después de Epifanía','16935-16942 / p.603','O God, the strength of all who put their trust in you','DISTINTA','Texto del app ("amar a nuestros enemigos") sin equivalente en la sección de colectas.','alta'],
 ['epiphany8','8º Dom. después de Epifanía','16946-16952 / p.604','Almighty and merciful God, in your goodness keep us, we pray, from all things that may hurt us','DISTINTA','Texto del app = colecta del Propio 17 (17412-17415); idéntico a la clave proper17.','alta'],
 ['transfiguration','Último Dom. después de Epifanía (Transfiguración)','16965-16973 / p.604','O God, who before the passion of your only-begotten Son revealed his glory upon the holy mountain','COINCIDE','',''],
 ['ashWednesday','Miércoles de Ceniza','16978-16985 / p.605 y 15446-15452 / p.544','Almighty and everlasting God, you hate nothing you have made','COINCIDE','Omite la conclusión larga que sí trae el español oficial (LOC 14500-14502).','baja'],
 ['lent1','1º Dom. de Cuaresma','16990-16995 / p.605','Almighty God, whose blessed Son was led by the Spirit to be tempted by Satan','DISTINTA','Texto del app (ayuno de cuarenta días / abstinencia) sin equivalente en la sección de colectas.','alta'],
 ['lent2','2º Dom. de Cuaresma','16999-17005 / p.605','Almighty God, you know that we have no power in ourselves to help ourselves','DISTINTA','Texto del app ("cuya gloria es siempre tener misericordia") sin equivalente en la sección de colectas. La del libro está en la clave lent3.','alta'],
 ['lent3','3º Dom. de Cuaresma','17010-17015 / p.606','Heavenly Father, you have made us for yourself, and our hearts are restless until they rest in you','DISTINTA','Texto del app = colecta del 2º Dom. de Cuaresma (16999-17005).','alta'],
 ['lent4','4º Dom. de Cuaresma (Laetare)','17018-17022 / p.606','Gracious Father, whose blessed Son Jesus Christ came down from heaven to be the true bread','DISTINTA','Texto del app ("has prometido perdón y misericordia a los que se arrepienten") sin equivalente en la sección de colectas.','alta'],
 ['lent5','5º Dom. de Cuaresma (Pasión)','17026-17032 / p.606','Almighty God, you alone can bring into order the unruly wills and affections of sinners','DISTINTA','Texto del app = colecta del VIERNES SANTO (17081-17085; LOC 14947-14950): un domingo de Cuaresma imprime la oración del Viernes Santo.','alta'],
 ['palmSunday','Domingo de Ramos','17038-17044 / p.607 y 15777-15783 / p.557','Almighty and everlasting God, in your tender love for us you sent your Son our Savior Jesus Christ','VARIANTE','Cotejo con LOC 14801-14806: el app dice "sigamos el ejemplo de su paciencia" (LOC: "caminemos en el camino de su sufrimiento"), "nuestra carne" (LOC: "naturaleza") y omite la conclusión larga.','baja'],
 ['maundyThursday','Jueves Santo','17072-17078 / p.608 y 15849-15855 / p.561','Almighty Father, whose most dear Son, on the night before he suffered, instituted the Sacrament of his Body and Blood','COINCIDE','Cotejo con LOC 14863-14868: invocación "Dios Todopoderoso" (LOC: "Padre todopoderoso"), "en memoria de él" (LOC: "de Jesucristo nuestro Salvador") y conclusión distinta.','baja'],
 ['goodFriday','Viernes Santo','17081-17085 / p.608 y 15942-15946 / p.565','Almighty God, we beseech you graciously to behold this your family','COINCIDE','Idéntica al español oficial (LOC 14947-14950) salvo artículos.',''],
 ['holySaturday','Sábado Santo','17087-17091 / p.608 (1ª) y 17095-17099 / p.609 (2ª); 16284-16294 / p.578','O God, Creator of heaven and earth: Grant that, as the crucified body of your dear Son was laid in the tomb… (o) O God of the living, on this day your Son our Savior descended to the place of the dead','VARIANTE','Cotejo con LOC 15251-15259: no coincide con ninguna de las dos opciones; sigue la estructura de la 1ª pero con otra invocación, añade "sepultados con él por el bautismo" y cambia la petición final ("la mañana de la resurrección" frente a "el tercer día… vida nueva").','media'],
 ['easter','Domingo de Resurrección','17111-17117 / p.609 (alt. 17123-17128 / p.610)','Almighty God, who through your only-begotten Son Jesus Christ overcame death and opened to us the gate of everlasting life','VARIANTE','Primera mitad igual; la petición difiere ("como nos das el buen deseo… lo llevemos a buen efecto" frente a "celebrando con gozo la resurrección… libres del pecado y resucitados de la muerte").','media'],
 ['easter2','2º Dom. de Pascua','17181-17186 / p.612','Almighty and everlasting God, who in the Paschal mystery established the new covenant of reconciliation','DISTINTA','Texto del app ("solemnidad pascual… herencia eterna") sin equivalente en la sección de colectas.','alta'],
 ['easter3','3º Dom. de Pascua','17189-17194 / p.612','Almighty God, you gave your only Son to be for us both a sacrifice for sin and an example of godly living','DISTINTA','Texto del app = colecta del MIÉRCOLES de la Semana de Pascua (17146-17150).','alta'],
 ['easter4','4º Dom. de Pascua (Buen Pastor)','17197-17202 / p.612','O God, whose Son Jesus Christ is the Good Shepherd of your people','COINCIDE','',''],
 ['easter5','5º Dom. de Pascua','17205-17212 / pp.612-613','Almighty God, whom truly to know is everlasting life','COINCIDE','Final parafraseado ("plenitud de tu presencia" frente a "the way that leads to eternal glory").','baja'],
 ['easter6','6º Dom. de Pascua','17215-17221 / p.613','O God, you have prepared for those who love you such good things as surpass our understanding','DISTINTA','Texto del app = "Colecta por la paz" del Oficio Diario (1366-1371), no una colecta del año cristiano; idéntico en espíritu a proper21.','alta'],
 ['easter7','7º Dom. de Pascua (Dom. después de la Ascensión)','17233-17238 / p.613','O God, the King of glory, you have exalted your only Son Jesus Christ with great triumph','COINCIDE','',''],
 ['ascension','La Ascensión','17225-17228 / p.613','Almighty God, whose only-begotten Son our Lord Jesus Christ ascended into heaven','COINCIDE','',''],
 ['pentecost','Día de Pentecostés','17243-17249 (1ª) y 17252-17257 (2ª) / p.614','Almighty God, on this day, through the outpouring of the Holy Spirit… (o) O God, who on this day taught the hearts of your faithful people','COINCIDE','Corresponde a la 2ª opción ("or this"); la 1ª opción no está en el app.','baja'],
 ['trinitySunday','La Santísima Trinidad','17273-17279 / p.615','Almighty and everlasting God, you have given to us your servants grace, by the confession of a true faith','VARIANTE','Primera parte igual; la petición final difiere ("mantennos firmes… nos defiendas de todo peligro" frente a "firmes en esta fe y adoración, y llévanos a ver tu gloria eterna").','baja'],
];
const PR = [
 [3,'17300-17306 / p.616','O Lord, we entreat you mercifully to hear us','D','Texto del app ("gracia… purifique nuestros corazones… descansemos en ti") sin equivalente en la sección de colectas.'],
 [4,'17307-17315 / p.616','O God, the protector of all those who trust in you','D','Texto del app (casa sobre la roca) sin equivalente en la sección de colectas.'],
 [5,'17316-17322 / p.616','Grant, O Lord, that the course of this world may be so peaceably ordered','D','Texto del app = colecta del Propio 11 (17363-17370).'],
 [6,'17323-17329 / p.616','O Lord, from whom all good proceeds','D','Texto del app = colecta del Propio 15 (17396-17402).'],
 [7,'17332-17339 / p.617','Lord of all power and might, the author and giver of all good things','D','Texto del app = familia de la colecta del Propio 2 (17292-17297, "never fail to support and govern… perpetual fear and love of your holy Name").'],
 [8,'17340-17346 / p.617','O God, your never-failing providence sets in order all things both in heaven and on earth','D','Texto del app (Iglesia sobre el fundamento de apóstoles y profetas) sin equivalente en la sección de colectas.'],
 [9,'17347-17353 / p.617','Grant us, O Lord, we pray, the spirit to think and do always those things that are right','D','Texto del app ("yugo fácil… carga ligera") sin equivalente en la sección de colectas.'],
 [10,'17354-17360 / p.617','Let your merciful ears, O Lord, be open to the prayers of your humble servants','D','Texto del app ("corazón compasivo como el del buen samaritano") sin equivalente en ningún lugar del libro; forma no litúrgica.'],
 [11,'17363-17370 / p.618','O God, you declare your almighty power chiefly in showing mercy and pity','D','Texto del app = colecta del Propio 4 (17309-17315).'],
 [12,'17371-17380 / p.618','Almighty and everlasting God, you are always more ready to hear than we to pray','D','Texto del app ("enséñanos a orar") sin equivalente en el libro; la colecta oficial de este Propio está en la clave proper19.'],
 [13,'17381-17387 / p.618','Almighty and merciful God, it is only by your grace that your faithful people offer you true and laudable service','C',''],
 [14,'17388-17395 / pp.618-619','Almighty God, give us the increase of faith, hope, and love','D','Texto del app ("fe para vivir sin temor, como Abraham") sin equivalente en el libro; la colecta oficial está en la clave proper24.'],
 [15,'17396-17402 / p.619','Keep your Church, O Lord, by your perpetual mercy','D','Texto del app ("cosas escondidas a los sabios") sin equivalente en el libro; la colecta oficial está en la clave proper6.'],
 [16,'17403-17409 / p.619','Let your continual mercy, O Lord, cleanse and defend your Church','C','Texto repetido en proper25.'],
 [17,'17410-17415 / p.619','O Lord, we pray that your grace may always precede and follow after us','C','Texto repetido en epiphany8 y (casi igual) en proper23.'],
 [18,'17416-17422 / p.619','O Lord God, grant your people grace to withstand the temptations of the world, the flesh, and the devil','D','Texto del app (corrección fraterna) sin equivalente en la sección de colectas.'],
 [19,'17425-17431 / p.620','O God, because without you we are not able to please you','D','Texto del app = colecta del Propio 12 (17371-17380).'],
 [20,'17434-17442 / p.620','O Lord, you have taught us that without love, all our deeds are worth nothing','D','Texto del app = colecta del Propio 11 (17363-17370); idéntico a proper5.'],
 [21,'17443-17449 / p.620','O merciful Lord, grant to your faithful people pardon and peace','D','Texto del app = "Colecta por la paz" del Oficio Diario (1366-1371); casi igual a easter6.'],
 [22,'17450-17459 / pp.620-621','Keep, O Lord, your household the Church in continual godliness','D','Texto del app ("Señor Jesucristo, uniste el cielo y la tierra…") sin equivalente en el libro.'],
 [23,'17460-17466 / p.621','O God, our refuge and strength, true source of all godliness','D','Texto del app = colecta del Propio 17 (17410-17415).'],
 [24,'17467-17473 / p.621','Set us free, loving Father, from the bondage of our sins','D','Texto del app = colecta del Propio 14 (17388-17395).'],
 [25,'17474-17480 / p.621','Almighty and everlasting God, you govern all things both in heaven and on earth','D','Texto del app = colecta del Propio 16 (17403-17409); idéntico a proper16.'],
 [26,'17493-17499 / p.622','Grant us, Lord, not to be anxious about earthly things, but to love things heavenly','D','Texto del app ("fuente de toda santidad… tus santos") sin equivalente en la sección de colectas.'],
 [27,'17500-17508 / p.622','O God, whose blessed Son came into the world that he might destroy the works of the devil','D','Texto del app (viuda que dio todo) sin equivalente en la sección de colectas.'],
 [28,'17509-17517 / pp.622-623','Stir up, O Lord, the wills of your faithful people','D','Texto del app ("dio su Cuerpo a ser entregado… Santísimo Sacramento") sin equivalente en la sección de colectas.'],
 [29,'17518-17527 / p.623','Almighty and everlasting God, whose will it is to restore all things in your well-beloved Son','C',''],
];
const RANGES = {3:'22-28 may',4:'29 may-4 jun',5:'5-11 jun',6:'12-18 jun',7:'19-25 jun',8:'26 jun-2 jul',9:'3-9 jul',10:'10-16 jul',11:'17-23 jul',12:'24-30 jul',13:'31 jul-6 ago',14:'7-13 ago',15:'14-20 ago',16:'21-27 ago',17:'28 ago-3 sep',18:'4-10 sep',19:'11-17 sep',20:'18-24 sep',21:'25 sep-1 oct',22:'2-8 oct',23:'9-15 oct',24:'16-22 oct',25:'23-29 oct',26:'30 oct-5 nov',27:'6-12 nov',28:'13-19 nov',29:'20 nov-3 dic'};
const CN = { C: 'COINCIDE', V: 'VARIANTE', D: 'DISTINTA' };
PR.forEach(([n, ref, ph, c, note]) => A.push(['proper' + n, 'Propio ' + n + ' (dom. ' + RANGES[n] + ')', ref, ph, CN[c], note, c === 'D' ? 'alta' : (note ? 'baja' : '')]));

const B = [
 ['01-01','El Santo Nombre (1 ene)','17580-17589 / p.625 (= 16844-16853 / p.600)','Almighty God, your blessed Son fulfilled the covenant of circumcision for our sake, and was given the Name that is above every name','VARIANTE','Misma colecta en versión clásica ("circuncidado y obediente a la Ley… escribirlo en nuestros corazones"); idéntica en texto a la clave huérfana "circumcision".','baja'],
 ['01-18','La Confesión de San Pedro','17592-17599 / p.626','Almighty Father, who inspired Simon Peter, first among the apostles, to confess Jesus as Messiah','COINCIDE','',''],
 ['01-25','La Conversión de San Pablo','17601-17608 / p.626','O God, by the preaching of your apostle Paul you have caused the light of the Gospel to shine throughout the world','COINCIDE','',''],
 ['02-02','La Presentación del Señor','17610-17616 / p.626 (= 16914-16920 / p.603)','Almighty and everliving God, we humbly pray that, as your only-begotten Son was this day presented in the temple','COINCIDE','',''],
 ['02-24','San Matías','17620-17627 / p.627','Almighty God, who in the place of Judas chose your faithful servant Matthias','COINCIDE','',''],
 ['03-19','San José','17629-17636 / p.627','O God, who from the family of your servant David raised up Joseph to be the guardian of your incarnate Son','COINCIDE','',''],
 ['03-25','La Anunciación','17638-17645 / p.627','Pour your grace into our hearts, O Lord, that we who have known the incarnation of your Son Jesus Christ','COINCIDE','',''],
 ['04-25','San Marcos','17649-17657 / p.628','Almighty God, by the hand of Mark the evangelist you have given to your Church the Gospel of Jesus Christ','COINCIDE','El app omite la acción de gracias por su testimonio; el resto equivale.','baja'],
 ['05-01','SS. Felipe y Santiago','17659-17666 / p.628','Almighty God, you gave to your apostles Philip and James the grace and strength to bear witness to Jesus as the way, the truth, and the life','VARIANTE','El cuerpo del app es la colecta del 5º Dom. de Pascua (a quien conocer es vida eterna) con los nombres de los apóstoles; comparte "camino, verdad y vida" pero no la petición oficial ("victoria de su fe… glorificar el Nombre").','media'],
 ['05-31','La Visitación','17668-17675 / p.628','Almighty God, by whose grace Elizabeth rejoiced with the blessed Virgin Mary and greeted her as the mother of the Lord','VARIANTE','Mismo tema (María e Isabel, "magnificar tu Nombre") con redacción distinta. Caso frontera VARIANTE/DISTINTA.','media'],
 ['06-11','San Bernabé','17679-17687 / p.629','Grant, O God, that we may follow the example of your faithful servant Barnabas','VARIANTE','Comparten la imitación de su generosidad, pero el app abre con "dones del Espíritu Santo para consolar a los afligidos". Caso frontera VARIANTE/DISTINTA.','media'],
 ['06-24','Natividad de San Juan Bautista','17689-17698 / p.629','Almighty God, by whose providence your servant John the Baptist was wonderfully born','VARIANTE','Versión abreviada: omite "arrepentirnos verdaderamente, reprender el vicio con valentía, sufrir con paciencia por la verdad".','baja'],
 ['06-29','SS. Pedro y Pablo','17700-17707 / p.629','Almighty God, whose blessed apostles Peter and Paul glorified you by their martyrdom','COINCIDE','',''],
 ['07-22','Santa María Magdalena','17711-17718 / p.630','Almighty God, whose blessed Son restored Mary Magdalene to health of body and of mind','DISTINTA','El app habla de la primera aparición y de proclamar a Cristo resucitado; el libro pide ser sanados de toda enfermedad. Sin equivalente en la sección de colectas.','media'],
 ['07-25','Santiago, Apóstol','17720-17728 / p.630','O gracious God, your servant and apostle James was first among the Twelve to suffer martyrdom','DISTINTA','El app trae la colecta clásica del llamado de Santiago ("dejando padre y bienes… sin demora"); el libro pide el espíritu de servicio de los líderes de la Iglesia. Sin equivalente.','media'],
 ['08-06','La Transfiguración (6 ago)','17730-17737 / p.630','O God, who on the holy mount revealed to chosen witnesses your well-beloved Son, wonderfully transfigured','DISTINTA','Texto del app = colecta del Último Dom. de Epifanía (16965-16973; idéntica a la clave transfiguration). El libro tiene otra para la fiesta.','media'],
 ['08-15','Santa María Virgen','17741-17748 / p.631','O God, you have taken to yourself the blessed Virgin Mary, mother of your incarnate Son','DISTINTA','Texto del app (humildad de María, su intercesión) sin equivalente en la sección de colectas.','media'],
 ['08-24','San Bartolomé','17750-17757 / p.631','Almighty and everlasting God, you gave your apostle Bartholomew grace truly to believe and to preach your Word','COINCIDE','',''],
 ['09-14','La Santa Cruz','17759-17766 / p.631','Almighty God, whose Son our Savior Jesus Christ was lifted high upon the Cross that he might draw the whole world to himself','COINCIDE','',''],
 ['09-21','San Mateo','17770-17777 / p.632','Lord Jesus, you called Matthew from collecting taxes to become your apostle and evangelist','VARIANTE','Versión clásica dirigida al Padre; el libro la dirige a Cristo y añade "proclamar al mundo las buenas nuevas".','baja'],
 ['09-29','San Miguel y Todos los Ángeles','17779-17787 / p.632','Everlasting God, you have ordained and constituted in a wonderful order the ministries of angels and mortals','COINCIDE','',''],
 ['10-18','San Lucas','17789-17796 / p.632','Almighty God, you called your servant Luke to be an evangelist and physician of the soul','COINCIDE','',''],
 ['10-23','Santiago de Jerusalén','17800-17807 / p.633','Grant, O God, that, following the example of your apostle James the Just, kinsman of our Lord','DISTINTA','El app pide "piedad y prudencia" y habla de gobernar la Iglesia; el libro pide oración continua y reconciliación de los enemistados. Sin equivalente.','media'],
 ['10-28','SS. Simón y Judas','17809-17815 / p.633','Grant, O God, that as your apostles Simon and Jude were faithful and zealous in their mission','DISTINTA','Texto del app ("conocimiento de tu Nombre… camino, verdad y vida") sin equivalente en la sección de colectas.','media'],
 ['11-01','Todos los Santos','17817-17825 / p.633 (= 17483-17491 / p.622)','Almighty God, you have knit together your elect in one communion and fellowship','COINCIDE','Falla la ELECCIÓN cuando 1 nov cae en domingo (ver §6).',''],
 ['11-30','San Andrés','17531-17538 / p.624','Almighty God, you gave such grace to your apostle Andrew','COINCIDE','',''],
 ['12-21','Santo Tomás','17540-17547 / p.624','Everliving God, you strengthened your apostle Thomas with firm and certain faith','COINCIDE','',''],
 ['12-26','San Esteban','17549-17556 / p.624','O Glorious Lord, your servant Stephen looked up to heaven and prayed for his persecutors','COINCIDE','Traducción muy libre; mismo sentido.','baja'],
 ['12-27','San Juan, Apóstol y Evangelista','17560-17567 / p.625','Shed upon your Church, O Lord, the brightness of your light','COINCIDE','',''],
 ['12-28','Los Santos Inocentes','17569-17578 / p.625','Almighty God, out of the mouths of children you manifest your truth','VARIANTE','Misma colecta con apertura distinta y sin la parte "te mostrarías fuerte en nuestra debilidad"; conserva "mortifica todo mal". Caso frontera.','media'],
];
B.forEach(r => { if (r[4] !== { C: 'COINCIDE', V: 'VARIANTE', D: 'DISTINTA' }[CLS[r[0]]]) throw new Error('clase inconsistente ' + r[0]); });
A.forEach(r => { if (r[4] !== { C: 'COINCIDE', V: 'VARIANTE', D: 'DISTINTA' }[CLS[r[0]]]) throw new Error('clase inconsistente ' + r[0]); });

function md(rows) {
  const out = ['| # | Clave (propers.js) | Día (calendar.js) | Colecta oficial del día: libro (línea md / pág.) y primera frase EN | Clase | Evidencia / texto real del app | Sev. |', '|---|---|---|---|---|---|---|'];
  rows.forEach((r, i) => out.push(`| ${i + 1} | \`${r[0]}\` (l.${appLine(r[0])}) | ${r[1]} | ${r[2]}: "${r[3]}" | **${r[4]}** | ${r[5] || '—'} | ${r[6] || '—'} |`));
  return out.join('\n');
}
const all = [...A, ...B];
const cnt = {}, sev = {};
all.forEach(r => { cnt[r[4]] = (cnt[r[4]] || 0) + 1; sev[r[6] || '-'] = (sev[r[6] || '-'] || 0) + 1; });
const cntA = {}, cntB = {};
A.forEach(r => cntA[r[4]] = (cntA[r[4]] || 0) + 1); B.forEach(r => cntB[r[4]] = (cntB[r[4]] || 0) + 1);
const sevD = {}; all.filter(r => r[4] === 'DISTINTA').forEach(r => sevD[r[6]] = (sevD[r[6]] || 0) + 1);
const sevV = {}; all.filter(r => r[4] === 'VARIANTE').forEach(r => sevV[r[6]] = (sevV[r[6]] || 0) + 1);
console.error(JSON.stringify({ total: all.length, A: A.length, B: B.length, cnt, cntA, cntB, sev, sevD, sevV }));
const dir = 'C:/Users/gonza/AppData/Local/Temp/claude/C--Users-gonza--claude-spares-spare-320q1O/32d60538-cb48-45dc-a1f2-a08867b44fe6/scratchpad/audit/';
fs.writeFileSync(dir + 'colectas-tablaA.md', md(A), 'utf8');
fs.writeFileSync(dir + 'colectas-tablaB.md', md(B).replace(/^\| # .*\n\|---.*\n/, m => m), 'utf8');
