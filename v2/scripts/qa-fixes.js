(()=>{
  const app=document.getElementById('app');
  const stage=document.getElementById('stage');
  const modalBg=document.getElementById('modalBg');
  const modalRank=document.getElementById('modalRank');
  const modalBody=document.getElementById('modalBody');
  const prev=document.getElementById('eraPrev');
  const next=document.getElementById('eraNext');
  if(!app)return;

  // OVNI editorial notes belong in the film detail card, not on touch tiles.
  const currentTop=()=>{
    const id=document.querySelector('.era-screen')?.dataset.topId;
    return Array.isArray(TOPS)?TOPS.find(t=>t.id===id):null;
  };
  const currentRank=()=>{
    const match=String(modalRank?.textContent||'').match(/#(\d+)/);
    return match?Number(match[1]):NaN;
  };
  const editorialFor=(top,f)=>{
    if(!top||!f)return '';
    const rank=Number(f.rank);
    const ghost=(top.ghosts||[]).find(g=>Number(g.rank)===rank);
    if(ghost?.copy)return `${ghost.copy}${ghost.picker?` · ${ghost.picker}`:''}`;
    const ranks=(top.ovnis?.ranks||[]).map(Number);
    if(!ranks.includes(rank))return '';
    const custom=top.ovnis?.comments?.[String(rank)]||top.ovnis?.comments?.[rank];
    if(custom)return custom;
    const votes=Number.parseInt(String(f.votes),10)||0;
    if(votes<=1){
      if(String(f.best)==='#25')return 'Choix solitaire, placé #25 par son seul défenseur. Il ferme naturellement le classement.';
      return `Un seul vote, mais placé ${f.best} par son seul défenseur : beaucoup de conviction, presque aucun consensus.`;
    }
    return `${f.votes} votes, mais assez bas dans les listes pour terminer dans la marge du classement collectif.`;
  };
  const injectEditorial=()=>{
    if(!modalBody||!modalBg?.classList.contains('open'))return;
    const top=currentTop(),rank=currentRank();
    if(!top||!Number.isFinite(rank))return;
    const f=(top.films||[]).find(x=>Number(x.rank)===rank);
    if(!f)return;
    modalBody.querySelector('.modal-ovni-editorial')?.remove();
    const note=editorialFor(top,f);
    if(!note)return;
    const p=document.createElement('p');
    p.className='modal-ovni-editorial';
    p.innerHTML=`<b>Pourquoi OVNI</b><br>${String(note).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}`;
    const link=modalBody.querySelector('.modal-detail-link');
    if(link)modalBody.insertBefore(p,link);else modalBody.appendChild(p);
  };
  if(modalBody&&modalRank&&modalBg){
    const observer=new MutationObserver(()=>requestAnimationFrame(injectEditorial));
    observer.observe(modalBody,{childList:true});
    observer.observe(modalRank,{childList:true,characterData:true,subtree:true});
    observer.observe(modalBg,{attributes:true,attributeFilter:['class','aria-hidden']});
    document.addEventListener('click',e=>{
      if(e.target.closest?.('.tile,.ghost-card,.modal-nav'))setTimeout(injectEditorial,0);
    },true);
  }

  // One mobile gesture source. This script is loaded before app.js so its guards
  // run before the canonical pointer/resize handlers are registered.
  const touchDevice=matchMedia('(pointer:coarse)').matches||('ontouchstart' in window);
  if(!touchDevice)return;

  let gesture=null;
  let suppressClickUntil=0;
  const modalOpen=()=>modalBg&&(modalBg.classList.contains('open')||modalBg.getAttribute('aria-hidden')==='false');
  const suppressSelector='.tile,.ghost-card,.sec>.toggle,.insight-card,.year-toggle,.director-toggle-action,.full-reveal-button,.era-arrow,a';
  const stageTransitioning=()=>stage&&(stage.children.length>1||stage.style.width==='200vw');

  // Android browser chrome can emit resize while a horizontal navigation is in
  // flight. app.js historically treated every resize as a cancelled carousel and
  // restored the previous screen. Ignore only those transient resize events.
  addEventListener('resize',e=>{
    if(stageTransitioning())e.stopImmediatePropagation();
  },{capture:true});

  // At rest there must be no latent CSS transition. app.js briefly clears its
  // inline transition after finalizing a route, which can otherwise animate the
  // reset from ±100vw back to zero on some mobile compositors.
  if(stage){
    const stabilize=()=>{
      if(stage.children.length===1&&stage.style.width==='100vw'&&stage.style.transition!=='none'){
        stage.style.transition='none';
        stage.style.willChange='auto';
      }
    };
    new MutationObserver(()=>queueMicrotask(stabilize)).observe(stage,{attributes:true,childList:true,attributeFilter:['style']});
  }

  // Block touch-pointer events before app.js's live-drag handler. Native touch
  // events below are the sole mobile page gesture path.
  ['pointerdown','pointermove','pointerup','pointercancel'].forEach(type=>{
    app.addEventListener(type,e=>{
      if(e.pointerType!=='touch'||modalOpen())return;
      e.stopImmediatePropagation();
    },{capture:true,passive:true});
  });

  app.addEventListener('touchstart',e=>{
    if(modalOpen())return;
    const touch=e.touches?.[0];
    if(!touch)return;
    gesture={x:touch.clientX,y:touch.clientY,dx:0,dy:0,horizontal:false,cancelled:false};
  },{capture:true,passive:true});

  app.addEventListener('touchmove',e=>{
    if(!gesture||gesture.cancelled||modalOpen())return;
    const touch=e.touches?.[0];
    if(!touch)return;
    gesture.dx=touch.clientX-gesture.x;
    gesture.dy=touch.clientY-gesture.y;
    if(Math.abs(gesture.dx)<12&&Math.abs(gesture.dy)<12)return;
    if(!gesture.horizontal){
      if(Math.abs(gesture.dy)>Math.abs(gesture.dx)*1.08){gesture.cancelled=true;return}
      if(Math.abs(gesture.dx)>Math.abs(gesture.dy)*1.12)gesture.horizontal=true;
    }
    if(gesture.horizontal)e.preventDefault();
  },{capture:true,passive:false});

  app.addEventListener('touchend',()=>{
    if(!gesture)return;
    const g=gesture;
    gesture=null;
    if(g.cancelled||!g.horizontal||Math.abs(g.dx)<58)return;
    suppressClickUntil=performance.now()+700;
    (g.dx<0?next:prev)?.click();
  },{capture:true,passive:true});

  app.addEventListener('touchcancel',()=>{gesture=null},{capture:true,passive:true});

  document.addEventListener('click',e=>{
    if(!e.isTrusted||performance.now()>=suppressClickUntil)return;
    if(!e.target.closest?.(suppressSelector))return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  },true);
})();
