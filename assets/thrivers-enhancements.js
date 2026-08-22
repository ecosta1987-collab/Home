document.addEventListener('DOMContentLoaded', () => {
  const QUESTIONS_PER_PAGE = 5;
  const countInput = document.getElementById('numChildren');
  const updateButton = document.getElementById('createChildren');
  const answersContainer = document.getElementById('answersContainer');
  const assessmentSection = document.getElementById('assessment');
  const questionNumber = document.getElementById('questionNumber');
  const questionCategory = document.getElementById('questionCategory');
  const questionText = document.getElementById('questionText');
  const previousButton = document.getElementById('previousButton');
  const nextButton = document.getElementById('nextButton');

  if (countInput && typeof createChildrenInputs === 'function') {
    if (updateButton) updateButton.style.display = 'none';

    const refreshChildren = () => {
      let value = parseInt(countInput.value, 10);
      if (!Number.isFinite(value)) value = 1;
      value = Math.max(1, Math.min(10, value));
      countInput.value = value;
      createChildrenInputs();
    };

    countInput.addEventListener('input', refreshChildren);
    countInput.addEventListener('change', refreshChildren);
  }

  if (!answersContainer || typeof questions === 'undefined' || typeof children === 'undefined' || typeof answers === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    #questionCategory,
    #questionText { display: none !important; }

    #questionNumber {
      margin-bottom: 10px;
      font-weight: 800;
      color: #1d4ed8;
    }

    .thrivers-progress-wrap {
      margin: 0 0 22px;
    }
    .thrivers-progress-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 750;
      color: #475569;
    }
    .thrivers-progress-track {
      width: 100%;
      height: 12px;
      overflow: hidden;
      border-radius: 999px;
      background: #e2e8f0;
    }
    .thrivers-progress-bar {
      height: 100%;
      width: 0;
      border-radius: inherit;
      background: #2563eb;
      transition: width .2s ease;
    }

    #answersContainer {
      width: 100%;
      overflow-x: hidden;
    }

    .thrivers-question-block {
      margin: 0 0 26px;
      padding: 18px;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 5px 18px rgba(15,23,42,.06);
    }
    .thrivers-question-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }
    .thrivers-question-index {
      color: #2563eb;
      font-size: 14px;
      font-weight: 800;
    }
    .thrivers-question-category {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 999px;
      background: #eef2ff;
      color: #3730a3;
      font-size: 12px;
      font-weight: 800;
    }
    .thrivers-question-title {
      margin: 0 0 14px;
      font-size: 19px;
      line-height: 1.35;
      color: #172033;
    }

    .thrivers-score-legend {
      margin: 0 0 10px;
      font-size: 12px;
      line-height: 1.45;
      color: #64748b;
    }

    .thrivers-score-grid {
      display: grid;
      width: 100%;
      grid-template-columns: minmax(92px, 1.65fr) repeat(5, minmax(38px, 1fr));
      border: 1px solid #dbe2ea;
      border-radius: 14px;
      overflow: hidden;
      background: white;
    }
    .thrivers-grid-cell {
      min-width: 0;
      min-height: 52px;
      padding: 7px 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
      text-align: center;
    }
    .thrivers-grid-cell:nth-child(6n) {
      border-right: 0;
    }
    .thrivers-grid-cell.header {
      min-height: 44px;
      background: #eef2ff;
      color: #3730a3;
      font-weight: 900;
    }
    .thrivers-grid-cell.child {
      justify-content: flex-start;
      text-align: left;
      background: #f8fafc;
      color: #172033;
      font-weight: 800;
      overflow-wrap: anywhere;
    }
    .thrivers-radio-label {
      width: 100%;
      min-height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      cursor: pointer;
    }
    .thrivers-radio-label input[type="radio"] {
      width: 23px;
      height: 23px;
      margin: 0;
      transform: none;
      cursor: pointer;
    }

    @media (max-width: 700px) {
      #assessment { padding: 12px; }
      .thrivers-question-block {
        padding: 12px 8px;
        margin-bottom: 18px;
        border-radius: 14px;
      }
      .thrivers-question-title {
        font-size: 17px;
      }
      .thrivers-score-grid {
        grid-template-columns: minmax(82px, 1.55fr) repeat(5, minmax(34px, 1fr));
      }
      .thrivers-grid-cell {
        min-height: 48px;
        padding: 5px 2px;
        font-size: 13px;
      }
      .thrivers-grid-cell.child {
        font-size: 12px;
      }
      .thrivers-grid-cell.header {
        font-size: 14px;
      }
      .thrivers-radio-label input[type="radio"] {
        width: 21px;
        height: 21px;
      }
      .thrivers-progress-head {
        font-size: 12px;
      }
    }

    @media (max-width: 380px) {
      .thrivers-score-grid {
        grid-template-columns: minmax(72px, 1.45fr) repeat(5, minmax(31px, 1fr));
      }
      .thrivers-grid-cell.child {
        font-size: 11px;
      }
      .thrivers-grid-cell {
        padding-left: 1px;
        padding-right: 1px;
      }
    }
  `;
  document.head.appendChild(style);

  let progressWrap = document.querySelector('.thrivers-progress-wrap');
  if (!progressWrap) {
    progressWrap = document.createElement('div');
    progressWrap.className = 'thrivers-progress-wrap';
    progressWrap.innerHTML = `
      <div class="thrivers-progress-head">
        <span class="thrivers-progress-page"></span>
        <span class="thrivers-progress-count"></span>
      </div>
      <div class="thrivers-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="thrivers-progress-bar"></div>
      </div>`;
    questionNumber.insertAdjacentElement('afterend', progressWrap);
  }

  const progressPage = progressWrap.querySelector('.thrivers-progress-page');
  const progressCount = progressWrap.querySelector('.thrivers-progress-count');
  const progressTrack = progressWrap.querySelector('.thrivers-progress-track');
  const progressBar = progressWrap.querySelector('.thrivers-progress-bar');

  function childName(child) {
    if (typeof fullName === 'function') return fullName(child);
    return `${child.firstName || ''} ${child.lastName || ''}`.trim() || 'Bambino';
  }

  function answeredCount() {
    let count = 0;
    children.forEach(child => {
      const childAnswers = answers[child.id] || [];
      for (let i = 0; i < questions.length; i++) {
        if (childAnswers[i] != null) count++;
      }
    });
    return count;
  }

  function updateProgress() {
    const total = Math.max(1, questions.length * Math.max(1, children.length));
    const done = answeredCount();
    const percent = Math.round((done / total) * 100);
    const page = Math.floor(currentQuestion / QUESTIONS_PER_PAGE) + 1;
    const pages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

    progressPage.textContent = `Pagina ${page} di ${pages}`;
    progressCount.textContent = `${percent}% completato`;
    progressBar.style.width = `${percent}%`;
    progressTrack.setAttribute('aria-valuenow', String(percent));
  }

  function makeCell(className, text) {
    const cell = document.createElement('div');
    cell.className = `thrivers-grid-cell ${className || ''}`.trim();
    if (text !== undefined) cell.textContent = text;
    return cell;
  }

  function renderQuestionGrid(questionIndex) {
    const q = questions[questionIndex];
    const block = document.createElement('article');
    block.className = 'thrivers-question-block';

    const meta = document.createElement('div');
    meta.className = 'thrivers-question-meta';

    const index = document.createElement('span');
    index.className = 'thrivers-question-index';
    index.textContent = `Domanda ${questionIndex + 1}`;

    const category = document.createElement('span');
    category.className = 'thrivers-question-category';
    category.textContent = q.category;
    meta.append(index, category);

    const title = document.createElement('h3');
    title.className = 'thrivers-question-title';
    title.textContent = q.text;

    const legend = document.createElement('p');
    legend.className = 'thrivers-score-legend';
    legend.textContent = '1 Mai · 2 Raramente · 3 A volte · 4 Spesso · 5 Sempre';

    const grid = document.createElement('div');
    grid.className = 'thrivers-score-grid';
    grid.appendChild(makeCell('header', 'Bambino'));
    for (let score = 1; score <= 5; score++) {
      grid.appendChild(makeCell('header', String(score)));
    }

    children.forEach(child => {
      const name = childName(child);
      grid.appendChild(makeCell('child', name));

      for (let score = 1; score <= 5; score++) {
        const cell = makeCell('');
        const label = document.createElement('label');
        label.className = 'thrivers-radio-label';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `${child.id}-${questionIndex}`;
        radio.value = String(score);
        radio.checked = answers[child.id]?.[questionIndex] === score;
        radio.setAttribute('aria-label', `${name}, domanda ${questionIndex + 1}: punteggio ${score}`);
        radio.addEventListener('change', () => {
          answers[child.id][questionIndex] = score;
          if (typeof saveCurrent === 'function') saveCurrent();
          updateProgress();
        });

        label.appendChild(radio);
        cell.appendChild(label);
        grid.appendChild(cell);
      }
    });

    block.append(meta, title, legend, grid);
    return block;
  }

  showQuestion = function () {
    currentQuestion = Math.max(0, Math.floor(currentQuestion / QUESTIONS_PER_PAGE) * QUESTIONS_PER_PAGE);
    const start = currentQuestion;
    const end = Math.min(start + QUESTIONS_PER_PAGE, questions.length);

    questionNumber.textContent = `Domande ${start + 1}–${end} di ${questions.length}`;
    answersContainer.innerHTML = '';

    for (let i = start; i < end; i++) {
      answersContainer.appendChild(renderQuestionGrid(i));
    }

    previousButton.disabled = start === 0;
    nextButton.textContent = end >= questions.length ? 'Mostra risultati' : 'Avanti →';
    updateProgress();
    if (typeof saveCurrent === 'function') saveCurrent();
  };

  previousQuestion = function () {
    if (currentQuestion > 0) {
      currentQuestion = Math.max(0, currentQuestion - QUESTIONS_PER_PAGE);
      showQuestion();
      assessmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  nextQuestion = function () {
    const start = currentQuestion;
    const end = Math.min(start + QUESTIONS_PER_PAGE, questions.length);

    for (let i = start; i < end; i++) {
      const missing = children.some(child => answers[child.id]?.[i] == null);
      if (missing) {
        alert(`Completa la domanda ${i + 1} per tutti i bambini prima di continuare.`);
        return;
      }
    }

    if (end < questions.length) {
      currentQuestion = end;
      showQuestion();
      assessmentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (typeof showResults === 'function') {
      showResults();
    }
  };

  previousButton.onclick = previousQuestion;
  nextButton.onclick = nextQuestion;

  if (!assessmentSection.classList.contains('hidden')) {
    showQuestion();
  }
});
