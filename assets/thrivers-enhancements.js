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
      overflow-x: hidden;
      width: 100%;
    }
    .thrivers-score-grid {
      display: grid;
      width: 100%;
      grid-template-columns: minmax(110px, 1.7fr) repeat(5, minmax(42px, 1fr));
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      background: white;
    }
    .thrivers-grid-cell {
      min-width: 0;
      min-height: 58px;
      padding: 8px 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
      text-align: center;
    }
    .thrivers-grid-cell.header {
      background: #eef2ff;
      color: #3730a3;
      font-weight: 800;
    }
    .thrivers-grid-cell.child {
      justify-content: flex-start;
      text-align: left;
      font-weight: 800;
      background: #f8fafc;
      overflow-wrap: anywhere;
    }
    .thrivers-score-head {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      line-height: 1.05;
    }
    .thrivers-score-head strong {
      font-size: 17px;
    }
    .thrivers-score-head small {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
    }
    .thrivers-radio-label {
      width: 100%;
      min-height: 42px;
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
      .thrivers-score-grid {
        grid-template-columns: minmax(88px, 1.6fr) repeat(5, minmax(38px, 1fr));
      }
      .thrivers-grid-cell {
        padding: 7px 3px;
        min-height: 54px;
      }
      .thrivers-grid-cell.child {
        font-size: 13px;
      }
      .thrivers-score-head strong {
        font-size: 15px;
      }
      .thrivers-score-head small {
        font-size: 8px;
      }
      .thrivers-radio-label input[type="radio"] {
        width: 22px;
        height: 22px;
      }
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

  function makeScoreHeader(score) {
    const cell = makeCell('header');
    const wrap = document.createElement('div');
    wrap.className = 'thrivers-score-head';
    const number = document.createElement('strong');
    number.textContent = String(score);
    const label = document.createElement('small');
    label.textContent = scoreLabels[score - 1];
    wrap.append(number, label);
    cell.appendChild(wrap);
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

    grid.appendChild(makeCell('header', 'Bambino'));
    for (let score = 1; score <= 5; score++) {
      grid.appendChild(makeScoreHeader(score));
    }

    children.forEach(child => {
      grid.appendChild(makeCell('child', child.name));

      for (let score = 1; score <= 5; score++) {
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
      }
    });

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
