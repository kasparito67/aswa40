(()=>{
  const desktop=window.__ASWA40_FORCE_DESKTOP__===true||matchMedia('(min-width:701px) and (hover:hover) and (pointer:fine)').matches;
  if(!desktop)return;

  const stage=document.getElementById('stage');
  if(!stage)return;

  const applyLockedState=(nav,index)=>{
    const buttons=[...nav.querySelectorAll('button')];
    if(!buttons.length)return;
    index=Math.max(0,Math.min(buttons.length-1,index));

    nav.dataset.aswaLockedIndex=String(index);
    nav.classList.remove('is-previewing');
    buttons.forEach((button,i)=>{
      button.classList.toggle('is-locked',i===index);
      button.classList.remove('is-preview');
      button.setAttribute('aria-pressed',String(i===index));
    });

    const screen=nav.closest('.era-screen');
    if(!screen)return;

    const is1975=nav.classList.contains('design1975-top5');
    const media=[...screen.querySelectorAll(is1975?'.design1975-media-layer':'.design-header-media-layer')];
    media.forEach((layer,i)=>{
      layer.classList.remove('is-incoming','is-outgoing');
      layer.classList.toggle('is-active',i===index);
    });

    if(is1975){
      screen.querySelectorAll('.design1975-bg-layer').forEach((layer,i)=>layer.classList.toggle('is-active',i===index));
    }

    const progress=screen.querySelector(is1975?'.design1975-progress':'.design-header-progress');
    progress?.style.setProperty('--design-index',index);
  };

  const bind=nav=>{
    if(!nav||nav.dataset.aswaLockV1==='1')return;
    const buttons=[...nav.querySelectorAll('button')];
    if(!buttons.length)return;

    nav.dataset.aswaLockV1='1';
    const initial=buttons.findIndex(button=>button.classList.contains('is-locked'));
    nav.dataset.aswaLockedIndex=String(initial>=0?initial:0);
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===(initial>=0?initial:0))));

    // Store the explicit user choice. The existing renderer keeps its hover preview,
    // while this final layer guarantees that leaving the nav returns to that choice.
    nav.addEventListener('click',event=>{
      const button=event.target.closest?.('button');
      if(!button||!nav.contains(button))return;
      const index=buttons.indexOf(button);
      if(index<0)return;
      nav.dataset.aswaLockedIndex=String(index);
      requestAnimationFrame(()=>applyLockedState(nav,index));
    },true);

    const restore=event=>{
      if(event?.type==='focusout'&&nav.contains(event.relatedTarget))return;
      const index=Number(nav.dataset.aswaLockedIndex)||0;
      requestAnimationFrame(()=>applyLockedState(nav,index));
    };

    nav.addEventListener('pointerleave',restore);
    nav.addEventListener('focusout',restore);
  };

  const install=()=>stage.querySelectorAll('.design-header-top5,.design1975-top5').forEach(bind);
  install();
  new MutationObserver(()=>requestAnimationFrame(install)).observe(stage,{childList:true,subtree:true});
})();
