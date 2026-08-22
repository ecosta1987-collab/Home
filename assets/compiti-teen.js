(() => {
  const style = document.createElement('style');
  style.textContent = `
    :root{
      --bg:#f4f6fb!important;
      --card:#ffffff!important;
      --ink:#1f2937!important;
      --muted:#64748b!important;
      --brand:#4f46e5!important;
      --green:#0f766e!important;
      --red:#dc2626!important;
      --blue:#3b82f6!important;
      --purple:#7c3aed!important;
      --yellow:#f59e0b!important;
      --shadow:0 10px 28px rgba(15,23,42,.08)!important;
      --radius:16px!important;
    }
    body{background:linear-gradient(180deg,#f7f8fc 0%,#eef2f7 100%)!important;color:var(--ink)!important}
    .app{max-width:1180px!important;padding:22px!important}
    .mascot{font-size:34px!important;filter:none!important;color:var(--brand)!important;font-weight:900!important}
    .h1{font-size:clamp(28px,4vw,44px)!important;font-weight:850!important;letter-spacing:-.035em!important}
    button{border-radius:12px!important;box-shadow:0 1px 2px rgba(15,23,42,.08)!important;font-weight:750!important}
    button:active{transform:none!important;box-shadow:0 1px 2px rgba(15,23,42,.08)!important}
    .tab{border:1px solid #dbe1ea!important;background:#fff!important;color:#475569!important}
    .tab.active{background:#273449!important;color:#fff!important;border-color:#273449!important}
    .card,.book,.month,.stat,.session-card,.book-admin{border-radius:16px!important;box-shadow:0 6px 18px rgba(15,23,42,.06)!important;border-color:#e5e9f0!important}
    .hero{background:#fff!important}
    .empty-state{border:1px dashed #a8b2c1!important;background:#fff!important}
    .empty-state .big{font-size:38px!important}
    .task{border-radius:10px!important;background:#f1f5f9!important}
    .task.done{background:#d1fae5!important;color:#065f46!important}
    .task.special{border-color:#a78bfa!important;background:#f3f0ff!important}
    .task.selected{outline:3px solid #818cf8!important}
    .suggestion{border:1px solid #cbd5e1!important;border-radius:12px!important;font-size:16px!important;font-weight:750!important}
    .bigprogress{height:28px!important;border:2px solid #fff!important;background:#e5e7eb!important}
    .bigprogress span{background:linear-gradient(90deg,#4f46e5,#0f766e)!important}
    .milestone{font-size:22px!important;filter:none!important}
    .modal-card{border-radius:18px!important}
    .toast{border:1px solid #cbd5e1!important;border-radius:14px!important;font-size:17px!important;font-weight:750!important}
    .primary{background:#4f46e5!important}.success{background:#0f766e!important}.purple{background:#7c3aed!important}.blue{background:#3b82f6!important}
    .badge{font-weight:750!important}
    #compiti-guide-button{background:#273449!important;color:#fff!important;border-color:#273449!important}
    .compiti-guide-note{background:#f1f5f9!important;color:#475569!important;border:1px solid #dbe1ea!important}
    .compiti-guide-example{background:#eef2ff!important;border:1px solid #c7d2fe!important;color:#3730a3!important}
    .compiti-guide-next{background:#4f46e5!important}
    .compiti-guide-focus{box-shadow:0 0 0 4px #818cf8,0 0 0 9999px rgba(15,23,42,.48)!important}
    @media(max-width:520px){.app{padding:16px!important}.mascot{font-size:28px!important}.h1{font-size:30px!important}}
  `;
  document.head.appendChild(style);

  function replaceText(root = document.body) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT','STYLE','TEXTAREA','INPUT','OPTION'].includes(parent.tagName)) return;
      let text = node.nodeValue;
      text = text.replace(/Area Genitore/g, 'Area creazione compiti');
      text = text.replace(/area Genitore/g, 'area creazione compiti');
      text = text.replace(/Vai in Genitore/g, 'Vai in Creazione compiti');
      text = text.replace(/Torna in Genitore/g, 'Torna in Creazione compiti');
      text = text.replace(/scheda “Genitore”/g, 'scheda “Crea compiti”');
      text = text.replace(/sezione Genitore/g, 'sezione Creazione compiti');
      text = text.replace(/Il genitore prepara/g, 'Chi crea i compiti prepara');
      text = text.replace(/Il genitore torna/g, 'Chi crea i compiti torna');
      text = text.replace(/il genitore o un’app/g, 'un supporto esterno o un’app');
      text = text.replace(/il genitore/g, 'chi crea i compiti');
      text = text.replace(/bambino/g, 'studente');
      if (text !== node.nodeValue) node.nodeValue = text;
    });
  }

  function adaptUi() {
    const parentTab = document.querySelector('button[data-tab="parent"]');
    if (parentTab && parentTab.textContent !== 'Crea compiti') parentTab.textContent = 'Crea compiti';

    const mascot = document.getElementById('mainEmoji');
    if (mascot && !mascot.dataset.teenAdapted) {
      if (mascot.textContent.trim() === '🦊') mascot.textContent = '✓';
      mascot.dataset.teenAdapted = '1';
    }

    const emojiInput = document.getElementById('newSessionEmoji');
    if (emojiInput && emojiInput.value === '🦊') emojiInput.value = '📚';

    replaceText(document.body);
  }

  adaptUi();

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      observer.disconnect();
      adaptUi();
      observer.observe(document.body, {childList:true, subtree:true});
    });
  });
  observer.observe(document.body, {childList:true, subtree:true});
})();
