// ============================================================
// MISSIONE NUMERI — logica dell'app
// ============================================================

const STORAGE_KEY = "mathquest_progress_v1";

const els = {
  home: document.getElementById("screen-home"),
  briefing: document.getElementById("screen-briefing"),
  game: document.getElementById("screen-game"),
  victory: document.getElementById("screen-victory"),
  worldGrid: document.getElementById("world-grid"),

  briefingEmoji: document.getElementById("briefing-emoji"),
  briefingTitle: document.getElementById("briefing-title"),
  briefingText: document.getElementById("briefing-text"),
  btnStart: document.getElementById("btn-start"),
  btnContinue: document.getElementById("btn-continue"),
  btnBackHome1: document.getElementById("btn-back-home-1"),

  gameStars: document.getElementById("game-stars"),
  btnExit: document.getElementById("btn-exit"),
  trail: document.getElementById("trail"),
  stanzaStory: document.getElementById("stanza-story"),
  problemIndex: document.getElementById("problem-index"),
  promptText: document.getElementById("prompt-text"),
  visualArea: document.getElementById("visual-area"),
  equation: document.getElementById("equation"),
  numericArea: document.getElementById("numeric-area"),
  answerInput: document.getElementById("answer-input"),
  choiceArea: document.getElementById("choice-area"),
  feedback: document.getElementById("feedback"),
  hintBox: document.getElementById("hint-box"),
  btnCheck: document.getElementById("btn-check"),
  btnHint: document.getElementById("btn-hint"),

  victoryEmoji: document.getElementById("victory-emoji"),
  victoryTitle: document.getElementById("victory-title"),
  victoryText: document.getElementById("victory-text"),
  victoryStars: document.getElementById("victory-stars"),
  btnVictoryHome: document.getElementById("btn-victory-home"),
};

let state = {
  worldId: null,
  stanzaIndex: 0,
  ops: [],
  opIndex: 0,
  stars: 0,
};

// ---------------- persistence ----------------

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveProgress() {
  const all = loadProgress();
  all[state.worldId] = {
    stanzaIndex: state.stanzaIndex,
    stars: state.stars,
    completed: state.stanzaIndex >= WORLDS[state.worldId].stanze.length,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

function getWorldProgress(worldId) {
  const all = loadProgress();
  return all[worldId] || null;
}

// ---------------- helpers numerici ----------------

function tens(n) { return Math.floor(n / 10); }
function units(n) { return n % 10; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) { return arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]); }

// Il riporto/prestito compare SOLO nel livello "hard" (Complicatissimo).
// Negli altri livelli i numeri crescono, ma senza mai richiedere il riporto.
// "quickChance" aumenta la frequenza di calcoli veloci entro il 20.
const LEVEL_CONFIG = {
  easy:    { rangeMin: 1,  rangeMax: 20, maxSum: 20, quickChance: 1,    forceCarry: false },
  medium:  { rangeMin: 15, rangeMax: 48, maxSum: 50, quickChance: 0.45, forceCarry: false },
  medium2: { rangeMin: 15, rangeMax: 89, maxSum: 99, quickChance: 0.3,  forceCarry: false },
  hard:    { rangeMin: 12, rangeMax: 89, maxSum: 99, quickChance: 0,    forceCarry: true  },
};

// ---------------- generatore: addizione / sottrazione ----------------

function genAddition({ min, max, maxSum, forceCarry, avoidCarry }) {
  for (let i = 0; i < 200; i++) {
    const a = rand(min, max);
    const b = rand(min, max);
    if (a + b > maxSum) continue;
    const carry = units(a) + units(b) >= 10;
    if (forceCarry && !carry) continue;
    if (avoidCarry && carry) continue;
    return { a, b, op: "+", answer: a + b };
  }
  const a = rand(min, max), b = rand(min, Math.max(min, maxSum - a));
  return { a, b, op: "+", answer: a + b };
}

function genSubtraction({ min, max, avoidBorrow, forceBorrow }) {
  for (let i = 0; i < 200; i++) {
    const a = rand(min, max);
    const b = rand(min, a);
    const borrow = units(a) < units(b);
    if (avoidBorrow && borrow) continue;
    if (forceBorrow && !borrow) continue;
    return { a, b, op: "-", answer: a - b };
  }
  const a = rand(min, max), b = rand(min, a);
  return { a, b, op: "-", answer: a - b };
}

