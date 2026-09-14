(()=>{
  const modalBg=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const prev=document.getElementById('modalPrev');
  const next=document.getElementById('modalNext');
  if(!modalBg||!modal||!prev||!next)return;

  let sumX=0;
  let locked=false;
  let lastEventAt=0;
  let quietTimer=0;
  let queue=[];
  let pumping=false;

  const THRESHOLD=40;
  const QUIET_GAP=48;
  const FAST_RATE=1.5;

  const modalBusy=()=>Boolean(modalBg.querySelector('.film-modal:not(#filmModal)'));
  const clearPreview=()=>{
    if(modalBusy())return;
    modal.style.transition='';
    modal.style.transform='';
    modal.style.opacity='';
  };
  const resetGesture=()=>{
    sumX=0;
    locked=false;
    clearPreview();
  };
  const resetAll=()=>{
    resetGesture();
    queue=[];
    pumping=false;
    clearTimeout(quietTimer);
  };
  const scheduleQuietReset=()=>{
    clearTimeout(quietTimer);
    quietTimer=setTimeout(resetGesture,QUIET_GAP);
  };

  const accelerateTransition=()=>{
    requestAnimationFrame(()=>{
      try{
        modalBg.getAnimations?.({subtree:true}).forEach(animation=>{
          if(animation.playState==='running'||animation.playState==='pending')animation.updatePlaybackRate?.(FAST_RATE);
        });
      }catch(_){/* Older engines simply keep the native transition speed. */}
    });
  };

  // One physical trackpad impulse may emit many wheel events. Keep the impulse locked
  // until there has been a real quiet gap, then allow the next swipe. Distinct swipes
  // can still queue while the current card transition is finishing.
  const drain=()=>{
    if(pumping||!queue.length||!modalBg.classList.contains('open')||modal.classList.contains('is-ghost-detail')||modalBusy())return;
    pumping=true;
    const direction=queue.shift();
    clearPreview();
    (direction>0?next:prev).click();
    accelerateTransition();
    requestAnimationFrame(()=>{
      pumping=false;
      if(!modalBusy())drain();
    });
  };
  const enqueue=direction=>{
    if(queue.length>=2)return;
    queue.push(direction);
    drain();
  };

  // Capture before app-desktop's legacy wheel handler. The card follows the first
  // pixels of the gesture, but a single momentum stream can only advance one film.
  window.addEventListener('wheel',event=>{
    if(!modalBg.classList.contains('open')||modal.classList.contains('is-ghost-detail'))return;
    const ax=Math.abs(event.deltaX),ay=Math.abs(event.deltaY);
    if(ax<3||ay>ax*1.12)return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const now=performance.now();
    const gap=now-lastEventAt;
    if(gap>QUIET_GAP)resetGesture();
    lastEventAt=now;
    scheduleQuietReset();
    if(locked)return;

    sumX+=event.deltaX;

    if(!modalBusy()){
      const visual=Math.max(-26,Math.min(26,-sumX*.30));
      modal.style.transition='none';
      modal.style.transform=`translate3d(${visual}px,0,0)`;
      modal.style.opacity=String(Math.max(.92,1-Math.abs(visual)/360));
    }

    if(Math.abs(sumX)<THRESHOLD)return;

    locked=true;
    const direction=sumX>0?1:-1;
    sumX=0;
    clearPreview();
    enqueue(direction);
  },{capture:true,passive:false});

  // app-desktop removes its outgoing snapshot only when both transition animations are
  // finished. React immediately to that DOM mutation instead of polling on a timer.
  new MutationObserver(()=>{
    if(!modalBg.classList.contains('open')){resetAll();return}
    if(!modalBusy()){
      pumping=false;
      drain();
    }
  }).observe(modalBg,{attributes:true,attributeFilter:['class'],childList:true});

  // Ghost sheets own a separate rail in ghost-modal-rail.js.
  window.addEventListener('keydown',event=>{
    if(!modalBg.classList.contains('open')||!modal.classList.contains('is-ghost-detail'))return;
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  },{capture:true});
})();