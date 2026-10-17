const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await page.goto(process.env.EPIK_TEST_URL||'http://127.0.0.1:8767/?dev=1');
  await page.evaluate(()=>document.querySelector('#epik-dev')?.close());
  assert.equal(await page.evaluate(()=>Sound.sceneTrack),'grassland');
  await page.locator('#story-student-name').fill('Prueba musical');await page.locator('input[value=normal]').check();
  await page.evaluate(()=>prologue.advance());
  for(const expected of ['villain','villain','missing','grassland']){
   await page.evaluate(()=>{prologue.reveal();prologue.advance()});
   assert.equal(await page.evaluate(()=>Sound.sceneTrack),expected);
  }
  await page.evaluate(()=>{window.grasslandPlayId=Sound.playIds.grassland;prologue.reveal();prologue.advance()});
  assert(await page.evaluate(()=>arrival.active));
  assert.equal(await page.evaluate(()=>Sound.playIds.grassland),await page.evaluate(()=>grasslandPlayId),'Carriage keeps the same track without restarting');
  await page.evaluate(()=>{arrival.finish();controlTutorial.finish(false);mission.restart();classroom.session.start();document.querySelector('#maze-notice').hidden=true;});
  assert.equal(await page.evaluate(()=>Sound.sceneTrack),'grassland');
  for(const [kind,track] of [['trial','grassland'],['roulette','seal'],['conceptual','maze'],['physics','music']]){
   await page.evaluate(kind=>load(rooms.findIndex(r=>r[kind])),kind);assert.equal(await page.evaluate(()=>Sound.sceneTrack),track);
  }
  for(const name of ['grassland','ceremony','seal','maze']){
   const result=await page.evaluate(async name=>{const a=Sound.prepare(name);await new Promise((resolve,reject)=>{if(a.readyState>=1)return resolve();a.addEventListener('loadedmetadata',resolve,{once:true});a.addEventListener('error',()=>reject(new Error(name+' decode error')),{once:true});a.load()});return {duration:a.duration,loop:a.loop,src:a.src};},name);
   assert(result.duration>0);assert(result.loop);if(name==='grassland')assert(new URL(result.src).pathname.endsWith('/legende-du-royaume.mp3'));
  }
  for(const id of ['ceremonia-ignitia','ceremonia-karla']){
   await page.evaluate(id=>cinematics.play(id),id);await page.evaluate(()=>cinematics.ready);assert.equal(await page.evaluate(()=>Sound.sceneTrack),'ceremony');
   await page.evaluate(()=>document.querySelector('#cinema-replay').click());assert.equal(await page.evaluate(()=>Sound.sceneTrack),'ceremony');await page.evaluate(()=>cinematics.close());
  }
  // The garden now replaces the old readiness prompt with a three-seal gate.
  await page.evaluate(()=>{load(rooms.findIndex(r=>r.corridor));document.querySelector('#maze-notice').hidden=true;Object.assign(player,{x:61.5,y:4.5,jumpHeight:0});corridor.tick(.001,player);document.querySelector('#eric-ready-yes').click()});
  assert.equal(await page.evaluate(()=>opened),false);
  await page.evaluate(()=>{for(let i=0;i<3;i++){document.querySelector('#guardian-form').elements.choice.value=corridor.guardian.question.answer;corridor.guardian.submit();if(i<2)document.querySelector('#guardian-next').click();}corridor.tick(1,player)});
  assert.equal(await page.evaluate(()=>opened),false);
  await page.evaluate(()=>corridor.tick(2,player));assert(await page.evaluate(()=>opened));
  await page.evaluate(()=>document.querySelector('#eric-ready-yes').click());assert(await page.evaluate(()=>opened));
  assert.deepEqual(errors,[]);console.log('PASS room music, MP3 metadata decode/loop, both ceremony routes/replay, animated three-seal gate and legacy button bypass guard.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
