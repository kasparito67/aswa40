(()=>{
  if(typeof TOPS==='undefined'||!Array.isArray(TOPS))return;
  const top=TOPS.find(t=>t.id==='films-troublants');if(!top)return;

  const isPlaceholder=src=>/^data:image\/svg\+xml/i.test(String(src||''));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const cacheKey='aswa40-disturbing-posters-v1';
  let cache={};try{cache=JSON.parse(localStorage.getItem(cacheKey)||'{}')||{}}catch{}
  const save=()=>{try{localStorage.setItem(cacheKey,JSON.stringify(cache))}catch{}};
  const enc=s=>encodeURIComponent(String(s||''));
  const portrait=thumb=>Boolean(thumb?.source)&&Number(thumb.height||0)>Number(thumb.width||0)*1.12;

  const pageTitleOverrides={
    'Requiem for a Dream':'Requiem for a Dream',
    'Se7en':'Seven (1995 film)',
    'The Blair Witch Project':'The Blair Witch Project',
    'Incendies':'Incendies',
    'Oldboy':'Oldboy (2003 film)',
    'Hereditary':'Hereditary (film)',
    "Jacob's Ladder":"Jacob's Ladder (1990 film)",
    "Pan's Labyrinth":"Pan's Labyrinth",
    'Funny Games':'Funny Games (1997 film)',
    'Happiness':'Happiness (1998 film)',
    'Salò, or the 120 Days of Sodom':'Salò, or the 120 Days of Sodom',
    'La Haine':'La Haine',
    'Come and See':'Come and See',
    'Planet of the Apes':'Planet of the Apes (1968 film)',
    'The Stuff':'The Stuff',
    'The Piano Teacher':'The Piano Teacher (film)',
    'The Sixth Sense':'The Sixth Sense',
    'Birth':'Birth (2004 film)',
    'The Vanishing':'The Vanishing (1988 film)',
    'The Celebration':'Festen',
    'Beau Is Afraid':'Beau Is Afraid',
    'Grizzly Man':'Grizzly Man',
    'Irreversible':'Irréversible',
    'Alive':'Alive (1993 film)',
    'Fight Club':'Fight Club',
    'Outbreak':'Outbreak (film)',
    'The Mist':'The Mist (film)',
    'The Zone of Interest':'The Zone of Interest (film)',
    'American History X':'American History X',
    'Dancer in the Dark':'Dancer in the Dark',
    'Arlington Road':'Arlington Road',
    'I Spit on Your Grave':'I Spit on Your Grave',
    'Men':'Men (2022 film)',
    'Lost Highway':'Lost Highway (film)',
    'The Others':'The Others (2001 film)',
    'The Witch':'The Witch (2015 film)',
    'Aftersun':'Aftersun',
    'Captain Phillips':'Captain Phillips (film)',
    'Raw':'Raw (film)',
    'Saw':'Saw (2004 film)',
    'The Dog Who Stopped the War':'The Dog Who Stopped the War',
    'We Need to Talk About Kevin':'We Need to Talk About Kevin (film)',
    'The Act of Killing':'The Act of Killing',
    'Threads':'Threads (1984 film)',
    'Caché':'Caché (film)',
    'Dogville':'Dogville'
  };

  async function fetchExactArticle(title){
    const url=`https://en.wikipedia.org/w/api.php?action=query&redirects=1&titles=${enc(title)}&prop=revisions|pageimages&rvprop=content&rvslots=main&piprop=thumbnail|name&pithumbsize=700&formatversion=2&format=json&origin=*`;
    try{
      const res=await fetch(url,{mode:'cors',credentials:'omit'});if(!res.ok)return null;
      const page=(await res.json())?.query?.pages?.[0];
      if(!page||page.missing)return null;
      return page;
    }catch{return null}
  }

  const infoboxPosterUrl=page=>{
    const text=page?.revisions?.[0]?.slots?.main?.content||'';
    const m=text.match(/^\|\s*image\s*=\s*(?:\[\[File:)?([^|\]\n]+?)(?:\]\])?\s*$/im);
    if(!m)return '';
    const filename=m[1].trim().replace(/^File:/i,'');
    if(!filename||/\.svg$/i.test(filename))return '';
    return `https://en.wikipedia.org/wiki/Special:Redirect/file/${enc(filename.replace(/ /g,'_'))}?width=700`;
  };

  async function resolvePoster(item){
    const key=norm(item.title);if(cache[key])return cache[key];
    const candidates=[pageTitleOverrides[item.title],`${item.title} (film)`,item.title].filter(Boolean);
    for(const title of [...new Set(candidates)]){
      const page=await fetchExactArticle(title);if(!page)continue;
      const infobox=infoboxPosterUrl(page);
      if(infobox){cache[key]=infobox;save();return infobox}
      if(portrait(page.thumbnail)){cache[key]=page.thumbnail.source;save();return page.thumbnail.source}
    }
    return '';
  }

  function updateFilmDom(film){
    const rank=String(film.rank);
    document.querySelectorAll(`.era-screen[data-top-id="films-troublants"] [data-r="${CSS.escape(rank)}"] img`).forEach(img=>{
      if(isPlaceholder(img.currentSrc||img.src)||img.classList.contains('poster-deferred')){
        img.classList.remove('poster-deferred');img.removeAttribute('data-src');img.src=film.img;
      }
    });
    film.backdrop=film.img;
    document.querySelectorAll(`.era-screen[data-top-id="films-troublants"] [data-header-media-key="films-troublants:${CSS.escape(rank)}"] img`).forEach(img=>{img.src=film.img});
    if(Number(film.rank)===1){
      top.hero.image=film.img;
      document.querySelectorAll('.era-screen[data-top-id="films-troublants"] .hero-media').forEach(img=>{img.src=film.img});
    }
  }

  function updateGhostDom(index,ghost){
    document.querySelectorAll(`.era-screen[data-top-id="films-troublants"] .ghost-card[data-ghost="${index}"] img`).forEach(img=>{
      if(isPlaceholder(img.currentSrc||img.src))img.src=ghost.img;
    });
  }

  const primary=[],secondary=[];
  (top.films||[]).forEach(f=>{
    if(!isPlaceholder(f.img))return;
    (Number(f.rank)<=11?primary:secondary).push({kind:'film',item:f});
  });
  (top.ghosts||[]).forEach((g,index)=>{if(isPlaceholder(g.img))primary.push({kind:'ghost',item:g,index})});

  const runQueue=async queue=>{
    const worker=async()=>{while(queue.length){
      const job=queue.shift(),poster=await resolvePoster(job.item);if(!poster)continue;
      job.item.img=poster;
      if(job.kind==='film')updateFilmDom(job.item);else updateGhostDom(job.index,job.item);
    }};
    await Promise.all(Array.from({length:Math.min(4,queue.length)},worker));
  };

  const start=async()=>{await runQueue(primary);if(secondary.length)setTimeout(()=>runQueue(secondary),600)};
  if('requestIdleCallback' in window)requestIdleCallback(start,{timeout:500});else setTimeout(start,80);

  new MutationObserver(()=>{
    (top.films||[]).forEach(f=>{if(!isPlaceholder(f.img))updateFilmDom(f)});
    (top.ghosts||[]).forEach((g,i)=>{if(!isPlaceholder(g.img))updateGhostDom(i,g)});
  }).observe(document.getElementById('stage')||document.body,{childList:true,subtree:true});
})();