(()=>{
  const screen=document.querySelector('.era-screen[data-top-id="2000-2024"]');
  if(!screen)return;
  screen.classList.add('legacy-2000-parity');

  /* Header metadata parity only. Title artwork and sidebar now render directly from shared data/renderers. */
  const nav=screen.querySelector('.hero-nav');
  if(nav)nav.innerHTML='<span>Aimer Star Wars à 40 ans</span><span>Une communauté de 9 cinéphiles <small class="build-version" aria-label="Version 0.9.9">v0.9.9</small></span>';

  /* Legacy modal wheel behavior remains temporarily until Phase 3 consolidates all film-detail handlers. */
  const mb=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const prev=document.getElementById('modalPrev');
  const next=document.getElementById('modalNext');
  let sum=0,timer=null,busy=false;
  const reset=()=>{sum=0;clearTimeout(timer);timer=null};
  const step=dir=>{if(busy)return;busy=true;(dir>0?next:prev)?.click();setTimeout(()=>busy=false,230)};
  if(modal){
    modal.addEventListener('wheel',e=>{
      if(!mb?.classList.contains('open'))return;
      if(Math.abs(e.deltaX)<Math.abs(e.deltaY)*.72)return;
      sum+=e.deltaX;
      clearTimeout(timer);timer=setTimeout(reset,160);
      if(Math.abs(sum)>72){const dir=sum>0?1:-1;reset();step(dir)}
      e.preventDefault();e.stopPropagation();
    },{passive:false,capture:true});
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('.tile')&&mb){requestAnimationFrame(()=>document.getElementById('modalClose')?.focus({preventScroll:true}))}
  },true);
})();
