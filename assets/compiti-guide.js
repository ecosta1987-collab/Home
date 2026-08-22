(() => {
  const STORAGE_KEY = 'compitiInteractiveGuideV1';

  const tours = {
    overview: {
      title: 'Tour dell’app',
      steps: [
        {
          title: 'Benvenuto in Compiti',
          text: 'Compiti ha due facce: il genitore prepara periodo, attività e calendario; lo studente vede cosa deve fare e segna i progressi. Ti mostro il flusso in pochi passaggi.',
          target: '.title'
        },
        {
          title: '1. Parti da una configurazione',
          text: 'Una configurazione è un periodo di compiti: per esempio “Vacanze di Natale” o “Compiti di agosto”. Qui puoi crearne una nuova o riaprire quelle già salvate.',
          target: 'button[data-tab="sessions"]',
          tab: 'sessions'
        },
        {
          title: '2. Dai un nome e scegli il periodo',
          text: 'Inserisci un nome riconoscibile, un titolo, un’emoji e le date di inizio e fine. Poi premi “Crea e apri”.',
          target: '#newSessionName',
          tab: 'sessions'
        },
        {
          title: '3. Aggiungi materie e attività',
          text: 'Nella sezione Genitore puoi aggiungere libri o materie e indicare pagine, esercizi e attività. È qui che prepari il lavoro che comparirà allo studente.',
          target: 'button[data-tab="parent"]',
          tab: 'parent'
        },
        {
          title: '4. Controlla il calendario',
          text: 'Il calendario decide in quali giorni ci sono compiti. Giallo significa giorno di lavoro, blu giorno di riposo. Puoi cambiare ogni giorno con un tocco.',
          target: 'button[data-tab="calendar"]',
          tab: 'calendar'
        },
        {
          title: '5. Passa alla vista Studente',
          text: 'Questa è la schermata da usare ogni giorno: mostra progressi, attività e cosa resta da completare, senza dover entrare nelle impostazioni del genitore.',
          target: 'button[data-tab="kid"]',
          tab: 'kid'
        },
        {
          title: '6. Segna ciò che è stato fatto',
          text: 'Dalla vista Studente puoi aprire le attività e segnare quelle completate. I progressi si aggiornano automaticamente.',
          target: '#kidContent',
          tab: 'kid'
        },
        {
          title: 'Hai finito',
          text: 'Il flusso è: configura → aggiungi attività → controlla il calendario → usa la vista Studente. Puoi riaprire questa guida in qualsiasi momento con il pulsante “? Guida”.',
          target: '.tabs'
        }
      ]
    },
    setup: {
      title: 'Come configurare i compiti',
      steps: [
        {
          title: 'Configuriamo insieme i compiti',
          text: 'Questa guida è pensata per il genitore. Useremo un esempio concreto: “Compiti estate”, dal 1 al 15 luglio, con Matematica e Lettura.',
          target: 'button[data-tab="sessions"]',
          tab: 'sessions',
          example: 'Esempio: Compiti estate · 1–15 luglio'
        },
        {
          title: '1. Crea una nuova configurazione',
          text: 'Apri Configurazioni e crea un nuovo periodo. Una configurazione contiene tutto: date, materie, attività, calendario e progressi.',
          target: '#newSessionName',
          tab: 'sessions',
          example: 'Nome configurazione: Compiti estate'
        },
        {
          title: '2. Scegli titolo, emoji e date',
          text: 'Il nome serve a te per riconoscere la configurazione. Il titolo e l’emoji sono invece ciò che vedrà lo studente. Imposta poi data di inizio e fine.',
          target: '#newSessionTitle',
          tab: 'sessions',
          example: 'Titolo: Compiti estate · Emoji: ☀️ · Dal 01/07 al 15/07'
        },
        {
          title: '3. Premi “Crea e apri”',
          text: 'Quando i dati sono pronti, crea la configurazione. Da quel momento diventa quella attiva e puoi iniziare ad aggiungere le attività.',
          target: '#createSession',
          tab: 'sessions'
        },
        {
          title: '4. Vai in Genitore',
          text: 'Qui costruisci il contenuto dei compiti. Pensa a ogni libro o materia come a un contenitore di attività: Matematica, Italiano, Lettura, Inglese…',
          target: 'button[data-tab="parent"]',
          tab: 'parent',
          example: 'Materia 1: Matematica · Materia 2: Lettura'
        },
        {
          title: '5. Inserisci pagine ed esercizi',
          text: 'Dentro ogni materia aggiungi ciò che va fatto. Puoi usare pagine quando il riferimento è un numero di pagina, oppure esercizi/attività quando vuoi scrivere una consegna più libera.',
          target: '#parentContent',
          tab: 'parent',
          example: 'Matematica: pagine 20–25 · Esercizi 3 e 4 · Ripassare le tabelline'
        },
        {
          title: '6. Usa “speciale” solo quando serve',
          text: 'Le attività speciali sono quelle che richiedono il genitore o un’app. Usale per distinguere ciò che il bambino non deve svolgere completamente da solo.',
          target: '#parentContent',
          tab: 'parent',
          example: 'Esempio: “Dettato con un adulto” oppure “Esercizio sull’app”'
        },
        {
          title: '7. Controlla il calendario',
          text: 'Passa al Calendario e verifica i giorni di lavoro. Giallo = compiti, blu = riposo. Sabato e domenica partono come riposo, ma puoi cambiare qualsiasi giorno.',
          target: '#months',
          tab: 'calendar',
          example: 'Puoi lasciare liberi i weekend e distribuire il lavoro sui giorni feriali.'
        },
        {
          title: '8. Guarda cosa vedrà lo studente',
          text: 'Apri Studente e controlla il risultato prima di consegnargli l’app. Qui dovresti vedere le materie, le attività e l’avanzamento in modo molto più semplice.',
          target: '#kidContent',
          tab: 'kid'
        },
        {
          title: '9. Come si usa ogni giorno',
          text: 'Lo studente apre la sua vista, svolge i compiti e seleziona le attività completate. Il genitore torna nella sua area solo quando deve aggiungere, correggere o controllare qualcosa.',
          target: 'button[data-tab="kid"]',
          tab: 'kid'
        },
        {
          title: '10. Se devi correggere qualcosa',
          text: 'Non serve ricominciare. Torna in Genitore per modificare attività e materie, oppure nel Calendario per cambiare i giorni. La configurazione rimane la stessa.',
          target: '.tabs'
        },
        {
          title: 'Backup: utile, ma non necessario ogni giorno',
          text: 'Esporta/Importa serve soprattutto per avere una copia di sicurezza o trasferire i dati. Puoi ignorarlo durante l’uso normale dell’app.',
          target: '#globalBackup',
          tab: 'sessions'
        },
        {
          title: 'Configurazione completata',
          text: 'La sequenza da ricordare è: crea il periodo → aggiungi materie e attività → controlla i giorni → verifica la vista Studente. Se qualcosa non torna, puoi sempre riaprire questa guida.',
          target: '.tabs'
        }
      ]
    }
  };

  let activeTour = tours.overview;
  let index = 0;
  let currentTarget = null;

  const style = document.createElement('style');
  style.textContent = `
    #compiti-guide-button{position:fixed;top:max(12px,env(safe-area-inset-top));right:12px;z-index:2147483645;border:1px solid rgba(0,0,0,.10);border-radius:999px;padding:9px 13px;background:#fff;color:#243046;font:800 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.16);cursor:pointer}
    #compiti-guide-overlay{position:fixed;inset:0;z-index:2147483640;background:rgba(15,23,42,.48);display:none}
    #compiti-guide-overlay.show{display:block}
    #compiti-guide-card{position:fixed;z-index:2147483644;width:min(420px,calc(100vw - 28px));background:#fff;color:#243046;border-radius:24px;padding:20px;box-shadow:0 22px 70px rgba(0,0,0,.32);display:none;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
    #compiti-guide-card.show{display:block}
    #compiti-guide-card h3{margin:0 0 9px;font-size:21px;line-height:1.15}
    #compiti-guide-card p{margin:0;color:#536174;line-height:1.5;font-size:15px}
    .compiti-guide-count{margin-top:13px;color:#8792a4;font-size:12px;font-weight:800}
    .compiti-guide-example{margin-top:13px;padding:11px 12px;border-radius:14px;background:#fff7cc;border:2px solid #fde68a;color:#5f4a00;font-size:14px;font-weight:750;line-height:1.4}
    .compiti-guide-actions{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:16px}
    .compiti-guide-actions button{border:0;border-radius:14px;padding:10px 13px;box-shadow:none;font-weight:800;cursor:pointer}
    .compiti-guide-skip{background:#eef2f7;color:#475569}
    .compiti-guide-prev{background:#fff3dd;color:#8a4b00}
    .compiti-guide-next{background:#ff8a00;color:#fff;margin-left:auto}
    .compiti-guide-focus{position:relative!important;z-index:2147483642!important;box-shadow:0 0 0 6px #ffd166,0 0 0 9999px rgba(15,23,42,.48)!important;border-radius:16px!important}
    .compiti-guide-note{margin:12px 0;padding:12px 14px;border-radius:16px;background:#fff7cc;color:#5f4a00;font-size:14px;line-height:1.45;border:2px solid #fde68a}
    .compiti-guide-choice{display:grid;gap:10px;margin-top:16px}
    .compiti-guide-choice button{width:100%;text-align:left;border:2px solid #e2e8f0;border-radius:16px;padding:14px;background:#fff;box-shadow:none;color:#243046;cursor:pointer}
    .compiti-guide-choice button:hover{border-color:#ffb14b;background:#fffaf2}
    .compiti-guide-choice strong{display:block;font-size:16px;margin-bottom:3px}
    .compiti-guide-choice span{display:block;color:#64748b;font-size:13px;line-height:1.4;font-weight:600}
    @media(max-width:520px){#compiti-guide-button{top:max(8px,env(safe-area-inset-top));right:8px;font-size:13px;padding:8px 11px}#compiti-guide-card{padding:17px;border-radius:20px}}
  `;
  document.head.appendChild(style);

  const guideButton = document.createElement('button');
  guideButton.id = 'compiti-guide-button';
  guideButton.type = 'button';
  guideButton.textContent = '? Guida';
  guideButton.setAttribute('aria-label', 'Apri la guida interattiva di Compiti');
  document.body.appendChild(guideButton);

  const overlay = document.createElement('div');
  overlay.id = 'compiti-guide-overlay';
  document.body.appendChild(overlay);

  const card = document.createElement('div');
  card.id = 'compiti-guide-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  document.body.appendChild(card);

  function clickTab(tab) {
    if (!tab) return;
    const btn = document.querySelector(`button[data-tab="${tab}"]`);
    if (btn && !btn.classList.contains('active')) btn.click();
  }

  function clearFocus() {
    if (currentTarget) currentTarget.classList.remove('compiti-guide-focus');
    currentTarget = null;
  }

  function targetFor(step) {
    return document.querySelector(step.target) || document.querySelector('.tabs') || document.body;
  }

  function positionCard(target) {
    const r = target.getBoundingClientRect();
    const cardWidth = Math.min(420, window.innerWidth - 28);
    const gap = 16;
    const left = Math.max(14, Math.min(window.innerWidth - cardWidth - 14, r.left));
    let top = r.bottom + gap;
    const estimatedHeight = 320;
    if (top + estimatedHeight > window.innerHeight - 14) top = Math.max(14, r.top - estimatedHeight - gap);
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function renderStep() {
    clearFocus();
    const step = activeTour.steps[index];
    clickTab(step.tab);
    setTimeout(() => {
      currentTarget = targetFor(step);
      if (currentTarget !== document.body) {
        currentTarget.classList.add('compiti-guide-focus');
        currentTarget.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
      }
      card.innerHTML = `
        <h3>${step.title}</h3>
        <p>${step.text}</p>
        ${step.example ? `<div class="compiti-guide-example">${step.example}</div>` : ''}
        <div class="compiti-guide-count">${index + 1} / ${activeTour.steps.length} · ${activeTour.title}</div>
        <div class="compiti-guide-actions">
          <button type="button" class="compiti-guide-skip">Chiudi</button>
          ${index > 0 ? '<button type="button" class="compiti-guide-prev">Indietro</button>' : ''}
          <button type="button" class="compiti-guide-next">${index === activeTour.steps.length - 1 ? 'Fine' : 'Avanti'}</button>
        </div>`;
      positionCard(currentTarget);
      card.classList.add('show');
      overlay.classList.add('show');
      card.querySelector('.compiti-guide-skip').onclick = closeGuide;
      const prev = card.querySelector('.compiti-guide-prev');
      if (prev) prev.onclick = () => { index -= 1; renderStep(); };
      card.querySelector('.compiti-guide-next').onclick = () => {
        if (index === activeTour.steps.length - 1) {
          if (activeTour === tours.overview) {
            try { localStorage.setItem(STORAGE_KEY, 'done'); } catch (_) {}
          }
          closeGuide();
        } else {
          index += 1;
          renderStep();
        }
      };
    }, 100);
  }

  function openTour(key) {
    activeTour = tours[key] || tours.overview;
    index = 0;
    renderStep();
  }

  function openChooser() {
    clearFocus();
    overlay.classList.add('show');
    card.classList.add('show');
    card.style.left = `${Math.max(14, (window.innerWidth - Math.min(420, window.innerWidth - 28)) / 2)}px`;
    card.style.top = `${Math.max(20, Math.min(window.innerHeight * .18, 140))}px`;
    card.innerHTML = `
      <h3>Come posso aiutarti?</h3>
      <p>Scegli la guida che ti serve. Puoi riaprirla quando vuoi.</p>
      <div class="compiti-guide-choice">
        <button type="button" data-guide="overview"><strong>Tour dell’app</strong><span>Una panoramica veloce di Studente, Calendario, Genitore e Configurazioni.</span></button>
        <button type="button" data-guide="setup"><strong>Come configurare i compiti</strong><span>Un percorso dettagliato per creare periodo, materie, attività e calendario.</span></button>
      </div>
      <div class="compiti-guide-actions"><button type="button" class="compiti-guide-skip">Chiudi</button></div>`;
    card.querySelectorAll('[data-guide]').forEach(btn => btn.onclick = () => openTour(btn.dataset.guide));
    card.querySelector('.compiti-guide-skip').onclick = closeGuide;
  }

  function closeGuide() {
    clearFocus();
    overlay.classList.remove('show');
    card.classList.remove('show');
  }

  guideButton.addEventListener('click', openChooser);
  overlay.addEventListener('click', closeGuide);
  window.addEventListener('resize', () => {
    if (card.classList.contains('show') && currentTarget) positionCard(currentTarget);
  });

  const sessionsList = document.getElementById('sessionsList');
  if (sessionsList?.parentElement) {
    const note = document.createElement('div');
    note.className = 'compiti-guide-note';
    note.textContent = 'Una configurazione raccoglie tutto il lavoro di un periodo: date, materie, attività, calendario e progressi. Se è la prima volta, apri “? Guida” → “Come configurare i compiti”.';
    sessionsList.parentElement.insertBefore(note, sessionsList);
  }

  const parentContent = document.getElementById('parentContent');
  if (parentContent?.parentElement) {
    const note = document.createElement('div');
    note.className = 'compiti-guide-note';
    note.textContent = 'Area Genitore: qui prepari e modifichi materie e attività. Lo studente userà soprattutto la scheda “Studente”.';
    parentContent.parentElement.insertBefore(note, parentContent);
  }

  let completed = false;
  try { completed = localStorage.getItem(STORAGE_KEY) === 'done'; } catch (_) {}
  if (!completed) setTimeout(() => openTour('overview'), 500);
})();
