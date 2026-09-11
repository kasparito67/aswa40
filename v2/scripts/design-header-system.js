(()=>{
  const desktop=matchMedia('(min-width:701px) and (hover:hover) and (pointer:fine)');
  if(!desktop.matches)return;

  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const mediaConfig=window.ASWA40_HEADER_MEDIA||{};
  const legacyBackdrop=(top,film)=>{
    if(top?.id!=='2000-2024'||typeof filmBackdrops!=='object'||!filmBackdrops)return '';
    const src=filmBackdrops[String(film?.rank)]||filmBackdrops[film?.rank];
    return src?`../${src}`:'';
  };
  const backdropFor=(top,film,index)=>{
    const curated=typeof mediaConfig.backdrop==='function'?mediaConfig.backdrop(top,film):'';
    if(curated)return curated;
    if(film?.backdrop)return film.backdrop;
    if(film?.backdropPath)return `https://image.tmdb.org/t/p/original${film.backdropPath}`;
    const local=legacyBackdrop(top,film);if(local)return local;
    if(index===0&&top?.hero?.image)return top.hero.image;
    return top?.hero?.image||film?.img||'';
  };

  function enhance(screen){
    if(!screen||screen.dataset.designHeaderSystem==='1'||screen.dataset.topId==='1975-1999'||typeof TOPS==='undefined'||!Array.isArray(TOPS))return false;
    const top=TOPS.find(t=>t.id===screen.dataset.topId);
    const hero=screen.querySelector('.hero-header');
    if(!top||!hero)return false;
    const films=(top.films||[]).slice(0,5);
    if(films.length<5)return false;

    const sources=films.map((film,i)=>backdropFor(top,film,i));
    if(!sources[0])return false;

    screen.dataset.designHeaderSystem='1';
    screen.classList.add('design-header-system');

    const stack=document.createElement('div');
    stack.className='design-header-media-stack';
    stack.setAttribute('aria-hidden','true');
    stack.innerHTML=sources.map((src,i)=>`<div class="design-header-media-layer${i===0?' is-active':''}" data-design-header-media="${i}" data-header-media-key="${esc(`${top.id}:${films[i].rank}`)}"><img ${i===0?`src="${esc(src)}"`:`data-src="${esc(src)}"`} alt="" decoding="async" fetchpriority="${i===0?'high':'low'}"></div>`).join('');
    hero.prepend(stack);

    const nav=document.createElement('nav');
    nav.className='design-header-top5';
    nav.setAttribute('aria-label',`Top 5 — ${top.label}`);
    nav.innerHTML=films.map((film,i)=>{
      const year=film.year?`<span class="year">${esc(film.year)}</span>`:'';
      const long=String(film.title||'').length>24?' is-long':'';
      return `<button type="button" data-design-header-index="${i}" class="${i===0?'is-locked':''}${long}"><span class="num">${String(i+1).padStart(2,'0')}</span><span class="film-name">${esc(film.title)}</span>${year}</button>`;
    }).join('');
    hero.append(nav);

    const progress=document.createElement('div');
    progress.className='design-header-progress';
    progress.innerHTML='<span></span>';
    hero.append(progress);

    const media=[...stack.querySelectorAll('.design-header-media-layer')];
    const buttons=[...nav.querySelectorAll('button')];
    let locked=0,shown=0,hover=null,token=0;

    const ensureImage=i=>{
      const img=media[i]?.querySelector('img');
      if(!img)return Promise.resolve();
      if(!img.getAttribute('src')){
        const src=img.dataset.src;
        if(src){img.src=src;delete img.dataset.src}
      }
      if(img.complete&&img.naturalWidth)return Promise.resolve();
      if(img.decode)return img.decode().catch(()=>{});
      return new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true})});
    };

    const renderMenu=()=>{
      const previewing=hover!==null&&hover!==locked;
      nav.classList.toggle('is-previewing',previewing);
      buttons.forEach((button,i)=>{
        button.classList.toggle('is-locked',i===locked);
        button.classList.toggle('is-preview',previewing&&i===hover);
      });
    };

    const switchHero=i=>{
      if(i===shown){progress.style.setProperty('--design-index',i);return}
      const my=++token;
      ensureImage(i).then(()=>{
        if(my!==token)return;
        const current=media[shown],next=media[i];
        if(!current||!next)return;
        media.forEach((layer,n)=>{if(n!==shown&&n!==i)layer.classList.remove('is-active','is-incoming','is-outgoing')});
        current.classList.remove('is-active','is-incoming');
        current.classList.add('is-outgoing');
        next.classList.remove('is-active','is-outgoing');
        next.classList.add('is-incoming');
        next.getBoundingClientRect();
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          if(my!==token)return;
          next.classList.remove('is-incoming');
          next.classList.add('is-active');
          shown=i;
          progress.style.setProperty('--design-index',i);
          setTimeout(()=>{if(my===token)current.classList.remove('is-outgoing')},480);
        }));
      });
    };

    const preview=i=>{hover=i;renderMenu();switchHero(i)};
    const clear=()=>{hover=null;renderMenu();switchHero(locked)};
    const lock=i=>{locked=i;hover=null;renderMenu();switchHero(i)};

    buttons.forEach((button,i)=>{
      button.addEventListener('pointerenter',()=>preview(i));
      button.addEventListener('focus',()=>preview(i));
      button.addEventListener('click',()=>lock(i));
    });
    nav.addEventListener('pointerleave',clear);
    nav.addEventListener('focusout',event=>{if(!nav.contains(event.relatedTarget))clear()});
    renderMenu();
    return true;
  }

  const stage=document.getElementById('stage');
  if(!stage)return;
  const apply=()=>{
    stage.querySelectorAll('.era-screen').forEach(enhance);
    return stage.querySelectorAll('.era-screen[data-design-header-system="1"]').length>=Math.max(0,TOPS.length-1);
  };
  if(apply())return;
  const observer=new MutationObserver(()=>{if(apply())observer.disconnect()});
  observer.observe(stage,{childList:true,subtree:true});
})();
