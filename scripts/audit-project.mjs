import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const root=process.cwd();
const errors=[];
const warnings=[];
const info=[];
const rel=p=>path.relative(root,p).replaceAll('\\','/');
const exists=p=>fs.existsSync(path.resolve(root,p));
const read=p=>fs.readFileSync(path.resolve(root,p),'utf8');
const walk=(dir,out=[])=>{
  const abs=path.resolve(root,dir);
  if(!fs.existsSync(abs))return out;
  for(const ent of fs.readdirSync(abs,{withFileTypes:true})){
    const p=path.join(abs,ent.name);
    if(ent.isDirectory())walk(rel(p),out);else out.push(p);
  }
  return out;
};
const fail=msg=>errors.push(msg);
const warn=msg=>warnings.push(msg);
const ok=msg=>info.push(msg);

// 1) Syntax-check all authored runtime/tooling JavaScript.
for(const file of [...walk('v2/scripts'),...walk('scripts')].filter(f=>/\.(?:js|mjs)$/.test(f))){
  const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if(result.status!==0)fail(`JS syntax: ${rel(file)}\n${(result.stderr||result.stdout).trim()}`);
}
ok('JavaScript syntax scan complete.');

// 2) Verify the production entrypoint and identify obsolete runtime files.
const index=read('v2/index.html');
const loadedScripts=new Set();
const loadedStyles=new Set();
for(const m of index.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)){
  const src=m[1];if(/^https?:/.test(src))continue;
  const target=path.normalize(path.join('v2',src));
  if(!exists(target))fail(`Missing script referenced by v2/index.html: ${src} -> ${target}`);
  if(target.startsWith(`v2${path.sep}scripts${path.sep}`))loadedScripts.add(path.basename(target));
}
for(const m of index.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g)){
  const href=m[1];if(/^https?:/.test(href))continue;
  const target=path.normalize(path.join('v2',href));
  if(!exists(target))fail(`Missing stylesheet referenced by v2/index.html: ${href} -> ${target}`);
  if(target.startsWith(`v2${path.sep}styles${path.sep}`))loadedStyles.add(path.basename(target));
}
const bootstrap=read('v2/scripts/bootstrap.js');
for(const m of bootstrap.matchAll(/load\(["']scripts\/([^"']+)["']\)/g)){
  const name=m[1];loadedScripts.add(name);
  if(!exists(`v2/scripts/${name}`))fail(`Bootstrap loads missing script: v2/scripts/${name}`);
}
const dataFiles=new Set([
  'animation-data.js','canonical-data.js','data.js','expanded-tops.js','expansion-media.js','hero-config.js',
  'new-tops.js','platform-config.js','poster-aliases.js','poster-metadata.js','top-skeletons.js'
]);
for(const name of fs.readdirSync(path.resolve(root,'v2/scripts')).filter(n=>n.endsWith('.js'))){
  if(!loadedScripts.has(name)&&!dataFiles.has(name))warn(`Unloaded v2 runtime file appears obsolete: v2/scripts/${name}`);
}
for(const name of fs.readdirSync(path.resolve(root,'v2/styles')).filter(n=>n.endsWith('.css'))){
  if(!loadedStyles.has(name))warn(`Unloaded v2 stylesheet appears obsolete: v2/styles/${name}`);
}

// 3) Evaluate the exact data/config pipeline used by the browser.
const context={
  console,
  matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),
  navigator:{connection:null},
  location:{pathname:'/tops/1975-1999',search:'',hash:''},
};
context.window=context;context.globalThis=context;
vm.createContext(context);
const dataPipeline=[
  'scripts/data.js','scripts/backdrops.js','v2/scripts/data.js','v2/scripts/new-tops.js','v2/scripts/animation-data.js',
  'v2/scripts/expanded-tops.js','v2/scripts/poster-metadata.js','v2/scripts/poster-aliases.js','v2/scripts/expansion-media.js',
  'v2/scripts/canonical-data.js','v2/scripts/top-skeletons.js','v2/scripts/hero-config.js','v2/scripts/platform-config.js'
];
try{
  for(const file of dataPipeline)vm.runInContext(read(file),context,{filename:file});
  vm.runInContext('globalThis.__AUDIT_TOPS = TOPS;',context);
}catch(err){fail(`Data pipeline evaluation failed: ${err.stack||err}`)}

