(()=>{
  const app=document.getElementById('app');
  const stage=document.getElementById('stage');
  const modalBg=document.getElementById('modalBg');
  const modalPrev=document.getElementById('modalPrev');
  const modalNext=document.getElementById('modalNext');
  const eraPrev=document.getElementById('eraPrev');
  const eraNext=document.getElementById('eraNext');
  if(!stage)return;

  const hydrate=root=>{
    root.querySelectorAll?.('img.poster-deferred[data-src]').forEach(img=>{
      const src=img.dataset.src;
      if(!src)return;
      img.src=src;
      img.removeAttribute('data-src');
      img.classList.add('is-loaded');
    });
  };

  const fixRewatched=()=>{
    const screen=stage.querySelector('.era-screen[data-top-id="rewatched"]');
    if(!screen)return;
    const sections=[...screen.querySelectorAll('.sec')];
    const topSec=sections[0],fullSec=sections[1];
    if(!topSec||!fullSec)return;
    const rest=topSec.querySelector('.grid[data-flow="rest"]');
    const full=fullSec.querySelector('.full-grid');
    if(!rest||!full)return;
    [...full.querySelectorAll('.tile')].forEach(tile=>{
      const rank=Number(tile.dataset.r);
      if(rank>=26&&rank<=50)rest.appendChild(tile);
    });
    const ranks=[...full.querySelectorAll('.tile')].map(t=>Number(t.dataset.r)).filter(Number.isFinite);
    const range=fullSec.querySelector('.full-range');
    if(range&&ranks.length)range.textContent=`#${Math.min(...ranks)}–${Math.max(...ranks)}`;
  };

  const currentTopIndex=()=>{
    const id=stage.querySelector('.era-screen')?.dataset.topId;
    return Array.isArray(TOPS)?TOPS.findIndex(top=>top.id===id):-1;
  };

  const paintTransitionBackdrop=index=>{
    if(!app||!Array.isArray(TOPS)||index<0||index>=TOPS.length)return;
    const top=TOPS[index],hero=top.hero||{};
    const bg=top.theme?.bg||'#080a0b';
    app.style.backgroundColor=bg;
    if(hero.image){
      const src=new URL(hero.image,document.baseURI).href;
      app.style.backgroundImage=`linear-gradient(180deg,rgba(8,10,11,.08),rgba(8,10,11,.42)),url("${src}")`;
      app.style.backgroundSize='cover';
      app.style.backgroundPosition=hero.position||'center';
      app.style.backgroundRepeat='no-repeat';
    }else{
      app.style.backgroundImage='none';
    }
  };

  const paintNeighbor=dir=>{
    const i=currentTopIndex();
    if(i<0)return;
    paintTransitionBackdrop(Math.max(0,Math.min(TOPS.length-1,i+dir)));
  };

  const normalize=()=>{
    hydrate(stage);
    fixRewatched();
  };
  normalize();
  const observer=new MutationObserver(()=>requestAnimationFrame(normalize));
  observer.observe(stage,{childList:true,subtree:true});

  // Keep the target hero behind the active screen so route transitions reveal
  // the next visual world instead of the app's black canvas.
  eraPrev?.addEventListener('click',()=>paintNeighbor(-1),{capture:true});
  eraNext?.addEventListener('click',()=>paintNeighbor(1),{capture:true});

  let pointerStart=null;
  app?.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'||e.target.closest?.('button,a,input,textarea,select'))return;
    pointerStart={id:e.pointerId,x:e.clientX};
  },{capture:true,passive:true});
  app?.addEventListener('pointermove',e=>{
    if(!pointerStart||pointerStart.id!==e.pointerId)return;
    const dx=e.clientX-pointerStart.x;
    if(Math.abs(dx)>18)paintNeighbor(dx<0?1:-1);
  },{capture:true,passive:true});
  const clearPointer=()=>{pointerStart=null};
  app?.addEventListener('pointerup',clearPointer,{capture:true,passive:true});
  app?.addEventListener('pointercancel',clearPointer,{capture:true,passive:true});

  let modalAccum=0,pageAccum=0;
  let modalLockUntil=0;
  let modalQuiet=0,pageQuiet=0,snapBackTimer=0;
  let pageGestureLocked=false;

  const resetModalLater=()=>{
    clearTimeout(modalQuiet);
    modalQuiet=setTimeout(()=>{modalAccum=0},150);
  };
  const settlePageGesture=()=>{
    clearTimeout(pageQuiet);
    pageQuiet=setTimeout(()=>{
      const wasLocked=pageGestureLocked;
      pageAccum=0;
      pageGestureLocked=false;
      if(!wasLocked){
        stage.style.transition='transform .24s var(--ease)';
        stage.style.setProperty('--stage-x','0px');
        clearTimeout(snapBackTimer);
        snapBackTimer=setTimeout(()=>{stage.style.transition=''},260);
      }
      const i=currentTopIndex();
      if(i>=0)paintTransitionBackdrop(i);
    },560);
  };

  addEventListener('wheel',e=>{
    const dx=e.deltaX,dy=e.deltaY;
    const horizontal=Math.abs(dx)>=22&&Math.abs(dx)>Math.abs(dy)*1.25;
    if(!horizontal)return;

    const modalOpen=modalBg&&(modalBg.getAttribute('aria-hidden')==='false'||modalBg.classList.contains('open')||modalBg.classList.contains('is-open'));
    if(modalOpen){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      const now=performance.now();
      if(now<modalLockUntil)return;
      modalAccum+=dx;resetModalLater();
      if(Math.abs(modalAccum)<70)return;
      (modalAccum>0?modalNext:modalPrev)?.click();
      modalAccum=0;modalLockUntil=now+210;
      return;
    }

    if(!e.target.closest?.('.era-screen'))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();

    // Momentum events from one Mac trackpad gesture can outlive the route
    // animation. Lock until the wheel stream is actually quiet so inertia
    // cannot trigger a second, opposite navigation.
    settlePageGesture();
    if(pageGestureLocked)return;

    pageAccum+=dx;
    const dir=pageAccum>0?1:-1;
    paintNeighbor(dir);

    // Let the current Top physically follow the trackpad. The neighbor hero is
    // already painted behind it, so the revealed area never falls back to black.
    const atStart=currentTopIndex()===0&&pageAccum<0;
    const atEnd=currentTopIndex()===TOPS.length-1&&pageAccum>0;
    const edge=atStart||atEnd;
    const travel=-pageAccum*.32*(edge?.22:1);
    stage.style.transition='none';
    stage.style.setProperty('--stage-x',`${travel}px`);

    if(Math.abs(pageAccum)<220)return;

    pageAccum=0;
    pageGestureLocked=true;
    (dir>0?eraNext:eraPrev)?.click();
  },{capture:true,passive:false});
})();
