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
  let railFrame=0;
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

  const screens=()=>[...stage.querySelectorAll('.era-screen')];

  // During horizontal navigation only the visible page and its immediate neighbours
  // can contribute to the frame. Updating all seven Tops every animation frame made
  // the native trackpad rail feel heavier than the browser's actual scroll physics.
  function updateNearby(){
    const list=screens();
    if(!list.length)return;
    const vw=Math.max(innerWidth,1);
    const center=Math.round((stage.scrollLeft||0)/vw);
    const from=Math.max(0,center-1),to=Math.min(list.length-1,center+1);
    for(let i=from;i<=to;i++)updateScreen(list[i]);
  }

  function tick(now){
    updateNearby();
    if(now<until){
      raf=requestAnimationFrame(tick);
    }else{
      raf=0;
      stage.classList.remove('parallax-active');
    }
  }

  function burst(ms=180){
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

  // Native rail scroll is already frame-synchronised by the browser. Mirror it with
  // one visual update per animation frame instead of extending a long-running RAF
  // burst on every wheel/scroll event.
  stage.addEventListener('scroll',()=>{
    if(railFrame)return;
    railFrame=requestAnimationFrame(()=>{
      railFrame=0;
      updateNearby();
    });
  },{passive:true});

  // Keep these observers for renderer changes and resize settling, but use short
  // bursts only. Programmatic smooth scroll also emits the rail scroll event above.
  const stageObserver=new MutationObserver(()=>burst(120));
  stageObserver.observe(stage,{attributes:true,attributeFilter:['style']});
  const childObserver=new MutationObserver(()=>{bindScroll();burst(100)});
  childObserver.observe(stage,{childList:true});

  addEventListener('resize',()=>burst(120),{passive:true});
  addEventListener('orientationchange',()=>burst(180),{passive:true});
  reduced.addEventListener?.('change',()=>burst(100));

  bindScroll();
  updateNearby();
})();