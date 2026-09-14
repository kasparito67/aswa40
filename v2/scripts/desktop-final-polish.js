(()=>{
  const desktop=window.__ASWA40_FORCE_DESKTOP__===true||matchMedia('(min-width:701px) and (hover:hover) and (pointer:fine)').matches;
  if(!desktop)return;

  const stage=document.getElementById('stage');
  if(!stage)return;

  // Final readability pass for the expanded sidebar copy only. Keep the large
  // accordion headings untouched; this simply gives the disclosure content a
  // little more presence on desktop.
  if(!document.getElementById('aswa40-final-sidebar-type')){
    const style=document.createElement('style');
    style.id='aswa40-final-sidebar-type';
    style.textContent=`
      .desktop-native .era-screen .site-sidebar .insight-detail ul{
        font-size:15px!important;
        line-height:1.52!important;
      }
      .desktop-native .era-screen .site-sidebar .year-highlight b{
        font-size:15px!important;
        line-height:1.12!important;
      }
      .desktop-native .era-screen .site-sidebar .year-highlight span{
        font-size:12px!important;
        line-height:1.32!important;
      }
      .desktop-native .era-screen .site-sidebar .year-insight-decade b{
        font-size:13px!important;
      }
      .desktop-native .era-screen .site-sidebar .director-row b{
        font-size:15px!important;
        line-height:1.12!important;
      }
      .desktop-native .era-screen .site-sidebar .director-films{
        font-size:12.5px!important;
        line-height:1.4!important;
      }
    `;
    document.head.appendChild(style);
  }

  const navSelector='.design-header-top5,.design1975-top5';

  const installLockGuard=nav=>{
    if(!nav||nav.dataset.aswaLockGuard==='1')return;
    const buttons=[...nav.querySelectorAll('button')];
    if(!buttons.length)return;

    nav.dataset.aswaLockGuard='1';
    const initial=buttons.findIndex(button=>button.classList.contains('is-locked'));
    nav.dataset.aswaLockedIndex=String(initial>=0?initial:0);

    // Capture the user's explicit choice before any legacy hover/focus cleanup can
    // run. The original header renderer still owns the cinematic transition.
    nav.addEventListener('click',event=>{
      const button=event.target.closest?.('button');
      if(!button||!nav.contains(button))return;
      const index=buttons.indexOf(button);
      if(index<0)return;
      nav.dataset.aswaLockedIndex=String(index);

      // Keep the visible locked state deterministic even if focus/pointer events
      // arrive in an unusual order on a trackpad.
      queueMicrotask(()=>{
        buttons.forEach((item,i)=>item.classList.toggle('is-locked',i===index));
        if(!nav.querySelector('button.is-preview'))nav.classList.remove('is-previewing');
      });
    },true);

    const restorePersistedLock=event=>{
      if(event?.type==='focusout'&&nav.contains(event.relatedTarget))return;
      queueMicrotask(()=>{
        const index=Math.max(0,Math.min(buttons.length-1,Number(nav.dataset.aswaLockedIndex)||0));
        const target=buttons[index];
        if(!target)return;
        const current=buttons.findIndex(button=>button.classList.contains('is-locked'));
        const previewing=nav.classList.contains('is-previewing');
        if(current===index&&!previewing)return;

        // Re-run the native lock handler. This updates the renderer's private
        // `locked` value as well as the hero image/progress bar, instead of merely
        // repainting CSS classes from the outside.
        target.click();
      });
    };

    // The original handlers clear a hover preview on leave/focusout. This guard is
    // registered later, so it can restore the last explicit click if that cleanup
    // accidentally reverted to an older selection.
    nav.addEventListener('pointerleave',restorePersistedLock);
    nav.addEventListener('focusout',restorePersistedLock);
  };

  const installAll=()=>stage.querySelectorAll(navSelector).forEach(installLockGuard);
  installAll();
  new MutationObserver(()=>requestAnimationFrame(installAll)).observe(stage,{childList:true,subtree:true});
})();