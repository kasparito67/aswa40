(()=>{
  const desktop=window.__ASWA40_FORCE_DESKTOP__===true||matchMedia('(min-width:701px) and (hover:hover) and (pointer:fine)').matches;
  if(!desktop)return;

  const titleFor=(top,section)=>{
    if(!section)return'';
    if(section.kind==='top25'){
      const count=Number(section.count)||25;
      return `Top ${count}`;
    }
    if(section.kind==='full')return'Classement complet';
    if(section.kind==='bottom')return'Les OVNIS';
    if(section.kind==='ghosts')return /ovni/i.test(String(section.title||''))?'Les OVNIS':'Les grands oubliés';
    return section.title||'';
  };

  const syncBackground=screen=>{
    const bg=screen.querySelector(':scope > .design-editorial-content-bg');
    const hero=screen.querySelector('.hero-header');
    if(!bg||!hero)return;
    const active=hero.querySelector('.design-header-media-layer.is-active img');
    if(!active)return;
    const src=active.currentSrc||active.getAttribute('src')||active.dataset.src||'';
    if(!src)return;
    bg.style.setProperty('--editorial-body-image',`url("${String(src).replaceAll('"','%22')}")`);
  };

  const installBackground=screen=>{
    if(!screen.querySelector(':scope > .design-editorial-content-bg')){
      const bg=document.createElement('div');
      bg.className='design-editorial-content-bg';
      bg.setAttribute('aria-hidden','true');
      const shell=screen.querySelector(':scope > .shell');
      if(shell)screen.insertBefore(bg,shell);else screen.append(bg);
    }
    syncBackground(screen);
    const hero=screen.querySelector('.hero-header');
    if(!hero||hero.dataset.editorialBgWatch==='1')return;
    hero.dataset.editorialBgWatch='1';
    const observer=new MutationObserver(()=>syncBackground(screen));
    observer.observe(hero,{subtree:true,attributes:true,attributeFilter:['class','src']});
  };

  const normalizeSidebar=screen=>{
    const sidebar=screen.querySelector('.site-sidebar');
    if(!sidebar||sidebar.dataset.editorialAccordion==='1')return;
    sidebar.dataset.editorialAccordion='1';
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
  };

  const enhance=screen=>{
    if(!screen||screen.dataset.editorialBody==='1'||screen.dataset.topId==='1975-1999'||!Array.isArray(window.TOPS))return false;
    const top=TOPS.find(t=>t.id===screen.dataset.topId);
    if(!top)return false;
    screen.dataset.editorialBody='1';
    screen.classList.add('design-editorial-body');

    [...screen.querySelectorAll('.sec')].forEach((sec,i)=>{
      const section=top.sections?.[i];
      const title=sec.querySelector('.toggle strong');
      if(section&&title)title.textContent=titleFor(top,section);
    });

    installBackground(screen);
    normalizeSidebar(screen);
    return true;
  };

  const stage=document.getElementById('stage');
  if(!stage)return;
  const apply=()=>{
    stage.querySelectorAll('.era-screen').forEach(enhance);
    // Re-sync already enhanced screens because the shared header system can mount
    // a few milliseconds after this observer sees the renderer.
    stage.querySelectorAll('.era-screen.design-editorial-body').forEach(screen=>{
      installBackground(screen);
      syncBackground(screen);
    });
  };
  apply();
  new MutationObserver(apply).observe(stage,{childList:true,subtree:true});
})();
