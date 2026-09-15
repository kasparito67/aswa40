(()=>{
  const mobile=matchMedia('(max-width:700px), (pointer:coarse)');
  if(!mobile.matches)return;

  const root=document.documentElement;
  const stage=document.getElementById('stage');
  const tops=typeof TOPS!=='undefined'&&Array.isArray(TOPS)?TOPS:[];

  // Warm every title-art asset before the user can swipe into a new Top.
  // Current + adjacent Tops get higher priority; the rest stay low priority.
  const routeId=decodeURIComponent((location.pathname.match(/^\/tops\/([^/]+)\/?$/)||[])[1]||'');
  let current=tops.findIndex(top=>top.id===routeId);
  if(current<0)current=0;
  const hot=new Set([current,current-1,current+1].filter(i=>i>=0&&i<tops.length));
  const seen=new Set();
  tops.forEach((top,i)=>{
    const src=top?.hero?.titleArt;
    if(!src)return;
    const href=new URL(src,document.baseURI).href;
    if(seen.has(href))return;
    seen.add(href);
    const link=document.createElement('link');
    link.rel='preload';
    link.as='image';
    link.href=href;
    link.fetchPriority=hot.has(i)?'high':'low';
    document.head.appendChild(link);
  });

  let revealed=false;
  const reveal=()=>{
    if(revealed)return;
    revealed=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('mobile-ui-ready')));
  };

  const check=()=>{
    const screen=stage?.querySelector('.era-screen.mobile-cinema-header');
    if(!screen)return false;
    const logo=screen.querySelector('.hero-title-art');
    if(logo&&!logo.complete){
      logo.addEventListener('load',reveal,{once:true});
      logo.addEventListener('error',reveal,{once:true});
    }else reveal();
    return true;
  };

  if(!check()&&stage){
    const observer=new MutationObserver(()=>{
      if(check())observer.disconnect();
    });
    observer.observe(stage,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }

  // Never leave navigation inaccessible if an image request stalls.
  setTimeout(reveal,2500);
})();
