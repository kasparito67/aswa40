(()=>{
  const app=document.getElementById('app');
  const modalBg=document.getElementById('modalBg');
  const modalRank=document.getElementById('modalRank');
  const modalBody=document.getElementById('modalBody');
  const prev=document.getElementById('eraPrev');
  const next=document.getElementById('eraNext');
  if(!app)return;

  // OVNI editorial notes belong in the film detail card, not on touch tiles.
  // The canonical renderer already owns the desktop hover copy. This small bridge
  // mirrors the same note inside the clickable detail view for every Top.
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
