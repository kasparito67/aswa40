(()=>{
  const screen=document.querySelector('.era-screen[data-top-id="2000-2024"]');
  if(!screen)return;
  screen.classList.add('legacy-2000-parity');

  /* Header parity */
  const top=typeof TOPS!=='undefined'?TOPS.find(t=>t.id==='2000-2024'):null;
  const nav=screen.querySelector('.hero-nav');
  if(nav)nav.innerHTML='<span>Aimer Star Wars à 40 ans</span><span>Une communauté de 9 cinéphiles <small class="build-version" aria-label="Version 0.9.9">v0.9.9</small></span>';
  const title=screen.querySelector('.hero-title');
  if(title&&top){
    const medals=top.films.slice(0,3).map((f,i)=>`<span class="hero-medallion" style="--i:${i}"><img src="${f.img}" alt="#${f.rank} · ${f.title}"></span>`).join('');
    title.innerHTML=`<h1><span class="hero-title-line"><span>Top films</span><span class="hero-top-three" aria-label="Les trois premiers films du classement">${medals}</span></span><em>2000–2024</em></h1><button class="hero-title-cue" type="button" aria-label="Aller au Top 25"><svg viewBox="0 0 24 36"><path d="M12 2v30m-6-6 6 6 6-6"/></svg></button>`;
    title.querySelector('.hero-title-cue')?.addEventListener('click',()=>{
      const sec=screen.querySelector('.stack .sec');
      sec?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  /* Exact 2000 sidebar content/functionality */
  const sidebar=screen.querySelector('.site-sidebar');
  if(sidebar){
    sidebar.innerHTML=`
      <div class="sidebar-title">Insights collectifs</div>
      ${insight('religion','✝','Religion commune','LOTR · 8/9 · JB est le seul absent',['LOTR est partagé par presque tout le groupe.','8 cinéphiles sur 9 ont voté pour la franchise.','JB est le seul absent.'])}
      ${insight('consensus','◎','Monsieur Consensus','Simon · 14 films du Top 25',['Simon est le membre le plus proche du classement collectif.','14 de ses 25 choix figurent dans le Top 25 commun.'])}
      ${insight('duo','♡','Duo cinéphile','Alex + Simon · 11 en commun',['Alex + Simon partagent 11 films ou franchises.','Alex + Claude en partagent 10.','Quatre autres duos en partagent 8.'])}
      ${insight('ovni','◇','OVNI culturel','JB · 17 choix uniques',['JB compte 17 choix uniques.','Seulement 4 de ses choix figurent dans le Top 25 collectif.','Quentin est plutôt l’OVNI cinéphile.'])}
      <div class="year-insight-card" id="yearInsight2000">
        <button class="year-toggle" type="button" aria-expanded="false">
          <div class="year-insight-kicker">Année reine</div><div class="year-insight-year">2000</div><div class="year-insight-maincount">13 films</div><span class="year-arrow">↓</span>
        </button>
        <div class="year-insight-detail"><div class="year-insight-detail-inner">
          <button class="year-insight-decade" type="button" data-years="2000,2001,2002,2003,2004,2005,2006,2007,2008,2009"><b>2000–2009</b><strong>55%</strong></button>
          <div class="year-chart" aria-label="Nombre de films par année de 2000 à 2024">${[13,10,10,6,6,6,6,11,2,4,5,5,4,6,8,6,4,5,2,3,2,3,4,3,1].map((v,i)=>`<span class="year-chart-bar${i===0?' hot':''}" style="--v:${v}" data-y="${2000+i}"></span>`).join('')}</div>
          <div class="year-highlights"><button class="year-highlight" type="button" data-years="2007"><b>2007</b><span>11 films</span></button><button class="year-highlight" type="button" data-years="2001,2002"><b>2001–02</b><span>10 films chacune</span></button><button class="year-highlight" type="button" data-years="2024"><b>2024</b><span>1 seul film</span></button><button class="year-highlight" type="button" data-years="2008,2018,2020"><b>Le creux</b><span>2008 · 2018 · 2020</span></button></div>
        </div></div>
      </div>
      <div class="director-card" id="directorQuartet2000">
        <div class="director-toggle"><button class="director-toggle-action" type="button" aria-expanded="false" aria-label="Afficher les films des réalisateurs"></button><div class="director-copy"><div class="director-k special-card-label">Le quatuor</div><div class="director-title">4 films chacun</div></div><div class="director-heading"><div class="director-faces">
          ${face('Denis Villeneuve','https://www.imdb.com/name/nm0898288/','../assets/directors/denis-villeneuve.jpg')}${face('Christopher Nolan','https://www.imdb.com/name/nm0634240/','../assets/directors/christopher-nolan.jpg')}${face('Quentin Tarantino','https://www.imdb.com/name/nm0000233/','../assets/directors/quentin-tarantino.jpg')}${face('Wes Anderson','https://www.imdb.com/name/nm0027572/','../assets/directors/wes-anderson.jpg')}
        </div><span class="director-arrow">↓</span></div></div>
        <div class="director-detail"><div class="director-detail-inner"><div class="director-list">
          ${director('Denis Villeneuve','https://www.imdb.com/name/nm0898288/','../assets/directors/denis-villeneuve.jpg','Dune (franchise) · Incendies · Arrival · Blade Runner 2049')}
          ${director('Christopher Nolan','https://www.imdb.com/name/nm0634240/','../assets/directors/christopher-nolan.jpg','Christopher Nolan’s Batman (franchise) · Inception · Interstellar · Dunkirk')}
          ${director('Quentin Tarantino','https://www.imdb.com/name/nm0000233/','../assets/directors/quentin-tarantino.jpg','Inglourious Basterds · Kill Bill (franchise) · Django Unchained · Once Upon a Time… in Hollywood')}
          ${director('Wes Anderson','https://www.imdb.com/name/nm0027572/','../assets/directors/wes-anderson.jpg','The Royal Tenenbaums · The Darjeeling Limited · Fantastic Mr. Fox · The Grand Budapest Hotel')}
        </div></div></div>
      </div>`;
    bindSidebar(sidebar);
  }

  /* Horizontal trackpad / mouse-wheel navigation inside film detail cards. */
  const mb=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const prev=document.getElementById('modalPrev');
  const next=document.getElementById('modalNext');
  let sum=0,timer=null,busy=false;
  const reset=()=>{sum=0;clearTimeout(timer);timer=null};
  const step=dir=>{if(busy)return;busy=true;(dir>0?next:prev)?.click();setTimeout(()=>busy=false,230)};
  if(modal){
    modal.addEventListener('wheel',e=>{
      if(!mb?.classList.contains('open'))return;
      if(Math.abs(e.deltaX)<Math.abs(e.deltaY)*.72)return;
      sum+=e.deltaX;
      clearTimeout(timer);timer=setTimeout(reset,160);
      if(Math.abs(sum)>72){const dir=sum>0?1:-1;reset();step(dir)}
      e.preventDefault();e.stopPropagation();
    },{passive:false,capture:true});
  }

  /* Keep keyboard focus on the modal so arrows remain local to films. */
  document.addEventListener('click',e=>{
    if(e.target.closest('.tile')&&mb){requestAnimationFrame(()=>document.getElementById('modalClose')?.focus({preventScroll:true}))}
  },true);

  function insight(key,icon,title,sub,bullets){return `<div class="insight-item" data-insight="${key}"><button class="insight-card" type="button" aria-expanded="false"><span class="insight-icon">${icon}</span><span><b>${title}</b><span>${sub}</span></span><span class="insight-chevron">↓</span></button><div class="insight-detail"><div><ul>${bullets.map(b=>`<li>${b}</li>`).join('')}</ul></div></div></div>`}
  function face(name,url,img){return `<a class="director-face" data-name="${name}" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${name} sur IMDb"><img src="${img}" alt=""></a>`}
  function director(name,url,img,films){return `<a class="director-row" href="${url}" target="_blank" rel="noopener noreferrer"><img src="${img}" alt="${name}"><div><b>${name}</b><div class="director-films">${films}</div></div></a>`}
  function bindSidebar(root){
    const items=[...root.querySelectorAll('.insight-item')];
    items.forEach(item=>{
      const btn=item.querySelector('.insight-card');
      btn.addEventListener('click',()=>{
        const open=!item.classList.contains('is-open');
        items.forEach(other=>{other.classList.remove('is-open');other.querySelector('.insight-card')?.setAttribute('aria-expanded','false')});
        if(open){item.classList.add('is-open');btn.setAttribute('aria-expanded','true')}
      });
    });
    const year=root.querySelector('.year-insight-card');
    year?.querySelector('.year-toggle')?.addEventListener('click',e=>{const open=year.classList.toggle('is-open');e.currentTarget.setAttribute('aria-expanded',String(open))});
    if(year){
      const chart=year.querySelector('.year-chart'),bars=[...year.querySelectorAll('.year-chart-bar')];
      const hi=el=>{const ys=(el.dataset.years||el.dataset.y||'').split(',');chart.classList.add('is-exploring');bars.forEach(b=>b.classList.toggle('is-highlighted',ys.includes(b.dataset.y)))};
      const clear=()=>{chart.classList.remove('is-exploring');bars.forEach(b=>b.classList.remove('is-highlighted'))};
      year.querySelectorAll('[data-years],.year-chart-bar').forEach(el=>{el.addEventListener('pointerenter',()=>hi(el));el.addEventListener('pointerleave',clear);el.addEventListener('focus',()=>hi(el));el.addEventListener('blur',clear)});
    }
    const dc=root.querySelector('.director-card'),db=dc?.querySelector('.director-toggle-action');
    db?.addEventListener('click',()=>{const open=dc.classList.toggle('is-open');db.setAttribute('aria-expanded',String(open))});
  }
})();
