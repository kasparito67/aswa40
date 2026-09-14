(()=>{
  const stage=document.getElementById('stage');
  const modalBg=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const modalPoster=document.getElementById('modalPoster');
  const modalBackdrop=document.getElementById('modalBackdrop');
  const modalRank=document.getElementById('modalRank');
  const modalTitle=document.getElementById('modalTitle');
  const modalStats=document.getElementById('modalStats');
  const modalBody=document.getElementById('modalBody');
  if(!stage||!modalBg||!modal||typeof TOPS==='undefined'||!Array.isArray(TOPS))return;

  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const slug=s=>norm(s).replace(/\s+/g,'-');

  const enhance=()=>{
    stage.querySelectorAll('.ghost-card:not([data-r])').forEach(card=>{
      if(card.dataset.mobileGhostBound==='1')return;
      card.dataset.mobileGhostBound='1';
      card.classList.add('is-clickable-ghost');
      const screen=card.closest('.era-screen');
      const top=TOPS.find(t=>t.id===screen?.dataset.topId);
      const ghost=top?.ghosts?.[Number(card.dataset.ghost)];
      if(ghost)card.setAttribute('aria-label',`Ouvrir la fiche de ${ghost.title}`);
    });
  };

  const openGhost=(card,top,ghost)=>{
    const poster=card.querySelector('img')?.currentSrc||card.querySelector('img')?.src||ghost.img||'';
    document.documentElement.style.setProperty('--active-accent',top.theme?.accent||'#e60d45');
    modal.classList.add('is-ghost-detail');
    modalPoster.src=poster;modalPoster.alt=`Affiche de ${ghost.title}`;
    modalBackdrop.src=poster;modalBackdrop.alt='';
    modalRank.textContent='Grand oublié';
    modalTitle.textContent=ghost.title;
    const noVotes=/aucun vote/i.test(String(ghost.copy||''));
    modalStats.innerHTML=noVotes?'<span><b>0</b> vote</span>':'<span>Absent du classement</span>';
    modalBody.innerHTML=`<p>${esc(ghost.copy||'Absent du classement.')}</p><a class="modal-detail-link" href="https://letterboxd.com/film/${slug(ghost.title)}/" target="_blank" rel="noopener noreferrer">Voir sur Letterboxd ↗</a>`;
    modalBg.classList.add('open');modalBg.setAttribute('aria-hidden','false');
  };

  stage.addEventListener('click',event=>{
    const card=event.target.closest?.('.ghost-card:not([data-r])');
    if(!card)return;
    const screen=card.closest('.era-screen');
    const top=TOPS.find(t=>t.id===screen?.dataset.topId);
    const ghost=top?.ghosts?.[Number(card.dataset.ghost)];
    if(!top||!ghost)return;
    event.preventDefault();event.stopPropagation();
    openGhost(card,top,ghost);
  });

  new MutationObserver(enhance).observe(stage,{childList:true,subtree:true});
  new MutationObserver(()=>{if(!modalBg.classList.contains('open'))modal.classList.remove('is-ghost-detail')}).observe(modalBg,{attributes:true,attributeFilter:['class']});
  enhance();
})();