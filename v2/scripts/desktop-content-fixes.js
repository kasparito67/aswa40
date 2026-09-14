(()=>{
  const stage=document.getElementById('stage');
  if(!stage||typeof TOPS==='undefined'||!Array.isArray(TOPS))return;

  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const slug=s=>norm(s).replace(/\s+/g,'-');

  // Shared content/section normalization runs before this file on both mobile and
  // desktop. This file is intentionally DOM-only: do not invent editorial data here.

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
  const wikiImage=(pageName,cache=portraitCache,pending=portraitPending)=>{
    if(cache.has(pageName))return Promise.resolve(cache.get(pageName));
    if(pending.has(pageName))return pending.get(pageName);
    const request=fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(String(pageName).replace(/ /g,'_'))}`)
      .then(r=>r.ok?r.json():null)
      .then(data=>data?.originalimage?.source||data?.thumbnail?.source||'')
      .catch(()=>'')
      .then(src=>{cache.set(pageName,src);pending.delete(pageName);return src});
    pending.set(pageName,request);
    return request;
  };
  const hydratePortrait=(node,name)=>{
    if(!node||node.dataset.portraitBound==='1')return;
    node.dataset.portraitBound='1';
    const existing=node.querySelector('img');
    if(existing)return;
    node.textContent=initials(name);
    wikiImage(portraitAliases[name]||name).then(src=>{
      if(!src||!node.isConnected)return;
      const img=document.createElement('img');
      img.src=src;img.alt='';img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
      node.replaceChildren(img);
    });
  };

  const ghostImageCache=new Map();
  const ghostImagePending=new Map();
  const hydrateGhostImage=(card,ghost)=>{
    if(!card||!ghost?.wiki||card.dataset.ghostImageBound==='1')return;
    card.dataset.ghostImageBound='1';
    wikiImage(ghost.wiki,ghostImageCache,ghostImagePending).then(src=>{
      if(!src||!card.isConnected)return;
      const img=card.querySelector('img');
      if(!img)return;
      const preload=new Image();
      preload.onload=()=>{img.src=src;ghost.img=src;card.classList.add('has-real-ghost-image')};
      preload.src=src;
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
        const legacyEntry=Array.isArray(raw);
        const entry=legacyEntry?{name:raw[0],films:raw[1]}:raw||{};
        const name=entry.name||row.querySelector('b')?.textContent||'';
        const directImg=row.querySelector(':scope > img');
        if(directImg&&!legacyEntry){directImg.classList.add('director-row-avatar-img');return}
        if(directImg&&legacyEntry)directImg.remove();
        let avatar=row.querySelector(':scope > .director-row-avatar');
        if(!avatar){avatar=document.createElement('span');avatar.className='director-row-avatar';row.prepend(avatar)}
        hydratePortrait(avatar,name);
      });
    }

    screen.querySelectorAll('.ghost-card').forEach(card=>{
      const index=Number(card.dataset.ghost);
      const ghost=top.ghosts?.[index];
      if(!ghost)return;
      card.classList.add('is-clickable-ghost');
      card.setAttribute('aria-label',`Ouvrir la fiche de ${ghost.title}`);
      hydrateGhostImage(card,ghost);
    });
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

  // Forgotten films are intentionally outside the ranked film arrays, so give them
  // the same clickable editorial sheet without inventing points/ranks.
  const modalBg=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const modalPoster=document.getElementById('modalPoster');
  const modalBackdrop=document.getElementById('modalBackdrop');
  const modalRank=document.getElementById('modalRank');
  const modalTitle=document.getElementById('modalTitle');
  const modalStats=document.getElementById('modalStats');
  const modalBody=document.getElementById('modalBody');
  const openGhostModal=(card,top,ghost)=>{
    if(!modalBg||!modal||!ghost)return;
    const poster=card.querySelector('img')?.currentSrc||card.querySelector('img')?.src||ghost.img||'';
    document.documentElement.style.setProperty('--active-accent',top.theme?.accent||'#e60d45');
    modal.classList.add('is-ghost-detail');
    modalPoster.src=poster;modalPoster.alt=`Affiche de ${ghost.title}`;
    modalBackdrop.src=poster;modalBackdrop.alt='';
    modalRank.textContent='Grand oublié';
    modalTitle.textContent=ghost.title;
    const noVotes=/aucun vote/i.test(String(ghost.copy||''));
    modalStats.innerHTML=noVotes?'<span><b>0</b> vote</span>':'<span>Absent du classement</span>';
    const url=`https://letterboxd.com/film/${slug(ghost.title)}/`;
    modalBody.innerHTML=`<p>${esc(ghost.copy||'Absent du classement.')}</p><a class="modal-detail-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Voir sur Letterboxd ↗</a>`;
    modalBg.classList.add('open');modalBg.setAttribute('aria-hidden','false');
  };
  stage.addEventListener('click',e=>{
    const card=e.target.closest?.('.ghost-card');
    if(!card||card.dataset.r)return;
    const screen=card.closest('.era-screen');
    const top=TOPS.find(t=>t.id===screen?.dataset.topId);
    const ghost=top?.ghosts?.[Number(card.dataset.ghost)];
    if(!top||!ghost)return;
    e.preventDefault();e.stopPropagation();openGhostModal(card,top,ghost);
  });
  if(modalBg&&modal){
    new MutationObserver(()=>{if(!modalBg.classList.contains('open'))modal.classList.remove('is-ghost-detail')}).observe(modalBg,{attributes:true,attributeFilter:['class']});
  }
})();