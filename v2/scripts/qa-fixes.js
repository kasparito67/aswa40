(()=>{
  const app=document.getElementById('app');
  const modalBg=document.getElementById('modalBg');
  const prev=document.getElementById('eraPrev');
  const next=document.getElementById('eraNext');
  if(!app)return;

  // app.js owns the canonical screen-to-screen transition. On touch devices its
  // pointer handler intentionally ignores buttons, which makes most poster/card
  // surfaces impossible to start a page swipe from. Bridge only those interactive
  // surfaces back to the canonical arrow navigation; blank areas still use app.js.
  const touchDevice=matchMedia('(pointer:coarse)').matches||('ontouchstart' in window);
  if(!touchDevice)return;

  const interactiveSelector='.tile,.ghost-card,.sec>.toggle,.insight-card,.year-toggle,.director-toggle-action,.full-reveal-button';
  let gesture=null;
  let suppressClickUntil=0;

  const modalOpen=()=>modalBg&&(modalBg.classList.contains('open')||modalBg.getAttribute('aria-hidden')==='false');

  app.addEventListener('touchstart',e=>{
    if(modalOpen())return;
    const target=e.target.closest?.(interactiveSelector);
    const touch=e.touches?.[0];
    if(!target||!touch)return;
    gesture={x:touch.clientX,y:touch.clientY,target};
  },{capture:true,passive:true});

  app.addEventListener('touchmove',e=>{
    if(!gesture||modalOpen())return;
    const touch=e.touches?.[0];
    if(!touch)return;
    const dx=touch.clientX-gesture.x;
    const dy=touch.clientY-gesture.y;
    if(Math.abs(dx)<18&&Math.abs(dy)<18)return;
    if(Math.abs(dy)>Math.abs(dx)*1.08){gesture=null;return}
    if(Math.abs(dx)<58)return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    suppressClickUntil=performance.now()+700;
    (dx<0?next:prev)?.click();
    gesture=null;
  },{capture:true,passive:false});

  const clear=()=>{gesture=null};
  app.addEventListener('touchend',clear,{capture:true,passive:true});
  app.addEventListener('touchcancel',clear,{capture:true,passive:true});

  document.addEventListener('click',e=>{
    if(performance.now()>=suppressClickUntil)return;
    if(!e.target.closest?.(interactiveSelector))return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  },true);
})();
