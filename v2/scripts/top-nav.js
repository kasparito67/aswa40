(()=>{
  const stage=document.getElementById('stage');
  const hud=document.getElementById('eraHud');
  const pagePrev=document.getElementById('eraPrev');
  const pageNext=document.getElementById('eraNext');
  if(!stage||!hud||!Array.isArray(TOPS)||!TOPS.length)return;

  hud.classList.add('era-hud-selector');
  hud.innerHTML=`
    <button class="era-hud-step era-hud-step-prev" type="button" aria-label="Top précédent">‹</button>
    <button class="era-hud-current" type="button" aria-haspopup="listbox" aria-expanded="false">
      <span class="era-hud-label">${TOPS[0].label}</span>
      <span class="era-hud-caret" aria-hidden="true">⌄</span>
    </button>
    <button class="era-hud-step era-hud-step-next" type="button" aria-label="Top suivant">›</button>
    <div class="era-hud-menu" role="listbox" aria-label="Choisir un Top">
      ${TOPS.map((top,i)=>`<button class="era-hud-option" type="button" role="option" data-top-index="${i}" aria-selected="false"><span>${top.label}</span></button>`).join('')}
    </div>`;

  const current=hud.querySelector('.era-hud-current');
  const label=hud.querySelector('.era-hud-label');
  const prev=hud.querySelector('.era-hud-step-prev');
  const next=hud.querySelector('.era-hud-step-next');
  const options=[...hud.querySelectorAll('.era-hud-option')];
  let frame=0;

  const indexFromRail=()=>Math.max(0,Math.min(TOPS.length-1,Math.round(stage.scrollLeft/Math.max(innerWidth,1))));
  const setOpen=open=>{
    hud.classList.toggle('is-open',open);
    current.setAttribute('aria-expanded',String(open));
  };
  const sync=()=>{
    frame=0;
    const index=indexFromRail();
    label.textContent=TOPS[index].label;
    prev.disabled=index===0;
    next.disabled=index===TOPS.length-1;
    options.forEach((option,i)=>{
      const active=i===index;
      option.classList.toggle('active',active);
      option.setAttribute('aria-selected',String(active));
    });
  };
  const go=index=>{
    const target=Math.max(0,Math.min(TOPS.length-1,index));
    stage.scrollTo({left:target*Math.max(innerWidth,1),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    setOpen(false);
  };

  current.addEventListener('click',()=>setOpen(!hud.classList.contains('is-open')));
  prev.addEventListener('click',()=>{if(!prev.disabled)pagePrev?.click()});
  next.addEventListener('click',()=>{if(!next.disabled)pageNext?.click()});
  options.forEach(option=>option.addEventListener('click',()=>go(Number(option.dataset.topIndex))));
  stage.addEventListener('scroll',()=>{
    // A swipe or any external rail navigation invalidates an open popup position/state.
    if(hud.classList.contains('is-open'))setOpen(false);
    if(!frame)frame=requestAnimationFrame(sync);
  },{passive:true});
  addEventListener('resize',sync,{passive:true});
  document.addEventListener('pointerdown',e=>{if(!hud.contains(e.target))setOpen(false)});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')setOpen(false);
    if(!hud.contains(document.activeElement))return;
    const index=indexFromRail();
    if(e.key==='ArrowLeft'){
      e.preventDefault();e.stopPropagation();go(index-1);
    }
    if(e.key==='ArrowRight'){
      e.preventDefault();e.stopPropagation();go(index+1);
    }
  });

  sync();
})();
