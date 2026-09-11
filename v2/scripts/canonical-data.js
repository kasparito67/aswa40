(()=>{
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const placeholder=src=>String(src||'').startsWith('data:image/svg+xml');

  const realByTitle=new Map();
  TOPS.forEach(top=>(top.films||[]).forEach(f=>{if(f.img&&!placeholder(f.img))realByTitle.set(norm(f.title),f.img)}));
  TOPS.forEach(top=>(top.films||[]).forEach(f=>{if((!f.img||placeholder(f.img))&&realByTitle.has(norm(f.title)))f.img=realByTitle.get(norm(f.title))}));

  // A few older/shared records had correct posters but no backdrop identity. Without
  // these locks the hero renderer fell back to the generic Top image, so unrelated
  // films could visibly share a backdrop. Keep these canonical IDs explicit.
  const backdropLocks={
    'sci-fi-realiste':{
      2:'/hPsCR1ny6GnctJkWqeJwihTDD7T.jpg', // Gattaca
      3:'/qr7dUqleMRd0VgollazbmyP9XjI.jpg', // Blade Runner
      5:'/tlm8UkiQsitc8rSuIAscQDCnP8d.jpg'  // The Matrix
    },
    animation:{
      1:'/fK40VGYIm7hmKrLJ26fgPQU0qRG.jpg', // Akira
      4:'/xWT5F1DNxciNLEMXRl49iq8zvN7.jpg', // Nightmare Before Christmas
      5:'/3Rfvhy1Nl6sSGJwyjb0QiZzZYlB.jpg'  // Toy Story
    },
    biopics:{
      1:'/7TF4p86ZafnxFuNqWdhpHXFO244.jpg', // GoodFellas
      2:'/zb6fM1CX41D9rF9hdgclu0peUmy.jpg'  // Schindler's List
    }
  };
  Object.entries(backdropLocks).forEach(([topId,films])=>{
    const top=TOPS.find(t=>t.id===topId);if(!top)return;
    Object.entries(films).forEach(([rank,path])=>{
      const film=top.films.find(f=>f.rank===Number(rank));
      if(film)Object.assign(film,{backdropPath:path,backdrop:`https://image.tmdb.org/t/p/original${path}`});
    });
  });

  // Identity locks belong here. Section layout and editorial configuration live in
  // platform-config.js so there is only one source of truth for presentation.
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
  }

  const re=TOPS.find(t=>t.id==='rewatched');
  if(re){
    // Keep the visible poster and metadata pinned to the 1990 film (TMDB 771).
    const homeAlone=re.films.find(f=>f.rank===5||norm(f.title)==='home alone');
    if(homeAlone)Object.assign(homeAlone,{
      title:'Home Alone',
      year:'1990',
      tmdbId:771,
      img:'https://image.tmdb.org/t/p/w500/onTSipZ8R3bliBdKfPtsDuHTdlL.jpg',
      posterPath:'/onTSipZ8R3bliBdKfPtsDuHTdlL.jpg',
      backdropPath:'/ih2xVgeMS8R5WUetYE8Mr9hVTlB.jpg',
      backdrop:'https://image.tmdb.org/t/p/original/ih2xVgeMS8R5WUetYE8Mr9hVTlB.jpg',
      letterboxd:'https://letterboxd.com/film/home-alone/'
    });
    re.community='9 cinéphiles';
  }
})();