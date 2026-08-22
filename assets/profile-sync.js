(()=>{
  const app=window.HOME_APP_KEY;
  const csrf=window.HOME_CSRF;
  const initial=window.HOME_PROGRESS||{};
  if(!app||!csrf)return;
  const registryKey='__home_keys_'+app;
  const proto=Storage.prototype;
  const originalSet=proto.setItem;
  const originalRemove=proto.removeItem;
  let known=[];
  try{known=JSON.parse(originalSet?localStorage.getItem(registryKey)||'[]':'[]')}catch{}
  if(!Array.isArray(known))known=[];
  known.forEach(k=>originalRemove.call(localStorage,k));
  Object.entries(initial).forEach(([k,v])=>{originalSet.call(localStorage,k,String(v));if(!known.includes(k))known.push(k)});
  originalSet.call(localStorage,registryKey,JSON.stringify(known));

  let timer=null;
  const persist=()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
      const state={};
      known.forEach(k=>{const v=localStorage.getItem(k);if(v!==null)state[k]=v});
      fetch('/api/progress.php',{
        method:'POST',
        credentials:'same-origin',
        headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},
        body:JSON.stringify({app_key:app,state}),
        keepalive:true
      }).catch(()=>{});
    },350);
  };

  proto.setItem=function(k,v){
    originalSet.call(this,k,v);
    if(this===localStorage && k!==registryKey){
      if(!known.includes(k)){known.push(k);originalSet.call(localStorage,registryKey,JSON.stringify(known))}
      persist();
    }
  };
  proto.removeItem=function(k){
    originalRemove.call(this,k);
    if(this===localStorage && k!==registryKey){
      known=known.filter(x=>x!==k);
      originalSet.call(localStorage,registryKey,JSON.stringify(known));
      persist();
    }
  };
  window.addEventListener('pagehide',persist);
})();
