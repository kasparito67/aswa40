(()=>{
  const mb=document.getElementById('modalBg');
  const modal=document.getElementById('filmModal');
  const poster=document.getElementById('modalPoster');
  const backdrop=document.getElementById('modalBackdrop');
  const body=document.getElementById('modalBody');
  if(!mb||!modal||!poster||!backdrop||!body)return;

  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const legacyBackdropByTitle=new Map();
  const legacy2000=TOPS.find(t=>t.id==='2000-2024');
  if(legacy2000&&typeof filmBackdrops!=='undefined'){
    legacy2000.films.forEach(f=>{
      const src=filmBackdrops[String(f.rank)];
      if(src)legacyBackdropByTitle.set(norm(f.title),`../${src}`);
    });
  }

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
  const slug=s=>norm(s).replace(/\s+/g,'-');
  const letterboxdUrl=title=>`https://letterboxd.com/film/${letterboxdAliases[norm(title)]||slug(title)}/`;

  function currentFilm(){
    const title=document.getElementById('modalTitle')?.textContent?.trim();
    if(!title)return null;
    for(const top of TOPS){
      const film=top.films.find(f=>f.title===title);
      if(film)return{top,film};
    }
    return null;
  }

  function apply(){
    const current=currentFilm();
    if(!current)return;
    const {top,film}=current;
    const key=norm(film.title);
    const legacy=legacyBackdropByTitle.get(key);
    const special=top.id==='sci-fi-realiste'&&film.rank===1
      ? 'https://image.tmdb.org/t/p/original/kdjNM3yOwtQkJIwHZPqvyY4p0Ul.jpg'
      : '';
    backdrop.src=special||legacy||film.img;
    backdrop.alt='';
    poster.alt=`Affiche de ${film.title}`;

    if(!body.querySelector('.modal-detail-link')){
      const link=document.createElement('a');
      link.className='modal-detail-link';
      link.href=letterboxdUrl(film.title);
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.textContent='Voir sur Letterboxd ↗';
      body.appendChild(link);
    }
  }

  const observer=new MutationObserver(()=>{
    if(mb.classList.contains('open'))requestAnimationFrame(apply);
  });
  observer.observe(document.getElementById('modalTitle'),{childList:true,subtree:true,characterData:true});

  document.addEventListener('click',e=>{
    if(e.target.closest('.tile'))requestAnimationFrame(()=>requestAnimationFrame(apply));
  },true);
})();
