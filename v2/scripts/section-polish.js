(()=>{
  const byId=id=>TOPS.find(t=>t.id===id);

  // 1975–1999: The Godfather is outside the voting window and was not in the choices.
  // Keep it as the first / most glaring omission in the editorial forgotten-film section.
  const era1975=byId('1975-1999');
  if(era1975 && !era1975.ghosts.some(g=>/godfather|parrain/i.test(g.title))){
    era1975.ghosts.unshift({
      title:'The Godfather',
      copy:'Le grand absent · hors fenêtre 1975–1999.',
      img:'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'
    });
  }

  const ovnis={
    '1975-1999':{ranks:[86,87,88,89,90,33,34,49],note:'Les 5 derniers + Jesus of Nazareth · The Sacrifice · The Cook, the Thief, His Wife & Her Lover'},
    '2000-2024':{ranks:[131,132,133,134,135,41,42,47,54],note:'Les 5 derniers + Maelström · The Taste of Others · Bobby Jones: Stroke of Genius · My Wife Is an Actress'},
    'sci-fi-realiste':{ranks:[62,63,64,65,66,33,38,42],note:'Les 5 derniers + Strange Days · Mars Express · Weird Science'},
    'animation':{ranks:[86,87,88,89,90,26,38,41,50],note:'Les 5 derniers + L’Homme qui plantait des arbres · The Animatrix · LE...K · The Lord of the Rings'},
    'biopics':{ranks:[63,64,65,66,67,16,25,29],note:'Les 5 derniers + Man on the Moon · Mishima · Daaaaaalí!'}
  };

  Object.entries(ovnis).forEach(([id,cfg])=>{
    const top=byId(id); if(!top) return;
    top.ovnis=cfg;
    let sec=top.sections.find(s=>s.kind==='bottom');
    if(!sec){
      sec={kicker:'Les choix qui détonnent',title:'Les OVNIS',kind:'bottom',count:5};
      top.sections.push(sec);
    }else{
      sec.kicker='Les choix qui détonnent';
      sec.title='Les OVNIS';
      sec.count=5;
    }
  });

  const docs=byId('documentaires');
  if(docs && !docs.sections.some(s=>s.kind==='bottom')){
    docs.sections.push({kicker:'Les choix qui détonnent',title:'Les OVNIS',kind:'bottom',count:5});
  }
})();
