(()=>{
  const stage=document.getElementById('stage');
  const modalBg=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const modalPoster=document.getElementById('modalPoster');
  const modalBackdrop=document.getElementById('modalBackdrop');
  const modalRank=document.getElementById('modalRank');
  const modalTitle=document.getElementById('modalTitle');
  const modalStats=document.getElementById('modalStats');
  const modalBody=document.getElementById('modalBody');
  if(!stage||!modalBg||!modal||typeof TOPS==='undefined'||!Array.isArray(TOPS))return;

  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const slug=s=>norm(s).replace(/\s+/g,'-');

  let state=null;
  let drag=null;
  let animating=false;
  let wheelSum=0;
  let wheelLocked=false;
  let wheelTimer=0;

  const ghostCardFor=(top,index)=>stage.querySelector(`.era-screen[data-top-id="${CSS.escape(top.id)}"] .ghost-card[data-ghost="${index}"]`);
  const posterFor=(top,index,ghost,card=null)=>{
    const node=card||ghostCardFor(top,index);
    return node?.querySelector('img')?.currentSrc||node?.querySelector('img')?.src||ghost?.img||'';
  };

  const paint=(top,index,card=null)=>{
    const ghosts=top?.ghosts||[];
    const ghost=ghosts[index];
    if(!ghost)return;
    const poster=posterFor(top,index,ghost,card);
    document.documentElement.style.setProperty('--active-accent',top.theme?.accent||'#e60d45');
    modal.classList.add('is-ghost-detail');
    modal.dataset.ghostTopId=top.id;
    modal.dataset.ghostIndex=String(index);
    modalPoster.src=poster;modalPoster.alt=`Affiche de ${ghost.title}`;
    modalBackdrop.src=poster;modalBackdrop.alt='';
    modalRank.textContent='Grand oublié';
    modalTitle.textContent=ghost.title;
    const noVotes=/aucun vote/i.test(String(ghost.copy||''));
    modalStats.innerHTML=noVotes?'<span><b>0</b> vote</span>':'<span>Absent du classement</span>';
    modalBody.innerHTML=`<p>${esc(ghost.copy||'Absent du classement.')}</p><a class="modal-detail-link" href="https://letterboxd.com/film/${slug(ghost.title)}/" target="_blank" rel="noopener noreferrer">Voir sur Letterboxd ↗</a>`;
    state={top,index};
  };

  const open=(top,index,card)=>{
    paint(top,index,card);
    modalBg.classList.add('open');
    modalBg.setAttribute('aria-hidden','false');
  };

  const resetVisual=()=>{
    modal.style.transition='';
    modal.style.transform='';
    modal.style.opacity='';
  };

  const step=dir=>{
    if(!state||animating)return;
    const ghosts=state.top?.ghosts||[];
    if(ghosts.length<2)return;
    const nextIndex=(state.index+dir+ghosts.length)%ghosts.length;
    animating=true;
    const outX=dir>0?-46:46;
    const inX=-outX;
    const outgoing=modal.animate(
      [{transform:'translate3d(0,0,0)',opacity:1},{transform:`translate3d(${outX}px,0,0)`,opacity:.22}],
      {duration:115,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'}
    );
    Promise.resolve(outgoing.finished).catch(()=>{}).then(()=>{
      paint(state.top,nextIndex);
      const incoming=modal.animate(
        [{transform:`translate3d(${inX}px,0,0)`,opacity:.22},{transform:'translate3d(0,0,0)',opacity:1}],
        {duration:145,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}
      );
      return Promise.resolve(incoming.finished).catch(()=>{});
    }).finally(()=>{animating=false;resetVisual()});
  };

  stage.addEventListener('click',event=>{
    const card=event.target.closest?.('.ghost-card:not([data-r])');
    if(!card)return;
    const screen=card.closest('.era-screen');
    const top=TOPS.find(t=>t.id===screen?.dataset.topId);
    const index=Number(card.dataset.ghost);
    if(!top||!top.ghosts?.[index])return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    open(top,index,card);
  },true);

  // Capture touch/pointer gestures before the ranked-film modal handler. Forgotten
  // films form their own closed rail, so a swipe never falls back into top.films.
  modal.addEventListener('pointerdown',event=>{
    if(!modal.classList.contains('is-ghost-detail')||event.pointerType==='mouse'||event.target.closest('button,a'))return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,dy:0,locked:false};
    modal.setPointerCapture?.(event.pointerId);
    event.stopPropagation();
    event.stopImmediatePropagation();
  },true);

  modal.addEventListener('pointermove',event=>{
    if(!modal.classList.contains('is-ghost-detail')||!drag||drag.id!==event.pointerId)return;
    drag.dx=event.clientX-drag.x;
    drag.dy=event.clientY-drag.y;
    if(!drag.locked){
      if(Math.abs(drag.dx)<8&&Math.abs(drag.dy)<8)return;
      if(Math.abs(drag.dy)>Math.abs(drag.dx)*1.05){drag=null;resetVisual();return}
      drag.locked=true;
    }
    modal.style.transition='none';
    modal.style.transform=`translate3d(${drag.dx*.55}px,0,0)`;
    modal.style.opacity=String(Math.max(.72,1-Math.abs(drag.dx)/700));
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  },{capture:true,passive:false});

  const finishDrag=event=>{
    if(!modal.classList.contains('is-ghost-detail')||!drag||drag.id!==event.pointerId)return;
    const {dx,locked}=drag;drag=null;
    event.stopPropagation();
    event.stopImmediatePropagation();
    if(locked&&Math.abs(dx)>62){resetVisual();step(dx<0?1:-1);return}
    modal.style.transition='transform 140ms cubic-bezier(.22,.72,.18,1),opacity 140ms ease';
    modal.style.transform='';modal.style.opacity='';
    setTimeout(resetVisual,145);
  };
  modal.addEventListener('pointerup',finishDrag,true);
  modal.addEventListener('pointercancel',finishDrag,true);

  const resetWheel=()=>{wheelSum=0;wheelLocked=false};
  window.addEventListener('wheel',event=>{
    if(!modalBg.classList.contains('open')||!modal.classList.contains('is-ghost-detail'))return;
    const ax=Math.abs(event.deltaX),ay=Math.abs(event.deltaY);
    if(ax<3||ay>ax*1.12)return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    clearTimeout(wheelTimer);wheelTimer=setTimeout(resetWheel,48);
    if(wheelLocked)return;
    wheelSum+=event.deltaX;
    if(Math.abs(wheelSum)<46)return;
    wheelLocked=true;
    const dir=wheelSum>0?1:-1;
    wheelSum=0;
    step(dir);
  },{capture:true,passive:false});

  window.addEventListener('keydown',event=>{
    if(!modalBg.classList.contains('open')||!modal.classList.contains('is-ghost-detail'))return;
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    step(event.key==='ArrowRight'?1:-1);
  },true);

  new MutationObserver(()=>{
    if(modalBg.classList.contains('open'))return;
    state=null;drag=null;animating=false;resetWheel();resetVisual();
    delete modal.dataset.ghostTopId;delete modal.dataset.ghostIndex;
  }).observe(modalBg,{attributes:true,attributeFilter:['class']});
})();