(()=>{
  const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const isPlaceholder=src=>String(src||'').startsWith('data:image/svg+xml');
  const assets=new Map();

  // First harvest every real poster already present in the two established tops,
  // including forgotten films.
  TOPS.slice(0,2).forEach(top=>{
    (top.films||[]).forEach(f=>{if(f.img&&!isPlaceholder(f.img))assets.set(norm(f.title),f.img)});
    (top.ghosts||[]).forEach(g=>{if(g.img&&!isPlaceholder(g.img))assets.set(norm(g.title),g.img)});
  });

  const aliases={
    'spider man into the spider verse':'spider verse franchise',
    'spider man across the spider verse':'spider verse franchise',
    'le voyage de chihiro':'spirited away',
    'spirited away':'spirited away',
    'la liste de schindler':'schindlers list',
    'schindler s list':'schindlers list',
    'the twelve tasks of asterix':'les douze travaux d asterix',
    'les douze travaux d asterix':'the twelve tasks of asterix',
    'the king and the mockingbird':'le roi et l oiseau',
    'le roi et l oiseau':'the king and the mockingbird',
    'the man who planted trees':'l homme qui plantait des arbres',
    'l homme qui plantait des arbres':'the man who planted trees',
    'the triplets of belleville':'les triplettes de belleville',
    'les triplettes de belleville':'the triplets of belleville',
    'castle in the sky':'laputa castle in the sky',
    'howl s moving castle':'howls moving castle',
    'kiki s delivery service':'kikis delivery service',
    'nausicaa of the valley of the wind':'nausicaa',
    'the adventures of tintin':'tintin',
    'the incredibles':'incredibles',
    'the emperor s new groove':'emperors new groove',
    'the simpsons movie':'simpsons movie',
    'south park bigger longer uncut':'south park bigger longer and uncut',
    'a i artificial intelligence':'ai artificial intelligence',
    'terminator 2 judgment day':'terminator 2',
    'e t the extra terrestrial':'et the extra terrestrial',
    'mad max 2 the road warrior':'the road warrior',
    'rise of the planet of the apes':'rise of the planet of the apes',
    'don t look up':'dont look up',
    'the wolf of wall street':'the wolf of wall street',
    'the assassination of jesse james by the coward robert ford':'the assassination of jesse james by the coward robert ford',
    'intouchables':'the intouchables',
    'downfall':'der untergang',
    'the diving bell and the butterfly':'le scaphandre et le papillon',
    'gainsbourg a heroic life':'gainsbourg vie heroique',
    'nouvelle vague':'nouvelle vague'
  };

  // Common known franchise/title variants that already exist as ASWA40 assets.
  const directExisting={
    'spider man into the spider verse':'../assets/posters/2000-2024/114-spider-verse-franchise.jpg',
    'spider man across the spider verse':'../assets/posters/2000-2024/114-spider-verse-franchise.jpg'
  };

  function resolve(title){
    const key=norm(title);
    if(directExisting[key])return directExisting[key];
    if(assets.has(key))return assets.get(key);
    const alt=aliases[key];
    if(alt&&assets.has(norm(alt)))return assets.get(norm(alt));
    return '';
  }

  TOPS.slice(2).forEach(top=>{
    top.films.forEach(f=>{
      if(!isPlaceholder(f.img))return;
      const found=resolve(f.title);
      if(found)f.img=found;
    });
  });
})();
