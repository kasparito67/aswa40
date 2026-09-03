import fs from 'node:fs/promises';
import path from 'node:path';

const token=process.env.TMDB_ACCESS_TOKEN;
if(!token) throw new Error('TMDB_ACCESS_TOKEN is not configured');
const headers={Authorization:`Bearer ${token}`,accept:'application/json'};
const manifest=JSON.parse(await fs.readFile('data/1975-1999/poster-manifest.json','utf8'));
const filmBackdrops={};
const ghostBackdrops={};

async function fetchBackdrop(item,kind){
  const mediaType=item.rank===33?'tv':'movie';
  const response=await fetch(`https://api.themoviedb.org/3/${mediaType}/${item.tmdbId}?language=en-US`,{headers});
  if(!response.ok) throw new Error(`TMDB ${response.status} for ${item.title}`);
  const data=await response.json();
  if(!data.backdrop_path) return false;
  const image=await fetch(`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`);
  if(!image.ok) throw new Error(`Image ${image.status} for ${item.title}`);
  const folder=kind==='ranked'?'assets/backdrops/1975-1999':'assets/backdrops/grands-oublies-1975-1999';
  await fs.mkdir(folder,{recursive:true});
  const filename=kind==='ranked'?String(item.rank).padStart(3,'0')+'-'+item.slug+'.jpg':item.slug+'.jpg';
  const destination=path.join(folder,filename).replaceAll('\\','/');
  await fs.writeFile(destination,Buffer.from(await image.arrayBuffer()));
  if(kind==='ranked') filmBackdrops[String(item.rank)]=destination;
  else ghostBackdrops[item.title]=destination;
  return true;
}

for(const item of manifest.ranked) await fetchBackdrop(item,'ranked');
for(const item of manifest.forgotten) await fetchBackdrop(item,'forgotten');

const output=`'use strict';\n\n// Generated local TMDB backdrop mappings. Do not edit by hand.\nconst filmBackdrops=${JSON.stringify(filmBackdrops,null,2)};\n\nconst ghostBackdrops=${JSON.stringify(ghostBackdrops,null,2)};\n`;
await fs.writeFile('scripts/backdrops-1975-1999.js',output);
console.log(`Generated ${Object.keys(filmBackdrops).length} ranked and ${Object.keys(ghostBackdrops).length} forgotten backdrops.`);
