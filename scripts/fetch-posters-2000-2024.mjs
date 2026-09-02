import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const sourcePath='scripts/data.js';
const source=await fs.readFile(sourcePath,'utf8');
const context={};
vm.createContext(context);
vm.runInContext(`${source}\nglobalThis.__aswa={films,ghosts};`,context);
const {films,ghosts}=context.__aswa;

const overrides={
  1:{query:'The Lord of the Rings: The Fellowship of the Ring',year:2001},
  5:{query:'The Dark Knight',year:2008},
  19:{query:'Dune',year:2021},
  32:{query:"Harry Potter and the Philosopher's Stone",year:2001},
  39:{query:'Anora',year:2024},
  49:{query:'Reality',year:2023},
  68:{query:'Ils se marièrent et eurent beaucoup d’enfants',year:2004},
  75:{query:'OSS 117: Cairo, Nest of Spies',year:2006},
  91:{query:'Ghost in the Shell',year:2017},
  93:{query:'The Avengers',year:2012},
  106:{query:'Pirates of the Caribbean: The Curse of the Black Pearl',year:2003},
  110:{query:'Sink or Swim',year:2018},
  112:{query:'The Butterfly',year:2002},
  118:{query:'The Coffee Table',year:2022},
  120:{query:'X-Men',year:2000},
  121:{query:'All Quiet on the Western Front',year:2022},
  123:{query:'The Bourne Identity',year:2002},
  128:{query:'Spider-Man: Into the Spider-Verse',year:2018},
};

const token=process.env.TMDB_ACCESS_TOKEN;
if(!token) throw new Error('TMDB_ACCESS_TOKEN is not configured');
const headers={Authorization:`Bearer ${token}`,accept:'application/json'};
const slugify=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

async function tmdbFetch(url,attempt=1){
  const response=await fetch(url,{headers});
  if((response.status===429||response.status>=500)&&attempt<4){
    await new Promise(resolve=>setTimeout(resolve,attempt*900));
    return tmdbFetch(url,attempt+1);
  }
  if(!response.ok) throw new Error(`TMDB ${response.status} for ${url}`);
  return response;
}

async function findPoster(title,year){
  const params=new URLSearchParams({query:title,include_adult:'false',language:'en-US'});
  if(year) params.set('year',String(year));
  let results=(await (await tmdbFetch(`https://api.themoviedb.org/3/search/movie?${params}`)).json()).results||[];
  if(!results.some(result=>result.poster_path)&&year){
    params.delete('year');
    results=(await (await tmdbFetch(`https://api.themoviedb.org/3/search/movie?${params}`)).json()).results||[];
  }
  return results.find(result=>result.poster_path)||results[0]||null;
}

async function downloadPoster({title,query=title,year,file}){
  const hit=await findPoster(query,year);
  if(!hit?.poster_path) return {title,query,year,status:'missing'};
  const response=await tmdbFetch(`https://image.tmdb.org/t/p/w500${hit.poster_path}`);
  await fs.mkdir(path.dirname(file),{recursive:true});
  await fs.writeFile(file,Buffer.from(await response.arrayBuffer()));
  return {
    title,query,year,status:'ok',file,tmdbId:hit.id,tmdbTitle:hit.title,
    tmdbDate:hit.release_date,posterPath:hit.poster_path,
  };
}

const manifest={generatedAt:new Date().toISOString(),source:'TMDB',ranked:[],forgotten:[]};
for(const film of films){
  const override=overrides[film.rank]||{};
  const slug=slugify(film.title);
  const file=`assets/posters/2000-2024/${String(film.rank).padStart(3,'0')}-${slug}.jpg`;
  try{
    const result=await downloadPoster({title:film.title,query:override.query||film.title,year:override.year,file});
    manifest.ranked.push({rank:film.rank,...result});
  }catch(error){
    manifest.ranked.push({rank:film.rank,title:film.title,status:'error',error:String(error)});
  }
}

for(const ghost of ghosts){
  const [title]=ghost;
  const file=`assets/grands-oublies/2000-2024/${slugify(title)}.jpg`;
  try{
    manifest.forgotten.push(await downloadPoster({title,file}));
  }catch(error){
    manifest.forgotten.push({title,status:'error',error:String(error)});
  }
}

await fs.mkdir('data/2000-2024',{recursive:true});
await fs.writeFile('data/2000-2024/poster-manifest.json',`${JSON.stringify(manifest,null,2)}\n`);

let updated=source;
for(const item of manifest.ranked.filter(item=>item.status==='ok')){
  const pattern=new RegExp(`("rank":\\s*${item.rank},[\\s\\S]*?"img":\\s*)"[^"]*"`);
  if(!pattern.test(updated)) throw new Error(`Could not update poster reference for rank ${item.rank}`);
  updated=updated.replace(pattern,`$1"${item.file}"`);
}
for(const item of manifest.forgotten.filter(item=>item.status==='ok')){
  const ghost=ghosts.find(entry=>entry[0]===item.title);
  if(!ghost||!updated.includes(`"${ghost[2]}"`)) throw new Error(`Could not update forgotten poster reference for ${item.title}`);
  updated=updated.replace(`"${ghost[2]}"`,`"${item.file}"`);
}
await fs.writeFile(sourcePath,updated);

const all=[...manifest.ranked,...manifest.forgotten];
const failed=all.filter(item=>item.status!=='ok');
console.log(`Downloaded ${all.length-failed.length}/${all.length} TMDB posters.`);
if(failed.length) throw new Error(`Missing posters: ${failed.map(item=>item.title).join(', ')}`);
