const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
 await page.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
 await page.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);load(rooms.findIndex(r=>r.roulette),'preview');document.querySelector('#maze-notice').hidden=true;});
 assert.equal(await page.locator('#hint-details,#problem-hint').count(),0);assert(!await page.locator('.source-note').innerText().then(t=>t.includes('Diez problemas')));
 for(let i=0;i<10;i++){const text=await page.evaluate(i=>{roulette.present(i);return EpikSolutions.text({room:rooms[index],roulette})},i);assert(text.includes('Solo te toca despejar'));}
 for(const method of ['world','reset']){
  const first=await page.evaluate(()=>{classroom.newSession();load(rooms.findIndex(r=>r.roulette),'preview');const before=roulette.requestReset();const ok=roulette.spin(),duplicate=roulette.spin();roulette.tick(4);return {before,ok,duplicate,id:roulette.current.id,spins:roulette.resetState.rouletteSpins}});
  assert.deepEqual({...first,id:0},{before:false,ok:true,duplicate:false,id:0,spins:1});assert(await page.locator('#reset-roulette').isEnabled());
  const second=await page.evaluate(method=>{if(method==='reset')document.querySelector('#reset-roulette').onclick();else roulette.spin();roulette.tick(4);return {id:roulette.current.id,spins:roulette.resetState.rouletteSpins}},method);
  assert.notEqual(second.id,first.id);assert.equal(second.spins,2);assert(await page.locator('#reset-roulette').isDisabled());
  const locked=await page.evaluate(()=>{const id=roulette.current.id;const spin=roulette.spin();document.querySelector('#reset-roulette').disabled=false;document.querySelector('#reset-roulette').onclick();load(rooms.findIndex(r=>r.roulette),'preview');return {id,after:roulette.current.id,spin,reset:roulette.requestReset()}});
  assert.deepEqual(locked,{id:second.id,after:second.id,spin:false,reset:false});assert(await page.locator('#reset-roulette').isDisabled());
  const restored=await page.evaluate(()=>{const saved=JSON.parse(JSON.stringify(classroom.session.recoverySnapshot()));classroom.newSession();classroom.session.restoreSnapshot(saved,0);load(rooms.findIndex(r=>r.roulette),'preview');return {id:roulette.current.id,spins:roulette.resetState.rouletteSpins,blocked:!roulette.spin()}});
  assert.deepEqual(restored,{id:second.id,spins:2,blocked:true});
 }
 assert.deepEqual(errors,[]);console.log('PASS: guided problems; only two total spins shared by world/reset button; duplicate clicks, room reload, recovery and new-session allowance.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
