(()=>{
  const stage=document.getElementById('stage');
  const app=document.getElementById('app');
  const hud=document.getElementById('eraHud');
  const prev=document.getElementById('eraPrev');
  const next=document.getElementById('eraNext');
  const mb=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const modalPoster=document.getElementById('modalPoster');
  const modalBackdrop=document.getElementById('modalBackdrop');
  const modalRank=document.getElementById('modalRank');
  const modalTitle=document.getElementById('modalTitle');
  const modalStats=document.getElementById('modalStats');
  const modalBody=document.getElementById('modalBody');
  const modalClose=document.getElementById('modalClose');
  const modalPrev=document.getElementById('modalPrev');
  const modalNext=document.getElementById('modalNext');
  if(!stage||!app||!Array.isArray(TOPS)||!TOPS.length)return;

  const W=()=>Math.max(innerWidth,1);
  const clampTop=i=>Math.max(0,Math.min(TOPS.length-1,i));
  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const slug=s=>norm(s).replace(/\s+/g,'-');
  const idle=cb=>('requestIdleCallback' in window?requestIdleCallback(cb,{timeout:900}):setTimeout(cb,120));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const loadedFull=new Map();
  const prewarmed=new Set();
  let topIndex=0;
  let scrollFrame=0,scrollTimer=0,suppressHistory=false,pendingHistory='push';
  let modalTop=0,modalIndex=0,modalAnimating=false,modalSnapshot=null,modalRequest=0;
  let modalWheelAxis=null,modalWheelX=0,modalWheelY=0,modalWheelSignedX=0,modalWheelTimer=0,modalWheelLocked=false;

  const routeFor=i=>`/tops/${TOPS[clampTop(i)].id}`;
  const routeIndex=(path=location.pathname)=>{
    const m=String(path).match(/^\/tops\/([^/]+)\/?$/);
    if(!m)return -1;
    const id=decodeURIComponent(m[1]);
    return TOPS.findIndex(t=>t.id===id);
  };
  const routeUrl=i=>`${routeFor(i)}${location.search}${location.hash}`;
  const writeRoute=(i,mode='push')=>{
    const state={topId:TOPS[i].id};
    if(mode==='replace')history.replaceState(state,'',routeUrl(i));
    else history.pushState(state,'',routeUrl(i));
  };
  const themeVars=top=>`--accent:${top.theme.accent};--secondary:${top.theme.secondary};--top-bg:${top.theme.bg};--top-panel:${top.theme.panel}`;
  const yearsFromText=(text,min,max)=>{
    const out=new Set();
    [...String(text).matchAll(/(19\d{2}|20\d{2})\s*[–-]\s*(?:(19\d{2}|20\d{2})|(\d{2}))/g)].forEach(m=>{
      const a=Number(m[1]),b=Number(m[2]||String(a).slice(0,2)+m[3]);
      for(let y=Math.min(a,b);y<=Math.max(a,b);y++)if(y>=min&&y<=max)out.add(y);
    });
    String(text).match(/(?:19|20)\d{2}/g)?.forEach(y=>{const n=Number(y);if(n>=min&&n<=max)out.add(n)});
    return [...out];
  };

  const letterboxdAliases={
    'lord of the rings':'the-lord-of-the-rings-the-fellowship-of-the-ring',
    'spirited away':'spirited-away','goodfellas':'goodfellas','children of men':'children-of-men',
    'akira':'akira','the social network':'the-social-network','schindlers list':'schindlers-list',
    'catch me if you can':'catch-me-if-you-can','wall e':'wall-e','a i artificial intelligence':'ai-artificial-intelligence'
  };

  function filmTile(f,t,mode='normal',defer=false,editorial=''){
    const winner=f.rank===1?'<span class="winner-crown" aria-hidden="true">♛</span>':'';
    const eager=t===topIndex&&mode==='normal'&&Number(f.rank)<=5;
    const img=defer
      ?`<img class="poster-deferred" data-src="${f.img}" alt="" loading="lazy" decoding="async" width="342" height="513">`
      :`<img src="${f.img}" alt="" loading="${eager?'eager':'lazy'}" fetchpriority="${eager?'high':'low'}" decoding="async" width="342" height="513">`;
    const hover=editorial
      ?`<span class="hover"><b>Pourquoi OVNI</b><span>${esc(editorial)}</span></span>`
      :`<span class="hover"><b>${f.pts} pts</b><span>${f.votes} votes · Best rank ${f.best}</span></span>`;
    return `<button class="tile" type="button" data-top="${t}" data-r="${f.rank}" data-mode="${mode}">${img}${winner}<span class="rank">${f.rank}</span><span class="name">${esc(f.title)}</span>${hover}</button>`;
  }
  function ghostCard(g,t,i){
    const rank=Number(g.rank),rankAttr=Number.isFinite(rank)?` data-r="${rank}"`:'';
    const who=g.picker?` · ${esc(g.picker)}`:'';
    return `<button class="ghost-card" type="button" data-top="${t}" data-ghost="${i}"${rankAttr}><img src="${g.img}" alt="" loading="lazy" fetchpriority="low" decoding="async" width="342" height="513"><span class="ghost-copy"><b>${esc(g.title)}</b><span>${esc(g.copy)}${who}</span></span></button>`;
  }
  function ovniReason(top,f){
    const custom=top.ovnis?.comments?.[String(f.rank)]||top.ovnis?.comments?.[f.rank];
    if(custom)return custom;
    const votes=Number.parseInt(String(f.votes),10)||0;
    if(votes<=1){
      if(String(f.best)==='#25')return 'Choix solitaire, placé #25 par son seul défenseur. Il ferme naturellement le classement.';
      return `Un seul vote, mais placé ${f.best} par son seul défenseur : beaucoup de conviction, presque aucun consensus.`;
    }
    return `${f.votes} votes, mais assez bas dans les listes pour terminer dans la marge du classement collectif.`;
  }
  function rankingBody(top,t,section={}){
    const count=Math.max(5,Math.min(top.films.length,Number(section.count)||25));
    return `<div class="heroTop coverflow" data-flow="hero">${top.films.slice(0,5).map(f=>filmTile(f,t)).join('')}</div><div class="grid coverflow" data-flow="rest">${top.films.slice(5,count).map(f=>filmTile(f,t)).join('')}</div>`;
  }
  function fullBody(top,t,section){
    const first=Math.min(section.batch||25,Math.max(0,top.films.length-(section.start-1)));
    loadedFull.set(`${top.id}:full`,first);
    return `<div class="full-scroll-shell"><div class="full-scroll"><div class="full-progress">Affichés <b class="full-range">#${section.start}–${section.start+first-1}</b></div><div class="grid compact coverflow full-grid" data-flow="full" data-start="${section.start}" data-batch="${section.batch||25}">${top.films.slice(section.start-1,section.start-1+first).map(f=>filmTile(f,t,'full',true)).join('')}</div><div class="full-loader is-hidden"><span class="full-loader-ring"></span><span>Suite du classement</span></div><div class="full-reveal-overlay"><button class="full-reveal-button" type="button"><span class="full-reveal-plus">+</span><span>Voir plus</span></button></div></div></div>`;
  }
  function bottomBody(top,t,section){
    const ranks=(top.ovnis?.ranks||top.films.slice(-(section.count||5)).map(f=>f.rank)).filter((r,i,a)=>a.indexOf(r)===i);
    const films=ranks.map(r=>top.films.find(f=>f.rank===r)).filter(Boolean);
    return `<div class="grid coverflow" data-flow="bottom">${films.map(f=>filmTile(f,t,'bottom',false,ovniReason(top,f))).join('')}</div>`;
  }
  function sectionBody(s,top,t){
    if(s.kind==='top25')return rankingBody(top,t,s);
    if(s.kind==='full')return fullBody(top,t,s);
    if(s.kind==='ghosts')return `<div class="ghosts coverflow-ghosts">${(top.ghosts||[]).map((g,i)=>ghostCard(g,t,i)).join('')}</div>`;
    if(s.kind==='bottom')return bottomBody(top,t,s);
    return '';
  }
  function sectionMarkup(s,top,t,i){
    const rendered=i===0;
    return `<section class="sec ${rendered?'open':''}" data-kind="${s.kind}" data-section-index="${i}" data-rendered="${rendered?'1':'0'}"><button class="toggle" type="button" aria-expanded="${rendered?'true':'false'}"><div><div class="k">${esc(s.kicker)}</div><strong>${esc(s.title)}</strong></div><span class="arr">↓</span></button><div class="content"><div class="inner"><div class="pad">${rendered?sectionBody(s,top,t):''}</div></div></div></section>`;
  }

  function insightCard(item){
    return `<div class="insight-item"${item.key?` data-insight="${esc(item.key)}"`:''}><button class="insight-card" type="button" aria-expanded="false"><span class="insight-icon">${item.icon||'◎'}</span><span><b>${esc(item.title)}</b><span>${esc(item.sub)}</span></span><span class="insight-chevron">↓</span></button><div class="insight-detail" aria-hidden="true"><div><ul>${(item.bullets||[]).map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div></div></div>`;
  }
  function yearCard(item){
    const start=item.yearStart,end=start+item.bars.length-1,titleYears=yearsFromText(item.title,start,end);
    const notes=(item.notes||[]).map(note=>{
      const yrs=yearsFromText(note,start,end),parts=String(note).split(/\s+[—-]\s+/);
      return `<button class="year-highlight" type="button" data-years="${yrs.join(',')}"><b>${esc(parts[0]||note)}</b><span>${esc(parts.slice(1).join(' — ')||'Voir dans le graphique')}</span></button>`;
    }).join('');
    const decadeMatch=String(item.sub||'').match(/((?:19|20)\d{2}\s*[–-]\s*(?:19|20)\d{2})[^\d]*(\d+%)/);
    const decadeYears=decadeMatch?yearsFromText(decadeMatch[1],start,end):[];
    const summary=decadeMatch?`<button class="year-insight-decade" type="button" data-years="${decadeYears.join(',')}"><b>${esc(decadeMatch[1])}</b><strong>${esc(decadeMatch[2])}</strong></button>`:'';
    const countText=String(item.sub||'').split('·')[0].trim();
    return `<div class="year-insight-card"><button class="year-toggle" type="button" aria-expanded="false"><div class="year-insight-kicker special-card-label"><span>${esc(item.label)}</span></div><div class="year-insight-year">${esc(item.title)}</div><div class="year-insight-maincount">${esc(countText)}</div><span class="year-arrow">↓</span></button><div class="year-insight-detail" aria-hidden="true"><div class="year-insight-detail-inner">${summary}<div class="year-chart" aria-label="Nombre de films par année de ${start} à ${end}">${item.bars.map((v,i)=>`<span class="year-chart-bar${titleYears.includes(start+i)?' hot':''}" style="--v:${v}" data-y="${start+i}" tabindex="0" aria-label="${start+i} : ${v} film${v>1?'s':''}"></span>`).join('')}</div><div class="year-highlights">${notes}</div></div></div></div>`;
  }
  function directorsCard(item){
    const entries=item.entries||[];
    const normalized=entries.map((e,i)=>Array.isArray(e)?{name:e[0],films:e[1],img:item.faces?.[i]?`../assets/posters/1975-1999/${item.faces[i]}.jpg`:''}:e);
    const faces=normalized.slice(0,4).map(e=>e.img?`${e.url?`<a class="director-face" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(e.name)} sur IMDb">`:'<span class="director-face">'}<img src="${esc(e.img)}" alt="" loading="lazy" decoding="async">${e.url?'</a>':'</span>'}`:'').join('');
    return `<div class="director-card"><div class="director-toggle"><button class="director-toggle-action" type="button" aria-expanded="false" aria-label="Afficher les autres réalisateurs"></button><div class="director-copy"><div class="director-k special-card-label"><span>${esc(item.label||'Réalisateurs')}</span></div><div class="director-title">${esc(item.title)}</div></div><div class="director-heading"><div class="director-faces">${faces}</div><span class="director-arrow">↓</span></div></div><div class="director-detail" aria-hidden="true"><div class="director-detail-inner"><div class="director-list">${normalized.map(e=>e.url?`<a class="director-row" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${e.img?`<img src="${esc(e.img)}" alt="${esc(e.name)}" loading="lazy" decoding="async">`:''}<div><b>${esc(e.name)}</b><div class="director-films">${esc(e.films)}</div></div></a>`:`<div class="director-row director-row-text"><div><b>${esc(e.name)}</b><div class="director-films">${esc(e.films)}</div></div></div>`).join('')}</div></div></div></div>`;
  }
  const sidebar=top=>`<aside class="site-sidebar"><div class="sidebar-title">Insights collectifs</div>${(top.sidebar||[]).map(i=>i.kind==='year'?yearCard(i):i.kind==='directors'?directorsCard(i):insightCard(i)).join('')}</aside>`;

  function heroTitle(top,t){
    const hero=top.hero||{};
    if(hero.titleArt){
      const alt=esc(hero.titleAlt||top.label),width=esc(hero.titleMaxWidth||'920px'),offset=esc(hero.titleOffsetY||'0px'),fit=esc(hero.titleFit||'contain');
      const medals=top.films.slice(0,3).map((f,i)=>`<span class="hero-medallion" style="--i:${i}"><img src="${f.img}" alt="" loading="lazy" decoding="async"></span>`).join('');
      return `<div class="hero-title-art-wrap" style="--hero-title-max:${width};--hero-title-y:${offset}" aria-label="${alt}"><img class="hero-title-art" src="${hero.titleArt}" alt="${alt}" loading="${t===topIndex?'eager':'lazy'}" decoding="async" style="object-fit:${fit}"></div>${medals?`<div class="hero-top-three hero-art-medallions" aria-hidden="true">${medals}</div>`:''}`;
    }
    return `<h1><span class="hero-title-line"><span>${esc(hero.line||'Top films')}</span><span class="hero-top-three">${top.films.slice(0,3).map(f=>`<span class="hero-medallion"><img src="${f.img}" alt="" loading="lazy"></span>`).join('')}</span></span><em>${esc(hero.em||top.label)}</em></h1>`;
  }
  function screen(top,t){
    const hero=top.hero||{},position=hero.position||'center',fit=hero.fit||'cover',scale=Number.isFinite(hero.scale)?hero.scale:1;
    const eager=t===topIndex;
    return `<section class="era-screen" data-top-id="${top.id}" style="${themeVars(top)}"><header class="hero-header"><img class="hero-media" src="${hero.image}" alt="" loading="${eager?'eager':'lazy'}" fetchpriority="${eager?'high':'low'}" decoding="async" style="object-position:${position};object-fit:${fit};--hero-media-scale:${scale}"><nav class="hero-nav"><span>Aimer Star Wars à 40 ans</span><span>${esc(top.community)} · <small>v1.0 platform</small></span></nav><div class="hero-title">${heroTitle(top,t)}</div></header><div class="shell"><div class="site-layout"><main><div class="stack">${top.sections.map((s,i)=>sectionMarkup(s,top,t,i)).join('')}</div></main>${sidebar(top)}</div></div></section>`;
  }
  function makeScreen(i){const box=document.createElement('div');box.innerHTML=screen(TOPS[i],i);return box.firstElementChild}

  function hydrateDeferred(root){root?.querySelectorAll?.('.poster-deferred[data-src]').forEach(img=>{img.src=img.dataset.src;img.onload=()=>img.classList.add('is-loaded');delete img.dataset.src})}
  function decodeScreen(root){
    const scope=root?.matches?.('.sec')?root:(root?.querySelector?.('.sec.open')||root);
    scope?.querySelectorAll?.('.tile img').forEach((img,j)=>{if(j<5&&img.decode)img.decode().catch(()=>{})});
    const full=scope?.querySelector?.('.full-grid');if(full)hydrateDeferred(full);
  }
  function hydrateSection(sec){
    if(!sec||sec.dataset.rendered==='1')return;
    const screenEl=sec.closest('.era-screen'),t=TOPS.findIndex(x=>x.id===screenEl?.dataset.topId),top=TOPS[t];
    const index=Number(sec.dataset.sectionIndex),section=top?.sections?.[index],pad=sec.querySelector('.pad');
    if(!top||!section||!pad)return;
    pad.innerHTML=sectionBody(section,top,t);sec.dataset.rendered='1';
    bindTiles(sec);bindGhosts(sec);bindCoverFlow(sec);bindFullReveal(sec);decodeScreen(sec);
  }
  function bindSections(root){
    root.querySelectorAll('.sec').forEach(sec=>{
      const body=sec.querySelector('.content'),inner=sec.querySelector('.inner'),toggle=sec.querySelector('.toggle');
      let heightTimer=0;
      if(sec.classList.contains('open'))body.style.height='auto';
      toggle.onclick=()=>{
        clearTimeout(heightTimer);
        const open=!sec.classList.contains('open');if(open)hydrateSection(sec);sec.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));
        if(open){
          body.style.height=inner.scrollHeight+'px';
          heightTimer=setTimeout(()=>{if(sec.classList.contains('open'))body.style.height='auto'},540);
        }else{
          body.style.height=body.scrollHeight+'px';
          requestAnimationFrame(()=>{if(!sec.classList.contains('open'))body.style.height='0px'});
        }
      };
    });
  }
  function bindSidebar(root){
    root.querySelectorAll('.insight-item').forEach(card=>{
      const btn=card.querySelector('.insight-card'),detail=card.querySelector('.insight-detail');
      btn?.addEventListener('click',()=>{const open=card.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(open));detail?.setAttribute('aria-hidden',String(!open))});
    });
    root.querySelectorAll('.year-insight-card').forEach(card=>{
      const btn=card.querySelector('.year-toggle'),detail=card.querySelector('.year-insight-detail'),chart=card.querySelector('.year-chart'),bars=[...card.querySelectorAll('.year-chart-bar')];
      btn?.addEventListener('click',()=>{const open=card.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(open));detail?.setAttribute('aria-hidden',String(!open))});
      const hi=el=>{const ys=(el.dataset.years||el.dataset.y||'').split(',').filter(Boolean);if(!ys.length)return;chart?.classList.add('is-exploring');bars.forEach(b=>b.classList.toggle('is-highlighted',ys.includes(b.dataset.y)))};
      const clear=()=>{chart?.classList.remove('is-exploring');bars.forEach(b=>b.classList.remove('is-highlighted'))};
      card.querySelectorAll('[data-years],.year-chart-bar').forEach(el=>{el.addEventListener('pointerenter',()=>hi(el));el.addEventListener('pointerleave',clear);el.addEventListener('focus',()=>hi(el));el.addEventListener('blur',clear)});
    });
    root.querySelectorAll('.director-card').forEach(card=>{
      const btn=card.querySelector('.director-toggle-action'),detail=card.querySelector('.director-detail');
      btn?.addEventListener('click',()=>{const open=card.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(open));detail?.setAttribute('aria-hidden',String(!open))});
    });
  }
  function resetFlow(el){el.classList.remove('cf-active','cf-near1','cf-near2','cf-near3');el.style.removeProperty('--cf-x')}
  function bindCoverFlow(root){
    root.querySelectorAll('.coverflow').forEach(group=>{
      if(group.dataset.bound)return;group.dataset.bound='1';
      group.addEventListener('pointerover',e=>{
        const active=e.target.closest('.tile');if(!active||!group.contains(active))return;
        const tiles=[...group.querySelectorAll('.tile')],ar=active.getBoundingClientRect(),ay=ar.top+ar.height/2;
        const same=tiles.map(el=>{const r=el.getBoundingClientRect();return{el,x:r.left+r.width/2,y:r.top+r.height/2}}).filter(x=>Math.abs(x.y-ay)<ar.height*.42).sort((a,b)=>a.x-b.x);
        const idx=same.findIndex(x=>x.el===active),mode=group.dataset.flow;group.classList.add('coverflow-active');tiles.forEach(resetFlow);
        same.forEach((x,j)=>{const d=Math.abs(j-idx),side=j<idx?-1:1;if(!d)x.el.classList.add('cf-active');else if(d===1){x.el.classList.add('cf-near1');x.el.style.setProperty('--cf-x',`${side*(mode==='full'?16:mode==='rest'||mode==='bottom'?14:8)}px`)}else if(d===2){x.el.classList.add('cf-near2');x.el.style.setProperty('--cf-x',`${side*(mode==='full'?10:mode==='rest'||mode==='bottom'?7:4)}px`)}else if(d===3&&mode==='full'){x.el.classList.add('cf-near3');x.el.style.setProperty('--cf-x',`${side*5}px`)}});
      });
      group.addEventListener('pointerleave',()=>{group.classList.remove('coverflow-active');group.querySelectorAll('.tile').forEach(resetFlow)});
    });
    root.querySelectorAll('.coverflow-ghosts').forEach(group=>{
      if(group.dataset.bound)return;group.dataset.bound='1';
      group.addEventListener('pointerover',e=>{const a=e.target.closest('.ghost-card');if(!a)return;const cards=[...group.querySelectorAll('.ghost-card')],i=cards.indexOf(a);group.classList.add('ghost-active');cards.forEach((c,j)=>{c.classList.remove('ghost-focus','ghost-near');c.style.removeProperty('--ghost-x');const d=Math.abs(j-i);if(!d)c.classList.add('ghost-focus');else if(d===1){c.classList.add('ghost-near');c.style.setProperty('--ghost-x',`${j<i?-8:8}px`)}})});
      group.addEventListener('pointerleave',()=>{group.classList.remove('ghost-active');group.querySelectorAll('.ghost-card').forEach(c=>c.classList.remove('ghost-focus','ghost-near'))});
    });
  }
  function revealMore(sec){
    if(sec.dataset.loadingMore==='1')return;
    const screenEl=sec.closest('.era-screen'),t=TOPS.findIndex(x=>x.id===screenEl.dataset.topId),top=TOPS[t],grid=sec.querySelector('.full-grid');
    const start=Number(grid.dataset.start),batch=Number(grid.dataset.batch),key=`${top.id}:full`,count=loadedFull.get(key)||batch,next=Math.min(top.films.length-(start-1),count+batch),loader=sec.querySelector('.full-loader'),button=sec.querySelector('.full-reveal-button');
    if(next<=count){updateReveal(sec);return}
    sec.dataset.loadingMore='1';if(button)button.disabled=true;loader.classList.remove('is-hidden');
    setTimeout(()=>{
      grid.insertAdjacentHTML('beforeend',top.films.slice(start-1+count,start-1+next).map(f=>filmTile(f,t,'full',true)).join(''));
      loadedFull.set(key,next);hydrateDeferred(grid);bindTiles(grid);bindCoverFlow(sec);sec.querySelector('.full-range').textContent=`#${start}–${start+next-1}`;loader.classList.add('is-hidden');
      sec.dataset.loadingMore='0';if(button)button.disabled=false;updateReveal(sec);
      const body=sec.querySelector('.content');if(body.style.height!=='auto')body.style.height=sec.querySelector('.inner').scrollHeight+'px';
    },180);
  }
  function updateReveal(sec){
    const screenEl=sec.closest('.era-screen'),top=TOPS.find(x=>x.id===screenEl.dataset.topId),grid=sec.querySelector('.full-grid');if(!grid)return;
    const start=Number(grid.dataset.start),key=`${top.id}:full`,count=loadedFull.get(key)||0,remaining=top.films.length-(start-1)-count,overlay=sec.querySelector('.full-reveal-overlay');if(!overlay)return;
    overlay.classList.toggle('is-hidden',remaining<=0);const label=overlay.querySelector('.full-reveal-button span:last-child');if(label)label.textContent=remaining>0?`Voir ${Math.min(Number(grid.dataset.batch),remaining)} de plus`:'Complet';
  }
  function bindFullReveal(root){root.querySelectorAll('.sec[data-kind="full"]').forEach(sec=>{const btn=sec.querySelector('.full-reveal-button');if(!btn)return;btn.onclick=()=>revealMore(sec);updateReveal(sec)})}
  function bindTiles(root){root.querySelectorAll('.tile').forEach(tile=>tile.onclick=()=>{const t=Number(tile.dataset.top),rank=Number(tile.dataset.r),i=TOPS[t].films.findIndex(f=>f.rank===rank);if(i>=0)openModal(t,i)})}
  function bindGhosts(root){root.querySelectorAll('.ghost-card[data-r]').forEach(card=>card.onclick=()=>{const t=Number(card.dataset.top),rank=Number(card.dataset.r),i=TOPS[t]?.films?.findIndex(f=>f.rank===rank);if(i>=0)openModal(t,i)})}
  function bindScreen(root,{decode=true}={}){bindSections(root);bindSidebar(root);bindTiles(root);bindGhosts(root);bindCoverFlow(root);bindFullReveal(root);if(decode)decodeScreen(root)}

  function updateHud(){
    hud.querySelectorAll('.era-dot').forEach((d,i)=>d.classList.toggle('active',i===topIndex));
    const label=hud.querySelector('.era-hud-label');if(label)label.textContent=TOPS[topIndex].label;
    prev.disabled=topIndex===0;next.disabled=topIndex===TOPS.length-1;
    prev.classList.toggle('disabled',prev.disabled);next.classList.toggle('disabled',next.disabled);
    document.documentElement.style.setProperty('--active-accent',TOPS[topIndex].theme.accent);
    stage.querySelectorAll('.era-screen').forEach((s,i)=>s.classList.toggle('is-active-top',i===topIndex));
  }
  function renderHud(){hud.innerHTML=`${TOPS.map((_,i)=>`<span class="era-dot${i===topIndex?' active':''}"></span>`).join('')}<span class="era-hud-label">${esc(TOPS[topIndex].label)}</span>`}
  function prewarmTop(i){
    if(i<0||i>=TOPS.length)return;const top=TOPS[i];if(prewarmed.has(top.id))return;prewarmed.add(top.id);
    idle(()=>[top.hero?.image,top.hero?.titleArt,...top.films.slice(0,3).map(f=>f.img)].filter(Boolean).forEach(src=>{const img=new Image();img.decoding='async';img.fetchPriority='low';img.src=src;img.decode?.().catch(()=>{})}));
  }
  function setActive(i){
    i=clampTop(i);if(i===topIndex)return;topIndex=i;updateHud();prewarmTop(i-1);prewarmTop(i+1);
  }
  function settleRail(){
    scrollTimer=0;const i=clampTop(Math.round(stage.scrollLeft/W()));setActive(i);
    if(!suppressHistory&&location.pathname!==routeFor(i))writeRoute(i,pendingHistory);
    pendingHistory='push';
  }
  function onRailScroll(){
    if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;setActive(clampTop(Math.round(stage.scrollLeft/W()))) });
    clearTimeout(scrollTimer);scrollTimer=setTimeout(settleRail,120);
  }
  function goTo(i,{smooth=true,historyMode='push'}={}){
    const target=clampTop(i);pendingHistory=historyMode;
    stage.scrollTo({left:target*W(),top:0,behavior:smooth&&!reduced.matches?'smooth':'auto'});
    if(!smooth||reduced.matches){setActive(target);setTimeout(settleRail,0)}
  }

  function editorialFor(top,f){
    const ghost=(top.ghosts||[]).find(g=>Number(g.rank)===Number(f.rank));if(ghost?.copy)return `${ghost.copy}${ghost.picker?` · ${ghost.picker}`:''}`;
    const ranks=(top.ovnis?.ranks||[]).map(Number);if(!ranks.includes(Number(f.rank)))return '';
    return top.ovnis?.comments?.[String(f.rank)]||top.ovnis?.comments?.[f.rank]||ovniReason(top,f);
  }
  const letterboxdUrl=f=>f.letterboxd||`https://letterboxd.com/film/${letterboxdAliases[norm(f.title)]||slug(f.title)}/`;
  function backdropFor(top,f){
    if(f.backdrop)return f.backdrop;
    if(top.id==='sci-fi-realiste'&&f.rank===1)return 'https://image.tmdb.org/t/p/original/kdjNM3yOwtQkJIwHZPqvyY4p0Ul.jpg';
    if(top.id==='2000-2024'&&typeof filmBackdrops!=='undefined'){const src=filmBackdrops[String(f.rank)];if(src)return `../${src}`}
    return f.img;
  }
  function modalData(t,i){const top=TOPS[t],f=top?.films?.[i];if(!top||!f)return null;return{top,f,poster:f.img,backdrop:backdropFor(top,f),detail:top.details?.[String(f.rank)]||{},letterboxd:letterboxdUrl(f)}}
  function loadImage(src){return new Promise(resolve=>{if(!src)return resolve();const img=new Image();let done=false;const finish=()=>{if(done)return;done=true;resolve()};img.onload=finish;img.onerror=finish;img.src=src;if(img.complete)finish()})}
  function paintModal(data){
    const {top,f,poster,backdrop,detail,letterboxd}=data,note=editorialFor(top,f);
    modalPoster.src=poster;modalPoster.alt=`Affiche de ${f.title}`;modalBackdrop.src=backdrop;modalBackdrop.alt='';
    modalRank.textContent=`#${f.rank} · classement collectif`;modalTitle.textContent=f.title;
    modalStats.innerHTML=`<span><b>${f.pts}</b> points</span><span><b>${f.votes}</b> votes</span><span>Best rank <b>${f.best}</b></span>`;
    modalBody.innerHTML=`${detail.headline?`<p><b>${esc(detail.headline)}</b></p>`:''}${detail.body?`<p>${esc(detail.body)}</p>`:''}${note?`<p class="modal-ovni-editorial"><b>Pourquoi OVNI</b><br>${esc(note)}</p>`:''}<a class="modal-detail-link" href="${esc(letterboxd)}" target="_blank" rel="noopener noreferrer">Voir sur Letterboxd ↗</a>`;
  }
  function preloadModalNeighbor(dir){const arr=TOPS[modalTop]?.films||[];if(!arr.length)return;const i=(modalIndex+dir+arr.length)%arr.length,data=modalData(modalTop,i);if(!data)return;loadImage(data.poster);if(data.backdrop!==data.poster)loadImage(data.backdrop)}
  async function openModal(t,i){
    const data=modalData(t,i);if(!data)return;const request=++modalRequest;await Promise.all([loadImage(data.poster),loadImage(data.backdrop)]);if(request!==modalRequest)return;
    modalTop=t;modalIndex=i;paintModal(data);mb.classList.add('open');mb.setAttribute('aria-hidden','false');requestAnimationFrame(()=>modalClose?.focus({preventScroll:true}));
    idle(()=>{preloadModalNeighbor(-1);preloadModalNeighbor(1)});
  }
  function clearModalSnapshot(){modalSnapshot?.remove();modalSnapshot=null}
  function closeModal(){modalRequest++;clearModalSnapshot();modalAnimating=false;mb.classList.remove('open');mb.setAttribute('aria-hidden','true');resetModalWheel()}
  function transitionModal(dir){
    if(modalAnimating)return;const arr=TOPS[modalTop]?.films||[];if(!arr.length)return;
    const nextIndex=(modalIndex+dir+arr.length)%arr.length,data=modalData(modalTop,nextIndex);if(!data)return;
    modalAnimating=true;modalRequest++;
    const rect=modal.getBoundingClientRect(),outgoing=modal.cloneNode(true);outgoing.removeAttribute('id');outgoing.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));outgoing.querySelectorAll('button,a').forEach(el=>{el.tabIndex=-1;el.style.pointerEvents='none'});
    Object.assign(outgoing.style,{position:'fixed',left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,margin:'0',zIndex:'60',pointerEvents:'none',transform:'none',opacity:'1'});mb.appendChild(outgoing);modalSnapshot=outgoing;
    modalIndex=nextIndex;paintModal(data);loadImage(data.poster);if(data.backdrop!==data.poster)loadImage(data.backdrop);
    if(reduced.matches){clearModalSnapshot();modalAnimating=false;idle(()=>{preloadModalNeighbor(-1);preloadModalNeighbor(1)});return}
    const inX=dir>0?56:-56,outX=dir>0?-94:94,duration=190;
    const incoming=modal.animate([{transform:`translate3d(${inX}px,0,0)`,opacity:.42},{transform:'translate3d(0,0,0)',opacity:1}],{duration,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    const leaving=outgoing.animate([{transform:'translate3d(0,0,0)',opacity:1},{transform:`translate3d(${outX}px,0,0)`,opacity:0}],{duration:170,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
    Promise.allSettled([incoming.finished,leaving.finished]).then(()=>{clearModalSnapshot();modalAnimating=false;modal.style.transform='';modal.style.opacity='';idle(()=>{preloadModalNeighbor(-1);preloadModalNeighbor(1)})});
  }
  function resetModalWheel(){clearTimeout(modalWheelTimer);modalWheelTimer=0;modalWheelAxis=null;modalWheelX=0;modalWheelY=0;modalWheelSignedX=0;modalWheelLocked=false}
  function scheduleModalWheelReset(){clearTimeout(modalWheelTimer);modalWheelTimer=setTimeout(()=>{if(!modalAnimating)resetModalWheel();else scheduleModalWheelReset()},125)}
  mb.addEventListener('wheel',e=>{
    if(!mb.classList.contains('open'))return;
    const ax=Math.abs(e.deltaX),ay=Math.abs(e.deltaY);modalWheelX+=ax;modalWheelY+=ay;modalWheelSignedX+=e.deltaX;
    if(!modalWheelAxis){if(modalWheelY>5&&modalWheelY>modalWheelX*1.08)modalWheelAxis='y';else if(modalWheelX>5&&modalWheelX>modalWheelY*1.08)modalWheelAxis='x'}
    scheduleModalWheelReset();
    if(modalWheelAxis!=='x')return;
    e.preventDefault();e.stopImmediatePropagation();if(modalWheelLocked||modalAnimating)return;
    if(modalWheelX>=64){modalWheelLocked=true;transitionModal(modalWheelSignedX>=0?1:-1)}
  },{passive:false,capture:true});

  modalClose.onclick=closeModal;modalPrev.onclick=()=>transitionModal(-1);modalNext.onclick=()=>transitionModal(1);mb.onclick=e=>{if(e.target===mb)closeModal()};

  const initial=routeIndex();topIndex=initial>=0?initial:0;
  renderHud();
  stage.classList.add('native-carousel');
  const screens=TOPS.map((_,i)=>makeScreen(i));stage.replaceChildren(...screens);screens.forEach(s=>bindScreen(s,{decode:s===screens[topIndex]}));
  stage.scrollLeft=topIndex*W();updateHud();prewarmTop(topIndex-1);prewarmTop(topIndex+1);
  suppressHistory=true;requestAnimationFrame(()=>requestAnimationFrame(()=>{suppressHistory=false;if(initial<0||/^\/v2\/?$/.test(location.pathname))writeRoute(topIndex,'replace');else history.replaceState({topId:TOPS[topIndex].id},'',location.href)}));

  stage.addEventListener('scroll',onRailScroll,{passive:true});
  prev.onclick=()=>goTo(topIndex-1);next.onclick=()=>goTo(topIndex+1);
  hud.addEventListener('click',e=>{const dots=[...hud.querySelectorAll('.era-dot')],i=dots.indexOf(e.target);if(i>=0)goTo(i)});
  addEventListener('keydown',e=>{
    if(mb.classList.contains('open')){if(e.key==='Escape')closeModal();else if(e.key==='ArrowLeft'){e.preventDefault();transitionModal(-1)}else if(e.key==='ArrowRight'){e.preventDefault();transitionModal(1)}return}
    if(e.target?.closest?.('button,a,input,select,textarea,[contenteditable="true"]'))return;
    if(e.key==='ArrowLeft'){e.preventDefault();goTo(topIndex-1)}else if(e.key==='ArrowRight'){e.preventDefault();goTo(topIndex+1)}
  });
  addEventListener('resize',()=>{clearTimeout(scrollTimer);stage.scrollTo({left:topIndex*W(),behavior:'auto'})},{passive:true});
  addEventListener('popstate',()=>{const i=routeIndex();if(i<0)return;suppressHistory=true;pendingHistory='replace';goTo(i,{smooth:false,historyMode:'replace'});requestAnimationFrame(()=>suppressHistory=false)});
})();