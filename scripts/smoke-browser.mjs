import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root=process.cwd();
const port=4173;
const topIds=['1975-1999','2000-2024','sci-fi-realiste','animation','biopics','documentaires','rewatched'];
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

const browser=await chromium.launch({headless:true});
try{
  // Desktop native carousel / routing / selector / modal / disclosure smoke.
  const desktop=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await desktop.newPage();await attachDiagnostics(page,'desktop');
  await page.goto(`http://127.0.0.1:${port}/tops/1975-1999`,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.stage.native-carousel',{timeout:10000});
  assert(await page.locator('.era-screen').count()===7,'desktop: expected seven mounted Top screens');
  assert((await page.locator('.era-screen.is-active-top').getAttribute('data-top-id'))==='1975-1999','desktop: wrong initial active Top');

  await page.locator('#eraNext').click();
  await waitForTop(page,'2000-2024');
  assert((await page.locator('.era-screen.is-active-top').getAttribute('data-top-id'))==='2000-2024','desktop: side arrow did not activate 2000–2024');

  await page.locator('.era-hud-current').click();
  assert(await page.locator('.era-hud').evaluate(el=>el.classList.contains('is-open')),'desktop: Top selector did not open');
  await page.locator('.era-hud-option[data-top-index="6"]').click();
  await waitForTop(page,'rewatched');
  assert((await page.locator('.era-hud-label').textContent()).trim().length>0,'desktop: selector label is empty');

  const active=page.locator('.era-screen.is-active-top');
  await active.locator('.sec').nth(1).locator('.toggle').click();
  await page.waitForTimeout(80);
  assert((await active.locator('.sec').nth(1).getAttribute('data-rendered'))==='1','desktop: lazy section did not render');
  // Rapid disclosure changes must settle in the requested state, not a stale timer state.
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

  // Every direct Top route must boot to the requested active screen without JS failure.
  for(const id of topIds){
    await page.goto(`http://127.0.0.1:${port}/tops/${id}`,{waitUntil:'domcontentloaded'});
    await page.waitForSelector('.stage.native-carousel',{timeout:10000});
    const activeId=await page.locator('.era-screen.is-active-top').getAttribute('data-top-id');
    assert(activeId===id,`desktop: direct route ${id} activated ${activeId}`);
  }
  await desktop.close();

  // Mobile keeps the validated transform carousel. Smoke its mount, arrow navigation,
  // disclosure, modal and route update without changing its gesture physics.
  const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mpage=await mobile.newPage();await attachDiagnostics(mpage,'mobile');
  await mpage.goto(`http://127.0.0.1:${port}/tops/1975-1999`,{waitUntil:'domcontentloaded'});
  await mpage.waitForSelector('.era-screen',{timeout:10000});
  assert(await mpage.locator('.era-screen').count()===1,'mobile: expected one mounted Top at rest');
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
