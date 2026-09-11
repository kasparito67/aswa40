(()=>{
  const mobile=matchMedia('(max-width:700px), (pointer:coarse)');
  if(!mobile.matches)return;

  const stage=document.getElementById('stage');
  if(!stage||typeof TOPS==='undefined'||!Array.isArray(TOPS))return;

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
  // Keep this resolver in lockstep with the validated desktop header systems.
  const backdropFor=(top,film,index)=>{
    if(top?.id==='1975-1999'&&curated1975[film?.title])return curated1975[film.title];
    if(film?.backdrop)return film.backdrop;
    if(film?.backdropPath)return `https://image.tmdb.org/t/p/original${film.backdropPath}`;
    const local=legacyBackdrop(top,film);if(local)return local;
    if(index===0&&top?.hero?.image)return top.hero.image;
    return top?.hero?.image||film?.img||'';
  };
  const meta=film=>film?.year?String(film.year):`${film?.pts??'—'} pts · ${film?.votes??'—'} votes`;

  function enhance(screen){
    if(!screen||screen.dataset.mobileCinemaHeader==='1')return;
    const top=TOPS.find(t=>t.id===screen.dataset.topId);
    const hero=screen.querySelector('.hero-header');
    if(!top||!hero||!Array.isArray(top.films)||top.films.length<5)return;

    const films=top.films.slice(0,5);
    const sources=films.map((film,i)=>backdropFor(top,film,i));
    sources.slice(0,2).forEach(src=>{if(src){const img=new Image();img.decoding='async';img.src=src}});

    const media=document.createElement('div');
    media.className='mobile-cinema-media';
    media.setAttribute('aria-hidden','true');
    media.innerHTML=sources.map((src,i)=>`<div class="mobile-cinema-layer${i===0?' is-active':''}" data-mobile-cinema-layer="${i}"><img src="${esc(src)}" alt="" decoding="async" fetchpriority="${i===0?'high':'low'}"></div>`).join('');
    hero.prepend(media);

    const copy=document.createElement('div');
    copy.className='mobile-cinema-copy';
    copy.innerHTML=`<div class="mobile-cinema-rank">${String(films[0].rank).padStart(2,'0')}</div><div class="mobile-cinema-film"><b>${esc(films[0].title)}</b><span>${esc(meta(films[0]))}</span></div><div class="mobile-cinema-count">01 / 05</div>`;
    hero.append(copy);

    const tabs=document.createElement('div');
    tabs.className='mobile-cinema-tabs';
    tabs.setAttribute('aria-label','Top 5');
    tabs.innerHTML=films.map((film,i)=>`<button type="button" class="${i===0?'is-active':''}" data-mobile-cinema-index="${i}" aria-label="Afficher ${esc(film.title)}">${String(i+1).padStart(2,'0')}</button>`).join('');
    hero.append(tabs);

    const layers=[...media.querySelectorAll('.mobile-cinema-layer')];
    const buttons=[...tabs.querySelectorAll('button')];
    const rank=copy.querySelector('.mobile-cinema-rank');
    const title=copy.querySelector('.mobile-cinema-film b');
    const filmMeta=copy.querySelector('.mobile-cinema-film span');
    const count=copy.querySelector('.mobile-cinema-count');
    let active=0;

    const select=i=>{
      if(i===active)return;
      active=i;
      layers.forEach((layer,n)=>layer.classList.toggle('is-active',n===i));
      buttons.forEach((button,n)=>button.classList.toggle('is-active',n===i));
      const film=films[i];
      rank.textContent=String(film.rank).padStart(2,'0');
      title.textContent=film.title;
      filmMeta.textContent=meta(film);
      count.textContent=`${String(i+1).padStart(2,'0')} / 05`;
      const next=sources[(i+1)%sources.length];
      if(next){const preload=new Image();preload.decoding='async';preload.src=next}
    };

    buttons.forEach((button,i)=>{
      button.addEventListener('pointerdown',e=>e.stopPropagation());
      button.addEventListener('click',e=>{e.stopPropagation();select(i)});
    });

    screen.dataset.mobileCinemaHeader='1';
    screen.classList.add('mobile-cinema-header');
  }

  const scan=()=>stage.querySelectorAll('.era-screen').forEach(enhance);
  scan();
  const observer=new MutationObserver(scan);
  observer.observe(stage,{childList:true});
})();
