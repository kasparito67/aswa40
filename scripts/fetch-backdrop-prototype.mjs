import fs from 'node:fs/promises';
import path from 'node:path';

const token=process.env.TMDB_ACCESS_TOKEN;
if(!token) throw new Error('TMDB_ACCESS_TOKEN is not configured');

const selections=[
  {id:120,file:'lotr.jpg'},
  {id:129,file:'spirited-away.jpg'},
  {id:155,file:'dark-knight.jpg'},
  {id:496243,file:'parasite.jpg'},
  {id:10681,file:'wall-e.jpg'},
];

const destination='assets/backdrops/prototype';
const headers={Authorization:`Bearer ${token}`,accept:'application/json'};

async function fetchChecked(url,options={}){
  const response=await fetch(url,options);
  if(!response.ok) throw new Error(`TMDB ${response.status} for ${url}`);
  return response;
}

await fs.mkdir(destination,{recursive:true});

for(const selection of selections){
  const movie=await (await fetchChecked(
    `https://api.themoviedb.org/3/movie/${selection.id}?language=en-US`,
    {headers},
  )).json();

  if(!movie.backdrop_path) throw new Error(`No backdrop for TMDB movie ${selection.id}`);

  const image=await fetchChecked(`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`);
  const output=path.join(destination,selection.file);
  await fs.writeFile(output,Buffer.from(await image.arrayBuffer()));
  console.log(`${movie.title}: ${output}`);
}
