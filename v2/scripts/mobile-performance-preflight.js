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

  // Three legacy Documentaires ghost entries referenced local files that do not exist.
  // Use their known TMDB poster identities instead, avoiding three guaranteed 404s.
  const docs=TOPS.find(top=>top.id==='documentaires');
  const docGhostPaths=['/yvwF7dfSCybFcBOklUzKpE46bHM.jpg','/toJRzlXOSZYWW5IUk7DrZJv7kHF.jpg','/jb6o66HE1duy0L7MJzEZXvrrsux.jpg'];
  (docs?.ghosts||[]).slice(0,3).forEach((g,i)=>{if(g&&docGhostPaths[i])g.img=`https://image.tmdb.org/t/p/w500${docGhostPaths[i]}`});

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
