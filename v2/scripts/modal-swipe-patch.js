(()=>{
  const modalBg=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const prev=document.getElementById('modalPrev');
  const next=document.getElementById('modalNext');
  if(!modalBg||!modal||!prev||!next)return;

  let sumX=0;
  let locked=false;
  let lastEventAt=0;
  let lastTriggerAt=0;
  let lastAbsX=0;
  let quietTimer=0;
  let queue=[];
  let pumping=false;

  const THRESHOLD=30;
  const FAST_RATE=1.35;

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
    lastAbsX=0;
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
    quietTimer=setTimeout(resetGesture,34);
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

  // Drain exactly one queued card as soon as the renderer is idle. A MutationObserver
  // below wakes this up on the exact frame the outgoing snapshot disappears, avoiding
  // the old 18 ms polling loop and its visible pause between rapid trackpad swipes.
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
    if(queue.length>=6)return;
    queue.push(direction);
    drain();
  };

  // Capture before app-desktop's legacy wheel handler. The card now follows the first
  // pixels of the gesture, commits earlier, and still treats one physical impulse as
  // one card. A fresh impulse can be queued while the previous transition is finishing.
  window.addEventListener('wheel',event=>{
    if(!modalBg.classList.contains('open')||modal.classList.contains('is-ghost-detail'))return;
    const ax=Math.abs(event.deltaX),ay=Math.abs(event.deltaY);
    if(ax<2||ay>ax*1.12)return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const now=performance.now();
    const gap=now-lastEventAt;
    const strongNewImpulse=locked&&now-lastTriggerAt>45&&ax>=7&&ax>Math.max(7,lastAbsX*1.28);
    if(gap>38||strongNewImpulse)resetGesture();

    lastEventAt=now;
    lastAbsX=ax;
    scheduleQuietReset();
    if(locked)return;

    sumX+=event.deltaX;

    if(!modalBusy()){
      const visual=Math.max(-28,Math.min(28,-sumX*.34));
      modal.style.transition='none';
      modal.style.transform=`translate3d(${visual}px,0,0)`;
      modal.style.opacity=String(Math.max(.91,1-Math.abs(visual)/340));
    }

    if(Math.abs(sumX)<THRESHOLD)return;

    locked=true;
    lastTriggerAt=now;
    const direction=sumX>0?1:-1;
    sumX=0;
    clearPreview();
    enqueue(direction);
  },{capture:true,passive:false});

  // app-desktop removes its outgoing snapshot only when both transition animations are
  // finished. React immediately to that DOM mutation instead of waking up on a timer.
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