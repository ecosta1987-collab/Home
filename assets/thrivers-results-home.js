document.addEventListener('DOMContentLoaded', () => {
  const CURRENT_KEY = 'assessmentCarattereBambini';
  const PAUSED_KEY = 'thriversAssessmentPausedV1';
  const button = document.getElementById('restartButton');
  const startButton = document.getElementById('startButton');
  const countInput = document.getElementById('numChildren');
  const setupSection = document.getElementById('setup');
  const savedSection = document.getElementById('savedAssessments');
  const assessmentSection = document.getElementById('assessment');
  const resultsSection = document.getElementById('results');
  const dateInput = document.getElementById('questionnaireDate');

  function showHomepage() {
    resultsSection?.classList.add('hidden');
    assessmentSection?.classList.add('hidden');
    setupSection?.classList.remove('hidden');
    savedSection?.classList.remove('hidden');
    if (typeof renderSaved === 'function') renderSaved();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetCurrentAssessment() {
    localStorage.removeItem(CURRENT_KEY);
    localStorage.removeItem(PAUSED_KEY);
    if (typeof radar !== 'undefined' && radar) {
      radar.destroy();
      radar = null;
    }
    if (typeof children !== 'undefined') children = [];
    if (typeof answers !== 'undefined') answers = {};
    if (typeof currentQuestion !== 'undefined') currentQuestion = 0;
    if (typeof questionnaireDate !== 'undefined') questionnaireDate = '';
    if (typeof assessmentId !== 'undefined') assessmentId = '';
    if (dateInput && typeof todayString === 'function') dateInput.value = todayString();
    if (countInput) countInput.value = 1;
    if (typeof createChildrenInputs === 'function') createChildrenInputs();
  }

  function ensureResumeButton() {
    let resume = document.getElementById('resumeAssessmentButton');
    const hasPaused = localStorage.getItem(PAUSED_KEY) === '1' && !!localStorage.getItem(CURRENT_KEY);

    if (!hasPaused) {
      resume?.remove();
      return;
    }

    if (!resume && startButton) {
      resume = document.createElement('button');
      resume.id = 'resumeAssessmentButton';
      resume.type = 'button';
      resume.className = 'secondary';
      resume.textContent = 'Riprendi test in pausa';
      startButton.insertAdjacentElement('beforebegin', resume);
    }

    if (resume) {
      resume.onclick = () => {
        localStorage.removeItem(PAUSED_KEY);
        const raw = localStorage.getItem(CURRENT_KEY);
        if (!raw) {
          ensureResumeButton();
          return;
        }
        try {
          const data = JSON.parse(raw);
          children = Array.isArray(data.children) ? data.children : [];
          answers = data.answers || {};
          currentQuestion = data.currentQuestion || 0;
          questionnaireDate = data.questionnaireDate || (typeof todayString === 'function' ? todayString() : '');
          assessmentId = data.assessmentId || '';
          setupSection?.classList.add('hidden');
          savedSection?.classList.add('hidden');
          resultsSection?.classList.add('hidden');
          assessmentSection?.classList.remove('hidden');
          if (typeof showQuestion === 'function') showQuestion();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          console.error(e);
        }
      };
    }
  }

  if (startButton && typeof startAssessment === 'function') {
    startButton.onclick = () => {
      localStorage.removeItem(PAUSED_KEY);
      let count = parseInt(countInput?.value || '1', 10);
      if (!Number.isFinite(count)) count = 1;
      count = Math.max(1, Math.min(10, count));
      if (countInput) countInput.value = count;
      if (typeof createChildrenInputs === 'function') createChildrenInputs();
      startAssessment();
    };
  }

  if (assessmentSection) {
    let actions = document.getElementById('thriversAssessmentActions');
    if (!actions) {
      actions = document.createElement('div');
      actions.id = 'thriversAssessmentActions';
      actions.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;margin:8px 0 18px';

      const pauseButton = document.createElement('button');
      pauseButton.type = 'button';
      pauseButton.className = 'secondary';
      pauseButton.textContent = 'Metti in pausa';
      pauseButton.onclick = () => {
        if (typeof saveCurrent === 'function') saveCurrent();
        localStorage.setItem(PAUSED_KEY, '1');
        showHomepage();
        ensureResumeButton();
      };

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'danger';
      cancelButton.textContent = 'Annulla test';
      cancelButton.onclick = () => {
        if (!confirm('Annullare il test corrente? Le risposte non completate verranno eliminate. I questionari già salvati resteranno disponibili.')) return;
        resetCurrentAssessment();
        showHomepage();
        ensureResumeButton();
      };

      actions.append(pauseButton, cancelButton);
      const navigation = assessmentSection.querySelector('.navigation');
      if (navigation) navigation.insertAdjacentElement('beforebegin', actions);
      else assessmentSection.appendChild(actions);
    }
  }

  if (localStorage.getItem(PAUSED_KEY) === '1') {
    showHomepage();
  }
  ensureResumeButton();

  if (!button) return;
  button.textContent = 'Torna a homepage';
  button.onclick = () => {
    alert('I dati del questionario restano salvati.');
    resetCurrentAssessment();
    showHomepage();
    ensureResumeButton();
  };
});
