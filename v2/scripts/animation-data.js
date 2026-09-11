(()=>{
  const top=TOPS.find(t=>t.id==='animation');
  if(!top)return;

  const leK=top.films.findIndex(f=>String(f.title).trim()==='LE...K');
  if(leK>=0)top.films.splice(leK,1);

  const pagnol=top.films.find(f=>f.title==='Magnificent Life'||f.title==='A Magnificent Life'||f.title==='Marcel et Monsieur Pagnol');
  if(pagnol){
    pagnol.title='A Magnificent Life';
    pagnol.tmdbId=840873;
    pagnol.posterPath='/8RDzFr9kGPJU2D5pOOzk0W1ATJq.jpg';
    pagnol.img='https://image.tmdb.org/t/p/w500/8RDzFr9kGPJU2D5pOOzk0W1ATJq.jpg';
  }

  top.films.forEach((film,i)=>film.rank=i+1);
  const full=top.sections?.find(s=>s.kind==='full');
  if(full)full.title=`#${full.start}–${top.films.length}`;
})();