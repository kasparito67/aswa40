(()=>{
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const placeholder=src=>String(src||'').startsWith('data:image/svg+xml');

  const realByTitle=new Map();
  TOPS.forEach(top=>(top.films||[]).forEach(f=>{if(f.img&&!placeholder(f.img))realByTitle.set(norm(f.title),f.img)}));
  TOPS.forEach(top=>(top.films||[]).forEach(f=>{if((!f.img||placeholder(f.img))&&realByTitle.has(norm(f.title)))f.img=realByTitle.get(norm(f.title))}));

  // A few older/shared records had correct posters but no backdrop identity. Without
  // these locks the hero renderer fell back to the generic Top image, so unrelated
  // films could visibly share a backdrop. Keep these canonical IDs explicit.
  const backdropLocks={
    'sci-fi-realiste':{
      2:'/hPsCR1ny6GnctJkWqeJwihTDD7T.jpg', // Gattaca
      3:'/qr7dUqleMRd0VgollazbmyP9XjI.jpg', // Blade Runner
      5:'/tlm8UkiQsitc8rSuIAscQDCnP8d.jpg'  // The Matrix
    },
    animation:{
      1:'/fK40VGYIm7hmKrLJ26fgPQU0qRG.jpg', // Akira
      4:'/xWT5F1DNxciNLEMXRl49iq8zvN7.jpg', // Nightmare Before Christmas
      5:'/3Rfvhy1Nl6sSGJwyjb0QiZzZYlB.jpg'  // Toy Story
    },
    biopics:{
      1:'/7TF4p86ZafnxFuNqWdhpHXFO244.jpg', // GoodFellas
      2:'/zb6fM1CX41D9rF9hdgclu0peUmy.jpg'  // Schindler's List
    }
  };
  Object.entries(backdropLocks).forEach(([topId,films])=>{
    const top=TOPS.find(t=>t.id===topId);if(!top)return;
    Object.entries(films).forEach(([rank,path])=>{
      const film=top.films.find(f=>f.rank===Number(rank));
      if(film)film.backdropPath=path;
    });
  });

  const era1975=TOPS.find(t=>t.id==='1975-1999');
  if(era1975){
    const indiana=era1975.films.find(f=>f.rank===3||norm(f.title)==='indiana jones');
    if(indiana)indiana.year='1981';
  }

  // Identity locks belong here. Section layout and editorial configuration live in
  // platform-config.js so there is only one source of truth for presentation.
  const docs=TOPS.find(t=>t.id==='documentaires');
  if(docs){
    const lockedDocs={
      7:{
        title:'Icarus',
        year:'2017',
        tmdbId:432976,
        img:'https://image.tmdb.org/t/p/w500/x5azMi1KvZWbBbfjmGqpHNGqjH.jpg',
        posterPath:'/x5azMi1KvZWbBbfjmGqpHNGqjH.jpg',
        backdropPath:'/ambKXAJYrDPJK9wBJlIVVWbQbar.jpg',
        backdrop:'https://image.tmdb.org/t/p/original/ambKXAJYrDPJK9wBJlIVVWbQbar.jpg',
        letterboxd:'https://letterboxd.com/film/icarus-2017/'
      },
      8:{
        title:'Senna',
        year:'2010',
        tmdbId:58496,
        img:'https://image.tmdb.org/t/p/w500/nZbLCbRoP6iJq5sr8daHQzjnzFh.jpg',
        posterPath:'/nZbLCbRoP6iJq5sr8daHQzjnzFh.jpg',
        backdropPath:'/sS3jaC2SXoeYmjAuqPeoeelPZqP.jpg',
        backdrop:'https://image.tmdb.org/t/p/original/sS3jaC2SXoeYmjAuqPeoeelPZqP.jpg',
        letterboxd:'https://letterboxd.com/film/senna/'
      }
    };
    Object.entries(lockedDocs).forEach(([rank,patch])=>{
      const film=docs.films.find(f=>f.rank===Number(rank));
      if(film)Object.assign(film,patch);
    });
    docs.community='9 cinéphiles';
    docs.hero=docs.hero||{};
    docs.hero.titleArt='../assets/header-documentaires.svg';
    docs.hero.titleAlt='Top 15 Documentaires';
  }

  const re=TOPS.find(t=>t.id==='rewatched');
  if(re){
    // Keep the visible poster and metadata pinned to the 1990 film (TMDB 771).
    const homeAlone=re.films.find(f=>f.rank===5||norm(f.title)==='home alone');
    if(homeAlone)Object.assign(homeAlone,{
      title:'Home Alone',
      year:'1990',
      tmdbId:771,
      img:'https://image.tmdb.org/t/p/w500/onTSipZ8R3bliBdKfPtsDuHTdlL.jpg',
      posterPath:'/onTSipZ8R3bliBdKfPtsDuHTdlL.jpg',
      backdropPath:'/ih2xVgeMS8R5WUetYE8Mr9hVTlB.jpg',
      letterboxd:'https://letterboxd.com/film/home-alone/'
    });
    re.community='9 cinéphiles';
  }

  // Editorial hotfixes supplied after the v1 launch. Reuse posters already present
  // anywhere in the platform before falling back to a lightweight placeholder.
  const existingPoster=title=>{
    const key=norm(title);
    for(const top of TOPS){
      for(const item of [...(top.films||[]),...(top.ghosts||[])]){
        if(norm(item?.title)===key&&item?.img&&!placeholder(item.img))return item.img;
      }
    }
    return '';
  };
  const missingPoster=title=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900"><rect width="600" height="900" fill="#0b0d0e"/><text x="50%" y="48%" fill="#f3f1e9" font-family="Arial,sans-serif" font-size="34" font-weight="700" text-anchor="middle">${String(title).replace(/[&<>]/g,'')}</text><text x="50%" y="55%" fill="#8c969b" font-family="Arial,sans-serif" font-size="18" text-anchor="middle">ASWA40 · affiche à venir</text></svg>`)}`;
  const ensureGhostSection=top=>{
    if(!Array.isArray(top.ghosts))top.ghosts=[];
    if(!Array.isArray(top.sections))top.sections=[];
    if(top.sections.some(s=>s.kind==='ghosts'))return;
    const section={kicker:'Aucun vote',title:'Les grands oubliés',kind:'ghosts'};
    const bottomIndex=top.sections.findIndex(s=>s.kind==='bottom');
    if(bottomIndex>=0)top.sections.splice(bottomIndex,0,section);else top.sections.push(section);
  };
  const addGhost=(top,{title,year,copy,img})=>{
    ensureGhostSection(top);
    let ghost=top.ghosts.find(g=>norm(g.title)===norm(title));
    if(!ghost){
      ghost={title,year:String(year||''),copy,img:img||existingPoster(title)||missingPoster(title)};
      top.ghosts.push(ghost);
    }else{
      ghost.year=ghost.year||String(year||'');
      ghost.copy=copy||ghost.copy;
      if((!ghost.img||placeholder(ghost.img))&&img)ghost.img=img;
    }
    return ghost;
  };

  const war=TOPS.find(t=>t.id==='films-de-guerre');
  if(war){
    const deer=war.films.find(f=>norm(f.title)==='the deer hunter');
    const deerPoster=existingPoster('The Deer Hunter');
    if(deer&&deerPoster)deer.img=deerPoster;
    addGhost(war,{
      title:'La Grande Vadrouille',year:1966,
      copy:'0 vote · la grande comédie populaire française de l’Occupation ne figure dans aucune des six listes.'
    });
  }

  const sciFi=TOPS.find(t=>t.id==='sci-fi-realiste');
  let edgeGhost=null;
  if(sciFi){
    edgeGhost=addGhost(sciFi,{
      title:'Edge of Tomorrow',year:2014,
      copy:'0 vote · absent des listes de ce Top malgré sa science-fiction militaire à mécanique temporelle.'
    });
    addGhost(sciFi,{
      title:'Interstellar',year:2014,
      copy:'0 vote · un incontournable de la science-fiction contemporaine absent des listes de ce Top.',
      img:existingPoster('Interstellar')||'../assets/posters/2000-2024/100-interstellar.jpg'
    });
  }

  // Edge of Tomorrow is not elsewhere in the local poster library. Resolve its
  // theatrical poster once from the Wikipedia infobox, then patch the visible card.
  if(edgeGhost&&placeholder(edgeGhost.img)&&typeof fetch==='function'){
    const hydrateEdge=async()=>{
      try{
        const url='https://en.wikipedia.org/w/api.php?action=query&redirects=1&titles=Edge%20of%20Tomorrow&prop=revisions%7Cpageimages&rvprop=content&rvslots=main&piprop=thumbnail%7Cname&pithumbsize=700&formatversion=2&format=json&origin=*';
        const res=await fetch(url,{mode:'cors',credentials:'omit'});if(!res.ok)return;
        const page=(await res.json())?.query?.pages?.[0];if(!page||page.missing)return;
        const text=page?.revisions?.[0]?.slots?.main?.content||'';
        const match=text.match(/^\|\s*image\s*=\s*(?:\[\[File:)?([^|\]\n]+?)(?:\]\])?\s*$/im);
        let poster='';
        if(match){
          const filename=match[1].trim().replace(/^File:/i,'');
          if(filename&&!/\.svg$/i.test(filename))poster=`https://en.wikipedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename.replace(/ /g,'_'))}?width=700`;
        }
        if(!poster&&page.thumbnail?.source&&Number(page.thumbnail.height||0)>Number(page.thumbnail.width||0)*1.12)poster=page.thumbnail.source;
        if(!poster)return;
        edgeGhost.img=poster;
        const index=sciFi.ghosts.indexOf(edgeGhost);
        document.querySelectorAll(`.era-screen[data-top-id="sci-fi-realiste"] .ghost-card[data-ghost="${index}"] img`).forEach(img=>{img.src=poster});
      }catch{}
    };
    if('requestIdleCallback' in window)requestIdleCallback(hydrateEdge,{timeout:700});else setTimeout(hydrateEdge,80);
  }

  // WAR IS HELL is a wide 950×234 SVG, not one of the 16:9 title-art sheets. Give
  // it its own mobile rule so the complete mark is visible instead of being cropped.
  if(typeof document!=='undefined'&&!document.getElementById('war-mobile-title-fix')){
    const style=document.createElement('style');
    style.id='war-mobile-title-fix';
    style.textContent=`@media(max-width:700px),(pointer:coarse){
      .era-screen.mobile-cinema-header[data-top-id="films-de-guerre"] .hero-title-art-wrap{
        position:absolute!important;inset:auto!important;top:62px!important;right:16px!important;left:auto!important;
        width:min(86vw,340px)!important;height:auto!important;aspect-ratio:950.97/233.51!important;overflow:visible!important;
        transform:none!important;filter:drop-shadow(0 14px 34px rgba(0,0,0,.40))!important
      }
      .era-screen.mobile-cinema-header[data-top-id="films-de-guerre"] .hero-title-art{
        position:relative!important;inset:auto!important;display:block!important;width:100%!important;max-width:100%!important;
        height:auto!important;max-height:none!important;aspect-ratio:auto!important;object-fit:contain!important;object-position:right top!important;
        transform:none!important;filter:none!important
      }
    }`;
    document.head.appendChild(style);
  }
})();