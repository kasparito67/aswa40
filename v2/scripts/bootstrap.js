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
      // One small shared source of truth keeps desktop/mobile Top-5 films identical
      // while allowing the portrait renderer to carry its own optical crop values.
      await load('scripts/header-media-config.js');

      if(desktopNative){
        document.documentElement.classList.add('desktop-native');
        // Desktop-only design systems attach their observers before the renderer mounts.
        await Promise.all([
          load('scripts/design-1975.js'),
          load('scripts/design-header-system.js')
        ]);
        await load('scripts/app-desktop.js');
        await load('scripts/top-nav.js');
        await load('scripts/parallax.js');
      }else{
        // Mobile gets only its own performance/data preflight and header system.
        await load('scripts/mobile-performance-preflight.js');
        await load('scripts/mobile-cinema-header.js');
        await load('scripts/runtime.js');
        await load('scripts/app.js');
        // parallax.js exits immediately on touch/mobile, so do not download/parse it here.
      }
    }catch(err){
      console.error('ASWA40 bootstrap failed',err);
    }
  })();
})();
