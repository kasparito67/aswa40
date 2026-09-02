import fs from 'node:fs/promises';
import path from 'node:path';

const token=process.env.TMDB_ACCESS_TOKEN;
if(!token) throw new Error('TMDB_ACCESS_TOKEN is not configured');
const manifestPath='data/2000-2024/poster-manifest.json';
const manifest=JSON.parse(await fs.readFile(manifestPath,'utf8'));
const headers={Authorization:`Bearer ${token}`,accept:'application/json'};
const slugify=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

async function fetchChecked(url,attempt=1){
  const response=await fetch(url,{headers});
  if((response.status===429||response.status>=500)&&attempt<5){
    await new Promise(resolve=>setTimeout(resolve,attempt*800));
    return fetchChecked(url,attempt+1);
  }
  if(!response.ok) throw new Error(`TMDB ${response.status} for ${url}`);
  return response;
}

async function fetchBackdrop(item,file){
  const movie=await (await fetchChecked(`https://api.themoviedb.org/3/movie/${item.tmdbId}?language=en-US`)).json();
  if(!movie.backdrop_path) return null;
  const response=await fetchChecked(`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`);
  await fs.mkdir(path.dirname(file),{recursive:true});
  await fs.writeFile(file,Buffer.from(await response.arrayBuffer()));
  item.backdropPath=movie.backdrop_path;
  item.backdropFile=file;
  return file;
}

const ranked={};
for(const item of manifest.ranked){
  if(item.status!=='ok'||!item.tmdbId) continue;
  const file=`assets/backdrops/2000-2024/${String(item.rank).padStart(3,'0')}-${slugify(item.title)}.jpg`;
  try{const result=await fetchBackdrop(item,file);if(result) ranked[item.rank]=result;}
  catch(error){console.warn(`Backdrop skipped for #${item.rank} ${item.title}: ${error.message}`);}
}
const forgotten={};
for(const item of manifest.forgotten){
  if(item.status!=='ok'||!item.tmdbId) continue;
  const file=`assets/backdrops/grands-oublies/${slugify(item.title)}.jpg`;
  try{const result=await fetchBackdrop(item,file);if(result) forgotten[item.title]=result;}
  catch(error){console.warn(`Backdrop skipped for ${item.title}: ${error.message}`);}
}
const generated=["'use strict';",'','// Generated local TMDB backdrop mappings. Do not edit by hand.',`const filmBackdrops=${JSON.stringify(ranked,null,2)};`,'',`const ghostBackdrops=${JSON.stringify(forgotten,null,2)};`,''].join('\n');
await fs.writeFile('scripts/backdrops.js',generated);
manifest.backdropsGeneratedAt=new Date().toISOString();
await fs.writeFile(manifestPath,`${JSON.stringify(manifest,null,2)}\n`);
console.log(`Downloaded ${Object.keys(ranked).length} ranked and ${Object.keys(forgotten).length} forgotten-film backdrops.`);