// genera un'addizione o sottrazione coerente con le regole del livello
function genAddSubForLevel(level) {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.medium;
  const wantAddition = Math.random() < 0.5;
  const useQuick = Math.random() < cfg.quickChance;
  const range = useQuick
    ? { min: 1, max: 20, maxSum: 20 }
    : { min: cfg.rangeMin, max: cfg.rangeMax, maxSum: cfg.maxSum };

  if (cfg.forceCarry) {
    return wantAddition
      ? genAddition({ ...range, forceCarry: true })
      : genSubtraction({ ...range, forceBorrow: true });
  }
  return wantAddition
    ? genAddition({ ...range, avoidCarry: true })
    : genSubtraction({ ...range, avoidBorrow: true });
}

// decomposizione in decine/unità per il suggerimento (livelli non complicatissimi)
function decompositionHint(a, b, op) {
  return op === "+"
    ? `Dividi in decine e unità: ${a} = ${tens(a) * 10} + ${units(a)}, ${b} = ${tens(b) * 10} + ${units(b)}. Somma prima le decine, poi le unità.`
    : `Dividi in decine e unità: ${a} = ${tens(a) * 10} + ${units(a)}, ${b} = ${tens(b) * 10} + ${units(b)}. Sottrai prima le unità, poi le decine.`;
}

// ---------------- colonna con riporto/prestito (SOLO come esempio nel tasto Aiuto) ----------------

function explainColumnOp(a, b, op) {
  const aT = tens(a), aU = units(a), bT = tens(b), bU = units(b);
  if (op === "+") {
    const sumU = aU + bU;
    const carry = sumU >= 10 ? 1 : 0;
    const resU = sumU % 10;
    const resT = aT + bT + carry;
    let text = `Le unità: ${aU} + ${bU} = ${sumU}.`;
    if (carry) text += ` Scriviamo ${resU} e portiamo 1 alle decine (il "riporto").`;
    text += ` Le decine: ${aT} + ${bT}${carry ? " + 1 (il riporto)" : ""} = ${resT}.`;
    text += ` Il risultato di QUESTO esempio è ${resT}${resU}.`;
    return { carryDigit: carry, resU, resT, text };
  } else {
    let aUeff = aU, aTeff = aT, borrow = 0, text = "";
    if (aU < bU) {
      aUeff = aU + 10; aTeff = aT - 1; borrow = 1;
      text += `Non possiamo togliere ${bU} da ${aU}: prendiamo in prestito 1 dalle decine, così le unità diventano ${aUeff}. `;
    }
    const resU = aUeff - bU;
    const resT = aTeff - bT;
    text += `Le unità: ${aUeff} - ${bU} = ${resU}. Le decine: ${aTeff} - ${bT} = ${resT}.`;
    text += ` Il risultato di QUESTO esempio è ${resT}${resU}.`;
    return { borrow, resU, resT, text };
  }
}

function buildColumnHTML(a, b, op) {
  const info = explainColumnOp(a, b, op);
  const aT = tens(a), aU = units(a), bT = tens(b), bU = units(b);
  const carryMark = op === "+" && info.carryDigit ? `<span class="carry-mark">¹</span>` : "";
  const borrowNote = op === "-" && info.borrow ? `<div class="borrow-note">prestito ➜ le decine passano da ${aT} a ${aT - 1}, le unità da ${aU} a ${aU + 10}</div>` : "";
  return `
    <div class="column-op">
      ${borrowNote}
      <div class="column-grid">
        <div class="col-cell tens-col">${carryMark}${aT}</div><div class="col-cell units-col">${aU}</div>
        <div class="col-cell tens-col op-cell">${op}${bT}</div><div class="col-cell units-col">${bU}</div>
        <div class="col-line"></div>
        <div class="col-cell tens-col result-cell">${info.resT}</div><div class="col-cell units-col result-cell">${info.resU}</div>
      </div>
      <p class="column-explain">${info.text}</p>
    </div>`;
}

// genera un esempio illustrativo DIVERSO dal problema reale, da mostrare nel tasto Aiuto
function buildRiportoTeaching(op, realA, realB) {
  let example;
  for (let i = 0; i < 30; i++) {
    example = op === "+"
      ? genAddition({ min: 15, max: 79, maxSum: 99, forceCarry: true })
      : genSubtraction({ min: 22, max: 89, forceBorrow: true });
    if (example.a !== realA || example.b !== realB) break;
  }
  const intro = op === "+"
    ? `Ecco come funziona il riporto, con un esempio diverso dal tuo calcolo. Prova poi a fare lo stesso ragionamento con i tuoi numeri!`
    : `Ecco come funziona il prestito, con un esempio diverso dal tuo calcolo. Prova poi a fare lo stesso ragionamento con i tuoi numeri!`;
  return `<p class="teaching-intro">${intro}</p>` + buildColumnHTML(example.a, example.b, op);
}

