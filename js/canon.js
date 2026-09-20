/**
 * canon.js — El Ordinario de la Misa (Misal Anglicano)
 * HTML estructurado con clases: .lit-line .sacerdote/.pueblo/.ministros/.lector
 * Soporte dinámico para Español, Latín y Bilingüe (Paralelo).
 */

const Canon = (() => {

  let currentLang = 'es';
  let currentDayKey = null;

  // ── Helpers para construir líneas de diálogo ──────────────────────────────
  const S  = (txt) => `<span class="lit-line sacerdote"><span class="lit-label">S.</span><span class="lit-text">${txt}</span></span>`;
  const M  = (txt) => `<span class="lit-line ministros"><span class="lit-label">M.</span><span class="lit-text">${txt}</span></span>`;
  const P  = (txt) => `<span class="lit-line pueblo"><span class="lit-label">P.</span><span class="lit-text">${txt}</span></span>`;
  const L  = (txt) => `<span class="lit-line lector"><span class="lit-label">L.</span><span class="lit-text">${txt}</span></span>`;
  const SP = (txt) => `<span class="lit-line todos"><span class="lit-label">S.+P.</span><span class="lit-text">${txt}</span></span>`;
  const R  = (txt) => `<span class="lit-rubric">(${txt})</span>`;
  const T  = (txt) => `<span class="lit-title">${txt}</span>`;
  const C  = (txt) => `<span class="lit-consecracion">${txt}</span>`;
  const O  = (txt) => `<span class="lit-prayer">${txt}</span>`;

  // ── Función de zipeado bilingüe / selección de idioma ─────────────────────
  // Con pueblo=true, se sustituyen por una rúbrica para el Librito de Misa
  // para el Pueblo — que no debe reproducir palabra por palabra lo que solo
  // el Sacerdote y los ministros dicen o escuchan:
  //  - secret:true   → oraciones dichas en voz baja o en privado por el Sacerdote.
  //  - clergy:true   → diálogos exclusivos entre el Sacerdote y los Ministros
  //                    (sin parte del pueblo), p.ej. el Salmo 43 o el Confíteor.
  const SECRET_NOTE_ES = 'El Sacerdote reza en secreto una oración privada.';
  const SECRET_NOTE_LA = 'Sacerdos orat secreto.';
  const CLERGY_NOTE_ES = 'El Sacerdote y los Ministros dicen esto entre ellos.';
  const CLERGY_NOTE_LA = 'Sacerdos et Ministri hoc inter se dicunt.';

  function reduceForPueblo(arr) {
    const out = [];
    let inClergyRun = false;
    for (const item of arr) {
      if (item.secret) {
        out.push({ type: 'R', es: SECRET_NOTE_ES, la: SECRET_NOTE_LA });
        inClergyRun = false;
        continue;
      }
      if (item.clergy) {
        if (!inClergyRun) {
          out.push({ type: 'R', es: CLERGY_NOTE_ES, la: CLERGY_NOTE_LA });
          inClergyRun = true;
        }
        continue;
      }
      inClergyRun = false;
      out.push(item);
    }
    return out;
  }

  function zip(arr, pueblo = false) {
    if (pueblo) {
      arr = reduceForPueblo(arr);
    }
    if (currentLang === 'es') {
      return arr.map(item => {
        if (item.type === 'R') return R(item.es);
        if (item.type === 'T') return T(item.es);
        if (item.type === 'C') return C(item.es);
        if (item.type === 'O') return O(item.es);
        if (item.type === 'S') return S(item.es);
        if (item.type === 'M') return M(item.es);
        if (item.type === 'P') return P(item.es);
        if (item.type === 'L') return L(item.es);
        if (item.type === 'SP') return SP(item.es);
        return '';
      }).join('');
    } else if (currentLang === 'la') {
      return arr.map(item => {
        const text = item.la || item.es;
        if (item.type === 'R') return R(text);
        if (item.type === 'T') return T(text);
        if (item.type === 'C') return C(text);
        if (item.type === 'O') return O(text);
        if (item.type === 'S') return S(text);
        if (item.type === 'M') return M(text);
        if (item.type === 'P') return P(text);
        if (item.type === 'L') return L(text);
        if (item.type === 'SP') return SP(text);
        return '';
      }).join('');
    } else { // 'latin-es' (Bilingüe paralelo)
      return arr.map(item => {
        if (item.type === 'R') {
          return `<div class="lit-bilingual-row"><div class="lit-column-la">${R(item.la || item.es)}</div><div class="lit-column-es">${R(item.es)}</div></div>`;
        }
        if (item.type === 'T') {
          return `<div class="lit-bilingual-row"><div class="lit-column-la">${T(item.la || item.es)}</div><div class="lit-column-es">${T(item.es)}</div></div>`;
        }
        if (item.type === 'C') {
          return `<div class="lit-bilingual-row"><div class="lit-column-la">${C(item.la || item.es)}</div><div class="lit-column-es">${C(item.es)}</div></div>`;
        }
        if (item.type === 'O') {
          return `<div class="lit-bilingual-row"><div class="lit-column-la">${O(item.la || item.es)}</div><div class="lit-column-es">${O(item.es)}</div></div>`;
        }
        
        let laHtml = '';
        let esHtml = '';
        const laText = item.la || item.es;
        if (item.type === 'S') { laHtml = S(laText); esHtml = S(item.es); }
        else if (item.type === 'M') { laHtml = M(laText); esHtml = M(item.es); }
        else if (item.type === 'P') { laHtml = P(laText); esHtml = P(item.es); }
        else if (item.type === 'L') { laHtml = L(laText); esHtml = L(item.es); }
        else if (item.type === 'SP') { laHtml = SP(laText); esHtml = SP(item.es); }

        return `<div class="lit-bilingual-row"><div class="lit-column-la">${laHtml}</div><div class="lit-column-es">${esHtml}</div></div>`;
      }).join('');
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TEXTOS DE LA LITURGIA (DATOS ESTRUCTURADOS LATÍN / ESPAÑOL)
  // ══════════════════════════════════════════════════════════════════════════

  const JUDICA_ME_DATA = [
    { type: 'R', es: 'Se dice de rodillas al pie del altar, alternando entre el Sacerdote y los Ministros. Se omite desde el Domingo de Pasión hasta el Sábado Santo, y en las Misas de Difuntos.', la: 'Dicitur flexis genibus ad gradus altaris, alternatim inter Sacerdotem et Ministros. Omititur a Dominica Passionis usque ad Sabbatum Sanctum, et in Missis Defunctorum.' },
    { type: 'S', clergy: true, es: 'Júzgame, oh Dios, y defiende mi causa contra la gente impía; líbrame del hombre engañoso e inicuo.', la: 'Iudica me, Deus, et discerne causam meam de gente non sancta: ab homine iniquo et doloso erue me.' },
    { type: 'M', clergy: true, es: 'Porque tú eres el Dios de mi fortaleza, ¿por qué me has desechado? ¿Por qué andaré enlutado por la opresión del enemigo?', la: 'Quia tu es, Deus, fortitudo mea: quare me repulisti, et quare tristis incedo, dum affligit me inimicus?' },
    { type: 'S', clergy: true, es: 'Envía tu luz y tu verdad; éstas me guiarán, me conducirán a tu santo monte y a tus moradas.', la: 'Emitte lucem tuam et veritatem tuam: ipsa me deduxerunt, et adduxerunt in montem sanctum tuum, et in tabernacula tua.' },
    { type: 'M', clergy: true, es: 'Y entraré al altar de Dios, al Dios de mi alegría y de mi gozo; y te alabaré con arpa, oh Dios, Dios mío.', la: 'Et introibo ad altare Dei: ad Deum, qui laetificat iuventutem meam.' },
    { type: 'S', clergy: true, es: '¿Por qué te abates, alma mía, y por qué te turbas dentro de mí? Espera en Dios; porque aún he de alabarle, Salvación mía y Dios mío.', la: 'Quare tristis es, anima mea, et quare conturbas me? Spera in Deo, quoniam adhuc confitebor illi: salutare vultus mei, et Deus meus.' },
    { type: 'M', clergy: true, es: 'Gloria al Padre, y al Hijo, y al Espíritu Santo.', la: 'Gloria Patri, et Filio, et Spiritui Sancto.' },
    { type: 'S', clergy: true, es: 'Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.', la: 'Sicut erat in principio, et nunc, et semper: et in saecula saeculorum. Amen.' },
    { type: 'M', clergy: true, es: 'Entraré al altar de Dios.', la: 'Introibo ad altare Dei.' },
    { type: 'S', clergy: true, es: 'Al Dios de mi alegría y de mi gozo.', la: 'Ad Deum qui laetificat iuventutem meam.' }
  ];

  const CONFITEOR_DATA = [
    { type: 'R', es: 'El Sacerdote, inclinado profundamente:', la: 'Sacerdos profunde inclinatus dicit:' },
    { type: 'S', clergy: true, es: 'Yo confieso ante Dios Todopoderoso, ante la bienaventurada siempre Virgen María, ante San Miguel Arcángel, ante San Juan Bautista, ante los Santos Apóstoles Pedro y Pablo, ante todos los Santos, y ante vosotros, hermanos, que he pecado gravemente con el pensamiento, palabra y obra: (golpeándose el pecho tres veces) por mi culpa, por mi culpa, por mi grandísima culpa. Por tanto, ruego a la bienaventurada siempre Virgen María, a San Miguel Arcángel, a San Juan Bautista, a los Santos Apóstoles Pedro y Pablo, a todos los Santos, y a vosotros, hermanos, que roguéis por mí al Señor nuestro Dios.', la: 'Confiteor Deo omnipotenti, beatae Mariae semper Virgini, beato Michaeli Archangelo, beato Ioanni Baptistae, sanctis Apostolis Petro et Paulo, omnibus Sanctis, et vobis, fratres: quia peccavi nimis cogitatione, verbo et opere: (percutiens sibi pectus ter) mea culpa, mea culpa, mea maxima culpa. Ideo precor beatam Mariam semper Virginem, beatum Michaelem Archangelum, beatum Ioannem Baptistam, sanctos Apostolos Petrum et Paulum, omnes Sanctos, et vos, fratres, orare pro me ad Dominum Deum nostrum.' },
    { type: 'M', clergy: true, es: 'Dios Todopoderoso tenga misericordia de ti, perdone tus pecados, y te lleve a la vida eterna.', la: 'Misereatur tui omnipotens Deus, et, dimissis peccatis tuis, perducat te ad vitam aeternam.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' },
    { type: 'R', es: 'Los Ministros repiten el Confiteor, cambiando «vosotros, hermanos» por «a ti, Padre».', la: 'Ministri repetunt Confiteor, mutatis verbis «vobis, fratres» et «vos, fratres» in «tibi, Pater» et «te, Pater».' },
    { type: 'S', clergy: true, es: 'Dios Todopoderoso tenga misericordia de vosotros, perdone vuestros pecados, y os lleve a la vida eterna.', la: 'Misereatur vestri omnipotens Deus, et, dimissis peccatis vestris, perducat vos ad vitam aeternam.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' },
    { type: 'S', es: 'Que el Señor Todopoderoso y misericordioso nos conceda el perdón, la absolución y la remisión de todos nuestros pecados.', la: 'Indulgentiam, absolutionem et remissionem peccatorum nostrorum tribuat nobis omnipotens et misericors Dominus.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' }
  ];

  const ASCENT_DATA = [
    { type: 'R', es: 'Subiendo al altar:', la: 'Ascendens ad altare dicit:' },
    { type: 'S', es: 'Tú nos volverás a dar la vida, oh Dios:', la: 'Deus, tu conversus vivificabis nos.' },
    { type: 'M', es: 'Y tu pueblo se alegrará en ti.', la: 'Et plebs tua laetabitur in te.' },
    { type: 'S', es: 'Muéstranos, Señor, tu misericordia:', la: 'Ostende nobis, Domine, misericordiam tuam.' },
    { type: 'M', es: 'Y danos tu salvación.', la: 'Et salutare tuum da nobis.' },
    { type: 'S', es: 'Señor, escucha nuestra oración:', la: 'Domine, exaudi orationem meam.' },
    { type: 'M', es: 'Y llegue a ti nuestro clamor.', la: 'Et clamor meus ad te veniat.' },
    { type: 'S', es: 'El Señor sea con vosotros.', la: 'Dominus vobiscum.' },
    { type: 'M', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'S', es: 'Oremos.', la: 'Oremus.' },
    { type: 'R', es: 'El Sacerdote sube al altar y dice en voz baja:', la: 'Sacerdos ascendens ad altare dicit secreto:' },
    { type: 'O', secret: true, es: 'Quita de nosotros nuestras iniquidades, te lo suplicamos, Señor; para que merezcamos entrar con almas puras en el Santo de los Santos; por Cristo nuestro Señor. Amén.', la: 'Aufer a nobis, quaesumus, Domine, iniquitates nostras: ut ad Sancta sanctorum puris mereamur mentibus introire. Per Christum Dominum nostrum. Amen.' },
    { type: 'R', es: 'Besando el altar:', la: 'Osculans altare dicit:' },
    { type: 'O', secret: true, es: 'Te rogamos, Señor, por los méritos de tus Santos cuyas reliquias aquí reposan, y de todos los Santos, que te dignes perdonar todos mis pecados. Amén.', la: 'Oramus te, Domine, per merita Sanctorum tuorum, quorum reliquiae hic sunt, et omnium Sanctorum: ut indulgere digneris omnia peccata mea. Amen.' }
  ];

  const KYRIE_DATA = [
    { type: 'R', es: 'Se dice o canta nueve veces, alternando:', la: 'Dicitur vel cantatur alternatim novies:' },
    { type: 'S', es: 'Señor, ten piedad de nosotros.', la: 'Kyrie, eleison.' },
    { type: 'M', es: 'Señor, ten piedad de nosotros.', la: 'Kyrie, eleison.' },
    { type: 'S', es: 'Señor, ten piedad de nosotros.', la: 'Kyrie, eleison.' },
    { type: 'M', es: 'Cristo, ten piedad de nosotros.', la: 'Christe, eleison.' },
    { type: 'S', es: 'Cristo, ten piedad de nosotros.', la: 'Christe, eleison.' },
    { type: 'M', es: 'Cristo, ten piedad de nosotros.', la: 'Christe, eleison.' },
    { type: 'S', es: 'Señor, ten piedad de nosotros.', la: 'Kyrie, eleison.' },
    { type: 'M', es: 'Señor, ten piedad de nosotros.', la: 'Kyrie, eleison.' },
    { type: 'S', es: 'Señor, ten piedad de nosotros.', la: 'Kyrie, eleison.' }
  ];

  const GLORIA_DATA = [
    { type: 'R', es: 'Se dice o canta en Domingos, Dobles y fiestas. Se OMITE en Adviento, Cuaresma y Misas de Difuntos.', la: 'Dicitur vel cantatur in Dominicis et Festis. Omititur in Adventu, Quadragesima et Missis Defunctorum.' },
    { type: 'S', es: 'Gloria a Dios en las alturas,', la: 'Gloria in excelsis Deo,' },
    { type: 'SP', es: 'Y en la tierra paz a los hombres de buena voluntad. Te alabamos, te bendecimos, te adoramos, te glorificamos, te damos gracias por tu inmensa gloria, Señor Dios, Rey celestial, Dios Padre Todopoderoso. Señor, Hijo Unigénito, Jesucristo; Señor Dios, Cordero de Dios, Hijo del Padre; tú que quitas el pecado del mundo, ten misericordia de nosotros; tú que quitas el pecado del mundo, atiende nuestra súplica; tú que estás sentado a la derecha del Padre, ten misericordia de nosotros. Porque sólo tú eres Santo, sólo tú Señor, sólo tú Altísimo, Jesucristo, con el Espíritu Santo, en la gloria de Dios Padre. Amén.', la: 'et in terra pax hominibus bonae voluntatis. Laudamus te, benedicimus te, adoramus te, glorificamus te, gratias agimus tibi propter magnam gloriam tuam, Domine Deus, Rex caelestis, Deus Pater omnipotens. Domine Fili unigenite, Iesu Christe, Domine Deus, Agnus Dei, Filius Patris, qui tollis peccata mundi, miserere nobis; qui tollis peccata mundi, suscipe deprecationem nostram. Qui sedes ad dexteram Patris, miserere nobis. Quoniam tu solus Sanctus, tu solus Dominus, tu solus Altissimus, Iesu Christe, cum Sancto Spiritu: in gloria Dei Patris. Amen.' }
  ];

  const SALUTATION_DATA = [
    { type: 'S', es: 'El Señor sea con vosotros.', la: 'Dominus vobiscum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'S', es: 'Oremos.', la: 'Oremus.' },
    { type: 'R', es: 'Breve silencio; el Sacerdote dice la Colecta del día.', la: 'Sacerdos dicit Collectam diei.' }
  ];

  const CREED_DATA = [
    { type: 'R', es: 'Se dice o canta en Domingos, Dobles y fiestas mayores. Se OMITE en ferias simples.', la: 'Dicitur vel cantatur in Dominicis et Festis Solemnioribus. Omititur in feriis.' },
    { type: 'SP', es: 'Creo en un solo Dios, Padre Todopoderoso, Creador del cielo y de la tierra, de todo lo visible y lo invisible. Y en un solo Señor Jesucristo, Hijo Unigénito de Dios, nacido del Padre antes de todos los siglos; Dios de Dios, Luz de Luz, Dios verdadero de Dios verdadero; engendrado, no creado, de la misma naturaleza del Padre, por quien todo fue hecho; que por nosotros los hombres y por nuestra salvación bajó del cielo, (Todos se arrodillan) y por obra del Espíritu Santo se encarnó de María, la Virgen, y se hizo hombre; (Todos se levantan) y por nuestra causa fue crucificado en tiempos de Poncio Pilato; padeció y fue sepultado, y resucitó al tercer día, según las Escrituras, y subió al cielo, y está sentado a la derecha del Padre; y de nuevo vendrá con gloria para juzgar a vivos y muertos, y su reino no tendrá fin. Y en el Espíritu Santo, Señor y dador de vida, que procede del Padre y del Hijo, que con el Padre y el Hijo recibe una misma adoración y gloria, y que habló por los Profetas. Y en la Iglesia, que es Una, Santa, Católica y Apostólica. Confieso un solo Bautismo para el perdón de los pecados. Espero la resurrección de los muertos y la vida del mundo futuro. Amén.', la: 'Credo in unum Deum, Patrem omnipotentem, factorem caeli et terrae, visibilium omnium et invisibilium. Et in unum Dominum Iesum Christum, Filium Dei unigenitum, et ex Patre natum ante omnia saecula. Deum de Deo, lumen de lumine, Deum verum de Deo vero, genitum, non factum, consubstantialem Patri: per quem omnia facta sunt. Qui propter nos homines et propter nostram salutem descendit de caelis. (Hic genuflectitur) Et incarnatus est de Spiritu Sancto ex Maria Virgine, et homo factus est. (Hic surgitur) Crucifixus etiam pro nobis sub Pontio Pilato; passus, et sepultus est, et resurrexit tertia die, secundum Scripturas, et ascendit in caelum, sedet ad dexteram Patris. Et iterum venturus est cum gloria, iudicare vivos et mortuos, cuius regni non erit finis. Et in Spiritum Sanctum, Dominum et vivificantem: qui ex Patre Filioque procedit. Qui cum Patre et Filio simul adoratur et conglorificatur: qui locutus est per prophetas. Et unam, sanctam, catholicam et apostolicam Ecclesiam. Confiteor unum baptisma in remissionem peccatorum. Et exspecto resurrectionem mortuorum, et vitam venturi saeculi. Amen.' }
  ];

  const OFFERTORY_DATA = [
    { type: 'S', es: 'El Señor sea con vosotros.', la: 'Dominus vobiscum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'S', es: 'Oremos.', la: 'Oremus.' },
    { type: 'R', es: 'Se canta o dice la Antífona de Ofertorio. Se preparan el pan y el vino.', la: 'Dicitur Antiphona ad Offertorium. Praeparantur panis et vinum.' },
    { type: 'T', es: 'OFRENDA DEL PAN', la: 'OBLATIO HOSTIAE' },
    { type: 'R', es: 'El Sacerdote eleva la patena con la hostia y dice en voz baja:', la: 'Sacerdos elevans patenam cum hostia dicit secreto:' },
    { type: 'O', secret: true, es: 'Recibe, oh Padre Santo, Dios Todopoderoso y Eterno, esta hostia inmaculada, que yo, tu indigno siervo, te ofrezco a ti, mi Dios vivo y verdadero, por mis innumerables pecados, ofensas y negligencias, y por todos los aquí presentes, así como por todos los fieles cristianos vivos y difuntos, para que a mí y a ellos nos aproveche para la salvación en la vida eterna. Amén.', la: 'Suscipe, sancte Pater, omnipotens aeterne Deus, hanc immaculatam hostiam, quam ego indignus famulus tuus offero tibi Deo meo vivo et vero, pro innumerabilibus peccatis, et offensionibus, et negligentiis meis, et pro omnibus circumstantibus, sed et pro omnibus fidelibus christianis vivis atque defunctis: ut mihi, et illis proficiat ad salutem in vitam aeternam. Amen.' },
    { type: 'T', es: 'MEZCLA DEL AGUA Y EL VINO', la: 'COMMIXTIO AQUAE ET VINI' },
    { type: 'O', secret: true, es: 'Oh Dios, que maravillosamente creaste la dignidad de la naturaleza humana, y más maravillosamente la restauraste; concédenos, por el misterio de esta agua y de este vino, ser hechos partícipes de la divinidad de Aquel que se dignó hacerse partícipe de nuestra humanidad, Jesucristo nuestro Señor. Amén.', la: 'Deus, qui humanae substantiae dignitatem mirabiliter condidisti, et mirabilius reformasti: da nobis per huius aquae et vini mysterium, eius divinitatis esse consortes, qui humanitatis nostrae fieri dignatus est particeps, Iesus Christus Filius tuus Dominus noster: Qui tecum vivit et regnat in unitate Spiritus Sancti Deus: per omnia saecula saeculorum. Amen.' },
    { type: 'T', es: 'OFRENDA DEL CÁLIZ', la: 'OBLATIO CALICIS' },
    { type: 'O', secret: true, es: 'Te ofrecemos, Señor, el cáliz de salvación; suplicando tu clemencia, para que suba ante la presencia de tu Divina Majestad, con olor de suavidad, para nuestra salvación y la de todo el mundo. Amén.', la: 'Offerimus tibi, Domine, calicem salutaris, tuam deprecantes clementiam: ut in conspectu divinae Maiestatis tuae, pro nostra et totius mundi salute, cum odore suavitatis ascendat. Amen.' },
    { type: 'T', es: 'IN SPIRITU HUMILITATIS', la: 'IN SPIRITU HUMILITATIS' },
    { type: 'O', secret: true, es: 'Con espíritu humilde y corazón contrito seamos acogidos por ti, Señor; y así sea nuestro sacrificio ofrecido hoy en tu presencia, que te sea agradable, Señor Dios.', la: 'In spiritu humilitatis, et in animo contrito suscipiamur a te, Domine: et sic fiat sacrificium nostrum in conspectu tuo hodie, ut placeat tibi, Domine Deus.' },
    { type: 'T', es: 'LAVABO — Salmo 26', la: 'LAVABO — Psalmus 25' },
    { type: 'O', es: 'Lavaré en inocencia mis manos, y así andaré alrededor de tu altar, oh Señor; para proclamar con voz de acción de gracias, y contar todas tus maravillas. Señor, he amado la morada de tu casa, y el lugar donde habita tu gloria. No arrebates con los pecadores mi alma, ni mi vida con hombres sanguinarios, en cuyas manos hay perversidad, y cuya diestra está llena de sobornos. Mas yo andaré en mi integridad; redímeme y ten misericordia de mí. Mi pie está en camino recto; en las congregaciones bendeciré al Señor. Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.', la: 'Lavabo inter innocentes manus meas: et circumdabo altare tuum, Domine: Ut audiam vocem laudis, et enarrem universa mirabilia tua. Domine, dilexi decorem domus tuae, et locum habitationis gloriae tuae. Ne perdas cum impiis, Deus, animam meam, et cum viris sanguinum vitam meam: In quorum manibus iniquitates sunt: dextera eorum repleta est muneribus. Ego autem in innocentia mea ingressus sum: redime me, et miserere mei. Pes meus stetit in directo: in ecclesiis benedicam te, Domine. Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper: et in saecula saeculorum. Amen.' },
    { type: 'T', es: 'ORATE FRATRES', la: 'ORATE FRATRES' },
    { type: 'S', es: 'Orad, hermanos, para que mi sacrificio y el vuestro sea agradable a Dios Padre Todopoderoso.', la: 'Orate, fratres: ut meum ac vestrum sacrificium acceptabile fiat apud Deum Patrem omnipotentem.' },
    { type: 'P', es: 'El Señor reciba de tus manos este sacrificio, para alabanza y gloria de su Nombre, así como para nuestro bien y el de toda su santa Iglesia.', la: 'Suscipiat Dominus sacrificium de manibus tuis ad laudem et gloriam nominis sui, ad utilitatem quoque nostram, totiusque Ecclesiae suae sanctae.' }
  ];

  const SURSUM_CORDA_DATA = [
    { type: 'S', es: 'El Señor sea con vosotros.', la: 'Dominus vobiscum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'S', es: 'Levantemos el corazón.', la: 'Sursum corda.' },
    { type: 'P', es: 'Lo tenemos levantado hacia el Señor.', la: 'Habemus ad Dominum.' },
    { type: 'S', es: 'Demos gracias al Señor nuestro Dios.', la: 'Gratias agamus Domino Deo nostro.' },
    { type: 'P', es: 'Es justo y necesario.', la: 'Dignum et iustum est.' },
    { type: 'R', es: 'El Sacerdote continúa con el Prefacio propio del día.', la: 'Sacerdos pergit cum Praefatio proprio.' }
  ];

  const SANCTUS_DATA = [
    { type: 'R', es: 'Se dice o canta por el Sacerdote y el pueblo.', la: 'Dicitur vel cantatur a Sacerdote et populo.' },
    { type: 'R', es: 'Suenan las campanillas tres veces', la: 'Pulsatur campana ter' },
    { type: 'SP', es: 'Santo, Santo, Santo, Señor Dios de los Ejércitos; llenos están los cielos y la tierra de tu gloria. ¡Hosanna en las alturas!', la: 'Sanctus, Sanctus, Sanctus Dominus Deus Sabaoth. Pleni sunt caeli et terra gloria tua. Hosanna in excelsis.' },
    { type: 'R', es: 'Suenan las campanillas tres veces', la: 'Pulsatur campana ter' },
    { type: 'SP', es: 'Bendito el que viene en el nombre del Señor. Hosanna en las alturas.', la: 'Benedictus qui venit in nomine Domini. Hosanna in excelsis.' }
  ];

  const PATER_NOSTER_DATA = [
    { type: 'S', es: 'Oremos. Fieles a la recomendación del Salvador y siguiendo su divina enseñanza, nos atrevemos a decir:', la: 'Oremus. Praeceptis salutaribus moniti, et divina institutione formati, audemus dicere:' },
    { type: 'SP', es: 'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación,', la: 'Pater noster, qui es in caelis: sanctificetur nomen tuum: adveniat regnum tuum: fiat voluntas tua, sicut in caelo, et in terra. Panem nostrum cotidianum da nobis hodie: et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris: et ne nos inducas in tentationem,' },
    { type: 'S', es: 'y líbranos del mal.', la: 'sed libera nos a malo.' },
    { type: 'T', es: 'EMBOLISMO', la: 'EMBOLISMUS' },
    { type: 'R', es: 'Dicho en voz baja:', la: 'Dicitur secreto:' },
    { type: 'O', secret: true, es: 'Líbranos, te rogamos, Señor, de todos los males pasados, presentes y futuros; y por la intercesión de la bienaventurada y gloriosa siempre Virgen María, Madre de Dios, con los santos Apóstoles Pedro y Pablo, y con Andrés, y con todos los Santos, (hace la señal de la cruz con la Hostia sobre la patena) concédenos benignamente la paz en nuestros días; para que, ayudados por tu misericordia, vivamos siempre libres de pecado y seguros de toda perturbación; por el mismo Jesucristo, tu Hijo, nuestro Señor, que vive y reina contigo, en la unidad del Espíritu Santo, Dios, por los siglos de los siglos.', la: 'Libera nos, quaesumus, Domine, ab omnibus malis, praeteritis, praesentibus et futuris: et intercedente beata et gloriosa semper Virgine Dei Genetrice Maria, cum beatis Apostolis tuis Petro et Paulo, et Andrea, et omnibus Sanctis, da propitius pacem in diebus nostris: ut, ope misericordiae tuae adiuti, et a peccato simus semper liberi et ab omni perturbatione securi. Per eundem Dominum nostrum Iesum Christum Filium tuum, qui tecum vivit et regnat in unitate Spiritus Sancti Deus: per omnia saecula saeculorum.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' },
    { type: 'S', es: 'La paz del Señor sea siempre con vosotros.', la: 'Pax Domini sit semper vobiscum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'T', es: 'AGNUS DEI', la: 'AGNUS DEI' },
    { type: 'R', es: 'Se dice o canta tres veces. En Misas de Difuntos: «dales el descanso» y «dales el descanso eterno».', la: 'Dicitur vel cantatur ter. In Missis Defunctorum dicitur «dona eis requiem» et «dona eis requiem aeternam».' },
    { type: 'S', es: 'Cordero de Dios, que quitas el pecado del mundo,', la: 'Agnus Dei, qui tollis peccata mundi,' },
    { type: 'P', es: 'ten piedad de nosotros.', la: 'miserere nobis.' },
    { type: 'S', es: 'Cordero de Dios, que quitas el pecado del mundo,', la: 'Agnus Dei, qui tollis peccata mundi,' },
    { type: 'P', es: 'ten piedad de nosotros.', la: 'miserere nobis.' },
    { type: 'S', es: 'Cordero de Dios, que quitas el pecado del mundo,', la: 'Agnus Dei, qui tollis peccata mundi,' },
    { type: 'P', es: 'danos la paz.', la: 'dona nobis pacem.' },
    { type: 'T', es: 'LA PAZ', la: 'PAX' },
    { type: 'S', es: 'La paz sea contigo.', la: 'Pax tecum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' }
  ];

  const COMMUNION_PREP_DATA = [
    { type: 'T', es: 'PREPARACIÓN PARA LA SAGRADA COMUNIÓN', la: 'PRAEPARATIO AD SANCTAM COMMUNIONEM' },
    { type: 'R', es: 'Tres oraciones privadas del Sacerdote:', la: 'Tres orationes privatae Sacerdotis:' },
    { type: 'O', secret: true, es: 'Señor Jesucristo, Hijo del Dios vivo, que por voluntad del Padre, con la cooperación del Espíritu Santo, diste por tu muerte la vida al mundo; líbrame por este sacrosanto Cuerpo y Sangre tuya de todos mis pecados y de todo mal; haz que me adhiera siempre a tus mandamientos, y no permitas que jamás me separe de ti; que con el mismo Dios Padre y el Espíritu Santo vives y reinas, Dios, por los siglos de los siglos. Amén.', la: 'Domine Iesu Christe, Fili Dei vivi, qui ex voluntate Patris, cooperante Spiritu Sancto, per mortem tuam mundum vivificasti: libera me per hoc sacrosanctum Corpus et Sanguinem tuum ab omnibus iniquitatibus meis, et universis malis: et fac me tuis semper inhaerere mandatis, et a te numquam separari permittas: Qui cum eodem Deo Patre et Spiritu Sancto vivis et regnat Deus in saecula saeculorum. Amen.' },
    { type: 'O', secret: true, es: 'La recepción de tu Cuerpo, Señor Jesucristo, que yo, indigno, presumo recibir, no se convierta en mi juicio y condenación; sino que, por tu bondad, me sea provechosa para protección y curación de alma y cuerpo; que vives y reinas con Dios Padre en la unidad del Espíritu Santo, Dios, por los siglos de los siglos. Amén.', la: 'Perceptio Corporis tui, Domine Iesu Christe, quod ego indignus sumere praesumo, non mihi proveniat in iudicium et condemnationem: sed pro tua pietate prosit mihi ad tutamentum mentis et corporis, et ad medelam percipiendam: Qui vivis et regnas cum Deo Patre in unitate Spiritus Sancti Deus, per omnia saecula saeculorum. Amen.' },
    { type: 'S', secret: true, es: 'Tomaré el Pan del Cielo, e invocaré el Nombre del Señor.', la: 'Panem caelestem accipiam, et nomen Domini invocabo.' },
    { type: 'R', es: 'Se dice tres veces:', la: 'Dicitur ter:' },
    { type: 'O', es: 'Señor, no soy digno de que entres en mi morada; mas di una sola palabra, y mi alma será sanada.', la: 'Domine, non sum dignus, ut intres sub tectum meum: sed tantum dic verbo, et sanabitur anima mea.' },
    { type: 'R', es: 'El Sacerdote consume el Cuerpo del Señor y después la Sangre del Señor. Se distribuye la Comunión al pueblo.', la: 'Sacerdos sumit Corpus et Sanguinem Domini. Distribuiter Communio populo.' }
  ];

  const ABLUTIONS_DATA = [
    { type: 'T', es: 'ABLUCIONES', la: 'ABLUTIONES' },
    { type: 'R', es: 'Después de dar la Comunión, en voz baja:', la: 'Post Communionem, secreto:' },
    { type: 'O', secret: true, es: 'Concede, Señor, que lo que hemos tomado con la boca, lo recibamos con alma pura; y de don temporal se convierta para nosotros en remedio eterno.', la: 'Quod ore sumpsimus, Domine, pura mente capiamus: et de munere temporali fiat nobis remedium sempiternum.' },
    { type: 'R', es: 'Lavándose los dedos, en voz baja:', la: 'Lavando digitos dicit secreto:' },
    { type: 'O', secret: true, es: 'Haz que tu Cuerpo, Señor, que he recibido, y tu Sangre que he bebido, se adhieran a mis entrañas; y concede que no quede mancha alguna de pecado en mí, alimentado con este puro y santo Sacramento; que vives y reinas por los siglos de los siglos. Amén.', la: 'Corpus tuum, Domine, quod sumpsi, et Sanguis, quem potavi, adhaereat visceribus meis: et praesta; ut in me non remaneat scelerum macula, quem pura et sancta refecerunt Sacramenta: Qui vivis et regnas in saecula saeculorum. Amen.' }
  ];

  const DISMISSAL_DATA = [
    { type: 'S', es: 'El Señor sea con vosotros.', la: 'Dominus vobiscum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'R', es: 'Volviéndose al pueblo, haciendo la señal de la cruz:', la: 'Conversus ad populum, benedicens:' },
    { type: 'S', es: 'La bendición de Dios Todopoderoso, Padre, Hijo y Espíritu Santo, descienda sobre vosotros y permanezca siempre con vosotros.', la: 'Benedicat vos omnipotens Deus, Pater, et Filius, et Spiritus Sanctus.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' },
    { type: 'R', es: 'El Diácono, o el mismo Sacerdote:', la: 'Diaconus, vel ipse Sacerdos dicit:' },
    { type: 'S', es: 'Podéis ir en paz.', la: 'Ite, missa est.' },
    { type: 'P', es: 'Demos gracias a Dios.', la: 'Deo gratias.' },
    { type: 'R', es: 'En Adviento, Cuaresma y Misas de Difuntos, cuando no se dice el Gloria:', la: 'En Adventu, Quadragesima et Missis Defunctorum, quando non dicitur Gloria:' },
    { type: 'S', es: 'Bendigamos al Señor.', la: 'Benedicamus Domino.' },
    { type: 'P', es: 'Demos gracias a Dios.', la: 'Deo gratias.' }
  ];

  // Despedida propia del Tiempo Pascual: "Ite missa est" / "Deo gratias" con
  // doble Aleluya, según la rúbrica tradicional (usada de Pascua a Pentecostés).
  const DISMISSAL_PASCHALTIDE_DATA = [
    { type: 'S', es: 'El Señor sea con vosotros.', la: 'Dominus vobiscum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'R', es: 'Volviéndose al pueblo, haciendo la señal de la cruz:', la: 'Conversus ad populum, benedicens:' },
    { type: 'S', es: 'La bendición de Dios Todopoderoso, Padre, Hijo y Espíritu Santo, descienda sobre vosotros y permanezca siempre con vosotros.', la: 'Benedicat vos omnipotens Deus, Pater, et Filius, et Spiritus Sanctus.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' },
    { type: 'R', es: 'El Diácono, o el mismo Sacerdote, durante el Tiempo Pascual:', la: 'Diaconus, vel ipse Sacerdos, Tempore Paschali dicit:' },
    { type: 'S', es: 'Podéis ir en paz, aleluya, aleluya.', la: 'Ite, missa est, alleluia, alleluia.' },
    { type: 'P', es: 'Demos gracias a Dios, aleluya, aleluya.', la: 'Deo gratias, alleluia, alleluia.' }
  ];

  const LAST_GOSPEL_DATA = [
    { type: 'R', es: 'Se lee el Evangelio según San Juan, capítulo 1, versículos 1–14. Se omite el Domingo de Ramos, Viernes Santo y durante la Octava de Pascua.', la: 'Initium sancti Evangelii secundum Ioannem. Omititur Dominica Palmarum, Feria VI in Parasceve et infra Octavam Paschae.' },
    { type: 'S', es: 'El Señor sea con vosotros.', la: 'Dominus vobiscum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'S', es: 'Comienzo del Santo Evangelio según San Juan.', la: 'Initium sancti Evangelii secundum Ioannem.' },
    { type: 'P', es: 'Gloria a ti, Señor.', la: 'Gloria tibi, Domine.' },
    { type: 'O', es: 'En el principio existía la Palabra y la Palabra estaba con Dios, y la Palabra era Dios. Ella estaba en el principio con Dios. Todo se hizo por ella y sin ella no se hizo nada de cuanto existe. En ella estaba la vida y la vida era la luz de los hombres, y la luz brilla en las tinieblas, y las tinieblas no la vencieron.', la: 'In principio erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum. Hoc erat in principio apud Deum. Omnia per ipsum facta sunt: et sine ipso factum est nihil, quod factum est. In ipso vita erat, et vita erat lux hominum: et lux in tenebris lucet, et tenebrae eam non comprehenderunt.' },
    { type: 'O', es: 'Hubo un hombre, enviado por Dios: se llamaba Juan. Este vino para un testimonio, para dar testimonio de la luz, para que todos creyeran por él. No era él la luz, sino quien debía dar testimonio de la luz.', la: 'Fuit homo missus a Deo, cui nomen erat Ioannes. Hic venit in testimonium, ut testimonium perhiberet de lumine, ut omnes crederent per illum. Non erat ille lux, sed ut testimonium perhiberet de lumine.' },
    { type: 'O', es: 'La Palabra era la luz verdadera que ilumina a todo hombre que viene a este mundo. En el mundo estaba, y el mundo fue hecho por ella, y el mundo no la conoció. Vino a su casa, y los suyos no la recibieron. Pero a todos los que la recibieron les dio poder de hacerse hijos de Dios, a los que creen en su nombre; la cual no nació de sangre, ni de deseo de hombre, sino que nació de Dios.', la: 'Erat lux vera, quae illuminat omnem hominem venientem in hunc mundum. In mundo erat, et mundus per ipsum factus est, et mundus eum non cognovit. In propria venit, et sui eum non receperunt. Quotquot autem receperunt eum, dedit eis potestatem filios Dei fieri, his, qui credunt in nomine eius: qui non ex sanguinibus, neque ex voluntate carnis, neque ex voluntate viri, sed ex Deo nati sunt.' },
    { type: 'R', es: 'todos se arrodillan y la Palabra se hizo carne, todos se levantan y puso su Morada entre nosotros, y hemos contemplado su gloria, gloria que recibe del Padre como Hijo único, lleno de gracia y de verdad.', la: 'Hic genuflectitur: Et Verbum caro factum est, surgitur: et habitavit in nobis: et vidimus gloriam eius, gloriam quasi Unigeniti a Patre, plenum gratiae et veritatis.' },
    { type: 'P', es: 'Demos gracias a Dios.', la: 'Deo gratias.' }
  ];

  const ASPERGES_ME_DATA = [
    { type: 'R', es: 'Rito de aspersión del agua bendita — Domingos fuera del Tiempo Pascual. El Sacerdote asperja al altar, al clero y al pueblo mientras se canta:', la: 'Aspergio aqua benedicta — Dominicis extra Tempus Paschale:' },
    { type: 'T', es: 'ANTÍFONA: ASPERGES ME', la: 'ANTIPHONA: ASPERGES ME' },
    { type: 'SP', es: 'Rocíame, Señor, con hisopo, y quedaré limpio; lávame, y quedaré más blanco que la nieve.', la: 'Asperges me, Domine, hyssopo, et mundabor: lavabis me, et super nivem dealbabor.' },
    { type: 'S', es: 'Salmo 50. Ten piedad de mí, oh Dios, según tu gran misericordia.', la: 'Miserere mei, Deus, secundum magnam misericordiam tuam.' },
    { type: 'R', es: 'Durante el Tiempo de Pasión (desde el Domingo de Pasión hasta el Miércoles Santo) se omite el Gloria al Padre.', la: 'In Tempore Passionis omittitur Gloria Patri.' },
    { type: 'S', es: 'Gloria al Padre, y al Hijo, y al Espíritu Santo.', la: 'Gloria Patri, et Filio, et Spiritui Sancto.', omitInPassiontide: true },
    { type: 'P', es: 'Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.', la: 'Sicut erat in principio, et nunc, et semper: et in saecula saeculorum. Amen.', omitInPassiontide: true },
    { type: 'SP', es: 'Rocíame, Señor, con hisopo, y quedaré limpio; lávame, y quedaré más blanco que la nieve.', la: 'Asperges me, Domine, hyssopo, et mundabor: lavabis me, et super nivem dealbabor.' },
    { type: 'S', es: 'Muéstranos, Señor, tu misericordia.', la: 'Ostende nobis, Domine, misericordiam tuam.' },
    { type: 'P', es: 'Y danos tu salvación.', la: 'Et salutare tuum da nobis.' },
    { type: 'S', es: 'Señor, escucha mi oración.', la: 'Domine, exaudi orationem meam.' },
    { type: 'P', es: 'Y llegue a ti mi clamor.', la: 'Et clamor meus ad te veniat.' },
    { type: 'S', es: 'El Señor sea con vosotros.', la: 'Dominus vobiscum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'S', es: 'Oremos.', la: 'Oremus.' },
    { type: 'O', es: 'Escúchanos, Señor Santo, Padre Todopoderoso, Dios Eterno; y dígnate enviar desde el cielo a tu santo Ángel, para que guarde, fomente, proteja, visite y defienda a todos los que están reunidos en esta morada; por Cristo nuestro Señor.', la: 'Exaudi nos, Domine sancte, Pater omnipotens, aeterne Deus: et mittere digneris sanctum Angelum tuum de caelis, qui custodiat, foveat, protegat, visitet, et defendat omnes habitantes in hoc habitaculo. Per Christum Dominum nostrum.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' }
  ];

  const VIDI_AQUAM_DATA = [
    { type: 'R', es: 'Rito de aspersión del agua bendita — Tiempo Pascual. El Sacerdote asperja al pueblo mientras se canta:', la: 'Aspergio aqua benedicta — Tempore Paschali:' },
    { type: 'T', es: 'ANTÍFONA: VIDI AQUAM', la: 'ANTIPHONA: VIDI AQUAM' },
    { type: 'SP', es: 'Vi el agua que brotaba del templo, del lado derecho, aleluya; y todos aquellos a quienes llegó esta agua fueron salvados y dirán: aleluya, aleluya.', la: 'Vidi aquam egredientem de templo, a latere dextro, alleluia: et omnes, ad quos pervenit aqua ista, salvi facti sunt, et dicent: alleluia, alleluia.' },
    { type: 'S', es: 'Salmo 118. Dad gracias al Señor, porque es bueno.', la: 'Confitemini Domino quoniam bonus:' },
    { type: 'P', es: 'Porque es eterna su misericordia. Aleluya.', la: 'quoniam in saeculum misericordia eius. Alleluia.' },
    { type: 'SP', es: 'Vi el agua que brotaba del templo, del lado derecho, aleluya; y todos aquellos a quienes llegó esta agua fueron salvados y dirán: aleluya, aleluya.', la: 'Vidi aquam egredientem de templo, a latere dextro, alleluia: et omnes, ad quos pervenit aqua ista, salvi facti sunt, et dicent: alleluia, alleluia.' },
    { type: 'S', es: 'Gloria al Padre, y al Hijo, y al Espíritu Santo.', la: 'Gloria Patri, et Filio, et Spiritui Sancto.' },
    { type: 'P', es: 'Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.', la: 'Sicut erat in principio, et nunc, et semper: et in saecula saeculorum. Amen.' },
    { type: 'SP', es: 'Vi el agua que brotaba del templo, del lado derecho, aleluya; y todos aquellos a quienes llegó esta agua fueron salvados y dirán: aleluya, aleluya.', la: 'Vidi aquam egredientem de templo, a latere dextro, alleluia: et omnes, ad quos pervenit aqua ista, salvi facti sunt, et dicent: alleluia, alleluia.' },
    { type: 'S', es: 'El Señor sea con vosotros.', la: 'Dominus vobiscum.' },
    { type: 'P', es: 'Y con tu espíritu.', la: 'Et cum spiritu tuo.' },
    { type: 'S', es: 'Oremos.', la: 'Oremus.' },
    { type: 'O', es: 'Escúchanos, Señor Santo, Padre Todopoderoso, Dios Eterno; y dígnate enviar desde el cielo a tu santo Ángel, para que guarde, fomente, proteja, visite y defienda a todos los que están reunidos en esta morada; por Cristo nuestro Señor.', la: 'Exaudi nos, Domine sancte, Pater omnipotens, aeterne Deus: et mittere digneris sanctum Angelum tuum de caelis, qui custodiat, foveat, protegat, visitet, et defendat omnes habitantes in hoc habitaculo. Per Christum Dominum nostrum.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' }
  ];

  const LEONINE_DATA = [
    { type: 'R', es: 'Estas oraciones se dicen de rodillas después de la Misa rezada:', la: 'Preces post Missam privatam flexis genibus recitandae:' },
    { type: 'O', es: 'Dios te salve María, llena eres de gracia; el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros pecadores, ahora y en la hora de nuestra muerte. Amén. (×3)', la: 'Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen. (ter)' },
    { type: 'O', es: 'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente, oh piadosa, oh dulce Virgen María!', la: 'Salve Regina, mater misericordiae; vita, dulcedo et spes nostra, salve. Ad te clamamus, exsules filii Evae. Ad te suspiramus gementes et flentes in hac lacrimarum valle. Eia ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende. O clemens, o pia, o dulcis Virgo Maria.' },
    { type: 'S', es: 'Ruega por nosotros, santa Madre de Dios.', la: 'Ora pro nobis, sancta Dei Genetrix.' },
    { type: 'P', es: 'Para que seamos dignos de alcanzar las promesas de Cristo.', la: 'Ut digni efficiamur promissionibus Christi.' },
    { type: 'O', es: 'Oremos. Oh Dios, refugio y fortaleza nuestra, mira compasivo a tu pueblo que clama a ti; y por la intercesión de la gloriosa e inmaculada Virgen María, Madre de Dios, de San José su Esposo, de tus santos Apóstoles Pedro y Pablo, y de todos los Santos, escucha misericordiosamente las oraciones que te dirigimos por la conversión de los pecadores y por la libertad y exaltación de nuestra santa Madre la Iglesia; por el mismo Cristo nuestro Señor. Amén.', la: 'Oremus. Deus, refugium nostrum et virtus, populum ad te clamantem propitius respice; et intercedente gloriosa et immaculata Virgine Dei Genitrice Maria, cum beato Ioseph, eius Sponso, ac beatis Apostolis tuis Petro et Paulo, et omnibus Sanctis, quas pro conversione peccatorum, pro libertate et exaltatione sanctae Matris Ecclesiae, preces tibi fundimus, misericors et benignus exaudi. Per eundem Christum Dominum nostrum. Amen.' },
    { type: 'T', es: 'ORACIÓN A SAN MIGUEL ARCÁNGEL', la: 'ORATIO AD SANCTUM MICHAELEM' },
    { type: 'O', es: 'San Miguel Arcángel, defiéndenos en la batalla; sé nuestro amparo contra la maldad y asechanzas del demonio. Reprímale Dios, pedimos suplicantes, y tú, Príncipe de la Milicia Celestial, arroja al infierno con el divino poder a Satanás y a los otros espíritus malignos que andan dispersos por el mundo para la perdición de las almas. Amén.', la: 'Sancte Michael Archangele, defende nos in proelio; contra nequitiam et insidias diaboli esto praesidium. Imperet illi Deus, supplices deprecamur: tuque, Princeps militiae caelestis, Satanam aliosque spiritus malignos, qui ad perditionem animarum pervagantur in mundo, divina virtute in infernum detrude. Amen.' },
    { type: 'S', es: 'Sagrado Corazón de Jesús,', la: 'Sacratissimum Cor Iesu,' },
    { type: 'P', es: 'ten misericordia de nosotros. (×3)', la: 'miserere nobis. (ter)' }
  ];

  const LEONINE_PASCHALTIDE_DATA = [
    { type: 'R', es: 'Estas oraciones se dicen de rodillas después de la Misa rezada. Durante la Cincuentena Pascual se dice la Regina Caeli en lugar de la Salve Regina:', la: 'Preces post Missam privatam. Tempore Paschali dicitur Regina Caeli loco Salve Regina:' },
    { type: 'T', es: 'REGINA CAELI', la: 'REGINA CAELI' },
    { type: 'SP', es: 'Reina del cielo, alégrate, aleluya; porque el Hijo que mereciste llevar, aleluya, resucitó según predijo, aleluya. Ruega a Dios por nosotros, aleluya.', la: 'Regina caeli, laetare, alleluia; quia quem meruisti portare, alleluia, resurrexit, sicut dixit, alleluia: ora pro nobis Deum, alleluia.' },
    { type: 'S', es: 'Alégrate y regocíjate, Virgen María, aleluya.', la: 'Gaude et laetare, Virgo Maria, alleluia.' },
    { type: 'P', es: 'Porque el Señor resucitó verdaderamente, aleluya.', la: 'Quia surrexit Dominus vere, alleluia.' },
    { type: 'S', es: 'Oremos.', la: 'Oremus.' },
    { type: 'O', es: 'Oh Dios, que por la Resurrección de tu Hijo nuestro Señor Jesucristo llenaste el mundo de alegría; concédenos que por intercesión de su Madre, la Virgen María, alcancemos el gozo de la vida eterna; por el mismo Cristo nuestro Señor.', la: 'Deus, qui per resurrectionem Filii tui, Domini nostri Iesu Christi, mundum laetificare dignatus es: praesta, quaesumus; ut, per eius Genetricem Virginem Mariam, perpetuae capiamus gaudia vitae. Per eundem Christum Dominum nostrum.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' },
    { type: 'S', es: 'Sagrado Corazón de Jesús,', la: 'Sacratissimum Cor Iesu,' },
    { type: 'P', es: 'ten misericordia de nosotros. (×3)', la: 'miserere nobis. (ter)' }
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // EMBOLISMOS Y CANON ROMANO COMPLETO
  // ══════════════════════════════════════════════════════════════════════════

  const COMMUNICANTES_EMBOLISMS_DATA = {
    christmas: {
      es: 'Celebrando la noche (día) santísima(o) de la Natividad de nuestro Señor Jesucristo según la carne; y venerando la memoria',
      la: 'Communicantes, et noctem sacratissimam (diem sacratissimum) celebrantes, in qua (quo) intemerata virginitas huic mundo edidit Salvatorem: sed et memoriam venerantes'
    },
    epiphany: {
      es: 'Celebrando el día santísimo de la Epifanía de nuestro Señor Jesucristo, en el cual tu Unigénito, coeterno contigo en tu gloria, se manifestó en la verdadera sustancia de nuestra carne; y venerando la memoria',
      la: 'Communicantes, et diem sacratissimum celebrantes, in quo Unigenitus tuus, in tua tecum gloria coaeternus, in vera carnis nostrae substantia visibiliter apparuit: sed et memoriam venerantes'
    },
    maundyThursday: {
      es: 'Celebrando el día sacratísimo en que nuestro Señor Jesucristo fue entregado por nosotros; y venerando la memoria',
      la: 'Communicantes, et diem sacratissimum celebrantes, in quo Dominus noster Iesus Christus pro nobis est traditus: sed et memoriam venerantes'
    },
    easter: {
      es: 'Celebrando la noche (día) sacratísima(o) de la santa Resurrección de nuestro Señor Jesucristo según la carne; y venerando la memoria',
      la: 'Communicantes, et noctem sacratissimam (diem sacratissimum) resurrectionis Domini nostri Iesu Christi secundum carnem celebrantes: sed et memoriam venerantes'
    },
    easter2: {
      es: 'Celebrando el día sacrosanto en que nuestro Señor Jesucristo, vencedor de la muerte, se apareció a sus Apóstoles; y venerando la memoria',
      la: 'Communicantes, et diem sacratissimum resurrectionis Domini nostri Iesu Christi celebrantes: sed et memoriam venerantes'
    },
    ascension: {
      es: 'Celebrando el día sacratísimo de la Ascensión a los cielos de nuestro Señor Jesucristo tu Hijo; y venerando la memoria',
      la: 'Communicantes, et diem sacratissimum celebrantes, in quo unigenitus Filius tuus unitam sibi nostrae fragilitatis substantiam in gloriae tuae dextera collocavit: sed et memoriam venerantes'
    },
    pentecost: {
      es: 'Celebrando el día santo de Pentecostés, en el cual el Espíritu Santo se apareció a los Apóstoles en forma de lenguas de fuego; y venerando la memoria',
      la: 'Communicantes, et diem sacratissimum Pentecostes celebrantes, in quo Spiritus Sanctus super discipulos igneis linguis apparuit: sed et memoriam venerantes'
    },
    trinity: {
      es: 'En comunión con toda la Iglesia, gozándonos en la Festividad de la Santísima Trinidad; y venerando la memoria',
      la: 'Communicantes, et diem sacratissimum festum sanctissimae Trinitatis celebrantes: sed et memoriam venerantes'
    }
  };

  // Días que comparten el embolismo especial de una fiesta mayor por caer dentro
  // de su Octava (Navidad: 26 dic.-1 ene.; Pascua: Lunes-Sábado de Pascua).
  function resolveEmbolismKey(dayKey) {
    if (!dayKey) return null;
    if (COMMUNICANTES_EMBOLISMS_DATA[dayKey]) return dayKey;
    if (dayKey === 'christmasSunday' || dayKey === 'circumcision') return 'christmas';
    // Las Octavas llevan su Communicantes propio durante toda la octava, no solo
    // el día de la fiesta. calendar.js etiqueta ahora esas ferias con claves
    // propias (christmasFeria_N para la Octava de Navidad, epiOctave_N para la de
    // Epifanía), que no estaban mapeadas aquí: 546 días de 2024-2060 caían al
    // Communicantes ordinario. pentecostFeria_N ya se trataba como octava en
    // getHancIgitur(), pero no aquí.
    if (dayKey.startsWith('easterFeria1_')) return 'easter';
    if (dayKey.startsWith('christmasFeria_')) return 'christmas';
    if (dayKey.startsWith('epiOctave_')) return 'epiphany';
    if (dayKey.startsWith('pentecostFeria')) return 'pentecost';
    return null;
  }

  function getCommunicantesText() {
    let esEmb = 'En comunión con toda la Iglesia, y venerando la memoria';
    let laEmb = 'Communicantes, et memoriam venerantes';

    const embKey = resolveEmbolismKey(currentDayKey);
    if (embKey) {
      esEmb = COMMUNICANTES_EMBOLISMS_DATA[embKey].es;
      laEmb = COMMUNICANTES_EMBOLISMS_DATA[embKey].la;
    }

    const esBase = `primeramente de la gloriosa siempre Virgen María, Madre de nuestro Dios y Señor Jesucristo; y del bienaventurado José, Esposo de la misma Virgen; y también de los santos Apóstoles y Mártires Pedro y Pablo, Andrés, Santiago, Juan, Tomás, Santiago, Felipe, Bartolomé, Mateo, Simón y Tadeo; Lino, Cleto, Clemente, Sixto, Cornelio, Cipriano, Lorenzo, Crisógono, Juan y Pablo, Cosme y Damián, y de todos tus Santos; por cuyos méritos y oraciones, concédenos que en todo seamos defendidos con la ayuda de tu protección; por el mismo Cristo nuestro Señor. Amén.`;
    const laBase = `in primis gloriosae semper Virginis Mariae, Genetricis Dei et Domini nostri Iesu Christi: sed et beati Ioseph, eiusdem Virginis Sponsi, et beatorum Apostolorum ac Martyrum tuorum, Petri et Pauli, Andreae, Iacobi, Ioannis, Thomae, Iacobi, Philippi, Bartholomaei, Matthaei, Simonis et Thaddaei: Lini, Cleti, Clementis, Xysti, Cornelii, Cypriani, Laurentii, Chrysogoni, Ioannis et Pauli, Cosmae et Damiani: et omnium Sanctorum tuorum; quorum meritis precibusque concedas, ut in omnibus protectionis tuae muniamur auxilio. Per Christum Dominum nostrum. Amen.`;

    return [
      { type: 'T', es: 'TE IGITUR', la: 'TE IGITUR' },
      { type: 'O', es: 'Por tanto, Padre misericordiosísimo, por Jesucristo tu Hijo, Señor nuestro, te pedimos humildemente y te rogamos que aceptes y bendigas ✠ estos dones, estas ofrendas, estos santos e inmaculados sacrificios, que te ofrecemos primeramente por tu santa Iglesia Católica, para que te dignes darle paz y unidad, protegerla, gobernarla y conservarla en todo el mundo; juntamente con tu siervo nuestro Obispo N., y todos los fieles custodios de la fe católica y apostólica.', la: 'Te igitur, clementissime Pater, per Iesum Christum Filium tuum, Dominum nostrum, supplices rogamus, ac petimus, uti accepta habeas et benedicas haec dona, haec munera, haec sancta sacrificia illibata, in primis, quae tibi offerimus pro Ecclesia tua sancta catholica: quam pacificare, custodire, adunare et regere digneris toto orbe terrarum: una cum famulo tuo Papa nostro N., et Antistite nostro N., et omnibus orthodoxis, atque catholicae et apostolicae fidei cultoribus.' },
      { type: 'T', es: 'MEMENTO DE LOS VIVOS', la: 'MEMENTO DOMINE' },
      { type: 'O', es: 'Acuérdate, Señor, de tus siervos y siervas N. y N. (Aquí el Sacerdote ora brevemente por los vivos) y de todos los aquí presentes, cuya fe y devoción te son conocidas; por quienes te ofrecemos este sacrificio de alabanza por sí mismos y por todos los suyos; por la redención de sus almas, por la esperanza de su salvación; y que pagan sus votos al Dios eterno, vivo y verdadero.', la: 'Memento, Domine, famulorum famularumque tuarum N. et N. et omnium circumstantium, quorum tibi fides cognita est, et nota devotio, pro quibus tibi offerimus: vel qui tibi offerunt hoc sacrificium laudis, pro se suisque omnibus: pro redemptione animarum suarum, pro spe salutis et incolumitatis suae: tibique reddunt vota sua aeterno Deo, vivo et vero.' },
      { type: 'T', es: 'COMMUNICANTES', la: 'COMMUNICANTES' },
      { type: 'O', es: `<strong style="color:var(--rubric)">${esEmb}</strong>, ${esBase}`, la: `<strong style="color:var(--rubric)">${laEmb}</strong>, ${laBase}` }
    ];
  }

  const HANC_IGITUR_NORMAL_DATA = [
    { type: 'T', es: 'HANC IGITUR', la: 'HANC IGITUR' },
    { type: 'R', es: 'Extendiendo las manos sobre las oblaciones:', la: 'Sacerdos expandens manus super oblata dicit:' },
    { type: 'O', es: 'Acepta, pues, Señor, con bondad esta ofrenda de tus siervos y de toda tu familia; ordena en tu paz nuestros días, líbranos de la condenación eterna, y cuéntanos entre tus elegidos; por Cristo nuestro Señor. Amén.', la: 'Hanc igitur oblationem servitutis nostrae, sed et cunctae familiae tuae, quaesumus, Domine, ut placatus accipias: diesque nostros in tua pace disponas, et ab aeterna damnatione nos eripi, et in electorum tuorum iubeas gregem numerari. Per Christum Dominum nostrum. Amen.' }
  ];

  const HANC_IGITUR_EASTER_DATA = [
    { type: 'T', es: 'HANC IGITUR', la: 'HANC IGITUR' },
    { type: 'R', es: 'Extendiendo las manos sobre las oblaciones:', la: 'Sacerdos expandens manus super oblata dicit:' },
    { type: 'O', es: 'Acepta, pues, Señor, con bondad esta ofrenda de tus siervos y de toda tu familia, que te ofrecemos también por estos (señalando a los recién bautizados) a quienes te has dignado regenerar por el agua y el Espíritu Santo, concediéndoles la remisión de todos sus pecados; ordena en tu paz nuestros días, líbranos de la condenación eterna, y cuéntanos entre tus elegidos; por Cristo nuestro Señor. Amén.', la: 'Hanc igitur oblationem servitutis nostrae, sed et cunctae familiae tuae, quaesumus, Domine, ut placatus accipias: oblationem quoque quam tibi offerimus pro his etiam quos regenerare dignatus es ex aqua et Spiritu Sancto, tribuens eis remissionem omnium peccatorum: diesque nostros in tua pace disponas, et ab aeterna damnatione nos eripi, et in electorum tuorum iubeas gregem numerari. Per Christum Dominum nostrum. Amen.' }
  ];

  const CANON_CONTINUED_DATA = [
    { type: 'T', es: 'QUAM OBLATIONEM', la: 'QUAM OBLATIONEM' },
    { type: 'O', es: 'Dígnate, oh Dios, hacer esta oblación en todo ✠ bendita, ✠ aprobada, ✠ ratificada, razonable y aceptable; para que se convierta para nosotros en el Cuerpo ✠ y la Sangre ✠ de tu amadísimo Hijo Jesucristo nuestro Señor.', la: 'Quam oblationem tu, Deus, in omnibus, quaesumus, benedictam, adscriptam, ratam, rationabilem, acceptabilemque facere digneris: ut nobis Corpus et Sanguis fiat dilectissimi Filii tui, Domini nostri Iesu Christi.' },
    { type: 'T', es: 'PALABRAS DE LA INSTITUCIÓN', la: 'QUI PRIDIE' },
    { type: 'O', es: 'El cual, la víspera de su Pasión, tomó el pan en sus santas y venerables manos, y elevando los ojos al cielo, hacia ti, Dios, su Padre Todopoderoso, dándote gracias, lo ✠ bendijo, lo partió, y lo dio a sus discípulos, diciendo:', la: 'Qui pridie quam pateretur, accepit panem in sanctas ac venerabiles manus suas, et elevatis oculis in caelum ad te Deum Patrem suum omnipotentem, tibi gratias agens benedixit, fregit, deditque discipulis suis, dicens:' },
    { type: 'C', es: 'TOMAD Y COMED TODOS DE ÉL:<br>PORQUE ÉSTE ES MI CUERPO.', la: 'ACCIPITE, ET MANDUCATE EX HOC OMNES:<br>HOC EST ENIM CORPUS MEUM.' },
    { type: 'R', es: 'El Sacerdote hace genuflexión en adoración; eleva la Sagrada Hostia.', la: 'Genuflectit, elevat Hostiam.' },
    { type: 'R', es: 'Suenan las campanillas tres veces', la: 'Pulsatur campana ter' },
    { type: 'R', es: 'Repone la Hostia reverentemente sobre el corporal y hace genuflexión de nuevo.', la: 'Reponit Hostiam, genuflectit.' },
    { type: 'O', es: 'Del mismo modo, después de cenar, tomando también este precioso cáliz en sus santas y venerables manos, dándote igualmente gracias, lo ✠ bendijo, y lo dio a sus discípulos, diciendo:', la: 'Simili modo postquam caenatum est, accipiens et hunc praeclarum calicem in sanctas ac venerabiles manus suas: item tibi gratias agens, benedixit, deditque discipulis suis, dicens:' },
    { type: 'C', es: 'TOMAD Y BEBED TODOS DE ÉL:<br>PORQUE ÉSTE ES EL CÁLIZ DE MI SANGRE,<br>DEL NUEVO Y ETERNO TESTAMENTO:<br>EL MISTERIO DE LA FE:<br>QUE SERÁ DERRAMADA POR VOSOTROS Y POR MUCHOS<br>PARA LA REMISIÓN DE LOS PECADOS.<br>CUANTAS VECES HICIEREIS ESTAS COSAS,<br>LAS HARÉIS EN MEMORIA MÍA.', la: 'ACCIPITE, ET BIBITE EX EO OMNES:<br>HIC EST ENIM CALIX SANGUINIS MEI,<br>NOVI ET AETERNI TESTAMENTI:<br>MYSTERIUM FIDEI:<br>QUI PRO VOBIS ET PRO MULTIS EFFUNDETUR<br>IN REMISSIONEM PECCATORUM.<br>HAEC QUOTIESCUMQUE FECERITIS,<br>IN MEI MEMORIAM FACIETIS.' },
    { type: 'R', es: 'El Sacerdote hace genuflexión; eleva el Sagrado Cáliz.', la: 'Genuflectit, elevat Calicem.' },
    { type: 'R', es: 'Suenan las campanillas tres veces', la: 'Pulsatur campana ter' },
    { type: 'R', es: 'Repone el Cáliz y hace genuflexión de nuevo.', la: 'Reponit Calicem, genuflectit.' },
    { type: 'T', es: 'UNDE ET MEMORES', la: 'UNDE ET MEMORES' },
    { type: 'O', es: 'Por tanto, Señor, nosotros tus siervos, y también tu pueblo santo, recordando la bienaventurada Pasión del mismo Cristo, tu Hijo, nuestro Señor, y también su Resurrección de entre los muertos, y su gloriosa Ascensión a los cielos; ofrecemos a tu excelentísima Majestad, de tus propios dones, la Hostia ✠ pura, la Hostia ✠ santa, la Hostia ✠ inmaculada, el Pan ✠ santo de la vida eterna, y el Cáliz ✠ de la salvación perpetua.', la: 'Unde et memores, Domine, nos servi tui, sed et plebs tua sancta, eiusdem Christi Filii tui, Domini nostri, tam beatae passionis, necnon et ab inferis resurrectionis, sed et in caelos gloriosae ascensionis: offerimus praeclarae maiestati tuae de tuis donis ac datis, hostiam puram, hostiam sanctam, hostiam immaculatam, Panem sanctum vitae aeternae, et Calicem salutis perpetuae.' },
    { type: 'T', es: 'SUPRA QUAE', la: 'SUPRA QUAE' },
    { type: 'O', es: 'Sobre los cuales dígnate mirar con rostro propicio y sereno, y aceptarlos, como tuviste a bien aceptar los dones de tu siervo Abel el justo, y el sacrificio de nuestro patriarca Abraham; y la ofrenda santa, la hostia inmaculada, que te ofreció tu sumo sacerdote Melquisedec.', la: 'Supra quae propitio ac sereno vultu respicere digneris: et accepta habere, sicuti accepta habere dignatus es munera pueri tui iusti Abel, et sacrificium Patriarchae nostri Abrahae: et quod tibi obtulit summus sacerdos tuus Melchisedech, sanctum sacrificium, immaculatam hostiam.' },
    { type: 'T', es: 'SUPPLICES TE ROGAMUS', la: 'SUPPLICES TE ROGAMUS' },
    { type: 'O', es: 'Humildemente te rogamos, Dios Todopoderoso, que mandes llevar estas ofrendas por las manos de tu santo Ángel a tu Altar celestial, ante la presencia de tu Divina Majestad; para que todos cuantos, participando de este Altar, recibamos el sacrosanto ✠ Cuerpo y ✠ Sangre de tu Hijo, seamos llenos de toda gracia y bendición celestial; por el mismo Cristo nuestro Señor. Amén.', la: 'Supplices te rogamus, omnipotens Deus: iube haec perferri per manus sancti Angeli tui in sublime altare tuum, in conspectu divinae maiestatis tuae: ut, quotquot ex hac altaris participatione sacrosanctum Filii tui Corpus et Sanguinem sumpserimus, omni gratia caelesti et benedictione repleamur. Per Christum Dominum nostrum. Amen.' },
    { type: 'T', es: 'MEMENTO DE LOS DIFUNTOS', la: 'MEMENTO ETIAM' },
    { type: 'O', es: 'Acuérdate también, Señor, de tus siervos y siervas N. y N. que nos han precedido con la señal de la fe y duermen el sueño de la paz. A ellos, Señor, y a todos los que descansan en Cristo, concédeles, te suplicamos, el lugar del refrigerio, de la luz y de la paz; por el mismo Cristo nuestro Señor. Amén.', la: 'Memento etiam, Domine, famulorum famularumque tuarum N. et N., qui nos praecesserunt cum signo fidei, et dormiunt in somno pacis. Ipsis, Domine, et omnibus in Christo quiescentibus, locum refrigerii, lucis et pacis, ut indulgeas, deprecamur. Per Christum Dominum nostrum. Amen.' },
    { type: 'T', es: 'NOBIS QUOQUE', la: 'NOBIS QUOQUE PECCATORIBUS' },
    { type: 'O', es: 'También a nosotros, pecadores, siervos tuyos, que confiamos en la multitud de tus misericordias, dígnate concedernos alguna parte y comunión con tus santos Apóstoles y Mártires: con Juan, Esteban, Matías, Bernabé, Ignacio, Alejandro, Marcelino, Pedro, Felicidad, Perpetua, Águeda, Lucía, Inés, Cecilia, Anastasia, y con todos tus Santos; en cuya compañía te rogamos nos admitas, no por nuestros méritos, sino por tu generoso perdón; por Cristo nuestro Señor.', la: 'Nobis quoque peccatoribus famulis tuis, de multitudine misericordiarum tuarum sperantibus, partem aliquam et societatem donare digneris cum tuis sanctis Apostolis et Martyribus: cum Ioanne, Stephano, Matthia, Barnaba, Ignatio, Alexandro, Marcellino, Petro, Felicitate, Perpetua, Agatha, Lucia, Agnete, Caecilia, Anastasia, et omnibus Sanctis tuis: intra quorum nos consortium, non aestimator meriti, sed veniae, quaesumus, largitor admitte. Per Christum Dominum nostrum.' },
    { type: 'T', es: 'PER QUEM', la: 'PER QUEM' },
    { type: 'O', es: 'Por quien, Señor, siempre creas, santificas ✠, vivificas ✠, bendices ✠ y nos concedes todos estos bienes. Por ✠ Él, y con ✠ Él, y en ✠ Él, a ti, Dios Padre ✠ Todopoderoso, en la unidad del Espíritu ✠ Santo, te sea dado todo honor y toda gloria. Por los siglos de los siglos.', la: 'Per quem haec omnia, Domine, semper bona creas, sanctificas, vivificas, benedicis, et praestas nobis. Per ipsum, et cum ipso, et in ipso, est tibi Deo Patri omnipotenti, in unitate Spiritus Sancti, omnis honor et gloria. Per omnia saecula saeculorum.' },
    { type: 'P', es: 'Amén.', la: 'Amen.' }
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // CANON DE 1549 (SOLO ESPAÑOL, NO APLICA LATÍN HISTÓRICO)
  // ══════════════════════════════════════════════════════════════════════════
  const CANON_1549 = [
    T('LA ORACIÓN POR LA IGLESIA Y LA PLEGARIA DE CONSAGRACIÓN (1549)'),
    O('Oremos por todo el estado de la Iglesia de Cristo militante en la tierra.'),
    O('Dios Todopoderoso y eterno, que por tu santo Apóstol nos has enseñado a hacer oraciones y súplicas, y a dar gracias, por todos los hombres; Te suplicamos humildemente que aceptes misericordiosamente nuestras ofrendas y recibas nuestras oraciones, que ofrecemos a tu Divina Majestad, rogándote que inspires continuamente a la Iglesia universal el espíritu de verdad, unidad y concordia; y concédenos que todos aquellos que confiesan tu santo Nombre convengan en la verdad de tu santa Palabra, y vivan en unidad y amor piadoso.'),
    O('Te rogamos también que salves y defiendas a todos los Reyes, Príncipes y Gobernantes cristianos, y especialmente a tus siervos, para que bajo ellos seamos piadosa y pacíficamente gobernados; y concede a todo su Consejo, y a todos los que han sido puestos en autoridad bajo ellos, que puedan verdadera e imparcialmente administrar justicia, para castigo de la maldad y el vicio, y para la conservación de tu verdadera religión y virtud.'),
    O('Da gracia, oh Padre celestial, a todos los Obispos, Pastores y Sacerdotes, para que tanto con su vida como con su doctrina muestren tu verdadera y vivificante Palabra, y administren rectamente tus Santos Sacramentos.'),
    O('Y a todo tu pueblo dale tu gracia celestial, para que con corazón manso oigan y reciban tu santa Palabra, sirviendo verdaderamente en santidad y justicia de vida todos sus días.'),
    O('Y te rogamos humildemente, Señor, que de tu bondad confortes y socorras a todos aquellos que en esta vida transitoria están en tribulación, necesidad, enfermedad, o en cualquier otra adversidad.'),
    O('Y especialmente te encomendamos a tus siervos que han partido de esta vida con la señal de la fe y descansan en el sueño de la paz. Concédeles, te suplicamos, tu misericordia y paz eterna; y que en el día de la resurrección general, nosotros y todos los que pertenecen al Cuerpo Místico de tu Hijo, seamos puestos a su derecha en la vida eterna; por el mismo Jesucristo nuestro Señor.'),
    P('Amén.'),
    T('PALABRAS DE LA INSTITUCIÓN'),
    O('Te suplicamos, Padre misericordioso, que escuches nuestras oraciones, y con tu Espíritu Santo y tu Palabra nos dignes bendecir ✠ y santificar ✠ estos tus dones y criaturas de pan y vino, para que sean para nosotros el Cuerpo y la Sangre de tu muy amado Hijo Jesucristo; el cual, en la noche en que fue entregado, tomó pan; y habiendo dado gracias, lo partió, y lo dio a sus discípulos, diciendo:'),
    C('TOMAD Y COMED TODOS DE ÉL:<br>PORQUE ÉSTE ES MI CUERPO QUE ES DADO POR VOSOTROS;<br>HACED ESTO EN MEMORIA MÍA.'),
    R('El Sacerdote hace genuflexión y eleva la Hostia. Suenan las campanillas.'),
    O('Asimismo, después de cenar, tomó el cáliz, y habiendo dado gracias, se lo dio, diciendo:'),
    C('BEBED TODOS DE ÉL:<br>PORQUE ÉSTA ES MI SANGRE DEL NUEVO TESTAMENTO,<br>QUE ES DERRAMADA POR VOSOTROS Y POR MUCHOS<br>PARA LA REMISIÓN DE LOS PECADOS;<br>HACED ESTO, CUANTAS VECES LO BEBIEREIS, EN MEMORIA MÍA.'),
    R('El Sacerdote hace genuflexión y eleva el Cáliz. Suenan las campanillas.'),
    T('LA OBLACIÓN (1549)'),
    O('Por lo cual, oh Señor y Padre celestial, según la institución de tu muy amado Hijo, nuestro Salvador Jesucristo, nosotros, tus humildes siervos, celebramos y hacemos ante tu Divina Majestad, con estos tus santos dones, el memorial que tu Hijo ha mandado hacer; recordando su bendita pasión, su poderosa resurrección y su gloriosa ascensión, rindiéndote las más sinceras gracias por los innumerables beneficios que por los mismos nos ha procurado; y te suplicamos humildemente, oh Padre misericordioso, que escuches nuestras oraciones; y que, por tu Espíritu Santo, concedas que quienquiera que sea partícipe de esta santa Comunión, reciba dignamente el sacrosanto Cuerpo y Sangre de tu Hijo Jesucristo; y sea lleno de tu gracia y bendición celestial. Y aunque seamos indignos, por nuestros muchos pecados, de ofrecerte sacrificio alguno, te suplicamos, sin embargo, que aceptes este nuestro sacrificio de alabanza y acción de gracias; no pesando nuestros méritos, sino perdonando nuestras ofensas, por Jesucristo nuestro Señor. Por quien, y con quien, en la unidad del Espíritu Santo, todo honor y gloria sea a ti, oh Padre Todopoderoso, por los siglos de los siglos.'),
    P('Amén.'),
  ].join('');


  // ══════════════════════════════════════════════════════════════════════════
  // ORACIÓN POR LA IGLESIA MILITANTE (1662) — se reza después del Ofertorio y
  // antes del Prefacio, según el orden del Libro de Oración Común de 1662.
  // A diferencia de 1549 y del Canon Romano, el rito de 1662 (post-Reforma) NO
  // pide directamente descanso o paz para los difuntos, sino que da gracias por
  // ellos y pide gracia para seguir su ejemplo — una distinción teológica real
  // entre ambas revisiones del Libro de Oración Común.
  // ══════════════════════════════════════════════════════════════════════════
  const CHURCH_MILITANT_1662 = [
    T('ORACIÓN POR LA IGLESIA MILITANTE (1662)'),
    O('Oremos por todo el estado de la Iglesia de Cristo militante en la tierra.'),
    O('Dios Todopoderoso y siempre viviente, que por tu santo Apóstol nos enseñaste a hacer oraciones y súplicas, y a dar gracias, por todos los hombres: te suplicamos humildemente que recibas estas nuestras oraciones, que ofrecemos a tu Divina Majestad, rogándote que inspires continuamente a la Iglesia Universal con el espíritu de verdad, unidad y concordia; y concede que todos los que confiesan tu santo Nombre convengan en la verdad de tu santa Palabra, y vivan en unidad y en piadoso amor.'),
    O('Te suplicamos también que salves y defiendas a todos los Reyes, Príncipes y Gobernantes cristianos, y especialmente a tus siervos N., para que bajo ellos seamos piadosa y pacíficamente gobernados: y concede a todo su Consejo, y a todos los que han sido puestos en autoridad bajo ellos, que administren verdadera e imparcialmente la justicia, para castigo de la maldad y el vicio, y para el mantenimiento de tu verdadera religión y virtud.'),
    O('Da gracia, oh Padre celestial, a todos los Obispos y Curas, para que tanto con su vida como con su doctrina muestren tu verdadera y vivificante Palabra, y administren recta y debidamente tus Santos Sacramentos.'),
    O('Y a todo tu pueblo da tu gracia celestial; y especialmente a esta congregación aquí presente; para que, con corazón manso y debida reverencia, oigan y reciban tu santa Palabra; sirviéndote verdaderamente en santidad y justicia todos los días de su vida.'),
    O('Y te suplicamos humildísimamente, oh Señor, que por tu bondad consueles y socorras a todos aquellos que, en esta vida transitoria, están en tribulación, tristeza, necesidad, enfermedad, o cualquier otra adversidad.'),
    O('Y también bendecimos tu santo Nombre por todos tus siervos que han partido de esta vida en tu fe y temor; suplicándote que nos concedas la gracia de seguir sus buenos ejemplos, para que con ellos seamos partícipes de tu reino celestial. Concede esto, oh Padre, por Jesucristo, nuestro único Mediador y Abogado.'),
    P('Amén.'),
  ].join('');

  // ══════════════════════════════════════════════════════════════════════════
  // CANON DE 1662 (SOLO ESPAÑOL, NO APLICA LATÍN HISTÓRICO)
  // ══════════════════════════════════════════════════════════════════════════
  const CANON_1662 = [
    T('LA PLEGARIA DE CONSAGRACIÓN (1662)'),
    O('Dios Todopoderoso, Padre nuestro celestial, que por tu tierna misericordia diste a tu único Hijo Jesucristo para padecer la muerte de cruz por nuestra redención; quien hizo allí (por su única oblación de sí mismo ofrecida una sola vez) un sacrificio, oblación y satisfacción plena, perfecta y suficiente por los pecados de todo el mundo; y ordenó, y en su santo Evangelio nos mandó continuar, una memoria perpetua de su preciosa muerte, hasta su venida:'),
    O('Escúchanos, oh Padre misericordioso, te suplicamos humildemente; y concédenos que al recibir estas tus criaturas de pan y vino, según la santa institución de tu Hijo nuestro Salvador Jesucristo, en memoria de su muerte y pasión, seamos partícipes de su sacrosanto Cuerpo y Sangre;'),
    O('Quien en la misma noche en que fue entregado, tomó Pan; y habiendo dado gracias, lo partió, y se lo dio a sus discípulos, diciendo:'),
    C('TOMAD, COMED, ÉSTE ES MI CUERPO QUE ES DADO POR VOSOTROS:<br>HACED ESTO EN MEMORIA MÍA.'),
    R('El Sacerdote eleva la Hostia.'),
    O('Asimismo, después de cenar, tomó el Cáliz; y habiendo dado gracias, se lo dio a ellos, diciendo:'),
    C('BEBED TODOS DE ÉL; PORQUE ÉSTA ES MI SANGRE DEL NUEVO TESTAMENTO, QUE ES DERRAMADA POR VOSOTROS Y POR MUCHOS PARA LA REMISIÓN DE LOS PECADOS:<br>HACED ESTO, CUANTAS VECES LO BEBIEREIS, EN MEMORIA MÍA.'),
    R('El Sacerdote eleva el Cáliz.'),
    P('Amén.'),
    R('Sigue inmediatamente la Comunión del Sacerdote y del Pueblo. Después de la Comunión, se reza el Padre Nuestro y la Plegaria de Oblación o Acción de Gracias.')
  ].join('');

  // ══════════════════════════════════════════════════════════════════════════
  // ORACIÓN POR TODA LA IGLESIA (1928) — Libro de Oración Común de la Iglesia
  // Episcopal en los EE. UU. (1928), de dominio público. Se reza, como en
  // 1662, después del Ofertorio y antes del Prefacio. A diferencia de 1662,
  // el uso americano de 1928 añade una petición explícita de "crecimiento
  // continuo" en el amor y servicio de Dios para los fieles difuntos —una
  // restauración parcial de la intercesión por los muertos que 1662 había
  // suavizado— y sustituye la mención del Rey por la del Presidente de los
  // Estados Unidos.
  // ══════════════════════════════════════════════════════════════════════════
  const CHURCH_MILITANT_1928 = [
    T('ORACIÓN POR TODA LA IGLESIA (BCP 1928)'),
    O('Dios Todopoderoso y siempre viviente, que por tu santo Apóstol nos enseñaste a hacer oraciones y súplicas, y a dar gracias, por todos los hombres: te suplicamos humildemente que aceptes nuestras limosnas y oblaciones, y recibas estas nuestras oraciones, que ofrecemos a tu Divina Majestad; rogándote que inspires continuamente a la Iglesia Universal con el espíritu de verdad, unidad y concordia; y concede que todos los que confiesan tu santo Nombre convengan en la verdad de tu santa Palabra, y vivan en unidad y en piadoso amor.'),
    O('Te suplicamos también que dirijas y dispongas los corazones de todos los que gobiernan cristianamente, para que administren verdadera e imparcialmente la justicia, para castigo de la maldad y el vicio, y para el mantenimiento de tu verdadera religión y virtud. Especialmente te rogamos por el Presidente de los Estados Unidos y por todos los demás constituidos en autoridad.'),
    O('Da gracia, oh Padre celestial, a todos los Obispos y demás Ministros, para que tanto con su vida como con su doctrina muestren tu verdadera y vivificante Palabra, y administren recta y debidamente tus Santos Sacramentos.'),
    O('Y a todo tu pueblo da tu gracia celestial; y especialmente a esta congregación aquí presente; para que, con corazón manso y debida reverencia, oigan y reciban tu santa Palabra; sirviéndote verdaderamente en santidad y justicia todos los días de su vida.'),
    O('Y te suplicamos humildísimamente, oh Señor, que de tu bondad consueles y socorras a todos aquellos que, en esta vida transitoria, están en tribulación, tristeza, necesidad, enfermedad, o cualquier otra adversidad.'),
    O('Y también bendecimos tu santo Nombre por todos tus siervos que han partido de esta vida en tu fe y temor; suplicándote que les concedas continuo crecimiento en tu amor y servicio; y que nos concedas la gracia de seguir sus buenos ejemplos, para que con ellos seamos partícipes de tu reino celestial. Concede esto, oh Padre, por Jesucristo, nuestro único Mediador y Abogado.'),
    P('Amén.'),
  ].join('');

  // ══════════════════════════════════════════════════════════════════════════
  // CANON DE 1928 (SOLO ESPAÑOL, NO APLICA LATÍN HISTÓRICO) — Libro de
  // Oración Común de la Iglesia Episcopal en los EE. UU. (1928), texto de
  // dominio público. A diferencia de 1662, la Plegaria de Consagración
  // americana no termina en las Palabras de la Institución, sino que
  // continúa, dentro de la misma plegaria, con la Oblación (el memorial) y
  // la Invocación del Espíritu Santo sobre el pan y el vino —restaurando así
  // una estructura afín a la del rito escocés no-jurante, en el que se basó
  // la revisión americana—. Por ello, en 1928 no existe una "Plegaria de
  // Oblación" separada después de la Comunión, como en 1662.
  // ══════════════════════════════════════════════════════════════════════════
  const CANON_1928 = [
    T('LA PLEGARIA DE CONSAGRACIÓN (BCP 1928)'),
    O('Toda gloria sea a ti, Dios Todopoderoso, Padre nuestro celestial, porque, por tu tierna misericordia, diste a tu único Hijo Jesucristo para padecer la muerte de cruz por nuestra redención; quien allí hizo (por su única oblación de sí mismo, ofrecida una sola vez) un sacrificio, oblación y satisfacción plena, perfecta y suficiente por los pecados de todo el mundo; y ordenó, y en su santo Evangelio nos mandó continuar, una memoria perpetua de su preciosa muerte y sacrificio, hasta su venida de nuevo:'),
    O('Porque en la noche en que fue entregado, tomó Pan; y habiendo dado gracias, lo partió, y lo dio a sus discípulos, diciendo:'),
    C('TOMAD, COMED, ÉSTE ES MI CUERPO QUE ES DADO POR VOSOTROS:<br>HACED ESTO EN MEMORIA MÍA.'),
    R('El Sacerdote eleva la Hostia.'),
    O('Asimismo, después de cenar, tomó el Cáliz; y habiendo dado gracias, se lo dio a ellos, diciendo:'),
    C('BEBED TODOS DE ÉL; PORQUE ÉSTA ES MI SANGRE DEL NUEVO TESTAMENTO, QUE ES DERRAMADA POR VOSOTROS Y POR MUCHOS PARA LA REMISIÓN DE LOS PECADOS:<br>HACED ESTO, CUANTAS VECES LO BEBIEREIS, EN MEMORIA MÍA.'),
    R('El Sacerdote eleva el Cáliz.'),
    T('LA OBLACIÓN'),
    O('Por lo cual, oh Señor y Padre celestial, según la institución de tu muy amado Hijo, nuestro Salvador Jesucristo, nosotros, tus humildes siervos, celebramos y hacemos aquí, ante tu Divina Majestad, con estos tus santos dones, el memorial que tu Hijo nos ha mandado hacer; teniendo en memoria su bendita pasión y preciosa muerte, su poderosa resurrección y gloriosa ascensión; y rindiéndote las más sinceras gracias por los innumerables beneficios que por las mismas nos has procurado.'),
    T('LA INVOCACIÓN'),
    O('Y te suplicamos humildísimamente, oh Padre misericordioso, que nos escuches; y que, de tu infinita bondad, te dignes bendecir ✠ y santificar ✠, con tu Palabra y Espíritu Santo, estos tus dones y criaturas de pan y vino; para que nosotros, recibiéndolos según la santa institución de tu Hijo nuestro Salvador Jesucristo, en memoria de su muerte y pasión, seamos partícipes de su sacrosanto Cuerpo y Sangre.'),
    O('Y deseamos que tu paternal bondad acepte este nuestro deber y servicio obligado; y que concedas que nosotros, y todos los demás que participemos de esta Santa Comunión, recibamos dignamente el preciosísimo Cuerpo y Sangre de tu Hijo Jesucristo, seamos llenos de tu gracia y bendición celestial, y hechos un solo cuerpo con él, para que él more en nosotros, y nosotros en él. Y aunque somos indignos, por nuestros muchos pecados, de ofrecerte sacrificio alguno, te suplicamos, sin embargo, que aceptes este nuestro deber y servicio obligado; no pesando nuestros méritos, sino perdonando nuestras ofensas, por Jesucristo nuestro Señor; por quien, y con quien, en la unidad del Espíritu Santo, todo honor y gloria sea a ti, oh Padre Todopoderoso, por los siglos de los siglos.'),
    P('Amén.'),
    R('Sigue inmediatamente la Comunión del Sacerdote y del Pueblo. Después de la Comunión, se reza el Padre Nuestro y la Oración de Acción de Gracias.')
  ].join('');

  // ══════════════════════════════════════════════════════════════════════════
  // ORACIÓN DE ACCIÓN DE GRACIAS (1928) — única oración postcomunión de
  // autoofrecimiento; a diferencia de 1662, el rito americano de 1928 no
  // ofrece dos formas alternativas (Acción de Gracias / Oblación), sino una
  // sola forma fija que se dice siempre después del Padre Nuestro.
  // ══════════════════════════════════════════════════════════════════════════
  const THANKSGIVING_1928 = [
    T('ORACIÓN DE ACCIÓN DE GRACIAS (BCP 1928)'),
    O('Oh Señor y Padre celestial, nosotros, tus humildes siervos, deseamos enteramente que tu paternal bondad acepte misericordiosamente este nuestro sacrificio de alabanza y acción de gracias; suplicándote humildísimamente que nos concedas, por los méritos y muerte de tu Hijo Jesucristo, y por la fe en su Sangre, a nosotros y a toda tu Iglesia, la remisión de nuestros pecados, y todos los demás beneficios de su Pasión.'),
    O('Y aquí nos ofrecemos y presentamos a ti, oh Señor, nosotros mismos, nuestras almas y cuerpos, para ser un sacrificio razonable, santo y vivo ante ti; suplicándote humildemente que todos cuantos seamos partícipes de esta Santa Comunión seamos llenos de tu gracia y bendición celestial, y hechos un solo cuerpo con tu Hijo Jesucristo, para que él more en nosotros, y nosotros en él.'),
    O('Y aunque somos indignos, por nuestros muchos pecados, de ofrecerte sacrificio alguno, te rogamos, sin embargo, que aceptes este nuestro deber y servicio obligado; no pesando nuestros méritos, sino perdonando nuestras ofensas; por Jesucristo nuestro Señor, por quien, y con quien, en la unidad del Espíritu Santo, todo honor y gloria sea a ti, oh Padre Todopoderoso, por los siglos de los siglos.'),
    P('Amén.'),
  ].join('');

  // ── API pública con getters dinámicos ──────────────────────────────────────
  function setLanguage(lang, dayKey = null) {
    currentLang = lang || 'es';
    if (dayKey) currentDayKey = dayKey;
  }

  function getCommunicantesEmbolism(dayKey) {
    const data = COMMUNICANTES_EMBOLISMS_DATA[resolveEmbolismKey(dayKey)];
    if (!data) return null;
    if (currentLang === 'es') return data.es;
    if (currentLang === 'la') return data.la;
    return `<div class="lit-bilingual-row"><div class="lit-column-la">${data.la}</div><div class="lit-column-es">${data.es}</div></div>`;
  }

  function getHancIgitur(dayKey) {
    // Forma especial (menciona a los recién bautizados) usada durante toda la Octava
    // de Pascua y también durante Pentecostés y su Octava (bautismos también en esa Vigilia).
    const isEasterOctave = dayKey === 'easter' || dayKey === 'easter2' || (dayKey && dayKey.startsWith('easterFeria1_'));
    const isPentecostOctave = dayKey === 'pentecost' || (dayKey && dayKey.startsWith('pentecostFeria'));
    const data = (isEasterOctave || isPentecostOctave) ? HANC_IGITUR_EASTER_DATA : HANC_IGITUR_NORMAL_DATA;
    return zip(data);
  }

  // Ferias entre el Domingo de Pasión y el Domingo de Ramos. calendar.js numera
  // ahora las semanas de Cuaresma a partir del Domingo que las abre, de modo que
  // la Semana de Pasión ENTERA (lunes a sábado) es lentFeria5_{1..6}; la clave
  // lentFeria6_* ya no se emite. Antes esta función esperaba el reparto anterior
  // (lentFeria5_{1,2,3} + lentFeria6_{4,5,6}) y dejaba fuera el jueves, viernes y
  // sábado de la Semana de Pasión — 105 días en 2024-2060 que conservaban el
  // Judica me debiendo omitirlo.
  function isPassionWeekFeria(dayKey) {
    const m = dayKey && dayKey.match(/^lentFeria(\d+)_(\d+)$/);
    if (!m) return false;
    return Number(m[1]) === 5;
  }

  function omitJudica(dayKey, color) {
    return color === 'black' ||
      ['goodFriday','holySaturday','lent5','palmSunday','maundyThursday'].includes(dayKey) ||
      (dayKey && dayKey.endsWith('HolyWeek')) ||
      isPassionWeekFeria(dayKey);  // Semana de Pasión (ferias entre Dom. de Pasión y Dom. de Ramos)
  }

  // El Asperges solo se reza en domingo, así que el único par de domingos que cae
  // dentro del Tiempo de Pasión (Dom. de Pasión → Miércoles Santo) es este.
  function getAspergesMe(dayKey) {
    const inPassiontide = dayKey === 'lent5' || dayKey === 'palmSunday';
    const data = inPassiontide ? ASPERGES_ME_DATA.filter(item => !item.omitInPassiontide) : ASPERGES_ME_DATA;
    return zip(data);
  }

  const CanonInterface = {
    setLanguage,
    getCommunicantesEmbolism,
    getHancIgitur,
    omitJudica,
    getAspergesMe,
    CANON_1549,
    CANON_1662,
    CHURCH_MILITANT_1662,
    CANON_1928,
    CHURCH_MILITANT_1928,
    THANKSGIVING_1928
  };

  // Definición de propiedades dinámicas reactivas al idioma activo
  const dynamicProps = {
    'JUDICA_ME': JUDICA_ME_DATA,
    'CONFITEOR': CONFITEOR_DATA,
    'ASCENT': ASCENT_DATA,
    'KYRIE': KYRIE_DATA,
    'GLORIA': GLORIA_DATA,
    'SALUTATION': SALUTATION_DATA,
    'CREED': CREED_DATA,
    'OFFERTORY': OFFERTORY_DATA,
    'SURSUM_CORDA': SURSUM_CORDA_DATA,
    'SANCTUS': SANCTUS_DATA,
    'CANON_CONTINUED': CANON_CONTINUED_DATA,
    'PATER_NOSTER': PATER_NOSTER_DATA,
    'COMMUNION_PREP': COMMUNION_PREP_DATA,
    'ABLUTIONS': ABLUTIONS_DATA,
    'DISMISSAL': DISMISSAL_DATA,
    'DISMISSAL_PASCHALTIDE': DISMISSAL_PASCHALTIDE_DATA,
    'LAST_GOSPEL': LAST_GOSPEL_DATA,
    'LEONINE': LEONINE_DATA,
    'LEONINE_PASCHALTIDE': LEONINE_PASCHALTIDE_DATA,
    'VIDI_AQUAM': VIDI_AQUAM_DATA
  };

  for (const [key, data] of Object.entries(dynamicProps)) {
    Object.defineProperty(CanonInterface, key, {
      get: () => zip(data),
      enumerable: true,
      configurable: true
    });
    // Variante para el Librito del Pueblo: redacta las oraciones privadas del Sacerdote.
    Object.defineProperty(CanonInterface, key + '_PUEBLO', {
      get: () => zip(data, true),
      enumerable: true,
      configurable: true
    });
  }

  // Caso especial: Canon Romano (TE IGITUR + MEMENTO + COMMUNICANTES) que tiene embolismo variable
  Object.defineProperty(CanonInterface, 'CANON_TEXT', {
    get: () => zip(getCommunicantesText()),
    enumerable: true,
    configurable: true
  });

  return CanonInterface;
})();
