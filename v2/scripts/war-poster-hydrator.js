(()=>{
  if(typeof TOPS==='undefined'||!Array.isArray(TOPS))return;
  const top=TOPS.find(t=>t.id==='films-de-guerre');if(!top)return;

  const isPlaceholder=src=>/^data:image\/svg\+xml/i.test(String(src||''));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const cacheKey='aswa40-war-posters-v3';
  let cache={};try{cache=JSON.parse(localStorage.getItem(cacheKey)||'{}')||{}}catch{}
  const save=()=>{try{localStorage.setItem(cacheKey,JSON.stringify(cache))}catch{}};
  const enc=s=>encodeURIComponent(String(s||''));
  const portrait=thumb=>Boolean(thumb?.source)&&Number(thumb.height||0)>Number(thumb.width||0)*1.12;

  const pageTitleOverrides={
    'Full Metal Jacket':'Full Metal Jacket','Apocalypse Now':'Apocalypse Now','Saving Private Ryan':'Saving Private Ryan','The Thin Red Line':'The Thin Red Line (1998 film)','Inglourious Basterds':'Inglourious Basterds',
    "Schindler's List":"Schindler's List",'Dunkirk':'Dunkirk (2017 film)','Braveheart':'Braveheart','The Bridge on the River Kwai':'The Bridge on the River Kwai','Lawrence of Arabia':'Lawrence of Arabia (film)',
    'Das Boot':'Das Boot','Life Is Beautiful':'Life Is Beautiful','Barry Lyndon':'Barry Lyndon','Downfall':'Downfall (2004 film)','Platoon':'Platoon (film)','Paths of Glory':'Paths of Glory','The Last of the Mohicans':'The Last of the Mohicans (1992 film)','The Pianist':'The Pianist (2002 film)','The Hurt Locker':'The Hurt Locker','Zero Dark Thirty':'Zero Dark Thirty','Black Hawk Down':'Black Hawk Down (film)','Gladiator':'Gladiator (2000 film)','Come and See':'Come and See','Empire of the Sun':'Empire of the Sun (film)','The Last Samurai':'The Last Samurai',
    'Master and Commander: The Far Side of the World':'Master and Commander: The Far Side of the World','1917':'1917 (2019 film)','The Battle of Algiers':'The Battle of Algiers','Bullet in the Head':'Bullet in the Head','Good Morning, Vietnam':'Good Morning, Vietnam','Glory':'Glory (1989 film)','Kagemusha':'Kagemusha','The Deer Hunter':'The Deer Hunter','300':'300 (film)','Army of Shadows':'Army of Shadows','Blood Diamond':'Blood Diamond','Casualties of War':'Casualties of War','Europa Europa':'Europa Europa','Forrest Gump':'Forrest Gump','Salvador':'Salvador (film)','The Patriot':'The Patriot (2000 film)','Grave of the Fireflies':'Grave of the Fireflies','Oppenheimer':'Oppenheimer (film)','The Emperor and the Assassin':'The Emperor and the Assassin','Stalingrad':'Stalingrad (1993 film)','Letters from Iwo Jima':'Letters from Iwo Jima','Darkest Hour':'Darkest Hour (film)','The Zone of Interest':'The Zone of Interest (film)','Born on the Fourth of July':'Born on the Fourth of July','Atonement':'Atonement (2007 film)','The Killing Fields':'The Killing Fields (film)','The Big Red One':'The Big Red One','Valkyrie':'Valkyrie (film)',"No Man's Land":"No Man's Land (2001 film)",'The Great Escape':'The Great Escape (film)','The Imitation Game':'The Imitation Game','M*A*S*H':'M*A*S*H (film)','The Duellists':'The Duellists','Jarhead':'Jarhead','Three Kings':'Three Kings (1999 film)',
    'La Grande Illusion':'La Grande Illusion','All Quiet on the Western Front':'All Quiet on the Western Front (1930 film)','The Best Years of Our Lives':'The Best Years of Our Lives','The Cranes Are Flying':'The Cranes Are Flying',"Ivan's Childhood":"Ivan's Childhood",'Patton':'Patton (film)','The Ascent':'The Ascent (1977 film)','A Bridge Too Far':'A Bridge Too Far (film)','A Few Good Men':'A Few Good Men','We Were Soldiers':'We Were Soldiers'
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
    if(!text)return '';
    const m=text.match(/^\|\s*image\s*=\s*(?:\[\[File:)?([^|\]\n]+?)(?:\]\])?\s*$/im);
    if(!m)return '';
    const filename=m[1].trim().replace(/^File:/i,'');
    if(!filename||/\.(?:svg)$/i.test(filename))return '';
    return `https://en.wikipedia.org/wiki/Special:Redirect/file/${enc(filename.replace(/ /g,'_'))}?width=700`;
  };

  async function resolvePoster(item){
    const key=`${norm(item.title)}:${item.year||''}`;if(cache[key])return cache[key];
    const candidates=[pageTitleOverrides[item.title],item.year?`${item.title} (${item.year} film)`:null,`${item.title} (film)`,item.title].filter(Boolean);
    for(const title of [...new Set(candidates)]){
      const page=await fetchExactArticle(title);if(!page)continue;
      const infobox=infoboxPosterUrl(page);
      if(infobox){cache[key]=infobox;save();return infobox}
      if(portrait(page.thumbnail)){cache[key]=page.thumbnail.source;save();return page.thumbnail.source}
    }
    return '';
  }

  function updateFilmDom(film){
    document.querySelectorAll(`.era-screen[data-top-id="films-de-guerre"] [data-r="${CSS.escape(String(film.rank))}"] img`).forEach(img=>{
      if(isPlaceholder(img.currentSrc||img.src)||img.classList.contains('poster-deferred')){
        img.classList.remove('poster-deferred');img.removeAttribute('data-src');img.src=film.img;
      }
    });
  }
  function updateGhostDom(index,ghost){
    document.querySelectorAll(`.era-screen[data-top-id="films-de-guerre"] .ghost-card[data-ghost="${index}"] img`).forEach(img=>{if(isPlaceholder(img.currentSrc||img.src))img.src=ghost.img});
  }

  const queue=[];
  (top.films||[]).forEach(f=>{if(isPlaceholder(f.img))queue.push({kind:'film',item:f})});
  (top.ghosts||[]).forEach((g,index)=>{if(isPlaceholder(g.img))queue.push({kind:'ghost',item:g,index})});
  if(!queue.length)return;

  const worker=async()=>{while(queue.length){const job=queue.shift(),poster=await resolvePoster(job.item);if(!poster)continue;job.item.img=poster;if(job.kind==='film')updateFilmDom(job.item);else updateGhostDom(job.index,job.item)}};
  const start=()=>Promise.all(Array.from({length:Math.min(4,queue.length)},worker));
  if('requestIdleCallback' in window)requestIdleCallback(start,{timeout:500});else setTimeout(start,80);

  new MutationObserver(()=>{
    (top.films||[]).forEach(f=>{if(!isPlaceholder(f.img))updateFilmDom(f)});
    (top.ghosts||[]).forEach((g,i)=>{if(!isPlaceholder(g.img))updateGhostDom(i,g)});
  }).observe(document.getElementById('stage')||document.body,{childList:true,subtree:true});
})();
