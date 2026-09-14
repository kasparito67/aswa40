(()=>{
  if(typeof TOPS==='undefined'||!Array.isArray(TOPS))return;

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