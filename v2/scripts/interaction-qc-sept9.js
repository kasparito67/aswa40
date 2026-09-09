(()=>{
  const stage=document.getElementById('stage');
  const app=document.getElementById('app');
  const modalBg=document.getElementById('modalBg');
  const next=document.getElementById('eraNext');
  const prev=document.getElementById('eraPrev');

  // Hydrate every initially rendered deferred poster, not only the first full grid.
  document.querySelectorAll('.poster-deferred[data-src]').forEach(img=>{
    img.src=img.dataset.src;
    img.addEventListener('load',()=>img.classList.add('is-loaded'),{once:true});
    delete img.dataset.src;
  });

  // Re.Watched: keep the already-bound Top 50 buttons, but present them like the other Tops.
  const re=document.querySelector('.era-screen[data-top-id="rewatched"]');
  if(re){
    const first=re.querySelector('.sec[data-kind="full"]');
    const grid=first?.querySelector('.full-grid');
    if(grid){
      const tiles=[...grid.querySelectorAll('.tile')];
      const hero=document.createElement('div'); hero.className='heroTop coverflow'; hero.dataset.flow='hero';
      tiles.slice(0,5).forEach(t=>hero.appendChild(t));
      const rest=document.createElement('div'); rest.className='grid coverflow'; rest.dataset.flow='rest';
      tiles.slice(5,50).forEach(t=>rest.appendChild(t));
      const pad=first.querySelector('.pad');
      if(pad){ pad.innerHTML=''; pad.append(hero,rest); }
    }
  }

  let pageSum=0,pageLock=false,pageTimer=null;
  let modalSum=0,modalLock=false,modalTimer=null;
  const horizontal=e=>Math.abs(e.deltaX)>Math.abs(e.deltaY)*1.35;

  // Intercept horizontal wheel before the legacy listeners. Higher threshold = calmer page switching.
  window.addEventListener('wheel',e=>{
    if(!horizontal(e))return;
    if(modalBg?.classList.contains('open')){
      e.preventDefault(); e.stopImmediatePropagation();
      if(modalLock)return;
      modalSum+=e.deltaX;
      if(Math.abs(modalSum)>=78){
        const button=modalSum>0?document.getElementById('modalNext'):document.getElementById('modalPrev');
        modalSum=0; modalLock=true; button?.click();
        clearTimeout(modalTimer); modalTimer=setTimeout(()=>{modalLock=false;modalSum=0},330);
      }
      return;
    }
    e.preventDefault(); e.stopImmediatePropagation();
    if(pageLock)return;
    pageSum+=e.deltaX;
    clearTimeout(pageTimer);
    pageTimer=setTimeout(()=>{pageSum=0},180);
    if(Math.abs(pageSum)>=260){
      const button=pageSum>0?next:prev;
      pageSum=0; pageLock=true; button?.click();
      setTimeout(()=>{pageLock=false},620);
    }
  },{passive:false,capture:true});
})();
