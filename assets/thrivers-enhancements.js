document.addEventListener('DOMContentLoaded', () => {
  const countInput = document.getElementById('numChildren');
  const updateButton = document.getElementById('createChildren');

  if (!countInput || typeof window.createChildrenInputs !== 'function') return;

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
});
