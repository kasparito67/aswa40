import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const files=['scripts/data.js','scripts/backdrops.js','v2/scripts/data.js','v2/scripts/new-tops.js','v2/scripts/poster-metadata.js','v2/scripts/poster-aliases.js','v2/scripts/top-skeletons.js','v2/scripts/hero-config.js','v2/scripts/section-polish.js'];
const context={console,URL,URLSearchParams,encodeURIComponent};
vm.createContext(context);
for(const file of files){const source=await fs.readFile(file,'utf8');vm.runInContext(source,context,{filename:file})}
vm.runInContext('globalThis.__TOPS__=TOPS',context);
const tops=context.__TOPS__;
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const placeholder=src=>String(src||'').startsWith('data:image/svg+xml');
const remote=src=>/^https?:\/\//.test(String(src||''));
const localPath=src=>String(src||'').replace(/^\.\.\//,'');

const knownMeta=new Map();
for(const era of ['1975-1999','2000-2024']){try{const manifest=JSON.parse(await fs.readFile(`data/${era}/poster-manifest.json`,'utf8'));for(const item of [...(manifest.ranked||[]),...(manifest.forgotten||[])])if(item.title)knownMeta.set(norm(item.title),item)}catch{}}
const token=process.env.TMDB_ACCESS_TOKEN||'';
const headers=token?{Authorization:`Bearer ${token}`,accept:'application/json'}:{};
async function tmdbCandidates(title){if(!token)return[];const params=new URLSearchParams({query:title,include_adult:'false',language:'en-US'});const r=await fetch(`https://api.themoviedb.org/3/search/movie?${params}`,{headers});if(!r.ok)return[];const json=await r.json();return(json.results||[]).slice(0,5).map(x=>({tmdbId:x.id,title:x.title,originalTitle:x.original_title,releaseDate:x.release_date||'',year:(x.release_date||'').slice(0,4)||null,posterPath:x.poster_path||null,backdropPath:x.backdrop_path||null}))}
async function remoteOk(src){try{const r=await fetch(src,{method:'HEAD',redirect:'follow'});return r.ok}catch{return false}}

const report={generatedAt:new Date().toISOString(),source:'ASWA40 runtime data + canonical poster metadata + established TMDB manifests',note:'TMDB candidates are only emitted for unresolved records; ambiguous records remain unresolved.',tops:{},unresolved:[]};
for(const top of tops.filter(t=>t.films?.length)){
  const items=[];
  for(const film of top.films){
    const src=film.img||'';let status='ok',reason='';
    if(!src){status='missing';reason='empty image value'}else if(placeholder(src)){status='missing';reason='ASWA40 placeholder'}else if(remote(src)){if(!(await remoteOk(src))){status='invalid';reason='remote image HTTP error'}}else{try{await fs.access(localPath(src))}catch{status='invalid';reason='local asset missing'}}
    const existing=knownMeta.get(norm(film.title));
    const item={topId:top.id,rank:film.rank,title:film.title,img:src,status,reason,tmdbId:film.tmdbId||existing?.tmdbId||null,posterPath:film.posterPath||existing?.posterPath||null,backdropPath:film.backdropPath||existing?.backdropPath||null,year:film.year||existing?.tmdbDate?.slice?.(0,4)||null};
    if(status!=='ok'){item.candidates=await tmdbCandidates(film.title);report.unresolved.push(item)}
    items.push(item);
  }
  report.tops[top.id]={total:items.length,validPoster:items.filter(x=>x.status==='ok').length,missing:items.filter(x=>x.status==='missing').length,invalid:items.filter(x=>x.status==='invalid').length,withTmdbId:items.filter(x=>x.tmdbId).length,items};
}
report.summary={total:Object.values(report.tops).reduce((n,t)=>n+t.total,0),validPoster:Object.values(report.tops).reduce((n,t)=>n+t.validPoster,0),missing:Object.values(report.tops).reduce((n,t)=>n+t.missing,0),invalid:Object.values(report.tops).reduce((n,t)=>n+t.invalid,0),withTmdbId:Object.values(report.tops).reduce((n,t)=>n+t.withTmdbId,0)};
await fs.writeFile('poster-audit.json',JSON.stringify(report,null,2)+'\n');
const lines=['# ASWA40 — Poster audit','',`Generated: ${report.generatedAt}`,'',`Total films: **${report.summary.total}**  `,`Valid posters: **${report.summary.validPoster}**  `,`Missing placeholders: **${report.summary.missing}**  `,`Invalid assets/URLs: **${report.summary.invalid}**  `,`Films with canonical/verified TMDB IDs: **${report.summary.withTmdbId}**`,'','## By Top',''];
for(const[id,t]of Object.entries(report.tops))lines.push(`- **${id}** — ${t.validPoster}/${t.total} valid · ${t.missing} missing · ${t.invalid} invalid · ${t.withTmdbId} with TMDB ID`);
lines.push('','## Unresolved','');if(!report.unresolved.length)lines.push('0 poster missing.');else for(const x of report.unresolved){lines.push(`- ${x.topId} #${x.rank} — **${x.title}** — ${x.reason}`);for(const c of x.candidates||[])lines.push(`  - candidate: TMDB ${c.tmdbId} · ${c.title} (${c.year||'year ?'}) · poster ${c.posterPath?'yes':'no'}`)}
lines.push('','## Rule','','Unresolved or ambiguous candidates are not silently promoted.');await fs.writeFile('poster-audit.md',lines.join('\n')+'\n');console.log(JSON.stringify(report.summary));if(report.summary.missing||report.summary.invalid)process.exitCode=2;
