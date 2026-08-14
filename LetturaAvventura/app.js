(()=>{
  const A=window.ADVENTURE;
  const KEY='lettura-avventura-save-v1';
  const $=id=>document.getElementById(id);
  const setup=$('setup-screen'),game=$('game-screen'),nameInput=$('player-name'),avatarGrid=$('avatar-grid'),startBtn=$('start-button'),continueBtn=$('continue-button');
  const sceneArt=$('scene-art'),sceneTitle=$('scene-title'),sceneText=$('scene-text'),choices=$('choices'),chapterLabel=$('chapter-label'),sceneCount=$('scene-count'),progressBar=$('progress-bar'),inventoryPill=$('inventory-pill'),sceneKicker=$('scene-kicker'),toast=$('toast');
  let selectedAvatar=null;
  let state={name:'',avatar:'',scene:'s001',inventory:[],visited:[]};

  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  function avatar(){return A.avatars.find(a=>a.id===state.avatar)||A.avatars[0]}
  function say(text){if(!('speechSynthesis'in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang='it-IT';u.rate=.88;speechSynthesis.speak(u)}
  function showToast(text){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1800)}
  function personalize(text){return text.replaceAll('{{name}}',state.name||'il nostro eroe')}
  function updateStart(){startBtn.disabled=!(nameInput.value.trim().length>0&&selectedAvatar)}

  A.avatars.forEach(a=>{
    const b=document.createElement('button');b.className='avatar-card';b.type='button';b.innerHTML=`<div class="avatar-portrait">${a.emoji}</div><div class="avatar-name">${a.label}</div>`;
    b.onclick=()=>{selectedAvatar=a.id;document.querySelectorAll('.avatar-card').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');updateStart()};avatarGrid.appendChild(b);
  });
  nameInput.addEventListener('input',updateStart);

  function enterGame(){setup.classList.remove('active');game.classList.add('active');renderScene()}
  startBtn.onclick=()=>{state={name:nameInput.value.trim(),avatar:selectedAvatar,scene:'s001',inventory:[],visited:[]};save();enterGame()};
  const existing=load(); if(existing){continueBtn.classList.remove('hidden');continueBtn.onclick=()=>{state=existing;enterGame()}}

  function renderScene(){
    const s=A.scenes[state.scene]; if(!s)return;
    if(!state.visited.includes(state.scene))state.visited.push(state.scene);
    if(s.gain&&!state.inventory.includes(s.gain)){state.inventory.push(s.gain);showToast(`Hai trovato: ${s.gain} ✨`)}
    save();
    const av=avatar();
    sceneArt.textContent=`${av.emoji}  ${s.art}`;
    sceneArt.setAttribute('aria-label',`${state.name}, ${av.style}. ${s.title}`);
    sceneTitle.textContent=personalize(s.title);sceneText.textContent=personalize(s.text);sceneKicker.textContent=s.kicker;chapterLabel.textContent=s.chapter;
    sceneCount.textContent=`${state.visited.length}/${A.totalScenes}`;progressBar.style.width=`${Math.max(1,(state.visited.length/A.totalScenes)*100)}%`;inventoryPill.textContent=`🎒 ${state.inventory.length}`;
    choices.innerHTML='';
    s.choices.forEach(c=>{const b=document.createElement('button');b.className='choice-button'+(c.requires?' special':'');b.textContent=c.label;if(c.requires&&!state.inventory.includes(c.requires)){b.disabled=true;b.textContent+=` · serve ${c.requires}`;b.style.opacity='.45'}else b.onclick=()=>{state.scene=c.next;save();renderScene();window.scrollTo({top:0,behavior:'smooth'})};choices.appendChild(b)});
  }

  $('audio-button').onclick=()=>{const s=A.scenes[state.scene];say(`${personalize(s.title)}. ${personalize(s.text)}. ${s.choices.map(c=>c.label.replace(/[^\p{L}\p{N}\s]/gu,'')).join('. Oppure: ')}`)};
  $('home-button').onclick=()=>{speechSynthesis?.cancel?.();game.classList.remove('active');setup.classList.add('active');const saved=load();if(saved)continueBtn.classList.remove('hidden')};
})();