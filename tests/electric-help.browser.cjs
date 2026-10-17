const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto('http://127.0.0.1:8767/?dev=1');
 await p.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true);mission.restart();classroom.newSession();classroom.session.start();load(rooms.findIndex(r=>r.roulette));document.querySelector('#maze-notice').hidden=true;});
 assert(await p.locator('#paola-formula-open').isVisible());await p.locator('#paola-formula-open').click();await p.evaluate(()=>companions.finishDialogue());
 assert.equal(await p.locator('#paola-formula-content section').count(),7);assert(await p.locator('#paola-formula-content').isVisible());
 assert.equal(await p.evaluate(()=>classroom.session.state(rooms[index].id).assisted),false);
 await p.locator('.scene-view').screenshot({path:'/tmp/epik-paola-formulary.png'});
 await p.setViewportSize({width:390,height:844});await p.locator('.scene-view').screenshot({path:'/tmp/epik-paola-formulary-mobile.png'});
 await p.locator('#paola-formula-content section').last().scrollIntoViewIfNeeded();assert(await p.locator('#paola-close').isVisible());await p.locator('#paola-close').click();assert(await p.locator('#paola-dialog').isHidden());await p.locator('#paola-formula-open').click();await p.evaluate(()=>I18n.set('en'));assert.match(await p.locator('#paola-formula-content').innerText(),/Constant acceleration/);await p.evaluate(()=>I18n.set('es'));await p.keyboard.press('Escape');
 await p.setViewportSize({width:1280,height:900});
 for(const mode of ['normal','easy']){
  const outcome=await p.evaluate(async mode=>{
   EpikDifficulty.select(mode);load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true;await boss.stun.eric.decode();await boss.stun.sprite.decode();await boss.eric.decode();
   let attacks=0;boss.potions.tick=dt=>{attacks+=dt};boss.wave.tick=()=>{};
   boss.tick(boss.stun.interval-.01,{x:3,y:7.5},renderer,rooms[index],false);const noEarlySpawn=boss.stun.sparks.length===0;
   for(let n=0;n<5;n++)boss.potions.onEvent('throw');const noAttackSpawn=boss.stun.sparks.length===0;
   boss.tick(.02,{x:3,y:7.5},renderer,rooms[index],false);const launched=boss.stun.sparks.length===1;
   boss.tick(1.21,{x:3,y:7.5},renderer,rooms[index],false);const ready=boss.stun.ready;
   boss.potions.bottles=[{}];boss.potions.pools=[{}];boss.wave.phase='wave';boss.supernova.age=3;boss.supernova.used=true;
   Object.assign(player,{...boss.stun.landing,angle:0,pitch:.14,jumpHeight:0});boss.tick(.01,player,renderer,rooms[index],false);
   const atPickup={left:boss.stun.left,bottles:boss.potions.bottles.length,pools:boss.potions.pools.length,wave:boss.wave.phase,nova:boss.supernova.active},before=attacks;
   renderer.draw(rooms[index],player,false,0,0);boss.draw(renderer,player,renderer.actors);
   window.electricTest={bossTick:boss.tick.bind(boss),before};
   boss.tick(14.99,player,renderer,rooms[index],false);const paused=attacks===before;boss.tick(.02,player,renderer,rooms[index],false);const resumed=attacks>before;
   boss.tick(1,player,renderer,rooms[index],false);const single=boss.stun.sparks.length===0&&!boss.stun.active;
   boss.tick(boss.stun.interval-boss.stun.cycle+1.21,{x:3,y:7.5},renderer,rooms[index],false);const recurring=boss.stun.ready;
   const saved=boss.stun.snapshot();boss.stun.restore(saved);const same=JSON.stringify(saved)===JSON.stringify(boss.stun.snapshot());
   boss.resetAttacks();return {ready,atPickup,paused,resumed,single,same,recurring,launched,noAttackSpawn,noEarlySpawn,readyAfterDeath:boss.stun.ready};
  },mode);
  assert(outcome.ready);assert.deepEqual(outcome.atPickup,{left:15,bottles:0,pools:0,wave:'idle',nova:false});assert(outcome.paused&&outcome.resumed&&outcome.single&&outcome.same&&outcome.readyAfterDeath&&outcome.recurring&&outcome.launched&&outcome.noAttackSpawn&&outcome.noEarlySpawn,mode);
 }
 await p.evaluate(()=>{load(rooms.findIndex(r=>r.boss));document.querySelector('#maze-notice').hidden=true;Object.assign(player,{x:12,y:7.5,angle:0,pitch:.14});boss.stun.sparks=[];boss.stun.left=15;boss.stun.beam=.8;});
 await p.evaluate(async()=>{await boss.stun.eric.decode();await boss.stun.sprite.decode();await boss.eric.decode();renderer.draw(rooms[index],player,false,0,0);boss.draw(renderer,player,renderer.actors)});await p.locator('#game').screenshot({path:'/tmp/epik-electric-stun.png'});
 assert(await p.locator('#paola-formula-open').isHidden());
 // Exercise all three numerical families, independently checked expected choices.
 const questions=await p.evaluate(()=>{const g=new GardenGuardian(()=>{}),out=[];for(const id of ['circle','position','drone']){g.calculationId=id;for(const stage of [1,2]){g.stage=stage;const q=g.question;out.push([q.id,q.answer,q.hint]);}}return out});
 assert.deepEqual(questions.map(q=>q.slice(0,2)),[['calculation-circle','c'],['followup-circle','a'],['calculation-position','b'],['followup-position','c'],['calculation-drone','d'],['followup-drone','b']]);assert(questions.every(q=>q[2].length>50));
 const migrated=await p.evaluate(()=>{const g=new GardenGuardian(()=>{});g.arrived=true;g.stage=1;const old={...g.snapshot(),version:4,conceptVariants:[0,1],questionBags:[[1,2],[0,2],[]],draft:{choice:'distance'}};g.restore(old);return {stage:g.stage,id:g.question.id,draft:g.draft}});assert.equal(migrated.stage,1);assert(migrated.id.startsWith('calculation-'));assert.deepEqual(migrated.draft,{});
 // Prison frames are drawn with bounded source rectangles, preserving the anchor.
 await p.evaluate(async()=>{cinematics.play('intercepcion-espacial');await cinematics.ready;cinematics.time=34.2;cinematics.draw();});
 await p.locator('.scene-view').screenshot({path:'/tmp/epik-eric-prison-clean.png'});
 const names=await p.evaluate(()=>{const credits=cinematics.credits??=new EpikCredits();return credits.entries.flat(2).join(' ')});for(const name of ['José Luis Henriquez Mercado','Rodrigo Gamboa Goñi','Luis Manuel Rico Gutiérrez'])assert(names.includes(name));
 assert.deepEqual(errors,[]);console.log('PASS formula reference desktop/mobile and no AI penalty; 15-second interrupt in both modes, cleared hazards, resumed attacks and random interval recurring sparks and recovery; two calculation seals; credits and prison scene.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
