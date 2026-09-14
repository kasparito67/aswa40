(()=>{
  const stage=document.getElementById('stage');
  if(!stage||!Array.isArray(window.TOPS))return;

  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const escXml=s=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const posterByTitle=new Map();
  TOPS.forEach(top=>(top.films||[]).forEach(f=>{if(f.img)posterByTitle.set(norm(f.title),f.img)}));
  const ghostPlaceholder=(title,accent='#e60d45')=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900"><rect width="600" height="900" fill="#0b0d0f"/><path d="M0 0h600v8H0z" fill="${accent}"/><text x="42" y="720" fill="#f4f4ef" font-family="Arial,sans-serif" font-size="42" font-weight="700">${escXml(title)}</text><text x="42" y="770" fill="#8e979b" font-family="Arial,sans-serif" font-size="20">ABSENT DU CLASSEMENT</text></svg>`)}`;

  const curatedGhosts={
    'sci-fi-realiste':['Primer','Coherence','Arrival','The Andromeda Strain','Aniara'],
    animation:['Fantasia','The Wind Rises','Anomalisa','The Red Turtle','The Secret of Kells'],
    biopics:['The Pianist','Capote','Gandhi','The Elephant Man','A Beautiful Mind']
  };

  const ensureGhostSection=top=>{
    if(!top||top.id==='rewatched')return;
    if((!top.ghosts||!top.ghosts.length)&&curatedGhosts[top.id]){
      top.ghosts=curatedGhosts[top.id].map(title=>({
        title,
        copy:'Absent du classement.',
        img:posterByTitle.get(norm(title))||ghostPlaceholder(title,top.theme?.accent)
      }));
    }
    if(!top.ghosts?.length)return;
    const hasForgotten=top.sections?.some(s=>s.kind==='ghosts'&&!/ovni/i.test(String(s.title||'')));
    if(hasForgotten)return;
    const section={
      kicker:top.id==='documentaires'?'Aucun vote':'Absents du classement',
      title:'Les grands oubliés',
      kind:'ghosts'
    };
    const bottomIndex=top.sections?.findIndex(s=>s.kind==='bottom'||/ovni/i.test(String(s.title||'')))??-1;
    if(bottomIndex>=0)top.sections.splice(bottomIndex,0,section);else top.sections.push(section);
  };

  TOPS.forEach(top=>{
    (top.sections||[]).forEach(section=>{if(section.kind==='full')section.title='Le reste'});
    const year=top.sidebar?.find(item=>item.kind==='year');
    if(year){
      const years=String(year.title||'').match(/(?:19|20)\d{2}/g)||[];
      if(/décennie/i.test(String(year.label||'')))year.label='Décennie reine';
      else year.label=years.length>1?'Années reines':'Année reine';
    }
    ensureGhostSection(top);
  });

  // app-desktop hydrates closed full-ranking sections lazily. Its binder queries
  // descendants only, so when the hydrated section itself is passed as the root,
  // the button used to miss its click binding. Include that exact root for this
  // one selector without changing any other DOM query behavior.
  const nativeQSA=Element.prototype.querySelectorAll;
  if(!Element.prototype.__aswa40FullRevealPatch){
    Object.defineProperty(Element.prototype,'__aswa40FullRevealPatch',{value:true,configurable:true});
    Element.prototype.querySelectorAll=function(selector){
      const result=nativeQSA.call(this,selector);
      if(selector==='.sec[data-kind="full"]'&&this.matches?.(selector))return [this,...result];
      return result;
    };
  }

  const portraitAliases={
    'Frères Coen':'Coen brothers',
    'Katsuhiro Otomo':'Katsuhiro Otomo',
    'Satoshi Kon':'Satoshi Kon',
    'Hayao Miyazaki':'Hayao Miyazaki',
    'Brad Bird':'Brad Bird',
    'John Lasseter':'John Lasseter',
    'Alfonso Cuarón':'Alfonso Cuarón'
  };
  const portraitCache=new Map();
  const portraitPending=new Map();
  const initials=name=>String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  const portraitFor=name=>{
    if(portraitCache.has(name))return Promise.resolve(portraitCache.get(name));
    if(portraitPending.has(name))return portraitPending.get(name);
    const page=portraitAliases[name]||name;
    const request=fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.replace(/ /g,'_'))}`)
      .then(r=>r.ok?r.json():null)
      .then(data=>data?.thumbnail?.source||data?.originalimage?.source||'')
      .catch(()=>'')
      .then(src=>{portraitCache.set(name,src);portraitPending.delete(name);return src});
    portraitPending.set(name,request);
    return request;
  };
  const hydratePortrait=(node,name)=>{
    if(!node||node.dataset.portraitBound==='1')return;
    node.dataset.portraitBound='1';
    const existing=node.querySelector('img');
    if(existing)return;
    node.textContent=initials(name);
    portraitFor(name).then(src=>{
      if(!src||!node.isConnected)return;
      const img=document.createElement('img');
      img.src=src;img.alt='';img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
      node.replaceChildren(img);
    });
  };

  const yearLabelFor=item=>{
    if(/décennie/i.test(String(item?.label||'')))return'DÉCENNIE REINE';
    const years=String(item?.title||'').match(/(?:19|20)\d{2}/g)||[];
    return years.length>1?'ANNÉES REINES':'ANNÉE REINE';
  };

  const enhanceScreen=screen=>{
    const top=TOPS.find(t=>t.id===screen.dataset.topId);if(!top)return;
    screen.querySelectorAll('.sec[data-kind="full"] .toggle strong').forEach(el=>el.textContent='Le reste');

    const yearItem=top.sidebar?.find(item=>item.kind==='year');
    const yearCard=screen.querySelector('.year-insight-card');
    if(yearItem&&yearCard){
      yearCard.style.setProperty('--chart-max',String(Math.max(1,...(yearItem.bars||[]))));
      const kicker=yearCard.querySelector('.year-insight-kicker span');
      if(kicker)kicker.textContent=yearLabelFor(yearItem);
      yearCard.querySelectorAll('.year-chart-bar').forEach(bar=>{
        const label=bar.getAttribute('aria-label')||'';
        const match=label.match(/(\d{4})\s*:\s*(\d+)/);
        if(match)bar.dataset.tip=`${match[1]} · ${match[2]} film${Number(match[2])>1?'s':''}`;
      });
    }

    const directorItem=top.sidebar?.find(item=>item.kind==='directors');
    const directorCard=screen.querySelector('.director-card');
    if(directorItem&&directorCard){
      const entries=directorItem.entries||[];
      const rows=[...directorCard.querySelectorAll('.director-row')];
      rows.forEach((row,i)=>{
        const raw=entries[i];
        const entry=Array.isArray(raw)?{name:raw[0],films:raw[1]}:raw||{};
        const name=entry.name||row.querySelector('b')?.textContent||'';
        const directImg=row.querySelector(':scope > img');
        if(directImg){
          directImg.classList.add('director-row-avatar-img');
          return;
        }
        let avatar=row.querySelector(':scope > .director-row-avatar');
        if(!avatar){avatar=document.createElement('span');avatar.className='director-row-avatar';row.prepend(avatar)}
        hydratePortrait(avatar,name);
      });
    }
  };

  const enhanceAll=()=>stage.querySelectorAll('.era-screen').forEach(enhanceScreen);
  enhanceAll();
  new MutationObserver(()=>requestAnimationFrame(enhanceAll)).observe(stage,{childList:true,subtree:true});

  const highlightYears=(target,on)=>{
    const card=target.closest('.year-insight-card');if(!card)return;
    const chart=card.querySelector('.year-chart'),bars=[...card.querySelectorAll('.year-chart-bar')];
    if(!on){chart?.classList.remove('is-exploring');bars.forEach(b=>b.classList.remove('is-highlighted'));return}
    const years=(target.dataset.years||target.dataset.y||'').split(',').filter(Boolean);if(!years.length)return;
    chart?.classList.add('is-exploring');bars.forEach(bar=>bar.classList.toggle('is-highlighted',years.includes(bar.dataset.y)));
  };
  stage.addEventListener('pointerover',e=>{const target=e.target.closest?.('.year-chart-bar,[data-years]');if(target)highlightYears(target,true)});
  stage.addEventListener('pointerout',e=>{const target=e.target.closest?.('.year-chart-bar,[data-years]');if(target&&!target.contains(e.relatedTarget))highlightYears(target,false)});
  stage.addEventListener('focusin',e=>{const target=e.target.closest?.('.year-chart-bar,[data-years]');if(target)highlightYears(target,true)});
  stage.addEventListener('focusout',e=>{const target=e.target.closest?.('.year-chart-bar,[data-years]');if(target)highlightYears(target,false)});
})();