(()=>{
  const mobile=matchMedia('(max-width:700px), (pointer:coarse)');
  if(!mobile.matches)return;

  const stage=document.getElementById('stage');
  if(!stage||typeof TOPS==='undefined'||!Array.isArray(TOPS))return;

  const perf=window.__ASWA40_MOBILE_PERF__||{};
  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const curated1975={
    'Star Wars':'https://image.tmdb.org/t/p/original/aJCtkxLLzkk1pECehVjKHA2lBgw.jpg',
    'Apocalypse Now':'https://image.tmdb.org/t/p/original/9Qs9oyn4iE8QtQjGZ0Hp2WyYNXT.jpg',
    'Indiana Jones':'https://image.tmdb.org/t/p/original/c7Mjuip0jfHLY7x8ZSEriRj45cu.jpg',
    'Pulp Fiction':'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    'Fargo':'https://image.tmdb.org/t/p/original/36P236xmuc8aWmXK7YkOM5EAKbA.jpg'
  };
  const legacyBackdrop=(top,film)=>{
    if(top?.id!=='2000-2024'||typeof filmBackdrops!=='object'||!filmBackdrops)return '';
    const src=filmBackdrops[String(film?.rank)]||filmBackdrops[film?.rank];
    return src?`../${src}`:'';
  };
  const originalHero=top=>perf.heroImages?.[top?.id]||top?.hero?.image||'';
  const desktopBackdrop=(top,film,index)=>{
    if(top?.id==='1975-1999'&&curated1975[film?.title])return curated1975[film.title];
    if(film?.backdrop)return film.backdrop;
    if(film?.backdropPath)return `https://image.tmdb.org/t/p/original${film.backdropPath}`;
    const local=legacyBackdrop(top,film);if(local)return local;
    if(index===0&&originalHero(top))return originalHero(top);
    return originalHero(top)||film?.img||'';
  };
  const deliverySource=src=>{
    const value=String(src||'');
    if(!value.includes('image.tmdb.org/t/p/'))return value;
    if(typeof perf.tmdb==='function')return perf.tmdb(value,perf.backdropSize||'w780');
    return value.replace(/\/t\/p\/(?:original|w\d+)\//,`/t/p/${perf.backdropSize||'w780'}/`);
  };
  const meta=film=>film?.year?String(film.year):`${film?.pts??'—'} pts · ${film?.votes??'—'} votes`;
  const idle=cb=>('requestIdleCallback' in window?requestIdleCallback(cb,{timeout:1800}):setTimeout(cb,1200));

  function enhance(screen){
    if(!screen||screen.dataset.mobileCinemaHeader==='1')return;
    const top=TOPS.find(t=>t.id===screen.dataset.topId);
    const hero=screen.querySelector('.hero-header');
    if(!top||!hero||!Array.isArray(top.films)||top.films.length<5)return;

    const films=top.films.slice(0,5);
    const desktopSources=films.map((film,i)=>desktopBackdrop(top,film,i));
    const sources=desktopSources.map(deliverySource);

    const media=document.createElement('div');
    media.className='mobile-cinema-media';
    media.setAttribute('aria-hidden','true');
    media.innerHTML=sources.map((src,i)=>`<div class="mobile-cinema-layer${i===0?' is-active':''}" data-mobile-cinema-layer="${i}" data-desktop-source="${esc(desktopSources[i])}"><img ${i===0?`src="${esc(src)}"`:`data-src="${esc(src)}"`} alt="" decoding="async" loading="${i===0?'eager':'lazy'}" fetchpriority="${i===0?'high':'low'}"></div>`).join('');
    hero.prepend(media);

    const copy=document.createElement('div');
    copy.className='mobile-cinema-copy';
    copy.innerHTML=`<div class="mobile-cinema-rank">${String(films[0].rank).padStart(2,'0')}</div><div class="mobile-cinema-film"><b>${esc(films[0].title)}</b><span>${esc(meta(films[0]))}</span></div><div class="mobile-cinema-count">01 / 05</div>`;
    hero.append(copy);

    const tabs=document.createElement('div');
    tabs.className='mobile-cinema-tabs';
    tabs.setAttribute('aria-label','Top 5');
    tabs.innerHTML=films.map((film,i)=>`<button type="button" class="${i===0?'is-active':''}" data-mobile-cinema-index="${i}" aria-pressed="${i===0?'true':'false'}" aria-label="Afficher ${esc(film.title)}">${String(i+1).padStart(2,'0')}</button>`).join('');
    hero.append(tabs);

    const layers=[...media.querySelectorAll('.mobile-cinema-layer')];
    const buttons=[...tabs.querySelectorAll('button')];
    const rank=copy.querySelector('.mobile-cinema-rank');
    const title=copy.querySelector('.mobile-cinema-film b');
    const filmMeta=copy.querySelector('.mobile-cinema-film span');
    const count=copy.querySelector('.mobile-cinema-count');
    let active=0,request=0;

    const ensureImage=i=>{
      const img=layers[i]?.querySelector('img');
      if(!img)return Promise.resolve();
      if(!img.getAttribute('src')){
        const src=img.dataset.src;
        if(src){img.src=src;delete img.dataset.src}
      }
      if(img.complete&&img.naturalWidth)return Promise.resolve();
      if(img.decode)return img.decode().catch(()=>{});
      return new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true})});
    };

    const commit=i=>{
      active=i;
      layers.forEach((layer,n)=>layer.classList.toggle('is-active',n===i));
      buttons.forEach((button,n)=>{
        const on=n===i;
        button.classList.toggle('is-active',on);
        button.classList.remove('is-loading');
        button.setAttribute('aria-pressed',String(on));
      });
      const film=films[i];
      rank.textContent=String(film.rank).padStart(2,'0');
      title.textContent=film.title;
      filmMeta.textContent=meta(film);
      count.textContent=`${String(i+1).padStart(2,'0')} / 05`;
    };

    const select=i=>{
      if(i===active)return;
      const my=++request;
      buttons[i]?.classList.add('is-loading');
      ensureImage(i).then(()=>{if(my===request)commit(i)});
    };

    buttons.forEach((button,i)=>{
      button.addEventListener('pointerdown',e=>e.stopPropagation());
      button.addEventListener('click',e=>{e.stopPropagation();select(i)});
    });

    // On a genuinely fast connection, quietly warm only the next backdrop after the
    // initial hero has had time to win the network. Slow/save-data connections fetch
    // every other backdrop strictly on demand.
    const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    if(!connection?.saveData&&(!connection?.effectiveType||connection.effectiveType==='4g')){
      idle(()=>ensureImage(1));
    }

    screen.dataset.mobileCinemaHeader='1';
    screen.classList.add('mobile-cinema-header');
  }

  const scan=()=>stage.querySelectorAll('.era-screen').forEach(enhance);
  scan();
  const observer=new MutationObserver(scan);
  observer.observe(stage,{childList:true});
})();
