(()=>{
  const desktop=matchMedia('(min-width:701px) and (hover:hover) and (pointer:fine)');
  if(!desktop.matches)return;

  const fallbacks={
    'Star Wars':'https://image.tmdb.org/t/p/original/aJCtkxLLzkk1pECehVjKHA2lBgw.jpg',
    'Apocalypse Now':'https://image.tmdb.org/t/p/original/9Qs9oyn4iE8QtQjGZ0Hp2WyYNXT.jpg',
    'Indiana Jones':'https://image.tmdb.org/t/p/original/kCiMExsYuNhYluHxPP2OTmWw7hp.jpg',
    'Pulp Fiction':'https://image.tmdb.org/t/p/original/qQoB4LNDYwQLU1GcBhrEZK5MdWm.jpg',
    'Fargo':'https://image.tmdb.org/t/p/original/36P236xmuc8aWmXK7YkOM5EAKbA.jpg'
  };
  // The curated Top 5 hero sources are authoritative for this design pass.
  // This prevents stale/wrong media metadata from overriding the intended film.
  const tmdbBackdrop=f=>fallbacks[f?.title]||f?.backdrop||f?.backdropPath&&`https://image.tmdb.org/t/p/original${f.backdropPath}`||f?.img||'';

  function setText(el,text){if(el)el.textContent=text}
  function renameSidebar(screen){
    const insights=[...screen.querySelectorAll('.insight-item .insight-card b')];
    setText(insights[0],'A Galaxy Far Away');
    setText(insights[1],'Monsieur consensus');
    setText(insights[2],'Duo cinéphile');
    setText(insights[3],"L’explorateur");

    const year=screen.querySelector('.year-insight-year');
    setText(year,'1995 + 1998');
    const director=screen.querySelector('.director-title');
    setText(director,'Le Roi : Spielberg');

    const titles={top25:'Top 25',full:'Classement complet',ghosts:'Les grands oubliés',bottom:'Les OVNIS'};
    screen.querySelectorAll('.sec').forEach(sec=>setText(sec.querySelector('.toggle strong'),titles[sec.dataset.kind]||sec.querySelector('.toggle strong')?.textContent||''));

    const sidebar=screen.querySelector('.site-sidebar');
    if(!sidebar||sidebar.dataset.designAccordion==='1')return;
    sidebar.dataset.designAccordion='1';
    sidebar.addEventListener('click',()=>requestAnimationFrame(()=>{
      const opened=[...sidebar.querySelectorAll('.insight-item.is-open,.year-insight-card.is-open,.director-card.is-open')];
      if(opened.length<2)return;
      const keep=opened.at(-1);
      opened.forEach(card=>{
        if(card===keep)return;
        card.classList.remove('is-open');
        card.querySelector('[aria-expanded="true"]')?.setAttribute('aria-expanded','false');
        card.querySelector('[aria-hidden="false"]')?.setAttribute('aria-hidden','true');
      });
    }));
  }

  function enhance(screen){
    if(!screen||screen.dataset.design1975==='1'||typeof TOPS==='undefined'||!Array.isArray(TOPS))return false;
    const top=TOPS.find(t=>t.id==='1975-1999');
    const hero=screen.querySelector('.hero-header');
    if(!top||!hero)return false;
    const films=top.films.slice(0,5);
    if(films.length<5)return false;

    screen.dataset.design1975='1';
    screen.classList.add('design-1975');

    const sources=films.map(tmdbBackdrop);
    sources.forEach(src=>{if(src){const im=new Image();im.decoding='async';im.src=src}});

    const stack=document.createElement('div');
    stack.className='design1975-media-stack';
    stack.setAttribute('aria-hidden','true');
    stack.innerHTML=sources.map((src,i)=>`<div class="design1975-media-layer${i===0?' is-active':''}" data-design-media="${i}"><img src="${src}" alt="" decoding="async" fetchpriority="${i===0?'high':'low'}"></div>`).join('');
    hero.prepend(stack);

    const nav=document.createElement('nav');
    nav.className='design1975-top5';
    nav.setAttribute('aria-label','Top 5 du classement');
    nav.innerHTML=films.map((f,i)=>`<button type="button" data-design-index="${i}" class="${i===0?'is-locked':''}"><span class="num">${String(i+1).padStart(2,'0')}</span><span class="film-name">${f.title}</span><span class="year">${({1:'1977',2:'1979',3:'1981',4:'1994',5:'1996'})[i+1]||''}</span></button>`).join('');
    hero.append(nav);

    const progress=document.createElement('div');
    progress.className='design1975-progress';
    progress.innerHTML='<span></span>';
    hero.append(progress);

    const contentBg=document.createElement('div');
    contentBg.className='design1975-content-bg';
    contentBg.setAttribute('aria-hidden','true');
    contentBg.innerHTML=sources.map((src,i)=>`<div class="design1975-bg-layer${i===0?' is-active':''}" data-design-bg="${i}" style="background-image:url('${src.replaceAll("'","%27")}')"></div>`).join('');
    screen.insertBefore(contentBg,screen.querySelector('.shell'));

    const media=[...stack.querySelectorAll('.design1975-media-layer')];
    const bgs=[...contentBg.querySelectorAll('.design1975-bg-layer')];
    const buttons=[...nav.querySelectorAll('button')];
    let locked=0,shown=0,hover=null,token=0;

    const renderMenu=()=>{
      const previewing=hover!==null&&hover!==locked;
      nav.classList.toggle('is-previewing',previewing);
      buttons.forEach((b,i)=>{
        b.classList.toggle('is-locked',i===locked);
        b.classList.toggle('is-preview',previewing&&i===hover);
      });
    };
    const switchHero=i=>{
      if(i===shown){bgs.forEach((bg,n)=>bg.classList.toggle('is-active',n===i));progress.style.setProperty('--design-index',i);return}
      const current=media[shown],next=media[i],my=++token;
      media.forEach((layer,n)=>{if(n!==shown&&n!==i)layer.classList.remove('is-active','is-incoming','is-outgoing')});
      current.classList.remove('is-active','is-incoming');current.classList.add('is-outgoing');
      next.classList.remove('is-active','is-outgoing');next.classList.add('is-incoming');next.getBoundingClientRect();
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        if(my!==token)return;
        next.classList.remove('is-incoming');next.classList.add('is-active');shown=i;
        bgs.forEach((bg,n)=>bg.classList.toggle('is-active',n===i));
        progress.style.setProperty('--design-index',i);
        setTimeout(()=>{if(my===token)current.classList.remove('is-outgoing')},480);
      }));
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
    nav.addEventListener('focusout',e=>{if(!nav.contains(e.relatedTarget))clear()});
    renderMenu();
    renameSidebar(screen);
    return true;
  }

  const stage=document.getElementById('stage');
  if(!stage)return;
  const tryEnhance=()=>enhance(stage.querySelector('.era-screen[data-top-id="1975-1999"]'));
  if(tryEnhance())return;
  const observer=new MutationObserver(()=>{if(tryEnhance())observer.disconnect()});
  observer.observe(stage,{childList:true,subtree:true});
})();