// ---------------- generatori: tipologie di enigma ----------------

function genCounting(flavor) {
  const total = rand(11, 18);
  const target = rand(3, Math.min(9, total - 3));
  const items = shuffle([
    ...Array(target).fill(flavor.targetEmoji),
    ...Array(total - target).fill(flavor.mainEmoji),
  ]);
  const grid = `<div class="emoji-grid">${items.map(e => `<span>${e}</span>`).join("")}</div>`;
  return {
    kind: "numeric",
    promptText: `Quanti/e ${flavor.label} ci sono in questo insieme di ${flavor.allLabel}?`,
    visualHTML: grid,
    answer: target,
    hint: `Conta solo ${flavor.label}: tocca con il dito ogni simbolo giusto, uno alla volta, e ignora gli altri.`,
  };
}

function genComparison() {
  const equalChance = Math.random() < 0.15;
  let a = rand(5, 95);
  let b = equalChance ? a : rand(5, 95);
  while (!equalChance && a === b) b = rand(5, 95);
  const symbol = a > b ? ">" : a < b ? "<" : "=";
  return {
    kind: "choice",
    promptText: "Quale simbolo va messo tra questi due numeri?",
    equationHTML: `<span>${a}</span><span class="blank">?</span><span>${b}</span>`,
    choices: [
      { label: "> (maggiore)", value: ">" },
      { label: "< (minore)", value: "<" },
      { label: "= (uguale)", value: "=" },
    ],
    answer: symbol,
    hint: `Confronta prima le decine: ${tens(a)} e ${tens(b)}. Se sono uguali, confronta le unità: ${units(a)} e ${units(b)}.`,
  };
}

function genCombinatoria(flavor) {
  const palette = ["rosso", "blu", "verde", "giallo", "viola"];
  const n = rand(3, 4);
  const items = palette.slice(0, n);
  const pairs = (n * (n - 1)) / 2;
  return {
    kind: "numeric",
    promptText: `${flavor.subjectName} ha ${n} colori di ${flavor.itemLabel} (${items.join(", ")}) e vuole creare coppie con 2 colori diversi. Quante coppie diverse può creare?`,
    answer: pairs,
    hint: `Prova a elencarle tutte, senza ripetere: ad esempio ${items[0]}-${items[1]}, ${items[0]}-${items[2]}... Ogni coppia va contata una sola volta.`,
  };
}

const SHAPE_BANK = [
  { name: "triangolo", sides: 3, symbol: "▲" },
  { name: "quadrato", sides: 4, symbol: "■" },
  { name: "rettangolo", sides: 4, symbol: "▬" },
  { name: "pentagono", sides: 5, symbol: "⬠" },
  { name: "cerchio", sides: 0, symbol: "●" },
  { name: "rombo", sides: 4, symbol: "◆" },
];

function genShapes() {
  const shape = SHAPE_BANK[rand(0, SHAPE_BANK.length - 1)];
  const askVertices = Math.random() < 0.5 && shape.sides > 0;
  const question = shape.sides === 0
    ? `Un cerchio: quanti lati dritti ha?`
    : askVertices
      ? `Un ${shape.name}: quanti vertici (angoli) ha?`
      : `Un ${shape.name}: quanti lati ha?`;
  return {
    kind: "numeric",
    promptText: question,
    visualHTML: `<div class="shape-visual">${shape.symbol}</div>`,
    answer: shape.sides,
    hint: shape.sides === 0 ? "Il cerchio è tondo: non ha spigoli né lati dritti." : `Conta i lati uno per uno seguendo il contorno del ${shape.name}: in una figura chiusa, lati e vertici sono sempre in numero uguale.`,
  };
}

function genKeyMatch() {
  const target = SHAPE_BANK[rand(0, SHAPE_BANK.length - 1)];
  const others = shuffle(SHAPE_BANK.filter(s => s.name !== target.name)).slice(0, 3);
  const choices = shuffle([target, ...others]).map(s => ({ label: `${s.symbol}  ${s.name}`, value: s.name }));
  return {
    kind: "choice",
    promptText: `Trova la chiave a forma di ${target.name}!`,
    choices,
    answer: target.name,
    hint: target.sides === 0 ? "Cerca la forma senza angoli, tutta arrotondata." : `Cerca la chiave con ${target.sides} lati.`,
  };
}

