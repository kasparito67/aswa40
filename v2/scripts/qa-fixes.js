(()=>{
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

  const normalize=()=>{hydrate(stage);fixRewatched()};
  normalize();
  const observer=new MutationObserver(()=>requestAnimationFrame(normalize));
  observer.observe(stage,{childList:true,subtree:true});

  let modalAccum=0,pageAccum=0;
  let modalLockUntil=0,pageLockUntil=0;
  let modalQuiet=0,pageQuiet=0;
  const resetLater=(kind)=>{
    clearTimeout(kind==='modal'?modalQuiet:pageQuiet);
    const id=setTimeout(()=>{if(kind==='modal')modalAccum=0;else pageAccum=0},150);
    if(kind==='modal')modalQuiet=id;else pageQuiet=id;
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
      modalAccum+=dx;resetLater('modal');
      if(Math.abs(modalAccum)<70)return;
      (modalAccum>0?modalNext:modalPrev)?.click();
      modalAccum=0;modalLockUntil=now+210;
      return;
    }

    if(!e.target.closest?.('.era-screen'))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const now=performance.now();
    if(now<pageLockUntil)return;
    pageAccum+=dx;resetLater('page');
    if(Math.abs(pageAccum)<220)return;
    (pageAccum>0?eraNext:eraPrev)?.click();
    pageAccum=0;pageLockUntil=now+680;
  },{capture:true,passive:false});
})();
