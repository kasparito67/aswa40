(()=>{
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const tileMarkup=(f,t)=>`<button class="tile ovni-curated" type="button" data-top="${t}" data-r="${f.rank}" data-mode="bottom"><img src="${f.img}" alt="" loading="lazy" decoding="async"><span class="rank">${f.rank}</span><span class="name">${esc(f.title)}</span><span class="hover"><b>${f.pts} pts</b><span>${f.votes} votes · Best rank ${f.best}</span></span></button>`;

  TOPS.forEach((top,t)=>{
    const screen=document.querySelector(`.era-screen[data-top-id="${top.id}"]`);
    const sec=screen?.querySelector('.sec[data-kind="bottom"]');
    const grid=sec?.querySelector('.grid');
    if(!grid) return;

    if(!top.films.length){
      grid.innerHTML='<div class="ovni-empty">Sélection à venir avec le classement documentaire.</div>';
      return;
    }

    const ranks=(top.ovnis?.ranks||top.films.slice(-5).map(f=>f.rank)).filter((r,i,a)=>a.indexOf(r)===i);
    const films=ranks.map(r=>top.films.find(f=>f.rank===r)).filter(Boolean);
    grid.innerHTML=films.map(f=>tileMarkup(f,t)).join('');

    grid.querySelectorAll('.tile').forEach(tile=>{
      tile.addEventListener('click',()=>{
        const rank=tile.dataset.r;
        const source=[...screen.querySelectorAll(`.tile[data-r="${rank}"]`)].find(el=>el!==tile&&!el.classList.contains('ovni-curated'));
        if(source){ source.click(); return; }
        // Last-five films exist in the original bottom section only after replacement, so temporarily
        // reveal/load enough of the full ranking and retry through the canonical tile handler.
        const full=screen.querySelector('.sec[data-kind="full"]');
        const reveal=full?.querySelector('.full-reveal-button');
        let attempts=0;
        const seek=()=>{
          const found=[...screen.querySelectorAll(`.tile[data-r="${rank}"]`)].find(el=>el!==tile&&!el.classList.contains('ovni-curated'));
          if(found){found.click();return;}
          if(reveal && !reveal.closest('.full-reveal-overlay')?.classList.contains('is-hidden') && attempts++<8){reveal.click();setTimeout(seek,240)}
        };
        seek();
      });
    });
  });
})();
