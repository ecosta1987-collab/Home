document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('restartButton');
  if (!button) return;

  button.textContent = 'Torna a homepage';

  button.onclick = () => {
    alert('I dati del questionario restano salvati.');
    localStorage.removeItem('assessmentCarattereBambini');
    window.location.href = '/Applicazioni/Thrivers/';
  };
});