function genWordProblem(flavor, level) {
  const p = genAddSubForLevel(level);
  if (p.op === "+") {
    return {
      kind: "numeric",
      promptText: `${flavor.characterName} ha raccolto ${p.a} ${flavor.itemLabel} la mattina e altri ${p.b} ${flavor.itemLabel} nel pomeriggio. Quanti ${flavor.itemLabel} ci sono in totale?`,
      answer: p.answer,
      hint: `È un'addizione: metti insieme le due quantità, ${p.a} + ${p.b}.`,
    };
  }
  return {
    kind: "numeric",
    promptText: `${flavor.characterName} aveva ${p.a} ${flavor.itemLabel}, ma ne ha usati ${p.b} lungo il cammino. Quanti ${flavor.itemLabel} restano?`,
    answer: p.answer,
    hint: `È una sottrazione: togli dal totale la parte usata, ${p.a} - ${p.b}.`,
  };
}

function genSequence(level) {
  const steps = level === "hard" ? [3, 4, 6, 7, 9] : level === "easy" ? [2, 5, 10] : [2, 3, 5, 10];
  const step = steps[rand(0, steps.length - 1)];
  const start = rand(0, level === "hard" ? 40 : 15);
  const seq = [0, 1, 2, 3, 4].map(i => start + i * step);
  const missingIdx = rand(1, 3);
  const displayed = seq.map((n, i) => (i === missingIdx ? "❓" : n));
  return {
    kind: "numeric",
    promptText: "Completa la sequenza: trova il numero mancante.",
    visualHTML: `<div class="sequence-visual">${displayed.map(v => `<span class="seq-item">${v}</span>`).join("")}</div>`,
    answer: seq[missingIdx],
    hint: `Guarda di quanto aumenta ogni numero rispetto al precedente: qui il passo è sempre +${step}.`,
  };
}

// sequenze di SIMBOLI: esercizio di riconoscimento pattern
const PATTERN_SETS = [
  ["🔴", "🔵"],
  ["⭐", "🌙"],
  ["🟩", "🟨"],
  ["🔺", "🔷"],
  ["🐱", "🐶", "🐰"],
  ["☀️", "🌧️", "⛅"],
  ["🔺", "🔷", "⬛"],
];

function genPattern() {
  const set = PATTERN_SETS[rand(0, PATTERN_SETS.length - 1)];
  const unitLen = set.length;
  const totalLen = unitLen === 2 ? 8 : 9;
  const seq = Array.from({ length: totalLen }, (_, i) => set[i % unitLen]);
  const missingIdx = rand(2, totalLen - 2);
  const answer = seq[missingIdx];
  const displayed = seq.map((s, i) => (i === missingIdx ? "❓" : s));
  const otherSets = PATTERN_SETS.filter(s => s !== set);
  const distractorSet = otherSets[rand(0, otherSets.length - 1)];
  const distractor = distractorSet.find(s => !set.includes(s)) || distractorSet[0];
  const choiceSymbols = shuffle([...new Set([...set, distractor])]);
  return {
    kind: "choice",
    promptText: "Osserva lo schema: quale simbolo manca per continuare il pattern?",
    visualHTML: `<div class="sequence-visual">${displayed.map(s => `<span class="seq-item">${s}</span>`).join("")}</div>`,
    choices: choiceSymbols.map(s => ({ label: s, value: s })),
    answer,
    hint: "Guarda come si ripetono i simboli: individua il gruppetto che torna sempre uguale e capirai cosa manca al suo posto.",
  };
}

function genCipher(level) {
  const p = genAddSubForLevel(level);
  const isHard = level === "hard";
  return {
    kind: "numeric",
    promptText: "🔒 Risolvi il calcolo per scoprire il codice segreto!",
    equationHTML: `<span>${p.a}</span><span>${p.op}</span><span>${p.b}</span><span>=</span>`,
    answer: p.answer,
    hint: isHard ? null : decompositionHint(p.a, p.b, p.op),
    hintHTML: isHard ? buildRiportoTeaching(p.op, p.a, p.b) : null,
  };
}

