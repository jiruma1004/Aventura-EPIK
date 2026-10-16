const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/assets/audio/'))requests.push(r.url());});
 await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
 assert.deepEqual(await page.evaluate(()=>Object.entries(Sound.tracks).filter(([,t])=>t.getAttribute('src')).map(([name])=>name)),['grassland']);assert(requests.every(url=>url.includes('legende-du-royaume')));
 await page.evaluate(async()=>{document.querySelector('#epik-dev')?.close();document.querySelector('#story-name-box').hidden=true;prologue.started=true;prologue.step=3;prologue.renderPage();await prologue.images.ivan.decode();prologue.reveal()});
 assert(await page.evaluate(()=>prologue.posterDrawn));assert.equal(await page.locator('.missing-headline').isVisible(),false);
 await page.locator('#adventure-intro').screenshot({path:'/tmp/epik-newspaper-b-desktop.png'});
 await page.setViewportSize({width:390,height:844});await page.locator('#adventure-intro').screenshot({path:'/tmp/epik-newspaper-b-mobile.png'});
 // The opening track and current score load; future rooms stay source-less.
 await page.keyboard.press('Shift');await page.waitForFunction(()=>Sound.tracks.missing.readyState>=2,null,{polling:100});
 assert.deepEqual(await page.evaluate(()=>Object.entries(Sound.tracks).filter(([,t])=>t.getAttribute('src')).map(([name])=>name)),['grassland','missing']);
 for(const name of ['grassland','seal','maze','stand','ceremony','bridge']){
  const result=await page.evaluate(async name=>{Sound.selectBackground(name);const ok=await Sound.play(name,true);const t=Sound.tracks[name];return {ok,ready:t.readyState,duration:t.duration,loop:t.loop};},name);
  assert(result.ok&&result.ready>=2,name+' plays');assert(result.duration>0);if(name==='bridge')assert.equal(result.duration,2);else assert(result.loop);
 }
 await page.evaluate(()=>{document.querySelector('#music-volume').value='.25';document.querySelector('#music-volume-mute').checked=true;Sound.apply()});assert.equal(await page.evaluate(()=>Sound.tracks.ceremony.volume),0);
 await page.evaluate(()=>{Sound.toggle();Sound.selectBackground('corridor')});assert.equal(await page.evaluate(()=>Sound.tracks.corridor.getAttribute('src')),null);
 assert.deepEqual(errors,[]);console.log('PASS: only opening music fetched at startup, selected tracks decode/play/loop, mute and deferred loading preserved; approved poster renders on desktop/mobile.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
