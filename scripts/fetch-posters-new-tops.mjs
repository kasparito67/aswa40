import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const runtimeFiles=['scripts/data.js','scripts/backdrops.js','v2/scripts/data.js','v2/scripts/new-tops.js','v2/scripts/expanded-tops.js','v2/scripts/poster-aliases.js','v2/scripts/top-skeletons.js','v2/scripts/hero-config.js','v2/scripts/section-polish.js'];
const context={console,URL,URLSearchParams,encodeURIComponent};
vm.createContext(context);
for(const file of runtimeFiles)vm.runInContext(await fs.readFile(file,'utf8'),context,{filename:file});
vm.runInContext('globalThis.__TOPS__=TOPS',context);
const tops=context.__TOPS__;
const targetIds=new Set(['sci-fi-realiste','animation','biopics','documentaires','rewatched']);
const token=process.env.TMDB_ACCESS_TOKEN;
if(!token)throw new Error('TMDB_ACCESS_TOKEN is not configured');
const headers={Authorization:`Bearer ${token}`,accept:'application/json'};
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const slug=s=>norm(s).replace(/\s+/g,'-');
const isPlaceholder=src=>String(src||'').startsWith('data:image/svg+xml');
const localPath=src=>String(src||'').replace(/^\.\.\//,'');

const overrides={
  '1975-1999:1':11,
  '1975-1999:20':862,
  'sci-fi-realiste:18':17431,'sci-fi-realiste:19':5548,'sci-fi-realiste:22':49047,'sci-fi-realiste:23':42188,'sci-fi-realiste:28':63,'sci-fi-realiste:29':686,'sci-fi-realiste:32':2675,'sci-fi-realiste:33':281,'sci-fi-realiste:39':865,'sci-fi-realiste:40':861,'sci-fi-realiste:41':9314,'sci-fi-realiste:42':11814,'sci-fi-realiste:43':8413,'sci-fi-realiste:44':49049,'sci-fi-realiste:46':37686,'sci-fi-realiste:48':39538,'sci-fi-realiste:49':19,'sci-fi-realiste:51':20766,'sci-fi-realiste:53':95,'sci-fi-realiste:57':419704,'sci-fi-realiste:58':11850,'sci-fi-realiste:60':1272,'sci-fi-realiste:61':646380,'sci-fi-realiste:63':8810,'sci-fi-realiste:65':11484,'sci-fi-realiste:66':9426,
  'animation:3':324857,'animation:9':9385,'animation:10':8587,'animation:12':22504,'animation:16':4977,'animation:17':9662,'animation:19':920,'animation:25':569094,'animation:26':49565,'animation:30':10693,'animation:32':44896,'animation:33':12477,'animation:35':812,'animation:37':16859,'animation:39':10895,'animation:42':42994,'animation:43':10494,'animation:45':9318,'animation:47':399174,'animation:52':9606,'animation:55':2011,'animation:58':823219,'animation:59':82702,'animation:60':508965,'animation:61':81,'animation:63':7443,'animation:65':16306,'animation:66':13396,'animation:71':19106,'animation:72':532,'animation:73':9929,'animation:75':10882,'animation:81':310576,'animation:85':11886,'animation:88':41201,'animation:90':546201,
  'biopics:11':9008,'biopics:14':334543,'biopics:15':1883,'biopics:16':1850,'biopics:18':429197,'biopics:19':4133,'biopics:20':77338,'biopics:24':10139,'biopics:26':68812,'biopics:27':2567,'biopics:30':7984,'biopics:32':69,'biopics:34':1955,'biopics:35':266856,'biopics:37':3902,'biopics:42':746,'biopics:43':5708,'biopics:45':15362,'biopics:46':10537,'biopics:47':205596,'biopics:49':197,'biopics:51':687,'biopics:52':1653,'biopics:54':10360,'biopics:56':820,'biopics:57':11327,'biopics:61':1677,'biopics:64':1254808,'biopics:67':12160,
  'documentaires:1':1430,
  'rewatched:1':11
};
const editorialExceptions=new Set(['1975-1999:3']);

async function api(url,attempt=1){const r=await fetch(url,{headers});if((r.status===429||r.status>=500)&&attempt<4){await new Promise(x=>setTimeout(x,attempt*800));return api(url,attempt+1)}if(!r.ok)throw new Error(`TMDB ${r.status} ${url}`);return r.json()}
async function details(id){return api(`https://api.themoviedb.org/3/movie/${id}?language=en-US`)}
async function search(title){const p=new URLSearchParams({query:title,include_adult:'false',language:'en-US'});return (await api(`https://api.themoviedb.org/3/search/movie?${p}`)).results||[]}
async function choose(top,film){const key=`${top.id}:${film.rank}`;if(overrides[key])return details(overrides[key]);if(editorialExceptions.has(key))return null;const results=await search(film.title);const exact=results.filter(x=>norm(x.title)===norm(film.title)&&x.poster_path);return exact.length===1?exact[0]:null}
async function validCurrent(src){if(!src||isPlaceholder(src))return false;if(/^https?:\/\//.test(src)){try{return (await fetch(src,{method:'HEAD'})).ok}catch{return false}}try{await fs.access(localPath(src));return true}catch{return false}}
async function download(hit,file){const r=await fetch(`https://image.tmdb.org/t/p/w500${hit.poster_path}`);if(!r.ok)throw new Error(`image ${r.status}`);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,Buffer.from(await r.arrayBuffer()))}

const oldMeta=new Map();
for(const era of ['1975-1999','2000-2024']){try{const m=JSON.parse(await fs.readFile(`data/${era}/poster-manifest.json`,'utf8'));for(const x of [...(m.ranked||[]),...(m.forgotten||[])])if(x.title&&x.tmdbId)oldMeta.set(norm(x.title),x)}catch{}}
const resolved=new Map(), manifests={};
for(const top of tops.filter(t=>t.films?.length)){
  const entries=[];
  for(const film of top.films){
    const key=`${top.id}:${film.rank}`;
    let meta=oldMeta.get(norm(film.title))||null;
    let img=film.img||'';
    if(overrides[key]&&!meta){try{meta=await details(overrides[key])}catch{}}
    const posterValid=await validCurrent(img);
    if(targetIds.has(top.id)&&!posterValid){
      const hit=await choose(top,film);
      if(hit?.poster_path){const file=`assets/posters/${top.id}/${String(film.rank).padStart(3,'0')}-${slug(film.title)}.jpg`;await download(hit,file);img=`../${file}`;meta=hit}
    }
    const canonical=meta?{tmdbId:meta.id||meta.tmdbId||null,posterPath:meta.poster_path||meta.posterPath||null,backdropPath:meta.backdrop_path||meta.backdropPath||null,year:String(meta.release_date||meta.tmdbDate||'').slice(0,4)||null}:{};
    if(img&&!isPlaceholder(img)&&await validCurrent(img))resolved.set(key,{img,...canonical});
    entries.push({rank:film.rank,title:film.title,img,status:resolved.has(key)?'ok':editorialExceptions.has(key)?'editorial-exception':'unresolved',...canonical});
  }
  manifests[top.id]=entries;
  await fs.mkdir(`data/${top.id}`,{recursive:true});
  await fs.writeFile(`data/${top.id}/poster-manifest-v2.json`,JSON.stringify({generatedAt:new Date().toISOString(),source:'TMDB + established ASWA40 assets',films:entries},null,2)+'\n');
}
const payload=Object.fromEntries(resolved);
const js=`(()=>{\n  const metadata=${JSON.stringify(payload,null,2)};\n  TOPS.forEach(top=>(top.films||[]).forEach(f=>{const m=metadata[top.id+':'+f.rank];if(!m)return;Object.assign(f,m);if(m.img)f.img=m.img;}));\n})();\n`;
await fs.writeFile('v2/scripts/poster-metadata.js',js);
const unresolved=[];for(const [id,entries] of Object.entries(manifests))for(const e of entries)if(e.status!=='ok')unresolved.push({topId:id,...e});
await fs.writeFile('poster-sync-result.json',JSON.stringify({resolved:resolved.size,unresolved},null,2)+'\n');
console.log(`Canonical metadata entries: ${resolved.size}; unresolved: ${unresolved.length}`);
if(unresolved.length)console.log(unresolved.map(x=>`${x.topId} #${x.rank} ${x.title} [${x.status}]`).join('\n'));
