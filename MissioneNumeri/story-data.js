// ============================================================
// MISSIONE NUMERI — dati delle avventure
// Ogni mondo ha 20 stanze (l'ultima è sempre una stanza "boss"
// con 2 enigmi). Tipi di enigma disponibili: addsub, counting,
// comparison, combinatoria, shapes, wordproblem, cipher,
// keymatch, sequence, pattern.
// I livelli (facile → complicatissimo) determinano SOLO la
// grandezza dei numeri e la presenza del riporto/prestito, che
// compare esclusivamente nel livello "hard" (Complicatissimo).
// ============================================================

const WORLDS = {

  // ----------------------------------------------------------
  // IL REGNO DELLE MACCHINE — Facile
  // ----------------------------------------------------------
  castello: {
    id: "castello",
    theme: "castello",
    emoji: "⚙️",
    name: "Il Regno delle Macchine",
    tagline: "Un'avventura tra ingranaggi, vapore e invenzioni.",
    difficulty: "facile",
    difficultyLabel: "Facile",
    level: "easy",
    briefing: "Il Grande Orologio che scandisce il tempo per tutto il Regno delle Macchine si è fermato! Leo, giovane apprendista inventore, deve attraversare sale di ingranaggi e vapore per ripararlo pezzo dopo pezzo, risolvendo un enigma alla volta. Aiuterai Leo a rimettere in moto il regno?",
    victoryText: "Il Grande Orologio riparte con un rombo potente! Gli ingranaggi tornano a girare e tutto il Regno delle Macchine festeggia con fischi di vapore e campane di ottone.",
    stanze: [
      { text: "Leo entra nella Sala delle Caldaie, dove il vapore sibila tra i tubi di rame.", problems: [{ type: "addsub" }] },
      { text: "Sul pavimento sono sparsi tanti ingranaggi: alcuni sono dorati e più preziosi degli altri.", problems: [{ type: "counting", flavor: { mainEmoji: "⚙️", targetEmoji: "🟡", label: "ingranaggi dorati", allLabel: "ingranaggi" } }] },
      { text: "Due leve di ottone spuntano dal muro: una più lunga, una più corta.", problems: [{ type: "comparison" }] },
      { text: "Un nastro trasportatore mostra casse numerate in fila, ma una è andata perduta.", problems: [{ type: "sequence" }] },
      { text: "Sul pannello luminoso lampeggiano lucine colorate, sempre nello stesso ordine.", problems: [{ type: "pattern" }] },
      { text: "Un ingranaggio enorme blocca il passaggio: per smontarlo bisogna riconoscerne la forma.", problems: [{ type: "shapes" }] },
      { text: "Leo ripara una valvola che borbotta numeri insieme a sbuffi di vapore.", problems: [{ type: "addsub" }] },
      { text: "Un vecchio orologiaio robot propone un indovinello sulle rotelle colorate del suo laboratorio.", problems: [{ type: "combinatoria", flavor: { itemLabel: "rotelle colorate", subjectName: "Un vecchio orologiaio robot" } }] },
      { text: "Nel Deposito Bulloni, Leo conta i pezzi necessari per costruire il prossimo ingranaggio.", problems: [{ type: "wordproblem", flavor: { itemLabel: "bulloni", characterName: "Leo" } }] },
      { text: "Tre serrature meccaniche proteggono la Sala dei Pistoni: solo una chiave ha la forma giusta.", problems: [{ type: "keymatch" }] },
      { text: "In una cesta di componenti, Leo nota alcune viti blu tra tutte le altre.", problems: [{ type: "counting", flavor: { mainEmoji: "🔩", targetEmoji: "🔵", label: "viti blu", allLabel: "viti" } }] },
      { text: "Due tubi del vapore attraversano il soffitto: uno più lungo dell'altro.", problems: [{ type: "comparison" }] },
      { text: "Il pannello di controllo del Grande Orologio si sblocca solo con un codice segreto.", problems: [{ type: "cipher" }] },
      { text: "Gli ultimi ingranaggi della torre sono numerati, ma uno è scomparso, arrugginito.", problems: [{ type: "sequence" }] },
      { text: "Un mosaico di piastrelle colorate decora il pavimento della sala macchine, con un disegno che si ripete.", problems: [{ type: "pattern" }] },
      { text: "Leo stringe l'ultimo bullone prima di entrare nel cuore del meccanismo.", problems: [{ type: "addsub" }] },
      { text: "Una ruota dentata dalla forma insolita blocca la porta successiva.", problems: [{ type: "shapes" }] },
      { text: "Il magazziniere robot chiede aiuto per contare le molle rimaste.", problems: [{ type: "wordproblem", flavor: { itemLabel: "molle", characterName: "Il magazziniere robot" } }] },
      { text: "Leo è quasi arrivato: un ultimo blocco lo separa dalla stanza finale.", problems: [{ type: "addsub" }] },
      { text: "Il Grande Orologio è fermo da troppo tempo: una doppia sfida finale lo rimetterà in moto per sempre!", problems: [{ type: "addsub" }, { type: "comparison" }] },
    ],
  },

  // ----------------------------------------------------------
  // L'ISOLA DEI SETTE FORZIERI — Media
  // ----------------------------------------------------------
  pirati: {
    id: "pirati",
    theme: "pirati",
    emoji: "🏴‍☠️",
    name: "L'Isola dei Sette Forzieri",
    tagline: "Un viaggio di mare pieno di indovinelli.",
    difficulty: "media",
    difficultyLabel: "Media",
    level: "medium",
    briefing: "Una vecchia mappa scolorita ti ha portato fino a qui: l'Isola dei Sette Forzieri. Ogni forziere è protetto da un enigma. Sei pronto a salpare?",
    victoryText: "Hai trovato tutti e sette i forzieri! L'equipaggio ti nomina Capitano dei Numeri.",
    stanze: [
      { text: "Sbarchi sull'isola con la mappa in mano. Il primo segno X appare solo risolvendo questo calcolo.", problems: [{ type: "addsub" }] },
      { text: "Sulla spiaggia trovi un insieme di conchiglie: alcune sono rosa scintillante.", problems: [{ type: "counting", flavor: { mainEmoji: "🐚", targetEmoji: "🌸", label: "conchiglie rosa", allLabel: "conchiglie" } }] },
      { text: "Due sentieri nella giungla portano al campo pirata: uno segnato con un numero più alto dell'altro.", problems: [{ type: "comparison" }] },
      { text: "Una serie di orme sulla sabbia conduce al tesoro, ma un'impronta numerata manca.", problems: [{ type: "sequence" }] },
      { text: "Delle bandierine colorate sventolano in cima all'albero maestro, sempre nello stesso ordine.", problems: [{ type: "pattern" }] },
      { text: "Un vecchio scudo di legno blocca l'ingresso della grotta: riconoscine la forma.", problems: [{ type: "shapes" }] },
      { text: "Il ponte di corde scricchiola paurosamente: solo il calcolo giusto lo rende sicuro.", problems: [{ type: "addsub" }] },
      { text: "Un pappagallo saccente propone un indovinello sulle bandiere delle navi pirata.", problems: [{ type: "combinatoria", flavor: { itemLabel: "bandiere", subjectName: "Il pappagallo Coco" } }] },
      { text: "Il cuoco di bordo ti chiede aiuto per contare le provviste rimaste.", problems: [{ type: "wordproblem", flavor: { itemLabel: "banane", characterName: "Il cuoco della nave" } }] },
      { text: "Sotto la palma più storta dell'isola trovi un forziere con tre serrature di forme diverse.", problems: [{ type: "keymatch" }] },
      { text: "Nella grotta scintillante trovi un insieme di gemme: alcune sono rosse come il fuoco.", problems: [{ type: "counting", flavor: { mainEmoji: "💎", targetEmoji: "🔴", label: "gemme rosse", allLabel: "gemme" } }] },
      { text: "Due grotte nascondono ciascuna un forziere: uno è custodito più in profondità dell'altro.", problems: [{ type: "comparison" }] },
      { text: "Il vecchio forziere di legno si apre solo con un codice segreto.", problems: [{ type: "cipher" }] },
      { text: "Una fila di botti numerate blocca il passaggio: una botte manca all'appello.", problems: [{ type: "sequence" }] },
      { text: "Sul vecchio stendardo pirata si ripete sempre lo stesso disegno a teschi e ossa.", problems: [{ type: "pattern" }] },
      { text: "Un'onda improvvisa ti costringe a calcolare in fretta la rotta sicura.", problems: [{ type: "addsub" }] },
      { text: "Un timone antico, dalla forma particolare, blocca l'accesso alla stiva.", problems: [{ type: "shapes" }] },
      { text: "Il nostromo ti chiede quante corde restano dopo la tempesta.", problems: [{ type: "wordproblem", flavor: { itemLabel: "corde", characterName: "Il nostromo" } }] },
      { text: "Sei quasi arrivato alla Baia dei Sette Forzieri: un ultimo scoglio da superare.", problems: [{ type: "addsub" }] },
      { text: "Sei arrivato alla Baia dei Sette Forzieri! Risolvi la doppia sfida del capitano per reclamare il tesoro leggendario.", problems: [{ type: "addsub" }, { type: "counting", flavor: { mainEmoji: "🟡", targetEmoji: "🔴", label: "monete rosse", allLabel: "monete del tesoro" } }] },
    ],
  },

  // ----------------------------------------------------------
  // MISSIONE STELLARE ORIONE — Difficile
  // ----------------------------------------------------------
  spazio: {
    id: "spazio",
    theme: "spazio",
    emoji: "🚀",
    name: "Missione Stellare Orione",
    tagline: "Vola tra i pianeti risolvendo enigmi spaziali.",
    difficulty: "difficile",
    difficultyLabel: "Difficile",
    level: "medium2",
    briefing: "Il centro di controllo ha perso il contatto con la stazione spaziale Orione-9. Sali a bordo del tuo razzo: solo risolvendo gli enigmi di rotta potrai raggiungerla!",
    victoryText: "Hai raggiunto la stazione Orione-9 e salvato l'equipaggio! La Terra festeggia il tuo nome tra le stelle.",
    stanze: [
      { text: "Decolli dalla base spaziale. Il computer di bordo chiede il codice di lancio.", problems: [{ type: "addsub" }] },
      { text: "Attraversi un campo di asteroidi: alcuni brillano di un colore diverso dagli altri.", problems: [{ type: "counting", flavor: { mainEmoji: "🪨", targetEmoji: "✨", label: "asteroidi luminosi", allLabel: "asteroidi" } }] },
      { text: "Due pianeti appaiono all'orizzonte: uno è più vicino dell'altro alla tua rotta.", problems: [{ type: "comparison" }] },
      { text: "Sullo schermo appare una sequenza di pianeti numerati, ma uno manca dalla fila.", problems: [{ type: "sequence" }] },
      { text: "Le luci di segnalazione della plancia lampeggiano seguendo uno schema preciso.", problems: [{ type: "pattern" }] },
      { text: "Un portale antico, dalla forma sconosciuta, blocca la rotta verso Orione.", problems: [{ type: "shapes" }] },
      { text: "Superi la Nube Viola, dove ogni cosa fluttua, numeri compresi.", problems: [{ type: "addsub" }] },
      { text: "Un archivio stellare ti sfida a combinare i colori delle bandiere di missione.", problems: [{ type: "combinatoria", flavor: { itemLabel: "bandiere di missione", subjectName: "L'archivio stellare" } }] },
      { text: "Un piccolo robot ti chiede aiuto per calcolare il carburante rimasto per il viaggio.", problems: [{ type: "wordproblem", flavor: { itemLabel: "litri di carburante", characterName: "Il robot di bordo" } }] },
      { text: "Il portellone del laboratorio alieno ha tre serrature di forme diverse.", problems: [{ type: "keymatch" }] },
      { text: "Nella Stazione Fantasma trovi un insieme di stelle cadute: alcune sono dorate.", problems: [{ type: "counting", flavor: { mainEmoji: "⭐", targetEmoji: "🟡", label: "stelle dorate", allLabel: "stelle" } }] },
      { text: "Due lune orbitano vicine: una ha un diametro maggiore dell'altra.", problems: [{ type: "comparison" }] },
      { text: "Il pannello centrale della stazione si sblocca solo con un codice segreto.", problems: [{ type: "cipher" }] },
      { text: "Il segnale di Orione-9 pulsa a intervalli numerati, ma uno manca.", problems: [{ type: "sequence" }] },
      { text: "I pannelli solari si illuminano seguendo sempre lo stesso schema di colori.", problems: [{ type: "pattern" }] },
      { text: "Un asteroide gigante blocca la rotta: solo un calcolo preciso apre un varco sicuro.", problems: [{ type: "addsub" }] },
      { text: "Un cristallo spaziale dalla forma particolare sigilla l'ultima porta.", problems: [{ type: "shapes" }] },
      { text: "L'intelligenza artificiale di bordo chiede quanta energia resta per l'atterraggio.", problems: [{ type: "wordproblem", flavor: { itemLabel: "unità di energia", characterName: "L'intelligenza artificiale di bordo" } }] },
      { text: "Manca solo un ultimo salto quantico prima di raggiungere Orione-9.", problems: [{ type: "addsub" }] },
      { text: "Sei arrivato a Orione-9! Il portellone finale si apre solo con la doppia combinazione.", problems: [{ type: "addsub" }, { type: "sequence" }] },
    ],
  },

  // ----------------------------------------------------------
  // IL GRANDE SCAVO DEI DINOSAURI — Complicatissimo
  // ----------------------------------------------------------
  dino: {
    id: "dino",
    theme: "dino",
    emoji: "🦴",
    name: "Il Grande Scavo dei Dinosauri",
    tagline: "La sfida più intensa, per veri esploratori esperti.",
    difficulty: "complicatissimo",
    difficultyLabel: "Complicatissimo",
    level: "hard",
    briefing: "Sei il paleontologo più giovane della spedizione! Un intero scheletro di dinosauro è sepolto sotto il campo di scavo: ogni osso ritrovato richiede un calcolo preciso, con numeri più grandi e qualche riporto in più. Se ti blocchi, il tasto Aiuto ti mostrerà come funziona il riporto con un esempio. Pronto per la sfida più intensa?",
    victoryText: "Hai riportato alla luce lo scheletro completo del dinosauro! Il museo lo chiamerà con il tuo nome per sempre.",
    stanze: [
      { text: "Arrivi al campo base della spedizione. Il capo archeologo ti affida la tua prima area di scavo.", problems: [{ type: "addsub" }] },
      { text: "Scavando, trovi un insieme di frammenti d'osso: alcuni sono chiaramente fossilizzati.", problems: [{ type: "counting", flavor: { mainEmoji: "🪨", targetEmoji: "🦴", label: "frammenti fossilizzati", allLabel: "frammenti" } }] },
      { text: "La sabbia si sposta e appare un artiglio enorme: per liberarlo serve un calcolo preciso.", problems: [{ type: "addsub" }] },
      { text: "Due zampe fossili emergono dalla roccia: una impronta è più grande dell'altra.", problems: [{ type: "comparison" }] },
      { text: "Le incisioni tribali sulla roccia seguono uno schema che si ripete.", problems: [{ type: "pattern" }] },
      { text: "Una grande zampa fossile ha lasciato un'impronta dalla forma particolare.", problems: [{ type: "shapes" }] },
      { text: "Con pennello e pazienza, liberi un altro osso importante dalla roccia.", problems: [{ type: "addsub" }] },
      { text: "Il team ti sfida a combinare le etichette colorate per catalogare i reperti.", problems: [{ type: "combinatoria", flavor: { itemLabel: "etichette colorate", subjectName: "Il team di scavo" } }] },
      { text: "Il capo archeologo ti chiede quante ossa restano da catalogare.", problems: [{ type: "wordproblem", flavor: { itemLabel: "ossa", characterName: "Il capo archeologo" } }] },
      { text: "Una cassa di reperti ha tre serrature antiche di forme diverse.", problems: [{ type: "keymatch" }] },
      { text: "Tra la sabbia noti diversi denti fossili: alcuni sono particolarmente bianchi.", problems: [{ type: "counting", flavor: { mainEmoji: "🦷", targetEmoji: "⚪", label: "denti bianchi", allLabel: "denti fossili" } }] },
      { text: "Due vertebre fossili emergono dalla roccia: una è più grande dell'altra.", problems: [{ type: "comparison" }] },
      { text: "Il registro di scavo si apre solo con un codice numerico segreto.", problems: [{ type: "cipher" }] },
      { text: "Le tacche numerate sul metro da scavo sono quasi tutte leggibili, tranne una.", problems: [{ type: "sequence" }] },
      { text: "Le squame fossilizzate sulla coda seguono un disegno che si ripete.", problems: [{ type: "pattern" }] },
      { text: "Un'improvvisa tempesta di sabbia ti costringe a lavorare in fretta e con attenzione.", problems: [{ type: "addsub" }] },
      { text: "Il cranio fossile ha una forma particolare da riconoscere per il catalogo.", problems: [{ type: "shapes" }] },
      { text: "L'esperto del museo chiede quante misurazioni mancano ancora.", problems: [{ type: "wordproblem", flavor: { itemLabel: "misurazioni", characterName: "L'esperto del museo" } }] },
      { text: "Restano solo pochi frammenti sparsi: raccoglili con cura prima del tramonto.", problems: [{ type: "addsub" }] },
      { text: "È il momento di ricomporre lo scheletro completo: risolvi la doppia sfida finale!", problems: [{ type: "addsub" }, { type: "addsub" }] },
    ],
  },

};
