(()=>{
  const NON_MASTER_IDS=new Set(['1975-1999','sci-fi-realiste','animation','biopics']);

  function yearsFromNote(text,item){
    const min=item.yearStart;
    const max=item.yearStart+item.bars.length-1;
    const years=new Set();
    const add=y=>{if(y>=min&&y<=max)years.add(y)};

    // Full years and explicit ranges, e.g. 1990–1999.
    const ranges=[...String(text).matchAll(/(19|20)\d{2}\s*[–-]\s*((?:19|20)\d{2})/g)];
    ranges.forEach(m=>{
      const a=Number(m[0].match(/\d{4}/g)[0]);
      const b=Number(m[0].match(/\d{4}/g)[1]);
      for(let y=Math.min(a,b);y<=Math.max(a,b);y++)add(y);
    });
    [...String(text).matchAll(/(?:19|20)\d{2}/g)].forEach(m=>add(Number(m[0])));

    // Short follow-up years in editorial strings, e.g. “1975 · 76 · 79”.
    const first=[...years][0];
    if(first){
      const century=Math.floor(first/100)*100;
      [...String(text).matchAll(/(?:^|[·,/\s])([0-9]{2})(?=\s*(?:·|,|\/|—|–|-|$))/g)].forEach(m=>{
        const short=Number(m[1]);
        add(century+short);
      });
    }
    return [...years];
  }

  function bindYearRollovers(){
    document.querySelectorAll('.era-screen').forEach(screen=>{
      const top=TOPS.find(t=>t.id===screen.dataset.topId);
      const item=top?.sidebar?.find(x=>x.kind==='year');
      const card=screen.querySelector('.year-card');
      const chart=card?.querySelector('.year-chart');
      if(!item||!card||!chart)return;

      const bars=[...chart.querySelectorAll('.year-bar')];
      const clear=()=>{
        chart.classList.remove('is-exploring');
        bars.forEach(x=>x.classList.remove('is-highlighted'));
      };
      const highlight=years=>{
        chart.classList.add('is-exploring');
        bars.forEach((bar,i)=>bar.classList.toggle('is-highlighted',years.includes(item.yearStart+i)));
      };

      bars.forEach((bar,i)=>{
        const year=item.yearStart+i;
        const count=item.bars[i]||0;
        bar.dataset.tip=`${year} · ${count} film${count>1?'s':''}`;
        bar.tabIndex=count?0:-1;
        if(!count)return;
        const activate=()=>highlight([year]);
        bar.addEventListener('pointerenter',activate);
        bar.addEventListener('pointerleave',clear);
        bar.addEventListener('focus',activate);
        bar.addEventListener('blur',clear);
      });

      const notes=card.querySelector('.year-notes');
      if(notes){
        [...notes.children].forEach(note=>{
          const years=yearsFromNote(note.textContent,item);
          if(!years.length)return;
          note.classList.add('year-note-trigger');
          note.tabIndex=0;
          note.setAttribute('role','button');
          note.dataset.years=years.join(',');
          const activate=()=>highlight(years);
          note.addEventListener('pointerenter',activate);
          note.addEventListener('pointerleave',clear);
          note.addEventListener('focus',activate);
          note.addEventListener('blur',clear);
        });
      }
    });
  }

  function improveDirectorDisclosure(){
    document.querySelectorAll('.era-screen').forEach(screen=>{
      if(!NON_MASTER_IDS.has(screen.dataset.topId))return;
      const card=screen.querySelector('.directors-card');
      if(!card)return;
      const top=TOPS.find(t=>t.id===screen.dataset.topId);
      const item=top?.sidebar?.find(x=>x.kind==='directors');
      const detail=card.querySelector('.director-list');
      const faces=card.querySelector('.faces');

      // Only the lead director is visible on the closed card.
      if(faces){
        [...faces.children].forEach((face,i)=>face.hidden=i>0);
      }

      // The complete list, including supporting directors, belongs to the disclosure.
      if(detail){
        detail.setAttribute('aria-label','Réalisateurs marquants');
        detail.dataset.role='director-disclosure';
      }
      if(item?.entries?.length){
        card.dataset.directorCount=String(item.entries.length);
      }
    });
  }

  // Phase 3B interaction cleanup, consolidated from interaction-qc-sept9.js.
  // Wheel navigation is deliberately NOT duplicated here; app.js owns the two canonical wheel handlers.
  function hydrateDeferredPosters(){
    document.querySelectorAll('.poster-deferred[data-src]').forEach(img=>{
      img.src=img.dataset.src;
      img.addEventListener('load',()=>img.classList.add('is-loaded'),{once:true});
      delete img.dataset.src;
    });
  }

  function normalizeRewatchedTop50(){
    const re=document.querySelector('.era-screen[data-top-id="rewatched"]');
    if(!re)return;
    const first=re.querySelector('.sec[data-kind="full"]');
    const grid=first?.querySelector('.full-grid');
    if(!grid)return;

    const tiles=[...grid.querySelectorAll('.tile')];
    const hero=document.createElement('div');
    hero.className='heroTop coverflow';
    hero.dataset.flow='hero';
    tiles.slice(0,5).forEach(t=>hero.appendChild(t));

    const rest=document.createElement('div');
    rest.className='grid coverflow';
    rest.dataset.flow='rest';
    tiles.slice(5,50).forEach(t=>rest.appendChild(t));

    const pad=first.querySelector('.pad');
    if(pad){
      pad.innerHTML='';
      pad.append(hero,rest);
    }
  }

  requestAnimationFrame(()=>{
    hydrateDeferredPosters();
    normalizeRewatchedTop50();
    bindYearRollovers();
    improveDirectorDisclosure();
  });
})();
