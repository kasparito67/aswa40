'use strict';

const letterboxdSlugs = {
  'Lord of the Rings': 'the-lord-of-the-rings-the-fellowship-of-the-ring',
  'Christopher Nolan’s Batman': 'the-dark-knight',
  'Kill Bill': 'kill-bill-vol-1',
  Dune: 'dune-part-one',
  'Harry Potter (franchise)': 'harry-potter-and-the-prisoner-of-azkaban',
  'OSS 117 (franchise)': 'oss-117-cairo-nest-of-spies',
  'Avengers (franchise)': 'the-avengers-2012',
  'Pirates of the Caribbean (franchise)': 'pirates-of-the-caribbean-the-curse-of-the-black-pearl',
  'X-Men (franchise)': 'x-men',
  'Bourne (franchise)': 'the-bourne-identity',
  'Spider-Verse (franchise)': 'spider-man-into-the-spider-verse',
};

function slug(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function letterboxdUrl(title) {
  const titleWithoutFranchise = title.replace(/\s*\(franchise\)\s*/i, '');
  return `https://letterboxd.com/film/${letterboxdSlugs[title] || slug(titleWithoutFranchise)}/`;
}

function tile(film, options = {}) {
  const lazy = options.lazy !== false;
  const image = film.img
    ? options.deferImages
      ? `<img class="poster-deferred" data-src="${film.img}" alt="" loading="lazy" decoding="async">`
      : `<img src="${film.img}" alt="" ${lazy ? 'loading="lazy"' : ''} decoding="async">`
    : '';

  return [
    `<button class="tile" data-r="${film.rank}">`,
    image,
    `<span class="rank">${film.rank}</span>`,
    `<span class="name">${film.title}</span>`,
    `<span class="hover"><b>${film.pts} pts</b>`,
    `<span>${film.votes} votes · Best rank ${film.best}</span></span>`,
    '</button>',
  ].join('');
}
const topHero=document.getElementById('topHero');
const topRest=document.getElementById('topRest');
const fullGrid=document.getElementById('full');
const bottomGrid=document.getElementById('bottom');
const fullScroll=document.getElementById('fullScroll');
const fullLoader=document.getElementById('fullLoader');
const fullRange=document.getElementById('fullRange');
const fullRevealOverlay=document.getElementById('fullRevealOverlay');
const fullRevealButton=document.getElementById('fullRevealButton');
const fullRevealLabel=document.getElementById('fullRevealLabel');
const ghostsEl=document.getElementById('ghosts');
const mb=document.getElementById('mb');
const modal=document.getElementById('modal');

function bindCoverFlow(){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  const topTiles=[...document.querySelectorAll('#topHero .tile, #topRest .tile')];

  function resetTile(tile){
    tile.classList.remove('cf-active','cf-near1','cf-near2','cf-near3');
    tile.style.removeProperty('--cf-x');
    tile.style.removeProperty('transform-origin');
  }

  function setSafeTransformOrigin(tile,viewport){
    const r=tile.getBoundingClientRect();
    const v=viewport.getBoundingClientRect();
    const x=r.left-v.left<r.width*.42?'left':v.right-r.right<r.width*.42?'right':'center';
    const y=r.top-v.top<r.height*.42?'top':v.bottom-r.bottom<r.height*.42?'bottom':'center';
    tile.style.transformOrigin=`${x} ${y}`;
  }

  const clearTop=()=>{
    topHero.classList.remove('coverflow-active');
    topRest.classList.remove('coverflow-active');
    topTiles.forEach(resetTile);
  };

  function applySameRowCoverFlow(tileEl, group, tiles, mode){
    const activeRect=tileEl.getBoundingClientRect();
    const activeY=activeRect.top + activeRect.height/2;

    const sameRow=tiles
      .map(el=>{
        const r=el.getBoundingClientRect();
        return {el,x:r.left+r.width/2,y:r.top+r.height/2};
      })
      .filter(item=>Math.abs(item.y-activeY) < activeRect.height*.42)
      .sort((a,b)=>a.x-b.x);

    const activeIndex=sameRow.findIndex(item=>item.el===tileEl);
    tiles.forEach(resetTile);

    sameRow.forEach((item,index)=>{
      const d=Math.abs(index-activeIndex);
      const side=index<activeIndex?-1:1;

      if(d===0){
        item.el.classList.add('cf-active');
      }else if(d===1){
        item.el.classList.add('cf-near1');
        item.el.style.setProperty('--cf-x',`${side*(mode==='rest'?14:8)}px`);
      }else if(d===2){
        item.el.classList.add('cf-near2');
        item.el.style.setProperty('--cf-x',`${side*(mode==='rest'?7:4)}px`);
      }
    });
  }

  const heroTiles=[...document.querySelectorAll('#topHero .tile')];
  const restTiles=[...document.querySelectorAll('#topRest .tile')];

  heroTiles.forEach(tileEl=>{
    tileEl.addEventListener('pointerenter',()=>{
      topHero.classList.add('coverflow-active');
      applySameRowCoverFlow(tileEl,topHero,heroTiles,'hero');
    });
  });

  restTiles.forEach(tileEl=>{
    tileEl.addEventListener('pointerenter',()=>{
      topRest.classList.add('coverflow-active');
      applySameRowCoverFlow(tileEl,topRest,restTiles,'rest');
      setSafeTransformOrigin(tileEl,topRest);
    });
  });

  topHero.addEventListener('pointerleave',()=> {
    topHero.classList.remove('coverflow-active');
    heroTiles.forEach(resetTile);
  });

  topRest.addEventListener('pointerleave',()=> {
    topRest.classList.remove('coverflow-active');
    restTiles.forEach(resetTile);
  });

  const clearFull=()=>{
    fullGrid.classList.remove('coverflow-active');
    fullGrid.querySelectorAll('.tile').forEach(resetTile);
  };

  fullGrid.addEventListener('pointerover',event=>{
      const tileEl=event.target.closest('.tile');
      if(!tileEl||!fullGrid.contains(tileEl)||tileEl.contains(event.relatedTarget)) return;
      const fullTiles=[...fullGrid.querySelectorAll('.tile')];
      fullGrid.classList.add('coverflow-active');

      // Cover-flow neighbours are determined visually within the SAME ROW,
      // not by ranking number. This prevents the first/last tiles of adjacent
      // rows from being treated as neighbours.
      const activeRect=tileEl.getBoundingClientRect();
      const activeY=activeRect.top + activeRect.height/2;

      const sameRow=fullTiles
        .map(el=>{
          const r=el.getBoundingClientRect();
          return {
            el,
            x:r.left + r.width/2,
            y:r.top + r.height/2
          };
        })
        .filter(item=>Math.abs(item.y-activeY) < activeRect.height*.42)
        .sort((a,b)=>a.x-b.x);

      const activeIndex=sameRow.findIndex(item=>item.el===tileEl);

      fullTiles.forEach(resetTile);

      sameRow.forEach((item,index)=>{
        const d=Math.abs(index-activeIndex);
        const side=index<activeIndex?-1:1;

        if(d===0){
          item.el.classList.add('cf-active');
          setSafeTransformOrigin(item.el,fullScroll);
        }else if(d===1){
          item.el.classList.add('cf-near1');
          item.el.style.setProperty('--cf-x',`${side*16}px`);
        }else if(d===2){
          item.el.classList.add('cf-near2');
          item.el.style.setProperty('--cf-x',`${side*10}px`);
        }else if(d===3){
          item.el.classList.add('cf-near3');
          item.el.style.setProperty('--cf-x',`${side*5}px`);
        }
      });
  });

  fullGrid.addEventListener('pointerleave',clearFull);

  // Les 10 derniers
  const bottomTiles=[...document.querySelectorAll('#bottom .tile')];
  const clearBottom=()=>{
    bottomGrid.classList.remove('coverflow-active');
    bottomTiles.forEach(resetTile);
  };

  bottomTiles.forEach(tileEl=>{
    tileEl.addEventListener('pointerenter',()=>{
      const activeRect=tileEl.getBoundingClientRect();
      const activeY=activeRect.top + activeRect.height/2;
      const sameRow=bottomTiles
        .map(el=>{
          const r=el.getBoundingClientRect();
          return {el,x:r.left+r.width/2,y:r.top+r.height/2};
        })
        .filter(item=>Math.abs(item.y-activeY)<activeRect.height*.42)
        .sort((a,b)=>a.x-b.x);

      const activeIndex=sameRow.findIndex(item=>item.el===tileEl);
      bottomGrid.classList.add('coverflow-active');
      bottomTiles.forEach(resetTile);

      sameRow.forEach((item,index)=>{
        const d=Math.abs(index-activeIndex);
        const side=index<activeIndex?-1:1;
        if(d===0){
          item.el.classList.add('cf-active');
          setSafeTransformOrigin(item.el,bottomGrid);
        }
        else if(d===1){
          item.el.classList.add('cf-near1');
          item.el.style.setProperty('--cf-x',`${side*14}px`);
        }else if(d===2){
          item.el.classList.add('cf-near2');
          item.el.style.setProperty('--cf-x',`${side*7}px`);
        }
      });
    });
  });
  bottomGrid.addEventListener('pointerleave',clearBottom);

  // Grands oublis
  const ghostCards=[...document.querySelectorAll('#ghosts .card')];
  const clearGhosts=()=>{
    ghostsEl.classList.remove('ghost-active');
    ghostCards.forEach(c=>{
      c.classList.remove('ghost-focus','ghost-near');
      c.style.removeProperty('--ghost-x');
    });
  };

  ghostCards.forEach(card=>{
    card.addEventListener('pointerenter',()=>{
      const activeRect=card.getBoundingClientRect();
      const activeY=activeRect.top+activeRect.height/2;
      const sameRow=ghostCards
        .map(el=>{
          const r=el.getBoundingClientRect();
          return {el,x:r.left+r.width/2,y:r.top+r.height/2};
        })
        .filter(item=>Math.abs(item.y-activeY)<activeRect.height*.42)
        .sort((a,b)=>a.x-b.x);

      const idx=sameRow.findIndex(item=>item.el===card);
      ghostsEl.classList.add('ghost-active');
      clearGhosts();
      ghostsEl.classList.add('ghost-active');

      sameRow.forEach((item,index)=>{
        const d=Math.abs(index-idx);
        const side=index<idx?-1:1;
        if(d===0) item.el.classList.add('ghost-focus');
        else if(d===1){
          item.el.classList.add('ghost-near');
          item.el.style.setProperty('--ghost-x',`${side*8}px`);
        }
      });
    });
  });
  ghostsEl.addEventListener('pointerleave',clearGhosts);
}

const heroTopThree=document.getElementById('heroTopThree');

function render(){
  heroTopThree.innerHTML=films
    .filter(film=>film.rank<=3)
    .map((film,index)=>[
      `<span class="hero-medallion" style="--i:${index}">`,
      `<img src="${film.img}" alt="#${film.rank} · ${film.title}">`,
      '</span>',
    ].join(''))
    .join('');
  topHero.innerHTML=films.filter(f=>f.rank<=5).map(f=>tile(f,{lazy:false})).join('');
  topRest.innerHTML=films.filter(f=>f.rank>=6 && f.rank<=25).map(f=>tile(f,{lazy:false})).join('');
  fullGrid.innerHTML='';
  bottomGrid.innerHTML=films.filter(f=>f.rank>=126).map(f=>tile(f,{lazy:true})).join('');
  ghostsEl.innerHTML=ghosts.map((ghost,index)=>[
    `<button class="card" data-g="${index}">`,
    `<img src="${ghost[2]}" alt="Affiche de ${ghost[0]}" loading="lazy" decoding="async">`,
    '<span class="ghost-copy">',
    `<b>${ghost[0]}</b>`,
    `<span>${ghost[1]}</span>`,
    '</span>',
    '</button>',
  ].join('')).join('');
  bindCoverFlow();
}
const modalRank=document.getElementById('mr');
const modalTitle=document.getElementById('mt');
const modalStats=document.getElementById('ms');
const modalBody=document.getElementById('body');
const modalThumb=document.getElementById('modalThumb');
const modalLayout=document.querySelector('.modal-layout');

function setModalThumb(src,title=''){
  if(src){
    modalLayout.classList.remove('no-thumb');
    modalThumb.classList.remove('empty');
    modalThumb.innerHTML=`<img src="${src}" alt="Affiche de ${title}">`;
  }else{
    modalLayout.classList.add('no-thumb');
    modalThumb.classList.add('empty');
    modalThumb.innerHTML='';
  }
}

const specificDetailRanks=new Set([1,2,8,10,28,52,77]);

function showFilm(r){
  const f=films.find(x=>x.rank==r),d=details[String(r)];
  modalRank.textContent='#'+f.rank+' · classement collectif';
  modalTitle.textContent=f.title;
  modalStats.innerHTML=`<span><b>${f.pts}</b> points</span><span><b>${f.votes}</b> votes</span><span>Best rank <b>${f.best}</b></span>`;
  setModalThumb(f.img,f.title);

  let extra='';
  if(d && specificDetailRanks.has(Number(f.rank))){
    extra=`<p><b>${d.headline}</b></p><p>${d.body}</p>`;
  }

  modalBody.innerHTML=extra+[
    `<a class="detail-link" href="${letterboxdUrl(f.title)}"`,
    ' target="_blank" rel="noopener noreferrer">Voir sur Letterboxd ↗</a>',
  ].join('');
  mb.classList.add('open');
}
const insights={
  religion: [
    'LOTR est partagé par presque tout le groupe.',
    '8 cinéphiles sur 9 ont voté pour la franchise.',
    'JB est le seul absent.',
  ],
  consensus: [
    'Simon est le membre le plus proche du classement collectif.',
    '14 de ses 25 choix figurent dans le Top 25 commun.',
  ],
  duo: [
    'Alex + Simon partagent 11 films ou franchises.',
    'Alex + Claude en partagent 10.',
    'Quatre autres duos en partagent 8.',
  ],
  ovni: [
    'JB compte 17 choix uniques.',
    'Seulement 4 de ses choix figurent dans le Top 25 collectif.',
    'Quentin est plutôt l’OVNI cinéphile.',
  ],
};
function toggleInsight(k,trigger){
  const item=trigger.closest('.insight-item');
  const shouldOpen=!item.classList.contains('is-open');

  document.querySelectorAll('.insight-item').forEach(other=>{
    other.classList.remove('is-open');
    other.querySelector('.insight-card').setAttribute('aria-expanded','false');
  });

  if(shouldOpen){
    item.querySelector('.insight-detail ul').innerHTML=insights[k]
      .map(point=>`<li>${point}</li>`)
      .join('');
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded','true');
  }
}
function showGhost(i){
  let g=ghosts[i];
  setModalThumb(g[2],g[0]);
  modalRank.textContent='Grand absent · 0/9';
  modalTitle.textContent=g[0];
  modalStats.innerHTML='<span><b>0/9</b> votes</span>';
  modalBody.innerHTML=[
    `<p>${g[1]}</p>`,
    `<a class="detail-link" href="${letterboxdUrl(g[0])}"`,
    ' target="_blank" rel="noopener noreferrer">Voir sur Letterboxd ↗</a>',
  ].join('');
  mb.classList.add('open');
}

const sections=[...document.querySelectorAll('.sec')];
const fullRankingFilms=films.filter(f=>f.rank>25);
let fullLoadedCount=0;
let fullBatchLoading=false;

function updateFullReveal(){
  if(fullLoadedCount>=fullRankingFilms.length){
    fullRevealOverlay.classList.add('is-hidden');
    fullScroll.classList.add('is-complete');
    return;
  }
  fullRevealLabel.textContent='Voir plus';
  fullRevealButton.disabled=false;
  fullRevealOverlay.classList.remove('is-hidden');
}

function getFullColumnCount(){
  const tracks=getComputedStyle(fullGrid).gridTemplateColumns.split(' ').filter(Boolean).length;
  return Math.max(1,tracks);
}

function getNextFullTarget(){
  const columns=getFullColumnCount();
  const rows=columns>=9?3:columns>=5?4:6;
  const aligned=Math.ceil(fullLoadedCount/columns)*columns;
  return Math.min(fullRankingFilms.length,(fullLoadedCount===0?0:aligned)+columns*rows);
}

function loadBatchImages(images){
  return Promise.all(images.map(image=>new Promise(resolve=>{
    let settled=false;
    const settle=loaded=>{
      if(settled) return;
      settled=true;
      if(loaded) image.classList.add('is-loaded');
      resolve();
    };
    image.addEventListener('load',()=>settle(true),{once:true});
    image.addEventListener('error',()=>settle(false),{once:true});
    image.src=image.dataset.src;
    image.removeAttribute('data-src');
    if(image.complete) settle(image.naturalWidth>0);
  })));
}

async function appendFullBatch(){
  const section=fullGrid.closest('.full-ranking-sec');
  if(fullBatchLoading||fullLoadedCount>=fullRankingFilms.length||!section.classList.contains('open')) return;
  fullBatchLoading=true;
  fullRevealButton.disabled=true;
  fullRevealOverlay.classList.add('is-hidden');
  fullLoader.classList.remove('is-hidden');

  const target=getNextFullTarget();
  const batch=fullRankingFilms.slice(fullLoadedCount,target);
  fullGrid.insertAdjacentHTML('beforeend',batch.map(f=>tile(f,{lazy:true,deferImages:true})).join(''));
  fullLoadedCount=target;
  fullRange.textContent=`#26–${batch.at(-1).rank}`;

  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const images=[...fullGrid.querySelectorAll('img[data-src]')];
  await Promise.all([
    Promise.race([loadBatchImages(images),new Promise(resolve=>setTimeout(resolve,2400))]),
    new Promise(resolve=>setTimeout(resolve,420))
  ]);

  fullLoader.classList.add('is-hidden');
  fullBatchLoading=false;
  updateFullReveal();
}

fullRevealButton.addEventListener('click',appendFullBatch);

function finishOpen(section){
  if(section.classList.contains('full-ranking-sec')) return;
  const content=section.querySelector('.content');
  if(section.classList.contains('open')) content.style.height='auto';
}

function animateSectionEntry(section){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const inner=section.querySelector('.inner');
  if(!inner) return;
  section.classList.remove('is-opening');
  void inner.offsetWidth;
  section.classList.add('is-opening');
  inner.addEventListener('animationend',()=>{
    section.classList.remove('is-opening');
  },{once:true});
}

function openSection(section){
  const content=section.querySelector('.content');

  // The full ranking opens in normal page flow. Its already revealed batches
  // are preserved when the accordion is closed and reopened.
  if(section.classList.contains('full-ranking-sec')){
    content.style.removeProperty('height');
    section.classList.add('open');
    animateSectionEntry(section);
    if(fullBatchLoading) fullLoader.classList.remove('is-hidden');
    else if(fullLoadedCount>0) updateFullReveal();
    if(fullLoadedCount===0) requestAnimationFrame(()=>appendFullBatch());
    return;
  }

  section.classList.add('open');
  animateSectionEntry(section);
  content.style.height='0px';
  const targetHeight=content.scrollHeight;
  requestAnimationFrame(()=>{
    content.style.height=targetHeight+'px';
  });
  const done=e=>{
    if(e.propertyName!=='height') return;
    content.removeEventListener('transitionend',done);
    finishOpen(section);
  };
  content.addEventListener('transitionend',done);
}

function closeSection(section){
  if(!section.classList.contains('open')) return;
  const content=section.querySelector('.content');

  // The progressive ranking closes instantly without discarding its batches.
  if(section.classList.contains('full-ranking-sec')){
    content.style.removeProperty('height');
    fullLoader.classList.add('is-hidden');
    section.classList.remove('open');
    return;
  }

  content.style.height=content.scrollHeight+'px';
  content.offsetHeight;
  requestAnimationFrame(()=>{
    section.classList.remove('open');
    content.style.height='0px';
  });
}

const heroHeader=document.querySelector('.hero-header');
const heroMedia=document.querySelector('.hero-media');
const heroTitle=document.querySelector('.hero-title');
const heroNav=document.querySelector('.hero-nav');
const heroCue=document.querySelector('.hero-title-cue');
let parallaxQueued=false;

if(heroCue){
  heroCue.addEventListener('click',()=>{
    const topSection=document.querySelector('.stack .sec');
    if(!topSection) return;
    const top=window.scrollY+topSection.getBoundingClientRect().top-28;
    window.scrollTo({top,behavior:'smooth'});
  });
}

function updateHeroParallax(){
  const travel=Math.min(window.scrollY,heroHeader.offsetHeight*1.15);
  heroMedia.style.setProperty('--parallax-bg-y',`${travel*.28}px`);
  heroTitle.style.setProperty('--parallax-title-y',`${travel*.11}px`);
  heroNav.style.setProperty('--parallax-nav-y',`${travel*.045}px`);
  parallaxQueued=false;
}

if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  window.addEventListener('scroll',()=>{
    if(!parallaxQueued){
      parallaxQueued=true;
      requestAnimationFrame(updateHeroParallax);
    }
  },{passive:true});
  updateHeroParallax();
}

