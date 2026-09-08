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

  let topIndex=0,drag=null,wheelSum=0,wheelTimer=null,stageBusy=false;
  let modalTop=0,modalIndex=0,modalDrag=null;
  const loadedFull=new Map();
  const W=()=>innerWidth;
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function themeVars(top){return `--accent:${top.theme.accent};--secondary:${top.theme.secondary};--top-bg:${top.theme.bg};--top-panel:${top.theme.panel}`}
  function filmTile(f,t,mode='normal',defer=false){
    const winner=f.rank===1?'<span class="winner-crown" aria-hidden="true">♛</span>':'';
    const img=defer?`<img class="poster-deferred" data-src="${f.img}" alt="" loading="lazy" decoding="async">`:`<img src="${f.img}" alt="" loading="${f.rank<=25?'eager':'lazy'}" decoding="async">`;
    return `<button class="tile" type="button" data-top="${t}" data-r="${f.rank}" data-mode="${mode}">${img}${winner}<span class="rank">${f.rank}</span><span class="name">${esc(f.title)}</span><span class="hover"><b>${f.pts} pts</b><span>${f.votes} votes · Best rank ${f.best}</span></span></button>`;
  }

  function ghostCard(g,t,i){return `<button class="ghost-card" type="button" data-top="${t}" data-ghost="${i}"><img src="${g.img}" alt="" loading="lazy" decoding="async"><span class="ghost-copy"><b>${esc(g.title)}</b><span>${esc(g.copy)}</span></span></button>`}

  function rankingBody(top,t){return `<div class="heroTop coverflow" data-flow="hero">${top.films.slice(0,5).map(f=>filmTile(f,t)).join('')}</div><div class="grid coverflow" data-flow="rest">${top.films.slice(5,25).map(f=>filmTile(f,t)).join('')}</div>`}
  function fullBody(top,t,section){
    const first=Math.min(section.batch||25,Math.max(0,top.films.length-(section.start-1)));
    loadedFull.set(`${top.id}:full`,first);
    return `<div class="full-scroll-shell"><div class="full-scroll"><div class="full-progress">Affichés <b class="full-range">#${section.start}–${section.start+first-1}</b></div><div class="grid compact coverflow full-grid" data-flow="full" data-start="${section.start}" data-batch="${section.batch||25}">${top.films.slice(section.start-1,section.start-1+first).map(f=>filmTile(f,t,'full',true)).join('')}</div><div class="full-loader is-hidden"><span class="full-loader-ring"></span><span>Suite du classement</span></div><div class="full-reveal-overlay"><button class="full-reveal-button" type="button"><span class="full-reveal-plus">+</span><span>Voir plus</span></button></div></div></div>`
  }
  function sectionBody(s,top,t){
    if(s.kind==='top25')return rankingBody(top,t);
    if(s.kind==='full')return fullBody(top,t,s);
    if(s.kind==='ghosts')return `<div class="ghosts coverflow-ghosts">${top.ghosts.map((g,i)=>ghostCard(g,t,i)).join('')}</div>`;
    if(s.kind==='bottom')return `<div class="grid coverflow" data-flow="bottom">${top.films.slice(-s.count).map(f=>filmTile(f,t,'bottom')).join('')}</div>`;
    return '';
  }
  function sectionMarkup(s,top,t,i){return `<section class="sec ${i===0?'open':''}" data-kind="${s.kind}"><button class="toggle" type="button"><div><div class="k">${esc(s.kicker)}</div><strong>${esc(s.title)}</strong></div><span class="arr">↓</span></button><div class="content"><div class="inner"><div class="pad">${sectionBody(s,top,t)}</div></div></div></section>`}

  function insightCard(item){return `<div class="insight-item"><button class="insight-card" type="button" aria-expanded="false"><span class="insight-icon">${item.icon||'◎'}</span><span><b>${esc(item.title)}</b><span>${esc(item.sub)}</span></span><span class="insight-chevron">↓</span></button><div class="insight-detail"><div><ul>${(item.bullets||[]).map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div></div></div>`}
  function yearCard(item){const max=Math.max(...item.bars);return `<div class="year-card special-card"><button class="special-toggle" type="button" aria-expanded="false"><span><small>${esc(item.label)}</small><b class="big-year">${esc(item.title)}</b><span>${esc(item.sub)}</span></span><span class="insight-chevron">↓</span></button><div class="special-detail"><div class="year-chart">${item.bars.map((v,i)=>`<span class="year-bar${v===max?' hot':''}" style="--v:${v/max}" data-y="${item.yearStart+i}"></span>`).join('')}</div><div class="year-notes">${item.notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div></div></div>`}
  function directorsCard(item){return `<div class="directors-card special-card"><button class="special-toggle" type="button" aria-expanded="false"><span><small>${esc(item.label)}</small><b>${esc(item.title)}</b><span class="faces">${item.faces.map(slug=>`<span><img src="../assets/posters/1975-1999/${slug}.jpg" alt=""></span>`).join('')}</span></span><span class="insight-chevron">↓</span></button><div class="special-detail director-list">${item.entries.map(e=>`<div><b>${esc(e[0])}</b><span>${esc(e[1])}</span></div>`).join('')}</div></div>`}
  function sidebar(top){return `<aside class="site-sidebar"><div class="sidebar-title">Insights collectifs</div>${top.sidebar.map(i=>i.kind==='year'?yearCard(i):i.kind==='directors'?directorsCard(i):insightCard(i)).join('')}</aside>`}

  function heroTitle(top){
    if(top.hero.titleArt)return `<div class="hero-title-art" style="background-image:url('${top.hero.titleArt}')"></div><div class="hero-top-three hero-art-medallions">${top.films.slice(0,3).map(f=>`<span class="hero-medallion"><img src="${f.img}" alt=""></span>`).join('')}</div>`;
    return `<h1><span class="hero-title-line"><span>${esc(top.hero.line||'Top films')}</span><span class="hero-top-three">${top.films.slice(0,3).map(f=>`<span class="hero-medallion"><img src="${f.img}" alt=""></span>`).join('')}</span></span><em>${esc(top.hero.em||top.label)}</em></h1>`
  }
  function screen(top,t){return `<section class="era-screen" data-top-id="${top.id}" style="${themeVars(top)}"><header class="hero-header"><img class="hero-media" src="${top.hero.image}" alt="" style="object-position:${top.hero.position}"><nav class="hero-nav"><span>Aimer Star Wars à 40 ans</span><span>${esc(top.community)} · <small>v1.0 platform</small></span></nav><div class="hero-title">${heroTitle(top)}</div></header><div class="shell"><div class="site-layout"><main><div class="stack">${top.sections.map((s,i)=>sectionMarkup(s,top,t,i)).join('')}</div></main>${sidebar(top)}</div></div></section>`}

  function render(){stage.style.width=`${TOPS.length*100}vw`;stage.innerHTML=TOPS.map(screen).join('');hud.innerHTML=`${TOPS.map((_,i)=>`<span class="era-dot${i===0?' active':''}"></span>`).join('')}<span class="era-hud-label">${TOPS[0].label}</span>`;bindSections();bindSidebar();bindTiles();bindCoverFlow();bindFullReveal();decodeInitial();}

  function bindSections(){document.querySelectorAll('.sec').forEach(sec=>{const body=sec.querySelector('.content'),inner=sec.querySelector('.inner');if(sec.classList.contains('open'))body.style.height='auto';sec.querySelector('.toggle').onclick=()=>{const open=!sec.classList.contains('open');sec.classList.toggle('open',open);if(open){body.style.height=inner.scrollHeight+'px';setTimeout(()=>body.style.height='auto',540)}else{body.style.height=body.scrollHeight+'px';requestAnimationFrame(()=>body.style.height='0px')}}})}
  function bindSidebar(){document.querySelectorAll('.insight-card,.special-toggle').forEach(btn=>btn.onclick=()=>{const card=btn.parentElement,open=!card.classList.contains('open');card.classList.toggle('open',open);btn.setAttribute('aria-expanded',open)})}
  function bindTiles(root=document){root.querySelectorAll('.tile').forEach(tile=>tile.onclick=()=>{const top=Number(tile.dataset.top),rank=Number(tile.dataset.r),i=TOPS[top].films.findIndex(f=>f.rank===rank);openModal(top,i)})}

  function bindCoverFlow(root=document){if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;root.querySelectorAll('.coverflow').forEach(group=>{if(group.dataset.bound)return;group.dataset.bound='1';group.addEventListener('pointerover',e=>{const active=e.target.closest('.tile');if(!active||!group.contains(active))return;const tiles=[...group.querySelectorAll('.tile')],ar=active.getBoundingClientRect(),ay=ar.top+ar.height/2,same=tiles.map(el=>{const r=el.getBoundingClientRect();return{el,x:r.left+r.width/2,y:r.top+r.height/2}}).filter(x=>Math.abs(x.y-ay)<ar.height*.42).sort((a,b)=>a.x-b.x),idx=same.findIndex(x=>x.el===active),mode=group.dataset.flow;group.classList.add('coverflow-active');tiles.forEach(resetFlow);same.forEach((x,j)=>{const d=Math.abs(j-idx),side=j<idx?-1:1;if(!d)x.el.classList.add('cf-active');else if(d===1){x.el.classList.add('cf-near1');x.el.style.setProperty('--cf-x',`${side*(mode==='full'?16:mode==='rest'||mode==='bottom'?14:8)}px`)}else if(d===2){x.el.classList.add('cf-near2');x.el.style.setProperty('--cf-x',`${side*(mode==='full'?10:mode==='rest'||mode==='bottom'?7:4)}px`)}else if(d===3&&mode==='full'){x.el.classList.add('cf-near3');x.el.style.setProperty('--cf-x',`${side*5}px`)}})});group.addEventListener('pointerleave',()=>{group.classList.remove('coverflow-active');group.querySelectorAll('.tile').forEach(resetFlow)})});root.querySelectorAll('.coverflow-ghosts').forEach(group=>{if(group.dataset.bound)return;group.dataset.bound='1';group.addEventListener('pointerover',e=>{const a=e.target.closest('.ghost-card');if(!a)return;const cards=[...group.querySelectorAll('.ghost-card')],i=cards.indexOf(a);group.classList.add('ghost-active');cards.forEach((c,j)=>{c.classList.remove('ghost-focus','ghost-near');c.style.removeProperty('--ghost-x');const d=Math.abs(j-i);if(!d)c.classList.add('ghost-focus');else if(d===1){c.classList.add('ghost-near');c.style.setProperty('--ghost-x',`${j<i?-8:8}px`)}})});group.addEventListener('pointerleave',()=>{group.classList.remove('ghost-active');group.querySelectorAll('.ghost-card').forEach(c=>c.classList.remove('ghost-focus','ghost-near'))})})}
  function resetFlow(el){el.classList.remove('cf-active','cf-near1','cf-near2','cf-near3');el.style.removeProperty('--cf-x')}

  function bindFullReveal(){document.querySelectorAll('.sec[data-kind="full"]').forEach(sec=>{const btn=sec.querySelector('.full-reveal-button');if(!btn)return;btn.onclick=()=>revealMore(sec);updateReveal(sec)})}
  function revealMore(sec){const screen=sec.closest('.era-screen'),t=TOPS.findIndex(x=>x.id===screen.dataset.topId),top=TOPS[t],grid=sec.querySelector('.full-grid'),start=Number(grid.dataset.start),batch=Number(grid.dataset.batch),key=`${top.id}:full`,count=loadedFull.get(key)||batch,next=Math.min(top.films.length-(start-1),count+batch),loader=sec.querySelector('.full-loader');loader.classList.remove('is-hidden');setTimeout(()=>{grid.insertAdjacentHTML('beforeend',top.films.slice(start-1+count,start-1+next).map(f=>filmTile(f,t,'full',true)).join(''));loadedFull.set(key,next);hydrateDeferred(grid);bindTiles(grid);bindCoverFlow(sec);sec.querySelector('.full-range').textContent=`#${start}–${start+next-1}`;loader.classList.add('is-hidden');updateReveal(sec);const body=sec.querySelector('.content');if(body.style.height!=='auto')body.style.height=sec.querySelector('.inner').scrollHeight+'px'},180)}
  function updateReveal(sec){const screen=sec.closest('.era-screen'),top=TOPS.find(x=>x.id===screen.dataset.topId),grid=sec.querySelector('.full-grid'),start=Number(grid.dataset.start),key=`${top.id}:full`,count=loadedFull.get(key)||0,remaining=top.films.length-(start-1)-count,overlay=sec.querySelector('.full-reveal-overlay');overlay.classList.toggle('is-hidden',remaining<=0);const label=overlay.querySelector('.full-reveal-button span:last-child');if(label)label.textContent=remaining>0?`Voir ${Math.min(Number(grid.dataset.batch),remaining)} de plus`:'Complet'}
  function hydrateDeferred(root){root.querySelectorAll('.poster-deferred[data-src]').forEach(img=>{img.src=img.dataset.src;img.onload=()=>img.classList.add('is-loaded');delete img.dataset.src})}
  function decodeInitial(){document.querySelectorAll('.era-screen').forEach((screen,i)=>{screen.querySelectorAll('.tile img').forEach((img,j)=>{if(i===0||j<5){if(img.decode)img.decode().catch(()=>{})}})});hydrateDeferred(document.querySelectorAll('.full-grid')[0]||document)}

  function updateHud(){hud.querySelectorAll('.era-dot').forEach((d,i)=>d.classList.toggle('active',i===topIndex));hud.querySelector('.era-hud-label').textContent=TOPS[topIndex].label;prev.disabled=topIndex===0;next.disabled=topIndex===TOPS.length-1;prev.classList.toggle('disabled',prev.disabled);next.classList.toggle('disabled',next.disabled);document.documentElement.style.setProperty('--active-accent',TOPS[topIndex].theme.accent)}
  function snap(to=topIndex){topIndex=Math.max(0,Math.min(TOPS.length-1,to));stage.classList.remove('dragging');stage.style.setProperty('--stage-x',`${-topIndex*W()}px`);updateHud();stageBusy=true;setTimeout(()=>stageBusy=false,620);prewarmTop(topIndex+1);prewarmTop(topIndex-1)}
  function preview(dx){const edge=(topIndex===0&&dx>0)||(topIndex===TOPS.length-1&&dx<0);stage.style.setProperty('--stage-x',`${-topIndex*W()+dx*(edge?.22:1)}px`)}
  function prewarmTop(i){if(i<0||i>=TOPS.length)return;document.querySelectorAll('.era-screen')[i]?.querySelectorAll('.hero-media,.heroTop img').forEach(img=>{if(img.decode)img.decode().catch(()=>{})})}
  prev.onclick=()=>snap(topIndex-1);next.onclick=()=>snap(topIndex+1);

  app.addEventListener('pointerdown',e=>{if(e.target.closest('button,a,input,textarea,select')||stageBusy||mb.classList.contains('open'))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,t:performance.now(),locked:false};stage.classList.add('dragging');app.setPointerCapture?.(e.pointerId)});
  app.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;drag.dx=e.clientX-drag.x;const dy=e.clientY-drag.y;if(!drag.locked){if(Math.abs(drag.dx)<8&&Math.abs(dy)<8)return;if(Math.abs(dy)>Math.abs(drag.dx)*1.12){drag=null;stage.classList.remove('dragging');return}drag.locked=true}preview(drag.dx);e.preventDefault()},{passive:false});
  function finishDrag(){if(!drag)return;const d=drag;drag=null,v=d.dx/Math.max(16,performance.now()-d.t),commit=Math.abs(d.dx)>W()*.13||Math.abs(v)>.48;snap(commit?topIndex+(d.dx<0?1:-1):topIndex)}
  app.addEventListener('pointerup',finishDrag);app.addEventListener('pointercancel',finishDrag);
  addEventListener('wheel',e=>{if(mb.classList.contains('open')||stageBusy)return;if(Math.abs(e.deltaX)<Math.abs(e.deltaY)*1.18)return;wheelSum+=e.deltaX;clearTimeout(wheelTimer);preview(-wheelSum*.32);wheelTimer=setTimeout(()=>{wheelSum=0;snap(topIndex)},220);if(Math.abs(wheelSum)>145){const d=wheelSum>0?1:-1;wheelSum=0;snap(topIndex+d)}e.preventDefault()},{passive:false});

  function showModal(){const top=TOPS[modalTop],f=top.films[modalIndex];modalPoster.src=f.img;modalBackdrop.src=f.img;modalRank.textContent=`#${f.rank} · classement collectif`;modalTitle.textContent=f.title;modalStats.innerHTML=`<span><b>${f.pts}</b> points</span><span><b>${f.votes}</b> votes</span><span>Best rank <b>${f.best}</b></span>`;const d=top.details?.[String(f.rank)];modalBody.innerHTML=d?`<p><b>${esc(d.headline||'')}</b></p><p>${esc(d.body||'')}</p>`:'';preloadModalNeighbor(-1);preloadModalNeighbor(1)}
  function openModal(t,i){modalTop=t;modalIndex=i;showModal();mb.classList.add('open');mb.setAttribute('aria-hidden','false')}
  function closeModal(){mb.classList.remove('open');mb.setAttribute('aria-hidden','true')}
  function stepModal(dir){const arr=TOPS[modalTop].films;modalIndex=(modalIndex+dir+arr.length)%arr.length;const oldX=dir>0?-16:16;modal.animate([{opacity:.72,transform:`translateX(${oldX}px)`},{opacity:1,transform:'translateX(0)'}],{duration:190,easing:'cubic-bezier(.16,1,.3,1)'});showModal()}
  function preloadModalNeighbor(dir){const arr=TOPS[modalTop].films,i=(modalIndex+dir+arr.length)%arr.length,n=new Image();n.src=arr[i].img}
  modalClose.onclick=closeModal;modalPrev.onclick=()=>stepModal(-1);modalNext.onclick=()=>stepModal(1);mb.onclick=e=>{if(e.target===mb)closeModal()};
  modal.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.target.closest('button,a'))return;modalDrag={id:e.pointerId,x:e.clientX,dx:0};modal.setPointerCapture?.(e.pointerId)});modal.addEventListener('pointermove',e=>{if(!modalDrag||modalDrag.id!==e.pointerId)return;modalDrag.dx=e.clientX-modalDrag.x;modal.style.transform=`translateX(${modalDrag.dx*.55}px)`;modal.style.opacity=String(Math.max(.72,1-Math.abs(modalDrag.dx)/700))});modal.addEventListener('pointerup',()=>{if(!modalDrag)return;const dx=modalDrag.dx;modalDrag=null;modal.style.transform='';modal.style.opacity='';if(Math.abs(dx)>70)stepModal(dx<0?1:-1)});

  addEventListener('keydown',e=>{if(mb.classList.contains('open')){if(e.key==='Escape')closeModal();if(e.key==='ArrowLeft')stepModal(-1);if(e.key==='ArrowRight')stepModal(1);return}if(e.key==='ArrowLeft')snap(topIndex-1);if(e.key==='ArrowRight')snap(topIndex+1)});
  addEventListener('resize',()=>snap(topIndex));

  render();snap(0);
})();
