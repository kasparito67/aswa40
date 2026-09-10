import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const runtime=['scripts/data.js','scripts/backdrops.js','v2/scripts/data.js','v2/scripts/new-tops.js','v2/scripts/animation-fix.js','v2/scripts/expanded-tops.js','v2/scripts/poster-metadata.js','v2/scripts/poster-aliases.js'];
const context={console,URL,URLSearchParams,encodeURIComponent};
vm.createContext(context);
for(const file of runtime)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});
vm.runInContext('globalThis.__TOPS__=TOPS',context);
const tops=context.__TOPS__;
const targets=new Set(['documentaires','rewatched']);
const token=process.env.TMDB_ACCESS_TOKEN;
if(!token)throw new Error('TMDB_ACCESS_TOKEN is not configured');
const headers={Authorization:`Bearer ${token}`,accept:'application/json'};
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const slug=s=>norm(s).replace(/\s+/g,'-').slice(0,90);
const placeholder=src=>String(src||'').startsWith('data:image/svg+xml');
const real=src=>Boolean(src)&&!placeholder(src);
const existing=new Map();
for(const top of tops)for(const film of top.films||[])if(real(film.img))existing.set(norm(film.title),film.img);

async function api(url,attempt=1){const r=await fetch(url,{headers});if((r.status===429||r.status>=500)&&attempt<5){await new Promise(x=>setTimeout(x,attempt*900));return api(url,attempt+1)}if(!r.ok)throw new Error(`TMDB ${r.status} ${url}`);return r.json()}
async function search(title){const p=new URLSearchParams({query:title,include_adult:'false',language:'en-US'});return (await api(`https://api.themoviedb.org/3/search/movie?${p}`)).results||[]}
async function resolve(title){const results=await search(title);const exact=results.filter(x=>norm(x.title)===norm(title)||norm(x.original_title)===norm(title));const pool=(exact.length?exact:results).filter(x=>x.poster_path);pool.sort((a,b)=>(b.vote_count||0)-(a.vote_count||0)||(b.popularity||0)-(a.popularity||0));return pool[0]||null}
async function downloadPoster(hit,file){const r=await fetch(`https://image.tmdb.org/t/p/w500${hit.poster_path}`);if(!r.ok)throw new Error(`poster ${r.status}`);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,Buffer.from(await r.arrayBuffer()))}

const payload={};
const manifests={};
const hero={};
for(const top of tops.filter(t=>targets.has(t.id))){
  const entries=[];
  for(const film of top.films||[]){
    const key=`${top.id}:${film.rank}`;
    let img=real(film.img)?film.img:existing.get(norm(film.title))||'';
    let hit=null;
    if(!img){
      hit=await resolve(film.title);
      if(hit?.poster_path){
        const file=`assets/posters/${top.id}/${String(film.rank).padStart(3,'0')}-${slug(film.title)}.jpg`;
        await downloadPoster(hit,file);
        img=`../${file}`;
      }
    }
    if(!hit){try{hit=await resolve(film.title)}catch{}}
    const meta=hit?{tmdbId:hit.id,posterPath:hit.poster_path||null,backdropPath:hit.backdrop_path||null,year:String(hit.release_date||'').slice(0,4)||null}:{};
    if(img){payload[key]={img,...meta};existing.set(norm(film.title),img)}
    entries.push({rank:film.rank,title:film.title,img:img||film.img,status:img?'ok':'unresolved',...meta});
  }
  manifests[top.id]=entries;
  await fs.mkdir(`data/${top.id}`,{recursive:true});
  await fs.writeFile(`data/${top.id}/poster-manifest-v3.json`,JSON.stringify({generatedAt:new Date().toISOString(),source:'TMDB + ASWA40 shared poster library',films:entries},null,2)+'\n');
  const lead=entries.find(x=>x.rank===1);
  let backdrop=lead?.backdropPath||null;
  if(!backdrop){try{backdrop=(await resolve((top.films||[])[0]?.title))?.backdrop_path||null}catch{}}
  if(backdrop)hero[top.id]={image:`https://image.tmdb.org/t/p/original${backdrop}`,position:'center 44%',fit:'cover',scale:1.01};
}

const js=`(()=>{\n  const media=${JSON.stringify({films:payload,hero},null,2)};\n  TOPS.forEach(top=>{\n    const h=media.hero[top.id]; if(h)Object.assign(top.hero,h);\n    (top.films||[]).forEach(f=>{const m=media.films[top.id+':'+f.rank];if(m)Object.assign(f,m)});\n  });\n})();\n`;
await fs.writeFile('v2/scripts/expansion-media.js',js);
const unresolved=Object.entries(manifests).flatMap(([topId,items])=>items.filter(x=>x.status!=='ok').map(x=>({topId,...x})));
await fs.writeFile('expansion-media-result.json',JSON.stringify({resolved:Object.keys(payload).length,unresolved,hero},null,2)+'\n');
console.log(`Expansion media resolved: ${Object.keys(payload).length}; unresolved: ${unresolved.length}`);
if(unresolved.length)console.log(unresolved.map(x=>`${x.topId} #${x.rank} ${x.title}`).join('\n'));