sections.forEach(section=>{
  const content=section.querySelector('.content');
  if(section.classList.contains('full-ranking-sec')){
    content.style.removeProperty('height');
  }else if(section.classList.contains('open')){
    content.style.height='auto';
  }else{
    content.style.height='0px';
  }

  const toggle=section.querySelector('.toggle');
  toggle.addEventListener('click',()=>{
    const shouldOpen=!section.classList.contains('open');
    if(shouldOpen) openSection(section);
    else closeSection(section);
  });
});

document.addEventListener('click',event=>{
  const filmTile=event.target.closest('.tile');
  if(filmTile) showFilm(filmTile.dataset.r);

  const insight=event.target.closest('[data-i]');
  if(insight) toggleInsight(insight.dataset.i,insight);

  const ghost=event.target.closest('[data-g]');
  if(ghost) showGhost(ghost.dataset.g);
});

modal.addEventListener('click',event=>event.stopPropagation());
mb.addEventListener('click',()=>mb.classList.remove('open'));
document.querySelector('.close').addEventListener('click',()=>mb.classList.remove('open'));

const directorQuartet=document.getElementById('directorQuartet');
const yearInsight=document.getElementById('yearInsight');

function bindSidebarAccordion(card,toggleSelector){
  if(!card) return;
  const toggle=card.querySelector(toggleSelector);
  toggle.addEventListener('click',()=>{
    const isOpen=card.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded',String(isOpen));
  });
}