function genAddSub(level) {
  const p = genAddSubForLevel(level);
  const isHard = level === "hard";
  return {
    kind: "numeric",
    promptText: null,
    equationHTML: `<span>${p.a}</span><span>${p.op}</span><span>${p.b}</span><span>=</span>`,
    answer: p.answer,
    hint: isHard ? null : decompositionHint(p.a, p.b, p.op),
    hintHTML: isHard ? buildRiportoTeaching(p.op, p.a, p.b) : null,
  };
}

// ---------------- dispatcher ----------------

function generateProblem(problemDef, level) {
  const flavor = problemDef.flavor || {};
  switch (problemDef.type) {
    case "counting": return genCounting(flavor);
    case "comparison": return genComparison();
    case "combinatoria": return genCombinatoria(flavor);
    case "shapes": return genShapes();
    case "keymatch": return genKeyMatch();
    case "wordproblem": return genWordProblem(flavor, level);
    case "sequence": return genSequence(level);
    case "pattern": return genPattern();
    case "cipher": return genCipher(level);
    case "addsub":
    default: return genAddSub(level);
  }
}

// ---------------- screens ----------------

function showScreen(name) {
  [els.home, els.briefing, els.game, els.victory].forEach(s => s.classList.add("hidden"));
  els[name].classList.remove("hidden");
}

function renderHome() {
  els.worldGrid.innerHTML = "";
  Object.values(WORLDS).forEach(world => {
    const prog = getWorldProgress(world.id);
    const card = document.createElement("button");
    card.className = "world-card";
    card.setAttribute("data-c", world.theme);
    card.style.position = "relative";
    card.innerHTML = `
      ${prog ? `<span class="progress-pill">${prog.completed ? "Completato ✔" : `${prog.stanzaIndex}/${world.stanze.length}`}</span>` : ""}
      <span class="emoji">${world.emoji}</span>
      <h3>${world.name}</h3>
      <p>${world.tagline}</p>
      <div class="meta">
        <span class="badge stanze">${world.stanze.length} stanze</span>
        <span class="badge diff-${world.difficulty}">${world.difficultyLabel}</span>
      </div>
    `;
    card.addEventListener("click", () => openBriefing(world.id));
    els.worldGrid.appendChild(card);
  });
  showScreen("home");
}

function openBriefing(worldId) {
  const world = WORLDS[worldId];
  document.body.setAttribute("data-theme", world.theme);
  els.briefingEmoji.textContent = world.emoji;
  els.briefingTitle.textContent = world.name;
  els.briefingText.textContent = world.briefing;

  const prog = getWorldProgress(worldId);
  const hasProgress = prog && !prog.completed && prog.stanzaIndex > 0;
  els.btnContinue.classList.toggle("hidden", !hasProgress);
  els.btnStart.textContent = prog && prog.stanzaIndex > 0 ? "Ricomincia da capo" : "Comincia l'avventura";

  els.btnStart.onclick = () => startWorld(worldId, true);
  els.btnContinue.onclick = () => startWorld(worldId, false);

  showScreen("briefing");
}

function startWorld(worldId, fresh) {
  const prog = getWorldProgress(worldId);
  state.worldId = worldId;
  if (fresh || !prog) {
    state.stanzaIndex = 0;
    state.stars = 0;
  } else {
    state.stanzaIndex = prog.stanzaIndex;
    state.stars = prog.stars;
  }
  saveProgress();
  loadStanza();
}

function loadStanza() {
  const world = WORLDS[state.worldId];
  const stanza = world.stanze[state.stanzaIndex];
  state.ops = stanza.problems.map(def => generateProblem(def, world.level));
  state.opIndex = 0;
  renderGame();
}

function renderTrail() {
  const world = WORLDS[state.worldId];
  els.trail.innerHTML = "";
  world.stanze.forEach((_, i) => {
    if (i > 0) {
      const line = document.createElement("div");
      line.className = "trail-line " + (i <= state.stanzaIndex ? "done" : "todo");
      els.trail.appendChild(line);
    }
    const dot = document.createElement("div");
    let cls = "todo";
    let label = i + 1;
    if (i < state.stanzaIndex) { cls = "done"; label = "✔"; }
    else if (i === state.stanzaIndex) { cls = "current"; }
    dot.className = "trail-step " + cls;
    dot.textContent = label;
    els.trail.appendChild(dot);
  });
}

