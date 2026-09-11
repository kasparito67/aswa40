import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root=process.cwd();
const port=4173;
const topIds=['1975-1999','2000-2024','sci-fi-realiste','animation','biopics','documentaires','rewatched'];
const sharedHeaderIds=topIds.filter(id=>id!=='1975-1999');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2'};

const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  let pathname=decodeURIComponent(url.pathname);
  if(pathname==='/'||pathname==='/index.html')pathname='/index.html';
  else if(pathname==='/v2'||pathname==='/v2/'||pathname.startsWith('/tops/'))pathname='/v2/index.html';
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){
    res.writeHead(404,{'content-type':'text/plain'});res.end('Not found');return;
  }
  res.writeHead(200,{'content-type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));

const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};

async function attachDiagnostics(page,label){
  page.on('pageerror',err=>failures.push(`${label} pageerror: ${err.message}`));
  page.on('console',msg=>{if(msg.type()==='error')failures.push(`${label} console.error: ${msg.text()}`)});
  page.on('response',response=>{
    const u=new URL(response.url());
    if(u.hostname==='127.0.0.1'&&response.status()>=400)failures.push(`${label} local HTTP ${response.status()}: ${u.pathname}`);
  });
}

async function waitForTop(page,id){
  await page.waitForFunction(expected=>location.pathname===`/tops/${expected}`,id,{timeout:10000});
  await page.waitForTimeout(180);
}

async function assertHeaderSystem(page){
  await page.waitForFunction(expected=>document.querySelectorAll('.era-screen.design-header-system').length===expected,sharedHeaderIds.length,{timeout:10000});
  assert(await page.locator('.era-screen[data-top-id="1975-1999"] .design1975-top5').count()===1,'desktop: validated 1975 Top 5 header is missing');
  assert(await page.locator('.era-screen.design-header-system').count()===sharedHeaderIds.length,'desktop: shared header did not enhance every remaining Top');

  for(const id of sharedHeaderIds){
    const screen=page.locator(`.era-screen[data-top-id="${id}"]`);
    assert(await screen.locator('.design-header-top5 button').count()===5,`desktop: ${id} shared Top 5 does not contain five films`);
    assert(await screen.locator('.design-header-media-layer').count()===5,`desktop: ${id} shared header does not contain five media layers`);
    assert(await screen.locator('.design-header-top5 button.is-locked').count()===1,`desktop: ${id} shared header has no single locked film`);
    const geometry=await screen.evaluate(el=>{
      const hero=el.querySelector('.hero-header')?.getBoundingClientRect();
      const shell=el.querySelector(':scope > .shell')?.getBoundingClientRect();
      const nav=el.querySelector('.design-header-top5')?.getBoundingClientRect();
      return hero&&shell&&nav?{heroBottom:hero.bottom,shellTop:shell.top,heroTop:hero.top,navTop:nav.top,navBottom:nav.bottom}:null;
    });
    assert(geometry&&geometry.shellTop>=geometry.heroBottom-1,`desktop: ${id} content overlaps the shared hero`);
    assert(geometry&&geometry.navTop>=geometry.heroTop-1&&geometry.navBottom<=geometry.heroBottom+1,`desktop: ${id} Top 5 menu escapes the hero bounds`);
  }

  const yearIcon=await page.locator('.era-screen[data-top-id="1975-1999"] .year-toggle').evaluate(el=>{
    const s=getComputedStyle(el,'::before');return s.maskImage||s.webkitMaskImage||'';
  });
  const directorIcon=await page.locator('.era-screen[data-top-id="1975-1999"] .director-toggle').evaluate(el=>{
    const s=getComputedStyle(el,'::before');return s.maskImage||s.webkitMaskImage||'';
  });
  assert(yearIcon&&yearIcon!=='none','desktop: year editorial icon is missing');
  assert(directorIcon&&directorIcon!=='none','desktop: director editorial icon is missing');
}

async function expectedMobileBackdrops(page,id){
  return page.evaluate(topId=>{
    const curated1975={
      'Star Wars':'https://image.tmdb.org/t/p/original/aJCtkxLLzkk1pECehVjKHA2lBgw.jpg',
      'Apocalypse Now':'https://image.tmdb.org/t/p/original/9Qs9oyn4iE8QtQjGZ0Hp2WyYNXT.jpg',
      'Indiana Jones':'https://image.tmdb.org/t/p/original/c7Mjuip0jfHLY7x8ZSEriRj45cu.jpg',
      'Pulp Fiction':'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
      'Fargo':'https://image.tmdb.org/t/p/original/36P236xmuc8aWmXK7YkOM5EAKbA.jpg'
    };
    const top=TOPS.find(t=>t.id===topId);
    return top.films.slice(0,5).map((film,index)=>{
      let src='';
      if(top.id==='1975-1999'&&curated1975[film.title])src=curated1975[film.title];
      else if(film.backdrop)src=film.backdrop;
      else if(film.backdropPath)src=`https://image.tmdb.org/t/p/original${film.backdropPath}`;
      else if(top.id==='2000-2024'&&typeof filmBackdrops==='object'&&filmBackdrops){const local=filmBackdrops[String(film.rank)]||filmBackdrops[film.rank];if(local)src=`../${local}`}
      if(!src)src=top.hero?.image||film.img||'';
      return new URL(src,document.baseURI).href;
    });
  },id);
}

async function assertMobileCinemaHeader(page,id){
  await page.waitForSelector('.era-screen.mobile-cinema-header',{timeout:10000});
  const screen=page.locator('.era-screen');
  assert((await screen.getAttribute('data-top-id'))===id,`mobile: expected ${id} active screen for cinema header check`);
  assert(await screen.locator('.mobile-cinema-tabs button').count()===5,`mobile: ${id} cinema header does not expose five Top 5 selectors`);
  assert(await screen.locator('.mobile-cinema-layer').count()===5,`mobile: ${id} cinema header does not contain five media layers`);
  assert(await screen.locator('.mobile-cinema-tabs button.is-active').count()===1,`mobile: ${id} cinema header has no single active selector`);

  const expected=await expectedMobileBackdrops(page,id);
  const actual=await screen.locator('.mobile-cinema-layer img').evaluateAll(imgs=>imgs.map(img=>img.src));
  assert(JSON.stringify(actual)===JSON.stringify(expected),`mobile: ${id} Top 5 backdrops diverge from desktop source resolution`);

  const geometry=await screen.evaluate(el=>{
    const hero=el.querySelector('.hero-header')?.getBoundingClientRect();
    const shell=el.querySelector(':scope > .shell')?.getBoundingClientRect();
    const copy=el.querySelector('.mobile-cinema-copy')?.getBoundingClientRect();
    const title=el.querySelector('.hero-title-art-wrap')?.getBoundingClientRect();
    const section=el.querySelector('.sec');
    const tile=el.querySelector('.tile');
    const copyStyle=el.querySelector('.mobile-cinema-film b')?getComputedStyle(el.querySelector('.mobile-cinema-film b')):null;
    return hero&&shell&&copy&&title?{
      heroBottom:hero.bottom,shellTop:shell.top,heroTop:hero.top,copyTop:copy.top,copyBottom:copy.bottom,
      titleTop:title.top,titleRight:innerWidth-title.right,titleBottom:title.bottom,
      secRadius:section?getComputedStyle(section).borderRadius:'',tileRadius:tile?getComputedStyle(tile).borderRadius:'',
      fontFamily:copyStyle?.fontFamily||'',fontWeight:copyStyle?.fontWeight||''
    }:null;
  });
  assert(geometry&&geometry.shellTop>=geometry.heroBottom-1,`mobile: ${id} content overlaps cinema hero`);
  assert(geometry&&geometry.copyTop>=geometry.heroTop&&geometry.copyBottom<=geometry.heroBottom,`mobile: ${id} active film copy escapes hero bounds`);
  assert(geometry&&geometry.titleTop-geometry.heroTop>=48&&geometry.titleTop-geometry.heroTop<=60,`mobile: ${id} title is not on the shared header baseline`);
  assert(geometry&&geometry.titleRight>=12&&geometry.titleRight<=18,`mobile: ${id} title is not on the shared right anchor`);
  assert(geometry&&geometry.titleBottom<=geometry.heroBottom,`mobile: ${id} title escapes hero bounds`);
  assert(geometry&&geometry.secRadius==='0px',`mobile: ${id} section geometry is still rounded`);
  assert(geometry&&geometry.tileRadius==='0px',`mobile: ${id} film tile geometry is still rounded`);
  assert(geometry&&geometry.fontFamily.toLowerCase().includes('inter'),`mobile: ${id} active film typography does not use Inter`);
  assert(geometry&&Number(geometry.fontWeight)>=600,`mobile: ${id} active film typography is lighter than desktop language`);
}

const browser=await chromium.launch({headless:true});
try{
  const desktop=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await desktop.newPage();await attachDiagnostics(page,'desktop');
  await page.goto(`http://127.0.0.1:${port}/tops/1975-1999`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.stage.native-carousel',{timeout:10000});
  assert(await page.locator('.era-screen').count()===7,'desktop: expected seven mounted Top screens');
  assert((await page.locator('.era-screen.is-active-top').getAttribute('data-top-id'))==='1975-1999','desktop: wrong initial active Top');
  await assertHeaderSystem(page);

  await page.locator('#eraNext').click();
  await waitForTop(page,'2000-2024');
  assert((await page.locator('.era-screen.is-active-top').getAttribute('data-top-id'))==='2000-2024','desktop: side arrow did not activate 2000–2024');

  const shared2000=page.locator('.era-screen[data-top-id="2000-2024"] .design-header-top5');
  await shared2000.locator('button').nth(1).hover();
  assert(await shared2000.evaluate(el=>el.classList.contains('is-previewing')),'desktop: shared Top 5 hover preview state did not activate');
  assert(await shared2000.locator('button').nth(1).evaluate(el=>el.classList.contains('is-preview')),'desktop: shared Top 5 hovered film did not become preview');
  await shared2000.locator('button').nth(1).click();
  assert(await shared2000.locator('button').nth(1).evaluate(el=>el.classList.contains('is-locked')),'desktop: shared Top 5 click did not lock the new film');

  await page.locator('.era-hud-current').click();
  assert(await page.locator('.era-hud').evaluate(el=>el.classList.contains('is-open')),'desktop: Top selector did not open');
  await page.locator('.era-hud-option[data-top-index="6"]').click();
  await waitForTop(page,'rewatched');
  assert((await page.locator('.era-hud-label').textContent()).trim().length>0,'desktop: selector label is empty');

  const active=page.locator('.era-screen.is-active-top');
  await active.locator('.sec').nth(1).locator('.toggle').click();
  await page.waitForTimeout(80);
  assert((await active.locator('.sec').nth(1).getAttribute('data-rendered'))==='1','desktop: lazy section did not render');
  const toggle=active.locator('.sec').nth(1).locator('.toggle');
  await toggle.click();await toggle.click();await toggle.click();
  await page.waitForTimeout(650);
  const secOpen=await active.locator('.sec').nth(1).evaluate(el=>el.classList.contains('open'));
  const h=await active.locator('.sec').nth(1).locator('.content').evaluate(el=>getComputedStyle(el).height);
  if(!secOpen)assert(h==='0px','desktop: closed section was reopened by a stale height timer');

  await active.locator('.tile').first().click();
  await page.waitForSelector('#modalBg.open',{timeout:10000});
  assert((await page.locator('#modalTitle').textContent()).trim().length>0,'desktop: modal title is empty');
  await page.locator('#modalClose').click();
  await page.waitForTimeout(50);
  assert(!(await page.locator('#modalBg').evaluate(el=>el.classList.contains('open'))),'desktop: modal did not close');

  for(const id of topIds){
    await page.goto(`http://127.0.0.1:${port}/tops/${id}`,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('.stage.native-carousel',{timeout:10000});
    const activeId=await page.locator('.era-screen.is-active-top').getAttribute('data-top-id');
    assert(activeId===id,`desktop: direct route ${id} activated ${activeId}`);
  }
  await desktop.close();

  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mpage=await mobile.newPage();await attachDiagnostics(mpage,'mobile');

  // Every mobile Top must use the exact desktop backdrop sources and the same title anchor.
  for(const id of topIds){
    await mpage.goto(`http://127.0.0.1:${port}/tops/${id}`,{waitUntil:'domcontentloaded'});
    await mpage.waitForSelector('.era-screen',{timeout:10000});
    assert(await mpage.locator('.era-screen').count()===1,`mobile: ${id} expected one mounted Top at rest`);
    assert(await mpage.locator('.design-header-system,.design-header-top5').count()===0,`mobile: ${id} desktop shared header skin leaked into mobile renderer`);
    await assertMobileCinemaHeader(mpage,id);
  }

  await mpage.goto(`http://127.0.0.1:${port}/tops/1975-1999`,{waitUntil:'domcontentloaded'});
  await mpage.waitForSelector('.era-screen.mobile-cinema-header',{timeout:10000});
  const mobileTitleBefore=(await mpage.locator('.mobile-cinema-film b').textContent()).trim();
  await mpage.locator('.mobile-cinema-tabs button').nth(1).click();
  await mpage.waitForTimeout(80);
  const mobileTitleAfter=(await mpage.locator('.mobile-cinema-film b').textContent()).trim();
  assert(mobileTitleAfter&&mobileTitleAfter!==mobileTitleBefore,'mobile: Top 5 selector did not update active film copy');
  assert(await mpage.locator('.mobile-cinema-layer[data-mobile-cinema-layer="1"]').evaluate(el=>el.classList.contains('is-active')),'mobile: Top 5 selector did not update active hero image');
  assert((await mpage.url()).includes('/tops/1975-1999'),'mobile: Top 5 interaction unexpectedly changed Top route');

  await mpage.locator('#eraNext').click();
  await waitForTop(mpage,'2000-2024');
  await mpage.waitForTimeout(520);
  assert(await mpage.locator('.era-screen').count()===1,'mobile: transition did not settle back to one screen');
  assert((await mpage.locator('.era-screen').getAttribute('data-top-id'))==='2000-2024','mobile: wrong Top after arrow navigation');

  const msec=mpage.locator('.era-screen .sec').nth(1);
  await msec.locator('.toggle').click();await mpage.waitForTimeout(80);
  assert((await msec.getAttribute('data-rendered'))==='1','mobile: lazy section did not render');
  await mpage.locator('.era-screen .tile').first().click();
  await mpage.waitForSelector('#modalBg.open',{timeout:10000});
  await mpage.locator('#modalClose').click();
  await mobile.close();
}finally{
  await browser.close();
  server.close();
}

if(failures.length){
  console.error('\nBrowser smoke failures');
  failures.forEach(f=>console.error(`✗ ${f}`));
  process.exit(1);
}
console.log('✓ Desktop + mobile browser smoke passed.');