bindSidebarAccordion(directorQuartet,'.director-toggle-action');
bindSidebarAccordion(yearInsight,'.year-toggle');

if(yearInsight){
  const yearChart=yearInsight.querySelector('.year-chart');
  const yearBars=[...yearInsight.querySelectorAll('.year-chart-bar')];
  const highlightYears=trigger=>{
    const years=(trigger.dataset.years||'').split(',');
    yearChart.classList.add('is-exploring');
    yearBars.forEach(bar=>bar.classList.toggle('is-highlighted',years.includes(bar.dataset.y)));
  };
  const clearHighlightedYears=()=>{
    yearChart.classList.remove('is-exploring');
    yearBars.forEach(bar=>bar.classList.remove('is-highlighted'));
  };

  yearInsight.querySelectorAll('.year-highlight,.year-insight-decade').forEach(trigger=>{
    trigger.addEventListener('pointerenter',()=>highlightYears(trigger));
    trigger.addEventListener('pointerleave',clearHighlightedYears);
    trigger.addEventListener('focus',()=>highlightYears(trigger));
    trigger.addEventListener('blur',clearHighlightedYears);
  });

  yearBars.forEach(bar=>{
    bar.addEventListener('pointerenter',()=>highlightYears({dataset:{years:bar.dataset.y}}));
    bar.addEventListener('pointerleave',clearHighlightedYears);
  });
}

render();
