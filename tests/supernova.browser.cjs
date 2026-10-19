const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const p=await b.newPage();await p.addInitScript(()=>requestAnimationFrame=()=>0);await p.goto((process.env.BASE_URL||'http://127.0.0.1:8769')+'/?dev=1');
 const data=await p.evaluate(()=>{
  document.querySelector('#epik-dev')?.close();prologue.finish(true);EpikDifficulty.select('normal');load(rooms.findIndex(r=>r.boss),'preview');
  let hits=0;boss.onEvent=()=>hits++;const playerTest={x:3,y:7.5,jumpHeight:1};
  boss.supernova.elapsed=boss.supernova.triggerAt-1;boss.tick(.5,playerTest,renderer,rooms[index],false);const early=boss.supernova.active;
  boss.tick(.5,playerTest,renderer,rooms[index],false);const triggered=boss.supernova.active;boss.supernova.age=2.5;boss.supernova.draw(renderer,playerTest,renderer.actors);
  const shake=renderer.canvas.style.transform;const pixel=Array.from(renderer.ctx.getImageData(0,0,1,1).data);boss.tick(.01,playerTest,renderer,rooms[index],false);const wave= boss.wave.phase;const attacks=boss.potions.bottles.length+boss.potions.pools.length;
  const noEarlySpark=boss.stun.sparks.length===0;boss.supernova.age=4.99;const stillBlind=boss.supernova.blind;boss.supernova.age=5;const released=!boss.supernova.blind;
  boss.supernova.age=5.5;const fading=boss.supernova.active;boss.supernova.age=6;const ended=!boss.supernova.active;
  for(let i=0;i<90;i++)boss.tick(.1,playerTest,renderer,rooms[index],false);
  boss.supernova.draw(renderer,playerTest,renderer.actors);const cleared=renderer.canvas.style.transform==='';
  boss.supernova.tick(boss.supernova.triggerAt);const repeated=boss.supernova.active;
  boss.resetAttacks();const reset=boss.supernova.elapsed===0&&!boss.supernova.used;
  const triggerAt=boss.supernova.triggerAt;const easy=new EricSupernova(false);easy.tick(1000);
  load(rooms.findIndex(r=>r.conceptual),'preview');maze.restoreCheckpoint(3);const checkpoint=maze.grace;
  maze.enterDungeon(playerTest,maze.doors[0]);const failure=maze.grace;maze.leaveDungeon();const returned=maze.grace;
  return {noEarlySpark,stillBlind,released,fading,ended,pixel,wave,early,triggered,triggerAt,shake,attacks,hits,cleared,repeated,reset,easy:easy.active,checkpoint,failure,returned,ratio:EpikDifficulty.profiles.easy.symbolInterval/EpikDifficulty.profiles.normal.symbolInterval};
 });
 assert(data.noEarlySpark);assert(data.stillBlind&&data.released&&data.fading&&data.ended);assert.deepEqual(data.pixel,[84,237,53,255]);assert.equal(data.wave,'wave');assert.equal(data.early,false);assert(data.triggered);assert(data.triggerAt>=120&&data.triggerAt<=180);assert(data.shake);assert.equal(data.attacks,0);assert.equal(data.hits,0);assert(data.cleared);assert(!data.repeated);assert(data.reset);assert(!data.easy);for(const k of ['checkpoint','failure','returned'])assert.equal(data[k],10);assert.equal(data.ratio,1.5625);
 const timing=await p.evaluate(()=>{
  const low=new EricSupernova(true,()=>0),high=new EricSupernova(true,()=>1),mid=new EricSupernova(true,()=>.5);
  mid.tick(149);const before=mid.used;mid.tick(20,true,0);const pending={used:mid.used,elapsed:mid.elapsed};const released=mid.tick(0,false,0);
  EpikDifficulty.select('normal');load(rooms.findIndex(r=>r.boss),'preview');const actor={x:3,y:7.5,jumpHeight:1};
  boss.supernova.triggerAt=150;boss.supernova.elapsed=149;boss.stun.left=2;boss.electrocute();boss.tick(1,actor,renderer,rooms[index],false);
  const during={used:boss.supernova.used,elapsed:boss.supernova.elapsed};boss.tick(1,actor,renderer,rooms[index],false);const after=boss.supernova.active;
  boss.stun.left=1;boss.electrocute();const interrupted=!boss.supernova.used&&!boss.supernova.active;boss.tick(1,actor,renderer,rooms[index],false);const resumed=boss.supernova.active;
  return {low:low.triggerAt,high:high.triggerAt,before,pending,released,during,after,interrupted,resumed};
 });
 assert.equal(timing.low,120);assert.equal(timing.high,180);assert(!timing.before);assert.deepEqual(timing.pending,{used:false,elapsed:169});assert(timing.released);assert.deepEqual(timing.during,{used:false,elapsed:150});assert(timing.after&&timing.interrupted&&timing.resumed);
 const balance=await p.evaluate(()=>{
 const result=[];for(const mode of ['normal','easy']){EpikDifficulty.select(mode);load(rooms.findIndex(r=>r.trial),'preview');const tile=trial.platforms()[0];const dimensions=[tile.w,tile.h];load(rooms.findIndex(r=>r.corridor),'preview');result.push({dimensions,hitbox:corridor.hitboxScale});}
 EpikDifficulty.select('normal');let hits=0;const w=new EricFlameWave(type=>{if(type==='hit')hits++});w.phase='wave';for(let i=0;i<50;i++)w.tick(.1,{x:10,jumpHeight:0});return {result,hits};
 });assert.deepEqual(balance.result[0].dimensions,[1.35,1.26]);balance.result[1].dimensions.forEach((v,i)=>assert(Math.abs(v-[1.575,1.47][i])<1e-10));assert.equal(balance.result[0].hitbox,.9);assert.equal(balance.result[1].hitbox,1);assert.equal(balance.hits,1);
 console.log('PASS: opaque green nova, synchronized damaging wave, normal-only hitbox/planks, cleanup/reset, 10s maze grace and easy spawn interval.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
