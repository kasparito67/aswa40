(()=>{
  const stage=document.getElementById('stage');
  const app=document.getElementById('app');
  const hud=document.getElementById('eraHud');
  const prev=document.getElementById('eraPrev');
  const next=document.getElementById('eraNext');
  const mb=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const modalContent=modal?.querySelector('.modal-content');
  const modalPoster=document.getElementById('modalPoster');
  const modalBackdrop=document.getElementById('modalBackdrop');
  const modalRank=document.getElementById('modalRank');
  const modalTitle=document.getElementById('modalTitle');
  const modalStats=document.getElementById('modalStats');
  const modalBody=document.getElementById('modalBody');
  const modalClose=document.getElementById('modalClose');
  const modalPrev=document.getElementById('modalPrev');
  const modalNext=document.getElementById('modalNext');

  let topIndex=0,drag=null,stageBusy=false,transition=null;
  let wheelSum=0,wheelTimer=null,wheelGestureLocked=false;
  let modalTop=0,modalIndex=0,modalDrag=null,modalRequest=0;
  let modalWheelSum=0,modalWheelLocked=false,modalWheelQuiet=null;
  let suppressClickTarget=null,suppressClickUntil=0;
  const loadedFull=new Map();
  const scrollByTop=new Map();
  const prewarmed=new Set();
  const W=()=>innerWidth;
  const mobileRuntime=matchMedia('(max-width:700px)').matches||matchMedia('(pointer:coarse)').matches;
  const idle=cb=>('requestIdleCallback' in window?requestIdleCallback(cb,{timeout:900}):setTimeout(cb,120));
  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const slug=s=>norm(s).replace(/\s+/g,'-');
  const clampTop=i=>Math.max(0,Math.min(TOPS.length-1,i));
  const routeFor=i=>`/tops/${TOPS[clampTop(i)].id}`;
  const routeIndex=(path=location.pathname)=>{
    const match=String(path).match(/^\/tops\/([^/]+)\/?$/);
    if(!match)return -1;
    const id=decodeURIComponent(match[1]);
    return TOPS.findIndex(top=>top.id===id);
  };
  const routeUrl=i=>`${routeFor(i)}${location.search}${location.hash}`;
  const yearsFromText=(text,min,max)=>{const out=new Set();[...String(text).matchAll(/(19\d{2}|20\d{2})\s*[–-]\s*(?:(19\d{2}|20\d{2})|(\d{2}))/g)].forEach(m=>{const a=Number(m[1]),b=Number(m[2]||String(a).slice(0,2)+m[3]);for(let y=Math.min(a,b);y<=Math.max(a,b);y++)if(y>=min&&y<=max)out.add(y)});String(text).match(/(?:19|20)\d{2}/g)?.forEach(y=>{const n=Number(y);if(n>=min&&n<=max)out.add(n)});return [...out]};

  const letterboxdAliases={
    'lord of the rings':'the-lord-of-the-rings-the-fellowship-of-the-ring',
    'spirited away':'spirited-away',
    'goodfellas':'goodfellas',
    'children of men':'children-of-men',
    'akira':'akira',
    'the social network':'the-social-network',
    'schindlers list':'schindlers-list',
    'catch me if you can':'catch-me-if-you-can',
    'wall e':'wall-e',
    'a i artificial intelligence':'ai-artificial-intelligence'
  };

  function themeVars(top){return `--accent:${top.theme.accent};--secondary:${top.theme.secondary};--top-bg:${top.theme.bg};--top-panel:${top.theme.panel}`}
  function filmTile(f,t,mode='normal',defer=false,editorial=''){
    const winner=f.rank===1?'<span class="winner-crown" aria-hidden="true">♛</span>':'';
    const eager=mode==='normal'&&Number(f.rank)<=5;
    const img=defer
      ?`<img class="poster-deferred" data-src="${f.img}" alt="" loading="lazy" decoding="async" width="342" height="513">`
      :`<img src="${f.img}" alt="" loading="${eager?'eager':'lazy'}" fetchpriority="${eager?'high':'low'}" decoding="async" width="342" height="513">`;
    const hover=editorial?`<span class="hover"><b>Pourquoi OVNI</b><span>${esc(editorial)}</span></span>`:`<span class="hover"><b>${f.pts} pts</b><span>${f.votes} votes · Best rank ${f.best}</span></span>`;
    return `<button class="tile" type="button" data-top="${t}" data-r="${f.rank}" data-mode="${mode}">${img}${winner}<span class="rank">${f.rank}</span><span class="name">${esc(f.title)}</span>${hover}</button>`;
  }
  function ghostCard(g,t,i){const rank=Number(g.rank);const rankAttr=Number.isFinite(rank)?` data-r="${rank}"`:'';const who=g.picker?` · ${esc(g.picker)}`:'';return `<button class="ghost-card" type="button" data-top="${t}" data-ghost="${i}"${rankAttr}><img src="${g.img}" alt="" loading="lazy" fetchpriority="low" decoding="async" width="342" height="513"><span class="ghost-copy"><b>${esc(g.title)}</b><span>${esc(g.copy)}${who}</span></span></button>`}
  function rankingBody(top,t,section={}){const count=Math.max(5,Math.min(top.films.length,Number(section.count)||25));return `<div class="heroTop coverflow" data-flow="hero">${top.films.slice(0,5).map(f=>filmTile(f,t)).join('')}</div><div class="grid coverflow" data-flow="rest">${top.films.slice(5,count).map(f=>filmTile(f,t)).join('')}</div>`}
  function fullBody(top,t,section){const first=Math.min(section.batch||25,Math.max(0,top.films.length-(section.start-1)));loadedFull.set(`${top.id}:full`,first);return `<div class="full-scroll-shell"><div class="full-scroll"><div class="full-progress">Affichés <b class="full-range">#${section.start}–${section.start+first-1}</b></div><div class="grid compact coverflow full-grid" data-flow="full" data-start="${section.start}" data-batch="${section.batch||25}">${top.films.slice(section.start-1,section.start-1+first).map(f=>filmTile(f,t,'full',true)).join('')}</div><div class="full-loader is-hidden"><span class="full-loader-ring"></span><span>Suite du classement</span></div><div class="full-reveal-overlay"><button class="full-reveal-button" type="button"><span class="full-reveal-plus">+</span><span>Voir plus</span></button></div></div></div>`}
  function ovniReason(top,f){
    const custom=top.ovnis?.comments?.[String(f.rank)]||top.ovnis?.comments?.[f.rank];
    if(custom)return custom;
    const votes=Number.parseInt(String(f.votes),10)||0;
    if(votes<=1){
      if(String(f.best)==='#25')return `Choix solitaire, placé #25 par son seul défenseur. Il ferme naturellement le classement.`;
      return `Un seul vote, mais placé ${f.best} par son seul défenseur : beaucoup de conviction, presque aucun consensus.`;
    }
    return `${f.votes} votes, mais assez bas dans les listes pour terminer dans la marge du classement collectif.`;
  }
  function bottomBody(top,t,section){
    const ranks=(top.ovnis?.ranks||top.films.slice(-(section.count||5)).map(f=>f.rank)).filter((r,i,a)=>a.indexOf(r)===i);
    const films=ranks.map(r=>top.films.find(f=>f.rank===r)).filter(Boolean);
    return `<div class="grid coverflow" data-flow="bottom">${films.map(f=>filmTile(f,t,'bottom',false,ovniReason(top,f))).join('')}</div>`;
  }
  function sectionBody(s,top,t){if(s.kind==='top25')return rankingBody(top,t,s);if(s.kind==='full')return fullBody(top,t,s);if(s.kind==='ghosts')return `<div class="ghosts coverflow-ghosts">${(top.ghosts||[]).map((g,i)=>ghostCard(g,t,i)).join('')}</div>`;if(s.kind==='bottom')return bottomBody(top,t,s);return ''}
  function sectionMarkup(s,top,t,i){const rendered=i===0;return `<section class="sec ${rendered?'open':''}" data-kind="${s.kind}" data-section-index="${i}" data-rendered="${rendered?'1':'0'}"><button class="toggle" type="button"><div><div class="k">${esc(s.kicker)}</div><strong>${esc(s.title)}</strong></div><span class="arr">↓</span></button><div class="content"><div class="inner"><div class="pad">${rendered?sectionBody(s,top,t):''}</div></div></div></section>`}

  function insightCard(item){return `<div class="insight-item"${item.key?` data-insight="${esc(item.key)}"`:''}><button class="insight-card" type="button" aria-expanded="false"><span class="insight-icon">${item.icon||'◎'}</span><span><b>${esc(item.title)}</b><span>${esc(item.sub)}</span></span><span class="insight-chevron">↓</span></button><div class="insight-detail" aria-hidden="true"><div><ul>${(item.bullets||[]).map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div></div></div>`}
  function yearCard(item){const start=item.yearStart,end=start+item.bars.length-1,titleYears=yearsFromText(item.title,start,end);const notes=(item.notes||[]).map(note=>{const yrs=yearsFromText(note,start,end),parts=String(note).split(/\s+[—-]\s+/);return `<button class="year-highlight" type="button" data-years="${yrs.join(',')}"><b>${esc(parts[0]||note)}</b><span>${esc(parts.slice(1).join(' — ')||'Voir dans le graphique')}</span></button>`}).join('');const decadeMatch=String(item.sub||'').match(/((?:19|20)\d{2}\s*[–-]\s*(?:19|20)\d{2})[^\d]*(\d+%)/),decadeYears=decadeMatch?yearsFromText(decadeMatch[1],start,end):[],summary=decadeMatch?`<button class="year-insight-decade" type="button" data-years="${decadeYears.join(',')}"><b>${esc(decadeMatch[1])}</b><strong>${esc(decadeMatch[2])}</strong></button>`:'',countText=String(item.sub||'').split('·')[0].trim();return `<div class="year-insight-card"><button class="year-toggle" type="button" aria-expanded="false"><div class="year-insight-kicker special-card-label"><span>${esc(item.label)}</span></div><div class="year-insight-year">${esc(item.title)}</div><div class="year-insight-maincount">${esc(countText)}</div><span class="year-arrow">↓</span></button><div class="year-insight-detail" aria-hidden="true"><div class="year-insight-detail-inner">${summary}<div class="year-chart" aria-label="Nombre de films par année de ${start} à ${end}">${item.bars.map((v,i)=>`<span class="year-chart-bar${titleYears.includes(start+i)?' hot':''}" style="--v:${v}" data-y="${start+i}" tabindex="0" aria-label="${start+i} : ${v} film${v>1?'s':''}"></span>`).join('')}</div><div class="year-highlights">${notes}</div></div></div></div>`}
  function directorsCard(item){const entries=item.entries||[],normEntries=entries.map((e,i)=>Array.isArray(e)?{name:e[0],films:e[1],img:item.faces?.[i]?`../assets/posters/1975-1999/${item.faces[i]}.jpg`:''}:e),faces=normEntries.slice(0,4).map(e=>e.img?`${e.url?`<a class="director-face" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(e.name)} sur IMDb">`:'<span class="director-face">'}<img src="${esc(e.img)}" alt="" loading="lazy" decoding="async">${e.url?'</a>':'</span>'}`:'').join('');return `<div class="director-card"><div class="director-toggle"><button class="director-toggle-action" type="button" aria-expanded="false" aria-label="Afficher les autres réalisateurs"></button><div class="director-copy"><div class="director-k special-card-label"><span>${esc(item.label||'Réalisateurs')}</span></div><div class="director-title">${esc(item.title)}</div></div><div class="director-heading"><div class="director-faces">${faces}</div><span class="director-arrow">↓</span></div></div><div class="director-detail" aria-hidden="true"><div class="director-detail-inner"><div class="director-list">${normEntries.map(e=>e.url?`<a class="director-row" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${e.img?`<img src="${esc(e.img)}" alt="${esc(e.name)}" loading="lazy" decoding="async">`:''}<div><b>${esc(e.name)}</b><div class="director-films">${esc(e.films)}</div></div></a>`:`<div class="director-row director-row-text"><div><b>${esc(e.name)}</b><div class="director-films">${esc(e.films)}</div></div></div>`).join('')}</div></div></div></div>`}
  function sidebar(top){return `<aside class="site-sidebar"><div class="sidebar-title">Insights collectifs</div>${(top.sidebar||[]).map(i=>i.kind==='year'?yearCard(i):i.kind==='directors'?directorsCard(i):insightCard(i)).join('')}</aside>`}

  function heroTitle(top){const hero=top.hero||{};if(hero.titleArt){const alt=esc(hero.titleAlt||top.label),width=esc(hero.titleMaxWidth||'920px'),offset=esc(hero.titleOffsetY||'0px'),fit=esc(hero.titleFit||'contain'),medals=top.films.slice(0,3).map((f,i)=>`<span class="hero-medallion" style="--i:${i}"><img src="${f.img}" alt="" decoding="async"></span>`).join('');return `<div class="hero-title-art-wrap" style="--hero-title-max:${width};--hero-title-y:${offset}" aria-label="${alt}"><img class="hero-title-art" src="${hero.titleArt}" alt="${alt}" loading="eager" decoding="async" style="object-fit:${fit}"></div>${medals?`<div class="hero-top-three hero-art-medallions" aria-hidden="true">${medals}</div>`:''}`};return `<h1><span class="hero-title-line"><span>${esc(hero.line||'Top films')}</span><span class="hero-top-three">${top.films.slice(0,3).map(f=>`<span class="hero-medallion"><img src="${f.img}" alt=""></span>`).join('')}</span></span><em>${esc(hero.em||top.label)}</em></h1>`}
  function screen(top,t){const hero=top.hero||{},position=hero.position||'center',fit=hero.fit||'cover',scale=Number.isFinite(hero.scale)?hero.scale:1;return `<section class="era-screen" data-top-id="${top.id}" style="${themeVars(top)}"><header class="hero-header"><img class="hero-media" src="${hero.image}" alt="" fetchpriority="high" decoding="async" style="object-position:${position};object-fit:${fit};--hero-media-scale:${scale}"><nav class="hero-nav"><span>Aimer Star Wars à 40 ans</span><span>${esc(top.community)} · <small>v1.0 platform</small></span></nav><div class="hero-title">${heroTitle(top)}</div></header><div class="shell"><div class="site-layout"><main><div class="stack">${top.sections.map((s,i)=>sectionMarkup(s,top,t,i)).join('')}</div></main>${sidebar(top)}</div></div></section>`}
  function makeScreen(i){const box=document.createElement('div');box.innerHTML=screen(TOPS[i],i);return box.firstElementChild}

  function renderHud(){hud.innerHTML=`${TOPS.map((_,i)=>`<span class="era-dot${i===topIndex?' active':''}"></span>`).join('')}<span class="era-hud-label">${esc(TOPS[topIndex].label)}</span>`}
  function hydrateDeferred(root){root?.querySelectorAll?.('.poster-deferred[data-src]').forEach(img=>{img.src=img.dataset.src;img.onload=()=>img.classList.add('is-loaded');delete img.dataset.src})}
  function decodeScreen(root){const scope=root?.matches?.('.sec')?root:(root?.querySelector?.('.sec.open')||root);scope?.querySelectorAll?.('.tile img').forEach((img,j)=>{if(j<5&&img.decode)img.decode().catch(()=>{})});const full=scope?.querySelector?.('.full-grid');if(full)hydrateDeferred(full)}
  function hydrateSection(sec){
    if(!sec||sec.dataset.rendered==='1')return;
    const screenEl=sec.closest('.era-screen');
    const t=TOPS.findIndex(x=>x.id===screenEl?.dataset.topId);
    const top=TOPS[t];
    const index=Number(sec.dataset.sectionIndex);
    const section=top?.sections?.[index];
    const pad=sec.querySelector('.pad');
    if(!top||!section||!pad)return;
    pad.innerHTML=sectionBody(section,top,t);
    sec.dataset.rendered='1';
    bindTiles(sec);bindGhosts(sec);bindCoverFlow(sec);bindFullReveal(sec);decodeScreen(sec);
  }
  function bindSections(root=document){root.querySelectorAll('.sec').forEach(sec=>{const body=sec.querySelector('.content'),inner=sec.querySelector('.inner');if(sec.classList.contains('open'))body.style.height='auto';sec.querySelector('.toggle').onclick=()=>{const open=!sec.classList.contains('open');if(open)hydrateSection(sec);sec.classList.toggle('open',open);if(open){body.style.height=inner.scrollHeight+'px';setTimeout(()=>body.style.height='auto',540)}else{body.style.height=body.scrollHeight+'px';requestAnimationFrame(()=>body.style.height='0px')}}})}
  function bindSidebar(root=document){
    root.querySelectorAll('.insight-item').forEach(card=>{const btn=card.querySelector('.insight-card'),detail=card.querySelector('.insight-detail');btn?.addEventListener('click',()=>{const open=card.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(open));detail?.setAttribute('aria-hidden',String(!open))})});
    root.querySelectorAll('.year-insight-card').forEach(card=>{const btn=card.querySelector('.year-toggle'),detail=card.querySelector('.year-insight-detail'),chart=card.querySelector('.year-chart'),bars=[...card.querySelectorAll('.year-chart-bar')];btn?.addEventListener('click',()=>{const open=card.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(open));detail?.setAttribute('aria-hidden',String(!open))});const hi=el=>{const ys=(el.dataset.years||el.dataset.y||'').split(',').filter(Boolean);if(!ys.length)return;chart?.classList.add('is-exploring');bars.forEach(b=>b.classList.toggle('is-highlighted',ys.includes(b.dataset.y)))};const clear=()=>{chart?.classList.remove('is-exploring');bars.forEach(b=>b.classList.remove('is-highlighted'))};card.querySelectorAll('[data-years],.year-chart-bar').forEach(el=>{el.addEventListener('pointerenter',()=>hi(el));el.addEventListener('pointerleave',clear);el.addEventListener('focus',()=>hi(el));el.addEventListener('blur',clear)})});
    root.querySelectorAll('.director-card').forEach(card=>{const btn=card.querySelector('.director-toggle-action'),detail=card.querySelector('.director-detail');btn?.addEventListener('click',()=>{const open=card.classList.toggle('is-open');btn.setAttribute('aria-expanded',String(open));detail?.setAttribute('aria-hidden',String(!open))})});
  }
  function bindTiles(root=document){root.querySelectorAll('.tile').forEach(tile=>tile.onclick=()=>{const top=Number(tile.dataset.top),rank=Number(tile.dataset.r),i=TOPS[top].films.findIndex(f=>f.rank===rank);openModal(top,i)})}
  function bindGhosts(root=document){root.querySelectorAll('.ghost-card[data-r]').forEach(card=>card.onclick=()=>{const t=Number(card.dataset.top),rank=Number(card.dataset.r),i=TOPS[t]?.films?.findIndex(f=>f.rank===rank);if(i>=0)openModal(t,i)})}
  function bindCoverFlow(root=document){if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;root.querySelectorAll('.coverflow').forEach(group=>{if(group.dataset.bound)return;group.dataset.bound='1';group.addEventListener('pointerover',e=>{const active=e.target.closest('.tile');if(!active||!group.contains(active))return;const tiles=[...group.querySelectorAll('.tile')],ar=active.getBoundingClientRect(),ay=ar.top+ar.height/2,same=tiles.map(el=>{const r=el.getBoundingClientRect();return{el,x:r.left+r.width/2,y:r.top+r.height/2}}).filter(x=>Math.abs(x.y-ay)<ar.height*.42).sort((a,b)=>a.x-b.x),idx=same.findIndex(x=>x.el===active),mode=group.dataset.flow;group.classList.add('coverflow-active');tiles.forEach(resetFlow);same.forEach((x,j)=>{const d=Math.abs(j-idx),side=j<idx?-1:1;if(!d)x.el.classList.add('cf-active');else if(d===1){x.el.classList.add('cf-near1');x.el.style.setProperty('--cf-x',`${side*(mode==='full'?16:mode==='rest'||mode==='bottom'?14:8)}px`)}else if(d===2){x.el.classList.add('cf-near2');x.el.style.setProperty('--cf-x',`${side*(mode==='full'?10:mode==='rest'||mode==='bottom'?7:4)}px`)}else if(d===3&&mode==='full'){x.el.classList.add('cf-near3');x.el.style.setProperty('--cf-x',`${side*5}px`)}})});group.addEventListener('pointerleave',()=>{group.classList.remove('coverflow-active');group.querySelectorAll('.tile').forEach(resetFlow)})});root.querySelectorAll('.coverflow-ghosts').forEach(group=>{if(group.dataset.bound)return;group.dataset.bound='1';group.addEventListener('pointerover',e=>{const a=e.target.closest('.ghost-card');if(!a)return;const cards=[...group.querySelectorAll('.ghost-card')],i=cards.indexOf(a);group.classList.add('ghost-active');cards.forEach((c,j)=>{c.classList.remove('ghost-focus','ghost-near');c.style.removeProperty('--ghost-x');const d=Math.abs(j-i);if(!d)c.classList.add('ghost-focus');else if(d===1){c.classList.add('ghost-near');c.style.setProperty('--ghost-x',`${j<i?-8:8}px`)}})});group.addEventListener('pointerleave',()=>{group.classList.remove('ghost-active');group.querySelectorAll('.ghost-card').forEach(c=>c.classList.remove('ghost-focus','ghost-near'))})})}
  function resetFlow(el){el.classList.remove('cf-active','cf-near1','cf-near2','cf-near3');el.style.removeProperty('--cf-x')}
  function bindFullReveal(root=document){root.querySelectorAll('.sec[data-kind="full"]').forEach(sec=>{const btn=sec.querySelector('.full-reveal-button');if(!btn)return;btn.onclick=()=>revealMore(sec);updateReveal(sec)})}
  function revealMore(sec){const screen=sec.closest('.era-screen'),t=TOPS.findIndex(x=>x.id===screen.dataset.topId),top=TOPS[t],grid=sec.querySelector('.full-grid'),start=Number(grid.dataset.start),batch=Number(grid.dataset.batch),key=`${top.id}:full`,count=loadedFull.get(key)||batch,next=Math.min(top.films.length-(start-1),count+batch),loader=sec.querySelector('.full-loader');loader.classList.remove('is-hidden');setTimeout(()=>{grid.insertAdjacentHTML('beforeend',top.films.slice(start-1+count,start-1+next).map(f=>filmTile(f,t,'full',true)).join(''));loadedFull.set(key,next);hydrateDeferred(grid);bindTiles(grid);bindCoverFlow(sec);sec.querySelector('.full-range').textContent=`#${start}–${start+next-1}`;loader.classList.add('is-hidden');updateReveal(sec);const body=sec.querySelector('.content');if(body.style.height!=='auto')body.style.height=sec.querySelector('.inner').scrollHeight+'px'},180)}
  function updateReveal(sec){const screen=sec.closest('.era-screen'),top=TOPS.find(x=>x.id===screen.dataset.topId),grid=sec.querySelector('.full-grid');if(!grid)return;const start=Number(grid.dataset.start),key=`${top.id}:full`,count=loadedFull.get(key)||0,remaining=top.films.length-(start-1)-count,overlay=sec.querySelector('.full-reveal-overlay');if(!overlay)return;overlay.classList.toggle('is-hidden',remaining<=0);const label=overlay.querySelector('.full-reveal-button span:last-child');if(label)label.textContent=remaining>0?`Voir ${Math.min(Number(grid.dataset.batch),remaining)} de plus`:'Complet'}
  function bindScreen(root,{decode=true}={}){bindSections(root);bindSidebar(root);bindTiles(root);bindGhosts(root);bindCoverFlow(root);bindFullReveal(root);if(decode)decodeScreen(root)}

  function updateHud(){hud.querySelectorAll('.era-dot').forEach((d,i)=>d.classList.toggle('active',i===topIndex));const label=hud.querySelector('.era-hud-label');if(label)label.textContent=TOPS[topIndex].label;prev.disabled=topIndex===0;next.disabled=topIndex===TOPS.length-1;prev.classList.toggle('disabled',prev.disabled);next.classList.toggle('disabled',next.disabled);document.documentElement.style.setProperty('--active-accent',TOPS[topIndex].theme.accent)}
  function currentScreen(){return stage.querySelector(`.era-screen[data-top-id="${TOPS[topIndex]?.id}"]`)||stage.querySelector('.era-screen')}
  function saveScroll(){const screen=currentScreen();if(screen)scrollByTop.set(TOPS[topIndex].id,screen.scrollTop)}
  function restoreScroll(screen,i){const y=scrollByTop.get(TOPS[i].id)||0;requestAnimationFrame(()=>{screen.scrollTop=y})}
  function writeRoute(i,mode='push'){const state={topId:TOPS[i].id};if(mode==='replace')history.replaceState(state,'',routeUrl(i));else if(mode==='push')history.pushState(state,'',routeUrl(i))}
  function prewarmTop(i){
    if(i<0||i>=TOPS.length)return;
    const top=TOPS[i];if(prewarmed.has(top.id))return;prewarmed.add(top.id);
    idle(()=>{
      const sources=(mobileRuntime?[top.hero?.image,top.hero?.titleArt]:[top.hero?.image,top.hero?.titleArt,...top.films.slice(0,3).map(f=>f.img)]).filter(Boolean);
      sources.forEach(src=>{const img=new Image();img.decoding='async';img.fetchPriority='low';img.src=src;if(img.decode)img.decode().catch(()=>{})});
    });
  }

  function mountTop(i,{restore=true}={}){
    topIndex=clampTop(i);transition=null;stageBusy=false;stage.classList.remove('dragging','is-transitioning');stage.style.transition='none';stage.style.width='100vw';stage.style.setProperty('--stage-x','0px');
    const el=makeScreen(topIndex);stage.replaceChildren(el);bindScreen(el);if(restore)restoreScroll(el,topIndex);updateHud();prewarmTop(topIndex-1);prewarmTop(topIndex+1);requestAnimationFrame(()=>{stage.style.transition=''})
  }

  function clearPrepared(){if(!transition)return;const keep=transition.current;stage.style.transition='none';stage.replaceChildren(keep);stage.style.width='100vw';stage.style.setProperty('--stage-x','0px');transition=null}
  function prepareTransition(target){
    target=clampTop(target);if(target===topIndex)return null;const direction=target>topIndex?1:-1;if(transition&&transition.target===target)return transition;if(transition)clearPrepared();const current=currentScreen();if(!current)return null;const incoming=makeScreen(target);restoreScroll(incoming,target);stage.style.transition='none';stage.style.width='200vw';if(direction>0){stage.replaceChildren(current,incoming);stage.style.setProperty('--stage-x','0px')}else{stage.replaceChildren(incoming,current);stage.style.setProperty('--stage-x',`${-W()}px`)}transition={from:topIndex,target,direction,current,incoming,baseX:direction>0?0:-W()};return transition;
  }
  function finalizeTransition(commit){if(!transition){stageBusy=false;return}const tr=transition,keep=commit?tr.incoming:tr.current;if(commit)topIndex=tr.target;stage.style.transition='none';stage.replaceChildren(keep);stage.style.width='100vw';stage.style.setProperty('--stage-x','0px');transition=null;stageBusy=false;stage.classList.remove('dragging','is-transitioning');if(commit){bindScreen(keep,{decode:false});updateHud();prewarmTop(topIndex-1);prewarmTop(topIndex+1);idle(()=>decodeScreen(keep))}}
  function settleTransition(commit,{historyMode='push'}={}){
    if(!transition)return;
    const tr=transition;
    if(commit&&historyMode!=='none')writeRoute(tr.target,historyMode);
    const finalX=commit?(tr.direction>0?-W():0):tr.baseX;
    const currentX=Number.parseFloat(stage.style.getPropertyValue('--stage-x'))||0;
    const ratio=Math.max(.08,Math.min(1,Math.abs(finalX-currentX)/Math.max(1,W())));
    const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:(mobileRuntime?Math.round(300+130*ratio):Math.round(240+100*ratio));
    const easing=mobileRuntime?'cubic-bezier(.32,.72,0,1)':'var(--ease)';
    stageBusy=true;stage.classList.remove('dragging');stage.classList.add('is-transitioning');
    if(!duration){stage.style.setProperty('--stage-x',`${finalX}px`);finalizeTransition(commit);return}
    stage.style.transition=`transform ${duration}ms ${easing}`;
    let done=false;
    let fallback=0;
    const finish=e=>{
      if(e&&(e.target!==stage||e.propertyName!=='transform'))return;
      if(done)return;done=true;stage.removeEventListener('transitionend',finish);clearTimeout(fallback);finalizeTransition(commit);
    };
    stage.addEventListener('transitionend',finish);
    fallback=setTimeout(()=>finish(),duration+120);
    requestAnimationFrame(()=>requestAnimationFrame(()=>stage.style.setProperty('--stage-x',`${finalX}px`)));
  }
  function previewTransition(delta,target){const tr=prepareTransition(target);if(!tr){stage.style.transition='transform .18s var(--ease)';stage.style.setProperty('--stage-x',`${delta*.18}px`);return}const amount=Math.max(-W(),Math.min(W(),delta));stage.style.transition='none';stage.style.setProperty('--stage-x',`${tr.baseX+amount}px`)}
  function snap(to,{historyMode='push',animate=true}={}){const target=clampTop(to);if(target===topIndex){if(transition)settleTransition(false);return}if(stageBusy)return;saveScroll();prepareTransition(target);if(!transition)return;if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){if(historyMode!=='none')writeRoute(target,historyMode);finalizeTransition(true);return}settleTransition(true,{historyMode})}

  prev.onclick=()=>snap(topIndex-1);next.onclick=()=>snap(topIndex+1);
  app.addEventListener('pointerdown',e=>{const interactive=e.target.closest('button,a,input,textarea,select');if((interactive&&e.pointerType!=='touch')||stageBusy||mb.classList.contains('open'))return;const now=performance.now();drag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,t:now,locked:false,interactive:e.pointerType==='touch'?interactive:null,lastX:e.clientX,lastT:now,v:0};stage.classList.add('dragging');app.setPointerCapture?.(e.pointerId)});
  app.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const now=performance.now(),dt=Math.max(1,now-drag.lastT),instant=(e.clientX-drag.lastX)/dt;drag.v=drag.v*.55+instant*.45;drag.lastX=e.clientX;drag.lastT=now;drag.dx=e.clientX-drag.x;const dy=e.clientY-drag.y;if(!drag.locked){if(Math.abs(drag.dx)<8&&Math.abs(dy)<8)return;if(Math.abs(dy)>Math.abs(drag.dx)*1.12){drag=null;stage.classList.remove('dragging');if(transition)settleTransition(false);return}drag.locked=true}const dir=drag.dx<0?1:-1,target=topIndex+dir;if(target<0||target>=TOPS.length){stage.style.setProperty('--stage-x',`${drag.dx*.18}px`)}else previewTransition(drag.dx,target);e.preventDefault()},{passive:false});
  function finishDrag(){if(!drag)return;const d=drag;drag=null;const v=Number.isFinite(d.v)?d.v:d.dx/Math.max(16,performance.now()-d.t),projected=d.dx+v*180,commit=Math.abs(projected)>W()*.28||Math.abs(d.dx)>W()*.5;if(d.locked&&d.interactive){suppressClickTarget=d.interactive;suppressClickUntil=performance.now()+520}if(commit&&transition){saveScroll();settleTransition(true)}else if(transition)settleTransition(false);else{stage.classList.remove('dragging');stage.style.transition='transform .22s var(--ease)';stage.style.setProperty('--stage-x','0px');setTimeout(()=>stage.style.transition='',240)}}
  app.addEventListener('pointerup',finishDrag);app.addEventListener('pointercancel',finishDrag);
  document.addEventListener('click',e=>{if(!e.isTrusted||!suppressClickTarget||performance.now()>suppressClickUntil){if(performance.now()>suppressClickUntil)suppressClickTarget=null;return}if(e.target===suppressClickTarget||suppressClickTarget.contains(e.target)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();suppressClickTarget=null}},true);

  function settleWheelAfterQuiet(){clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{if(!wheelGestureLocked&&transition)settleTransition(false);wheelSum=0;wheelGestureLocked=false},420)}
  addEventListener('wheel',e=>{if(mb.classList.contains('open'))return;if(Math.abs(e.deltaX)<Math.abs(e.deltaY)*1.18)return;e.preventDefault();settleWheelAfterQuiet();if(wheelGestureLocked||stageBusy)return;wheelSum+=e.deltaX;const dir=wheelSum>0?1:-1,target=topIndex+dir;if(target<0||target>=TOPS.length){stage.style.transition='none';stage.style.setProperty('--stage-x',`${-wheelSum*.07}px`);return}previewTransition(-wheelSum*.32,target);if(Math.abs(wheelSum)>145){saveScroll();wheelGestureLocked=true;settleTransition(true);wheelSum=0}},{passive:false});

  function letterboxdUrl(f){return f.letterboxd||`https://letterboxd.com/film/${letterboxdAliases[norm(f.title)]||slug(f.title)}/`}
  function backdropFor(top,f){if(f.backdrop)return f.backdrop;if(top.id==='sci-fi-realiste'&&f.rank===1)return 'https://image.tmdb.org/t/p/original/kdjNM3yOwtQkJIwHZPqvyY4p0Ul.jpg';if(top.id==='2000-2024'&&typeof filmBackdrops!=='undefined'){const src=filmBackdrops[String(f.rank)];if(src)return `../${src}`}return f.img}
  function modalData(t,i){const top=TOPS[t],f=top?.films?.[i];if(!top||!f)return null;const d=top.details?.[String(f.rank)]||{};return{top,f,poster:f.img,backdrop:backdropFor(top,f),detail:d,letterboxd:letterboxdUrl(f)}}
  function loadImage(src){return new Promise(resolve=>{if(!src)return resolve();const img=new Image();let done=false;const finish=()=>{if(done)return;done=true;resolve()};img.onload=finish;img.onerror=finish;img.src=src;if(img.complete)finish()})}
  function animateModalChange(dir){if(!dir||matchMedia('(prefers-reduced-motion: reduce)').matches)return;modalContent?.getAnimations().forEach(a=>a.cancel());modalBackdrop?.getAnimations().forEach(a=>a.cancel());modalContent?.animate([{opacity:.18,transform:`translate3d(${dir>0?72:-72}px,0,0)`},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:430,easing:'cubic-bezier(.16,1,.3,1)'});modalBackdrop?.animate([{opacity:.44,transform:`translate3d(${dir>0?28:-28}px,0,0) scale(1.07)`},{opacity:1,transform:'translate3d(0,0,0) scale(1.025)'}],{duration:520,easing:'cubic-bezier(.16,1,.3,1)'})}
  function paintModal(data,dir=0){const {f,poster,backdrop,detail,letterboxd}=data;modalPoster.src=poster;modalPoster.alt=`Affiche de ${f.title}`;modalBackdrop.src=backdrop;modalBackdrop.alt='';modalRank.textContent=`#${f.rank} · classement collectif`;modalTitle.textContent=f.title;modalStats.innerHTML=`<span><b>${f.pts}</b> points</span><span><b>${f.votes}</b> votes</span><span>Best rank <b>${f.best}</b></span>`;modalBody.innerHTML=`${detail.headline?`<p><b>${esc(detail.headline)}</b></p>`:''}${detail.body?`<p>${esc(detail.body)}</p>`:''}<a class="modal-detail-link" href="${esc(letterboxd)}" target="_blank" rel="noopener noreferrer">Voir sur Letterboxd ↗</a>`;animateModalChange(dir)}
  function preloadModalNeighbor(dir){const arr=TOPS[modalTop]?.films||[];if(!arr.length)return;const i=(modalIndex+dir+arr.length)%arr.length,data=modalData(modalTop,i);if(!data)return;loadImage(data.poster);if(!mobileRuntime&&data.backdrop!==data.poster)loadImage(data.backdrop)}
  async function renderModal(t,i,dir=0,open=false){const data=modalData(t,i);if(!data)return;const request=++modalRequest;const critical=mobileRuntime?[loadImage(data.poster)]:[loadImage(data.poster),loadImage(data.backdrop)];await Promise.all(critical);if(request!==modalRequest)return;modalTop=t;modalIndex=i;paintModal(data,dir);if(open){mb.classList.add('open');mb.setAttribute('aria-hidden','false');requestAnimationFrame(()=>modalClose?.focus({preventScroll:true}))}if(mobileRuntime&&data.backdrop!==data.poster)loadImage(data.backdrop);idle(()=>{preloadModalNeighbor(-1);preloadModalNeighbor(1)})}
  function openModal(t,i){modalTop=t;modalIndex=i;renderModal(t,i,0,true)}
  function closeModal(){modalRequest++;mb.classList.remove('open');mb.setAttribute('aria-hidden','true');resetModalWheel();modal.style.transform='';modal.style.opacity=''}
  function stepModal(dir){const arr=TOPS[modalTop]?.films||[];if(!arr.length)return;modalIndex=(modalIndex+dir+arr.length)%arr.length;renderModal(modalTop,modalIndex,dir,false)}
  function resetModalWheel(){modalWheelSum=0;modalWheelLocked=false;clearTimeout(modalWheelQuiet);modalWheelQuiet=null}
  function releaseModalWheelAfterQuiet(){clearTimeout(modalWheelQuiet);modalWheelQuiet=setTimeout(()=>{modalWheelLocked=false;modalWheelSum=0},520)}

  modalClose.onclick=closeModal;modalPrev.onclick=()=>stepModal(-1);modalNext.onclick=()=>stepModal(1);mb.onclick=e=>{if(e.target===mb)closeModal()};
  mb.addEventListener('wheel',e=>{if(!mb.classList.contains('open'))return;if(Math.abs(e.deltaX)<Math.abs(e.deltaY)*.78)return;e.preventDefault();e.stopPropagation();releaseModalWheelAfterQuiet();if(modalWheelLocked)return;modalWheelSum+=e.deltaX;if(Math.abs(modalWheelSum)>=64){const dir=modalWheelSum>0?1:-1;modalWheelSum=0;modalWheelLocked=true;stepModal(dir)}},{passive:false,capture:true});
  modal.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.target.closest('button,a'))return;modalDrag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0,locked:false};modal.setPointerCapture?.(e.pointerId)});
  modal.addEventListener('pointermove',e=>{if(!modalDrag||modalDrag.id!==e.pointerId)return;modalDrag.dx=e.clientX-modalDrag.x;modalDrag.dy=e.clientY-modalDrag.y;if(!modalDrag.locked){if(Math.abs(modalDrag.dx)<8&&Math.abs(modalDrag.dy)<8)return;if(Math.abs(modalDrag.dy)>Math.abs(modalDrag.dx)*1.05){modalDrag=null;modal.style.transform='';modal.style.opacity='';return}modalDrag.locked=true}modal.style.transform=`translateX(${modalDrag.dx*.55}px)`;modal.style.opacity=String(Math.max(.72,1-Math.abs(modalDrag.dx)/700));e.preventDefault()},{passive:false});
  function finishModalDrag(){if(!modalDrag)return;const dx=modalDrag.dx,locked=modalDrag.locked;modalDrag=null;modal.style.transform='';modal.style.opacity='';if(locked&&Math.abs(dx)>70)stepModal(dx<0?1:-1)}
  modal.addEventListener('pointerup',finishModalDrag);modal.addEventListener('pointercancel',finishModalDrag);

  addEventListener('keydown',e=>{if(mb.classList.contains('open')){if(e.key==='Escape'){closeModal();return}if(e.key==='ArrowLeft'){e.preventDefault();stepModal(-1);return}if(e.key==='ArrowRight'){e.preventDefault();stepModal(1);return}return}if(e.key==='ArrowLeft')snap(topIndex-1);if(e.key==='ArrowRight')snap(topIndex+1)});
  addEventListener('resize',()=>{if(transition)finalizeTransition(false);else stage.style.setProperty('--stage-x','0px')});
  addEventListener('popstate',()=>{const index=routeIndex();clearTimeout(wheelTimer);wheelSum=0;wheelGestureLocked=false;if(transition)finalizeTransition(false);saveScroll();if(index>=0)mountTop(index);else{writeRoute(0,'replace');mountTop(0)}});

  const initial=routeIndex();topIndex=initial>=0?initial:0;renderHud();mountTop(topIndex,{restore:false});if(initial<0||/^\/v2\/?$/.test(location.pathname))writeRoute(topIndex,'replace');else history.replaceState({topId:TOPS[topIndex].id},'',location.href);
})();