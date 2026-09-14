(()=>{
  if(typeof TOPS==='undefined'||!Array.isArray(TOPS))return;

  const escXml=s=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const ghostPlaceholder=(title,accent='#d6d9dc')=>`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900"><rect width="600" height="900" fill="#0b0d0f"/><path d="M0 0h600v8H0z" fill="${accent}"/><text x="42" y="720" fill="#f4f4ef" font-family="Arial,sans-serif" font-size="36" font-weight="700">${escXml(title)}</text><text x="42" y="770" fill="#8e979b" font-family="Arial,sans-serif" font-size="18">ASWA40 · GRAND OUBLIÉ</text></svg>`)}`;

  const ensureGhostSection=top=>{
    if(!top||top.id==='rewatched'||!top.ghosts?.length)return;
    const hasForgotten=top.sections?.some(s=>s.kind==='ghosts'&&!/ovni/i.test(String(s.title||'')));
    if(hasForgotten)return;
    const section={
      kicker:top.id==='documentaires'?'Aucun vote':'Absents du classement',
      title:'Les grands oubliés',
      kind:'ghosts'
    };
    const bottomIndex=top.sections?.findIndex(s=>s.kind==='bottom'||/ovni/i.test(String(s.title||'')))??-1;
    if(bottomIndex>=0)top.sections.splice(bottomIndex,0,section);else top.sections.push(section);
  };

  // Documentary forgotten-film media was partly pointing at historical local files
  // that no longer exist. Keep the three known TMDB identities durable, then use a
  // safe inline poster while the remaining classics hydrate from Wikipedia at runtime.
  const docs=TOPS.find(top=>top.id==='documentaires');
  if(docs?.ghosts?.length){
    const patches=[
      {title:'Shoah',img:'https://image.tmdb.org/t/p/w500/yvwF7dfSCybFcBOklUzKpE46bHM.jpg'},
      {title:'The Thin Blue Line',img:'https://image.tmdb.org/t/p/w500/toJRzlXOSZYWW5IUk7DrZJv7kHF.jpg'},
      {title:'Grey Gardens',img:'https://image.tmdb.org/t/p/w500/jb6o66HE1duy0L7MJzEZXvrrsux.jpg'},
      {title:'Paris Is Burning',wiki:'Paris Is Burning (film)'},
      // The classic documentary is Harlan County, USA (1976). “Harlan County War”
      // is a 2000 TV drama and was an incorrect identity for this documentary list.
      {title:'Harlan County, USA',wiki:'Harlan County, USA'},
      {title:'Crumb',wiki:'Crumb (film)'},
      {title:"Hearts of Darkness: A Filmmaker's Apocalypse",wiki:"Hearts of Darkness: A Filmmaker's Apocalypse"}
    ];
    patches.forEach((patch,i)=>{
      const ghost=docs.ghosts[i];if(!ghost)return;
      Object.assign(ghost,patch);
      if(!patch.img)ghost.img=ghostPlaceholder(patch.title,docs.theme?.accent);
    });
  }

  TOPS.forEach(top=>{
    (top.sections||[]).forEach(section=>{
      if(section.kind==='full')section.title='Le reste';
    });

    const year=top.sidebar?.find(item=>item.kind==='year');
    if(year){
      const years=String(year.title||'').match(/(?:19|20)\d{2}/g)||[];
      if(/décennie/i.test(String(year.label||'')))year.label='Décennie reine';
      else year.label=years.length>1?'Années reines':'Année reine';
    }

    ensureGhostSection(top);
  });
})();