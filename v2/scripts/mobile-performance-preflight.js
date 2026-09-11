(()=>{
  const mobile=matchMedia('(max-width:700px), (pointer:coarse)');
  if(!mobile.matches||typeof TOPS==='undefined'||!Array.isArray(TOPS))return;

  const blank='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  const heroImages={};
  const dpr=Math.min(Number(devicePixelRatio)||1,2);
  const backdropSize=innerWidth*dpr>900?'w1280':'w780';
  const posterSize='w342';
  const tmdb=(src,size)=>String(src||'').replace(/\/t\/p\/(?:original|w\d+)\//,`/t/p/${size}/`);
  const poster=src=>String(src||'').includes('image.tmdb.org/t/p/')?tmdb(src,posterSize):src;

  TOPS.forEach(top=>{
    if(top?.hero?.image){heroImages[top.id]=top.hero.image;top.hero.image=blank}
    (top?.films||[]).forEach(f=>{if(f?.img)f.img=poster(f.img)});
    (top?.ghosts||[]).forEach(g=>{if(g?.img)g.img=poster(g.img)});
    (top?.sidebar||[]).forEach(item=>{
      (item?.entries||[]).forEach(entry=>{if(entry&&typeof entry==='object'&&entry.img)entry.img=poster(entry.img)});
    });
  });

  window.__ASWA40_MOBILE_PERF__={blank,heroImages,backdropSize,posterSize,tmdb};
  document.documentElement.classList.add('mobile-performance');
})();
