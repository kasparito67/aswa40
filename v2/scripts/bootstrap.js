(()=>{
  const desktopNative=matchMedia('(min-width:701px) and (hover:hover) and (pointer:fine)').matches;
  const load=src=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=resolve;
    s.onerror=reject;
    document.body.appendChild(s);
  });

  (async()=>{
    try{
      if(desktopNative){
        document.documentElement.classList.add('desktop-native');
        await load('scripts/app-desktop.js');
        await load('scripts/top-nav.js');
        await load('scripts/parallax.js');
      }else{
        await load('scripts/runtime.js');
        await load('scripts/app.js');
        await load('scripts/parallax.js');
      }
    }catch(err){
      console.error('ASWA40 bootstrap failed',err);
    }
  })();
})();