function renderGame() {
  const world = WORLDS[state.worldId];
  const stanza = world.stanze[state.stanzaIndex];
  const problem = state.ops[state.opIndex];

  els.gameStars.textContent = "⭐ " + state.stars;
  renderTrail();
  els.stanzaStory.textContent = stanza.text;

  els.problemIndex.textContent = state.ops.length > 1
    ? `Enigma ${state.opIndex + 1} di ${state.ops.length}`
    : `Stanza ${state.stanzaIndex + 1} di ${world.stanze.length}`;

  els.promptText.textContent = problem.promptText || "";
  els.promptText.classList.toggle("hidden", !problem.promptText);

  els.visualArea.innerHTML = problem.visualHTML || "";
  els.visualArea.classList.toggle("hidden", !problem.visualHTML);

  els.equation.innerHTML = problem.equationHTML || "";
  els.equation.classList.toggle("hidden", !problem.equationHTML);

  if (problem.kind === "choice") {
    els.numericArea.classList.add("hidden");
    els.choiceArea.classList.remove("hidden");
    els.choiceArea.innerHTML = "";
    problem.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice.label;
      btn.addEventListener("click", () => checkAnswer(choice.value, btn));
      els.choiceArea.appendChild(btn);
    });
    els.btnCheck.classList.add("hidden");
  } else {
    els.choiceArea.classList.add("hidden");
    els.numericArea.classList.remove("hidden");
    els.answerInput.value = "";
    els.btnCheck.classList.remove("hidden");
  }

  els.feedback.textContent = "";
  els.feedback.className = "feedback";
  els.hintBox.classList.remove("show");
  els.hintBox.innerHTML = "";

  showScreen("game");
  if (problem.kind !== "choice") {
    setTimeout(() => els.answerInput.focus(), 50);
  }
}

function checkAnswer(choiceValue, choiceBtnEl) {
  const problem = state.ops[state.opIndex];
  let val;
  if (problem.kind === "choice") {
    val = choiceValue;
  } else {
    const raw = els.answerInput.value.trim();
    if (raw === "") return;
    val = parseInt(raw, 10);
  }

  const correct = val === problem.answer;

  if (correct) {
    state.stars += 1;
    els.feedback.textContent = pickPraise();
    els.feedback.className = "feedback ok";
    if (problem.kind === "choice") {
      Array.from(els.choiceArea.children).forEach(b => b.disabled = true);
      if (choiceBtnEl) choiceBtnEl.classList.add("choice-correct");
    } else {
      els.btnCheck.disabled = true;
    }
    setTimeout(() => {
      els.btnCheck.disabled = false;
      advance();
    }, 800);
  } else {
    els.feedback.textContent = "Quasi! Riprova 💪";
    els.feedback.className = "feedback no";
    if (problem.kind === "choice") {
      if (choiceBtnEl) {
        choiceBtnEl.classList.add("choice-wrong");
        setTimeout(() => choiceBtnEl.classList.remove("choice-wrong"), 500);
      }
    } else {
      els.answerInput.select();
    }
  }
}

function pickPraise() {
  const options = ["Esatto! 🎉", "Bravissimo! ⭐", "Perfetto! 🌟", "Ottimo lavoro! 🚀", "Sei un campione! 🏆"];
  return options[rand(0, options.length - 1)];
}

function showHint() {
  const problem = state.ops[state.opIndex];
  if (problem.hintHTML) {
    els.hintBox.innerHTML = problem.hintHTML;
  } else {
    els.hintBox.textContent = "💡 " + (problem.hint || "Ragiona con calma, un pezzo alla volta!");
  }
  els.hintBox.classList.add("show");
}

function advance() {
  const world = WORLDS[state.worldId];
  state.opIndex += 1;
  if (state.opIndex < state.ops.length) {
    renderGame();
    return;
  }
  state.stanzaIndex += 1;
  saveProgress();
  if (state.stanzaIndex >= world.stanze.length) {
    showVictory();
  } else {
    loadStanza();
  }
}

function showVictory() {
  const world = WORLDS[state.worldId];
  els.victoryEmoji.textContent = world.emoji;
  els.victoryTitle.textContent = "Missione completata!";
  els.victoryText.textContent = world.victoryText;
  els.victoryStars.textContent = "⭐ " + state.stars + " stelle raccolte";
  showScreen("victory");
}

// ---------------- events ----------------

els.btnBackHome1.addEventListener("click", renderHome);
els.btnExit.addEventListener("click", () => {
  saveProgress();
  renderHome();
});
els.btnVictoryHome.addEventListener("click", renderHome);
els.btnCheck.addEventListener("click", () => checkAnswer());
els.btnHint.addEventListener("click", showHint);
els.answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkAnswer();
});

renderHome();
