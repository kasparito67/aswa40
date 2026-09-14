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
  let pumpTimer=0;

  const resetGesture=()=>{
    sumX=0;
    locked=false;
    lastAbsX=0;
  };
  const resetAll=()=>{
    resetGesture();
    queue=[];
    pumping=false;
    clearTimeout(quietTimer);
    clearTimeout(pumpTimer);
  };
  const scheduleQuietReset=()=>{
    clearTimeout(quietTimer);
    quietTimer=setTimeout(resetGesture,42);
  };

  // app-desktop animates one modal change for ~210ms and ignores another click while
  // that animation is active. Queue physical swipe intents instead of dropping them:
  // one detected swipe = one card, regardless of how quickly the next swipe begins.
  const pump=()=>{
    if(pumping||!queue.length||!modalBg.classList.contains('open')||modal.classList.contains('is-ghost-detail'))return;
    pumping=true;
    const direction=queue.shift();
    (direction>0?next:prev).click();
    pumpTimer=setTimeout(()=>{
      pumping=false;
      if(queue.length)requestAnimationFrame(pump);
    },225);
  };
  const enqueue=direction=>{
    // Keep the interaction responsive without allowing an accidental trackpad storm
    // to schedule an unbounded rail traversal.
    if(queue.length>=5)return;
    queue.push(direction);
    pump();
  };

  // Intercept before app-desktop's older wheel handler. Momentum from a single swipe
  // stays locked, while a new impulse (or a short quiet gap) re-arms immediately.
  window.addEventListener('wheel',event=>{
    if(!modalBg.classList.contains('open')||modal.classList.contains('is-ghost-detail'))return;
    const ax=Math.abs(event.deltaX),ay=Math.abs(event.deltaY);
    if(ax<3||ay>ax*1.12)return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const now=performance.now();
    const gap=now-lastEventAt;
    const strongNewImpulse=locked&&now-lastTriggerAt>65&&ax>=10&&ax>Math.max(10,lastAbsX*1.35);
    if(gap>48||strongNewImpulse)resetGesture();

    lastEventAt=now;
    lastAbsX=ax;
    scheduleQuietReset();
    if(locked)return;

    sumX+=event.deltaX;
    if(Math.abs(sumX)<46)return;

    locked=true;
    lastTriggerAt=now;
    const direction=sumX>0?1:-1;
    sumX=0;
    enqueue(direction);
  },{capture:true,passive:false});

  // Forgotten films are standalone sheets, not members of the ranked modal rail.
  // Keep keyboard arrows from accidentally jumping back into the last ranked film.
  window.addEventListener('keydown',event=>{
    if(!modalBg.classList.contains('open')||!modal.classList.contains('is-ghost-detail'))return;
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  },{capture:true});

  new MutationObserver(()=>{if(!modalBg.classList.contains('open'))resetAll()}).observe(modalBg,{attributes:true,attributeFilter:['class']});
})();