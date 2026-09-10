(()=>{
  const byId=id=>TOPS.find(t=>t.id===id);
  const tmdbBackdrop=film=>film?.backdropPath?`https://image.tmdb.org/t/p/original${film.backdropPath}`:null;

  const ovnis={
    '1975-1999':{
      ranks:[86,87,88,89,90,33,34,49],
      comments:{
        33:'Le vrai choix extraterrestre du lot : une mini-série biblique de 1977, seule sur une liste mais placée #2. Zéro consensus, conviction maximale.',
        34:'Un Tarkovski placé #2 par une seule personne. Immense intensité individuelle, presque aucune empreinte collective.',
        49:'Un seul vote pour un film baroque et volontairement excessif : exactement le genre de choix qui détonne dans un palmarès de groupe.'
      }
    },
    '2000-2024':{
      ranks:[131,132,133,134,135,41,42,47,54],
      comments:{
        41:'Un #1 solitaire. Maelström entre très haut grâce à une seule passion, sans aucun renfort du reste du groupe.',
        42:'Même phénomène : un seul membre le place #1. Un sommet personnel devenu curiosité collective.',
        47:'Bobby Jones au #3 d’une seule liste est un choix particulièrement inattendu au milieu du canon 2000–2024.',
        54:'Une comédie française choisie par une seule personne au #4 : très haut individuellement, totalement isolée collectivement.'
      }
    },
    'sci-fi-realiste':{
      ranks:[62,63,64,65,66,33,38,42],
      comments:{
        33:'Quatre votes mais seulement un #16 au mieux : Strange Days est aimé par plusieurs, sans jamais devenir une priorité.',
        38:'Mars Express n’apparaît que sur une seule liste, assez haut (#8), ce qui lui donne un profil de coup de cœur très personnel.',
        42:'Weird Science dans un top de science-fiction “réaliste et plausible” : le décalage conceptuel suffit presque à lui seul.'
      }
    },
    'animation':{
      ranks:[86,87,88,89,90,26,38,50],
      comments:{
        26:'Un court métrage québécois placé #1 par une seule personne. C’est à la fois un très gros amour individuel et une anomalie parfaite.',
        38:'The Animatrix est un objet hybride, anthologique et directement lié à une franchise live action : naturellement à part dans ce Top.',
        50:'Le vieux Lord of the Rings animé n’a qu’un vote. Une relique de fantasy animée qui tranche fortement avec le reste du classement.'
      }
    },
    'biopics':{
      ranks:[63,64,65,66,67,16,25,29],
      comments:{
        16:'Man on the Moon grimpe grâce à seulement deux votes, dont un #2 : plus culte personnel que consensus.',
        25:'Mishima est le parfait OVNI auteuriste du Top : un seul vote, mais un choix très affirmé et très loin du biopic hollywoodien classique.',
        29:'Daaaaaalí! est déjà une déconstruction du biopic. Un seul vote suffit à en faire une anomalie très logique ici.'
      }
    },
    'documentaires':{
      ranks:[79,80,81,82,83,26,56],
      comments:{
        26:'Jackass Forever ouvre la liste de Quentin. Dans un Top documentaire, c’est un choix volontairement très périphérique à la définition classique du genre.',
        56:'Deux votes pour un documentaire consacré à Casa Bonita : sujet ultra-spécifique, énergie culte, très ASWA40.',
        83:'Choisi par Quentin. The Fourth Kind est essentiellement une fiction qui imite les codes du documentaire : difficile de faire plus OVNI.'
      }
    }
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
  if(docs){
    const bg=tmdbBackdrop(docs.films?.[0]);
    if(bg)docs.hero.image=bg;
    docs.hero.fit='cover';
    docs.hero.scale=1;
    docs.hero.position='center 42%';
    docs.sections=[
      {kicker:'Le palmarès collectif',title:'TOP 15',kind:'top25',count:15},
      {kicker:'Le classement complet',title:'#16–83',kind:'full',start:16,batch:50},
      {kicker:'Les choix qui détonnent',title:'Les OVNIS',kind:'bottom',count:5}
    ];
  }

  const re=byId('rewatched');
  if(re){
    const bg=tmdbBackdrop(re.films?.[0])||tmdbBackdrop(re.films?.[2]);
    if(bg)re.hero.image=bg;
    re.hero.fit='cover';
    re.hero.scale=1;
    re.hero.position='center 42%';
    re.sections=[
      {kicker:'Les films qu’on a vus le plus souvent',title:'TOP 50',kind:'top25',count:50},
      {kicker:'Le reste du club vidéo',title:'#51–263',kind:'full',start:51,batch:50},
      {kicker:'Les choix vraiment à part',title:'Les OVNIS',kind:'ghosts'}
    ];
    const weird=[
      [33,'UHF','Deux votes très hauts pour un objet culte totalement hors canon.'],
      [65,'Airbag','Un #1 solitaire qui propulse cette comédie espagnole dans le classement.'],
      [79,'Grind','Pur artefact skate / DVD des années 2000.'],
      [229,'Le Retour de Goldorak','Un vestige pop improbable au milieu du club vidéo.'],
      [231,'Condorman','Le genre de film qu’un palmarès critique n’aurait probablement jamais vu venir.']
    ];
    re.ghosts=weird.map(([rank,title,copy])=>{
      const f=re.films.find(x=>x.rank===rank)||re.films.find(x=>x.title===title);
      return{rank:f?.rank||rank,title:f?.title||title,img:f?.img||'',copy};
    });
  }
})();
