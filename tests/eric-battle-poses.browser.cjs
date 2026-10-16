/* Visual preparation must not change attack deadlines, targeting, or difficulty. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:850}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
  await page.goto((process.env.BASE_URL||'http://127.0.0.1:8767')+'/?dev=1');
  await page.evaluate(()=>{document.querySelector('#epik-dev')?.close();prologue.finish(true)});
  for(const mode of ['normal','easy']){
   const result=await page.evaluate(async mode=>{
    EpikDifficulty.select(mode);load(rooms.findIndex(r=>r.boss));await boss.eric.decode();
    let laughs=0;const laugh=Sound.laugh;Sound.laugh=()=>laughs++;
    const p={x:4,y:7.5,jumpHeight:1},frames=[],bottles=[];
    const record=()=>{frames.push(boss.battleFrame());bottles.push(boss.potions.bottles.length)};
    boss.speechLeft=0;record();
    // Stop immediately before the existing attack time, then cross it.
    const first=boss.potions.nextThrow;boss.tick(first-.3,p,renderer,rooms[index],false);record();
    boss.tick(.30001,p,renderer,rooms[index],false);record();
    const deadline=boss.potions.nextThrow,thrownAt=boss.potions.time;
    boss.tick(.22,p,renderer,rooms[index],false);record();
    boss.tick(.3,p,renderer,rooms[index],false);boss.speechLeft=0;record();
    const speech=boss.speech;
    boss.wave.phase='warning';record();
    boss.resetAttacks();boss.speechLeft=0;record();
    boss.puzzle.cuts=[true,true];record();
    Sound.laugh=laugh;
    const canvas=document.createElement('canvas');canvas.width=384;canvas.height=320;const c=canvas.getContext('2d');
    const content=[];for(let frame=0;frame<8;frame++){
     c.clearRect(0,0,384,320);c.drawImage(RPGCast.textureFrame(boss.eric,frame,RPGCast.actionCell),0,0);
     const bytes=c.getImageData(0,0,384,320).data;let solid=0,clear=0;for(let i=3;i<bytes.length;i+=4){solid+=bytes[i]>160;clear+=bytes[i]===0}content.push({solid,clear});
    }
    return {frames,bottles,laughs,speech,interval:deadline-thrownAt,expectedInterval:EpikDifficulty.profile.potionInterval,content};
   },mode);
   assert.deepEqual(result.frames,[0,3,4,5,0,6,0,7],mode+' idle, windup, release, recovery, idle, flame, reset, fall');
   assert.deepEqual(result.bottles.slice(0,3),[0,0,1]);assert.equal(result.laughs,1);assert.match(result.speech,/Cuidado con la mezcla/);
   assert(Math.abs(result.interval-result.expectedInterval)<1e-8);
   assert(result.content.every(f=>f.solid>2000&&f.clear>10000),'All frames have visible art and transparent padding');
  }
  const out=path.resolve(__dirname,'../../cast-refresh-2026-10-16/previews');fs.mkdirSync(out,{recursive:true});
  await page.evaluate(async()=>{EpikDifficulty.select('normal');load(rooms.findIndex(r=>r.boss));await boss.eric.decode();Object.assign(player,{x:15,y:7.5,angle:0,pitch:.10,jumpHeight:0});boss.speechLeft=0;document.querySelector('#maze-notice').hidden=true;});
  for(const [frame,name] of [[0,'eric-parabola'],[3,'eric-prepara-pocion'],[4,'eric-lanza-pocion'],[6,'eric-invoca'],[7,'eric-cae']]){
   await page.evaluate(frame=>{const choose=boss.battleFrame;boss.battleFrame=()=>frame;renderer.draw(rooms[index],player,false,0,0,null,null);boss.draw(renderer,player,renderer.actors);boss.battleFrame=choose},frame);
   await page.locator('#game').screenshot({path:path.join(out,name+'.png')});
  }
  assert.deepEqual(errors,[]);console.log('PASS: both difficulties preserve attack timing; windup/release/laugh/recovery synchronized; reset, flame and fall poses; eight transparent frames and in-world previews.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