const tops=context.__AUDIT_TOPS;
if(Array.isArray(tops)){
  const expected=['1975-1999','2000-2024','sci-fi-realiste','animation','biopics','documentaires','rewatched'];
  const ids=tops.map(t=>t.id);
  if(ids.length!==expected.length)fail(`Expected ${expected.length} Tops, found ${ids.length}: ${ids.join(', ')}`);
  for(const id of expected)if(!ids.includes(id))fail(`Missing canonical Top: ${id}`);
  if(new Set(ids).size!==ids.length)fail(`Duplicate Top ids: ${ids.join(', ')}`);
  if(ids[0]!=='1975-1999')fail(`Default Top must be 1975-1999, found ${ids[0]}`);

  const assetCheck=(value,label)=>{
    if(!value||/^(?:https?:|data:)/.test(String(value)))return;
    const clean=String(value).split(/[?#]/)[0];
    // Runtime URLs are resolved against <base href="/v2/">, not the JS source file.
    const target=path.normalize(path.join('v2',clean));
    if(!exists(target))warn(`Missing rendered local asset for ${label}: ${value} -> ${target}`);
  };

  for(const top of tops){
    if(!Array.isArray(top.films)||!top.films.length){fail(`${top.id}: no films`);continue}
    const ranks=top.films.map(f=>Number(f.rank));
    const rankSet=new Set(ranks);
    if(rankSet.size!==ranks.length)fail(`${top.id}: duplicate film ranks`);
    const max=Math.max(...ranks);
    for(let r=1;r<=max;r++)if(!rankSet.has(r))warn(`${top.id}: missing rank #${r}`);
    if(ranks.some((r,i)=>i&&r<ranks[i-1]))warn(`${top.id}: films are not stored in ascending rank order`);

    assetCheck(top.hero?.image,`${top.id} hero`);
    assetCheck(top.hero?.titleArt,`${top.id} title art`);
    for(const f of top.films)assetCheck(f.img,`${top.id} #${f.rank} ${f.title}`);
    const hasGhostSection=(top.sections||[]).some(s=>s.kind==='ghosts');
    if(hasGhostSection)for(const g of top.ghosts||[])assetCheck(g.img,`${top.id} ghost ${g.title}`);
    for(const s of top.sidebar||[])for(const e of s.entries||[])if(!Array.isArray(e))assetCheck(e.img,`${top.id} director ${e.name}`);

    const featuredSection=(top.sections||[]).find(s=>s.kind==='top25');
    const titleCount=Number(String(featuredSection?.title||'').match(/TOP\s*(\d+)/i)?.[1])||0;
    const featured=Number(featuredSection?.count)||(titleCount||25);
    if(titleCount&&Number(featuredSection?.count||titleCount)!==titleCount)fail(`${top.id}: featured count disagrees with ${featuredSection.title}`);
    const full=(top.sections||[]).find(s=>s.kind==='full');
    if(full){
      const start=Number(full.start);
      if(start!==featured+1)fail(`${top.id}: full ranking starts at #${start}, but featured section ends at #${featured}`);
      const range=String(full.title||'').match(/#(\d+)\s*[–-]\s*(\d+)/);
      if(range){
        if(Number(range[1])!==start)fail(`${top.id}: full-section title starts at #${range[1]} but data starts at #${start}`);
        if(Number(range[2])!==max)warn(`${top.id}: full-section title ends at #${range[2]} but max rank is #${max}`);
      }
    }
    const validKinds=new Set(['top25','full','ghosts','bottom']);
    for(const s of top.sections||[])if(!validKinds.has(s.kind))warn(`${top.id}: unknown section kind ${s.kind}`);
    for(const rank of top.ovnis?.ranks||[])if(!rankSet.has(Number(rank)))fail(`${top.id}: OVNI rank #${rank} does not exist`);
    for(const g of top.ghosts||[])if(g.rank!=null&&!rankSet.has(Number(g.rank)))warn(`${top.id}: ghost rank #${g.rank} does not exist`);
  }

  const docs=tops.find(t=>t.id==='documentaires');
  if(Number(docs?.films?.find(f=>Number(f.rank)===7)?.tmdbId)!==432976)fail('Identity lock failed: Icarus must be TMDB 432976');
  if(Number(docs?.films?.find(f=>Number(f.rank)===8)?.tmdbId)!==58496)fail('Identity lock failed: Senna must be TMDB 58496');
  const re=tops.find(t=>t.id==='rewatched');
  if(Number(re?.films?.find(f=>Number(f.rank)===5)?.tmdbId)!==771)fail('Identity lock failed: Home Alone must be TMDB 771');
  ok(`Data pipeline resolved ${tops.length} Tops and ${tops.reduce((n,t)=>n+t.films.length,0)} ranked films.`);
}

// 4) Routing/deployment config sanity.
try{
  const vercel=JSON.parse(read('vercel.json'));
  const route=vercel.rewrites?.find(r=>r.source==='/tops/:top');
  if(!route)fail('vercel.json is missing /tops/:top rewrite');
  else if(route.destination!=='/v2')fail(`Unexpected /tops/:top destination: ${route.destination}`);
}catch(err){fail(`Invalid vercel.json: ${err.message}`)}

// 5) Architecture drift worth fixing, but not a release blocker by itself.
const canonical=read('v2/scripts/canonical-data.js');
const platform=read('v2/scripts/platform-config.js');
for(const id of ['documentaires','rewatched']){
  const canonicalTouches=canonical.includes(`id==='${id}'`)&&canonical.includes('.sections=');
  const platformTouches=platform.includes(`byId('${id}')`)&&platform.includes('.sections=');
  if(canonicalTouches&&platformTouches)warn(`${id}: section configuration is assigned in both canonical-data.js and platform-config.js; keep one source of truth.`);
}

console.log('\nASWA40 project audit');
console.log('===================');
for(const msg of info)console.log(`✓ ${msg}`);
for(const msg of warnings)console.log(`⚠ ${msg}`);
for(const msg of errors)console.error(`✗ ${msg}`);
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
if(errors.length)process.exit(1);
