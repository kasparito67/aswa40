(()=>{
  const forceDesktop=window.__ASWA40_FORCE_DESKTOP__===true;
  const desktopNative=forceDesktop||matchMedia('(min-width:701px) and (hover:hover) and (pointer:fine)').matches;
  const load=src=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=resolve;
    s.onerror=reject;
    document.body.appendChild(s);
  });

  (async()=>{
    try{
      // Mobile title art starts warming immediately, before the heavier renderer boot.
      if(!desktopNative)await load('scripts/mobile-startup-preflight.js?v=1');

      // Shared content normalization must run before the platform-specific renderers
      // so mobile and desktop expose the same section names and documented extras.
      await load('scripts/shared-content-normalization.js');

      // One small shared source of truth keeps desktop/mobile Top-5 films identical
      // while allowing the portrait renderer to carry its own optical crop values.
      await load('scripts/header-media-config.js');
      await load('scripts/final-project-polish.js');

      if(desktopNative){
        document.documentElement.classList.add('desktop-native');
        if(forceDesktop)document.documentElement.classList.add('desktop-preview-forced');
        // Desktop-only design systems attach their observers before the renderer mounts.
        await Promise.all([
          load('scripts/design-1975.js'),
          load('scripts/design-header-system.js'),
          load('scripts/desktop-editorial-body.js')
        ]);
        // DOM-only desktop polish and interaction fixes.
        await load('scripts/desktop-content-fixes.js');
        await load('scripts/app-desktop.js');
        await load('scripts/desktop-accordion-fix.js');
        await load('scripts/ghost-modal-rail.js');
        await load('scripts/modal-swipe-patch.js');
        await load('scripts/top-nav.js');
        await load('scripts/desktop-header-lock-v1.js?v=1.0');
        await load('scripts/parallax.js');
      }else{
        // Mobile gets only its own performance/data preflight and header system.
        await load('scripts/mobile-performance-preflight.js');
        await load('scripts/mobile-cinema-header.js');
        await load('scripts/runtime.js');
        await load('scripts/app.js');
        await load('scripts/mobile-content-fixes.js');
        await load('scripts/ghost-modal-rail.js');
        // parallax.js exits immediately on mobile, so do not download/parse it here.
      }

      // Shared legal attribution belongs at the bottom of every Top on both platforms.
      await load('scripts/legal-footer.js?v=1.0');
    }catch(err){
      console.error('ASWA40 bootstrap failed',err);
    }
  })();
})();