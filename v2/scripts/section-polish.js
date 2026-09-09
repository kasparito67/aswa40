(()=>{
  const byId=id=>TOPS.find(t=>t.id===id);

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
    if(!sec){sec={kicker:'Les choix qui détonnent',title:'Les OVNIS',kind:'bottom',count:5};top.sections.push(sec)}
    else{sec.kicker='Les choix qui détonnent';sec.title='Les OVNIS';sec.count=5}
  });

  const top2000=byId('2000-2024');
  if(top2000){
    const insightKeys=['religion','consensus','duo','ovni'];
    top2000.sidebar.filter(x=>x.kind==='insight').forEach((item,i)=>item.key=insightKeys[i]);
    const year=top2000.sidebar.find(x=>x.kind==='year');
    if(year){
      Object.assign(year,{label:'Année reine',title:'2000',sub:'13 films · 2000–2009 = 55%',bars:[13,10,10,6,6,6,6,11,2,4,5,5,4,6,8,6,4,5,2,3,2,3,4,3,1],yearStart:2000,notes:['2007 — 11 films','2001–02 — 10 films chacune','2024 — 1 seul film','Le creux — 2008 · 2018 · 2020']});
    }
    if(!top2000.sidebar.some(x=>x.kind==='directors')){
      top2000.sidebar.push({
        kind:'directors',label:'Le quatuor',title:'4 films chacun',
        entries:[
          {name:'Denis Villeneuve',url:'https://www.imdb.com/name/nm0898288/',img:'../assets/directors/denis-villeneuve.jpg',films:'Dune (franchise) · Incendies · Arrival · Blade Runner 2049'},
          {name:'Christopher Nolan',url:'https://www.imdb.com/name/nm0634240/',img:'../assets/directors/christopher-nolan.jpg',films:'Christopher Nolan’s Batman (franchise) · Inception · Interstellar · Dunkirk'},
          {name:'Quentin Tarantino',url:'https://www.imdb.com/name/nm0000233/',img:'../assets/directors/quentin-tarantino.jpg',films:'Inglourious Basterds · Kill Bill (franchise) · Django Unchained · Once Upon a Time… in Hollywood'},
          {name:'Wes Anderson',url:'https://www.imdb.com/name/nm0027572/',img:'../assets/directors/wes-anderson.jpg',films:'The Royal Tenenbaums · The Darjeeling Limited · Fantastic Mr. Fox · The Grand Budapest Hotel'}
        ]
      });
    }
  }

  const docs=byId('documentaires');
  if(docs && !docs.sections.some(s=>s.kind==='bottom')) docs.sections.push({kicker:'Les choix qui détonnent',title:'Les OVNIS',kind:'bottom',count:5});
})();
