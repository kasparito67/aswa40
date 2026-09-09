(()=>{
  const byId=id=>TOPS.find(t=>t.id===id);
  const tmdbBackdrop=film=>film?.backdropPath?`https://image.tmdb.org/t/p/original${film.backdropPath}`:null;

  const docs=byId('documentaires');
  if(docs){
    const bg=tmdbBackdrop(docs.films?.[0]);
    if(bg) docs.hero.image=bg;
    docs.hero.fit='cover'; docs.hero.scale=1; docs.hero.position='center 42%';
    docs.sections=[{kicker:'Le palmarès collectif',title:'TOP 15',kind:'top25'}];
  }

  const re=byId('rewatched');
  if(re){
    const bg=tmdbBackdrop(re.films?.[0])||tmdbBackdrop(re.films?.[2]);
    if(bg) re.hero.image=bg;
    re.hero.fit='cover'; re.hero.scale=1; re.hero.position='center 42%';
    re.sections=[
      {kicker:'Les films qu’on a vus le plus souvent',title:'TOP 50',kind:'full',start:1,batch:50},
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
    re.ghosts=weird.map(([rank,title,copy])=>{const f=re.films.find(x=>x.rank===rank)||re.films.find(x=>x.title===title);return{title:f?.title||title,img:f?.img||'',copy}});
  }
})();
