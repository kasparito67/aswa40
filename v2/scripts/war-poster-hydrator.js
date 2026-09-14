(()=>{
  if(typeof TOPS==='undefined'||!Array.isArray(TOPS))return;
  const top=TOPS.find(t=>t.id==='films-de-guerre');
  if(!top)return;

  const isPlaceholder=src=>/^data:image\/svg\+xml/i.test(String(src||''));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const cacheKey='aswa40-war-posters-v1';
  let cache={};
  try{cache=JSON.parse(localStorage.getItem(cacheKey)||'{}')||{}}catch{}

  const save=()=>{try{localStorage.setItem(cacheKey,JSON.stringify(cache))}catch{}};
  const esc=s=>encodeURIComponent(String(s||''));

  async function resolvePoster(item){
    const key=`${norm(item.title)}:${item.year||''}`;
    if(cache[key])return cache[key];
    const q=`\"${item.title}\" ${item.year||''} film`;
    const url=`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${esc(q)}&gsrlimit=4&gsrnamespace=0&prop=pageimages&piprop=thumbnail&pithumbsize=700&format=json&origin=*`;
    try{
      const res=await fetch(url,{mode:'cors',credentials:'omit'});
      if(!res.ok)return '';
      const data=await res.json();
      const pages=Object.values(data?.query?.pages||{}).filter(p=>p?.thumbnail?.source);
      if(!pages.length)return '';
      const titleNorm=norm(item.title);
      pages.sort((a,b)=>{
        const score=p=>{
          const n=norm(p.title);let s=0;
          if(n===titleNorm)s+=100;
          if(n.startsWith(titleNorm))s+=60;
          if(n.includes(titleNorm))s+=35;
          if(/film/.test(n))s+=8;
          if(item.year&&n.includes(String(item.year)))s+=12;
          return s;
        };
        return score(b)-score(a);
      });
      const poster=pages[0]?.thumbnail?.source||'';
      if(poster){cache[key]=poster;save()}
      return poster;
    }catch{return ''}
  }

  function updateFilmDom(film){
    const rank=String(film.rank);
    document.querySelectorAll(`.era-screen[data-top-id="films-de-guerre"] [data-r="${CSS.escape(rank)}"] img`).forEach(img=>{
      if(isPlaceholder(img.currentSrc||img.src)||img.classList.contains('poster-deferred')){
        img.classList.remove('poster-deferred');
        img.removeAttribute('data-src');
        img.src=film.img;
      }
    });
  }

  function updateGhostDom(index,ghost){
    document.querySelectorAll(`.era-screen[data-top-id="films-de-guerre"] .ghost-card[data-ghost="${index}"] img`).forEach(img=>{
      if(isPlaceholder(img.currentSrc||img.src))img.src=ghost.img;
    });
  }

  const queue=[];
  (top.films||[]).forEach(f=>{if(isPlaceholder(f.img))queue.push({kind:'film',item:f})});
  (top.ghosts||[]).forEach((g,index)=>{if(isPlaceholder(g.img))queue.push({kind:'ghost',item:g,index})});
  if(!queue.length)return;

  // Hydrate progressively after first paint so the Top remains immediately usable.
  const worker=async()=>{
    while(queue.length){
      const job=queue.shift();
      const poster=await resolvePoster(job.item);
      if(!poster)continue;
      job.item.img=poster;
      if(job.kind==='film')updateFilmDom(job.item);else updateGhostDom(job.index,job.item);
    }
  };
  const start=()=>Promise.all(Array.from({length:Math.min(6,queue.length)},worker));
  if('requestIdleCallback' in window)requestIdleCallback(start,{timeout:650});else setTimeout(start,120);

  // Sections #26–60 are rendered lazily. Re-apply resolved images when their cards appear.
  new MutationObserver(()=>{
    (top.films||[]).forEach(f=>{if(!isPlaceholder(f.img))updateFilmDom(f)});
    (top.ghosts||[]).forEach((g,i)=>{if(!isPlaceholder(g.img))updateGhostDom(i,g)});
  }).observe(document.getElementById('stage')||document.body,{childList:true,subtree:true});
})();
