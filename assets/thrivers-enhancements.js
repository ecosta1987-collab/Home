document.addEventListener('DOMContentLoaded', () => {
  const countInput = document.getElementById('numChildren');
  const updateButton = document.getElementById('createChildren');
  const answersContainer = document.getElementById('answersContainer');

  if (countInput && typeof window.createChildrenInputs === 'function') {
    if (updateButton) updateButton.style.display = 'none';

    const refreshChildren = () => {
      let value = parseInt(countInput.value, 10);
      if (!Number.isFinite(value)) value = 1;
      value = Math.max(1, Math.min(10, value));
      countInput.value = value;
      window.createChildrenInputs();
    };

    countInput.addEventListener('input', refreshChildren);
    countInput.addEventListener('change', refreshChildren);
  }

  const style = document.createElement('style');
  style.textContent = `
    #answersContainer.thrivers-grid-ready {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 6px;
    }
    .thrivers-score-grid {
      display: grid;
      min-width: max-content;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      background: white;
    }
    .thrivers-grid-cell {
      min-width: 118px;
      min-height: 58px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
      text-align: center;
    }
    .thrivers-grid-cell.header {
      min-height: 64px;
      background: #eef2ff;
      color: #3730a3;
      font-weight: 800;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .thrivers-grid-cell.score {
      min-width: 92px;
      background: #f8fafc;
      justify-content: flex-start;
      text-align: left;
      font-weight: 800;
      position: sticky;
      left: 0;
      z-index: 2;
    }
    .thrivers-grid-cell.corner {
      min-width: 92px;
      left: 0;
      z-index: 3;
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
      width: 24px;
      height: 24px;
      margin: 0;
      transform: none;
      cursor: pointer;
    }
    @media (max-width: 700px) {
      .thrivers-grid-cell { min-width: 104px; padding: 8px; }
      .thrivers-grid-cell.score,
      .thrivers-grid-cell.corner { min-width: 84px; }
    }
  `;
  document.head.appendChild(style);

  const scoreLabels = ['Mai', 'Raramente', 'A volte', 'Spesso', 'Sempre'];

  function makeCell(className, text) {
    const cell = document.createElement('div');
    cell.className = `thrivers-grid-cell ${className || ''}`.trim();
    if (text !== undefined) cell.textContent = text;
    return cell;
  }

  function layoutAnswersAsGrid() {
    if (!answersContainer || answersContainer.querySelector('.thrivers-score-grid')) return;

    const cards = [...answersContainer.querySelectorAll('.answer-card')];
    if (!cards.length) return;

    const children = cards.map(card => ({
      name: card.querySelector('h4')?.textContent?.trim() || 'Bambino',
      radios: [...card.querySelectorAll('input[type="radio"]')]
    }));

    if (!children.length || children.some(child => child.radios.length < 5)) return;

    const grid = document.createElement('div');
    grid.className = 'thrivers-score-grid';
    grid.style.gridTemplateColumns = `92px repeat(${children.length}, minmax(118px, 1fr))`;

    grid.appendChild(makeCell('header corner', 'Punteggio'));
    children.forEach(child => grid.appendChild(makeCell('header', child.name)));

    for (let score = 1; score <= 5; score++) {
      grid.appendChild(makeCell('score', `${score} · ${scoreLabels[score - 1]}`));

      children.forEach(child => {
        const cell = makeCell('');
        const label = document.createElement('label');
        label.className = 'thrivers-radio-label';
        const radio = child.radios.find(item => Number(item.value) === score);
        if (radio) {
          radio.setAttribute('aria-label', `${child.name}: ${score} - ${scoreLabels[score - 1]}`);
          label.appendChild(radio);
        }
        cell.appendChild(label);
        grid.appendChild(cell);
      });
    }

    answersContainer.innerHTML = '';
    answersContainer.classList.add('thrivers-grid-ready');
    answersContainer.appendChild(grid);
  }

  if (answersContainer) {
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(layoutAnswersAsGrid);
    });
    observer.observe(answersContainer, { childList: true });
    layoutAnswersAsGrid();
  }
});
