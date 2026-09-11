(()=>{
  const app=document.getElementById('app');
  const stage=document.getElementById('stage');
  const prev=document.getElementById('eraPrev');
  const next=document.getElementById('eraNext');
  const modalBg=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
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

  // Arrow-only motion blur. Swipes remain crisp and track the finger 1:1.
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let arrowMotionTimer=0;
  const startArrowMotion=dir=>{
    if(!stage||reducedMotion.matches)return;
    stage.classList.remove('arrow-motion','arrow-motion-prev','arrow-motion-next');
    void stage.offsetWidth;
    stage.classList.add('arrow-motion',dir<0?'arrow-motion-prev':'arrow-motion-next');
    clearTimeout(arrowMotionTimer);
    arrowMotionTimer=setTimeout(()=>stage.classList.remove('arrow-motion','arrow-motion-prev','arrow-motion-next'),460);
  };
  prev?.addEventListener('click',()=>{if(!prev.disabled)startArrowMotion(-1)},true);
  next?.addEventListener('click',()=>{if(!next.disabled)startArrowMotion(1)},true);
  stage?.addEventListener('transitionend',e=>{
    if(e.target===stage&&e.propertyName==='transform'){
      clearTimeout(arrowMotionTimer);
      stage.classList.remove('arrow-motion','arrow-motion-prev','arrow-motion-next');
    }
  });

  // Desktop direct-manipulation adapter. The canonical pointer engine in app.js
  // already gives touch the right iOS-like behaviour. Trackpad input is translated
  // into the same pointer gesture so the screen follows the fingers instead of
  // acting like a threshold-triggered animation. Arrow clicks use that same engine.
  const desktopDirect=matchMedia('(hover:hover) and (pointer:fine)').matches&&typeof PointerEvent!=='undefined';
  if(desktopDirect){
    let syntheticId=7000;
    let wheelDrag=null;
    let wheelQuiet=0;

    const withSyntheticCaptureGuard=(el,fn)=>{
      if(!el)return;
      const hadOwn=Object.prototype.hasOwnProperty.call(el,'setPointerCapture');
      const ownValue=el.setPointerCapture;
      try{el.setPointerCapture=()=>{};fn()}
      finally{
        if(hadOwn)el.setPointerCapture=ownValue;
        else try{delete el.setPointerCapture}catch{}
      }
    };
    const pointer=(el,type,id,x,y)=>{
      const up=type==='pointerup'||type==='pointercancel';
      const ev=new PointerEvent(type,{bubbles:true,cancelable:true,composed:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons:up?0:1,pressure:up?0:.5});
      withSyntheticCaptureGuard(el,()=>el.dispatchEvent(ev));
    };
    const wheelPx=e=>{
      if(e.deltaMode===WheelEvent.DOM_DELTA_LINE)return e.deltaX*16;
      if(e.deltaMode===WheelEvent.DOM_DELTA_PAGE)return e.deltaX*Math.max(innerWidth,1);
      return e.deltaX;
    };
    const finishWheelDrag=()=>{
      clearTimeout(wheelQuiet);wheelQuiet=0;
      if(!wheelDrag)return;
      const g=wheelDrag;wheelDrag=null;
      pointer(g.el,'pointerup',g.id,g.startX+g.dx,g.y);
    };
    const beginWheelDrag=(el,kind)=>{
      if(wheelDrag&&wheelDrag.el!==el)finishWheelDrag();
      if(wheelDrag)return wheelDrag;
      const id=++syntheticId;
      const g={el,kind,id,startX:Math.max(80,innerWidth*.5),y:Math.max(80,innerHeight*.45),dx:0};
      wheelDrag=g;
      pointer(el,'pointerdown',id,g.startX,g.y);
      return g;
    };
    const feedWheelDrag=(el,kind,e)=>{
      const g=beginWheelDrag(el,kind);
      const multiplier=kind==='modal'?1.65:1;
      const limit=kind==='modal'?Math.max(180,innerWidth*.42):Math.max(320,innerWidth*.94);
      g.dx=Math.max(-limit,Math.min(limit,g.dx-wheelPx(e)*multiplier));
      pointer(el,'pointermove',g.id,g.startX+g.dx,g.y);
      clearTimeout(wheelQuiet);
      wheelQuiet=setTimeout(finishWheelDrag,110);
    };

    addEventListener('wheel',e=>{
      const ax=Math.abs(e.deltaX),ay=Math.abs(e.deltaY);
      if(ax<2||ax<ay*.9)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if(modalBg?.classList.contains('open')){
        if(modal)feedWheelDrag(modal,'modal',e);
      }else{
        feedWheelDrag(app,'page',e);
      }
    },{passive:false,capture:true});

    const animateArrowDrag=dir=>{
      finishWheelDrag();
      if(stage?.classList.contains('is-transitioning'))return;
      const id=++syntheticId,startX=Math.max(100,innerWidth*.5),y=Math.max(80,innerHeight*.42);
      const distance=Math.max(240,innerWidth*.56);
      const duration=reducedMotion.matches?0:240;
      pointer(app,'pointerdown',id,startX,y);
      if(!duration){
        pointer(app,'pointermove',id,startX-dir*distance,y);
        pointer(app,'pointerup',id,startX-dir*distance,y);
        return;
      }
      const started=performance.now();
      const frame=now=>{
        const p=Math.min(1,(now-started)/duration);
        const eased=1-Math.pow(1-p,3);
        const x=startX-dir*distance*eased;
        pointer(app,'pointermove',id,x,y);
        if(p<1)requestAnimationFrame(frame);
        else pointer(app,'pointerup',id,x,y);
      };
      requestAnimationFrame(frame);
    };
    const bindArrow=(button,dir)=>button?.addEventListener('click',e=>{
      if(button.disabled||stage?.classList.contains('is-transitioning'))return;
      e.preventDefault();
      e.stopImmediatePropagation();
      animateArrowDrag(dir);
    },true);
    bindArrow(prev,-1);
    bindArrow(next,1);
  }

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