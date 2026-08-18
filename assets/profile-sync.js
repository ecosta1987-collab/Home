(()=>{
  const app=window.HOME_APP_KEY;
  const csrf=window.HOME_CSRF;
  const initial=window.HOME_PROGRESS||{};
  if(!app||!csrf)return;
  const registryKey='__home_keys_'+app;
  let known=[];
  try{known=JSON.parse(localStorage.getItem(registryKey)||'[]')}catch{}
  if(!Array.isArray(known))known=[];
  known.forEach(k=>localStorage.removeItem(k));
  Object.entries(initial).forEach(([k,v])=>{localStorage.setItem(k,String(v));if(!known.includes(k))known.push(k)});
  localStorage.setItem(registryKey,JSON.stringify(known));

  const originalSet=localStorage.setItem.bind(localStorage);
  const originalRemove=localStorage.removeItem.bind(localStorage);
  let timer=null;
  const persist=()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
      const state={};
      let keys=[];
      try{keys=JSON.parse(localStorage.getItem(registryKey)||'[]')}catch{}
      if(!Array.isArray(keys))keys=[];
      keys.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)state[k]=v});
      fetch('/api/progress.php',{
        method:'POST',
        credentials:'same-origin',
        headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},
        body:JSON.stringify({app_key:app,state})
      }).catch(()=>{});
    },500);
  };
  localStorage.setItem=(k,v)=>{
    originalSet(k,v);
    if(k!==registryKey){if(!known.includes(k)){known.push(k);originalSet(registryKey,JSON.stringify(known))}persist()}
  };
  localStorage.removeItem=(k)=>{
    originalRemove(k);
    if(k!==registryKey){known=known.filter(x=>x!==k);originalSet(registryKey,JSON.stringify(known));persist()}
  };
  window.addEventListener('pagehide',persist);
})();
