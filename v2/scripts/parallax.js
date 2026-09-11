(()=>{
  const stage=document.getElementById('stage');
  if(!stage)return;

  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:700px)').matches||matchMedia('(pointer:coarse)').matches;

  // Mobile keeps the horizontal spatial transition but skips continuous parallax.
  // CSS defaults already hold all offsets at zero, so no style writes are needed here.
  if(mobile)return;

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
    const bgY=clamp(sy*.22,0,150);
    const titleY=clamp(sy*.10,0,78);
    const bgX=clamp(-side*.060,-72,72);
    const titleX=clamp(-side*.032,-42,42);
    const contentX=clamp(-side*.012,-18,18);

    screen.style.setProperty('--px-bg-x',`${bgX.toFixed(2)}px`);
    screen.style.setProperty('--px-bg-y',`${bgY.toFixed(2)}px`);
    screen.style.setProperty('--px-title-x',`${titleX.toFixed(2)}px`);
    screen.style.setProperty('--px-title-y',`${titleY.toFixed(2)}px`);
    screen.style.setProperty('--px-content-x',`${contentX.toFixed(2)}px`);
  }

  const screens=()=>stage.querySelectorAll('.era-screen');
  const updateAll=()=>screens().forEach(updateScreen);

  function tick(now){
    updateAll();
    if(now<until){
      raf=requestAnimationFrame(tick);
    }else{
      raf=0;
      stage.classList.remove('parallax-active');
    }
  }

  function burst(ms=620){
    until=Math.max(until,performance.now()+ms);
    stage.classList.add('parallax-active');
    if(!raf)raf=requestAnimationFrame(tick);
  }

  function bindScroll(){
    screens().forEach(screen=>{
      if(screen.dataset.parallaxBound)return;
      screen.dataset.parallaxBound='1';
      screen.addEventListener('scroll',()=>updateScreen(screen),{passive:true});
    });
  }

  // Observe only stage transform/style changes. Do not observe class mutations here:
  // burst() owns the `parallax-active` class, and observing that class creates a
  // self-sustaining MutationObserver -> burst -> class mutation loop on desktop.
  const stageObserver=new MutationObserver(()=>burst(620));
  stageObserver.observe(stage,{attributes:true,attributeFilter:['style']});
  const childObserver=new MutationObserver(()=>{bindScroll();burst(100)});
  childObserver.observe(stage,{childList:true});

  addEventListener('resize',()=>burst(180),{passive:true});
  addEventListener('orientationchange',()=>burst(300),{passive:true});
  stage.addEventListener('pointerdown',()=>burst(760),{passive:true});
  stage.addEventListener('pointermove',()=>{if(stage.classList.contains('dragging'))burst(140)},{passive:true});
  stage.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)*.6)burst(760)},{passive:true});
  // The native desktop carousel moves by scrollLeft, not by stage style mutations.
  // Listen to the rail itself so arrow/menu smooth scrolling cannot leave stale
  // horizontal parallax offsets after a programmatic navigation.
  stage.addEventListener('scroll',()=>burst(140),{passive:true});

  reduced.addEventListener?.('change',()=>burst(100));
  bindScroll();
  burst(100);
})();