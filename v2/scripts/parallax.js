(()=>{
  const stage=document.getElementById('stage');
  if(!stage)return;

  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0;
  let until=0;

  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

  function updateScreen(screen){
    if(reduced.matches){
      screen.style.setProperty('--px-bg-x','0px');
      screen.style.setProperty('--px-bg-y','0px');
      screen.style.setProperty('--px-title-x','0px');
      screen.style.setProperty('--px-title-y','0px');
      screen.style.setProperty('--px-content-x','0px');
      return;
    }

    const vw=Math.max(innerWidth,1);
    const rect=screen.getBoundingClientRect();
    const side=clamp(rect.left,-vw*1.1,vw*1.1);
    const sy=screen.scrollTop||0;

    /* Vertical depth: background lags most, title less, sections remain the reference plane. */
    const bgY=clamp(sy*.22,0,150);
    const titleY=clamp(sy*.10,0,78);

    /* Horizontal depth: each layer moves at a slightly different rate during stage translation. */
    const bgX=clamp(-side*.060,-72,72);
    const titleX=clamp(-side*.032,-42,42);
    const contentX=clamp(-side*.012,-18,18);

    screen.style.setProperty('--px-bg-x',`${bgX.toFixed(2)}px`);
    screen.style.setProperty('--px-bg-y',`${bgY.toFixed(2)}px`);
    screen.style.setProperty('--px-title-x',`${titleX.toFixed(2)}px`);
    screen.style.setProperty('--px-title-y',`${titleY.toFixed(2)}px`);
    screen.style.setProperty('--px-content-x',`${contentX.toFixed(2)}px`);
  }

  function screens(){return stage.querySelectorAll('.era-screen')}
  function updateAll(){screens().forEach(updateScreen)}

  function tick(now){
    updateAll();
    if(now<until){raf=requestAnimationFrame(tick)}else{raf=0}
  }
  function burst(ms=760){
    until=Math.max(until,performance.now()+ms);
    if(!raf)raf=requestAnimationFrame(tick);
  }

  function bindScroll(){
    screens().forEach(screen=>{
      if(screen.dataset.parallaxBound)return;
      screen.dataset.parallaxBound='1';
      screen.addEventListener('scroll',()=>updateScreen(screen),{passive:true});
    });
  }

  /* The stage style changes continuously during drag and once at snap; observe it so CSS transitions keep their depth. */
  const stageObserver=new MutationObserver(()=>burst(820));
  stageObserver.observe(stage,{attributes:true,attributeFilter:['style','class']});

  /* App.js renders synchronously before this file, but this also keeps the layer safe if screens are regenerated later. */
  const childObserver=new MutationObserver(()=>{bindScroll();burst(100)});
  childObserver.observe(stage,{childList:true});

  addEventListener('resize',()=>burst(220),{passive:true});
  addEventListener('orientationchange',()=>burst(350),{passive:true});
  stage.addEventListener('pointerdown',()=>burst(900),{passive:true});
  stage.addEventListener('pointermove',()=>{if(stage.classList.contains('dragging'))burst(180)},{passive:true});
  stage.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)*.6)burst(900)},{passive:true});

  reduced.addEventListener?.('change',()=>burst(100));
  bindScroll();
  burst(120);
})();
