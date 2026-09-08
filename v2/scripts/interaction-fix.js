(()=>{
  const mb=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const prev=document.getElementById('modalPrev');
  const next=document.getElementById('modalNext');
  const title=document.getElementById('modalTitle');
  const content=modal?.querySelector('.modal-content');
  const backdrop=modal?.querySelector('.modal-backdrop img');
  if(!mb||!modal||!prev||!next||!title||!content||!backdrop)return;

  let wheelSum=0;
  let wheelLocked=false;
  let wheelQuiet=null;
  let pendingDir=0;
  let lastTitle='';

  const markDir=dir=>{ pendingDir=dir; };
  prev.addEventListener('click',()=>markDir(-1),true);
  next.addEventListener('click',()=>markDir(1),true);
  document.addEventListener('keydown',e=>{
    if(!mb.classList.contains('open'))return;
    if(e.key==='ArrowLeft')markDir(-1);
    if(e.key==='ArrowRight')markDir(1);
  },true);

  const releaseWheelAfterQuiet=()=>{
    clearTimeout(wheelQuiet);
    wheelQuiet=setTimeout(()=>{
      wheelLocked=false;
      wheelSum=0;
    },520);
  };

  /* Capture at the modal backdrop level so this runs before the older wheel handler. */
  mb.addEventListener('wheel',e=>{
    if(!mb.classList.contains('open'))return;
    if(Math.abs(e.deltaX)<Math.abs(e.deltaY)*.78)return;

    e.preventDefault();
    e.stopImmediatePropagation();
    releaseWheelAfterQuiet();

    if(wheelLocked)return;
    wheelSum+=e.deltaX;

    if(Math.abs(wheelSum)>=64){
      const dir=wheelSum>0?1:-1;
      wheelSum=0;
      wheelLocked=true;
      pendingDir=dir;
      (dir>0?next:prev).click();
    }
  },{passive:false,capture:true});

  function animateFilmChange(){
    const current=title.textContent.trim();
    if(!current||current===lastTitle)return;
    const isFirst=!lastTitle;
    lastTitle=current;
    if(isFirst){pendingDir=0;return;}

    const dir=pendingDir||1;
    pendingDir=0;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;

    content.getAnimations().forEach(a=>a.cancel());
    backdrop.getAnimations().forEach(a=>a.cancel());

    content.animate([
      {opacity:.18,transform:`translate3d(${dir>0?72:-72}px,0,0)`},
      {opacity:1,transform:'translate3d(0,0,0)'}
    ],{
      duration:430,
      easing:'cubic-bezier(.16,1,.3,1)'
    });

    backdrop.animate([
      {opacity:.44,transform:`translate3d(${dir>0?28:-28}px,0,0) scale(1.07)`},
      {opacity:1,transform:'translate3d(0,0,0) scale(1.025)'}
    ],{
      duration:520,
      easing:'cubic-bezier(.16,1,.3,1)'
    });
  }

  new MutationObserver(()=>requestAnimationFrame(animateFilmChange))
    .observe(title,{childList:true,subtree:true,characterData:true});

  /* Keep every non-master year/director card in the same disclosure model as 2000. */
  document.querySelectorAll('.era-screen:not([data-top-id="2000-2024"])').forEach(screen=>{
    screen.querySelectorAll('.parity-year-card').forEach(card=>{
      const toggle=card.querySelector('.year-toggle');
      const detail=card.querySelector('.year-insight-detail');
      if(toggle&&detail){
        detail.setAttribute('aria-hidden',String(!card.classList.contains('is-open')));
        toggle.addEventListener('click',()=>requestAnimationFrame(()=>{
          detail.setAttribute('aria-hidden',String(!card.classList.contains('is-open')));
        }));
      }
    });
    screen.querySelectorAll('.parity-director-card').forEach(card=>{
      const toggle=card.querySelector('.director-toggle-action');
      const detail=card.querySelector('.director-detail');
      if(toggle&&detail){
        detail.setAttribute('aria-hidden',String(!card.classList.contains('is-open')));
        toggle.addEventListener('click',()=>requestAnimationFrame(()=>{
          detail.setAttribute('aria-hidden',String(!card.classList.contains('is-open')));
        }));
      }
    });
  });
})();
