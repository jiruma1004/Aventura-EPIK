const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 try{
  const targets=[{url:process.env.EPIK_TEST_BASE_URL||'http://127.0.0.1:18867/?dev=1',encrypted:false}];
  if(process.env.EPIK_DEV_TEST_URL)targets.push({url:process.env.EPIK_DEV_TEST_URL,encrypted:true});
  for(const target of targets){
   const p=await browser.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));
   await p.addInitScript(()=>window.requestAnimationFrame=()=>0);
   await p.goto(target.url);
   let page=p;
   if(target.encrypted){
    await p.locator('#password').fill(process.env.EPIK_TEST_PASSWORD);
    await p.locator('#unlock button').click();await p.locator('iframe').waitFor();
    page=p.locator('iframe').contentFrame();
   }
   await page.locator('#epik-dev').waitFor();
   const ev=fn=>page.locator('#game').evaluate(fn);
   const roomIndex=await ev(()=>rooms.findIndex(r=>r.conceptual));
   for(const mode of ['easy','normal']){
    await page.locator('#dev-room').selectOption(String(roomIndex));
    await page.locator('#dev-difficulty').selectOption(mode);
    await page.locator('#dev-go').click();
    assert.equal(await ev(()=>mission.remaining),9000);
    await ev(()=>{
     document.querySelector('#maze-notice').hidden=true;
     for(let n=0;n<2;n++){
      const d=maze.doors.find(d=>d.stage===maze.stage&&d.correct);
      maze.choose(d,player);Object.assign(player,{x:d.x+5.3,y:d.y+.5});maze.tick(.016,player);
     }
     maze.choose(maze.doors.find(d=>d.stage===2&&!d.correct),player);
     die('ivan');respawn();
    });
    assert.equal(await ev(()=>maze.stage),2,'Death in dungeon retains latest checkpoint');
    assert.equal(await ev(()=>player.x),25.5);
    await ev(()=>{
     maze.choose(maze.doors.find(d=>d.stage===2&&!d.correct),player);
     maze.choose(maze.doors.find(d=>d.correct),player);
    });
    const stage=mode==='easy'?2:0;
    assert.equal(await ev(()=>maze.stage),stage);
    assert.equal(await ev(()=>player.x),mode==='easy'?25.5:await ev(()=>rooms[index].spawn.x));
    assert.equal(await ev(()=>maze.grace),10);
    assert.equal(await ev(()=>rooms[index].map[Math.floor(player.y)][Math.floor(player.x)]),0);
    await ev(()=>{die('ivan');respawn()});
    assert.equal(await ev(()=>maze.stage),stage,'Return must update the death checkpoint too');
    assert.equal(await ev(()=>player.x),mode==='easy'?25.5:await ev(()=>rooms[index].spawn.x));
    if(mode==='easy')assert.deepEqual(await ev(()=>[...maze.passed]),[0,1]);
    await p.keyboard.press('F2');await page.locator('#epik-dev').waitFor();
   }
   assert.deepEqual(errors,[]);
   console.log('PASS '+(target.encrypted?'encrypted developer':'student/local')+': 150 minutes, dungeon death, easy return, subsequent death, safe spawn, normal mode unchanged.');
   await p.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
