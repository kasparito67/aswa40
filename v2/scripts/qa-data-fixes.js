(()=>{
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const placeholder=src=>String(src||'').startsWith('data:image/svg+xml');

  const realByTitle=new Map();
  TOPS.forEach(top=>(top.films||[]).forEach(f=>{if(f.img&&!placeholder(f.img))realByTitle.set(norm(f.title),f.img)}));
  TOPS.forEach(top=>(top.films||[]).forEach(f=>{if((!f.img||placeholder(f.img))&&realByTitle.has(norm(f.title)))f.img=realByTitle.get(norm(f.title))}));

  // Lock ambiguous documentary identities after all automated metadata passes.
  // These titles have same-name matches that previously replaced the intended films.
  const docs=TOPS.find(t=>t.id==='documentaires');
  if(docs){
    const lockedDocs={
      7:{
        title:'Icarus',
        year:'2017',
        tmdbId:432976,
        img:'https://image.tmdb.org/t/p/w500/x5azMi1KvZWbBbfjmGqpHNGqjH.jpg',
        posterPath:'/x5azMi1KvZWbBbfjmGqpHNGqjH.jpg',
        backdropPath:'/ambKXAJYrDPJK9wBJlIVVWbQbar.jpg',
        backdrop:'https://image.tmdb.org/t/p/original/ambKXAJYrDPJK9wBJlIVVWbQbar.jpg',
        letterboxd:'https://letterboxd.com/film/icarus-2017/'
      },
      8:{
        title:'Senna',
        year:'2010',
        tmdbId:58496,
        img:'https://image.tmdb.org/t/p/w500/nZbLCbRoP6iJq5sr8daHQzjnzFh.jpg',
        posterPath:'/nZbLCbRoP6iJq5sr8daHQzjnzFh.jpg',
        backdropPath:'/sS3jaC2SXoeYmjAuqPeoeelPZqP.jpg',
        backdrop:'https://image.tmdb.org/t/p/original/sS3jaC2SXoeYmjAuqPeoeelPZqP.jpg',
        letterboxd:'https://letterboxd.com/film/senna/'
      }
    };
    Object.entries(lockedDocs).forEach(([rank,patch])=>{
      const film=docs.films.find(f=>f.rank===Number(rank));
      if(film)Object.assign(film,patch);
    });

    docs.community='9 cinéphiles';
    docs.hero=docs.hero||{};
    docs.hero.titleArt='../assets/header-documentaires.svg';
    docs.hero.titleAlt='Top 15 Documentaires';
    docs.sections=[
      {kicker:'Les gros scoreurs',title:'TOP 15',kind:'top25'},
      {kicker:'Le classement complet',title:'#16–83',kind:'full',start:16,batch:50},
      {kicker:'Les bons derniers',title:'Les OVNIS',kind:'bottom',count:5}
    ];
  }

  const re=TOPS.find(t=>t.id==='rewatched');
  if(re){
    re.community='9 cinéphiles';
    re.sections=[
      {kicker:'Les plus revus',title:'TOP 50',kind:'top25'},
      {kicker:'Le classement complet',title:'#51–263',kind:'full',start:26,batch:50},
      {kicker:'Les vraies bizarreries',title:'Les OVNIS',kind:'ghosts'}
    ];
    const oddRanks=[33,50,65,67,229];
    const oddCopy={
      33:'UHF · culte télévisuel complètement décalé',
      50:'La guerre des tuques · anomalie affective très québécoise',
      65:'Airbag · choix rewatch improbable et ultra personnel',
      67:'The Toughest Man in the World · obscurité maximale',
      229:'Le Retour de Goldorak · pur artefact de vidéoclub'
    };
    re.ghosts=oddRanks.map(rank=>{const f=re.films.find(x=>x.rank===rank);return f?{title:f.title,img:f.img,copy:oddCopy[rank]}:null}).filter(Boolean);
  }
})();
