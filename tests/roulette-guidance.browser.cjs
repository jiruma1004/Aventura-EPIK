const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
 await page.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);load(rooms.findIndex(r=>r.roulette),'preview');document.querySelector('#maze-notice').hidden=true;});
 assert.equal(await page.locator('#hint-details,#problem-hint').count(),0);assert(!await page.locator('.source-note').innerText().then(t=>t.includes('Diez problemas')));
 for(let i=0;i<10;i++){const text=await page.evaluate(i=>{roulette.present(i);return EpikSolutions.text({room:rooms[index],roulette})},i);assert(text.includes('Solo te toca despejar'));}
 // A real first reset succeeds. Re-enabling the DOM button cannot bypass the limit.
 await page.evaluate(()=>{document.querySelector('#answer-console').hidden=false});await page.locator('#reset-roulette').click();
 assert(await page.locator('#reset-roulette').isDisabled());assert.equal(await page.evaluate(()=>roulette.current),null);
 await page.evaluate(()=>{roulette.present(4);const b=document.querySelector('#reset-roulette');b.disabled=false;b.onclick();});assert.equal(await page.evaluate(()=>roulette.current.id),5);
 // Loading the room again and restoring a session preserve the consumed reset.
 await page.evaluate(()=>load(rooms.findIndex(r=>r.roulette),'preview'));assert(await page.locator('#reset-roulette').isDisabled());
 const state=await page.evaluate(()=>{const saved=JSON.parse(JSON.stringify(classroom.session.recoverySnapshot()));classroom.newSession();classroom.session.restoreSnapshot(saved,0);load(rooms.findIndex(r=>r.roulette),'preview');return classroom.session.state(rooms[index].id).rouletteResets;});assert.equal(state,1);assert(await page.locator('#reset-roulette').isDisabled());
 await page.evaluate(()=>{classroom.newSession();load(rooms.findIndex(r=>r.roulette),'preview')});assert(await page.locator('#reset-roulette').isEnabled());
 assert.deepEqual(errors,[]);console.log('PASS: all ten guided problems render without duplicate hint; one reset per session, guarded handler, reload/recovery preservation and new-session reset.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
