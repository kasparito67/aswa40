(()=>{
  const stage=document.getElementById('stage');
  const app=document.getElementById('app');
  const hud=document.getElementById('eraHud');
  const prev=document.getElementById('eraPrev');
  const next=document.getElementById('eraNext');
  const modalBg=document.getElementById('modalBg');
  const modalPoster=document.getElementById('modalPoster');
  const modalBackdrop=document.getElementById('modalBackdrop');
  const modalRank=document.getElementById('modalRank');
  const modalTitle=document.getElementById('modalTitle');
  const modalStats=document.getElementById('modalStats');
  const modalClose=document.getElementById('modalClose');
  const modalPrev=document.getElementById('modalPrev');
  const modalNext=document.getElementById('modalNext');

  let eraIndex=0;
  let drag=null;
  let wheel=0;
  let wheelTimer=null;
  let animating=false;
  let modalTopIndex=0;
  let modalFilmIndex=0;

  const width=()=>window.innerWidth;
  const baseX=()=>-eraIndex*width();

  function filmTile(f,topIndex){
    return `<button class="tile" type="button" data-top="${topIndex}" data-film="${f.rank-1}">
      <img loading="${f.rank>10?'lazy':'eager'}" src="${f.img}" alt="">
      <span class="rank">#${f.rank}</span>
      <span class="name">${f.title}</span>
      <span class="hover"><b>${f.pts} pts</b><span>${f.votes} votes · meilleur ${f.best}</span></span>
    </button>`;
  }

  function sectionMarkup(section,top,topIndex,index){
    const isOpen=index===0;
    let body='';
    if(section.kind==='ranking'){
      body=`<div class="top5">${top.films.slice(0,5).map(f=>filmTile(f,topIndex)).join('')}</div><div class="grid">${top.films.slice(5,25).map(f=>filmTile(f,topIndex)).join('')}</div>`;
    }else body=`<p style="margin:0;color:#c2c8ca;line-height:1.55">${section.copy||''}</p>`;
    return `<section class="section${isOpen?' open':''}"><button class="section-head" type="button"><span><small>${section.kicker}</small><strong>${section.title}</strong></span><i>↓</i></button><div class="section-body"><div class="section-inner">${body}</div></div></section>`;
  }

  function sidebarMarkup(top){
    return `<aside class="sidebar"><div class="sidebar-title">Insights collectifs</div>${top.insights.map(i=>`<div class="side-card"><button class="side-toggle" type="button"><span class="side-icon">${i.icon||'◎'}</span><span><b class="side-title">${i.title}</b><span class="side-sub">${i.sub||''}</span></span><span class="side-arrow">↓</span></button><div class="side-detail">${i.detail||''}</div></div>`).join('')}</aside>`;
  }

  function heroTitle(top){
    if(top.hero.titleArt)return `<div class="hero-title-art" style="background-image:url('${top.hero.titleArt}')"></div>`;
    return `<h1><span class="line">${top.hero.line||'Top films'}</span><span class="hero-top-three">${top.films.slice(0,3).map(f=>`<span class="hero-medallion"><img src="${f.img}" alt=""></span>`).join('')}</span><em>${top.hero.em||top.label}</em></h1>`;
  }

  function screenMarkup(top,topIndex){
    return `<section class="era-screen" data-top-id="${top.id}">
      <header class="hero">
        <img class="hero-bg" src="${top.hero.image}" alt="" aria-hidden="true">
        <div class="hero-nav"><span>Aimer Star Wars à 40 ans</span><span>${top.community} · v1.0 rebuild</span></div>
        <div class="hero-title">${heroTitle(top)}</div>
      </header>
      <div class="shell"><div class="site-layout"><main><div class="stack">${top.sections.map((s,i)=>sectionMarkup(s,top,topIndex,i)).join('')}</div></main>${sidebarMarkup(top)}</div></div>
    </section>`;
  }

  function render(){
    stage.style.width=`${TOPS.length*100}vw`;
    stage.innerHTML=TOPS.map(screenMarkup).join('');
    hud.innerHTML=`${TOPS.map((_,i)=>`<span class="era-dot${i===eraIndex?' active':''}"></span>`).join('')}<span class="era-hud-label">${TOPS[eraIndex].label}</span>`;
    bindSections();
    bindTiles();
    bindSidebars();
  }

  function bindSections(){
    document.querySelectorAll('.section').forEach(sec=>{
      const body=sec.querySelector('.section-body');
      if(sec.classList.contains('open'))body.style.height='auto';
      sec.querySelector('.section-head').addEventListener('click',()=>{
        const opening=!sec.classList.contains('open');
        sec.classList.toggle('open',opening);
        if(opening){body.style.height=sec.querySelector('.section-inner').scrollHeight+'px';setTimeout(()=>body.style.height='auto',540)}
        else{body.style.height=body.scrollHeight+'px';requestAnimationFrame(()=>body.style.height='0px')}
      });
    });
  }

  function bindSidebars(){
    document.querySelectorAll('.side-card').forEach(card=>card.querySelector('.side-toggle').addEventListener('click',()=>card.classList.toggle('open')));
  }

  function bindTiles(){
    document.querySelectorAll('.tile').forEach(tile=>tile.addEventListener('click',()=>openModal(Number(tile.dataset.top),Number(tile.dataset.film))));
  }

  function updateHud(){
    hud.querySelectorAll('.era-dot').forEach((d,i)=>d.classList.toggle('active',i===eraIndex));
    const label=hud.querySelector('.era-hud-label');if(label)label.textContent=TOPS[eraIndex].label;
    prev.disabled=eraIndex===0;next.disabled=eraIndex===TOPS.length-1;
    prev.style.opacity=eraIndex===0?'.22':'1';next.style.opacity=eraIndex===TOPS.length-1?'.22':'1';
  }

  function snap(to=eraIndex){
    eraIndex=Math.max(0,Math.min(TOPS.length-1,to));
    stage.classList.remove('dragging');
    stage.style.setProperty('--stage-x',`${-eraIndex*width()}px`);
    updateHud();
    animating=true;setTimeout(()=>animating=false,620);
  }

  function preview(dx){
    const edge=(eraIndex===0&&dx>0)||(eraIndex===TOPS.length-1&&dx<0);
    stage.style.setProperty('--stage-x',`${baseX()+dx*(edge?.22:1)}px`);
  }

  prev.addEventListener('click',()=>snap(eraIndex-1));
  next.addEventListener('click',()=>snap(eraIndex+1));

  app.addEventListener('pointerdown',e=>{
    if(e.target.closest('button,a,input,textarea,select')||animating||modalBg.classList.contains('open'))return;
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,t:performance.now(),locked:false};stage.classList.add('dragging');app.setPointerCapture?.(e.pointerId);
  });
  app.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    drag.dx=e.clientX-drag.x;const dy=e.clientY-drag.y;
    if(!drag.locked){if(Math.abs(drag.dx)<8&&Math.abs(dy)<8)return;if(Math.abs(dy)>Math.abs(drag.dx)*1.12){drag=null;stage.classList.remove('dragging');return}drag.locked=true}
    preview(drag.dx);e.preventDefault();
  },{passive:false});
  function finishDrag(){if(!drag)return;const d=drag;drag=null;const velocity=d.dx/Math.max(16,performance.now()-d.t);const commit=Math.abs(d.dx)>width()*.14||Math.abs(velocity)>.5;if(commit)snap(eraIndex+(d.dx<0?1:-1));else snap(eraIndex)}
  app.addEventListener('pointerup',finishDrag);app.addEventListener('pointercancel',finishDrag);

  window.addEventListener('wheel',e=>{
    if(modalBg.classList.contains('open')||animating)return;
    if(Math.abs(e.deltaX)<Math.abs(e.deltaY)*1.15)return;
    wheel+=e.deltaX;clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{wheel=0;snap(eraIndex)},180);preview(-wheel*.42);
    if(Math.abs(wheel)>115){const target=eraIndex+(wheel>0?1:-1);wheel=0;snap(target)}e.preventDefault();
  },{passive:false});

  function openModal(topIndex,filmIndex){
    modalTopIndex=topIndex;modalFilmIndex=filmIndex;const top=TOPS[topIndex],f=top.films[filmIndex];
    modalPoster.src=f.img;modalBackdrop.src=f.img;modalRank.textContent=`#${f.rank} · ${top.label}`;modalTitle.textContent=f.title;
    modalStats.innerHTML=`<span class="stat"><b>${f.pts}</b> points</span><span class="stat">${f.votes} votants</span><span class="stat">Meilleur rang ${f.best}</span>`;
    modalBg.classList.add('open');modalBg.setAttribute('aria-hidden','false');
  }
  function closeModal(){modalBg.classList.remove('open');modalBg.setAttribute('aria-hidden','true')}
  function stepModal(dir){const films=TOPS[modalTopIndex].films;modalFilmIndex=(modalFilmIndex+dir+films.length)%films.length;openModal(modalTopIndex,modalFilmIndex)}
  modalClose.addEventListener('click',closeModal);modalPrev.addEventListener('click',()=>stepModal(-1));modalNext.addEventListener('click',()=>stepModal(1));modalBg.addEventListener('click',e=>{if(e.target===modalBg)closeModal()});

  document.addEventListener('keydown',e=>{
    if(modalBg.classList.contains('open')){if(e.key==='Escape')closeModal();if(e.key==='ArrowLeft')stepModal(-1);if(e.key==='ArrowRight')stepModal(1);return}
    if(e.key==='ArrowLeft')snap(eraIndex-1);if(e.key==='ArrowRight')snap(eraIndex+1);
  });
  window.addEventListener('resize',()=>snap(eraIndex));

  render();snap(0);
})();
