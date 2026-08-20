document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('restartButton');
  const startButton = document.getElementById('startButton');
  const countInput = document.getElementById('numChildren');

  if (startButton && typeof startAssessment === 'function') {
    startButton.onclick = () => {
      let count = parseInt(countInput?.value || '1', 10);
      if (!Number.isFinite(count)) count = 1;
      count = Math.max(1, Math.min(10, count));
      if (countInput) countInput.value = count;

      if (typeof createChildrenInputs === 'function') {
        createChildrenInputs();
      }

      startAssessment();
    };
  }

  if (!button) return;

  button.textContent = 'Torna a homepage';

  button.onclick = () => {
    alert('I dati del questionario restano salvati.');

    localStorage.removeItem('assessmentCarattereBambini');

    if (typeof radar !== 'undefined' && radar) {
      radar.destroy();
      radar = null;
    }

    if (typeof children !== 'undefined') children = [];
    if (typeof answers !== 'undefined') answers = {};
    if (typeof currentQuestion !== 'undefined') currentQuestion = 0;
    if (typeof questionnaireDate !== 'undefined') questionnaireDate = '';
    if (typeof assessmentId !== 'undefined') assessmentId = '';

    const resultsSection = document.getElementById('results');
    const assessmentSection = document.getElementById('assessment');
    const setupSection = document.getElementById('setup');
    const savedSection = document.getElementById('savedAssessments');
    const dateInput = document.getElementById('questionnaireDate');

    resultsSection?.classList.add('hidden');
    assessmentSection?.classList.add('hidden');
    setupSection?.classList.remove('hidden');
    savedSection?.classList.remove('hidden');

    if (dateInput && typeof todayString === 'function') dateInput.value = todayString();
    if (countInput) countInput.value = 1;
    if (typeof createChildrenInputs === 'function') createChildrenInputs();
    if (typeof renderSaved === 'function') renderSaved();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});
