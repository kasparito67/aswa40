(()=>{
  const app=document.getElementById('app');
  const stage=document.getElementById('stage');
  const prev=document.getElementById('eraPrev');
  const next=document.getElementById('eraNext');
  const modalBg=document.getElementById('modalBg');
  const modalRank=document.getElementById('modalRank');
  const modalBody=document.getElementById('modalBody');
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

  // Perceived-instant loading: keep the first paint light, then warm only the most
  // likely secondary posters once the browser is idle. This preserves lazy loading
  // while making the next opened section feel immediate.
  const idle=cb=>('requestIdleCallback' in window?requestIdleCallback(cb,{timeout:1200}):setTimeout(cb,180));
  const warmedSecondary=new Set();
  const warmers=new Set();
  const warmImage=src=>{
    if(!src)return;
    const img=new Image();
    warmers.add(img);
    img.decoding='async';
    img.fetchPriority='low';
    const release=()=>warmers.delete(img);
    img.onload=release;img.onerror=release;img.src=src;
    img.decode?.().catch(()=>{});
  };
  const likelySecondarySources=top=>{
    if(!top)return [];
    const out=[];
    const full=(top.sections||[]).find(s=>s.kind==='full');
    if(full){
      const start=Math.max(0,(Number(full.start)||1)-1);
      out.push(...(top.films||[]).slice(start,start+6).map(f=>f.img));
    }
    out.push(...(top.ghosts||[]).slice(0,3).map(g=>g.img));
    const bottom=(top.sections||[]).find(s=>s.kind==='bottom');
    if(bottom){
      const ranks=(top.ovnis?.ranks||[]).slice(0,3).map(Number);
      ranks.forEach(r=>{const f=(top.films||[]).find(x=>Number(x.rank)===r);if(f?.img)out.push(f.img)});
    }
    return [...new Set(out.filter(Boolean))];
  };
  const warmLikelySecondary=()=>{
    const top=currentTop();
    if(!top||warmedSecondary.has(top.id))return;
    const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    if(connection?.saveData)return;
    warmedSecondary.add(top.id);
    const slow=/2g/.test(String(connection?.effectiveType||''));
    const mobile=matchMedia('(max-width:700px)').matches||matchMedia('(pointer:coarse)').matches;
    const budget=slow?4:(mobile?10:14);
    likelySecondarySources(top).slice(0,budget).forEach(warmImage);
  };
  requestAnimationFrame(()=>idle(warmLikelySecondary));
  stage?.addEventListener('transitionend',e=>{
    if(e.target===stage&&e.propertyName==='transform')idle(warmLikelySecondary);
  });

  // Arrow-only motion blur. Trackpad and touch swipes remain crisp and are owned
  // entirely by the canonical gesture engine in app.js.
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let arrowMotionTimer=0;
  const startArrowMotion=()=>{
    if(!stage||reducedMotion.matches)return;
    stage.classList.remove('arrow-motion');
    void stage.offsetWidth;
    stage.classList.add('arrow-motion');
    clearTimeout(arrowMotionTimer);
    arrowMotionTimer=setTimeout(()=>stage.classList.remove('arrow-motion'),460);
  };
  prev?.addEventListener('click',()=>{if(!prev.disabled)startArrowMotion()},true);
  next?.addEventListener('click',()=>{if(!next.disabled)startArrowMotion()},true);
  stage?.addEventListener('transitionend',e=>{
    if(e.target===stage&&e.propertyName==='transform'){
      clearTimeout(arrowMotionTimer);
      stage.classList.remove('arrow-motion');
    }
  });

  // IMPORTANT: there is intentionally no separate desktop wheel-to-pointer adapter
  // here anymore. app.js is now the single owner of trackpad, touch, arrows and film
  // card navigation. Two competing gesture engines were the source of intermittent
  // locks, direction reversals and visible frame flashes on desktop.

  // Mobile stability guards only. The canonical carousel in app.js owns the
  // complete touch gesture, including direct 1:1 drag over interactive cards.
  const touchDevice=matchMedia('(pointer:coarse)').matches||('ontouchstart' in window);
  if(!touchDevice)return;
  const stageTransitioning=()=>stage&&(stage.children.length>1||stage.style.width==='200vw');

  // Android browser chrome can emit resize while a horizontal navigation is in
  // flight. Never let that transient resize cancel an active page transition.
  addEventListener('resize',e=>{
    if(stageTransitioning())e.stopImmediatePropagation();
  },{capture:true});

  // At rest there must be no latent CSS transition. This prevents the compositor
  // from animating the ±100vw -> 0 reset after the committed page is isolated.
  if(stage){
    const stabilize=()=>{
      if(stage.children.length===1&&stage.style.width==='100vw'&&stage.style.transition!=='none'){
        stage.style.transition='none';
        stage.style.willChange='auto';
      }
    };
    new MutationObserver(()=>queueMicrotask(stabilize)).observe(stage,{attributes:true,childList:true,attributeFilter:['style']});
  }
})();