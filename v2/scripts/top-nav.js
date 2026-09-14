(()=>{
  const stage=document.getElementById('stage');
  const hud=document.getElementById('eraHud');
  const pagePrev=document.getElementById('eraPrev');
  const pageNext=document.getElementById('eraNext');
  if(!stage||!hud||!Array.isArray(TOPS)||!TOPS.length)return;

  const reduced=matchMedia('(prefers-reduced-motion: reduce)');

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

  const installScrollCues=()=>{
    stage.querySelectorAll('.era-screen').forEach(screen=>{
      const hero=screen.querySelector('.hero-header');
      if(!hero||hero.querySelector('.hero-scroll-cue'))return;
      const top=TOPS.find(item=>item.id===screen.dataset.topId);
      const cue=document.createElement('button');
      cue.className='hero-scroll-cue';
      cue.type='button';
      cue.setAttribute('aria-label',`Voir les sections${top?.label?` — ${top.label}`:''}`);
      cue.innerHTML='<span class="hero-scroll-cue-label" aria-hidden="true"></span>';
      cue.addEventListener('click',()=>{
        screen.scrollTo({top:hero.offsetHeight,behavior:reduced.matches?'auto':'smooth'});
      });
      hero.append(cue);
    });
  };

  const syncSideTooltips=index=>{
    const previousTop=TOPS[index-1];
    const nextTop=TOPS[index+1];
    if(pagePrev){
      pagePrev.dataset.tooltip=previousTop?.label||'';
      pagePrev.setAttribute('aria-label',previousTop?`Top précédent : ${previousTop.label}`:'Top précédent');
    }
    if(pageNext){
      pageNext.dataset.tooltip=nextTop?.label||'';
      pageNext.setAttribute('aria-label',nextTop?`Top suivant : ${nextTop.label}`:'Top suivant');
    }
  };

  const sync=()=>{
    frame=0;
    const index=indexFromRail();
    label.textContent=TOPS[index].label;
    prev.disabled=index===0;
    next.disabled=index===TOPS.length-1;
    syncSideTooltips(index);
    options.forEach((option,i)=>{
      const active=i===index;
      option.classList.toggle('active',active);
      option.setAttribute('aria-selected',String(active));
    });
  };
  const go=index=>{
    const target=Math.max(0,Math.min(TOPS.length-1,index));
    stage.scrollTo({left:target*Math.max(innerWidth,1),behavior:reduced.matches?'auto':'smooth'});
    setOpen(false);
  };

  current.addEventListener('click',()=>setOpen(!hud.classList.contains('is-open')));
  prev.addEventListener('click',()=>{if(!prev.disabled)pagePrev?.click()});
  next.addEventListener('click',()=>{if(!next.disabled)pageNext?.click()});
  options.forEach(option=>option.addEventListener('click',()=>go(Number(option.dataset.topIndex))));
  stage.addEventListener('scroll',()=>{
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

  installScrollCues();
  sync();
})();
