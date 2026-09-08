(()=>{
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  const yearsFromText=(text,min,max)=>{
    const out=new Set();
    const ranges=[...String(text).matchAll(/(19\d{2}|20\d{2})\s*[–-]\s*(?:(19\d{2}|20\d{2})|(\d{2}))/g)];
    ranges.forEach(m=>{
      const a=Number(m[1]);
      const b=Number(m[2]||String(a).slice(0,2)+m[3]);
      for(let y=Math.min(a,b);y<=Math.max(a,b);y++) if(y>=min&&y<=max) out.add(y);
    });
    String(text).match(/(?:19|20)\d{2}/g)?.forEach(y=>{const n=Number(y);if(n>=min&&n<=max)out.add(n)});
    return [...out];
  };

  const topFor=screen=>TOPS.find(t=>t.id===screen.dataset.topId);

  function yearMarkup(item){
    const start=item.yearStart;
    const end=start+item.bars.length-1;
    const titleYears=yearsFromText(item.title,start,end);
    const notes=(item.notes||[]).map(note=>{
      const yrs=yearsFromText(note,start,end);
      const parts=String(note).split(/\s+[—-]\s+/);
      return `<button class="year-highlight" type="button" data-years="${yrs.join(',')}"><b>${esc(parts[0]||note)}</b><span>${esc(parts.slice(1).join(' — ')||'Voir dans le graphique')}</span></button>`;
    }).join('');
    const decadeMatch=String(item.sub||'').match(/((?:19|20)\d{2}\s*[–-]\s*(?:19|20)\d{2})[^\d]*(\d+%)/);
    const decadeYears=decadeMatch?yearsFromText(decadeMatch[1],start,end):[];
    const summary=decadeMatch?`<button class="year-insight-decade" type="button" data-years="${decadeYears.join(',')}"><b>${esc(decadeMatch[1])}</b><strong>${esc(decadeMatch[2])}</strong></button>`:'';
    const countText=String(item.sub||'').split('·')[0].trim();
    return `
      <button class="year-toggle" type="button" aria-expanded="false">
        <div class="year-insight-kicker special-card-label"><span>${esc(item.label)}</span></div>
        <div class="year-insight-year">${esc(item.title)}</div>
        <div class="year-insight-maincount">${esc(countText)}</div>
        <span class="year-arrow">↓</span>
      </button>
      <div class="year-insight-detail"><div class="year-insight-detail-inner">
        ${summary}
        <div class="year-chart" aria-label="Nombre de films par année de ${start} à ${end}">
          ${item.bars.map((v,i)=>`<span class="year-chart-bar${titleYears.includes(start+i)?' hot':''}" style="--v:${v}" data-y="${start+i}" tabindex="0" aria-label="${start+i} : ${v} film${v>1?'s':''}"></span>`).join('')}
        </div>
        <div class="year-highlights">${notes}</div>
      </div></div>`;
  }

  function directorMarkup(item){
    const primary=item.entries?.[0];
    const primaryPoster=item.faces?.[0]?`../assets/posters/1975-1999/${item.faces[0]}.jpg`:'';
    return `
      <div class="director-toggle">
        <button class="director-toggle-action" type="button" aria-expanded="false" aria-label="Afficher les autres réalisateurs"></button>
        <div class="director-copy">
          <div class="director-k special-card-label"><span>${esc(item.label||'Réalisateur')}</span></div>
          <div class="director-title">${esc(item.title)}</div>
        </div>
        <div class="director-heading">
          ${primaryPoster?`<div class="director-faces"><span class="director-face"><img src="${primaryPoster}" alt=""></span></div>`:''}
          <span class="director-arrow">↓</span>
        </div>
      </div>
      <div class="director-detail"><div class="director-detail-inner"><div class="director-list">
        ${(item.entries||[]).map((entry,i)=>`<div class="director-row director-row-text${i===0?' is-primary':''}"><div><b>${esc(entry[0])}</b><div class="director-films">${esc(entry[1])}</div></div></div>`).join('')}
      </div></div></div>`;
  }

  function bindYear(card){
    const toggle=card.querySelector('.year-toggle');
    toggle?.addEventListener('click',()=>{
      const open=card.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded',String(open));
    });
    const chart=card.querySelector('.year-chart');
    const bars=[...card.querySelectorAll('.year-chart-bar')];
    const highlight=el=>{
      const ys=(el.dataset.years||el.dataset.y||'').split(',').filter(Boolean);
      if(!ys.length)return;
      chart.classList.add('is-exploring');
      bars.forEach(bar=>bar.classList.toggle('is-highlighted',ys.includes(bar.dataset.y)));
    };
    const clear=()=>{
      chart.classList.remove('is-exploring');
      bars.forEach(bar=>bar.classList.remove('is-highlighted'));
    };
    card.querySelectorAll('[data-years],.year-chart-bar').forEach(el=>{
      el.addEventListener('pointerenter',()=>highlight(el));
      el.addEventListener('pointerleave',clear);
      el.addEventListener('focus',()=>highlight(el));
      el.addEventListener('blur',clear);
    });
  }

  function bindDirector(card){
    const btn=card.querySelector('.director-toggle-action');
    btn?.addEventListener('click',()=>{
      const open=card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded',String(open));
    });
  }

  document.querySelectorAll('.era-screen:not([data-top-id="2000-2024"])').forEach(screen=>{
    const top=topFor(screen);
    if(!top)return;
    const yearData=top.sidebar.find(x=>x.kind==='year');
    const directorData=top.sidebar.find(x=>x.kind==='directors');

    const oldYear=screen.querySelector('.year-card.special-card,.year-insight-card');
    if(oldYear&&yearData){
      oldYear.className='year-insight-card parity-year-card';
      oldYear.innerHTML=yearMarkup(yearData);
      bindYear(oldYear);
    }

    const oldDirector=screen.querySelector('.directors-card.special-card,.director-card');
    if(oldDirector&&directorData){
      oldDirector.className='director-card parity-director-card';
      oldDirector.innerHTML=directorMarkup(directorData);
      bindDirector(oldDirector);
    }
  });
})();
