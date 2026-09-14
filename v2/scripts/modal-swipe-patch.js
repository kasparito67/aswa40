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

  const reset=()=>{
    sumX=0;
    locked=false;
    lastAbsX=0;
  };
  const scheduleQuietReset=()=>{
    clearTimeout(quietTimer);
    quietTimer=setTimeout(reset,52);
  };

  // Intercept before app-desktop's older modal wheel handler. A physical swipe can
  // advance only one card, but a new strong impulse can re-arm immediately even if
  // the previous gesture still has a little trackpad momentum trailing behind it.
  window.addEventListener('wheel',event=>{
    if(!modalBg.classList.contains('open')||modal.classList.contains('is-ghost-detail'))return;
    const ax=Math.abs(event.deltaX),ay=Math.abs(event.deltaY);
    if(ax<3||ay>ax*1.12)return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const now=performance.now();
    const gap=now-lastEventAt;
    const strongNewImpulse=locked&&now-lastTriggerAt>105&&ax>=11&&ax>Math.max(11,lastAbsX*1.45);
    if(gap>58||strongNewImpulse)reset();

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
    (direction>0?next:prev).click();
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

  new MutationObserver(()=>{if(!modalBg.classList.contains('open'))reset()}).observe(modalBg,{attributes:true,attributeFilter:['class']});
})();